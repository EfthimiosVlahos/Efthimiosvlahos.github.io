import { Arrow, Box, Dim, Note } from "./kit";

/** The demo-to-production loop, annotated with what each stage looked like in real projects. */
export const STAGES = [
  { n: 1, label: "Define correct", note: ["39 hand-labeled documents", "before any model swap"] },
  { n: 2, label: "Build", note: ["12 releases in 9 days,", "1,700+ tests"] },
  { n: 3, label: "Evaluate", note: ["every rule replayed on", "cases humans rejected"] },
  { n: 4, label: "Ship dark", note: ["off by default,", "one-command rollback"] },
  { n: 5, label: "Operate", note: ["a 2-day silent outage", "now heals in 2 minutes"] },
] as const;

const W = 150;
const H = 56;
const COL = [40, 225, 410] as const;
const ROW = [52, 222] as const;

export function LoopDrawing() {
  const [s1, s2, s3, s4, s5] = STAGES;
  return (
    <svg
      viewBox="0 0 600 372"
      role="img"
      aria-labelledby="loop-title loop-desc"
      className="drawing block h-auto w-full"
    >
      <title id="loop-title">How I take an AI system from demo to production</title>
      <desc id="loop-desc">
        A loop of five stages: define correct, build, evaluate, ship dark, operate. Incidents in operation become new
        test cases for the first stage.
      </desc>

      <Dim x1={COL[0]} x2={COL[2] + W} y={22} label="before it ships" i={0} />

      <Box x={COL[0]} y={ROW[0]} w={W} h={H} n={s1.n} label={s1.label} i={1} size={17} />
      <Arrow points={[[COL[0] + W, ROW[0] + H / 2], [COL[1], ROW[0] + H / 2]]} i={2} />
      <Box x={COL[1]} y={ROW[0]} w={W} h={H} n={s2.n} label={s2.label} i={3} size={17} />
      <Arrow points={[[COL[1] + W, ROW[0] + H / 2], [COL[2], ROW[0] + H / 2]]} i={4} />
      <Box x={COL[2]} y={ROW[0]} w={W} h={H} n={s3.n} label={s3.label} i={5} size={17} />

      <Arrow
        points={[
          [COL[2] + W, ROW[0] + H / 2],
          [584, ROW[0] + H / 2],
          [584, ROW[1] + H / 2],
          [COL[2] + W, ROW[1] + H / 2],
        ]}
        i={6}
      />
      <Box x={COL[2]} y={ROW[1]} w={W} h={H} n={s4.n} label={s4.label} i={7} size={17} />
      <Arrow points={[[COL[2], ROW[1] + H / 2], [COL[1] + W, ROW[1] + H / 2]]} i={8} />
      <Box x={COL[1]} y={ROW[1]} w={W} h={H} n={s5.n} label={s5.label} i={9} size={17} />

      <Arrow
        points={[
          [COL[1], ROW[1] + H / 2],
          [16, ROW[1] + H / 2],
          [16, ROW[0] + H / 2],
          [COL[0], ROW[0] + H / 2],
        ]}
        i={10}
        red
      />
      <Note x={120} y={ROW[1] + H / 2 - 9} anchor="middle" lines={["incidents become test cases"]} red i={10} />

      <Note x={COL[0]} y={ROW[0] + H + 24} lines={[...s1.note]} i={1} size={12.5} />
      <Note x={COL[1]} y={ROW[0] + H + 24} lines={[...s2.note]} i={3} size={12.5} />
      <Note x={COL[2]} y={ROW[0] + H + 24} lines={[...s3.note]} i={5} size={12.5} />
      <Note x={COL[2]} y={ROW[1] + H + 24} lines={[...s4.note]} i={7} size={12.5} />
      <Note x={COL[1]} y={ROW[1] + H + 24} lines={[...s5.note]} i={9} size={12.5} />

      <Dim x1={COL[1]} x2={COL[2] + W} y={358} label="after it ships" i={11} />
    </svg>
  );
}

/** The same loop as an accessible vertical list, for narrow screens. */
export function LoopList() {
  return (
    <ol className="relative space-y-3 border-l-2 border-blue/60 pl-5" aria-label="How I take an AI system from demo to production">
      {STAGES.map((s) => (
        <li key={s.n} className="relative">
          <span
            className="absolute top-2.5 -left-[1.6rem] size-2.5 rounded-full border-2 border-paper bg-blue"
            aria-hidden="true"
          />
          <div className="rounded-xl border border-rule bg-raised px-3 py-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-semibold text-blue">{s.n}</span>
              <span className="font-display text-lg font-semibold">{s.label}</span>
            </div>
            <p className="font-note text-[0.95rem] italic text-soft">{s.note.join(" ")}</p>
          </div>
        </li>
      ))}
      <li className="font-note text-[0.95rem] italic text-red">…and incidents become test cases for step 1.</li>
    </ol>
  );
}
