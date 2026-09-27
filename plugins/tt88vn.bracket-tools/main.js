// Bracket Tools — jump to / select / remove / change matching brackets and quotes (BracketHighlighter lite).
import * as B from "./brackets.js";
import { offsetAt, positionAt } from "./text.js";

const t = (vi, en) => subt.l10n({ vi, en });

async function context() {
  const ed = await subt.editor.active();
  if (!ed) return null;
  const text = await ed.getText();
  const sel = await ed.getSelection();
  const from = offsetAt(text, sel.start), to = offsetAt(text, sel.end);
  return { ed, text, from, to, res: B.scan(text, ed.languageId) };
}

const caret = (ed, text, off) => { const p = positionAt(text, off); return ed.setSelection({ start: p, end: p }); };
const select = (ed, text, a, b) => ed.setSelection({ start: positionAt(text, a), end: positionAt(text, b) });
const noPair = () => subt.window.setStatusMessage(t("Không tìm thấy cặp ngoặc", "No bracket pair found"));

/** Caret next to an opening bracket → after its closer; next to a closing bracket → before its opener. */
async function jump() {
  const c = await context();
  if (!c) return;
  const { ed, text, to, res } = c;
  let p = B.pairAtCaret(res, to);
  if (p) {
    const atOpen = p.open === to || p.open === to - 1;
    return caret(ed, text, atOpen ? p.close + 1 : p.open);
  }
  p = B.enclosing(res, to, to, { quotes: false });
  if (!p) return noPair();
  return caret(ed, text, p.close);
}

async function expand() {
  const c = await context();
  if (!c) return;
  const r = B.expandSelection(c.res, c.from, c.to);
  if (!r) return noPair();
  await select(c.ed, c.text, r[0], r[1]);
}

async function enclosingPair(c) {
  const p = B.pairAtCaret(c.res, c.from) && c.from === c.to ? B.pairAtCaret(c.res, c.from) : B.enclosing(c.res, c.from, c.to);
  if (!p) await noPair();
  return p;
}

async function remove() {
  const c = await context();
  if (!c) return;
  const p = await enclosingPair(c);
  if (!p) return;
  const { ed, text } = c;
  const r = (o) => ({ start: positionAt(text, o), end: positionAt(text, o + 1) });
  await ed.edit([{ range: r(p.close), text: "" }, { range: r(p.open), text: "" }]);
}

async function pickPair(placeholder) {
  const items = B.PAIRS.map(([a, b]) => ({ label: `${a} … ${b}`, pair: [a, b] }));
  const pick = await subt.window.showQuickPick(items, { placeholder });
  return pick && pick.pair;
}

async function change() {
  const c = await context();
  if (!c) return;
  const p = await enclosingPair(c);
  if (!p) return;
  const pair = await pickPair(t("Đổi thành…", "Change to…"));
  if (!pair) return;
  const { ed, text } = c;
  const r = (o) => ({ start: positionAt(text, o), end: positionAt(text, o + 1) });
  await ed.edit([{ range: r(p.open), text: pair[0] }, { range: r(p.close), text: pair[1] }]);
}

async function wrap() {
  const c = await context();
  if (!c) return;
  if (c.from === c.to) return subt.window.setStatusMessage(t("Hãy chọn văn bản cần bọc", "Select the text to wrap"));
  const pair = await pickPair(t("Bọc bằng…", "Wrap with…"));
  if (!pair) return;
  const { ed, text, from, to } = c;
  await ed.edit([{ range: { start: positionAt(text, from), end: positionAt(text, to) }, text: pair[0] + text.slice(from, to) + pair[1] }]);
  const after = text.slice(0, from) + pair[0] + text.slice(from, to) + pair[1] + text.slice(to);
  await select(ed, after, from + 1, to + 1);
}

/** Tell where the matching bracket is (handy when it is off screen). */
async function showMatch() {
  const c = await context();
  if (!c) return;
  const { text, to, res } = c;
  const p = B.pairAtCaret(res, to) || B.enclosing(res, to, to, { quotes: false });
  if (!p) return noPair();
  const touching = B.pairAtCaret(res, to) === p;
  const atOpen = p.open === to || p.open === to - 1;
  const other = touching ? (atOpen ? p.close : p.open) : p.open;
  const pos = positionAt(text, other);
  const line = text.split(/\r\n|\r|\n/)[pos.line].trim();
  await subt.window.showMessage(t(`Dòng ${pos.line + 1}: ${line}`, `Line ${pos.line + 1}: ${line}`));
}

async function unmatched() {
  const c = await context();
  if (!c) return;
  const { ed, text, res } = c;
  if (!res.unmatched.length) return subt.window.setStatusMessage(t("Mọi ngoặc đều khớp ✓", "All brackets are matched ✓"));
  const lines = text.split(/\r\n|\r|\n/);
  const items = res.unmatched.map((o) => {
    const p = positionAt(text, o);
    return { label: `${text[o]}  ${lines[p.line].trim().slice(0, 80)}`, description: t(`dòng ${p.line + 1}`, `line ${p.line + 1}`), o };
  });
  const pick = await subt.window.showQuickPick(items, { placeholder: t(`${items.length} ngoặc không khớp`, `${items.length} unmatched bracket(s)`) });
  if (pick) await caret(ed, text, pick.o);
}

export function activate(context) {
  const reg = (id, fn) => context.subscriptions.push(subt.commands.register(id, fn));
  reg("brackets.jump", jump);
  reg("brackets.expand", expand);
  reg("brackets.remove", remove);
  reg("brackets.change", change);
  reg("brackets.wrap", wrap);
  reg("brackets.showMatch", showMatch);
  reg("brackets.unmatched", unmatched);
}
