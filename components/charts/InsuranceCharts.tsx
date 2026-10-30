"use client";

import { ChartFigure, Hit, barPath } from "./ChartFigure";
import { formatDuration, linear, log10 } from "@/lib/scales";

const BLUE = "var(--mark-blue)";
const RED = "var(--mark-red)";
const MUTED = "var(--mark-muted)";

/* ------------------------------------------------------------------ model bake-off */

const BAKEOFF = [
  { model: "Qwen3.5-35B-A3B, self-hosted", acc: 93.9, chosen: true, note: "promoted to production" },
  { model: "GPT-5.1 on Azure", acc: 91.5, reported: 93.8, note: "rescored after the scorer fix" },
  { model: "Qwen2.5-VL-32B, self-hosted", acc: 60.7, note: "early trial, rejected" },
];

export function BakeoffChart() {
  const W = 640;
  const left = 214;
  const right = 70;
  const rowH = 52;
  const top = 8;
  const H = top + BAKEOFF.length * rowH + 30;
  const x = linear([0, 100], [left, W - right]);
  const bar = 20;

  return (
    <ChartFigure
      title="Field accuracy on 39 hand-labeled documents"
      subtitle="The self-hosted model beat the API it replaced, at no per-document cost."
      viewBox={[W, H]}
      legend={[
        { label: "Field accuracy", color: BLUE, shape: "bar" },
        { label: "Score first reported for GPT-5.1, before I fixed the scorer", color: RED, shape: "tick" },
      ]}
      table={{
        columns: ["Model", "Field accuracy", "Note"],
        rows: BAKEOFF.map((d) => [d.model, `${d.acc}%`, d.reported ? `first reported as ${d.reported}%` : d.note]),
      }}
      source="Each document scored field by field against my hand labels. The scorer had skipped 10 non-standard documents, which inflated GPT-5.1’s first score."
    >
      {(show) => (
        <>
          {[0, 25, 50, 75, 100].map((t) => (
            <g key={t}>
              <line x1={x(t)} x2={x(t)} y1={top} y2={H - 26} className="axis" />
              <text x={x(t)} y={H - 8} textAnchor="middle">
                {t}%
              </text>
            </g>
          ))}
          {BAKEOFF.map((d, k) => {
            const y = top + k * rowH + (rowH - bar) / 2;
            const w = x(d.acc) - x(0);
            return (
              <g key={d.model}>
                <text x={left - 12} y={y + bar / 2 + 4.5} textAnchor="end" style={{ fill: "var(--ink)", fontSize: 13.5 }}>
                  {d.model}
                </text>
                <path d={barPath(x(0), y, w, bar, "h")} fill={d.chosen ? BLUE : MUTED} />
                <text x={Math.max(x(d.acc), d.reported ? x(d.reported) : 0) + 8} y={y + bar / 2 + 4.5} className="value">
                  {d.acc}%
                </text>
                {d.reported && (
                  <line x1={x(d.reported)} x2={x(d.reported)} y1={y - 6} y2={y + bar + 6} stroke={RED} strokeWidth={2.5} />
                )}
                <Hit
                  x={left - 200}
                  y={top + k * rowH}
                  width={W - left + 200 - 10}
                  height={rowH}
                  show={show}
                  label={`${d.model}: ${d.acc}%`}
                  tip={{
                    x: x(d.acc),
                    y,
                    lines: [d.model, `${d.acc}% field accuracy`, d.reported ? `First reported: ${d.reported}%` : d.note],
                  }}
                />
              </g>
            );
          })}
        </>
      )}
    </ChartFigure>
  );
}

/* ------------------------------------------------------------------ honest-number waterfall */

const WATERFALL = [
  { label: "AI approved, later rejected", value: 248, kind: "total" as const, pct: "0.75%" },
  { label: "Rejected before the AI answered", value: -174, kind: "step" as const },
  { label: "CRM automation conflict", value: -40, kind: "step" as const },
  { label: "True reviewer reversals", value: 34, kind: "total" as const, pct: "0.10%" },
];

/** Stack each step on the running total once, at module load, so render stays pure. */
const WATERFALL_COLS = WATERFALL.reduce<{ cols: (typeof WATERFALL[number] & { lo: number; hi: number })[]; total: number }>(
  (acc, d) => {
    const from = d.kind === "total" ? 0 : acc.total + d.value;
    const to = d.kind === "total" ? d.value : acc.total;
    acc.cols.push({ ...d, lo: Math.min(from, to), hi: Math.max(from, to) });
    return { cols: acc.cols, total: d.kind === "total" ? d.value : acc.total + d.value };
  },
  { cols: [], total: 0 },
).cols;

