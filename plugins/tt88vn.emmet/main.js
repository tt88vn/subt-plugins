// Emmet for SubT — expand abbreviations, wrap with abbreviation, tag balancing.
import * as E from "./emmet.js";
import { offsetAt, positionAt } from "./text.js";

const t = (vi, en) => subt.l10n({ vi, en });

const CSS_LANGS = new Set(["css", "scss", "less", "sass", "stylus", "postcss"]);
const JSX_LANGS = new Set(["javascriptreact", "typescriptreact", "jsx", "tsx"]);
const XML_LANGS = new Set(["xml", "xsl", "svg"]);

/** "html" or "css" at the caret: CSS files, or inside <style>…</style> / style="…" of an HTML file. */
function modeAt(ed, textBefore, lineBefore) {
  if (CSS_LANGS.has(ed.languageId)) return "css";
  const lower = textBefore.toLowerCase();
  const open = lower.lastIndexOf("<style");
  if (open >= 0 && open > lower.lastIndexOf("</style")) {
    const tagEnd = lower.indexOf(">", open);
    if (tagEnd >= 0) return "css";
  }
  if (/\bstyle\s*=\s*["'][^"']*$/.test(lineBefore)) return "css";
  return "html";
}

async function options(ed) {
  const style = await subt.settings.get("selfClosingStyle");
  return { jsx: JSX_LANGS.has(ed.languageId), xml: XML_LANGS.has(ed.languageId), selfClose: style === "xhtml" };
}

async function expand() {
  const ed = await subt.editor.active();
  if (!ed) return;
  const sel = await ed.getSelection();
  const line = (await ed.getLine(sel.end.line)) || "";
  let range, abbr;
  const selected = await ed.getSelectedText();
  if (selected && !selected.includes("\n")) {
    range = sel;
    abbr = selected;
  } else {
    const col = sel.end.character;
    const text = await ed.getText();
    const before = text.slice(0, offsetAt(text, sel.end));
    const mode = modeAt(ed, before, line.slice(0, col));
    const found = mode === "css" ? E.extractCssAbbreviation(line, col) : E.extractHtmlAbbreviation(line, col);
    if (!found) return notAbbreviation();
    range = { start: { line: sel.end.line, character: found.start }, end: sel.end };
    abbr = found.abbr;
    if (mode === "css") {
      const body = E.expandCss(abbr);
      if (body == null) return notAbbreviation(abbr);
      await ed.setSelection(range);
      await ed.insertSnippet(body);
      return;
    }
  }
  let body;
  try {
    body = E.expandHtml(abbr, await options(ed));
  } catch (e) {
    // Maybe a CSS abbreviation typed in a selection
    const css = E.expandCss(abbr);
    if (css == null) return notAbbreviation(abbr);
    body = css;
  }
  await ed.setSelection(range);
  await ed.insertSnippet(body);
}

function notAbbreviation(abbr) {
  return subt.window.setStatusMessage(abbr
    ? t(`Emmet: không hiểu "${abbr}"`, `Emmet: cannot expand "${abbr}"`)
    : t("Emmet: không có viết tắt trước con trỏ", "Emmet: no abbreviation before the caret"));
}

async function wrap() {
  const ed = await subt.editor.active();
  if (!ed) return;
  let sel = await ed.getSelection();
  const empty = sel.start.line === sel.end.line && sel.start.character === sel.end.character;
  if (empty) {
    // No selection: wrap the current line
    const l = (await ed.getLine(sel.start.line)) || "";
    sel = { start: { line: sel.start.line, character: 0 }, end: { line: sel.start.line, character: l.length } };
  }
  // Start at the first line's indentation so the snippet keeps it
  const first = (await ed.getLine(sel.start.line)) || "";
  const indent = /^[ \t]*/.exec(first)[0].length;
  if (sel.start.character <= indent) sel = { start: { line: sel.start.line, character: indent }, end: sel.end };
  await ed.setSelection(sel);
  const text = await ed.getSelectedText();
  if (!text.trim()) return subt.window.setStatusMessage(t("Hãy chọn văn bản cần bọc", "Select the text to wrap"));

  const last = (await subt.storage.get("lastWrap")) || "div";
  const abbr = await subt.window.showInputBox({
    prompt: t("Viết tắt Emmet để bọc (vd: ul>li*, div.box, a[href=#])", "Emmet abbreviation to wrap with (e.g. ul>li*, div.box)"),
    value: last,
  });
  if (!abbr) return;
  await subt.storage.set("lastWrap", abbr);

  const lines = dedent(text.split(/\r\n|\r|\n/));
  // Leave out empty lines when repeating (ul>li*)
  const wrapLines = /\*(?!\d)/.test(abbr) ? lines.filter((l) => l.trim()) : lines;
  let body;
  try {
    body = E.expandHtml(abbr, { ...(await options(ed)), wrap: wrapLines });
  } catch (e) {
    return notAbbreviation(abbr);
  }
  await ed.setSelection(sel);
  await ed.insertSnippet(body);
}

function dedent(lines) {
  const indents = lines.slice(1).filter((l) => l.trim()).map((l) => /^[ \t]*/.exec(l)[0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map((l, i) => (i === 0 ? l.trimStart() : l.slice(Math.min(min, /^[ \t]*/.exec(l)[0].length))));
}

// ─── Tag commands ───────────────────────────────────────────────────────────

async function tagContext() {
  const ed = await subt.editor.active();
  if (!ed) return null;
  const text = await ed.getText();
  const sel = await ed.getSelection();
  const from = offsetAt(text, sel.start), to = offsetAt(text, sel.end);
  return { ed, text, from, to, pairs: E.tagPairs(text) };
}

const toRange = (text, s, e) => ({ start: positionAt(text, s), end: positionAt(text, e) });

/** Select the tag content, then the whole tag, then the parent's content… (Emmet "Balance Outward"). */
async function balanceOutward() {
  const c = await tagContext();
  if (!c) return;
  const { ed, text, from, to, pairs } = c;
  // Candidate ranges, innermost first: inner content, then outer
  const ranges = [];
  for (const p of pairs) {
    if (!p.close) { ranges.push([p.open[0], p.open[1]]); continue; }
    ranges.push([p.open[1], p.close[0]], [p.open[0], p.close[1]]);
  }
  let best = null;
  for (const [s, e] of ranges) {
    if (s <= from && to <= e && (s < from || to < e) && (!best || e - s < best[1] - best[0])) best = [s, e];
  }
  if (!best) return subt.window.setStatusMessage(t("Không tìm thấy thẻ bao quanh", "No enclosing tag"));
  await ed.setSelection(toRange(text, best[0], best[1]));
}

async function goToMatchingPair() {
  const c = await tagContext();
  if (!c) return;
  const { ed, text, from, pairs } = c;
  const p = pairs.find((x) => x.close && ((from >= x.open[0] && from <= x.open[1]) || (from >= x.close[0] && from <= x.close[1])))
    || E.enclosingPair(pairs.filter((x) => x.close), from, from);
  if (!p) return subt.window.setStatusMessage(t("Không tìm thấy thẻ", "No tag found"));
  const inOpen = from >= p.open[0] && from <= p.open[1];
  const target = inOpen ? p.close[0] + 1 : p.open[0] + 1;
  const pos = positionAt(text, target);
  await ed.setSelection({ start: pos, end: pos });
}

async function removeTag() {
  const c = await tagContext();
  if (!c) return;
  const { ed, text, from, to, pairs } = c;
  const p = E.enclosingPair(pairs, from, to);
  if (!p) return subt.window.setStatusMessage(t("Không tìm thấy thẻ bao quanh", "No enclosing tag"));
  const edits = [{ range: toRange(text, p.open[0], p.open[1]), text: "" }];
  if (p.close) edits.unshift({ range: toRange(text, p.close[0], p.close[1]), text: "" });
  await ed.edit(edits);
}

async function updateTag() {
  const c = await tagContext();
  if (!c) return;
  const { ed, text, from, to, pairs } = c;
  const p = E.enclosingPair(pairs, from, to);
  if (!p) return subt.window.setStatusMessage(t("Không tìm thấy thẻ bao quanh", "No enclosing tag"));
  const name = await subt.window.showInputBox({ prompt: t("Tên thẻ mới", "New tag name"), value: p.name });
  if (!name || !/^[A-Za-z][\w:.-]*$/.test(name)) return;
  const openName = p.open[0] + 1;
  const edits = [{ range: toRange(text, openName, openName + p.name.length), text: name }];
  if (p.close) edits.push({ range: toRange(text, p.close[0] + 2, p.close[0] + 2 + p.name.length), text: name });
  await ed.edit(edits);
}

export function activate(context) {
  const reg = (id, fn) => context.subscriptions.push(subt.commands.register(id, fn));
  reg("emmet.expand", expand);
  reg("emmet.wrap", wrap);
  reg("emmet.balanceOutward", balanceOutward);
  reg("emmet.matchingPair", goToMatchingPair);
  reg("emmet.removeTag", removeTag);
  reg("emmet.updateTag", updateTag);
}
