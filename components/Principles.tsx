import { principles } from "@/content/principles";

export function Principles() {
  return (
    <ol className="grid gap-4 md:grid-cols-2">
      {principles.map((p) => (
        <li key={p.n} id={`principle-${p.n}`} className="card card-hover flex scroll-mt-24 gap-4 p-5">
          <span
            className="grid size-9 shrink-0 place-items-center rounded-lg bg-blue/10 text-sm font-bold text-blue"
            aria-hidden="true"
          >
            {p.n}
          </span>
          <div>
            <h3 className="text-lg leading-snug">
              <span className="sr-only">Principle {p.n}: </span>
              {p.title}
            </h3>
            <p className="mt-1 text-soft">{p.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Inline citation used by case studies: links to the numbered principle on the About page. */
export function Cite({ n }: { n: number }) {
  const p = principles.find((x) => x.n === n);
  if (!p) throw new Error(`Unknown principle ${n}`);
  return (
    <a href={`/about#principle-${n}`} className="whitespace-nowrap text-sm" title={p.title}>
      principle {n}
    </a>
  );
}
