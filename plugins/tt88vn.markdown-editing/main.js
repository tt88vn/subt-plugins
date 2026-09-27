// MarkdownEditing for SubT — emphasis toggles, headings, lists, tables, table of contents.
import * as M from "./md.js";
import { offsetAt, positionAt, diffEdit } from "./text.js";

const t = (vi, en) => subt.l10n({ vi, en });
const esc = (s) => s.replace(/[\\$}]/g, (c) => "\\" + c);

async function editor() {
  const ed = await subt.editor.active();
  if (!ed) return null;
  return ed;
}

/** Replace the whole text with `after`, as a single minimal edit, then select [from, to) (offsets in `after`). */
async function apply(ed, before, after, from, to) {
  const e = diffEdit(before, after);
  if (e) await ed.edit([e]);
  if (from != null) await ed.setSelection({ start: positionAt(after, from), end: positionAt(after, to ?? from) });
}

// ─── Inline ─────────────────────────────────────────────────────────────────

async function wrapWith(markerSetting, fallback) {
  const ed = await editor();
  if (!ed) return;
  const marker = (markerSetting && (await subt.settings.get(markerSetting))) || fallback;
  const text = await ed.getText();
  const sel = await ed.getSelection();
  const r = M.toggleWrap(text, offsetAt(text, sel.start), offsetAt(text, sel.end), marker);
  await apply(ed, text, r.text, r.from, r.to);
}

async function link(image) {
  const ed = await editor();
  if (!ed) return;
  const sel = (await ed.getSelectedText()).trim();
  const bang = image ? "!" : "";
  if (/^(https?:\/\/|mailto:|www\.)\S+$/.test(sel)) await ed.insertSnippet(`${bang}[\${1:${image ? "alt" : "text"}}](${esc(sel)})$0`);
  else await ed.insertSnippet(`${bang}[${sel ? esc(sel) : "${1:" + (image ? "alt" : "text") + "}"}](\${${sel ? 1 : 2}:https://})$0`);
}

async function codeBlock() {
  const ed = await editor();
  if (!ed) return;
  const sel = await ed.getSelection();
  if (sel.start.line !== sel.end.line || sel.start.character !== sel.end.character) {
    // Whole lines
    const endLine = sel.end.character === 0 && sel.end.line > sel.start.line ? sel.end.line - 1 : sel.end.line;
    const last = (await ed.getLine(endLine)) || "";
    await ed.setSelection({ start: { line: sel.start.line, character: 0 }, end: { line: endLine, character: last.length } });
  }
  const body = await ed.getSelectedText();
  await ed.insertSnippet("```${1}\n" + (body ? esc(body) : "$0") + "\n```" + (body ? "$0" : ""));
}

// ─── Line operations ────────────────────────────────────────────────────────

/** Apply `fn(lines) → lines` to the selected lines (or the caret line). */
async function onLines(fn) {
  const ed = await editor();
  if (!ed) return;
  const text = await ed.getText();
  const sel = await ed.getSelection();
  const all = text.split(/\r\n|\r|\n/);
  const eol = (/\r\n|\r|\n/.exec(text) || ["\n"])[0];
  const sl = sel.start.line;
  const el = sel.end.character === 0 && sel.end.line > sl ? sel.end.line - 1 : sel.end.line;
  const before = all.slice(sl, el + 1);
  const after = await fn(before, { all, sl, el, ed });
  if (!after) return;
  const next = [...all.slice(0, sl), ...after, ...all.slice(el + 1)].join(eol);
  const empty = sel.start.line === sel.end.line && sel.start.character === sel.end.character;
  if (empty && after.length === 1) {
    // Keep the caret at the same place relative to the end of the line
    const col = Math.max(0, after[0].length - (before[0].length - sel.start.character));
    const from = offsetAt(next, { line: sl, character: 0 }) + col;
    return apply(ed, text, next, from);
  }
  const from = offsetAt(next, { line: sl, character: 0 });
  const to = from + after.join(eol).length;
  return apply(ed, text, next, from, to);
}

const bullet = async () => (await subt.settings.get("bullet")) || "-";

