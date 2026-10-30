import { CaseLayout, Chapter, Outcomes, caseMetadata } from "@/components/CaseStudy";
import { Sidenote } from "@/components/Sidenote";
import { Cite } from "@/components/Principles";
import { DocPipelineDrawing } from "@/components/drawings/SystemDrawings";
import { BakeoffChart, RecoveryChart, ReviewRoundsChart, WaterfallChart } from "@/components/charts/InsuranceCharts";
import { HardFailExplainer } from "@/components/lab/HardFailExplainer";
import { SimulateLab } from "@/components/lab/SimulateLab";
import { caseStudy } from "@/content/work";

export const metadata = caseMetadata("insurance-document-ai");

export default function InsuranceDocumentAI() {
  const meta = caseStudy("insurance-document-ai");
  return (
    <CaseLayout meta={meta}>
      <section aria-labelledby="tldr-h" className="mt-12">
        <div className="card max-w-[44rem] border-blue/30 p-6">
          <h2 id="tldr-h" className="text-lg">
            In short
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-blue">
            <li>Took over an early-stage document pipeline with a two-week deadline to bring it back up on-prem, and met it.</li>
            <li>
              Over a seven-week window, 40% of about 65,000 policies were approved with no human touch, and 0.10% of AI
              approvals were later overturned by a reviewer.
            </li>
            <li>
              When a business report said 28% auto-approval and my tests said 60%, I traced it through CRM data, retracted
              my first theory in writing, and fixed the report.
            </li>
            <li>Also: a two-week build-vs-buy delivery for the CIO, and discovery work on what to automate next.</li>
          </ul>
        </div>
      </section>

      <Chapter id="problem" title="The problem">
        <p>
          A renters-insurance compliance program requires every apartment resident to prove coverage: a current policy,
          the right names and unit, enough liability, and the program’s servicer listed as an additional interest at the
          right PO box. Residents upload PDFs, well over a thousand a day, and a review team checked every one by hand at
          10 to 15 minutes each.
        </p>
        <p>
          The goal was to read every document automatically, compare it with what the CRM knows about the resident and
          the lease, and let the clean ones approve themselves. Anything doubtful goes to a person.
        </p>
      </Chapter>

      <Chapter id="start" title="Where it started">
        <p>
          An early-stage codebase spread across three repositories, the most complete version of the API living only on
          the GPU server, and a two-week deadline to bring the pipeline back up on-prem. I documented the system before
          changing it, merged an improved extraction layer, and met the deadline.
        </p>
        <DocPipelineDrawing />
      </Chapter>

      <Chapter id="answer-key" title="An answer key before the model swap">
        <p>
          Extraction ran on GPT-5.1 through Azure. The company had a server with eight A100 GPUs and wanted on-prem
          inference with no per-document cost and no data leaving the building. The question was whether an open model
          could match the API.
        </p>
        <p>
          I hand-labeled 39 real documents and wrote a field-by-field scorer before running anything (<Cite n={2} />).
          The first surprise was in the scorer, not the models: it skipped ten non-standard documents and missed fields
          stored under coverages, which had inflated GPT-5.1 to 93.8%.
          <Sidenote n={1}>Fixing the scorer before comparing models is the point of an answer key: test the ruler first.</Sidenote>{" "}
          Rescored, it was 91.5%.
        </p>
        <BakeoffChart />
        <p>
          Qwen3.5-35B-A3B, a mixture-of-experts model with about 3B active parameters, scored 93.9%. On 39 documents a
          2.4-point gap is within noise; the win was matching the API with no per-document cost and no data leaving the
          building. FP8 quantization failed on a kernel incompatibility, so it runs in BF16 across two GPUs, shipped
          behind a provider toggle with the Azure container kept as a one-command rollback.
          <Sidenote n={2}>Day two in production: multi-page documents overflowed a 16K context window. Moving to 32K cleared it; the next 200 of 200 documents completed.</Sidenote>{" "}
          A later bake-off found a configuration that fits on a single A100.
        </p>
      </Chapter>

      <Chapter id="decision" title="A decision layer that can’t talk itself into approval">
        <p>
          The validator compares the extraction with the CRM record and produces eight yes-or-no checks. One LLM call
          gives a first opinion; deterministic rules then correct it, because model judgment is non-deterministic and
          sometimes wrong. After the overrides, the summary and rationale are rebuilt from the final answers, so the
          text can never contradict the decision.
        </p>
        <p>
          The subtle bug was arithmetic. With eight checks and an 85% bar, one failure is 87.5%, so a missing liability
          limit would still auto-approve. I added a hard-fail flag that caps any critical miss at manual review.
        </p>
        <HardFailExplainer />
      </Chapter>

      <Chapter id="simulate" title="Simulate before you ship">
        <p>
          Reviewers wanted fewer false manual reviews. Every relaxation risks approving a bad policy, so no rule ships
          until it has been replayed on stored cases, including every case a reviewer rejected (<Cite n={4} />). Rules
          that can only send work to a person ship more freely than rules that approve (<Cite n={5} />).
        </p>
        <div className="bleed my-8">
          <SimulateLab />
        </div>
        <p>
          The same discipline caught my own mistake. A regression run showed a gate I had written was flagging 18 of 19
          good policies, because listing the property’s name rather than the servicer’s is the norm. It came out before
          it did lasting harm. Separately, fifteen data-validated unit-equivalence rules recovered 41% of unit-only false
          manual reviews.
        </p>
      </Chapter>

      <Chapter id="investigation" title="“Is auto-approval 28% or 60%?”">
        <p>
          The program’s report said about 28% of policies were auto-approving. My testing said about 60%. Trust in the
          whole project was at stake, so I traced it end to end with CRM data instead of arguing (<Cite n={10} />).
        </p>
        <ul>
          <li>Production code wasn’t stale: I checksum-audited every deployed artifact.</li>
          <li>
            The report was measuring a backlog sweep. Reviewers were hand-closing cases in bulk, including over 900 the AI
            had already approved, and the report counted those as “not auto”.
          </li>
          <li>
            About 20% of submissions never reached the system at all. A controlled log test found the gap, and the CRM
            team confirmed a deliberate upstream filter.
          </li>
          <li>I had proposed a different theory first. The data contradicted it, and I retracted it in writing.</li>
        </ul>
        <p>
          The report was fixed to use a field that can’t race, and my day-by-day table matched the live dashboard to the
          digit. Three validator fixes shipped the same day; the next clean weekday read 44%, the best on record.
        </p>
        <p className="text-sm text-soft">
          The percentages on this page, side by side: 28% and 60% were the two readings this investigation reconciled;
          44% was the best single weekday afterwards; 40% is the seven-week share approved with no human touch; 51% adds
          the cases a reviewer confirmed.
        </p>
      </Chapter>

      <Chapter id="alarming-number" title="Tracing an alarming number">
        <p>
          For the CIO’s accuracy report, the raw data said 0.75% of AI-approved cases were later rejected. That sounds
          alarming for an automated approver, so I traced all 248.
        </p>
        <WaterfallChart />
        <p>
          The report I delivered reconciled with the live CRM dashboard exactly on 22 of 22 days, and the automation
          inconsistency went to the CRM team to fix.
        </p>
      </Chapter>

      <Chapter id="operations" title="Keeping it running">
        <p>
          The hardest failure was a silent one. Nothing was processed for two days while every health check stayed
          green: the model server was alive and answering its health endpoint, but generation had hung, and the stuck
          jobs held database connections until the pool ran dry.
        </p>
        <p>
          I recovered it in the right order, added an idle-transaction timeout, and built a watchdog that probes real
          generation instead of trusting the health endpoint (<Cite n={9} />). Later versions learned to tell a busy
          server from a dead one, stop restart storms and throttle alerts. Other fixes followed the same pattern: find the
          actual mechanism, then make the failure recover itself.
        </p>
        <RecoveryChart />
        <p>
          When an OS patch silently swapped the GPU driver, I recovered the server under locked-down permissions and
          re-ran all 339 affected cases with zero errors.
        </p>
      </Chapter>

      <Chapter id="discovery" title="Discovery before building">
        <p>
          Once the pipeline was stable, the question became what to automate next. The product owner asked for the top
          five customer questions. I analyzed 100K+ customer-service cases three independent ways:
        </p>
        <ul>
          <li>
            An on-prem LLM sorted first emails into a fixed set of intents. It matched a hand audit on 49 of 50, and a queue
            guard kept production work first in line.
          </li>
          <li>Keyword rules ran over the full population as a cross-check.</li>
          <li>The answers agents actually sent showed which questions consumed the most time.</li>
        </ul>
        <p>
          The finding that mattered: more than half of residents’ emails were simply a policy attached for an agent to
          upload by hand, the biggest automation lever on the table. Along the way I corrected one of my own early claims,
          a “rising” trend that turned out to be seasonal, before it reached a decision.
        </p>
        <p>
          When leadership asked whether AI could spot fabricated insurance documents, I measured candidate signals on
          about 75,000 real documents before building anything. One carrier-specific pattern held on 99.5% of that
          carrier’s policies; a pattern I had assumed turned out to be wrong. The recommendation spelled out the limits:
          such checks can route crude fakes to a person with reasons, but a document alone can’t prove a forgery, so
          nothing was built yet.
        </p>
      </Chapter>

      <Chapter id="build-vs-buy" title="A build-vs-buy call, shipped in two weeks">
        <p>
          The CIO asked for an in-house alternative to a vendor product for commercial insurance submissions: the email
          packets of applications, property schedules and claims histories that arrive before a quote. Going from the ask
          to a written spec took a week; twelve releases followed over the next nine days.
        </p>
        <ul>
          <li>Email intake with deduplication, then document classification.</li>
          <li>Extraction where every field cites the page it came from. On commercial forms it got 99.3% of 560 fields right and invented none.</li>
          <li>An account profile that shows conflicting sources side by side instead of silently picking one.</li>
          <li>A requirements checklist defined as data rather than code.</li>
          <li>
            A loss-history summary where the model writes the prose but every number comes from code, and any figure it
            invents is refused (<Cite n={6} />).
          </li>
        </ul>
        <p>
          It shares a GPU server with the production review system, so I isolated it completely (its own database, model
          instance and ports) and ran a 31-minute load test during business hours: 78 submissions, 312 documents, zero
          failures, with the production system’s latency watched live and unaffected. Every build runs the full test
          suite inside the image, and a failed check rolls the release back automatically.
        </p>
      </Chapter>

      <Chapter id="also" title="Also built on the same platform">
        <p>
          <strong>Scanned mail.</strong> A pipeline that classifies scanned resident mail and extracts cancellation notices
          has processed tens of thousands of documents. I verified every failed row against the PDF, checked each new
          pattern against the whole corpus, and built a replay simulator that reproduced every delivered row byte for
          byte, so fixes were proven without a single model call.
        </p>
        <ReviewRoundsChart />
        <p>
          <strong>Loss runs.</strong> A bake-off suggested a bigger model read claims history better. Comparing raw
          per-page reads showed the production model read the money correctly and our own LLM correction pass was
          overwriting it. Removing that pass took field accuracy on the main layout from 90.2% to 99.8% and kept the job
          on one GPU.
        </p>
      </Chapter>

      <Chapter id="results" title="Results">
        <p>Seven-week window reported to the CIO:</p>
        <Outcomes
          rows={[
            { label: "Policies approved with no human touch", value: "40%" },
            { label: "Approved through the AI, including reviewer-confirmed", value: "51%" },
            { label: "AI approvals later overturned by a reviewer", value: "0.10%" },
            { label: "Flags that were right to flag", value: "73%" },
            { label: "Share of submissions the AI reviewed", value: "97%" },
            { label: "Cost per policy validated", value: "$0.0085", note: "Extraction itself runs on-prem at no per-document cost." },
            { label: "Reviewer time saved", value: "~870 hours", note: "Counted conservatively at 2 minutes a case; a full manual review takes 10 to 15." },
            { label: "Median time to close", value: "~1 min vs 15", note: "Auto-approved vs handled by a person." },
          ]}
        />
      </Chapter>
    </CaseLayout>
  );
}
