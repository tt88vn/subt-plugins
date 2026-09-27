var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/plugins/graphql.js
var graphql_exports = {};
__export(graphql_exports, {
  languages: () => languages_evaluate_default,
  options: () => options_default,
  parsers: () => parser_graphql_exports,
  printers: () => printers
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

// src/utilities/noop.js
var noop = () => {
};
var noop_default = noop;

// src/document/builders/types.js
var DOC_TYPE_INDENT = (
  /** @type {const} */
  "indent"
);
var DOC_TYPE_GROUP = (
  /** @type {const} */
  "group"
);
var DOC_TYPE_IF_BREAK = (
  /** @type {const} */
  "if-break"
);
var DOC_TYPE_LINE = (
  /** @type {const} */
  "line"
);
var DOC_TYPE_BREAK_PARENT = (
  /** @type {const} */
  "break-parent"
);

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

// src/document/builders/indent.js
function indent(contents) {
  assertDoc(contents);
  return { type: DOC_TYPE_INDENT, contents };
}

// src/document/builders/break-parent.js
var breakParent = { type: DOC_TYPE_BREAK_PARENT };

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

// src/utilities/skip.js
function skip(characters) {
  return (text, startIndex, options2) => {
    if (startIndex === false) {
      return false;
    }
    const backwards = Boolean(options2?.backwards);
    const { length } = text;
    let cursor = startIndex;
    while (cursor >= 0 && cursor < length) {
      const character = text.charAt(cursor);
      if (characters instanceof RegExp) {
        if (!characters.test(character)) {
          return cursor;
        }
      } else if (!characters.includes(character)) {
        return cursor;
      }
      backwards ? cursor-- : cursor++;
    }
    if (cursor === -1 || cursor === length) {
      return cursor;
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

// src/main/comments/print.js
var returnTrue = () => true;
function printComment(path, options2) {
  const comment = path.node;
  comment.printed = true;
  return options2.printer.printComment(path, options2);
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

// src/utilities/is-non-empty-array.js
function isNonEmptyArray(object) {
  return Array.isArray(object) && object.length > 0;
}
var is_non_empty_array_default = isNonEmptyArray;

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

// src/language-graphql/visitor-keys.evaluate.js
var vk = [
  ["name"],
  ["name", "value"],
  ["type"],
  ["description", "name", "directives"],
  ["description", "name", "interfaces", "directives", "fields"],
  ["name", "directives"],
  ["name", "interfaces", "directives", "fields"]
];
var visitor_keys_evaluate_default = {
  Name: [],
  Document: ["definitions"],
  OperationDefinition: ["description", "name", "variableDefinitions", "directives", "selectionSet"],
  VariableDefinition: ["description", "variable", "type", "defaultValue", "directives"],
  Variable: vk[0],
  SelectionSet: ["selections"],
  Field: ["alias", "name", "arguments", "directives", "selectionSet"],
  Argument: vk[1],
  FragmentArgument: vk[1],
  FragmentSpread: ["name", "arguments", "directives"],
  InlineFragment: ["typeCondition", "directives", "selectionSet"],
  FragmentDefinition: ["description", "name", "variableDefinitions", "typeCondition", "directives", "selectionSet"],
  IntValue: [],
  FloatValue: [],
  StringValue: [],
  BooleanValue: [],
  NullValue: [],
  EnumValue: [],
  ListValue: ["values"],
  ObjectValue: ["fields"],
  ObjectField: vk[1],
  Directive: ["name", "arguments"],
  NamedType: vk[0],
  ListType: vk[2],
  NonNullType: vk[2],
  SchemaDefinition: ["description", "directives", "operationTypes"],
  OperationTypeDefinition: vk[2],
  ScalarTypeDefinition: vk[3],
  ObjectTypeDefinition: vk[4],
  FieldDefinition: ["description", "name", "arguments", "type", "directives"],
  InputValueDefinition: ["description", "name", "type", "defaultValue", "directives"],
  InterfaceTypeDefinition: vk[4],
  UnionTypeDefinition: ["description", "name", "directives", "types"],
  EnumTypeDefinition: ["description", "name", "directives", "values"],
  EnumValueDefinition: vk[3],
  InputObjectTypeDefinition: ["description", "name", "directives", "fields"],
  DirectiveDefinition: ["description", "name", "arguments", "directives", "locations"],
  SchemaExtension: ["directives", "operationTypes"],
  DirectiveExtension: vk[5],
  ScalarTypeExtension: vk[5],
  ObjectTypeExtension: vk[6],
  InterfaceTypeExtension: vk[6],
  UnionTypeExtension: ["name", "directives", "types"],
  EnumTypeExtension: ["name", "directives", "values"],
  InputObjectTypeExtension: ["name", "directives", "fields"]
};

// src/language-graphql/get-visitor-keys.js
var getVisitorKeys = create_get_visitor_keys_default(visitor_keys_evaluate_default, "kind");
var get_visitor_keys_default = getVisitorKeys;

// src/language-graphql/loc.js
var locStart = (nodeOrToken) => nodeOrToken.loc.start;
var locEnd = (nodeOrToken) => nodeOrToken.loc.end;

// src/language-graphql/massage-ast/index.js
function massageAstNode(original, cloned) {
  if (original.kind === "StringValue" && original.block && !original.value.includes("\n")) {
    cloned.value = original.value.trim();
  }
}
massageAstNode.ignoredProperties = /* @__PURE__ */ new Set(["loc", "comments"]);

// src/utilities/pragma/pragma.evaluate.js
var FORMAT_PRAGMA_TO_INSERT = "format";
var GRAPHQL_HAS_IGNORE_PRAGMA_REGEXP = /^\s*#[^\S\n]*@(?:noformat|noprettier)\s*(?:\n|$)/;
var GRAPHQL_HAS_PRAGMA_REGEXP = /^\s*#[^\S\n]*@(?:format|prettier)\s*(?:\n|$)/;

// src/language-graphql/pragma.js
var hasPragma = (text) => GRAPHQL_HAS_PRAGMA_REGEXP.test(text);
var hasIgnorePragma = (text) => GRAPHQL_HAS_IGNORE_PRAGMA_REGEXP.test(text);
var insertPragma = (text) => `# @${FORMAT_PRAGMA_TO_INSERT}

${text}`;

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

// src/language-graphql/print/sequence.js
function printSequence(path, options2, print2, property) {
  return path.map(({ isLast, node }) => {
    const printed = print2();
    if (!isLast && is_next_line_empty_default(options2.originalText, locEnd(node))) {
      return [printed, hardline];
    }
    return printed;
  }, property);
}

// src/language-graphql/print/arguments.js
function printArguments(path, options2, print2) {
  const { node } = path;
  if (!is_non_empty_array_default(node.arguments)) {
    return "";
  }
  return group([
    "(",
    indent([
      softline,
      join(
        [ifBreak("", ", "), softline],
        printSequence(path, options2, print2, "arguments")
      )
    ]),
    softline,
    ")"
  ]);
}

// src/language-graphql/print/description.js
function printDescription(path, options2, print2) {
  const { node } = path;
  if (!node.description) {
    return "";
  }
  const parts = [print2("description")];
  if (node.kind === "InputValueDefinition" && !node.description.block) {
    parts.push(line);
  } else {
    parts.push(hardline);
  }
  return parts;
}

// src/language-graphql/print/directives.js
function printDirectives(path, print2) {
  const { node } = path;
  if (!is_non_empty_array_default(node.directives)) {
    return "";
  }
  const printed = join(line, path.map(print2, "directives"));
  if (node.kind === "FragmentDefinition" || node.kind === "OperationDefinition") {
    return group([line, printed]);
  }
  return [" ", group(indent([softline, printed]))];
}

// src/language-graphql/print/variable-definitions.js
function printVariableDefinitions(path, print2) {
  const { node } = path;
  if (!is_non_empty_array_default(node.variableDefinitions)) {
    return "";
  }
  return group([
    "(",
    indent([
      softline,
      join(
        [ifBreak("", ", "), softline],
        path.map(print2, "variableDefinitions")
      )
    ]),
    softline,
    ")"
  ]);
}

// src/language-graphql/printer-graphql.js
function genericPrint(path, options2, print2) {
  const {
    node
  } = path;
  switch (node.kind) {
    case "Document":
      return [...join(hardline, printSequence(path, options2, print2, "definitions")), hardline];
    case "OperationDefinition": {
      const hasOperation = options2.originalText[locStart(node)] !== "{";
      const hasName = Boolean(node.name);
      return [printDescription(path, options2, print2), hasOperation ? node.operation : "", hasOperation && hasName ? [" ", print2("name")] : "", hasOperation && !hasName && is_non_empty_array_default(node.variableDefinitions) ? " " : "", printVariableDefinitions(path, print2), printDirectives(path, print2), !hasOperation && !hasName ? "" : " ", print2("selectionSet")];
    }
    case "FragmentDefinition":
      return [printDescription(path, options2, print2), "fragment ", print2("name"), printVariableDefinitions(path, print2), " on ", print2("typeCondition"), printDirectives(path, print2), " ", print2("selectionSet")];
    case "SelectionSet":
      return ["{", indent([hardline, join(hardline, printSequence(path, options2, print2, "selections"))]), hardline, "}"];
    case "Field":
      return group([node.alias ? [print2("alias"), ": "] : "", print2("name"), is_non_empty_array_default(node.arguments) ? group(["(", indent([softline, join([ifBreak("", ", "), softline], printSequence(path, options2, print2, "arguments"))]), softline, ")"]) : "", printDirectives(path, print2), node.selectionSet ? " " : "", print2("selectionSet")]);
    case "Name":
      return node.value;
    case "StringValue":
      if (node.block) {
        const lines = method_replace_all_default(
          /* OPTIONAL_OBJECT: false */
          0,
          node.value,
          '"""',
          '\\"""'
        ).split("\n");
        if (lines.length === 1) {
          lines[0] = lines[0].trim();
        }
        if (lines.every((line2) => line2 === "")) {
          lines.length = 0;
        }
        return join(hardline, ['"""', ...lines, '"""']);
      }
      return ['"', method_replace_all_default(
        /* OPTIONAL_OBJECT: false */
        0,
        method_replace_all_default(
          /* OPTIONAL_OBJECT: false */
          0,
          node.value,
          /["\\]/g,
          "\\$&"
        ),
        "\n",
        "\\n"
      ), '"'];
    case "IntValue":
    case "FloatValue":
    case "EnumValue":
      return node.value;
    case "BooleanValue":
      return node.value ? "true" : "false";
    case "NullValue":
      return "null";
    case "Variable":
      return ["$", print2("name")];
    case "ListValue": {
      const isEmpty = !is_non_empty_array_default(node.values);
      return group(["[", printDanglingComments(path, options2, {
        indent: true
      }), isEmpty ? "" : indent([softline, join([ifBreak("", ", "), softline], path.map(print2, "values"))]), softline, "]"]);
    }
    case "ObjectValue": {
      const isEmpty = !is_non_empty_array_default(node.fields);
      const bracketSpace = options2.bracketSpacing && !isEmpty ? " " : "";
      return group(["{", bracketSpace, printDanglingComments(path, options2, {
        indent: true
      }), isEmpty ? "" : [indent([softline, join([ifBreak("", ", "), softline], path.map(print2, "fields"))])], softline, ifBreak("", bracketSpace), "}"]);
    }
    case "ObjectField":
    case "Argument":
    case "FragmentArgument":
      return [print2("name"), ": ", print2("value")];
    case "Directive":
      return ["@", print2("name"), printArguments(path, options2, print2)];
    case "NamedType":
      return print2("name");
    case "VariableDefinition":
      return [printDescription(path, options2, print2), print2("variable"), ": ", print2("type"), node.defaultValue ? [" = ", print2("defaultValue")] : "", printDirectives(path, print2)];
    case "ObjectTypeExtension":
    case "ObjectTypeDefinition":
    case "InputObjectTypeExtension":
    case "InputObjectTypeDefinition":
    case "InterfaceTypeExtension":
    case "InterfaceTypeDefinition": {
      const {
        kind
      } = node;
      const parts = [];
      if (kind.endsWith("TypeDefinition")) {
        parts.push(printDescription(path, options2, print2));
      } else {
        parts.push("extend ");
      }
      if (kind.startsWith("ObjectType")) {
        parts.push("type");
      } else if (kind.startsWith("InputObjectType")) {
        parts.push("input");
      } else {
        parts.push("interface");
      }
      parts.push(" ", print2("name"));
      if (!kind.startsWith("InputObjectType") && is_non_empty_array_default(node.interfaces)) {
        parts.push(" implements ", indent([group([join([" &", line], path.map(print2, "interfaces"))])]));
      }
      parts.push(printDirectives(path, print2));
      if (is_non_empty_array_default(node.fields)) {
        parts.push([" {", indent([hardline, join(hardline, printSequence(path, options2, print2, "fields"))]), hardline, "}"]);
      }
      return parts;
    }
    case "FieldDefinition":
      return [printDescription(path, options2, print2), print2("name"), is_non_empty_array_default(node.arguments) ? group(["(", indent([softline, join([ifBreak("", ", "), softline], printSequence(path, options2, print2, "arguments"))]), softline, ")"]) : "", ": ", print2("type"), printDirectives(path, print2)];
    case "DirectiveDefinition":
      return [printDescription(path, options2, print2), "directive ", "@", print2("name"), is_non_empty_array_default(node.arguments) ? group(["(", indent([softline, join([ifBreak("", ", "), softline], printSequence(path, options2, print2, "arguments"))]), softline, ")"]) : "", printDirectives(path, print2), node.repeatable ? " repeatable" : "", " on ", ...join(" | ", path.map(print2, "locations"))];
    case "DirectiveExtension":
      return ["extend directive @", print2("name"), printDirectives(path, print2)];
    case "EnumTypeExtension":
    case "EnumTypeDefinition":
      return [printDescription(path, options2, print2), node.kind === "EnumTypeExtension" ? "extend " : "", "enum ", print2("name"), printDirectives(path, print2), is_non_empty_array_default(node.values) ? [" {", indent([hardline, join(hardline, printSequence(path, options2, print2, "values"))]), hardline, "}"] : ""];
    case "EnumValueDefinition":
      return [printDescription(path, options2, print2), print2("name"), printDirectives(path, print2)];
    case "InputValueDefinition":
      return [printDescription(path, options2, print2), print2("name"), ": ", print2("type"), node.defaultValue ? [" = ", print2("defaultValue")] : "", printDirectives(path, print2)];
    case "SchemaExtension":
      return ["extend schema", printDirectives(path, print2), ...is_non_empty_array_default(node.operationTypes) ? [" {", indent([hardline, join(hardline, printSequence(path, options2, print2, "operationTypes"))]), hardline, "}"] : []];
    case "SchemaDefinition":
      return [printDescription(path, options2, print2), "schema", printDirectives(path, print2), " {", is_non_empty_array_default(node.operationTypes) ? indent([hardline, join(hardline, printSequence(path, options2, print2, "operationTypes"))]) : "", hardline, "}"];
    case "OperationTypeDefinition":
      return [node.operation, ": ", print2("type")];
    case "FragmentSpread":
      return ["...", print2("name"), printArguments(path, options2, print2), printDirectives(path, print2)];
    case "InlineFragment":
      return ["...", node.typeCondition ? [" on ", print2("typeCondition")] : "", printDirectives(path, print2), " ", print2("selectionSet")];
    case "UnionTypeExtension":
    case "UnionTypeDefinition":
      return group([printDescription(path, options2, print2), group([node.kind === "UnionTypeExtension" ? "extend " : "", "union ", print2("name"), printDirectives(path, print2), is_non_empty_array_default(node.types) ? [" =", ifBreak("", " "), indent([ifBreak([line, "| "]), join([line, "| "], path.map(print2, "types"))])] : ""])]);
    case "ScalarTypeExtension":
    case "ScalarTypeDefinition":
      return [printDescription(path, options2, print2), node.kind === "ScalarTypeExtension" ? "extend " : "", "scalar ", print2("name"), printDirectives(path, print2)];
    case "NonNullType":
      return [print2("type"), "!"];
    case "ListType":
      return ["[", print2("type"), "]"];
    default:
      throw new unexpected_node_error_default(node, "Graphql", "kind");
  }
}
function canAttachComment(node) {
  return node.kind !== "Comment";
}
function printComment2({
  node: comment
}) {
  if (comment.kind === "Comment") {
    return "#" + comment.value.trimEnd();
  }
  throw new Error("Not a comment: " + JSON.stringify(comment));
}
function hasPrettierIgnore(path) {
  const {
    node
  } = path;
  return node?.comments?.some((comment) => comment.value.trim() === "prettier-ignore");
}
var printer = {
  print: genericPrint,
  massageAstNode,
  hasPrettierIgnore,
  insertPragma,
  printComment: printComment2,
  canAttachComment,
  getVisitorKeys: get_visitor_keys_default
};
var printer_graphql_default = printer;

// src/language-graphql/languages.evaluate.js
var languages_evaluate_default = [
  {
    "name": "GraphQL",
    "type": "data",
    "aceMode": "graphqlschema",
    "extensions": [
      ".graphql",
      ".gql",
      ".graphqls"
    ],
    "tmScope": "source.graphql",
    "parsers": [
      "graphql"
    ],
    "vscodeLanguageIds": [
      "graphql"
    ],
    "linguistLanguageId": 139
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

// src/language-graphql/options.js
var options = {
  bracketSpacing: common_options_evaluate_default.bracketSpacing
};
var options_default = options;

// src/language-graphql/parser-graphql.js
var parser_graphql_exports = {};
__export(parser_graphql_exports, {
  graphql: () => graphql
});

// node_modules/graphql/jsutils/instanceOf.mjs
function prodInstanceOf(value, symbol) {
  return value?.__kind === symbol;
}
var instanceOf = prodInstanceOf;

// node_modules/graphql/jsutils/isObjectLike.mjs
function isObjectLike(value) {
  return typeof value == "object" && value !== null;
}

// node_modules/graphql/jsutils/invariant.mjs
function invariant(condition, message) {
  if (!condition) {
    throw new Error(message ?? "Unexpected invariant triggered.");
  }
}

// node_modules/graphql/language/location.mjs
var LineRegExp = /\r\n|[\n\r]/g;
function getLocation(source, position) {
  let lastLineStart = 0;
  let line2 = 1;
  for (const match of source.body.matchAll(LineRegExp)) {
    if (!(typeof match.index === "number"))
      invariant(false);
    if (match.index >= position) {
      break;
    }
    lastLineStart = match.index + match[0].length;
    line2 += 1;
  }
  return { line: line2, column: position + 1 - lastLineStart };
}

// node_modules/graphql/language/printLocation.mjs
function printLocation(location) {
  return printSourceLocation(location.source, getLocation(location.source, location.start));
}
function printSourceLocation(source, sourceLocation) {
  const firstLineColumnOffset = source.locationOffset.column - 1;
  const body = "".padStart(firstLineColumnOffset) + source.body;
  const lineIndex = sourceLocation.line - 1;
  const lineOffset = source.locationOffset.line - 1;
  const lineNum = sourceLocation.line + lineOffset;
  const columnOffset = sourceLocation.line === 1 ? firstLineColumnOffset : 0;
  const columnNum = sourceLocation.column + columnOffset;
  const locationStr = `${source.name}:${lineNum}:${columnNum}
`;
  const lines = body.split(/\r\n|[\n\r]/g);
  const locationLine = lines[lineIndex];
  if (locationLine.length > 120) {
    const subLineIndex = Math.floor(columnNum / 80);
    const subLineColumnNum = columnNum % 80;
    const subLines = [];
    for (let i = 0; i < locationLine.length; i += 80) {
      subLines.push(locationLine.slice(i, i + 80));
    }
    return locationStr + printPrefixedLines([
      [`${lineNum} |`, subLines[0]],
      ...subLines.slice(1, subLineIndex + 1).map((subLine) => ["|", subLine]),
      ["|", "^".padStart(subLineColumnNum)],
      ["|", subLines[subLineIndex + 1]]
    ]);
  }
  return locationStr + printPrefixedLines([
    [`${lineNum - 1} |`, lines[lineIndex - 1]],
    [`${lineNum} |`, locationLine],
    ["|", "^".padStart(columnNum)],
    [`${lineNum + 1} |`, lines[lineIndex + 1]]
  ]);
}
function printPrefixedLines(lines) {
  const existingLines = lines.filter(([_, line2]) => line2 !== void 0);
  const padLen = Math.max(...existingLines.map(([prefix]) => prefix.length));
  return existingLines.map(([prefix, line2]) => prefix.padStart(padLen) + (line2 ? " " + line2 : "")).join("\n");
}

// node_modules/graphql/error/GraphQLError.mjs
var GraphQLError = class _GraphQLError extends Error {
  constructor(message, options2 = {}) {
    const { nodes, source, positions, path, originalError, cause, extensions } = options2;
    const hasCause = "cause" in options2;
    const errorCause = hasCause ? cause : originalError;
    const errorOptions = hasCause || originalError != null ? { cause: errorCause } : void 0;
    super(message, errorOptions);
    this.name = "GraphQLError";
    this.path = path ?? void 0;
    const underlyingError = originalError ?? (cause instanceof Error ? cause : void 0);
    this.originalError = underlyingError;
    this.nodes = undefinedIfEmpty(Array.isArray(nodes) ? nodes : nodes ? [nodes] : void 0);
    const nodeLocations = undefinedIfEmpty(this.nodes?.map((node) => node.loc).filter((loc) => loc != null));
    this.source = source ?? nodeLocations?.[0]?.source;
    this.positions = positions ?? nodeLocations?.map((loc) => loc.start);
    this.locations = positions && source ? positions.map((pos) => getLocation(source, pos)) : nodeLocations?.map((loc) => getLocation(loc.source, loc.start));
    const originalExtensions = isObjectLike(underlyingError?.extensions) ? underlyingError.extensions : void 0;
    this.extensions = extensions ?? originalExtensions ?? /* @__PURE__ */ Object.create(null);
    Object.defineProperties(this, {
      message: {
        writable: true,
        enumerable: true
      },
      name: { enumerable: false },
      nodes: { enumerable: false },
      source: { enumerable: false },
      positions: { enumerable: false },
      originalError: { enumerable: false }
    });
    if (originalError?.stack != null) {
      Object.defineProperty(this, "stack", {
        value: originalError.stack,
        writable: true,
        configurable: true
      });
    } else if (Error.captureStackTrace != null) {
      Error.captureStackTrace(this, _GraphQLError);
    } else {
      Object.defineProperty(this, "stack", {
        value: Error().stack,
        writable: true,
        configurable: true
      });
    }
  }
  get [Symbol.toStringTag]() {
    return "GraphQLError";
  }
  toString() {
    let output = this.message;
    if (this.nodes) {
      for (const node of this.nodes) {
        if (node.loc) {
          output += "\n\n" + printLocation(node.loc);
        }
      }
    } else if (this.source && this.locations) {
      for (const location of this.locations) {
        output += "\n\n" + printSourceLocation(this.source, location);
      }
    }
    return output;
  }
  toJSON() {
    const formattedError = {
      message: this.message
    };
    if (this.locations != null) {
      formattedError.locations = this.locations;
    }
    if (this.path != null) {
      formattedError.path = this.path;
    }
    if (this.extensions != null && Object.keys(this.extensions).length > 0) {
      formattedError.extensions = this.extensions;
    }
    return formattedError;
  }
};
function undefinedIfEmpty(array) {
  return array === void 0 || array.length === 0 ? void 0 : array;
}

// scripts/build/shims/function-object-has-own.js
var hasOwn = Object.hasOwn ?? Function.prototype.call.bind(Object.prototype.hasOwnProperty);
var function_object_has_own_default = hasOwn;

// node_modules/graphql/language/ast.mjs
var Location = class {
  constructor(startToken, endToken, source) {
    this.start = startToken.start;
    this.end = endToken.end;
    this.startToken = startToken;
    this.endToken = endToken;
    this.source = source;
  }
  get [Symbol.toStringTag]() {
    return "Location";
  }
  toJSON() {
    return { start: this.start, end: this.end };
  }
};
var Token = class {
  constructor(kind, start, end, line2, column, value) {
    this.kind = kind;
    this.start = start;
    this.end = end;
    this.line = line2;
    this.column = column;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
  get [Symbol.toStringTag]() {
    return "Token";
  }
  toJSON() {
    return {
      kind: this.kind,
      value: this.value,
      line: this.line,
      column: this.column
    };
  }
};
var OperationTypeNode = {
  QUERY: "query",
  MUTATION: "mutation",
  SUBSCRIPTION: "subscription"
};

// node_modules/graphql/language/kinds_.mjs
var kinds_exports = {};
__export(kinds_exports, {
  ARGUMENT: () => ARGUMENT,
  ARGUMENT_COORDINATE: () => ARGUMENT_COORDINATE,
  BOOLEAN: () => BOOLEAN,
  DIRECTIVE: () => DIRECTIVE,
  DIRECTIVE_ARGUMENT_COORDINATE: () => DIRECTIVE_ARGUMENT_COORDINATE,
  DIRECTIVE_COORDINATE: () => DIRECTIVE_COORDINATE,
  DIRECTIVE_DEFINITION: () => DIRECTIVE_DEFINITION,
  DIRECTIVE_EXTENSION: () => DIRECTIVE_EXTENSION,
  DOCUMENT: () => DOCUMENT,
  ENUM: () => ENUM,
  ENUM_TYPE_DEFINITION: () => ENUM_TYPE_DEFINITION,
  ENUM_TYPE_EXTENSION: () => ENUM_TYPE_EXTENSION,
  ENUM_VALUE_DEFINITION: () => ENUM_VALUE_DEFINITION,
  FIELD: () => FIELD,
  FIELD_DEFINITION: () => FIELD_DEFINITION,
  FLOAT: () => FLOAT,
  FRAGMENT_ARGUMENT: () => FRAGMENT_ARGUMENT,
  FRAGMENT_DEFINITION: () => FRAGMENT_DEFINITION,
  FRAGMENT_SPREAD: () => FRAGMENT_SPREAD,
  INLINE_FRAGMENT: () => INLINE_FRAGMENT,
  INPUT_OBJECT_TYPE_DEFINITION: () => INPUT_OBJECT_TYPE_DEFINITION,
  INPUT_OBJECT_TYPE_EXTENSION: () => INPUT_OBJECT_TYPE_EXTENSION,
  INPUT_VALUE_DEFINITION: () => INPUT_VALUE_DEFINITION,
  INT: () => INT,
  INTERFACE_TYPE_DEFINITION: () => INTERFACE_TYPE_DEFINITION,
  INTERFACE_TYPE_EXTENSION: () => INTERFACE_TYPE_EXTENSION,
  LIST: () => LIST,
  LIST_TYPE: () => LIST_TYPE,
  MEMBER_COORDINATE: () => MEMBER_COORDINATE,
  NAME: () => NAME,
  NAMED_TYPE: () => NAMED_TYPE,
  NON_NULL_TYPE: () => NON_NULL_TYPE,
  NULL: () => NULL,
  OBJECT: () => OBJECT,
  OBJECT_FIELD: () => OBJECT_FIELD,
  OBJECT_TYPE_DEFINITION: () => OBJECT_TYPE_DEFINITION,
  OBJECT_TYPE_EXTENSION: () => OBJECT_TYPE_EXTENSION,
  OPERATION_DEFINITION: () => OPERATION_DEFINITION,
  OPERATION_TYPE_DEFINITION: () => OPERATION_TYPE_DEFINITION,
  SCALAR_TYPE_DEFINITION: () => SCALAR_TYPE_DEFINITION,
  SCALAR_TYPE_EXTENSION: () => SCALAR_TYPE_EXTENSION,
  SCHEMA_DEFINITION: () => SCHEMA_DEFINITION,
  SCHEMA_EXTENSION: () => SCHEMA_EXTENSION,
  SELECTION_SET: () => SELECTION_SET,
  STRING: () => STRING,
  TYPE_COORDINATE: () => TYPE_COORDINATE,
  UNION_TYPE_DEFINITION: () => UNION_TYPE_DEFINITION,
  UNION_TYPE_EXTENSION: () => UNION_TYPE_EXTENSION,
  VARIABLE: () => VARIABLE,
  VARIABLE_DEFINITION: () => VARIABLE_DEFINITION
});
var NAME = "Name";
var DOCUMENT = "Document";
var OPERATION_DEFINITION = "OperationDefinition";
var VARIABLE_DEFINITION = "VariableDefinition";
var SELECTION_SET = "SelectionSet";
var FIELD = "Field";
var ARGUMENT = "Argument";
var FRAGMENT_ARGUMENT = "FragmentArgument";
var FRAGMENT_SPREAD = "FragmentSpread";
var INLINE_FRAGMENT = "InlineFragment";
var FRAGMENT_DEFINITION = "FragmentDefinition";
var VARIABLE = "Variable";
var INT = "IntValue";
var FLOAT = "FloatValue";
var STRING = "StringValue";
var BOOLEAN = "BooleanValue";
var NULL = "NullValue";
var ENUM = "EnumValue";
var LIST = "ListValue";
var OBJECT = "ObjectValue";
var OBJECT_FIELD = "ObjectField";
var DIRECTIVE = "Directive";
var NAMED_TYPE = "NamedType";
var LIST_TYPE = "ListType";
var NON_NULL_TYPE = "NonNullType";
var SCHEMA_DEFINITION = "SchemaDefinition";
var OPERATION_TYPE_DEFINITION = "OperationTypeDefinition";
var SCALAR_TYPE_DEFINITION = "ScalarTypeDefinition";
var OBJECT_TYPE_DEFINITION = "ObjectTypeDefinition";
var FIELD_DEFINITION = "FieldDefinition";
var INPUT_VALUE_DEFINITION = "InputValueDefinition";
var INTERFACE_TYPE_DEFINITION = "InterfaceTypeDefinition";
var UNION_TYPE_DEFINITION = "UnionTypeDefinition";
var ENUM_TYPE_DEFINITION = "EnumTypeDefinition";
var ENUM_VALUE_DEFINITION = "EnumValueDefinition";
var INPUT_OBJECT_TYPE_DEFINITION = "InputObjectTypeDefinition";
var DIRECTIVE_DEFINITION = "DirectiveDefinition";
var SCHEMA_EXTENSION = "SchemaExtension";
var DIRECTIVE_EXTENSION = "DirectiveExtension";
var SCALAR_TYPE_EXTENSION = "ScalarTypeExtension";
var OBJECT_TYPE_EXTENSION = "ObjectTypeExtension";
var INTERFACE_TYPE_EXTENSION = "InterfaceTypeExtension";
var UNION_TYPE_EXTENSION = "UnionTypeExtension";
var ENUM_TYPE_EXTENSION = "EnumTypeExtension";
var INPUT_OBJECT_TYPE_EXTENSION = "InputObjectTypeExtension";
var TYPE_COORDINATE = "TypeCoordinate";
var MEMBER_COORDINATE = "MemberCoordinate";
var ARGUMENT_COORDINATE = "ArgumentCoordinate";
var DIRECTIVE_COORDINATE = "DirectiveCoordinate";
var DIRECTIVE_ARGUMENT_COORDINATE = "DirectiveArgumentCoordinate";

// node_modules/graphql/jsutils/devAssert.mjs
function devAssert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// node_modules/graphql/language/characterClasses.mjs
function isWhiteSpace(code) {
  return code === 9 || code === 32;
}
function isDigit(code) {
  return code >= 48 && code <= 57;
}
function isLetter(code) {
  return code >= 97 && code <= 122 || code >= 65 && code <= 90;
}
function isNameStart(code) {
  return isLetter(code) || code === 95;
}
function isNameContinue(code) {
  return isLetter(code) || isDigit(code) || code === 95;
}

// node_modules/graphql/language/blockString.mjs
function dedentBlockStringLines(lines) {
  let commonIndent = Number.MAX_SAFE_INTEGER;
  let firstNonEmptyLine = null;
  let lastNonEmptyLine = -1;
  for (let i = 0; i < lines.length; ++i) {
    const line2 = lines[i];
    const indent2 = leadingWhitespace(line2);
    if (indent2 === line2.length) {
      continue;
    }
    firstNonEmptyLine ?? (firstNonEmptyLine = i);
    lastNonEmptyLine = i;
    if (i !== 0 && indent2 < commonIndent) {
      commonIndent = indent2;
    }
  }
  return lines.map((line2, i) => i === 0 ? line2 : line2.slice(commonIndent)).slice(firstNonEmptyLine ?? 0, lastNonEmptyLine + 1);
}
function leadingWhitespace(str) {
  let i = 0;
  while (i < str.length && isWhiteSpace(str.charCodeAt(i))) {
    ++i;
  }
  return i;
}

// node_modules/graphql/language/directiveLocation.mjs
var DirectiveLocation = {
  QUERY: "QUERY",
  MUTATION: "MUTATION",
  SUBSCRIPTION: "SUBSCRIPTION",
  FIELD: "FIELD",
  FRAGMENT_DEFINITION: "FRAGMENT_DEFINITION",
  FRAGMENT_SPREAD: "FRAGMENT_SPREAD",
  INLINE_FRAGMENT: "INLINE_FRAGMENT",
  VARIABLE_DEFINITION: "VARIABLE_DEFINITION",
  FRAGMENT_VARIABLE_DEFINITION: "FRAGMENT_VARIABLE_DEFINITION",
  SCHEMA: "SCHEMA",
  SCALAR: "SCALAR",
  OBJECT: "OBJECT",
  FIELD_DEFINITION: "FIELD_DEFINITION",
  ARGUMENT_DEFINITION: "ARGUMENT_DEFINITION",
  INTERFACE: "INTERFACE",
  UNION: "UNION",
  ENUM: "ENUM",
  ENUM_VALUE: "ENUM_VALUE",
  INPUT_OBJECT: "INPUT_OBJECT",
  INPUT_FIELD_DEFINITION: "INPUT_FIELD_DEFINITION",
  DIRECTIVE_DEFINITION: "DIRECTIVE_DEFINITION"
};

// node_modules/graphql/error/syntaxError.mjs
function syntaxError(source, position, description) {
  return new GraphQLError(`Syntax Error: ${description}`, {
    source,
    positions: [position]
  });
}

// node_modules/graphql/diagnostics.mjs
function resolveDiagnosticsChannel() {
  let dc2;
  try {
    const processRef = globalThis.process;
    if (typeof processRef?.getBuiltinModule === "function") {
      dc2 = processRef.getBuiltinModule("node:diagnostics_channel");
    }
  } catch {
  }
  return dc2;
}
var dc = resolveDiagnosticsChannel();
var parseChannel = dc?.tracingChannel("graphql:parse");
var validateChannel = dc?.tracingChannel("graphql:validate");
var executeChannel = dc?.tracingChannel("graphql:execute");
var executeVariableCoercionChannel = dc?.tracingChannel("graphql:execute:variableCoercion");
var executeRootSelectionSetChannel = dc?.tracingChannel("graphql:execute:rootSelectionSet");
var subscribeChannel = dc?.tracingChannel("graphql:subscribe");
var resolveChannel = dc?.tracingChannel("graphql:resolve");
var SUB_CHANNEL_KEYS = ["start", "end", "asyncStart", "asyncEnd", "error"];
function shouldTrace(channel) {
  if (channel == null) {
    return false;
  }
  const aggregate = channel.hasSubscribers;
  if (aggregate !== void 0) {
    return aggregate;
  }
  for (const key of SUB_CHANNEL_KEYS) {
    if (channel[key].hasSubscribers) {
      return true;
    }
  }
  return false;
}

// node_modules/graphql/language/tokenKind.mjs
var TokenKind = {
  SOF: "<SOF>",
  EOF: "<EOF>",
  BANG: "!",
  DOLLAR: "$",
  AMP: "&",
  PAREN_L: "(",
  PAREN_R: ")",
  DOT: ".",
  SPREAD: "...",
  COLON: ":",
  EQUALS: "=",
  AT: "@",
  BRACKET_L: "[",
  BRACKET_R: "]",
  BRACE_L: "{",
  PIPE: "|",
  BRACE_R: "}",
  NAME: "Name",
  INT: "Int",
  FLOAT: "Float",
  STRING: "String",
  BLOCK_STRING: "BlockString",
  COMMENT: "Comment"
};

// node_modules/graphql/language/lexer.mjs
var Lexer = class {
  constructor(source) {
    const startOfFileToken = new Token(TokenKind.SOF, 0, 0, 0, 0);
    this.source = source;
    this.lastToken = startOfFileToken;
    this.token = startOfFileToken;
    this.line = 1;
    this.lineStart = 0;
  }
  get [Symbol.toStringTag]() {
    return "Lexer";
  }
  advance() {
    this.lastToken = this.token;
    const token = this.token = this.lookahead();
    return token;
  }
  lookahead() {
    let token = this.token;
    if (token.kind !== TokenKind.EOF) {
      do {
        if (token.next) {
          token = token.next;
        } else {
          const nextToken = readNextToken(this, token.end);
          token.next = nextToken;
          nextToken.prev = token;
          token = nextToken;
        }
      } while (token.kind === TokenKind.COMMENT);
    }
    return token;
  }
};
function isPunctuatorTokenKind(kind) {
  return kind === TokenKind.BANG || kind === TokenKind.DOLLAR || kind === TokenKind.AMP || kind === TokenKind.PAREN_L || kind === TokenKind.PAREN_R || kind === TokenKind.DOT || kind === TokenKind.SPREAD || kind === TokenKind.COLON || kind === TokenKind.EQUALS || kind === TokenKind.AT || kind === TokenKind.BRACKET_L || kind === TokenKind.BRACKET_R || kind === TokenKind.BRACE_L || kind === TokenKind.PIPE || kind === TokenKind.BRACE_R;
}
function isUnicodeScalarValue(code) {
  return code >= 0 && code <= 55295 || code >= 57344 && code <= 1114111;
}
function isSupplementaryCodePoint(body, location) {
  return isLeadingSurrogate(body.charCodeAt(location)) && isTrailingSurrogate(body.charCodeAt(location + 1));
}
function isLeadingSurrogate(code) {
  return code >= 55296 && code <= 56319;
}
function isTrailingSurrogate(code) {
  return code >= 56320 && code <= 57343;
}
function printCodePointAt(lexer, location) {
  const code = lexer.source.body.codePointAt(location);
  if (code === void 0) {
    return TokenKind.EOF;
  } else if (code >= 32 && code <= 126) {
    const char = String.fromCodePoint(code);
    return char === '"' ? `'"'` : `"${char}"`;
  }
  return "U+" + code.toString(16).toUpperCase().padStart(4, "0");
}
function createToken(lexer, kind, start, end, value) {
  const line2 = lexer.line;
  const col = 1 + start - lexer.lineStart;
  return new Token(kind, start, end, line2, col, value);
}
function readNextToken(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let position = start;
  while (position < bodyLength) {
    const code = body.charCodeAt(position);
    switch (code) {
      case 65279:
      case 9:
      case 32:
      case 44:
        ++position;
        continue;
      case 10:
        ++position;
        ++lexer.line;
        lexer.lineStart = position;
        continue;
      case 13:
        if (body.charCodeAt(position + 1) === 10) {
          position += 2;
        } else {
          ++position;
        }
        ++lexer.line;
        lexer.lineStart = position;
        continue;
      case 35:
        return readComment(lexer, position);
      case 33:
        return createToken(lexer, TokenKind.BANG, position, position + 1);
      case 36:
        return createToken(lexer, TokenKind.DOLLAR, position, position + 1);
      case 38:
        return createToken(lexer, TokenKind.AMP, position, position + 1);
      case 40:
        return createToken(lexer, TokenKind.PAREN_L, position, position + 1);
      case 41:
        return createToken(lexer, TokenKind.PAREN_R, position, position + 1);
      case 46: {
        const nextCode = body.charCodeAt(position + 1);
        if (nextCode === 46 && body.charCodeAt(position + 2) === 46) {
          return createToken(lexer, TokenKind.SPREAD, position, position + 3);
        }
        if (nextCode === 46) {
          throw syntaxError(lexer.source, position, 'Unexpected "..", did you mean "..."?');
        } else if (isDigit(nextCode)) {
          const digits = lexer.source.body.slice(position + 1, readDigits(lexer, position + 1, nextCode));
          throw syntaxError(lexer.source, position, `Invalid number, expected digit before ".", did you mean "0.${digits}"?`);
        }
        break;
      }
      case 58:
        return createToken(lexer, TokenKind.COLON, position, position + 1);
      case 61:
        return createToken(lexer, TokenKind.EQUALS, position, position + 1);
      case 64:
        return createToken(lexer, TokenKind.AT, position, position + 1);
      case 91:
        return createToken(lexer, TokenKind.BRACKET_L, position, position + 1);
      case 93:
        return createToken(lexer, TokenKind.BRACKET_R, position, position + 1);
      case 123:
        return createToken(lexer, TokenKind.BRACE_L, position, position + 1);
      case 124:
        return createToken(lexer, TokenKind.PIPE, position, position + 1);
      case 125:
        return createToken(lexer, TokenKind.BRACE_R, position, position + 1);
      case 34:
        if (body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34) {
          return readBlockString(lexer, position);
        }
        return readString(lexer, position);
    }
    if (isDigit(code) || code === 45) {
      return readNumber(lexer, position, code);
    }
    if (isNameStart(code)) {
      return readName(lexer, position);
    }
    throw syntaxError(lexer.source, position, code === 39 ? `Unexpected single quote character ('), did you mean to use a double quote (")?` : isUnicodeScalarValue(code) || isSupplementaryCodePoint(body, position) ? `Unexpected character: ${printCodePointAt(lexer, position)}.` : `Invalid character: ${printCodePointAt(lexer, position)}.`);
  }
  return createToken(lexer, TokenKind.EOF, bodyLength, bodyLength);
}
function readComment(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let position = start + 1;
  while (position < bodyLength) {
    const code = body.charCodeAt(position);
    if (code === 10 || code === 13) {
      break;
    }
    if (isUnicodeScalarValue(code)) {
      ++position;
    } else if (isSupplementaryCodePoint(body, position)) {
      position += 2;
    } else {
      break;
    }
  }
  return createToken(lexer, TokenKind.COMMENT, start, position, body.slice(start + 1, position));
}
function readNumber(lexer, start, firstCode) {
  const body = lexer.source.body;
  let position = start;
  let code = firstCode;
  let isFloat = false;
  if (code === 45) {
    code = body.charCodeAt(++position);
  }
  if (code === 48) {
    code = body.charCodeAt(++position);
    if (isDigit(code)) {
      throw syntaxError(lexer.source, position, `Invalid number, unexpected digit after 0: ${printCodePointAt(lexer, position)}.`);
    }
  } else {
    position = readDigits(lexer, position, code);
    code = body.charCodeAt(position);
  }
  if (code === 46) {
    isFloat = true;
    code = body.charCodeAt(++position);
    position = readDigits(lexer, position, code);
    code = body.charCodeAt(position);
  }
  if (code === 69 || code === 101) {
    isFloat = true;
    code = body.charCodeAt(++position);
    if (code === 43 || code === 45) {
      code = body.charCodeAt(++position);
    }
    position = readDigits(lexer, position, code);
    code = body.charCodeAt(position);
  }
  if (code === 46 || isNameStart(code)) {
    throw syntaxError(lexer.source, position, `Invalid number, expected digit but got: ${printCodePointAt(lexer, position)}.`);
  }
  return createToken(lexer, isFloat ? TokenKind.FLOAT : TokenKind.INT, start, position, body.slice(start, position));
}
function readDigits(lexer, start, firstCode) {
  if (!isDigit(firstCode)) {
    throw syntaxError(lexer.source, start, `Invalid number, expected digit but got: ${printCodePointAt(lexer, start)}.`);
  }
  const body = lexer.source.body;
  let position = start + 1;
  while (isDigit(body.charCodeAt(position))) {
    ++position;
  }
  return position;
}
function readString(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let position = start + 1;
  let chunkStart = position;
  let value = "";
  while (position < bodyLength) {
    const code = body.charCodeAt(position);
    if (code === 34) {
      value += body.slice(chunkStart, position);
      return createToken(lexer, TokenKind.STRING, start, position + 1, value);
    }
    if (code === 92) {
      value += body.slice(chunkStart, position);
      const escape = body.charCodeAt(position + 1) === 117 ? body.charCodeAt(position + 2) === 123 ? readEscapedUnicodeVariableWidth(lexer, position) : readEscapedUnicodeFixedWidth(lexer, position) : readEscapedCharacter(lexer, position);
      value += escape.value;
      position += escape.size;
      chunkStart = position;
      continue;
    }
    if (code === 10 || code === 13) {
      break;
    }
    if (isUnicodeScalarValue(code)) {
      ++position;
    } else if (isSupplementaryCodePoint(body, position)) {
      position += 2;
    } else {
      throw syntaxError(lexer.source, position, `Invalid character within String: ${printCodePointAt(lexer, position)}.`);
    }
  }
  throw syntaxError(lexer.source, position, "Unterminated string.");
}
function readEscapedUnicodeVariableWidth(lexer, position) {
  const body = lexer.source.body;
  let point = 0;
  let size = 3;
  while (size < 12) {
    const code = body.charCodeAt(position + size++);
    if (code === 125) {
      if (size < 5 || !isUnicodeScalarValue(point)) {
        break;
      }
      return { value: String.fromCodePoint(point), size };
    }
    point = point << 4 | readHexDigit(code);
    if (point < 0) {
      break;
    }
  }
  throw syntaxError(lexer.source, position, `Invalid Unicode escape sequence: "${body.slice(position, position + size)}".`);
}
function readEscapedUnicodeFixedWidth(lexer, position) {
  const body = lexer.source.body;
  const code = read16BitHexCode(body, position + 2);
  if (isUnicodeScalarValue(code)) {
    return { value: String.fromCodePoint(code), size: 6 };
  }
  if (isLeadingSurrogate(code)) {
    if (body.charCodeAt(position + 6) === 92 && body.charCodeAt(position + 7) === 117) {
      const trailingCode = read16BitHexCode(body, position + 8);
      if (isTrailingSurrogate(trailingCode)) {
        return { value: String.fromCodePoint(code, trailingCode), size: 12 };
      }
    }
  }
  throw syntaxError(lexer.source, position, `Invalid Unicode escape sequence: "${body.slice(position, position + 6)}".`);
}
function read16BitHexCode(body, position) {
  return readHexDigit(body.charCodeAt(position)) << 12 | readHexDigit(body.charCodeAt(position + 1)) << 8 | readHexDigit(body.charCodeAt(position + 2)) << 4 | readHexDigit(body.charCodeAt(position + 3));
}
function readHexDigit(code) {
  return code >= 48 && code <= 57 ? code - 48 : code >= 65 && code <= 70 ? code - 55 : code >= 97 && code <= 102 ? code - 87 : -1;
}
function readEscapedCharacter(lexer, position) {
  const body = lexer.source.body;
  const code = body.charCodeAt(position + 1);
  switch (code) {
    case 34:
      return { value: '"', size: 2 };
    case 92:
      return { value: "\\", size: 2 };
    case 47:
      return { value: "/", size: 2 };
    case 98:
      return { value: "\b", size: 2 };
    case 102:
      return { value: "\f", size: 2 };
    case 110:
      return { value: "\n", size: 2 };
    case 114:
      return { value: "\r", size: 2 };
    case 116:
      return { value: "	", size: 2 };
  }
  throw syntaxError(lexer.source, position, `Invalid character escape sequence: "${body.slice(position, position + 2)}".`);
}
function readBlockString(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let lineStart = lexer.lineStart;
  let position = start + 3;
  let chunkStart = position;
  let currentLine = "";
  const blockLines = [];
  while (position < bodyLength) {
    const code = body.charCodeAt(position);
    if (code === 34 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34) {
      currentLine += body.slice(chunkStart, position);
      blockLines.push(currentLine);
      const token = createToken(lexer, TokenKind.BLOCK_STRING, start, position + 3, dedentBlockStringLines(blockLines).join("\n"));
      lexer.line += blockLines.length - 1;
      lexer.lineStart = lineStart;
      return token;
    }
    if (code === 92 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34 && body.charCodeAt(position + 3) === 34) {
      currentLine += body.slice(chunkStart, position);
      chunkStart = position + 1;
      position += 4;
      continue;
    }
    if (code === 10 || code === 13) {
      currentLine += body.slice(chunkStart, position);
      blockLines.push(currentLine);
      if (code === 13 && body.charCodeAt(position + 1) === 10) {
        position += 2;
      } else {
        ++position;
      }
      currentLine = "";
      chunkStart = position;
      lineStart = position;
      continue;
    }
    if (isUnicodeScalarValue(code)) {
      ++position;
    } else if (isSupplementaryCodePoint(body, position)) {
      position += 2;
    } else {
      throw syntaxError(lexer.source, position, `Invalid character within String: ${printCodePointAt(lexer, position)}.`);
    }
  }
  throw syntaxError(lexer.source, position, "Unterminated string.");
}
function readName(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let position = start + 1;
  while (position < bodyLength) {
    const code = body.charCodeAt(position);
    if (isNameContinue(code)) {
      ++position;
    } else {
      break;
    }
  }
  return createToken(lexer, TokenKind.NAME, start, position, body.slice(start, position));
}

// node_modules/graphql/language/source.mjs
var sourceSymbol = /* @__PURE__ */ Symbol("Source");
var Source = class {
  constructor(body, name = "GraphQL request", locationOffset = { line: 1, column: 1 }) {
    this.__kind = sourceSymbol;
    this.body = body;
    this.name = name;
    this.locationOffset = locationOffset;
    if (!(this.locationOffset.line > 0))
      devAssert(false, "line in locationOffset is 1-indexed and must be positive.");
    if (!(this.locationOffset.column > 0))
      devAssert(false, "column in locationOffset is 1-indexed and must be positive.");
  }
  get [Symbol.toStringTag]() {
    return "Source";
  }
};
function isSource(source) {
  return instanceOf(source, sourceSymbol, Source);
}

// node_modules/graphql/language/parser.mjs
function parse(source, options2) {
  return shouldTrace(parseChannel) ? parseChannel.traceSync(() => parseImpl(source, options2), {
    source
  }) : parseImpl(source, options2);
}
function parseImpl(source, options2) {
  const parser = new Parser(source, options2);
  const document = parser.parseDocument();
  Object.defineProperty(document, "tokenCount", {
    enumerable: false,
    value: parser.tokenCount
  });
  return document;
}
var Parser = class {
  constructor(source, options2 = {}) {
    const {
      lexer,
      ..._options
    } = options2;
    if (lexer) {
      this._lexer = lexer;
    } else {
      const sourceObj = isSource(source) ? source : new Source(source);
      this._lexer = new Lexer(sourceObj);
    }
    this._options = _options;
    this._tokenCounter = 0;
  }
  get tokenCount() {
    return this._tokenCounter;
  }
  parseName() {
    const token = this.expectToken(TokenKind.NAME);
    return this.node(token, {
      kind: kinds_exports.NAME,
      value: token.value
    });
  }
  parseDocument() {
    return this.node(this._lexer.token, {
      kind: kinds_exports.DOCUMENT,
      definitions: this.many(TokenKind.SOF, this.parseDefinition, TokenKind.EOF)
    });
  }
  parseDefinition() {
    if (this.peek(TokenKind.BRACE_L)) {
      return this.parseOperationDefinition();
    }
    const hasDescription = this.peekDescription();
    const keywordToken = hasDescription ? this._lexer.lookahead() : this._lexer.token;
    if (hasDescription && keywordToken.kind === TokenKind.BRACE_L) {
      throw syntaxError(this._lexer.source, this._lexer.token.start, "Unexpected description, descriptions are not supported on shorthand queries.");
    }
    if (keywordToken.kind === TokenKind.NAME) {
      switch (keywordToken.value) {
        case "schema":
          return this.parseSchemaDefinition();
        case "scalar":
          return this.parseScalarTypeDefinition();
        case "type":
          return this.parseObjectTypeDefinition();
        case "interface":
          return this.parseInterfaceTypeDefinition();
        case "union":
          return this.parseUnionTypeDefinition();
        case "enum":
          return this.parseEnumTypeDefinition();
        case "input":
          return this.parseInputObjectTypeDefinition();
        case "directive":
          return this.parseDirectiveDefinition();
      }
      switch (keywordToken.value) {
        case "query":
        case "mutation":
        case "subscription":
          return this.parseOperationDefinition();
        case "fragment":
          return this.parseFragmentDefinition();
      }
      if (hasDescription) {
        throw syntaxError(this._lexer.source, this._lexer.token.start, "Unexpected description, only GraphQL definitions support descriptions.");
      }
      switch (keywordToken.value) {
        case "extend":
          return this.parseTypeSystemExtension();
      }
    }
    throw this.unexpected(keywordToken);
  }
  parseOperationDefinition() {
    const start = this._lexer.token;
    if (this.peek(TokenKind.BRACE_L)) {
      return this.node(start, {
        kind: kinds_exports.OPERATION_DEFINITION,
        operation: OperationTypeNode.QUERY,
        description: void 0,
        name: void 0,
        variableDefinitions: void 0,
        directives: void 0,
        selectionSet: this.parseSelectionSet()
      });
    }
    const description = this.parseDescription();
    const operation = this.parseOperationType();
    let name;
    if (this.peek(TokenKind.NAME)) {
      name = this.parseName();
    }
    return this.node(start, {
      kind: kinds_exports.OPERATION_DEFINITION,
      operation,
      description,
      name,
      variableDefinitions: this.parseVariableDefinitions(),
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet()
    });
  }
  parseOperationType() {
    const operationToken = this.expectToken(TokenKind.NAME);
    switch (operationToken.value) {
      case "query":
        return OperationTypeNode.QUERY;
      case "mutation":
        return OperationTypeNode.MUTATION;
      case "subscription":
        return OperationTypeNode.SUBSCRIPTION;
    }
    throw this.unexpected(operationToken);
  }
  parseVariableDefinitions() {
    return this.optionalMany(TokenKind.PAREN_L, this.parseVariableDefinition, TokenKind.PAREN_R);
  }
  parseVariableDefinition() {
    return this.node(this._lexer.token, {
      kind: kinds_exports.VARIABLE_DEFINITION,
      description: this.parseDescription(),
      variable: this.parseVariable(),
      type: (this.expectToken(TokenKind.COLON), this.parseTypeReference()),
      defaultValue: this.expectOptionalToken(TokenKind.EQUALS) ? this.parseConstValueLiteral() : void 0,
      directives: this.parseConstDirectives()
    });
  }
  parseVariable() {
    const start = this._lexer.token;
    this.expectToken(TokenKind.DOLLAR);
    return this.node(start, {
      kind: kinds_exports.VARIABLE,
      name: this.parseName()
    });
  }
  parseSelectionSet() {
    return this.node(this._lexer.token, {
      kind: kinds_exports.SELECTION_SET,
      selections: this.many(TokenKind.BRACE_L, this.parseSelection, TokenKind.BRACE_R)
    });
  }
  parseSelection() {
    return this.peek(TokenKind.SPREAD) ? this.parseFragment() : this.parseField();
  }
  parseField() {
    const start = this._lexer.token;
    const nameOrAlias = this.parseName();
    let alias;
    let name;
    if (this.expectOptionalToken(TokenKind.COLON)) {
      alias = nameOrAlias;
      name = this.parseName();
    } else {
      name = nameOrAlias;
    }
    return this.node(start, {
      kind: kinds_exports.FIELD,
      alias,
      name,
      arguments: this.parseArguments(false),
      directives: this.parseDirectives(false),
      selectionSet: this.peek(TokenKind.BRACE_L) ? this.parseSelectionSet() : void 0
    });
  }
  parseArguments(isConst) {
    const item = isConst ? this.parseConstArgument : this.parseArgument;
    return this.optionalMany(TokenKind.PAREN_L, item, TokenKind.PAREN_R);
  }
  parseFragmentArguments() {
    const item = this.parseFragmentArgument;
    return this.optionalMany(TokenKind.PAREN_L, item, TokenKind.PAREN_R);
  }
  parseArgument(isConst = false) {
    const start = this._lexer.token;
    const name = this.parseName();
    this.expectToken(TokenKind.COLON);
    return this.node(start, {
      kind: kinds_exports.ARGUMENT,
      name,
      value: this.parseValueLiteral(isConst)
    });
  }
  parseConstArgument() {
    return this.parseArgument(true);
  }
  parseFragmentArgument() {
    const start = this._lexer.token;
    const name = this.parseName();
    this.expectToken(TokenKind.COLON);
    return this.node(start, {
      kind: kinds_exports.FRAGMENT_ARGUMENT,
      name,
      value: this.parseValueLiteral(false)
    });
  }
  parseFragment() {
    const start = this._lexer.token;
    this.expectToken(TokenKind.SPREAD);
    const hasTypeCondition = this.expectOptionalKeyword("on");
    if (!hasTypeCondition && this.peek(TokenKind.NAME)) {
      const name = this.parseFragmentName();
      if (this.peek(TokenKind.PAREN_L) && this._options.experimentalFragmentArguments) {
        return this.node(start, {
          kind: kinds_exports.FRAGMENT_SPREAD,
          name,
          arguments: this.parseFragmentArguments(),
          directives: this.parseDirectives(false)
        });
      }
      return this.node(start, {
        kind: kinds_exports.FRAGMENT_SPREAD,
        name,
        directives: this.parseDirectives(false)
      });
    }
    return this.node(start, {
      kind: kinds_exports.INLINE_FRAGMENT,
      typeCondition: hasTypeCondition ? this.parseNamedType() : void 0,
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet()
    });
  }
  parseFragmentDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("fragment");
    if (this._options.experimentalFragmentArguments === true) {
      return this.node(start, {
        kind: kinds_exports.FRAGMENT_DEFINITION,
        description,
        name: this.parseFragmentName(),
        variableDefinitions: this.parseVariableDefinitions(),
        typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
        directives: this.parseDirectives(false),
        selectionSet: this.parseSelectionSet()
      });
    }
    return this.node(start, {
      kind: kinds_exports.FRAGMENT_DEFINITION,
      description,
      name: this.parseFragmentName(),
      typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet()
    });
  }
  parseFragmentName() {
    if (this._lexer.token.value === "on") {
      throw this.unexpected();
    }
    return this.parseName();
  }
  parseValueLiteral(isConst) {
    const token = this._lexer.token;
    switch (token.kind) {
      case TokenKind.BRACKET_L:
        return this.parseList(isConst);
      case TokenKind.BRACE_L:
        return this.parseObject(isConst);
      case TokenKind.INT:
        this.advanceLexer();
        return this.node(token, {
          kind: kinds_exports.INT,
          value: token.value
        });
      case TokenKind.FLOAT:
        this.advanceLexer();
        return this.node(token, {
          kind: kinds_exports.FLOAT,
          value: token.value
        });
      case TokenKind.STRING:
      case TokenKind.BLOCK_STRING:
        return this.parseStringLiteral();
      case TokenKind.NAME:
        this.advanceLexer();
        switch (token.value) {
          case "true":
            return this.node(token, {
              kind: kinds_exports.BOOLEAN,
              value: true
            });
          case "false":
            return this.node(token, {
              kind: kinds_exports.BOOLEAN,
              value: false
            });
          case "null":
            return this.node(token, {
              kind: kinds_exports.NULL
            });
          default:
            return this.node(token, {
              kind: kinds_exports.ENUM,
              value: token.value
            });
        }
      case TokenKind.DOLLAR:
        if (isConst) {
          this.expectToken(TokenKind.DOLLAR);
          if (this._lexer.token.kind === TokenKind.NAME) {
            const varName = this._lexer.token.value;
            throw syntaxError(this._lexer.source, token.start, `Unexpected variable "$${varName}" in constant value.`);
          } else {
            throw this.unexpected(token);
          }
        }
        return this.parseVariable();
      default:
        throw this.unexpected();
    }
  }
  parseConstValueLiteral() {
    return this.parseValueLiteral(true);
  }
  parseStringLiteral() {
    const token = this._lexer.token;
    this.advanceLexer();
    return this.node(token, {
      kind: kinds_exports.STRING,
      value: token.value,
      block: token.kind === TokenKind.BLOCK_STRING
    });
  }
  parseList(isConst) {
    const item = () => this.parseValueLiteral(isConst);
    return this.node(this._lexer.token, {
      kind: kinds_exports.LIST,
      values: this.any(TokenKind.BRACKET_L, item, TokenKind.BRACKET_R)
    });
  }
  parseObject(isConst) {
    const item = () => this.parseObjectField(isConst);
    return this.node(this._lexer.token, {
      kind: kinds_exports.OBJECT,
      fields: this.any(TokenKind.BRACE_L, item, TokenKind.BRACE_R)
    });
  }
  parseObjectField(isConst) {
    const start = this._lexer.token;
    const name = this.parseName();
    this.expectToken(TokenKind.COLON);
    return this.node(start, {
      kind: kinds_exports.OBJECT_FIELD,
      name,
      value: this.parseValueLiteral(isConst)
    });
  }
  parseDirectives(isConst) {
    const directives = [];
    while (this.peek(TokenKind.AT)) {
      directives.push(this.parseDirective(isConst));
    }
    if (directives.length) {
      return directives;
    }
    return void 0;
  }
  parseConstDirectives() {
    return this.parseDirectives(true);
  }
  parseDirective(isConst) {
    const start = this._lexer.token;
    this.expectToken(TokenKind.AT);
    return this.node(start, {
      kind: kinds_exports.DIRECTIVE,
      name: this.parseName(),
      arguments: this.parseArguments(isConst)
    });
  }
  parseTypeReference() {
    const start = this._lexer.token;
    let type;
    if (this.expectOptionalToken(TokenKind.BRACKET_L)) {
      const innerType = this.parseTypeReference();
      this.expectToken(TokenKind.BRACKET_R);
      type = this.node(start, {
        kind: kinds_exports.LIST_TYPE,
        type: innerType
      });
    } else {
      type = this.parseNamedType();
    }
    if (this.expectOptionalToken(TokenKind.BANG)) {
      return this.node(start, {
        kind: kinds_exports.NON_NULL_TYPE,
        type
      });
    }
    return type;
  }
  parseNamedType() {
    return this.node(this._lexer.token, {
      kind: kinds_exports.NAMED_TYPE,
      name: this.parseName()
    });
  }
  peekDescription() {
    return this.peek(TokenKind.STRING) || this.peek(TokenKind.BLOCK_STRING);
  }
  parseDescription() {
    if (this.peekDescription()) {
      return this.parseStringLiteral();
    }
  }
  parseSchemaDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("schema");
    const directives = this.parseConstDirectives();
    const operationTypes = this.many(TokenKind.BRACE_L, this.parseOperationTypeDefinition, TokenKind.BRACE_R);
    return this.node(start, {
      kind: kinds_exports.SCHEMA_DEFINITION,
      description,
      directives,
      operationTypes
    });
  }
  parseOperationTypeDefinition() {
    const start = this._lexer.token;
    const operation = this.parseOperationType();
    this.expectToken(TokenKind.COLON);
    const type = this.parseNamedType();
    return this.node(start, {
      kind: kinds_exports.OPERATION_TYPE_DEFINITION,
      operation,
      type
    });
  }
  parseScalarTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("scalar");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    return this.node(start, {
      kind: kinds_exports.SCALAR_TYPE_DEFINITION,
      description,
      name,
      directives
    });
  }
  parseObjectTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("type");
    const name = this.parseName();
    const interfaces = this.parseImplementsInterfaces();
    const directives = this.parseConstDirectives();
    const fields = this.parseFieldsDefinition();
    return this.node(start, {
      kind: kinds_exports.OBJECT_TYPE_DEFINITION,
      description,
      name,
      interfaces,
      directives,
      fields
    });
  }
  parseImplementsInterfaces() {
    return this.expectOptionalKeyword("implements") ? this.delimitedMany(TokenKind.AMP, this.parseNamedType) : void 0;
  }
  parseFieldsDefinition() {
    return this.optionalMany(TokenKind.BRACE_L, this.parseFieldDefinition, TokenKind.BRACE_R);
  }
  parseFieldDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    const name = this.parseName();
    const args = this.parseArgumentDefs();
    this.expectToken(TokenKind.COLON);
    const type = this.parseTypeReference();
    const directives = this.parseConstDirectives();
    return this.node(start, {
      kind: kinds_exports.FIELD_DEFINITION,
      description,
      name,
      arguments: args,
      type,
      directives
    });
  }
  parseArgumentDefs() {
    return this.optionalMany(TokenKind.PAREN_L, this.parseInputValueDef, TokenKind.PAREN_R);
  }
  parseInputValueDef() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    const name = this.parseName();
    this.expectToken(TokenKind.COLON);
    const type = this.parseTypeReference();
    let defaultValue;
    if (this.expectOptionalToken(TokenKind.EQUALS)) {
      defaultValue = this.parseConstValueLiteral();
    }
    const directives = this.parseConstDirectives();
    return this.node(start, {
      kind: kinds_exports.INPUT_VALUE_DEFINITION,
      description,
      name,
      type,
      defaultValue,
      directives
    });
  }
  parseInterfaceTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("interface");
    const name = this.parseName();
    const interfaces = this.parseImplementsInterfaces();
    const directives = this.parseConstDirectives();
    const fields = this.parseFieldsDefinition();
    return this.node(start, {
      kind: kinds_exports.INTERFACE_TYPE_DEFINITION,
      description,
      name,
      interfaces,
      directives,
      fields
    });
  }
  parseUnionTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("union");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const types = this.parseUnionMemberTypes();
    return this.node(start, {
      kind: kinds_exports.UNION_TYPE_DEFINITION,
      description,
      name,
      directives,
      types
    });
  }
  parseUnionMemberTypes() {
    return this.expectOptionalToken(TokenKind.EQUALS) ? this.delimitedMany(TokenKind.PIPE, this.parseNamedType) : void 0;
  }
  parseEnumTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("enum");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const values = this.parseEnumValuesDefinition();
    return this.node(start, {
      kind: kinds_exports.ENUM_TYPE_DEFINITION,
      description,
      name,
      directives,
      values
    });
  }
  parseEnumValuesDefinition() {
    return this.optionalMany(TokenKind.BRACE_L, this.parseEnumValueDefinition, TokenKind.BRACE_R);
  }
  parseEnumValueDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    const name = this.parseEnumValueName();
    const directives = this.parseConstDirectives();
    return this.node(start, {
      kind: kinds_exports.ENUM_VALUE_DEFINITION,
      description,
      name,
      directives
    });
  }
  parseEnumValueName() {
    if (this._lexer.token.value === "true" || this._lexer.token.value === "false" || this._lexer.token.value === "null") {
      throw syntaxError(this._lexer.source, this._lexer.token.start, `${getTokenDesc(this._lexer.token)} is reserved and cannot be used for an enum value.`);
    }
    return this.parseName();
  }
  parseInputObjectTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("input");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const fields = this.parseInputFieldsDefinition();
    return this.node(start, {
      kind: kinds_exports.INPUT_OBJECT_TYPE_DEFINITION,
      description,
      name,
      directives,
      fields
    });
  }
  parseInputFieldsDefinition() {
    return this.optionalMany(TokenKind.BRACE_L, this.parseInputValueDef, TokenKind.BRACE_R);
  }
  parseTypeSystemExtension() {
    const keywordToken = this._lexer.lookahead();
    if (keywordToken.kind === TokenKind.NAME) {
      switch (keywordToken.value) {
        case "schema":
          return this.parseSchemaExtension();
        case "scalar":
          return this.parseScalarTypeExtension();
        case "type":
          return this.parseObjectTypeExtension();
        case "interface":
          return this.parseInterfaceTypeExtension();
        case "union":
          return this.parseUnionTypeExtension();
        case "enum":
          return this.parseEnumTypeExtension();
        case "input":
          return this.parseInputObjectTypeExtension();
        case "directive":
          return this.parseDirectiveExtension();
      }
    }
    throw this.unexpected(keywordToken);
  }
  parseSchemaExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("schema");
    const directives = this.parseConstDirectives();
    const operationTypes = this.optionalMany(TokenKind.BRACE_L, this.parseOperationTypeDefinition, TokenKind.BRACE_R);
    if (directives === void 0 && operationTypes === void 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: kinds_exports.SCHEMA_EXTENSION,
      directives,
      operationTypes
    });
  }
  parseScalarTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("scalar");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    if (directives === void 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: kinds_exports.SCALAR_TYPE_EXTENSION,
      name,
      directives
    });
  }
  parseObjectTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("type");
    const name = this.parseName();
    const interfaces = this.parseImplementsInterfaces();
    const directives = this.parseConstDirectives();
    const fields = this.parseFieldsDefinition();
    if (interfaces === void 0 && directives === void 0 && fields === void 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: kinds_exports.OBJECT_TYPE_EXTENSION,
      name,
      interfaces,
      directives,
      fields
    });
  }
  parseInterfaceTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("interface");
    const name = this.parseName();
    const interfaces = this.parseImplementsInterfaces();
    const directives = this.parseConstDirectives();
    const fields = this.parseFieldsDefinition();
    if (interfaces === void 0 && directives === void 0 && fields === void 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: kinds_exports.INTERFACE_TYPE_EXTENSION,
      name,
      interfaces,
      directives,
      fields
    });
  }
  parseUnionTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("union");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const types = this.parseUnionMemberTypes();
    if (directives === void 0 && types === void 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: kinds_exports.UNION_TYPE_EXTENSION,
      name,
      directives,
      types
    });
  }
  parseEnumTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("enum");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const values = this.parseEnumValuesDefinition();
    if (directives === void 0 && values === void 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: kinds_exports.ENUM_TYPE_EXTENSION,
      name,
      directives,
      values
    });
  }
  parseInputObjectTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("input");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const fields = this.parseInputFieldsDefinition();
    if (directives === void 0 && fields === void 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: kinds_exports.INPUT_OBJECT_TYPE_EXTENSION,
      name,
      directives,
      fields
    });
  }
  parseDirectiveExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("directive");
    this.expectToken(TokenKind.AT);
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    if (directives === void 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: kinds_exports.DIRECTIVE_EXTENSION,
      name,
      directives
    });
  }
  parseDirectiveDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("directive");
    this.expectToken(TokenKind.AT);
    const name = this.parseName();
    const args = this.parseArgumentDefs();
    const directives = this.parseConstDirectives();
    const repeatable = this.expectOptionalKeyword("repeatable");
    this.expectKeyword("on");
    const locations = this.parseDirectiveLocations();
    return this.node(start, {
      kind: kinds_exports.DIRECTIVE_DEFINITION,
      description,
      name,
      arguments: args,
      directives,
      repeatable,
      locations
    });
  }
  parseDirectiveLocations() {
    return this.delimitedMany(TokenKind.PIPE, this.parseDirectiveLocation);
  }
  parseDirectiveLocation() {
    const start = this._lexer.token;
    const name = this.parseName();
    if (function_object_has_own_default(DirectiveLocation, name.value)) {
      return name;
    }
    throw this.unexpected(start);
  }
  parseSchemaCoordinate() {
    const start = this._lexer.token;
    const ofDirective = this.expectOptionalToken(TokenKind.AT);
    const name = this.parseName();
    let memberName;
    if (!ofDirective && this.expectOptionalToken(TokenKind.DOT)) {
      memberName = this.parseName();
    }
    let argumentName;
    if ((ofDirective || memberName) && this.expectOptionalToken(TokenKind.PAREN_L)) {
      argumentName = this.parseName();
      this.expectToken(TokenKind.COLON);
      this.expectToken(TokenKind.PAREN_R);
    }
    if (ofDirective) {
      if (argumentName) {
        return this.node(start, {
          kind: kinds_exports.DIRECTIVE_ARGUMENT_COORDINATE,
          name,
          argumentName
        });
      }
      return this.node(start, {
        kind: kinds_exports.DIRECTIVE_COORDINATE,
        name
      });
    } else if (memberName) {
      if (argumentName) {
        return this.node(start, {
          kind: kinds_exports.ARGUMENT_COORDINATE,
          name,
          fieldName: memberName,
          argumentName
        });
      }
      return this.node(start, {
        kind: kinds_exports.MEMBER_COORDINATE,
        name,
        memberName
      });
    }
    return this.node(start, {
      kind: kinds_exports.TYPE_COORDINATE,
      name
    });
  }
  node(startToken, node) {
    if (this._options.noLocation !== true) {
      node.loc = new Location(startToken, this._lexer.lastToken, this._lexer.source);
    }
    return node;
  }
  peek(kind) {
    return this._lexer.token.kind === kind;
  }
  expectToken(kind) {
    const token = this._lexer.token;
    if (token.kind === kind) {
      this.advanceLexer();
      return token;
    }
    throw syntaxError(this._lexer.source, token.start, `Expected ${getTokenKindDesc(kind)}, found ${getTokenDesc(token)}.`);
  }
  expectOptionalToken(kind) {
    const token = this._lexer.token;
    if (token.kind === kind) {
      this.advanceLexer();
      return true;
    }
    return false;
  }
  expectKeyword(value) {
    const token = this._lexer.token;
    if (token.kind === TokenKind.NAME && token.value === value) {
      this.advanceLexer();
    } else {
      throw syntaxError(this._lexer.source, token.start, `Expected "${value}", found ${getTokenDesc(token)}.`);
    }
  }
  expectOptionalKeyword(value) {
    const token = this._lexer.token;
    if (token.kind === TokenKind.NAME && token.value === value) {
      this.advanceLexer();
      return true;
    }
    return false;
  }
  unexpected(atToken) {
    const token = atToken ?? this._lexer.token;
    return syntaxError(this._lexer.source, token.start, `Unexpected ${getTokenDesc(token)}.`);
  }
  any(openKind, parseFn, closeKind) {
    this.expectToken(openKind);
    const nodes = [];
    while (!this.expectOptionalToken(closeKind)) {
      nodes.push(parseFn.call(this));
    }
    return nodes;
  }
  optionalMany(openKind, parseFn, closeKind) {
    if (this.expectOptionalToken(openKind)) {
      const nodes = [];
      do {
        nodes.push(parseFn.call(this));
      } while (!this.expectOptionalToken(closeKind));
      return nodes;
    }
    return void 0;
  }
  many(openKind, parseFn, closeKind) {
    this.expectToken(openKind);
    const nodes = [];
    do {
      nodes.push(parseFn.call(this));
    } while (!this.expectOptionalToken(closeKind));
    return nodes;
  }
  delimitedMany(delimiterKind, parseFn) {
    this.expectOptionalToken(delimiterKind);
    const nodes = [];
    do {
      nodes.push(parseFn.call(this));
    } while (this.expectOptionalToken(delimiterKind));
    return nodes;
  }
  advanceLexer() {
    const {
      maxTokens
    } = this._options;
    const token = this._lexer.advance();
    if (token.kind !== TokenKind.EOF) {
      ++this._tokenCounter;
      if (maxTokens !== void 0 && this._tokenCounter > maxTokens) {
        throw syntaxError(this._lexer.source, token.start, `Document contains more than ${maxTokens} tokens. Parsing aborted.`);
      }
    }
  }
};
function getTokenDesc(token) {
  const value = token.value;
  return getTokenKindDesc(token.kind) + (value != null ? ` "${value}"` : "");
}
function getTokenKindDesc(kind) {
  return isPunctuatorTokenKind(kind) ? `"${kind}"` : kind;
}

