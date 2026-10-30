"use client";

import { useId, useMemo, useState, type CSSProperties } from "react";
import { judge, scenarios, type Population, type Scenario, type Verdict } from "@/lib/simulate";

const VERDICT_LABEL: Record<Verdict, string> = {
  ship: "Ship it",
  "ship-after-review": "Ship after reading the flip",
  drop: "Don’t ship",
};

/** Deterministic shuffle so the same scenario always lights the same dots. */
function seededOrder(n: number, seed: string): number[] {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const rand = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
  const idx = Array.from({ length: n }, (_, k) => k);
  for (let k = n - 1; k > 0; k--) {
    const j = Math.floor(rand() * (k + 1));
    [idx[k], idx[j]] = [idx[j] as number, idx[k] as number];
  }
  return idx;
}

type DotState = "idle" | "win" | "harm";

/** One dot size per scenario, set by its largest population, so populations stay comparable. */
function dotScale(scenario: Scenario): { spacing: number; r: number } {
  const largest = Math.max(...scenario.populations.map((p) => p.size));
  if (largest <= 60) return { spacing: 15, r: 5 };
  if (largest <= 200) return { spacing: 11, r: 3.6 };
  return { spacing: 7.6, r: 2.5 };
}

function DotField({
  population,
  replayed,
  seed,
  spacing,
  r,
}: {
  population: Population;
  replayed: boolean;
  seed: string;
  spacing: number;
  r: number;
}) {
  const { size, wins = 0, harms = 0 } = population;
  const width = 440;
  const cols = Math.floor(width / spacing);
  const rows = Math.ceil(size / cols);
  const height = rows * spacing + 4;

  const states = useMemo(() => {
    const order = seededOrder(size, seed);
    const s: DotState[] = Array.from({ length: size }, () => "idle");
    order.slice(0, wins).forEach((k) => (s[k] = "win"));
    order.slice(wins, wins + harms).forEach((k) => (s[k] = "harm"));
    return s;
  }, [size, wins, harms, seed]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full" aria-hidden="true">
      {states.map((state, k) => {
        const lit = replayed && state !== "idle";
        const delay = lit ? `${Math.round((k / size) * 700)}ms` : "0ms";
        return (
          <circle
            key={k}
            className="dot"
            cx={(k % cols) * spacing + spacing / 2}
            cy={Math.floor(k / cols) * spacing + spacing / 2 + 2}
            r={lit && state === "harm" ? r * 1.35 : r}
            style={
              {
                "--d": delay,
                fill: !lit ? "var(--mark-muted)" : state === "win" ? "var(--mark-blue)" : "var(--mark-red)",
                fillOpacity: lit ? 1 : 0.7,
                stroke: lit && state === "harm" ? "var(--paper-raised)" : "none",
                strokeWidth: 2,
              } as CSSProperties
            }
          />
        );
      })}
    </svg>
  );
}

function Legend({ scenario }: { scenario: Scenario }) {
  const harmLabel =
    scenario.direction === "approve" ? "Wrong: approves a case reviewers rejected" : "Wrong: sends a good case to review";
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-soft">
      {scenario.populations.some((p) => p.wins !== undefined) && (
        <li className="flex items-center gap-2">
          <span className="size-2.5 rounded-full" style={{ background: "var(--mark-blue)" }} aria-hidden="true" />
          Fixed: a wrongly flagged case recovered
        </li>
      )}
      <li className="flex items-center gap-2">
        <span className="size-3 rounded-full" style={{ background: "var(--mark-red)" }} aria-hidden="true" />
        {harmLabel}
      </li>
      <li className="flex items-center gap-2">
        <span className="size-2.5 rounded-full opacity-45" style={{ background: "var(--mark-muted)" }} aria-hidden="true" />
        Unchanged
      </li>
    </ul>
  );
}

