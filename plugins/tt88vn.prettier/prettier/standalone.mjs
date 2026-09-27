var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/standalone.js
var standalone_exports = {};
__export(standalone_exports, {
  __debug: () => debugApis,
  check: () => check,
  doc: () => public_exports,
  format: () => format,
  formatWithCursor: () => formatWithCursor2,
  getSupportInfo: () => getSupportInfo2,
  util: () => public_exports2,
  version: () => version_evaluate_default
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

// node_modules/diff/libesm/diff/base.js
var Diff = class {
  diff(oldStr, newStr, options = {}) {
    let callback;
    if (typeof options === "function") {
      callback = options;
      options = {};
    } else if ("callback" in options) {
      callback = options.callback;
    }
    const oldString = this.castInput(oldStr, options);
    const newString = this.castInput(newStr, options);
    const oldTokens = this.removeEmpty(this.tokenize(oldString, options));
    const newTokens = this.removeEmpty(this.tokenize(newString, options));
    return this.diffWithOptionsObj(oldTokens, newTokens, options, callback);
  }
  diffWithOptionsObj(oldTokens, newTokens, options, callback) {
    var _a;
    const done = (value) => {
      value = this.postProcess(value, options);
      if (callback) {
        setTimeout(function() {
          callback(value);
        }, 0);
        return void 0;
      } else {
        return value;
      }
    };
    const newLen = newTokens.length, oldLen = oldTokens.length;
    let editLength = 1;
    let maxEditLength = newLen + oldLen;
    if (options.maxEditLength != null) {
      maxEditLength = Math.min(maxEditLength, options.maxEditLength);
    }
    const maxExecutionTime = (_a = options.timeout) !== null && _a !== void 0 ? _a : Infinity;
    const abortAfterTimestamp = Date.now() + maxExecutionTime;
    const bestPath = [{ oldPos: -1, lastComponent: void 0 }];
    let newPos = this.extractCommon(bestPath[0], newTokens, oldTokens, 0, options);
    if (bestPath[0].oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
      return done(this.buildValues(bestPath[0].lastComponent, newTokens, oldTokens));
    }
    let minDiagonalToConsider = -Infinity, maxDiagonalToConsider = Infinity;
    const execEditLength = () => {
      for (let diagonalPath = Math.max(minDiagonalToConsider, -editLength); diagonalPath <= Math.min(maxDiagonalToConsider, editLength); diagonalPath += 2) {
        let basePath;
        const removePath = bestPath[diagonalPath - 1], addPath = bestPath[diagonalPath + 1];
        if (removePath) {
          bestPath[diagonalPath - 1] = void 0;
        }
        let canAdd = false;
        if (addPath) {
          const addPathNewPos = addPath.oldPos - diagonalPath;
          canAdd = addPath && 0 <= addPathNewPos && addPathNewPos < newLen;
        }
        const canRemove = removePath && removePath.oldPos + 1 < oldLen;
        if (!canAdd && !canRemove) {
          bestPath[diagonalPath] = void 0;
          continue;
        }
        if (!canRemove || canAdd && removePath.oldPos < addPath.oldPos) {
          basePath = this.addToPath(addPath, true, false, 0, options);
        } else {
          basePath = this.addToPath(removePath, false, true, 1, options);
        }
        newPos = this.extractCommon(basePath, newTokens, oldTokens, diagonalPath, options);
        if (basePath.oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
          return done(this.buildValues(basePath.lastComponent, newTokens, oldTokens)) || true;
        } else {
          bestPath[diagonalPath] = basePath;
          if (basePath.oldPos + 1 >= oldLen) {
            maxDiagonalToConsider = Math.min(maxDiagonalToConsider, diagonalPath - 1);
          }
          if (newPos + 1 >= newLen) {
            minDiagonalToConsider = Math.max(minDiagonalToConsider, diagonalPath + 1);
          }
        }
      }
      editLength++;
    };
    if (callback) {
      (function exec() {
        setTimeout(function() {
          if (editLength > maxEditLength || Date.now() > abortAfterTimestamp) {
            return callback(void 0);
          }
          if (!execEditLength()) {
            exec();
          }
        }, 0);
      })();
    } else {
      while (editLength <= maxEditLength && Date.now() <= abortAfterTimestamp) {
        const ret = execEditLength();
        if (ret) {
          return ret;
        }
      }
    }
  }
  addToPath(path, added, removed, oldPosInc, options) {
    const last = path.lastComponent;
    if (last && !options.oneChangePerToken && last.added === added && last.removed === removed) {
      return {
        oldPos: path.oldPos + oldPosInc,
        lastComponent: { count: last.count + 1, added, removed, previousComponent: last.previousComponent }
      };
    } else {
      return {
        oldPos: path.oldPos + oldPosInc,
        lastComponent: { count: 1, added, removed, previousComponent: last }
      };
    }
  }
  extractCommon(basePath, newTokens, oldTokens, diagonalPath, options) {
    const newLen = newTokens.length, oldLen = oldTokens.length;
    let oldPos = basePath.oldPos, newPos = oldPos - diagonalPath, commonCount = 0;
    while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(oldTokens[oldPos + 1], newTokens[newPos + 1], options)) {
      newPos++;
      oldPos++;
      commonCount++;
      if (options.oneChangePerToken) {
        basePath.lastComponent = { count: 1, previousComponent: basePath.lastComponent, added: false, removed: false };
      }
    }
    if (commonCount && !options.oneChangePerToken) {
      basePath.lastComponent = { count: commonCount, previousComponent: basePath.lastComponent, added: false, removed: false };
    }
    basePath.oldPos = oldPos;
    return newPos;
  }
  equals(left, right, options) {
    if (options.comparator) {
      return options.comparator(left, right);
    } else {
      return left === right || !!options.ignoreCase && left.toLowerCase() === right.toLowerCase();
    }
  }
  removeEmpty(array2) {
    const ret = [];
    for (let i = 0; i < array2.length; i++) {
      if (array2[i]) {
        ret.push(array2[i]);
      }
    }
    return ret;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  castInput(value, options) {
    return value;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tokenize(value, options) {
    return Array.from(value);
  }
  join(chars) {
    return chars.join("");
  }
  postProcess(changeObjects, options) {
    return changeObjects;
  }
  get useLongestToken() {
    return false;
  }
  buildValues(lastComponent, newTokens, oldTokens) {
    const components = [];
    let nextComponent;
    while (lastComponent) {
      components.push(lastComponent);
      nextComponent = lastComponent.previousComponent;
      delete lastComponent.previousComponent;
      lastComponent = nextComponent;
    }
    components.reverse();
    const componentLen = components.length;
    let componentPos = 0, newPos = 0, oldPos = 0;
    for (; componentPos < componentLen; componentPos++) {
      const component = components[componentPos];
      if (!component.removed) {
        if (!component.added && this.useLongestToken) {
          let value = newTokens.slice(newPos, newPos + component.count);
          value = value.map(function(value2, i) {
            const oldValue = oldTokens[oldPos + i];
            return oldValue.length > value2.length ? oldValue : value2;
          });
          component.value = this.join(value);
        } else {
          component.value = this.join(newTokens.slice(newPos, newPos + component.count));
        }
        newPos += component.count;
        if (!component.added) {
          oldPos += component.count;
        }
      } else {
        component.value = this.join(oldTokens.slice(oldPos, oldPos + component.count));
        oldPos += component.count;
      }
    }
    return components;
  }
};

// node_modules/diff/libesm/diff/array.js
var ArrayDiff = class extends Diff {
  tokenize(value) {
    return value.slice();
  }
  join(value) {
    return value;
  }
  removeEmpty(value) {
    return value;
  }
};
var arrayDiff = new ArrayDiff();
function diffArrays(oldArr, newArr, options) {
  return arrayDiff.diff(oldArr, newArr, options);
}

// src/utilities/noop.js
var noop = () => {
};
var noop_default = noop;

// src/common/end-of-line.js
var OPTION_CR = "cr";
var OPTION_CRLF = "crlf";
var OPTION_LF = "lf";
var DEFAULT_OPTION = OPTION_LF;
var CHARACTER_CR = "\r";
var CHARACTER_CRLF = "\r\n";
var CHARACTER_LF = "\n";
var DEFAULT_EOL = CHARACTER_LF;
function guessEndOfLine(text) {
  const index = text.indexOf(CHARACTER_CR);
  if (index !== -1) {
    return text.charAt(index + 1) === CHARACTER_LF ? OPTION_CRLF : OPTION_CR;
  }
  return DEFAULT_OPTION;
}
function convertEndOfLineOptionToCharacter(endOfLineOption) {
  return endOfLineOption === OPTION_CR ? CHARACTER_CR : endOfLineOption === OPTION_CRLF ? CHARACTER_CRLF : DEFAULT_EOL;
}
var regexps = /* @__PURE__ */ new Map([[CHARACTER_LF, /\n/g], [CHARACTER_CR, /\r/g], [CHARACTER_CRLF, /\r\n/g]]);
function countEndOfLineCharacters(text, endOfLineCharacter) {
  const regex = regexps.get(endOfLineCharacter);
  if (false) {
    noop_default(regex, `Unexpected 'endOfLineCharacter': ${JSON.stringify(endOfLineCharacter)}.`);
  }
  return text.match(regex)?.length ?? 0;
}
var END_OF_LINE_REGEXP = /\r\n?/g;
function normalizeEndOfLine(text) {
  return method_replace_all_default(
    /* OPTIONAL_OBJECT: false */
    0,
    text,
    END_OF_LINE_REGEXP,
    CHARACTER_LF
  );
}

// src/constants.js
var commentsPropertyInOptions = /* @__PURE__ */ Symbol.for("comments");

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

// node_modules/trim-newlines/index.js
function trimNewlinesEnd(string) {
  let end = string.length;
  while (end > 0 && (string[end - 1] === "\r" || string[end - 1] === "\n")) {
    end--;
  }
  return end < string.length ? string.slice(0, end) : string;
}

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

// src/document/utilities/traverse-doc.js
var traverseDocOnExitStackMarker = {};
function traverseDoc(doc, onEnter, onExit, shouldTraverseConditionalGroups) {
  const docsStack = [doc];
  while (docsStack.length > 0) {
    const doc2 = docsStack.pop();
    if (doc2 === traverseDocOnExitStackMarker) {
      onExit(docsStack.pop());
      continue;
    }
    if (onExit) {
      docsStack.push(doc2, traverseDocOnExitStackMarker);
    }
    const docType = get_doc_type_default(doc2);
    if (!docType) {
      throw new invalid_doc_error_default(doc2);
    }
    if (onEnter?.(doc2) === false) {
      continue;
    }
    switch (docType) {
      case DOC_TYPE_ARRAY:
      case DOC_TYPE_FILL: {
        const parts = docType === DOC_TYPE_ARRAY ? doc2 : doc2.parts;
        for (let ic = parts.length, i = ic - 1; i >= 0; --i) {
          docsStack.push(parts[i]);
        }
        break;
      }
      case DOC_TYPE_IF_BREAK:
        docsStack.push(doc2.flatContents, doc2.breakContents);
        break;
      case DOC_TYPE_GROUP:
        if (shouldTraverseConditionalGroups && doc2.expandedStates) {
          for (let ic = doc2.expandedStates.length, i = ic - 1; i >= 0; --i) {
            docsStack.push(doc2.expandedStates[i]);
          }
        } else {
          docsStack.push(doc2.contents);
        }
        break;
      case DOC_TYPE_ALIGN:
      case DOC_TYPE_INDENT:
      case DOC_TYPE_INDENT_IF_BREAK:
      case DOC_TYPE_LABEL:
      case DOC_TYPE_LINE_SUFFIX:
        docsStack.push(doc2.contents);
        break;
      case DOC_TYPE_STRING:
      case DOC_TYPE_CURSOR:
      case DOC_TYPE_TRIM:
      case DOC_TYPE_LINE_SUFFIX_BOUNDARY:
      case DOC_TYPE_LINE:
      case DOC_TYPE_BREAK_PARENT:
        break;
      default:
        throw new invalid_doc_error_default(doc2);
    }
  }
}
var traverse_doc_default = traverseDoc;

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
function findInDoc(doc, fn, defaultValue) {
  let result = defaultValue;
  let shouldSkipFurtherProcessing = false;
  function findInDocOnEnterFn(doc2) {
    if (shouldSkipFurtherProcessing) {
      return false;
    }
    const maybeResult = fn(doc2);
    if (maybeResult !== void 0) {
      shouldSkipFurtherProcessing = true;
      result = maybeResult;
    }
  }
  traverse_doc_default(doc, findInDocOnEnterFn);
  return result;
}
function willBreakFn(doc) {
  if (doc.type === DOC_TYPE_GROUP && doc.break) {
    return true;
  }
  if (doc.type === DOC_TYPE_LINE && doc.hard) {
    return true;
  }
  if (doc.type === DOC_TYPE_BREAK_PARENT) {
    return true;
  }
}
function willBreak(doc) {
  return findInDoc(doc, willBreakFn, false);
}
function breakParentGroup(groupStack) {
  if (groupStack.length > 0) {
    const parentGroup = method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      groupStack,
      -1
    );
    if (!parentGroup.expandedStates && !parentGroup.break) {
      parentGroup.break = "propagated";
    }
  }
  return null;
}
function propagateBreaks(doc) {
  const alreadyVisitedSet = /* @__PURE__ */ new Set();
  const groupStack = [];
  function propagateBreaksOnEnterFn(doc2) {
    if (doc2.type === DOC_TYPE_BREAK_PARENT) {
      breakParentGroup(groupStack);
    }
    if (doc2.type === DOC_TYPE_GROUP) {
      groupStack.push(doc2);
      if (alreadyVisitedSet.has(doc2)) {
        return false;
      }
      alreadyVisitedSet.add(doc2);
    }
  }
  function propagateBreaksOnExitFn(doc2) {
    if (doc2.type === DOC_TYPE_GROUP) {
      const group2 = groupStack.pop();
      if (group2.break) {
        breakParentGroup(groupStack);
      }
    }
  }
  traverse_doc_default(
    doc,
    propagateBreaksOnEnterFn,
    propagateBreaksOnExitFn,
    /* shouldTraverseConditionalGroups */
    true
  );
}
function removeLinesFn(doc) {
  if (doc.type === DOC_TYPE_LINE && !doc.hard) {
    return doc.soft ? "" : " ";
  }
  if (doc.type === DOC_TYPE_IF_BREAK) {
    return doc.flatContents;
  }
  return doc;
}
function removeLines(doc) {
  return mapDoc(doc, removeLinesFn);
}
function stripTrailingHardlineFromParts(parts) {
  parts = [...parts];
  while (parts.length >= 2 && method_at_default(
    /* OPTIONAL_OBJECT: false */
    0,
    parts,
    -2
  ).type === DOC_TYPE_LINE && method_at_default(
    /* OPTIONAL_OBJECT: false */
    0,
    parts,
    -1
  ).type === DOC_TYPE_BREAK_PARENT) {
    parts.length -= 2;
  }
  if (parts.length > 0) {
    const lastPart = stripTrailingHardlineFromDoc(method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      parts,
      -1
    ));
    parts[parts.length - 1] = lastPart;
  }
  return parts;
}
function stripTrailingHardlineFromDoc(doc) {
  switch (get_doc_type_default(doc)) {
    case DOC_TYPE_INDENT:
    case DOC_TYPE_INDENT_IF_BREAK:
    case DOC_TYPE_GROUP:
    case DOC_TYPE_LINE_SUFFIX:
    case DOC_TYPE_LABEL: {
      const contents = stripTrailingHardlineFromDoc(doc.contents);
      return {
        ...doc,
        contents
      };
    }
    case DOC_TYPE_IF_BREAK:
      return {
        ...doc,
        breakContents: stripTrailingHardlineFromDoc(doc.breakContents),
        flatContents: stripTrailingHardlineFromDoc(doc.flatContents)
      };
    case DOC_TYPE_FILL:
      return {
        ...doc,
        parts: stripTrailingHardlineFromParts(doc.parts)
      };
    case DOC_TYPE_ARRAY:
      return stripTrailingHardlineFromParts(doc);
    case DOC_TYPE_STRING:
      return trimNewlinesEnd(doc);
    case DOC_TYPE_ALIGN:
    case DOC_TYPE_CURSOR:
    case DOC_TYPE_TRIM:
    case DOC_TYPE_LINE_SUFFIX_BOUNDARY:
    case DOC_TYPE_LINE:
    case DOC_TYPE_BREAK_PARENT:
      break;
    default:
      throw new invalid_doc_error_default(doc);
  }
  return doc;
}
function stripTrailingHardline(doc) {
  return stripTrailingHardlineFromDoc(cleanDoc(doc));
}
function cleanDocFn(doc) {
  switch (get_doc_type_default(doc)) {
    case DOC_TYPE_FILL: {
      const {
        parts
      } = doc;
      if (parts.every((part) => part === "")) {
        return "";
      }
      if (parts.length === 1) {
        return parts[0];
      }
      break;
    }
    case DOC_TYPE_GROUP:
      if (!doc.contents && !doc.id && !doc.break && !doc.expandedStates) {
        return "";
      }
      if (doc.contents.type === DOC_TYPE_GROUP && doc.contents.id === doc.id && doc.contents.break === doc.break && doc.contents.expandedStates === doc.expandedStates) {
        return doc.contents;
      }
      break;
    case DOC_TYPE_ALIGN:
    case DOC_TYPE_INDENT:
    case DOC_TYPE_INDENT_IF_BREAK:
    case DOC_TYPE_LINE_SUFFIX:
      if (!doc.contents) {
        return "";
      }
      break;
    case DOC_TYPE_IF_BREAK:
      if (!doc.flatContents && !doc.breakContents) {
        return "";
      }
      break;
    case DOC_TYPE_ARRAY: {
      const parts = [];
      for (const part of doc) {
        if (!part) {
          continue;
        }
        const [currentPart, ...restParts] = Array.isArray(part) ? part : [part];
        if (typeof currentPart === "string" && typeof method_at_default(
          /* OPTIONAL_OBJECT: false */
          0,
          parts,
          -1
        ) === "string") {
          parts[parts.length - 1] += currentPart;
        } else {
          parts.push(currentPart);
        }
        parts.push(...restParts);
      }
      if (parts.length === 0) {
        return "";
      }
      if (parts.length === 1) {
        return parts[0];
      }
      return parts;
    }
    case DOC_TYPE_STRING:
    case DOC_TYPE_CURSOR:
    case DOC_TYPE_TRIM:
    case DOC_TYPE_LINE_SUFFIX_BOUNDARY:
    case DOC_TYPE_LINE:
    case DOC_TYPE_LABEL:
    case DOC_TYPE_BREAK_PARENT:
      break;
    default:
      throw new invalid_doc_error_default(doc);
  }
  return doc;
}
function cleanDoc(doc) {
  return mapDoc(doc, (currentDoc) => cleanDocFn(currentDoc));
}
function replaceEndOfLine(doc, replacement = literalline) {
  return mapDoc(doc, (currentDoc) => typeof currentDoc === "string" ? join(replacement, currentDoc.split("\n")) : currentDoc);
}
function canBreakFn(doc) {
  if (doc.type === DOC_TYPE_LINE) {
    return true;
  }
}
function canBreak(doc) {
  return findInDoc(doc, canBreakFn, false);
}
function inheritLabel(doc, fn) {
  return doc.type === DOC_TYPE_LABEL ? {
    ...doc,
    contents: fn(doc.contents)
  } : fn(doc);
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
function markAsRoot(contents) {
  return align({ type: "root" }, contents);
}
function dedent(contents) {
  return align(-1, contents);
}
function addAlignmentToDoc(doc, size, tabWidth) {
  assertDoc(doc);
  let aligned = doc;
  if (size > 0) {
    for (let level = 0; level < Math.floor(size / tabWidth); ++level) {
      aligned = indent(aligned);
    }
    aligned = align(size % tabWidth, aligned);
    aligned = align(Number.NEGATIVE_INFINITY, aligned);
  }
  return aligned;
}

// src/document/builders/break-parent.js
var breakParent = { type: DOC_TYPE_BREAK_PARENT };

// src/document/builders/cursor.js
var cursor = { type: DOC_TYPE_CURSOR };

// src/document/builders/fill.js
function fill(parts) {
  assertDocFillParts(parts);
  return { type: DOC_TYPE_FILL, parts };
}

// src/document/builders/group.js
function group(contents, options = {}) {
  assertDoc(contents);
  assertDocArray(
    options.expandedStates,
    /* optional */
    true
  );
  return {
    type: DOC_TYPE_GROUP,
    id: options.id,
    contents,
    break: Boolean(options.shouldBreak),
    expandedStates: options.expandedStates
  };
}
function conditionalGroup(states, options) {
  return group(states[0], { ...options, expandedStates: states });
}

// src/document/builders/if-break.js
function ifBreak(breakContents, flatContents = "", options = {}) {
  assertDoc(breakContents);
  if (flatContents !== "") {
    assertDoc(flatContents);
  }
  return {
    type: DOC_TYPE_IF_BREAK,
    breakContents,
    flatContents,
    groupId: options.groupId
  };
}

// src/document/builders/indent-if-break.js
function indentIfBreak(contents, options) {
  assertDoc(contents);
  return {
    type: DOC_TYPE_INDENT_IF_BREAK,
    contents,
    groupId: options.groupId,
    negate: options.negate
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

// src/document/builders/label.js
function label(label2, contents) {
  assertDoc(contents);
  return label2 ? { type: DOC_TYPE_LABEL, label: label2, contents } : contents;
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

// src/document/builders/line-suffix.js
function lineSuffix(contents) {
  assertDoc(contents);
  return { type: DOC_TYPE_LINE_SUFFIX, contents };
}

// src/document/builders/line-suffix-boundary.js
var lineSuffixBoundary = { type: DOC_TYPE_LINE_SUFFIX_BOUNDARY };

// src/document/builders/trim.js
var trim = { type: DOC_TYPE_TRIM };

// src/document/debug.js
function flattenDoc(doc) {
  if (!doc) {
    return "";
  }
  if (Array.isArray(doc)) {
    const res = [];
    for (const part of doc) {
      if (Array.isArray(part)) {
        res.push(...flattenDoc(part));
      } else {
        const flattened = flattenDoc(part);
        if (flattened !== "") {
          res.push(flattened);
        }
      }
    }
    return res;
  }
  if (doc.type === DOC_TYPE_IF_BREAK) {
    return {
      ...doc,
      breakContents: flattenDoc(doc.breakContents),
      flatContents: flattenDoc(doc.flatContents)
    };
  }
  if (doc.type === DOC_TYPE_GROUP) {
    return {
      ...doc,
      contents: flattenDoc(doc.contents),
      expandedStates: doc.expandedStates?.map(flattenDoc)
    };
  }
  if (doc.type === DOC_TYPE_FILL) {
    return { type: "fill", parts: doc.parts.map(flattenDoc) };
  }
  if (doc.contents) {
    return { ...doc, contents: flattenDoc(doc.contents) };
  }
  return doc;
}
function printDocToDebug(doc) {
  const printedSymbols = /* @__PURE__ */ Object.create(null);
  const usedKeysForSymbols = /* @__PURE__ */ new Set();
  return printDoc(flattenDoc(doc));
  function printDoc(doc2, index, parentParts) {
    if (typeof doc2 === "string") {
      return JSON.stringify(doc2);
    }
    if (Array.isArray(doc2)) {
      const printed = doc2.map(printDoc).filter(Boolean);
      return printed.length === 1 ? printed[0] : `[${printed.join(", ")}]`;
    }
    if (doc2.type === DOC_TYPE_LINE) {
      const withBreakParent = parentParts?.[index + 1]?.type === DOC_TYPE_BREAK_PARENT;
      if (doc2.literal) {
        return withBreakParent ? "literalline" : "literallineWithoutBreakParent";
      }
      if (doc2.hard) {
        return withBreakParent ? "hardline" : "hardlineWithoutBreakParent";
      }
      if (doc2.soft) {
        return "softline";
      }
      return "line";
    }
    if (doc2.type === DOC_TYPE_BREAK_PARENT) {
      const afterHardline = parentParts?.[index - 1]?.type === DOC_TYPE_LINE && parentParts[index - 1].hard;
      return afterHardline ? void 0 : "breakParent";
    }
    if (doc2.type === DOC_TYPE_TRIM) {
      return "trim";
    }
    if (doc2.type === DOC_TYPE_INDENT) {
      return "indent(" + printDoc(doc2.contents) + ")";
    }
    if (doc2.type === DOC_TYPE_ALIGN) {
      return doc2.n === Number.NEGATIVE_INFINITY ? "dedentToRoot(" + printDoc(doc2.contents) + ")" : doc2.n < 0 ? "dedent(" + printDoc(doc2.contents) + ")" : doc2.n.type === "root" ? "markAsRoot(" + printDoc(doc2.contents) + ")" : "align(" + JSON.stringify(doc2.n) + ", " + printDoc(doc2.contents) + ")";
    }
    if (doc2.type === DOC_TYPE_IF_BREAK) {
      return "ifBreak(" + printDoc(doc2.breakContents) + (doc2.flatContents ? ", " + printDoc(doc2.flatContents) : "") + (doc2.groupId ? (!doc2.flatContents ? ', ""' : "") + `, { groupId: ${printGroupId(doc2.groupId)} }` : "") + ")";
    }
    if (doc2.type === DOC_TYPE_INDENT_IF_BREAK) {
      const optionsParts = [];
      if (doc2.negate) {
        optionsParts.push("negate: true");
      }
      if (doc2.groupId) {
        optionsParts.push(`groupId: ${printGroupId(doc2.groupId)}`);
      }
      const options = optionsParts.length > 0 ? `, { ${optionsParts.join(", ")} }` : "";
      return `indentIfBreak(${printDoc(doc2.contents)}${options})`;
    }
    if (doc2.type === DOC_TYPE_GROUP) {
      const optionsParts = [];
      if (doc2.break && doc2.break !== "propagated") {
        optionsParts.push("shouldBreak: true");
      }
      if (doc2.id) {
        optionsParts.push(`id: ${printGroupId(doc2.id)}`);
      }
      const options = optionsParts.length > 0 ? `, { ${optionsParts.join(", ")} }` : "";
      if (doc2.expandedStates) {
        return `conditionalGroup([${doc2.expandedStates.map((part) => printDoc(part)).join(",")}]${options})`;
      }
      return `group(${printDoc(doc2.contents)}${options})`;
    }
    if (doc2.type === DOC_TYPE_FILL) {
      return `fill([${doc2.parts.map((part) => printDoc(part)).join(", ")}])`;
    }
    if (doc2.type === DOC_TYPE_LINE_SUFFIX) {
      return "lineSuffix(" + printDoc(doc2.contents) + ")";
    }
    if (doc2.type === DOC_TYPE_LINE_SUFFIX_BOUNDARY) {
      return "lineSuffixBoundary";
    }
    if (doc2.type === DOC_TYPE_LABEL) {
      return `label(${JSON.stringify(doc2.label)}, ${printDoc(doc2.contents)})`;
    }
    if (doc2.type === DOC_TYPE_CURSOR) {
      return "cursor";
    }
    throw new Error("Unknown doc type " + doc2.type);
  }
  function printGroupId(id) {
    if (typeof id !== "symbol") {
      return JSON.stringify(String(id));
    }
    if (id in printedSymbols) {
      return printedSymbols[id];
    }
    const prefix = id.description || "symbol";
    for (let counter = 0; ; counter++) {
      const key = prefix + (counter > 0 ? ` #${counter}` : "");
      if (!usedKeysForSymbols.has(key)) {
        usedKeysForSymbols.add(key);
        return printedSymbols[id] = `Symbol.for(${JSON.stringify(key)})`;
      }
    }
  }
}

// node_modules/emoji-regex/index.mjs
var emoji_regex_default = () => {
  return /[#*0-9]\uFE0F?\u20E3|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26AA\u26B0\u26B1\u26BD\u26BE\u26C4\u26C8\u26CF\u26D1\u26E9\u26F0-\u26F5\u26F7\u26F8\u26FA\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B55\u3030\u303D\u3297\u3299]\uFE0F?|[\u261D\u270C\u270D](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\u270A\u270B](?:\uD83C[\uDFFB-\uDFFF])?|[\u23E9-\u23EC\u23F0\u23F3\u25FD\u2693\u26A1\u26AB\u26C5\u26CE\u26D4\u26EA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2795-\u2797\u27B0\u27BF\u2B50]|\u26D3\uFE0F?(?:\u200D\uD83D\uDCA5)?|\u26F9(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\u2764\uFE0F?(?:\u200D(?:\uD83D\uDD25|\uD83E\uDE79))?|\uD83C(?:[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]\uFE0F?|[\uDF85\uDFC2\uDFC7](?:\uD83C[\uDFFB-\uDFFF])?|[\uDFC4\uDFCA](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDFCB\uDFCC](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF43\uDF45-\uDF4A\uDF4C-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|\uDF44(?:\u200D\uD83D\uDFEB)?|\uDF4B(?:\u200D\uD83D\uDFE9)?|\uDFC3(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDFF3\uFE0F?(?:\u200D(?:\u26A7\uFE0F?|\uD83C\uDF08))?|\uDFF4(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDC73\uDB40\uDC63\uDB40\uDC74|\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F)?)|\uD83D(?:[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3]\uFE0F?|[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC6E-\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4\uDEB5](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD74\uDD90](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC25\uDC27-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE41\uDE43\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED8\uDEDC-\uDEDF\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uDC08(?:\u200D\u2B1B)?|\uDC15(?:\u200D\uD83E\uDDBA)?|\uDC26(?:\u200D(?:\u2B1B|\uD83D\uDD25))?|\uDC3B(?:\u200D\u2744\uFE0F?)?|\uDC41\uFE0F?(?:\u200D\uD83D\uDDE8\uFE0F?)?|\uDC68(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDC68\uDC69]\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?))?|\uDC69(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?[\uDC68\uDC69]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?))|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFC-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFC-\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFD-\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFD\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFE])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFE]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFE])))?))?|\uDD75(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDE2E(?:\u200D\uD83D\uDCA8)?|\uDE35(?:\u200D\uD83D\uDCAB)?|\uDE36(?:\u200D\uD83C\uDF2B\uFE0F?)?|\uDE42(?:\u200D[\u2194\u2195]\uFE0F?)?|\uDEB6(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?)|\uD83E(?:[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5\uDEC3-\uDEC5\uDEF0\uDEF2-\uDEF8](?:\uD83C[\uDFFB-\uDFFF])?|[\uDD26\uDD35\uDD37-\uDD39\uDD3C-\uDD3E\uDDB8\uDDB9\uDDCD\uDDCF\uDDD4\uDDD6-\uDDDD](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDDDE\uDDDF](?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD0D\uDD0E\uDD10-\uDD17\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCC\uDDD0\uDDE0-\uDDFF\uDE70-\uDE7C\uDE80-\uDE8A\uDE8E-\uDEC2\uDEC6\uDEC8\uDECD-\uDEDC\uDEDF-\uDEEA\uDEEF]|\uDDCE(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDDD1(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1|\uDDD1\u200D\uD83E\uDDD2(?:\u200D\uD83E\uDDD2)?|\uDDD2(?:\u200D\uD83E\uDDD2)?))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE])))?))?|\uDEF1(?:\uD83C(?:\uDFFB(?:\u200D\uD83E\uDEF2\uD83C[\uDFFC-\uDFFF])?|\uDFFC(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFD-\uDFFF])?|\uDFFD(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])?|\uDFFE(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFD\uDFFF])?|\uDFFF(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFE])?))?)/g;
};

// node_modules/get-east-asian-width/lookup-data.js
var fullwidthMinimalCodePoint = 12288;
var fullwidthMaximumCodePoint = 65510;
var fullwidthRanges = [12288, 12288, 65281, 65376, 65504, 65510];
var wideMinimalCodePoint = 4352;
var wideMaximumCodePoint = 262141;
var wideRanges = [4352, 4447, 8986, 8987, 9001, 9002, 9193, 9196, 9200, 9200, 9203, 9203, 9725, 9726, 9748, 9749, 9776, 9783, 9800, 9811, 9855, 9855, 9866, 9871, 9875, 9875, 9889, 9889, 9898, 9899, 9917, 9918, 9924, 9925, 9934, 9934, 9940, 9940, 9962, 9962, 9970, 9971, 9973, 9973, 9978, 9978, 9981, 9981, 9989, 9989, 9994, 9995, 10024, 10024, 10060, 10060, 10062, 10062, 10067, 10069, 10071, 10071, 10133, 10135, 10160, 10160, 10175, 10175, 11035, 11036, 11088, 11088, 11093, 11093, 11904, 11929, 11931, 12019, 12032, 12245, 12272, 12287, 12289, 12350, 12353, 12438, 12441, 12543, 12549, 12591, 12593, 12686, 12688, 12773, 12783, 12830, 12832, 12871, 12880, 42124, 42128, 42182, 43360, 43388, 44032, 55203, 63744, 64255, 65040, 65049, 65072, 65106, 65108, 65126, 65128, 65131, 94176, 94180, 94192, 94198, 94208, 101589, 101631, 101662, 101760, 101874, 110576, 110579, 110581, 110587, 110589, 110590, 110592, 110882, 110898, 110898, 110928, 110930, 110933, 110933, 110948, 110951, 110960, 111355, 119552, 119638, 119648, 119670, 126980, 126980, 127183, 127183, 127374, 127374, 127377, 127386, 127488, 127490, 127504, 127547, 127552, 127560, 127568, 127569, 127584, 127589, 127744, 127776, 127789, 127797, 127799, 127868, 127870, 127891, 127904, 127946, 127951, 127955, 127968, 127984, 127988, 127988, 127992, 128062, 128064, 128064, 128066, 128252, 128255, 128317, 128331, 128334, 128336, 128359, 128378, 128378, 128405, 128406, 128420, 128420, 128507, 128591, 128640, 128709, 128716, 128716, 128720, 128722, 128725, 128728, 128732, 128735, 128747, 128748, 128756, 128764, 128992, 129003, 129008, 129008, 129292, 129338, 129340, 129349, 129351, 129535, 129648, 129660, 129664, 129674, 129678, 129734, 129736, 129736, 129741, 129756, 129759, 129770, 129775, 129784, 131072, 196605, 196608, 262141];

// node_modules/get-east-asian-width/utilities.js
var isInRange = (ranges, codePoint) => {
  let low = 0;
  let high = Math.floor(ranges.length / 2) - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const i = mid * 2;
    if (codePoint < ranges[i]) {
      high = mid - 1;
    } else if (codePoint > ranges[i + 1]) {
      low = mid + 1;
    } else {
      return true;
    }
  }
  return false;
};

// node_modules/get-east-asian-width/lookup.js
var commonCjkCodePoint = 19968;
var [wideFastPathStart, wideFastPathEnd] = /* @__PURE__ */ findWideFastPathRange(wideRanges);
function findWideFastPathRange(ranges) {
  let fastPathStart = ranges[0];
  let fastPathEnd = ranges[1];
  for (let index = 0; index < ranges.length; index += 2) {
    const start = ranges[index];
    const end = ranges[index + 1];
    if (commonCjkCodePoint >= start && commonCjkCodePoint <= end) {
      return [start, end];
    }
    if (end - start > fastPathEnd - fastPathStart) {
      fastPathStart = start;
      fastPathEnd = end;
    }
  }
  return [fastPathStart, fastPathEnd];
}
var isFullWidth = (codePoint) => {
  if (codePoint < fullwidthMinimalCodePoint || codePoint > fullwidthMaximumCodePoint) {
    return false;
  }
  return isInRange(fullwidthRanges, codePoint);
};
var isWide = (codePoint) => {
  if (codePoint >= wideFastPathStart && codePoint <= wideFastPathEnd) {
    return true;
  }
  if (codePoint < wideMinimalCodePoint || codePoint > wideMaximumCodePoint) {
    return false;
  }
  return isInRange(wideRanges, codePoint);
};

// node_modules/narrow-emojis/index.js
var narrowEmojiRegexp = /^(?:[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u2600-\u2604\u260E\u2611\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26B0\u26B1\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0\u26F1\u26F4\u26F7\u26F8\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2763\u2764\u27A1\u2934\u2935\u2B05-\u2B07]|\uD83C[\uDD70\uDD71\uDD7E\uDD7F\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF3\uDFF5\uDFF7]|\uD83D[\uDC3F\uDC41\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3])$/;
var isNarrowEmojiCharacter = (character) => narrowEmojiRegexp.test(character);

// src/utilities/get-string-width.js
var notAsciiRegex = /[^\x20-\x7F]/;
function getStringWidth(text) {
  if (!text) {
    return 0;
  }
  if (!notAsciiRegex.test(text)) {
    return text.length;
  }
  let width = 0;
  text = text.replace(emoji_regex_default(), (character) => {
    width += isNarrowEmojiCharacter(character) ? 1 : 2;
    return "";
  });
  for (const character of text) {
    const codePoint = character.codePointAt(0);
    if (codePoint <= 31 || codePoint >= 127 && codePoint <= 159) {
      continue;
    }
    if (codePoint >= 768 && codePoint <= 879) {
      continue;
    }
    if (codePoint >= 65024 && codePoint <= 65039) {
      continue;
    }
    width += isFullWidth(codePoint) || isWide(codePoint) ? 2 : 1;
  }
  return width;
}
var get_string_width_default = getStringWidth;

// src/document/printer/indent.js
var INDENT_COMMAND_TYPE_INDENT = 0;
var INDENT_COMMAND_TYPE_DEDENT = 1;
var INDENT_COMMAND_TYPE_WIDTH = 2;
var INDENT_COMMAND_TYPE_STRING = 3;
var INDENT_COMMAND_INDENT = { type: INDENT_COMMAND_TYPE_INDENT };
var INDENT_COMMAND_DEDENT = { type: INDENT_COMMAND_TYPE_DEDENT };
var ROOT_INDENT = {
  value: "",
  length: 0,
  queue: [],
  get root() {
    return ROOT_INDENT;
  }
};
function generateIndent(indent2, command, options) {
  const queue = command.type === INDENT_COMMAND_TYPE_DEDENT ? indent2.queue.slice(0, -1) : [...indent2.queue, command];
  let value = "";
  let length = 0;
  let lastTabs = 0;
  let lastSpaces = 0;
  for (const command2 of queue) {
    switch (command2.type) {
      case INDENT_COMMAND_TYPE_INDENT:
        flush();
        if (options.useTabs) {
          addTabs(1);
        } else {
          addSpaces(options.tabWidth);
        }
        break;
      case INDENT_COMMAND_TYPE_STRING: {
        const { string } = command2;
        flush();
        value += string;
        length += string.length;
        break;
      }
      case INDENT_COMMAND_TYPE_WIDTH: {
        const { width } = command2;
        lastTabs += 1;
        lastSpaces += width;
        break;
      }
      default:
        throw new Error(`Unexpected indent comment '${command2.type}'.`);
    }
  }
  flushSpaces();
  return { ...indent2, value, length, queue };
  function addTabs(count) {
    value += "	".repeat(count);
    length += options.tabWidth * count;
  }
  function addSpaces(count) {
    value += " ".repeat(count);
    length += count;
  }
  function flush() {
    if (options.useTabs) {
      flushTabs();
    } else {
      flushSpaces();
    }
  }
  function flushTabs() {
    if (lastTabs > 0) {
      addTabs(lastTabs);
    }
    resetLast();
  }
  function flushSpaces() {
    if (lastSpaces > 0) {
      addSpaces(lastSpaces);
    }
    resetLast();
  }
  function resetLast() {
    lastTabs = 0;
    lastSpaces = 0;
  }
}
function makeAlign(indent2, indentOptions, options) {
  if (!indentOptions) {
    return indent2;
  }
  if (indentOptions.type === "root") {
    return { ...indent2, root: indent2 };
  }
  if (indentOptions === Number.NEGATIVE_INFINITY) {
    return indent2.root;
  }
  let command;
  if (typeof indentOptions === "number") {
    if (indentOptions < 0) {
      command = INDENT_COMMAND_DEDENT;
    } else {
      command = { type: INDENT_COMMAND_TYPE_WIDTH, width: indentOptions };
    }
  } else {
    command = { type: INDENT_COMMAND_TYPE_STRING, string: indentOptions };
  }
  return generateIndent(indent2, command, options);
}
function makeIndent(indent2, options) {
  return generateIndent(indent2, INDENT_COMMAND_INDENT, options);
}

// src/document/printer/trim-indentation.js
function getTrailingIndentionLength(text) {
  let length = 0;
  for (let index = text.length - 1; index >= 0; index--) {
    const character = text[index];
    if (character === " " || character === "	") {
      length++;
    } else {
      break;
    }
  }
  return length;
}
function trimIndentation(text) {
  const length = getTrailingIndentionLength(text);
  const trimmed = length === 0 ? text : text.slice(0, text.length - length);
  return { text: trimmed, count: length };
}

// src/document/printer/print-result.js
var printResult = class {
  /** @type {string[]} */
  #settledTexts = [];
  #unsettledText = "";
  #settledTextLength = 0;
  /** @type {number[]} */
  #settledPositions = [];
  /** @type {number[]} */
  #unsettledPositions = [];
  #settle() {
    const text = this.#unsettledText;
    if (text !== "") {
      this.#settledTexts.push(text);
      this.#settledTextLength += text.length;
      this.#unsettledText = "";
    }
    for (const position of this.#unsettledPositions) {
      this.#settledPositions.push(Math.min(position, this.#settledTextLength));
    }
    this.#unsettledPositions.length = 0;
  }
  markPosition() {
    if (this.#settledPositions.length + this.#unsettledPositions.length >= 2) {
      throw new Error("There are too many 'cursor' in doc.");
    }
    this.#unsettledPositions.push(
      this.#settledTextLength + this.#unsettledText.length
    );
  }
  /**
  @param {string} text
  */
  write(text) {
    this.#unsettledText += text;
  }
  trim() {
    const { text: trimmed, count } = trimIndentation(this.#unsettledText);
    this.#unsettledText = trimmed;
    this.#settle();
    return count;
  }
  finish() {
    this.#settle();
    return {
      text: this.#settledTexts.join(""),
      positions: this.#settledPositions
    };
  }
};
var print_result_default = printResult;

// src/document/printer/printer.js
var MODE_BREAK = /* @__PURE__ */ Symbol("MODE_BREAK");
var MODE_FLAT = /* @__PURE__ */ Symbol("MODE_FLAT");
var DOC_FILL_PRINTED_LENGTH = /* @__PURE__ */ Symbol("DOC_FILL_PRINTED_LENGTH");
function fits(next, restCommands, remainingWidth, hasLineSuffix, groupModeMap, mustBeFlat) {
  if (remainingWidth === Number.POSITIVE_INFINITY) {
    return true;
  }
  let restCommandsIndex = restCommands.length;
  let hasPendingSpace = false;
  const commands = [next];
  let output = "";
  while (remainingWidth >= 0) {
    if (commands.length === 0) {
      if (restCommandsIndex === 0) {
        return true;
      }
      commands.push(restCommands[--restCommandsIndex]);
      continue;
    }
    const {
      mode,
      doc
    } = commands.pop();
    const docType = get_doc_type_default(doc);
    switch (docType) {
      case DOC_TYPE_STRING:
        if (doc) {
          if (hasPendingSpace) {
            output += " ";
            remainingWidth -= 1;
            hasPendingSpace = false;
          }
          output += doc;
          remainingWidth -= get_string_width_default(doc);
        }
        break;
      case DOC_TYPE_ARRAY:
      case DOC_TYPE_FILL: {
        const parts = docType === DOC_TYPE_ARRAY ? doc : doc.parts;
        const end = doc[DOC_FILL_PRINTED_LENGTH] ?? 0;
        for (let index = parts.length - 1; index >= end; index--) {
          commands.push({
            mode,
            doc: parts[index]
          });
        }
        break;
      }
      case DOC_TYPE_INDENT:
      case DOC_TYPE_ALIGN:
      case DOC_TYPE_INDENT_IF_BREAK:
      case DOC_TYPE_LABEL:
        commands.push({
          mode,
          doc: doc.contents
        });
        break;
      case DOC_TYPE_TRIM: {
        const {
          text,
          count
        } = trimIndentation(output);
        output = text;
        remainingWidth += count;
        break;
      }
      case DOC_TYPE_GROUP: {
        if (mustBeFlat && doc.break) {
          return false;
        }
        const groupMode = doc.break ? MODE_BREAK : mode;
        const contents = doc.expandedStates && groupMode === MODE_BREAK ? method_at_default(
          /* OPTIONAL_OBJECT: false */
          0,
          doc.expandedStates,
          -1
        ) : doc.contents;
        commands.push({
          mode: groupMode,
          doc: contents
        });
        break;
      }
      case DOC_TYPE_IF_BREAK: {
        const groupMode = doc.groupId ? groupModeMap[doc.groupId] || MODE_FLAT : mode;
        const contents = groupMode === MODE_BREAK ? doc.breakContents : doc.flatContents;
        if (contents) {
          commands.push({
            mode,
            doc: contents
          });
        }
        break;
      }
      case DOC_TYPE_LINE:
        if (mode === MODE_BREAK || doc.hard) {
          return true;
        }
        if (!doc.soft) {
          hasPendingSpace = true;
        }
        break;
      case DOC_TYPE_LINE_SUFFIX:
        hasLineSuffix = true;
        break;
      case DOC_TYPE_LINE_SUFFIX_BOUNDARY:
        if (hasLineSuffix) {
          return false;
        }
        break;
    }
  }
  return false;
}
function printDocToString(doc, options) {
  const groupModeMap = /* @__PURE__ */ Object.create(null);
  const width = options.printWidth;
  const newLine = convertEndOfLineOptionToCharacter(options.endOfLine);
  let position = 0;
  const commands = [{
    indent: ROOT_INDENT,
    mode: MODE_BREAK,
    doc
  }];
  let shouldRemeasure = false;
  const lineSuffix2 = [];
  const result = new print_result_default();
  propagateBreaks(doc);
  while (commands.length > 0) {
    const {
      indent: indent2,
      mode,
      doc: doc2
    } = commands.pop();
    switch (get_doc_type_default(doc2)) {
      case DOC_TYPE_STRING: {
        const formatted2 = newLine !== "\n" ? method_replace_all_default(
          /* OPTIONAL_OBJECT: false */
          0,
          doc2,
          "\n",
          newLine
        ) : doc2;
        if (formatted2) {
          result.write(formatted2);
          if (commands.length > 0) {
            position += get_string_width_default(formatted2);
          }
        }
        break;
      }
      case DOC_TYPE_ARRAY:
        for (let index = doc2.length - 1; index >= 0; index--) {
          commands.push({
            indent: indent2,
            mode,
            doc: doc2[index]
          });
        }
        break;
      case DOC_TYPE_CURSOR:
        result.markPosition();
        break;
      case DOC_TYPE_INDENT:
        commands.push({
          indent: makeIndent(indent2, options),
          mode,
          doc: doc2.contents
        });
        break;
      case DOC_TYPE_ALIGN:
        commands.push({
          indent: makeAlign(indent2, doc2.n, options),
          mode,
          doc: doc2.contents
        });
        break;
      case DOC_TYPE_TRIM:
        position -= result.trim();
        break;
      case DOC_TYPE_GROUP: {
        const command = (function printGroup() {
          if (mode === MODE_FLAT && !shouldRemeasure) {
            return {
              indent: indent2,
              mode: doc2.break ? MODE_BREAK : MODE_FLAT,
              doc: doc2.contents
            };
          }
          shouldRemeasure = false;
          const remainingWidth = width - position;
          const hasLineSuffix = lineSuffix2.length > 0;
          const flatCommand = {
            indent: indent2,
            mode: MODE_FLAT,
            doc: doc2.contents
          };
          if (!doc2.break && fits(flatCommand, commands, remainingWidth, hasLineSuffix, groupModeMap)) {
            return flatCommand;
          }
          if (!doc2.expandedStates) {
            return {
              indent: indent2,
              mode: MODE_BREAK,
              doc: doc2.contents
            };
          }
          if (!doc2.break) {
            for (let index = 1; index < doc2.expandedStates.length - 1; index++) {
              const flatCommand2 = {
                indent: indent2,
                mode: MODE_FLAT,
                doc: doc2.expandedStates[index]
              };
              if (fits(flatCommand2, commands, remainingWidth, hasLineSuffix, groupModeMap)) {
                return flatCommand2;
              }
            }
          }
          return {
            indent: indent2,
            mode: MODE_BREAK,
            doc: method_at_default(
              /* OPTIONAL_OBJECT: false */
              0,
              doc2.expandedStates,
              -1
            )
          };
        })();
        commands.push(command);
        if (doc2.id) {
          groupModeMap[doc2.id] = command.mode;
        }
        break;
      }
      // Fills each line with as much code as possible before moving to a new
      // line with the same indentation.
      //
      // Expects doc.parts to be an array of alternating content and
      // whitespace. The whitespace contains the linebreaks.
      //
      // For example:
      //   ["I", line, "love", line, "monkeys"]
      // or
      //   [{ type: group, ... }, softline, { type: group, ... }]
      //
      // It uses this parts structure to handle three main layout cases:
      // * The first two content items fit on the same line without
      //   breaking
      //   -> output the first content item and the whitespace "flat".
      // * Only the first content item fits on the line without breaking
      //   -> output the first content item "flat" and the whitespace with
      //   "break".
      // * Neither content item fits on the line without breaking
      //   -> output the first content item and the whitespace with "break".
      case DOC_TYPE_FILL: {
        const remainingWidth = width - position;
        const offset = doc2[DOC_FILL_PRINTED_LENGTH] ?? 0;
        const {
          parts
        } = doc2;
        const length = parts.length - offset;
        if (length === 0) {
          break;
        }
        const content = parts[offset + 0];
        const whitespace = parts[offset + 1];
        const contentFlatCommand = {
          indent: indent2,
          mode: MODE_FLAT,
          doc: content
        };
        const contentBreakCommand = {
          indent: indent2,
          mode: MODE_BREAK,
          doc: content
        };
        const contentFits = fits(contentFlatCommand, [], remainingWidth, lineSuffix2.length > 0, groupModeMap, true);
        if (length === 1) {
          if (contentFits) {
            commands.push(contentFlatCommand);
          } else {
            commands.push(contentBreakCommand);
          }
          break;
        }
        const whitespaceFlatCommand = {
          indent: indent2,
          mode: MODE_FLAT,
          doc: whitespace
        };
        const whitespaceBreakCommand = {
          indent: indent2,
          mode: MODE_BREAK,
          doc: whitespace
        };
        if (length === 2) {
          if (contentFits) {
            commands.push(whitespaceFlatCommand, contentFlatCommand);
          } else {
            commands.push(whitespaceBreakCommand, contentBreakCommand);
          }
          break;
        }
        const secondContent = parts[offset + 2];
        const remainingCommand = {
          indent: indent2,
          mode,
          doc: {
            ...doc2,
            [DOC_FILL_PRINTED_LENGTH]: offset + 2
          }
        };
        const firstAndSecondContentFlatCommand = {
          indent: indent2,
          mode: MODE_FLAT,
          doc: [content, whitespace, secondContent]
        };
        const firstAndSecondContentFits = fits(firstAndSecondContentFlatCommand, [], remainingWidth, lineSuffix2.length > 0, groupModeMap, true);
        commands.push(remainingCommand);
        if (firstAndSecondContentFits) {
          commands.push(whitespaceFlatCommand, contentFlatCommand);
        } else if (contentFits) {
          commands.push(whitespaceBreakCommand, contentFlatCommand);
        } else {
          commands.push(whitespaceBreakCommand, contentBreakCommand);
        }
        break;
      }
      case DOC_TYPE_IF_BREAK:
      case DOC_TYPE_INDENT_IF_BREAK: {
        const groupMode = doc2.groupId ? groupModeMap[doc2.groupId] : mode;
        if (groupMode === MODE_BREAK) {
          const breakContents = doc2.type === DOC_TYPE_IF_BREAK ? doc2.breakContents : doc2.negate ? doc2.contents : indent(doc2.contents);
          if (breakContents) {
            commands.push({
              indent: indent2,
              mode,
              doc: breakContents
            });
          }
        }
        if (groupMode === MODE_FLAT) {
          const flatContents = doc2.type === DOC_TYPE_IF_BREAK ? doc2.flatContents : doc2.negate ? indent(doc2.contents) : doc2.contents;
          if (flatContents) {
            commands.push({
              indent: indent2,
              mode,
              doc: flatContents
            });
          }
        }
        break;
      }
      case DOC_TYPE_LINE_SUFFIX:
        lineSuffix2.push({
          indent: indent2,
          mode,
          doc: doc2.contents
        });
        break;
      case DOC_TYPE_LINE_SUFFIX_BOUNDARY:
        if (lineSuffix2.length > 0) {
          commands.push({
            indent: indent2,
            mode,
            doc: hardlineWithoutBreakParent
          });
        }
        break;
      case DOC_TYPE_LINE:
        switch (mode) {
          case MODE_FLAT:
            if (!doc2.hard) {
              if (!doc2.soft) {
                result.write(" ");
                position += 1;
              }
              break;
            }
            shouldRemeasure = true;
          // fallthrough
          case MODE_BREAK:
            if (lineSuffix2.length > 0) {
              commands.push({
                indent: indent2,
                mode,
                doc: doc2
              }, ...lineSuffix2.reverse());
              lineSuffix2.length = 0;
              break;
            }
            if (doc2.literal) {
              result.write(newLine);
              position = 0;
              if (indent2.root) {
                if (indent2.root.value) {
                  result.write(indent2.root.value);
                }
                position = indent2.root.length;
              }
            } else {
              result.trim();
              result.write(newLine + indent2.value);
              position = indent2.length;
            }
            break;
        }
        break;
      case DOC_TYPE_LABEL:
        commands.push({
          indent: indent2,
          mode,
          doc: doc2.contents
        });
        break;
      case DOC_TYPE_BREAK_PARENT:
        break;
      default:
        throw new invalid_doc_error_default(doc2);
    }
    if (commands.length === 0 && lineSuffix2.length > 0) {
      commands.push(...lineSuffix2.reverse());
      lineSuffix2.length = 0;
    }
  }
  const {
    text: formatted,
    positions: cursorPositions
  } = result.finish();
  if (cursorPositions.length !== 2) {
    return {
      formatted
    };
  }
  const [cursorNodeStart, cursorNodeEnd] = cursorPositions;
  return {
    formatted,
    cursorNodeStart,
    cursorNodeText: formatted.slice(cursorNodeStart, cursorNodeEnd)
  };
}

// src/utilities/get-alignment-size.js
function getAlignmentSize(text, tabWidth, startIndex = 0) {
  let size = 0;
  for (let i = startIndex; i < text.length; ++i) {
    if (text[i] === "	") {
      size = size + tabWidth - size % tabWidth;
    } else {
      size++;
    }
  }
  return size;
}
var get_alignment_size_default = getAlignmentSize;

// src/common/ast-path.js
var AstPath = class {
  constructor(value) {
    this.stack = [value];
  }
  /** @type {string | null} */
  get key() {
    const {
      stack,
      siblings
    } = this;
    return method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      stack,
      siblings === null ? -2 : -4
    ) ?? null;
  }
  /** @type {number | null} */
  get index() {
    return this.siblings === null ? null : method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      this.stack,
      -2
    );
  }
  /** @type {object} */
  get node() {
    return method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      this.stack,
      -1
    );
  }
  /** @type {object | null} */
  get parent() {
    return this.getNode(1);
  }
  /** @type {object | null} */
  get grandparent() {
    return this.getNode(2);
  }
  /** @type {boolean} */
  get isInArray() {
    return this.siblings !== null;
  }
  /** @type {object[] | null} */
  get siblings() {
    const {
      stack
    } = this;
    const maybeArray = method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      stack,
      -3
    );
    return Array.isArray(maybeArray) ? maybeArray : null;
  }
  /** @type {object | null} */
  get next() {
    const {
      siblings
    } = this;
    return siblings === null ? null : siblings[this.index + 1];
  }
  /** @type {object | null} */
  get previous() {
    const {
      siblings
    } = this;
    return siblings === null ? null : siblings[this.index - 1];
  }
  /** @type {boolean} */
  get isFirst() {
    return this.index === 0;
  }
  /** @type {boolean} */
  get isLast() {
    const {
      siblings,
      index
    } = this;
    return siblings !== null && index === siblings.length - 1;
  }
  /** @type {boolean} */
  get isRoot() {
    return this.stack.length === 1;
  }
  /** @type {object} */
  get root() {
    return this.stack[0];
  }
  /** @type {object[]} */
  get ancestors() {
    return [...this.#getAncestors()];
  }
  // The name of the current property is always the penultimate element of
  // this.stack, and always a string/number/symbol.
  getName() {
    const {
      stack
    } = this;
    const {
      length
    } = stack;
    if (length > 1) {
      return method_at_default(
        /* OPTIONAL_OBJECT: false */
        0,
        stack,
        -2
      );
    }
    return null;
  }
  // The value of the current property is always the final element of
  // this.stack.
  getValue() {
    return method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      this.stack,
      -1
    );
  }
  getNode(count = 0) {
    const stackIndex = this.#getNodeStackIndex(count);
    return stackIndex === -1 ? null : this.stack[stackIndex];
  }
  getParentNode(count = 0) {
    return this.getNode(count + 1);
  }
  #getNodeStackIndex(count) {
    const {
      stack
    } = this;
    for (let i = stack.length - 1; i >= 0; i -= 2) {
      if (!Array.isArray(stack[i]) && --count < 0) {
        return i;
      }
    }
    return -1;
  }
  // Temporarily push properties named by string arguments given after the
  // callback function onto this.stack, then call the callback with a
  // reference to this (modified) AstPath object. Note that the stack will
  // be restored to its original state after the callback is finished, so it
  // is probably a mistake to retain a reference to the path.
  call(callback, ...names) {
    const {
      stack
    } = this;
    const {
      length
    } = stack;
    let value = method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      stack,
      -1
    );
    for (const name of names) {
      value = value?.[name];
      stack.push(name, value);
    }
    try {
      return callback(this);
    } finally {
      stack.length = length;
    }
  }
  /**
   * @template {(path: AstPath) => any} T
   * @param {T} callback
   * @param {number} [count=0]
   * @returns {ReturnType<T>}
   */
  callParent(callback, count = 0) {
    const stackIndex = this.#getNodeStackIndex(count + 1);
    const parentValues = this.stack.splice(stackIndex + 1);
    try {
      return callback(this);
    } finally {
      this.stack.push(...parentValues);
    }
  }
  // Similar to AstPath.prototype.call, except that the value obtained by
  // accessing this.getValue()[name1][name2]... should be array. The
  // callback will be called with a reference to this path object for each
  // element of the array.
  each(callback, ...names) {
    const {
      stack
    } = this;
    const {
      length
    } = stack;
    let value = method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      stack,
      -1
    );
    for (const name of names) {
      value = value[name];
      stack.push(name, value);
    }
    try {
      for (let i = 0; i < value.length; ++i) {
        stack.push(i, value[i]);
        callback(this, i, value);
        stack.length -= 2;
      }
    } finally {
      stack.length = length;
    }
  }
  // Similar to AstPath.prototype.each, except that the results of the
  // callback function invocations are stored in an array and returned at
  // the end of the iteration.
  map(callback, ...names) {
    const result = [];
    this.each((path, index, value) => {
      result[index] = callback(path, index, value);
    }, ...names);
    return result;
  }
  /**
   * @param {...(
   *   | ((node: any, name: string | null, number: number | null) => boolean)
   *   | undefined
   * )} predicates
   */
  match(...predicates) {
    let stackPointer = this.stack.length - 1;
    let name = null;
    let node = this.stack[stackPointer--];
    for (const predicate of predicates) {
      if (node === void 0) {
        return false;
      }
      let number = null;
      if (typeof name === "number") {
        number = name;
        name = this.stack[stackPointer--];
        node = this.stack[stackPointer--];
      }
      if (predicate && !predicate(node, name, number)) {
        return false;
      }
      name = this.stack[stackPointer--];
      node = this.stack[stackPointer--];
    }
    return true;
  }
  /**
   * Traverses the ancestors of the current node heading toward the tree root
   * until it finds a node that matches the provided predicate function. Will
   * return the first matching ancestor. If no such node exists, returns undefined.
   * @param {(node: any) => boolean} predicate
   * @internal Unstable API. Don't use in plugins for now.
   */
  findAncestor(predicate) {
    for (const node of this.#getAncestors()) {
      if (predicate(node)) {
        return node;
      }
    }
  }
  /**
   * Traverses the ancestors of the current node heading toward the tree root
   * until it finds a node that matches the provided predicate function.
   * returns true if matched node found.
   * @param {(node: any) => boolean} predicate
   * @returns {boolean}
   * @internal Unstable API. Don't use in plugins for now.
   */
  hasAncestor(predicate) {
    for (const node of this.#getAncestors()) {
      if (predicate(node)) {
        return true;
      }
    }
    return false;
  }
  *#getAncestors() {
    const {
      stack
    } = this;
    for (let index = stack.length - 3; index >= 0; index -= 2) {
      const value = stack[index];
      if (!Array.isArray(value)) {
        yield value;
      }
    }
  }
};
var ast_path_default = AstPath;

