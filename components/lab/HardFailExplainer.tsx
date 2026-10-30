"use client";

import { useState } from "react";
import { CHECKS, MATCH_THRESHOLD, decide, type Decision } from "@/lib/validator";

const START = new Set(CHECKS.filter((c) => c.id !== "liability").map((c) => c.id));

function Outcome({ title, d, note }: { title: string; d: Decision; note: string }) {
  const approve = d.status === "auto-approve";
  return (
    <div className="card flex-1 p-5">
      <div className="text-sm text-soft">{title}</div>
      <div className="mt-1 flex items-baseline gap-3">
        <span className="text-3xl font-bold tabular-nums">{d.matchPct}%</span>
        <span className="text-sm text-soft">match</span>
      </div>
      <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${approve ? "bg-blue/12 text-blue" : "bg-red/12 text-red"}`}>
        <span aria-hidden="true">{approve ? "✓" : "!"}</span>
        {approve ? "Auto-approved" : "Sent to manual review"}
      </div>
      <p className="mt-3 text-sm text-soft">{note}</p>
    </div>
  );
}

/** Toggle the validator's eight checks to see why a hard-fail flag is needed on top of a match threshold. */
export function HardFailExplainer() {
  const [passing, setPassing] = useState<Set<string>>(START);
  const without = decide(passing, false);
  const withFlag = decide(passing, true);
  const dangerous = without.status === "auto-approve" && withFlag.status === "manual-review";

  return (
    <div className="bleed my-10 card p-5 sm:p-6">
      <div className="font-semibold">Try it: which checks does this policy pass?</div>
      <p className="mt-1 text-sm text-soft">
        Simplified model. A case can auto-approve at {MATCH_THRESHOLD}% or more; checks marked critical set the hard-fail flag.
      </p>
      <fieldset className="mt-4 grid gap-2 sm:grid-cols-2">
        <legend className="sr-only">Validator checks</legend>
        {CHECKS.map((c) => {
          const on = passing.has(c.id);
          return (
            <label
              key={c.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-colors ${on ? "border-rule bg-paper" : "border-red/50 bg-red/5"}`}
            >
              <input
                type="checkbox"
                checked={on}
                onChange={() =>
                  setPassing((prev) => {
                    const next = new Set(prev);
                    if (next.has(c.id)) next.delete(c.id);
                    else next.add(c.id);
                    return next;
                  })
                }
                className="size-4 accent-[var(--blue-strong)]"
              />
              <span className="flex-1">{c.label}</span>
              {c.critical && <span className="rounded-full bg-red/12 px-2 py-0.5 text-xs font-semibold text-red">critical</span>}
            </label>
          );
        })}
      </fieldset>
      <div className="mt-5 flex flex-col gap-4 sm:flex-row" aria-live="polite">
        <Outcome title="Match threshold only" d={without} note="What a plain percentage cutoff decides." />
        <Outcome
          title="With the hard-fail flag"
          d={withFlag}
          note={dangerous ? "Same score, different answer: a critical miss can never approve." : "Agrees with the threshold here."}
        />
      </div>
    </div>
  );
}
