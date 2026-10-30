/**
 * The Off the clock page's facts. Only what the owner has said about themselves (Oct 2026):
 * Greek American, lives on Long Island, three siblings, plays Sunday league soccer, supports Real Madrid,
 * loves the gym, studies math and physics for fun, reads philosophy, has been to Greece and Italy.
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
  "I’m a Greek American living on Long Island, one of four siblings. Off the clock I play Sunday league soccer, support Real Madrid, lift, read philosophy, and study math and physics for fun.";

export const PLANETS: Planet[] = [
  { id: "home", name: "Home", blurb: "Greek American, living on Long Island, New York.", href: "#roots", orbit: 72, phase: 20 },
  { id: "family", name: "Family", blurb: "One of four siblings. The four moons are us.", href: "#roots", orbit: 108, phase: 140 },
  { id: "soccer", name: "Soccer", blurb: "I play for a Sunday league team and support Real Madrid.", href: "#soccer", orbit: 144, phase: 250 },
  { id: "gym", name: "The gym", blurb: "I love lifting. This planet comes with a calculator.", href: "#gym", orbit: 180, phase: 330 },
  {
    id: "physics",
    name: "Math & physics",
    blurb: "What I study for fun, and what my degrees are in. These orbits obey Kepler’s third law.",
    href: "#physics",
    orbit: 216,
    phase: 80,
  },
  { id: "philosophy", name: "Philosophy", blurb: "I love reading philosophy. Ask the ancients a question below.", href: "#view-from-above", orbit: 252, phase: 190 },
];

/** Period in seconds for an orbit radius, scaled so the innermost planet takes about 14 s. */
export function period(orbit: number): number {
  const innermost = PLANETS[0]?.orbit ?? 72;
  return 14 * (orbit / innermost) ** 1.5;
}
