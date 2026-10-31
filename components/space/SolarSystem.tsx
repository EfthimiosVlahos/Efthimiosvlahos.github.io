"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { INTRO, PLANETS, period, type Planet, type PlanetId } from "@/content/personal";

const C = 300;

/** Each planet's look, drawn in its own local coordinates around (0, 0). */
export function PlanetArt({ id, t = 0 }: { id: PlanetId; t?: number }): ReactNode {
  switch (id) {
    case "home":
      return (
        <g>
          <circle r={11} fill="url(#p-home)" />
          <path d="M-6,-4 q4,-4 8,-1 q2,3 -2,5 q-4,1 -6,-4 Z M3,3 q3,1 4,4 q-3,2 -5,0 Z" fill="#4ade80" opacity={0.8} />
          <circle r={11} fill="url(#p-shade)" />
        </g>
      );
    case "family":
      return (
        <g>
          <circle r={10} fill="url(#p-family)" />
          <circle r={10} fill="url(#p-shade)" />
          {/* Four moons: the four of us. */}
          <circle r={19} fill="none" stroke="rgb(255 220 180 / 0.18)" strokeWidth={0.8} />
          {[0, 1, 2, 3].map((k) => {
            const a = (t / 5) * Math.PI * 2 + (k * Math.PI) / 2;
            return <circle key={k} cx={19 * Math.cos(a)} cy={19 * Math.sin(a)} r={2.6} fill="#ffe7c7" />;
          })}
        </g>
      );
    case "gym":
      return (
        <g>
          {/* A ring shaped like a weight plate. */}
          <ellipse rx={23} ry={7} fill="none" stroke="#64748b" strokeWidth={4} />
          <circle r={12} fill="url(#p-gym)" />
          <circle r={12} fill="url(#p-shade)" />
          <path d="M-23,0 A23,7 0 0 0 23,0" fill="none" stroke="#94a3b8" strokeWidth={4} />
          <circle r={2.4} fill="#0f172a" />
        </g>
      );
    case "soccer":
      return (
        <g transform={`rotate(${(t * 40) % 360})`}>
          <circle r={12} fill="#f8fafc" />
          <path d="M0,-4.6 L4.4,-1.4 L2.7,3.7 L-2.7,3.7 L-4.4,-1.4 Z" fill="#0f172a" />
          <path
            d="M0,-4.6 L0,-12 M4.4,-1.4 L11.4,-3.7 M2.7,3.7 L7,9.7 M-2.7,3.7 L-7,9.7 M-4.4,-1.4 L-11.4,-3.7"
            stroke="#0f172a"
            strokeWidth={1.1}
          />
          <circle r={12} fill="url(#p-shade)" />
          <circle r={15.5} fill="none" stroke="#d4af37" strokeWidth={1.2} opacity={0.8} />
        </g>
      );
    case "physics":
      return (
        <g>
          <circle r={11} fill="url(#p-physics)" />
          <circle r={11} fill="url(#p-shade)" />
          <ellipse rx={21} ry={7} fill="none" stroke="rgb(200 180 255 / 0.7)" strokeWidth={1} transform="rotate(-25)" />
          <circle
            cx={21 * Math.cos(t * 3)}
            cy={7 * Math.sin(t * 3)}
            r={2}
            fill="#e9d5ff"
            transform="rotate(-25)"
          />
        </g>
      );
    case "philosophy":
      return (
        <g>
          <circle r={12} fill="url(#p-marble)" />
          <path d="M-8,-6 q5,3 3,8 q-1,4 4,7 M2,-10 q-2,5 4,6" fill="none" stroke="rgb(120 120 140 / 0.5)" strokeWidth={0.8} />
          <circle r={12} fill="url(#p-shade)" />
        </g>
      );
  }
}

/** Gradients shared by every planet on the page; render once, referenced by id from any SVG. */
export function PlanetDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="p-sun" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff7d6" stopOpacity="0.95" />
        <stop offset="45%" stopColor="#fbbf24" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="p-home" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#1e3a8a" />
      </radialGradient>
      <radialGradient id="p-family" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#fdba74" />
        <stop offset="100%" stopColor="#c2410c" />
      </radialGradient>
      <radialGradient id="p-gym" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#334155" />
      </radialGradient>
      <radialGradient id="p-physics" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#c4b5fd" />
        <stop offset="100%" stopColor="#5b21b6" />
      </radialGradient>
      <radialGradient id="p-marble" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#a8a29e" />
      </radialGradient>
      <radialGradient id="p-shade" cx="30%" cy="30%" r="80%">
        <stop offset="55%" stopColor="#000" stopOpacity="0" />
        <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
      </radialGradient>
      <clipPath id="sun-clip">
        <circle cx={C} cy={C} r={30} />
      </clipPath>
    </defs>
    </svg>
  );
}

