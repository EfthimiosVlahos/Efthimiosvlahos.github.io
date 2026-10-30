"use client";

import { useId, useState, type ReactNode } from "react";

/**
 * A margin note (Tufte-style). On wide screens it floats into the right margin of `.with-margin`
 * prose; on narrow screens the numbered marker toggles it inline.
 */
export function Sidenote({ n, children }: { n: number; children: ReactNode }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="sn-ref"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`Note ${n}`}
        onClick={() => setOpen((o) => !o)}
      >
        {n}
      </button>
      <span id={id} className="sn-body" data-open={open} role="note">
        <span className="sn-num">{n}</span>
        {children}
      </span>
    </>
  );
}
