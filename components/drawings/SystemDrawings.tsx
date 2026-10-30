import { Arrow, Box, Dim, Drawing, Note } from "./kit";

const W = 160;
const H = 62;

/** Insurance document AI: from a resident's upload to the CRM's decision, with the watchdog on the side. */
export function DocPipelineDrawing() {
  const X = [20, 200, 380, 560, 740] as const;
  const Y1 = 40;
  const Y2 = 236;
  const mid = Y1 + H / 2;
  return (
    <Drawing
      viewBox="0 0 920 380"
      minWidth={760}
      title="Insurance document AI architecture"
      animate
      caption="Dashed boxes are systems I integrated with rather than built. Everything runs on an on-prem NVIDIA DGX shared with other teams."
    >
      <Box x={X[0]} y={Y1} w={W} h={H} label="Policy upload" sub="resident portal" quiet i={0} />
      <Arrow points={[[X[0] + W, mid], [X[1], mid]]} i={1} />
      <Box x={X[1]} y={Y1} w={W} h={H} label="CRM event" sub="one per upload" quiet i={1} />
      <Arrow points={[[X[1] + W, mid], [X[2], mid]]} i={2} />
      <Box x={X[2]} y={Y1} w={W} h={H} label="Connector" sub="listener, queue, worker" i={2} />
      <Arrow points={[[X[2] + W, mid], [X[3], mid]]} i={3} />
      <Box x={X[3]} y={Y1} w={W} h={H} label="Extraction" sub="per-page vision LLM" i={3} />
      <Arrow points={[[X[3] + W, mid], [X[4], mid]]} i={4} />
      <Box x={X[4]} y={Y1} w={W} h={H} label="Validator" sub="LLM opinion + rules" i={4} />

      <Arrow points={[[X[3] + W / 2, Y2], [X[3] + W / 2, Y1 + H]]} i={5} />
      <Box x={X[3]} y={Y2} w={W} h={H} label="Qwen3.5 on vLLM" sub="2× A100, on-prem" i={5} />
      <Note x={X[3] + W / 2 + 10} y={Y1 + H + 44} lines={["median 26 s per document"]} i={5} />

      <Arrow points={[[X[2] + W, Y2 + H / 2], [X[3], Y2 + H / 2]]} i={6} red />
      <Box x={X[2]} y={Y2} w={W} h={H} label="Watchdog" sub="restart, alert" i={6} />
      <Note x={X[2] + 4} y={Y2 + H + 22} lines={["probes real generation, not /health"]} red i={6} size={12.5} />

      <Arrow points={[[X[4] + W / 2, Y1 + H], [X[4] + W / 2, Y2]]} i={7} />
      <Box x={X[4]} y={Y2} w={W} h={H} label="CRM decision" sub="approve or review" quiet i={7} />
      <Note x={X[4] + W / 2 + 10} y={Y1 + H + 44} lines={["hard-fail caps", "critical misses"]} i={7} />

      <Note x={X[0]} y={Y2 + 18} lines={["GPT-5.1 kept as a", "one-command rollback"]} i={8} />
      <Dim x1={X[2]} x2={X[4] + W} y={350} label="what I built and operate" i={9} />
    </Drawing>
  );
}

/** Pyxeon: plan, approve, implement, verify, ship, with a self-healing loop. */
export function PyxeonDrawing() {
  const X = [20, 250, 480, 710] as const;
  const w = 190;
  const Y1 = 40;
  const Y2 = 250;
  const m1 = Y1 + H / 2;
  const m2 = Y2 + H / 2;
  return (
    <Drawing
      viewBox="0 0 920 420"
      minWidth={760}
      title="Pyxeon autonomous coding pipeline"
      animate
      caption="Dashed boxes are people. The customer approves the plan before any code is written, and a second model reviews the result against that plan before it ships."
    >
      <Box x={X[0]} y={Y1} w={w} h={H} label="Customer request" sub="tier-prioritized queue" quiet i={0} size={16} />
      <Arrow points={[[X[0] + w, m1], [X[1], m1]]} i={1} />
      <Box x={X[1]} y={Y1} w={w} h={H} label="Planner" sub="Claude Sonnet 5" i={1} size={16} />
      <Arrow points={[[X[1] + w, m1], [X[2], m1]]} i={2} />
      <Box x={X[2]} y={Y1} w={w} h={H} label="Customer approves" sub="plan and estimate" quiet i={2} size={16} />
      <Arrow points={[[X[2] + w, m1], [X[3], m1]]} i={3} />
      <Box x={X[3]} y={Y1} w={w} h={H} label="Implementer agent" sub="isolated container" i={3} size={16} />

      <Note x={X[1]} y={Y1 + H + 24} lines={["structured plan and", "effort estimate in minutes"]} i={1} />
      <Note x={X[3]} y={Y1 + H + 24} lines={["clones, implements, runs", "tests, opens a pull request"]} i={3} />

      <Arrow points={[[X[3] + w / 2, Y1 + H + 62], [X[3] + w / 2, Y2]]} i={4} />
      <Box x={X[3]} y={Y2} w={w} h={H} label="Independent verifier" sub="Claude Opus 5" i={4} size={16} />
      <Arrow points={[[X[3], m2], [X[2] + w, m2]]} i={5} />
      <Box x={X[2]} y={Y2} w={w} h={H} label="Evidence bundle" sub="summary, screenshots, checks" i={5} size={16} />
      <Arrow points={[[X[2], m2], [X[1] + w, m2]]} i={6} />
      <Box x={X[1]} y={Y2} w={w} h={H} label="Deploy" sub="one-click rollback" i={6} size={16} />
      <Arrow points={[[X[1], m2], [X[0] + w, m2]]} i={7} />
      <Box x={X[0]} y={Y2} w={w} h={H} label="Uptime checks" sub="every 5 minutes" i={7} size={16} />

      <Note x={X[3]} y={Y2 + H + 24} lines={["reviews the diff against", "the approved plan"]} i={4} />
      <Arrow points={[[X[0] + w / 2, Y2], [X[0] + w / 2, Y1 + H]]} i={8} red />
      <Note x={X[0] + w / 2 + 10} y={(Y1 + H + Y2) / 2 - 4} lines={["down 15 min:", "opens a fix request", "through the same path"]} red i={8} size={12.5} />
      <Dim x1={X[1]} x2={X[3] + w} y={Y2 + H + 70} label="approval to production: median under 24 h" i={9} />
    </Drawing>
  );
}

