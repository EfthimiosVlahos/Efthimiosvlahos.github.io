/**
 * Layout for the skills constellation: skills on an outer ring (grouped, colored by group),
 * the places they were used as a column of pills in the middle, and a curve for every
 * skill-to-evidence link. Pure geometry so it can be unit-tested and computed at build time.
 */
import type { EvidenceId, ToolGroup } from "@/content/types";

export interface SkillNode {
  id: string;
  name: string;
  group: number;
  x: number;
  y: number;
  /** Label anchor point, rotation and alignment, so text reads outward and never upside down. */
  lx: number;
  ly: number;
  rotate: number;
  anchor: "start" | "end";
  usedIn: EvidenceId[];
}

export interface EvidenceNode {
  id: EvidenceId;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Edge {
  skill: string;
  evidence: EvidenceId;
  group: number;
  d: string;
}

export interface GroupArc {
  name: string;
  group: number;
  d: string;
  /** Where the group's name sits, just inside its arc, anchored so it grows toward the center. */
  tx: number;
  ty: number;
  anchor: "start" | "middle" | "end";
}

export interface ConstellationLayout {
  size: number;
  skills: SkillNode[];
  evidence: EvidenceNode[];
  edges: Edge[];
  arcs: GroupArc[];
}

const SIZE = 1080;
const C = SIZE / 2;
const R = 300;
const GROUP_GAP = 0.09; // radians of empty space between groups
const PILL_W = 230;
const PILL_H = 30;
const PILL_GAP = 9;

const polar = (r: number, a: number): [number, number] => [C + r * Math.cos(a), C + r * Math.sin(a)];

export function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function layoutConstellation(groups: ToolGroup[], labels: Record<EvidenceId, { label: string }>): ConstellationLayout {
  const total = groups.reduce((n, g) => n + g.tools.length, 0);
  if (total === 0) throw new Error("constellation needs at least one tool");
  const step = (2 * Math.PI - GROUP_GAP * groups.length) / total;

  // Start at 12 o'clock and go clockwise.
  let angle = -Math.PI / 2 + GROUP_GAP / 2;
  const skills: SkillNode[] = [];
  const arcs: GroupArc[] = [];

  groups.forEach((g, gi) => {
    const start = angle;
    for (const t of g.tools) {
      const a = angle + step / 2;
      const [x, y] = polar(R, a);
      const [lx, ly] = polar(R + 14, a);
      const deg = (a * 180) / Math.PI;
      const flip = Math.cos(a) < 0;
      skills.push({
        id: slug(t.name),
        name: t.name,
        group: gi,
        x,
        y,
        lx,
        ly,
        rotate: flip ? deg + 180 : deg,
        anchor: flip ? "end" : "start",
        usedIn: t.usedIn,
      });
      angle += step;
    }
    const end = angle;
    const [ax, ay] = polar(R - 16, start + 0.01);
    const [bx, by] = polar(R - 16, end - 0.01);
    const large = end - start > Math.PI ? 1 : 0;
    const mid = (start + end) / 2;
    const [tx, ty] = polar(R - 34, mid);
    const cos = Math.cos(mid);
    const anchor = cos > 0.35 ? "end" : cos < -0.35 ? "start" : "middle";
    arcs.push({ name: g.name, group: gi, d: `M${ax},${ay} A${R - 16},${R - 16} 0 ${large} 1 ${bx},${by}`, tx, ty, anchor });
    angle += GROUP_GAP;
  });

  // Evidence pills, ordered by the average height of the skills that point at them to limit crossings.
  const ids = Array.from(new Set(skills.flatMap((s) => s.usedIn)));
  const meanY = (id: EvidenceId) => {
    const ys = skills.filter((s) => s.usedIn.includes(id)).map((s) => s.y);
    return ys.reduce((a, b) => a + b, 0) / ys.length;
  };
  ids.sort((a, b) => meanY(a) - meanY(b));
  const columnH = ids.length * PILL_H + (ids.length - 1) * PILL_GAP;
  const evidence: EvidenceNode[] = ids.map((id, k) => ({
    id,
    label: labels[id].label,
    x: C - PILL_W / 2,
    y: C - columnH / 2 + k * (PILL_H + PILL_GAP),
    w: PILL_W,
    h: PILL_H,
  }));

  const edges: Edge[] = skills.flatMap((s) =>
    s.usedIn.map((id) => {
      const p = evidence.find((e) => e.id === id);
      if (!p) throw new Error(`No evidence node for ${id}`);
      const left = s.x < C;
      const ex = left ? p.x : p.x + p.w;
      const ey = p.y + p.h / 2;
      const c1x = s.x + (C - s.x) * 0.45;
      const c1y = s.y + (C - s.y) * 0.45;
      const c2x = ex + (left ? -70 : 70);
      return { skill: s.id, evidence: id, group: s.group, d: `M${s.x},${s.y} C${c1x},${c1y} ${c2x},${ey} ${ex},${ey}` };
    }),
  );

  return { size: SIZE, skills, evidence, edges, arcs };
}
