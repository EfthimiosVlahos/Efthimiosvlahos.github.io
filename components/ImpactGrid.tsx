import Link from "next/link";
import { results } from "@/content/results";

/** Headline results as cards: the figure, what it means, where, and how it was measured when known. */
export function ImpactGrid({ limit }: { limit?: number }) {
  const items = limit ? results.slice(0, limit) : results;
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((r) => (
        <li key={r.value + r.where} className="card card-hover flex flex-col p-6">
          <div className="gradient-text text-[2.6rem] leading-none font-extrabold tracking-tight">{r.value}</div>
          <p className="mt-3 font-medium text-ink">{r.result}</p>
          {r.note && <p className="mt-2 text-sm text-soft">{r.note}</p>}
          <p className="mt-auto pt-4 text-xs font-medium text-soft">
            {r.href ? (
              <Link href={r.href} className="text-soft no-underline hover:text-blue">
                {r.where}
              </Link>
            ) : (
              r.where
            )}
          </p>
        </li>
      ))}
    </ul>
  );
}
