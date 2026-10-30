import Link from "next/link";
import { builds, caseStudies } from "@/content/work";
import type { CaseSlug } from "@/content/types";
import { ProjectGlyph } from "./drawings/ProjectGlyph";

export function ProjectCards({ only }: { only?: CaseSlug[] }) {
  const items = only ? caseStudies.filter((c) => only.includes(c.slug)) : caseStudies.filter((c) => c.featured);
  return (
    <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.map((c) => (
        <li key={c.slug} className="card card-hover group relative flex flex-col overflow-hidden">
          <div className="relative h-36 overflow-hidden border-b border-rule bg-sunken">
            <ProjectGlyph slug={c.slug} />
          </div>
          <div className="flex flex-1 flex-col p-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-soft">
              <span className="chip">{c.org}</span>
              <span>{c.period}</span>
            </div>
            <h3 className="mt-3 text-xl leading-snug">
              <Link href={`/projects/${c.slug}`} className="text-ink no-underline after:absolute after:inset-0 after:content-[''] group-hover:text-blue">
                {c.title}
              </Link>
            </h3>
            <p className="mt-2 text-soft">{c.summary}</p>
            <ul className="mt-auto flex flex-wrap gap-2 pt-5" aria-label="Highlights">
              {c.highlights.map((h) => (
                <li key={h} className="rounded-full bg-blue/10 px-3 py-1 text-xs font-semibold text-blue">
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function MoreBuilds() {
  const writeUps = caseStudies.filter((c) => !c.featured);
  return (
    <div id="more-builds" className="mt-16 scroll-mt-24">
      <h2 className="text-2xl">More builds</h2>
      <ul className="mt-5 grid gap-4 md:grid-cols-2">
        {writeUps.map((c) => (
          <li key={c.slug} className="card card-hover relative p-5">
            <div className="font-semibold">
              <Link href={`/projects/${c.slug}`} className="text-ink no-underline after:absolute after:inset-0 after:content-[''] hover:text-blue">
                {c.name}
              </Link>
            </div>
            <p className="mt-1 text-sm text-soft">{c.summary}</p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {c.stack.slice(0, 4).map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
              <span className="ml-auto text-sm font-medium text-blue">Read the write-up</span>
            </div>
          </li>
        ))}
        {builds.map((b) => (
          <li key={b.id} className="card p-5">
            <div className="font-semibold">{b.name}</div>
            <p className="mt-1 text-sm text-soft">{b.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {b.stack.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
              {b.href && (
                <a href={b.href} className="ml-auto text-sm font-medium">
                  {b.linkLabel ?? "Link"}
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