export function WaterfallChart() {
  const W = 640;
  const H = 300;
  const left = 44;
  const bottom = 58;
  const top = 26;
  const y = linear([0, 250], [H - bottom, top]);
  const slot = (W - left - 10) / WATERFALL.length;
  const colW = 24;

  const cols = WATERFALL_COLS;

  return (
    <ChartFigure
      title="Tracing “0.75% approved, then rejected” to the honest number"
      subtitle="Every one of the 248 cases traced by hand."
      viewBox={[W, H]}
      legend={[
        { label: "Cases counted", color: BLUE, shape: "bar" },
        { label: "Explained away", color: MUTED, shape: "bar" },
      ]}
      table={{
        columns: ["Step", "Cases"],
        rows: WATERFALL.map((d) => [d.label, d.kind === "step" ? `−${Math.abs(d.value)}` : `${d.value} (${d.pct})`]),
      }}
      source="Seven-week window. The automation conflict: the CRM closed cases as rejected in the same minute it set them auto-approved, which I handed to its vendor as a bug."
    >
      {(show) => (
        <>
          {[0, 50, 100, 150, 200, 250].map((t) => (
            <g key={t}>
              <line x1={left} x2={W - 10} y1={y(t)} y2={y(t)} className="axis" />
              <text x={left - 8} y={y(t) + 4} textAnchor="end">
                {t}
              </text>
            </g>
          ))}
          {cols.map((c, k) => {
            const cx = left + slot * k + slot / 2;
            const yTop = y(c.hi);
            const hgt = y(c.lo) - y(c.hi);
            const words = c.label.split(" ");
            const mid = Math.ceil(words.length / 2);
            return (
              <g key={c.label}>
                {k > 0 && (
                  <line
                    x1={left + slot * (k - 1) + slot / 2 + colW / 2}
                    x2={cx - colW / 2}
                    y1={y(c.kind === "total" ? c.hi : c.hi)}
                    y2={y(c.kind === "total" ? c.hi : c.hi)}
                    stroke="var(--ink-soft)"
                    strokeWidth={1}
                  />
                )}
                <path
                  d={c.kind === "total" ? barPath(cx - colW / 2, yTop, colW, hgt, "v") : `M${cx - colW / 2},${yTop} h${colW} v${hgt} h${-colW} Z`}
                  fill={c.kind === "total" ? BLUE : MUTED}
                />
                <text x={cx} y={yTop - 8} textAnchor="middle" className="value">
                  {c.kind === "total" ? `${c.value} (${c.pct})` : `−${Math.abs(c.value)}`}
                </text>
                <text x={cx} y={H - bottom + 20} textAnchor="middle">
                  {words.slice(0, mid).join(" ")}
                </text>
                <text x={cx} y={H - bottom + 36} textAnchor="middle">
                  {words.slice(mid).join(" ")}
                </text>
                <Hit
                  x={cx - slot / 2 + 4}
                  y={top}
                  width={slot - 8}
                  height={H - bottom - top}
                  show={show}
                  label={`${c.label}: ${c.value}`}
                  tip={{ x: cx, y: yTop, lines: [c.label, c.kind === "step" ? `${Math.abs(c.value)} cases removed` : `${c.value} cases, ${c.pct}`] }}
                />
              </g>
            );
          })}
        </>
      )}
    </ChartFigure>
  );
}

/* ------------------------------------------------------------------ time to recovery */

const RECOVERY = [
  { failure: "Model server hung but “healthy”", before: 2 * 86400, after: 120, afterLabel: "~2 min" },
  { failure: "Database connection pool exhausted", before: 2 * 3600, after: 47, afterLabel: "47 s" },
  { failure: "Nightly cleanup froze the event loop", before: 36 * 60, after: 5, afterLabel: "4–6 s" },
];

