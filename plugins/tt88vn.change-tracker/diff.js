// Line diff (Myers O(ND)) and unified-diff output (pure functions, no SubT API).

/**
 * Diff two line arrays → list of changes { aStart, aEnd, bStart, bEnd } (half-open, 0-based):
 * lines a[aStart..aEnd) were replaced by b[bStart..bEnd). Pure insertions have aStart === aEnd, deletions bStart === bEnd.
 */
export function diffLines(a, b) {
  // Trim the common prefix / suffix first (the usual case is a few edits in a big file)
  let pre = 0;
  while (pre < a.length && pre < b.length && a[pre] === b[pre]) pre++;
  let suf = 0;
  while (suf < a.length - pre && suf < b.length - pre && a[a.length - 1 - suf] === b[b.length - 1 - suf]) suf++;
  const A = a.slice(pre, a.length - suf), B = b.slice(pre, b.length - suf);
  const ops = myers(A, B);
  // Group consecutive non-equal ops into changes
  const changes = [];
  let i = 0, j = 0, cur = null;
  for (const op of ops) {
    if (op === "=") {
      if (cur) { changes.push(cur); cur = null; }
      i++; j++;
    } else {
      if (!cur) cur = { aStart: i + pre, aEnd: i + pre, bStart: j + pre, bEnd: j + pre };
      if (op === "-") { i++; cur.aEnd = i + pre; } else { j++; cur.bEnd = j + pre; }
    }
  }
  if (cur) changes.push(cur);
  return changes;
}

/** Myers shortest edit script → array of "=", "-", "+". */
function myers(a, b) {
  const n = a.length, m = b.length;
  if (!n) return new Array(m).fill("+");
  if (!m) return new Array(n).fill("-");
  const max = n + m;
  const off = max;
  let v = new Int32Array(2 * max + 2);
  const trace = [];
  let found = false;
  // Each step keeps a copy of v: stay within ~16 MB, else report the whole block as replaced
  const budget = Math.max(64, Math.floor(4_000_000 / (2 * max + 2)));
  for (let d = 0; d <= max && !found; d++) {
    if (d > budget) return [...new Array(n).fill("-"), ...new Array(m).fill("+")];
    trace.push(v.slice());
    for (let k = -d; k <= d; k += 2) {
      let x;
      if (k === -d || (k !== d && v[off + k - 1] < v[off + k + 1])) x = v[off + k + 1];
      else x = v[off + k - 1] + 1;
      let y = x - k;
      while (x < n && y < m && a[x] === b[y]) { x++; y++; }
      v[off + k] = x;
      if (x >= n && y >= m) { found = true; break; }
    }
  }
  trace.push(v.slice());
  // Backtrack
  const ops = [];
  let x = n, y = m;
  for (let d = trace.length - 2; d >= 0 && (x > 0 || y > 0); d--) {
    const vv = trace[d];
    const k = x - y;
    let prevK;
    if (k === -d || (k !== d && vv[off + k - 1] < vv[off + k + 1])) prevK = k + 1; else prevK = k - 1;
    const prevX = vv[off + prevK], prevY = prevX - prevK;
    while (x > prevX && y > prevY) { ops.push("="); x--; y--; }
    if (d > 0) { if (x === prevX) { ops.push("+"); y--; } else { ops.push("-"); x--; } }
  }
  while (x > 0 && y > 0) { ops.push("="); x--; y--; }
  return ops.reverse();
}

/** Kind of a change: "added" | "deleted" | "modified". */
export const kind = (c) => (c.aStart === c.aEnd ? "added" : c.bStart === c.bEnd ? "deleted" : "modified");

/** Unified diff text ("--- a", "+++ b", "@@ -1,3 +1,4 @@" …). */
export function unified(a, b, changes, { from = "a", to = "b", context = 3 } = {}) {
  if (!changes.length) return "";
  const out = [`--- ${from}`, `+++ ${to}`];
  // Merge changes whose context overlaps into hunks
  const hunks = [];
  for (const c of changes) {
    const last = hunks[hunks.length - 1];
    if (last && c.aStart - last[last.length - 1].aEnd <= context * 2) last.push(c); else hunks.push([c]);
  }
  for (const h of hunks) {
    const first = h[0], lastC = h[h.length - 1];
    const aS = Math.max(0, first.aStart - context), aE = Math.min(a.length, lastC.aEnd + context);
    const bS = Math.max(0, first.bStart - context), bE = Math.min(b.length, lastC.bEnd + context);
    const range = (s, e) => (e - s === 1 ? `${s + 1}` : `${e - s === 0 ? s : s + 1},${e - s}`);
    out.push(`@@ -${range(aS, aE)} +${range(bS, bE)} @@`);
    let i = aS;
    for (const c of h) {
      while (i < c.aStart) out.push(" " + a[i++]);
      for (let k = c.aStart; k < c.aEnd; k++) out.push("-" + a[k]);
      for (let k = c.bStart; k < c.bEnd; k++) out.push("+" + b[k]);
      i = c.aEnd;
    }
    while (i < aE) out.push(" " + a[i++]);
  }
  return out.join("\n") + "\n";
}

/** "+3 −1" style totals. */
export function stats(changes) {
  let add = 0, del = 0;
  for (const c of changes) { add += c.bEnd - c.bStart; del += c.aEnd - c.aStart; }
  return { add, del, hunks: changes.length };
}
