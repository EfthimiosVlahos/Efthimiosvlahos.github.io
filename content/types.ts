/** Every place a claim can point to: a role, a case study, or a smaller build. */
export type EvidenceId =
  | "alliant"
  | "pyxeon"
  | "conedison"
  | "cornerstone"
  | "microsoft"
  | "insurance-document-ai"
  | "energy-utility"
  | "trader-hub"
  | "blueprint-takeoff"
  | "desksergeant"
  | "hedge-fund-agents"
  | "alzheimers-generative";

export type CaseSlug = "pyxeon" | "insurance-document-ai" | "energy-utility" | "trader-hub";

export interface Result {
  /** The figure, set large. Keep it short: "40%", "< 24 h". */
  value: string;
  /** What the figure means, in one plain sentence. */
  result: string;
  /** Where it happened. */
  where: string;
  /** How it was measured. Omit rather than guess when the source doesn't say. */
  note?: string;
  href?: `/projects/${CaseSlug}`;
}

export interface Role {
  id: Extract<EvidenceId, "alliant" | "pyxeon" | "conedison" | "cornerstone" | "microsoft">;
  title: string;
  org: string;
  orgUrl?: string;
  location: string;
  /** ISO year-month. */
  start: string;
  /** ISO year-month, or null while current. */
  end: string | null;
  summary: string;
  bullets: string[];
  caseStudy?: CaseSlug;
}

export interface CaseStudyMeta {
  slug: CaseSlug;
  /** Short name for compact listings. */
  name: string;
  title: string;
  /** One sentence for listings and meta descriptions. */
  summary: string;
  org: string;
  role: string;
  period: string;
  stack: string[];
  /** Two or three figures shown in the work list. */
  highlights: string[];
  /** Principle numbers this case study demonstrates; empty when the write-up doesn't show any. */
  principles: number[];
  /** Featured as a card; otherwise listed under "More builds" with a link to the write-up. */
  featured: boolean;
  evidence: EvidenceId[];
}

export interface Build {
  id: EvidenceId;
  name: string;
  description: string;
  stack: string[];
  href?: string;
  /** Visible label for the link, e.g. "Source on GitHub". */
  linkLabel?: string;
}

export interface Principle {
  n: number;
  title: string;
  body: string;
}

export interface Tool {
  name: string;
  usedIn: EvidenceId[];
}

export interface ToolGroup {
  name: string;
  tools: Tool[];
  /** Tools on the résumé without a specific project to point to. */
  alsoFluent?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  href?: string;
}

export interface Education {
  school: string;
  degree: string;
  year: string;
}
