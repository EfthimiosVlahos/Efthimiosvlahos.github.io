import Link from "next/link";
import { profile } from "@/content/profile";
import { SocialLinks } from "./SocialLinks";

export function SiteFooter() {
  const year = profile.revised.slice(0, 4);
  return (
    <footer className="no-print mt-28 border-t border-rule">
      <div className="sheet flex flex-col gap-4 py-8 text-sm text-soft sm:flex-row sm:items-center sm:justify-between">
        <SocialLinks size="sm" />
        <p>
          Off the clock: <Link href="/off-the-clock">ask the Stoics, or take a shot</Link>.
        </p>
        <p>© {year} {profile.name}</p>
      </div>
    </footer>
  );
}
