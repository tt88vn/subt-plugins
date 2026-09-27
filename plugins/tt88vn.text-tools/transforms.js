// Pure text transforms (no SubT API) — easy to test.

/** Split "someHTTPValue_x-y z" into ["some", "HTTP", "Value", "x", "y", "z"]. */
export function words(s) {
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/[^A-Za-z0-9À-ɏḀ-ỿ]+/)
    .filter(Boolean);
}

const cap = (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();

export const camelCase = (s) => words(s).map((w, i) => (i === 0 ? w.toLowerCase() : cap(w))).join("");
export const pascalCase = (s) => words(s).map(cap).join("");
export const snakeCase = (s) => words(s).map((w) => w.toLowerCase()).join("_");
export const constantCase = (s) => words(s).map((w) => w.toUpperCase()).join("_");
export const kebabCase = (s) => words(s).map((w) => w.toLowerCase()).join("-");

// UTF-8 aware Base64 (QuickJS has no btoa/atob or TextEncoder)
const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function utf8Bytes(s) {
  const out = [];
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (c < 0x80) out.push(c);
    else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
    else if (c < 0x10000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    else out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
  }
  return out;
}

function utf8Decode(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length;) {
    const b = bytes[i];
    let c, n;
    if (b < 0x80) { c = b; n = 1; }
    else if (b >> 5 === 6) { c = b & 31; n = 2; }
    else if (b >> 4 === 14) { c = b & 15; n = 3; }
    else if (b >> 3 === 30) { c = b & 7; n = 4; }
    else throw new Error("invalid UTF-8");
    for (let k = 1; k < n; k++) {
      if (i + k >= bytes.length || bytes[i + k] >> 6 !== 2) throw new Error("invalid UTF-8");
      c = (c << 6) | (bytes[i + k] & 63);
    }
    s += String.fromCodePoint(c);
    i += n;
  }
  return s;
}

export function base64Encode(s) {
  const b = utf8Bytes(s);
  let out = "";
  for (let i = 0; i < b.length; i += 3) {
    const n = (b[i] << 16) | ((b[i + 1] ?? 0) << 8) | (b[i + 2] ?? 0);
    out += B64[(n >> 18) & 63] + B64[(n >> 12) & 63] + (i + 1 < b.length ? B64[(n >> 6) & 63] : "=") + (i + 2 < b.length ? B64[n & 63] : "=");
  }
  return out;
}

export function base64Decode(s) {
  const clean = s.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/").replace(/=+$/, "");
  if (/[^A-Za-z0-9+/]/.test(clean) || clean.length % 4 === 1) throw new Error("not valid Base64");
  const bytes = [];
  for (let i = 0; i < clean.length; i += 4) {
    const n = (B64.indexOf(clean[i]) << 18) | (B64.indexOf(clean[i + 1]) << 12) |
      ((clean[i + 2] ? B64.indexOf(clean[i + 2]) : 0) << 6) | (clean[i + 3] ? B64.indexOf(clean[i + 3]) : 0);
    bytes.push((n >> 16) & 255);
    if (clean[i + 2]) bytes.push((n >> 8) & 255);
    if (clean[i + 3]) bytes.push(n & 255);
  }
  return utf8Decode(bytes);
}

export const jsonEscape = (s) => JSON.stringify(s).slice(1, -1);
export const jsonUnescape = (s) => JSON.parse(`"${s.replace(/^"|"$/g, "")}"`);

export function stats(s) {
  return {
    lines: s.length === 0 ? 0 : s.split("\n").length,
    words: (s.match(/\S+/g) || []).length,
    characters: [...s].length,
  };
}
