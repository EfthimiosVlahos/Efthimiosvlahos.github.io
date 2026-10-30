"use client";

import { useState, type ReactNode } from "react";

export interface Tip {
  /** Position in viewBox units. */
  x: number;
  y: number;
  lines: string[];
}

/**
 * Shared frame for every chart: title, subtitle, the plot, an optional legend, a hover/focus
 * tooltip, and a table view so no value is gated behind hover.
 */
export function ChartFigure({
  title,
  subtitle,
  viewBox,
  legend,
  table,
  source,
  children,
}: {
  title: string;
  subtitle?: string;
  viewBox: [number, number];
  legend?: { label: string; color: string; shape?: "dot" | "bar" | "tick" }[];
  table: { columns: string[]; rows: (string | number)[][] };
  source?: ReactNode;
  children: (show: (tip: Tip | null) => void) => ReactNode;
}) {
  const [tip, setTip] = useState<Tip | null>(null);
  const [w, h] = viewBox;

  return (
    <figure className="bleed my-10 rounded-xl border border-rule bg-raised p-5 sm:p-6">
      <figcaption>
        <div className="font-display text-xl font-semibold leading-tight">{title}</div>
        {subtitle && <div className="mt-1 text-sm text-soft">{subtitle}</div>}
      </figcaption>
      {legend && legend.length > 1 && (
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-soft">
          {legend.map((l) => (
            <li key={l.label} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={l.shape === "bar" ? "h-2.5 w-4 rounded-[2px]" : l.shape === "tick" ? "h-3.5 w-0.5" : "size-2.5 rounded-full"}
                style={{ background: l.color }}
              />
              {l.label}
            </li>
          ))}
        </ul>
      )}
      {/* Capped at 1.25x design size so chart text stays proportionate on wide screens. */}
      <div className="relative mx-auto mt-4" style={{ maxWidth: w * 1.25 }} onMouseLeave={() => setTip(null)}>
        <svg viewBox={`0 0 ${w} ${h}`} className="chart block h-auto w-full overflow-visible" role="img" aria-label={title}>
          {children(setTip)}
        </svg>
        {tip && (
          <div className="chart-tip" style={{ left: `${(tip.x / w) * 100}%`, top: `${(tip.y / h) * 100}%` }} role="status">
            {tip.lines.map((line, k) => (
              <div key={k} className={k === 0 ? "font-semibold" : ""}>
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        {source && <p className="max-w-[34rem] text-xs text-soft">{source}</p>}
        <details className="disclosure text-sm">
          <summary className="text-sm">Show as table</summary>
          <table className="data-table mt-2 min-w-[18rem]">
            <thead>
              <tr>
                {table.columns.map((c) => (
                  <th key={c} scope="col">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, k) => (
                <tr key={k}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </div>
    </figure>
  );
}

/** Invisible, focusable hit area larger than the mark it describes. */
export function Hit({
  x,
  y,
  width,
  height,
  tip,
  show,
  label,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  tip: Tip;
  show: (tip: Tip | null) => void;
  label: string;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      className="hit"
      tabIndex={0}
      role="img"
      aria-label={label}
      onMouseEnter={() => show(tip)}
      onFocus={() => show(tip)}
      onBlur={() => show(null)}
    />
  );
}

/** Path for a bar with a 4px rounded data end and a square baseline end. */
export function barPath(x: number, y: number, w: number, h: number, orientation: "h" | "v"): string {
  const r = Math.min(4, orientation === "h" ? w / 2 : h / 2, orientation === "h" ? h / 2 : w / 2);
  if (orientation === "h") {
    return `M${x},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} H${x} Z`;
  }
  return `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`;
}