// src/utilities/is-non-empty-array.js
function isNonEmptyArray(object) {
  return Array.isArray(object) && object.length > 0;
}
var is_non_empty_array_default = isNonEmptyArray;

// src/utilities/is-object.js
function isObject(object) {
  return object !== null && typeof object === "object";
}
var is_object_default = isObject;

// src/utilities/skip.js
function skip(characters) {
  return (text, startIndex, options) => {
    if (startIndex === false) {
      return false;
    }
    const backwards = Boolean(options?.backwards);
    const { length } = text;
    let cursor2 = startIndex;
    while (cursor2 >= 0 && cursor2 < length) {
      const character = text.charAt(cursor2);
      if (characters instanceof RegExp) {
        if (!characters.test(character)) {
          return cursor2;
        }
      } else if (!characters.includes(character)) {
        return cursor2;
      }
      backwards ? cursor2-- : cursor2++;
    }
    if (cursor2 === -1 || cursor2 === length) {
      return cursor2;
    }
    return false;
  };
}
var skipWhitespace = skip(/\s/);
var skipSpaces = skip(" 	");
var skipToLineEnd = skip(",; 	");
var skipEverythingButNewLine = skip(/[^\n\r]/);

// src/utilities/skip-newline.js
var isNewlineCharacter = (character) => character === "\n" || character === "\r" || character === "\u2028" || character === "\u2029";
function skipNewline(text, startIndex, options) {
  if (startIndex === false) {
    return false;
  }
  const backwards = Boolean(options?.backwards);
  const character = text.charAt(startIndex);
  if (backwards) {
    if (text.charAt(startIndex - 1) === "\r" && character === "\n") {
      return startIndex - 2;
    }
    if (isNewlineCharacter(character)) {
      return startIndex - 1;
    }
  } else {
    if (character === "\r" && text.charAt(startIndex + 1) === "\n") {
      return startIndex + 2;
    }
    if (isNewlineCharacter(character)) {
      return startIndex + 1;
    }
  }
  return startIndex;
}
var skip_newline_default = skipNewline;

