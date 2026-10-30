import type { Build, CaseSlug, CaseStudyMeta } from "./types";

/** Listing order on the home page. */
export const caseStudies: CaseStudyMeta[] = [
  {
    slug: "pyxeon",
    name: "Pyxeon",
    title: "An engineering department that runs on agents",
    summary:
      "Co-founded a company that sells small businesses an AI engineering department. Agents plan, build, test and ship each change; the customer approves every plan and a separate reviewer model checks the result.",
    org: "Pyxeon",
    role: "Co-founder and AI Platform Lead",
    period: "2026 – present",
    stack: ["Claude Sonnet 5", "Claude Opus 5", "Supabase", "Redis", "Docker", "Kubernetes", "Stripe", "Clerk", "Caddy"],
    highlights: ["2 paying customers", "< 24 h approved plan to production", "< $10 agent cost per change"],
    principles: [5, 8, 9],
    featured: true,
    evidence: ["pyxeon"],
  },
  {
    slug: "insurance-document-ai",
    name: "Insurance document AI",
    title: "Document AI a compliance team could trust",
    summary:
      "Took an early-stage document pipeline to a self-hosted production system that reviews 97% of the renters-insurance policies a program receives, and tested each change against the cases humans had rejected.",
    org: "Alliant Insurance Services",
    role: "Senior Machine Learning Engineer",
    period: "2026",
    stack: ["Qwen3.5 MoE", "vLLM", "GPT-5.1", "FastAPI", "PostgreSQL", "Redis", "Celery", "Salesforce", "Docker", "NVIDIA DGX"],
    highlights: ["40% approved with no human touch", "0.10% of AI approvals overturned", "$0.0085 per policy"],
    principles: [2, 4, 5, 9, 10],
    featured: true,
    evidence: ["alliant"],
  },
  {
    slug: "energy-utility",
    name: "Utility agents and ML",
    title: "Agents and classic ML for a utility’s analysts",
    summary:
      "A text-to-SQL agent that 100+ analysts adopted, entity resolution across 20+ systems, and the propensity models and MLOps platform underneath.",
    org: "Con Edison",
    role: "Machine Learning Engineer",
    period: "2025 – 2026",
    stack: ["LangGraph", "Sentence Transformers", "FAISS", "Databricks", "MLflow", "XGBoost", "Kubeflow", "KServe", "Terraform", "Azure"],
    highlights: ["100+ analysts", "+35% match F1", "$2M+ program revenue"],
    principles: [],
    featured: true,
    evidence: ["conedison"],
  },
  {
    slug: "trader-hub",
    name: "Trader Hub",
    title: "A trading agent that has to earn live access",
    summary:
      "A six-agent strategy council debates every trade, and live trading stays locked in code until paper results clear a graduation gate.",
    org: "Personal project",
    role: "Sole engineer",
    period: "2026",
    stack: ["LangGraph", "Claude", "FastAPI", "Next.js", "Alpaca API", "vectorbt", "MCP", "Docker"],
    highlights: ["6-agent council", "Live trading gated on evidence", "Lookahead-safe backtests"],
    principles: [3, 5, 8],
    featured: false,
    evidence: ["trader-hub"],
  },
];

export const builds: Build[] = [
  {
    id: "blueprint-takeoff",
    name: "Blueprint Takeoff",
    description:
      "Reads an electrical drawing’s legend, counts every symbol across multi-page PDFs and produces a material takeoff in under a minute.",
    stack: ["Vision LLM", "Python", "Docker"],
  },
  {
    id: "desksergeant",
    name: "DeskSergeant",
    description:
      "Independent consulting: a multi-tenant fraud and AI-security platform with an iOS app, with every significant design choice recorded in an architecture decision record (182 so far).",
    stack: ["FastAPI", "Next.js 16", "Neon Postgres", "iOS"],
  },
  {
    id: "hedge-fund-agents",
    name: "Hedge-fund agents",
    description:
      "Open-source proof of concept where fundamentals, technicals, sentiment and risk agents debate trading decisions. Trader Hub’s ancestor.",
    stack: ["Python", "LangGraph", "LLM agents"],
    href: "https://github.com/EfthimiosVlahos/Hedge_Fund_Agents",
    linkLabel: "Source on GitHub",
  },
  {
    id: "alzheimers-generative",
    name: "Generative models for Alzheimer’s drug discovery",
    description:
      "LSTM and GRU networks trained on ChEMBL compounds to generate candidate BACE-1 inhibitors.",
    stack: ["TensorFlow", "Keras", "Cheminformatics"],
    href: "https://github.com/EfthimiosVlahos/Alzheimers-Generative-DL-Project",
    linkLabel: "Source on GitHub",
  },
];

export function caseStudy(slug: CaseSlug): CaseStudyMeta {
  const found = caseStudies.find((c) => c.slug === slug);
  if (!found) throw new Error(`Unknown case study ${slug}`);
  return found;
}
