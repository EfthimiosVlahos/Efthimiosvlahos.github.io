/**
 * Keepy-uppy physics in a unit box: x across (0..1), y down (0..aspect). Gravity pulls the ball down,
 * walls bounce it back with some energy lost, and a kick sends it up with spin taken from where you hit it.
 */

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  spin: number;
  angle: number;
}

export const GRAVITY = 2.6;
export const RADIUS = 0.055;
const WALL_RESTITUTION = 0.6;
const KICK_SPEED = 1.75;

export function newBall(): Ball {
  return { x: 0.5, y: 0.35, vx: 0, vy: 0, spin: 0, angle: 0 };
}

/** Advance the ball; returns whether it hit the ground (the game ends). */
export function advance(b: Ball, dt: number, height: number): { ball: Ball; dropped: boolean } {
  let { x, y, vx, vy } = b;
  vy += GRAVITY * dt;
  x += vx * dt;
  y += vy * dt;
  if (x < RADIUS) {
    x = RADIUS;
    vx = Math.abs(vx) * WALL_RESTITUTION;
  } else if (x > 1 - RADIUS) {
    x = 1 - RADIUS;
    vx = -Math.abs(vx) * WALL_RESTITUTION;
  }
  if (y < RADIUS) {
    y = RADIUS;
    vy = Math.abs(vy) * WALL_RESTITUTION;
  }
  const dropped = y > height - RADIUS;
  return { ball: { ...b, x, y: dropped ? height - RADIUS : y, vx, vy, angle: b.angle + b.spin * dt }, dropped };
}

/** Is a click at (px, py) close enough to count as a touch? Generous, like a real first touch. */
export function canKick(b: Ball, px: number, py: number): boolean {
  return Math.hypot(px - b.x, py - b.y) < RADIUS * 2.4;
}

/** Kick: always upward; hitting the ball off-center sends it sideways and spins it. */
export function kick(b: Ball, px: number): Ball {
  const offset = Math.max(-1, Math.min(1, (b.x - px) / (RADIUS * 2.4)));
  return { ...b, vy: -KICK_SPEED, vx: b.vx * 0.4 + offset * 0.9, spin: offset * 9 };
}
