import type { Metadata } from "next";
import { PageHeader } from "@/components/Section";
import { MoreBuilds, ProjectCards } from "@/components/ProjectCards";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Projects",
  description: "Case studies in agentic systems, document AI, LLM evaluation and production ML.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        title="Projects"
        intro="Case studies written the way I’d walk an interviewer through them: the problem, the system I built, what broke, and how I found it."
      />
      <div className="sheet mt-10">
        <ProjectCards />
        <MoreBuilds />
        <p className="mt-10 text-sm text-soft">
          Older coursework and experiments are on <a href={profile.github}>GitHub</a>.
        </p>
      </div>
    </>
  );
}
