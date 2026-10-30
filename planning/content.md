# Content

## Sources

| Source | Used for | Notes |
|---|---|---|
| `Efthimios_Vlahos_Resume_AppliedAI_2026-10.pdf` | Roles, dates, Con Edison / Cornerstone / Microsoft / Pyxeon figures, projects, skills | Also served as `/Efthimios_Vlahos_Resume.pdf` |
| `ALLIANT_WORK_PORTFOLIO.md` (personal, not in repo) | Alliant figures and stories | Dated records; anonymized per its §21 |
| Trader Hub README (private repo) | Council order, gate thresholds, features | Only what the README states |
| Project Gutenberg | Philosophy corpus: Long (Marcus Aurelius), Higginson (Epictetus), Jowett (Plato’s Apology), Stewart (Seneca) | Public domain; built by `scripts/build-corpus.mjs` |
| The owner (Oct 2026) | Greek, reads philosophy, loves soccer, has traveled to Greece and Italy | Personal page copy only claims these |

## Known discrepancy (owner to resolve)

The résumé's Alliant bullets claim figures the dated records don't support: "agents resolve 80% of requests
without escalation", "p95 latency under 10 seconds", "500+ case golden eval set", "policy generation", "millions
of dollars", "mentor four engineers". The site uses the records instead: 40% fully automated, 0.10% true
reversals, $0.0085 per policy, median 26 s and P95 152 s per document, a 39-document answer key, policy *review*.
The résumé PDF on the site is the owner's file and still contains the original bullets.

### Suggested Alliant résumé bullets (match the site and the records)

- Moved production document extraction from GPT-5.1 to a self-hosted Qwen3.5 MoE vision model on vLLM (NVIDIA
  A100s): on-par field accuracy (93.9% vs 91.5% on 39 hand-labeled documents), no per-document cost, data on-prem.
- Built an LLM + deterministic-rules validator that approves ~40% of insurance policies with no human touch; 0.10%
  of AI approvals later overturned by a reviewer; $0.0085 per policy; ~870 reviewer-hours saved in seven weeks.
- Owned reliability for a shared 8×A100 platform: a watchdog probing real inference turned a failure mode that had
  gone unnoticed for two days into ~2-minute automatic recoveries.
- Designed and shipped a CIO-requested submission-intake engine in two weeks as the in-house alternative to a vendor
  product: citation-backed extraction (99.3% of 560 fields, none invented), load-tested alongside production.
- Ran discovery for the next automation targets: analyzed 100K+ customer-service cases three ways and delivered a
  ranked plan; wrote the CIO accuracy report, reconciled to the live dashboard on 22/22 days.

Drop or verify before reuse: "agents resolve 80%", "p95 under 10 s", "500+ case golden set", "policy generation",
"millions of dollars", "96% field-level accuracy", "mentor four engineers", "10,000+ documents per month" (the
records show ~65,000 in seven weeks).

## Anonymization map (Alliant)

Internal program becomes "a renters-insurance compliance program"; the CRM and its vendor become "the CRM" and
"the CRM vendor"; the offshore team becomes "an offshore team"; the vendor product becomes "a vendor product".
People, hostnames, ports, work-item numbers and exact business volumes are omitted or rounded.

## Not the owner's content

The 2025 Hugo site's travel page ("Around the world in three words", the country and state lists, the photos) was
the theme author's, not the owner's. It was briefly ported here by mistake and then removed (Oct 2026).

## Illustrative content

The home-page eval gate (`lib/evalgate.ts`) is a made-up customer-support agent with made-up numbers, labeled as
illustrative on the page. The toy xG model is fit to typical open-play values and labeled as a toy.

## Writing rules

- First person, plain verbs, sentence case. Say what happened and how it was measured.
- Use "built / designed / owned" only where the records say so; "deployed / operated" for inherited systems.
- Don't add `note` text to a result unless the source states the measurement.
