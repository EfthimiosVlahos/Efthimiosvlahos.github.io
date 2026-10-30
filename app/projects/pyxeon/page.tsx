import { CaseLayout, Chapter, Outcomes, caseMetadata } from "@/components/CaseStudy";
import { Cite } from "@/components/Principles";
import { PyxeonDrawing } from "@/components/drawings/SystemDrawings";
import { caseStudy } from "@/content/work";

export const metadata = caseMetadata("pyxeon");

export default function Pyxeon() {
  const meta = caseStudy("pyxeon");
  return (
    <CaseLayout meta={meta}>
      <Chapter id="problem" title="The problem">
        <p>
          Small businesses lose their weeks to work software could do: re-typing the same data into three systems,
          chasing documents, answering the same questions. They can’t hire engineers, and off-the-shelf tools rarely fit.
          <a href="https://pyxeon.com"> Pyxeon</a> sells them an AI engineering department as a subscription: tell us
          what eats your week, and we build and run the fix.
        </p>
        <p>
          That only works if most of the engineering is done by agents, safely enough that a customer who can’t read
          code can still trust every change.
        </p>
      </Chapter>

      <Chapter id="pipeline" title="The pipeline">
        <p>
          Every request runs the same path. A planner turns it into a structured plan with an effort estimate within
          minutes. Nothing touches code until the customer approves that plan, which puts the human checkpoint where it
          is cheapest (<Cite n={4} />). An implementer agent then clones the repository, makes the change, runs the tests,
          commits and opens a pull request, and a second, independent model reviews the diff against the approved plan.
        </p>
        <PyxeonDrawing />
        <p>
          Customers aren’t engineers, so every change ships with an evidence bundle in plain English: a summary,
          before-and-after screenshots and the checks that ran. Rollback is one click (<Cite n={9} />).
        </p>
      </Chapter>

      <Chapter id="operations" title="Self-healing operations">
        <p>
          Uptime checks run every five minutes. After fifteen minutes of downtime, the system opens a fix request
          automatically and routes it through the same pipeline as any customer change, so there is exactly one path to
          production and it is always audited.
        </p>
        <p>
          Agents run in resource-limited Docker containers launched from a Redis job queue by a dispatcher, report back
          through HMAC-signed callbacks, and are watched by a watchdog, with Kubernetes job manifests for scaling out
          concurrent runs.
        </p>
      </Chapter>

      <Chapter id="platform" title="The platform">
        <ul>
          <li>Eight live services behind Caddy with automatic HTTPS: marketing site, admin dashboard, customer portal, API and four customer apps.</li>
          <li>Multi-tenant isolation with a separate Supabase database per customer and encrypted repository tokens.</li>
          <li>Clerk authentication, and Stripe subscriptions with per-tier monthly request quotas.</li>
          <li>An AI consultation funnel that qualifies business owners, and an App Factory that turns a business intake into a branded application.</li>
        </ul>
        <p>
          I own product, pricing and go-to-market as well as the engineering, which keeps the feedback loop between what
          customers ask for and what the pipeline can safely do very short.
        </p>
      </Chapter>

      <Chapter id="results" title="Results so far">
        <Outcomes
          rows={[
            { label: "Paying customers", value: "2" },
            { label: "Customer-facing apps in production", value: "4" },
            { label: "Median approved plan to deployed change", value: "< 24 h" },
            { label: "Agent cost per shipped change", value: "< $10" },
            { label: "Monitored uptime", value: "99.9%" },
            { label: "Automated tests", value: "1,500+ backend, 47 frontend" },
            { label: "Commits since March 2026", value: "~600" },
          ]}
        />
      </Chapter>
    </CaseLayout>
  );
}
