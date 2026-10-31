# Overview

## Goal

Position Efthimios for forward-deployed engineering, applied AI and AI architecture roles. Hiring managers for
those roles screen on shipping history, deep case studies (what broke, how it was diagnosed, what changed) and
evaluation done in production. The site leads with that evidence, keeps Alliant as one role among several, and
signals availability subtly ("where I do my best work") rather than with "open to work" language.

## Audience and their 30 seconds

| Reader | What they need | Where it is |
|---|---|---|
| Recruiter | Name, role, résumé, contact | Home hero, header, contact card |
| Hiring manager | Proof of judgment and shipping | Impact grid, case studies, eval lab |
| Engineer on the panel | Real architecture and trade-offs | Case-study diagrams, charts, principles |

## Architecture

- Next.js 16 App Router with `output: "export"`: every route is static HTML; Netlify serves `out/`.
- Content is typed TypeScript in `content/`; pages render it. Pure logic in `lib/` is unit-tested.
- Visuals are hand-built SVG: no chart or animation libraries. Interactivity is small client islands:
  `SkillsConstellation`, `EvalGate`, `SimulateLab`, `HardFailExplainer`, `GraduationGate`, `AskTheAncients`,
  `HeroNetwork`, chart tooltips, and on Off the clock `SolarSystem`, `NightGlobe`, `KeepyUppy`, `OneRepMax`,
  `DoublePendulum`.
- "Ask the ancients" fetches `public/data/ancients.json` (~170 KB gzipped) only on first interaction.
- Off the clock is always night (`.night` scopes its own tokens). The starfield is a sticky canvas limited to the
  page; the globe lazy-loads d3-geo, topojson and world-atlas 110m when it nears the viewport.

## Pages

| Route | Purpose |
|---|---|
| `/` | Hero, impact grid, featured projects, skills constellation, eval gate (illustrative), contact |
| `/about` | Bio, how-I-work loop diagram, ten principles, education |
| `/experience` | Career timeline chart, role cards |
| `/projects` and `/projects/<slug>` | Case-study cards; four case studies with diagrams and charts |
| `/skills` | Constellation, skills by group with evidence, certifications |
| `/off-the-clock` | The human side, under a night sky: name as a constellation, a solar system of interests that doubles as navigation, a globe with an arc from Greece to Long Island, "things you learn as one of four", keepy-uppy, a made-up scouting report and Real Madrid's fifteen European Cups, a leg-day streak and one-rep-max calculator, chaotic double pendulums, and "Ask the ancients" |

Related: @planning/frontend.md, @planning/content.md, @planning/deployment.md.
