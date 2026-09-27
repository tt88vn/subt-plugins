// Offset ↔ { line, character } conversion for text from Editor.getText() ("\n", "\r\n" or "\r" line ends).

function lineStarts(text) {
  const starts = [0];
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c === 13) { if (text.charCodeAt(i + 1) === 10) i++; starts.push(i + 1); }
    else if (c === 10) starts.push(i + 1);
  }
  return starts;
}

let cacheText = null, cacheStarts = null;
function starts(text) {
  if (text !== cacheText) { cacheText = text; cacheStarts = lineStarts(text); }
  return cacheStarts;
}

export function offsetAt(text, pos) {
  const s = starts(text);
  const line = Math.max(0, Math.min(pos.line, s.length - 1));
  return Math.min(s[line] + pos.character, line + 1 < s.length ? s[line + 1] : text.length);
}

export function positionAt(text, offset) {
  const s = starts(text);
  let lo = 0, hi = s.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (s[mid] <= offset) lo = mid; else hi = mid - 1;
  }
  return { line: lo, character: offset - s[lo] };
}

/** One edit covering only what changed between `before` and `after` (keeps undo and the view stable). */
export function diffEdit(before, after) {
  let a = 0;
  const max = Math.min(before.length, after.length);
  while (a < max && before.charCodeAt(a) === after.charCodeAt(a)) a++;
  let b = 0;
  while (b < max - a && before.charCodeAt(before.length - 1 - b) === after.charCodeAt(after.length - 1 - b)) b++;
  if (a === before.length && a === after.length) return null;
  return { range: { start: positionAt(before, a), end: positionAt(before, before.length - b) }, text: after.slice(a, after.length - b) };
}
