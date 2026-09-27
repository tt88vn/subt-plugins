var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all2) => {
  for (var name in all2)
    __defProp(target, name, { get: all2[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/remark-footnotes/index.js
var require_remark_footnotes = __commonJS({
  "node_modules/remark-footnotes/index.js"(exports, module) {
    "use strict";
    module.exports = footnotes2;
    var tab = 9;
    var lineFeed = 10;
    var space = 32;
    var exclamationMark = 33;
    var colon = 58;
    var leftSquareBracket = 91;
    var backslash = 92;
    var rightSquareBracket = 93;
    var caret = 94;
    var graveAccent = 96;
    var tabSize = 4;
    var maxSlice = 1024;
    function footnotes2(options2) {
      var parser = this.Parser;
      var compiler2 = this.Compiler;
      if (isRemarkParser(parser)) {
        attachParser(parser, options2);
      }
      if (isRemarkCompiler(compiler2)) {
        attachCompiler(compiler2);
      }
    }
    function isRemarkParser(parser) {
      return Boolean(parser && parser.prototype && parser.prototype.blockTokenizers);
    }
    function isRemarkCompiler(compiler2) {
      return Boolean(compiler2 && compiler2.prototype && compiler2.prototype.visitors);
    }
    function attachParser(parser, options2) {
      var settings = options2 || {};
      var proto = parser.prototype;
      var blocks = proto.blockTokenizers;
      var spans = proto.inlineTokenizers;
      var blockMethods = proto.blockMethods;
      var inlineMethods = proto.inlineMethods;
      var originalDefinition = blocks.definition;
      var originalReference = spans.reference;
      var interruptors = [];
      var index2 = -1;
      var length = blockMethods.length;
      var method;
      while (++index2 < length) {
        method = blockMethods[index2];
        if (method === "newline" || method === "indentedCode" || method === "paragraph" || method === "footnoteDefinition") {
          continue;
        }
        interruptors.push([method]);
      }
      interruptors.push(["footnoteDefinition"]);
      if (settings.inlineNotes) {
        before(inlineMethods, "reference", "inlineNote");
        spans.inlineNote = footnote;
      }
      before(blockMethods, "definition", "footnoteDefinition");
      before(inlineMethods, "reference", "footnoteCall");
      blocks.definition = definition2;
      blocks.footnoteDefinition = footnoteDefinition;
      spans.footnoteCall = footnoteCall;
      spans.reference = reference;
      proto.interruptFootnoteDefinition = interruptors;
      reference.locator = originalReference.locator;
      footnoteCall.locator = locateFootnoteCall;
      footnote.locator = locateFootnote;
      function footnoteDefinition(eat, value, silent) {
        var self = this;
        var interruptors2 = self.interruptFootnoteDefinition;
        var offsets = self.offset;
        var length2 = value.length + 1;
        var index3 = 0;
        var content3 = [];
        var label;
        var labelStart;
        var labelEnd2;
        var code2;
        var now;
        var add;
        var exit3;
        var children;
        var start;
        var indent3;
        var contentStart;
        var lines;
        var line2;
        while (index3 < length2) {
          code2 = value.charCodeAt(index3);
          if (code2 !== tab && code2 !== space) break;
          index3++;
        }
        if (value.charCodeAt(index3++) !== leftSquareBracket) return;
        if (value.charCodeAt(index3++) !== caret) return;
        labelStart = index3;
        while (index3 < length2) {
          code2 = value.charCodeAt(index3);
          if (code2 !== code2 || code2 === lineFeed || code2 === tab || code2 === space) {
            return;
          }
          if (code2 === rightSquareBracket) {
            labelEnd2 = index3;
            index3++;
            break;
          }
          index3++;
        }
        if (labelEnd2 === void 0 || labelStart === labelEnd2 || value.charCodeAt(index3++) !== colon) {
          return;
        }
        if (silent) {
          return true;
        }
        label = value.slice(labelStart, labelEnd2);
        now = eat.now();
        start = 0;
        indent3 = 0;
        contentStart = index3;
        lines = [];
        while (index3 < length2) {
          code2 = value.charCodeAt(index3);
          if (code2 !== code2 || code2 === lineFeed) {
            line2 = {
              start,
              contentStart: contentStart || index3,
              contentEnd: index3,
              end: index3
            };
            lines.push(line2);
            if (code2 === lineFeed) {
              start = index3 + 1;
              indent3 = 0;
              contentStart = void 0;
              line2.end = start;
            }
          } else if (indent3 !== void 0) {
            if (code2 === space || code2 === tab) {
              indent3 += code2 === space ? 1 : tabSize - indent3 % tabSize;
              if (indent3 > tabSize) {
                indent3 = void 0;
                contentStart = index3;
              }
            } else {
              if (indent3 < tabSize && line2 && (line2.contentStart === line2.contentEnd || interrupt(interruptors2, blocks, self, [
                eat,
                value.slice(index3, maxSlice),
                true
              ]))) {
                break;
              }
              indent3 = void 0;
              contentStart = index3;
            }
          }
          index3++;
        }
        index3 = -1;
        length2 = lines.length;
        while (length2 > 0) {
          line2 = lines[length2 - 1];
          if (line2.contentStart !== line2.contentEnd) {
            break;
          }
          length2--;
        }
        add = eat(value.slice(0, line2.contentEnd));
        while (++index3 < length2) {
          line2 = lines[index3];
          offsets[now.line + index3] = (offsets[now.line + index3] || 0) + (line2.contentStart - line2.start);
          content3.push(value.slice(line2.contentStart, line2.end));
        }
        exit3 = self.enterBlock();
        children = self.tokenizeBlock(content3.join(""), now);
        exit3();
        return add({
          type: "footnoteDefinition",
          identifier: label.toLowerCase(),
          label,
          children
        });
      }
      function footnoteCall(eat, value, silent) {
        var length2 = value.length + 1;
        var index3 = 0;
        var label;
        var labelStart;
        var labelEnd2;
        var code2;
        if (value.charCodeAt(index3++) !== leftSquareBracket) return;
        if (value.charCodeAt(index3++) !== caret) return;
        labelStart = index3;
        while (index3 < length2) {
          code2 = value.charCodeAt(index3);
          if (code2 !== code2 || code2 === lineFeed || code2 === tab || code2 === space) {
            return;
          }
          if (code2 === rightSquareBracket) {
            labelEnd2 = index3;
            index3++;
            break;
          }
          index3++;
        }
        if (labelEnd2 === void 0 || labelStart === labelEnd2) {
          return;
        }
        if (silent) {
          return true;
        }
        label = value.slice(labelStart, labelEnd2);
        return eat(value.slice(0, index3))({
          type: "footnoteReference",
          identifier: label.toLowerCase(),
          label
        });
      }
      function footnote(eat, value, silent) {
        var self = this;
        var length2 = value.length + 1;
        var index3 = 0;
        var balance = 0;
        var now;
        var code2;
        var contentStart;
        var contentEnd;
        var fenceStart;
        var fenceOpenSize;
        var fenceCloseSize;
        if (value.charCodeAt(index3++) !== caret) return;
        if (value.charCodeAt(index3++) !== leftSquareBracket) return;
        contentStart = index3;
        while (index3 < length2) {
          code2 = value.charCodeAt(index3);
          if (code2 !== code2) {
            return;
          }
          if (fenceOpenSize === void 0) {
            if (code2 === backslash) {
              index3 += 2;
            } else if (code2 === leftSquareBracket) {
              balance++;
              index3++;
            } else if (code2 === rightSquareBracket) {
              if (balance === 0) {
                contentEnd = index3;
                index3++;
                break;
              } else {
                balance--;
                index3++;
              }
            } else if (code2 === graveAccent) {
              fenceStart = index3;
              fenceOpenSize = 1;
              while (value.charCodeAt(fenceStart + fenceOpenSize) === graveAccent) {
                fenceOpenSize++;
              }
              index3 += fenceOpenSize;
            } else {
              index3++;
            }
          } else {
            if (code2 === graveAccent) {
              fenceStart = index3;
              fenceCloseSize = 1;
              while (value.charCodeAt(fenceStart + fenceCloseSize) === graveAccent) {
                fenceCloseSize++;
              }
              index3 += fenceCloseSize;
              if (fenceOpenSize === fenceCloseSize) {
                fenceOpenSize = void 0;
              }
              fenceCloseSize = void 0;
            } else {
              index3++;
            }
          }
        }
        if (contentEnd === void 0) {
          return;
        }
        if (silent) {
          return true;
        }
        now = eat.now();
        now.column += 2;
        now.offset += 2;
        return eat(value.slice(0, index3))({
          type: "footnote",
          children: self.tokenizeInline(value.slice(contentStart, contentEnd), now)
        });
      }
      function reference(eat, value, silent) {
        var index3 = 0;
        if (value.charCodeAt(index3) === exclamationMark) index3++;
        if (value.charCodeAt(index3) !== leftSquareBracket) return;
        if (value.charCodeAt(index3 + 1) === caret) return;
        return originalReference.call(this, eat, value, silent);
      }
      function definition2(eat, value, silent) {
        var index3 = 0;
        var code2 = value.charCodeAt(index3);
        while (code2 === space || code2 === tab) code2 = value.charCodeAt(++index3);
        if (code2 !== leftSquareBracket) return;
        if (value.charCodeAt(index3 + 1) === caret) return;
        return originalDefinition.call(this, eat, value, silent);
      }
      function locateFootnoteCall(value, from) {
        return value.indexOf("[", from);
      }
      function locateFootnote(value, from) {
        return value.indexOf("^[", from);
      }
    }
    function attachCompiler(compiler2) {
      var serializers = compiler2.prototype.visitors;
      var indent3 = "    ";
      serializers.footnote = footnote;
      serializers.footnoteReference = footnoteReference2;
      serializers.footnoteDefinition = footnoteDefinition;
      function footnote(node2) {
        return "^[" + this.all(node2).join("") + "]";
      }
      function footnoteReference2(node2) {
        return "[^" + (node2.label || node2.identifier) + "]";
      }
      function footnoteDefinition(node2) {
        var lines = this.all(node2).join("\n\n").split("\n");
        var index2 = 0;
        var length = lines.length;
        var line2;
        while (++index2 < length) {
          line2 = lines[index2];
          if (line2 === "") continue;
          lines[index2] = indent3 + line2;
        }
        return "[^" + (node2.label || node2.identifier) + "]: " + lines.join("\n");
      }
    }
    function before(list2, before2, value) {
      list2.splice(list2.indexOf(before2), 0, value);
    }
    function interrupt(list2, tokenizers, ctx, parameters) {
      var length = list2.length;
      var index2 = -1;
      while (++index2 < length) {
        if (tokenizers[list2[index2][0]].apply(ctx, parameters)) {
          return true;
        }
      }
      return false;
    }
  }
});

// node_modules/remark-math/util.js
var require_util = __commonJS({
  "node_modules/remark-math/util.js"(exports) {
    exports.isRemarkParser = isRemarkParser;
    exports.isRemarkCompiler = isRemarkCompiler;
    function isRemarkParser(parser) {
      return Boolean(parser && parser.prototype && parser.prototype.blockTokenizers);
    }
    function isRemarkCompiler(compiler2) {
      return Boolean(compiler2 && compiler2.prototype && compiler2.prototype.visitors);
    }
  }
});

// node_modules/remark-math/inline.js
var require_inline = __commonJS({
  "node_modules/remark-math/inline.js"(exports, module) {
    var util = require_util();
    module.exports = mathInline;
    var tab = 9;
    var space = 32;
    var dollarSign = 36;
    var digit0 = 48;
    var digit9 = 57;
    var backslash = 92;
    var classList = ["math", "math-inline"];
    var mathDisplay = "math-display";
    function mathInline(options2) {
      const parser = this.Parser;
      const compiler2 = this.Compiler;
      if (util.isRemarkParser(parser)) {
        attachParser(parser, options2);
      }
      if (util.isRemarkCompiler(compiler2)) {
        attachCompiler(compiler2, options2);
      }
    }
    function attachParser(parser, options2) {
      const proto = parser.prototype;
      const inlineMethods = proto.inlineMethods;
      mathInlineTokenizer.locator = locator;
      proto.inlineTokenizers.math = mathInlineTokenizer;
      inlineMethods.splice(inlineMethods.indexOf("text"), 0, "math");
      function locator(value, fromIndex) {
        return value.indexOf("$", fromIndex);
      }
      function mathInlineTokenizer(eat, value, silent) {
        const length = value.length;
        let double = false;
        let escaped = false;
        let index2 = 0;
        let previous4;
        let code2;
        let next;
        let contentStart;
        let contentEnd;
        let valueEnd;
        let content3;
        if (value.charCodeAt(index2) === backslash) {
          escaped = true;
          index2++;
        }
        if (value.charCodeAt(index2) !== dollarSign) {
          return;
        }
        index2++;
        if (escaped) {
          if (silent) {
            return true;
          }
          return eat(value.slice(0, index2))({ type: "text", value: "$" });
        }
        if (value.charCodeAt(index2) === dollarSign) {
          double = true;
          index2++;
        }
        next = value.charCodeAt(index2);
        if (next === space || next === tab) {
          return;
        }
        contentStart = index2;
        while (index2 < length) {
          code2 = next;
          next = value.charCodeAt(index2 + 1);
          if (code2 === dollarSign) {
            previous4 = value.charCodeAt(index2 - 1);
            if (previous4 !== space && previous4 !== tab && // eslint-disable-next-line no-self-compare
            (next !== next || next < digit0 || next > digit9) && (!double || next === dollarSign)) {
              contentEnd = index2 - 1;
              index2++;
              if (double) {
                index2++;
              }
              valueEnd = index2;
              break;
            }
          } else if (code2 === backslash) {
            index2++;
            next = value.charCodeAt(index2 + 1);
          }
          index2++;
        }
        if (valueEnd === void 0) {
          return;
        }
        if (silent) {
          return true;
        }
        content3 = value.slice(contentStart, contentEnd + 1);
        return eat(value.slice(0, valueEnd))({
          type: "inlineMath",
          value: content3,
          data: {
            hName: "span",
            hProperties: {
              className: classList.concat(
                double && options2.inlineMathDouble ? [mathDisplay] : []
              )
            },
            hChildren: [{ type: "text", value: content3 }]
          }
        });
      }
    }
    function attachCompiler(compiler2) {
      const proto = compiler2.prototype;
      proto.visitors.inlineMath = compileInlineMath;
      function compileInlineMath(node2) {
        let fence = "$";
        const classes = node2.data && node2.data.hProperties && node2.data.hProperties.className || [];
        if (classes.includes(mathDisplay)) {
          fence = "$$";
        }
        return fence + node2.value + fence;
      }
    }
  }
});

// node_modules/remark-math/block.js
var require_block = __commonJS({
  "node_modules/remark-math/block.js"(exports, module) {
    var util = require_util();
    module.exports = mathBlock;
    var lineFeed = 10;
    var space = 32;
    var dollarSign = 36;
    var lineFeedChar = "\n";
    var dollarSignChar = "$";
    var minFenceCount = 2;
    var classList = ["math", "math-display"];
    function mathBlock() {
      const parser = this.Parser;
      const compiler2 = this.Compiler;
      if (util.isRemarkParser(parser)) {
        attachParser(parser);
      }
      if (util.isRemarkCompiler(compiler2)) {
        attachCompiler(compiler2);
      }
    }
    function attachParser(parser) {
      const proto = parser.prototype;
      const blockMethods = proto.blockMethods;
      const interruptParagraph = proto.interruptParagraph;
      const interruptList = proto.interruptList;
      const interruptBlockquote = proto.interruptBlockquote;
      proto.blockTokenizers.math = mathBlockTokenizer;
      blockMethods.splice(blockMethods.indexOf("fencedCode") + 1, 0, "math");
      interruptParagraph.splice(interruptParagraph.indexOf("fencedCode") + 1, 0, [
        "math"
      ]);
      interruptList.splice(interruptList.indexOf("fencedCode") + 1, 0, ["math"]);
      interruptBlockquote.splice(interruptBlockquote.indexOf("fencedCode") + 1, 0, [
        "math"
      ]);
      function mathBlockTokenizer(eat, value, silent) {
        var length = value.length;
        var index2 = 0;
        let code2;
        let content3;
        let lineEnd;
        let lineIndex;
        let openingFenceIndentSize;
        let openingFenceSize;
        let openingFenceContentStart;
        let closingFence;
        let closingFenceSize;
        let lineContentStart;
        let lineContentEnd;
        while (index2 < length && value.charCodeAt(index2) === space) {
          index2++;
        }
        openingFenceIndentSize = index2;
        while (index2 < length && value.charCodeAt(index2) === dollarSign) {
          index2++;
        }
        openingFenceSize = index2 - openingFenceIndentSize;
        if (openingFenceSize < minFenceCount) {
          return;
        }
        while (index2 < length && value.charCodeAt(index2) === space) {
          index2++;
        }
        openingFenceContentStart = index2;
        while (index2 < length) {
          code2 = value.charCodeAt(index2);
          if (code2 === dollarSign) {
            return;
          }
          if (code2 === lineFeed) {
            break;
          }
          index2++;
        }
        if (value.charCodeAt(index2) !== lineFeed) {
          return;
        }
        if (silent) {
          return true;
        }
        content3 = [];
        if (openingFenceContentStart !== index2) {
          content3.push(value.slice(openingFenceContentStart, index2));
        }
        index2++;
        lineEnd = value.indexOf(lineFeedChar, index2 + 1);
        lineEnd = lineEnd === -1 ? length : lineEnd;
        while (index2 < length) {
          closingFence = false;
          lineContentStart = index2;
          lineContentEnd = lineEnd;
          lineIndex = lineEnd;
          closingFenceSize = 0;
          while (lineIndex > lineContentStart && value.charCodeAt(lineIndex - 1) === space) {
            lineIndex--;
          }
          while (lineIndex > lineContentStart && value.charCodeAt(lineIndex - 1) === dollarSign) {
            closingFenceSize++;
            lineIndex--;
          }
          if (openingFenceSize <= closingFenceSize && value.indexOf(dollarSignChar, lineContentStart) === lineIndex) {
            closingFence = true;
            lineContentEnd = lineIndex;
          }
          while (lineContentStart <= lineContentEnd && lineContentStart - index2 < openingFenceIndentSize && value.charCodeAt(lineContentStart) === space) {
            lineContentStart++;
          }
          if (closingFence) {
            while (lineContentEnd > lineContentStart && value.charCodeAt(lineContentEnd - 1) === space) {
              lineContentEnd--;
            }
          }
          if (!closingFence || lineContentStart !== lineContentEnd) {
            content3.push(value.slice(lineContentStart, lineContentEnd));
          }
          if (closingFence) {
            break;
          }
          index2 = lineEnd + 1;
          lineEnd = value.indexOf(lineFeedChar, index2 + 1);
          lineEnd = lineEnd === -1 ? length : lineEnd;
        }
        content3 = content3.join("\n");
        return eat(value.slice(0, lineEnd))({
          type: "math",
          value: content3,
          data: {
            hName: "div",
            hProperties: { className: classList.concat() },
            hChildren: [{ type: "text", value: content3 }]
          }
        });
      }
    }
    function attachCompiler(compiler2) {
      const proto = compiler2.prototype;
      proto.visitors.math = compileBlockMath;
      function compileBlockMath(node2) {
        return "$$\n" + node2.value + "\n$$";
      }
    }
  }
});

// node_modules/remark-math/index.js
var require_remark_math = __commonJS({
  "node_modules/remark-math/index.js"(exports, module) {
    var inlinePlugin = require_inline();
    var blockPlugin = require_block();
    module.exports = math2;
    function math2(options2) {
      var settings = options2 || {};
      blockPlugin.call(this, settings);
      inlinePlugin.call(this, settings);
    }
  }
});

// node_modules/xtend/immutable.js
var require_immutable = __commonJS({
  "node_modules/xtend/immutable.js"(exports, module) {
    module.exports = extend;
    var hasOwnProperty2 = Object.prototype.hasOwnProperty;
    function extend() {
      var target = {};
      for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (hasOwnProperty2.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    }
  }
});

// node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/inherits/inherits_browser.js"(exports, module) {
    if (typeof Object.create === "function") {
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// node_modules/unherit/index.js
var require_unherit = __commonJS({
  "node_modules/unherit/index.js"(exports, module) {
    "use strict";
    var xtend = require_immutable();
    var inherits = require_inherits_browser();
    module.exports = unherit;
    function unherit(Super) {
      var result;
      var key;
      var value;
      inherits(Of, Super);
      inherits(From, Of);
      result = Of.prototype;
      for (key in result) {
        value = result[key];
        if (value && typeof value === "object") {
          result[key] = "concat" in value ? value.concat() : xtend(value);
        }
      }
      return Of;
      function From(parameters) {
        return Super.apply(this, parameters);
      }
      function Of() {
        if (!(this instanceof Of)) {
          return new From(arguments);
        }
        return Super.apply(this, arguments);
      }
    }
  }
});

// node_modules/state-toggle/index.js
var require_state_toggle = __commonJS({
  "node_modules/state-toggle/index.js"(exports, module) {
    "use strict";
    module.exports = factory;
    function factory(key, state, ctx) {
      return enter;
      function enter() {
        var context = ctx || this;
        var current = context[key];
        context[key] = !state;
        return exit3;
        function exit3() {
          context[key] = current;
        }
      }
    }
  }
});

// node_modules/vfile-location/index.js
var require_vfile_location = __commonJS({
  "node_modules/vfile-location/index.js"(exports, module) {
    "use strict";
    module.exports = factory;
    function factory(file) {
      var value = String(file);
      var indices = [];
      var search2 = /\r?\n|\r/g;
      while (search2.exec(value)) {
        indices.push(search2.lastIndex);
      }
      indices.push(value.length + 1);
      return {
        toPoint: offsetToPoint,
        toPosition: offsetToPoint,
        toOffset: pointToOffset
      };
      function offsetToPoint(offset) {
        var index2 = -1;
        if (offset > -1 && offset < indices[indices.length - 1]) {
          while (++index2 < indices.length) {
            if (indices[index2] > offset) {
              return {
                line: index2 + 1,
                column: offset - (indices[index2 - 1] || 0) + 1,
                offset
              };
            }
          }
        }
        return {};
      }
      function pointToOffset(point3) {
        var line2 = point3 && point3.line;
        var column = point3 && point3.column;
        var offset;
        if (!isNaN(line2) && !isNaN(column) && line2 - 1 in indices) {
          offset = (indices[line2 - 2] || 0) + column - 1 || 0;
        }
        return offset > -1 && offset < indices[indices.length - 1] ? offset : -1;
      }
    }
  }
});

// node_modules/remark-parse/lib/unescape.js
var require_unescape = __commonJS({
  "node_modules/remark-parse/lib/unescape.js"(exports, module) {
    "use strict";
    module.exports = factory;
    var backslash = "\\";
    function factory(ctx, key) {
      return unescape;
      function unescape(value) {
        var previous4 = 0;
        var index2 = value.indexOf(backslash);
        var escape = ctx[key];
        var queue = [];
        var character;
        while (index2 !== -1) {
          queue.push(value.slice(previous4, index2));
          previous4 = index2 + 1;
          character = value.charAt(previous4);
          if (!character || escape.indexOf(character) === -1) {
            queue.push(backslash);
          }
          index2 = value.indexOf(backslash, previous4 + 1);
        }
        queue.push(value.slice(previous4));
        return queue.join("");
      }
    }
  }
});

// node_modules/character-entities-legacy/index.json
var require_character_entities_legacy = __commonJS({
  "node_modules/character-entities-legacy/index.json"(exports, module) {
    module.exports = {
      AElig: "\xC6",
      AMP: "&",
      Aacute: "\xC1",
      Acirc: "\xC2",
      Agrave: "\xC0",
      Aring: "\xC5",
      Atilde: "\xC3",
      Auml: "\xC4",
      COPY: "\xA9",
      Ccedil: "\xC7",
      ETH: "\xD0",
      Eacute: "\xC9",
      Ecirc: "\xCA",
      Egrave: "\xC8",
      Euml: "\xCB",
      GT: ">",
      Iacute: "\xCD",
      Icirc: "\xCE",
      Igrave: "\xCC",
      Iuml: "\xCF",
      LT: "<",
      Ntilde: "\xD1",
      Oacute: "\xD3",
      Ocirc: "\xD4",
      Ograve: "\xD2",
      Oslash: "\xD8",
      Otilde: "\xD5",
      Ouml: "\xD6",
      QUOT: '"',
      REG: "\xAE",
      THORN: "\xDE",
      Uacute: "\xDA",
      Ucirc: "\xDB",
      Ugrave: "\xD9",
      Uuml: "\xDC",
      Yacute: "\xDD",
      aacute: "\xE1",
      acirc: "\xE2",
      acute: "\xB4",
      aelig: "\xE6",
      agrave: "\xE0",
      amp: "&",
      aring: "\xE5",
      atilde: "\xE3",
      auml: "\xE4",
      brvbar: "\xA6",
      ccedil: "\xE7",
      cedil: "\xB8",
      cent: "\xA2",
      copy: "\xA9",
      curren: "\xA4",
      deg: "\xB0",
      divide: "\xF7",
      eacute: "\xE9",
      ecirc: "\xEA",
      egrave: "\xE8",
      eth: "\xF0",
      euml: "\xEB",
      frac12: "\xBD",
      frac14: "\xBC",
      frac34: "\xBE",
      gt: ">",
      iacute: "\xED",
      icirc: "\xEE",
      iexcl: "\xA1",
      igrave: "\xEC",
      iquest: "\xBF",
      iuml: "\xEF",
      laquo: "\xAB",
      lt: "<",
      macr: "\xAF",
      micro: "\xB5",
      middot: "\xB7",
      nbsp: "\xA0",
      not: "\xAC",
      ntilde: "\xF1",
      oacute: "\xF3",
      ocirc: "\xF4",
      ograve: "\xF2",
      ordf: "\xAA",
      ordm: "\xBA",
      oslash: "\xF8",
      otilde: "\xF5",
      ouml: "\xF6",
      para: "\xB6",
      plusmn: "\xB1",
      pound: "\xA3",
      quot: '"',
      raquo: "\xBB",
      reg: "\xAE",
      sect: "\xA7",
      shy: "\xAD",
      sup1: "\xB9",
      sup2: "\xB2",
      sup3: "\xB3",
      szlig: "\xDF",
      thorn: "\xFE",
      times: "\xD7",
      uacute: "\xFA",
      ucirc: "\xFB",
      ugrave: "\xF9",
      uml: "\xA8",
      uuml: "\xFC",
      yacute: "\xFD",
      yen: "\xA5",
      yuml: "\xFF"
    };
  }
});

// node_modules/character-reference-invalid/index.json
var require_character_reference_invalid = __commonJS({
  "node_modules/character-reference-invalid/index.json"(exports, module) {
    module.exports = {
      "0": "\uFFFD",
      "128": "\u20AC",
      "130": "\u201A",
      "131": "\u0192",
      "132": "\u201E",
      "133": "\u2026",
      "134": "\u2020",
      "135": "\u2021",
      "136": "\u02C6",
      "137": "\u2030",
      "138": "\u0160",
      "139": "\u2039",
      "140": "\u0152",
      "142": "\u017D",
      "145": "\u2018",
      "146": "\u2019",
      "147": "\u201C",
      "148": "\u201D",
      "149": "\u2022",
      "150": "\u2013",
      "151": "\u2014",
      "152": "\u02DC",
      "153": "\u2122",
      "154": "\u0161",
      "155": "\u203A",
      "156": "\u0153",
      "158": "\u017E",
      "159": "\u0178"
    };
  }
});

// node_modules/is-decimal/index.js
var require_is_decimal = __commonJS({
  "node_modules/is-decimal/index.js"(exports, module) {
    "use strict";
    module.exports = decimal;
    function decimal(character) {
      var code2 = typeof character === "string" ? character.charCodeAt(0) : character;
      return code2 >= 48 && code2 <= 57;
    }
  }
});

// node_modules/is-hexadecimal/index.js
var require_is_hexadecimal = __commonJS({
  "node_modules/is-hexadecimal/index.js"(exports, module) {
    "use strict";
    module.exports = hexadecimal;
    function hexadecimal(character) {
      var code2 = typeof character === "string" ? character.charCodeAt(0) : character;
      return code2 >= 97 && code2 <= 102 || code2 >= 65 && code2 <= 70 || code2 >= 48 && code2 <= 57;
    }
  }
});

// node_modules/is-alphabetical/index.js
var require_is_alphabetical = __commonJS({
  "node_modules/is-alphabetical/index.js"(exports, module) {
    "use strict";
    module.exports = alphabetical;
    function alphabetical(character) {
      var code2 = typeof character === "string" ? character.charCodeAt(0) : character;
      return code2 >= 97 && code2 <= 122 || code2 >= 65 && code2 <= 90;
    }
  }
});

// node_modules/is-alphanumerical/index.js
var require_is_alphanumerical = __commonJS({
  "node_modules/is-alphanumerical/index.js"(exports, module) {
    "use strict";
    var alphabetical = require_is_alphabetical();
    var decimal = require_is_decimal();
    module.exports = alphanumerical;
    function alphanumerical(character) {
      return alphabetical(character) || decimal(character);
    }
  }
});

// node_modules/parse-entities/node_modules/character-entities/index.json
var require_character_entities = __commonJS({
  "node_modules/parse-entities/node_modules/character-entities/index.json"(exports, module) {
    module.exports = {
      AEli: "\xC6",
      AElig: "\xC6",
      AM: "&",
      AMP: "&",
      Aacut: "\xC1",
      Aacute: "\xC1",
      Abreve: "\u0102",
      Acir: "\xC2",
      Acirc: "\xC2",
      Acy: "\u0410",
      Afr: "\u{1D504}",
      Agrav: "\xC0",
      Agrave: "\xC0",
      Alpha: "\u0391",
      Amacr: "\u0100",
      And: "\u2A53",
      Aogon: "\u0104",
      Aopf: "\u{1D538}",
      ApplyFunction: "\u2061",
      Arin: "\xC5",
      Aring: "\xC5",
      Ascr: "\u{1D49C}",
      Assign: "\u2254",
      Atild: "\xC3",
      Atilde: "\xC3",
      Aum: "\xC4",
      Auml: "\xC4",
      Backslash: "\u2216",
      Barv: "\u2AE7",
      Barwed: "\u2306",
      Bcy: "\u0411",
      Because: "\u2235",
      Bernoullis: "\u212C",
      Beta: "\u0392",
      Bfr: "\u{1D505}",
      Bopf: "\u{1D539}",
      Breve: "\u02D8",
      Bscr: "\u212C",
      Bumpeq: "\u224E",
      CHcy: "\u0427",
      COP: "\xA9",
      COPY: "\xA9",
      Cacute: "\u0106",
      Cap: "\u22D2",
      CapitalDifferentialD: "\u2145",
      Cayleys: "\u212D",
      Ccaron: "\u010C",
      Ccedi: "\xC7",
      Ccedil: "\xC7",
      Ccirc: "\u0108",
      Cconint: "\u2230",
      Cdot: "\u010A",
      Cedilla: "\xB8",
      CenterDot: "\xB7",
      Cfr: "\u212D",
      Chi: "\u03A7",
      CircleDot: "\u2299",
      CircleMinus: "\u2296",
      CirclePlus: "\u2295",
      CircleTimes: "\u2297",
      ClockwiseContourIntegral: "\u2232",
      CloseCurlyDoubleQuote: "\u201D",
      CloseCurlyQuote: "\u2019",
      Colon: "\u2237",
      Colone: "\u2A74",
      Congruent: "\u2261",
      Conint: "\u222F",
      ContourIntegral: "\u222E",
      Copf: "\u2102",
      Coproduct: "\u2210",
      CounterClockwiseContourIntegral: "\u2233",
      Cross: "\u2A2F",
      Cscr: "\u{1D49E}",
      Cup: "\u22D3",
      CupCap: "\u224D",
      DD: "\u2145",
      DDotrahd: "\u2911",
      DJcy: "\u0402",
      DScy: "\u0405",
      DZcy: "\u040F",
      Dagger: "\u2021",
      Darr: "\u21A1",
      Dashv: "\u2AE4",
      Dcaron: "\u010E",
      Dcy: "\u0414",
      Del: "\u2207",
      Delta: "\u0394",
      Dfr: "\u{1D507}",
      DiacriticalAcute: "\xB4",
      DiacriticalDot: "\u02D9",
      DiacriticalDoubleAcute: "\u02DD",
      DiacriticalGrave: "`",
      DiacriticalTilde: "\u02DC",
      Diamond: "\u22C4",
      DifferentialD: "\u2146",
      Dopf: "\u{1D53B}",
      Dot: "\xA8",
      DotDot: "\u20DC",
      DotEqual: "\u2250",
      DoubleContourIntegral: "\u222F",
      DoubleDot: "\xA8",
      DoubleDownArrow: "\u21D3",
      DoubleLeftArrow: "\u21D0",
      DoubleLeftRightArrow: "\u21D4",
      DoubleLeftTee: "\u2AE4",
      DoubleLongLeftArrow: "\u27F8",
      DoubleLongLeftRightArrow: "\u27FA",
      DoubleLongRightArrow: "\u27F9",
      DoubleRightArrow: "\u21D2",
      DoubleRightTee: "\u22A8",
      DoubleUpArrow: "\u21D1",
      DoubleUpDownArrow: "\u21D5",
      DoubleVerticalBar: "\u2225",
      DownArrow: "\u2193",
      DownArrowBar: "\u2913",
      DownArrowUpArrow: "\u21F5",
      DownBreve: "\u0311",
      DownLeftRightVector: "\u2950",
      DownLeftTeeVector: "\u295E",
      DownLeftVector: "\u21BD",
      DownLeftVectorBar: "\u2956",
      DownRightTeeVector: "\u295F",
      DownRightVector: "\u21C1",
      DownRightVectorBar: "\u2957",
      DownTee: "\u22A4",
      DownTeeArrow: "\u21A7",
      Downarrow: "\u21D3",
      Dscr: "\u{1D49F}",
      Dstrok: "\u0110",
      ENG: "\u014A",
      ET: "\xD0",
      ETH: "\xD0",
      Eacut: "\xC9",
      Eacute: "\xC9",
      Ecaron: "\u011A",
      Ecir: "\xCA",
      Ecirc: "\xCA",
      Ecy: "\u042D",
      Edot: "\u0116",
      Efr: "\u{1D508}",
      Egrav: "\xC8",
      Egrave: "\xC8",
      Element: "\u2208",
      Emacr: "\u0112",
      EmptySmallSquare: "\u25FB",
      EmptyVerySmallSquare: "\u25AB",
      Eogon: "\u0118",
      Eopf: "\u{1D53C}",
      Epsilon: "\u0395",
      Equal: "\u2A75",
      EqualTilde: "\u2242",
      Equilibrium: "\u21CC",
      Escr: "\u2130",
      Esim: "\u2A73",
      Eta: "\u0397",
      Eum: "\xCB",
      Euml: "\xCB",
      Exists: "\u2203",
      ExponentialE: "\u2147",
      Fcy: "\u0424",
      Ffr: "\u{1D509}",
      FilledSmallSquare: "\u25FC",
      FilledVerySmallSquare: "\u25AA",
      Fopf: "\u{1D53D}",
      ForAll: "\u2200",
      Fouriertrf: "\u2131",
      Fscr: "\u2131",
      GJcy: "\u0403",
      G: ">",
      GT: ">",
      Gamma: "\u0393",
      Gammad: "\u03DC",
      Gbreve: "\u011E",
      Gcedil: "\u0122",
      Gcirc: "\u011C",
      Gcy: "\u0413",
      Gdot: "\u0120",
      Gfr: "\u{1D50A}",
      Gg: "\u22D9",
      Gopf: "\u{1D53E}",
      GreaterEqual: "\u2265",
      GreaterEqualLess: "\u22DB",
      GreaterFullEqual: "\u2267",
      GreaterGreater: "\u2AA2",
      GreaterLess: "\u2277",
      GreaterSlantEqual: "\u2A7E",
      GreaterTilde: "\u2273",
      Gscr: "\u{1D4A2}",
      Gt: "\u226B",
      HARDcy: "\u042A",
      Hacek: "\u02C7",
      Hat: "^",
      Hcirc: "\u0124",
      Hfr: "\u210C",
      HilbertSpace: "\u210B",
      Hopf: "\u210D",
      HorizontalLine: "\u2500",
      Hscr: "\u210B",
      Hstrok: "\u0126",
      HumpDownHump: "\u224E",
      HumpEqual: "\u224F",
      IEcy: "\u0415",
      IJlig: "\u0132",
      IOcy: "\u0401",
      Iacut: "\xCD",
      Iacute: "\xCD",
      Icir: "\xCE",
      Icirc: "\xCE",
      Icy: "\u0418",
      Idot: "\u0130",
      Ifr: "\u2111",
      Igrav: "\xCC",
      Igrave: "\xCC",
      Im: "\u2111",
      Imacr: "\u012A",
      ImaginaryI: "\u2148",
      Implies: "\u21D2",
      Int: "\u222C",
      Integral: "\u222B",
      Intersection: "\u22C2",
      InvisibleComma: "\u2063",
      InvisibleTimes: "\u2062",
      Iogon: "\u012E",
      Iopf: "\u{1D540}",
      Iota: "\u0399",
      Iscr: "\u2110",
      Itilde: "\u0128",
      Iukcy: "\u0406",
      Ium: "\xCF",
      Iuml: "\xCF",
      Jcirc: "\u0134",
      Jcy: "\u0419",
      Jfr: "\u{1D50D}",
      Jopf: "\u{1D541}",
      Jscr: "\u{1D4A5}",
      Jsercy: "\u0408",
      Jukcy: "\u0404",
      KHcy: "\u0425",
      KJcy: "\u040C",
      Kappa: "\u039A",
      Kcedil: "\u0136",
      Kcy: "\u041A",
      Kfr: "\u{1D50E}",
      Kopf: "\u{1D542}",
      Kscr: "\u{1D4A6}",
      LJcy: "\u0409",
      L: "<",
      LT: "<",
      Lacute: "\u0139",
      Lambda: "\u039B",
      Lang: "\u27EA",
      Laplacetrf: "\u2112",
      Larr: "\u219E",
      Lcaron: "\u013D",
      Lcedil: "\u013B",
      Lcy: "\u041B",
      LeftAngleBracket: "\u27E8",
      LeftArrow: "\u2190",
      LeftArrowBar: "\u21E4",
      LeftArrowRightArrow: "\u21C6",
      LeftCeiling: "\u2308",
      LeftDoubleBracket: "\u27E6",
      LeftDownTeeVector: "\u2961",
      LeftDownVector: "\u21C3",
      LeftDownVectorBar: "\u2959",
      LeftFloor: "\u230A",
      LeftRightArrow: "\u2194",
      LeftRightVector: "\u294E",
      LeftTee: "\u22A3",
      LeftTeeArrow: "\u21A4",
      LeftTeeVector: "\u295A",
      LeftTriangle: "\u22B2",
      LeftTriangleBar: "\u29CF",
      LeftTriangleEqual: "\u22B4",
      LeftUpDownVector: "\u2951",
      LeftUpTeeVector: "\u2960",
      LeftUpVector: "\u21BF",
      LeftUpVectorBar: "\u2958",
      LeftVector: "\u21BC",
      LeftVectorBar: "\u2952",
      Leftarrow: "\u21D0",
      Leftrightarrow: "\u21D4",
      LessEqualGreater: "\u22DA",
      LessFullEqual: "\u2266",
      LessGreater: "\u2276",
      LessLess: "\u2AA1",
      LessSlantEqual: "\u2A7D",
      LessTilde: "\u2272",
      Lfr: "\u{1D50F}",
      Ll: "\u22D8",
      Lleftarrow: "\u21DA",
      Lmidot: "\u013F",
      LongLeftArrow: "\u27F5",
      LongLeftRightArrow: "\u27F7",
      LongRightArrow: "\u27F6",
      Longleftarrow: "\u27F8",
      Longleftrightarrow: "\u27FA",
      Longrightarrow: "\u27F9",
      Lopf: "\u{1D543}",
      LowerLeftArrow: "\u2199",
      LowerRightArrow: "\u2198",
      Lscr: "\u2112",
      Lsh: "\u21B0",
      Lstrok: "\u0141",
      Lt: "\u226A",
      Map: "\u2905",
      Mcy: "\u041C",
      MediumSpace: "\u205F",
      Mellintrf: "\u2133",
      Mfr: "\u{1D510}",
      MinusPlus: "\u2213",
      Mopf: "\u{1D544}",
      Mscr: "\u2133",
      Mu: "\u039C",
      NJcy: "\u040A",
      Nacute: "\u0143",
      Ncaron: "\u0147",
      Ncedil: "\u0145",
      Ncy: "\u041D",
      NegativeMediumSpace: "\u200B",
      NegativeThickSpace: "\u200B",
      NegativeThinSpace: "\u200B",
      NegativeVeryThinSpace: "\u200B",
      NestedGreaterGreater: "\u226B",
      NestedLessLess: "\u226A",
      NewLine: "\n",
      Nfr: "\u{1D511}",
      NoBreak: "\u2060",
      NonBreakingSpace: "\xA0",
      Nopf: "\u2115",
      Not: "\u2AEC",
      NotCongruent: "\u2262",
      NotCupCap: "\u226D",
      NotDoubleVerticalBar: "\u2226",
      NotElement: "\u2209",
      NotEqual: "\u2260",
      NotEqualTilde: "\u2242\u0338",
      NotExists: "\u2204",
      NotGreater: "\u226F",
      NotGreaterEqual: "\u2271",
      NotGreaterFullEqual: "\u2267\u0338",
      NotGreaterGreater: "\u226B\u0338",
      NotGreaterLess: "\u2279",
      NotGreaterSlantEqual: "\u2A7E\u0338",
      NotGreaterTilde: "\u2275",
      NotHumpDownHump: "\u224E\u0338",
      NotHumpEqual: "\u224F\u0338",
      NotLeftTriangle: "\u22EA",
      NotLeftTriangleBar: "\u29CF\u0338",
      NotLeftTriangleEqual: "\u22EC",
      NotLess: "\u226E",
      NotLessEqual: "\u2270",
      NotLessGreater: "\u2278",
      NotLessLess: "\u226A\u0338",
      NotLessSlantEqual: "\u2A7D\u0338",
      NotLessTilde: "\u2274",
      NotNestedGreaterGreater: "\u2AA2\u0338",
      NotNestedLessLess: "\u2AA1\u0338",
      NotPrecedes: "\u2280",
      NotPrecedesEqual: "\u2AAF\u0338",
      NotPrecedesSlantEqual: "\u22E0",
      NotReverseElement: "\u220C",
      NotRightTriangle: "\u22EB",
      NotRightTriangleBar: "\u29D0\u0338",
      NotRightTriangleEqual: "\u22ED",
      NotSquareSubset: "\u228F\u0338",
      NotSquareSubsetEqual: "\u22E2",
      NotSquareSuperset: "\u2290\u0338",
      NotSquareSupersetEqual: "\u22E3",
      NotSubset: "\u2282\u20D2",
      NotSubsetEqual: "\u2288",
      NotSucceeds: "\u2281",
      NotSucceedsEqual: "\u2AB0\u0338",
      NotSucceedsSlantEqual: "\u22E1",
      NotSucceedsTilde: "\u227F\u0338",
      NotSuperset: "\u2283\u20D2",
      NotSupersetEqual: "\u2289",
      NotTilde: "\u2241",
      NotTildeEqual: "\u2244",
      NotTildeFullEqual: "\u2247",
      NotTildeTilde: "\u2249",
      NotVerticalBar: "\u2224",
      Nscr: "\u{1D4A9}",
      Ntild: "\xD1",
      Ntilde: "\xD1",
      Nu: "\u039D",
      OElig: "\u0152",
      Oacut: "\xD3",
      Oacute: "\xD3",
      Ocir: "\xD4",
      Ocirc: "\xD4",
      Ocy: "\u041E",
      Odblac: "\u0150",
      Ofr: "\u{1D512}",
      Ograv: "\xD2",
      Ograve: "\xD2",
      Omacr: "\u014C",
      Omega: "\u03A9",
      Omicron: "\u039F",
      Oopf: "\u{1D546}",
      OpenCurlyDoubleQuote: "\u201C",
      OpenCurlyQuote: "\u2018",
      Or: "\u2A54",
      Oscr: "\u{1D4AA}",
      Oslas: "\xD8",
      Oslash: "\xD8",
      Otild: "\xD5",
      Otilde: "\xD5",
      Otimes: "\u2A37",
      Oum: "\xD6",
      Ouml: "\xD6",
      OverBar: "\u203E",
      OverBrace: "\u23DE",
      OverBracket: "\u23B4",
      OverParenthesis: "\u23DC",
      PartialD: "\u2202",
      Pcy: "\u041F",
      Pfr: "\u{1D513}",
      Phi: "\u03A6",
      Pi: "\u03A0",
      PlusMinus: "\xB1",
      Poincareplane: "\u210C",
      Popf: "\u2119",
      Pr: "\u2ABB",
      Precedes: "\u227A",
      PrecedesEqual: "\u2AAF",
      PrecedesSlantEqual: "\u227C",
      PrecedesTilde: "\u227E",
      Prime: "\u2033",
      Product: "\u220F",
      Proportion: "\u2237",
      Proportional: "\u221D",
      Pscr: "\u{1D4AB}",
      Psi: "\u03A8",
      QUO: '"',
      QUOT: '"',
      Qfr: "\u{1D514}",
      Qopf: "\u211A",
      Qscr: "\u{1D4AC}",
      RBarr: "\u2910",
      RE: "\xAE",
      REG: "\xAE",
      Racute: "\u0154",
      Rang: "\u27EB",
      Rarr: "\u21A0",
      Rarrtl: "\u2916",
      Rcaron: "\u0158",
      Rcedil: "\u0156",
      Rcy: "\u0420",
      Re: "\u211C",
      ReverseElement: "\u220B",
      ReverseEquilibrium: "\u21CB",
      ReverseUpEquilibrium: "\u296F",
      Rfr: "\u211C",
      Rho: "\u03A1",
      RightAngleBracket: "\u27E9",
      RightArrow: "\u2192",
      RightArrowBar: "\u21E5",
      RightArrowLeftArrow: "\u21C4",
      RightCeiling: "\u2309",
      RightDoubleBracket: "\u27E7",
      RightDownTeeVector: "\u295D",
      RightDownVector: "\u21C2",
      RightDownVectorBar: "\u2955",
      RightFloor: "\u230B",
      RightTee: "\u22A2",
      RightTeeArrow: "\u21A6",
      RightTeeVector: "\u295B",
      RightTriangle: "\u22B3",
      RightTriangleBar: "\u29D0",
      RightTriangleEqual: "\u22B5",
      RightUpDownVector: "\u294F",
      RightUpTeeVector: "\u295C",
      RightUpVector: "\u21BE",
      RightUpVectorBar: "\u2954",
      RightVector: "\u21C0",
      RightVectorBar: "\u2953",
      Rightarrow: "\u21D2",
      Ropf: "\u211D",
      RoundImplies: "\u2970",
      Rrightarrow: "\u21DB",
      Rscr: "\u211B",
      Rsh: "\u21B1",
      RuleDelayed: "\u29F4",
      SHCHcy: "\u0429",
      SHcy: "\u0428",
      SOFTcy: "\u042C",
      Sacute: "\u015A",
      Sc: "\u2ABC",
      Scaron: "\u0160",
      Scedil: "\u015E",
      Scirc: "\u015C",
      Scy: "\u0421",
      Sfr: "\u{1D516}",
      ShortDownArrow: "\u2193",
      ShortLeftArrow: "\u2190",
      ShortRightArrow: "\u2192",
      ShortUpArrow: "\u2191",
      Sigma: "\u03A3",
      SmallCircle: "\u2218",
      Sopf: "\u{1D54A}",
      Sqrt: "\u221A",
      Square: "\u25A1",
      SquareIntersection: "\u2293",
      SquareSubset: "\u228F",
      SquareSubsetEqual: "\u2291",
      SquareSuperset: "\u2290",
      SquareSupersetEqual: "\u2292",
      SquareUnion: "\u2294",
      Sscr: "\u{1D4AE}",
      Star: "\u22C6",
      Sub: "\u22D0",
      Subset: "\u22D0",
      SubsetEqual: "\u2286",
      Succeeds: "\u227B",
      SucceedsEqual: "\u2AB0",
      SucceedsSlantEqual: "\u227D",
      SucceedsTilde: "\u227F",
      SuchThat: "\u220B",
      Sum: "\u2211",
      Sup: "\u22D1",
      Superset: "\u2283",
      SupersetEqual: "\u2287",
      Supset: "\u22D1",
      THOR: "\xDE",
      THORN: "\xDE",
      TRADE: "\u2122",
      TSHcy: "\u040B",
      TScy: "\u0426",
      Tab: "	",
      Tau: "\u03A4",
      Tcaron: "\u0164",
      Tcedil: "\u0162",
      Tcy: "\u0422",
      Tfr: "\u{1D517}",
      Therefore: "\u2234",
      Theta: "\u0398",
      ThickSpace: "\u205F\u200A",
      ThinSpace: "\u2009",
      Tilde: "\u223C",
      TildeEqual: "\u2243",
      TildeFullEqual: "\u2245",
      TildeTilde: "\u2248",
      Topf: "\u{1D54B}",
      TripleDot: "\u20DB",
      Tscr: "\u{1D4AF}",
      Tstrok: "\u0166",
      Uacut: "\xDA",
      Uacute: "\xDA",
      Uarr: "\u219F",
      Uarrocir: "\u2949",
      Ubrcy: "\u040E",
      Ubreve: "\u016C",
      Ucir: "\xDB",
      Ucirc: "\xDB",
      Ucy: "\u0423",
      Udblac: "\u0170",
      Ufr: "\u{1D518}",
      Ugrav: "\xD9",
      Ugrave: "\xD9",
      Umacr: "\u016A",
      UnderBar: "_",
      UnderBrace: "\u23DF",
      UnderBracket: "\u23B5",
      UnderParenthesis: "\u23DD",
      Union: "\u22C3",
      UnionPlus: "\u228E",
      Uogon: "\u0172",
      Uopf: "\u{1D54C}",
      UpArrow: "\u2191",
      UpArrowBar: "\u2912",
      UpArrowDownArrow: "\u21C5",
      UpDownArrow: "\u2195",
      UpEquilibrium: "\u296E",
      UpTee: "\u22A5",
      UpTeeArrow: "\u21A5",
      Uparrow: "\u21D1",
      Updownarrow: "\u21D5",
      UpperLeftArrow: "\u2196",
      UpperRightArrow: "\u2197",
      Upsi: "\u03D2",
      Upsilon: "\u03A5",
      Uring: "\u016E",
      Uscr: "\u{1D4B0}",
      Utilde: "\u0168",
      Uum: "\xDC",
      Uuml: "\xDC",
      VDash: "\u22AB",
      Vbar: "\u2AEB",
      Vcy: "\u0412",
      Vdash: "\u22A9",
      Vdashl: "\u2AE6",
      Vee: "\u22C1",
      Verbar: "\u2016",
      Vert: "\u2016",
      VerticalBar: "\u2223",
      VerticalLine: "|",
      VerticalSeparator: "\u2758",
      VerticalTilde: "\u2240",
      VeryThinSpace: "\u200A",
      Vfr: "\u{1D519}",
      Vopf: "\u{1D54D}",
      Vscr: "\u{1D4B1}",
      Vvdash: "\u22AA",
      Wcirc: "\u0174",
      Wedge: "\u22C0",
      Wfr: "\u{1D51A}",
      Wopf: "\u{1D54E}",
      Wscr: "\u{1D4B2}",
      Xfr: "\u{1D51B}",
      Xi: "\u039E",
      Xopf: "\u{1D54F}",
      Xscr: "\u{1D4B3}",
      YAcy: "\u042F",
      YIcy: "\u0407",
      YUcy: "\u042E",
      Yacut: "\xDD",
      Yacute: "\xDD",
      Ycirc: "\u0176",
      Ycy: "\u042B",
      Yfr: "\u{1D51C}",
      Yopf: "\u{1D550}",
      Yscr: "\u{1D4B4}",
      Yuml: "\u0178",
      ZHcy: "\u0416",
      Zacute: "\u0179",
      Zcaron: "\u017D",
      Zcy: "\u0417",
      Zdot: "\u017B",
      ZeroWidthSpace: "\u200B",
      Zeta: "\u0396",
      Zfr: "\u2128",
      Zopf: "\u2124",
      Zscr: "\u{1D4B5}",
      aacut: "\xE1",
      aacute: "\xE1",
      abreve: "\u0103",
      ac: "\u223E",
      acE: "\u223E\u0333",
      acd: "\u223F",
      acir: "\xE2",
      acirc: "\xE2",
      acut: "\xB4",
      acute: "\xB4",
      acy: "\u0430",
      aeli: "\xE6",
      aelig: "\xE6",
      af: "\u2061",
      afr: "\u{1D51E}",
      agrav: "\xE0",
      agrave: "\xE0",
      alefsym: "\u2135",
      aleph: "\u2135",
      alpha: "\u03B1",
      amacr: "\u0101",
      amalg: "\u2A3F",
      am: "&",
      amp: "&",
      and: "\u2227",
      andand: "\u2A55",
      andd: "\u2A5C",
      andslope: "\u2A58",
      andv: "\u2A5A",
      ang: "\u2220",
      ange: "\u29A4",
      angle: "\u2220",
      angmsd: "\u2221",
      angmsdaa: "\u29A8",
      angmsdab: "\u29A9",
      angmsdac: "\u29AA",
      angmsdad: "\u29AB",
      angmsdae: "\u29AC",
      angmsdaf: "\u29AD",
      angmsdag: "\u29AE",
      angmsdah: "\u29AF",
      angrt: "\u221F",
      angrtvb: "\u22BE",
      angrtvbd: "\u299D",
      angsph: "\u2222",
      angst: "\xC5",
      angzarr: "\u237C",
      aogon: "\u0105",
      aopf: "\u{1D552}",
      ap: "\u2248",
      apE: "\u2A70",
      apacir: "\u2A6F",
      ape: "\u224A",
      apid: "\u224B",
      apos: "'",
      approx: "\u2248",
      approxeq: "\u224A",
      arin: "\xE5",
      aring: "\xE5",
      ascr: "\u{1D4B6}",
      ast: "*",
      asymp: "\u2248",
      asympeq: "\u224D",
      atild: "\xE3",
      atilde: "\xE3",
      aum: "\xE4",
      auml: "\xE4",
      awconint: "\u2233",
      awint: "\u2A11",
      bNot: "\u2AED",
      backcong: "\u224C",
      backepsilon: "\u03F6",
      backprime: "\u2035",
      backsim: "\u223D",
      backsimeq: "\u22CD",
      barvee: "\u22BD",
      barwed: "\u2305",
      barwedge: "\u2305",
      bbrk: "\u23B5",
      bbrktbrk: "\u23B6",
      bcong: "\u224C",
      bcy: "\u0431",
      bdquo: "\u201E",
      becaus: "\u2235",
      because: "\u2235",
      bemptyv: "\u29B0",
      bepsi: "\u03F6",
      bernou: "\u212C",
      beta: "\u03B2",
      beth: "\u2136",
      between: "\u226C",
      bfr: "\u{1D51F}",
      bigcap: "\u22C2",
      bigcirc: "\u25EF",
      bigcup: "\u22C3",
      bigodot: "\u2A00",
      bigoplus: "\u2A01",
      bigotimes: "\u2A02",
      bigsqcup: "\u2A06",
      bigstar: "\u2605",
      bigtriangledown: "\u25BD",
      bigtriangleup: "\u25B3",
      biguplus: "\u2A04",
      bigvee: "\u22C1",
      bigwedge: "\u22C0",
      bkarow: "\u290D",
      blacklozenge: "\u29EB",
      blacksquare: "\u25AA",
      blacktriangle: "\u25B4",
      blacktriangledown: "\u25BE",
      blacktriangleleft: "\u25C2",
      blacktriangleright: "\u25B8",
      blank: "\u2423",
      blk12: "\u2592",
      blk14: "\u2591",
      blk34: "\u2593",
      block: "\u2588",
      bne: "=\u20E5",
      bnequiv: "\u2261\u20E5",
      bnot: "\u2310",
      bopf: "\u{1D553}",
      bot: "\u22A5",
      bottom: "\u22A5",
      bowtie: "\u22C8",
      boxDL: "\u2557",
      boxDR: "\u2554",
      boxDl: "\u2556",
      boxDr: "\u2553",
      boxH: "\u2550",
      boxHD: "\u2566",
      boxHU: "\u2569",
      boxHd: "\u2564",
      boxHu: "\u2567",
      boxUL: "\u255D",
      boxUR: "\u255A",
      boxUl: "\u255C",
      boxUr: "\u2559",
      boxV: "\u2551",
      boxVH: "\u256C",
      boxVL: "\u2563",
      boxVR: "\u2560",
      boxVh: "\u256B",
      boxVl: "\u2562",
      boxVr: "\u255F",
      boxbox: "\u29C9",
      boxdL: "\u2555",
      boxdR: "\u2552",
      boxdl: "\u2510",
      boxdr: "\u250C",
      boxh: "\u2500",
      boxhD: "\u2565",
      boxhU: "\u2568",
      boxhd: "\u252C",
      boxhu: "\u2534",
      boxminus: "\u229F",
      boxplus: "\u229E",
      boxtimes: "\u22A0",
      boxuL: "\u255B",
      boxuR: "\u2558",
      boxul: "\u2518",
      boxur: "\u2514",
      boxv: "\u2502",
      boxvH: "\u256A",
      boxvL: "\u2561",
      boxvR: "\u255E",
      boxvh: "\u253C",
      boxvl: "\u2524",
      boxvr: "\u251C",
      bprime: "\u2035",
      breve: "\u02D8",
      brvba: "\xA6",
      brvbar: "\xA6",
      bscr: "\u{1D4B7}",
      bsemi: "\u204F",
      bsim: "\u223D",
      bsime: "\u22CD",
      bsol: "\\",
      bsolb: "\u29C5",
      bsolhsub: "\u27C8",
      bull: "\u2022",
      bullet: "\u2022",
      bump: "\u224E",
      bumpE: "\u2AAE",
      bumpe: "\u224F",
      bumpeq: "\u224F",
      cacute: "\u0107",
      cap: "\u2229",
      capand: "\u2A44",
      capbrcup: "\u2A49",
      capcap: "\u2A4B",
      capcup: "\u2A47",
      capdot: "\u2A40",
      caps: "\u2229\uFE00",
      caret: "\u2041",
      caron: "\u02C7",
      ccaps: "\u2A4D",
      ccaron: "\u010D",
      ccedi: "\xE7",
      ccedil: "\xE7",
      ccirc: "\u0109",
      ccups: "\u2A4C",
      ccupssm: "\u2A50",
      cdot: "\u010B",
      cedi: "\xB8",
      cedil: "\xB8",
      cemptyv: "\u29B2",
      cen: "\xA2",
      cent: "\xA2",
      centerdot: "\xB7",
      cfr: "\u{1D520}",
      chcy: "\u0447",
      check: "\u2713",
      checkmark: "\u2713",
      chi: "\u03C7",
      cir: "\u25CB",
      cirE: "\u29C3",
      circ: "\u02C6",
      circeq: "\u2257",
      circlearrowleft: "\u21BA",
      circlearrowright: "\u21BB",
      circledR: "\xAE",
      circledS: "\u24C8",
      circledast: "\u229B",
      circledcirc: "\u229A",
      circleddash: "\u229D",
      cire: "\u2257",
      cirfnint: "\u2A10",
      cirmid: "\u2AEF",
      cirscir: "\u29C2",
      clubs: "\u2663",
      clubsuit: "\u2663",
      colon: ":",
      colone: "\u2254",
      coloneq: "\u2254",
      comma: ",",
      commat: "@",
      comp: "\u2201",
      compfn: "\u2218",
      complement: "\u2201",
      complexes: "\u2102",
      cong: "\u2245",
      congdot: "\u2A6D",
      conint: "\u222E",
      copf: "\u{1D554}",
      coprod: "\u2210",
      cop: "\xA9",
      copy: "\xA9",
      copysr: "\u2117",
      crarr: "\u21B5",
      cross: "\u2717",
      cscr: "\u{1D4B8}",
      csub: "\u2ACF",
      csube: "\u2AD1",
      csup: "\u2AD0",
      csupe: "\u2AD2",
      ctdot: "\u22EF",
      cudarrl: "\u2938",
      cudarrr: "\u2935",
      cuepr: "\u22DE",
      cuesc: "\u22DF",
      cularr: "\u21B6",
      cularrp: "\u293D",
      cup: "\u222A",
      cupbrcap: "\u2A48",
      cupcap: "\u2A46",
      cupcup: "\u2A4A",
      cupdot: "\u228D",
      cupor: "\u2A45",
      cups: "\u222A\uFE00",
      curarr: "\u21B7",
      curarrm: "\u293C",
      curlyeqprec: "\u22DE",
      curlyeqsucc: "\u22DF",
      curlyvee: "\u22CE",
      curlywedge: "\u22CF",
      curre: "\xA4",
      curren: "\xA4",
      curvearrowleft: "\u21B6",
      curvearrowright: "\u21B7",
      cuvee: "\u22CE",
      cuwed: "\u22CF",
      cwconint: "\u2232",
      cwint: "\u2231",
      cylcty: "\u232D",
      dArr: "\u21D3",
      dHar: "\u2965",
      dagger: "\u2020",
      daleth: "\u2138",
      darr: "\u2193",
      dash: "\u2010",
      dashv: "\u22A3",
      dbkarow: "\u290F",
      dblac: "\u02DD",
      dcaron: "\u010F",
      dcy: "\u0434",
      dd: "\u2146",
      ddagger: "\u2021",
      ddarr: "\u21CA",
      ddotseq: "\u2A77",
      de: "\xB0",
      deg: "\xB0",
      delta: "\u03B4",
      demptyv: "\u29B1",
      dfisht: "\u297F",
      dfr: "\u{1D521}",
      dharl: "\u21C3",
      dharr: "\u21C2",
      diam: "\u22C4",
      diamond: "\u22C4",
      diamondsuit: "\u2666",
      diams: "\u2666",
      die: "\xA8",
      digamma: "\u03DD",
      disin: "\u22F2",
      div: "\xF7",
      divid: "\xF7",
      divide: "\xF7",
      divideontimes: "\u22C7",
      divonx: "\u22C7",
      djcy: "\u0452",
      dlcorn: "\u231E",
      dlcrop: "\u230D",
      dollar: "$",
      dopf: "\u{1D555}",
      dot: "\u02D9",
      doteq: "\u2250",
      doteqdot: "\u2251",
      dotminus: "\u2238",
      dotplus: "\u2214",
      dotsquare: "\u22A1",
      doublebarwedge: "\u2306",
      downarrow: "\u2193",
      downdownarrows: "\u21CA",
      downharpoonleft: "\u21C3",
      downharpoonright: "\u21C2",
      drbkarow: "\u2910",
      drcorn: "\u231F",
      drcrop: "\u230C",
      dscr: "\u{1D4B9}",
      dscy: "\u0455",
      dsol: "\u29F6",
      dstrok: "\u0111",
      dtdot: "\u22F1",
      dtri: "\u25BF",
      dtrif: "\u25BE",
      duarr: "\u21F5",
      duhar: "\u296F",
      dwangle: "\u29A6",
      dzcy: "\u045F",
      dzigrarr: "\u27FF",
      eDDot: "\u2A77",
      eDot: "\u2251",
      eacut: "\xE9",
      eacute: "\xE9",
      easter: "\u2A6E",
      ecaron: "\u011B",
      ecir: "\xEA",
      ecirc: "\xEA",
      ecolon: "\u2255",
      ecy: "\u044D",
      edot: "\u0117",
      ee: "\u2147",
      efDot: "\u2252",
      efr: "\u{1D522}",
      eg: "\u2A9A",
      egrav: "\xE8",
      egrave: "\xE8",
      egs: "\u2A96",
      egsdot: "\u2A98",
      el: "\u2A99",
      elinters: "\u23E7",
      ell: "\u2113",
      els: "\u2A95",
      elsdot: "\u2A97",
      emacr: "\u0113",
      empty: "\u2205",
      emptyset: "\u2205",
      emptyv: "\u2205",
      emsp13: "\u2004",
      emsp14: "\u2005",
      emsp: "\u2003",
      eng: "\u014B",
      ensp: "\u2002",
      eogon: "\u0119",
      eopf: "\u{1D556}",
      epar: "\u22D5",
      eparsl: "\u29E3",
      eplus: "\u2A71",
      epsi: "\u03B5",
      epsilon: "\u03B5",
      epsiv: "\u03F5",
      eqcirc: "\u2256",
      eqcolon: "\u2255",
      eqsim: "\u2242",
      eqslantgtr: "\u2A96",
      eqslantless: "\u2A95",
      equals: "=",
      equest: "\u225F",
      equiv: "\u2261",
      equivDD: "\u2A78",
      eqvparsl: "\u29E5",
      erDot: "\u2253",
      erarr: "\u2971",
      escr: "\u212F",
      esdot: "\u2250",
      esim: "\u2242",
      eta: "\u03B7",
      et: "\xF0",
      eth: "\xF0",
      eum: "\xEB",
      euml: "\xEB",
      euro: "\u20AC",
      excl: "!",
      exist: "\u2203",
      expectation: "\u2130",
      exponentiale: "\u2147",
      fallingdotseq: "\u2252",
      fcy: "\u0444",
      female: "\u2640",
      ffilig: "\uFB03",
      fflig: "\uFB00",
      ffllig: "\uFB04",
      ffr: "\u{1D523}",
      filig: "\uFB01",
      fjlig: "fj",
      flat: "\u266D",
      fllig: "\uFB02",
      fltns: "\u25B1",
      fnof: "\u0192",
      fopf: "\u{1D557}",
      forall: "\u2200",
      fork: "\u22D4",
      forkv: "\u2AD9",
      fpartint: "\u2A0D",
      frac1: "\xBC",
      frac12: "\xBD",
      frac13: "\u2153",
      frac14: "\xBC",
      frac15: "\u2155",
      frac16: "\u2159",
      frac18: "\u215B",
      frac23: "\u2154",
      frac25: "\u2156",
      frac3: "\xBE",
      frac34: "\xBE",
      frac35: "\u2157",
      frac38: "\u215C",
      frac45: "\u2158",
      frac56: "\u215A",
      frac58: "\u215D",
      frac78: "\u215E",
      frasl: "\u2044",
      frown: "\u2322",
      fscr: "\u{1D4BB}",
      gE: "\u2267",
      gEl: "\u2A8C",
      gacute: "\u01F5",
      gamma: "\u03B3",
      gammad: "\u03DD",
      gap: "\u2A86",
      gbreve: "\u011F",
      gcirc: "\u011D",
      gcy: "\u0433",
      gdot: "\u0121",
      ge: "\u2265",
      gel: "\u22DB",
      geq: "\u2265",
      geqq: "\u2267",
      geqslant: "\u2A7E",
      ges: "\u2A7E",
      gescc: "\u2AA9",
      gesdot: "\u2A80",
      gesdoto: "\u2A82",
      gesdotol: "\u2A84",
      gesl: "\u22DB\uFE00",
      gesles: "\u2A94",
      gfr: "\u{1D524}",
      gg: "\u226B",
      ggg: "\u22D9",
      gimel: "\u2137",
      gjcy: "\u0453",
      gl: "\u2277",
      glE: "\u2A92",
      gla: "\u2AA5",
      glj: "\u2AA4",
      gnE: "\u2269",
      gnap: "\u2A8A",
      gnapprox: "\u2A8A",
      gne: "\u2A88",
      gneq: "\u2A88",
      gneqq: "\u2269",
      gnsim: "\u22E7",
      gopf: "\u{1D558}",
      grave: "`",
      gscr: "\u210A",
      gsim: "\u2273",
      gsime: "\u2A8E",
      gsiml: "\u2A90",
      g: ">",
      gt: ">",
      gtcc: "\u2AA7",
      gtcir: "\u2A7A",
      gtdot: "\u22D7",
      gtlPar: "\u2995",
      gtquest: "\u2A7C",
      gtrapprox: "\u2A86",
      gtrarr: "\u2978",
      gtrdot: "\u22D7",
      gtreqless: "\u22DB",
      gtreqqless: "\u2A8C",
      gtrless: "\u2277",
      gtrsim: "\u2273",
      gvertneqq: "\u2269\uFE00",
      gvnE: "\u2269\uFE00",
      hArr: "\u21D4",
      hairsp: "\u200A",
      half: "\xBD",
      hamilt: "\u210B",
      hardcy: "\u044A",
      harr: "\u2194",
      harrcir: "\u2948",
      harrw: "\u21AD",
      hbar: "\u210F",
      hcirc: "\u0125",
      hearts: "\u2665",
      heartsuit: "\u2665",
      hellip: "\u2026",
      hercon: "\u22B9",
      hfr: "\u{1D525}",
      hksearow: "\u2925",
      hkswarow: "\u2926",
      hoarr: "\u21FF",
      homtht: "\u223B",
      hookleftarrow: "\u21A9",
      hookrightarrow: "\u21AA",
      hopf: "\u{1D559}",
      horbar: "\u2015",
      hscr: "\u{1D4BD}",
      hslash: "\u210F",
      hstrok: "\u0127",
      hybull: "\u2043",
      hyphen: "\u2010",
      iacut: "\xED",
      iacute: "\xED",
      ic: "\u2063",
      icir: "\xEE",
      icirc: "\xEE",
      icy: "\u0438",
      iecy: "\u0435",
      iexc: "\xA1",
      iexcl: "\xA1",
      iff: "\u21D4",
      ifr: "\u{1D526}",
      igrav: "\xEC",
      igrave: "\xEC",
      ii: "\u2148",
      iiiint: "\u2A0C",
      iiint: "\u222D",
      iinfin: "\u29DC",
      iiota: "\u2129",
      ijlig: "\u0133",
      imacr: "\u012B",
      image: "\u2111",
      imagline: "\u2110",
      imagpart: "\u2111",
      imath: "\u0131",
      imof: "\u22B7",
      imped: "\u01B5",
      in: "\u2208",
      incare: "\u2105",
      infin: "\u221E",
      infintie: "\u29DD",
      inodot: "\u0131",
      int: "\u222B",
      intcal: "\u22BA",
      integers: "\u2124",
      intercal: "\u22BA",
      intlarhk: "\u2A17",
      intprod: "\u2A3C",
      iocy: "\u0451",
      iogon: "\u012F",
      iopf: "\u{1D55A}",
      iota: "\u03B9",
      iprod: "\u2A3C",
      iques: "\xBF",
      iquest: "\xBF",
      iscr: "\u{1D4BE}",
      isin: "\u2208",
      isinE: "\u22F9",
      isindot: "\u22F5",
      isins: "\u22F4",
      isinsv: "\u22F3",
      isinv: "\u2208",
      it: "\u2062",
      itilde: "\u0129",
      iukcy: "\u0456",
      ium: "\xEF",
      iuml: "\xEF",
      jcirc: "\u0135",
      jcy: "\u0439",
      jfr: "\u{1D527}",
      jmath: "\u0237",
      jopf: "\u{1D55B}",
      jscr: "\u{1D4BF}",
      jsercy: "\u0458",
      jukcy: "\u0454",
      kappa: "\u03BA",
      kappav: "\u03F0",
      kcedil: "\u0137",
      kcy: "\u043A",
      kfr: "\u{1D528}",
      kgreen: "\u0138",
      khcy: "\u0445",
      kjcy: "\u045C",
      kopf: "\u{1D55C}",
      kscr: "\u{1D4C0}",
      lAarr: "\u21DA",
      lArr: "\u21D0",
      lAtail: "\u291B",
      lBarr: "\u290E",
      lE: "\u2266",
      lEg: "\u2A8B",
      lHar: "\u2962",
      lacute: "\u013A",
      laemptyv: "\u29B4",
      lagran: "\u2112",
      lambda: "\u03BB",
      lang: "\u27E8",
      langd: "\u2991",
      langle: "\u27E8",
      lap: "\u2A85",
      laqu: "\xAB",
      laquo: "\xAB",
      larr: "\u2190",
      larrb: "\u21E4",
      larrbfs: "\u291F",
      larrfs: "\u291D",
      larrhk: "\u21A9",
      larrlp: "\u21AB",
      larrpl: "\u2939",
      larrsim: "\u2973",
      larrtl: "\u21A2",
      lat: "\u2AAB",
      latail: "\u2919",
      late: "\u2AAD",
      lates: "\u2AAD\uFE00",
      lbarr: "\u290C",
      lbbrk: "\u2772",
      lbrace: "{",
      lbrack: "[",
      lbrke: "\u298B",
      lbrksld: "\u298F",
      lbrkslu: "\u298D",
      lcaron: "\u013E",
      lcedil: "\u013C",
      lceil: "\u2308",
      lcub: "{",
      lcy: "\u043B",
      ldca: "\u2936",
      ldquo: "\u201C",
      ldquor: "\u201E",
      ldrdhar: "\u2967",
      ldrushar: "\u294B",
      ldsh: "\u21B2",
      le: "\u2264",
      leftarrow: "\u2190",
      leftarrowtail: "\u21A2",
      leftharpoondown: "\u21BD",
      leftharpoonup: "\u21BC",
      leftleftarrows: "\u21C7",
      leftrightarrow: "\u2194",
      leftrightarrows: "\u21C6",
      leftrightharpoons: "\u21CB",
      leftrightsquigarrow: "\u21AD",
      leftthreetimes: "\u22CB",
      leg: "\u22DA",
      leq: "\u2264",
      leqq: "\u2266",
      leqslant: "\u2A7D",
      les: "\u2A7D",
      lescc: "\u2AA8",
      lesdot: "\u2A7F",
      lesdoto: "\u2A81",
      lesdotor: "\u2A83",
      lesg: "\u22DA\uFE00",
      lesges: "\u2A93",
      lessapprox: "\u2A85",
      lessdot: "\u22D6",
      lesseqgtr: "\u22DA",
      lesseqqgtr: "\u2A8B",
      lessgtr: "\u2276",
      lesssim: "\u2272",
      lfisht: "\u297C",
      lfloor: "\u230A",
      lfr: "\u{1D529}",
      lg: "\u2276",
      lgE: "\u2A91",
      lhard: "\u21BD",
      lharu: "\u21BC",
      lharul: "\u296A",
      lhblk: "\u2584",
      ljcy: "\u0459",
      ll: "\u226A",
      llarr: "\u21C7",
      llcorner: "\u231E",
      llhard: "\u296B",
      lltri: "\u25FA",
      lmidot: "\u0140",
      lmoust: "\u23B0",
      lmoustache: "\u23B0",
      lnE: "\u2268",
      lnap: "\u2A89",
      lnapprox: "\u2A89",
      lne: "\u2A87",
      lneq: "\u2A87",
      lneqq: "\u2268",
      lnsim: "\u22E6",
      loang: "\u27EC",
      loarr: "\u21FD",
      lobrk: "\u27E6",
      longleftarrow: "\u27F5",
      longleftrightarrow: "\u27F7",
      longmapsto: "\u27FC",
      longrightarrow: "\u27F6",
      looparrowleft: "\u21AB",
      looparrowright: "\u21AC",
      lopar: "\u2985",
      lopf: "\u{1D55D}",
      loplus: "\u2A2D",
      lotimes: "\u2A34",
      lowast: "\u2217",
      lowbar: "_",
      loz: "\u25CA",
      lozenge: "\u25CA",
      lozf: "\u29EB",
      lpar: "(",
      lparlt: "\u2993",
      lrarr: "\u21C6",
      lrcorner: "\u231F",
      lrhar: "\u21CB",
      lrhard: "\u296D",
      lrm: "\u200E",
      lrtri: "\u22BF",
      lsaquo: "\u2039",
      lscr: "\u{1D4C1}",
      lsh: "\u21B0",
      lsim: "\u2272",
      lsime: "\u2A8D",
      lsimg: "\u2A8F",
      lsqb: "[",
      lsquo: "\u2018",
      lsquor: "\u201A",
      lstrok: "\u0142",
      l: "<",
      lt: "<",
      ltcc: "\u2AA6",
      ltcir: "\u2A79",
      ltdot: "\u22D6",
      lthree: "\u22CB",
      ltimes: "\u22C9",
      ltlarr: "\u2976",
      ltquest: "\u2A7B",
      ltrPar: "\u2996",
      ltri: "\u25C3",
      ltrie: "\u22B4",
      ltrif: "\u25C2",
      lurdshar: "\u294A",
      luruhar: "\u2966",
      lvertneqq: "\u2268\uFE00",
      lvnE: "\u2268\uFE00",
      mDDot: "\u223A",
      mac: "\xAF",
      macr: "\xAF",
      male: "\u2642",
      malt: "\u2720",
      maltese: "\u2720",
      map: "\u21A6",
      mapsto: "\u21A6",
      mapstodown: "\u21A7",
      mapstoleft: "\u21A4",
      mapstoup: "\u21A5",
      marker: "\u25AE",
      mcomma: "\u2A29",
      mcy: "\u043C",
      mdash: "\u2014",
      measuredangle: "\u2221",
      mfr: "\u{1D52A}",
      mho: "\u2127",
      micr: "\xB5",
      micro: "\xB5",
      mid: "\u2223",
      midast: "*",
      midcir: "\u2AF0",
      middo: "\xB7",
      middot: "\xB7",
      minus: "\u2212",
      minusb: "\u229F",
      minusd: "\u2238",
      minusdu: "\u2A2A",
      mlcp: "\u2ADB",
      mldr: "\u2026",
      mnplus: "\u2213",
      models: "\u22A7",
      mopf: "\u{1D55E}",
      mp: "\u2213",
      mscr: "\u{1D4C2}",
      mstpos: "\u223E",
      mu: "\u03BC",
      multimap: "\u22B8",
      mumap: "\u22B8",
      nGg: "\u22D9\u0338",
      nGt: "\u226B\u20D2",
      nGtv: "\u226B\u0338",
      nLeftarrow: "\u21CD",
      nLeftrightarrow: "\u21CE",
      nLl: "\u22D8\u0338",
      nLt: "\u226A\u20D2",
      nLtv: "\u226A\u0338",
      nRightarrow: "\u21CF",
      nVDash: "\u22AF",
      nVdash: "\u22AE",
      nabla: "\u2207",
      nacute: "\u0144",
      nang: "\u2220\u20D2",
      nap: "\u2249",
      napE: "\u2A70\u0338",
      napid: "\u224B\u0338",
      napos: "\u0149",
      napprox: "\u2249",
      natur: "\u266E",
      natural: "\u266E",
      naturals: "\u2115",
      nbs: "\xA0",
      nbsp: "\xA0",
      nbump: "\u224E\u0338",
      nbumpe: "\u224F\u0338",
      ncap: "\u2A43",
      ncaron: "\u0148",
      ncedil: "\u0146",
      ncong: "\u2247",
      ncongdot: "\u2A6D\u0338",
      ncup: "\u2A42",
      ncy: "\u043D",
      ndash: "\u2013",
      ne: "\u2260",
      neArr: "\u21D7",
      nearhk: "\u2924",
      nearr: "\u2197",
      nearrow: "\u2197",
      nedot: "\u2250\u0338",
      nequiv: "\u2262",
      nesear: "\u2928",
      nesim: "\u2242\u0338",
      nexist: "\u2204",
      nexists: "\u2204",
      nfr: "\u{1D52B}",
      ngE: "\u2267\u0338",
      nge: "\u2271",
      ngeq: "\u2271",
      ngeqq: "\u2267\u0338",
      ngeqslant: "\u2A7E\u0338",
      nges: "\u2A7E\u0338",
      ngsim: "\u2275",
      ngt: "\u226F",
      ngtr: "\u226F",
      nhArr: "\u21CE",
      nharr: "\u21AE",
      nhpar: "\u2AF2",
      ni: "\u220B",
      nis: "\u22FC",
      nisd: "\u22FA",
      niv: "\u220B",
      njcy: "\u045A",
      nlArr: "\u21CD",
      nlE: "\u2266\u0338",
      nlarr: "\u219A",
      nldr: "\u2025",
      nle: "\u2270",
      nleftarrow: "\u219A",
      nleftrightarrow: "\u21AE",
      nleq: "\u2270",
      nleqq: "\u2266\u0338",
      nleqslant: "\u2A7D\u0338",
      nles: "\u2A7D\u0338",
      nless: "\u226E",
      nlsim: "\u2274",
      nlt: "\u226E",
      nltri: "\u22EA",
      nltrie: "\u22EC",
      nmid: "\u2224",
      nopf: "\u{1D55F}",
      no: "\xAC",
      not: "\xAC",
      notin: "\u2209",
      notinE: "\u22F9\u0338",
      notindot: "\u22F5\u0338",
      notinva: "\u2209",
      notinvb: "\u22F7",
      notinvc: "\u22F6",
      notni: "\u220C",
      notniva: "\u220C",
      notnivb: "\u22FE",
      notnivc: "\u22FD",
      npar: "\u2226",
      nparallel: "\u2226",
      nparsl: "\u2AFD\u20E5",
      npart: "\u2202\u0338",
      npolint: "\u2A14",
      npr: "\u2280",
      nprcue: "\u22E0",
      npre: "\u2AAF\u0338",
      nprec: "\u2280",
      npreceq: "\u2AAF\u0338",
      nrArr: "\u21CF",
      nrarr: "\u219B",
      nrarrc: "\u2933\u0338",
      nrarrw: "\u219D\u0338",
      nrightarrow: "\u219B",
      nrtri: "\u22EB",
      nrtrie: "\u22ED",
      nsc: "\u2281",
      nsccue: "\u22E1",
      nsce: "\u2AB0\u0338",
      nscr: "\u{1D4C3}",
      nshortmid: "\u2224",
      nshortparallel: "\u2226",
      nsim: "\u2241",
      nsime: "\u2244",
      nsimeq: "\u2244",
      nsmid: "\u2224",
      nspar: "\u2226",
      nsqsube: "\u22E2",
      nsqsupe: "\u22E3",
      nsub: "\u2284",
      nsubE: "\u2AC5\u0338",
      nsube: "\u2288",
      nsubset: "\u2282\u20D2",
      nsubseteq: "\u2288",
      nsubseteqq: "\u2AC5\u0338",
      nsucc: "\u2281",
      nsucceq: "\u2AB0\u0338",
      nsup: "\u2285",
      nsupE: "\u2AC6\u0338",
      nsupe: "\u2289",
      nsupset: "\u2283\u20D2",
      nsupseteq: "\u2289",
      nsupseteqq: "\u2AC6\u0338",
      ntgl: "\u2279",
      ntild: "\xF1",
      ntilde: "\xF1",
      ntlg: "\u2278",
      ntriangleleft: "\u22EA",
      ntrianglelefteq: "\u22EC",
      ntriangleright: "\u22EB",
      ntrianglerighteq: "\u22ED",
      nu: "\u03BD",
      num: "#",
      numero: "\u2116",
      numsp: "\u2007",
      nvDash: "\u22AD",
      nvHarr: "\u2904",
      nvap: "\u224D\u20D2",
      nvdash: "\u22AC",
      nvge: "\u2265\u20D2",
      nvgt: ">\u20D2",
      nvinfin: "\u29DE",
      nvlArr: "\u2902",
      nvle: "\u2264\u20D2",
      nvlt: "<\u20D2",
      nvltrie: "\u22B4\u20D2",
      nvrArr: "\u2903",
      nvrtrie: "\u22B5\u20D2",
      nvsim: "\u223C\u20D2",
      nwArr: "\u21D6",
      nwarhk: "\u2923",
      nwarr: "\u2196",
      nwarrow: "\u2196",
      nwnear: "\u2927",
      oS: "\u24C8",
      oacut: "\xF3",
      oacute: "\xF3",
      oast: "\u229B",
      ocir: "\xF4",
      ocirc: "\xF4",
      ocy: "\u043E",
      odash: "\u229D",
      odblac: "\u0151",
      odiv: "\u2A38",
      odot: "\u2299",
      odsold: "\u29BC",
      oelig: "\u0153",
      ofcir: "\u29BF",
      ofr: "\u{1D52C}",
      ogon: "\u02DB",
      ograv: "\xF2",
      ograve: "\xF2",
      ogt: "\u29C1",
      ohbar: "\u29B5",
      ohm: "\u03A9",
      oint: "\u222E",
      olarr: "\u21BA",
      olcir: "\u29BE",
      olcross: "\u29BB",
      oline: "\u203E",
      olt: "\u29C0",
      omacr: "\u014D",
      omega: "\u03C9",
      omicron: "\u03BF",
      omid: "\u29B6",
      ominus: "\u2296",
      oopf: "\u{1D560}",
      opar: "\u29B7",
      operp: "\u29B9",
      oplus: "\u2295",
      or: "\u2228",
      orarr: "\u21BB",
      ord: "\xBA",
      order: "\u2134",
      orderof: "\u2134",
      ordf: "\xAA",
      ordm: "\xBA",
      origof: "\u22B6",
      oror: "\u2A56",
      orslope: "\u2A57",
      orv: "\u2A5B",
      oscr: "\u2134",
      oslas: "\xF8",
      oslash: "\xF8",
      osol: "\u2298",
      otild: "\xF5",
      otilde: "\xF5",
      otimes: "\u2297",
      otimesas: "\u2A36",
      oum: "\xF6",
      ouml: "\xF6",
      ovbar: "\u233D",
      par: "\xB6",
      para: "\xB6",
      parallel: "\u2225",
      parsim: "\u2AF3",
      parsl: "\u2AFD",
      part: "\u2202",
      pcy: "\u043F",
      percnt: "%",
      period: ".",
      permil: "\u2030",
      perp: "\u22A5",
      pertenk: "\u2031",
      pfr: "\u{1D52D}",
      phi: "\u03C6",
      phiv: "\u03D5",
      phmmat: "\u2133",
      phone: "\u260E",
      pi: "\u03C0",
      pitchfork: "\u22D4",
      piv: "\u03D6",
      planck: "\u210F",
      planckh: "\u210E",
      plankv: "\u210F",
      plus: "+",
      plusacir: "\u2A23",
      plusb: "\u229E",
      pluscir: "\u2A22",
      plusdo: "\u2214",
      plusdu: "\u2A25",
      pluse: "\u2A72",
      plusm: "\xB1",
      plusmn: "\xB1",
      plussim: "\u2A26",
      plustwo: "\u2A27",
      pm: "\xB1",
      pointint: "\u2A15",
      popf: "\u{1D561}",
      poun: "\xA3",
      pound: "\xA3",
      pr: "\u227A",
      prE: "\u2AB3",
      prap: "\u2AB7",
      prcue: "\u227C",
      pre: "\u2AAF",
      prec: "\u227A",
      precapprox: "\u2AB7",
      preccurlyeq: "\u227C",
      preceq: "\u2AAF",
      precnapprox: "\u2AB9",
      precneqq: "\u2AB5",
      precnsim: "\u22E8",
      precsim: "\u227E",
      prime: "\u2032",
      primes: "\u2119",
      prnE: "\u2AB5",
      prnap: "\u2AB9",
      prnsim: "\u22E8",
      prod: "\u220F",
      profalar: "\u232E",
      profline: "\u2312",
      profsurf: "\u2313",
      prop: "\u221D",
      propto: "\u221D",
      prsim: "\u227E",
      prurel: "\u22B0",
      pscr: "\u{1D4C5}",
      psi: "\u03C8",
      puncsp: "\u2008",
      qfr: "\u{1D52E}",
      qint: "\u2A0C",
      qopf: "\u{1D562}",
      qprime: "\u2057",
      qscr: "\u{1D4C6}",
      quaternions: "\u210D",
      quatint: "\u2A16",
      quest: "?",
      questeq: "\u225F",
      quo: '"',
      quot: '"',
      rAarr: "\u21DB",
      rArr: "\u21D2",
      rAtail: "\u291C",
      rBarr: "\u290F",
      rHar: "\u2964",
      race: "\u223D\u0331",
      racute: "\u0155",
      radic: "\u221A",
      raemptyv: "\u29B3",
      rang: "\u27E9",
      rangd: "\u2992",
      range: "\u29A5",
      rangle: "\u27E9",
      raqu: "\xBB",
      raquo: "\xBB",
      rarr: "\u2192",
      rarrap: "\u2975",
      rarrb: "\u21E5",
      rarrbfs: "\u2920",
      rarrc: "\u2933",
      rarrfs: "\u291E",
      rarrhk: "\u21AA",
      rarrlp: "\u21AC",
      rarrpl: "\u2945",
      rarrsim: "\u2974",
      rarrtl: "\u21A3",
      rarrw: "\u219D",
      ratail: "\u291A",
      ratio: "\u2236",
      rationals: "\u211A",
      rbarr: "\u290D",
      rbbrk: "\u2773",
      rbrace: "}",
      rbrack: "]",
      rbrke: "\u298C",
      rbrksld: "\u298E",
      rbrkslu: "\u2990",
      rcaron: "\u0159",
      rcedil: "\u0157",
      rceil: "\u2309",
      rcub: "}",
      rcy: "\u0440",
      rdca: "\u2937",
      rdldhar: "\u2969",
      rdquo: "\u201D",
      rdquor: "\u201D",
      rdsh: "\u21B3",
      real: "\u211C",
      realine: "\u211B",
      realpart: "\u211C",
      reals: "\u211D",
      rect: "\u25AD",
      re: "\xAE",
      reg: "\xAE",
      rfisht: "\u297D",
      rfloor: "\u230B",
      rfr: "\u{1D52F}",
      rhard: "\u21C1",
      rharu: "\u21C0",
      rharul: "\u296C",
      rho: "\u03C1",
      rhov: "\u03F1",
      rightarrow: "\u2192",
      rightarrowtail: "\u21A3",
      rightharpoondown: "\u21C1",
      rightharpoonup: "\u21C0",
      rightleftarrows: "\u21C4",
      rightleftharpoons: "\u21CC",
      rightrightarrows: "\u21C9",
      rightsquigarrow: "\u219D",
      rightthreetimes: "\u22CC",
      ring: "\u02DA",
      risingdotseq: "\u2253",
      rlarr: "\u21C4",
      rlhar: "\u21CC",
      rlm: "\u200F",
      rmoust: "\u23B1",
      rmoustache: "\u23B1",
      rnmid: "\u2AEE",
      roang: "\u27ED",
      roarr: "\u21FE",
      robrk: "\u27E7",
      ropar: "\u2986",
      ropf: "\u{1D563}",
      roplus: "\u2A2E",
      rotimes: "\u2A35",
      rpar: ")",
      rpargt: "\u2994",
      rppolint: "\u2A12",
      rrarr: "\u21C9",
      rsaquo: "\u203A",
      rscr: "\u{1D4C7}",
      rsh: "\u21B1",
      rsqb: "]",
      rsquo: "\u2019",
      rsquor: "\u2019",
      rthree: "\u22CC",
      rtimes: "\u22CA",
      rtri: "\u25B9",
      rtrie: "\u22B5",
      rtrif: "\u25B8",
      rtriltri: "\u29CE",
      ruluhar: "\u2968",
      rx: "\u211E",
      sacute: "\u015B",
      sbquo: "\u201A",
      sc: "\u227B",
      scE: "\u2AB4",
      scap: "\u2AB8",
      scaron: "\u0161",
      sccue: "\u227D",
      sce: "\u2AB0",
      scedil: "\u015F",
      scirc: "\u015D",
      scnE: "\u2AB6",
      scnap: "\u2ABA",
      scnsim: "\u22E9",
      scpolint: "\u2A13",
      scsim: "\u227F",
      scy: "\u0441",
      sdot: "\u22C5",
      sdotb: "\u22A1",
      sdote: "\u2A66",
      seArr: "\u21D8",
      searhk: "\u2925",
      searr: "\u2198",
      searrow: "\u2198",
      sec: "\xA7",
      sect: "\xA7",
      semi: ";",
      seswar: "\u2929",
      setminus: "\u2216",
      setmn: "\u2216",
      sext: "\u2736",
      sfr: "\u{1D530}",
      sfrown: "\u2322",
      sharp: "\u266F",
      shchcy: "\u0449",
      shcy: "\u0448",
      shortmid: "\u2223",
      shortparallel: "\u2225",
      sh: "\xAD",
      shy: "\xAD",
      sigma: "\u03C3",
      sigmaf: "\u03C2",
      sigmav: "\u03C2",
      sim: "\u223C",
      simdot: "\u2A6A",
      sime: "\u2243",
      simeq: "\u2243",
      simg: "\u2A9E",
      simgE: "\u2AA0",
      siml: "\u2A9D",
      simlE: "\u2A9F",
      simne: "\u2246",
      simplus: "\u2A24",
      simrarr: "\u2972",
      slarr: "\u2190",
      smallsetminus: "\u2216",
      smashp: "\u2A33",
      smeparsl: "\u29E4",
      smid: "\u2223",
      smile: "\u2323",
      smt: "\u2AAA",
      smte: "\u2AAC",
      smtes: "\u2AAC\uFE00",
      softcy: "\u044C",
      sol: "/",
      solb: "\u29C4",
      solbar: "\u233F",
      sopf: "\u{1D564}",
      spades: "\u2660",
      spadesuit: "\u2660",
      spar: "\u2225",
      sqcap: "\u2293",
      sqcaps: "\u2293\uFE00",
      sqcup: "\u2294",
      sqcups: "\u2294\uFE00",
      sqsub: "\u228F",
      sqsube: "\u2291",
      sqsubset: "\u228F",
      sqsubseteq: "\u2291",
      sqsup: "\u2290",
      sqsupe: "\u2292",
      sqsupset: "\u2290",
      sqsupseteq: "\u2292",
      squ: "\u25A1",
      square: "\u25A1",
      squarf: "\u25AA",
      squf: "\u25AA",
      srarr: "\u2192",
      sscr: "\u{1D4C8}",
      ssetmn: "\u2216",
      ssmile: "\u2323",
      sstarf: "\u22C6",
      star: "\u2606",
      starf: "\u2605",
      straightepsilon: "\u03F5",
      straightphi: "\u03D5",
      strns: "\xAF",
      sub: "\u2282",
      subE: "\u2AC5",
      subdot: "\u2ABD",
      sube: "\u2286",
      subedot: "\u2AC3",
      submult: "\u2AC1",
      subnE: "\u2ACB",
      subne: "\u228A",
      subplus: "\u2ABF",
      subrarr: "\u2979",
      subset: "\u2282",
      subseteq: "\u2286",
      subseteqq: "\u2AC5",
      subsetneq: "\u228A",
      subsetneqq: "\u2ACB",
      subsim: "\u2AC7",
      subsub: "\u2AD5",
      subsup: "\u2AD3",
      succ: "\u227B",
      succapprox: "\u2AB8",
      succcurlyeq: "\u227D",
      succeq: "\u2AB0",
      succnapprox: "\u2ABA",
      succneqq: "\u2AB6",
      succnsim: "\u22E9",
      succsim: "\u227F",
      sum: "\u2211",
      sung: "\u266A",
      sup: "\u2283",
      sup1: "\xB9",
      sup2: "\xB2",
      sup3: "\xB3",
      supE: "\u2AC6",
      supdot: "\u2ABE",
      supdsub: "\u2AD8",
      supe: "\u2287",
      supedot: "\u2AC4",
      suphsol: "\u27C9",
      suphsub: "\u2AD7",
      suplarr: "\u297B",
      supmult: "\u2AC2",
      supnE: "\u2ACC",
      supne: "\u228B",
      supplus: "\u2AC0",
      supset: "\u2283",
      supseteq: "\u2287",
      supseteqq: "\u2AC6",
      supsetneq: "\u228B",
      supsetneqq: "\u2ACC",
      supsim: "\u2AC8",
      supsub: "\u2AD4",
      supsup: "\u2AD6",
      swArr: "\u21D9",
      swarhk: "\u2926",
      swarr: "\u2199",
      swarrow: "\u2199",
      swnwar: "\u292A",
      szli: "\xDF",
      szlig: "\xDF",
      target: "\u2316",
      tau: "\u03C4",
      tbrk: "\u23B4",
      tcaron: "\u0165",
      tcedil: "\u0163",
      tcy: "\u0442",
      tdot: "\u20DB",
      telrec: "\u2315",
      tfr: "\u{1D531}",
      there4: "\u2234",
      therefore: "\u2234",
      theta: "\u03B8",
      thetasym: "\u03D1",
      thetav: "\u03D1",
      thickapprox: "\u2248",
      thicksim: "\u223C",
      thinsp: "\u2009",
      thkap: "\u2248",
      thksim: "\u223C",
      thor: "\xFE",
      thorn: "\xFE",
      tilde: "\u02DC",
      time: "\xD7",
      times: "\xD7",
      timesb: "\u22A0",
      timesbar: "\u2A31",
      timesd: "\u2A30",
      tint: "\u222D",
      toea: "\u2928",
      top: "\u22A4",
      topbot: "\u2336",
      topcir: "\u2AF1",
      topf: "\u{1D565}",
      topfork: "\u2ADA",
      tosa: "\u2929",
      tprime: "\u2034",
      trade: "\u2122",
      triangle: "\u25B5",
      triangledown: "\u25BF",
      triangleleft: "\u25C3",
      trianglelefteq: "\u22B4",
      triangleq: "\u225C",
      triangleright: "\u25B9",
      trianglerighteq: "\u22B5",
      tridot: "\u25EC",
      trie: "\u225C",
      triminus: "\u2A3A",
      triplus: "\u2A39",
      trisb: "\u29CD",
      tritime: "\u2A3B",
      trpezium: "\u23E2",
      tscr: "\u{1D4C9}",
      tscy: "\u0446",
      tshcy: "\u045B",
      tstrok: "\u0167",
      twixt: "\u226C",
      twoheadleftarrow: "\u219E",
      twoheadrightarrow: "\u21A0",
      uArr: "\u21D1",
      uHar: "\u2963",
      uacut: "\xFA",
      uacute: "\xFA",
      uarr: "\u2191",
      ubrcy: "\u045E",
      ubreve: "\u016D",
      ucir: "\xFB",
      ucirc: "\xFB",
      ucy: "\u0443",
      udarr: "\u21C5",
      udblac: "\u0171",
      udhar: "\u296E",
      ufisht: "\u297E",
      ufr: "\u{1D532}",
      ugrav: "\xF9",
      ugrave: "\xF9",
      uharl: "\u21BF",
      uharr: "\u21BE",
      uhblk: "\u2580",
      ulcorn: "\u231C",
      ulcorner: "\u231C",
      ulcrop: "\u230F",
      ultri: "\u25F8",
      umacr: "\u016B",
      um: "\xA8",
      uml: "\xA8",
      uogon: "\u0173",
      uopf: "\u{1D566}",
      uparrow: "\u2191",
      updownarrow: "\u2195",
      upharpoonleft: "\u21BF",
      upharpoonright: "\u21BE",
      uplus: "\u228E",
      upsi: "\u03C5",
      upsih: "\u03D2",
      upsilon: "\u03C5",
      upuparrows: "\u21C8",
      urcorn: "\u231D",
      urcorner: "\u231D",
      urcrop: "\u230E",
      uring: "\u016F",
      urtri: "\u25F9",
      uscr: "\u{1D4CA}",
      utdot: "\u22F0",
      utilde: "\u0169",
      utri: "\u25B5",
      utrif: "\u25B4",
      uuarr: "\u21C8",
      uum: "\xFC",
      uuml: "\xFC",
      uwangle: "\u29A7",
      vArr: "\u21D5",
      vBar: "\u2AE8",
      vBarv: "\u2AE9",
      vDash: "\u22A8",
      vangrt: "\u299C",
      varepsilon: "\u03F5",
      varkappa: "\u03F0",
      varnothing: "\u2205",
      varphi: "\u03D5",
      varpi: "\u03D6",
      varpropto: "\u221D",
      varr: "\u2195",
      varrho: "\u03F1",
      varsigma: "\u03C2",
      varsubsetneq: "\u228A\uFE00",
      varsubsetneqq: "\u2ACB\uFE00",
      varsupsetneq: "\u228B\uFE00",
      varsupsetneqq: "\u2ACC\uFE00",
      vartheta: "\u03D1",
      vartriangleleft: "\u22B2",
      vartriangleright: "\u22B3",
      vcy: "\u0432",
      vdash: "\u22A2",
      vee: "\u2228",
      veebar: "\u22BB",
      veeeq: "\u225A",
      vellip: "\u22EE",
      verbar: "|",
      vert: "|",
      vfr: "\u{1D533}",
      vltri: "\u22B2",
      vnsub: "\u2282\u20D2",
      vnsup: "\u2283\u20D2",
      vopf: "\u{1D567}",
      vprop: "\u221D",
      vrtri: "\u22B3",
      vscr: "\u{1D4CB}",
      vsubnE: "\u2ACB\uFE00",
      vsubne: "\u228A\uFE00",
      vsupnE: "\u2ACC\uFE00",
      vsupne: "\u228B\uFE00",
      vzigzag: "\u299A",
      wcirc: "\u0175",
      wedbar: "\u2A5F",
      wedge: "\u2227",
      wedgeq: "\u2259",
      weierp: "\u2118",
      wfr: "\u{1D534}",
      wopf: "\u{1D568}",
      wp: "\u2118",
      wr: "\u2240",
      wreath: "\u2240",
      wscr: "\u{1D4CC}",
      xcap: "\u22C2",
      xcirc: "\u25EF",
      xcup: "\u22C3",
      xdtri: "\u25BD",
      xfr: "\u{1D535}",
      xhArr: "\u27FA",
      xharr: "\u27F7",
      xi: "\u03BE",
      xlArr: "\u27F8",
      xlarr: "\u27F5",
      xmap: "\u27FC",
      xnis: "\u22FB",
      xodot: "\u2A00",
      xopf: "\u{1D569}",
      xoplus: "\u2A01",
      xotime: "\u2A02",
      xrArr: "\u27F9",
      xrarr: "\u27F6",
      xscr: "\u{1D4CD}",
      xsqcup: "\u2A06",
      xuplus: "\u2A04",
      xutri: "\u25B3",
      xvee: "\u22C1",
      xwedge: "\u22C0",
      yacut: "\xFD",
      yacute: "\xFD",
      yacy: "\u044F",
      ycirc: "\u0177",
      ycy: "\u044B",
      ye: "\xA5",
      yen: "\xA5",
      yfr: "\u{1D536}",
      yicy: "\u0457",
      yopf: "\u{1D56A}",
      yscr: "\u{1D4CE}",
      yucy: "\u044E",
      yum: "\xFF",
      yuml: "\xFF",
      zacute: "\u017A",
      zcaron: "\u017E",
      zcy: "\u0437",
      zdot: "\u017C",
      zeetrf: "\u2128",
      zeta: "\u03B6",
      zfr: "\u{1D537}",
      zhcy: "\u0436",
      zigrarr: "\u21DD",
      zopf: "\u{1D56B}",
      zscr: "\u{1D4CF}",
      zwj: "\u200D",
      zwnj: "\u200C"
    };
  }
});

// node_modules/parse-entities/decode-entity.js
var require_decode_entity = __commonJS({
  "node_modules/parse-entities/decode-entity.js"(exports, module) {
    "use strict";
    var characterEntities2 = require_character_entities();
    module.exports = decodeEntity;
    var own3 = {}.hasOwnProperty;
    function decodeEntity(characters) {
      return own3.call(characterEntities2, characters) ? characterEntities2[characters] : false;
    }
  }
});

// node_modules/parse-entities/index.js
var require_parse_entities = __commonJS({
  "node_modules/parse-entities/index.js"(exports, module) {
    "use strict";
    var legacy = require_character_entities_legacy();
    var invalid = require_character_reference_invalid();
    var decimal = require_is_decimal();
    var hexadecimal = require_is_hexadecimal();
    var alphanumerical = require_is_alphanumerical();
    var decodeEntity = require_decode_entity();
    module.exports = parseEntities;
    var own3 = {}.hasOwnProperty;
    var fromCharCode = String.fromCharCode;
    var noop2 = Function.prototype;
    var defaults = {
      warning: null,
      reference: null,
      text: null,
      warningContext: null,
      referenceContext: null,
      textContext: null,
      position: {},
      additional: null,
      attribute: false,
      nonTerminated: true
    };
    var tab = 9;
    var lineFeed = 10;
    var formFeed = 12;
    var space = 32;
    var ampersand = 38;
    var semicolon = 59;
    var lessThan = 60;
    var equalsTo = 61;
    var numberSign = 35;
    var uppercaseX = 88;
    var lowercaseX = 120;
    var replacementCharacter = 65533;
    var name = "named";
    var hexa = "hexadecimal";
    var deci = "decimal";
    var bases = {};
    bases[hexa] = 16;
    bases[deci] = 10;
    var tests = {};
    tests[name] = alphanumerical;
    tests[deci] = decimal;
    tests[hexa] = hexadecimal;
    var namedNotTerminated = 1;
    var numericNotTerminated = 2;
    var namedEmpty = 3;
    var numericEmpty = 4;
    var namedUnknown = 5;
    var numericDisallowed = 6;
    var numericProhibited = 7;
    var messages = {};
    messages[namedNotTerminated] = "Named character references must be terminated by a semicolon";
    messages[numericNotTerminated] = "Numeric character references must be terminated by a semicolon";
    messages[namedEmpty] = "Named character references cannot be empty";
    messages[numericEmpty] = "Numeric character references cannot be empty";
    messages[namedUnknown] = "Named character references must be known";
    messages[numericDisallowed] = "Numeric character references cannot be disallowed";
    messages[numericProhibited] = "Numeric character references cannot be outside the permissible Unicode range";
    function parseEntities(value, options2) {
      var settings = {};
      var option;
      var key;
      if (!options2) {
        options2 = {};
      }
      for (key in defaults) {
        option = options2[key];
        settings[key] = option === null || option === void 0 ? defaults[key] : option;
      }
      if (settings.position.indent || settings.position.start) {
        settings.indent = settings.position.indent || [];
        settings.position = settings.position.start;
      }
      return parse3(value, settings);
    }
    function parse3(value, settings) {
      var additional = settings.additional;
      var nonTerminated = settings.nonTerminated;
      var handleText = settings.text;
      var handleReference = settings.reference;
      var handleWarning = settings.warning;
      var textContext = settings.textContext;
      var referenceContext = settings.referenceContext;
      var warningContext = settings.warningContext;
      var pos = settings.position;
      var indent3 = settings.indent || [];
      var length = value.length;
      var index2 = 0;
      var lines = -1;
      var column = pos.column || 1;
      var line2 = pos.line || 1;
      var queue = "";
      var result = [];
      var entityCharacters;
      var namedEntity;
      var terminated;
      var characters;
      var character;
      var reference;
      var following;
      var warning;
      var reason;
      var output;
      var entity;
      var begin;
      var start;
      var type;
      var test;
      var prev;
      var next;
      var diff;
      var end;
      if (typeof additional === "string") {
        additional = additional.charCodeAt(0);
      }
      prev = now();
      warning = handleWarning ? parseError : noop2;
      index2--;
      length++;
      while (++index2 < length) {
        if (character === lineFeed) {
          column = indent3[lines] || 1;
        }
        character = value.charCodeAt(index2);
        if (character === ampersand) {
          following = value.charCodeAt(index2 + 1);
          if (following === tab || following === lineFeed || following === formFeed || following === space || following === ampersand || following === lessThan || following !== following || additional && following === additional) {
            queue += fromCharCode(character);
            column++;
            continue;
          }
          start = index2 + 1;
          begin = start;
          end = start;
          if (following === numberSign) {
            end = ++begin;
            following = value.charCodeAt(end);
            if (following === uppercaseX || following === lowercaseX) {
              type = hexa;
              end = ++begin;
            } else {
              type = deci;
            }
          } else {
            type = name;
          }
          entityCharacters = "";
          entity = "";
          characters = "";
          test = tests[type];
          end--;
          while (++end < length) {
            following = value.charCodeAt(end);
            if (!test(following)) {
              break;
            }
            characters += fromCharCode(following);
            if (type === name && own3.call(legacy, characters)) {
              entityCharacters = characters;
              entity = legacy[characters];
            }
          }
          terminated = value.charCodeAt(end) === semicolon;
          if (terminated) {
            end++;
            namedEntity = type === name ? decodeEntity(characters) : false;
            if (namedEntity) {
              entityCharacters = characters;
              entity = namedEntity;
            }
          }
          diff = 1 + end - start;
          if (!terminated && !nonTerminated) {
          } else if (!characters) {
            if (type !== name) {
              warning(numericEmpty, diff);
            }
          } else if (type === name) {
            if (terminated && !entity) {
              warning(namedUnknown, 1);
            } else {
              if (entityCharacters !== characters) {
                end = begin + entityCharacters.length;
                diff = 1 + end - begin;
                terminated = false;
              }
              if (!terminated) {
                reason = entityCharacters ? namedNotTerminated : namedEmpty;
                if (settings.attribute) {
                  following = value.charCodeAt(end);
                  if (following === equalsTo) {
                    warning(reason, diff);
                    entity = null;
                  } else if (alphanumerical(following)) {
                    entity = null;
                  } else {
                    warning(reason, diff);
                  }
                } else {
                  warning(reason, diff);
                }
              }
            }
            reference = entity;
          } else {
            if (!terminated) {
              warning(numericNotTerminated, diff);
            }
            reference = parseInt(characters, bases[type]);
            if (prohibited(reference)) {
              warning(numericProhibited, diff);
              reference = fromCharCode(replacementCharacter);
            } else if (reference in invalid) {
              warning(numericDisallowed, diff);
              reference = invalid[reference];
            } else {
              output = "";
              if (disallowed(reference)) {
                warning(numericDisallowed, diff);
              }
              if (reference > 65535) {
                reference -= 65536;
                output += fromCharCode(reference >>> (10 & 1023) | 55296);
                reference = 56320 | reference & 1023;
              }
              reference = output + fromCharCode(reference);
            }
          }
          if (reference) {
            flush();
            prev = now();
            index2 = end - 1;
            column += end - start + 1;
            result.push(reference);
            next = now();
            next.offset++;
            if (handleReference) {
              handleReference.call(
                referenceContext,
                reference,
                { start: prev, end: next },
                value.slice(start - 1, end)
              );
            }
            prev = next;
          } else {
            characters = value.slice(start - 1, end);
            queue += characters;
            column += characters.length;
            index2 = end - 1;
          }
        } else {
          if (character === 10) {
            line2++;
            lines++;
            column = 0;
          }
          if (character === character) {
            queue += fromCharCode(character);
            column++;
          } else {
            flush();
          }
        }
      }
      return result.join("");
      function now() {
        return {
          line: line2,
          column,
          offset: index2 + (pos.offset || 0)
        };
      }
      function parseError(code2, offset) {
        var position2 = now();
        position2.column += offset;
        position2.offset += offset;
        handleWarning.call(warningContext, messages[code2], position2, code2);
      }
      function flush() {
        if (queue) {
          result.push(queue);
          if (handleText) {
            handleText.call(textContext, queue, { start: prev, end: now() });
          }
          queue = "";
        }
      }
    }
    function prohibited(code2) {
      return code2 >= 55296 && code2 <= 57343 || code2 > 1114111;
    }
    function disallowed(code2) {
      return code2 >= 1 && code2 <= 8 || code2 === 11 || code2 >= 13 && code2 <= 31 || code2 >= 127 && code2 <= 159 || code2 >= 64976 && code2 <= 65007 || (code2 & 65535) === 65535 || (code2 & 65535) === 65534;
    }
  }
});

// node_modules/remark-parse/lib/decode.js
var require_decode = __commonJS({
  "node_modules/remark-parse/lib/decode.js"(exports, module) {
    "use strict";
    var xtend = require_immutable();
    var entities = require_parse_entities();
    module.exports = factory;
    function factory(ctx) {
      decoder.raw = decodeRaw;
      return decoder;
      function normalize(position2) {
        var offsets = ctx.offset;
        var line2 = position2.line;
        var result = [];
        while (++line2) {
          if (!(line2 in offsets)) {
            break;
          }
          result.push((offsets[line2] || 0) + 1);
        }
        return { start: position2, indent: result };
      }
      function decoder(value, position2, handler) {
        entities(value, {
          position: normalize(position2),
          warning: handleWarning,
          text: handler,
          reference: handler,
          textContext: ctx,
          referenceContext: ctx
        });
      }
      function decodeRaw(value, position2, options2) {
        return entities(
          value,
          xtend(options2, { position: normalize(position2), warning: handleWarning })
        );
      }
      function handleWarning(reason, position2, code2) {
        if (code2 !== 3) {
          ctx.file.message(reason, position2);
        }
      }
    }
  }
});

// node_modules/remark-parse/lib/tokenizer.js
var require_tokenizer = __commonJS({
  "node_modules/remark-parse/lib/tokenizer.js"(exports, module) {
    "use strict";
    module.exports = factory;
    function factory(type) {
      return tokenize;
      function tokenize(value, location) {
        var self = this;
        var offset = self.offset;
        var tokens = [];
        var methods = self[type + "Methods"];
        var tokenizers = self[type + "Tokenizers"];
        var line2 = location.line;
        var column = location.column;
        var index2;
        var length;
        var method;
        var name;
        var matched;
        var valueLength;
        if (!value) {
          return tokens;
        }
        eat.now = now;
        eat.file = self.file;
        updatePosition("");
        while (value) {
          index2 = -1;
          length = methods.length;
          matched = false;
          while (++index2 < length) {
            name = methods[index2];
            method = tokenizers[name];
            if (method && /* istanbul ignore next */
            (!method.onlyAtStart || self.atStart) && /* istanbul ignore next */
            (!method.notInList || !self.inList) && /* istanbul ignore next */
            (!method.notInBlock || !self.inBlock) && (!method.notInLink || !self.inLink)) {
              valueLength = value.length;
              method.apply(self, [eat, value]);
              matched = valueLength !== value.length;
              if (matched) {
                break;
              }
            }
          }
          if (!matched) {
            self.file.fail(new Error("Infinite loop"), eat.now());
          }
        }
        self.eof = now();
        return tokens;
        function updatePosition(subvalue) {
          var lastIndex = -1;
          var index3 = subvalue.indexOf("\n");
          while (index3 !== -1) {
            line2++;
            lastIndex = index3;
            index3 = subvalue.indexOf("\n", index3 + 1);
          }
          if (lastIndex === -1) {
            column += subvalue.length;
          } else {
            column = subvalue.length - lastIndex;
          }
          if (line2 in offset) {
            if (lastIndex !== -1) {
              column += offset[line2];
            } else if (column <= offset[line2]) {
              column = offset[line2] + 1;
            }
          }
        }
        function getOffset() {
          var indentation = [];
          var pos = line2 + 1;
          return function() {
            var last = line2 + 1;
            while (pos < last) {
              indentation.push((offset[pos] || 0) + 1);
              pos++;
            }
            return indentation;
          };
        }
        function now() {
          var pos = { line: line2, column };
          pos.offset = self.toOffset(pos);
          return pos;
        }
        function Position(start) {
          this.start = start;
          this.end = now();
        }
        function validateEat(subvalue) {
          if (value.slice(0, subvalue.length) !== subvalue) {
            self.file.fail(
              new Error(
                "Incorrectly eaten value: please report this warning on https://git.io/vg5Ft"
              ),
              now()
            );
          }
        }
        function position2() {
          var before = now();
          return update;
          function update(node2, indent3) {
            var previous4 = node2.position;
            var start = previous4 ? previous4.start : before;
            var combined = [];
            var n = previous4 && previous4.end.line;
            var l = before.line;
            node2.position = new Position(start);
            if (previous4 && indent3 && previous4.indent) {
              combined = previous4.indent;
              if (n < l) {
                while (++n < l) {
                  combined.push((offset[n] || 0) + 1);
                }
                combined.push(before.column);
              }
              indent3 = combined.concat(indent3);
            }
            node2.position.indent = indent3 || [];
            return node2;
          }
        }
        function add(node2, parent) {
          var children = parent ? parent.children : tokens;
          var previous4 = children[children.length - 1];
          var fn;
          if (previous4 && node2.type === previous4.type && (node2.type === "text" || node2.type === "blockquote") && mergeable(previous4) && mergeable(node2)) {
            fn = node2.type === "text" ? mergeText : mergeBlockquote;
            node2 = fn.call(self, previous4, node2);
          }
          if (node2 !== previous4) {
            children.push(node2);
          }
          if (self.atStart && tokens.length !== 0) {
            self.exitStart();
          }
          return node2;
        }
        function eat(subvalue) {
          var indent3 = getOffset();
          var pos = position2();
          var current = now();
          validateEat(subvalue);
          apply.reset = reset;
          reset.test = test;
          apply.test = test;
          value = value.slice(subvalue.length);
          updatePosition(subvalue);
          indent3 = indent3();
          return apply;
          function apply(node2, parent) {
            return pos(add(pos(node2), parent), indent3);
          }
          function reset() {
            var node2 = apply.apply(null, arguments);
            line2 = current.line;
            column = current.column;
            value = subvalue + value;
            return node2;
          }
          function test() {
            var result = pos({});
            line2 = current.line;
            column = current.column;
            value = subvalue + value;
            return result.position;
          }
        }
      }
    }
    function mergeable(node2) {
      var start;
      var end;
      if (node2.type !== "text" || !node2.position) {
        return true;
      }
      start = node2.position.start;
      end = node2.position.end;
      return start.line !== end.line || end.column - start.column === node2.value.length;
    }
    function mergeText(previous4, node2) {
      previous4.value += node2.value;
      return previous4;
    }
    function mergeBlockquote(previous4, node2) {
      if (this.options.commonmark || this.options.gfm) {
        return node2;
      }
      previous4.children = previous4.children.concat(node2.children);
      return previous4;
    }
  }
});

// node_modules/markdown-escapes/index.js
var require_markdown_escapes = __commonJS({
  "node_modules/markdown-escapes/index.js"(exports, module) {
    "use strict";
    module.exports = escapes;
    var defaults = [
      "\\",
      "`",
      "*",
      "{",
      "}",
      "[",
      "]",
      "(",
      ")",
      "#",
      "+",
      "-",
      ".",
      "!",
      "_",
      ">"
    ];
    var gfm2 = defaults.concat(["~", "|"]);
    var commonmark = gfm2.concat([
      "\n",
      '"',
      "$",
      "%",
      "&",
      "'",
      ",",
      "/",
      ":",
      ";",
      "<",
      "=",
      "?",
      "@",
      "^"
    ]);
    escapes.default = defaults;
    escapes.gfm = gfm2;
    escapes.commonmark = commonmark;
    function escapes(options2) {
      var settings = options2 || {};
      if (settings.commonmark) {
        return commonmark;
      }
      return settings.gfm ? gfm2 : defaults;
    }
  }
});

// node_modules/remark-parse/lib/block-elements.js
var require_block_elements = __commonJS({
  "node_modules/remark-parse/lib/block-elements.js"(exports, module) {
    "use strict";
    module.exports = [
      "address",
      "article",
      "aside",
      "base",
      "basefont",
      "blockquote",
      "body",
      "caption",
      "center",
      "col",
      "colgroup",
      "dd",
      "details",
      "dialog",
      "dir",
      "div",
      "dl",
      "dt",
      "fieldset",
      "figcaption",
      "figure",
      "footer",
      "form",
      "frame",
      "frameset",
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
      "iframe",
      "legend",
      "li",
      "link",
      "main",
      "menu",
      "menuitem",
      "meta",
      "nav",
      "noframes",
      "ol",
      "optgroup",
      "option",
      "p",
      "param",
      "pre",
      "section",
      "source",
      "title",
      "summary",
      "table",
      "tbody",
      "td",
      "tfoot",
      "th",
      "thead",
      "title",
      "tr",
      "track",
      "ul"
    ];
  }
});

// node_modules/remark-parse/lib/defaults.js
var require_defaults = __commonJS({
  "node_modules/remark-parse/lib/defaults.js"(exports, module) {
    "use strict";
    module.exports = {
      position: true,
      gfm: true,
      commonmark: false,
      pedantic: false,
      blocks: require_block_elements()
    };
  }
});

// node_modules/remark-parse/lib/set-options.js
var require_set_options = __commonJS({
  "node_modules/remark-parse/lib/set-options.js"(exports, module) {
    "use strict";
    var xtend = require_immutable();
    var escapes = require_markdown_escapes();
    var defaults = require_defaults();
    module.exports = setOptions;
    function setOptions(options2) {
      var self = this;
      var current = self.options;
      var key;
      var value;
      if (options2 == null) {
        options2 = {};
      } else if (typeof options2 === "object") {
        options2 = xtend(options2);
      } else {
        throw new Error("Invalid value `" + options2 + "` for setting `options`");
      }
      for (key in defaults) {
        value = options2[key];
        if (value == null) {
          value = current[key];
        }
        if (key !== "blocks" && typeof value !== "boolean" || key === "blocks" && typeof value !== "object") {
          throw new Error(
            "Invalid value `" + value + "` for setting `options." + key + "`"
          );
        }
        options2[key] = value;
      }
      self.options = options2;
      self.escape = escapes(options2);
      return self;
    }
  }
});

// node_modules/remark-parse/node_modules/unist-util-is/convert.js
var require_convert = __commonJS({
  "node_modules/remark-parse/node_modules/unist-util-is/convert.js"(exports, module) {
    "use strict";
    module.exports = convert2;
    function convert2(test) {
      if (test == null) {
        return ok3;
      }
      if (typeof test === "string") {
        return typeFactory2(test);
      }
      if (typeof test === "object") {
        return "length" in test ? anyFactory2(test) : allFactory(test);
      }
      if (typeof test === "function") {
        return test;
      }
      throw new Error("Expected function, string, or object as test");
    }
    function allFactory(test) {
      return all2;
      function all2(node2) {
        var key;
        for (key in test) {
          if (node2[key] !== test[key]) return false;
        }
        return true;
      }
    }
    function anyFactory2(tests) {
      var checks = [];
      var index2 = -1;
      while (++index2 < tests.length) {
        checks[index2] = convert2(tests[index2]);
      }
      return any;
      function any() {
        var index3 = -1;
        while (++index3 < checks.length) {
          if (checks[index3].apply(this, arguments)) {
            return true;
          }
        }
        return false;
      }
    }
    function typeFactory2(test) {
      return type;
      function type(node2) {
        return Boolean(node2 && node2.type === test);
      }
    }
    function ok3() {
      return true;
    }
  }
});

// node_modules/remark-parse/node_modules/unist-util-visit-parents/color.browser.js
var require_color_browser = __commonJS({
  "node_modules/remark-parse/node_modules/unist-util-visit-parents/color.browser.js"(exports, module) {
    module.exports = identity;
    function identity(d) {
      return d;
    }
  }
});

// node_modules/remark-parse/node_modules/unist-util-visit-parents/index.js
var require_unist_util_visit_parents = __commonJS({
  "node_modules/remark-parse/node_modules/unist-util-visit-parents/index.js"(exports, module) {
    "use strict";
    module.exports = visitParents2;
    var convert2 = require_convert();
    var color2 = require_color_browser();
    var CONTINUE2 = true;
    var SKIP2 = "skip";
    var EXIT2 = false;
    visitParents2.CONTINUE = CONTINUE2;
    visitParents2.SKIP = SKIP2;
    visitParents2.EXIT = EXIT2;
    function visitParents2(tree, test, visitor, reverse) {
      var step;
      var is2;
      if (typeof test === "function" && typeof visitor !== "function") {
        reverse = visitor;
        visitor = test;
        test = null;
      }
      is2 = convert2(test);
      step = reverse ? -1 : 1;
      factory(tree, null, [])();
      function factory(node2, index2, parents) {
        var value = typeof node2 === "object" && node2 !== null ? node2 : {};
        var name;
        if (typeof value.type === "string") {
          name = typeof value.tagName === "string" ? value.tagName : typeof value.name === "string" ? value.name : void 0;
          visit.displayName = "node (" + color2(value.type + (name ? "<" + name + ">" : "")) + ")";
        }
        return visit;
        function visit() {
          var grandparents = parents.concat(node2);
          var result = [];
          var subresult;
          var offset;
          if (!test || is2(node2, index2, parents[parents.length - 1] || null)) {
            result = toResult2(visitor(node2, parents));
            if (result[0] === EXIT2) {
              return result;
            }
          }
          if (node2.children && result[0] !== SKIP2) {
            offset = (reverse ? node2.children.length : -1) + step;
            while (offset > -1 && offset < node2.children.length) {
              subresult = factory(node2.children[offset], offset, grandparents)();
              if (subresult[0] === EXIT2) {
                return subresult;
              }
              offset = typeof subresult[1] === "number" ? subresult[1] : offset + step;
            }
          }
          return result;
        }
      }
    }
    function toResult2(value) {
      if (value !== null && typeof value === "object" && "length" in value) {
        return value;
      }
      if (typeof value === "number") {
        return [CONTINUE2, value];
      }
      return [value];
    }
  }
});

// node_modules/remark-parse/node_modules/unist-util-visit/index.js
var require_unist_util_visit = __commonJS({
  "node_modules/remark-parse/node_modules/unist-util-visit/index.js"(exports, module) {
    "use strict";
    module.exports = visit;
    var visitParents2 = require_unist_util_visit_parents();
    var CONTINUE2 = visitParents2.CONTINUE;
    var SKIP2 = visitParents2.SKIP;
    var EXIT2 = visitParents2.EXIT;
    visit.CONTINUE = CONTINUE2;
    visit.SKIP = SKIP2;
    visit.EXIT = EXIT2;
    function visit(tree, test, visitor, reverse) {
      if (typeof test === "function" && typeof visitor !== "function") {
        reverse = visitor;
        visitor = test;
        test = null;
      }
      visitParents2(tree, test, overload, reverse);
      function overload(node2, parents) {
        var parent = parents[parents.length - 1];
        var index2 = parent ? parent.children.indexOf(node2) : null;
        return visitor(node2, index2, parent);
      }
    }
  }
});

// node_modules/remark-parse/node_modules/unist-util-remove-position/index.js
var require_unist_util_remove_position = __commonJS({
  "node_modules/remark-parse/node_modules/unist-util-remove-position/index.js"(exports, module) {
    "use strict";
    var visit = require_unist_util_visit();
    module.exports = removePosition;
    function removePosition(node2, force) {
      visit(node2, force ? hard : soft);
      return node2;
    }
    function hard(node2) {
      delete node2.position;
    }
    function soft(node2) {
      node2.position = void 0;
    }
  }
});

// node_modules/remark-parse/lib/parse.js
var require_parse = __commonJS({
  "node_modules/remark-parse/lib/parse.js"(exports, module) {
    "use strict";
    var xtend = require_immutable();
    var removePosition = require_unist_util_remove_position();
    module.exports = parse3;
    var lineFeed = "\n";
    var lineBreaksExpression = /\r\n|\r/g;
    function parse3() {
      var self = this;
      var value = String(self.file);
      var start = { line: 1, column: 1, offset: 0 };
      var content3 = xtend(start);
      var node2;
      value = value.replace(lineBreaksExpression, lineFeed);
      if (value.charCodeAt(0) === 65279) {
        value = value.slice(1);
        content3.column++;
        content3.offset++;
      }
      node2 = {
        type: "root",
        children: self.tokenizeBlock(value, content3),
        position: { start, end: self.eof || xtend(start) }
      };
      if (!self.options.position) {
        removePosition(node2, true);
      }
      return node2;
    }
  }
});

// node_modules/remark-parse/lib/tokenize/blank-line.js
var require_blank_line = __commonJS({
  "node_modules/remark-parse/lib/tokenize/blank-line.js"(exports, module) {
    "use strict";
    var reBlankLine = /^[ \t]*(\n|$)/;
    module.exports = blankLine2;
    function blankLine2(eat, value, silent) {
      var match;
      var subvalue = "";
      var index2 = 0;
      var length = value.length;
      while (index2 < length) {
        match = reBlankLine.exec(value.slice(index2));
        if (match == null) {
          break;
        }
        index2 += match[0].length;
        subvalue += match[0];
      }
      if (subvalue === "") {
        return;
      }
      if (silent) {
        return true;
      }
      eat(subvalue);
    }
  }
});

// node_modules/repeat-string/index.js
var require_repeat_string = __commonJS({
  "node_modules/repeat-string/index.js"(exports, module) {
    "use strict";
    var res = "";
    var cache;
    module.exports = repeat;
    function repeat(str, num) {
      if (typeof str !== "string") {
        throw new TypeError("expected a string");
      }
      if (num === 1) return str;
      if (num === 2) return str + str;
      var max = str.length * num;
      if (cache !== str || typeof cache === "undefined") {
        cache = str;
        res = "";
      } else if (res.length >= max) {
        return res.substr(0, max);
      }
      while (max > res.length && num > 1) {
        if (num & 1) {
          res += str;
        }
        num >>= 1;
        str += str;
      }
      res += str;
      res = res.substr(0, max);
      return res;
    }
  }
});

// node_modules/trim-trailing-lines/index.js
var require_trim_trailing_lines = __commonJS({
  "node_modules/trim-trailing-lines/index.js"(exports, module) {
    "use strict";
    module.exports = trimTrailingLines;
    function trimTrailingLines(value) {
      return String(value).replace(/\n+$/, "");
    }
  }
});

// node_modules/remark-parse/lib/tokenize/code-indented.js
var require_code_indented = __commonJS({
  "node_modules/remark-parse/lib/tokenize/code-indented.js"(exports, module) {
    "use strict";
    var repeat = require_repeat_string();
    var trim = require_trim_trailing_lines();
    module.exports = indentedCode;
    var lineFeed = "\n";
    var tab = "	";
    var space = " ";
    var tabSize = 4;
    var codeIndent = repeat(space, tabSize);
    function indentedCode(eat, value, silent) {
      var index2 = -1;
      var length = value.length;
      var subvalue = "";
      var content3 = "";
      var subvalueQueue = "";
      var contentQueue = "";
      var character;
      var blankQueue;
      var indent3;
      while (++index2 < length) {
        character = value.charAt(index2);
        if (indent3) {
          indent3 = false;
          subvalue += subvalueQueue;
          content3 += contentQueue;
          subvalueQueue = "";
          contentQueue = "";
          if (character === lineFeed) {
            subvalueQueue = character;
            contentQueue = character;
          } else {
            subvalue += character;
            content3 += character;
            while (++index2 < length) {
              character = value.charAt(index2);
              if (!character || character === lineFeed) {
                contentQueue = character;
                subvalueQueue = character;
                break;
              }
              subvalue += character;
              content3 += character;
            }
          }
        } else if (character === space && value.charAt(index2 + 1) === character && value.charAt(index2 + 2) === character && value.charAt(index2 + 3) === character) {
          subvalueQueue += codeIndent;
          index2 += 3;
          indent3 = true;
        } else if (character === tab) {
          subvalueQueue += character;
          indent3 = true;
        } else {
          blankQueue = "";
          while (character === tab || character === space) {
            blankQueue += character;
            character = value.charAt(++index2);
          }
          if (character !== lineFeed) {
            break;
          }
          subvalueQueue += blankQueue + character;
          contentQueue += character;
        }
      }
      if (content3) {
        if (silent) {
          return true;
        }
        return eat(subvalue)({
          type: "code",
          lang: null,
          meta: null,
          value: trim(content3)
        });
      }
    }
  }
});

// node_modules/remark-parse/lib/tokenize/code-fenced.js
var require_code_fenced = __commonJS({
  "node_modules/remark-parse/lib/tokenize/code-fenced.js"(exports, module) {
    "use strict";
    module.exports = fencedCode;
    var lineFeed = "\n";
    var tab = "	";
    var space = " ";
    var tilde = "~";
    var graveAccent = "`";
    var minFenceCount = 3;
    var tabSize = 4;
    function fencedCode(eat, value, silent) {
      var self = this;
      var gfm2 = self.options.gfm;
      var length = value.length + 1;
      var index2 = 0;
      var subvalue = "";
      var fenceCount;
      var marker;
      var character;
      var flag;
      var lang;
      var meta;
      var queue;
      var content3;
      var exdentedContent;
      var closing;
      var exdentedClosing;
      var indent3;
      var now;
      if (!gfm2) {
        return;
      }
      while (index2 < length) {
        character = value.charAt(index2);
        if (character !== space && character !== tab) {
          break;
        }
        subvalue += character;
        index2++;
      }
      indent3 = index2;
      character = value.charAt(index2);
      if (character !== tilde && character !== graveAccent) {
        return;
      }
      index2++;
      marker = character;
      fenceCount = 1;
      subvalue += character;
      while (index2 < length) {
        character = value.charAt(index2);
        if (character !== marker) {
          break;
        }
        subvalue += character;
        fenceCount++;
        index2++;
      }
      if (fenceCount < minFenceCount) {
        return;
      }
      while (index2 < length) {
        character = value.charAt(index2);
        if (character !== space && character !== tab) {
          break;
        }
        subvalue += character;
        index2++;
      }
      flag = "";
      queue = "";
      while (index2 < length) {
        character = value.charAt(index2);
        if (character === lineFeed || marker === graveAccent && character === marker) {
          break;
        }
        if (character === space || character === tab) {
          queue += character;
        } else {
          flag += queue + character;
          queue = "";
        }
        index2++;
      }
      character = value.charAt(index2);
      if (character && character !== lineFeed) {
        return;
      }
      if (silent) {
        return true;
      }
      now = eat.now();
      now.column += subvalue.length;
      now.offset += subvalue.length;
      subvalue += flag;
      flag = self.decode.raw(self.unescape(flag), now);
      if (queue) {
        subvalue += queue;
      }
      queue = "";
      closing = "";
      exdentedClosing = "";
      content3 = "";
      exdentedContent = "";
      var skip = true;
      while (index2 < length) {
        character = value.charAt(index2);
        content3 += closing;
        exdentedContent += exdentedClosing;
        closing = "";
        exdentedClosing = "";
        if (character !== lineFeed) {
          content3 += character;
          exdentedClosing += character;
          index2++;
          continue;
        }
        if (skip) {
          subvalue += character;
          skip = false;
        } else {
          closing += character;
          exdentedClosing += character;
        }
        queue = "";
        index2++;
        while (index2 < length) {
          character = value.charAt(index2);
          if (character !== space) {
            break;
          }
          queue += character;
          index2++;
        }
        closing += queue;
        exdentedClosing += queue.slice(indent3);
        if (queue.length >= tabSize) {
          continue;
        }
        queue = "";
        while (index2 < length) {
          character = value.charAt(index2);
          if (character !== marker) {
            break;
          }
          queue += character;
          index2++;
        }
        closing += queue;
        exdentedClosing += queue;
        if (queue.length < fenceCount) {
          continue;
        }
        queue = "";
        while (index2 < length) {
          character = value.charAt(index2);
          if (character !== space && character !== tab) {
            break;
          }
          closing += character;
          exdentedClosing += character;
          index2++;
        }
        if (!character || character === lineFeed) {
          break;
        }
      }
      subvalue += content3 + closing;
      index2 = -1;
      length = flag.length;
      while (++index2 < length) {
        character = flag.charAt(index2);
        if (character === space || character === tab) {
          if (!lang) {
            lang = flag.slice(0, index2);
          }
        } else if (lang) {
          meta = flag.slice(index2);
          break;
        }
      }
      return eat(subvalue)({
        type: "code",
        lang: lang || flag || null,
        meta: meta || null,
        value: exdentedContent
      });
    }
  }
});

// node_modules/trim/index.js
var require_trim = __commonJS({
  "node_modules/trim/index.js"(exports, module) {
    exports = module.exports = trim;
    function trim(str) {
      if (str.trim) return str.trim();
      return exports.right(exports.left(str));
    }
    exports.left = function(str) {
      if (str.trimLeft) return str.trimLeft();
      return str.replace(/^\s\s*/, "");
    };
    exports.right = function(str) {
      if (str.trimRight) return str.trimRight();
      var whitespace_pattern = /\s/, i = str.length;
      while (whitespace_pattern.test(str.charAt(--i))) ;
      return str.slice(0, i + 1);
    };
  }
});

// node_modules/remark-parse/lib/util/interrupt.js
var require_interrupt = __commonJS({
  "node_modules/remark-parse/lib/util/interrupt.js"(exports, module) {
    "use strict";
    module.exports = interrupt;
    function interrupt(interruptors, tokenizers, ctx, parameters) {
      var length = interruptors.length;
      var index2 = -1;
      var interruptor;
      var config;
      while (++index2 < length) {
        interruptor = interruptors[index2];
        config = interruptor[1] || {};
        if (config.pedantic !== void 0 && config.pedantic !== ctx.options.pedantic) {
          continue;
        }
        if (config.commonmark !== void 0 && config.commonmark !== ctx.options.commonmark) {
          continue;
        }
        if (tokenizers[interruptor[0]].apply(ctx, parameters)) {
          return true;
        }
      }
      return false;
    }
  }
});

// node_modules/remark-parse/lib/tokenize/blockquote.js
var require_blockquote = __commonJS({
  "node_modules/remark-parse/lib/tokenize/blockquote.js"(exports, module) {
    "use strict";
    var trim = require_trim();
    var interrupt = require_interrupt();
    module.exports = blockquote;
    var lineFeed = "\n";
    var tab = "	";
    var space = " ";
    var greaterThan = ">";
    function blockquote(eat, value, silent) {
      var self = this;
      var offsets = self.offset;
      var tokenizers = self.blockTokenizers;
      var interruptors = self.interruptBlockquote;
      var now = eat.now();
      var currentLine = now.line;
      var length = value.length;
      var values = [];
      var contents = [];
      var indents = [];
      var add;
      var index2 = 0;
      var character;
      var rest;
      var nextIndex;
      var content3;
      var line2;
      var startIndex;
      var prefixed;
      var exit3;
      while (index2 < length) {
        character = value.charAt(index2);
        if (character !== space && character !== tab) {
          break;
        }
        index2++;
      }
      if (value.charAt(index2) !== greaterThan) {
        return;
      }
      if (silent) {
        return true;
      }
      index2 = 0;
      while (index2 < length) {
        nextIndex = value.indexOf(lineFeed, index2);
        startIndex = index2;
        prefixed = false;
        if (nextIndex === -1) {
          nextIndex = length;
        }
        while (index2 < length) {
          character = value.charAt(index2);
          if (character !== space && character !== tab) {
            break;
          }
          index2++;
        }
        if (value.charAt(index2) === greaterThan) {
          index2++;
          prefixed = true;
          if (value.charAt(index2) === space) {
            index2++;
          }
        } else {
          index2 = startIndex;
        }
        content3 = value.slice(index2, nextIndex);
        if (!prefixed && !trim(content3)) {
          index2 = startIndex;
          break;
        }
        if (!prefixed) {
          rest = value.slice(index2);
          if (interrupt(interruptors, tokenizers, self, [eat, rest, true])) {
            break;
          }
        }
        line2 = startIndex === index2 ? content3 : value.slice(startIndex, nextIndex);
        indents.push(index2 - startIndex);
        values.push(line2);
        contents.push(content3);
        index2 = nextIndex + 1;
      }
      index2 = -1;
      length = indents.length;
      add = eat(values.join(lineFeed));
      while (++index2 < length) {
        offsets[currentLine] = (offsets[currentLine] || 0) + indents[index2];
        currentLine++;
      }
      exit3 = self.enterBlock();
      contents = self.tokenizeBlock(contents.join(lineFeed), now);
      exit3();
      return add({ type: "blockquote", children: contents });
    }
  }
});

// node_modules/remark-parse/lib/tokenize/heading-atx.js
var require_heading_atx = __commonJS({
  "node_modules/remark-parse/lib/tokenize/heading-atx.js"(exports, module) {
    "use strict";
    module.exports = atxHeading;
    var lineFeed = "\n";
    var tab = "	";
    var space = " ";
    var numberSign = "#";
    var maxFenceCount = 6;
    function atxHeading(eat, value, silent) {
      var self = this;
      var pedantic = self.options.pedantic;
      var length = value.length + 1;
      var index2 = -1;
      var now = eat.now();
      var subvalue = "";
      var content3 = "";
      var character;
      var queue;
      var depth;
      while (++index2 < length) {
        character = value.charAt(index2);
        if (character !== space && character !== tab) {
          index2--;
          break;
        }
        subvalue += character;
      }
      depth = 0;
      while (++index2 <= length) {
        character = value.charAt(index2);
        if (character !== numberSign) {
          index2--;
          break;
        }
        subvalue += character;
        depth++;
      }
      if (depth > maxFenceCount) {
        return;
      }
      if (!depth || !pedantic && value.charAt(index2 + 1) === numberSign) {
        return;
      }
      length = value.length + 1;
      queue = "";
      while (++index2 < length) {
        character = value.charAt(index2);
        if (character !== space && character !== tab) {
          index2--;
          break;
        }
        queue += character;
      }
      if (!pedantic && queue.length === 0 && character && character !== lineFeed) {
        return;
      }
      if (silent) {
        return true;
      }
      subvalue += queue;
      queue = "";
      content3 = "";
      while (++index2 < length) {
        character = value.charAt(index2);
        if (!character || character === lineFeed) {
          break;
        }
        if (character !== space && character !== tab && character !== numberSign) {
          content3 += queue + character;
          queue = "";
          continue;
        }
        while (character === space || character === tab) {
          queue += character;
          character = value.charAt(++index2);
        }
        if (!pedantic && content3 && !queue && character === numberSign) {
          content3 += character;
          continue;
        }
        while (character === numberSign) {
          queue += character;
          character = value.charAt(++index2);
        }
        while (character === space || character === tab) {
          queue += character;
          character = value.charAt(++index2);
        }
        index2--;
      }
      now.column += subvalue.length;
      now.offset += subvalue.length;
      subvalue += content3 + queue;
      return eat(subvalue)({
        type: "heading",
        depth,
        children: self.tokenizeInline(content3, now)
      });
    }
  }
});

// node_modules/remark-parse/lib/tokenize/thematic-break.js
var require_thematic_break = __commonJS({
  "node_modules/remark-parse/lib/tokenize/thematic-break.js"(exports, module) {
    "use strict";
    module.exports = thematicBreak2;
    var tab = "	";
    var lineFeed = "\n";
    var space = " ";
    var asterisk = "*";
    var dash = "-";
    var underscore = "_";
    var maxCount = 3;
    function thematicBreak2(eat, value, silent) {
      var index2 = -1;
      var length = value.length + 1;
      var subvalue = "";
      var character;
      var marker;
      var markerCount;
      var queue;
      while (++index2 < length) {
        character = value.charAt(index2);
        if (character !== tab && character !== space) {
          break;
        }
        subvalue += character;
      }
      if (character !== asterisk && character !== dash && character !== underscore) {
        return;
      }
      marker = character;
      subvalue += character;
      markerCount = 1;
      queue = "";
      while (++index2 < length) {
        character = value.charAt(index2);
        if (character === marker) {
          markerCount++;
          subvalue += queue + marker;
          queue = "";
        } else if (character === space) {
          queue += character;
        } else if (markerCount >= maxCount && (!character || character === lineFeed)) {
          subvalue += queue;
          if (silent) {
            return true;
          }
          return eat(subvalue)({ type: "thematicBreak" });
        } else {
          return;
        }
      }
    }
  }
});

// node_modules/remark-parse/lib/util/get-indentation.js
var require_get_indentation = __commonJS({
  "node_modules/remark-parse/lib/util/get-indentation.js"(exports, module) {
    "use strict";
    module.exports = indentation;
    var tab = "	";
    var space = " ";
    var spaceSize = 1;
    var tabSize = 4;
    function indentation(value) {
      var index2 = 0;
      var indent3 = 0;
      var character = value.charAt(index2);
      var stops = {};
      var size;
      var lastIndent = 0;
      while (character === tab || character === space) {
        size = character === tab ? tabSize : spaceSize;
        indent3 += size;
        if (size > 1) {
          indent3 = Math.floor(indent3 / size) * size;
        }
        while (lastIndent < indent3) {
          stops[++lastIndent] = index2;
        }
        character = value.charAt(++index2);
      }
      return { indent: indent3, stops };
    }
  }
});

// node_modules/remark-parse/lib/util/remove-indentation.js
var require_remove_indentation = __commonJS({
  "node_modules/remark-parse/lib/util/remove-indentation.js"(exports, module) {
    "use strict";
    var trim = require_trim();
    var repeat = require_repeat_string();
    var getIndent = require_get_indentation();
    module.exports = indentation;
    var lineFeed = "\n";
    var space = " ";
    var exclamationMark = "!";
    function indentation(value, maximum) {
      var values = value.split(lineFeed);
      var position2 = values.length + 1;
      var minIndent = Infinity;
      var matrix = [];
      var index2;
      var indentation2;
      var stops;
      values.unshift(repeat(space, maximum) + exclamationMark);
      while (position2--) {
        indentation2 = getIndent(values[position2]);
        matrix[position2] = indentation2.stops;
        if (trim(values[position2]).length === 0) {
          continue;
        }
        if (indentation2.indent) {
          if (indentation2.indent > 0 && indentation2.indent < minIndent) {
            minIndent = indentation2.indent;
          }
        } else {
          minIndent = Infinity;
          break;
        }
      }
      if (minIndent !== Infinity) {
        position2 = values.length;
        while (position2--) {
          stops = matrix[position2];
          index2 = minIndent;
          while (index2 && !(index2 in stops)) {
            index2--;
          }
          values[position2] = values[position2].slice(stops[index2] + 1);
        }
      }
      values.shift();
      return values.join(lineFeed);
    }
  }
});

// node_modules/remark-parse/lib/tokenize/list.js
var require_list = __commonJS({
  "node_modules/remark-parse/lib/tokenize/list.js"(exports, module) {
    "use strict";
    var trim = require_trim();
    var repeat = require_repeat_string();
    var decimal = require_is_decimal();
    var getIndent = require_get_indentation();
    var removeIndent = require_remove_indentation();
    var interrupt = require_interrupt();
    module.exports = list2;
    var asterisk = "*";
    var underscore = "_";
    var plusSign = "+";
    var dash = "-";
    var dot = ".";
    var space = " ";
    var lineFeed = "\n";
    var tab = "	";
    var rightParenthesis = ")";
    var lowercaseX = "x";
    var tabSize = 4;
    var looseListItemExpression = /\n\n(?!\s*$)/;
    var taskItemExpression = /^\[([ X\tx])][ \t]/;
    var bulletExpression = /^([ \t]*)([*+-]|\d+[.)])( {1,4}(?! )| |\t|$|(?=\n))([^\n]*)/;
    var pedanticBulletExpression = /^([ \t]*)([*+-]|\d+[.)])([ \t]+)/;
    var initialIndentExpression = /^( {1,4}|\t)?/gm;
    function list2(eat, value, silent) {
      var self = this;
      var commonmark = self.options.commonmark;
      var pedantic = self.options.pedantic;
      var tokenizers = self.blockTokenizers;
      var interuptors = self.interruptList;
      var index2 = 0;
      var length = value.length;
      var start = null;
      var size;
      var queue;
      var ordered;
      var character;
      var marker;
      var nextIndex;
      var startIndex;
      var prefixed;
      var currentMarker;
      var content3;
      var line2;
      var previousEmpty;
      var empty2;
      var items;
      var allLines;
      var emptyLines;
      var item;
      var enterTop;
      var exitBlockquote;
      var spread = false;
      var node2;
      var now;
      var end;
      var indented;
      while (index2 < length) {
        character = value.charAt(index2);
        if (character !== tab && character !== space) {
          break;
        }
        index2++;
      }
      character = value.charAt(index2);
      if (character === asterisk || character === plusSign || character === dash) {
        marker = character;
        ordered = false;
      } else {
        ordered = true;
        queue = "";
        while (index2 < length) {
          character = value.charAt(index2);
          if (!decimal(character)) {
            break;
          }
          queue += character;
          index2++;
        }
        character = value.charAt(index2);
        if (!queue || !(character === dot || commonmark && character === rightParenthesis)) {
          return;
        }
        if (silent && queue !== "1") {
          return;
        }
        start = parseInt(queue, 10);
        marker = character;
      }
      character = value.charAt(++index2);
      if (character !== space && character !== tab && (pedantic || character !== lineFeed && character !== "")) {
        return;
      }
      if (silent) {
        return true;
      }
      index2 = 0;
      items = [];
      allLines = [];
      emptyLines = [];
      while (index2 < length) {
        nextIndex = value.indexOf(lineFeed, index2);
        startIndex = index2;
        prefixed = false;
        indented = false;
        if (nextIndex === -1) {
          nextIndex = length;
        }
        size = 0;
        while (index2 < length) {
          character = value.charAt(index2);
          if (character === tab) {
            size += tabSize - size % tabSize;
          } else if (character === space) {
            size++;
          } else {
            break;
          }
          index2++;
        }
        if (item && size >= item.indent) {
          indented = true;
        }
        character = value.charAt(index2);
        currentMarker = null;
        if (!indented) {
          if (character === asterisk || character === plusSign || character === dash) {
            currentMarker = character;
            index2++;
            size++;
          } else {
            queue = "";
            while (index2 < length) {
              character = value.charAt(index2);
              if (!decimal(character)) {
                break;
              }
              queue += character;
              index2++;
            }
            character = value.charAt(index2);
            index2++;
            if (queue && (character === dot || commonmark && character === rightParenthesis)) {
              currentMarker = character;
              size += queue.length + 1;
            }
          }
          if (currentMarker) {
            character = value.charAt(index2);
            if (character === tab) {
              size += tabSize - size % tabSize;
              index2++;
            } else if (character === space) {
              end = index2 + tabSize;
              while (index2 < end) {
                if (value.charAt(index2) !== space) {
                  break;
                }
                index2++;
                size++;
              }
              if (index2 === end && value.charAt(index2) === space) {
                index2 -= tabSize - 1;
                size -= tabSize - 1;
              }
            } else if (character !== lineFeed && character !== "") {
              currentMarker = null;
            }
          }
        }
        if (currentMarker) {
          if (!pedantic && marker !== currentMarker) {
            break;
          }
          prefixed = true;
        } else {
          if (!commonmark && !indented && value.charAt(startIndex) === space) {
            indented = true;
          } else if (commonmark && item) {
            indented = size >= item.indent || size > tabSize;
          }
          prefixed = false;
          index2 = startIndex;
        }
        line2 = value.slice(startIndex, nextIndex);
        content3 = startIndex === index2 ? line2 : value.slice(index2, nextIndex);
        if (currentMarker === asterisk || currentMarker === underscore || currentMarker === dash) {
          if (tokenizers.thematicBreak.call(self, eat, line2, true)) {
            break;
          }
        }
        previousEmpty = empty2;
        empty2 = !prefixed && !trim(content3).length;
        if (indented && item) {
          item.value = item.value.concat(emptyLines, line2);
          allLines = allLines.concat(emptyLines, line2);
          emptyLines = [];
        } else if (prefixed) {
          if (emptyLines.length !== 0) {
            spread = true;
            item.value.push("");
            item.trail = emptyLines.concat();
          }
          item = {
            value: [line2],
            indent: size,
            trail: []
          };
          items.push(item);
          allLines = allLines.concat(emptyLines, line2);
          emptyLines = [];
        } else if (empty2) {
          if (previousEmpty && !commonmark) {
            break;
          }
          emptyLines.push(line2);
        } else {
          if (previousEmpty) {
            break;
          }
          if (interrupt(interuptors, tokenizers, self, [eat, line2, true])) {
            break;
          }
          item.value = item.value.concat(emptyLines, line2);
          allLines = allLines.concat(emptyLines, line2);
          emptyLines = [];
        }
        index2 = nextIndex + 1;
      }
      node2 = eat(allLines.join(lineFeed)).reset({
        type: "list",
        ordered,
        start,
        spread,
        children: []
      });
      enterTop = self.enterList();
      exitBlockquote = self.enterBlock();
      index2 = -1;
      length = items.length;
      while (++index2 < length) {
        item = items[index2].value.join(lineFeed);
        now = eat.now();
        eat(item)(listItem(self, item, now), node2);
        item = items[index2].trail.join(lineFeed);
        if (index2 !== length - 1) {
          item += lineFeed;
        }
        eat(item);
      }
      enterTop();
      exitBlockquote();
      return node2;
    }
    function listItem(ctx, value, position2) {
      var offsets = ctx.offset;
      var fn = ctx.options.pedantic ? pedanticListItem : normalListItem;
      var checked = null;
      var task;
      var indent3;
      value = fn.apply(null, arguments);
      if (ctx.options.gfm) {
        task = value.match(taskItemExpression);
        if (task) {
          indent3 = task[0].length;
          checked = task[1].toLowerCase() === lowercaseX;
          offsets[position2.line] += indent3;
          value = value.slice(indent3);
        }
      }
      return {
        type: "listItem",
        spread: looseListItemExpression.test(value),
        checked,
        children: ctx.tokenizeBlock(value, position2)
      };
    }
    function pedanticListItem(ctx, value, position2) {
      var offsets = ctx.offset;
      var line2 = position2.line;
      value = value.replace(pedanticBulletExpression, replacer);
      line2 = position2.line;
      return value.replace(initialIndentExpression, replacer);
      function replacer($0) {
        offsets[line2] = (offsets[line2] || 0) + $0.length;
        line2++;
        return "";
      }
    }
    function normalListItem(ctx, value, position2) {
      var offsets = ctx.offset;
      var line2 = position2.line;
      var max;
      var bullet;
      var rest;
      var lines;
      var trimmedLines;
      var index2;
      var length;
      value = value.replace(bulletExpression, replacer);
      lines = value.split(lineFeed);
      trimmedLines = removeIndent(value, getIndent(max).indent).split(lineFeed);
      trimmedLines[0] = rest;
      offsets[line2] = (offsets[line2] || 0) + bullet.length;
      line2++;
      index2 = 0;
      length = lines.length;
      while (++index2 < length) {
        offsets[line2] = (offsets[line2] || 0) + lines[index2].length - trimmedLines[index2].length;
        line2++;
      }
      return trimmedLines.join(lineFeed);
      function replacer($0, $1, $2, $3, $4) {
        bullet = $1 + $2 + $3;
        rest = $4;
        if (Number($2) < 10 && bullet.length % 2 === 1) {
          $2 = space + $2;
        }
        max = $1 + repeat(space, $2.length) + $3;
        return max + rest;
      }
    }
  }
});

// node_modules/remark-parse/lib/tokenize/heading-setext.js
var require_heading_setext = __commonJS({
  "node_modules/remark-parse/lib/tokenize/heading-setext.js"(exports, module) {
    "use strict";
    module.exports = setextHeading;
    var lineFeed = "\n";
    var tab = "	";
    var space = " ";
    var equalsTo = "=";
    var dash = "-";
    var maxIndent = 3;
    var equalsToDepth = 1;
    var dashDepth = 2;
    function setextHeading(eat, value, silent) {
      var self = this;
      var now = eat.now();
      var length = value.length;
      var index2 = -1;
      var subvalue = "";
      var content3;
      var queue;
      var character;
      var marker;
      var depth;
      while (++index2 < length) {
        character = value.charAt(index2);
        if (character !== space || index2 >= maxIndent) {
          index2--;
          break;
        }
        subvalue += character;
      }
      content3 = "";
      queue = "";
      while (++index2 < length) {
        character = value.charAt(index2);
        if (character === lineFeed) {
          index2--;
          break;
        }
        if (character === space || character === tab) {
          queue += character;
        } else {
          content3 += queue + character;
          queue = "";
        }
      }
      now.column += subvalue.length;
      now.offset += subvalue.length;
      subvalue += content3 + queue;
      character = value.charAt(++index2);
      marker = value.charAt(++index2);
      if (character !== lineFeed || marker !== equalsTo && marker !== dash) {
        return;
      }
      subvalue += character;
      queue = marker;
      depth = marker === equalsTo ? equalsToDepth : dashDepth;
      while (++index2 < length) {
        character = value.charAt(index2);
        if (character !== marker) {
          if (character !== lineFeed) {
            return;
          }
          index2--;
          break;
        }
        queue += character;
      }
      if (silent) {
        return true;
      }
      return eat(subvalue + queue)({
        type: "heading",
        depth,
        children: self.tokenizeInline(content3, now)
      });
    }
  }
});

// node_modules/remark-parse/lib/util/html.js
var require_html = __commonJS({
  "node_modules/remark-parse/lib/util/html.js"(exports) {
    "use strict";
    var attributeName = "[a-zA-Z_:][a-zA-Z0-9:._-]*";
    var unquoted = "[^\"'=<>`\\u0000-\\u0020]+";
    var singleQuoted = "'[^']*'";
    var doubleQuoted = '"[^"]*"';
    var attributeValue = "(?:" + unquoted + "|" + singleQuoted + "|" + doubleQuoted + ")";
    var attribute = "(?:\\s+" + attributeName + "(?:\\s*=\\s*" + attributeValue + ")?)";
    var openTag = "<[A-Za-z][A-Za-z0-9\\-]*" + attribute + "*\\s*\\/?>";
    var closeTag = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>";
    var comment = "<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->";
    var processing = "<[?].*?[?]>";
    var declaration = "<![A-Za-z]+\\s+[^>]*>";
    var cdata = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>";
    exports.openCloseTag = new RegExp("^(?:" + openTag + "|" + closeTag + ")");
    exports.tag = new RegExp(
      "^(?:" + openTag + "|" + closeTag + "|" + comment + "|" + processing + "|" + declaration + "|" + cdata + ")"
    );
  }
});

// node_modules/remark-parse/lib/tokenize/html-block.js
var require_html_block = __commonJS({
  "node_modules/remark-parse/lib/tokenize/html-block.js"(exports, module) {
    "use strict";
    var openCloseTag = require_html().openCloseTag;
    module.exports = blockHtml;
    var tab = "	";
    var space = " ";
    var lineFeed = "\n";
    var lessThan = "<";
    var rawOpenExpression = /^<(script|pre|style)(?=(\s|>|$))/i;
    var rawCloseExpression = /<\/(script|pre|style)>/i;
    var commentOpenExpression = /^<!--/;
    var commentCloseExpression = /-->/;
    var instructionOpenExpression = /^<\?/;
    var instructionCloseExpression = /\?>/;
    var directiveOpenExpression = /^<![A-Za-z]/;
    var directiveCloseExpression = />/;
    var cdataOpenExpression = /^<!\[CDATA\[/;
    var cdataCloseExpression = /]]>/;
    var elementCloseExpression = /^$/;
    var otherElementOpenExpression = new RegExp(openCloseTag.source + "\\s*$");
    function blockHtml(eat, value, silent) {
      var self = this;
      var blocks = self.options.blocks.join("|");
      var elementOpenExpression = new RegExp(
        "^</?(" + blocks + ")(?=(\\s|/?>|$))",
        "i"
      );
      var length = value.length;
      var index2 = 0;
      var next;
      var line2;
      var offset;
      var character;
      var count;
      var sequence;
      var subvalue;
      var sequences = [
        [rawOpenExpression, rawCloseExpression, true],
        [commentOpenExpression, commentCloseExpression, true],
        [instructionOpenExpression, instructionCloseExpression, true],
        [directiveOpenExpression, directiveCloseExpression, true],
        [cdataOpenExpression, cdataCloseExpression, true],
        [elementOpenExpression, elementCloseExpression, true],
        [otherElementOpenExpression, elementCloseExpression, false]
      ];
      while (index2 < length) {
        character = value.charAt(index2);
        if (character !== tab && character !== space) {
          break;
        }
        index2++;
      }
      if (value.charAt(index2) !== lessThan) {
        return;
      }
      next = value.indexOf(lineFeed, index2 + 1);
      next = next === -1 ? length : next;
      line2 = value.slice(index2, next);
      offset = -1;
      count = sequences.length;
      while (++offset < count) {
        if (sequences[offset][0].test(line2)) {
          sequence = sequences[offset];
          break;
        }
      }
      if (!sequence) {
        return;
      }
      if (silent) {
        return sequence[2];
      }
      index2 = next;
      if (!sequence[1].test(line2)) {
        while (index2 < length) {
          next = value.indexOf(lineFeed, index2 + 1);
          next = next === -1 ? length : next;
          line2 = value.slice(index2 + 1, next);
          if (sequence[1].test(line2)) {
            if (line2) {
              index2 = next;
            }
            break;
          }
          index2 = next;
        }
      }
      subvalue = value.slice(0, index2);
      return eat(subvalue)({ type: "html", value: subvalue });
    }
  }
});

// node_modules/is-whitespace-character/index.js
var require_is_whitespace_character = __commonJS({
  "node_modules/is-whitespace-character/index.js"(exports, module) {
    "use strict";
    module.exports = whitespace;
    var fromCode = String.fromCharCode;
    var re = /\s/;
    function whitespace(character) {
      return re.test(
        typeof character === "number" ? fromCode(character) : character.charAt(0)
      );
    }
  }
});

// node_modules/collapse-white-space/index.js
var require_collapse_white_space = __commonJS({
  "node_modules/collapse-white-space/index.js"(exports, module) {
    "use strict";
    module.exports = collapse;
    function collapse(value) {
      return String(value).replace(/\s+/g, " ");
    }
  }
});

// node_modules/remark-parse/lib/util/normalize.js
var require_normalize = __commonJS({
  "node_modules/remark-parse/lib/util/normalize.js"(exports, module) {
    "use strict";
    var collapseWhiteSpace3 = require_collapse_white_space();
    module.exports = normalize;
    function normalize(value) {
      return collapseWhiteSpace3(value).toLowerCase();
    }
  }
});

// node_modules/remark-parse/lib/tokenize/definition.js
var require_definition = __commonJS({
  "node_modules/remark-parse/lib/tokenize/definition.js"(exports, module) {
    "use strict";
    var whitespace = require_is_whitespace_character();
    var normalize = require_normalize();
    module.exports = definition2;
    var quotationMark = '"';
    var apostrophe = "'";
    var backslash = "\\";
    var lineFeed = "\n";
    var tab = "	";
    var space = " ";
    var leftSquareBracket = "[";
    var rightSquareBracket = "]";
    var leftParenthesis = "(";
    var rightParenthesis = ")";
    var colon = ":";
    var lessThan = "<";
    var greaterThan = ">";
    function definition2(eat, value, silent) {
      var self = this;
      var commonmark = self.options.commonmark;
      var index2 = 0;
      var length = value.length;
      var subvalue = "";
      var beforeURL;
      var beforeTitle;
      var queue;
      var character;
      var test;
      var identifier;
      var url;
      var title;
      while (index2 < length) {
        character = value.charAt(index2);
        if (character !== space && character !== tab) {
          break;
        }
        subvalue += character;
        index2++;
      }
      character = value.charAt(index2);
      if (character !== leftSquareBracket) {
        return;
      }
      index2++;
      subvalue += character;
      queue = "";
      while (index2 < length) {
        character = value.charAt(index2);
        if (character === rightSquareBracket) {
          break;
        } else if (character === backslash) {
          queue += character;
          index2++;
          character = value.charAt(index2);
        }
        queue += character;
        index2++;
      }
      if (!queue || value.charAt(index2) !== rightSquareBracket || value.charAt(index2 + 1) !== colon) {
        return;
      }
      identifier = queue;
      subvalue += queue + rightSquareBracket + colon;
      index2 = subvalue.length;
      queue = "";
      while (index2 < length) {
        character = value.charAt(index2);
        if (character !== tab && character !== space && character !== lineFeed) {
          break;
        }
        subvalue += character;
        index2++;
      }
      character = value.charAt(index2);
      queue = "";
      beforeURL = subvalue;
      if (character === lessThan) {
        index2++;
        while (index2 < length) {
          character = value.charAt(index2);
          if (!isEnclosedURLCharacter(character)) {
            break;
          }
          queue += character;
          index2++;
        }
        character = value.charAt(index2);
        if (character === isEnclosedURLCharacter.delimiter) {
          subvalue += lessThan + queue + character;
          index2++;
        } else {
          if (commonmark) {
            return;
          }
          index2 -= queue.length + 1;
          queue = "";
        }
      }
      if (!queue) {
        while (index2 < length) {
          character = value.charAt(index2);
          if (!isUnclosedURLCharacter(character)) {
            break;
          }
          queue += character;
          index2++;
        }
        subvalue += queue;
      }
      if (!queue) {
        return;
      }
      url = queue;
      queue = "";
      while (index2 < length) {
        character = value.charAt(index2);
        if (character !== tab && character !== space && character !== lineFeed) {
          break;
        }
        queue += character;
        index2++;
      }
      character = value.charAt(index2);
      test = null;
      if (character === quotationMark) {
        test = quotationMark;
      } else if (character === apostrophe) {
        test = apostrophe;
      } else if (character === leftParenthesis) {
        test = rightParenthesis;
      }
      if (!test) {
        queue = "";
        index2 = subvalue.length;
      } else if (queue) {
        subvalue += queue + character;
        index2 = subvalue.length;
        queue = "";
        while (index2 < length) {
          character = value.charAt(index2);
          if (character === test) {
            break;
          }
          if (character === lineFeed) {
            index2++;
            character = value.charAt(index2);
            if (character === lineFeed || character === test) {
              return;
            }
            queue += lineFeed;
          }
          queue += character;
          index2++;
        }
        character = value.charAt(index2);
        if (character !== test) {
          return;
        }
        beforeTitle = subvalue;
        subvalue += queue + character;
        index2++;
        title = queue;
        queue = "";
      } else {
        return;
      }
      while (index2 < length) {
        character = value.charAt(index2);
        if (character !== tab && character !== space) {
          break;
        }
        subvalue += character;
        index2++;
      }
      character = value.charAt(index2);
      if (!character || character === lineFeed) {
        if (silent) {
          return true;
        }
        beforeURL = eat(beforeURL).test().end;
        url = self.decode.raw(self.unescape(url), beforeURL, { nonTerminated: false });
        if (title) {
          beforeTitle = eat(beforeTitle).test().end;
          title = self.decode.raw(self.unescape(title), beforeTitle);
        }
        return eat(subvalue)({
          type: "definition",
          identifier: normalize(identifier),
          label: identifier,
          title: title || null,
          url
        });
      }
    }
    function isEnclosedURLCharacter(character) {
      return character !== greaterThan && character !== leftSquareBracket && character !== rightSquareBracket;
    }
    isEnclosedURLCharacter.delimiter = greaterThan;
    function isUnclosedURLCharacter(character) {
      return character !== leftSquareBracket && character !== rightSquareBracket && !whitespace(character);
    }
  }
});

// node_modules/remark-parse/lib/tokenize/table.js
var require_table = __commonJS({
  "node_modules/remark-parse/lib/tokenize/table.js"(exports, module) {
    "use strict";
    var whitespace = require_is_whitespace_character();
    module.exports = table;
    var tab = "	";
    var lineFeed = "\n";
    var space = " ";
    var dash = "-";
    var colon = ":";
    var backslash = "\\";
    var verticalBar = "|";
    var minColumns = 1;
    var minRows = 2;
    var left = "left";
    var center = "center";
    var right = "right";
    function table(eat, value, silent) {
      var self = this;
      var index2;
      var alignments;
      var alignment;
      var subvalue;
      var row;
      var length;
      var lines;
      var queue;
      var character;
      var hasDash;
      var align2;
      var cell;
      var preamble;
      var now;
      var position2;
      var lineCount;
      var line2;
      var rows;
      var table2;
      var lineIndex;
      var pipeIndex;
      var first;
      if (!self.options.gfm) {
        return;
      }
      index2 = 0;
      lineCount = 0;
      length = value.length + 1;
      lines = [];
      while (index2 < length) {
        lineIndex = value.indexOf(lineFeed, index2);
        pipeIndex = value.indexOf(verticalBar, index2 + 1);
        if (lineIndex === -1) {
          lineIndex = value.length;
        }
        if (pipeIndex === -1 || pipeIndex > lineIndex) {
          if (lineCount < minRows) {
            return;
          }
          break;
        }
        lines.push(value.slice(index2, lineIndex));
        lineCount++;
        index2 = lineIndex + 1;
      }
      subvalue = lines.join(lineFeed);
      alignments = lines.splice(1, 1)[0] || [];
      index2 = 0;
      length = alignments.length;
      lineCount--;
      alignment = false;
      align2 = [];
      while (index2 < length) {
        character = alignments.charAt(index2);
        if (character === verticalBar) {
          hasDash = null;
          if (alignment === false) {
            if (first === false) {
              return;
            }
          } else {
            align2.push(alignment);
            alignment = false;
          }
          first = false;
        } else if (character === dash) {
          hasDash = true;
          alignment = alignment || null;
        } else if (character === colon) {
          if (alignment === left) {
            alignment = center;
          } else if (hasDash && alignment === null) {
            alignment = right;
          } else {
            alignment = left;
          }
        } else if (!whitespace(character)) {
          return;
        }
        index2++;
      }
      if (alignment !== false) {
        align2.push(alignment);
      }
      if (align2.length < minColumns) {
        return;
      }
      if (silent) {
        return true;
      }
      position2 = -1;
      rows = [];
      table2 = eat(subvalue).reset({ type: "table", align: align2, children: rows });
      while (++position2 < lineCount) {
        line2 = lines[position2];
        row = { type: "tableRow", children: [] };
        if (position2) {
          eat(lineFeed);
        }
        eat(line2).reset(row, table2);
        length = line2.length + 1;
        index2 = 0;
        queue = "";
        cell = "";
        preamble = true;
        while (index2 < length) {
          character = line2.charAt(index2);
          if (character === tab || character === space) {
            if (cell) {
              queue += character;
            } else {
              eat(character);
            }
            index2++;
            continue;
          }
          if (character === "" || character === verticalBar) {
            if (preamble) {
              eat(character);
            } else {
              if ((cell || character) && !preamble) {
                subvalue = cell;
                if (queue.length > 1) {
                  if (character) {
                    subvalue += queue.slice(0, -1);
                    queue = queue.charAt(queue.length - 1);
                  } else {
                    subvalue += queue;
                    queue = "";
                  }
                }
                now = eat.now();
                eat(subvalue)(
                  { type: "tableCell", children: self.tokenizeInline(cell, now) },
                  row
                );
              }
              eat(queue + character);
              queue = "";
              cell = "";
            }
          } else {
            if (queue) {
              cell += queue;
              queue = "";
            }
            cell += character;
            if (character === backslash && index2 !== length - 2) {
              cell += line2.charAt(index2 + 1);
              index2++;
            }
          }
          preamble = false;
          index2++;
        }
        if (!position2) {
          eat(lineFeed + alignments);
        }
      }
      return table2;
    }
  }
});

// node_modules/remark-parse/lib/tokenize/paragraph.js
var require_paragraph = __commonJS({
  "node_modules/remark-parse/lib/tokenize/paragraph.js"(exports, module) {
    "use strict";
    var trim = require_trim();
    var trimTrailingLines = require_trim_trailing_lines();
    var interrupt = require_interrupt();
    module.exports = paragraph;
    var tab = "	";
    var lineFeed = "\n";
    var space = " ";
    var tabSize = 4;
    function paragraph(eat, value, silent) {
      var self = this;
      var settings = self.options;
      var commonmark = settings.commonmark;
      var tokenizers = self.blockTokenizers;
      var interruptors = self.interruptParagraph;
      var index2 = value.indexOf(lineFeed);
      var length = value.length;
      var position2;
      var subvalue;
      var character;
      var size;
      var now;
      while (index2 < length) {
        if (index2 === -1) {
          index2 = length;
          break;
        }
        if (value.charAt(index2 + 1) === lineFeed) {
          break;
        }
        if (commonmark) {
          size = 0;
          position2 = index2 + 1;
          while (position2 < length) {
            character = value.charAt(position2);
            if (character === tab) {
              size = tabSize;
              break;
            } else if (character === space) {
              size++;
            } else {
              break;
            }
            position2++;
          }
          if (size >= tabSize && character !== lineFeed) {
            index2 = value.indexOf(lineFeed, index2 + 1);
            continue;
          }
        }
        subvalue = value.slice(index2 + 1);
        if (interrupt(interruptors, tokenizers, self, [eat, subvalue, true])) {
          break;
        }
        position2 = index2;
        index2 = value.indexOf(lineFeed, index2 + 1);
        if (index2 !== -1 && trim(value.slice(position2, index2)) === "") {
          index2 = position2;
          break;
        }
      }
      subvalue = value.slice(0, index2);
      if (silent) {
        return true;
      }
      now = eat.now();
      subvalue = trimTrailingLines(subvalue);
      return eat(subvalue)({
        type: "paragraph",
        children: self.tokenizeInline(subvalue, now)
      });
    }
  }
});

// node_modules/remark-parse/lib/locate/escape.js
var require_escape = __commonJS({
  "node_modules/remark-parse/lib/locate/escape.js"(exports, module) {
    "use strict";
    module.exports = locate;
    function locate(value, fromIndex) {
      return value.indexOf("\\", fromIndex);
    }
  }
});

// node_modules/remark-parse/lib/tokenize/escape.js
var require_escape2 = __commonJS({
  "node_modules/remark-parse/lib/tokenize/escape.js"(exports, module) {
    "use strict";
    var locate = require_escape();
    module.exports = escape;
    escape.locator = locate;
    var lineFeed = "\n";
    var backslash = "\\";
    function escape(eat, value, silent) {
      var self = this;
      var character;
      var node2;
      if (value.charAt(0) === backslash) {
        character = value.charAt(1);
        if (self.escape.indexOf(character) !== -1) {
          if (silent) {
            return true;
          }
          if (character === lineFeed) {
            node2 = { type: "break" };
          } else {
            node2 = { type: "text", value: character };
          }
          return eat(backslash + character)(node2);
        }
      }
    }
  }
});

// node_modules/remark-parse/lib/locate/tag.js
var require_tag = __commonJS({
  "node_modules/remark-parse/lib/locate/tag.js"(exports, module) {
    "use strict";
    module.exports = locate;
    function locate(value, fromIndex) {
      return value.indexOf("<", fromIndex);
    }
  }
});

// node_modules/remark-parse/lib/tokenize/auto-link.js
var require_auto_link = __commonJS({
  "node_modules/remark-parse/lib/tokenize/auto-link.js"(exports, module) {
    "use strict";
    var whitespace = require_is_whitespace_character();
    var decode2 = require_parse_entities();
    var locate = require_tag();
    module.exports = autoLink;
    autoLink.locator = locate;
    autoLink.notInLink = true;
    var lessThan = "<";
    var greaterThan = ">";
    var atSign = "@";
    var slash = "/";
    var mailto = "mailto:";
    var mailtoLength = mailto.length;
    function autoLink(eat, value, silent) {
      var self = this;
      var subvalue = "";
      var length = value.length;
      var index2 = 0;
      var queue = "";
      var hasAtCharacter = false;
      var link = "";
      var character;
      var now;
      var content3;
      var tokenizers;
      var exit3;
      if (value.charAt(0) !== lessThan) {
        return;
      }
      index2++;
      subvalue = lessThan;
      while (index2 < length) {
        character = value.charAt(index2);
        if (whitespace(character) || character === greaterThan || character === atSign || character === ":" && value.charAt(index2 + 1) === slash) {
          break;
        }
        queue += character;
        index2++;
      }
      if (!queue) {
        return;
      }
      link += queue;
      queue = "";
      character = value.charAt(index2);
      link += character;
      index2++;
      if (character === atSign) {
        hasAtCharacter = true;
      } else {
        if (character !== ":" || value.charAt(index2 + 1) !== slash) {
          return;
        }
        link += slash;
        index2++;
      }
      while (index2 < length) {
        character = value.charAt(index2);
        if (whitespace(character) || character === greaterThan) {
          break;
        }
        queue += character;
        index2++;
      }
      character = value.charAt(index2);
      if (!queue || character !== greaterThan) {
        return;
      }
      if (silent) {
        return true;
      }
      link += queue;
      content3 = link;
      subvalue += link + character;
      now = eat.now();
      now.column++;
      now.offset++;
      if (hasAtCharacter) {
        if (link.slice(0, mailtoLength).toLowerCase() === mailto) {
          content3 = content3.slice(mailtoLength);
          now.column += mailtoLength;
          now.offset += mailtoLength;
        } else {
          link = mailto + link;
        }
      }
      tokenizers = self.inlineTokenizers;
      self.inlineTokenizers = { text: tokenizers.text };
      exit3 = self.enterLink();
      content3 = self.tokenizeInline(content3, now);
      self.inlineTokenizers = tokenizers;
      exit3();
      return eat(subvalue)({
        type: "link",
        title: null,
        url: decode2(link, { nonTerminated: false }),
        children: content3
      });
    }
  }
});

// node_modules/remark-parse/node_modules/ccount/index.js
var require_ccount = __commonJS({
  "node_modules/remark-parse/node_modules/ccount/index.js"(exports, module) {
    "use strict";
    module.exports = ccount2;
    function ccount2(source, character) {
      var value = String(source);
      var count = 0;
      var index2;
      if (typeof character !== "string") {
        throw new Error("Expected character");
      }
      index2 = value.indexOf(character);
      while (index2 !== -1) {
        count++;
        index2 = value.indexOf(character, index2 + character.length);
      }
      return count;
    }
  }
});

// node_modules/remark-parse/lib/locate/url.js
var require_url = __commonJS({
  "node_modules/remark-parse/lib/locate/url.js"(exports, module) {
    "use strict";
    module.exports = locate;
    var values = ["www.", "http://", "https://"];
    function locate(value, fromIndex) {
      var min = -1;
      var index2;
      var length;
      var position2;
      if (!this.options.gfm) {
        return min;
      }
      length = values.length;
      index2 = -1;
      while (++index2 < length) {
        position2 = value.indexOf(values[index2], fromIndex);
        if (position2 !== -1 && (min === -1 || position2 < min)) {
          min = position2;
        }
      }
      return min;
    }
  }
});

// node_modules/remark-parse/lib/tokenize/url.js
var require_url2 = __commonJS({
  "node_modules/remark-parse/lib/tokenize/url.js"(exports, module) {
    "use strict";
    var ccount2 = require_ccount();
    var decode2 = require_parse_entities();
    var decimal = require_is_decimal();
    var alphabetical = require_is_alphabetical();
    var whitespace = require_is_whitespace_character();
    var locate = require_url();
    module.exports = url;
    url.locator = locate;
    url.notInLink = true;
    var exclamationMark = 33;
    var ampersand = 38;
    var rightParenthesis = 41;
    var asterisk = 42;
    var comma = 44;
    var dash = 45;
    var dot = 46;
    var colon = 58;
    var semicolon = 59;
    var questionMark = 63;
    var lessThan = 60;
    var underscore = 95;
    var tilde = 126;
    var leftParenthesisCharacter = "(";
    var rightParenthesisCharacter = ")";
    function url(eat, value, silent) {
      var self = this;
      var gfm2 = self.options.gfm;
      var tokenizers = self.inlineTokenizers;
      var length = value.length;
      var previousDot = -1;
      var protocolless = false;
      var dots;
      var lastTwoPartsStart;
      var start;
      var index2;
      var pathStart;
      var path2;
      var code2;
      var end;
      var leftCount;
      var rightCount;
      var content3;
      var children;
      var url2;
      var exit3;
      if (!gfm2) {
        return;
      }
      if (value.slice(0, 4) === "www.") {
        protocolless = true;
        index2 = 4;
      } else if (value.slice(0, 7).toLowerCase() === "http://") {
        index2 = 7;
      } else if (value.slice(0, 8).toLowerCase() === "https://") {
        index2 = 8;
      } else {
        return;
      }
      previousDot = index2 - 1;
      start = index2;
      dots = [];
      while (index2 < length) {
        code2 = value.charCodeAt(index2);
        if (code2 === dot) {
          if (previousDot === index2 - 1) {
            break;
          }
          dots.push(index2);
          previousDot = index2;
          index2++;
          continue;
        }
        if (decimal(code2) || alphabetical(code2) || code2 === dash || code2 === underscore) {
          index2++;
          continue;
        }
        break;
      }
      if (code2 === dot) {
        dots.pop();
        index2--;
      }
      if (dots[0] === void 0) {
        return;
      }
      lastTwoPartsStart = dots.length < 2 ? start : dots[dots.length - 2] + 1;
      if (value.slice(lastTwoPartsStart, index2).indexOf("_") !== -1) {
        return;
      }
      if (silent) {
        return true;
      }
      end = index2;
      pathStart = index2;
      while (index2 < length) {
        code2 = value.charCodeAt(index2);
        if (whitespace(code2) || code2 === lessThan) {
          break;
        }
        index2++;
        if (code2 === exclamationMark || code2 === asterisk || code2 === comma || code2 === dot || code2 === colon || code2 === questionMark || code2 === underscore || code2 === tilde) {
        } else {
          end = index2;
        }
      }
      index2 = end;
      if (value.charCodeAt(index2 - 1) === rightParenthesis) {
        path2 = value.slice(pathStart, index2);
        leftCount = ccount2(path2, leftParenthesisCharacter);
        rightCount = ccount2(path2, rightParenthesisCharacter);
        while (rightCount > leftCount) {
          index2 = pathStart + path2.lastIndexOf(rightParenthesisCharacter);
          path2 = value.slice(pathStart, index2);
          rightCount--;
        }
      }
      if (value.charCodeAt(index2 - 1) === semicolon) {
        index2--;
        if (alphabetical(value.charCodeAt(index2 - 1))) {
          end = index2 - 2;
          while (alphabetical(value.charCodeAt(end))) {
            end--;
          }
          if (value.charCodeAt(end) === ampersand) {
            index2 = end;
          }
        }
      }
      content3 = value.slice(0, index2);
      url2 = decode2(content3, { nonTerminated: false });
      if (protocolless) {
        url2 = "http://" + url2;
      }
      exit3 = self.enterLink();
      self.inlineTokenizers = { text: tokenizers.text };
      children = self.tokenizeInline(content3, eat.now());
      self.inlineTokenizers = tokenizers;
      exit3();
      return eat(content3)({ type: "link", title: null, url: url2, children });
    }
  }
});

// node_modules/remark-parse/lib/locate/email.js
var require_email = __commonJS({
  "node_modules/remark-parse/lib/locate/email.js"(exports, module) {
    "use strict";
    var decimal = require_is_decimal();
    var alphabetical = require_is_alphabetical();
    var plusSign = 43;
    var dash = 45;
    var dot = 46;
    var underscore = 95;
    module.exports = locate;
    function locate(value, fromIndex) {
      var self = this;
      var at2;
      var position2;
      if (!this.options.gfm) {
        return -1;
      }
      at2 = value.indexOf("@", fromIndex);
      if (at2 === -1) {
        return -1;
      }
      position2 = at2;
      if (position2 === fromIndex || !isGfmAtext(value.charCodeAt(position2 - 1))) {
        return locate.call(self, value, at2 + 1);
      }
      while (position2 > fromIndex && isGfmAtext(value.charCodeAt(position2 - 1))) {
        position2--;
      }
      return position2;
    }
    function isGfmAtext(code2) {
      return decimal(code2) || alphabetical(code2) || code2 === plusSign || code2 === dash || code2 === dot || code2 === underscore;
    }
  }
});

// node_modules/remark-parse/lib/tokenize/email.js
var require_email2 = __commonJS({
  "node_modules/remark-parse/lib/tokenize/email.js"(exports, module) {
    "use strict";
    var decode2 = require_parse_entities();
    var decimal = require_is_decimal();
    var alphabetical = require_is_alphabetical();
    var locate = require_email();
    module.exports = email;
    email.locator = locate;
    email.notInLink = true;
    var plusSign = 43;
    var dash = 45;
    var dot = 46;
    var atSign = 64;
    var underscore = 95;
    function email(eat, value, silent) {
      var self = this;
      var gfm2 = self.options.gfm;
      var tokenizers = self.inlineTokenizers;
      var index2 = 0;
      var length = value.length;
      var firstDot = -1;
      var code2;
      var content3;
      var children;
      var exit3;
      if (!gfm2) {
        return;
      }
      code2 = value.charCodeAt(index2);
      while (decimal(code2) || alphabetical(code2) || code2 === plusSign || code2 === dash || code2 === dot || code2 === underscore) {
        code2 = value.charCodeAt(++index2);
      }
      if (index2 === 0) {
        return;
      }
      if (code2 !== atSign) {
        return;
      }
      index2++;
      while (index2 < length) {
        code2 = value.charCodeAt(index2);
        if (decimal(code2) || alphabetical(code2) || code2 === dash || code2 === dot || code2 === underscore) {
          index2++;
          if (firstDot === -1 && code2 === dot) {
            firstDot = index2;
          }
          continue;
        }
        break;
      }
      if (firstDot === -1 || firstDot === index2 || code2 === dash || code2 === underscore) {
        return;
      }
      if (code2 === dot) {
        index2--;
      }
      content3 = value.slice(0, index2);
      if (silent) {
        return true;
      }
      exit3 = self.enterLink();
      self.inlineTokenizers = { text: tokenizers.text };
      children = self.tokenizeInline(content3, eat.now());
      self.inlineTokenizers = tokenizers;
      exit3();
      return eat(content3)({
        type: "link",
        title: null,
        url: "mailto:" + decode2(content3, { nonTerminated: false }),
        children
      });
    }
  }
});

// node_modules/remark-parse/lib/tokenize/html-inline.js
var require_html_inline = __commonJS({
  "node_modules/remark-parse/lib/tokenize/html-inline.js"(exports, module) {
    "use strict";
    var alphabetical = require_is_alphabetical();
    var locate = require_tag();
    var tag = require_html().tag;
    module.exports = inlineHTML;
    inlineHTML.locator = locate;
    var lessThan = "<";
    var questionMark = "?";
    var exclamationMark = "!";
    var slash = "/";
    var htmlLinkOpenExpression = /^<a /i;
    var htmlLinkCloseExpression = /^<\/a>/i;
    function inlineHTML(eat, value, silent) {
      var self = this;
      var length = value.length;
      var character;
      var subvalue;
      if (value.charAt(0) !== lessThan || length < 3) {
        return;
      }
      character = value.charAt(1);
      if (!alphabetical(character) && character !== questionMark && character !== exclamationMark && character !== slash) {
        return;
      }
      subvalue = value.match(tag);
      if (!subvalue) {
        return;
      }
      if (silent) {
        return true;
      }
      subvalue = subvalue[0];
      if (!self.inLink && htmlLinkOpenExpression.test(subvalue)) {
        self.inLink = true;
      } else if (self.inLink && htmlLinkCloseExpression.test(subvalue)) {
        self.inLink = false;
      }
      return eat(subvalue)({ type: "html", value: subvalue });
    }
  }
});

// node_modules/remark-parse/lib/locate/link.js
var require_link = __commonJS({
  "node_modules/remark-parse/lib/locate/link.js"(exports, module) {
    "use strict";
    module.exports = locate;
    function locate(value, fromIndex) {
      var link = value.indexOf("[", fromIndex);
      var image = value.indexOf("![", fromIndex);
      if (image === -1) {
        return link;
      }
      return link < image ? link : image;
    }
  }
});

// node_modules/remark-parse/lib/tokenize/link.js
var require_link2 = __commonJS({
  "node_modules/remark-parse/lib/tokenize/link.js"(exports, module) {
    "use strict";
    var whitespace = require_is_whitespace_character();
    var locate = require_link();
    module.exports = link;
    link.locator = locate;
    var lineFeed = "\n";
    var exclamationMark = "!";
    var quotationMark = '"';
    var apostrophe = "'";
    var leftParenthesis = "(";
    var rightParenthesis = ")";
    var lessThan = "<";
    var greaterThan = ">";
    var leftSquareBracket = "[";
    var backslash = "\\";
    var rightSquareBracket = "]";
    var graveAccent = "`";
    function link(eat, value, silent) {
      var self = this;
      var subvalue = "";
      var index2 = 0;
      var character = value.charAt(0);
      var pedantic = self.options.pedantic;
      var commonmark = self.options.commonmark;
      var gfm2 = self.options.gfm;
      var closed;
      var count;
      var opening;
      var beforeURL;
      var beforeTitle;
      var subqueue;
      var hasMarker;
      var isImage;
      var content3;
      var marker;
      var length;
      var title;
      var depth;
      var queue;
      var url;
      var now;
      var exit3;
      var node2;
      if (character === exclamationMark) {
        isImage = true;
        subvalue = character;
        character = value.charAt(++index2);
      }
      if (character !== leftSquareBracket) {
        return;
      }
      if (!isImage && self.inLink) {
        return;
      }
      subvalue += character;
      queue = "";
      index2++;
      length = value.length;
      now = eat.now();
      depth = 0;
      now.column += index2;
      now.offset += index2;
      while (index2 < length) {
        character = value.charAt(index2);
        subqueue = character;
        if (character === graveAccent) {
          count = 1;
          while (value.charAt(index2 + 1) === graveAccent) {
            subqueue += character;
            index2++;
            count++;
          }
          if (!opening) {
            opening = count;
          } else if (count >= opening) {
            opening = 0;
          }
        } else if (character === backslash) {
          index2++;
          subqueue += value.charAt(index2);
        } else if ((!opening || gfm2) && character === leftSquareBracket) {
          depth++;
        } else if ((!opening || gfm2) && character === rightSquareBracket) {
          if (depth) {
            depth--;
          } else {
            if (value.charAt(index2 + 1) !== leftParenthesis) {
              return;
            }
            subqueue += leftParenthesis;
            closed = true;
            index2++;
            break;
          }
        }
        queue += subqueue;
        subqueue = "";
        index2++;
      }
      if (!closed) {
        return;
      }
      content3 = queue;
      subvalue += queue + subqueue;
      index2++;
      while (index2 < length) {
        character = value.charAt(index2);
        if (!whitespace(character)) {
          break;
        }
        subvalue += character;
        index2++;
      }
      character = value.charAt(index2);
      queue = "";
      beforeURL = subvalue;
      if (character === lessThan) {
        index2++;
        beforeURL += lessThan;
        while (index2 < length) {
          character = value.charAt(index2);
          if (character === greaterThan) {
            break;
          }
          if (commonmark && character === lineFeed) {
            return;
          }
          queue += character;
          index2++;
        }
        if (value.charAt(index2) !== greaterThan) {
          return;
        }
        subvalue += lessThan + queue + greaterThan;
        url = queue;
        index2++;
      } else {
        character = null;
        subqueue = "";
        while (index2 < length) {
          character = value.charAt(index2);
          if (subqueue && (character === quotationMark || character === apostrophe || commonmark && character === leftParenthesis)) {
            break;
          }
          if (whitespace(character)) {
            if (!pedantic) {
              break;
            }
            subqueue += character;
          } else {
            if (character === leftParenthesis) {
              depth++;
            } else if (character === rightParenthesis) {
              if (depth === 0) {
                break;
              }
              depth--;
            }
            queue += subqueue;
            subqueue = "";
            if (character === backslash) {
              queue += backslash;
              character = value.charAt(++index2);
            }
            queue += character;
          }
          index2++;
        }
        subvalue += queue;
        url = queue;
        index2 = subvalue.length;
      }
      queue = "";
      while (index2 < length) {
        character = value.charAt(index2);
        if (!whitespace(character)) {
          break;
        }
        queue += character;
        index2++;
      }
      character = value.charAt(index2);
      subvalue += queue;
      if (queue && (character === quotationMark || character === apostrophe || commonmark && character === leftParenthesis)) {
        index2++;
        subvalue += character;
        queue = "";
        marker = character === leftParenthesis ? rightParenthesis : character;
        beforeTitle = subvalue;
        if (commonmark) {
          while (index2 < length) {
            character = value.charAt(index2);
            if (character === marker) {
              break;
            }
            if (character === backslash) {
              queue += backslash;
              character = value.charAt(++index2);
            }
            index2++;
            queue += character;
          }
          character = value.charAt(index2);
          if (character !== marker) {
            return;
          }
          title = queue;
          subvalue += queue + character;
          index2++;
          while (index2 < length) {
            character = value.charAt(index2);
            if (!whitespace(character)) {
              break;
            }
            subvalue += character;
            index2++;
          }
        } else {
          subqueue = "";
          while (index2 < length) {
            character = value.charAt(index2);
            if (character === marker) {
              if (hasMarker) {
                queue += marker + subqueue;
                subqueue = "";
              }
              hasMarker = true;
            } else if (!hasMarker) {
              queue += character;
            } else if (character === rightParenthesis) {
              subvalue += queue + marker + subqueue;
              title = queue;
              break;
            } else if (whitespace(character)) {
              subqueue += character;
            } else {
              queue += marker + subqueue + character;
              subqueue = "";
              hasMarker = false;
            }
            index2++;
          }
        }
      }
      if (value.charAt(index2) !== rightParenthesis) {
        return;
      }
      if (silent) {
        return true;
      }
      subvalue += rightParenthesis;
      url = self.decode.raw(self.unescape(url), eat(beforeURL).test().end, {
        nonTerminated: false
      });
      if (title) {
        beforeTitle = eat(beforeTitle).test().end;
        title = self.decode.raw(self.unescape(title), beforeTitle);
      }
      node2 = {
        type: isImage ? "image" : "link",
        title: title || null,
        url
      };
      if (isImage) {
        node2.alt = self.decode.raw(self.unescape(content3), now) || null;
      } else {
        exit3 = self.enterLink();
        node2.children = self.tokenizeInline(content3, now);
        exit3();
      }
      return eat(subvalue)(node2);
    }
  }
});

// node_modules/remark-parse/lib/tokenize/reference.js
var require_reference = __commonJS({
  "node_modules/remark-parse/lib/tokenize/reference.js"(exports, module) {
    "use strict";
    var whitespace = require_is_whitespace_character();
    var locate = require_link();
    var normalize = require_normalize();
    module.exports = reference;
    reference.locator = locate;
    var link = "link";
    var image = "image";
    var shortcut = "shortcut";
    var collapsed = "collapsed";
    var full = "full";
    var exclamationMark = "!";
    var leftSquareBracket = "[";
    var backslash = "\\";
    var rightSquareBracket = "]";
    function reference(eat, value, silent) {
      var self = this;
      var commonmark = self.options.commonmark;
      var character = value.charAt(0);
      var index2 = 0;
      var length = value.length;
      var subvalue = "";
      var intro = "";
      var type = link;
      var referenceType = shortcut;
      var content3;
      var identifier;
      var now;
      var node2;
      var exit3;
      var queue;
      var bracketed;
      var depth;
      if (character === exclamationMark) {
        type = image;
        intro = character;
        character = value.charAt(++index2);
      }
      if (character !== leftSquareBracket) {
        return;
      }
      index2++;
      intro += character;
      queue = "";
      depth = 0;
      while (index2 < length) {
        character = value.charAt(index2);
        if (character === leftSquareBracket) {
          bracketed = true;
          depth++;
        } else if (character === rightSquareBracket) {
          if (!depth) {
            break;
          }
          depth--;
        }
        if (character === backslash) {
          queue += backslash;
          character = value.charAt(++index2);
        }
        queue += character;
        index2++;
      }
      subvalue = queue;
      content3 = queue;
      character = value.charAt(index2);
      if (character !== rightSquareBracket) {
        return;
      }
      index2++;
      subvalue += character;
      queue = "";
      if (!commonmark) {
        while (index2 < length) {
          character = value.charAt(index2);
          if (!whitespace(character)) {
            break;
          }
          queue += character;
          index2++;
        }
      }
      character = value.charAt(index2);
      if (character === leftSquareBracket) {
        identifier = "";
        queue += character;
        index2++;
        while (index2 < length) {
          character = value.charAt(index2);
          if (character === leftSquareBracket || character === rightSquareBracket) {
            break;
          }
          if (character === backslash) {
            identifier += backslash;
            character = value.charAt(++index2);
          }
          identifier += character;
          index2++;
        }
        character = value.charAt(index2);
        if (character === rightSquareBracket) {
          referenceType = identifier ? full : collapsed;
          queue += identifier + character;
          index2++;
        } else {
          identifier = "";
        }
        subvalue += queue;
        queue = "";
      } else {
        if (!content3) {
          return;
        }
        identifier = content3;
      }
      if (referenceType !== full && bracketed) {
        return;
      }
      subvalue = intro + subvalue;
      if (type === link && self.inLink) {
        return null;
      }
      if (silent) {
        return true;
      }
      now = eat.now();
      now.column += intro.length;
      now.offset += intro.length;
      identifier = referenceType === full ? identifier : content3;
      node2 = {
        type: type + "Reference",
        identifier: normalize(identifier),
        label: identifier,
        referenceType
      };
      if (type === link) {
        exit3 = self.enterLink();
        node2.children = self.tokenizeInline(content3, now);
        exit3();
      } else {
        node2.alt = self.decode.raw(self.unescape(content3), now) || null;
      }
      return eat(subvalue)(node2);
    }
  }
});

// node_modules/remark-parse/lib/locate/strong.js
var require_strong = __commonJS({
  "node_modules/remark-parse/lib/locate/strong.js"(exports, module) {
    "use strict";
    module.exports = locate;
    function locate(value, fromIndex) {
      var asterisk = value.indexOf("**", fromIndex);
      var underscore = value.indexOf("__", fromIndex);
      if (underscore === -1) {
        return asterisk;
      }
      if (asterisk === -1) {
        return underscore;
      }
      return underscore < asterisk ? underscore : asterisk;
    }
  }
});

// node_modules/remark-parse/lib/tokenize/strong.js
var require_strong2 = __commonJS({
  "node_modules/remark-parse/lib/tokenize/strong.js"(exports, module) {
    "use strict";
    var trim = require_trim();
    var whitespace = require_is_whitespace_character();
    var locate = require_strong();
    module.exports = strong;
    strong.locator = locate;
    var backslash = "\\";
    var asterisk = "*";
    var underscore = "_";
    function strong(eat, value, silent) {
      var self = this;
      var index2 = 0;
      var character = value.charAt(index2);
      var now;
      var pedantic;
      var marker;
      var queue;
      var subvalue;
      var length;
      var previous4;
      if (character !== asterisk && character !== underscore || value.charAt(++index2) !== character) {
        return;
      }
      pedantic = self.options.pedantic;
      marker = character;
      subvalue = marker + marker;
      length = value.length;
      index2++;
      queue = "";
      character = "";
      if (pedantic && whitespace(value.charAt(index2))) {
        return;
      }
      while (index2 < length) {
        previous4 = character;
        character = value.charAt(index2);
        if (character === marker && value.charAt(index2 + 1) === marker && (!pedantic || !whitespace(previous4))) {
          character = value.charAt(index2 + 2);
          if (character !== marker) {
            if (!trim(queue)) {
              return;
            }
            if (silent) {
              return true;
            }
            now = eat.now();
            now.column += 2;
            now.offset += 2;
            return eat(subvalue + queue + subvalue)({
              type: "strong",
              children: self.tokenizeInline(queue, now)
            });
          }
        }
        if (!pedantic && character === backslash) {
          queue += character;
          character = value.charAt(++index2);
        }
        queue += character;
        index2++;
      }
    }
  }
});

// node_modules/is-word-character/index.js
var require_is_word_character = __commonJS({
  "node_modules/is-word-character/index.js"(exports, module) {
    "use strict";
    module.exports = wordCharacter;
    var fromCode = String.fromCharCode;
    var re = /\w/;
    function wordCharacter(character) {
      return re.test(
        typeof character === "number" ? fromCode(character) : character.charAt(0)
      );
    }
  }
});

// node_modules/remark-parse/lib/locate/emphasis.js
var require_emphasis = __commonJS({
  "node_modules/remark-parse/lib/locate/emphasis.js"(exports, module) {
    "use strict";
    module.exports = locate;
    function locate(value, fromIndex) {
      var asterisk = value.indexOf("*", fromIndex);
      var underscore = value.indexOf("_", fromIndex);
      if (underscore === -1) {
        return asterisk;
      }
      if (asterisk === -1) {
        return underscore;
      }
      return underscore < asterisk ? underscore : asterisk;
    }
  }
});

// node_modules/remark-parse/lib/tokenize/emphasis.js
var require_emphasis2 = __commonJS({
  "node_modules/remark-parse/lib/tokenize/emphasis.js"(exports, module) {
    "use strict";
    var trim = require_trim();
    var word = require_is_word_character();
    var whitespace = require_is_whitespace_character();
    var locate = require_emphasis();
    module.exports = emphasis;
    emphasis.locator = locate;
    var asterisk = "*";
    var underscore = "_";
    var backslash = "\\";
    function emphasis(eat, value, silent) {
      var self = this;
      var index2 = 0;
      var character = value.charAt(index2);
      var now;
      var pedantic;
      var marker;
      var queue;
      var subvalue;
      var length;
      var previous4;
      if (character !== asterisk && character !== underscore) {
        return;
      }
      pedantic = self.options.pedantic;
      subvalue = character;
      marker = character;
      length = value.length;
      index2++;
      queue = "";
      character = "";
      if (pedantic && whitespace(value.charAt(index2))) {
        return;
      }
      while (index2 < length) {
        previous4 = character;
        character = value.charAt(index2);
        if (character === marker && (!pedantic || !whitespace(previous4))) {
          character = value.charAt(++index2);
          if (character !== marker) {
            if (!trim(queue) || previous4 === marker) {
              return;
            }
            if (!pedantic && marker === underscore && word(character)) {
              queue += marker;
              continue;
            }
            if (silent) {
              return true;
            }
            now = eat.now();
            now.column++;
            now.offset++;
            return eat(subvalue + queue + marker)({
              type: "emphasis",
              children: self.tokenizeInline(queue, now)
            });
          }
          queue += marker;
        }
        if (!pedantic && character === backslash) {
          queue += character;
          character = value.charAt(++index2);
        }
        queue += character;
        index2++;
      }
    }
  }
});

// node_modules/remark-parse/lib/locate/delete.js
var require_delete = __commonJS({
  "node_modules/remark-parse/lib/locate/delete.js"(exports, module) {
    "use strict";
    module.exports = locate;
    function locate(value, fromIndex) {
      return value.indexOf("~~", fromIndex);
    }
  }
});

// node_modules/remark-parse/lib/tokenize/delete.js
var require_delete2 = __commonJS({
  "node_modules/remark-parse/lib/tokenize/delete.js"(exports, module) {
    "use strict";
    var whitespace = require_is_whitespace_character();
    var locate = require_delete();
    module.exports = strikethrough;
    strikethrough.locator = locate;
    var tilde = "~";
    var fence = "~~";
    function strikethrough(eat, value, silent) {
      var self = this;
      var character = "";
      var previous4 = "";
      var preceding = "";
      var subvalue = "";
      var index2;
      var length;
      var now;
      if (!self.options.gfm || value.charAt(0) !== tilde || value.charAt(1) !== tilde || whitespace(value.charAt(2))) {
        return;
      }
      index2 = 1;
      length = value.length;
      now = eat.now();
      now.column += 2;
      now.offset += 2;
      while (++index2 < length) {
        character = value.charAt(index2);
        if (character === tilde && previous4 === tilde && (!preceding || !whitespace(preceding))) {
          if (silent) {
            return true;
          }
          return eat(fence + subvalue + fence)({
            type: "delete",
            children: self.tokenizeInline(subvalue, now)
          });
        }
        subvalue += previous4;
        preceding = previous4;
        previous4 = character;
      }
    }
  }
});

// node_modules/remark-parse/lib/locate/code-inline.js
var require_code_inline = __commonJS({
  "node_modules/remark-parse/lib/locate/code-inline.js"(exports, module) {
    "use strict";
    module.exports = locate;
    function locate(value, fromIndex) {
      return value.indexOf("`", fromIndex);
    }
  }
});

// node_modules/remark-parse/lib/tokenize/code-inline.js
var require_code_inline2 = __commonJS({
  "node_modules/remark-parse/lib/tokenize/code-inline.js"(exports, module) {
    "use strict";
    var locate = require_code_inline();
    module.exports = inlineCode;
    inlineCode.locator = locate;
    var lineFeed = 10;
    var space = 32;
    var graveAccent = 96;
    function inlineCode(eat, value, silent) {
      var length = value.length;
      var index2 = 0;
      var openingFenceEnd;
      var closingFenceStart;
      var closingFenceEnd;
      var code2;
      var next;
      var found;
      while (index2 < length) {
        if (value.charCodeAt(index2) !== graveAccent) {
          break;
        }
        index2++;
      }
      if (index2 === 0 || index2 === length) {
        return;
      }
      openingFenceEnd = index2;
      next = value.charCodeAt(index2);
      while (index2 < length) {
        code2 = next;
        next = value.charCodeAt(index2 + 1);
        if (code2 === graveAccent) {
          if (closingFenceStart === void 0) {
            closingFenceStart = index2;
          }
          closingFenceEnd = index2 + 1;
          if (next !== graveAccent && closingFenceEnd - closingFenceStart === openingFenceEnd) {
            found = true;
            break;
          }
        } else if (closingFenceStart !== void 0) {
          closingFenceStart = void 0;
          closingFenceEnd = void 0;
        }
        index2++;
      }
      if (!found) {
        return;
      }
      if (silent) {
        return true;
      }
      index2 = openingFenceEnd;
      length = closingFenceStart;
      code2 = value.charCodeAt(index2);
      next = value.charCodeAt(length - 1);
      found = false;
      if (length - index2 > 2 && (code2 === space || code2 === lineFeed) && (next === space || next === lineFeed)) {
        index2++;
        length--;
        while (index2 < length) {
          code2 = value.charCodeAt(index2);
          if (code2 !== space && code2 !== lineFeed) {
            found = true;
            break;
          }
          index2++;
        }
        if (found === true) {
          openingFenceEnd++;
          closingFenceStart--;
        }
      }
      return eat(value.slice(0, closingFenceEnd))({
        type: "inlineCode",
        value: value.slice(openingFenceEnd, closingFenceStart)
      });
    }
  }
});

// node_modules/remark-parse/lib/locate/break.js
var require_break = __commonJS({
  "node_modules/remark-parse/lib/locate/break.js"(exports, module) {
    "use strict";
    module.exports = locate;
    function locate(value, fromIndex) {
      var index2 = value.indexOf("\n", fromIndex);
      while (index2 > fromIndex) {
        if (value.charAt(index2 - 1) !== " ") {
          break;
        }
        index2--;
      }
      return index2;
    }
  }
});

// node_modules/remark-parse/lib/tokenize/break.js
var require_break2 = __commonJS({
  "node_modules/remark-parse/lib/tokenize/break.js"(exports, module) {
    "use strict";
    var locate = require_break();
    module.exports = hardBreak;
    hardBreak.locator = locate;
    var space = " ";
    var lineFeed = "\n";
    var minBreakLength = 2;
    function hardBreak(eat, value, silent) {
      var length = value.length;
      var index2 = -1;
      var queue = "";
      var character;
      while (++index2 < length) {
        character = value.charAt(index2);
        if (character === lineFeed) {
          if (index2 < minBreakLength) {
            return;
          }
          if (silent) {
            return true;
          }
          queue += character;
          return eat(queue)({ type: "break" });
        }
        if (character !== space) {
          return;
        }
        queue += character;
      }
    }
  }
});

// node_modules/remark-parse/lib/tokenize/text.js
var require_text = __commonJS({
  "node_modules/remark-parse/lib/tokenize/text.js"(exports, module) {
    "use strict";
    module.exports = text4;
    function text4(eat, value, silent) {
      var self = this;
      var methods;
      var tokenizers;
      var index2;
      var length;
      var subvalue;
      var position2;
      var tokenizer;
      var name;
      var min;
      var now;
      if (silent) {
        return true;
      }
      methods = self.inlineMethods;
      length = methods.length;
      tokenizers = self.inlineTokenizers;
      index2 = -1;
      min = value.length;
      while (++index2 < length) {
        name = methods[index2];
        if (name === "text" || !tokenizers[name]) {
          continue;
        }
        tokenizer = tokenizers[name].locator;
        if (!tokenizer) {
          eat.file.fail("Missing locator: `" + name + "`");
        }
        position2 = tokenizer.call(self, value, 1);
        if (position2 !== -1 && position2 < min) {
          min = position2;
        }
      }
      subvalue = value.slice(0, min);
      now = eat.now();
      self.decode(subvalue, now, handler);
      function handler(content3, position3, source) {
        eat(source || content3)({ type: "text", value: content3 });
      }
    }
  }
});

// node_modules/remark-parse/lib/parser.js
var require_parser = __commonJS({
  "node_modules/remark-parse/lib/parser.js"(exports, module) {
    "use strict";
    var xtend = require_immutable();
    var toggle = require_state_toggle();
    var vfileLocation = require_vfile_location();
    var unescape = require_unescape();
    var decode2 = require_decode();
    var tokenizer = require_tokenizer();
    module.exports = Parser;
    function Parser(doc, file) {
      this.file = file;
      this.offset = {};
      this.options = xtend(this.options);
      this.setOptions({});
      this.inList = false;
      this.inBlock = false;
      this.inLink = false;
      this.atStart = true;
      this.toOffset = vfileLocation(file).toOffset;
      this.unescape = unescape(this, "escape");
      this.decode = decode2(this);
    }
    var proto = Parser.prototype;
    proto.setOptions = require_set_options();
    proto.parse = require_parse();
    proto.options = require_defaults();
    proto.exitStart = toggle("atStart", true);
    proto.enterList = toggle("inList", false);
    proto.enterLink = toggle("inLink", false);
    proto.enterBlock = toggle("inBlock", false);
    proto.interruptParagraph = [
      ["thematicBreak"],
      ["list"],
      ["atxHeading"],
      ["fencedCode"],
      ["blockquote"],
      ["html"],
      ["setextHeading", { commonmark: false }],
      ["definition", { commonmark: false }]
    ];
    proto.interruptList = [
      ["atxHeading", { pedantic: false }],
      ["fencedCode", { pedantic: false }],
      ["thematicBreak", { pedantic: false }],
      ["definition", { commonmark: false }]
    ];
    proto.interruptBlockquote = [
      ["indentedCode", { commonmark: true }],
      ["fencedCode", { commonmark: true }],
      ["atxHeading", { commonmark: true }],
      ["setextHeading", { commonmark: true }],
      ["thematicBreak", { commonmark: true }],
      ["html", { commonmark: true }],
      ["list", { commonmark: true }],
      ["definition", { commonmark: false }]
    ];
    proto.blockTokenizers = {
      blankLine: require_blank_line(),
      indentedCode: require_code_indented(),
      fencedCode: require_code_fenced(),
      blockquote: require_blockquote(),
      atxHeading: require_heading_atx(),
      thematicBreak: require_thematic_break(),
      list: require_list(),
      setextHeading: require_heading_setext(),
      html: require_html_block(),
      definition: require_definition(),
      table: require_table(),
      paragraph: require_paragraph()
    };
    proto.inlineTokenizers = {
      escape: require_escape2(),
      autoLink: require_auto_link(),
      url: require_url2(),
      email: require_email2(),
      html: require_html_inline(),
      link: require_link2(),
      reference: require_reference(),
      strong: require_strong2(),
      emphasis: require_emphasis2(),
      deletion: require_delete2(),
      code: require_code_inline2(),
      break: require_break2(),
      text: require_text()
    };
    proto.blockMethods = keys(proto.blockTokenizers);
    proto.inlineMethods = keys(proto.inlineTokenizers);
    proto.tokenizeBlock = tokenizer("block");
    proto.tokenizeInline = tokenizer("inline");
    proto.tokenizeFactory = tokenizer;
    function keys(value) {
      var result = [];
      var key;
      for (key in value) {
        result.push(key);
      }
      return result;
    }
  }
});

// node_modules/remark-parse/index.js
var require_remark_parse = __commonJS({
  "node_modules/remark-parse/index.js"(exports, module) {
    "use strict";
    var unherit = require_unherit();
    var xtend = require_immutable();
    var Parser = require_parser();
    module.exports = parse3;
    parse3.Parser = Parser;
    function parse3(options2) {
      var settings = this.data("settings");
      var Local = unherit(Parser);
      Local.prototype.options = xtend(Local.prototype.options, settings, options2);
      this.Parser = Local;
    }
  }
});

// node_modules/bail/index.js
var require_bail = __commonJS({
  "node_modules/bail/index.js"(exports, module) {
    "use strict";
    module.exports = bail;
    function bail(err) {
      if (err) {
        throw err;
      }
    }
  }
});

// node_modules/is-buffer/index.js
var require_is_buffer = __commonJS({
  "node_modules/is-buffer/index.js"(exports, module) {
    module.exports = function isBuffer(obj) {
      return obj != null && obj.constructor != null && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
    };
  }
});

// node_modules/extend/index.js
var require_extend = __commonJS({
  "node_modules/extend/index.js"(exports, module) {
    "use strict";
    var hasOwn = Object.prototype.hasOwnProperty;
    var toStr = Object.prototype.toString;
    var defineProperty = Object.defineProperty;
    var gOPD = Object.getOwnPropertyDescriptor;
    var isArray = function isArray2(arr) {
      if (typeof Array.isArray === "function") {
        return Array.isArray(arr);
      }
      return toStr.call(arr) === "[object Array]";
    };
    var isPlainObject = function isPlainObject2(obj) {
      if (!obj || toStr.call(obj) !== "[object Object]") {
        return false;
      }
      var hasOwnConstructor = hasOwn.call(obj, "constructor");
      var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, "isPrototypeOf");
      if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
        return false;
      }
      var key;
      for (key in obj) {
      }
      return typeof key === "undefined" || hasOwn.call(obj, key);
    };
    var setProperty = function setProperty2(target, options2) {
      if (defineProperty && options2.name === "__proto__") {
        defineProperty(target, options2.name, {
          enumerable: true,
          configurable: true,
          value: options2.newValue,
          writable: true
        });
      } else {
        target[options2.name] = options2.newValue;
      }
    };
    var getProperty = function getProperty2(obj, name) {
      if (name === "__proto__") {
        if (!hasOwn.call(obj, name)) {
          return void 0;
        } else if (gOPD) {
          return gOPD(obj, name).value;
        }
      }
      return obj[name];
    };
    module.exports = function extend() {
      var options2, name, src, copy, copyIsArray, clone;
      var target = arguments[0];
      var i = 1;
      var length = arguments.length;
      var deep = false;
      if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        i = 2;
      }
      if (target == null || typeof target !== "object" && typeof target !== "function") {
        target = {};
      }
      for (; i < length; ++i) {
        options2 = arguments[i];
        if (options2 != null) {
          for (name in options2) {
            src = getProperty(target, name);
            copy = getProperty(options2, name);
            if (target !== copy) {
              if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                if (copyIsArray) {
                  copyIsArray = false;
                  clone = src && isArray(src) ? src : [];
                } else {
                  clone = src && isPlainObject(src) ? src : {};
                }
                setProperty(target, { name, newValue: extend(deep, clone, copy) });
              } else if (typeof copy !== "undefined") {
                setProperty(target, { name, newValue: copy });
              }
            }
          }
        }
      }
      return target;
    };
  }
});

// node_modules/unified/node_modules/is-plain-obj/index.js
var require_is_plain_obj = __commonJS({
  "node_modules/unified/node_modules/is-plain-obj/index.js"(exports, module) {
    "use strict";
    module.exports = (value) => {
      if (Object.prototype.toString.call(value) !== "[object Object]") {
        return false;
      }
      const prototype = Object.getPrototypeOf(value);
      return prototype === null || prototype === Object.prototype;
    };
  }
});

// node_modules/trough/wrap.js
var require_wrap = __commonJS({
  "node_modules/trough/wrap.js"(exports, module) {
    "use strict";
    var slice = [].slice;
    module.exports = wrap;
    function wrap(fn, callback) {
      var invoked;
      return wrapped;
      function wrapped() {
        var params = slice.call(arguments, 0);
        var callback2 = fn.length > params.length;
        var result;
        if (callback2) {
          params.push(done);
        }
        try {
          result = fn.apply(null, params);
        } catch (error) {
          if (callback2 && invoked) {
            throw error;
          }
          return done(error);
        }
        if (!callback2) {
          if (result && typeof result.then === "function") {
            result.then(then, done);
          } else if (result instanceof Error) {
            done(result);
          } else {
            then(result);
          }
        }
      }
      function done() {
        if (!invoked) {
          invoked = true;
          callback.apply(null, arguments);
        }
      }
      function then(value) {
        done(null, value);
      }
    }
  }
});

// node_modules/trough/index.js
var require_trough = __commonJS({
  "node_modules/trough/index.js"(exports, module) {
    "use strict";
    var wrap = require_wrap();
    module.exports = trough;
    trough.wrap = wrap;
    var slice = [].slice;
    function trough() {
      var fns = [];
      var middleware = {};
      middleware.run = run;
      middleware.use = use;
      return middleware;
      function run() {
        var index2 = -1;
        var input = slice.call(arguments, 0, -1);
        var done = arguments[arguments.length - 1];
        if (typeof done !== "function") {
          throw new Error("Expected function as last argument, not " + done);
        }
        next.apply(null, [null].concat(input));
        function next(err) {
          var fn = fns[++index2];
          var params = slice.call(arguments, 0);
          var values = params.slice(1);
          var length = input.length;
          var pos = -1;
          if (err) {
            done(err);
            return;
          }
          while (++pos < length) {
            if (values[pos] === null || values[pos] === void 0) {
              values[pos] = input[pos];
            }
          }
          input = values;
          if (fn) {
            wrap(fn, next).apply(null, input);
          } else {
            done.apply(null, [null].concat(input));
          }
        }
      }
      function use(fn) {
        if (typeof fn !== "function") {
          throw new Error("Expected `fn` to be a function, not " + fn);
        }
        fns.push(fn);
        return middleware;
      }
    }
  }
});

// node_modules/unist-util-stringify-position/index.js
var require_unist_util_stringify_position = __commonJS({
  "node_modules/unist-util-stringify-position/index.js"(exports, module) {
    "use strict";
    var own3 = {}.hasOwnProperty;
    module.exports = stringify;
    function stringify(value) {
      if (!value || typeof value !== "object") {
        return "";
      }
      if (own3.call(value, "position") || own3.call(value, "type")) {
        return position2(value.position);
      }
      if (own3.call(value, "start") || own3.call(value, "end")) {
        return position2(value);
      }
      if (own3.call(value, "line") || own3.call(value, "column")) {
        return point3(value);
      }
      return "";
    }
    function point3(point4) {
      if (!point4 || typeof point4 !== "object") {
        point4 = {};
      }
      return index2(point4.line) + ":" + index2(point4.column);
    }
    function position2(pos) {
      if (!pos || typeof pos !== "object") {
        pos = {};
      }
      return point3(pos.start) + "-" + point3(pos.end);
    }
    function index2(value) {
      return value && typeof value === "number" ? value : 1;
    }
  }
});

// node_modules/vfile-message/index.js
var require_vfile_message = __commonJS({
  "node_modules/vfile-message/index.js"(exports, module) {
    "use strict";
    var stringify = require_unist_util_stringify_position();
    module.exports = VMessage;
    function VMessagePrototype() {
    }
    VMessagePrototype.prototype = Error.prototype;
    VMessage.prototype = new VMessagePrototype();
    var proto = VMessage.prototype;
    proto.file = "";
    proto.name = "";
    proto.reason = "";
    proto.message = "";
    proto.stack = "";
    proto.fatal = null;
    proto.column = null;
    proto.line = null;
    function VMessage(reason, position2, origin) {
      var parts;
      var range;
      var location;
      if (typeof position2 === "string") {
        origin = position2;
        position2 = null;
      }
      parts = parseOrigin(origin);
      range = stringify(position2) || "1:1";
      location = {
        start: { line: null, column: null },
        end: { line: null, column: null }
      };
      if (position2 && position2.position) {
        position2 = position2.position;
      }
      if (position2) {
        if (position2.start) {
          location = position2;
          position2 = position2.start;
        } else {
          location.start = position2;
        }
      }
      if (reason.stack) {
        this.stack = reason.stack;
        reason = reason.message;
      }
      this.message = reason;
      this.name = range;
      this.reason = reason;
      this.line = position2 ? position2.line : null;
      this.column = position2 ? position2.column : null;
      this.location = location;
      this.source = parts[0];
      this.ruleId = parts[1];
    }
    function parseOrigin(origin) {
      var result = [null, null];
      var index2;
      if (typeof origin === "string") {
        index2 = origin.indexOf(":");
        if (index2 === -1) {
          result[1] = origin;
        } else {
          result[0] = origin.slice(0, index2);
          result[1] = origin.slice(index2 + 1);
        }
      }
      return result;
    }
  }
});

// node_modules/vfile/lib/minpath.browser.js
var require_minpath_browser = __commonJS({
  "node_modules/vfile/lib/minpath.browser.js"(exports) {
    "use strict";
    exports.basename = basename;
    exports.dirname = dirname;
    exports.extname = extname;
    exports.join = join2;
    exports.sep = "/";
    function basename(path2, ext) {
      var start = 0;
      var end = -1;
      var index2;
      var firstNonSlashEnd;
      var seenNonSlash;
      var extIndex;
      if (ext !== void 0 && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
      }
      assertPath(path2);
      index2 = path2.length;
      if (ext === void 0 || !ext.length || ext.length > path2.length) {
        while (index2--) {
          if (path2.charCodeAt(index2) === 47) {
            if (seenNonSlash) {
              start = index2 + 1;
              break;
            }
          } else if (end < 0) {
            seenNonSlash = true;
            end = index2 + 1;
          }
        }
        return end < 0 ? "" : path2.slice(start, end);
      }
      if (ext === path2) {
        return "";
      }
      firstNonSlashEnd = -1;
      extIndex = ext.length - 1;
      while (index2--) {
        if (path2.charCodeAt(index2) === 47) {
          if (seenNonSlash) {
            start = index2 + 1;
            break;
          }
        } else {
          if (firstNonSlashEnd < 0) {
            seenNonSlash = true;
            firstNonSlashEnd = index2 + 1;
          }
          if (extIndex > -1) {
            if (path2.charCodeAt(index2) === ext.charCodeAt(extIndex--)) {
              if (extIndex < 0) {
                end = index2;
              }
            } else {
              extIndex = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }
      if (start === end) {
        end = firstNonSlashEnd;
      } else if (end < 0) {
        end = path2.length;
      }
      return path2.slice(start, end);
    }
    function dirname(path2) {
      var end;
      var unmatchedSlash;
      var index2;
      assertPath(path2);
      if (!path2.length) {
        return ".";
      }
      end = -1;
      index2 = path2.length;
      while (--index2) {
        if (path2.charCodeAt(index2) === 47) {
          if (unmatchedSlash) {
            end = index2;
            break;
          }
        } else if (!unmatchedSlash) {
          unmatchedSlash = true;
        }
      }
      return end < 0 ? path2.charCodeAt(0) === 47 ? "/" : "." : end === 1 && path2.charCodeAt(0) === 47 ? "//" : path2.slice(0, end);
    }
    function extname(path2) {
      var startDot = -1;
      var startPart = 0;
      var end = -1;
      var preDotState = 0;
      var unmatchedSlash;
      var code2;
      var index2;
      assertPath(path2);
      index2 = path2.length;
      while (index2--) {
        code2 = path2.charCodeAt(index2);
        if (code2 === 47) {
          if (unmatchedSlash) {
            startPart = index2 + 1;
            break;
          }
          continue;
        }
        if (end < 0) {
          unmatchedSlash = true;
          end = index2 + 1;
        }
        if (code2 === 46) {
          if (startDot < 0) {
            startDot = index2;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot > -1) {
          preDotState = -1;
        }
      }
      if (startDot < 0 || end < 0 || // We saw a non-dot character immediately before the dot.
      preDotState === 0 || // The (right-most) trimmed path component is exactly `..`.
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
      }
      return path2.slice(startDot, end);
    }
    function join2() {
      var index2 = -1;
      var joined;
      while (++index2 < arguments.length) {
        assertPath(arguments[index2]);
        if (arguments[index2]) {
          joined = joined === void 0 ? arguments[index2] : joined + "/" + arguments[index2];
        }
      }
      return joined === void 0 ? "." : normalize(joined);
    }
    function normalize(path2) {
      var absolute;
      var value;
      assertPath(path2);
      absolute = path2.charCodeAt(0) === 47;
      value = normalizeString(path2, !absolute);
      if (!value.length && !absolute) {
        value = ".";
      }
      if (value.length && path2.charCodeAt(path2.length - 1) === 47) {
        value += "/";
      }
      return absolute ? "/" + value : value;
    }
    function normalizeString(path2, allowAboveRoot) {
      var result = "";
      var lastSegmentLength = 0;
      var lastSlash = -1;
      var dots = 0;
      var index2 = -1;
      var code2;
      var lastSlashIndex;
      while (++index2 <= path2.length) {
        if (index2 < path2.length) {
          code2 = path2.charCodeAt(index2);
        } else if (code2 === 47) {
          break;
        } else {
          code2 = 47;
        }
        if (code2 === 47) {
          if (lastSlash === index2 - 1 || dots === 1) {
          } else if (lastSlash !== index2 - 1 && dots === 2) {
            if (result.length < 2 || lastSegmentLength !== 2 || result.charCodeAt(result.length - 1) !== 46 || result.charCodeAt(result.length - 2) !== 46) {
              if (result.length > 2) {
                lastSlashIndex = result.lastIndexOf("/");
                if (lastSlashIndex !== result.length - 1) {
                  if (lastSlashIndex < 0) {
                    result = "";
                    lastSegmentLength = 0;
                  } else {
                    result = result.slice(0, lastSlashIndex);
                    lastSegmentLength = result.length - 1 - result.lastIndexOf("/");
                  }
                  lastSlash = index2;
                  dots = 0;
                  continue;
                }
              } else if (result.length) {
                result = "";
                lastSegmentLength = 0;
                lastSlash = index2;
                dots = 0;
                continue;
              }
            }
            if (allowAboveRoot) {
              result = result.length ? result + "/.." : "..";
              lastSegmentLength = 2;
            }
          } else {
            if (result.length) {
              result += "/" + path2.slice(lastSlash + 1, index2);
            } else {
              result = path2.slice(lastSlash + 1, index2);
            }
            lastSegmentLength = index2 - lastSlash - 1;
          }
          lastSlash = index2;
          dots = 0;
        } else if (code2 === 46 && dots > -1) {
          dots++;
        } else {
          dots = -1;
        }
      }
      return result;
    }
    function assertPath(path2) {
      if (typeof path2 !== "string") {
        throw new TypeError(
          "Path must be a string. Received " + JSON.stringify(path2)
        );
      }
    }
  }
});

// node_modules/vfile/lib/minproc.browser.js
var require_minproc_browser = __commonJS({
  "node_modules/vfile/lib/minproc.browser.js"(exports) {
    "use strict";
    exports.cwd = cwd;
    function cwd() {
      return "/";
    }
  }
});

// node_modules/vfile/lib/core.js
var require_core = __commonJS({
  "node_modules/vfile/lib/core.js"(exports, module) {
    "use strict";
    var p = require_minpath_browser();
    var proc = require_minproc_browser();
    var buffer = require_is_buffer();
    module.exports = VFile;
    var own3 = {}.hasOwnProperty;
    var order = ["history", "path", "basename", "stem", "extname", "dirname"];
    VFile.prototype.toString = toString2;
    Object.defineProperty(VFile.prototype, "path", { get: getPath, set: setPath });
    Object.defineProperty(VFile.prototype, "dirname", {
      get: getDirname,
      set: setDirname
    });
    Object.defineProperty(VFile.prototype, "basename", {
      get: getBasename,
      set: setBasename
    });
    Object.defineProperty(VFile.prototype, "extname", {
      get: getExtname,
      set: setExtname
    });
    Object.defineProperty(VFile.prototype, "stem", { get: getStem, set: setStem });
    function VFile(options2) {
      var prop;
      var index2;
      if (!options2) {
        options2 = {};
      } else if (typeof options2 === "string" || buffer(options2)) {
        options2 = { contents: options2 };
      } else if ("message" in options2 && "messages" in options2) {
        return options2;
      }
      if (!(this instanceof VFile)) {
        return new VFile(options2);
      }
      this.data = {};
      this.messages = [];
      this.history = [];
      this.cwd = proc.cwd();
      index2 = -1;
      while (++index2 < order.length) {
        prop = order[index2];
        if (own3.call(options2, prop)) {
          this[prop] = options2[prop];
        }
      }
      for (prop in options2) {
        if (order.indexOf(prop) < 0) {
          this[prop] = options2[prop];
        }
      }
    }
    function getPath() {
      return this.history[this.history.length - 1];
    }
    function setPath(path2) {
      assertNonEmpty(path2, "path");
      if (this.path !== path2) {
        this.history.push(path2);
      }
    }
    function getDirname() {
      return typeof this.path === "string" ? p.dirname(this.path) : void 0;
    }
    function setDirname(dirname) {
      assertPath(this.path, "dirname");
      this.path = p.join(dirname || "", this.basename);
    }
    function getBasename() {
      return typeof this.path === "string" ? p.basename(this.path) : void 0;
    }
    function setBasename(basename) {
      assertNonEmpty(basename, "basename");
      assertPart(basename, "basename");
      this.path = p.join(this.dirname || "", basename);
    }
    function getExtname() {
      return typeof this.path === "string" ? p.extname(this.path) : void 0;
    }
    function setExtname(extname) {
      assertPart(extname, "extname");
      assertPath(this.path, "extname");
      if (extname) {
        if (extname.charCodeAt(0) !== 46) {
          throw new Error("`extname` must start with `.`");
        }
        if (extname.indexOf(".", 1) > -1) {
          throw new Error("`extname` cannot contain multiple dots");
        }
      }
      this.path = p.join(this.dirname, this.stem + (extname || ""));
    }
    function getStem() {
      return typeof this.path === "string" ? p.basename(this.path, this.extname) : void 0;
    }
    function setStem(stem) {
      assertNonEmpty(stem, "stem");
      assertPart(stem, "stem");
      this.path = p.join(this.dirname || "", stem + (this.extname || ""));
    }
    function toString2(encoding) {
      return (this.contents || "").toString(encoding);
    }
    function assertPart(part, name) {
      if (part && part.indexOf(p.sep) > -1) {
        throw new Error(
          "`" + name + "` cannot be a path: did not expect `" + p.sep + "`"
        );
      }
    }
    function assertNonEmpty(part, name) {
      if (!part) {
        throw new Error("`" + name + "` cannot be empty");
      }
    }
    function assertPath(path2, name) {
      if (!path2) {
        throw new Error("Setting `" + name + "` requires `path` to be set too");
      }
    }
  }
});

// node_modules/vfile/lib/index.js
var require_lib = __commonJS({
  "node_modules/vfile/lib/index.js"(exports, module) {
    "use strict";
    var VMessage = require_vfile_message();
    var VFile = require_core();
    module.exports = VFile;
    VFile.prototype.message = message;
    VFile.prototype.info = info;
    VFile.prototype.fail = fail;
    function message(reason, position2, origin) {
      var message2 = new VMessage(reason, position2, origin);
      if (this.path) {
        message2.name = this.path + ":" + message2.name;
        message2.file = this.path;
      }
      message2.fatal = false;
      this.messages.push(message2);
      return message2;
    }
    function fail() {
      var message2 = this.message.apply(this, arguments);
      message2.fatal = true;
      throw message2;
    }
    function info() {
      var message2 = this.message.apply(this, arguments);
      message2.fatal = null;
      return message2;
    }
  }
});

// node_modules/vfile/index.js
var require_vfile = __commonJS({
  "node_modules/vfile/index.js"(exports, module) {
    "use strict";
    module.exports = require_lib();
  }
});

// node_modules/unified/index.js
var require_unified = __commonJS({
  "node_modules/unified/index.js"(exports, module) {
    "use strict";
    var bail = require_bail();
    var buffer = require_is_buffer();
    var extend = require_extend();
    var plain = require_is_plain_obj();
    var trough = require_trough();
    var vfile = require_vfile();
    module.exports = unified2().freeze();
    var slice = [].slice;
    var own3 = {}.hasOwnProperty;
    var pipeline = trough().use(pipelineParse).use(pipelineRun).use(pipelineStringify);
    function pipelineParse(p, ctx) {
      ctx.tree = p.parse(ctx.file);
    }
    function pipelineRun(p, ctx, next) {
      p.run(ctx.tree, ctx.file, done);
      function done(error, tree, file) {
        if (error) {
          next(error);
        } else {
          ctx.tree = tree;
          ctx.file = file;
          next();
        }
      }
    }
    function pipelineStringify(p, ctx) {
      var result = p.stringify(ctx.tree, ctx.file);
      if (result === void 0 || result === null) {
      } else if (typeof result === "string" || buffer(result)) {
        if ("value" in ctx.file) {
          ctx.file.value = result;
        }
        ctx.file.contents = result;
      } else {
        ctx.file.result = result;
      }
    }
    function unified2() {
      var attachers = [];
      var transformers = trough();
      var namespace = {};
      var freezeIndex = -1;
      var frozen;
      processor.data = data;
      processor.freeze = freeze;
      processor.attachers = attachers;
      processor.use = use;
      processor.parse = parse3;
      processor.stringify = stringify;
      processor.run = run;
      processor.runSync = runSync;
      processor.process = process2;
      processor.processSync = processSync;
      return processor;
      function processor() {
        var destination = unified2();
        var index2 = -1;
        while (++index2 < attachers.length) {
          destination.use.apply(null, attachers[index2]);
        }
        destination.data(extend(true, {}, namespace));
        return destination;
      }
      function freeze() {
        var values;
        var transformer;
        if (frozen) {
          return processor;
        }
        while (++freezeIndex < attachers.length) {
          values = attachers[freezeIndex];
          if (values[1] === false) {
            continue;
          }
          if (values[1] === true) {
            values[1] = void 0;
          }
          transformer = values[0].apply(processor, values.slice(1));
          if (typeof transformer === "function") {
            transformers.use(transformer);
          }
        }
        frozen = true;
        freezeIndex = Infinity;
        return processor;
      }
      function data(key, value) {
        if (typeof key === "string") {
          if (arguments.length === 2) {
            assertUnfrozen("data", frozen);
            namespace[key] = value;
            return processor;
          }
          return own3.call(namespace, key) && namespace[key] || null;
        }
        if (key) {
          assertUnfrozen("data", frozen);
          namespace = key;
          return processor;
        }
        return namespace;
      }
      function use(value) {
        var settings;
        assertUnfrozen("use", frozen);
        if (value === null || value === void 0) {
        } else if (typeof value === "function") {
          addPlugin.apply(null, arguments);
        } else if (typeof value === "object") {
          if ("length" in value) {
            addList(value);
          } else {
            addPreset(value);
          }
        } else {
          throw new Error("Expected usable value, not `" + value + "`");
        }
        if (settings) {
          namespace.settings = extend(namespace.settings || {}, settings);
        }
        return processor;
        function addPreset(result) {
          addList(result.plugins);
          if (result.settings) {
            settings = extend(settings || {}, result.settings);
          }
        }
        function add(value2) {
          if (typeof value2 === "function") {
            addPlugin(value2);
          } else if (typeof value2 === "object") {
            if ("length" in value2) {
              addPlugin.apply(null, value2);
            } else {
              addPreset(value2);
            }
          } else {
            throw new Error("Expected usable value, not `" + value2 + "`");
          }
        }
        function addList(plugins) {
          var index2 = -1;
          if (plugins === null || plugins === void 0) {
          } else if (typeof plugins === "object" && "length" in plugins) {
            while (++index2 < plugins.length) {
              add(plugins[index2]);
            }
          } else {
            throw new Error("Expected a list of plugins, not `" + plugins + "`");
          }
        }
        function addPlugin(plugin, value2) {
          var entry = find(plugin);
          if (entry) {
            if (plain(entry[1]) && plain(value2)) {
              value2 = extend(true, entry[1], value2);
            }
            entry[1] = value2;
          } else {
            attachers.push(slice.call(arguments));
          }
        }
      }
      function find(plugin) {
        var index2 = -1;
        while (++index2 < attachers.length) {
          if (attachers[index2][0] === plugin) {
            return attachers[index2];
          }
        }
      }
      function parse3(doc) {
        var file = vfile(doc);
        var Parser;
        freeze();
        Parser = processor.Parser;
        assertParser("parse", Parser);
        if (newable(Parser, "parse")) {
          return new Parser(String(file), file).parse();
        }
        return Parser(String(file), file);
      }
      function run(node2, file, cb) {
        assertNode(node2);
        freeze();
        if (!cb && typeof file === "function") {
          cb = file;
          file = null;
        }
        if (!cb) {
          return new Promise(executor);
        }
        executor(null, cb);
        function executor(resolve, reject) {
          transformers.run(node2, vfile(file), done);
          function done(error, tree, file2) {
            tree = tree || node2;
            if (error) {
              reject(error);
            } else if (resolve) {
              resolve(tree);
            } else {
              cb(null, tree, file2);
            }
          }
        }
      }
      function runSync(node2, file) {
        var result;
        var complete;
        run(node2, file, done);
        assertDone("runSync", "run", complete);
        return result;
        function done(error, tree) {
          complete = true;
          result = tree;
          bail(error);
        }
      }
      function stringify(node2, doc) {
        var file = vfile(doc);
        var Compiler;
        freeze();
        Compiler = processor.Compiler;
        assertCompiler("stringify", Compiler);
        assertNode(node2);
        if (newable(Compiler, "compile")) {
          return new Compiler(node2, file).compile();
        }
        return Compiler(node2, file);
      }
      function process2(doc, cb) {
        freeze();
        assertParser("process", processor.Parser);
        assertCompiler("process", processor.Compiler);
        if (!cb) {
          return new Promise(executor);
        }
        executor(null, cb);
        function executor(resolve, reject) {
          var file = vfile(doc);
          pipeline.run(processor, { file }, done);
          function done(error) {
            if (error) {
              reject(error);
            } else if (resolve) {
              resolve(file);
            } else {
              cb(null, file);
            }
          }
        }
      }
      function processSync(doc) {
        var file;
        var complete;
        freeze();
        assertParser("processSync", processor.Parser);
        assertCompiler("processSync", processor.Compiler);
        file = vfile(doc);
        process2(file, done);
        assertDone("processSync", "process", complete);
        return file;
        function done(error) {
          complete = true;
          bail(error);
        }
      }
    }
    function newable(value, name) {
      return typeof value === "function" && value.prototype && // A function with keys in its prototype is probably a constructor.
      // Classes’ prototype methods are not enumerable, so we check if some value
      // exists in the prototype.
      (keys(value.prototype) || name in value.prototype);
    }
    function keys(value) {
      var key;
      for (key in value) {
        return true;
      }
      return false;
    }
    function assertParser(name, Parser) {
      if (typeof Parser !== "function") {
        throw new Error("Cannot `" + name + "` without `Parser`");
      }
    }
    function assertCompiler(name, Compiler) {
      if (typeof Compiler !== "function") {
        throw new Error("Cannot `" + name + "` without `Compiler`");
      }
    }
    function assertUnfrozen(name, frozen) {
      if (frozen) {
        throw new Error(
          "Cannot invoke `" + name + "` on a frozen processor.\nCreate a new processor first, by invoking it: use `processor()` instead of `processor`."
        );
      }
    }
    function assertNode(node2) {
      if (!node2 || typeof node2.type !== "string") {
        throw new Error("Expected node, got `" + node2 + "`");
      }
    }
    function assertDone(name, asyncName, complete) {
      if (!complete) {
        throw new Error(
          "`" + name + "` finished async. Use `" + asyncName + "` instead"
        );
      }
    }
  }
});

// src/plugins/markdown.js
var markdown_exports = {};
__export(markdown_exports, {
  languages: () => languages_evaluate_default,
  options: () => options_default,
  parsers: () => parsers_exports,
  printers: () => printers_exports
});

// src/language-markdown/languages.evaluate.js
var languages_evaluate_default = [
  {
    "name": "Markdown",
    "type": "prose",
    "aceMode": "markdown",
    "extensions": [
      ".md",
      ".livemd",
      ".markdown",
      ".mdown",
      ".mdwn",
      ".mkd",
      ".mkdn",
      ".mkdown",
      ".ronn",
      ".scd",
      ".workbook"
    ],
    "filenames": [
      "contents.lr",
      "README"
    ],
    "tmScope": "text.md",
    "aliases": [
      "md",
      "pandoc"
    ],
    "codemirrorMode": "gfm",
    "codemirrorMimeType": "text/x-gfm",
    "wrap": true,
    "parsers": [
      "markdown"
    ],
    "vscodeLanguageIds": [
      "markdown"
    ],
    "linguistLanguageId": 222
  },
  {
    "name": "MDX",
    "type": "prose",
    "aceMode": "markdown",
    "extensions": [
      ".mdx"
    ],
    "filenames": [],
    "tmScope": "text.md",
    "aliases": [
      "md",
      "pandoc"
    ],
    "codemirrorMode": "gfm",
    "codemirrorMimeType": "text/x-gfm",
    "wrap": true,
    "parsers": [
      "mdx"
    ],
    "vscodeLanguageIds": [
      "mdx"
    ],
    "linguistLanguageId": 222
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

// src/language-markdown/options.js
var options = {
  proseWrap: common_options_evaluate_default.proseWrap,
  singleQuote: common_options_evaluate_default.singleQuote
};
var options_default = options;

// src/language-markdown/parsers.js
var parsers_exports = {};
__export(parsers_exports, {
  markdown: () => markdownParser,
  mdx: () => mdxParser,
  remark: () => markdownParser
});

// src/language-markdown/loc.js
var locStart = (node2) => node2.position.start.offset;
var locEnd = (node2) => node2.position.end.offset;

// node_modules/@braindb/mdast-util-wiki-link/dist/from-markdown.js
function defaultLinkTemplate({ slug, permalink, alias }) {
  return {
    hName: "a",
    hProperties: { href: permalink == null ? slug : permalink },
    hChildren: [{ type: "text", value: alias == null ? slug : alias }]
  };
}
function fromMarkdown(opts = {}) {
  const linkTemplate = opts.linkTemplate || defaultLinkTemplate;
  let node2;
  function enterWikiLink(token) {
    node2 = {
      type: "wikiLink",
      value: null,
      data: {
        // alias: null,
        // permalink: null
      }
    };
    this.enter(node2, token);
  }
  function top(stack) {
    return stack[stack.length - 1];
  }
  function exitWikiLinkAlias(token) {
    const alias = this.sliceSerialize(token);
    const current = top(this.stack);
    current.data.alias = alias;
  }
  function exitWikiLinkTarget(token) {
    const target = this.sliceSerialize(token);
    const current = top(this.stack);
    current.value = target;
  }
  function exitWikiLink(token) {
    this.exit(token);
    const wikiLink2 = node2;
    const data = {
      slug: wikiLink2.value,
      alias: wikiLink2.data.alias,
      permalink: opts.linkResolver ? opts.linkResolver(wikiLink2.value) : void 0
    };
    wikiLink2.data = {
      // ...wikiLink.data,
      alias: data.alias,
      permalink: data.permalink,
      ...linkTemplate(data)
    };
  }
  return {
    enter: {
      wikiLink: enterWikiLink
    },
    exit: {
      wikiLinkTarget: exitWikiLinkTarget,
      wikiLinkAlias: exitWikiLinkAlias,
      wikiLink: exitWikiLink
    }
  };
}

// node_modules/@braindb/micromark-extension-wiki-link/dist/syntax.js
var codes = {
  horizontalTab: -2,
  virtualSpace: -1,
  nul: 0,
  eof: null,
  space: 32
};
function markdownLineEndingOrSpace(code2) {
  return code2 !== codes.eof && (code2 < codes.nul || code2 === codes.space);
}
function markdownLineEnding(code2) {
  return code2 !== codes.eof && (code2 === null || code2 < codes.horizontalTab);
}
function syntax(opts = {}) {
  const aliasDivider = opts.aliasDivider || "|";
  const aliasMarker = aliasDivider;
  const startMarker = "[[";
  const endMarker = "]]";
  const tokenize = (effects, ok3, nok) => {
    let data;
    let alias;
    let aliasCursor = 0;
    let startMarkerCursor = 0;
    let endMarkerCursor = 0;
    return start;
    function start(code2) {
      if (code2 !== startMarker.charCodeAt(startMarkerCursor))
        return nok(code2);
      effects.enter("wikiLink");
      effects.enter("wikiLinkMarker");
      return consumeStart(code2);
    }
    function consumeStart(code2) {
      if (startMarkerCursor === startMarker.length) {
        effects.exit("wikiLinkMarker");
        return consumeData(code2);
      }
      if (code2 !== startMarker.charCodeAt(startMarkerCursor)) {
        return nok(code2);
      }
      effects.consume(code2);
      startMarkerCursor++;
      return consumeStart;
    }
    function consumeData(code2) {
      if (markdownLineEnding(code2) || code2 === codes.eof) {
        return nok(code2);
      }
      effects.enter("wikiLinkData");
      effects.enter("wikiLinkTarget");
      return consumeTarget(code2);
    }
    function consumeTarget(code2) {
      if (code2 === aliasMarker.charCodeAt(aliasCursor)) {
        if (!data)
          return nok(code2);
        effects.exit("wikiLinkTarget");
        effects.enter("wikiLinkAliasMarker");
        return consumeAliasMarker(code2);
      }
      if (code2 === endMarker.charCodeAt(endMarkerCursor)) {
        if (!data)
          return nok(code2);
        effects.exit("wikiLinkTarget");
        effects.exit("wikiLinkData");
        effects.enter("wikiLinkMarker");
        return consumeEnd(code2);
      }
      if (markdownLineEnding(code2) || code2 === codes.eof) {
        return nok(code2);
      }
      if (!markdownLineEndingOrSpace(code2)) {
        data = true;
      }
      effects.consume(code2);
      return consumeTarget;
    }
    function consumeAliasMarker(code2) {
      if (aliasCursor === aliasMarker.length) {
        effects.exit("wikiLinkAliasMarker");
        effects.enter("wikiLinkAlias");
        return consumeAlias(code2);
      }
      if (code2 !== aliasMarker.charCodeAt(aliasCursor)) {
        return nok(code2);
      }
      effects.consume(code2);
      aliasCursor++;
      return consumeAliasMarker;
    }
    function consumeAlias(code2) {
      if (code2 === endMarker.charCodeAt(endMarkerCursor)) {
        if (!alias)
          return nok(code2);
        effects.exit("wikiLinkAlias");
        effects.exit("wikiLinkData");
        effects.enter("wikiLinkMarker");
        return consumeEnd(code2);
      }
      if (markdownLineEnding(code2) || code2 === codes.eof) {
        return nok(code2);
      }
      if (!markdownLineEndingOrSpace(code2)) {
        alias = true;
      }
      effects.consume(code2);
      return consumeAlias;
    }
    function consumeEnd(code2) {
      if (endMarkerCursor === endMarker.length) {
        effects.exit("wikiLinkMarker");
        effects.exit("wikiLink");
        return ok3(code2);
      }
      if (code2 !== endMarker.charCodeAt(endMarkerCursor)) {
        return nok(code2);
      }
      effects.consume(code2);
      endMarkerCursor++;
      return consumeEnd;
    }
  };
  return {
    text: { 91: { tokenize } }
    // left square bracket
  };
}

// node_modules/mdast-util-to-string/lib/index.js
var emptyOptions = {};
function toString(value, options2) {
  const settings = options2 || emptyOptions;
  const includeImageAlt = typeof settings.includeImageAlt === "boolean" ? settings.includeImageAlt : true;
  const includeHtml = typeof settings.includeHtml === "boolean" ? settings.includeHtml : true;
  return one(value, includeImageAlt, includeHtml);
}
function one(value, includeImageAlt, includeHtml) {
  if (node(value)) {
    if ("value" in value) {
      return value.type === "html" && !includeHtml ? "" : value.value;
    }
    if (includeImageAlt && "alt" in value && value.alt) {
      return value.alt;
    }
    if ("children" in value) {
      return all(value.children, includeImageAlt, includeHtml);
    }
  }
  if (Array.isArray(value)) {
    return all(value, includeImageAlt, includeHtml);
  }
  return "";
}
function all(values, includeImageAlt, includeHtml) {
  const result = [];
  let index2 = -1;
  while (++index2 < values.length) {
    result[index2] = one(values[index2], includeImageAlt, includeHtml);
  }
  return result.join("");
}
function node(value) {
  return Boolean(value && typeof value === "object");
}

// node_modules/character-entities/index.js
var characterEntities = {
  AElig: "\xC6",
  AMP: "&",
  Aacute: "\xC1",
  Abreve: "\u0102",
  Acirc: "\xC2",
  Acy: "\u0410",
  Afr: "\u{1D504}",
  Agrave: "\xC0",
  Alpha: "\u0391",
  Amacr: "\u0100",
  And: "\u2A53",
  Aogon: "\u0104",
  Aopf: "\u{1D538}",
  ApplyFunction: "\u2061",
  Aring: "\xC5",
  Ascr: "\u{1D49C}",
  Assign: "\u2254",
  Atilde: "\xC3",
  Auml: "\xC4",
  Backslash: "\u2216",
  Barv: "\u2AE7",
  Barwed: "\u2306",
  Bcy: "\u0411",
  Because: "\u2235",
  Bernoullis: "\u212C",
  Beta: "\u0392",
  Bfr: "\u{1D505}",
  Bopf: "\u{1D539}",
  Breve: "\u02D8",
  Bscr: "\u212C",
  Bumpeq: "\u224E",
  CHcy: "\u0427",
  COPY: "\xA9",
  Cacute: "\u0106",
  Cap: "\u22D2",
  CapitalDifferentialD: "\u2145",
  Cayleys: "\u212D",
  Ccaron: "\u010C",
  Ccedil: "\xC7",
  Ccirc: "\u0108",
  Cconint: "\u2230",
  Cdot: "\u010A",
  Cedilla: "\xB8",
  CenterDot: "\xB7",
  Cfr: "\u212D",
  Chi: "\u03A7",
  CircleDot: "\u2299",
  CircleMinus: "\u2296",
  CirclePlus: "\u2295",
  CircleTimes: "\u2297",
  ClockwiseContourIntegral: "\u2232",
  CloseCurlyDoubleQuote: "\u201D",
  CloseCurlyQuote: "\u2019",
  Colon: "\u2237",
  Colone: "\u2A74",
  Congruent: "\u2261",
  Conint: "\u222F",
  ContourIntegral: "\u222E",
  Copf: "\u2102",
  Coproduct: "\u2210",
  CounterClockwiseContourIntegral: "\u2233",
  Cross: "\u2A2F",
  Cscr: "\u{1D49E}",
  Cup: "\u22D3",
  CupCap: "\u224D",
  DD: "\u2145",
  DDotrahd: "\u2911",
  DJcy: "\u0402",
  DScy: "\u0405",
  DZcy: "\u040F",
  Dagger: "\u2021",
  Darr: "\u21A1",
  Dashv: "\u2AE4",
  Dcaron: "\u010E",
  Dcy: "\u0414",
  Del: "\u2207",
  Delta: "\u0394",
  Dfr: "\u{1D507}",
  DiacriticalAcute: "\xB4",
  DiacriticalDot: "\u02D9",
  DiacriticalDoubleAcute: "\u02DD",
  DiacriticalGrave: "`",
  DiacriticalTilde: "\u02DC",
  Diamond: "\u22C4",
  DifferentialD: "\u2146",
  Dopf: "\u{1D53B}",
  Dot: "\xA8",
  DotDot: "\u20DC",
  DotEqual: "\u2250",
  DoubleContourIntegral: "\u222F",
  DoubleDot: "\xA8",
  DoubleDownArrow: "\u21D3",
  DoubleLeftArrow: "\u21D0",
  DoubleLeftRightArrow: "\u21D4",
  DoubleLeftTee: "\u2AE4",
  DoubleLongLeftArrow: "\u27F8",
  DoubleLongLeftRightArrow: "\u27FA",
  DoubleLongRightArrow: "\u27F9",
  DoubleRightArrow: "\u21D2",
  DoubleRightTee: "\u22A8",
  DoubleUpArrow: "\u21D1",
  DoubleUpDownArrow: "\u21D5",
  DoubleVerticalBar: "\u2225",
  DownArrow: "\u2193",
  DownArrowBar: "\u2913",
  DownArrowUpArrow: "\u21F5",
  DownBreve: "\u0311",
  DownLeftRightVector: "\u2950",
  DownLeftTeeVector: "\u295E",
  DownLeftVector: "\u21BD",
  DownLeftVectorBar: "\u2956",
  DownRightTeeVector: "\u295F",
  DownRightVector: "\u21C1",
  DownRightVectorBar: "\u2957",
  DownTee: "\u22A4",
  DownTeeArrow: "\u21A7",
  Downarrow: "\u21D3",
  Dscr: "\u{1D49F}",
  Dstrok: "\u0110",
  ENG: "\u014A",
  ETH: "\xD0",
  Eacute: "\xC9",
  Ecaron: "\u011A",
  Ecirc: "\xCA",
  Ecy: "\u042D",
  Edot: "\u0116",
  Efr: "\u{1D508}",
  Egrave: "\xC8",
  Element: "\u2208",
  Emacr: "\u0112",
  EmptySmallSquare: "\u25FB",
  EmptyVerySmallSquare: "\u25AB",
  Eogon: "\u0118",
  Eopf: "\u{1D53C}",
  Epsilon: "\u0395",
  Equal: "\u2A75",
  EqualTilde: "\u2242",
  Equilibrium: "\u21CC",
  Escr: "\u2130",
  Esim: "\u2A73",
  Eta: "\u0397",
  Euml: "\xCB",
  Exists: "\u2203",
  ExponentialE: "\u2147",
  Fcy: "\u0424",
  Ffr: "\u{1D509}",
  FilledSmallSquare: "\u25FC",
  FilledVerySmallSquare: "\u25AA",
  Fopf: "\u{1D53D}",
  ForAll: "\u2200",
  Fouriertrf: "\u2131",
  Fscr: "\u2131",
  GJcy: "\u0403",
  GT: ">",
  Gamma: "\u0393",
  Gammad: "\u03DC",
  Gbreve: "\u011E",
  Gcedil: "\u0122",
  Gcirc: "\u011C",
  Gcy: "\u0413",
  Gdot: "\u0120",
  Gfr: "\u{1D50A}",
  Gg: "\u22D9",
  Gopf: "\u{1D53E}",
  GreaterEqual: "\u2265",
  GreaterEqualLess: "\u22DB",
  GreaterFullEqual: "\u2267",
  GreaterGreater: "\u2AA2",
  GreaterLess: "\u2277",
  GreaterSlantEqual: "\u2A7E",
  GreaterTilde: "\u2273",
  Gscr: "\u{1D4A2}",
  Gt: "\u226B",
  HARDcy: "\u042A",
  Hacek: "\u02C7",
  Hat: "^",
  Hcirc: "\u0124",
  Hfr: "\u210C",
  HilbertSpace: "\u210B",
  Hopf: "\u210D",
  HorizontalLine: "\u2500",
  Hscr: "\u210B",
  Hstrok: "\u0126",
  HumpDownHump: "\u224E",
  HumpEqual: "\u224F",
  IEcy: "\u0415",
  IJlig: "\u0132",
  IOcy: "\u0401",
  Iacute: "\xCD",
  Icirc: "\xCE",
  Icy: "\u0418",
  Idot: "\u0130",
  Ifr: "\u2111",
  Igrave: "\xCC",
  Im: "\u2111",
  Imacr: "\u012A",
  ImaginaryI: "\u2148",
  Implies: "\u21D2",
  Int: "\u222C",
  Integral: "\u222B",
  Intersection: "\u22C2",
  InvisibleComma: "\u2063",
  InvisibleTimes: "\u2062",
  Iogon: "\u012E",
  Iopf: "\u{1D540}",
  Iota: "\u0399",
  Iscr: "\u2110",
  Itilde: "\u0128",
  Iukcy: "\u0406",
  Iuml: "\xCF",
  Jcirc: "\u0134",
  Jcy: "\u0419",
  Jfr: "\u{1D50D}",
  Jopf: "\u{1D541}",
  Jscr: "\u{1D4A5}",
  Jsercy: "\u0408",
  Jukcy: "\u0404",
  KHcy: "\u0425",
  KJcy: "\u040C",
  Kappa: "\u039A",
  Kcedil: "\u0136",
  Kcy: "\u041A",
  Kfr: "\u{1D50E}",
  Kopf: "\u{1D542}",
  Kscr: "\u{1D4A6}",
  LJcy: "\u0409",
  LT: "<",
  Lacute: "\u0139",
  Lambda: "\u039B",
  Lang: "\u27EA",
  Laplacetrf: "\u2112",
  Larr: "\u219E",
  Lcaron: "\u013D",
  Lcedil: "\u013B",
  Lcy: "\u041B",
  LeftAngleBracket: "\u27E8",
  LeftArrow: "\u2190",
  LeftArrowBar: "\u21E4",
  LeftArrowRightArrow: "\u21C6",
  LeftCeiling: "\u2308",
  LeftDoubleBracket: "\u27E6",
  LeftDownTeeVector: "\u2961",
  LeftDownVector: "\u21C3",
  LeftDownVectorBar: "\u2959",
  LeftFloor: "\u230A",
  LeftRightArrow: "\u2194",
  LeftRightVector: "\u294E",
  LeftTee: "\u22A3",
  LeftTeeArrow: "\u21A4",
  LeftTeeVector: "\u295A",
  LeftTriangle: "\u22B2",
  LeftTriangleBar: "\u29CF",
  LeftTriangleEqual: "\u22B4",
  LeftUpDownVector: "\u2951",
  LeftUpTeeVector: "\u2960",
  LeftUpVector: "\u21BF",
  LeftUpVectorBar: "\u2958",
  LeftVector: "\u21BC",
  LeftVectorBar: "\u2952",
  Leftarrow: "\u21D0",
  Leftrightarrow: "\u21D4",
  LessEqualGreater: "\u22DA",
  LessFullEqual: "\u2266",
  LessGreater: "\u2276",
  LessLess: "\u2AA1",
  LessSlantEqual: "\u2A7D",
  LessTilde: "\u2272",
  Lfr: "\u{1D50F}",
  Ll: "\u22D8",
  Lleftarrow: "\u21DA",
  Lmidot: "\u013F",
  LongLeftArrow: "\u27F5",
  LongLeftRightArrow: "\u27F7",
  LongRightArrow: "\u27F6",
  Longleftarrow: "\u27F8",
  Longleftrightarrow: "\u27FA",
  Longrightarrow: "\u27F9",
  Lopf: "\u{1D543}",
  LowerLeftArrow: "\u2199",
  LowerRightArrow: "\u2198",
  Lscr: "\u2112",
  Lsh: "\u21B0",
  Lstrok: "\u0141",
  Lt: "\u226A",
  Map: "\u2905",
  Mcy: "\u041C",
  MediumSpace: "\u205F",
  Mellintrf: "\u2133",
  Mfr: "\u{1D510}",
  MinusPlus: "\u2213",
  Mopf: "\u{1D544}",
  Mscr: "\u2133",
  Mu: "\u039C",
  NJcy: "\u040A",
  Nacute: "\u0143",
  Ncaron: "\u0147",
  Ncedil: "\u0145",
  Ncy: "\u041D",
  NegativeMediumSpace: "\u200B",
  NegativeThickSpace: "\u200B",
  NegativeThinSpace: "\u200B",
  NegativeVeryThinSpace: "\u200B",
  NestedGreaterGreater: "\u226B",
  NestedLessLess: "\u226A",
  NewLine: "\n",
  Nfr: "\u{1D511}",
  NoBreak: "\u2060",
  NonBreakingSpace: "\xA0",
  Nopf: "\u2115",
  Not: "\u2AEC",
  NotCongruent: "\u2262",
  NotCupCap: "\u226D",
  NotDoubleVerticalBar: "\u2226",
  NotElement: "\u2209",
  NotEqual: "\u2260",
  NotEqualTilde: "\u2242\u0338",
  NotExists: "\u2204",
  NotGreater: "\u226F",
  NotGreaterEqual: "\u2271",
  NotGreaterFullEqual: "\u2267\u0338",
  NotGreaterGreater: "\u226B\u0338",
  NotGreaterLess: "\u2279",
  NotGreaterSlantEqual: "\u2A7E\u0338",
  NotGreaterTilde: "\u2275",
  NotHumpDownHump: "\u224E\u0338",
  NotHumpEqual: "\u224F\u0338",
  NotLeftTriangle: "\u22EA",
  NotLeftTriangleBar: "\u29CF\u0338",
  NotLeftTriangleEqual: "\u22EC",
  NotLess: "\u226E",
  NotLessEqual: "\u2270",
  NotLessGreater: "\u2278",
  NotLessLess: "\u226A\u0338",
  NotLessSlantEqual: "\u2A7D\u0338",
  NotLessTilde: "\u2274",
  NotNestedGreaterGreater: "\u2AA2\u0338",
  NotNestedLessLess: "\u2AA1\u0338",
  NotPrecedes: "\u2280",
  NotPrecedesEqual: "\u2AAF\u0338",
  NotPrecedesSlantEqual: "\u22E0",
  NotReverseElement: "\u220C",
  NotRightTriangle: "\u22EB",
  NotRightTriangleBar: "\u29D0\u0338",
  NotRightTriangleEqual: "\u22ED",
  NotSquareSubset: "\u228F\u0338",
  NotSquareSubsetEqual: "\u22E2",
  NotSquareSuperset: "\u2290\u0338",
  NotSquareSupersetEqual: "\u22E3",
  NotSubset: "\u2282\u20D2",
  NotSubsetEqual: "\u2288",
  NotSucceeds: "\u2281",
  NotSucceedsEqual: "\u2AB0\u0338",
  NotSucceedsSlantEqual: "\u22E1",
  NotSucceedsTilde: "\u227F\u0338",
  NotSuperset: "\u2283\u20D2",
  NotSupersetEqual: "\u2289",
  NotTilde: "\u2241",
  NotTildeEqual: "\u2244",
  NotTildeFullEqual: "\u2247",
  NotTildeTilde: "\u2249",
  NotVerticalBar: "\u2224",
  Nscr: "\u{1D4A9}",
  Ntilde: "\xD1",
  Nu: "\u039D",
  OElig: "\u0152",
  Oacute: "\xD3",
  Ocirc: "\xD4",
  Ocy: "\u041E",
  Odblac: "\u0150",
  Ofr: "\u{1D512}",
  Ograve: "\xD2",
  Omacr: "\u014C",
  Omega: "\u03A9",
  Omicron: "\u039F",
  Oopf: "\u{1D546}",
  OpenCurlyDoubleQuote: "\u201C",
  OpenCurlyQuote: "\u2018",
  Or: "\u2A54",
  Oscr: "\u{1D4AA}",
  Oslash: "\xD8",
  Otilde: "\xD5",
  Otimes: "\u2A37",
  Ouml: "\xD6",
  OverBar: "\u203E",
  OverBrace: "\u23DE",
  OverBracket: "\u23B4",
  OverParenthesis: "\u23DC",
  PartialD: "\u2202",
  Pcy: "\u041F",
  Pfr: "\u{1D513}",
  Phi: "\u03A6",
  Pi: "\u03A0",
  PlusMinus: "\xB1",
  Poincareplane: "\u210C",
  Popf: "\u2119",
  Pr: "\u2ABB",
  Precedes: "\u227A",
  PrecedesEqual: "\u2AAF",
  PrecedesSlantEqual: "\u227C",
  PrecedesTilde: "\u227E",
  Prime: "\u2033",
  Product: "\u220F",
  Proportion: "\u2237",
  Proportional: "\u221D",
  Pscr: "\u{1D4AB}",
  Psi: "\u03A8",
  QUOT: '"',
  Qfr: "\u{1D514}",
  Qopf: "\u211A",
  Qscr: "\u{1D4AC}",
  RBarr: "\u2910",
  REG: "\xAE",
  Racute: "\u0154",
  Rang: "\u27EB",
  Rarr: "\u21A0",
  Rarrtl: "\u2916",
  Rcaron: "\u0158",
  Rcedil: "\u0156",
  Rcy: "\u0420",
  Re: "\u211C",
  ReverseElement: "\u220B",
  ReverseEquilibrium: "\u21CB",
  ReverseUpEquilibrium: "\u296F",
  Rfr: "\u211C",
  Rho: "\u03A1",
  RightAngleBracket: "\u27E9",
  RightArrow: "\u2192",
  RightArrowBar: "\u21E5",
  RightArrowLeftArrow: "\u21C4",
  RightCeiling: "\u2309",
  RightDoubleBracket: "\u27E7",
  RightDownTeeVector: "\u295D",
  RightDownVector: "\u21C2",
  RightDownVectorBar: "\u2955",
  RightFloor: "\u230B",
  RightTee: "\u22A2",
  RightTeeArrow: "\u21A6",
  RightTeeVector: "\u295B",
  RightTriangle: "\u22B3",
  RightTriangleBar: "\u29D0",
  RightTriangleEqual: "\u22B5",
  RightUpDownVector: "\u294F",
  RightUpTeeVector: "\u295C",
  RightUpVector: "\u21BE",
  RightUpVectorBar: "\u2954",
  RightVector: "\u21C0",
  RightVectorBar: "\u2953",
  Rightarrow: "\u21D2",
  Ropf: "\u211D",
  RoundImplies: "\u2970",
  Rrightarrow: "\u21DB",
  Rscr: "\u211B",
  Rsh: "\u21B1",
  RuleDelayed: "\u29F4",
  SHCHcy: "\u0429",
  SHcy: "\u0428",
  SOFTcy: "\u042C",
  Sacute: "\u015A",
  Sc: "\u2ABC",
  Scaron: "\u0160",
  Scedil: "\u015E",
  Scirc: "\u015C",
  Scy: "\u0421",
  Sfr: "\u{1D516}",
  ShortDownArrow: "\u2193",
  ShortLeftArrow: "\u2190",
  ShortRightArrow: "\u2192",
  ShortUpArrow: "\u2191",
  Sigma: "\u03A3",
  SmallCircle: "\u2218",
  Sopf: "\u{1D54A}",
  Sqrt: "\u221A",
  Square: "\u25A1",
  SquareIntersection: "\u2293",
  SquareSubset: "\u228F",
  SquareSubsetEqual: "\u2291",
  SquareSuperset: "\u2290",
  SquareSupersetEqual: "\u2292",
  SquareUnion: "\u2294",
  Sscr: "\u{1D4AE}",
  Star: "\u22C6",
  Sub: "\u22D0",
  Subset: "\u22D0",
  SubsetEqual: "\u2286",
  Succeeds: "\u227B",
  SucceedsEqual: "\u2AB0",
  SucceedsSlantEqual: "\u227D",
  SucceedsTilde: "\u227F",
  SuchThat: "\u220B",
  Sum: "\u2211",
  Sup: "\u22D1",
  Superset: "\u2283",
  SupersetEqual: "\u2287",
  Supset: "\u22D1",
  THORN: "\xDE",
  TRADE: "\u2122",
  TSHcy: "\u040B",
  TScy: "\u0426",
  Tab: "	",
  Tau: "\u03A4",
  Tcaron: "\u0164",
  Tcedil: "\u0162",
  Tcy: "\u0422",
  Tfr: "\u{1D517}",
  Therefore: "\u2234",
  Theta: "\u0398",
  ThickSpace: "\u205F\u200A",
  ThinSpace: "\u2009",
  Tilde: "\u223C",
  TildeEqual: "\u2243",
  TildeFullEqual: "\u2245",
  TildeTilde: "\u2248",
  Topf: "\u{1D54B}",
  TripleDot: "\u20DB",
  Tscr: "\u{1D4AF}",
  Tstrok: "\u0166",
  Uacute: "\xDA",
  Uarr: "\u219F",
  Uarrocir: "\u2949",
  Ubrcy: "\u040E",
  Ubreve: "\u016C",
  Ucirc: "\xDB",
  Ucy: "\u0423",
  Udblac: "\u0170",
  Ufr: "\u{1D518}",
  Ugrave: "\xD9",
  Umacr: "\u016A",
  UnderBar: "_",
  UnderBrace: "\u23DF",
  UnderBracket: "\u23B5",
  UnderParenthesis: "\u23DD",
  Union: "\u22C3",
  UnionPlus: "\u228E",
  Uogon: "\u0172",
  Uopf: "\u{1D54C}",
  UpArrow: "\u2191",
  UpArrowBar: "\u2912",
  UpArrowDownArrow: "\u21C5",
  UpDownArrow: "\u2195",
  UpEquilibrium: "\u296E",
  UpTee: "\u22A5",
  UpTeeArrow: "\u21A5",
  Uparrow: "\u21D1",
  Updownarrow: "\u21D5",
  UpperLeftArrow: "\u2196",
  UpperRightArrow: "\u2197",
  Upsi: "\u03D2",
  Upsilon: "\u03A5",
  Uring: "\u016E",
  Uscr: "\u{1D4B0}",
  Utilde: "\u0168",
  Uuml: "\xDC",
  VDash: "\u22AB",
  Vbar: "\u2AEB",
  Vcy: "\u0412",
  Vdash: "\u22A9",
  Vdashl: "\u2AE6",
  Vee: "\u22C1",
  Verbar: "\u2016",
  Vert: "\u2016",
  VerticalBar: "\u2223",
  VerticalLine: "|",
  VerticalSeparator: "\u2758",
  VerticalTilde: "\u2240",
  VeryThinSpace: "\u200A",
  Vfr: "\u{1D519}",
  Vopf: "\u{1D54D}",
  Vscr: "\u{1D4B1}",
  Vvdash: "\u22AA",
  Wcirc: "\u0174",
  Wedge: "\u22C0",
  Wfr: "\u{1D51A}",
  Wopf: "\u{1D54E}",
  Wscr: "\u{1D4B2}",
  Xfr: "\u{1D51B}",
  Xi: "\u039E",
  Xopf: "\u{1D54F}",
  Xscr: "\u{1D4B3}",
  YAcy: "\u042F",
  YIcy: "\u0407",
  YUcy: "\u042E",
  Yacute: "\xDD",
  Ycirc: "\u0176",
  Ycy: "\u042B",
  Yfr: "\u{1D51C}",
  Yopf: "\u{1D550}",
  Yscr: "\u{1D4B4}",
  Yuml: "\u0178",
  ZHcy: "\u0416",
  Zacute: "\u0179",
  Zcaron: "\u017D",
  Zcy: "\u0417",
  Zdot: "\u017B",
  ZeroWidthSpace: "\u200B",
  Zeta: "\u0396",
  Zfr: "\u2128",
  Zopf: "\u2124",
  Zscr: "\u{1D4B5}",
  aacute: "\xE1",
  abreve: "\u0103",
  ac: "\u223E",
  acE: "\u223E\u0333",
  acd: "\u223F",
  acirc: "\xE2",
  acute: "\xB4",
  acy: "\u0430",
  aelig: "\xE6",
  af: "\u2061",
  afr: "\u{1D51E}",
  agrave: "\xE0",
  alefsym: "\u2135",
  aleph: "\u2135",
  alpha: "\u03B1",
  amacr: "\u0101",
  amalg: "\u2A3F",
  amp: "&",
  and: "\u2227",
  andand: "\u2A55",
  andd: "\u2A5C",
  andslope: "\u2A58",
  andv: "\u2A5A",
  ang: "\u2220",
  ange: "\u29A4",
  angle: "\u2220",
  angmsd: "\u2221",
  angmsdaa: "\u29A8",
  angmsdab: "\u29A9",
  angmsdac: "\u29AA",
  angmsdad: "\u29AB",
  angmsdae: "\u29AC",
  angmsdaf: "\u29AD",
  angmsdag: "\u29AE",
  angmsdah: "\u29AF",
  angrt: "\u221F",
  angrtvb: "\u22BE",
  angrtvbd: "\u299D",
  angsph: "\u2222",
  angst: "\xC5",
  angzarr: "\u237C",
  aogon: "\u0105",
  aopf: "\u{1D552}",
  ap: "\u2248",
  apE: "\u2A70",
  apacir: "\u2A6F",
  ape: "\u224A",
  apid: "\u224B",
  apos: "'",
  approx: "\u2248",
  approxeq: "\u224A",
  aring: "\xE5",
  ascr: "\u{1D4B6}",
  ast: "*",
  asymp: "\u2248",
  asympeq: "\u224D",
  atilde: "\xE3",
  auml: "\xE4",
  awconint: "\u2233",
  awint: "\u2A11",
  bNot: "\u2AED",
  backcong: "\u224C",
  backepsilon: "\u03F6",
  backprime: "\u2035",
  backsim: "\u223D",
  backsimeq: "\u22CD",
  barvee: "\u22BD",
  barwed: "\u2305",
  barwedge: "\u2305",
  bbrk: "\u23B5",
  bbrktbrk: "\u23B6",
  bcong: "\u224C",
  bcy: "\u0431",
  bdquo: "\u201E",
  becaus: "\u2235",
  because: "\u2235",
  bemptyv: "\u29B0",
  bepsi: "\u03F6",
  bernou: "\u212C",
  beta: "\u03B2",
  beth: "\u2136",
  between: "\u226C",
  bfr: "\u{1D51F}",
  bigcap: "\u22C2",
  bigcirc: "\u25EF",
  bigcup: "\u22C3",
  bigodot: "\u2A00",
  bigoplus: "\u2A01",
  bigotimes: "\u2A02",
  bigsqcup: "\u2A06",
  bigstar: "\u2605",
  bigtriangledown: "\u25BD",
  bigtriangleup: "\u25B3",
  biguplus: "\u2A04",
  bigvee: "\u22C1",
  bigwedge: "\u22C0",
  bkarow: "\u290D",
  blacklozenge: "\u29EB",
  blacksquare: "\u25AA",
  blacktriangle: "\u25B4",
  blacktriangledown: "\u25BE",
  blacktriangleleft: "\u25C2",
  blacktriangleright: "\u25B8",
  blank: "\u2423",
  blk12: "\u2592",
  blk14: "\u2591",
  blk34: "\u2593",
  block: "\u2588",
  bne: "=\u20E5",
  bnequiv: "\u2261\u20E5",
  bnot: "\u2310",
  bopf: "\u{1D553}",
  bot: "\u22A5",
  bottom: "\u22A5",
  bowtie: "\u22C8",
  boxDL: "\u2557",
  boxDR: "\u2554",
  boxDl: "\u2556",
  boxDr: "\u2553",
  boxH: "\u2550",
  boxHD: "\u2566",
  boxHU: "\u2569",
  boxHd: "\u2564",
  boxHu: "\u2567",
  boxUL: "\u255D",
  boxUR: "\u255A",
  boxUl: "\u255C",
  boxUr: "\u2559",
  boxV: "\u2551",
  boxVH: "\u256C",
  boxVL: "\u2563",
  boxVR: "\u2560",
  boxVh: "\u256B",
  boxVl: "\u2562",
  boxVr: "\u255F",
  boxbox: "\u29C9",
  boxdL: "\u2555",
  boxdR: "\u2552",
  boxdl: "\u2510",
  boxdr: "\u250C",
  boxh: "\u2500",
  boxhD: "\u2565",
  boxhU: "\u2568",
  boxhd: "\u252C",
  boxhu: "\u2534",
  boxminus: "\u229F",
  boxplus: "\u229E",
  boxtimes: "\u22A0",
  boxuL: "\u255B",
  boxuR: "\u2558",
  boxul: "\u2518",
  boxur: "\u2514",
  boxv: "\u2502",
  boxvH: "\u256A",
  boxvL: "\u2561",
  boxvR: "\u255E",
  boxvh: "\u253C",
  boxvl: "\u2524",
  boxvr: "\u251C",
  bprime: "\u2035",
  breve: "\u02D8",
  brvbar: "\xA6",
  bscr: "\u{1D4B7}",
  bsemi: "\u204F",
  bsim: "\u223D",
  bsime: "\u22CD",
  bsol: "\\",
  bsolb: "\u29C5",
  bsolhsub: "\u27C8",
  bull: "\u2022",
  bullet: "\u2022",
  bump: "\u224E",
  bumpE: "\u2AAE",
  bumpe: "\u224F",
  bumpeq: "\u224F",
  cacute: "\u0107",
  cap: "\u2229",
  capand: "\u2A44",
  capbrcup: "\u2A49",
  capcap: "\u2A4B",
  capcup: "\u2A47",
  capdot: "\u2A40",
  caps: "\u2229\uFE00",
  caret: "\u2041",
  caron: "\u02C7",
  ccaps: "\u2A4D",
  ccaron: "\u010D",
  ccedil: "\xE7",
  ccirc: "\u0109",
  ccups: "\u2A4C",
  ccupssm: "\u2A50",
  cdot: "\u010B",
  cedil: "\xB8",
  cemptyv: "\u29B2",
  cent: "\xA2",
  centerdot: "\xB7",
  cfr: "\u{1D520}",
  chcy: "\u0447",
  check: "\u2713",
  checkmark: "\u2713",
  chi: "\u03C7",
  cir: "\u25CB",
  cirE: "\u29C3",
  circ: "\u02C6",
  circeq: "\u2257",
  circlearrowleft: "\u21BA",
  circlearrowright: "\u21BB",
  circledR: "\xAE",
  circledS: "\u24C8",
  circledast: "\u229B",
  circledcirc: "\u229A",
  circleddash: "\u229D",
  cire: "\u2257",
  cirfnint: "\u2A10",
  cirmid: "\u2AEF",
  cirscir: "\u29C2",
  clubs: "\u2663",
  clubsuit: "\u2663",
  colon: ":",
  colone: "\u2254",
  coloneq: "\u2254",
  comma: ",",
  commat: "@",
  comp: "\u2201",
  compfn: "\u2218",
  complement: "\u2201",
  complexes: "\u2102",
  cong: "\u2245",
  congdot: "\u2A6D",
  conint: "\u222E",
  copf: "\u{1D554}",
  coprod: "\u2210",
  copy: "\xA9",
  copysr: "\u2117",
  crarr: "\u21B5",
  cross: "\u2717",
  cscr: "\u{1D4B8}",
  csub: "\u2ACF",
  csube: "\u2AD1",
  csup: "\u2AD0",
  csupe: "\u2AD2",
  ctdot: "\u22EF",
  cudarrl: "\u2938",
  cudarrr: "\u2935",
  cuepr: "\u22DE",
  cuesc: "\u22DF",
  cularr: "\u21B6",
  cularrp: "\u293D",
  cup: "\u222A",
  cupbrcap: "\u2A48",
  cupcap: "\u2A46",
  cupcup: "\u2A4A",
  cupdot: "\u228D",
  cupor: "\u2A45",
  cups: "\u222A\uFE00",
  curarr: "\u21B7",
  curarrm: "\u293C",
  curlyeqprec: "\u22DE",
  curlyeqsucc: "\u22DF",
  curlyvee: "\u22CE",
  curlywedge: "\u22CF",
  curren: "\xA4",
  curvearrowleft: "\u21B6",
  curvearrowright: "\u21B7",
  cuvee: "\u22CE",
  cuwed: "\u22CF",
  cwconint: "\u2232",
  cwint: "\u2231",
  cylcty: "\u232D",
  dArr: "\u21D3",
  dHar: "\u2965",
  dagger: "\u2020",
  daleth: "\u2138",
  darr: "\u2193",
  dash: "\u2010",
  dashv: "\u22A3",
  dbkarow: "\u290F",
  dblac: "\u02DD",
  dcaron: "\u010F",
  dcy: "\u0434",
  dd: "\u2146",
  ddagger: "\u2021",
  ddarr: "\u21CA",
  ddotseq: "\u2A77",
  deg: "\xB0",
  delta: "\u03B4",
  demptyv: "\u29B1",
  dfisht: "\u297F",
  dfr: "\u{1D521}",
  dharl: "\u21C3",
  dharr: "\u21C2",
  diam: "\u22C4",
  diamond: "\u22C4",
  diamondsuit: "\u2666",
  diams: "\u2666",
  die: "\xA8",
  digamma: "\u03DD",
  disin: "\u22F2",
  div: "\xF7",
  divide: "\xF7",
  divideontimes: "\u22C7",
  divonx: "\u22C7",
  djcy: "\u0452",
  dlcorn: "\u231E",
  dlcrop: "\u230D",
  dollar: "$",
  dopf: "\u{1D555}",
  dot: "\u02D9",
  doteq: "\u2250",
  doteqdot: "\u2251",
  dotminus: "\u2238",
  dotplus: "\u2214",
  dotsquare: "\u22A1",
  doublebarwedge: "\u2306",
  downarrow: "\u2193",
  downdownarrows: "\u21CA",
  downharpoonleft: "\u21C3",
  downharpoonright: "\u21C2",
  drbkarow: "\u2910",
  drcorn: "\u231F",
  drcrop: "\u230C",
  dscr: "\u{1D4B9}",
  dscy: "\u0455",
  dsol: "\u29F6",
  dstrok: "\u0111",
  dtdot: "\u22F1",
  dtri: "\u25BF",
  dtrif: "\u25BE",
  duarr: "\u21F5",
  duhar: "\u296F",
  dwangle: "\u29A6",
  dzcy: "\u045F",
  dzigrarr: "\u27FF",
  eDDot: "\u2A77",
  eDot: "\u2251",
  eacute: "\xE9",
  easter: "\u2A6E",
  ecaron: "\u011B",
  ecir: "\u2256",
  ecirc: "\xEA",
  ecolon: "\u2255",
  ecy: "\u044D",
  edot: "\u0117",
  ee: "\u2147",
  efDot: "\u2252",
  efr: "\u{1D522}",
  eg: "\u2A9A",
  egrave: "\xE8",
  egs: "\u2A96",
  egsdot: "\u2A98",
  el: "\u2A99",
  elinters: "\u23E7",
  ell: "\u2113",
  els: "\u2A95",
  elsdot: "\u2A97",
  emacr: "\u0113",
  empty: "\u2205",
  emptyset: "\u2205",
  emptyv: "\u2205",
  emsp13: "\u2004",
  emsp14: "\u2005",
  emsp: "\u2003",
  eng: "\u014B",
  ensp: "\u2002",
  eogon: "\u0119",
  eopf: "\u{1D556}",
  epar: "\u22D5",
  eparsl: "\u29E3",
  eplus: "\u2A71",
  epsi: "\u03B5",
  epsilon: "\u03B5",
  epsiv: "\u03F5",
  eqcirc: "\u2256",
  eqcolon: "\u2255",
  eqsim: "\u2242",
  eqslantgtr: "\u2A96",
  eqslantless: "\u2A95",
  equals: "=",
  equest: "\u225F",
  equiv: "\u2261",
  equivDD: "\u2A78",
  eqvparsl: "\u29E5",
  erDot: "\u2253",
  erarr: "\u2971",
  escr: "\u212F",
  esdot: "\u2250",
  esim: "\u2242",
  eta: "\u03B7",
  eth: "\xF0",
  euml: "\xEB",
  euro: "\u20AC",
  excl: "!",
  exist: "\u2203",
  expectation: "\u2130",
  exponentiale: "\u2147",
  fallingdotseq: "\u2252",
  fcy: "\u0444",
  female: "\u2640",
  ffilig: "\uFB03",
  fflig: "\uFB00",
  ffllig: "\uFB04",
  ffr: "\u{1D523}",
  filig: "\uFB01",
  fjlig: "fj",
  flat: "\u266D",
  fllig: "\uFB02",
  fltns: "\u25B1",
  fnof: "\u0192",
  fopf: "\u{1D557}",
  forall: "\u2200",
  fork: "\u22D4",
  forkv: "\u2AD9",
  fpartint: "\u2A0D",
  frac12: "\xBD",
  frac13: "\u2153",
  frac14: "\xBC",
  frac15: "\u2155",
  frac16: "\u2159",
  frac18: "\u215B",
  frac23: "\u2154",
  frac25: "\u2156",
  frac34: "\xBE",
  frac35: "\u2157",
  frac38: "\u215C",
  frac45: "\u2158",
  frac56: "\u215A",
  frac58: "\u215D",
  frac78: "\u215E",
  frasl: "\u2044",
  frown: "\u2322",
  fscr: "\u{1D4BB}",
  gE: "\u2267",
  gEl: "\u2A8C",
  gacute: "\u01F5",
  gamma: "\u03B3",
  gammad: "\u03DD",
  gap: "\u2A86",
  gbreve: "\u011F",
  gcirc: "\u011D",
  gcy: "\u0433",
  gdot: "\u0121",
  ge: "\u2265",
  gel: "\u22DB",
  geq: "\u2265",
  geqq: "\u2267",
  geqslant: "\u2A7E",
  ges: "\u2A7E",
  gescc: "\u2AA9",
  gesdot: "\u2A80",
  gesdoto: "\u2A82",
  gesdotol: "\u2A84",
  gesl: "\u22DB\uFE00",
  gesles: "\u2A94",
  gfr: "\u{1D524}",
  gg: "\u226B",
  ggg: "\u22D9",
  gimel: "\u2137",
  gjcy: "\u0453",
  gl: "\u2277",
  glE: "\u2A92",
  gla: "\u2AA5",
  glj: "\u2AA4",
  gnE: "\u2269",
  gnap: "\u2A8A",
  gnapprox: "\u2A8A",
  gne: "\u2A88",
  gneq: "\u2A88",
  gneqq: "\u2269",
  gnsim: "\u22E7",
  gopf: "\u{1D558}",
  grave: "`",
  gscr: "\u210A",
  gsim: "\u2273",
  gsime: "\u2A8E",
  gsiml: "\u2A90",
  gt: ">",
  gtcc: "\u2AA7",
  gtcir: "\u2A7A",
  gtdot: "\u22D7",
  gtlPar: "\u2995",
  gtquest: "\u2A7C",
  gtrapprox: "\u2A86",
  gtrarr: "\u2978",
  gtrdot: "\u22D7",
  gtreqless: "\u22DB",
  gtreqqless: "\u2A8C",
  gtrless: "\u2277",
  gtrsim: "\u2273",
  gvertneqq: "\u2269\uFE00",
  gvnE: "\u2269\uFE00",
  hArr: "\u21D4",
  hairsp: "\u200A",
  half: "\xBD",
  hamilt: "\u210B",
  hardcy: "\u044A",
  harr: "\u2194",
  harrcir: "\u2948",
  harrw: "\u21AD",
  hbar: "\u210F",
  hcirc: "\u0125",
  hearts: "\u2665",
  heartsuit: "\u2665",
  hellip: "\u2026",
  hercon: "\u22B9",
  hfr: "\u{1D525}",
  hksearow: "\u2925",
  hkswarow: "\u2926",
  hoarr: "\u21FF",
  homtht: "\u223B",
  hookleftarrow: "\u21A9",
  hookrightarrow: "\u21AA",
  hopf: "\u{1D559}",
  horbar: "\u2015",
  hscr: "\u{1D4BD}",
  hslash: "\u210F",
  hstrok: "\u0127",
  hybull: "\u2043",
  hyphen: "\u2010",
  iacute: "\xED",
  ic: "\u2063",
  icirc: "\xEE",
  icy: "\u0438",
  iecy: "\u0435",
  iexcl: "\xA1",
  iff: "\u21D4",
  ifr: "\u{1D526}",
  igrave: "\xEC",
  ii: "\u2148",
  iiiint: "\u2A0C",
  iiint: "\u222D",
  iinfin: "\u29DC",
  iiota: "\u2129",
  ijlig: "\u0133",
  imacr: "\u012B",
  image: "\u2111",
  imagline: "\u2110",
  imagpart: "\u2111",
  imath: "\u0131",
  imof: "\u22B7",
  imped: "\u01B5",
  in: "\u2208",
  incare: "\u2105",
  infin: "\u221E",
  infintie: "\u29DD",
  inodot: "\u0131",
  int: "\u222B",
  intcal: "\u22BA",
  integers: "\u2124",
  intercal: "\u22BA",
  intlarhk: "\u2A17",
  intprod: "\u2A3C",
  iocy: "\u0451",
  iogon: "\u012F",
  iopf: "\u{1D55A}",
  iota: "\u03B9",
  iprod: "\u2A3C",
  iquest: "\xBF",
  iscr: "\u{1D4BE}",
  isin: "\u2208",
  isinE: "\u22F9",
  isindot: "\u22F5",
  isins: "\u22F4",
  isinsv: "\u22F3",
  isinv: "\u2208",
  it: "\u2062",
  itilde: "\u0129",
  iukcy: "\u0456",
  iuml: "\xEF",
  jcirc: "\u0135",
  jcy: "\u0439",
  jfr: "\u{1D527}",
  jmath: "\u0237",
  jopf: "\u{1D55B}",
  jscr: "\u{1D4BF}",
  jsercy: "\u0458",
  jukcy: "\u0454",
  kappa: "\u03BA",
  kappav: "\u03F0",
  kcedil: "\u0137",
  kcy: "\u043A",
  kfr: "\u{1D528}",
  kgreen: "\u0138",
  khcy: "\u0445",
  kjcy: "\u045C",
  kopf: "\u{1D55C}",
  kscr: "\u{1D4C0}",
  lAarr: "\u21DA",
  lArr: "\u21D0",
  lAtail: "\u291B",
  lBarr: "\u290E",
  lE: "\u2266",
  lEg: "\u2A8B",
  lHar: "\u2962",
  lacute: "\u013A",
  laemptyv: "\u29B4",
  lagran: "\u2112",
  lambda: "\u03BB",
  lang: "\u27E8",
  langd: "\u2991",
  langle: "\u27E8",
  lap: "\u2A85",
  laquo: "\xAB",
  larr: "\u2190",
  larrb: "\u21E4",
  larrbfs: "\u291F",
  larrfs: "\u291D",
  larrhk: "\u21A9",
  larrlp: "\u21AB",
  larrpl: "\u2939",
  larrsim: "\u2973",
  larrtl: "\u21A2",
  lat: "\u2AAB",
  latail: "\u2919",
  late: "\u2AAD",
  lates: "\u2AAD\uFE00",
  lbarr: "\u290C",
  lbbrk: "\u2772",
  lbrace: "{",
  lbrack: "[",
  lbrke: "\u298B",
  lbrksld: "\u298F",
  lbrkslu: "\u298D",
  lcaron: "\u013E",
  lcedil: "\u013C",
  lceil: "\u2308",
  lcub: "{",
  lcy: "\u043B",
  ldca: "\u2936",
  ldquo: "\u201C",
  ldquor: "\u201E",
  ldrdhar: "\u2967",
  ldrushar: "\u294B",
  ldsh: "\u21B2",
  le: "\u2264",
  leftarrow: "\u2190",
  leftarrowtail: "\u21A2",
  leftharpoondown: "\u21BD",
  leftharpoonup: "\u21BC",
  leftleftarrows: "\u21C7",
  leftrightarrow: "\u2194",
  leftrightarrows: "\u21C6",
  leftrightharpoons: "\u21CB",
  leftrightsquigarrow: "\u21AD",
  leftthreetimes: "\u22CB",
  leg: "\u22DA",
  leq: "\u2264",
  leqq: "\u2266",
  leqslant: "\u2A7D",
  les: "\u2A7D",
  lescc: "\u2AA8",
  lesdot: "\u2A7F",
  lesdoto: "\u2A81",
  lesdotor: "\u2A83",
  lesg: "\u22DA\uFE00",
  lesges: "\u2A93",
  lessapprox: "\u2A85",
  lessdot: "\u22D6",
  lesseqgtr: "\u22DA",
  lesseqqgtr: "\u2A8B",
  lessgtr: "\u2276",
  lesssim: "\u2272",
  lfisht: "\u297C",
  lfloor: "\u230A",
  lfr: "\u{1D529}",
  lg: "\u2276",
  lgE: "\u2A91",
  lhard: "\u21BD",
  lharu: "\u21BC",
  lharul: "\u296A",
  lhblk: "\u2584",
  ljcy: "\u0459",
  ll: "\u226A",
  llarr: "\u21C7",
  llcorner: "\u231E",
  llhard: "\u296B",
  lltri: "\u25FA",
  lmidot: "\u0140",
  lmoust: "\u23B0",
  lmoustache: "\u23B0",
  lnE: "\u2268",
  lnap: "\u2A89",
  lnapprox: "\u2A89",
  lne: "\u2A87",
  lneq: "\u2A87",
  lneqq: "\u2268",
  lnsim: "\u22E6",
  loang: "\u27EC",
  loarr: "\u21FD",
  lobrk: "\u27E6",
  longleftarrow: "\u27F5",
  longleftrightarrow: "\u27F7",
  longmapsto: "\u27FC",
  longrightarrow: "\u27F6",
  looparrowleft: "\u21AB",
  looparrowright: "\u21AC",
  lopar: "\u2985",
  lopf: "\u{1D55D}",
  loplus: "\u2A2D",
  lotimes: "\u2A34",
  lowast: "\u2217",
  lowbar: "_",
  loz: "\u25CA",
  lozenge: "\u25CA",
  lozf: "\u29EB",
  lpar: "(",
  lparlt: "\u2993",
  lrarr: "\u21C6",
  lrcorner: "\u231F",
  lrhar: "\u21CB",
  lrhard: "\u296D",
  lrm: "\u200E",
  lrtri: "\u22BF",
  lsaquo: "\u2039",
  lscr: "\u{1D4C1}",
  lsh: "\u21B0",
  lsim: "\u2272",
  lsime: "\u2A8D",
  lsimg: "\u2A8F",
  lsqb: "[",
  lsquo: "\u2018",
  lsquor: "\u201A",
  lstrok: "\u0142",
  lt: "<",
  ltcc: "\u2AA6",
  ltcir: "\u2A79",
  ltdot: "\u22D6",
  lthree: "\u22CB",
  ltimes: "\u22C9",
  ltlarr: "\u2976",
  ltquest: "\u2A7B",
  ltrPar: "\u2996",
  ltri: "\u25C3",
  ltrie: "\u22B4",
  ltrif: "\u25C2",
  lurdshar: "\u294A",
  luruhar: "\u2966",
  lvertneqq: "\u2268\uFE00",
  lvnE: "\u2268\uFE00",
  mDDot: "\u223A",
  macr: "\xAF",
  male: "\u2642",
  malt: "\u2720",
  maltese: "\u2720",
  map: "\u21A6",
  mapsto: "\u21A6",
  mapstodown: "\u21A7",
  mapstoleft: "\u21A4",
  mapstoup: "\u21A5",
  marker: "\u25AE",
  mcomma: "\u2A29",
  mcy: "\u043C",
  mdash: "\u2014",
  measuredangle: "\u2221",
  mfr: "\u{1D52A}",
  mho: "\u2127",
  micro: "\xB5",
  mid: "\u2223",
  midast: "*",
  midcir: "\u2AF0",
  middot: "\xB7",
  minus: "\u2212",
  minusb: "\u229F",
  minusd: "\u2238",
  minusdu: "\u2A2A",
  mlcp: "\u2ADB",
  mldr: "\u2026",
  mnplus: "\u2213",
  models: "\u22A7",
  mopf: "\u{1D55E}",
  mp: "\u2213",
  mscr: "\u{1D4C2}",
  mstpos: "\u223E",
  mu: "\u03BC",
  multimap: "\u22B8",
  mumap: "\u22B8",
  nGg: "\u22D9\u0338",
  nGt: "\u226B\u20D2",
  nGtv: "\u226B\u0338",
  nLeftarrow: "\u21CD",
  nLeftrightarrow: "\u21CE",
  nLl: "\u22D8\u0338",
  nLt: "\u226A\u20D2",
  nLtv: "\u226A\u0338",
  nRightarrow: "\u21CF",
  nVDash: "\u22AF",
  nVdash: "\u22AE",
  nabla: "\u2207",
  nacute: "\u0144",
  nang: "\u2220\u20D2",
  nap: "\u2249",
  napE: "\u2A70\u0338",
  napid: "\u224B\u0338",
  napos: "\u0149",
  napprox: "\u2249",
  natur: "\u266E",
  natural: "\u266E",
  naturals: "\u2115",
  nbsp: "\xA0",
  nbump: "\u224E\u0338",
  nbumpe: "\u224F\u0338",
  ncap: "\u2A43",
  ncaron: "\u0148",
  ncedil: "\u0146",
  ncong: "\u2247",
  ncongdot: "\u2A6D\u0338",
  ncup: "\u2A42",
  ncy: "\u043D",
  ndash: "\u2013",
  ne: "\u2260",
  neArr: "\u21D7",
  nearhk: "\u2924",
  nearr: "\u2197",
  nearrow: "\u2197",
  nedot: "\u2250\u0338",
  nequiv: "\u2262",
  nesear: "\u2928",
  nesim: "\u2242\u0338",
  nexist: "\u2204",
  nexists: "\u2204",
  nfr: "\u{1D52B}",
  ngE: "\u2267\u0338",
  nge: "\u2271",
  ngeq: "\u2271",
  ngeqq: "\u2267\u0338",
  ngeqslant: "\u2A7E\u0338",
  nges: "\u2A7E\u0338",
  ngsim: "\u2275",
  ngt: "\u226F",
  ngtr: "\u226F",
  nhArr: "\u21CE",
  nharr: "\u21AE",
  nhpar: "\u2AF2",
  ni: "\u220B",
  nis: "\u22FC",
  nisd: "\u22FA",
  niv: "\u220B",
  njcy: "\u045A",
  nlArr: "\u21CD",
  nlE: "\u2266\u0338",
  nlarr: "\u219A",
  nldr: "\u2025",
  nle: "\u2270",
  nleftarrow: "\u219A",
  nleftrightarrow: "\u21AE",
  nleq: "\u2270",
  nleqq: "\u2266\u0338",
  nleqslant: "\u2A7D\u0338",
  nles: "\u2A7D\u0338",
  nless: "\u226E",
  nlsim: "\u2274",
  nlt: "\u226E",
  nltri: "\u22EA",
  nltrie: "\u22EC",
  nmid: "\u2224",
  nopf: "\u{1D55F}",
  not: "\xAC",
  notin: "\u2209",
  notinE: "\u22F9\u0338",
  notindot: "\u22F5\u0338",
  notinva: "\u2209",
  notinvb: "\u22F7",
  notinvc: "\u22F6",
  notni: "\u220C",
  notniva: "\u220C",
  notnivb: "\u22FE",
  notnivc: "\u22FD",
  npar: "\u2226",
  nparallel: "\u2226",
  nparsl: "\u2AFD\u20E5",
  npart: "\u2202\u0338",
  npolint: "\u2A14",
  npr: "\u2280",
  nprcue: "\u22E0",
  npre: "\u2AAF\u0338",
  nprec: "\u2280",
  npreceq: "\u2AAF\u0338",
  nrArr: "\u21CF",
  nrarr: "\u219B",
  nrarrc: "\u2933\u0338",
  nrarrw: "\u219D\u0338",
  nrightarrow: "\u219B",
  nrtri: "\u22EB",
  nrtrie: "\u22ED",
  nsc: "\u2281",
  nsccue: "\u22E1",
  nsce: "\u2AB0\u0338",
  nscr: "\u{1D4C3}",
  nshortmid: "\u2224",
  nshortparallel: "\u2226",
  nsim: "\u2241",
  nsime: "\u2244",
  nsimeq: "\u2244",
  nsmid: "\u2224",
  nspar: "\u2226",
  nsqsube: "\u22E2",
  nsqsupe: "\u22E3",
  nsub: "\u2284",
  nsubE: "\u2AC5\u0338",
  nsube: "\u2288",
  nsubset: "\u2282\u20D2",
  nsubseteq: "\u2288",
  nsubseteqq: "\u2AC5\u0338",
  nsucc: "\u2281",
  nsucceq: "\u2AB0\u0338",
  nsup: "\u2285",
  nsupE: "\u2AC6\u0338",
  nsupe: "\u2289",
  nsupset: "\u2283\u20D2",
  nsupseteq: "\u2289",
  nsupseteqq: "\u2AC6\u0338",
  ntgl: "\u2279",
  ntilde: "\xF1",
  ntlg: "\u2278",
  ntriangleleft: "\u22EA",
  ntrianglelefteq: "\u22EC",
  ntriangleright: "\u22EB",
  ntrianglerighteq: "\u22ED",
  nu: "\u03BD",
  num: "#",
  numero: "\u2116",
  numsp: "\u2007",
  nvDash: "\u22AD",
  nvHarr: "\u2904",
  nvap: "\u224D\u20D2",
  nvdash: "\u22AC",
  nvge: "\u2265\u20D2",
  nvgt: ">\u20D2",
  nvinfin: "\u29DE",
  nvlArr: "\u2902",
  nvle: "\u2264\u20D2",
  nvlt: "<\u20D2",
  nvltrie: "\u22B4\u20D2",
  nvrArr: "\u2903",
  nvrtrie: "\u22B5\u20D2",
  nvsim: "\u223C\u20D2",
  nwArr: "\u21D6",
  nwarhk: "\u2923",
  nwarr: "\u2196",
  nwarrow: "\u2196",
  nwnear: "\u2927",
  oS: "\u24C8",
  oacute: "\xF3",
  oast: "\u229B",
  ocir: "\u229A",
  ocirc: "\xF4",
  ocy: "\u043E",
  odash: "\u229D",
  odblac: "\u0151",
  odiv: "\u2A38",
  odot: "\u2299",
  odsold: "\u29BC",
  oelig: "\u0153",
  ofcir: "\u29BF",
  ofr: "\u{1D52C}",
  ogon: "\u02DB",
  ograve: "\xF2",
  ogt: "\u29C1",
  ohbar: "\u29B5",
  ohm: "\u03A9",
  oint: "\u222E",
  olarr: "\u21BA",
  olcir: "\u29BE",
  olcross: "\u29BB",
  oline: "\u203E",
  olt: "\u29C0",
  omacr: "\u014D",
  omega: "\u03C9",
  omicron: "\u03BF",
  omid: "\u29B6",
  ominus: "\u2296",
  oopf: "\u{1D560}",
  opar: "\u29B7",
  operp: "\u29B9",
  oplus: "\u2295",
  or: "\u2228",
  orarr: "\u21BB",
  ord: "\u2A5D",
  order: "\u2134",
  orderof: "\u2134",
  ordf: "\xAA",
  ordm: "\xBA",
  origof: "\u22B6",
  oror: "\u2A56",
  orslope: "\u2A57",
  orv: "\u2A5B",
  oscr: "\u2134",
  oslash: "\xF8",
  osol: "\u2298",
  otilde: "\xF5",
  otimes: "\u2297",
  otimesas: "\u2A36",
  ouml: "\xF6",
  ovbar: "\u233D",
  par: "\u2225",
  para: "\xB6",
  parallel: "\u2225",
  parsim: "\u2AF3",
  parsl: "\u2AFD",
  part: "\u2202",
  pcy: "\u043F",
  percnt: "%",
  period: ".",
  permil: "\u2030",
  perp: "\u22A5",
  pertenk: "\u2031",
  pfr: "\u{1D52D}",
  phi: "\u03C6",
  phiv: "\u03D5",
  phmmat: "\u2133",
  phone: "\u260E",
  pi: "\u03C0",
  pitchfork: "\u22D4",
  piv: "\u03D6",
  planck: "\u210F",
  planckh: "\u210E",
  plankv: "\u210F",
  plus: "+",
  plusacir: "\u2A23",
  plusb: "\u229E",
  pluscir: "\u2A22",
  plusdo: "\u2214",
  plusdu: "\u2A25",
  pluse: "\u2A72",
  plusmn: "\xB1",
  plussim: "\u2A26",
  plustwo: "\u2A27",
  pm: "\xB1",
  pointint: "\u2A15",
  popf: "\u{1D561}",
  pound: "\xA3",
  pr: "\u227A",
  prE: "\u2AB3",
  prap: "\u2AB7",
  prcue: "\u227C",
  pre: "\u2AAF",
  prec: "\u227A",
  precapprox: "\u2AB7",
  preccurlyeq: "\u227C",
  preceq: "\u2AAF",
  precnapprox: "\u2AB9",
  precneqq: "\u2AB5",
  precnsim: "\u22E8",
  precsim: "\u227E",
  prime: "\u2032",
  primes: "\u2119",
  prnE: "\u2AB5",
  prnap: "\u2AB9",
  prnsim: "\u22E8",
  prod: "\u220F",
  profalar: "\u232E",
  profline: "\u2312",
  profsurf: "\u2313",
  prop: "\u221D",
  propto: "\u221D",
  prsim: "\u227E",
  prurel: "\u22B0",
  pscr: "\u{1D4C5}",
  psi: "\u03C8",
  puncsp: "\u2008",
  qfr: "\u{1D52E}",
  qint: "\u2A0C",
  qopf: "\u{1D562}",
  qprime: "\u2057",
  qscr: "\u{1D4C6}",
  quaternions: "\u210D",
  quatint: "\u2A16",
  quest: "?",
  questeq: "\u225F",
  quot: '"',
  rAarr: "\u21DB",
  rArr: "\u21D2",
  rAtail: "\u291C",
  rBarr: "\u290F",
  rHar: "\u2964",
  race: "\u223D\u0331",
  racute: "\u0155",
  radic: "\u221A",
  raemptyv: "\u29B3",
  rang: "\u27E9",
  rangd: "\u2992",
  range: "\u29A5",
  rangle: "\u27E9",
  raquo: "\xBB",
  rarr: "\u2192",
  rarrap: "\u2975",
  rarrb: "\u21E5",
  rarrbfs: "\u2920",
  rarrc: "\u2933",
  rarrfs: "\u291E",
  rarrhk: "\u21AA",
  rarrlp: "\u21AC",
  rarrpl: "\u2945",
  rarrsim: "\u2974",
  rarrtl: "\u21A3",
  rarrw: "\u219D",
  ratail: "\u291A",
  ratio: "\u2236",
  rationals: "\u211A",
  rbarr: "\u290D",
  rbbrk: "\u2773",
  rbrace: "}",
  rbrack: "]",
  rbrke: "\u298C",
  rbrksld: "\u298E",
  rbrkslu: "\u2990",
  rcaron: "\u0159",
  rcedil: "\u0157",
  rceil: "\u2309",
  rcub: "}",
  rcy: "\u0440",
  rdca: "\u2937",
  rdldhar: "\u2969",
  rdquo: "\u201D",
  rdquor: "\u201D",
  rdsh: "\u21B3",
  real: "\u211C",
  realine: "\u211B",
  realpart: "\u211C",
  reals: "\u211D",
  rect: "\u25AD",
  reg: "\xAE",
  rfisht: "\u297D",
  rfloor: "\u230B",
  rfr: "\u{1D52F}",
  rhard: "\u21C1",
  rharu: "\u21C0",
  rharul: "\u296C",
  rho: "\u03C1",
  rhov: "\u03F1",
  rightarrow: "\u2192",
  rightarrowtail: "\u21A3",
  rightharpoondown: "\u21C1",
  rightharpoonup: "\u21C0",
  rightleftarrows: "\u21C4",
  rightleftharpoons: "\u21CC",
  rightrightarrows: "\u21C9",
  rightsquigarrow: "\u219D",
  rightthreetimes: "\u22CC",
  ring: "\u02DA",
  risingdotseq: "\u2253",
  rlarr: "\u21C4",
  rlhar: "\u21CC",
  rlm: "\u200F",
  rmoust: "\u23B1",
  rmoustache: "\u23B1",
  rnmid: "\u2AEE",
  roang: "\u27ED",
  roarr: "\u21FE",
  robrk: "\u27E7",
  ropar: "\u2986",
  ropf: "\u{1D563}",
  roplus: "\u2A2E",
  rotimes: "\u2A35",
  rpar: ")",
  rpargt: "\u2994",
  rppolint: "\u2A12",
  rrarr: "\u21C9",
  rsaquo: "\u203A",
  rscr: "\u{1D4C7}",
  rsh: "\u21B1",
  rsqb: "]",
  rsquo: "\u2019",
  rsquor: "\u2019",
  rthree: "\u22CC",
  rtimes: "\u22CA",
  rtri: "\u25B9",
  rtrie: "\u22B5",
  rtrif: "\u25B8",
  rtriltri: "\u29CE",
  ruluhar: "\u2968",
  rx: "\u211E",
  sacute: "\u015B",
  sbquo: "\u201A",
  sc: "\u227B",
  scE: "\u2AB4",
  scap: "\u2AB8",
  scaron: "\u0161",
  sccue: "\u227D",
  sce: "\u2AB0",
  scedil: "\u015F",
  scirc: "\u015D",
  scnE: "\u2AB6",
  scnap: "\u2ABA",
  scnsim: "\u22E9",
  scpolint: "\u2A13",
  scsim: "\u227F",
  scy: "\u0441",
  sdot: "\u22C5",
  sdotb: "\u22A1",
  sdote: "\u2A66",
  seArr: "\u21D8",
  searhk: "\u2925",
  searr: "\u2198",
  searrow: "\u2198",
  sect: "\xA7",
  semi: ";",
  seswar: "\u2929",
  setminus: "\u2216",
  setmn: "\u2216",
  sext: "\u2736",
  sfr: "\u{1D530}",
  sfrown: "\u2322",
  sharp: "\u266F",
  shchcy: "\u0449",
  shcy: "\u0448",
  shortmid: "\u2223",
  shortparallel: "\u2225",
  shy: "\xAD",
  sigma: "\u03C3",
  sigmaf: "\u03C2",
  sigmav: "\u03C2",
  sim: "\u223C",
  simdot: "\u2A6A",
  sime: "\u2243",
  simeq: "\u2243",
  simg: "\u2A9E",
  simgE: "\u2AA0",
  siml: "\u2A9D",
  simlE: "\u2A9F",
  simne: "\u2246",
  simplus: "\u2A24",
  simrarr: "\u2972",
  slarr: "\u2190",
  smallsetminus: "\u2216",
  smashp: "\u2A33",
  smeparsl: "\u29E4",
  smid: "\u2223",
  smile: "\u2323",
  smt: "\u2AAA",
  smte: "\u2AAC",
  smtes: "\u2AAC\uFE00",
  softcy: "\u044C",
  sol: "/",
  solb: "\u29C4",
  solbar: "\u233F",
  sopf: "\u{1D564}",
  spades: "\u2660",
  spadesuit: "\u2660",
  spar: "\u2225",
  sqcap: "\u2293",
  sqcaps: "\u2293\uFE00",
  sqcup: "\u2294",
  sqcups: "\u2294\uFE00",
  sqsub: "\u228F",
  sqsube: "\u2291",
  sqsubset: "\u228F",
  sqsubseteq: "\u2291",
  sqsup: "\u2290",
  sqsupe: "\u2292",
  sqsupset: "\u2290",
  sqsupseteq: "\u2292",
  squ: "\u25A1",
  square: "\u25A1",
  squarf: "\u25AA",
  squf: "\u25AA",
  srarr: "\u2192",
  sscr: "\u{1D4C8}",
  ssetmn: "\u2216",
  ssmile: "\u2323",
  sstarf: "\u22C6",
  star: "\u2606",
  starf: "\u2605",
  straightepsilon: "\u03F5",
  straightphi: "\u03D5",
  strns: "\xAF",
  sub: "\u2282",
  subE: "\u2AC5",
  subdot: "\u2ABD",
  sube: "\u2286",
  subedot: "\u2AC3",
  submult: "\u2AC1",
  subnE: "\u2ACB",
  subne: "\u228A",
  subplus: "\u2ABF",
  subrarr: "\u2979",
  subset: "\u2282",
  subseteq: "\u2286",
  subseteqq: "\u2AC5",
  subsetneq: "\u228A",
  subsetneqq: "\u2ACB",
  subsim: "\u2AC7",
  subsub: "\u2AD5",
  subsup: "\u2AD3",
  succ: "\u227B",
  succapprox: "\u2AB8",
  succcurlyeq: "\u227D",
  succeq: "\u2AB0",
  succnapprox: "\u2ABA",
  succneqq: "\u2AB6",
  succnsim: "\u22E9",
  succsim: "\u227F",
  sum: "\u2211",
  sung: "\u266A",
  sup1: "\xB9",
  sup2: "\xB2",
  sup3: "\xB3",
  sup: "\u2283",
  supE: "\u2AC6",
  supdot: "\u2ABE",
  supdsub: "\u2AD8",
  supe: "\u2287",
  supedot: "\u2AC4",
  suphsol: "\u27C9",
  suphsub: "\u2AD7",
  suplarr: "\u297B",
  supmult: "\u2AC2",
  supnE: "\u2ACC",
  supne: "\u228B",
  supplus: "\u2AC0",
  supset: "\u2283",
  supseteq: "\u2287",
  supseteqq: "\u2AC6",
  supsetneq: "\u228B",
  supsetneqq: "\u2ACC",
  supsim: "\u2AC8",
  supsub: "\u2AD4",
  supsup: "\u2AD6",
  swArr: "\u21D9",
  swarhk: "\u2926",
  swarr: "\u2199",
  swarrow: "\u2199",
  swnwar: "\u292A",
  szlig: "\xDF",
  target: "\u2316",
  tau: "\u03C4",
  tbrk: "\u23B4",
  tcaron: "\u0165",
  tcedil: "\u0163",
  tcy: "\u0442",
  tdot: "\u20DB",
  telrec: "\u2315",
  tfr: "\u{1D531}",
  there4: "\u2234",
  therefore: "\u2234",
  theta: "\u03B8",
  thetasym: "\u03D1",
  thetav: "\u03D1",
  thickapprox: "\u2248",
  thicksim: "\u223C",
  thinsp: "\u2009",
  thkap: "\u2248",
  thksim: "\u223C",
  thorn: "\xFE",
  tilde: "\u02DC",
  times: "\xD7",
  timesb: "\u22A0",
  timesbar: "\u2A31",
  timesd: "\u2A30",
  tint: "\u222D",
  toea: "\u2928",
  top: "\u22A4",
  topbot: "\u2336",
  topcir: "\u2AF1",
  topf: "\u{1D565}",
  topfork: "\u2ADA",
  tosa: "\u2929",
  tprime: "\u2034",
  trade: "\u2122",
  triangle: "\u25B5",
  triangledown: "\u25BF",
  triangleleft: "\u25C3",
  trianglelefteq: "\u22B4",
  triangleq: "\u225C",
  triangleright: "\u25B9",
  trianglerighteq: "\u22B5",
  tridot: "\u25EC",
  trie: "\u225C",
  triminus: "\u2A3A",
  triplus: "\u2A39",
  trisb: "\u29CD",
  tritime: "\u2A3B",
  trpezium: "\u23E2",
  tscr: "\u{1D4C9}",
  tscy: "\u0446",
  tshcy: "\u045B",
  tstrok: "\u0167",
  twixt: "\u226C",
  twoheadleftarrow: "\u219E",
  twoheadrightarrow: "\u21A0",
  uArr: "\u21D1",
  uHar: "\u2963",
  uacute: "\xFA",
  uarr: "\u2191",
  ubrcy: "\u045E",
  ubreve: "\u016D",
  ucirc: "\xFB",
  ucy: "\u0443",
  udarr: "\u21C5",
  udblac: "\u0171",
  udhar: "\u296E",
  ufisht: "\u297E",
  ufr: "\u{1D532}",
  ugrave: "\xF9",
  uharl: "\u21BF",
  uharr: "\u21BE",
  uhblk: "\u2580",
  ulcorn: "\u231C",
  ulcorner: "\u231C",
  ulcrop: "\u230F",
  ultri: "\u25F8",
  umacr: "\u016B",
  uml: "\xA8",
  uogon: "\u0173",
  uopf: "\u{1D566}",
  uparrow: "\u2191",
  updownarrow: "\u2195",
  upharpoonleft: "\u21BF",
  upharpoonright: "\u21BE",
  uplus: "\u228E",
  upsi: "\u03C5",
  upsih: "\u03D2",
  upsilon: "\u03C5",
  upuparrows: "\u21C8",
  urcorn: "\u231D",
  urcorner: "\u231D",
  urcrop: "\u230E",
  uring: "\u016F",
  urtri: "\u25F9",
  uscr: "\u{1D4CA}",
  utdot: "\u22F0",
  utilde: "\u0169",
  utri: "\u25B5",
  utrif: "\u25B4",
  uuarr: "\u21C8",
  uuml: "\xFC",
  uwangle: "\u29A7",
  vArr: "\u21D5",
  vBar: "\u2AE8",
  vBarv: "\u2AE9",
  vDash: "\u22A8",
  vangrt: "\u299C",
  varepsilon: "\u03F5",
  varkappa: "\u03F0",
  varnothing: "\u2205",
  varphi: "\u03D5",
  varpi: "\u03D6",
  varpropto: "\u221D",
  varr: "\u2195",
  varrho: "\u03F1",
  varsigma: "\u03C2",
  varsubsetneq: "\u228A\uFE00",
  varsubsetneqq: "\u2ACB\uFE00",
  varsupsetneq: "\u228B\uFE00",
  varsupsetneqq: "\u2ACC\uFE00",
  vartheta: "\u03D1",
  vartriangleleft: "\u22B2",
  vartriangleright: "\u22B3",
  vcy: "\u0432",
  vdash: "\u22A2",
  vee: "\u2228",
  veebar: "\u22BB",
  veeeq: "\u225A",
  vellip: "\u22EE",
  verbar: "|",
  vert: "|",
  vfr: "\u{1D533}",
  vltri: "\u22B2",
  vnsub: "\u2282\u20D2",
  vnsup: "\u2283\u20D2",
  vopf: "\u{1D567}",
  vprop: "\u221D",
  vrtri: "\u22B3",
  vscr: "\u{1D4CB}",
  vsubnE: "\u2ACB\uFE00",
  vsubne: "\u228A\uFE00",
  vsupnE: "\u2ACC\uFE00",
  vsupne: "\u228B\uFE00",
  vzigzag: "\u299A",
  wcirc: "\u0175",
  wedbar: "\u2A5F",
  wedge: "\u2227",
  wedgeq: "\u2259",
  weierp: "\u2118",
  wfr: "\u{1D534}",
  wopf: "\u{1D568}",
  wp: "\u2118",
  wr: "\u2240",
  wreath: "\u2240",
  wscr: "\u{1D4CC}",
  xcap: "\u22C2",
  xcirc: "\u25EF",
  xcup: "\u22C3",
  xdtri: "\u25BD",
  xfr: "\u{1D535}",
  xhArr: "\u27FA",
  xharr: "\u27F7",
  xi: "\u03BE",
  xlArr: "\u27F8",
  xlarr: "\u27F5",
  xmap: "\u27FC",
  xnis: "\u22FB",
  xodot: "\u2A00",
  xopf: "\u{1D569}",
  xoplus: "\u2A01",
  xotime: "\u2A02",
  xrArr: "\u27F9",
  xrarr: "\u27F6",
  xscr: "\u{1D4CD}",
  xsqcup: "\u2A06",
  xuplus: "\u2A04",
  xutri: "\u25B3",
  xvee: "\u22C1",
  xwedge: "\u22C0",
  yacute: "\xFD",
  yacy: "\u044F",
  ycirc: "\u0177",
  ycy: "\u044B",
  yen: "\xA5",
  yfr: "\u{1D536}",
  yicy: "\u0457",
  yopf: "\u{1D56A}",
  yscr: "\u{1D4CE}",
  yucy: "\u044E",
  yuml: "\xFF",
  zacute: "\u017A",
  zcaron: "\u017E",
  zcy: "\u0437",
  zdot: "\u017C",
  zeetrf: "\u2128",
  zeta: "\u03B6",
  zfr: "\u{1D537}",
  zhcy: "\u0436",
  zigrarr: "\u21DD",
  zopf: "\u{1D56B}",
  zscr: "\u{1D4CF}",
  zwj: "\u200D",
  zwnj: "\u200C"
};

// node_modules/decode-named-character-reference/index.js
var own = {}.hasOwnProperty;
function decodeNamedCharacterReference(value) {
  return own.call(characterEntities, value) ? characterEntities[value] : false;
}

// node_modules/micromark-util-chunked/index.js
function splice(list2, start, remove, items) {
  const end = list2.length;
  let chunkStart = 0;
  let parameters;
  if (start < 0) {
    start = -start > end ? 0 : end + start;
  } else {
    start = start > end ? end : start;
  }
  remove = remove > 0 ? remove : 0;
  if (items.length < 1e4) {
    parameters = Array.from(items);
    parameters.unshift(start, remove);
    list2.splice(...parameters);
  } else {
    if (remove) list2.splice(start, remove);
    while (chunkStart < items.length) {
      parameters = items.slice(chunkStart, chunkStart + 1e4);
      parameters.unshift(start, 0);
      list2.splice(...parameters);
      chunkStart += 1e4;
      start += 1e4;
    }
  }
}
function push(list2, items) {
  if (list2.length > 0) {
    splice(list2, list2.length, 0, items);
    return list2;
  }
  return items;
}

// node_modules/micromark-util-combine-extensions/index.js
var hasOwnProperty = {}.hasOwnProperty;
function combineExtensions(extensions) {
  const all2 = {};
  let index2 = -1;
  while (++index2 < extensions.length) {
    syntaxExtension(all2, extensions[index2]);
  }
  return all2;
}
function syntaxExtension(all2, extension2) {
  let hook;
  for (hook in extension2) {
    const maybe = hasOwnProperty.call(all2, hook) ? all2[hook] : void 0;
    const left = maybe || (all2[hook] = {});
    const right = extension2[hook];
    let code2;
    if (right) {
      for (code2 in right) {
        if (!hasOwnProperty.call(left, code2)) left[code2] = [];
        const value = right[code2];
        constructs(
          // @ts-expect-error Looks like a list.
          left[code2],
          Array.isArray(value) ? value : value ? [value] : []
        );
      }
    }
  }
}
function constructs(existing, list2) {
  let index2 = -1;
  const before = [];
  while (++index2 < list2.length) {
    ;
    (list2[index2].add === "after" ? existing : before).push(list2[index2]);
  }
  splice(existing, 0, 0, before);
}

// node_modules/micromark-util-decode-numeric-character-reference/index.js
function decodeNumericCharacterReference(value, base) {
  const code2 = Number.parseInt(value, base);
  if (
    // C0 except for HT, LF, FF, CR, space.
    code2 < 9 || code2 === 11 || code2 > 13 && code2 < 32 || // Control character (DEL) of C0, and C1 controls.
    code2 > 126 && code2 < 160 || // Lone high surrogates and low surrogates.
    code2 > 55295 && code2 < 57344 || // Noncharacters.
    code2 > 64975 && code2 < 65008 || /* eslint-disable no-bitwise */
    (code2 & 65535) === 65535 || (code2 & 65535) === 65534 || /* eslint-enable no-bitwise */
    // Out of range
    code2 > 1114111
  ) {
    return "\uFFFD";
  }
  return String.fromCodePoint(code2);
}

// node_modules/micromark-util-normalize-identifier/index.js
function normalizeIdentifier(value) {
  return value.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
}

// node_modules/micromark-util-character/index.js
var asciiAlpha = regexCheck(/[A-Za-z]/);
var asciiAlphanumeric = regexCheck(/[\dA-Za-z]/);
var asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/);
function asciiControl(code2) {
  return (
    // Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    code2 !== null && (code2 < 32 || code2 === 127)
  );
}
var asciiDigit = regexCheck(/\d/);
var asciiHexDigit = regexCheck(/[\dA-Fa-f]/);
var asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/);
function markdownLineEnding2(code2) {
  return code2 !== null && code2 < -2;
}
function markdownLineEndingOrSpace2(code2) {
  return code2 !== null && (code2 < 0 || code2 === 32);
}
function markdownSpace(code2) {
  return code2 === -2 || code2 === -1 || code2 === 32;
}
var unicodePunctuation = regexCheck(/\p{P}|\p{S}/u);
var unicodeWhitespace = regexCheck(/\s/);
function regexCheck(regex) {
  return check;
  function check(code2) {
    return code2 !== null && code2 > -1 && regex.test(String.fromCharCode(code2));
  }
}

// node_modules/micromark-factory-space/index.js
function factorySpace(effects, ok3, type, max) {
  const limit = max ? max - 1 : Number.POSITIVE_INFINITY;
  let size = 0;
  return start;
  function start(code2) {
    if (markdownSpace(code2)) {
      effects.enter(type);
      return prefix(code2);
    }
    return ok3(code2);
  }
  function prefix(code2) {
    if (markdownSpace(code2) && size++ < limit) {
      effects.consume(code2);
      return prefix;
    }
    effects.exit(type);
    return ok3(code2);
  }
}

// node_modules/micromark/lib/initialize/content.js
var content = {
  tokenize: initializeContent
};
function initializeContent(effects) {
  const contentStart = effects.attempt(this.parser.constructs.contentInitial, afterContentStartConstruct, paragraphInitial);
  let previous4;
  return contentStart;
  function afterContentStartConstruct(code2) {
    if (code2 === null) {
      effects.consume(code2);
      return;
    }
    effects.enter("lineEnding");
    effects.consume(code2);
    effects.exit("lineEnding");
    return factorySpace(effects, contentStart, "linePrefix");
  }
  function paragraphInitial(code2) {
    effects.enter("paragraph");
    return lineStart(code2);
  }
  function lineStart(code2) {
    const token = effects.enter("chunkText", {
      contentType: "text",
      previous: previous4
    });
    if (previous4) {
      previous4.next = token;
    }
    previous4 = token;
    return data(code2);
  }
  function data(code2) {
    if (code2 === null) {
      effects.exit("chunkText");
      effects.exit("paragraph");
      effects.consume(code2);
      return;
    }
    if (markdownLineEnding2(code2)) {
      effects.consume(code2);
      effects.exit("chunkText");
      return lineStart;
    }
    effects.consume(code2);
    return data;
  }
}

// node_modules/micromark/lib/initialize/document.js
var document = {
  tokenize: initializeDocument
};
var containerConstruct = {
  tokenize: tokenizeContainer
};
function initializeDocument(effects) {
  const self = this;
  const stack = [];
  let continued = 0;
  let childFlow;
  let childToken;
  let lineStartOffset;
  return start;
  function start(code2) {
    if (continued < stack.length) {
      const item = stack[continued];
      self.containerState = item[1];
      return effects.attempt(item[0].continuation, documentContinue, checkNewContainers)(code2);
    }
    return checkNewContainers(code2);
  }
  function documentContinue(code2) {
    continued++;
    if (self.containerState._closeFlow) {
      self.containerState._closeFlow = void 0;
      if (childFlow) {
        closeFlow();
      }
      const indexBeforeExits = self.events.length;
      let indexBeforeFlow = indexBeforeExits;
      let point3;
      while (indexBeforeFlow--) {
        if (self.events[indexBeforeFlow][0] === "exit" && self.events[indexBeforeFlow][1].type === "chunkFlow") {
          point3 = self.events[indexBeforeFlow][1].end;
          break;
        }
      }
      exitContainers(continued);
      let index2 = indexBeforeExits;
      while (index2 < self.events.length) {
        self.events[index2][1].end = {
          ...point3
        };
        index2++;
      }
      splice(self.events, indexBeforeFlow + 1, 0, self.events.slice(indexBeforeExits));
      self.events.length = index2;
      return checkNewContainers(code2);
    }
    return start(code2);
  }
  function checkNewContainers(code2) {
    if (continued === stack.length) {
      if (!childFlow) {
        return documentContinued(code2);
      }
      if (childFlow.currentConstruct && childFlow.currentConstruct.concrete) {
        return flowStart(code2);
      }
      self.interrupt = Boolean(childFlow.currentConstruct && !childFlow._gfmTableDynamicInterruptHack);
    }
    self.containerState = {};
    return effects.check(containerConstruct, thereIsANewContainer, thereIsNoNewContainer)(code2);
  }
  function thereIsANewContainer(code2) {
    if (childFlow) closeFlow();
    exitContainers(continued);
    return documentContinued(code2);
  }
  function thereIsNoNewContainer(code2) {
    self.parser.lazy[self.now().line] = continued !== stack.length;
    lineStartOffset = self.now().offset;
    return flowStart(code2);
  }
  function documentContinued(code2) {
    self.containerState = {};
    return effects.attempt(containerConstruct, containerContinue, flowStart)(code2);
  }
  function containerContinue(code2) {
    continued++;
    stack.push([self.currentConstruct, self.containerState]);
    return documentContinued(code2);
  }
  function flowStart(code2) {
    if (code2 === null) {
      if (childFlow) closeFlow();
      exitContainers(0);
      effects.consume(code2);
      return;
    }
    childFlow = childFlow || self.parser.flow(self.now());
    effects.enter("chunkFlow", {
      _tokenizer: childFlow,
      contentType: "flow",
      previous: childToken
    });
    return flowContinue(code2);
  }
  function flowContinue(code2) {
    if (code2 === null) {
      writeToChild(effects.exit("chunkFlow"), true);
      exitContainers(0);
      effects.consume(code2);
      return;
    }
    if (markdownLineEnding2(code2)) {
      effects.consume(code2);
      writeToChild(effects.exit("chunkFlow"));
      continued = 0;
      self.interrupt = void 0;
      return start;
    }
    effects.consume(code2);
    return flowContinue;
  }
  function writeToChild(token, endOfFile) {
    const stream = self.sliceStream(token);
    if (endOfFile) stream.push(null);
    token.previous = childToken;
    if (childToken) childToken.next = token;
    childToken = token;
    childFlow.defineSkip(token.start);
    childFlow.write(stream);
    if (self.parser.lazy[token.start.line]) {
      let index2 = childFlow.events.length;
      while (index2--) {
        if (
          // The token starts before the line ending…
          childFlow.events[index2][1].start.offset < lineStartOffset && // …and either is not ended yet…
          (!childFlow.events[index2][1].end || // …or ends after it.
          childFlow.events[index2][1].end.offset > lineStartOffset)
        ) {
          return;
        }
      }
      const indexBeforeExits = self.events.length;
      let indexBeforeFlow = indexBeforeExits;
      let seen;
      let point3;
      while (indexBeforeFlow--) {
        if (self.events[indexBeforeFlow][0] === "exit" && self.events[indexBeforeFlow][1].type === "chunkFlow") {
          if (seen) {
            point3 = self.events[indexBeforeFlow][1].end;
            break;
          }
          seen = true;
        }
      }
      exitContainers(continued);
      index2 = indexBeforeExits;
      while (index2 < self.events.length) {
        self.events[index2][1].end = {
          ...point3
        };
        index2++;
      }
      splice(self.events, indexBeforeFlow + 1, 0, self.events.slice(indexBeforeExits));
      self.events.length = index2;
    }
  }
  function exitContainers(size) {
    let index2 = stack.length;
    while (index2-- > size) {
      const entry = stack[index2];
      self.containerState = entry[1];
      entry[0].exit.call(self, effects);
    }
    stack.length = size;
  }
  function closeFlow() {
    childFlow.write([null]);
    childToken = void 0;
    childFlow = void 0;
    self.containerState._closeFlow = void 0;
  }
}
function tokenizeContainer(effects, ok3, nok) {
  return factorySpace(effects, effects.attempt(this.parser.constructs.document, ok3, nok), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
}

// node_modules/micromark-util-classify-character/index.js
function classifyCharacter(code2) {
  if (code2 === null || markdownLineEndingOrSpace2(code2) || unicodeWhitespace(code2)) {
    return 1;
  }
  if (unicodePunctuation(code2)) {
    return 2;
  }
}

// node_modules/micromark-util-resolve-all/index.js
function resolveAll(constructs2, events, context) {
  const called = [];
  let index2 = -1;
  while (++index2 < constructs2.length) {
    const resolve = constructs2[index2].resolveAll;
    if (resolve && !called.includes(resolve)) {
      events = resolve(events, context);
      called.push(resolve);
    }
  }
  return events;
}

// node_modules/micromark-core-commonmark/lib/attention.js
var attention = {
  name: "attention",
  resolveAll: resolveAllAttention,
  tokenize: tokenizeAttention
};
function resolveAllAttention(events, context) {
  let index2 = -1;
  let open;
  let group2;
  let text4;
  let openingSequence;
  let closingSequence;
  let use;
  let nextEvents;
  let offset;
  while (++index2 < events.length) {
    if (events[index2][0] === "enter" && events[index2][1].type === "attentionSequence" && events[index2][1]._close) {
      open = index2;
      while (open--) {
        if (events[open][0] === "exit" && events[open][1].type === "attentionSequence" && events[open][1]._open && // If the markers are the same:
        context.sliceSerialize(events[open][1]).charCodeAt(0) === context.sliceSerialize(events[index2][1]).charCodeAt(0)) {
          if ((events[open][1]._close || events[index2][1]._open) && (events[index2][1].end.offset - events[index2][1].start.offset) % 3 && !((events[open][1].end.offset - events[open][1].start.offset + events[index2][1].end.offset - events[index2][1].start.offset) % 3)) {
            continue;
          }
          use = events[open][1].end.offset - events[open][1].start.offset > 1 && events[index2][1].end.offset - events[index2][1].start.offset > 1 ? 2 : 1;
          const start = {
            ...events[open][1].end
          };
          const end = {
            ...events[index2][1].start
          };
          movePoint(start, -use);
          movePoint(end, use);
          openingSequence = {
            type: use > 1 ? "strongSequence" : "emphasisSequence",
            start,
            end: {
              ...events[open][1].end
            }
          };
          closingSequence = {
            type: use > 1 ? "strongSequence" : "emphasisSequence",
            start: {
              ...events[index2][1].start
            },
            end
          };
          text4 = {
            type: use > 1 ? "strongText" : "emphasisText",
            start: {
              ...events[open][1].end
            },
            end: {
              ...events[index2][1].start
            }
          };
          group2 = {
            type: use > 1 ? "strong" : "emphasis",
            start: {
              ...openingSequence.start
            },
            end: {
              ...closingSequence.end
            }
          };
          events[open][1].end = {
            ...openingSequence.start
          };
          events[index2][1].start = {
            ...closingSequence.end
          };
          nextEvents = [];
          if (events[open][1].end.offset - events[open][1].start.offset) {
            nextEvents = push(nextEvents, [["enter", events[open][1], context], ["exit", events[open][1], context]]);
          }
          nextEvents = push(nextEvents, [["enter", group2, context], ["enter", openingSequence, context], ["exit", openingSequence, context], ["enter", text4, context]]);
          nextEvents = push(nextEvents, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + 1, index2), context));
          nextEvents = push(nextEvents, [["exit", text4, context], ["enter", closingSequence, context], ["exit", closingSequence, context], ["exit", group2, context]]);
          if (events[index2][1].end.offset - events[index2][1].start.offset) {
            offset = 2;
            nextEvents = push(nextEvents, [["enter", events[index2][1], context], ["exit", events[index2][1], context]]);
          } else {
            offset = 0;
          }
          splice(events, open - 1, index2 - open + 3, nextEvents);
          index2 = open + nextEvents.length - offset - 2;
          break;
        }
      }
    }
  }
  index2 = -1;
  while (++index2 < events.length) {
    if (events[index2][1].type === "attentionSequence") {
      events[index2][1].type = "data";
    }
  }
  return events;
}
function tokenizeAttention(effects, ok3) {
  const attentionMarkers2 = this.parser.constructs.attentionMarkers.null;
  const previous4 = this.previous;
  const before = classifyCharacter(previous4);
  let marker;
  return start;
  function start(code2) {
    marker = code2;
    effects.enter("attentionSequence");
    return inside(code2);
  }
  function inside(code2) {
    if (code2 === marker) {
      effects.consume(code2);
      return inside;
    }
    const token = effects.exit("attentionSequence");
    const after = classifyCharacter(code2);
    const open = !after || after === 2 && before || attentionMarkers2.includes(code2);
    const close = !before || before === 2 && after || attentionMarkers2.includes(previous4);
    token._open = Boolean(marker === 42 ? open : open && (before || !close));
    token._close = Boolean(marker === 42 ? close : close && (after || !open));
    return ok3(code2);
  }
}
function movePoint(point3, offset) {
  point3.column += offset;
  point3.offset += offset;
  point3._bufferIndex += offset;
}

// node_modules/micromark-core-commonmark/lib/autolink.js
var autolink = {
  name: "autolink",
  tokenize: tokenizeAutolink
};
function tokenizeAutolink(effects, ok3, nok) {
  let size = 0;
  return start;
  function start(code2) {
    effects.enter("autolink");
    effects.enter("autolinkMarker");
    effects.consume(code2);
    effects.exit("autolinkMarker");
    effects.enter("autolinkProtocol");
    return open;
  }
  function open(code2) {
    if (asciiAlpha(code2)) {
      effects.consume(code2);
      return schemeOrEmailAtext;
    }
    if (code2 === 64) {
      return nok(code2);
    }
    return emailAtext(code2);
  }
  function schemeOrEmailAtext(code2) {
    if (code2 === 43 || code2 === 45 || code2 === 46 || asciiAlphanumeric(code2)) {
      size = 1;
      return schemeInsideOrEmailAtext(code2);
    }
    return emailAtext(code2);
  }
  function schemeInsideOrEmailAtext(code2) {
    if (code2 === 58) {
      effects.consume(code2);
      size = 0;
      return urlInside;
    }
    if ((code2 === 43 || code2 === 45 || code2 === 46 || asciiAlphanumeric(code2)) && size++ < 32) {
      effects.consume(code2);
      return schemeInsideOrEmailAtext;
    }
    size = 0;
    return emailAtext(code2);
  }
  function urlInside(code2) {
    if (code2 === 62) {
      effects.exit("autolinkProtocol");
      effects.enter("autolinkMarker");
      effects.consume(code2);
      effects.exit("autolinkMarker");
      effects.exit("autolink");
      return ok3;
    }
    if (code2 === null || code2 === 32 || code2 === 60 || asciiControl(code2)) {
      return nok(code2);
    }
    effects.consume(code2);
    return urlInside;
  }
  function emailAtext(code2) {
    if (code2 === 64) {
      effects.consume(code2);
      return emailAtSignOrDot;
    }
    if (asciiAtext(code2)) {
      effects.consume(code2);
      return emailAtext;
    }
    return nok(code2);
  }
  function emailAtSignOrDot(code2) {
    return asciiAlphanumeric(code2) ? emailLabel(code2) : nok(code2);
  }
  function emailLabel(code2) {
    if (code2 === 46) {
      effects.consume(code2);
      size = 0;
      return emailAtSignOrDot;
    }
    if (code2 === 62) {
      effects.exit("autolinkProtocol").type = "autolinkEmail";
      effects.enter("autolinkMarker");
      effects.consume(code2);
      effects.exit("autolinkMarker");
      effects.exit("autolink");
      return ok3;
    }
    return emailValue(code2);
  }
  function emailValue(code2) {
    if ((code2 === 45 || asciiAlphanumeric(code2)) && size++ < 63) {
      const next = code2 === 45 ? emailValue : emailLabel;
      effects.consume(code2);
      return next;
    }
    return nok(code2);
  }
}

// node_modules/micromark-core-commonmark/lib/blank-line.js
var blankLine = {
  partial: true,
  tokenize: tokenizeBlankLine
};
function tokenizeBlankLine(effects, ok3, nok) {
  return start;
  function start(code2) {
    return markdownSpace(code2) ? factorySpace(effects, after, "linePrefix")(code2) : after(code2);
  }
  function after(code2) {
    return code2 === null || markdownLineEnding2(code2) ? ok3(code2) : nok(code2);
  }
}

// node_modules/micromark-core-commonmark/lib/block-quote.js
var blockQuote = {
  continuation: {
    tokenize: tokenizeBlockQuoteContinuation
  },
  exit,
  name: "blockQuote",
  tokenize: tokenizeBlockQuoteStart
};
function tokenizeBlockQuoteStart(effects, ok3, nok) {
  const self = this;
  return start;
  function start(code2) {
    if (code2 === 62) {
      const state = self.containerState;
      if (!state.open) {
        effects.enter("blockQuote", {
          _container: true
        });
        state.open = true;
      }
      effects.enter("blockQuotePrefix");
      effects.enter("blockQuoteMarker");
      effects.consume(code2);
      effects.exit("blockQuoteMarker");
      return after;
    }
    return nok(code2);
  }
  function after(code2) {
    if (markdownSpace(code2)) {
      effects.enter("blockQuotePrefixWhitespace");
      effects.consume(code2);
      effects.exit("blockQuotePrefixWhitespace");
      effects.exit("blockQuotePrefix");
      return ok3;
    }
    effects.exit("blockQuotePrefix");
    return ok3(code2);
  }
}
function tokenizeBlockQuoteContinuation(effects, ok3, nok) {
  const self = this;
  return contStart;
  function contStart(code2) {
    if (markdownSpace(code2)) {
      return factorySpace(effects, contBefore, "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code2);
    }
    return contBefore(code2);
  }
  function contBefore(code2) {
    return effects.attempt(blockQuote, ok3, nok)(code2);
  }
}
function exit(effects) {
  effects.exit("blockQuote");
}

// node_modules/micromark-core-commonmark/lib/character-escape.js
var characterEscape = {
  name: "characterEscape",
  tokenize: tokenizeCharacterEscape
};
function tokenizeCharacterEscape(effects, ok3, nok) {
  return start;
  function start(code2) {
    effects.enter("characterEscape");
    effects.enter("escapeMarker");
    effects.consume(code2);
    effects.exit("escapeMarker");
    return inside;
  }
  function inside(code2) {
    if (asciiPunctuation(code2)) {
      effects.enter("characterEscapeValue");
      effects.consume(code2);
      effects.exit("characterEscapeValue");
      effects.exit("characterEscape");
      return ok3;
    }
    return nok(code2);
  }
}

// node_modules/micromark-core-commonmark/lib/character-reference.js
var characterReference = {
  name: "characterReference",
  tokenize: tokenizeCharacterReference
};
function tokenizeCharacterReference(effects, ok3, nok) {
  const self = this;
  let size = 0;
  let max;
  let test;
  return start;
  function start(code2) {
    effects.enter("characterReference");
    effects.enter("characterReferenceMarker");
    effects.consume(code2);
    effects.exit("characterReferenceMarker");
    return open;
  }
  function open(code2) {
    if (code2 === 35) {
      effects.enter("characterReferenceMarkerNumeric");
      effects.consume(code2);
      effects.exit("characterReferenceMarkerNumeric");
      return numeric;
    }
    effects.enter("characterReferenceValue");
    max = 31;
    test = asciiAlphanumeric;
    return value(code2);
  }
  function numeric(code2) {
    if (code2 === 88 || code2 === 120) {
      effects.enter("characterReferenceMarkerHexadecimal");
      effects.consume(code2);
      effects.exit("characterReferenceMarkerHexadecimal");
      effects.enter("characterReferenceValue");
      max = 6;
      test = asciiHexDigit;
      return value;
    }
    effects.enter("characterReferenceValue");
    max = 7;
    test = asciiDigit;
    return value(code2);
  }
  function value(code2) {
    if (code2 === 59 && size) {
      const token = effects.exit("characterReferenceValue");
      if (test === asciiAlphanumeric && !decodeNamedCharacterReference(self.sliceSerialize(token))) {
        return nok(code2);
      }
      effects.enter("characterReferenceMarker");
      effects.consume(code2);
      effects.exit("characterReferenceMarker");
      effects.exit("characterReference");
      return ok3;
    }
    if (test(code2) && size++ < max) {
      effects.consume(code2);
      return value;
    }
    return nok(code2);
  }
}

// node_modules/micromark-core-commonmark/lib/code-fenced.js
var nonLazyContinuation = {
  partial: true,
  tokenize: tokenizeNonLazyContinuation
};
var codeFenced = {
  concrete: true,
  name: "codeFenced",
  tokenize: tokenizeCodeFenced
};
function tokenizeCodeFenced(effects, ok3, nok) {
  const self = this;
  const closeStart = {
    partial: true,
    tokenize: tokenizeCloseStart
  };
  let initialPrefix = 0;
  let sizeOpen = 0;
  let marker;
  return start;
  function start(code2) {
    return beforeSequenceOpen(code2);
  }
  function beforeSequenceOpen(code2) {
    const tail = self.events[self.events.length - 1];
    initialPrefix = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
    marker = code2;
    effects.enter("codeFenced");
    effects.enter("codeFencedFence");
    effects.enter("codeFencedFenceSequence");
    return sequenceOpen(code2);
  }
  function sequenceOpen(code2) {
    if (code2 === marker) {
      sizeOpen++;
      effects.consume(code2);
      return sequenceOpen;
    }
    if (sizeOpen < 3) {
      return nok(code2);
    }
    effects.exit("codeFencedFenceSequence");
    return markdownSpace(code2) ? factorySpace(effects, infoBefore, "whitespace")(code2) : infoBefore(code2);
  }
  function infoBefore(code2) {
    if (code2 === null || markdownLineEnding2(code2)) {
      effects.exit("codeFencedFence");
      return self.interrupt ? ok3(code2) : effects.check(nonLazyContinuation, atNonLazyBreak, after)(code2);
    }
    effects.enter("codeFencedFenceInfo");
    effects.enter("chunkString", {
      contentType: "string"
    });
    return info(code2);
  }
  function info(code2) {
    if (code2 === null || markdownLineEnding2(code2)) {
      effects.exit("chunkString");
      effects.exit("codeFencedFenceInfo");
      return infoBefore(code2);
    }
    if (markdownSpace(code2)) {
      effects.exit("chunkString");
      effects.exit("codeFencedFenceInfo");
      return factorySpace(effects, metaBefore, "whitespace")(code2);
    }
    if (code2 === 96 && code2 === marker) {
      return nok(code2);
    }
    effects.consume(code2);
    return info;
  }
  function metaBefore(code2) {
    if (code2 === null || markdownLineEnding2(code2)) {
      return infoBefore(code2);
    }
    effects.enter("codeFencedFenceMeta");
    effects.enter("chunkString", {
      contentType: "string"
    });
    return meta(code2);
  }
  function meta(code2) {
    if (code2 === null || markdownLineEnding2(code2)) {
      effects.exit("chunkString");
      effects.exit("codeFencedFenceMeta");
      return infoBefore(code2);
    }
    if (code2 === 96 && code2 === marker) {
      return nok(code2);
    }
    effects.consume(code2);
    return meta;
  }
  function atNonLazyBreak(code2) {
    return effects.attempt(closeStart, after, contentBefore)(code2);
  }
  function contentBefore(code2) {
    effects.enter("lineEnding");
    effects.consume(code2);
    effects.exit("lineEnding");
    return contentStart;
  }
  function contentStart(code2) {
    return initialPrefix > 0 && markdownSpace(code2) ? factorySpace(effects, beforeContentChunk, "linePrefix", initialPrefix + 1)(code2) : beforeContentChunk(code2);
  }
  function beforeContentChunk(code2) {
    if (code2 === null || markdownLineEnding2(code2)) {
      return effects.check(nonLazyContinuation, atNonLazyBreak, after)(code2);
    }
    effects.enter("codeFlowValue");
    return contentChunk(code2);
  }
  function contentChunk(code2) {
    if (code2 === null || markdownLineEnding2(code2)) {
      effects.exit("codeFlowValue");
      return beforeContentChunk(code2);
    }
    effects.consume(code2);
    return contentChunk;
  }
  function after(code2) {
    effects.exit("codeFenced");
    return ok3(code2);
  }
  function tokenizeCloseStart(effects2, ok4, nok2) {
    let size = 0;
    return startBefore;
    function startBefore(code2) {
      effects2.enter("lineEnding");
      effects2.consume(code2);
      effects2.exit("lineEnding");
      return start2;
    }
    function start2(code2) {
      effects2.enter("codeFencedFence");
      return markdownSpace(code2) ? factorySpace(effects2, beforeSequenceClose, "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code2) : beforeSequenceClose(code2);
    }
    function beforeSequenceClose(code2) {
      if (code2 === marker) {
        effects2.enter("codeFencedFenceSequence");
        return sequenceClose(code2);
      }
      return nok2(code2);
    }
    function sequenceClose(code2) {
      if (code2 === marker) {
        size++;
        effects2.consume(code2);
        return sequenceClose;
      }
      if (size >= sizeOpen) {
        effects2.exit("codeFencedFenceSequence");
        return markdownSpace(code2) ? factorySpace(effects2, sequenceCloseAfter, "whitespace")(code2) : sequenceCloseAfter(code2);
      }
      return nok2(code2);
    }
    function sequenceCloseAfter(code2) {
      if (code2 === null || markdownLineEnding2(code2)) {
        effects2.exit("codeFencedFence");
        return ok4(code2);
      }
      return nok2(code2);
    }
  }
}
function tokenizeNonLazyContinuation(effects, ok3, nok) {
  const self = this;
  return start;
  function start(code2) {
    if (code2 === null) {
      return nok(code2);
    }
    effects.enter("lineEnding");
    effects.consume(code2);
    effects.exit("lineEnding");
    return lineStart;
  }
  function lineStart(code2) {
    return self.parser.lazy[self.now().line] ? nok(code2) : ok3(code2);
  }
}

// node_modules/micromark-core-commonmark/lib/code-indented.js
var codeIndented = {
  name: "codeIndented",
  tokenize: tokenizeCodeIndented
};
var furtherStart = {
  partial: true,
  tokenize: tokenizeFurtherStart
};
function tokenizeCodeIndented(effects, ok3, nok) {
  const self = this;
  return start;
  function start(code2) {
    effects.enter("codeIndented");
    return factorySpace(effects, afterPrefix, "linePrefix", 4 + 1)(code2);
  }
  function afterPrefix(code2) {
    const tail = self.events[self.events.length - 1];
    return tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4 ? atBreak(code2) : nok(code2);
  }
  function atBreak(code2) {
    if (code2 === null) {
      return after(code2);
    }
    if (markdownLineEnding2(code2)) {
      return effects.attempt(furtherStart, atBreak, after)(code2);
    }
    effects.enter("codeFlowValue");
    return inside(code2);
  }
  function inside(code2) {
    if (code2 === null || markdownLineEnding2(code2)) {
      effects.exit("codeFlowValue");
      return atBreak(code2);
    }
    effects.consume(code2);
    return inside;
  }
  function after(code2) {
    effects.exit("codeIndented");
    return ok3(code2);
  }
}
function tokenizeFurtherStart(effects, ok3, nok) {
  const self = this;
  return furtherStart2;
  function furtherStart2(code2) {
    if (self.parser.lazy[self.now().line]) {
      return nok(code2);
    }
    if (markdownLineEnding2(code2)) {
      effects.enter("lineEnding");
      effects.consume(code2);
      effects.exit("lineEnding");
      return furtherStart2;
    }
    return factorySpace(effects, afterPrefix, "linePrefix", 4 + 1)(code2);
  }
  function afterPrefix(code2) {
    const tail = self.events[self.events.length - 1];
    return tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4 ? ok3(code2) : markdownLineEnding2(code2) ? furtherStart2(code2) : nok(code2);
  }
}

// node_modules/micromark-core-commonmark/lib/code-text.js
var codeText = {
  name: "codeText",
  previous,
  resolve: resolveCodeText,
  tokenize: tokenizeCodeText
};
function resolveCodeText(events) {
  let tailExitIndex = events.length - 4;
  let headEnterIndex = 3;
  let index2;
  let enter;
  if ((events[headEnterIndex][1].type === "lineEnding" || events[headEnterIndex][1].type === "space") && (events[tailExitIndex][1].type === "lineEnding" || events[tailExitIndex][1].type === "space")) {
    index2 = headEnterIndex;
    while (++index2 < tailExitIndex) {
      if (events[index2][1].type === "codeTextData") {
        events[headEnterIndex][1].type = "codeTextPadding";
        events[tailExitIndex][1].type = "codeTextPadding";
        headEnterIndex += 2;
        tailExitIndex -= 2;
        break;
      }
    }
  }
  index2 = headEnterIndex - 1;
  tailExitIndex++;
  while (++index2 <= tailExitIndex) {
    if (enter === void 0) {
      if (index2 !== tailExitIndex && events[index2][1].type !== "lineEnding") {
        enter = index2;
      }
    } else if (index2 === tailExitIndex || events[index2][1].type === "lineEnding") {
      events[enter][1].type = "codeTextData";
      if (index2 !== enter + 2) {
        events[enter][1].end = events[index2 - 1][1].end;
        events.splice(enter + 2, index2 - enter - 2);
        tailExitIndex -= index2 - enter - 2;
        index2 = enter + 2;
      }
      enter = void 0;
    }
  }
  return events;
}
function previous(code2) {
  return code2 !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
}
function tokenizeCodeText(effects, ok3, nok) {
  const self = this;
  let sizeOpen = 0;
  let size;
  let token;
  return start;
  function start(code2) {
    effects.enter("codeText");
    effects.enter("codeTextSequence");
    return sequenceOpen(code2);
  }
  function sequenceOpen(code2) {
    if (code2 === 96) {
      effects.consume(code2);
      sizeOpen++;
      return sequenceOpen;
    }
    effects.exit("codeTextSequence");
    return between(code2);
  }
  function between(code2) {
    if (code2 === null) {
      return nok(code2);
    }
    if (code2 === 32) {
      effects.enter("space");
      effects.consume(code2);
      effects.exit("space");
      return between;
    }
    if (code2 === 96) {
      token = effects.enter("codeTextSequence");
      size = 0;
      return sequenceClose(code2);
    }
    if (markdownLineEnding2(code2)) {
      effects.enter("lineEnding");
      effects.consume(code2);
      effects.exit("lineEnding");
      return between;
    }
    effects.enter("codeTextData");
    return data(code2);
  }
  function data(code2) {
    if (code2 === null || code2 === 32 || code2 === 96 || markdownLineEnding2(code2)) {
      effects.exit("codeTextData");
      return between(code2);
    }
    effects.consume(code2);
    return data;
  }
  function sequenceClose(code2) {
    if (code2 === 96) {
      effects.consume(code2);
      size++;
      return sequenceClose;
    }
    if (size === sizeOpen) {
      effects.exit("codeTextSequence");
      effects.exit("codeText");
      return ok3(code2);
    }
    token.type = "codeTextData";
    return data(code2);
  }
}

// node_modules/micromark-util-subtokenize/lib/splice-buffer.js
var SpliceBuffer = class {
  /**
   * @param {ReadonlyArray<T> | null | undefined} [initial]
   *   Initial items (optional).
   * @returns
   *   Splice buffer.
   */
  constructor(initial) {
    this.left = initial ? [...initial] : [];
    this.right = [];
  }
  /**
   * Array access;
   * does not move the cursor.
   *
   * @param {number} index
   *   Index.
   * @return {T}
   *   Item.
   */
  get(index2) {
    if (index2 < 0 || index2 >= this.left.length + this.right.length) {
      throw new RangeError("Cannot access index `" + index2 + "` in a splice buffer of size `" + (this.left.length + this.right.length) + "`");
    }
    if (index2 < this.left.length) return this.left[index2];
    return this.right[this.right.length - index2 + this.left.length - 1];
  }
  /**
   * The length of the splice buffer, one greater than the largest index in the
   * array.
   */
  get length() {
    return this.left.length + this.right.length;
  }
  /**
   * Remove and return `list[0]`;
   * moves the cursor to `0`.
   *
   * @returns {T | undefined}
   *   Item, optional.
   */
  shift() {
    this.setCursor(0);
    return this.right.pop();
  }
  /**
   * Slice the buffer to get an array;
   * does not move the cursor.
   *
   * @param {number} start
   *   Start.
   * @param {number | null | undefined} [end]
   *   End (optional).
   * @returns {Array<T>}
   *   Array of items.
   */
  slice(start, end) {
    const stop = end === null || end === void 0 ? Number.POSITIVE_INFINITY : end;
    if (stop < this.left.length) {
      return this.left.slice(start, stop);
    }
    if (start > this.left.length) {
      return this.right.slice(this.right.length - stop + this.left.length, this.right.length - start + this.left.length).reverse();
    }
    return this.left.slice(start).concat(this.right.slice(this.right.length - stop + this.left.length).reverse());
  }
  /**
   * Mimics the behavior of Array.prototype.splice() except for the change of
   * interface necessary to avoid segfaults when patching in very large arrays.
   *
   * This operation moves cursor is moved to `start` and results in the cursor
   * placed after any inserted items.
   *
   * @param {number} start
   *   Start;
   *   zero-based index at which to start changing the array;
   *   negative numbers count backwards from the end of the array and values
   *   that are out-of bounds are clamped to the appropriate end of the array.
   * @param {number | null | undefined} [deleteCount=0]
   *   Delete count (default: `0`);
   *   maximum number of elements to delete, starting from start.
   * @param {Array<T> | null | undefined} [items=[]]
   *   Items to include in place of the deleted items (default: `[]`).
   * @return {Array<T>}
   *   Any removed items.
   */
  splice(start, deleteCount, items) {
    const count = deleteCount || 0;
    this.setCursor(Math.trunc(start));
    const removed = this.right.splice(this.right.length - count, Number.POSITIVE_INFINITY);
    if (items) chunkedPush(this.left, items);
    return removed.reverse();
  }
  /**
   * Remove and return the highest-numbered item in the array, so
   * `list[list.length - 1]`;
   * Moves the cursor to `length`.
   *
   * @returns {T | undefined}
   *   Item, optional.
   */
  pop() {
    this.setCursor(Number.POSITIVE_INFINITY);
    return this.left.pop();
  }
  /**
   * Inserts a single item to the high-numbered side of the array;
   * moves the cursor to `length`.
   *
   * @param {T} item
   *   Item.
   * @returns {undefined}
   *   Nothing.
   */
  push(item) {
    this.setCursor(Number.POSITIVE_INFINITY);
    this.left.push(item);
  }
  /**
   * Inserts many items to the high-numbered side of the array.
   * Moves the cursor to `length`.
   *
   * @param {Array<T>} items
   *   Items.
   * @returns {undefined}
   *   Nothing.
   */
  pushMany(items) {
    this.setCursor(Number.POSITIVE_INFINITY);
    chunkedPush(this.left, items);
  }
  /**
   * Inserts a single item to the low-numbered side of the array;
   * Moves the cursor to `0`.
   *
   * @param {T} item
   *   Item.
   * @returns {undefined}
   *   Nothing.
   */
  unshift(item) {
    this.setCursor(0);
    this.right.push(item);
  }
  /**
   * Inserts many items to the low-numbered side of the array;
   * moves the cursor to `0`.
   *
   * @param {Array<T>} items
   *   Items.
   * @returns {undefined}
   *   Nothing.
   */
  unshiftMany(items) {
    this.setCursor(0);
    chunkedPush(this.right, items.reverse());
  }
  /**
   * Move the cursor to a specific position in the array. Requires
   * time proportional to the distance moved.
   *
   * If `n < 0`, the cursor will end up at the beginning.
   * If `n > length`, the cursor will end up at the end.
   *
   * @param {number} n
   *   Position.
   * @return {undefined}
   *   Nothing.
   */
  setCursor(n) {
    if (n === this.left.length || n > this.left.length && this.right.length === 0 || n < 0 && this.left.length === 0) return;
    if (n < this.left.length) {
      const removed = this.left.splice(n, Number.POSITIVE_INFINITY);
      chunkedPush(this.right, removed.reverse());
    } else {
      const removed = this.right.splice(this.left.length + this.right.length - n, Number.POSITIVE_INFINITY);
      chunkedPush(this.left, removed.reverse());
    }
  }
};
function chunkedPush(list2, right) {
  let chunkStart = 0;
  if (right.length < 1e4) {
    list2.push(...right);
  } else {
    while (chunkStart < right.length) {
      list2.push(...right.slice(chunkStart, chunkStart + 1e4));
      chunkStart += 1e4;
    }
  }
}

// node_modules/micromark-util-subtokenize/index.js
function subtokenize(eventsArray) {
  const jumps = {};
  let index2 = -1;
  let event;
  let lineIndex;
  let otherIndex;
  let otherEvent;
  let parameters;
  let subevents;
  let more;
  const events = new SpliceBuffer(eventsArray);
  while (++index2 < events.length) {
    while (index2 in jumps) {
      index2 = jumps[index2];
    }
    event = events.get(index2);
    if (index2 && event[1].type === "chunkFlow" && events.get(index2 - 1)[1].type === "listItemPrefix") {
      subevents = event[1]._tokenizer.events;
      otherIndex = 0;
      if (otherIndex < subevents.length && subevents[otherIndex][1].type === "lineEndingBlank") {
        otherIndex += 2;
      }
      if (otherIndex < subevents.length && subevents[otherIndex][1].type === "content") {
        while (++otherIndex < subevents.length) {
          if (subevents[otherIndex][1].type === "content") {
            break;
          }
          if (subevents[otherIndex][1].type === "chunkText") {
            subevents[otherIndex][1]._isInFirstContentOfListItem = true;
            otherIndex++;
          }
        }
      }
    }
    if (event[0] === "enter") {
      if (event[1].contentType) {
        Object.assign(jumps, subcontent(events, index2));
        index2 = jumps[index2];
        more = true;
      }
    } else if (event[1]._container) {
      otherIndex = index2;
      lineIndex = void 0;
      while (otherIndex--) {
        otherEvent = events.get(otherIndex);
        if (otherEvent[1].type === "lineEnding" || otherEvent[1].type === "lineEndingBlank") {
          if (otherEvent[0] === "enter") {
            if (lineIndex) {
              events.get(lineIndex)[1].type = "lineEndingBlank";
            }
            otherEvent[1].type = "lineEnding";
            lineIndex = otherIndex;
          }
        } else if (otherEvent[1].type === "linePrefix" || otherEvent[1].type === "listItemIndent") {
        } else {
          break;
        }
      }
      if (lineIndex) {
        event[1].end = {
          ...events.get(lineIndex)[1].start
        };
        parameters = events.slice(lineIndex, index2);
        parameters.unshift(event);
        events.splice(lineIndex, index2 - lineIndex + 1, parameters);
      }
    }
  }
  splice(eventsArray, 0, Number.POSITIVE_INFINITY, events.slice(0));
  return !more;
}
function subcontent(events, eventIndex) {
  const token = events.get(eventIndex)[1];
  const context = events.get(eventIndex)[2];
  let startPosition = eventIndex - 1;
  const startPositions = [];
  let tokenizer = token._tokenizer;
  if (!tokenizer) {
    tokenizer = context.parser[token.contentType](token.start);
    if (token._contentTypeTextTrailing) {
      tokenizer._contentTypeTextTrailing = true;
    }
  }
  const childEvents = tokenizer.events;
  const jumps = [];
  const gaps = {};
  let stream;
  let previous4;
  let index2 = -1;
  let current = token;
  let adjust = 0;
  let start = 0;
  const breaks = [start];
  while (current) {
    while (events.get(++startPosition)[1] !== current) {
    }
    startPositions.push(startPosition);
    if (!current._tokenizer) {
      stream = context.sliceStream(current);
      if (!current.next) {
        stream.push(null);
      }
      if (previous4) {
        tokenizer.defineSkip(current.start);
      }
      if (current._isInFirstContentOfListItem) {
        tokenizer._gfmTasklistFirstContentOfListItem = true;
      }
      tokenizer.write(stream);
      if (current._isInFirstContentOfListItem) {
        tokenizer._gfmTasklistFirstContentOfListItem = void 0;
      }
    }
    previous4 = current;
    current = current.next;
  }
  current = token;
  while (++index2 < childEvents.length) {
    if (
      // Find a void token that includes a break.
      childEvents[index2][0] === "exit" && childEvents[index2 - 1][0] === "enter" && childEvents[index2][1].type === childEvents[index2 - 1][1].type && childEvents[index2][1].start.line !== childEvents[index2][1].end.line
    ) {
      start = index2 + 1;
      breaks.push(start);
      current._tokenizer = void 0;
      current.previous = void 0;
      current = current.next;
    }
  }
  tokenizer.events = [];
  if (current) {
    current._tokenizer = void 0;
    current.previous = void 0;
  } else {
    breaks.pop();
  }
  index2 = breaks.length;
  while (index2--) {
    const slice = childEvents.slice(breaks[index2], breaks[index2 + 1]);
    const start2 = startPositions.pop();
    jumps.push([start2, start2 + slice.length - 1]);
    events.splice(start2, 2, slice);
  }
  jumps.reverse();
  index2 = -1;
  while (++index2 < jumps.length) {
    gaps[adjust + jumps[index2][0]] = adjust + jumps[index2][1];
    adjust += jumps[index2][1] - jumps[index2][0] - 1;
  }
  return gaps;
}

// node_modules/micromark-core-commonmark/lib/content.js
var content2 = {
  resolve: resolveContent,
  tokenize: tokenizeContent
};
var continuationConstruct = {
  partial: true,
  tokenize: tokenizeContinuation
};
function resolveContent(events) {
  subtokenize(events);
  return events;
}
function tokenizeContent(effects, ok3) {
  let previous4;
  return chunkStart;
  function chunkStart(code2) {
    effects.enter("content");
    previous4 = effects.enter("chunkContent", {
      contentType: "content"
    });
    return chunkInside(code2);
  }
  function chunkInside(code2) {
    if (code2 === null) {
      return contentEnd(code2);
    }
    if (markdownLineEnding2(code2)) {
      return effects.check(continuationConstruct, contentContinue, contentEnd)(code2);
    }
    effects.consume(code2);
    return chunkInside;
  }
  function contentEnd(code2) {
    effects.exit("chunkContent");
    effects.exit("content");
    return ok3(code2);
  }
  function contentContinue(code2) {
    effects.consume(code2);
    effects.exit("chunkContent");
    previous4.next = effects.enter("chunkContent", {
      contentType: "content",
      previous: previous4
    });
    previous4 = previous4.next;
    return chunkInside;
  }
}
function tokenizeContinuation(effects, ok3, nok) {
  const self = this;
  return startLookahead;
  function startLookahead(code2) {
    effects.exit("chunkContent");
    effects.enter("lineEnding");
    effects.consume(code2);
    effects.exit("lineEnding");
    return factorySpace(effects, prefixed, "linePrefix");
  }
  function prefixed(code2) {
    if (code2 === null || markdownLineEnding2(code2)) {
      return nok(code2);
    }
    const tail = self.events[self.events.length - 1];
    if (!self.parser.constructs.disable.null.includes("codeIndented") && tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4) {
      return ok3(code2);
    }
    return effects.interrupt(self.parser.constructs.flow, nok, ok3)(code2);
  }
}

// node_modules/micromark-factory-destination/index.js
function factoryDestination(effects, ok3, nok, type, literalType, literalMarkerType, rawType, stringType, max) {
  const limit = max || Number.POSITIVE_INFINITY;
  let balance = 0;
  return start;
  function start(code2) {
    if (code2 === 60) {
      effects.enter(type);
      effects.enter(literalType);
      effects.enter(literalMarkerType);
      effects.consume(code2);
      effects.exit(literalMarkerType);
      return enclosedBefore;
    }
    if (code2 === null || code2 === 32 || code2 === 41 || asciiControl(code2)) {
      return nok(code2);
    }
    effects.enter(type);
    effects.enter(rawType);
    effects.enter(stringType);
    effects.enter("chunkString", {
      contentType: "string"
    });
    return raw(code2);
  }
  function enclosedBefore(code2) {
    if (code2 === 62) {
      effects.enter(literalMarkerType);
      effects.consume(code2);
      effects.exit(literalMarkerType);
      effects.exit(literalType);
      effects.exit(type);
      return ok3;
    }
    effects.enter(stringType);
    effects.enter("chunkString", {
      contentType: "string"
    });
    return enclosed(code2);
  }
  function enclosed(code2) {
    if (code2 === 62) {
      effects.exit("chunkString");
      effects.exit(stringType);
      return enclosedBefore(code2);
    }
    if (code2 === null || code2 === 60 || markdownLineEnding2(code2)) {
      return nok(code2);
    }
    effects.consume(code2);
    return code2 === 92 ? enclosedEscape : enclosed;
  }
  function enclosedEscape(code2) {
    if (code2 === 60 || code2 === 62 || code2 === 92) {
      effects.consume(code2);
      return enclosed;
    }
    return enclosed(code2);
  }
  function raw(code2) {
    if (!balance && (code2 === null || code2 === 41 || markdownLineEndingOrSpace2(code2))) {
      effects.exit("chunkString");
      effects.exit(stringType);
      effects.exit(rawType);
      effects.exit(type);
      return ok3(code2);
    }
    if (balance < limit && code2 === 40) {
      effects.consume(code2);
      balance++;
      return raw;
    }
    if (code2 === 41) {
      effects.consume(code2);
      balance--;
      return raw;
    }
    if (code2 === null || code2 === 32 || code2 === 40 || asciiControl(code2)) {
      return nok(code2);
    }
    effects.consume(code2);
    return code2 === 92 ? rawEscape : raw;
  }
  function rawEscape(code2) {
    if (code2 === 40 || code2 === 41 || code2 === 92) {
      effects.consume(code2);
      return raw;
    }
    return raw(code2);
  }
}

// node_modules/micromark-factory-label/index.js
function factoryLabel(effects, ok3, nok, type, markerType, stringType) {
  const self = this;
  let size = 0;
  let seen;
  return start;
  function start(code2) {
    effects.enter(type);
    effects.enter(markerType);
    effects.consume(code2);
    effects.exit(markerType);
    effects.enter(stringType);
    return atBreak;
  }
  function atBreak(code2) {
    if (size > 999 || code2 === null || code2 === 91 || code2 === 93 && !seen || // To do: remove in the future once we’ve switched from
    // `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
    // which doesn’t need this.
    // Hidden footnotes hook.
    /* c8 ignore next 3 */
    code2 === 94 && !size && "_hiddenFootnoteSupport" in self.parser.constructs) {
      return nok(code2);
    }
    if (code2 === 93) {
      effects.exit(stringType);
      effects.enter(markerType);
      effects.consume(code2);
      effects.exit(markerType);
      effects.exit(type);
      return ok3;
    }
    if (markdownLineEnding2(code2)) {
      effects.enter("lineEnding");
      effects.consume(code2);
      effects.exit("lineEnding");
      return atBreak;
    }
    effects.enter("chunkString", {
      contentType: "string"
    });
    return labelInside(code2);
  }
  function labelInside(code2) {
    if (code2 === null || code2 === 91 || code2 === 93 || markdownLineEnding2(code2) || size++ > 999) {
      effects.exit("chunkString");
      return atBreak(code2);
    }
    effects.consume(code2);
    if (!seen) seen = !markdownSpace(code2);
    return code2 === 92 ? labelEscape : labelInside;
  }
  function labelEscape(code2) {
    if (code2 === 91 || code2 === 92 || code2 === 93) {
      effects.consume(code2);
      size++;
      return labelInside;
    }
    return labelInside(code2);
  }
}

// node_modules/micromark-factory-title/index.js
function factoryTitle(effects, ok3, nok, type, markerType, stringType) {
  let marker;
  return start;
  function start(code2) {
    if (code2 === 34 || code2 === 39 || code2 === 40) {
      effects.enter(type);
      effects.enter(markerType);
      effects.consume(code2);
      effects.exit(markerType);
      marker = code2 === 40 ? 41 : code2;
      return begin;
    }
    return nok(code2);
  }
  function begin(code2) {
    if (code2 === marker) {
      effects.enter(markerType);
      effects.consume(code2);
      effects.exit(markerType);
      effects.exit(type);
      return ok3;
    }
    effects.enter(stringType);
    return atBreak(code2);
  }
  function atBreak(code2) {
    if (code2 === marker) {
      effects.exit(stringType);
      return begin(marker);
    }
    if (code2 === null) {
      return nok(code2);
    }
    if (markdownLineEnding2(code2)) {
      effects.enter("lineEnding");
      effects.consume(code2);
      effects.exit("lineEnding");
      return factorySpace(effects, atBreak, "linePrefix");
    }
    effects.enter("chunkString", {
      contentType: "string"
    });
    return inside(code2);
  }
  function inside(code2) {
    if (code2 === marker || code2 === null || markdownLineEnding2(code2)) {
      effects.exit("chunkString");
      return atBreak(code2);
    }
    effects.consume(code2);
    return code2 === 92 ? escape : inside;
  }
  function escape(code2) {
    if (code2 === marker || code2 === 92) {
      effects.consume(code2);
      return inside;
    }
    return inside(code2);
  }
}

// node_modules/micromark-factory-whitespace/index.js
function factoryWhitespace(effects, ok3) {
  let seen;
  return start;
  function start(code2) {
    if (markdownLineEnding2(code2)) {
      effects.enter("lineEnding");
      effects.consume(code2);
      effects.exit("lineEnding");
      seen = true;
      return start;
    }
    if (markdownSpace(code2)) {
      return factorySpace(effects, start, seen ? "linePrefix" : "lineSuffix")(code2);
    }
    return ok3(code2);
  }
}

// node_modules/micromark-core-commonmark/lib/definition.js
var definition = {
  name: "definition",
  tokenize: tokenizeDefinition
};
var titleBefore = {
  partial: true,
  tokenize: tokenizeTitleBefore
};
function tokenizeDefinition(effects, ok3, nok) {
  const self = this;
  let identifier;
  return start;
  function start(code2) {
    effects.enter("definition");
    return before(code2);
  }
  function before(code2) {
    return factoryLabel.call(
      self,
      effects,
      labelAfter,
      // Note: we don’t need to reset the way `markdown-rs` does.
      nok,
      "definitionLabel",
      "definitionLabelMarker",
      "definitionLabelString"
    )(code2);
  }
  function labelAfter(code2) {
    identifier = normalizeIdentifier(self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1));
    if (code2 === 58) {
      effects.enter("definitionMarker");
      effects.consume(code2);
      effects.exit("definitionMarker");
      return markerAfter;
    }
    return nok(code2);
  }
  function markerAfter(code2) {
    return markdownLineEndingOrSpace2(code2) ? factoryWhitespace(effects, destinationBefore)(code2) : destinationBefore(code2);
  }
  function destinationBefore(code2) {
    return factoryDestination(
      effects,
      destinationAfter,
      // Note: we don’t need to reset the way `markdown-rs` does.
      nok,
      "definitionDestination",
      "definitionDestinationLiteral",
      "definitionDestinationLiteralMarker",
      "definitionDestinationRaw",
      "definitionDestinationString"
    )(code2);
  }
  function destinationAfter(code2) {
    return effects.attempt(titleBefore, after, after)(code2);
  }
  function after(code2) {
    return markdownSpace(code2) ? factorySpace(effects, afterWhitespace, "whitespace")(code2) : afterWhitespace(code2);
  }
  function afterWhitespace(code2) {
    if (code2 === null || markdownLineEnding2(code2)) {
      effects.exit("definition");
      self.parser.defined.push(identifier);
      return ok3(code2);
    }
    return nok(code2);
  }
}
function tokenizeTitleBefore(effects, ok3, nok) {
  return titleBefore2;
  function titleBefore2(code2) {
    return markdownLineEndingOrSpace2(code2) ? factoryWhitespace(effects, beforeMarker)(code2) : nok(code2);
  }
  function beforeMarker(code2) {
    return factoryTitle(effects, titleAfter, nok, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(code2);
  }
  function titleAfter(code2) {
    return markdownSpace(code2) ? factorySpace(effects, titleAfterOptionalWhitespace, "whitespace")(code2) : titleAfterOptionalWhitespace(code2);
  }
  function titleAfterOptionalWhitespace(code2) {
    return code2 === null || markdownLineEnding2(code2) ? ok3(code2) : nok(code2);
  }
}

// node_modules/micromark-core-commonmark/lib/hard-break-escape.js
var hardBreakEscape = {
  name: "hardBreakEscape",
  tokenize: tokenizeHardBreakEscape
};
function tokenizeHardBreakEscape(effects, ok3, nok) {
  return start;
  function start(code2) {
    effects.enter("hardBreakEscape");
    effects.consume(code2);
    return after;
  }
  function after(code2) {
    if (markdownLineEnding2(code2)) {
      effects.exit("hardBreakEscape");
      return ok3(code2);
    }
    return nok(code2);
  }
}

// node_modules/micromark-core-commonmark/lib/heading-atx.js
var headingAtx = {
  name: "headingAtx",
  resolve: resolveHeadingAtx,
  tokenize: tokenizeHeadingAtx
};
function resolveHeadingAtx(events, context) {
  let contentEnd = events.length - 2;
  let contentStart = 3;
  let content3;
  let text4;
  if (events[contentStart][1].type === "whitespace") {
    contentStart += 2;
  }
  if (contentEnd - 2 > contentStart && events[contentEnd][1].type === "whitespace") {
    contentEnd -= 2;
  }
  if (events[contentEnd][1].type === "atxHeadingSequence" && (contentStart === contentEnd - 1 || contentEnd - 4 > contentStart && events[contentEnd - 2][1].type === "whitespace")) {
    contentEnd -= contentStart + 1 === contentEnd ? 2 : 4;
  }
  if (contentEnd > contentStart) {
    content3 = {
      type: "atxHeadingText",
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end
    };
    text4 = {
      type: "chunkText",
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end,
      contentType: "text"
    };
    splice(events, contentStart, contentEnd - contentStart + 1, [["enter", content3, context], ["enter", text4, context], ["exit", text4, context], ["exit", content3, context]]);
  }
  return events;
}
function tokenizeHeadingAtx(effects, ok3, nok) {
  let size = 0;
  return start;
  function start(code2) {
    effects.enter("atxHeading");
    return before(code2);
  }
  function before(code2) {
    effects.enter("atxHeadingSequence");
    return sequenceOpen(code2);
  }
  function sequenceOpen(code2) {
    if (code2 === 35 && size++ < 6) {
      effects.consume(code2);
      return sequenceOpen;
    }
    if (code2 === null || markdownLineEndingOrSpace2(code2)) {
      effects.exit("atxHeadingSequence");
      return atBreak(code2);
    }
    return nok(code2);
  }
  function atBreak(code2) {
    if (code2 === 35) {
      effects.enter("atxHeadingSequence");
      return sequenceFurther(code2);
    }
    if (code2 === null || markdownLineEnding2(code2)) {
      effects.exit("atxHeading");
      return ok3(code2);
    }
    if (markdownSpace(code2)) {
      return factorySpace(effects, atBreak, "whitespace")(code2);
    }
    effects.enter("atxHeadingText");
    return data(code2);
  }
  function sequenceFurther(code2) {
    if (code2 === 35) {
      effects.consume(code2);
      return sequenceFurther;
    }
    effects.exit("atxHeadingSequence");
    return atBreak(code2);
  }
  function data(code2) {
    if (code2 === null || code2 === 35 || markdownLineEndingOrSpace2(code2)) {
      effects.exit("atxHeadingText");
      return atBreak(code2);
    }
    effects.consume(code2);
    return data;
  }
}

// node_modules/micromark-util-html-tag-name/index.js
var htmlBlockNames = [
  "address",
  "article",
  "aside",
  "base",
  "basefont",
  "blockquote",
  "body",
  "caption",
  "center",
  "col",
  "colgroup",
  "dd",
  "details",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "iframe",
  "legend",
  "li",
  "link",
  "main",
  "menu",
  "menuitem",
  "nav",
  "noframes",
  "ol",
  "optgroup",
  "option",
  "p",
  "param",
  "search",
  "section",
  "summary",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "title",
  "tr",
  "track",
  "ul"
];
var htmlRawNames = ["pre", "script", "style", "textarea"];

// node_modules/micromark-core-commonmark/lib/html-flow.js
var htmlFlow = {
  concrete: true,
  name: "htmlFlow",
  resolveTo: resolveToHtmlFlow,
  tokenize: tokenizeHtmlFlow
};
var blankLineBefore = {
  partial: true,
  tokenize: tokenizeBlankLineBefore
};
var nonLazyContinuationStart = {
  partial: true,
  tokenize: tokenizeNonLazyContinuationStart
};
function resolveToHtmlFlow(events) {
  let index2 = events.length;
  while (index2--) {
    if (events[index2][0] === "enter" && events[index2][1].type === "htmlFlow") {
      break;
    }
  }
  if (index2 > 1 && events[index2 - 2][1].type === "linePrefix") {
    events[index2][1].start = events[index2 - 2][1].start;
    events[index2 + 1][1].start = events[index2 - 2][1].start;
    events.splice(index2 - 2, 2);
  }
  return events;
}
function tokenizeHtmlFlow(effects, ok3, nok) {
  const self = this;
  let marker;
  let closingTag;
  let buffer;
  let index2;
  let markerB;
  return start;
  function start(code2) {
    return before(code2);
  }
  function before(code2) {
    effects.enter("htmlFlow");
    effects.enter("htmlFlowData");
    effects.consume(code2);
    return open;
  }
  function open(code2) {
    if (code2 === 33) {
      effects.consume(code2);
      return declarationOpen;
    }
    if (code2 === 47) {
      effects.consume(code2);
      closingTag = true;
      return tagCloseStart;
    }
    if (code2 === 63) {
      effects.consume(code2);
      marker = 3;
      return self.interrupt ? ok3 : continuationDeclarationInside;
    }
    if (asciiAlpha(code2)) {
      effects.consume(code2);
      buffer = String.fromCharCode(code2);
      return tagName;
    }
    return nok(code2);
  }
  function declarationOpen(code2) {
    if (code2 === 45) {
      effects.consume(code2);
      marker = 2;
      return commentOpenInside;
    }
    if (code2 === 91) {
      effects.consume(code2);
      marker = 5;
      index2 = 0;
      return cdataOpenInside;
    }
    if (asciiAlpha(code2)) {
      effects.consume(code2);
      marker = 4;
      return self.interrupt ? ok3 : continuationDeclarationInside;
    }
    return nok(code2);
  }
  function commentOpenInside(code2) {
    if (code2 === 45) {
      effects.consume(code2);
      return self.interrupt ? ok3 : continuationDeclarationInside;
    }
    return nok(code2);
  }
  function cdataOpenInside(code2) {
    const value = "CDATA[";
    if (code2 === value.charCodeAt(index2++)) {
      effects.consume(code2);
      if (index2 === value.length) {
        return self.interrupt ? ok3 : continuation;
      }
      return cdataOpenInside;
    }
    return nok(code2);
  }
  function tagCloseStart(code2) {
    if (asciiAlpha(code2)) {
      effects.consume(code2);
      buffer = String.fromCharCode(code2);
      return tagName;
    }
    return nok(code2);
  }
  function tagName(code2) {
    if (code2 === null || code2 === 47 || code2 === 62 || markdownLineEndingOrSpace2(code2)) {
      const slash = code2 === 47;
      const name = buffer.toLowerCase();
      if (!slash && !closingTag && htmlRawNames.includes(name)) {
        marker = 1;
        return self.interrupt ? ok3(code2) : continuation(code2);
      }
      if (htmlBlockNames.includes(buffer.toLowerCase())) {
        marker = 6;
        if (slash) {
          effects.consume(code2);
          return basicSelfClosing;
        }
        return self.interrupt ? ok3(code2) : continuation(code2);
      }
      marker = 7;
      return self.interrupt && !self.parser.lazy[self.now().line] ? nok(code2) : closingTag ? completeClosingTagAfter(code2) : completeAttributeNameBefore(code2);
    }
    if (code2 === 45 || asciiAlphanumeric(code2)) {
      effects.consume(code2);
      buffer += String.fromCharCode(code2);
      return tagName;
    }
    return nok(code2);
  }
  function basicSelfClosing(code2) {
    if (code2 === 62) {
      effects.consume(code2);
      return self.interrupt ? ok3 : continuation;
    }
    return nok(code2);
  }
  function completeClosingTagAfter(code2) {
    if (markdownSpace(code2)) {
      effects.consume(code2);
      return completeClosingTagAfter;
    }
    return completeEnd(code2);
  }
  function completeAttributeNameBefore(code2) {
    if (code2 === 47) {
      effects.consume(code2);
      return completeEnd;
    }
    if (code2 === 58 || code2 === 95 || asciiAlpha(code2)) {
      effects.consume(code2);
      return completeAttributeName;
    }
    if (markdownSpace(code2)) {
      effects.consume(code2);
      return completeAttributeNameBefore;
    }
    return completeEnd(code2);
  }
  function completeAttributeName(code2) {
    if (code2 === 45 || code2 === 46 || code2 === 58 || code2 === 95 || asciiAlphanumeric(code2)) {
      effects.consume(code2);
      return completeAttributeName;
    }
    return completeAttributeNameAfter(code2);
  }
  function completeAttributeNameAfter(code2) {
    if (code2 === 61) {
      effects.consume(code2);
      return completeAttributeValueBefore;
    }
    if (markdownSpace(code2)) {
      effects.consume(code2);
      return completeAttributeNameAfter;
    }
    return completeAttributeNameBefore(code2);
  }
  function completeAttributeValueBefore(code2) {
    if (code2 === null || code2 === 60 || code2 === 61 || code2 === 62 || code2 === 96) {
      return nok(code2);
    }
    if (code2 === 34 || code2 === 39) {
      effects.consume(code2);
      markerB = code2;
      return completeAttributeValueQuoted;
    }
    if (markdownSpace(code2)) {
      effects.consume(code2);
      return completeAttributeValueBefore;
    }
    return completeAttributeValueUnquoted(code2);
  }
  function completeAttributeValueQuoted(code2) {
    if (code2 === markerB) {
      effects.consume(code2);
      markerB = null;
      return completeAttributeValueQuotedAfter;
    }
    if (code2 === null || markdownLineEnding2(code2)) {
      return nok(code2);
    }
    effects.consume(code2);
    return completeAttributeValueQuoted;
  }
  function completeAttributeValueUnquoted(code2) {
    if (code2 === null || code2 === 34 || code2 === 39 || code2 === 47 || code2 === 60 || code2 === 61 || code2 === 62 || code2 === 96 || markdownLineEndingOrSpace2(code2)) {
      return completeAttributeNameAfter(code2);
    }
    effects.consume(code2);
    return completeAttributeValueUnquoted;
  }
  function completeAttributeValueQuotedAfter(code2) {
    if (code2 === 47 || code2 === 62 || markdownSpace(code2)) {
      return completeAttributeNameBefore(code2);
    }
    return nok(code2);
  }
  function completeEnd(code2) {
    if (code2 === 62) {
      effects.consume(code2);
      return completeAfter;
    }
    return nok(code2);
  }
  function completeAfter(code2) {
    if (code2 === null || markdownLineEnding2(code2)) {
      return continuation(code2);
    }
    if (markdownSpace(code2)) {
      effects.consume(code2);
      return completeAfter;
    }
    return nok(code2);
  }
  function continuation(code2) {
    if (code2 === 45 && marker === 2) {
      effects.consume(code2);
      return continuationCommentInside;
    }
    if (code2 === 60 && marker === 1) {
      effects.consume(code2);
      return continuationRawTagOpen;
    }
    if (code2 === 62 && marker === 4) {
      effects.consume(code2);
      return continuationClose;
    }
    if (code2 === 63 && marker === 3) {
      effects.consume(code2);
      return continuationDeclarationInside;
    }
    if (code2 === 93 && marker === 5) {
      effects.consume(code2);
      return continuationCdataInside;
    }
    if (markdownLineEnding2(code2) && (marker === 6 || marker === 7)) {
      effects.exit("htmlFlowData");
      return effects.check(blankLineBefore, continuationAfter, continuationStart)(code2);
    }
    if (code2 === null || markdownLineEnding2(code2)) {
      effects.exit("htmlFlowData");
      return continuationStart(code2);
    }
    effects.consume(code2);
    return continuation;
  }
  function continuationStart(code2) {
    return effects.check(nonLazyContinuationStart, continuationStartNonLazy, continuationAfter)(code2);
  }
  function continuationStartNonLazy(code2) {
    effects.enter("lineEnding");
    effects.consume(code2);
    effects.exit("lineEnding");
    return continuationBefore;
  }
  function continuationBefore(code2) {
    if (code2 === null || markdownLineEnding2(code2)) {
      return continuationStart(code2);
    }
    effects.enter("htmlFlowData");
    return continuation(code2);
  }
  function continuationCommentInside(code2) {
    if (code2 === 45) {
      effects.consume(code2);
      return continuationDeclarationInside;
    }
    return continuation(code2);
  }
  function continuationRawTagOpen(code2) {
    if (code2 === 47) {
      effects.consume(code2);
      buffer = "";
      return continuationRawEndTag;
    }
    return continuation(code2);
  }
  function continuationRawEndTag(code2) {
    if (code2 === 62) {
      const name = buffer.toLowerCase();
      if (htmlRawNames.includes(name)) {
        effects.consume(code2);
        return continuationClose;
      }
      return continuation(code2);
    }
    if (asciiAlpha(code2) && buffer.length < 8) {
      effects.consume(code2);
      buffer += String.fromCharCode(code2);
      return continuationRawEndTag;
    }
    return continuation(code2);
  }
  function continuationCdataInside(code2) {
    if (code2 === 93) {
      effects.consume(code2);
      return continuationDeclarationInside;
    }
    return continuation(code2);
  }
  function continuationDeclarationInside(code2) {
    if (code2 === 62) {
      effects.consume(code2);
      return continuationClose;
    }
    if (code2 === 45 && marker === 2) {
      effects.consume(code2);
      return continuationDeclarationInside;
    }
    return continuation(code2);
  }
  function continuationClose(code2) {
    if (code2 === null || markdownLineEnding2(code2)) {
      effects.exit("htmlFlowData");
      return continuationAfter(code2);
    }
    effects.consume(code2);
    return continuationClose;
  }
  function continuationAfter(code2) {
    effects.exit("htmlFlow");
    return ok3(code2);
  }
}
function tokenizeNonLazyContinuationStart(effects, ok3, nok) {
  const self = this;
  return start;
  function start(code2) {
    if (markdownLineEnding2(code2)) {
      effects.enter("lineEnding");
      effects.consume(code2);
      effects.exit("lineEnding");
      return after;
    }
    return nok(code2);
  }
  function after(code2) {
    return self.parser.lazy[self.now().line] ? nok(code2) : ok3(code2);
  }
}
function tokenizeBlankLineBefore(effects, ok3, nok) {
  return start;
  function start(code2) {
    effects.enter("lineEnding");
    effects.consume(code2);
    effects.exit("lineEnding");
    return effects.attempt(blankLine, ok3, nok);
  }
}

// node_modules/micromark-core-commonmark/lib/html-text.js
var htmlText = {
  name: "htmlText",
  tokenize: tokenizeHtmlText
};
function tokenizeHtmlText(effects, ok3, nok) {
  const self = this;
  let marker;
  let index2;
  let returnState;
  return start;
  function start(code2) {
    effects.enter("htmlText");
    effects.enter("htmlTextData");
    effects.consume(code2);
    return open;
  }
  function open(code2) {
    if (code2 === 33) {
      effects.consume(code2);
      return declarationOpen;
    }
    if (code2 === 47) {
      effects.consume(code2);
      return tagCloseStart;
    }
    if (code2 === 63) {
      effects.consume(code2);
      return instruction;
    }
    if (asciiAlpha(code2)) {
      effects.consume(code2);
      return tagOpen;
    }
    return nok(code2);
  }
  function declarationOpen(code2) {
    if (code2 === 45) {
      effects.consume(code2);
      return commentOpenInside;
    }
    if (code2 === 91) {
      effects.consume(code2);
      index2 = 0;
      return cdataOpenInside;
    }
    if (asciiAlpha(code2)) {
      effects.consume(code2);
      return declaration;
    }
    return nok(code2);
  }
  function commentOpenInside(code2) {
    if (code2 === 45) {
      effects.consume(code2);
      return commentEnd;
    }
    return nok(code2);
  }
  function comment(code2) {
    if (code2 === null) {
      return nok(code2);
    }
    if (code2 === 45) {
      effects.consume(code2);
      return commentClose;
    }
    if (markdownLineEnding2(code2)) {
      returnState = comment;
      return lineEndingBefore(code2);
    }
    effects.consume(code2);
    return comment;
  }
  function commentClose(code2) {
    if (code2 === 45) {
      effects.consume(code2);
      return commentEnd;
    }
    return comment(code2);
  }
  function commentEnd(code2) {
    return code2 === 62 ? end(code2) : code2 === 45 ? commentClose(code2) : comment(code2);
  }
  function cdataOpenInside(code2) {
    const value = "CDATA[";
    if (code2 === value.charCodeAt(index2++)) {
      effects.consume(code2);
      return index2 === value.length ? cdata : cdataOpenInside;
    }
    return nok(code2);
  }
  function cdata(code2) {
    if (code2 === null) {
      return nok(code2);
    }
    if (code2 === 93) {
      effects.consume(code2);
      return cdataClose;
    }
    if (markdownLineEnding2(code2)) {
      returnState = cdata;
      return lineEndingBefore(code2);
    }
    effects.consume(code2);
    return cdata;
  }
  function cdataClose(code2) {
    if (code2 === 93) {
      effects.consume(code2);
      return cdataEnd;
    }
    return cdata(code2);
  }
  function cdataEnd(code2) {
    if (code2 === 62) {
      return end(code2);
    }
    if (code2 === 93) {
      effects.consume(code2);
      return cdataEnd;
    }
    return cdata(code2);
  }
  function declaration(code2) {
    if (code2 === null || code2 === 62) {
      return end(code2);
    }
    if (markdownLineEnding2(code2)) {
      returnState = declaration;
      return lineEndingBefore(code2);
    }
    effects.consume(code2);
    return declaration;
  }
  function instruction(code2) {
    if (code2 === null) {
      return nok(code2);
    }
    if (code2 === 63) {
      effects.consume(code2);
      return instructionClose;
    }
    if (markdownLineEnding2(code2)) {
      returnState = instruction;
      return lineEndingBefore(code2);
    }
    effects.consume(code2);
    return instruction;
  }
  function instructionClose(code2) {
    return code2 === 62 ? end(code2) : instruction(code2);
  }
  function tagCloseStart(code2) {
    if (asciiAlpha(code2)) {
      effects.consume(code2);
      return tagClose;
    }
    return nok(code2);
  }
  function tagClose(code2) {
    if (code2 === 45 || asciiAlphanumeric(code2)) {
      effects.consume(code2);
      return tagClose;
    }
    return tagCloseBetween(code2);
  }
  function tagCloseBetween(code2) {
    if (markdownLineEnding2(code2)) {
      returnState = tagCloseBetween;
      return lineEndingBefore(code2);
    }
    if (markdownSpace(code2)) {
      effects.consume(code2);
      return tagCloseBetween;
    }
    return end(code2);
  }
  function tagOpen(code2) {
    if (code2 === 45 || asciiAlphanumeric(code2)) {
      effects.consume(code2);
      return tagOpen;
    }
    if (code2 === 47 || code2 === 62 || markdownLineEndingOrSpace2(code2)) {
      return tagOpenBetween(code2);
    }
    return nok(code2);
  }
  function tagOpenBetween(code2) {
    if (code2 === 47) {
      effects.consume(code2);
      return end;
    }
    if (code2 === 58 || code2 === 95 || asciiAlpha(code2)) {
      effects.consume(code2);
      return tagOpenAttributeName;
    }
    if (markdownLineEnding2(code2)) {
      returnState = tagOpenBetween;
      return lineEndingBefore(code2);
    }
    if (markdownSpace(code2)) {
      effects.consume(code2);
      return tagOpenBetween;
    }
    return end(code2);
  }
  function tagOpenAttributeName(code2) {
    if (code2 === 45 || code2 === 46 || code2 === 58 || code2 === 95 || asciiAlphanumeric(code2)) {
      effects.consume(code2);
      return tagOpenAttributeName;
    }
    return tagOpenAttributeNameAfter(code2);
  }
  function tagOpenAttributeNameAfter(code2) {
    if (code2 === 61) {
      effects.consume(code2);
      return tagOpenAttributeValueBefore;
    }
    if (markdownLineEnding2(code2)) {
      returnState = tagOpenAttributeNameAfter;
      return lineEndingBefore(code2);
    }
    if (markdownSpace(code2)) {
      effects.consume(code2);
      return tagOpenAttributeNameAfter;
    }
    return tagOpenBetween(code2);
  }
  function tagOpenAttributeValueBefore(code2) {
    if (code2 === null || code2 === 60 || code2 === 61 || code2 === 62 || code2 === 96) {
      return nok(code2);
    }
    if (code2 === 34 || code2 === 39) {
      effects.consume(code2);
      marker = code2;
      return tagOpenAttributeValueQuoted;
    }
    if (markdownLineEnding2(code2)) {
      returnState = tagOpenAttributeValueBefore;
      return lineEndingBefore(code2);
    }
    if (markdownSpace(code2)) {
      effects.consume(code2);
      return tagOpenAttributeValueBefore;
    }
    effects.consume(code2);
    return tagOpenAttributeValueUnquoted;
  }
  function tagOpenAttributeValueQuoted(code2) {
    if (code2 === marker) {
      effects.consume(code2);
      marker = void 0;
      return tagOpenAttributeValueQuotedAfter;
    }
    if (code2 === null) {
      return nok(code2);
    }
    if (markdownLineEnding2(code2)) {
      returnState = tagOpenAttributeValueQuoted;
      return lineEndingBefore(code2);
    }
    effects.consume(code2);
    return tagOpenAttributeValueQuoted;
  }
  function tagOpenAttributeValueUnquoted(code2) {
    if (code2 === null || code2 === 34 || code2 === 39 || code2 === 60 || code2 === 61 || code2 === 96) {
      return nok(code2);
    }
    if (code2 === 47 || code2 === 62 || markdownLineEndingOrSpace2(code2)) {
      return tagOpenBetween(code2);
    }
    effects.consume(code2);
    return tagOpenAttributeValueUnquoted;
  }
  function tagOpenAttributeValueQuotedAfter(code2) {
    if (code2 === 47 || code2 === 62 || markdownLineEndingOrSpace2(code2)) {
      return tagOpenBetween(code2);
    }
    return nok(code2);
  }
  function end(code2) {
    if (code2 === 62) {
      effects.consume(code2);
      effects.exit("htmlTextData");
      effects.exit("htmlText");
      return ok3;
    }
    return nok(code2);
  }
  function lineEndingBefore(code2) {
    effects.exit("htmlTextData");
    effects.enter("lineEnding");
    effects.consume(code2);
    effects.exit("lineEnding");
    return lineEndingAfter;
  }
  function lineEndingAfter(code2) {
    return markdownSpace(code2) ? factorySpace(effects, lineEndingAfterPrefix, "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code2) : lineEndingAfterPrefix(code2);
  }
  function lineEndingAfterPrefix(code2) {
    effects.enter("htmlTextData");
    return returnState(code2);
  }
}

// node_modules/micromark-core-commonmark/lib/label-end.js
var labelEnd = {
  name: "labelEnd",
  resolveAll: resolveAllLabelEnd,
  resolveTo: resolveToLabelEnd,
  tokenize: tokenizeLabelEnd
};
var resourceConstruct = {
  tokenize: tokenizeResource
};
var referenceFullConstruct = {
  tokenize: tokenizeReferenceFull
};
var referenceCollapsedConstruct = {
  tokenize: tokenizeReferenceCollapsed
};
function resolveAllLabelEnd(events) {
  let index2 = -1;
  const newEvents = [];
  while (++index2 < events.length) {
    const token = events[index2][1];
    newEvents.push(events[index2]);
    if (token.type === "labelImage" || token.type === "labelLink" || token.type === "labelEnd") {
      const offset = token.type === "labelImage" ? 4 : 2;
      token.type = "data";
      index2 += offset;
    }
  }
  if (events.length !== newEvents.length) {
    splice(events, 0, events.length, newEvents);
  }
  return events;
}
function resolveToLabelEnd(events, context) {
  let index2 = events.length;
  let offset = 0;
  let token;
  let open;
  let close;
  let media;
  while (index2--) {
    token = events[index2][1];
    if (open) {
      if (token.type === "link" || token.type === "labelLink" && token._inactive) {
        break;
      }
      if (events[index2][0] === "enter" && token.type === "labelLink") {
        token._inactive = true;
      }
    } else if (close) {
      if (events[index2][0] === "enter" && (token.type === "labelImage" || token.type === "labelLink") && !token._balanced) {
        open = index2;
        if (token.type !== "labelLink") {
          offset = 2;
          break;
        }
      }
    } else if (token.type === "labelEnd") {
      close = index2;
    }
  }
  const group2 = {
    type: events[open][1].type === "labelLink" ? "link" : "image",
    start: {
      ...events[open][1].start
    },
    end: {
      ...events[events.length - 1][1].end
    }
  };
  const label = {
    type: "label",
    start: {
      ...events[open][1].start
    },
    end: {
      ...events[close][1].end
    }
  };
  const text4 = {
    type: "labelText",
    start: {
      ...events[open + offset + 2][1].end
    },
    end: {
      ...events[close - 2][1].start
    }
  };
  media = [["enter", group2, context], ["enter", label, context]];
  media = push(media, events.slice(open + 1, open + offset + 3));
  media = push(media, [["enter", text4, context]]);
  media = push(media, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + offset + 4, close - 3), context));
  media = push(media, [["exit", text4, context], events[close - 2], events[close - 1], ["exit", label, context]]);
  media = push(media, events.slice(close + 1));
  media = push(media, [["exit", group2, context]]);
  splice(events, open, events.length, media);
  return events;
}
function tokenizeLabelEnd(effects, ok3, nok) {
  const self = this;
  let index2 = self.events.length;
  let labelStart;
  let defined;
  while (index2--) {
    if ((self.events[index2][1].type === "labelImage" || self.events[index2][1].type === "labelLink") && !self.events[index2][1]._balanced) {
      labelStart = self.events[index2][1];
      break;
    }
  }
  return start;
  function start(code2) {
    if (!labelStart) {
      return nok(code2);
    }
    if (labelStart._inactive) {
      return labelEndNok(code2);
    }
    defined = self.parser.defined.includes(normalizeIdentifier(self.sliceSerialize({
      start: labelStart.end,
      end: self.now()
    })));
    effects.enter("labelEnd");
    effects.enter("labelMarker");
    effects.consume(code2);
    effects.exit("labelMarker");
    effects.exit("labelEnd");
    return after;
  }
  function after(code2) {
    if (code2 === 40) {
      return effects.attempt(resourceConstruct, labelEndOk, defined ? labelEndOk : labelEndNok)(code2);
    }
    if (code2 === 91) {
      return effects.attempt(referenceFullConstruct, labelEndOk, defined ? referenceNotFull : labelEndNok)(code2);
    }
    return defined ? labelEndOk(code2) : labelEndNok(code2);
  }
  function referenceNotFull(code2) {
    return effects.attempt(referenceCollapsedConstruct, labelEndOk, labelEndNok)(code2);
  }
  function labelEndOk(code2) {
    return ok3(code2);
  }
  function labelEndNok(code2) {
    labelStart._balanced = true;
    return nok(code2);
  }
}
function tokenizeResource(effects, ok3, nok) {
  return resourceStart;
  function resourceStart(code2) {
    effects.enter("resource");
    effects.enter("resourceMarker");
    effects.consume(code2);
    effects.exit("resourceMarker");
    return resourceBefore;
  }
  function resourceBefore(code2) {
    return markdownLineEndingOrSpace2(code2) ? factoryWhitespace(effects, resourceOpen)(code2) : resourceOpen(code2);
  }
  function resourceOpen(code2) {
    if (code2 === 41) {
      return resourceEnd(code2);
    }
    return factoryDestination(effects, resourceDestinationAfter, resourceDestinationMissing, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(code2);
  }
  function resourceDestinationAfter(code2) {
    return markdownLineEndingOrSpace2(code2) ? factoryWhitespace(effects, resourceBetween)(code2) : resourceEnd(code2);
  }
  function resourceDestinationMissing(code2) {
    return nok(code2);
  }
  function resourceBetween(code2) {
    if (code2 === 34 || code2 === 39 || code2 === 40) {
      return factoryTitle(effects, resourceTitleAfter, nok, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(code2);
    }
    return resourceEnd(code2);
  }
  function resourceTitleAfter(code2) {
    return markdownLineEndingOrSpace2(code2) ? factoryWhitespace(effects, resourceEnd)(code2) : resourceEnd(code2);
  }
  function resourceEnd(code2) {
    if (code2 === 41) {
      effects.enter("resourceMarker");
      effects.consume(code2);
      effects.exit("resourceMarker");
      effects.exit("resource");
      return ok3;
    }
    return nok(code2);
  }
}
function tokenizeReferenceFull(effects, ok3, nok) {
  const self = this;
  return referenceFull;
  function referenceFull(code2) {
    return factoryLabel.call(self, effects, referenceFullAfter, referenceFullMissing, "reference", "referenceMarker", "referenceString")(code2);
  }
  function referenceFullAfter(code2) {
    return self.parser.defined.includes(normalizeIdentifier(self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1))) ? ok3(code2) : nok(code2);
  }
  function referenceFullMissing(code2) {
    return nok(code2);
  }
}
function tokenizeReferenceCollapsed(effects, ok3, nok) {
  return referenceCollapsedStart;
  function referenceCollapsedStart(code2) {
    effects.enter("reference");
    effects.enter("referenceMarker");
    effects.consume(code2);
    effects.exit("referenceMarker");
    return referenceCollapsedOpen;
  }
  function referenceCollapsedOpen(code2) {
    if (code2 === 93) {
      effects.enter("referenceMarker");
      effects.consume(code2);
      effects.exit("referenceMarker");
      effects.exit("reference");
      return ok3;
    }
    return nok(code2);
  }
}

// node_modules/micromark-core-commonmark/lib/label-start-image.js
var labelStartImage = {
  name: "labelStartImage",
  resolveAll: labelEnd.resolveAll,
  tokenize: tokenizeLabelStartImage
};
function tokenizeLabelStartImage(effects, ok3, nok) {
  const self = this;
  return start;
  function start(code2) {
    effects.enter("labelImage");
    effects.enter("labelImageMarker");
    effects.consume(code2);
    effects.exit("labelImageMarker");
    return open;
  }
  function open(code2) {
    if (code2 === 91) {
      effects.enter("labelMarker");
      effects.consume(code2);
      effects.exit("labelMarker");
      effects.exit("labelImage");
      return after;
    }
    return nok(code2);
  }
  function after(code2) {
    return code2 === 94 && "_hiddenFootnoteSupport" in self.parser.constructs ? nok(code2) : ok3(code2);
  }
}

// node_modules/micromark-core-commonmark/lib/label-start-link.js
var labelStartLink = {
  name: "labelStartLink",
  resolveAll: labelEnd.resolveAll,
  tokenize: tokenizeLabelStartLink
};
function tokenizeLabelStartLink(effects, ok3, nok) {
  const self = this;
  return start;
  function start(code2) {
    effects.enter("labelLink");
    effects.enter("labelMarker");
    effects.consume(code2);
    effects.exit("labelMarker");
    effects.exit("labelLink");
    return after;
  }
  function after(code2) {
    return code2 === 94 && "_hiddenFootnoteSupport" in self.parser.constructs ? nok(code2) : ok3(code2);
  }
}

// node_modules/micromark-core-commonmark/lib/line-ending.js
var lineEnding = {
  name: "lineEnding",
  tokenize: tokenizeLineEnding
};
function tokenizeLineEnding(effects, ok3) {
  return start;
  function start(code2) {
    effects.enter("lineEnding");
    effects.consume(code2);
    effects.exit("lineEnding");
    return factorySpace(effects, ok3, "linePrefix");
  }
}

// node_modules/micromark-core-commonmark/lib/thematic-break.js
var thematicBreak = {
  name: "thematicBreak",
  tokenize: tokenizeThematicBreak
};
function tokenizeThematicBreak(effects, ok3, nok) {
  let size = 0;
  let marker;
  return start;
  function start(code2) {
    effects.enter("thematicBreak");
    return before(code2);
  }
  function before(code2) {
    marker = code2;
    return atBreak(code2);
  }
  function atBreak(code2) {
    if (code2 === marker) {
      effects.enter("thematicBreakSequence");
      return sequence(code2);
    }
    if (size >= 3 && (code2 === null || markdownLineEnding2(code2))) {
      effects.exit("thematicBreak");
      return ok3(code2);
    }
    return nok(code2);
  }
  function sequence(code2) {
    if (code2 === marker) {
      effects.consume(code2);
      size++;
      return sequence;
    }
    effects.exit("thematicBreakSequence");
    return markdownSpace(code2) ? factorySpace(effects, atBreak, "whitespace")(code2) : atBreak(code2);
  }
}

// node_modules/micromark-core-commonmark/lib/list.js
var list = {
  continuation: {
    tokenize: tokenizeListContinuation
  },
  exit: tokenizeListEnd,
  name: "list",
  tokenize: tokenizeListStart
};
var listItemPrefixWhitespaceConstruct = {
  partial: true,
  tokenize: tokenizeListItemPrefixWhitespace
};
var indentConstruct = {
  partial: true,
  tokenize: tokenizeIndent
};
function tokenizeListStart(effects, ok3, nok) {
  const self = this;
  const tail = self.events[self.events.length - 1];
  let initialSize = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
  let size = 0;
  return start;
  function start(code2) {
    const kind = self.containerState.type || (code2 === 42 || code2 === 43 || code2 === 45 ? "listUnordered" : "listOrdered");
    if (kind === "listUnordered" ? !self.containerState.marker || code2 === self.containerState.marker : asciiDigit(code2)) {
      if (!self.containerState.type) {
        self.containerState.type = kind;
        effects.enter(kind, {
          _container: true
        });
      }
      if (kind === "listUnordered") {
        effects.enter("listItemPrefix");
        return code2 === 42 || code2 === 45 ? effects.check(thematicBreak, nok, atMarker)(code2) : atMarker(code2);
      }
      if (!self.interrupt || code2 === 49) {
        effects.enter("listItemPrefix");
        effects.enter("listItemValue");
        return inside(code2);
      }
    }
    return nok(code2);
  }
  function inside(code2) {
    if (asciiDigit(code2) && ++size < 10) {
      effects.consume(code2);
      return inside;
    }
    if ((!self.interrupt || size < 2) && (self.containerState.marker ? code2 === self.containerState.marker : code2 === 41 || code2 === 46)) {
      effects.exit("listItemValue");
      return atMarker(code2);
    }
    return nok(code2);
  }
  function atMarker(code2) {
    effects.enter("listItemMarker");
    effects.consume(code2);
    effects.exit("listItemMarker");
    self.containerState.marker = self.containerState.marker || code2;
    return effects.check(
      blankLine,
      // Can’t be empty when interrupting.
      self.interrupt ? nok : onBlank,
      effects.attempt(listItemPrefixWhitespaceConstruct, endOfPrefix, otherPrefix)
    );
  }
  function onBlank(code2) {
    self.containerState.initialBlankLine = true;
    initialSize++;
    return endOfPrefix(code2);
  }
  function otherPrefix(code2) {
    if (markdownSpace(code2)) {
      effects.enter("listItemPrefixWhitespace");
      effects.consume(code2);
      effects.exit("listItemPrefixWhitespace");
      return endOfPrefix;
    }
    return nok(code2);
  }
  function endOfPrefix(code2) {
    self.containerState.size = initialSize + self.sliceSerialize(effects.exit("listItemPrefix"), true).length;
    return ok3(code2);
  }
}
function tokenizeListContinuation(effects, ok3, nok) {
  const self = this;
  self.containerState._closeFlow = void 0;
  return effects.check(blankLine, onBlank, notBlank);
  function onBlank(code2) {
    self.containerState.furtherBlankLines = self.containerState.furtherBlankLines || self.containerState.initialBlankLine;
    return factorySpace(effects, ok3, "listItemIndent", self.containerState.size + 1)(code2);
  }
  function notBlank(code2) {
    if (self.containerState.furtherBlankLines || !markdownSpace(code2)) {
      self.containerState.furtherBlankLines = void 0;
      self.containerState.initialBlankLine = void 0;
      return notInCurrentItem(code2);
    }
    self.containerState.furtherBlankLines = void 0;
    self.containerState.initialBlankLine = void 0;
    return effects.attempt(indentConstruct, ok3, notInCurrentItem)(code2);
  }
  function notInCurrentItem(code2) {
    self.containerState._closeFlow = true;
    self.interrupt = void 0;
    return factorySpace(effects, effects.attempt(list, ok3, nok), "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code2);
  }
}
function tokenizeIndent(effects, ok3, nok) {
  const self = this;
  return factorySpace(effects, afterPrefix, "listItemIndent", self.containerState.size + 1);
  function afterPrefix(code2) {
    const tail = self.events[self.events.length - 1];
    return tail && tail[1].type === "listItemIndent" && tail[2].sliceSerialize(tail[1], true).length === self.containerState.size ? ok3(code2) : nok(code2);
  }
}
function tokenizeListEnd(effects) {
  effects.exit(this.containerState.type);
}
function tokenizeListItemPrefixWhitespace(effects, ok3, nok) {
  const self = this;
  return factorySpace(effects, afterPrefix, "listItemPrefixWhitespace", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4 + 1);
  function afterPrefix(code2) {
    const tail = self.events[self.events.length - 1];
    return !markdownSpace(code2) && tail && tail[1].type === "listItemPrefixWhitespace" ? ok3(code2) : nok(code2);
  }
}

// node_modules/micromark-core-commonmark/lib/setext-underline.js
var setextUnderline = {
  name: "setextUnderline",
  resolveTo: resolveToSetextUnderline,
  tokenize: tokenizeSetextUnderline
};
function resolveToSetextUnderline(events, context) {
  let index2 = events.length;
  let content3;
  let text4;
  let definition2;
  while (index2--) {
    if (events[index2][0] === "enter") {
      if (events[index2][1].type === "content") {
        content3 = index2;
        break;
      }
      if (events[index2][1].type === "paragraph") {
        text4 = index2;
      }
    } else {
      if (events[index2][1].type === "content") {
        events.splice(index2, 1);
      }
      if (!definition2 && events[index2][1].type === "definition") {
        definition2 = index2;
      }
    }
  }
  const heading = {
    type: "setextHeading",
    start: {
      ...events[content3][1].start
    },
    end: {
      ...events[events.length - 1][1].end
    }
  };
  events[text4][1].type = "setextHeadingText";
  if (definition2) {
    events.splice(text4, 0, ["enter", heading, context]);
    events.splice(definition2 + 1, 0, ["exit", events[content3][1], context]);
    events[content3][1].end = {
      ...events[definition2][1].end
    };
  } else {
    events[content3][1] = heading;
  }
  events.push(["exit", heading, context]);
  return events;
}
function tokenizeSetextUnderline(effects, ok3, nok) {
  const self = this;
  let marker;
  return start;
  function start(code2) {
    let index2 = self.events.length;
    let paragraph;
    while (index2--) {
      if (self.events[index2][1].type !== "lineEnding" && self.events[index2][1].type !== "linePrefix" && self.events[index2][1].type !== "content") {
        paragraph = self.events[index2][1].type === "paragraph";
        break;
      }
    }
    if (!self.parser.lazy[self.now().line] && (self.interrupt || paragraph)) {
      effects.enter("setextHeadingLine");
      marker = code2;
      return before(code2);
    }
    return nok(code2);
  }
  function before(code2) {
    effects.enter("setextHeadingLineSequence");
    return inside(code2);
  }
  function inside(code2) {
    if (code2 === marker) {
      effects.consume(code2);
      return inside;
    }
    effects.exit("setextHeadingLineSequence");
    return markdownSpace(code2) ? factorySpace(effects, after, "lineSuffix")(code2) : after(code2);
  }
  function after(code2) {
    if (code2 === null || markdownLineEnding2(code2)) {
      effects.exit("setextHeadingLine");
      return ok3(code2);
    }
    return nok(code2);
  }
}

// node_modules/micromark/lib/initialize/flow.js
var flow = {
  tokenize: initializeFlow
};
function initializeFlow(effects) {
  const self = this;
  const initial = effects.attempt(
    // Try to parse a blank line.
    blankLine,
    atBlankEnding,
    // Try to parse initial flow (essentially, only code).
    effects.attempt(this.parser.constructs.flowInitial, afterConstruct, factorySpace(effects, effects.attempt(this.parser.constructs.flow, afterConstruct, effects.attempt(content2, afterConstruct)), "linePrefix"))
  );
  return initial;
  function atBlankEnding(code2) {
    if (code2 === null) {
      effects.consume(code2);
      return;
    }
    effects.enter("lineEndingBlank");
    effects.consume(code2);
    effects.exit("lineEndingBlank");
    self.currentConstruct = void 0;
    return initial;
  }
  function afterConstruct(code2) {
    if (code2 === null) {
      effects.consume(code2);
      return;
    }
    effects.enter("lineEnding");
    effects.consume(code2);
    effects.exit("lineEnding");
    self.currentConstruct = void 0;
    return initial;
  }
}

// node_modules/micromark/lib/initialize/text.js
var resolver = {
  resolveAll: createResolver()
};
var string = initializeFactory("string");
var text = initializeFactory("text");
function initializeFactory(field) {
  return {
    resolveAll: createResolver(field === "text" ? resolveAllLineSuffixes : void 0),
    tokenize: initializeText
  };
  function initializeText(effects) {
    const self = this;
    const constructs2 = this.parser.constructs[field];
    const text4 = effects.attempt(constructs2, start, notText);
    return start;
    function start(code2) {
      return atBreak(code2) ? text4(code2) : notText(code2);
    }
    function notText(code2) {
      if (code2 === null) {
        effects.consume(code2);
        return;
      }
      effects.enter("data");
      effects.consume(code2);
      return data;
    }
    function data(code2) {
      if (atBreak(code2)) {
        effects.exit("data");
        return text4(code2);
      }
      effects.consume(code2);
      return data;
    }
    function atBreak(code2) {
      if (code2 === null) {
        return true;
      }
      const list2 = constructs2[code2];
      let index2 = -1;
      if (list2) {
        while (++index2 < list2.length) {
          const item = list2[index2];
          if (!item.previous || item.previous.call(self, self.previous)) {
            return true;
          }
        }
      }
      return false;
    }
  }
}
function createResolver(extraResolver) {
  return resolveAllText;
  function resolveAllText(events, context) {
    let index2 = -1;
    let enter;
    while (++index2 <= events.length) {
      if (enter === void 0) {
        if (events[index2] && events[index2][1].type === "data") {
          enter = index2;
          index2++;
        }
      } else if (!events[index2] || events[index2][1].type !== "data") {
        if (index2 !== enter + 2) {
          events[enter][1].end = events[index2 - 1][1].end;
          events.splice(enter + 2, index2 - enter - 2);
          index2 = enter + 2;
        }
        enter = void 0;
      }
    }
    return extraResolver ? extraResolver(events, context) : events;
  }
}
function resolveAllLineSuffixes(events, context) {
  let eventIndex = 0;
  while (++eventIndex <= events.length) {
    if ((eventIndex === events.length || events[eventIndex][1].type === "lineEnding") && events[eventIndex - 1][1].type === "data") {
      const data = events[eventIndex - 1][1];
      const chunks = context.sliceStream(data);
      let index2 = chunks.length;
      let bufferIndex = -1;
      let size = 0;
      let tabs;
      while (index2--) {
        const chunk = chunks[index2];
        if (typeof chunk === "string") {
          bufferIndex = chunk.length;
          while (chunk.charCodeAt(bufferIndex - 1) === 32) {
            size++;
            bufferIndex--;
          }
          if (bufferIndex) break;
          bufferIndex = -1;
        } else if (chunk === -2) {
          tabs = true;
          size++;
        } else if (chunk === -1) {
        } else {
          index2++;
          break;
        }
      }
      if (context._contentTypeTextTrailing && eventIndex === events.length) {
        size = 0;
      }
      if (size) {
        const token = {
          type: eventIndex === events.length || tabs || size < 2 ? "lineSuffix" : "hardBreakTrailing",
          start: {
            _bufferIndex: index2 ? bufferIndex : data.start._bufferIndex + bufferIndex,
            _index: data.start._index + index2,
            line: data.end.line,
            column: data.end.column - size,
            offset: data.end.offset - size
          },
          end: {
            ...data.end
          }
        };
        data.end = {
          ...token.start
        };
        if (data.start.offset === data.end.offset) {
          Object.assign(data, token);
        } else {
          events.splice(eventIndex, 0, ["enter", token, context], ["exit", token, context]);
          eventIndex += 2;
        }
      }
      eventIndex++;
    }
  }
  return events;
}

// node_modules/micromark/lib/constructs.js
var constructs_exports = {};
__export(constructs_exports, {
  attentionMarkers: () => attentionMarkers,
  contentInitial: () => contentInitial,
  disable: () => disable,
  document: () => document2,
  flow: () => flow2,
  flowInitial: () => flowInitial,
  insideSpan: () => insideSpan,
  string: () => string2,
  text: () => text2
});
var document2 = {
  [42]: list,
  [43]: list,
  [45]: list,
  [48]: list,
  [49]: list,
  [50]: list,
  [51]: list,
  [52]: list,
  [53]: list,
  [54]: list,
  [55]: list,
  [56]: list,
  [57]: list,
  [62]: blockQuote
};
var contentInitial = {
  [91]: definition
};
var flowInitial = {
  [-2]: codeIndented,
  [-1]: codeIndented,
  [32]: codeIndented
};
var flow2 = {
  [35]: headingAtx,
  [42]: thematicBreak,
  [45]: [setextUnderline, thematicBreak],
  [60]: htmlFlow,
  [61]: setextUnderline,
  [95]: thematicBreak,
  [96]: codeFenced,
  [126]: codeFenced
};
var string2 = {
  [38]: characterReference,
  [92]: characterEscape
};
var text2 = {
  [-5]: lineEnding,
  [-4]: lineEnding,
  [-3]: lineEnding,
  [33]: labelStartImage,
  [38]: characterReference,
  [42]: attention,
  [60]: [autolink, htmlText],
  [91]: labelStartLink,
  [92]: [hardBreakEscape, characterEscape],
  [93]: labelEnd,
  [95]: attention,
  [96]: codeText
};
var insideSpan = {
  null: [attention, resolver]
};
var attentionMarkers = {
  null: [42, 95]
};
var disable = {
  null: []
};

// node_modules/micromark/lib/create-tokenizer.js
function createTokenizer(parser, initialize, from) {
  let point3 = {
    _bufferIndex: -1,
    _index: 0,
    line: from && from.line || 1,
    column: from && from.column || 1,
    offset: from && from.offset || 0
  };
  const columnStart = {};
  const resolveAllConstructs = [];
  let chunks = [];
  let stack = [];
  let consumed = true;
  const effects = {
    attempt: constructFactory(onsuccessfulconstruct),
    check: constructFactory(onsuccessfulcheck),
    consume,
    enter,
    exit: exit3,
    interrupt: constructFactory(onsuccessfulcheck, {
      interrupt: true
    })
  };
  const context = {
    code: null,
    containerState: {},
    defineSkip,
    events: [],
    now,
    parser,
    previous: null,
    sliceSerialize,
    sliceStream,
    write
  };
  let state = initialize.tokenize.call(context, effects);
  let expectedCode;
  if (initialize.resolveAll) {
    resolveAllConstructs.push(initialize);
  }
  return context;
  function write(slice) {
    chunks = push(chunks, slice);
    main();
    if (chunks[chunks.length - 1] !== null) {
      return [];
    }
    addResult(initialize, 0);
    context.events = resolveAll(resolveAllConstructs, context.events, context);
    return context.events;
  }
  function sliceSerialize(token, expandTabs) {
    return serializeChunks(sliceStream(token), expandTabs);
  }
  function sliceStream(token) {
    return sliceChunks(chunks, token);
  }
  function now() {
    const {
      _bufferIndex,
      _index,
      line: line2,
      column,
      offset
    } = point3;
    return {
      _bufferIndex,
      _index,
      line: line2,
      column,
      offset
    };
  }
  function defineSkip(value) {
    columnStart[value.line] = value.column;
    accountForPotentialSkip();
  }
  function main() {
    let chunkIndex;
    while (point3._index < chunks.length) {
      const chunk = chunks[point3._index];
      if (typeof chunk === "string") {
        chunkIndex = point3._index;
        if (point3._bufferIndex < 0) {
          point3._bufferIndex = 0;
        }
        while (point3._index === chunkIndex && point3._bufferIndex < chunk.length) {
          go(chunk.charCodeAt(point3._bufferIndex));
        }
      } else {
        go(chunk);
      }
    }
  }
  function go(code2) {
    consumed = void 0;
    expectedCode = code2;
    state = state(code2);
  }
  function consume(code2) {
    if (markdownLineEnding2(code2)) {
      point3.line++;
      point3.column = 1;
      point3.offset += code2 === -3 ? 2 : 1;
      accountForPotentialSkip();
    } else if (code2 !== -1) {
      point3.column++;
      point3.offset++;
    }
    if (point3._bufferIndex < 0) {
      point3._index++;
    } else {
      point3._bufferIndex++;
      if (point3._bufferIndex === // Points w/ non-negative `_bufferIndex` reference
      // strings.
      /** @type {string} */
      chunks[point3._index].length) {
        point3._bufferIndex = -1;
        point3._index++;
      }
    }
    context.previous = code2;
    consumed = true;
  }
  function enter(type, fields) {
    const token = fields || {};
    token.type = type;
    token.start = now();
    context.events.push(["enter", token, context]);
    stack.push(token);
    return token;
  }
  function exit3(type) {
    const token = stack.pop();
    token.end = now();
    context.events.push(["exit", token, context]);
    return token;
  }
  function onsuccessfulconstruct(construct, info) {
    addResult(construct, info.from);
  }
  function onsuccessfulcheck(_, info) {
    info.restore();
  }
  function constructFactory(onreturn, fields) {
    return hook;
    function hook(constructs2, returnState, bogusState) {
      let listOfConstructs;
      let constructIndex;
      let currentConstruct;
      let info;
      return Array.isArray(constructs2) ? (
        /* c8 ignore next 1 */
        handleListOfConstructs(constructs2)
      ) : "tokenize" in constructs2 ? (
        // Looks like a construct.
        handleListOfConstructs([
          /** @type {Construct} */
          constructs2
        ])
      ) : handleMapOfConstructs(constructs2);
      function handleMapOfConstructs(map) {
        return start;
        function start(code2) {
          const left = code2 !== null && map[code2];
          const all2 = code2 !== null && map.null;
          const list2 = [
            // To do: add more extension tests.
            /* c8 ignore next 2 */
            ...Array.isArray(left) ? left : left ? [left] : [],
            ...Array.isArray(all2) ? all2 : all2 ? [all2] : []
          ];
          return handleListOfConstructs(list2)(code2);
        }
      }
      function handleListOfConstructs(list2) {
        listOfConstructs = list2;
        constructIndex = 0;
        if (list2.length === 0) {
          return bogusState;
        }
        return handleConstruct(list2[constructIndex]);
      }
      function handleConstruct(construct) {
        return start;
        function start(code2) {
          info = store();
          currentConstruct = construct;
          if (!construct.partial) {
            context.currentConstruct = construct;
          }
          if (construct.name && context.parser.constructs.disable.null.includes(construct.name)) {
            return nok(code2);
          }
          return construct.tokenize.call(
            // If we do have fields, create an object w/ `context` as its
            // prototype.
            // This allows a “live binding”, which is needed for `interrupt`.
            fields ? Object.assign(Object.create(context), fields) : context,
            effects,
            ok3,
            nok
          )(code2);
        }
      }
      function ok3(code2) {
        consumed = true;
        onreturn(currentConstruct, info);
        return returnState;
      }
      function nok(code2) {
        consumed = true;
        info.restore();
        if (++constructIndex < listOfConstructs.length) {
          return handleConstruct(listOfConstructs[constructIndex]);
        }
        return bogusState;
      }
    }
  }
  function addResult(construct, from2) {
    if (construct.resolveAll && !resolveAllConstructs.includes(construct)) {
      resolveAllConstructs.push(construct);
    }
    if (construct.resolve) {
      splice(context.events, from2, context.events.length - from2, construct.resolve(context.events.slice(from2), context));
    }
    if (construct.resolveTo) {
      context.events = construct.resolveTo(context.events, context);
    }
  }
  function store() {
    const startPoint = now();
    const startPrevious = context.previous;
    const startCurrentConstruct = context.currentConstruct;
    const startEventsIndex = context.events.length;
    const startStack = Array.from(stack);
    return {
      from: startEventsIndex,
      restore
    };
    function restore() {
      point3 = startPoint;
      context.previous = startPrevious;
      context.currentConstruct = startCurrentConstruct;
      context.events.length = startEventsIndex;
      stack = startStack;
      accountForPotentialSkip();
    }
  }
  function accountForPotentialSkip() {
    if (point3.line in columnStart && point3.column < 2) {
      point3.column = columnStart[point3.line];
      point3.offset += columnStart[point3.line] - 1;
    }
  }
}
function sliceChunks(chunks, token) {
  const startIndex = token.start._index;
  const startBufferIndex = token.start._bufferIndex;
  const endIndex = token.end._index;
  const endBufferIndex = token.end._bufferIndex;
  let view;
  if (startIndex === endIndex) {
    view = [chunks[startIndex].slice(startBufferIndex, endBufferIndex)];
  } else {
    view = chunks.slice(startIndex, endIndex);
    if (startBufferIndex > -1) {
      const head = view[0];
      if (typeof head === "string") {
        view[0] = head.slice(startBufferIndex);
      } else {
        view.shift();
      }
    }
    if (endBufferIndex > 0) {
      view.push(chunks[endIndex].slice(0, endBufferIndex));
    }
  }
  return view;
}
function serializeChunks(chunks, expandTabs) {
  let index2 = -1;
  const result = [];
  let atTab;
  while (++index2 < chunks.length) {
    const chunk = chunks[index2];
    let value;
    if (typeof chunk === "string") {
      value = chunk;
    } else switch (chunk) {
      case -5: {
        value = "\r";
        break;
      }
      case -4: {
        value = "\n";
        break;
      }
      case -3: {
        value = "\r\n";
        break;
      }
      case -2: {
        value = expandTabs ? " " : "	";
        break;
      }
      case -1: {
        if (!expandTabs && atTab) continue;
        value = " ";
        break;
      }
      default: {
        value = String.fromCharCode(chunk);
      }
    }
    atTab = chunk === -2;
    result.push(value);
  }
  return result.join("");
}

// node_modules/micromark/lib/parse.js
function parse(options2) {
  const settings = options2 || {};
  const constructs2 = (
    /** @type {FullNormalizedExtension} */
    combineExtensions([constructs_exports, ...settings.extensions || []])
  );
  const parser = {
    constructs: constructs2,
    content: create(content),
    defined: [],
    document: create(document),
    flow: create(flow),
    lazy: {},
    string: create(string),
    text: create(text)
  };
  return parser;
  function create(initial) {
    return creator;
    function creator(from) {
      return createTokenizer(parser, initial, from);
    }
  }
}

// node_modules/micromark/lib/postprocess.js
function postprocess(events) {
  while (!subtokenize(events)) {
  }
  return events;
}

// node_modules/micromark/lib/preprocess.js
var search = /[\0\t\n\r]/g;
function preprocess() {
  let column = 1;
  let buffer = "";
  let start = true;
  let atCarriageReturn;
  return preprocessor;
  function preprocessor(value, encoding, end) {
    const chunks = [];
    let match;
    let next;
    let startPosition;
    let endPosition;
    let code2;
    value = buffer + (typeof value === "string" ? value.toString() : new TextDecoder(encoding || void 0).decode(value));
    startPosition = 0;
    buffer = "";
    if (start) {
      if (value.charCodeAt(0) === 65279) {
        startPosition++;
      }
      start = void 0;
    }
    while (startPosition < value.length) {
      search.lastIndex = startPosition;
      match = search.exec(value);
      endPosition = match && match.index !== void 0 ? match.index : value.length;
      code2 = value.charCodeAt(endPosition);
      if (!match) {
        buffer = value.slice(startPosition);
        break;
      }
      if (code2 === 10 && startPosition === endPosition && atCarriageReturn) {
        chunks.push(-3);
        atCarriageReturn = void 0;
      } else {
        if (atCarriageReturn) {
          chunks.push(-5);
          atCarriageReturn = void 0;
        }
        if (startPosition < endPosition) {
          chunks.push(value.slice(startPosition, endPosition));
          column += endPosition - startPosition;
        }
        switch (code2) {
          case 0: {
            chunks.push(65533);
            column++;
            break;
          }
          case 9: {
            next = Math.ceil(column / 4) * 4;
            chunks.push(-2);
            while (column++ < next) chunks.push(-1);
            break;
          }
          case 10: {
            chunks.push(-4);
            column = 1;
            break;
          }
          default: {
            atCarriageReturn = true;
            column = 1;
          }
        }
      }
      startPosition = endPosition + 1;
    }
    if (end) {
      if (atCarriageReturn) chunks.push(-5);
      if (buffer) chunks.push(buffer);
      chunks.push(null);
    }
    return chunks;
  }
}

// node_modules/micromark-util-decode-string/index.js
var characterEscapeOrReference = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
function decodeString(value) {
  return value.replace(characterEscapeOrReference, decode);
}
function decode($0, $1, $2) {
  if ($1) {
    return $1;
  }
  const head = $2.charCodeAt(0);
  if (head === 35) {
    const head2 = $2.charCodeAt(1);
    const hex = head2 === 120 || head2 === 88;
    return decodeNumericCharacterReference($2.slice(hex ? 2 : 1), hex ? 16 : 10);
  }
  return decodeNamedCharacterReference($2) || $0;
}

// node_modules/mdast-util-from-markdown/node_modules/unist-util-stringify-position/lib/index.js
function stringifyPosition(value) {
  if (!value || typeof value !== "object") {
    return "";
  }
  if ("position" in value || "type" in value) {
    return position(value.position);
  }
  if ("start" in value || "end" in value) {
    return position(value);
  }
  if ("line" in value || "column" in value) {
    return point(value);
  }
  return "";
}
function point(point3) {
  return index(point3 && point3.line) + ":" + index(point3 && point3.column);
}
function position(pos) {
  return point(pos && pos.start) + "-" + point(pos && pos.end);
}
function index(value) {
  return value && typeof value === "number" ? value : 1;
}

// node_modules/mdast-util-from-markdown/lib/index.js
var own2 = {}.hasOwnProperty;
function fromMarkdown2(value, encoding, options2) {
  if (encoding && typeof encoding === "object") {
    options2 = encoding;
    encoding = void 0;
  }
  return compiler(options2)(postprocess(parse(options2).document().write(preprocess()(value, encoding, true))));
}
function compiler(options2) {
  const config = {
    transforms: [],
    canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
    enter: {
      autolink: opener(link),
      autolinkProtocol: onenterdata,
      autolinkEmail: onenterdata,
      atxHeading: opener(heading),
      blockQuote: opener(blockQuote2),
      characterEscape: onenterdata,
      characterReference: onenterdata,
      codeFenced: opener(codeFlow),
      codeFencedFenceInfo: buffer,
      codeFencedFenceMeta: buffer,
      codeIndented: opener(codeFlow, buffer),
      codeText: opener(codeText2, buffer),
      codeTextData: onenterdata,
      data: onenterdata,
      codeFlowValue: onenterdata,
      definition: opener(definition2),
      definitionDestinationString: buffer,
      definitionLabelString: buffer,
      definitionTitleString: buffer,
      emphasis: opener(emphasis),
      hardBreakEscape: opener(hardBreak),
      hardBreakTrailing: opener(hardBreak),
      htmlFlow: opener(html, buffer),
      htmlFlowData: onenterdata,
      htmlText: opener(html, buffer),
      htmlTextData: onenterdata,
      image: opener(image),
      label: buffer,
      link: opener(link),
      listItem: opener(listItem),
      listItemValue: onenterlistitemvalue,
      listOrdered: opener(list2, onenterlistordered),
      listUnordered: opener(list2),
      paragraph: opener(paragraph),
      reference: onenterreference,
      referenceString: buffer,
      resourceDestinationString: buffer,
      resourceTitleString: buffer,
      setextHeading: opener(heading),
      strong: opener(strong),
      thematicBreak: opener(thematicBreak2)
    },
    exit: {
      atxHeading: closer(),
      atxHeadingSequence: onexitatxheadingsequence,
      autolink: closer(),
      autolinkEmail: onexitautolinkemail,
      autolinkProtocol: onexitautolinkprotocol,
      blockQuote: closer(),
      characterEscapeValue: onexitdata,
      characterReferenceMarkerHexadecimal: onexitcharacterreferencemarker,
      characterReferenceMarkerNumeric: onexitcharacterreferencemarker,
      characterReferenceValue: onexitcharacterreferencevalue,
      characterReference: onexitcharacterreference,
      codeFenced: closer(onexitcodefenced),
      codeFencedFence: onexitcodefencedfence,
      codeFencedFenceInfo: onexitcodefencedfenceinfo,
      codeFencedFenceMeta: onexitcodefencedfencemeta,
      codeFlowValue: onexitdata,
      codeIndented: closer(onexitcodeindented),
      codeText: closer(onexitcodetext),
      codeTextData: onexitdata,
      data: onexitdata,
      definition: closer(),
      definitionDestinationString: onexitdefinitiondestinationstring,
      definitionLabelString: onexitdefinitionlabelstring,
      definitionTitleString: onexitdefinitiontitlestring,
      emphasis: closer(),
      hardBreakEscape: closer(onexithardbreak),
      hardBreakTrailing: closer(onexithardbreak),
      htmlFlow: closer(onexithtmlflow),
      htmlFlowData: onexitdata,
      htmlText: closer(onexithtmltext),
      htmlTextData: onexitdata,
      image: closer(onexitimage),
      label: onexitlabel,
      labelText: onexitlabeltext,
      lineEnding: onexitlineending,
      link: closer(onexitlink),
      listItem: closer(),
      listOrdered: closer(),
      listUnordered: closer(),
      paragraph: closer(),
      referenceString: onexitreferencestring,
      resourceDestinationString: onexitresourcedestinationstring,
      resourceTitleString: onexitresourcetitlestring,
      resource: onexitresource,
      setextHeading: closer(onexitsetextheading),
      setextHeadingLineSequence: onexitsetextheadinglinesequence,
      setextHeadingText: onexitsetextheadingtext,
      strong: closer(),
      thematicBreak: closer()
    }
  };
  configure(config, (options2 || {}).mdastExtensions || []);
  const data = {};
  return compile;
  function compile(events) {
    let tree = {
      type: "root",
      children: []
    };
    const context = {
      stack: [tree],
      tokenStack: [],
      config,
      enter,
      exit: exit3,
      buffer,
      resume,
      data
    };
    const listStack = [];
    let index2 = -1;
    while (++index2 < events.length) {
      if (events[index2][1].type === "listOrdered" || events[index2][1].type === "listUnordered") {
        if (events[index2][0] === "enter") {
          listStack.push(index2);
        } else {
          const tail = listStack.pop();
          index2 = prepareList(events, tail, index2);
        }
      }
    }
    index2 = -1;
    while (++index2 < events.length) {
      const handler = config[events[index2][0]];
      if (own2.call(handler, events[index2][1].type)) {
        handler[events[index2][1].type].call(Object.assign({
          sliceSerialize: events[index2][2].sliceSerialize
        }, context), events[index2][1]);
      }
    }
    if (context.tokenStack.length > 0) {
      const tail = context.tokenStack[context.tokenStack.length - 1];
      const handler = tail[1] || defaultOnError;
      handler.call(context, void 0, tail[0]);
    }
    tree.position = {
      start: point2(events.length > 0 ? events[0][1].start : {
        line: 1,
        column: 1,
        offset: 0
      }),
      end: point2(events.length > 0 ? events[events.length - 2][1].end : {
        line: 1,
        column: 1,
        offset: 0
      })
    };
    index2 = -1;
    while (++index2 < config.transforms.length) {
      tree = config.transforms[index2](tree) || tree;
    }
    return tree;
  }
  function prepareList(events, start, length) {
    let index2 = start - 1;
    let containerBalance = -1;
    let listSpread = false;
    let listItem2;
    let lineIndex;
    let firstBlankLineIndex;
    let atMarker;
    while (++index2 <= length) {
      const event = events[index2];
      switch (event[1].type) {
        case "listUnordered":
        case "listOrdered":
        case "blockQuote": {
          if (event[0] === "enter") {
            containerBalance++;
          } else {
            containerBalance--;
          }
          atMarker = void 0;
          break;
        }
        case "lineEndingBlank": {
          if (event[0] === "enter") {
            if (listItem2 && !atMarker && !containerBalance && !firstBlankLineIndex) {
              firstBlankLineIndex = index2;
            }
            atMarker = void 0;
          }
          break;
        }
        case "linePrefix":
        case "listItemValue":
        case "listItemMarker":
        case "listItemPrefix":
        case "listItemPrefixWhitespace": {
          break;
        }
        default: {
          atMarker = void 0;
        }
      }
      if (!containerBalance && event[0] === "enter" && event[1].type === "listItemPrefix" || containerBalance === -1 && event[0] === "exit" && (event[1].type === "listUnordered" || event[1].type === "listOrdered")) {
        if (listItem2) {
          let tailIndex = index2;
          lineIndex = void 0;
          while (tailIndex--) {
            const tailEvent = events[tailIndex];
            if (tailEvent[1].type === "lineEnding" || tailEvent[1].type === "lineEndingBlank") {
              if (tailEvent[0] === "exit") continue;
              if (lineIndex) {
                events[lineIndex][1].type = "lineEndingBlank";
                listSpread = true;
              }
              tailEvent[1].type = "lineEnding";
              lineIndex = tailIndex;
            } else if (tailEvent[1].type === "linePrefix" || tailEvent[1].type === "blockQuotePrefix" || tailEvent[1].type === "blockQuotePrefixWhitespace" || tailEvent[1].type === "blockQuoteMarker" || tailEvent[1].type === "listItemIndent") {
            } else {
              break;
            }
          }
          if (firstBlankLineIndex && (!lineIndex || firstBlankLineIndex < lineIndex)) {
            listItem2._spread = true;
          }
          listItem2.end = Object.assign({}, lineIndex ? events[lineIndex][1].start : event[1].end);
          events.splice(lineIndex || index2, 0, ["exit", listItem2, event[2]]);
          index2++;
          length++;
        }
        if (event[1].type === "listItemPrefix") {
          const item = {
            type: "listItem",
            _spread: false,
            start: Object.assign({}, event[1].start),
            // @ts-expect-error: we’ll add `end` in a second.
            end: void 0
          };
          listItem2 = item;
          events.splice(index2, 0, ["enter", item, event[2]]);
          index2++;
          length++;
          firstBlankLineIndex = void 0;
          atMarker = true;
        }
      }
    }
    events[start][1]._spread = listSpread;
    return length;
  }
  function opener(create, and) {
    return open;
    function open(token) {
      enter.call(this, create(token), token);
      if (and) and.call(this, token);
    }
  }
  function buffer() {
    this.stack.push({
      type: "fragment",
      children: []
    });
  }
  function enter(node2, token, errorHandler) {
    const parent = this.stack[this.stack.length - 1];
    const siblings = parent.children;
    siblings.push(node2);
    this.stack.push(node2);
    this.tokenStack.push([token, errorHandler || void 0]);
    node2.position = {
      start: point2(token.start),
      // @ts-expect-error: `end` will be patched later.
      end: void 0
    };
  }
  function closer(and) {
    return close;
    function close(token) {
      if (and) and.call(this, token);
      exit3.call(this, token);
    }
  }
  function exit3(token, onExitError) {
    const node2 = this.stack.pop();
    const open = this.tokenStack.pop();
    if (!open) {
      throw new Error("Cannot close `" + token.type + "` (" + stringifyPosition({
        start: token.start,
        end: token.end
      }) + "): it\u2019s not open");
    } else if (open[0].type !== token.type) {
      if (onExitError) {
        onExitError.call(this, token, open[0]);
      } else {
        const handler = open[1] || defaultOnError;
        handler.call(this, token, open[0]);
      }
    }
    node2.position.end = point2(token.end);
  }
  function resume() {
    return toString(this.stack.pop());
  }
  function onenterlistordered() {
    this.data.expectingFirstListItemValue = true;
  }
  function onenterlistitemvalue(token) {
    if (this.data.expectingFirstListItemValue) {
      const ancestor = this.stack[this.stack.length - 2];
      ancestor.start = Number.parseInt(this.sliceSerialize(token), 10);
      this.data.expectingFirstListItemValue = void 0;
    }
  }
  function onexitcodefencedfenceinfo() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.lang = data2;
  }
  function onexitcodefencedfencemeta() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.meta = data2;
  }
  function onexitcodefencedfence() {
    if (this.data.flowCodeInside) return;
    this.buffer();
    this.data.flowCodeInside = true;
  }
  function onexitcodefenced() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.value = data2.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, "");
    this.data.flowCodeInside = void 0;
  }
  function onexitcodeindented() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.value = data2.replace(/(\r?\n|\r)$/g, "");
  }
  function onexitdefinitionlabelstring(token) {
    const label = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.label = label;
    node2.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
  }
  function onexitdefinitiontitlestring() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.title = data2;
  }
  function onexitdefinitiondestinationstring() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.url = data2;
  }
  function onexitatxheadingsequence(token) {
    const node2 = this.stack[this.stack.length - 1];
    if (!node2.depth) {
      const depth = this.sliceSerialize(token).length;
      node2.depth = depth;
    }
  }
  function onexitsetextheadingtext() {
    this.data.setextHeadingSlurpLineEnding = true;
  }
  function onexitsetextheadinglinesequence(token) {
    const node2 = this.stack[this.stack.length - 1];
    node2.depth = this.sliceSerialize(token).codePointAt(0) === 61 ? 1 : 2;
  }
  function onexitsetextheading() {
    this.data.setextHeadingSlurpLineEnding = void 0;
  }
  function onenterdata(token) {
    const node2 = this.stack[this.stack.length - 1];
    const siblings = node2.children;
    let tail = siblings[siblings.length - 1];
    if (!tail || tail.type !== "text") {
      tail = text4();
      tail.position = {
        start: point2(token.start),
        // @ts-expect-error: we’ll add `end` later.
        end: void 0
      };
      siblings.push(tail);
    }
    this.stack.push(tail);
  }
  function onexitdata(token) {
    const tail = this.stack.pop();
    tail.value += this.sliceSerialize(token);
    tail.position.end = point2(token.end);
  }
  function onexitlineending(token) {
    const context = this.stack[this.stack.length - 1];
    if (this.data.atHardBreak) {
      const tail = context.children[context.children.length - 1];
      tail.position.end = point2(token.end);
      this.data.atHardBreak = void 0;
      return;
    }
    if (!this.data.setextHeadingSlurpLineEnding && config.canContainEols.includes(context.type)) {
      onenterdata.call(this, token);
      onexitdata.call(this, token);
    }
  }
  function onexithardbreak() {
    this.data.atHardBreak = true;
  }
  function onexithtmlflow() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.value = data2;
  }
  function onexithtmltext() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.value = data2;
  }
  function onexitcodetext() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.value = data2;
  }
  function onexitlink() {
    const node2 = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      const referenceType = this.data.referenceType || "shortcut";
      node2.type += "Reference";
      node2.referenceType = referenceType;
      delete node2.url;
      delete node2.title;
    } else {
      delete node2.identifier;
      delete node2.label;
    }
    this.data.referenceType = void 0;
  }
  function onexitimage() {
    const node2 = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      const referenceType = this.data.referenceType || "shortcut";
      node2.type += "Reference";
      node2.referenceType = referenceType;
      delete node2.url;
      delete node2.title;
    } else {
      delete node2.identifier;
      delete node2.label;
    }
    this.data.referenceType = void 0;
  }
  function onexitlabeltext(token) {
    const string3 = this.sliceSerialize(token);
    const ancestor = this.stack[this.stack.length - 2];
    ancestor.label = decodeString(string3);
    ancestor.identifier = normalizeIdentifier(string3).toLowerCase();
  }
  function onexitlabel() {
    const fragment = this.stack[this.stack.length - 1];
    const value = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    this.data.inReference = true;
    if (node2.type === "link") {
      const children = fragment.children;
      node2.children = children;
    } else {
      node2.alt = value;
    }
  }
  function onexitresourcedestinationstring() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.url = data2;
  }
  function onexitresourcetitlestring() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.title = data2;
  }
  function onexitresource() {
    this.data.inReference = void 0;
  }
  function onenterreference() {
    this.data.referenceType = "collapsed";
  }
  function onexitreferencestring(token) {
    const label = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.label = label;
    node2.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
    this.data.referenceType = "full";
  }
  function onexitcharacterreferencemarker(token) {
    this.data.characterReferenceType = token.type;
  }
  function onexitcharacterreferencevalue(token) {
    const data2 = this.sliceSerialize(token);
    const type = this.data.characterReferenceType;
    let value;
    if (type) {
      value = decodeNumericCharacterReference(data2, type === "characterReferenceMarkerNumeric" ? 10 : 16);
      this.data.characterReferenceType = void 0;
    } else {
      const result = decodeNamedCharacterReference(data2);
      value = result;
    }
    const tail = this.stack[this.stack.length - 1];
    tail.value += value;
  }
  function onexitcharacterreference(token) {
    const tail = this.stack.pop();
    tail.position.end = point2(token.end);
  }
  function onexitautolinkprotocol(token) {
    onexitdata.call(this, token);
    const node2 = this.stack[this.stack.length - 1];
    node2.url = this.sliceSerialize(token);
  }
  function onexitautolinkemail(token) {
    onexitdata.call(this, token);
    const node2 = this.stack[this.stack.length - 1];
    node2.url = "mailto:" + this.sliceSerialize(token);
  }
  function blockQuote2() {
    return {
      type: "blockquote",
      children: []
    };
  }
  function codeFlow() {
    return {
      type: "code",
      lang: null,
      meta: null,
      value: ""
    };
  }
  function codeText2() {
    return {
      type: "inlineCode",
      value: ""
    };
  }
  function definition2() {
    return {
      type: "definition",
      identifier: "",
      label: null,
      title: null,
      url: ""
    };
  }
  function emphasis() {
    return {
      type: "emphasis",
      children: []
    };
  }
  function heading() {
    return {
      type: "heading",
      // @ts-expect-error `depth` will be set later.
      depth: 0,
      children: []
    };
  }
  function hardBreak() {
    return {
      type: "break"
    };
  }
  function html() {
    return {
      type: "html",
      value: ""
    };
  }
  function image() {
    return {
      type: "image",
      title: null,
      url: "",
      alt: null
    };
  }
  function link() {
    return {
      type: "link",
      title: null,
      url: "",
      children: []
    };
  }
  function list2(token) {
    return {
      type: "list",
      ordered: token.type === "listOrdered",
      start: null,
      spread: token._spread,
      children: []
    };
  }
  function listItem(token) {
    return {
      type: "listItem",
      spread: token._spread,
      checked: null,
      children: []
    };
  }
  function paragraph() {
    return {
      type: "paragraph",
      children: []
    };
  }
  function strong() {
    return {
      type: "strong",
      children: []
    };
  }
  function text4() {
    return {
      type: "text",
      value: ""
    };
  }
  function thematicBreak2() {
    return {
      type: "thematicBreak"
    };
  }
}
function point2(d) {
  return {
    line: d.line,
    column: d.column,
    offset: d.offset
  };
}
function configure(combined, extensions) {
  let index2 = -1;
  while (++index2 < extensions.length) {
    const value = extensions[index2];
    if (Array.isArray(value)) {
      configure(combined, value);
    } else {
      extension(combined, value);
    }
  }
}
function extension(combined, extension2) {
  let key;
  for (key in extension2) {
    if (own2.call(extension2, key)) {
      switch (key) {
        case "canContainEols": {
          const right = extension2[key];
          if (right) {
            combined[key].push(...right);
          }
          break;
        }
        case "transforms": {
          const right = extension2[key];
          if (right) {
            combined[key].push(...right);
          }
          break;
        }
        case "enter":
        case "exit": {
          const right = extension2[key];
          if (right) {
            Object.assign(combined[key], right);
          }
          break;
        }
      }
    }
  }
}
function defaultOnError(left, right) {
  if (left) {
    throw new Error("Cannot close `" + left.type + "` (" + stringifyPosition({
      start: left.start,
      end: left.end
    }) + "): a different token (`" + right.type + "`, " + stringifyPosition({
      start: right.start,
      end: right.end
    }) + ") is open");
  } else {
    throw new Error("Cannot close document, a token (`" + right.type + "`, " + stringifyPosition({
      start: right.start,
      end: right.end
    }) + ") is still open");
  }
}

// node_modules/devlop/lib/default.js
function ok() {
}

// node_modules/mdast-util-math/lib/index.js
function mathFromMarkdown() {
  return {
    enter: {
      mathFlow: enterMathFlow,
      mathFlowFenceMeta: enterMathFlowMeta,
      mathText: enterMathText
    },
    exit: {
      mathFlow: exitMathFlow,
      mathFlowFence: exitMathFlowFence,
      mathFlowFenceMeta: exitMathFlowMeta,
      mathFlowValue: exitMathData,
      mathText: exitMathText,
      mathTextData: exitMathData
    }
  };
  function enterMathFlow(token) {
    const code2 = {
      type: "element",
      tagName: "code",
      properties: { className: ["language-math", "math-display"] },
      children: []
    };
    this.enter(
      {
        type: "math",
        meta: null,
        value: "",
        data: { hName: "pre", hChildren: [code2] }
      },
      token
    );
  }
  function enterMathFlowMeta() {
    this.buffer();
  }
  function exitMathFlowMeta() {
    const data = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    ok(node2.type === "math");
    node2.meta = data;
  }
  function exitMathFlowFence() {
    if (this.data.mathFlowInside) return;
    this.buffer();
    this.data.mathFlowInside = true;
  }
  function exitMathFlow(token) {
    const data = this.resume().replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, "");
    const node2 = this.stack[this.stack.length - 1];
    ok(node2.type === "math");
    this.exit(token);
    node2.value = data;
    const code2 = (
      /** @type {HastElement} */
      node2.data.hChildren[0]
    );
    ok(code2.type === "element");
    ok(code2.tagName === "code");
    code2.children.push({ type: "text", value: data });
    this.data.mathFlowInside = void 0;
  }
  function enterMathText(token) {
    this.enter(
      {
        type: "inlineMath",
        value: "",
        data: {
          hName: "code",
          hProperties: { className: ["language-math", "math-inline"] },
          hChildren: []
        }
      },
      token
    );
    this.buffer();
  }
  function exitMathText(token) {
    const data = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    ok(node2.type === "inlineMath");
    this.exit(token);
    node2.value = data;
    const children = (
      /** @type {Array<HastElementContent>} */
      // @ts-expect-error: we defined it in `enterMathFlow`.
      node2.data.hChildren
    );
    children.push({ type: "text", value: data });
  }
  function exitMathData(token) {
    this.config.enter.data.call(this, token);
    this.config.exit.data.call(this, token);
  }
}

// node_modules/micromark-extension-gfm-autolink-literal/lib/syntax.js
var wwwPrefix = {
  tokenize: tokenizeWwwPrefix,
  partial: true
};
var domain = {
  tokenize: tokenizeDomain,
  partial: true
};
var path = {
  tokenize: tokenizePath,
  partial: true
};
var trail = {
  tokenize: tokenizeTrail,
  partial: true
};
var emailDomainDotTrail = {
  tokenize: tokenizeEmailDomainDotTrail,
  partial: true
};
var wwwAutolink = {
  name: "wwwAutolink",
  tokenize: tokenizeWwwAutolink,
  previous: previousWww
};
var protocolAutolink = {
  name: "protocolAutolink",
  tokenize: tokenizeProtocolAutolink,
  previous: previousProtocol
};
var emailAutolink = {
  name: "emailAutolink",
  tokenize: tokenizeEmailAutolink,
  previous: previousEmail
};
var text3 = {};
function gfmAutolinkLiteral() {
  return {
    text: text3
  };
}
var code = 48;
while (code < 123) {
  text3[code] = emailAutolink;
  code++;
  if (code === 58) code = 65;
  else if (code === 91) code = 97;
}
text3[43] = emailAutolink;
text3[45] = emailAutolink;
text3[46] = emailAutolink;
text3[95] = emailAutolink;
text3[72] = [emailAutolink, protocolAutolink];
text3[104] = [emailAutolink, protocolAutolink];
text3[87] = [emailAutolink, wwwAutolink];
text3[119] = [emailAutolink, wwwAutolink];
function tokenizeEmailAutolink(effects, ok3, nok) {
  const self = this;
  let dot;
  let data;
  return start;
  function start(code2) {
    if (!gfmAtext(code2) || !previousEmail.call(self, self.previous) || previousUnbalanced(self.events)) {
      return nok(code2);
    }
    effects.enter("literalAutolink");
    effects.enter("literalAutolinkEmail");
    return atext(code2);
  }
  function atext(code2) {
    if (gfmAtext(code2)) {
      effects.consume(code2);
      return atext;
    }
    if (code2 === 64) {
      effects.consume(code2);
      return emailDomain;
    }
    return nok(code2);
  }
  function emailDomain(code2) {
    if (code2 === 46) {
      return effects.check(emailDomainDotTrail, emailDomainAfter, emailDomainDot)(code2);
    }
    if (code2 === 45 || code2 === 95 || asciiAlphanumeric(code2)) {
      data = true;
      effects.consume(code2);
      return emailDomain;
    }
    return emailDomainAfter(code2);
  }
  function emailDomainDot(code2) {
    effects.consume(code2);
    dot = true;
    return emailDomain;
  }
  function emailDomainAfter(code2) {
    if (data && dot && asciiAlpha(self.previous)) {
      effects.exit("literalAutolinkEmail");
      effects.exit("literalAutolink");
      return ok3(code2);
    }
    return nok(code2);
  }
}
function tokenizeWwwAutolink(effects, ok3, nok) {
  const self = this;
  return wwwStart;
  function wwwStart(code2) {
    if (code2 !== 87 && code2 !== 119 || !previousWww.call(self, self.previous) || previousUnbalanced(self.events)) {
      return nok(code2);
    }
    effects.enter("literalAutolink");
    effects.enter("literalAutolinkWww");
    return effects.check(wwwPrefix, effects.attempt(domain, effects.attempt(path, wwwAfter), nok), nok)(code2);
  }
  function wwwAfter(code2) {
    effects.exit("literalAutolinkWww");
    effects.exit("literalAutolink");
    return ok3(code2);
  }
}
function tokenizeProtocolAutolink(effects, ok3, nok) {
  const self = this;
  let buffer = "";
  let seen = false;
  return protocolStart;
  function protocolStart(code2) {
    if ((code2 === 72 || code2 === 104) && previousProtocol.call(self, self.previous) && !previousUnbalanced(self.events)) {
      effects.enter("literalAutolink");
      effects.enter("literalAutolinkHttp");
      buffer += String.fromCodePoint(code2);
      effects.consume(code2);
      return protocolPrefixInside;
    }
    return nok(code2);
  }
  function protocolPrefixInside(code2) {
    if (asciiAlpha(code2) && buffer.length < 5) {
      buffer += String.fromCodePoint(code2);
      effects.consume(code2);
      return protocolPrefixInside;
    }
    if (code2 === 58) {
      const protocol = buffer.toLowerCase();
      if (protocol === "http" || protocol === "https") {
        effects.consume(code2);
        return protocolSlashesInside;
      }
    }
    return nok(code2);
  }
  function protocolSlashesInside(code2) {
    if (code2 === 47) {
      effects.consume(code2);
      if (seen) {
        return afterProtocol;
      }
      seen = true;
      return protocolSlashesInside;
    }
    return nok(code2);
  }
  function afterProtocol(code2) {
    return code2 === null || asciiControl(code2) || markdownLineEndingOrSpace2(code2) || unicodeWhitespace(code2) || unicodePunctuation(code2) ? nok(code2) : effects.attempt(domain, effects.attempt(path, protocolAfter), nok)(code2);
  }
  function protocolAfter(code2) {
    effects.exit("literalAutolinkHttp");
    effects.exit("literalAutolink");
    return ok3(code2);
  }
}
function tokenizeWwwPrefix(effects, ok3, nok) {
  let size = 0;
  return wwwPrefixInside;
  function wwwPrefixInside(code2) {
    if ((code2 === 87 || code2 === 119) && size < 3) {
      size++;
      effects.consume(code2);
      return wwwPrefixInside;
    }
    if (code2 === 46 && size === 3) {
      effects.consume(code2);
      return wwwPrefixAfter;
    }
    return nok(code2);
  }
  function wwwPrefixAfter(code2) {
    return code2 === null ? nok(code2) : ok3(code2);
  }
}
function tokenizeDomain(effects, ok3, nok) {
  let underscoreInLastSegment;
  let underscoreInLastLastSegment;
  let seen;
  return domainInside;
  function domainInside(code2) {
    if (code2 === 46 || code2 === 95) {
      return effects.check(trail, domainAfter, domainAtPunctuation)(code2);
    }
    if (code2 === null || markdownLineEndingOrSpace2(code2) || unicodeWhitespace(code2) || code2 !== 45 && unicodePunctuation(code2)) {
      return domainAfter(code2);
    }
    seen = true;
    effects.consume(code2);
    return domainInside;
  }
  function domainAtPunctuation(code2) {
    if (code2 === 95) {
      underscoreInLastSegment = true;
    } else {
      underscoreInLastLastSegment = underscoreInLastSegment;
      underscoreInLastSegment = void 0;
    }
    effects.consume(code2);
    return domainInside;
  }
  function domainAfter(code2) {
    if (underscoreInLastLastSegment || underscoreInLastSegment || !seen) {
      return nok(code2);
    }
    return ok3(code2);
  }
}
function tokenizePath(effects, ok3) {
  let sizeOpen = 0;
  let sizeClose = 0;
  return pathInside;
  function pathInside(code2) {
    if (code2 === 40) {
      sizeOpen++;
      effects.consume(code2);
      return pathInside;
    }
    if (code2 === 41 && sizeClose < sizeOpen) {
      return pathAtPunctuation(code2);
    }
    if (code2 === 33 || code2 === 34 || code2 === 38 || code2 === 39 || code2 === 41 || code2 === 42 || code2 === 44 || code2 === 46 || code2 === 58 || code2 === 59 || code2 === 60 || code2 === 63 || code2 === 93 || code2 === 95 || code2 === 126) {
      return effects.check(trail, ok3, pathAtPunctuation)(code2);
    }
    if (code2 === null || markdownLineEndingOrSpace2(code2) || unicodeWhitespace(code2)) {
      return ok3(code2);
    }
    effects.consume(code2);
    return pathInside;
  }
  function pathAtPunctuation(code2) {
    if (code2 === 41) {
      sizeClose++;
    }
    effects.consume(code2);
    return pathInside;
  }
}
function tokenizeTrail(effects, ok3, nok) {
  return trail2;
  function trail2(code2) {
    if (code2 === 33 || code2 === 34 || code2 === 39 || code2 === 41 || code2 === 42 || code2 === 44 || code2 === 46 || code2 === 58 || code2 === 59 || code2 === 63 || code2 === 95 || code2 === 126) {
      effects.consume(code2);
      return trail2;
    }
    if (code2 === 38) {
      effects.consume(code2);
      return trailCharacterReferenceStart;
    }
    if (code2 === 93) {
      effects.consume(code2);
      return trailBracketAfter;
    }
    if (
      // `<` is an end.
      code2 === 60 || // So is whitespace.
      code2 === null || markdownLineEndingOrSpace2(code2) || unicodeWhitespace(code2)
    ) {
      return ok3(code2);
    }
    return nok(code2);
  }
  function trailBracketAfter(code2) {
    if (code2 === null || code2 === 40 || code2 === 91 || markdownLineEndingOrSpace2(code2) || unicodeWhitespace(code2)) {
      return ok3(code2);
    }
    return trail2(code2);
  }
  function trailCharacterReferenceStart(code2) {
    return asciiAlpha(code2) ? trailCharacterReferenceInside(code2) : nok(code2);
  }
  function trailCharacterReferenceInside(code2) {
    if (code2 === 59) {
      effects.consume(code2);
      return trail2;
    }
    if (asciiAlpha(code2)) {
      effects.consume(code2);
      return trailCharacterReferenceInside;
    }
    return nok(code2);
  }
}
function tokenizeEmailDomainDotTrail(effects, ok3, nok) {
  return start;
  function start(code2) {
    effects.consume(code2);
    return after;
  }
  function after(code2) {
    return asciiAlphanumeric(code2) ? nok(code2) : ok3(code2);
  }
}
function previousWww(code2) {
  return code2 === null || code2 === 40 || code2 === 42 || code2 === 95 || code2 === 91 || code2 === 93 || code2 === 126 || markdownLineEndingOrSpace2(code2);
}
function previousProtocol(code2) {
  return !asciiAlpha(code2);
}
function previousEmail(code2) {
  return !(code2 === 47 || gfmAtext(code2));
}
function gfmAtext(code2) {
  return code2 === 43 || code2 === 45 || code2 === 46 || code2 === 95 || asciiAlphanumeric(code2);
}
function previousUnbalanced(events) {
  let index2 = events.length;
  let result = false;
  while (index2--) {
    const token = events[index2][1];
    if ((token.type === "labelLink" || token.type === "labelImage") && !token._balanced) {
      result = true;
      break;
    }
    if (token._gfmAutolinkLiteralWalkedInto) {
      result = false;
      break;
    }
  }
  if (events.length > 0 && !result) {
    events[events.length - 1][1]._gfmAutolinkLiteralWalkedInto = true;
  }
  return result;
}

// node_modules/micromark-extension-gfm-footnote/lib/syntax.js
var indent = {
  tokenize: tokenizeIndent2,
  partial: true
};
function gfmFootnote() {
  return {
    document: {
      [91]: {
        name: "gfmFootnoteDefinition",
        tokenize: tokenizeDefinitionStart,
        continuation: {
          tokenize: tokenizeDefinitionContinuation
        },
        exit: gfmFootnoteDefinitionEnd
      }
    },
    text: {
      [91]: {
        name: "gfmFootnoteCall",
        tokenize: tokenizeGfmFootnoteCall
      },
      [93]: {
        name: "gfmPotentialFootnoteCall",
        add: "after",
        tokenize: tokenizePotentialGfmFootnoteCall,
        resolveTo: resolveToPotentialGfmFootnoteCall
      }
    }
  };
}
function tokenizePotentialGfmFootnoteCall(effects, ok3, nok) {
  const self = this;
  let index2 = self.events.length;
  const defined = self.parser.gfmFootnotes || (self.parser.gfmFootnotes = []);
  let labelStart;
  while (index2--) {
    const token = self.events[index2][1];
    if (token.type === "labelImage") {
      labelStart = token;
      break;
    }
    if (token.type === "gfmFootnoteCall" || token.type === "labelLink" || token.type === "label" || token.type === "image" || token.type === "link") {
      break;
    }
  }
  return start;
  function start(code2) {
    if (!labelStart || !labelStart._balanced) {
      return nok(code2);
    }
    const id = normalizeIdentifier(self.sliceSerialize({
      start: labelStart.end,
      end: self.now()
    }));
    if (id.codePointAt(0) !== 94 || !defined.includes(id.slice(1))) {
      return nok(code2);
    }
    effects.enter("gfmFootnoteCallLabelMarker");
    effects.consume(code2);
    effects.exit("gfmFootnoteCallLabelMarker");
    return ok3(code2);
  }
}
function resolveToPotentialGfmFootnoteCall(events, context) {
  let index2 = events.length;
  let labelStart;
  while (index2--) {
    if (events[index2][1].type === "labelImage" && events[index2][0] === "enter") {
      labelStart = events[index2][1];
      break;
    }
  }
  events[index2 + 1][1].type = "data";
  events[index2 + 3][1].type = "gfmFootnoteCallLabelMarker";
  const call = {
    type: "gfmFootnoteCall",
    start: Object.assign({}, events[index2 + 3][1].start),
    end: Object.assign({}, events[events.length - 1][1].end)
  };
  const marker = {
    type: "gfmFootnoteCallMarker",
    start: Object.assign({}, events[index2 + 3][1].end),
    end: Object.assign({}, events[index2 + 3][1].end)
  };
  marker.end.column++;
  marker.end.offset++;
  marker.end._bufferIndex++;
  const string3 = {
    type: "gfmFootnoteCallString",
    start: Object.assign({}, marker.end),
    end: Object.assign({}, events[events.length - 1][1].start)
  };
  const chunk = {
    type: "chunkString",
    contentType: "string",
    start: Object.assign({}, string3.start),
    end: Object.assign({}, string3.end)
  };
  const replacement = [
    // Take the `labelImageMarker` (now `data`, the `!`)
    events[index2 + 1],
    events[index2 + 2],
    ["enter", call, context],
    // The `[`
    events[index2 + 3],
    events[index2 + 4],
    // The `^`.
    ["enter", marker, context],
    ["exit", marker, context],
    // Everything in between.
    ["enter", string3, context],
    ["enter", chunk, context],
    ["exit", chunk, context],
    ["exit", string3, context],
    // The ending (`]`, properly parsed and labelled).
    events[events.length - 2],
    events[events.length - 1],
    ["exit", call, context]
  ];
  events.splice(index2, events.length - index2 + 1, ...replacement);
  return events;
}
function tokenizeGfmFootnoteCall(effects, ok3, nok) {
  const self = this;
  const defined = self.parser.gfmFootnotes || (self.parser.gfmFootnotes = []);
  let size = 0;
  let data;
  return start;
  function start(code2) {
    effects.enter("gfmFootnoteCall");
    effects.enter("gfmFootnoteCallLabelMarker");
    effects.consume(code2);
    effects.exit("gfmFootnoteCallLabelMarker");
    return callStart;
  }
  function callStart(code2) {
    if (code2 !== 94) return nok(code2);
    effects.enter("gfmFootnoteCallMarker");
    effects.consume(code2);
    effects.exit("gfmFootnoteCallMarker");
    effects.enter("gfmFootnoteCallString");
    effects.enter("chunkString").contentType = "string";
    return callData;
  }
  function callData(code2) {
    if (
      // Too long.
      size > 999 || // Closing brace with nothing.
      code2 === 93 && !data || // Space or tab is not supported by GFM for some reason.
      // `\n` and `[` not being supported makes sense.
      code2 === null || code2 === 91 || markdownLineEndingOrSpace2(code2)
    ) {
      return nok(code2);
    }
    if (code2 === 93) {
      effects.exit("chunkString");
      const token = effects.exit("gfmFootnoteCallString");
      if (!defined.includes(normalizeIdentifier(self.sliceSerialize(token)))) {
        return nok(code2);
      }
      effects.enter("gfmFootnoteCallLabelMarker");
      effects.consume(code2);
      effects.exit("gfmFootnoteCallLabelMarker");
      effects.exit("gfmFootnoteCall");
      return ok3;
    }
    if (!markdownLineEndingOrSpace2(code2)) {
      data = true;
    }
    size++;
    effects.consume(code2);
    return code2 === 92 ? callEscape : callData;
  }
  function callEscape(code2) {
    if (code2 === 91 || code2 === 92 || code2 === 93) {
      effects.consume(code2);
      size++;
      return callData;
    }
    return callData(code2);
  }
}
function tokenizeDefinitionStart(effects, ok3, nok) {
  const self = this;
  const defined = self.parser.gfmFootnotes || (self.parser.gfmFootnotes = []);
  let identifier;
  let size = 0;
  let data;
  return start;
  function start(code2) {
    effects.enter("gfmFootnoteDefinition")._container = true;
    effects.enter("gfmFootnoteDefinitionLabel");
    effects.enter("gfmFootnoteDefinitionLabelMarker");
    effects.consume(code2);
    effects.exit("gfmFootnoteDefinitionLabelMarker");
    return labelAtMarker;
  }
  function labelAtMarker(code2) {
    if (code2 === 94) {
      effects.enter("gfmFootnoteDefinitionMarker");
      effects.consume(code2);
      effects.exit("gfmFootnoteDefinitionMarker");
      effects.enter("gfmFootnoteDefinitionLabelString");
      effects.enter("chunkString").contentType = "string";
      return labelInside;
    }
    return nok(code2);
  }
  function labelInside(code2) {
    if (
      // Too long.
      size > 999 || // Closing brace with nothing.
      code2 === 93 && !data || // Space or tab is not supported by GFM for some reason.
      // `\n` and `[` not being supported makes sense.
      code2 === null || code2 === 91 || markdownLineEndingOrSpace2(code2)
    ) {
      return nok(code2);
    }
    if (code2 === 93) {
      effects.exit("chunkString");
      const token = effects.exit("gfmFootnoteDefinitionLabelString");
      identifier = normalizeIdentifier(self.sliceSerialize(token));
      effects.enter("gfmFootnoteDefinitionLabelMarker");
      effects.consume(code2);
      effects.exit("gfmFootnoteDefinitionLabelMarker");
      effects.exit("gfmFootnoteDefinitionLabel");
      return labelAfter;
    }
    if (!markdownLineEndingOrSpace2(code2)) {
      data = true;
    }
    size++;
    effects.consume(code2);
    return code2 === 92 ? labelEscape : labelInside;
  }
  function labelEscape(code2) {
    if (code2 === 91 || code2 === 92 || code2 === 93) {
      effects.consume(code2);
      size++;
      return labelInside;
    }
    return labelInside(code2);
  }
  function labelAfter(code2) {
    if (code2 === 58) {
      effects.enter("definitionMarker");
      effects.consume(code2);
      effects.exit("definitionMarker");
      if (!defined.includes(identifier)) {
        defined.push(identifier);
      }
      return factorySpace(effects, whitespaceAfter, "gfmFootnoteDefinitionWhitespace");
    }
    return nok(code2);
  }
  function whitespaceAfter(code2) {
    return ok3(code2);
  }
}
function tokenizeDefinitionContinuation(effects, ok3, nok) {
  return effects.check(blankLine, ok3, effects.attempt(indent, ok3, nok));
}
function gfmFootnoteDefinitionEnd(effects) {
  effects.exit("gfmFootnoteDefinition");
}
function tokenizeIndent2(effects, ok3, nok) {
  const self = this;
  return factorySpace(effects, afterPrefix, "gfmFootnoteDefinitionIndent", 4 + 1);
  function afterPrefix(code2) {
    const tail = self.events[self.events.length - 1];
    return tail && tail[1].type === "gfmFootnoteDefinitionIndent" && tail[2].sliceSerialize(tail[1], true).length === 4 ? ok3(code2) : nok(code2);
  }
}

// node_modules/micromark-extension-gfm-strikethrough/lib/syntax.js
function gfmStrikethrough(options2) {
  const options_ = options2 || {};
  let single = options_.singleTilde;
  const tokenizer = {
    name: "strikethrough",
    tokenize: tokenizeStrikethrough,
    resolveAll: resolveAllStrikethrough
  };
  if (single === null || single === void 0) {
    single = true;
  }
  return {
    text: {
      [126]: tokenizer
    },
    insideSpan: {
      null: [tokenizer]
    },
    attentionMarkers: {
      null: [126]
    }
  };
  function resolveAllStrikethrough(events, context) {
    let index2 = -1;
    while (++index2 < events.length) {
      if (events[index2][0] === "enter" && events[index2][1].type === "strikethroughSequenceTemporary" && events[index2][1]._close) {
        let open = index2;
        while (open--) {
          if (events[open][0] === "exit" && events[open][1].type === "strikethroughSequenceTemporary" && events[open][1]._open && // If the sizes are the same:
          events[index2][1].end.offset - events[index2][1].start.offset === events[open][1].end.offset - events[open][1].start.offset) {
            events[index2][1].type = "strikethroughSequence";
            events[open][1].type = "strikethroughSequence";
            const strikethrough = {
              type: "strikethrough",
              start: Object.assign({}, events[open][1].start),
              end: Object.assign({}, events[index2][1].end)
            };
            const text4 = {
              type: "strikethroughText",
              start: Object.assign({}, events[open][1].end),
              end: Object.assign({}, events[index2][1].start)
            };
            const nextEvents = [["enter", strikethrough, context], ["enter", events[open][1], context], ["exit", events[open][1], context], ["enter", text4, context]];
            const insideSpan2 = context.parser.constructs.insideSpan.null;
            if (insideSpan2) {
              splice(nextEvents, nextEvents.length, 0, resolveAll(insideSpan2, events.slice(open + 1, index2), context));
            }
            splice(nextEvents, nextEvents.length, 0, [["exit", text4, context], ["enter", events[index2][1], context], ["exit", events[index2][1], context], ["exit", strikethrough, context]]);
            splice(events, open - 1, index2 - open + 3, nextEvents);
            index2 = open + nextEvents.length - 2;
            break;
          }
        }
      }
    }
    index2 = -1;
    while (++index2 < events.length) {
      if (events[index2][1].type === "strikethroughSequenceTemporary") {
        events[index2][1].type = "data";
      }
    }
    return events;
  }
  function tokenizeStrikethrough(effects, ok3, nok) {
    const previous4 = this.previous;
    const events = this.events;
    let size = 0;
    return start;
    function start(code2) {
      if (previous4 === 126 && events[events.length - 1][1].type !== "characterEscape") {
        return nok(code2);
      }
      effects.enter("strikethroughSequenceTemporary");
      return more(code2);
    }
    function more(code2) {
      const before = classifyCharacter(previous4);
      if (code2 === 126) {
        if (size > 1) return nok(code2);
        effects.consume(code2);
        size++;
        return more;
      }
      if (size < 2 && !single) return nok(code2);
      const token = effects.exit("strikethroughSequenceTemporary");
      const after = classifyCharacter(code2);
      token._open = !after || after === 2 && Boolean(before);
      token._close = !before || before === 2 && Boolean(after);
      return ok3(code2);
    }
  }
}

// node_modules/micromark-extension-gfm-table/lib/edit-map.js
var EditMap = class {
  /**
   * Create a new edit map.
   */
  constructor() {
    this.map = [];
  }
  /**
   * Create an edit: a remove and/or add at a certain place.
   *
   * @param {number} index
   * @param {number} remove
   * @param {Array<Event>} add
   * @returns {undefined}
   */
  add(index2, remove, add) {
    addImplementation(this, index2, remove, add);
  }
  // To do: add this when moving to `micromark`.
  // /**
  //  * Create an edit: but insert `add` before existing additions.
  //  *
  //  * @param {number} index
  //  * @param {number} remove
  //  * @param {Array<Event>} add
  //  * @returns {undefined}
  //  */
  // addBefore(index, remove, add) {
  //   addImplementation(this, index, remove, add, true)
  // }
  /**
   * Done, change the events.
   *
   * @param {Array<Event>} events
   * @returns {undefined}
   */
  consume(events) {
    this.map.sort(function(a, b) {
      return a[0] - b[0];
    });
    if (this.map.length === 0) {
      return;
    }
    let index2 = this.map.length;
    const vecs = [];
    while (index2 > 0) {
      index2 -= 1;
      vecs.push(events.slice(this.map[index2][0] + this.map[index2][1]), this.map[index2][2]);
      events.length = this.map[index2][0];
    }
    vecs.push(events.slice());
    events.length = 0;
    let slice = vecs.pop();
    while (slice) {
      for (const element of slice) {
        events.push(element);
      }
      slice = vecs.pop();
    }
    this.map.length = 0;
  }
};
function addImplementation(editMap, at2, remove, add) {
  let index2 = 0;
  if (remove === 0 && add.length === 0) {
    return;
  }
  while (index2 < editMap.map.length) {
    if (editMap.map[index2][0] === at2) {
      editMap.map[index2][1] += remove;
      editMap.map[index2][2].push(...add);
      return;
    }
    index2 += 1;
  }
  editMap.map.push([at2, remove, add]);
}

// node_modules/micromark-extension-gfm-table/lib/infer.js
function gfmTableAlign(events, index2) {
  let inDelimiterRow = false;
  const align2 = [];
  while (index2 < events.length) {
    const event = events[index2];
    if (inDelimiterRow) {
      if (event[0] === "enter") {
        if (event[1].type === "tableContent") {
          align2.push(events[index2 + 1][1].type === "tableDelimiterMarker" ? "left" : "none");
        }
      } else if (event[1].type === "tableContent") {
        if (events[index2 - 1][1].type === "tableDelimiterMarker") {
          const alignIndex = align2.length - 1;
          align2[alignIndex] = align2[alignIndex] === "left" ? "center" : "right";
        }
      } else if (event[1].type === "tableDelimiterRow") {
        break;
      }
    } else if (event[0] === "enter" && event[1].type === "tableDelimiterRow") {
      inDelimiterRow = true;
    }
    index2 += 1;
  }
  return align2;
}

// node_modules/micromark-extension-gfm-table/lib/syntax.js
function gfmTable() {
  return {
    flow: {
      null: {
        name: "table",
        tokenize: tokenizeTable,
        resolveAll: resolveTable
      }
    }
  };
}
function tokenizeTable(effects, ok3, nok) {
  const self = this;
  let size = 0;
  let sizeB = 0;
  let seen;
  return start;
  function start(code2) {
    let index2 = self.events.length - 1;
    while (index2 > -1) {
      const type = self.events[index2][1].type;
      if (type === "lineEnding" || // Note: markdown-rs uses `whitespace` instead of `linePrefix`
      type === "linePrefix") index2--;
      else break;
    }
    const tail = index2 > -1 ? self.events[index2][1].type : null;
    const next = tail === "tableHead" || tail === "tableRow" ? bodyRowStart : headRowBefore;
    if (next === bodyRowStart && self.parser.lazy[self.now().line]) {
      return nok(code2);
    }
    return next(code2);
  }
  function headRowBefore(code2) {
    effects.enter("tableHead");
    effects.enter("tableRow");
    return headRowStart(code2);
  }
  function headRowStart(code2) {
    if (code2 === 124) {
      return headRowBreak(code2);
    }
    seen = true;
    sizeB += 1;
    return headRowBreak(code2);
  }
  function headRowBreak(code2) {
    if (code2 === null) {
      return nok(code2);
    }
    if (markdownLineEnding2(code2)) {
      if (sizeB > 1) {
        sizeB = 0;
        self.interrupt = true;
        effects.exit("tableRow");
        effects.enter("lineEnding");
        effects.consume(code2);
        effects.exit("lineEnding");
        return headDelimiterStart;
      }
      return nok(code2);
    }
    if (markdownSpace(code2)) {
      return factorySpace(effects, headRowBreak, "whitespace")(code2);
    }
    sizeB += 1;
    if (seen) {
      seen = false;
      size += 1;
    }
    if (code2 === 124) {
      effects.enter("tableCellDivider");
      effects.consume(code2);
      effects.exit("tableCellDivider");
      seen = true;
      return headRowBreak;
    }
    effects.enter("data");
    return headRowData(code2);
  }
  function headRowData(code2) {
    if (code2 === null || code2 === 124 || markdownLineEndingOrSpace2(code2)) {
      effects.exit("data");
      return headRowBreak(code2);
    }
    effects.consume(code2);
    return code2 === 92 ? headRowEscape : headRowData;
  }
  function headRowEscape(code2) {
    if (code2 === 92 || code2 === 124) {
      effects.consume(code2);
      return headRowData;
    }
    return headRowData(code2);
  }
  function headDelimiterStart(code2) {
    self.interrupt = false;
    if (self.parser.lazy[self.now().line]) {
      return nok(code2);
    }
    effects.enter("tableDelimiterRow");
    seen = false;
    if (markdownSpace(code2)) {
      return factorySpace(effects, headDelimiterBefore, "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code2);
    }
    return headDelimiterBefore(code2);
  }
  function headDelimiterBefore(code2) {
    if (code2 === 45 || code2 === 58) {
      return headDelimiterValueBefore(code2);
    }
    if (code2 === 124) {
      seen = true;
      effects.enter("tableCellDivider");
      effects.consume(code2);
      effects.exit("tableCellDivider");
      return headDelimiterCellBefore;
    }
    return headDelimiterNok(code2);
  }
  function headDelimiterCellBefore(code2) {
    if (markdownSpace(code2)) {
      return factorySpace(effects, headDelimiterValueBefore, "whitespace")(code2);
    }
    return headDelimiterValueBefore(code2);
  }
  function headDelimiterValueBefore(code2) {
    if (code2 === 58) {
      sizeB += 1;
      seen = true;
      effects.enter("tableDelimiterMarker");
      effects.consume(code2);
      effects.exit("tableDelimiterMarker");
      return headDelimiterLeftAlignmentAfter;
    }
    if (code2 === 45) {
      sizeB += 1;
      return headDelimiterLeftAlignmentAfter(code2);
    }
    if (code2 === null || markdownLineEnding2(code2)) {
      return headDelimiterCellAfter(code2);
    }
    return headDelimiterNok(code2);
  }
  function headDelimiterLeftAlignmentAfter(code2) {
    if (code2 === 45) {
      effects.enter("tableDelimiterFiller");
      return headDelimiterFiller(code2);
    }
    return headDelimiterNok(code2);
  }
  function headDelimiterFiller(code2) {
    if (code2 === 45) {
      effects.consume(code2);
      return headDelimiterFiller;
    }
    if (code2 === 58) {
      seen = true;
      effects.exit("tableDelimiterFiller");
      effects.enter("tableDelimiterMarker");
      effects.consume(code2);
      effects.exit("tableDelimiterMarker");
      return headDelimiterRightAlignmentAfter;
    }
    effects.exit("tableDelimiterFiller");
    return headDelimiterRightAlignmentAfter(code2);
  }
  function headDelimiterRightAlignmentAfter(code2) {
    if (markdownSpace(code2)) {
      return factorySpace(effects, headDelimiterCellAfter, "whitespace")(code2);
    }
    return headDelimiterCellAfter(code2);
  }
  function headDelimiterCellAfter(code2) {
    if (code2 === 124) {
      return headDelimiterBefore(code2);
    }
    if (code2 === null || markdownLineEnding2(code2)) {
      if (!seen || size !== sizeB) {
        return headDelimiterNok(code2);
      }
      effects.exit("tableDelimiterRow");
      effects.exit("tableHead");
      return ok3(code2);
    }
    return headDelimiterNok(code2);
  }
  function headDelimiterNok(code2) {
    return nok(code2);
  }
  function bodyRowStart(code2) {
    effects.enter("tableRow");
    return bodyRowBreak(code2);
  }
  function bodyRowBreak(code2) {
    if (code2 === 124) {
      effects.enter("tableCellDivider");
      effects.consume(code2);
      effects.exit("tableCellDivider");
      return bodyRowBreak;
    }
    if (code2 === null || markdownLineEnding2(code2)) {
      effects.exit("tableRow");
      return ok3(code2);
    }
    if (markdownSpace(code2)) {
      return factorySpace(effects, bodyRowBreak, "whitespace")(code2);
    }
    effects.enter("data");
    return bodyRowData(code2);
  }
  function bodyRowData(code2) {
    if (code2 === null || code2 === 124 || markdownLineEndingOrSpace2(code2)) {
      effects.exit("data");
      return bodyRowBreak(code2);
    }
    effects.consume(code2);
    return code2 === 92 ? bodyRowEscape : bodyRowData;
  }
  function bodyRowEscape(code2) {
    if (code2 === 92 || code2 === 124) {
      effects.consume(code2);
      return bodyRowData;
    }
    return bodyRowData(code2);
  }
}
function resolveTable(events, context) {
  let index2 = -1;
  let inFirstCellAwaitingPipe = true;
  let rowKind = 0;
  let lastCell = [0, 0, 0, 0];
  let cell = [0, 0, 0, 0];
  let afterHeadAwaitingFirstBodyRow = false;
  let lastTableEnd = 0;
  let currentTable;
  let currentBody;
  let currentCell;
  const map = new EditMap();
  while (++index2 < events.length) {
    const event = events[index2];
    const token = event[1];
    if (event[0] === "enter") {
      if (token.type === "tableHead") {
        afterHeadAwaitingFirstBodyRow = false;
        if (lastTableEnd !== 0) {
          flushTableEnd(map, context, lastTableEnd, currentTable, currentBody);
          currentBody = void 0;
          lastTableEnd = 0;
        }
        currentTable = {
          type: "table",
          start: Object.assign({}, token.start),
          // Note: correct end is set later.
          end: Object.assign({}, token.end)
        };
        map.add(index2, 0, [["enter", currentTable, context]]);
      } else if (token.type === "tableRow" || token.type === "tableDelimiterRow") {
        inFirstCellAwaitingPipe = true;
        currentCell = void 0;
        lastCell = [0, 0, 0, 0];
        cell = [0, index2 + 1, 0, 0];
        if (afterHeadAwaitingFirstBodyRow) {
          afterHeadAwaitingFirstBodyRow = false;
          currentBody = {
            type: "tableBody",
            start: Object.assign({}, token.start),
            // Note: correct end is set later.
            end: Object.assign({}, token.end)
          };
          map.add(index2, 0, [["enter", currentBody, context]]);
        }
        rowKind = token.type === "tableDelimiterRow" ? 2 : currentBody ? 3 : 1;
      } else if (rowKind && (token.type === "data" || token.type === "tableDelimiterMarker" || token.type === "tableDelimiterFiller")) {
        inFirstCellAwaitingPipe = false;
        if (cell[2] === 0) {
          if (lastCell[1] !== 0) {
            cell[0] = cell[1];
            currentCell = flushCell(map, context, lastCell, rowKind, void 0, currentCell);
            lastCell = [0, 0, 0, 0];
          }
          cell[2] = index2;
        }
      } else if (token.type === "tableCellDivider") {
        if (inFirstCellAwaitingPipe) {
          inFirstCellAwaitingPipe = false;
        } else {
          if (lastCell[1] !== 0) {
            cell[0] = cell[1];
            currentCell = flushCell(map, context, lastCell, rowKind, void 0, currentCell);
          }
          lastCell = cell;
          cell = [lastCell[1], index2, 0, 0];
        }
      }
    } else if (token.type === "tableHead") {
      afterHeadAwaitingFirstBodyRow = true;
      lastTableEnd = index2;
    } else if (token.type === "tableRow" || token.type === "tableDelimiterRow") {
      lastTableEnd = index2;
      if (lastCell[1] !== 0) {
        cell[0] = cell[1];
        currentCell = flushCell(map, context, lastCell, rowKind, index2, currentCell);
      } else if (cell[1] !== 0) {
        currentCell = flushCell(map, context, cell, rowKind, index2, currentCell);
      }
      rowKind = 0;
    } else if (rowKind && (token.type === "data" || token.type === "tableDelimiterMarker" || token.type === "tableDelimiterFiller")) {
      cell[3] = index2;
    }
  }
  if (lastTableEnd !== 0) {
    flushTableEnd(map, context, lastTableEnd, currentTable, currentBody);
  }
  map.consume(context.events);
  index2 = -1;
  while (++index2 < context.events.length) {
    const event = context.events[index2];
    if (event[0] === "enter" && event[1].type === "table") {
      event[1]._align = gfmTableAlign(context.events, index2);
    }
  }
  return events;
}
function flushCell(map, context, range, rowKind, rowEnd, previousCell) {
  const groupName = rowKind === 1 ? "tableHeader" : rowKind === 2 ? "tableDelimiter" : "tableData";
  const valueName = "tableContent";
  if (range[0] !== 0) {
    previousCell.end = Object.assign({}, getPoint(context.events, range[0]));
    map.add(range[0], 0, [["exit", previousCell, context]]);
  }
  const now = getPoint(context.events, range[1]);
  previousCell = {
    type: groupName,
    start: Object.assign({}, now),
    // Note: correct end is set later.
    end: Object.assign({}, now)
  };
  map.add(range[1], 0, [["enter", previousCell, context]]);
  if (range[2] !== 0) {
    const relatedStart = getPoint(context.events, range[2]);
    const relatedEnd = getPoint(context.events, range[3]);
    const valueToken = {
      type: valueName,
      start: Object.assign({}, relatedStart),
      end: Object.assign({}, relatedEnd)
    };
    map.add(range[2], 0, [["enter", valueToken, context]]);
    if (rowKind !== 2) {
      const start = context.events[range[2]];
      const end = context.events[range[3]];
      start[1].end = Object.assign({}, end[1].end);
      start[1].type = "chunkText";
      start[1].contentType = "text";
      if (range[3] > range[2] + 1) {
        const a = range[2] + 1;
        const b = range[3] - range[2] - 1;
        map.add(a, b, []);
      }
    }
    map.add(range[3] + 1, 0, [["exit", valueToken, context]]);
  }
  if (rowEnd !== void 0) {
    previousCell.end = Object.assign({}, getPoint(context.events, rowEnd));
    map.add(rowEnd, 0, [["exit", previousCell, context]]);
    previousCell = void 0;
  }
  return previousCell;
}
function flushTableEnd(map, context, index2, table, tableBody) {
  const exits = [];
  const related = getPoint(context.events, index2);
  if (tableBody) {
    tableBody.end = Object.assign({}, related);
    exits.push(["exit", tableBody, context]);
  }
  table.end = Object.assign({}, related);
  exits.push(["exit", table, context]);
  map.add(index2 + 1, 0, exits);
}
function getPoint(events, index2) {
  const event = events[index2];
  const side = event[0] === "enter" ? "start" : "end";
  return event[1][side];
}

// node_modules/micromark-extension-gfm-task-list-item/lib/syntax.js
var tasklistCheck = {
  name: "tasklistCheck",
  tokenize: tokenizeTasklistCheck
};
function gfmTaskListItem() {
  return {
    text: {
      [91]: tasklistCheck
    }
  };
}
function tokenizeTasklistCheck(effects, ok3, nok) {
  const self = this;
  return open;
  function open(code2) {
    if (
      // Exit if there’s stuff before.
      self.previous !== null || // Exit if not in the first content that is the first child of a list
      // item.
      !self._gfmTasklistFirstContentOfListItem
    ) {
      return nok(code2);
    }
    effects.enter("taskListCheck");
    effects.enter("taskListCheckMarker");
    effects.consume(code2);
    effects.exit("taskListCheckMarker");
    return inside;
  }
  function inside(code2) {
    if (markdownLineEndingOrSpace2(code2)) {
      effects.enter("taskListCheckValueUnchecked");
      effects.consume(code2);
      effects.exit("taskListCheckValueUnchecked");
      return close;
    }
    if (code2 === 88 || code2 === 120) {
      effects.enter("taskListCheckValueChecked");
      effects.consume(code2);
      effects.exit("taskListCheckValueChecked");
      return close;
    }
    return nok(code2);
  }
  function close(code2) {
    if (code2 === 93) {
      effects.enter("taskListCheckMarker");
      effects.consume(code2);
      effects.exit("taskListCheckMarker");
      effects.exit("taskListCheck");
      return after;
    }
    return nok(code2);
  }
  function after(code2) {
    if (markdownLineEnding2(code2)) {
      return ok3(code2);
    }
    if (markdownSpace(code2)) {
      return effects.check({
        tokenize: spaceThenNonSpace
      }, ok3, nok)(code2);
    }
    return nok(code2);
  }
}
function spaceThenNonSpace(effects, ok3, nok) {
  return factorySpace(effects, after, "whitespace");
  function after(code2) {
    return code2 === null ? nok(code2) : ok3(code2);
  }
}

// node_modules/micromark-extension-gfm/index.js
function gfm(options2) {
  return combineExtensions([
    gfmAutolinkLiteral(),
    gfmFootnote(),
    gfmStrikethrough(options2),
    gfmTable(),
    gfmTaskListItem()
  ]);
}

// node_modules/micromark-extension-math/lib/math-flow.js
var mathFlow = {
  tokenize: tokenizeMathFenced,
  concrete: true,
  name: "mathFlow"
};
var nonLazyContinuation2 = {
  tokenize: tokenizeNonLazyContinuation2,
  partial: true
};
function tokenizeMathFenced(effects, ok3, nok) {
  const self = this;
  const tail = self.events[self.events.length - 1];
  const initialSize = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
  let sizeOpen = 0;
  return start;
  function start(code2) {
    effects.enter("mathFlow");
    effects.enter("mathFlowFence");
    effects.enter("mathFlowFenceSequence");
    return sequenceOpen(code2);
  }
  function sequenceOpen(code2) {
    if (code2 === 36) {
      effects.consume(code2);
      sizeOpen++;
      return sequenceOpen;
    }
    if (sizeOpen < 2) {
      return nok(code2);
    }
    effects.exit("mathFlowFenceSequence");
    return factorySpace(effects, metaBefore, "whitespace")(code2);
  }
  function metaBefore(code2) {
    if (code2 === null || markdownLineEnding2(code2)) {
      return metaAfter(code2);
    }
    effects.enter("mathFlowFenceMeta");
    effects.enter("chunkString", {
      contentType: "string"
    });
    return meta(code2);
  }
  function meta(code2) {
    if (code2 === null || markdownLineEnding2(code2)) {
      effects.exit("chunkString");
      effects.exit("mathFlowFenceMeta");
      return metaAfter(code2);
    }
    if (code2 === 36) {
      return nok(code2);
    }
    effects.consume(code2);
    return meta;
  }
  function metaAfter(code2) {
    effects.exit("mathFlowFence");
    if (self.interrupt) {
      return ok3(code2);
    }
    return effects.attempt(nonLazyContinuation2, beforeNonLazyContinuation, after)(code2);
  }
  function beforeNonLazyContinuation(code2) {
    return effects.attempt({
      tokenize: tokenizeClosingFence,
      partial: true
    }, after, contentStart)(code2);
  }
  function contentStart(code2) {
    return (initialSize ? factorySpace(effects, beforeContentChunk, "linePrefix", initialSize + 1) : beforeContentChunk)(code2);
  }
  function beforeContentChunk(code2) {
    if (code2 === null) {
      return after(code2);
    }
    if (markdownLineEnding2(code2)) {
      return effects.attempt(nonLazyContinuation2, beforeNonLazyContinuation, after)(code2);
    }
    effects.enter("mathFlowValue");
    return contentChunk(code2);
  }
  function contentChunk(code2) {
    if (code2 === null || markdownLineEnding2(code2)) {
      effects.exit("mathFlowValue");
      return beforeContentChunk(code2);
    }
    effects.consume(code2);
    return contentChunk;
  }
  function after(code2) {
    effects.exit("mathFlow");
    return ok3(code2);
  }
  function tokenizeClosingFence(effects2, ok4, nok2) {
    let size = 0;
    return factorySpace(effects2, beforeSequenceClose, "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
    function beforeSequenceClose(code2) {
      effects2.enter("mathFlowFence");
      effects2.enter("mathFlowFenceSequence");
      return sequenceClose(code2);
    }
    function sequenceClose(code2) {
      if (code2 === 36) {
        size++;
        effects2.consume(code2);
        return sequenceClose;
      }
      if (size < sizeOpen) {
        return nok2(code2);
      }
      effects2.exit("mathFlowFenceSequence");
      return factorySpace(effects2, afterSequenceClose, "whitespace")(code2);
    }
    function afterSequenceClose(code2) {
      if (code2 === null || markdownLineEnding2(code2)) {
        effects2.exit("mathFlowFence");
        return ok4(code2);
      }
      return nok2(code2);
    }
  }
}
function tokenizeNonLazyContinuation2(effects, ok3, nok) {
  const self = this;
  return start;
  function start(code2) {
    if (code2 === null) {
      return ok3(code2);
    }
    effects.enter("lineEnding");
    effects.consume(code2);
    effects.exit("lineEnding");
    return lineStart;
  }
  function lineStart(code2) {
    return self.parser.lazy[self.now().line] ? nok(code2) : ok3(code2);
  }
}

// node_modules/micromark-extension-math/lib/math-text.js
function mathText(options2) {
  const options_ = options2 || {};
  let single = options_.singleDollarTextMath;
  if (single === null || single === void 0) {
    single = true;
  }
  return {
    tokenize: tokenizeMathText,
    resolve: resolveMathText,
    previous: previous2,
    name: "mathText"
  };
  function tokenizeMathText(effects, ok3, nok) {
    const self = this;
    let sizeOpen = 0;
    let size;
    let token;
    return start;
    function start(code2) {
      effects.enter("mathText");
      effects.enter("mathTextSequence");
      return sequenceOpen(code2);
    }
    function sequenceOpen(code2) {
      if (code2 === 36) {
        effects.consume(code2);
        sizeOpen++;
        return sequenceOpen;
      }
      if (sizeOpen < 2 && !single) {
        return nok(code2);
      }
      effects.exit("mathTextSequence");
      return between(code2);
    }
    function between(code2) {
      if (code2 === null) {
        return nok(code2);
      }
      if (code2 === 36) {
        token = effects.enter("mathTextSequence");
        size = 0;
        return sequenceClose(code2);
      }
      if (code2 === 32) {
        effects.enter("space");
        effects.consume(code2);
        effects.exit("space");
        return between;
      }
      if (markdownLineEnding2(code2)) {
        effects.enter("lineEnding");
        effects.consume(code2);
        effects.exit("lineEnding");
        return between;
      }
      effects.enter("mathTextData");
      return data(code2);
    }
    function data(code2) {
      if (code2 === null || code2 === 32 || code2 === 36 || markdownLineEnding2(code2)) {
        effects.exit("mathTextData");
        return between(code2);
      }
      effects.consume(code2);
      return data;
    }
    function sequenceClose(code2) {
      if (code2 === 36) {
        effects.consume(code2);
        size++;
        return sequenceClose;
      }
      if (size === sizeOpen) {
        effects.exit("mathTextSequence");
        effects.exit("mathText");
        return ok3(code2);
      }
      token.type = "mathTextData";
      return data(code2);
    }
  }
}
function resolveMathText(events) {
  let tailExitIndex = events.length - 4;
  let headEnterIndex = 3;
  let index2;
  let enter;
  if ((events[headEnterIndex][1].type === "lineEnding" || events[headEnterIndex][1].type === "space") && (events[tailExitIndex][1].type === "lineEnding" || events[tailExitIndex][1].type === "space")) {
    index2 = headEnterIndex;
    while (++index2 < tailExitIndex) {
      if (events[index2][1].type === "mathTextData") {
        events[tailExitIndex][1].type = "mathTextPadding";
        events[headEnterIndex][1].type = "mathTextPadding";
        headEnterIndex += 2;
        tailExitIndex -= 2;
        break;
      }
    }
  }
  index2 = headEnterIndex - 1;
  tailExitIndex++;
  while (++index2 <= tailExitIndex) {
    if (enter === void 0) {
      if (index2 !== tailExitIndex && events[index2][1].type !== "lineEnding") {
        enter = index2;
      }
    } else if (index2 === tailExitIndex || events[index2][1].type === "lineEnding") {
      events[enter][1].type = "mathTextData";
      if (index2 !== enter + 2) {
        events[enter][1].end = events[index2 - 1][1].end;
        events.splice(enter + 2, index2 - enter - 2);
        tailExitIndex -= index2 - enter - 2;
        index2 = enter + 2;
      }
      enter = void 0;
    }
  }
  return events;
}
function previous2(code2) {
  return code2 !== 36 || this.events[this.events.length - 1][1].type === "characterEscape";
}

// node_modules/micromark-extension-math/lib/syntax.js
function math(options2) {
  return {
    flow: {
      [36]: mathFlow
    },
    text: {
      [36]: mathText(options2)
    }
  };
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
function stringOrArrayAt(index2) {
  return this[index2 < 0 ? this.length + index2 : index2];
}
var at = /* @__PURE__ */ createMethodShim("at", function() {
  if (Array.isArray(this) || typeof this === "string") {
    return stringOrArrayAt;
  }
});
var method_at_default = at;

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

// src/utilities/replace-non-line-breaks-with-space.js
function replaceNonLineBreaksWithSpace(string3) {
  const replaced = method_replace_all_default(
    /* OPTIONAL_OBJECT: false */
    0,
    string3,
    /[^\n]/g,
    " "
  );
  if (false) {
    noop_default(replaced.length, string3.length);
  }
  return replaced;
}
var replace_non_line_breaks_with_space_default = replaceNonLineBreaksWithSpace;

// src/main/front-matter/constants.js
var FRONT_MATTER_MARK = /* @__PURE__ */ Symbol.for("PRETTIER_IS_FRONT_MATTER");

// src/main/front-matter/parse.js
var DELIMITER_LENGTH = 3;
function getFrontMatter(text4) {
  const startDelimiter = text4.slice(0, DELIMITER_LENGTH);
  if (startDelimiter !== "---" && startDelimiter !== "+++") {
    return;
  }
  const firstLineBreakIndex = text4.indexOf("\n", DELIMITER_LENGTH);
  if (firstLineBreakIndex === -1) {
    return;
  }
  const explicitLanguage = text4.slice(DELIMITER_LENGTH, firstLineBreakIndex).trim();
  let endDelimiterIndex = text4.indexOf(`
${startDelimiter}`, firstLineBreakIndex);
  let language = explicitLanguage;
  language || (language = startDelimiter === "+++" ? "toml" : "yaml");
  if (endDelimiterIndex === -1 && startDelimiter === "---" && language === "yaml") {
    endDelimiterIndex = text4.indexOf("\n...", firstLineBreakIndex);
  }
  if (endDelimiterIndex === -1) {
    return;
  }
  const frontMatterEndIndex = endDelimiterIndex + 1 + DELIMITER_LENGTH;
  const nextCharacter = text4.charAt(frontMatterEndIndex + 1);
  if (!/\s?/.test(nextCharacter)) {
    return;
  }
  const raw = text4.slice(0, frontMatterEndIndex);
  let lines;
  return {
    language,
    explicitLanguage: explicitLanguage || null,
    value: text4.slice(firstLineBreakIndex + 1, endDelimiterIndex),
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
function parse2(text4) {
  const frontMatter2 = getFrontMatter(text4);
  if (!frontMatter2) {
    return {
      content: text4
    };
  }
  return {
    frontMatter: frontMatter2,
    get content() {
      const {
        raw
      } = frontMatter2;
      return replace_non_line_breaks_with_space_default(raw) + text4.slice(raw.length);
    }
  };
}
var parse_default = parse2;

// node_modules/ccount/index.js
function ccount(value, character) {
  const source = String(value);
  if (typeof character !== "string") {
    throw new TypeError("Expected character");
  }
  let count = 0;
  let index2 = source.indexOf(character);
  while (index2 !== -1) {
    count++;
    index2 = source.indexOf(character, index2 + character.length);
  }
  return count;
}

// node_modules/escape-string-regexp/index.js
function escapeStringRegexp(string3) {
  if (typeof string3 !== "string") {
    throw new TypeError("Expected a string");
  }
  return string3.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}

// node_modules/unist-util-is/lib/index.js
var convert = (
  // Note: overloads in JSDoc can’t yet use different `@template`s.
  /**
   * @type {(
   *   (<Condition extends string>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition}) &
   *   (<Condition extends Props>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Condition) &
   *   (<Condition extends TestFunction>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Predicate<Condition, Node>) &
   *   ((test?: null | undefined) => (node?: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node) &
   *   ((test?: Test) => Check)
   * )}
   */
  /**
   * @param {Test} [test]
   * @returns {Check}
   */
  (function(test) {
    if (test === null || test === void 0) {
      return ok2;
    }
    if (typeof test === "function") {
      return castFactory(test);
    }
    if (typeof test === "object") {
      return Array.isArray(test) ? anyFactory(test) : (
        // Cast because `ReadonlyArray` goes into the above but `isArray`
        // narrows to `Array`.
        propertiesFactory(
          /** @type {Props} */
          test
        )
      );
    }
    if (typeof test === "string") {
      return typeFactory(test);
    }
    throw new Error("Expected function, string, or object as test");
  })
);
function anyFactory(tests) {
  const checks = [];
  let index2 = -1;
  while (++index2 < tests.length) {
    checks[index2] = convert(tests[index2]);
  }
  return castFactory(any);
  function any(...parameters) {
    let index3 = -1;
    while (++index3 < checks.length) {
      if (checks[index3].apply(this, parameters)) return true;
    }
    return false;
  }
}
function propertiesFactory(check) {
  const checkAsRecord = (
    /** @type {Record<string, unknown>} */
    check
  );
  return castFactory(all2);
  function all2(node2) {
    const nodeAsRecord = (
      /** @type {Record<string, unknown>} */
      /** @type {unknown} */
      node2
    );
    let key;
    for (key in check) {
      if (nodeAsRecord[key] !== checkAsRecord[key]) return false;
    }
    return true;
  }
}
function typeFactory(check) {
  return castFactory(type);
  function type(node2) {
    return node2 && node2.type === check;
  }
}
function castFactory(testFunction) {
  return check;
  function check(value, index2, parent) {
    return Boolean(
      looksLikeANode(value) && testFunction.call(
        this,
        value,
        typeof index2 === "number" ? index2 : void 0,
        parent || void 0
      )
    );
  }
}
function ok2() {
  return true;
}
function looksLikeANode(value) {
  return value !== null && typeof value === "object" && "type" in value;
}

// node_modules/unist-util-visit-parents/lib/color.js
function color(d) {
  return d;
}

// node_modules/unist-util-visit-parents/lib/index.js
var empty = [];
var CONTINUE = true;
var EXIT = false;
var SKIP = "skip";
function visitParents(tree, test, visitor, reverse) {
  let check;
  if (typeof test === "function" && typeof visitor !== "function") {
    reverse = visitor;
    visitor = test;
  } else {
    check = test;
  }
  const is2 = convert(check);
  const step = reverse ? -1 : 1;
  factory(tree, void 0, [])();
  function factory(node2, index2, parents) {
    const value = (
      /** @type {Record<string, unknown>} */
      node2 && typeof node2 === "object" ? node2 : {}
    );
    if (typeof value.type === "string") {
      const name = (
        // `hast`
        typeof value.tagName === "string" ? value.tagName : (
          // `xast`
          typeof value.name === "string" ? value.name : void 0
        )
      );
      Object.defineProperty(visit, "name", {
        value: "node (" + color(node2.type + (name ? "<" + name + ">" : "")) + ")"
      });
    }
    return visit;
    function visit() {
      let result = empty;
      let subresult;
      let offset;
      let grandparents;
      if (!test || is2(node2, index2, parents[parents.length - 1] || void 0)) {
        result = toResult(visitor(node2, parents));
        if (result[0] === EXIT) {
          return result;
        }
      }
      if ("children" in node2 && node2.children) {
        const nodeAsParent = (
          /** @type {UnistParent} */
          node2
        );
        if (nodeAsParent.children && result[0] !== SKIP) {
          offset = (reverse ? nodeAsParent.children.length : -1) + step;
          grandparents = parents.concat(nodeAsParent);
          while (offset > -1 && offset < nodeAsParent.children.length) {
            const child = nodeAsParent.children[offset];
            subresult = factory(child, offset, grandparents)();
            if (subresult[0] === EXIT) {
              return subresult;
            }
            offset = typeof subresult[1] === "number" ? subresult[1] : offset + step;
          }
        }
      }
      return result;
    }
  }
}
function toResult(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "number") {
    return [CONTINUE, value];
  }
  return value === null || value === void 0 ? empty : [value];
}

// node_modules/mdast-util-find-and-replace/lib/index.js
function findAndReplace(tree, list2, options2) {
  const settings = options2 || {};
  const ignored = convert(settings.ignore || []);
  const pairs = toPairs(list2);
  let pairIndex = -1;
  while (++pairIndex < pairs.length) {
    visitParents(tree, "text", visitor);
  }
  function visitor(node2, parents) {
    let index2 = -1;
    let grandparent;
    while (++index2 < parents.length) {
      const parent = parents[index2];
      const siblings = grandparent ? grandparent.children : void 0;
      if (ignored(
        parent,
        siblings ? siblings.indexOf(parent) : void 0,
        grandparent
      )) {
        return;
      }
      grandparent = parent;
    }
    if (grandparent) {
      return handler(node2, parents);
    }
  }
  function handler(node2, parents) {
    const parent = parents[parents.length - 1];
    const find = pairs[pairIndex][0];
    const replace2 = pairs[pairIndex][1];
    let start = 0;
    const siblings = parent.children;
    const index2 = siblings.indexOf(node2);
    let change = false;
    let nodes = [];
    find.lastIndex = 0;
    let match = find.exec(node2.value);
    while (match) {
      const position2 = match.index;
      const matchObject = {
        index: match.index,
        input: match.input,
        stack: [...parents, node2]
      };
      let value = replace2(...match, matchObject);
      if (typeof value === "string") {
        value = value.length > 0 ? { type: "text", value } : void 0;
      }
      if (value === false) {
        find.lastIndex = position2 + 1;
      } else {
        if (start !== position2) {
          nodes.push({
            type: "text",
            value: node2.value.slice(start, position2)
          });
        }
        if (Array.isArray(value)) {
          nodes.push(...value);
        } else if (value) {
          nodes.push(value);
        }
        start = position2 + match[0].length;
        change = true;
      }
      if (!find.global) {
        break;
      }
      match = find.exec(node2.value);
    }
    if (change) {
      if (start < node2.value.length) {
        nodes.push({ type: "text", value: node2.value.slice(start) });
      }
      parent.children.splice(index2, 1, ...nodes);
    } else {
      nodes = [node2];
    }
    return index2 + nodes.length;
  }
}
function toPairs(tupleOrList) {
  const result = [];
  if (!Array.isArray(tupleOrList)) {
    throw new TypeError("Expected find and replace tuple or list of tuples");
  }
  const list2 = !tupleOrList[0] || Array.isArray(tupleOrList[0]) ? tupleOrList : [tupleOrList];
  let index2 = -1;
  while (++index2 < list2.length) {
    const tuple = list2[index2];
    result.push([toExpression(tuple[0]), toFunction(tuple[1])]);
  }
  return result;
}
function toExpression(find) {
  return typeof find === "string" ? new RegExp(escapeStringRegexp(find), "g") : find;
}
function toFunction(replace2) {
  return typeof replace2 === "function" ? replace2 : function() {
    return replace2;
  };
}

// node_modules/mdast-util-gfm-autolink-literal/lib/index.js
function gfmAutolinkLiteralFromMarkdown() {
  return {
    transforms: [transformGfmAutolinkLiterals],
    enter: {
      literalAutolink: enterLiteralAutolink,
      literalAutolinkEmail: enterLiteralAutolinkValue,
      literalAutolinkHttp: enterLiteralAutolinkValue,
      literalAutolinkWww: enterLiteralAutolinkValue
    },
    exit: {
      literalAutolink: exitLiteralAutolink,
      literalAutolinkEmail: exitLiteralAutolinkEmail,
      literalAutolinkHttp: exitLiteralAutolinkHttp,
      literalAutolinkWww: exitLiteralAutolinkWww
    }
  };
}
function enterLiteralAutolink(token) {
  this.enter({ type: "link", title: null, url: "", children: [] }, token);
}
function enterLiteralAutolinkValue(token) {
  this.config.enter.autolinkProtocol.call(this, token);
}
function exitLiteralAutolinkHttp(token) {
  this.config.exit.autolinkProtocol.call(this, token);
}
function exitLiteralAutolinkWww(token) {
  this.config.exit.data.call(this, token);
  const node2 = this.stack[this.stack.length - 1];
  ok(node2.type === "link");
  node2.url = "http://" + this.sliceSerialize(token);
}
function exitLiteralAutolinkEmail(token) {
  this.config.exit.autolinkEmail.call(this, token);
}
function exitLiteralAutolink(token) {
  this.exit(token);
}
function transformGfmAutolinkLiterals(tree) {
  findAndReplace(
    tree,
    [
      [/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, findUrl],
      [/(?<=^|\s|\p{P}|\p{S})([-.\w+]+)@([-\w]+(?:\.[-\w]+)+)/gu, findEmail]
    ],
    { ignore: ["link", "linkReference"] }
  );
}
function findUrl(_, protocol, domain2, path2, match) {
  let prefix = "";
  if (!previous3(match)) {
    return false;
  }
  if (/^w/i.test(protocol)) {
    domain2 = protocol + domain2;
    protocol = "";
    prefix = "http://";
  }
  if (!isCorrectDomain(domain2)) {
    return false;
  }
  const parts = splitUrl(domain2 + path2);
  if (!parts[0]) return false;
  const result = {
    type: "link",
    title: null,
    url: prefix + protocol + parts[0],
    children: [{ type: "text", value: protocol + parts[0] }]
  };
  if (parts[1]) {
    return [result, { type: "text", value: parts[1] }];
  }
  return result;
}
function findEmail(_, atext, label, match) {
  if (
    // Not an expected previous character.
    !previous3(match, true) || // Label ends in not allowed character.
    /[-\d_]$/.test(label)
  ) {
    return false;
  }
  return {
    type: "link",
    title: null,
    url: "mailto:" + atext + "@" + label,
    children: [{ type: "text", value: atext + "@" + label }]
  };
}
function isCorrectDomain(domain2) {
  const parts = domain2.split(".");
  if (parts.length < 2 || parts[parts.length - 1] && (/_/.test(parts[parts.length - 1]) || !/[a-zA-Z\d]/.test(parts[parts.length - 1])) || parts[parts.length - 2] && (/_/.test(parts[parts.length - 2]) || !/[a-zA-Z\d]/.test(parts[parts.length - 2]))) {
    return false;
  }
  return true;
}
function splitUrl(url) {
  const trailExec = /[!"&'),.:;<>?\]}]+$/.exec(url);
  if (!trailExec) {
    return [url, void 0];
  }
  url = url.slice(0, trailExec.index);
  let trail2 = trailExec[0];
  let closingParenIndex = trail2.indexOf(")");
  const openingParens = ccount(url, "(");
  let closingParens = ccount(url, ")");
  while (closingParenIndex !== -1 && openingParens > closingParens) {
    url += trail2.slice(0, closingParenIndex + 1);
    trail2 = trail2.slice(closingParenIndex + 1);
    closingParenIndex = trail2.indexOf(")");
    closingParens++;
  }
  return [url, trail2];
}
function previous3(match, email) {
  const code2 = match.input.charCodeAt(match.index - 1);
  return (match.index === 0 || unicodeWhitespace(code2) || unicodePunctuation(code2)) && // If it’s an email, the previous character should not be a slash.
  (!email || code2 !== 47);
}

// node_modules/mdast-util-gfm-footnote/lib/index.js
footnoteReference.peek = footnoteReferencePeek;
function enterFootnoteCallString() {
  this.buffer();
}
function enterFootnoteCall(token) {
  this.enter({ type: "footnoteReference", identifier: "", label: "" }, token);
}
function enterFootnoteDefinitionLabelString() {
  this.buffer();
}
function enterFootnoteDefinition(token) {
  this.enter(
    { type: "footnoteDefinition", identifier: "", label: "", children: [] },
    token
  );
}
function exitFootnoteCallString(token) {
  const label = this.resume();
  const node2 = this.stack[this.stack.length - 1];
  ok(node2.type === "footnoteReference");
  node2.identifier = normalizeIdentifier(
    this.sliceSerialize(token)
  ).toLowerCase();
  node2.label = label;
}
function exitFootnoteCall(token) {
  this.exit(token);
}
function exitFootnoteDefinitionLabelString(token) {
  const label = this.resume();
  const node2 = this.stack[this.stack.length - 1];
  ok(node2.type === "footnoteDefinition");
  node2.identifier = normalizeIdentifier(
    this.sliceSerialize(token)
  ).toLowerCase();
  node2.label = label;
}
function exitFootnoteDefinition(token) {
  this.exit(token);
}
function footnoteReferencePeek() {
  return "[";
}
function footnoteReference(node2, _, state, info) {
  const tracker = state.createTracker(info);
  let value = tracker.move("[^");
  const exit3 = state.enter("footnoteReference");
  const subexit = state.enter("reference");
  value += tracker.move(
    state.safe(state.associationId(node2), { after: "]", before: value })
  );
  subexit();
  exit3();
  value += tracker.move("]");
  return value;
}
function gfmFootnoteFromMarkdown() {
  return {
    enter: {
      gfmFootnoteCallString: enterFootnoteCallString,
      gfmFootnoteCall: enterFootnoteCall,
      gfmFootnoteDefinitionLabelString: enterFootnoteDefinitionLabelString,
      gfmFootnoteDefinition: enterFootnoteDefinition
    },
    exit: {
      gfmFootnoteCallString: exitFootnoteCallString,
      gfmFootnoteCall: exitFootnoteCall,
      gfmFootnoteDefinitionLabelString: exitFootnoteDefinitionLabelString,
      gfmFootnoteDefinition: exitFootnoteDefinition
    }
  };
}

// node_modules/mdast-util-gfm-strikethrough/lib/index.js
handleDelete.peek = peekDelete;
function gfmStrikethroughFromMarkdown() {
  return {
    canContainEols: ["delete"],
    enter: { strikethrough: enterStrikethrough },
    exit: { strikethrough: exitStrikethrough }
  };
}
function enterStrikethrough(token) {
  this.enter({ type: "delete", children: [] }, token);
}
function exitStrikethrough(token) {
  this.exit(token);
}
function handleDelete(node2, _, state, info) {
  const tracker = state.createTracker(info);
  const exit3 = state.enter("strikethrough");
  let value = tracker.move("~~");
  value += state.containerPhrasing(node2, {
    ...tracker.current(),
    before: value,
    after: "~"
  });
  value += tracker.move("~~");
  exit3();
  return value;
}
function peekDelete() {
  return "~";
}

// node_modules/mdast-util-gfm-table/lib/index.js
function gfmTableFromMarkdown() {
  return {
    enter: {
      table: enterTable,
      tableData: enterCell,
      tableHeader: enterCell,
      tableRow: enterRow
    },
    exit: {
      codeText: exitCodeText,
      table: exitTable,
      tableData: exit2,
      tableHeader: exit2,
      tableRow: exit2
    }
  };
}
function enterTable(token) {
  const align2 = token._align;
  ok(align2, "expected `_align` on table");
  this.enter(
    {
      type: "table",
      align: align2.map(function(d) {
        return d === "none" ? null : d;
      }),
      children: []
    },
    token
  );
  this.data.inTable = true;
}
function exitTable(token) {
  this.exit(token);
  this.data.inTable = void 0;
}
function enterRow(token) {
  this.enter({ type: "tableRow", children: [] }, token);
}
function exit2(token) {
  this.exit(token);
}
function enterCell(token) {
  this.enter({ type: "tableCell", children: [] }, token);
}
function exitCodeText(token) {
  let value = this.resume();
  if (this.data.inTable) {
    value = value.replace(/\\([\\|])/g, replace);
  }
  const node2 = this.stack[this.stack.length - 1];
  ok(node2.type === "inlineCode");
  node2.value = value;
  this.exit(token);
}
function replace($0, $1) {
  return $1 === "|" ? $1 : $0;
}

// node_modules/mdast-util-gfm-task-list-item/lib/index.js
function gfmTaskListItemFromMarkdown() {
  return {
    exit: {
      taskListCheckValueChecked: exitCheck,
      taskListCheckValueUnchecked: exitCheck,
      paragraph: exitParagraphWithTaskListItem
    }
  };
}
function exitCheck(token) {
  const node2 = this.stack[this.stack.length - 2];
  ok(node2.type === "listItem");
  node2.checked = token.type === "taskListCheckValueChecked";
}
function exitParagraphWithTaskListItem(token) {
  const parent = this.stack[this.stack.length - 2];
  if (parent && parent.type === "listItem" && typeof parent.checked === "boolean") {
    const node2 = this.stack[this.stack.length - 1];
    ok(node2.type === "paragraph");
    const head = node2.children[0];
    if (head && head.type === "text") {
      const siblings = parent.children;
      let index2 = -1;
      let firstParaghraph;
      while (++index2 < siblings.length) {
        const sibling = siblings[index2];
        if (sibling.type === "paragraph") {
          firstParaghraph = sibling;
          break;
        }
      }
      if (firstParaghraph === node2) {
        head.value = head.value.slice(1);
        if (head.value.length === 0) {
          node2.children.shift();
        } else if (node2.position && head.position && typeof head.position.start.offset === "number") {
          head.position.start.column++;
          head.position.start.offset++;
          node2.position.start = Object.assign({}, head.position.start);
        }
      }
    }
  }
  this.exit(token);
}

// node_modules/mdast-util-gfm/lib/index.js
function gfmFromMarkdown() {
  return [
    gfmAutolinkLiteralFromMarkdown(),
    gfmFootnoteFromMarkdown(),
    gfmStrikethroughFromMarkdown(),
    gfmTableFromMarkdown(),
    gfmTaskListItemFromMarkdown()
  ];
}

// src/language-markdown/parse/micromark/mdast-util-gfm.js
function gfmFromMarkdown2() {
  const mdastExtensions = gfmFromMarkdown();
  const autolinkExtension = mdastExtensions.find(
    (extension2) => extension2.enter.literalAutolink
  );
  if (false) {
    noop_default(
      autolinkExtension && Array.isArray(autolinkExtension.transforms) && autolinkExtension.transforms.length === 1
    );
  }
  autolinkExtension.transforms = [];
  return mdastExtensions;
}

// node_modules/micromark-util-symbol/lib/codes.js
var codes2 = (
  /** @type {const} */
  {
    carriageReturn: -5,
    lineFeed: -4,
    carriageReturnLineFeed: -3,
    horizontalTab: -2,
    virtualSpace: -1,
    eof: null,
    nul: 0,
    soh: 1,
    stx: 2,
    etx: 3,
    eot: 4,
    enq: 5,
    ack: 6,
    bel: 7,
    bs: 8,
    ht: 9,
    // `\t`
    lf: 10,
    // `\n`
    vt: 11,
    // `\v`
    ff: 12,
    // `\f`
    cr: 13,
    // `\r`
    so: 14,
    si: 15,
    dle: 16,
    dc1: 17,
    dc2: 18,
    dc3: 19,
    dc4: 20,
    nak: 21,
    syn: 22,
    etb: 23,
    can: 24,
    em: 25,
    sub: 26,
    esc: 27,
    fs: 28,
    gs: 29,
    rs: 30,
    us: 31,
    space: 32,
    exclamationMark: 33,
    // `!`
    quotationMark: 34,
    // `"`
    numberSign: 35,
    // `#`
    dollarSign: 36,
    // `$`
    percentSign: 37,
    // `%`
    ampersand: 38,
    // `&`
    apostrophe: 39,
    // `'`
    leftParenthesis: 40,
    // `(`
    rightParenthesis: 41,
    // `)`
    asterisk: 42,
    // `*`
    plusSign: 43,
    // `+`
    comma: 44,
    // `,`
    dash: 45,
    // `-`
    dot: 46,
    // `.`
    slash: 47,
    // `/`
    digit0: 48,
    // `0`
    digit1: 49,
    // `1`
    digit2: 50,
    // `2`
    digit3: 51,
    // `3`
    digit4: 52,
    // `4`
    digit5: 53,
    // `5`
    digit6: 54,
    // `6`
    digit7: 55,
    // `7`
    digit8: 56,
    // `8`
    digit9: 57,
    // `9`
    colon: 58,
    // `:`
    semicolon: 59,
    // `;`
    lessThan: 60,
    // `<`
    equalsTo: 61,
    // `=`
    greaterThan: 62,
    // `>`
    questionMark: 63,
    // `?`
    atSign: 64,
    // `@`
    uppercaseA: 65,
    // `A`
    uppercaseB: 66,
    // `B`
    uppercaseC: 67,
    // `C`
    uppercaseD: 68,
    // `D`
    uppercaseE: 69,
    // `E`
    uppercaseF: 70,
    // `F`
    uppercaseG: 71,
    // `G`
    uppercaseH: 72,
    // `H`
    uppercaseI: 73,
    // `I`
    uppercaseJ: 74,
    // `J`
    uppercaseK: 75,
    // `K`
    uppercaseL: 76,
    // `L`
    uppercaseM: 77,
    // `M`
    uppercaseN: 78,
    // `N`
    uppercaseO: 79,
    // `O`
    uppercaseP: 80,
    // `P`
    uppercaseQ: 81,
    // `Q`
    uppercaseR: 82,
    // `R`
    uppercaseS: 83,
    // `S`
    uppercaseT: 84,
    // `T`
    uppercaseU: 85,
    // `U`
    uppercaseV: 86,
    // `V`
    uppercaseW: 87,
    // `W`
    uppercaseX: 88,
    // `X`
    uppercaseY: 89,
    // `Y`
    uppercaseZ: 90,
    // `Z`
    leftSquareBracket: 91,
    // `[`
    backslash: 92,
    // `\`
    rightSquareBracket: 93,
    // `]`
    caret: 94,
    // `^`
    underscore: 95,
    // `_`
    graveAccent: 96,
    // `` ` ``
    lowercaseA: 97,
    // `a`
    lowercaseB: 98,
    // `b`
    lowercaseC: 99,
    // `c`
    lowercaseD: 100,
    // `d`
    lowercaseE: 101,
    // `e`
    lowercaseF: 102,
    // `f`
    lowercaseG: 103,
    // `g`
    lowercaseH: 104,
    // `h`
    lowercaseI: 105,
    // `i`
    lowercaseJ: 106,
    // `j`
    lowercaseK: 107,
    // `k`
    lowercaseL: 108,
    // `l`
    lowercaseM: 109,
    // `m`
    lowercaseN: 110,
    // `n`
    lowercaseO: 111,
    // `o`
    lowercaseP: 112,
    // `p`
    lowercaseQ: 113,
    // `q`
    lowercaseR: 114,
    // `r`
    lowercaseS: 115,
    // `s`
    lowercaseT: 116,
    // `t`
    lowercaseU: 117,
    // `u`
    lowercaseV: 118,
    // `v`
    lowercaseW: 119,
    // `w`
    lowercaseX: 120,
    // `x`
    lowercaseY: 121,
    // `y`
    lowercaseZ: 122,
    // `z`
    leftCurlyBrace: 123,
    // `{`
    verticalBar: 124,
    // `|`
    rightCurlyBrace: 125,
    // `}`
    tilde: 126,
    // `~`
    del: 127,
    // Unicode Specials block.
    byteOrderMarker: 65279,
    // Unicode Specials block.
    replacementCharacter: 65533
    // `�`
  }
);

// node_modules/micromark-util-symbol/lib/constants.js
var constants = (
  /** @type {const} */
  {
    attentionSideAfter: 2,
    // Symbol to mark an attention sequence as after content: `a*`
    attentionSideBefore: 1,
    // Symbol to mark an attention sequence as before content: `*a`
    atxHeadingOpeningFenceSizeMax: 6,
    // 6 number signs is fine, 7 isn’t.
    autolinkDomainSizeMax: 63,
    // 63 characters is fine, 64 is too many.
    autolinkSchemeSizeMax: 32,
    // 32 characters is fine, 33 is too many.
    cdataOpeningString: "CDATA[",
    // And preceded by `<![`.
    characterGroupPunctuation: 2,
    // Symbol used to indicate a character is punctuation
    characterGroupWhitespace: 1,
    // Symbol used to indicate a character is whitespace
    characterReferenceDecimalSizeMax: 7,
    // `&#9999999;`.
    characterReferenceHexadecimalSizeMax: 6,
    // `&#xff9999;`.
    characterReferenceNamedSizeMax: 31,
    // `&CounterClockwiseContourIntegral;`.
    codeFencedSequenceSizeMin: 3,
    // At least 3 ticks or tildes are needed.
    contentTypeContent: "content",
    contentTypeDocument: "document",
    contentTypeFlow: "flow",
    contentTypeString: "string",
    contentTypeText: "text",
    hardBreakPrefixSizeMin: 2,
    // At least 2 trailing spaces are needed.
    htmlBasic: 6,
    // Symbol for `<div`
    htmlCdata: 5,
    // Symbol for `<![CDATA[]]>`
    htmlComment: 2,
    // Symbol for `<!---->`
    htmlComplete: 7,
    // Symbol for `<x>`
    htmlDeclaration: 4,
    // Symbol for `<!doctype>`
    htmlInstruction: 3,
    // Symbol for `<?php?>`
    htmlRawSizeMax: 8,
    // Length of `textarea`.
    htmlRaw: 1,
    // Symbol for `<script>`
    linkResourceDestinationBalanceMax: 32,
    // See: <https://spec.commonmark.org/0.30/#link-destination>, <https://github.com/remarkjs/react-markdown/issues/658#issuecomment-984345577>
    linkReferenceSizeMax: 999,
    // See: <https://spec.commonmark.org/0.30/#link-label>
    listItemValueSizeMax: 10,
    // See: <https://spec.commonmark.org/0.30/#ordered-list-marker>
    numericBaseDecimal: 10,
    numericBaseHexadecimal: 16,
    tabSize: 4,
    // Tabs have a hard-coded size of 4, per CommonMark.
    thematicBreakMarkerCountMin: 3,
    // At least 3 asterisks, dashes, or underscores are needed.
    v8MaxSafeChunkSize: 1e4
    // V8 (and potentially others) have problems injecting giant arrays into other arrays, hence we operate in chunks.
  }
);

// node_modules/micromark-util-symbol/lib/types.js
var types = (
  /** @type {const} */
  {
    // Generic type for data, such as in a title, a destination, etc.
    data: "data",
    // Generic type for syntactic whitespace (tabs, virtual spaces, spaces).
    // Such as, between a fenced code fence and an info string.
    whitespace: "whitespace",
    // Generic type for line endings (line feed, carriage return, carriage return +
    // line feed).
    lineEnding: "lineEnding",
    // A line ending, but ending a blank line.
    lineEndingBlank: "lineEndingBlank",
    // Generic type for whitespace (tabs, virtual spaces, spaces) at the start of a
    // line.
    linePrefix: "linePrefix",
    // Generic type for whitespace (tabs, virtual spaces, spaces) at the end of a
    // line.
    lineSuffix: "lineSuffix",
    // Whole ATX heading:
    //
    // ```markdown
    // #
    // ## Alpha
    // ### Bravo ###
    // ```
    //
    // Includes `atxHeadingSequence`, `whitespace`, `atxHeadingText`.
    atxHeading: "atxHeading",
    // Sequence of number signs in an ATX heading (`###`).
    atxHeadingSequence: "atxHeadingSequence",
    // Content in an ATX heading (`alpha`).
    // Includes text.
    atxHeadingText: "atxHeadingText",
    // Whole autolink (`<https://example.com>` or `<admin@example.com>`)
    // Includes `autolinkMarker` and `autolinkProtocol` or `autolinkEmail`.
    autolink: "autolink",
    // Email autolink w/o markers (`admin@example.com`)
    autolinkEmail: "autolinkEmail",
    // Marker around an `autolinkProtocol` or `autolinkEmail` (`<` or `>`).
    autolinkMarker: "autolinkMarker",
    // Protocol autolink w/o markers (`https://example.com`)
    autolinkProtocol: "autolinkProtocol",
    // A whole character escape (`\-`).
    // Includes `escapeMarker` and `characterEscapeValue`.
    characterEscape: "characterEscape",
    // The escaped character (`-`).
    characterEscapeValue: "characterEscapeValue",
    // A whole character reference (`&amp;`, `&#8800;`, or `&#x1D306;`).
    // Includes `characterReferenceMarker`, an optional
    // `characterReferenceMarkerNumeric`, in which case an optional
    // `characterReferenceMarkerHexadecimal`, and a `characterReferenceValue`.
    characterReference: "characterReference",
    // The start or end marker (`&` or `;`).
    characterReferenceMarker: "characterReferenceMarker",
    // Mark reference as numeric (`#`).
    characterReferenceMarkerNumeric: "characterReferenceMarkerNumeric",
    // Mark reference as numeric (`x` or `X`).
    characterReferenceMarkerHexadecimal: "characterReferenceMarkerHexadecimal",
    // Value of character reference w/o markers (`amp`, `8800`, or `1D306`).
    characterReferenceValue: "characterReferenceValue",
    // Whole fenced code:
    //
    // ````markdown
    // ```js
    // alert(1)
    // ```
    // ````
    codeFenced: "codeFenced",
    // A fenced code fence, including whitespace, sequence, info, and meta
    // (` ```js `).
    codeFencedFence: "codeFencedFence",
    // Sequence of grave accent or tilde characters (` ``` `) in a fence.
    codeFencedFenceSequence: "codeFencedFenceSequence",
    // Info word (`js`) in a fence.
    // Includes string.
    codeFencedFenceInfo: "codeFencedFenceInfo",
    // Meta words (`highlight="1"`) in a fence.
    // Includes string.
    codeFencedFenceMeta: "codeFencedFenceMeta",
    // A line of code.
    codeFlowValue: "codeFlowValue",
    // Whole indented code:
    //
    // ```markdown
    //     alert(1)
    // ```
    //
    // Includes `lineEnding`, `linePrefix`, and `codeFlowValue`.
    codeIndented: "codeIndented",
    // A text code (``` `alpha` ```).
    // Includes `codeTextSequence`, `codeTextData`, `lineEnding`, and can include
    // `codeTextPadding`.
    codeText: "codeText",
    codeTextData: "codeTextData",
    // A space or line ending right after or before a tick.
    codeTextPadding: "codeTextPadding",
    // A text code fence (` `` `).
    codeTextSequence: "codeTextSequence",
    // Whole content:
    //
    // ```markdown
    // [a]: b
    // c
    // =
    // d
    // ```
    //
    // Includes `paragraph` and `definition`.
    content: "content",
    // Whole definition:
    //
    // ```markdown
    // [micromark]: https://github.com/micromark/micromark
    // ```
    //
    // Includes `definitionLabel`, `definitionMarker`, `whitespace`,
    // `definitionDestination`, and optionally `lineEnding` and `definitionTitle`.
    definition: "definition",
    // Destination of a definition (`https://github.com/micromark/micromark` or
    // `<https://github.com/micromark/micromark>`).
    // Includes `definitionDestinationLiteral` or `definitionDestinationRaw`.
    definitionDestination: "definitionDestination",
    // Enclosed destination of a definition
    // (`<https://github.com/micromark/micromark>`).
    // Includes `definitionDestinationLiteralMarker` and optionally
    // `definitionDestinationString`.
    definitionDestinationLiteral: "definitionDestinationLiteral",
    // Markers of an enclosed definition destination (`<` or `>`).
    definitionDestinationLiteralMarker: "definitionDestinationLiteralMarker",
    // Unenclosed destination of a definition
    // (`https://github.com/micromark/micromark`).
    // Includes `definitionDestinationString`.
    definitionDestinationRaw: "definitionDestinationRaw",
    // Text in an destination (`https://github.com/micromark/micromark`).
    // Includes string.
    definitionDestinationString: "definitionDestinationString",
    // Label of a definition (`[micromark]`).
    // Includes `definitionLabelMarker` and `definitionLabelString`.
    definitionLabel: "definitionLabel",
    // Markers of a definition label (`[` or `]`).
    definitionLabelMarker: "definitionLabelMarker",
    // Value of a definition label (`micromark`).
    // Includes string.
    definitionLabelString: "definitionLabelString",
    // Marker between a label and a destination (`:`).
    definitionMarker: "definitionMarker",
    // Title of a definition (`"x"`, `'y'`, or `(z)`).
    // Includes `definitionTitleMarker` and optionally `definitionTitleString`.
    definitionTitle: "definitionTitle",
    // Marker around a title of a definition (`"`, `'`, `(`, or `)`).
    definitionTitleMarker: "definitionTitleMarker",
    // Data without markers in a title (`z`).
    // Includes string.
    definitionTitleString: "definitionTitleString",
    // Emphasis (`*alpha*`).
    // Includes `emphasisSequence` and `emphasisText`.
    emphasis: "emphasis",
    // Sequence of emphasis markers (`*` or `_`).
    emphasisSequence: "emphasisSequence",
    // Emphasis text (`alpha`).
    // Includes text.
    emphasisText: "emphasisText",
    // The character escape marker (`\`).
    escapeMarker: "escapeMarker",
    // A hard break created with a backslash (`\\n`).
    // Note: does not include the line ending.
    hardBreakEscape: "hardBreakEscape",
    // A hard break created with trailing spaces (`  \n`).
    // Does not include the line ending.
    hardBreakTrailing: "hardBreakTrailing",
    // Flow HTML:
    //
    // ```markdown
    // <div
    // ```
    //
    // Inlcudes `lineEnding`, `htmlFlowData`.
    htmlFlow: "htmlFlow",
    htmlFlowData: "htmlFlowData",
    // HTML in text (the tag in `a <i> b`).
    // Includes `lineEnding`, `htmlTextData`.
    htmlText: "htmlText",
    htmlTextData: "htmlTextData",
    // Whole image (`![alpha](bravo)`, `![alpha][bravo]`, `![alpha][]`, or
    // `![alpha]`).
    // Includes `label` and an optional `resource` or `reference`.
    image: "image",
    // Whole link label (`[*alpha*]`).
    // Includes `labelLink` or `labelImage`, `labelText`, and `labelEnd`.
    label: "label",
    // Text in an label (`*alpha*`).
    // Includes text.
    labelText: "labelText",
    // Start a link label (`[`).
    // Includes a `labelMarker`.
    labelLink: "labelLink",
    // Start an image label (`![`).
    // Includes `labelImageMarker` and `labelMarker`.
    labelImage: "labelImage",
    // Marker of a label (`[` or `]`).
    labelMarker: "labelMarker",
    // Marker to start an image (`!`).
    labelImageMarker: "labelImageMarker",
    // End a label (`]`).
    // Includes `labelMarker`.
    labelEnd: "labelEnd",
    // Whole link (`[alpha](bravo)`, `[alpha][bravo]`, `[alpha][]`, or `[alpha]`).
    // Includes `label` and an optional `resource` or `reference`.
    link: "link",
    // Whole paragraph:
    //
    // ```markdown
    // alpha
    // bravo.
    // ```
    //
    // Includes text.
    paragraph: "paragraph",
    // A reference (`[alpha]` or `[]`).
    // Includes `referenceMarker` and an optional `referenceString`.
    reference: "reference",
    // A reference marker (`[` or `]`).
    referenceMarker: "referenceMarker",
    // Reference text (`alpha`).
    // Includes string.
    referenceString: "referenceString",
    // A resource (`(https://example.com "alpha")`).
    // Includes `resourceMarker`, an optional `resourceDestination` with an optional
    // `whitespace` and `resourceTitle`.
    resource: "resource",
    // A resource destination (`https://example.com`).
    // Includes `resourceDestinationLiteral` or `resourceDestinationRaw`.
    resourceDestination: "resourceDestination",
    // A literal resource destination (`<https://example.com>`).
    // Includes `resourceDestinationLiteralMarker` and optionally
    // `resourceDestinationString`.
    resourceDestinationLiteral: "resourceDestinationLiteral",
    // A resource destination marker (`<` or `>`).
    resourceDestinationLiteralMarker: "resourceDestinationLiteralMarker",
    // A raw resource destination (`https://example.com`).
    // Includes `resourceDestinationString`.
    resourceDestinationRaw: "resourceDestinationRaw",
    // Resource destination text (`https://example.com`).
    // Includes string.
    resourceDestinationString: "resourceDestinationString",
    // A resource marker (`(` or `)`).
    resourceMarker: "resourceMarker",
    // A resource title (`"alpha"`, `'alpha'`, or `(alpha)`).
    // Includes `resourceTitleMarker` and optionally `resourceTitleString`.
    resourceTitle: "resourceTitle",
    // A resource title marker (`"`, `'`, `(`, or `)`).
    resourceTitleMarker: "resourceTitleMarker",
    // Resource destination title (`alpha`).
    // Includes string.
    resourceTitleString: "resourceTitleString",
    // Whole setext heading:
    //
    // ```markdown
    // alpha
    // bravo
    // =====
    // ```
    //
    // Includes `setextHeadingText`, `lineEnding`, `linePrefix`, and
    // `setextHeadingLine`.
    setextHeading: "setextHeading",
    // Content in a setext heading (`alpha\nbravo`).
    // Includes text.
    setextHeadingText: "setextHeadingText",
    // Underline in a setext heading, including whitespace suffix (`==`).
    // Includes `setextHeadingLineSequence`.
    setextHeadingLine: "setextHeadingLine",
    // Sequence of equals or dash characters in underline in a setext heading (`-`).
    setextHeadingLineSequence: "setextHeadingLineSequence",
    // Strong (`**alpha**`).
    // Includes `strongSequence` and `strongText`.
    strong: "strong",
    // Sequence of strong markers (`**` or `__`).
    strongSequence: "strongSequence",
    // Strong text (`alpha`).
    // Includes text.
    strongText: "strongText",
    // Whole thematic break:
    //
    // ```markdown
    // * * *
    // ```
    //
    // Includes `thematicBreakSequence` and `whitespace`.
    thematicBreak: "thematicBreak",
    // A sequence of one or more thematic break markers (`***`).
    thematicBreakSequence: "thematicBreakSequence",
    // Whole block quote:
    //
    // ```markdown
    // > a
    // >
    // > b
    // ```
    //
    // Includes `blockQuotePrefix` and flow.
    blockQuote: "blockQuote",
    // The `>` or `> ` of a block quote.
    blockQuotePrefix: "blockQuotePrefix",
    // The `>` of a block quote prefix.
    blockQuoteMarker: "blockQuoteMarker",
    // The optional ` ` of a block quote prefix.
    blockQuotePrefixWhitespace: "blockQuotePrefixWhitespace",
    // Whole ordered list:
    //
    // ```markdown
    // 1. a
    //    b
    // ```
    //
    // Includes `listItemPrefix`, flow, and optionally  `listItemIndent` on further
    // lines.
    listOrdered: "listOrdered",
    // Whole unordered list:
    //
    // ```markdown
    // - a
    //   b
    // ```
    //
    // Includes `listItemPrefix`, flow, and optionally  `listItemIndent` on further
    // lines.
    listUnordered: "listUnordered",
    // The indent of further list item lines.
    listItemIndent: "listItemIndent",
    // A marker, as in, `*`, `+`, `-`, `.`, or `)`.
    listItemMarker: "listItemMarker",
    // The thing that starts a list item, such as `1. `.
    // Includes `listItemValue` if ordered, `listItemMarker`, and
    // `listItemPrefixWhitespace` (unless followed by a line ending).
    listItemPrefix: "listItemPrefix",
    // The whitespace after a marker.
    listItemPrefixWhitespace: "listItemPrefixWhitespace",
    // The numerical value of an ordered item.
    listItemValue: "listItemValue",
    // Internal types used for subtokenizers, compiled away
    chunkDocument: "chunkDocument",
    chunkContent: "chunkContent",
    chunkFlow: "chunkFlow",
    chunkText: "chunkText",
    chunkString: "chunkString"
  }
);

// src/language-markdown/parse/micromark/micromark-extension-html-text.js
var htmlText2 = {
  name: "htmlText",
  tokenize: tokenizeHtmlText2,
  add: "before"
};
function tokenizeHtmlText2(effects, ok3, nok) {
  const self = this;
  let marker;
  let index2;
  let returnState;
  return start;
  function start(code2) {
    assert(code2 === codes2.lessThan, "expected `<`");
    effects.enter(types.htmlText);
    effects.enter(types.htmlTextData);
    effects.consume(code2);
    return open;
  }
  function open(code2) {
    if (code2 === codes2.exclamationMark) {
      effects.consume(code2);
      return declarationOpen;
    }
    if (code2 === codes2.slash) {
      effects.consume(code2);
      return tagCloseStart;
    }
    if (code2 === codes2.questionMark) {
      effects.consume(code2);
      return instruction;
    }
    if (asciiAlpha(code2)) {
      effects.consume(code2);
      return tagOpen;
    }
    return nok(code2);
  }
  function declarationOpen(code2) {
    if (code2 === codes2.dash) {
      effects.consume(code2);
      return commentOpenInside;
    }
    if (code2 === codes2.leftSquareBracket) {
      effects.consume(code2);
      index2 = 0;
      return cdataOpenInside;
    }
    if (asciiAlpha(code2)) {
      effects.consume(code2);
      return declaration;
    }
    return nok(code2);
  }
  function commentOpenInside(code2) {
    if (code2 === codes2.dash) {
      effects.consume(code2);
      return commentEnd;
    }
    return nok(code2);
  }
  function comment(code2) {
    if (code2 === codes2.eof) {
      return nok(code2);
    }
    if (code2 === codes2.dash) {
      effects.consume(code2);
      return commentClose;
    }
    if (markdownLineEnding2(code2)) {
      returnState = comment;
      return lineEndingBefore(code2);
    }
    effects.consume(code2);
    return comment;
  }
  function commentClose(code2) {
    if (code2 === codes2.dash) {
      effects.consume(code2);
      return commentEnd;
    }
    return comment(code2);
  }
  function commentEnd(code2) {
    return code2 === codes2.greaterThan ? end(code2) : code2 === codes2.dash ? commentClose(code2) : comment(code2);
  }
  function cdataOpenInside(code2) {
    const value = constants.cdataOpeningString;
    if (code2 === value.charCodeAt(index2++)) {
      effects.consume(code2);
      return index2 === value.length ? cdata : cdataOpenInside;
    }
    return nok(code2);
  }
  function cdata(code2) {
    if (code2 === codes2.eof) {
      return nok(code2);
    }
    if (code2 === codes2.rightSquareBracket) {
      effects.consume(code2);
      return cdataClose;
    }
    if (markdownLineEnding2(code2)) {
      returnState = cdata;
      return lineEndingBefore(code2);
    }
    effects.consume(code2);
    return cdata;
  }
  function cdataClose(code2) {
    if (code2 === codes2.rightSquareBracket) {
      effects.consume(code2);
      return cdataEnd;
    }
    return cdata(code2);
  }
  function cdataEnd(code2) {
    if (code2 === codes2.greaterThan) {
      return end(code2);
    }
    if (code2 === codes2.rightSquareBracket) {
      effects.consume(code2);
      return cdataEnd;
    }
    return cdata(code2);
  }
  function declaration(code2) {
    if (code2 === codes2.eof || code2 === codes2.greaterThan) {
      return end(code2);
    }
    if (markdownLineEnding2(code2)) {
      returnState = declaration;
      return lineEndingBefore(code2);
    }
    effects.consume(code2);
    return declaration;
  }
  function instruction(code2) {
    if (code2 === codes2.eof) {
      return nok(code2);
    }
    if (code2 === codes2.questionMark) {
      effects.consume(code2);
      return instructionClose;
    }
    if (markdownLineEnding2(code2)) {
      returnState = instruction;
      return lineEndingBefore(code2);
    }
    effects.consume(code2);
    return instruction;
  }
  function instructionClose(code2) {
    return code2 === codes2.greaterThan ? end(code2) : instruction(code2);
  }
  function tagCloseStart(code2) {
    if (asciiAlpha(code2)) {
      effects.consume(code2);
      return tagClose;
    }
    return nok(code2);
  }
  function tagClose(code2) {
    if (code2 === codes2.dash || asciiAlphanumeric(code2)) {
      effects.consume(code2);
      return tagClose;
    }
    return tagCloseBetween(code2);
  }
  function tagCloseBetween(code2) {
    if (markdownLineEnding2(code2)) {
      returnState = tagCloseBetween;
      return lineEndingBefore(code2);
    }
    if (markdownSpace(code2)) {
      effects.consume(code2);
      return tagCloseBetween;
    }
    return end(code2);
  }
  function tagOpen(code2) {
    if (code2 === codes2.dash || asciiAlphanumeric(code2)) {
      effects.consume(code2);
      return tagOpen;
    }
    if (code2 === codes2.slash || code2 === codes2.greaterThan || markdownLineEndingOrSpace2(code2)) {
      return tagOpenBetween(code2);
    }
    return nok(code2);
  }
  function tagOpenBetween(code2) {
    if (code2 === codes2.slash) {
      effects.consume(code2);
      return end;
    }
    if (code2 === codes2.colon || code2 === codes2.underscore || asciiAlpha(code2)) {
      effects.consume(code2);
      return tagOpenAttributeName;
    }
    if (markdownLineEnding2(code2)) {
      returnState = tagOpenBetween;
      return lineEndingBefore(code2);
    }
    if (markdownSpace(code2)) {
      effects.consume(code2);
      return tagOpenBetween;
    }
    return end(code2);
  }
  function tagOpenAttributeName(code2) {
    if (code2 === codes2.dash || code2 === codes2.dot || code2 === codes2.colon || code2 === codes2.underscore || asciiAlphanumeric(code2)) {
      effects.consume(code2);
      return tagOpenAttributeName;
    }
    return tagOpenAttributeNameAfter(code2);
  }
  function tagOpenAttributeNameAfter(code2) {
    if (code2 === codes2.equalsTo) {
      effects.consume(code2);
      return tagOpenAttributeValueBefore;
    }
    if (markdownLineEnding2(code2)) {
      returnState = tagOpenAttributeNameAfter;
      return lineEndingBefore(code2);
    }
    if (markdownSpace(code2)) {
      effects.consume(code2);
      return tagOpenAttributeNameAfter;
    }
    return tagOpenBetween(code2);
  }
  function tagOpenAttributeValueBefore(code2) {
    if (code2 === codes2.eof || code2 === codes2.lessThan || code2 === codes2.equalsTo || code2 === codes2.greaterThan || code2 === codes2.graveAccent) {
      return nok(code2);
    }
    if (code2 === codes2.quotationMark || code2 === codes2.apostrophe) {
      effects.consume(code2);
      marker = code2;
      return tagOpenAttributeValueQuoted;
    }
    if (markdownLineEnding2(code2)) {
      returnState = tagOpenAttributeValueBefore;
      return lineEndingBefore(code2);
    }
    if (markdownSpace(code2)) {
      effects.consume(code2);
      return tagOpenAttributeValueBefore;
    }
    effects.consume(code2);
    return tagOpenAttributeValueUnquoted;
  }
  function tagOpenAttributeValueQuoted(code2) {
    if (code2 === marker) {
      effects.consume(code2);
      marker = void 0;
      return tagOpenAttributeValueQuotedAfter;
    }
    if (code2 === codes2.eof) {
      return nok(code2);
    }
    if (markdownLineEnding2(code2)) {
      returnState = tagOpenAttributeValueQuoted;
      return lineEndingBefore(code2);
    }
    effects.consume(code2);
    return tagOpenAttributeValueQuoted;
  }
  function tagOpenAttributeValueUnquoted(code2) {
    if (code2 === codes2.eof || code2 === codes2.quotationMark || code2 === codes2.apostrophe || code2 === codes2.lessThan || code2 === codes2.equalsTo || code2 === codes2.graveAccent) {
      return nok(code2);
    }
    if (code2 === codes2.slash || code2 === codes2.greaterThan || markdownLineEndingOrSpace2(code2)) {
      return tagOpenBetween(code2);
    }
    effects.consume(code2);
    return tagOpenAttributeValueUnquoted;
  }
  function tagOpenAttributeValueQuotedAfter(code2) {
    if (code2 === codes2.slash || code2 === codes2.greaterThan || markdownLineEndingOrSpace2(code2)) {
      return tagOpenBetween(code2);
    }
    return nok(code2);
  }
  function end(code2) {
    if (code2 === codes2.greaterThan) {
      effects.consume(code2);
      effects.exit(types.htmlTextData);
      effects.exit(types.htmlText);
      return ok3;
    }
    return nok(code2);
  }
  function lineEndingBefore(code2) {
    assert(returnState, "expected return state");
    assert(markdownLineEnding2(code2), "expected eol");
    effects.exit(types.htmlTextData);
    effects.enter(types.lineEnding);
    effects.consume(code2);
    effects.exit(types.lineEnding);
    return lineEndingAfter;
  }
  function lineEndingAfter(code2) {
    assert(
      self.parser.constructs.disable.null,
      "expected `disable.null` to be populated"
    );
    return lineEndingAfterPrefix(code2);
  }
  function lineEndingAfterPrefix(code2) {
    effects.enter(types.htmlTextData);
    return returnState(code2);
  }
}
function overrideHtmlTextSyntax() {
  return {
    text: {
      [codes2.lessThan]: htmlText2
    }
  };
}
function assert(..._args) {
}

// src/language-markdown/parse/micromark/micromark-extension-liquid.js
var nodeType = "liquidNode";
function liquidFromMarkdown() {
  return {
    canContainEols: [nodeType],
    enter: {
      [nodeType]: enter
    },
    exit: {
      [nodeType]: exit3
    }
  };
  function enter(token) {
    this.enter(
      // @ts-expect-error
      {
        type: nodeType
      },
      token
    );
    this.buffer();
  }
  function exit3(token) {
    this.resume();
    const node2 = method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      this.stack,
      -1
    );
    node2.value = this.sliceSerialize(token);
    this.exit(token);
  }
}
function liquidSyntax() {
  return {
    flow: {
      [codes2.leftCurlyBrace]: {
        name: "liquidFlow",
        tokenize: tokenizeFlow
      }
    },
    text: {
      [codes2.leftCurlyBrace]: {
        name: "liquidText",
        tokenize: tokenizeText
      }
    }
  };
  function tokenizeFlow(effects, ok3, nok) {
    return tokenize.call(this, effects, ok3, nok, "flow");
  }
  function tokenizeText(effects, ok3, nok) {
    return tokenize.call(this, effects, ok3, nok, "text");
  }
  function tokenize(effects, ok3, nok, mode) {
    const isFlow = mode === "flow";
    const {
      now,
      parser
    } = this;
    let closingCode;
    return start;
    function start(code2) {
      effects.enter("liquidNode");
      effects.enter(types.data);
      effects.consume(code2);
      return function(code3) {
        switch (code3) {
          case codes2.percentSign:
          case codes2.leftCurlyBrace:
            closingCode = code3 === codes2.percentSign ? codes2.percentSign : codes2.rightCurlyBrace;
            effects.consume(code3);
            return inside;
          default:
            return nok(code3);
        }
      };
    }
    function inside(code2) {
      switch (code2) {
        case closingCode:
          effects.consume(code2);
          return mayClose;
        case codes2.eof:
          return nok(code2);
        default:
          if (markdownLineEnding2(code2)) {
            effects.exit(types.data);
            effects.enter(types.lineEnding);
            effects.consume(code2);
            effects.exit(types.lineEnding);
            if (isFlow) {
              return afterLineEnding;
            }
            effects.enter(types.data);
            return inside;
          }
          effects.consume(code2);
          return inside;
      }
    }
    function afterLineEnding(code2) {
      if (parser.lazy[now().line]) {
        return nok(code2);
      }
      if (markdownLineEnding2(code2)) {
        effects.enter(types.lineEnding);
        effects.consume(code2);
        effects.exit(types.lineEnding);
        return afterLineEnding;
      }
      effects.enter(types.data);
      return inside(code2);
    }
    function mayClose(code2) {
      if (code2 === codes2.rightCurlyBrace) {
        effects.consume(code2);
        effects.exit(types.data);
        effects.exit(nodeType);
        return isFlow ? afterClose : ok3;
      }
      return inside;
    }
    function afterClose(code2) {
      if (markdownSpace(code2)) {
        effects.enter(types.whitespace);
        effects.consume(code2);
        return afterWhitespace;
      }
      return after(code2);
    }
    function afterWhitespace(code2) {
      if (markdownSpace(code2)) {
        effects.consume(code2);
        return afterWhitespace;
      }
      effects.exit(types.whitespace);
      return after(code2);
    }
    function after(code2) {
      return code2 === codes2.eof || markdownLineEnding2(code2) ? ok3(code2) : nok(code2);
    }
  }
}

// src/language-markdown/parse/parse-markdown.js
var markdownParseOptions;
function getMarkdownParseOptions() {
  return markdownParseOptions ?? (markdownParseOptions = {
    extensions: [
      gfm({ singleTilde: false }),
      math({ singleDollarTextMath: false }),
      syntax({
        // We don't need support alias, use a fake string to bypass
        // https://github.com/stereobooster/braindb/blob/66d6cf74d0bad43f20924a14e382a432ff81cdfa/packages/micromark-extension-wiki-link/src/syntax.ts#L81
        // @ts-expect-error -- expected
        aliasDivider: { charCodeAt: () => Number.NaN }
      }),
      liquidSyntax(),
      overrideHtmlTextSyntax()
    ],
    mdastExtensions: [
      gfmFromMarkdown2(),
      mathFromMarkdown(),
      fromMarkdown(),
      liquidFromMarkdown()
    ]
  });
}
function parseMarkdown(text4) {
  const { frontMatter: frontMatter2, content: content3 } = parse_default(text4);
  const ast = fromMarkdown2(content3, getMarkdownParseOptions());
  if (frontMatter2) {
    const [start, end] = [frontMatter2.start, frontMatter2.end].map(
      ({ line: line2, column, index: index2 }) => ({
        line: line2,
        column: column + 1,
        offset: index2
      })
    );
    ast.children.unshift({
      ...frontMatter2,
      // @ts-expect-error -- Expected
      type: "frontMatter",
      position: { start, end }
    });
  }
  return ast;
}

// src/language-markdown/parse/parse-mdx.js
var import_remark_footnotes = __toESM(require_remark_footnotes(), 1);
var import_remark_math = __toESM(require_remark_math(), 1);
var import_remark_parse = __toESM(require_remark_parse(), 1);
var import_unified = __toESM(require_unified(), 1);

// src/language-markdown/parse/mdx.js
var IMPORT_REGEX = /^import\s/;
var EXPORT_REGEX = /^export\s/;
var BLOCKS_REGEX = "[a-z][a-z0-9]*(\\.[a-z][a-z0-9]*)*|";
var COMMENT_REGEX = /<!---->|<!---?[^>-](?:-?[^-])*-->/;
var ES_COMMENT_REGEX = /^\{\s*\/\*(.*)\*\/\s*\}/;
var EMPTY_NEWLINE = "\n\n";
var isImport = (text4) => IMPORT_REGEX.test(text4);
var isExport = (text4) => EXPORT_REGEX.test(text4);
var isImportOrExport = (text4) => isImport(text4) || isExport(text4);
var tokenizeEsSyntax = (eat, value) => {
  const index2 = value.indexOf(EMPTY_NEWLINE);
  const subvalue = index2 === -1 ? value : value.slice(0, index2);
  if (isImportOrExport(subvalue)) {
    return eat(subvalue)({
      type: isExport(subvalue) ? "export" : "import",
      value: subvalue
    });
  }
};
tokenizeEsSyntax.notInBlock = true;
tokenizeEsSyntax.locator = (value) => isImportOrExport(value) ? -1 : 1;
var tokenizeEsComment = (eat, value) => {
  const match = ES_COMMENT_REGEX.exec(value);
  if (match) {
    return eat(match[0])({
      type: "esComment",
      value: match[1].trim()
    });
  }
};
tokenizeEsComment.locator = (value, fromIndex) => value.indexOf("{", fromIndex);
var esSyntax = function() {
  const {
    Parser
  } = this;
  const {
    blockTokenizers,
    blockMethods,
    inlineTokenizers,
    inlineMethods
  } = Parser.prototype;
  blockTokenizers.esSyntax = tokenizeEsSyntax;
  inlineTokenizers.esComment = tokenizeEsComment;
  blockMethods.splice(blockMethods.indexOf("paragraph"), 0, "esSyntax");
  inlineMethods.splice(inlineMethods.indexOf("text"), 0, "esComment");
};

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
var disjunctionListFormat = (list2) => new Intl.ListFormat("en-US", { type: "disjunction" }).format(list2);
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
function indent2(contents) {
  assertDoc(contents);
  return { type: DOC_TYPE_INDENT, contents };
}

// src/document/builders/align.js
function align(alignType, contents) {
  assertAlignType(alignType);
  assertDoc(contents);
  return { type: DOC_TYPE_ALIGN, contents, n: alignType };
}
function markAsRoot(contents) {
  return align({ type: "root" }, contents);
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
  for (let index2 = 0; index2 < ranges.length; index2 += 2) {
    const start = ranges[index2];
    const end = ranges[index2 + 1];
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
function getStringWidth(text4) {
  if (!text4) {
    return 0;
  }
  if (!notAsciiRegex.test(text4)) {
    return text4.length;
  }
  let width = 0;
  text4 = text4.replace(emoji_regex_default(), (character) => {
    width += isNarrowEmojiCharacter(character) ? 1 : 2;
    return "";
  });
  for (const character of text4) {
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
function generateIndent(indent3, command, options2) {
  const queue = command.type === INDENT_COMMAND_TYPE_DEDENT ? indent3.queue.slice(0, -1) : [...indent3.queue, command];
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
        const { string: string3 } = command2;
        flush();
        value += string3;
        length += string3.length;
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
  return { ...indent3, value, length, queue };
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
function makeAlign(indent3, indentOptions, options2) {
  if (!indentOptions) {
    return indent3;
  }
  if (indentOptions.type === "root") {
    return { ...indent3, root: indent3 };
  }
  if (indentOptions === Number.NEGATIVE_INFINITY) {
    return indent3.root;
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
  return generateIndent(indent3, command, options2);
}
function makeIndent(indent3, options2) {
  return generateIndent(indent3, INDENT_COMMAND_INDENT, options2);
}

// src/document/printer/trim-indentation.js
function getTrailingIndentionLength(text4) {
  let length = 0;
  for (let index2 = text4.length - 1; index2 >= 0; index2--) {
    const character = text4[index2];
    if (character === " " || character === "	") {
      length++;
    } else {
      break;
    }
  }
  return length;
}
function trimIndentation(text4) {
  const length = getTrailingIndentionLength(text4);
  const trimmed = length === 0 ? text4 : text4.slice(0, text4.length - length);
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
    const text4 = this.#unsettledText;
    if (text4 !== "") {
      this.#settledTexts.push(text4);
      this.#settledTextLength += text4.length;
      this.#unsettledText = "";
    }
    for (const position2 of this.#unsettledPositions) {
      this.#settledPositions.push(Math.min(position2, this.#settledTextLength));
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
  write(text4) {
    this.#unsettledText += text4;
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
        for (let index2 = parts.length - 1; index2 >= end; index2--) {
          commands.push({
            mode,
            doc: parts[index2]
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
          text: text4,
          count
        } = trimIndentation(output);
        output = text4;
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
  let position2 = 0;
  const commands = [{
    indent: ROOT_INDENT,
    mode: MODE_BREAK,
    doc
  }];
  let shouldRemeasure = false;
  const lineSuffix = [];
  const result = new print_result_default();
  propagateBreaks(doc);
  while (commands.length > 0) {
    const {
      indent: indent3,
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
            position2 += get_string_width_default(formatted2);
          }
        }
        break;
      }
      case DOC_TYPE_ARRAY:
        for (let index2 = doc2.length - 1; index2 >= 0; index2--) {
          commands.push({
            indent: indent3,
            mode,
            doc: doc2[index2]
          });
        }
        break;
      case DOC_TYPE_CURSOR:
        result.markPosition();
        break;
      case DOC_TYPE_INDENT:
        commands.push({
          indent: makeIndent(indent3, options2),
          mode,
          doc: doc2.contents
        });
        break;
      case DOC_TYPE_ALIGN:
        commands.push({
          indent: makeAlign(indent3, doc2.n, options2),
          mode,
          doc: doc2.contents
        });
        break;
      case DOC_TYPE_TRIM:
        position2 -= result.trim();
        break;
      case DOC_TYPE_GROUP: {
        const command = (function printGroup() {
          if (mode === MODE_FLAT && !shouldRemeasure) {
            return {
              indent: indent3,
              mode: doc2.break ? MODE_BREAK : MODE_FLAT,
              doc: doc2.contents
            };
          }
          shouldRemeasure = false;
          const remainingWidth = width - position2;
          const hasLineSuffix = lineSuffix.length > 0;
          const flatCommand = {
            indent: indent3,
            mode: MODE_FLAT,
            doc: doc2.contents
          };
          if (!doc2.break && fits(flatCommand, commands, remainingWidth, hasLineSuffix, groupModeMap)) {
            return flatCommand;
          }
          if (!doc2.expandedStates) {
            return {
              indent: indent3,
              mode: MODE_BREAK,
              doc: doc2.contents
            };
          }
          if (!doc2.break) {
            for (let index2 = 1; index2 < doc2.expandedStates.length - 1; index2++) {
              const flatCommand2 = {
                indent: indent3,
                mode: MODE_FLAT,
                doc: doc2.expandedStates[index2]
              };
              if (fits(flatCommand2, commands, remainingWidth, hasLineSuffix, groupModeMap)) {
                return flatCommand2;
              }
            }
          }
          return {
            indent: indent3,
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
        const remainingWidth = width - position2;
        const offset = doc2[DOC_FILL_PRINTED_LENGTH] ?? 0;
        const {
          parts
        } = doc2;
        const length = parts.length - offset;
        if (length === 0) {
          break;
        }
        const content3 = parts[offset + 0];
        const whitespace = parts[offset + 1];
        const contentFlatCommand = {
          indent: indent3,
          mode: MODE_FLAT,
          doc: content3
        };
        const contentBreakCommand = {
          indent: indent3,
          mode: MODE_BREAK,
          doc: content3
        };
        const contentFits = fits(contentFlatCommand, [], remainingWidth, lineSuffix.length > 0, groupModeMap, true);
        if (length === 1) {
          if (contentFits) {
            commands.push(contentFlatCommand);
          } else {
            commands.push(contentBreakCommand);
          }
          break;
        }
        const whitespaceFlatCommand = {
          indent: indent3,
          mode: MODE_FLAT,
          doc: whitespace
        };
        const whitespaceBreakCommand = {
          indent: indent3,
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
          indent: indent3,
          mode,
          doc: {
            ...doc2,
            [DOC_FILL_PRINTED_LENGTH]: offset + 2
          }
        };
        const firstAndSecondContentFlatCommand = {
          indent: indent3,
          mode: MODE_FLAT,
          doc: [content3, whitespace, secondContent]
        };
        const firstAndSecondContentFits = fits(firstAndSecondContentFlatCommand, [], remainingWidth, lineSuffix.length > 0, groupModeMap, true);
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
          const breakContents = doc2.type === DOC_TYPE_IF_BREAK ? doc2.breakContents : doc2.negate ? doc2.contents : indent2(doc2.contents);
          if (breakContents) {
            commands.push({
              indent: indent3,
              mode,
              doc: breakContents
            });
          }
        }
        if (groupMode === MODE_FLAT) {
          const flatContents = doc2.type === DOC_TYPE_IF_BREAK ? doc2.flatContents : doc2.negate ? indent2(doc2.contents) : doc2.contents;
          if (flatContents) {
            commands.push({
              indent: indent3,
              mode,
              doc: flatContents
            });
          }
        }
        break;
      }
      case DOC_TYPE_LINE_SUFFIX:
        lineSuffix.push({
          indent: indent3,
          mode,
          doc: doc2.contents
        });
        break;
      case DOC_TYPE_LINE_SUFFIX_BOUNDARY:
        if (lineSuffix.length > 0) {
          commands.push({
            indent: indent3,
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
                position2 += 1;
              }
              break;
            }
            shouldRemeasure = true;
          // fallthrough
          case MODE_BREAK:
            if (lineSuffix.length > 0) {
              commands.push({
                indent: indent3,
                mode,
                doc: doc2
              }, ...lineSuffix.reverse());
              lineSuffix.length = 0;
              break;
            }
            if (doc2.literal) {
              result.write(newLine);
              position2 = 0;
              if (indent3.root) {
                if (indent3.root.value) {
                  result.write(indent3.root.value);
                }
                position2 = indent3.root.length;
              }
            } else {
              result.trim();
              result.write(newLine + indent3.value);
              position2 = indent3.length;
            }
            break;
        }
        break;
      case DOC_TYPE_LABEL:
        commands.push({
          indent: indent3,
          mode,
          doc: doc2.contents
        });
        break;
      case DOC_TYPE_BREAK_PARENT:
        break;
      default:
        throw new invalid_doc_error_default(doc2);
    }
    if (commands.length === 0 && lineSuffix.length > 0) {
      commands.push(...lineSuffix.reverse());
      lineSuffix.length = 0;
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
  let path2 = decodeURIComponent(url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
  if (url.hostname !== "") {
    path2 = `\\\\${url.hostname}${path2}`;
  }
  return path2;
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
  }) => extensions?.some((extension2) => basename.endsWith(extension2)));
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

// src/main/front-matter/is-front-matter.js
function isFrontMatter(node2) {
  return Boolean(node2?.[FRONT_MATTER_MARK]);
}
var is_front_matter_default = isFrontMatter;

// src/language-markdown/parse/unified-plugins/front-matter.js
var frontMatter = function() {
  const proto = this.Parser.prototype;
  proto.blockMethods = ["frontMatter", ...proto.blockMethods];
  proto.blockTokenizers.frontMatter = tokenizer;
  function tokenizer(eat, value) {
    const { frontMatter: frontMatter2 } = parse_default(value);
    if (frontMatter2) {
      return eat(frontMatter2.raw)({ ...frontMatter2, type: "frontMatter" });
    }
  }
  tokenizer.onlyAtStart = true;
};
var front_matter_default = frontMatter;

// src/language-markdown/constants.evaluate.js
var CJK_REGEXP = /(?:[\u{2c7}\u{2c9}-\u{2cb}\u{2d9}\u{2ea}-\u{2eb}\u{305}\u{323}\u{1100}-\u{11ff}\u{2e80}-\u{2e99}\u{2e9b}-\u{2ef3}\u{2f00}-\u{2fd5}\u{2ff0}-\u{303f}\u{3041}-\u{3096}\u{3099}-\u{30ff}\u{3105}-\u{312f}\u{3131}-\u{318e}\u{3190}-\u{4dbf}\u{4e00}-\u{9fff}\u{a700}-\u{a707}\u{a960}-\u{a97c}\u{ac00}-\u{d7a3}\u{d7b0}-\u{d7c6}\u{d7cb}-\u{d7fb}\u{f900}-\u{fa6d}\u{fa70}-\u{fad9}\u{fe10}-\u{fe1f}\u{fe30}-\u{fe6f}\u{ff00}-\u{ffef}\u{16fe3}\u{16ff2}-\u{16ff6}\u{1aff0}-\u{1aff3}\u{1aff5}-\u{1affb}\u{1affd}-\u{1affe}\u{1b000}-\u{1b128}\u{1b132}\u{1b150}-\u{1b152}\u{1b155}\u{1b164}-\u{1b168}\u{1f200}\u{1f250}-\u{1f251}\u{20000}-\u{2a6df}\u{2a700}-\u{2b81e}\u{2b820}-\u{2cead}\u{2ceb0}-\u{2ebe0}\u{2ebf0}-\u{2ee5d}\u{2f800}-\u{2fa1d}\u{30000}-\u{3134a}\u{31350}-\u{33479}])(?:[\u{fe00}-\u{fe0f}\u{e0100}-\u{e01ef}])?/u;
var PUNCTUATION_REGEXP = /(?:[\u{21}-\u{2f}\u{3a}-\u{40}\u{5b}-\u{60}\u{7b}-\u{7e}\u{3000}\u{ff5e}]|\p{General_Category=Connector_Punctuation}|\p{General_Category=Dash_Punctuation}|\p{General_Category=Close_Punctuation}|\p{General_Category=Final_Punctuation}|\p{General_Category=Initial_Punctuation}|\p{General_Category=Other_Punctuation}|\p{General_Category=Open_Punctuation})/u;

// src/language-markdown/utilities.js
var INLINE_NODE_TYPES = /* @__PURE__ */ new Set(["liquidNode", "inlineCode", "emphasis", "esComment", "strong", "delete", "wikiLink", "link", "linkReference", "image", "imageReference", "footnote", "footnoteReference", "sentence", "whitespace", "word", "break", "inlineMath"]);
var INLINE_NODE_WRAPPER_TYPES = /* @__PURE__ */ new Set([...INLINE_NODE_TYPES, "tableCell", "paragraph", "heading"]);
var KIND_NON_CJK = "non-cjk";
var KIND_CJ_LETTER = "cj-letter";
var KIND_K_LETTER = "k-letter";
var KIND_CJK_PUNCTUATION = "cjk-punctuation";
var K_REGEXP = /\p{Script_Extensions=Hangul}/u;
function splitText(text4) {
  const nodes = [];
  const tokens = text4.split(/([\t\n ]+)/);
  for (const [index2, token] of tokens.entries()) {
    if (index2 % 2 === 1) {
      nodes.push({
        type: "whitespace",
        value: /\n/.test(token) ? "\n" : " "
      });
      continue;
    }
    if ((index2 === 0 || index2 === tokens.length - 1) && token === "") {
      continue;
    }
    const innerTokens = token.split(new RegExp(`(${CJK_REGEXP.source})`, "u"));
    for (const [innerIndex, innerToken] of innerTokens.entries()) {
      if ((innerIndex === 0 || innerIndex === innerTokens.length - 1) && innerToken === "") {
        continue;
      }
      if (innerIndex % 2 === 0) {
        if (innerToken !== "") {
          appendNode({
            type: "word",
            value: innerToken,
            kind: KIND_NON_CJK,
            isCJ: false,
            hasLeadingPunctuation: PUNCTUATION_REGEXP.test(innerToken[0]),
            hasTrailingPunctuation: PUNCTUATION_REGEXP.test(method_at_default(
              /* OPTIONAL_OBJECT: false */
              0,
              innerToken,
              -1
            ))
          });
        }
        continue;
      }
      if (PUNCTUATION_REGEXP.test(innerToken)) {
        appendNode({
          type: "word",
          value: innerToken,
          kind: KIND_CJK_PUNCTUATION,
          isCJ: true,
          hasLeadingPunctuation: true,
          hasTrailingPunctuation: true
        });
        continue;
      }
      if (K_REGEXP.test(innerToken)) {
        appendNode({
          type: "word",
          value: innerToken,
          kind: KIND_K_LETTER,
          isCJ: false,
          hasLeadingPunctuation: false,
          hasTrailingPunctuation: false
        });
        continue;
      }
      appendNode({
        type: "word",
        value: innerToken,
        kind: KIND_CJ_LETTER,
        isCJ: true,
        hasLeadingPunctuation: false,
        hasTrailingPunctuation: false
      });
    }
  }
  if (false) {
    for (let i = 1; i < nodes.length; i++) {
      noop_default(!(nodes[i - 1].type === "whitespace" && nodes[i].type === "whitespace"), "splitText should not create consecutive whitespace nodes");
    }
  }
  return nodes;
  function appendNode(node2) {
    const lastNode = method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      nodes,
      -1
    );
    if (lastNode?.type === "word" && !isBetween(KIND_NON_CJK, KIND_CJK_PUNCTUATION) && // disallow leading/trailing full-width whitespace
    [lastNode.value, node2.value].every((value) => !/\u3000/.test(value))) {
      nodes.push({
        type: "whitespace",
        value: ""
      });
    }
    nodes.push(node2);
    function isBetween(kind1, kind2) {
      return lastNode.kind === kind1 && node2.kind === kind2 || lastNode.kind === kind2 && node2.kind === kind1;
    }
  }
}
function getOrderedListItemInfo(orderListItem, options2) {
  let text4 = options2.originalText.slice(orderListItem.position.start.offset, orderListItem.position.end.offset);
  if (options2.parser !== "mdx") {
    const firstChild = orderListItem.children[0];
    if (firstChild) {
      text4 = options2.originalText.slice(orderListItem.position.start.offset, firstChild.position.start.offset);
    }
  }
  const {
    numberText,
    leadingSpaces
  } = text4.match(/^\s*(?<numberText>\d+)(\.|\))(?<leadingSpaces>\s*)/).groups;
  return {
    number: Number(numberText),
    leadingSpaces
  };
}
function hasGitDiffFriendlyOrderedList(node2, options2) {
  if (!node2.ordered || node2.children.length < 2) {
    return false;
  }
  const secondNumber = getOrderedListItemInfo(node2.children[1], options2).number;
  if (secondNumber !== 1) {
    return false;
  }
  const firstNumber = getOrderedListItemInfo(node2.children[0], options2).number;
  if (firstNumber !== 0) {
    return true;
  }
  return node2.children.length > 2 && getOrderedListItemInfo(node2.children[2], options2).number === 1;
}
function getFencedCodeBlockValue(node2, originalText) {
  const {
    value
  } = node2;
  if (node2.position.end.offset === originalText.length && value.endsWith("\n") && // Code block has no end mark
  originalText.endsWith("\n")) {
    return value.slice(0, -1);
  }
  return value;
}
function mapAst(ast, handler) {
  return (function preorder(node2, index2, parentStack) {
    const newNode = {
      ...handler(node2, index2, parentStack)
    };
    newNode.children && (newNode.children = newNode.children.map((child, index3) => preorder(child, index3, [newNode, ...parentStack])));
    return newNode;
  })(ast, null, []);
}
function isAutolink(node2) {
  if (node2?.type !== "link" || node2.children.length !== 1) {
    return false;
  }
  const [child] = node2.children;
  return locStart(node2) === locStart(child) && locEnd(node2) === locEnd(child);
}
function isPrettierIgnore(node2) {
  let match;
  if (node2.type === "html") {
    match = node2.value.match(/^<!--\s*prettier-ignore(?:-(start|end))?\s*-->$/);
  } else {
    let comment;
    if (node2.type === "esComment") {
      comment = node2;
    } else if (node2.type === "paragraph" && node2.children.length === 1 && node2.children[0].type === "esComment") {
      comment = node2.children[0];
    }
    if (comment) {
      match = comment.value.match(/^prettier-ignore(?:-(start|end))?$/);
    }
  }
  return match ? match[1] || "next" : false;
}
function getNthListSiblingIndex(node2, parentNode) {
  return getNthSiblingIndex(node2, parentNode, (siblingNode) => siblingNode.ordered === node2.ordered);
  function getNthSiblingIndex(node3, parentNode2, condition) {
    let index2 = -1;
    for (const childNode of parentNode2.children) {
      if (childNode.type === node3.type && condition(childNode)) {
        index2++;
      } else {
        index2 = -1;
      }
      if (childNode === node3) {
        return index2;
      }
    }
  }
}
function hasPrettierIgnore(path2) {
  return path2.index > 0 && isPrettierIgnore(path2.previous) === "next";
}
function isSetextHeading(node2) {
  const {
    start,
    end
  } = node2.position;
  return start.line !== end.line;
}
var isNewLine = (node2) => node2?.type === "whitespace" && node2.value === "\n";

// src/language-markdown/parse/unified-plugins/html-to-jsx.js
function htmlToJsx() {
  return (ast) => mapAst(ast, (node2, _index, [parent]) => {
    if (node2.type !== "html" || // Keep HTML-style comments (legacy MDX)
    COMMENT_REGEX.test(node2.value) || INLINE_NODE_WRAPPER_TYPES.has(parent.type)) {
      return node2;
    }
    return { ...node2, type: "jsx" };
  });
}
var html_to_jsx_default = htmlToJsx;

// src/language-markdown/parse/unified-plugins/liquid.js
var liquid = function() {
  const proto = this.Parser.prototype;
  const methods = proto.inlineMethods;
  methods.splice(methods.indexOf("text"), 0, "liquid");
  proto.inlineTokenizers.liquid = tokenizer;
  function tokenizer(eat, value) {
    const match = value.match(/^(\{%.*?%\}|\{\{.*?\}\})/s);
    if (match) {
      return eat(match[0])({
        type: "liquidNode",
        value: match[0]
      });
    }
  }
  tokenizer.locator = function(value, fromIndex) {
    return value.indexOf("{", fromIndex);
  };
};
var liquid_default = liquid;

// src/language-markdown/parse/unified-plugins/wiki-link.js
var wikiLink = function() {
  const entityType = "wikiLink";
  const wikiLinkRegex = /^\[\[(?<linkContents>.+?)\]\]/s;
  const proto = this.Parser.prototype;
  const methods = proto.inlineMethods;
  methods.splice(methods.indexOf("link"), 0, entityType);
  proto.inlineTokenizers.wikiLink = tokenizer;
  function tokenizer(eat, value) {
    const match = wikiLinkRegex.exec(value);
    if (match) {
      const linkContents = match.groups.linkContents.trim();
      return eat(match[0])({
        type: entityType,
        value: linkContents
      });
    }
  }
  tokenizer.locator = function(value, fromIndex) {
    return value.indexOf("[", fromIndex);
  };
};
var wiki_link_default = wikiLink;

// src/language-markdown/parse/parse-mdx.js
function parseMdx(text4) {
  const processor = (0, import_unified.default)().use(import_remark_parse.default, {
    commonmark: true,
    blocks: [BLOCKS_REGEX]
  }).use(import_remark_footnotes.default).use(front_matter_default).use(import_remark_math.default).use(esSyntax).use(liquid_default).use(html_to_jsx_default).use(wiki_link_default);
  return processor.run(processor.parse(text4));
}

// src/utilities/pragma/pragma.evaluate.js
var FORMAT_PRAGMA_TO_INSERT = "format";
var MARKDOWN_HAS_IGNORE_PRAGMA_REGEXP = /<!--\s*@(?:noformat|noprettier)\s*-->|\{\s*\/\*\s*@(?:noformat|noprettier)\s*\*\/\s*\}|<!--.*\r?\n[\s\S]*(^|\n)[^\S\n]*@(?:noformat|noprettier)[^\S\n]*($|\n)[\s\S]*\n.*-->/m;
var MARKDOWN_HAS_PRAGMA_REGEXP = /<!--\s*@(?:format|prettier)\s*-->|\{\s*\/\*\s*@(?:format|prettier)\s*\*\/\s*\}|<!--.*\r?\n[\s\S]*(^|\n)[^\S\n]*@(?:format|prettier)[^\S\n]*($|\n)[\s\S]*\n.*-->/m;

// src/language-markdown/pragma.js
var hasPragma = (text4) => parse_default(text4).content.trimStart().match(MARKDOWN_HAS_PRAGMA_REGEXP)?.index === 0;
var hasIgnorePragma = (text4) => parse_default(text4).content.trimStart().match(MARKDOWN_HAS_IGNORE_PRAGMA_REGEXP)?.index === 0;
var insertPragma = (text4) => {
  const { frontMatter: frontMatter2 } = parse_default(text4);
  const pragma = `<!-- @${FORMAT_PRAGMA_TO_INSERT} -->`;
  return frontMatter2 ? `${frontMatter2.raw}

${pragma}

${text4.slice(frontMatter2.end.index)}` : `${pragma}

${text4}`;
};

// src/language-markdown/parsers.js
function createParser(parse3) {
  return {
    astFormat: "mdast",
    hasPragma,
    hasIgnorePragma,
    locStart,
    locEnd,
    parse: parse3
  };
}
var markdownParser = /* @__PURE__ */ createParser(parseMarkdown);
var mdxParser = /* @__PURE__ */ createParser(parseMdx);

// src/language-markdown/printers.js
var printers_exports = {};
__export(printers_exports, {
  mdast: () => printer
});

// src/utilities/get-max-continuous-count.js
function getMaxContinuousCount(text4, searchString) {
  let results = text4.matchAll(
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

// src/language-markdown/embed.js
function embed(path2, options2) {
  const { node: node2 } = path2;
  switch (node2.type) {
    case "code": {
      const { lang: language } = node2;
      if (!language) {
        return;
      }
      let parser;
      if (language === "angular-ts") {
        parser = infer_parser_default(options2, { language: "typescript" });
      } else if (language === "angular-html") {
        parser = "angular";
      } else {
        parser = infer_parser_default(options2, { language });
      }
      if (!parser) {
        return;
      }
      return async (textToDoc) => {
        const textToDocOptions = { parser };
        if (language === "ts" || language === "typescript") {
          textToDocOptions.filepath = "dummy.ts";
        } else if (language === "tsx") {
          textToDocOptions.filepath = "dummy.tsx";
        }
        const doc = await textToDoc(
          options2.parser === "mdx" ? getFencedCodeBlockValue(node2, options2.originalText) : node2.value,
          textToDocOptions
        );
        const styleUnit = options2.__inJsTemplate ? "~" : "`";
        const style = styleUnit.repeat(
          Math.max(3, get_max_continuous_count_default(node2.value, styleUnit) + 1)
        );
        return markAsRoot([
          style,
          node2.lang,
          node2.meta ? " " + node2.meta : "",
          hardline,
          replaceEndOfLine(doc),
          hardline,
          style
        ]);
      };
    }
    // MDX
    case "import":
    case "export":
      return (textToDoc) => textToDoc(node2.value, {
        // TODO: Rename this option since it's not used in HTML
        __onHtmlBindingRoot: (ast) => validateImportExport(ast, node2.type),
        parser: "babel"
      });
    case "jsx":
      return (textToDoc) => textToDoc(`<$>${node2.value}</$>`, {
        parser: "__js_expression",
        rootMarker: "mdx"
      });
  }
  return null;
}
function validateImportExport(ast, type) {
  const {
    program: { body }
  } = ast;
  if (body.some(
    (node2) => !(node2.type === "ImportDeclaration" || node2.type === "ExportDefaultDeclaration" || node2.type === "ExportNamedDeclaration")
  )) {
    throw new Error(`Unexpected '${type}' in MDX.`);
  }
}
var embed_default = embed;

// src/language-markdown/massage-ast/index.js
var import_collapse_white_space = __toESM(require_collapse_white_space(), 1);
var ignoredProperties = /* @__PURE__ */ new Set([
  "position",
  "raw"
  // front-matter
]);
function massageAstNode(original, cloned, parent) {
  if (original.type === "code" || original.type === "yaml" || original.type === "import" || original.type === "export" || original.type === "jsx") {
    delete cloned.value;
  }
  if (original.type === "list") {
    delete cloned.isAligned;
  }
  if (original.type === "list" || original.type === "listItem") {
    delete cloned.spread;
  }
  if (original.type === "text") {
    return null;
  }
  if (original.type === "inlineCode") {
    cloned.value = method_replace_all_default(
      /* OPTIONAL_OBJECT: false */
      0,
      original.value,
      "\n",
      " "
    );
  }
  if (original.type === "definition" || original.type === "linkReference" || original.type === "imageReference") {
    cloned.label = (0, import_collapse_white_space.default)(original.label);
  }
  if (original.type === "imageReference" && original.referenceType === "collapsed") {
    cloned.alt = (0, import_collapse_white_space.default)(original.alt);
  }
  if ((original.type === "link" || original.type === "image") && original.url && original.url.includes("(")) {
    for (const character of "<>") {
      cloned.url = method_replace_all_default(
        /* OPTIONAL_OBJECT: false */
        0,
        original.url,
        character,
        encodeURIComponent(character)
      );
    }
  }
  if ((original.type === "definition" || original.type === "link" || original.type === "image") && original.title) {
    cloned.title = method_replace_all_default(
      /* OPTIONAL_OBJECT: false */
      0,
      original.title,
      /\\(?=["')])/g,
      ""
    );
  }
  if (parent?.type === "root" && parent.children.length > 0 && (parent.children[0] === original || is_front_matter_default(parent.children[0]) && parent.children[1] === original) && original.type === "html" && hasPragma(original.value)) {
    return null;
  }
}
massageAstNode.ignoredProperties = ignoredProperties;

// src/language-markdown/print/ignored.js
function printPrettierIgnored(path2, options2) {
  const originalText = options2.originalText.slice(
    path2.node.position.start.offset,
    path2.node.position.end.offset
  );
  if (options2.parser === "mdx") {
    return originalText;
  }
  switch (path2.node.type) {
    case "list":
      if (path2.findAncestor((p) => p.type === "blockquote") && options2.proseWrap !== "always") {
        return originalText.replace(/\n>\s*$/, "");
      }
      return originalText;
    default:
      return originalText;
  }
}

// src/language-markdown/print/mdast.js
var import_collapse_white_space2 = __toESM(require_collapse_white_space(), 1);

// src/utilities/get-min-not-present-continuous-count.js
function getMinNotPresentContinuousCount(text4, searchString) {
  const matches = text4.match(
    new RegExp(`(${escapeStringRegexp(searchString)})+`, "g")
  );
  if (matches === null) {
    return 1;
  }
  const countPresent = /* @__PURE__ */ new Map();
  let max = 0;
  for (const match of matches) {
    const count = match.length / searchString.length;
    countPresent.set(count, true);
    if (count > max) {
      max = count;
    }
  }
  for (let i = 1; i < max; i++) {
    if (!countPresent.get(i)) {
      return i;
    }
  }
  return max + 1;
}
var get_min_not_present_continuous_count_default = getMinNotPresentContinuousCount;

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
function getPreferredQuote(text4, preferredQuoteOrPreferSingleQuote) {
  const { preferred, alternate } = preferredQuoteOrPreferSingleQuote === true || preferredQuoteOrPreferSingleQuote === SINGLE_QUOTE ? SINGLE_QUOTE_SETTINGS : DOUBLE_QUOTE_SETTINGS;
  const { length } = text4;
  let preferredQuoteCount = 0;
  let alternateQuoteCount = 0;
  for (let index2 = 0; index2 < length; index2++) {
    const codePoint = text4.charCodeAt(index2);
    if (codePoint === preferred.codePoint) {
      preferredQuoteCount++;
    } else if (codePoint === alternate.codePoint) {
      alternateQuoteCount++;
    }
  }
  return (preferredQuoteCount > alternateQuoteCount ? alternate : preferred).character;
}

// src/utilities/unexpected-node-error.js
var UnexpectedNodeError = class extends Error {
  name = "UnexpectedNodeError";
  constructor(node2, language, typeProperty = "type") {
    super(
      `Unexpected ${language} node ${typeProperty}: ${JSON.stringify(
        node2[typeProperty]
      )}.`
    );
    this.node = node2;
  }
};
var unexpected_node_error_default = UnexpectedNodeError;

// src/language-markdown/print/children.js
function printChildren(path2, options2, print, events = {}) {
  const { processor = print } = events;
  const parts = [];
  path2.each(() => {
    const result = processor(path2);
    if (result !== false) {
      if (parts.length > 0 && shouldPrePrintHardline(path2)) {
        parts.push(hardline);
        if (shouldPrePrintDoubleHardline(path2, options2)) {
          parts.push(hardline);
        }
      }
      parts.push(result);
    }
  }, "children");
  return parts;
}
function shouldPrePrintHardline({ node: node2, parent }) {
  const isInlineNode = INLINE_NODE_TYPES.has(node2.type) && !(node2.type === "liquidNode" && !INLINE_NODE_WRAPPER_TYPES.has(parent.type));
  const isInlineHTML = node2.type === "html" && INLINE_NODE_WRAPPER_TYPES.has(parent.type);
  return !isInlineNode && !isInlineHTML;
}
var SIBLING_NODE_TYPES = /* @__PURE__ */ new Set(["listItem", "definition"]);
function shouldPrePrintDoubleHardline(path2, options2) {
  const { node: node2, previous: previous4, parent } = path2;
  if (options2.parser === "mdx") {
    if (isLooseListItemLegacy(previous4, options2) || node2.type === "list" && parent.type === "listItem" && (previous4.type === "code" || // Preserve blank line before nested list within listItem (issue #17746)
    previous4.type === "paragraph") && previous4.position.end.line + 1 < node2.position.start.line) {
      return true;
    }
  } else {
    if (isSetextHeading(node2) && node2.position.start.line < previous4.position.end.line) {
      return false;
    }
    if (isPreviousNodeLooseListItem(path2) || node2.type === "list" && parent.type === "listItem" && (previous4.type === "code" || // Preserve blank line before nested list within listItem (issue #17746)
    previous4.type === "paragraph") && previous4.position.end.line + 1 < node2.position.start.line) {
      return true;
    }
  }
  const isSequence = previous4.type === node2.type;
  const isSiblingNode = isSequence && SIBLING_NODE_TYPES.has(node2.type);
  let isInTightListItem;
  if (options2.parser === "mdx") {
    isInTightListItem = parent.type === "listItem" && (node2.type === "list" || !isLooseListItemLegacy(parent, options2));
  } else {
    isInTightListItem = parent.type === "listItem" && (node2.type === "list" || !path2.callParent(isLooseListItem));
  }
  const isPrevNodePrettierIgnore = isPrettierIgnore(previous4) === "next";
  const isBlockHtmlWithoutBlankLineBetweenPrevHtml = node2.type === "html" && previous4.type === "html" && previous4.position.end.line + 1 === node2.position.start.line;
  const isBlockHtmlWithoutBlankLineBetweenPrevParagraph = options2.parser !== "mdx" && node2.type === "html" && previous4.type === "paragraph" && previous4.position.end.line + 1 === node2.position.start.line;
  const isHtmlDirectAfterListItem = node2.type === "html" && parent.type === "listItem" && previous4.type === "paragraph" && previous4.position.end.line + 1 === node2.position.start.line;
  const isBlockLiquidWithoutBlankLine = (node2.type === "liquidNode" || previous4.type === "liquidNode") && previous4.position.end.line + 1 === node2.position.start.line;
  return !(isSiblingNode || isInTightListItem || isPrevNodePrettierIgnore || isBlockHtmlWithoutBlankLineBetweenPrevHtml || isBlockHtmlWithoutBlankLineBetweenPrevParagraph || isHtmlDirectAfterListItem || isBlockLiquidWithoutBlankLine);
}
function isLooseListItemLegacy(node2, options2) {
  return node2.type === "listItem" && (node2.spread || // Check if `listItem` ends with `\n`
  // since it can't be empty, so we only need check the last character
  options2.originalText.charAt(node2.position.end.offset - 1) === "\n");
}
function isLooseListItem({ node: node2, parent, next }) {
  return node2.type === "listItem" && (node2.spread || parent.type === "list" && next?.type === "listItem" && node2.position.end.line + 1 < next.position.start.line);
}
function isPreviousNodeLooseListItem(path2) {
  if (path2.index === 0) {
    return false;
  }
  return isLooseListItem({
    node: path2.previous,
    parent: path2.parent,
    next: path2.node
  });
}

// src/language-markdown/print/heading.js
function printAtxHeading(path2, options2, print) {
  return [
    "#".repeat(path2.node.depth) + " ",
    printChildren(path2, options2, print)
  ];
}
function printSetextHeading(path2, options2, print) {
  const { originalText } = options2;
  const { node: node2 } = path2;
  const end = node2.position.end.offset;
  const lineStart = originalText.lastIndexOf("\n", end - 1) + 1;
  const lastLine = originalText.slice(lineStart, end);
  const start = Math.max(lastLine.indexOf("="), lastLine.indexOf("-"));
  const underline = lastLine.slice(start);
  return [printChildren(path2, options2, print), hardline, underline];
}
function printHeading(path2, options2, print) {
  if (options2.parser !== "mdx" && isSetextHeading(path2.node)) {
    return printSetextHeading(path2, options2, print);
  }
  return printAtxHeading(path2, options2, print);
}

// src/language-markdown/print/list.js
var MAXIMUM_ORDERED_LIST_MARKER = 999999999;
function printList(path2, options2, print) {
  const { node: node2 } = path2;
  const nthSiblingIndex = getNthListSiblingIndex(node2, path2.parent);
  const isGitDiffFriendlyOrderedList = hasGitDiffFriendlyOrderedList(
    node2,
    options2
  );
  const minIndent = requiredIndent(path2);
  return printChildren(path2, options2, print, {
    processor() {
      const prefix = getPrefix();
      const { node: childNode } = path2;
      if (childNode.children.length === 2 && childNode.children[1].type === "html" && childNode.children[0].position.start.column !== childNode.children[1].position.start.column) {
        return [prefix, printListItem(path2, options2, print, prefix)];
      }
      return [
        prefix,
        align(
          " ".repeat(prefix.length),
          printListItem(path2, options2, print, prefix)
        )
      ];
      function getPrefix() {
        const rawPrefix = node2.ordered ? (path2.isFirst ? node2.start : isGitDiffFriendlyOrderedList ? 1 : Math.min(
          node2.start + path2.index,
          MAXIMUM_ORDERED_LIST_MARKER
        )) + (nthSiblingIndex % 2 === 0 ? ". " : ") ") : nthSiblingIndex % 2 === 0 ? "- " : "* ";
        let prefix2 = node2.isAligned && node2.ordered ? alignListPrefix(rawPrefix, options2) : rawPrefix;
        if (prefix2.length >= minIndent) {
          return prefix2;
        }
        prefix2 = prefix2.trimEnd();
        const trailingSpaces = Math.min(minIndent - prefix2.length, 4);
        if (trailingSpaces > 0) {
          prefix2 += " ".repeat(trailingSpaces);
        }
        const leadingSpaces = Math.min(minIndent - prefix2.length, 3);
        if (leadingSpaces > 0) {
          prefix2 = " ".repeat(leadingSpaces) + prefix2;
        }
        return prefix2;
      }
    }
  });
}
function printListItem(path2, options2, print, listPrefix) {
  const { node: node2 } = path2;
  const prefix = node2.checked === null ? "" : node2.checked ? "[x] " : "[ ] ";
  return [
    prefix,
    printChildren(path2, options2, print, {
      processor({ node: node3, isFirst }) {
        if (isFirst && node3.type !== "list" || node3.type === "html") {
          return align(" ".repeat(prefix.length), print());
        }
        if (node3.type === "code" && node3.isIndented) {
          return print();
        }
        const alignment = " ".repeat(
          clamp(options2.tabWidth - listPrefix.length, 0, 3)
          // 4+ will cause indented code block
        );
        return [alignment, align(alignment, print())];
      }
    })
  ];
}
function requiredIndent(path2) {
  const { node: node2, next } = path2;
  if (node2.checked === null) {
    return 0;
  }
  if (!(next?.type === "code" && next.isIndented)) {
    return 0;
  }
  const leadingSpaces = /^[ \t]*/.exec(next.value)?.[0] ?? "";
  return 4 + // base indent of the code block
  [...leadingSpaces].reduce(
    (count, char) => count + (char === "	" ? 4 : 1),
    0
  ) + 1;
}
function printListLegacy(path2, options2, print) {
  const { node: node2 } = path2;
  const nthSiblingIndex = getNthListSiblingIndex(node2, path2.parent);
  const isGitDiffFriendlyOrderedList = hasGitDiffFriendlyOrderedList(
    node2,
    options2
  );
  return printChildren(path2, options2, print, {
    processor() {
      const prefix = getPrefix();
      const { node: childNode } = path2;
      if (childNode.children.length === 2 && childNode.children[1].type === "html" && childNode.children[0].position.start.column !== childNode.children[1].position.start.column) {
        return [prefix, printListItemLegacy(path2, options2, print, prefix)];
      }
      return [
        prefix,
        align(
          " ".repeat(prefix.length),
          printListItemLegacy(path2, options2, print, prefix)
        )
      ];
      function getPrefix() {
        const rawPrefix = node2.ordered ? (path2.isFirst ? node2.start : isGitDiffFriendlyOrderedList ? 1 : node2.start + path2.index) + (nthSiblingIndex % 2 === 0 ? ". " : ") ") : nthSiblingIndex % 2 === 0 ? "- " : "* ";
        return (node2.isAligned || /* workaround for https://github.com/remarkjs/remark/issues/315 */
        node2.hasIndentedCodeblock) && node2.ordered ? alignListPrefix(rawPrefix, options2) : rawPrefix;
      }
    }
  });
}
function printListItemLegacy(path2, options2, print, listPrefix) {
  const { node: node2 } = path2;
  const prefix = node2.checked === null ? "" : node2.checked ? "[x] " : "[ ] ";
  return [
    prefix,
    printChildren(path2, options2, print, {
      processor({ node: node3, isFirst }) {
        if (isFirst && node3.type !== "list") {
          return align(" ".repeat(prefix.length), print());
        }
        if (node3.type === "code" && node3.isIndented) {
          return print();
        }
        const alignment = " ".repeat(
          clamp(options2.tabWidth - listPrefix.length, 0, 3)
          // 4+ will cause indented code block
        );
        return [alignment, align(alignment, print())];
      }
    })
  ];
}
function alignListPrefix(prefix, options2) {
  const additionalSpaces = getAdditionalSpaces();
  return prefix + " ".repeat(
    additionalSpaces >= 4 ? 0 : additionalSpaces
    // 4+ will cause indented code block
  );
  function getAdditionalSpaces() {
    const restSpaces = prefix.length % options2.tabWidth;
    return restSpaces === 0 ? 0 : options2.tabWidth - restSpaces;
  }
}
function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

// src/language-markdown/print/paragraph.js
function printParagraph(path2, options2, print) {
  const parts = path2.map(print, "children");
  return flattenFill(parts);
}
function flattenFill(docs) {
  const parts = [""];
  (function rec(docArray) {
    for (const doc of docArray) {
      const docType = get_doc_type_default(doc);
      if (docType === DOC_TYPE_ARRAY) {
        rec(doc);
        continue;
      }
      let head = doc;
      let rest = [];
      if (docType === DOC_TYPE_FILL) {
        [head, ...rest] = doc.parts;
      }
      parts.push([parts.pop(), head], ...rest);
    }
  })(docs);
  return fill(parts);
}

// src/language-markdown/print/sentence.js
function printSentence(path2, print) {
  const parts = [""];
  path2.each(() => {
    const { node: node2 } = path2;
    const doc = print();
    switch (node2.type) {
      case "whitespace":
        if (get_doc_type_default(doc) !== DOC_TYPE_STRING) {
          parts.push(doc, "");
          break;
        }
      // fallthrough
      default:
        parts.push([parts.pop(), doc]);
    }
  }, "children");
  return fill(parts);
}

// src/language-markdown/print/table.js
function printTable(path2, options2, print) {
  const { node: node2 } = path2;
  const columnMaxWidths = [];
  const contents = path2.map(
    () => path2.map(({ index: columnIndex }) => {
      const text4 = printDocToString(print(), options2).formatted;
      const width = get_string_width_default(text4);
      columnMaxWidths[columnIndex] = Math.max(
        columnMaxWidths[columnIndex] ?? 3,
        // minimum width = 3 (---, :--, :-:, --:)
        width
      );
      return { text: text4, width };
    }, "children"),
    "children"
  );
  const alignedTable = printTableContents(
    /* isCompact */
    false
  );
  if (options2.proseWrap !== "never") {
    return [breakParent, alignedTable];
  }
  const compactTable = printTableContents(
    /* isCompact */
    true
  );
  return [breakParent, group(ifBreak(compactTable, alignedTable))];
  function printTableContents(isCompact) {
    return join(
      hardlineWithoutBreakParent,
      [
        printRow(contents[0], isCompact),
        printAlign(isCompact),
        ...contents.slice(1).map((rowContents) => printRow(rowContents, isCompact))
      ].map((columns) => `| ${columns.join(" | ")} |`)
    );
  }
  function printAlign(isCompact) {
    return columnMaxWidths.map((width, index2) => {
      if (options2.parser !== "mdx" && index2 >= contents[0].length) {
        return null;
      }
      const align2 = node2.align[index2];
      const first = align2 === "center" || align2 === "left" ? ":" : "-";
      const last = align2 === "center" || align2 === "right" ? ":" : "-";
      const middle = isCompact ? "-" : "-".repeat(width - 2);
      return `${first}${middle}${last}`;
    }).filter((x) => x !== null);
  }
  function printRow(columns, isCompact) {
    return columns.map(({ text: text4, width }, columnIndex) => {
      if (isCompact) {
        return text4;
      }
      const spaces = columnMaxWidths[columnIndex] - width;
      const align2 = node2.align[columnIndex];
      let before = 0;
      if (align2 === "right") {
        before = spaces;
      } else if (align2 === "center") {
        before = Math.floor(spaces / 2);
      }
      const after = spaces - before;
      return `${" ".repeat(before)}${text4}${" ".repeat(after)}`;
    });
  }
}

// src/language-markdown/print/whitespace.js
var SINGLE_LINE_NODE_TYPES = /* @__PURE__ */ new Set(["tableCell", "link", "wikiLink"]);
var lineBreakBetweenTheseAndCJConvertsToSpace = new Set("!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~");
function isInSentenceWithCJSpaces({
  parent: sentenceNode
}) {
  if (sentenceNode.usesCJSpaces === void 0) {
    const stats = {
      " ": 0,
      "": 0
    };
    const {
      children
    } = sentenceNode;
    for (let i = 1; i < children.length - 1; ++i) {
      const node2 = children[i];
      if (node2.type === "whitespace" && (node2.value === " " || node2.value === "")) {
        const previousKind = children[i - 1].kind;
        const nextKind = children[i + 1].kind;
        if (previousKind === KIND_CJ_LETTER && nextKind === KIND_NON_CJK || previousKind === KIND_NON_CJK && nextKind === KIND_CJ_LETTER) {
          ++stats[node2.value];
        }
      }
    }
    sentenceNode.usesCJSpaces = stats[" "] > stats[""];
  }
  return sentenceNode.usesCJSpaces;
}
function lineBreakCanBeConvertedToSpace(path2, isLink) {
  if (isLink) {
    return true;
  }
  const {
    previous: previous4,
    next
  } = path2;
  if (!previous4 || !next) {
    return true;
  }
  const previousKind = previous4.kind;
  const nextKind = next.kind;
  if (
    // "\n" between non-CJK or Korean characters always can be converted to a
    // space. Korean Hangul simulates Latin words. See
    // https://github.com/prettier/prettier/issues/6516
    isNonCJKOrKoreanLetter(previousKind) && isNonCJKOrKoreanLetter(nextKind) || // Han & Hangul: same way preferred
    previousKind === KIND_K_LETTER && nextKind === KIND_CJ_LETTER || nextKind === KIND_K_LETTER && previousKind === KIND_CJ_LETTER
  ) {
    return true;
  }
  if (
    // around CJK punctuation
    previousKind === KIND_CJK_PUNCTUATION || nextKind === KIND_CJK_PUNCTUATION || // between CJ
    previousKind === KIND_CJ_LETTER && nextKind === KIND_CJ_LETTER
  ) {
    return false;
  }
  if (lineBreakBetweenTheseAndCJConvertsToSpace.has(next.value[0]) || lineBreakBetweenTheseAndCJConvertsToSpace.has(method_at_default(
    /* OPTIONAL_OBJECT: false */
    0,
    previous4.value,
    -1
  ))) {
    return true;
  }
  if (previous4.hasTrailingPunctuation || next.hasLeadingPunctuation) {
    return false;
  }
  return isInSentenceWithCJSpaces(path2);
}
function isNonCJKOrKoreanLetter(kind) {
  return kind === KIND_NON_CJK || kind === KIND_K_LETTER;
}
function isBreakable(path2, value, proseWrap, isLink, options2) {
  if (proseWrap !== "always" || path2.hasAncestor((node2) => SINGLE_LINE_NODE_TYPES.has(node2.type) || node2.type === "heading" && (options2.parser === "mdx" || !isSetextHeading(node2)))) {
    return false;
  }
  if (isLink) {
    return value !== "";
  }
  const {
    previous: previous4,
    next
  } = path2;
  if (!previous4 || !next) {
    return true;
  }
  if (value === "") {
    return false;
  }
  if (
    // See the same product terms as the following in lineBreakCanBeConvertedToSpace
    // The behavior is consistent between browsers and Prettier in that line breaks between Korean and Chinese/Japanese letters are equivalent to spaces.
    // Currently, [CJK punctuation][\n][Hangul] is interchangeable to [CJK punctuation][""][Hangul],
    // but this is not compatible with Firefox's behavior.
    // Will be changed to [CJK punctuation][" "][Hangul] in the future
    previous4.kind === KIND_K_LETTER && next.kind === KIND_CJ_LETTER || next.kind === KIND_K_LETTER && previous4.kind === KIND_CJ_LETTER
  ) {
    return true;
  }
  if (previous4.isCJ || next.isCJ) {
    return false;
  }
  return true;
}
function printWhitespace(path2, value, proseWrap, isLink, options2) {
  if (proseWrap === "preserve" && value === "\n") {
    return hardline;
  }
  const canBeSpace = value === " " || value === "\n" && lineBreakCanBeConvertedToSpace(path2, isLink);
  if (isBreakable(path2, value, proseWrap, isLink, options2)) {
    return canBeSpace ? line : softline;
  }
  return canBeSpace ? " " : "";
}

// src/language-markdown/print/word.js
var fakeSetextHeaderRegex = /^(?:=+|-+)$/;
function printWord(path2, options2) {
  const {
    node: node2
  } = path2;
  const emphasisOrStrong = path2.findAncestor((p) => p.type === "emphasis" || p.type === "strong");
  let text4 = node2.value;
  if (!emphasisOrStrong) {
    if (options2.proseWrap === "preserve" && path2.parent.type === "sentence" && fakeSetextHeaderRegex.test(text4) && isNewLine(path2.previous) && (path2.isLast || isNewLine(path2.next))) {
      return `\\${text4}`;
    }
    return text4;
  }
  if (path2.isFirst && (text4.startsWith("*") || text4.startsWith("_")) && path2.callParent(() => path2.isFirst) && path2.grandparent === emphasisOrStrong) {
    text4 = `\\${text4}`;
  }
  text4 = method_replace_all_default(
    /* OPTIONAL_OBJECT: false */
    0,
    text4,
    /(\\+|^|.)(\*+|_+)($|.)/g,
    (match, preceding, delimiterRun, following) => {
      if ([...preceding].every((c) => c === "\\") && preceding.length % 2 === 1) {
        return match;
      }
      if (canOpenOrCloseStrongOrEmphasis(method_at_default(
        /* OPTIONAL_OBJECT: false */
        0,
        preceding,
        -1
      ) || method_at_default(
        /* OPTIONAL_OBJECT: true */
        1,
        path2.previous?.value,
        -1
      ), delimiterRun, following[0] || path2.next?.value[0])) {
        return `${preceding}\\${delimiterRun}${following}`;
      }
      return match;
    }
  );
  return text4;
}
function canOpenOrCloseStrongOrEmphasis(preceding, delimiterRun, following) {
  if (!preceding || !following) {
    return null;
  }
  const followedByWhitespace = /[\p{Space_Separator}\t\n\f\r]/u.test(following);
  const precededByWhitespace = /[\p{Space_Separator}\t\n\f\r]/u.test(preceding);
  const followedByPunctuation = PUNCTUATION_REGEXP.test(following);
  const precededByPunctuation = PUNCTUATION_REGEXP.test(preceding);
  const isLeftFlanking = !followedByWhitespace && (!followedByPunctuation || followedByPunctuation && (precededByWhitespace || precededByPunctuation));
  const isRightFlanking = !precededByWhitespace && (!precededByPunctuation || precededByPunctuation && (followedByWhitespace || followedByPunctuation));
  const indicator = delimiterRun[0];
  if (indicator === "*") {
    return isLeftFlanking || isRightFlanking;
  }
  if (isLeftFlanking) {
    return !isRightFlanking || precededByPunctuation;
  }
  if (isRightFlanking) {
    return !isLeftFlanking || followedByPunctuation;
  }
  return false;
}
function printWordLegacy(path2) {
  const {
    node: node2
  } = path2;
  let escapedValue = method_replace_all_default(
    /* OPTIONAL_OBJECT: false */
    0,
    method_replace_all_default(
      /* OPTIONAL_OBJECT: false */
      0,
      node2.value,
      "*",
      "\\*"
    ),
    new RegExp([`(^|${PUNCTUATION_REGEXP.source})(_+)`, `(_+)(${PUNCTUATION_REGEXP.source}|$)`].join("|"), "gu"),
    (_, text1, underscore1, underscore2, text22) => method_replace_all_default(
      /* OPTIONAL_OBJECT: false */
      0,
      underscore1 ? `${text1}${underscore1}` : `${underscore2}${text22}`,
      "_",
      "\\_"
    )
  );
  const isFirstSentence = (node3, name, index2) => node3.type === "sentence" && index2 === 0;
  const isLastChildAutolink = (node3, name, index2) => isAutolink(node3.children[index2 - 1]);
  if (escapedValue !== node2.value && (path2.match(void 0, isFirstSentence, isLastChildAutolink) || path2.match(void 0, isFirstSentence, (node3, name, index2) => node3.type === "emphasis" && index2 === 0, isLastChildAutolink))) {
    escapedValue = escapedValue.replace(/^(\\?[*_])+/, (prefix) => method_replace_all_default(
      /* OPTIONAL_OBJECT: false */
      0,
      prefix,
      "\\",
      ""
    ));
  }
  return escapedValue;
}

// src/language-markdown/print/mdast.js
function prevOrNextWord(path2) {
  const {
    previous: previous4,
    next
  } = path2;
  const hasPrevOrNextWord = previous4?.type === "sentence" && method_at_default(
    /* OPTIONAL_OBJECT: false */
    0,
    previous4.children,
    -1
  )?.type === "word" && !method_at_default(
    /* OPTIONAL_OBJECT: false */
    0,
    previous4.children,
    -1
  ).hasTrailingPunctuation && // https://spec.commonmark.org/0.31.2/#unicode-whitespace-character
  !/[\p{Space_Separator}\t\n\f\r]$/u.test(method_at_default(
    /* OPTIONAL_OBJECT: false */
    0,
    previous4.children,
    -1
  ).value) || next?.type === "sentence" && next.children[0]?.type === "word" && !next.children[0].hasLeadingPunctuation && !/^[\p{Space_Separator}\t\n\f\r]/u.test(next.children[0].value);
  return hasPrevOrNextWord;
}
function hasFakeWhitespaceAfterNextToken(path2) {
  const {
    siblings,
    index: index2
  } = path2;
  if (!siblings || typeof index2 !== "number") {
    return false;
  }
  const afterNext = siblings[index2 + 2];
  return afterNext?.type === "whitespace" && afterNext.value === "";
}
function isNextTokenFakeSetextH2Line(path2) {
  if (!isNewLine(path2.node) || path2.next?.value !== "-") {
    return false;
  }
  const afterNext = path2.siblings[path2.index + 2];
  return !afterNext || isNewLine(afterNext);
}
function printMdast(path2, options2, print) {
  const {
    node: node2
  } = path2;
  if (shouldRemainTheSameContent(path2)) {
    const parts = [""];
    const textsNodes = splitText(options2.originalText.slice(node2.position.start.offset, node2.position.end.offset));
    for (const node3 of textsNodes) {
      if (node3.type === "word") {
        parts.push([parts.pop(), node3.value]);
        continue;
      }
      const doc = printWhitespace(path2, node3.value, options2.proseWrap, true, options2);
      if (get_doc_type_default(doc) === DOC_TYPE_STRING) {
        parts.push([parts.pop(), doc]);
        continue;
      }
      parts.push(doc, "");
    }
    return fill(parts);
  }
  switch (node2.type) {
    case "root":
      if (node2.children.length === 0) {
        return "";
      }
      return [printRoot(path2, options2, print), hardline];
    case "paragraph":
      return printParagraph(path2, options2, print);
    case "sentence":
      return printSentence(path2, print);
    case "word":
      return options2.parser !== "mdx" ? printWord(path2, options2) : printWordLegacy(path2);
    case "whitespace": {
      const {
        next
      } = path2;
      const proseWrap = (
        // leading char that may cause different syntax
        next && /^>|^(?:[*+-]|#{1,6}|\d+[).])$/.test(next.value) && // Avoid https://github.com/prettier/prettier/issues/18861
        !hasFakeWhitespaceAfterNextToken(path2) && // Next fake setext h2 `-` is going to be escaped, so no need to join adjacent words
        !(options2.proseWrap === "preserve" && isNextTokenFakeSetextH2Line(path2)) ? "never" : options2.proseWrap
      );
      return printWhitespace(path2, node2.value, proseWrap, false, options2);
    }
    case "emphasis": {
      let style;
      if (isAutolink(node2.children[0])) {
        style = options2.originalText[node2.position.start.offset];
      } else {
        const hasPrevOrNextWord = prevOrNextWord(path2);
        const inStrongAndHasPrevOrNextWord = (
          // `1***2***3` is considered strong emphasis but `1**_2_**3` is not
          path2.callParent(({
            node: node3
          }) => node3.type === "strong" && prevOrNextWord(path2))
        );
        style = hasPrevOrNextWord || inStrongAndHasPrevOrNextWord || path2.hasAncestor((node3) => node3.type === "emphasis") ? "*" : "_";
      }
      return [style, printChildren(path2, options2, print), style];
    }
    case "strong":
      return ["**", printChildren(path2, options2, print), "**"];
    case "delete":
      return ["~~", printChildren(path2, options2, print), "~~"];
    case "inlineCode": {
      let code2 = options2.proseWrap === "preserve" ? node2.value : method_replace_all_default(
        /* OPTIONAL_OBJECT: false */
        0,
        node2.value,
        "\n",
        " "
      );
      if (options2.parser !== "mdx" && path2.hasAncestor((node3) => node3.type === "tableCell")) {
        code2 = method_replace_all_default(
          /* OPTIONAL_OBJECT: false */
          0,
          code2,
          "|",
          "\\|"
        );
      }
      const backtickCount = get_min_not_present_continuous_count_default(code2, "`");
      const backtickString = "`".repeat(backtickCount);
      const padding = code2.startsWith("`") || code2.endsWith("`") || /^[\n ]/.test(code2) && /[\n ]$/.test(code2) && /[^\n ]/.test(code2) ? " " : "";
      return [backtickString, padding, code2, padding, backtickString];
    }
    case "wikiLink": {
      let contents;
      if (options2.proseWrap === "preserve") {
        contents = node2.value;
      } else {
        contents = method_replace_all_default(
          /* OPTIONAL_OBJECT: false */
          0,
          node2.value,
          /[\t\n]+/g,
          " "
        );
      }
      return ["[[", contents, "]]"];
    }
    case "link":
      switch (options2.originalText[node2.position.start.offset]) {
        case "<": {
          const mailto = "mailto:";
          const url = (
            // <hello@example.com> is parsed as { url: "mailto:hello@example.com" }
            node2.url.startsWith(mailto) && options2.originalText.slice(node2.position.start.offset + 1, node2.position.start.offset + 1 + mailto.length) !== mailto ? node2.url.slice(mailto.length) : node2.url
          );
          return ["<", url, ">"];
        }
        case "[":
          return ["[", printChildren(path2, options2, print), "](", options2.parser !== "mdx" && node2.url === "" ? "<>" : printUrl(node2.url, ")"), printTitle(node2.title, options2), ")"];
        default:
          return options2.originalText.slice(node2.position.start.offset, node2.position.end.offset);
      }
    case "image":
      return ["![", printImageAlt(node2, options2), "](", options2.parser !== "mdx" && node2.url === "" ? "<>" : printUrl(node2.url, ")"), printTitle(node2.title, options2), ")"];
    case "blockquote":
      return ["> ", align("> ", printChildren(path2, options2, print))];
    case "heading":
      return printHeading(path2, options2, print);
    case "code": {
      if (node2.isIndented) {
        const alignment = " ".repeat(4);
        return align(alignment, [alignment, replaceEndOfLine(node2.value, hardline)]);
      }
      const styleUnit = options2.__inJsTemplate ? "~" : "`";
      const style = styleUnit.repeat(Math.max(3, get_max_continuous_count_default(node2.value, styleUnit) + 1));
      return [style, node2.lang || "", node2.meta ? " " + node2.meta : "", hardline, replaceEndOfLine(options2.parser === "mdx" ? getFencedCodeBlockValue(node2, options2.originalText) : node2.value, hardline), hardline, style];
    }
    case "html": {
      const {
        parent,
        isLast
      } = path2;
      const value = parent.type === "root" && isLast ? node2.value.trimEnd() : node2.value;
      const isHtmlComment = /^<!--.*-->$/s.test(value);
      return replaceEndOfLine(value, isHtmlComment ? hardline : markAsRoot(literalline));
    }
    case "list":
      if (options2.parser === "mdx") {
        return printListLegacy(path2, options2, print);
      }
      return printList(path2, options2, print);
    case "thematicBreak": {
      const {
        ancestors
      } = path2;
      const counter = ancestors.findIndex((node3) => node3.type === "list");
      if (counter === -1) {
        return "---";
      }
      const nthSiblingIndex = getNthListSiblingIndex(ancestors[counter], ancestors[counter + 1]);
      return nthSiblingIndex % 2 === 0 ? "***" : "---";
    }
    case "linkReference":
      return ["[", printChildren(path2, options2, print), "]", node2.referenceType === "full" ? printLinkReference(node2) : node2.referenceType === "collapsed" ? "[]" : ""];
    case "imageReference": {
      const alt = printImageAlt(node2, options2);
      switch (node2.referenceType) {
        case "full":
          return ["![", alt, "]", printLinkReference(node2)];
        default:
          return [...options2.parser === "mdx" ? ["![", alt, "]"] : ["!", printLinkReference(node2)], node2.referenceType === "collapsed" ? "[]" : ""];
      }
    }
    case "definition": {
      const lineOrSpace = options2.proseWrap === "always" ? line : " ";
      return group([printLinkReference(node2), ":", indent2([lineOrSpace, options2.parser !== "mdx" && node2.url === "" ? "<>" : printUrl(node2.url), node2.title === null ? "" : [lineOrSpace, printTitle(node2.title, options2, false)]])]);
    }
    // `footnote` requires `.use(footnotes, {inlineNotes: true})`, we are not using this option
    // https://github.com/remarkjs/remark-footnotes#optionsinlinenotes
    /* c8 ignore next 2 */
    case "footnote":
      return ["[^", printChildren(path2, options2, print), "]"];
    case "footnoteReference":
      return printFootnoteReference(node2);
    case "footnoteDefinition": {
      const shouldInlineFootnote = node2.children.length === 1 && node2.children[0].type === "paragraph" && (options2.proseWrap === "never" || options2.proseWrap === "preserve" && node2.children[0].position.start.line === node2.children[0].position.end.line);
      return [printFootnoteReference(node2), ": ", shouldInlineFootnote ? printChildren(path2, options2, print) : group([align(" ".repeat(4), printChildren(path2, options2, print, {
        processor: ({
          isFirst
        }) => isFirst ? group([softline, print()]) : print()
      }))])];
    }
    case "table":
      return printTable(path2, options2, print);
    case "tableCell":
      return printChildren(path2, options2, print);
    case "break":
      return /\s/.test(options2.originalText[node2.position.start.offset]) ? ["  ", markAsRoot(literalline)] : ["\\", hardline];
    case "liquidNode":
      return replaceEndOfLine(node2.value, hardline);
    // MDX
    // fallback to the original text if multiparser failed
    // or `embeddedLanguageFormatting: "off"`
    case "import":
    case "export":
    case "jsx":
      return node2.value.trimEnd();
    case "esComment":
      return ["{/* ", node2.value, " */}"];
    case "math":
      return ["$$", node2.meta ? " " + node2.meta : "", hardline, node2.value ? [replaceEndOfLine(node2.value, hardline), hardline] : "", "$$"];
    case "inlineMath":
      return options2.originalText.slice(locStart(node2), locEnd(node2));
    case "text":
      return replaceEndOfLine(node2.value, hardline);
    case "frontMatter":
    // Handled in core
    case "tableRow":
    // handled in "table"
    case "listItem":
    // handled in "list"
    default:
      throw new unexpected_node_error_default(node2, "Markdown");
  }
}
function printRoot(path2, options2, print) {
  const ignoreRanges = [];
  let ignoreStart = null;
  const {
    children
  } = path2.node;
  for (const [index2, childNode] of children.entries()) {
    switch (isPrettierIgnore(childNode)) {
      case "start":
        if (ignoreStart === null) {
          ignoreStart = {
            index: index2,
            offset: childNode.position.end.offset
          };
        }
        break;
      case "end":
        if (ignoreStart !== null) {
          ignoreRanges.push({
            start: ignoreStart,
            end: {
              index: index2,
              offset: childNode.position.start.offset
            }
          });
          ignoreStart = null;
        }
        break;
      default:
        break;
    }
  }
  return printChildren(path2, options2, print, {
    processor({
      index: index2
    }) {
      if (ignoreRanges.length > 0) {
        const ignoreRange = ignoreRanges[0];
        if (index2 === ignoreRange.start.index) {
          return [printIgnoreComment(children[ignoreRange.start.index]), options2.originalText.slice(ignoreRange.start.offset, ignoreRange.end.offset), printIgnoreComment(children[ignoreRange.end.index])];
        }
        if (ignoreRange.start.index < index2 && index2 < ignoreRange.end.index) {
          return false;
        }
        if (index2 === ignoreRange.end.index) {
          ignoreRanges.shift();
          return false;
        }
      }
      return print();
    }
  });
}
function printIgnoreComment(node2) {
  if (node2.type === "html") {
    return node2.value;
  }
  if (node2.type === "paragraph" && Array.isArray(node2.children) && node2.children.length === 1 && node2.children[0].type === "esComment") {
    return ["{/* ", node2.children[0].value, " */}"];
  }
}
function shouldRemainTheSameContent(path2) {
  const node2 = path2.findAncestor((node3) => node3.type === "linkReference" || node3.type === "imageReference");
  return node2 && (node2.type !== "linkReference" || node2.referenceType !== "full");
}
var encodeUrl = (url, characters) => {
  for (const character of characters) {
    url = method_replace_all_default(
      /* OPTIONAL_OBJECT: false */
      0,
      url,
      character,
      encodeURIComponent(character)
    );
  }
  return url;
};
function printUrl(url, dangerousCharOrChars = []) {
  const dangerousChars = [" ", ...Array.isArray(dangerousCharOrChars) ? dangerousCharOrChars : [dangerousCharOrChars]];
  return new RegExp(dangerousChars.map((x) => escapeStringRegexp(x)).join("|")).test(url) ? `<${encodeUrl(url, "<>")}>` : url;
}
function printTitle(title, options2, printSpace = true) {
  if (!title) {
    return "";
  }
  if (printSpace) {
    return " " + printTitle(title, options2, false);
  }
  if (options2.parser === "mdx") {
    title = method_replace_all_default(
      /* OPTIONAL_OBJECT: false */
      0,
      title,
      /\\(?=["')])/g,
      ""
    );
  }
  if (title.includes('"') && title.includes("'") && !title.includes(")")) {
    return `(${title})`;
  }
  const quote = getPreferredQuote(title, options2.singleQuote);
  title = method_replace_all_default(
    /* OPTIONAL_OBJECT: false */
    0,
    title,
    "\\",
    "\\\\"
  );
  title = method_replace_all_default(
    /* OPTIONAL_OBJECT: false */
    0,
    title,
    quote,
    `\\${quote}`
  );
  return `${quote}${title}${quote}`;
}
function printLinkReference(node2, options2) {
  const label = (0, import_collapse_white_space2.default)(node2.label);
  if (options2?.parser === "mdx") {
    return `[${label}]`;
  }
  const name = method_replace_all_default(
    /* OPTIONAL_OBJECT: false */
    0,
    label,
    /[\\[\]]/g,
    (s) => `\\${s}`
  );
  return `[${name}]`;
}
function printFootnoteReference(node2) {
  return `[^${node2.label}]`;
}
function printImageAlt(node2, options2) {
  if (options2.parser !== "mdx" && node2.originalAltText) {
    return node2.originalAltText;
  }
  return node2.alt || "";
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
  getLeadingWhitespaceCount(text4) {
    const whitespaceCharacters = this.#whitespaceCharacters;
    let count = 0;
    for (let index2 = 0; index2 < text4.length && whitespaceCharacters.has(text4.charAt(index2)); index2++) {
      count++;
    }
    return count;
  }
  getTrailingWhitespaceCount(text4) {
    const whitespaceCharacters = this.#whitespaceCharacters;
    let count = 0;
    for (let index2 = text4.length - 1; index2 >= 0 && whitespaceCharacters.has(text4.charAt(index2)); index2--) {
      count++;
    }
    return count;
  }
  getLeadingWhitespace(text4) {
    const count = this.getLeadingWhitespaceCount(text4);
    return text4.slice(0, count);
  }
  getTrailingWhitespace(text4) {
    const count = this.getTrailingWhitespaceCount(text4);
    return text4.slice(text4.length - count);
  }
  hasLeadingWhitespace(text4) {
    return this.#whitespaceCharacters.has(text4.charAt(0));
  }
  hasTrailingWhitespace(text4) {
    return this.#whitespaceCharacters.has(method_at_default(
      /* OPTIONAL_OBJECT: false */
      0,
      text4,
      -1
    ));
  }
  trimStart(text4) {
    const count = this.getLeadingWhitespaceCount(text4);
    return text4.slice(count);
  }
  trimEnd(text4) {
    const count = this.getTrailingWhitespaceCount(text4);
    return text4.slice(0, text4.length - count);
  }
  trim(text4) {
    return this.trimEnd(this.trimStart(text4));
  }
  split(text4, captureWhitespace = false) {
    const pattern = `[${escapeStringRegexp([...this.#whitespaceCharacters].join(""))}]+`;
    const regexp = new RegExp(captureWhitespace ? `(${pattern})` : pattern);
    return text4.split(regexp);
  }
  hasWhitespaceCharacter(text4) {
    const whitespaceCharacters = this.#whitespaceCharacters;
    return Array.prototype.some.call(text4, (character) => whitespaceCharacters.has(character));
  }
  hasNonWhitespaceCharacter(text4) {
    const whitespaceCharacters = this.#whitespaceCharacters;
    return Array.prototype.some.call(text4, (character) => !whitespaceCharacters.has(character));
  }
  isWhitespaceOnly(text4) {
    const whitespaceCharacters = this.#whitespaceCharacters;
    return Array.prototype.every.call(text4, (character) => whitespaceCharacters.has(character));
  }
  #getMinIndentation(text4) {
    let minIndentation = Number.POSITIVE_INFINITY;
    for (const line2 of text4.split("\n")) {
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
  dedentString(text4) {
    const minIndent = this.#getMinIndentation(text4);
    return minIndent === 0 ? text4 : text4.split("\n").map((lineText) => lineText.slice(minIndent)).join("\n");
  }
};
var whitespace_utilities_default = WhitespaceUtilities;

// src/utilities/html-whitespace.js
var HTML_WHITESPACE_CHARACTERS = ["	", "\n", "\f", "\r", " "];
var htmlWhitespace = new whitespace_utilities_default(HTML_WHITESPACE_CHARACTERS);
var html_whitespace_default = htmlWhitespace;

// src/language-markdown/utilities/get-blockquote-raw-text.js
function countValueLeadingGreaterThan(line2) {
  let count = 0;
  for (const character of line2) {
    if (character === ">") {
      count++;
    } else if (character !== " " && character !== "	") {
      break;
    }
  }
  return count;
}
function removeBlockquoteMarkers(line2, greaterThanToKeep) {
  const rawBlockquoteRegexp = /[ \t]*(?:>|\\>|&gt;|&GT;|&#0*62;|&#[xX]0*3[eE];)[ \t]*/y;
  const greaterThanIndexes = [];
  let {
    lastIndex
  } = rawBlockquoteRegexp;
  let match;
  while (match = rawBlockquoteRegexp.exec(line2)) {
    greaterThanIndexes.push(match.index);
    lastIndex = rawBlockquoteRegexp.lastIndex;
  }
  if (greaterThanToKeep === 0) {
    return line2.slice(lastIndex);
  }
  const firstGreaterThanToKeep = method_at_default(
    /* OPTIONAL_OBJECT: false */
    0,
    greaterThanIndexes,
    -greaterThanToKeep
  );
  if (firstGreaterThanToKeep === null) {
    return line2;
  }
  return line2.slice(firstGreaterThanToKeep);
}
var newLineRegexp = /(?<!\\)(?:\\\\)*(?:&NewLine;|&#0*10;|&#[Xx]0*[Aa];)/g;
function getBlockquoteRawText(text4, node2) {
  const rawLines = text4.split("\n");
  const valueLines = node2.value.split("\n");
  let valueIndex = 0;
  const resultLines = rawLines.map((rawLine, index2) => {
    const valueLine = valueLines[valueIndex++];
    const decodedNewlines = rawLine.matchAll(newLineRegexp);
    valueIndex += [...decodedNewlines].length;
    if (index2 === 0) {
      return rawLine;
    }
    const valueMarkerCount = countValueLeadingGreaterThan(valueLine);
    return removeBlockquoteMarkers(rawLine, valueMarkerCount);
  });
  return resultLines.join("\n");
}

// src/language-markdown/print/preprocess.js
var isSingleCharRegex = /^\\?.$/su;
var isNewLineBlockquoteRegex = /^\n *>[ >]*$/;
function preprocess2(ast, options2) {
  if (options2.parser === "mdx") {
    ast = restoreUnescapedCharacter(ast, options2);
  } else {
    ast = addRawToText(ast, options2);
  }
  ast = mergeContinuousTexts(ast);
  if (options2.parser === "mdx") {
    ast = transformIndentedCodeblockAndMarkItsParentList(ast, options2);
  } else {
    ast = transformIndentedCodeblock(ast, options2);
  }
  if (options2.parser !== "mdx") {
    ast = markOriginalImageAndLinkAlt(ast, options2);
  }
  if (options2.parser === "mdx") {
    ast = markAlignedListLegacy(ast, options2);
  } else {
    ast = markAlignedList(ast, options2);
  }
  if (options2.parser === "mdx") {
    ast = splitTextIntoSentencesLegacy(ast);
  } else {
    ast = splitTextIntoSentences(ast);
  }
  return ast;
}
function restoreUnescapedCharacter(ast, options2) {
  return mapAst(ast, (node2) => {
    if (node2.type !== "text") {
      return node2;
    }
    const { value } = node2;
    if (value === "*" || value === "_" || // handle these cases in printer
    !isSingleCharRegex.test(value) || node2.position.end.offset - node2.position.start.offset === value.length) {
      return node2;
    }
    const text4 = options2.originalText.slice(
      node2.position.start.offset,
      node2.position.end.offset
    );
    if (isNewLineBlockquoteRegex.test(text4)) {
      return node2;
    }
    return { ...node2, value: text4 };
  });
}
function addRawToText(ast, options2) {
  return mapAst(ast, (node2) => {
    if (node2.type === "text") {
      node2.raw = options2.originalText.slice(
        node2.position.start.offset,
        node2.position.end.offset
      );
    }
    return node2;
  });
}
function mergeChildren(ast, shouldMerge, mergeNode) {
  return mapAst(ast, (node2) => {
    if (!node2.children) {
      return node2;
    }
    const children = [];
    let lastChild;
    let changed;
    for (let child of node2.children) {
      if (lastChild && shouldMerge(lastChild, child)) {
        child = mergeNode(lastChild, child);
        children.splice(-1, 1, child);
        changed || (changed = true);
      } else {
        children.push(child);
      }
      lastChild = child;
    }
    return changed ? { ...node2, children } : node2;
  });
}
function mergeContinuousTexts(ast) {
  return mergeChildren(
    ast,
    (prevNode, node2) => prevNode.type === "text" && node2.type === "text",
    (prevNode, node2) => ({
      type: "text",
      value: prevNode.value + node2.value,
      position: {
        start: prevNode.position.start,
        end: node2.position.end
      }
    })
  );
}
function splitTextIntoSentencesLegacy(ast) {
  return mapAst(ast, (node2, index2, [parentNode]) => {
    if (node2.type !== "text") {
      return node2;
    }
    let { value } = node2;
    if (parentNode.type === "paragraph") {
      if (index2 === 0) {
        value = html_whitespace_default.trimStart(value);
      }
      if (index2 === parentNode.children.length - 1) {
        value = html_whitespace_default.trimEnd(value);
      }
    }
    return {
      type: "sentence",
      position: node2.position,
      children: splitText(value)
    };
  });
}
function splitTextIntoSentences(ast) {
  const canOpenAccidentalWikiLink = /* @__PURE__ */ new Set();
  const riskyParagraphPositions = /* @__PURE__ */ new Set();
  walkAst(ast, (node2, parentStack) => {
    if (node2.type === "wikiLink") {
      markAncestors(parentStack);
      return;
    }
    if (node2.type !== "text") {
      return;
    }
    if (node2.raw.includes("[[")) {
      for (const ancestor of parentStack) {
        if (ancestor.type === "paragraph") {
          canOpenAccidentalWikiLink.add(ancestor);
        }
      }
    }
    if (node2.raw.includes("]]")) {
      markAncestors(parentStack);
    }
  });
  return mapAst(ast, (node2, index2, parentStack) => {
    if (node2.type !== "text") {
      return node2;
    }
    let text4 = node2.raw;
    const paragraphIndex = parentStack.findIndex(
      (ancestor) => ancestor?.type === "paragraph" || ancestor?.type === "heading"
    );
    const paragraphNode = paragraphIndex === -1 ? void 0 : parentStack[paragraphIndex];
    if (paragraphNode) {
      if (parentStack.slice(paragraphIndex + 1).some((ancestor) => ancestor?.type === "blockquote")) {
        text4 = getBlockquoteRawText(text4, node2);
      }
      const parentNode = parentStack[0];
      if (parentNode?.type === "paragraph") {
        if (index2 === 0) {
          text4 = html_whitespace_default.trimStart(text4);
        }
        if (index2 === parentNode.children.length - 1) {
          text4 = html_whitespace_default.trimEnd(text4);
        }
      }
    }
    if (paragraphNode && riskyParagraphPositions.has(paragraphNode.position)) {
      return {
        type: "text",
        position: node2.position,
        value: text4
      };
    }
    return {
      type: "sentence",
      position: node2.position,
      children: splitText(text4)
    };
  });
  function walkAst(ast2, handler) {
    return (function preorder(node2, parentStack) {
      handler(node2, parentStack);
      if (node2.children) {
        for (const child of node2.children) {
          preorder(child, [node2, ...parentStack]);
        }
      }
    })(ast2, []);
  }
  function markAncestors(parentStack) {
    for (const ancestor of parentStack) {
      if (ancestor.type === "paragraph" && canOpenAccidentalWikiLink.has(ancestor)) {
        riskyParagraphPositions.add(ancestor.position);
      }
    }
  }
}
function transformIndentedCodeblock(ast, options2) {
  return mapAst(ast, (node2) => {
    if (node2.type !== "code") {
      return node2;
    }
    const isIndented = /^\n?(?: {4,}|\t)/.test(
      options2.originalText.slice(
        node2.position.start.offset,
        node2.position.end.offset
      )
    );
    node2.isIndented = isIndented;
    return node2;
  });
}
function transformIndentedCodeblockAndMarkItsParentList(ast, options2) {
  return mapAst(ast, (node2, index2, parentStack) => {
    if (node2.type === "code") {
      const isIndented = /^\n?(?: {4,}|\t)/.test(
        options2.originalText.slice(
          node2.position.start.offset,
          node2.position.end.offset
        )
      );
      node2.isIndented = isIndented;
      if (isIndented) {
        for (let i = 0; i < parentStack.length; i++) {
          const parent = parentStack[i];
          if (parent.hasIndentedCodeblock) {
            break;
          }
          if (parent.type === "list") {
            parent.hasIndentedCodeblock = true;
          }
        }
      }
    }
    return node2;
  });
}
function markOriginalImageAndLinkAlt(ast, options2) {
  const { originalText } = options2;
  return mapAst(ast, (node2) => {
    if (node2.type === "image" || node2.type === "imageReference") {
      node2.originalAltText = getBracketContent(
        originalText,
        node2.position.start.offset,
        node2.position.end.offset
      );
      return node2;
    }
    if (node2.type !== "link" || !node2.url) {
      return node2;
    }
    const originalAlt = getBracketContent(
      originalText,
      node2.position.start.offset,
      node2.position.end.offset
    );
    if (originalAlt && /[[\]]/.test(originalAlt)) {
      node2.originalLabelText = originalAlt;
    }
    return node2;
  });
}
function getBracketContent(text4, startOffset, endOffset) {
  const firstBracket = text4.indexOf("[", startOffset);
  if (firstBracket === -1 || firstBracket >= endOffset) {
    return null;
  }
  let depth = 1;
  let index2 = firstBracket + 1;
  while (index2 < endOffset) {
    const char = text4[index2];
    if (char === "\\") {
      index2 += 2;
      continue;
    }
    if (char === "[") {
      depth++;
    } else if (char === "]") {
      depth--;
      if (depth === 0) {
        return text4.slice(firstBracket + 1, index2);
      }
    }
    index2++;
  }
  return null;
}
function markAlignedList(ast, options2) {
  return mapAst(ast, (node2, index2, parentStack) => {
    if (node2.type === "list" && node2.children.length > 0) {
      for (let i = 0; i < parentStack.length; i++) {
        const parent = parentStack[i];
        if (parent.type === "list" && !parent.isAligned) {
          node2.isAligned = false;
          return node2;
        }
      }
      const next = parentStack[0]?.children[index2 + 1];
      if (next?.type === "code" && next.isIndented) {
        node2.isAligned = false;
        return node2;
      }
      node2.isAligned = isAligned(node2);
    }
    return node2;
  });
  function getListItemStart(listItem) {
    return listItem.children.length === 0 ? -1 : listItem.children[0].position.start.column - 1;
  }
  function isAligned(list2) {
    if (!list2.ordered) {
      return true;
    }
    const [firstItem, secondItem] = list2.children;
    const firstInfo = getOrderedListItemInfo(firstItem, options2);
    if (firstInfo.leadingSpaces.length > 1) {
      return true;
    }
    const firstStart = getListItemStart(firstItem);
    if (firstStart === -1) {
      return false;
    }
    if (list2.children.length === 1) {
      return firstStart % options2.tabWidth === 0;
    }
    const secondStart = getListItemStart(secondItem);
    if (firstStart !== secondStart) {
      return false;
    }
    if (firstStart % options2.tabWidth === 0) {
      return true;
    }
    const secondInfo = getOrderedListItemInfo(secondItem, options2);
    return secondInfo.leadingSpaces.length > 1;
  }
}
function markAlignedListLegacy(ast, options2) {
  return mapAst(ast, (node2, index2, parentStack) => {
    if (node2.type === "list" && node2.children.length > 0) {
      for (let i = 0; i < parentStack.length; i++) {
        const parent = parentStack[i];
        if (parent.type === "list" && !parent.isAligned) {
          node2.isAligned = false;
          return node2;
        }
      }
      node2.isAligned = isAligned(node2);
    }
    return node2;
  });
  function getListItemStart(listItem) {
    return listItem.children.length === 0 ? -1 : listItem.children[0].position.start.column - 1;
  }
  function isAligned(list2) {
    if (!list2.ordered) {
      return true;
    }
    const [firstItem, secondItem] = list2.children;
    const firstInfo = getOrderedListItemInfo(firstItem, options2);
    if (firstInfo.leadingSpaces.length > 1) {
      return true;
    }
    const firstStart = getListItemStart(firstItem);
    if (firstStart === -1) {
      return false;
    }
    if (list2.children.length === 1) {
      return firstStart % options2.tabWidth === 0;
    }
    const secondStart = getListItemStart(secondItem);
    if (firstStart !== secondStart) {
      return false;
    }
    if (firstStart % options2.tabWidth === 0) {
      return true;
    }
    const secondInfo = getOrderedListItemInfo(secondItem, options2);
    return secondInfo.leadingSpaces.length > 1;
  }
}
var preprocess_default = preprocess2;

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
for (let index2 = 0; index2 <= inlineCacheCutoff; index2++) {
  FastObject();
}
function toFastproperties(object) {
  return FastObject(object);
}

// src/utilities/create-get-visitor-keys.js
function createGetVisitorKeys(visitorKeys, typeProperty = "type") {
  toFastproperties(visitorKeys);
  function getVisitorKeys2(node2) {
    const type = node2[typeProperty];
    if (false) {
      throw new Error(
        `Can't get node type, you must pass the wrong typeProperty '${typeProperty}'`
      );
    }
    const keys = visitorKeys[type];
    if (!Array.isArray(keys)) {
      throw Object.assign(new Error(`Missing visitor keys for '${type}'.`), {
        node: node2
      });
    }
    return keys;
  }
  return getVisitorKeys2;
}
var create_get_visitor_keys_default = createGetVisitorKeys;

// src/language-markdown/traverse/visitor-keys.evaluate.js
var vk = [
  ["children"]
];
var visitor_keys_evaluate_default = {
  root: vk[0],
  paragraph: vk[0],
  sentence: vk[0],
  word: [],
  whitespace: [],
  emphasis: vk[0],
  strong: vk[0],
  "delete": vk[0],
  inlineCode: [],
  wikiLink: [],
  link: vk[0],
  image: [],
  blockquote: vk[0],
  heading: vk[0],
  code: [],
  html: [],
  list: vk[0],
  thematicBreak: [],
  linkReference: vk[0],
  imageReference: [],
  definition: [],
  footnote: vk[0],
  footnoteReference: [],
  footnoteDefinition: vk[0],
  table: vk[0],
  tableCell: vk[0],
  "break": [],
  liquidNode: [],
  "import": [],
  "export": [],
  esComment: [],
  jsx: [],
  math: [],
  inlineMath: [],
  tableRow: vk[0],
  listItem: vk[0],
  text: []
};

// src/language-markdown/traverse/get-visitor-keys.js
var getVisitorKeys = create_get_visitor_keys_default(visitor_keys_evaluate_default);
var get_visitor_keys_default = getVisitorKeys;

// src/language-markdown/printers.js
var printer = {
  features: {
    experimental_frontMatterSupport: {
      massageAstNode: true,
      embed: true,
      print: true
    }
  },
  preprocess: preprocess_default,
  print: printMdast,
  embed: embed_default,
  massageAstNode,
  hasPrettierIgnore,
  insertPragma,
  getVisitorKeys: get_visitor_keys_default,
  printPrettierIgnored
};
export {
  markdown_exports as default,
  languages_evaluate_default as languages,
  options_default as options,
  parsers_exports as parsers,
  printers_exports as printers
};
