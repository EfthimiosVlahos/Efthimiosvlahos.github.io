import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NameCard } from "@/components/NameCard";
import { AskTheAncients } from "@/components/lab/AskTheAncients";
import { XgPitch } from "@/components/lab/XgPitch";
import { Starfield } from "@/components/space/Starfield";
import { NightGlobe } from "@/components/space/NightGlobe";
import { NameConstellation, SectionGlyph, StarChartNav } from "@/components/space/SkyChart";

export const metadata: Metadata = {
  title: "Off the clock",
  description:
    "Greek roots, the Stoics and soccer, under a night sky: a search engine over Marcus Aurelius that runs in your browser, an expected-goals model you can shoot with, and the Mediterranean from orbit.",
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

function SkySection({
  id,
  glyph,
  title,
  intro,
  children,
}: {
  id: string;
  glyph: "stoa" | "pitch" | "med";
  title: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="sheet scroll-mt-20 pt-28">
      <div className="mx-auto mb-10 max-w-[44rem] text-center">
        <div className="flex justify-center">
          <SectionGlyph which={glyph} />
        </div>
        <h2 id={`${id}-title`} className="section-title mt-3">
          {title}
        </h2>
        <div className="mt-3 text-lg text-soft">{intro}</div>
      </div>
      {children}
    </section>
  );
}

export default function OffTheClockPage() {
  return (
    <div className="night relative pb-28">
      {/* Sticky sky: stays in view while scrolling this page, and stops where the page ends. */}
      <div className="pointer-events-none sticky top-0 -mb-[100dvh] h-[100dvh] w-full" aria-hidden="true">
        <Starfield />
      </div>

      <div className="relative">
        <header className="sheet flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center py-16 text-center">
          <h1 className="rise text-2xl font-semibold text-soft sm:text-3xl">Off the clock</h1>
          <div className="mt-8 w-full">
            <NameConstellation />
          </div>
          <p className="rise mt-8 max-w-[38rem] text-lg text-soft" style={{ ["--i" as string]: 3 }}>
            I’m Greek, I read philosophy for fun, I love soccer, and I travel whenever I can. When I like something, I
            end up building something small with AI about it.
          </p>
          <div className="rise mt-10" style={{ ["--i" as string]: 4 }}>
            <Epigraph cite="Marcus Aurelius, Meditations VII.47, tr. George Long">
              Look round at the courses of the stars, as if thou wert going along with them.
            </Epigraph>
          </div>
          <div className="mt-14 w-full max-w-[56rem]">
            <StarChartNav />
          </div>
        </header>

        <section aria-label="About my name" className="sheet pt-16">
          <NameCard />
        </section>

        <SkySection
          id="view-from-above"
          glyph="stoa"
          title="The view from above"
          intro={
            <>
              The Stoics had an exercise for perspective: picture your life as seen from the stars. I read them for fun, so
              I built a small search engine over Marcus Aurelius, Epictetus, Seneca and Socrates that runs entirely in your
              browser. It rewrites your question into the vocabulary of old translations, ranks over a thousand passages
              with BM25, and shows its work. No model writes the answers; every word is the original text.
            </>
          }
        >
          <AskTheAncients />
          <p className="mt-3 text-center text-xs text-soft">
            Texts: public-domain translations from Project Gutenberg (George Long, T. W. Higginson, Benjamin Jowett,
            Aubrey Stewart).
          </p>
        </SkySection>

        <SkySection
          id="floodlights"
          glyph="pitch"
          title="Under the floodlights"
          intro="Expected goals (xG) is the classic piece of machine learning in modern soccer analysis: the probability that a shot from a given spot becomes a goal. Click anywhere on the pitch to take a shot, or use the arrow keys."
        >
          <XgPitch />
          <p className="mt-3 text-center text-xs text-soft">
            A toy model: logistic regression on two features, fit to typical open-play values. Real xG models add body
            part, assist type, defenders and the goalkeeper’s position.
          </p>
        </SkySection>

        <SkySection
          id="from-orbit"
          glyph="med"
          title="The Mediterranean, from orbit"
          intro="The same exercise, applied to a map: Greece and Italy, two places I’ve been, lit up on the night side of the planet. Drag to spin it; it always drifts back to the Aegean."
        >
          <NightGlobe />
          <div className="mt-10">
            <Epigraph cite="Marcus Aurelius, Meditations IX.30, tr. George Long">
              Look down from above on the countless herds of men and their countless solemnities, and the infinitely
              varied voyagings in storms and calms.
            </Epigraph>
          </div>
        </SkySection>
      </div>
    </div>
  );
}
