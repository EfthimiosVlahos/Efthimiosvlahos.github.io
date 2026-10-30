"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { evidence as evidenceLabels } from "@/content/evidence";
import { toolGroups } from "@/content/tools";
import type { EvidenceId } from "@/content/types";
import { layoutConstellation } from "@/lib/constellation";

type Focus = { kind: "skill"; id: string } | { kind: "evidence"; id: EvidenceId } | null;

const cat = (g: number) => `var(--cat-${g + 1})`;

/**
 * Every skill on the ring links to the roles and projects where it was used.
 * Hover or focus a skill to light its links; click to pin. Narrow screens get ToolsIndex instead.
 */
export function SkillsConstellation() {
  const layout = useMemo(() => layoutConstellation(toolGroups, evidenceLabels), []);
  const [hover, setHover] = useState<Focus>(null);
  const [pinned, setPinned] = useState<Focus>(null);
  const focus = hover ?? pinned;

  const litSkills = new Set<string>();
  const litEvidence = new Set<EvidenceId>();
  if (focus?.kind === "skill") {
    litSkills.add(focus.id);
    layout.skills.find((s) => s.id === focus.id)?.usedIn.forEach((id) => litEvidence.add(id));
  } else if (focus?.kind === "evidence") {
    litEvidence.add(focus.id);
    layout.skills.filter((s) => s.usedIn.includes(focus.id)).forEach((s) => litSkills.add(s.id));
  }
  const dim = focus !== null;

  const toggle = (f: NonNullable<Focus>) =>
    setPinned((p) => (p && p.kind === f.kind && p.id === f.id ? null : f));

  const focusedSkill = focus?.kind === "skill" ? layout.skills.find((s) => s.id === focus.id) : undefined;
  const focusedEvidence = focus?.kind === "evidence" ? layout.evidence.find((e) => e.id === focus.id) : undefined;

  return (
    <div className="constellation">
      <svg
        viewBox={`0 0 ${layout.size} ${layout.size}`}
        className="mx-auto block h-auto w-full max-w-[56rem]"
        role="group"
        aria-label="Skills linked to the roles and projects where I used them"
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <radialGradient id="cs-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--blue-strong)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--blue-strong)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={layout.size / 2} cy={layout.size / 2} r={290} fill="url(#cs-core)" />

        {layout.arcs.map((a) => (
          <g key={a.name} aria-hidden="true">
            <path d={a.d} fill="none" stroke={cat(a.group)} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
          </g>
        ))}

        <g aria-hidden="true">
          {layout.edges.map((e) => {
            const lit = litSkills.has(e.skill) && litEvidence.has(e.evidence);
            return (
              <path
                key={`${e.skill}-${e.evidence}`}
                d={e.d}
                className="edge"
                fill="none"
                stroke={cat(e.group)}
                strokeWidth={lit ? 2.2 : 1.1}
                strokeOpacity={lit ? 0.95 : dim ? 0.05 : 0.22}
              />
            );
          })}
        </g>

        {layout.arcs.map((a) => (
          <text
            key={`${a.name}-label`}
            x={a.tx}
            y={a.ty}
            textAnchor={a.anchor}
            dominantBaseline="middle"
            fontSize={13.5}
            fontWeight={700}
            fill="var(--ink)"
            stroke="var(--paper)"
            strokeWidth={5}
            paintOrder="stroke"
            aria-hidden="true"
          >
            {a.name}
          </text>
        ))}

        {layout.evidence.map((e) => {
          const lit = litEvidence.has(e.id);
          return (
            <g
              key={e.id}
              tabIndex={0}
              role="button"
              aria-pressed={pinned?.kind === "evidence" && pinned.id === e.id}
              aria-label={`${e.label}: show the skills used there`}
              onMouseEnter={() => setHover({ kind: "evidence", id: e.id })}
              onFocus={() => setHover({ kind: "evidence", id: e.id })}
              onBlur={() => setHover(null)}
              onClick={() => toggle({ kind: "evidence", id: e.id })}
              onKeyDown={(ev) => {
                if (ev.key === "Enter" || ev.key === " ") {
                  ev.preventDefault();
                  toggle({ kind: "evidence", id: e.id });
                }
              }}
              className="cursor-pointer outline-none"
              opacity={dim && !lit ? 0.35 : 1}
              style={{ transition: "opacity 250ms ease" }}
            >
              <rect
                x={e.x}
                y={e.y}
                width={e.w}
                height={e.h}
                rx={e.h / 2}
                fill={lit ? "var(--blue-strong)" : "var(--paper-raised)"}
                stroke={lit ? "var(--blue-strong)" : "var(--rule)"}
                strokeWidth={1.2}
              />
              <text
                x={e.x + e.w / 2}
                y={e.y + e.h / 2 + 5}
                textAnchor="middle"
                fontSize={14}
                fontWeight={600}
                fill={lit ? "#fff" : "var(--ink)"}
              >
                {e.label}
              </text>
            </g>
          );
        })}

        {layout.skills.map((s) => {
          const lit = litSkills.has(s.id);
          return (
            <g
              key={s.id}
              tabIndex={0}
              role="button"
              aria-pressed={pinned?.kind === "skill" && pinned.id === s.id}
              aria-label={`${s.name}: show where I used it`}
              onMouseEnter={() => setHover({ kind: "skill", id: s.id })}
              onFocus={() => setHover({ kind: "skill", id: s.id })}
              onBlur={() => setHover(null)}
              onClick={() => toggle({ kind: "skill", id: s.id })}
              onKeyDown={(ev) => {
                if (ev.key === "Enter" || ev.key === " ") {
                  ev.preventDefault();
                  toggle({ kind: "skill", id: s.id });
                }
              }}
              className="cursor-pointer outline-none"
              opacity={dim && !lit ? 0.3 : 1}
              style={{ transition: "opacity 250ms ease" }}
            >
              <circle cx={s.x} cy={s.y} r={14} fill="transparent" />
              <circle
                className="node"
                cx={s.x}
                cy={s.y}
                r={lit ? 8 : 6}
                fill={cat(s.group)}
                stroke="var(--paper)"
                strokeWidth={2}
              />
              <text
                x={s.lx}
                y={s.ly}
                textAnchor={s.anchor}
                dominantBaseline="middle"
                fontSize={14.5}
                fontWeight={lit ? 700 : 500}
                fill={lit ? "var(--ink)" : "var(--ink-soft)"}
                transform={`rotate(${s.rotate} ${s.lx} ${s.ly})`}
              >
                {s.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div aria-live="polite" className="card mx-auto mt-4 min-h-[4.5rem] max-w-[44rem] px-5 py-4 text-sm">
        {focusedSkill ? (
          <p>
            <span className="font-semibold">{focusedSkill.name}</span>
            <span className="text-soft"> was used in </span>
            <EvidenceLinks ids={focusedSkill.usedIn} />.
          </p>
        ) : focusedEvidence ? (
          <p>
            <Link href={evidenceLabels[focusedEvidence.id].href} className="font-semibold">
              {focusedEvidence.label}
            </Link>
            <span className="text-soft"> used </span>
            {layout.skills
              .filter((s) => s.usedIn.includes(focusedEvidence.id))
              .map((s) => s.name)
              .join(", ")}
            .
          </p>
        ) : (
          <p className="text-soft">
            Hover or tab to any skill or project to light up its connections. Click to pin one.
          </p>
        )}
      </div>
    </div>
  );
}

function EvidenceLinks({ ids }: { ids: EvidenceId[] }) {
  const places = Array.from(new Map(ids.map((id) => [evidenceLabels[id].href + evidenceLabels[id].label, evidenceLabels[id]])).values());
  return (
    <>
      {places.map((p, k) => (
        <span key={p.label}>
          {k > 0 && (k === places.length - 1 ? " and " : ", ")}
          <Link href={p.href}>{p.label}</Link>
        </span>
      ))}
    </>
  );
}