export function SimulateLab() {
  const groupId = useId();
  const [activeId, setActiveId] = useState(scenarios[0]?.id ?? "");
  const [replayed, setReplayed] = useState(false);
  const scenario = scenarios.find((s) => s.id === activeId) ?? scenarios[0];
  if (!scenario) throw new Error("No replay scenarios defined");
  const result = judge(scenario);

  return (
    <div className="grid overflow-hidden rounded-xl border border-rule bg-raised lg:grid-cols-[minmax(0,22rem)_1fr]">
      <fieldset className="border-b border-rule p-5 lg:border-r lg:border-b-0">
        <legend className="sr-only">Candidate rules</legend>
        <p className="mb-3 text-sm text-soft">Pick a candidate rule:</p>
        <div className="space-y-1.5">
          {scenarios.map((s) => {
            const id = `${groupId}-${s.id}`;
            const selected = s.id === scenario.id;
            return (
              <label
                key={s.id}
                htmlFor={id}
                className={`flex cursor-pointer gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
                  selected ? "border-blue bg-paper" : "border-transparent hover:border-rule"
                }`}
              >
                <input
                  id={id}
                  type="radio"
                  name={groupId}
                  value={s.id}
                  checked={selected}
                  onChange={() => {
                    setActiveId(s.id);
                    setReplayed(false);
                  }}
                  className="mt-1.5 accent-[var(--blue)]"
                />
                <span>
                  <span className="block leading-snug font-medium">{s.name}</span>
                  <span className="mt-0.5 block text-xs text-soft">
                    {s.direction === "approve" ? "Can approve on its own" : "Can only send work to a person"}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-5 p-5 lg:p-7">
        <div>
          <h3 className="text-2xl leading-tight">{scenario.name}</h3>
          <p className="mt-1 text-soft">{scenario.summary}</p>
        </div>

        <div className="space-y-4">
          {scenario.populations.map((p) => (
            <div key={p.label}>
              <div className="mb-1.5 flex items-baseline justify-between gap-4 text-sm">
                <span className="font-medium">{p.label}</span>
                <span className="text-soft tabular-nums">{p.size.toLocaleString("en-US")} cases</span>
              </div>
              <DotField population={p} replayed={replayed} seed={scenario.id + p.label} {...dotScale(scenario)} />
            </div>
          ))}
          <Legend scenario={scenario} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-primary" onClick={() => setReplayed(true)} disabled={replayed}>
            {replayed ? "Replayed" : "Replay on stored cases"}
          </button>
          {replayed && (
            <button type="button" className="btn btn-quiet" onClick={() => setReplayed(false)}>
              Reset
            </button>
          )}
        </div>

        <div aria-live="polite" className="min-h-[7.5rem]">
          {replayed ? (
            <div className="grid gap-4 border-t border-rule pt-4 sm:grid-cols-[auto_auto_1fr]">
              <div>
                <div className="text-xs text-soft">Fixed</div>
                <div className="font-display text-3xl font-semibold">
                  {result.wins === null ? <span className="text-xl text-soft">not measured</span> : result.wins}
                </div>
              </div>
              <div>
                <div className="text-xs text-soft">Wrong</div>
                <div className="font-display text-3xl font-semibold">{result.harms}</div>
              </div>
              <div className="sm:border-l sm:border-rule sm:pl-5">
                <div className="flex items-center gap-2 font-display text-2xl font-semibold">
                  <VerdictMark verdict={result.verdict} />
                  {VERDICT_LABEL[result.verdict]}
                </div>
                <p className="mt-1 text-sm text-soft">{result.reason}</p>
                <p className="mt-1 text-sm">
                  <span className="text-soft">What happened:</span> {scenario.outcome}.
                </p>
              </div>
            </div>
          ) : (
            <p className="border-t border-rule pt-4 text-sm text-soft">
              One dot is one stored case. Replaying re-runs only the deterministic rules over saved model output, so it
              costs no model calls and finishes in seconds.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function VerdictMark({ verdict }: { verdict: Verdict }) {
  if (verdict === "drop") {
    return (
      <svg viewBox="0 0 20 20" className="size-5 shrink-0 text-red" aria-hidden="true">
        <rect x="1" y="1" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M6 6 L14 14 M14 6 L6 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" className="size-5 shrink-0 text-blue" aria-hidden="true">
      <rect x="1" y="1" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.5 10.5 L8.5 13.5 L14.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
