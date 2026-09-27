// Lint rules (pure functions, no SubT API). A problem is { line, col, endCol?, severity, rule, message: {vi, en} }.
import { scan } from "./brackets.js";

const P = (line, col, severity, rule, vi, en, endCol) => ({ line, col, endCol, severity, rule, message: { vi, en } });

export function splitLines(text) {
  return text.split(/\r\n|\r|\n/);
}

function offsetToPos(text, off) {
  const before = text.slice(0, off);
  const lines = splitLines(before);
  return { line: lines.length - 1, col: lines[lines.length - 1].length };
}

// ─── Whitespace & file-level rules ──────────────────────────────────────────

export function whitespace(text, lines, { maxLineLength = 0, languageId = "" } = {}) {
  const out = [];
  const markdown = languageId === "markdown";
  let tabs = 0, spaces = 0;
  lines.forEach((l, i) => {
    const m = /[ \t]+$/.exec(l);
    // Markdown uses two trailing spaces as a line break
    if (m && l.trim() && !(markdown && m[0] === "  ")) out.push(P(i, m.index, "warning", "trailing-whitespace", "Khoảng trắng thừa cuối dòng", "Trailing whitespace", l.length));
    else if (m && !l.trim() && l.length) out.push(P(i, 0, "warning", "trailing-whitespace", "Dòng trống chứa khoảng trắng", "Whitespace on an empty line", l.length));
    const ind = /^[ \t]*/.exec(l)[0];
    // Tabs followed by spaces is alignment ("smart tabs", " * " in doc comments); a tab after a space is a mistake
    if (/ \t/.test(ind))
      out.push(P(i, 0, "warning", "mixed-indent", "Thụt lề lẫn tab và dấu cách", "Mixed tabs and spaces in indentation", ind.length));
    if (l.trim()) { if (ind.startsWith("\t")) tabs++; else if (ind.startsWith(" ")) spaces++; }
    if (maxLineLength > 0 && l.length > maxLineLength)
      out.push(P(i, maxLineLength, "warning", "max-line-length", `Dòng dài ${l.length} > ${maxLineLength} ký tự`, `Line is ${l.length} > ${maxLineLength} characters`));
    if (/^(<{7}|={7}|>{7})( |$)/.test(l)) out.push(P(i, 0, "error", "conflict-marker", "Dấu xung đột merge còn sót", "Leftover merge conflict marker", 7));
  });
  if (tabs && spaces && languageId !== "makefile") {
    const minority = tabs < spaces ? "\t" : " ";
    const where = lines.findIndex((l) => l.trim() && l.startsWith(minority));
    out.push(P(where, 0, "info", "indent-style", `Tệp dùng cả tab (${tabs} dòng) lẫn dấu cách (${spaces} dòng) để thụt lề`,
      `File indents with both tabs (${tabs} lines) and spaces (${spaces} lines)`));
  }
  if (text.length && !/[\r\n]$/.test(text)) out.push(P(lines.length - 1, lines[lines.length - 1].length, "info", "final-newline", "Thiếu dòng trống cuối tệp", "No newline at end of file"));
  return out;
}

export function todos(lines) {
  const out = [];
  lines.forEach((l, i) => {
    const m = /\b(TODO|FIXME|XXX|HACK)\b:?\s*(.*)/.exec(l);
    if (m) out.push(P(i, m.index, "info", "todo", `${m[1]}: ${m[2]}`, `${m[1]}: ${m[2]}`));
  });
  return out;
}

// ─── Brackets ───────────────────────────────────────────────────────────────

const BRACKET_LANGS = new Set(["javascript", "typescript", "javascriptreact", "typescriptreact", "java", "kotlin", "c", "cpp", "csharp",
  "go", "rust", "swift", "dart", "php", "css", "scss", "less", "json", "jsonc", "python", "groovy", "lua", "r", "perl", "sql"]);

export function brackets(text, languageId) {
  if (!BRACKET_LANGS.has(languageId)) return [];
  const res = scan(text, languageId);
  return res.unmatched.map((o) => {
    const p = offsetToPos(text, o);
    const c = text[o];
    const open = "([{".includes(c);
    return P(p.line, p.col, "error", "unmatched-bracket", open ? `Ngoặc "${c}" chưa được đóng` : `Ngoặc "${c}" không có ngoặc mở`,
      open ? `Unclosed "${c}"` : `Unexpected "${c}"`, p.col + 1);
  });
}

// ─── JSON ───────────────────────────────────────────────────────────────────

