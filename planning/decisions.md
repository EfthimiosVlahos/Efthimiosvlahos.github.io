# Decisions

**Rebuild in the deployed repo, not the Hugo folder.** The live site deploys from this repo; the 2025 Hugo
build elsewhere on disk was compiled output with no source and a dead remote. (Oct 2026)

**Keep the owner's theme.** A first pass tried a new "engineering drawing" identity; the owner wanted their
existing dark navy look made better, not replaced. Content, logic, charts and tests carried over unchanged;
only tokens and styling changed. (Oct 2026)

**Next.js 16 static export over Astro or a SPA.** Matches the existing stack and Netlify setup, keeps every page
crawlable for link previews, and React suits the interactive pieces. (Oct 2026)

**No chart, animation or map runtime libraries.** Hand-built SVG keeps JS small and lets charts follow the dataviz
rules exactly. d3-geo and topojson run only at build time. (Oct 2026)

**Verified Alliant numbers over résumé numbers.** Public claims should survive a reference check; see
@planning/content.md. (Oct 2026)

**Subtle availability signal.** The owner is employed; "where I do my best work" plus a contact card instead of
"open to work". (Oct 2026)

**Root-level app, no `frontend/` folder.** There is no backend; the global project convention's split would only
add a directory level and a Netlify base-directory setting. (Oct 2026)

**Dropped from the old site:** template leftovers (NVIDIA, Georgia Tech, Samsung and other logos; "cheatsheet",
"PiArt" projects), the phone number in the hero (still in the résumé PDF), the Capital One teller role (not on the
current résumé), and older coursework repos (linked via GitHub). (Oct 2026)

**Removed the travel page.** It came from the 2025 Hugo site but was the theme author's content, not the owner's.
Replaced with an "Off the Clock" page built from the owner's own stated interests: Greek roots, philosophy,
soccer. (Oct 2026)

**Generic eval gate on the home page, real replays in the case study.** The owner wanted "how I work" to read as
general and modern rather than tied to one employer. The home page shows an illustrative agent eval gate; the
insurance-specific replay lab lives only in that case study. Principles were rewritten as general practice. (Oct 2026)

**Retrieval, not generation, for "Ask the ancients".** A static site can't hold an API key, and showing BM25 plus
query rewriting with original text (no paraphrase) demonstrates the retrieval half of RAG honestly. (Oct 2026)


**Edits from a two-lens critical review (CEO/VP and recruiter/FDE).** (Oct 2026)
- Positioning: "Applied AI engineer and architect" in the hero; roles in plain text; best fit adds "standing up an
  AI practice". The reviewers judged the evidence supports Staff FDE, AI architect and founding AI engineer roles;
  VP needs management evidence (reports, hiring, budget) that isn't documented, so the site doesn't claim it.
- Removed "What you see is all there is" (Kahneman's name for a bias, the opposite of the site's argument).
- Six impact tiles, not nine; "on par with GPT-5.1", not "beat" (2.4 points on 39 documents is within noise);
  0.10% stated against AI approvals; one wording per metric across pages.
- Insurance case study: TL;DR, discovery and build-vs-buy chapters, a map of its percentages, and no blame of
  earlier engineers or the CRM vendor. About gains "Working with leaders and customers".
- Trader Hub moved to "More builds"; test and commit counts removed as headline achievements; fewer aphorisms.

**Off the clock as a night sky.** The first version read as cheesy; the owner asked for space and imagination. Each
space element ties to a stated interest rather than decorating: the Greek name as a constellation, the Stoa (the
porch Stoicism is named after), the Stoic "view from above" in Marcus Aurelius's words (VII.47, IX.30), a floodlit
pitch, and Greece and Italy glowing on a night globe that drifts back to the Aegean. (Oct 2026)

**Off the clock rebuilt around the person, not the AI.** The owner asked for the human side and to drop the
expected-goals demo. The page is now a solar system of things they love (home, family, soccer, gym, math and physics,
philosophy) with the profile photo as the sun; each planet links to its section, and sections follow orbit order.
Each interaction teaches something real: Kepler's third law sets the orbit periods, the double pendulum shows
chaos (each thousand-fold smaller head start buys only about three seconds), the two one-rep-max formulas agree
exactly at ten reps, and the Real Madrid chart is a running total, so the 32 years between the sixth and seventh
cups shows as a plateau. "Ask the ancients" stays as the one AI-flavored piece. The star-chart navigation, the Stoa,
pitch and Mediterranean constellations, and `lib/xg.ts` were removed. (Oct 2026)