async function setHeadingPick() {
  const items = [0, 1, 2, 3, 4, 5, 6].map((n) => ({
    label: n === 0 ? t("Đoạn văn (bỏ tiêu đề)", "Paragraph (no heading)") : `${"#".repeat(n)} ${t("Tiêu đề", "Heading")} ${n}`,
    level: n,
  }));
  const pick = await subt.window.showQuickPick(items, { placeholder: t("Cấp tiêu đề", "Heading level") });
  if (!pick) return;
  await onLines((ls) => ls.map((l) => (l.trim() ? M.setHeading(l, pick.level) : l)));
}

async function newListItem() {
  const ed = await editor();
  if (!ed) return;
  const sel = await ed.getSelection();
  const line = (await ed.getLine(sel.end.line)) || "";
  const col = sel.end.character;
  const r = M.continueList(line.slice(0, col) + (col < line.length ? "x" : ""));
  if (!r) return ed.replaceSelection("\n");
  if (r.clear) {
    // Empty item: end the list (remove the marker)
    const stripped = line.replace(M.LIST, "$1").replace(/^(\s*(?:>\s?)*)>\s?$/, "$1").replace(/^\s+$/, "");
    await ed.edit([{ range: { start: { line: sel.end.line, character: 0 }, end: { line: sel.end.line, character: line.length } }, text: stripped }]);
    const p = { line: sel.end.line, character: stripped.length };
    return ed.setSelection({ start: p, end: p });
  }
  await ed.replaceSelection(r.insert);
}

async function renumber() {
  const ed = await editor();
  if (!ed) return;
  const text = await ed.getText();
  const eol = (/\r\n|\r|\n/.exec(text) || ["\n"])[0];
  const sel = await ed.getSelection();
  const next = M.renumber(text.split(/\r\n|\r|\n/)).join(eol);
  if (next === text) return subt.window.setStatusMessage(t("Danh sách đã đúng thứ tự", "Lists are already numbered"));
  await apply(ed, text, next, offsetAt(next, sel.end));
}

// ─── Tables ─────────────────────────────────────────────────────────────────

async function formatTables(all) {
  const ed = await editor();
  if (!ed) return;
  const text = await ed.getText();
  const eol = (/\r\n|\r|\n/.exec(text) || ["\n"])[0];
  const lines = text.split(/\r\n|\r|\n/);
  const sel = await ed.getSelection();
  let blocks = M.tableBlocks(lines);
  if (!all) blocks = blocks.filter(([s, e]) => sel.start.line >= s && sel.start.line <= e);
  if (!blocks.length) return subt.window.setStatusMessage(all ? t("Không có bảng nào", "No tables found") : t("Con trỏ không nằm trong bảng", "The caret is not in a table"));
  for (const [s, e] of blocks.slice().reverse()) lines.splice(s, e - s + 1, ...M.formatTable(lines.slice(s, e + 1)));
  const next = lines.join(eol);
  const line = Math.min(sel.start.line, lines.length - 1);
  // Keep the caret in the same cell: count pipes before it
  const oldLine = text.split(/\r\n|\r|\n/)[sel.start.line] || "";
  const pipes = (oldLine.slice(0, sel.start.character).match(/(?<!\\)\|/g) || []).length;
  let col = 0;
  if (pipes > 0) {
    let seen = 0;
    const nl = lines[line];
    for (col = 0; col < nl.length && seen < pipes; col++) if (nl[col] === "|" && nl[col - 1] !== "\\") seen++;
    if (nl[col] === " ") col++;
  }
  await apply(ed, text, next, offsetAt(next, { line, character: col }));
}

async function insertTable() {
  const ed = await editor();
  if (!ed) return;
  const v = await subt.window.showInputBox({ prompt: t("Số cột x số dòng", "Columns x rows"), value: "3x2" });
  if (!v) return;
  const m = /^\s*(\d+)\s*[x×*, ]\s*(\d+)\s*$/i.exec(v);
  if (!m) return subt.window.showError(t("Nhập dạng 3x2", "Use the form 3x2"));
  const cols = Math.max(1, Math.min(20, +m[1])), rows = Math.max(0, Math.min(100, +m[2]));
  await ed.insertSnippet(M.newTable(cols, rows, t("Cột", "Column")));
}

// ─── Headings & TOC ─────────────────────────────────────────────────────────

