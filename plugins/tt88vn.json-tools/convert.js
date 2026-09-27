// JSON conversions and queries (pure functions, no SubT API).

// ─── JSONC → JSON ───────────────────────────────────────────────────────────

/** Remove // and /* *\/ comments and trailing commas (JSONC / JSON5-lite). String contents are kept. */
export function stripJsonc(s) {
  let out = "";
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === "\"" || c === "'") {
      // Copy a string (single quotes are turned into double quotes)
      let j = i + 1, body = "";
      while (j < s.length && s[j] !== c) {
        if (s[j] === "\\") { body += s[j] + (s[j + 1] ?? ""); j += 2; continue; }
        if (c === "'" && s[j] === "\"") { body += "\\\""; j++; continue; }
        body += s[j++];
      }
      out += "\"" + (c === "'" ? body.replace(/\\'/g, "'") : body) + "\"";
      i = j + 1;
    } else if (c === "/" && s[i + 1] === "/") {
      while (i < s.length && s[i] !== "\n") i++;
    } else if (c === "/" && s[i + 1] === "*") {
      const end = s.indexOf("*/", i + 2);
      i = end < 0 ? s.length : end + 2;
    } else if (c === ",") {
      // Trailing comma: next significant char closes the container
      let j = i + 1;
      for (;;) {
        while (j < s.length && /\s/.test(s[j])) j++;
        if (s[j] === "/" && s[j + 1] === "/") { while (j < s.length && s[j] !== "\n") j++; continue; }
        if (s[j] === "/" && s[j + 1] === "*") { const e = s.indexOf("*/", j + 2); j = e < 0 ? s.length : e + 2; continue; }
        break;
      }
      if (s[j] !== "}" && s[j] !== "]") out += c;
      i++;
    } else { out += c; i++; }
  }
  return out;
}

/** Parse JSON, falling back to JSONC. Throws the original JSON error when both fail. */
export function parseLoose(s) {
  try { return JSON.parse(s); } catch (e) {
    try { return JSON.parse(stripJsonc(s)); } catch (_) { throw e; }
  }
}

// ─── Formatting with short arrays kept on one line ──────────────────────────

export function formatCompact(value, indent = 2, maxWidth = 80) {
  const pad = typeof indent === "number" ? " ".repeat(indent) : indent;
  const one = (v) => JSON.stringify(v);
  const fmt = (v, depth) => {
    const cur = pad.repeat(depth), next = pad.repeat(depth + 1);
    if (Array.isArray(v)) {
      if (!v.length) return "[]";
      const flat = v.every((x) => x === null || typeof x !== "object");
      const line = "[" + v.map(one).join(", ") + "]";
      if (flat && cur.length + line.length <= maxWidth) return line;
      return "[\n" + v.map((x) => next + fmt(x, depth + 1)).join(",\n") + "\n" + cur + "]";
    }
    if (v && typeof v === "object") {
      const keys = Object.keys(v);
      if (!keys.length) return "{}";
      return "{\n" + keys.map((k) => next + one(k) + ": " + fmt(v[k], depth + 1)).join(",\n") + "\n" + cur + "}";
    }
    return one(v) ?? "null";
  };
  return fmt(value, 0);
}

// ─── YAML ───────────────────────────────────────────────────────────────────

const YAML_RESERVED = /^(true|false|yes|no|on|off|null|~|y|n)$/i;

