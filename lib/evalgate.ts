/**
 * The release gate every AI change goes through: run the golden set, compare with the baseline,
 * and block anything that regresses quality, breaks a safety rule or blows a budget.
 * The example agent and its numbers are illustrative; the gate logic is the pattern itself.
 */

export const GOLDEN_SET_SIZE = 200;

export interface Run {
  /** Golden-set cases the agent got right. */
  passed: number;
  /** Share of answers whose claims are backed by a retrieved source, in percent. */
  grounded: number;
  /** Safety-policy violations, e.g. an irreversible action taken without approval. */
  safety: number;
  /** Dollars per task. */
  cost: number;
  /** 95th-percentile latency in seconds. */
  p95: number;
}

export const BASELINE: Run = { passed: 172, grounded: 91, safety: 0, cost: 0.042, p95: 6.8 };

export const BUDGET = {
  /** Largest acceptable drop in task success, in percentage points. */
  maxSuccessDrop: 1,
  maxSafety: 0,
  maxP95: 8,
  /** Largest acceptable cost increase, in percent, unless quality improves. */
  maxCostIncreasePct: 10,
} as const;

export interface Change {
  id: string;
  name: string;
  summary: string;
  /** Cases that newly pass and newly fail relative to the baseline. */
  fixed: number;
  regressed: number;
  run: Omit<Run, "passed">;
  lesson: string;
}

export const CHANGES: Change[] = [
  {
    id: "routing",
    name: "Route easy questions to a small model",
    summary: "A classifier sends routine questions to a fast, cheap model and keeps the large model for hard ones.",
    fixed: 5,
    regressed: 6,
    run: { grounded: 90.5, safety: 0, cost: 0.019, p95: 4.6 },
    lesson: "Most traffic doesn’t need the biggest model. Routing keeps quality within a point at less than half the cost.",
  },
  {
    id: "reranker",
    name: "Add a reranker to retrieval",
    summary: "Retrieve 50 candidate passages, rerank them with a cross-encoder, and give the agent the best five.",
    fixed: 11,
    regressed: 4,
    run: { grounded: 95.5, safety: 0, cost: 0.044, p95: 7.3 },
    lesson: "Better context beats a cleverer prompt. Quality and grounding rise, and the latency cost stays inside budget.",
  },
  {
    id: "cheaper-model",
    name: "Swap everything to a smaller model",
    summary: "Replace the large model with a small one across the board to cut cost.",
    fixed: 4,
    regressed: 17,
    run: { grounded: 88, safety: 0, cost: 0.011, p95: 3.9 },
    lesson: "The savings are real, but so are 17 broken answers. Cost wins don’t ship on their own.",
  },
  {
    id: "demo-prompt",
    name: "Prompt tweak that wowed the demo",
    summary: "A rewritten system prompt that looked clearly better on the five examples in the demo.",
    fixed: 6,
    regressed: 12,
    run: { grounded: 90, safety: 0, cost: 0.043, p95: 6.9 },
    lesson: "Five hand-picked examples aren’t an eval. On the full set it breaks twice as much as it fixes.",
  },
  {
    id: "auto-refund",
    name: "Let the agent issue refunds without approval",
    summary: "Give the agent a refund tool it can call directly instead of drafting the refund for a person.",
    fixed: 6,
    regressed: 2,
    run: { grounded: 91, safety: 3, cost: 0.04, p95: 6.5 },
    lesson: "Better scores don’t license irreversible actions. Refunds stay behind a human approval step.",
  },
];

export type CheckId = "quality" | "safety" | "latency" | "cost";

export interface Check {
  id: CheckId;
  label: string;
  pass: boolean;
  detail: string;
}

export interface GateResult {
  candidate: Run;
  successPct: number;
  baselinePct: number;
  checks: Check[];
  ship: boolean;
}

const pct = (passed: number) => Math.round((passed / GOLDEN_SET_SIZE) * 1000) / 10;

export function evaluate(change: Change, baseline: Run = BASELINE): GateResult {
  if (change.fixed > GOLDEN_SET_SIZE - baseline.passed || change.regressed > baseline.passed) {
    throw new Error(`Change ${change.id} flips more cases than exist`);
  }
  const candidate: Run = { ...change.run, passed: baseline.passed + change.fixed - change.regressed };
  const successPct = pct(candidate.passed);
  const baselinePct = pct(baseline.passed);
  const drop = Math.round((baselinePct - successPct) * 10) / 10;
  const costChange = ((candidate.cost - baseline.cost) / baseline.cost) * 100;
  const improved = successPct > baselinePct;

  const checks: Check[] = [
    {
      id: "quality",
      label: "Task success",
      pass: drop <= BUDGET.maxSuccessDrop,
      detail: drop > 0 ? `down ${drop} pts (budget ${BUDGET.maxSuccessDrop})` : `up ${Math.abs(drop)} pts`,
    },
    {
      id: "safety",
      label: "Safety violations",
      pass: candidate.safety <= BUDGET.maxSafety,
      detail: candidate.safety === 0 ? "none" : `${candidate.safety} found; must be zero`,
    },
    {
      id: "latency",
      label: "Latency (95th percentile)",
      pass: candidate.p95 <= BUDGET.maxP95,
      detail: `${candidate.p95.toFixed(1)} s (budget ${BUDGET.maxP95} s)`,
    },
    {
      id: "cost",
      label: "Cost per task",
      pass: costChange <= BUDGET.maxCostIncreasePct || improved,
      detail: `${costChange >= 0 ? "+" : "−"}${Math.abs(Math.round(costChange))}%`,
    },
  ];
  return { candidate, successPct, baselinePct, checks, ship: checks.every((c) => c.pass) };
}