// src/utilities/has-newline.js
function hasNewline(text, startIndex, options = {}) {
  const idx = skipSpaces(
    text,
    options.backwards ? startIndex - 1 : startIndex,
    options
  );
  const idx2 = skip_newline_default(text, idx, options);
  return idx !== idx2;
}
var has_newline_default = hasNewline;

// src/utilities/ast.js
function* getChildren(node, options) {
  const { getVisitorKeys, filter = () => true } = options;
  const isMatchedNode = (node2) => is_object_default(node2) && filter(node2);
  for (const key of getVisitorKeys(node)) {
    const value = node[key];
    if (Array.isArray(value)) {
      for (const child of value) {
        if (isMatchedNode(child)) {
          yield child;
        }
      }
    } else if (isMatchedNode(value)) {
      yield value;
    }
  }
}
function* getDescendants(node, options) {
  const queue = [node];
  for (let index = 0; index < queue.length; index++) {
    const node2 = queue[index];
    for (const child of getChildren(node2, options)) {
      yield child;
      queue.push(child);
    }
  }
}
function isLeaf(node, options) {
  return getChildren(node, options).next().done;
}

// src/main/utilities/get-sorted-child-nodes.js
function getSortedChildNodesWithoutCache(node, ancestors, options) {
  const { filter } = options;
  if (!filter) {
    return [];
  }
  let childAncestors;
  const childNodes = (options.getChildren?.(node, options) ?? [
    ...getChildren(node, { getVisitorKeys: options.getVisitorKeys })
  ]).flatMap((child) => {
    childAncestors ?? (childAncestors = [node, ...ancestors]);
    return filter(child, childAncestors) ? [child] : getSortedChildNodes(child, childAncestors, options);
  });
  const { locStart, locEnd } = options;
  childNodes.sort(
    (nodeA, nodeB) => locStart(nodeA) - locStart(nodeB) || locEnd(nodeA) - locEnd(nodeB)
  );
  return childNodes;
}
function getSortedChildNodes(node, ancestors, options) {
  return getOrInsertComputed(
    options.cache,
    node,
    (node2) => getSortedChildNodesWithoutCache(node2, ancestors, options)
  );
}
var get_sorted_child_nodes_default = getSortedChildNodes;

