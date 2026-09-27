#!/usr/bin/env node
// SubT plugin registry builder.
//
//   node scripts/registry.mjs check              validate every plugin (used on pull requests)
//   node scripts/registry.mjs build <outDir>     validate, pack each plugin into <outDir>/<id>-<version>.subt-plugin
//                                               and write <outDir>/index.json
//
// No dependencies: runs on the Node.js that GitHub Actions ships.
import { createHash } from "node:crypto";
import { deflateRawSync } from "node:zlib";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const PLUGINS = join(ROOT, "plugins");
const REPO = process.env.GITHUB_REPOSITORY || "tt88vn/subt-plugins";
const HOST_API = [1, 0, 0]; // newest SubT plugin API this registry targets
const PERMISSIONS = new Set(["workspace.read", "workspace.write", "clipboard"]);
const MAX_TOTAL = 30 * 1024 * 1024, MAX_FILE = 10 * 1024 * 1024, MAX_FILES = 3000;

// ─── helpers ──────────────────────────────────────────────────────────────
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z.-]+))?$/;
const ID = /^[a-z0-9][a-z0-9-]*(\.[a-z0-9][a-z0-9-]*)+$/;
const MODS = new Set(["ctrl", "alt", "shift", "meta"]);
const NAMED = new Set(["enter", "tab", "space", "backspace", "delete", "escape", "up", "down", "left", "right", "home", "end",
  "pageup", "pagedown", "insert", ...Array.from({ length: 12 }, (_, i) => `f${i + 1}`), "/", "\\", ",", ".", ";", "'", "[", "]", "-", "=", "`"]);

const cmpSemver = (a, b) => {
  const pa = SEMVER.exec(a), pb = SEMVER.exec(b);
  for (let i = 1; i <= 3; i++) if (+pa[i] !== +pb[i]) return +pa[i] - +pb[i];
  if (pa[4] === pb[4]) return 0;
  if (!pa[4]) return 1;
  if (!pb[4]) return -1;
  return pa[4] < pb[4] ? -1 : 1;
};
const safePath = (p) => !!p && !p.startsWith("/") && !p.includes("\\") && !/^[A-Za-z]:/.test(p) && p.split("/").every((s) => s && s !== "." && s !== "..");
const isText = (v) => typeof v === "string" ? v.trim().length > 0 : v && typeof v === "object" && Object.values(v).some((x) => typeof x === "string" && x.trim());
const validKey = (key) => {
  const parts = key.toLowerCase().split("+").map((s) => s.trim());
  if (parts.some((p) => !p)) return false;
  const mods = parts.slice(0, -1), k = parts[parts.length - 1];
  if (mods.some((m) => !MODS.has(m)) || new Set(mods).size !== mods.length) return false;
  return ((k.length === 1 && /[a-z0-9]/.test(k)) || NAMED.has(k)) && (mods.length > 0 || /^f\d+$/.test(k));
};
// Is HOST_API accepted by a simple engines range (">=1.0.0", "^1.0.0", "1.x", "*", ranges joined by spaces)?
const engineOk = (range) => {
  const v = HOST_API.join(".");
  return range.split("||").some((alt) => alt.trim().replace(/(>=|<=|>|<|\^|~|=)\s+/g, "$1").split(/\s+/).filter(Boolean).every((c) => {
    if (c === "*" || c === "x") return true;
    const m = /^(>=|<=|>|<|\^|~|=)?v?(\d+|x|\*)(?:\.(\d+|x|\*))?(?:\.(\d+|x|\*))?$/.exec(c);
    if (!m) throw new Error(`invalid engines.subt range: ${range}`);
    const [, op = "", ...parts] = m;
    const nums = parts.map((p) => (p === undefined || p === "x" || p === "*" ? null : +p));
    const lo = [nums[0] ?? 0, nums[1] ?? 0, nums[2] ?? 0].join(".");
    const cmp = cmpSemver(v, lo);
    if (op === ">=") return cmp >= 0;
    if (op === ">") return cmp > 0;
    if (op === "<") return cmp < 0;
    if (op === "<=") return cmp <= 0;
    if (op === "^" || (op === "" && nums[1] === null)) return cmp >= 0 && HOST_API[0] === (nums[0] ?? HOST_API[0]);
    if (op === "~" || (op === "" && nums[2] === null)) return cmp >= 0 && HOST_API[0] === nums[0] && HOST_API[1] === (nums[1] ?? HOST_API[1]);
    return cmp === 0;
  }));
};

function listFiles(dir) {
  const out = [];
  const walk = (d) => {
    for (const name of readdirSync(d).sort()) {
      if (name === ".DS_Store" || name === ".git") continue;
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p); else out.push(relative(dir, p).split(sep).join("/"));
    }
  };
  walk(dir);
  return out;
}

