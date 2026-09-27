// Emmet abbreviation engine (pure functions, no SubT API).
//
//   expandHtml("ul>li.item$*3>a{Link $}")  → snippet body with $1, $2… tab stops
//   expandCss("m10-20!")                   → "margin: 10px 20px !important;"
//
// Output uses TextMate / VS Code snippet syntax; a leading "\t" means one indent level
// (SubT converts it to the editor's indent unit and keeps the current line's indentation).

// ─── HTML data ──────────────────────────────────────────────────────────────
const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
const INLINE = new Set(["a", "abbr", "acronym", "b", "bdi", "bdo", "big", "br", "button", "cite", "code", "data", "del", "dfn", "em",
  "i", "img", "input", "ins", "kbd", "label", "mark", "meter", "output", "q", "s", "samp", "select", "small", "span", "strong",
  "sub", "sup", "textarea", "time", "tt", "u", "var", "wbr"]);

// Block elements whose inline children stay on one line: <p><b></b><i></i></p>
const INLINE_CONTAINERS = new Set([...INLINE, "p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "td", "th", "dt", "dd", "caption", "legend", "figcaption", "summary", "title", "option"]);

// Default attributes (empty value = a tab stop)
const DEFAULT_ATTRS = {
  a: [["href", ""]], img: [["src", ""], ["alt", ""]], link: [["rel", "stylesheet"], ["href", ""]], script: [],
  input: [["type", "text"]], label: [["for", ""]], form: [["action", ""]], iframe: [["src", ""], ["frameborder", "0"]],
  embed: [["src", ""], ["type", ""]], object: [["data", ""], ["type", ""]], video: [["src", ""]], audio: [["src", ""]],
  source: [["src", ""], ["type", ""]], area: [["shape", ""], ["coords", ""], ["href", ""], ["alt", ""]],
  base: [["href", ""]], meta: [], select: [["name", ""], ["id", ""]], textarea: [["name", ""], ["id", ""], ["cols", "30"], ["rows", "10"]],
  option: [["value", ""]], abbr: [["title", ""]], acronym: [["title", ""]], bdo: [["dir", ""]], del: [["datetime", ""]],
  ins: [["datetime", ""]], time: [["datetime", ""]], q: [["cite", ""]], blockquote: [], optgroup: [["label", ""]],
  button: [], html: [["lang", "en"]], th: [], col: [], track: [["src", ""], ["kind", ""]],
};

// Aliases: expanded before parsing (like Emmet's snippets.json)
const ALIASES = {
  "a:link": "a[href=http://]", "a:mail": "a[href=mailto:]", "a:tel": "a[href=tel:+]", "a:blank": "a[href=http:// target=_blank rel=\"noopener noreferrer\"]",
  "link:css": "link[href=style.css]", "link:favicon": "link[rel=\"shortcut icon\" type=image/x-icon href=favicon.ico]",
  "link:icon": "link[rel=icon type=image/x-icon href=favicon.ico]", "link:manifest": "link[rel=manifest href=manifest.json]",
  "link:print": "link[href=print.css media=print]", "link:rss": "link[rel=alternate type=application/rss+xml title=RSS href=rss.xml]",
  "meta:utf": "meta[http-equiv=Content-Type content=\"text/html;charset=UTF-8\"]", "meta:vp": "meta[name=viewport content=\"width=device-width, initial-scale=1.0\"]",
  "meta:compat": "meta[http-equiv=X-UA-Compatible content=\"IE=edge\"]", "meta:desc": "meta[name=description content=]",
  "meta:kw": "meta[name=keywords content=]", "meta:redirect": "meta[http-equiv=refresh content=\"0; url=http://\"]",
  "script:src": "script[src]", "script:module": "script[type=module src]", "img:srcset": "img[srcset alt]",
  "form:get": "form[method=get]", "form:post": "form[method=post]",
  "inp": "input[name id]", "input:hidden": "input[type=hidden name]", "input:h": "input[type=hidden name]",
  "input:text": "inp", "input:t": "inp", "input:search": "inp[type=search]", "input:email": "inp[type=email]",
  "input:url": "inp[type=url]", "input:password": "inp[type=password]", "input:p": "inp[type=password]",
  "input:datetime": "inp[type=datetime]", "input:date": "inp[type=date]", "input:time": "inp[type=time]",
  "input:number": "inp[type=number]", "input:color": "inp[type=color]", "input:checkbox": "inp[type=checkbox]",
  "input:c": "inp[type=checkbox]", "input:radio": "inp[type=radio]", "input:r": "inp[type=radio]", "input:range": "inp[type=range]",
  "input:file": "inp[type=file]", "input:f": "inp[type=file]", "input:submit": "input[type=submit value]",
  "input:s": "input[type=submit value]", "input:image": "input[type=image src alt]", "input:button": "input[type=button value]",
  "input:b": "input[type=button value]", "input:reset": "input[type=reset value]",
  "btn": "button", "btn:s": "button[type=submit]", "btn:r": "button[type=reset]", "btn:b": "button[type=button]",
  "select:d": "select[disabled]", "opt": "option", "optg": "optgroup", "tarea": "textarea", "fset": "fieldset", "leg": "legend",
  "bq": "blockquote", "fig": "figure", "figc": "figcaption", "pic": "picture", "ifr": "iframe", "emb": "embed", "obj": "object",
  "cap": "caption", "colg": "colgroup", "art": "article", "hdr": "header", "ftr": "footer", "adr": "address", "dlg": "dialog",
  "str": "strong", "sect": "section", "sect": "section", "prog": "progress", "mn": "main", "tem": "template", "datag": "datagrid",
  "datal": "datalist", "kg": "keygen", "out": "output", "det": "details", "sum": "summary", "cmd": "command", "src": "source",
  "ol+": "ol>li", "ul+": "ul>li", "dl+": "dl>dt+dd", "map+": "map>area", "table+": "table>tr>td", "tr+": "tr>td",
  "select+": "select>option", "optgroup+": "optgroup>option", "pic+": "picture>source:src+img", "source:src": "source[srcset type]",
  "colgroup+": "colgroup>col",
};

const HTML5 = [
  "<!DOCTYPE html>",
  "<html lang=\"${1:en}\">",
  "<head>",
  "\t<meta charset=\"UTF-8\">",
  "\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">",
  "\t<title>${2:Document}</title>",
  "</head>",
  "<body>",
  "\t$0",
  "</body>",
  "</html>",
].join("\n");

const LOREM = ("lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna " +
  "aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure " +
  "in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa " +
  "qui officia deserunt mollit anim id est laborum perspiciatis unde omnis iste natus error voluptatem accusantium doloremque " +
  "laudantium totam rem aperiam eaque ipsa quae ab illo inventore veritatis quasi architecto beatae vitae dicta explicabo").split(" ");

/** Deterministic lorem ipsum: `count` words, starting with "Lorem ipsum" when `start` is 0. */
export function lorem(count, start = 0) {
  const out = [];
  for (let i = 0; i < count; i++) out.push(LOREM[(start * 7 + i) % LOREM.length]);
  let s = "";
  let sentence = 0;
  for (let i = 0; i < out.length; i++) {
    let w = out[i];
    if (sentence === 0) w = w[0].toUpperCase() + w.slice(1);
    sentence++;
    const last = i === out.length - 1;
    const end = last || (sentence >= 8 && (i * 13 + start) % 5 === 0);
    s += w + (end ? (last ? "." : ". ") : (sentence % 6 === 0 ? ", " : " "));
    if (end) sentence = 0;
  }
  return s;
}

// ─── Parser ─────────────────────────────────────────────────────────────────
// Node: { name, id, classes[], attrs[[k,v|null]], text, repeat, children[], group, implicit }

class ParseError extends Error {}

function parse(abbr) {
  let i = 0;
  const peek = () => abbr[i];
  const eof = () => i >= abbr.length;

  const readUntil = (close) => {
    const start = ++i; // skip opening char
    let depth = 0;
    const open = abbr[start - 1];
    while (i < abbr.length) {
      const c = abbr[i];
      if (c === "\\") { i += 2; continue; }
      if (c === open && open !== close) depth++;
      else if (c === close) { if (depth === 0) break; depth--; }
      i++;
    }
    if (i >= abbr.length) throw new ParseError(`missing ${close}`);
    return abbr.slice(start, i++);
  };

  const readName = () => {
    const m = /^[A-Za-z0-9_:$@!\-]*/.exec(abbr.slice(i))[0];
    i += m.length;
    return m;
  };

  const readRepeat = (node) => {
    if (peek() !== "*") return;
    i++;
    const m = /^\d*/.exec(abbr.slice(i))[0];
    i += m.length;
    node.repeat = m ? Math.max(1, Math.min(1000, +m)) : 0; // 0 = implicit (wrap each line)
  };

  const parseAttrs = (src) => {
    const out = [];
    let j = 0;
    while (j < src.length) {
      while (j < src.length && /\s/.test(src[j])) j++;
      if (j >= src.length) break;
      let k = "";
      while (j < src.length && !/[\s=]/.test(src[j])) k += src[j++];
      let v = null;
      if (src[j] === "=") {
        j++;
        if (src[j] === "\"" || src[j] === "'") {
          const q = src[j++];
          const s = j;
          while (j < src.length && src[j] !== q) j++;
          v = src.slice(s, j);
          j++;
        } else {
          const s = j;
          while (j < src.length && !/\s/.test(src[j])) j++;
          v = src.slice(s, j);
        }
      }
      let bool = false;
      if (k.endsWith(".")) { k = k.slice(0, -1); bool = true; }
      if (k) out.push([k, v, bool]);
    }
    return out;
  };

  const parseElement = () => {
    const node = { name: "", id: null, classes: [], attrs: [], text: null, repeat: 1, children: [] };
    node.name = readName();
    // "ul+", "table+"… aliases end with "+", which is also the sibling operator
    if (peek() === "+" && ALIASES[node.name + "+"] && (i + 1 >= abbr.length || /[>+^)*]/.test(abbr[i + 1]))) { node.name += "+"; i++; }
    while (!eof()) {
      const c = peek();
      if (c === "#") { i++; node.id = readName(); }
      else if (c === ".") { i++; const n = readName(); if (n) node.classes.push(n); }
      else if (c === "[") node.attrs.push(...parseAttrs(readUntil("]")));
      else if (c === "{") node.text = (node.text || "") + readUntil("}");
      else break;
    }
    if (node.name.endsWith("/")) node.name = node.name.slice(0, -1);
    readRepeat(node);
    if (!node.name && node.id == null && !node.classes.length && !node.attrs.length && node.text == null) throw new ParseError("empty element");
    return node;
  };

  const parseItem = () => {
    if (peek() === "(") {
      i++;
      const node = { group: true, repeat: 1, children: parseExpr(true) };
      if (peek() !== ")") throw new ParseError("missing )");
      i++;
      readRepeat(node);
      return node;
    }
    return parseElement();
  };

  const parseExpr = (inGroup) => {
    const root = { children: [] };
    let parent = root;
    const stack = [];
    let last = null;
    for (;;) {
      const item = parseItem();
      parent.children.push(item);
      last = item;
      if (eof() || (inGroup && peek() === ")")) break;
      const op = peek();
      if (op === ">") { i++; stack.push(parent); parent = last; }
      else if (op === "+") { i++; }
      else if (op === "^") {
        while (peek() === "^") { i++; parent = stack.pop() || root; }
      } else throw new ParseError(`unexpected "${op}"`);
    }
    return root.children;
  };

  const result = parseExpr(false);
  if (!eof()) throw new ParseError(`unexpected "${peek()}"`);
  return result;
}

// ─── Tree transforms ────────────────────────────────────────────────────────

/** Replace `$`, `$$`, `$@-`, `$@3` numbering with the repeat index. */
function numbering(s, index, count) {
  if (s == null) return s;
  return s.replace(/(\$+)(@(-)?(\d*))?/g, (m, dollars, at, rev, base) => {
    let n = index + 1;
    if (at) {
      const start = base ? +base : 1;
      n = rev ? start + (count - 1 - index) : start + index;
    }
    return String(n).padStart(dollars.length, "0");
  });
}

function implicitName(parentName) {
  switch (parentName) {
    case "ul": case "ol": case "menu": return "li";
    case "table": case "tbody": case "thead": case "tfoot": return "tr";
    case "tr": return "td";
    case "select": case "optgroup": case "datalist": return "option";
    case "colgroup": return "col";
    case "audio": case "video": case "picture": return "source";
    case "map": return "area";
    case "dl": return "dt";
    default: return INLINE.has(parentName) ? "span" : "div";
  }
}

/** Apply repeats / numbering / implicit names; returns concrete nodes. `wrapped` = lines to wrap with. */
function resolve(nodes, parentName, ctx, idx = 0, cnt = 1) {
  const out = [];
  for (const n of nodes) {
    const count = n.repeat === 0 ? (ctx.lines ? ctx.lines.length : 1) : n.repeat;
    for (let k = 0; k < count; k++) {
      const index = count > 1 || n.repeat === 0 ? k : idx;
      const total = count > 1 || n.repeat === 0 ? count : cnt;
      if (n.repeat === 0 && ctx.lines) ctx.lineFor = ctx.lines[k];
      if (n.group) { out.push(...resolve(n.children, parentName, ctx, index, total)); continue; }
      let name = numbering(n.name, index, total);
      if (!name) name = implicitName(parentName);
      const alias = ALIASES[name];
      if (alias && ctx.depth < 10) {
        ctx.depth++;
        const sub = parse(alias);
        ctx.depth--;
        // Merge the alias' first element with what the user typed on top of it (#id, .class, [attrs], {text}, children)
        const first = sub[0];
        if (first && !first.group) {
          if (n.id != null) first.id = n.id;
          first.classes.push(...n.classes);
          for (const a of n.attrs) {
            const at = first.attrs.findIndex((x) => x[0] === a[0]);
            if (at >= 0) first.attrs[at] = a; else first.attrs.push(a);
          }
          if (n.text != null) first.text = n.text;
          if (n.children.length) {
            let tail = first;
            while (tail.children.length) tail = tail.children[tail.children.length - 1];
            tail.children.push(...n.children);
          }
          first.repeat = 1;
        }
        out.push(...resolve(sub, parentName, ctx, index, total));
        continue;
      }
      const loremM = /^(lorem|lipsum)(\d*)$/.exec(name);
      if (loremM) {
        ctx.loremCount = (ctx.loremCount || 0) + 1;
        out.push({ textNode: lorem(loremM[2] ? +loremM[2] : 30, ctx.loremCount - 1) });
        continue;
      }
      if (name === "c" && !n.children.length) {
        out.push({ comment: n.text != null ? numbering(n.text, index, total) : "" });
        continue;
      }
      if (name === "!" || name === "html:5" || name === "!!!") {
        out.push({ raw: name === "!!!" ? "<!DOCTYPE html>" : HTML5 });
        continue;
      }
      const el = {
        name,
        id: n.id != null ? numbering(n.id, index, total) : null,
        classes: n.classes.map((c) => numbering(c, index, total)),
        attrs: n.attrs.map(([k, v, b]) => [numbering(k, index, total), v == null ? null : numbering(v, index, total), b]),
        text: n.text != null ? numbering(n.text, index, total) : null,
        wrap: n.repeat === 0 && ctx.lines ? ctx.lineFor : null,
        children: [],
      };
      el.children = resolve(n.children, name, ctx, index, total);
      out.push(el);
    }
  }
  return out;
}

// ─── Output ─────────────────────────────────────────────────────────────────
const esc = (s) => s.replace(/[\\$}]/g, (c) => "\\" + c);

