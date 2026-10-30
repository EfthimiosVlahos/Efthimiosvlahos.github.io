import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/content/profile";
import { bio } from "@/content/about";
import { PageHeader, Section } from "@/components/Section";
import { LoopDrawing, LoopList } from "@/components/drawings/LoopDrawing";
import { Reveal } from "@/components/Reveal";
import { Principles } from "@/components/Principles";
import { EducationList } from "@/components/Experience";

export const metadata: Metadata = {
  title: "About Me",
  description: "How Efthimios Vlahos works: from defining what correct means to operating AI systems after they ship.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader title="About Me" />

      <section className="sheet mt-10 grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="space-y-5 text-lg leading-relaxed">
          {bio.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <p className="text-soft">{profile.bestWork}</p>
        </div>
        <aside className="card self-start p-6">
          <div className="text-sm font-semibold text-soft">At a glance</div>
          <dl className="mt-3 space-y-3 text-sm">
            <div>
              <dt className="text-soft">Based in</dt>
              <dd className="font-medium">{profile.location}</dd>
            </div>
            <div>
              <dt className="text-soft">Now</dt>
              <dd className="font-medium">Senior ML Engineer, Alliant Insurance Services</dd>
              <dd className="font-medium">
                Co-founder, <a href="https://pyxeon.com">Pyxeon</a>
              </dd>
            </div>
            <div>
              <dt className="text-soft">Best fit</dt>
              <dd className="font-medium">Forward-deployed engineering, applied AI, AI architecture</dd>
            </div>
            <div>
              <dt className="text-soft">Off the clock</dt>
              <dd className="font-medium">
                <Link href="/off-the-clock">Soccer, philosophy and travel</Link>
              </dd>
            </div>
          </dl>
          <a href={profile.resume} className="btn btn-primary mt-6 w-full justify-center" download>
            Download Resume
          </a>
        </aside>
      </section>

      <Section
        id="how-i-work"
        title="How I work"
        intro="The loop I run on every AI system, from the first conversation with the people who own the problem to running it in production."
      >
        <div className="diagram-frame hidden p-4 md:block lg:p-8">
          <Reveal className="mx-auto max-w-[780px]">
            <LoopDrawing />
          </Reveal>
        </div>
        <div className="md:hidden">
          <LoopList />
        </div>
      </Section>

      <Section
        id="principles"
        title="Ten working principles"
        intro="Numbered because the case studies cite them. Each one came from a specific mistake, mine or someone else’s."
      >
        <Principles />
      </Section>

      <Section id="education" title="Education">
        <EducationList />
      </Section>
    </>
  );
}