async function tocOptions() {
  return {
    minLevel: (await subt.settings.get("tocMinLevel")) || 1,
    maxLevel: (await subt.settings.get("tocMaxLevel")) || 6,
    bullet: await bullet(),
  };
}

async function toc() {
  const ed = await editor();
  if (!ed) return;
  const text = await ed.getText();
  const eol = (/\r\n|\r|\n/.exec(text) || ["\n"])[0];
  const lines = text.split(/\r\n|\r|\n/);
  const opts = await tocOptions();
  const updated = M.updateToc(lines, opts);
  if (updated) {
    const next = updated.join(eol);
    if (next !== text) await apply(ed, text, next);
    return subt.window.setStatusMessage(t("Đã cập nhật mục lục", "Table of contents updated"));
  }
  const sel = await ed.getSelection();
  const items = M.buildToc(lines, { ...opts, skipLine: sel.start.line });
  if (!items.length) return subt.window.setStatusMessage(t("Không có tiêu đề nào", "No headings found"));
  await ed.replaceSelection([M.TOC_START, "", ...items, "", M.TOC_END, ""].join(eol));
}

async function gotoHeading() {
  const ed = await editor();
  if (!ed) return;
  const lines = (await ed.getText()).split(/\r\n|\r|\n/);
  const hs = M.headings(lines);
  if (!hs.length) return subt.window.setStatusMessage(t("Không có tiêu đề nào", "No headings found"));
  const pick = await subt.window.showQuickPick(hs.map((h) => ({
    label: " ".repeat(h.level - 1) + M.plainText(h.text), description: `H${h.level} · ${h.line + 1}`, h,
  })), { placeholder: t("Tới tiêu đề…", "Go to heading…") });
  if (!pick) return;
  const p = { line: pick.h.line, character: 0 };
  await ed.setSelection({ start: p, end: p });
}

async function updateTocOnSave(ed) {
  if (ed.languageId !== "markdown") return;
  if ((await subt.settings.get("autoUpdateToc")) === false) return;
  const text = await ed.getText();
  if (!text.includes(M.TOC_START)) return;
  const eol = (/\r\n|\r|\n/.exec(text) || ["\n"])[0];
  const updated = M.updateToc(text.split(/\r\n|\r|\n/), await tocOptions());
  if (!updated) return;
  const next = updated.join(eol);
  const e = diffEdit(text, next);
  if (e) await ed.edit([e]);
}

export function activate(context) {
  const reg = (id, fn) => context.subscriptions.push(subt.commands.register(id, fn));
  reg("md.bold", () => wrapWith("boldMarker", "**"));
  reg("md.italic", () => wrapWith("italicMarker", "*"));
  reg("md.strikethrough", () => wrapWith(null, "~~"));
  reg("md.inlineCode", () => wrapWith(null, "`"));
  reg("md.codeBlock", codeBlock);
  reg("md.link", () => link(false));
  reg("md.image", () => link(true));
  reg("md.headingIncrease", () => onLines((ls) => ls.map((l) => (l.trim() ? M.shiftHeading(l, 1) : l))));
  reg("md.headingDecrease", () => onLines((ls) => ls.map((l) => (l.trim() ? M.shiftHeading(l, -1) : l))));
  reg("md.setHeading", setHeadingPick);
  reg("md.bulletList", async () => { const b = await bullet(); return onLines((ls) => M.toggleList(ls, "bullet", b)); });
  reg("md.orderedList", () => onLines((ls) => M.toggleList(ls, "ordered")));
  reg("md.taskList", async () => { const b = await bullet(); return onLines((ls) => M.toggleList(ls, "task", b)); });
  reg("md.toggleTask", async () => { const b = await bullet(); return onLines((ls) => ls.map((l) => (l.trim() ? M.toggleTask(l, b) : l))); });
  reg("md.blockquote", () => onLines((ls) => M.toggleQuote(ls)));
  reg("md.newListItem", newListItem);
  reg("md.renumber", renumber);
  reg("md.formatTable", () => formatTables(false));
  reg("md.formatAllTables", () => formatTables(true));
  reg("md.insertTable", insertTable);
  reg("md.toc", toc);
  reg("md.gotoHeading", gotoHeading);
  context.subscriptions.push(subt.events.onWillSave(updateTocOnSave));
}
