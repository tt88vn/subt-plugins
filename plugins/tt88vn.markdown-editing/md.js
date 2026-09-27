// Markdown helpers (pure functions, no SubT API).

// ─── Inline toggles ─────────────────────────────────────────────────────────

/**
 * Toggle `marker` around the selection [from, to) of `text`.
 * Returns { text, from, to } for the replaced region, where from/to is the new selection.
 * Works on: the selection itself ("**a**" selected), markers just outside it, or the word at the caret.
 */
export function toggleWrap(text, from, to, marker) {
  const m = marker.length;
  // 1. Selection includes the markers
  const sel = text.slice(from, to);
  if (sel.length >= 2 * m && sel.startsWith(marker) && sel.endsWith(marker) && !isLonger(sel, marker)) {
    const inner = sel.slice(m, sel.length - m);
    return { text: text.slice(0, from) + inner + text.slice(to), from, to: from + inner.length };
  }
  // 2. Markers just outside the selection
  if (hasOutside(text, from, to, marker)) {
    return { text: text.slice(0, from - m) + sel + text.slice(to + m), from: from - m, to: to - m };
  }
  // 3. Empty selection inside a word: work on the word
  if (from === to) {
    const w = wordAt(text, from);
    if (w) {
      if (hasOutside(text, w[0], w[1], marker)) {
        return { text: text.slice(0, w[0] - m) + text.slice(w[0], w[1]) + text.slice(w[1] + m), from: from - m, to: from - m };
      }
      return { text: text.slice(0, w[0]) + marker + text.slice(w[0], w[1]) + marker + text.slice(w[1]), from: from + m, to: from + m };
    }
    return { text: text.slice(0, from) + marker + marker + text.slice(to), from: from + m, to: from + m };
  }
  // 4. Wrap (keep surrounding spaces outside the markers: "**word** ")
  const lead = /^\s*/.exec(sel)[0].length, trail = /\s*$/.exec(sel)[0].length;
  const a = from + lead, b = Math.max(a, to - trail);
  return { text: text.slice(0, a) + marker + text.slice(a, b) + marker + text.slice(b), from: a + m, to: b + m };
}

/** Is [from, to) directly surrounded by `marker`? "*" inside "**x**" is bold, not italic (odd run = italic). */
function hasOutside(text, from, to, marker) {
  const c = marker[0];
  if (marker !== c.repeat(marker.length)) return text.slice(from - marker.length, from) === marker && text.slice(to, to + marker.length) === marker;
  let k1 = 0, k2 = 0;
  while (from - k1 > 0 && text[from - k1 - 1] === c) k1++;
  while (text[to + k2] === c) k2++;
  const k = Math.min(k1, k2);
  if (marker.length === 1 && (c === "*" || c === "_")) return k % 2 === 1;
  return k >= marker.length;
}

// "**x**" is bold, not italic "*"
const isLonger = (s, marker) => marker.length === 1 && s.startsWith(marker + marker) && s.endsWith(marker + marker) && s.length >= 4;

