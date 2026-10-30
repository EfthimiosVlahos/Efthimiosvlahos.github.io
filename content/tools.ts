import type { ToolGroup } from "./types";

/**
 * Tools mapped to where they were actually used. A tool only gets `usedIn` entries when the
 * résumé or project records tie it to that work; everything else goes in `alsoFluent`.
 */
export const toolGroups: ToolGroup[] = [
  {
    name: "Agents and LLMs",
    tools: [
      { name: "Multi-agent orchestration", usedIn: ["pyxeon", "trader-hub", "hedge-fund-agents"] },
      { name: "LangGraph", usedIn: ["conedison", "trader-hub"] },
      { name: "Claude (Anthropic API)", usedIn: ["pyxeon", "trader-hub"] },
      { name: "Model Context Protocol", usedIn: ["trader-hub"] },
      { name: "Vision LLMs for documents", usedIn: ["alliant", "blueprint-takeoff"] },
      { name: "Structured outputs", usedIn: ["alliant", "pyxeon"] },
      { name: "Text-to-SQL", usedIn: ["conedison"] },
    ],
    alsoFluent: ["Claude Agent SDK", "OpenAI Agents SDK", "A2A", "prompt caching", "computer-use agents"],
  },
  {
    name: "Evaluation and safety",
    tools: [
      { name: "Hand-labeled answer keys", usedIn: ["alliant", "microsoft"] },
      { name: "Replay simulation", usedIn: ["alliant", "trader-hub"] },
      { name: "LLM judges", usedIn: ["conedison", "pyxeon"] },
      { name: "Guardrails and approval gates", usedIn: ["alliant", "pyxeon", "trader-hub"] },
      { name: "PII redaction", usedIn: ["alliant"] },
    ],
    alsoFluent: ["judge calibration", "online evals and A/B tests", "red-teaming", "model routing"],
  },
  {
    name: "Retrieval",
    tools: [
      { name: "Knowledge-grounded RAG", usedIn: ["microsoft"] },
      { name: "Sentence Transformers", usedIn: ["conedison"] },
      { name: "FAISS", usedIn: ["conedison"] },
    ],
    alsoFluent: ["hybrid BM25 and dense retrieval", "cross-encoder reranking", "GraphRAG", "pgvector", "Qdrant", "Chroma"],
  },
  {
    name: "Models and serving",
    tools: [
      { name: "vLLM self-hosting", usedIn: ["alliant"] },
      { name: "Qwen", usedIn: ["alliant"] },
      { name: "Azure OpenAI", usedIn: ["alliant"] },
      { name: "Phi fine-tuning", usedIn: ["microsoft"] },
      { name: "PyTorch and TensorFlow", usedIn: ["microsoft", "alzheimers-generative"] },
      { name: "XGBoost", usedIn: ["conedison"] },
      { name: "scikit-learn", usedIn: ["cornerstone"] },
    ],
    alsoFluent: ["LoRA and QLoRA", "DPO", "distillation", "4-bit quantization", "Hugging Face TRL", "LiteLLM", "KServe"],
  },
  {
    name: "MLOps and data",
    tools: [
      { name: "Databricks", usedIn: ["conedison", "cornerstone"] },
      { name: "MLflow", usedIn: ["conedison", "cornerstone"] },
      { name: "Spark", usedIn: ["conedison", "cornerstone"] },
      { name: "Kubeflow and KServe", usedIn: ["conedison"] },
      { name: "Airflow", usedIn: ["cornerstone"] },
      { name: "Docker", usedIn: ["alliant", "pyxeon", "conedison", "cornerstone", "trader-hub"] },
      { name: "Kubernetes", usedIn: ["pyxeon", "conedison", "cornerstone"] },
      { name: "Terraform", usedIn: ["conedison"] },
      { name: "Prometheus and Grafana", usedIn: ["conedison"] },
    ],
    alsoFluent: ["LangSmith", "Langfuse", "Arize Phoenix", "OpenTelemetry", "AWS SageMaker", "GCP Vertex AI"],
  },
  {
    name: "Software",
    tools: [
      { name: "Python and FastAPI", usedIn: ["alliant", "trader-hub", "desksergeant"] },
      { name: "TypeScript, React and Next.js", usedIn: ["alliant", "trader-hub", "desksergeant"] },
      { name: "PostgreSQL", usedIn: ["alliant", "pyxeon", "desksergeant"] },
      { name: "Redis job queues", usedIn: ["alliant", "pyxeon"] },
      { name: "Salesforce integration", usedIn: ["alliant"] },
      { name: "C# and .NET", usedIn: ["alliant"] },
      { name: "Stripe billing", usedIn: ["pyxeon"] },
      { name: "Power BI", usedIn: ["cornerstone"] },
    ],
    alsoFluent: ["SQL", "Bash", "R", "SQLAlchemy", "Clerk and JWT auth", "HMAC-signed webhooks", "pytest"],
  },
];
