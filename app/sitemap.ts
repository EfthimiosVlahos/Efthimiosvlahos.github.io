import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";
import { caseStudies } from "@/content/work";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${profile.revised}T00:00:00Z`);
  const paths = ["", "/about", "/experience", "/projects", "/skills", "/travel", ...caseStudies.map((c) => `/projects/${c.slug}`)];
  return paths.map((p) => ({
    url: `${profile.siteUrl}${p}`,
    lastModified,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : p.startsWith("/projects/") ? 0.8 : 0.6,
  }));
}
