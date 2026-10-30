/**
 * A small, honest retrieval engine: tokenize, rewrite the query toward the corpus's vocabulary,
 * rank with BM25, then diversify so one author can't take every slot. It is the "R" in RAG,
 * runs entirely in the browser, and never calls a model.
 */

export interface Passage {
  id: string;
  author: string;
  work: string;
  /** Book, chapter or section label. */
  ref: string;
  text: string;
}

const STOPWORDS = new Set(
  (
    "a about above after again against all am an and any are as at be because been before being below between both but by " +
    "can could did do does doing down during each few for from further had has have having he her here hers herself him " +
    "himself his how i if in into is it its itself just me more most my myself no nor not now of off on once only or other " +
    "our ours ourselves out over own same she should so some such than that the their theirs them themselves then there " +
    "these they this those through to too under until up very was we were what when where which while who whom why will " +
    "with would you your yours yourself yourselves thou thee thy thine ye hath doth art unto upon shall also may must one " +
    "even let us man men thing things every actually really something anything deal get getting feel feels make way"
  ).split(" "),
);

/** Light, predictable stemming: enough to match "angry"/"anger" or "fears"/"fear" without a library. */
export function stem(word: string): string {
  let w = word;
  if (w.length > 5 && w.endsWith("ing")) w = w.slice(0, -3);
  else if (w.length > 4 && w.endsWith("ies")) w = `${w.slice(0, -3)}y`;
  else if (w.length > 4 && w.endsWith("ed")) w = w.slice(0, -2);
  else if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss") && !w.endsWith("us") && !w.endsWith("is")) w = w.slice(0, -1);
  if (w.length > 4 && w.endsWith("y")) w = w.slice(0, -1);
  return w;
}

