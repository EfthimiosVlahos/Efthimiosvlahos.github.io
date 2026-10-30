"use client";

import { useId, useState } from "react";
import { CRITERIA, gate, type PaperRecord } from "@/lib/gate";

const SLIDERS: { key: keyof PaperRecord; min: number; max: number; step: number; unit: string }[] = [
  { key: "sharpe", min: 0, max: 2.5, step: 0.05, unit: "" },
  { key: "maxDrawdownPct", min: 0, max: 40, step: 0.5, unit: "%" },
  { key: "trades", min: 0, max: 80, step: 1, unit: "" },
  { key: "days", min: 0, max: 180, step: 1, unit: " days" },
];

/** Play with a paper-trading record and watch the live-trading lock respond. */
export function GraduationGate() {
  const id = useId();
  const [record, setRecord] = useState<PaperRecord>({ sharpe: 0.8, maxDrawdownPct: 12, trades: 41, days: 64 });
  const { open, failing } = gate(record);

  return (
    <div className="bleed my-10 card p-5 sm:p-6">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="space-y-5">
          <div className="font-semibold">Try it: does this paper record unlock live trading?</div>
          {SLIDERS.map((s) => {
            const c = CRITERIA.find((x) => x.key === s.key);
            if (!c) return null;
            const pass = c.passes(record);
            const value = record[s.key];
            return (
              <div key={s.key}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <label htmlFor={`${id}-${s.key}`} className="font-medium">
                    {c.label} <span className="font-normal text-soft">(needs {c.bar})</span>
                  </label>
                  <span className={`tabular-nums font-semibold ${pass ? "text-blue" : "text-red"}`}>
                    {s.key === "sharpe" ? value.toFixed(2) : value}
                    {s.unit}
                  </span>
                </div>
                <input
                  id={`${id}-${s.key}`}
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={value}
                  onChange={(e) => setRecord((r) => ({ ...r, [s.key]: Number(e.target.value) }))}
                  className="mt-2 w-full accent-[var(--blue-strong)]"
                />
              </div>
            );
          })}
        </div>
        <div
          className={`flex flex-col items-center justify-center rounded-2xl border p-6 text-center transition-colors ${
            open ? "border-blue/50 bg-blue/8" : "border-red/40 bg-red/5"
          }`}
          aria-live="polite"
        >
          <svg viewBox="0 0 48 48" className={`size-14 ${open ? "text-blue" : "text-red"}`} fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <rect x="10" y="22" width="28" height="20" rx="4" />
            <path d={open ? "M16 22v-6a8 8 0 0 1 15.5-2.8" : "M16 22v-6a8 8 0 0 1 16 0v6"} strokeLinecap="round" />
          </svg>
          <div className="mt-3 text-xl font-bold">{open ? "Live trading unlocked" : "Paper trading only"}</div>
          <p className="mt-2 text-sm text-soft">
            {open ? "Every bar cleared. A kill switch still flattens all positions on demand." : `Still short on: ${failing.map((f) => f.label.toLowerCase()).join(", ")}.`}
          </p>
        </div>
      </div>
    </div>
  );
}
