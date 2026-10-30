/**
 * Constellation geometry for the Off the clock page. Each figure is a set of strokes (polylines);
 * stars sit on the stroke vertices. Units are arbitrary and scaled by the SVG viewBox.
 */

export type Pt = [number, number];
export type Stroke = Pt[];

export interface Figure {
  width: number;
  height: number;
  strokes: Stroke[];
  /** Extra stars that aren't on a line (e.g. the ball). */
  loose?: Pt[];
}

function ellipse(cx: number, cy: number, rx: number, ry: number, n = 9): Stroke {
  const pts: Stroke = [];
  for (let k = 0; k <= n; k++) {
    const a = -Math.PI / 2 + (k / n) * Math.PI * 2;
    pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
  }
  return pts;
}

/** Capital Greek letters in a 100-unit-tall box. */
const LETTERS: Record<string, { width: number; strokes: Stroke[] }> = {
  Ε: { width: 50, strokes: [[[50, 0], [0, 0], [0, 100], [50, 100]], [[0, 50], [38, 50]]] },
  Υ: { width: 60, strokes: [[[0, 0], [30, 46]], [[60, 0], [30, 46], [30, 100]]] },
  Θ: { width: 64, strokes: [ellipse(32, 50, 32, 50), [[14, 50], [50, 50]]] },
  Μ: { width: 72, strokes: [[[0, 100], [0, 0], [36, 58], [72, 0], [72, 100]]] },
  Ι: { width: 16, strokes: [[[8, 0], [8, 50], [8, 100]]] },
  Ο: { width: 64, strokes: [ellipse(32, 50, 32, 50)] },
  Σ: { width: 56, strokes: [[[56, 0], [0, 0], [32, 50], [0, 100], [56, 100]]] },
};

export function word(text: string, gap = 34): Figure & { letters: { start: number; strokes: number }[] } {
  let x = 0;
  const strokes: Stroke[] = [];
  const letters: { start: number; strokes: number }[] = [];
  for (const ch of text) {
    const glyph = LETTERS[ch];
    if (!glyph) throw new Error(`No constellation glyph for ${ch}`);
    letters.push({ start: strokes.length, strokes: glyph.strokes.length });
    for (const s of glyph.strokes) strokes.push(s.map(([px, py]) => [px + x, py] as Pt));
    x += glyph.width + gap;
  }
  return { width: x - gap, height: 100, strokes, letters };
}

/** The Stoa: a porch (pediment, columns, steps), the building Stoicism is named after. */
export const STOA: Figure = {
  width: 120,
  height: 90,
  strokes: [
    [[8, 34], [60, 8], [112, 34], [8, 34]],
    [[22, 34], [22, 78]],
    [[46, 34], [46, 78]],
    [[74, 34], [74, 78]],
    [[98, 34], [98, 78]],
    [[4, 84], [116, 84]],
  ],
};

/** The pitch: a goal, with a ball curving into the top corner. */
export const PITCH: Figure = {
  width: 120,
  height: 96,
  strokes: [
    [[14, 60], [14, 14], [106, 14], [106, 60]],
    [[14, 14], [30, 30], [90, 30], [106, 14]],
  ],
  loose: [[48, 88]],
};
/** The curved shot, drawn dashed from the ball to the net. */
export const PITCH_SHOT = "M48,88 C70,80 92,56 92,26";

/** Italy and Greece traced from approximate coastline coordinates (lon, lat). */
const ITALY: [number, number][] = [
  [7.0, 45.9], [10.5, 46.6], [13.7, 46.5], [12.3, 45.3], [13.6, 43.6], [16.0, 41.9], [18.5, 40.1],
  [16.9, 40.4], [16.5, 38.9], [15.6, 38.0], [15.7, 40.0], [14.3, 40.8], [12.5, 41.7], [10.5, 42.9],
  [9.9, 44.1], [8.8, 44.4], [7.5, 43.8], [7.0, 45.9],
];
const SICILY: [number, number][] = [[12.4, 38.1], [15.6, 38.2], [15.1, 36.7], [12.4, 38.1]];
const GREECE: [number, number][] = [
  [20.0, 39.7], [21.1, 38.3], [21.3, 37.6], [21.9, 36.8], [22.5, 36.4], [22.9, 37.4], [23.2, 36.5],
  [23.8, 37.8], [24.0, 38.2], [22.8, 39.3], [22.9, 40.6], [24.4, 40.9], [26.3, 41.0], [26.3, 41.7],
  [23.0, 41.3], [21.0, 40.8], [20.0, 39.7],
];
const CRETE: [number, number][] = [[23.6, 35.4], [24.9, 35.3], [26.3, 35.2]];

const geo = (pts: [number, number][]): Stroke => pts.map(([lon, lat]) => [(lon - 6.5) * 5.6, (46.9 - lat) * 6.6] as Pt);

export const MEDITERRANEAN: Figure = {
  width: 120,
  height: 78,
  strokes: [geo(ITALY), geo(SICILY), geo(GREECE), geo(CRETE)],
};

/** Unique vertices across strokes, so shared corners get one star. */
export function starsOf(fig: Figure): Pt[] {
  const seen = new Map<string, Pt>();
  for (const s of fig.strokes) for (const p of s) seen.set(`${p[0].toFixed(1)},${p[1].toFixed(1)}`, p);
  for (const p of fig.loose ?? []) seen.set(`${p[0]},${p[1]}`, p);
  return Array.from(seen.values());
}

export const pathOf = (s: Stroke) => s.map(([x, y], k) => `${k ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

/** Deterministic star sizes: a few bright "alpha" stars, the rest faint. */
export function starSize(i: number, salt = 0): number {
  const h = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  const f = h - Math.floor(h);
  return f > 0.82 ? 2.6 : f > 0.5 ? 1.8 : 1.3;
}
