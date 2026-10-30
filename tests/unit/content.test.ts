import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { caseStudies, builds } from "@/content/work";
import { roles, certifications } from "@/content/experience";
import { principles } from "@/content/principles";
import { results } from "@/content/results";
import { toolGroups } from "@/content/tools";
import { evidence } from "@/content/evidence";
import { findConfidential } from "./confidential";

const root = join(__dirname, "..", "..");

function walk(dir: string, exts: string[]): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path, exts);
    return exts.some((e) => name.endsWith(e)) ? [path] : [];
  });
}

describe("content integrity", () => {
  it("has unique case-study slugs, each with a page module", () => {
    const slugs = caseStudies.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(existsSync(join(root, "app", "projects", slug, "page.tsx")), `page for ${slug}`).toBe(true);
    }
  });

  it("cites only principles that exist", () => {
    const numbers = new Set(principles.map((p) => p.n));
    expect(principles.map((p) => p.n)).toEqual(principles.map((_, i) => i + 1));
    for (const c of caseStudies) for (const n of c.principles) expect(numbers.has(n), `${c.slug} cites ${n}`).toBe(true);
  });

  it("points every tool and build at known evidence", () => {
    const known = new Set(Object.keys(evidence));
    for (const g of toolGroups) for (const t of g.tools) for (const id of t.usedIn) expect(known.has(id), `${t.name} -> ${id}`).toBe(true);
    for (const b of builds) expect(known.has(b.id)).toBe(true);
  });

  it("links results only to existing case studies", () => {
    const slugs = new Set(caseStudies.map((c) => `/projects/${c.slug}`));
    for (const r of results) if (r.href) expect(slugs.has(r.href), r.href).toBe(true);
  });

  it("lists current roles first, then past roles newest first, with valid date ranges", () => {
    const firstPast = roles.findIndex((r) => r.end !== null);
    expect(roles.slice(firstPast).every((r) => r.end !== null), "no current role after a past one").toBe(true);
    const pastEnds = roles.slice(firstPast).map((r) => r.end as string);
    expect([...pastEnds].sort().reverse()).toEqual(pastEnds);
    for (const r of roles) if (r.end) expect(r.end >= r.start, r.id).toBe(true);
    for (const c of certifications) expect(c.name.length).toBeGreaterThan(3);
  });

});

describe("confidentiality guard", () => {
  it("catches a planted term and ignores ordinary words", () => {
    expect(findConfidential("Reviewed for POPIC last week")).toEqual(["POPIC"]);
    expect(findConfidential("vacation, caucus, because")).toEqual([]);
  });

  it("finds no internal names anywhere in site source", () => {
    const files = [
      ...walk(join(root, "content"), [".ts"]),
      ...walk(join(root, "app"), [".ts", ".tsx"]),
      ...walk(join(root, "components"), [".ts", ".tsx"]),
      ...walk(join(root, "lib"), [".ts"]),
    ];
    const leaks = files.flatMap((f) => findConfidential(readFileSync(f, "utf8")).map((t) => `${f}: ${t}`));
    expect(leaks).toEqual([]);
  });
});
