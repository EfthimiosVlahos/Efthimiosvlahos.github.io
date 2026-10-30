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

/** Unique vertices across strokes, so shared corners get one star. */
export function starsOf(fig: Figure): Pt[] {
  const seen = new Map<string, Pt>();
  for (const s of fig.strokes) for (const p of s) seen.set(`${p[0].toFixed(1)},${p[1].toFixed(1)}`, p);
  return Array.from(seen.values());
}

export const pathOf = (s: Stroke) => s.map(([x, y], k) => `${k ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

/** Deterministic star sizes: a few bright "alpha" stars, the rest faint. */
export function starSize(i: number, salt = 0): number {
  const h = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  const f = h - Math.floor(h);
  return f > 0.82 ? 2.6 : f > 0.5 ? 1.8 : 1.3;
}