// src/main/comments/utilities.js
function describeNodeForDebugging(node) {
  const nodeType = node.type || node.kind || "(unknown type)";
  let nodeName = String(
    node.name || node.id && (typeof node.id === "object" ? node.id.name : node.id) || node.key && (typeof node.key === "object" ? node.key.name : node.key) || node.value && (typeof node.value === "object" ? "" : String(node.value)) || node.operator || ""
  );
  if (nodeName.length > 20) {
    nodeName = nodeName.slice(0, 19) + "\u2026";
  }
  return nodeType + (nodeName ? " " + nodeName : "");
}
function addCommentHelper(node, comment) {
  const comments = node.comments ?? (node.comments = []);
  comments.push(comment);
  comment.printed = false;
  comment.nodeDescription = describeNodeForDebugging(node);
}
function addLeadingComment(node, comment) {
  comment.leading = true;
  comment.trailing = false;
  addCommentHelper(node, comment);
}
function addDanglingComment(node, comment, marker) {
  comment.leading = false;
  comment.trailing = false;
  if (marker) {
    comment.marker = marker;
  }
  addCommentHelper(node, comment);
}
function addTrailingComment(node, comment) {
  comment.leading = false;
  comment.trailing = true;
  addCommentHelper(node, comment);
}

// src/main/comments/attach.js
var childNodesCache = /* @__PURE__ */ new WeakMap();
function decorateComment(node, comment, options, enclosingNode, ancestors = []) {
  const { locStart, locEnd } = options;
  const commentStart = locStart(comment);
  const commentEnd = locEnd(comment);
  const childNodes = get_sorted_child_nodes_default(node, ancestors, {
    cache: childNodesCache,
    locStart,
    locEnd,
    getVisitorKeys: options.getVisitorKeys,
    filter: options.printer.canAttachComment,
    getChildren: options.printer.getCommentChildNodes
  });
  let precedingNode;
  let followingNode;
  let left = 0;
  let right = childNodes.length;
  while (left < right) {
    const middle = left + right >> 1;
    const child = childNodes[middle];
    const start = locStart(child);
    const end = locEnd(child);
    if (start <= commentStart && commentEnd <= end) {
      return decorateComment(child, comment, options, child, [
        child,
        ...ancestors
      ]);
    }
    if (end <= commentStart) {
      precedingNode = child;
      left = middle + 1;
      continue;
    }
    if (commentEnd <= start) {
      followingNode = child;
      right = middle;
      continue;
    }
    throw new Error("Comment location overlaps with node location");
  }
  if (enclosingNode?.type === "TemplateLiteral") {
    const { quasis } = enclosingNode;
    const commentIndex = findExpressionIndexForComment(
      quasis,
      comment,
      options
    );
    if (precedingNode && findExpressionIndexForComment(quasis, precedingNode, options) !== commentIndex) {
      precedingNode = null;
    }
    if (followingNode && findExpressionIndexForComment(quasis, followingNode, options) !== commentIndex) {
      followingNode = null;
    }
  }
  return { enclosingNode, precedingNode, followingNode };
}
var returnFalse = () => false;
function attachComments(ast, options) {
  const { comments } = ast;
  delete ast.comments;
  if (!is_non_empty_array_default(comments) || !options.printer.canAttachComment) {
    return;
  }
  const tiesToBreak = [];
  const {
    printer: {
      features: { experimental_avoidAstMutation: avoidAstMutation },
      handleComments = {}
    },
    originalText: text
  } = options;
  const {
    ownLine: handleOwnLineComment = returnFalse,
    endOfLine: handleEndOfLineComment = returnFalse,
    remaining: handleRemainingComment = returnFalse
  } = handleComments;
  const decoratedComments = comments.map((comment, index) => ({
    ...decorateComment(ast, comment, options),
    comment,
    text,
    options,
    ast,
    isLastComment: comments.length - 1 === index,
    // TODO: Move placement here
    placement: void 0
  }));
  const attachPropertiesToComment = !avoidAstMutation;
  for (const [index, context] of decoratedComments.entries()) {
    const {
      comment,
      precedingNode,
      enclosingNode,
      followingNode,
      text: text2,
      options: options2,
      ast: ast2,
      isLastComment
    } = context;
    const placement = isOwnLineComment(text2, options2, decoratedComments, index) ? "ownLine" : isEndOfLineComment(text2, options2, decoratedComments, index) ? "endOfLine" : "remaining";
    let args;
    if (avoidAstMutation) {
      context.placement = placement;
      args = [context];
    } else {
      args = [comment, text2, options2, ast2, isLastComment];
    }
    if (attachPropertiesToComment) {
      comment.enclosingNode = enclosingNode;
      comment.precedingNode = precedingNode;
      comment.followingNode = followingNode;
    }
    comment.placement = placement;
    if (placement === "ownLine") {
      if (handleOwnLineComment(...args)) {
      } else if (followingNode) {
        addLeadingComment(followingNode, comment);
      } else if (precedingNode) {
        addTrailingComment(precedingNode, comment);
      } else if (enclosingNode) {
        addDanglingComment(enclosingNode, comment);
      } else {
        addDanglingComment(ast2, comment);
      }
    } else if (placement === "endOfLine") {
      if (handleEndOfLineComment(...args)) {
      } else if (precedingNode) {
        addTrailingComment(precedingNode, comment);
      } else if (followingNode) {
        addLeadingComment(followingNode, comment);
      } else if (enclosingNode) {
        addDanglingComment(enclosingNode, comment);
      } else {
        addDanglingComment(ast2, comment);
      }
    } else {
      if (handleRemainingComment(...args)) {
      } else if (precedingNode && followingNode) {
        const tieCount = tiesToBreak.length;
        if (tieCount > 0) {
          const lastTie = tiesToBreak[tieCount - 1];
          if (lastTie.followingNode !== followingNode) {
            breakTies(tiesToBreak, options2);
          }
        }
        tiesToBreak.push(context);
      } else if (precedingNode) {
        addTrailingComment(precedingNode, comment);
      } else if (followingNode) {
        addLeadingComment(followingNode, comment);
      } else if (enclosingNode) {
        addDanglingComment(enclosingNode, comment);
      } else {
        addDanglingComment(ast2, comment);
      }
    }
  }
  breakTies(tiesToBreak, options);
  if (attachPropertiesToComment) {
    for (const comment of comments) {
      delete comment.precedingNode;
      delete comment.enclosingNode;
      delete comment.followingNode;
    }
  }
}
var isAllEmptyAndNoLineBreak = (text) => !/[\S\n\u2028\u2029]/.test(text);
function isOwnLineComment(text, options, decoratedComments, commentIndex) {
  const { comment, precedingNode } = decoratedComments[commentIndex];
  const { locStart, locEnd } = options;
  let start = locStart(comment);
  if (precedingNode) {
    for (let index = commentIndex - 1; index >= 0; index--) {
      const { comment: comment2, precedingNode: currentCommentPrecedingNode } = decoratedComments[index];
      if (currentCommentPrecedingNode !== precedingNode || !isAllEmptyAndNoLineBreak(text.slice(locEnd(comment2), start))) {
        break;
      }
      start = locStart(comment2);
    }
  }
  return has_newline_default(text, start, { backwards: true });
}
function isEndOfLineComment(text, options, decoratedComments, commentIndex) {
  const { comment, followingNode } = decoratedComments[commentIndex];
  const { locStart, locEnd } = options;
  let end = locEnd(comment);
  if (followingNode) {
    for (let index = commentIndex + 1; index < decoratedComments.length; index++) {
      const { comment: comment2, followingNode: currentCommentFollowingNode } = decoratedComments[index];
      if (currentCommentFollowingNode !== followingNode || !isAllEmptyAndNoLineBreak(text.slice(end, locStart(comment2)))) {
        break;
      }
      end = locEnd(comment2);
    }
  }
  return has_newline_default(text, end);
}
function breakTies(tiesToBreak, options) {
  const tieCount = tiesToBreak.length;
  if (tieCount === 0) {
    return;
  }
  const { precedingNode, followingNode } = tiesToBreak[0];
  let gapEndPos = options.locStart(followingNode);
  let indexOfFirstLeadingComment;
  for (indexOfFirstLeadingComment = tieCount; indexOfFirstLeadingComment > 0; --indexOfFirstLeadingComment) {
    const {
      comment,
      precedingNode: currentCommentPrecedingNode,
      followingNode: currentCommentFollowingNode
    } = tiesToBreak[indexOfFirstLeadingComment - 1];
    noop_default(currentCommentPrecedingNode, precedingNode);
    noop_default(currentCommentFollowingNode, followingNode);
    const gap = options.originalText.slice(options.locEnd(comment), gapEndPos);
    if (options.printer.isGap?.(gap, options) ?? /^[\s(]*$/.test(gap)) {
      gapEndPos = options.locStart(comment);
    } else {
      break;
    }
  }
  for (const [i, { comment }] of tiesToBreak.entries()) {
    if (i < indexOfFirstLeadingComment) {
      addTrailingComment(precedingNode, comment);
    } else {
      addLeadingComment(followingNode, comment);
    }
  }
  for (const node of [precedingNode, followingNode]) {
    if (node.comments && node.comments.length > 1) {
      node.comments.sort((a, b) => options.locStart(a) - options.locStart(b));
    }
  }
  tiesToBreak.length = 0;
}
function findExpressionIndexForComment(quasis, comment, options) {
  const startPos = options.locStart(comment) - 1;
  for (let i = 1; i < quasis.length; ++i) {
    if (startPos < options.locStart(quasis[i])) {
      return i - 1;
    }
  }
  return 0;
}

// src/utilities/is-previous-line-empty.js
function isPreviousLineEmpty(text, startIndex) {
  let idx = startIndex - 1;
  idx = skipSpaces(text, idx, { backwards: true });
  idx = skip_newline_default(text, idx, { backwards: true });
  idx = skipSpaces(text, idx, { backwards: true });
  const idx2 = skip_newline_default(text, idx, { backwards: true });
  return idx !== idx2;
}
var is_previous_line_empty_default = isPreviousLineEmpty;

// src/main/comments/print.js
var returnTrue = () => true;
function printComment(path, options) {
  const comment = path.node;
  comment.printed = true;
  return options.printer.printComment(path, options);
}
function printLeadingComment(path, options) {
  const comment = path.node;
  const parts = [printComment(path, options)];
  const { printer: printer2, originalText, locStart, locEnd } = options;
  const isBlock = printer2.isBlockComment?.(comment);
  if (isBlock) {
    let lineBreak = " ";
    if (has_newline_default(originalText, locEnd(comment))) {
      if (has_newline_default(originalText, locStart(comment), { backwards: true })) {
        lineBreak = hardline;
      } else {
        lineBreak = line;
      }
    }
    parts.push(lineBreak);
  } else {
    parts.push(hardline);
  }
  const index = skip_newline_default(
    originalText,
    skipSpaces(originalText, locEnd(comment))
  );
  if (index !== false && has_newline_default(originalText, index)) {
    parts.push(hardline);
  }
  return parts;
}
function printTrailingComment(path, options, previousComment) {
  const comment = path.node;
  const printed = printComment(path, options);
  const { printer: printer2, originalText, locStart } = options;
  const isBlock = printer2.isBlockComment?.(comment);
  if (previousComment?.hasLineSuffix && !previousComment?.isBlock || has_newline_default(originalText, locStart(comment), { backwards: true })) {
    const isLineBeforeEmpty = is_previous_line_empty_default(
      originalText,
      locStart(comment)
    );
    return {
      doc: lineSuffix([hardline, isLineBeforeEmpty ? hardline : "", printed]),
      isBlock,
      hasLineSuffix: true
    };
  }
  if (!isBlock || previousComment?.hasLineSuffix) {
    return {
      doc: [lineSuffix([" ", printed]), breakParent],
      isBlock,
      hasLineSuffix: true
    };
  }
  return { doc: [" ", printed], isBlock, hasLineSuffix: false };
}
function printLeadingComments(path, options, printOptions) {
  const printed = options[/* @__PURE__ */ Symbol.for("printedComments")];
  const filter = printOptions?.filter ?? returnTrue;
  const leadingComments = new Set(
    path.node?.comments?.filter(
      (comment) => !printed?.has(comment) && comment.leading && filter(comment)
    )
  );
  if (leadingComments.size === 0) {
    return "";
  }
  return path.map(
    ({ node: comment }) => leadingComments.has(comment) ? printLeadingComment(path, options) : "",
    "comments"
  ).filter(Boolean);
}
function printTrailingComments(path, options, printOptions) {
  const comments = path.node?.comments;
  const trailingComments = new Set(
    comments?.filter((comment) => comment.trailing)
  );
  const printed = options[/* @__PURE__ */ Symbol.for("printedComments")];
  const filter = printOptions?.filter ?? returnTrue;
  const commentsShouldPrint = new Set(
    comments?.filter(
      (comment) => trailingComments.has(comment) && !printed?.has(comment) && filter(comment)
    )
  );
  if (commentsShouldPrint.size === 0) {
    return "";
  }
  const docs = [];
  let printedTrailingComment;
  path.each(({ node: comment }) => {
    if (!trailingComments.has(comment)) {
      return;
    }
    printedTrailingComment = printTrailingComment(
      path,
      options,
      printedTrailingComment
    );
    if (commentsShouldPrint.has(comment)) {
      docs.push(printedTrailingComment.doc);
    }
  }, "comments");
  return docs;
}
function printComments(path, doc, options, printOptions) {
  const leading = printLeadingComments(path, options, printOptions);
  const trailing = printTrailingComments(path, options, printOptions);
  return leading || trailing ? inheritLabel(doc, (doc2) => [leading, doc2, trailing]) : doc;
}
function ensureAllCommentsPrinted(options) {
  const {
    [commentsPropertyInOptions]: comments,
    [/* @__PURE__ */ Symbol.for("printedComments")]: printedComments
  } = options;
  for (const comment of comments) {
    if (!comment.printed && !printedComments.has(comment)) {
      throw new Error(
        'Comment "' + comment.value.trim() + '" was not printed. Please report this error!'
      );
    }
    delete comment.printed;
  }
}

// src/main/create-print-pre-check-function.js
var create_print_pre_check_function_default = true ? () => noop_default : createPrintPreCheckFunction;

// src/common/errors.js
var ConfigError = class extends Error {
  name = "ConfigError";
};
var UndefinedParserError = class extends Error {
  name = "UndefinedParserError";
};

// scripts/build/shims/function-object-has-own.js
var hasOwn = Object.hasOwn ?? Function.prototype.call.bind(Object.prototype.hasOwnProperty);
var function_object_has_own_default = hasOwn;

// src/main/core-options.evaluate.js
var core_options_evaluate_default = {
  "checkIgnorePragma": {
    "category": "Special",
    "type": "boolean",
    "default": false,
    "description": "Check whether the file's first docblock comment contains '@noprettier' or '@noformat' to determine if it should be formatted.",
    "cliCategory": "Other"
  },
  "cursorOffset": {
    "category": "Special",
    "type": "int",
    "default": -1,
    "range": {
      "start": -1,
      "end": Infinity,
      "step": 1
    },
    "description": "Print (to stderr) where a cursor at the given position would move to after formatting.",
    "cliCategory": "Editor"
  },
  "endOfLine": {
    "category": "Global",
    "type": "choice",
    "default": "lf",
    "description": "Which end of line characters to apply.",
    "choices": [
      {
        "value": "lf",
        "description": "Line Feed only (\\n), common on Linux and macOS as well as inside git repos"
      },
      {
        "value": "crlf",
        "description": "Carriage Return + Line Feed characters (\\r\\n), common on Windows"
      },
      {
        "value": "cr",
        "description": "Carriage Return character only (\\r), used very rarely"
      },
      {
        "value": "auto",
        "description": "Maintain existing\n(mixed values within one file are normalised by looking at what's used after the first line)"
      }
    ]
  },
  "filepath": {
    "category": "Special",
    "type": "path",
    "description": "Specify the input filepath. This will be used to do parser inference.",
    "cliName": "stdin-filepath",
    "cliCategory": "Other",
    "cliDescription": "Path to the file to pretend that stdin comes from."
  },
  "insertPragma": {
    "category": "Special",
    "type": "boolean",
    "default": false,
    "description": "Insert @format pragma into file's first docblock comment.",
    "cliCategory": "Other"
  },
  "parser": {
    "category": "Global",
    "type": "choice",
    "default": void 0,
    "description": "Which parser to use.",
    "exception": (value) => typeof value === "string" || typeof value === "function",
    "choices": [
      {
        "value": "flow",
        "description": "Flow"
      },
      {
        "value": "babel",
        "description": "JavaScript"
      },
      {
        "value": "babel-flow",
        "description": "Flow"
      },
      {
        "value": "babel-ts",
        "description": "TypeScript"
      },
      {
        "value": "typescript",
        "description": "TypeScript"
      },
      {
        "value": "acorn",
        "description": "JavaScript"
      },
      {
        "value": "espree",
        "description": "JavaScript"
      },
      {
        "value": "meriyah",
        "description": "JavaScript"
      },
      {
        "value": "css",
        "description": "CSS"
      },
      {
        "value": "less",
        "description": "Less"
      },
      {
        "value": "scss",
        "description": "SCSS"
      },
      {
        "value": "json",
        "description": "JSON"
      },
      {
        "value": "json5",
        "description": "JSON5"
      },
      {
        "value": "jsonc",
        "description": "JSON with Comments"
      },
      {
        "value": "json-stringify",
        "description": "JSON.stringify"
      },
      {
        "value": "graphql",
        "description": "GraphQL"
      },
      {
        "value": "markdown",
        "description": "Markdown"
      },
      {
        "value": "mdx",
        "description": "MDX"
      },
      {
        "value": "vue",
        "description": "Vue"
      },
      {
        "value": "yaml",
        "description": "YAML"
      },
      {
        "value": "glimmer",
        "description": "Ember / Handlebars"
      },
      {
        "value": "html",
        "description": "HTML"
      },
      {
        "value": "angular",
        "description": "Angular"
      },
      {
        "value": "lwc",
        "description": "Lightning Web Components"
      },
      {
        "value": "mjml",
        "description": "MJML"
      }
    ]
  },
  "plugins": {
    "type": "path",
    "array": true,
    "default": [
      {
        "value": []
      }
    ],
    "category": "Global",
    "description": "Add a plugin. Multiple plugins can be passed as separate `--plugin`s.",
    "exception": (value) => typeof value === "string" || typeof value === "object",
    "cliName": "plugin",
    "cliCategory": "Config"
  },
  "printWidth": {
    "category": "Global",
    "type": "int",
    "default": 80,
    "description": "The line length where Prettier will try wrap.",
    "range": {
      "start": 0,
      "end": Infinity,
      "step": 1
    }
  },
  "rangeEnd": {
    "category": "Special",
    "type": "int",
    "default": Infinity,
    "range": {
      "start": 0,
      "end": Infinity,
      "step": 1
    },
    "description": "Format code ending at a given character offset (exclusive).\nThe range will extend forwards to the end of the selected statement.",
    "cliCategory": "Editor"
  },
  "rangeStart": {
    "category": "Special",
    "type": "int",
    "default": 0,
    "range": {
      "start": 0,
      "end": Infinity,
      "step": 1
    },
    "description": "Format code starting at a given character offset.\nThe range will extend backwards to the start of the first line containing the selected statement.",
    "cliCategory": "Editor"
  },
  "requirePragma": {
    "category": "Special",
    "type": "boolean",
    "default": false,
    "description": "Require either '@prettier' or '@format' to be present in the file's first docblock comment in order for it to be formatted.",
    "cliCategory": "Other"
  },
  "tabWidth": {
    "type": "int",
    "category": "Global",
    "default": 2,
    "description": "Number of spaces per indentation level.",
    "range": {
      "start": 0,
      "end": Infinity,
      "step": 1
    }
  },
  "useTabs": {
    "category": "Global",
    "type": "boolean",
    "default": false,
    "description": "Indent with tabs instead of spaces."
  },
  "embeddedLanguageFormatting": {
    "category": "Global",
    "type": "choice",
    "default": "auto",
    "description": "Control how Prettier formats quoted code embedded in the file.",
    "choices": [
      {
        "value": "auto",
        "description": "Format embedded code if Prettier can automatically identify it."
      },
      {
        "value": "off",
        "description": "Never automatically format embedded code."
      }
    ]
  }
};

// src/main/support.js
function getSupportInfo({
  plugins = [],
  showDeprecated = false
} = {}) {
  const languages = plugins.flatMap((plugin) => plugin.languages ?? []);
  const options = [];
  for (const option of normalizeOptionSettings(Object.assign({}, ...plugins.map(({
    options: options2
  }) => options2), core_options_evaluate_default))) {
    if (!showDeprecated && option.deprecated) {
      continue;
    }
    if (Array.isArray(option.choices)) {
      if (!showDeprecated) {
        option.choices = option.choices.filter((choice) => !choice.deprecated);
      }
      if (option.name === "parser") {
        option.choices = [...option.choices, ...collectParsersFromLanguages(option.choices, languages, plugins)];
      }
    }
    option.pluginDefaults = Object.fromEntries(plugins.filter((plugin) => plugin.defaultOptions?.[option.name] !== void 0).map((plugin) => [plugin.name, plugin.defaultOptions[option.name]]));
    options.push(option);
  }
  return {
    languages,
    options
  };
}
function* collectParsersFromLanguages(parserChoices, languages, plugins) {
  const existingParsers = new Set(parserChoices.map((choice) => choice.value));
  for (const language of languages) {
    if (language.parsers) {
      for (const parserName of language.parsers) {
        if (!existingParsers.has(parserName)) {
          existingParsers.add(parserName);
          const plugin = plugins.find((plugin2) => plugin2.parsers && function_object_has_own_default(plugin2.parsers, parserName));
          let description = language.name;
          if (plugin?.name) {
            description += ` (plugin: ${plugin.name})`;
          }
          yield {
            value: parserName,
            description
          };
        }
      }
    }
  }
}
function normalizeOptionSettings(settings) {
  const options = [];
  for (const [name, originalOption] of Object.entries(settings)) {
    const option = {
      name,
      ...originalOption
    };
    if (Array.isArray(option.default)) {
      option.default = method_at_default(
        /* OPTIONAL_OBJECT: false */
        0,
        option.default,
        -1
      ).value;
    }
    options.push(option);
  }
  return options;
}

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
function inferParser(options, fileInfo) {
  const languages = method_to_reversed_default(
    /* OPTIONAL_OBJECT: false */
    0,
    options.plugins
  ).flatMap((plugin) => (
    // @ts-expect-error -- Safe
    plugin.languages ?? []
  ));
  const language = getLanguageByLanguageName(languages, fileInfo.language) ?? getLanguageByFileName(languages, fileInfo.physicalFile) ?? getLanguageByFileName(languages, fileInfo.file) ?? getLanguageByIsSupported(languages, fileInfo.physicalFile) ?? getLanguageByIsSupported(languages, fileInfo.file) ?? getLanguageByInterpreter?.(languages, fileInfo.physicalFile);
  return language?.parsers[0];
}
var infer_parser_default = inferParser;

// node_modules/vnopts/lib/descriptors/api.js
var apiDescriptor = {
  key: (key) => /^[$_a-zA-Z][$_a-zA-Z0-9]*$/.test(key) ? key : JSON.stringify(key),
  value(value) {
    if (value === null || typeof value !== "object") {
      return JSON.stringify(value);
    }
    if (Array.isArray(value)) {
      return `[${value.map((subValue) => apiDescriptor.value(subValue)).join(", ")}]`;
    }
    const keys = Object.keys(value);
    return keys.length === 0 ? "{}" : `{ ${keys.map((key) => `${apiDescriptor.key(key)}: ${apiDescriptor.value(value[key])}`).join(", ")} }`;
  },
  pair: ({ key, value }) => apiDescriptor.value({ [key]: value })
};

// scripts/build/shims/colors.js
var colors = /* @__PURE__ */ new Proxy(String, { get: () => colors });
var colors_default = colors;

// node_modules/vnopts/lib/handlers/deprecated/common.js
var commonDeprecatedHandler = (keyOrPair, redirectTo, { descriptor }) => {
  const messages = [
    `${colors_default.yellow(typeof keyOrPair === "string" ? descriptor.key(keyOrPair) : descriptor.pair(keyOrPair))} is deprecated`
  ];
  if (redirectTo) {
    messages.push(`we now treat it as ${colors_default.blue(typeof redirectTo === "string" ? descriptor.key(redirectTo) : descriptor.pair(redirectTo))}`);
  }
  return messages.join("; ") + ".";
};

// node_modules/vnopts/lib/constants.js
var VALUE_NOT_EXIST = /* @__PURE__ */ Symbol.for("vnopts.VALUE_NOT_EXIST");
var VALUE_UNCHANGED = /* @__PURE__ */ Symbol.for("vnopts.VALUE_UNCHANGED");

// node_modules/vnopts/lib/handlers/invalid/common.js
var INDENTATION = " ".repeat(2);
var commonInvalidHandler = (key, value, utils2) => {
  const { text, list } = utils2.normalizeExpectedResult(utils2.schemas[key].expected(utils2));
  const descriptions = [];
  if (text) {
    descriptions.push(getDescription(key, value, text, utils2.descriptor));
  }
  if (list) {
    descriptions.push([getDescription(key, value, list.title, utils2.descriptor)].concat(list.values.map((valueDescription) => getListDescription(valueDescription, utils2.loggerPrintWidth))).join("\n"));
  }
  return chooseDescription(descriptions, utils2.loggerPrintWidth);
};
function getDescription(key, value, expected, descriptor) {
  return [
    `Invalid ${colors_default.red(descriptor.key(key))} value.`,
    `Expected ${colors_default.blue(expected)},`,
    `but received ${value === VALUE_NOT_EXIST ? colors_default.gray("nothing") : colors_default.red(descriptor.value(value))}.`
  ].join(" ");
}
function getListDescription({ text, list }, printWidth) {
  const descriptions = [];
  if (text) {
    descriptions.push(`- ${colors_default.blue(text)}`);
  }
  if (list) {
    descriptions.push([`- ${colors_default.blue(list.title)}:`].concat(list.values.map((valueDescription) => getListDescription(valueDescription, printWidth - INDENTATION.length).replace(/^|\n/g, `$&${INDENTATION}`))).join("\n"));
  }
  return chooseDescription(descriptions, printWidth);
}
function chooseDescription(descriptions, printWidth) {
  if (descriptions.length === 1) {
    return descriptions[0];
  }
  const [firstDescription, secondDescription] = descriptions;
  const [firstWidth, secondWidth] = descriptions.map((description) => description.split("\n", 1)[0].length);
  return firstWidth > printWidth && firstWidth > secondWidth ? secondDescription : firstDescription;
}

// node_modules/leven/index.js
var array = [];
var characterCodeCache = [];
function leven(first, second, options) {
  if (first === second) {
    return 0;
  }
  const maxDistance = options?.maxDistance;
  const swap = first;
  if (first.length > second.length) {
    first = second;
    second = swap;
  }
  let firstLength = first.length;
  let secondLength = second.length;
  while (firstLength > 0 && first.charCodeAt(~-firstLength) === second.charCodeAt(~-secondLength)) {
    firstLength--;
    secondLength--;
  }
  let start = 0;
  while (start < firstLength && first.charCodeAt(start) === second.charCodeAt(start)) {
    start++;
  }
  firstLength -= start;
  secondLength -= start;
  if (maxDistance !== void 0 && secondLength - firstLength > maxDistance) {
    return maxDistance;
  }
  if (firstLength === 0) {
    return maxDistance !== void 0 && secondLength > maxDistance ? maxDistance : secondLength;
  }
  let bCharacterCode;
  let result;
  let temporary;
  let temporary2;
  let index = 0;
  let index2 = 0;
  while (index < firstLength) {
    characterCodeCache[index] = first.charCodeAt(start + index);
    array[index] = ++index;
  }
  while (index2 < secondLength) {
    bCharacterCode = second.charCodeAt(start + index2);
    temporary = index2++;
    result = index2;
    for (index = 0; index < firstLength; index++) {
      temporary2 = bCharacterCode === characterCodeCache[index] ? temporary : temporary + 1;
      temporary = array[index];
      result = array[index] = temporary > result ? temporary2 > result ? result + 1 : temporary2 : temporary2 > temporary ? temporary + 1 : temporary2;
    }
    if (maxDistance !== void 0) {
      let rowMinimum = result;
      for (index = 0; index < firstLength; index++) {
        if (array[index] < rowMinimum) {
          rowMinimum = array[index];
        }
      }
      if (rowMinimum > maxDistance) {
        return maxDistance;
      }
    }
  }
  array.length = firstLength;
  characterCodeCache.length = firstLength;
  return maxDistance !== void 0 && result > maxDistance ? maxDistance : result;
}
function closestMatch(target, candidates, options) {
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return void 0;
  }
  const userMax = options?.maxDistance;
  const targetLength = target.length;
  for (const candidate of candidates) {
    if (candidate === target) {
      return candidate;
    }
  }
  if (userMax === 0) {
    return void 0;
  }
  let best;
  let bestDist = Number.POSITIVE_INFINITY;
  const seen = /* @__PURE__ */ new Set();
  for (const candidate of candidates) {
    if (seen.has(candidate)) {
      continue;
    }
    seen.add(candidate);
    const lengthDiff = Math.abs(candidate.length - targetLength);
    if (lengthDiff >= bestDist) {
      continue;
    }
    if (userMax !== void 0 && lengthDiff > userMax) {
      continue;
    }
    const cap = Number.isFinite(bestDist) ? userMax === void 0 ? bestDist : Math.min(bestDist, userMax) : userMax;
    const distance = cap === void 0 ? leven(target, candidate) : leven(target, candidate, { maxDistance: cap });
    if (userMax !== void 0 && distance > userMax) {
      continue;
    }
    let actualD = distance;
    if (cap !== void 0 && distance === cap && cap === userMax) {
      actualD = leven(target, candidate);
    }
    if (actualD < bestDist) {
      bestDist = actualD;
      best = candidate;
      if (bestDist === 0) {
        break;
      }
    }
  }
  if (userMax !== void 0 && bestDist > userMax) {
    return void 0;
  }
  return best;
}

