# Learnings

- **Validate palettes, don't eyeball them.** Blue and violet looked distinct but failed colorblind separation as a
  set; the timeline uses the first three categorical slots, the only trio that passes all-pairs in both modes.
- **Light mode needs its own text colors.** `#2563eb` on a 10% blue tint is 4.49:1, just under AA. Text-weight
  blue and red are darker in light mode than the chart marks.
- **Page-level `openGraph` replaces the root one** in Next metadata, dropping the share image. Restate `images`.
- **Static export writes `opengraph-image` with no extension.** Set its Content-Type in `netlify.toml`.
- **App Router serializes server output twice** (HTML plus the flight payload). Big SVGs, such as maps, cost double;
  simplify geometry (`topojson-simplify`, whole-pixel coordinates) before reaching for client-side rendering.
- **WCAG 2.5.3 label in name:** an `aria-label` on a link must contain its visible text. Prefer visible text plus
  `sr-only` over `aria-label`.
- **Hide-until-animated content must depend on JS being present** (`html.js`), or a script failure leaves diagrams invisible.
- **The e2e axe pass must wait for entrance animations**, or it measures contrast mid-fade.
- **Check provenance before porting "personal" content.** Template sites ship the theme author's pages; country
  lists and bios that don't match the owner are the tell.
- **Query rewriting needs spelling variants.** Older translations mix British and American spellings
  ("neighbour"/"neighbors"); a regression test per suggested question catches misses.
- **Fresh PRNG per item is a trap.** Seeding xorshift with small consecutive seeds gives tiny first outputs, so every
  shot "scored". Use one well-mixed stream (mulberry32) per simulation.
- **Show readable tokens, not stems.** "actuall" and "worr" read as typos; keep stems internal.
- **Grids need explicit columns when a child has a minimum width.** A bare `grid` uses `auto` tracks, which grow to
  the child's min-content and push the page wider than a phone. Use `grid-cols-1` (`minmax(0, 1fr)`).
- **Wide SVG charts shrink their text on phones.** A 760-unit chart at 308 px renders 13 px labels at about 5 px.
  Design narrow charts narrow, or give `ChartFigure` a `minWidth` so the plot scrolls instead.
- **Measure before writing a physics caption.** The pendulum caption first said energy stays "within half a percent";
  measured drift was 0.0003% after ten simulated minutes, so the caption and its test now say that.
- **Inter has no ∝ glyph.** The fallback renders as a faint dash; write the relationship in words.
- **Keyboard e2e on freshly loaded pages can race hydration.** Retry the first interaction until the UI responds
  (`expect(...).toPass()`), then assert.
- **Prettier isn't configured in this repo.** Running it reformats files to 80 columns; don't.
- **Two keyboard presses can straddle a frame on a loaded machine.** In the keepy-uppy e2e test the ball landed
  between "start" and "kick" when the load average hit ~120. Dispatch both keydowns in one synchronous `evaluate`.
