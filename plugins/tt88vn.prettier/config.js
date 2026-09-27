// Prettier configuration files from the open folder (.prettierrc, .prettierrc.json/.yaml, package.json "prettier").

const NAMES = [".prettierrc", ".prettierrc.json", ".prettierrc.json5", ".prettierrc.yaml", ".prettierrc.yml", "package.json"];

/** Minimal YAML for flat .prettierrc files: `key: value` lines (strings, numbers, booleans). */
export function parseFlatYaml(text) {
  const out = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/\s+#.*$/, "");
    const m = /^([A-Za-z][\w-]*)\s*:\s*(.*?)\s*$/.exec(line);
    if (!m || /^\s/.test(raw)) continue;
    let v = m[2];
    if (v === "") continue;
    if (/^(true|false)$/.test(v)) v = v === "true";
    else if (/^-?\d+(\.\d+)?$/.test(v)) v = Number(v);
    else if (/^(["']).*\1$/.test(v)) v = v.slice(1, -1);
    out[m[1]] = v;
  }
  return out;
}

function parseConfig(name, text) {
  if (name === "package.json") {
    const pkg = JSON.parse(text);
    return pkg && typeof pkg.prettier === "object" ? pkg.prettier : null;
  }
  const s = text.trim();
  if (s.startsWith("{")) return JSON.parse(s.replace(/^\s*\/\/.*$/gm, "").replace(/,(\s*[}\]])/g, "$1"));
  return parseFlatYaml(text);
}

/** "*.md", "**\/*.{js,ts}", "src/**" → RegExp over a relative path. */
export function globToRegExp(glob) {
  let re = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*") {
      if (glob[i + 1] === "*") { re += glob[i + 2] === "/" ? "(?:.*/)?" : ".*"; i += glob[i + 2] === "/" ? 2 : 1; }
      else re += "[^/]*";
    } else if (c === "?") re += "[^/]";
    else if (c === "{") {
      const end = glob.indexOf("}", i);
      re += "(?:" + glob.slice(i + 1, end).split(",").map((x) => x.replace(/[.+^$()|[\]\\]/g, "\\$&")).join("|") + ")";
      i = end;
    } else re += c.replace(/[.+^$()|[\]\\]/g, "\\$&");
  }
  // A pattern without "/" matches the file name anywhere
  return new RegExp(glob.includes("/") ? `^${re}$` : `(?:^|/)${re}$`);
}

function applyOverrides(config, path) {
  const { overrides, ...base } = config;
  if (!Array.isArray(overrides) || !path) return base;
  let out = base;
  for (const o of overrides) {
    const files = [].concat(o.files || []);
    const excl = [].concat(o.excludeFiles || []);
    if (files.some((g) => globToRegExp(g).test(path)) && !excl.some((g) => globToRegExp(g).test(path))) out = { ...out, ...(o.options || {}) };
  }
  return out;
}

let cache = { at: 0, files: null };

/** Nearest config for `path` (relative to the open folder) → { options, source } or null. */
export async function findConfig(path) {
  const info = await subt.workspace.info();
  if (!info.hasFolder || !path) return null;
  const now = Date.now();
  if (!cache.files || now - cache.at > 30000) cache = { at: now, files: new Set(await subt.workspace.listFiles()) };
  const parts = path.split("/").slice(0, -1);
  for (let depth = parts.length; depth >= 0; depth--) {
    const dir = parts.slice(0, depth).join("/");
    for (const name of NAMES) {
      const file = dir ? `${dir}/${name}` : name;
      if (!cache.files.has(file)) continue;
      const text = await subt.workspace.readFile(file);
      if (text == null) continue;
      let config;
      try { config = parseConfig(name, text); } catch (e) { throw new Error(`${file}: ${e.message}`); }
      if (!config) continue; // package.json without "prettier"
      const rel = dir ? path.slice(dir.length + 1) : path;
      return { options: applyOverrides(config, rel), source: file };
    }
  }
  return null;
}
