import { describe, expect, it } from "vitest";
import { layoutConstellation, slug } from "@/lib/constellation";
import { toolGroups } from "@/content/tools";
import { evidence } from "@/content/evidence";

describe("skills constellation layout", () => {
  const layout = layoutConstellation(toolGroups, evidence);
  const toolCount = toolGroups.reduce((n, g) => n + g.tools.length, 0);

  it("places every tool once, with unique ids", () => {
    expect(layout.skills).toHaveLength(toolCount);
    expect(new Set(layout.skills.map((s) => s.id)).size).toBe(toolCount);
    expect(slug("TypeScript, React and Next.js")).toBe("typescript-react-and-next-js");
  });

  it("draws exactly one edge per tool-to-evidence link", () => {
    const links = toolGroups.reduce((n, g) => n + g.tools.reduce((m, t) => m + t.usedIn.length, 0), 0);
    expect(layout.edges).toHaveLength(links);
  });

  it("keeps skills on the ring and labels upright", () => {
    const c = layout.size / 2;
    for (const s of layout.skills) {
      expect(Math.hypot(s.x - c, s.y - c)).toBeCloseTo(300, 5);
      const r = ((s.rotate % 360) + 360) % 360;
      expect(r < 90 || r > 270, `${s.name} rotated ${s.rotate}`).toBe(true);
    }
  });

  it("stacks evidence pills without overlap inside the ring", () => {
    const ys = layout.evidence.map((e) => e.y).sort((a, b) => a - b);
    for (let k = 1; k < ys.length; k++) expect((ys[k] as number) - (ys[k - 1] as number)).toBeGreaterThanOrEqual(30);
    for (const e of layout.evidence) expect(Math.hypot(e.x - layout.size / 2, e.y - layout.size / 2)).toBeLessThan(300);
  });
});
