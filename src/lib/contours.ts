// Marching squares: turns a scalar field sampled on a grid into closed,
// smoothed outlines, returned as an SVG path string usable in `clip-path: path()`.
// Cells outside the grid count as empty, so every outline closes.

// For each of the 16 corner cases, the pairs of cell edges a segment joins.
// Edges: 0 top, 1 right, 2 bottom, 3 left. Corners: tl=8, tr=4, br=2, bl=1.
const SEGMENTS: number[][] = [
  [],
  [3, 2],
  [2, 1],
  [3, 1],
  [0, 1],
  [3, 0, 2, 1],
  [0, 2],
  [3, 0],
  [3, 0],
  [0, 2],
  [0, 1, 3, 2],
  [0, 1],
  [3, 1],
  [2, 1],
  [3, 2],
  [],
];

/**
 * @param field values at grid points, row-major, `cols * rows`
 * @param step  spacing between grid points in px
 * @param level contour threshold
 */
export function contourPath(field: Float32Array, cols: number, rows: number, step: number, level: number): string {
  const at = (i: number, j: number) => (i < 0 || j < 0 || i >= cols || j >= rows ? 0 : field[j * cols + i]);

  // Edge ids over a padded grid so outlines can close past the border.
  const pc = cols + 2;
  const hId = (i: number, j: number) => ((j + 1) * pc + (i + 1)) * 2;
  const vId = (i: number, j: number) => ((j + 1) * pc + (i + 1)) * 2 + 1;
  const points = new Map<number, [number, number]>();
  const links = new Map<number, number[]>();

  const edgePoint = (id: number, i: number, j: number, horizontal: boolean) => {
    if (points.has(id)) return;
    const a = at(i, j);
    const b = horizontal ? at(i + 1, j) : at(i, j + 1);
    const t = a === b ? 0.5 : Math.min(1, Math.max(0, (level - a) / (b - a)));
    points.set(id, horizontal ? [(i + t) * step, j * step] : [i * step, (j + t) * step]);
  };
  const link = (a: number, b: number) => {
    const la = links.get(a);
    if (la) la.push(b);
    else links.set(a, [b]);
    const lb = links.get(b);
    if (lb) lb.push(a);
    else links.set(b, [a]);
  };

  for (let j = -1; j < rows; j++) {
    for (let i = -1; i < cols; i++) {
      const tl = at(i, j) >= level ? 8 : 0;
      const tr = at(i + 1, j) >= level ? 4 : 0;
      const br = at(i + 1, j + 1) >= level ? 2 : 0;
      const bl = at(i, j + 1) >= level ? 1 : 0;
      const pairs = SEGMENTS[tl | tr | br | bl];
      if (pairs.length === 0) continue;

      const edges = [hId(i, j), vId(i + 1, j), hId(i, j + 1), vId(i, j)];
      edgePoint(edges[0], i, j, true);
      edgePoint(edges[1], i + 1, j, false);
      edgePoint(edges[2], i, j + 1, true);
      edgePoint(edges[3], i, j, false);
      for (let k = 0; k < pairs.length; k += 2) link(edges[pairs[k]], edges[pairs[k + 1]]);
    }
  }

  // Walk the links into closed loops, then draw each loop as a smooth curve
  // through the midpoints of its sides.
  const seen = new Set<number>();
  let path = '';
  links.forEach((_, start) => {
    if (seen.has(start)) return;
    const loop: [number, number][] = [];
    let prev = -1;
    let current = start;
    while (!seen.has(current)) {
      seen.add(current);
      loop.push(points.get(current)!);
      const next = (links.get(current) ?? []).find((n) => n !== prev && !seen.has(n));
      if (next === undefined) break;
      prev = current;
      current = next;
    }
    if (loop.length < 3) return;
    const mid = (a: [number, number], b: [number, number]) => `${((a[0] + b[0]) / 2).toFixed(1)} ${((a[1] + b[1]) / 2).toFixed(1)}`;
    path += `M${mid(loop[loop.length - 1], loop[0])}`;
    for (let k = 0; k < loop.length; k++) {
      const p = loop[k];
      path += `Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${mid(p, loop[(k + 1) % loop.length])}`;
    }
    path += 'Z';
  });
  return path;
}
