// Change Tracker — GitGutter-style change tracking against the last save (or the file as opened).
import * as D from "./diff.js";

const t = (vi, en) => subt.l10n({ vi, en });
const split = (s) => s.split(/\r\n|\r|\n/);

/** Baseline text per tab id. */
const baselines = new Map();
/** Last summary shown per tab (avoid repeating the same status message). */
const lastSummary = new Map();

async function compareWith() {
  return (await subt.settings.get("compareWith")) === "open" ? "open" : "save";
}

async function remember(ed, force) {
  if (!force && baselines.has(ed.id)) return;
  baselines.set(ed.id, await ed.getText());
}

async function changesOf(ed) {
  if (!baselines.has(ed.id)) {
    await remember(ed, true);
    await subt.window.setStatusMessage(t("Change Tracker: bắt đầu theo dõi tệp này từ bây giờ", "Change Tracker: tracking this file from now on"));
  }
  const base = split(baselines.get(ed.id));
  const cur = split(await ed.getText());
  return { base, cur, changes: D.diffLines(base, cur) };
}

const label = (c) => {
  const k = D.kind(c);
  const add = c.bEnd - c.bStart, del = c.aEnd - c.aStart;
  if (k === "added") return t(`+${add} dòng thêm`, `+${add} added`);
  if (k === "deleted") return t(`−${del} dòng xóa`, `−${del} deleted`);
  return t(`~${add} dòng sửa`, `~${add} modified`) + (add !== del ? ` (${del}→${add})` : "");
};

function summaryText(changes) {
  if (!changes.length) return t("Không có thay đổi", "No changes");
  const s = D.stats(changes);
  return t(`+${s.add} −${s.del} · ${s.hunks} đoạn thay đổi`, `+${s.add} −${s.del} · ${s.hunks} change(s)`);
}

async function openDiff(text, languageId = "diff") {
  await subt.commands.execute("file.newFile");
  const ed = await subt.editor.active();
  if (!ed) return;
  await ed.replaceAll(text);
  await ed.setLanguage(languageId).catch(() => {});
}

async function showDiff() {
  const ed = await subt.editor.active();
  if (!ed) return;
  const { base, cur, changes } = await changesOf(ed);
  if (!changes.length) return subt.window.setStatusMessage(t("Không có thay đổi", "No changes"));
  const name = ed.fileName || "untitled";
  const mode = await compareWith();
  const from = `${name} (${mode === "open" ? t("lúc mở", "as opened") : t("lần lưu cuối", "last save")})`;
  await openDiff(D.unified(base, cur, changes, { from, to: name, context: (await subt.settings.get("contextLines")) ?? 3 }));
}

/** Jump to the next / previous change (dir = ±1). */
async function step(dir) {
  const ed = await subt.editor.active();
  if (!ed) return;
  const { changes } = await changesOf(ed);
  if (!changes.length) return subt.window.setStatusMessage(t("Không có thay đổi", "No changes"));
  const line = (await ed.getSelection()).start.line;
  let idx;
  if (dir > 0) { idx = changes.findIndex((c) => c.bStart > line); if (idx < 0) idx = 0; }
  else {
    idx = -1;
    for (let i = changes.length - 1; i >= 0; i--) if (changes[i].bStart < line) { idx = i; break; }
    if (idx < 0) idx = changes.length - 1;
  }
  await goTo(ed, changes[idx]);
  await subt.window.setStatusMessage(`${idx + 1}/${changes.length}: ${label(changes[idx])}`);
}

async function goTo(ed, c) {
  const line = Math.min(c.bStart, Math.max(0, (await ed.refresh()).lineCount - 1));
  const lines = split(await ed.getText());
  const end = c.bEnd > c.bStart ? c.bEnd - 1 : line;
  await ed.setSelection({ start: { line, character: 0 }, end: { line: end, character: c.bEnd > c.bStart ? lines[end].length : 0 } });
}

async function list() {
  const ed = await subt.editor.active();
  if (!ed) return;
  const { base, cur, changes } = await changesOf(ed);
  if (!changes.length) return subt.window.setStatusMessage(t("Không có thay đổi", "No changes"));
  const preview = (c) => {
    const l = c.bEnd > c.bStart ? cur[c.bStart] : base[c.aStart];
    return (l || "").trim().slice(0, 80);
  };
  const items = changes.map((c) => ({ label: `${t("Dòng", "Line")} ${c.bStart + 1}: ${label(c)}`, detail: preview(c), c }));
  const pick = await subt.window.showQuickPick(items, { placeholder: summaryText(changes) });
  if (pick) await goTo(ed, pick.c);
}

