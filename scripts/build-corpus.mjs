#!/usr/bin/env node
// Builds public/data/ancients.json, the passage corpus for "Ask the ancients", from public-domain
// Project Gutenberg plain-text files. Only the translated works are used: no Gutenberg headers,
// licenses, introductions, footnotes or indexes.
//
// Usage: node scripts/build-corpus.mjs <dir-with-gutenberg-txt-files>
//   expects pg15877.txt (Marcus Aurelius, tr. George Long), pg45109.txt (Epictetus, tr. Higginson),
//   pg1656.txt (Plato's Apology, tr. Jowett), pg64576.txt (Seneca, Minor Dialogues, tr. Aubrey Stewart)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const src = process.argv[2];
if (!src) {
  console.error("usage: node scripts/build-corpus.mjs <dir>");
  process.exit(1);
}
const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const lines = (name) => readFileSync(join(src, name), "utf8").replace(/\r/g, "").split("\n");

const MIN_WORDS = 22;
const MAX_WORDS = 110;

function clean(text) {
  return text
    .replace(/\[Greek:[^\]]*\]/g, "")
    // Long marks passages he considers corrupt as "[+ ... +]"; they aren't reliably Marcus.
    .replace(/\[\+[^\]]*\+\]/g, "")
    .replace(/\[[A-Z]\]/g, "")
    .replace(/\[\d+\]/g, "")
    .replace(/\{\d+\}/g, "")
    .replace(/\[_[^\]]*_\]/g, "")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/--/g, "—")
    .replace(/\+/g, "")
    .replace(/\s+/g, " ")
    .replace(/\s([,.;:!?])/g, "$1")
    .trim();
}

const words = (t) => t.split(/\s+/).filter(Boolean).length;

/** Split long paragraphs into sentence windows so each passage reads as one thought. */
function chunk(text) {
  if (words(text) <= MAX_WORDS) return [text];
  // Old translations put lowercase words after "?" mid-sentence, so only break before a capital.
  const sentences = text.split(/(?<=[.!?]["”’)\]]*)\s+(?=[A-Z“"‘(])/).map((x) => `${x} `);
  const out = [];
  let cur = "";
  for (const s of sentences) {
    if (cur && words(cur + s) > MAX_WORDS) {
      out.push(cur.trim());
      cur = "";
    }
    cur += s;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** Paragraphs from a line range, skipping indented footnote blocks. */
function paragraphs(ls) {
  const paras = [];
  let cur = [];
  let inNote = false;
  for (const line of ls) {
    if (/^\s{3,}\[[A-Z0-9]+\]/.test(line)) inNote = true;
    if (line.trim() === "") {
      if (cur.length && !inNote) paras.push(cur.join(" "));
      cur = [];
      inNote = false;
      continue;
    }
    if (!inNote) cur.push(line);
  }
  if (cur.length && !inNote) paras.push(cur.join(" "));
  return paras;
}

const passages = [];
const add = (author, work, ref, text) => {
  for (const piece of chunk(clean(text))) {
    if (words(piece) >= MIN_WORDS) passages.push({ id: `p${passages.length}`, author, work, ref, text: piece });
  }
};

// Marcus Aurelius: books are lines "I." to "XII."; sections start "2. ", "3. " (the first is unnumbered).
// Book I is a list of thanks to family and teachers, so it starts from Book II.
{
  const ls = lines("pg15877.txt");
  const start = ls.findIndex((l) => l === "I.");
  const end = ls.findIndex((l, i) => i > start && l.trim() === "INDEXES.");
  let book = "";
  let section = 1;
  let buf = [];
  const flush = () => {
    if (book !== "I") for (const p of paragraphs(buf)) add("Marcus Aurelius", "Meditations, tr. George Long (1862)", `Book ${book}, ${section}`, p);
    buf = [];
  };
  for (const l of ls.slice(start, end)) {
    const bookMatch = /^([IVX]+)\.$/.exec(l);
    if (bookMatch) {
      flush();
      book = bookMatch[1];
      section = 1;
      continue;
    }
    const sec = /^(\d+)\. /.exec(l);
    if (sec) {
      flush();
      section = Number(sec[1]);
      buf.push(l.slice(sec[0].length));
      continue;
    }
    buf.push(l);
  }
  flush();
}

// Epictetus: sections are centered Roman numerals on their own line.
{
  const ls = lines("pg45109.txt");
  const start = ls.findIndex((l) => /^\s+I$/.test(l));
  const end = ls.findIndex((l) => l.startsWith("*** END OF THE PROJECT GUTENBERG"));
  let section = "";
  let buf = [];
  const flush = () => {
    for (const p of paragraphs(buf)) if (!/^\s*\[.*Ed\.\]\s*$/.test(p)) add("Epictetus", "Enchiridion, tr. T. W. Higginson (1865)", `Section ${section}`, p);
    buf = [];
  };
  for (const l of ls.slice(start, end)) {
    const m = /^\s+([IVXLC]+)(\[\d+\])?$/.exec(l);
    if (m) {
      flush();
      section = m[1];
      continue;
    }
    buf.push(l);
  }
  flush();
}

// Socrates, in Plato's Apology: the speech itself, after Jowett's introduction.
{
  const ls = lines("pg1656.txt");
  const start = ls.findIndex((l) => l.startsWith("How you, O Athenians"));
  const end = ls.findIndex((l) => l.startsWith("*** END OF THE PROJECT GUTENBERG"));
  paragraphs(ls.slice(start, end)).forEach((p, i) => add("Socrates", "Plato’s Apology, tr. Benjamin Jowett (1871)", `Paragraph ${i + 1}`, p));
}

// Seneca: two essays from the Minor Dialogues; chapters are lines like "II." or "I. [_Serenus._]".
{
  const ls = lines("pg64576.txt");
  const essays = [
    { title: "OF PEACE OF MIND.", name: "Of Peace of Mind" },
    { title: "OF THE SHORTNESS OF LIFE.", name: "Of the Shortness of Life" },
  ];
  for (const e of essays) {
    const start = ls.findIndex((l) => l.trim() === e.title);
    const end = ls.findIndex((l, i) => i > start && /^THE [A-Z]+ BOOK OF THE DIALOGUE/.test(l));
    let chapter = "I";
    let buf = [];
    const flush = () => {
      for (const p of paragraphs(buf)) add("Seneca", `${e.name}, tr. Aubrey Stewart (1889)`, `Chapter ${chapter}`, p);
      buf = [];
    };
    for (const l of ls.slice(start + 1, end)) {
      const m = /^([IVXL]+)\.(\s|$)/.exec(l);
      if (m) {
        flush();
        chapter = m[1];
        const rest = l.slice(m[0].length).replace(/\[_[^\]]*_\]/, "").trim();
        if (rest) buf.push(rest);
        continue;
      }
      buf.push(l);
    }
    flush();
  }
}

const out = join(root, "public", "data");
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "ancients.json"), JSON.stringify(passages));
const byAuthor = passages.reduce((m, p) => ((m[p.author] = (m[p.author] ?? 0) + 1), m), {});
console.log(`${passages.length} passages`, byAuthor);