function wordAt(text, i) {
  const re = /[\p{L}\p{N}_'-]/u;
  let a = i, b = i;
  while (a > 0 && re.test(text[a - 1])) a--;
  while (b < text.length && re.test(text[b])) b++;
  // "---" or "''" is not a word
  return a < b && /[\p{L}\p{N}]/u.test(text.slice(a, b)) ? [a, b] : null;
}

// ─── Line-level operations ──────────────────────────────────────────────────

export const HEADING = /^(\s{0,3})(#{1,6})(\s+|$)/;
export const LIST = /^(\s*)([-*+]|\d{1,9}[.)])(\s+)(\[[ xX]\]\s+)?/;

/** Change heading level by `delta` (+1 = more #, -1 = fewer). */
export function shiftHeading(line, delta) {
  const m = HEADING.exec(line);
  const level = m ? m[2].length : 0;
  const next = Math.max(0, Math.min(6, level + delta));
  return setHeading(line, next);
}

export function setHeading(line, level) {
  const m = HEADING.exec(line);
  const body = m ? line.slice(m[0].length) : line.replace(/^\s{0,3}/, "");
  const indent = m ? m[1] : /^\s{0,3}/.exec(line)[0];
  return level === 0 ? indent + body : indent + "#".repeat(level) + " " + body;
}

export function listKind(line) {
  const m = LIST.exec(line);
  if (!m) return null;
  if (m[4]) return "task";
  return /\d/.test(m[2]) ? "ordered" : "bullet";
}

/** Toggle `kind` ("bullet" | "ordered" | "task") on lines; returns new lines. */
export function toggleList(lines, kind, bullet = "-") {
  const content = lines.filter((l) => l.trim());
  const all = content.length > 0 && content.every((l) => listKind(l) === kind);
  let n = 0;
  return lines.map((l) => {
    if (!l.trim()) return l;
    const m = LIST.exec(l);
    const indent = m ? m[1] : /^\s*/.exec(l)[0];
    const body = m ? l.slice(m[0].length) : l.slice(indent.length);
    if (all) return indent + body;
    n++;
    if (kind === "bullet") return `${indent}${bullet} ${body}`;
    if (kind === "ordered") return `${indent}${n}. ${body}`;
    return `${indent}${bullet} [ ] ${body}`;
  });
}

/** [ ] ↔ [x]; a plain list item or line gets "- [ ] ". */
export function toggleTask(line, bullet = "-") {
  const m = LIST.exec(line);
  if (m && m[4]) {
    const done = /x/i.test(m[4]);
    return line.slice(0, m[0].length - m[4].length) + (done ? "[ ]" : "[x]") + m[4].slice(3) + line.slice(m[0].length);
  }
  if (m) return line.slice(0, m[0].length) + "[ ] " + line.slice(m[0].length);
  const indent = /^\s*/.exec(line)[0];
  return `${indent}${bullet} [ ] ${line.slice(indent.length)}`;
}

export function toggleQuote(lines) {
  const content = lines.filter((l) => l.trim());
  const all = content.length > 0 && content.every((l) => /^\s*>/.test(l));
  return lines.map((l) => (all ? l.replace(/^(\s*)>\s?/, "$1") : l.trim() || lines.length === 1 ? "> " + l : ">"));
}

/**
 * What to insert when pressing "new list item" at the end of `line`:
 * { insert } to add a new item, { clear: true } when the item is empty (ends the list), or null for a plain line.
 */
export function continueList(line) {
  const q = /^(\s*(?:>\s?)+)/.exec(line);
  const quote = q ? q[1] : "";
  const rest = line.slice(quote.length);
  const m = LIST.exec(rest);
  if (!m) {
    if (quote) return rest.trim() ? { insert: "\n" + quote } : { clear: true };
    return null;
  }
  if (!rest.slice(m[0].length).trim()) return { clear: true };
  let marker = m[2];
  const num = /^(\d+)([.)])$/.exec(marker);
  if (num) marker = String(+num[1] + 1) + num[2];
  return { insert: "\n" + quote + m[1] + marker + m[3] + (m[4] ? "[ ] " : "") };
}

// ─── Fenced code awareness ──────────────────────────────────────────────────

