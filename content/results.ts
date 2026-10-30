import type { Result } from "./types";

/**
 * Headline results for the home page, interleaved across roles so no single employer dominates.
 * Insurance figures come from dated project records (CIO report window, ground-truth runs);
 * the rest come from the résumé. Notes only say what the source actually supports.
 */
export const results: Result[] = [
  {
    value: "< 24 h",
    result: "median from a customer approving a plan to the change running in production, at under $10 of agent cost",
    where: "Autonomous coding pipeline, Pyxeon, 2026",
    href: "/projects/pyxeon",
  },
  {
    value: "100+",
    result: "analysts using a text-to-SQL agent, with ad-hoc reporting time down 40%",
    where: "LangGraph agent, Con Edison, 2025",
    href: "/projects/energy-utility",
  },
  {
    value: "93.9%",
    result: "field accuracy from a self-hosted open model, against 91.5% for the GPT-5.1 pipeline it replaced",
    where: "vLLM on NVIDIA A100s, Alliant, 2026",
    note: "39 hand-labeled documents scored field by field. Before comparing, I fixed a scorer bug that had overstated the incumbent at 93.8%.",
    href: "/projects/insurance-document-ai",
  },
  {
    value: "−30%",
    result: "hallucination rate in an enterprise LLM chatbot, with user satisfaction up 25%",
    where: "Data quality and anomaly detection, Microsoft, 2020–2024",
  },
  {
    value: "40%",
    result: "of insurance-policy reviews approved with no human touch, with 0.10% later reversed by reviewers",
    where: "Hybrid LLM and rules validator, Alliant, 2026",
    note: "Seven-week window, about 65,000 submissions. I traced every “approved then rejected” case by hand; most were reviewers acting before the AI answered. Cost $0.0085 per policy.",
    href: "/projects/insurance-document-ai",
  },
  {
    value: "+35%",
    result: "F1 matching customer records across more than 20 source systems",
    where: "Embeddings, FAISS and an LLM judge, Con Edison, 2025",
    note: "Measured against the rules-based matcher it replaced.",
    href: "/projects/energy-utility",
  },
  {
    value: "2 min",
    result: "automatic recovery for a failure that once caused a two-day silent outage",
    where: "Watchdog for a shared 8×A100 platform, Alliant, 2026",
    note: "The model server stayed “healthy” while generation hung. The watchdog probes real inference instead of the health endpoint.",
    href: "/projects/insurance-document-ai",
  },
  {
    value: "+20%",
    result: "conversion from real-time quote-to-close predictions served to sales leadership",
    where: "Flask on Kubernetes, Cornerstone Building Brands, 2024–2025",
  },
  {
    value: "$3.5M",
    result: "incremental revenue from a recommendation system across 10,000+ products",
    where: "Databricks and MLflow, Cornerstone Building Brands, 2024–2025",
  },
];
