import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { caseStudies } from "@/content/work";
import { principle } from "@/content/principles";
import type { CaseStudyMeta, CaseSlug } from "@/content/types";

export function caseMetadata(slug: CaseSlug): Metadata {
  const c = caseStudies.find((x) => x.slug === slug);
  if (!c) throw new Error(`Unknown case study ${slug}`);
  return {
    title: c.title,
    description: c.summary,
    alternates: { canonical: `/projects/${slug}` },
    // A page-level openGraph object replaces the site default, so the share image must be restated.
    openGraph: {
      type: "article",
      title: c.title,
      description: c.summary,
      url: `/projects/${slug}`,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: c.title }],
    },
    twitter: { card: "summary_large_image", title: c.title, description: c.summary, images: ["/opengraph-image"] },
  };
}

export function CaseLayout({ meta, children }: { meta: CaseStudyMeta; children: ReactNode }) {
  const index = caseStudies.findIndex((c) => c.slug === meta.slug);
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <article>
      <div className="hero-glow">
        <div className="sheet pt-10 pb-12 lg:pt-14">
          <nav aria-label="Breadcrumb" className="rise text-sm text-soft">
            <Link href="/projects">Projects</Link>
            <span aria-hidden="true"> / </span>
            <span>{meta.org}</span>
          </nav>
          <div className="mt-6 grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,44rem)_1fr]">
            <header>
              <div className="eyebrow-rule rise mb-5" aria-hidden="true" />
              <h1 className="rise text-[clamp(2.3rem,5vw,3.6rem)] leading-[1.05]" style={{ ["--i" as string]: 1 }}>
                {meta.title}
              </h1>
              <p className="rise mt-5 text-xl leading-relaxed text-soft" style={{ ["--i" as string]: 2 }}>
                {meta.summary}
              </p>
              <ul className="rise mt-6 flex flex-wrap gap-2" style={{ ["--i" as string]: 3 }} aria-label="Highlights">
                {meta.highlights.map((h) => (
                  <li key={h} className="rounded-full bg-blue/10 px-3 py-1 text-sm font-semibold text-blue">
                    {h}
                  </li>
                ))}
              </ul>
            </header>
            <dl className="card rise grid grid-cols-2 content-start gap-x-6 gap-y-4 self-start p-6 text-sm lg:grid-cols-1" style={{ ["--i" as string]: 2 }}>
              <div>
                <dt className="text-soft">Where</dt>
                <dd className="font-semibold">{meta.org}</dd>
              </div>
              <div>
                <dt className="text-soft">Role</dt>
                <dd className="font-semibold">{meta.role}</dd>
              </div>
              <div>
                <dt className="text-soft">When</dt>
                <dd className="font-semibold">{meta.period}</dd>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <dt className="text-soft">Stack</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {meta.stack.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="sheet">{children}</div>

      <aside className="sheet mt-20" aria-label="Principles and next case study">
        <div className={`grid gap-5 ${meta.principles.length ? "lg:grid-cols-2" : ""}`}>
          {meta.principles.length > 0 && (
          <div className="card p-6">
            <h2 className="text-xl">Principles this shows</h2>
            <ul className="mt-4 space-y-2.5">
              {meta.principles.map((n) => (
                <li key={n} className="flex items-center gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-blue/10 text-xs font-bold text-blue">{n}</span>
                  <a href={`/about#principle-${n}`}>{principle(n).title}</a>
                </li>
              ))}
            </ul>
          </div>
          )}
          {next && next.slug !== meta.slug && (
            <Link href={`/projects/${next.slug}`} className="card card-hover group block p-6 no-underline">
              <div className="text-sm font-medium text-soft">Next case study</div>
              <div className="mt-2 text-xl font-bold text-ink group-hover:text-blue">{next.title}</div>
              <p className="mt-2 text-soft">{next.summary}</p>
            </Link>
          )}
        </div>
      </aside>
    </article>
  );
}

/** A case-study chapter: heading in the margin-aware column, prose beneath. */
export function Chapter({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 pt-16">
      <h2 id={`${id}-h`} className="max-w-[44rem] text-[1.9rem] leading-[1.15]">
        {title}
      </h2>
      <div className="with-margin mt-5">{children}</div>
    </section>
  );
}

/** A compact results table for the end of a case study. */
export function Outcomes({ rows }: { rows: { label: string; value: string; note?: string }[] }) {
  return (
    <table className="data-table mt-6 max-w-[44rem]">
      <caption className="sr-only">Outcomes</caption>
      <thead>
        <tr>
          <th scope="col">Measure</th>
          <th scope="col">Result</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label}>
            <td>
              {r.label}
              {r.note && <span className="block text-xs text-soft">{r.note}</span>}
            </td>
            <td className="font-semibold whitespace-nowrap text-ink">{r.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
