import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { profile } from "@/content/profile";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { themeScript } from "@/components/ThemeToggle";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

const title = `${profile.name}, applied AI engineer`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: title, template: `%s | ${profile.name}` },
  description: profile.description,
  authors: [{ name: profile.name, url: profile.siteUrl }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: profile.name,
    title,
    description: profile.description,
    url: "/",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description: profile.description },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/favicon.ico", sizes: "any" }],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#16162a" },
  ],
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Senior Machine Learning Engineer",
  description: profile.description,
  url: profile.siteUrl,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "New York", addressRegion: "NY", addressCountry: "US" },
  sameAs: [profile.linkedin, profile.github],
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Stony Brook University" },
    { "@type": "CollegeOrUniversity", name: "Hunter College, City University of New York" },
  ],
  knowsAbout: ["LLM agents", "LLM evaluation", "Machine learning engineering", "MLOps", "Document AI", "Retrieval-augmented generation"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </head>
      <body className="min-h-dvh bg-paper text-ink">
        <a
          href="#main"
          className="sr-only z-50 rounded-lg bg-ink px-3 py-2 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
