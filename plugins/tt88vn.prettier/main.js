// Prettier for SubT (JsPrettier) — formats JS/TS/JSX, CSS/SCSS/LESS, HTML, JSON, Markdown, YAML and GraphQL.
// Prettier itself runs inside SubT's sandbox; no Node.js or network is needed.
import * as prettier from "./prettier/standalone.mjs";
import * as babel from "./prettier/plugins/babel.mjs";
import * as estree from "./prettier/plugins/estree.mjs";
import * as typescript from "./prettier/plugins/typescript.mjs";
import * as postcss from "./prettier/plugins/postcss.mjs";
import * as html from "./prettier/plugins/html.mjs";
import * as markdown from "./prettier/plugins/markdown.mjs";
import * as yaml from "./prettier/plugins/yaml.mjs";
import * as graphql from "./prettier/plugins/graphql.mjs";
import { findConfig } from "./config.js";
import { diffEdit, offsetAt, positionAt } from "./text.js";

const t = (vi, en) => subt.l10n({ vi, en });
const plugins = [babel, estree, typescript, postcss, html, markdown, yaml, graphql];

// Prettier only uses Intl.ListFormat to word some error messages
if (typeof globalThis.Intl === "undefined") globalThis.Intl = {};
if (typeof Intl.ListFormat === "undefined") {
  Intl.ListFormat = class {
    constructor(_, o) { this.word = o && o.type === "disjunction" ? " or " : " and "; }
    format(list) { return list.length < 2 ? list.join("") : list.slice(0, -1).join(", ") + this.word + list[list.length - 1]; }
  };
}

const BY_LANGUAGE = {
  javascript: "babel", javascriptreact: "babel", typescript: "typescript", typescriptreact: "typescript",
  css: "css", scss: "scss", less: "less", json: "json", jsonc: "jsonc", html: "html", vue: "vue",
  markdown: "markdown", yaml: "yaml", graphql: "graphql",
};
const BY_EXTENSION = {
  js: "babel", mjs: "babel", cjs: "babel", jsx: "babel", ts: "typescript", mts: "typescript", cts: "typescript", tsx: "typescript",
  css: "css", scss: "scss", less: "less", json: "json", jsonc: "jsonc", json5: "json5", html: "html", htm: "html", vue: "vue",
  md: "markdown", markdown: "markdown", yaml: "yaml", yml: "yaml", graphql: "graphql", gql: "graphql",
};
const SPECIAL_FILES = { "package.json": "json-stringify", "package-lock.json": "json-stringify", "composer.json": "json-stringify", ".prettierrc": "json", ".babelrc": "json", ".eslintrc": "json" };

function parserFor(ed) {
  const name = (ed.fileName || "").split("/").pop();
  if (SPECIAL_FILES[name]) return SPECIAL_FILES[name];
  const ext = /\.([^.]+)$/.exec(name);
  return BY_LANGUAGE[ed.languageId] || (ext && BY_EXTENSION[ext[1].toLowerCase()]) || null;
}

const SETTINGS = ["printWidth", "tabWidth", "useTabs", "semi", "singleQuote", "jsxSingleQuote", "quoteProps", "trailingComma",
  "bracketSpacing", "bracketSameLine", "arrowParens", "proseWrap", "htmlWhitespaceSensitivity", "singleAttributePerLine", "objectWrap"];

async function optionsFor(ed) {
  const opts = {};
  for (const k of SETTINGS) {
    const v = await subt.settings.get(k);
    if (v !== undefined && v !== null && v !== "") opts[k] = v;
  }
  // 0 = follow the editor's tab size
  if (!opts.tabWidth) opts.tabWidth = ed.tabSize || 2;
  let source = t("cài đặt plugin", "plugin settings");
  if ((await subt.settings.get("useConfigFile")) !== false) {
    const found = await findConfig(ed.workspacePath);
    if (found) { Object.assign(opts, found.options); source = found.source; }
  }
  delete opts.parser; delete opts.plugins; delete opts.filepath;
  return { opts, source };
}

