"use client";

import { useEffect, useRef, useState } from "react";
import { bobs, separation, step, type PendulumState } from "@/lib/pendulum";

const START: PendulumState = { t1: 2.0, t2: 2.4, w1: 0, w2: 0 };
const NUDGES = [
  { label: "1 / 1,000 rad", value: 1e-3 },
  { label: "1 / 1,000,000 rad", value: 1e-6 },
  { label: "1 / 1,000,000,000 rad", value: 1e-9 },
];
const BLUE = "#60a5fa";
const AMBER = "#fbbf24";
const DT = 0.002;
const TRAIL = 220;

/**
 * Two double pendulums released a hair apart. For a few seconds they move as one; then the tiny
 * difference grows exponentially until their swings have nothing in common.
 */
export function DoublePendulum() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [nudge, setNudge] = useState(1e-3);
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [divergedAt, setDivergedAt] = useState<number | null>(null);
  const [series, setSeries] = useState<[number, number][]>([]);

  // Start swinging when it scrolls into view, unless the visitor prefers reduced motion.
  useEffect(() => {
    const cv = canvas.current;
    if (!cv || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setPlaying(true);
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(cv);
    return () => io.disconnect();
  }, []);

  const restart = (nextNudge = nudge) => {
    setNudge(nextNudge);
    setDivergedAt(null);
    setSeries([]);
    setRun((r) => r + 1);
    setPlaying(true);
  };

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    let a: PendulumState = { ...START };
    let b: PendulumState = { ...START, t1: START.t1 + nudge };
    let t = 0;
    let raf = 0;
    let last = performance.now();
    let w = 0;
    let h = 0;
    let lastSample = -1;
    const trailA: [number, number][] = [];
    const trailB: [number, number][] = [];
    const samples: [number, number][] = [];
    let diverged = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const scale = Math.min(w, h) * 0.22;
      const ox = w / 2;
      const oy = h * 0.42;
      ctx.clearRect(0, 0, w, h);
      for (const [trail, color] of [
        [trailA, BLUE],
        [trailB, AMBER],
      ] as const) {
        for (let i = 1; i < trail.length; i++) {
          const p0 = trail[i - 1] as [number, number];
          const p1 = trail[i] as [number, number];
          ctx.strokeStyle = color;
          ctx.globalAlpha = (i / trail.length) * 0.7;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(ox + p0[0] * scale, oy + p0[1] * scale);
          ctx.lineTo(ox + p1[0] * scale, oy + p1[1] * scale);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      for (const [state, color] of [
        [a, BLUE],
        [b, AMBER],
      ] as const) {
        const [p1, p2] = bobs(state);
        ctx.strokeStyle = "rgb(220 230 255 / 0.75)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + p1[0] * scale, oy + p1[1] * scale);
        ctx.lineTo(ox + p2[0] * scale, oy + p2[1] * scale);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 14;
        for (const p of [p1, p2]) {
          ctx.beginPath();
          ctx.arc(ox + p[0] * scale, oy + p[1] * scale, 7, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }
      ctx.fillStyle = "#e2e8f0";
      ctx.beginPath();
      ctx.arc(ox, oy, 4, 0, Math.PI * 2);
      ctx.fill();
    };

    const advanceTo = (seconds: number) => {
      const steps = Math.round(seconds / DT);
      for (let i = 0; i < steps; i++) {
        a = step(a, DT);
        b = step(b, DT);
        t += DT;
      }
      trailA.push(bobs(a)[1]);
      trailB.push(bobs(b)[1]);
      if (trailA.length > TRAIL) trailA.shift();
      if (trailB.length > TRAIL) trailB.shift();
      const sep = separation(a, b);
      if (!diverged && sep > 0.5) {
        diverged = true;
        setDivergedAt(t);
      }
      if (t - lastSample >= 0.1) {
        lastSample = t;
        samples.push([t, Math.max(sep, 1e-12)]);
        if (samples.length > 300) samples.shift();
        setSeries([...samples]);
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(0.04, (now - last) / 1000);
      last = now;
      if (playing) advanceTo(dt);
      draw();
      if (!document.hidden && playing) raf = requestAnimationFrame(frame);
    };

    resize();
    draw();
    if (playing) raf = requestAnimationFrame(frame);
    const onResize = () => {
      resize();
      draw();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [nudge, run, playing]);

  // Divergence chart: log10 of the gap between the outer bobs over time.
  const W = 360;
  const H = 120;
  const tMax = Math.max(20, series.at(-1)?.[0] ?? 0);
  const px = (s: number) => 30 + (s / tMax) * (W - 40);
  const py = (v: number) => 10 + ((0 - Math.log10(v)) / 12) * (H - 30);
  const pathD = series.map(([s, v], k) => `${k ? "L" : "M"}${px(s).toFixed(1)},${Math.min(H - 20, Math.max(10, py(v))).toFixed(1)}`).join(" ");

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <div className="card overflow-hidden">
        <canvas
          ref={canvas}
          className="block aspect-[5/4] w-full"
          role="img"
          aria-label="Two double pendulums, one blue and one amber, released a tiny angle apart. They swing together, then diverge chaotically."
        />
      </div>
      <div className="card flex flex-col gap-4 p-6">
        <div>
          <div className="text-sm font-medium">Head start for the amber pendulum</div>
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Initial difference">
            {NUDGES.map((n) => (
              <button
                key={n.value}
                type="button"
                aria-pressed={nudge === n.value}
                onClick={() => restart(n.value)}
                className="toggle"
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn btn-primary" onClick={() => restart()}>
            Release again
          </button>
          <button type="button" className="btn btn-quiet" onClick={() => setPlaying((p) => !p)}>
            {playing ? "Pause" : "Play"}
          </button>
        </div>
        <div aria-live="polite">
          <div className="text-xs text-soft">Gap between the outer bobs (log scale)</div>
          <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 block h-auto w-full" aria-hidden="true">
            {[0, -3, -6, -9, -12].map((e) => (
              <g key={e}>
                <line x1={30} x2={W - 10} y1={py(10 ** e)} y2={py(10 ** e)} stroke="rgb(255 255 255 / 0.08)" />
                <text x={24} y={py(10 ** e) + 4} textAnchor="end" fontSize={10} fill="var(--ink-soft)">
                  {e === 0 ? "1" : `1e${e}`}
                </text>
              </g>
            ))}
            {Array.from({ length: Math.floor(tMax / (tMax > 30 ? 10 : 5)) + 1 }, (_, k) => k * (tMax > 30 ? 10 : 5)).map((s) => (
              <text key={s} x={px(s)} y={H - 4} textAnchor="middle" fontSize={10} fill="var(--ink-soft)">
                {s === 0 ? "0 s" : `${s}`}
              </text>
            ))}
            {divergedAt !== null && (
              <line x1={px(divergedAt)} x2={px(divergedAt)} y1={10} y2={H - 20} stroke="var(--ink-soft)" strokeDasharray="3 3" strokeOpacity={0.6} />
            )}
            <path d={pathD} fill="none" stroke={AMBER} strokeWidth={2} strokeLinejoin="round" />
          </svg>
          <p className="mt-2 text-sm">
            {divergedAt !== null
              ? `They parted ways after ${divergedAt.toFixed(1)} seconds.`
              : "Watching for the moment they part ways…"}
          </p>
          <p className="mt-1 text-sm text-soft">
            The gap grows exponentially: each time the head start shrinks a thousand-fold, they agree for only about three
            more seconds. That is chaos, and it is why long-range forecasts are hard. It also explains why my Sunday
            league team’s tactics never survive kickoff.
          </p>
        </div>
      </div>
    </div>
  );
}
