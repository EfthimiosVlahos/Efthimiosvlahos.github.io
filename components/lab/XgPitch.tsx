"use client";

import { useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { COEF, GOAL_WIDTH, features, shotOutcomes, xg, type Shot } from "@/lib/xg";

const K = 10; // pixels per meter
const HALF_W = 34; // half the pitch width, meters
const DEPTH = 36; // meters shown out from the goal line
const CELL = 2;
const BINS = [0.02, 0.05, 0.1, 0.2, 0.35];
const OPACITY = [0.03, 0.12, 0.22, 0.36, 0.55, 0.8];

const px = (x: number) => (x + HALF_W) * K;
const py = (y: number) => y * K;

const PRESETS: { label: string; shot: Shot }[] = [
  { label: "Six-yard box", shot: { x: 0, y: 5 } },
  { label: "Penalty spot", shot: { x: 0, y: 11 } },
  { label: "Edge of the box", shot: { x: 4, y: 17 } },
  { label: "Tight angle", shot: { x: 14, y: 3 } },
  { label: "From distance", shot: { x: -6, y: 28 } },
];

function bin(p: number): number {
  const i = BINS.findIndex((b) => p < b);
  return i === -1 ? BINS.length : i;
}

export function XgPitch() {
  const svg = useRef<SVGSVGElement>(null);
  const [shot, setShot] = useState<Shot>({ x: 4, y: 17 });
  const [trial, setTrial] = useState<{ goals: number; shots: number; outcomes: boolean[] } | null>(null);
  const [seed, setSeed] = useState(17);

  const p = xg(shot);
  const { angle, distance } = features(shot);

  const cells = useMemo(() => {
    const out: { x: number; y: number; b: number }[] = [];
    for (let y = 0; y < DEPTH; y += CELL) {
      for (let x = -HALF_W; x < HALF_W; x += CELL) out.push({ x, y, b: bin(xg({ x: x + CELL / 2, y: y + CELL / 2 })) });
    }
    return out;
  }, []);

  const place = (next: Shot) => {
    setShot({ x: Math.max(-HALF_W + 0.5, Math.min(HALF_W - 0.5, next.x)), y: Math.max(0.5, Math.min(DEPTH - 0.5, next.y)) });
    setTrial(null);
  };

  const onClick = (e: MouseEvent<SVGSVGElement>) => {
    const el = svg.current;
    const ctm = el?.getScreenCTM();
    if (!el || !ctm) return;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    place({ x: pt.x / K - HALF_W, y: pt.y / K });
  };

  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    const step = e.shiftKey ? 5 : 1;
    const moves: Record<string, Shot> = {
      ArrowLeft: { x: shot.x - step, y: shot.y },
      ArrowRight: { x: shot.x + step, y: shot.y },
      ArrowUp: { x: shot.x, y: shot.y - step },
      ArrowDown: { x: shot.x, y: shot.y + step },
    };
    const next = moves[e.key];
    if (next) {
      e.preventDefault();
      place(next);
    }
  };

  const takeShots = () => {
    const outcomes = shotOutcomes(p, 100, seed);
    setTrial({ goals: outcomes.filter(Boolean).length, shots: 100, outcomes });
    setSeed((s) => s + 1);
  };

  const line = "var(--ink-soft)";
  const arcDx = Math.sqrt(9.15 ** 2 - 5.5 ** 2);

  return (
    <div className="card overflow-hidden">
      <div className="grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="border-b border-rule p-4 sm:p-6 lg:border-r lg:border-b-0">
          <svg
            ref={svg}
            viewBox={`0 -30 ${HALF_W * 2 * K} ${DEPTH * K + 30}`}
            className="block h-auto w-full cursor-crosshair rounded-xl bg-sunken outline-none focus-visible:ring-2 focus-visible:ring-blue"
            role="application"
            tabIndex={0}
            aria-label={`Soccer pitch. Shot ${distance.toFixed(1)} meters from goal, expected goals ${p.toFixed(2)}. Click or use arrow keys to move the shot.`}
            onClick={onClick}
            onKeyDown={onKey}
          >
            <g aria-hidden="true">
              {cells.map((c) => (
                <rect
                  key={`${c.x},${c.y}`}
                  x={px(c.x)}
                  y={py(c.y)}
                  width={CELL * K}
                  height={CELL * K}
                  fill="var(--mark-blue)"
                  fillOpacity={OPACITY[c.b]}
                />
              ))}
              <g fill="none" stroke={line} strokeOpacity={0.55} strokeWidth={2}>
                <rect x={px(-HALF_W)} y={0} width={HALF_W * 2 * K} height={DEPTH * K} />
                <rect x={px(-20.16)} y={0} width={40.32 * K} height={16.5 * K} />
                <rect x={px(-9.16)} y={0} width={18.32 * K} height={5.5 * K} />
                <path d={`M${px(-arcDx)},${py(16.5)} A${9.15 * K},${9.15 * K} 0 0 0 ${px(arcDx)},${py(16.5)}`} />
                <rect x={px(-GOAL_WIDTH / 2)} y={-20} width={GOAL_WIDTH * K} height={20} strokeOpacity={0.9} />
              </g>
              <circle cx={px(0)} cy={py(11)} r={3} fill={line} fillOpacity={0.6} />

              {/* The goal-mouth angle the model uses as a feature. */}
              <polygon
                points={`${px(shot.x)},${py(shot.y)} ${px(-GOAL_WIDTH / 2)},0 ${px(GOAL_WIDTH / 2)},0`}
                fill="var(--blue-strong)"
                fillOpacity={0.18}
                stroke="var(--blue-strong)"
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
              <circle cx={px(shot.x)} cy={py(shot.y)} r={9} fill="#fff" stroke="var(--blue-strong)" strokeWidth={3} />
            </g>
          </svg>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-soft">
            <span>Chance of scoring:</span>
            {OPACITY.map((o, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="inline-block size-3 rounded-sm" style={{ background: "var(--mark-blue)", opacity: Math.max(o, 0.08) }} aria-hidden="true" />
                {i === 0 ? `<${BINS[0]}` : i === OPACITY.length - 1 ? `${BINS[BINS.length - 1]}+` : `${BINS[i - 1]}–${BINS[i]}`}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 p-5 sm:p-6" aria-live="polite">
          <div>
            <div className="text-sm text-soft">Expected goals from this spot</div>
            <div className="gradient-text text-6xl font-extrabold tracking-tight">{p.toFixed(2)}</div>
            <div className="mt-1 text-sm text-soft">
              {distance.toFixed(1)} m from goal, goal mouth {((angle * 180) / Math.PI).toFixed(0)}° wide
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((pr) => (
              <button
                key={pr.label}
                type="button"
                onClick={() => place(pr.shot)}
                className="rounded-full border border-rule px-3 py-1.5 text-sm text-soft transition-colors hover:border-blue hover:text-blue"
              >
                {pr.label}
              </button>
            ))}
          </div>

          <div>
            <button type="button" className="btn btn-primary" onClick={takeShots}>
              Take 100 shots from here
            </button>
            {trial && (
              <div className="mt-4">
                <p>
                  <span className="text-2xl font-bold">{trial.goals}</span>
                  <span className="text-soft"> goals from 100 shots, against {(p * 100).toFixed(0)} expected.</span>
                </p>
                <div className="mt-2 grid w-fit grid-cols-[repeat(20,0.65rem)] gap-1" aria-hidden="true">
                  {trial.outcomes.map((g, i) => (
                    <span
                      key={i}
                      className="size-2.5 rounded-full"
                      style={g ? { background: "var(--mark-blue)" } : { border: "1.5px solid var(--mark-muted)" }}
                    />
                  ))}
                </div>
                <p className="mt-2 text-sm text-soft">
                  Run it again and the count moves. That gap is variance, which is why analysts judge chances by xG
                  rather than by goals.
                </p>
              </div>
            )}
          </div>

          <p className="mt-auto rounded-xl bg-sunken p-3 font-mono text-xs leading-relaxed text-soft">
            xG = σ({COEF.intercept.toFixed(2)} + {COEF.angle.toFixed(2)}·angle − {Math.abs(COEF.distance).toFixed(2)}·distance)
          </p>
        </div>
      </div>
    </div>
  );
}
