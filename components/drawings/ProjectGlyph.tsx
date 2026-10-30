import type { CaseSlug } from "@/content/types";

/** Decorative header art for project cards: a tiny sketch of each system's shape. */
export function ProjectGlyph({ slug }: { slug: CaseSlug }) {
  return (
    <svg viewBox="0 0 400 144" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id={`g-${slug}`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="var(--blue-strong)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--blue-strong)" stopOpacity="0" />
        </radialGradient>
        <pattern id={`d-${slug}`} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="var(--ink-soft)" opacity="0.25" />
        </pattern>
      </defs>
      <rect width="400" height="144" fill={`url(#d-${slug})`} />
      <rect width="400" height="144" fill={`url(#g-${slug})`} />
      <g fill="none" stroke="var(--blue)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {GLYPHS[slug]}
      </g>
    </svg>
  );
}

const node = (x: number, y: number, r = 7, fill = "var(--paper)") => (
  <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={fill} />
);

const GLYPHS: Record<CaseSlug, React.ReactNode> = {
  // Plan, approve, implement, verify, ship, with the self-healing loop underneath.
  pyxeon: (
    <>
      <path d="M60 60 H340" />
      <path d="M340 60 C370 60 370 112 340 112 H60 C30 112 30 60 60 60" strokeDasharray="5 6" opacity="0.7" />
      {[60, 130, 200, 270, 340].map((x, k) => node(x, 60, k === 3 ? 10 : 8, k === 3 ? "var(--blue-strong)" : "var(--paper)"))}
    </>
  ),
  // Document pages feed a model, whose output passes through a row of checks.
  "insurance-document-ai": (
    <>
      <rect x="42" y="34" width="44" height="58" rx="5" fill="var(--paper)" />
      <rect x="52" y="44" width="44" height="58" rx="5" fill="var(--paper)" />
      <path d="M60 60 H86 M60 70 H86 M60 80 H78" opacity="0.7" />
      <path d="M100 72 H150" />
      <circle cx="180" cy="72" r="26" fill="var(--paper)" />
      <path d="M168 72 L176 80 L192 62" />
      <path d="M206 72 H236" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
        <rect key={k} x={244 + k * 16} y={62} width="11" height="20" rx="3" fill={k === 7 ? "var(--red)" : "var(--blue-strong)"} stroke="none" opacity={k === 7 ? 0.9 : 0.75} />
      ))}
    </>
  ),
  // A question routed through an agent graph to tables and back as a report.
  "energy-utility": (
    <>
      <path d="M50 72 H110 M110 72 L170 40 M110 72 L170 104 M170 40 L240 72 M170 104 L240 72 M240 72 H300" />
      <path d="M300 72 C330 72 330 40 350 40" opacity="0.7" />
      <path d="M300 72 C330 72 330 104 350 104" opacity="0.7" />
      {node(50, 72)}
      {node(110, 72, 9, "var(--blue-strong)")}
      {node(170, 40)}
      {node(170, 104)}
      {node(240, 72, 9)}
      {node(300, 72)}
      <rect x="350" y="30" width="22" height="20" rx="3" fill="var(--paper)" />
      <rect x="350" y="94" width="22" height="20" rx="3" fill="var(--paper)" />
    </>
  ),
  // Six agents around a chief, with a gate before live trading.
  "trader-hub": (
    <>
      {Array.from({ length: 6 }, (_, k) => {
        const a = (k / 6) * Math.PI * 2 - Math.PI / 2;
        const x = 150 + Math.cos(a) * 46;
        const y = 72 + Math.sin(a) * 46;
        return (
          <g key={k}>
            <path d={`M150 72 L${x} ${y}`} opacity="0.6" />
            {node(x, y, 7)}
          </g>
        );
      })}
      {node(150, 72, 11, "var(--blue-strong)")}
      <path d="M210 72 H280" />
      <rect x="282" y="46" width="10" height="52" rx="3" fill="var(--paper)" />
      <rect x="300" y="46" width="10" height="52" rx="3" fill="var(--paper)" />
      <path d="M318 72 H350" strokeDasharray="4 5" opacity="0.7" />
      <path d="M350 60 L362 72 L350 84" />
    </>
  ),
};
