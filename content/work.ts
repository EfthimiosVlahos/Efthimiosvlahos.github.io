import type { Build, CaseSlug, CaseStudyMeta } from "./types";

/** Listing order on the home page. */
export const caseStudies: CaseStudyMeta[] = [
  {
    slug: "pyxeon",
    title: "An engineering department that runs on agents",
    summary:
      "Co-founded a company that sells small businesses an AI department. Agents plan, build, test and ship each change; the customer approves every plan and an independent verifier checks the result.",
    org: "Pyxeon",
    role: "Co-founder and AI Platform Lead",
    period: "2026 – present",
    stack: ["Claude Sonnet 5", "Claude Opus 5", "Supabase", "Redis", "Docker", "Kubernetes", "Stripe", "Clerk", "Caddy"],
    highlights: ["< 24 h approved plan to production", "< $10 agent cost per change", "99.9% monitored uptime"],
    principles: [5, 8, 9],
    evidence: ["pyxeon"],
  },
  {
    slug: "insurance-document-ai",
    title: "Document AI a compliance team could trust",
    summary:
      "Took an inherited, half-finished document pipeline to a self-hosted production system that reviews every renters-insurance policy a program receives, and proved each change against the cases humans had rejected.",
    org: "Alliant Insurance Services",
    role: "Senior Machine Learning Engineer",
    period: "2026",
    stack: ["Qwen3.5 MoE", "vLLM", "GPT-5.1", "FastAPI", "PostgreSQL", "Redis", "Celery", "Salesforce", "Docker", "NVIDIA DGX"],
    highlights: ["40% fully automated", "0.10% true reversals", "$0.0085 per policy"],
    principles: [2, 4, 5, 9, 10],
    evidence: ["alliant"],
  },
  {
    slug: "energy-utility",
    title: "Agents and classic ML for a utility’s analysts",
    summary:
      "A text-to-SQL agent that 100+ analysts adopted, entity resolution across 20+ systems, and the propensity models and MLOps platform underneath.",
    org: "Con Edison",
    role: "Machine Learning Engineer",
    period: "2025 – 2026",
    stack: ["LangGraph", "Sentence Transformers", "FAISS", "Databricks", "MLflow", "XGBoost", "Kubeflow", "KServe", "Terraform", "Azure"],
    highlights: ["100+ analysts", "+35% match F1", "$2M+ program revenue"],
    principles: [1, 3],
    evidence: ["conedison"],
  },
  {
    slug: "trader-hub",
    title: "A trading agent that has to earn live access",
    summary:
      "A six-agent strategy council debates every trade, and live trading stays physically locked until paper results clear a graduation gate.",
    org: "Personal project",
    role: "Sole engineer",
    period: "2026",
    stack: ["LangGraph", "Claude", "FastAPI", "Next.js", "Alpaca API", "vectorbt", "MCP", "Docker"],
    highlights: ["6-agent council", "Sharpe ≥ 1 gate", "323 tests"],
    principles: [3, 5, 8],
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
      "Independent consulting: a multi-tenant fraud and AI-security platform with an iOS app, 1,287 backend tests and 182 architecture decision records.",
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