// ─── validation (mirrors SubT's ManifestParser; the app re-validates on install) ─────────
function validate(dirName) {
  const dir = join(PLUGINS, dirName);
  const errors = [];
  const bad = (m) => errors.push(`${dirName}: ${m}`);
  const files = listFiles(dir);
  const fileSet = new Set(files);
  if (!fileSet.has("plugin.json")) { bad("missing plugin.json"); return { errors }; }
  let m;
  try { m = JSON.parse(readFileSync(join(dir, "plugin.json"), "utf8").replace(/^﻿/, "")); } catch (e) { bad(`plugin.json: ${e.message}`); return { errors }; }
  let total = 0;
  for (const f of files) {
    const size = statSync(join(dir, f)).size;
    total += size;
    if (!safePath(f)) bad(`unsafe file name: ${f}`);
    if (size > MAX_FILE) bad(`file too large (> 10 MB): ${f}`);
  }
  if (total > MAX_TOTAL) bad("plugin too large (> 30 MB)");
  if (files.length > MAX_FILES) bad("too many files");

  if (!ID.test(m.id || "")) bad(`invalid "id": ${m.id}`);
  if (m.id !== dirName) bad(`folder name must equal the id (${m.id})`);
  if (!SEMVER.test(m.version || "")) bad(`"version" must be semver: ${m.version}`);
  const engine = m.engines && m.engines.subt;
  if (!engine) bad(`missing "engines.subt"`);
  else { try { if (!engineOk(engine)) bad(`engines.subt ${engine} excludes SubT API ${HOST_API.join(".")}`); } catch (e) { bad(e.message); } }
  if (!isText(m.displayName)) bad(`missing "displayName"`);
  if (!isText(m.description)) bad(`missing "description" (shown in the registry)`);
  if (!m.license) bad(`missing "license"`);
  if (!m.author) bad(`missing "author"`);
  const need = (p, what) => { if (!safePath(p)) bad(`invalid path (${what}): ${p}`); else if (!fileSet.has(p)) bad(`file not found (${what}): ${p}`); };
  if (m.main) { need(m.main, "main"); if (!/\.m?js$/.test(m.main)) bad(`"main" must be a .js file`); }
  for (const p of m.permissions || []) if (!PERMISSIONS.has(p)) bad(`unsupported permission: ${p}`);
  for (const e of m.activationEvents || []) if (!/^(\*|onStartup|onCommand:.+|onLanguage:.+)$/.test(e)) bad(`invalid activation event: ${e}`);
  const c = m.contributes || {};
  const ids = new Set();
  for (const cmd of c.commands || []) {
    const id = cmd.id || cmd.command;
    if (!/^[A-Za-z0-9_.:-]+$/.test(id || "") || !isText(cmd.title)) bad(`invalid command: ${JSON.stringify(cmd)}`);
    if (ids.has(id)) bad(`duplicate command: ${id}`);
    ids.add(id);
  }
  if ((c.commands || []).length && !m.main) bad(`contributes commands but has no "main"`);
  for (const k of c.keybindings || []) if (!k.command || !validKey(k.key || "")) bad(`invalid keybinding: ${JSON.stringify(k)}`);
  for (const l of c.languages || []) if (!/^[a-z0-9][a-z0-9_+.-]*$/.test(l.id || "")) bad(`invalid language id: ${l.id}`);
  for (const s of c.syntaxes || []) {
    if (!s.language || !s.path) { bad("syntax needs language and path"); continue; }
    need(s.path, "syntax");
    if (s.languageConfiguration) need(s.languageConfiguration, "languageConfiguration");
    if (s.path.endsWith(".json") && fileSet.has(s.path)) {
      try { const g = JSON.parse(readFileSync(join(dir, s.path), "utf8")); if (!g.scopeName) bad(`grammar without scopeName: ${s.path}`); }
      catch (e) { bad(`${s.path}: ${e.message}`); }
    }
  }
  for (const t of c.themes || []) {
    if (!/^[a-z0-9][a-z0-9_+.-]*$/.test(t.id || "") || !t.path) { bad(`invalid theme: ${JSON.stringify(t)}`); continue; }
    need(t.path, "theme");
    if (t.path.endsWith(".json") && fileSet.has(t.path)) {
      try { JSON.parse(readFileSync(join(dir, t.path), "utf8")); } catch (e) { bad(`${t.path}: ${e.message}`); }
    }
  }
  for (const s of c.snippets || []) {
    if (!s.path) { bad("snippet needs path"); continue; }
    need(s.path, "snippets");
    if (fileSet.has(s.path)) {
      try {
        const o = JSON.parse(readFileSync(join(dir, s.path), "utf8"));
        for (const [name, v] of Object.entries(o)) if (!v || (!v.prefix) || v.body === undefined) bad(`${s.path}: snippet "${name}" needs prefix and body`);
      } catch (e) { bad(`${s.path}: ${e.message}`); }
    }
  }
  for (const s of c.settings || []) if (!s.key || !["string", "number", "boolean", "array", "object"].includes(s.type || "string")) bad(`invalid setting: ${JSON.stringify(s)}`);
  if (!m.main && !["commands", "keybindings", "languages", "syntaxes", "themes", "snippets", "settings"].some((k) => (c[k] || []).length))
    bad(`no "main" and nothing in "contributes"`);
  return { errors, manifest: m, files, dir };
}

