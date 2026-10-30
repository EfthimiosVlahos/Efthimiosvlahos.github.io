import type { CSSProperties, ReactNode } from "react";
import { Reveal } from "../Reveal";
import { MEDITERRANEAN, PITCH, PITCH_SHOT, STOA, pathOf, starSize, starsOf, word, type Figure } from "./constellations";

const order = (i: number) => ({ "--i": i }) as CSSProperties;
const twinkle = (i: number) => ({ "--tw": `${(i * 0.37) % 4}s` }) as CSSProperties;

function Stars({ fig, salt, start = 0 }: { fig: Figure; salt: number; start?: number }) {
  return (
    <>
      {starsOf(fig).map(([x, y], k) => {
        const r = starSize(k, salt);
        return (
          <g key={k} className="fade" style={order(start + Math.floor(k / 3))}>
            {r > 2 && <circle cx={x} cy={y} r={r * 3.2} className="cstar-halo" />}
            <circle cx={x} cy={y} r={r} className="cstar" style={twinkle(k + salt)} />
          </g>
        );
      })}
    </>
  );
}

/** ΕΥΘΥΜΙΟΣ drawn as a constellation, letter by letter. */
export function NameConstellation() {
  const fig = word("ΕΥΘΥΜΙΟΣ");
  const pad = 30;
  return (
    <Reveal>
      <svg
        viewBox={`${-pad} ${-pad} ${fig.width + pad * 2} ${fig.height + pad * 2}`}
        className="constellation-svg mx-auto block h-auto w-full max-w-[52rem]"
        role="img"
        aria-label="The name Efthimios in Greek capitals, ΕΥΘΥΜΙΟΣ, drawn as a constellation"
      >
        {fig.letters.map((l, li) =>
          fig.strokes.slice(l.start, l.start + l.strokes).map((s, k) => (
            <path key={`${li}-${k}`} d={pathOf(s)} pathLength={1} className="cline draw" style={order(li)} />
          )),
        )}
        {fig.letters.map((l, li) => (
          <Stars key={li} fig={{ width: 0, height: 0, strokes: fig.strokes.slice(l.start, l.start + l.strokes) }} salt={li} start={li} />
        ))}
      </svg>
    </Reveal>
  );
}

function Mini({ fig, salt, children }: { fig: Figure; salt: number; children?: ReactNode }) {
  return (
    <svg viewBox={`-8 -8 ${fig.width + 16} ${fig.height + 16}`} className="constellation-svg h-24 w-auto" aria-hidden="true">
      {fig.strokes.map((s, k) => (
        <path key={k} d={pathOf(s)} pathLength={1} className="cline draw" style={order(k)} />
      ))}
      {children}
      <Stars fig={fig} salt={salt} />
    </svg>
  );
}

const CHART = [
  { href: "#view-from-above", name: "The Stoa", note: "the porch in Athens that gave Stoicism its name", fig: STOA, salt: 11 },
  { href: "#floodlights", name: "The pitch", note: "where expected goals live", fig: PITCH, salt: 23, shot: true },
  { href: "#from-orbit", name: "The Mediterranean", note: "Greece and Italy, traced in stars", fig: MEDITERRANEAN, salt: 37 },
];

/** A star chart that doubles as the page's navigation. */
export function StarChartNav() {
  return (
    <nav aria-label="Sections on this page">
      <Reveal>
        <ul className="grid gap-4 sm:grid-cols-3">
          {CHART.map((c) => (
            <li key={c.href}>
              <a href={c.href} className="sky-tile group flex h-full flex-col items-center rounded-2xl px-4 py-5 text-center no-underline">
                <Mini fig={c.fig} salt={c.salt}>
                  {c.shot && <path d={PITCH_SHOT} className="cline-shot" />}
                </Mini>
                <span className="mt-3 font-semibold text-ink italic group-hover:text-blue">{c.name}</span>
                <span className="mt-1 text-sm text-soft">{c.note}</span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </nav>
  );
}

/** Small constellation used as a section marker. */
export function SectionGlyph({ which }: { which: "stoa" | "pitch" | "med" }) {
  const fig = which === "stoa" ? STOA : which === "pitch" ? PITCH : MEDITERRANEAN;
  return (
    <svg viewBox={`-8 -8 ${fig.width + 16} ${fig.height + 16}`} className="constellation-svg h-12 w-auto" aria-hidden="true">
      {fig.strokes.map((s, k) => (
        <path key={k} d={pathOf(s)} className="cline" />
      ))}
      {which === "pitch" && <path d={PITCH_SHOT} className="cline-shot" />}
      {starsOf(fig).map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r={starSize(k, 5)} className="cstar" />
      ))}
    </svg>
  );
}
