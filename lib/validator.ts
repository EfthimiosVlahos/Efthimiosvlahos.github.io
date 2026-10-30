/**
 * A simplified model of the policy validator's decision layer. Eight checks produce a match
 * percentage; at 85% or above a case can auto-approve. With eight checks, one failure is still
 * 87.5%, so without a hard-fail flag a missing liability limit could approve on its own.
 * In production, specific critical rules set the flag; here, three checks stand in for them.
 */

export interface Check {
  id: string;
  label: string;
  critical: boolean;
}

export const CHECKS: readonly Check[] = [
  { id: "holders", label: "Policy holders match the lease", critical: false },
  { id: "address", label: "Insured address matches", critical: false },
  { id: "unit", label: "Unit number matches", critical: false },
  { id: "policy-number", label: "Policy number matches", critical: false },
  { id: "interest-name", label: "Servicer named as additional interest", critical: false },
  { id: "interest-address", label: "Servicer listed at a valid PO box", critical: true },
  { id: "in-force", label: "Policy is in force", critical: true },
  { id: "liability", label: "Liability meets the property’s minimum", critical: true },
] as const;

export const MATCH_THRESHOLD = 85;

export type Status = "auto-approve" | "manual-review";

export interface Decision {
  matchPct: number;
  hardFail: boolean;
  status: Status;
}

export function decide(passing: ReadonlySet<string>, useHardFail: boolean): Decision {
  const passed = CHECKS.filter((c) => passing.has(c.id)).length;
  const matchPct = Math.round((passed / CHECKS.length) * 1000) / 10;
  const hardFail = CHECKS.some((c) => c.critical && !passing.has(c.id));
  const meetsThreshold = matchPct >= MATCH_THRESHOLD;
  const status: Status = meetsThreshold && !(useHardFail && hardFail) ? "auto-approve" : "manual-review";
  return { matchPct, hardFail, status };
}
