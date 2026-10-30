import type { Principle } from "./types";

/** Numbered because case studies cite them ("principle 3"). Order matches a project's life. */
export const principles: Principle[] = [
  {
    n: 1,
    title: "Read before you write",
    body: "Investigate read-only first: the stored data, the actual document, the logs. Many “bugs” turn out to be someone else’s data, or correct behavior.",
  },
  {
    n: 2,
    title: "Write the answer key before the first run",
    body: "Hand-label what correct looks like, then test the scorer itself. My first model comparison found a bug in the scorer, not the model.",
  },
  {
    n: 3,
    title: "Simulate against the negatives",
    body: "Replay every candidate rule on the cases humans rejected. If it would approve any of them, it doesn’t ship, and a trap test keeps it out.",
  },
  {
    n: 4,
    title: "Prefer automation that can only ask for help",
    body: "Rules that send work to a person ship freely. Rules that approve on their own need proof from a replay first.",
  },
  {
    n: 5,
    title: "Numbers in code, words by the model",
    body: "The model writes prose from facts the code computed. A guard refuses any figure that isn’t in those facts.",
  },
  {
    n: 6,
    title: "Missing beats invented",
    body: "When a field isn’t printed, the answer is null. I removed a hard-coded fallback address because a confident wrong value is worse than a gap.",
  },
  {
    n: 7,
    title: "Fail open on what you can’t read",
    body: "A phone photo with no text layer behaves exactly as before. Never punish an input for being hard to parse.",
  },
  {
    n: 8,
    title: "Ship dark, then switch on",
    body: "New integrations arrive off by default and inert without configuration, with tests proving nothing else changed.",
  },
  {
    n: 9,
    title: "Make deploys provable",
    body: "Verify what production actually runs, keep rollback to one command, and restore every backup once. A backup that was never restored is a hope.",
  },
  {
    n: 10,
    title: "Trace scary numbers before quoting them",
    body: "An alarming metric usually has a boring cause. Find it, report the honest number, and retract wrong theories out loud.",
  },
];

export function principle(n: number): Principle {
  const found = principles.find((p) => p.n === n);
  if (!found) throw new Error(`Unknown principle ${n}`);
  return found;
}
