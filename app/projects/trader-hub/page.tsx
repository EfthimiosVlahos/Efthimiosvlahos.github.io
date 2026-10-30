import { CaseLayout, Chapter, Outcomes, caseMetadata } from "@/components/CaseStudy";
import { Cite } from "@/components/Principles";
import { CouncilDrawing } from "@/components/drawings/SystemDrawings";
import { GraduationGate } from "@/components/lab/GraduationGate";
import { caseStudy } from "@/content/work";

export const metadata = caseMetadata("trader-hub");

export default function TraderHub() {
  const meta = caseStudy("trader-hub");
  return (
    <CaseLayout meta={meta}>
      <Chapter id="idea" title="The idea">
        <p>
          Trader Hub is an options and equities trading platform built on Alpaca’s API. It’s a good testbed for a
          question that matters well beyond trading: what does it take before you let an agent act on its own with real
          consequences?
        </p>
        <p>
          My answer is that autonomy has to be earned with evidence, and the system should make the unsafe path
          physically unavailable rather than merely discouraged.
        </p>
      </Chapter>

      <Chapter id="council" title="A council, not a single model">
        <p>
          Every trade is debated by six specialist agents in a LangGraph flow. A research agent gathers context, a bull
          and a bear argue opposite cases, a quant and a risk agent weigh in, and a chief decides. Each decision ships
          with a trade receipt containing the full transcript, so any position can be explained after the fact.
        </p>
        <CouncilDrawing />
        <p>
          In autonomous mode, the system scans the market on a schedule, scores candidates and runs the council, inside
          guardrails for scan interval, daily budget, cooldown and candidate count.
        </p>
      </Chapter>

      <Chapter id="gate" title="Live access has to be earned">
        <p>
          Paper trading is the default. Live trading stays locked until paper results clear a graduation gate: a Sharpe
          ratio of at least 1, a maximum drawdown of 15% or less, at least 30 trades and at least 90 days. A kill switch
          flattens every position and pauses the agent (<Cite n={4} />).
        </p>
        <GraduationGate />
      </Chapter>

      <Chapter id="evaluation" title="Evaluation without fooling myself">
        <p>
          A strategy lab replays the council against historical data with lookahead protection, so a backtest can’t
          quietly use information it wouldn’t have had (<Cite n={2} />). Results are plotted against buy-and-hold as the
          benchmark.
        </p>
        <p>
          The platform also ships an MCP server, so Claude Desktop can query positions, run the council and read the
          agent’s reflections directly.
        </p>
      </Chapter>

      <Chapter id="results" title="What it includes">
        <Outcomes
          rows={[
            { label: "Specialist agents in the council", value: "6" },
            { label: "Graduation gate", value: "Sharpe ≥ 1, drawdown ≤ 15%" },
            { label: "Minimum paper record", value: "30 trades, 90 days" },
            { label: "Backend tests", value: "323" },
            { label: "Stack", value: "FastAPI, Next.js, LangGraph" },
          ]}
        />
        <p className="mt-6 text-sm text-soft">A personal research project. Not financial advice.</p>
      </Chapter>
    </CaseLayout>
  );
}
