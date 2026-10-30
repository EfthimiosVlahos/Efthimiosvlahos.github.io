/** Real Madrid's European Cup / Champions League wins: fifteen, the most of any club (as of 2026). */
export interface EuropeanCup {
  year: number;
  opponent: string;
  score: string;
  note?: string;
}

export const EUROPEAN_CUPS: EuropeanCup[] = [
  { year: 1956, opponent: "Stade de Reims", score: "4–3", note: "The first European Cup final ever played." },
  { year: 1957, opponent: "Fiorentina", score: "2–0" },
  { year: 1958, opponent: "AC Milan", score: "3–2 after extra time" },
  { year: 1959, opponent: "Stade de Reims", score: "2–0" },
  { year: 1960, opponent: "Eintracht Frankfurt", score: "7–3", note: "Five in a row, Di Stéfano and Puskás." },
  { year: 1966, opponent: "Partizan", score: "2–1" },
  { year: 1998, opponent: "Juventus", score: "1–0", note: "The Séptima, 32 years after the sixth." },
  { year: 2000, opponent: "Valencia", score: "3–0" },
  { year: 2002, opponent: "Bayer Leverkusen", score: "2–1", note: "Zidane’s volley at Hampden Park." },
  { year: 2014, opponent: "Atlético Madrid", score: "4–1 after extra time", note: "La Décima, after Ramos’s 93rd-minute header." },
  { year: 2016, opponent: "Atlético Madrid", score: "1–1, won on penalties" },
  { year: 2017, opponent: "Juventus", score: "4–1" },
  { year: 2018, opponent: "Liverpool", score: "3–1", note: "Three in a row, with Bale’s overhead kick." },
  { year: 2022, opponent: "Liverpool", score: "1–0" },
  { year: 2024, opponent: "Borussia Dortmund", score: "2–0", note: "The fifteenth." },
];