/** Validate JSON (optionally JSONC). Returns problems with exact positions, including duplicate keys. */
export function json(text, { comments = false } = {}) {
  const out = [];
  let i = 0;
  const n = text.length;
  const fail = (vi, en, at = i) => { const p = offsetToPos(text, Math.min(at, n)); throw P(p.line, p.col, "error", "json", vi, en, p.col + 1); };
  const ws = () => {
    for (;;) {
      while (i < n && /[ \t\r\n﻿]/.test(text[i])) i++;
      if (comments && text[i] === "/" && text[i + 1] === "/") { while (i < n && text[i] !== "\n") i++; continue; }
      if (comments && text[i] === "/" && text[i + 1] === "*") {
        const e = text.indexOf("*/", i + 2);
        if (e < 0) fail("Comment chưa đóng", "Unterminated comment");
        i = e + 2; continue;
      }
      if (!comments && text[i] === "/" && (text[i + 1] === "/" || text[i + 1] === "*")) fail("JSON không cho phép comment", "Comments are not allowed in JSON");
      return;
    }
  };
  const str = () => {
    const start = i++;
    let s = "";
    while (i < n && text[i] !== "\"") {
      const c = text[i];
      if (c === "\n" || c === "\r") fail("Chuỗi chưa đóng", "Unterminated string", start);
      if (c < " ") fail("Ký tự điều khiển trong chuỗi (dùng \\n, \\t…)", "Control character in string (use \\n, \\t…)");
      if (c === "\\") {
        const e = text[i + 1];
        if (e === "u") { if (!/^[0-9a-fA-F]{4}$/.test(text.slice(i + 2, i + 6))) fail("Escape \\u không hợp lệ", "Invalid \\u escape"); s += String.fromCharCode(parseInt(text.slice(i + 2, i + 6), 16)); i += 6; continue; }
        if (!"\"\\/bfnrt".includes(e)) fail(`Escape \\${e} không hợp lệ`, `Invalid escape \\${e}`);
        s += e; i += 2; continue;
      }
      s += c; i++;
    }
    if (i >= n) fail("Chuỗi chưa đóng", "Unterminated string", start);
    i++;
    return s;
  };
  const value = () => {
    ws();
    const c = text[i];
    if (c === "{") {
      i++;
      const keys = new Set();
      ws();
      if (text[i] === "}") { i++; return; }
      for (;;) {
        ws();
        if (text[i] === "}" && comments) { i++; return; }
        if (text[i] !== "\"") fail(text[i] === "'" ? "Khóa phải dùng nháy kép \"" : "Cần tên khóa trong nháy kép", text[i] === "'" ? "Keys need double quotes" : "Expected a quoted key");
        const at = i;
        const k = str();
        if (keys.has(k)) { const p = offsetToPos(text, at); out.push(P(p.line, p.col, "warning", "json-duplicate-key", `Khóa "${k}" bị lặp`, `Duplicate key "${k}"`, p.col + k.length + 2)); }
        keys.add(k);
        ws();
        if (text[i] !== ":") fail("Thiếu dấu \":\" sau khóa", "Expected \":\" after the key");
        i++;
        value();
        ws();
        if (text[i] === ",") {
          const comma = i;
          i++; ws();
          if (text[i] === "}" && !comments) fail("Dấu phẩy thừa trước \"}\"", "Trailing comma before \"}\"", comma);
          continue;
        }
        if (text[i] === "}") { i++; return; }
        fail(i >= n ? "Thiếu \"}\"" : "Thiếu dấu \",\" hoặc \"}\"", i >= n ? "Missing \"}\"" : "Expected \",\" or \"}\"");
      }
    }
    if (c === "[") {
      i++; ws();
      if (text[i] === "]") { i++; return; }
      for (;;) {
        ws();
        if (text[i] === "]" && comments) { i++; return; }
        value(); ws();
        if (text[i] === ",") {
          const comma = i;
          i++; ws();
          if (text[i] === "]" && !comments) fail("Dấu phẩy thừa trước \"]\"", "Trailing comma before \"]\"", comma);
          continue;
        }
        if (text[i] === "]") { i++; return; }
        fail(i >= n ? "Thiếu \"]\"" : "Thiếu dấu \",\" hoặc \"]\"", i >= n ? "Missing \"]\"" : "Expected \",\" or \"]\"");
      }
    }
    if (c === "\"") { str(); return; }
    const m = /^-?(0|[1-9]\d*)(\.\d+)?([eE][-+]?\d+)?/.exec(text.slice(i, i + 400));
    if (m && m[0] !== "-" && m[0]) { i += m[0].length; return; }
    for (const w of ["true", "false", "null"]) if (text.startsWith(w, i)) { i += w.length; return; }
    if (i >= n) fail("Thiếu giá trị", "Expected a value");
    if (c === "'") fail("JSON dùng nháy kép \" cho chuỗi", "JSON strings use double quotes");
    fail(`Giá trị không hợp lệ: ${JSON.stringify(text.slice(i, i + 10))}`, `Unexpected ${JSON.stringify(text.slice(i, i + 10))}`);
  };
  try {
    ws();
    if (i >= n) return out;
    value();
    ws();
    if (i < n) fail("Còn nội dung sau giá trị JSON", "Unexpected content after the JSON value");
  } catch (e) {
    if (e && e.rule) out.push(e); else throw e;
  }
  return out;
}

