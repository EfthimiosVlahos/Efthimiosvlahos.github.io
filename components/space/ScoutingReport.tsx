"use client";

import { ChartFigure, Hit } from "../charts/ChartFigure";
import { SCOUTING } from "@/content/personal";
import { linear } from "@/lib/scales";

const HEAD = "var(--cat-1)";
const TAPE = "var(--cat-2)";

/** A dumbbell chart of made-up Sunday league ratings: self-image on one end, reality on the other. */
export function ScoutingReport() {
  const W = 460;
  const left = 150;
  const right = 20;
  const top = 12;
  const row = 36;
  const H = top + SCOUTING.length * row + 30;
  const x = linear([50, 100], [left, W - right]);
  const rowY = (k: number) => top + k * row + row / 2;

  return (
    <ChartFigure
      title="Scouting report"
      subtitle="Out of 100, rated by me, about me. Deeply unscientific."
      viewBox={[W, H]}
      legend={[
        { label: "In my head", color: HEAD },
        { label: "On the tape", color: TAPE },
      ]}
      table={{
        columns: ["Skill", "In my head", "On the tape", "Note"],
        rows: SCOUTING.map((r) => [r.skill, r.head, r.tape, r.note]),
      }}
      source="Every number here is made up. The appetite rating is the only one I’d defend."
    >
      {(show) => (
        <>
          {[50, 60, 70, 80, 90, 100].map((v) => (
            <g key={v}>
              <line x1={x(v)} x2={x(v)} y1={top} y2={H - 30} className="axis" strokeOpacity={0.5} />
              <text x={x(v)} y={H - 10} textAnchor="middle" style={{ fontSize: 14 }}>
                {v}
              </text>
            </g>
          ))}
          {SCOUTING.map((r, k) => {
            const cy = rowY(k);
            return (
              <g key={r.skill}>
                <text x={left - 12} y={cy + 5} textAnchor="end" style={{ fontSize: 14, fill: "var(--ink)" }}>
                  {r.skill}
                </text>
                <line x1={x(r.head)} x2={x(r.tape)} y1={cy} y2={cy} stroke="var(--ink-soft)" strokeOpacity={0.5} strokeWidth={2} />
                {/* When the two agree, the head rating shows as a ring around the tape's dot. */}
                <circle cx={x(r.head)} cy={cy} r={r.head === r.tape ? 10 : 6} fill={HEAD} stroke="var(--paper-raised)" strokeWidth={2} />
                <circle cx={x(r.tape)} cy={cy} r={6} fill={TAPE} stroke="var(--paper-raised)" strokeWidth={2} />
                <Hit
                  x={0}
                  y={cy - row / 2}
                  width={W}
                  height={row}
                  show={show}
                  label={`${r.skill}: ${r.head} in my head, ${r.tape} on the tape. ${r.note}`}
                  tip={{
                    x: x(Math.max(r.head, r.tape)),
                    y: cy - 10,
                    lines: [r.skill, `In my head: ${r.head}`, `On the tape: ${r.tape}`, r.note],
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
