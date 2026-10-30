"use client";

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { BASELINE, BUDGET, CHANGES, GOLDEN_SET_SIZE, evaluate, type Change } from "@/lib/evalgate";

type Phase = "idle" | "running" | "done";
type CaseState = "pass" | "fail" | "fixed" | "regressed";

/** Deterministic case layout so each change always flips the same cases. */
function caseStates(change: Change): CaseState[] {
  const states: CaseState[] = Array.from({ length: GOLDEN_SET_SIZE }, (_, i) => (i % 7 === 3 || i % 13 === 5 ? "fail" : "pass"));
  // Trim or pad failures so the baseline matches exactly.
  let fails = states.filter((s) => s === "fail").length;
  const target = GOLDEN_SET_SIZE - BASELINE.passed;
  for (let i = 0; fails !== target && i < GOLDEN_SET_SIZE; i++) {
    if (fails > target && states[i] === "fail") {
      states[i] = "pass";
      fails--;
    } else if (fails < target && states[i] === "pass" && i % 11 === 0) {
      states[i] = "fail";
      fails++;
    }
  }
  const failIdx = states.flatMap((s, i) => (s === "fail" ? [i] : []));
  const passIdx = states.flatMap((s, i) => (s === "pass" ? [i] : []));
  const pick = (arr: number[], n: number, salt: number) =>
    [...arr].sort((a, b) => ((a * 2654435761 + salt) % 997) - ((b * 2654435761 + salt) % 997)).slice(0, n);
  const salt = change.id.length * 31 + change.fixed;
  pick(failIdx, change.fixed, salt).forEach((i) => (states[i] = "fixed"));
  pick(passIdx, change.regressed, salt + 7).forEach((i) => (states[i] = "regressed"));
  return states;
}

const COLORS: Record<CaseState, string> = {
  pass: "var(--mark-muted)",
  fail: "transparent",
  fixed: "var(--mark-blue)",
  regressed: "var(--mark-red)",
};

function money(v: number) {
  return `$${v.toFixed(3)}`;
}

