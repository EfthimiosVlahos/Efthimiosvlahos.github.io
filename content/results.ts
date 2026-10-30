import type { Result } from "./types";

/**
 * Six headline results for the home page, strongest first and interleaved across roles.
 * Insurance figures come from dated project records (the seven-week report window, ground-truth runs);
 * the rest come from the résumé. Notes only say what the source actually supports.
 * Smaller results (Microsoft, Cornerstone) live in the Experience bullets.
 */
export const results: Result[] = [
  {
    value: "40%",
    result: "of insurance policies approved with no human touch; 0.10% of AI approvals were later overturned by a reviewer",
    where: "LLM plus rules validator, Alliant, 2026",
    note: "Seven-week window, about 65,000 policies, at $0.0085 per policy. I traced every overturned approval by hand; most were reviewers acting before the AI answered.",
    href: "/projects/insurance-document-ai",
  },
  {
    value: "< 24 h",
    result: "median from a customer approving a plan to the change running in production, at under $10 of agent cost",
    where: "Autonomous coding pipeline, Pyxeon, 2026",
    href: "/projects/pyxeon",
  },
  {
    value: "100+",
    result: "analysts adopted a text-to-SQL agent; ad-hoc reporting time fell 40%",
    where: "LangGraph agent, Con Edison, 2025–2026",
    href: "/projects/energy-utility",
  },
  {
    value: "$0",
    result: "per-document extraction cost after replacing GPT-5.1 with a self-hosted open model, at on-par accuracy",
    where: "vLLM on NVIDIA A100s, Alliant, 2026",
    note: "93.9% vs 91.5% field accuracy on 39 hand-labeled documents. Before comparing, I fixed a scorer bug that had inflated the incumbent’s score.",
    href: "/projects/insurance-document-ai",
  },
  {
    value: "+35%",
    result: "match F1 when resolving customer records across 20+ source systems",
    where: "Embeddings, FAISS and an LLM judge, Con Edison, 2025–2026",
    note: "Compared with the rules-based matcher it replaced.",
    href: "/projects/energy-utility",
  },
  {
    value: "2 min",
    result: "automatic recovery for a failure mode that once went unnoticed for two days",
    where: "Watchdog for a shared 8×A100 platform, Alliant, 2026",
    note: "The model server answered health checks while generation hung. The watchdog probes real inference instead.",
    href: "/projects/insurance-document-ai",
  },
];
