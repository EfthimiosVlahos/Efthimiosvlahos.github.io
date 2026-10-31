import { describe, expect, it } from "vitest";
import { energy, separation, step, type PendulumState } from "@/lib/pendulum";
import { brzycki, epley, repMaxes, toPlates } from "@/lib/strength";
import { GRAVITY, advance, canKick, kick, newBall } from "@/lib/keepy";
import { EUROPEAN_CUPS } from "@/content/realmadrid";
import { LIFTS, PLANETS, SCOUTING, keepyQuip, period } from "@/content/personal";

describe("double pendulum", () => {
  const start: PendulumState = { t1: 2.0, t2: 2.4, w1: 0, w2: 0 };

  it("conserves energy to within a thousandth of a percent over ten minutes (the page's caption)", () => {
    let s = start;
    const e0 = energy(s);
    let worst = 0;
    for (let i = 0; i < 600 / 0.002; i++) {
      s = step(s, 0.002);
      worst = Math.max(worst, Math.abs((energy(s) - e0) / e0));
    }
    expect(worst).toBeLessThan(1e-5);
  });

  it("is chaotic: a thousandth of a radian grows into a visibly different swing", () => {
    let a = start;
    let b = { ...start, t1: start.t1 + 1e-3 };
    expect(separation(a, b)).toBeLessThan(0.01);
    let diverged = false;
    for (let i = 0; i < 15000 && !diverged; i++) {
      a = step(a, 0.002);
      b = step(b, 0.002);
      diverged = separation(a, b) > 0.5;
    }
    expect(diverged).toBe(true);
  });
});

describe("chaos timing", () => {
  it("buys only a few seconds per thousand-fold smaller head start", () => {
    const start: PendulumState = { t1: 2.0, t2: 2.4, w1: 0, w2: 0 };
    const divergeAt = (eps: number) => {
      let a = start;
      let b = { ...start, t1: start.t1 + eps };
      for (let t = 0; t < 60; t += 0.002) {
        a = step(a, 0.002);
        b = step(b, 0.002);
        if (separation(a, b) > 0.5) return t;
      }
      return Infinity;
    };
    const [t3, t6, t9] = [divergeAt(1e-3), divergeAt(1e-6), divergeAt(1e-9)];
    expect(t6 - t3).toBeGreaterThan(1);
    expect(t6 - t3).toBeLessThan(5);
    expect(t9 - t6).toBeGreaterThan(1);
    expect(t9 - t6).toBeLessThan(5);
  });
});

describe("one-rep max", () => {
  it("returns the lift itself for a single", () => {
    expect(epley(225, 1)).toBe(225);
    expect(brzycki(225, 1)).toBe(225);
  });

  it("agrees exactly at ten reps and disagrees elsewhere", () => {
    expect(epley(150, 10)).toBeCloseTo(brzycki(150, 10), 6);
    expect(epley(150, 5)).toBeGreaterThan(brzycki(150, 5));
    expect(brzycki(150, 12)).toBeGreaterThan(epley(150, 12));
  });

  it("inverts back to the same 1RM", () => {
    const table = repMaxes(300, 12);
    const at8 = table[7];
    if (!at8) throw new Error("missing 8-rep row");
    expect(epley(at8.epley, 8)).toBeCloseTo(300, 6);
    expect(brzycki(at8.brzycki, 8)).toBeCloseTo(300, 6);
  });

  it("rounds to loadable plates", () => {
    expect(toPlates(263, "lb")).toBe(265);
    expect(toPlates(101.3, "kg")).toBe(102.5);
  });
});

describe("keepy-uppy physics", () => {
  it("falls under gravity and ends when it hits the ground", () => {
    let b = newBall();
    let dropped = false;
    let t = 0;
    while (!dropped && t < 5) {
      ({ ball: b, dropped } = advance(b, 0.01, 1.1));
      t += 0.01;
    }
    expect(dropped).toBe(true);
    // Free fall from y=0.35 to y≈1.05 should take about sqrt(2·0.7/g).
    expect(t).toBeCloseTo(Math.sqrt((2 * 0.69) / GRAVITY), 1);
  });

  it("kicks upward, with spin and sideways speed from an off-center touch", () => {
    const b = { ...newBall(), x: 0.5, y: 0.8, vy: 1 };
    expect(canKick(b, 0.52, 0.81)).toBe(true);
    expect(canKick(b, 0.9, 0.2)).toBe(false);
    const k = kick(b, 0.53);
    expect(k.vy).toBeLessThan(0);
    expect(k.vx).toBeLessThan(0);
    expect(k.spin).not.toBe(0);
  });

  it("bounces off the side walls", () => {
    const { ball } = advance({ ...newBall(), x: 0.06, vx: -2 }, 0.05, 1.1);
    expect(ball.vx).toBeGreaterThan(0);
  });
});

describe("personal content", () => {
  it("lists Real Madrid's fifteen European Cups in order", () => {
    expect(EUROPEAN_CUPS).toHaveLength(15);
    const years = EUROPEAN_CUPS.map((c) => c.year);
    expect([...years].sort((a, b) => a - b)).toEqual(years);
    expect(new Set(years).size).toBe(15);
  });

  it("orders planets outward with Kepler periods", () => {
    for (let i = 1; i < PLANETS.length; i++) expect(PLANETS[i]!.orbit).toBeGreaterThan(PLANETS[i - 1]!.orbit);
    // T² / a³ is the same for every planet.
    const k = PLANETS.map((p) => period(p.orbit) ** 2 / p.orbit ** 3);
    for (const v of k) expect(v).toBeCloseTo(k[0]!, 9);
  });
});

describe("the jokes", () => {
  it("reacts to every keepy-uppy score, and only the best get scouted", () => {
    expect(keepyQuip(0)).toMatch(/warm-up/);
    expect(keepyQuip(3)).toMatch(/first touch/);
    expect(keepyQuip(29)).not.toMatch(/scouts/);
    expect(keepyQuip(30)).toMatch(/scouts/);
  });

  it("keeps the scouting report on a 0 to 100 scale with unique skills", () => {
    for (const r of SCOUTING) {
      for (const v of [r.head, r.tape]) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(100);
      }
    }
    expect(new Set(SCOUTING.map((r) => r.skill)).size).toBe(SCOUTING.length);
  });

  it("loads plate milestones that are loadable in both units", () => {
    for (const l of LIFTS) {
      expect(toPlates(l.lb, "lb")).toBe(l.lb);
      expect(toPlates(l.kg, "kg")).toBe(l.kg);
    }
  });
});