// node_modules/vnopts/lib/handlers/unknown/leven.js
var levenUnknownHandler = (key, value, { descriptor, logger, schemas }) => {
  const messages = [
    `Ignored unknown option ${colors_default.yellow(descriptor.pair({ key, value }))}.`
  ];
  const suggestion = closestMatch(key, Object.keys(schemas), { maxDistance: 3 });
  if (suggestion) {
    messages.push(`Did you mean ${colors_default.blue(descriptor.key(suggestion))}?`);
  }
  logger.warn(messages.join(" "));
};

// node_modules/vnopts/lib/schema.js
var HANDLER_KEYS = [
  "default",
  "expected",
  "validate",
  "deprecated",
  "forward",
  "redirect",
  "overlap",
  "preprocess",
  "postprocess"
];
function createSchema(SchemaConstructor, parameters) {
  const schema = new SchemaConstructor(parameters);
  const subSchema = Object.create(schema);
  for (const handlerKey of HANDLER_KEYS) {
    if (handlerKey in parameters) {
      subSchema[handlerKey] = normalizeHandler(parameters[handlerKey], schema, Schema.prototype[handlerKey].length);
    }
  }
  return subSchema;
}
var Schema = class {
  static create(parameters) {
    return createSchema(this, parameters);
  }
  constructor(parameters) {
    this.name = parameters.name;
  }
  default(_utils) {
    return void 0;
  }
  // this is actually an abstract method but we need a placeholder to get `function.length`
  /* c8 ignore start */
  expected(_utils) {
    return "nothing";
  }
  /* c8 ignore stop */
  // this is actually an abstract method but we need a placeholder to get `function.length`
  /* c8 ignore start */
  validate(_value, _utils) {
    return false;
  }
  /* c8 ignore stop */
  deprecated(_value, _utils) {
    return false;
  }
  forward(_value, _utils) {
    return void 0;
  }
  redirect(_value, _utils) {
    return void 0;
  }
  overlap(currentValue, _newValue, _utils) {
    return currentValue;
  }
  preprocess(value, _utils) {
    return value;
  }
  postprocess(_value, _utils) {
    return VALUE_UNCHANGED;
  }
};
function normalizeHandler(handler, superSchema, handlerArgumentsLength) {
  return typeof handler === "function" ? (...args) => handler(...args.slice(0, handlerArgumentsLength - 1), superSchema, ...args.slice(handlerArgumentsLength - 1)) : () => handler;
}

// node_modules/vnopts/lib/schemas/alias.js
var AliasSchema = class extends Schema {
  constructor(parameters) {
    super(parameters);
    this._sourceName = parameters.sourceName;
  }
  expected(utils2) {
    return utils2.schemas[this._sourceName].expected(utils2);
  }
  validate(value, utils2) {
    return utils2.schemas[this._sourceName].validate(value, utils2);
  }
  redirect(_value, _utils) {
    return this._sourceName;
  }
};

// node_modules/vnopts/lib/schemas/any.js
var AnySchema = class extends Schema {
  expected() {
    return "anything";
  }
  validate() {
    return true;
  }
};

// node_modules/vnopts/lib/schemas/array.js
var ArraySchema = class extends Schema {
  constructor({ valueSchema, name = valueSchema.name, ...handlers }) {
    super({ ...handlers, name });
    this._valueSchema = valueSchema;
  }
  expected(utils2) {
    const { text, list } = utils2.normalizeExpectedResult(this._valueSchema.expected(utils2));
    return {
      text: text && `an array of ${text}`,
      list: list && {
        title: `an array of the following values`,
        values: [{ list }]
      }
    };
  }
  validate(value, utils2) {
    if (!Array.isArray(value)) {
      return false;
    }
    const invalidValues = [];
    for (const subValue of value) {
      const subValidateResult = utils2.normalizeValidateResult(this._valueSchema.validate(subValue, utils2), subValue);
      if (subValidateResult !== true) {
        invalidValues.push(subValidateResult.value);
      }
    }
    return invalidValues.length === 0 ? true : { value: invalidValues };
  }
  deprecated(value, utils2) {
    const deprecatedResult = [];
    for (const subValue of value) {
      const subDeprecatedResult = utils2.normalizeDeprecatedResult(this._valueSchema.deprecated(subValue, utils2), subValue);
      if (subDeprecatedResult !== false) {
        deprecatedResult.push(...subDeprecatedResult.map(({ value: deprecatedValue }) => ({
          value: [deprecatedValue]
        })));
      }
    }
    return deprecatedResult;
  }
  forward(value, utils2) {
    const forwardResult = [];
    for (const subValue of value) {
      const subForwardResult = utils2.normalizeForwardResult(this._valueSchema.forward(subValue, utils2), subValue);
      forwardResult.push(...subForwardResult.map(wrapTransferResult));
    }
    return forwardResult;
  }
  redirect(value, utils2) {
    const remain = [];
    const redirect = [];
    for (const subValue of value) {
      const subRedirectResult = utils2.normalizeRedirectResult(this._valueSchema.redirect(subValue, utils2), subValue);
      if ("remain" in subRedirectResult) {
        remain.push(subRedirectResult.remain);
      }
      redirect.push(...subRedirectResult.redirect.map(wrapTransferResult));
    }
    return remain.length === 0 ? { redirect } : { redirect, remain };
  }
  overlap(currentValue, newValue) {
    return currentValue.concat(newValue);
  }
};
function wrapTransferResult({ from, to }) {
  return { from: [from], to };
}

// node_modules/vnopts/lib/schemas/boolean.js
var BooleanSchema = class extends Schema {
  expected() {
    return "true or false";
  }
  validate(value) {
    return typeof value === "boolean";
  }
};

// node_modules/vnopts/lib/utils.js
function recordFromArray(array2, mainKey) {
  const record = /* @__PURE__ */ Object.create(null);
  for (const value of array2) {
    const key = value[mainKey];
    if (record[key]) {
      throw new Error(`Duplicate ${mainKey} ${JSON.stringify(key)}`);
    }
    record[key] = value;
  }
  return record;
}
function mapFromArray(array2, mainKey) {
  const map = /* @__PURE__ */ new Map();
  for (const value of array2) {
    const key = value[mainKey];
    if (map.has(key)) {
      throw new Error(`Duplicate ${mainKey} ${JSON.stringify(key)}`);
    }
    map.set(key, value);
  }
  return map;
}
function createAutoChecklist() {
  const map = /* @__PURE__ */ Object.create(null);
  return (id) => {
    const idString = JSON.stringify(id);
    if (map[idString]) {
      return true;
    }
    map[idString] = true;
    return false;
  };
}
function partition(array2, predicate) {
  const trueArray = [];
  const falseArray = [];
  for (const value of array2) {
    if (predicate(value)) {
      trueArray.push(value);
    } else {
      falseArray.push(value);
    }
  }
  return [trueArray, falseArray];
}
function isInt(value) {
  return value === Math.floor(value);
}
function comparePrimitive(a, b) {
  if (a === b) {
    return 0;
  }
  const typeofA = typeof a;
  const typeofB = typeof b;
  const orders = [
    "undefined",
    "object",
    // null
    "boolean",
    "number",
    "string"
  ];
  if (typeofA !== typeofB) {
    return orders.indexOf(typeofA) - orders.indexOf(typeofB);
  }
  if (typeofA !== "string") {
    return Number(a) - Number(b);
  }
  return a.localeCompare(b);
}
function normalizeInvalidHandler(invalidHandler) {
  return (...args) => {
    const errorMessageOrError = invalidHandler(...args);
    return typeof errorMessageOrError === "string" ? new Error(errorMessageOrError) : errorMessageOrError;
  };
}
function normalizeDefaultResult(result) {
  return result === void 0 ? {} : result;
}
function normalizeExpectedResult(result) {
  if (typeof result === "string") {
    return { text: result };
  }
  const { text, list } = result;
  assert((text || list) !== void 0, "Unexpected `expected` result, there should be at least one field.");
  if (!list) {
    return { text };
  }
  return {
    text,
    list: {
      title: list.title,
      values: list.values.map(normalizeExpectedResult)
    }
  };
}
function normalizeValidateResult(result, value) {
  return result === true ? true : result === false ? { value } : result;
}
function normalizeDeprecatedResult(result, value, doNotNormalizeTrue = false) {
  return result === false ? false : result === true ? doNotNormalizeTrue ? true : [{ value }] : "value" in result ? [result] : result.length === 0 ? false : result;
}
function normalizeTransferResult(result, value) {
  return typeof result === "string" || "key" in result ? { from: value, to: result } : "from" in result ? { from: result.from, to: result.to } : { from: value, to: result.to };
}
function normalizeForwardResult(result, value) {
  return result === void 0 ? [] : Array.isArray(result) ? result.map((transferResult) => normalizeTransferResult(transferResult, value)) : [normalizeTransferResult(result, value)];
}
function normalizeRedirectResult(result, value) {
  const redirect = normalizeForwardResult(typeof result === "object" && "redirect" in result ? result.redirect : result, value);
  return redirect.length === 0 ? { remain: value, redirect } : typeof result === "object" && "remain" in result ? { remain: result.remain, redirect } : { redirect };
}
function assert(isValid, message) {
  if (!isValid) {
    throw new Error(message);
  }
}

// node_modules/vnopts/lib/schemas/choice.js
var ChoiceSchema = class extends Schema {
  constructor(parameters) {
    super(parameters);
    this._choices = mapFromArray(parameters.choices.map((choice) => choice && typeof choice === "object" ? choice : { value: choice }), "value");
  }
  expected({ descriptor }) {
    const choiceDescriptions = Array.from(this._choices.keys()).map((value) => this._choices.get(value)).filter(({ hidden }) => !hidden).map((choiceInfo) => choiceInfo.value).sort(comparePrimitive).map(descriptor.value);
    const head = choiceDescriptions.slice(0, -2);
    const tail = choiceDescriptions.slice(-2);
    const message = head.concat(tail.join(" or ")).join(", ");
    return {
      text: message,
      list: {
        title: "one of the following values",
        values: choiceDescriptions
      }
    };
  }
  validate(value) {
    return this._choices.has(value);
  }
  deprecated(value) {
    const choiceInfo = this._choices.get(value);
    return choiceInfo && choiceInfo.deprecated ? { value } : false;
  }
  forward(value) {
    const choiceInfo = this._choices.get(value);
    return choiceInfo ? choiceInfo.forward : void 0;
  }
  redirect(value) {
    const choiceInfo = this._choices.get(value);
    return choiceInfo ? choiceInfo.redirect : void 0;
  }
};

// node_modules/vnopts/lib/schemas/number.js
var NumberSchema = class extends Schema {
  expected() {
    return "a number";
  }
  validate(value, _utils) {
    return typeof value === "number";
  }
};

// node_modules/vnopts/lib/schemas/integer.js
var IntegerSchema = class extends NumberSchema {
  expected() {
    return "an integer";
  }
  validate(value, utils2) {
    return utils2.normalizeValidateResult(super.validate(value, utils2), value) === true && isInt(value);
  }
};

// node_modules/vnopts/lib/schemas/string.js
var StringSchema = class extends Schema {
  expected() {
    return "a string";
  }
  validate(value) {
    return typeof value === "string";
  }
};

// node_modules/vnopts/lib/defaults.js
var defaultDescriptor = apiDescriptor;
var defaultUnknownHandler = levenUnknownHandler;
var defaultInvalidHandler = commonInvalidHandler;
var defaultDeprecatedHandler = commonDeprecatedHandler;

