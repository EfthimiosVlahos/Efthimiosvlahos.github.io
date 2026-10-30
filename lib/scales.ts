/** Minimal scales for hand-built SVG charts; enough for this site, nothing more. */

export type Scale = (value: number) => number;

export function linear([d0, d1]: [number, number], [r0, r1]: [number, number]): Scale {
  if (d0 === d1) throw new Error("linear scale needs a non-empty domain");
  return (v) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
}

export function log10([d0, d1]: [number, number], [r0, r1]: [number, number]): Scale {
  if (d0 <= 0 || d1 <= 0) throw new Error("log scale needs a positive domain");
  const l0 = Math.log10(d0);
  const l1 = Math.log10(d1);
  return (v) => {
    if (v <= 0) throw new Error(`log scale got non-positive value ${v}`);
    return r0 + ((Math.log10(v) - l0) / (l1 - l0)) * (r1 - r0);
  };
}

/** Human duration for chart labels: 47 s, 36 min, 2 h, 2 days. */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)} s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} h`;
  const days = Math.round(seconds / 86400);
  return `${days} day${days === 1 ? "" : "s"}`;
}
