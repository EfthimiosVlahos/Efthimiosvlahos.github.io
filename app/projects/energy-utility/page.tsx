import { CaseLayout, Chapter, Outcomes, caseMetadata } from "@/components/CaseStudy";
import { EntityResolutionDrawing, TextToSqlDrawing } from "@/components/drawings/SystemDrawings";
import { caseStudy } from "@/content/work";

export const metadata = caseMetadata("energy-utility");

export default function EnergyUtility() {
  const meta = caseStudy("energy-utility");
  return (
    <CaseLayout meta={meta}>
      <Chapter id="text-to-sql" title="A text-to-SQL agent analysts actually used">
        <p>
          Non-technical stakeholders needed ad-hoc reports from data spread across many tables. I architected a LangGraph agent that takes a question in plain English, routes it to the right tables
          using query embeddings, writes and runs the SQL, and generates the report.
        </p>
        <TextToSqlDrawing />
        <p>
          Routing before generation matters: a model that sees a handful of relevant tables writes better SQL than one
          handed the entire schema. More than 100 analysts adopted it, and ad-hoc reporting time fell 40%.
        </p>
      </Chapter>

      <Chapter id="entity-resolution" title="Matching customers across 20+ systems">
        <p>
          The same customer appeared under many name variations across more than twenty source systems, and rules-based
          matching missed too many. I built a hybrid pipeline: fine-tuned Sentence Transformers embeddings, FAISS
          approximate-nearest-neighbor clustering to find candidates, and a few-shot LLM classifier as the contextual
          judge for the final match.
        </p>
        <EntityResolutionDrawing />
        <p>F1 rose 35% over the rules-based matcher.</p>
      </Chapter>

      <Chapter id="propensity" title="Propensity to enroll">
        <p>
          The energy-efficiency programs needed to know which customers were likely to enroll. I engineered the pipeline
          on Databricks: Delta Live Tables ingestion, PySpark and Feature Store features, MLflow experiments with a
          champion XGBoost model, Unity Catalog for the registry, and batch inference through Databricks Jobs. It reached
          85% precision and drove more than $2M in program revenue through targeted campaigns.
        </p>
      </Chapter>

      <Chapter id="mlops" title="The platform underneath">
        <p>
          I built the MLOps framework on Azure that standardized training,
          registry, deployment and observability: MLflow, Docker, Terraform, Kubernetes with Kubeflow Pipelines and
          KServe, Jenkins, and Prometheus with Grafana. Model onboarding time fell by half.
        </p>
      </Chapter>

      <Chapter id="results" title="Results">
        <Outcomes
          rows={[
            { label: "Analysts using the text-to-SQL agent", value: "100+" },
            { label: "Ad-hoc reporting time", value: "−40%" },
            { label: "Entity-resolution F1 vs rules", value: "+35%" },
            { label: "Propensity model precision", value: "85%" },
            { label: "Energy-efficiency program revenue", value: "$2M+" },
            { label: "Model onboarding time", value: "−50%" },
          ]}
        />
      </Chapter>
    </CaseLayout>
  );
}
