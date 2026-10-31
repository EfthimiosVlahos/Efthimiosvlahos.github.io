"use client";

import { useId, useState } from "react";
import { ChartFigure, Hit } from "../charts/ChartFigure";
import { brzycki, epley, repMaxes, toPlates } from "@/lib/strength";
import { linear } from "@/lib/scales";
import { LIFTS, type LiftId } from "@/content/personal";

const EPLEY = "var(--cat-1)";
const BRZYCKI = "var(--cat-2)";

/** Estimate a one-rep max from a set, and see what that max predicts across rep ranges. */
export function OneRepMax() {
  const id = useId();
  const [unit, setUnit] = useState<"lb" | "kg">("lb");
  const [lift, setLift] = useState<LiftId>("squat");
  const [weight, setWeight] = useState(315);
  const [reps, setReps] = useState(5);

  const e = epley(weight, reps);
  const b = brzycki(weight, reps);
  const avg = (e + b) / 2;
  const table = repMaxes(avg, 12);

  // Designed narrow so it fits a phone without scrolling; labels are a touch larger to match.
  const W = 460;
  const H = 260;
  const left = 54;
  const right = 20;
  const top = 18;
  const bottom = 40;
  const values = table.flatMap((r) => [r.epley, r.brzycki]);
  const max = Math.max(...values);
  const min = Math.min(...values);
  // Zoom to the data (a line chart needn't start at zero) so the gap between the formulas is visible.
  const stepSize = [2.5, 5, 10, 20, 25, 50, 100].find((st) => (max - min) / st <= 5) ?? 100;
  const lo = Math.floor(min / stepSize) * stepSize;
  const hi = Math.ceil(max / stepSize) * stepSize;
  const ticks = Array.from({ length: Math.round((hi - lo) / stepSize) + 1 }, (_, k) => lo + k * stepSize);
  const x = linear([1, 12], [left, W - right]);
  const y = linear([lo, hi], [H - bottom, top]);
  const line = (key: "epley" | "brzycki") => table.map((r, k) => `${k ? "L" : "M"}${x(r.reps)},${y(r[key])}`).join(" ");

  const current = LIFTS.find((l) => l.id === lift) ?? LIFTS[1];
  const pickLift = (next: LiftId) => {
    const l = LIFTS.find((m) => m.id === next);
    if (!l) return;
    setLift(next);
    setWeight(l[unit]);
  };

  const setUnitConverting = (next: "lb" | "kg") => {
    if (next === unit) return;
    setWeight((w) => toPlates(next === "kg" ? w / 2.2046 : w * 2.2046, next));
    setUnit(next);
  };

  return (
    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] [&>figure]:my-0">
      <div className="card flex flex-col gap-5 p-6">
        <div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Lift">
            {LIFTS.map((l) => (
              <button key={l.id} type="button" aria-pressed={lift === l.id} onClick={() => pickLift(l.id)} className="toggle">
                {l.name}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-soft" aria-live="polite">
            {current.quip}
          </p>
        </div>
        <div className="flex gap-2" role="group" aria-label="Units">
          {(["lb", "kg"] as const).map((u) => (
            <button
              key={u}
              type="button"
              aria-pressed={unit === u}
              onClick={() => setUnitConverting(u)}
              className="toggle"
            >
              {u}
            </button>
          ))}
        </div>
        <div>
          <div className="flex items-baseline justify-between text-sm">
            <label htmlFor={`${id}-w`} className="font-medium">
              Weight on the bar
            </label>
            <span className="font-semibold tabular-nums">
              {weight} {unit}
            </span>
          </div>
          <input
            id={`${id}-w`}
            type="range"
            min={unit === "lb" ? 45 : 20}
            max={unit === "lb" ? 600 : 270}
            step={unit === "lb" ? 5 : 2.5}
            value={weight}
            onChange={(ev) => setWeight(Number(ev.target.value))}
            className="mt-2 w-full accent-[var(--blue-strong)]"
          />
        </div>
        <div>
          <div className="flex items-baseline justify-between text-sm">
            <label htmlFor={`${id}-r`} className="font-medium">
              Reps you got
            </label>
            <span className="font-semibold tabular-nums">{reps}</span>
          </div>
          <input
            id={`${id}-r`}
            type="range"
            min={1}
            max={12}
            step={1}
            value={reps}
            onChange={(ev) => setReps(Number(ev.target.value))}
            className="mt-2 w-full accent-[var(--blue-strong)]"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-rule pt-4" aria-live="polite">
          <div>
            <div className="text-xs text-soft">Epley</div>
            <div className="text-3xl font-bold tabular-nums">{toPlates(e, unit)}</div>
          </div>
          <div>
            <div className="text-xs text-soft">Brzycki</div>
            <div className="text-3xl font-bold tabular-nums">{toPlates(b, unit)}</div>
          </div>
        </div>
        <p className="text-sm text-soft">
          Estimated one-rep max, rounded to loadable plates. The two formulas match exactly at ten reps and drift apart
          on either side.
        </p>
      </div>

      <ChartFigure
        title="What that max predicts at every rep count"
        subtitle={`From a ${toPlates(avg, unit)} ${unit} one-rep max (the average of both formulas)`}
        viewBox={[W, H]}
        legend={[
          { label: "Epley", color: EPLEY },
          { label: "Brzycki", color: BRZYCKI },
        ]}
        table={{
          columns: ["Reps", `Epley (${unit})`, `Brzycki (${unit})`],
          rows: table.map((r) => [r.reps, toPlates(r.epley, unit), toPlates(r.brzycki, unit)]),
        }}
      >
        {(show) => (
          <>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={left} x2={W - right} y1={y(t)} y2={y(t)} className="axis" />
                <text x={left - 8} y={y(t) + 4} textAnchor="end" style={{ fontSize: 14 }}>
                  {t}
                </text>
              </g>
            ))}
            {table.map((r) => (
              <text key={r.reps} x={x(r.reps)} y={H - bottom + 20} textAnchor="middle" style={{ fontSize: 14 }}>
                {r.reps}
              </text>
            ))}
            <text x={(left + W - right) / 2} y={H - 4} textAnchor="middle" style={{ fontSize: 14 }}>
              reps
            </text>
            <line x1={x(reps)} x2={x(reps)} y1={top} y2={H - bottom} stroke="var(--blue)" strokeOpacity={0.4} strokeDasharray="3 4" />
            <path d={line("epley")} fill="none" stroke={EPLEY} strokeWidth={2} strokeLinejoin="round" />
            <path d={line("brzycki")} fill="none" stroke={BRZYCKI} strokeWidth={2} strokeLinejoin="round" />
            {table.map((r) => (
              <g key={`p${r.reps}`}>
                <circle cx={x(r.reps)} cy={y(r.epley)} r={4} fill={EPLEY} stroke="var(--paper-raised)" strokeWidth={2} />
                <circle cx={x(r.reps)} cy={y(r.brzycki)} r={4} fill={BRZYCKI} stroke="var(--paper-raised)" strokeWidth={2} />
                <Hit
                  x={x(r.reps) - 17}
                  y={top}
                  width={34}
                  height={H - bottom - top}
                  show={show}
                  label={`${r.reps} reps: Epley ${toPlates(r.epley, unit)}, Brzycki ${toPlates(r.brzycki, unit)} ${unit}`}
                  tip={{
                    x: x(r.reps),
                    y: y(Math.max(r.epley, r.brzycki)) - 6,
                    lines: [`${r.reps} reps`, `Epley ${toPlates(r.epley, unit)} ${unit}`, `Brzycki ${toPlates(r.brzycki, unit)} ${unit}`],
                  }}
                />
              </g>
            ))}
          </>
        )}
      </ChartFigure>
    </div>
  );
}
