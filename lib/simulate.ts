/**
 * "Simulate against the negatives": every candidate rule is replayed on stored production
 * cases before it ships, and judged by what it would change. The scenarios below are real
 * replays from an insurance validator (counts from dated project records); the verdict
 * function encodes the bar those decisions were held to.
 */

export type Direction = "approve" | "downgrade";

export interface Population {
  label: string;
  /** Cases in this replayed population. */
  size: number;
  /** Cases the rule fixes (false manual reviews it recovers). Undefined when not measured. */
  wins?: number;
  /** Cases the rule gets wrong: a rejected case approved, or a good case sent to review. */
  harms?: number;
}

export interface Scenario {
  id: string;
  name: string;
  direction: Direction;
  summary: string;
  populations: Population[];
  /** What actually happened to the rule. Tests check the verdict function reproduces it. */
  outcome: string;
}

export type Verdict = "ship" | "ship-after-review" | "drop";

/** An approving rule may ship with flips only when every flip is reviewed and wins outnumber them this much. */
export const MIN_WINS_PER_FLIP = 50;
/** A downgrade-only rule costs reviewer time, not wrong approvals, so a small false-fire rate is tolerable. */
export const MAX_FALSE_FIRE_RATE = 0.02;

export interface Judgement {
  verdict: Verdict;
  wins: number | null;
  harms: number;
  tested: number;
  reason: string;
}

export function judge(s: Scenario): Judgement {
  const harms = s.populations.reduce((sum, p) => sum + (p.harms ?? 0), 0);
  const measuredWins = s.populations.filter((p) => p.wins !== undefined);
  const wins = measuredWins.length ? measuredWins.reduce((sum, p) => sum + (p.wins ?? 0), 0) : null;
  const tested = s.populations.reduce((sum, p) => sum + p.size, 0);

  for (const p of s.populations) {
    if ((p.wins ?? 0) + (p.harms ?? 0) > p.size) {
      throw new Error(`Scenario ${s.id}: "${p.label}" changes more cases than it contains`);
    }
  }

  if (s.direction === "approve") {
    if (harms === 0) {
      return wins && wins > 0
        ? { verdict: "ship", wins, harms, tested, reason: "Recovers cases and approves none that reviewers rejected." }
        : { verdict: "drop", wins, harms, tested, reason: "No measured benefit." };
    }
    if (wins !== null && wins >= harms * MIN_WINS_PER_FLIP) {
      return {
        verdict: "ship-after-review",
        wins,
        harms,
        tested,
        reason: `${wins} wins to ${harms} flip${harms === 1 ? "" : "s"}. Each flip is read by hand before the rule ships.`,
      };
    }
    return {
      verdict: "drop",
      wins,
      harms,
      tested,
      reason: `Would approve ${harms} case${harms === 1 ? "" : "s"} reviewers rejected. Dropped and pinned with a trap test.`,
    };
  }

  const harmPopulation = s.populations.filter((p) => p.harms !== undefined).reduce((sum, p) => sum + p.size, 0);
  const rate = harmPopulation ? harms / harmPopulation : 0;
  if (rate <= MAX_FALSE_FIRE_RATE) {
    return { verdict: "ship", wins, harms, tested, reason: `Sends ${harms} good case${harms === 1 ? "" : "s"} to review out of ${harmPopulation}.` };
  }
  return {
    verdict: "drop",
    wins,
    harms,
    tested,
    reason: `Would send ${harms} of ${harmPopulation} good cases to manual review. Relaxed instead.`,
  };
}

export const scenarios: Scenario[] = [
  {
    id: "box-recovery",
    name: "Recover the servicer’s PO box from the PDF text",
    direction: "approve",
    summary: "When extraction dropped the line with the servicer’s PO box, read it from the document’s text layer instead.",
    populations: [
      { label: "Good policies wrongly sent to manual review", size: 101, wins: 50 },
      { label: "Policies reviewers rejected", size: 60, harms: 0 },
    ],
    outcome: "Shipped",
  },
  {
    id: "liability-fallback",
    name: "Read liability printed under a policy-type row",
    direction: "approve",
    summary: "Some carriers print the liability amount under “Renters” or “Bodily Injury” rather than a liability row.",
    populations: [{ label: "Stored extractions replayed", size: 834, wins: 56, harms: 1 }],
    outcome: "Shipped after the one flip was reviewed",
  },
  {
    id: "loose-units",
    name: "Looser unit-number matching",
    direction: "approve",
    summary: "Two candidate rules that treated more unit spellings as equal, such as bed-space suffixes in co-living buildings.",
    populations: [{ label: "Rejected co-living cases the rules touched", size: 21, harms: 21 }],
    outcome: "Dropped and pinned with trap tests",
  },
  {
    id: "require-name",
    name: "Require the servicer’s name, not only its PO box",
    direction: "downgrade",
    summary: "A stricter gate that sent any policy without the servicer’s exact name to a reviewer.",
    populations: [{ label: "Good policies in the regression set", size: 19, harms: 18 }],
    outcome: "Relaxed: listing the property name is the norm",
  },
  {
    id: "application-gate",
    name: "Flag insurance applications posing as policies",
    direction: "downgrade",
    summary: "Detect an application, not a policy, from its text layer: a self-declaration, or a title plus an applicant signature.",
    populations: [{ label: "Policies reviewers approved", size: 386, harms: 0 }],
    outcome: "Shipped",
  },
];
