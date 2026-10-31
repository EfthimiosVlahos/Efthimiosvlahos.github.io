/**
 * A contribution graph, but for the gym: twelve weeks of training, with every Monday and Thursday a leg day.
 * Illustrative, and labeled as such on the page.
 */
const WEEKS = 12;
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const LEG_DAYS = new Set([0, 3]);
const MATCH_DAY = 6;
const CELL = 14;
const GAP = 4;
const LABEL = 34;

/** Deterministic "other training" intensity for non-leg days: 0 (rest) to 2. */
function intensity(week: number, day: number): number {
  if (LEG_DAYS.has(day)) return 3;
  const h = Math.sin((week + 1) * 12.9898 + (day + 1) * 78.233) * 43758.5453;
  const f = h - Math.floor(h);
  return f > 0.55 ? 2 : f > 0.25 ? 1 : 0;
}

const FILL = ["rgb(150 180 255 / 0.08)", "rgb(74 222 128 / 0.3)", "rgb(74 222 128 / 0.55)", "#4ade80"];

export function LegDays() {
  const width = LABEL + WEEKS * (CELL + GAP);
  const height = DAYS.length * (CELL + GAP);
  const legDays = WEEKS * LEG_DAYS.size;
  return (
    <figure className="card mx-auto max-w-[30rem] p-5 sm:p-6">
      <figcaption className="flex items-baseline justify-between gap-4">
        <span className="font-semibold">Leg days, last twelve weeks</span>
        <span className="text-sm whitespace-nowrap text-soft tabular-nums">
          {legDays} of {legDays}
        </span>
      </figcaption>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-4 block h-auto w-full"
        role="img"
        aria-label={`A training calendar for twelve weeks. Every Monday and Thursday is a leg day, ${legDays} of ${legDays} with none skipped, and every Sunday is a Sunday league match.`}
      >
        {DAYS.map((d, day) =>
          LEG_DAYS.has(day) || day === MATCH_DAY ? (
            <text key={d} x={0} y={day * (CELL + GAP) + CELL - 3} fontSize={10} fill="var(--ink-soft)">
              {d}
            </text>
          ) : null,
        )}
        {Array.from({ length: WEEKS }, (_, week) =>
          DAYS.map((d, day) =>
            day === MATCH_DAY ? (
              // Sundays are for Sunday league.
              <circle
                key={`${week}-${d}`}
                cx={LABEL + week * (CELL + GAP) + CELL / 2}
                cy={day * (CELL + GAP) + CELL / 2}
                r={CELL / 2 - 1.5}
                fill="#f8fafc"
                fillOpacity={0.85}
              />
            ) : (
              <rect
                key={`${week}-${d}`}
                x={LABEL + week * (CELL + GAP)}
                y={day * (CELL + GAP)}
                width={CELL}
                height={CELL}
                rx={3}
                fill={FILL[intensity(week, day)]}
              />
            ),
          ),
        )}
      </svg>
      <p className="mt-4 text-sm text-soft">
        Green is lifting, brightest on leg days; the white dots are Sunday league. Like a green build, but for
        hamstrings. Illustrative, though my legs insist it’s accurate.
      </p>
    </figure>
  );
}