// ─── JavaScript (syntax only, compiled but never run) ───────────────────────

/** Blank out import/export syntax so a module can be compiled as a function body (keeps offsets). */
function moduleToScript(src) {
  const blank = (s) => s.replace(/[^\n]/g, " ");
  return src
    .replace(/^([ \t]*)import\s+(?:[\w*{}\s,$]+\s+from\s+)?(["'])[^"'\n]*\2\s*;?/gm, blank)
    .replace(/^([ \t]*)import\s+(?:type\s+)?\{[^}]*\}\s*from\s*(["'])[^"'\n]*\2\s*;?/gm, blank)
    .replace(/^([ \t]*)export\s+\{[^}]*\}(\s*from\s*(["'])[^"'\n]*\3)?\s*;?/gm, blank)
    .replace(/^([ \t]*)export\s+\*\s+(as\s+\w+\s+)?from\s*(["'])[^"'\n]*\3\s*;?/gm, blank)
    .replace(/\bimport\.meta\b/g, "import_meta")
    .replace(/^([ \t]*)export\s+default\s+/gm, (m) => m.replace(/export\s+default/, (x) => x.replace(/[^\n]/g, " ")))
    .replace(/^([ \t]*)export\s+(?=(async\s+)?function|class|const|let|var)/gm, blank);
}

export function javascript(text) {
  let AsyncFunction;
  try { AsyncFunction = Object.getPrototypeOf(async function () {}).constructor; } catch (_) { return []; }
  const src = moduleToScript(text.replace(/^#!.*/, (s) => " ".repeat(s.length)));
  try {
    new AsyncFunction(src); // compile only
    return [];
  } catch (e) {
    if (!(e instanceof SyntaxError)) return [];
    // Engines report the position differently: "line 3", ":3:5", or "(3:5)"
    const where = /<(?:input|anonymous|eval)[^>]*>:(\d+)(?::(\d+))?/.exec(e.stack || "") || /(?:line |:)(\d+)(?::(\d+))?/.exec(e.message) || /:(\d+):(\d+)/.exec(e.stack || "");
    let line = where ? +where[1] - 1 : 0;
    let col = where && where[2] ? +where[2] - 1 : 0;
    // new Function adds a header line in some engines ("async function anonymous(\n) {\n")
    const header = headerLines(AsyncFunction);
    line = Math.max(0, line - header);
    const lines = splitLines(text);
    if (line >= lines.length) line = lines.length - 1;
    if (col > lines[line].length) col = 0;
    return [P(line, col, "error", "js-syntax", `Lỗi cú pháp: ${e.message}`, `Syntax error: ${e.message}`)];
  }
}

let headerCache = null;
function headerLines(AsyncFunction) {
  if (headerCache != null) return headerCache;
  try { new AsyncFunction("\n\n)"); } catch (e) {
    const where = /<(?:input|anonymous|eval)[^>]*>:(\d+)/.exec(e.stack || "") || /(?:line |:)(\d+)/.exec(e.message);
    headerCache = where ? Math.max(0, +where[1] - 3) : 0;
    return headerCache;
  }
  headerCache = 0;
  return 0;
}

// ─── YAML (cheap checks) ────────────────────────────────────────────────────

export function yaml(lines) {
  const out = [];
  lines.forEach((l, i) => {
    const ind = /^[ \t]*/.exec(l)[0];
    if (ind.includes("\t")) out.push(P(i, ind.indexOf("\t"), "error", "yaml-tab", "YAML không cho phép tab để thụt lề", "Tabs are not allowed for YAML indentation", ind.length));
  });
  return out;
}

// ─── Entry point ────────────────────────────────────────────────────────────

export function lint(text, languageId, options = {}) {
  const lines = splitLines(text);
  const disabled = new Set(options.disabledRules || []);
  let out = [...whitespace(text, lines, { ...options, languageId })];
  if (languageId === "json") out.push(...json(text));
  else if (languageId === "jsonc") out.push(...json(text, { comments: true }));
  else {
    out.push(...brackets(text, languageId));
    // .js files with JSX (React) cannot be compiled as plain JavaScript
    if (languageId === "javascript" && options.javascript !== false && !/<\/[A-Za-z]|<[A-Z][\w.]*[\s/>]/.test(text)) {
      // Unmatched brackets already explain the syntax error
      if (!out.some((p) => p.rule === "unmatched-bracket")) out.push(...javascript(text));
    }
    if (languageId === "yaml") out.push(...yaml(lines));
  }
  if (options.todos) out.push(...todos(lines));
  out = out.filter((p) => !disabled.has(p.rule));
  const rank = { error: 0, warning: 1, info: 2 };
  return out.sort((a, b) => a.line - b.line || a.col - b.col || rank[a.severity] - rank[b.severity]);
}