function render(nodes, ctx, depth) {
  const lines = [];
  const indent = "\t".repeat(depth);
  const allInline = nodes.every((n) => n.textNode != null || (n.name && INLINE.has(n.name) && !hasBlock(n)));
  const pieces = nodes.map((n) => renderNode(n, ctx, depth));
  if (allInline && nodes.length > 1 && pieces.every((p) => !p.includes("\n")) && depth > 0) return [indent + pieces.join("")];
  for (const p of pieces) lines.push(...p.split("\n").map((l, i) => (i === 0 || l ? indent + l : l)));
  return lines;
}

const hasBlock = (n) => n.children && n.children.some((c) => c.raw || (c.name && (!INLINE.has(c.name) || hasBlock(c))));

function stop(ctx, def = "") {
  ctx.stop++;
  return def ? `\${${ctx.stop}:${esc(def)}}` : `\${${ctx.stop}}`;
}

function renderNode(n, ctx, depth) {
  if (n.raw) return n.raw.replace(/\$\{(\d+)(:[^}]*)?\}|\$0/g, (m, num, def) => {
    if (m === "$0") return "$0";
    return stop(ctx, def ? def.slice(1) : "");
  });
  if (n.textNode != null) return esc(n.textNode);
  if (n.comment != null) return `<!-- ${n.comment ? esc(n.comment) : stop(ctx)} -->`;
  const cls = ctx.jsx ? "className" : "class";
  const attrs = [];
  if (n.id != null) attrs.push(["id", n.id]);
  if (n.classes.length) attrs.push([cls, n.classes.join(" ")]);
  // Defaults first (a user value replaces the default in place), then the other attributes typed
  const list = (DEFAULT_ATTRS[n.name] || []).map(([k, v]) => [k, v, false]);
  for (const a of n.attrs) {
    const at = list.findIndex((x) => x[0] === a[0]);
    if (at >= 0) list[at] = a; else list.push(a);
  }
  for (const a of list) if (!(a[0] === "id" && n.id != null)) attrs.push(a);
  const attrText = attrs.map(([k, v, bool]) => {
    if (bool) return ` ${k}`;
    if (v == null || v === "") return ` ${k}="${stop(ctx)}"`;
    return ` ${k}="${esc(v)}"`;
  }).join("");
  const open = `<${n.name}${attrText}`;
  if (VOID.has(n.name) && !n.children.length && n.text == null) return open + (ctx.selfClose ? " />" : ">");
  const close = `</${n.name}>`;
  const text = n.text != null ? esc(n.text) : "";
  const wrapLines = n.wrap != null ? [n.wrap] : ctx.wrapHere(n) ? ctx.lines : null;
  if (wrapLines) {
    const content = wrapLines.map(esc);
    if (!n.children.length && content.length === 1 && !content[0].includes("\n") && (INLINE.has(n.name) || n.wrap != null)) return `${open}>${text}${content[0]}${close}`;
    return [`${open}>${text}`, ...content.map((l) => (l ? "\t" + l : l)), close].join("\n");
  }
  if (!n.children.length) return `${open}>${text || stop(ctx)}${close}`;
  const inner = render(n.children, ctx, 1);
  const block = hasBlock(n) || inner.length > 1 ||
    (n.children.length > 1 && !INLINE_CONTAINERS.has(n.name) && !n.children.every((c) => c.textNode != null));
  if (!block) return `${open}>${text}${inner.join("\n").trim()}${close}`;
  return [`${open}>${text}`, ...inner, close].join("\n");
}

