// Linter — SublimeLinter-style checks on save, with a problem list and next/previous navigation.
import * as R from "./rules.js";

const t = (vi, en) => subt.l10n({ vi, en });
const msg = (p) => subt.l10n(p.message);
const ICON = { error: "✗", warning: "⚠", info: "ℹ" };

/** Last results per tab id. */
const results = new Map();

async function options() {
  const s = subt.settings;
  return {
    maxLineLength: (await s.get("maxLineLength")) || 0,
    todos: !!(await s.get("showTodos")),
    javascript: (await s.get("javascriptSyntax")) !== false,
    disabledRules: (await s.get("disabledRules")) || [],
  };
}

async function lintEditor(ed) {
  const text = await ed.getText();
  const problems = R.lint(text, ed.languageId, await options());
  results.set(ed.id, problems);
  return problems;
}

function summary(problems) {
  const count = (sev) => problems.filter((p) => p.severity === sev).length;
  const e = count("error"), w = count("warning"), i = count("info");
  const parts = [];
  if (e) parts.push(`${ICON.error} ${e} ${t("lỗi", e > 1 ? "errors" : "error")}`);
  if (w) parts.push(`${ICON.warning} ${w} ${t("cảnh báo", w > 1 ? "warnings" : "warning")}`);
  if (i) parts.push(`${ICON.info} ${i}`);
  return parts.join(" · ");
}

async function report(problems, quietWhenClean) {
  if (!problems.length) {
    if (!quietWhenClean) await subt.window.setStatusMessage(t("Linter: không có vấn đề ✓", "Linter: no problems ✓"), 2000);
    return;
  }
  const first = problems.find((p) => p.severity === "error") || problems[0];
  await subt.window.setStatusMessage(`Linter: ${summary(problems)} — ${t("dòng", "line")} ${first.line + 1}: ${msg(first)}`, 6000);
}

async function goTo(ed, p) {
  const line = Math.max(0, p.line);
  const end = p.endCol != null && p.endCol > p.col ? p.endCol : p.col;
  await ed.setSelection({ start: { line, character: p.col }, end: { line, character: end } });
}

async function showList() {
  const ed = await subt.editor.active();
  if (!ed) return;
  const problems = await lintEditor(ed);
  if (!problems.length) return report(problems, false);
  const items = problems.map((p) => ({
    label: `${ICON[p.severity]} ${msg(p)}`,
    description: `${t("dòng", "line")} ${p.line + 1}:${p.col + 1} · ${p.rule}`,
    p,
  }));
  const pick = await subt.window.showQuickPick(items, { placeholder: `Linter: ${summary(problems)}` });
  if (pick) await goTo(ed, pick.p);
}

async function step(dir) {
  const ed = await subt.editor.active();
  if (!ed) return;
  const problems = await lintEditor(ed);
  if (!problems.length) return report(problems, false);
  const sel = await ed.getSelection();
  const cur = sel.start;
  const after = (p) => p.line > cur.line || (p.line === cur.line && p.col > cur.character);
  const before = (p) => p.line < cur.line || (p.line === cur.line && p.col < cur.character);
  const p = dir > 0 ? (problems.find(after) || problems[0]) : ([...problems].reverse().find(before) || problems[problems.length - 1]);
  await goTo(ed, p);
  const index = problems.indexOf(p) + 1;
  await subt.window.setStatusMessage(`${ICON[p.severity]} ${msg(p)} (${index}/${problems.length})`, 5000);
}

async function fixWhitespace() {
  const ed = await subt.editor.active();
  if (!ed) return;
  const text = await ed.getText();
  const eol = (/\r\n|\r|\n/.exec(text) || ["\n"])[0];
  const md = ed.languageId === "markdown";
  const lines = R.splitLines(text).map((l) => (md && /\S {2}$/.test(l) ? l : l.replace(/[ \t]+$/, "")));
  while (lines.length > 1 && lines[lines.length - 1] === "" && lines[lines.length - 2] === "") lines.pop();
  let next = lines.join(eol);
  if (next && !next.endsWith(eol)) next += eol;
  if (next === text) return subt.window.setStatusMessage(t("Không có gì để sửa", "Nothing to fix"));
  // Only touch lines that changed (one undo step)
  const old = R.splitLines(text);
  const edits = [];
  lines.forEach((l, i) => {
    if (i < old.length && old[i] !== l) edits.push({ range: { start: { line: i, character: 0 }, end: { line: i, character: old[i].length } }, text: l });
  });
  if (lines.length < old.length) {
    const last = lines.length - 1;
    edits.push({ range: { start: { line: last, character: lines[last].length }, end: { line: old.length - 1, character: old[old.length - 1].length } }, text: "" });
  } else if (!/[\r\n]$/.test(text)) {
    const last = old.length - 1;
    edits.push({ range: { start: { line: last, character: old[last].length }, end: { line: last, character: old[last].length } }, text: eol });
  }
  await ed.edit(edits);
  await subt.window.setStatusMessage(t("Đã xóa khoảng trắng thừa", "Trailing whitespace removed"));
}

async function enabled() {
  const off = await subt.storage.get("disabled");
  return !off && (await subt.settings.get("lintOnSave")) !== false;
}

async function toggle() {
  const off = !(await subt.storage.get("disabled"));
  await subt.storage.set("disabled", off);
  await subt.window.setStatusMessage(off ? t("Linter: đã tắt kiểm tra khi lưu", "Linter: lint on save off") : t("Linter: đã bật kiểm tra khi lưu", "Linter: lint on save on"));
}

export function activate(context) {
  const reg = (id, fn) => context.subscriptions.push(subt.commands.register(id, fn));
  reg("linter.lint", showList);
  reg("linter.next", () => step(1));
  reg("linter.previous", () => step(-1));
  reg("linter.fixWhitespace", fixWhitespace);
  reg("linter.toggle", toggle);
  context.subscriptions.push(
    subt.events.onDidSave(async (ed) => {
      if (!(await enabled())) return;
      await report(await lintEditor(ed), true);
    }),
    subt.events.onDidOpen(async (ed) => {
      if (!(await enabled()) || !(await subt.settings.get("lintOnOpen"))) return;
      await report(await lintEditor(ed), true);
    }),
  );
}