export function EvalGate() {
  const groupId = useId();
  const [changeId, setChangeId] = useState(CHANGES[0]?.id ?? "");
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const timer = useRef<number | null>(null);

  const change = CHANGES.find((c) => c.id === changeId) ?? CHANGES[0];
  if (!change) throw new Error("No eval-gate changes defined");
  const result = useMemo(() => evaluate(change), [change]);
  const states = useMemo(() => caseStates(change), [change]);

  useEffect(() => () => {
    if (timer.current) window.clearInterval(timer.current);
  }, []);

  const run = () => {
    if (timer.current) window.clearInterval(timer.current);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(GOLDEN_SET_SIZE);
      setPhase("done");
      return;
    }
    setPhase("running");
    setProgress(0);
    const started = performance.now();
    timer.current = window.setInterval(() => {
      const n = Math.min(GOLDEN_SET_SIZE, Math.round(((performance.now() - started) / 1100) * GOLDEN_SET_SIZE));
      setProgress(n);
      if (n >= GOLDEN_SET_SIZE) {
        if (timer.current) window.clearInterval(timer.current);
        setPhase("done");
      }
    }, 40);
  };

  const select = (id: string) => {
    if (timer.current) window.clearInterval(timer.current);
    setChangeId(id);
    setPhase("idle");
    setProgress(0);
  };

  const shown = phase === "idle" ? 0 : progress;
  const cols = 25;

  const rows: { label: string; base: string; cand: string; gate?: boolean; detail?: string }[] = [
    {
      label: "Task success",
      base: `${result.baselinePct.toFixed(1)}%`,
      cand: `${result.successPct.toFixed(1)}%`,
      gate: result.checks.find((c) => c.id === "quality")?.pass,
      detail: result.checks.find((c) => c.id === "quality")?.detail,
    },
    { label: "Grounded answers", base: `${BASELINE.grounded}%`, cand: `${result.candidate.grounded}%` },
    {
      label: "Safety violations",
      base: `${BASELINE.safety}`,
      cand: `${result.candidate.safety}`,
      gate: result.checks.find((c) => c.id === "safety")?.pass,
      detail: result.checks.find((c) => c.id === "safety")?.detail,
    },
    {
      label: "Cost per task",
      base: money(BASELINE.cost),
      cand: money(result.candidate.cost),
      gate: result.checks.find((c) => c.id === "cost")?.pass,
      detail: result.checks.find((c) => c.id === "cost")?.detail,
    },
    {
      label: "Latency (95th percentile)",
      base: `${BASELINE.p95.toFixed(1)} s`,
      cand: `${result.candidate.p95.toFixed(1)} s`,
      gate: result.checks.find((c) => c.id === "latency")?.pass,
      detail: result.checks.find((c) => c.id === "latency")?.detail,
    },
  ];

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-rule bg-sunken px-4 py-2.5 font-mono text-xs text-soft">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#f87171]/80" />
          <span className="size-2.5 rounded-full bg-[#fbbf24]/80" />
          <span className="size-2.5 rounded-full bg-[#34d399]/80" />
        </span>
        <span className="truncate">
          $ evals run --suite support-golden --cases {GOLDEN_SET_SIZE} --candidate {change.id}
        </span>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,20rem)_1fr]">
        <fieldset className="border-b border-rule p-5 lg:border-r lg:border-b-0">
          <legend className="sr-only">Proposed change</legend>
          <p className="mb-3 text-sm text-soft">Propose a change to the agent:</p>
          <div className="space-y-1.5">
            {CHANGES.map((c) => {
              const id = `${groupId}-${c.id}`;
              const selected = c.id === change.id;
              return (
                <label
                  key={c.id}
                  htmlFor={id}
                  className={`flex cursor-pointer gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                    selected ? "border-blue bg-paper" : "border-transparent hover:border-rule"
                  }`}
                >
                  <input
                    id={id}
                    type="radio"
                    name={groupId}
                    checked={selected}
                    onChange={() => select(c.id)}
                    className="mt-1 accent-[var(--blue-strong)]"
                  />
                  <span className="font-medium leading-snug">{c.name}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="flex min-w-0 flex-col gap-5 p-5 lg:p-7">
          <div>
            <h3 className="text-xl leading-snug">{change.name}</h3>
            <p className="mt-1 text-soft">{change.summary}</p>
          </div>

          <div>
            <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
              <span className="font-medium">Golden set: {GOLDEN_SET_SIZE} conversations with known-good answers</span>
              <span className="font-mono text-xs text-soft tabular-nums" aria-live="polite">
                {phase === "running" ? `case ${progress}/${GOLDEN_SET_SIZE}` : phase === "done" ? "done" : "not run"}
              </span>
            </div>
            <svg viewBox={`0 0 ${cols * 16} ${(GOLDEN_SET_SIZE / cols) * 16}`} className="block h-auto w-full max-w-[34rem]" aria-hidden="true">
              {states.map((s, i) => {
                const evaluated = i < shown;
                const changed = s === "fixed" || s === "regressed";
                const baseFail = s === "fail" || s === "fixed";
                const fill = !evaluated ? (baseFail ? "transparent" : "var(--mark-muted)") : COLORS[s];
                return (
                  <circle
                    key={i}
                    className="dot"
                    cx={(i % cols) * 16 + 8}
                    cy={Math.floor(i / cols) * 16 + 8}
                    r={evaluated && changed ? 5.5 : 4.5}
                    style={
                      {
                        fill,
                        fillOpacity: evaluated && changed ? 1 : 0.75,
                        stroke: baseFail && !(evaluated && s === "fixed") ? "var(--mark-muted)" : "none",
                        strokeWidth: 1.5,
                      } as CSSProperties
                    }
                  />
                );
              })}
            </svg>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-soft">
              <li className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full" style={{ background: "var(--mark-muted)" }} aria-hidden="true" />
                Passed before and after
              </li>
              <li className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full border-[1.5px]" style={{ borderColor: "var(--mark-muted)" }} aria-hidden="true" />
                Failing
              </li>
              <li className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full" style={{ background: "var(--mark-blue)" }} aria-hidden="true" />
                Newly passing
              </li>
              <li className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full" style={{ background: "var(--mark-red)" }} aria-hidden="true" />
                Regression
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn btn-primary" onClick={run} disabled={phase === "running"}>
              {phase === "running" ? "Running…" : phase === "done" ? "Run again" : "Run the eval"}
            </button>
            {phase === "done" && (
              <span className="text-sm text-soft">
                {change.fixed} fixed, {change.regressed} regressed
              </span>
            )}
          </div>

          <div aria-live="polite">
            {phase === "done" ? (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="data-table min-w-[30rem]">
                    <thead>
                      <tr>
                        <th scope="col">Metric</th>
                        <th scope="col">Baseline</th>
                        <th scope="col">Candidate</th>
                        <th scope="col">Gate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr key={r.label}>
                          <td>{r.label}</td>
                          <td className="text-soft">{r.base}</td>
                          <td className="font-semibold">{r.cand}</td>
                          <td>
                            {r.gate === undefined ? (
                              <span className="text-soft">tracked</span>
                            ) : (
                              <span className={`font-semibold ${r.gate ? "text-blue" : "text-red"}`}>
                                {r.gate ? "✓ pass" : "✗ fail"}
                                <span className="block text-xs font-normal text-soft">{r.detail}</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div
                  className={`rounded-xl border p-4 ${result.ship ? "border-blue/40 bg-blue/8" : "border-red/40 bg-red/5"}`}
                >
                  <div className={`text-lg font-bold ${result.ship ? "text-blue" : "text-red"}`}>
                    {result.ship ? "✓ Ship it" : "✗ Blocked"}
                  </div>
                  <p className="mt-1">{change.lesson}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-soft">
                The gate blocks any change that drops task success by more than {BUDGET.maxSuccessDrop} point, causes a
                single safety violation, pushes p95 latency past {BUDGET.maxP95} seconds, or raises cost more than{" "}
                {BUDGET.maxCostIncreasePct}% without improving quality.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