/** Format `ed` (or its selection). Returns true on success. `quiet` = no pop-ups (format on save). */
async function format(ed, { selection = false, quiet = false } = {}) {
  const parser = parserFor(ed);
  if (!parser) {
    if (!quiet) await subt.window.setStatusMessage(t(`Prettier không hỗ trợ ngôn ngữ "${ed.languageId}"`, `Prettier does not support "${ed.languageId}"`));
    return false;
  }
  const text = await ed.getText();
  const limit = (await subt.settings.get(quiet ? "maxSizeOnSave" : "maxFileSize")) || (quiet ? 30000 : 50000);
  if (text.length > limit) {
    const kb = Math.round(text.length / 1000);
    await (quiet ? subt.window.setStatusMessage : subt.window.showError)(t(
      `Prettier: tệp ${kb} KB lớn hơn giới hạn ${Math.round(limit / 1000)} KB (cài đặt ${quiet ? "maxSizeOnSave" : "maxFileSize"}) — bỏ qua để tránh vượt giới hạn CPU của plugin.`,
      `Prettier: the file (${kb} KB) is over the ${Math.round(limit / 1000)} KB limit (setting ${quiet ? "maxSizeOnSave" : "maxFileSize"}) — skipped to stay within the plugin CPU limit.`));
    return false;
  }
  let options;
  try {
    options = await optionsFor(ed);
  } catch (e) {
    if (!quiet) await subt.window.showError(t(`Lỗi tệp cấu hình Prettier: ${e.message}`, `Prettier config error: ${e.message}`));
    return false;
  }
  const sel = await ed.getSelection();
  const cursorOffset = offsetAt(text, sel.start);
  const extra = { cursorOffset, endOfLine: "auto" };
  if (selection) {
    const a = offsetAt(text, sel.start), b = offsetAt(text, sel.end);
    if (a === b) { await subt.window.setStatusMessage(t("Hãy chọn đoạn cần định dạng", "Select the code to format")); return false; }
    extra.rangeStart = a; extra.rangeEnd = b;
  }
  let result;
  try {
    result = await prettier.formatWithCursor(text, { ...options.opts, ...extra, parser, plugins, filepath: ed.fileName || undefined });
  } catch (e) {
    const where = e && e.loc && e.loc.start;
    const first = String((e && e.message) || e).split("\n")[0];
    if (where && !quiet) {
      const p = { line: Math.max(0, where.line - 1), character: Math.max(0, (where.column || 1) - 1) };
      await ed.setSelection({ start: p, end: p });
    }
    await (quiet ? subt.window.setStatusMessage : subt.window.showError)(`Prettier: ${first}`);
    return false;
  }
  const out = result.formatted;
  if (out === text) {
    if (!quiet) await subt.window.setStatusMessage(t("Prettier: đã đúng định dạng ✓", "Prettier: already formatted ✓"));
    return true;
  }
  const edit = diffEdit(text, out);
  if (edit) await ed.edit([edit]);
  if (result.cursorOffset >= 0) {
    const p = positionAt(out, result.cursorOffset);
    await ed.setSelection({ start: p, end: p });
  }
  if (!quiet) await subt.window.setStatusMessage(t(`Prettier: đã định dạng (${parser}, theo ${options.source})`, `Prettier: formatted (${parser}, using ${options.source})`));
  return true;
}

async function showConfig() {
  const ed = await subt.editor.active();
  if (!ed) return;
  const { opts, source } = await optionsFor(ed);
  await subt.window.showMessage(`${t("Nguồn", "Source")}: ${source}\nParser: ${parserFor(ed) || "—"}\n${JSON.stringify(opts, null, 2)}`);
}

export function activate(context) {
  const active = async (fn) => { const ed = await subt.editor.active(); if (ed) return fn(ed); };
  context.subscriptions.push(
    subt.commands.register("prettier.format", () => active((ed) => format(ed))),
    subt.commands.register("prettier.formatSelection", () => active((ed) => format(ed, { selection: true }))),
    subt.commands.register("prettier.toggleFormatOnSave", async () => {
      const on = !(await subt.storage.get("formatOnSave") ?? await subt.settings.get("formatOnSave"));
      await subt.storage.set("formatOnSave", on);
      await subt.window.setStatusMessage(on ? t("Prettier: bật định dạng khi lưu", "Prettier: format on save on") : t("Prettier: tắt định dạng khi lưu", "Prettier: format on save off"));
    }),
    subt.commands.register("prettier.showConfig", showConfig),
    subt.events.onWillSave(async (ed) => {
      const stored = await subt.storage.get("formatOnSave");
      const on = stored ?? (await subt.settings.get("formatOnSave"));
      if (on && parserFor(ed)) await format(ed, { quiet: true });
    }),
  );
}
