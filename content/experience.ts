import type { Certification, Education, Role } from "./types";

/** Newest first. Alliant bullets use dated project records, anonymized; the rest follow the résumé. */
export const roles: Role[] = [
  {
    id: "alliant",
    title: "Senior Machine Learning Engineer",
    org: "Alliant Insurance Services",
    location: "Manhattan, NY (hybrid)",
    start: "2026-02",
    end: null,
    summary: "Document AI and decision systems for insurance programs, on an on-prem NVIDIA DGX.",
    bullets: [
      "Moved production document extraction from GPT-5.1 to a self-hosted Qwen3.5 mixture-of-experts vision model on vLLM: higher field accuracy (93.9% vs 91.5%), no per-document cost, data kept on-prem, and the old provider one command away.",
      "Built a hybrid LLM and deterministic validator that approves about 40% of policy submissions with no human touch, at 0.10% true reviewer reversals and $0.0085 per policy, saving roughly 870 reviewer-hours in seven weeks.",
      "Owned reliability for a shared 8×A100 platform: a watchdog that probes real inference turned a two-day silent outage into two-minute automatic recoveries, and a nightly 36-minute freeze now takes 4 to 6 seconds.",
      "Designed and shipped a commercial submission-intake engine in two weeks (12 releases in 9 days, 1,700+ tests) as the in-house alternative to a vendor product, without disturbing the production system sharing its GPUs.",
    ],
    caseStudy: "insurance-document-ai",
  },
  {
    id: "pyxeon",
    title: "Co-founder and AI Platform Lead",
    org: "Pyxeon",
    orgUrl: "https://pyxeon.com",
    location: "Long Island, NY (side venture)",
    start: "2026-03",
    end: null,
    summary: "An AI engineering department for small businesses, sold as a subscription.",
    bullets: [
      "Architected the platform end to end: eight live services behind Caddy with automatic HTTPS, a separate Supabase database per customer, Clerk auth, and Stripe billing with per-tier request quotas.",
      "Built the autonomous coding pipeline: a planner returns a structured plan and estimate, an agent implements and tests the approved plan and opens a pull request, and an independent verifier reviews the diff against the plan. Every change ships with an evidence bundle and one-click rollback.",
      "Two paying customers and four customer apps in production; median under 24 hours from approved plan to deployed change, under $10 of agent cost per change, 99.9% monitored uptime.",
    ],
    caseStudy: "pyxeon",
  },
  {
    id: "conedison",
    title: "Machine Learning Engineer",
    org: "Con Edison",
    location: "Manhattan, NY (hybrid)",
    start: "2025-01",
    end: "2026-01",
    summary: "Agents, matching and propensity models for New York’s energy utility.",
    bullets: [
      "Architected a LangGraph text-to-SQL agent that routes each question to the right tables by embedding similarity, then writes, runs and reports the query. Adopted by 100+ analysts; ad-hoc reporting time down 40%.",
      "Engineered the propensity-to-enroll pipeline on Databricks (Delta Live Tables, Feature Store, MLflow, champion XGBoost, Unity Catalog): 85% precision, driving $2M+ in energy-efficiency program revenue.",
      "Built hybrid entity resolution for customer-name variations: fine-tuned Sentence Transformers, FAISS nearest-neighbor clustering, and a few-shot LLM judge for the final call. F1 up 35% over rules across 20+ source systems.",
      "Built the MLOps framework on Azure (MLflow, Docker, Terraform, Kubeflow Pipelines, KServe, Prometheus and Grafana), cutting model onboarding time 50%.",
    ],
    caseStudy: "energy-utility",
  },
  {
    id: "cornerstone",
    title: "Data Scientist (contract)",
    org: "Cornerstone Building Brands",
    location: "East Meadow, NY (remote)",
    start: "2024-05",
    end: "2025-03",
    summary: "Recommendations, pricing predictions and data pipelines for a building-products manufacturer.",
    bullets: [
      "Designed and productionized a recommendation system on Databricks across 10,000+ products for dealers and contractors, generating $3.5M in incremental revenue.",
      "Deployed a Flask service on Kubernetes serving real-time quote-to-close predictions, lifting conversion 20%.",
      "Built Databricks ETL from Azure Data Lake with Airflow and GitHub Actions, cutting runtime 35% and excess inventory costs 15%; Power BI dashboards used by 50+ executives and plant managers.",
    ],
  },
  {
    id: "microsoft",
    title: "Data Analyst (contract)",
    org: "Microsoft",
    location: "East Meadow, NY (remote)",
    start: "2020-10",
    end: "2024-05",
    summary: "Data quality and evaluation for an enterprise LLM chatbot.",
    bullets: [
      "Analyzed enterprise-scale data behind an LLM chatbot; anomaly detection and cleansing cut hallucination rates 30% and raised user satisfaction 25%.",
      "Fine-tuned a Phi small language model and built knowledge-grounded chatbot prototypes, evaluated on 5,000+ conversations; manual escalations fell 20% for key clients.",
    ],
  },
];

export const education: Education[] = [
  { school: "Stony Brook University", degree: "MS, Applied Mathematics and Statistics", year: "2023" },
  { school: "CUNY Hunter College", degree: "BS, Mathematics and Physics; minor in Computer Science", year: "2020" },
];

/** The résumé's four first; badges matter less than shipped work, so they stay compact. */
export const certifications: Certification[] = [
  { name: "Databricks Certified Data Engineer Associate", issuer: "Databricks", date: "May 2025" },
  {
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "Apr 2024",
    href: "https://www.credly.com/badges/349b050d-7fb8-4bb7-80c5-3e0fedeb135f/public_url",
  },
  { name: "Large Language Model Operations (LLMOps)", issuer: "Duke University, Coursera", date: "Jun 2024" },
  { name: "MLOps: Machine Learning Operations", issuer: "Duke University, Coursera", date: "May 2024" },
  { name: "PyTorch for Deep Learning", issuer: "DeepLearning.AI", date: "Nov 2025" },
  {
    name: "Deep Learning Specialization",
    issuer: "DeepLearning.AI",
    date: "2023",
    href: "https://www.credly.com/badges/c43b102b-bbac-4cf6-9a4c-94dececd73ea/public_url",
  },
  {
    name: "Natural Language Processing Specialization",
    issuer: "DeepLearning.AI, Coursera",
    date: "2023",
    href: "https://www.coursera.org/account/accomplishments/specialization/BBLNB4E7QTH5",
  },
  {
    name: "TensorFlow Developer Professional Certificate",
    issuer: "DeepLearning.AI, Coursera",
    date: "2023",
    href: "https://www.coursera.org/account/accomplishments/professional-cert/JD4U32WTLTVD",
  },
  {
    name: "Advanced Machine Learning on Google Cloud",
    issuer: "Google Cloud, Coursera",
    date: "2023",
    href: "https://www.coursera.org/account/accomplishments/specialization/J3UZ6U7NLDY6",
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatMonth(isoMonth: string): string {
  const [year, month] = isoMonth.split("-");
  const label = MONTHS[Number(month) - 1];
  if (!year || !label) throw new Error(`Bad ISO month: ${isoMonth}`);
  return `${label} ${year}`;
}

export function formatRange(start: string, end: string | null): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "present"}`;
}
