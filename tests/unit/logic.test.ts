import { describe, expect, it } from "vitest";
import { judge, scenarios, type Scenario } from "@/lib/simulate";
import { CHECKS, decide } from "@/lib/validator";
import { gate } from "@/lib/gate";
import { formatDuration, linear, log10 } from "@/lib/scales";

describe("judge (simulate against the negatives)", () => {
  it("reproduces the decision actually made for every recorded replay", () => {
    const expected: Record<string, string> = {
      "box-recovery": "ship",
      "liability-fallback": "ship-after-review",
      "loose-units": "drop",
      "require-name": "drop",
      "application-gate": "ship",
    };
    for (const s of scenarios) expect(judge(s).verdict, s.id).toBe(expected[s.id]);
  });

  it("drops an approving rule whose wins don't outweigh its flips", () => {
    const s: Scenario = {
      id: "t",
      name: "t",
      direction: "approve",
      summary: "",
      outcome: "",
      populations: [{ label: "x", size: 100, wins: 40, harms: 1 }],
    };
    expect(judge(s).verdict).toBe("drop");
  });

  it("drops an approving rule with no measured benefit", () => {
    const s: Scenario = { id: "t", name: "t", direction: "approve", summary: "", outcome: "", populations: [{ label: "x", size: 10, harms: 0 }] };
    expect(judge(s).verdict).toBe("drop");
  });

  it("rejects populations that change more cases than they contain", () => {
    const s: Scenario = { id: "t", name: "t", direction: "approve", summary: "", outcome: "", populations: [{ label: "x", size: 5, wins: 4, harms: 2 }] };
    expect(() => judge(s)).toThrow(/more cases than it contains/);
  });
});

describe("decide (hard_fail)", () => {
  const all = new Set(CHECKS.map((c) => c.id));

  it("auto-approves when every check passes", () => {
    expect(decide(all, true)).toEqual({ matchPct: 100, hardFail: false, status: "auto-approve" });
  });

  it("would auto-approve a missing liability limit without hard_fail, and holds it with hard_fail", () => {
    const passing = new Set(all);
    passing.delete("liability");
    expect(decide(passing, false)).toMatchObject({ matchPct: 87.5, status: "auto-approve" });
    expect(decide(passing, true)).toMatchObject({ matchPct: 87.5, hardFail: true, status: "manual-review" });
  });

  it("still approves a single non-critical miss", () => {
    const passing = new Set(all);
    passing.delete("unit");
    expect(decide(passing, true).status).toBe("auto-approve");
  });

  it("sends two misses to review regardless", () => {
    const passing = new Set(all);
    passing.delete("unit");
    passing.delete("address");
    expect(decide(passing, false)).toMatchObject({ matchPct: 75, status: "manual-review" });
  });
});

describe("gate (Trader Hub graduation)", () => {
  it("opens only when every bar is cleared", () => {
    expect(gate({ sharpe: 1.2, maxDrawdownPct: 12, trades: 45, days: 120 }).open).toBe(true);
    const shut = gate({ sharpe: 0.8, maxDrawdownPct: 18, trades: 45, days: 120 });
    expect(shut.open).toBe(false);
    expect(shut.failing.map((c) => c.key)).toEqual(["sharpe", "maxDrawdownPct"]);
  });

  it("treats the bars as inclusive", () => {
    expect(gate({ sharpe: 1, maxDrawdownPct: 15, trades: 30, days: 90 }).open).toBe(true);
  });
});

describe("scales", () => {
  it("maps linearly", () => {
    expect(linear([0, 100], [0, 500])(25)).toBe(125);
  });

  it("maps decades evenly on a log scale", () => {
    const s = log10([1, 1000], [0, 300]);
    expect(s(1)).toBe(0);
    expect(s(10)).toBeCloseTo(100);
    expect(s(1000)).toBeCloseTo(300);
    expect(() => s(0)).toThrow();
  });

  it("formats durations for labels", () => {
    expect(formatDuration(47)).toBe("47 s");
    expect(formatDuration(36 * 60)).toBe("36 min");
    expect(formatDuration(2 * 3600)).toBe("2 h");
    expect(formatDuration(2 * 86400)).toBe("2 days");
  });
});
