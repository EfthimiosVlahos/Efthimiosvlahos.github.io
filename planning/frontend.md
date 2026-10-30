# Frontend

## Theme

The owner's existing identity, upgraded rather than replaced: dark navy (`#16162a`) by default, Inter, blue
(`#3b82f6` / `#60a5fa`) with a violet gradient accent and soft glows, rounded cards, pill buttons and nav.

Tokens (`app/globals.css`) are role-named and mapped into Tailwind v4 with `@theme inline`:

| Token | Role | Dark | Light |
|---|---|---|---|
| `paper` / `raised` / `sunken` | page / card / inset | `#16162a` / `#1d1d36` / `#121224` | `#fff` / `#f8fafc` / `#f1f5f9` |
| `ink` / `soft` | text / secondary text | `#f3f4f6` / `#a1a8b8` | `#111827` / `#5b6472` |
| `blue` / `blue-strong` | link text / fills and buttons | `#60a5fa` / `#3b82f6` | `#1d4ed8` / `#2563eb` |
| `red` | "what broke", critical | `#fb7185` | `#be123c` |
| `mark-*`, `cat-1..6` | chart marks, skill groups | validated with the dataviz palette checks |

## Motion

- One orchestrated entrance per page (`.rise`, staggered by `--i`).
- Diagrams draw themselves once on scroll (`Reveal` + `.draw-on`). The hidden start state only applies under
  `html.js`, so a no-JS visitor always sees finished diagrams.
- Hero network canvas pauses off-screen and in background tabs; static under reduced motion.
- Everything respects `prefers-reduced-motion`.

## Components worth knowing

- `drawings/kit.tsx`: `Box`, `Arrow`, `Dim`, `Note`, `Drawing` for every system diagram. Dashed boxes are external
  systems or people.
- `charts/ChartFigure.tsx`: frame, legend, tooltip (hover and keyboard), table view; charts cap at 1.25x their design width.
- `SkillsConstellation`: layout from `lib/constellation.ts`; desktop only, `ToolsIndex` is the mobile and list view.
- `Sidenote`: margin notes on wide screens, tap-to-open inline on narrow ones.

## Accessibility

axe runs on every route in dark mode and four routes in light mode (`tests/e2e`). Watch for: label-in-name on
links with icons, contrast of tinted chips in light mode, focusable SVG marks needing names.
