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
