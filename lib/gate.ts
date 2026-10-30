/** Trader Hub's graduation gate: live trading stays locked until paper trading clears every bar. */

export interface PaperRecord {
  sharpe: number;
  maxDrawdownPct: number;
  trades: number;
  days: number;
}

export interface Criterion {
  key: keyof PaperRecord;
  label: string;
  bar: string;
  passes: (r: PaperRecord) => boolean;
}

export const CRITERIA: readonly Criterion[] = [
  { key: "sharpe", label: "Sharpe ratio (return per unit of risk)", bar: "at least 1.0", passes: (r) => r.sharpe >= 1 },
  { key: "maxDrawdownPct", label: "Max drawdown", bar: "15% or less", passes: (r) => r.maxDrawdownPct <= 15 },
  { key: "trades", label: "Paper trades", bar: "at least 30", passes: (r) => r.trades >= 30 },
  { key: "days", label: "Days of paper trading", bar: "at least 90", passes: (r) => r.days >= 90 },
] as const;

export function gate(r: PaperRecord): { open: boolean; failing: Criterion[] } {
  const failing = CRITERIA.filter((c) => !c.passes(r));
  return { open: failing.length === 0, failing };
}