// node_modules/vnopts/lib/normalize.js
var Normalizer = class {
  constructor(schemas, opts) {
    const { logger = console, loggerPrintWidth = 80, descriptor = defaultDescriptor, unknown = defaultUnknownHandler, invalid = defaultInvalidHandler, deprecated = defaultDeprecatedHandler, missing = () => false, required = () => false, preprocess = (x) => x, postprocess = () => VALUE_UNCHANGED } = opts || {};
    this._utils = {
      descriptor,
      logger: (
        /* c8 ignore next */
        logger || { warn: () => {
        } }
      ),
      loggerPrintWidth,
      schemas: recordFromArray(schemas, "name"),
      normalizeDefaultResult,
      normalizeExpectedResult,
      normalizeDeprecatedResult,
      normalizeForwardResult,
      normalizeRedirectResult,
      normalizeValidateResult
    };
    this._unknownHandler = unknown;
    this._invalidHandler = normalizeInvalidHandler(invalid);
    this._deprecatedHandler = deprecated;
    this._identifyMissing = (k, o) => !(k in o) || missing(k, o);
    this._identifyRequired = required;
    this._preprocess = preprocess;
    this._postprocess = postprocess;
    this.cleanHistory();
  }
  cleanHistory() {
    this._hasDeprecationWarned = createAutoChecklist();
  }
  normalize(options) {
    const newOptions = {};
    const preprocessed = this._preprocess(options, this._utils);
    const restOptionsArray = [preprocessed];
    const applyNormalization = () => {
      while (restOptionsArray.length !== 0) {
        const currentOptions = restOptionsArray.shift();
        const transferredOptionsArray = this._applyNormalization(currentOptions, newOptions);
        restOptionsArray.push(...transferredOptionsArray);
      }
    };
    applyNormalization();
    for (const key of Object.keys(this._utils.schemas)) {
      const schema = this._utils.schemas[key];
      if (!(key in newOptions)) {
        const defaultResult = normalizeDefaultResult(schema.default(this._utils));
        if ("value" in defaultResult) {
          restOptionsArray.push({ [key]: defaultResult.value });
        }
      }
    }
    applyNormalization();
    for (const key of Object.keys(this._utils.schemas)) {
      if (!(key in newOptions)) {
        continue;
      }
      const schema = this._utils.schemas[key];
      const value = newOptions[key];
      const newValue = schema.postprocess(value, this._utils);
      if (newValue === VALUE_UNCHANGED) {
        continue;
      }
      this._applyValidation(newValue, key, schema);
      newOptions[key] = newValue;
    }
    this._applyPostprocess(newOptions);
    this._applyRequiredCheck(newOptions);
    return newOptions;
  }
  _applyNormalization(options, newOptions) {
    const transferredOptionsArray = [];
    const { knownKeys, unknownKeys } = this._partitionOptionKeys(options);
    for (const key of knownKeys) {
      const schema = this._utils.schemas[key];
      const value = schema.preprocess(options[key], this._utils);
      this._applyValidation(value, key, schema);
      const appendTransferredOptions = ({ from, to }) => {
        transferredOptionsArray.push(typeof to === "string" ? { [to]: from } : { [to.key]: to.value });
      };
      const warnDeprecated = ({ value: currentValue, redirectTo }) => {
        const deprecatedResult = normalizeDeprecatedResult(
          schema.deprecated(currentValue, this._utils),
          value,
          /* doNotNormalizeTrue */
          true
        );
        if (deprecatedResult === false) {
          return;
        }
        if (deprecatedResult === true) {
          if (!this._hasDeprecationWarned(key)) {
            this._utils.logger.warn(this._deprecatedHandler(key, redirectTo, this._utils));
          }
        } else {
          for (const { value: deprecatedValue } of deprecatedResult) {
            const pair = { key, value: deprecatedValue };
            if (!this._hasDeprecationWarned(pair)) {
              const redirectToPair = typeof redirectTo === "string" ? { key: redirectTo, value: deprecatedValue } : redirectTo;
              this._utils.logger.warn(this._deprecatedHandler(pair, redirectToPair, this._utils));
            }
          }
        }
      };
      const forwardResult = normalizeForwardResult(schema.forward(value, this._utils), value);
      forwardResult.forEach(appendTransferredOptions);
      const redirectResult = normalizeRedirectResult(schema.redirect(value, this._utils), value);
      redirectResult.redirect.forEach(appendTransferredOptions);
      if ("remain" in redirectResult) {
        const remainingValue = redirectResult.remain;
        newOptions[key] = key in newOptions ? schema.overlap(newOptions[key], remainingValue, this._utils) : remainingValue;
        warnDeprecated({ value: remainingValue });
      }
      for (const { from, to } of redirectResult.redirect) {
        warnDeprecated({ value: from, redirectTo: to });
      }
    }
    for (const key of unknownKeys) {
      const value = options[key];
      this._applyUnknownHandler(key, value, newOptions, (knownResultKey, knownResultValue) => {
        transferredOptionsArray.push({ [knownResultKey]: knownResultValue });
      });
    }
    return transferredOptionsArray;
  }
  _applyRequiredCheck(options) {
    for (const key of Object.keys(this._utils.schemas)) {
      if (this._identifyMissing(key, options)) {
        if (this._identifyRequired(key)) {
          throw this._invalidHandler(key, VALUE_NOT_EXIST, this._utils);
        }
      }
    }
  }
  _partitionOptionKeys(options) {
    const [knownKeys, unknownKeys] = partition(Object.keys(options).filter((key) => !this._identifyMissing(key, options)), (key) => key in this._utils.schemas);
    return { knownKeys, unknownKeys };
  }
  _applyValidation(value, key, schema) {
    const validateResult = normalizeValidateResult(schema.validate(value, this._utils), value);
    if (validateResult !== true) {
      throw this._invalidHandler(key, validateResult.value, this._utils);
    }
  }
  _applyUnknownHandler(key, value, newOptions, knownResultHandler) {
    const unknownResult = this._unknownHandler(key, value, this._utils);
    if (!unknownResult) {
      return;
    }
    for (const resultKey of Object.keys(unknownResult)) {
      if (this._identifyMissing(resultKey, unknownResult)) {
        continue;
      }
      const resultValue = unknownResult[resultKey];
      if (resultKey in this._utils.schemas) {
        knownResultHandler(resultKey, resultValue);
      } else {
        newOptions[resultKey] = resultValue;
      }
    }
  }
  _applyPostprocess(options) {
    const postprocessed = this._postprocess(options, this._utils);
    if (postprocessed === VALUE_UNCHANGED) {
      return;
    }
    if (postprocessed.delete) {
      for (const deleteKey of postprocessed.delete) {
        delete options[deleteKey];
      }
    }
    if (postprocessed.override) {
      const { knownKeys, unknownKeys } = this._partitionOptionKeys(postprocessed.override);
      for (const key of knownKeys) {
        const value = postprocessed.override[key];
        this._applyValidation(value, key, this._utils.schemas[key]);
        options[key] = value;
      }
      for (const key of unknownKeys) {
        const value = postprocessed.override[key];
        this._applyUnknownHandler(key, value, options, (knownResultKey, knownResultValue) => {
          const schema = this._utils.schemas[knownResultKey];
          this._applyValidation(knownResultValue, knownResultKey, schema);
          options[knownResultKey] = knownResultValue;
        });
      }
    }
  }
};

// src/main/normalize-options.js
var hasDeprecationWarned;
function normalizeOptions(options, optionInfos, {
  logger = false,
  isCLI = false,
  passThrough = false,
  FlagSchema,
  descriptor
} = {}) {
  if (isCLI) {
    if (!FlagSchema) {
      throw new Error("'FlagSchema' option is required.");
    }
    if (!descriptor) {
      throw new Error("'descriptor' option is required.");
    }
  } else {
    descriptor = apiDescriptor;
  }
  const unknown = !passThrough ? (key, value, options2) => {
    const {
      _,
      ...schemas2
    } = options2.schemas;
    return levenUnknownHandler(key, value, {
      ...options2,
      schemas: schemas2
    });
  } : Array.isArray(passThrough) ? (key, value) => !passThrough.includes(key) ? void 0 : {
    [key]: value
  } : (key, value) => ({
    [key]: value
  });
  const schemas = optionInfosToSchemas(optionInfos, {
    isCLI,
    FlagSchema
  });
  const normalizer = new Normalizer(schemas, {
    logger,
    unknown,
    descriptor
  });
  const shouldSuppressDuplicateDeprecationWarnings = logger !== false;
  if (shouldSuppressDuplicateDeprecationWarnings && hasDeprecationWarned) {
    normalizer._hasDeprecationWarned = hasDeprecationWarned;
  }
  const normalized = normalizer.normalize(options);
  if (shouldSuppressDuplicateDeprecationWarnings) {
    hasDeprecationWarned = normalizer._hasDeprecationWarned;
  }
  return normalized;
}
function optionInfosToSchemas(optionInfos, {
  isCLI,
  FlagSchema
}) {
  const schemas = [];
  if (isCLI) {
    schemas.push(AnySchema.create({
      name: "_"
    }));
  }
  for (const optionInfo of optionInfos) {
    schemas.push(optionInfoToSchema(optionInfo, {
      isCLI,
      optionInfos,
      FlagSchema
    }));
    if (optionInfo.alias && isCLI) {
      schemas.push(AliasSchema.create({
        // @ts-expect-error
        name: optionInfo.alias,
        sourceName: optionInfo.name
      }));
    }
  }
  return schemas;
}
function optionInfoToSchema(optionInfo, {
  isCLI,
  optionInfos,
  FlagSchema
}) {
  const {
    name
  } = optionInfo;
  const parameters = {
    name
  };
  let SchemaConstructor;
  const handlers = {};
  switch (optionInfo.type) {
    case "int":
      SchemaConstructor = IntegerSchema;
      if (isCLI) {
        parameters.preprocess = Number;
      }
      break;
    case "string":
      SchemaConstructor = StringSchema;
      break;
    case "choice":
      SchemaConstructor = ChoiceSchema;
      parameters.choices = optionInfo.choices.map((choiceInfo) => choiceInfo?.redirect ? {
        ...choiceInfo,
        redirect: {
          to: {
            key: optionInfo.name,
            value: choiceInfo.redirect
          }
        }
      } : choiceInfo);
      break;
    case "boolean":
      SchemaConstructor = BooleanSchema;
      break;
    case "flag":
      SchemaConstructor = FlagSchema;
      parameters.flags = optionInfos.flatMap((optionInfo2) => [optionInfo2.alias, optionInfo2.description && optionInfo2.name, optionInfo2.oppositeDescription && `no-${optionInfo2.name}`].filter(Boolean));
      break;
    case "path":
      SchemaConstructor = StringSchema;
      break;
    default:
      throw new Error(`Unexpected type ${optionInfo.type}`);
  }
  if (optionInfo.exception) {
    parameters.validate = (value, schema, utils2) => optionInfo.exception(value) || schema.validate(value, utils2);
  } else {
    parameters.validate = (value, schema, utils2) => value === void 0 || schema.validate(value, utils2);
  }
  if (optionInfo.redirect) {
    handlers.redirect = (value) => !value ? void 0 : {
      to: typeof optionInfo.redirect === "string" ? optionInfo.redirect : {
        key: optionInfo.redirect.option,
        value: optionInfo.redirect.value
      }
    };
  }
  if (optionInfo.deprecated) {
    handlers.deprecated = true;
  }
  if (isCLI && !optionInfo.array) {
    const originalPreprocess = parameters.preprocess || ((x) => x);
    parameters.preprocess = (value, schema, utils2) => schema.preprocess(originalPreprocess(Array.isArray(value) ? method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      value,
      -1
    ) : value), utils2);
  }
  return optionInfo.array ? ArraySchema.create({
    ...isCLI ? {
      preprocess: (v) => Array.isArray(v) ? v : [v]
    } : {},
    ...handlers,
    // @ts-expect-error
    valueSchema: SchemaConstructor.create(parameters)
  }) : SchemaConstructor.create({
    ...parameters,
    ...handlers
  });
}
var normalize_options_default = normalizeOptions;

// scripts/build/shims/method-find-last.js
var arrayFindLast = Array.prototype.findLast ?? function(callback) {
  for (let index = this.length - 1; index >= 0; index--) {
    const element = this[index];
    if (callback(element, index, this)) {
      return element;
    }
  }
};
var findLast = /* @__PURE__ */ createMethodShim("findLast", function() {
  if (Array.isArray(this)) {
    return arrayFindLast;
  }
});
var method_find_last_default = findLast;

// src/main/front-matter/constants.js
var FRONT_MATTER_MARK = /* @__PURE__ */ Symbol.for("PRETTIER_IS_FRONT_MATTER");
var FRONT_MATTER_VISITOR_KEYS = [];

// src/main/front-matter/is-front-matter.js
function isFrontMatter(node) {
  return Boolean(node?.[FRONT_MATTER_MARK]);
}
var is_front_matter_default = isFrontMatter;

// src/main/front-matter/embed.js
var SUPPORTED_EMBED_LANGUAGES = /* @__PURE__ */ new Set(["yaml", "toml"]);
var isEmbedFrontMatter = ({ node }) => is_front_matter_default(node) && SUPPORTED_EMBED_LANGUAGES.has(node.language);
async function printEmbedFrontMatter(textToDoc2, print, path, options) {
  const { node } = path;
  const { language } = node;
  if (!SUPPORTED_EMBED_LANGUAGES.has(language)) {
    return;
  }
  const value = node.value.trim();
  let doc;
  if (value) {
    const parser = language === "yaml" ? language : infer_parser_default(options, { language });
    if (!parser) {
      return;
    }
    doc = value ? await textToDoc2(value, { parser }) : "";
  } else {
    doc = value;
  }
  return markAsRoot([
    node.startDelimiter,
    node.explicitLanguage ?? "",
    hardline,
    doc,
    doc ? hardline : "",
    node.endDelimiter
  ]);
}

// src/main/front-matter/clean.js
function clean(original, cloned) {
  if (isEmbedFrontMatter({ node: original })) {
    delete cloned.end;
    delete cloned.raw;
    delete cloned.value;
  }
  return cloned;
}
var clean_default = clean;

// src/main/front-matter/print.js
function printFrontMatter({ node }) {
  return node.raw;
}
var print_default = printFrontMatter;

// src/main/create-get-visitor-keys-function.js
var nonTraversableKeys = /* @__PURE__ */ new Set([
  "tokens",
  "comments",
  "parent",
  "enclosingNode",
  "precedingNode",
  "followingNode"
]);
var defaultGetVisitorKeys = (node) => Object.keys(node).filter((key) => !nonTraversableKeys.has(key));
function createGetVisitorKeysFunction(printerGetVisitorKeys, supportFrontMatter) {
  const getVisitorKeys = printerGetVisitorKeys ? (node) => printerGetVisitorKeys(node, nonTraversableKeys) : defaultGetVisitorKeys;
  if (!supportFrontMatter) {
    return getVisitorKeys;
  }
  return new Proxy(getVisitorKeys, {
    apply: (target, thisArgument, argumentsList) => is_front_matter_default(argumentsList[0]) ? FRONT_MATTER_VISITOR_KEYS : Reflect.apply(target, thisArgument, argumentsList)
  });
}
var create_get_visitor_keys_function_default = createGetVisitorKeysFunction;

// src/main/parser-and-printer.js
function getParserPluginByParserName(plugins, parserName) {
  if (!parserName) {
    throw new Error("parserName is required.");
  }
  const plugin = method_find_last_default(
    /* OPTIONAL_OBJECT: false */
    0,
    plugins,
    (plugin2) => plugin2.parsers && function_object_has_own_default(plugin2.parsers, parserName)
  );
  if (plugin) {
    return plugin;
  }
  let message = `Couldn't resolve parser "${parserName}".`;
  if (true) {
    message += " Plugins must be explicitly added to the standalone bundle.";
  }
  throw new ConfigError(message);
}
function getPrinterPluginByAstFormat(plugins, astFormat) {
  if (!astFormat) {
    throw new Error("astFormat is required.");
  }
  const plugin = method_find_last_default(
    /* OPTIONAL_OBJECT: false */
    0,
    plugins,
    (plugin2) => plugin2.printers && function_object_has_own_default(plugin2.printers, astFormat)
  );
  if (plugin) {
    return plugin;
  }
  let message = `Couldn't find plugin for AST format "${astFormat}".`;
  if (true) {
    message += " Plugins must be explicitly added to the standalone bundle.";
  }
  throw new ConfigError(message);
}
function resolveParser({
  plugins,
  parser
}) {
  const plugin = getParserPluginByParserName(plugins, parser);
  return initParser(plugin, parser);
}
function initParser(plugin, parserName) {
  const parserOrParserInitFunction = plugin.parsers[parserName];
  return typeof parserOrParserInitFunction === "function" ? parserOrParserInitFunction() : parserOrParserInitFunction;
}
async function initPrinter(plugin, astFormat) {
  const printerOrPrinterInitFunction = plugin.printers[astFormat];
  const printer2 = typeof printerOrPrinterInitFunction === "function" ? await printerOrPrinterInitFunction() : printerOrPrinterInitFunction;
  return normalizePrinter(printer2);
}
function normalizePrinterWithoutCache(printer2) {
  if (false) {
    noop_default(!printer2[PRINTER_NORMALIZED_MARK], "Unexpected printer normalization");
  }
  let {
    features,
    getVisitorKeys,
    embed: originalEmbed,
    massageAstNode: originalCleanFunction,
    print: originalPrint,
    ...printerRestProperties
  } = printer2;
  features = normalizePrinterFeatures(features);
  const frontMatterSupport = features.experimental_frontMatterSupport;
  getVisitorKeys = create_get_visitor_keys_function_default(
    getVisitorKeys,
    /** frontMatterVisitorKeys */
    frontMatterSupport.massageAstNode || frontMatterSupport.embed || frontMatterSupport.print
  );
  let massageAstNode = originalCleanFunction;
  if (originalCleanFunction && frontMatterSupport.massageAstNode) {
    massageAstNode = new Proxy(originalCleanFunction, {
      apply(target, thisArgument, argumentsList) {
        clean_default(...argumentsList);
        return Reflect.apply(target, thisArgument, argumentsList);
      }
    });
  }
  let embed = originalEmbed;
  if (originalEmbed) {
    let embedGetVisitorKeys;
    embed = new Proxy(originalEmbed, {
      get(target, property, receiver) {
        if (property === "getVisitorKeys") {
          embedGetVisitorKeys ?? (embedGetVisitorKeys = originalEmbed.getVisitorKeys ? create_get_visitor_keys_function_default(
            originalEmbed.getVisitorKeys,
            /** frontMatterVisitorKeys */
            frontMatterSupport.massageAstNode || frontMatterSupport.embed
          ) : getVisitorKeys);
          return embedGetVisitorKeys;
        }
        return Reflect.get(target, property, receiver);
      },
      apply: (target, thisArgument, argumentsList) => frontMatterSupport.embed && isEmbedFrontMatter(...argumentsList) ? printEmbedFrontMatter : Reflect.apply(target, thisArgument, argumentsList)
    });
  }
  let print = originalPrint;
  if (frontMatterSupport.print) {
    print = new Proxy(originalPrint, {
      apply(target, thisArgument, argumentsList) {
        const [path] = argumentsList;
        if (is_front_matter_default(path.node)) {
          return print_default(path);
        }
        return Reflect.apply(target, thisArgument, argumentsList);
      }
    });
  }
  const normalizedPrinter = {
    features,
    getVisitorKeys,
    embed,
    massageAstNode,
    print,
    ...printerRestProperties
  };
  if (false) {
    normalizedPrinter[PRINTER_NORMALIZED_MARK] = true;
  }
  return normalizedPrinter;
}
var normalizedPrinters = /* @__PURE__ */ new WeakMap();
function normalizePrinter(printer2) {
  return getOrInsertComputed(normalizedPrinters, printer2, normalizePrinterWithoutCache);
}
var PRINTER_FRONT_MATTER_SUPPORT_FEATURES = ["clean", "embed", "print"];
var PRINTER_FRONT_MATTER_SUPPORT_OFF = Object.fromEntries(PRINTER_FRONT_MATTER_SUPPORT_FEATURES.map((feature) => [feature, false]));
function normalizePrinterFrontMatterSupport(frontMatterSupport) {
  return {
    ...PRINTER_FRONT_MATTER_SUPPORT_OFF,
    ...frontMatterSupport
  };
}
function normalizePrinterFeatures(features) {
  return {
    experimental_avoidAstMutation: false,
    ...features,
    experimental_frontMatterSupport: normalizePrinterFrontMatterSupport(features?.experimental_frontMatterSupport)
  };
}