/** Con Edison: the text-to-SQL agent's graph. */
export function TextToSqlDrawing() {
  const X = [20, 200, 380, 560, 740] as const;
  const Y = 50;
  const m = Y + H / 2;
  const labels: [string, string][] = [
    ["Question", "plain English"],
    ["Route to tables", "embedding similarity"],
    ["Write SQL", "LLM generation"],
    ["Run query", "execution"],
    ["Report", "generated automatically"],
  ];
  return (
    <Drawing viewBox="0 0 920 230" minWidth={760} title="Text-to-SQL agent graph" animate caption="A LangGraph state machine. Routing first keeps the prompt to the few tables that matter instead of the whole schema.">
      {labels.map(([label, sub], k) => (
        <g key={label}>
          <Box x={X[k] as number} y={Y} w={W} h={H} label={label} sub={sub} quiet={k === 0} i={k * 2} />
          {k < labels.length - 1 && <Arrow points={[[(X[k] as number) + W, m], [X[k + 1] as number, m]]} i={k * 2 + 1} />}
        </g>
      ))}
      <Note x={X[1]} y={Y + H + 26} lines={["query embeddings pick", "the relevant tables"]} i={2} />
      <Note x={X[4]} y={Y + H + 26} lines={["100+ analysts,", "reporting time down 40%"]} i={8} />
    </Drawing>
  );
}

/** Con Edison: three-stage entity resolution. */
export function EntityResolutionDrawing() {
  const X = [20, 250, 480, 710] as const;
  const w = 190;
  const Y = 50;
  const m = Y + H / 2;
  const stages: [string, string][] = [
    ["Name variants", "20+ source systems"],
    ["Embeddings", "fine-tuned Sentence Transformers"],
    ["Candidate clusters", "FAISS nearest neighbors"],
    ["LLM judge", "few-shot, final call"],
  ];
  return (
    <Drawing viewBox="0 0 920 230" minWidth={760} title="Hybrid entity resolution" animate caption="Cheap, recall-oriented stages narrow the field; the expensive LLM judgment only runs on close candidates.">
      {stages.map(([label, sub], k) => (
        <g key={label}>
          <Box x={X[k] as number} y={Y} w={w} h={H} label={label} sub={sub} quiet={k === 0} i={k * 2} />
          {k < stages.length - 1 && <Arrow points={[[(X[k] as number) + w, m], [X[k + 1] as number, m]]} i={k * 2 + 1} />}
        </g>
      ))}
      <Dim x1={X[1]} x2={X[2] + w} y={Y + H + 40} label="fast and cheap: recall" i={7} />
      <Note x={X[3]} y={Y + H + 30} lines={["F1 up 35% over the", "rules-based matcher"]} i={6} />
    </Drawing>
  );
}

/** Trader Hub: the strategy council's debate order and the gate before live trading. */
export function CouncilDrawing() {
  const agents = ["Research", "Bull", "Bear", "Quant", "Risk", "Chief"];
  const w = 120;
  const gap = 22;
  const Y = 50;
  const m = Y + H / 2;
  return (
    <Drawing viewBox="0 0 920 250" minWidth={760} title="Trader Hub strategy council" animate caption="The council debates every trade in this order. The Chief decides, and every decision ships with a receipt holding the full transcript.">
      {agents.map((a, k) => {
        const x = 20 + k * (w + gap);
        return (
          <g key={a}>
            <Box x={x} y={Y} w={w} h={H} label={a} n={k + 1} i={k * 2} />
            {k < agents.length - 1 && <Arrow points={[[x + w, m], [x + w + gap, m]]} i={k * 2 + 1} />}
          </g>
        );
      })}
      <Arrow points={[[20 + 5 * (w + gap) + w / 2, Y + H], [20 + 5 * (w + gap) + w / 2, Y + H + 60]]} i={11} />
      <Box x={20 + 5 * (w + gap) - 30} y={Y + H + 60} w={w + 60} h={50} label="Trade receipt" sub="full transcript" i={12} size={16} />
      <Note x={20} y={Y + H + 40} lines={["Bull and Bear argue opposite sides before Quant and Risk weigh in;", "autonomous scans run on a schedule with a daily budget and cooldowns."]} i={12} />
    </Drawing>
  );
}
