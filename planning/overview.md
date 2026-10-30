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
  `SkillsConstellation`, `SimulateLab`, `HardFailExplainer`, `GraduationGate`, `TravelMap`, `HeroNetwork`, chart tooltips.
- Maps are computed at build time (`lib/geo.ts`, d3-geo + topojson), so visitors download SVG paths only.

## Pages

| Route | Purpose |
|---|---|
| `/` | Hero, impact grid, featured projects, skills constellation, eval lab, contact |
| `/about` | Bio, how-I-work loop diagram, ten principles, education |
| `/experience` | Career timeline chart, role cards |
| `/projects` and `/projects/<slug>` | Case-study cards; four case studies with diagrams and charts |
| `/skills` | Constellation, skills by group with evidence, certifications |
| `/travel` | World and US maps, "Around the world in three words" |

Related: @planning/frontend.md, @planning/content.md, @planning/deployment.md.
