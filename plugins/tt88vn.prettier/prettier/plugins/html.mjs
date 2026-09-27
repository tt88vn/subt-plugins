var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);

// src/plugins/html.js
var html_exports = {};
__export(html_exports, {
  languages: () => languages_evaluate_default,
  options: () => options_default,
  parsers: () => parsers_exports,
  printers: () => printers4
});

// scripts/build/shims/shared.js
var OPTIONAL_OBJECT = 1;
var createMethodShim = (methodName, getImplementation) => (flags, object, ...arguments_) => {
  if (flags | OPTIONAL_OBJECT && (object === void 0 || object === null)) {
    return;
  }
  const implementation = getImplementation.call(object) ?? object[methodName];
  return implementation.apply(object, arguments_);
};

// scripts/build/shims/method-replace-all.js
var stringReplaceAll = String.prototype.replaceAll ?? function(pattern, replacement) {
  if (pattern.global) {
    return this.replace(pattern, replacement);
  }
  return this.split(pattern).join(replacement);
};
var replaceAll = /* @__PURE__ */ createMethodShim("replaceAll", function() {
  if (typeof this === "string") {
    return stringReplaceAll;
  }
});
var method_replace_all_default = replaceAll;

// scripts/build/shims/method-at.js
function stringOrArrayAt(index) {
  return this[index < 0 ? this.length + index : index];
}
var at = /* @__PURE__ */ createMethodShim("at", function() {
  if (Array.isArray(this) || typeof this === "string") {
    return stringOrArrayAt;
  }
});
var method_at_default = at;

// src/utilities/noop.js
var noop = () => {
};
var noop_default = noop;

// src/document/builders/types.js
var DOC_TYPE_STRING = (
  /** @type {const} */
  "string"
);
var DOC_TYPE_ARRAY = (
  /** @type {const} */
  "array"
);
var DOC_TYPE_CURSOR = (
  /** @type {const} */
  "cursor"
);
var DOC_TYPE_INDENT = (
  /** @type {const} */
  "indent"
);
var DOC_TYPE_ALIGN = (
  /** @type {const} */
  "align"
);
var DOC_TYPE_TRIM = (
  /** @type {const} */
  "trim"
);
var DOC_TYPE_GROUP = (
  /** @type {const} */
  "group"
);
var DOC_TYPE_FILL = (
  /** @type {const} */
  "fill"
);
var DOC_TYPE_IF_BREAK = (
  /** @type {const} */
  "if-break"
);
var DOC_TYPE_INDENT_IF_BREAK = (
  /** @type {const} */
  "indent-if-break"
);
var DOC_TYPE_LINE_SUFFIX = (
  /** @type {const} */
  "line-suffix"
);
var DOC_TYPE_LINE_SUFFIX_BOUNDARY = (
  /** @type {const} */
  "line-suffix-boundary"
);
var DOC_TYPE_LINE = (
  /** @type {const} */
  "line"
);
var DOC_TYPE_LABEL = (
  /** @type {const} */
  "label"
);
var DOC_TYPE_BREAK_PARENT = (
  /** @type {const} */
  "break-parent"
);
var VALID_OBJECT_DOC_TYPES = /* @__PURE__ */ new Set([
  DOC_TYPE_CURSOR,
  DOC_TYPE_INDENT,
  DOC_TYPE_ALIGN,
  DOC_TYPE_TRIM,
  DOC_TYPE_GROUP,
  DOC_TYPE_FILL,
  DOC_TYPE_IF_BREAK,
  DOC_TYPE_INDENT_IF_BREAK,
  DOC_TYPE_LINE_SUFFIX,
  DOC_TYPE_LINE_SUFFIX_BOUNDARY,
  DOC_TYPE_LINE,
  DOC_TYPE_LABEL,
  DOC_TYPE_BREAK_PARENT
]);

// src/utilities/get-or-insert.js
function getOrInsertComputed(map, key, callback) {
  if (!map.has(key)) {
    const value = callback(key);
    map.set(key, value);
  }
  return map.get(key);
}

// src/document/utilities/get-doc-type.js
function getDocType(doc) {
  if (typeof doc === "string") {
    return DOC_TYPE_STRING;
  }
  if (Array.isArray(doc)) {
    return DOC_TYPE_ARRAY;
  }
  if (!doc) {
    return;
  }
  const { type } = doc;
  if (VALID_OBJECT_DOC_TYPES.has(type)) {
    return type;
  }
}
var get_doc_type_default = getDocType;

// src/document/utilities/invalid-doc-error.js
var disjunctionListFormat = (list) => new Intl.ListFormat("en-US", { type: "disjunction" }).format(list);
function getDocErrorMessage(doc) {
  const type = doc === null ? "null" : typeof doc;
  if (type !== "string" && type !== "object") {
    return `Unexpected doc '${type}', 
Expected it to be 'string' or 'object'.`;
  }
  if (get_doc_type_default(doc)) {
    throw new Error("doc is valid.");
  }
  const objectType = Object.prototype.toString.call(doc);
  if (objectType !== "[object Object]") {
    return `Unexpected doc '${objectType}'.`;
  }
  const EXPECTED_TYPE_VALUES = disjunctionListFormat(
    [...VALID_OBJECT_DOC_TYPES].map((type2) => `'${type2}'`)
  );
  return `Unexpected doc.type '${doc.type}'.
Expected it to be ${EXPECTED_TYPE_VALUES}.`;
}
var InvalidDocError = class extends Error {
  name = "InvalidDocError";
  constructor(doc) {
    super(getDocErrorMessage(doc));
    this.doc = doc;
  }
};
var invalid_doc_error_default = InvalidDocError;

// src/document/utilities/index.js
function mapDoc(doc, cb) {
  if (typeof doc === "string") {
    return cb(doc);
  }
  const mapped = /* @__PURE__ */ new Map();
  return rec(doc);
  function rec(doc2) {
    return getOrInsertComputed(mapped, doc2, process2);
  }
  function process2(doc2) {
    switch (get_doc_type_default(doc2)) {
      case DOC_TYPE_ARRAY:
        return cb(doc2.map(rec));
      case DOC_TYPE_FILL:
        return cb({
          ...doc2,
          parts: doc2.parts.map(rec)
        });
      case DOC_TYPE_IF_BREAK:
        return cb({
          ...doc2,
          breakContents: rec(doc2.breakContents),
          flatContents: rec(doc2.flatContents)
        });
      case DOC_TYPE_GROUP: {
        let {
          expandedStates,
          contents
        } = doc2;
        if (expandedStates) {
          expandedStates = expandedStates.map(rec);
          contents = expandedStates[0];
        } else {
          contents = rec(contents);
        }
        return cb({
          ...doc2,
          contents,
          expandedStates
        });
      }
      case DOC_TYPE_ALIGN:
      case DOC_TYPE_INDENT:
      case DOC_TYPE_INDENT_IF_BREAK:
      case DOC_TYPE_LABEL:
      case DOC_TYPE_LINE_SUFFIX:
        return cb({
          ...doc2,
          contents: rec(doc2.contents)
        });
      case DOC_TYPE_STRING:
      case DOC_TYPE_CURSOR:
      case DOC_TYPE_TRIM:
      case DOC_TYPE_LINE_SUFFIX_BOUNDARY:
      case DOC_TYPE_LINE:
      case DOC_TYPE_BREAK_PARENT:
        return cb(doc2);
      default:
        throw new invalid_doc_error_default(doc2);
    }
  }
}
function replaceEndOfLine(doc, replacement = literalline) {
  return mapDoc(doc, (currentDoc) => typeof currentDoc === "string" ? join(replacement, currentDoc.split("\n")) : currentDoc);
}

// src/document/utilities/assert-doc.js
var assertDoc = true ? noop_default : (
  /**
  @param {Doc} doc
  */
  function(doc) {
    traverse_doc_default(doc, (doc2) => {
      if (typeof doc2 === "string" || checked.has(doc2)) {
        return false;
      }
      checked.add(doc2);
    });
  }
);
var assertDocArray = true ? noop_default : (
  /**
  @param {readonly Doc[]} docs
  @param {boolean} [optional = false]
  */
  function(docs, optional = false) {
    if (optional && !docs) {
      return;
    }
    if (!Array.isArray(docs)) {
      throw new TypeError("Unexpected doc array.");
    }
    for (const doc of docs) {
      assertDoc(doc);
    }
  }
);
var assertDocFillParts = true ? noop_default : (
  /**
  @param {readonly Doc[]} parts
  */
  function(parts) {
    assertDocArray(parts);
    if (parts.length > 1 && isEmptyDoc(method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      parts,
      -1
    ))) {
      parts = parts.slice(0, -1);
    }
    for (const [i, doc] of parts.entries()) {
      if (i % 2 === 1 && !isValidSeparator(doc)) {
        const type = get_doc_type_default(doc);
        throw new Error(`Unexpected non-line-break doc at ${i}. Doc type is ${type}.`);
      }
    }
  }
);
var assertAlignType = true ? noop_default : function(alignType) {
  if (!(typeof alignType === "number" || typeof alignType === "string" || alignType?.type === "root")) {
    throw new TypeError(`Invalid alignType '${alignType}'.`);
  }
};

// src/document/builders/indent.js
function indent(contents) {
  assertDoc(contents);
  return { type: DOC_TYPE_INDENT, contents };
}

// src/document/builders/align.js
function align(alignType, contents) {
  assertAlignType(alignType);
  assertDoc(contents);
  return { type: DOC_TYPE_ALIGN, contents, n: alignType };
}
function dedentToRoot(contents) {
  return align(Number.NEGATIVE_INFINITY, contents);
}

// src/document/builders/break-parent.js
var breakParent = { type: DOC_TYPE_BREAK_PARENT };

// src/document/builders/fill.js
function fill(parts) {
  assertDocFillParts(parts);
  return { type: DOC_TYPE_FILL, parts };
}

// src/document/builders/group.js
function group(contents, options2 = {}) {
  assertDoc(contents);
  assertDocArray(
    options2.expandedStates,
    /* optional */
    true
  );
  return {
    type: DOC_TYPE_GROUP,
    id: options2.id,
    contents,
    break: Boolean(options2.shouldBreak),
    expandedStates: options2.expandedStates
  };
}

// src/document/builders/if-break.js
function ifBreak(breakContents, flatContents = "", options2 = {}) {
  assertDoc(breakContents);
  if (flatContents !== "") {
    assertDoc(flatContents);
  }
  return {
    type: DOC_TYPE_IF_BREAK,
    breakContents,
    flatContents,
    groupId: options2.groupId
  };
}

// src/document/builders/indent-if-break.js
function indentIfBreak(contents, options2) {
  assertDoc(contents);
  return {
    type: DOC_TYPE_INDENT_IF_BREAK,
    contents,
    groupId: options2.groupId,
    negate: options2.negate
  };
}

// src/document/builders/join.js
function join(separator, docs) {
  assertDoc(separator);
  assertDocArray(docs);
  const parts = [];
  for (let i = 0; i < docs.length; i++) {
    if (i !== 0) {
      parts.push(separator);
    }
    parts.push(docs[i]);
  }
  return parts;
}

// src/document/builders/line.js
var line = { type: DOC_TYPE_LINE };
var softline = { type: DOC_TYPE_LINE, soft: true };
var hardlineWithoutBreakParent = { type: DOC_TYPE_LINE, hard: true };
var hardline = [hardlineWithoutBreakParent, breakParent];
var literallineWithoutBreakParent = {
  type: DOC_TYPE_LINE,
  hard: true,
  literal: true
};
var literalline = [literallineWithoutBreakParent, breakParent];

// src/utilities/get-preferred-quote.js
var SINGLE_QUOTE = "'";
var DOUBLE_QUOTE = '"';
var SINGLE_QUOTE_DATA = Object.freeze({
  character: SINGLE_QUOTE,
  codePoint: 39
});
var DOUBLE_QUOTE_DATA = Object.freeze({
  character: DOUBLE_QUOTE,
  codePoint: 34
});
var SINGLE_QUOTE_SETTINGS = Object.freeze({
  preferred: SINGLE_QUOTE_DATA,
  alternate: DOUBLE_QUOTE_DATA
});
var DOUBLE_QUOTE_SETTINGS = Object.freeze({
  preferred: DOUBLE_QUOTE_DATA,
  alternate: SINGLE_QUOTE_DATA
});
function getPreferredQuote(text, preferredQuoteOrPreferSingleQuote) {
  const { preferred, alternate } = preferredQuoteOrPreferSingleQuote === true || preferredQuoteOrPreferSingleQuote === SINGLE_QUOTE ? SINGLE_QUOTE_SETTINGS : DOUBLE_QUOTE_SETTINGS;
  const { length } = text;
  let preferredQuoteCount = 0;
  let alternateQuoteCount = 0;
  for (let index = 0; index < length; index++) {
    const codePoint = text.charCodeAt(index);
    if (codePoint === preferred.codePoint) {
      preferredQuoteCount++;
    } else if (codePoint === alternate.codePoint) {
      alternateQuoteCount++;
    }
  }
  return (preferredQuoteCount > alternateQuoteCount ? alternate : preferred).character;
}

// node_modules/escape-string-regexp/index.js
function escapeStringRegexp(string) {
  if (typeof string !== "string") {
    throw new TypeError("Expected a string");
  }
  return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}

// src/utilities/whitespace-utilities.js
var WhitespaceUtilities = class {
  #whitespaceCharacters;
  constructor(whitespaceCharacters) {
    this.#whitespaceCharacters = new Set(whitespaceCharacters);
    if (false) {
      throw new TypeError(`Invalid characters: ${JSON.stringify(whitespaceCharacters)}`);
    }
  }
  getLeadingWhitespaceCount(text) {
    const whitespaceCharacters = this.#whitespaceCharacters;
    let count = 0;
    for (let index = 0; index < text.length && whitespaceCharacters.has(text.charAt(index)); index++) {
      count++;
    }
    return count;
  }
  getTrailingWhitespaceCount(text) {
    const whitespaceCharacters = this.#whitespaceCharacters;
    let count = 0;
    for (let index = text.length - 1; index >= 0 && whitespaceCharacters.has(text.charAt(index)); index--) {
      count++;
    }
    return count;
  }
  getLeadingWhitespace(text) {
    const count = this.getLeadingWhitespaceCount(text);
    return text.slice(0, count);
  }
  getTrailingWhitespace(text) {
    const count = this.getTrailingWhitespaceCount(text);
    return text.slice(text.length - count);
  }
  hasLeadingWhitespace(text) {
    return this.#whitespaceCharacters.has(text.charAt(0));
  }
  hasTrailingWhitespace(text) {
    return this.#whitespaceCharacters.has(method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      text,
      -1
    ));
  }
  trimStart(text) {
    const count = this.getLeadingWhitespaceCount(text);
    return text.slice(count);
  }
  trimEnd(text) {
    const count = this.getTrailingWhitespaceCount(text);
    return text.slice(0, text.length - count);
  }
  trim(text) {
    return this.trimEnd(this.trimStart(text));
  }
  split(text, captureWhitespace = false) {
    const pattern = `[${escapeStringRegexp([...this.#whitespaceCharacters].join(""))}]+`;
    const regexp = new RegExp(captureWhitespace ? `(${pattern})` : pattern);
    return text.split(regexp);
  }
  hasWhitespaceCharacter(text) {
    const whitespaceCharacters = this.#whitespaceCharacters;
    return Array.prototype.some.call(text, (character) => whitespaceCharacters.has(character));
  }
  hasNonWhitespaceCharacter(text) {
    const whitespaceCharacters = this.#whitespaceCharacters;
    return Array.prototype.some.call(text, (character) => !whitespaceCharacters.has(character));
  }
  isWhitespaceOnly(text) {
    const whitespaceCharacters = this.#whitespaceCharacters;
    return Array.prototype.every.call(text, (character) => whitespaceCharacters.has(character));
  }
  #getMinIndentation(text) {
    let minIndentation = Number.POSITIVE_INFINITY;
    for (const line2 of text.split("\n")) {
      if (line2.length === 0) {
        continue;
      }
      const indentation = this.getLeadingWhitespaceCount(line2);
      if (indentation === 0) {
        return 0;
      }
      if (line2.length === indentation) {
        continue;
      }
      if (indentation < minIndentation) {
        minIndentation = indentation;
      }
    }
    return minIndentation === Number.POSITIVE_INFINITY ? 0 : minIndentation;
  }
  dedentString(text) {
    const minIndent = this.#getMinIndentation(text);
    return minIndent === 0 ? text : text.split("\n").map((lineText) => lineText.slice(minIndent)).join("\n");
  }
};
var whitespace_utilities_default = WhitespaceUtilities;

// src/utilities/html-whitespace.js
var HTML_WHITESPACE_CHARACTERS = ["	", "\n", "\f", "\r", " "];
var htmlWhitespace = new whitespace_utilities_default(HTML_WHITESPACE_CHARACTERS);
var html_whitespace_default = htmlWhitespace;

// src/utilities/unexpected-node-error.js
var UnexpectedNodeError = class extends Error {
  name = "UnexpectedNodeError";
  constructor(node, language, typeProperty = "type") {
    super(
      `Unexpected ${language} node ${typeProperty}: ${JSON.stringify(
        node[typeProperty]
      )}.`
    );
    this.node = node;
  }
};
var unexpected_node_error_default = UnexpectedNodeError;

// src/language-html/embed/utilities.js
function printExpand(doc, canHaveTrailingWhitespace = true) {
  return [indent([softline, doc]), canHaveTrailingWhitespace ? softline : ""];
}
function shouldHugJsExpression(ast, options2) {
  const rootNode = ast.type === "NGRoot" ? ast.node.type === "NGMicrosyntax" && ast.node.body.length === 1 && ast.node.body[0].type === "NGMicrosyntaxExpression" ? ast.node.body[0].expression : ast.node : ast.type === "JsExpressionRoot" ? ast.node : ast;
  return rootNode && (rootNode.type === "ObjectExpression" || rootNode.type === "ArrayExpression" || (options2.parser === "__vue_expression" || options2.parser === "__vue_ts_expression" || options2.parser === "__ng_binding" || options2.parser === "__ng_directive") && (rootNode.type === "TemplateLiteral" || rootNode.type === "StringLiteral"));
}
async function formatAttributeValue(code, textToDoc, options2, shouldHugJsExpression2) {
  options2 = {
    // strictly prefer single quote to avoid unnecessary HTML entity escape
    __isInHtmlAttribute: true,
    __embeddedInHtml: true,
    ...options2
  };
  let shouldHug = true;
  if (shouldHugJsExpression2) {
    options2.__onHtmlBindingRoot = (ast, options3) => {
      shouldHug = shouldHugJsExpression2(ast, options3);
    };
  }
  const doc = await textToDoc(code, options2, textToDoc);
  return shouldHug ? group(doc) : printExpand(doc);
}

// src/language-html/embed/angular-control-flow-block-parameters.js
function printAngularControlFlowBlockParameters(textToDoc, print, path, options2) {
  const { node } = path;
  const content = options2.originalText.slice(
    node.sourceSpan.start.offset,
    node.sourceSpan.end.offset
  );
  const isEmpty = /^\s*$/.test(content);
  if (isEmpty) {
    return "";
  }
  return formatAttributeValue(
    content,
    textToDoc,
    {
      parser: "__ng_directive",
      __isInHtmlAttribute: false
    },
    shouldHugJsExpression
  );
}
var angular_control_flow_block_parameters_default = printAngularControlFlowBlockParameters;

// scripts/build/shims/function-object-has-own.js
var hasOwn = Object.hasOwn ?? Function.prototype.call.bind(Object.prototype.hasOwnProperty);
var function_object_has_own_default = hasOwn;

// scripts/build/shims/method-to-reversed.js
var arrayToReversed = Array.prototype.toReversed ?? function() {
  return [...this].reverse();
};
var toReversed = /* @__PURE__ */ createMethodShim("toReversed", function() {
  if (Array.isArray(this)) {
    return arrayToReversed;
  }
});
var method_to_reversed_default = toReversed;

// node_modules/deno-path-from-file-url/index.js
function checkWindows() {
  const global = globalThis;
  const platform = global.process?.platform;
  if (typeof platform === "string") return platform.startsWith("win");
  const os = global.Deno?.build?.os;
  if (typeof os === "string") return os === "windows";
  return global.navigator?.platform?.startsWith("Win") ?? false;
}
var isWindows = checkWindows();
function assertArg(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol !== "file:") {
    throw new TypeError(`URL must be a file URL: received "${url.protocol}"`);
  }
  return url;
}
function fromFileUrl(url) {
  url = assertArg(url);
  return decodeURIComponent(url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
}
function fromFileUrl2(url) {
  url = assertArg(url);
  let path = decodeURIComponent(url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
  if (url.hostname !== "") {
    path = `\\\\${url.hostname}${path}`;
  }
  return path;
}
function fromFileUrl3(url) {
  return isWindows ? fromFileUrl2(url) : fromFileUrl(url);
}

// src/universal/index.browser.js
var getFileBasename = (file) => String(file).split(/[/\\]/).pop();
var isUrl = (file) => String(file).startsWith("file:");

// src/utilities/is-non-empty-array.js
function isNonEmptyArray(object) {
  return Array.isArray(object) && object.length > 0;
}
var is_non_empty_array_default = isNonEmptyArray;

// src/utilities/infer-parser.js
function getLanguageByFileName(languages, file) {
  if (!file) {
    return;
  }
  const basename = getFileBasename(file).toLowerCase();
  return languages.find(({
    filenames
  }) => filenames?.some((name) => name.toLowerCase() === basename)) ?? languages.find(({
    extensions
  }) => extensions?.some((extension) => basename.endsWith(extension)));
}
function getLanguageByLanguageName(languages, languageName) {
  if (!languageName) {
    return;
  }
  return languages.find(({
    name
  }) => name.toLowerCase() === languageName) ?? languages.find(({
    aliases
  }) => aliases?.includes(languageName)) ?? languages.find(({
    extensions
  }) => extensions?.includes(`.${languageName}`));
}
var getLanguageByInterpreter = true ? void 0 : getLanguageByInterpreterNodejs;
function getLanguageByIsSupported(languages, file) {
  if (!file) {
    return;
  }
  if (isUrl(file)) {
    try {
      file = fromFileUrl3(file);
    } catch {
      return;
    }
  }
  if (typeof file !== "string") {
    return;
  }
  return languages.find(({
    isSupported
  }) => isSupported?.({
    filepath: file
  }));
}
function inferParser(options2, fileInfo) {
  const languages = method_to_reversed_default(
    /* OPTIONAL_OBJECT: false */
    0,
    options2.plugins
  ).flatMap((plugin) => (
    // @ts-expect-error -- Safe
    plugin.languages ?? []
  ));
  const language = getLanguageByLanguageName(languages, fileInfo.language) ?? getLanguageByFileName(languages, fileInfo.physicalFile) ?? getLanguageByFileName(languages, fileInfo.file) ?? getLanguageByIsSupported(languages, fileInfo.physicalFile) ?? getLanguageByIsSupported(languages, fileInfo.file) ?? getLanguageByInterpreter?.(languages, fileInfo.physicalFile);
  return language?.parsers[0];
}
var infer_parser_default = inferParser;

// src/main/front-matter/constants.js
var FRONT_MATTER_MARK = /* @__PURE__ */ Symbol.for("PRETTIER_IS_FRONT_MATTER");

// src/main/front-matter/is-front-matter.js
function isFrontMatter(node) {
  return Boolean(node?.[FRONT_MATTER_MARK]);
}
var is_front_matter_default = isFrontMatter;

// src/utilities/replace-non-line-breaks-with-space.js
function replaceNonLineBreaksWithSpace(string) {
  const replaced = method_replace_all_default(
    /* OPTIONAL_OBJECT: false */
    0,
    string,
    /[^\n]/g,
    " "
  );
  if (false) {
    noop_default(replaced.length, string.length);
  }
  return replaced;
}
var replace_non_line_breaks_with_space_default = replaceNonLineBreaksWithSpace;

// src/main/front-matter/parse.js
var DELIMITER_LENGTH = 3;
function getFrontMatter(text) {
  const startDelimiter = text.slice(0, DELIMITER_LENGTH);
  if (startDelimiter !== "---" && startDelimiter !== "+++") {
    return;
  }
  const firstLineBreakIndex = text.indexOf("\n", DELIMITER_LENGTH);
  if (firstLineBreakIndex === -1) {
    return;
  }
  const explicitLanguage = text.slice(DELIMITER_LENGTH, firstLineBreakIndex).trim();
  let endDelimiterIndex = text.indexOf(`
${startDelimiter}`, firstLineBreakIndex);
  let language = explicitLanguage;
  language || (language = startDelimiter === "+++" ? "toml" : "yaml");
  if (endDelimiterIndex === -1 && startDelimiter === "---" && language === "yaml") {
    endDelimiterIndex = text.indexOf("\n...", firstLineBreakIndex);
  }
  if (endDelimiterIndex === -1) {
    return;
  }
  const frontMatterEndIndex = endDelimiterIndex + 1 + DELIMITER_LENGTH;
  const nextCharacter = text.charAt(frontMatterEndIndex + 1);
  if (!/\s?/.test(nextCharacter)) {
    return;
  }
  const raw = text.slice(0, frontMatterEndIndex);
  let lines;
  return {
    language,
    explicitLanguage: explicitLanguage || null,
    value: text.slice(firstLineBreakIndex + 1, endDelimiterIndex),
    startDelimiter,
    endDelimiter: raw.slice(-DELIMITER_LENGTH),
    raw,
    start: {
      line: 1,
      column: 0,
      index: 0
    },
    end: {
      index: raw.length,
      get line() {
        lines ?? (lines = raw.split("\n"));
        return lines.length;
      },
      get column() {
        lines ?? (lines = raw.split("\n"));
        return method_at_default(
          /* OPTIONAL_OBJECT: false */
          0,
          lines,
          -1
        ).length;
      }
    },
    [FRONT_MATTER_MARK]: true
  };
}
function parse(text) {
  const frontMatter = getFrontMatter(text);
  if (!frontMatter) {
    return {
      content: text
    };
  }
  return {
    frontMatter,
    get content() {
      const {
        raw
      } = frontMatter;
      return replace_non_line_breaks_with_space_default(raw) + text.slice(raw.length);
    }
  };
}
var parse_default = parse;

// src/language-html/constants.evaluate.js
var CSS_DISPLAY_DEFAULT = "inline";
var CSS_DISPLAY_TAGS = {
  "area": "none",
  "base": "none",
  "basefont": "none",
  "datalist": "none",
  "head": "none",
  "link": "none",
  "meta": "none",
  "noembed": "none",
  "noframes": "none",
  "param": "block",
  "rp": "none",
  "script": "block",
  "style": "none",
  "template": "inline",
  "title": "none",
  "html": "block",
  "body": "block",
  "address": "block",
  "blockquote": "block",
  "center": "block",
  "dialog": "block",
  "div": "block",
  "figure": "block",
  "figcaption": "block",
  "footer": "block",
  "form": "block",
  "header": "block",
  "hr": "block",
  "legend": "block",
  "listing": "block",
  "main": "block",
  "p": "block",
  "plaintext": "block",
  "pre": "block",
  "search": "block",
  "xmp": "block",
  "slot": "contents",
  "ruby": "ruby",
  "rt": "ruby-text",
  "article": "block",
  "aside": "block",
  "h1": "block",
  "h2": "block",
  "h3": "block",
  "h4": "block",
  "h5": "block",
  "h6": "block",
  "hgroup": "block",
  "nav": "block",
  "section": "block",
  "dir": "block",
  "dd": "block",
  "dl": "block",
  "dt": "block",
  "menu": "block",
  "ol": "block",
  "ul": "block",
  "li": "list-item",
  "table": "table",
  "caption": "table-caption",
  "colgroup": "table-column-group",
  "col": "table-column",
  "thead": "table-header-group",
  "tbody": "table-row-group",
  "tfoot": "table-footer-group",
  "tr": "table-row",
  "td": "table-cell",
  "th": "table-cell",
  "input": "inline-block",
  "button": "inline-block",
  "fieldset": "block",
  "details": "block",
  "summary": "block",
  "marquee": "inline-block",
  "option": "block",
  "optgroup": "block",
  "select": "inline-block",
  "source": "block",
  "track": "block",
  "meter": "inline-block",
  "progress": "inline-block",
  "object": "inline-block",
  "video": "inline-block",
  "audio": "inline-block"
};
var CSS_WHITE_SPACE_DEFAULT = "normal";
var CSS_WHITE_SPACE_TAGS = {
  "listing": "pre",
  "plaintext": "pre",
  "pre": "pre",
  "xmp": "pre",
  "nobr": "nowrap",
  "table": "initial",
  "textarea": "pre-wrap"
};

// src/language-html/utilities/is-unknown-namespace.js
function isUnknownNamespace(node) {
  return node.kind === "element" && !node.hasExplicitNamespace && !["html", "svg"].includes(node.namespace);
}
var is_unknown_namespace_default = isUnknownNamespace;

// src/language-html/utilities/index.js
var htmlTrimLeadingBlankLines = (string) => method_replace_all_default(
  /* OPTIONAL_OBJECT: false */
  0,
  string,
  /^[\t\f\r ]*\n/g,
  ""
);
var htmlTrimPreserveIndentation = (string) => htmlTrimLeadingBlankLines(html_whitespace_default.trimEnd(string));
var getLeadingAndTrailingHtmlWhitespace = (string) => {
  let text = string;
  const leadingWhitespace = html_whitespace_default.getLeadingWhitespace(text);
  if (leadingWhitespace) {
    text = text.slice(leadingWhitespace.length);
  }
  const trailingWhitespace = html_whitespace_default.getTrailingWhitespace(text);
  if (trailingWhitespace) {
    text = text.slice(0, -trailingWhitespace.length);
  }
  return {
    leadingWhitespace,
    trailingWhitespace,
    text
  };
};
function shouldPreserveContent(node, options2) {
  if (node.kind === "ieConditionalComment" && node.lastChild && !node.lastChild.isSelfClosing && !node.lastChild.endSourceSpan) {
    return true;
  }
  if (node.kind === "ieConditionalComment" && !node.complete) {
    return true;
  }
  if (isPreLikeNode(node) && node.children.some((child) => child.kind !== "text" && child.kind !== "interpolation")) {
    return true;
  }
  if (isVueNonHtmlBlock(node, options2) && !isScriptLikeTag(node, options2) && node.kind !== "interpolation") {
    return true;
  }
  return false;
}
function hasPrettierIgnore(node) {
  if (node.kind === "attribute") {
    return false;
  }
  if (!node.parent) {
    return false;
  }
  if (!node.prev) {
    return false;
  }
  return isPrettierIgnore(node.prev);
}
function isPrettierIgnore(node) {
  return node.kind === "comment" && node.value.trim() === "prettier-ignore";
}
function isTextLikeNode(node) {
  return node.kind === "text" || node.kind === "comment";
}
function isScriptLikeTag(node, options2) {
  return node.kind === "element" && (node.fullName === "script" || node.fullName === "style" || node.fullName === "svg:style" || node.fullName === "svg:script" || node.fullName === "mj-style" && options2.parser === "mjml" || is_unknown_namespace_default(node) && (node.name === "script" || node.name === "style"));
}
function canHaveInterpolation(node, options2) {
  return node.children && !isScriptLikeTag(node, options2);
}
function isWhitespaceSensitiveNode(node, options2) {
  return isScriptLikeTag(node, options2) || node.kind === "interpolation" || isIndentationSensitiveNode(node);
}
function isIndentationSensitiveNode(node) {
  return getNodeCssStyleWhiteSpace(node).startsWith("pre");
}
function isLeadingSpaceSensitiveNode(node, options2) {
  const isLeadingSpaceSensitive = _isLeadingSpaceSensitiveNode();
  if (isLeadingSpaceSensitive && !node.prev && node.parent?.tagDefinition?.ignoreFirstLf) {
    return node.kind === "interpolation";
  }
  return isLeadingSpaceSensitive;
  function _isLeadingSpaceSensitiveNode() {
    if (is_front_matter_default(node) || node.kind === "angularControlFlowBlock") {
      return false;
    }
    if ((node.kind === "text" || node.kind === "interpolation") && node.prev && (node.prev.kind === "text" || node.prev.kind === "interpolation")) {
      return true;
    }
    if (!node.parent || node.parent.cssDisplay === "none") {
      return false;
    }
    if (isPreLikeNode(node.parent)) {
      return true;
    }
    if (!node.prev && (node.parent.kind === "root" || isPreLikeNode(node) && node.parent || isScriptLikeTag(node.parent, options2) || isVueCustomBlock(node.parent, options2) || !isFirstChildLeadingSpaceSensitiveCssDisplay(node.parent.cssDisplay))) {
      return false;
    }
    if (node.prev && !isNextLeadingSpaceSensitiveCssDisplay(node.prev.cssDisplay)) {
      return false;
    }
    return true;
  }
}
function isTrailingSpaceSensitiveNode(node, options2) {
  if (is_front_matter_default(node) || node.kind === "angularControlFlowBlock") {
    return false;
  }
  if ((node.kind === "text" || node.kind === "interpolation") && node.next && (node.next.kind === "text" || node.next.kind === "interpolation")) {
    return true;
  }
  if (!node.parent || node.parent.cssDisplay === "none") {
    return false;
  }
  if (isPreLikeNode(node.parent)) {
    return true;
  }
  if (!node.next && (node.parent.kind === "root" || isPreLikeNode(node) && node.parent || isScriptLikeTag(node.parent, options2) || isVueCustomBlock(node.parent, options2) || !isLastChildTrailingSpaceSensitiveCssDisplay(node.parent.cssDisplay))) {
    return false;
  }
  if (node.next && !isPrevTrailingSpaceSensitiveCssDisplay(node.next.cssDisplay)) {
    return false;
  }
  return true;
}
function isDanglingSpaceSensitiveNode(node, options2) {
  return isDanglingSpaceSensitiveCssDisplay(node.cssDisplay) && !isScriptLikeTag(node, options2);
}
function forceNextEmptyLine(node) {
  return is_front_matter_default(node) || node.next && node.sourceSpan.end && node.sourceSpan.end.line + 1 < node.next.sourceSpan.start.line;
}
function forceBreakContent(node) {
  return forceBreakChildren(node) || node.kind === "element" && node.children.length > 0 && (["body", "script", "style"].includes(node.name) || node.children.some((child) => hasNonTextChild(child))) || node.firstChild && node.firstChild === node.lastChild && node.firstChild.kind !== "text" && hasLeadingLineBreak(node.firstChild) && (!node.lastChild.isTrailingSpaceSensitive || hasTrailingLineBreak(node.lastChild));
}
function forceBreakChildren(node) {
  return node.kind === "element" && node.children.length > 0 && (["html", "head", "ul", "ol", "select"].includes(node.name) || node.cssDisplay.startsWith("table") && node.cssDisplay !== "table-cell");
}
function preferHardlineAsLeadingSpaces(node) {
  return preferHardlineAsSurroundingSpaces(node) || node.prev && preferHardlineAsTrailingSpaces(node.prev) || hasSurroundingLineBreak(node);
}
function preferHardlineAsTrailingSpaces(node) {
  return preferHardlineAsSurroundingSpaces(node) || node.kind === "element" && node.fullName === "br" || hasSurroundingLineBreak(node);
}
function hasSurroundingLineBreak(node) {
  return hasLeadingLineBreak(node) && hasTrailingLineBreak(node);
}
function hasLeadingLineBreak(node) {
  return node.hasLeadingSpaces && (node.prev ? node.prev.sourceSpan.end.line < node.sourceSpan.start.line : node.parent.kind === "root" || node.parent.startSourceSpan.end.line < node.sourceSpan.start.line);
}
function hasTrailingLineBreak(node) {
  return node.hasTrailingSpaces && (node.next ? node.next.sourceSpan.start.line > node.sourceSpan.end.line : node.parent.kind === "root" || node.parent.endSourceSpan && node.parent.endSourceSpan.start.line > node.sourceSpan.end.line);
}
function preferHardlineAsSurroundingSpaces(node) {
  switch (node.kind) {
    case "ieConditionalComment":
    case "comment":
    case "directive":
      return true;
    case "element":
      return ["script", "select"].includes(node.name);
  }
  return false;
}
function getLastDescendant(node) {
  return node.lastChild ? getLastDescendant(node.lastChild) : node;
}
function hasNonTextChild(node) {
  return node.children?.some((child) => child.kind !== "text");
}
function inferParserByTypeAttribute(type) {
  if (!type) {
    return;
  }
  switch (type) {
    case "module":
    case "text/javascript":
    case "text/babel":
    case "text/jsx":
    case "application/javascript":
      return "babel";
    case "application/x-typescript":
      return "typescript";
    case "text/markdown":
      return "markdown";
    case "text/html":
      return "html";
    case "text/x-handlebars-template":
      return "glimmer";
    default:
      if (type.endsWith("json") || type.endsWith("importmap") || type === "speculationrules") {
        return "json";
      }
  }
}
function inferScriptParser(node, options2) {
  const {
    name,
    attrMap
  } = node;
  if (name !== "script" || function_object_has_own_default(attrMap, "src")) {
    return;
  }
  const {
    type,
    lang
  } = node.attrMap;
  if (!lang && !type) {
    return "babel";
  }
  return infer_parser_default(options2, {
    language: lang
  }) ?? inferParserByTypeAttribute(type);
}
function inferVueSfcBlockParser(node, options2) {
  if (!isVueNonHtmlBlock(node, options2)) {
    return;
  }
  const {
    attrMap
  } = node;
  if (function_object_has_own_default(attrMap, "src")) {
    return;
  }
  const {
    type,
    lang
  } = attrMap;
  return infer_parser_default(options2, {
    language: lang
  }) ?? inferParserByTypeAttribute(type);
}
function inferStyleParser(node, options2) {
  if (node.name === "style") {
    const {
      lang
    } = node.attrMap;
    return lang ? infer_parser_default(options2, {
      language: lang
    }) : "css";
  }
  if (node.name === "mj-style" && options2.parser === "mjml") {
    return "css";
  }
}
function inferElementParser(node, options2) {
  return inferScriptParser(node, options2) ?? inferStyleParser(node, options2) ?? inferVueSfcBlockParser(node, options2);
}
function isBlockLikeCssDisplay(cssDisplay) {
  return cssDisplay === "block" || cssDisplay === "list-item" || cssDisplay.startsWith("table");
}
function isFirstChildLeadingSpaceSensitiveCssDisplay(cssDisplay) {
  return !isBlockLikeCssDisplay(cssDisplay) && cssDisplay !== "inline-block";
}
function isLastChildTrailingSpaceSensitiveCssDisplay(cssDisplay) {
  return !isBlockLikeCssDisplay(cssDisplay) && cssDisplay !== "inline-block";
}
function isPrevTrailingSpaceSensitiveCssDisplay(cssDisplay) {
  return !isBlockLikeCssDisplay(cssDisplay);
}
function isNextLeadingSpaceSensitiveCssDisplay(cssDisplay) {
  return !isBlockLikeCssDisplay(cssDisplay);
}
function isDanglingSpaceSensitiveCssDisplay(cssDisplay) {
  return !isBlockLikeCssDisplay(cssDisplay) && cssDisplay !== "inline-block";
}
function isPreLikeNode(node) {
  return getNodeCssStyleWhiteSpace(node).startsWith("pre");
}
function hasParent(node, fn) {
  let current = node;
  while (current) {
    if (fn(current)) {
      return true;
    }
    current = current.parent;
  }
  return false;
}
function getNodeCssStyleDisplay(node, options2) {
  if (isVueSfcBlock(node, options2)) {
    return "block";
  }
  if (node.prev?.kind === "comment") {
    const match = node.prev.value.match(/^\s*display:\s*([a-z]+)\s*$/);
    if (match) {
      return match[1];
    }
  }
  let isInSvgForeignObject = false;
  if (node.kind === "element" && node.namespace === "svg") {
    if (hasParent(node, (parent) => parent.fullName === "svg:foreignObject")) {
      isInSvgForeignObject = true;
    } else {
      return node.name === "svg" ? "inline-block" : "block";
    }
  }
  switch (options2.htmlWhitespaceSensitivity) {
    case "strict":
      return "inline";
    case "ignore":
      return "block";
    default:
      if (node.kind === "element" && (!node.namespace || isInSvgForeignObject || is_unknown_namespace_default(node)) && function_object_has_own_default(CSS_DISPLAY_TAGS, node.name)) {
        return CSS_DISPLAY_TAGS[node.name];
      }
  }
  return CSS_DISPLAY_DEFAULT;
}
function getNodeCssStyleWhiteSpace(node) {
  if (node.kind === "element" && (!node.namespace || is_unknown_namespace_default(node)) && function_object_has_own_default(CSS_WHITE_SPACE_TAGS, node.name)) {
    return CSS_WHITE_SPACE_TAGS[node.name];
  }
  return CSS_WHITE_SPACE_DEFAULT;
}
function unescapeQuoteEntities(text) {
  return method_replace_all_default(
    /* OPTIONAL_OBJECT: false */
    0,
    method_replace_all_default(
      /* OPTIONAL_OBJECT: false */
      0,
      text,
      "&apos;",
      "'"
    ),
    "&quot;",
    '"'
  );
}
function getUnescapedAttributeValue(node) {
  return unescapeQuoteEntities(node.value);
}
var vueRootElementsSet = /* @__PURE__ */ new Set(["template", "style", "script"]);
function isVueCustomBlock(node, options2) {
  return isVueSfcBlock(node, options2) && !vueRootElementsSet.has(node.fullName);
}
function isVueSfcBlock(node, options2) {
  return options2.parser === "vue" && node.kind === "element" && node.parent.kind === "root" && node.fullName.toLowerCase() !== "html";
}
function isVueNonHtmlBlock(node, options2) {
  return isVueSfcBlock(node, options2) && (isVueCustomBlock(node, options2) || node.attrMap.lang && node.attrMap.lang !== "html");
}
function isVueSlotAttribute(attribute) {
  const attributeName = attribute.fullName;
  return attributeName.charAt(0) === "#" || attributeName === "slot-scope" || attributeName === "v-slot" || attributeName.startsWith("v-slot:");
}
function isVueSfcBindingsAttribute(attribute, options2) {
  const element = attribute.parent;
  if (!isVueSfcBlock(element, options2)) {
    return false;
  }
  const tagName = element.fullName;
  const attributeName = attribute.fullName;
  return (
    // https://github.com/vuejs/rfcs/blob/sfc-improvements/active-rfcs/0000-sfc-script-setup.md
    tagName === "script" && attributeName === "setup" || // https://github.com/vuejs/rfcs/blob/sfc-improvements/active-rfcs/0000-sfc-style-variables.md
    tagName === "style" && attributeName === "vars"
  );
}
function getTextValueParts(node, value = node.value) {
  return node.parent.isWhitespaceSensitive ? node.parent.isIndentationSensitive ? replaceEndOfLine(value) : replaceEndOfLine(html_whitespace_default.dedentString(htmlTrimPreserveIndentation(value)), hardline) : join(line, html_whitespace_default.split(value));
}
function isVueScriptTag(node, options2) {
  return isVueSfcBlock(node, options2) && node.name === "script";
}
function isAttributeValueQuoted(node) {
  const {
    valueSpan,
    value
  } = node;
  return valueSpan.end.offset - valueSpan.start.offset === value.length + 2;
}
function shouldUnquoteAttributeValue(node, options2) {
  if (isAttributeValueQuoted(node)) {
    return false;
  }
  const {
    value
  } = node;
  return (
    // Embedded HTML in JS: `` /* HTML */ `<my-element data-for={value}></my-element>` ``
    /^PRETTIER_HTML_PLACEHOLDER_\d+_\d+_IN_JS$/.test(value) || // LWC `<div foo={value}></div>`
    options2.parser === "lwc" && value.startsWith("{") && value.endsWith("}")
  );
}

// src/language-html/embed/angular-interpolation.js
var interpolationRegex = /\{\{(.+?)\}\}/s;
var isAngularInterpolation = ({ node: { value } }) => interpolationRegex.test(value);
async function printAngularInterpolation(textToDoc, print, path) {
  const text = getUnescapedAttributeValue(path.node);
  const parts = [];
  for (const [index, part] of text.split(interpolationRegex).entries()) {
    if (index % 2 === 0) {
      parts.push(replaceEndOfLine(part));
    } else {
      try {
        parts.push(
          group([
            "{{",
            indent([
              line,
              await formatAttributeValue(part, textToDoc, {
                parser: "__ng_interpolation",
                __isInHtmlInterpolation: true
                // to avoid unexpected `}}`
              })
            ]),
            line,
            "}}"
          ])
        );
      } catch {
        parts.push("{{", replaceEndOfLine(part), "}}");
      }
    }
  }
  return parts;
}

// src/language-html/embed/angular-attributes.js
var createAngularPrinter = (parser) => (textToDoc, print, path) => formatAttributeValue(
  getUnescapedAttributeValue(path.node),
  textToDoc,
  { parser },
  shouldHugJsExpression
);
var printers = [
  {
    /*
    - `(click)="angularStatement"`
    - `on-click="angularStatement"`
    */
    test(path) {
      const name = path.node.fullName;
      return name.startsWith("(") && name.endsWith(")") || name.startsWith("on-");
    },
    print: createAngularPrinter("__ng_action")
  },
  {
    /*
    - `[target]="angularExpression"`
    - `bind-target="angularExpression"`
    - `[(target)]="angularExpression"`
    - `bindon-target="angularExpression"`
    */
    test(path) {
      const name = path.node.fullName;
      return name.startsWith("[") && name.endsWith("]") || /^bind(?:on)?-/.test(name) || // Unofficial rudimentary support for some of the most used directives of AngularJS 1.x
      /^ng-(?:if|show|hide|class|style)$/.test(name);
    },
    print: createAngularPrinter("__ng_binding")
  },
  {
    /*
    - `*directive="angularDirective"`
    */
    test: (path) => path.node.fullName.startsWith("*"),
    print: createAngularPrinter("__ng_directive")
  },
  {
    /*
    - `i18n="longDescription"`
    - `i18n-attr="longDescription"`
    */
    test: (path) => /^i18n(?:-.+)?$/.test(path.node.fullName),
    print: printAngularI18n
  },
  {
    test: isAngularInterpolation,
    print: printAngularInterpolation
  }
].map(({ test, print }) => ({
  test: (path, options2) => options2.parser === "angular" && test(
    path
    /* , options */
  ),
  print
}));
function printAngularI18n(textToDoc, print, { node }) {
  const value = getUnescapedAttributeValue(node);
  return printExpand(
    // @ts-expect-error -- Need investigate how `replaceEndOfLine` works
    fill(getTextValueParts(node, value.trim())),
    !value.includes("@@")
  );
}
var angular_attributes_default = printers;

// src/language-html/embed/class-names.js
var isClassNames = ({
  node
}, options2) => !options2.parentParser && node.fullName === "class" && !node.value.includes("{{");
var printClassNames = (textToDoc, print, path) => method_replace_all_default(
  /* OPTIONAL_OBJECT: false */
  0,
  getUnescapedAttributeValue(path.node).trim(),
  /\s+/g,
  " "
);

// node_modules/@prettier/html-event-attributes/index.json
var html_event_attributes_default = [
  "onabort",
  "onafterprint",
  "onauxclick",
  "onbeforeinput",
  "onbeforematch",
  "onbeforeprint",
  "onbeforetoggle",
  "onbeforeunload",
  "onblur",
  "oncancel",
  "oncanplay",
  "oncanplaythrough",
  "onchange",
  "onclick",
  "onclose",
  "oncommand",
  "oncontextlost",
  "oncontextmenu",
  "oncontextrestored",
  "oncopy",
  "oncuechange",
  "oncut",
  "ondblclick",
  "ondrag",
  "ondragend",
  "ondragenter",
  "ondragleave",
  "ondragover",
  "ondragstart",
  "ondrop",
  "ondurationchange",
  "onemptied",
  "onended",
  "onerror",
  "onfocus",
  "onformdata",
  "onhashchange",
  "oninput",
  "oninvalid",
  "onkeydown",
  "onkeypress",
  "onkeyup",
  "onlanguagechange",
  "onload",
  "onloadeddata",
  "onloadedmetadata",
  "onloadstart",
  "onmessage",
  "onmessageerror",
  "onmousedown",
  "onmouseenter",
  "onmouseleave",
  "onmousemove",
  "onmouseout",
  "onmouseover",
  "onmouseup",
  "onoffline",
  "ononline",
  "onpagehide",
  "onpagereveal",
  "onpageshow",
  "onpageswap",
  "onpaste",
  "onpause",
  "onplay",
  "onplaying",
  "onpopstate",
  "onprogress",
  "onratechange",
  "onrejectionhandled",
  "onreset",
  "onresize",
  "onscroll",
  "onscrollend",
  "onsecuritypolicyviolation",
  "onseeked",
  "onseeking",
  "onselect",
  "onslotchange",
  "onstalled",
  "onstorage",
  "onsubmit",
  "onsuspend",
  "ontimeupdate",
  "ontoggle",
  "onunhandledrejection",
  "onunload",
  "onvolumechange",
  "onwaiting",
  "onwheel"
];

// src/language-html/embed/event-handler.js
var htmlEventAttributes = new Set(html_event_attributes_default);
var isEventHandler = ({ node }, options2) => htmlEventAttributes.has(node.fullName) && !options2.parentParser && !node.value.includes("{{");
var printEventHandler = (textToDoc, print, path) => formatAttributeValue(
  getUnescapedAttributeValue(path.node),
  textToDoc,
  { parser: "babel", __isHtmlInlineEventHandler: true },
  () => false
);

// src/language-html/embed/parse-permissions-policy.js
function parsePermissionsPolicy(policy) {
  const directives = [];
  for (let token of policy.split(";")) {
    token = html_whitespace_default.trim(token);
    if (!token) {
      continue;
    }
    const [name, ...value] = html_whitespace_default.split(token);
    directives.push({ name, value });
  }
  return directives;
}
var parse_permissions_policy_default = parsePermissionsPolicy;

// src/language-html/embed/permissions-policy.js
var isPermissionsPolicy = ({ node }, options2) => node.fullName === "allow" && !options2.parentParser && node.parent.fullName === "iframe" && !node.value.includes("{{");
function printPermissionsPolicy(textToDoc, print, path) {
  const { node } = path;
  const directives = parse_permissions_policy_default(getUnescapedAttributeValue(node));
  if (directives.length === 0) {
    return [""];
  }
  return printExpand(
    directives.map(({ name, value }, index) => [
      [name, ...value].join(" "),
      index === directives.length - 1 ? ifBreak(";") : [";", line]
    ])
  );
}

// node_modules/@prettier/parse-srcset/index.js
function isASCIIWhitespace(character) {
  return (
    // Horizontal tab
    character === "	" || // New line
    character === "\n" || // Form feed
    character === "\f" || // Carriage return
    character === "\r" || // Space
    character === " "
  );
}
var regexLeadingSpaces = /^[ \t\n\r\u000c]+/;
var regexLeadingCommasOrSpaces = /^[, \t\n\r\u000c]+/;
var regexLeadingNotSpaces = /^[^ \t\n\r\u000c]+/;
var regexTrailingCommas = /[,]+$/;
var regexNonNegativeInteger = /^\d+$/;
var regexFloatingPoint = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/;
function parseSrcset(input) {
  const inputLength = input.length;
  let url;
  let descriptors;
  let currentDescriptor;
  let state;
  let c;
  let position = 0;
  let startOffset;
  function collectCharacters(regEx) {
    let chars;
    const match = regEx.exec(input.substring(position));
    if (match) {
      [chars] = match;
      position += chars.length;
      return chars;
    }
  }
  const candidates = [];
  while (true) {
    collectCharacters(regexLeadingCommasOrSpaces);
    if (position >= inputLength) {
      if (candidates.length === 0) {
        throw new Error("Must contain one or more image candidate strings.");
      }
      return candidates;
    }
    startOffset = position;
    url = collectCharacters(regexLeadingNotSpaces);
    descriptors = [];
    if (url.slice(-1) === ",") {
      url = url.replace(regexTrailingCommas, "");
      parseDescriptors();
    } else {
      tokenize2();
    }
  }
  function tokenize2() {
    collectCharacters(regexLeadingSpaces);
    currentDescriptor = "";
    state = "in descriptor";
    while (true) {
      c = input.charAt(position);
      if (state === "in descriptor") {
        if (isASCIIWhitespace(c)) {
          if (currentDescriptor) {
            descriptors.push(currentDescriptor);
            currentDescriptor = "";
            state = "after descriptor";
          }
        } else if (c === ",") {
          position += 1;
          if (currentDescriptor) {
            descriptors.push(currentDescriptor);
          }
          parseDescriptors();
          return;
        } else if (c === "(") {
          currentDescriptor += c;
          state = "in parens";
        } else if (c === "") {
          if (currentDescriptor) {
            descriptors.push(currentDescriptor);
          }
          parseDescriptors();
          return;
        } else {
          currentDescriptor += c;
        }
      } else if (state === "in parens") {
        if (c === ")") {
          currentDescriptor += c;
          state = "in descriptor";
        } else if (c === "") {
          descriptors.push(currentDescriptor);
          parseDescriptors();
          return;
        } else {
          currentDescriptor += c;
        }
      } else if (state === "after descriptor") {
        if (isASCIIWhitespace(c)) {
        } else if (c === "") {
          parseDescriptors();
          return;
        } else {
          state = "in descriptor";
          position -= 1;
        }
      }
      position += 1;
    }
  }
  function parseDescriptors() {
    let pError = false;
    let w;
    let d;
    let h;
    let i;
    const candidate = {};
    let desc;
    let lastChar;
    let value;
    let intVal;
    let floatVal;
    for (i = 0; i < descriptors.length; i++) {
      desc = descriptors[i];
      lastChar = desc[desc.length - 1];
      value = desc.substring(0, desc.length - 1);
      intVal = parseInt(value, 10);
      floatVal = parseFloat(value);
      if (regexNonNegativeInteger.test(value) && lastChar === "w") {
        if (w || d) {
          pError = true;
        }
        if (intVal === 0) {
          pError = true;
        } else {
          w = intVal;
        }
      } else if (regexFloatingPoint.test(value) && lastChar === "x") {
        if (w || d || h) {
          pError = true;
        }
        if (floatVal < 0) {
          pError = true;
        } else {
          d = floatVal;
        }
      } else if (regexNonNegativeInteger.test(value) && lastChar === "h") {
        if (h || d) {
          pError = true;
        }
        if (intVal === 0) {
          pError = true;
        } else {
          h = intVal;
        }
      } else {
        pError = true;
      }
    }
    if (!pError) {
      candidate.source = { value: url, startOffset };
      if (w) {
        candidate.width = { value: w };
      }
      if (d) {
        candidate.density = { value: d };
      }
      if (h) {
        candidate.height = { value: h };
      }
      candidates.push(candidate);
    } else {
      throw new Error(
        `Invalid srcset descriptor found in "${input}" at "${desc}".`
      );
    }
  }
}
var parse_srcset_default = parseSrcset;

// src/language-html/embed/srcset.js
var isSrcset = (path) => path.node.fullName === "srcset" && (path.parent.fullName === "img" || path.parent.fullName === "source");
var SRCSET_UNITS = {
  width: "w",
  height: "h",
  density: "x"
};
var SRCSET_TYPES = Object.keys(SRCSET_UNITS);
function printSrcset(textToDoc, print, path) {
  const value = getUnescapedAttributeValue(path.node);
  const srcset = parse_srcset_default(value);
  const types = SRCSET_TYPES.filter((type) => srcset.some((candidate) => function_object_has_own_default(candidate, type)));
  if (types.length > 1) {
    throw new Error("Mixed descriptor in srcset is not supported");
  }
  const [key] = types;
  const unit = SRCSET_UNITS[key];
  const urls = srcset.map((src) => src.source.value);
  const maxUrlLength = Math.max(...urls.map((url) => url.length));
  const descriptors = srcset.map((src) => src[key] ? String(src[key].value) : "");
  const descriptorLeftLengths = descriptors.map((descriptor) => {
    const index = descriptor.indexOf(".");
    return index === -1 ? descriptor.length : index;
  });
  const maxDescriptorLeftLength = Math.max(...descriptorLeftLengths);
  return printExpand(join([",", line], urls.map((url, index) => {
    const parts = [url];
    const descriptor = descriptors[index];
    if (descriptor) {
      const urlPadding = maxUrlLength - url.length + 1;
      const descriptorPadding = maxDescriptorLeftLength - descriptorLeftLengths[index];
      const alignment = " ".repeat(urlPadding + descriptorPadding);
      parts.push(ifBreak(alignment, " "), descriptor + unit);
    }
    return parts;
  })));
}

// src/language-html/embed/style.js
var isStyle = ({ node }, options2) => node.fullName === "style" && !options2.parentParser && !node.value.includes("{{");
var printStyle = async (textToDoc, print, path) => printExpand(
  await textToDoc(getUnescapedAttributeValue(path.node), {
    parser: "css",
    __isHTMLStyleAttribute: true
  })
);

// src/language-html/utilities/is-vue-sfc-with-typescript-script.js
var cache = /* @__PURE__ */ new WeakMap();
function isVueSfcWithTypescriptScript(path, options2) {
  return getOrInsertComputed(
    cache,
    path.root,
    (root) => root.children.some(
      (child) => isVueScriptTag(child, options2) && ["ts", "typescript"].includes(child.attrMap.lang)
    )
  );
}
var is_vue_sfc_with_typescript_script_default = isVueSfcWithTypescriptScript;

// src/language-html/embed/print-vue-script-generic-attribute-value.js
function printVueScriptGenericAttributeValue(textToDoc, print, path) {
  const value = getUnescapedAttributeValue(path.node);
  return formatAttributeValue(
    `type T<${value}> = any`,
    textToDoc,
    {
      parser: "babel-ts",
      __isEmbeddedTypescriptGenericParameters: true
    },
    shouldHugJsExpression
  );
}

// src/language-html/embed/vue-bindings.js
function printVueBindings(textToDoc, print, path, options2) {
  const text = getUnescapedAttributeValue(path.node);
  const parser = is_vue_sfc_with_typescript_script_default(path, options2) ? "babel-ts" : "babel";
  return formatAttributeValue(`function _(${text}) {}`, textToDoc, {
    parser,
    __isVueBindings: true
  });
}

// src/language-html/embed/vue-v-for-directive.js
async function printVueVForDirective(textToDoc, print, path, options2) {
  const value = getUnescapedAttributeValue(path.node);
  const {
    left,
    operator,
    right
  } = parseVueVForDirective(value);
  const parseWithTs = is_vue_sfc_with_typescript_script_default(path, options2);
  return [group(await formatAttributeValue(`function _(${left}) {}`, textToDoc, {
    parser: parseWithTs ? "babel-ts" : "babel",
    __isVueForBindingLeft: true
  })), " ", operator, " ", await formatAttributeValue(right, textToDoc, {
    parser: parseWithTs ? "__ts_expression" : "__js_expression"
  })];
}
function parseVueVForDirective(value) {
  const forAliasRE = /(.*?)\s+(in|of)\s+(.*)/s;
  const inMatch = value.match(forAliasRE);
  if (!inMatch) {
    return;
  }
  const res = {
    for: inMatch[3].trim()
  };
  if (!res.for) {
    return;
  }
  const forIteratorRE = /,([^,\]}]*)(?:,([^,\]}]*))?$/;
  const stripParensRE = /^\(|\)$/g;
  const alias = method_replace_all_default(
    /* OPTIONAL_OBJECT: false */
    0,
    inMatch[1].trim(),
    stripParensRE,
    ""
  );
  const iteratorMatch = alias.match(forIteratorRE);
  if (iteratorMatch) {
    res.alias = alias.replace(forIteratorRE, "");
    res.iterator1 = iteratorMatch[1].trim();
    if (iteratorMatch[2]) {
      res.iterator2 = iteratorMatch[2].trim();
    }
  } else {
    res.alias = alias;
  }
  const left = [res.alias, res.iterator1, res.iterator2];
  if (left.some((part, index) => !part && (index === 0 || left.slice(index + 1).some(Boolean)))) {
    return;
  }
  return {
    left: left.filter(Boolean).join(","),
    operator: inMatch[2],
    right: res.for
  };
}

// src/language-html/embed/vue-attributes.js
var printers2 = (
  /** @type {AttributeValuePrinter[]} */
  [
    {
      test: (path) => path.node.fullName === "v-for",
      print: printVueVForDirective
    },
    {
      test: (path, options2) => path.node.fullName === "generic" && isVueScriptTag(path.parent, options2),
      print: printVueScriptGenericAttributeValue
    },
    {
      test: ({ node }, options2) => isVueSlotAttribute(node) || isVueSfcBindingsAttribute(node, options2),
      print: printVueBindings
    },
    {
      /*
      - `@click="jsStatement"`
      - `@click="jsExpression"`
      - `v-on:click="jsStatement"`
      - `v-on:click="jsExpression"`
      */
      test(path) {
        const name = path.node.fullName;
        return name.startsWith("@") || name.startsWith("v-on:");
      },
      print: printVueVOnDirective
    },
    {
      /*
      - `:property="vueExpression"`
      - `.property="vueExpression"`
      - `v-bind:property="vueExpression"`
      */
      test(path) {
        const name = path.node.fullName;
        return name.startsWith(":") || name.startsWith(".") || name.startsWith("v-bind:");
      },
      print: printVueVBindDirective
    },
    {
      /*
      - `v-if="jsExpression"`
      */
      test: (path) => path.node.fullName.startsWith("v-"),
      print: printExpression
    }
  ].map(({ test, print }) => ({
    test: (path, options2) => options2.parser === "vue" && test(path, options2),
    print
  }))
);
async function printVueVOnDirective(textToDoc, print, path, options2) {
  try {
    return await printExpression(textToDoc, print, path, options2);
  } catch (error) {
    if (error.cause?.code !== "BABEL_PARSER_SYNTAX_ERROR") {
      throw error;
    }
  }
  const text = getUnescapedAttributeValue(path.node);
  const parser = is_vue_sfc_with_typescript_script_default(path, options2) ? "__vue_ts_event_binding" : "__vue_event_binding";
  return formatAttributeValue(
    text,
    textToDoc,
    { parser },
    shouldHugJsExpression
  );
}
function printVueVBindDirective(textToDoc, print, path, options2) {
  const text = getUnescapedAttributeValue(path.node);
  const parser = is_vue_sfc_with_typescript_script_default(path, options2) ? "__vue_ts_expression" : "__vue_expression";
  return formatAttributeValue(
    text,
    textToDoc,
    { parser },
    shouldHugJsExpression
  );
}
function printExpression(textToDoc, print, path, options2) {
  const text = getUnescapedAttributeValue(path.node);
  const parser = is_vue_sfc_with_typescript_script_default(path, options2) ? "__ts_expression" : "__js_expression";
  return formatAttributeValue(
    text,
    textToDoc,
    { parser },
    shouldHugJsExpression
  );
}
var vue_attributes_default = printers2;

// src/language-html/embed/attribute.js
var printers3 = [{
  test: isSrcset,
  print: printSrcset
}, {
  test: isStyle,
  print: printStyle
}, {
  test: isEventHandler,
  print: printEventHandler
}, {
  test: isClassNames,
  print: printClassNames
}, {
  test: isPermissionsPolicy,
  print: printPermissionsPolicy
}, ...vue_attributes_default, ...angular_attributes_default].map(({
  test,
  print
}) => ({
  test,
  print: createAttributePrinter(print)
}));
function printAttribute(path, options2) {
  const {
    node
  } = path;
  const {
    value
  } = node;
  if (!value) {
    return;
  }
  if (shouldUnquoteAttributeValue(node, options2)) {
    return [node.rawName, "=", value];
  }
  return printers3.find(({
    test
  }) => test(path, options2))?.print;
}
function createAttributePrinter(printValue) {
  return async (textToDoc, print, path, options2) => {
    let valueDoc = await printValue(textToDoc, print, path, options2);
    if (!valueDoc) {
      return;
    }
    valueDoc = mapDoc(valueDoc, (doc) => typeof doc === "string" ? method_replace_all_default(
      /* OPTIONAL_OBJECT: false */
      0,
      doc,
      '"',
      "&quot;"
    ) : doc);
    return [path.node.rawName, '="', group(valueDoc), '"'];
  };
}
var attribute_default = printAttribute;

// src/language-html/loc.js
var locStart = (node) => node.sourceSpan.start.offset;
var locEnd = (node) => node.sourceSpan.end.offset;

// src/language-html/print/tag.js
function printClosingTag(node, options2) {
  return [
    node.isSelfClosing ? "" : printClosingTagStart(node, options2),
    printClosingTagEnd(node, options2)
  ];
}
function printClosingTagStart(node, options2) {
  return node.lastChild && needsToBorrowParentClosingTagStartMarker(node.lastChild) ? "" : [
    printClosingTagPrefix(node, options2),
    printClosingTagStartMarker(node, options2)
  ];
}
function printClosingTagEnd(node, options2) {
  return (node.next ? needsToBorrowPrevClosingTagEndMarker(node.next) : needsToBorrowLastChildClosingTagEndMarker(node.parent)) ? "" : [
    printClosingTagEndMarker(node, options2),
    printClosingTagSuffix(node, options2)
  ];
}
function printClosingTagPrefix(node, options2) {
  return needsToBorrowLastChildClosingTagEndMarker(node) ? printClosingTagEndMarker(node.lastChild, options2) : "";
}
function printClosingTagSuffix(node, options2) {
  return needsToBorrowParentClosingTagStartMarker(node) ? printClosingTagStartMarker(node.parent, options2) : needsToBorrowNextOpeningTagStartMarker(node) ? printOpeningTagStartMarker(node.next, options2) : "";
}
function printClosingTagStartMarker(node, options2) {
  if (false) {
    noop_default(!node.isSelfClosing);
  }
  if (shouldNotPrintClosingTag(node, options2)) {
    return "";
  }
  switch (node.kind) {
    case "ieConditionalComment":
      return "<!";
    case "element":
      if (node.hasHtmComponentClosingTag) {
        return "<//";
      }
    // fall through
    default:
      return `</${node.rawName}`;
  }
}
function printClosingTagEndMarker(node, options2) {
  if (shouldNotPrintClosingTag(node, options2)) {
    return "";
  }
  switch (node.kind) {
    case "ieConditionalComment":
    case "ieConditionalEndComment":
      return "[endif]-->";
    case "ieConditionalStartComment":
      return "]><!-->";
    case "interpolation":
      return "}}";
    case "angularIcuExpression":
      return "}";
    case "element":
      if (node.isSelfClosing) {
        return "/>";
      }
    // fall through
    default:
      return ">";
  }
}
function shouldNotPrintClosingTag(node, options2) {
  return !node.isSelfClosing && !node.endSourceSpan && (hasPrettierIgnore(node) || shouldPreserveContent(node.parent, options2));
}
function needsToBorrowPrevClosingTagEndMarker(node) {
  return node.prev && node.prev.kind !== "docType" && node.kind !== "angularControlFlowBlock" && !isTextLikeNode(node.prev) && node.isLeadingSpaceSensitive && !node.hasLeadingSpaces;
}
function needsToBorrowLastChildClosingTagEndMarker(node) {
  return node.lastChild?.isTrailingSpaceSensitive && !node.lastChild.hasTrailingSpaces && !isTextLikeNode(getLastDescendant(node.lastChild)) && !isPreLikeNode(node);
}
function needsToBorrowParentClosingTagStartMarker(node) {
  return !node.next && !node.hasTrailingSpaces && node.isTrailingSpaceSensitive && isTextLikeNode(getLastDescendant(node));
}
function needsToBorrowNextOpeningTagStartMarker(node) {
  return node.next && !isTextLikeNode(node.next) && isTextLikeNode(node) && node.isTrailingSpaceSensitive && !node.hasTrailingSpaces;
}
function getPrettierIgnoreAttributeCommentData(value) {
  const match = value.trim().match(/^prettier-ignore-attribute(?:\s+(.+))?$/s);
  if (!match) {
    return false;
  }
  if (!match[1]) {
    return true;
  }
  return match[1].split(/\s+/);
}
function needsToBorrowParentOpeningTagEndMarker(node) {
  return !node.prev && node.isLeadingSpaceSensitive && !node.hasLeadingSpaces;
}
function printAttributes(path, options2, print) {
  const { node } = path;
  const { attrs: attributes = [], startTagComments = [] } = node;
  if (attributes.length === 0 && startTagComments.length === 0) {
    return node.isSelfClosing ? (
      /**
       *     <br />
       *        ^
       */
      " "
    ) : "";
  }
  const ignoreAttributeData = node.prev?.kind === "comment" && getPrettierIgnoreAttributeCommentData(node.prev.value);
  const hasPrettierIgnoreAttribute = typeof ignoreAttributeData === "boolean" ? () => ignoreAttributeData : Array.isArray(ignoreAttributeData) ? (attribute) => ignoreAttributeData.includes(attribute.rawName) : () => false;
  const properties = ["attrs", "startTagComments"].filter(
    (property) => is_non_empty_array_default(node[property])
  );
  const printedAttributes = properties.flatMap(
    (property) => path.map(
      ({ node: node2 }) => ({
        loc: locStart(node2),
        printed: node2.kind === "attribute" && hasPrettierIgnoreAttribute(node2) ? replaceEndOfLine(
          options2.originalText.slice(locStart(node2), locEnd(node2))
        ) : print()
      }),
      property
    )
  );
  if (properties.length > 1) {
    printedAttributes.sort((a, b) => a.loc - b.loc);
  }
  const forceNotToBreakAttrContent = node.kind === "element" && node.fullName === "script" && attributes.length === 1 && attributes[0].fullName === "src" && node.children.length === 0 && startTagComments.length === 0;
  const shouldForceBreak = startTagComments.some(
    (comment) => comment.type === "single"
  );
  const shouldPrintAttributePerLine = shouldForceBreak || options2.singleAttributePerLine && attributes.length > 1 && !isVueSfcBlock(node, options2);
  const attributeLine = shouldPrintAttributePerLine ? hardline : line;
  const parts = [
    indent([
      forceNotToBreakAttrContent ? " " : shouldForceBreak ? hardline : line,
      join(
        attributeLine,
        printedAttributes.map(({ printed }) => printed)
      )
    ])
  ];
  if (
    /**
     *     123<a
     *       attr
     *           ~
     *       >456
     */
    node.firstChild && needsToBorrowParentOpeningTagEndMarker(node.firstChild) || /**
     *     <span
     *       >123<meta
     *                ~
     *     /></span>
     */
    node.isSelfClosing && needsToBorrowLastChildClosingTagEndMarker(node.parent) || forceNotToBreakAttrContent
  ) {
    parts.push(node.isSelfClosing ? " " : "");
  } else {
    parts.push(
      options2.bracketSameLine ? node.isSelfClosing ? " " : "" : node.isSelfClosing ? line : softline
    );
  }
  return parts;
}
function printOpeningTagEnd(node) {
  return node.firstChild && needsToBorrowParentOpeningTagEndMarker(node.firstChild) ? "" : printOpeningTagEndMarker(node);
}
function printOpeningTag(path, options2, print) {
  const { node } = path;
  return [
    printOpeningTagStart(node, options2),
    printAttributes(path, options2, print),
    node.isSelfClosing ? "" : printOpeningTagEnd(node)
  ];
}
function printOpeningTagStart(node, options2) {
  return node.prev && needsToBorrowNextOpeningTagStartMarker(node.prev) ? "" : [
    printOpeningTagPrefix(node, options2),
    printOpeningTagStartMarker(node, options2)
  ];
}
function printOpeningTagPrefix(node, options2) {
  return needsToBorrowParentOpeningTagEndMarker(node) ? printOpeningTagEndMarker(node.parent) : needsToBorrowPrevClosingTagEndMarker(node) ? printClosingTagEndMarker(node.prev, options2) : "";
}
var HTML5_DOCTYPE_START_MARKER = "<!doctype";
function printOpeningTagStartMarker(node, options2) {
  switch (node.kind) {
    case "ieConditionalComment":
    case "ieConditionalStartComment":
      return `<!--[if ${node.condition}`;
    case "ieConditionalEndComment":
      return "<!--<!";
    case "interpolation":
      return "{{";
    case "docType": {
      if (node.value === "html") {
        const { filepath } = options2;
        if (filepath && /\.html?$/.test(filepath)) {
          return HTML5_DOCTYPE_START_MARKER;
        }
      }
      const start = locStart(node);
      return options2.originalText.slice(
        start,
        start + HTML5_DOCTYPE_START_MARKER.length
      );
    }
    case "angularIcuExpression":
      return "{";
    case "element":
      if (node.condition) {
        return `<!--[if ${node.condition}]><!--><${node.rawName}`;
      }
    // fall through
    default:
      return `<${node.rawName}`;
  }
}
function printOpeningTagEndMarker(node) {
  if (false) {
    noop_default(!node.isSelfClosing);
  }
  switch (node.kind) {
    case "ieConditionalComment":
      return "]>";
    case "element":
      if (node.condition) {
        return "><!--<![endif]-->";
      }
    // fall through
    default:
      return ">";
  }
}

// src/language-html/get-node-content.js
function getNodeContent(node, options2) {
  if (!node.endSourceSpan) {
    return "";
  }
  let start = node.startSourceSpan.end.offset;
  if (node.firstChild && needsToBorrowParentOpeningTagEndMarker(node.firstChild)) {
    start -= printOpeningTagEndMarker(node).length;
  }
  let end = node.endSourceSpan.start.offset;
  if (node.lastChild && needsToBorrowParentClosingTagStartMarker(node.lastChild)) {
    end += printClosingTagStartMarker(node, options2).length;
  } else if (needsToBorrowLastChildClosingTagEndMarker(node)) {
    end -= printClosingTagEndMarker(node.lastChild, options2).length;
  }
  return options2.originalText.slice(start, end);
}
var get_node_content_default = getNodeContent;

// src/language-html/embed.js
var embeddedAngularControlFlowBlocks = /* @__PURE__ */ new Set([
  "if",
  "else if",
  "for",
  "switch",
  "case"
]);
function embed(path, options2) {
  const { node } = path;
  switch (node.kind) {
    case "element":
      if (isScriptLikeTag(node, options2) || node.kind === "interpolation") {
        return;
      }
      if (!node.isSelfClosing && isVueNonHtmlBlock(node, options2)) {
        const parser = inferElementParser(node, options2);
        if (!parser) {
          return;
        }
        return async (textToDoc, print) => {
          const content = get_node_content_default(node, options2);
          let isEmpty = /^\s*$/.test(content);
          let doc = "";
          if (!isEmpty) {
            doc = await textToDoc(htmlTrimPreserveIndentation(content), {
              parser,
              __embeddedInHtml: true
            });
            isEmpty = doc === "";
          }
          return [
            printOpeningTagPrefix(node, options2),
            group(printOpeningTag(path, options2, print)),
            isEmpty ? "" : hardline,
            doc,
            isEmpty ? "" : hardline,
            printClosingTag(node, options2),
            printClosingTagSuffix(node, options2)
          ];
        };
      }
      break;
    case "text":
      if (isScriptLikeTag(node.parent, options2)) {
        const parser = inferElementParser(node.parent, options2);
        if (parser) {
          return async (textToDoc) => {
            const value = parser === "markdown" ? html_whitespace_default.dedentString(
              node.value.replace(/^[^\S\n]*\n/, "")
            ) : node.value;
            const textToDocOptions = { parser, __embeddedInHtml: true };
            if (options2.parser === "html" && parser === "babel") {
              let sourceType = "script";
              const { attrMap } = node.parent;
              if (attrMap && (attrMap.type === "module" || (attrMap.type === "text/babel" || attrMap.type === "text/jsx") && attrMap["data-type"] === "module")) {
                sourceType = "module";
              }
              textToDocOptions.__babelSourceType = sourceType;
            }
            return [
              breakParent,
              printOpeningTagPrefix(node, options2),
              await textToDoc(value, textToDocOptions),
              printClosingTagSuffix(node, options2)
            ];
          };
        }
      } else if (node.parent.kind === "interpolation") {
        return async (textToDoc) => {
          const textToDocOptions = {
            __isInHtmlInterpolation: true,
            // to avoid unexpected `}}`
            __embeddedInHtml: true
          };
          if (options2.parser === "angular") {
            textToDocOptions.parser = "__ng_interpolation";
          } else if (options2.parser === "vue") {
            textToDocOptions.parser = is_vue_sfc_with_typescript_script_default(
              path,
              options2
            ) ? "__vue_ts_expression" : "__vue_expression";
          } else {
            textToDocOptions.parser = "__js_expression";
          }
          return [
            indent([line, await textToDoc(node.value, textToDocOptions)]),
            node.parent.next && needsToBorrowPrevClosingTagEndMarker(node.parent.next) ? " " : line
          ];
        };
      }
      break;
    case "attribute":
      return attribute_default(path, options2);
    case "angularControlFlowBlockParameters":
      if (!embeddedAngularControlFlowBlocks.has(path.parent.name)) {
        return;
      }
      return angular_control_flow_block_parameters_default;
    case "angularLetDeclarationInitializer":
      return (textToDoc) => formatAttributeValue(node.value, textToDoc, {
        parser: "__ng_binding",
        __isInHtmlAttribute: false
      });
  }
}
var embed_default = embed;

// node_modules/to-fast-properties/index.js
var fastProto = null;
function FastObject(object) {
  if (fastProto !== null && typeof fastProto.property) {
    const result = fastProto;
    fastProto = FastObject.prototype = null;
    return result;
  }
  fastProto = FastObject.prototype = object == null ? /* @__PURE__ */ Object.create(null) : object;
  return new FastObject();
}
var inlineCacheCutoff = 10;
for (let index = 0; index <= inlineCacheCutoff; index++) {
  FastObject();
}
function toFastproperties(object) {
  return FastObject(object);
}

// src/utilities/create-get-visitor-keys.js
function createGetVisitorKeys(visitorKeys, typeProperty = "type") {
  toFastproperties(visitorKeys);
  function getVisitorKeys2(node) {
    const type = node[typeProperty];
    if (false) {
      throw new Error(
        `Can't get node type, you must pass the wrong typeProperty '${typeProperty}'`
      );
    }
    const keys = visitorKeys[type];
    if (!Array.isArray(keys)) {
      throw Object.assign(new Error(`Missing visitor keys for '${type}'.`), {
        node
      });
    }
    return keys;
  }
  return getVisitorKeys2;
}
var create_get_visitor_keys_default = createGetVisitorKeys;

// src/language-html/visitor-keys.evaluate.js
var vk = [
  ["children"]
];
var visitor_keys_evaluate_default = {
  root: vk[0],
  element: ["attrs", "startTagComments", "children"],
  ieConditionalComment: vk[0],
  ieConditionalStartComment: [],
  ieConditionalEndComment: [],
  interpolation: vk[0],
  text: vk[0],
  docType: [],
  comment: [],
  attribute: [],
  startTagComment: [],
  cdata: [],
  angularControlFlowBlock: ["children", "parameters"],
  angularControlFlowBlockParameters: vk[0],
  angularControlFlowBlockParameter: [],
  angularLetDeclaration: ["init"],
  angularLetDeclarationInitializer: [],
  angularIcuExpression: ["cases"],
  angularIcuCase: ["expression"]
};

// src/language-html/get-visitor-keys.js
var getVisitorKeys = create_get_visitor_keys_default(visitor_keys_evaluate_default, "kind");
var get_visitor_keys_default = getVisitorKeys;

// src/language-html/massage-ast/index.js
var ignoredProperties = /* @__PURE__ */ new Set(["sourceSpan", "startSourceSpan", "endSourceSpan", "nameSpan", "valueSpan", "keySpan", "tagDefinition", "tokens", "valueTokens", "switchValueSourceSpan", "expSourceSpan", "valueSourceSpan"]);
var embeddedAngularControlFlowBlocks2 = /* @__PURE__ */ new Set(["if", "else if", "for", "switch", "case"]);
function massageAstNode(original, cloned, parent) {
  if (original.kind === "text" || original.kind === "comment") {
    return null;
  }
  if (original.kind === "yaml") {
    delete cloned.value;
  }
  if (original.kind === "attribute") {
    const {
      fullName: name,
      value
    } = original;
    if (
      // HTML attributes
      name === "style" || name === "class" || name === "srcset" && (parent.fullName === "img" || parent.fullName === "source") || name === "allow" && parent.fullName === "iframe" || name.startsWith("on") || // Vue.js attributes
      name.startsWith("@") || name.startsWith(":") || name.startsWith(".") || name.startsWith("#") || name.startsWith("v-") || name === "vars" && parent.fullName === "style" || (name === "setup" || name === "generic") && parent.fullName === "script" || name === "slot-scope" || // Angular attributes
      name.startsWith("(") || name.startsWith("[") || name.startsWith("*") || name.startsWith("bind") || name.startsWith("i18n") || name.startsWith("on-") || name.startsWith("ng-") || value?.includes("{{")
    ) {
      delete cloned.value;
    } else if (value) {
      cloned.value = method_replace_all_default(
        /* OPTIONAL_OBJECT: false */
        0,
        value,
        /'|&quot;|&apos;/g,
        '"'
      );
    }
  }
  if (original.kind === "docType") {
    cloned.value = method_replace_all_default(
      /* OPTIONAL_OBJECT: false */
      0,
      original.value.toLowerCase(),
      /\s+/g,
      " "
    );
  }
  if (original.kind === "angularControlFlowBlock" && original.parameters?.children) {
    for (const parameter of cloned.parameters.children) {
      if (embeddedAngularControlFlowBlocks2.has(original.name)) {
        delete parameter.expression;
      } else {
        parameter.expression = parameter.expression.trim();
      }
    }
  }
  if (original.kind === "angularIcuExpression") {
    cloned.switchValue = original.switchValue.trim();
  }
  if (original.kind === "angularLetDeclarationInitializer") {
    delete cloned.value;
  }
  if (original.kind === "element" && original.isVoid && !original.isSelfClosing) {
    cloned.isSelfClosing = true;
  }
}
massageAstNode.ignoredProperties = ignoredProperties;

// src/utilities/pragma/pragma.evaluate.js
var FORMAT_PRAGMA_TO_INSERT = "format";
var HTML_HAS_IGNORE_PRAGMA_REGEXP = /^\s*<!--\s*@(?:noformat|noprettier)\s*-->/;
var HTML_HAS_PRAGMA_REGEXP = /^\s*<!--\s*@(?:format|prettier)\s*-->/;

// src/language-html/pragma.js
var hasPragma = (text) => HTML_HAS_PRAGMA_REGEXP.test(text);
var hasIgnorePragma = (text) => HTML_HAS_IGNORE_PRAGMA_REGEXP.test(text);
var insertPragma = (text) => `<!-- @${FORMAT_PRAGMA_TO_INSERT} -->

${text}`;

// src/language-html/print/angular-control-flow-block-settings.evaluate.js
var ANGULAR_CONTROL_FLOW_BLOCK_SETTINGS = /* @__PURE__ */ new Map([
  [
    "if",
    /* @__PURE__ */ new Set([
      "else if",
      "else"
    ])
  ],
  [
    "else if",
    /* @__PURE__ */ new Set([
      "else if",
      "else"
    ])
  ],
  [
    "for",
    /* @__PURE__ */ new Set([
      "empty"
    ])
  ],
  [
    "defer",
    /* @__PURE__ */ new Set([
      "placeholder",
      "error",
      "loading"
    ])
  ],
  [
    "placeholder",
    /* @__PURE__ */ new Set([
      "placeholder",
      "error",
      "loading"
    ])
  ],
  [
    "error",
    /* @__PURE__ */ new Set([
      "placeholder",
      "error",
      "loading"
    ])
  ],
  [
    "loading",
    /* @__PURE__ */ new Set([
      "placeholder",
      "error",
      "loading"
    ])
  ],
  [
    "boundary",
    /* @__PURE__ */ new Set([
      "error"
    ])
  ]
]);

// src/language-html/print/children.js
function getEndLocation(node) {
  const endLocation = locEnd(node);
  if (node.kind === "element" && !node.endSourceSpan && is_non_empty_array_default(node.children)) {
    return Math.max(endLocation, getEndLocation(method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      node.children,
      -1
    )));
  }
  return endLocation;
}
function printChild(path, options2, print) {
  const child = path.node;
  if (hasPrettierIgnore(child)) {
    const endLocation = getEndLocation(child);
    return [printOpeningTagPrefix(child, options2), replaceEndOfLine(html_whitespace_default.trimEnd(options2.originalText.slice(locStart(child) + (child.prev && needsToBorrowNextOpeningTagStartMarker(child.prev) ? printOpeningTagStartMarker(child).length : 0), endLocation - (child.next && needsToBorrowPrevClosingTagEndMarker(child.next) ? printClosingTagEndMarker(child, options2).length : 0)))), printClosingTagSuffix(child, options2)];
  }
  return print();
}
function printBetweenLine(prevNode, nextNode) {
  if (isTextLikeNode(prevNode) && isTextLikeNode(nextNode)) {
    if (prevNode.isTrailingSpaceSensitive) {
      if (prevNode.hasTrailingSpaces) {
        if (preferHardlineAsLeadingSpaces(nextNode)) {
          return hardline;
        }
        return line;
      }
      return "";
    }
    if (preferHardlineAsLeadingSpaces(nextNode)) {
      return hardline;
    }
    return softline;
  }
  if (needsToBorrowNextOpeningTagStartMarker(prevNode) && (hasPrettierIgnore(nextNode) || /**
   *     123<a
   *          ~
   *       ><b>
   */
  nextNode.firstChild || /**
   *     123<!--
   *            ~
   *     -->
   */
  nextNode.isSelfClosing || /**
   *     123<span
   *             ~
   *       attr
   */
  nextNode.kind === "element" && nextNode.attrs.length > 0) || /**
   *     <img
   *       src="long"
   *                 ~
   *     />123
   */
  prevNode.kind === "element" && prevNode.isSelfClosing && needsToBorrowPrevClosingTagEndMarker(nextNode)) {
    return "";
  }
  if (nextNode.kind === "comment" && nextNode.isLeadingSpaceSensitive && !nextNode.hasLeadingSpaces) {
    return softline;
  }
  if (!nextNode.isLeadingSpaceSensitive || preferHardlineAsLeadingSpaces(nextNode) || /**
   *       Want to write us a letter? Use our<a
   *         ><b><a>mailing address</a></b></a
   *                                          ~
   *       >.
   */
  needsToBorrowPrevClosingTagEndMarker(nextNode) && prevNode.lastChild && needsToBorrowParentClosingTagStartMarker(prevNode.lastChild) && prevNode.lastChild.lastChild && needsToBorrowParentClosingTagStartMarker(prevNode.lastChild.lastChild)) {
    return hardline;
  }
  if (nextNode.hasLeadingSpaces) {
    return line;
  }
  return softline;
}
function printChildren(path, options2, print) {
  const {
    node
  } = path;
  if (forceBreakChildren(node)) {
    return [breakParent, ...path.map(() => {
      const childNode = path.node;
      const prevBetweenLine = !childNode.prev ? "" : printBetweenLine(childNode.prev, childNode);
      return [!prevBetweenLine ? "" : [prevBetweenLine, forceNextEmptyLine(childNode.prev) ? hardline : ""], printChild(path, options2, print)];
    }, "children")];
  }
  const groupIds = node.children.map(() => /* @__PURE__ */ Symbol(""));
  return path.map(({
    node: childNode,
    index: childIndex
  }) => {
    if (isTextLikeNode(childNode)) {
      if (childNode.prev && isTextLikeNode(childNode.prev)) {
        const prevBetweenLine2 = printBetweenLine(childNode.prev, childNode);
        if (prevBetweenLine2) {
          if (forceNextEmptyLine(childNode.prev)) {
            return [hardline, hardline, printChild(path, options2, print)];
          }
          return [prevBetweenLine2, printChild(path, options2, print)];
        }
      }
      return printChild(path, options2, print);
    }
    const prevParts = [];
    const leadingParts = [];
    const trailingParts = [];
    const nextParts = [];
    const prevBetweenLine = childNode.prev ? printBetweenLine(childNode.prev, childNode) : "";
    const nextBetweenLine = childNode.next ? printBetweenLine(childNode, childNode.next) : "";
    if (prevBetweenLine) {
      if (forceNextEmptyLine(childNode.prev)) {
        prevParts.push(hardline, hardline);
      } else if (prevBetweenLine === hardline) {
        prevParts.push(hardline);
      } else if (isTextLikeNode(childNode.prev)) {
        leadingParts.push(prevBetweenLine);
      } else {
        leadingParts.push(ifBreak("", softline, {
          groupId: groupIds[childIndex - 1]
        }));
      }
    }
    if (nextBetweenLine) {
      if (forceNextEmptyLine(childNode)) {
        if (isTextLikeNode(childNode.next)) {
          nextParts.push(hardline, hardline);
        }
      } else if (nextBetweenLine === hardline) {
        if (isTextLikeNode(childNode.next)) {
          nextParts.push(hardline);
        }
      } else {
        trailingParts.push(nextBetweenLine);
      }
    }
    return [...prevParts, group([...leadingParts, group([printChild(path, options2, print), ...trailingParts], {
      id: groupIds[childIndex]
    })]), ...nextParts];
  }, "children");
}

// src/language-html/print/angular-control-flow-block.js
function printAngularControlFlowBlock(path, options2, print) {
  const { node } = path;
  const docs = [];
  if (isPreviousBlockUnClosed(path)) {
    docs.push("} ");
  }
  docs.push("@", node.name);
  const isDefaultNever = isSwitchExhaustiveCheck(node);
  if (node.parameters) {
    if (!isDefaultNever) {
      docs.push(" ");
    }
    docs.push("(", group(print("parameters")), ")");
  }
  if (isDefaultNever) {
    docs.push(";");
    return docs;
  }
  if (!isSwitchFallthroughCase(node)) {
    docs.push(" {");
    const shouldPrintCloseBracket = shouldCloseBlock(node);
    if (node.children.length > 0) {
      node.firstChild.hasLeadingSpaces = true;
      node.lastChild.hasTrailingSpaces = true;
      docs.push(indent([hardline, printChildren(path, options2, print)]));
      if (shouldPrintCloseBracket) {
        docs.push(hardline, "}");
      }
    } else if (shouldPrintCloseBracket) {
      docs.push("}");
    }
  }
  return group(docs, { shouldBreak: true });
}
function shouldCloseBlock(node) {
  return !(node.next?.kind === "angularControlFlowBlock" && ANGULAR_CONTROL_FLOW_BLOCK_SETTINGS.get(node.name)?.has(node.next.name));
}
var isSwitchCaseBlock = (node) => node?.kind === "angularControlFlowBlock" && (node.name === "case" || node.name === "default");
var isSwitchExhaustiveCheck = (node) => node?.kind === "angularControlFlowBlock" && node.name === "default never";
function isSwitchFallthroughCase(node) {
  return isSwitchCaseBlock(node) && node.endSourceSpan && node.endSourceSpan.start.offset === node.endSourceSpan.end.offset;
}
function isPreviousBlockUnClosed(path) {
  const { previous } = path;
  return previous?.kind === "angularControlFlowBlock" && !hasPrettierIgnore(previous) && !shouldCloseBlock(previous);
}
function printAngularControlFlowBlockParameters2(path, options2, print) {
  return [
    indent([softline, join([";", line], path.map(print, "children"))]),
    softline
  ];
}

// src/language-html/print/angular-icu-expression.js
function printAngularIcuExpression(path, options2, print) {
  const { node } = path;
  return [
    printOpeningTagStart(node, options2),
    group([
      node.switchValue.trim(),
      ", ",
      node.type,
      node.cases.length > 0 ? [",", indent([line, join(line, path.map(print, "cases"))])] : "",
      softline
    ]),
    printClosingTagEnd(node, options2)
  ];
}
function printAngularIcuCase(path, options2, print) {
  const { node } = path;
  return [
    node.value,
    " {",
    group([
      indent([
        softline,
        path.map(({ node: node2, isLast }) => {
          const parts = [print()];
          if (node2.kind === "text") {
            if (node2.hasLeadingSpaces) {
              parts.unshift(line);
            }
            if (node2.hasTrailingSpaces && !isLast) {
              parts.push(line);
            }
          }
          return parts;
        }, "expression")
      ]),
      softline
    ]),
    "}"
  ];
}

// src/language-html/print/element.js
function printElement(path, options2, print) {
  const {
    node
  } = path;
  if (shouldPreserveContent(node, options2)) {
    return [printOpeningTagPrefix(node, options2), group(printOpeningTag(path, options2, print)), replaceEndOfLine(get_node_content_default(node, options2)), ...printClosingTag(node, options2), printClosingTagSuffix(node, options2)];
  }
  const shouldHugContent = node.children.length === 1 && (node.firstChild.kind === "interpolation" || node.firstChild.kind === "angularIcuExpression") && node.firstChild.isLeadingSpaceSensitive && !node.firstChild.hasLeadingSpaces && node.lastChild.isTrailingSpaceSensitive && !node.lastChild.hasTrailingSpaces;
  const attrGroupId = /* @__PURE__ */ Symbol("element-attr-group-id");
  const printTag = (doc) => group([group(printOpeningTag(path, options2, print), {
    id: attrGroupId
  }), doc, printClosingTag(node, options2)]);
  if (node.children.length === 0) {
    return printTag(node.hasDanglingSpaces && node.isDanglingSpaceSensitive ? line : "");
  }
  const printChildrenDoc = (childrenDoc) => {
    if (shouldHugContent) {
      return indentIfBreak(childrenDoc, {
        groupId: attrGroupId
      });
    }
    if ((isScriptLikeTag(node, options2) || isVueCustomBlock(node, options2)) && node.parent.kind === "root" && options2.parser === "vue" && !options2.vueIndentScriptAndStyle) {
      return childrenDoc;
    }
    return indent(childrenDoc);
  };
  const printLineBeforeChildren = () => {
    if (shouldHugContent) {
      return ifBreak(softline, "", {
        groupId: attrGroupId
      });
    }
    if (node.firstChild.hasLeadingSpaces && node.firstChild.isLeadingSpaceSensitive) {
      return line;
    }
    if (node.firstChild.kind === "text" && node.isWhitespaceSensitive && node.isIndentationSensitive) {
      return dedentToRoot(softline);
    }
    return softline;
  };
  const printLineAfterChildren = () => {
    const needsToBorrow = node.next ? needsToBorrowPrevClosingTagEndMarker(node.next) : needsToBorrowLastChildClosingTagEndMarker(node.parent);
    if (needsToBorrow) {
      if (node.lastChild.hasTrailingSpaces && node.lastChild.isTrailingSpaceSensitive) {
        return " ";
      }
      return "";
    }
    if (isPreLikeNode(node) && needsToBorrowParentClosingTagStartMarker(node.lastChild)) {
      return "";
    }
    if (shouldHugContent) {
      return ifBreak(softline, "", {
        groupId: attrGroupId
      });
    }
    if (node.lastChild.hasTrailingSpaces && node.lastChild.isTrailingSpaceSensitive) {
      return line;
    }
    if ((node.lastChild.kind === "comment" || node.lastChild.kind === "text" && node.isWhitespaceSensitive && node.isIndentationSensitive) && new RegExp(`\\n[\\t ]{${options2.tabWidth * (path.ancestors.length - 1)}}$`).test(node.lastChild.value)) {
      return "";
    }
    return softline;
  };
  return printTag([forceBreakContent(node) ? breakParent : "", printChildrenDoc([printLineBeforeChildren(), printChildren(path, options2, print)]), printLineAfterChildren()]);
}

// src/language-html/print/start-tag-comment.js
function printStartTagComment(path) {
  const {
    node: { value, type }
  } = path;
  if (type === "single") {
    return `//${value.trimEnd()}`;
  }
  return ["/*", replaceEndOfLine(value), "*/"];
}

// node_modules/angular-html-parser/dist/compiler/src/ml_parser/tags.mjs
var TagContentType = /* @__PURE__ */ (function(TagContentType2) {
  TagContentType2[TagContentType2["RAW_TEXT"] = 0] = "RAW_TEXT";
  TagContentType2[TagContentType2["ESCAPABLE_RAW_TEXT"] = 1] = "ESCAPABLE_RAW_TEXT";
  TagContentType2[TagContentType2["PARSABLE_DATA"] = 2] = "PARSABLE_DATA";
  return TagContentType2;
})({});
function splitNsName(elementName, fatal = true) {
  if (elementName[0] != ":") return [null, elementName];
  const colonIndex = elementName.indexOf(":", 1);
  if (colonIndex === -1) {
    if (fatal) throw new Error(`Unsupported format "${elementName}" expecting ":namespace:name"`);
    else return [null, elementName];
  }
  return [elementName.slice(1, colonIndex), elementName.slice(colonIndex + 1)];
}
function isNgContainer(tagName) {
  return splitNsName(tagName)[1] === "ng-container";
}
function isNgContent(tagName) {
  return splitNsName(tagName)[1] === "ng-content";
}
function getNsPrefix(fullName) {
  return fullName === null ? null : splitNsName(fullName)[0];
}
function mergeNsAndName(prefix, localName) {
  return prefix ? `:${prefix}:${localName}` : localName;
}

// node_modules/angular-html-parser/dist/compiler/src/schema/dom_security_schema.mjs
var _SECURITY_SCHEMA;
var MATH_ML_NAMESPACE = "math";
var NO_NAMESPACE = "";
var MATCH_ALL_ELEMENTS = "*";
var createNullObj = () => /* @__PURE__ */ Object.create(null);
function SECURITY_SCHEMA() {
  if (_SECURITY_SCHEMA) return _SECURITY_SCHEMA;
  _SECURITY_SCHEMA = createNullObj();
  registerContext(
    1,
    /** Namespace */
    void 0,
    [["iframe", ["srcdoc"]], ["*", ["innerHTML", "outerHTML"]]]
  );
  registerContext(
    2,
    /** Namespace */
    void 0,
    [["*", ["style"]]]
  );
  registerContext(
    4,
    /** Namespace */
    void 0,
    [
      ["*", ["formAction"]],
      ["area", ["href"]],
      ["a", ["href", "xlink:href"]],
      ["form", ["action"]],
      ["img", ["src"]],
      ["video", ["src"]]
    ]
  );
  registerContext(4, MATH_ML_NAMESPACE, [["*", ["href", "xlink:href"]]]);
  registerContext(
    5,
    /** Namespace */
    void 0,
    [
      ["base", ["href"]],
      ["embed", ["src"]],
      ["frame", ["src"]],
      ["iframe", ["src"]],
      ["link", ["href"]],
      ["object", ["codebase", "data"]]
    ]
  );
  registerContext(4, "svg", [["a", ["href", "xlink:href"]]]);
  registerContext(6, "svg", [
    ["animate", [
      "attributeName",
      "values",
      "to",
      "from"
    ]],
    ["set", ["to", "attributeName"]],
    ["animateMotion", ["attributeName"]],
    ["animateTransform", ["attributeName"]]
  ]);
  registerContext(
    6,
    /** Namespace */
    void 0,
    [["unknown", [
      "attributeName",
      "values",
      "to",
      "from",
      "sandbox",
      "allow",
      "allowFullscreen",
      "referrerPolicy",
      "csp",
      "fetchPriority",
      "credentialless"
    ]], ["iframe", [
      "sandbox",
      "allow",
      "allowFullscreen",
      "referrerPolicy",
      "csp",
      "fetchPriority",
      "credentialless"
    ]]]
  );
  return _SECURITY_SCHEMA;
}
function registerContext(ctx, namespace, specs) {
  const nsKey = namespace ?? NO_NAMESPACE;
  for (const [element, attributeNames] of specs) {
    const tagName = element.toLowerCase();
    for (const attr of attributeNames) {
      var _SECURITY_SCHEMA2;
      const attrLower = attr.toLowerCase();
      const attrSchema = (_SECURITY_SCHEMA2 = _SECURITY_SCHEMA)[attrLower] ?? (_SECURITY_SCHEMA2[attrLower] = createNullObj());
      const nsSchema = attrSchema[nsKey] ?? (attrSchema[nsKey] = createNullObj());
      nsSchema[tagName] = ctx;
    }
  }
}
function checkSecurityContext(tagName, propName, namespace) {
  const attrSchema = SECURITY_SCHEMA()[propName.toLowerCase()];
  if (!attrSchema) return 0;
  const tagLower = tagName.toLowerCase();
  let context;
  if (namespace) {
    const nsSchema = attrSchema[namespace];
    if (nsSchema) context = nsSchema[tagLower] ?? nsSchema[MATCH_ALL_ELEMENTS];
  }
  if (context === void 0) {
    const defaultSchema = attrSchema[NO_NAMESPACE];
    if (defaultSchema) context = defaultSchema[tagLower] ?? defaultSchema[MATCH_ALL_ELEMENTS];
  }
  if (context === void 0 && (!namespace || namespace === NO_NAMESPACE)) {
    const svgSchema = attrSchema["svg"];
    if (svgSchema) context = svgSchema[tagLower];
  }
  return context ?? 0;
}

// node_modules/angular-html-parser/dist/compiler/src/core.mjs
var CUSTOM_ELEMENTS_SCHEMA = { name: "custom-elements" };
var NO_ERRORS_SCHEMA = { name: "no-errors-schema" };

// node_modules/angular-html-parser/dist/compiler/src/util.mjs
var DASH_CASE_REGEXP = /-+([a-z0-9])/g;
function dashCaseToCamelCase(input) {
  return input.replace(DASH_CASE_REGEXP, (...m) => m[1].toUpperCase());
}

// node_modules/angular-html-parser/dist/compiler/src/schema/element_schema_registry.mjs
var ElementSchemaRegistry = class {
};

// node_modules/angular-html-parser/dist/compiler/src/schema/dom_element_schema_registry.mjs
var BOOLEAN = "boolean";
var NUMBER = "number";
var STRING = "string";
var OBJECT = "object";
function normalizeTagName(tagName) {
  const tagNameLower = tagName.toLowerCase();
  const [ns, name] = splitNsName(tagNameLower, false);
  return ns === "svg" || ns === "math" ? `:${ns}:${name}` : name;
}
var SCHEMA = [
  "[Element]|textContent,%ariaActiveDescendantElement,%ariaAtomic,%ariaAutoComplete,%ariaBusy,%ariaChecked,%ariaColCount,%ariaColIndex,%ariaColIndexText,%ariaColSpan,%ariaControlsElements,%ariaCurrent,%ariaDescribedByElements,%ariaDescription,%ariaDetailsElements,%ariaDisabled,%ariaErrorMessageElements,%ariaExpanded,%ariaFlowToElements,%ariaHasPopup,%ariaHidden,%ariaInvalid,%ariaKeyShortcuts,%ariaLabel,%ariaLabelledByElements,%ariaLevel,%ariaLive,%ariaModal,%ariaMultiLine,%ariaMultiSelectable,%ariaOrientation,%ariaOwnsElements,%ariaPlaceholder,%ariaPosInSet,%ariaPressed,%ariaReadOnly,%ariaRelevant,%ariaRequired,%ariaRoleDescription,%ariaRowCount,%ariaRowIndex,%ariaRowIndexText,%ariaRowSpan,%ariaSelected,%ariaSetSize,%ariaSort,%ariaValueMax,%ariaValueMin,%ariaValueNow,%ariaValueText,%classList,className,elementTiming,id,innerHTML,*beforecopy,*beforecut,*beforepaste,*fullscreenchange,*fullscreenerror,*search,*webkitfullscreenchange,*webkitfullscreenerror,outerHTML,%part,#scrollLeft,#scrollTop,slot,*message,*mozfullscreenchange,*mozfullscreenerror,*mozpointerlockchange,*mozpointerlockerror,*webglcontextcreationerror,*webglcontextlost,*webglcontextrestored",
  "[HTMLElement]^[Element]|accessKey,autocapitalize,!autofocus,contentEditable,dir,!draggable,enterKeyHint,!hidden,!inert,innerText,inputMode,lang,nonce,*abort,*animationend,*animationiteration,*animationstart,*auxclick,*beforexrselect,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*formdata,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*paste,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerrawupdate,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*securitypolicyviolation,*seeked,*seeking,*select,*selectionchange,*selectstart,*slotchange,*stalled,*submit,*suspend,*timeupdate,*toggle,*transitioncancel,*transitionend,*transitionrun,*transitionstart,*volumechange,*waiting,*webkitanimationend,*webkitanimationiteration,*webkitanimationstart,*webkittransitionend,*wheel,outerText,!spellcheck,%style,#tabIndex,title,!translate,virtualKeyboardPolicy",
  "abbr,address,article,aside,b,bdi,bdo,cite,content,code,dd,dfn,dt,em,figcaption,figure,footer,header,hgroup,i,kbd,main,mark,nav,noscript,rb,rp,rt,rtc,ruby,s,samp,search,section,small,strong,sub,sup,u,var,wbr^[HTMLElement]|accessKey,autocapitalize,!autofocus,contentEditable,dir,!draggable,enterKeyHint,!hidden,innerText,inputMode,lang,nonce,*abort,*animationend,*animationiteration,*animationstart,*auxclick,*beforexrselect,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*formdata,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*paste,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerrawupdate,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*securitypolicyviolation,*seeked,*seeking,*select,*selectionchange,*selectstart,*slotchange,*stalled,*submit,*suspend,*timeupdate,*toggle,*transitioncancel,*transitionend,*transitionrun,*transitionstart,*volumechange,*waiting,*webkitanimationend,*webkitanimationiteration,*webkitanimationstart,*webkittransitionend,*wheel,outerText,!spellcheck,%style,#tabIndex,title,!translate,virtualKeyboardPolicy",
  "media^[HTMLElement]|!autoplay,!controls,%controlsList,%crossOrigin,#currentTime,!defaultMuted,#defaultPlaybackRate,!disableRemotePlayback,!loop,!muted,*encrypted,*waitingforkey,#playbackRate,preload,!preservesPitch,src,%srcObject,#volume",
  ":svg:^[HTMLElement]|!autofocus,nonce,*abort,*animationend,*animationiteration,*animationstart,*auxclick,*beforexrselect,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*formdata,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*paste,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerrawupdate,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*securitypolicyviolation,*seeked,*seeking,*select,*selectionchange,*selectstart,*slotchange,*stalled,*submit,*suspend,*timeupdate,*toggle,*transitioncancel,*transitionend,*transitionrun,*transitionstart,*volumechange,*waiting,*webkitanimationend,*webkitanimationiteration,*webkitanimationstart,*webkittransitionend,*wheel,%style,#tabIndex",
  ":svg:graphics^:svg:|",
  ":svg:animation^:svg:|*begin,*end,*repeat",
  ":svg:geometry^:svg:|",
  ":svg:componentTransferFunction^:svg:|",
  ":svg:gradient^:svg:|",
  ":svg:textContent^:svg:graphics|",
  ":svg:textPositioning^:svg:textContent|",
  "a^[HTMLElement]|charset,coords,download,hash,host,hostname,href,hreflang,name,password,pathname,ping,port,protocol,referrerPolicy,rel,%relList,rev,search,shape,target,text,type,username",
  "area^[HTMLElement]|alt,coords,download,hash,host,hostname,href,!noHref,password,pathname,ping,port,protocol,referrerPolicy,rel,%relList,search,shape,target,username",
  "audio^media|",
  "br^[HTMLElement]|clear",
  "base^[HTMLElement]|href,target",
  "body^[HTMLElement]|aLink,background,bgColor,link,*afterprint,*beforeprint,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*messageerror,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,text,vLink",
  "button^[HTMLElement]|!disabled,formAction,formEnctype,formMethod,!formNoValidate,formTarget,name,type,value",
  "canvas^[HTMLElement]|#height,#width",
  "content^[HTMLElement]|select",
  "dl^[HTMLElement]|!compact",
  "data^[HTMLElement]|value",
  "datalist^[HTMLElement]|",
  "details^[HTMLElement]|!open",
  "dialog^[HTMLElement]|!open,returnValue",
  "dir^[HTMLElement]|!compact",
  "div^[HTMLElement]|align",
  "embed^[HTMLElement]|align,height,name,src,type,width",
  "fieldset^[HTMLElement]|!disabled,name",
  "font^[HTMLElement]|color,face,size",
  "form^[HTMLElement]|acceptCharset,action,autocomplete,encoding,enctype,method,name,!noValidate,target",
  "frame^[HTMLElement]|frameBorder,longDesc,marginHeight,marginWidth,name,!noResize,scrolling,src",
  "frameset^[HTMLElement]|cols,*afterprint,*beforeprint,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*messageerror,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,rows",
  "geolocation^[HTMLElement]|accuracymode,!autolocate,*location,*promptaction,*promptdismiss,*validationstatuschange,!watch",
  "hr^[HTMLElement]|align,color,!noShade,size,width",
  "head^[HTMLElement]|",
  "h1,h2,h3,h4,h5,h6^[HTMLElement]|align",
  "html^[HTMLElement]|version",
  "iframe^[HTMLElement]|align,allow,!allowFullscreen,!allowPaymentRequest,csp,!credentialless,frameBorder,height,loading,longDesc,marginHeight,marginWidth,name,referrerPolicy,%sandbox,scrolling,src,srcdoc,width",
  "img^[HTMLElement]|align,alt,border,%crossOrigin,decoding,#height,#hspace,!isMap,loading,longDesc,lowsrc,name,referrerPolicy,sizes,src,srcset,useMap,#vspace,#width",
  "input^[HTMLElement]|accept,align,alt,autocomplete,!checked,!defaultChecked,defaultValue,dirName,!disabled,%files,formAction,formEnctype,formMethod,!formNoValidate,formTarget,#height,!incremental,!indeterminate,max,#maxLength,min,#minLength,!multiple,name,pattern,placeholder,!readOnly,!required,selectionDirection,#selectionEnd,#selectionStart,#size,src,step,type,useMap,value,%valueAsDate,#valueAsNumber,#width",
  "li^[HTMLElement]|type,#value",
  "label^[HTMLElement]|htmlFor",
  "legend^[HTMLElement]|align",
  "link^[HTMLElement]|as,charset,%crossOrigin,!disabled,href,hreflang,imageSizes,imageSrcset,integrity,media,referrerPolicy,rel,%relList,rev,%sizes,target,type",
  "map^[HTMLElement]|name",
  "marquee^[HTMLElement]|behavior,bgColor,direction,height,#hspace,#loop,#scrollAmount,#scrollDelay,!trueSpeed,#vspace,width",
  "menu^[HTMLElement]|!compact",
  "meta^[HTMLElement]|content,httpEquiv,media,name,scheme",
  "meter^[HTMLElement]|#high,#low,#max,#min,#optimum,#value",
  "ins,del^[HTMLElement]|cite,dateTime",
  "ol^[HTMLElement]|!compact,!reversed,#start,type",
  "object^[HTMLElement]|align,archive,border,code,codeBase,codeType,data,!declare,height,#hspace,name,standby,type,useMap,#vspace,width",
  "optgroup^[HTMLElement]|!disabled,label",
  "option^[HTMLElement]|!defaultSelected,!disabled,label,!selected,text,value",
  "output^[HTMLElement]|defaultValue,%htmlFor,name,value",
  "p^[HTMLElement]|align",
  "param^[HTMLElement]|name,type,value,valueType",
  "picture^[HTMLElement]|",
  "pre^[HTMLElement]|#width",
  "progress^[HTMLElement]|#max,#value",
  "q,blockquote,cite^[HTMLElement]|",
  "script^[HTMLElement]|!async,charset,%crossOrigin,!defer,event,htmlFor,integrity,!noModule,%referrerPolicy,src,text,type",
  "select^[HTMLElement]|autocomplete,!disabled,#length,!multiple,name,!required,#selectedIndex,#size,value",
  "selectedcontent^[HTMLElement]|",
  "slot^[HTMLElement]|name",
  "source^[HTMLElement]|#height,media,sizes,src,srcset,type,#width",
  "span^[HTMLElement]|",
  "style^[HTMLElement]|!disabled,media,type",
  "search^[HTMLELement]|",
  "caption^[HTMLElement]|align",
  "th,td^[HTMLElement]|abbr,align,axis,bgColor,ch,chOff,#colSpan,headers,height,!noWrap,#rowSpan,scope,vAlign,width",
  "col,colgroup^[HTMLElement]|align,ch,chOff,#span,vAlign,width",
  "table^[HTMLElement]|align,bgColor,border,%caption,cellPadding,cellSpacing,frame,rules,summary,%tFoot,%tHead,width",
  "tr^[HTMLElement]|align,bgColor,ch,chOff,vAlign",
  "tfoot,thead,tbody^[HTMLElement]|align,ch,chOff,vAlign",
  "template^[HTMLElement]|",
  "textarea^[HTMLElement]|autocomplete,#cols,defaultValue,dirName,!disabled,#maxLength,#minLength,name,placeholder,!readOnly,!required,#rows,selectionDirection,#selectionEnd,#selectionStart,value,wrap",
  "time^[HTMLElement]|dateTime",
  "title^[HTMLElement]|text",
  "track^[HTMLElement]|!default,kind,label,src,srclang",
  "ul^[HTMLElement]|!compact,type",
  "unknown^[HTMLElement]|",
  "video^media|!disablePictureInPicture,#height,*enterpictureinpicture,*leavepictureinpicture,!playsInline,poster,#width",
  ":svg:a^:svg:graphics|",
  ":svg:animate^:svg:animation|",
  ":svg:animateMotion^:svg:animation|",
  ":svg:animateTransform^:svg:animation|",
  ":svg:circle^:svg:geometry|",
  ":svg:clipPath^:svg:graphics|",
  ":svg:defs^:svg:graphics|",
  ":svg:desc^:svg:|",
  ":svg:discard^:svg:|",
  ":svg:ellipse^:svg:geometry|",
  ":svg:feBlend^:svg:|",
  ":svg:feColorMatrix^:svg:|",
  ":svg:feComponentTransfer^:svg:|",
  ":svg:feComposite^:svg:|",
  ":svg:feConvolveMatrix^:svg:|",
  ":svg:feDiffuseLighting^:svg:|",
  ":svg:feDisplacementMap^:svg:|",
  ":svg:feDistantLight^:svg:|",
  ":svg:feDropShadow^:svg:|",
  ":svg:feFlood^:svg:|",
  ":svg:feFuncA^:svg:componentTransferFunction|",
  ":svg:feFuncB^:svg:componentTransferFunction|",
  ":svg:feFuncG^:svg:componentTransferFunction|",
  ":svg:feFuncR^:svg:componentTransferFunction|",
  ":svg:feGaussianBlur^:svg:|",
  ":svg:feImage^:svg:|",
  ":svg:feMerge^:svg:|",
  ":svg:feMergeNode^:svg:|",
  ":svg:feMorphology^:svg:|",
  ":svg:feOffset^:svg:|",
  ":svg:fePointLight^:svg:|",
  ":svg:feSpecularLighting^:svg:|",
  ":svg:feSpotLight^:svg:|",
  ":svg:feTile^:svg:|",
  ":svg:feTurbulence^:svg:|",
  ":svg:filter^:svg:|",
  ":svg:foreignObject^:svg:graphics|",
  ":svg:g^:svg:graphics|",
  ":svg:image^:svg:graphics|decoding",
  ":svg:line^:svg:geometry|",
  ":svg:linearGradient^:svg:gradient|",
  ":svg:mpath^:svg:|",
  ":svg:marker^:svg:|",
  ":svg:mask^:svg:|",
  ":svg:metadata^:svg:|",
  ":svg:path^:svg:geometry|",
  ":svg:pattern^:svg:|",
  ":svg:polygon^:svg:geometry|",
  ":svg:polyline^:svg:geometry|",
  ":svg:radialGradient^:svg:gradient|",
  ":svg:rect^:svg:geometry|",
  ":svg:svg^:svg:graphics|#currentScale,#zoomAndPan",
  ":svg:script^:svg:|type",
  ":svg:set^:svg:animation|",
  ":svg:stop^:svg:|",
  ":svg:style^:svg:|!disabled,media,title,type",
  ":svg:switch^:svg:graphics|",
  ":svg:symbol^:svg:|",
  ":svg:tspan^:svg:textPositioning|",
  ":svg:text^:svg:textPositioning|",
  ":svg:textPath^:svg:textContent|",
  ":svg:title^:svg:|",
  ":svg:use^:svg:graphics|",
  ":svg:view^:svg:|#zoomAndPan",
  "data^[HTMLElement]|value",
  "keygen^[HTMLElement]|!autofocus,challenge,!disabled,form,keytype,name",
  "menuitem^[HTMLElement]|type,label,icon,!disabled,!checked,radiogroup,!default",
  "summary^[HTMLElement]|",
  "time^[HTMLElement]|dateTime",
  ":svg:cursor^:svg:|",
  ":math:^[HTMLElement]|!autofocus,nonce,*abort,*animationend,*animationiteration,*animationstart,*auxclick,*beforeinput,*beforematch,*beforetoggle,*beforexrselect,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contentvisibilityautostatechange,*contextlost,*contextmenu,*contextrestored,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*formdata,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*paste,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerrawupdate,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*scrollend,*securitypolicyviolation,*seeked,*seeking,*select,*selectionchange,*selectstart,*slotchange,*stalled,*submit,*suspend,*timeupdate,*toggle,*transitioncancel,*transitionend,*transitionrun,*transitionstart,*volumechange,*waiting,*webkitanimationend,*webkitanimationiteration,*webkitanimationstart,*webkittransitionend,*wheel,%style,#tabIndex",
  ":math:math^:math:|",
  ":math:maction^:math:|",
  ":math:menclose^:math:|",
  ":math:merror^:math:|",
  ":math:mfenced^:math:|",
  ":math:mfrac^:math:|",
  ":math:mi^:math:|",
  ":math:mmultiscripts^:math:|",
  ":math:mn^:math:|",
  ":math:mo^:math:|",
  ":math:mover^:math:|",
  ":math:mpadded^:math:|",
  ":math:mphantom^:math:|",
  ":math:mroot^:math:|",
  ":math:mrow^:math:|",
  ":math:ms^:math:|",
  ":math:mspace^:math:|",
  ":math:msqrt^:math:|",
  ":math:mstyle^:math:|",
  ":math:msub^:math:|",
  ":math:msubsup^:math:|",
  ":math:msup^:math:|",
  ":math:mtable^:math:|",
  ":math:mtd^:math:|",
  ":math:mtext^:math:|",
  ":math:mtr^:math:|",
  ":math:munder^:math:|",
  ":math:munderover^:math:|",
  ":math:semantics^:math:|"
];
var _ATTR_TO_PROP = new Map(Object.entries({
  "class": "className",
  "for": "htmlFor",
  "formaction": "formAction",
  "innerHtml": "innerHTML",
  "readonly": "readOnly",
  "tabindex": "tabIndex",
  "aria-activedescendant": "ariaActiveDescendantElement",
  "aria-atomic": "ariaAtomic",
  "aria-autocomplete": "ariaAutoComplete",
  "aria-busy": "ariaBusy",
  "aria-checked": "ariaChecked",
  "aria-colcount": "ariaColCount",
  "aria-colindex": "ariaColIndex",
  "aria-colindextext": "ariaColIndexText",
  "aria-colspan": "ariaColSpan",
  "aria-controls": "ariaControlsElements",
  "aria-current": "ariaCurrent",
  "aria-describedby": "ariaDescribedByElements",
  "aria-description": "ariaDescription",
  "aria-details": "ariaDetailsElements",
  "aria-disabled": "ariaDisabled",
  "aria-errormessage": "ariaErrorMessageElements",
  "aria-expanded": "ariaExpanded",
  "aria-flowto": "ariaFlowToElements",
  "aria-haspopup": "ariaHasPopup",
  "aria-hidden": "ariaHidden",
  "aria-invalid": "ariaInvalid",
  "aria-keyshortcuts": "ariaKeyShortcuts",
  "aria-label": "ariaLabel",
  "aria-labelledby": "ariaLabelledByElements",
  "aria-level": "ariaLevel",
  "aria-live": "ariaLive",
  "aria-modal": "ariaModal",
  "aria-multiline": "ariaMultiLine",
  "aria-multiselectable": "ariaMultiSelectable",
  "aria-orientation": "ariaOrientation",
  "aria-owns": "ariaOwnsElements",
  "aria-placeholder": "ariaPlaceholder",
  "aria-posinset": "ariaPosInSet",
  "aria-pressed": "ariaPressed",
  "aria-readonly": "ariaReadOnly",
  "aria-required": "ariaRequired",
  "aria-roledescription": "ariaRoleDescription",
  "aria-rowcount": "ariaRowCount",
  "aria-rowindex": "ariaRowIndex",
  "aria-rowindextext": "ariaRowIndexText",
  "aria-rowspan": "ariaRowSpan",
  "aria-selected": "ariaSelected",
  "aria-setsize": "ariaSetSize",
  "aria-sort": "ariaSort",
  "aria-valuemax": "ariaValueMax",
  "aria-valuemin": "ariaValueMin",
  "aria-valuenow": "ariaValueNow",
  "aria-valuetext": "ariaValueText"
}));
var _PROP_TO_ATTR = Array.from(_ATTR_TO_PROP).reduce((inverted, [propertyName, attributeName]) => {
  inverted.set(propertyName, attributeName);
  return inverted;
}, /* @__PURE__ */ new Map());
var DomElementSchemaRegistry = class extends ElementSchemaRegistry {
  _schema = /* @__PURE__ */ new Map();
  _eventSchema = /* @__PURE__ */ new Map();
  constructor() {
    super();
    SCHEMA.forEach((encodedType) => {
      const type = /* @__PURE__ */ new Map();
      const events = /* @__PURE__ */ new Set();
      const [strType, strProperties] = encodedType.split("|");
      const properties = strProperties.split(",");
      const [typeNames, superName] = strType.split("^");
      typeNames.split(",").forEach((tag) => {
        this._schema.set(tag.toLowerCase(), type);
        this._eventSchema.set(tag.toLowerCase(), events);
      });
      const superType = superName && this._schema.get(superName.toLowerCase());
      if (superType) {
        for (const [prop, value] of superType) type.set(prop, value);
        for (const superEvent of this._eventSchema.get(superName.toLowerCase())) events.add(superEvent);
      }
      properties.forEach((property) => {
        if (property.length > 0) switch (property[0]) {
          case "*":
            events.add(property.substring(1));
            break;
          case "!":
            type.set(property.substring(1), BOOLEAN);
            break;
          case "#":
            type.set(property.substring(1), NUMBER);
            break;
          case "%":
            type.set(property.substring(1), OBJECT);
            break;
          default:
            type.set(property, STRING);
        }
      });
    });
  }
  hasProperty(tagName, propName, schemaMetas) {
    if (schemaMetas.some((schema) => schema.name === NO_ERRORS_SCHEMA.name)) return true;
    const normalizedTag = normalizeTagName(tagName);
    if (normalizedTag.includes("-")) {
      if (isNgContainer(normalizedTag) || isNgContent(normalizedTag)) return false;
      if (schemaMetas.some((schema) => schema.name === CUSTOM_ELEMENTS_SCHEMA.name)) return true;
    }
    return (this._schema.get(normalizedTag) || this._schema.get("unknown")).has(propName);
  }
  hasElement(tagName, schemaMetas) {
    if (schemaMetas.some((schema) => schema.name === NO_ERRORS_SCHEMA.name)) return true;
    const normalizedTag = normalizeTagName(tagName);
    if (normalizedTag.includes("-")) {
      if (isNgContainer(normalizedTag) || isNgContent(normalizedTag)) return true;
      if (schemaMetas.some((schema) => schema.name === CUSTOM_ELEMENTS_SCHEMA.name)) return true;
    }
    return this._schema.has(normalizedTag);
  }
  /**
  * securityContext returns the security context for the given property on the given DOM tag.
  *
  * Tag and property name are statically known and cannot change at runtime, i.e. it is not
  * possible to bind a value into a changing attribute or tag name.
  *
  * The filtering is based on a list of allowed tags|attributes. All attributes in the schema
  * above are assumed to have the 'NONE' security context, i.e. that they are safe inert
  * string values. Only specific well known attack vectors are assigned their appropriate context.
  */
  securityContext(tagName, propName, isAttribute) {
    if (isAttribute) propName = this.getMappedPropName(propName);
    const [ns, name] = splitNsName(tagName, false);
    return checkSecurityContext(name, propName, ns);
  }
  getMappedPropName(propName) {
    return _ATTR_TO_PROP.get(propName) ?? propName;
  }
  getDefaultComponentElementName() {
    return "ng-component";
  }
  validateProperty(name) {
    if (name.toLowerCase().startsWith("on")) return {
      error: true,
      msg: `Binding to event property '${name}' is disallowed for security reasons, please use (${name.slice(2)})=...
If '${name}' is a directive input, make sure the directive is imported by the current module.`
    };
    else return { error: false };
  }
  validateAttribute(name) {
    if (name.toLowerCase().startsWith("on")) return {
      error: true,
      msg: `Binding to event attribute '${name}' is disallowed for security reasons, please use (${name.slice(2)})=...`
    };
    else return { error: false };
  }
  allKnownElementNames() {
    return Array.from(this._schema.keys());
  }
  allKnownAttributesOfElement(tagName) {
    const normalizedTag = normalizeTagName(tagName);
    const elementProperties = this._schema.get(normalizedTag) || this._schema.get("unknown");
    return Array.from(elementProperties.keys()).map((prop) => _PROP_TO_ATTR.get(prop) ?? prop);
  }
  allKnownEventsOfElement(tagName) {
    const normalizedTag = normalizeTagName(tagName);
    return Array.from(this._eventSchema.get(normalizedTag) ?? []);
  }
  normalizeAnimationStyleProperty(propName) {
    return dashCaseToCamelCase(propName);
  }
  normalizeAnimationStyleValue(camelCaseProp, userProvidedProp, val) {
    let unit = "";
    const strVal = val.toString().trim();
    let errorMsg = null;
    if (_isPixelDimensionStyle(camelCaseProp) && val !== 0 && val !== "0") {
      if (typeof val === "number") unit = "px";
      else {
        const valAndSuffixMatch = val.match(/^[+-]?[\d\.]+([a-z]*)$/);
        if (valAndSuffixMatch && valAndSuffixMatch[1].length == 0) errorMsg = `Please provide a CSS unit value for ${userProvidedProp}:${val}`;
      }
    }
    return {
      error: errorMsg,
      value: strVal + unit
    };
  }
};
function _isPixelDimensionStyle(prop) {
  switch (prop) {
    case "width":
    case "height":
    case "minWidth":
    case "minHeight":
    case "maxWidth":
    case "maxHeight":
    case "left":
    case "top":
    case "bottom":
    case "right":
    case "fontSize":
    case "outlineWidth":
    case "outlineOffset":
    case "paddingTop":
    case "paddingLeft":
    case "paddingBottom":
    case "paddingRight":
    case "marginTop":
    case "marginLeft":
    case "marginBottom":
    case "marginRight":
    case "borderRadius":
    case "borderWidth":
    case "borderTopWidth":
    case "borderLeftWidth":
    case "borderRightWidth":
    case "borderBottomWidth":
    case "textIndent":
      return true;
    default:
      return false;
  }
}

// node_modules/angular-html-parser/dist/compiler/src/ml_parser/html_tags.mjs
var HtmlTagDefinition = class {
  closedByChildren = {};
  contentType;
  closedByParent = false;
  implicitNamespacePrefix;
  isVoid;
  ignoreFirstLf;
  canSelfClose;
  preventNamespaceInheritance;
  constructor({ closedByChildren, implicitNamespacePrefix, contentType = 2, closedByParent = false, isVoid = false, ignoreFirstLf = false, preventNamespaceInheritance = false, canSelfClose = false } = {}) {
    if (closedByChildren && closedByChildren.length > 0) closedByChildren.forEach((tagName) => this.closedByChildren[tagName] = true);
    this.isVoid = isVoid;
    this.closedByParent = closedByParent || isVoid;
    this.implicitNamespacePrefix = implicitNamespacePrefix || null;
    this.contentType = contentType;
    this.ignoreFirstLf = ignoreFirstLf;
    this.preventNamespaceInheritance = preventNamespaceInheritance;
    this.canSelfClose = canSelfClose ?? isVoid;
  }
  isClosedByChild(name) {
    return this.isVoid || name.toLowerCase() in this.closedByChildren;
  }
  getContentType(prefix) {
    if (typeof this.contentType === "object") return (prefix === void 0 ? void 0 : this.contentType[prefix]) ?? this.contentType.default;
    return this.contentType;
  }
};
var DEFAULT_TAG_DEFINITION;
var TAG_DEFINITIONS;
function getHtmlTagDefinition(tagName) {
  if (!TAG_DEFINITIONS) {
    DEFAULT_TAG_DEFINITION = new HtmlTagDefinition({ canSelfClose: true });
    TAG_DEFINITIONS = Object.assign(/* @__PURE__ */ Object.create(null), {
      "base": new HtmlTagDefinition({ isVoid: true }),
      "meta": new HtmlTagDefinition({ isVoid: true }),
      "area": new HtmlTagDefinition({ isVoid: true }),
      "embed": new HtmlTagDefinition({ isVoid: true }),
      "link": new HtmlTagDefinition({ isVoid: true }),
      "img": new HtmlTagDefinition({ isVoid: true }),
      "input": new HtmlTagDefinition({ isVoid: true }),
      "param": new HtmlTagDefinition({ isVoid: true }),
      "hr": new HtmlTagDefinition({ isVoid: true }),
      "br": new HtmlTagDefinition({ isVoid: true }),
      "source": new HtmlTagDefinition({ isVoid: true }),
      "track": new HtmlTagDefinition({ isVoid: true }),
      "wbr": new HtmlTagDefinition({ isVoid: true }),
      "p": new HtmlTagDefinition({
        closedByChildren: [
          "address",
          "article",
          "aside",
          "blockquote",
          "div",
          "dl",
          "fieldset",
          "footer",
          "form",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "header",
          "hgroup",
          "hr",
          "main",
          "nav",
          "ol",
          "p",
          "pre",
          "section",
          "table",
          "ul"
        ],
        closedByParent: true
      }),
      "thead": new HtmlTagDefinition({ closedByChildren: ["tbody", "tfoot"] }),
      "tbody": new HtmlTagDefinition({
        closedByChildren: ["tbody", "tfoot"],
        closedByParent: true
      }),
      "tfoot": new HtmlTagDefinition({
        closedByChildren: ["tbody"],
        closedByParent: true
      }),
      "tr": new HtmlTagDefinition({
        closedByChildren: ["tr"],
        closedByParent: true
      }),
      "td": new HtmlTagDefinition({
        closedByChildren: ["td", "th"],
        closedByParent: true
      }),
      "th": new HtmlTagDefinition({
        closedByChildren: ["td", "th"],
        closedByParent: true
      }),
      "col": new HtmlTagDefinition({ isVoid: true }),
      "svg": new HtmlTagDefinition({ implicitNamespacePrefix: "svg" }),
      "foreignObject": new HtmlTagDefinition({
        implicitNamespacePrefix: "svg",
        preventNamespaceInheritance: true
      }),
      "math": new HtmlTagDefinition({ implicitNamespacePrefix: "math" }),
      "li": new HtmlTagDefinition({
        closedByChildren: ["li"],
        closedByParent: true
      }),
      "dt": new HtmlTagDefinition({ closedByChildren: ["dt", "dd"] }),
      "dd": new HtmlTagDefinition({
        closedByChildren: ["dt", "dd"],
        closedByParent: true
      }),
      "rb": new HtmlTagDefinition({
        closedByChildren: [
          "rb",
          "rt",
          "rtc",
          "rp"
        ],
        closedByParent: true
      }),
      "rt": new HtmlTagDefinition({
        closedByChildren: [
          "rb",
          "rt",
          "rtc",
          "rp"
        ],
        closedByParent: true
      }),
      "rtc": new HtmlTagDefinition({
        closedByChildren: [
          "rb",
          "rtc",
          "rp"
        ],
        closedByParent: true
      }),
      "rp": new HtmlTagDefinition({
        closedByChildren: [
          "rb",
          "rt",
          "rtc",
          "rp"
        ],
        closedByParent: true
      }),
      "optgroup": new HtmlTagDefinition({
        closedByChildren: ["optgroup"],
        closedByParent: true
      }),
      "option": new HtmlTagDefinition({
        closedByChildren: ["option", "optgroup"],
        closedByParent: true
      }),
      "pre": new HtmlTagDefinition({ ignoreFirstLf: true }),
      "listing": new HtmlTagDefinition({ ignoreFirstLf: true }),
      "style": new HtmlTagDefinition({ contentType: 0 }),
      "script": new HtmlTagDefinition({ contentType: 0 }),
      "title": new HtmlTagDefinition({ contentType: {
        default: 1,
        svg: 2
      } }),
      "textarea": new HtmlTagDefinition({
        contentType: 1,
        ignoreFirstLf: true
      })
    });
    new DomElementSchemaRegistry().allKnownElementNames().forEach((knownTagName) => {
      if (!TAG_DEFINITIONS[knownTagName] && getNsPrefix(knownTagName) === null) TAG_DEFINITIONS[knownTagName] = new HtmlTagDefinition({ canSelfClose: false });
    });
  }
  return TAG_DEFINITIONS[tagName] ?? DEFAULT_TAG_DEFINITION;
}

// node_modules/angular-html-parser/dist/compiler/src/parse_util.mjs
var ParseLocation = class ParseLocation2 {
  file;
  offset;
  line;
  col;
  constructor(file, offset, line2, col) {
    this.file = file;
    this.offset = offset;
    this.line = line2;
    this.col = col;
  }
  toString() {
    return this.offset != null ? `${this.file.url}@${this.line}:${this.col}` : this.file.url;
  }
  moveBy(delta) {
    const source = this.file.content;
    const len = source.length;
    let offset = this.offset;
    let line2 = this.line;
    let col = this.col;
    while (offset > 0 && delta < 0) {
      offset--;
      delta++;
      if (source.charCodeAt(offset) == 10) {
        line2--;
        const priorLine = source.substring(0, offset - 1).lastIndexOf(String.fromCharCode(10));
        col = priorLine > 0 ? offset - priorLine : offset;
      } else col--;
    }
    while (offset < len && delta > 0) {
      const ch = source.charCodeAt(offset);
      offset++;
      delta--;
      if (ch == 10) {
        line2++;
        col = 0;
      } else col++;
    }
    return new ParseLocation2(this.file, offset, line2, col);
  }
  getContext(maxChars, maxLines) {
    const content = this.file.content;
    let startOffset = this.offset;
    if (startOffset != null) {
      if (startOffset > content.length - 1) startOffset = content.length - 1;
      let endOffset = startOffset;
      let ctxChars = 0;
      let ctxLines = 0;
      while (ctxChars < maxChars && startOffset > 0) {
        startOffset--;
        ctxChars++;
        if (content[startOffset] == "\n") {
          if (++ctxLines == maxLines) break;
        }
      }
      ctxChars = 0;
      ctxLines = 0;
      while (ctxChars < maxChars && endOffset < content.length - 1) {
        endOffset++;
        ctxChars++;
        if (content[endOffset] == "\n") {
          if (++ctxLines == maxLines) break;
        }
      }
      return {
        before: content.substring(startOffset, this.offset),
        after: content.substring(this.offset, endOffset + 1)
      };
    }
    return null;
  }
};
var ParseSourceFile = class {
  content;
  url;
  constructor(content, url) {
    this.content = content;
    this.url = url;
  }
};
var ParseSourceSpan = class {
  start;
  end;
  fullStart;
  details;
  /**
  * Create an object that holds information about spans of tokens/nodes captured during
  * lexing/parsing of text.
  *
  * @param start
  * The location of the start of the span (having skipped leading trivia).
  * Skipping leading trivia makes source-spans more "user friendly", since things like HTML
  * elements will appear to begin at the start of the opening tag, rather than at the start of any
  * leading trivia, which could include newlines.
  *
  * @param end
  * The location of the end of the span.
  *
  * @param fullStart
  * The start of the token without skipping the leading trivia.
  * This is used by tooling that splits tokens further, such as extracting Angular interpolations
  * from text tokens. Such tooling creates new source-spans relative to the original token's
  * source-span. If leading trivia characters have been skipped then the new source-spans may be
  * incorrectly offset.
  *
  * @param details
  * Additional information (such as identifier names) that should be associated with the span.
  */
  constructor(start, end, fullStart = start, details = null) {
    this.start = start;
    this.end = end;
    this.fullStart = fullStart;
    this.details = details;
  }
  toString() {
    return this.start.file.content.substring(this.start.offset, this.end.offset);
  }
};
var ParseErrorLevel = /* @__PURE__ */ (function(ParseErrorLevel2) {
  ParseErrorLevel2[ParseErrorLevel2["WARNING"] = 0] = "WARNING";
  ParseErrorLevel2[ParseErrorLevel2["ERROR"] = 1] = "ERROR";
  return ParseErrorLevel2;
})({});
var ParseError = class extends Error {
  span;
  msg;
  level;
  relatedError;
  constructor(span, msg, level = 1, relatedError) {
    super(msg);
    this.span = span;
    this.msg = msg;
    this.level = level;
    this.relatedError = relatedError;
    Object.setPrototypeOf(this, new.target.prototype);
  }
  contextualMessage() {
    const ctx = this.span.start.getContext(100, 3);
    return ctx ? `${this.msg} ("${ctx.before}[${ParseErrorLevel[this.level]} ->]${ctx.after}")` : this.msg;
  }
  toString() {
    const details = this.span.details ? `, ${this.span.details}` : "";
    return `${this.contextualMessage()}: ${this.span.start}${details}`;
  }
};

// node_modules/angular-html-parser/dist/compiler/src/ml_parser/ast.mjs
var NodeWithI18n = class {
  sourceSpan;
  i18n;
  constructor(sourceSpan, i18n) {
    this.sourceSpan = sourceSpan;
    this.i18n = i18n;
  }
};
var Text = class extends NodeWithI18n {
  value;
  tokens;
  constructor(value, sourceSpan, tokens, i18n) {
    super(sourceSpan, i18n);
    this.value = value;
    this.tokens = tokens;
  }
  visit(visitor, context) {
    return visitor.visitText(this, context);
  }
  kind = "text";
};
var CDATA = class extends NodeWithI18n {
  value;
  tokens;
  constructor(value, sourceSpan, tokens, i18n) {
    super(sourceSpan, i18n);
    this.value = value;
    this.tokens = tokens;
  }
  visit(visitor, context) {
    return visitor.visitCdata(this, context);
  }
  kind = "cdata";
};
var Expansion = class extends NodeWithI18n {
  switchValue;
  type;
  cases;
  switchValueSourceSpan;
  constructor(switchValue, type, cases, sourceSpan, switchValueSourceSpan, i18n) {
    super(sourceSpan, i18n);
    this.switchValue = switchValue;
    this.type = type;
    this.cases = cases;
    this.switchValueSourceSpan = switchValueSourceSpan;
  }
  visit(visitor, context) {
    return visitor.visitExpansion(this, context);
  }
  kind = "expansion";
};
var ExpansionCase = class {
  value;
  expression;
  sourceSpan;
  valueSourceSpan;
  expSourceSpan;
  constructor(value, expression, sourceSpan, valueSourceSpan, expSourceSpan) {
    this.value = value;
    this.expression = expression;
    this.sourceSpan = sourceSpan;
    this.valueSourceSpan = valueSourceSpan;
    this.expSourceSpan = expSourceSpan;
  }
  visit(visitor, context) {
    return visitor.visitExpansionCase(this, context);
  }
  kind = "expansionCase";
};
var Attribute = class extends NodeWithI18n {
  name;
  value;
  keySpan;
  valueSpan;
  valueTokens;
  constructor(name, value, sourceSpan, keySpan, valueSpan, valueTokens, i18n) {
    super(sourceSpan, i18n);
    this.name = name;
    this.value = value;
    this.keySpan = keySpan;
    this.valueSpan = valueSpan;
    this.valueTokens = valueTokens;
  }
  visit(visitor, context) {
    return visitor.visitAttribute(this, context);
  }
  kind = "attribute";
  get nameSpan() {
    return this.keySpan;
  }
};
var StartTagComment = class {
  value;
  type;
  sourceSpan;
  constructor(value, type, sourceSpan) {
    this.value = value;
    this.type = type;
    this.sourceSpan = sourceSpan;
  }
  visit(visitor, context) {
    return visitor.visitStartTagComment ? visitor.visitStartTagComment(this, context) : void 0;
  }
  kind = "startTagComment";
};
var Element = class extends NodeWithI18n {
  name;
  attrs;
  directives;
  children;
  isSelfClosing;
  startSourceSpan;
  endSourceSpan;
  nameSpan;
  isVoid;
  comments;
  constructor(name, attrs, directives, children, isSelfClosing, sourceSpan, startSourceSpan, endSourceSpan = null, nameSpan = null, isVoid, i18n, comments = []) {
    super(sourceSpan, i18n);
    this.name = name;
    this.attrs = attrs;
    this.directives = directives;
    this.children = children;
    this.isSelfClosing = isSelfClosing;
    this.startSourceSpan = startSourceSpan;
    this.endSourceSpan = endSourceSpan;
    this.nameSpan = nameSpan;
    this.isVoid = isVoid;
    this.comments = comments;
  }
  visit(visitor, context) {
    return visitor.visitElement(this, context);
  }
  kind = "element";
};
var Comment = class {
  value;
  sourceSpan;
  constructor(value, sourceSpan) {
    this.value = value;
    this.sourceSpan = sourceSpan;
  }
  visit(visitor, context) {
    return visitor.visitComment(this, context);
  }
  kind = "comment";
};
var DocType = class {
  value;
  sourceSpan;
  constructor(value, sourceSpan) {
    this.value = value;
    this.sourceSpan = sourceSpan;
  }
  visit(visitor, context) {
    return visitor.visitDocType(this, context);
  }
  kind = "docType";
};
var Block = class extends NodeWithI18n {
  name;
  parameters;
  children;
  nameSpan;
  startSourceSpan;
  endSourceSpan;
  constructor(name, parameters, children, sourceSpan, nameSpan, startSourceSpan, endSourceSpan = null, i18n) {
    super(sourceSpan, i18n);
    this.name = name;
    this.parameters = parameters;
    this.children = children;
    this.nameSpan = nameSpan;
    this.startSourceSpan = startSourceSpan;
    this.endSourceSpan = endSourceSpan;
  }
  visit(visitor, context) {
    return visitor.visitBlock(this, context);
  }
  kind = "block";
};
var Component = class extends NodeWithI18n {
  componentName;
  tagName;
  fullName;
  attrs;
  directives;
  children;
  isSelfClosing;
  startSourceSpan;
  endSourceSpan;
  comments;
  constructor(componentName, tagName, fullName, attrs, directives, children, isSelfClosing, sourceSpan, startSourceSpan, endSourceSpan = null, i18n, comments = []) {
    super(sourceSpan, i18n);
    this.componentName = componentName;
    this.tagName = tagName;
    this.fullName = fullName;
    this.attrs = attrs;
    this.directives = directives;
    this.children = children;
    this.isSelfClosing = isSelfClosing;
    this.startSourceSpan = startSourceSpan;
    this.endSourceSpan = endSourceSpan;
    this.comments = comments;
  }
  visit(visitor, context) {
    return visitor.visitComponent(this, context);
  }
  kind = "component";
};
var Directive = class {
  name;
  attrs;
  sourceSpan;
  startSourceSpan;
  endSourceSpan;
  constructor(name, attrs, sourceSpan, startSourceSpan, endSourceSpan = null) {
    this.name = name;
    this.attrs = attrs;
    this.sourceSpan = sourceSpan;
    this.startSourceSpan = startSourceSpan;
    this.endSourceSpan = endSourceSpan;
  }
  visit(visitor, context) {
    return visitor.visitDirective(this, context);
  }
  kind = "directive";
};
var BlockParameter = class {
  expression;
  sourceSpan;
  constructor(expression, sourceSpan) {
    this.expression = expression;
    this.sourceSpan = sourceSpan;
  }
  visit(visitor, context) {
    return visitor.visitBlockParameter(this, context);
  }
  kind = "blockParameter";
  startSourceSpan = null;
  endSourceSpan = null;
};
var LetDeclaration = class {
  name;
  value;
  sourceSpan;
  nameSpan;
  valueSpan;
  constructor(name, value, sourceSpan, nameSpan, valueSpan) {
    this.name = name;
    this.value = value;
    this.sourceSpan = sourceSpan;
    this.nameSpan = nameSpan;
    this.valueSpan = valueSpan;
  }
  visit(visitor, context) {
    return visitor.visitLetDeclaration(this, context);
  }
  kind = "letDeclaration";
  startSourceSpan = null;
  endSourceSpan = null;
};
function visitAll(visitor, nodes, context = null) {
  const result = [];
  const visit = visitor.visit ? (ast) => visitor.visit(ast, context) || ast.visit(visitor, context) : (ast) => ast.visit(visitor, context);
  nodes.forEach((ast) => {
    const astResult = visit(ast);
    if (astResult) result.push(astResult);
  });
  return result;
}
var RecursiveVisitor = class {
  constructor() {
  }
  visitElement(ast, context) {
    this.visitChildren(context, (visit) => {
      visit(ast.attrs);
      visit(ast.directives);
      visit(ast.comments);
      visit(ast.children);
    });
  }
  visitAttribute(ast, context) {
  }
  visitStartTagComment(ast, context) {
  }
  visitText(ast, context) {
  }
  visitCdata(ast, context) {
  }
  visitComment(ast, context) {
  }
  visitDocType(ast, context) {
  }
  visitExpansion(ast, context) {
    return this.visitChildren(context, (visit) => {
      visit(ast.cases);
    });
  }
  visitExpansionCase(ast, context) {
  }
  visitBlock(block, context) {
    this.visitChildren(context, (visit) => {
      visit(block.parameters);
      visit(block.children);
    });
  }
  visitBlockParameter(ast, context) {
  }
  visitLetDeclaration(decl, context) {
  }
  visitComponent(component, context) {
    this.visitChildren(context, (visit) => {
      visit(component.attrs);
      visit(component.comments);
      visit(component.children);
    });
  }
  visitDirective(directive, context) {
    this.visitChildren(context, (visit) => {
      visit(directive.attrs);
    });
  }
  visitChildren(context, cb) {
    let results = [];
    let t = this;
    function visit(children) {
      if (children) results.push(visitAll(t, children, context));
    }
    cb(visit);
    return Array.prototype.concat.apply([], results);
  }
};

// node_modules/angular-html-parser/dist/compiler/src/chars.mjs
function isWhitespace(code) {
  return code >= 9 && code <= 32 || code == 160;
}
function isDigit(code) {
  return 48 <= code && code <= 57;
}
function isAsciiLetter(code) {
  return code >= 97 && code <= 122 || code >= 65 && code <= 90;
}
function isAsciiHexDigit(code) {
  return code >= 97 && code <= 102 || code >= 65 && code <= 70 || isDigit(code);
}
function isNewLine(code) {
  return code === 10 || code === 13;
}
function isOctalDigit(code) {
  return 48 <= code && code <= 55;
}
function isQuote(code) {
  return code === 39 || code === 34 || code === 96;
}

// node_modules/angular-html-parser/dist/compiler/src/ml_parser/entities.mjs
var NAMED_ENTITIES = {
  "AElig": "\xC6",
  "AMP": "&",
  "amp": "&",
  "Aacute": "\xC1",
  "Abreve": "\u0102",
  "Acirc": "\xC2",
  "Acy": "\u0410",
  "Afr": "\u{1D504}",
  "Agrave": "\xC0",
  "Alpha": "\u0391",
  "Amacr": "\u0100",
  "And": "\u2A53",
  "Aogon": "\u0104",
  "Aopf": "\u{1D538}",
  "ApplyFunction": "\u2061",
  "af": "\u2061",
  "Aring": "\xC5",
  "angst": "\xC5",
  "Ascr": "\u{1D49C}",
  "Assign": "\u2254",
  "colone": "\u2254",
  "coloneq": "\u2254",
  "Atilde": "\xC3",
  "Auml": "\xC4",
  "Backslash": "\u2216",
  "setminus": "\u2216",
  "setmn": "\u2216",
  "smallsetminus": "\u2216",
  "ssetmn": "\u2216",
  "Barv": "\u2AE7",
  "Barwed": "\u2306",
  "doublebarwedge": "\u2306",
  "Bcy": "\u0411",
  "Because": "\u2235",
  "becaus": "\u2235",
  "because": "\u2235",
  "Bernoullis": "\u212C",
  "Bscr": "\u212C",
  "bernou": "\u212C",
  "Beta": "\u0392",
  "Bfr": "\u{1D505}",
  "Bopf": "\u{1D539}",
  "Breve": "\u02D8",
  "breve": "\u02D8",
  "Bumpeq": "\u224E",
  "HumpDownHump": "\u224E",
  "bump": "\u224E",
  "CHcy": "\u0427",
  "COPY": "\xA9",
  "copy": "\xA9",
  "Cacute": "\u0106",
  "Cap": "\u22D2",
  "CapitalDifferentialD": "\u2145",
  "DD": "\u2145",
  "Cayleys": "\u212D",
  "Cfr": "\u212D",
  "Ccaron": "\u010C",
  "Ccedil": "\xC7",
  "Ccirc": "\u0108",
  "Cconint": "\u2230",
  "Cdot": "\u010A",
  "Cedilla": "\xB8",
  "cedil": "\xB8",
  "CenterDot": "\xB7",
  "centerdot": "\xB7",
  "middot": "\xB7",
  "Chi": "\u03A7",
  "CircleDot": "\u2299",
  "odot": "\u2299",
  "CircleMinus": "\u2296",
  "ominus": "\u2296",
  "CirclePlus": "\u2295",
  "oplus": "\u2295",
  "CircleTimes": "\u2297",
  "otimes": "\u2297",
  "ClockwiseContourIntegral": "\u2232",
  "cwconint": "\u2232",
  "CloseCurlyDoubleQuote": "\u201D",
  "rdquo": "\u201D",
  "rdquor": "\u201D",
  "CloseCurlyQuote": "\u2019",
  "rsquo": "\u2019",
  "rsquor": "\u2019",
  "Colon": "\u2237",
  "Proportion": "\u2237",
  "Colone": "\u2A74",
  "Congruent": "\u2261",
  "equiv": "\u2261",
  "Conint": "\u222F",
  "DoubleContourIntegral": "\u222F",
  "ContourIntegral": "\u222E",
  "conint": "\u222E",
  "oint": "\u222E",
  "Copf": "\u2102",
  "complexes": "\u2102",
  "Coproduct": "\u2210",
  "coprod": "\u2210",
  "CounterClockwiseContourIntegral": "\u2233",
  "awconint": "\u2233",
  "Cross": "\u2A2F",
  "Cscr": "\u{1D49E}",
  "Cup": "\u22D3",
  "CupCap": "\u224D",
  "asympeq": "\u224D",
  "DDotrahd": "\u2911",
  "DJcy": "\u0402",
  "DScy": "\u0405",
  "DZcy": "\u040F",
  "Dagger": "\u2021",
  "ddagger": "\u2021",
  "Darr": "\u21A1",
  "Dashv": "\u2AE4",
  "DoubleLeftTee": "\u2AE4",
  "Dcaron": "\u010E",
  "Dcy": "\u0414",
  "Del": "\u2207",
  "nabla": "\u2207",
  "Delta": "\u0394",
  "Dfr": "\u{1D507}",
  "DiacriticalAcute": "\xB4",
  "acute": "\xB4",
  "DiacriticalDot": "\u02D9",
  "dot": "\u02D9",
  "DiacriticalDoubleAcute": "\u02DD",
  "dblac": "\u02DD",
  "DiacriticalGrave": "`",
  "grave": "`",
  "DiacriticalTilde": "\u02DC",
  "tilde": "\u02DC",
  "Diamond": "\u22C4",
  "diam": "\u22C4",
  "diamond": "\u22C4",
  "DifferentialD": "\u2146",
  "dd": "\u2146",
  "Dopf": "\u{1D53B}",
  "Dot": "\xA8",
  "DoubleDot": "\xA8",
  "die": "\xA8",
  "uml": "\xA8",
  "DotDot": "\u20DC",
  "DotEqual": "\u2250",
  "doteq": "\u2250",
  "esdot": "\u2250",
  "DoubleDownArrow": "\u21D3",
  "Downarrow": "\u21D3",
  "dArr": "\u21D3",
  "DoubleLeftArrow": "\u21D0",
  "Leftarrow": "\u21D0",
  "lArr": "\u21D0",
  "DoubleLeftRightArrow": "\u21D4",
  "Leftrightarrow": "\u21D4",
  "hArr": "\u21D4",
  "iff": "\u21D4",
  "DoubleLongLeftArrow": "\u27F8",
  "Longleftarrow": "\u27F8",
  "xlArr": "\u27F8",
  "DoubleLongLeftRightArrow": "\u27FA",
  "Longleftrightarrow": "\u27FA",
  "xhArr": "\u27FA",
  "DoubleLongRightArrow": "\u27F9",
  "Longrightarrow": "\u27F9",
  "xrArr": "\u27F9",
  "DoubleRightArrow": "\u21D2",
  "Implies": "\u21D2",
  "Rightarrow": "\u21D2",
  "rArr": "\u21D2",
  "DoubleRightTee": "\u22A8",
  "vDash": "\u22A8",
  "DoubleUpArrow": "\u21D1",
  "Uparrow": "\u21D1",
  "uArr": "\u21D1",
  "DoubleUpDownArrow": "\u21D5",
  "Updownarrow": "\u21D5",
  "vArr": "\u21D5",
  "DoubleVerticalBar": "\u2225",
  "par": "\u2225",
  "parallel": "\u2225",
  "shortparallel": "\u2225",
  "spar": "\u2225",
  "DownArrow": "\u2193",
  "ShortDownArrow": "\u2193",
  "darr": "\u2193",
  "downarrow": "\u2193",
  "DownArrowBar": "\u2913",
  "DownArrowUpArrow": "\u21F5",
  "duarr": "\u21F5",
  "DownBreve": "\u0311",
  "DownLeftRightVector": "\u2950",
  "DownLeftTeeVector": "\u295E",
  "DownLeftVector": "\u21BD",
  "leftharpoondown": "\u21BD",
  "lhard": "\u21BD",
  "DownLeftVectorBar": "\u2956",
  "DownRightTeeVector": "\u295F",
  "DownRightVector": "\u21C1",
  "rhard": "\u21C1",
  "rightharpoondown": "\u21C1",
  "DownRightVectorBar": "\u2957",
  "DownTee": "\u22A4",
  "top": "\u22A4",
  "DownTeeArrow": "\u21A7",
  "mapstodown": "\u21A7",
  "Dscr": "\u{1D49F}",
  "Dstrok": "\u0110",
  "ENG": "\u014A",
  "ETH": "\xD0",
  "Eacute": "\xC9",
  "Ecaron": "\u011A",
  "Ecirc": "\xCA",
  "Ecy": "\u042D",
  "Edot": "\u0116",
  "Efr": "\u{1D508}",
  "Egrave": "\xC8",
  "Element": "\u2208",
  "in": "\u2208",
  "isin": "\u2208",
  "isinv": "\u2208",
  "Emacr": "\u0112",
  "EmptySmallSquare": "\u25FB",
  "EmptyVerySmallSquare": "\u25AB",
  "Eogon": "\u0118",
  "Eopf": "\u{1D53C}",
  "Epsilon": "\u0395",
  "Equal": "\u2A75",
  "EqualTilde": "\u2242",
  "eqsim": "\u2242",
  "esim": "\u2242",
  "Equilibrium": "\u21CC",
  "rightleftharpoons": "\u21CC",
  "rlhar": "\u21CC",
  "Escr": "\u2130",
  "expectation": "\u2130",
  "Esim": "\u2A73",
  "Eta": "\u0397",
  "Euml": "\xCB",
  "Exists": "\u2203",
  "exist": "\u2203",
  "ExponentialE": "\u2147",
  "ee": "\u2147",
  "exponentiale": "\u2147",
  "Fcy": "\u0424",
  "Ffr": "\u{1D509}",
  "FilledSmallSquare": "\u25FC",
  "FilledVerySmallSquare": "\u25AA",
  "blacksquare": "\u25AA",
  "squarf": "\u25AA",
  "squf": "\u25AA",
  "Fopf": "\u{1D53D}",
  "ForAll": "\u2200",
  "forall": "\u2200",
  "Fouriertrf": "\u2131",
  "Fscr": "\u2131",
  "GJcy": "\u0403",
  "GT": ">",
  "gt": ">",
  "Gamma": "\u0393",
  "Gammad": "\u03DC",
  "Gbreve": "\u011E",
  "Gcedil": "\u0122",
  "Gcirc": "\u011C",
  "Gcy": "\u0413",
  "Gdot": "\u0120",
  "Gfr": "\u{1D50A}",
  "Gg": "\u22D9",
  "ggg": "\u22D9",
  "Gopf": "\u{1D53E}",
  "GreaterEqual": "\u2265",
  "ge": "\u2265",
  "geq": "\u2265",
  "GreaterEqualLess": "\u22DB",
  "gel": "\u22DB",
  "gtreqless": "\u22DB",
  "GreaterFullEqual": "\u2267",
  "gE": "\u2267",
  "geqq": "\u2267",
  "GreaterGreater": "\u2AA2",
  "GreaterLess": "\u2277",
  "gl": "\u2277",
  "gtrless": "\u2277",
  "GreaterSlantEqual": "\u2A7E",
  "geqslant": "\u2A7E",
  "ges": "\u2A7E",
  "GreaterTilde": "\u2273",
  "gsim": "\u2273",
  "gtrsim": "\u2273",
  "Gscr": "\u{1D4A2}",
  "Gt": "\u226B",
  "NestedGreaterGreater": "\u226B",
  "gg": "\u226B",
  "HARDcy": "\u042A",
  "Hacek": "\u02C7",
  "caron": "\u02C7",
  "Hat": "^",
  "Hcirc": "\u0124",
  "Hfr": "\u210C",
  "Poincareplane": "\u210C",
  "HilbertSpace": "\u210B",
  "Hscr": "\u210B",
  "hamilt": "\u210B",
  "Hopf": "\u210D",
  "quaternions": "\u210D",
  "HorizontalLine": "\u2500",
  "boxh": "\u2500",
  "Hstrok": "\u0126",
  "HumpEqual": "\u224F",
  "bumpe": "\u224F",
  "bumpeq": "\u224F",
  "IEcy": "\u0415",
  "IJlig": "\u0132",
  "IOcy": "\u0401",
  "Iacute": "\xCD",
  "Icirc": "\xCE",
  "Icy": "\u0418",
  "Idot": "\u0130",
  "Ifr": "\u2111",
  "Im": "\u2111",
  "image": "\u2111",
  "imagpart": "\u2111",
  "Igrave": "\xCC",
  "Imacr": "\u012A",
  "ImaginaryI": "\u2148",
  "ii": "\u2148",
  "Int": "\u222C",
  "Integral": "\u222B",
  "int": "\u222B",
  "Intersection": "\u22C2",
  "bigcap": "\u22C2",
  "xcap": "\u22C2",
  "InvisibleComma": "\u2063",
  "ic": "\u2063",
  "InvisibleTimes": "\u2062",
  "it": "\u2062",
  "Iogon": "\u012E",
  "Iopf": "\u{1D540}",
  "Iota": "\u0399",
  "Iscr": "\u2110",
  "imagline": "\u2110",
  "Itilde": "\u0128",
  "Iukcy": "\u0406",
  "Iuml": "\xCF",
  "Jcirc": "\u0134",
  "Jcy": "\u0419",
  "Jfr": "\u{1D50D}",
  "Jopf": "\u{1D541}",
  "Jscr": "\u{1D4A5}",
  "Jsercy": "\u0408",
  "Jukcy": "\u0404",
  "KHcy": "\u0425",
  "KJcy": "\u040C",
  "Kappa": "\u039A",
  "Kcedil": "\u0136",
  "Kcy": "\u041A",
  "Kfr": "\u{1D50E}",
  "Kopf": "\u{1D542}",
  "Kscr": "\u{1D4A6}",
  "LJcy": "\u0409",
  "LT": "<",
  "lt": "<",
  "Lacute": "\u0139",
  "Lambda": "\u039B",
  "Lang": "\u27EA",
  "Laplacetrf": "\u2112",
  "Lscr": "\u2112",
  "lagran": "\u2112",
  "Larr": "\u219E",
  "twoheadleftarrow": "\u219E",
  "Lcaron": "\u013D",
  "Lcedil": "\u013B",
  "Lcy": "\u041B",
  "LeftAngleBracket": "\u27E8",
  "lang": "\u27E8",
  "langle": "\u27E8",
  "LeftArrow": "\u2190",
  "ShortLeftArrow": "\u2190",
  "larr": "\u2190",
  "leftarrow": "\u2190",
  "slarr": "\u2190",
  "LeftArrowBar": "\u21E4",
  "larrb": "\u21E4",
  "LeftArrowRightArrow": "\u21C6",
  "leftrightarrows": "\u21C6",
  "lrarr": "\u21C6",
  "LeftCeiling": "\u2308",
  "lceil": "\u2308",
  "LeftDoubleBracket": "\u27E6",
  "lobrk": "\u27E6",
  "LeftDownTeeVector": "\u2961",
  "LeftDownVector": "\u21C3",
  "dharl": "\u21C3",
  "downharpoonleft": "\u21C3",
  "LeftDownVectorBar": "\u2959",
  "LeftFloor": "\u230A",
  "lfloor": "\u230A",
  "LeftRightArrow": "\u2194",
  "harr": "\u2194",
  "leftrightarrow": "\u2194",
  "LeftRightVector": "\u294E",
  "LeftTee": "\u22A3",
  "dashv": "\u22A3",
  "LeftTeeArrow": "\u21A4",
  "mapstoleft": "\u21A4",
  "LeftTeeVector": "\u295A",
  "LeftTriangle": "\u22B2",
  "vartriangleleft": "\u22B2",
  "vltri": "\u22B2",
  "LeftTriangleBar": "\u29CF",
  "LeftTriangleEqual": "\u22B4",
  "ltrie": "\u22B4",
  "trianglelefteq": "\u22B4",
  "LeftUpDownVector": "\u2951",
  "LeftUpTeeVector": "\u2960",
  "LeftUpVector": "\u21BF",
  "uharl": "\u21BF",
  "upharpoonleft": "\u21BF",
  "LeftUpVectorBar": "\u2958",
  "LeftVector": "\u21BC",
  "leftharpoonup": "\u21BC",
  "lharu": "\u21BC",
  "LeftVectorBar": "\u2952",
  "LessEqualGreater": "\u22DA",
  "leg": "\u22DA",
  "lesseqgtr": "\u22DA",
  "LessFullEqual": "\u2266",
  "lE": "\u2266",
  "leqq": "\u2266",
  "LessGreater": "\u2276",
  "lessgtr": "\u2276",
  "lg": "\u2276",
  "LessLess": "\u2AA1",
  "LessSlantEqual": "\u2A7D",
  "leqslant": "\u2A7D",
  "les": "\u2A7D",
  "LessTilde": "\u2272",
  "lesssim": "\u2272",
  "lsim": "\u2272",
  "Lfr": "\u{1D50F}",
  "Ll": "\u22D8",
  "Lleftarrow": "\u21DA",
  "lAarr": "\u21DA",
  "Lmidot": "\u013F",
  "LongLeftArrow": "\u27F5",
  "longleftarrow": "\u27F5",
  "xlarr": "\u27F5",
  "LongLeftRightArrow": "\u27F7",
  "longleftrightarrow": "\u27F7",
  "xharr": "\u27F7",
  "LongRightArrow": "\u27F6",
  "longrightarrow": "\u27F6",
  "xrarr": "\u27F6",
  "Lopf": "\u{1D543}",
  "LowerLeftArrow": "\u2199",
  "swarr": "\u2199",
  "swarrow": "\u2199",
  "LowerRightArrow": "\u2198",
  "searr": "\u2198",
  "searrow": "\u2198",
  "Lsh": "\u21B0",
  "lsh": "\u21B0",
  "Lstrok": "\u0141",
  "Lt": "\u226A",
  "NestedLessLess": "\u226A",
  "ll": "\u226A",
  "Map": "\u2905",
  "Mcy": "\u041C",
  "MediumSpace": "\u205F",
  "Mellintrf": "\u2133",
  "Mscr": "\u2133",
  "phmmat": "\u2133",
  "Mfr": "\u{1D510}",
  "MinusPlus": "\u2213",
  "mnplus": "\u2213",
  "mp": "\u2213",
  "Mopf": "\u{1D544}",
  "Mu": "\u039C",
  "NJcy": "\u040A",
  "Nacute": "\u0143",
  "Ncaron": "\u0147",
  "Ncedil": "\u0145",
  "Ncy": "\u041D",
  "NegativeMediumSpace": "\u200B",
  "NegativeThickSpace": "\u200B",
  "NegativeThinSpace": "\u200B",
  "NegativeVeryThinSpace": "\u200B",
  "ZeroWidthSpace": "\u200B",
  "NewLine": "\n",
  "Nfr": "\u{1D511}",
  "NoBreak": "\u2060",
  "NonBreakingSpace": "\xA0",
  "nbsp": "\xA0",
  "Nopf": "\u2115",
  "naturals": "\u2115",
  "Not": "\u2AEC",
  "NotCongruent": "\u2262",
  "nequiv": "\u2262",
  "NotCupCap": "\u226D",
  "NotDoubleVerticalBar": "\u2226",
  "npar": "\u2226",
  "nparallel": "\u2226",
  "nshortparallel": "\u2226",
  "nspar": "\u2226",
  "NotElement": "\u2209",
  "notin": "\u2209",
  "notinva": "\u2209",
  "NotEqual": "\u2260",
  "ne": "\u2260",
  "NotEqualTilde": "\u2242\u0338",
  "nesim": "\u2242\u0338",
  "NotExists": "\u2204",
  "nexist": "\u2204",
  "nexists": "\u2204",
  "NotGreater": "\u226F",
  "ngt": "\u226F",
  "ngtr": "\u226F",
  "NotGreaterEqual": "\u2271",
  "nge": "\u2271",
  "ngeq": "\u2271",
  "NotGreaterFullEqual": "\u2267\u0338",
  "ngE": "\u2267\u0338",
  "ngeqq": "\u2267\u0338",
  "NotGreaterGreater": "\u226B\u0338",
  "nGtv": "\u226B\u0338",
  "NotGreaterLess": "\u2279",
  "ntgl": "\u2279",
  "NotGreaterSlantEqual": "\u2A7E\u0338",
  "ngeqslant": "\u2A7E\u0338",
  "nges": "\u2A7E\u0338",
  "NotGreaterTilde": "\u2275",
  "ngsim": "\u2275",
  "NotHumpDownHump": "\u224E\u0338",
  "nbump": "\u224E\u0338",
  "NotHumpEqual": "\u224F\u0338",
  "nbumpe": "\u224F\u0338",
  "NotLeftTriangle": "\u22EA",
  "nltri": "\u22EA",
  "ntriangleleft": "\u22EA",
  "NotLeftTriangleBar": "\u29CF\u0338",
  "NotLeftTriangleEqual": "\u22EC",
  "nltrie": "\u22EC",
  "ntrianglelefteq": "\u22EC",
  "NotLess": "\u226E",
  "nless": "\u226E",
  "nlt": "\u226E",
  "NotLessEqual": "\u2270",
  "nle": "\u2270",
  "nleq": "\u2270",
  "NotLessGreater": "\u2278",
  "ntlg": "\u2278",
  "NotLessLess": "\u226A\u0338",
  "nLtv": "\u226A\u0338",
  "NotLessSlantEqual": "\u2A7D\u0338",
  "nleqslant": "\u2A7D\u0338",
  "nles": "\u2A7D\u0338",
  "NotLessTilde": "\u2274",
  "nlsim": "\u2274",
  "NotNestedGreaterGreater": "\u2AA2\u0338",
  "NotNestedLessLess": "\u2AA1\u0338",
  "NotPrecedes": "\u2280",
  "npr": "\u2280",
  "nprec": "\u2280",
  "NotPrecedesEqual": "\u2AAF\u0338",
  "npre": "\u2AAF\u0338",
  "npreceq": "\u2AAF\u0338",
  "NotPrecedesSlantEqual": "\u22E0",
  "nprcue": "\u22E0",
  "NotReverseElement": "\u220C",
  "notni": "\u220C",
  "notniva": "\u220C",
  "NotRightTriangle": "\u22EB",
  "nrtri": "\u22EB",
  "ntriangleright": "\u22EB",
  "NotRightTriangleBar": "\u29D0\u0338",
  "NotRightTriangleEqual": "\u22ED",
  "nrtrie": "\u22ED",
  "ntrianglerighteq": "\u22ED",
  "NotSquareSubset": "\u228F\u0338",
  "NotSquareSubsetEqual": "\u22E2",
  "nsqsube": "\u22E2",
  "NotSquareSuperset": "\u2290\u0338",
  "NotSquareSupersetEqual": "\u22E3",
  "nsqsupe": "\u22E3",
  "NotSubset": "\u2282\u20D2",
  "nsubset": "\u2282\u20D2",
  "vnsub": "\u2282\u20D2",
  "NotSubsetEqual": "\u2288",
  "nsube": "\u2288",
  "nsubseteq": "\u2288",
  "NotSucceeds": "\u2281",
  "nsc": "\u2281",
  "nsucc": "\u2281",
  "NotSucceedsEqual": "\u2AB0\u0338",
  "nsce": "\u2AB0\u0338",
  "nsucceq": "\u2AB0\u0338",
  "NotSucceedsSlantEqual": "\u22E1",
  "nsccue": "\u22E1",
  "NotSucceedsTilde": "\u227F\u0338",
  "NotSuperset": "\u2283\u20D2",
  "nsupset": "\u2283\u20D2",
  "vnsup": "\u2283\u20D2",
  "NotSupersetEqual": "\u2289",
  "nsupe": "\u2289",
  "nsupseteq": "\u2289",
  "NotTilde": "\u2241",
  "nsim": "\u2241",
  "NotTildeEqual": "\u2244",
  "nsime": "\u2244",
  "nsimeq": "\u2244",
  "NotTildeFullEqual": "\u2247",
  "ncong": "\u2247",
  "NotTildeTilde": "\u2249",
  "nap": "\u2249",
  "napprox": "\u2249",
  "NotVerticalBar": "\u2224",
  "nmid": "\u2224",
  "nshortmid": "\u2224",
  "nsmid": "\u2224",
  "Nscr": "\u{1D4A9}",
  "Ntilde": "\xD1",
  "Nu": "\u039D",
  "OElig": "\u0152",
  "Oacute": "\xD3",
  "Ocirc": "\xD4",
  "Ocy": "\u041E",
  "Odblac": "\u0150",
  "Ofr": "\u{1D512}",
  "Ograve": "\xD2",
  "Omacr": "\u014C",
  "Omega": "\u03A9",
  "ohm": "\u03A9",
  "Omicron": "\u039F",
  "Oopf": "\u{1D546}",
  "OpenCurlyDoubleQuote": "\u201C",
  "ldquo": "\u201C",
  "OpenCurlyQuote": "\u2018",
  "lsquo": "\u2018",
  "Or": "\u2A54",
  "Oscr": "\u{1D4AA}",
  "Oslash": "\xD8",
  "Otilde": "\xD5",
  "Otimes": "\u2A37",
  "Ouml": "\xD6",
  "OverBar": "\u203E",
  "oline": "\u203E",
  "OverBrace": "\u23DE",
  "OverBracket": "\u23B4",
  "tbrk": "\u23B4",
  "OverParenthesis": "\u23DC",
  "PartialD": "\u2202",
  "part": "\u2202",
  "Pcy": "\u041F",
  "Pfr": "\u{1D513}",
  "Phi": "\u03A6",
  "Pi": "\u03A0",
  "PlusMinus": "\xB1",
  "plusmn": "\xB1",
  "pm": "\xB1",
  "Popf": "\u2119",
  "primes": "\u2119",
  "Pr": "\u2ABB",
  "Precedes": "\u227A",
  "pr": "\u227A",
  "prec": "\u227A",
  "PrecedesEqual": "\u2AAF",
  "pre": "\u2AAF",
  "preceq": "\u2AAF",
  "PrecedesSlantEqual": "\u227C",
  "prcue": "\u227C",
  "preccurlyeq": "\u227C",
  "PrecedesTilde": "\u227E",
  "precsim": "\u227E",
  "prsim": "\u227E",
  "Prime": "\u2033",
  "Product": "\u220F",
  "prod": "\u220F",
  "Proportional": "\u221D",
  "prop": "\u221D",
  "propto": "\u221D",
  "varpropto": "\u221D",
  "vprop": "\u221D",
  "Pscr": "\u{1D4AB}",
  "Psi": "\u03A8",
  "QUOT": '"',
  "quot": '"',
  "Qfr": "\u{1D514}",
  "Qopf": "\u211A",
  "rationals": "\u211A",
  "Qscr": "\u{1D4AC}",
  "RBarr": "\u2910",
  "drbkarow": "\u2910",
  "REG": "\xAE",
  "circledR": "\xAE",
  "reg": "\xAE",
  "Racute": "\u0154",
  "Rang": "\u27EB",
  "Rarr": "\u21A0",
  "twoheadrightarrow": "\u21A0",
  "Rarrtl": "\u2916",
  "Rcaron": "\u0158",
  "Rcedil": "\u0156",
  "Rcy": "\u0420",
  "Re": "\u211C",
  "Rfr": "\u211C",
  "real": "\u211C",
  "realpart": "\u211C",
  "ReverseElement": "\u220B",
  "SuchThat": "\u220B",
  "ni": "\u220B",
  "niv": "\u220B",
  "ReverseEquilibrium": "\u21CB",
  "leftrightharpoons": "\u21CB",
  "lrhar": "\u21CB",
  "ReverseUpEquilibrium": "\u296F",
  "duhar": "\u296F",
  "Rho": "\u03A1",
  "RightAngleBracket": "\u27E9",
  "rang": "\u27E9",
  "rangle": "\u27E9",
  "RightArrow": "\u2192",
  "ShortRightArrow": "\u2192",
  "rarr": "\u2192",
  "rightarrow": "\u2192",
  "srarr": "\u2192",
  "RightArrowBar": "\u21E5",
  "rarrb": "\u21E5",
  "RightArrowLeftArrow": "\u21C4",
  "rightleftarrows": "\u21C4",
  "rlarr": "\u21C4",
  "RightCeiling": "\u2309",
  "rceil": "\u2309",
  "RightDoubleBracket": "\u27E7",
  "robrk": "\u27E7",
  "RightDownTeeVector": "\u295D",
  "RightDownVector": "\u21C2",
  "dharr": "\u21C2",
  "downharpoonright": "\u21C2",
  "RightDownVectorBar": "\u2955",
  "RightFloor": "\u230B",
  "rfloor": "\u230B",
  "RightTee": "\u22A2",
  "vdash": "\u22A2",
  "RightTeeArrow": "\u21A6",
  "map": "\u21A6",
  "mapsto": "\u21A6",
  "RightTeeVector": "\u295B",
  "RightTriangle": "\u22B3",
  "vartriangleright": "\u22B3",
  "vrtri": "\u22B3",
  "RightTriangleBar": "\u29D0",
  "RightTriangleEqual": "\u22B5",
  "rtrie": "\u22B5",
  "trianglerighteq": "\u22B5",
  "RightUpDownVector": "\u294F",
  "RightUpTeeVector": "\u295C",
  "RightUpVector": "\u21BE",
  "uharr": "\u21BE",
  "upharpoonright": "\u21BE",
  "RightUpVectorBar": "\u2954",
  "RightVector": "\u21C0",
  "rharu": "\u21C0",
  "rightharpoonup": "\u21C0",
  "RightVectorBar": "\u2953",
  "Ropf": "\u211D",
  "reals": "\u211D",
  "RoundImplies": "\u2970",
  "Rrightarrow": "\u21DB",
  "rAarr": "\u21DB",
  "Rscr": "\u211B",
  "realine": "\u211B",
  "Rsh": "\u21B1",
  "rsh": "\u21B1",
  "RuleDelayed": "\u29F4",
  "SHCHcy": "\u0429",
  "SHcy": "\u0428",
  "SOFTcy": "\u042C",
  "Sacute": "\u015A",
  "Sc": "\u2ABC",
  "Scaron": "\u0160",
  "Scedil": "\u015E",
  "Scirc": "\u015C",
  "Scy": "\u0421",
  "Sfr": "\u{1D516}",
  "ShortUpArrow": "\u2191",
  "UpArrow": "\u2191",
  "uarr": "\u2191",
  "uparrow": "\u2191",
  "Sigma": "\u03A3",
  "SmallCircle": "\u2218",
  "compfn": "\u2218",
  "Sopf": "\u{1D54A}",
  "Sqrt": "\u221A",
  "radic": "\u221A",
  "Square": "\u25A1",
  "squ": "\u25A1",
  "square": "\u25A1",
  "SquareIntersection": "\u2293",
  "sqcap": "\u2293",
  "SquareSubset": "\u228F",
  "sqsub": "\u228F",
  "sqsubset": "\u228F",
  "SquareSubsetEqual": "\u2291",
  "sqsube": "\u2291",
  "sqsubseteq": "\u2291",
  "SquareSuperset": "\u2290",
  "sqsup": "\u2290",
  "sqsupset": "\u2290",
  "SquareSupersetEqual": "\u2292",
  "sqsupe": "\u2292",
  "sqsupseteq": "\u2292",
  "SquareUnion": "\u2294",
  "sqcup": "\u2294",
  "Sscr": "\u{1D4AE}",
  "Star": "\u22C6",
  "sstarf": "\u22C6",
  "Sub": "\u22D0",
  "Subset": "\u22D0",
  "SubsetEqual": "\u2286",
  "sube": "\u2286",
  "subseteq": "\u2286",
  "Succeeds": "\u227B",
  "sc": "\u227B",
  "succ": "\u227B",
  "SucceedsEqual": "\u2AB0",
  "sce": "\u2AB0",
  "succeq": "\u2AB0",
  "SucceedsSlantEqual": "\u227D",
  "sccue": "\u227D",
  "succcurlyeq": "\u227D",
  "SucceedsTilde": "\u227F",
  "scsim": "\u227F",
  "succsim": "\u227F",
  "Sum": "\u2211",
  "sum": "\u2211",
  "Sup": "\u22D1",
  "Supset": "\u22D1",
  "Superset": "\u2283",
  "sup": "\u2283",
  "supset": "\u2283",
  "SupersetEqual": "\u2287",
  "supe": "\u2287",
  "supseteq": "\u2287",
  "THORN": "\xDE",
  "TRADE": "\u2122",
  "trade": "\u2122",
  "TSHcy": "\u040B",
  "TScy": "\u0426",
  "Tab": "	",
  "Tau": "\u03A4",
  "Tcaron": "\u0164",
  "Tcedil": "\u0162",
  "Tcy": "\u0422",
  "Tfr": "\u{1D517}",
  "Therefore": "\u2234",
  "there4": "\u2234",
  "therefore": "\u2234",
  "Theta": "\u0398",
  "ThickSpace": "\u205F\u200A",
  "ThinSpace": "\u2009",
  "thinsp": "\u2009",
  "Tilde": "\u223C",
  "sim": "\u223C",
  "thicksim": "\u223C",
  "thksim": "\u223C",
  "TildeEqual": "\u2243",
  "sime": "\u2243",
  "simeq": "\u2243",
  "TildeFullEqual": "\u2245",
  "cong": "\u2245",
  "TildeTilde": "\u2248",
  "ap": "\u2248",
  "approx": "\u2248",
  "asymp": "\u2248",
  "thickapprox": "\u2248",
  "thkap": "\u2248",
  "Topf": "\u{1D54B}",
  "TripleDot": "\u20DB",
  "tdot": "\u20DB",
  "Tscr": "\u{1D4AF}",
  "Tstrok": "\u0166",
  "Uacute": "\xDA",
  "Uarr": "\u219F",
  "Uarrocir": "\u2949",
  "Ubrcy": "\u040E",
  "Ubreve": "\u016C",
  "Ucirc": "\xDB",
  "Ucy": "\u0423",
  "Udblac": "\u0170",
  "Ufr": "\u{1D518}",
  "Ugrave": "\xD9",
  "Umacr": "\u016A",
  "UnderBar": "_",
  "lowbar": "_",
  "UnderBrace": "\u23DF",
  "UnderBracket": "\u23B5",
  "bbrk": "\u23B5",
  "UnderParenthesis": "\u23DD",
  "Union": "\u22C3",
  "bigcup": "\u22C3",
  "xcup": "\u22C3",
  "UnionPlus": "\u228E",
  "uplus": "\u228E",
  "Uogon": "\u0172",
  "Uopf": "\u{1D54C}",
  "UpArrowBar": "\u2912",
  "UpArrowDownArrow": "\u21C5",
  "udarr": "\u21C5",
  "UpDownArrow": "\u2195",
  "updownarrow": "\u2195",
  "varr": "\u2195",
  "UpEquilibrium": "\u296E",
  "udhar": "\u296E",
  "UpTee": "\u22A5",
  "bot": "\u22A5",
  "bottom": "\u22A5",
  "perp": "\u22A5",
  "UpTeeArrow": "\u21A5",
  "mapstoup": "\u21A5",
  "UpperLeftArrow": "\u2196",
  "nwarr": "\u2196",
  "nwarrow": "\u2196",
  "UpperRightArrow": "\u2197",
  "nearr": "\u2197",
  "nearrow": "\u2197",
  "Upsi": "\u03D2",
  "upsih": "\u03D2",
  "Upsilon": "\u03A5",
  "Uring": "\u016E",
  "Uscr": "\u{1D4B0}",
  "Utilde": "\u0168",
  "Uuml": "\xDC",
  "VDash": "\u22AB",
  "Vbar": "\u2AEB",
  "Vcy": "\u0412",
  "Vdash": "\u22A9",
  "Vdashl": "\u2AE6",
  "Vee": "\u22C1",
  "bigvee": "\u22C1",
  "xvee": "\u22C1",
  "Verbar": "\u2016",
  "Vert": "\u2016",
  "VerticalBar": "\u2223",
  "mid": "\u2223",
  "shortmid": "\u2223",
  "smid": "\u2223",
  "VerticalLine": "|",
  "verbar": "|",
  "vert": "|",
  "VerticalSeparator": "\u2758",
  "VerticalTilde": "\u2240",
  "wr": "\u2240",
  "wreath": "\u2240",
  "VeryThinSpace": "\u200A",
  "hairsp": "\u200A",
  "Vfr": "\u{1D519}",
  "Vopf": "\u{1D54D}",
  "Vscr": "\u{1D4B1}",
  "Vvdash": "\u22AA",
  "Wcirc": "\u0174",
  "Wedge": "\u22C0",
  "bigwedge": "\u22C0",
  "xwedge": "\u22C0",
  "Wfr": "\u{1D51A}",
  "Wopf": "\u{1D54E}",
  "Wscr": "\u{1D4B2}",
  "Xfr": "\u{1D51B}",
  "Xi": "\u039E",
  "Xopf": "\u{1D54F}",
  "Xscr": "\u{1D4B3}",
  "YAcy": "\u042F",
  "YIcy": "\u0407",
  "YUcy": "\u042E",
  "Yacute": "\xDD",
  "Ycirc": "\u0176",
  "Ycy": "\u042B",
  "Yfr": "\u{1D51C}",
  "Yopf": "\u{1D550}",
  "Yscr": "\u{1D4B4}",
  "Yuml": "\u0178",
  "ZHcy": "\u0416",
  "Zacute": "\u0179",
  "Zcaron": "\u017D",
  "Zcy": "\u0417",
  "Zdot": "\u017B",
  "Zeta": "\u0396",
  "Zfr": "\u2128",
  "zeetrf": "\u2128",
  "Zopf": "\u2124",
  "integers": "\u2124",
  "Zscr": "\u{1D4B5}",
  "aacute": "\xE1",
  "abreve": "\u0103",
  "ac": "\u223E",
  "mstpos": "\u223E",
  "acE": "\u223E\u0333",
  "acd": "\u223F",
  "acirc": "\xE2",
  "acy": "\u0430",
  "aelig": "\xE6",
  "afr": "\u{1D51E}",
  "agrave": "\xE0",
  "alefsym": "\u2135",
  "aleph": "\u2135",
  "alpha": "\u03B1",
  "amacr": "\u0101",
  "amalg": "\u2A3F",
  "and": "\u2227",
  "wedge": "\u2227",
  "andand": "\u2A55",
  "andd": "\u2A5C",
  "andslope": "\u2A58",
  "andv": "\u2A5A",
  "ang": "\u2220",
  "angle": "\u2220",
  "ange": "\u29A4",
  "angmsd": "\u2221",
  "measuredangle": "\u2221",
  "angmsdaa": "\u29A8",
  "angmsdab": "\u29A9",
  "angmsdac": "\u29AA",
  "angmsdad": "\u29AB",
  "angmsdae": "\u29AC",
  "angmsdaf": "\u29AD",
  "angmsdag": "\u29AE",
  "angmsdah": "\u29AF",
  "angrt": "\u221F",
  "angrtvb": "\u22BE",
  "angrtvbd": "\u299D",
  "angsph": "\u2222",
  "angzarr": "\u237C",
  "aogon": "\u0105",
  "aopf": "\u{1D552}",
  "apE": "\u2A70",
  "apacir": "\u2A6F",
  "ape": "\u224A",
  "approxeq": "\u224A",
  "apid": "\u224B",
  "apos": "'",
  "aring": "\xE5",
  "ascr": "\u{1D4B6}",
  "ast": "*",
  "midast": "*",
  "atilde": "\xE3",
  "auml": "\xE4",
  "awint": "\u2A11",
  "bNot": "\u2AED",
  "backcong": "\u224C",
  "bcong": "\u224C",
  "backepsilon": "\u03F6",
  "bepsi": "\u03F6",
  "backprime": "\u2035",
  "bprime": "\u2035",
  "backsim": "\u223D",
  "bsim": "\u223D",
  "backsimeq": "\u22CD",
  "bsime": "\u22CD",
  "barvee": "\u22BD",
  "barwed": "\u2305",
  "barwedge": "\u2305",
  "bbrktbrk": "\u23B6",
  "bcy": "\u0431",
  "bdquo": "\u201E",
  "ldquor": "\u201E",
  "bemptyv": "\u29B0",
  "beta": "\u03B2",
  "beth": "\u2136",
  "between": "\u226C",
  "twixt": "\u226C",
  "bfr": "\u{1D51F}",
  "bigcirc": "\u25EF",
  "xcirc": "\u25EF",
  "bigodot": "\u2A00",
  "xodot": "\u2A00",
  "bigoplus": "\u2A01",
  "xoplus": "\u2A01",
  "bigotimes": "\u2A02",
  "xotime": "\u2A02",
  "bigsqcup": "\u2A06",
  "xsqcup": "\u2A06",
  "bigstar": "\u2605",
  "starf": "\u2605",
  "bigtriangledown": "\u25BD",
  "xdtri": "\u25BD",
  "bigtriangleup": "\u25B3",
  "xutri": "\u25B3",
  "biguplus": "\u2A04",
  "xuplus": "\u2A04",
  "bkarow": "\u290D",
  "rbarr": "\u290D",
  "blacklozenge": "\u29EB",
  "lozf": "\u29EB",
  "blacktriangle": "\u25B4",
  "utrif": "\u25B4",
  "blacktriangledown": "\u25BE",
  "dtrif": "\u25BE",
  "blacktriangleleft": "\u25C2",
  "ltrif": "\u25C2",
  "blacktriangleright": "\u25B8",
  "rtrif": "\u25B8",
  "blank": "\u2423",
  "blk12": "\u2592",
  "blk14": "\u2591",
  "blk34": "\u2593",
  "block": "\u2588",
  "bne": "=\u20E5",
  "bnequiv": "\u2261\u20E5",
  "bnot": "\u2310",
  "bopf": "\u{1D553}",
  "bowtie": "\u22C8",
  "boxDL": "\u2557",
  "boxDR": "\u2554",
  "boxDl": "\u2556",
  "boxDr": "\u2553",
  "boxH": "\u2550",
  "boxHD": "\u2566",
  "boxHU": "\u2569",
  "boxHd": "\u2564",
  "boxHu": "\u2567",
  "boxUL": "\u255D",
  "boxUR": "\u255A",
  "boxUl": "\u255C",
  "boxUr": "\u2559",
  "boxV": "\u2551",
  "boxVH": "\u256C",
  "boxVL": "\u2563",
  "boxVR": "\u2560",
  "boxVh": "\u256B",
  "boxVl": "\u2562",
  "boxVr": "\u255F",
  "boxbox": "\u29C9",
  "boxdL": "\u2555",
  "boxdR": "\u2552",
  "boxdl": "\u2510",
  "boxdr": "\u250C",
  "boxhD": "\u2565",
  "boxhU": "\u2568",
  "boxhd": "\u252C",
  "boxhu": "\u2534",
  "boxminus": "\u229F",
  "minusb": "\u229F",
  "boxplus": "\u229E",
  "plusb": "\u229E",
  "boxtimes": "\u22A0",
  "timesb": "\u22A0",
  "boxuL": "\u255B",
  "boxuR": "\u2558",
  "boxul": "\u2518",
  "boxur": "\u2514",
  "boxv": "\u2502",
  "boxvH": "\u256A",
  "boxvL": "\u2561",
  "boxvR": "\u255E",
  "boxvh": "\u253C",
  "boxvl": "\u2524",
  "boxvr": "\u251C",
  "brvbar": "\xA6",
  "bscr": "\u{1D4B7}",
  "bsemi": "\u204F",
  "bsol": "\\",
  "bsolb": "\u29C5",
  "bsolhsub": "\u27C8",
  "bull": "\u2022",
  "bullet": "\u2022",
  "bumpE": "\u2AAE",
  "cacute": "\u0107",
  "cap": "\u2229",
  "capand": "\u2A44",
  "capbrcup": "\u2A49",
  "capcap": "\u2A4B",
  "capcup": "\u2A47",
  "capdot": "\u2A40",
  "caps": "\u2229\uFE00",
  "caret": "\u2041",
  "ccaps": "\u2A4D",
  "ccaron": "\u010D",
  "ccedil": "\xE7",
  "ccirc": "\u0109",
  "ccups": "\u2A4C",
  "ccupssm": "\u2A50",
  "cdot": "\u010B",
  "cemptyv": "\u29B2",
  "cent": "\xA2",
  "cfr": "\u{1D520}",
  "chcy": "\u0447",
  "check": "\u2713",
  "checkmark": "\u2713",
  "chi": "\u03C7",
  "cir": "\u25CB",
  "cirE": "\u29C3",
  "circ": "\u02C6",
  "circeq": "\u2257",
  "cire": "\u2257",
  "circlearrowleft": "\u21BA",
  "olarr": "\u21BA",
  "circlearrowright": "\u21BB",
  "orarr": "\u21BB",
  "circledS": "\u24C8",
  "oS": "\u24C8",
  "circledast": "\u229B",
  "oast": "\u229B",
  "circledcirc": "\u229A",
  "ocir": "\u229A",
  "circleddash": "\u229D",
  "odash": "\u229D",
  "cirfnint": "\u2A10",
  "cirmid": "\u2AEF",
  "cirscir": "\u29C2",
  "clubs": "\u2663",
  "clubsuit": "\u2663",
  "colon": ":",
  "comma": ",",
  "commat": "@",
  "comp": "\u2201",
  "complement": "\u2201",
  "congdot": "\u2A6D",
  "copf": "\u{1D554}",
  "copysr": "\u2117",
  "crarr": "\u21B5",
  "cross": "\u2717",
  "cscr": "\u{1D4B8}",
  "csub": "\u2ACF",
  "csube": "\u2AD1",
  "csup": "\u2AD0",
  "csupe": "\u2AD2",
  "ctdot": "\u22EF",
  "cudarrl": "\u2938",
  "cudarrr": "\u2935",
  "cuepr": "\u22DE",
  "curlyeqprec": "\u22DE",
  "cuesc": "\u22DF",
  "curlyeqsucc": "\u22DF",
  "cularr": "\u21B6",
  "curvearrowleft": "\u21B6",
  "cularrp": "\u293D",
  "cup": "\u222A",
  "cupbrcap": "\u2A48",
  "cupcap": "\u2A46",
  "cupcup": "\u2A4A",
  "cupdot": "\u228D",
  "cupor": "\u2A45",
  "cups": "\u222A\uFE00",
  "curarr": "\u21B7",
  "curvearrowright": "\u21B7",
  "curarrm": "\u293C",
  "curlyvee": "\u22CE",
  "cuvee": "\u22CE",
  "curlywedge": "\u22CF",
  "cuwed": "\u22CF",
  "curren": "\xA4",
  "cwint": "\u2231",
  "cylcty": "\u232D",
  "dHar": "\u2965",
  "dagger": "\u2020",
  "daleth": "\u2138",
  "dash": "\u2010",
  "hyphen": "\u2010",
  "dbkarow": "\u290F",
  "rBarr": "\u290F",
  "dcaron": "\u010F",
  "dcy": "\u0434",
  "ddarr": "\u21CA",
  "downdownarrows": "\u21CA",
  "ddotseq": "\u2A77",
  "eDDot": "\u2A77",
  "deg": "\xB0",
  "delta": "\u03B4",
  "demptyv": "\u29B1",
  "dfisht": "\u297F",
  "dfr": "\u{1D521}",
  "diamondsuit": "\u2666",
  "diams": "\u2666",
  "digamma": "\u03DD",
  "gammad": "\u03DD",
  "disin": "\u22F2",
  "div": "\xF7",
  "divide": "\xF7",
  "divideontimes": "\u22C7",
  "divonx": "\u22C7",
  "djcy": "\u0452",
  "dlcorn": "\u231E",
  "llcorner": "\u231E",
  "dlcrop": "\u230D",
  "dollar": "$",
  "dopf": "\u{1D555}",
  "doteqdot": "\u2251",
  "eDot": "\u2251",
  "dotminus": "\u2238",
  "minusd": "\u2238",
  "dotplus": "\u2214",
  "plusdo": "\u2214",
  "dotsquare": "\u22A1",
  "sdotb": "\u22A1",
  "drcorn": "\u231F",
  "lrcorner": "\u231F",
  "drcrop": "\u230C",
  "dscr": "\u{1D4B9}",
  "dscy": "\u0455",
  "dsol": "\u29F6",
  "dstrok": "\u0111",
  "dtdot": "\u22F1",
  "dtri": "\u25BF",
  "triangledown": "\u25BF",
  "dwangle": "\u29A6",
  "dzcy": "\u045F",
  "dzigrarr": "\u27FF",
  "eacute": "\xE9",
  "easter": "\u2A6E",
  "ecaron": "\u011B",
  "ecir": "\u2256",
  "eqcirc": "\u2256",
  "ecirc": "\xEA",
  "ecolon": "\u2255",
  "eqcolon": "\u2255",
  "ecy": "\u044D",
  "edot": "\u0117",
  "efDot": "\u2252",
  "fallingdotseq": "\u2252",
  "efr": "\u{1D522}",
  "eg": "\u2A9A",
  "egrave": "\xE8",
  "egs": "\u2A96",
  "eqslantgtr": "\u2A96",
  "egsdot": "\u2A98",
  "el": "\u2A99",
  "elinters": "\u23E7",
  "ell": "\u2113",
  "els": "\u2A95",
  "eqslantless": "\u2A95",
  "elsdot": "\u2A97",
  "emacr": "\u0113",
  "empty": "\u2205",
  "emptyset": "\u2205",
  "emptyv": "\u2205",
  "varnothing": "\u2205",
  "emsp13": "\u2004",
  "emsp14": "\u2005",
  "emsp": "\u2003",
  "eng": "\u014B",
  "ensp": "\u2002",
  "eogon": "\u0119",
  "eopf": "\u{1D556}",
  "epar": "\u22D5",
  "eparsl": "\u29E3",
  "eplus": "\u2A71",
  "epsi": "\u03B5",
  "epsilon": "\u03B5",
  "epsiv": "\u03F5",
  "straightepsilon": "\u03F5",
  "varepsilon": "\u03F5",
  "equals": "=",
  "equest": "\u225F",
  "questeq": "\u225F",
  "equivDD": "\u2A78",
  "eqvparsl": "\u29E5",
  "erDot": "\u2253",
  "risingdotseq": "\u2253",
  "erarr": "\u2971",
  "escr": "\u212F",
  "eta": "\u03B7",
  "eth": "\xF0",
  "euml": "\xEB",
  "euro": "\u20AC",
  "excl": "!",
  "fcy": "\u0444",
  "female": "\u2640",
  "ffilig": "\uFB03",
  "fflig": "\uFB00",
  "ffllig": "\uFB04",
  "ffr": "\u{1D523}",
  "filig": "\uFB01",
  "fjlig": "fj",
  "flat": "\u266D",
  "fllig": "\uFB02",
  "fltns": "\u25B1",
  "fnof": "\u0192",
  "fopf": "\u{1D557}",
  "fork": "\u22D4",
  "pitchfork": "\u22D4",
  "forkv": "\u2AD9",
  "fpartint": "\u2A0D",
  "frac12": "\xBD",
  "half": "\xBD",
  "frac13": "\u2153",
  "frac14": "\xBC",
  "frac15": "\u2155",
  "frac16": "\u2159",
  "frac18": "\u215B",
  "frac23": "\u2154",
  "frac25": "\u2156",
  "frac34": "\xBE",
  "frac35": "\u2157",
  "frac38": "\u215C",
  "frac45": "\u2158",
  "frac56": "\u215A",
  "frac58": "\u215D",
  "frac78": "\u215E",
  "frasl": "\u2044",
  "frown": "\u2322",
  "sfrown": "\u2322",
  "fscr": "\u{1D4BB}",
  "gEl": "\u2A8C",
  "gtreqqless": "\u2A8C",
  "gacute": "\u01F5",
  "gamma": "\u03B3",
  "gap": "\u2A86",
  "gtrapprox": "\u2A86",
  "gbreve": "\u011F",
  "gcirc": "\u011D",
  "gcy": "\u0433",
  "gdot": "\u0121",
  "gescc": "\u2AA9",
  "gesdot": "\u2A80",
  "gesdoto": "\u2A82",
  "gesdotol": "\u2A84",
  "gesl": "\u22DB\uFE00",
  "gesles": "\u2A94",
  "gfr": "\u{1D524}",
  "gimel": "\u2137",
  "gjcy": "\u0453",
  "glE": "\u2A92",
  "gla": "\u2AA5",
  "glj": "\u2AA4",
  "gnE": "\u2269",
  "gneqq": "\u2269",
  "gnap": "\u2A8A",
  "gnapprox": "\u2A8A",
  "gne": "\u2A88",
  "gneq": "\u2A88",
  "gnsim": "\u22E7",
  "gopf": "\u{1D558}",
  "gscr": "\u210A",
  "gsime": "\u2A8E",
  "gsiml": "\u2A90",
  "gtcc": "\u2AA7",
  "gtcir": "\u2A7A",
  "gtdot": "\u22D7",
  "gtrdot": "\u22D7",
  "gtlPar": "\u2995",
  "gtquest": "\u2A7C",
  "gtrarr": "\u2978",
  "gvertneqq": "\u2269\uFE00",
  "gvnE": "\u2269\uFE00",
  "hardcy": "\u044A",
  "harrcir": "\u2948",
  "harrw": "\u21AD",
  "leftrightsquigarrow": "\u21AD",
  "hbar": "\u210F",
  "hslash": "\u210F",
  "planck": "\u210F",
  "plankv": "\u210F",
  "hcirc": "\u0125",
  "hearts": "\u2665",
  "heartsuit": "\u2665",
  "hellip": "\u2026",
  "mldr": "\u2026",
  "hercon": "\u22B9",
  "hfr": "\u{1D525}",
  "hksearow": "\u2925",
  "searhk": "\u2925",
  "hkswarow": "\u2926",
  "swarhk": "\u2926",
  "hoarr": "\u21FF",
  "homtht": "\u223B",
  "hookleftarrow": "\u21A9",
  "larrhk": "\u21A9",
  "hookrightarrow": "\u21AA",
  "rarrhk": "\u21AA",
  "hopf": "\u{1D559}",
  "horbar": "\u2015",
  "hscr": "\u{1D4BD}",
  "hstrok": "\u0127",
  "hybull": "\u2043",
  "iacute": "\xED",
  "icirc": "\xEE",
  "icy": "\u0438",
  "iecy": "\u0435",
  "iexcl": "\xA1",
  "ifr": "\u{1D526}",
  "igrave": "\xEC",
  "iiiint": "\u2A0C",
  "qint": "\u2A0C",
  "iiint": "\u222D",
  "tint": "\u222D",
  "iinfin": "\u29DC",
  "iiota": "\u2129",
  "ijlig": "\u0133",
  "imacr": "\u012B",
  "imath": "\u0131",
  "inodot": "\u0131",
  "imof": "\u22B7",
  "imped": "\u01B5",
  "incare": "\u2105",
  "infin": "\u221E",
  "infintie": "\u29DD",
  "intcal": "\u22BA",
  "intercal": "\u22BA",
  "intlarhk": "\u2A17",
  "intprod": "\u2A3C",
  "iprod": "\u2A3C",
  "iocy": "\u0451",
  "iogon": "\u012F",
  "iopf": "\u{1D55A}",
  "iota": "\u03B9",
  "iquest": "\xBF",
  "iscr": "\u{1D4BE}",
  "isinE": "\u22F9",
  "isindot": "\u22F5",
  "isins": "\u22F4",
  "isinsv": "\u22F3",
  "itilde": "\u0129",
  "iukcy": "\u0456",
  "iuml": "\xEF",
  "jcirc": "\u0135",
  "jcy": "\u0439",
  "jfr": "\u{1D527}",
  "jmath": "\u0237",
  "jopf": "\u{1D55B}",
  "jscr": "\u{1D4BF}",
  "jsercy": "\u0458",
  "jukcy": "\u0454",
  "kappa": "\u03BA",
  "kappav": "\u03F0",
  "varkappa": "\u03F0",
  "kcedil": "\u0137",
  "kcy": "\u043A",
  "kfr": "\u{1D528}",
  "kgreen": "\u0138",
  "khcy": "\u0445",
  "kjcy": "\u045C",
  "kopf": "\u{1D55C}",
  "kscr": "\u{1D4C0}",
  "lAtail": "\u291B",
  "lBarr": "\u290E",
  "lEg": "\u2A8B",
  "lesseqqgtr": "\u2A8B",
  "lHar": "\u2962",
  "lacute": "\u013A",
  "laemptyv": "\u29B4",
  "lambda": "\u03BB",
  "langd": "\u2991",
  "lap": "\u2A85",
  "lessapprox": "\u2A85",
  "laquo": "\xAB",
  "larrbfs": "\u291F",
  "larrfs": "\u291D",
  "larrlp": "\u21AB",
  "looparrowleft": "\u21AB",
  "larrpl": "\u2939",
  "larrsim": "\u2973",
  "larrtl": "\u21A2",
  "leftarrowtail": "\u21A2",
  "lat": "\u2AAB",
  "latail": "\u2919",
  "late": "\u2AAD",
  "lates": "\u2AAD\uFE00",
  "lbarr": "\u290C",
  "lbbrk": "\u2772",
  "lbrace": "{",
  "lcub": "{",
  "lbrack": "[",
  "lsqb": "[",
  "lbrke": "\u298B",
  "lbrksld": "\u298F",
  "lbrkslu": "\u298D",
  "lcaron": "\u013E",
  "lcedil": "\u013C",
  "lcy": "\u043B",
  "ldca": "\u2936",
  "ldrdhar": "\u2967",
  "ldrushar": "\u294B",
  "ldsh": "\u21B2",
  "le": "\u2264",
  "leq": "\u2264",
  "leftleftarrows": "\u21C7",
  "llarr": "\u21C7",
  "leftthreetimes": "\u22CB",
  "lthree": "\u22CB",
  "lescc": "\u2AA8",
  "lesdot": "\u2A7F",
  "lesdoto": "\u2A81",
  "lesdotor": "\u2A83",
  "lesg": "\u22DA\uFE00",
  "lesges": "\u2A93",
  "lessdot": "\u22D6",
  "ltdot": "\u22D6",
  "lfisht": "\u297C",
  "lfr": "\u{1D529}",
  "lgE": "\u2A91",
  "lharul": "\u296A",
  "lhblk": "\u2584",
  "ljcy": "\u0459",
  "llhard": "\u296B",
  "lltri": "\u25FA",
  "lmidot": "\u0140",
  "lmoust": "\u23B0",
  "lmoustache": "\u23B0",
  "lnE": "\u2268",
  "lneqq": "\u2268",
  "lnap": "\u2A89",
  "lnapprox": "\u2A89",
  "lne": "\u2A87",
  "lneq": "\u2A87",
  "lnsim": "\u22E6",
  "loang": "\u27EC",
  "loarr": "\u21FD",
  "longmapsto": "\u27FC",
  "xmap": "\u27FC",
  "looparrowright": "\u21AC",
  "rarrlp": "\u21AC",
  "lopar": "\u2985",
  "lopf": "\u{1D55D}",
  "loplus": "\u2A2D",
  "lotimes": "\u2A34",
  "lowast": "\u2217",
  "loz": "\u25CA",
  "lozenge": "\u25CA",
  "lpar": "(",
  "lparlt": "\u2993",
  "lrhard": "\u296D",
  "lrm": "\u200E",
  "lrtri": "\u22BF",
  "lsaquo": "\u2039",
  "lscr": "\u{1D4C1}",
  "lsime": "\u2A8D",
  "lsimg": "\u2A8F",
  "lsquor": "\u201A",
  "sbquo": "\u201A",
  "lstrok": "\u0142",
  "ltcc": "\u2AA6",
  "ltcir": "\u2A79",
  "ltimes": "\u22C9",
  "ltlarr": "\u2976",
  "ltquest": "\u2A7B",
  "ltrPar": "\u2996",
  "ltri": "\u25C3",
  "triangleleft": "\u25C3",
  "lurdshar": "\u294A",
  "luruhar": "\u2966",
  "lvertneqq": "\u2268\uFE00",
  "lvnE": "\u2268\uFE00",
  "mDDot": "\u223A",
  "macr": "\xAF",
  "strns": "\xAF",
  "male": "\u2642",
  "malt": "\u2720",
  "maltese": "\u2720",
  "marker": "\u25AE",
  "mcomma": "\u2A29",
  "mcy": "\u043C",
  "mdash": "\u2014",
  "mfr": "\u{1D52A}",
  "mho": "\u2127",
  "micro": "\xB5",
  "midcir": "\u2AF0",
  "minus": "\u2212",
  "minusdu": "\u2A2A",
  "mlcp": "\u2ADB",
  "models": "\u22A7",
  "mopf": "\u{1D55E}",
  "mscr": "\u{1D4C2}",
  "mu": "\u03BC",
  "multimap": "\u22B8",
  "mumap": "\u22B8",
  "nGg": "\u22D9\u0338",
  "nGt": "\u226B\u20D2",
  "nLeftarrow": "\u21CD",
  "nlArr": "\u21CD",
  "nLeftrightarrow": "\u21CE",
  "nhArr": "\u21CE",
  "nLl": "\u22D8\u0338",
  "nLt": "\u226A\u20D2",
  "nRightarrow": "\u21CF",
  "nrArr": "\u21CF",
  "nVDash": "\u22AF",
  "nVdash": "\u22AE",
  "nacute": "\u0144",
  "nang": "\u2220\u20D2",
  "napE": "\u2A70\u0338",
  "napid": "\u224B\u0338",
  "napos": "\u0149",
  "natur": "\u266E",
  "natural": "\u266E",
  "ncap": "\u2A43",
  "ncaron": "\u0148",
  "ncedil": "\u0146",
  "ncongdot": "\u2A6D\u0338",
  "ncup": "\u2A42",
  "ncy": "\u043D",
  "ndash": "\u2013",
  "neArr": "\u21D7",
  "nearhk": "\u2924",
  "nedot": "\u2250\u0338",
  "nesear": "\u2928",
  "toea": "\u2928",
  "nfr": "\u{1D52B}",
  "nharr": "\u21AE",
  "nleftrightarrow": "\u21AE",
  "nhpar": "\u2AF2",
  "nis": "\u22FC",
  "nisd": "\u22FA",
  "njcy": "\u045A",
  "nlE": "\u2266\u0338",
  "nleqq": "\u2266\u0338",
  "nlarr": "\u219A",
  "nleftarrow": "\u219A",
  "nldr": "\u2025",
  "nopf": "\u{1D55F}",
  "not": "\xAC",
  "notinE": "\u22F9\u0338",
  "notindot": "\u22F5\u0338",
  "notinvb": "\u22F7",
  "notinvc": "\u22F6",
  "notnivb": "\u22FE",
  "notnivc": "\u22FD",
  "nparsl": "\u2AFD\u20E5",
  "npart": "\u2202\u0338",
  "npolint": "\u2A14",
  "nrarr": "\u219B",
  "nrightarrow": "\u219B",
  "nrarrc": "\u2933\u0338",
  "nrarrw": "\u219D\u0338",
  "nscr": "\u{1D4C3}",
  "nsub": "\u2284",
  "nsubE": "\u2AC5\u0338",
  "nsubseteqq": "\u2AC5\u0338",
  "nsup": "\u2285",
  "nsupE": "\u2AC6\u0338",
  "nsupseteqq": "\u2AC6\u0338",
  "ntilde": "\xF1",
  "nu": "\u03BD",
  "num": "#",
  "numero": "\u2116",
  "numsp": "\u2007",
  "nvDash": "\u22AD",
  "nvHarr": "\u2904",
  "nvap": "\u224D\u20D2",
  "nvdash": "\u22AC",
  "nvge": "\u2265\u20D2",
  "nvgt": ">\u20D2",
  "nvinfin": "\u29DE",
  "nvlArr": "\u2902",
  "nvle": "\u2264\u20D2",
  "nvlt": "<\u20D2",
  "nvltrie": "\u22B4\u20D2",
  "nvrArr": "\u2903",
  "nvrtrie": "\u22B5\u20D2",
  "nvsim": "\u223C\u20D2",
  "nwArr": "\u21D6",
  "nwarhk": "\u2923",
  "nwnear": "\u2927",
  "oacute": "\xF3",
  "ocirc": "\xF4",
  "ocy": "\u043E",
  "odblac": "\u0151",
  "odiv": "\u2A38",
  "odsold": "\u29BC",
  "oelig": "\u0153",
  "ofcir": "\u29BF",
  "ofr": "\u{1D52C}",
  "ogon": "\u02DB",
  "ograve": "\xF2",
  "ogt": "\u29C1",
  "ohbar": "\u29B5",
  "olcir": "\u29BE",
  "olcross": "\u29BB",
  "olt": "\u29C0",
  "omacr": "\u014D",
  "omega": "\u03C9",
  "omicron": "\u03BF",
  "omid": "\u29B6",
  "oopf": "\u{1D560}",
  "opar": "\u29B7",
  "operp": "\u29B9",
  "or": "\u2228",
  "vee": "\u2228",
  "ord": "\u2A5D",
  "order": "\u2134",
  "orderof": "\u2134",
  "oscr": "\u2134",
  "ordf": "\xAA",
  "ordm": "\xBA",
  "origof": "\u22B6",
  "oror": "\u2A56",
  "orslope": "\u2A57",
  "orv": "\u2A5B",
  "oslash": "\xF8",
  "osol": "\u2298",
  "otilde": "\xF5",
  "otimesas": "\u2A36",
  "ouml": "\xF6",
  "ovbar": "\u233D",
  "para": "\xB6",
  "parsim": "\u2AF3",
  "parsl": "\u2AFD",
  "pcy": "\u043F",
  "percnt": "%",
  "period": ".",
  "permil": "\u2030",
  "pertenk": "\u2031",
  "pfr": "\u{1D52D}",
  "phi": "\u03C6",
  "phiv": "\u03D5",
  "straightphi": "\u03D5",
  "varphi": "\u03D5",
  "phone": "\u260E",
  "pi": "\u03C0",
  "piv": "\u03D6",
  "varpi": "\u03D6",
  "planckh": "\u210E",
  "plus": "+",
  "plusacir": "\u2A23",
  "pluscir": "\u2A22",
  "plusdu": "\u2A25",
  "pluse": "\u2A72",
  "plussim": "\u2A26",
  "plustwo": "\u2A27",
  "pointint": "\u2A15",
  "popf": "\u{1D561}",
  "pound": "\xA3",
  "prE": "\u2AB3",
  "prap": "\u2AB7",
  "precapprox": "\u2AB7",
  "precnapprox": "\u2AB9",
  "prnap": "\u2AB9",
  "precneqq": "\u2AB5",
  "prnE": "\u2AB5",
  "precnsim": "\u22E8",
  "prnsim": "\u22E8",
  "prime": "\u2032",
  "profalar": "\u232E",
  "profline": "\u2312",
  "profsurf": "\u2313",
  "prurel": "\u22B0",
  "pscr": "\u{1D4C5}",
  "psi": "\u03C8",
  "puncsp": "\u2008",
  "qfr": "\u{1D52E}",
  "qopf": "\u{1D562}",
  "qprime": "\u2057",
  "qscr": "\u{1D4C6}",
  "quatint": "\u2A16",
  "quest": "?",
  "rAtail": "\u291C",
  "rHar": "\u2964",
  "race": "\u223D\u0331",
  "racute": "\u0155",
  "raemptyv": "\u29B3",
  "rangd": "\u2992",
  "range": "\u29A5",
  "raquo": "\xBB",
  "rarrap": "\u2975",
  "rarrbfs": "\u2920",
  "rarrc": "\u2933",
  "rarrfs": "\u291E",
  "rarrpl": "\u2945",
  "rarrsim": "\u2974",
  "rarrtl": "\u21A3",
  "rightarrowtail": "\u21A3",
  "rarrw": "\u219D",
  "rightsquigarrow": "\u219D",
  "ratail": "\u291A",
  "ratio": "\u2236",
  "rbbrk": "\u2773",
  "rbrace": "}",
  "rcub": "}",
  "rbrack": "]",
  "rsqb": "]",
  "rbrke": "\u298C",
  "rbrksld": "\u298E",
  "rbrkslu": "\u2990",
  "rcaron": "\u0159",
  "rcedil": "\u0157",
  "rcy": "\u0440",
  "rdca": "\u2937",
  "rdldhar": "\u2969",
  "rdsh": "\u21B3",
  "rect": "\u25AD",
  "rfisht": "\u297D",
  "rfr": "\u{1D52F}",
  "rharul": "\u296C",
  "rho": "\u03C1",
  "rhov": "\u03F1",
  "varrho": "\u03F1",
  "rightrightarrows": "\u21C9",
  "rrarr": "\u21C9",
  "rightthreetimes": "\u22CC",
  "rthree": "\u22CC",
  "ring": "\u02DA",
  "rlm": "\u200F",
  "rmoust": "\u23B1",
  "rmoustache": "\u23B1",
  "rnmid": "\u2AEE",
  "roang": "\u27ED",
  "roarr": "\u21FE",
  "ropar": "\u2986",
  "ropf": "\u{1D563}",
  "roplus": "\u2A2E",
  "rotimes": "\u2A35",
  "rpar": ")",
  "rpargt": "\u2994",
  "rppolint": "\u2A12",
  "rsaquo": "\u203A",
  "rscr": "\u{1D4C7}",
  "rtimes": "\u22CA",
  "rtri": "\u25B9",
  "triangleright": "\u25B9",
  "rtriltri": "\u29CE",
  "ruluhar": "\u2968",
  "rx": "\u211E",
  "sacute": "\u015B",
  "scE": "\u2AB4",
  "scap": "\u2AB8",
  "succapprox": "\u2AB8",
  "scaron": "\u0161",
  "scedil": "\u015F",
  "scirc": "\u015D",
  "scnE": "\u2AB6",
  "succneqq": "\u2AB6",
  "scnap": "\u2ABA",
  "succnapprox": "\u2ABA",
  "scnsim": "\u22E9",
  "succnsim": "\u22E9",
  "scpolint": "\u2A13",
  "scy": "\u0441",
  "sdot": "\u22C5",
  "sdote": "\u2A66",
  "seArr": "\u21D8",
  "sect": "\xA7",
  "semi": ";",
  "seswar": "\u2929",
  "tosa": "\u2929",
  "sext": "\u2736",
  "sfr": "\u{1D530}",
  "sharp": "\u266F",
  "shchcy": "\u0449",
  "shcy": "\u0448",
  "shy": "\xAD",
  "sigma": "\u03C3",
  "sigmaf": "\u03C2",
  "sigmav": "\u03C2",
  "varsigma": "\u03C2",
  "simdot": "\u2A6A",
  "simg": "\u2A9E",
  "simgE": "\u2AA0",
  "siml": "\u2A9D",
  "simlE": "\u2A9F",
  "simne": "\u2246",
  "simplus": "\u2A24",
  "simrarr": "\u2972",
  "smashp": "\u2A33",
  "smeparsl": "\u29E4",
  "smile": "\u2323",
  "ssmile": "\u2323",
  "smt": "\u2AAA",
  "smte": "\u2AAC",
  "smtes": "\u2AAC\uFE00",
  "softcy": "\u044C",
  "sol": "/",
  "solb": "\u29C4",
  "solbar": "\u233F",
  "sopf": "\u{1D564}",
  "spades": "\u2660",
  "spadesuit": "\u2660",
  "sqcaps": "\u2293\uFE00",
  "sqcups": "\u2294\uFE00",
  "sscr": "\u{1D4C8}",
  "star": "\u2606",
  "sub": "\u2282",
  "subset": "\u2282",
  "subE": "\u2AC5",
  "subseteqq": "\u2AC5",
  "subdot": "\u2ABD",
  "subedot": "\u2AC3",
  "submult": "\u2AC1",
  "subnE": "\u2ACB",
  "subsetneqq": "\u2ACB",
  "subne": "\u228A",
  "subsetneq": "\u228A",
  "subplus": "\u2ABF",
  "subrarr": "\u2979",
  "subsim": "\u2AC7",
  "subsub": "\u2AD5",
  "subsup": "\u2AD3",
  "sung": "\u266A",
  "sup1": "\xB9",
  "sup2": "\xB2",
  "sup3": "\xB3",
  "supE": "\u2AC6",
  "supseteqq": "\u2AC6",
  "supdot": "\u2ABE",
  "supdsub": "\u2AD8",
  "supedot": "\u2AC4",
  "suphsol": "\u27C9",
  "suphsub": "\u2AD7",
  "suplarr": "\u297B",
  "supmult": "\u2AC2",
  "supnE": "\u2ACC",
  "supsetneqq": "\u2ACC",
  "supne": "\u228B",
  "supsetneq": "\u228B",
  "supplus": "\u2AC0",
  "supsim": "\u2AC8",
  "supsub": "\u2AD4",
  "supsup": "\u2AD6",
  "swArr": "\u21D9",
  "swnwar": "\u292A",
  "szlig": "\xDF",
  "target": "\u2316",
  "tau": "\u03C4",
  "tcaron": "\u0165",
  "tcedil": "\u0163",
  "tcy": "\u0442",
  "telrec": "\u2315",
  "tfr": "\u{1D531}",
  "theta": "\u03B8",
  "thetasym": "\u03D1",
  "thetav": "\u03D1",
  "vartheta": "\u03D1",
  "thorn": "\xFE",
  "times": "\xD7",
  "timesbar": "\u2A31",
  "timesd": "\u2A30",
  "topbot": "\u2336",
  "topcir": "\u2AF1",
  "topf": "\u{1D565}",
  "topfork": "\u2ADA",
  "tprime": "\u2034",
  "triangle": "\u25B5",
  "utri": "\u25B5",
  "triangleq": "\u225C",
  "trie": "\u225C",
  "tridot": "\u25EC",
  "triminus": "\u2A3A",
  "triplus": "\u2A39",
  "trisb": "\u29CD",
  "tritime": "\u2A3B",
  "trpezium": "\u23E2",
  "tscr": "\u{1D4C9}",
  "tscy": "\u0446",
  "tshcy": "\u045B",
  "tstrok": "\u0167",
  "uHar": "\u2963",
  "uacute": "\xFA",
  "ubrcy": "\u045E",
  "ubreve": "\u016D",
  "ucirc": "\xFB",
  "ucy": "\u0443",
  "udblac": "\u0171",
  "ufisht": "\u297E",
  "ufr": "\u{1D532}",
  "ugrave": "\xF9",
  "uhblk": "\u2580",
  "ulcorn": "\u231C",
  "ulcorner": "\u231C",
  "ulcrop": "\u230F",
  "ultri": "\u25F8",
  "umacr": "\u016B",
  "uogon": "\u0173",
  "uopf": "\u{1D566}",
  "upsi": "\u03C5",
  "upsilon": "\u03C5",
  "upuparrows": "\u21C8",
  "uuarr": "\u21C8",
  "urcorn": "\u231D",
  "urcorner": "\u231D",
  "urcrop": "\u230E",
  "uring": "\u016F",
  "urtri": "\u25F9",
  "uscr": "\u{1D4CA}",
  "utdot": "\u22F0",
  "utilde": "\u0169",
  "uuml": "\xFC",
  "uwangle": "\u29A7",
  "vBar": "\u2AE8",
  "vBarv": "\u2AE9",
  "vangrt": "\u299C",
  "varsubsetneq": "\u228A\uFE00",
  "vsubne": "\u228A\uFE00",
  "varsubsetneqq": "\u2ACB\uFE00",
  "vsubnE": "\u2ACB\uFE00",
  "varsupsetneq": "\u228B\uFE00",
  "vsupne": "\u228B\uFE00",
  "varsupsetneqq": "\u2ACC\uFE00",
  "vsupnE": "\u2ACC\uFE00",
  "vcy": "\u0432",
  "veebar": "\u22BB",
  "veeeq": "\u225A",
  "vellip": "\u22EE",
  "vfr": "\u{1D533}",
  "vopf": "\u{1D567}",
  "vscr": "\u{1D4CB}",
  "vzigzag": "\u299A",
  "wcirc": "\u0175",
  "wedbar": "\u2A5F",
  "wedgeq": "\u2259",
  "weierp": "\u2118",
  "wp": "\u2118",
  "wfr": "\u{1D534}",
  "wopf": "\u{1D568}",
  "wscr": "\u{1D4CC}",
  "xfr": "\u{1D535}",
  "xi": "\u03BE",
  "xnis": "\u22FB",
  "xopf": "\u{1D569}",
  "xscr": "\u{1D4CD}",
  "yacute": "\xFD",
  "yacy": "\u044F",
  "ycirc": "\u0177",
  "ycy": "\u044B",
  "yen": "\xA5",
  "yfr": "\u{1D536}",
  "yicy": "\u0457",
  "yopf": "\u{1D56A}",
  "yscr": "\u{1D4CE}",
  "yucy": "\u044E",
  "yuml": "\xFF",
  "zacute": "\u017A",
  "zcaron": "\u017E",
  "zcy": "\u0437",
  "zdot": "\u017C",
  "zeta": "\u03B6",
  "zfr": "\u{1D537}",
  "zhcy": "\u0436",
  "zigrarr": "\u21DD",
  "zopf": "\u{1D56B}",
  "zscr": "\u{1D4CF}",
  "zwj": "\u200D",
  "zwnj": "\u200C"
};
NAMED_ENTITIES["ngsp"] = "\uE500";

// node_modules/angular-html-parser/dist/compiler/src/ml_parser/lexer.mjs
var TokenizeResult = class {
  tokens;
  errors;
  nonNormalizedIcuExpressions;
  constructor(tokens, errors, nonNormalizedIcuExpressions) {
    this.tokens = tokens;
    this.errors = errors;
    this.nonNormalizedIcuExpressions = nonNormalizedIcuExpressions;
  }
};
function tokenize(source, url, getTagContentType, options2 = {}) {
  const tokenizer = new _Tokenizer(new ParseSourceFile(source, url), getTagContentType, options2);
  tokenizer.tokenize();
  return new TokenizeResult(mergeTextTokens(tokenizer.tokens), tokenizer.errors, tokenizer.nonNormalizedIcuExpressions);
}
var _CR_OR_CRLF_REGEXP = /\r\n?/g;
function _unexpectedCharacterErrorMsg(charCode) {
  return `Unexpected character "${charCode === 0 ? "EOF" : String.fromCharCode(charCode)}"`;
}
function _unknownEntityErrorMsg(entitySrc) {
  return `Unknown entity "${entitySrc}" - use the "&#<decimal>;" or  "&#x<hex>;" syntax`;
}
function _unparsableEntityErrorMsg(type, entityStr) {
  return `Unable to parse entity "${entityStr}" - ${type} character reference entities must end with ";"`;
}
var SUPPORTED_BLOCKS = ["@if", "@else", "@for", "@switch", "@case", "@default", "@empty", "@defer", "@placeholder", "@loading", "@boundary", "@error", "@content"];
var INTERPOLATION = {
  start: "{{",
  end: "}}"
};
var DEFAULT_NEVER_PATTERN = /^default[^\S\r\n]+never/;
var ELSE_IF_PATTERN = /^else[^\S\r\n]+if/;
var _Tokenizer = class {
  _getTagContentType;
  _cursor;
  _tokenizeIcu;
  _leadingTriviaCodePoints;
  _canSelfClose;
  _allowHtmComponentClosingTags;
  _allowStartTagComments;
  _currentTokenStart = null;
  _currentTokenType = null;
  _expansionCaseStack = [];
  _openDirectiveCount = 0;
  _inInterpolation = false;
  _preserveLineEndings;
  _i18nNormalizeLineEndingsInICUs;
  _fullNameStack = [];
  _tokenizeBlocks;
  _tokenizeLet;
  _selectorlessEnabled;
  tokens = [];
  errors = [];
  nonNormalizedIcuExpressions = [];
  /**
  * @param _file The html source file being tokenized.
  * @param _getTagContentType A function that will retrieve a tag content type for a given tag
  *     name.
  * @param options Configuration of the tokenization.
  */
  constructor(_file, _getTagContentType, options2) {
    this._getTagContentType = _getTagContentType;
    this._tokenizeIcu = options2.tokenizeExpansionForms || false;
    this._leadingTriviaCodePoints = options2.leadingTriviaChars && options2.leadingTriviaChars.map((c) => c.codePointAt(0) || 0);
    this._canSelfClose = options2.canSelfClose || false;
    this._allowHtmComponentClosingTags = options2.allowHtmComponentClosingTags || false;
    this._allowStartTagComments = options2.allowStartTagComments ?? true;
    const range = options2.range || {
      endPos: _file.content.length,
      startPos: 0,
      startLine: 0,
      startCol: 0
    };
    this._cursor = options2.escapedString ? new EscapedCharacterCursor(_file, range) : new PlainCharacterCursor(_file, range);
    this._preserveLineEndings = options2.preserveLineEndings || false;
    this._i18nNormalizeLineEndingsInICUs = options2.i18nNormalizeLineEndingsInICUs || false;
    this._tokenizeBlocks = options2.tokenizeBlocks ?? true;
    this._tokenizeLet = options2.tokenizeLet ?? true;
    this._selectorlessEnabled = options2.selectorlessEnabled ?? false;
    try {
      this._cursor.init();
    } catch (e) {
      this.handleError(e);
    }
  }
  _processCarriageReturns(content) {
    if (this._preserveLineEndings) return content;
    return content.replace(_CR_OR_CRLF_REGEXP, "\n");
  }
  tokenize() {
    while (this._cursor.peek() !== 0) {
      const start = this._cursor.clone();
      try {
        if (this._attemptCharCode(60)) {
          if (this._attemptCharCode(33)) {
            if (this._attemptStr("[CDATA[")) this._consumeCdata(start);
            else if (this._attemptStr("--")) this._consumeComment(start);
            else if (this._attemptStrCaseInsensitive("doctype")) this._consumeDocType(start);
            else this._consumeBogusComment(start);
          } else if (this._attemptCharCode(47)) this._consumeTagClose(start);
          else {
            const savedPos = this._cursor.clone();
            if (this._attemptCharCode(63)) {
              this._cursor = savedPos;
              this._consumeBogusComment(start);
            } else this._consumeTagOpen(start);
          }
        } else if (this._tokenizeLet && this._cursor.peek() === 64 && !this._inInterpolation && this._isLetStart()) this._consumeLetDeclaration(start);
        else if (this._tokenizeBlocks && this._isBlockStart()) this._consumeBlockStart(start);
        else if (this._tokenizeBlocks && !this._inInterpolation && !this._isInExpansionCase() && !this._isInExpansionForm() && this._attemptCharCode(125)) this._consumeBlockEnd(start);
        else if (!(this._tokenizeIcu && this._tokenizeExpansionForm())) this._consumeWithInterpolation(5, 8, () => this._isTextEnd(), () => this._isTagStart());
      } catch (e) {
        this.handleError(e);
      }
    }
    this._beginToken(44);
    this._endToken([]);
  }
  _getBlockName() {
    let spacesInNameAllowed = false;
    const nameCursor = this._cursor.clone();
    this._attemptCharCodeUntilFn((code) => {
      if (isWhitespace(code)) return !spacesInNameAllowed;
      if (isBlockNameChar(code)) {
        spacesInNameAllowed = true;
        return false;
      }
      return true;
    });
    let result = this._cursor.getChars(nameCursor).trim();
    if (ELSE_IF_PATTERN.test(result)) result = "else if";
    else if (DEFAULT_NEVER_PATTERN.test(result)) result = "default never";
    return result;
  }
  _consumeBlockStart(start) {
    this._requireCharCode(64);
    this._beginToken(26, start);
    const startToken = this._endToken([this._getBlockName()]);
    if (this._cursor.peek() === 40) {
      this._cursor.advance();
      this._consumeBlockParameters();
      this._attemptCharCodeUntilFn(isNotWhitespace);
      if (this._attemptCharCode(41)) this._attemptCharCodeUntilFn(isNotWhitespace);
      else {
        startToken.type = 30;
        return;
      }
    }
    if (startToken.parts[0] === "default never" && this._attemptCharCode(59)) {
      this._beginToken(27);
      this._endToken([]);
      this._beginToken(28);
      this._endToken([]);
      return;
    }
    if (this._attemptCharCode(123)) {
      this._beginToken(27);
      this._endToken([]);
    } else if (this._isBlockStart() && (startToken.parts[0] === "case" || startToken.parts[0] === "default")) {
      this._beginToken(27);
      this._endToken([]);
      this._beginToken(28);
      this._endToken([]);
    } else startToken.type = 30;
  }
  _consumeBlockEnd(start) {
    this._beginToken(28, start);
    this._endToken([]);
  }
  _consumeBlockParameters() {
    this._attemptCharCodeUntilFn(isBlockParameterChar);
    while (this._cursor.peek() !== 41 && this._cursor.peek() !== 0) {
      this._beginToken(29);
      const start = this._cursor.clone();
      let inQuote = null;
      let openParens = 0;
      while (this._cursor.peek() !== 59 && this._cursor.peek() !== 0 || inQuote !== null) {
        const char = this._cursor.peek();
        if (char === 92) this._cursor.advance();
        else if (char === inQuote) inQuote = null;
        else if (inQuote === null && isQuote(char)) inQuote = char;
        else if (char === 40 && inQuote === null) openParens++;
        else if (char === 41 && inQuote === null) {
          if (openParens === 0) break;
          else if (openParens > 0) openParens--;
        }
        this._cursor.advance();
      }
      this._endToken([this._cursor.getChars(start)]);
      this._attemptCharCodeUntilFn(isBlockParameterChar);
    }
  }
  _consumeLetDeclaration(start) {
    this._requireStr("@let");
    this._beginToken(31, start);
    if (isWhitespace(this._cursor.peek())) this._attemptCharCodeUntilFn(isNotWhitespace);
    else {
      const token = this._endToken([this._cursor.getChars(start)]);
      token.type = 34;
      return;
    }
    const startToken = this._endToken([this._getLetDeclarationName()]);
    this._attemptCharCodeUntilFn(isNotWhitespace);
    if (!this._attemptCharCode(61)) {
      startToken.type = 34;
      return;
    }
    this._attemptCharCodeUntilFn((code) => isNotWhitespace(code) && !isNewLine(code));
    this._consumeLetDeclarationValue();
    if (this._cursor.peek() === 59) {
      this._beginToken(33);
      this._cursor.advance();
      this._endToken([]);
    } else {
      startToken.type = 34;
      startToken.sourceSpan = this._cursor.getSpan(start);
    }
  }
  _getLetDeclarationName() {
    const nameCursor = this._cursor.clone();
    let allowDigit = false;
    this._attemptCharCodeUntilFn((code) => {
      if (isAsciiLetter(code) || code === 36 || code === 95 || allowDigit && isDigit(code)) {
        allowDigit = true;
        return false;
      }
      return true;
    });
    return this._cursor.getChars(nameCursor).trim();
  }
  _consumeLetDeclarationValue() {
    const start = this._cursor.clone();
    this._beginToken(32, start);
    this._attemptUntilIgnoreQuotes((char) => char === 59);
    this._endToken([this._cursor.getChars(start)]);
  }
  /**
  * @returns whether an ICU token has been created
  * @internal
  */
  _tokenizeExpansionForm() {
    if (this.isExpansionFormStart()) {
      this._consumeExpansionFormStart();
      return true;
    }
    if (isExpansionCaseStart(this._cursor.peek()) && this._isInExpansionForm()) {
      this._consumeExpansionCaseStart();
      return true;
    }
    if (this._cursor.peek() === 125) {
      if (this._isInExpansionCase()) {
        this._consumeExpansionCaseEnd();
        return true;
      }
      if (this._isInExpansionForm()) {
        this._consumeExpansionFormEnd();
        return true;
      }
    }
    return false;
  }
  _beginToken(type, start = this._cursor.clone()) {
    this._currentTokenStart = start;
    this._currentTokenType = type;
  }
  _endToken(parts, end) {
    if (this._currentTokenStart === null) throw new ParseError(this._cursor.getSpan(end), "Programming error - attempted to end a token when there was no start to the token");
    if (this._currentTokenType === null) throw new ParseError(this._cursor.getSpan(this._currentTokenStart), "Programming error - attempted to end a token which has no token type");
    const token = {
      type: this._currentTokenType,
      parts,
      sourceSpan: (end ?? this._cursor).getSpan(this._currentTokenStart, this._leadingTriviaCodePoints)
    };
    this.tokens.push(token);
    this._currentTokenStart = null;
    this._currentTokenType = null;
    return token;
  }
  _createError(msg, span) {
    if (this._isInExpansionForm()) msg += ` (Do you have an unescaped "{" in your template? Use "{{ '{' }}") to escape it.)`;
    const error = new ParseError(span, msg);
    this._currentTokenStart = null;
    this._currentTokenType = null;
    return error;
  }
  handleError(e) {
    if (e instanceof CursorError) e = this._createError(e.msg, this._cursor.getSpan(e.cursor));
    if (e instanceof ParseError) this.errors.push(e);
    else throw e;
  }
  _attemptCharCode(charCode) {
    if (this._cursor.peek() === charCode) {
      this._cursor.advance();
      return true;
    }
    return false;
  }
  _attemptCharCodeCaseInsensitive(charCode) {
    if (compareCharCodeCaseInsensitive(this._cursor.peek(), charCode)) {
      this._cursor.advance();
      return true;
    }
    return false;
  }
  _requireCharCode(charCode) {
    const location = this._cursor.clone();
    if (!this._attemptCharCode(charCode)) throw this._createError(_unexpectedCharacterErrorMsg(this._cursor.peek()), this._cursor.getSpan(location));
  }
  _attemptStr(chars) {
    const len = chars.length;
    if (this._cursor.charsLeft() < len) return false;
    const initialPosition = this._cursor.clone();
    for (let i = 0; i < len; i++) if (!this._attemptCharCode(chars.charCodeAt(i))) {
      this._cursor = initialPosition;
      return false;
    }
    return true;
  }
  _attemptStrCaseInsensitive(chars) {
    for (let i = 0; i < chars.length; i++) if (!this._attemptCharCodeCaseInsensitive(chars.charCodeAt(i))) return false;
    return true;
  }
  _requireStr(chars) {
    const location = this._cursor.clone();
    if (!this._attemptStr(chars)) throw this._createError(_unexpectedCharacterErrorMsg(this._cursor.peek()), this._cursor.getSpan(location));
  }
  _requireStrCaseInsensitive(chars) {
    const location = this._cursor.clone();
    if (!this._attemptStrCaseInsensitive(chars)) throw this._createError(_unexpectedCharacterErrorMsg(this._cursor.peek()), this._cursor.getSpan(location));
  }
  _attemptCharCodeUntilFn(predicate) {
    while (!predicate(this._cursor.peek())) this._cursor.advance();
  }
  _requireCharCodeUntilFn(predicate, len) {
    const start = this._cursor.clone();
    this._attemptCharCodeUntilFn(predicate);
    if (this._cursor.diff(start) < len) throw this._createError(_unexpectedCharacterErrorMsg(this._cursor.peek()), this._cursor.getSpan(start));
  }
  _attemptUntilChar(char) {
    while (this._cursor.peek() !== char) this._cursor.advance();
  }
  _attemptUntilIgnoreQuotes(predicate) {
    while (this._cursor.peek() !== 0) {
      const char = this._cursor.peek();
      if (predicate(char)) break;
      if (isQuote(char)) {
        this._cursor.advance();
        this._attemptCharCodeUntilFn((inner) => {
          if (inner === 92) {
            this._cursor.advance();
            return false;
          }
          return inner === char;
        });
      }
      this._cursor.advance();
    }
  }
  _readChar() {
    const char = String.fromCodePoint(this._cursor.peek());
    this._cursor.advance();
    return char;
  }
  _peekStr(chars) {
    const len = chars.length;
    if (this._cursor.charsLeft() < len) return false;
    const cursor = this._cursor.clone();
    for (let i = 0; i < len; i++) {
      if (cursor.peek() !== chars.charCodeAt(i)) return false;
      cursor.advance();
    }
    return true;
  }
  _isBlockStart() {
    return this._cursor.peek() === 64 && SUPPORTED_BLOCKS.some((blockName) => this._peekStr(blockName));
  }
  _isLetStart() {
    return this._cursor.peek() === 64 && this._peekStr("@let");
  }
  _consumeEntity(textTokenType) {
    this._beginToken(9);
    const start = this._cursor.clone();
    this._cursor.advance();
    if (this._attemptCharCode(35)) {
      const isHex = this._attemptCharCode(120) || this._attemptCharCode(88);
      const codeStart = this._cursor.clone();
      this._attemptCharCodeUntilFn(isDigitEntityEnd);
      if (this._cursor.peek() != 59) {
        this._cursor.advance();
        const entityType = isHex ? "hexadecimal" : "decimal";
        throw this._createError(_unparsableEntityErrorMsg(entityType, this._cursor.getChars(start)), this._cursor.getSpan());
      }
      const strNum = this._cursor.getChars(codeStart);
      this._cursor.advance();
      try {
        const charCode = parseInt(strNum, isHex ? 16 : 10);
        this._endToken([String.fromCodePoint(charCode), this._cursor.getChars(start)]);
      } catch {
        throw this._createError(_unknownEntityErrorMsg(this._cursor.getChars(start)), this._cursor.getSpan());
      }
    } else {
      const nameStart = this._cursor.clone();
      this._attemptCharCodeUntilFn(isNamedEntityEnd);
      if (this._cursor.peek() != 59) {
        this._beginToken(textTokenType, start);
        this._cursor = nameStart;
        this._endToken(["&"]);
      } else {
        const name = this._cursor.getChars(nameStart);
        this._cursor.advance();
        const char = function_object_has_own_default(NAMED_ENTITIES, name) && NAMED_ENTITIES[name];
        if (!char) throw this._createError(_unknownEntityErrorMsg(name), this._cursor.getSpan(start));
        this._endToken([char, `&${name};`]);
      }
    }
  }
  _consumeRawText(consumeEntities, endMarkerPredicate) {
    this._beginToken(consumeEntities ? 6 : 7);
    const parts = [];
    while (true) {
      const tagCloseStart = this._cursor.clone();
      const foundEndMarker = endMarkerPredicate();
      this._cursor = tagCloseStart;
      if (foundEndMarker) break;
      if (consumeEntities && this._cursor.peek() === 38) {
        this._endToken([this._processCarriageReturns(parts.join(""))]);
        parts.length = 0;
        this._consumeEntity(6);
        this._beginToken(6);
      } else parts.push(this._readChar());
    }
    this._endToken([this._processCarriageReturns(parts.join(""))]);
  }
  _consumeComment(start) {
    this._beginToken(10, start);
    this._endToken([]);
    this._consumeRawText(false, () => this._attemptStr("-->"));
    this._beginToken(11);
    this._requireStr("-->");
    this._endToken([]);
  }
  _consumeBogusComment(start) {
    this._beginToken(10, start);
    this._endToken([]);
    this._consumeRawText(false, () => this._cursor.peek() === 62);
    this._beginToken(11);
    this._cursor.advance();
    this._endToken([]);
  }
  _consumeCdata(start) {
    this._beginToken(13, start);
    this._endToken([]);
    this._consumeRawText(false, () => this._attemptStr("]]>"));
    this._beginToken(14);
    this._requireStr("]]>");
    this._endToken([]);
  }
  _consumeDocType(start) {
    this._beginToken(19, start);
    this._endToken([]);
    this._consumeRawText(false, () => this._cursor.peek() === 62);
    this._beginToken(20);
    this._cursor.advance();
    this._endToken([]);
  }
  _consumeProcessingInstruction(start) {
    this._beginToken(43, start);
    const contentStart = this._cursor.clone();
    this._attemptUntilIgnoreQuotes((char) => char === 63 || char === 62);
    const endChar = this._cursor.peek();
    const content = this._cursor.getChars(contentStart);
    this._cursor.advance();
    if (endChar === 63) this._requireCharCode(62);
    this._endToken([content]);
  }
  _consumePrefixAndName(endPredicate) {
    const nameOrPrefixStart = this._cursor.clone();
    let prefix = "";
    while (this._cursor.peek() !== 58 && !isPrefixEnd(this._cursor.peek())) this._cursor.advance();
    let nameStart;
    if (this._cursor.peek() === 58) {
      prefix = this._cursor.getChars(nameOrPrefixStart);
      this._cursor.advance();
      nameStart = this._cursor.clone();
    } else nameStart = nameOrPrefixStart;
    this._requireCharCodeUntilFn(endPredicate, prefix === "" ? 0 : 1);
    const name = this._cursor.getChars(nameStart);
    return [prefix, name];
  }
  _consumeSingleLineComment(start) {
    const contentStart = this._cursor.clone();
    this._attemptCharCodeUntilFn((code) => isNewLine(code) || code === 0);
    const spanEnd = this._cursor.clone();
    const content = spanEnd.getChars(contentStart);
    this._beginToken(12, start);
    this._endToken([content, "single"], spanEnd);
    this._attemptCharCodeUntilFn(isNotWhitespace);
  }
  _consumeMultiLineComment(start) {
    const contentStart = this._cursor.clone();
    this._attemptCharCodeUntilFn((code) => {
      if (code === 0) return true;
      if (code === 42) {
        const next = this._cursor.clone();
        next.advance();
        return next.peek() === 47;
      }
      return false;
    });
    const contentEnd = this._cursor.clone();
    const content = contentEnd.getChars(contentStart);
    let spanEnd = contentEnd;
    if (this._attemptStr("*/")) {
      spanEnd = this._cursor.clone();
      this._attemptCharCodeUntilFn(isNotWhitespace);
    }
    this._beginToken(12, start);
    this._endToken([content, "multi"], spanEnd);
  }
  _consumeTagOpen(start) {
    let tagName;
    let prefix;
    let closingTagName;
    let openToken;
    const attrs = [];
    try {
      if (this._selectorlessEnabled && isSelectorlessNameStart(this._cursor.peek())) {
        openToken = this._consumeComponentOpenStart(start);
        [closingTagName, prefix, tagName] = openToken.parts;
        if (prefix) closingTagName += `:${prefix}`;
        if (tagName) closingTagName += `:${tagName}`;
        this._attemptCharCodeUntilFn(isNotWhitespace);
      } else {
        if (!isAsciiLetter(this._cursor.peek())) throw this._createError(_unexpectedCharacterErrorMsg(this._cursor.peek()), this._cursor.getSpan(start));
        openToken = this._consumeTagOpenStart(start);
        prefix = openToken.parts[0];
        tagName = closingTagName = openToken.parts[1];
        this._attemptCharCodeUntilFn(isNotWhitespace);
      }
      while (true) {
        if (this._allowStartTagComments) {
          const commentStart = this._cursor.clone();
          if (this._attemptStr("//")) {
            this._consumeSingleLineComment(commentStart);
            continue;
          }
          if (this._attemptStr("/*")) {
            this._consumeMultiLineComment(commentStart);
            continue;
          }
        }
        if (isAttributeTerminator(this._cursor.peek())) break;
        if (this._selectorlessEnabled && this._cursor.peek() === 64) {
          const start2 = this._cursor.clone();
          const nameStart = start2.clone();
          nameStart.advance();
          if (isSelectorlessNameStart(nameStart.peek())) this._consumeDirective(start2, nameStart);
        } else {
          const attr = this._consumeAttribute();
          attrs.push(attr);
        }
      }
      if (openToken.type === 35) this._consumeComponentOpenEnd();
      else this._consumeTagOpenEnd();
    } catch (e) {
      if (e instanceof ParseError) {
        if (openToken) openToken.type = openToken.type === 35 ? 39 : 4;
        else {
          this._beginToken(5, start);
          this._endToken(["<"]);
        }
        return;
      }
      throw e;
    }
    if (this._canSelfClose && this.tokens[this.tokens.length - 1].type === 2) return;
    const contentTokenType = this._getTagContentType(tagName, prefix, this._fullNameStack.length > 0, attrs);
    this._handleFullNameStackForTagOpen(prefix, tagName);
    if (contentTokenType === 0) this._consumeRawTextWithTagClose(prefix, openToken, closingTagName, false);
    else if (contentTokenType === 1) this._consumeRawTextWithTagClose(prefix, openToken, closingTagName, true);
  }
  _consumeRawTextWithTagClose(prefix, openToken, tagName, consumeEntities) {
    this._consumeRawText(consumeEntities, () => {
      if (!this._attemptCharCode(60)) return false;
      if (!this._attemptCharCode(47)) return false;
      this._attemptCharCodeUntilFn(isNotWhitespace);
      if (!this._attemptStrCaseInsensitive(prefix && openToken.type !== 35 ? `${prefix}:${tagName}` : tagName)) return false;
      this._attemptCharCodeUntilFn(isNotWhitespace);
      return this._attemptCharCode(62);
    });
    this._beginToken(openToken.type === 35 ? 38 : 3);
    this._requireCharCodeUntilFn((code) => code === 62, 3);
    this._cursor.advance();
    this._endToken(openToken.parts);
    this._handleFullNameStackForTagClose(prefix, tagName);
  }
  _consumeTagOpenStart(start) {
    this._beginToken(0, start);
    const parts = this._consumePrefixAndName(isNameEnd);
    return this._endToken(parts);
  }
  _consumeComponentOpenStart(start) {
    this._beginToken(35, start);
    const parts = this._consumeComponentName();
    return this._endToken(parts);
  }
  _consumeComponentName() {
    const nameStart = this._cursor.clone();
    while (isSelectorlessNameChar(this._cursor.peek())) this._cursor.advance();
    const name = this._cursor.getChars(nameStart);
    let prefix = "";
    let tagName = "";
    if (this._cursor.peek() === 58) {
      this._cursor.advance();
      [prefix, tagName] = this._consumePrefixAndName(isNameEnd);
    }
    return [name, prefix, tagName];
  }
  _consumeAttribute() {
    const [prefix, name] = this._consumeAttributeName();
    let value;
    this._attemptCharCodeUntilFn(isNotWhitespace);
    if (this._attemptCharCode(61)) {
      this._attemptCharCodeUntilFn(isNotWhitespace);
      value = this._consumeAttributeValue();
    }
    this._attemptCharCodeUntilFn(isNotWhitespace);
    return {
      prefix,
      name,
      value
    };
  }
  _consumeAttributeName() {
    const attrNameStart = this._cursor.peek();
    if (attrNameStart === 39 || attrNameStart === 34) throw this._createError(_unexpectedCharacterErrorMsg(attrNameStart), this._cursor.getSpan());
    this._beginToken(15);
    let nameEndPredicate;
    if (this._openDirectiveCount > 0) {
      let openParens = 0;
      nameEndPredicate = (code) => {
        if (this._openDirectiveCount > 0) {
          if (code === 40) openParens++;
          else if (code === 41) {
            if (openParens === 0) return true;
            openParens--;
          }
        }
        return isNameEnd(code);
      };
    } else if (attrNameStart === 91) {
      let openBrackets = 0;
      nameEndPredicate = (code) => {
        if (code === 91) openBrackets++;
        else if (code === 93) openBrackets--;
        return openBrackets <= 0 ? isNameEnd(code) : isNewLine(code);
      };
    } else nameEndPredicate = isNameEnd;
    const prefixAndName = this._consumePrefixAndName(nameEndPredicate);
    this._endToken(prefixAndName);
    return prefixAndName;
  }
  _consumeAttributeValue() {
    let value;
    if (this._cursor.peek() === 39 || this._cursor.peek() === 34) {
      const quoteChar = this._cursor.peek();
      this._consumeQuote(quoteChar);
      const endPredicate = () => this._cursor.peek() === quoteChar;
      value = this._consumeWithInterpolation(17, 18, endPredicate, endPredicate);
      this._consumeQuote(quoteChar);
    } else {
      const endPredicate = () => isNameEnd(this._cursor.peek());
      value = this._consumeWithInterpolation(17, 18, endPredicate, endPredicate);
    }
    return value;
  }
  _consumeQuote(quoteChar) {
    this._beginToken(16);
    this._requireCharCode(quoteChar);
    this._endToken([String.fromCodePoint(quoteChar)]);
  }
  _consumeTagOpenEnd() {
    const tokenType = this._attemptCharCode(47) ? 2 : 1;
    this._beginToken(tokenType);
    this._requireCharCode(62);
    this._endToken([]);
  }
  _consumeComponentOpenEnd() {
    const tokenType = this._attemptCharCode(47) ? 37 : 36;
    this._beginToken(tokenType);
    this._requireCharCode(62);
    this._endToken([]);
  }
  _consumeTagClose(start) {
    if (this._selectorlessEnabled) {
      const clone = start.clone();
      while (clone.peek() !== 62 && !isSelectorlessNameStart(clone.peek())) clone.advance();
      if (isSelectorlessNameStart(clone.peek())) {
        this._beginToken(38, start);
        const parts = this._consumeComponentName();
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._requireCharCode(62);
        this._endToken(parts);
        return;
      }
    }
    this._beginToken(3, start);
    this._attemptCharCodeUntilFn(isNotWhitespace);
    if (this._allowHtmComponentClosingTags && this._attemptCharCode(47)) {
      this._attemptCharCodeUntilFn(isNotWhitespace);
      this._requireCharCode(62);
      this._endToken([]);
    } else {
      const [prefix, name] = this._consumePrefixAndName(isNameEnd);
      this._attemptCharCodeUntilFn(isNotWhitespace);
      this._requireCharCode(62);
      this._endToken([prefix, name]);
      this._handleFullNameStackForTagClose(prefix, name);
    }
  }
  _consumeExpansionFormStart() {
    this._beginToken(21);
    this._requireCharCode(123);
    this._endToken([]);
    this._expansionCaseStack.push(21);
    this._beginToken(7);
    const condition = this._readUntil(44);
    const normalizedCondition = this._processCarriageReturns(condition);
    if (this._i18nNormalizeLineEndingsInICUs) this._endToken([normalizedCondition]);
    else {
      const conditionToken = this._endToken([condition]);
      if (normalizedCondition !== condition) this.nonNormalizedIcuExpressions.push(conditionToken);
    }
    this._requireCharCode(44);
    this._attemptCharCodeUntilFn(isNotWhitespace);
    this._beginToken(7);
    const type = this._readUntil(44);
    this._endToken([type]);
    this._requireCharCode(44);
    this._attemptCharCodeUntilFn(isNotWhitespace);
  }
  _consumeExpansionCaseStart() {
    this._beginToken(22);
    const value = this._readUntil(123).trim();
    this._endToken([value]);
    this._attemptCharCodeUntilFn(isNotWhitespace);
    this._beginToken(23);
    this._requireCharCode(123);
    this._endToken([]);
    this._attemptCharCodeUntilFn(isNotWhitespace);
    this._expansionCaseStack.push(23);
  }
  _consumeExpansionCaseEnd() {
    this._beginToken(24);
    this._requireCharCode(125);
    this._endToken([]);
    this._attemptCharCodeUntilFn(isNotWhitespace);
    this._expansionCaseStack.pop();
  }
  _consumeExpansionFormEnd() {
    this._beginToken(25);
    this._requireCharCode(125);
    this._endToken([]);
    this._expansionCaseStack.pop();
  }
  /**
  * Consume a string that may contain interpolation expressions.
  *
  * The first token consumed will be of `tokenType` and then there will be alternating
  * `interpolationTokenType` and `tokenType` tokens until the `endPredicate()` returns true.
  *
  * If an interpolation token ends prematurely it will have no end marker in its `parts` array.
  *
  * @param textTokenType the kind of tokens to interleave around interpolation tokens.
  * @param interpolationTokenType the kind of tokens that contain interpolation.
  * @param endPredicate a function that should return true when we should stop consuming.
  * @param endInterpolation a function that should return true if there is a premature end to an
  *     interpolation expression - i.e. before we get to the normal interpolation closing marker.
  */
  _consumeWithInterpolation(textTokenType, interpolationTokenType, endPredicate, endInterpolation) {
    this._beginToken(textTokenType);
    const parts = [];
    while (!endPredicate()) {
      const current = this._cursor.clone();
      if (this._attemptStr(INTERPOLATION.start)) {
        this._endToken([this._processCarriageReturns(parts.join(""))], current);
        parts.length = 0;
        this._consumeInterpolation(interpolationTokenType, current, endInterpolation);
        this._beginToken(textTokenType);
      } else if (this._cursor.peek() === 38) {
        this._endToken([this._processCarriageReturns(parts.join(""))]);
        parts.length = 0;
        this._consumeEntity(textTokenType);
        this._beginToken(textTokenType);
      } else parts.push(this._readChar());
    }
    this._inInterpolation = false;
    const value = this._processCarriageReturns(parts.join(""));
    this._endToken([value]);
    return value;
  }
  /**
  * Consume a block of text that has been interpreted as an Angular interpolation.
  *
  * @param interpolationTokenType the type of the interpolation token to generate.
  * @param interpolationStart a cursor that points to the start of this interpolation.
  * @param prematureEndPredicate a function that should return true if the next characters indicate
  *     an end to the interpolation before its normal closing marker.
  */
  _consumeInterpolation(interpolationTokenType, interpolationStart, prematureEndPredicate) {
    const parts = [];
    this._beginToken(interpolationTokenType, interpolationStart);
    parts.push(INTERPOLATION.start);
    const expressionStart = this._cursor.clone();
    let inQuote = null;
    let inComment = false;
    while (this._cursor.peek() !== 0 && (prematureEndPredicate === null || !prematureEndPredicate())) {
      const current = this._cursor.clone();
      if (this._isTagStart()) {
        this._cursor = current;
        parts.push(this._getProcessedChars(expressionStart, current));
        this._endToken(parts);
        return;
      }
      if (inQuote === null) {
        if (this._attemptStr(INTERPOLATION.end)) {
          parts.push(this._getProcessedChars(expressionStart, current));
          parts.push(INTERPOLATION.end);
          this._endToken(parts);
          return;
        } else if (this._attemptStr("//")) inComment = true;
      }
      const char = this._cursor.peek();
      this._cursor.advance();
      if (char === 92) this._cursor.advance();
      else if (char === inQuote) inQuote = null;
      else if (!inComment && inQuote === null && isQuote(char)) inQuote = char;
    }
    parts.push(this._getProcessedChars(expressionStart, this._cursor));
    this._endToken(parts);
  }
  _consumeDirective(start, nameStart) {
    this._requireCharCode(64);
    this._cursor.advance();
    while (isSelectorlessNameChar(this._cursor.peek())) this._cursor.advance();
    this._beginToken(40, start);
    const name = this._cursor.getChars(nameStart);
    this._endToken([name]);
    this._attemptCharCodeUntilFn(isNotWhitespace);
    if (this._cursor.peek() !== 40) return;
    this._openDirectiveCount++;
    this._beginToken(41);
    this._cursor.advance();
    this._endToken([]);
    this._attemptCharCodeUntilFn(isNotWhitespace);
    while (!isAttributeTerminator(this._cursor.peek()) && this._cursor.peek() !== 41) this._consumeAttribute();
    this._attemptCharCodeUntilFn(isNotWhitespace);
    this._openDirectiveCount--;
    if (this._cursor.peek() !== 41) {
      if (this._cursor.peek() === 62 || this._cursor.peek() === 47) return;
      throw this._createError(_unexpectedCharacterErrorMsg(this._cursor.peek()), this._cursor.getSpan(start));
    }
    this._beginToken(42);
    this._cursor.advance();
    this._endToken([]);
    this._attemptCharCodeUntilFn(isNotWhitespace);
  }
  _getProcessedChars(start, end) {
    return this._processCarriageReturns(end.getChars(start));
  }
  _isTextEnd() {
    if (this._isTagStart() || this._cursor.peek() === 0) return true;
    if (this._tokenizeIcu && !this._inInterpolation) {
      if (this.isExpansionFormStart()) return true;
      if (this._cursor.peek() === 125 && this._isInExpansionCase()) return true;
    }
    if (this._tokenizeBlocks && !this._inInterpolation && !this._isInExpansion() && (this._isBlockStart() || this._isLetStart() || this._cursor.peek() === 125)) return true;
    return false;
  }
  /**
  * Returns true if the current cursor is pointing to the start of a tag
  * (opening/closing/comments/cdata/etc).
  */
  _isTagStart() {
    if (this._cursor.peek() === 60) {
      const tmp = this._cursor.clone();
      tmp.advance();
      const code = tmp.peek();
      if (97 <= code && code <= 122 || 65 <= code && code <= 90 || code === 47 || code === 33 || code === 63) return true;
    }
    return false;
  }
  _readUntil(char) {
    const start = this._cursor.clone();
    this._attemptUntilChar(char);
    return this._cursor.getChars(start);
  }
  _isInExpansion() {
    return this._isInExpansionCase() || this._isInExpansionForm();
  }
  _isInExpansionCase() {
    return this._expansionCaseStack.length > 0 && this._expansionCaseStack[this._expansionCaseStack.length - 1] === 23;
  }
  _isInExpansionForm() {
    return this._expansionCaseStack.length > 0 && this._expansionCaseStack[this._expansionCaseStack.length - 1] === 21;
  }
  isExpansionFormStart() {
    if (this._cursor.peek() !== 123) return false;
    const start = this._cursor.clone();
    const isInterpolation = this._attemptStr(INTERPOLATION.start);
    this._cursor = start;
    return !isInterpolation;
  }
  _handleFullNameStackForTagOpen(prefix, tagName) {
    const fullName = mergeNsAndName(prefix, tagName);
    if (this._fullNameStack.length === 0 || this._fullNameStack[this._fullNameStack.length - 1] === fullName) this._fullNameStack.push(fullName);
  }
  _handleFullNameStackForTagClose(prefix, tagName) {
    const fullName = mergeNsAndName(prefix, tagName);
    if (this._fullNameStack.length !== 0 && this._fullNameStack[this._fullNameStack.length - 1] === fullName) this._fullNameStack.pop();
  }
};
function isNotWhitespace(code) {
  return !isWhitespace(code) || code === 0;
}
function isNameEnd(code) {
  return isWhitespace(code) || code === 62 || code === 60 || code === 47 || code === 39 || code === 34 || code === 61 || code === 0;
}
function isPrefixEnd(code) {
  return (code < 97 || 122 < code) && (code < 65 || 90 < code) && (code < 48 || code > 57);
}
function isDigitEntityEnd(code) {
  return code === 59 || code === 0 || !isAsciiHexDigit(code);
}
function isNamedEntityEnd(code) {
  return code === 59 || code === 0 || !(isAsciiLetter(code) || isDigit(code));
}
function isExpansionCaseStart(peek) {
  return peek !== 125;
}
function compareCharCodeCaseInsensitive(code1, code2) {
  return toUpperCaseCharCode(code1) === toUpperCaseCharCode(code2);
}
function toUpperCaseCharCode(code) {
  return code >= 97 && code <= 122 ? code - 97 + 65 : code;
}
function isBlockNameChar(code) {
  return isAsciiLetter(code) || isDigit(code) || code === 95;
}
function isBlockParameterChar(code) {
  return code !== 59 && isNotWhitespace(code);
}
function isSelectorlessNameStart(code) {
  return code === 95 || code >= 65 && code <= 90;
}
function isSelectorlessNameChar(code) {
  return isAsciiLetter(code) || isDigit(code) || code === 95;
}
function isAttributeTerminator(code) {
  return code === 47 || code === 62 || code === 60 || code === 0;
}
function mergeTextTokens(srcTokens) {
  const dstTokens = [];
  let lastDstToken = void 0;
  for (let i = 0; i < srcTokens.length; i++) {
    const token = srcTokens[i];
    if (lastDstToken && lastDstToken.type === 5 && token.type === 5 || lastDstToken && lastDstToken.type === 17 && token.type === 17) {
      lastDstToken.parts[0] += token.parts[0];
      lastDstToken.sourceSpan.end = token.sourceSpan.end;
    } else {
      lastDstToken = token;
      dstTokens.push(lastDstToken);
    }
  }
  return dstTokens;
}
var PlainCharacterCursor = class PlainCharacterCursor2 {
  state;
  file;
  input;
  end;
  constructor(fileOrCursor, range) {
    if (fileOrCursor instanceof PlainCharacterCursor2) {
      this.file = fileOrCursor.file;
      this.input = fileOrCursor.input;
      this.end = fileOrCursor.end;
      const state = fileOrCursor.state;
      this.state = {
        peek: state.peek,
        offset: state.offset,
        line: state.line,
        column: state.column
      };
    } else {
      if (!range) throw new Error("Programming error: the range argument must be provided with a file argument.");
      this.file = fileOrCursor;
      this.input = fileOrCursor.content;
      this.end = range.endPos;
      this.state = {
        peek: -1,
        offset: range.startPos,
        line: range.startLine,
        column: range.startCol
      };
    }
  }
  clone() {
    return new PlainCharacterCursor2(this);
  }
  peek() {
    return this.state.peek;
  }
  charsLeft() {
    return this.end - this.state.offset;
  }
  diff(other) {
    return this.state.offset - other.state.offset;
  }
  advance() {
    this.advanceState(this.state);
  }
  init() {
    this.updatePeek(this.state);
  }
  getSpan(start, leadingTriviaCodePoints) {
    start = start || this;
    let fullStart = start;
    if (leadingTriviaCodePoints) while (this.diff(start) > 0 && leadingTriviaCodePoints.indexOf(start.peek()) !== -1) {
      if (fullStart === start) start = start.clone();
      start.advance();
    }
    const startLocation = this.locationFromCursor(start);
    const endLocation = this.locationFromCursor(this);
    const fullStartLocation = fullStart !== start ? this.locationFromCursor(fullStart) : startLocation;
    return new ParseSourceSpan(startLocation, endLocation, fullStartLocation);
  }
  getChars(start) {
    return this.input.substring(start.state.offset, this.state.offset);
  }
  charAt(pos) {
    return this.input.charCodeAt(pos);
  }
  advanceState(state) {
    if (state.offset >= this.end) {
      this.state = state;
      throw new CursorError('Unexpected character "EOF"', this);
    }
    const currentChar = this.charAt(state.offset);
    if (currentChar === 10) {
      state.line++;
      state.column = 0;
    } else if (!isNewLine(currentChar)) state.column++;
    state.offset++;
    this.updatePeek(state);
  }
  updatePeek(state) {
    state.peek = state.offset >= this.end ? 0 : this.charAt(state.offset);
  }
  locationFromCursor(cursor) {
    return new ParseLocation(cursor.file, cursor.state.offset, cursor.state.line, cursor.state.column);
  }
};
var EscapedCharacterCursor = class EscapedCharacterCursor2 extends PlainCharacterCursor {
  internalState;
  constructor(fileOrCursor, range) {
    if (fileOrCursor instanceof EscapedCharacterCursor2) {
      super(fileOrCursor);
      this.internalState = {
        ...fileOrCursor.internalState
      };
    } else {
      super(fileOrCursor, range);
      this.internalState = this.state;
    }
  }
  advance() {
    this.state = this.internalState;
    super.advance();
    this.processEscapeSequence();
  }
  init() {
    super.init();
    this.processEscapeSequence();
  }
  clone() {
    return new EscapedCharacterCursor2(this);
  }
  getChars(start) {
    const cursor = start.clone();
    let chars = "";
    while (cursor.internalState.offset < this.internalState.offset) {
      chars += String.fromCodePoint(cursor.peek());
      cursor.advance();
    }
    return chars;
  }
  /**
  * Process the escape sequence that starts at the current position in the text.
  *
  * This method is called to ensure that `peek` has the unescaped value of escape sequences.
  */
  processEscapeSequence() {
    const peek = () => this.internalState.peek;
    if (peek() === 92) {
      this.internalState = {
        ...this.state
      };
      this.advanceState(this.internalState);
      if (peek() === 110) this.state.peek = 10;
      else if (peek() === 114) this.state.peek = 13;
      else if (peek() === 118) this.state.peek = 11;
      else if (peek() === 116) this.state.peek = 9;
      else if (peek() === 98) this.state.peek = 8;
      else if (peek() === 102) this.state.peek = 12;
      else if (peek() === 117) {
        this.advanceState(this.internalState);
        if (peek() === 123) {
          this.advanceState(this.internalState);
          const digitStart = this.clone();
          let length = 0;
          while (peek() !== 125) {
            this.advanceState(this.internalState);
            length++;
          }
          this.state.peek = this.decodeHexDigits(digitStart, length);
        } else {
          const digitStart = this.clone();
          this.advanceState(this.internalState);
          this.advanceState(this.internalState);
          this.advanceState(this.internalState);
          this.state.peek = this.decodeHexDigits(digitStart, 4);
        }
      } else if (peek() === 120) {
        this.advanceState(this.internalState);
        const digitStart = this.clone();
        this.advanceState(this.internalState);
        this.state.peek = this.decodeHexDigits(digitStart, 2);
      } else if (isOctalDigit(peek())) {
        let octal = "";
        let length = 0;
        let previous = this.clone();
        while (isOctalDigit(peek()) && length < 3) {
          previous = this.clone();
          octal += String.fromCodePoint(peek());
          this.advanceState(this.internalState);
          length++;
        }
        this.state.peek = parseInt(octal, 8);
        this.internalState = previous.internalState;
      } else if (isNewLine(this.internalState.peek)) {
        this.advanceState(this.internalState);
        this.state = this.internalState;
      } else this.state.peek = this.internalState.peek;
    }
  }
  decodeHexDigits(start, length) {
    const hex = this.input.slice(start.internalState.offset, start.internalState.offset + length);
    const charCode = parseInt(hex, 16);
    if (!isNaN(charCode)) return charCode;
    else {
      start.state = start.internalState;
      throw new CursorError("Invalid hexadecimal escape sequence", start);
    }
  }
};
var CursorError = class extends Error {
  msg;
  cursor;
  constructor(msg, cursor) {
    super(msg);
    this.msg = msg;
    this.cursor = cursor;
    Object.setPrototypeOf(this, new.target.prototype);
  }
};

// node_modules/angular-html-parser/dist/compiler/src/ml_parser/parser.mjs
var TreeError = class TreeError2 extends ParseError {
  elementName;
  static create(elementName, span, msg) {
    return new TreeError2(elementName, span, msg);
  }
  constructor(elementName, span, msg) {
    super(span, msg);
    this.elementName = elementName;
  }
};
var ParseTreeResult = class {
  rootNodes;
  errors;
  constructor(rootNodes, errors) {
    this.rootNodes = rootNodes;
    this.errors = errors;
  }
};
var Parser = class {
  getTagDefinition;
  constructor(getTagDefinition) {
    this.getTagDefinition = getTagDefinition;
  }
  parse(source, url, options2, isTagNameCaseSensitive = false, getTagContentType) {
    const lowercasify = (fn) => (x, ...args) => fn(x.toLowerCase(), ...args);
    const getTagDefinition = isTagNameCaseSensitive ? this.getTagDefinition : lowercasify(this.getTagDefinition);
    const getDefaultTagContentType = (tagName) => getTagDefinition(tagName).getContentType();
    const getTagContentTypeWithProcessedTagName = isTagNameCaseSensitive ? getTagContentType : lowercasify(getTagContentType);
    const tokenizeResult = tokenize(source, url, getTagContentType ? (tagName, prefix, hasParent2, attrs) => {
      const contentType = getTagContentTypeWithProcessedTagName(tagName, prefix, hasParent2, attrs);
      return contentType !== void 0 ? contentType : getDefaultTagContentType(tagName);
    } : getDefaultTagContentType, options2);
    const canSelfClose = options2 && options2.canSelfClose || false;
    const allowHtmComponentClosingTags = options2 && options2.allowHtmComponentClosingTags || false;
    const parser = new _TreeBuilder(tokenizeResult.tokens, getTagDefinition, canSelfClose, allowHtmComponentClosingTags, isTagNameCaseSensitive);
    parser.build();
    return new ParseTreeResult(parser.rootNodes, [...tokenizeResult.errors, ...parser.errors]);
  }
};
var _TreeBuilder = class _TreeBuilder2 {
  tokens;
  tagDefinitionResolver;
  canSelfClose;
  allowHtmComponentClosingTags;
  isTagNameCaseSensitive;
  _index = -1;
  _peek;
  _containerStack = [];
  rootNodes = [];
  errors = [];
  constructor(tokens, tagDefinitionResolver, canSelfClose, allowHtmComponentClosingTags, isTagNameCaseSensitive) {
    this.tokens = tokens;
    this.tagDefinitionResolver = tagDefinitionResolver;
    this.canSelfClose = canSelfClose;
    this.allowHtmComponentClosingTags = allowHtmComponentClosingTags;
    this.isTagNameCaseSensitive = isTagNameCaseSensitive;
    this._advance();
  }
  build() {
    while (this._peek.type !== 44) if (this._peek.type === 0 || this._peek.type === 4) this._consumeElementStartTag(this._advance());
    else if (this._peek.type === 3) {
      this._closeVoidElement();
      this._consumeElementEndTag(this._advance());
    } else if (this._peek.type === 13) {
      this._closeVoidElement();
      this._consumeCdata(this._advance());
    } else if (this._peek.type === 10) {
      this._closeVoidElement();
      this._consumeComment(this._advance());
    } else if (this._peek.type === 5 || this._peek.type === 7 || this._peek.type === 6) {
      this._closeVoidElement();
      this._consumeText(this._advance());
    } else if (this._peek.type === 21) this._consumeExpansion(this._advance());
    else if (this._peek.type === 26) {
      this._closeVoidElement();
      this._consumeBlockOpen(this._advance());
    } else if (this._peek.type === 28) {
      this._closeVoidElement();
      this._consumeBlockClose(this._advance());
    } else if (this._peek.type === 30) {
      this._closeVoidElement();
      this._consumeIncompleteBlock(this._advance());
    } else if (this._peek.type === 31) {
      this._closeVoidElement();
      this._consumeLet(this._advance());
    } else if (this._peek.type === 19) this._consumeDocType(this._advance());
    else if (this._peek.type === 34) {
      this._closeVoidElement();
      this._consumeIncompleteLet(this._advance());
    } else if (this._peek.type === 35 || this._peek.type === 39) this._consumeComponentStartTag(this._advance());
    else if (this._peek.type === 38) this._consumeComponentEndTag(this._advance());
    else this._advance();
    for (const leftoverContainer of this._containerStack) if (leftoverContainer instanceof Block) this.errors.push(TreeError.create(leftoverContainer.name, leftoverContainer.sourceSpan, `Unclosed block "${leftoverContainer.name}"`));
  }
  _advance() {
    const prev = this._peek;
    if (this._index < this.tokens.length - 1) this._index++;
    this._peek = this.tokens[this._index];
    return prev;
  }
  _advanceIf(type) {
    if (this._peek.type === type) return this._advance();
    return null;
  }
  _consumeCdata(startToken) {
    const text = this._advance();
    const value = this._getText(text);
    const endToken = this._advanceIf(14);
    this._addToParent(new CDATA(value, new ParseSourceSpan(startToken.sourceSpan.start, (endToken || text).sourceSpan.end), [text]));
  }
  _consumeComment(token) {
    const text = this._advanceIf(7);
    const endToken = this._advanceIf(11);
    const value = text != null ? text.parts[0].trim() : null;
    const sourceSpan = endToken == null ? token.sourceSpan : new ParseSourceSpan(token.sourceSpan.start, endToken.sourceSpan.end, token.sourceSpan.fullStart);
    this._addToParent(new Comment(value, sourceSpan));
  }
  _consumeDocType(startToken) {
    const text = this._advanceIf(7);
    const endToken = this._advanceIf(20);
    const value = text != null ? text.parts[0].trim() : null;
    const sourceSpan = new ParseSourceSpan(startToken.sourceSpan.start, (endToken || text || startToken).sourceSpan.end);
    this._addToParent(new DocType(value, sourceSpan));
  }
  _consumeExpansion(token) {
    const switchValue = this._advance();
    const type = this._advance();
    const cases = [];
    while (this._peek.type === 22) {
      const expCase = this._parseExpansionCase();
      if (!expCase) return;
      cases.push(expCase);
    }
    if (this._peek.type !== 25) {
      this.errors.push(TreeError.create(null, this._peek.sourceSpan, `Invalid ICU message. Missing '}'.`));
      return;
    }
    const sourceSpan = new ParseSourceSpan(token.sourceSpan.start, this._peek.sourceSpan.end, token.sourceSpan.fullStart);
    this._addToParent(new Expansion(switchValue.parts[0], type.parts[0], cases, sourceSpan, switchValue.sourceSpan));
    this._advance();
  }
  _parseExpansionCase() {
    const value = this._advance();
    if (this._peek.type !== 23) {
      this.errors.push(TreeError.create(null, this._peek.sourceSpan, `Invalid ICU message. Missing '{'.`));
      return null;
    }
    const start = this._advance();
    const exp = this._collectExpansionExpTokens(start);
    if (!exp) return null;
    const end = this._advance();
    exp.push({
      type: 44,
      parts: [],
      sourceSpan: end.sourceSpan
    });
    const expansionCaseParser = new _TreeBuilder2(exp, this.tagDefinitionResolver, this.canSelfClose, this.allowHtmComponentClosingTags, this.isTagNameCaseSensitive);
    expansionCaseParser.build();
    if (expansionCaseParser.errors.length > 0) {
      this.errors = this.errors.concat(expansionCaseParser.errors);
      return null;
    }
    const sourceSpan = new ParseSourceSpan(value.sourceSpan.start, end.sourceSpan.end, value.sourceSpan.fullStart);
    const expSourceSpan = new ParseSourceSpan(start.sourceSpan.start, end.sourceSpan.end, start.sourceSpan.fullStart);
    return new ExpansionCase(value.parts[0], expansionCaseParser.rootNodes, sourceSpan, value.sourceSpan, expSourceSpan);
  }
  _collectExpansionExpTokens(start) {
    const exp = [];
    const expansionFormStack = [23];
    while (true) {
      if (this._peek.type === 21 || this._peek.type === 23) expansionFormStack.push(this._peek.type);
      if (this._peek.type === 24) {
        if (lastOnStack(expansionFormStack, 23)) {
          expansionFormStack.pop();
          if (expansionFormStack.length === 0) return exp;
        } else {
          this.errors.push(TreeError.create(null, start.sourceSpan, `Invalid ICU message. Missing '}'.`));
          return null;
        }
      }
      if (this._peek.type === 25) {
        if (lastOnStack(expansionFormStack, 21)) expansionFormStack.pop();
        else {
          this.errors.push(TreeError.create(null, start.sourceSpan, `Invalid ICU message. Missing '}'.`));
          return null;
        }
      }
      if (this._peek.type === 44) {
        this.errors.push(TreeError.create(null, start.sourceSpan, `Invalid ICU message. Missing '}'.`));
        return null;
      }
      exp.push(this._advance());
    }
  }
  _getText(token) {
    let text = token.parts[0];
    if (text.length > 0 && text[0] == "\n") {
      var _this$_getTagDefiniti;
      const parent = this._getClosestElementLikeParent();
      if (parent != null && parent.children.length == 0 && ((_this$_getTagDefiniti = this._getTagDefinition(parent)) === null || _this$_getTagDefiniti === void 0 ? void 0 : _this$_getTagDefiniti.ignoreFirstLf)) text = text.substring(1);
    }
    return text;
  }
  _consumeText(token) {
    const tokens = [token];
    const startSpan = token.sourceSpan;
    let text = token.parts[0];
    if (text.length > 0 && text[0] === "\n") {
      var _this$_getTagDefiniti2;
      const parent = this._getContainer();
      if (parent != null && parent.children.length === 0 && ((_this$_getTagDefiniti2 = this._getTagDefinition(parent)) === null || _this$_getTagDefiniti2 === void 0 ? void 0 : _this$_getTagDefiniti2.ignoreFirstLf)) {
        text = text.substring(1);
        tokens[0] = {
          type: token.type,
          sourceSpan: token.sourceSpan,
          parts: [text]
        };
      }
    }
    while (this._peek.type === 8 || this._peek.type === 5 || this._peek.type === 9) {
      token = this._advance();
      tokens.push(token);
      if (token.type === 8) text += token.parts.join("").replace(/&([^;]+);/g, decodeEntity);
      else if (token.type === 9) text += token.parts[0];
      else text += token.parts.join("");
    }
    if (text.length > 0) {
      const endSpan = token.sourceSpan;
      this._addToParent(new Text(text, new ParseSourceSpan(startSpan.start, endSpan.end, startSpan.fullStart, startSpan.details), tokens));
    }
  }
  _closeVoidElement() {
    var _this$_getTagDefiniti3;
    const el = this._getContainer();
    if (el !== null && ((_this$_getTagDefiniti3 = this._getTagDefinition(el)) === null || _this$_getTagDefiniti3 === void 0 ? void 0 : _this$_getTagDefiniti3.isVoid)) this._containerStack.pop();
  }
  _consumeElementStartTag(startTagToken) {
    var _this$_getTagDefiniti4;
    const attrs = [];
    const directives = [];
    const comments = [];
    this._consumeAttributesAndDirectives(attrs, directives, comments);
    const fullName = this._getElementFullName(startTagToken, this._getClosestElementLikeParent());
    const tagDef = this._getTagDefinition(fullName);
    let selfClosing = false;
    if (this._peek.type === 2) {
      this._advance();
      selfClosing = true;
      const tagDef2 = this._getTagDefinition(fullName);
      if (!(this.canSelfClose || (tagDef2 === null || tagDef2 === void 0 ? void 0 : tagDef2.canSelfClose) || getNsPrefix(fullName) !== null || (tagDef2 === null || tagDef2 === void 0 ? void 0 : tagDef2.isVoid))) this.errors.push(TreeError.create(fullName, startTagToken.sourceSpan, `Only void, custom and foreign elements can be self closed "${startTagToken.parts[1]}"`));
    } else if (this._peek.type === 1) {
      this._advance();
      selfClosing = false;
    }
    const end = this._peek.sourceSpan.fullStart;
    const span = new ParseSourceSpan(startTagToken.sourceSpan.start, end, startTagToken.sourceSpan.fullStart);
    const startSpan = new ParseSourceSpan(startTagToken.sourceSpan.start, end, startTagToken.sourceSpan.fullStart);
    const nameSpan = new ParseSourceSpan(startTagToken.sourceSpan.start.moveBy(1), startTagToken.sourceSpan.end);
    const el = new Element(fullName, attrs, directives, [], selfClosing, span, startSpan, void 0, nameSpan, (tagDef === null || tagDef === void 0 ? void 0 : tagDef.isVoid) ?? false, void 0, comments);
    const parent = this._getContainer();
    const isClosedByChild = parent !== null && !!((_this$_getTagDefiniti4 = this._getTagDefinition(parent)) === null || _this$_getTagDefiniti4 === void 0 ? void 0 : _this$_getTagDefiniti4.isClosedByChild(el.name));
    this._pushContainer(el, isClosedByChild);
    if (selfClosing) this._popContainer(fullName, Element, span);
    else if (startTagToken.type === 4) {
      this._popContainer(fullName, Element, null);
      this.errors.push(TreeError.create(fullName, span, `Opening tag "${fullName}" not terminated.`));
    }
  }
  _consumeComponentStartTag(startToken) {
    var _this$_getTagDefiniti5;
    const componentName = startToken.parts[0];
    const attrs = [];
    const directives = [];
    const comments = [];
    this._consumeAttributesAndDirectives(attrs, directives, comments);
    const closestElement = this._getClosestElementLikeParent();
    const tagName = this._getComponentTagName(startToken, closestElement);
    const fullName = this._getComponentFullName(startToken, closestElement);
    const selfClosing = this._peek.type === 37;
    this._advance();
    const end = this._peek.sourceSpan.fullStart;
    const span = new ParseSourceSpan(startToken.sourceSpan.start, end, startToken.sourceSpan.fullStart);
    const startSpan = new ParseSourceSpan(startToken.sourceSpan.start, end, startToken.sourceSpan.fullStart);
    const node = new Component(componentName, tagName, fullName, attrs, directives, [], selfClosing, span, startSpan, void 0, void 0, comments);
    const parent = this._getContainer();
    const isClosedByChild = parent !== null && node.tagName !== null && !!((_this$_getTagDefiniti5 = this._getTagDefinition(parent)) === null || _this$_getTagDefiniti5 === void 0 ? void 0 : _this$_getTagDefiniti5.isClosedByChild(node.tagName));
    this._pushContainer(node, isClosedByChild);
    if (selfClosing) this._popContainer(fullName, Component, span);
    else if (startToken.type === 39) {
      this._popContainer(fullName, Component, null);
      this.errors.push(TreeError.create(fullName, span, `Opening tag "${fullName}" not terminated.`));
    }
  }
  _consumeAttributesAndDirectives(attributesResult, directivesResult, commentsResult) {
    while (this._peek.type === 15 || this._peek.type === 40 || this._peek.type === 12) if (this._peek.type === 40) directivesResult.push(this._consumeDirective(this._peek));
    else if (this._peek.type === 15) attributesResult.push(this._consumeAttr(this._advance()));
    else {
      const commentToken = this._advance();
      commentsResult.push(new StartTagComment(commentToken.parts[0], commentToken.parts[1], commentToken.sourceSpan));
    }
  }
  _consumeComponentEndTag(endToken) {
    const fullName = this._getComponentFullName(endToken, this._getClosestElementLikeParent());
    if (!this._popContainer(fullName, Component, endToken.sourceSpan)) {
      const container = this._containerStack[this._containerStack.length - 1];
      let suffix;
      if (container instanceof Component && container.componentName === endToken.parts[0]) suffix = `, did you mean "${container.fullName}"?`;
      else suffix = ". It may happen when the tag has already been closed by another tag.";
      const errMsg = `Unexpected closing tag "${fullName}"${suffix}`;
      this.errors.push(TreeError.create(fullName, endToken.sourceSpan, errMsg));
    }
  }
  _getTagDefinition(nodeOrName) {
    if (typeof nodeOrName === "string") return this.tagDefinitionResolver(nodeOrName);
    else if (nodeOrName instanceof Element) return this.tagDefinitionResolver(nodeOrName.name);
    else if (nodeOrName instanceof Component && nodeOrName.tagName !== null) return this.tagDefinitionResolver(nodeOrName.tagName);
    else return null;
  }
  _pushContainer(node, isClosedByChild) {
    if (isClosedByChild) this._containerStack.pop();
    this._addToParent(node);
    this._containerStack.push(node);
  }
  _consumeElementEndTag(endTagToken) {
    var _this$_getTagDefiniti6;
    const fullName = this.allowHtmComponentClosingTags && endTagToken.parts.length === 0 ? null : this._getElementFullName(endTagToken, this._getClosestElementLikeParent());
    if (fullName && ((_this$_getTagDefiniti6 = this._getTagDefinition(fullName)) === null || _this$_getTagDefiniti6 === void 0 ? void 0 : _this$_getTagDefiniti6.isVoid)) this.errors.push(TreeError.create(fullName, endTagToken.sourceSpan, `Void elements do not have end tags "${endTagToken.parts[1]}"`));
    else if (!this._popContainer(fullName, Element, endTagToken.sourceSpan)) {
      const errMsg = `Unexpected closing tag "${fullName}". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags`;
      this.errors.push(TreeError.create(fullName, endTagToken.sourceSpan, errMsg));
    }
  }
  /**
  * Closes the nearest element with the tag name `fullName` in the parse tree.
  * `endSourceSpan` is the span of the closing tag, or null if the element does
  * not have a closing tag (for example, this happens when an incomplete
  * opening tag is recovered).
  */
  _popContainer(expectedName, expectedType, endSourceSpan) {
    let unexpectedCloseTagDetected = false;
    for (let stackIndex = this._containerStack.length - 1; stackIndex >= 0; stackIndex--) {
      var _this$_getTagDefiniti7;
      const node = this._containerStack[stackIndex];
      const nodeName = node instanceof Component ? node.fullName : node.name;
      if (getNsPrefix(nodeName) ? nodeName === expectedName : (nodeName === expectedName || expectedName === null) && node instanceof expectedType) {
        node.endSourceSpan = endSourceSpan;
        node.sourceSpan.end = endSourceSpan !== null ? endSourceSpan.end : node.sourceSpan.end;
        this._containerStack.splice(stackIndex, this._containerStack.length - stackIndex);
        return !unexpectedCloseTagDetected;
      }
      if (node instanceof Block || !((_this$_getTagDefiniti7 = this._getTagDefinition(node)) === null || _this$_getTagDefiniti7 === void 0 ? void 0 : _this$_getTagDefiniti7.closedByParent)) unexpectedCloseTagDetected = true;
    }
    return false;
  }
  _consumeAttr(attrName) {
    const fullName = mergeNsAndName(attrName.parts[0], attrName.parts[1]);
    let attrEnd = attrName.sourceSpan.end;
    let startQuoteToken;
    if (this._peek.type === 16) startQuoteToken = this._advance();
    let value = "";
    const valueTokens = [];
    let valueStartSpan = void 0;
    let valueEnd = void 0;
    if (this._peek.type === 17) {
      valueStartSpan = this._peek.sourceSpan;
      valueEnd = this._peek.sourceSpan.end;
      while (this._peek.type === 17 || this._peek.type === 18 || this._peek.type === 9) {
        const valueToken = this._advance();
        valueTokens.push(valueToken);
        if (valueToken.type === 18) value += valueToken.parts.join("").replace(/&([^;]+);/g, decodeEntity);
        else if (valueToken.type === 9) value += valueToken.parts[0];
        else value += valueToken.parts.join("");
        valueEnd = attrEnd = valueToken.sourceSpan.end;
      }
    }
    if (this._peek.type === 16) valueEnd = attrEnd = this._advance().sourceSpan.end;
    const valueSpan = valueStartSpan && valueEnd && new ParseSourceSpan((startQuoteToken === null || startQuoteToken === void 0 ? void 0 : startQuoteToken.sourceSpan.start) ?? valueStartSpan.start, valueEnd, (startQuoteToken === null || startQuoteToken === void 0 ? void 0 : startQuoteToken.sourceSpan.fullStart) ?? valueStartSpan.fullStart);
    return new Attribute(fullName, value, new ParseSourceSpan(attrName.sourceSpan.start, attrEnd, attrName.sourceSpan.fullStart), attrName.sourceSpan, valueSpan, valueTokens.length > 0 ? valueTokens : void 0, void 0);
  }
  _consumeDirective(nameToken) {
    const attributes = [];
    let startSourceSpanEnd = nameToken.sourceSpan.end;
    let endSourceSpan = null;
    this._advance();
    if (this._peek.type === 41) {
      startSourceSpanEnd = this._peek.sourceSpan.end;
      this._advance();
      while (this._peek.type === 15) attributes.push(this._consumeAttr(this._advance()));
      if (this._peek.type === 42) {
        endSourceSpan = this._peek.sourceSpan;
        this._advance();
      } else this.errors.push(TreeError.create(null, nameToken.sourceSpan, "Unterminated directive definition"));
    }
    const startSourceSpan = new ParseSourceSpan(nameToken.sourceSpan.start, startSourceSpanEnd, nameToken.sourceSpan.fullStart);
    const sourceSpan = new ParseSourceSpan(startSourceSpan.start, endSourceSpan === null ? nameToken.sourceSpan.end : endSourceSpan.end, startSourceSpan.fullStart);
    return new Directive(nameToken.parts[0], attributes, sourceSpan, startSourceSpan, endSourceSpan);
  }
  _consumeBlockOpen(token) {
    const parameters = [];
    while (this._peek.type === 29) {
      const paramToken = this._advance();
      parameters.push(new BlockParameter(paramToken.parts[0], paramToken.sourceSpan));
    }
    if (this._peek.type === 27) this._advance();
    const end = this._peek.sourceSpan.fullStart;
    const span = new ParseSourceSpan(token.sourceSpan.start, end, token.sourceSpan.fullStart);
    const startSpan = new ParseSourceSpan(token.sourceSpan.start, end, token.sourceSpan.fullStart);
    const block = new Block(token.parts[0], parameters, [], span, token.sourceSpan, startSpan);
    this._pushContainer(block, false);
  }
  _consumeBlockClose(token) {
    const initialStackLength = this._containerStack.length;
    const topNode = this._containerStack[initialStackLength - 1];
    if (!this._popContainer(null, Block, token.sourceSpan)) {
      if (this._containerStack.length < initialStackLength) {
        const nodeName = topNode instanceof Component ? topNode.fullName : topNode.name;
        this.errors.push(TreeError.create(null, token.sourceSpan, `Unexpected closing block. The block may have been closed earlier. Did you forget to close the <${nodeName}> element? If you meant to write the \`}\` character, you should use the "&#125;" HTML entity instead.`));
        return;
      }
      this.errors.push(TreeError.create(null, token.sourceSpan, 'Unexpected closing block. The block may have been closed earlier. If you meant to write the `}` character, you should use the "&#125;" HTML entity instead.'));
    }
  }
  _consumeIncompleteBlock(token) {
    const parameters = [];
    while (this._peek.type === 29) {
      const paramToken = this._advance();
      parameters.push(new BlockParameter(paramToken.parts[0], paramToken.sourceSpan));
    }
    const end = this._peek.sourceSpan.fullStart;
    const span = new ParseSourceSpan(token.sourceSpan.start, end, token.sourceSpan.fullStart);
    const startSpan = new ParseSourceSpan(token.sourceSpan.start, end, token.sourceSpan.fullStart);
    const block = new Block(token.parts[0], parameters, [], span, token.sourceSpan, startSpan);
    this._pushContainer(block, false);
    this._popContainer(null, Block, null);
    this.errors.push(TreeError.create(token.parts[0], span, `Incomplete block "${token.parts[0]}". If you meant to write the @ character, you should use the "&#64;" HTML entity instead.`));
  }
  _consumeLet(startToken) {
    const name = startToken.parts[0];
    let valueToken;
    let endToken;
    if (this._peek.type !== 32) {
      this.errors.push(TreeError.create(startToken.parts[0], startToken.sourceSpan, `Invalid @let declaration "${name}". Declaration must have a value.`));
      return;
    } else valueToken = this._advance();
    if (this._peek.type !== 33) {
      this.errors.push(TreeError.create(startToken.parts[0], startToken.sourceSpan, `Unterminated @let declaration "${name}". Declaration must be terminated with a semicolon.`));
      return;
    } else endToken = this._advance();
    const end = endToken.sourceSpan.end;
    const span = new ParseSourceSpan(startToken.sourceSpan.start, end, startToken.sourceSpan.fullStart);
    const startOffset = startToken.sourceSpan.toString().lastIndexOf(name);
    const nameStart = startToken.sourceSpan.start.moveBy(startOffset);
    const nameSpan = new ParseSourceSpan(nameStart, startToken.sourceSpan.end);
    const node = new LetDeclaration(name, valueToken.parts[0], span, nameSpan, valueToken.sourceSpan);
    this._addToParent(node);
  }
  _consumeIncompleteLet(token) {
    const name = token.parts[0] ?? "";
    const nameString = name ? ` "${name}"` : "";
    if (name.length > 0) {
      const startOffset = token.sourceSpan.toString().lastIndexOf(name);
      const nameStart = token.sourceSpan.start.moveBy(startOffset);
      const nameSpan = new ParseSourceSpan(nameStart, token.sourceSpan.end);
      const valueSpan = new ParseSourceSpan(token.sourceSpan.start, token.sourceSpan.start.moveBy(0));
      const node = new LetDeclaration(name, "", token.sourceSpan, nameSpan, valueSpan);
      this._addToParent(node);
    }
    this.errors.push(TreeError.create(token.parts[0], token.sourceSpan, `Incomplete @let declaration${nameString}. @let declarations must be written as \`@let <name> = <value>;\``));
  }
  _getContainer() {
    return this._containerStack.length > 0 ? this._containerStack[this._containerStack.length - 1] : null;
  }
  _getClosestElementLikeParent() {
    for (let i = this._containerStack.length - 1; i > -1; i--) {
      const current = this._containerStack[i];
      if (current instanceof Element || current instanceof Component) return current;
    }
    return null;
  }
  _addToParent(node) {
    const parent = this._getContainer();
    if (parent === null) this.rootNodes.push(node);
    else parent.children.push(node);
  }
  _getElementFullName(token, parent) {
    const prefix = this._getPrefix(token, parent);
    return mergeNsAndName(prefix, token.parts[1]);
  }
  _getComponentFullName(token, parent) {
    const componentName = token.parts[0];
    const tagName = this._getComponentTagName(token, parent);
    if (tagName === null) return componentName;
    return tagName.startsWith(":") ? componentName + tagName : `${componentName}:${tagName}`;
  }
  _getComponentTagName(token, parent) {
    const prefix = this._getPrefix(token, parent);
    const tagName = token.parts[2];
    if (!prefix && !tagName) return null;
    else if (!prefix && tagName) return tagName;
    else return mergeNsAndName(prefix, tagName || "ng-component");
  }
  _getPrefix(token, parent) {
    var _this$_getTagDefiniti8;
    let prefix;
    let tagName;
    if (token.type === 35 || token.type === 39 || token.type === 38) {
      prefix = token.parts[1];
      tagName = token.parts[2];
    } else {
      prefix = token.parts[0];
      tagName = token.parts[1];
    }
    prefix = prefix || ((_this$_getTagDefiniti8 = this._getTagDefinition(tagName)) === null || _this$_getTagDefiniti8 === void 0 ? void 0 : _this$_getTagDefiniti8.implicitNamespacePrefix) || "";
    if (!prefix && parent) {
      const parentName = parent instanceof Element ? parent.name : parent.tagName;
      if (parentName !== null) {
        const parentTagName = splitNsName(parentName)[1];
        const parentTagDefinition = this._getTagDefinition(parentTagName);
        if (parentTagDefinition !== null && !parentTagDefinition.preventNamespaceInheritance) prefix = getNsPrefix(parentName);
      }
    }
    return prefix;
  }
};
function lastOnStack(stack, element) {
  return stack.length > 0 && stack[stack.length - 1] === element;
}
function decodeEntity(match, entity) {
  if (NAMED_ENTITIES[entity] !== void 0) return NAMED_ENTITIES[entity] || match;
  if (/^#x[a-f0-9]+$/i.test(entity)) return String.fromCodePoint(parseInt(entity.slice(2), 16));
  if (/^#\d+$/.test(entity)) return String.fromCodePoint(parseInt(entity.slice(1), 10));
  return match;
}

// node_modules/angular-html-parser/dist/compiler/src/ml_parser/html_parser.mjs
var HtmlParser = class extends Parser {
  constructor() {
    super(getHtmlTagDefinition);
  }
  parse(source, url, options2, isTagNameCaseSensitive = false, getTagContentType) {
    return super.parse(source, url, options2, isTagNameCaseSensitive, getTagContentType);
  }
};

// node_modules/angular-html-parser/dist/index.mjs
var htmlParser;
function parseHtml(input, options2 = {}) {
  const { canSelfClose = false, allowHtmComponentClosingTags = false, allowStartTagComments = false, isTagNameCaseSensitive = false, getTagContentType, tokenizeAngularBlocks = false, tokenizeAngularLetDeclaration = false, enableAngularSelectorlessSyntax = false } = options2;
  htmlParser ?? (htmlParser = new HtmlParser());
  return htmlParser.parse(input, "angular-html-parser", {
    tokenizeExpansionForms: tokenizeAngularBlocks,
    canSelfClose,
    allowHtmComponentClosingTags,
    allowStartTagComments,
    tokenizeBlocks: tokenizeAngularBlocks,
    tokenizeLet: tokenizeAngularLetDeclaration,
    selectorlessEnabled: enableAngularSelectorlessSyntax
  }, isTagNameCaseSensitive, getTagContentType);
}

// src/language-html/print-preprocess.js
var PREPROCESS_PIPELINE = [
  removeIgnorableFirstLf,
  mergeIfConditionalStartEndCommentIntoElementOpeningTag,
  mergeCdataIntoText,
  extractInterpolation,
  extractWhitespaces,
  addCssDisplay,
  addIsSelfClosing,
  addHasHtmComponentClosingTag,
  addIsSpaceSensitive,
  mergeSimpleElementIntoText
];
function preprocess(ast, options2) {
  for (const fn of PREPROCESS_PIPELINE) {
    fn(ast, options2);
  }
  return ast;
}
function removeIgnorableFirstLf(ast) {
  ast.walk((node) => {
    if (node.kind === "element" && node.tagDefinition.ignoreFirstLf && node.children.length > 0 && node.children[0].kind === "text" && node.children[0].value[0] === "\n") {
      const text = node.children[0];
      if (text.value.length === 1) {
        node.removeChild(text);
      } else {
        text.value = text.value.slice(1);
      }
    }
  });
}
function mergeIfConditionalStartEndCommentIntoElementOpeningTag(ast) {
  const isTarget = (node) => node.kind === "element" && node.prev?.kind === "ieConditionalStartComment" && node.prev.sourceSpan.end.offset === node.startSourceSpan.start.offset && node.firstChild?.kind === "ieConditionalEndComment" && node.firstChild.sourceSpan.start.offset === node.startSourceSpan.end.offset;
  ast.walk((node) => {
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (!isTarget(child)) {
          continue;
        }
        const ieConditionalStartComment = child.prev;
        const ieConditionalEndComment = child.firstChild;
        node.removeChild(ieConditionalStartComment);
        i--;
        const startSourceSpan = new ParseSourceSpan(
          ieConditionalStartComment.sourceSpan.start,
          ieConditionalEndComment.sourceSpan.end
        );
        const sourceSpan = new ParseSourceSpan(
          startSourceSpan.start,
          child.sourceSpan.end
        );
        child.condition = ieConditionalStartComment.condition;
        child.sourceSpan = sourceSpan;
        child.startSourceSpan = startSourceSpan;
        child.removeChild(ieConditionalEndComment);
      }
    }
  });
}
function mergeNodeIntoText(ast, shouldMerge, getValue) {
  ast.walk((node) => {
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.kind !== "text" && !shouldMerge(child)) {
          continue;
        }
        if (child.kind !== "text") {
          child.kind = "text";
          child.value = getValue(child);
        }
        const prevChild = child.prev;
        if (!prevChild || prevChild.kind !== "text") {
          continue;
        }
        prevChild.value += child.value;
        prevChild.sourceSpan = new ParseSourceSpan(
          prevChild.sourceSpan.start,
          child.sourceSpan.end
        );
        node.removeChild(child);
        i--;
      }
    }
  });
}
function mergeCdataIntoText(ast) {
  return mergeNodeIntoText(
    ast,
    (node) => node.kind === "cdata",
    (node) => `<![CDATA[${node.value}]]>`
  );
}
function mergeSimpleElementIntoText(ast) {
  const isSimpleElement = (node) => node.kind === "element" && node.attrs.length === 0 && !is_non_empty_array_default(node.startTagComments) && node.children.length === 1 && node.firstChild.kind === "text" && !html_whitespace_default.hasWhitespaceCharacter(node.children[0].value) && !node.firstChild.hasLeadingSpaces && !node.firstChild.hasTrailingSpaces && node.isLeadingSpaceSensitive && !node.hasLeadingSpaces && node.isTrailingSpaceSensitive && !node.hasTrailingSpaces && node.prev?.kind === "text" && node.next?.kind === "text";
  ast.walk((node) => {
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (!isSimpleElement(child)) {
          continue;
        }
        const prevChild = child.prev;
        const nextChild = child.next;
        prevChild.value += `<${child.rawName}>` + child.firstChild.value + `</${child.rawName}>` + nextChild.value;
        prevChild.sourceSpan = new ParseSourceSpan(
          prevChild.sourceSpan.start,
          nextChild.sourceSpan.end
        );
        prevChild.isTrailingSpaceSensitive = nextChild.isTrailingSpaceSensitive;
        prevChild.hasTrailingSpaces = nextChild.hasTrailingSpaces;
        node.removeChild(child);
        i--;
        node.removeChild(nextChild);
      }
    }
  });
}
function extractInterpolation(ast, options2) {
  if (options2.parser === "html") {
    return;
  }
  const interpolationRegex2 = /\{\{(.+?)\}\}/s;
  ast.walk((node) => {
    if (!canHaveInterpolation(node, options2)) {
      return;
    }
    for (const child of node.children) {
      if (child.kind !== "text") {
        continue;
      }
      let startSourceSpan = child.sourceSpan.start;
      let endSourceSpan;
      const components = child.value.split(interpolationRegex2);
      for (let i = 0; i < components.length; i++, startSourceSpan = endSourceSpan) {
        const value = components[i];
        if (i % 2 === 0) {
          endSourceSpan = startSourceSpan.moveBy(value.length);
          if (value.length > 0) {
            node.insertChildBefore(child, {
              kind: "text",
              value,
              sourceSpan: new ParseSourceSpan(startSourceSpan, endSourceSpan)
            });
          }
          continue;
        }
        endSourceSpan = startSourceSpan.moveBy(value.length + 4);
        node.insertChildBefore(child, {
          kind: "interpolation",
          sourceSpan: new ParseSourceSpan(startSourceSpan, endSourceSpan),
          children: value.length === 0 ? [] : [
            {
              kind: "text",
              value,
              sourceSpan: new ParseSourceSpan(
                startSourceSpan.moveBy(2),
                endSourceSpan.moveBy(-2)
              )
            }
          ]
        });
      }
      node.removeChild(child);
    }
  });
}
function extractWhitespaces(ast, options2) {
  ast.walk((node) => {
    const children = node.$children;
    if (!children) {
      return;
    }
    if (children.length === 0 || children.length === 1 && children[0].kind === "text" && html_whitespace_default.trim(children[0].value).length === 0) {
      node.hasDanglingSpaces = children.length > 0;
      node.$children = [];
      return;
    }
    const isWhitespaceSensitive = isWhitespaceSensitiveNode(node, options2);
    const isIndentationSensitive = isIndentationSensitiveNode(node);
    if (!isWhitespaceSensitive) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.kind !== "text") {
          continue;
        }
        const { leadingWhitespace, text, trailingWhitespace } = getLeadingAndTrailingHtmlWhitespace(child.value);
        const prevChild = child.prev;
        const nextChild = child.next;
        if (!text) {
          node.removeChild(child);
          i--;
          if (leadingWhitespace || trailingWhitespace) {
            if (prevChild) {
              prevChild.hasTrailingSpaces = true;
            }
            if (nextChild) {
              nextChild.hasLeadingSpaces = true;
            }
          }
        } else {
          child.value = text;
          child.sourceSpan = new ParseSourceSpan(
            child.sourceSpan.start.moveBy(leadingWhitespace.length),
            child.sourceSpan.end.moveBy(-trailingWhitespace.length)
          );
          if (leadingWhitespace) {
            if (prevChild) {
              prevChild.hasTrailingSpaces = true;
            }
            child.hasLeadingSpaces = true;
          }
          if (trailingWhitespace) {
            child.hasTrailingSpaces = true;
            if (nextChild) {
              nextChild.hasLeadingSpaces = true;
            }
          }
        }
      }
    }
    node.isWhitespaceSensitive = isWhitespaceSensitive;
    node.isIndentationSensitive = isIndentationSensitive;
  });
}
function addIsSelfClosing(ast) {
  ast.walk((node) => {
    node.isSelfClosing = !node.children || node.kind === "element" && (node.tagDefinition.isVoid || // self-closing
    node.endSourceSpan && node.startSourceSpan.start === node.endSourceSpan.start && node.startSourceSpan.end === node.endSourceSpan.end);
  });
}
function addHasHtmComponentClosingTag(ast, options2) {
  ast.walk((node) => {
    if (node.kind !== "element") {
      return;
    }
    node.hasHtmComponentClosingTag = node.endSourceSpan && /^<\s*\/\s*\/\s*>$/.test(
      options2.originalText.slice(
        node.endSourceSpan.start.offset,
        node.endSourceSpan.end.offset
      )
    );
  });
}
function addCssDisplay(ast, options2) {
  ast.walk((node) => {
    node.cssDisplay = getNodeCssStyleDisplay(node, options2);
  });
}
function addIsSpaceSensitive(ast, options2) {
  ast.walk((node) => {
    const { children } = node;
    if (!children) {
      return;
    }
    if (children.length === 0) {
      node.isDanglingSpaceSensitive = isDanglingSpaceSensitiveNode(
        node,
        options2
      );
      return;
    }
    for (const child of children) {
      child.isLeadingSpaceSensitive = isLeadingSpaceSensitiveNode(
        child,
        options2
      );
      child.isTrailingSpaceSensitive = isTrailingSpaceSensitiveNode(
        child,
        options2
      );
    }
    for (let index = 0; index < children.length; index++) {
      const child = children[index];
      child.isLeadingSpaceSensitive = index === 0 ? child.isLeadingSpaceSensitive : child.prev.isTrailingSpaceSensitive && child.isLeadingSpaceSensitive;
      child.isTrailingSpaceSensitive = index === children.length - 1 ? child.isTrailingSpaceSensitive : child.next.isLeadingSpaceSensitive && child.isTrailingSpaceSensitive;
    }
  });
}
var print_preprocess_default = preprocess;

// src/language-html/printer-html.js
function genericPrint(path, options2, print) {
  const {
    node
  } = path;
  switch (node.kind) {
    case "root":
      if (options2.__onHtmlRoot) {
        options2.__onHtmlRoot(node);
      }
      return [group(printChildren(path, options2, print)), hardline];
    case "element":
    case "ieConditionalComment":
      return printElement(path, options2, print);
    case "angularControlFlowBlock":
      return printAngularControlFlowBlock(path, options2, print);
    case "angularControlFlowBlockParameters":
      return printAngularControlFlowBlockParameters2(path, options2, print);
    case "angularControlFlowBlockParameter":
      return html_whitespace_default.trim(node.expression);
    case "angularLetDeclaration":
      return group([
        "@let ",
        group([node.id, " =", group(indent([line, print("init")]))]),
        // semicolon is required
        ";"
      ]);
    case "angularLetDeclarationInitializer":
      return node.value;
    case "angularIcuExpression":
      return printAngularIcuExpression(path, options2, print);
    case "angularIcuCase":
      return printAngularIcuCase(path, options2, print);
    case "ieConditionalStartComment":
    case "ieConditionalEndComment":
      return [printOpeningTagStart(node), printClosingTagEnd(node)];
    case "interpolation":
      return [printOpeningTagStart(node, options2), ...path.map(print, "children"), printClosingTagEnd(node, options2)];
    case "text": {
      if (node.parent.kind === "interpolation") {
        const trailingNewlineRegex = /\n[^\S\n]*$/;
        const hasTrailingNewline = trailingNewlineRegex.test(node.value);
        const value = hasTrailingNewline ? node.value.replace(trailingNewlineRegex, "") : node.value;
        return [replaceEndOfLine(value), hasTrailingNewline ? hardline : ""];
      }
      const prefix = printOpeningTagPrefix(node, options2);
      const printed = getTextValueParts(node);
      const suffix = printClosingTagSuffix(node, options2);
      printed[0] = [prefix, printed[0]];
      printed.push([printed.pop(), suffix]);
      return fill(printed);
    }
    case "docType":
      return [group([printOpeningTagStart(node, options2), " ", method_replace_all_default(
        /* OPTIONAL_OBJECT: false */
        0,
        node.value.replace(/^html\b/i, "html"),
        /\s+/g,
        " "
      )]), printClosingTagEnd(node, options2)];
    case "comment":
      return [printOpeningTagPrefix(node, options2), replaceEndOfLine(options2.originalText.slice(locStart(node), locEnd(node))), printClosingTagSuffix(node, options2)];
    case "attribute": {
      if (node.value === null) {
        return node.rawName;
      }
      const value = unescapeQuoteEntities(node.value);
      const quote = shouldUnquoteAttributeValue(node, options2) ? "" : getPreferredQuote(value, '"');
      return [node.rawName, "=", quote, replaceEndOfLine(quote === '"' ? method_replace_all_default(
        /* OPTIONAL_OBJECT: false */
        0,
        value,
        '"',
        "&quot;"
      ) : method_replace_all_default(
        /* OPTIONAL_OBJECT: false */
        0,
        value,
        "'",
        "&apos;"
      )), quote];
    }
    case "startTagComment":
      return printStartTagComment(path);
    case "frontMatter":
    // Handled in core
    case "cdata":
    // Transformed into `text`
    default:
      throw new unexpected_node_error_default(node, "HTML");
  }
}
var printer = {
  features: {
    experimental_frontMatterSupport: {
      massageAstNode: true,
      embed: true,
      print: true
    }
  },
  preprocess: print_preprocess_default,
  print: genericPrint,
  insertPragma,
  massageAstNode,
  embed: embed_default,
  getVisitorKeys: get_visitor_keys_default
};
var printer_html_default = printer;

// src/language-html/languages.evaluate.js
var languages_evaluate_default = [
  {
    "name": "Angular",
    "type": "markup",
    "aceMode": "html",
    "extensions": [
      ".component.html"
    ],
    "tmScope": "text.html.basic",
    "aliases": [
      "xhtml"
    ],
    "codemirrorMode": "htmlmixed",
    "codemirrorMimeType": "text/html",
    "parsers": [
      "angular"
    ],
    "vscodeLanguageIds": [
      "html"
    ],
    "filenames": [],
    "linguistLanguageId": 146
  },
  {
    "name": "HTML",
    "type": "markup",
    "aceMode": "html",
    "extensions": [
      ".html",
      ".hta",
      ".htm",
      ".html.hl",
      ".inc",
      ".xht",
      ".xhtml"
    ],
    "tmScope": "text.html.basic",
    "aliases": [
      "xhtml"
    ],
    "codemirrorMode": "htmlmixed",
    "codemirrorMimeType": "text/html",
    "parsers": [
      "html"
    ],
    "vscodeLanguageIds": [
      "html"
    ],
    "linguistLanguageId": 146
  },
  {
    "name": "Lightning Web Components",
    "type": "markup",
    "aceMode": "html",
    "extensions": [],
    "tmScope": "text.html.basic",
    "aliases": [
      "LWC",
      "lwc"
    ],
    "codemirrorMode": "htmlmixed",
    "codemirrorMimeType": "text/html",
    "parsers": [
      "lwc"
    ],
    "vscodeLanguageIds": [
      "html"
    ],
    "filenames": [],
    "linguistLanguageId": 146
  },
  {
    "name": "MJML",
    "type": "markup",
    "aceMode": "html",
    "extensions": [
      ".mjml"
    ],
    "tmScope": "text.mjml.basic",
    "aliases": [
      "MJML",
      "mjml"
    ],
    "codemirrorMode": "htmlmixed",
    "codemirrorMimeType": "text/html",
    "parsers": [
      "mjml"
    ],
    "filenames": [],
    "vscodeLanguageIds": [
      "mjml"
    ],
    "linguistLanguageId": 146
  },
  {
    "name": "Vue",
    "type": "markup",
    "aceMode": "vue",
    "extensions": [
      ".vue"
    ],
    "tmScope": "text.html.vue",
    "codemirrorMode": "vue",
    "codemirrorMimeType": "text/x-vue",
    "parsers": [
      "vue"
    ],
    "vscodeLanguageIds": [
      "vue"
    ],
    "linguistLanguageId": 391
  }
];

// src/common/common-options.evaluate.js
var common_options_evaluate_default = {
  "bracketSpacing": {
    "category": "Common",
    "type": "boolean",
    "default": true,
    "description": "Print spaces between brackets.",
    "oppositeDescription": "Do not print spaces between brackets."
  },
  "objectWrap": {
    "category": "Common",
    "type": "choice",
    "default": "preserve",
    "description": "How to wrap object literals.",
    "choices": [
      {
        "value": "preserve",
        "description": "Keep as multi-line, if there is a newline between the opening brace and first property."
      },
      {
        "value": "collapse",
        "description": "Fit to a single line when possible."
      }
    ]
  },
  "singleQuote": {
    "category": "Common",
    "type": "boolean",
    "default": false,
    "description": "Use single quotes instead of double quotes."
  },
  "proseWrap": {
    "category": "Common",
    "type": "choice",
    "default": "preserve",
    "description": "How to wrap prose.",
    "choices": [
      {
        "value": "always",
        "description": "Wrap prose if it exceeds the print width."
      },
      {
        "value": "never",
        "description": "Do not wrap prose."
      },
      {
        "value": "preserve",
        "description": "Wrap prose as-is."
      }
    ]
  },
  "bracketSameLine": {
    "category": "Common",
    "type": "boolean",
    "default": false,
    "description": "Put > of opening tags on the last line instead of on a new line."
  },
  "singleAttributePerLine": {
    "category": "Common",
    "type": "boolean",
    "default": false,
    "description": "Enforce single attribute per line in HTML, Vue and JSX."
  }
};

// src/language-html/options.js
var CATEGORY_HTML = "HTML";
var options = {
  bracketSameLine: common_options_evaluate_default.bracketSameLine,
  htmlWhitespaceSensitivity: {
    category: CATEGORY_HTML,
    type: "choice",
    default: "css",
    description: "How to handle whitespaces in HTML.",
    choices: [
      {
        value: "css",
        description: "Respect the default value of CSS display property."
      },
      {
        value: "strict",
        description: "Whitespaces are considered sensitive."
      },
      {
        value: "ignore",
        description: "Whitespaces are considered insensitive."
      }
    ]
  },
  singleAttributePerLine: common_options_evaluate_default.singleAttributePerLine,
  vueIndentScriptAndStyle: {
    category: CATEGORY_HTML,
    type: "boolean",
    default: false,
    description: "Indent script and style tags in Vue files."
  }
};
var options_default = options;

// src/language-html/parse/parsers.js
var parsers_exports = {};
__export(parsers_exports, {
  angular: () => angularParser,
  html: () => htmlParser2,
  lwc: () => lwcParser,
  mjml: () => mjmlParser,
  vue: () => vueParser
});

// src/common/parser-create-error.js
function createError(message, options2) {
  const error = new SyntaxError(
    message + " (" + options2.loc.start.line + ":" + options2.loc.start.column + ")"
  );
  return Object.assign(error, options2);
}
var parser_create_error_default = createError;

// src/language-html/parse/parse-options.js
var DEFAULT_PARSE_OPTIONS = {
  canSelfClose: true,
  normalizeTagName: false,
  normalizeAttributeName: false,
  allowHtmComponentClosingTags: false,
  allowStartTagComments: false,
  isTagNameCaseSensitive: false,
  shouldParseFrontMatter: true
};
function normalizeParseOptions(rawParseOptions) {
  return {
    ...DEFAULT_PARSE_OPTIONS,
    ...rawParseOptions
  };
}
function toAngularHtmlParserParseOptions(parseOptions) {
  const {
    canSelfClose,
    allowHtmComponentClosingTags,
    allowStartTagComments,
    isTagNameCaseSensitive,
    shouldParseAsRawText,
    tokenizeAngularBlocks,
    tokenizeAngularLetDeclaration
  } = parseOptions;
  return {
    canSelfClose,
    allowHtmComponentClosingTags,
    allowStartTagComments,
    isTagNameCaseSensitive,
    getTagContentType: shouldParseAsRawText ? (...args) => shouldParseAsRawText(...args) ? TagContentType.RAW_TEXT : void 0 : void 0,
    tokenizeAngularBlocks,
    tokenizeAngularLetDeclaration
  };
}

// src/language-html/utilities/html-elements-attributes.evaluate.js
var html_elements_attributes_evaluate_default = /* @__PURE__ */ new Map([
  [
    "*",
    /* @__PURE__ */ new Set([
      "accesskey",
      "autocapitalize",
      "autocorrect",
      "autofocus",
      "class",
      "contenteditable",
      "dir",
      "draggable",
      "enterkeyhint",
      "exportparts",
      "hidden",
      "id",
      "inert",
      "inputmode",
      "is",
      "itemid",
      "itemprop",
      "itemref",
      "itemscope",
      "itemtype",
      "lang",
      "nonce",
      "part",
      "popover",
      "slot",
      "spellcheck",
      "style",
      "tabindex",
      "title",
      "translate",
      "writingsuggestions"
    ])
  ],
  [
    "a",
    /* @__PURE__ */ new Set([
      "charset",
      "coords",
      "download",
      "href",
      "hreflang",
      "name",
      "ping",
      "referrerpolicy",
      "rel",
      "rev",
      "shape",
      "target",
      "type"
    ])
  ],
  [
    "applet",
    /* @__PURE__ */ new Set([
      "align",
      "alt",
      "archive",
      "code",
      "codebase",
      "height",
      "hspace",
      "name",
      "object",
      "vspace",
      "width"
    ])
  ],
  [
    "area",
    /* @__PURE__ */ new Set([
      "alt",
      "coords",
      "download",
      "href",
      "hreflang",
      "nohref",
      "ping",
      "referrerpolicy",
      "rel",
      "shape",
      "target",
      "type"
    ])
  ],
  [
    "audio",
    /* @__PURE__ */ new Set([
      "autoplay",
      "controls",
      "crossorigin",
      "loop",
      "muted",
      "preload",
      "src"
    ])
  ],
  [
    "base",
    /* @__PURE__ */ new Set([
      "href",
      "target"
    ])
  ],
  [
    "basefont",
    /* @__PURE__ */ new Set([
      "color",
      "face",
      "size"
    ])
  ],
  [
    "blockquote",
    /* @__PURE__ */ new Set([
      "cite"
    ])
  ],
  [
    "body",
    /* @__PURE__ */ new Set([
      "alink",
      "background",
      "bgcolor",
      "link",
      "text",
      "vlink"
    ])
  ],
  [
    "br",
    /* @__PURE__ */ new Set([
      "clear"
    ])
  ],
  [
    "button",
    /* @__PURE__ */ new Set([
      "command",
      "commandfor",
      "disabled",
      "form",
      "formaction",
      "formenctype",
      "formmethod",
      "formnovalidate",
      "formtarget",
      "name",
      "popovertarget",
      "popovertargetaction",
      "type",
      "value"
    ])
  ],
  [
    "canvas",
    /* @__PURE__ */ new Set([
      "height",
      "width"
    ])
  ],
  [
    "caption",
    /* @__PURE__ */ new Set([
      "align"
    ])
  ],
  [
    "col",
    /* @__PURE__ */ new Set([
      "align",
      "char",
      "charoff",
      "span",
      "valign",
      "width"
    ])
  ],
  [
    "colgroup",
    /* @__PURE__ */ new Set([
      "align",
      "char",
      "charoff",
      "span",
      "valign",
      "width"
    ])
  ],
  [
    "data",
    /* @__PURE__ */ new Set([
      "value"
    ])
  ],
  [
    "del",
    /* @__PURE__ */ new Set([
      "cite",
      "datetime"
    ])
  ],
  [
    "details",
    /* @__PURE__ */ new Set([
      "name",
      "open"
    ])
  ],
  [
    "dialog",
    /* @__PURE__ */ new Set([
      "closedby",
      "open"
    ])
  ],
  [
    "dir",
    /* @__PURE__ */ new Set([
      "compact"
    ])
  ],
  [
    "div",
    /* @__PURE__ */ new Set([
      "align"
    ])
  ],
  [
    "dl",
    /* @__PURE__ */ new Set([
      "compact"
    ])
  ],
  [
    "embed",
    /* @__PURE__ */ new Set([
      "height",
      "src",
      "type",
      "width"
    ])
  ],
  [
    "fieldset",
    /* @__PURE__ */ new Set([
      "disabled",
      "form",
      "name"
    ])
  ],
  [
    "font",
    /* @__PURE__ */ new Set([
      "color",
      "face",
      "size"
    ])
  ],
  [
    "form",
    /* @__PURE__ */ new Set([
      "accept",
      "accept-charset",
      "action",
      "autocomplete",
      "enctype",
      "method",
      "name",
      "novalidate",
      "target"
    ])
  ],
  [
    "frame",
    /* @__PURE__ */ new Set([
      "frameborder",
      "longdesc",
      "marginheight",
      "marginwidth",
      "name",
      "noresize",
      "scrolling",
      "src"
    ])
  ],
  [
    "frameset",
    /* @__PURE__ */ new Set([
      "cols",
      "rows"
    ])
  ],
  [
    "h1",
    /* @__PURE__ */ new Set([
      "align"
    ])
  ],
  [
    "h2",
    /* @__PURE__ */ new Set([
      "align"
    ])
  ],
  [
    "h3",
    /* @__PURE__ */ new Set([
      "align"
    ])
  ],
  [
    "h4",
    /* @__PURE__ */ new Set([
      "align"
    ])
  ],
  [
    "h5",
    /* @__PURE__ */ new Set([
      "align"
    ])
  ],
  [
    "h6",
    /* @__PURE__ */ new Set([
      "align"
    ])
  ],
  [
    "head",
    /* @__PURE__ */ new Set([
      "profile"
    ])
  ],
  [
    "hr",
    /* @__PURE__ */ new Set([
      "align",
      "noshade",
      "size",
      "width"
    ])
  ],
  [
    "html",
    /* @__PURE__ */ new Set([
      "manifest",
      "version"
    ])
  ],
  [
    "iframe",
    /* @__PURE__ */ new Set([
      "align",
      "allow",
      "allowfullscreen",
      "allowpaymentrequest",
      "allowusermedia",
      "frameborder",
      "height",
      "loading",
      "longdesc",
      "marginheight",
      "marginwidth",
      "name",
      "referrerpolicy",
      "sandbox",
      "scrolling",
      "src",
      "srcdoc",
      "width"
    ])
  ],
  [
    "img",
    /* @__PURE__ */ new Set([
      "align",
      "alt",
      "border",
      "crossorigin",
      "decoding",
      "fetchpriority",
      "height",
      "hspace",
      "ismap",
      "loading",
      "longdesc",
      "name",
      "referrerpolicy",
      "sizes",
      "src",
      "srcset",
      "usemap",
      "vspace",
      "width"
    ])
  ],
  [
    "input",
    /* @__PURE__ */ new Set([
      "accept",
      "align",
      "alpha",
      "alt",
      "autocomplete",
      "checked",
      "colorspace",
      "dirname",
      "disabled",
      "form",
      "formaction",
      "formenctype",
      "formmethod",
      "formnovalidate",
      "formtarget",
      "height",
      "ismap",
      "list",
      "max",
      "maxlength",
      "min",
      "minlength",
      "multiple",
      "name",
      "pattern",
      "placeholder",
      "popovertarget",
      "popovertargetaction",
      "readonly",
      "required",
      "size",
      "src",
      "step",
      "type",
      "usemap",
      "value",
      "width"
    ])
  ],
  [
    "ins",
    /* @__PURE__ */ new Set([
      "cite",
      "datetime"
    ])
  ],
  [
    "isindex",
    /* @__PURE__ */ new Set([
      "prompt"
    ])
  ],
  [
    "label",
    /* @__PURE__ */ new Set([
      "for",
      "form"
    ])
  ],
  [
    "legend",
    /* @__PURE__ */ new Set([
      "align"
    ])
  ],
  [
    "li",
    /* @__PURE__ */ new Set([
      "type",
      "value"
    ])
  ],
  [
    "link",
    /* @__PURE__ */ new Set([
      "as",
      "blocking",
      "charset",
      "color",
      "crossorigin",
      "disabled",
      "fetchpriority",
      "href",
      "hreflang",
      "imagesizes",
      "imagesrcset",
      "integrity",
      "media",
      "referrerpolicy",
      "rel",
      "rev",
      "sizes",
      "target",
      "type"
    ])
  ],
  [
    "map",
    /* @__PURE__ */ new Set([
      "name"
    ])
  ],
  [
    "menu",
    /* @__PURE__ */ new Set([
      "compact"
    ])
  ],
  [
    "meta",
    /* @__PURE__ */ new Set([
      "charset",
      "content",
      "http-equiv",
      "media",
      "name",
      "scheme"
    ])
  ],
  [
    "meter",
    /* @__PURE__ */ new Set([
      "high",
      "low",
      "max",
      "min",
      "optimum",
      "value"
    ])
  ],
  [
    "object",
    /* @__PURE__ */ new Set([
      "align",
      "archive",
      "border",
      "classid",
      "codebase",
      "codetype",
      "data",
      "declare",
      "form",
      "height",
      "hspace",
      "name",
      "standby",
      "type",
      "typemustmatch",
      "usemap",
      "vspace",
      "width"
    ])
  ],
  [
    "ol",
    /* @__PURE__ */ new Set([
      "compact",
      "reversed",
      "start",
      "type"
    ])
  ],
  [
    "optgroup",
    /* @__PURE__ */ new Set([
      "disabled",
      "label"
    ])
  ],
  [
    "option",
    /* @__PURE__ */ new Set([
      "disabled",
      "label",
      "selected",
      "value"
    ])
  ],
  [
    "output",
    /* @__PURE__ */ new Set([
      "for",
      "form",
      "name"
    ])
  ],
  [
    "p",
    /* @__PURE__ */ new Set([
      "align"
    ])
  ],
  [
    "param",
    /* @__PURE__ */ new Set([
      "name",
      "type",
      "value",
      "valuetype"
    ])
  ],
  [
    "pre",
    /* @__PURE__ */ new Set([
      "width"
    ])
  ],
  [
    "progress",
    /* @__PURE__ */ new Set([
      "max",
      "value"
    ])
  ],
  [
    "q",
    /* @__PURE__ */ new Set([
      "cite"
    ])
  ],
  [
    "script",
    /* @__PURE__ */ new Set([
      "async",
      "blocking",
      "charset",
      "crossorigin",
      "defer",
      "fetchpriority",
      "integrity",
      "language",
      "nomodule",
      "referrerpolicy",
      "src",
      "type"
    ])
  ],
  [
    "select",
    /* @__PURE__ */ new Set([
      "autocomplete",
      "disabled",
      "form",
      "multiple",
      "name",
      "required",
      "size"
    ])
  ],
  [
    "slot",
    /* @__PURE__ */ new Set([
      "name"
    ])
  ],
  [
    "source",
    /* @__PURE__ */ new Set([
      "height",
      "media",
      "sizes",
      "src",
      "srcset",
      "type",
      "width"
    ])
  ],
  [
    "style",
    /* @__PURE__ */ new Set([
      "blocking",
      "media",
      "type"
    ])
  ],
  [
    "table",
    /* @__PURE__ */ new Set([
      "align",
      "bgcolor",
      "border",
      "cellpadding",
      "cellspacing",
      "frame",
      "rules",
      "summary",
      "width"
    ])
  ],
  [
    "tbody",
    /* @__PURE__ */ new Set([
      "align",
      "char",
      "charoff",
      "valign"
    ])
  ],
  [
    "td",
    /* @__PURE__ */ new Set([
      "abbr",
      "align",
      "axis",
      "bgcolor",
      "char",
      "charoff",
      "colspan",
      "headers",
      "height",
      "nowrap",
      "rowspan",
      "scope",
      "valign",
      "width"
    ])
  ],
  [
    "template",
    /* @__PURE__ */ new Set([
      "shadowrootclonable",
      "shadowrootcustomelementregistry",
      "shadowrootdelegatesfocus",
      "shadowrootmode",
      "shadowrootserializable"
    ])
  ],
  [
    "textarea",
    /* @__PURE__ */ new Set([
      "autocomplete",
      "cols",
      "dirname",
      "disabled",
      "form",
      "maxlength",
      "minlength",
      "name",
      "placeholder",
      "readonly",
      "required",
      "rows",
      "wrap"
    ])
  ],
  [
    "tfoot",
    /* @__PURE__ */ new Set([
      "align",
      "char",
      "charoff",
      "valign"
    ])
  ],
  [
    "th",
    /* @__PURE__ */ new Set([
      "abbr",
      "align",
      "axis",
      "bgcolor",
      "char",
      "charoff",
      "colspan",
      "headers",
      "height",
      "nowrap",
      "rowspan",
      "scope",
      "valign",
      "width"
    ])
  ],
  [
    "thead",
    /* @__PURE__ */ new Set([
      "align",
      "char",
      "charoff",
      "valign"
    ])
  ],
  [
    "time",
    /* @__PURE__ */ new Set([
      "datetime"
    ])
  ],
  [
    "tr",
    /* @__PURE__ */ new Set([
      "align",
      "bgcolor",
      "char",
      "charoff",
      "valign"
    ])
  ],
  [
    "track",
    /* @__PURE__ */ new Set([
      "default",
      "kind",
      "label",
      "src",
      "srclang"
    ])
  ],
  [
    "ul",
    /* @__PURE__ */ new Set([
      "compact",
      "type"
    ])
  ],
  [
    "video",
    /* @__PURE__ */ new Set([
      "autoplay",
      "controls",
      "crossorigin",
      "height",
      "loop",
      "muted",
      "playsinline",
      "poster",
      "preload",
      "src",
      "width"
    ])
  ]
]);

// src/language-html/utilities/html-tags.evaluate.js
var html_tags_evaluate_default = /* @__PURE__ */ new Set([
  "a",
  "abbr",
  "acronym",
  "address",
  "applet",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "basefont",
  "bdi",
  "bdo",
  "bgsound",
  "big",
  "blink",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "center",
  "cite",
  "code",
  "col",
  "colgroup",
  "command",
  "content",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fencedframe",
  "fieldset",
  "figcaption",
  "figure",
  "font",
  "footer",
  "form",
  "frame",
  "frameset",
  "geolocation",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "image",
  "img",
  "input",
  "ins",
  "isindex",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "link",
  "listing",
  "main",
  "map",
  "mark",
  "marquee",
  "math",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "multicol",
  "nav",
  "nextid",
  "nobr",
  "noembed",
  "noframes",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "plaintext",
  "pre",
  "progress",
  "q",
  "rb",
  "rbc",
  "rp",
  "rt",
  "rtc",
  "ruby",
  "s",
  "samp",
  "script",
  "search",
  "section",
  "select",
  "selectedcontent",
  "shadow",
  "slot",
  "small",
  "source",
  "spacer",
  "span",
  "strike",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "svg",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "tt",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
  "xmp"
]);

// src/language-html/parse/ast.js
var NODES_KEYS = {
  attrs: true,
  children: true,
  cases: true,
  // plural and select
  expression: true
  // for expansionCase
};
var NON_ENUMERABLE_PROPERTIES = /* @__PURE__ */ new Set(["parent"]);
var _Node_instances, childrenProperty_get, siblings_get;
var _Node = class _Node {
  constructor(nodeOrProperties = {}) {
    __privateAdd(this, _Node_instances);
    __publicField(this, "kind");
    __publicField(this, "parent");
    for (const property of /* @__PURE__ */ new Set([...NON_ENUMERABLE_PROPERTIES, ...Object.keys(nodeOrProperties)])) {
      this.setProperty(property, nodeOrProperties[property]);
    }
    if (is_front_matter_default(nodeOrProperties)) {
      for (const property of Object.getOwnPropertySymbols(nodeOrProperties)) {
        this.setProperty(property, nodeOrProperties[property]);
      }
    }
  }
  setProperty(property, value) {
    if (this[property] === value) {
      return;
    }
    if (property in NODES_KEYS) {
      value = value.map((node) => this.createChild(node));
    }
    if (!NON_ENUMERABLE_PROPERTIES.has(property)) {
      this[property] = value;
      return;
    }
    Object.defineProperty(this, property, {
      value,
      enumerable: false,
      configurable: true
    });
  }
  map(fn) {
    let newNode;
    for (const NODES_KEY in NODES_KEYS) {
      const nodes = this[NODES_KEY];
      if (nodes) {
        const mappedNodes = mapNodesIfChanged(nodes, (node) => node.map(fn));
        if (newNode !== nodes) {
          newNode ?? (newNode = new _Node({
            parent: this.parent
          }));
          newNode.setProperty(NODES_KEY, mappedNodes);
        }
      }
    }
    if (newNode) {
      for (const key in this) {
        if (!(key in NODES_KEYS)) {
          newNode[key] = this[key];
        }
      }
    }
    return fn(newNode || this);
  }
  walk(fn) {
    for (const NODES_KEY in NODES_KEYS) {
      const nodes = this[NODES_KEY];
      if (nodes) {
        for (let i = 0; i < nodes.length; i++) {
          nodes[i].walk(fn);
        }
      }
    }
    fn(this);
  }
  createChild(nodeOrProperties) {
    const node = nodeOrProperties instanceof _Node ? nodeOrProperties.clone() : new _Node(nodeOrProperties);
    node.setProperty("parent", this);
    return node;
  }
  /**
   * @param {Node} [target]
   * @param {Object} [node]
   */
  insertChildBefore(target, node) {
    const children = this.$children;
    children.splice(children.indexOf(target), 0, this.createChild(node));
  }
  /**
   * @param {Node} [child]
   */
  removeChild(child) {
    const children = this.$children;
    children.splice(children.indexOf(child), 1);
  }
  /**
   * @param {Node} [target]
   * @param {Object} [node]
   */
  replaceChild(target, node) {
    const children = this.$children;
    children[children.indexOf(target)] = this.createChild(node);
  }
  clone() {
    return new _Node(this);
  }
  // Use `$` prefix since `children` already exits in the original AST,
  // Can't use `#children` either, since it need be public
  // There are other children in different Node, see `#childrenProperty`
  get $children() {
    return this[__privateGet(this, _Node_instances, childrenProperty_get)];
  }
  set $children(value) {
    this[__privateGet(this, _Node_instances, childrenProperty_get)] = value;
  }
  get firstChild() {
    return this.$children?.[0];
  }
  get lastChild() {
    return method_at_default(
      /* OPTIONAL_OBJECT: true */
      1,
      this.$children,
      -1
    );
  }
  get prev() {
    const siblings = __privateGet(this, _Node_instances, siblings_get);
    return siblings[siblings.indexOf(this) - 1];
  }
  get next() {
    const siblings = __privateGet(this, _Node_instances, siblings_get);
    return siblings[siblings.indexOf(this) + 1];
  }
  // for element and attribute
  get rawName() {
    return this.hasExplicitNamespace ? this.fullName : this.name;
  }
  get fullName() {
    return this.namespace ? this.namespace + ":" + this.name : this.name;
  }
  get attrMap() {
    return Object.fromEntries(
      // @ts-expect-error
      this.attrs.map((attr) => [attr.fullName, attr.value])
    );
  }
};
_Node_instances = new WeakSet();
childrenProperty_get = function() {
  if (this.kind === "angularIcuCase") {
    return "expression";
  }
  if (this.kind === "angularIcuExpression") {
    return "cases";
  }
  return "children";
};
siblings_get = function() {
  return this.parent?.$children ?? [];
};
var Node = _Node;
function mapNodesIfChanged(nodes, fn) {
  const newNodes = nodes.map(fn);
  return newNodes.some((newNode, index) => newNode !== nodes[index]) ? newNodes : nodes;
}

// src/language-html/parse/conditional-comment.js
var parseFunctions = [{
  // <!--[if ... ]> ... <![endif]-->
  regex: /^(?<openingTagSuffix>\[if(?<condition>[^\]]*)\]>)(?<data>.*?)<!\s*\[endif\]$/s,
  parse: parseIeConditionalStartEndComment
}, {
  // <!--[if ... ]><!-->
  regex: /^\[if(?<condition>[^\]]*)\]><!$/,
  parse: parseIeConditionalStartComment
}, {
  // <!--<![endif]-->
  regex: /^<!\s*\[endif\]$/,
  parse: parseIeConditionalEndComment
}];
function parseIeConditionalComment(node, parseHtml3) {
  if (node.value) {
    for (const {
      regex,
      parse: parse3
    } of parseFunctions) {
      const match = node.value.match(regex);
      if (match) {
        return parse3(node, match, parseHtml3);
      }
    }
  }
  return null;
}
function parseIeConditionalStartEndComment(node, match, parseHtml3) {
  const {
    openingTagSuffix,
    condition,
    data
  } = match.groups;
  const offset = "<!--".length + openingTagSuffix.length;
  const contentStartSpan = node.sourceSpan.start.moveBy(offset);
  const contentEndSpan = contentStartSpan.moveBy(data.length);
  const [complete, children] = (() => {
    try {
      return [true, parseHtml3(data, contentStartSpan).children];
    } catch {
      const text = {
        kind: "text",
        value: data,
        sourceSpan: new ParseSourceSpan(contentStartSpan, contentEndSpan)
      };
      return [false, [text]];
    }
  })();
  return {
    kind: "ieConditionalComment",
    complete,
    children,
    condition: method_replace_all_default(
      /* OPTIONAL_OBJECT: false */
      0,
      condition.trim(),
      /\s+/g,
      " "
    ),
    sourceSpan: node.sourceSpan,
    startSourceSpan: new ParseSourceSpan(node.sourceSpan.start, contentStartSpan),
    endSourceSpan: new ParseSourceSpan(contentEndSpan, node.sourceSpan.end)
  };
}
function parseIeConditionalStartComment(node, match) {
  const {
    condition
  } = match.groups;
  return {
    kind: "ieConditionalStartComment",
    condition: method_replace_all_default(
      /* OPTIONAL_OBJECT: false */
      0,
      condition.trim(),
      /\s+/g,
      " "
    ),
    sourceSpan: node.sourceSpan
  };
}
function parseIeConditionalEndComment(node) {
  return {
    kind: "ieConditionalEndComment",
    sourceSpan: node.sourceSpan
  };
}

// src/language-html/parse/postprocess.js
var Visitor = class extends RecursiveVisitor {
  // Angular does not visit to the children of expansionCase
  // https://github.com/angular/angular/blob/e3a6bf9b6c3bef03df9bfc8f05b817bc875cbad6/packages/compiler/src/ml_parser/ast.ts#L161
  visitExpansionCase(ast, context) {
    if (context.parseOptions.name === "angular") {
      this.visitChildren(context, (visit) => {
        visit(ast.expression);
      });
    }
  }
  visit(node, {
    parseOptions
  }) {
    restoreNameAndValue(node);
    addTagDefinition(node, parseOptions);
    normalizeName(node, parseOptions);
    fixSourceSpan(node);
  }
};
function postprocess(rawAst, frontMatter, parseOptions, parseSubHtml2) {
  const isAngular = parseOptions.name === "angular";
  visitAll(new Visitor(), rawAst.children, {
    parseOptions
  });
  if (frontMatter) {
    rawAst.children.unshift(frontMatter);
  }
  const ast = new Node(rawAst);
  ast.walk((node) => {
    if (node.kind === "comment") {
      const ieConditionalComment = parseIeConditionalComment(node, parseSubHtml2);
      if (ieConditionalComment) {
        node.parent.replaceChild(node, ieConditionalComment);
      }
    } else if (isAngular && node.kind === "element" && node.comments) {
      node.startTagComments = node.comments;
      delete node.comments;
    }
    if (isAngular) {
      normalizeAngularControlFlowBlock(node);
      normalizeAngularLetDeclaration(node);
      normalizeAngularIcuExpression(node);
    }
  });
  return ast;
}
function normalizeAngularControlFlowBlock(node) {
  if (node.kind !== "block") {
    return;
  }
  node.name = method_replace_all_default(
    /* OPTIONAL_OBJECT: false */
    0,
    node.name.toLowerCase(),
    /\s+/g,
    " "
  ).trim();
  node.kind = "angularControlFlowBlock";
  if (!is_non_empty_array_default(node.parameters)) {
    delete node.parameters;
    return;
  }
  for (const parameter of node.parameters) {
    parameter.kind = "angularControlFlowBlockParameter";
  }
  node.parameters = {
    kind: "angularControlFlowBlockParameters",
    children: node.parameters,
    sourceSpan: new ParseSourceSpan(node.parameters[0].sourceSpan.start, method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      node.parameters,
      -1
    ).sourceSpan.end)
  };
}
function normalizeAngularLetDeclaration(node) {
  if (node.kind !== "letDeclaration") {
    return;
  }
  node.kind = "angularLetDeclaration";
  node.id = node.name;
  node.init = {
    kind: "angularLetDeclarationInitializer",
    sourceSpan: new ParseSourceSpan(node.valueSpan.start, node.valueSpan.end),
    value: node.value
  };
  delete node.name;
  delete node.value;
}
function normalizeAngularIcuExpression(node) {
  if (node.kind === "expansion") {
    node.kind = "angularIcuExpression";
  }
  if (node.kind === "expansionCase") {
    node.kind = "angularIcuCase";
  }
}
function lowerCaseIf(text, fn) {
  const lowerCasedText = text.toLowerCase();
  return fn(lowerCasedText) ? lowerCasedText : text;
}
function restoreName(node) {
  const namespace = node.name.startsWith(":") ? node.name.slice(1).split(":", 1)[0] : null;
  const rawName = node.nameSpan.toString();
  const hasExplicitNamespace = namespace !== null && rawName.startsWith(`${namespace}:`);
  const name = hasExplicitNamespace ? rawName.slice(namespace.length + 1) : rawName;
  node.name = name;
  node.namespace = namespace;
  node.hasExplicitNamespace = hasExplicitNamespace;
}
function restoreNameAndValue(node) {
  switch (node.kind) {
    case "element":
      restoreName(node);
      for (const attr of node.attrs) {
        restoreName(attr);
        if (!attr.valueSpan) {
          attr.value = null;
        } else {
          attr.value = attr.valueSpan.toString();
          if (/["']/.test(attr.value[0])) {
            attr.value = attr.value.slice(1, -1);
          }
        }
      }
      break;
    case "comment":
      node.value = node.sourceSpan.toString().slice("<!--".length, -"-->".length);
      break;
    case "text":
      node.value = node.sourceSpan.toString();
      break;
  }
}
function addTagDefinition(node, parseOptions) {
  if (node.kind === "element") {
    const tagDefinition = getHtmlTagDefinition(parseOptions.isTagNameCaseSensitive ? node.name : node.name.toLowerCase());
    if (
      // @ts-expect-error -- we add it
      !node.namespace || // @ts-expect-error -- we add it
      node.namespace === tagDefinition.implicitNamespacePrefix || is_unknown_namespace_default(node)
    ) {
      node.tagDefinition = tagDefinition;
    } else {
      node.tagDefinition = getHtmlTagDefinition("");
    }
  }
}
function fixSourceSpan(node) {
  if (node.sourceSpan && node.endSourceSpan) {
    node.sourceSpan = new ParseSourceSpan(node.sourceSpan.start, node.endSourceSpan.end);
  }
}
function normalizeName(node, parseOptions) {
  if (node.kind === "element") {
    if (parseOptions.normalizeTagName && (!node.namespace || node.namespace === node.tagDefinition.implicitNamespacePrefix || is_unknown_namespace_default(node))) {
      node.name = lowerCaseIf(node.name, (lowerCasedName) => html_tags_evaluate_default.has(lowerCasedName));
    }
    if (parseOptions.normalizeAttributeName) {
      for (const attr of node.attrs) {
        if (!attr.namespace) {
          attr.name = lowerCaseIf(attr.name, (lowerCasedAttrName) => html_elements_attributes_evaluate_default.has(node.name) && (html_elements_attributes_evaluate_default.get("*").has(lowerCasedAttrName) || html_elements_attributes_evaluate_default.get(node.name).has(lowerCasedAttrName)));
        }
      }
    }
  }
}

// src/language-html/parse/parse.js
function parseHtml2(input, parseOptions) {
  const {
    rootNodes,
    errors
  } = parseHtml(input, toAngularHtmlParserParseOptions(parseOptions));
  if (errors.length > 0) {
    throwParseError(errors[0]);
  }
  return {
    parseOptions,
    rootNodes
  };
}
function parseVue(input, parseOptions) {
  const angularHtmlParserParseOptions = toAngularHtmlParserParseOptions(parseOptions);
  let {
    rootNodes,
    errors
  } = parseHtml(input, angularHtmlParserParseOptions);
  const isHtml = rootNodes.some((node) => node.kind === "docType" && node.value === "html" || node.kind === "element" && node.name.toLowerCase() === "html");
  if (isHtml) {
    return parseHtml2(input, HTML_PARSE_OPTIONS);
  }
  let secondParseResult;
  const getHtmlParseResult = () => secondParseResult ?? (secondParseResult = parseHtml(input, {
    ...angularHtmlParserParseOptions,
    getTagContentType: void 0
  }));
  const getElementWithSameLocation = (node) => {
    const {
      offset
    } = node.startSourceSpan.start;
    return getHtmlParseResult().rootNodes.find((searching) => searching.kind === "element" && searching.startSourceSpan.start.offset === offset) ?? node;
  };
  for (const [index, node] of rootNodes.entries()) {
    if (node.kind !== "element") {
      continue;
    }
    if (node.isVoid) {
      errors = getHtmlParseResult().errors;
      rootNodes[index] = getElementWithSameLocation(node);
    } else if (shouldParseVueRootNodeAsHtml(node)) {
      const {
        endSourceSpan,
        startSourceSpan
      } = node;
      const error = getHtmlParseResult().errors.find((error2) => error2.span.start.offset > startSourceSpan.start.offset && error2.span.start.offset < endSourceSpan.end.offset);
      if (error) {
        throwParseError(error);
      }
      rootNodes[index] = getElementWithSameLocation(node);
    }
  }
  if (errors.length > 0) {
    throwParseError(errors[0]);
  }
  return {
    parseOptions,
    rootNodes
  };
}
function shouldParseVueRootNodeAsHtml(node) {
  if (node.kind !== "element" || node.name !== "template") {
    return false;
  }
  const language = node.attrs.find((attr) => attr.name === "lang")?.value;
  return !language || language === "html";
}
function throwParseError(error) {
  const {
    msg,
    span: {
      start,
      end
    }
  } = error;
  throw parser_create_error_default(msg, {
    loc: {
      start: {
        line: start.line + 1,
        column: start.col + 1
      },
      end: {
        line: end.line + 1,
        column: end.col + 1
      }
    },
    cause: error
  });
}
function parseSubHtml(parser, text, subContent, startSpan, parseOptions, options2) {
  const {
    offset
  } = startSpan;
  const textToParse = replace_non_line_breaks_with_space_default(text.slice(0, offset)) + subContent;
  const subAst = parse2(textToParse, parser, {
    ...parseOptions,
    shouldParseFrontMatter: false
  }, options2);
  subAst.sourceSpan = new ParseSourceSpan(
    startSpan,
    // @ts-expect-error
    method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      subAst.children,
      -1
    ).sourceSpan.end
  );
  const firstText = subAst.children[0];
  if (firstText.length === offset) {
    subAst.children.shift();
  } else {
    firstText.sourceSpan = new ParseSourceSpan(firstText.sourceSpan.start.moveBy(offset), firstText.sourceSpan.end);
    firstText.value = firstText.value.slice(offset);
  }
  return subAst;
}
function parse2(text, parser, parseOptions, options2 = {}) {
  const {
    frontMatter,
    content: textToParse
  } = parseOptions.shouldParseFrontMatter ? parse_default(text) : {
    content: text
  };
  const file = new ParseSourceFile(text, options2.filepath);
  const start = new ParseLocation(file, 0, 0, 0);
  const end = start.moveBy(text.length);
  const {
    parseOptions: actualParseOptions,
    rootNodes
  } = parser(textToParse, parseOptions);
  const rawAst = {
    kind: "root",
    sourceSpan: new ParseSourceSpan(start, end),
    children: rootNodes
  };
  let htmlFrontMatter;
  if (frontMatter) {
    const [start2, end2] = [frontMatter.start, frontMatter.end].map((location) => new ParseLocation(file, location.index, location.line - 1, location.column));
    htmlFrontMatter = {
      ...frontMatter,
      kind: "frontMatter",
      sourceSpan: new ParseSourceSpan(start2, end2)
    };
  }
  const ast = postprocess(rawAst, htmlFrontMatter, actualParseOptions, (subContent, startSpan) => parseSubHtml(parser, text, subContent, startSpan, actualParseOptions, options2));
  return ast;
}
var HTML_PARSE_OPTIONS = normalizeParseOptions({
  name: "html",
  normalizeTagName: true,
  normalizeAttributeName: true,
  allowHtmComponentClosingTags: true
});

// src/language-html/parse/parsers.js
function createParser(rawParseOptions) {
  const parseOptions = normalizeParseOptions(rawParseOptions);
  const parser = parseOptions.name === "vue" ? parseVue : parseHtml2;
  return {
    parse: (text, options2) => parse2(text, parser, parseOptions, options2),
    hasPragma,
    hasIgnorePragma,
    astFormat: "html",
    locStart,
    locEnd
  };
}
var htmlParser2 = createParser(HTML_PARSE_OPTIONS);
var MJML_RAW_TAGS = /* @__PURE__ */ new Set(["mj-style", "mj-raw"]);
var mjmlParser = createParser({
  ...HTML_PARSE_OPTIONS,
  name: "mjml",
  shouldParseAsRawText: (tagName) => MJML_RAW_TAGS.has(tagName)
});
var angularParser = createParser({
  name: "angular",
  tokenizeAngularBlocks: true,
  tokenizeAngularLetDeclaration: true,
  allowStartTagComments: true
});
var vueParser = createParser({
  name: "vue",
  isTagNameCaseSensitive: true,
  shouldParseAsRawText(tagName, prefix, hasParent2, attrs) {
    return tagName.toLowerCase() !== "html" && !hasParent2 && (tagName !== "template" || attrs.some(
      ({ name, value }) => name === "lang" && value !== "html" && value !== "" && value !== void 0
    ));
  }
});
var lwcParser = createParser({ name: "lwc", canSelfClose: false });

// src/language-html/index.js
var printers4 = {
  html: printer_html_default
};
export {
  html_exports as default,
  languages_evaluate_default as languages,
  options_default as options,
  parsers_exports as parsers,
  printers4 as printers
};
