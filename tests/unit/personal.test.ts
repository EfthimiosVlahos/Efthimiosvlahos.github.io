import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { BASELINE, CHANGES, GOLDEN_SET_SIZE, evaluate } from "@/lib/evalgate";
import { buildIndex, rewriteQuery, search, stem, tokenize, type Passage } from "@/lib/retrieval";
import { features, simulate, xg } from "@/lib/xg";

describe("eval gate", () => {
  it("ships routing and the reranker, and blocks the rest for the right reason", () => {
    const verdict = Object.fromEntries(CHANGES.map((c) => [c.id, evaluate(c)]));
    expect(verdict.routing?.ship).toBe(true);
    expect(verdict.reranker?.ship).toBe(true);
    expect(verdict["cheaper-model"]?.checks.find((c) => !c.pass)?.id).toBe("quality");
    expect(verdict["demo-prompt"]?.checks.find((c) => !c.pass)?.id).toBe("quality");
    expect(verdict["auto-refund"]?.checks.find((c) => !c.pass)?.id).toBe("safety");
  });

  it("derives success from fixed and regressed cases so the numbers stay consistent", () => {
    for (const c of CHANGES) {
      const r = evaluate(c);
      expect(r.candidate.passed).toBe(BASELINE.passed + c.fixed - c.regressed);
      expect(r.successPct).toBeCloseTo((r.candidate.passed / GOLDEN_SET_SIZE) * 100, 1);
    }
  });

  it("rejects a change that flips more cases than exist", () => {
    const [first] = CHANGES;
    if (!first) throw new Error("no changes defined");
    expect(() => evaluate({ ...first, fixed: GOLDEN_SET_SIZE })).toThrow();
  });
});

describe("retrieval", () => {
  const passages = JSON.parse(readFileSync(join(__dirname, "../../public/data/ancients.json"), "utf8")) as Passage[];
  const index = buildIndex(passages);

  it("has a clean corpus from four authors", () => {
    expect(new Set(passages.map((p) => p.author))).toEqual(new Set(["Marcus Aurelius", "Epictetus", "Socrates", "Seneca"]));
    for (const p of passages) expect(p.text, p.ref).not.toMatch(/Gutenberg|\{\d+\}|\[[A-Z]\]/);
  });

  it("tokenizes, drops stopwords and stems predictably", () => {
    expect(tokenize("How do I actually handle my fears?")).toEqual(["handle", "fear"]);
    expect(rewriteQuery("worrying about work").shownOriginal).toEqual(["worrying", "work"]);
    expect(stem("disturbed")).toBe(stem("disturb"));
  });

  it("rewrites modern words toward the corpus vocabulary", () => {
    const q = rewriteQuery("I feel anxious about my career");
    expect(q.added).toContain(stem("disturbed"));
    expect(q.added).toContain(stem("labour"));
    expect(q.weights.get(stem("anxious"))).toBe(1);
  });

  it("finds Marcus Aurelius on getting out of bed", () => {
    const hits = search(index, rewriteQuery("I hate getting out of bed in the morning"));
    expect(hits[0]?.passage.ref).toBe("Book V, 1");
  });

  it("finds Marcus Aurelius on caring about other people's opinions", () => {
    const hits = search(index, rewriteQuery("How do I stop worrying about what people think?"));
    expect(hits.map((h) => h.passage.ref)).toContain("Book XII, 4");
  });

  it("answers the space-themed questions with Marcus Aurelius looking up and down", () => {
    expect(search(index, rewriteQuery("What can the stars teach me?"))[0]?.passage.ref).toBe("Book XI, 27");
    expect(search(index, rewriteQuery("Does any of this matter in the grand scheme of the universe?"))[0]?.passage.ref).toBe("Book VI, 36");
  });

  it("answers anger with Marcus Aurelius on gentleness", () => {
    const hits = search(index, rewriteQuery("How should I deal with anger?"));
    expect(hits[0]?.passage.ref).toBe("Book XI, 18");
  });

  it("finds Epictetus on what is within our power", () => {
    const hits = search(index, rewriteQuery("what is within my control"), 3);
    expect(hits.some((h) => h.passage.author === "Epictetus")).toBe(true);
  });

  it("never returns more than two passages from one author", () => {
    const hits = search(index, rewriteQuery("death"), 3, 2);
    const counts = hits.reduce<Record<string, number>>((m, h) => ((m[h.passage.author] = (m[h.passage.author] ?? 0) + 1), m), {});
    expect(Math.max(...Object.values(counts))).toBeLessThanOrEqual(2);
  });
});

describe("expected goals", () => {
  it("rises as shots get closer and more central", () => {
    expect(xg({ x: 0, y: 6 })).toBeGreaterThan(xg({ x: 0, y: 12 }));
    expect(xg({ x: 0, y: 12 })).toBeGreaterThan(xg({ x: 12, y: 12 }));
    expect(xg({ x: 0, y: 30 })).toBeLessThan(0.05);
  });

  it("stays near typical open-play values it was fit to", () => {
    expect(xg({ x: 0, y: 5.5 })).toBeCloseTo(0.37, 1);
    expect(xg({ x: 0, y: 16.5 })).toBeCloseTo(0.075, 2);
  });

  it("measures the goal-mouth angle", () => {
    // From the penalty spot the posts subtend about 37 degrees.
    expect((features({ x: 0, y: 11 }).angle * 180) / Math.PI).toBeCloseTo(36.8, 0);
  });

  it("simulates deterministically and close to expectation over many shots", () => {
    expect(simulate(0.3, 100, 7)).toBe(simulate(0.3, 100, 7));
    expect(simulate(0.3, 10_000, 11) / 10_000).toBeCloseTo(0.3, 1);
  });
});

describe("shot simulation stream", () => {
  it("is well mixed for small consecutive seeds", async () => {
    const { shotOutcomes } = await import("@/lib/xg");
    for (const seed of [1, 2, 3, 17, 18]) {
      const goals = shotOutcomes(0.2, 1000, seed).filter(Boolean).length;
      expect(goals, `seed ${seed}`).toBeGreaterThan(150);
      expect(goals, `seed ${seed}`).toBeLessThan(250);
    }
  });
});
