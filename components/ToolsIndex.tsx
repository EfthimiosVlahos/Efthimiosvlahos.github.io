"use client";

import Link from "next/link";
import { useState } from "react";
import { evidence } from "@/content/evidence";
import { toolGroups } from "@/content/tools";
import type { Tool } from "@/content/types";

/** Pick a tool to see where it was used; the answer is always a link to the evidence. */
export function ToolsIndex() {
  const [selected, setSelected] = useState<Tool | null>(null);

  const places = selected
    ? Array.from(new Map(selected.usedIn.map((id) => [evidence[id].href + evidence[id].label, evidence[id]])).values())
    : [];

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {toolGroups.map((g) => (
          <div key={g.name} className="card p-5">
            <h3 className="text-lg">{g.name}</h3>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {g.tools.map((t) => {
                const active = selected?.name === t.name;
                return (
                  <li key={t.name}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelected(active ? null : t)}
                      className={`toggle ${active ? "" : "bg-raised text-ink hover:text-blue"}`}
                    >
                      {t.name}
                    </button>
                  </li>
                );
              })}
            </ul>
            {g.alsoFluent && <p className="mt-2 text-sm text-soft">Also familiar with: {g.alsoFluent.join(", ")}.</p>}
          </div>
        ))}
      </div>
      <div aria-live="polite" className="mt-6 min-h-[3.5rem] card px-5 py-4 text-sm">
        {selected ? (
          <p>
            <span className="font-medium">{selected.name}</span>
            <span className="text-soft"> was used in </span>
            {places.map((p, k) => (
              <span key={p.label}>
                {k > 0 && (k === places.length - 1 ? " and " : ", ")}
                <Link href={p.href}>{p.label}</Link>
              </span>
            ))}
            .
          </p>
        ) : (
          <p className="text-soft">Select a tool to see where I used it.</p>
        )}
      </div>
    </div>
  );
}
