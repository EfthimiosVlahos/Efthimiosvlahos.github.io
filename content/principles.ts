import type { Principle } from "./types";

/** Numbered because case studies cite them ("principle 3"). Order matches a project's life. */
export const principles: Principle[] = [
  {
    n: 1,
    title: "Start with the people who own the problem",
    body: "Sit with them until “correct” is written down: what goes in, what should come out, and what a wrong answer costs.",
  },
  {
    n: 2,
    title: "Write the answer key before the first prompt",
    body: "A golden set and a success metric come first, and the scorer gets tested too before any model is compared.",
  },
  {
    n: 3,
    title: "Evals are the spec",
    body: "Every prompt, model or tool change runs the suite in CI and has to match or beat the baseline before it ships.",
  },
  {
    n: 4,
    title: "Test what must not change",
    body: "Replay changes on the cases that already work and on the ones humans rejected. A regression blocks the release.",
  },
  {
    n: 5,
    title: "Humans approve the irreversible",
    body: "Agents act on their own where mistakes are cheap to undo. Refunds, deletions and approvals wait for a person.",
  },
  {
    n: 6,
    title: "Numbers in code, words by the model",
    body: "Compute facts deterministically and let the model write around them. A guard refuses any figure it invents.",
  },
  {
    n: 7,
    title: "Missing beats invented",
    body: "Ground every answer in a source and cite it. When the source is silent, say so instead of guessing.",
  },
  {
    n: 8,
    title: "Ship dark, roll back fast",
    body: "New behavior ships behind a flag or in shadow mode first, with one-command rollback ready.",
  },
  {
    n: 9,
    title: "Watch real behavior, not health checks",
    body: "Trace every agent step with its cost and latency, and alert on what users experience. A green dashboard can hide a dead system.",
  },
  {
    n: 10,
    title: "Trace scary numbers before quoting them",
    body: "An alarming metric usually has a boring cause. Find it before quoting the number, and retract wrong theories out loud.",
  },
];

export function principle(n: number): Principle {
  const found = principles.find((p) => p.n === n);
  if (!found) throw new Error(`Unknown principle ${n}`);
  return found;
}