/** A small static planet for section headers. */
export function PlanetIcon({ id }: { id: PlanetId }) {
  return (
    <svg viewBox="-28 -28 56 56" className="h-20 w-20" aria-hidden="true">
      <PlanetArt id={id} t={0.4} />
    </svg>
  );
}

/**
 * Me at the center, six things I love in orbit. Periods follow Kepler's third law (T² ∝ a³).
 * Hover or focus pauses the system; selecting a planet shows what it is and where to go next.
 */
export function SolarSystem() {
  const [t, setT] = useState(0);
  const [selected, setSelected] = useState<PlanetId | null>(null);
  const [paused, setPaused] = useState(false);
  const raf = useRef(0);
  const offset = useRef(0);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!paused && !document.hidden) {
        offset.current += dt;
        setT(offset.current);
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [paused]);

  const angle = (p: Planet) => ((p.phase + (360 * t) / period(p.orbit)) * Math.PI) / 180;
  const active = PLANETS.find((p) => p.id === selected);

  return (
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <svg viewBox="0 0 600 600" className="mx-auto block h-auto w-full max-w-[40rem]" role="group" aria-label="My solar system: six things I love, orbiting">
          {PLANETS.map((p) => (
            <circle
              key={`o-${p.id}`}
              cx={C}
              cy={C}
              r={p.orbit}
              fill="none"
              stroke={selected === p.id ? "rgb(150 190 255 / 0.55)" : "rgb(150 180 255 / 0.13)"}
              strokeWidth={selected === p.id ? 1.4 : 1}
              strokeDasharray={selected === p.id ? undefined : "2 5"}
            />
          ))}

          {/* The sun: me. */}
          <g
            role="button"
            tabIndex={0}
            aria-label="Me: Efthimios"
            className="sun cursor-pointer outline-none"
            onClick={() => setSelected(null)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelected(null);
              }
            }}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <circle cx={C} cy={C} r={70} fill="url(#p-sun)" className="sun-corona" />
            <circle cx={C} cy={C} r={36} fill="none" className="planet-hit" />
            <image href="/Profile_pic_linkedIn.jpg" x={C - 30} y={C - 30} width={60} height={60} clipPath="url(#sun-clip)" preserveAspectRatio="xMidYMid slice" />
            <circle cx={C} cy={C} r={30} fill="none" stroke="#fde68a" strokeWidth={2} />
          </g>

          {PLANETS.map((p) => {
            const a = angle(p);
            const x = C + p.orbit * Math.cos(a);
            const y = C + p.orbit * Math.sin(a);
            const isSel = selected === p.id;
            return (
              <g
                key={p.id}
                transform={`translate(${x.toFixed(2)},${y.toFixed(2)})`}
                role="button"
                tabIndex={0}
                aria-pressed={isSel}
                aria-label={`${p.name}: ${p.blurb}`}
                className="planet cursor-pointer outline-none"
                onClick={() => setSelected(isSel ? null : p.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(isSel ? null : p.id);
                  }
                }}
                onFocus={() => setPaused(true)}
                onBlur={() => setPaused(false)}
              >
                <circle r={30} fill="transparent" className="planet-hit" />
                {isSel && <circle r={33} fill="none" stroke="#fde68a" strokeWidth={1.4} strokeDasharray="3 4" />}
                <g transform="scale(1.25)">
                  <PlanetArt id={p.id} t={t} />
                </g>
                <text y={44} textAnchor="middle" className="planet-label" fontSize={13}>
                  {p.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div aria-live="polite" className="card p-6">
        {active ? (
          <>
            <div className="flex items-center gap-3">
              <PlanetIcon id={active.id} />
              <h3 className="text-2xl">{active.name}</h3>
            </div>
            <p className="mt-3 text-lg leading-relaxed">{active.blurb}</p>
            {active.href && (
              <a href={active.href} className="btn btn-primary mt-5">
                Go there
              </a>
            )}
          </>
        ) : (
          <>
            <h3 className="text-2xl">Hi, I’m Efthimios</h3>
            <p className="mt-3 text-lg leading-relaxed">{INTRO}</p>
            <p className="mt-4 text-sm text-soft">Click a planet to visit it. Hovering pauses the orbits.</p>
          </>
        )}
        <p className="mt-6 border-t border-rule pt-4 text-xs text-soft">
          Physics note: the orbits follow Kepler’s third law, where a year squared is proportional to the distance cubed. That’s why the outer planets really are slower. Philosophy, out at the edge, takes its time.
        </p>
      </div>
    </div>
  );
}
