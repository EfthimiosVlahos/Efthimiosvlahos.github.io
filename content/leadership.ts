/**
 * "Working with leaders and customers": evidence of scoping, stakeholder and executive work, from dated
 * project records and the résumé. Anonymized like the case studies; no internal names or weaknesses.
 */
export interface LeadershipItem {
  title: string;
  body: string;
  href?: string;
}

export const leadership: LeadershipItem[] = [
  {
    title: "Turned a vague ask into a ranked plan",
    body: "Asked for “the top five customer questions”, I analyzed 100K+ support cases three independent ways and found that more than half of inbound emails were a policy sent for manual upload: the biggest automation lever.",
    href: "/projects/insurance-document-ai#discovery",
  },
  {
    title: "Reported to the CIO in numbers that reconcile",
    body: "Wrote the accuracy report for the CIO and traced an alarming 0.75% down to the 0.10% the AI actually got wrong. It matched the live dashboard on 22 of 22 days.",
    href: "/projects/insurance-document-ai#alarming-number",
  },
  {
    title: "Made a build-vs-buy call and delivered it",
    body: "Built the CIO-requested in-house alternative to a vendor product in two weeks, isolated from the production system it shares hardware with.",
    href: "/projects/insurance-document-ai#build-vs-buy",
  },
  {
    title: "Said “not yet” with data",
    body: "Asked whether AI could catch fabricated documents, I measured candidate signals on about 75,000 real ones and recommended what would work, what couldn’t, and to hold off building.",
    href: "/projects/insurance-document-ai#discovery",
  },
  {
    title: "Took over an early-stage system on a deadline",
    body: "Inherited a pipeline spread across three repositories and brought it back into production on-prem within a two-week deadline.",
    href: "/projects/insurance-document-ai#start",
  },
  {
    title: "Own a product end to end",
    body: "At Pyxeon I own product, pricing and go-to-market as well as the platform: customers approve plans, not code, so every change is explained in plain English.",
    href: "/projects/pyxeon",
  },
];