// src/main/normalize-format-options.js
var formatOptionsHiddenDefaults = {
  astFormat: "estree",
  printer: {},
  originalText: void 0,
  locStart: null,
  locEnd: null,
  getVisitorKeys: null
};
async function normalizeFormatOptions(options, opts = {}) {
  const rawOptions = { ...options };
  if (!rawOptions.parser) {
    if (!rawOptions.filepath) {
      throw new UndefinedParserError(
        "No parser and no file path given, couldn't infer a parser."
      );
    }
    rawOptions.parser = infer_parser_default(rawOptions, {
      physicalFile: rawOptions.filepath
    });
    if (!rawOptions.parser) {
      throw new UndefinedParserError(
        `No parser could be inferred for file "${rawOptions.filepath}".`
      );
    }
  }
  const supportOptions = getSupportInfo({
    plugins: options.plugins,
    showDeprecated: true
  }).options;
  const defaults = {
    ...formatOptionsHiddenDefaults,
    ...Object.fromEntries(
      supportOptions.filter((optionInfo) => optionInfo.default !== void 0).map((option) => [option.name, option.default])
    )
  };
  const parserPlugin = getParserPluginByParserName(
    rawOptions.plugins,
    rawOptions.parser
  );
  const parser = await initParser(parserPlugin, rawOptions.parser);
  rawOptions.astFormat = parser.astFormat;
  rawOptions.locEnd = parser.locEnd;
  rawOptions.locStart = parser.locStart;
  const printerPlugin = parserPlugin.printers?.[parser.astFormat] ? parserPlugin : getPrinterPluginByAstFormat(rawOptions.plugins, parser.astFormat);
  const printer2 = await initPrinter(printerPlugin, parser.astFormat);
  rawOptions.printer = printer2;
  rawOptions.getVisitorKeys = printer2.getVisitorKeys;
  const pluginDefaults = printerPlugin.defaultOptions ? Object.fromEntries(
    Object.entries(printerPlugin.defaultOptions).filter(
      ([, value]) => value !== void 0
    )
  ) : {};
  const mixedDefaults = { ...defaults, ...pluginDefaults };
  for (const [k, value] of Object.entries(mixedDefaults)) {
    rawOptions[k] ?? (rawOptions[k] = value);
  }
  if (rawOptions.parser === "json") {
    rawOptions.trailingComma = "none";
  }
  return normalize_options_default(rawOptions, supportOptions, {
    passThrough: Object.keys(formatOptionsHiddenDefaults),
    ...opts
  });
}
var normalize_format_options_default = normalizeFormatOptions;

// node_modules/@babel/code-frame/lib/common-shared.js
var NEWLINE = /\r\n|[\n\r\u2028\u2029]/;
function getMarkerLines(loc, source, opts, startLineBaseZero) {
  const startLoc = {
    column: null,
    line: -1,
    ...loc.start
  };
  const endLoc = {
    ...startLoc,
    ...loc.end
  };
  const {
    linesAbove = 2,
    linesBelow = 3
  } = opts || {};
  const startLine = startLoc.line - startLineBaseZero;
  const startColumn = startLoc.column;
  const endLine = endLoc.line - startLineBaseZero;
  const endColumn = endLoc.column;
  let start = Math.max(startLine - (linesAbove + 1), 0);
  let end = Math.min(source.length, endLine + linesBelow);
  if (startLine === -1) {
    start = 0;
  }
  if (endLine === -1) {
    end = source.length;
  }
  const lineDiff = endLine - startLine;
  const markerLines = {};
  if (lineDiff) {
    for (let i = 0; i <= lineDiff; i++) {
      const lineNumber = i + startLine;
      if (startColumn == null) {
        markerLines[lineNumber] = true;
      } else if (i === 0) {
        const sourceLength = source[lineNumber - 1].length;
        markerLines[lineNumber] = [startColumn, sourceLength - startColumn];
      } else if (i === lineDiff) {
        markerLines[lineNumber] = [0, endColumn];
      } else {
        const sourceLength = source[lineNumber - 1].length;
        markerLines[lineNumber] = [0, sourceLength];
      }
    }
  } else {
    if (startColumn === endColumn) {
      if (startColumn != null) {
        markerLines[startLine] = [startColumn, 0];
      } else {
        markerLines[startLine] = true;
      }
    } else {
      const safeStart = startColumn ?? 0;
      const safeEnd = endColumn ?? safeStart;
      markerLines[startLine] = [safeStart, safeEnd - safeStart];
    }
  }
  return {
    start,
    end,
    markerLines
  };
}
function _codeFrameColumns(rawLines, loc, opts = {}, colorOpts) {
  const {
    defs,
    highlight
  } = colorOpts || {
    defs: {
      gutter: String,
      marker: String,
      message: String,
      reset: String
    },
    highlight: String
  };
  const startLineBaseZero = (opts.startLine || 1) - 1;
  const lines = rawLines.split(NEWLINE);
  const {
    start,
    end,
    markerLines
  } = getMarkerLines(loc, lines, opts, startLineBaseZero);
  const hasColumns = loc.start && typeof loc.start.column === "number";
  const numberMaxWidth = String(end + startLineBaseZero).length;
  const highlightedLines = highlight(rawLines);
  let frame = highlightedLines.split(NEWLINE, end).slice(start, end).map((line2, index) => {
    const number = start + 1 + index;
    const paddedNumber = ` ${number + startLineBaseZero}`.slice(-numberMaxWidth);
    const gutter = ` ${paddedNumber} |`;
    const hasMarker = markerLines[number];
    const lastMarkerLine = !markerLines[number + 1];
    if (hasMarker) {
      let markerLine = "";
      if (Array.isArray(hasMarker)) {
        const markerSpacing = line2.slice(0, hasMarker[0]).replace(/[^\t]/g, " ");
        const numberOfMarkers = hasMarker[1] || 1;
        markerLine = ["\n ", defs.gutter(gutter.replace(/\d/g, " ")), " ", markerSpacing, defs.marker("^").repeat(numberOfMarkers)].join("");
        if (lastMarkerLine && opts.message) {
          markerLine += " " + defs.message(opts.message);
        }
      }
      return [defs.marker(">"), defs.gutter(gutter), line2.length > 0 ? ` ${line2}` : "", markerLine].join("");
    } else {
      return ` ${defs.gutter(gutter)}${line2.length > 0 ? ` ${line2}` : ""}`;
    }
  }).join("\n");
  if (opts.message && !hasColumns) {
    frame = `${" ".repeat(numberMaxWidth + 1)}${opts.message}
${frame}`;
  }
  return defs.reset(frame);
}

// node_modules/@babel/code-frame/lib/browser.js
function codeFrameColumns(rawLines, loc, opts = {}) {
  return _codeFrameColumns(rawLines, loc, opts);
}

// src/main/parse.js
async function parse(originalText, options) {
  const parser = await resolveParser(options);
  const text = parser.preprocess ? await parser.preprocess(originalText, options) : originalText;
  options.originalText = text;
  let ast;
  try {
    ast = await parser.parse(
      text,
      options,
      // TODO: remove the third argument in v4
      // The duplicated argument is passed as intended, see #10156
      options
    );
  } catch (error) {
    handleParseError(error, originalText);
  }
  return { text, ast };
}
function handleParseError(error, text) {
  const { loc } = error;
  if (loc) {
    let { start, end } = loc;
    start && (start = { line: start.line, column: start.column - 1 });
    end && (end = { line: end.line, column: end.column - 1 });
    const codeFrame = codeFrameColumns(
      text,
      { start, end },
      { highlightCode: true }
    );
    error.message += "\n" + codeFrame;
    error.codeFrame = codeFrame;
  }
  throw error;
}
var parse_default = parse;

// src/main/multiparser.js
async function printEmbeddedLanguages(path, genericPrint, options, printAstToDoc2, embeds) {
  if (options.embeddedLanguageFormatting !== "auto") {
    return;
  }
  const { printer: printer2 } = options;
  const { embed } = printer2;
  if (!embed) {
    return;
  }
  if (embed.length > 2) {
    throw new Error(
      "printer.embed has too many parameters. The API changed in Prettier v3. Please update your plugin. See https://prettier.io/docs/plugins#optional-embed"
    );
  }
  const { hasPrettierIgnore } = printer2;
  const { getVisitorKeys } = embed;
  const embedCallResults = [];
  recurse();
  const originalPathStack = path.stack;
  for (const { print, node, pathStack } of embedCallResults) {
    try {
      path.stack = pathStack;
      const doc = await print(textToDocForEmbed, genericPrint, path, options);
      if (doc) {
        embeds.set(node, doc);
      }
    } catch (error) {
      if (globalThis.PRETTIER_DEBUG) {
        throw error;
      }
    }
  }
  path.stack = originalPathStack;
  function textToDocForEmbed(text, partialNextOptions) {
    return textToDoc(text, partialNextOptions, options, printAstToDoc2);
  }
  function recurse() {
    const { node } = path;
    if (node === null || typeof node !== "object" || hasPrettierIgnore?.(path)) {
      return;
    }
    for (const key of getVisitorKeys(node)) {
      if (Array.isArray(node[key])) {
        path.each(recurse, key);
      } else {
        path.call(recurse, key);
      }
    }
    const result = embed(path, options);
    if (!result) {
      return;
    }
    if (typeof result === "function") {
      embedCallResults.push({
        print: result,
        node,
        pathStack: [...path.stack]
      });
      return;
    }
    if (false) {
      throw new Error(
        "`embed` should return an async function instead of Promise."
      );
    }
    embeds.set(node, result);
  }
}
async function textToDoc(text, partialNextOptions, parentOptions, printAstToDoc2) {
  const options = await normalize_format_options_default(
    {
      ...parentOptions,
      ...partialNextOptions,
      parentParser: parentOptions.parser,
      originalText: text,
      // Improve this if we calculate the relative index
      cursorOffset: void 0,
      rangeStart: void 0,
      rangeEnd: void 0
    },
    { passThrough: true }
  );
  const { ast } = await parse_default(text, options);
  const doc = await printAstToDoc2(ast, options);
  return stripTrailingHardline(doc);
}

// src/main/print-ignored.js
function printIgnored(path, options, printPath, args) {
  const {
    originalText,
    [commentsPropertyInOptions]: comments,
    locStart,
    locEnd,
    [/* @__PURE__ */ Symbol.for("printedComments")]: printedComments
  } = options;
  const { node } = path;
  const start = locStart(node);
  const end = locEnd(node);
  for (const comment of comments) {
    if (locStart(comment) >= start && locEnd(comment) <= end) {
      printedComments.add(comment);
    }
  }
  const { printPrettierIgnored } = options.printer;
  return printPrettierIgnored ? printPrettierIgnored(path, options, printPath, args) : originalText.slice(start, end);
}
var print_ignored_default = printIgnored;

// src/main/ast-to-doc.js
async function printAstToDoc(ast, options) {
  ({ ast } = await prepareToPrint(ast, options));
  const cache = /* @__PURE__ */ new Map();
  const path = new ast_path_default(ast);
  const ensurePrintingNode = create_print_pre_check_function_default(options);
  const embeds = /* @__PURE__ */ new Map();
  await printEmbeddedLanguages(path, mainPrint, options, printAstToDoc, embeds);
  const doc = await callPluginPrintFunction(
    path,
    options,
    mainPrint,
    void 0,
    embeds
  );
  ensureAllCommentsPrinted(options);
  if (options.cursorOffset >= 0) {
    if (options.nodeAfterCursor && !options.nodeBeforeCursor) {
      return [cursor, doc];
    }
    if (options.nodeBeforeCursor && !options.nodeAfterCursor) {
      return [doc, cursor];
    }
  }
  return doc;
  function mainPrint(selector, args) {
    if (selector === void 0 || selector === path) {
      return mainPrintInternal(args);
    }
    if (Array.isArray(selector)) {
      return path.call(() => mainPrintInternal(args), ...selector);
    }
    return path.call(() => mainPrintInternal(args), selector);
  }
  function mainPrintInternal(args) {
    ensurePrintingNode(path);
    const value = path.node;
    if (value === void 0 || value === null) {
      return "";
    }
    const shouldCache = is_object_default(value) && args === void 0;
    if (shouldCache && cache.has(value)) {
      return cache.get(value);
    }
    const doc2 = callPluginPrintFunction(path, options, mainPrint, args, embeds);
    if (shouldCache) {
      cache.set(value, doc2);
    }
    return doc2;
  }
}
function callPluginPrintFunction(path, options, printPath, args, embeds) {
  const { node } = path;
  const { printer: printer2 } = options;
  let doc;
  if (printer2.hasPrettierIgnore?.(path)) {
    doc = print_ignored_default(path, options, printPath, args);
  } else if (embeds.has(node)) {
    doc = embeds.get(node);
  } else {
    doc = printer2.print(path, options, printPath, args);
  }
  switch (node) {
    case options.cursorNode:
      doc = inheritLabel(doc, (doc2) => [cursor, doc2, cursor]);
      break;
    case options.nodeBeforeCursor:
      doc = inheritLabel(doc, (doc2) => [doc2, cursor]);
      break;
    case options.nodeAfterCursor:
      doc = inheritLabel(doc, (doc2) => [cursor, doc2]);
      break;
  }
  if (printer2.printComment && is_non_empty_array_default(node.comments) && !printer2.willPrintOwnComments?.(path, options)) {
    doc = printComments(path, doc, options);
  }
  return doc;
}
async function prepareToPrint(ast, options) {
  const comments = ast.comments ?? [];
  options[commentsPropertyInOptions] = comments;
  options[/* @__PURE__ */ Symbol.for("printedComments")] = /* @__PURE__ */ new Set();
  attachComments(ast, options);
  const {
    printer: { preprocess }
  } = options;
  ast = preprocess ? await preprocess(ast, options) : ast;
  return { ast, comments };
}

// src/main/get-cursor-node.js
function getCursorLocation(ast, options) {
  const { cursorOffset, locStart, locEnd, getVisitorKeys } = options;
  const nodeContainsCursor = (node) => locStart(node) <= cursorOffset && locEnd(node) >= cursorOffset;
  let cursorNode = ast;
  const nodesContainingCursor = [ast];
  for (const node of getDescendants(ast, {
    getVisitorKeys,
    filter: nodeContainsCursor
  })) {
    nodesContainingCursor.push(node);
    cursorNode = node;
  }
  if (isLeaf(cursorNode, { getVisitorKeys })) {
    return { cursorNode };
  }
  let nodeBeforeCursor;
  let nodeAfterCursor;
  let nodeBeforeCursorEndIndex = -1;
  let nodeAfterCursorStartIndex = Number.POSITIVE_INFINITY;
  while (nodesContainingCursor.length > 0 && (nodeBeforeCursor === void 0 || nodeAfterCursor === void 0)) {
    cursorNode = nodesContainingCursor.pop();
    const foundBeforeNode = nodeBeforeCursor !== void 0;
    const foundAfterNode = nodeAfterCursor !== void 0;
    for (const node of getChildren(cursorNode, { getVisitorKeys })) {
      if (!foundBeforeNode) {
        const nodeEnd = locEnd(node);
        if (nodeEnd <= cursorOffset && nodeEnd > nodeBeforeCursorEndIndex) {
          nodeBeforeCursor = node;
          nodeBeforeCursorEndIndex = nodeEnd;
        }
      }
      if (!foundAfterNode) {
        const nodeStart = locStart(node);
        if (nodeStart >= cursorOffset && nodeStart < nodeAfterCursorStartIndex) {
          nodeAfterCursor = node;
          nodeAfterCursorStartIndex = nodeStart;
        }
      }
    }
  }
  return {
    nodeBeforeCursor,
    nodeAfterCursor
  };
}
var get_cursor_node_default = getCursorLocation;

// src/main/massage-ast.js
function massageAst(ast, options) {
  const {
    printer: printer2
  } = options;
  const clean2 = printer2.massageAstNode;
  if (!clean2) {
    return ast;
  }
  const {
    getVisitorKeys
  } = printer2;
  const {
    ignoredProperties
  } = clean2;
  return recurse(ast);
  function recurse(original, parent) {
    if (!is_object_default(original)) {
      return original;
    }
    if (Array.isArray(original)) {
      return original.map((child) => recurse(child, parent)).filter(Boolean);
    }
    const cloned = {};
    const childrenKeys = new Set(getVisitorKeys(original));
    for (const key in original) {
      if (!function_object_has_own_default(original, key) || ignoredProperties?.has(key)) {
        continue;
      }
      if (childrenKeys.has(key)) {
        cloned[key] = recurse(original[key], original);
      } else {
        cloned[key] = original[key];
      }
    }
    const result = clean2(original, cloned, parent);
    if (result === null) {
      return;
    }
    return result ?? cloned;
  }
}
var massage_ast_default = massageAst;

// scripts/build/shims/method-find-last-index.js
var arrayFindLastIndex = Array.prototype.findLastIndex ?? function(callback) {
  for (let index = this.length - 1; index >= 0; index--) {
    const element = this[index];
    if (callback(element, index, this)) {
      return index;
    }
  }
  return -1;
};
var findLastIndex = /* @__PURE__ */ createMethodShim(
  "findLastIndex",
  function() {
    if (Array.isArray(this)) {
      return arrayFindLastIndex;
    }
  }
);
var method_find_last_index_default = findLastIndex;

// src/main/range.js
function findCommonAncestor(startNodeAndAncestors, endNodeAndAncestors) {
  endNodeAndAncestors = new Set(endNodeAndAncestors);
  return startNodeAndAncestors.find((node) => jsonSourceElements.has(node.type) && endNodeAndAncestors.has(node));
}
function dropRootParents(parents) {
  const index = method_find_last_index_default(
    /* OPTIONAL_OBJECT: false */
    0,
    parents,
    (node) => node.type !== "Program" && node.type !== "File"
  );
  if (index === -1) {
    return parents;
  }
  return parents.slice(0, index + 1);
}
function findSiblingAncestors(startNodeAndAncestors, endNodeAndAncestors, {
  locStart,
  locEnd
}) {
  let [resultStartNode, ...startNodeAncestors] = startNodeAndAncestors;
  let [resultEndNode, ...endNodeAncestors] = endNodeAndAncestors;
  if (resultStartNode === resultEndNode) {
    return [resultStartNode, resultEndNode];
  }
  const startNodeStart = locStart(resultStartNode);
  for (const endAncestor of dropRootParents(endNodeAncestors)) {
    if (locStart(endAncestor) >= startNodeStart) {
      resultEndNode = endAncestor;
    } else {
      break;
    }
  }
  const endNodeEnd = locEnd(resultEndNode);
  for (const startAncestor of dropRootParents(startNodeAncestors)) {
    if (locEnd(startAncestor) <= endNodeEnd) {
      resultStartNode = startAncestor;
    } else {
      break;
    }
    if (resultStartNode === resultEndNode) {
      break;
    }
  }
  return [resultStartNode, resultEndNode];
}
function findNodeAtOffset(node, offset, options, predicate, ancestors = [], type, locFunctions) {
  const {
    locStart,
    locEnd
  } = locFunctions;
  const start = locStart(node);
  const end = locEnd(node);
  if (offset > end || offset < start || type === "rangeEnd" && offset === start || type === "rangeStart" && offset === end) {
    return;
  }
  const nodeAndAncestors = [node, ...ancestors];
  const childNodes = get_sorted_child_nodes_default(node, nodeAndAncestors, {
    cache: childNodesCache,
    locStart,
    locEnd,
    getVisitorKeys: options.getVisitorKeys,
    // These two property should be removed, since we don't care if it can attach comment
    filter: options.printer.canAttachComment,
    getChildren: options.printer.getCommentChildNodes
  });
  for (const child of childNodes) {
    const childAndAncestors = findNodeAtOffset(child, offset, options, predicate, nodeAndAncestors, type, locFunctions);
    if (childAndAncestors) {
      return childAndAncestors;
    }
  }
  if (predicate(node, ancestors[0])) {
    return nodeAndAncestors;
  }
}
function isJsSourceElement(type, parentType) {
  return parentType !== "DeclareExportDeclaration" && type !== "TypeParameterDeclaration" && (type === "Directive" || type === "TypeAlias" || type === "TSExportAssignment" || type.startsWith("Declare") || type.startsWith("TSDeclare") || type.endsWith("Statement") || type.endsWith("Declaration"));
}
var jsonSourceElements = /* @__PURE__ */ new Set(["JsonRoot", "ObjectExpression", "ArrayExpression", "StringLiteral", "NumericLiteral", "BooleanLiteral", "NullLiteral", "UnaryExpression", "TemplateLiteral"]);
var graphqlSourceElements = /* @__PURE__ */ new Set(["OperationDefinition", "FragmentDefinition", "VariableDefinition", "TypeExtensionDefinition", "ObjectTypeDefinition", "FieldDefinition", "DirectiveDefinition", "EnumTypeDefinition", "EnumValueDefinition", "InputValueDefinition", "InputObjectTypeDefinition", "SchemaDefinition", "OperationTypeDefinition", "InterfaceTypeDefinition", "UnionTypeDefinition", "ScalarTypeDefinition"]);
function isSourceElement(opts, node, parentNode) {
  if (!node) {
    return false;
  }
  switch (opts.parser) {
    case "flow":
    case "hermes":
    case "babel":
    case "babel-flow":
    case "babel-ts":
    case "typescript":
    case "acorn":
    case "espree":
    case "meriyah":
    case "oxc":
    case "oxc-ts":
    case "yuku":
    case "yuku-ts":
    case "__babel_estree":
      return isJsSourceElement(node.type, parentNode?.type);
    case "json":
    case "json5":
    case "jsonc":
    case "json-stringify":
      return jsonSourceElements.has(node.type);
    case "graphql":
      return graphqlSourceElements.has(node.kind);
    case "vue":
      return node.tag !== "root";
  }
  return false;
}
function calculateRange(text, opts, ast) {
  let {
    rangeStart: start,
    rangeEnd: end
  } = opts;
  noop_default(end > start);
  const firstNonWhitespaceCharacterIndex = text.slice(start, end).search(/\S/);
  const isAllWhitespace = firstNonWhitespaceCharacterIndex === -1;
  if (!isAllWhitespace) {
    start += firstNonWhitespaceCharacterIndex;
    for (; end > start; --end) {
      if (/\S/.test(text[end - 1])) {
        break;
      }
    }
  }
  const locFunctions = opts.printer.features?.experimental_locForRangeFormat ?? opts;
  const startNodeAndAncestors = findNodeAtOffset(ast, start, opts, (node, parentNode) => isSourceElement(opts, node, parentNode), [], "rangeStart", locFunctions);
  if (!startNodeAndAncestors) {
    return;
  }
  const endNodeAndAncestors = (
    // No need find Node at `end`, it will be the same as `startNodeAndAncestors`
    isAllWhitespace ? startNodeAndAncestors : findNodeAtOffset(ast, end, opts, (node) => isSourceElement(opts, node), [], "rangeEnd", locFunctions)
  );
  if (!endNodeAndAncestors) {
    return;
  }
  let startNode;
  let endNode;
  if (ast.type === "JsonRoot") {
    const commonAncestor = findCommonAncestor(startNodeAndAncestors, endNodeAndAncestors);
    startNode = commonAncestor;
    endNode = commonAncestor;
  } else {
    [startNode, endNode] = findSiblingAncestors(startNodeAndAncestors, endNodeAndAncestors, opts);
  }
  const {
    locStart,
    locEnd
  } = locFunctions;
  return [Math.min(locStart(startNode), locStart(endNode)), Math.max(locEnd(startNode), locEnd(endNode))];
}