/** Put back the baseline lines of the change under the caret (GitGutter "revert hunk"). */
async function revertChange() {
  const ed = await subt.editor.active();
  if (!ed) return;
  const { base, cur, changes } = await changesOf(ed);
  const sel = await ed.getSelection();
  const line = sel.start.line;
  const c = changes.find((x) => (x.bStart <= line && line < x.bEnd) || (x.bStart === x.bEnd && x.bStart === line))
    || changes.find((x) => x.bStart === x.bEnd && x.bStart === line + 1);
  if (!c) return subt.window.setStatusMessage(t("Con trỏ không nằm ở chỗ thay đổi", "No change at the caret"));
  const text = await ed.getText();
  const eol = (/\r\n|\r|\n/.exec(text) || ["\n"])[0];
  const old = base.slice(c.aStart, c.aEnd);
  let range, insert;
  if (c.bEnd > c.bStart) {
    // Replace current lines [bStart, bEnd) by the old ones (or remove them)
    const endLine = c.bEnd - 1;
    if (old.length) {
      range = { start: { line: c.bStart, character: 0 }, end: { line: endLine, character: cur[endLine].length } };
      insert = old.join(eol);
    } else if (c.bEnd < cur.length) {
      range = { start: { line: c.bStart, character: 0 }, end: { line: c.bEnd, character: 0 } };
      insert = "";
    } else {
      const prev = c.bStart - 1;
      range = { start: prev >= 0 ? { line: prev, character: cur[prev].length } : { line: 0, character: 0 }, end: { line: endLine, character: cur[endLine].length } };
      insert = "";
    }
  } else {
    // Deleted lines: insert them back before line bStart
    if (c.bStart < cur.length) { range = { start: { line: c.bStart, character: 0 }, end: { line: c.bStart, character: 0 } }; insert = old.join(eol) + eol; }
    else { const last = cur.length - 1; range = { start: { line: last, character: cur[last].length }, end: { line: last, character: cur[last].length } }; insert = eol + old.join(eol); }
  }
  await ed.edit([{ range, text: insert }]);
  await subt.window.setStatusMessage(t("Đã hoàn tác đoạn thay đổi", "Change reverted"));
}

async function setBaseline() {
  const ed = await subt.editor.active();
  if (!ed) return;
  await remember(ed, true);
  lastSummary.delete(ed.id);
  await subt.window.setStatusMessage(t("Đã đặt mốc so sánh là nội dung hiện tại", "Baseline set to the current text"));
}

async function diffWith(otherText, otherName) {
  const ed = await subt.editor.active();
  if (!ed) return;
  const cur = split(await ed.getText());
  const other = split(otherText);
  const changes = D.diffLines(other, cur);
  if (!changes.length) return subt.window.showMessage(t("Hai nội dung giống nhau", "The contents are identical"));
  await openDiff(D.unified(other, cur, changes, { from: otherName, to: ed.fileName || "untitled" }));
}

async function diffWithFile() {
  const info = await subt.workspace.info();
  if (!info.hasFolder) return subt.window.showError(t("Hãy mở một thư mục ở thanh bên trước", "Open a folder in the side bar first"));
  const files = await subt.workspace.listFiles();
  const pick = await subt.window.showQuickPick(files, { placeholder: t("So sánh với tệp…", "Compare with file…") });
  if (!pick) return;
  const text = await subt.workspace.readFile(pick);
  if (text == null) return subt.window.showError(t("Không đọc được tệp", "Could not read the file"));
  await diffWith(text, pick);
}

async function diffWithClipboard() {
  const text = await subt.clipboard.read();
  if (!text) return subt.window.setStatusMessage(t("Clipboard trống", "The clipboard is empty"));
  await diffWith(text, "clipboard");
}

async function summaryOnChange(ed) {
  if (!(await subt.settings.get("showSummary") ?? true)) return;
  if (!baselines.has(ed.id) || ed.lineCount > 20000) return;
  const { changes } = await changesOf(ed);
  const s = summaryText(changes);
  if (lastSummary.get(ed.id) === s) return;
  lastSummary.set(ed.id, s);
  await subt.window.setStatusMessage(s, 2500);
}

export async function activate(context) {
  const reg = (id, fn) => context.subscriptions.push(subt.commands.register(id, fn));
  reg("changes.diff", showDiff);
  reg("changes.next", () => step(1));
  reg("changes.previous", () => step(-1));
  reg("changes.list", list);
  reg("changes.revert", revertChange);
  reg("changes.setBaseline", setBaseline);
  reg("changes.diffWithFile", diffWithFile);
  reg("changes.diffWithClipboard", diffWithClipboard);

  // Tabs already open: use their current (saved) text as the baseline
  for (const ed of await subt.editor.all()) if (!ed.isDirty) await remember(ed, false);
  context.subscriptions.push(
    subt.events.onDidOpen((ed) => remember(ed, true)),
    subt.events.onDidSave(async (ed) => {
      if ((await compareWith()) === "save") { await remember(ed, true); lastSummary.delete(ed.id); }
    }),
    subt.events.onDidChangeText(summaryOnChange),
  );
}