// src/common/parser-create-error.js
function createError(message, options2) {
  const error = new SyntaxError(
    message + " (" + options2.loc.start.line + ":" + options2.loc.start.column + ")"
  );
  return Object.assign(error, options2);
}
var parser_create_error_default = createError;

// src/language-graphql/parser-graphql.js
function parseComments(ast) {
  const comments = [];
  const { startToken, endToken } = ast.loc;
  for (let token = startToken; token !== endToken; token = token.next) {
    if (token.kind === "Comment") {
      comments.push({ ...token, loc: { start: token.start, end: token.end } });
    }
  }
  return comments;
}
var parseOptions = {
  experimentalFragmentArguments: true
};
function createParseError(error) {
  if (!(error instanceof GraphQLError)) {
    return error;
  }
  const {
    message,
    locations: [start]
  } = error;
  return parser_create_error_default(message, { loc: { start }, cause: error });
}
function parse2(text) {
  let ast;
  try {
    ast = parse(text, parseOptions);
  } catch (error) {
    throw createParseError(error);
  }
  ast.comments = parseComments(ast);
  return ast;
}
var graphql = {
  parse: parse2,
  astFormat: "graphql",
  hasPragma,
  hasIgnorePragma,
  locStart,
  locEnd
};

// src/language-graphql/index.js
var printers = {
  graphql: printer_graphql_default
};
export {
  graphql_exports as default,
  languages_evaluate_default as languages,
  options_default as options,
  parser_graphql_exports as parsers,
  printers
};
