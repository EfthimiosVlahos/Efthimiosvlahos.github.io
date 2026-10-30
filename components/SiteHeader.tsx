"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { profile } from "@/content/profile";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Me" },
  { href: "/experience", label: "Professional Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills & Certifications" },
  { href: "/off-the-clock", label: "Off the Clock" },
] as const;

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Monogram({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-grid place-items-center rounded-lg bg-gradient-to-br from-blue-strong to-violet font-bold tracking-tight text-white shadow-[0_6px_20px_-6px_var(--glow)] ${className}`}
      aria-hidden="true"
    >
      EV
    </span>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (href: string) =>
    `rounded-lg px-3 py-2 text-sm font-medium no-underline transition-colors ${
      isActive(pathname, href) ? "bg-blue/10 text-blue" : "text-soft hover:bg-raised hover:text-ink"
    }`;

  return (
    <header className="no-print sticky top-0 z-40 border-b border-rule bg-paper/80 backdrop-blur-md">
      <div className="sheet flex h-16 items-center justify-between gap-4">
        {/* The visible name is the link's accessible name (WCAG 2.5.3); on phones it stays for screen readers only. */}
        <Link href="/" className="group flex items-center gap-3 text-ink no-underline">
          <Monogram className="size-9 text-sm" />
          <span className="sr-only text-lg font-semibold transition-colors group-hover:text-blue sm:not-sr-only">{profile.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)} aria-current={isActive(pathname, item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
          <span className="ml-2 border-l border-rule pl-2">
            <ThemeToggle />
          </span>
        </nav>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="inline-grid size-9 place-items-center rounded-lg text-soft hover:bg-raised hover:text-ink"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              {open ? (
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-rule bg-paper lg:hidden">
          <div className="sheet space-y-1 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block ${linkClass(item.href)} text-base`}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
