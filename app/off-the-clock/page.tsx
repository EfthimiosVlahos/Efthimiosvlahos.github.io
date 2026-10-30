import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NameCard } from "@/components/NameCard";
import { AskTheAncients } from "@/components/lab/AskTheAncients";
import { Starfield } from "@/components/space/Starfield";
import { NightGlobe } from "@/components/space/NightGlobe";
import { NameConstellation } from "@/components/space/SkyChart";
import { PlanetDefs, PlanetIcon, SolarSystem } from "@/components/space/SolarSystem";
import { KeepyUppy } from "@/components/space/KeepyUppy";
import { EuropeanCups } from "@/components/space/EuropeanCups";
import { OneRepMax } from "@/components/space/OneRepMax";
import { DoublePendulum } from "@/components/space/DoublePendulum";
import type { PlanetId } from "@/content/personal";

export const metadata: Metadata = {
  title: "Off the clock",
  description:
    "The person behind the work: a Greek American on Long Island, one of four siblings. Orbit my solar system, keep a ball up, estimate your one-rep max, watch chaos in a double pendulum, and ask the Stoics a question.",
  alternates: { canonical: "/off-the-clock" },
};

function Epigraph({ children, cite }: { children: ReactNode; cite: string }) {
  return (
    <figure className="mx-auto max-w-[40rem] text-center">
      <blockquote className="text-lg leading-relaxed text-ink/90 italic sm:text-xl">“{children}”</blockquote>
      <figcaption className="mt-2 text-sm text-soft">{cite}</figcaption>
    </figure>
  );
}

/** A section that belongs to one planet in the solar system, headed by that planet. */
function OrbitSection({
  id,
  planet,
  title,
  intro,
  children,
}: {
  id: string;
  planet: PlanetId;
  title: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="sheet scroll-mt-20 pt-28">
      <div className="mx-auto mb-10 max-w-[44rem] text-center">
        <div className="flex justify-center">
          <PlanetIcon id={planet} />
        </div>
        <h2 id={`${id}-title`} className="section-title mt-3">
          {title}
        </h2>
        <div className="mt-3 text-lg text-soft">{intro}</div>
      </div>
      {children}
      <p className="mt-8 text-center text-sm">
        <a href="#orbit" className="text-soft hover:text-ink">
          Back to the solar system
        </a>
      </p>
    </section>
  );
}

export default function OffTheClockPage() {
  return (
    <div className="night relative pb-28">
      <PlanetDefs />
      {/* Sticky sky: stays in view while scrolling this page, and stops where the page ends. */}
      <div className="pointer-events-none sticky top-0 -mb-[100dvh] h-[100dvh] w-full" aria-hidden="true">
        <Starfield />
      </div>

      <div className="relative">
        <header className="sheet flex min-h-[70dvh] flex-col items-center justify-center pt-16 pb-8 text-center">
          <h1 className="rise text-2xl font-semibold text-soft sm:text-3xl">Off the clock</h1>
          <div className="mt-8 w-full">
            <NameConstellation />
          </div>
          <div className="rise mt-10" style={{ ["--i" as string]: 4 }}>
            <Epigraph cite="Marcus Aurelius, Meditations VII.47, tr. George Long">
              Look round at the courses of the stars, as if thou wert going along with them.
            </Epigraph>
          </div>
        </header>

        <section id="orbit" aria-labelledby="orbit-title" className="sheet scroll-mt-20 pt-12">
          <div className="mx-auto mb-6 max-w-[44rem] text-center">
            <h2 id="orbit-title" className="section-title">
              My solar system
            </h2>
            <p className="mt-3 text-lg text-soft">Me at the center, the things I love in orbit. Everything below is interactive.</p>
          </div>
          <SolarSystem />
        </section>

        <OrbitSection
          id="roots"
          planet="home"
          title="Greek roots, Long Island home"
          intro="I’m Greek American, one of four siblings, and I live on Long Island, New York. The arc runs from Greece to home; Italy glows because I’ve been there too. Drag the globe to spin it."
        >
          <NightGlobe />
          <div className="mt-12">
            <Epigraph cite="Marcus Aurelius, Meditations IX.30, tr. George Long">
              Look down from above on the countless herds of men and their countless solemnities, and the infinitely
              varied voyagings in storms and calms.
            </Epigraph>
          </div>
          <div className="mt-12">
            <NameCard />
          </div>
        </OrbitSection>

        <OrbitSection
          id="soccer"
          planet="soccer"
          title="Sunday league and Real Madrid"
          intro="I play Sunday league soccer, and my team is Real Madrid. Warm up first: keep the ball off the grass for as many touches as you can."
        >
          <div className="mx-auto max-w-[30rem]">
            <KeepyUppy />
            <p className="mt-3 text-center text-xs text-soft">
              Real gravity, and the ball spins and drifts depending on where you strike it. Space or Enter kicks.
            </p>
          </div>
          <div className="mt-6">
            <EuropeanCups />
          </div>
        </OrbitSection>

        <OrbitSection
          id="gym"
          planet="gym"
          title="The gym"
          intro="I love lifting, and every lifter wonders what their max is without testing it. Enter a set you’ve done and two classic formulas will estimate it."
        >
          <OneRepMax />
        </OrbitSection>

        <OrbitSection
          id="physics"
          planet="physics"
          title="Math and physics, for fun"
          intro="My degrees are in math and physics, and I still study both in my downtime. A favorite small lesson: two double pendulums released a hair apart, simulated step by step in your browser."
        >
          <DoublePendulum />
          <p className="mt-3 text-center text-xs text-soft">
            Integrated with fourth-order Runge–Kutta at 2 ms steps. After ten simulated minutes, total energy is off by less than a thousandth of a percent.
          </p>
        </OrbitSection>

        <OrbitSection
          id="view-from-above"
          planet="philosophy"
          title="The view from above"
          intro={
            <>
              The Stoics had an exercise for perspective: picture your life as seen from the stars. I love reading them,
              so I built a small search engine over Marcus Aurelius, Epictetus, Seneca and Socrates that runs entirely in
              your browser. It rewrites your question into the vocabulary of old translations, ranks over a thousand
              passages with BM25, and shows its work. No model writes the answers; every word is the original text.
            </>
          }
        >
          <AskTheAncients />
          <p className="mt-3 text-center text-xs text-soft">
            Texts: public-domain translations from Project Gutenberg (George Long, T. W. Higginson, Benjamin Jowett,
            Aubrey Stewart).
          </p>
        </OrbitSection>
      </div>
    </div>
  );
}
