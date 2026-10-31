import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AskTheAncients } from "@/components/lab/AskTheAncients";
import { Starfield } from "@/components/space/Starfield";
import { NightGlobe } from "@/components/space/NightGlobe";
import { NameConstellation } from "@/components/space/SkyChart";
import { PlanetDefs, PlanetIcon, SolarSystem } from "@/components/space/SolarSystem";
import { KeepyUppy } from "@/components/space/KeepyUppy";
import { ScoutingReport } from "@/components/space/ScoutingReport";
import { EuropeanCups } from "@/components/space/EuropeanCups";
import { LegDays } from "@/components/space/LegDays";
import { OneRepMax } from "@/components/space/OneRepMax";
import { DoublePendulum } from "@/components/space/DoublePendulum";
import type { PlanetId } from "@/content/personal";

export const metadata: Metadata = {
  title: "Off the clock",
  description:
    "The person behind the work: a Greek American on Long Island, one of four siblings, Sunday league regular and leg-day loyalist. Orbit my solar system, keep a ball up, read my (made-up) scouting report, estimate your one-rep max, watch chaos in a double pendulum, and ask the Stoics a question.",
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

const ONE_OF_FOUR = [
  "Negotiating for the front seat was my first stakeholder management.",
  "Dinner-table debates taught me to bring evidence, because opinions got outvoted.",
  "Somebody always needs a ride, a hand or a second opinion, and you show up.",
];

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
          <p className="rise mt-10 max-w-[38rem] text-lg text-soft sm:text-xl" style={{ ["--i" as string]: 4 }}>
            The person behind the pull requests: Greek American, Long Island, one of four, Sunday league regular,
            leg-day loyalist, and a Real Madrid fan with very high expectations.
          </p>
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
          intro="Being Greek American comes with two guarantees: every family gathering has enough food for a small army, and someone will tell you the word you just used comes from Greek. (They’re usually right.) Home is Long Island, New York. The arc runs from Greece to home, and Italy glows because I’ve been there too and still think about the food."
        >
          <NightGlobe />
          <figure className="card mx-auto mt-12 max-w-[40rem] p-6 sm:p-8">
            <figcaption className="text-xl font-semibold">Things you learn as one of four</figcaption>
            <ul className="mt-4 space-y-3 text-lg leading-relaxed">
              {ONE_OF_FOUR.map((line) => (
                <li key={line} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rounded-full bg-[#ffe7c7]" />
                  {line}
                </li>
              ))}
            </ul>
          </figure>
          <div className="mt-12">
            <Epigraph cite="Marcus Aurelius, Meditations IX.30, tr. George Long">
              Look down from above on the countless herds of men and their countless solemnities, and the infinitely
              varied voyagings in storms and calms.
            </Epigraph>
          </div>
        </OrbitSection>

        <OrbitSection
          id="soccer"
          planet="soccer"
          title="Sunday league and Real Madrid"
          intro="I play Sunday league: ambitious tactics, optional warm-ups, and a group chat that never sleeps. The rest of the week I’m a Real Madrid fan, which is mostly joy with the occasional ninety minutes of cardiac stress. Warm up first: keep the ball off the grass for as many touches as you can."
        >
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] [&_figure]:my-0">
            <div className="mx-auto w-full max-w-[30rem]">
              <KeepyUppy />
              <p className="mt-3 text-center text-xs text-soft">
                Real gravity, and the ball spins and drifts depending on where you strike it. Space or Enter kicks.
              </p>
            </div>
            <ScoutingReport />
          </div>
          <div className="mt-6">
            <EuropeanCups />
          </div>
        </OrbitSection>

        <OrbitSection
          id="gym"
          planet="gym"
          title="The gym (legs included)"
          intro="I love lifting. Rule one: never skip leg day. Rule two: see rule one. Every lifter also wonders what their max is without actually testing it, so pick a lift, enter a set you’ve done, and let two classic formulas do the guessing."
        >
          <LegDays />
          <div className="mt-8">
            <OneRepMax />
          </div>
        </OrbitSection>

        <OrbitSection
          id="physics"
          planet="physics"
          title="Math and physics, for fun"
          intro="My degrees are in math and physics, and I still work through problems on weekends. Voluntarily. My siblings have questions. A favorite small lesson: two double pendulums released a hair apart, simulated step by step in your browser."
        >
          <DoublePendulum />
          <p className="mt-3 text-center text-xs text-soft">
            Integrated with fourth-order Runge–Kutta at 2 ms steps. After ten simulated minutes, total energy is off by
            less than a thousandth of a percent.
          </p>
        </OrbitSection>

        <OrbitSection
          id="view-from-above"
          planet="philosophy"
          title="The view from above"
          intro={
            <>
              The Stoics had an exercise for perspective: picture your life as seen from the stars. It works on big
              questions and on late equalizers. I read them for fun, so I built a small search engine over Marcus
              Aurelius, Epictetus, Seneca and Socrates that runs entirely in your browser. It rewrites your question into
              the vocabulary of old translations, ranks over a thousand passages with BM25, and shows its work. No model
              writes the answers; every word is the original text.
            </>
          }
        >
          <AskTheAncients />
          <p className="mt-3 text-center text-xs text-soft">
            Texts: public-domain translations from Project Gutenberg (George Long, T. W. Higginson, Benjamin Jowett,
            Aubrey Stewart).
          </p>
          <div className="mt-16">
            <Epigraph cite="Marcus Aurelius, Meditations VII.47, tr. George Long">
              Look round at the courses of the stars, as if thou wert going along with them.
            </Epigraph>
          </div>
        </OrbitSection>
      </div>
    </div>
  );
}