function yamlString(s) {
  if (s === "") return "\"\"";
  const needsQuote = YAML_RESERVED.test(s) || /^[-+]?(\d[\d_]*\.?\d*([eE][-+]?\d+)?|\.\d+|0x[0-9a-fA-F]+|\.inf|\.nan)$/i.test(s) ||
    /^[\s\-?:,\[\]{}#&*!|>'"%@`]/.test(s) || /\s$/.test(s) || /: |\s#|[\u0000-\u001f]/.test(s) || s.endsWith(":");
  return needsQuote ? JSON.stringify(s) : s;
}

const yamlKey = (k) => (/^[A-Za-z_][\w.-]*$/.test(k) && !YAML_RESERVED.test(k) ? k : JSON.stringify(k));

function yamlScalar(v, depth, pad) {
  if (v === null || v === undefined) return "null";
  if (typeof v === "string") {
    if (v.includes("\n") && !/[\u0000-\u0009\u000b-\u001f]/.test(v)) {
      const ind = pad.repeat(depth + 1);
      const chomp = v.endsWith("\n") ? (v.endsWith("\n\n") ? "+" : "") : "-";
      const body = (chomp === "" ? v.slice(0, -1) : chomp === "+" ? v.replace(/\n$/, "") : v).split("\n");
      return "|" + chomp + (/^\s/.test(v) ? String(pad.length) : "") + "\n" + body.map((l) => (l ? ind + l : "")).join("\n");
    }
    return yamlString(v);
  }
  return String(v);
}

export function toYaml(value, indent = 2) {
  const pad = " ".repeat(indent);
  const isObj = (v) => v !== null && typeof v === "object";
  const emit = (v, depth) => {
    const ind = pad.repeat(depth);
    if (Array.isArray(v)) {
      if (!v.length) return ind + "[]";
      return v.map((x) => {
        if (isObj(x) && (Array.isArray(x) ? x.length : Object.keys(x).length)) {
          const inner = emit(x, depth + 1);
          // First line of the nested block goes right after "- "
          return ind + "- " + inner.slice(pad.length * (depth + 1));
        }
        return ind + "- " + (isObj(x) ? (Array.isArray(x) ? "[]" : "{}") : yamlScalar(x, depth, pad));
      }).join("\n");
    }
    if (isObj(v)) {
      const keys = Object.keys(v);
      if (!keys.length) return ind + "{}";
      return keys.map((k) => {
        const x = v[k];
        const key = ind + yamlKey(k) + ":";
        if (isObj(x) && (Array.isArray(x) ? x.length : Object.keys(x).length)) return key + "\n" + emit(x, Array.isArray(x) ? depth : depth + 1);
        if (isObj(x)) return key + " " + (Array.isArray(x) ? "[]" : "{}");
        return key + " " + yamlScalar(x, depth, pad);
      }).join("\n");
    }
    return ind + yamlScalar(v, depth, pad);
  };
  return emit(value, 0) + "\n";
}

// ─── XML ────────────────────────────────────────────────────────────────────

const xmlEsc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const xmlName = (k) => {
  let n = String(k).replace(/[^\w.-]/g, "_");
  if (!/^[A-Za-z_]/.test(n)) n = "_" + n;
  return n;
};

export function toXml(value, root = "root", indent = "  ") {
  const lines = ["<?xml version=\"1.0\" encoding=\"UTF-8\"?>"];
  const emit = (name, v, depth) => {
    const ind = indent.repeat(depth);
    if (Array.isArray(v)) {
      if (!v.length) { lines.push(`${ind}<${name}/>`); return; }
      for (const x of v) emit(name, x, depth);
      return;
    }
    if (v === null || v === undefined) { lines.push(`${ind}<${name}/>`); return; }
    if (typeof v === "object") {
      const keys = Object.keys(v);
      if (!keys.length) { lines.push(`${ind}<${name}/>`); return; }
      lines.push(`${ind}<${name}>`);
      for (const k of keys) emit(xmlName(k), v[k], depth + 1);
      lines.push(`${ind}</${name}>`);
      return;
    }
    lines.push(`${ind}<${name}>${xmlEsc(v)}</${name}>`);
  };
  if (Array.isArray(value)) {
    lines.push(`<${root}>`);
    for (const x of value) emit("item", x, 1);
    lines.push(`</${root}>`);
  } else emit(root, value, 0);
  return lines.join("\n") + "\n";
}

// ─── CSV ────────────────────────────────────────────────────────────────────

function flatten(obj, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

const csvCell = (v, sep) => {
  if (v === null || v === undefined) return "";
  const s = typeof v === "object" ? JSON.stringify(v) : String(v);
  return s.includes(sep) || /["\r\n]/.test(s) || /^\s|\s$/.test(s) ? "\"" + s.replace(/"/g, "\"\"") + "\"" : s;
};

/** Array of objects (nested objects flattened as "a.b") → CSV. */
export function toCsv(value, sep = ",") {
  const rows = Array.isArray(value) ? value : [value];
  const flat = rows.map((r) => (r && typeof r === "object" && !Array.isArray(r) ? flatten(r) : { value: r }));
  const cols = [];
  const seen = new Set();
  for (const r of flat) for (const k of Object.keys(r)) if (!seen.has(k)) { seen.add(k); cols.push(k); }
  return [cols.map((c) => csvCell(c, sep)).join(sep), ...flat.map((r) => cols.map((c) => csvCell(r[c], sep)).join(sep))].join("\n") + "\n";
}

export function parseCsv(text, sep) {
  if (!sep) {
    const first = text.split(/\r?\n/, 1)[0];
    const counts = [",", ";", "\t", "|"].map((c) => [c, first.split(c).length]);
    sep = counts.sort((a, b) => b[1] - a[1])[0][0];
  }
  const rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === "\"") { if (text[i + 1] === "\"") { cell += "\""; i++; } else q = false; }
      else cell += c;
    } else if (c === "\"" && cell === "") q = true;
    else if (c === sep) { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += c;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => !(r.length === 1 && r[0] === ""));
}

const typed = (s) => {
  if (/^-?(0|[1-9]\d*)(\.\d+)?([eE][-+]?\d+)?$/.test(s) && String(Number(s)) === s) return Number(s);
  if (s === "true") return true;
  if (s === "false") return false;
  if (s === "null") return null;
  return s;
};

/** CSV with a header row → array of objects ("a.b" headers become nested objects). */
export function csvToJson(text, { types = true } = {}) {
  const rows = parseCsv(text);
  if (!rows.length) return [];
  const [head, ...body] = rows;
  return body.map((r) => {
    const o = {};
    head.forEach((h, i) => {
      const v = types ? typed(r[i] ?? "") : (r[i] ?? "");
      const path = h.split(".");
      let cur = o;
      for (let k = 0; k < path.length - 1; k++) {
        if (typeof cur[path[k]] !== "object" || cur[path[k]] === null) cur[path[k]] = {};
        cur = cur[path[k]];
      }
      cur[path[path.length - 1]] = v;
    });
    return o;
  });
}

// ─── JSON Lines ─────────────────────────────────────────────────────────────

export const jsonLinesToArray = (text) => text.split(/\r?\n/).filter((l) => l.trim()).map((l, i) => {
  try { return JSON.parse(l); } catch (e) { throw new Error(`line ${i + 1}: ${e.message}`); }
});
export const arrayToJsonLines = (arr) => (Array.isArray(arr) ? arr : [arr]).map((x) => JSON.stringify(x)).join("\n") + "\n";

// ─── Query (JSONPath subset) ────────────────────────────────────────────────

/** Tokens of a path like `$.store.book[0].title`, `.items[*].name`, `..id`, `a["x y"][-1]`. */
export function parsePath(path) {
  const tokens = [];
  let s = path.trim();
  if (s.startsWith("$")) s = s.slice(1);
  let i = 0;
  while (i < s.length) {
    if (s.startsWith("..", i)) {
      i += 2;
      const m = /^([\w$-]+|\*)/.exec(s.slice(i));
      if (m) { tokens.push({ type: "deep", key: m[1] }); i += m[1].length; }
      else if (s[i] === "[") tokens.push({ type: "deep", key: null });
      else throw new Error(`bad path near "${s.slice(i - 2)}"`);
    } else if (s[i] === ".") {
      i++;
      const m = /^([\w$-]+|\*)/.exec(s.slice(i));
      if (!m) { if (i >= s.length) break; throw new Error(`bad path near ".${s.slice(i)}"`); }
      tokens.push(m[1] === "*" ? { type: "all" } : { type: "key", key: m[1] });
      i += m[1].length;
    } else if (s[i] === "[") {
      const end = s.indexOf("]", i);
      if (end < 0) throw new Error("missing ]");
      const inner = s.slice(i + 1, end).trim();
      i = end + 1;
      if (inner === "*") tokens.push({ type: "all" });
      else if (/^-?\d+$/.test(inner)) tokens.push({ type: "index", index: +inner });
      else if (/^-?\d*:-?\d*$/.test(inner)) { const [a, b] = inner.split(":"); tokens.push({ type: "slice", start: a === "" ? null : +a, end: b === "" ? null : +b }); }
      else if (/^(["']).*\1$/.test(inner)) tokens.push({ type: "key", key: inner.slice(1, -1) });
      else tokens.push({ type: "key", key: inner });
    } else {
      const m = /^[\w$-]+/.exec(s.slice(i));
      if (!m) throw new Error(`bad path near "${s.slice(i)}"`);
      tokens.push({ type: "key", key: m[0] });
      i += m[0].length;
    }
  }
  return tokens;
}

export function query(value, path) {
  let cur = [value];
  for (const t of parsePath(path)) {
    const next = [];
    for (const v of cur) {
      if (t.type === "key") { if (v && typeof v === "object" && !Array.isArray(v) && t.key in v) next.push(v[t.key]); }
      else if (t.type === "index") { if (Array.isArray(v)) { const i = t.index < 0 ? v.length + t.index : t.index; if (i >= 0 && i < v.length) next.push(v[i]); } }
      else if (t.type === "slice") { if (Array.isArray(v)) next.push(...v.slice(t.start ?? 0, t.end ?? v.length)); }
      else if (t.type === "all") { if (v && typeof v === "object") next.push(...Object.values(v)); }
      else if (t.type === "deep") {
        const walk = (x) => {
          if (!x || typeof x !== "object") return;
          if (t.key === "*" || t.key === null) next.push(...Object.values(x));
          else if (!Array.isArray(x) && t.key in x) next.push(x[t.key]);
          for (const y of Object.values(x)) walk(y);
        };
        walk(v);
      }
    }
    cur = next;
  }
  return cur;
}

// ─── Path at an offset ──────────────────────────────────────────────────────

/** JSONPath of the value at `offset` in JSON text, e.g. `$.users[2].name` (null when outside any value). */
export function pathAt(text, offset) {
  const stack = []; // { type: "obj" | "arr", key, index, expectKey }
  let i = 0;
  const fmt = () => "$" + stack.map((f) => (f.type === "arr" ? `[${f.index}]` : f.key == null ? "" :
    /^[A-Za-z_$][\w$]*$/.test(f.key) ? "." + f.key : `[${JSON.stringify(f.key)}]`)).join("");
  while (i < text.length && i < offset) {
    const c = text[i];
    const top = stack[stack.length - 1];
    if (c === "\"") {
      let j = i + 1, str = "";
      while (j < text.length && text[j] !== "\"") { if (text[j] === "\\") { str += text[j + 1]; j += 2; } else str += text[j++]; }
      if (top && top.type === "obj" && top.expectKey) top.key = str;
      if (j >= offset) return fmt();
      i = j + 1;
      continue;
    }
    if (c === "{") stack.push({ type: "obj", key: null, expectKey: true });
    else if (c === "[") stack.push({ type: "arr", index: 0 });
    else if (c === "}" || c === "]") stack.pop();
    else if (c === ":" && top && top.type === "obj") top.expectKey = false;
    else if (c === "," && top) { if (top.type === "arr") top.index++; else { top.expectKey = true; top.key = null; } }
    else if (c === "/" && text[i + 1] === "/") { while (i < text.length && text[i] !== "\n") i++; continue; }
    else if (c === "/" && text[i + 1] === "*") { const e = text.indexOf("*/", i + 2); i = e < 0 ? text.length : e + 2; continue; }
    i++;
  }
  return stack.length ? fmt() : null;
}
