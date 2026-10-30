import type { Metadata } from "next";
import { PageHeader } from "@/components/Section";
import { TravelMap } from "@/components/maps/TravelMap";
import { formatMonth } from "@/content/experience";
import { smallPlaces, threeWordsIntro, travelEntries, travelIntro, visitedCountries, visitedStates } from "@/content/travel";
import { usMap, worldMap } from "@/lib/geo";

export const metadata: Metadata = {
  title: "Travel",
  description: "Around the world in three words: 22 countries and 25 states, each distilled into three words.",
  alternates: { canonical: "/travel" },
};

export default function TravelPage() {
  const world = worldMap(visitedCountries, smallPlaces);
  const us = usMap(visitedStates);
  const stateCount = visitedStates.filter((s) => s !== "District of Columbia").length;
  const countryCount = Object.keys(visitedCountries).length;

  return (
    <>
      <PageHeader title="Around the world in three words" intro={travelIntro} />

      <section className="sheet mt-10 grid items-start gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]" aria-label="Maps of places visited">
        <figure className="card p-5">
          <figcaption className="flex items-baseline justify-between gap-4">
            <span className="font-semibold">Countries</span>
            <span className="text-sm text-soft">
              <span className="text-2xl font-bold text-ink">{countryCount}</span> visited
            </span>
          </figcaption>
          <div className="mt-3">
            <TravelMap title={`World map: ${countryCount} countries visited`} {...world} />
          </div>
        </figure>
        <figure className="card p-5">
          <figcaption className="flex items-baseline justify-between gap-4">
            <span className="font-semibold">US states</span>
            <span className="text-sm text-soft">
              <span className="text-2xl font-bold text-ink">{stateCount}</span> of 50, plus DC
            </span>
          </figcaption>
          <div className="mt-3">
            <TravelMap title={`US map: ${stateCount} states visited`} {...us} />
          </div>
        </figure>
      </section>

      <section className="sheet mt-16" aria-labelledby="three-words">
        <h2 id="three-words" className="section-title">
          The series
        </h2>
        <p className="mt-3 max-w-[44rem] text-lg text-soft">{threeWordsIntro}</p>

        <ol className="mt-10 grid gap-5 md:grid-cols-2">
          {travelEntries.map((e) => (
            <li key={e.place + e.date} className="card card-hover overflow-hidden">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-stretch gap-4 p-3 [&::-webkit-details-marker]:hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={e.photo.src}
                    alt={e.country === e.place ? e.place : `${e.place}, ${e.country}`}
                    width={e.photo.width}
                    height={e.photo.height}
                    loading="lazy"
                    decoding="async"
                    className="h-28 w-24 shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-center py-1">
                    <div className="text-sm text-soft">
                      <span aria-hidden="true">{e.flag} </span>
                      {e.country === e.place ? "" : `${e.country}, `}
                      {formatMonth(e.date)}
                    </div>
                    <div className="mt-0.5 text-xl font-bold">{e.place}</div>
                    <div className="mt-1 font-medium text-blue">{e.words.join(", ")}</div>
                    <div className="mt-2 text-xs font-medium text-soft group-open:hidden">Read the story</div>
                  </div>
                </summary>
                <p className="px-5 pb-5 text-soft">{e.text}</p>
              </details>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
