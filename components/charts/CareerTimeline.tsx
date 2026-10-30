"use client";

import { ChartFigure, Hit, barPath } from "./ChartFigure";
import { education, formatRange, roles } from "@/content/experience";
import { linear } from "@/lib/scales";

type Kind = "full-time" | "contract" | "venture";

const KIND: Record<string, Kind> = {
  alliant: "full-time",
  conedison: "full-time",
  cornerstone: "contract",
  microsoft: "contract",
  pyxeon: "venture",
};

const COLOR: Record<Kind, string> = {
  // First three categorical slots: the only trio that validates all-pairs in both modes.
  "full-time": "var(--cat-1)",
  contract: "var(--cat-3)",
  venture: "var(--cat-2)",
};

/** Fractional year from an ISO month, at the month's midpoint. */
const year = (iso: string) => {
  const [y, m] = iso.split("-").map(Number);
  return (y ?? 0) + ((m ?? 1) - 0.5) / 12;
};

export function CareerTimeline({ today = "2026-10" }: { today?: string }) {
  const rows = [...roles].reverse();
  const W = 860;
  const left = 214;
  const right = 24;
  const rowH = 40;
  const top = 34;
  const H = top + rows.length * rowH + 40;
  const x = linear([2020, 2027], [left, W - right]);
  const bar = 18;
  const now = year(today);

  return (
    <ChartFigure
      title="Six years, five roles"
      subtitle="Contract analytics and data science first, then ML engineering, then production AI and a company of my own."
      viewBox={[W, H]}
      legend={[
        { label: "Full-time", color: COLOR["full-time"], shape: "bar" },
        { label: "Contract", color: COLOR.contract, shape: "bar" },
        { label: "Own venture", color: COLOR.venture, shape: "bar" },
      ]}
      table={{
        columns: ["Role", "Organization", "Dates"],
        rows: roles.map((r) => [r.title, r.org, formatRange(r.start, r.end)]),
      }}
      source={`Degrees: ${education.map((e) => `${e.degree.split(",")[0]} ${e.year}`).join(", ")}.`}
    >
      {(show) => (
        <>
          {[2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027].map((t) => (
            <g key={t}>
              <line x1={x(t)} x2={x(t)} y1={top - 8} y2={H - 30} className="axis" />
              <text x={x(t)} y={H - 12} textAnchor="middle">
                {t}
              </text>
            </g>
          ))}
          {/* Degree milestones on the top rail. */}
          {[
            { label: "BS, Hunter", at: 2020.38 },
            { label: "MS, Stony Brook", at: 2023.38 },
          ].map((m) => (
            <g key={m.label}>
              <path d={`M${x(m.at)},${top - 22} l5,5 l-5,5 l-5,-5 Z`} fill="var(--ink-soft)" />
              <text x={x(m.at) + 9} y={top - 13}>
                {m.label}
              </text>
            </g>
          ))}
          <line x1={x(now)} x2={x(now)} y1={top - 8} y2={H - 30} stroke="var(--blue)" strokeWidth={1.5} />
          <text x={x(now)} y={top - 13} textAnchor="end" dx={-6} style={{ fill: "var(--blue)", fontWeight: 600 }}>
            today
          </text>
          {rows.map((r, k) => {
            const y = top + k * rowH + (rowH - bar) / 2;
            const x0 = x(year(r.start));
            const x1 = x(r.end ? year(r.end) : now);
            const kind = KIND[r.id] ?? "full-time";
            return (
              <g key={r.id}>
                <text x={left - 14} y={y + bar / 2 + 4.5} textAnchor="end" style={{ fill: "var(--ink)", fontSize: 13.5, fontWeight: 600 }}>
                  {r.org}
                </text>
                <path d={barPath(x0, y, Math.max(6, x1 - x0), bar, "h")} fill={COLOR[kind]} />
                <Hit
                  x={left - 210}
                  y={top + k * rowH}
                  width={W - left + 210 - right}
                  height={rowH}
                  show={show}
                  label={`${r.title}, ${r.org}, ${formatRange(r.start, r.end)}`}
                  tip={{ x: (x0 + x1) / 2, y, lines: [r.title, r.org, formatRange(r.start, r.end)] }}
                />
              </g>
            );
          })}
        </>
      )}
    </ChartFigure>
  );
}
