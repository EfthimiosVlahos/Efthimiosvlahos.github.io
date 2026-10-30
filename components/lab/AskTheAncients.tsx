"use client";

import { useRef, useState, type FormEvent } from "react";
import { buildIndex, rewriteQuery, search, stem, type Hit, type Index, type Passage, type RewrittenQuery } from "@/lib/retrieval";

const SUGGESTIONS = [
  "What can the stars teach me?",
  "Does any of this matter in the grand scheme of the universe?",
  "I hate getting out of bed in the morning",
  "How do I stop worrying about what people think?",
  "What is actually within my control?",
  "How should I deal with anger?",
  "Is death something to fear?",
  "Life feels too short and too busy",
];

interface Answer {
  query: RewrittenQuery;
  hits: Hit[];
  ms: number;
}

/** Highlight words whose stem matched the query, so the ranking explains itself. */
function Highlighted({ text, matched }: { text: string; matched: string[] }) {
  const set = new Set(matched);
  return (
    <>
      {text.split(/([A-Za-z]+)/).map((part, i) =>
        /^[A-Za-z]+$/.test(part) && set.has(stem(part.toLowerCase())) ? (
          <mark key={i} className="rounded bg-blue/15 px-0.5 text-ink">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export function AskTheAncients() {
  const index = useRef<Index | null>(null);
  const [status, setStatus] = useState<"cold" | "loading" | "ready" | "error">("cold");
  const [size, setSize] = useState(0);
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);

  // The corpus (~170 KB compressed) loads on first interaction, never on page load.
  const ensureIndex = async (): Promise<Index | null> => {
    if (index.current) return index.current;
    setStatus("loading");
    try {
      const res = await fetch("/data/ancients.json");
      if (!res.ok) throw new Error(`corpus request failed: ${res.status}`);
      const passages = (await res.json()) as Passage[];
      index.current = buildIndex(passages);
      setSize(passages.length);
      setStatus("ready");
      return index.current;
    } catch (err) {
      console.error("Ask the ancients: could not load the corpus", err);
      setStatus("error");
      return null;
    }
  };

  const ask = async (q: string) => {
    const query = q.trim();
    if (!query) return;
    setText(query);
    const idx = await ensureIndex();
    if (!idx) return;
    const t0 = performance.now();
    const rewritten = rewriteQuery(query);
    const hits = search(idx, rewritten, 3, 2);
    setAnswer({ query: rewritten, hits, ms: performance.now() - t0 });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void ask(text);
  };

  const top = answer?.hits[0]?.score ?? 1;

  return (
    <div className="card overflow-hidden">
      <div className="p-5 sm:p-7">
        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row" role="search">
          <label htmlFor="ancients-q" className="sr-only">
            Ask the ancients a question
          </label>
          <input
            id="ancients-q"
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => void ensureIndex()}
            placeholder="Ask anything, e.g. how do I stop worrying about the future?"
            className="min-w-0 flex-1 rounded-full border border-rule bg-paper px-5 py-3 text-ink placeholder:text-soft focus:border-blue focus:outline-none"
          />
          <button type="submit" className="btn btn-primary justify-center">
            Ask
          </button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Example questions">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => void ask(s)}
              className="rounded-full border border-rule bg-raised px-3 py-1.5 text-sm text-soft transition-colors hover:border-blue hover:text-blue"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-rule bg-sunken/60 p-5 sm:p-7" aria-live="polite">
        {status === "loading" && <p className="text-sm text-soft">Loading the library…</p>}
        {status === "error" && <p className="text-sm text-red">The library didn’t load. Check your connection and try again.</p>}
        {status !== "loading" && status !== "error" && !answer && (
          <p className="text-sm text-soft">
            Pick a question or write your own. The answer comes from the texts themselves, with the reasoning shown.
          </p>
        )}

        {answer && (
          <div className="space-y-6">
            <ol className="grid gap-3 text-sm md:grid-cols-4" aria-label="How the answer was found">
              <li className="rounded-xl border border-rule bg-paper p-3">
                <div className="text-xs font-semibold text-blue">1. Tokens</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {answer.query.shownOriginal.length ? (
                    answer.query.shownOriginal.map((t) => (
                      <span key={t} className="chip font-mono">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-soft">only stopwords</span>
                  )}
                </div>
              </li>
              <li className="rounded-xl border border-rule bg-paper p-3">
                <div className="text-xs font-semibold text-blue">2. Query rewrite</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {answer.query.shownAdded.length ? (
                    answer.query.shownAdded.map((t) => (
                      <span key={t} className="chip border-dashed font-mono">
                        +{t}
                      </span>
                    ))
                  ) : (
                    <span className="text-soft">no rewrite needed</span>
                  )}
                </div>
              </li>
              <li className="rounded-xl border border-rule bg-paper p-3">
                <div className="text-xs font-semibold text-blue">3. BM25 ranking</div>
                <p className="mt-2 text-soft">
                  {size.toLocaleString("en-US")} passages scored in {answer.ms < 1 ? "<1" : Math.round(answer.ms)} ms
                </p>
              </li>
              <li className="rounded-xl border border-rule bg-paper p-3">
                <div className="text-xs font-semibold text-blue">4. Diversify</div>
                <p className="mt-2 text-soft">Top 3, at most two per author</p>
              </li>
            </ol>

            {answer.hits.length === 0 ? (
              <p className="text-soft">Nothing matched. Try plainer words, like “fear”, “anger” or “death”.</p>
            ) : (
              <ul className="space-y-4">
                {answer.hits.map((h) => (
                  <li key={h.passage.id} className="rounded-2xl border border-rule bg-paper p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <div>
                        <span className="font-semibold">{h.passage.author}</span>
                        <span className="text-sm text-soft">
                          {", "}
                          {h.passage.work}, {h.passage.ref}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-soft" title="BM25 score relative to the top result">
                        <span className="h-1.5 w-20 overflow-hidden rounded-full bg-sunken" aria-hidden="true">
                          <span className="block h-full rounded-full bg-blue-strong" style={{ width: `${(h.score / top) * 100}%` }} />
                        </span>
                        <span className="font-mono tabular-nums">score {h.score.toFixed(1)}</span>
                      </div>
                    </div>
                    <blockquote className="mt-3 text-[1.05rem] leading-relaxed">
                      <Highlighted text={h.passage.text} matched={h.matched} />
                    </blockquote>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
