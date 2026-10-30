import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/Section";
import { SkillsConstellation } from "@/components/SkillsConstellation";
import { ToolsIndex } from "@/components/ToolsIndex";
import { Certifications } from "@/components/Experience";

export const metadata: Metadata = {
  title: "Skills & Certifications",
  description: "Skills in LLM agents, evaluation, retrieval, model serving and MLOps, each linked to where it was used.",
  alternates: { canonical: "/skills" },
};

export default function SkillsPage() {
  return (
    <>
      <PageHeader
        title="Skills & Certifications"
        intro="A skills list is only as good as its evidence, so every skill here links to the roles and projects where I used it."
      />
      <div className="sheet mt-6 hidden md:block">
        <SkillsConstellation />
      </div>

      <Section id="by-group" title="By group" intro="Select a skill to see where I used it. Tools I know but haven’t tied to a project here are listed under each group.">
        <ToolsIndex />
      </Section>

      <Section id="certifications" title="Certifications">
        <div className="max-w-[44rem]">
          <Certifications />
        </div>
      </Section>
    </>
  );
}
