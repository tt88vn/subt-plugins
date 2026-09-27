// JSON Tools — extras for SubT's built-in Pretty JSON: YAML / XML / CSV / JSON Lines, JSONPath queries, JSONC cleanup.
import * as C from "./convert.js";

const t = (vi, en) => subt.l10n({ vi, en });

/** Selection, or the whole text: { ed, text, whole }. */
async function source() {
  const ed = await subt.editor.active();
  if (!ed) return null;
  const sel = await ed.getSelectedText();
  if (sel.trim()) return { ed, text: sel, whole: false };
  return { ed, text: await ed.getText(), whole: true };
}

async function parse(src) {
  try {
    return { value: C.parseLoose(src.text) };
  } catch (e) {
    await subt.window.showError(t(`JSON không hợp lệ: ${e.message}`, `Invalid JSON: ${e.message}`));
    return null;
  }
}

async function indent() {
  const n = await subt.settings.get("indent");
  return typeof n === "number" && n >= 0 && n <= 8 ? n : 2;
}

/** Show a result in a new tab (default) or in place of the source, per the "output" setting. */
async function output(src, text, languageId) {
  const where = (await subt.settings.get("output")) || "newTab";
  if (where === "replace") {
    if (src.whole) await src.ed.replaceAll(text); else await src.ed.replaceSelection(text);
    if (src.whole) await src.ed.setLanguage(languageId).catch(() => {});
    return;
  }
  await subt.commands.execute("file.newFile");
  const ed = await subt.editor.active();
  if (!ed) return;
  await ed.replaceAll(text);
  await ed.setLanguage(languageId).catch(() => {});
}

function convert(fn, languageId) {
  return async () => {
    const src = await source();
    if (!src) return;
    const p = await parse(src);
    if (!p) return;
    try {
      await output(src, await fn(p.value), languageId);
    } catch (e) {
      await subt.window.showError(e.message);
    }
  };
}

async function csvToJson() {
  const src = await source();
  if (!src) return;
  const value = C.csvToJson(src.text, { types: (await subt.settings.get("csvTypes")) !== false });
  await output(src, JSON.stringify(value, null, await indent()) + "\n", "json");
}

async function jsonLinesToArray() {
  const src = await source();
  if (!src) return;
  try {
    await output(src, JSON.stringify(C.jsonLinesToArray(src.text), null, await indent()) + "\n", "json");
  } catch (e) {
    await subt.window.showError(t(`JSON Lines không hợp lệ: ${e.message}`, `Invalid JSON Lines: ${e.message}`));
  }
}

async function query() {
  const src = await source();
  if (!src) return;
  const p = await parse(src);
  if (!p) return;
  const last = (await subt.storage.get("lastQuery")) || "$";
  const path = await subt.window.showInputBox({
    prompt: t("JSONPath, vd: $.items[*].name · ..id · [0:3]", "JSONPath, e.g. $.items[*].name · ..id · [0:3]"),
    value: last,
  });
  if (path == null) return;
  await subt.storage.set("lastQuery", path);
  let result;
  try {
    result = C.query(p.value, path);
  } catch (e) {
    return subt.window.showError(t(`Đường dẫn không hợp lệ: ${e.message}`, `Invalid path: ${e.message}`));
  }
  if (!result.length) return subt.window.setStatusMessage(t("Không có kết quả", "No match"));
  const value = result.length === 1 && !/\*|\.\.|:/.test(path) ? result[0] : result;
  await subt.commands.execute("file.newFile");
  const ed = await subt.editor.active();
  if (!ed) return;
  await ed.replaceAll(JSON.stringify(value, null, await indent()) + "\n");
  await ed.setLanguage("json").catch(() => {});
  await subt.window.setStatusMessage(t(`${result.length} kết quả`, `${result.length} match(es)`));
}

async function pathAtCursor() {
  const ed = await subt.editor.active();
  if (!ed) return;
  const text = await ed.getText();
  const sel = await ed.getSelection();
  const lines = text.split(/\r\n|\r|\n/);
  let offset = 0;
  const eolLen = (/\r\n|\r|\n/.exec(text) || ["\n"])[0].length;
  for (let i = 0; i < sel.start.line; i++) offset += lines[i].length + eolLen;
  offset += sel.start.character;
  const path = C.pathAt(text, offset);
  if (!path) return subt.window.setStatusMessage(t("Con trỏ không nằm trong JSON", "The caret is not inside JSON"));
  await subt.storage.set("lastQuery", path);
  await subt.window.showMessage(path);
}

async function cleanJsonc() {
  const src = await source();
  if (!src) return;
  let value;
  try {
    value = JSON.parse(C.stripJsonc(src.text));
  } catch (e) {
    return subt.window.showError(t(`Không chuyển được: ${e.message}`, `Could not convert: ${e.message}`));
  }
  const out = JSON.stringify(value, null, await indent()) + (src.whole ? "\n" : "");
  if (src.whole) await src.ed.replaceAll(out); else await src.ed.replaceSelection(out);
}

async function formatCompact() {
  const src = await source();
  if (!src) return;
  const p = await parse(src);
  if (!p) return;
  const width = (await subt.settings.get("maxLineWidth")) || 80;
  const out = C.formatCompact(p.value, await indent(), width) + (src.whole ? "\n" : "");
  if (src.whole) await src.ed.replaceAll(out); else await src.ed.replaceSelection(out);
}

export function activate(context) {
  const reg = (id, fn) => context.subscriptions.push(subt.commands.register(id, fn));
  reg("jsonTools.toYaml", convert(async (v) => C.toYaml(v, await indent() || 2), "yaml"));
  reg("jsonTools.toXml", convert(async (v) => C.toXml(v, "root", " ".repeat(await indent() || 2)), "xml"));
  reg("jsonTools.toCsv", convert((v) => C.toCsv(v), "plaintext"));
  reg("jsonTools.fromCsv", csvToJson);
  reg("jsonTools.toJsonLines", convert((v) => C.arrayToJsonLines(v), "plaintext"));
  reg("jsonTools.fromJsonLines", jsonLinesToArray);
  reg("jsonTools.query", query);
  reg("jsonTools.pathAtCursor", pathAtCursor);
  reg("jsonTools.cleanJsonc", cleanJsonc);
  reg("jsonTools.formatCompact", formatCompact);
}