/** Content words as typed, before stemming: what the interface shows a visitor. */
export function words(text: string): string[] {
  return (text.toLowerCase().match(/[a-z]+/g) ?? []).filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

export function tokenize(text: string): string[] {
  return words(text).map(stem);
}

/**
 * Query rewriting: modern words mapped to the vocabulary 2,000-year-old translations actually use.
 * Keys and values are written plainly and stemmed at load.
 */
const EXPANSIONS: Record<string, string[]> = {
  anxious: ["disturbed", "fear", "trouble", "tranquillity"],
  anxiety: ["disturbed", "fear", "trouble", "tranquillity"],
  stress: ["disturbed", "trouble", "tranquillity", "peace"],
  worry: ["disturbed", "fear", "future"],
  // Anger also pulls in the remedy the Stoics prescribe for it.
  anger: ["wrath", "passion", "mildness", "gentleness"],
  angry: ["anger", "wrath", "passion", "mildness", "gentleness"],
  mad: ["anger", "wrath"],
  rage: ["anger", "wrath"],
  criticism: ["blame", "reproach", "opinion", "insult"],
  criticize: ["blame", "reproach"],
  insult: ["reproach", "abuse", "offend"],
  death: ["die", "dying", "mortal"],
  dying: ["death", "die", "mortal"],
  job: ["work", "labour", "duty"],
  career: ["work", "labour", "duty", "office"],
  work: ["labour", "duty"],
  money: ["wealth", "riches", "poverty"],
  rich: ["wealth", "riches"],
  fail: ["misfortune", "failure", "fault"],
  failure: ["misfortune", "fault"],
  busy: ["time", "leisure", "occupied", "life"],
  procrastinate: ["delay", "time", "postpone"],
  happiness: ["happy", "good", "virtue", "tranquillity"],
  happy: ["happiness", "good", "virtue"],
  friend: ["friendship", "companion"],
  control: ["power", "within", "choice"],
  fame: ["reputation", "praise", "opinion", "glory"],
  famous: ["fame", "reputation", "glory"],
  grief: ["sorrow", "loss", "mourn", "tears"],
  loss: ["grief", "sorrow"],
  morning: ["rise", "sleep", "bed"],
  lazy: ["sleep", "bed", "rise", "work"],
  purpose: ["nature", "end", "duty"],
  meaning: ["nature", "end", "purpose"],
  time: ["life", "short", "hour"],
  // Translations differ in spelling ("neighbour" vs "neighbors"), so both are listed.
  people: ["others", "neighbour", "neighbor"],
  think: ["opinion", "judgment"],
  opinion: ["judgment", "think"],
  judge: ["opinion", "judgment", "blame"],
  annoying: ["offend", "troublesome", "busybody"],
  calm: ["tranquillity", "peace", "undisturbed"],
  peace: ["tranquillity", "calm", "undisturbed"],
  wisdom: ["wise", "philosophy", "knowledge"],
  space: ["universe", "heaven", "stars"],
  universe: ["whole", "nature", "heaven"],
  star: ["heaven", "universe"],
  truth: ["true", "falsehood"],
};

const STEMMED_EXPANSIONS = new Map<string, string[]>(
  Object.entries(EXPANSIONS).map(([k, vs]) => [stem(k), Array.from(new Set(vs.map(stem)))]),
);
/** Readable form of each expansion stem, for display. */
const EXPANSION_WORD = new Map<string, string>(Object.values(EXPANSIONS).flat().map((w) => [stem(w), w]));

export const EXPANSION_WEIGHT = 0.6;

export interface RewrittenQuery {
  /** Stems used for scoring. */
  original: string[];
  added: string[];
  /** The same terms as readable words, for display. */
  shownOriginal: string[];
  shownAdded: string[];
  weights: Map<string, number>;
}

export function rewriteQuery(query: string): RewrittenQuery {
  const typed = Array.from(new Set(words(query)));
  const original = Array.from(new Set(typed.map(stem)));
  const weights = new Map<string, number>(original.map((t) => [t, 1]));
  const added: string[] = [];
  for (const t of original) {
    for (const e of STEMMED_EXPANSIONS.get(t) ?? []) {
      if (!weights.has(e)) {
        weights.set(e, EXPANSION_WEIGHT);
        added.push(e);
      }
    }
  }
  return { original, added, shownOriginal: typed, shownAdded: added.map((s) => EXPANSION_WORD.get(s) ?? s), weights };
}

export interface Index {
  docs: { passage: Passage; tf: Map<string, number>; length: number }[];
  df: Map<string, number>;
  avgLength: number;
}

export function buildIndex(passages: Passage[]): Index {
  const df = new Map<string, number>();
  const docs = passages.map((passage) => {
    const tokens = tokenize(passage.text);
    const tf = new Map<string, number>();
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
    for (const t of tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);
    return { passage, tf, length: tokens.length };
  });
  const avgLength = docs.reduce((s, d) => s + d.length, 0) / Math.max(1, docs.length);
  return { docs, df, avgLength };
}

export interface Hit {
  passage: Passage;
  score: number;
  matched: string[];
}

const K1 = 1.2;
const B = 0.75;

export function search(index: Index, query: RewrittenQuery, k = 3, maxPerAuthor = 2): Hit[] {
  const n = index.docs.length;
  const scored: Hit[] = [];
  for (const d of index.docs) {
    let score = 0;
    const matched: string[] = [];
    for (const [term, weight] of query.weights) {
      const f = d.tf.get(term);
      if (!f) continue;
      const df = index.df.get(term) ?? 0;
      const idf = Math.log(1 + (n - df + 0.5) / (df + 0.5));
      score += weight * idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * d.length) / index.avgLength)));
      matched.push(term);
    }
    if (score > 0) scored.push({ passage: d.passage, score, matched });
  }
  scored.sort((a, b) => b.score - a.score);

  // Diversify: at most `maxPerAuthor` hits per author, so the answer is a conversation, not a monologue.
  const perAuthor = new Map<string, number>();
  const hits: Hit[] = [];
  for (const h of scored) {
    const used = perAuthor.get(h.passage.author) ?? 0;
    if (used >= maxPerAuthor) continue;
    perAuthor.set(h.passage.author, used + 1);
    hits.push(h);
    if (hits.length === k) break;
  }
  return hits;
}