// ─── deterministic zip (stored in a fixed order with a fixed timestamp → stable sha256) ───────
const CRC_TABLE = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = (buf) => { let c = 0xffffffff; for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };

function zip(dir, files) {
  const DOS_TIME = 0, DOS_DATE = (2024 - 1980) << 9 | 1 << 5 | 1; // 2024-01-01 00:00
  const locals = [], centrals = [];
  let offset = 0;
  for (const f of files) {
    const data = readFileSync(join(dir, f));
    const deflated = deflateRawSync(data, { level: 9 });
    const name = Buffer.from(f, "utf8");
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x0800, 6); local.writeUInt16LE(8, 8);
    local.writeUInt16LE(DOS_TIME, 10); local.writeUInt16LE(DOS_DATE, 12); local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(deflated.length, 18); local.writeUInt32LE(data.length, 22); local.writeUInt16LE(name.length, 26); local.writeUInt16LE(0, 28);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6); central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10); central.writeUInt16LE(DOS_TIME, 12); central.writeUInt16LE(DOS_DATE, 14); central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(deflated.length, 20); central.writeUInt32LE(data.length, 24); central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(offset, 42);
    locals.push(local, name, deflated);
    centrals.push(central, name);
    offset += local.length + name.length + deflated.length;
  }
  const cd = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, cd, end]);
}

// ─── main ───────────────────────────────────────────────────────────────────
const [mode = "check", outDir = "dist"] = process.argv.slice(2);
const dirs = existsSync(PLUGINS) ? readdirSync(PLUGINS).filter((d) => statSync(join(PLUGINS, d)).isDirectory()).sort() : [];
const results = dirs.map(validate);
const errors = results.flatMap((r) => r.errors);

// Changing a released plugin requires a version bump (released = present in the current index.json)
const previous = existsSync(join(ROOT, "index.json")) ? JSON.parse(readFileSync(join(ROOT, "index.json"), "utf8")) : { plugins: [] };
const released = new Map((previous.plugins || []).map((p) => [p.id, p]));
const packed = new Map();
for (const r of results) {
  if (r.errors.length) continue;
  const bytes = zip(r.dir, r.files);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  packed.set(r.manifest.id, { bytes, sha256 });
  const old = released.get(r.manifest.id);
  if (!old) continue;
  const c = cmpSemver(r.manifest.version, old.version);
  if (c < 0) errors.push(`${r.manifest.id}: version ${r.manifest.version} is lower than the released ${old.version}`);
  if (c === 0 && old.download && old.download.sha256 !== sha256)
    errors.push(`${r.manifest.id}: files changed but version is still ${old.version} — bump "version"`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n` + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
console.log(`✓ ${results.length} plugin(s) valid: ${results.map((r) => `${r.manifest.id}@${r.manifest.version}`).join(", ") || "(none)"}`);
if (mode !== "build") process.exit(0);

mkdirSync(outDir, { recursive: true });
const plugins = results.map((r) => {
  const m = r.manifest;
  const { bytes, sha256 } = packed.get(m.id);
  const file = `${m.id}-${m.version}.subt-plugin`;
  writeFileSync(join(outDir, file), bytes);
  const tag = `${m.id}-v${m.version}`;
  const c = m.contributes || {};
  return {
    id: m.id,
    version: m.version,
    displayName: m.displayName,
    description: m.description,
    author: m.author,
    license: m.license,
    engines: { subt: m.engines.subt },
    permissions: m.permissions || [],
    hasCode: !!m.main,
    contributes: Object.fromEntries(["commands", "keybindings", "languages", "syntaxes", "themes", "snippets", "settings"]
      .map((k) => [k, (c[k] || []).length]).filter(([, n]) => n > 0)),
    homepage: `https://github.com/${REPO}/tree/main/plugins/${m.id}`,
    tag,
    download: {
      url: `https://github.com/${REPO}/releases/download/${tag}/${file}`,
      sha256,
      size: bytes.length,
    },
  };
});
const index = { schema: 1, registry: REPO, plugins };
writeFileSync(join(outDir, "index.json"), JSON.stringify(index, null, 2) + "\n");
console.log(`packed ${plugins.length} plugin(s) into ${outDir}/`);
