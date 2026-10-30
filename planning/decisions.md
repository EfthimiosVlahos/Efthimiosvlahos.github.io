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