/** Options: { jsx, selfClose, wrap: string[] (lines to wrap), xml }. Returns a snippet body. Throws on invalid input. */
export function expandHtml(abbr, options = {}) {
  abbr = abbr.trim();
  if (!abbr) throw new ParseError("empty abbreviation");
  const ctx = { stop: 0, depth: 0, jsx: !!options.jsx, selfClose: !!(options.selfClose || options.jsx || options.xml),
    lines: options.wrap || null, wrapHere: () => false };
  const tree = parse(abbr);
  const resolved = resolve(tree, "", ctx);
  if (options.wrap) {
    // Without an implicit repeat (li*) the whole selection goes into the deepest last element
    const hasImplicit = JSON.stringify(tree).includes("\"repeat\":0");
    if (!hasImplicit) {
      let target = resolved[resolved.length - 1];
      while (target && target.children && target.children.length) target = target.children[target.children.length - 1];
      if (target && target.name) ctx.wrapHere = (n) => n === target;
    }
  }
  let out = render(resolved, ctx, 0).join("\n");
  if (ctx.stop === 0 && !out.includes("$0")) out += "$0";
  return out;
}

// ─── CSS ────────────────────────────────────────────────────────────────────
const CSS_PROPS = {
  pos: "position", t: "top", r: "right", b: "bottom", l: "left", z: "z-index", fl: "float", cl: "clear", d: "display",
  v: "visibility", ov: "overflow", ovx: "overflow-x", ovy: "overflow-y", zoo: "zoom", zm: "zoom", cp: "clip", rsz: "resize", cur: "cursor",
  m: "margin", mt: "margin-top", mr: "margin-right", mb: "margin-bottom", ml: "margin-left",
  p: "padding", pt: "padding-top", pr: "padding-right", pb: "padding-bottom", pl: "padding-left",
  bxz: "box-sizing", bxsh: "box-shadow", w: "width", h: "height", maw: "max-width", mah: "max-height", miw: "min-width", mih: "min-height",
  ac: "align-content", ai: "align-items", as: "align-self", jc: "justify-content", ji: "justify-items", js: "justify-self",
  fx: "flex", fxd: "flex-direction", fxw: "flex-wrap", fxf: "flex-flow", fxg: "flex-grow", fxsh: "flex-shrink", fxb: "flex-basis",
  ord: "order", g: "gap", gg: "grid-gap", rg: "row-gap", cg: "column-gap", gtc: "grid-template-columns", gtr: "grid-template-rows",
  gta: "grid-template-areas", gc: "grid-column", gr: "grid-row", ga: "grid-area",
  f: "font", fw: "font-weight", fs: "font-style", fz: "font-size", ff: "font-family", fv: "font-variant", lh: "line-height",
  ta: "text-align", td: "text-decoration", ti: "text-indent", tt: "text-transform", tov: "text-overflow", tsh: "text-shadow",
  va: "vertical-align", ws: "white-space", wob: "word-break", wow: "word-wrap", lts: "letter-spacing", c: "color", op: "opacity",
  bg: "background", bgc: "background-color", bgi: "background-image", bgr: "background-repeat", bgp: "background-position",
  bgsz: "background-size", bga: "background-attachment", bd: "border", bdt: "border-top", bdr: "border-right", bdb: "border-bottom",
  bdl: "border-left", bdc: "border-color", bds: "border-style", bdw: "border-width", bdrs: "border-radius", bdcl: "border-collapse",
  ol: "outline", olo: "outline-offset", lis: "list-style", lisp: "list-style-position", list: "list-style-type", trf: "transform",
  trs: "transition", trsdu: "transition-duration", trsp: "transition-property", trstf: "transition-timing-function",
  anim: "animation", animn: "animation-name", animdel: "animation-delay", animdur: "animation-duration", con: "content",
  q: "quotes", us: "user-select", pe: "pointer-events", ci: "caret-color", objf: "object-fit", objp: "object-position",
  fil: "filter", bf: "backdrop-filter", tbl: "table-layout", ct: "content", ap: "appearance", scb: "scroll-behavior",
  wc: "will-change", ins: "inset", ar: "aspect-ratio", mix: "mix-blend-mode",
};
const CSS_KEYWORDS = {
  position: { s: "static", a: "absolute", r: "relative", f: "fixed", st: "sticky" },
  display: { n: "none", b: "block", i: "inline", ib: "inline-block", f: "flex", if: "inline-flex", g: "grid", ig: "inline-grid",
    t: "table", tc: "table-cell", tr: "table-row", li: "list-item", c: "contents" },
  float: { n: "none", l: "left", r: "right" }, clear: { n: "none", l: "left", r: "right", b: "both" },
  visibility: { v: "visible", h: "hidden", c: "collapse" },
  overflow: { v: "visible", h: "hidden", s: "scroll", a: "auto" }, "overflow-x": { v: "visible", h: "hidden", s: "scroll", a: "auto" },
  "overflow-y": { v: "visible", h: "hidden", s: "scroll", a: "auto" },
  cursor: { a: "auto", d: "default", p: "pointer", t: "text", h: "help", m: "move", na: "not-allowed", g: "grab" },
  "box-sizing": { bb: "border-box", cb: "content-box" },
  "align-items": { c: "center", fs: "flex-start", fe: "flex-end", s: "stretch", b: "baseline" },
  "align-content": { c: "center", fs: "flex-start", fe: "flex-end", s: "stretch", sb: "space-between", sa: "space-around" },
  "align-self": { c: "center", fs: "flex-start", fe: "flex-end", s: "stretch", b: "baseline", a: "auto" },
  "justify-content": { c: "center", fs: "flex-start", fe: "flex-end", sb: "space-between", sa: "space-around", se: "space-evenly" },
  "flex-direction": { r: "row", rr: "row-reverse", c: "column", cr: "column-reverse" },
  "flex-wrap": { n: "nowrap", w: "wrap", wr: "wrap-reverse" },
  "font-weight": { n: "normal", b: "bold", br: "bolder", lr: "lighter" }, "font-style": { n: "normal", i: "italic", o: "oblique" },
  "text-align": { l: "left", r: "right", c: "center", j: "justify" },
  "text-decoration": { n: "none", u: "underline", o: "overline", l: "line-through" },
  "text-transform": { n: "none", u: "uppercase", l: "lowercase", c: "capitalize" },
  "vertical-align": { t: "top", m: "middle", b: "bottom", bl: "baseline", sup: "super", sub: "sub" },
  "white-space": { n: "normal", nw: "nowrap", p: "pre", pw: "pre-wrap", pl: "pre-line" },
  "word-break": { n: "normal", k: "keep-all", ba: "break-all", bw: "break-word" },
  "background-repeat": { n: "no-repeat", x: "repeat-x", y: "repeat-y", r: "repeat" },
  "background-size": { a: "auto", cv: "cover", ct: "contain" }, "object-fit": { cv: "cover", ct: "contain", f: "fill", n: "none" },
  "border-style": { n: "none", s: "solid", d: "dashed", dt: "dotted", db: "double" },
  "border-collapse": { c: "collapse", s: "separate" }, "list-style-type": { n: "none", d: "disc", c: "circle", s: "square", dc: "decimal" },
  "user-select": { n: "none", a: "auto", t: "text", al: "all" }, "pointer-events": { n: "none", a: "auto" },
  "table-layout": { a: "auto", f: "fixed" }, resize: { n: "none", b: "both", h: "horizontal", v: "vertical" },
};
const UNITLESS = new Set(["z-index", "opacity", "line-height", "flex", "flex-grow", "flex-shrink", "order", "font-weight", "zoom"]);
const UNITS = { p: "%", e: "em", r: "rem", x: "ex", w: "vw", h: "vh", pt: "pt", px: "px", ms: "ms", s: "s", deg: "deg", fr: "fr" };
const CSS_SPECIAL = {
  "bd+": "border: ${1:1px} ${2:solid} ${3:#000};", "bdt+": "border-top: ${1:1px} ${2:solid} ${3:#000};",
  "bdb+": "border-bottom: ${1:1px} ${2:solid} ${3:#000};", "bdl+": "border-left: ${1:1px} ${2:solid} ${3:#000};",
  "bdr+": "border-right: ${1:1px} ${2:solid} ${3:#000};", "bg+": "background: ${1:#fff} url(${2}) ${3:0} ${4:0} ${5:no-repeat};",
  "trs+": "transition: ${1:prop} ${2:time};", "fz+": "font-size: ${1:16px};", "ff+": "font-family: ${1:Arial}, ${2:sans-serif};",
  "bxsh+": "box-shadow: ${1:0} ${2:0} ${3:0} ${4:#000};", "@m": "@media ${1:screen} {\n\t$0\n}", "@media": "@media ${1:screen} {\n\t$0\n}",
  "@i": "@import url(${1});", "@import": "@import url(${1});", "@f": "@font-face {\n\tfont-family: ${1};\n\tsrc: url(${2});\n}",
  "@kf": "@keyframes ${1:name} {\n\t$0\n}", "!": "!important", "cf": "&::after {\n\tcontent: \"\";\n\tdisplay: table;\n\tclear: both;\n}",
  "cnt": "content: \"${1}\";", "con": "content: \"${1}\";",
};

