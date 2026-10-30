# Efthimios Vlahos: portfolio

Personal site for an applied AI engineer: LLM agents, evaluation and production ML.

**Live:** [evlahos.netlify.app](https://evlahos.netlify.app)

## What's on it

- **Home:** impact at a glance, featured case studies, an interactive skills constellation and a "simulate
  before you ship" lab built from real rule replays.
- **Projects:** four case studies (Pyxeon, insurance document AI, a utility's agents and ML, Trader Hub) with
  system diagrams, charts and interactive explainers.
- **Professional Experience:** career timeline and roles.
- **Skills & Certifications:** every skill linked to where it was used.
- **Travel:** world and US maps and the "Around the world in three words" series.

## Stack

Next.js 16 (App Router, static export), React 19, TypeScript, Tailwind CSS v4. Diagrams, charts and maps are
hand-built SVG; maps are computed at build time with d3-geo. Deployed on Netlify.

## Develop

```bash
nvm use            # Node 22
npm install
npm run dev        # http://localhost:3000
npm run verify     # typecheck, lint, unit tests, build, site checks, e2e (run before every commit)
```

End-to-end tests need a browser once: `npx playwright install chromium`.

## Edit content

All copy and figures live in typed modules under `content/`: `profile.ts`, `results.ts`, `experience.ts`,
`work.ts`, `principles.ts`, `tools.ts`, `travel.ts`. Case-study prose is in `app/projects/<slug>/page.tsx`.
Read `CLAUDE.md` and `planning/content.md` first: numbers must trace to a source, and a confidentiality check
fails the build if internal names from past work appear.
