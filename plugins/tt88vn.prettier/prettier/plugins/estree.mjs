var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/plugins/estree.js
var estree_exports = {};
__export(estree_exports, {
  languages: () => languages,
  options: () => options_default,
  printers: () => printers2
});

// src/language-js/languages.evaluate.js
var languages_evaluate_default = [
  {
    "name": "JavaScript",
    "type": "programming",
    "aceMode": "javascript",
    "extensions": [
      ".js",
      "._js",
      ".bones",
      ".cjs",
      ".es",
      ".es6",
      ".gs",
      ".jake",
      ".javascript",
      ".jsb",
      ".jscad",
      ".jsfl",
      ".jslib",
      ".jsm",
      ".jspre",
      ".jss",
      ".mjs",
      ".njs",
      ".pac",
      ".sjs",
      ".ssjs",
      ".xsjs",
      ".xsjslib",
      ".start.frag",
      ".end.frag",
      ".wxs"
    ],
    "filenames": [
      "Jakefile",
      "start.frag",
      "end.frag"
    ],
    "tmScope": "source.js",
    "aliases": [
      "js",
      "node"
    ],
    "codemirrorMode": "javascript",
    "codemirrorMimeType": "text/javascript",
    "interpreters": [
      "bun",
      "chakra",
      "d8",
      "deno",
      "gjs",
      "js",
      "node",
      "nodejs",
      "qjs",
      "rhino",
      "v8",
      "v8-shell",
      "zx"
    ],
    "parsers": [
      "babel",
      "acorn",
      "espree",
      "meriyah",
      "babel-flow",
      "babel-ts",
      "flow",
      "typescript"
    ],
    "vscodeLanguageIds": [
      "javascript",
      "mongo"
    ],
    "linguistLanguageId": 183
  },
  {
    "name": "Flow",
    "type": "programming",
    "aceMode": "javascript",
    "extensions": [
      ".js.flow"
    ],
    "filenames": [],
    "tmScope": "source.js",
    "aliases": [],
    "codemirrorMode": "javascript",
    "codemirrorMimeType": "text/javascript",
    "interpreters": [
      "bun",
      "chakra",
      "d8",
      "deno",
      "gjs",
      "js",
      "node",
      "nodejs",
      "qjs",
      "rhino",
      "v8",
      "v8-shell"
    ],
    "parsers": [
      "flow",
      "babel-flow"
    ],
    "vscodeLanguageIds": [
      "javascript"
    ],
    "linguistLanguageId": 183
  },
  {
    "name": "JSX",
    "type": "programming",
    "aceMode": "javascript",
    "extensions": [
      ".jsx"
    ],
    "filenames": void 0,
    "tmScope": "source.js.jsx",
    "aliases": void 0,
    "codemirrorMode": "jsx",
    "codemirrorMimeType": "text/jsx",
    "interpreters": void 0,
    "parsers": [
      "babel",
      "babel-flow",
      "babel-ts",
      "flow",
      "typescript",
      "espree",
      "meriyah"
    ],
    "vscodeLanguageIds": [
      "javascriptreact"
    ],
    "group": "JavaScript",
    "linguistLanguageId": 183
  },
  {
    "name": "TypeScript",
    "type": "programming",
    "aceMode": "typescript",
    "extensions": [
      ".ts",
      ".cts",
      ".mts"
    ],
    "tmScope": "source.ts",
    "aliases": [
      "ts"
    ],
    "codemirrorMode": "javascript",
    "codemirrorMimeType": "application/typescript",
    "interpreters": [
      "bun",
      "deno",
      "ts-node",
      "tsx"
    ],
    "parsers": [
      "typescript",
      "babel-ts"
    ],
    "vscodeLanguageIds": [
      "typescript"
    ],
    "linguistLanguageId": 378
  },
  {
    "name": "TSX",
    "type": "programming",
    "aceMode": "tsx",
    "extensions": [
      ".tsx"
    ],
    "tmScope": "source.tsx",
    "aliases": [
      "typescriptreact"
    ],
    "codemirrorMode": "jsx",
    "codemirrorMimeType": "text/typescript-jsx",
    "group": "TypeScript",
    "parsers": [
      "typescript",
      "babel-ts"
    ],
    "vscodeLanguageIds": [
      "typescriptreact"
    ],
    "linguistLanguageId": 94901924
  }
];

// src/language-js/printers.js
var printers_exports = {};
__export(printers_exports, {
  estree: () => estree
});

// src/utilities/is-non-empty-array.js
function isNonEmptyArray(object) {
  return Array.isArray(object) && object.length > 0;
}
var is_non_empty_array_default = isNonEmptyArray;

// src/utilities/noop.js
var noop = () => {
};
var noop_default = noop;

// src/language-js/utilities/create-type-check-function.js
function createTypeCheckFunction(typesArray) {
  const types = new Set(typesArray);
  if (false) {
    noop_default(
      typesArray.length,
      types.size,
      "'typesArray' should be unique."
    );
  }
  return (node) => types.has(node?.type);
}

// scripts/build/shims/shared.js
var OPTIONAL_OBJECT = 1;
var createMethodShim = (methodName, getImplementation) => (flags, object, ...arguments_) => {
  if (flags | OPTIONAL_OBJECT && (object === void 0 || object === null)) {
    return;
  }
  const implementation = getImplementation.call(object) ?? object[methodName];
  return implementation.apply(object, arguments_);
};

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

// src/utilities/get-or-insert.js
function getOrInsertComputed(map, key, callback) {
  if (!map.has(key)) {
    const value = callback(key);
    map.set(key, value);
  }
  return map.get(key);
}

// src/language-js/utilities/function-parameters.js
function getFunctionParametersWithoutCache(node) {
  const parameters = [];
  if (node.this) {
    parameters.push(node.this);
  }
  parameters.push(...node.params);
  if (node.rest) {
    parameters.push(node.rest);
  }
  return parameters;
}
var functionParametersCache = /* @__PURE__ */ new WeakMap();
function getFunctionParameters(node) {
  return getOrInsertComputed(functionParametersCache, node, getFunctionParametersWithoutCache);
}
function iterateFunctionParametersPath(path, iteratee) {
  const {
    node
  } = path;
  let index = 0;
  const callback = () => iteratee(path, index++);
  if (node.this) {
    path.call(callback, "this");
  }
  path.each(callback, "params");
  if (node.rest) {
    path.call(callback, "rest");
  }
}
function hasRestParameter(node) {
  if (node.rest) {
    return true;
  }
  const parameters = getFunctionParameters(node);
  return method_at_default(
    /* OPTIONAL_OBJECT: false */
    0,
    parameters,
    -1
  )?.type === "RestElement";
}

// src/language-js/utilities/is-as-const-expression.js
var isTsAsConstExpression = (node) => node?.type === "TSAsExpression" && node.typeAnnotation.type === "TSTypeReference" && node.typeAnnotation.typeName.type === "Identifier" && node.typeAnnotation.typeName.name === "const";

// src/language-js/utilities/is-meaningful-empty-statement.js
function isMeaningfulEmptyStatement({ node, parent }) {
  if (node?.type !== "EmptyStatement") {
    return false;
  }
  if (parent.type === "IfStatement") {
    return parent.consequent === node || parent.alternate === node;
  }
  if (parent.type === "DoWhileStatement" || parent.type === "ForInStatement" || parent.type === "ForOfStatement" || parent.type === "ForStatement" || parent.type === "LabeledStatement" || parent.type === "WithStatement" || parent.type === "WhileStatement") {
    return parent.body === node;
  }
  return false;
}

// src/language-js/utilities/is-method.js
function isMethod(node) {
  return node.method && node.kind === "init" || node.kind === "get" || node.kind === "set";
}

// src/language-js/location/is-index.js
var isIndex = (value) => Number.isSafeInteger(value) && value >= 0;

// src/language-js/location/end-with-full-text.js
function locEndWithFullText(node) {
  const end = node.range?.[1] ?? node.end;
  if (false) {
    throw new TypeError("Can't not locate node.");
  }
  return end;
}

// src/language-js/location/start.js
function locStart(node) {
  const start = node.range?.[0] ?? node.start;
  if (false) {
    throw new TypeError("Can't not locate node.");
  }
  const firstDecorator = (node.declaration?.decorators ?? node.decorators)?.[0];
  if (firstDecorator) {
    return Math.min(locStart(firstDecorator), start);
  }
  return start;
}

// src/language-js/location/overrides.js
var BREAK_KEYWORD_LENGTH = "break".length;
var CONTINUE_KEYWORD_LENGTH = "continue".length;
var DEBUGGER_KEYWORD_LENGTH = "debugger".length;
var overrideBreakOrContinueEnd = (
  /**
  @param {BREAK_KEYWORD_LENGTH | CONTINUE_KEYWORD_LENGTH} keywordLength
  @returns {LocEndOverride<NodeMap["BreakStatement"] | NodeMap["ContinueStatement"]>}
  */
  (keywordLength) => (node) => node.label ? locEnd(node.label) : locStart(node) + keywordLength
);
var getContentEnd = (node) => node.__contentEnd ?? locEndWithFullText(node);
var nodeTypesWithContentEnd = (
  /** @type {const} */
  ["ExpressionStatement", "Directive", "ImportDeclaration", "ExportDefaultDeclaration", "ExportNamedDeclaration", "ExportAllDeclaration", "ReturnStatement", "ThrowStatement", "DoWhileStatement"]
);
var overrides = (
  // @ts-expect-error -- Unknown
  new Map([
    ["BreakStatement", overrideBreakOrContinueEnd(BREAK_KEYWORD_LENGTH)],
    ["ContinueStatement", overrideBreakOrContinueEnd(CONTINUE_KEYWORD_LENGTH)],
    ["DebuggerStatement", (node) => locStart(node) + DEBUGGER_KEYWORD_LENGTH],
    // @ts-expect-error -- ignore
    ["VariableDeclaration", (node) => locEnd(method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      node.declarations,
      -1
    ))],
    ...nodeTypesWithContentEnd.map((type) => [type, getContentEnd])
  ])
);
var shouldAddContentEnd = createTypeCheckFunction(nodeTypesWithContentEnd);
var shouldIgnoredNodePrintSemicolon = (node) => {
  if (shouldAddContentEnd(node) && node.__contentEnd) {
    return true;
  }
  const {
    type
  } = node;
  if (type === "BreakStatement" || type === "ContinueStatement" || type === "DebuggerStatement" || type === "VariableDeclaration") {
    return true;
  }
  if (type === "IfStatement") {
    return shouldIgnoredNodePrintSemicolon(node.alternate ?? node.consequent);
  }
  if (type === "ForInStatement" || type === "ForOfStatement" || type === "ForStatement" || type === "LabeledStatement" || type === "WithStatement" || type === "WhileStatement") {
    return shouldIgnoredNodePrintSemicolon(node.body);
  }
  return false;
};
function locEnd(node) {
  const {
    type
  } = node;
  if (type === "IfStatement") {
    return locEnd(node.alternate ?? node.consequent);
  }
  if (type === "ForInStatement" || type === "ForOfStatement" || type === "ForStatement" || type === "LabeledStatement" || type === "WithStatement" || type === "WhileStatement") {
    return locEnd(node.body);
  }
  return overrides.get(type)?.(
    // @ts-expect-error -- Comment types
    node
  ) ?? locEndWithFullText(node);
}

// src/language-js/location/comparison.js
function hasSameLocStart(nodeA, nodeB) {
  const nodeAStart = locStart(nodeA);
  return isIndex(nodeAStart) && nodeAStart === locStart(nodeB);
}
function hasSameLocEnd(nodeA, nodeB) {
  const nodeAEnd = locEnd(nodeA);
  return isIndex(nodeAEnd) && nodeAEnd === locEnd(nodeB);
}
function hasSameLoc(nodeA, nodeB) {
  return hasSameLocStart(nodeA, nodeB) && hasSameLocEnd(nodeA, nodeB);
}

// src/language-js/utilities/get-raw.js
function getRaw(node) {
  return node.extra?.raw ?? node.raw;
}

// src/language-js/utilities/literal.js
function isBigIntLiteral(node) {
  return node.type === "BigIntLiteral" || node.type === "Literal" && // @ts-expect-error -- Safe
  Boolean(node.bigint);
}
function isBooleanLiteral(node) {
  return node.type === "BooleanLiteral" || node.type === "Literal" && typeof node.value === "boolean";
}
function isNumericLiteral(node) {
  return node.type === "NumericLiteral" || node.type === "Literal" && typeof node.value === "number";
}
function isRegExpLiteral(node) {
  return node.type === "RegExpLiteral" || node.type === "Literal" && // @ts-expect-error -- Safe
  Boolean(node.regex);
}
function isStringLiteral(node) {
  return node?.type === "StringLiteral" || node?.type === "Literal" && typeof node.value === "string";
}

// src/language-js/utilities/node-types.js
var isBinaryCastExpression = createTypeCheckFunction([
  // TS
  "TSAsExpression",
  "TSSatisfiesExpression",
  // Flow
  "AsExpression",
  "AsConstExpression",
  "SatisfiesExpression"
]);
var isSatisfiesExpression = createTypeCheckFunction([
  "SatisfiesExpression",
  "TSSatisfiesExpression"
]);
var isUnionType = createTypeCheckFunction([
  "TSUnionType",
  "UnionTypeAnnotation"
]);
var isIntersectionType = createTypeCheckFunction([
  "TSIntersectionType",
  "IntersectionTypeAnnotation"
]);
var isTupleType = createTypeCheckFunction([
  "TupleTypeAnnotation",
  "TSTupleType"
]);
var isConditionalType = createTypeCheckFunction([
  "TSConditionalType",
  "ConditionalTypeAnnotation"
]);
var isTypeAlias = createTypeCheckFunction([
  "TSTypeAliasDeclaration",
  "TypeAlias"
]);
var isReturnOrThrowStatement = createTypeCheckFunction([
  "ReturnStatement",
  "ThrowStatement"
]);
var isExportDeclaration = createTypeCheckFunction([
  "ExportDefaultDeclaration",
  "DeclareExportDeclaration",
  "ExportNamedDeclaration",
  "ExportAllDeclaration",
  "DeclareExportAllDeclaration"
]);
var isArrayExpression = createTypeCheckFunction(["ArrayExpression"]);
var isObjectExpression = createTypeCheckFunction(["ObjectExpression"]);
var isLiteral = createTypeCheckFunction([
  "Literal",
  "BooleanLiteral",
  "BigIntLiteral",
  // Babel, flow use `BigIntLiteral` too
  "DirectiveLiteral",
  "NullLiteral",
  "NumericLiteral",
  "RegExpLiteral",
  "StringLiteral"
]);
var isObjectType = createTypeCheckFunction([
  "ObjectTypeAnnotation",
  "TSTypeLiteral",
  "TSMappedType"
]);
var isFunctionOrArrowExpression = createTypeCheckFunction([
  "FunctionExpression",
  "ArrowFunctionExpression"
]);
var isJsxElement = createTypeCheckFunction([
  "JSXElement",
  "JSXFragment"
]);
var isBinaryish = createTypeCheckFunction([
  "BinaryExpression",
  "LogicalExpression",
  "NGPipeExpression"
]);
var isCallExpression = createTypeCheckFunction([
  "CallExpression",
  "OptionalCallExpression"
]);
var isMemberExpression = createTypeCheckFunction([
  "MemberExpression",
  "OptionalMemberExpression"
]);
var isCallOrNewExpression = createTypeCheckFunction([
  "CallExpression",
  "OptionalCallExpression",
  "NewExpression"
]);
var isCallLikeExpression = createTypeCheckFunction([
  "CallExpression",
  "OptionalCallExpression",
  "NewExpression",
  "ImportExpression"
]);
var isChainElementWrapper = createTypeCheckFunction([
  "ChainExpression",
  "TSNonNullExpression"
]);
var isArrayType = createTypeCheckFunction([
  "TSArrayType",
  "ArrayTypeAnnotation"
]);
var isTypeParameterInstantiation = createTypeCheckFunction([
  "TSTypeParameterInstantiation",
  "TypeParameterInstantiation"
]);

// src/language-js/utilities/is-shorthand-specifier.js
function isShorthandSpecifier(specifier) {
  if (specifier.type !== "ImportSpecifier" && specifier.type !== "ExportSpecifier") {
    return false;
  }
  const {
    local,
    // @ts-expect-error -- FIXME
    [specifier.type === "ImportSpecifier" ? "imported" : "exported"]: importedOrExported
  } = specifier;
  if (local.type !== importedOrExported.type || !hasSameLoc(local, importedOrExported)) {
    return false;
  }
  if (isStringLiteral(local)) {
    return local.value === importedOrExported.value && getRaw(local) === getRaw(importedOrExported);
  }
  switch (local.type) {
    case "Identifier":
      return local.name === importedOrExported.name;
    default:
      return false;
  }
}

// src/language-js/comments/can-attach-comment.js
var isNodeCantAttachComment = createTypeCheckFunction([
  // Babel only
  "File",
  "TemplateElement",
  // There is no similar node in Babel AST
  // ```ts
  // class Foo {
  //   bar();
  //      ^^^ TSEmptyBodyFunctionExpression
  // }
  // ```
  "TSEmptyBodyFunctionExpression",
  // There is no similar node in Babel AST, `a?.b`
  "ChainExpression"
]);
var isChildWontPrint = (node, [parent]) => parent?.type === "ComponentParameter" && parent.shorthand && parent.name === node && parent.local !== parent.name || parent?.type === "MatchObjectPatternProperty" && parent.shorthand && parent.key === node || parent?.type === "ObjectProperty" && parent.shorthand && parent.key === node && parent.value !== parent.key || parent?.type === "Property" && parent.shorthand && parent.key === node && !isMethod(parent) && parent.value !== parent.key || parent?.type === "ImportSpecifier" && isShorthandSpecifier(parent) && parent.local === node && parent.local !== parent.imported || parent?.type === "ExportSpecifier" && isShorthandSpecifier(parent) && parent.exported === node && parent.local !== parent.exported;
var isClassMethodCantAttachComment = (node, [parent]) => Boolean(
  node.type === "FunctionExpression" && parent.type === "MethodDefinition" && parent.value === node && getFunctionParameters(node).length === 0 && !node.returnType && !is_non_empty_array_default(node.typeParameters) && node.body
);
var isTsAsConstTypeReference = (node, [parent]) => (
  // @ts-expect-error -- Safe
  parent?.typeAnnotation === node && isTsAsConstExpression(parent)
);
var isTsAsConst = (node, [parent, ...ancestors]) => isTsAsConstTypeReference(node, [parent]) || // @ts-expect-error -- Safe
parent?.typeName === node && isTsAsConstTypeReference(parent, ancestors);
function canAttachComment(node, ancestors) {
  if (isNodeCantAttachComment(node) || isChildWontPrint(node, ancestors) || isClassMethodCantAttachComment(node, ancestors)) {
    return false;
  }
  if (node.type === "EmptyStatement") {
    return isMeaningfulEmptyStatement({ node, parent: ancestors[0] });
  }
  if (isTsAsConst(node, ancestors)) {
    return false;
  }
  if (node.type === "TSTypeAnnotation" && ancestors[0].type === "TSPropertySignature") {
    return false;
  }
  return true;
}
var can_attach_comment_default = canAttachComment;

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

// src/utilities/skip.js
function skip(characters) {
  return (text, startIndex, options2) => {
    if (startIndex === false) {
      return false;
    }
    const backwards = Boolean(options2?.backwards);
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

// src/utilities/skip-newline.js
var isNewlineCharacter = (character) => character === "\n" || character === "\r" || character === "\u2028" || character === "\u2029";
function skipNewline(text, startIndex, options2) {
  if (startIndex === false) {
    return false;
  }
  const backwards = Boolean(options2?.backwards);
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

// src/utilities/get-next-non-space-non-comment-character.js
function getNextNonSpaceNonCommentCharacter(text, startIndex) {
  const index = get_next_non_space_non_comment_character_index_default(text, startIndex);
  return index === false ? "" : text.charAt(index);
}
var get_next_non_space_non_comment_character_default = getNextNonSpaceNonCommentCharacter;

// src/utilities/has-newline.js
function hasNewline(text, startIndex, options2 = {}) {
  const idx = skipSpaces(
    text,
    options2.backwards ? startIndex - 1 : startIndex,
    options2
  );
  const idx2 = skip_newline_default(text, idx, options2);
  return idx !== idx2;
}
var has_newline_default = hasNewline;

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

// src/language-js/utilities/call-arguments.js
var callArgumentsCache = /* @__PURE__ */ new WeakMap();
function getCallArgumentsWithoutCache(node) {
  let args;
  if (node.type === "ImportExpression" || node.type === "TSImportType") {
    args = [node.source];
    if (node.options) {
      args.push(node.options);
    }
  } else if (node.type === "TSExternalModuleReference") {
    args = [node.expression];
  } else {
    args = node.arguments;
  }
  return args;
}
function getCallArguments(node) {
  return getOrInsertComputed(
    callArgumentsCache,
    node,
    getCallArgumentsWithoutCache
  );
}
function iterateCallArgumentsPath(path, iteratee) {
  const { node } = path;
  if (node.type === "ImportExpression" || node.type === "TSImportType") {
    path.call(() => iteratee(path, 0), "source");
    if (node.options) {
      path.call(() => iteratee(path, 1), "options");
    }
  } else if (node.type === "TSExternalModuleReference") {
    path.call(() => iteratee(path, 0), "expression");
  } else {
    path.each(iteratee, "arguments");
  }
}
function getCallArgumentSelector(node, index) {
  if (node.type === "ImportExpression" || node.type === "TSImportType") {
    if (index === 0 || index === (node.options ? -2 : -1)) {
      return ["source"];
    }
    if (node.options && (index === 1 || index === -1)) {
      return ["options"];
    }
    throw new RangeError("Invalid argument index");
  }
  if (node.type === "TSExternalModuleReference") {
    if (index === 0 || index === -1) {
      return ["expression"];
    }
  } else {
    if (index < 0) {
      index = node.arguments.length + index;
    }
    if (index >= 0 && index < node.arguments.length) {
      return ["arguments", index];
    }
  }
  throw new RangeError("Invalid argument index");
}

// src/constants.js
var commentsPropertyInOptions = /* @__PURE__ */ Symbol.for("comments");

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

// src/language-js/utilities/strip-comments.js
function stripCommentsFromText(text, comments) {
  for (const comment of comments) {
    const start = locStart(comment);
    const end = locEnd(comment);
    text = text.slice(0, start) + replace_non_line_breaks_with_space_default(text.slice(start, end)) + text.slice(end);
  }
  return text;
}
var cache = /* @__PURE__ */ new WeakMap();
function stripComments(options2) {
  const comments = options2[commentsPropertyInOptions];
  return getOrInsertComputed(
    cache,
    comments,
    (comments2) => stripCommentsFromText(options2.originalText, comments2)
  );
}

// src/language-js/utilities/call-or-new-expression-parentheses.js
function getCallOrNewExpressionClosingParenthesisIndex(callOrNewExpression, options2) {
  const closingParenthesisIndex = locEnd(callOrNewExpression) - 1;
  if (options2.originalText[closingParenthesisIndex] !== ")") {
    if (false) {
      throw new Error(
        `Unable to get '${callOrNewExpression.type}' closing parenthesis.`
      );
    }
    return;
  }
  return closingParenthesisIndex;
}
function getCallOrNewExpressionOpeningParenthesisIndex(callOrNewExpression, options2) {
  const closingParenthesisIndex = getCallOrNewExpressionClosingParenthesisIndex(
    callOrNewExpression,
    options2
  );
  if (closingParenthesisIndex === void 0) {
    return;
  }
  const text = stripComments(options2);
  const start = locEnd(
    callOrNewExpression.typeArguments ?? callOrNewExpression.callee
  );
  const openingParenthesisIndex = text.indexOf("(", start);
  if (openingParenthesisIndex === -1) {
    if (false) {
      throw new Error(
        `Unable to get '${callOrNewExpression.type}' opening parenthesis.`
      );
    }
    return;
  }
  return openingParenthesisIndex;
}
function isInsideCallOrNewExpressionParentheses(callOrNewExpression, nodeOrComment, options2) {
  const closingParenthesisIndex = getCallOrNewExpressionClosingParenthesisIndex(
    callOrNewExpression,
    options2
  );
  if (closingParenthesisIndex === void 0) {
    return false;
  }
  if (locEnd(nodeOrComment) > closingParenthesisIndex) {
    return false;
  }
  const openingParenthesisIndex = getCallOrNewExpressionOpeningParenthesisIndex(
    callOrNewExpression,
    options2
  );
  if (openingParenthesisIndex === void 0) {
    return false;
  }
  return locStart(nodeOrComment) > openingParenthesisIndex;
}

// src/language-js/utilities/comment-types.js
var isBlockComment = createTypeCheckFunction([
  "Block",
  "CommentBlock",
  // `meriyah`
  "MultiLine"
]);
var isLineComment = createTypeCheckFunction([
  "Line",
  "CommentLine",
  // `meriyah` has `SingleLine`, `HashbangComment`, `HTMLOpen`, and `HTMLClose`
  "SingleLine",
  "HashbangComment",
  "HTMLOpen",
  "HTMLClose",
  // `espree`, and `oxc`(with `{astType: 'ts'}`)
  "Hashbang",
  // `babel` and `flow` hashbang
  "InterpreterDirective"
]);

// src/language-js/utilities/is-object-property.js
function isObjectProperty(node) {
  return node?.type === "ObjectProperty" || node?.type === "Property" && !isMethod(node);
}

// src/language-js/utilities/is-prettier-ignore-comment.js
function isPrettierIgnoreComment(comment) {
  return comment.value.trim() === "prettier-ignore" && !comment.unignore;
}

// src/language-js/utilities/is-type-cast-comment.js
var cache2 = /* @__PURE__ */ new WeakMap();
function isTypeCastComment(comment) {
  return getOrInsertComputed(
    cache2,
    comment,
    (comment2) => isBlockComment(comment2) && comment2.value[0] === "*" && // TypeScript expects the type to be enclosed in curly brackets, however
    // Closure Compiler accepts types in parens and even without any delimiters at all.
    // That's why we just search for "@type" and "@satisfies".
    /@(?:type|satisfies)\b/.test(comment2.value)
  );
}

// src/language-js/comments/attach/handle-for-x-statement-comments.js
function handleForXStatementComments({
  comment,
  enclosingNode,
  followingNode,
  options: options2
}) {
  if ((enclosingNode?.type === "ForInStatement" || enclosingNode?.type === "ForOfStatement" || enclosingNode?.type === "ForStatement") && followingNode && followingNode === enclosingNode.body) {
    const closingParenthesisIndex = stripComments(options2).lastIndexOf(
      ")",
      locStart(followingNode)
    );
    if (locStart(comment) > closingParenthesisIndex) {
      addLeadingComment(followingNode, comment);
      return true;
    }
  }
  return false;
}

// src/language-js/comments/attach/utilities.js
var isSingleLineBlockComment = (comment, text) => isBlockComment(comment) && !has_newline_in_range_default(text, locStart(comment), locEnd(comment));
var isSingleLineComment = (comment, text) => isLineComment(comment) || isSingleLineBlockComment(comment, text);
function addBlockOrNotComment(node, comment) {
  if (node.type === "BlockStatement") {
    addBlockStatementFirstComment(node, comment);
  } else {
    addLeadingComment(node, comment);
  }
}
function addBlockStatementFirstComment(node, comment) {
  const firstNonEmptyNode = (node.body || node.properties).find(
    ({ type }) => type !== "EmptyStatement"
  );
  if (firstNonEmptyNode) {
    addLeadingComment(firstNonEmptyNode, comment);
  } else {
    addDanglingComment(node, comment);
  }
}

// src/language-js/comments/attach/handle-if-statement-comments.js
function handleIfStatementComments({
  comment,
  precedingNode,
  enclosingNode,
  followingNode,
  text,
  options: options2
}) {
  if (enclosingNode?.type !== "IfStatement" || !followingNode) {
    return false;
  }
  const nextCharacter = get_next_non_space_non_comment_character_default(
    text,
    locEnd(comment)
  );
  if (nextCharacter === ")") {
    addTrailingComment(precedingNode, comment);
    return true;
  }
  if (followingNode === enclosingNode.consequent) {
    addLeadingComment(followingNode, comment);
    return true;
  }
  if (precedingNode === enclosingNode.consequent && followingNode === enclosingNode.alternate) {
    return handleCommentsBetween({
      comment,
      precedingNode,
      enclosingNode,
      followingNode,
      text,
      options: options2
    });
  }
  return false;
}
function handleCommentsBetween({
  comment,
  precedingNode,
  enclosingNode,
  followingNode,
  text,
  options: options2
}) {
  const elseTokenIndex = stripComments(options2).indexOf(
    "else",
    locEnd(enclosingNode.consequent)
  );
  if (locStart(comment) >= elseTokenIndex) {
    addLeadingComment(followingNode, comment);
    return true;
  }
  const isConsequentBlockStatement = precedingNode.type === "BlockStatement";
  if (!isConsequentBlockStatement && isSingleLineComment(comment, text) && // Comment and `precedingNode` are on same line
  !has_newline_in_range_default(text, locEnd(precedingNode), locStart(comment))) {
    addTrailingComment(precedingNode, comment);
    return true;
  }
  addDanglingComment(enclosingNode, comment);
  return true;
}

// src/language-js/comments/attach/handle-switch-statement-comments.js
function handleSwitchStatementComments({
  comment,
  precedingNode,
  enclosingNode,
  followingNode,
  text
}) {
  if (!(enclosingNode?.type === "SwitchStatement" && enclosingNode.cases.length === 0 && !followingNode && precedingNode === enclosingNode.discriminant)) {
    return false;
  }
  const nextCharacter = get_next_non_space_non_comment_character_default(
    text,
    locEnd(comment)
  );
  if (nextCharacter === "}") {
    addDanglingComment(enclosingNode, comment);
    return true;
  }
  return false;
}

// src/language-js/comments/attach/handle-while-like-comments.js
function handleWhileLikeComments({
  comment,
  precedingNode,
  enclosingNode,
  followingNode,
  text
}) {
  if (!((enclosingNode?.type === "WhileStatement" || enclosingNode?.type === "WithStatement") && followingNode)) {
    return false;
  }
  const nextCharacter = get_next_non_space_non_comment_character_default(
    text,
    locEnd(comment)
  );
  if (nextCharacter === ")") {
    addTrailingComment(precedingNode, comment);
    return true;
  }
  if (enclosingNode.body === followingNode) {
    addLeadingComment(followingNode, comment);
    return true;
  }
  return false;
}

// src/language-js/comments/attach/union-type.js
function shouldAttachToUnionTypeFirstElement(node, { comment, text, options: options2 }) {
  if (isUnionType(node) && isSingleLineBlockComment(comment, text) && !isPrettierIgnoreComment(comment)) {
    const text2 = stripComments(options2);
    const textBetween = text2.slice(locEnd(comment), locStart(node));
    return /^[ \t]*$/.test(textBetween);
  }
  return false;
}
function addLeadingCommentToPossibleUnionType(node, context) {
  addLeadingComment(
    shouldAttachToUnionTypeFirstElement(node, context) ? node.types[0] : node,
    context.comment
  );
  return true;
}

// src/language-js/comments/handle-comments.js
function handleOwnLineComment(context) {
  return [handleCommentInEmptyParens, handleIgnoreComments, handleConditionalExpressionComments, handleLastFunctionParameterComments, handleMemberExpressionComments, handleIfStatementComments, handleWhileLikeComments, handleSwitchStatementComments, handleTryStatementComments, handleClassComments, handleForXStatementComments, handleUnionTypeComments, handleMatchOrPatternComments, handleOnlyComments, handleModuleSpecifiersComments, handleAssignmentPatternComments, handleMethodNameComments, handleLabeledStatementComments, handleNestedConditionalExpressionComments, handleCommentsInDestructuringPattern, handleTSMappedTypeComments, handleBinaryCastExpressionComment, handleUnionTypeLeadingComments].some((fn) => fn(context));
}
function handleEndOfLineComment(context) {
  return [handleCommentInEmptyParens, handleClosureTypeCastComments, handleLastFunctionParameterComments, handleConditionalExpressionComments, handleModuleSpecifiersComments, handleIfStatementComments, handleWhileLikeComments, handleSwitchStatementComments, handleTryStatementComments, handleClassComments, handleForXStatementComments, handleLabeledStatementComments, handleCallExpressionComments, handlePropertyComments, handleOnlyComments, handleAssignmentLikeComments, handleSwitchDefaultCaseComments, handleLastUnionElementInExpression, handleLastBinaryOperatorOperand, handleTSMappedTypeComments, handleArrowExpressionComments, handleParenthesizedExpressionTrailingComment, handlePropertySignatureComments, handleBinaryCastExpressionComment].some((fn) => fn(context));
}
function handleRemainingComment(context) {
  return [handleCommentInEmptyParens, handleIgnoreComments, handleIfStatementComments, handleWhileLikeComments, handleSwitchStatementComments, handleForXStatementComments, handleMethodNameComments, handleOnlyComments, handleAssignmentLikeComments, handleTSMappedTypeComments, handleCommentAfterArrowParams, handleFunctionNameComments, handleTSFunctionTrailingComments, handleParenthesizedExpressionTrailingComment, handleBinaryCastExpressionComment, handleUnionTypeLeadingComments].some((fn) => fn(context));
}
function handleClosureTypeCastComments({
  comment,
  followingNode
}) {
  if (followingNode && isTypeCastComment(comment)) {
    addLeadingComment(followingNode, comment);
    return true;
  }
  return false;
}
function handleTryStatementComments({
  comment,
  precedingNode,
  enclosingNode,
  followingNode
}) {
  if (enclosingNode?.type !== "TryStatement" && enclosingNode?.type !== "CatchClause" || !followingNode) {
    return false;
  }
  if (enclosingNode.type === "CatchClause" && precedingNode) {
    addTrailingComment(precedingNode, comment);
    return true;
  }
  if (followingNode.type === "BlockStatement") {
    addBlockStatementFirstComment(followingNode, comment);
    return true;
  }
  if (followingNode.type === "TryStatement") {
    addBlockOrNotComment(followingNode.finalizer, comment);
    return true;
  }
  if (followingNode.type === "CatchClause") {
    addBlockOrNotComment(followingNode.body, comment);
    return true;
  }
  return false;
}
function handleMemberExpressionComments({
  comment,
  enclosingNode,
  followingNode
}) {
  if (isMemberExpression(enclosingNode) && followingNode?.type === "Identifier") {
    addLeadingComment(enclosingNode, comment);
    return true;
  }
  return false;
}
function handleNestedConditionalExpressionComments({
  comment,
  enclosingNode,
  followingNode,
  options: options2
}) {
  if (!options2.experimentalTernaries) {
    return false;
  }
  const enclosingIsCond = enclosingNode?.type === "ConditionalExpression" || isConditionalType(enclosingNode);
  if (!enclosingIsCond) {
    return false;
  }
  const followingIsCond = followingNode?.type === "ConditionalExpression" || isConditionalType(followingNode);
  if (followingIsCond) {
    addDanglingComment(enclosingNode, comment);
    return true;
  }
  return false;
}
function handleConditionalExpressionComments({
  comment,
  precedingNode,
  enclosingNode,
  followingNode,
  text,
  options: options2
}) {
  const isSameLineAsPrecedingNode = precedingNode && !has_newline_in_range_default(text, locEnd(precedingNode), locStart(comment));
  if ((!precedingNode || !isSameLineAsPrecedingNode) && (enclosingNode?.type === "ConditionalExpression" || isConditionalType(enclosingNode)) && followingNode) {
    if (options2.experimentalTernaries && enclosingNode.alternate === followingNode && !(isBlockComment(comment) && !has_newline_in_range_default(options2.originalText, locStart(comment), locEnd(comment)))) {
      addDanglingComment(enclosingNode, comment);
      return true;
    }
    addLeadingComment(followingNode, comment);
    return true;
  }
  return false;
}
var isClassLikeNode = createTypeCheckFunction(["ClassDeclaration", "ClassExpression", "DeclareClass", "DeclareInterface", "InterfaceDeclaration", "TSInterfaceDeclaration"]);
function handleClassComments({
  comment,
  precedingNode,
  enclosingNode,
  followingNode
}) {
  if (isClassLikeNode(enclosingNode)) {
    const {
      decorators
    } = enclosingNode;
    if (is_non_empty_array_default(decorators) && followingNode?.type !== "Decorator") {
      addTrailingComment(method_at_default(
        /* OPTIONAL_OBJECT: false */
        0,
        decorators,
        -1
      ), comment);
      return true;
    }
    if (enclosingNode.body && followingNode === enclosingNode.body) {
      addBlockStatementFirstComment(enclosingNode.body, comment);
      return true;
    }
    if (followingNode) {
      const {
        superClass
      } = enclosingNode;
      if (superClass && followingNode === superClass && precedingNode && (precedingNode === enclosingNode.id || precedingNode === enclosingNode.typeParameters)) {
        addTrailingComment(precedingNode, comment);
        return true;
      }
      for (const prop of ["implements", "extends", "mixins"]) {
        if (enclosingNode[prop] && followingNode === enclosingNode[prop][0]) {
          if (precedingNode && (precedingNode === enclosingNode.id || precedingNode === enclosingNode.typeParameters || precedingNode === superClass)) {
            addTrailingComment(precedingNode, comment);
          } else {
            addDanglingComment(enclosingNode, comment, prop);
          }
          return true;
        }
      }
    }
  }
  return false;
}
var isPropertyLikeNode = createTypeCheckFunction(["ClassMethod", "ClassProperty", "PropertyDefinition", "TSAbstractPropertyDefinition", "TSAbstractMethodDefinition", "TSDeclareMethod", "MethodDefinition", "ClassAccessorProperty", "AccessorProperty", "TSAbstractAccessorProperty", "TSParameterProperty"]);
function handleMethodNameComments({
  placement,
  comment,
  precedingNode,
  enclosingNode,
  followingNode,
  text
}) {
  if (enclosingNode && precedingNode && get_next_non_space_non_comment_character_default(text, locEnd(comment)) === "(" && // "MethodDefinition" is handled in `canAttachComment`
  (enclosingNode.type === "Property" || enclosingNode.type === "TSDeclareMethod" || enclosingNode.type === "TSAbstractMethodDefinition") && precedingNode.type === "Identifier" && enclosingNode.key === precedingNode && // special Property case: { key: /*comment*/(value) };
  // comment should be attached to value instead of key
  get_next_non_space_non_comment_character_default(text, locEnd(precedingNode)) !== ":") {
    addTrailingComment(precedingNode, comment);
    return true;
  }
  if (isPropertyLikeNode(enclosingNode) && !followingNode && placement === "remaining") {
    addTrailingComment(get_next_non_space_non_comment_character_default(text, locEnd(comment)) === "(" ? precedingNode : enclosingNode, comment);
    return true;
  }
  if (precedingNode?.type === "Decorator" && isPropertyLikeNode(enclosingNode) && (isLineComment(comment) || placement === "ownLine")) {
    addTrailingComment(precedingNode, comment);
    return true;
  }
  return false;
}
var isFunctionLikeNode = createTypeCheckFunction(["FunctionDeclaration", "FunctionExpression", "ClassMethod", "MethodDefinition", "ObjectMethod"]);
function handleFunctionNameComments({
  comment,
  precedingNode,
  enclosingNode,
  text
}) {
  if (get_next_non_space_non_comment_character_default(text, locEnd(comment)) !== "(") {
    return false;
  }
  if (precedingNode && isFunctionLikeNode(enclosingNode)) {
    addTrailingComment(precedingNode, comment);
    return true;
  }
  return false;
}
function handleCommentAfterArrowParams({
  comment,
  enclosingNode,
  text
}) {
  if (enclosingNode?.type !== "ArrowFunctionExpression") {
    return false;
  }
  const index = get_next_non_space_non_comment_character_index_default(text, locEnd(comment));
  if (index !== false && text.slice(index, index + 2) === "=>") {
    addDanglingComment(enclosingNode, comment, "commentBeforeArrow");
    return true;
  }
  return false;
}
function isInArgumentOrParameterParentheses(node, comment, options2) {
  const commentStart = locStart(comment);
  const nodeEnd = locEnd(node);
  if (commentStart >= nodeEnd) {
    return false;
  }
  const commentEnd = locEnd(comment);
  const nodeStart = locStart(node);
  if (commentEnd <= nodeStart) {
    return false;
  }
  const text = stripComments(options2);
  return text.slice(0, locStart(comment)).trimEnd().endsWith("(") && text.slice(locEnd(comment)).trimStart().startsWith(")");
}
var isFlowComponent = createTypeCheckFunction(["ComponentDeclaration", "DeclareComponent", "ComponentTypeAnnotation"]);
function handleCommentInEmptyParens({
  comment,
  enclosingNode,
  options: options2
}) {
  if (!enclosingNode) {
    return false;
  }
  if (isCallLikeExpression(enclosingNode) && getCallArguments(enclosingNode).length === 0 && isInArgumentOrParameterParentheses(enclosingNode, comment, options2)) {
    addDanglingComment(enclosingNode, comment);
    return true;
  }
  const functionNode = isRealFunctionLikeNode(enclosingNode) || isFlowComponent(enclosingNode) || enclosingNode.type === "HookTypeAnnotation" ? enclosingNode : enclosingNode.type === "MethodDefinition" || enclosingNode.type === "TSAbstractMethodDefinition" || enclosingNode.type === "Property" && isMethod(enclosingNode) ? enclosingNode.value : void 0;
  if (functionNode && getFunctionParameters(functionNode).length === 0 && isInArgumentOrParameterParentheses(functionNode, comment, options2)) {
    addDanglingComment(functionNode, comment);
    return true;
  }
  return false;
}
function handleLastFunctionParameterComments({
  comment,
  precedingNode,
  enclosingNode,
  followingNode,
  text
}) {
  if (precedingNode?.type === "FunctionTypeParam" && enclosingNode?.type === "FunctionTypeAnnotation" && followingNode?.type !== "FunctionTypeParam") {
    addTrailingComment(precedingNode, comment);
    return true;
  }
  if (precedingNode?.type === "ComponentTypeParameter" && (enclosingNode?.type === "DeclareComponent" || enclosingNode?.type === "ComponentTypeAnnotation") && followingNode?.type !== "ComponentTypeParameter") {
    addTrailingComment(precedingNode, comment);
    return true;
  }
  if ((precedingNode?.type === "Identifier" || precedingNode?.type === "AssignmentPattern" || precedingNode?.type === "ObjectPattern" || precedingNode?.type === "ArrayPattern" || precedingNode?.type === "RestElement" || precedingNode?.type === "TSParameterProperty") && (isRealFunctionLikeNode(enclosingNode) || // `TSEmptyBodyFunctionExpression` opts out of comment attachment, so
  // the comment walker bubbles up to its wrapper. Three wrappers occur:
  // `TSAbstractMethodDefinition` (always), and `MethodDefinition` in
  // `declare class` or overload position. A plain `MethodDefinition` with
  // a body is a normal method and must not match here, so the
  // `MethodDefinition` branch checks `value.type` to skip it.
  (enclosingNode?.type === "TSAbstractMethodDefinition" || enclosingNode?.type === "MethodDefinition") && enclosingNode.value.type === "TSEmptyBodyFunctionExpression") && get_next_non_space_non_comment_character_default(text, locEnd(comment)) === ")") {
    addTrailingComment(precedingNode, comment);
    return true;
  }
  if ((precedingNode?.type === "ComponentParameter" || precedingNode?.type === "RestElement") && (enclosingNode?.type === "ComponentDeclaration" || enclosingNode?.type === "DeclareComponent") && get_next_non_space_non_comment_character_default(text, locEnd(comment)) === ")") {
    addTrailingComment(precedingNode, comment);
    return true;
  }
  if (!isBlockComment(comment) && followingNode?.type === "BlockStatement" && isFunctionLikeNode(enclosingNode)) {
    const functionBody = enclosingNode.type === "MethodDefinition" ? enclosingNode.value.body : enclosingNode.body;
    if (functionBody === followingNode) {
      const characterAfterCommentIndex = get_next_non_space_non_comment_character_index_default(text, locEnd(comment));
      if (characterAfterCommentIndex === locStart(followingNode)) {
        addBlockStatementFirstComment(followingNode, comment);
        return true;
      }
    }
  }
  return false;
}
function handleLabeledStatementComments({
  comment,
  enclosingNode
}) {
  if (enclosingNode?.type === "LabeledStatement") {
    addLeadingComment(enclosingNode, comment);
    return true;
  }
  return false;
}
function handleCallExpressionComments({
  comment,
  precedingNode,
  enclosingNode,
  options: options2
}) {
  if (isCallOrNewExpression(enclosingNode) && enclosingNode.callee === precedingNode && enclosingNode.arguments.length > 0 && isInsideCallOrNewExpressionParentheses(enclosingNode, comment, options2)) {
    addLeadingComment(enclosingNode.arguments[0], comment);
    return true;
  }
  return false;
}
function handleUnionTypeComments({
  comment,
  precedingNode,
  enclosingNode,
  followingNode
}) {
  if (isUnionType(enclosingNode)) {
    if (isPrettierIgnoreComment(comment)) {
      followingNode.prettierIgnore = true;
      comment.unignore = true;
    }
    if (precedingNode) {
      addTrailingComment(precedingNode, comment);
      return true;
    }
    return false;
  }
  if (isUnionType(followingNode) && isPrettierIgnoreComment(comment)) {
    followingNode.types[0].prettierIgnore = true;
    comment.unignore = true;
  }
  return false;
}
function handleMatchOrPatternComments({
  comment,
  precedingNode,
  enclosingNode,
  followingNode
}) {
  if (enclosingNode && enclosingNode.type === "MatchOrPattern") {
    if (isPrettierIgnoreComment(comment)) {
      followingNode.prettierIgnore = true;
      comment.unignore = true;
    }
    if (precedingNode) {
      addTrailingComment(precedingNode, comment);
      return true;
    }
    return false;
  }
  if (followingNode && followingNode.type === "MatchOrPattern" && isPrettierIgnoreComment(comment)) {
    followingNode.types[0].prettierIgnore = true;
    comment.unignore = true;
  }
  return false;
}
function handlePropertyComments({
  comment,
  enclosingNode
}) {
  if (isObjectProperty(enclosingNode)) {
    addLeadingComment(enclosingNode, comment);
    return true;
  }
  return false;
}
function handleOnlyComments({
  comment,
  enclosingNode,
  ast,
  isLastComment
}) {
  if (ast?.body?.length === 0) {
    if (isLastComment) {
      addDanglingComment(ast, comment);
    } else {
      addLeadingComment(ast, comment);
    }
    return true;
  }
  if (enclosingNode?.type === "Program" && enclosingNode.body.length === 0 && !is_non_empty_array_default(enclosingNode.directives)) {
    if (isLastComment) {
      addDanglingComment(enclosingNode, comment);
    } else {
      addLeadingComment(enclosingNode, comment);
    }
    return true;
  }
  return false;
}
function handleModuleSpecifiersComments({
  comment,
  precedingNode,
  enclosingNode,
  text
}) {
  if (enclosingNode?.type === "ImportSpecifier" || enclosingNode?.type === "ExportSpecifier") {
    addLeadingComment(enclosingNode, comment);
    return true;
  }
  const isImportDeclaration = precedingNode?.type === "ImportSpecifier" && enclosingNode?.type === "ImportDeclaration";
  const isExportDeclaration2 = precedingNode?.type === "ExportSpecifier" && enclosingNode?.type === "ExportNamedDeclaration";
  if ((isImportDeclaration || isExportDeclaration2) && has_newline_default(text, locEnd(comment))) {
    addTrailingComment(precedingNode, comment);
    return true;
  }
  return false;
}
function handleAssignmentPatternComments({
  comment,
  enclosingNode
}) {
  if (enclosingNode?.type === "AssignmentPattern") {
    addLeadingComment(enclosingNode, comment);
    return true;
  }
  return false;
}
var isAssignmentLikeNode = createTypeCheckFunction(["VariableDeclarator", "AssignmentExpression", "TypeAlias", "TSTypeAliasDeclaration"]);
var isComplexExprNode = createTypeCheckFunction(["ObjectExpression", "ArrayExpression", "TemplateLiteral", "TaggedTemplateExpression", "ObjectTypeAnnotation", "TSTypeLiteral"]);
function handleAssignmentLikeComments(context) {
  const {
    comment,
    enclosingNode,
    followingNode,
    options: options2,
    placement
  } = context;
  if (isAssignmentLikeNode(enclosingNode) && followingNode && placement === "endOfLine" && (isComplexExprNode(followingNode) || isBlockComment(comment))) {
    return addLeadingCommentToPossibleUnionType(followingNode, context);
  }
  if (isTypeAlias(enclosingNode) && followingNode) {
    const leftSide = enclosingNode.id;
    const equalsTokenIndex = stripComments(options2).indexOf("=", locEnd(leftSide));
    if (locStart(comment) >= equalsTokenIndex) {
      return addLeadingCommentToPossibleUnionType(followingNode, context);
    }
  }
  return false;
}
function handleTSFunctionTrailingComments({
  comment,
  enclosingNode,
  precedingNode,
  followingNode,
  text
}) {
  if (!followingNode && (enclosingNode?.type === "TSMethodSignature" || enclosingNode?.type === "TSDeclareFunction" || enclosingNode?.type === "TSAbstractMethodDefinition") && (!precedingNode || precedingNode !== enclosingNode.returnType) && get_next_non_space_non_comment_character_default(text, locEnd(comment)) === ";") {
    addTrailingComment(enclosingNode, comment);
    return true;
  }
  return false;
}
function handleIgnoreComments({
  comment,
  enclosingNode,
  followingNode
}) {
  if (isPrettierIgnoreComment(comment) && enclosingNode?.type === "TSMappedType" && followingNode === enclosingNode.key) {
    enclosingNode.prettierIgnore = true;
    comment.unignore = true;
    return true;
  }
}
function isBeforeMappedTypeOpeningBracket(node, comment, options2) {
  const bracketIndex = stripComments(options2).indexOf("[", locStart(node));
  return locEnd(comment) < bracketIndex;
}
function handleTSMappedTypeComments({
  comment,
  enclosingNode,
  options: options2
}) {
  if (enclosingNode?.type !== "TSMappedType") {
    return;
  }
  if (isBeforeMappedTypeOpeningBracket(enclosingNode, comment, options2)) {
    addDanglingComment(enclosingNode, comment);
    return true;
  }
}
function handleSwitchDefaultCaseComments({
  comment,
  enclosingNode,
  followingNode
}) {
  if (!enclosingNode || enclosingNode.type !== "SwitchCase" || enclosingNode.test || !followingNode || followingNode !== enclosingNode.consequent[0]) {
    return false;
  }
  if (followingNode.type === "BlockStatement" && isLineComment(comment)) {
    addBlockStatementFirstComment(followingNode, comment);
  } else {
    addDanglingComment(enclosingNode, comment);
  }
  return true;
}
function handleLastUnionElementInExpression({
  comment,
  precedingNode,
  enclosingNode,
  followingNode
}) {
  if (isUnionType(precedingNode) && (isArrayType(enclosingNode) && !followingNode || isIntersectionType(enclosingNode) || isUnionType(enclosingNode))) {
    addTrailingComment(method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      precedingNode.types,
      -1
    ), comment);
    return true;
  }
  return false;
}
function handleCommentsInDestructuringPattern({
  comment,
  enclosingNode,
  precedingNode,
  followingNode
}) {
  if ((enclosingNode?.type === "ObjectPattern" || enclosingNode?.type === "ArrayPattern") && followingNode?.type === "TSTypeAnnotation") {
    if (precedingNode) {
      addTrailingComment(precedingNode, comment);
    } else {
      addDanglingComment(enclosingNode, comment);
    }
    return true;
  }
}
function handleLastBinaryOperatorOperand({
  comment,
  precedingNode,
  enclosingNode,
  followingNode,
  text
}) {
  if (!followingNode && enclosingNode?.type === "UnaryExpression" && (precedingNode?.type === "LogicalExpression" || precedingNode?.type === "BinaryExpression")) {
    if (
      // Multiline expression
      has_newline_in_range_default(text, locStart(enclosingNode.argument), locStart(precedingNode.right)) && isSingleLineComment(comment, text) && // Comment and `precedingNode.right` are on same line
      !has_newline_in_range_default(text, locStart(precedingNode.right), locStart(comment))
    ) {
      addTrailingComment(precedingNode.right, comment);
      return true;
    }
  }
  return false;
}
function handlePropertySignatureComments({
  enclosingNode,
  followingNode,
  comment
}) {
  if (enclosingNode && (enclosingNode.type === "TSPropertySignature" || enclosingNode.type === "ObjectTypeProperty") && (isUnionType(followingNode) || isIntersectionType(followingNode))) {
    addLeadingComment(followingNode, comment);
    return true;
  }
}
function handleBinaryCastExpressionComment({
  enclosingNode,
  precedingNode,
  followingNode,
  comment,
  text
}) {
  if (isBinaryCastExpression(enclosingNode) && precedingNode === enclosingNode.expression && !isSingleLineComment(comment, text)) {
    if (followingNode) {
      addLeadingComment(followingNode, comment);
    } else {
      addTrailingComment(enclosingNode, comment);
    }
    return true;
  }
}
function isCommentBeforeArrowFunctionExpressionArrow(comment, arrowFunctionExpression, options2) {
  const arrowTokenIndex = stripComments(options2).lastIndexOf("=>", locStart(arrowFunctionExpression.body));
  return locEnd(comment) < arrowTokenIndex;
}
function handleArrowExpressionComments({
  comment,
  enclosingNode,
  followingNode,
  precedingNode,
  options: options2
}) {
  if (enclosingNode?.type !== "ArrowFunctionExpression" || !followingNode || !precedingNode) {
    return false;
  }
  const isBeforeArrow = isCommentBeforeArrowFunctionExpressionArrow(comment, enclosingNode, options2);
  if (!isBeforeArrow) {
    addBlockOrNotComment(followingNode, comment);
    return true;
  }
  return false;
}
function handleParenthesizedExpressionTrailingComment({
  comment,
  enclosingNode,
  precedingNode,
  followingNode
}) {
  if (!followingNode && enclosingNode && precedingNode) {
    if (enclosingNode.type === "ExpressionStatement" && enclosingNode.expression === precedingNode) {
      addTrailingComment(enclosingNode, comment);
      return true;
    }
    const isSequence = precedingNode.type === "SequenceExpression";
    const isAssignment2 = precedingNode.type === "AssignmentExpression";
    if ((isSequence || isAssignment2) && (enclosingNode.type === "ArrowFunctionExpression" && enclosingNode.body === precedingNode || enclosingNode.type === "VariableDeclarator" && enclosingNode.init === precedingNode || enclosingNode.type === "ReturnStatement" && enclosingNode.argument === precedingNode || enclosingNode.type === "AssignmentExpression" && enclosingNode.right === precedingNode)) {
      addTrailingComment(isSequence ? method_at_default(
        /* OPTIONAL_OBJECT: false */
        0,
        precedingNode.expressions,
        -1
      ) : precedingNode.right, comment);
      return true;
    }
  }
  return false;
}
function handleUnionTypeLeadingComments(context) {
  const {
    followingNode,
    comment
  } = context;
  if (shouldAttachToUnionTypeFirstElement(followingNode, context)) {
    addLeadingComment(followingNode.types[0], comment);
    return true;
  }
  return false;
}
var isRealFunctionLikeNode = createTypeCheckFunction(["ArrowFunctionExpression", "FunctionExpression", "FunctionDeclaration", "ObjectMethod", "ClassMethod", "TSDeclareFunction", "TSCallSignatureDeclaration", "TSConstructSignatureDeclaration", "TSMethodSignature", "TSConstructorType", "TSFunctionType", "TSDeclareMethod", "HookDeclaration"]);
var handleComments = {
  endOfLine: handleEndOfLineComment,
  ownLine: handleOwnLineComment,
  remaining: handleRemainingComment
};
var handle_comments_default = handleComments;

// src/language-js/comments/is-gap.js
function isGap(text, {
  parser
}) {
  if (parser === "flow" || parser === "hermes" || parser === "babel-flow") {
    text = method_replace_all_default(
      /* OPTIONAL_OBJECT: false */
      0,
      text,
      /[\s(]/g,
      ""
    );
    return text === "" || text === "/*" || text === "/*::";
  }
}
var is_gap_default = isGap;

// src/language-js/utilities/comments.js
var CommentCheckFlags = {
  /** Check comment is a leading comment */
  Leading: 1 << 1,
  /** Check comment is a trailing comment */
  Trailing: 1 << 2,
  /** Check comment is a dangling comment */
  Dangling: 1 << 3,
  /** Check comment is a block comment */
  Block: 1 << 4,
  /** Check comment is a line comment */
  Line: 1 << 5,
  /** Check comment is a `prettier-ignore` comment */
  PrettierIgnore: 1 << 6,
  /** Check comment is the first attached comment */
  First: 1 << 7,
  /** Check comment is the last attached comment */
  Last: 1 << 8
};
var getCommentTestFunction = (flags, fn) => {
  if (typeof flags === "function") {
    fn = flags;
    flags = 0;
  }
  if (flags || fn) {
    return (comment, index, comments) => !(flags & CommentCheckFlags.Leading && !comment.leading || flags & CommentCheckFlags.Trailing && !comment.trailing || flags & CommentCheckFlags.Dangling && (comment.leading || comment.trailing) || flags & CommentCheckFlags.Block && !isBlockComment(comment) || flags & CommentCheckFlags.Line && !isLineComment(comment) || flags & CommentCheckFlags.First && index !== 0 || flags & CommentCheckFlags.Last && index !== comments.length - 1 || flags & CommentCheckFlags.PrettierIgnore && !isPrettierIgnoreComment(comment) || fn && !fn(comment));
  }
};
function hasComment(node, flags, fn) {
  if (!is_non_empty_array_default(node?.comments)) {
    return false;
  }
  const test = getCommentTestFunction(flags, fn);
  return test ? node.comments.some(test) : true;
}
function getComments(node, flags, fn) {
  if (!Array.isArray(node?.comments)) {
    return [];
  }
  const test = getCommentTestFunction(flags, fn);
  return test ? node.comments.filter(test) : node.comments;
}

// src/language-js/utilities/has-node-ignore-comment.js
function hasNodeIgnoreComment(node) {
  return node?.prettierIgnore || hasComment(node, CommentCheckFlags.PrettierIgnore);
}

// src/language-js/utilities/is-iife-callee-or-tagged-template-expression-tag.js
function isIifeCalleeOrTaggedTemplateExpressionTag(path) {
  const { node } = path;
  return (node.type === "FunctionExpression" || node.type === "ArrowFunctionExpression") && (path.key === "callee" && isCallExpression(path.parent) || path.key === "tag" && path.parent.type === "TaggedTemplateExpression");
}

// src/language-js/utilities/get-precedence.js
var PRECEDENCE = new Map(
  [
    ["|>"],
    ["??"],
    ["||"],
    ["&&"],
    ["|"],
    ["^"],
    ["&"],
    ["==", "===", "!=", "!=="],
    ["<", ">", "<=", ">=", "in", "instanceof"],
    [">>", "<<", ">>>"],
    ["+", "-"],
    ["*", "/", "%"],
    ["**"]
  ].flatMap(
    (operators, index) => operators.map((operator) => [operator, index])
  )
);
function getPrecedence(operator) {
  return PRECEDENCE.get(operator);
}

// src/language-js/utilities/should-flatten.js
var equalityOperators = {
  "==": true,
  "!=": true,
  "===": true,
  "!==": true
};
var multiplicativeOperators = {
  "*": true,
  "/": true,
  "%": true
};
var bitshiftOperators = {
  ">>": true,
  ">>>": true,
  "<<": true
};
function shouldFlatten(parentOp, nodeOp) {
  if (getPrecedence(nodeOp) !== getPrecedence(parentOp)) {
    return false;
  }
  if (parentOp === "**") {
    return false;
  }
  if (equalityOperators[parentOp] && equalityOperators[nodeOp]) {
    return false;
  }
  if (nodeOp === "%" && multiplicativeOperators[parentOp] || parentOp === "%" && multiplicativeOperators[nodeOp]) {
    return false;
  }
  if (nodeOp !== parentOp && multiplicativeOperators[nodeOp] && multiplicativeOperators[parentOp]) {
    return false;
  }
  if (bitshiftOperators[parentOp] && bitshiftOperators[nodeOp]) {
    return false;
  }
  return true;
}

// src/language-js/utilities/is-bitwise-operator.js
function isBitwiseOperator(operator) {
  return Boolean(bitshiftOperators[operator]) || operator === "|" || operator === "^" || operator === "&";
}

// src/language-js/utilities/is-nullish-coalescing.js
function isNullishCoalescing(node) {
  return node.type === "LogicalExpression" && node.operator === "??";
}

// src/language-js/utilities/starts-with-no-lookahead-token.js
function startsWithNoLookaheadToken(node, predicate) {
  switch (node.type) {
    case "BinaryExpression":
    case "LogicalExpression":
    case "AssignmentExpression":
    case "NGPipeExpression":
      return startsWithNoLookaheadToken(node.left, predicate);
    case "MemberExpression":
    case "OptionalMemberExpression":
      return startsWithNoLookaheadToken(node.object, predicate);
    case "TaggedTemplateExpression":
      if (node.tag.type === "FunctionExpression") {
        return false;
      }
      return startsWithNoLookaheadToken(node.tag, predicate);
    case "CallExpression":
    case "OptionalCallExpression":
      if (node.callee.type === "FunctionExpression") {
        return false;
      }
      return startsWithNoLookaheadToken(node.callee, predicate);
    case "ConditionalExpression":
      return startsWithNoLookaheadToken(node.test, predicate);
    case "UpdateExpression":
      return !node.prefix && startsWithNoLookaheadToken(node.argument, predicate);
    case "BindExpression":
      return node.object && startsWithNoLookaheadToken(node.object, predicate);
    case "SequenceExpression":
      return startsWithNoLookaheadToken(node.expressions[0], predicate);
    case "ChainExpression":
    case "TSNonNullExpression":
    case "TSSatisfiesExpression":
    case "TSAsExpression":
    case "AsExpression":
    case "AsConstExpression":
    case "SatisfiesExpression":
      return startsWithNoLookaheadToken(node.expression, predicate);
    default:
      return predicate(node);
  }
}

// src/language-js/parentheses/chain-expression.js
function shouldAddParenthesesToChainExpression(path) {
  const { key, parent } = path;
  return key === "expression" && parent.type === "TSNonNullExpression" || key === "object" && parent.type === "MemberExpression" && !parent.optional || key === "callee" && parent.type === "CallExpression" && !parent.optional || key === "callee" && parent.type === "NewExpression" || key === "tag" && parent.type === "TaggedTemplateExpression";
}
var isParenthesized = (node) => node.extra?.parenthesized;
var isBabelOptionalChainElement = createTypeCheckFunction([
  "OptionalCallExpression",
  "OptionalMemberExpression"
]);
function isBabelOptionalChainRoot(path) {
  const { node } = path;
  let child = node;
  while (child.type === "TSNonNullExpression") {
    child = child.expression;
    if (isParenthesized(child)) {
      return false;
    }
  }
  if (!isBabelOptionalChainElement(child)) {
    return false;
  }
  if (isParenthesized(node)) {
    return true;
  }
  return !(path.key === "expression" && path.parent.type === "TSNonNullExpression");
}
function shouldAddParenthesesToChainElement(path) {
  return (path.node.type === "ChainExpression" || isBabelOptionalChainRoot(path)) && shouldAddParenthesesToChainExpression(path);
}

// src/language-js/parentheses/identifier.js
function shouldAddParenthesesToIdentifier(path) {
  const { node } = path;
  if (node.type !== "Identifier") {
    return false;
  }
  if (node.extra?.parenthesized && /^PRETTIER_HTML_PLACEHOLDER_\d+_\d+_IN_JS$/.test(node.name)) {
    return true;
  }
  const { key, parent } = path;
  if (key === "left" && (node.name === "async" && !parent.await || node.name === "let") && parent.type === "ForOfStatement") {
    return true;
  }
  if (node.name === "let") {
    const expression = path.findAncestor(
      (node2) => node2.type === "ForOfStatement" || node2.type === "ForInStatement"
    )?.left;
    if (expression && startsWithNoLookaheadToken(
      expression,
      (leftmostNode) => leftmostNode === node
    )) {
      return true;
    }
  }
  if (key === "object" && node.name === "let" && parent.type === "MemberExpression" && parent.computed && !parent.optional) {
    const statement = path.findAncestor(
      (node2) => node2.type === "ExpressionStatement" || node2.type === "ForStatement" || node2.type === "ForInStatement"
    );
    const expression = !statement ? void 0 : statement.type === "ExpressionStatement" ? statement.expression : statement.type === "ForStatement" ? statement.init : statement.left;
    if (expression && startsWithNoLookaheadToken(
      expression,
      (leftmostNode) => leftmostNode === node
    )) {
      return true;
    }
  }
  if (key === "expression") {
    switch (node.name) {
      case "await":
      case "interface":
      case "module":
      case "using":
      case "yield":
      case "let":
      case "component":
      case "hook":
      case "type": {
        const ancestorNeitherAsNorSatisfies = path.findAncestor(
          (node2) => !isBinaryCastExpression(node2)
        );
        if (ancestorNeitherAsNorSatisfies !== parent && ancestorNeitherAsNorSatisfies.type === "ExpressionStatement") {
          return true;
        }
      }
    }
  }
  return false;
}

// src/utilities/is-object.js
function isObject(object) {
  return object !== null && typeof object === "object";
}
var is_object_default = isObject;

// src/utilities/ast.js
function* getChildren(node, options2) {
  const { getVisitorKeys: getVisitorKeys3, filter = () => true } = options2;
  const isMatchedNode = (node2) => is_object_default(node2) && filter(node2);
  for (const key of getVisitorKeys3(node)) {
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
function* getDescendants(node, options2) {
  const queue = [node];
  for (let index = 0; index < queue.length; index++) {
    const node2 = queue[index];
    for (const child of getChildren(node2, options2)) {
      yield child;
      queue.push(child);
    }
  }
}
function hasDescendant(node, { getVisitorKeys: getVisitorKeys3, predicate }) {
  for (const descendant of getDescendants(node, { getVisitorKeys: getVisitorKeys3 })) {
    if (predicate(descendant)) {
      return true;
    }
  }
  return false;
}

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
  function getVisitorKeys3(node) {
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
  return getVisitorKeys3;
}
var create_get_visitor_keys_default = createGetVisitorKeys;

// src/language-js/traverse/visitor-keys.evaluate.js
var vk = [
  ["elements"],
  ["left", "right"],
  ["value"],
  ["directives", "body"],
  ["label"],
  ["callee", "typeArguments", "arguments"],
  ["test", "consequent", "alternate"],
  ["body", "test"],
  ["expression"],
  ["left", "right", "body"],
  ["id", "typeParameters", "params", "predicate", "returnType", "body"],
  ["object", "property"],
  ["properties"],
  ["decorators", "key", "typeParameters", "params", "returnType", "body"],
  ["decorators", "key", "value"],
  ["argument"],
  ["expressions"],
  ["id", "init"],
  ["body"],
  ["decorators", "id", "typeParameters", "superClass", "superTypeArguments", "mixins", "implements", "body"],
  ["declaration", "specifiers", "source", "attributes"],
  ["local"],
  ["exported"],
  ["decorators", "variance", "key", "typeAnnotation", "value"],
  ["id"],
  ["key", "value"],
  ["elementType"],
  ["id", "typeParameters"],
  ["id", "typeParameters", "extends", "body"],
  ["id", "body"],
  ["typeAnnotation"],
  ["id", "typeParameters", "right"],
  ["name", "typeAnnotation"],
  ["types"],
  ["qualification", "id"],
  ["elementTypes"],
  ["expression", "typeAnnotation"],
  ["params"],
  ["members"],
  ["objectType", "indexType"],
  ["decorators", "key", "typeAnnotation", "value"],
  ["id", "typeParameters", "params", "returnType", "body"],
  ["key", "typeParameters", "params", "returnType"],
  ["typeParameters", "params", "returnType"],
  ["parameterName", "typeAnnotation"],
  ["checkType", "extendsType", "trueType", "falseType"],
  ["typeParameter"],
  ["literal"],
  ["expression", "typeArguments"],
  ["decorators", "key", "typeAnnotation"],
  ["argument", "cases"],
  ["pattern", "body", "guard"],
  ["properties", "rest"],
  ["node"]
];
var visitor_keys_evaluate_default = {
  ArrayExpression: vk[0],
  AssignmentExpression: vk[1],
  BinaryExpression: vk[1],
  InterpreterDirective: [],
  Directive: vk[2],
  DirectiveLiteral: [],
  BlockStatement: vk[3],
  BreakStatement: vk[4],
  CallExpression: vk[5],
  CatchClause: ["param", "body"],
  ConditionalExpression: vk[6],
  ContinueStatement: vk[4],
  DebuggerStatement: [],
  DoWhileStatement: vk[7],
  EmptyStatement: [],
  ExpressionStatement: vk[8],
  File: ["program"],
  ForInStatement: vk[9],
  ForStatement: ["init", "test", "update", "body"],
  FunctionDeclaration: vk[10],
  FunctionExpression: vk[10],
  Identifier: ["typeAnnotation", "decorators"],
  IfStatement: vk[6],
  LabeledStatement: ["label", "body"],
  StringLiteral: [],
  NumericLiteral: [],
  NullLiteral: [],
  BooleanLiteral: [],
  RegExpLiteral: [],
  LogicalExpression: vk[1],
  MemberExpression: vk[11],
  NewExpression: vk[5],
  Program: vk[3],
  ObjectExpression: vk[12],
  ObjectMethod: vk[13],
  ObjectProperty: vk[14],
  RestElement: ["argument", "typeAnnotation", "decorators"],
  ReturnStatement: vk[15],
  SequenceExpression: vk[16],
  ParenthesizedExpression: vk[8],
  SwitchCase: ["test", "consequent"],
  SwitchStatement: ["discriminant", "cases"],
  ThisExpression: [],
  ThrowStatement: vk[15],
  TryStatement: ["block", "handler", "finalizer"],
  UnaryExpression: vk[15],
  UpdateExpression: vk[15],
  VariableDeclaration: ["declarations"],
  VariableDeclarator: vk[17],
  WhileStatement: vk[7],
  WithStatement: ["object", "body"],
  AssignmentPattern: ["left", "right", "decorators", "typeAnnotation"],
  ArrayPattern: ["elements", "typeAnnotation", "decorators"],
  ArrowFunctionExpression: ["typeParameters", "params", "predicate", "returnType", "body"],
  ClassBody: vk[18],
  ClassExpression: vk[19],
  ClassDeclaration: vk[19],
  ExportAllDeclaration: ["source", "attributes", "exported"],
  ExportDefaultDeclaration: ["declaration"],
  ExportNamedDeclaration: vk[20],
  ExportSpecifier: ["local", "exported"],
  ForOfStatement: vk[9],
  ImportDeclaration: ["specifiers", "source", "attributes"],
  ImportDefaultSpecifier: vk[21],
  ImportNamespaceSpecifier: vk[21],
  ImportSpecifier: ["imported", "local"],
  MetaProperty: ["meta", "property"],
  ClassMethod: vk[13],
  ObjectPattern: ["decorators", "properties", "typeAnnotation"],
  SpreadElement: vk[15],
  Super: [],
  TaggedTemplateExpression: ["tag", "typeArguments", "quasi"],
  TemplateElement: [],
  TemplateLiteral: ["quasis", "expressions"],
  YieldExpression: vk[15],
  AwaitExpression: vk[15],
  ImportExpression: ["source", "options"],
  BigIntLiteral: [],
  ExportNamespaceSpecifier: vk[22],
  OptionalMemberExpression: vk[11],
  OptionalCallExpression: vk[5],
  ClassProperty: vk[23],
  ClassPrivateProperty: vk[23],
  ClassPrivateMethod: vk[13],
  PrivateName: vk[24],
  StaticBlock: vk[18],
  ImportAttribute: vk[25],
  AnyTypeAnnotation: [],
  ArrayTypeAnnotation: vk[26],
  BooleanTypeAnnotation: [],
  BooleanLiteralTypeAnnotation: [],
  NullLiteralTypeAnnotation: [],
  ClassImplements: vk[27],
  DeclareClass: ["id", "typeParameters", "extends", "mixins", "implements", "body"],
  DeclareFunction: ["id", "predicate"],
  DeclareInterface: vk[28],
  DeclareModule: vk[29],
  DeclareModuleExports: vk[30],
  DeclareTypeAlias: vk[31],
  DeclareOpaqueType: ["id", "typeParameters", "supertype", "lowerBound", "upperBound"],
  DeclareVariable: ["id", "declarations"],
  DeclareExportDeclaration: vk[20],
  DeclareExportAllDeclaration: ["source", "attributes"],
  DeclaredPredicate: vk[2],
  ExistsTypeAnnotation: [],
  FunctionTypeAnnotation: ["typeParameters", "this", "params", "rest", "returnType"],
  FunctionTypeParam: vk[32],
  GenericTypeAnnotation: vk[27],
  InferredPredicate: [],
  InterfaceExtends: vk[27],
  InterfaceDeclaration: vk[28],
  InterfaceTypeAnnotation: ["extends", "body"],
  IntersectionTypeAnnotation: vk[33],
  MixedTypeAnnotation: [],
  EmptyTypeAnnotation: [],
  NullableTypeAnnotation: vk[30],
  NumberLiteralTypeAnnotation: [],
  BigIntLiteralTypeAnnotation: [],
  NumberTypeAnnotation: [],
  ObjectTypeAnnotation: ["properties", "indexers", "callProperties", "internalSlots"],
  ObjectTypeInternalSlot: ["id", "value"],
  ObjectTypeCallProperty: vk[2],
  ObjectTypeIndexer: ["variance", "id", "key", "value"],
  ObjectTypeProperty: ["key", "value", "variance"],
  ObjectTypeSpreadProperty: vk[15],
  OpaqueType: ["id", "typeParameters", "supertype", "impltype", "lowerBound", "upperBound"],
  QualifiedTypeIdentifier: vk[34],
  StringLiteralTypeAnnotation: [],
  StringTypeAnnotation: [],
  SymbolTypeAnnotation: [],
  ThisTypeAnnotation: [],
  TupleTypeAnnotation: vk[35],
  TypeofTypeAnnotation: ["argument", "typeArguments"],
  TypeAlias: vk[31],
  TypeAnnotation: vk[30],
  TypeCastExpression: vk[36],
  TypeParameter: ["bound", "default", "variance"],
  TypeParameterDeclaration: vk[37],
  TypeParameterInstantiation: vk[37],
  UnionTypeAnnotation: vk[33],
  Variance: [],
  VoidTypeAnnotation: [],
  EnumDeclaration: vk[29],
  EnumBooleanBody: vk[38],
  EnumNumberBody: vk[38],
  EnumStringBody: vk[38],
  EnumSymbolBody: vk[38],
  EnumBooleanMember: vk[17],
  EnumNumberMember: vk[17],
  EnumStringMember: vk[17],
  EnumDefaultedMember: vk[24],
  IndexedAccessType: vk[39],
  OptionalIndexedAccessType: vk[39],
  JSXAttribute: ["name", "value"],
  JSXClosingElement: ["name"],
  JSXElement: ["openingElement", "children", "closingElement"],
  JSXEmptyExpression: [],
  JSXExpressionContainer: vk[8],
  JSXSpreadChild: vk[8],
  JSXIdentifier: [],
  JSXMemberExpression: vk[11],
  JSXNamespacedName: ["namespace", "name"],
  JSXOpeningElement: ["name", "typeArguments", "attributes"],
  JSXSpreadAttribute: vk[15],
  JSXText: [],
  JSXFragment: ["openingFragment", "children", "closingFragment"],
  JSXOpeningFragment: [],
  JSXClosingFragment: [],
  Placeholder: [],
  V8IntrinsicIdentifier: [],
  ArgumentPlaceholder: [],
  BindExpression: ["object", "callee"],
  ClassAccessorProperty: vk[40],
  Decorator: vk[8],
  DoExpression: vk[18],
  ExportDefaultSpecifier: vk[22],
  ModuleExpression: vk[18],
  TopicReference: [],
  VoidPattern: [],
  TSParameterProperty: ["parameter", "decorators"],
  TSDeclareFunction: vk[41],
  TSDeclareMethod: vk[42],
  TSQualifiedName: vk[1],
  TSCallSignatureDeclaration: vk[43],
  TSConstructSignatureDeclaration: vk[43],
  TSPropertySignature: ["key", "typeAnnotation"],
  TSMethodSignature: vk[42],
  TSIndexSignature: ["parameters", "typeAnnotation"],
  TSAnyKeyword: [],
  TSBooleanKeyword: [],
  TSBigIntKeyword: [],
  TSIntrinsicKeyword: [],
  TSNeverKeyword: [],
  TSNullKeyword: [],
  TSNumberKeyword: [],
  TSObjectKeyword: [],
  TSStringKeyword: [],
  TSSymbolKeyword: [],
  TSUndefinedKeyword: [],
  TSUnknownKeyword: [],
  TSVoidKeyword: [],
  TSThisType: [],
  TSFunctionType: vk[43],
  TSConstructorType: vk[43],
  TSTypeReference: ["typeName", "typeArguments"],
  TSTypePredicate: vk[44],
  TSTypeQuery: ["exprName", "typeArguments"],
  TSTypeLiteral: vk[38],
  TSArrayType: vk[26],
  TSTupleType: vk[35],
  TSOptionalType: vk[30],
  TSRestType: vk[30],
  TSNamedTupleMember: ["label", "elementType"],
  TSUnionType: vk[33],
  TSIntersectionType: vk[33],
  TSConditionalType: vk[45],
  TSInferType: vk[46],
  TSParenthesizedType: vk[30],
  TSTypeOperator: vk[30],
  TSIndexedAccessType: vk[39],
  TSMappedType: ["key", "constraint", "nameType", "typeAnnotation"],
  TSTemplateLiteralType: ["quasis", "types"],
  TSLiteralType: vk[47],
  TSClassImplements: vk[48],
  TSInterfaceHeritage: vk[48],
  TSInterfaceDeclaration: vk[28],
  TSInterfaceBody: vk[18],
  TSTypeAliasDeclaration: ["id", "typeParameters", "typeAnnotation"],
  TSInstantiationExpression: vk[48],
  TSAsExpression: vk[36],
  TSSatisfiesExpression: vk[36],
  TSTypeAssertion: vk[36],
  TSEnumBody: vk[38],
  TSEnumDeclaration: vk[29],
  TSEnumMember: ["id", "initializer"],
  TSModuleDeclaration: vk[29],
  TSModuleBlock: vk[18],
  TSImportType: ["source", "options", "qualifier", "typeArguments"],
  TSImportEqualsDeclaration: ["id", "moduleReference"],
  TSExternalModuleReference: vk[8],
  TSNonNullExpression: vk[8],
  TSExportAssignment: vk[8],
  TSNamespaceExportDeclaration: vk[24],
  TSTypeAnnotation: vk[30],
  TSTypeParameterInstantiation: vk[37],
  TSTypeParameterDeclaration: vk[37],
  TSTypeParameter: ["name", "constraint", "default"],
  ChainExpression: vk[8],
  Literal: [],
  MethodDefinition: vk[14],
  PrivateIdentifier: [],
  Property: vk[25],
  PropertyDefinition: vk[23],
  AccessorProperty: vk[40],
  TSAbstractAccessorProperty: vk[49],
  TSAbstractKeyword: [],
  TSAbstractMethodDefinition: vk[25],
  TSAbstractPropertyDefinition: vk[49],
  TSAsyncKeyword: [],
  TSDeclareKeyword: [],
  TSEmptyBodyFunctionExpression: ["id", "typeParameters", "params", "returnType"],
  TSExportKeyword: [],
  TSPrivateKeyword: [],
  TSProtectedKeyword: [],
  TSPublicKeyword: [],
  TSReadonlyKeyword: [],
  TSStaticKeyword: [],
  AsConstExpression: vk[8],
  AsExpression: vk[36],
  BigIntTypeAnnotation: [],
  ComponentDeclaration: ["id", "params", "body", "typeParameters", "rendersType"],
  ComponentParameter: ["name", "local"],
  ComponentTypeAnnotation: ["params", "rest", "typeParameters", "rendersType"],
  ComponentTypeParameter: vk[32],
  ConditionalTypeAnnotation: vk[45],
  DeclareComponent: ["id", "params", "rest", "typeParameters", "rendersType"],
  DeclareEnum: vk[29],
  DeclareHook: vk[24],
  DeclareNamespace: vk[29],
  EnumBigIntBody: vk[38],
  EnumBigIntMember: vk[17],
  EnumBody: vk[38],
  HookDeclaration: vk[41],
  HookTypeAnnotation: ["params", "returnType", "rest", "typeParameters"],
  InferTypeAnnotation: vk[46],
  KeyofTypeAnnotation: vk[15],
  MatchArrayPattern: ["elements", "rest"],
  MatchAsPattern: ["pattern", "target"],
  MatchBindingPattern: vk[24],
  MatchExpression: vk[50],
  MatchExpressionCase: vk[51],
  MatchIdentifierPattern: vk[24],
  MatchInstanceObjectPattern: vk[52],
  MatchInstancePattern: ["targetConstructor", "properties"],
  MatchLiteralPattern: vk[47],
  MatchMemberPattern: ["base", "property"],
  MatchObjectPattern: vk[52],
  MatchObjectPatternProperty: ["key", "pattern"],
  MatchOrPattern: ["patterns"],
  MatchRestPattern: vk[15],
  MatchStatement: vk[50],
  MatchStatementCase: vk[51],
  MatchUnaryPattern: vk[15],
  MatchWildcardPattern: [],
  NeverTypeAnnotation: [],
  ObjectTypeMappedTypeProperty: ["keyTparam", "propType", "sourceType", "variance"],
  QualifiedTypeofIdentifier: vk[34],
  RecordDeclaration: ["id", "typeParameters", "implements", "body"],
  RecordDeclarationBody: vk[0],
  RecordDeclarationImplements: ["id", "typeArguments"],
  RecordDeclarationProperty: ["key", "typeAnnotation", "defaultValue"],
  RecordDeclarationStaticProperty: ["key", "typeAnnotation", "value"],
  RecordExpression: ["recordConstructor", "typeArguments", "properties"],
  RecordExpressionProperties: vk[12],
  SatisfiesExpression: vk[36],
  TupleTypeLabeledElement: ["label", "elementType", "variance"],
  TupleTypeSpreadElement: ["label", "typeAnnotation"],
  TypeOperator: vk[30],
  TypePredicate: vk[44],
  UndefinedTypeAnnotation: [],
  UnknownTypeAnnotation: [],
  NGChainedExpression: vk[16],
  NGEmptyExpression: [],
  NGPipeExpression: ["left", "right", "arguments"],
  NGMicrosyntax: vk[18],
  NGMicrosyntaxAs: ["key", "alias"],
  NGMicrosyntaxExpression: ["expression", "alias"],
  NGMicrosyntaxKey: [],
  NGMicrosyntaxKeyedExpression: ["key", "expression"],
  NGMicrosyntaxLet: vk[25],
  NGRoot: vk[53],
  JsExpressionRoot: vk[53],
  JsonRoot: vk[53],
  TSJSDocAllType: [],
  TSJSDocUnknownType: [],
  TSJSDocNullableType: vk[30],
  TSJSDocNonNullableType: vk[30]
};

// src/language-js/traverse/get-visitor-keys.js
var getVisitorKeys = create_get_visitor_keys_default(visitor_keys_evaluate_default);
var get_visitor_keys_default = getVisitorKeys;

// src/language-js/utilities/has-node.js
function hasNode(node, predicate) {
  return predicate(node) || hasDescendant(node, { getVisitorKeys: get_visitor_keys_default, predicate });
}

// src/language-js/utilities/left-side.js
function hasNakedLeftSide(node) {
  return node.type === "AssignmentExpression" || node.type === "BinaryExpression" || node.type === "LogicalExpression" || node.type === "NGPipeExpression" || node.type === "ConditionalExpression" || isCallExpression(node) || isMemberExpression(node) || node.type === "SequenceExpression" || node.type === "TaggedTemplateExpression" || node.type === "BindExpression" || node.type === "UpdateExpression" && !node.prefix || isBinaryCastExpression(node) || isChainElementWrapper(node);
}
function getLeftSide(node) {
  if (node.expressions) {
    return node.expressions[0];
  }
  return node.left ?? node.test ?? node.callee ?? node.object ?? node.tag ?? node.argument ?? node.expression;
}
function getLeftSidePathName(node) {
  if (node.expressions) {
    return ["expressions", 0];
  }
  if (node.left) {
    return ["left"];
  }
  if (node.test) {
    return ["test"];
  }
  if (node.object) {
    return ["object"];
  }
  if (node.callee) {
    return ["callee"];
  }
  if (node.tag) {
    return ["tag"];
  }
  if (node.argument) {
    return ["argument"];
  }
  if (node.expression) {
    return ["expression"];
  }
  throw new Error("Unexpected node has no left side.");
}

// src/language-js/utilities/has-leading-own-line-comment.js
function hasLeadingOwnLineComment(text, node) {
  if (isJsxElement(node)) {
    return hasNodeIgnoreComment(node);
  }
  return hasComment(
    node,
    CommentCheckFlags.Leading,
    (comment) => has_newline_default(text, locEnd(comment))
  );
}

// src/language-js/utilities/return-statement-has-leading-comment.js
function returnArgumentHasLeadingCommentWithoutCache(node, options2) {
  if (hasLeadingOwnLineComment(options2.originalText, node) || hasComment(
    node,
    CommentCheckFlags.Leading,
    (comment) => has_newline_in_range_default(
      options2.originalText,
      locStart(comment),
      locEnd(comment)
    )
  ) && !isJsxElement(node)) {
    return true;
  }
  if (hasNakedLeftSide(node)) {
    let leftMost = node;
    let newLeftMost;
    while (newLeftMost = getLeftSide(leftMost)) {
      leftMost = newLeftMost;
      if (hasLeadingOwnLineComment(options2.originalText, leftMost)) {
        return true;
      }
    }
  }
  return false;
}
var cache3 = /* @__PURE__ */ new WeakMap();
function returnArgumentHasLeadingComment(node, options2) {
  return getOrInsertComputed(
    cache3,
    node,
    (node2) => returnArgumentHasLeadingCommentWithoutCache(node2, options2)
  );
}

// src/language-js/utilities/strip-chain-element-wrappers.js
function stripChainElementWrappers(node) {
  while (isChainElementWrapper(node)) {
    node = node.expression;
  }
  return node;
}

// src/language-js/parentheses/parent-needs-parentheses.js
function parentNeedsParentheses(path, options2, needsParentheses2) {
  const { node, key, parent } = path;
  switch (parent.type) {
    case "ReturnStatement":
    case "ThrowStatement":
      if (willReturnOrThrowStatementBreak(path, options2)) {
        return false;
      }
      break;
    case "ParenthesizedExpression":
      return false;
    case "ClassDeclaration":
    case "ClassExpression":
      if (key === "superClass") {
        const superClass = stripChainElementWrappers(node);
        if (superClass.type === "ArrowFunctionExpression" || superClass.type === "AssignmentExpression" || superClass.type === "AwaitExpression" || superClass.type === "BinaryExpression" || superClass.type === "ConditionalExpression" || superClass.type === "LogicalExpression" || superClass.type === "NewExpression" || superClass.type === "ObjectExpression" || superClass.type === "SequenceExpression" || superClass.type === "TaggedTemplateExpression" || superClass.type === "UnaryExpression" || superClass.type === "UpdateExpression" || superClass.type === "YieldExpression" || superClass.type === "ClassExpression" && is_non_empty_array_default(superClass.decorators)) {
          return true;
        }
      }
      break;
    case "ExportDefaultDeclaration":
      if (shouldWrapFunctionForExportDefault(path, options2, needsParentheses2)) {
        return true;
      }
      break;
    case "Decorator":
      if (key === "expression" && !canDecoratorExpressionUnparenthesized(node)) {
        return true;
      }
      break;
    case "TypeAnnotation":
      if (path.match(
        void 0,
        void 0,
        (node2, key2) => key2 === "returnType" && node2.type === "ArrowFunctionExpression"
      ) && !(node.type === "NullableTypeAnnotation" && path.call(() => needsParentheses2(path, options2), "typeAnnotation")) && includesFunctionTypeInObjectType(node)) {
        return true;
      }
      break;
    case "VariableDeclarator":
      if (key === "init" && path.match(
        void 0,
        void 0,
        (node2, key2) => key2 === "declarations" && node2.type === "VariableDeclaration",
        (node2, key2) => key2 === "left" && node2.type === "ForInStatement"
      )) {
        return true;
      }
      break;
    case "TSInstantiationExpression":
      if (key === "expression" && (node.type === "AwaitExpression" || node.type === "YieldExpression")) {
        return true;
      }
      break;
  }
}
function willReturnOrThrowStatementBreak(path, options2) {
  const { key, parent } = path;
  if (!(key === "argument" && isReturnOrThrowStatement(parent))) {
    return false;
  }
  const { node } = path;
  if ((node.type === "SequenceExpression" || node.type === "AssignmentExpression") && returnArgumentHasLeadingComment(node, options2)) {
    return true;
  }
  return false;
}
function shouldWrapFunctionForExportDefault(path, options2, needsParentheses2) {
  const { node, parent } = path;
  if (node.type === "FunctionExpression" || node.type === "ClassExpression") {
    return parent.type === "ExportDefaultDeclaration" || // in some cases the function is already wrapped
    // (e.g. `export default (function() {})();`)
    // in this case we don't need to add extra parens
    !needsParentheses2(path, options2);
  }
  if (!hasNakedLeftSide(node) || parent.type !== "ExportDefaultDeclaration" && needsParentheses2(path, options2)) {
    return false;
  }
  return path.call(
    () => shouldWrapFunctionForExportDefault(path, options2, needsParentheses2),
    ...getLeftSidePathName(node)
  );
}
function canDecoratorExpressionUnparenthesized(node) {
  if (node.type === "ChainExpression") {
    node = node.expression;
  }
  return isDecoratorMemberExpression(node) || isCallExpression(node) && // @ts-expect-error -- doesn't exists on `CallExpression`
  !node.optional && isDecoratorMemberExpression(node.callee);
}
function isDecoratorMemberExpression(node) {
  if (node.type === "Identifier") {
    return true;
  }
  if (isMemberExpression(node)) {
    return !node.computed && // @ts-expect-error -- doesn't exists on `MemberExpression`
    !node.optional && node.property.type === "Identifier" && isDecoratorMemberExpression(node.object);
  }
  return false;
}
function includesFunctionTypeInObjectType(node) {
  return hasNode(
    node,
    (node2) => node2.type === "ObjectTypeAnnotation" && hasNode(node2, (node3) => node3.type === "FunctionTypeAnnotation")
  );
}

// src/language-js/parentheses/needs-parentheses.js
function needsParentheses(path, options2) {
  if (path.isRoot) {
    return false;
  }
  const { node, key, parent } = path;
  if (options2.__isInHtmlInterpolation && !options2.bracketSpacing && endsWithRightBracket(node) && isFollowedByRightBracket(path)) {
    return true;
  }
  if (isStatement(node)) {
    return false;
  }
  if (node.type === "Identifier") {
    return shouldAddParenthesesToIdentifier(path);
  }
  if (node.type === "ObjectExpression" || node.type === "FunctionExpression" || node.type === "ClassExpression" || node.type === "DoExpression") {
    const expression = path.findAncestor(
      (node2) => node2.type === "ExpressionStatement"
    )?.expression;
    if (expression && startsWithNoLookaheadToken(
      expression,
      (leftmostNode) => leftmostNode === node
    )) {
      return true;
    }
  }
  if (node.type === "ObjectExpression") {
    const arrowFunctionBody = path.findAncestor(
      (node2) => node2.type === "ArrowFunctionExpression"
    )?.body;
    if (arrowFunctionBody && arrowFunctionBody.type !== "SequenceExpression" && // these have parens added anyway
    arrowFunctionBody.type !== "AssignmentExpression" && startsWithNoLookaheadToken(
      arrowFunctionBody,
      (leftmostNode) => leftmostNode === node
    )) {
      return true;
    }
  }
  const parentCheckResult = parentNeedsParentheses(
    path,
    options2,
    needsParentheses
  );
  if (typeof parentCheckResult === "boolean") {
    return parentCheckResult;
  }
  switch (node.type) {
    case "UpdateExpression":
      if (parent.type === "UnaryExpression") {
        return node.prefix && (node.operator === "++" && parent.operator === "+" || node.operator === "--" && parent.operator === "-");
      }
    // else fallthrough
    case "UnaryExpression":
      switch (parent.type) {
        case "UnaryExpression":
          return node.operator === parent.operator && (node.operator === "+" || node.operator === "-");
        case "BindExpression":
          return true;
        case "MemberExpression":
        case "OptionalMemberExpression":
          return key === "object";
        case "TaggedTemplateExpression":
          return true;
        case "NewExpression":
        case "CallExpression":
        case "OptionalCallExpression":
          return key === "callee";
        case "BinaryExpression":
          if (key === "left" && node.type === "UnaryExpression" && (parent.operator === "in" || parent.operator === "instanceof")) {
            return true;
          }
          return key === "left" && parent.operator === "**";
        case "TSNonNullExpression":
          return true;
        default:
          return false;
      }
    case "BinaryExpression":
      if (parent.type === "UpdateExpression") {
        return true;
      }
      if (node.operator === "in" && isPathInForStatementInitializer(path)) {
        return true;
      }
      if (node.operator === "|>" && node.extra?.parenthesized) {
        const grandParent = path.grandparent;
        if (grandParent.type === "BinaryExpression" && grandParent.operator === "|>") {
          return true;
        }
      }
    // fallthrough
    case "TSTypeAssertion":
    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "AsExpression":
    case "AsConstExpression":
    case "SatisfiesExpression":
    case "LogicalExpression":
      switch (parent.type) {
        case "TSAsExpression":
        case "TSSatisfiesExpression":
        case "AsExpression":
        case "AsConstExpression":
        case "SatisfiesExpression":
          return !isBinaryCastExpression(node);
        case "ConditionalExpression":
          return isBinaryCastExpression(node) || isNullishCoalescing(node);
        case "CallExpression":
        case "NewExpression":
        case "OptionalCallExpression":
          return key === "callee";
        case "ClassExpression":
        case "ClassDeclaration":
          return key === "superClass";
        case "TSTypeAssertion":
        case "TaggedTemplateExpression":
        case "JSXSpreadAttribute":
        case "SpreadElement":
        case "BindExpression":
        case "AwaitExpression":
        case "TSNonNullExpression":
        case "UpdateExpression":
          return true;
        case "UnaryExpression":
          if (!hasComment(node)) {
            return true;
          }
          break;
        case "MemberExpression":
        case "OptionalMemberExpression":
          return key === "object";
        case "AssignmentExpression":
        case "AssignmentPattern":
          return key === "left" && (node.type === "TSTypeAssertion" || isBinaryCastExpression(node));
        case "LogicalExpression":
          if (node.type === "LogicalExpression") {
            return parent.operator !== node.operator;
          }
        // else fallthrough
        case "BinaryExpression": {
          const { operator, type } = node;
          if (!operator && type !== "TSTypeAssertion") {
            return true;
          }
          const precedence = getPrecedence(operator);
          const parentOperator = parent.operator;
          const parentPrecedence = getPrecedence(parentOperator);
          if (parentPrecedence > precedence) {
            return true;
          }
          if (key === "right" && parentPrecedence === precedence) {
            return true;
          }
          if (parentPrecedence === precedence && !shouldFlatten(parentOperator, operator)) {
            return true;
          }
          if (parentPrecedence < precedence && operator === "%" && (parentOperator === "+" || parentOperator === "-")) {
            return true;
          }
          if (isBitwiseOperator(parentOperator)) {
            return true;
          }
          return false;
        }
        default:
          return false;
      }
      break;
    case "SequenceExpression":
      if (parent.type === "ForStatement") {
        return false;
      }
      return true;
    case "YieldExpression":
      if (parent.type === "AwaitExpression" || parent.type === "TSTypeAssertion") {
        return true;
      }
    // else fallthrough
    case "AwaitExpression":
      switch (parent.type) {
        case "TaggedTemplateExpression":
        case "UnaryExpression":
        case "LogicalExpression":
        case "SpreadElement":
        case "TSAsExpression":
        case "TSSatisfiesExpression":
        case "TSNonNullExpression":
        case "AsExpression":
        case "AsConstExpression":
        case "SatisfiesExpression":
        case "BindExpression":
          return true;
        case "MemberExpression":
        case "OptionalMemberExpression":
          return key === "object";
        case "NewExpression":
        case "CallExpression":
        case "OptionalCallExpression":
          return key === "callee";
        case "ConditionalExpression":
          return key === "test";
        case "BinaryExpression":
          if (!node.argument && parent.operator === "|>") {
            return false;
          }
          return true;
        default:
          return false;
      }
    case "TSFunctionType":
      if (path.match(
        (node2) => node2.type === "TSFunctionType",
        (node2, key2) => key2 === "typeAnnotation" && node2.type === "TSTypeAnnotation",
        (node2, key2) => key2 === "returnType" && node2.type === "ArrowFunctionExpression"
      )) {
        return true;
      }
    // fallthrough
    case "TSConditionalType":
    case "TSConstructorType":
    case "ConditionalTypeAnnotation":
      if (key === "extendsType" && isConditionalType(node) && parent.type === node.type) {
        return true;
      }
      if (key === "constraint" && node.type === "TSConditionalType" && parent.type === "TSTypeParameter" || key === "typeAnnotation" && node.type === "ConditionalTypeAnnotation" && parent.type === "TypeAnnotation" && path.grandparent.type === "TypeParameter" && path.grandparent.bound === parent && path.grandparent.usesExtendsBound) {
        return true;
      }
      if (key === "checkType" && isConditionalType(parent)) {
        return true;
      }
      if (key === "extendsType" && parent.type === "TSConditionalType") {
        let { typeAnnotation } = node.returnType || node.typeAnnotation;
        if (typeAnnotation.type === "TSTypePredicate" && typeAnnotation.typeAnnotation) {
          typeAnnotation = typeAnnotation.typeAnnotation.typeAnnotation;
        }
        if (typeAnnotation.type === "TSInferType" && typeAnnotation.typeParameter.constraint) {
          return true;
        }
      }
    // fallthrough
    case "TSUnionType":
    case "TSIntersectionType":
      if (isUnionType(parent) || isIntersectionType(parent)) {
        return true;
      }
    // fallthrough
    case "TSInferType":
      if (node.type === "TSInferType") {
        if (parent.type === "TSRestType") {
          return false;
        }
        if (key === "types" && (parent.type === "TSUnionType" || parent.type === "TSIntersectionType") && node.typeParameter.type === "TSTypeParameter" && node.typeParameter.constraint) {
          return true;
        }
      }
    // fallthrough
    case "TSTypeOperator":
      return parent.type === "TSArrayType" || parent.type === "TSOptionalType" || parent.type === "TSRestType" || key === "objectType" && parent.type === "TSIndexedAccessType" || parent.type === "TSTypeOperator" || parent.type === "TSTypeAnnotation" && path.grandparent.type.startsWith("TSJSDoc");
    case "TSTypeQuery":
      return key === "objectType" && parent.type === "TSIndexedAccessType" || key === "elementType" && parent.type === "TSArrayType";
    // Same as `TSTypeOperator`, but for Flow syntax
    case "TypeOperator":
      return parent.type === "ArrayTypeAnnotation" || parent.type === "NullableTypeAnnotation" || key === "objectType" && (parent.type === "IndexedAccessType" || parent.type === "OptionalIndexedAccessType") || parent.type === "TypeOperator";
    // Same as `TSTypeQuery`, but for Flow syntax
    case "TypeofTypeAnnotation":
    case "KeyofTypeAnnotation":
      return key === "objectType" && (parent.type === "IndexedAccessType" || parent.type === "OptionalIndexedAccessType") || key === "elementType" && parent.type === "ArrayTypeAnnotation";
    case "ArrayTypeAnnotation":
      return parent.type === "NullableTypeAnnotation";
    case "IntersectionTypeAnnotation":
    case "UnionTypeAnnotation":
      return parent.type === "TypeOperator" || parent.type === "KeyofTypeAnnotation" || parent.type === "ArrayTypeAnnotation" || parent.type === "NullableTypeAnnotation" || parent.type === "IntersectionTypeAnnotation" || parent.type === "UnionTypeAnnotation" || key === "objectType" && (parent.type === "IndexedAccessType" || parent.type === "OptionalIndexedAccessType");
    case "InferTypeAnnotation":
    case "NullableTypeAnnotation":
      if (parent.type === "ArrayTypeAnnotation" || key === "objectType" && (parent.type === "IndexedAccessType" || parent.type === "OptionalIndexedAccessType")) {
        return true;
      }
      break;
    case "ComponentTypeAnnotation":
    case "FunctionTypeAnnotation": {
      if (node.type === "ComponentTypeAnnotation" && (node.rendersType === null || node.rendersType === void 0)) {
        return false;
      }
      if (path.match(
        void 0,
        (node2, key2) => key2 === "typeAnnotation" && node2.type === "TypeAnnotation",
        (node2, key2) => key2 === "returnType" && node2.type === "ArrowFunctionExpression"
      )) {
        return true;
      }
      if (path.match(
        void 0,
        (node2, key2) => key2 === "typeAnnotation" && node2.type === "NullableTypeAnnotation",
        (node2, key2) => key2 === "typeAnnotation" && node2.type === "TypeAnnotation",
        (node2, key2) => key2 === "returnType" && node2.type === "ArrowFunctionExpression"
      )) {
        return true;
      }
      if (path.match(
        void 0,
        (node2, key2) => key2 === "typeAnnotation" && node2.type === "TypePredicate",
        (node2, key2) => key2 === "typeAnnotation" && node2.type === "TypeAnnotation",
        (node2, key2) => key2 === "returnType" && node2.type === "ArrowFunctionExpression"
      )) {
        return true;
      }
      const ancestor = parent.type === "NullableTypeAnnotation" ? path.grandparent : parent;
      return ancestor.type === "UnionTypeAnnotation" || ancestor.type === "IntersectionTypeAnnotation" || ancestor.type === "ArrayTypeAnnotation" || key === "objectType" && (ancestor.type === "IndexedAccessType" || ancestor.type === "OptionalIndexedAccessType") || key === "checkType" && parent.type === "ConditionalTypeAnnotation" || key === "extendsType" && parent.type === "ConditionalTypeAnnotation" && node.returnType?.type === "InferTypeAnnotation" && node.returnType.typeParameter.bound || // We should check ancestor's parent to know whether the parentheses
      // are really needed, but since ??T doesn't make sense this check
      // will almost never be true.
      ancestor.type === "NullableTypeAnnotation" || // See #5283
      parent.type === "FunctionTypeParam" && parent.name === null && getFunctionParameters(node).some(
        (param) => param.typeAnnotation?.type === "NullableTypeAnnotation"
      );
    }
    // fallthrough
    case "OptionalIndexedAccessType":
      return key === "objectType" && parent.type === "IndexedAccessType";
    case "StringLiteral":
    case "NumericLiteral":
    case "Literal":
      if (typeof node.value === "string" && parent.type === "ExpressionStatement" && typeof parent.directive !== "string") {
        const grandParent = path.grandparent;
        return grandParent.type === "Program" || grandParent.type === "BlockStatement";
      }
      return key === "object" && isMemberExpression(parent) && isNumericLiteral(node);
    case "AssignmentExpression":
      if ((key === "init" || key === "update") && parent.type === "ForStatement") {
        return false;
      }
      if (key === "expression" && node.left.type !== "ObjectPattern" && parent.type === "ExpressionStatement") {
        return false;
      }
      if (key === "key" && parent.type === "TSPropertySignature") {
        return false;
      }
      if (parent.type === "AssignmentExpression") {
        return false;
      }
      if (key === "expressions" && parent.type === "SequenceExpression" && path.match(
        void 0,
        void 0,
        (node2, name) => (name === "init" || name === "update") && node2.type === "ForStatement"
      )) {
        return false;
      }
      if (key === "value" && parent.type === "Property" && path.match(
        void 0,
        void 0,
        (node2, name) => name === "properties" && node2.type === "ObjectPattern"
      )) {
        return false;
      }
      if (parent.type === "NGChainedExpression") {
        return false;
      }
      if (key === "node" && parent.type === "JsExpressionRoot") {
        return false;
      }
      return true;
    case "ConditionalExpression":
      switch (parent.type) {
        case "TaggedTemplateExpression":
        case "UnaryExpression":
        case "SpreadElement":
        case "BinaryExpression":
        case "LogicalExpression":
        case "NGPipeExpression":
        case "AwaitExpression":
        case "JSXSpreadAttribute":
        case "TSTypeAssertion":
        case "TypeCastExpression":
        case "TSAsExpression":
        case "TSSatisfiesExpression":
        case "AsExpression":
        case "AsConstExpression":
        case "SatisfiesExpression":
        case "TSNonNullExpression":
          return true;
        case "NewExpression":
        case "CallExpression":
        case "OptionalCallExpression":
          return key === "callee";
        case "ConditionalExpression":
          if (!options2.experimentalTernaries) {
            return key === "test";
          }
          return false;
        case "MemberExpression":
        case "OptionalMemberExpression":
          return key === "object";
        default:
          return false;
      }
    case "FunctionExpression":
      switch (parent.type) {
        case "NewExpression":
        case "CallExpression":
        case "OptionalCallExpression":
          return key === "callee";
        case "TaggedTemplateExpression":
          return true;
        // This is basically a kind of IIFE.
        case "ExportDefaultDeclaration":
          return key === "declaration";
        default:
          return false;
      }
    case "ArrowFunctionExpression":
      switch (parent.type) {
        case "BinaryExpression":
          return parent.operator !== "|>" || node.extra?.parenthesized;
        case "NewExpression":
        case "CallExpression":
        case "OptionalCallExpression":
          return key === "callee";
        case "MemberExpression":
        case "OptionalMemberExpression":
          return key === "object";
        case "TSAsExpression":
        case "TSSatisfiesExpression":
        case "AsExpression":
        case "AsConstExpression":
        case "SatisfiesExpression":
        case "TSNonNullExpression":
        case "BindExpression":
        case "TaggedTemplateExpression":
        case "UnaryExpression":
        case "LogicalExpression":
        case "AwaitExpression":
        case "TSTypeAssertion":
        case "MatchExpressionCase":
          return true;
        case "TSInstantiationExpression":
          return key === "expression";
        case "ConditionalExpression":
          return key === "test";
        default:
          return false;
      }
    case "ClassExpression":
      switch (parent.type) {
        case "NewExpression":
          return key === "callee";
        case "ExportDefaultDeclaration":
          return key === "declaration";
        default:
          return false;
      }
    case "OptionalMemberExpression":
    case "OptionalCallExpression":
    case "ChainExpression":
    case "TSNonNullExpression":
      if (shouldAddParenthesesToChainElement(path)) {
        return true;
      }
    // fallthrough
    case "CallExpression":
    case "MemberExpression":
    case "TaggedTemplateExpression":
    case "ImportExpression":
      if (key === "callee" && (parent.type === "BindExpression" || parent.type === "NewExpression")) {
        let object = node;
        while (object) {
          switch (object.type) {
            case "CallExpression":
            case "ImportExpression":
              return true;
            case "MemberExpression":
            case "OptionalMemberExpression":
            case "BindExpression":
              object = object.object;
              break;
            // tagged templates are basically member expressions from a grammar perspective
            // see https://tc39.github.io/ecma262/#prod-MemberExpression
            case "TaggedTemplateExpression":
              object = object.tag;
              break;
            case "TSNonNullExpression":
              object = object.expression;
              break;
            default:
              return false;
          }
        }
      }
      return false;
    case "BindExpression":
      return key === "callee" && (parent.type === "BindExpression" || parent.type === "NewExpression") || key === "object" && isMemberExpression(parent);
    case "NGPipeExpression":
      if (parent.type === "NGRoot" || parent.type === "NGMicrosyntaxExpression" || parent.type === "ObjectProperty" && // Preserve parens for compatibility with AngularJS expressions
      !node.extra?.parenthesized || isArrayExpression(parent) || key === "arguments" && isCallExpression(parent) || key === "right" && parent.type === "NGPipeExpression" || key === "property" && parent.type === "MemberExpression" || parent.type === "AssignmentExpression") {
        return false;
      }
      return true;
    case "JSXFragment":
    case "JSXElement":
      return key === "callee" || key === "left" && parent.type === "BinaryExpression" && parent.operator === "<" || !isArrayExpression(parent) && parent.type !== "ArrowFunctionExpression" && parent.type !== "AssignmentExpression" && parent.type !== "AssignmentPattern" && parent.type !== "BinaryExpression" && parent.type !== "ConditionalExpression" && parent.type !== "ExpressionStatement" && parent.type !== "JsExpressionRoot" && parent.type !== "JSXAttribute" && parent.type !== "JSXElement" && parent.type !== "JSXExpressionContainer" && parent.type !== "JSXFragment" && parent.type !== "LogicalExpression" && !isCallOrNewExpression(parent) && !isObjectProperty(parent) && !isReturnOrThrowStatement(parent) && parent.type !== "TypeCastExpression" && parent.type !== "VariableDeclarator" && parent.type !== "YieldExpression" && parent.type !== "MatchExpressionCase" && !(key === "declaration" && parent.type === "ExportDefaultDeclaration");
    case "TSInstantiationExpression":
      return key === "object" && isMemberExpression(parent);
    case "MatchOrPattern":
      return parent.type === "MatchAsPattern";
  }
  return false;
}
var isStatement = createTypeCheckFunction([
  "BlockStatement",
  "BreakStatement",
  "ComponentDeclaration",
  "ClassBody",
  "ClassDeclaration",
  "ClassMethod",
  "ClassProperty",
  "PropertyDefinition",
  "ClassPrivateProperty",
  "ContinueStatement",
  "DebuggerStatement",
  "DeclareComponent",
  "DeclareClass",
  "DeclareExportAllDeclaration",
  "DeclareExportDeclaration",
  "DeclareFunction",
  "DeclareHook",
  "DeclareInterface",
  "DeclareModule",
  "DeclareModuleExports",
  "DeclareNamespace",
  "DeclareVariable",
  "DeclareEnum",
  "DoWhileStatement",
  "EnumDeclaration",
  "ExportAllDeclaration",
  "ExportDefaultDeclaration",
  "ExportNamedDeclaration",
  "ExpressionStatement",
  "ForInStatement",
  "ForOfStatement",
  "ForStatement",
  "FunctionDeclaration",
  "HookDeclaration",
  "IfStatement",
  "ImportDeclaration",
  "InterfaceDeclaration",
  "LabeledStatement",
  "MethodDefinition",
  "ReturnStatement",
  "SwitchStatement",
  "ThrowStatement",
  "TryStatement",
  "TSDeclareFunction",
  "TSEnumDeclaration",
  "TSImportEqualsDeclaration",
  "TSInterfaceDeclaration",
  "TSModuleDeclaration",
  "TSNamespaceExportDeclaration",
  "TypeAlias",
  "VariableDeclaration",
  "WhileStatement",
  "WithStatement"
]);
function isPathInForStatementInitializer(path) {
  let i = 0;
  let { node } = path;
  while (node) {
    const parent = path.getParentNode(i++);
    if (parent?.type === "ForStatement" && parent.init === node) {
      return true;
    }
    node = parent;
  }
  return false;
}
function endsWithRightBracket(node) {
  return isObjectExpression(node);
}
function isFollowedByRightBracket(path) {
  const { parent, key } = path;
  switch (parent.type) {
    case "NGPipeExpression":
      if (key === "arguments" && path.isLast) {
        return path.callParent(isFollowedByRightBracket);
      }
      break;
    case "ObjectProperty":
      if (key === "value") {
        return path.callParent(() => path.key === "properties" && path.isLast);
      }
      break;
    case "BinaryExpression":
    case "LogicalExpression":
      if (key === "right") {
        return path.callParent(isFollowedByRightBracket);
      }
      break;
    case "ConditionalExpression":
      if (key === "alternate") {
        return path.callParent(isFollowedByRightBracket);
      }
      break;
    case "UnaryExpression":
      if (parent.prefix && path.callParent(isFollowedByRightBracket)) {
        return true;
      }
      break;
  }
  return false;
}
var needs_parentheses_default = needsParentheses;

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
function isEmptyDoc(doc) {
  let isEmpty = true;
  traverse_doc_default(doc, (doc2) => {
    switch (get_doc_type_default(doc2)) {
      case DOC_TYPE_STRING:
        if (doc2 === "") {
          break;
        }
      // fallthrough
      case DOC_TYPE_TRIM:
      case DOC_TYPE_LINE_SUFFIX_BOUNDARY:
      case DOC_TYPE_LINE:
      case DOC_TYPE_BREAK_PARENT:
        isEmpty = false;
        return false;
    }
  });
  return isEmpty;
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
function conditionalGroup(states, options2) {
  return group(states[0], { ...options2, expandedStates: states });
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

// src/common/end-of-line.js
var OPTION_CR = "cr";
var OPTION_CRLF = "crlf";
var CHARACTER_CR = "\r";
var CHARACTER_CRLF = "\r\n";
var CHARACTER_LF = "\n";
var DEFAULT_EOL = CHARACTER_LF;
function convertEndOfLineOptionToCharacter(endOfLineOption) {
  return endOfLineOption === OPTION_CR ? CHARACTER_CR : endOfLineOption === OPTION_CRLF ? CHARACTER_CRLF : DEFAULT_EOL;
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
function generateIndent(indent2, command, options2) {
  const queue = command.type === INDENT_COMMAND_TYPE_DEDENT ? indent2.queue.slice(0, -1) : [...indent2.queue, command];
  let value = "";
  let length = 0;
  let lastTabs = 0;
  let lastSpaces = 0;
  for (const command2 of queue) {
    switch (command2.type) {
      case INDENT_COMMAND_TYPE_INDENT:
        flush();
        if (options2.useTabs) {
          addTabs(1);
        } else {
          addSpaces(options2.tabWidth);
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
    length += options2.tabWidth * count;
  }
  function addSpaces(count) {
    value += " ".repeat(count);
    length += count;
  }
  function flush() {
    if (options2.useTabs) {
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
function makeAlign(indent2, indentOptions, options2) {
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
  return generateIndent(indent2, command, options2);
}
function makeIndent(indent2, options2) {
  return generateIndent(indent2, INDENT_COMMAND_INDENT, options2);
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
function printDocToString(doc, options2) {
  const groupModeMap = /* @__PURE__ */ Object.create(null);
  const width = options2.printWidth;
  const newLine = convertEndOfLineOptionToCharacter(options2.endOfLine);
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
          indent: makeIndent(indent2, options2),
          mode,
          doc: doc2.contents
        });
        break;
      case DOC_TYPE_ALIGN:
        commands.push({
          indent: makeAlign(indent2, doc2.n, options2),
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

// src/common/errors.js
var ArgExpansionBailout = class extends Error {
  name = "ArgExpansionBailout";
};

// src/language-js/utilities/is-flow-object-type-property-a-function.js
function isFlowObjectTypePropertyAFunction(node) {
  return (node.type === "ObjectTypeProperty" || node.type === "ObjectTypeInternalSlot") && !node.static && !node.method && // @ts-expect-error -- exists on `ObjectTypeProperty` but not `ObjectTypeInternalSlot`
  node.kind !== "get" && // @ts-expect-error -- exists on `ObjectTypeProperty` but not `ObjectTypeInternalSlot`
  node.kind !== "set" && node.value.type === "FunctionTypeAnnotation";
}

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

// src/language-js/utilities/is-next-line-empty.js
var isNextLineEmpty2 = (node, { originalText }) => {
  const end = locEnd(node);
  if (is_next_line_empty_default(originalText, end)) {
    return true;
  }
  const endWithSemicolon = locEndWithFullText(node);
  if (endWithSemicolon === end) {
    return false;
  }
  return is_next_line_empty_default(originalText, endWithSemicolon);
};

// src/language-js/utilities/is-flow-keyword-type.js
var isFlowKeywordType = createTypeCheckFunction([
  "AnyTypeAnnotation",
  "ThisTypeAnnotation",
  "NumberTypeAnnotation",
  "VoidTypeAnnotation",
  "BooleanTypeAnnotation",
  "BigIntTypeAnnotation",
  "SymbolTypeAnnotation",
  "StringTypeAnnotation",
  "NeverTypeAnnotation",
  "UndefinedTypeAnnotation",
  "UnknownTypeAnnotation",
  // FLow only
  "EmptyTypeAnnotation",
  "MixedTypeAnnotation"
]);
var is_flow_keyword_type_default = isFlowKeywordType;

// src/language-js/utilities/is-simple-type-annotation.js
var isSimpleTypeAnnotation = createTypeCheckFunction([
  "TSThisType",
  // literals
  "NullLiteralTypeAnnotation",
  "BooleanLiteralTypeAnnotation",
  "StringLiteralTypeAnnotation",
  "BigIntLiteralTypeAnnotation",
  "NumberLiteralTypeAnnotation",
  "TSLiteralType",
  "TSTemplateLiteralType"
]);

// src/language-js/utilities/is-ts-keyword-type.js
function isTsKeywordType({ type }) {
  return type.startsWith("TS") && type.endsWith("Keyword");
}
var is_ts_keyword_type_default = isTsKeywordType;

// src/language-js/utilities/is-simple-type.js
function isSimpleType(node) {
  return is_ts_keyword_type_default(node) || is_flow_keyword_type_default(node) || isSimpleTypeAnnotation(node) || node.type === "GenericTypeAnnotation" && !node.typeParameters || node.type === "TSTypeReference" && !node.typeArguments;
}

// src/language-js/utilities/is-type-annotation-a-function.js
function isTypeAnnotationAFunction(node) {
  return (node.type === "TypeAnnotation" || node.type === "TSTypeAnnotation") && node.typeAnnotation.type === "FunctionTypeAnnotation" && !node.static && !hasSameLocStart(node, node.typeAnnotation);
}

// src/language-js/utilities/is-node-matches.js
function isNodeMatchesNameOrPath(node, nameOrPath) {
  const names = nameOrPath.split(".");
  for (let index = names.length - 1; index >= 0; index--) {
    const name = names[index];
    if (index === 0) {
      return node.type === "Identifier" && node.name === name;
    }
    if (index === 1 && node.type === "MetaProperty" && node.property.type === "Identifier" && node.property.name === name) {
      node = node.meta;
      continue;
    }
    if (node.type === "MemberExpression" && // @ts-expect-error -- Don't know why
    !node.optional && !node.computed && node.property.type === "Identifier" && node.property.name === name) {
      node = node.object;
      continue;
    }
    return false;
  }
}
function isNodeMatches(node, nameOrPaths) {
  return nameOrPaths.some(
    (nameOrPath) => isNodeMatchesNameOrPath(node, nameOrPath)
  );
}

// src/language-js/utilities/test-libraries.js
var testCallCalleePatterns = [
  "it",
  "it.only",
  "it.skip",
  "describe",
  "describe.only",
  "describe.skip",
  "test",
  "test.only",
  "test.skip",
  "test.fixme",
  "test.step",
  "test.describe",
  "test.describe.only",
  "test.describe.skip",
  "test.describe.fixme",
  "test.describe.parallel",
  "test.describe.parallel.only",
  "test.describe.serial",
  "test.describe.serial.only",
  "skip",
  "xit",
  "xdescribe",
  "xtest",
  "fit",
  "fdescribe",
  "ftest"
];
function isTestCallCallee(node) {
  return isNodeMatches(node, testCallCalleePatterns);
}
function isUnitTestSetupIdentifier(node) {
  return node.type === "Identifier" && (node.name === "beforeEach" || node.name === "beforeAll" || node.name === "afterEach" || node.name === "afterAll");
}
function isAngularTestWrapper(node) {
  return isCallExpression(node) && node.callee.type === "Identifier" && ["async", "inject", "fakeAsync", "waitForAsync"].includes(node.callee.name);
}
function isFunctionOrArrowExpressionWithBody(node) {
  return node.type === "FunctionExpression" || node.type === "ArrowFunctionExpression" && node.body.type === "BlockStatement";
}
function isTestCall(node, parent) {
  if (node?.type !== "CallExpression" || node.optional) {
    return false;
  }
  const args = getCallArguments(node);
  if (args.length === 1) {
    if (isAngularTestWrapper(node) && isTestCall(parent)) {
      return isFunctionOrArrowExpression(args[0]);
    }
    if (isUnitTestSetupIdentifier(node.callee)) {
      return isAngularTestWrapper(args[0]);
    }
  } else if ((args.length === 2 || args.length === 3) && (args[0].type === "TemplateLiteral" || isStringLiteral(args[0])) && isTestCallCallee(node.callee)) {
    if (args[2] && !isNumericLiteral(args[2])) {
      return false;
    }
    return (args.length === 2 ? isFunctionOrArrowExpression(args[1]) : isFunctionOrArrowExpressionWithBody(args[1]) && getFunctionParameters(args[1]).length <= 1) || isAngularTestWrapper(args[1]);
  }
  return false;
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
function printComment(path, options2) {
  const comment = path.node;
  comment.printed = true;
  return options2.printer.printComment(path, options2);
}
function printLeadingComment(path, options2) {
  const comment = path.node;
  const parts = [printComment(path, options2)];
  const { printer, originalText, locStart: locStart2, locEnd: locEnd2 } = options2;
  const isBlock = printer.isBlockComment?.(comment);
  if (isBlock) {
    let lineBreak = " ";
    if (has_newline_default(originalText, locEnd2(comment))) {
      if (has_newline_default(originalText, locStart2(comment), { backwards: true })) {
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
    skipSpaces(originalText, locEnd2(comment))
  );
  if (index !== false && has_newline_default(originalText, index)) {
    parts.push(hardline);
  }
  return parts;
}
function printTrailingComment(path, options2, previousComment) {
  const comment = path.node;
  const printed = printComment(path, options2);
  const { printer, originalText, locStart: locStart2 } = options2;
  const isBlock = printer.isBlockComment?.(comment);
  if (previousComment?.hasLineSuffix && !previousComment?.isBlock || has_newline_default(originalText, locStart2(comment), { backwards: true })) {
    const isLineBeforeEmpty = is_previous_line_empty_default(
      originalText,
      locStart2(comment)
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
function printDanglingComments(path, options2, danglingCommentsPrintOptions = {}) {
  const {
    indent: shouldIndent = false,
    marker,
    filter = returnTrue
  } = danglingCommentsPrintOptions;
  const danglingComments = new Set(
    path.node?.comments?.filter(
      (comment) => !(comment.leading || comment.trailing || comment.marker !== marker || !filter(comment))
    )
  );
  if (danglingComments.size === 0) {
    return "";
  }
  const parts = path.map(
    ({ node: comment }) => danglingComments.has(comment) ? printComment(path, options2) : "",
    "comments"
  ).filter(Boolean);
  const doc = join(hardline, parts);
  return shouldIndent ? indent([hardline, doc]) : doc;
}
function printLeadingComments(path, options2, printOptions) {
  const printed = options2[/* @__PURE__ */ Symbol.for("printedComments")];
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
    ({ node: comment }) => leadingComments.has(comment) ? printLeadingComment(path, options2) : "",
    "comments"
  ).filter(Boolean);
}
function printTrailingComments(path, options2, printOptions) {
  const comments = path.node?.comments;
  const trailingComments = new Set(
    comments?.filter((comment) => comment.trailing)
  );
  const printed = options2[/* @__PURE__ */ Symbol.for("printedComments")];
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
      options2,
      printedTrailingComment
    );
    if (commentsShouldPrint.has(comment)) {
      docs.push(printedTrailingComment.doc);
    }
  }, "comments");
  return docs;
}
function printCommentsSeparately(path, options2, printOptions) {
  return {
    leading: printLeadingComments(path, options2, printOptions),
    trailing: printTrailingComments(path, options2, printOptions)
  };
}
function printComments(path, doc, options2, printOptions) {
  const leading = printLeadingComments(path, options2, printOptions);
  const trailing = printTrailingComments(path, options2, printOptions);
  return leading || trailing ? inheritLabel(doc, (doc2) => [leading, doc2, trailing]) : doc;
}

// src/language-js/utilities/should-print-trailing-comma.js
function shouldPrintTrailingComma(options2, level = "es5") {
  return options2.trailingComma === "es5" && level === "es5" || options2.trailingComma === "all" && (level === "all" || level === "es5");
}

// src/language-js/print/miscellaneous.js
function printOptionalToken(path) {
  const { node } = path;
  if (!node.optional || // It's an optional computed method parsed by typescript-estree.
  // "?" is printed in `printMethod`.
  node.type === "Identifier" && node === path.parent.key) {
    return "";
  }
  if (isCallExpression(node) || isMemberExpression(node) && node.computed || node.type === "OptionalIndexedAccessType") {
    return "?.";
  }
  return "?";
}
function printDefiniteToken(path) {
  return path.node.definite || path.match(
    void 0,
    (node, name) => name === "id" && node.type === "VariableDeclarator" && node.definite
  ) ? "!" : "";
}
var isFlowDeclareNode = createTypeCheckFunction([
  "DeclareClass",
  "DeclareComponent",
  "DeclareFunction",
  "DeclareHook",
  "DeclareVariable",
  "DeclareExportDeclaration",
  "DeclareExportAllDeclaration",
  "DeclareOpaqueType",
  "DeclareTypeAlias",
  "DeclareEnum",
  "DeclareInterface"
]);
var shouldPrintDeclareToken = (path) => {
  const { node } = path;
  if (isFlowDeclareNode(node)) {
    return path.parent.type !== "DeclareExportDeclaration" && // @ts-expect-error -- hermes doesn't support yet
    !node.implicitDeclare;
  }
  return node.declare;
};
function printDeclareToken(path) {
  return shouldPrintDeclareToken(path) ? "declare " : "";
}
var isTsAbstractNode = createTypeCheckFunction([
  "TSAbstractMethodDefinition",
  "TSAbstractPropertyDefinition",
  "TSAbstractAccessorProperty"
]);
function printAbstractToken({ node }) {
  return node.abstract || isTsAbstractNode(node) ? "abstract " : "";
}
function printTypeScriptAccessibilityToken(node) {
  return node.accessibility ? node.accessibility + " " : "";
}
var isLogicalNot = (node) => node.type === "UnaryExpression" && node.operator === "!";
function shouldInlineCondition(node) {
  if (hasComment(node)) {
    return false;
  }
  if (!isLogicalNot(node)) {
    return false;
  }
  node = node.argument;
  node = isLogicalNot(node) ? node.argument : node;
  return node.type === "LogicalExpression";
}
function printIfOrWhileConditionOrWithStatementObject(path, options2, print3) {
  const { node } = path;
  const property = node.type === "WithStatement" ? "object" : "test";
  const conditionDoc = print3(property);
  if (shouldInlineCondition(node[property])) {
    return conditionDoc;
  }
  return group([indent([softline, conditionDoc]), softline]);
}
function printDanglingCommentsInList(path, options2, filter) {
  const { node } = path;
  return hasComment(node, CommentCheckFlags.Dangling, filter) ? [
    indent([softline, printDanglingComments(path, options2, { filter })]),
    hasComment(
      node,
      CommentCheckFlags.Dangling | CommentCheckFlags.Line,
      filter
    ) ? hardline : softline
  ] : "";
}
function printTrailingComma(options2, level = "es5") {
  return shouldPrintTrailingComma(options2, level) ? ifBreak(",") : "";
}
function printSemicolon(options2) {
  return options2.semi ? ";" : "";
}

// src/language-js/print/function-parameters.js
var functionParameterDanglingCommentFilter = (comment) => comment.mark !== "commentBeforeArrow";
function printFunctionParameters(path, options2, print3, shouldExpandParameters, shouldPrintTypeParameters) {
  const functionNode = path.node;
  const parameters = getFunctionParameters(functionNode);
  const typeParametersDoc = shouldPrintTypeParameters && functionNode.typeParameters ? print3("typeParameters") : "";
  if (parameters.length === 0) {
    return [
      typeParametersDoc,
      "(",
      printDanglingCommentsInList(
        path,
        options2,
        functionParameterDanglingCommentFilter
      ),
      ")"
    ];
  }
  const { parent } = path;
  const isParametersInTestCall = isTestCall(parent);
  const shouldHugParameters = shouldHugTheOnlyFunctionParameter(functionNode);
  const printed = [];
  iterateFunctionParametersPath(path, (parameterPath, index) => {
    const isLastParameter = index === parameters.length - 1;
    if (isLastParameter && functionNode.rest) {
      printed.push("...");
    }
    printed.push(print3());
    if (isLastParameter) {
      return;
    }
    printed.push(",");
    if (isParametersInTestCall || shouldHugParameters) {
      printed.push(" ");
    } else if (isNextLineEmpty2(parameters[index], options2)) {
      printed.push(hardline, hardline);
    } else {
      printed.push(line);
    }
  });
  if (shouldExpandParameters && !isDecoratedFunction(path)) {
    if (willBreak(typeParametersDoc) || willBreak(printed)) {
      throw new ArgExpansionBailout();
    }
    return group([
      removeLines(typeParametersDoc),
      "(",
      removeLines(printed),
      ")"
    ]);
  }
  const hasNotParameterDecorator = parameters.every(
    (node) => !is_non_empty_array_default(node.decorators)
  );
  if (shouldHugParameters && hasNotParameterDecorator) {
    return [typeParametersDoc, "(", ...printed, ")"];
  }
  if (isParametersInTestCall) {
    return [typeParametersDoc, "(", ...printed, ")"];
  }
  const isFlowShorthandWithOneArg = (isFlowObjectTypePropertyAFunction(parent) || isTypeAnnotationAFunction(parent) || parent.type === "TypeAlias" || parent.type === "UnionTypeAnnotation" || parent.type === "IntersectionTypeAnnotation" || parent.type === "FunctionTypeAnnotation" && parent.returnType === functionNode) && parameters.length === 1 && parameters[0].name === null && // `type q = (this: string) => void;`
  functionNode.this !== parameters[0] && parameters[0].typeAnnotation && functionNode.typeParameters === null && isSimpleType(parameters[0].typeAnnotation) && !functionNode.rest;
  if (isFlowShorthandWithOneArg) {
    if (options2.arrowParens === "always" || functionNode.type === "HookTypeAnnotation") {
      return ["(", ...printed, ")"];
    }
    return printed;
  }
  return [
    typeParametersDoc,
    "(",
    indent([softline, ...printed]),
    !hasRestParameter(functionNode) && // Angular does not allow trailing comma
    path.root.type !== "NGRoot" ? printTrailingComma(options2, "all") : "",
    softline,
    ")"
  ];
}
function shouldHugTheOnlyFunctionParameter(node) {
  if (!node) {
    return false;
  }
  const parameters = getFunctionParameters(node);
  if (parameters.length !== 1) {
    return false;
  }
  const [parameter] = parameters;
  return !hasComment(parameter) && (parameter.type === "ObjectPattern" || parameter.type === "ArrayPattern" || parameter.type === "Identifier" && parameter.typeAnnotation && (parameter.typeAnnotation.type === "TypeAnnotation" || parameter.typeAnnotation.type === "TSTypeAnnotation") && isObjectType(parameter.typeAnnotation.typeAnnotation) || parameter.type === "FunctionTypeParam" && isObjectType(parameter.typeAnnotation) && parameter !== node.rest || parameter.type === "AssignmentPattern" && (parameter.left.type === "ObjectPattern" || parameter.left.type === "ArrayPattern") && (parameter.right.type === "Identifier" || isObjectExpression(parameter.right) && parameter.right.properties.length === 0 || isArrayExpression(parameter.right) && parameter.right.elements.length === 0));
}
function getReturnTypeNode(functionNode) {
  let returnTypeNode;
  if (functionNode.returnType) {
    returnTypeNode = functionNode.returnType;
    if (returnTypeNode.typeAnnotation) {
      returnTypeNode = returnTypeNode.typeAnnotation;
    }
  } else if (functionNode.typeAnnotation) {
    returnTypeNode = functionNode.typeAnnotation;
  }
  return returnTypeNode;
}
function shouldGroupFunctionParameters(functionNode, returnTypeDoc) {
  const returnTypeNode = getReturnTypeNode(functionNode);
  if (!returnTypeNode) {
    return false;
  }
  const typeParameters = functionNode.typeParameters?.params;
  if (typeParameters) {
    if (typeParameters.length > 1) {
      return false;
    }
    if (typeParameters.length === 1) {
      const typeParameter = typeParameters[0];
      if (typeParameter.constraint || typeParameter.default) {
        return false;
      }
    }
  }
  return getFunctionParameters(functionNode).length === 1 && (isObjectType(returnTypeNode) || willBreak(returnTypeDoc));
}
function isDecoratedFunction(path) {
  return path.match(
    (node) => node.type === "ArrowFunctionExpression" && node.body.type === "BlockStatement",
    (node, name) => {
      if (node.type === "CallExpression" && name === "arguments" && node.arguments.length === 1 && node.callee.type === "CallExpression") {
        const decorator = node.callee.callee;
        return decorator.type === "Identifier" || decorator.type === "MemberExpression" && !decorator.computed && decorator.object.type === "Identifier" && decorator.property.type === "Identifier";
      }
      return false;
    },
    (node, name) => node.type === "VariableDeclarator" && name === "init" || node.type === "ExportDefaultDeclaration" && name === "declaration" || node.type === "TSExportAssignment" && name === "expression" || node.type === "AssignmentExpression" && name === "right" && node.left.type === "MemberExpression" && node.left.object.type === "Identifier" && node.left.object.name === "module" && node.left.property.type === "Identifier" && node.left.property.name === "exports",
    (node) => node.type !== "VariableDeclaration" || node.kind === "const" && node.declarations.length === 1
  );
}
function shouldBreakFunctionParameters(functionNode) {
  const parameters = getFunctionParameters(functionNode);
  return parameters.length > 1 && parameters.some((parameter) => parameter.type === "TSParameterProperty");
}
function shouldHugTheOnlyParameter(node, name) {
  return (name === "params" || name === "this" || name === "rest") && shouldHugTheOnlyFunctionParameter(node);
}

// node_modules/is-es5-identifier-name/index.js
var identifierRegexp = /^[\$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC][\$0-9A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]*$/;
var isEs5IdentifierName = (id) => identifierRegexp.test(id);
var is_es5_identifier_name_default = isEs5IdentifierName;

// src/utilities/print-number.js
function printNumber(rawNumber) {
  if (rawNumber.length === 1) {
    return rawNumber;
  }
  return rawNumber.toLowerCase().replace(/^([+-]?[\d.]+e)(?:\+|(-))?0*(?=\d)/, "$1$2").replace(/^([+-]?[\d.]+)e[+-]?0+$/, "$1").replace(/^([+-])?\./, "$10.").replace(/(\.\d+?)0+(?=e|$)/, "$1").replace(/\.(?=e|$)/, "");
}
var print_number_default = printNumber;

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

// src/utilities/make-string.js
var REGEX = /\\(["'\\])|(["'])/g;
function makeString(rawText, enclosingQuote) {
  const otherQuote = enclosingQuote === DOUBLE_QUOTE ? SINGLE_QUOTE : DOUBLE_QUOTE;
  const raw = method_replace_all_default(
    /* OPTIONAL_OBJECT: false */
    0,
    rawText,
    REGEX,
    (match, escaped, unescaped) => {
      if (escaped) {
        return escaped === otherQuote ? otherQuote : match;
      }
      return unescaped === enclosingQuote ? "\\" + unescaped : unescaped;
    }
  );
  return enclosingQuote + raw + enclosingQuote;
}
var make_string_default = makeString;

// src/utilities/print-string.js
function printString(raw, options2) {
  noop_default(/^(?<quote>["']).*\k<quote>$/s.test(raw));
  const rawContent = raw.slice(1, -1);
  let enclosingQuote;
  if (options2.parser === "json" || options2.parser === "jsonc" || options2.parser === "json-stringify" || // This was added before we have the `jsonc` parser
  // If `{quoteProps: "preserve"}` and `{singleQuote: false}` (default value),
  // and `{parser: "json5"}`, double quotes are always used for strings.
  // This effectively allows using the `json5` parser for “JSON with comments and trailing commas”.
  // See https://github.com/prettier/prettier/pull/10323
  // See https://github.com/prettier/prettier/pull/15831#discussion_r1431010636
  options2.parser === "json5" && options2.quoteProps === "preserve" && !options2.singleQuote) {
    enclosingQuote = DOUBLE_QUOTE;
  } else if (options2.__isInHtmlAttribute) {
    enclosingQuote = SINGLE_QUOTE;
  } else {
    enclosingQuote = getPreferredQuote(rawContent, options2.singleQuote);
  }
  const originalQuote = raw.charAt(0);
  if (originalQuote === enclosingQuote) {
    return raw;
  }
  return make_string_default(rawContent, enclosingQuote);
}
var print_string_default = printString;

// src/language-js/print/key.js
var isTsEnumMember = (node) => node.type === "TSEnumMember";
var getKeyProperty = (node) => isTsEnumMember(node) ? "id" : "key";
var getKey = (node) => node[getKeyProperty(node)];
var isComputedKey = (node) => !isTsEnumMember(node) && node.computed;
function isSimpleNumber(numberString) {
  return /^(?:\d+|\d+\.\d+)$/.test(numberString);
}
var isTypeScript = ({ parser }) => parser === "typescript" || parser === "babel-ts" || parser === "oxc-ts" || parser === "yuku-ts";
function isKeySafeToQuote(node, options2) {
  const key = getKey(node);
  if (key.type === "Identifier") {
    return true;
  }
  if (!isNumericLiteral(key)) {
    return false;
  }
  if (isTypeScript(options2)) {
    return false;
  }
  const printedNumber = print_number_default(getRaw(key));
  return (
    // Avoid converting 999999999999999999999 to 1e+21, 0.99999999999999999 to 1 and 1.0 to 1.
    String(key.value) === printedNumber && isSimpleNumber(printedNumber)
  );
}
function isKeySafeToUnquote(node, options2) {
  const { parser } = options2;
  if (parser === "json" || parser === "jsonc") {
    return false;
  }
  const key = getKey(node);
  if (!isStringLiteral(key)) {
    return false;
  }
  const { value } = key;
  if (print_string_default(getRaw(key), options2).slice(1, -1) !== value) {
    return false;
  }
  if (node.type === "TSMethodSignature" && value === "new") {
    return false;
  }
  if (
    // With `--strictPropertyInitialization`, TS treats properties with quoted names differently than unquoted ones.
    // See https://github.com/microsoft/TypeScript/pull/20075
    !(parser === "babel-ts" && node.type === "ClassProperty" || (parser === "typescript" || parser === "oxc-ts" || parser === "yuku-ts") && node.type === "PropertyDefinition") && is_es5_identifier_name_default(value)
  ) {
    return true;
  }
  if ((parser === "babel" || parser === "acorn" || parser === "oxc" || parser === "yuku" || parser === "espree" || parser === "meriyah" || parser === "__babel_estree") && node.type !== "ImportAttribute" && isSimpleNumber(value) && String(Number(value)) === value) {
    return true;
  }
  return false;
}
var needQuoteKeysCache = /* @__PURE__ */ new WeakMap();
function hasSiblingsRequireQuoted(path, options2) {
  return getOrInsertComputed(
    needQuoteKeysCache,
    path.parent,
    () => path.siblings.some((sibling) => {
      if (isComputedKey(sibling)) {
        return false;
      }
      const key = getKey(sibling);
      return isStringLiteral(key) && !isKeySafeToUnquote(sibling, options2);
    })
  );
}
function shouldQuoteKey(path, options2) {
  return (options2.parser === "json" || options2.parser === "jsonc" || options2.quoteProps === "consistent" && hasSiblingsRequireQuoted(path, options2)) && isKeySafeToQuote(path.node, options2);
}
function shouldUnquoteKey(path, options2) {
  return (options2.quoteProps === "as-needed" || options2.quoteProps === "consistent" && !hasSiblingsRequireQuoted(path, options2)) && isKeySafeToUnquote(path.node, options2);
}
function printKey(path, options2, print3) {
  const { node } = path;
  const property = getKeyProperty(node);
  if (isComputedKey(node)) {
    return ["[", print3(property), "]"];
  }
  if (shouldQuoteKey(path, options2)) {
    const key = getKey(node);
    const printed = print_string_default(
      JSON.stringify(key.type === "Identifier" ? key.name : String(key.value)),
      options2
    );
    return path.call(() => printComments(path, printed, options2), property);
  }
  if (shouldUnquoteKey(path, options2)) {
    const { value } = getKey(node);
    const printed = /^\d/.test(value) ? print_number_default(value) : value;
    return path.call(() => printComments(path, printed, options2), property);
  }
  return print3(property);
}

// src/language-js/utilities/union-type-print.js
var isVoidType = createTypeCheckFunction([
  "VoidTypeAnnotation",
  "TSVoidKeyword",
  "NullLiteralTypeAnnotation",
  "TSNullKeyword"
]);
var isObjectLikeType = createTypeCheckFunction([
  "ObjectTypeAnnotation",
  "TSTypeLiteral",
  // This is a bit aggressive but captures Array<{x}>
  "GenericTypeAnnotation",
  "TSTypeReference"
]);
function isMultipleTupleTypeElement(path) {
  return path.key === "elementTypes" && isTupleType(path.parent) && path.parent.elementTypes.length > 1;
}
function shouldHugUnionType(node) {
  const { types } = node;
  if (types.some((node2) => hasComment(node2))) {
    return false;
  }
  const objectType = types.find((node2) => isObjectLikeType(node2));
  if (!objectType) {
    return false;
  }
  return types.every((node2) => node2 === objectType || isVoidType(node2));
}
function shouldUnionTypePrintOwnComments(path) {
  const { key, node, parent } = path;
  if (shouldHugUnionType(node) || // If it's `types` of union type, parent will print comment for it
  key === "types" && isUnionType(parent) || // Inside intersection type let the comment print outside of parentheses
  key === "types" && isIntersectionType(parent) || isMultipleTupleTypeElement(path)) {
    return false;
  }
  return true;
}

// src/language-js/print/union-type.js
function printUnionType(path, options2, print3, args) {
  const { node } = path;
  if (shouldHugUnionType(node)) {
    return join(" | ", path.map(print3, "types"));
  }
  let printed = group(
    path.map(({ isFirst }) => {
      const bar = isFirst ? ifBreak("| ") : [line, "| "];
      const typeDoc = print3();
      if (hasComment(path.node, CommentCheckFlags.Leading)) {
        return [bar, align(2, printComments(path, typeDoc, options2))];
      }
      return [bar, printComments(path, align(2, typeDoc), options2)];
    }, "types")
  );
  if (shouldUnionTypePrintOwnComments(path)) {
    printed = printComments(path, printed, options2);
  }
  if (needs_parentheses_default(path, options2)) {
    return group([indent([softline, printed]), softline]);
  }
  if (isMultipleTupleTypeElement(path)) {
    return group([
      indent([ifBreak(["(", softline]), printed]),
      softline,
      ifBreak(")")
    ]);
  }
  if (args?.assignmentLayout === "break-after-operator" || !shouldIndentUnionType(path)) {
    return printed;
  }
  return group(indent([softline, printed]));
}
function shouldIndentUnionType(path) {
  const { key, parent } = path;
  if (key === "typeAnnotation" && parent.type === "TSTypeAssertion" || key === "elementTypes" && isTupleType(parent) || (key === "trueType" || key === "falseType") && isConditionalType(parent) || key === "params" && isTypeParameterInstantiation(parent) || key === "typeAnnotation" && parent.type === "FunctionTypeParam" && !parent.name && path.grandparent.this !== parent) {
    return false;
  }
  if (path.match(
    void 0,
    (node, key2) => key2 === "typeAnnotation" && node.type === "FunctionTypeParam",
    (node, key2) => key2 === "params" && node.type === "FunctionTypeAnnotation",
    (node, key2) => key2 === "value" && node.type === "ObjectTypeProperty" && isFlowObjectTypePropertyAFunction(node)
  )) {
    return false;
  }
  return true;
}

// src/language-js/print/type-annotation.js
function shouldHugType(node) {
  if (isSimpleType(node) || isObjectType(node)) {
    return true;
  }
  if (isUnionType(node)) {
    return shouldHugUnionType(node);
  }
  return false;
}
var typeAnnotationNodesCheckedLeadingComments = /* @__PURE__ */ new WeakSet();
function printTypeAnnotationProperty(path, print3, propertyName = "typeAnnotation") {
  const {
    node: { [propertyName]: typeAnnotation }
  } = path;
  if (!typeAnnotation) {
    return "";
  }
  let shouldPrintLeadingSpace = false;
  if (typeAnnotation.type === "TSTypeAnnotation" || typeAnnotation.type === "TypeAnnotation") {
    const firstToken = path.call(getTypeAnnotationFirstToken, propertyName);
    if (firstToken === "=>" || firstToken === ":" && hasComment(typeAnnotation, CommentCheckFlags.Leading)) {
      shouldPrintLeadingSpace = true;
    }
    typeAnnotationNodesCheckedLeadingComments.add(typeAnnotation);
  }
  return shouldPrintLeadingSpace ? [" ", print3(propertyName)] : print3(propertyName);
}
var getTypeAnnotationFirstToken = (path) => {
  if (
    // TypeScript
    path.match(
      (node) => node.type === "TSTypeAnnotation",
      (node, key) => (key === "returnType" || key === "typeAnnotation") && (node.type === "TSFunctionType" || node.type === "TSConstructorType")
    )
  ) {
    return "=>";
  }
  if (
    // TypeScript
    path.match(
      (node) => node.type === "TSTypeAnnotation",
      (node, key) => key === "typeAnnotation" && (node.type === "TSJSDocNullableType" || node.type === "TSJSDocNonNullableType" || node.type === "TSTypePredicate")
    ) || /*
        Flow
    
        ```js
        declare function foo(): void;
                            ^^^^^^^^ `TypeAnnotation`
        ```
        */
    path.match(
      (node) => node.type === "TypeAnnotation",
      (node, key) => key === "typeAnnotation" && node.type === "Identifier",
      (node, key) => key === "id" && node.type === "DeclareFunction"
    ) || /*
    Flow
    ```js
    declare hook foo(): void;
                    ^^^^^^^^ `TypeAnnotation`
    ```
    */
    path.match(
      (node) => node.type === "TypeAnnotation",
      (node, key) => key === "typeAnnotation" && node.type === "Identifier",
      (node, key) => key === "id" && node.type === "DeclareHook"
    ) || /*
        Flow
    
        ```js
        type A = () => infer R extends string;
                                       ^^^^^^ `TypeAnnotation`
        ```
        */
    path.match(
      (node) => node.type === "TypeAnnotation",
      (node, key) => key === "bound" && node.type === "TypeParameter" && node.usesExtendsBound
    )
  ) {
    return "";
  }
  return ":";
};
function printTypeAnnotation(path, options2, print3) {
  if (false) {
    const { node } = path;
    if (!typeAnnotationNodesCheckedLeadingComments.has(node)) {
      throw Object.assign(
        new Error(
          `'${node.type}' should be printed by '${printTypeAnnotationProperty.name}' function.`
        ),
        { parentNode: path.parent, propertyName: path.key }
      );
    }
  }
  const token = getTypeAnnotationFirstToken(path);
  return token ? [token, " ", print3("typeAnnotation")] : print3("typeAnnotation");
}

// src/language-js/print/function.js
var isMethodValue = ({ node, key, parent }) => key === "value" && node.type === "FunctionExpression" && (parent.type === "ObjectMethod" || parent.type === "ClassMethod" || parent.type === "ClassPrivateMethod" || parent.type === "MethodDefinition" || parent.type === "TSAbstractMethodDefinition" || parent.type === "TSDeclareMethod" || parent.type === "Property" && isMethod(parent));
function printFunction(path, options2, print3, args) {
  if (isMethodValue(path)) {
    return printMethodValue(path, options2, print3);
  }
  const { node } = path;
  let shouldExpandParameters = false;
  if (node.type === "FunctionExpression" && args?.expandLastArg) {
    const { parent } = path;
    if (isCallExpression(parent) && (getCallArguments(parent).length > 1 || getFunctionParameters(node).every(
      (param) => param.type === "Identifier" && !param.typeAnnotation
    ))) {
      shouldExpandParameters = true;
    }
  }
  const parametersDoc = printFunctionParameters(
    path,
    options2,
    print3,
    shouldExpandParameters
  );
  const returnTypeDoc = printReturnType(path, print3);
  const shouldGroupParameters = shouldGroupFunctionParameters(
    node,
    returnTypeDoc
  );
  const isFlowHookDeclaration = node.type === "HookDeclaration";
  const keyword = isFlowHookDeclaration ? "hook" : "function";
  return [
    printDeclareToken(path),
    node.async ? "async " : "",
    keyword,
    node.generator ? "*" : "",
    " ",
    node.id ? print3("id") : "",
    print3("typeParameters"),
    group([
      shouldGroupParameters ? group(parametersDoc) : parametersDoc,
      returnTypeDoc
    ]),
    node.body ? " " : "",
    print3("body"),
    node.declare || !node.body ? printSemicolon(options2) : ""
  ];
}
function printMethod(path, options2, print3) {
  const { node } = path;
  const { kind } = node;
  const value = node.value || node;
  const parts = [];
  if (!kind || kind === "init" || kind === "method" || kind === "constructor") {
    if (value.async) {
      parts.push("async ");
    }
  } else {
    noop_default(kind === "get" || kind === "set");
    parts.push(kind, " ");
  }
  if (value.generator) {
    parts.push("*");
  }
  parts.push(
    printKey(path, options2, print3),
    node.optional ? "?" : "",
    node === value ? printMethodValue(path, options2, print3) : print3("value")
  );
  return parts;
}
function printMethodValue(path, options2, print3) {
  const { node } = path;
  const parametersDoc = printFunctionParameters(path, options2, print3);
  const returnTypeDoc = printReturnType(path, print3);
  const shouldBreakParameters = shouldBreakFunctionParameters(node);
  const shouldGroupParameters = shouldGroupFunctionParameters(
    node,
    returnTypeDoc
  );
  const parts = [
    print3("typeParameters"),
    group([
      shouldBreakParameters ? group(parametersDoc, { shouldBreak: true }) : shouldGroupParameters ? group(parametersDoc) : parametersDoc,
      returnTypeDoc
    ])
  ];
  if (node.body) {
    parts.push(" ", print3("body"));
  } else {
    parts.push(printSemicolon(options2));
  }
  return parts;
}
function canPrintParamsWithoutParens(node) {
  const parameters = getFunctionParameters(node);
  return parameters.length === 1 && !node.typeParameters && !hasComment(node, CommentCheckFlags.Dangling) && parameters[0].type === "Identifier" && !parameters[0].typeAnnotation && !hasComment(parameters[0]) && !parameters[0].optional && !node.predicate && !node.returnType;
}
function shouldPrintParamsWithoutParens(path, options2) {
  if (options2.arrowParens === "always") {
    return false;
  }
  if (options2.arrowParens === "avoid") {
    const { node } = path;
    return canPrintParamsWithoutParens(node);
  }
  return false;
}
function printReturnType(path, print3) {
  const { node } = path;
  const returnType = printTypeAnnotationProperty(path, print3, "returnType");
  const parts = [returnType];
  if (node.predicate) {
    parts.push(print3("predicate"));
  }
  return parts;
}

// src/language-js/semicolon/semicolon.js
function shouldExpressionStatementPrintLeadingSemicolon(path, options2) {
  if (options2.semi) {
    return false;
  }
  const { node } = path;
  if (node.type !== "ExpressionStatement" || isSingleJsxExpressionStatementInMarkdown(path, options2) || isSingleVueEventBindingExpressionStatement(path, options2) || isSingleHtmlEventHandlerExpressionStatement(path, options2)) {
    return false;
  }
  const { key, parent } = path;
  if (
    // `Program.directives` don't need leading semicolon
    (key === "body" && (parent.type === "Program" || parent.type === "BlockStatement" || parent.type === "StaticBlock" || parent.type === "TSModuleBlock") || key === "consequent" && parent.type === "SwitchCase") && path.call(() => expressionNeedsAsiProtection(path, options2), "expression")
  ) {
    return true;
  }
  return false;
}
function expressionNeedsAsiProtection(path, options2) {
  const { node } = path;
  switch (node.type) {
    case "ParenthesizedExpression":
    case "TypeCastExpression":
    case "TSTypeAssertion":
    case "ArrayExpression":
    case "ArrayPattern":
    case "TemplateLiteral":
    case "TemplateElement":
    case "RegExpLiteral":
      return true;
    case "ArrowFunctionExpression":
      if (!shouldPrintParamsWithoutParens(path, options2)) {
        return true;
      }
      break;
    case "UnaryExpression": {
      const { prefix, operator } = node;
      if (prefix && (operator === "+" || operator === "-")) {
        return true;
      }
      break;
    }
    case "BindExpression":
      if (!node.object) {
        return true;
      }
      break;
    case "Literal":
      if (node.regex) {
        return true;
      }
      break;
    default:
      if (isJsxElement(node)) {
        return true;
      }
  }
  if (needs_parentheses_default(path, options2)) {
    return true;
  }
  if (!hasNakedLeftSide(node)) {
    return false;
  }
  return path.call(
    () => expressionNeedsAsiProtection(path, options2),
    ...getLeftSidePathName(node)
  );
}
var isSingleExpressionStatement = ({ node, parent }) => node.type === "ExpressionStatement" && parent.type === "Program" && parent.body.length === 1 && // In non-Babel parser, directives are `ExpressionStatement`s
(Array.isArray(parent.directives) && parent.directives.length === 0 || !parent.directives);
function isSingleJsxExpressionStatementInMarkdown(path, options2) {
  return (options2.parentParser === "markdown" || options2.parentParser === "mdx") && isSingleExpressionStatement(path) && isJsxElement(path.node.expression);
}
function isSingleHtmlEventHandlerExpressionStatement(path, options2) {
  return options2.__isHtmlInlineEventHandler && isSingleExpressionStatement(path);
}
function isSingleVueEventBindingExpressionStatement(path, options2) {
  return (options2.parser === "__vue_event_binding" || options2.parser === "__vue_ts_event_binding") && isSingleExpressionStatement(path);
}

// src/language-js/utilities/should-expression-statement-print-own-comments.js
function shouldExpressionStatementPrintOwnComments(path, options2) {
  if (!shouldExpressionStatementPrintLeadingSemicolon(path, options2)) {
    return false;
  }
  const lastComment = method_at_default(
    /* OPTIONAL_OBJECT: false */
    0,
    getComments(path.node, CommentCheckFlags.Leading),
    -1
  );
  if (lastComment && isTypeCastComment(lastComment)) {
    return true;
  }
  return false;
}

// src/language-js/comments/will-print-own-comments.js
var isClassOrInterface = createTypeCheckFunction([
  "ClassDeclaration",
  "ClassExpression",
  "DeclareClass",
  "DeclareInterface",
  "InterfaceDeclaration",
  "TSInterfaceDeclaration"
  // Can't have `id` or `typeParameters`
  // "InterfaceTypeAnnotation",
]);
function willPrintOwnComments(path, options2) {
  const { key, parent } = path;
  if (key === "types" && isUnionType(parent) || key === "argument" && parent.type === "JSXSpreadAttribute" || key === "expression" && parent.type === "JSXSpreadChild" || key === "superClass" && (parent.type === "ClassDeclaration" || parent.type === "ClassExpression") || (key === "id" || key === "typeParameters") && isClassOrInterface(parent) || // Not tested, don't know how to
  key === "patterns" && parent.type === "MatchOrPattern" || isIifeCalleeOrTaggedTemplateExpressionTag(path)) {
    return true;
  }
  const { node } = path;
  if (hasNodeIgnoreComment(node)) {
    return false;
  }
  if (node.type === "ExpressionStatement") {
    return shouldExpressionStatementPrintOwnComments(path, options2);
  }
  if (isUnionType(node)) {
    return shouldUnionTypePrintOwnComments(path);
  }
  if (isJsxElement(node)) {
    return true;
  }
  return false;
}
var will_print_own_comments_default = willPrintOwnComments;

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

// src/language-js/print/template-literal.js
function printTemplateLiteral(path, options2, print3) {
  if (isJestEachTemplateLiteral(path)) {
    const printed = printJestEachTemplateLiteral(path, options2, print3);
    if (printed) {
      return printed;
    }
  }
  const expressionDocs = printTemplateExpressions(path, options2, print3);
  const parts = path.map(({
    isLast,
    index
  }) => [print3(), isLast ? "" : expressionDocs[index]], "quasis");
  return [lineSuffixBoundary, "`", ...parts, "`"];
}
function printTaggedTemplateExpression(path, options2, print3) {
  const quasiDoc = print3("quasi");
  const {
    node
  } = path;
  let space = "";
  const quasiLeadingComment = getComments(node.quasi, CommentCheckFlags.Leading)[0];
  if (quasiLeadingComment) {
    if (has_newline_in_range_default(options2.originalText, locEnd(node.typeArguments ?? node.tag), locStart(quasiLeadingComment))) {
      space = softline;
    } else {
      space = " ";
    }
  }
  return label(quasiDoc.label && {
    tagged: true,
    ...quasiDoc.label
  }, [print3("tag"), print3("typeArguments"), space, lineSuffixBoundary, quasiDoc]);
}
function printJestEachTemplateLiteral(path, options2, print3) {
  const {
    node
  } = path;
  const headerNames = node.quasis[0].value.raw.trim().split(/\s*\|\s*/);
  if (headerNames.length > 1 || headerNames.some((headerName) => headerName.length > 0)) {
    options2.__inJestEach = true;
    const expressions = printTemplateExpressions(path, options2, print3);
    options2.__inJestEach = false;
    const stringifiedExpressions = expressions.map((doc) => printDocToString(doc, {
      ...options2,
      printWidth: Number.POSITIVE_INFINITY,
      endOfLine: "lf"
    }).formatted);
    const tableBody = [{
      hasLineBreak: false,
      cells: []
    }];
    for (let i = 1; i < node.quasis.length; i++) {
      const row = method_at_default(
        /* OPTIONAL_OBJECT: false */
        0,
        tableBody,
        -1
      );
      const correspondingExpression = stringifiedExpressions[i - 1];
      row.cells.push(correspondingExpression);
      if (correspondingExpression.includes("\n")) {
        row.hasLineBreak = true;
      }
      if (node.quasis[i].value.raw.includes("\n")) {
        tableBody.push({
          hasLineBreak: false,
          cells: []
        });
      }
    }
    const maxColumnCount = Math.max(headerNames.length, ...tableBody.map((row) => row.cells.length));
    const maxColumnWidths = Array.from({
      length: maxColumnCount
    }, () => 0);
    const table = [{
      cells: headerNames
    }, ...tableBody.filter((row) => row.cells.length > 0)];
    for (const row of table) {
      if (row.hasLineBreak) {
        continue;
      }
      for (const [index, cell] of row.cells.entries()) {
        maxColumnWidths[index] = Math.max(maxColumnWidths[index], get_string_width_default(cell));
      }
    }
    return [lineSuffixBoundary, "`", indent([hardline, join(hardline, table.map((row) => join(" | ", row.cells.map((cell, index) => row.hasLineBreak ? cell : cell + " ".repeat(maxColumnWidths[index] - get_string_width_default(cell))))))]), hardline, "`"];
  }
}
var templateLiteralIndentCache = /* @__PURE__ */ new WeakMap();
function getTemplateLiteralExpressionIndent(path, options2) {
  const {
    parent: templateLiteral,
    index
  } = path;
  const sizes = getOrInsertComputed(templateLiteralIndentCache, templateLiteral, (templateLiteral2) => {
    const {
      tabWidth
    } = options2;
    let previousQuasiIndentSize = 0;
    const sizes2 = templateLiteral2.quasis.map((quasi) => {
      const text = quasi.value.raw;
      const indentSize = text.includes("\n") ? get_indent_size_default(text, tabWidth) : previousQuasiIndentSize;
      previousQuasiIndentSize = indentSize;
      return {
        indentSize,
        previousQuasiText: text
      };
    });
    return sizes2;
  });
  return sizes[index];
}
function printTemplateExpression(path, options2, print3, shouldPreserveIndentation = true) {
  const {
    node,
    index
  } = path;
  let expressionDoc = print3();
  const templateLiteral = path.parent;
  const {
    quasis
  } = templateLiteral;
  const start = locEnd(quasis[index]);
  const end = locStart(quasis[index + 1]);
  let interpolationHasNewline = has_newline_in_range_default(options2.originalText, start, end);
  if (!interpolationHasNewline) {
    const renderedExpression = printDocToString(expressionDoc, {
      ...options2,
      printWidth: Number.POSITIVE_INFINITY
    }).formatted;
    if (renderedExpression.includes("\n")) {
      interpolationHasNewline = true;
    } else {
      expressionDoc = renderedExpression;
    }
  }
  if (interpolationHasNewline && (hasComment(node) || node.type === "Identifier" || isMemberExpression(stripChainElementWrappers(node)) || node.type === "ConditionalExpression" || node.type === "SequenceExpression" || isBinaryCastExpression(node) || isBinaryish(node))) {
    expressionDoc = [indent([softline, expressionDoc]), softline];
  }
  if (!shouldPreserveIndentation) {
    return group(["${", expressionDoc, lineSuffixBoundary, "}"]);
  }
  let {
    indentSize,
    previousQuasiText
  } = getTemplateLiteralExpressionIndent(path, options2);
  if (options2.__inJestEach) {
    indentSize = Math.max(indentSize, options2.tabWidth);
  }
  expressionDoc = indentSize === 0 && previousQuasiText.endsWith("\n") ? align(Number.NEGATIVE_INFINITY, expressionDoc) : addAlignmentToDoc(expressionDoc, indentSize, options2.tabWidth);
  return group(["${", expressionDoc, lineSuffixBoundary, "}"]);
}
function printTemplateExpressions(path, options2, print3) {
  return path.map(() => printTemplateExpression(path, options2, print3), path.node.type === "TSTemplateLiteralType" ? "types" : "expressions");
}
function printEmbeddedTemplateExpressions(path, options2, print3) {
  return path.map(() => printTemplateExpression(
    path,
    options2,
    print3,
    /* shouldPreserveIndentation */
    false
  ), "expressions");
}
function escapeTemplateCharacters(doc, raw) {
  return mapDoc(doc, (currentDoc) => {
    if (typeof currentDoc === "string") {
      return raw ? method_replace_all_default(
        /* OPTIONAL_OBJECT: false */
        0,
        currentDoc,
        /(\\*)`/g,
        "$1$1\\`"
      ) : uncookTemplateElementValue(currentDoc);
    }
    return currentDoc;
  });
}
function uncookTemplateElementValue(cookedValue) {
  return method_replace_all_default(
    /* OPTIONAL_OBJECT: false */
    0,
    cookedValue,
    /([\\`]|\$\{)/g,
    "\\$1"
  );
}
var jestEachTriggerRegex = /^[fx]?(?:describe|it|test)$/;
function isJestEachTemplateLiteral({
  node,
  parent
}) {
  return node.type === "TemplateLiteral" && parent.type === "TaggedTemplateExpression" && parent.quasi === node && parent.tag.type === "MemberExpression" && parent.tag.property.type === "Identifier" && parent.tag.property.name === "each" && (parent.tag.object.type === "Identifier" && jestEachTriggerRegex.test(parent.tag.object.name) || parent.tag.object.type === "MemberExpression" && parent.tag.object.property.type === "Identifier" && (parent.tag.object.property.name === "only" || parent.tag.object.property.name === "skip") && parent.tag.object.object.type === "Identifier" && jestEachTriggerRegex.test(parent.tag.object.object.name));
}

// src/language-js/embed/utilities.js
var angularComponentObjectExpressionPredicates = [
  (node, name) => name === "properties" && node.type === "ObjectExpression",
  (node, name) => name === "arguments" && node.type === "CallExpression" && node.callee.type === "Identifier" && node.callee.name === "Component",
  (node, name) => name === "expression" && node.type === "Decorator"
];
function isAngularComponentStyles(path) {
  const isTemplateLiteral = (node) => node.type === "TemplateLiteral";
  const isObjectPropertyNamedStyles = (node, key) => isObjectProperty(node) && !node.computed && node.key.type === "Identifier" && node.key.name === "styles" && key === "value";
  return path.match(
    isTemplateLiteral,
    (node, name) => isArrayExpression(node) && name === "elements",
    isObjectPropertyNamedStyles,
    ...angularComponentObjectExpressionPredicates
  ) || path.match(
    isTemplateLiteral,
    isObjectPropertyNamedStyles,
    ...angularComponentObjectExpressionPredicates
  );
}
function isAngularComponentTemplate(path) {
  return path.match(
    (node) => node.type === "TemplateLiteral",
    (node, name) => isObjectProperty(node) && !node.computed && node.key.type === "Identifier" && node.key.name === "template" && name === "value",
    ...angularComponentObjectExpressionPredicates
  );
}
function hasLeadingBlockCommentWithName(node, languageName) {
  return hasComment(
    node,
    CommentCheckFlags.Block | CommentCheckFlags.Leading,
    ({ value }) => value === ` ${languageName} `
  );
}
function hasLanguageComment({ node, parent }, languageName) {
  return hasLeadingBlockCommentWithName(node, languageName) || isAsConstExpression(parent) && hasLeadingBlockCommentWithName(parent, languageName) || parent.type === "ExpressionStatement" && hasLeadingBlockCommentWithName(parent, languageName);
}
function isAsConstExpression(node) {
  return node.type === "AsConstExpression" || node.type === "TSAsExpression" && node.typeAnnotation.type === "TSTypeReference" && node.typeAnnotation.typeName.type === "Identifier" && node.typeAnnotation.typeName.name === "const";
}

// src/language-js/embed/css.js
async function printEmbedCss(textToDoc, print3, path, options2) {
  const { node } = path;
  let text = "";
  for (const [index, quasis] of node.quasis.entries()) {
    const { raw } = quasis.value;
    if (index > 0) {
      text += "@prettier-placeholder-" + (index - 1) + "-id";
    }
    text += raw;
  }
  const quasisDoc = await textToDoc(text, { parser: "scss" });
  const expressionDocs = printEmbeddedTemplateExpressions(path, options2, print3);
  const newDoc = replacePlaceholders(quasisDoc, expressionDocs);
  if (!newDoc) {
    throw new Error("Couldn't insert all the expressions");
  }
  return ["`", indent([hardline, newDoc]), softline, "`"];
}
function replacePlaceholders(quasisDoc, expressionDocs) {
  if (!is_non_empty_array_default(expressionDocs)) {
    return quasisDoc;
  }
  let replaceCounter = 0;
  const newDoc = mapDoc(cleanDoc(quasisDoc), (doc) => {
    if (typeof doc !== "string" || !doc.includes("@prettier-placeholder")) {
      return doc;
    }
    return doc.split(/@prettier-placeholder-(\d+)-id/).map((component, idx) => {
      if (idx % 2 === 0) {
        return replaceEndOfLine(component);
      }
      replaceCounter++;
      return expressionDocs[component];
    });
  });
  return expressionDocs.length === replaceCounter ? newDoc : null;
}
function isStyledJsx(path) {
  return path.match(
    void 0,
    (node, key) => key === "quasi" && node.type === "TaggedTemplateExpression" && isNodeMatches(node.tag, ["css", "css.global", "css.resolve"])
  ) || path.match(
    void 0,
    (node, key) => key === "expression" && node.type === "JSXExpressionContainer",
    (node, key) => key === "children" && node.type === "JSXElement" && node.openingElement.name.type === "JSXIdentifier" && node.openingElement.name.name === "style" && node.openingElement.attributes.some(
      (attribute) => attribute.type === "JSXAttribute" && attribute.name.type === "JSXIdentifier" && attribute.name.name === "jsx"
    )
  );
}
function isStyledIdentifier(node) {
  return node.type === "Identifier" && node.name === "styled";
}
function isStyledExtend(node) {
  return /^[A-Z]/.test(node.object.name) && node.property.name === "extend";
}
function isStyledComponents({ parent }) {
  if (!parent || parent.type !== "TaggedTemplateExpression") {
    return false;
  }
  const tag = parent.tag.type === "ParenthesizedExpression" ? parent.tag.expression : parent.tag;
  switch (tag.type) {
    case "MemberExpression":
      return (
        // styled.foo``
        isStyledIdentifier(tag.object) || // Component.extend``
        isStyledExtend(tag)
      );
    case "CallExpression":
      return (
        // styled(Component)``
        isStyledIdentifier(tag.callee) || tag.callee.type === "MemberExpression" && (tag.callee.object.type === "MemberExpression" && // styled.foo.attrs({})``
        (isStyledIdentifier(tag.callee.object.object) || // Component.extend.attrs({})``
        isStyledExtend(tag.callee.object)) || // styled(Component).attrs({})``
        tag.callee.object.type === "CallExpression" && isStyledIdentifier(tag.callee.object.callee))
      );
    case "Identifier":
      return tag.name === "css";
    default:
      return false;
  }
}
function isCssProp({ parent, grandparent }) {
  return grandparent?.type === "JSXAttribute" && parent.type === "JSXExpressionContainer" && grandparent.name.type === "JSXIdentifier" && grandparent.name.name === "css";
}
var isEmbedCss = (path) => isStyledJsx(path) || isStyledComponents(path) || isCssProp(path) || isAngularComponentStyles(path);

// src/language-js/embed/graphql.js
async function printEmbedGraphQL(textToDoc, print3, path, options2) {
  const { node } = path;
  const numQuasis = node.quasis.length;
  const expressionDocs = printEmbeddedTemplateExpressions(path, options2, print3);
  const parts = [];
  for (let i = 0; i < numQuasis; i++) {
    const templateElement = node.quasis[i];
    const isFirst = i === 0;
    const isLast = i === numQuasis - 1;
    const text = templateElement.value.cooked;
    const lines = text.split("\n");
    const numLines = lines.length;
    if (!isLast && /#[^\n\r]*$/.test(lines[numLines - 1])) {
      return null;
    }
    const startsWithBlankLine = numLines > 2 && lines[0].trim() === "" && lines[1].trim() === "";
    const endsWithBlankLine = numLines > 2 && lines[numLines - 1].trim() === "" && lines[numLines - 2].trim() === "";
    const commentsAndWhitespaceOnly = lines.every(
      (line2) => /^\s*(?:#[^\n\r]*)?$/.test(line2)
    );
    let doc;
    if (commentsAndWhitespaceOnly) {
      doc = printGraphqlComments(lines);
    } else {
      doc = await textToDoc(text, { parser: "graphql" });
    }
    if (doc) {
      doc = escapeTemplateCharacters(doc, false);
      if (!isFirst && startsWithBlankLine) {
        parts.push("");
      }
      parts.push(doc);
      if (!isLast && endsWithBlankLine) {
        parts.push("");
      }
    } else if (!isFirst && !isLast && startsWithBlankLine) {
      parts.push("");
    }
    if (!isLast) {
      parts.push(expressionDocs[i]);
    }
  }
  return ["`", indent([hardline, join(hardline, parts)]), hardline, "`"];
}
function printGraphqlComments(lines) {
  const parts = [];
  let seenComment = false;
  const array = lines.map((textLine) => textLine.trim());
  for (const [i, textLine] of array.entries()) {
    if (textLine === "") {
      continue;
    }
    if (array[i - 1] === "" && seenComment) {
      parts.push([hardline, textLine]);
    } else {
      parts.push(textLine);
    }
    seenComment = true;
  }
  return parts.length === 0 ? null : join(hardline, parts);
}
function isEmbedGraphQL({ node, parent }) {
  return hasLanguageComment({ node, parent }, "GraphQL") || parent && (parent.type === "TaggedTemplateExpression" && (parent.tag.type === "MemberExpression" && parent.tag.object.name === "graphql" && parent.tag.property.name === "experimental" || parent.tag.type === "Identifier" && (parent.tag.name === "gql" || parent.tag.name === "graphql")) || parent.type === "CallExpression" && parent.callee.type === "Identifier" && parent.callee.name === "graphql");
}

// src/language-js/embed/html.js
var htmlTemplateLiteralCounter = 0;
async function printEmbedHtmlLike(parser, textToDoc, print3, path, options2) {
  const {
    node
  } = path;
  const counter = htmlTemplateLiteralCounter;
  htmlTemplateLiteralCounter = htmlTemplateLiteralCounter + 1 >>> 0;
  const composePlaceholder = (index) => `PRETTIER_HTML_PLACEHOLDER_${index}_${counter}_IN_JS`;
  const text = node.quasis.map((quasi, index, quasis) => index === quasis.length - 1 ? quasi.value.cooked : quasi.value.cooked + composePlaceholder(index)).join("");
  const expressionDocs = printEmbeddedTemplateExpressions(path, options2, print3);
  const placeholderRegex = new RegExp(composePlaceholder("(\\d+)"), "g");
  let topLevelCount = 0;
  const doc = await textToDoc(text, {
    parser,
    __onHtmlRoot(root) {
      topLevelCount = root.children.length;
    }
  });
  const contentDoc = mapDoc(doc, (doc2) => {
    if (typeof doc2 !== "string") {
      return doc2;
    }
    const parts = [];
    const components = doc2.split(placeholderRegex);
    for (let i = 0; i < components.length; i++) {
      let component = components[i];
      if (i % 2 === 0) {
        if (component) {
          component = uncookTemplateElementValue(component);
          if (options2.__embeddedInHtml) {
            component = method_replace_all_default(
              /* OPTIONAL_OBJECT: false */
              0,
              component,
              /<\/(?=script\b)/gi,
              "<\\/"
            );
          }
          parts.push(component);
        }
        continue;
      }
      const placeholderIndex = Number(component);
      parts.push(expressionDocs[placeholderIndex]);
    }
    return parts;
  });
  const leadingWhitespace = /^\s/.test(text) ? " " : "";
  const trailingWhitespace = /\s$/.test(text) ? " " : "";
  const linebreak = options2.htmlWhitespaceSensitivity === "ignore" ? hardline : leadingWhitespace && trailingWhitespace ? line : null;
  if (linebreak) {
    return group(["`", indent([linebreak, group(contentDoc)]), linebreak, "`"]);
  }
  return label({
    hug: false
  }, group(["`", leadingWhitespace, topLevelCount > 1 ? indent(group(contentDoc)) : group(contentDoc), trailingWhitespace, "`"]));
}
function isEmbedHtml(path) {
  return hasLanguageComment(path, "HTML") || path.match((node) => node.type === "TemplateLiteral", (node, name) => node.type === "TaggedTemplateExpression" && node.tag.type === "Identifier" && node.tag.name === "html" && name === "quasi");
}
var printEmbedHtml = printEmbedHtmlLike.bind(void 0, "html");
var printEmbedAngular = printEmbedHtmlLike.bind(void 0, "angular");

// src/language-js/embed/markdown.js
async function printEmbedMarkdown(textToDoc, print3, path) {
  const {
    node
  } = path;
  let text = method_replace_all_default(
    /* OPTIONAL_OBJECT: false */
    0,
    node.quasis[0].value.raw,
    /((?:\\\\)*)\\`/g,
    (_, backslashes) => "\\".repeat(backslashes.length / 2) + "`"
  );
  const indentation = getIndentation(text);
  const hasIndent = indentation !== "";
  if (hasIndent) {
    text = method_replace_all_default(
      /* OPTIONAL_OBJECT: false */
      0,
      text,
      new RegExp(`^${indentation}`, "gm"),
      ""
    );
  }
  const doc = escapeTemplateCharacters(await textToDoc(text, {
    parser: "markdown",
    __inJsTemplate: true
  }), true);
  return ["`", hasIndent ? indent([softline, doc]) : [literalline, dedentToRoot(doc)], softline, "`"];
}
function getIndentation(str) {
  const firstMatchedIndent = str.match(/^([^\S\n]*)\S/m);
  return firstMatchedIndent === null ? "" : firstMatchedIndent[1];
}
function isEmbedMarkdown({
  node,
  parent
}) {
  return parent?.type === "TaggedTemplateExpression" && node.quasis.length === 1 && parent.tag.type === "Identifier" && (parent.tag.name === "md" || parent.tag.name === "markdown");
}

// src/language-js/embed/index.js
var printers = [
  { test: isEmbedCss, print: printEmbedCss },
  { test: isEmbedGraphQL, print: printEmbedGraphQL },
  { test: isEmbedHtml, print: printEmbedHtml },
  { test: isAngularComponentTemplate, print: printEmbedAngular },
  { test: isEmbedMarkdown, print: printEmbedMarkdown }
].map(({ test, print: print3 }) => ({
  test,
  print: createTemplateLiteralPrint(print3)
}));
function embed(path) {
  const { node } = path;
  if (node.type !== "TemplateLiteral" || // Bail out if any of the quasis have an invalid escape sequence
  // (which would make the `cooked` value be `null`)
  hasInvalidCookedValue(node)) {
    return;
  }
  const printer = printers.find(({ test }) => test(path));
  if (!printer) {
    return;
  }
  if (
    // Special case: whitespace-only template literals
    node.quasis.length === 1 && node.quasis[0].value.raw.trim() === ""
  ) {
    return "``";
  }
  return printer.print;
}
function createTemplateLiteralPrint(print3) {
  return async (...args) => {
    const doc = await print3(...args);
    return doc && label({ embed: true, ...doc.label }, doc);
  };
}
function hasInvalidCookedValue({ quasis }) {
  return quasis.some(({ value: { cooked } }) => cooked === null);
}
var embed_default = embed;

// src/language-js/massage-ast/chain-expression.js
function cleanChainExpression(original, cloned) {
  if (original.type === "ChainExpression") {
    cleanEstreeChainExpression(cloned);
  } else if (original.type === "OptionalMemberExpression" || original.type === "OptionalCallExpression") {
    cleanBabelChainExpression(cloned);
  }
}
function getChainElementProperty(node) {
  if (isMemberExpression(node)) {
    return "object";
  }
  if (isCallExpression(node)) {
    return "callee";
  }
  if (isChainElementWrapper(node)) {
    return "expression";
  }
}
function getChainElement(node) {
  const property = getChainElementProperty(node);
  if (property) {
    return node[property];
  }
}
function cleanEstreeChainExpression(node) {
  for (node = getChainElement(node); node.type === "MemberExpression" || node.type === "CallExpression" || node.type === "TSNonNullExpression"; node = getChainElement(node)) {
    const property = getChainElementProperty(node);
    const child = node[property];
    if (child.type === "ChainExpression") {
      node[property] = child.expression;
    }
  }
}
function cleanBabelChainExpression(node) {
  for (node = getChainElement(node); node.type === "MemberExpression" || node.type === "CallExpression"; node = getChainElement(node)) {
    node.type = `Optional${node.type}`;
  }
}

// src/language-js/massage-ast/key.js
function cleanNodeKey(cloned, original, property) {
  const key = original[property];
  if (isStringLiteral(key) || isNumericLiteral(key)) {
    cloned[property] = String(key.value);
  }
  if (key.type === "Identifier") {
    cloned[property] = key.name;
  }
}
function cleanKey(original, cloned) {
  if ((original.type === "Property" || original.type === "ObjectProperty" || original.type === "MethodDefinition" || original.type === "ClassProperty" || original.type === "ClassMethod" || original.type === "PropertyDefinition" || original.type === "TSDeclareMethod" || original.type === "TSPropertySignature" || original.type === "TSMethodSignature" || original.type === "ObjectTypeProperty" || original.type === "ImportAttribute" || original.type === "RecordDeclarationProperty" || original.type === "RecordDeclarationStaticProperty") && // @ts-expect-error -- safe
  !original.computed) {
    cleanNodeKey(cloned, original, "key");
  }
  if (original.type === "TSEnumMember") {
    cleanNodeKey(cloned, original, "id");
  }
}

// src/language-js/massage-ast/regexp-literal.js
function cleanRegExpLiteral(original, cloned) {
  if (original.type === "RegExpLiteral") {
    cloned.flags = [...original.flags].sort().join("");
  }
  if (original.type === "Literal" && "regex" in original) {
    cloned.regex.flags = [...original.regex.flags].sort().join("");
  }
}

// src/language-js/massage-ast/index.js
var ignoredProperties = /* @__PURE__ */ new Set([
  "range",
  "raw",
  "comments",
  "extra",
  "start",
  "end",
  "loc",
  "errors",
  "tokens",
  // Hermes
  "trailingComma",
  "docblock",
  // Prettier
  "__contentEnd"
]);
var removeTemplateElementsValue = (node) => {
  for (const templateElement of node.quasis) {
    delete templateElement.value;
  }
};
function massageAstNode(original, cloned, parent) {
  if (original.type === "Program") {
    delete cloned.sourceType;
  }
  cleanChainExpression(original, cloned);
  cleanKey(original, cloned);
  cleanRegExpLiteral(original, cloned);
  if ((isBigIntLiteral(original) || original.type === "BigIntLiteralTypeAnnotation") && "bigint" in original) {
    cloned.bigint = original.bigint.toLowerCase();
  }
  if (original.type === "EmptyStatement" && !isMeaningfulEmptyStatement({
    node: original,
    parent
  })) {
    return null;
  }
  if (original.type === "JSXText") {
    return null;
  }
  if (original.type === "JSXExpressionContainer" && (original.expression.type === "Literal" || original.expression.type === "StringLiteral") && original.expression.value === " ") {
    return null;
  }
  if (original.type === "JSXElement" && original.openingElement.name.type === "JSXIdentifier" && original.openingElement.name.name === "style" && original.openingElement.attributes.some((attr) => attr.type === "JSXAttribute" && attr.name.name === "jsx")) {
    for (const {
      type,
      expression: expression2
    } of cloned.children) {
      if (type === "JSXExpressionContainer" && expression2.type === "TemplateLiteral") {
        removeTemplateElementsValue(expression2);
      }
    }
  }
  if (original.type === "JSXAttribute" && original.name.name === "css" && original.value.type === "JSXExpressionContainer" && original.value.expression.type === "TemplateLiteral") {
    removeTemplateElementsValue(cloned.value.expression);
  }
  if (original.type === "JSXAttribute" && isStringLiteral(original.value) && /["']|&quot;|&apos;/.test(original.value.value)) {
    cloned.value.value = method_replace_all_default(
      /* OPTIONAL_OBJECT: false */
      0,
      original.value.value,
      /["']|&quot;|&apos;/g,
      '"'
    );
  }
  const expression = original.expression || original.callee;
  if (original.type === "Decorator" && expression.type === "CallExpression" && expression.callee.name === "Component" && expression.arguments.length === 1) {
    const astProps = original.expression.arguments[0].properties;
    for (const [index, prop] of cloned.expression.arguments[0].properties.entries()) {
      switch (astProps[index].key.name) {
        case "styles":
          if (isArrayExpression(prop.value)) {
            removeTemplateElementsValue(prop.value.elements[0]);
          }
          break;
        case "template":
          if (prop.value.type === "TemplateLiteral") {
            removeTemplateElementsValue(prop.value);
          }
          break;
      }
    }
  }
  if (original.type === "TaggedTemplateExpression" && (original.tag.type === "MemberExpression" || original.tag.type === "Identifier" && (original.tag.name === "gql" || original.tag.name === "graphql" || original.tag.name === "css" || original.tag.name === "md" || original.tag.name === "markdown" || original.tag.name === "html") || original.tag.type === "CallExpression")) {
    removeTemplateElementsValue(cloned.quasi);
  }
  if ((original.type === "CallExpression" || original.type === "MemberExpression") && // @ts-expect-error -- safe
  !original.optional) {
    delete cloned.optional;
  }
  if (original.type === "TemplateLiteral") {
    removeTemplateElementsValue(cloned);
  }
}
massageAstNode.ignoredProperties = ignoredProperties;

// node_modules/jest-docblock/build/index.js
var commentEndRe = /\*\/$/;
var commentStartRe = /^\/\*\*?/;
var docblockRe = /^\s*(\/\*\*?(.|\r?\n)*?\*\/)/;
var lineCommentRe = /(^|\s+)\/\/([^\n\r]*)/g;
var ltrimNewlineRe = /^(\r?\n)+/;
var multilineRe = /(?:^|\r?\n) *(@[^\n\r]*?) *\r?\n *(?![^\n\r@]*\/\/[^]*)([^\s@][^\n\r@]+?) *\r?\n/g;
var propertyRe = /(?:^|\r?\n) *@(\S+) *([^\n\r]*)/g;
var stringStartRe = /(\r?\n|^) *\* ?/g;
var STRING_ARRAY = [];
function extract(contents) {
  const match = contents.match(docblockRe);
  return match ? match[0].trimStart() : "";
}
function strip(contents) {
  const matchResult = contents.match(docblockRe);
  const match = matchResult?.[0];
  return match == null ? contents : contents.slice(match.length);
}
function parseWithComments(docblock) {
  const line2 = "\n";
  docblock = method_replace_all_default(
    /* OPTIONAL_OBJECT: false */
    0,
    docblock.replace(commentStartRe, "").replace(commentEndRe, ""),
    stringStartRe,
    "$1"
  );
  let prev = "";
  while (prev !== docblock) {
    prev = docblock;
    docblock = method_replace_all_default(
      /* OPTIONAL_OBJECT: false */
      0,
      docblock,
      multilineRe,
      `${line2}$1 $2${line2}`
    );
  }
  docblock = docblock.replace(ltrimNewlineRe, "").trimEnd();
  const result = /* @__PURE__ */ Object.create(null);
  const comments = method_replace_all_default(
    /* OPTIONAL_OBJECT: false */
    0,
    docblock,
    propertyRe,
    ""
  ).replace(ltrimNewlineRe, "").trimEnd();
  let match;
  while (match = propertyRe.exec(docblock)) {
    const nextPragma = method_replace_all_default(
      /* OPTIONAL_OBJECT: false */
      0,
      match[2],
      lineCommentRe,
      ""
    );
    if (typeof result[match[1]] === "string" || Array.isArray(result[match[1]])) {
      const resultElement = result[match[1]];
      result[match[1]] = [...STRING_ARRAY, ...Array.isArray(resultElement) ? resultElement : [resultElement], nextPragma];
    } else {
      result[match[1]] = nextPragma;
    }
  }
  return {
    comments,
    pragmas: result
  };
}
function print({
  comments = "",
  pragmas = {}
}) {
  const line2 = "\n";
  const head = "/**";
  const start = " *";
  const tail = " */";
  const keys = Object.keys(pragmas);
  const printedObject = keys.flatMap((key) => printKeyValues(key, pragmas[key])).map((keyValue) => `${start} ${keyValue}${line2}`).join("");
  if (!comments) {
    if (keys.length === 0) {
      return "";
    }
    if (keys.length === 1 && !Array.isArray(pragmas[keys[0]])) {
      const value = pragmas[keys[0]];
      return `${head} ${printKeyValues(keys[0], value)[0]}${tail}`;
    }
  }
  const printedComments = comments.split(line2).map((textLine) => `${start} ${textLine}`).join(line2) + line2;
  return head + line2 + (comments ? printedComments : "") + (comments && keys.length > 0 ? start + line2 : "") + printedObject + tail;
}
function printKeyValues(key, valueOrArray) {
  return [...STRING_ARRAY, ...Array.isArray(valueOrArray) ? valueOrArray : [valueOrArray]].map((value) => `@${key} ${value}`.trim());
}

// src/utilities/pragma/pragma.evaluate.js
var FORMAT_PRAGMA_TO_INSERT = "format";

// src/language-js/utilities/get-shebang.js
function getShebang(text) {
  if (!text.startsWith("#!")) {
    return "";
  }
  const index = text.indexOf("\n");
  if (index === -1) {
    return text;
  }
  return text.slice(0, index);
}
var get_shebang_default = getShebang;

// src/language-js/pragma.js
function parseDocBlock(text) {
  const shebang = get_shebang_default(text);
  if (shebang) {
    text = text.slice(shebang.length + 1);
  }
  const docBlock = extract(text);
  const {
    pragmas,
    comments
  } = parseWithComments(docBlock);
  return {
    shebang,
    text,
    pragmas,
    comments
  };
}
function insertPragma(originalText) {
  const {
    shebang,
    text,
    pragmas,
    comments
  } = parseDocBlock(originalText);
  const strippedText = strip(text);
  let docBlock = print({
    pragmas: {
      [FORMAT_PRAGMA_TO_INSERT]: "",
      ...pragmas
    },
    comments: comments.trimStart()
  });
  if (false) {
    docBlock = normalizeEndOfLine(docBlock);
  }
  return (shebang ? `${shebang}
` : "") + docBlock + (strippedText.startsWith("\n") ? "\n" : "\n\n") + strippedText;
}

// src/language-js/utilities/indentable-block-comment.js
function getIndentableBlockCommentLinesInternal(comment) {
  if (!isBlockComment(comment)) {
    return [];
  }
  if (!comment.value.includes("\n")) {
    return [];
  }
  const trimmedLines = [];
  for (let line2 of `*${comment.value}*`.split("\n")) {
    line2 = line2.trimStart();
    if (!line2.startsWith("*")) {
      return [];
    }
    trimmedLines.push(line2);
  }
  return trimmedLines;
}
var cache4 = /* @__PURE__ */ new WeakMap();
function getIndentableBlockCommentLines(comment) {
  return getOrInsertComputed(
    cache4,
    comment,
    getIndentableBlockCommentLinesInternal
  );
}
function isIndentableBlockComment(comment) {
  return getIndentableBlockCommentLines(comment).length > 0;
}

// src/language-js/print/comment.js
function printComment2(path, options2) {
  const comment = path.node;
  if (isLineComment(comment)) {
    return options2.originalText.slice(locStart(comment), locEnd(comment)).trimEnd();
  }
  if (isIndentableBlockComment(comment)) {
    return printIndentableBlockComment(comment);
  }
  if (isBlockComment(comment)) {
    return ["/*", replaceEndOfLine(comment.value), "*/"];
  }
  throw new Error("Not a comment: " + JSON.stringify(comment));
}
function printIndentableBlockComment(comment) {
  const lines = getIndentableBlockCommentLines(comment);
  const isJsdoc = comment.value[0] === "*" && comment.value[1] !== "*";
  return [
    "/",
    lines.map((line2, index) => {
      if (index === 0) {
        return [line2.trimEnd(), hardline];
      }
      if (index === lines.length - 1) {
        return [" ", line2];
      }
      const trimmed = line2.trimEnd();
      const content = [" ", trimmed];
      if (isJsdoc && trimmed !== "*" && line2.endsWith("  ")) {
        return [content, "  ", markAsRoot(literalline)];
      }
      return [content, hardline];
    }),
    "/"
  ];
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

// src/language-js/utilities/jsx-whitespace.js
var jsxWhitespace = new whitespace_utilities_default(" \n\r	");

// src/language-js/utilities/is-meaningful-jsx-text.js
function isMeaningfulJsxText(node) {
  return node.type === "JSXText" && (jsxWhitespace.hasNonWhitespaceCharacter(getRaw(node)) || !/\n/.test(getRaw(node)));
}

// src/language-js/utilities/has-jsx-ignore-comment.js
function hasJsxIgnoreComment(path) {
  const { node, parent } = path;
  if (!isJsxElement(node) || !isJsxElement(parent)) {
    return false;
  }
  const { index, siblings } = path;
  let prevSibling;
  for (let i = index; i > 0; i--) {
    const candidate = siblings[i - 1];
    if (candidate.type === "JSXText" && !isMeaningfulJsxText(candidate)) {
      continue;
    }
    prevSibling = candidate;
    break;
  }
  return prevSibling?.type === "JSXExpressionContainer" && prevSibling.expression.type === "JSXEmptyExpression" && hasNodeIgnoreComment(prevSibling.expression);
}

// src/language-js/utilities/is-ignored.js
function isIgnored(path) {
  return hasNodeIgnoreComment(path.node) || hasJsxIgnoreComment(path);
}
var is_ignored_default = isIgnored;

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

// src/language-js/utilities/is-boolean-type-coercion.js
function isBooleanTypeCoercion(node) {
  return node.type === "CallExpression" && // @ts-expect-error -- expected
  !node.optional && node.arguments.length === 1 && node.callee.type === "Identifier" && node.callee.name === "Boolean";
}

// src/language-js/print/binaryish.js
var uid = 0;
function printBinaryishExpression(path, options2, print3) {
  const {
    node,
    parent,
    grandparent,
    key
  } = path;
  const isInsideParenthesis = key !== "body" && (parent.type === "IfStatement" || parent.type === "WhileStatement" || parent.type === "SwitchStatement" || parent.type === "DoWhileStatement");
  const isHackPipeline = node.operator === "|>" && path.root.extra?.__isUsingHackPipeline;
  const parts = printBinaryishExpressions(
    path,
    options2,
    print3,
    /* isNested */
    false,
    isInsideParenthesis
  );
  if (isInsideParenthesis) {
    return parts;
  }
  if (isHackPipeline) {
    return group(parts);
  }
  if (key === "callee" && isCallOrNewExpression(parent) || // `UnaryExpression` adds parentheses and indention when argument has comment
  parent.type === "UnaryExpression" && !hasComment(node) || isMemberExpression(parent) && !parent.computed) {
    return group([indent([softline, ...parts]), softline]);
  }
  const shouldNotIndent = isReturnOrThrowStatement(parent) || parent.type === "JSXExpressionContainer" && grandparent.type === "JSXAttribute" || node.operator !== "|" && parent.type === "JsExpressionRoot" || node.type !== "NGPipeExpression" && (parent.type === "NGRoot" && options2.parser === "__ng_binding" || parent.type === "NGMicrosyntaxExpression" && grandparent.type === "NGMicrosyntax" && grandparent.body.length === 1) || node === parent.body && parent.type === "ArrowFunctionExpression" || node !== parent.body && parent.type === "ForStatement" || parent.type === "ConditionalExpression" && !isReturnOrThrowStatement(grandparent) && !isCallOrNewExpression(grandparent) || parent.type === "TemplateLiteral" || key === "argument" && parent.type === "UnaryExpression" || key === "arguments" && isBooleanTypeCoercion(parent);
  const shouldIndentIfInlining = parent.type === "AssignmentExpression" || parent.type === "VariableDeclarator" || parent.type === "ClassProperty" || parent.type === "PropertyDefinition" || parent.type === "TSAbstractPropertyDefinition" || parent.type === "ClassPrivateProperty" || isObjectProperty(parent);
  const samePrecedenceSubExpression = isBinaryish(node.left) && shouldFlatten(node.operator, node.left.operator);
  if (shouldNotIndent || shouldInlineLogicalExpression(node) && !samePrecedenceSubExpression || !shouldInlineLogicalExpression(node) && shouldIndentIfInlining) {
    return group(parts);
  }
  if (parts.length === 0) {
    return "";
  }
  const hasJsx = isJsxElement(node.right);
  const firstGroupIndex = parts.findIndex((part) => typeof part !== "string" && !Array.isArray(part) && part.type === DOC_TYPE_GROUP);
  const headParts = parts.slice(0, firstGroupIndex === -1 ? 1 : firstGroupIndex + 1);
  const rest = parts.slice(headParts.length, hasJsx ? -1 : void 0);
  const groupId = /* @__PURE__ */ Symbol("logicalChain-" + ++uid);
  const chain = group([
    // Don't include the initial expression in the indentation
    // level. The first item is guaranteed to be the first
    // left-most expression.
    ...headParts,
    indent(rest)
  ], {
    id: groupId
  });
  if (!hasJsx) {
    return chain;
  }
  const jsxPart = method_at_default(
    /* OPTIONAL_OBJECT: false */
    0,
    parts,
    -1
  );
  return group([chain, indentIfBreak(jsxPart, {
    groupId
  })]);
}
function printBinaryishExpressions(path, options2, print3, isNested, isInsideParenthesis) {
  const {
    node
  } = path;
  if (!isBinaryish(node)) {
    return [group(print3())];
  }
  let parts = [];
  if (shouldFlatten(node.operator, node.left.operator)) {
    parts = path.call(() => printBinaryishExpressions(
      path,
      options2,
      print3,
      /* isNested */
      true,
      isInsideParenthesis
    ), "left");
  } else {
    parts.push(group(print3("left")));
  }
  const shouldInline = shouldInlineLogicalExpression(node);
  const rightNodeToCheckComments = node.right.type === "ChainExpression" ? node.right.expression : node.right;
  const lineBeforeOperator = (node.type === "NGPipeExpression" || node.operator === "|>" || isVueFilterSequenceExpression(path, options2)) && !hasLeadingOwnLineComment(options2.originalText, rightNodeToCheckComments);
  const hasTypeCastComment = hasComment(rightNodeToCheckComments, CommentCheckFlags.Leading, isTypeCastComment);
  const commentBeforeOperator = !hasTypeCastComment && hasLeadingOwnLineComment(options2.originalText, rightNodeToCheckComments);
  const operator = node.type === "NGPipeExpression" ? "|" : node.operator;
  const rightSuffix = node.type === "NGPipeExpression" && node.arguments.length > 0 ? group(indent([softline, ": ", join([line, ": "], path.map(() => align(2, group(print3())), "arguments"))])) : "";
  let right;
  if (shouldInline) {
    right = [operator, hasLeadingOwnLineComment(options2.originalText, rightNodeToCheckComments) ? indent([line, print3("right"), rightSuffix]) : [" ", print3("right"), rightSuffix]];
  } else {
    const isHackPipeline = operator === "|>" && path.root.extra?.__isUsingHackPipeline;
    const rightContent = isHackPipeline ? path.call(() => printBinaryishExpressions(
      path,
      options2,
      print3,
      /* isNested */
      true,
      isInsideParenthesis
    ), "right") : print3("right");
    if (options2.experimentalOperatorPosition === "start") {
      let comment = "";
      if (commentBeforeOperator) {
        switch (get_doc_type_default(rightContent)) {
          case DOC_TYPE_ARRAY:
            comment = rightContent[0];
            rightContent.shift();
            break;
          case DOC_TYPE_LABEL:
            comment = rightContent.contents[0];
            rightContent.contents.shift();
            break;
        }
      }
      right = [line, comment, operator, " ", rightContent, rightSuffix];
    } else {
      right = [lineBeforeOperator ? line : "", operator, lineBeforeOperator ? " " : line, rightContent, rightSuffix];
    }
  }
  const {
    parent
  } = path;
  const shouldBreak = hasComment(node.left, CommentCheckFlags.Trailing | CommentCheckFlags.Line);
  const shouldGroup = shouldBreak || !(isInsideParenthesis && node.type === "LogicalExpression") && parent.type !== node.type && node.left.type !== node.type && node.right.type !== node.type;
  if (shouldGroup) {
    right = group(right, {
      shouldBreak
    });
  }
  if (options2.experimentalOperatorPosition === "start") {
    parts.push(shouldInline || commentBeforeOperator ? " " : "", right);
  } else {
    parts.push(lineBeforeOperator ? "" : " ", right);
  }
  if (isNested && hasComment(node)) {
    const printed = cleanDoc(printComments(path, parts, options2));
    if (printed.type === DOC_TYPE_FILL) {
      return printed.parts;
    }
    return Array.isArray(printed) ? printed : [printed];
  }
  return parts;
}
function shouldInlineLogicalExpression(node) {
  if (node.type !== "LogicalExpression") {
    return false;
  }
  if (isObjectExpression(node.right) && node.right.properties.length > 0) {
    return true;
  }
  if (isArrayExpression(node.right) && node.right.elements.length > 0) {
    return true;
  }
  if (isJsxElement(node.right)) {
    return true;
  }
  return false;
}
var isBitwiseOrExpression = (node) => node.type === "BinaryExpression" && node.operator === "|";
function isVueFilterSequenceExpression(path, options2) {
  return (options2.parser === "__vue_expression" || options2.parser === "__vue_ts_expression") && isBitwiseOrExpression(path.node) && !path.hasAncestor((node) => !isBitwiseOrExpression(node) && node.type !== "JsExpressionRoot");
}

// src/language-js/print/angular.js
function printAngular(path, options2, print3) {
  const { node } = path;
  if (!node.type.startsWith("NG")) {
    return;
  }
  switch (node.type) {
    case "NGRoot":
      return print3("node");
    case "NGPipeExpression":
      return printBinaryishExpression(path, options2, print3);
    case "NGChainedExpression":
      return group(
        join(
          [";", line],
          path.map(
            () => hasNgSideEffect(path) ? print3() : ["(", print3(), ")"],
            "expressions"
          )
        )
      );
    case "NGEmptyExpression":
      return "";
    case "NGMicrosyntax":
      return path.map(
        () => [
          path.isFirst ? "" : isNgForOf(path) ? " " : [";", line],
          print3()
        ],
        "body"
      );
    case "NGMicrosyntaxKey":
      return /^[$_a-z][\w$]*(?:-[$_a-z][\w$])*$/i.test(node.name) ? node.name : JSON.stringify(node.name);
    case "NGMicrosyntaxExpression":
      return [
        print3("expression"),
        node.alias === null ? "" : [" as ", print3("alias")]
      ];
    case "NGMicrosyntaxKeyedExpression": {
      const { index, parent } = path;
      const shouldNotPrintColon = isNgForOf(path) || isNgForOfTrack(path) || (index === 1 && (node.key.name === "then" || node.key.name === "else" || node.key.name === "as") || index === 2 && (node.key.name === "else" && parent.body[index - 1].type === "NGMicrosyntaxKeyedExpression" && parent.body[index - 1].key.name === "then" || node.key.name === "track")) && parent.body[0].type === "NGMicrosyntaxExpression";
      return [
        print3("key"),
        shouldNotPrintColon ? " " : ": ",
        print3("expression")
      ];
    }
    case "NGMicrosyntaxLet":
      return [
        "let ",
        print3("key"),
        node.value === null ? "" : [" = ", print3("value")]
      ];
    case "NGMicrosyntaxAs":
      return [print3("key"), " as ", print3("alias")];
    default:
      throw new unexpected_node_error_default(node, "Angular");
  }
}
function isNgForOf({ node, index }) {
  return node.type === "NGMicrosyntaxKeyedExpression" && node.key.name === "of" && index === 1;
}
function isNgForOfTrack(path) {
  const { node } = path;
  return path.parent.body[1].key.name === "of" && node.type === "NGMicrosyntaxKeyedExpression" && node.key.name === "track" && node.key.type === "NGMicrosyntaxKey";
}
var hasSideEffect = createTypeCheckFunction([
  "CallExpression",
  "OptionalCallExpression",
  "AssignmentExpression"
]);
function hasNgSideEffect({ node }) {
  return hasNode(node, hasSideEffect);
}

// src/language-js/print/decorators.js
function printClassMemberDecorators(path, options2, print3) {
  const { node } = path;
  return group([
    join(line, path.map(print3, "decorators")),
    hasNewlineBetweenOrAfterDecorators(node, options2) ? hardline : line
  ]);
}
function printDecoratorsBeforeExport(path, options2, print3) {
  if (!hasDecoratorsBeforeExport(path.node)) {
    return "";
  }
  return [
    join(hardline, path.map(print3, "declaration", "decorators")),
    hardline
  ];
}
function printDecorators(path, options2, print3) {
  const { node, parent } = path;
  const { decorators } = node;
  if (!is_non_empty_array_default(decorators) || // If the parent node is an export declaration and the decorator
  // was written before the export, the export will be responsible
  // for printing the decorators.
  hasDecoratorsBeforeExport(parent) || // Decorators already printed in ignored node
  is_ignored_default(path)) {
    return "";
  }
  const shouldBreak = node.type === "ClassExpression" || node.type === "ClassDeclaration" || hasNewlineBetweenOrAfterDecorators(node, options2);
  return [
    path.key === "declaration" && isExportDeclaration(parent) ? hardline : shouldBreak ? breakParent : "",
    join(line, path.map(print3, "decorators")),
    line
  ];
}
function hasNewlineBetweenOrAfterDecorators(node, options2) {
  return node.decorators.some(
    (decorator) => has_newline_default(options2.originalText, locEnd(decorator))
  );
}
function hasDecoratorsBeforeExport(node) {
  if (node.type !== "ExportDefaultDeclaration" && node.type !== "ExportNamedDeclaration" && node.type !== "DeclareExportDeclaration") {
    return false;
  }
  const decorators = node.declaration?.decorators;
  return is_non_empty_array_default(decorators) && hasSameLocStart(node, decorators[0]);
}

// src/language-js/utilities/is-signed-numeric-literal.js
function isSignedNumericLiteral(node) {
  return node.type === "UnaryExpression" && (node.operator === "+" || node.operator === "-") && isNumericLiteral(node.argument);
}

// src/language-js/print/array.js
function printArray(path, options2, print3) {
  const {
    node
  } = path;
  const parts = [];
  const elementsProperty = isTupleType(node) ? "elementTypes" : "elements";
  const elements = node[elementsProperty];
  if (elements.length === 0 && !node.inexact) {
    parts.push(group(["[", printDanglingCommentsInList(path, options2), "]"]));
  } else {
    const lastElem = method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      elements,
      -1
    );
    const canHaveTrailingComma = lastElem?.type !== "RestElement" && !node.inexact;
    const needsForcedTrailingComma = lastElem === null;
    const groupId = /* @__PURE__ */ Symbol("array");
    const shouldBreak = !options2.__inJestEach && elements.length > 1 && elements.every((element, i, elements2) => {
      if (!isArrayExpression(element) && !isObjectExpression(element)) {
        return false;
      }
      const elementType = element?.type;
      const nextElement = elements2[i + 1];
      if (nextElement && elementType !== nextElement.type) {
        return false;
      }
      const itemsKey = isArrayExpression(element) ? "elements" : "properties";
      return element[itemsKey] && element[itemsKey].length > 1;
    }) || hasComment(node, CommentCheckFlags.Dangling | CommentCheckFlags.Line);
    const shouldUseConciseFormatting = isConciselyPrintedArray(node, options2);
    const trailingComma = !canHaveTrailingComma ? "" : needsForcedTrailingComma ? "," : !shouldPrintTrailingComma(options2) ? "" : shouldUseConciseFormatting ? ifBreak(",", "", {
      groupId
    }) : ifBreak(",");
    parts.push(group(["[", indent([softline, shouldUseConciseFormatting ? printArrayElementsConcisely(path, options2, print3, trailingComma) : [printArrayElements(path, options2, print3, elementsProperty, node.inexact), trailingComma], printDanglingComments(path, options2)]), softline, "]"], {
      shouldBreak,
      id: groupId
    }));
  }
  parts.push(printOptionalToken(path), printTypeAnnotationProperty(path, print3));
  return parts;
}
function isConciselyPrintedArray(node, options2) {
  return isArrayExpression(node) && node.elements.length > 0 && node.elements.every((element) => element && (isNumericLiteral(element) || isSignedNumericLiteral(element) && !hasComment(element.argument)) && !hasComment(element, CommentCheckFlags.Trailing | CommentCheckFlags.Line, (comment) => !has_newline_default(options2.originalText, locStart(comment), {
    backwards: true
  })));
}
function isLineAfterElementEmpty({
  node
}, {
  originalText: text
}) {
  let currentIdx = locEnd(node);
  if (currentIdx === locStart(node)) {
    return false;
  }
  const {
    length
  } = text;
  while (currentIdx < length) {
    if (text[currentIdx] === ",") {
      break;
    }
    currentIdx = /** @type {number} */
    skip_inline_comment_default(text, skip_trailing_comment_default(text, currentIdx + 1));
  }
  return is_next_line_empty_default(text, currentIdx);
}
function printArrayElements(path, options2, print3, elementsProperty, inexact) {
  const parts = [];
  path.each(({
    node,
    isLast
  }) => {
    parts.push(node ? group(print3()) : "");
    if (!isLast || inexact) {
      parts.push([",", line, node && isLineAfterElementEmpty(path, options2) ? softline : ""]);
    }
  }, elementsProperty);
  if (inexact) {
    parts.push("...");
  }
  return parts;
}
function printArrayElementsConcisely(path, options2, print3, trailingComma) {
  const parts = [];
  path.each(({
    isLast,
    next
  }) => {
    parts.push([print3(), isLast ? trailingComma : ","]);
    if (!isLast) {
      parts.push(isLineAfterElementEmpty(path, options2) ? [hardline, hardline] : hasComment(next, CommentCheckFlags.Leading | CommentCheckFlags.Line) ? hardline : line);
    }
  }, "elements");
  return fill(parts);
}

// src/language-js/utilities/template-literal-has-new-lines.js
function templateLiteralHasNewLines(template) {
  return template.quasis.some((quasi) => quasi.value.raw.includes("\n"));
}

// src/language-js/utilities/is-template-on-its-own-line.js
function isTemplateOnItsOwnLine(node, text) {
  return (node.type === "TemplateLiteral" && templateLiteralHasNewLines(node) || node.type === "TaggedTemplateExpression" && templateLiteralHasNewLines(node.quasi)) && !has_newline_default(text, locStart(node), { backwards: true });
}

// src/language-js/print/arrow-function.js
var shouldAddParensIfNotBreakCache = /* @__PURE__ */ new WeakMap();
function shouldAddParensIfNotBreak(node) {
  return getOrInsertComputed(
    shouldAddParensIfNotBreakCache,
    node,
    (node2) => node2.type === "ConditionalExpression" && !startsWithNoLookaheadToken(
      node2,
      (node3) => node3.type === "ObjectExpression"
    )
  );
}
var shouldAlwaysAddParens = (node) => node.type === "SequenceExpression";
function printArrowFunction(path, options2, print3, args = {}) {
  const signatureDocs = [];
  let bodyDoc;
  const bodyComments = [];
  let shouldBreakChain = false;
  const shouldPrintAsChain = !args.expandLastArg && path.node.body.type === "ArrowFunctionExpression";
  let functionBody;
  (function rec() {
    const { node } = path;
    const signatureDoc = printArrowFunctionSignature(
      path,
      options2,
      print3,
      args
    );
    if (signatureDocs.length === 0) {
      signatureDocs.push(signatureDoc);
    } else {
      const { leading, trailing } = printCommentsSeparately(path, options2);
      signatureDocs.push([leading, signatureDoc]);
      bodyComments.unshift(trailing);
    }
    if (shouldPrintAsChain) {
      shouldBreakChain || (shouldBreakChain = // Always break the chain if:
      node.returnType && getFunctionParameters(node).length > 0 || node.typeParameters || getFunctionParameters(node).some(
        (param) => param.type !== "Identifier"
      ));
    }
    if (!shouldPrintAsChain || node.body.type !== "ArrowFunctionExpression") {
      bodyDoc = print3("body", args);
      functionBody = node.body;
    } else {
      path.call(rec, "body");
    }
  })();
  const shouldPutBodyOnSameLine = !hasLeadingOwnLineComment(options2.originalText, functionBody) && (shouldAlwaysAddParens(functionBody) || mayBreakAfterShortPrefix(functionBody, bodyDoc, options2) || !shouldBreakChain && shouldAddParensIfNotBreak(functionBody));
  const isCallee = path.key === "callee" && isCallLikeExpression(path.parent);
  const chainGroupId = /* @__PURE__ */ Symbol("arrow-chain");
  const signaturesDoc = printArrowFunctionSignatures(path, args, {
    signatureDocs,
    shouldBreak: shouldBreakChain
  });
  let shouldBreakSignatures = false;
  let shouldIndentSignatures = false;
  let shouldPrintSoftlineInIndent = false;
  if (shouldPrintAsChain && (isCallee || // isAssignmentRhs
  args.assignmentLayout)) {
    shouldIndentSignatures = true;
    shouldPrintSoftlineInIndent = !hasComment(
      path.node,
      CommentCheckFlags.Leading & CommentCheckFlags.Line
    );
    shouldBreakSignatures = args.assignmentLayout === "chain-tail-arrow-chain" || isCallee && !shouldPutBodyOnSameLine;
  }
  bodyDoc = printArrowFunctionBody(path, options2, args, {
    bodyDoc,
    bodyComments,
    functionBody,
    shouldPutBodyOnSameLine
  });
  return group([
    group(
      shouldIndentSignatures ? indent([shouldPrintSoftlineInIndent ? softline : "", signaturesDoc]) : signaturesDoc,
      { shouldBreak: shouldBreakSignatures, id: chainGroupId }
    ),
    " =>",
    shouldPrintAsChain ? indentIfBreak(bodyDoc, { groupId: chainGroupId }) : group(bodyDoc),
    shouldPrintAsChain && isCallee ? ifBreak(softline, "", { groupId: chainGroupId }) : ""
  ]);
}
function printArrowFunctionSignature(path, options2, print3, args) {
  const { node } = path;
  const parts = [];
  if (node.async) {
    parts.push("async ");
  }
  if (shouldPrintParamsWithoutParens(path, options2)) {
    parts.push(print3(["params", 0]));
  } else {
    const shouldExpandParameters = args.expandLastArg || args.expandFirstArg;
    let returnTypeDoc = printReturnType(path, print3);
    if (shouldExpandParameters) {
      if (willBreak(returnTypeDoc)) {
        throw new ArgExpansionBailout();
      }
      returnTypeDoc = group(removeLines(returnTypeDoc));
    }
    parts.push(
      group([
        printFunctionParameters(
          path,
          options2,
          print3,
          shouldExpandParameters,
          /* shouldPrintTypeParameters */
          true
        ),
        returnTypeDoc
      ])
    );
  }
  const dangling = printDanglingComments(path, options2, {
    marker: "commentBeforeArrow"
  });
  if (dangling) {
    parts.push(" ", dangling);
  }
  return parts;
}
function mayBreakAfterShortPrefix(functionBody, bodyDoc, options2) {
  return isArrayExpression(functionBody) || isObjectExpression(functionBody) || functionBody.type === "ArrowFunctionExpression" || functionBody.type === "DoExpression" || functionBody.type === "BlockStatement" || isJsxElement(functionBody) || bodyDoc.label?.hug !== false && (bodyDoc.label?.embed || isTemplateOnItsOwnLine(functionBody, options2.originalText));
}
function printArrowFunctionSignatures(path, args, { signatureDocs, shouldBreak }) {
  if (signatureDocs.length === 1) {
    return signatureDocs[0];
  }
  const { parent, key } = path;
  if (key !== "callee" && isCallLikeExpression(parent) || isBinaryish(parent)) {
    return group(
      [
        signatureDocs[0],
        " =>",
        indent([line, join([" =>", line], signatureDocs.slice(1))])
      ],
      { shouldBreak }
    );
  }
  if (key === "callee" && isCallLikeExpression(parent) || // isAssignmentRhs
  args.assignmentLayout) {
    return group(join([" =>", line], signatureDocs), { shouldBreak });
  }
  return group(indent(join([" =>", line], signatureDocs)), { shouldBreak });
}
function printArrowFunctionBody(path, options2, args, { bodyDoc, bodyComments, functionBody, shouldPutBodyOnSameLine }) {
  const { node, parent } = path;
  const trailingComma = args.expandLastArg ? printTrailingComma(options2, "all") : "";
  const trailingSpace = (args.expandLastArg || parent.type === "JSXExpressionContainer") && !hasComment(node) ? softline : "";
  if (shouldPutBodyOnSameLine && shouldAddParensIfNotBreak(functionBody)) {
    return [
      " ",
      group([
        ifBreak("", "("),
        indent([softline, bodyDoc]),
        ifBreak("", ")"),
        trailingComma,
        trailingSpace
      ]),
      bodyComments
    ];
  }
  return shouldPutBodyOnSameLine ? [" ", bodyDoc, bodyComments] : [indent([line, bodyDoc, bodyComments]), trailingComma, trailingSpace];
}

// src/language-js/utilities/is-lone-short-argument.js
var LONE_SHORT_ARGUMENT_THRESHOLD_RATE = 0.25;
function isLoneShortArgument(node, options2) {
  const { printWidth } = options2;
  if (hasComment(node)) {
    return false;
  }
  const threshold = printWidth * LONE_SHORT_ARGUMENT_THRESHOLD_RATE;
  if (node.type === "ThisExpression" || node.type === "Identifier" && node.name.length <= threshold || isSignedNumericLiteral(node) && !hasComment(node.argument)) {
    return true;
  }
  const regexpPattern = node.type === "Literal" && "regex" in node && node.regex.pattern || node.type === "RegExpLiteral" && node.pattern;
  if (regexpPattern) {
    return regexpPattern.length <= threshold;
  }
  if (isStringLiteral(node)) {
    return print_string_default(getRaw(node), options2).length <= threshold;
  }
  if (node.type === "TemplateLiteral") {
    return node.expressions.length === 0 && node.quasis[0].value.raw.length <= threshold && !node.quasis[0].value.raw.includes("\n");
  }
  if (node.type === "UnaryExpression") {
    return isLoneShortArgument(node.argument, { printWidth });
  }
  if (node.type === "CallExpression" && node.arguments.length === 0 && node.callee.type === "Identifier") {
    return node.callee.name.length <= threshold - 2;
  }
  return isLiteral(node);
}

// src/language-js/utilities/is-memberish.js
function isMemberish(node) {
  return isMemberExpression(node) || node.type === "BindExpression" && Boolean(node.object);
}

// src/language-js/utilities/is-function-composition-arguments.js
function isFunctionCompositionArguments(args) {
  if (args.length <= 1) {
    return false;
  }
  let count = 0;
  for (let arg of args) {
    if (isFunctionOrArrowExpression(arg)) {
      count += 1;
      if (count > 1) {
        return true;
      }
    } else {
      arg = stripChainElementWrappers(arg);
      if (isCallExpression(arg)) {
        for (const childArg of getCallArguments(arg)) {
          if (isFunctionOrArrowExpression(childArg)) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

// src/language-js/utilities/is-long-curried-call-expression.js
function isLongCurriedCallExpression(path) {
  const { node, parent, key } = path;
  return key === "callee" && isCallExpression(node) && isCallExpression(parent) && parent.arguments.length > 0 && node.arguments.length > parent.arguments.length;
}

// src/language-js/utilities/is-simple-call-argument.js
var simpleCallArgumentUnaryOperators = /* @__PURE__ */ new Set(["!", "-", "+", "~"]);
var isSingleWordType = createTypeCheckFunction([
  "Identifier",
  "ThisExpression",
  "Super",
  "PrivateName",
  "PrivateIdentifier"
]);
function isSimpleCallArgument(node, depth = 2) {
  if (depth <= 0) {
    return false;
  }
  const isChildSimple = (child) => isSimpleCallArgument(child, depth - 1);
  node = stripChainElementWrappers(node);
  if (isRegExpLiteral(node)) {
    return (
      // @ts-expect-error -- safe
      get_string_width_default(node.pattern ?? node.regex.pattern) <= 5
    );
  }
  if (isLiteral(node) || isSingleWordType(node) || node.type === "ArgumentPlaceholder") {
    return true;
  }
  if (node.type === "TemplateLiteral") {
    return node.quasis.every((element) => !element.value.raw.includes("\n")) && node.expressions.every(isChildSimple);
  }
  if (isObjectExpression(node)) {
    return node.properties.every(
      (property) => (
        // @ts-expect-error -- FIXME
        !property.computed && // @ts-expect-error -- FIXME
        (property.shorthand || // @ts-expect-error -- FIXME
        property.value && isChildSimple(property.value))
      )
    );
  }
  if (isArrayExpression(node)) {
    return node.elements.every((x) => x === null || isChildSimple(x));
  }
  if (isCallLikeExpression(node)) {
    if (node.type === "ImportExpression" || isSimpleCallArgument(node.callee, depth)) {
      const args = getCallArguments(node);
      return args.length <= depth && args.every(isChildSimple);
    }
    return false;
  }
  if (isMemberExpression(node)) {
    return isSimpleCallArgument(node.object, depth) && isSimpleCallArgument(node.property, depth);
  }
  if (node.type === "UnaryExpression" && simpleCallArgumentUnaryOperators.has(node.operator) || node.type === "UpdateExpression") {
    return isSimpleCallArgument(node.argument, depth);
  }
  return false;
}

// src/language-js/print/call-arguments.js
function printCallArguments(path, options2, print3) {
  const {
    node
  } = path;
  const args = getCallArguments(node);
  if (args.length === 0) {
    return group(["(", printDanglingCommentsInList(path, options2), ")"]);
  }
  const lastArgIndex = args.length - 1;
  if (isReactHookCallWithDepsArray(args)) {
    const parts = ["("];
    iterateCallArgumentsPath(path, (path2, index) => {
      parts.push(print3());
      if (index !== lastArgIndex) {
        parts.push(", ");
      }
    });
    parts.push(")");
    return parts;
  }
  let anyArgEmptyLine = false;
  const printedArguments = [];
  iterateCallArgumentsPath(path, ({
    node: arg
  }, index) => {
    let argDoc = print3();
    if (index === lastArgIndex) {
    } else if (isNextLineEmpty2(arg, options2)) {
      anyArgEmptyLine = true;
      argDoc = [argDoc, ",", hardline, hardline];
    } else {
      argDoc = [argDoc, ",", line];
    }
    printedArguments.push(argDoc);
  });
  const trailingComma = (
    // Angular does not allow trailing comma
    path.root.type !== "NGRoot" && // Dynamic imports cannot have trailing commas
    node.type !== "ImportExpression" && node.type !== "TSImportType" && node.type !== "TSExternalModuleReference" ? printTrailingComma(options2, "all") : ""
  );
  function allArgsBrokenOut() {
    return group(["(", indent([line, ...printedArguments]), trailingComma, line, ")"], {
      shouldBreak: true
    });
  }
  if (anyArgEmptyLine || path.parent.type !== "Decorator" && isFunctionCompositionArguments(args)) {
    return allArgsBrokenOut();
  }
  if (shouldExpandFirstArg(args)) {
    const tailArgs = printedArguments.slice(1);
    if (tailArgs.some(willBreak)) {
      return allArgsBrokenOut();
    }
    let firstArg;
    try {
      firstArg = print3(getCallArgumentSelector(node, 0), {
        expandFirstArg: true
      });
    } catch (caught) {
      if (caught instanceof ArgExpansionBailout) {
        return allArgsBrokenOut();
      }
      throw caught;
    }
    if (willBreak(firstArg)) {
      return [breakParent, conditionalGroup([["(", group(firstArg, {
        shouldBreak: true
      }), ", ", ...tailArgs, ")"], allArgsBrokenOut()])];
    }
    return conditionalGroup([["(", firstArg, ", ", ...tailArgs, ")"], ["(", group(firstArg, {
      shouldBreak: true
    }), ", ", ...tailArgs, ")"], allArgsBrokenOut()]);
  }
  if (shouldExpandLastArg(args, printedArguments, options2)) {
    const headArgs = printedArguments.slice(0, -1);
    if (headArgs.some(willBreak)) {
      return allArgsBrokenOut();
    }
    let lastArg;
    try {
      lastArg = print3(getCallArgumentSelector(node, -1), {
        expandLastArg: true
      });
    } catch (caught) {
      if (caught instanceof ArgExpansionBailout) {
        return allArgsBrokenOut();
      }
      throw caught;
    }
    if (willBreak(lastArg)) {
      return [breakParent, conditionalGroup([["(", ...headArgs, group(lastArg, {
        shouldBreak: true
      }), ")"], allArgsBrokenOut()])];
    }
    return conditionalGroup([["(", ...headArgs, lastArg, ")"], ["(", ...headArgs, group(lastArg, {
      shouldBreak: true
    }), ")"], allArgsBrokenOut()]);
  }
  const contents = ["(", indent([softline, ...printedArguments]), trailingComma, softline, ")"];
  if (isLongCurriedCallExpression(path)) {
    return contents;
  }
  return group(contents, {
    shouldBreak: printedArguments.some(willBreak) || anyArgEmptyLine
  });
}
function couldExpandArg(arg, arrowChainRecursion = false) {
  if (isObjectExpression(arg) && (arg.properties.length > 0 || hasComment(arg))) {
    return true;
  }
  if (isArrayExpression(arg) && (arg.elements.length > 0 || hasComment(arg))) {
    return true;
  }
  if ((isBinaryCastExpression(arg) || arg.type === "TSTypeAssertion") && couldExpandArg(arg.expression)) {
    return true;
  }
  if (arg.type === "FunctionExpression" || arg.type === "DoExpression" || arg.type === "ModuleExpression") {
    return true;
  }
  if (arg.type === "ArrowFunctionExpression") {
    const {
      body
    } = arg;
    if (body.type === "BlockStatement" || isJsxElement(body) || isObjectExpression(body) || isArrayExpression(body)) {
      return true;
    }
    if (body.type === "ArrowFunctionExpression" && couldExpandArg(body, true)) {
      return true;
    }
    if (!arrowChainRecursion) {
      if (body.type === "ConditionalExpression") {
        return true;
      }
      if (isCallExpression(stripChainElementWrappers(body))) {
        return true;
      }
    }
  }
  return false;
}
function shouldExpandLastArg(args, argDocs, options2) {
  if (args.length === 1) {
    const lastArgDoc = method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      argDocs,
      -1
    );
    if (lastArgDoc.label?.embed && lastArgDoc.label?.hug !== false) {
      return true;
    }
  }
  const lastArg = method_at_default(
    /* OPTIONAL_OBJECT: false */
    0,
    args,
    -1
  );
  const penultimateArg = method_at_default(
    /* OPTIONAL_OBJECT: false */
    0,
    args,
    -2
  );
  return !hasComment(lastArg, CommentCheckFlags.Leading) && !hasComment(lastArg, CommentCheckFlags.Trailing) && couldExpandArg(lastArg) && // If the last two arguments are of the same type,
  // disable last element expansion.
  (!penultimateArg || penultimateArg.type !== lastArg.type) && // useMemo(() => func(), [foo, bar, baz])
  (args.length !== 2 || penultimateArg.type !== "ArrowFunctionExpression" || !isArrayExpression(lastArg)) && !(args.length > 1 && isConciselyPrintedArray(lastArg, options2));
}
function shouldExpandFirstArg(args) {
  if (args.length !== 2) {
    return false;
  }
  const [firstArg, secondArg] = args;
  if (firstArg.type === "ModuleExpression" && isTypeModuleObjectExpression(secondArg)) {
    return true;
  }
  return !hasComment(firstArg) && (firstArg.type === "FunctionExpression" || firstArg.type === "ArrowFunctionExpression" && firstArg.body.type === "BlockStatement") && secondArg.type !== "FunctionExpression" && secondArg.type !== "ArrowFunctionExpression" && secondArg.type !== "ConditionalExpression" && isHopefullyShortCallArgument(secondArg) && !couldExpandArg(secondArg);
}
function isHopefullyShortCallArgument(node) {
  if (node.type === "ParenthesizedExpression") {
    return isHopefullyShortCallArgument(node.expression);
  }
  if (isBinaryCastExpression(node) || node.type === "TypeCastExpression") {
    let {
      typeAnnotation
    } = node;
    if (typeAnnotation.type === "TypeAnnotation") {
      typeAnnotation = typeAnnotation.typeAnnotation;
    }
    if (typeAnnotation.type === "TSArrayType") {
      typeAnnotation = typeAnnotation.elementType;
      if (typeAnnotation.type === "TSArrayType") {
        typeAnnotation = typeAnnotation.elementType;
      }
    }
    if (typeAnnotation.type === "GenericTypeAnnotation" || typeAnnotation.type === "TSTypeReference") {
      const typeArguments = typeAnnotation.type === "GenericTypeAnnotation" ? typeAnnotation.typeParameters : typeAnnotation.typeArguments;
      if (typeArguments?.params.length === 1) {
        typeAnnotation = typeArguments.params[0];
      }
    }
    return isSimpleType(typeAnnotation) && isSimpleCallArgument(node.expression, 1);
  }
  if (isCallLikeExpression(node) && getCallArguments(node).length > 1) {
    return false;
  }
  if (isBinaryish(node)) {
    return isSimpleCallArgument(node.left, 1) && isSimpleCallArgument(node.right, 1);
  }
  return isRegExpLiteral(node) || isSimpleCallArgument(node);
}
function isReactHookCallWithDepsArray(args) {
  if (args.length === 2) {
    return isValidHookCallbackAndDepsFormat(
      args,
      /* baseIndex */
      0
    );
  }
  if (args.length === 3) {
    return args[0].type === "Identifier" && isValidHookCallbackAndDepsFormat(
      args,
      /* baseIndex */
      1
    );
  }
  return false;
}
function isValidHookCallbackAndDepsFormat(args, baseIndex) {
  const maybeArrowFunction = args[baseIndex];
  const maybeDepsArray = args[baseIndex + 1];
  return maybeArrowFunction.type === "ArrowFunctionExpression" && getFunctionParameters(maybeArrowFunction).length === 0 && maybeArrowFunction.body.type === "BlockStatement" && maybeDepsArray.type === "ArrayExpression" && args.every((arg) => !hasComment(arg));
}
function isTypeModuleObjectExpression(node) {
  if (!(node.type === "ObjectExpression" && node.properties.length === 1)) {
    return false;
  }
  const [property] = node.properties;
  if (!isObjectProperty(property)) {
    return false;
  }
  return !property.computed && (property.key.type === "Identifier" && property.key.name === "type" || isStringLiteral(property.key) && property.key.value === "type") && isStringLiteral(property.value) && property.value.value === "module";
}
var call_arguments_default = printCallArguments;

// src/language-js/print/bind-expression.js
function printBindExpression(path, options2, print3) {
  return [
    print3("object"),
    group(indent([softline, printBindExpressionCallee(path, options2, print3)]))
  ];
}
function printBindExpressionCallee(path, options2, print3) {
  return ["::", print3("callee")];
}

// src/language-js/print/member.js
var isCallExpressionWithArguments = (node) => isCallExpression(node) && getCallArguments(node).length > 0;
function shouldInlineNewExpressionCallee(path) {
  let { node: child, ancestors } = path;
  for (const ancestor of ancestors) {
    if (!(isMemberExpression(ancestor) && ancestor.object === child || ancestor.type === "TSNonNullExpression" && ancestor.expression === child)) {
      return ancestor.type === "NewExpression" && ancestor.callee === child;
    }
    child = ancestor;
  }
  return false;
}
function printMemberExpression(path, options2, print3) {
  const objectDoc = print3("object");
  const lookupDoc = printMemberLookup(path, options2, print3);
  const { node } = path;
  const firstNonMemberParent = path.findAncestor(
    (node2) => !(isMemberExpression(node2) || node2.type === "TSNonNullExpression")
  );
  const firstNonChainElementWrapperParent = path.findAncestor(
    (node2) => !isChainElementWrapper(node2)
  );
  const shouldInline = firstNonMemberParent.type === "BindExpression" || firstNonMemberParent.type === "AssignmentExpression" && firstNonMemberParent.left.type !== "Identifier" || shouldInlineNewExpressionCallee(path) || node.computed || node.object.type === "Identifier" && node.property.type === "Identifier" && !isMemberExpression(firstNonChainElementWrapperParent) || (firstNonChainElementWrapperParent.type === "AssignmentExpression" || firstNonChainElementWrapperParent.type === "VariableDeclarator") && (isCallExpressionWithArguments(stripChainElementWrappers(node.object)) || objectDoc.label?.memberChain);
  return label(objectDoc.label, [
    objectDoc,
    lineSuffixBoundary,
    shouldInline ? lookupDoc : group(indent([softline, lookupDoc]))
  ]);
}
function printMemberLookup(path, options2, print3) {
  const property = print3("property");
  const { node } = path;
  const optional = printOptionalToken(path);
  if (!node.computed) {
    return [optional, ".", property];
  }
  if (!node.property || isNumericLiteral(node.property)) {
    return [optional, "[", property, "]"];
  }
  return group([optional, "[", indent([softline, property]), softline, "]"]);
}

// src/language-js/print/member-chain.js
function printMemberChain(path, options2, print3) {
  const isExpressionStatement = (path.parent.type === "ChainExpression" ? path.grandparent : path.parent).type === "ExpressionStatement";
  const printedNodes = [];
  function shouldInsertEmptyLineAfter(node2) {
    const {
      originalText
    } = options2;
    const nextCharIndex = get_next_non_space_non_comment_character_index_default(originalText, locEnd(node2));
    const nextChar = originalText.charAt(nextCharIndex);
    if (nextChar === ")") {
      return nextCharIndex !== false && is_next_line_empty_default(originalText, nextCharIndex + 1);
    }
    return isNextLineEmpty2(node2, options2);
  }
  function rec() {
    const {
      node: node2
    } = path;
    if (isCallExpression(node2) && (isMemberish(node2.callee) || isCallExpression(node2.callee)) && !needs_parentheses_default(path, options2)) {
      const hasTrailingEmptyLine = shouldInsertEmptyLineAfter(node2);
      printedNodes.unshift({
        node: node2,
        hasTrailingEmptyLine,
        printed: [printComments(path, [printOptionalToken(path), print3("typeArguments"), call_arguments_default(path, options2, print3)], options2), hasTrailingEmptyLine ? hardline : ""]
      });
      path.call(rec, "callee");
    } else if (isMemberish(node2) && !needs_parentheses_default(path, options2)) {
      printedNodes.unshift({
        node: node2,
        printed: printComments(path, isMemberExpression(node2) ? printMemberLookup(path, options2, print3) : printBindExpressionCallee(path, options2, print3), options2)
      });
      path.call(rec, "object");
    } else if (node2.type === "ChainExpression" && !needs_parentheses_default(path, options2)) {
      path.call(rec, "expression");
    } else if (node2.type === "TSNonNullExpression" && !needs_parentheses_default(path, options2)) {
      printedNodes.unshift({
        node: node2,
        printed: printComments(path, "!", options2)
      });
      path.call(rec, "expression");
    } else {
      printedNodes.unshift({
        node: node2,
        printed: print3()
      });
    }
  }
  const {
    node
  } = path;
  printedNodes.unshift({
    node,
    printed: [printOptionalToken(path), print3("typeArguments"), call_arguments_default(path, options2, print3)]
  });
  if (node.callee) {
    path.call(rec, "callee");
  }
  const groups = [];
  let currentGroup = [printedNodes[0]];
  let i = 1;
  for (; i < printedNodes.length; ++i) {
    if (printedNodes[i].node.type === "TSNonNullExpression" || printedNodes[i].node.type === "ChainExpression" || isCallExpression(printedNodes[i].node) || isMemberExpression(printedNodes[i].node) && printedNodes[i].node.computed && isNumericLiteral(printedNodes[i].node.property)) {
      currentGroup.push(printedNodes[i]);
    } else {
      break;
    }
  }
  if (!isCallExpression(printedNodes[0].node)) {
    for (; i + 1 < printedNodes.length; ++i) {
      if (isMemberish(printedNodes[i].node) && isMemberish(printedNodes[i + 1].node)) {
        currentGroup.push(printedNodes[i]);
      } else {
        break;
      }
    }
  }
  groups.push(currentGroup);
  currentGroup = [];
  let hasSeenCallExpression = false;
  for (; i < printedNodes.length; ++i) {
    if (hasSeenCallExpression && isMemberish(printedNodes[i].node)) {
      if (printedNodes[i].node.computed && isNumericLiteral(printedNodes[i].node.property)) {
        currentGroup.push(printedNodes[i]);
        continue;
      }
      groups.push(currentGroup);
      currentGroup = [];
      hasSeenCallExpression = false;
    }
    if (isCallExpression(printedNodes[i].node) || printedNodes[i].node.type === "ImportExpression") {
      hasSeenCallExpression = true;
    }
    currentGroup.push(printedNodes[i]);
    if (hasComment(printedNodes[i].node, CommentCheckFlags.Trailing)) {
      groups.push(currentGroup);
      currentGroup = [];
      hasSeenCallExpression = false;
    }
  }
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }
  function isFactory(name) {
    return /^[A-Z]|^[$_]+$/.test(name);
  }
  function isShort(name) {
    return name.length <= options2.tabWidth;
  }
  function shouldNotWrap(groups2) {
    const hasComputed = groups2[1][0]?.node.computed;
    if (groups2[0].length === 1) {
      const firstNode = groups2[0][0].node;
      return firstNode.type === "ThisExpression" || firstNode.type === "Identifier" && (isFactory(firstNode.name) || isExpressionStatement && isShort(firstNode.name) || hasComputed);
    }
    const lastNode = method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      groups2[0],
      -1
    ).node;
    return isMemberExpression(lastNode) && lastNode.property.type === "Identifier" && (isFactory(lastNode.property.name) || hasComputed);
  }
  const shouldMerge = groups.length >= 2 && !hasComment(groups[1][0].node) && shouldNotWrap(groups);
  function printGroup(printedGroup) {
    return printedGroup.map((tuple) => tuple.printed);
  }
  function printIndentedGroup(groups2) {
    if (groups2.length === 0) {
      return "";
    }
    return indent([hardline, join(hardline, groups2.map(printGroup))]);
  }
  const printedGroups = groups.map(printGroup);
  const oneLine = printedGroups;
  const cutoff = shouldMerge ? 3 : 2;
  const flatGroups = groups.flat();
  const nodeHasComment = flatGroups.slice(1, -1).some((node2) => hasComment(node2.node, CommentCheckFlags.Leading)) || flatGroups.slice(0, -1).some((node2) => hasComment(node2.node, CommentCheckFlags.Trailing)) || groups[cutoff] && hasComment(groups[cutoff][0].node, CommentCheckFlags.Leading);
  if (groups.length <= cutoff && !nodeHasComment && groups.every((g) => !method_at_default(
    /* OPTIONAL_OBJECT: false */
    0,
    g,
    -1
  ).hasTrailingEmptyLine)) {
    if (isLongCurriedCallExpression(path)) {
      return oneLine;
    }
    return group(oneLine);
  }
  const lastNodeBeforeIndent = method_at_default(
    /* OPTIONAL_OBJECT: false */
    0,
    groups[shouldMerge ? 1 : 0],
    -1
  ).node;
  const shouldHaveEmptyLineBeforeIndent = !isCallExpression(lastNodeBeforeIndent) && shouldInsertEmptyLineAfter(lastNodeBeforeIndent);
  const expanded = [printGroup(groups[0]), shouldMerge ? groups.slice(1, 2).map(printGroup) : "", shouldHaveEmptyLineBeforeIndent ? hardline : "", printIndentedGroup(groups.slice(shouldMerge ? 2 : 1))];
  const callExpressions = printedNodes.map(({
    node: node2
  }) => node2).filter(isCallExpression);
  function lastGroupWillBreakAndOtherCallsHaveFunctionArguments() {
    const lastGroupNode = method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      method_at_default(
        /* OPTIONAL_OBJECT: false */
        0,
        groups,
        -1
      ),
      -1
    ).node;
    const lastGroupDoc = method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      printedGroups,
      -1
    );
    return isCallExpression(lastGroupNode) && willBreak(lastGroupDoc) && callExpressions.slice(0, -1).some((node2) => node2.arguments.some(isFunctionOrArrowExpression));
  }
  let result;
  if (nodeHasComment || callExpressions.length > 2 && callExpressions.some((expr) => expr.arguments.some((arg) => !isSimpleCallArgument(arg))) || printedGroups.slice(0, -1).some(willBreak) || lastGroupWillBreakAndOtherCallsHaveFunctionArguments()) {
    result = group(expanded);
  } else {
    result = [
      // We only need to check `oneLine` because if `expanded` is chosen
      // that means that the parent group has already been broken
      // naturally
      willBreak(oneLine) || shouldHaveEmptyLineBeforeIndent ? breakParent : "",
      conditionalGroup([oneLine, expanded])
    ];
  }
  return label({
    memberChain: true
  }, result);
}
var member_chain_default = printMemberChain;

// src/language-js/print/call-expression.js
function printCallExpression(path, options2, print3) {
  const { node } = path;
  const isNewExpression = node.type === "NewExpression";
  const optional = printOptionalToken(path);
  const args = getCallArguments(node);
  const typeArgumentsDoc = node.type !== "TSImportType" && node.typeArguments ? [print3("typeArguments"), lineSuffixBoundary] : "";
  const isTemplateLiteralSingleArg = args.length === 1 && isTemplateOnItsOwnLine(args[0], options2.originalText);
  if (isTemplateLiteralSingleArg || // Don't break simple `import()` with long module name
  isSimpleModuleImport(path) || // Dangling comments are not handled, all these special cases should have arguments #9668
  // We want to keep CommonJS- and AMD-style require calls, and AMD-style
  // define calls, as a unit.
  // e.g. `define(["some/lib"], (lib) => {`
  isCommonsJsOrAmdModuleDefinition(path) || // Keep test declarations on a single line
  // e.g. `it('long name', () => {`
  isTestCall(node, path.parent)) {
    const printed = [];
    iterateCallArgumentsPath(path, () => {
      printed.push(print3());
    });
    if (!(isTemplateLiteralSingleArg && printed[0].label?.embed)) {
      return [
        printCallee(path, print3),
        optional,
        typeArgumentsDoc,
        "(",
        join(", ", printed),
        ")"
      ];
    }
  }
  const isDynamicImportLike = node.type === "ImportExpression" || node.type === "TSImportType" || node.type === "TSExternalModuleReference";
  if (!isDynamicImportLike && !isNewExpression && isMemberish(node.callee) && !path.call(
    () => needs_parentheses_default(path, options2),
    "callee",
    ...node.callee.type === "ChainExpression" ? ["expression"] : []
  )) {
    return member_chain_default(path, options2, print3);
  }
  const contents = [
    printCallee(path, print3),
    optional,
    typeArgumentsDoc,
    call_arguments_default(path, options2, print3)
  ];
  if (isDynamicImportLike || isCallExpression(node.callee)) {
    return group(contents);
  }
  return contents;
}
function printCallee(path, print3) {
  const { node } = path;
  if (node.type === "ImportExpression") {
    return `import${node.phase ? `.${node.phase}` : ""}`;
  }
  if (node.type === "TSImportType") {
    return "import";
  }
  if (node.type === "TSExternalModuleReference") {
    return "require";
  }
  return [
    node.type === "NewExpression" ? "new " : "",
    print3("callee"),
    lineSuffixBoundary
  ];
}
var moduleImportCallees = [
  "require",
  "require.resolve",
  "require.resolve.paths",
  "import.meta.resolve"
];
function isSimpleModuleImport(path) {
  const { node } = path;
  if (!// `import("foo")`
  (node.type === "ImportExpression" || // `type foo = import("foo")`
  node.type === "TSImportType" || // `import type A = require("foo")`
  node.type === "TSExternalModuleReference" || // `require("foo")`
  // `require.resolve("foo")`
  // `require.resolve.paths("foo")`
  // `import.meta.resolve("foo")`
  node.type === "CallExpression" && !node.optional && isNodeMatches(node.callee, moduleImportCallees))) {
    return false;
  }
  const args = getCallArguments(node);
  return args.length === 1 && isStringLiteral(args[0]) && !hasComment(args[0]);
}
function isCommonsJsOrAmdModuleDefinition(path) {
  const { node } = path;
  if (node.type !== "CallExpression" || node.optional) {
    return false;
  }
  if (node.callee.type !== "Identifier") {
    return false;
  }
  const args = getCallArguments(node);
  if (node.callee.name === "require") {
    return (args.length === 1 && isStringLiteral(args[0]) || args.length > 1) && !hasComment(args[0]);
  }
  if (node.callee.name === "define" && path.parent.type === "ExpressionStatement") {
    return args.length === 1 || args.length === 2 && args[0].type === "ArrayExpression" || args.length === 3 && isStringLiteral(args[0]) && args[1].type === "ArrayExpression";
  }
  return false;
}

// src/language-js/print/assignment.js
function printAssignment(path, options2, print3, leftDoc, operator, rightPropertyName) {
  const layout = chooseLayout(path, options2, print3, leftDoc, rightPropertyName);
  const rightDoc = rightPropertyName ? print3(rightPropertyName, { assignmentLayout: layout }) : "";
  switch (layout) {
    // First break after operator, then the sides are broken independently on their own lines
    case "break-after-operator":
      return group([group(leftDoc), operator, group(indent([line, rightDoc]))]);
    // First break right-hand side, then left-hand side
    case "never-break-after-operator":
      return group([group(leftDoc), operator, " ", rightDoc]);
    // First break right-hand side, then after operator
    case "fluid": {
      const groupId = /* @__PURE__ */ Symbol("assignment");
      return group([
        group(leftDoc),
        operator,
        group(indent(line), { id: groupId }),
        lineSuffixBoundary,
        indentIfBreak(rightDoc, { groupId })
      ]);
    }
    case "break-lhs":
      return group([leftDoc, operator, " ", group(rightDoc)]);
    // Parts of assignment chains aren't wrapped in groups.
    // Once one of them breaks, the chain breaks too.
    case "chain":
      return [group(leftDoc), operator, line, rightDoc];
    case "chain-tail":
      return [group(leftDoc), operator, indent([line, rightDoc])];
    case "chain-tail-arrow-chain":
      return [group(leftDoc), operator, rightDoc];
    case "only-left":
      return leftDoc;
  }
}
function printAssignmentExpression(path, options2, print3) {
  const { node } = path;
  return printAssignment(
    path,
    options2,
    print3,
    print3("left"),
    [" ", node.operator],
    "right"
  );
}
function printVariableDeclarator(path, options2, print3) {
  return printAssignment(path, options2, print3, print3("id"), " =", "init");
}
function chooseLayout(path, options2, print3, leftDoc, rightPropertyName) {
  const { node } = path;
  const rightNode = node[rightPropertyName];
  if (!rightNode) {
    return "only-left";
  }
  const isTail = !isAssignment(rightNode);
  const shouldUseChainFormatting = path.match(
    isAssignment,
    isAssignmentOrVariableDeclarator,
    (node2) => !isTail || node2.type !== "ExpressionStatement" && node2.type !== "VariableDeclaration"
  );
  if (shouldUseChainFormatting) {
    return !isTail ? "chain" : rightNode.type === "ArrowFunctionExpression" && rightNode.body.type === "ArrowFunctionExpression" ? "chain-tail-arrow-chain" : "chain-tail";
  }
  const isHeadOfLongChain = !isTail && isAssignment(rightNode.right);
  if (isHeadOfLongChain || isUnionType(rightNode) && !shouldHugUnionType(rightNode) || hasLeadingOwnLineComment(options2.originalText, rightNode) || hasComment(rightNode, CommentCheckFlags.Leading, isIndentableBlockComment)) {
    return "break-after-operator";
  }
  if (node.type === "ImportAttribute" || rightNode.type === "CallExpression" && rightNode.callee.name === "require" || // do not put values on a separate line from the key in JSON
  path.root.type === "JsonRoot") {
    return "never-break-after-operator";
  }
  const canBreakLeftDoc = canBreak(leftDoc);
  if (isComplexDestructuring(node) || hasComplexTypeAnnotation(node) || isArrowFunctionVariableDeclarator(node) && canBreakLeftDoc) {
    return "break-lhs";
  }
  const hasShortKey = isObjectPropertyWithShortKey(node, leftDoc, options2);
  if (path.call(
    () => shouldBreakAfterOperator(path, options2, print3, hasShortKey),
    rightPropertyName
  )) {
    return "break-after-operator";
  }
  if (isComplexTypeAliasParams(node)) {
    return "break-lhs";
  }
  if (!canBreakLeftDoc && (hasShortKey || rightNode.type === "TemplateLiteral" || rightNode.type === "TaggedTemplateExpression" || isBooleanLiteral(rightNode) || isNumericLiteral(rightNode) || rightNode.type === "ClassExpression")) {
    return "never-break-after-operator";
  }
  return "fluid";
}
function shouldBreakAfterOperator(path, options2, print3, hasShortKey) {
  const rightNode = path.node;
  if (isBinaryish(rightNode) && !shouldInlineLogicalExpression(rightNode)) {
    return true;
  }
  switch (rightNode.type) {
    case "StringLiteralTypeAnnotation":
    case "SequenceExpression":
      return true;
    case "TSConditionalType":
    case "ConditionalTypeAnnotation":
      if (!options2.experimentalTernaries && !shouldBreakBeforeConditionalType(rightNode)) {
        break;
      }
      return true;
    case "ConditionalExpression": {
      if (!options2.experimentalTernaries) {
        const { test } = rightNode;
        return isBinaryish(test) && !shouldInlineLogicalExpression(test);
      }
      const { consequent, alternate } = rightNode;
      return consequent.type === "ConditionalExpression" || alternate.type === "ConditionalExpression";
    }
    case "ClassExpression":
      return is_non_empty_array_default(rightNode.decorators);
  }
  if (hasShortKey) {
    return false;
  }
  let node = rightNode;
  const propertiesForPath = [];
  while (true) {
    if (node.type === "UnaryExpression" || node.type === "AwaitExpression" || node.type === "YieldExpression" && node.argument !== null) {
      node = node.argument;
      propertiesForPath.push("argument");
    } else if (node.type === "TSNonNullExpression") {
      node = node.expression;
      propertiesForPath.push("expression");
    } else {
      break;
    }
  }
  if (isStringLiteral(node) || path.call(
    () => isPoorlyBreakableMemberOrCallChain(path, options2, print3),
    ...propertiesForPath
  )) {
    return true;
  }
  return false;
}
function isComplexDestructuring(node) {
  if (isAssignmentOrVariableDeclarator(node)) {
    const leftNode = node.left || node.id;
    return leftNode.type === "ObjectPattern" && leftNode.properties.length > 2 && leftNode.properties.some(
      (property) => isObjectProperty(property) && (!property.shorthand || property.value?.type === "AssignmentPattern")
    );
  }
  return false;
}
function isAssignment(node) {
  return node.type === "AssignmentExpression";
}
function isAssignmentOrVariableDeclarator(node) {
  return isAssignment(node) || node.type === "VariableDeclarator";
}
function isComplexTypeAliasParams(node) {
  const typeParams = getTypeParametersFromTypeAlias(node);
  if (is_non_empty_array_default(typeParams)) {
    const constraintPropertyName = node.type === "TSTypeAliasDeclaration" ? "constraint" : "bound";
    if (typeParams.length > 1 && typeParams.some((param) => param[constraintPropertyName] || param.default)) {
      return true;
    }
  }
  return false;
}
function getTypeParametersFromTypeAlias(node) {
  if (isTypeAlias(node)) {
    return node.typeParameters?.params;
  }
}
function hasComplexTypeAnnotation(node) {
  if (node.type !== "VariableDeclarator") {
    return false;
  }
  const { typeAnnotation } = node.id;
  if (!typeAnnotation || !typeAnnotation.typeAnnotation) {
    return false;
  }
  const typeParams = getTypeParametersFromTypeReference(
    typeAnnotation.typeAnnotation
  );
  return is_non_empty_array_default(typeParams) && typeParams.length > 1 && typeParams.some(
    (param) => is_non_empty_array_default(getTypeParametersFromTypeReference(param)) || param.type === "TSConditionalType"
  );
}
function isArrowFunctionVariableDeclarator(node) {
  return node.type === "VariableDeclarator" && node.init?.type === "ArrowFunctionExpression";
}
function getTypeParametersFromTypeReference(node) {
  let typeArguments;
  switch (node.type) {
    case "GenericTypeAnnotation":
      typeArguments = node.typeParameters;
      break;
    case "TSTypeReference":
      typeArguments = node.typeArguments;
      break;
  }
  return typeArguments?.params;
}
function isPoorlyBreakableMemberOrCallChain(path, options2, print3, deep = false) {
  const { node } = path;
  const goDeeper = () => isPoorlyBreakableMemberOrCallChain(path, options2, print3, true);
  if (isChainElementWrapper(node)) {
    return path.call(goDeeper, "expression");
  }
  if (isCallExpression(node)) {
    const doc = printCallExpression(path, options2, print3);
    if (doc.label?.memberChain) {
      return false;
    }
    const args = getCallArguments(node);
    const isPoorlyBreakableCall = args.length === 0 || args.length === 1 && isLoneShortArgument(args[0], options2);
    if (!isPoorlyBreakableCall) {
      return false;
    }
    if (isCallExpressionWithComplexTypeArguments(node, print3)) {
      return false;
    }
    return path.call(goDeeper, "callee");
  }
  if (isMemberExpression(node)) {
    return path.call(goDeeper, "object");
  }
  return deep && (node.type === "Identifier" || node.type === "ThisExpression");
}
function isObjectPropertyWithShortKey(node, keyDoc, options2) {
  if (!isObjectProperty(node)) {
    return false;
  }
  keyDoc = cleanDoc(keyDoc);
  const MIN_OVERLAP_FOR_BREAK = 3;
  return typeof keyDoc === "string" && get_string_width_default(keyDoc) < options2.tabWidth + MIN_OVERLAP_FOR_BREAK;
}
function isCallExpressionWithComplexTypeArguments(node, print3) {
  const typeArgs = node.typeArguments?.params;
  if (is_non_empty_array_default(typeArgs)) {
    if (typeArgs.length > 1) {
      return true;
    }
    if (typeArgs.length === 1) {
      const firstArg = typeArgs[0];
      if (isUnionType(firstArg) || isIntersectionType(firstArg) || firstArg.type === "TSTypeLiteral" || firstArg.type === "ObjectTypeAnnotation") {
        return true;
      }
    }
    if (willBreak(print3("typeArguments"))) {
      return true;
    }
  }
  return false;
}
function isGeneric(node) {
  switch (node.type) {
    case "FunctionTypeAnnotation":
    case "GenericTypeAnnotation":
    case "TSFunctionType":
      return Boolean(node.typeParameters);
    case "TSTypeReference":
      return Boolean(node.typeArguments);
    default:
      return false;
  }
}
function shouldBreakBeforeConditionalType(node) {
  return isGeneric(node.checkType) || isGeneric(node.extendsType);
}

// src/language-js/print/await-expression.js
function printAwaitExpression(path, options2, print3) {
  const { node } = path;
  let parts = ["await"];
  if (node.argument) {
    parts.push(" ", print3("argument"));
    const { parent } = path;
    if (isCallExpression(parent) && parent.callee === node || isMemberExpression(parent) && parent.object === node) {
      parts = [indent([softline, ...parts]), softline];
      const parentAwaitOrBlock = path.findAncestor(
        (node2) => node2.type === "AwaitExpression" || node2.type === "BlockStatement"
      );
      if (parentAwaitOrBlock?.type !== "AwaitExpression" || !startsWithNoLookaheadToken(
        parentAwaitOrBlock.argument,
        (leftmostNode) => leftmostNode === node
      )) {
        return group(parts);
      }
    }
  }
  return parts;
}

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

// src/language-js/print/statement-sequence.js
function printStatementSequence(path, options2, print3, property) {
  const {
    node
  } = path;
  const parts = [];
  const lastStatement = method_find_last_default(
    /* OPTIONAL_OBJECT: false */
    0,
    node[property],
    (statement) => statement.type !== "EmptyStatement"
  );
  path.each(({
    node: node2
  }) => {
    if (node2.type === "EmptyStatement") {
      return;
    }
    parts.push(print3());
    if (node2 !== lastStatement) {
      parts.push(hardline);
      if (isNextLineEmpty2(node2, options2)) {
        parts.push(hardline);
      }
    }
  }, property);
  return parts;
}

// src/language-js/print/block.js
function printBlock(path, options2, print3) {
  const bodyDoc = printBlockBody(path, options2, print3);
  const {
    node,
    parent
  } = path;
  if (node.type === "Program" && parent?.type !== "ModuleExpression") {
    return bodyDoc ? [bodyDoc, hardline] : "";
  }
  const parts = [];
  if (node.type === "StaticBlock") {
    parts.push("static ");
  }
  parts.push("{");
  if (bodyDoc) {
    parts.push(indent([hardline, bodyDoc]), hardline);
  } else {
    const parentParent = path.grandparent;
    if (!(parent.type === "ArrowFunctionExpression" || parent.type === "FunctionExpression" || parent.type === "FunctionDeclaration" || parent.type === "ComponentDeclaration" || parent.type === "HookDeclaration" || parent.type === "ObjectMethod" || parent.type === "ClassMethod" || parent.type === "ClassPrivateMethod" || parent.type === "ForStatement" || parent.type === "WhileStatement" || parent.type === "DoWhileStatement" || parent.type === "DoExpression" || parent.type === "ModuleExpression" || parent.type === "CatchClause" && !parentParent.finalizer || parent.type === "TSModuleDeclaration" || parent.type === "DeclareModule" || parent.type === "MatchStatementCase" || node.type === "StaticBlock")) {
      parts.push(hardline);
    }
  }
  parts.push("}");
  return parts;
}
function printBlockBody(path, options2, print3) {
  const {
    node
  } = path;
  const hasDirectives = is_non_empty_array_default(node.directives);
  const hasBody = node.body.some((node2) => node2.type !== "EmptyStatement");
  const hasDanglingComments = hasComment(node, CommentCheckFlags.Dangling);
  if (!hasDirectives && !hasBody && !hasDanglingComments) {
    return "";
  }
  const parts = [];
  if (hasDirectives) {
    parts.push(printStatementSequence(path, options2, print3, "directives"));
    if (hasBody || hasDanglingComments) {
      parts.push(hardline);
      if (isNextLineEmpty2(method_at_default(
        /* OPTIONAL_OBJECT: false */
        0,
        node.directives,
        -1
      ), options2)) {
        parts.push(hardline);
      }
    }
  }
  if (hasBody) {
    parts.push(printStatementSequence(path, options2, print3, "body"));
  }
  if (hasDanglingComments) {
    parts.push(printDanglingComments(path, options2));
  }
  return parts;
}

// src/utilities/create-group-id-mapper.js
function createGroupIdMapper(description) {
  const groupIds = /* @__PURE__ */ new WeakMap();
  return (node) => getOrInsertComputed(groupIds, node, () => Symbol(description));
}
var create_group_id_mapper_default = createGroupIdMapper;

// src/language-js/utilities/class-members.js
var flowObjectTypeAnnotationChildrenProperties = [
  "properties",
  "indexers",
  "callProperties",
  "internalSlots"
];
function iterateClassMembersPath(path, iteratee) {
  const { node } = path;
  if (node.type === "ClassBody" || node.type === "TSInterfaceBody") {
    path.each(iteratee, "body");
    return;
  }
  if (node.type === "TSTypeLiteral") {
    path.each(iteratee, "members");
    return;
  }
  if (node.type === "RecordDeclarationBody") {
    path.each(iteratee, "elements");
    return;
  }
  if (node.type === "ObjectTypeAnnotation") {
    const children = flowObjectTypeAnnotationChildrenProperties.flatMap(
      (field) => path.map(
        ({ node: node2, index }) => ({
          node: node2,
          loc: locStart(node2),
          selector: [field, index]
        }),
        field
      )
    ).sort((a, b) => a.loc - b.loc);
    for (const [index, { node: node2, selector }] of children.entries()) {
      path.call(
        () => iteratee({
          node: node2,
          next: children[index + 1]?.node,
          isLast: index === children.length - 1
        }),
        ...selector
      );
    }
  }
}
function isNonEmptyClassBody(node) {
  if (node.type === "ObjectTypeAnnotation") {
    return flowObjectTypeAnnotationChildrenProperties.some(
      (property) => is_non_empty_array_default(node[property])
    );
  }
  const members = node.type === "RecordDeclarationBody" ? node.elements : node.body;
  return is_non_empty_array_default(members);
}

// src/language-js/print/class-body.js
function printClassBody(path, options2, print3) {
  const {
    node
  } = path;
  const parts = [];
  const isFlowTypeAnnotation = node.type === "ObjectTypeAnnotation";
  const isFlowRecordDeclaration = node.type === "RecordDeclarationBody";
  const isObjectType2 = !isClassBody(path);
  const separator = isObjectType2 ? line : hardline;
  const hasDanglingComments = hasComment(node, CommentCheckFlags.Dangling);
  const [openingBrace, closingBrace] = isFlowTypeAnnotation && node.exact ? ["{|", "|}"] : "{}";
  let isEmpty = true;
  let firstMember;
  iterateClassMembersPath(path, ({
    node: node2,
    next,
    isLast
  }) => {
    firstMember ?? (firstMember = node2);
    isEmpty && (isEmpty = false);
    parts.push(print3());
    if (!isFlowRecordDeclaration && isObjectType2 && isFlowTypeAnnotation) {
      const {
        parent
      } = path;
      if (parent.inexact || !isLast) {
        parts.push(",");
      } else {
        parts.push(printTrailingComma(options2));
      }
    }
    if (isFlowRecordDeclaration && node2.type !== "MethodDefinition") {
      parts.push(",");
    }
    if (!isFlowRecordDeclaration && !isObjectType2 && (shouldPrintSemicolonAfterClassProperty({
      node: node2,
      next
    }, options2) || shouldPrintSemicolonAfterInterfaceProperty({
      node: node2,
      next
    }, options2))) {
      parts.push(";");
    }
    if (!isLast) {
      parts.push(separator);
      if (isNextLineEmpty2(node2, options2)) {
        parts.push(hardline);
      }
    }
  });
  if (hasDanglingComments) {
    parts.push(printDanglingComments(path, options2));
  }
  if (node.type === "ObjectTypeAnnotation" && node.inexact) {
    isEmpty && (isEmpty = false);
    let printed;
    if (hasComment(node, CommentCheckFlags.Dangling)) {
      const hasLineComments = hasComment(node, CommentCheckFlags.Line);
      printed = [hasLineComments || has_newline_default(options2.originalText, locEnd(method_at_default(
        /* OPTIONAL_OBJECT: false */
        0,
        getComments(node),
        -1
      ))) ? hardline : line, "..."];
    } else {
      printed = [firstMember ? line : "", "..."];
    }
    parts.push(printed);
  }
  if (isObjectType2) {
    const shouldBreak = hasComment(node, CommentCheckFlags.Dangling | CommentCheckFlags.Line) || options2.objectWrap === "preserve" && firstMember && has_newline_in_range_default(options2.originalText, locStart(node), locStart(firstMember));
    let content;
    if (parts.length === 0) {
      content = openingBrace + closingBrace;
    } else {
      const spacing = !options2.bracketSpacing || isEmpty && !shouldBreak ? softline : line;
      content = [openingBrace, indent([spacing, ...parts]), spacing, closingBrace];
    }
    if (path.match(void 0, (node2, name) => name === "typeAnnotation", (node2, name) => name === "typeAnnotation", shouldHugTheOnlyParameter) || path.match(void 0, (node2, name) => node2.type === "FunctionTypeParam" && name === "typeAnnotation", shouldHugTheOnlyParameter)) {
      return content;
    }
    return group(content, {
      shouldBreak
    });
  }
  return [openingBrace, parts.length > 0 ? [indent([hardline, parts]), hardline] : "", closingBrace];
}
function isClassBody(path) {
  const {
    node
  } = path;
  if (node.type === "ObjectTypeAnnotation") {
    const {
      key,
      parent
    } = path;
    return key === "body" && (parent.type === "InterfaceDeclaration" || parent.type === "DeclareInterface" || parent.type === "DeclareClass");
  }
  return node.type === "ClassBody" || node.type === "TSInterfaceBody" || node.type === "RecordDeclarationBody";
}
function printClassMemberSemicolon(path, options2) {
  const {
    parent
  } = path;
  if (path.callParent(isClassBody)) {
    return parent.type === "ObjectTypeAnnotation" ? ";" : printSemicolon(options2);
  }
  if (parent.type === "TSTypeLiteral") {
    if (path.isLast) {
      return options2.semi ? ifBreak(";") : "";
    }
    if (options2.semi || shouldPrintSemicolonAfterInterfaceProperty({
      node: path.node,
      next: path.next
    }, options2)) {
      return ";";
    }
    return ifBreak("", ";");
  }
  return "";
}
var isClassProperty = createTypeCheckFunction(["ClassProperty", "PropertyDefinition", "ClassPrivateProperty", "ClassAccessorProperty", "AccessorProperty", "TSAbstractPropertyDefinition", "TSAbstractAccessorProperty"]);
var isKeywordProperty = (node) => {
  if (node.computed || node.typeAnnotation) {
    return false;
  }
  const {
    type,
    name
  } = node.key;
  return type === "Identifier" && (name === "static" || name === "get" || name === "set");
};
function shouldPrintSemicolonAfterClassProperty({
  node,
  next: nextNode
}, options2) {
  if (options2.semi || !isClassProperty(node)) {
    return false;
  }
  if (!node.value && isKeywordProperty(node)) {
    return true;
  }
  if (!nextNode) {
    return false;
  }
  if (nextNode.static || nextNode.accessibility || // TypeScript
  nextNode.readonly) {
    return false;
  }
  if (!nextNode.computed) {
    const name = nextNode.key?.name;
    if (name === "in" || name === "instanceof") {
      return true;
    }
  }
  if (isClassProperty(nextNode) && !nextNode.static && // @ts-expect-error -- Safe
  nextNode.variance && // @ts-expect-error -- Safe
  !nextNode.declare) {
    return true;
  }
  switch (nextNode.type) {
    case "ClassProperty":
    case "PropertyDefinition":
    case "TSAbstractPropertyDefinition":
      return nextNode.computed;
    case "MethodDefinition":
    case "TSAbstractMethodDefinition":
    case "ClassMethod":
    case "ClassPrivateMethod": {
      const isAsync = nextNode.value ? nextNode.value.async : nextNode.async;
      if (isAsync || nextNode.kind === "get" || nextNode.kind === "set") {
        return false;
      }
      const isGenerator = nextNode.value ? nextNode.value.generator : nextNode.generator;
      if (nextNode.computed || isGenerator) {
        return true;
      }
      return false;
    }
    case "TSIndexSignature":
      return true;
  }
  return false;
}
var isInterfaceProperty = createTypeCheckFunction(["TSPropertySignature"]);
function shouldPrintSemicolonAfterInterfaceProperty({
  node,
  next: nextNode
}, options2) {
  if (options2.semi || !isInterfaceProperty(node)) {
    return false;
  }
  if (isKeywordProperty(node)) {
    return true;
  }
  if (!nextNode) {
    return false;
  }
  switch (nextNode.type) {
    case "TSCallSignatureDeclaration":
      if (node.type === "TSPropertySignature" && node.typeAnnotation) {
        return false;
      }
      return true;
  }
  return false;
}

// src/language-js/print/class.js
var getHeritageGroupId = create_group_id_mapper_default("heritageGroup");
var isInterface = createTypeCheckFunction([
  "TSInterfaceDeclaration",
  "DeclareInterface",
  "InterfaceDeclaration",
  "InterfaceTypeAnnotation"
]);
function printClass(path, options2, print3) {
  const doc = printClassWithoutDecorators(path, options2, print3);
  const { node } = path;
  if (node.type === "ClassExpression" && is_non_empty_array_default(node.decorators)) {
    const decoratorsDoc = printDecorators(path, options2, print3);
    const needsParens = needs_parentheses_default(path, options2);
    return needsParens ? [indent([softline, decoratorsDoc, doc]), softline] : [decoratorsDoc, doc];
  }
  return doc;
}
function printClassWithoutDecorators(path, options2, print3) {
  const { node } = path;
  const isPrintingInterface = isInterface(node);
  const isPrintingRecord = node.type === "RecordDeclaration";
  const keyword = isPrintingInterface ? "interface" : isPrintingRecord ? "record" : "class";
  const parts = [printDeclareToken(path), printAbstractToken(path), keyword];
  const groupMode = shouldPrintClassInGroupMode(path);
  const partsGroup = [];
  const extendsParts = [];
  if (node.type !== "InterfaceTypeAnnotation") {
    if (node.id) {
      partsGroup.push(" ");
    }
    for (const property of ["id", "typeParameters"]) {
      if (node[property]) {
        const { leading, trailing } = path.call(
          () => printCommentsSeparately(path, options2),
          property
        );
        partsGroup.push(leading, print3(property), indent(trailing));
      }
    }
  }
  if (node.superClass) {
    const printed = [
      printSuperClass(path, options2, print3),
      print3("superTypeArguments")
    ];
    const printedWithComments = path.call(
      () => ["extends ", printComments(path, printed, options2)],
      "superClass"
    );
    if (groupMode) {
      extendsParts.push(line, group(printedWithComments));
    } else {
      extendsParts.push(" ", printedWithComments);
    }
  } else {
    extendsParts.push(printHeritageClauses(path, options2, print3, "extends"));
  }
  extendsParts.push(
    printHeritageClauses(path, options2, print3, "mixins"),
    printHeritageClauses(path, options2, print3, "implements")
  );
  let heritageGroupId;
  if (groupMode) {
    heritageGroupId = getHeritageGroupId(node);
    parts.push(
      group([...partsGroup, indent(extendsParts)], { id: heritageGroupId })
    );
  } else {
    parts.push(...partsGroup, ...extendsParts);
  }
  if (!isPrintingInterface && groupMode && isNonEmptyClassBody(node.body)) {
    parts.push(ifBreak(hardline, " ", { groupId: heritageGroupId }));
  } else {
    parts.push(" ");
  }
  parts.push(print3("body"));
  return parts;
}
function hasMultipleHeritage(node) {
  let count = node.superClass ? 1 : 0;
  for (const listName of ["extends", "mixins", "implements"]) {
    if (Array.isArray(node[listName])) {
      count += node[listName].length;
    }
    if (count > 1) {
      return true;
    }
  }
  return count > 1;
}
function shouldPrintClassInGroupModeWithoutCache(path) {
  const { node } = path;
  if (hasComment(node.id, CommentCheckFlags.Trailing) || hasComment(node.typeParameters, CommentCheckFlags.Trailing) || hasComment(node.superClass) || hasMultipleHeritage(node)) {
    return true;
  }
  if (node.superClass) {
    if (path.parent.type === "AssignmentExpression") {
      return false;
    }
    return !node.superTypeArguments && isMemberExpression(stripChainElementWrappers(node.superClass));
  }
  const heritage = node.extends?.[0] ?? node.mixins?.[0] ?? node.implements?.[0];
  if (!heritage) {
    return false;
  }
  const groupMode = (
    // `ClassImplements` seem not allow `QualifiedTypeIdentifier`
    heritage.type === "InterfaceExtends" && heritage.id.type === "QualifiedTypeIdentifier" && !heritage.typeParameters || (heritage.type === "TSClassImplements" || heritage.type === "TSInterfaceHeritage") && isMemberExpression(heritage.expression) && !heritage.typeArguments
  );
  return groupMode;
}
var shouldPrintClassInGroupModeCache = /* @__PURE__ */ new WeakMap();
function shouldPrintClassInGroupMode(path) {
  return getOrInsertComputed(
    shouldPrintClassInGroupModeCache,
    path.node,
    () => shouldPrintClassInGroupModeWithoutCache(path)
  );
}
function printHeritageClauses(path, options2, print3, listName) {
  const { node } = path;
  if (!is_non_empty_array_default(node[listName])) {
    return "";
  }
  const printedLeadingComments = printDanglingComments(path, options2, {
    marker: listName
  });
  const heritageClausesDoc = join([",", line], path.map(print3, listName));
  if (!hasMultipleHeritage(node)) {
    const printed = [
      `${listName} `,
      printedLeadingComments,
      heritageClausesDoc
    ];
    if (shouldPrintClassInGroupMode(path)) {
      return [line, group(printed)];
    }
    return [" ", printed];
  }
  return [
    line,
    printedLeadingComments,
    printedLeadingComments && hardline,
    listName,
    group(indent([line, heritageClausesDoc]))
  ];
}
function printSuperClass(path, options2, print3) {
  const printed = print3("superClass");
  const { parent } = path;
  if (parent.type === "AssignmentExpression") {
    return group(
      ifBreak(["(", indent([softline, printed]), softline, ")"], printed)
    );
  }
  return printed;
}
function printClassMethod(path, options2, print3) {
  const { node } = path;
  const parts = [];
  if (is_non_empty_array_default(node.decorators)) {
    parts.push(printClassMemberDecorators(path, options2, print3));
  }
  parts.push(printTypeScriptAccessibilityToken(node));
  if (node.static) {
    parts.push("static ");
  }
  parts.push(printAbstractToken(path));
  if (node.override) {
    parts.push("override ");
  }
  parts.push(printMethod(path, options2, print3));
  return parts;
}
function printClassProperty(path, options2, print3) {
  const { node } = path;
  const parts = [];
  if (is_non_empty_array_default(node.decorators)) {
    parts.push(printClassMemberDecorators(path, options2, print3));
  }
  parts.push(printDeclareToken(path), printTypeScriptAccessibilityToken(node));
  if (node.static) {
    parts.push("static ");
  }
  parts.push(printAbstractToken(path));
  if (node.override) {
    parts.push("override ");
  }
  if (node.readonly) {
    parts.push("readonly ");
  }
  if (node.variance) {
    parts.push(print3("variance"));
  }
  if (node.type === "ClassAccessorProperty" || node.type === "AccessorProperty" || node.type === "TSAbstractAccessorProperty") {
    parts.push("accessor ");
  }
  parts.push(
    printKey(path, options2, print3),
    printOptionalToken(path),
    printDefiniteToken(path),
    printTypeAnnotationProperty(path, print3)
  );
  const isAbstractProperty = node.type === "TSAbstractPropertyDefinition" || node.type === "TSAbstractAccessorProperty";
  return [
    printAssignment(
      path,
      options2,
      print3,
      parts,
      " =",
      isAbstractProperty ? void 0 : "value"
    ),
    printSemicolon(options2)
  ];
}

// src/language-js/print/clause.js
function shouldPrintLeadingHardline(node, options2) {
  const leadingComments = getComments(node, CommentCheckFlags.Leading);
  if (leadingComments.length === 0) {
    return false;
  }
  const [firstComment] = leadingComments;
  const text = options2.originalText;
  const start = locStart(firstComment);
  return has_newline_in_range_default(text, start, locEnd(firstComment)) || has_newline_default(text, start, { backwards: true });
}
function printClause(path, options2, print3, property = "body") {
  return path.call(({ node }) => {
    const doc = print3();
    if (node.type === "EmptyStatement") {
      return hasComment(node, CommentCheckFlags.Leading) ? [" ", doc] : doc;
    }
    const isBlockStatement = node.type === "BlockStatement";
    if (shouldPrintLeadingHardline(node, options2)) {
      return isBlockStatement ? [hardline, doc] : indent([hardline, doc]);
    }
    if (isBlockStatement || node.type === "IfStatement" && path.parent.type === "IfStatement" && path.key === "alternate") {
      return [" ", doc];
    }
    return indent([line, doc]);
  }, property);
}
var printIfStatementConsequent = (path, options2, print3) => printClause(path, options2, print3, "consequent");
var printIfStatementAlternate = (path, options2, print3) => printClause(path, options2, print3, "alternate");

// src/language-js/print/do-while-statement.js
function printDoWhileStatement(path, options2, print3) {
  return [
    group(["do", printClause(path, options2, print3)]),
    path.node.body.type === "BlockStatement" ? " " : hardline,
    "while (",
    printIfOrWhileConditionOrWithStatementObject(path, options2, print3),
    ")",
    printSemicolon(options2)
  ];
}

// src/language-js/utilities/vue-event-binding.js
var isVueEventBindingTsNode = createTypeCheckFunction([
  "TSAsExpression",
  // `foo as number`
  "TSTypeAssertion",
  // `(<number>foo)`
  "TSNonNullExpression",
  // `foo!`
  "TSInstantiationExpression",
  // `foo<string>`
  "TSSatisfiesExpression"
  // `foo satisfies T`
]);
function unwrapVueEventBindingTsNode(node) {
  if (isVueEventBindingTsNode(node)) {
    return unwrapVueEventBindingTsNode(node.expression);
  }
  return node;
}
var isVueEventBindingFunctionExpression = createTypeCheckFunction([
  "FunctionExpression",
  "ArrowFunctionExpression"
]);
function isVueEventBindingMemberExpression(node) {
  return node.type === "MemberExpression" || node.type === "OptionalMemberExpression" || node.type === "Identifier" && node.name !== "undefined";
}

// src/language-js/print/expression-statement.js
function shouldPrintSemicolon(path, options2) {
  if (isSingleVueEventBindingExpressionStatement(path, options2)) {
    const expression = unwrapVueEventBindingTsNode(path.node.expression);
    return isVueEventBindingFunctionExpression(expression) || isVueEventBindingMemberExpression(expression);
  }
  if (!options2.semi) {
    return false;
  }
  if (
    // Do not append semicolon after the only JSX element in a program
    isSingleJsxExpressionStatementInMarkdown(path, options2) || // Do not append semicolon after the only HTML event binding expression in a program
    isSingleHtmlEventHandlerExpressionStatement(path, options2)
  ) {
    return false;
  }
  return true;
}
function printExpressionStatement(path, options2, print3) {
  const parts = [print3("expression")];
  if (shouldExpressionStatementPrintLeadingSemicolon(path, options2)) {
    if (shouldExpressionStatementPrintOwnComments(path, options2)) {
      const {
        node
      } = path;
      const typeCastComment = method_at_default(
        /* OPTIONAL_OBJECT: false */
        0,
        getComments(node, CommentCheckFlags.Leading),
        -1
      );
      const typeCastCommentDoc = printLeadingComments(path, options2, {
        filter: (comment) => comment === typeCastComment
      });
      return printComments(path, [";", typeCastCommentDoc, ...parts], options2, {
        filter: (comment) => comment !== typeCastComment
      });
    }
    parts.unshift(";");
  } else if (shouldPrintSemicolon(path, options2)) {
    parts.push(";");
  }
  return parts;
}

// src/language-js/print/for-statement.js
function printForStatement(path, options2, print3) {
  const { node } = path;
  const body = printClause(path, options2, print3);
  const dangling = printDanglingComments(path, options2);
  const printedComments = dangling ? [dangling, softline] : "";
  if (!node.init && !node.test && !node.update) {
    return [printedComments, group(["for (;;)", body])];
  }
  return [
    printedComments,
    group([
      "for (",
      group([
        indent([
          softline,
          print3("init"),
          ";",
          line,
          print3("test"),
          ";",
          node.update ? [line, print3("update")] : ""
        ]),
        softline
      ]),
      ")",
      body
    ])
  ];
}

// src/language-js/print/for-x-statement.js
function printForXStatement(path, options2, print3) {
  const { node } = path;
  const isForOfStatement = node.type === "ForOfStatement";
  return group([
    "for",
    isForOfStatement && node.await ? " await" : "",
    " (",
    print3("left"),
    " ",
    isForOfStatement ? "of" : "in",
    " ",
    print3("right"),
    ")",
    printClause(path, options2, print3)
  ]);
}

// src/language-js/print/html-binding.js
function printHtmlBinding(path, options2, print3) {
  if (options2.__isVueBindings || options2.__isVueForBindingLeft) {
    const parameterDocs = path.map(print3, "program", "body", 0, "params");
    if (parameterDocs.length === 1) {
      return parameterDocs[0];
    }
    const doc = join([",", line], parameterDocs);
    return options2.__isVueForBindingLeft ? ["(", indent([softline, group(doc)]), softline, ")"] : doc;
  }
  if (options2.__isEmbeddedTypescriptGenericParameters) {
    const parameterDocs = path.map(
      print3,
      "program",
      "body",
      0,
      "typeParameters",
      "params"
    );
    return join([",", line], parameterDocs);
  }
}

// src/language-js/utilities/is-previous-line-empty.js
var isPreviousLineEmpty2 = (node, { originalText }) => is_previous_line_empty_default(originalText, locStart(node));

// src/language-js/utilities/needs-hardline-after-dangling-comment.js
function needsHardlineAfterDanglingComment(node) {
  return isLineComment(method_at_default(
    /* OPTIONAL_OBJECT: false */
    0,
    getComments(node, CommentCheckFlags.Dangling),
    -1
  ));
}

// src/language-js/print/if-statement.js
function printIfStatement(path, options2, print3) {
  const {
    node
  } = path;
  const opening = group(["if (", printIfOrWhileConditionOrWithStatementObject(path, options2, print3), ")", printIfStatementConsequent(path, options2, print3)]);
  if (!node.alternate) {
    return opening;
  }
  const {
    consequent
  } = node;
  const isConsequentBlockStatement = consequent.type === "BlockStatement";
  const parts = [opening];
  let needSpace = isConsequentBlockStatement;
  if (!isConsequentBlockStatement) {
    parts.push(hardline);
    needSpace = false;
  }
  const danglingComments = getComments(node, CommentCheckFlags.Dangling);
  if (danglingComments.length > 0) {
    const [firstComment] = danglingComments;
    if (isPreviousLineEmpty2(firstComment, options2)) {
      parts.push(isConsequentBlockStatement ? [hardline, hardline] : hardline);
    } else if (has_newline_default(options2.originalText, locStart(firstComment), {
      backwards: true
    })) {
      parts.push(isConsequentBlockStatement ? hardline : "");
    } else {
      parts.push(" ");
    }
    parts.push(printDanglingComments(path, options2), needsHardlineAfterDanglingComment(node) || has_newline_default(options2.originalText, locEnd(method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      danglingComments,
      -1
    ))) ? hardline : " ");
    needSpace = false;
  }
  parts.push(needSpace ? " " : "", "else", group(printIfStatementAlternate(path, options2, print3)));
  return parts;
}

// src/language-js/print/literal.js
function printLiteral(path, options2) {
  const { node } = path;
  switch (node.type) {
    case "RegExpLiteral":
      return printRegex(node);
    case "BigIntLiteral":
      return printBigInt(node.extra.raw);
    case "NumericLiteral":
      return print_number_default(node.extra.raw);
    case "StringLiteral":
      return replaceEndOfLine(print_string_default(node.extra.raw, options2));
    case "NullLiteral":
      return "null";
    case "BooleanLiteral":
      return String(node.value);
    case "DirectiveLiteral":
      return printDirective(node.extra.raw, options2);
    case "Literal": {
      if (node.regex) {
        return printRegex(node.regex);
      }
      if (node.bigint) {
        return printBigInt(node.raw);
      }
      const { value } = node;
      if (typeof value === "number") {
        return print_number_default(node.raw);
      }
      if (typeof value === "string") {
        return isDirective(path) ? printDirective(node.raw, options2) : replaceEndOfLine(print_string_default(node.raw, options2));
      }
      return String(value);
    }
  }
}
function isDirective(path) {
  if (path.key !== "expression") {
    return;
  }
  const { parent } = path;
  return parent.type === "ExpressionStatement" && typeof parent.directive === "string";
}
function printBigInt(raw) {
  return raw.toLowerCase();
}
function printRegex({ pattern, flags }) {
  flags = [...flags].sort().join("");
  return `/${pattern}/${flags}`;
}
var DIRECTIVE_USE_STRICT = "use strict";
function printDirective(rawText, options2) {
  const rawContent = rawText.slice(1, -1);
  if (rawContent === DIRECTIVE_USE_STRICT || !(rawContent.includes('"') || rawContent.includes("'"))) {
    const enclosingQuote = options2.singleQuote ? "'" : '"';
    return enclosingQuote + rawContent + enclosingQuote;
  }
  return rawText;
}

// src/language-js/print/object.js
var isPrintingImportAttributes = createTypeCheckFunction(["ImportDeclaration", "ExportDefaultDeclaration", "ExportNamedDeclaration", "ExportAllDeclaration", "DeclareExportDeclaration", "DeclareExportAllDeclaration"]);
var isPrintingFlowEnumBody = createTypeCheckFunction(["EnumBody", "EnumBooleanBody", "EnumNumberBody", "EnumBigIntBody", "EnumStringBody", "EnumSymbolBody"]);
function printObject(path, options2, print3) {
  const {
    node,
    parent
  } = path;
  const isFlowEnumBody = isPrintingFlowEnumBody(node);
  const isEnumBody = node.type === "TSEnumBody" || isFlowEnumBody;
  const isImportAttributes = isPrintingImportAttributes(node);
  const hasUnknownMembers = isFlowEnumBody && node.hasUnknownMembers;
  const property = isEnumBody ? "members" : isImportAttributes ? "attributes" : "properties";
  const children = node[property];
  const shouldBreak = isEnumBody || node.type === "ObjectPattern" && parent.type !== "FunctionDeclaration" && parent.type !== "FunctionExpression" && parent.type !== "ArrowFunctionExpression" && parent.type !== "ObjectMethod" && parent.type !== "ClassMethod" && parent.type !== "ClassPrivateMethod" && parent.type !== "AssignmentPattern" && parent.type !== "CatchClause" && node.properties.some((property2) => property2.value && (property2.value.type === "ObjectPattern" || property2.value.type === "ArrayPattern")) || node.type !== "ObjectPattern" && options2.objectWrap === "preserve" && children.length > 0 && hasNewLineAfterOpeningBrace(node, children[0], options2);
  let separatorParts = [];
  const parts = path.map(({
    node: node2
  }) => {
    const result = [...separatorParts, print3()];
    separatorParts = [",", line];
    if (isNextLineEmpty2(node2, options2)) {
      separatorParts.push(hardline);
    }
    return result;
  }, property);
  if (hasUnknownMembers) {
    let printed;
    if (hasComment(node, CommentCheckFlags.Dangling)) {
      const hasLineComments = hasComment(node, CommentCheckFlags.Line);
      const printedDanglingComments = printDanglingComments(path, options2);
      printed = [printedDanglingComments, hasLineComments || has_newline_default(options2.originalText, locEnd(method_at_default(
        /* OPTIONAL_OBJECT: false */
        0,
        getComments(node),
        -1
      ))) ? hardline : line, "..."];
    } else {
      printed = ["..."];
    }
    parts.push([...separatorParts, ...printed]);
  }
  const canHaveTrailingSeparator = !(hasUnknownMembers || method_at_default(
    /* OPTIONAL_OBJECT: false */
    0,
    children,
    -1
  )?.type === "RestElement");
  let content;
  if (parts.length === 0) {
    content = group(["{", printDanglingCommentsInList(path, options2), "}", printOptionalToken(path), printTypeAnnotationProperty(path, print3)]);
  } else {
    const spacing = options2.bracketSpacing ? line : softline;
    content = ["{", indent([spacing, ...parts]), canHaveTrailingSeparator ? printTrailingComma(options2) : "", spacing, "}", printOptionalToken(path), printTypeAnnotationProperty(path, print3)];
  }
  if (path.match((node2) => node2.type === "ObjectPattern" && !is_non_empty_array_default(node2.decorators), shouldHugTheOnlyParameter) || isObjectType(node) && (path.match(void 0, (node2, name) => name === "typeAnnotation", (node2, name) => name === "typeAnnotation", shouldHugTheOnlyParameter) || path.match(void 0, (node2, name) => node2.type === "FunctionTypeParam" && name === "typeAnnotation", shouldHugTheOnlyParameter)) || // Assignment printing logic (printAssignment) is responsible
  // for adding a group if needed
  !shouldBreak && path.match((node2) => node2.type === "ObjectPattern", (node2) => node2.type === "AssignmentExpression" || node2.type === "VariableDeclarator")) {
    return content;
  }
  return group(content, {
    shouldBreak
  });
}
function hasNewLineAfterOpeningBrace(node, firstProperty, options2) {
  const text = options2.originalText;
  const firstPropertyStart = locStart(firstProperty);
  let openingBraceIndex = locStart(node);
  if (isPrintingImportAttributes(node)) {
    openingBraceIndex = stripComments(options2).lastIndexOf("{", firstPropertyStart);
    if (false) {
      noop_default(openingBraceIndex !== -1);
    }
  }
  if (false) {
    noop_default(text.charAt(openingBraceIndex), "{");
  }
  return has_newline_in_range_default(text, openingBraceIndex, firstPropertyStart);
}

// src/language-js/print/module.js
function printImportDeclaration(path, options2, print3) {
  const { node } = path;
  return [
    "import",
    node.phase ? ` ${node.phase}` : "",
    printImportKind(node),
    printModuleSpecifiers(path, options2, print3),
    printModuleSource(path, options2, print3),
    printImportAttributes(path, options2, print3),
    printSemicolon(options2)
  ];
}
var isDefaultExport = (node) => node.type === "ExportDefaultDeclaration" || node.type === "DeclareExportDeclaration" && node.default;
function printExportDeclaration(path, options2, print3) {
  const { node } = path;
  const parts = [
    printDecoratorsBeforeExport(path, options2, print3),
    printDeclareToken(path),
    "export",
    isDefaultExport(node) ? " default" : ""
  ];
  const { declaration, exported } = node;
  if (hasComment(node, CommentCheckFlags.Dangling)) {
    parts.push(" ", printDanglingComments(path, options2));
    if (needsHardlineAfterDanglingComment(node)) {
      parts.push(hardline);
    }
  }
  if (declaration) {
    parts.push(" ", print3("declaration"));
  } else {
    parts.push(printExportKind(node));
    if (node.type === "ExportAllDeclaration" || node.type === "DeclareExportAllDeclaration") {
      parts.push(" *");
      if (exported) {
        parts.push(" as ", print3("exported"));
      }
    } else {
      parts.push(printModuleSpecifiers(path, options2, print3));
    }
    parts.push(
      printModuleSource(path, options2, print3),
      printImportAttributes(path, options2, print3)
    );
  }
  parts.push(printSemicolonAfterExportDeclaration(node, options2));
  return parts;
}
var shouldOmitSemicolon = createTypeCheckFunction([
  "ClassDeclaration",
  "ComponentDeclaration",
  "FunctionDeclaration",
  "TSInterfaceDeclaration",
  "DeclareClass",
  "DeclareComponent",
  "DeclareFunction",
  "DeclareHook",
  "HookDeclaration",
  "TSDeclareFunction",
  "EnumDeclaration"
]);
function printSemicolonAfterExportDeclaration(node, options2) {
  if (!node.declaration || isDefaultExport(node) && !shouldOmitSemicolon(node.declaration)) {
    return printSemicolon(options2);
  }
  return "";
}
function printImportOrExportKind(kind, spaceBeforeKind = true) {
  return kind && kind !== "value" ? `${spaceBeforeKind ? " " : ""}${kind}${spaceBeforeKind ? "" : " "}` : "";
}
function printImportKind(node, spaceBeforeKind) {
  return printImportOrExportKind(node.importKind, spaceBeforeKind);
}
function printExportKind(node) {
  return printImportOrExportKind(node.exportKind);
}
function printModuleSource(path, options2, print3) {
  const { node } = path;
  if (!node.source) {
    return "";
  }
  return [
    shouldPrintSpecifiers(node, options2) ? " from" : "",
    " ",
    print3("source")
  ];
}
function printModuleSpecifiers(path, options2, print3) {
  const { node } = path;
  if (!shouldPrintSpecifiers(node, options2)) {
    return "";
  }
  const parts = [" "];
  if (is_non_empty_array_default(node.specifiers)) {
    const standaloneSpecifiers = [];
    const groupedSpecifiers = [];
    path.each(() => {
      const specifierType = path.node.type;
      if (specifierType === "ExportNamespaceSpecifier" || specifierType === "ExportDefaultSpecifier" || specifierType === "ImportNamespaceSpecifier" || specifierType === "ImportDefaultSpecifier") {
        standaloneSpecifiers.push(print3());
      } else if (specifierType === "ExportSpecifier" || specifierType === "ImportSpecifier") {
        groupedSpecifiers.push(print3());
      } else {
        throw new unexpected_node_error_default(node, "specifier");
      }
    }, "specifiers");
    parts.push(join(", ", standaloneSpecifiers));
    if (groupedSpecifiers.length > 0) {
      if (standaloneSpecifiers.length > 0) {
        parts.push(", ");
      }
      const canBreak2 = groupedSpecifiers.length > 1 || standaloneSpecifiers.length > 0 || node.specifiers.some((node2) => hasComment(node2));
      if (canBreak2) {
        parts.push(
          group([
            "{",
            indent([
              options2.bracketSpacing ? line : softline,
              join([",", line], groupedSpecifiers)
            ]),
            printTrailingComma(options2),
            options2.bracketSpacing ? line : softline,
            "}"
          ])
        );
      } else {
        parts.push([
          "{",
          options2.bracketSpacing ? " " : "",
          ...groupedSpecifiers,
          options2.bracketSpacing ? " " : "",
          "}"
        ]);
      }
    }
  } else {
    parts.push("{}");
  }
  return parts;
}
function shouldPrintSpecifiers(node, options2) {
  if (node.type !== "ImportDeclaration" || is_non_empty_array_default(node.specifiers) || node.importKind === "type") {
    return true;
  }
  const text = stripComments(options2).slice(
    locStart(node),
    locStart(node.source)
  );
  return text.trimEnd().endsWith("from");
}
function getImportAttributesKeyword(node, options2) {
  const textBetweenSourceAndAttributes = stripComments(options2).slice(
    locEnd(node.source),
    node.attributes?.[0] ? locStart(node.attributes[0]) : locEnd(node)
  ).trimStart();
  if (textBetweenSourceAndAttributes.startsWith("assert")) {
    return "assert";
  }
  if (textBetweenSourceAndAttributes.startsWith("with")) {
    return "with";
  }
  return is_non_empty_array_default(node.attributes) ? "with" : void 0;
}
var isSingleTypeImportAttributes = (node) => {
  const { attributes } = node;
  if (attributes.length !== 1) {
    return false;
  }
  const [attribute] = attributes;
  const { type, key, value } = attribute;
  return type === "ImportAttribute" && (key.type === "Identifier" && key.name === "type" || isStringLiteral(key) && key.value === "type") && isStringLiteral(value) && !hasComment(attribute) && !hasComment(key) && !hasComment(value);
};
function printImportAttributes(path, options2, print3) {
  const { node } = path;
  if (!node.source) {
    return "";
  }
  const keyword = getImportAttributesKeyword(node, options2);
  if (!keyword) {
    return "";
  }
  let attributesDoc = printObject(path, options2, print3);
  if (isSingleTypeImportAttributes(node)) {
    attributesDoc = removeLines(attributesDoc);
  }
  return [` ${keyword} `, attributesDoc];
}
function printModuleSpecifier(path, options2, print3) {
  const { node } = path;
  const { type } = node;
  const isImportSpecifier = type.startsWith("Import");
  const leftSideProperty = isImportSpecifier ? "imported" : "local";
  const rightSideProperty = isImportSpecifier ? "local" : "exported";
  const leftSideNode = node[leftSideProperty];
  const rightSideNode = node[rightSideProperty];
  let left = "";
  let right = "";
  if (type === "ExportNamespaceSpecifier" || type === "ImportNamespaceSpecifier") {
    left = "*";
  } else if (leftSideNode) {
    left = print3(leftSideProperty);
  }
  if (rightSideNode && !isShorthandSpecifier(node)) {
    right = print3(rightSideProperty);
  }
  return [
    printImportOrExportKind(
      type === "ImportSpecifier" ? node.importKind : node.exportKind,
      /* spaceBeforeKind */
      false
    ),
    left,
    left && right ? " as " : "",
    right
  ];
}

// src/language-js/print/property.js
function printProperty(path, options2, print3) {
  const { node } = path;
  if (node.shorthand) {
    return print3("value");
  }
  return printAssignment(
    path,
    options2,
    print3,
    printKey(path, options2, print3),
    ":",
    "value"
  );
}

// src/language-js/print/rest-element.js
function printRestOrSpreadElement(path, print3) {
  return ["...", print3("argument"), printTypeAnnotationProperty(path, print3)];
}

// src/language-js/print/return-statement.js
function printReturnOrThrowArgument(path, options2, print3) {
  const { node } = path;
  const argumentDoc = print3();
  if (returnArgumentHasLeadingComment(node, options2)) {
    return ["(", indent([hardline, argumentDoc]), hardline, ")"];
  }
  if (isBinaryish(node) || options2.experimentalTernaries && node.type === "ConditionalExpression" && (node.consequent.type === "ConditionalExpression" || node.alternate.type === "ConditionalExpression")) {
    return group([
      ifBreak("("),
      indent([softline, argumentDoc]),
      softline,
      ifBreak(")")
    ]);
  }
  return argumentDoc;
}
function printReturnOrThrowStatement(path, options2, print3) {
  const { node } = path;
  return [
    node.type === "ThrowStatement" ? "throw" : "return",
    node.argument ? [
      " ",
      path.call(
        () => printReturnOrThrowArgument(path, options2, print3),
        "argument"
      )
    ] : "",
    printSemicolon(options2)
  ];
}

// src/language-js/print/sequence-expression.js
function shouldIndentSequenceExpression(path, options2) {
  const { key, parent } = path;
  if (key === "argument" && isReturnOrThrowStatement(parent) && needs_parentheses_default(path, options2)) {
    return true;
  }
  if (key === "body" && parent.type === "ArrowFunctionExpression") {
    return true;
  }
  return false;
}
function printSequenceExpression(path, options2, print3) {
  const { parent } = path;
  if (parent.type === "ExpressionStatement" || parent.type === "ForStatement") {
    const parts2 = [];
    path.each(({ isFirst }) => {
      if (isFirst) {
        parts2.push(print3());
      } else {
        parts2.push(",", indent([line, print3()]));
      }
    }, "expressions");
    return group(parts2);
  }
  const parts = join([",", line], path.map(print3, "expressions"));
  if (shouldIndentSequenceExpression(path, options2)) {
    return group(ifBreak([indent([softline, parts]), softline], parts));
  }
  return group(parts);
}

// src/language-js/print/switch-statement.js
function printSwitchStatement(path, options2, print3) {
  return [
    group([
      "switch (",
      indent([softline, print3("discriminant")]),
      softline,
      ")"
    ]),
    " {",
    path.node.cases.length > 0 ? indent([
      hardline,
      join(
        hardline,
        path.map(
          ({ node, isLast }) => [
            print3(),
            !isLast && isNextLineEmpty2(node, options2) ? hardline : ""
          ],
          "cases"
        )
      )
    ]) : printDanglingComments(path, options2, { indent: true }),
    hardline,
    "}"
  ];
}
function printSwitchCase(path, options2, print3) {
  const { node } = path;
  const parts = [];
  if (node.test) {
    parts.push("case ", print3("test"), ":");
  } else {
    parts.push("default:");
  }
  if (hasComment(node, CommentCheckFlags.Dangling)) {
    parts.push(" ", printDanglingComments(path, options2));
  }
  const consequent = node.consequent.filter(
    (node2) => node2.type !== "EmptyStatement"
  );
  if (consequent.length > 0) {
    const cons = printStatementSequence(path, options2, print3, "consequent");
    parts.push(
      consequent.length === 1 && consequent[0].type === "BlockStatement" ? [" ", cons] : indent([hardline, cons])
    );
  }
  return parts;
}

// src/language-js/utilities/is-simple-expression-by-node-count.js
function getExpressionInnerNodeCount(node, maxCount) {
  let count = 0;
  for (const k in node) {
    const prop = node[k];
    if (is_object_default(prop) && typeof prop.type === "string") {
      count++;
      count += getExpressionInnerNodeCount(prop, maxCount - count);
    }
    if (count > maxCount) {
      return count;
    }
  }
  return count;
}
function isSimpleExpressionByNodeCount(node, maxInnerNodeCount = 5) {
  const count = getExpressionInnerNodeCount(node, maxInnerNodeCount);
  return count <= maxInnerNodeCount;
}

// src/language-js/print/ternary-old.js
function conditionalExpressionChainContainsJsx(node) {
  const conditionalExpressions = [node];
  for (let index = 0; index < conditionalExpressions.length; index++) {
    const conditionalExpression = conditionalExpressions[index];
    for (const property of ["test", "consequent", "alternate"]) {
      const node2 = conditionalExpression[property];
      if (isJsxElement(node2)) {
        return true;
      }
      if (node2.type === "ConditionalExpression") {
        conditionalExpressions.push(node2);
      }
    }
  }
  return false;
}
function printTernaryTest(path, options2, print3) {
  const { node } = path;
  const isConditionalExpression = node.type === "ConditionalExpression";
  const alternateNodePropertyName = isConditionalExpression ? "alternate" : "falseType";
  const { parent } = path;
  const printed = isConditionalExpression ? print3("test") : [print3("checkType"), " ", "extends", " ", print3("extendsType")];
  if (parent.type === node.type && parent[alternateNodePropertyName] === node) {
    return align(2, printed);
  }
  return printed;
}
var ancestorNameMap = /* @__PURE__ */ new Map([
  ["AssignmentExpression", "right"],
  ["VariableDeclarator", "init"],
  ["ReturnStatement", "argument"],
  ["ThrowStatement", "argument"],
  ["UnaryExpression", "argument"],
  ["YieldExpression", "argument"],
  ["AwaitExpression", "argument"]
]);
function shouldExtraIndentForConditionalExpression(path) {
  const { node } = path;
  if (node.type !== "ConditionalExpression") {
    return false;
  }
  let parent;
  let child = node;
  for (let ancestorCount = 0; !parent; ancestorCount++) {
    const node2 = path.getParentNode(ancestorCount);
    if (isChainElementWrapper(node2) && node2.expression === child || isCallExpression(node2) && node2.callee === child || isMemberExpression(node2) && node2.object === child) {
      child = node2;
      continue;
    }
    if (node2.type === "NewExpression" && node2.callee === child || isBinaryCastExpression(node2) && node2.expression === child) {
      parent = path.getParentNode(ancestorCount + 1);
      child = node2;
    } else {
      parent = node2;
    }
  }
  if (child === node) {
    return false;
  }
  return parent[ancestorNameMap.get(parent.type)] === child;
}
function printTernaryOld(path, options2, print3) {
  const { node } = path;
  const isConditionalExpression = node.type === "ConditionalExpression";
  const consequentNodePropertyName = isConditionalExpression ? "consequent" : "trueType";
  const alternateNodePropertyName = isConditionalExpression ? "alternate" : "falseType";
  const testNodePropertyNames = isConditionalExpression ? ["test"] : ["checkType", "extendsType"];
  const consequentNode = node[consequentNodePropertyName];
  const alternateNode = node[alternateNodePropertyName];
  const parts = [];
  let jsxMode = false;
  const { parent } = path;
  const isParentTest = parent.type === node.type && testNodePropertyNames.some((prop) => parent[prop] === node);
  let forceNoIndent = parent.type === node.type && !isParentTest;
  let currentParent;
  let previousParent;
  let i = 0;
  do {
    previousParent = currentParent || node;
    currentParent = path.getParentNode(i);
    i++;
  } while (currentParent && currentParent.type === node.type && testNodePropertyNames.every(
    (prop) => currentParent[prop] !== previousParent
  ));
  const firstNonConditionalParent = currentParent || parent;
  const lastConditionalParent = previousParent;
  if (isConditionalExpression && (isJsxElement(node[testNodePropertyNames[0]]) || isJsxElement(consequentNode) || isJsxElement(alternateNode) || conditionalExpressionChainContainsJsx(lastConditionalParent))) {
    jsxMode = true;
    forceNoIndent = true;
    const wrap = (doc) => [
      ifBreak("("),
      indent([softline, doc]),
      softline,
      ifBreak(")")
    ];
    const isNil = (node2) => node2.type === "NullLiteral" || node2.type === "Literal" && node2.value === null || node2.type === "Identifier" && node2.name === "undefined";
    parts.push(
      " ? ",
      isNil(consequentNode) ? print3(consequentNodePropertyName) : wrap(print3(consequentNodePropertyName)),
      " : ",
      alternateNode.type === node.type || isNil(alternateNode) ? print3(alternateNodePropertyName) : wrap(print3(alternateNodePropertyName))
    );
  } else {
    const printBranch = (nodePropertyName) => options2.useTabs ? indent(print3(nodePropertyName)) : align(2, print3(nodePropertyName));
    const part = [
      line,
      "? ",
      consequentNode.type === node.type ? ifBreak("", "(") : "",
      printBranch(consequentNodePropertyName),
      consequentNode.type === node.type ? ifBreak("", ")") : "",
      line,
      ": ",
      printBranch(alternateNodePropertyName)
    ];
    parts.push(
      parent.type !== node.type || parent[alternateNodePropertyName] === node || isParentTest ? part : options2.useTabs ? dedent(indent(part)) : align(Math.max(0, options2.tabWidth - 2), part)
    );
  }
  const maybeGroup = (doc) => parent === firstNonConditionalParent ? group(doc) : doc;
  const breakClosingParen = !jsxMode && (isMemberExpression(parent) || parent.type === "NGPipeExpression" && parent.left === node) && !parent.computed;
  const shouldExtraIndent = shouldExtraIndentForConditionalExpression(path);
  const result = maybeGroup([
    printTernaryTest(path, options2, print3),
    forceNoIndent ? parts : indent(parts),
    isConditionalExpression && breakClosingParen && !shouldExtraIndent ? softline : ""
  ]);
  return isParentTest || shouldExtraIndent ? group([indent([softline, result]), softline]) : result;
}

// src/language-js/print/ternary.js
function shouldBreakClosingParen(node, parent) {
  return (isMemberExpression(parent) || parent.type === "NGPipeExpression" && parent.left === node) && !parent.computed;
}
function hasMultilineBlockComments(testNodes, consequentNode, alternateNode, options2) {
  const comments = [
    ...testNodes.map((node) => getComments(node)),
    getComments(consequentNode),
    getComments(alternateNode)
  ].flat();
  return comments.some(
    (comment) => isBlockComment(comment) && has_newline_in_range_default(
      options2.originalText,
      locStart(comment),
      locEnd(comment)
    )
  );
}
var ancestorNameMap2 = /* @__PURE__ */ new Map([
  ["AssignmentExpression", "right"],
  ["VariableDeclarator", "init"],
  ["ReturnStatement", "argument"],
  ["ThrowStatement", "argument"],
  ["UnaryExpression", "argument"],
  ["YieldExpression", "argument"],
  ["AwaitExpression", "argument"]
]);
function shouldExtraIndentForConditionalExpression2(path) {
  const { node } = path;
  if (node.type !== "ConditionalExpression") {
    return false;
  }
  let parent;
  let child = node;
  for (let ancestorCount = 0; !parent; ancestorCount++) {
    const node2 = path.getParentNode(ancestorCount);
    if (isChainElementWrapper(node2) && node2.expression === child || isCallExpression(node2) && node2.callee === child || isMemberExpression(node2) && node2.object === child) {
      child = node2;
      continue;
    }
    if (node2.type === "NewExpression" && node2.callee === child || isBinaryCastExpression(node2) && node2.expression === child) {
      parent = path.getParentNode(ancestorCount + 1);
      child = node2;
    } else {
      parent = node2;
    }
  }
  if (child === node) {
    return false;
  }
  return parent[ancestorNameMap2.get(parent.type)] === child;
}
var wrapInParens = (doc) => [
  ifBreak("("),
  indent([softline, doc]),
  softline,
  ifBreak(")")
];
function printTernary(path, options2, print3, args) {
  if (!options2.experimentalTernaries) {
    return printTernaryOld(path, options2, print3);
  }
  const { node } = path;
  const isConditionalExpression = node.type === "ConditionalExpression";
  const isTSConditional = isConditionalType(node);
  const consequentNodePropertyName = isConditionalExpression ? "consequent" : "trueType";
  const alternateNodePropertyName = isConditionalExpression ? "alternate" : "falseType";
  const testNodePropertyNames = isConditionalExpression ? ["test"] : ["checkType", "extendsType"];
  const consequentNode = node[consequentNodePropertyName];
  const alternateNode = node[alternateNodePropertyName];
  const testNodes = testNodePropertyNames.map((prop) => node[prop]);
  const { parent } = path;
  const isParentTernary = parent.type === node.type;
  const isInTest = isParentTernary && testNodePropertyNames.some((prop) => parent[prop] === node);
  const isInAlternate = isParentTernary && parent[alternateNodePropertyName] === node;
  const isConsequentTernary = consequentNode.type === node.type;
  const isAlternateTernary = alternateNode.type === node.type;
  const isInChain = isAlternateTernary || isInAlternate;
  const isBigTabs = options2.tabWidth > 2 || options2.useTabs;
  let currentParent;
  let previousParent;
  let i = 0;
  do {
    previousParent = currentParent || node;
    currentParent = path.getParentNode(i);
    i++;
  } while (currentParent && currentParent.type === node.type && testNodePropertyNames.every(
    (prop) => currentParent[prop] !== previousParent
  ));
  const firstNonConditionalParent = currentParent || parent;
  const isOnSameLineAsAssignment = args && args.assignmentLayout && args.assignmentLayout !== "break-after-operator" && (parent.type === "AssignmentExpression" || parent.type === "VariableDeclarator" || parent.type === "ClassProperty" || parent.type === "PropertyDefinition" || parent.type === "ClassPrivateProperty" || parent.type === "ObjectProperty" || parent.type === "Property");
  const isOnSameLineAsReturn = isReturnOrThrowStatement(parent) && !(isConsequentTernary || isAlternateTernary);
  const isInJsx = isConditionalExpression && firstNonConditionalParent.type === "JSXExpressionContainer" && path.grandparent.type !== "JSXAttribute";
  const shouldExtraIndent = shouldExtraIndentForConditionalExpression2(path);
  const breakClosingParen = shouldBreakClosingParen(node, parent);
  const breakTSClosingParen = isTSConditional && needs_parentheses_default(path, options2);
  const fillTab = !isBigTabs ? "" : options2.useTabs ? "	" : " ".repeat(options2.tabWidth - 1);
  const shouldBreak = hasMultilineBlockComments(
    testNodes,
    consequentNode,
    alternateNode,
    options2
  ) || isConsequentTernary || isAlternateTernary;
  const tryToParenthesizeAlternate = !isInChain && !isParentTernary && !isTSConditional && (isInJsx ? (
    // In JSX, we want this with a null-consequent to mirror booleans:
    //
    //   {!foo ? null : (
    //     something.else()
    //   )}
    //
    // But not in the general case, where it's (subjectively) better to have things multiline.
    consequentNode.type === "NullLiteral" || consequentNode.type === "Literal" && consequentNode.value === null
  ) : (
    // Right now, we do this when:
    // 1. The test is simple and,
    // 2. The consequent is short.
    // This heuristic could probably be refined over time, but felt right after moderate amounts of tinkering.
    isLoneShortArgument(consequentNode, options2) && isSimpleExpressionByNodeCount(node.test, 3)
  ));
  const shouldGroupTestAndConsequent = isInChain || isInAlternate || isTSConditional && !isParentTernary || isParentTernary && isConditionalExpression && isSimpleExpressionByNodeCount(node.test, 1) || tryToParenthesizeAlternate;
  const alternateComments = [];
  if (hasComment(node.test, CommentCheckFlags.Dangling)) {
    path.call(() => {
      alternateComments.push(printDanglingComments(path, options2));
    }, "test");
  }
  if (hasComment(node, CommentCheckFlags.Dangling)) {
    alternateComments.push(printDanglingComments(path, options2));
  }
  const testId = /* @__PURE__ */ Symbol("test");
  const consequentId = /* @__PURE__ */ Symbol("consequent");
  const testAndConsequentId = /* @__PURE__ */ Symbol("test-and-consequent");
  const printedTest = isConditionalExpression ? [
    wrapInParens(print3("test")),
    node.test.type === "ConditionalExpression" ? breakParent : ""
  ] : [
    print3("checkType"),
    " ",
    "extends",
    " ",
    isConditionalType(node.extendsType) || node.extendsType.type === "TSMappedType" ? print3("extendsType") : group(wrapInParens(print3("extendsType")))
  ];
  const printedTestWithQuestionMark = group([printedTest, " ?"], {
    id: testId
  });
  const printedConsequent = print3(consequentNodePropertyName);
  const consequent = indent([
    isConsequentTernary || isInJsx && (isJsxElement(consequentNode) || isParentTernary || isInChain) ? hardline : line,
    printedConsequent
  ]);
  const printedTestAndConsequent = shouldGroupTestAndConsequent ? group(
    [
      printedTestWithQuestionMark,
      // Avoid indenting consequent if it isn't a chain, even if the test breaks.
      isInChain ? consequent : (
        // If the test breaks, also break the consequent
        ifBreak(consequent, group(consequent, { id: consequentId }), {
          groupId: testId
        })
      )
    ],
    { id: testAndConsequentId }
  ) : [printedTestWithQuestionMark, consequent];
  const printedAlternate = print3(alternateNodePropertyName);
  const printedAlternateWithParens = tryToParenthesizeAlternate ? ifBreak(printedAlternate, dedent(wrapInParens(printedAlternate)), {
    groupId: testAndConsequentId
  }) : printedAlternate;
  const parts = [
    printedTestAndConsequent,
    alternateComments.length > 0 ? [indent([hardline, alternateComments]), hardline] : isAlternateTernary ? hardline : tryToParenthesizeAlternate ? ifBreak(line, " ", { groupId: testAndConsequentId }) : line,
    ":",
    isAlternateTernary || !isBigTabs ? " " : shouldGroupTestAndConsequent ? ifBreak(
      fillTab,
      ifBreak(
        isInChain || tryToParenthesizeAlternate ? " " : fillTab,
        " "
      ),
      { groupId: testAndConsequentId }
    ) : ifBreak(fillTab, " "),
    isAlternateTernary ? printedAlternateWithParens : group([
      indent(printedAlternateWithParens),
      isInJsx && !tryToParenthesizeAlternate ? softline : ""
    ]),
    breakClosingParen && !shouldExtraIndent ? softline : "",
    shouldBreak ? breakParent : ""
  ];
  const result = isOnSameLineAsAssignment && !shouldBreak ? (
    // We try to preserve the case of a single-line ternary bumped to the line after assignment:
    //
    //   const foo =
    //     cond ? result : otherwise;
    //
    // However, this sadly means that tests are always shunted to the next line in this case,
    // which I'm ambivalent about but some people like keeping on the same line as the assignment.
    group(indent([softline, group(parts)]))
  ) : isOnSameLineAsAssignment || isOnSameLineAsReturn ? group(indent(parts)) : shouldExtraIndent || isTSConditional && isInTest ? group([
    indent([softline, parts]),
    breakTSClosingParen ? softline : ""
  ]) : parent === firstNonConditionalParent ? group(parts) : parts;
  return result;
}

// src/language-js/print/try-statement.js
function printTryStatement(path, options2, print3) {
  const { node } = path;
  return [
    "try ",
    print3("block"),
    node.handler ? [" ", print3("handler")] : "",
    node.finalizer ? [" finally ", print3("finalizer")] : ""
  ];
}
function printCatchClause(path, options2, print3) {
  const { node } = path;
  if (node.param) {
    const parameterHasComments = hasComment(
      node.param,
      (comment) => !isBlockComment(comment) || comment.leading && has_newline_default(options2.originalText, locEnd(comment)) || comment.trailing && has_newline_default(options2.originalText, locStart(comment), {
        backwards: true
      })
    );
    const param = print3("param");
    return [
      "catch ",
      parameterHasComments ? ["(", indent([softline, param]), softline, ") "] : ["(", param, ") "],
      print3("body")
    ];
  }
  return ["catch ", print3("body")];
}

// src/language-js/print/variable-declaration.js
function printVariableDeclaration(path, options2, print3) {
  const { node } = path;
  const printed = path.map(print3, "declarations");
  const isForXStatementInitializer = path.key === "init" && path.parent.type === "ForStatement" || path.key === "left" && (path.parent.type === "ForInStatement" || path.parent.type === "ForOfStatement");
  const hasValue = node.declarations.some((declarator) => declarator.init);
  let firstVariable;
  if (printed.length === 1 && !hasComment(node.declarations[0])) {
    firstVariable = printed[0];
  } else {
    firstVariable = indent(printed[0]);
  }
  return group([
    printDeclareToken(path),
    node.kind,
    firstVariable ? [" ", firstVariable] : "",
    indent(
      printed.slice(1).map((doc) => [
        ",",
        hasValue && !isForXStatementInitializer ? hardline : line,
        doc
      ])
    ),
    isForXStatementInitializer ? "" : printSemicolon(options2)
  ]);
}

// src/language-js/print/while-statement.js
function printWhileStatement(path, options2, print3) {
  const { node } = path;
  const keyword = node.type === "WithStatement" ? "with" : "while";
  return group([
    keyword,
    " (",
    printIfOrWhileConditionOrWithStatementObject(path, options2, print3),
    ")",
    printClause(path, options2, print3)
  ]);
}

// src/language-js/print/estree.js
function printEstree(path, options2, print3, args) {
  const { node } = path;
  if (isLiteral(node)) {
    return printLiteral(path, options2);
  }
  switch (node.type) {
    case "JsExpressionRoot":
      return print3("node");
    case "JsonRoot":
      return [printDanglingComments(path, options2), print3("node"), hardline];
    // Babel extension.
    case "File":
      return printHtmlBinding(path, options2, print3) ?? print3("program");
    case "ExpressionStatement":
      return printExpressionStatement(path, options2, print3);
    case "ChainExpression":
      return print3("expression");
    // Babel non-standard node. Used for Closure-style type casts. See postprocess.js.
    case "ParenthesizedExpression": {
      const shouldHug = !hasComment(node.expression) && (isObjectExpression(node.expression) || isArrayExpression(node.expression));
      if (shouldHug) {
        return ["(", print3("expression"), ")"];
      }
      return group([
        "(",
        indent([softline, print3("expression")]),
        softline,
        ")"
      ]);
    }
    case "AssignmentExpression":
      return printAssignmentExpression(path, options2, print3);
    case "VariableDeclarator":
      return printVariableDeclarator(path, options2, print3);
    case "BinaryExpression":
    case "LogicalExpression":
      return printBinaryishExpression(path, options2, print3);
    case "AssignmentPattern":
      return [print3("left"), " = ", print3("right")];
    case "OptionalMemberExpression":
    case "MemberExpression":
      return printMemberExpression(path, options2, print3);
    case "MetaProperty":
      return [print3("meta"), ".", print3("property")];
    case "BindExpression":
      return printBindExpression(path, options2, print3);
    case "Identifier":
      return [
        node.name,
        printOptionalToken(path),
        printDefiniteToken(path),
        printTypeAnnotationProperty(path, print3)
      ];
    case "V8IntrinsicIdentifier":
      return ["%", node.name];
    case "SpreadElement":
      return printRestOrSpreadElement(path, print3);
    case "RestElement":
      return printRestOrSpreadElement(path, print3);
    case "FunctionDeclaration":
    case "FunctionExpression":
      return printFunction(path, options2, print3, args);
    case "ArrowFunctionExpression":
      return printArrowFunction(path, options2, print3, args);
    case "YieldExpression":
      return [
        `yield${node.delegate ? "*" : ""}`,
        node.argument ? [" ", print3("argument")] : ""
      ];
    case "AwaitExpression":
      return printAwaitExpression(path, options2, print3);
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
    case "ExportAllDeclaration":
      return printExportDeclaration(path, options2, print3);
    case "ImportDeclaration":
      return printImportDeclaration(path, options2, print3);
    case "ImportSpecifier":
    case "ExportSpecifier":
    case "ImportNamespaceSpecifier":
    case "ExportNamespaceSpecifier":
    case "ImportDefaultSpecifier":
    case "ExportDefaultSpecifier":
      return printModuleSpecifier(path, options2, print3);
    case "ImportAttribute":
      return printProperty(path, options2, print3);
    case "Program":
    case "BlockStatement":
    case "StaticBlock":
      return printBlock(path, options2, print3);
    case "ClassBody":
      return printClassBody(path, options2, print3);
    case "ThrowStatement":
      return printReturnOrThrowStatement(path, options2, print3);
    case "ReturnStatement":
      return printReturnOrThrowStatement(path, options2, print3);
    case "NewExpression":
    case "ImportExpression":
    case "OptionalCallExpression":
    case "CallExpression":
      return printCallExpression(path, options2, print3);
    case "ObjectExpression":
    case "ObjectPattern":
      return printObject(path, options2, print3);
    case "Property":
      if (isMethod(node)) {
        return printMethod(path, options2, print3);
      }
      return printProperty(path, options2, print3);
    // Babel
    case "ObjectProperty":
      return printProperty(path, options2, print3);
    // Babel
    case "ObjectMethod":
      return printMethod(path, options2, print3);
    case "Decorator":
      return ["@", print3("expression")];
    case "ArrayExpression":
    case "ArrayPattern":
      return printArray(path, options2, print3);
    case "SequenceExpression":
      return printSequenceExpression(path, options2, print3);
    case "ThisExpression":
      return "this";
    case "Super":
      return "super";
    case "Directive":
      return [print3("value"), printSemicolon(options2)];
    case "UnaryExpression": {
      const parts = [node.operator];
      if (/[a-z]$/.test(node.operator)) {
        parts.push(" ");
      }
      const argumentDoc = print3("argument");
      if (hasComment(node.argument)) {
        parts.push(
          group(["(", indent([softline, argumentDoc]), softline, ")"])
        );
      } else {
        parts.push(argumentDoc);
      }
      return parts;
    }
    case "UpdateExpression":
      return [
        node.prefix ? node.operator : "",
        print3("argument"),
        node.prefix ? "" : node.operator
      ];
    case "ConditionalExpression":
      return printTernary(path, options2, print3, args);
    case "VariableDeclaration":
      return printVariableDeclaration(path, options2, print3);
    case "IfStatement":
      return printIfStatement(path, options2, print3);
    case "ForStatement":
      return printForStatement(path, options2, print3);
    case "WithStatement":
    case "WhileStatement":
      return printWhileStatement(path, options2, print3);
    case "DoWhileStatement":
      return printDoWhileStatement(path, options2, print3);
    case "ForInStatement":
    case "ForOfStatement":
      return printForXStatement(path, options2, print3);
    case "DoExpression":
      return [node.async ? "async " : "", "do ", print3("body")];
    case "BreakStatement":
    case "ContinueStatement":
      return [
        node.type === "BreakStatement" ? "break" : "continue",
        node.label ? [" ", print3("label")] : "",
        printSemicolon(options2)
      ];
    case "LabeledStatement":
      return [
        print3("label"),
        `:${node.body.type === "EmptyStatement" && !hasComment(node.body, CommentCheckFlags.Leading) ? "" : " "}`,
        print3("body")
      ];
    case "TryStatement":
      return printTryStatement(path, options2, print3);
    case "CatchClause":
      return printCatchClause(path, options2, print3);
    case "SwitchStatement":
      return printSwitchStatement(path, options2, print3);
    case "SwitchCase":
      return printSwitchCase(path, options2, print3);
    case "DebuggerStatement":
      return ["debugger", printSemicolon(options2)];
    case "ClassDeclaration":
    case "ClassExpression":
      return printClass(path, options2, print3);
    case "ClassMethod":
    case "ClassPrivateMethod":
    case "MethodDefinition":
      return printClassMethod(path, options2, print3);
    case "ClassProperty":
    case "PropertyDefinition":
    case "ClassPrivateProperty":
    case "ClassAccessorProperty":
    case "AccessorProperty":
      return printClassProperty(path, options2, print3);
    case "TemplateElement":
      return replaceEndOfLine(node.value.raw);
    case "TemplateLiteral":
      return printTemplateLiteral(path, options2, print3);
    case "TaggedTemplateExpression":
      return printTaggedTemplateExpression(path, options2, print3);
    case "PrivateIdentifier":
      return ["#", node.name];
    case "PrivateName":
      return ["#", print3("id")];
    // For hack-style pipeline
    case "TopicReference":
      return "%";
    case "ArgumentPlaceholder":
      return "?";
    case "ModuleExpression":
      return ["module ", print3("body")];
    case "VoidPattern":
      return "void";
    case "EmptyStatement":
      if (isMeaningfulEmptyStatement(path)) {
        return ";";
      }
    // Fall through
    case "InterpreterDirective":
    // Printed as comment
    default:
      throw new unexpected_node_error_default(node, "ESTree");
  }
}

// src/language-js/print/array-type.js
function printArrayType(print3) {
  return [print3("elementType"), "[]"];
}

// src/language-js/print/binary-cast-expression.js
function printBinaryCastExpression(path, options2, print3) {
  const { parent, node, key } = path;
  const isFlowAsConstExpression = node.type === "AsConstExpression";
  const typeAnnotationDoc = isFlowAsConstExpression ? "const" : print3("typeAnnotation");
  const parts = [
    print3("expression"),
    " ",
    isSatisfiesExpression(node) ? "satisfies" : "as",
    " ",
    typeAnnotationDoc
  ];
  if (key === "callee" && isCallOrNewExpression(parent) || key === "object" && isMemberExpression(parent)) {
    return group([indent([softline, ...parts]), softline]);
  }
  return parts;
}

// src/language-js/print/component.js
function printComponent(path, options2, print3) {
  const { node } = path;
  const parts = [
    printDeclareToken(path),
    node.async ? "async " : "",
    "component"
  ];
  if (node.id) {
    parts.push(" ", print3("id"));
  }
  parts.push(print3("typeParameters"));
  const parametersDoc = printFunctionParameters(path, options2, print3);
  if (node.rendersType) {
    parts.push(group([parametersDoc, " ", print3("rendersType")]));
  } else {
    parts.push(group([parametersDoc]));
  }
  if (node.body) {
    parts.push(" ", print3("body"));
  }
  if (node.type === "DeclareComponent") {
    parts.push(printSemicolon(options2));
  }
  return parts;
}
function printComponentParameter(path, options2, print3) {
  const { node } = path;
  if (node.shorthand) {
    return print3("local");
  }
  return [print3("name"), " as ", print3("local")];
}
function printComponentTypeParameter(path, options2, print3) {
  const { node } = path;
  const printed = [];
  if (node.name) {
    printed.push(print3("name"), node.optional ? "?: " : ": ");
  }
  printed.push(print3("typeAnnotation"));
  return printed;
}

// src/language-js/print/enum.js
function printFlowEnumBody(path, options2, print3) {
  const { node } = path;
  return [
    node.explicitType ? `of ${node.explicitType} ` : "",
    printObject(path, options2, print3)
  ];
}
function printLegacyFlowEnumBody(path, options2, print3) {
  const { node } = path;
  return [
    node.type === "EnumSymbolBody" || node.explicitType ? `of ${node.type.slice(
      // `Enum`
      4,
      // `Body`
      -4
    ).toLowerCase()} ` : "",
    printObject(path, options2, print3)
  ];
}
function printEnumMember(path, options2, print3) {
  const { node } = path;
  const isTsEnumMember2 = node.type === "TSEnumMember";
  const idDoc = isTsEnumMember2 ? printKey(path, options2, print3) : (
    // Flow only allow identifier
    print3("id")
  );
  const initializerProperty = isTsEnumMember2 ? "initializer" : "init";
  if (!node[initializerProperty]) {
    return idDoc;
  }
  return [idDoc, " = ", print3(initializerProperty)];
}
function printEnumDeclaration(path, print3) {
  const { node } = path;
  return [
    printDeclareToken(path),
    node.const ? "const " : "",
    "enum ",
    print3("id"),
    " ",
    print3("body")
  ];
}

// src/language-js/print/function-type.js
function printFunctionType(path, options2, print3) {
  const { node } = path;
  const parts = [
    // `TSConstructorType` only
    printAbstractToken(path)
  ];
  if (node.type === "TSConstructorType" || node.type === "TSConstructSignatureDeclaration") {
    parts.push("new ");
  }
  let parametersDoc = printFunctionParameters(
    path,
    options2,
    print3,
    /* shouldExpandParameters */
    false,
    /* shouldPrintTypeParameters */
    true
  );
  const returnTypeDoc = [];
  if (node.type === "FunctionTypeAnnotation") {
    returnTypeDoc.push(
      isFlowArrowFunctionTypeAnnotation(path) ? " => " : ": ",
      print3("returnType")
    );
  } else {
    returnTypeDoc.push(printTypeAnnotationProperty(path, print3, "returnType"));
  }
  if (shouldGroupFunctionParameters(node, returnTypeDoc)) {
    parametersDoc = group(parametersDoc);
  }
  parts.push(parametersDoc, returnTypeDoc);
  return [
    group(parts),
    node.type === "TSConstructSignatureDeclaration" || node.type === "TSCallSignatureDeclaration" ? printClassMemberSemicolon(path, options2) : ""
  ];
}
function isFlowArrowFunctionTypeAnnotation(path) {
  const { node, parent } = path;
  return node.type === "FunctionTypeAnnotation" && (isFlowObjectTypePropertyAFunction(parent) || !((parent.type === "ObjectTypeProperty" || parent.type === "ObjectTypeInternalSlot") && !parent.variance && !parent.optional && hasSameLocStart(parent, node) || parent.type === "ObjectTypeCallProperty" || path.getParentNode(2)?.type === "DeclareFunction"));
}

// src/language-js/print/hook.js
function printDeclareHook(path, options2, print3) {
  return [
    printDeclareToken(path),
    "hook",
    path.node.id ? [" ", print3("id")] : "",
    printSemicolon(options2)
  ];
}
function isDeclareHookTypeAnnotation(path) {
  const { node } = path;
  return node.type === "HookTypeAnnotation" && path.getParentNode(2)?.type === "DeclareHook";
}
function printHookTypeAnnotation(path, options2, print3) {
  const { node } = path;
  const parametersDoc = printFunctionParameters(
    path,
    options2,
    print3,
    /* shouldExpandParameters */
    false,
    /* shouldPrintTypeParameters */
    true
  );
  const returnTypeDoc = [
    isDeclareHookTypeAnnotation(path) ? ": " : " => ",
    print3("returnType")
  ];
  return group([
    isDeclareHookTypeAnnotation(path) ? "" : "hook ",
    shouldGroupFunctionParameters(node, returnTypeDoc) ? group(parametersDoc) : parametersDoc,
    returnTypeDoc
  ]);
}

// src/language-js/print/indexed-access-type.js
function printIndexedAccessType(path, options2, print3) {
  return [
    print3("objectType"),
    printOptionalToken(path),
    "[",
    print3("indexType"),
    "]"
  ];
}

// src/language-js/print/infer-type.js
function printInferType(path, options2, print3) {
  return ["infer ", print3("typeParameter")];
}

// src/language-js/print/intersection-type.js
function printIntersectionType(path, options2, print3) {
  let wasIndented = false;
  return group(
    path.map(({ isFirst, previous, node, index }) => {
      const doc = print3();
      if (isFirst) {
        return doc;
      }
      const currentIsObjectType = isObjectType(node);
      const previousIsObjectType = isObjectType(previous);
      if (previousIsObjectType && currentIsObjectType) {
        return [" & ", wasIndented ? indent(doc) : doc];
      }
      if (
        // If no object is involved, go to the next line if it breaks
        !previousIsObjectType && !currentIsObjectType || hasLeadingOwnLineComment(options2.originalText, node)
      ) {
        if (options2.experimentalOperatorPosition === "start") {
          return indent([line, "& ", doc]);
        }
        return indent([" &", line, doc]);
      }
      if (index > 1) {
        wasIndented = true;
      }
      return [" & ", index > 1 ? indent(doc) : doc];
    }, "types")
  );
}

// src/language-js/print/mapped-type.js
function printFlowMappedTypeOptionalModifier(optional) {
  switch (optional) {
    case null:
      return "";
    case "PlusOptional":
      return "+?";
    case "MinusOptional":
      return "-?";
    case "Optional":
      return "?";
  }
}
function printFlowMappedTypeProperty(path, options2, print3) {
  const {
    node
  } = path;
  return [group([node.variance ? print3("variance") : "", group(["[", indent([softline, print3("keyTparam"), " in ", print3("sourceType")]), softline, "]"]), printFlowMappedTypeOptionalModifier(node.optional), ": ", print3("propType")]), printClassMemberSemicolon(path, options2)];
}
function printTypeScriptMappedTypeModifier(tokenNode, keyword) {
  if (tokenNode === "+" || tokenNode === "-") {
    return tokenNode + keyword;
  }
  return keyword;
}
function printTypeScriptMappedType(path, options2, print3) {
  const {
    node
  } = path;
  let shouldBreak = false;
  if (options2.objectWrap === "preserve") {
    const text = stripComments(options2);
    const start = locStart(node) + 1;
    const textAfter = text.slice(start);
    const nextTokenIndex = start + textAfter.search(/\S/);
    if (has_newline_in_range_default(options2.originalText, start, nextTokenIndex)) {
      shouldBreak = true;
    }
  }
  const danglingCommentsDoc = [];
  const danglingComments = getComments(node, CommentCheckFlags.Dangling);
  if (danglingComments.length > 0) {
    const lastComment = method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      danglingComments,
      -1
    );
    const parts = (
      /** @type {Doc[]} */
      printDanglingComments(path, options2)
    );
    danglingCommentsDoc.push(...parts.slice(0, -1), group([method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      parts,
      -1
    ), isLineComment(lastComment) || has_newline_default(options2.originalText, locEnd(lastComment)) ? hardline : line]));
  }
  return group(["{", indent([options2.bracketSpacing ? line : softline, ...danglingCommentsDoc, node.readonly ? [printTypeScriptMappedTypeModifier(node.readonly, "readonly"), " "] : "", group(["[", indent([softline, print3("key"), " in ", print3("constraint"), node.nameType ? [" as ", print3("nameType")] : ""]), softline, "]"]), node.optional ? printTypeScriptMappedTypeModifier(node.optional, "?") : "", node.typeAnnotation ? ": " : "", print3("typeAnnotation"), options2.semi ? ifBreak(";") : ""]), options2.bracketSpacing ? line : softline, "}"], {
    shouldBreak
  });
}

// src/language-js/print/match.js
function printMatch(path, options2, print3) {
  const { node } = path;
  return [
    group(["match (", indent([softline, print3("argument")]), softline, ")"]),
    " {",
    node.cases.length > 0 ? indent([
      hardline,
      join(
        hardline,
        path.map(
          ({ node: node2, isLast }) => [
            print3(),
            !isLast && isNextLineEmpty2(node2, options2) ? hardline : ""
          ],
          "cases"
        )
      )
    ]) : "",
    hardline,
    "}"
  ];
}
function printMatchCase(path, options2, print3) {
  const { node } = path;
  const comment = hasComment(node, CommentCheckFlags.Dangling) ? [" ", printDanglingComments(path, options2)] : [];
  const body = node.type === "MatchStatementCase" ? [" ", print3("body")] : indent([line, print3("body"), ","]);
  return [
    print3("pattern"),
    node.guard ? group([indent([line, "if (", print3("guard"), ")"])]) : "",
    group([" =>", comment, body])
  ];
}
function printMatchPattern(path, options2, print3) {
  const { node } = path;
  switch (node.type) {
    case "MatchOrPattern":
      return printMatchOrPattern(path, options2, print3);
    case "MatchAsPattern":
      return [print3("pattern"), " as ", print3("target")];
    case "MatchWildcardPattern":
      return ["_"];
    case "MatchLiteralPattern":
      return print3("literal");
    case "MatchUnaryPattern":
      return [node.operator, print3("argument")];
    case "MatchIdentifierPattern":
      return print3("id");
    case "MatchMemberPattern": {
      const property = node.property.type === "Identifier" ? [".", print3("property")] : ["[", indent([softline, print3("property")]), softline, "]"];
      return group([print3("base"), property]);
    }
    case "MatchBindingPattern":
      return [node.kind, " ", print3("id")];
    case "MatchObjectPattern":
    case "MatchInstanceObjectPattern":
      return printMatchObjectPattern(path, options2, print3);
    case "MatchInstancePattern":
      return group([print3("targetConstructor"), " ", print3("properties")]);
    case "MatchArrayPattern": {
      const elements = path.map(print3, "elements");
      if (node.rest) {
        elements.push(print3("rest"));
      }
      return group([
        "[",
        indent([softline, join([",", line], elements)]),
        node.rest ? "" : ifBreak(","),
        softline,
        "]"
      ]);
    }
    case "MatchObjectPatternProperty":
      if (node.shorthand) {
        return print3("pattern");
      }
      return group([print3("key"), ":", indent([line, print3("pattern")])]);
    case "MatchRestPattern": {
      const parts = ["..."];
      if (node.argument) {
        parts.push(print3("argument"));
      }
      return parts;
    }
  }
}
function printMatchObjectPattern(path, options2, print3) {
  const { node } = path;
  const properties = path.map(print3, "properties");
  if (node.rest) {
    properties.push(print3("rest"));
  }
  return group([
    "{",
    indent([softline, join([",", line], properties)]),
    node.rest ? "" : ifBreak(","),
    softline,
    "}"
  ]);
}
var isSimpleMatchPattern = createTypeCheckFunction([
  "MatchWildcardPattern",
  "MatchLiteralPattern",
  "MatchUnaryPattern",
  "MatchIdentifierPattern"
]);
function shouldHugMatchOrPattern(node) {
  const { patterns } = node;
  if (patterns.some((node2) => hasComment(node2))) {
    return false;
  }
  const objectPattern = patterns.find(
    (node2) => node2.type === "MatchObjectPattern"
  );
  if (!objectPattern) {
    return false;
  }
  return patterns.every(
    (node2) => node2 === objectPattern || isSimpleMatchPattern(node2)
  );
}
function shouldHugMatchPattern(node) {
  if (isSimpleMatchPattern(node) || node.type === "MatchObjectPattern") {
    return true;
  }
  if (node.type === "MatchOrPattern") {
    return shouldHugMatchOrPattern(node);
  }
  return false;
}
function printMatchOrPattern(path, options2, print3) {
  const { node } = path;
  const { parent } = path;
  const shouldIndent = parent.type !== "MatchStatementCase" && parent.type !== "MatchExpressionCase" && parent.type !== "MatchArrayPattern" && parent.type !== "MatchObjectPatternProperty" && !hasLeadingOwnLineComment(options2.originalText, node);
  const shouldHug = shouldHugMatchPattern(node);
  const printed = path.map(() => {
    let printedPattern = print3();
    if (!shouldHug) {
      printedPattern = align(2, printedPattern);
    }
    return printComments(path, printedPattern, options2);
  }, "patterns");
  if (shouldHug) {
    return join(" | ", printed);
  }
  const code = [ifBreak(["| "]), join([line, "| "], printed)];
  if (needs_parentheses_default(path, options2)) {
    return group([indent([ifBreak([softline]), code]), softline]);
  }
  if (parent.type === "MatchArrayPattern" && parent.elements.length > 1) {
    return group([
      indent([ifBreak(["(", softline]), code]),
      softline,
      ifBreak(")")
    ]);
  }
  return group(shouldIndent ? indent(code) : code);
}

// src/language-js/print/opaque-type.js
function printOpaqueType(path, options2, print3) {
  const { node } = path;
  const parts = [
    printDeclareToken(path),
    "opaque type ",
    print3("id"),
    print3("typeParameters")
  ];
  if (node.supertype) {
    parts.push(": ", print3("supertype"));
  }
  if (node.lowerBound || node.upperBound) {
    const lowerAndUpperBoundParts = [];
    if (node.lowerBound) {
      lowerAndUpperBoundParts.push(
        indent([line, "super ", print3("lowerBound")])
      );
    }
    if (node.upperBound) {
      lowerAndUpperBoundParts.push(
        indent([line, "extends ", print3("upperBound")])
      );
    }
    parts.push(group(lowerAndUpperBoundParts));
  }
  if (node.impltype) {
    parts.push(" = ", print3("impltype"));
  }
  parts.push(printSemicolon(options2));
  return parts;
}

// src/language-js/print/rest-type.js
function printRestType(path, options2, print3) {
  const { node } = path;
  return [
    "...",
    ...node.type === "TupleTypeSpreadElement" && node.label ? [print3("label"), ": "] : [],
    print3("typeAnnotation")
  ];
}

// src/language-js/print/tuple.js
function printNamedTupleMember(path, options2, print3) {
  const { node } = path;
  return [
    // `TupleTypeLabeledElement` only
    node.variance ? print3("variance") : "",
    print3("label"),
    node.optional ? "?" : "",
    ": ",
    print3("elementType")
  ];
}

// src/language-js/print/type-alias.js
function printTypeAlias(path, options2, print3) {
  const { node } = path;
  const parts = [
    printDeclareToken(path),
    "type ",
    print3("id"),
    print3("typeParameters")
  ];
  const rightPropertyName = node.type === "TSTypeAliasDeclaration" ? "typeAnnotation" : "right";
  return [
    printAssignment(path, options2, print3, parts, " =", rightPropertyName),
    printSemicolon(options2)
  ];
}

// src/language-js/print/type-parameters.js
function shouldForceTrailingComma(path, options2, paramsKey) {
  const {
    node
  } = path;
  return getFunctionParameters(node).length === 1 && node.type.startsWith("TS") && !node[paramsKey][0].constraint && path.parent.type === "ArrowFunctionExpression" && !(options2.filepath && /\.ts$/.test(options2.filepath));
}
function printTypeParameters(path, options2, print3, paramsKey) {
  const {
    node
  } = path;
  const parameters = node[paramsKey];
  if (!parameters) {
    return "";
  }
  if (!Array.isArray(parameters)) {
    return print3(paramsKey);
  }
  const isParameterInTestCall = isTestCall(path.grandparent);
  const isArrowFunctionVariable = path.match((node2) => !(node2[paramsKey].length === 1 && isObjectType(node2[paramsKey][0])), void 0, (node2, name) => name === "typeAnnotation", (node2) => node2.type === "Identifier", isArrowFunctionVariableDeclarator);
  const shouldInline = parameters.length === 0 || !isArrowFunctionVariable && (isParameterInTestCall || parameters.length === 1 && (parameters[0].type === "NullableTypeAnnotation" || shouldHugType(parameters[0]))) && !parameters.some((node2) => {
    const comments = getComments(node2, (comment) => comment.leading || comment.trailing);
    return comments.length > 0 && (comments.some((comment) => isLineComment(comment)) || // This condition base on existing one in class-body.js
    // It is not really correct, but we don't have a way to check how comments are printed
    has_newline_default(options2.originalText, locEnd(method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      comments,
      -1
    ))));
  });
  if (shouldInline) {
    return ["<", join(", ", path.map(print3, paramsKey)), printDanglingCommentsForInline(path, options2), ">"];
  }
  const trailingComma = node.type === "TSTypeParameterInstantiation" ? "" : shouldForceTrailingComma(path, options2, paramsKey) ? "," : printTrailingComma(options2);
  return group(["<", indent([softline, join([",", line], path.map(print3, paramsKey))]), trailingComma, softline, ">"]);
}
function printDanglingCommentsForInline(path, options2) {
  const {
    node
  } = path;
  if (!hasComment(node, CommentCheckFlags.Dangling)) {
    return "";
  }
  const hasOnlyBlockComments = !hasComment(node, CommentCheckFlags.Line);
  const printed = printDanglingComments(path, options2, {
    indent: !hasOnlyBlockComments
  });
  if (hasOnlyBlockComments) {
    return printed;
  }
  return [printed, hardline];
}
function printTypeParameter(path, options2, print3) {
  const {
    node
  } = path;
  const parts = [node.const ? "const " : ""];
  const name = node.type === "TSTypeParameter" ? print3("name") : node.name;
  if (node.variance) {
    parts.push(print3("variance"));
  }
  if (node.in) {
    parts.push("in ");
  }
  if (node.out) {
    parts.push("out ");
  }
  parts.push(name);
  if (node.bound) {
    if (node.usesExtendsBound) {
      parts.push(" extends ");
    }
    parts.push(printTypeAnnotationProperty(path, print3, "bound"));
  }
  if (node.constraint) {
    const groupId = /* @__PURE__ */ Symbol("constraint");
    parts.push(" extends", group(indent(line), {
      id: groupId
    }), lineSuffixBoundary, indentIfBreak(print3("constraint"), {
      groupId
    }));
  }
  if (node.default) {
    const groupId = /* @__PURE__ */ Symbol("default");
    parts.push(" =", group(indent(line), {
      id: groupId
    }), lineSuffixBoundary, indentIfBreak(print3("default"), {
      groupId
    }));
  }
  return group(parts);
}

// src/language-js/print/type-predicate.js
function printTypePredicate(path, print3) {
  const { node } = path;
  const prefix = node.type === "TSTypePredicate" && node.asserts ? "asserts " : node.type === "TypePredicate" && node.kind ? `${node.kind} ` : "";
  return [
    prefix,
    print3("parameterName"),
    node.typeAnnotation ? [" is ", printTypeAnnotationProperty(path, print3)] : ""
  ];
}

// src/language-js/print/type-query.js
function printTypeQuery({ node }, print3) {
  const argumentPropertyName = node.type === "TSTypeQuery" ? "exprName" : "argument";
  return ["typeof ", print3(argumentPropertyName), print3("typeArguments")];
}

// src/language-js/print/flow.js
function printFlow(path, options2, print3, args) {
  const { node } = path;
  if (is_flow_keyword_type_default(node)) {
    return node.type.slice(0, -14).toLowerCase();
  }
  switch (node.type) {
    case "ComponentDeclaration":
    case "DeclareComponent":
    case "ComponentTypeAnnotation":
      return printComponent(path, options2, print3);
    case "ComponentParameter":
      return printComponentParameter(path, options2, print3);
    case "ComponentTypeParameter":
      return printComponentTypeParameter(path, options2, print3);
    case "HookDeclaration":
      return printFunction(path, options2, print3);
    case "DeclareHook":
      return printDeclareHook(path, options2, print3);
    case "HookTypeAnnotation":
      return printHookTypeAnnotation(path, options2, print3);
    case "DeclareFunction":
      return [
        printDeclareToken(path),
        "function ",
        print3("id"),
        print3("predicate"),
        printSemicolon(options2)
      ];
    case "DeclareModule":
      return ["declare module ", print3("id"), " ", print3("body")];
    case "DeclareModuleExports":
      return [
        "declare module.exports",
        printTypeAnnotationProperty(path, print3),
        printSemicolon(options2)
      ];
    case "DeclareNamespace":
      return ["declare namespace ", print3("id"), " ", print3("body")];
    case "DeclareVariable":
      if (Array.isArray(node.declarations)) {
        return printVariableDeclaration(path, options2, print3);
      }
      return [
        printDeclareToken(path),
        // TODO: Only use `node.kind` when babel update AST
        node.kind ?? "var",
        " ",
        print3("id"),
        printSemicolon(options2)
      ];
    case "DeclareExportDeclaration":
    case "DeclareExportAllDeclaration":
      return printExportDeclaration(path, options2, print3);
    case "DeclareOpaqueType":
    case "OpaqueType":
      return printOpaqueType(path, options2, print3);
    case "DeclareTypeAlias":
    case "TypeAlias":
      return printTypeAlias(path, options2, print3);
    case "IntersectionTypeAnnotation":
      return printIntersectionType(path, options2, print3);
    case "UnionTypeAnnotation":
      return printUnionType(path, options2, print3, args);
    case "ConditionalTypeAnnotation":
      return printTernary(path, options2, print3);
    case "InferTypeAnnotation":
      return printInferType(path, options2, print3);
    case "FunctionTypeAnnotation":
      return printFunctionType(path, options2, print3);
    case "TupleTypeAnnotation":
      return printArray(path, options2, print3);
    case "TupleTypeLabeledElement":
      return printNamedTupleMember(path, options2, print3);
    case "TupleTypeSpreadElement":
      return printRestType(path, options2, print3);
    case "GenericTypeAnnotation":
      return [
        print3("id"),
        printTypeParameters(path, options2, print3, "typeParameters")
      ];
    case "IndexedAccessType":
    case "OptionalIndexedAccessType":
      return printIndexedAccessType(path, options2, print3);
    // Type Annotations for Facebook Flow, typically stripped out or
    // transformed away before printing.
    case "TypeAnnotation":
      return printTypeAnnotation(path, options2, print3);
    case "TypeParameter":
      return printTypeParameter(path, options2, print3);
    case "TypeofTypeAnnotation":
      return printTypeQuery(path, print3);
    case "ExistsTypeAnnotation":
      return "*";
    case "ArrayTypeAnnotation":
      return printArrayType(print3);
    case "DeclareEnum":
    case "EnumDeclaration":
      return printEnumDeclaration(path, print3);
    case "EnumBody":
      return printFlowEnumBody(path, options2, print3);
    case "EnumBooleanBody":
    case "EnumNumberBody":
    case "EnumBigIntBody":
    case "EnumStringBody":
    case "EnumSymbolBody":
      return printLegacyFlowEnumBody(path, options2, print3);
    case "EnumBooleanMember":
    case "EnumNumberMember":
    case "EnumBigIntMember":
    case "EnumStringMember":
    case "EnumDefaultedMember":
      return printEnumMember(path, options2, print3);
    case "FunctionTypeParam": {
      const name = node.name ? print3("name") : path.parent.this === node ? "this" : "";
      return [
        name,
        printOptionalToken(path),
        // `flow` doesn't wrap the `typeAnnotation` with `TypeAnnotation`, so the colon
        // needs to be added separately.
        name ? ": " : "",
        print3("typeAnnotation")
      ];
    }
    case "DeclareClass":
    case "DeclareInterface":
    case "InterfaceDeclaration":
    case "InterfaceTypeAnnotation":
    case "RecordDeclaration":
      return printClass(path, options2, print3);
    case "ObjectTypeAnnotation":
    case "RecordDeclarationBody":
      return printClassBody(path, options2, print3);
    case "ClassImplements":
    case "InterfaceExtends":
      return [print3("id"), print3("typeParameters")];
    case "RecordDeclarationImplements":
      return [print3("id"), print3("typeArguments")];
    case "NullableTypeAnnotation":
      return ["?", print3("typeAnnotation")];
    case "Variance": {
      const { kind } = node;
      noop_default(
        kind === "plus" || kind === "minus" || kind === "readonly" || kind === "writeonly" || kind === "in" || kind === "out"
      );
      return kind === "plus" ? "+" : kind === "minus" ? "-" : `${kind} `;
    }
    case "KeyofTypeAnnotation":
      return ["keyof ", print3("argument")];
    case "ObjectTypeCallProperty":
      return [
        node.static ? "static " : "",
        print3("value"),
        printClassMemberSemicolon(path, options2)
      ];
    case "ObjectTypeMappedTypeProperty":
      return printFlowMappedTypeProperty(path, options2, print3);
    case "ObjectTypeIndexer":
      return [
        node.static ? "static " : "",
        node.variance ? print3("variance") : "",
        "[",
        print3("id"),
        node.id ? ": " : "",
        print3("key"),
        "]: ",
        print3("value"),
        printClassMemberSemicolon(path, options2)
      ];
    case "ObjectTypeProperty": {
      let modifier = "";
      if (node.proto) {
        modifier = "proto ";
      } else if (node.static) {
        modifier = "static ";
      }
      return [
        modifier,
        node.kind !== "init" ? node.kind + " " : "",
        node.variance ? print3("variance") : "",
        printKey(path, options2, print3),
        printOptionalToken(path),
        isMethod(node) ? "" : ": ",
        print3("value"),
        printClassMemberSemicolon(path, options2)
      ];
    }
    case "ObjectTypeInternalSlot":
      return [
        node.static ? "static " : "",
        "[[",
        print3("id"),
        "]]",
        printOptionalToken(path),
        node.method ? "" : ": ",
        print3("value"),
        printClassMemberSemicolon(path, options2)
      ];
    // Same as `RestElement`
    case "ObjectTypeSpreadProperty":
      return printRestOrSpreadElement(path, print3);
    case "QualifiedTypeofIdentifier":
    case "QualifiedTypeIdentifier":
      return [print3("qualification"), ".", print3("id")];
    case "NullLiteralTypeAnnotation":
      return "null";
    case "BooleanLiteralTypeAnnotation":
      return String(node.value);
    case "StringLiteralTypeAnnotation":
      return replaceEndOfLine(print_string_default(getRaw(node), options2));
    case "NumberLiteralTypeAnnotation":
      return print_number_default(getRaw(node));
    case "BigIntLiteralTypeAnnotation":
      return printBigInt(getRaw(node));
    case "TypeCastExpression":
      return [
        "(",
        print3("expression"),
        printTypeAnnotationProperty(path, print3),
        ")"
      ];
    case "TypePredicate":
      return printTypePredicate(path, print3);
    case "TypeOperator":
      return [node.operator, " ", print3("typeAnnotation")];
    case "TypeParameterDeclaration":
    case "TypeParameterInstantiation":
      return printTypeParameters(path, options2, print3, "params");
    // Deprecated https://github.com/facebook/flow/commit/b98ae5528d9a073ddc62fc8ce418bbb1f2f80a82
    case "InferredPredicate":
    case "DeclaredPredicate":
      return [
        // The return type will already add the colon, but otherwise we
        // need to do it ourselves
        path.key === "predicate" && path.parent.type !== "DeclareFunction" && !path.parent.returnType ? ": " : " ",
        "%checks",
        ...node.type === "DeclaredPredicate" ? ["(", print3("value"), ")"] : []
      ];
    case "AsExpression":
    case "AsConstExpression":
    case "SatisfiesExpression":
      return printBinaryCastExpression(path, options2, print3);
    case "MatchExpression":
    case "MatchStatement":
      return printMatch(path, options2, print3);
    case "MatchExpressionCase":
    case "MatchStatementCase":
      return printMatchCase(path, options2, print3);
    case "MatchOrPattern":
    case "MatchAsPattern":
    case "MatchWildcardPattern":
    case "MatchLiteralPattern":
    case "MatchUnaryPattern":
    case "MatchIdentifierPattern":
    case "MatchInstancePattern":
    case "MatchInstanceObjectPattern":
    case "MatchMemberPattern":
    case "MatchBindingPattern":
    case "MatchObjectPattern":
    case "MatchObjectPatternProperty":
    case "MatchRestPattern":
    case "MatchArrayPattern":
      return printMatchPattern(path, options2, print3);
    case "RecordExpression":
      return [
        print3("recordConstructor"),
        print3("typeArguments"),
        " ",
        print3("properties")
      ];
    case "RecordExpressionProperties":
      return printObject(path, options2, print3);
    case "RecordDeclarationProperty":
    case "RecordDeclarationStaticProperty": {
      const isStatic = node.type === "RecordDeclarationStaticProperty";
      const valueKey = isStatic ? "value" : "defaultValue";
      return [
        isStatic ? "static " : "",
        printKey(path, options2, print3),
        printTypeAnnotationProperty(path, print3),
        node[valueKey] ? [" = ", print3(valueKey)] : ""
      ];
    }
  }
}

// src/language-js/print/ignored.js
function printIgnored(path, options2) {
  const { node } = path;
  let text = options2.originalText.slice(locStart(node), locEnd(node));
  if (options2.semi && shouldIgnoredNodePrintSemicolon(node)) {
    text += ";";
  } else if (shouldExpressionStatementPrintLeadingSemicolon(path, options2)) {
    text = `;${text}`;
  }
  if (node.type === "ClassExpression" && is_non_empty_array_default(node.decorators)) {
    return [indent([softline, text]), softline];
  }
  return text;
}

// src/language-js/print/jsx.js
var isEmptyStringOrAnyLine = (doc) => doc === "" || doc === line || doc === hardline || doc === softline;
function printJsxElementInternal(path, options2, print3) {
  const {
    node
  } = path;
  if (node.type === "JSXElement" && isEmptyJsxElement(node)) {
    return [print3("openingElement"), print3("closingElement")];
  }
  const openingLines = node.type === "JSXElement" ? print3("openingElement") : print3("openingFragment");
  const closingLines = node.type === "JSXElement" ? print3("closingElement") : print3("closingFragment");
  if (node.children.length === 1 && node.children[0].type === "JSXExpressionContainer" && (node.children[0].expression.type === "TemplateLiteral" || node.children[0].expression.type === "TaggedTemplateExpression")) {
    return [openingLines, ...path.map(print3, "children"), closingLines];
  }
  node.children = node.children.map((child) => {
    if (isJsxWhitespaceExpression(child)) {
      return {
        type: "JSXText",
        value: " ",
        raw: " "
      };
    }
    return child;
  });
  const containsTag = node.children.some(isJsxElement);
  const containsMultipleExpressions = node.children.filter((child) => child.type === "JSXExpressionContainer").length > 1;
  const containsMultipleAttributes = node.type === "JSXElement" && node.openingElement.attributes.length > 1;
  let forcedBreak = willBreak(openingLines) || containsTag || containsMultipleAttributes || containsMultipleExpressions;
  const isMdxBlock = path.parent.rootMarker === "mdx";
  const rawJsxWhitespace = options2.singleQuote ? "{' '}" : '{" "}';
  const whitespace = isMdxBlock ? line : ifBreak([rawJsxWhitespace, softline], " ");
  const isFacebookTranslationTag = node.openingElement?.name?.name === "fbt";
  const children = printJsxChildren(path, options2, print3, whitespace, isFacebookTranslationTag);
  const containsText = node.children.some((child) => isMeaningfulJsxText(child));
  for (let i = children.length - 2; i >= 0; i--) {
    const isPairOfEmptyStrings = children[i] === "" && children[i + 1] === "";
    const isPairOfHardlines = children[i] === hardline && children[i + 1] === "" && children[i + 2] === hardline;
    const isLineFollowedByJsxWhitespace = (children[i] === softline || children[i] === hardline) && children[i + 1] === "" && children[i + 2] === whitespace;
    const isJsxWhitespaceFollowedByLine = children[i] === whitespace && children[i + 1] === "" && (children[i + 2] === softline || children[i + 2] === hardline);
    const isDoubleJsxWhitespace = children[i] === whitespace && children[i + 1] === "" && children[i + 2] === whitespace;
    const isPairOfHardOrSoftLines = children[i] === softline && children[i + 1] === "" && children[i + 2] === hardline || children[i] === hardline && children[i + 1] === "" && children[i + 2] === softline;
    if (isPairOfHardlines && containsText || isPairOfEmptyStrings || isLineFollowedByJsxWhitespace || isDoubleJsxWhitespace || isPairOfHardOrSoftLines) {
      children.splice(i, 2);
    } else if (isJsxWhitespaceFollowedByLine) {
      children.splice(i + 1, 2);
    }
  }
  while (children.length > 0 && isEmptyStringOrAnyLine(method_at_default(
    /* OPTIONAL_OBJECT: false */
    0,
    children,
    -1
  ))) {
    children.pop();
  }
  while (children.length > 1 && isEmptyStringOrAnyLine(children[0]) && isEmptyStringOrAnyLine(children[1])) {
    children.shift();
    children.shift();
  }
  const multilineChildren = [""];
  for (const [i, child] of children.entries()) {
    if (child === whitespace) {
      if (i === 1 && isEmptyDoc(children[i - 1])) {
        if (children.length === 2) {
          multilineChildren.push([multilineChildren.pop(), rawJsxWhitespace]);
          continue;
        }
        multilineChildren.push([rawJsxWhitespace, hardline], "");
        continue;
      }
      if (i === children.length - 1) {
        multilineChildren.push([multilineChildren.pop(), rawJsxWhitespace]);
        continue;
      }
      if (children[i - 1] === "" && children[i - 2] === hardline) {
        multilineChildren.push([multilineChildren.pop(), rawJsxWhitespace]);
        continue;
      }
    }
    if (i % 2 === 0) {
      multilineChildren.push([multilineChildren.pop(), child]);
    } else {
      multilineChildren.push(child, "");
    }
    if (willBreak(child)) {
      forcedBreak = true;
    }
  }
  let content = containsText ? fill(multilineChildren) : group(multilineChildren, {
    shouldBreak: true
  });
  if (options2.cursorNode?.type === "JSXText" && node.children.includes(options2.cursorNode)) {
    content = [cursor, content, cursor];
  } else if (options2.nodeBeforeCursor?.type === "JSXText" && node.children.includes(options2.nodeBeforeCursor)) {
    content = [cursor, content];
  } else if (options2.nodeAfterCursor?.type === "JSXText" && node.children.includes(options2.nodeAfterCursor)) {
    content = [content, cursor];
  }
  if (isMdxBlock) {
    return content;
  }
  const multiLineElem = group([openingLines, indent([hardline, content]), hardline, closingLines]);
  if (forcedBreak) {
    return multiLineElem;
  }
  return conditionalGroup([group([openingLines, ...children, closingLines]), multiLineElem]);
}
function printJsxChildren(path, options2, print3, whitespace, isFacebookTranslationTag) {
  let prevPart = "";
  const parts = [prevPart];
  function push(doc) {
    prevPart = doc;
    parts.push([parts.pop(), doc]);
  }
  function pushLine(doc) {
    if (doc === "") {
      return;
    }
    prevPart = doc;
    parts.push(doc, "");
  }
  path.each(({
    node,
    next
  }) => {
    if (node.type === "JSXText") {
      const text = getRaw(node);
      if (isMeaningfulJsxText(node)) {
        const words = jsxWhitespace.split(
          text,
          /* captureWhitespace */
          true
        );
        if (words[0] === "") {
          words.shift();
          if (/\n/.test(words[0])) {
            pushLine(separatorWithWhitespace(isFacebookTranslationTag, words[1], node, next));
          } else {
            pushLine(whitespace);
          }
          words.shift();
        }
        let endWhitespace;
        if (method_at_default(
          /* OPTIONAL_OBJECT: false */
          0,
          words,
          -1
        ) === "") {
          words.pop();
          endWhitespace = words.pop();
        }
        if (words.length === 0) {
          return;
        }
        for (const [i, word] of words.entries()) {
          if (i % 2 === 1) {
            pushLine(line);
          } else {
            push(word);
          }
        }
        if (endWhitespace !== void 0) {
          if (/\n/.test(endWhitespace)) {
            pushLine(separatorWithWhitespace(isFacebookTranslationTag, prevPart, node, next));
          } else {
            pushLine(whitespace);
          }
        } else {
          pushLine(separatorNoWhitespace(isFacebookTranslationTag, prevPart, node, next));
        }
      } else if (/\n/.test(text)) {
        if (text.match(/\n/g).length > 1) {
          pushLine(hardline);
        }
      } else {
        pushLine(whitespace);
      }
    } else {
      const printedChild = print3();
      push(printedChild);
      const directlyFollowedByMeaningfulText = next && isMeaningfulJsxText(next);
      if (directlyFollowedByMeaningfulText) {
        const trimmed = jsxWhitespace.trim(getRaw(next));
        const [firstWord] = jsxWhitespace.split(trimmed);
        pushLine(separatorNoWhitespace(isFacebookTranslationTag, firstWord, node, next));
      } else {
        pushLine(hardline);
      }
    }
  }, "children");
  return parts;
}
function separatorNoWhitespace(isFacebookTranslationTag, child, childNode, nextNode) {
  if (isFacebookTranslationTag) {
    return "";
  }
  if (childNode.type === "JSXElement" && !childNode.closingElement || nextNode?.type === "JSXElement" && !nextNode.closingElement) {
    return child.length === 1 ? softline : hardline;
  }
  return softline;
}
function separatorWithWhitespace(isFacebookTranslationTag, child, childNode, nextNode) {
  if (isFacebookTranslationTag) {
    return hardline;
  }
  if (child.length === 1) {
    return childNode.type === "JSXElement" && !childNode.closingElement || nextNode?.type === "JSXElement" && !nextNode.closingElement ? hardline : softline;
  }
  return hardline;
}
var isNoWrapParent = createTypeCheckFunction(["ArrayExpression", "JSXAttribute", "JSXElement", "JSXExpressionContainer", "JSXFragment", "ExpressionStatement", "NewExpression", "CallExpression", "OptionalCallExpression", "ConditionalExpression", "JsExpressionRoot", "MatchExpressionCase"]);
function maybeWrapJsxElementInParens(path, elem, options2) {
  const {
    parent
  } = path;
  if (isNoWrapParent(parent)) {
    return elem;
  }
  const shouldBreak = shouldBreakJsxElement(path);
  const needsParens = needs_parentheses_default(path, options2);
  return group([needsParens ? "" : ifBreak("("), indent([softline, elem]), softline, needsParens ? "" : ifBreak(")")], {
    shouldBreak
  });
}
function shouldBreakJsxElement(path) {
  return path.match(void 0, (node, key) => key === "body" && node.type === "ArrowFunctionExpression", (node, key) => key === "arguments" && isCallExpression(node)) && // Babel
  (path.match(void 0, void 0, void 0, (node, key) => key === "expression" && node.type === "JSXExpressionContainer") || // Estree
  path.match(void 0, void 0, void 0, (node, key) => key === "expression" && node.type === "ChainExpression", (node, key) => key === "expression" && node.type === "JSXExpressionContainer"));
}
function printJsxAttribute(path, options2, print3) {
  const {
    node
  } = path;
  const parts = [print3("name")];
  if (node.value) {
    let res;
    if (isStringLiteral(node.value)) {
      const raw = getRaw(node.value);
      let final = method_replace_all_default(
        /* OPTIONAL_OBJECT: false */
        0,
        method_replace_all_default(
          /* OPTIONAL_OBJECT: false */
          0,
          raw.slice(1, -1),
          "&apos;",
          "'"
        ),
        "&quot;",
        '"'
      );
      const quote = getPreferredQuote(final, options2.jsxSingleQuote);
      final = quote === '"' ? method_replace_all_default(
        /* OPTIONAL_OBJECT: false */
        0,
        final,
        '"',
        "&quot;"
      ) : method_replace_all_default(
        /* OPTIONAL_OBJECT: false */
        0,
        final,
        "'",
        "&apos;"
      );
      res = path.call(() => printComments(path, replaceEndOfLine(quote + final + quote), options2), "value");
    } else {
      res = print3("value");
    }
    parts.push("=", res);
  }
  return parts;
}
function printJsxExpressionContainer(path, options2, print3) {
  const {
    node
  } = path;
  const shouldInline = (node2, parent) => node2.type === "JSXEmptyExpression" || !hasComment(node2) && (isArrayExpression(node2) || isObjectExpression(node2) || node2.type === "ArrowFunctionExpression" || node2.type === "AwaitExpression" && (shouldInline(node2.argument, node2) || node2.argument.type === "JSXElement") || isCallExpression(stripChainElementWrappers(node2)) || node2.type === "FunctionExpression" || node2.type === "TemplateLiteral" || node2.type === "TaggedTemplateExpression" || node2.type === "DoExpression" || isJsxElement(parent) && (node2.type === "ConditionalExpression" || isBinaryish(node2)));
  if (shouldInline(node.expression, path.parent)) {
    return group(["{", print3("expression"), lineSuffixBoundary, "}"]);
  }
  return group(["{", indent([softline, print3("expression")]), softline, lineSuffixBoundary, "}"]);
}
function printJsxOpeningElement(path, options2, print3) {
  const {
    node
  } = path;
  const nameHasComments = hasComment(node.name) || hasComment(node.typeArguments);
  if (node.selfClosing && node.attributes.length === 0 && !nameHasComments) {
    return ["<", print3("name"), print3("typeArguments"), " />"];
  }
  if (node.attributes?.length === 1 && isStringLiteral(node.attributes[0].value) && !node.attributes[0].value.value.includes("\n") && // We should break for the following cases:
  // <div
  //   // comment
  //   attr="value"
  // >
  // <div
  //   attr="value"
  //   // comment
  // >
  !nameHasComments && !hasComment(node.attributes[0])) {
    return group(["<", print3("name"), print3("typeArguments"), " ", ...path.map(print3, "attributes"), node.selfClosing ? " />" : ">"]);
  }
  const shouldBreak = node.attributes?.some((attr) => isStringLiteral(attr.value) && attr.value.value.includes("\n"));
  const attributeLine = options2.singleAttributePerLine && node.attributes.length > 1 ? hardline : line;
  return group(["<", print3("name"), print3("typeArguments"), indent(path.map(({
    isFirst,
    previous
  }) => [isFirst ? attributeLine : isNextLineEmpty2(previous, options2) ? [hardline, hardline] : attributeLine, print3()], "attributes")), ...printEndOfOpeningTag(node, options2, nameHasComments)], {
    shouldBreak
  });
}
function printEndOfOpeningTag(node, options2, nameHasComments) {
  if (node.selfClosing) {
    return [line, "/>"];
  }
  const bracketSameLine = shouldPrintBracketSameLine(node, options2, nameHasComments);
  if (bracketSameLine) {
    return [">"];
  }
  return [softline, ">"];
}
function shouldPrintBracketSameLine(node, options2, nameHasComments) {
  const lastAttrHasTrailingComments = node.attributes.length > 0 && hasComment(method_at_default(
    /* OPTIONAL_OBJECT: false */
    0,
    node.attributes,
    -1
  ), CommentCheckFlags.Trailing);
  return (
    // Simple tags (no attributes and no comment in tag name) should be
    // kept unbroken regardless of `bracketSameLine`.
    // jsxBracketSameLine is deprecated in favour of bracketSameLine,
    // but is still needed for backwards compatibility.
    node.attributes.length === 0 && !nameHasComments || (options2.bracketSameLine || options2.jsxBracketSameLine) && // We should print the bracket in a new line for the following cases:
    // <div
    //   // comment
    // >
    // <div
    //   attr // comment
    // >
    (!nameHasComments || node.attributes.length > 0) && !lastAttrHasTrailingComments
  );
}
function printJsxClosingElement(path, options2, print3) {
  const {
    node
  } = path;
  const parts = ["</"];
  const printed = print3("name");
  if (hasComment(node.name, CommentCheckFlags.Leading | CommentCheckFlags.Line)) {
    parts.push(indent([hardline, printed]), hardline);
  } else if (hasComment(node.name, CommentCheckFlags.Leading | CommentCheckFlags.Block)) {
    parts.push(" ", printed);
  } else {
    parts.push(printed);
  }
  parts.push(">");
  return parts;
}
function printJsxOpeningClosingFragment(path, options2) {
  const {
    node
  } = path;
  const nodeHasComment = hasComment(node);
  const hasOwnLineComment = hasComment(node, CommentCheckFlags.Line);
  const isOpeningFragment = node.type === "JSXOpeningFragment";
  return [isOpeningFragment ? "<" : "</", indent([hasOwnLineComment ? hardline : nodeHasComment && !isOpeningFragment ? " " : "", printDanglingComments(path, options2)]), hasOwnLineComment ? hardline : "", ">"];
}
function printJsxElement(path, options2, print3) {
  const elem = printComments(path, printJsxElementInternal(path, options2, print3), options2);
  return maybeWrapJsxElementInParens(path, elem, options2);
}
function printJsxEmptyExpression(path, options2) {
  const {
    node
  } = path;
  const requiresHardline = hasComment(node, CommentCheckFlags.Line);
  return [printDanglingComments(path, options2, {
    indent: requiresHardline
  }), requiresHardline ? hardline : ""];
}
function printJsxSpreadAttributeOrChild(path, options2, print3) {
  const {
    node
  } = path;
  return ["{", path.call(({
    node: node2
  }) => {
    const printed = ["...", print3()];
    if (!hasComment(node2)) {
      return printed;
    }
    return [indent([softline, printComments(path, printed, options2)]), softline];
  }, node.type === "JSXSpreadAttribute" ? "argument" : "expression"), "}"];
}
function printJsx(path, options2, print3) {
  const {
    node
  } = path;
  if (!node.type.startsWith("JSX")) {
    return;
  }
  switch (node.type) {
    case "JSXAttribute":
      return printJsxAttribute(path, options2, print3);
    case "JSXIdentifier":
      return node.name;
    case "JSXNamespacedName":
      return join(":", [print3("namespace"), print3("name")]);
    case "JSXMemberExpression":
      return join(".", [print3("object"), print3("property")]);
    case "JSXSpreadAttribute":
    case "JSXSpreadChild":
      return printJsxSpreadAttributeOrChild(path, options2, print3);
    case "JSXExpressionContainer":
      return printJsxExpressionContainer(path, options2, print3);
    case "JSXFragment":
    case "JSXElement":
      return printJsxElement(path, options2, print3);
    case "JSXOpeningElement":
      return printJsxOpeningElement(path, options2, print3);
    case "JSXClosingElement":
      return printJsxClosingElement(path, options2, print3);
    case "JSXOpeningFragment":
    case "JSXClosingFragment":
      return printJsxOpeningClosingFragment(
        path,
        options2
        /* , print*/
      );
    case "JSXEmptyExpression":
      return printJsxEmptyExpression(
        path,
        options2
        /* , print*/
      );
    case "JSXText":
      throw new Error("JSXText should be handled by JSXElement");
    default:
      throw new unexpected_node_error_default(node, "JSX");
  }
}
function isEmptyJsxElement(node) {
  if (node.children.length === 0) {
    return true;
  }
  if (node.children.length > 1) {
    return false;
  }
  const child = node.children[0];
  return child.type === "JSXText" && !isMeaningfulJsxText(child);
}
function isJsxWhitespaceExpression(node) {
  return node.type === "JSXExpressionContainer" && isStringLiteral(node.expression) && node.expression.value === " " && !hasComment(node.expression);
}

// src/language-js/print/index-signature.js
function printIndexSignature(path, options2, print3) {
  const { node } = path;
  const trailingComma = node.parameters.length > 1 ? printTrailingComma(options2) : "";
  const parametersGroup = group([
    indent([softline, join([", ", softline], path.map(print3, "parameters"))]),
    trailingComma,
    softline
  ]);
  const isClassMember = path.key === "body" && path.parent.type === "ClassBody";
  return [
    // `static` only allowed in class member
    isClassMember && node.static ? "static " : "",
    node.readonly ? "readonly " : "",
    "[",
    node.parameters ? parametersGroup : "",
    "]",
    printTypeAnnotationProperty(path, print3),
    printClassMemberSemicolon(path, options2)
  ];
}

// src/language-js/print/js-doc-type.js
function printJSDocType(path, print3, token) {
  const { node } = path;
  return [
    node.postfix ? "" : token,
    printTypeAnnotationProperty(path, print3),
    node.postfix ? token : ""
  ];
}

// src/language-js/print/method-signature.js
function printMethodSignature(path, options2, print3) {
  const { node } = path;
  const parts = [];
  const kind = node.kind && node.kind !== "method" ? `${node.kind} ` : "";
  parts.push(
    printTypeScriptAccessibilityToken(node),
    kind,
    printKey(path, options2, print3),
    printOptionalToken(path)
  );
  const parametersDoc = printFunctionParameters(
    path,
    options2,
    print3,
    /* shouldExpandParameters */
    false,
    /* shouldPrintTypeParameters */
    true
  );
  const returnTypeDoc = printTypeAnnotationProperty(path, print3, "returnType");
  const shouldGroupParameters = shouldGroupFunctionParameters(
    node,
    returnTypeDoc
  );
  parts.push(shouldGroupParameters ? group(parametersDoc) : parametersDoc);
  if (node.returnType) {
    parts.push(group(returnTypeDoc));
  }
  return [group(parts), printClassMemberSemicolon(path, options2)];
}

// src/language-js/print/module-declaration.js
function printModuleDeclaration(path, options2, print3) {
  const { node } = path;
  return [
    printDeclareToken(path),
    node.kind === "global" ? "" : `${node.kind} `,
    print3("id"),
    node.body ? [" ", group(print3("body"))] : printSemicolon(options2)
  ];
}

// src/language-js/print/type-assertion.js
function printTypeAssertion(path, options2, print3) {
  const { node } = path;
  const shouldBreakAfterCast = !(isArrayExpression(node.expression) || isObjectExpression(node.expression));
  const castGroup = group([
    "<",
    indent([softline, print3("typeAnnotation")]),
    softline,
    ">"
  ]);
  const exprContents = [
    ifBreak("("),
    indent([softline, print3("expression")]),
    softline,
    ifBreak(")")
  ];
  if (shouldBreakAfterCast) {
    return conditionalGroup([
      [castGroup, print3("expression")],
      [castGroup, group(exprContents, { shouldBreak: true })],
      [castGroup, print3("expression")]
    ]);
  }
  return group([castGroup, print3("expression")]);
}

// src/language-js/print/typescript.js
function printTypescript(path, options2, print3, args) {
  const { node } = path;
  if (!node.type.startsWith("TS")) {
    return;
  }
  if (is_ts_keyword_type_default(node)) {
    return node.type.slice(2, -7).toLowerCase();
  }
  switch (node.type) {
    case "TSThisType":
      return "this";
    case "TSTypeAssertion":
      return printTypeAssertion(path, options2, print3);
    case "TSDeclareFunction":
      return printFunction(path, options2, print3);
    case "TSExportAssignment":
      return ["export = ", print3("expression"), printSemicolon(options2)];
    case "TSModuleBlock":
      return printBlock(path, options2, print3);
    case "TSInterfaceBody":
    case "TSTypeLiteral":
      return printClassBody(path, options2, print3);
    case "TSTypeAliasDeclaration":
      return printTypeAlias(path, options2, print3);
    case "TSQualifiedName":
      return [print3("left"), ".", print3("right")];
    case "TSAbstractMethodDefinition":
    case "TSDeclareMethod":
      return printClassMethod(path, options2, print3);
    case "TSAbstractAccessorProperty":
    case "TSAbstractPropertyDefinition":
      return printClassProperty(path, options2, print3);
    case "TSInterfaceHeritage":
    case "TSClassImplements":
    case "TSInstantiationExpression":
      return [print3("expression"), print3("typeArguments")];
    case "TSTemplateLiteralType":
      return printTemplateLiteral(path, options2, print3);
    case "TSNamedTupleMember":
      return printNamedTupleMember(path, options2, print3);
    case "TSRestType":
      return printRestType(path, options2, print3);
    case "TSOptionalType":
      return [print3("typeAnnotation"), "?"];
    case "TSInterfaceDeclaration":
      return printClass(path, options2, print3);
    case "TSTypeParameterDeclaration":
    case "TSTypeParameterInstantiation":
      return printTypeParameters(path, options2, print3, "params");
    case "TSTypeParameter":
      return printTypeParameter(path, options2, print3);
    case "TSAsExpression":
    case "TSSatisfiesExpression":
      return printBinaryCastExpression(path, options2, print3);
    case "TSArrayType":
      return printArrayType(print3);
    case "TSPropertySignature":
      return [
        node.readonly ? "readonly " : "",
        printKey(path, options2, print3),
        printOptionalToken(path),
        printTypeAnnotationProperty(path, print3),
        printClassMemberSemicolon(path, options2)
      ];
    case "TSParameterProperty":
      return [
        printTypeScriptAccessibilityToken(node),
        node.static ? "static " : "",
        node.override ? "override " : "",
        node.readonly ? "readonly " : "",
        print3("parameter")
      ];
    case "TSTypeQuery":
      return printTypeQuery(path, print3);
    case "TSIndexSignature":
      return printIndexSignature(path, options2, print3);
    case "TSTypePredicate":
      return printTypePredicate(path, print3);
    case "TSNonNullExpression":
      return [print3("expression"), "!"];
    case "TSImportType":
      return [
        printCallExpression(path, options2, print3),
        !node.qualifier ? "" : [".", print3("qualifier")],
        printTypeParameters(path, options2, print3, "typeArguments")
      ];
    case "TSLiteralType":
      return print3("literal");
    case "TSIndexedAccessType":
      return printIndexedAccessType(path, options2, print3);
    case "TSTypeOperator":
      return [node.operator, " ", print3("typeAnnotation")];
    case "TSMappedType":
      return printTypeScriptMappedType(path, options2, print3);
    case "TSMethodSignature":
      return printMethodSignature(path, options2, print3);
    case "TSNamespaceExportDeclaration":
      return ["export as namespace ", print3("id"), printSemicolon(options2)];
    case "TSEnumDeclaration":
      return printEnumDeclaration(path, print3);
    case "TSEnumBody":
      return printObject(path, options2, print3);
    case "TSEnumMember":
      return printEnumMember(path, options2, print3);
    case "TSImportEqualsDeclaration":
      return [
        "import ",
        printImportKind(
          node,
          /* spaceBeforeKind */
          false
        ),
        print3("id"),
        " = ",
        print3("moduleReference"),
        printSemicolon(options2)
      ];
    case "TSExternalModuleReference":
      return printCallExpression(path, options2, print3);
    case "TSModuleDeclaration":
      return printModuleDeclaration(path, options2, print3);
    case "TSConditionalType":
      return printTernary(path, options2, print3);
    case "TSInferType":
      return printInferType(path, options2, print3);
    case "TSIntersectionType":
      return printIntersectionType(path, options2, print3);
    case "TSUnionType":
      return printUnionType(path, options2, print3, args);
    case "TSFunctionType":
    case "TSCallSignatureDeclaration":
    case "TSConstructorType":
    case "TSConstructSignatureDeclaration":
      return printFunctionType(path, options2, print3);
    case "TSTupleType":
      return printArray(path, options2, print3);
    case "TSTypeReference":
      return [
        print3("typeName"),
        printTypeParameters(path, options2, print3, "typeArguments")
      ];
    case "TSTypeAnnotation":
      return printTypeAnnotation(path, options2, print3);
    case "TSEmptyBodyFunctionExpression":
      return printMethodValue(path, options2, print3);
    // These are not valid TypeScript. Printing them just for the sake of error recovery.
    case "TSJSDocAllType":
      return "*";
    case "TSJSDocUnknownType":
      return "?";
    case "TSJSDocNullableType":
      return printJSDocType(
        path,
        print3,
        /* token */
        "?"
      );
    case "TSJSDocNonNullableType":
      return printJSDocType(
        path,
        print3,
        /* token */
        "!"
      );
    case "TSParenthesizedType":
    // Removed in `../parse/postprocess.js`
    default:
      throw new unexpected_node_error_default(node, "TypeScript");
  }
}

// src/language-js/print/index.js
function printWithoutParentheses(path, options2, print3, args) {
  for (const printer of [
    printAngular,
    printJsx,
    printFlow,
    printTypescript,
    printEstree
  ]) {
    const doc = printer(path, options2, print3, args);
    if (doc !== void 0) {
      return doc;
    }
  }
}
var shouldPrintDirectly = createTypeCheckFunction([
  "ClassMethod",
  "ClassPrivateMethod",
  "ClassProperty",
  "ClassAccessorProperty",
  "AccessorProperty",
  "TSAbstractAccessorProperty",
  "PropertyDefinition",
  "TSAbstractPropertyDefinition",
  "ClassPrivateProperty",
  "MethodDefinition",
  "TSAbstractMethodDefinition",
  "TSDeclareMethod"
]);
function print2(path, options2, print3, args) {
  if (path.isRoot) {
    options2.__onHtmlBindingRoot?.(path.node, options2);
  }
  const { node } = path;
  let doc = is_ignored_default(path) ? printIgnored(path, options2) : printWithoutParentheses(path, options2, print3, args);
  if (!doc) {
    return "";
  }
  if (shouldPrintDirectly(node)) {
    return doc;
  }
  doc = printCommentsForFunction(path, options2, doc);
  const decoratorsDoc = (
    // `ClassExpression` prints own decorators
    node.type !== "ClassExpression" && is_non_empty_array_default(node.decorators) ? printDecorators(path, options2, print3) : ""
  );
  const needsParens = needs_parentheses_default(path, options2);
  if (!decoratorsDoc && !needsParens) {
    return doc;
  }
  return inheritLabel(doc, (doc2) => [
    needsParens ? "(" : "",
    decoratorsDoc ? group([decoratorsDoc, doc2]) : doc2,
    needsParens ? ")" : ""
  ]);
}
function printCommentsForFunction(path, options2, doc) {
  const { node } = path;
  if ((hasComment(node, CommentCheckFlags.Leading) || hasComment(node, CommentCheckFlags.Trailing)) && isIifeCalleeOrTaggedTemplateExpressionTag(path)) {
    return [indent([softline, printComments(path, doc, options2)]), softline];
  }
  return doc;
}

// src/language-js/printers.js
var features = {
  // TODO: Make this default behavior
  experimental_avoidAstMutation: true,
  experimental_locForRangeFormat: {
    locStart,
    locEnd: locEndWithFullText
  }
};
var estree = {
  features,
  massageAstNode,
  canAttachComment: can_attach_comment_default,
  handleComments: handle_comments_default,
  isGap: is_gap_default,
  willPrintOwnComments: will_print_own_comments_default,
  embed: embed_default,
  insertPragma,
  printComment: printComment2,
  printPrettierIgnored: print2,
  print: print2,
  getVisitorKeys: get_visitor_keys_default,
  isBlockComment,
  hasPrettierIgnore: is_ignored_default
};

// src/language-json/languages.evaluate.js
var languages_evaluate_default2 = [
  {
    "name": "JSON.stringify",
    "type": "data",
    "aceMode": "json",
    "extensions": [
      ".importmap"
    ],
    "filenames": [
      "package.json",
      "package-lock.json",
      "composer.json"
    ],
    "tmScope": "source.json",
    "aliases": [
      "geojson",
      "jsonl",
      "sarif",
      "topojson"
    ],
    "codemirrorMode": "javascript",
    "codemirrorMimeType": "application/json",
    "parsers": [
      "json-stringify"
    ],
    "vscodeLanguageIds": [
      "json"
    ],
    "linguistLanguageId": 174
  },
  {
    "name": "JSON",
    "type": "data",
    "aceMode": "json",
    "extensions": [
      ".json",
      ".4DForm",
      ".4DProject",
      ".avsc",
      ".geojson",
      ".gltf",
      ".har",
      ".ice",
      ".JSON-tmLanguage",
      ".json.example",
      ".mcmeta",
      ".sarif",
      ".slnlaunch",
      ".tact",
      ".tfstate",
      ".tfstate.backup",
      ".topojson",
      ".webapp",
      ".webmanifest",
      ".yy",
      ".yyp"
    ],
    "filenames": [
      ".all-contributorsrc",
      ".arcconfig",
      ".auto-changelog",
      ".c8rc",
      ".htmlhintrc",
      ".imgbotconfig",
      ".nycrc",
      ".tern-config",
      ".tern-project",
      ".watchmanconfig",
      ".babelrc",
      ".jscsrc",
      ".jshintrc",
      ".jslintrc",
      ".swcrc"
    ],
    "tmScope": "source.json",
    "aliases": [
      "geojson",
      "jsonl",
      "sarif",
      "topojson"
    ],
    "codemirrorMode": "javascript",
    "codemirrorMimeType": "application/json",
    "parsers": [
      "json"
    ],
    "vscodeLanguageIds": [
      "json"
    ],
    "linguistLanguageId": 174
  },
  {
    "name": "JSON with Comments",
    "type": "data",
    "aceMode": "javascript",
    "extensions": [
      ".jsonc",
      ".code-snippets",
      ".code-workspace",
      ".sublime-build",
      ".sublime-color-scheme",
      ".sublime-commands",
      ".sublime-completions",
      ".sublime-keymap",
      ".sublime-macro",
      ".sublime-menu",
      ".sublime-mousemap",
      ".sublime-project",
      ".sublime-settings",
      ".sublime-theme",
      ".sublime-workspace",
      ".sublime_metrics",
      ".sublime_session"
    ],
    "filenames": [],
    "tmScope": "source.json.comments",
    "aliases": [
      "jsonc"
    ],
    "codemirrorMode": "javascript",
    "codemirrorMimeType": "text/javascript",
    "group": "JSON",
    "parsers": [
      "jsonc"
    ],
    "vscodeLanguageIds": [
      "jsonc"
    ],
    "linguistLanguageId": 423
  },
  {
    "name": "JSON5",
    "type": "data",
    "aceMode": "json5",
    "extensions": [
      ".json5"
    ],
    "tmScope": "source.js",
    "codemirrorMode": "javascript",
    "codemirrorMimeType": "application/json",
    "parsers": [
      "json5"
    ],
    "vscodeLanguageIds": [
      "json5"
    ],
    "linguistLanguageId": 175
  }
];

// src/language-json/printers.js
var printers_exports2 = {};
__export(printers_exports2, {
  estree: () => estree,
  "estree-json": () => estreeJsonPrinter
});

// src/language-json/visitor-keys.evaluate.js
var visitor_keys_evaluate_default2 = {
  JsonRoot: ["node"],
  ArrayExpression: ["elements"],
  ObjectExpression: ["properties"],
  ObjectProperty: ["key", "value"],
  UnaryExpression: ["argument"],
  NullLiteral: [],
  BooleanLiteral: [],
  StringLiteral: [],
  NumericLiteral: [],
  Identifier: [],
  TemplateLiteral: ["quasis"],
  TemplateElement: []
};

// src/language-json/get-visitor-keys.js
var getVisitorKeys2 = create_get_visitor_keys_default(visitor_keys_evaluate_default2);
var get_visitor_keys_default2 = getVisitorKeys2;

// src/language-json/utilities.js
function getRaw2(node) {
  return node.extra.raw;
}

// src/language-json/massage-ast/index.js
var ignoredProperties2 = /* @__PURE__ */ new Set([
  "start",
  "end",
  "loc",
  "comments",
  "leadingComments",
  "trailingComments",
  "innerComments",
  "errors",
  "range",
  "tokens"
]);
function massageAstNode2(original, cloned) {
  const { type } = original;
  if (type === "ObjectProperty") {
    const { key } = original;
    if (key.type === "Identifier") {
      const { name } = key;
      cloned.key = {
        type: "StringLiteral",
        value: name,
        extra: { rawValue: name }
      };
    } else if (key.type === "NumericLiteral") {
      const raw = getRaw2(key);
      if (String(Number(raw)) === raw) {
        cloned.key = {
          type: "StringLiteral",
          value: raw,
          extra: { rawValue: raw }
        };
      }
    }
  }
  if (type === "StringLiteral") {
    delete cloned.extra.raw;
  }
  if (type === "UnaryExpression" && original.operator === "+") {
    return cloned.argument;
  }
  if (type === "ArrayExpression" || type === "ObjectExpression") {
    cloned.extra ?? (cloned.extra = {});
    if (original.extra?.trailingComma) {
      delete cloned.extra.trailingComma;
    }
  }
  if (type === "ArrayExpression") {
    for (const [index, element] of original.elements.entries()) {
      if (element === null) {
        cloned.elements.splice(index, 0, { type: "NullLiteral" });
      }
    }
    return;
  }
  if (type === "TemplateLiteral") {
    const value = original.quasis[0].value.cooked;
    return {
      type: "StringLiteral",
      value,
      extra: { rawValue: value }
    };
  }
}
massageAstNode2.ignoredProperties = ignoredProperties2;

// src/language-json/print/json.js
function printJson(path, options2, print3) {
  const { node } = path;
  switch (node.type) {
    case "JsonRoot":
      return [print3("node"), hardline];
    case "ArrayExpression": {
      if (node.elements.length === 0) {
        return "[]";
      }
      const printed = path.map(
        () => path.node === null ? "null" : print3(),
        "elements"
      );
      return [
        "[",
        indent([hardline, join([",", hardline], printed)]),
        hardline,
        "]"
      ];
    }
    case "ObjectExpression":
      return node.properties.length === 0 ? "{}" : [
        "{",
        indent([
          hardline,
          join([",", hardline], path.map(print3, "properties"))
        ]),
        hardline,
        "}"
      ];
    case "ObjectProperty":
      return [print3("key"), ": ", print3("value")];
    case "UnaryExpression":
      return [node.operator === "+" ? "" : node.operator, print3("argument")];
    case "NullLiteral":
      return "null";
    case "BooleanLiteral":
      return node.value ? "true" : "false";
    case "StringLiteral":
      return print_string_default(getRaw2(node), options2);
    case "NumericLiteral": {
      const raw = getRaw2(node);
      if (isObjectKey(path) && String(Number(raw)) === raw) {
        return `"${raw}"`;
      }
      return raw;
    }
    case "Identifier":
      return isObjectKey(path) ? JSON.stringify(node.name) : node.name;
    case "TemplateLiteral":
      return print3(["quasis", 0]);
    case "TemplateElement":
      return JSON.stringify(node.value.cooked);
    default:
      throw new unexpected_node_error_default(node, "JSON");
  }
}
function isObjectKey(path) {
  return path.key === "key" && path.parent.type === "ObjectProperty";
}

// src/language-json/printers.js
var estreeJsonPrinter = {
  massageAstNode: massageAstNode2,
  print: printJson,
  getVisitorKeys: get_visitor_keys_default2
};

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

// src/language-js/options.js
var CATEGORY_JAVASCRIPT = "JavaScript";
var options = {
  arrowParens: {
    category: CATEGORY_JAVASCRIPT,
    type: "choice",
    default: "always",
    description: "Include parentheses around a sole arrow function parameter.",
    choices: [
      {
        value: "always",
        description: "Always include parens. Example: `(x) => x`"
      },
      {
        value: "avoid",
        description: "Omit parens when possible. Example: `x => x`"
      }
    ]
  },
  bracketSameLine: common_options_evaluate_default.bracketSameLine,
  objectWrap: common_options_evaluate_default.objectWrap,
  bracketSpacing: common_options_evaluate_default.bracketSpacing,
  jsxBracketSameLine: {
    category: CATEGORY_JAVASCRIPT,
    type: "boolean",
    description: "Put > on the last line instead of at a new line.",
    deprecated: "2.4.0"
  },
  semi: {
    category: CATEGORY_JAVASCRIPT,
    type: "boolean",
    default: true,
    description: "Print semicolons.",
    oppositeDescription: "Do not print semicolons, except at the beginning of lines which may need them."
  },
  experimentalOperatorPosition: {
    category: CATEGORY_JAVASCRIPT,
    type: "choice",
    default: "end",
    description: "Where to print operators when binary expressions wrap lines.",
    choices: [
      {
        value: "start",
        description: "Print operators at the start of new lines."
      },
      {
        value: "end",
        description: "Print operators at the end of previous lines."
      }
    ]
  },
  experimentalTernaries: {
    category: CATEGORY_JAVASCRIPT,
    type: "boolean",
    default: false,
    description: "Use curious ternaries, with the question mark after the condition.",
    oppositeDescription: "Default behavior of ternaries; keep question marks on the same line as the consequent."
  },
  singleQuote: common_options_evaluate_default.singleQuote,
  jsxSingleQuote: {
    category: CATEGORY_JAVASCRIPT,
    type: "boolean",
    default: false,
    description: "Use single quotes in JSX."
  },
  quoteProps: {
    category: CATEGORY_JAVASCRIPT,
    type: "choice",
    default: "as-needed",
    description: "Change when properties in objects are quoted.",
    choices: [
      {
        value: "as-needed",
        description: "Only add quotes around object properties where required."
      },
      {
        value: "consistent",
        description: "If at least one property in an object requires quotes, quote all properties."
      },
      {
        value: "preserve",
        description: "Respect the input use of quotes in object properties."
      }
    ]
  },
  trailingComma: {
    category: CATEGORY_JAVASCRIPT,
    type: "choice",
    default: "all",
    description: "Print trailing commas wherever possible when multi-line.",
    choices: [
      {
        value: "all",
        description: "Trailing commas wherever possible (including function arguments)."
      },
      {
        value: "es5",
        description: "Trailing commas where valid in ES5 (objects, arrays, etc.)"
      },
      { value: "none", description: "No trailing commas." }
    ]
  },
  singleAttributePerLine: common_options_evaluate_default.singleAttributePerLine
};
var options_default = options;

// src/plugins/estree.js
var printers2 = {
  ...printers_exports,
  ...printers_exports2
};
var languages = [...languages_evaluate_default, ...languages_evaluate_default2];
export {
  estree_exports as default,
  languages,
  options_default as options,
  printers2 as printers
};