function expandColor(v) {
  const m = /^#([0-9a-fA-F]{1,6})$/.exec(v);
  if (!m) return v;
  const h = m[1];
  if (h.length === 1) return "#" + h.repeat(6);
  if (h.length === 2) return "#" + h.repeat(3);
  if (h.length === 3 || h.length === 6) return "#" + h;
  return "#" + h;
}

function cssValue(prop, raw) {
  // "10-20" → 10px 20px ; "-10" → -10px ; "1.5e" → 1.5em ; "#f" → #ffffff ; "a" → auto
  const parts = [];
  const re = /(-?\d*\.?\d+)([a-z%]*)|(#[0-9a-fA-F]{1,6})|([a-zA-Z]+)/g;
  let m;
  const tokens = raw.replace(/(\d)-(?=\d|\.)/g, "$1 ").replace(/(\d[a-z%]*)-(?=[#a-zA-Z-])/g, "$1 ").split(/\s+/).filter(Boolean);
  for (const tok of tokens) {
    re.lastIndex = 0;
    m = re.exec(tok);
    if (!m || m.index !== 0 || m[0].length !== tok.length) { parts.push(tok); continue; }
    if (m[1] !== undefined) {
      const unit = m[2] ? (UNITS[m[2]] || m[2]) : (UNITLESS.has(prop) || m[1] === "0" ? "" : (/\./.test(m[1]) && !prop.includes("width") && !prop.includes("height") && !/^(margin|padding|font-size|top|left|right|bottom)/.test(prop) ? "em" : "px"));
      parts.push(m[1] + unit);
    } else if (m[3]) parts.push(expandColor(m[3]));
    else {
      const kw = CSS_KEYWORDS[prop] && CSS_KEYWORDS[prop][m[4]];
      parts.push(kw || ({ a: "auto", i: "inherit", n: "none", t: "transparent" })[m[4]] || m[4]);
    }
  }
  return parts.join(" ");
}

/** One CSS abbreviation (no "+" joining). Returns snippet text, or null if unknown. */
function expandCssOne(abbr, stops) {
  if (CSS_SPECIAL[abbr]) return CSS_SPECIAL[abbr];
  let important = false;
  if (abbr.endsWith("!")) { important = true; abbr = abbr.slice(0, -1); }
  const imp = important ? " !important" : "";
  // prop:value  (pos:a, d:ib, c:#f00)
  let m = /^([a-z-]+):(.+)$/.exec(abbr);
  if (m && CSS_PROPS[m[1]]) {
    const prop = CSS_PROPS[m[1]];
    return `${prop}: ${esc(cssValue(prop, m[2]))}${imp};`;
  }
  // prop + number/colour value (m10, p10-20, c#f, w100p, lh1.5, z10)
  m = /^([a-z]+?)(-?\.?\d.*|#[0-9a-fA-F]+)$/.exec(abbr);
  if (m && CSS_PROPS[m[1]]) {
    const prop = CSS_PROPS[m[1]];
    return `${prop}: ${esc(cssValue(prop, m[2]))}${imp};`;
  }
  // exact property (m → margin: |;)
  if (CSS_PROPS[abbr]) { stops.n++; return `${CSS_PROPS[abbr]}: \${${stops.n}}${imp};`; }
  // compressed prop+keyword (db, posa, tac, fwb, jcsb, dib)
  for (let k = abbr.length - 1; k > 0; k--) {
    const prop = CSS_PROPS[abbr.slice(0, k)];
    const kw = prop && CSS_KEYWORDS[prop] && CSS_KEYWORDS[prop][abbr.slice(k)];
    if (kw) return `${prop}: ${kw}${imp};`;
  }
  // full property name typed (color, margin-top)
  if (/^[a-z]+(-[a-z]+)+$|^[a-z]{4,}$/.test(abbr) && Object.values(CSS_PROPS).includes(abbr)) { stops.n++; return `${abbr}: \${${stops.n}}${imp};`; }
  return null;
}

/** "m10+p5" → two declarations. Returns a snippet body, or null when not a CSS abbreviation. */
export function expandCss(abbr) {
  abbr = abbr.trim();
  if (!abbr) return null;
  if (CSS_SPECIAL[abbr]) return CSS_SPECIAL[abbr];
  const stops = { n: 0 };
  const parts = abbr.split(/\+(?=[a-z@])/);
  const out = [];
  for (const p of parts) {
    const r = expandCssOne(p, stops);
    if (r == null) return null;
    out.push(r);
  }
  return out.join("\n");
}

// ─── Extracting the abbreviation before the caret ───────────────────────────

/** Abbreviation that ends at `col` in `line` (HTML mode) → { start, abbr } or null. */
export function extractHtmlAbbreviation(line, col) {
  let i = col;
  let depth = 0;
  while (i > 0) {
    const c = line[i - 1];
    if (c === "]" || c === "}" || c === ")") depth++;
    else if (c === "[" || c === "{" || c === "(") { if (depth === 0) break; depth--; }
    else if (depth === 0) {
      if (/\s/.test(c) || c === "<" || c === "\"" || c === "'" || c === "`" || c === ";" || c === ",") break;
      // ">" that closes a tag ("<p>ul>li") ends the abbreviation
      if (c === ">" && /<[^<>]*$/.test(line.slice(0, i - 1))) break;
    }
    i--;
  }
  let abbr = line.slice(i, col);
  // Drop a leading ">" / "+" left by the tag scan
  while (abbr && /^[>+^]/.test(abbr)) { abbr = abbr.slice(1); i++; }
  return abbr ? { start: i, abbr } : null;
}

/** CSS abbreviation before `col` → { start, abbr } or null. */
export function extractCssAbbreviation(line, col) {
  let i = col;
  while (i > 0 && /[A-Za-z0-9#:+!.%@\-]/.test(line[i - 1])) i--;
  const abbr = line.slice(i, col);
  return abbr ? { start: i, abbr } : null;
}

// ─── Tag matching (balance, remove tag, go to matching) ─────────────────────

/** All matched tag pairs in an HTML text: { name, open:[s,e], close:[s,e]|null } (offsets). */
export function tagPairs(text) {
  const pairs = [];
  const stack = [];
  const re = /<!--[\s\S]*?-->|<(\/?)([A-Za-z][\w:.-]*)((?:\s+[^\s"'>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>/g;
  let m;
  while ((m = re.exec(text))) {
    if (!m[2]) continue; // comment
    const name = m[2].toLowerCase();
    const range = [m.index, m.index + m[0].length];
    if (m[1]) {
      for (let k = stack.length - 1; k >= 0; k--) {
        if (stack[k].name === name) {
          const open = stack.splice(k)[0];
          pairs.push({ name, open: open.range, close: range });
          break;
        }
      }
    } else if (m[4] || VOID.has(name)) pairs.push({ name, open: range, close: null });
    else {
      stack.push({ name, range });
      if (name === "script" || name === "style") {
        const end = text.toLowerCase().indexOf(`</${name}`, re.lastIndex);
        if (end >= 0) re.lastIndex = end;
      }
    }
  }
  return pairs;
}

/** Innermost pair whose outer range contains [from, to]. */
export function enclosingPair(pairs, from, to, strict = false) {
  let best = null;
  for (const p of pairs) {
    const s = p.open[0], e = p.close ? p.close[1] : p.open[1];
    const inside = strict ? (s <= from && to <= e && (s < from || to < e)) : (s <= from && to <= e);
    if (inside && (!best || e - s < (best.close ? best.close[1] : best.open[1]) - best.open[0])) best = p;
  }
  return best;
}

export { ParseError };
