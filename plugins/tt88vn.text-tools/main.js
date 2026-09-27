// Text Tools — SubT registry plugin.
import * as T from "./transforms.js";

const t = (vi, en) => subt.l10n({ vi, en });

/** Apply `fn` to the selection (or the word / whole text as a fallback). */
async function transform(fn, { wholeTextIfEmpty = false } = {}) {
  const ed = await subt.editor.active();
  if (!ed) return;
  const selected = await ed.getSelectedText();
  if (!selected) {
    if (!wholeTextIfEmpty) {
      await subt.window.setStatusMessage(t("Hãy chọn văn bản trước", "Select some text first"));
      return;
    }
    const all = await ed.getText();
    await ed.replaceAll(fn(all));
    return;
  }
  try {
    await ed.replaceSelection(fn(selected));
  } catch (e) {
    await subt.window.showError(t(`Không chuyển được: ${e.message}`, `Could not convert: ${e.message}`));
  }
}

export function activate(context) {
  const reg = (id, fn, opts) => context.subscriptions.push(subt.commands.register(id, () => transform(fn, opts)));
  reg("textTools.camelCase", T.camelCase);
  reg("textTools.pascalCase", T.pascalCase);
  reg("textTools.snakeCase", T.snakeCase);
  reg("textTools.constantCase", T.constantCase);
  reg("textTools.kebabCase", T.kebabCase);
  reg("textTools.base64Encode", T.base64Encode);
  reg("textTools.base64Decode", T.base64Decode);
  reg("textTools.urlEncode", encodeURIComponent);
  reg("textTools.urlDecode", decodeURIComponent);
  reg("textTools.jsonEscape", T.jsonEscape);
  reg("textTools.jsonUnescape", T.jsonUnescape);

  context.subscriptions.push(subt.commands.register("textTools.stats", async () => {
    const ed = await subt.editor.active();
    if (!ed) return;
    const text = (await ed.getSelectedText()) || (await ed.getText());
    const s = T.stats(text);
    await subt.window.showMessage(t(
      `${s.lines} dòng · ${s.words} từ · ${s.characters} ký tự`,
      `${s.lines} lines · ${s.words} words · ${s.characters} characters`));
    return s;
  }));
}
