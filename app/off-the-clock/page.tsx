import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/Section";
import { NameCard } from "@/components/NameCard";
import { AskTheAncients } from "@/components/lab/AskTheAncients";
import { XgPitch } from "@/components/lab/XgPitch";

export const metadata: Metadata = {
  title: "Off the Clock",
  description:
    "Greek roots, philosophy and soccer: a search engine over the Stoics that runs in your browser, and an expected-goals model you can shoot with.",
  alternates: { canonical: "/off-the-clock" },
};

export default function OffTheClockPage() {
  return (
    <>
      <PageHeader
        title="Off the Clock"
        intro="I’m Greek, I read philosophy for fun, I love soccer, and I travel whenever I can, Greece and Italy included. When I like something, I end up building something small with AI about it. Two of those are below."
      />

      <section className="sheet mt-10" aria-label="About my name">
        <NameCard />
      </section>

      <Section
        id="ask-the-ancients"
        title="Ask the ancients"
        intro={
          <>
            A small search engine over Marcus Aurelius, Epictetus, Seneca and Socrates that runs entirely in your browser.
            It rewrites your question into the vocabulary of 19th-century translations, ranks over a thousand passages
            with BM25, and shows its work. No model writes the answers, so every word is the original text: the
            retrieval half of RAG, done honestly.
          </>
        }
      >
        <AskTheAncients />
        <p className="mt-3 text-xs text-soft">
          Texts: public-domain translations from Project Gutenberg (George Long, T. W. Higginson, Benjamin Jowett, Aubrey
          Stewart).
        </p>
      </Section>

      <Section
        id="expected-goals"
        title="Expected goals, by hand"
        intro="Expected goals (xG) is the classic piece of machine learning in modern soccer analysis: the probability that a shot from a given spot becomes a goal. Click anywhere on the pitch to take a shot, or use the arrow keys."
      >
        <XgPitch />
        <p className="mt-3 text-xs text-soft">
          A toy model: logistic regression on two features, fit to typical open-play values. Real xG models add body part,
          assist type, defenders and the goalkeeper’s position.
        </p>
      </Section>
    </>
  );
}
