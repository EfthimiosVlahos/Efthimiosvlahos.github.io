/**
 * The Off the clock page's facts and jokes. Facts are only what the owner has said about themselves (Oct 2026):
 * Greek American, lives on Long Island, three siblings, plays Sunday league soccer, supports Real Madrid,
 * loves the gym, studies math and physics for fun, reads philosophy, has been to Greece and Italy.
 * The owner asked for humor on this page; the jokes (ratings, quips) are obviously made up and labeled that way.
 */

export type PlanetId = "home" | "family" | "gym" | "soccer" | "physics" | "philosophy";

export interface Planet {
  id: PlanetId;
  name: string;
  /** One or two plain sentences shown when the planet is selected. */
  blurb: string;
  /** Section on this page, if the planet has one. */
  href?: string;
  /** Orbit radius in the diagram's units. Period follows Kepler: T ∝ a^1.5. */
  orbit: number;
  /** Starting angle on its orbit, degrees. */
  phase: number;
}

export const INTRO =
  "I’m a Greek American on Long Island, one of four siblings. Off the clock you’ll find me on a Sunday league pitch, in the gym (legs included), shouting at Real Madrid matches, or reading the Stoics to calm down after shouting at Real Madrid matches.";

export const PLANETS: Planet[] = [
  {
    id: "home",
    name: "Home",
    blurb: "Long Island, New York, run on Greek family rules: there is always more food, and nobody leaves hungry.",
    href: "#roots",
    orbit: 72,
    phase: 20,
  },
  {
    id: "family",
    name: "Family",
    blurb:
      "One of four siblings, so I learned negotiation, conflict resolution and eating fast long before any job asked me to. The four moons are us.",
    href: "#roots",
    orbit: 108,
    phase: 140,
  },
  {
    id: "soccer",
    name: "Soccer",
    blurb: "Sunday league on the weekend, Real Madrid the rest of the week. My hamstrings have opinions about the first one.",
    href: "#soccer",
    orbit: 144,
    phase: 250,
  },
  {
    id: "gym",
    name: "The gym",
    blurb: "I love lifting, and yes, I train legs. This planet comes with a calculator and a strict leg-day policy.",
    href: "#gym",
    orbit: 180,
    phase: 330,
  },
  {
    id: "physics",
    name: "Math & physics",
    blurb: "My degrees are in math and physics, and I still work through problems for fun. On purpose. Even these orbits obey Kepler’s third law.",
    href: "#physics",
    orbit: 216,
    phase: 80,
  },
  {
    id: "philosophy",
    name: "Philosophy",
    blurb: "The Stoics are my favorite company, especially after a late equalizer. Ask them anything below.",
    href: "#view-from-above",
    orbit: 252,
    phase: 190,
  },
];

/** Period in seconds for an orbit radius, scaled so the innermost planet takes about 14 s. */
export function period(orbit: number): number {
  const innermost = PLANETS[0]?.orbit ?? 72;
  return 14 * (orbit / innermost) ** 1.5;
}

/** A Sunday league scouting report: how I rate myself versus what the tape would say. All made up, on purpose. */
export interface ScoutingRow {
  skill: string;
  head: number;
  tape: number;
  note: string;
}

export const SCOUTING: ScoutingRow[] = [
  { skill: "Pace", head: 91, tape: 74, note: "Fast in my head. The tape adds context." },
  { skill: "Shooting", head: 93, tape: 70, note: "Every shot is going in, right up until it doesn’t." },
  { skill: "First touch", head: 88, tape: 79, note: "Better since the keepy-uppy practice below." },
  { skill: "Composure", head: 94, tape: 76, note: "Marcus Aurelius would be proud, until about the 89th minute." },
  { skill: "Work rate", head: 88, tape: 93, note: "The one stat where the tape is kinder than I am." },
  { skill: "Post-match appetite", head: 99, tape: 99, note: "Greek family training. Undefeated." },
];

/** Keepy-uppy reactions by number of touches; the first row whose minimum is met wins. */
export const KEEPY_QUIPS: { min: number; line: string }[] = [
  { min: 30, line: "Real Madrid scouts have been notified." },
  { min: 15, line: "That’s a starting spot this Sunday." },
  { min: 5, line: "The coach is nodding. Quietly." },
  { min: 1, line: "Solid first touch. Mostly." },
  { min: 0, line: "Even Sunday league has a warm-up. Go again." },
];

export function keepyQuip(touches: number): string {
  return KEEPY_QUIPS.find((q) => touches >= q.min)?.line ?? "";
}

/** The classic plate milestones (two, three and four plates a side), with a word on each lift. */
export const LIFTS = [
  { id: "bench", name: "Bench", lb: 225, kg: 100, quip: "The lift everyone asks about. Now go squat." },
  { id: "squat", name: "Squat", lb: 315, kg: 140, quip: "Leg day. Never skipped, occasionally regretted the next morning." },
  { id: "deadlift", name: "Deadlift", lb: 405, kg: 180, quip: "Picking heavy things up and putting them down. Stoicism for your back." },
] as const;
export type LiftId = (typeof LIFTS)[number]["id"];
