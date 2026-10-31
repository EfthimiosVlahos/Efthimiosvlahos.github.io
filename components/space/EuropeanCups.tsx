"use client";

import { ChartFigure, Hit } from "../charts/ChartFigure";
import { EUROPEAN_CUPS } from "@/content/realmadrid";
import { linear } from "@/lib/scales";

const GOLD = "#e8c25a";

/** "La Orejona": the big-eared cup, drawn small. */
function Cup({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M-5,-14 h10 v4 q0,8 -5,10 q-5,-2 -5,-10 Z" fill={GOLD} />
      <path d="M-5,-12 q-6,-1 -5,5 q1,4 5,3 M5,-12 q6,-1 5,5 q-1,4 -5,3" fill="none" stroke={GOLD} strokeWidth={1.6} />
      <rect x={-1.2} y={0} width={2.4} height={4} fill={GOLD} />
      <rect x={-4.5} y={4} width={9} height={2.6} rx={1} fill={GOLD} />
    </g>
  );
}

/** Real Madrid's running total of European Cups: two staircases with a 32-year landing between them. */
export function EuropeanCups() {
  const W = 760;
  const H = 300;
  const left = 40;
  const right = 44;
  const top = 34;
  const bottom = 40;
  const x = linear([1954, 2026], [left, W - right]);
  const y = linear([0, 15], [H - bottom, top]);
  const base = y(0);

  let d = `M${x(1955)},${base}`;
  EUROPEAN_CUPS.forEach((c, k) => {
    d += ` H${x(c.year)} V${y(k + 1)}`;
  });
  d += ` H${x(2026)}`;
  const area = `${d} V${base} Z`;

  // Each final's hover band reaches halfway to its neighbours, so dense years stay separately reachable.
  const band = (k: number) => {
    const cx = x(EUROPEAN_CUPS[k]!.year);
    const prev = EUROPEAN_CUPS[k - 1];
    const next = EUROPEAN_CUPS[k + 1];
    const x0 = prev ? Math.max((x(prev.year) + cx) / 2, cx - 14) : cx - 14;
    const x1 = next ? Math.min((x(next.year) + cx) / 2, cx + 14) : cx + 14;
    return [x0, x1] as const;
  };

  return (
    <ChartFigure
      title="Fifteen European Cups"
      subtitle="Real Madrid’s running total, the most of any club, which explains my expectations. Hover or tab along the line for each final."
      viewBox={[W, H]}
      table={{
        columns: ["Year", "Final", "Score", "Total"],
        rows: EUROPEAN_CUPS.map((c, k) => [c.year, c.opponent, c.score, k + 1]),
      }}
      source="Counted through the 2026 final. We don’t talk about 2025 or 2026."
      minWidth={640}
    >
      {(show) => (
        <>
          {[0, 5, 10, 15].map((v) => (
            <g key={v}>
              <line x1={left} x2={W - right} y1={y(v)} y2={y(v)} className="axis" strokeOpacity={v ? 0.5 : 1} />
              <text x={left - 8} y={y(v) + 4} textAnchor="end">
                {v}
              </text>
            </g>
          ))}
          {[1960, 1970, 1980, 1990, 2000, 2010, 2020].map((yr) => (
            <text key={yr} x={x(yr)} y={base + 22} textAnchor="middle">
              {yr}
            </text>
          ))}

          <path d={area} fill={GOLD} fillOpacity={0.08} />
          <path d={d} fill="none" stroke={GOLD} strokeWidth={2} strokeLinejoin="round" />
          {EUROPEAN_CUPS.map((c, k) => (
            <circle key={c.year} cx={x(c.year)} cy={y(k + 1)} r={4} fill={GOLD} stroke="var(--paper-raised)" strokeWidth={2} />
          ))}

          {/* Direct labels for the three chapters. */}
          <text x={x(1961)} y={y(5) + 20} style={{ fontSize: 12 }}>
            five in a row, 1956–60
          </text>
          <text x={x(1982)} y={y(6) - 10} textAnchor="middle" style={{ fontSize: 12 }}>
            32 years from the sixth to the seventh
          </text>
          <text x={x(2013)} y={y(12)} textAnchor="end" style={{ fontSize: 12 }}>
            four in five seasons, 2014–18
          </text>
          <Cup x={x(2026) + 16} y={y(15) - 6} s={0.9} />
          <text x={x(2026) + 16} y={y(15) + 18} textAnchor="middle" style={{ fontWeight: 700 }}>
            15
          </text>

          {EUROPEAN_CUPS.map((c, k) => {
            const [x0, x1] = band(k);
            return (
              <Hit
                key={`hit-${c.year}`}
                x={x0}
                y={top - 10}
                width={x1 - x0}
                height={base - top + 10}
                show={show}
                label={`${c.year}: beat ${c.opponent}, ${c.score}. Cup number ${k + 1}.`}
                tip={{
                  x: x(c.year),
                  y: y(k + 1) - 10,
                  lines: [`${c.year}: number ${k + 1}`, `vs ${c.opponent}, ${c.score}`, ...(c.note ? [c.note] : [])],
                }}
              />
            );
          })}
        </>
      )}
    </ChartFigure>
  );
}