// src/main/core.js
var BOM = "\uFEFF";
var CURSOR = /* @__PURE__ */ Symbol("cursor");
async function coreFormat(originalText, opts, addAlignmentSize = 0) {
  if (!originalText || originalText.trim().length === 0) {
    return {
      formatted: "",
      cursorOffset: -1,
      comments: []
    };
  }
  const {
    ast,
    text
  } = await parse_default(originalText, opts);
  if (opts.cursorOffset >= 0) {
    opts = {
      ...opts,
      ...get_cursor_node_default(ast, opts)
    };
  }
  let doc = await printAstToDoc(ast, opts, addAlignmentSize);
  if (addAlignmentSize > 0) {
    doc = addAlignmentToDoc([hardline, doc], addAlignmentSize, opts.tabWidth);
  }
  const result = printDocToString(doc, opts);
  if (addAlignmentSize > 0) {
    const trimmed = result.formatted.trim();
    if (result.cursorNodeStart !== void 0) {
      result.cursorNodeStart -= result.formatted.indexOf(trimmed);
      if (result.cursorNodeStart < 0) {
        result.cursorNodeStart = 0;
        result.cursorNodeText = result.cursorNodeText.trimStart();
      }
      if (result.cursorNodeStart + result.cursorNodeText.length > trimmed.length) {
        result.cursorNodeText = result.cursorNodeText.trimEnd();
      }
    }
    result.formatted = trimmed + convertEndOfLineOptionToCharacter(opts.endOfLine);
  }
  const comments = opts[commentsPropertyInOptions];
  if (opts.cursorOffset >= 0) {
    let oldCursorRegionStart;
    let oldCursorRegionText;
    let newCursorRegionStart;
    let newCursorRegionText;
    if ((opts.cursorNode || opts.nodeBeforeCursor || opts.nodeAfterCursor) && result.cursorNodeText) {
      newCursorRegionStart = result.cursorNodeStart;
      newCursorRegionText = result.cursorNodeText;
      if (opts.cursorNode) {
        oldCursorRegionStart = opts.locStart(opts.cursorNode);
        oldCursorRegionText = text.slice(oldCursorRegionStart, opts.locEnd(opts.cursorNode));
      } else {
        if (!opts.nodeBeforeCursor && !opts.nodeAfterCursor) {
          throw new Error("Cursor location must contain at least one of cursorNode, nodeBeforeCursor, nodeAfterCursor");
        }
        oldCursorRegionStart = opts.nodeBeforeCursor ? opts.locEnd(opts.nodeBeforeCursor) : 0;
        const oldCursorRegionEnd = opts.nodeAfterCursor ? opts.locStart(opts.nodeAfterCursor) : text.length;
        oldCursorRegionText = text.slice(oldCursorRegionStart, oldCursorRegionEnd);
      }
    } else {
      oldCursorRegionStart = 0;
      oldCursorRegionText = text;
      newCursorRegionStart = 0;
      newCursorRegionText = result.formatted;
    }
    const cursorOffsetRelativeToOldCursorRegionStart = opts.cursorOffset - oldCursorRegionStart;
    if (oldCursorRegionText === newCursorRegionText) {
      return {
        formatted: result.formatted,
        cursorOffset: newCursorRegionStart + cursorOffsetRelativeToOldCursorRegionStart,
        comments
      };
    }
    const oldCursorNodeCharArray = oldCursorRegionText.split("");
    oldCursorNodeCharArray.splice(cursorOffsetRelativeToOldCursorRegionStart, 0, CURSOR);
    const newCursorNodeCharArray = newCursorRegionText.split("");
    const cursorNodeDiff = diffArrays(oldCursorNodeCharArray, newCursorNodeCharArray);
    let cursorOffset = newCursorRegionStart;
    for (const entry of cursorNodeDiff) {
      if (entry.removed) {
        if (entry.value.includes(CURSOR)) {
          break;
        }
      } else {
        cursorOffset += entry.count;
      }
    }
    return {
      formatted: result.formatted,
      cursorOffset,
      comments
    };
  }
  return {
    formatted: result.formatted,
    cursorOffset: -1,
    comments
  };
}
async function formatRange(originalText, opts) {
  const {
    ast,
    text
  } = await parse_default(originalText, opts);
  const [rangeStart, rangeEnd] = calculateRange(text, opts, ast) ?? [0, 0];
  const rangeString = text.slice(rangeStart, rangeEnd);
  const rangeStart2 = Math.min(rangeStart, text.lastIndexOf("\n", rangeStart) + 1);
  const indentString = text.slice(rangeStart2, rangeStart).match(/^\s*/)[0];
  const alignmentSize = get_alignment_size_default(indentString, opts.tabWidth);
  const rangeResult = await coreFormat(rangeString, {
    ...opts,
    rangeStart: 0,
    rangeEnd: Number.POSITIVE_INFINITY,
    // Track the cursor offset only if it's within our range
    cursorOffset: opts.cursorOffset > rangeStart && opts.cursorOffset <= rangeEnd ? opts.cursorOffset - rangeStart : -1,
    // Always use `lf` to format, we'll replace it later
    endOfLine: "lf"
  }, alignmentSize);
  const rangeTrimmed = rangeResult.formatted.trimEnd();
  let {
    cursorOffset
  } = opts;
  if (cursorOffset > rangeEnd) {
    cursorOffset += rangeTrimmed.length - rangeString.length;
  } else if (rangeResult.cursorOffset >= 0) {
    cursorOffset = rangeResult.cursorOffset + rangeStart;
  }
  let formatted = text.slice(0, rangeStart) + rangeTrimmed + text.slice(rangeEnd);
  if (opts.endOfLine !== "lf") {
    const eol = convertEndOfLineOptionToCharacter(opts.endOfLine);
    if (cursorOffset >= 0 && eol === "\r\n") {
      cursorOffset += countEndOfLineCharacters(formatted.slice(0, cursorOffset), "\n");
    }
    formatted = method_replace_all_default(
      /* OPTIONAL_OBJECT: false */
      0,
      formatted,
      "\n",
      eol
    );
  }
  return {
    formatted,
    cursorOffset,
    comments: rangeResult.comments
  };
}
function ensureIndexInText(text, index, defaultValue) {
  if (typeof index !== "number" || Number.isNaN(index) || index < 0 || index > text.length) {
    return defaultValue;
  }
  return index;
}
function normalizeIndexes(text, options) {
  let {
    cursorOffset,
    rangeStart,
    rangeEnd
  } = options;
  cursorOffset = ensureIndexInText(text, cursorOffset, -1);
  rangeStart = ensureIndexInText(text, rangeStart, 0);
  rangeEnd = ensureIndexInText(text, rangeEnd, text.length);
  return {
    ...options,
    cursorOffset,
    rangeStart,
    rangeEnd
  };
}
function normalizeInputAndOptions(text, options) {
  let {
    cursorOffset,
    rangeStart,
    rangeEnd,
    endOfLine
  } = normalizeIndexes(text, options);
  const hasBOM = text.charAt(0) === BOM;
  if (hasBOM) {
    text = text.slice(1);
    cursorOffset--;
    rangeStart--;
    rangeEnd--;
  }
  if (endOfLine === "auto") {
    endOfLine = guessEndOfLine(text);
  }
  if (text.includes("\r")) {
    const countCrlfBefore = (index) => countEndOfLineCharacters(text.slice(0, Math.max(index, 0)), "\r\n");
    cursorOffset -= countCrlfBefore(cursorOffset);
    rangeStart -= countCrlfBefore(rangeStart);
    rangeEnd -= countCrlfBefore(rangeEnd);
    text = normalizeEndOfLine(text);
  }
  return {
    hasBOM,
    text,
    options: normalizeIndexes(text, {
      ...options,
      cursorOffset,
      rangeStart,
      rangeEnd,
      endOfLine
    })
  };
}
async function hasPragma(text, options) {
  const selectedParser = await resolveParser(options);
  return !selectedParser.hasPragma || selectedParser.hasPragma(text);
}
async function hasIgnorePragma(text, options) {
  const selectedParser = await resolveParser(options);
  return selectedParser.hasIgnorePragma?.(text);
}
async function formatWithCursor(originalText, originalOptions) {
  let {
    hasBOM,
    text,
    options
  } = normalizeInputAndOptions(originalText, await normalize_format_options_default(originalOptions));
  if (options.rangeStart >= options.rangeEnd && text !== "" || options.requirePragma && !await hasPragma(text, options) || options.checkIgnorePragma && await hasIgnorePragma(text, options)) {
    return {
      formatted: originalText,
      cursorOffset: originalOptions.cursorOffset,
      comments: []
    };
  }
  let result;
  if (options.rangeStart > 0 || options.rangeEnd < text.length) {
    result = await formatRange(text, options);
  } else {
    if (!options.requirePragma && options.insertPragma && options.printer.insertPragma && !await hasPragma(text, options)) {
      text = options.printer.insertPragma(text);
    }
    result = await coreFormat(text, options);
  }
  if (hasBOM) {
    result.formatted = BOM + result.formatted;
    if (result.cursorOffset >= 0) {
      result.cursorOffset++;
    }
  }
  return result;
}
async function parse2(originalText, originalOptions, devOptions) {
  const {
    text,
    options
  } = normalizeInputAndOptions(originalText, await normalize_format_options_default(originalOptions));
  const parsed = await parse_default(text, options);
  if (devOptions) {
    if (devOptions.preprocessForPrint) {
      parsed.ast = await prepareToPrint(parsed.ast, options);
    }
    if (devOptions.massage) {
      parsed.ast = massage_ast_default(parsed.ast, options);
    }
  }
  return parsed;
}
async function formatAst(ast, options) {
  options = await normalize_format_options_default(options);
  const doc = await printAstToDoc(ast, options);
  return printDocToString(doc, options);
}
async function formatDoc(doc, options) {
  const text = printDocToDebug(doc);
  const {
    formatted
  } = await formatWithCursor(text, {
    ...options,
    parser: "__js_expression"
  });
  return formatted;
}
async function printToDoc(originalText, options) {
  options = await normalize_format_options_default(options);
  const {
    ast
  } = await parse_default(originalText, options);
  if (options.cursorOffset >= 0) {
    options = {
      ...options,
      ...get_cursor_node_default(ast, options)
    };
  }
  return printAstToDoc(ast, options);
}
async function printDocToString2(doc, options) {
  return printDocToString(doc, await normalize_format_options_default(options));
}

// src/document/public.js
var public_exports = {};
__export(public_exports, {
  builders: () => builders,
  printer: () => printer,
  utils: () => utils
});
var builders = {
  join,
  line,
  softline,
  hardline,
  literalline,
  group,
  conditionalGroup,
  fill,
  lineSuffix,
  lineSuffixBoundary,
  cursor,
  breakParent,
  ifBreak,
  trim,
  indent,
  indentIfBreak,
  align,
  addAlignmentToDoc,
  markAsRoot,
  dedentToRoot,
  dedent,
  hardlineWithoutBreakParent,
  literallineWithoutBreakParent,
  label,
  // TODO: Remove this in v4
  concat: (parts) => parts
};
var printer = { printDocToString };
var utils = {
  willBreak,
  traverseDoc: traverse_doc_default,
  findInDoc,
  mapDoc,
  removeLines,
  stripTrailingHardline,
  replaceEndOfLine,
  canBreak
};

// src/main/version.evaluate.js
var version_evaluate_default = "3.9.9";

// src/utilities/public.js
var public_exports2 = {};
__export(public_exports2, {
  addDanglingComment: () => addDanglingComment,
  addLeadingComment: () => addLeadingComment,
  addTrailingComment: () => addTrailingComment,
  getAlignmentSize: () => get_alignment_size_default,
  getIndentSize: () => get_indent_size_default,
  getMaxContinuousCount: () => get_max_continuous_count_default,
  getNextNonSpaceNonCommentCharacter: () => get_next_non_space_non_comment_character_default,
  getNextNonSpaceNonCommentCharacterIndex: () => getNextNonSpaceNonCommentCharacterIndex2,
  getPreferredQuote: () => getPreferredQuote,
  getStringWidth: () => get_string_width_default,
  hasNewline: () => has_newline_default,
  hasNewlineInRange: () => has_newline_in_range_default,
  hasSpaces: () => has_spaces_default,
  isNextLineEmpty: () => isNextLineEmpty2,
  isNextLineEmptyAfterIndex: () => is_next_line_empty_default,
  isPreviousLineEmpty: () => isPreviousLineEmpty2,
  makeString: () => makeString,
  skip: () => skip,
  skipEverythingButNewLine: () => skipEverythingButNewLine,
  skipInlineComment: () => skip_inline_comment_default,
  skipNewline: () => skip_newline_default,
  skipSpaces: () => skipSpaces,
  skipToLineEnd: () => skipToLineEnd,
  skipTrailingComment: () => skip_trailing_comment_default,
  skipWhitespace: () => skipWhitespace
});

// src/utilities/skip-inline-comment.js
function skipInlineComment(text, startIndex) {
  if (startIndex === false) {
    return false;
  }
  if (text.charAt(startIndex) === "/" && text.charAt(startIndex + 1) === "*") {
    for (let i = startIndex + 2; i < text.length; ++i) {
      if (text.charAt(i) === "*" && text.charAt(i + 1) === "/") {
        return i + 2;
      }
    }
  }
  return startIndex;
}
var skip_inline_comment_default = skipInlineComment;

// src/utilities/skip-trailing-comment.js
function skipTrailingComment(text, startIndex) {
  if (startIndex === false) {
    return false;
  }
  if (text.charAt(startIndex) === "/" && text.charAt(startIndex + 1) === "/") {
    return skipEverythingButNewLine(text, startIndex);
  }
  return startIndex;
}
var skip_trailing_comment_default = skipTrailingComment;

// src/utilities/get-next-non-space-non-comment-character-index.js
function getNextNonSpaceNonCommentCharacterIndex(text, startIndex) {
  let oldIdx = null;
  let nextIdx = startIndex;
  while (nextIdx !== oldIdx) {
    oldIdx = nextIdx;
    nextIdx = skipSpaces(text, nextIdx);
    nextIdx = skip_inline_comment_default(text, nextIdx);
    nextIdx = skip_trailing_comment_default(text, nextIdx);
    nextIdx = skip_newline_default(text, nextIdx);
  }
  return nextIdx;
}
var get_next_non_space_non_comment_character_index_default = getNextNonSpaceNonCommentCharacterIndex;

// src/utilities/is-next-line-empty.js
function isNextLineEmpty(text, startIndex) {
  let oldIdx = null;
  let idx = startIndex;
  while (idx !== oldIdx) {
    oldIdx = idx;
    idx = skipToLineEnd(text, idx);
    idx = skip_inline_comment_default(text, idx);
    idx = skipSpaces(text, idx);
  }
  idx = skip_trailing_comment_default(text, idx);
  idx = skip_newline_default(text, idx);
  return idx !== false && has_newline_default(text, idx);
}
var is_next_line_empty_default = isNextLineEmpty;

// src/utilities/get-indent-size.js
function getIndentSize(value, tabWidth) {
  const lastNewlineIndex = value.lastIndexOf("\n");
  if (lastNewlineIndex === -1) {
    return 0;
  }
  return get_alignment_size_default(
    // All the leading whitespaces
    value.slice(lastNewlineIndex + 1).match(/^[\t ]*/)[0],
    tabWidth
  );
}
var get_indent_size_default = getIndentSize;

// node_modules/escape-string-regexp/index.js
function escapeStringRegexp(string) {
  if (typeof string !== "string") {
    throw new TypeError("Expected a string");
  }
  return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}

// src/utilities/get-max-continuous-count.js
function getMaxContinuousCount(text, searchString) {
  let results = text.matchAll(
    new RegExp(`(?:${escapeStringRegexp(searchString)})+`, "g")
  );
  if (!results.reduce) {
    results = [...results];
  }
  return results.reduce(
    (maxCount, [result]) => Math.max(maxCount, result.length),
    0
  ) / searchString.length;
}
var get_max_continuous_count_default = getMaxContinuousCount;

// src/utilities/get-next-non-space-non-comment-character.js
function getNextNonSpaceNonCommentCharacter(text, startIndex) {
  const index = get_next_non_space_non_comment_character_index_default(text, startIndex);
  return index === false ? "" : text.charAt(index);
}
var get_next_non_space_non_comment_character_default = getNextNonSpaceNonCommentCharacter;

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

// src/utilities/has-newline-in-range.js
function hasNewlineInRange(text, startIndex, endIndex) {
  for (let i = startIndex; i < endIndex; ++i) {
    if (text.charAt(i) === "\n") {
      return true;
    }
  }
  return false;
}
var has_newline_in_range_default = hasNewlineInRange;

// src/utilities/has-spaces.js
function hasSpaces(text, startIndex, options = {}) {
  const idx = skipSpaces(
    text,
    options.backwards ? startIndex - 1 : startIndex,
    options
  );
  return idx !== startIndex;
}
var has_spaces_default = hasSpaces;

// src/utilities/public.js
function legacyGetNextNonSpaceNonCommentCharacterIndex(text, node, locEnd) {
  return get_next_non_space_non_comment_character_index_default(text, locEnd(node));
}
function getNextNonSpaceNonCommentCharacterIndex2(text, startIndex) {
  return arguments.length === 2 || typeof startIndex === "number" ? get_next_non_space_non_comment_character_index_default(text, startIndex) : (
    // @ts-expect-error -- expected
    // eslint-disable-next-line prefer-rest-params
    legacyGetNextNonSpaceNonCommentCharacterIndex(...arguments)
  );
}
function legacyIsPreviousLineEmpty(text, node, locStart) {
  return is_previous_line_empty_default(text, locStart(node));
}
function isPreviousLineEmpty2(text, startIndex) {
  return arguments.length === 2 || typeof startIndex === "number" ? is_previous_line_empty_default(text, startIndex) : (
    // @ts-expect-error -- expected
    // eslint-disable-next-line prefer-rest-params
    legacyIsPreviousLineEmpty(...arguments)
  );
}
function legacyIsNextLineEmpty(text, node, locEnd) {
  return is_next_line_empty_default(text, locEnd(node));
}
function makeString(rawText, enclosingQuote, unescapeUnnecessaryEscapes) {
  const otherQuote = enclosingQuote === '"' ? "'" : '"';
  const regex = /\\(.)|(["'])/gs;
  const raw = method_replace_all_default(
    /* OPTIONAL_OBJECT: false */
    0,
    rawText,
    regex,
    (match, escaped, quote) => {
      if (escaped === otherQuote) {
        return escaped;
      }
      if (quote === enclosingQuote) {
        return "\\" + quote;
      }
      if (quote) {
        return quote;
      }
      return unescapeUnnecessaryEscapes && /^[^\n\r"'0-7\\bfnrt-vx\u2028\u2029]$/.test(escaped) ? escaped : "\\" + escaped;
    }
  );
  return enclosingQuote + raw + enclosingQuote;
}
function isNextLineEmpty2(text, startIndex) {
  return arguments.length === 2 || typeof startIndex === "number" ? is_next_line_empty_default(text, startIndex) : (
    // @ts-expect-error -- expected
    // eslint-disable-next-line prefer-rest-params
    legacyIsNextLineEmpty(...arguments)
  );
}

// src/standalone.js
function withPlugins(fn, optionsArgumentIndex = 1) {
  return async (...args) => {
    const options = args[optionsArgumentIndex] ?? {};
    const plugins = options.plugins ?? [];
    args[optionsArgumentIndex] = {
      ...options,
      plugins: Array.isArray(plugins) ? plugins : Object.values(plugins)
    };
    return await fn(...args);
  };
}
var formatWithCursor2 = withPlugins(formatWithCursor);
async function format(text, options) {
  const { formatted } = await formatWithCursor2(text, {
    ...options,
    cursorOffset: -1
  });
  return formatted;
}
async function check(text, options) {
  return await format(text, options) === text;
}
var getSupportInfo2 = withPlugins(getSupportInfo, 0);
var debugApis = {
  parse: withPlugins(parse2),
  formatAST: withPlugins(formatAst),
  formatDoc: withPlugins(formatDoc),
  printToDoc: withPlugins(printToDoc),
  printDocToString: withPlugins(printDocToString2)
};
export {
  debugApis as __debug,
  check,
  standalone_exports as default,
  public_exports as doc,
  format,
  formatWithCursor2 as formatWithCursor,
  getSupportInfo2 as getSupportInfo,
  public_exports2 as util,
  version_evaluate_default as version
};
