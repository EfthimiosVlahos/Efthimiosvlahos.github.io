import Link from "next/link";
import { certifications, education, formatRange, roles } from "@/content/experience";
import type { Certification } from "@/content/types";

/** Anything past the first four is shown behind a disclosure, so the list stays compact. */
const PRIMARY_CERTS = 4;

export function ExperienceList() {
  return (
    <ol className="relative space-y-5 border-l border-rule pl-6 sm:pl-8">
      {roles.map((r) => (
        <li key={r.id} className="relative">
          <span
            className="absolute top-7 -left-[1.95rem] size-3.5 rounded-full border-2 border-paper bg-blue-strong shadow-[0_0_0_4px_var(--glow)] sm:-left-[2.45rem]"
            aria-hidden="true"
          />
          <article className="card card-hover p-6">
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-1">
              <div>
                <h3 className="text-xl leading-snug">{r.title}</h3>
                <p className="font-semibold text-blue">{r.orgUrl ? <a href={r.orgUrl}>{r.org}</a> : r.org}</p>
              </div>
              <div className="text-sm text-soft sm:text-right">
                <div className="font-medium tabular-nums">{formatRange(r.start, r.end)}</div>
                <div>{r.location}</div>
              </div>
            </div>
            <p className="mt-3 text-soft">{r.summary}</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-blue">
              {r.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            {r.caseStudy && (
              <p className="mt-4 text-sm font-medium">
                <Link href={`/projects/${r.caseStudy}`}>Read the case study</Link>
              </p>
            )}
          </article>
        </li>
      ))}
    </ol>
  );
}

function CertRow({ c }: { c: Certification }) {
  return (
    <li className="flex justify-between gap-4 py-2.5">
      <span>
        {c.href ? <a href={c.href}>{c.name}</a> : <span className="font-medium">{c.name}</span>}
        <span className="block text-soft">{c.issuer}</span>
      </span>
      <span className="shrink-0 text-soft tabular-nums">{c.date}</span>
    </li>
  );
}

export function Certifications() {
  const primary = certifications.slice(0, PRIMARY_CERTS);
  const courses = certifications.slice(PRIMARY_CERTS);
  return (
    <div className="card p-6">
      <ul className="divide-y divide-rule text-sm">
        {primary.map((c) => (
          <CertRow key={c.name} c={c} />
        ))}
      </ul>
      {courses.length > 0 && (
        <details className="disclosure mt-3 text-sm">
          <summary className="font-medium">{courses.length} more courses</summary>
          <ul className="mt-2 divide-y divide-rule">
            {courses.map((c) => (
              <CertRow key={c.name} c={c} />
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

export function EducationList() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {education.map((e) => (
        <li key={e.school} className="card p-6">
          <div className="text-sm font-medium text-soft">{e.year}</div>
          <div className="mt-1 text-lg font-semibold">{e.school}</div>
          <div className="text-soft">{e.degree}</div>
        </li>
      ))}
    </ul>
  );
}