export function RecoveryChart() {
  const W = 640;
  const left = 236;
  const right = 24;
  const rowH = 54;
  const top = 10;
  const H = top + RECOVERY.length * rowH + 34;
  const x = log10([1, 3 * 86400], [left, W - right]);
  const ticks = [
    { v: 1, l: "1 s" },
    { v: 60, l: "1 min" },
    { v: 3600, l: "1 h" },
    { v: 86400, l: "1 day" },
  ];

  return (
    <ChartFigure
      title="Time lost to each failure, before and after"
      subtitle="Log scale: each gridline is a bigger unit of time."
      viewBox={[W, H]}
      legend={[
        { label: "Before: outage or stall", color: RED },
        { label: "After: automatic recovery", color: BLUE },
      ]}
      table={{
        columns: ["Failure", "Before", "After"],
        rows: RECOVERY.map((d) => [d.failure, formatDuration(d.before), d.afterLabel]),
      }}
      source="The hung model server was the original two-day outage: every health check stayed green while nothing was processed. The watchdog now probes real generation."
    >
      {(show) => (
        <>
          {ticks.map((t) => (
            <g key={t.v}>
              <line x1={x(t.v)} x2={x(t.v)} y1={top} y2={H - 28} className="axis" />
              <text x={x(t.v)} y={H - 10} textAnchor="middle">
                {t.l}
              </text>
            </g>
          ))}
          {RECOVERY.map((d, k) => {
            const cy = top + k * rowH + rowH / 2;
            const xb = x(d.before);
            const xa = x(d.after);
            return (
              <g key={d.failure}>
                <text x={left - 14} y={cy + 4.5} textAnchor="end" style={{ fill: "var(--ink)", fontSize: 13.5 }}>
                  {d.failure}
                </text>
                <line x1={xa} x2={xb} y1={cy} y2={cy} stroke={MUTED} strokeWidth={2} strokeLinecap="round" />
                <circle cx={xb} cy={cy} r={6} fill={RED} stroke="var(--paper-raised)" strokeWidth={2} />
                <circle cx={xa} cy={cy} r={6} fill={BLUE} stroke="var(--paper-raised)" strokeWidth={2} />
                <text x={xa} y={cy - 12} textAnchor="middle" className="value">
                  {d.afterLabel}
                </text>
                <text x={xb} y={cy - 12} textAnchor="middle" className="value">
                  {formatDuration(d.before)}
                </text>
                <Hit
                  x={left - 230}
                  y={top + k * rowH}
                  width={W - left + 230 - right}
                  height={rowH}
                  show={show}
                  label={`${d.failure}: ${formatDuration(d.before)} before, ${d.afterLabel} after`}
                  tip={{ x: (xa + xb) / 2, y: cy - 14, lines: [d.failure, `Before: ${formatDuration(d.before)}`, `After: ${d.afterLabel}`] }}
                />
              </g>
            );
          })}
        </>
      )}
    </ChartFigure>
  );
}

/* ------------------------------------------------------------------ scanned-mail review rounds */

const ROUNDS = [
  { round: 1, rate: 10.1, label: true },
  { round: 2, rate: 5.1, label: false },
  { round: 3, rate: 6.4, label: true },
  { round: 4, rate: 2.7, label: true },
];

export function ReviewRoundsChart() {
  const W = 640;
  const H = 250;
  const left = 46;
  const right = 30;
  const top = 24;
  const bottom = 40;
  const x = linear([1, 4], [left + 30, W - right - 30]);
  const y = linear([0, 12], [H - bottom, top]);
  const d = ROUNDS.map((p, k) => `${k ? "L" : "M"}${x(p.round)},${y(p.rate)}`).join(" ");

  return (
    <ChartFigure
      title="Rows that reviewers failed, per review round"
      subtitle="Scanned-mail pipeline. Every failed row was checked against the PDF before it counted."
      viewBox={[W, H]}
      table={{ columns: ["Review round", "Rows failed"], rows: ROUNDS.map((p) => [p.round, `${p.rate}%`]) }}
      source="In the last round, 3 of 25 “fails” turned out to be reviewer errors, so the true rate was about 2.3%. Missed cancellations: 0.22%."
    >
      {(show) => (
        <>
          {[0, 3, 6, 9, 12].map((t) => (
            <g key={t}>
              <line x1={left} x2={W - right} y1={y(t)} y2={y(t)} className="axis" />
              <text x={left - 8} y={y(t) + 4} textAnchor="end">
                {t}%
              </text>
            </g>
          ))}
          <path d={d} fill="none" stroke={BLUE} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {ROUNDS.map((p) => (
            <g key={p.round}>
              <circle cx={x(p.round)} cy={y(p.rate)} r={5} fill={BLUE} stroke="var(--paper-raised)" strokeWidth={2} />
              {p.label && (
                <text x={x(p.round)} y={y(p.rate) - 13} textAnchor="middle" className="value">
                  {p.rate}%
                </text>
              )}
              <text x={x(p.round)} y={H - bottom + 22} textAnchor="middle">
                Round {p.round}
              </text>
              <Hit
                x={x(p.round) - 40}
                y={top}
                width={80}
                height={H - bottom - top}
                show={show}
                label={`Round ${p.round}: ${p.rate}%`}
                tip={{ x: x(p.round), y: y(p.rate) - 6, lines: [`Round ${p.round}`, `${p.rate}% of rows failed`] }}
              />
            </g>
          ))}
        </>
      )}
    </ChartFigure>
  );
}
