/**
 * One-rep-max estimates from a set of reps. The two classic formulas give exactly the same answer at
 * ten reps (4/3 of the weight) and drift apart on either side, fastest at high reps, which is why both are shown.
 */

/** Epley (1985): 1RM = w · (1 + r / 30). */
export function epley(weight: number, reps: number): number {
  if (reps <= 1) return weight;
  return weight * (1 + reps / 30);
}

/** Brzycki (1993): 1RM = w · 36 / (37 − r). Only meaningful well below 37 reps. */
export function brzycki(weight: number, reps: number): number {
  if (reps <= 1) return weight;
  if (reps >= 37) throw new Error("Brzycki is undefined at 37 reps or more");
  return (weight * 36) / (37 - reps);
}

/** What the same 1RM predicts you could lift for each rep count (inverting each formula). */
export function repMaxes(oneRepMax: number, maxReps = 12): { reps: number; epley: number; brzycki: number }[] {
  return Array.from({ length: maxReps }, (_, i) => {
    const r = i + 1;
    return {
      reps: r,
      epley: r === 1 ? oneRepMax : oneRepMax / (1 + r / 30),
      brzycki: r === 1 ? oneRepMax : (oneRepMax * (37 - r)) / 36,
    };
  });
}

/** Round to the nearest plate-loadable increment (5 lb or 2.5 kg). */
export function toPlates(weight: number, unit: "lb" | "kg"): number {
  const inc = unit === "lb" ? 5 : 2.5;
  return Math.round(weight / inc) * inc;
}
