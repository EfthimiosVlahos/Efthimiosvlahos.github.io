#!/usr/bin/env node
// Post-build checks on the static export in out/:
//  1. every internal link and asset reference resolves to a file,
//  2. every page has a title, description, canonical URL and Open Graph tags,
//  3. no confidential term from the work records appears in any built page.
// Exits non-zero with a list of problems so CI and `npm run verify` fail loudly.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const out = join(root, "out");
if (!existsSync(out)) {
  console.error("out/ not found: run `npm run build` first.");
  process.exit(1);
}

// Shared with the unit test; parsed from the TS source so there is one list.
const termsSource = readFileSync(join(root, "tests/unit/confidential.ts"), "utf8");
const listBlock = termsSource.slice(termsSource.indexOf("["), termsSource.indexOf("];"));
const TERMS = [...listBlock.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
if (TERMS.length < 10) {
  console.error("Could not read the confidential term list.");
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

/** Resolve a site path the way Netlify serves this export. */
function resolves(path) {
  const clean = decodeURIComponent(path.split("#")[0].split("?")[0]);
  if (clean === "" || clean === "/") return existsSync(join(out, "index.html"));
  const candidates = [clean, `${clean}.html`, join(clean, "index.html")];
  return candidates.some((c) => existsSync(join(out, c)));
}

const problems = [];
const pages = walk(out).filter((f) => f.endsWith(".html"));

for (const file of pages) {
  const rel = relative(out, file);
  const html = readFileSync(file, "utf8");
  const isErrorPage = rel === "404.html" || rel.startsWith("_not-found");

  for (const [, attr, url] of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
    if (!url.startsWith("/") || url.startsWith("//")) continue;
    if (!resolves(url)) problems.push(`${rel}: broken ${attr} ${url}`);
  }

  if (!isErrorPage) {
    const required = {
      title: /<title>[^<]{10,}<\/title>/,
      description: /<meta name="description" content="[^"]{40,}"/,
      canonical: /<link rel="canonical" href="https:\/\/[^"]+"/,
      "og:title": /<meta property="og:title"/,
      "og:image": /<meta property="og:image"/,
    };
    for (const [name, re] of Object.entries(required)) if (!re.test(html)) problems.push(`${rel}: missing ${name}`);
  }

  const text = html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " ");
  for (const term of TERMS) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`${/^\w/.test(term) ? "\\b" : ""}${escaped}${/\w$/.test(term) ? "\\b" : ""}`, "i");
    if (re.test(text) || re.test(html)) problems.push(`${rel}: confidential term "${term}"`);
  }
}

if (problems.length) {
  console.error(`check-site: ${problems.length} problem(s)\n${problems.map((p) => `  - ${p}`).join("\n")}`);
  process.exit(1);
}
console.log(`check-site: ${pages.length} pages OK (links, SEO tags, confidentiality).`);