/** For each line: true when inside (or on the fence of) a ``` / ~~~ block. */
export function codeMask(lines) {
  const mask = new Array(lines.length).fill(false);
  let fence = null;
  for (let i = 0; i < lines.length; i++) {
    const m = /^\s{0,3}(`{3,}|~{3,})/.exec(lines[i]);
    if (fence) {
      mask[i] = true;
      if (m && m[1][0] === fence[0] && m[1].length >= fence.length && !lines[i].trim().slice(m[1].length).trim()) fence = null;
    } else if (m) { fence = m[1]; mask[i] = true; }
  }
  return mask;
}

/** Renumber every ordered list (keeps the first number of each list, handles nesting). */
export function renumber(lines) {
  const mask = codeMask(lines);
  const out = lines.slice();
  const counters = []; // stack of { indent, next }
  for (let i = 0; i < lines.length; i++) {
    if (mask[i]) { counters.length = 0; continue; }
    const l = lines[i];
    const m = /^(\s*)(\d{1,9})([.)])(\s+)/.exec(l);
    if (!l.trim()) {
      // A blank line ends a list unless the next non-blank line continues it (indented or another item)
      let j = i + 1;
      while (j < lines.length && !lines[j].trim()) j++;
      if (j >= lines.length || !/^\s+\S|^\s*(\d{1,9}[.)]|[-*+])\s/.test(lines[j])) counters.length = 0;
      continue;
    }
    if (!m) {
      const b = /^(\s*)[-*+]\s/.exec(l);
      const ind = b ? b[1].length : /^\s*/.exec(l)[0].length;
      while (counters.length && counters[counters.length - 1].indent > ind) counters.pop();
      if (b && counters.length && counters[counters.length - 1].indent === ind) counters.pop();
      if (!b && ind === 0) counters.length = 0;
      continue;
    }
    const ind = m[1].length;
    while (counters.length && counters[counters.length - 1].indent > ind) counters.pop();
    let c = counters[counters.length - 1];
    if (!c || c.indent !== ind) { c = { indent: ind, next: +m[2] }; counters.push(c); }
    out[i] = m[1] + c.next + m[3] + m[4] + l.slice(m[0].length);
    c.next++;
  }
  return out;
}

// ─── Headings, slugs and table of contents ──────────────────────────────────

export function headings(lines) {
  const mask = codeMask(lines);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (mask[i]) continue;
    const m = /^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/.exec(lines[i]);
    if (m) { out.push({ line: i, level: m[1].length, text: m[2] }); continue; }
    // Setext: "Title\n====="
    if (i + 1 < lines.length && lines[i].trim() && !mask[i + 1] && /^\s{0,3}(=+|-+)\s*$/.test(lines[i + 1]) && !LIST.test(lines[i]) && !/^\s*[>|]/.test(lines[i])) {
      out.push({ line: i, level: lines[i + 1].trim()[0] === "=" ? 1 : 2, text: lines[i].trim() });
    }
  }
  return out;
}

/** Plain text of a heading (links, emphasis and code markers removed). */
export function plainText(s) {
  return s.replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/!?\[([^\]]*)\]\[[^\]]*\]/g, "$1")
    .replace(/<[^>]+>/g, "").replace(/(\*\*|__|\*|_|~~|`)/g, "").trim();
}

/** GitHub style anchor. `seen` tracks duplicates ("a", "a-1"…). */
export function slug(s, seen) {
  let base = plainText(s).toLowerCase().replace(/[^\p{L}\p{M}\p{N}\s_-]/gu, "").replace(/\s/g, "-");
  let id = base;
  if (seen) {
    let n = seen.get(base) || 0;
    if (n) id = `${base}-${n}`;
    seen.set(base, n + 1);
  }
  return id;
}

export const TOC_START = "<!-- TOC -->", TOC_END = "<!-- /TOC -->";

export function buildToc(lines, { minLevel = 1, maxLevel = 6, bullet = "-", indent = "  ", skipLine = -1 } = {}) {
  const hs = headings(lines).filter((h) => h.level >= minLevel && h.level <= maxLevel && h.line !== skipLine);
  const seen = new Map();
  // Every heading takes part in duplicate numbering, even the ones left out of the TOC
  const all = headings(lines);
  const ids = new Map(all.map((h) => [h.line, slug(h.text, seen)]));
  const top = hs.length ? Math.min(...hs.map((h) => h.level)) : 1;
  return hs.map((h) => `${indent.repeat(h.level - top)}${bullet} [${plainText(h.text)}](#${ids.get(h.line)})`);
}

/** Replace the TOC between markers; returns new lines, or null when there are no markers. */
export function updateToc(lines, opts) {
  const mask = codeMask(lines);
  const s = lines.findIndex((l, i) => !mask[i] && l.trim().startsWith(TOC_START));
  if (s < 0) return null;
  let e = -1;
  for (let i = s + 1; i < lines.length; i++) if (!mask[i] && lines[i].trim().startsWith(TOC_END)) { e = i; break; }
  if (e < 0) return null;
  const toc = buildToc(lines, opts);
  return [...lines.slice(0, s + 1), "", ...toc, "", ...lines.slice(e)];
}

// ─── Tables ─────────────────────────────────────────────────────────────────

