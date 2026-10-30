import type { ReactNode } from "react";

export function SectionHeading({ id, title, intro }: { id: string; title: string; intro?: ReactNode }) {
  return (
    <div className="mb-10 max-w-[44rem]">
      <div className="eyebrow-rule mb-4" aria-hidden="true" />
      <h2 id={`${id}-title`} className="section-title">
        {title}
      </h2>
      {intro && <div className="mt-3 text-lg text-soft">{intro}</div>}
    </div>
  );
}

export function Section({ id, title, intro, children }: { id: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="sheet scroll-mt-20 pt-24">
      <SectionHeading id={id} title={title} intro={intro} />
      {children}
    </section>
  );
}

/** Title block for the top of an inner page. */
export function PageHeader({ title, intro }: { title: string; intro?: ReactNode }) {
  return (
    <header className="sheet pt-14 lg:pt-20">
      <div className="eyebrow-rule rise mb-5" aria-hidden="true" />
      <h1 className="rise text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.05]" style={{ ["--i" as string]: 1 }}>
        {title}
      </h1>
      {intro && (
        <div className="rise mt-4 max-w-[44rem] text-lg text-soft" style={{ ["--i" as string]: 2 }}>
          {intro}
        </div>
      )}
    </header>
  );
}
