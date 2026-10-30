/**
 * Primitives for the site's system drawings. Coordinates are in each drawing's viewBox units.
 * `i` sets the order in the one-time draw animation (only active inside `.draw-on`).
 */
import type { CSSProperties, ReactNode } from "react";
import { Reveal } from "../Reveal";

type Pt = readonly [number, number];

const order = (i?: number): CSSProperties | undefined => (i === undefined ? undefined : ({ "--i": i } as CSSProperties));

export function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  n,
  quiet,
  i,
  size = 19,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  /** Step number, shown small in the corner, only for real sequences. */
  n?: number;
  /** Dashed outline: an external system, not something I built. */
  quiet?: boolean;
  i?: number;
  size?: number;
}) {
  const cx = x + w / 2;
  const labelY = sub ? y + h / 2 - 2 : y + h / 2 + size * 0.35;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} className={`${quiet ? "box-quiet" : "box"} fade`} style={order(i)} />
      {!quiet && (
        <rect x={x} y={y} width={w} height={h} rx={10} pathLength={1} className="ln draw" style={order(i)} />
      )}
      {n !== undefined && (
        <text x={x + 8} y={y + 15} fontSize={11} className="num fade" style={order(i)}>
          {n}
        </text>
      )}
      <text x={cx} y={labelY} textAnchor="middle" fontSize={size} className="lbl fade" style={order(i)}>
        {label}
      </text>
      {sub && (
        <text x={cx} y={y + h / 2 + 15} textAnchor="middle" fontSize={12.5} className="sub fade" style={order(i)}>
          {sub}
        </text>
      )}
    </g>
  );
}

/** A polyline ending in an arrowhead at its last point. */
export function Arrow({ points, i, red }: { points: Pt[]; i?: number; red?: boolean }) {
  const d = points.map(([x, y], k) => `${k ? "L" : "M"}${x},${y}`).join(" ");
  const end = points[points.length - 1];
  const prev = points[points.length - 2];
  if (!end || !prev) throw new Error("Arrow needs at least two points");
  const angle = (Math.atan2(end[1] - prev[1], end[0] - prev[0]) * 180) / Math.PI;
  return (
    <g style={red ? ({ "--stroke": "var(--red)" } as CSSProperties) : undefined}>
      <path d={d} pathLength={1} className="ln draw" style={order(i)} />
      <path
        d="M0,0 L-8,-4 L-8,4 Z"
        transform={`translate(${end[0]},${end[1]}) rotate(${angle})`}
        className="arrowhead fade"
        style={order(i)}
      />
    </g>
  );
}

/** A dimension line: thin rule with end ticks and a label riding on a gap in the middle. */
export function Dim({ x1, x2, y, label, i }: { x1: number; x2: number; y: number; label: string; i?: number }) {
  const mid = (x1 + x2) / 2;
  const gap = label.length * 3.6 + 10;
  return (
    <g>
      <path
        d={`M${x1},${y} H${mid - gap} M${mid + gap},${y} H${x2} M${x1},${y - 6} V${y + 6} M${x2},${y - 6} V${y + 6}`}
        pathLength={1}
        className="ln-thin draw"
        style={order(i)}
      />
      <text x={mid} y={y + 4.5} textAnchor="middle" fontSize={13.5} className="note fade" style={order(i)}>
        {label}
      </text>
    </g>
  );
}

/** Multi-line annotation in the reviewer's italic. */
export function Note({
  x,
  y,
  lines,
  anchor = "start",
  red,
  i,
  size = 13.5,
}: {
  x: number;
  y: number;
  lines: string[];
  anchor?: "start" | "middle" | "end";
  red?: boolean;
  i?: number;
  size?: number;
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} className={`${red ? "note-red" : "note"} fade`} style={order(i)}>
      {lines.map((line, k) => (
        <tspan key={k} x={x} dy={k === 0 ? 0 : size * 1.3}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

/** Frame for every drawing: grid paper, scrollable on narrow screens, with a plain-text caption. */
export function Drawing({
  viewBox,
  minWidth,
  title,
  caption,
  children,
  animate,
  className = "",
}: {
  viewBox: string;
  /** Below this rendered width the drawing scrolls sideways instead of shrinking text to illegibility. */
  minWidth: number;
  title: string;
  caption?: ReactNode;
  children: ReactNode;
  animate?: boolean;
  className?: string;
}) {
  return (
    <figure className={`bleed my-10 ${className}`}>
      <div className="diagram-frame overflow-x-auto p-3 sm:p-5" tabIndex={0} aria-label={`${title} (scrollable diagram)`}>
        {animate ? (
          <Reveal>
            <svg viewBox={viewBox} role="img" aria-label={title} className="drawing block h-auto w-full" style={{ minWidth }}>
              {children}
            </svg>
          </Reveal>
        ) : (
          <svg viewBox={viewBox} role="img" aria-label={title} className="drawing block h-auto w-full" style={{ minWidth }}>
            {children}
          </svg>
        )}
      </div>
      {caption && <figcaption className="mt-3 max-w-[44rem] text-sm text-soft">{caption}</figcaption>}
    </figure>
  );
}
