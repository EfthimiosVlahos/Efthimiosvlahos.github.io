/**
 * The double pendulum: two rods, two bobs, no friction. Its equations of motion are simple to write
 * and impossible to predict for long, which is the point of the demo: two runs that start a hair apart
 * end up nothing alike. Integrated with classic fourth-order Runge–Kutta.
 */

export interface PendulumState {
  /** Angles from vertical, radians. */
  t1: number;
  t2: number;
  /** Angular velocities, radians per second. */
  w1: number;
  w2: number;
}

export const PARAMS = { m1: 1, m2: 1, l1: 1, l2: 1, g: 9.81 } as const;

type Deriv = [number, number, number, number];

function derivatives(s: PendulumState, p = PARAMS): Deriv {
  const { m1, m2, l1, l2, g } = p;
  const d = s.t1 - s.t2;
  const den = 2 * m1 + m2 - m2 * Math.cos(2 * d);
  const a1 =
    (-g * (2 * m1 + m2) * Math.sin(s.t1) -
      m2 * g * Math.sin(s.t1 - 2 * s.t2) -
      2 * Math.sin(d) * m2 * (s.w2 * s.w2 * l2 + s.w1 * s.w1 * l1 * Math.cos(d))) /
    (l1 * den);
  const a2 =
    (2 * Math.sin(d) * (s.w1 * s.w1 * l1 * (m1 + m2) + g * (m1 + m2) * Math.cos(s.t1) + s.w2 * s.w2 * l2 * m2 * Math.cos(d))) /
    (l2 * den);
  return [s.w1, s.w2, a1, a2];
}

export function step(s: PendulumState, dt: number): PendulumState {
  const add = (k: Deriv, h: number): PendulumState => ({ t1: s.t1 + k[0] * h, t2: s.t2 + k[1] * h, w1: s.w1 + k[2] * h, w2: s.w2 + k[3] * h });
  const k1 = derivatives(s);
  const k2 = derivatives(add(k1, dt / 2));
  const k3 = derivatives(add(k2, dt / 2));
  const k4 = derivatives(add(k3, dt));
  const mix = (i: number) => (k1[i]! + 2 * k2[i]! + 2 * k3[i]! + k4[i]!) / 6;
  return { t1: s.t1 + dt * mix(0), t2: s.t2 + dt * mix(1), w1: s.w1 + dt * mix(2), w2: s.w2 + dt * mix(3) };
}

/** Total mechanical energy; constant for the exact system, so drift measures integration error. */
export function energy(s: PendulumState, p = PARAMS): number {
  const { m1, m2, l1, l2, g } = p;
  const v1sq = (l1 * s.w1) ** 2;
  const v2sq = v1sq + (l2 * s.w2) ** 2 + 2 * l1 * l2 * s.w1 * s.w2 * Math.cos(s.t1 - s.t2);
  const kinetic = 0.5 * m1 * v1sq + 0.5 * m2 * v2sq;
  const potential = -(m1 + m2) * g * l1 * Math.cos(s.t1) - m2 * g * l2 * Math.cos(s.t2);
  return kinetic + potential;
}

/** Bob positions in units of rod length, y pointing down. */
export function bobs(s: PendulumState, p = PARAMS): [[number, number], [number, number]] {
  const x1 = p.l1 * Math.sin(s.t1);
  const y1 = p.l1 * Math.cos(s.t1);
  return [
    [x1, y1],
    [x1 + p.l2 * Math.sin(s.t2), y1 + p.l2 * Math.cos(s.t2)],
  ];
}

/** Distance between the outer bobs of two runs: the visible measure of divergence. */
export function separation(a: PendulumState, b: PendulumState): number {
  const [, pa] = bobs(a);
  const [, pb] = bobs(b);
  return Math.hypot(pa[0] - pb[0], pa[1] - pb[1]);
}
