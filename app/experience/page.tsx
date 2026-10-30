import type { Metadata } from "next";
import { PageHeader } from "@/components/Section";
import { ExperienceList } from "@/components/Experience";
import { CareerTimeline } from "@/components/charts/CareerTimeline";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Experience",
  description: "Roles at Alliant Insurance Services, Pyxeon, Con Edison, Cornerstone Building Brands and Microsoft.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return (
    <>
      <PageHeader
        title="Experience"
        intro={
          <>
            From data quality for an LLM chatbot to running production AI on GPUs I operate. The full story is in my{" "}
            <a href={profile.resume}>resume</a>.
          </>
        }
      />
      <div className="sheet">
        <CareerTimeline />
        <div className="mt-12">
          <ExperienceList />
        </div>
      </div>
    </>
  );
}
