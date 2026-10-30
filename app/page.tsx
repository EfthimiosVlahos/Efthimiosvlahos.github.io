import Link from "next/link";
import { profile } from "@/content/profile";
import { HeroNetwork } from "@/components/HeroNetwork";
import { SocialLinks } from "@/components/SocialLinks";
import { ImpactGrid } from "@/components/ImpactGrid";
import { ProjectCards } from "@/components/ProjectCards";
import { SkillsConstellation } from "@/components/SkillsConstellation";
import { ToolsIndex } from "@/components/ToolsIndex";
import { EvalGate } from "@/components/lab/EvalGate";
import { Section } from "@/components/Section";

const rise = (i: number) => ({ ["--i" as string]: i });

export default function Home() {
  return (
    <>
      <section aria-labelledby="hero-title" className="hero-glow relative isolate overflow-hidden">
        <HeroNetwork className="absolute inset-0 -z-10 h-full w-full [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]" />
        <div className="sheet flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center py-20 text-center">
          <div className="rise relative" style={rise(0)}>
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-strong to-violet opacity-40 blur-xl" aria-hidden="true" />
            <div className="relative rounded-full bg-gradient-to-br from-blue to-violet p-[3px]">
              {/* Static export: the image is pre-sized, so a plain img avoids the unavailable optimizer. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Profile_pic_linkedIn.jpg"
                alt={profile.name}
                width={144}
                height={144}
                className="size-36 rounded-full border-4 border-paper object-cover"
              />
            </div>
          </div>

          <h1 id="hero-title" className="rise mt-7 text-[clamp(2.6rem,6vw,4.25rem)] leading-[1.05] font-extrabold" style={rise(1)}>
            {profile.name}
          </h1>
          <p className="rise gradient-text mt-3 text-xl font-semibold sm:text-2xl" style={rise(2)}>
            {profile.positioning}
          </p>
          <p className="rise mt-2 text-soft" style={rise(2)}>
            <span className="block md:inline">Senior ML Engineer, Alliant Insurance Services</span>
            <span className="mx-2 hidden md:inline" aria-hidden="true">
              ·
            </span>
            <span className="block md:inline">
              Co-founder,{" "}
              <a href="https://pyxeon.com" className="no-underline">
                Pyxeon
              </a>
            </span>
          </p>
          <p className="rise mt-5 max-w-[40rem] text-xl leading-relaxed text-ink sm:text-[1.4rem]" style={rise(3)}>
            {profile.headline}
          </p>

          <div className="rise mt-8 flex flex-col items-center gap-6" style={rise(4)}>
            <SocialLinks />
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/projects" className="btn btn-primary">
                See case studies
              </Link>
              <a href={`mailto:${profile.email}`} className="btn btn-quiet">
                Email me
              </a>
              <a href={profile.resume} className="btn btn-quiet" download>
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download resume
              </a>
            </div>
          </div>
        </div>
      </section>

      <Section
        id="impact"
        title="Impact at a glance"
        intro="Selected results from systems running in production, with how they were measured where my records show it."
      >
        <ImpactGrid />
      </Section>

      <Section
        id="featured"
        title="Featured projects"
        intro="The problem, the system I built, and what happened once real users and real data hit it."
      >
        <ProjectCards />
      </Section>

      <Section
        id="skills"
        title="Skills, wired to the work"
        intro="Every skill links to the roles and projects where I used it."
      >
        <div className="hidden md:block">
          <SkillsConstellation />
        </div>
        <div className="md:hidden">
          <ToolsIndex />
        </div>
        <p className="mt-6 text-center text-sm">
          <Link href="/skills">All skills and certifications</Link>
        </p>
      </Section>

      <Section
        id="method"
        title="Every change runs the eval gate"
        intro="Before any prompt, model or tool change ships, it runs against a golden set (a fixed set of cases with known-good answers) and has to clear quality, safety, cost and latency gates. Propose a change to a customer-support agent and run the eval."
      >
        <EvalGate />
        <p className="mt-3 text-xs text-soft">
          Illustrative example: the agent and its numbers are made up to show the pattern. The gate itself is how I ship
          changes to real systems.
        </p>
      </Section>

      <section id="contact" aria-labelledby="contact-title" className="sheet scroll-mt-20 pt-24">
        <div className="card relative overflow-hidden p-8 sm:p-12">
          <div className="hero-glow pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-end">
            <div>
              <h2 id="contact-title" className="section-title">
                Where I do my best work
              </h2>
              <p className="mt-5 text-lg leading-relaxed">{profile.bestWork}</p>
              <p className="mt-3 text-soft">
                That makes me most useful in {profile.bestFit[0]}, {profile.bestFit[1]} and {profile.bestFit[2]}.
              </p>
            </div>
            <div>
              <p className="text-soft">The fastest way to reach me is email.</p>
              <p className="mt-1 text-2xl font-bold sm:text-[1.7rem]">
                <a href={`mailto:${profile.email}`} className="no-underline">
                  {profile.email}
                </a>
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href={`mailto:${profile.email}`} className="btn btn-primary">
                  Email me
                </a>
                <a href={profile.linkedin} className="btn btn-quiet">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
