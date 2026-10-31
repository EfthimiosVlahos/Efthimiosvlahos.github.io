/**
 * Terms that must never appear on the public site: internal program, customer and vendor names,
 * people, hostnames and repositories from the Alliant work records (see that file's §18–§21).
 * Shared by the unit test (source content) and scripts/check-site.mjs (built HTML).
 * Matching is case-insensitive and on word boundaries.
 */
export const CONFIDENTIAL_TERMS: readonly string[] = [
  // Programs, customers, vendors, internal teams
  "POPIC",
  "Confirm Insurance",
  "confirminsurance",
  "Office Beacon",
  "Venture Tech",
  "VTG",
  "FurtherAI",
  "Astrus",
  "SES Risk",
  "CAU",
  "Helios",
  "ePremium",
  "Lemonade",
  "GradGuard",
  "Munich Re",
  "Coherent Spark",
  // People
  "Cornwell",
  "Kearns",
  "Gorham",
  "Josiah",
  "Malapaka",
  "Pochiraju",
  "Boland",
  "Igwe",
  "Tsen",
  "Yamileth",
  "Beyke",
  // Hosts, repos, internal identifiers
  "nvidia01",
  "goalliant",
  "AI.DocEngine",
  "DocEngine",
  "Policy_Information__c",
  "Policy_Submission_For_Review__e",
  ":8977",
  ":8979",
  "19502",
  "92623",
  "Irvine",
  "Newport Beach",
];

export function findConfidential(text: string): string[] {
  return CONFIDENTIAL_TERMS.filter((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const boundaryStart = /^\w/.test(term) ? "\\b" : "";
    const boundaryEnd = /\w$/.test(term) ? "\\b" : "";
    return new RegExp(`${boundaryStart}${escaped}${boundaryEnd}`, "i").test(text);
  });
}