/** Display width: wide East Asian characters and emoji count 2, combining marks 0. */
export function width(s) {
  let w = 0;
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (/\p{M}/u.test(ch) || c === 0x200d || (c >= 0xfe00 && c <= 0xfe0f)) continue;
    if ((c >= 0x1100 && c <= 0x115f) || (c >= 0x2e80 && c <= 0xa4cf) || (c >= 0xac00 && c <= 0xd7a3) ||
      (c >= 0xf900 && c <= 0xfaff) || (c >= 0xfe30 && c <= 0xfe4f) || (c >= 0xff00 && c <= 0xff60) ||
      (c >= 0xffe0 && c <= 0xffe6) || (c >= 0x1f300 && c <= 0x1faff) || (c >= 0x20000 && c <= 0x3fffd)) w += 2;
    else w += 1;
  }
  return w;
}

export function isTableLine(l) {
  return /\|/.test(l) && l.trim() !== "";
}

export function splitRow(line) {
  let s = line.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|") && !s.endsWith("\\|")) s = s.slice(0, -1);
  const cells = [];
  let cur = "", code = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "\\" && s[i + 1] === "|") { cur += "\\|"; i++; continue; }
    if (c === "`") {
      let n = 1;
      while (s[i + n] === "`") n++;
      if (code === 0) code = n; else if (code === n) code = 0;
      cur += "`".repeat(n); i += n - 1; continue;
    }
    if (c === "|" && code === 0) { cells.push(cur.trim()); cur = ""; continue; }
    cur += c;
  }
  cells.push(cur.trim());
  return cells;
}

const isAlignRow = (cells) => cells.length > 0 && cells.every((c) => /^:?-+:?$/.test(c.replace(/\s/g, "")));

/** Pretty-print table lines. Returns the same lines when it is not a table. */
export function formatTable(lines) {
  const indent = /^\s*/.exec(lines[0])[0];
  const rows = lines.map(splitRow);
  const alignAt = rows.findIndex(isAlignRow);
  if (alignAt !== 1) return lines;
  const cols = Math.max(...rows.map((r) => r.length));
  for (const r of rows) while (r.length < cols) r.push("");
  const align = rows[1].map((c) => {
    const s = c.replace(/\s/g, "");
    return s.startsWith(":") && s.endsWith(":") ? "c" : s.endsWith(":") ? "r" : s.startsWith(":") ? "l" : "";
  });
  const widths = new Array(cols).fill(3);
  rows.forEach((r, i) => { if (i !== 1) r.forEach((c, j) => { widths[j] = Math.max(widths[j], width(c)); }); });
  const pad = (s, w, a) => {
    const d = w - width(s);
    if (a === "r") return " ".repeat(d) + s;
    if (a === "c") return " ".repeat(Math.floor(d / 2)) + s + " ".repeat(d - Math.floor(d / 2));
    return s + " ".repeat(d);
  };
  return rows.map((r, i) => {
    if (i === 1) {
      return indent + "| " + widths.map((w, j) => {
        const a = align[j];
        if (a === "c") return ":" + "-".repeat(w - 2) + ":";
        if (a === "r") return "-".repeat(w - 1) + ":";
        if (a === "l") return ":" + "-".repeat(w - 1);
        return "-".repeat(w);
      }).join(" | ") + " |";
    }
    return indent + "| " + r.map((c, j) => pad(c, widths[j], align[j])).join(" | ") + " |";
  });
}

/** Line ranges [start, end] of every table in the document (outside code blocks). */
export function tableBlocks(lines) {
  const mask = codeMask(lines);
  const out = [];
  let i = 0;
  while (i < lines.length) {
    if (!mask[i] && isTableLine(lines[i]) && i + 1 < lines.length && !mask[i + 1] && isAlignRow(splitRow(lines[i + 1]))) {
      let j = i + 2;
      while (j < lines.length && !mask[j] && isTableLine(lines[j])) j++;
      out.push([i, j - 1]);
      i = j;
    } else i++;
  }
  return out;
}

export function newTable(cols, rows, label = "Column") {
  const head = "| " + Array.from({ length: cols }, (_, i) => `\${${i + 1}:${label} ${i + 1}}`).join(" | ") + " |";
  const sep = "| " + Array.from({ length: cols }, () => "---").join(" | ") + " |";
  const body = Array.from({ length: rows }, () => "| " + Array.from({ length: cols }, () => "   ").join(" | ") + " |");
  return [head, sep, ...body].join("\n") + "\n$0";
}
