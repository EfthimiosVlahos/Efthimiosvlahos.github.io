"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

/** Runs in <head> before paint so the page never flashes the wrong theme. */
export const themeScript = `(() => {
  document.documentElement.classList.add("js");
  try {
    const stored = localStorage.getItem("theme");
    // Dark navy is the site's identity, so it is the default until a visitor picks light.
    document.documentElement.dataset.theme = stored === "light" ? "light" : "dark";
  } catch (e) {
    document.documentElement.dataset.theme = "dark";
  }
})();`;

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function ThemeToggle() {
  // Server render has no theme; the button label settles on hydration without a mismatch warning.
  const theme = useSyncExternalStore<Theme | null>(subscribe, currentTheme, () => null);
  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("theme", next);
        } catch {
          // Private mode: the choice lasts for this page view only.
        }
      }}
      className="inline-grid size-9 place-items-center rounded-lg text-soft transition-colors hover:bg-raised hover:text-blue"
      aria-label={theme ? `Switch to ${next} mode` : "Switch color mode"}
      title={theme ? `Switch to ${next} mode` : "Switch color mode"}
    >
      {theme === "light" ? (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      )}
    </button>
  );
}
