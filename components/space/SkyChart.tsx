import type { CSSProperties } from "react";
import { Reveal } from "../Reveal";
import { pathOf, starSize, starsOf, word, type Figure } from "./constellations";

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
