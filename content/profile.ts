export const profile = {
  name: "Efthimios Vlahos",
  givenName: "Efthimios",
  familyName: "Vlahos",
  role: "Applied AI engineer",
  /** Shown under the name in the hero: what I do, not a job title. */
  positioning: "Applied AI engineer and architect",
  location: "New York, NY",
  email: "vlahos89@gmail.com",
  linkedin: "https://www.linkedin.com/in/efthimios-vlahos/",
  github: "https://github.com/EfthimiosVlahos",
  resume: "/Efthimios_Vlahos_Resume.pdf",
  siteUrl: "https://evlahos.netlify.app",
  /** Shown in the footer title block; bump when content changes. */
  revised: "2026-10-30",

  headline:
    "I build LLM agents, and the evals, guardrails and operations that take them from demo to production, working directly with the people who own the problem.",
  intro:
    "Six years shipping machine learning in insurance, energy, manufacturing and enterprise software. I'm a senior ML engineer at Alliant Insurance Services and co-founder of Pyxeon, where agents write, test and ship software for small businesses.",

  bestWork:
    "The part of the work I enjoy most is between the demo and production: sitting with the people who own the problem until it is precisely defined, then building the system and staying accountable for it once it ships.",
  bestFit: ["forward-deployed engineering", "AI architecture", "standing up an AI practice from the first system"],

  description:
    "Efthimios Vlahos is an applied AI engineer in New York who builds LLM agents, evaluation pipelines and production ML systems in regulated industries.",
} as const;

export type Profile = typeof profile;
