# CLAUDE.md: Efthimios Vlahos portfolio

Personal portfolio for an applied AI / forward-deployed engineer. Static Next.js site deployed to Netlify
(`evlahos.netlify.app`) from `main` of `EfthimiosVlahos/Efthimiosvlahos.github.io`.

See @planning/overview.md for the architecture and @planning/decisions.md for why things are the way they are.

## Commands

```bash
npm install            # Node 22 (.nvmrc)
npm run dev            # local dev server
npm run verify         # typecheck, lint, unit tests, build, site checks, e2e: run before every commit
npm run build          # static export to out/
npm run check:site     # links, SEO tags and confidentiality scan over out/
npm run test:e2e       # Playwright + axe against the built site (needs `npx playwright install chromium` once)
scripts/optimize-images.sh <src> public/travel   # resize new travel photos (macOS sips)
```

## Rules that matter here

- **Every number must trace to a source.** Résumé figures go in as written. Alliant figures come only from the
  dated records in `ALLIANT_WORK_PORTFOLIO.md` (kept outside the repo), never from the résumé bullets that
  disagree with them. If the source doesn't say how something was measured, don't invent a `note`.
- **Confidentiality.** No internal program, customer, vendor or people names, hostnames, ports or exact business
  volumes from Alliant work. The list lives in `tests/unit/confidential.ts`; the unit test scans source and
  `check:site` scans built HTML. Add a term there before writing around it.
- **Content lives in `content/`** as typed data. Pages and components render it; don't hard-code copy in components
  except case-study prose in `app/projects/<slug>/page.tsx`.
- **Theme is the owner's existing identity:** dark navy default (`#16162a`), Inter, blue accents with a soft glow,
  pill nav. Tokens are CSS variables in `app/globals.css`; light and dark values are both set there. Light-mode
  text colors (`--blue`, `--red`) are darker than chart marks on purpose so tinted chips stay WCAG AA.
- **Charts** follow the dataviz rules: validated palettes (`--mark-*`, `--cat-*`), thin marks, text in ink colors,
  a hover/focus tooltip and a "Show the numbers" table on every chart (`components/charts/ChartFigure.tsx`).
- **Static export only.** No server features (route handlers with request data, ISR, image optimizer). Metadata
  routes need `export const dynamic = "force-static"`.

## Layout

```
app/          routes: /, /about, /experience, /projects, /projects/<slug>, /skills, /travel, 404, sitemap, robots, OG image
components/   UI; drawings/ (SVG diagram kit), charts/, lab/ (interactive widgets), maps/
content/      typed site content (profile, results, experience, work, principles, tools, evidence, travel)
lib/          pure logic: simulate (replay verdicts), validator (hard_fail), gate, constellation layout, geo, scales
tests/        unit/ (vitest), e2e/ (playwright + axe)
scripts/      check-site.mjs, optimize-images.sh
planning/     living design docs
```
