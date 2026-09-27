// Bracket / quote pair finder that skips strings and comments (pure functions, no SubT API).

const OPEN = { "(": ")", "[": "]", "{": "}" };
const CLOSE = { ")": "(", "]": "[", "}": "{" };

// Comment and string syntax per language (VS Code language ids)
const C_LIKE = { line: ["//"], block: [["/*", "*/"]], quotes: "\"'" };
const SYNTAX = {
  javascript: { ...C_LIKE, quotes: "\"'`" }, typescript: { ...C_LIKE, quotes: "\"'`" },
  javascriptreact: { ...C_LIKE, quotes: "\"'`" }, typescriptreact: { ...C_LIKE, quotes: "\"'`" },
  java: C_LIKE, kotlin: C_LIKE, c: C_LIKE, cpp: C_LIKE, csharp: C_LIKE, swift: C_LIKE, dart: C_LIKE, groovy: C_LIKE,
  scss: C_LIKE, less: C_LIKE, rust: { line: ["//"], block: [["/*", "*/"]], quotes: "\"" },
  go: { line: ["//"], block: [["/*", "*/"]], quotes: "\"'`" }, php: { line: ["//", "#"], block: [["/*", "*/"]], quotes: "\"'`" },
  css: { line: [], block: [["/*", "*/"]], quotes: "\"'" }, json: { line: [], block: [], quotes: "\"" },
  jsonc: { line: ["//"], block: [["/*", "*/"]], quotes: "\"" },
  python: { line: ["#"], block: [], quotes: "\"'" }, ruby: { line: ["#"], block: [], quotes: "\"'`" },
  shellscript: { line: ["#"], block: [], quotes: "\"'`" }, yaml: { line: ["#"], block: [], quotes: "\"'" },
  perl: { line: ["#"], block: [], quotes: "\"'" }, r: { line: ["#"], block: [], quotes: "\"'" },
  powershell: { line: ["#"], block: [["<#", "#>"]], quotes: "\"'" }, makefile: { line: ["#"], block: [], quotes: "\"'" },
  dockerfile: { line: ["#"], block: [], quotes: "\"'" }, ini: { line: [";", "#"], block: [], quotes: "\"" },
  sql: { line: ["--"], block: [["/*", "*/"]], quotes: "\"'`" }, lua: { line: ["--"], block: [["--[[", "]]"]], quotes: "\"'" },
  html: { line: [], block: [["<!--", "-->"]], quotes: "" }, xml: { line: [], block: [["<!--", "-->"]], quotes: "" },
  markdown: { line: [], block: [["<!--", "-->"]], quotes: "`" }, plaintext: { line: [], block: [], quotes: "\"" },
  bat: { line: ["REM ", "::"], block: [], quotes: "\"" },
};

export function syntaxFor(languageId) {
  return SYNTAX[languageId] || C_LIKE;
}

/**
 * Scan `text` → { pairs: [{open, close, char}], strings: [{start, end, char}], unmatched: [offset] }.
 * open/close/start/end are offsets of the bracket / quote characters themselves.
 */
export function scan(text, languageId) {
  const syn = syntaxFor(languageId);
  const pairs = [], strings = [], unmatched = [];
  const stack = [];
  let i = 0;
  const n = text.length;
  outer: while (i < n) {
    const c = text[i];
    for (const lc of syn.line) {
      if (text.startsWith(lc, i)) {
        while (i < n && text[i] !== "\n" && text[i] !== "\r") i++;
        continue outer;
      }
    }
    for (const [a, b] of syn.block) {
      if (text.startsWith(a, i)) {
        const e = text.indexOf(b, i + a.length);
        i = e < 0 ? n : e + b.length;
        continue outer;
      }
    }
    if (syn.quotes.includes(c)) {
      // Python triple quotes
      const triple = languageId === "python" && text.startsWith(c + c + c, i);
      const q = triple ? c + c + c : c;
      let j = i + q.length;
      let closed = false;
      while (j < n) {
        if (text[j] === "\\") { j += 2; continue; }
        if (text.startsWith(q, j)) { closed = true; break; }
        // Single-line strings end at the line break (except template literals / triple quotes)
        if (!triple && c !== "`" && (text[j] === "\n" || text[j] === "\r")) break;
        j++;
      }
      if (closed) {
        strings.push({ start: i, end: j + q.length - 1, char: c });
        i = j + q.length;
      } else i++;
      continue;
    }
    if (OPEN[c]) stack.push({ at: i, char: c });
    else if (CLOSE[c]) {
      let k = stack.length - 1;
      while (k >= 0 && stack[k].char !== CLOSE[c]) k--;
      if (k < 0) unmatched.push(i);
      else {
        for (const s of stack.splice(k + 1)) unmatched.push(s.at);
        const o = stack.pop();
        pairs.push({ open: o.at, close: i, char: o.char });
      }
    }
    i++;
  }
  for (const s of stack) unmatched.push(s.at);
  return { pairs, strings, unmatched: unmatched.sort((a, b) => a - b) };
}

/** Pair whose bracket is right before or right after `offset` (like the caret touching a bracket). */
export function pairAtCaret(res, offset) {
  for (const p of res.pairs) if (p.open === offset || p.close === offset) return p;
  for (const p of res.pairs) if (p.open === offset - 1 || p.close === offset - 1) return p;
  return null;
}

/** Innermost pair (bracket or quote) enclosing [from, to] → { open, close, char, kind: "bracket" | "quote" }. */
export function enclosing(res, from, to, { quotes = true } = {}) {
  let best = null;
  const consider = (open, close, char, kind) => {
    if (open < from && to <= close && (!best || close - open < best.close - best.open)) best = { open, close, char, kind };
  };
  for (const p of res.pairs) consider(p.open, p.close, p.char, "bracket");
  if (quotes) for (const s of res.strings) consider(s.start, s.end, s.char, "quote");
  return best;
}

/** Grow the selection: content → content + brackets → parent content… Returns [from, to] or null. */
export function expandSelection(res, from, to) {
  const all = [
    ...res.pairs.map((p) => [p.open, p.close]),
    ...res.strings.map((s) => [s.start, s.end]),
  ];
  let best = null;
  for (const [o, c] of all) {
    const candidates = [[o + 1, c], [o, c + 1]];
    for (const [a, b] of candidates) {
      if (a <= from && to <= b && (a < from || to < b) && (!best || b - a < best[1] - best[0])) best = [a, b];
    }
  }
  return best;
}

export const PAIRS = [["(", ")"], ["[", "]"], ["{", "}"], ["<", ">"], ["\"", "\""], ["'", "'"], ["`", "`"]];
