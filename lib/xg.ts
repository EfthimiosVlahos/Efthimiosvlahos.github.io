/**
 * A toy expected-goals (xG) model: logistic regression on two features, the angle the goal mouth
 * makes from the shot and the distance to goal. Coefficients were fit to typical open-play values
 * (e.g. ~0.4 from the six-yard box, ~0.07 from the edge of the area). Real models add body part,
 * assist type, defenders and goalkeeper position.
 */

export const GOAL_WIDTH = 7.32;
export const COEF = { intercept: -1.3852, angle: 1.2078, distance: -0.1001 } as const;

/** Shot position in meters: `x` across the pitch from the goal's center, `y` out from the goal line. */
export interface Shot {
  x: number;
  y: number;
}

export function features({ x, y }: Shot): { angle: number; distance: number } {
  const distance = Math.hypot(x, y);
  // Angle subtended by the two posts, from the shooter's position.
  const angle = Math.abs(Math.atan2(GOAL_WIDTH * y, x * x + y * y - (GOAL_WIDTH / 2) ** 2));
  return { angle, distance };
}

export function xg(shot: Shot): number {
  if (shot.y <= 0) return 0;
  const { angle, distance } = features(shot);
  const z = COEF.intercept + COEF.angle * angle + COEF.distance * distance;
  return 1 / (1 + Math.exp(-z));
}

/** mulberry32: small, well-mixed PRNG so a seed gives a repeatable stream of shots. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Outcomes of `shots` independent shots, each scoring with probability `p`. */
export function shotOutcomes(p: number, shots: number, seed: number): boolean[] {
  const next = rng(seed);
  return Array.from({ length: shots }, () => next() < p);
}

export function simulate(p: number, shots: number, seed: number): number {
  return shotOutcomes(p, shots, seed).filter(Boolean).length;
}
