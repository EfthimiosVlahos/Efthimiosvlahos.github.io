import { profile } from "@/content/profile";

const ICONS = {
  email: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  ),
  github: (
    <path
      fill="currentColor"
      d="M12 0c-6.63 0-12 5.37-12 12 0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.73-4.03-1.42-4.03-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.31.76-1.6-2.67-.31-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.69.8.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"
    />
  ),
  linkedin: (
    <path
      fill="currentColor"
      d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"
    />
  ),
};

export function SocialLinks({ size = "md" }: { size?: "sm" | "md" }) {
  const cls = size === "sm" ? "size-5" : "size-6";
  const links = [
    { href: `mailto:${profile.email}`, label: "Email", icon: ICONS.email },
    { href: profile.github, label: "GitHub", icon: ICONS.github },
    { href: profile.linkedin, label: "LinkedIn", icon: ICONS.linkedin },
  ];
  return (
    <ul className="flex items-center gap-5">
      {links.map((l) => (
        <li key={l.label}>
          <a href={l.href} aria-label={l.label} title={l.label} className="text-soft transition-colors hover:text-blue">
            <svg viewBox="0 0 24 24" className={cls} aria-hidden="true">
              {l.icon}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
