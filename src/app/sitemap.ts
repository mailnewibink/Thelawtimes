import type { MetadataRoute } from "next";
import { siteConfig, staticRoutes } from "@/lib/site-config";
import { getArticles, getCases } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, cases] = await Promise.all([
    getArticles(),
    getCases(),
  ]);

  const baseUrls: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date("2026-10-29"),
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1.0 : 0.8,
  }));

  const articleUrls: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${siteConfig.url}/artikel/${a.slug}`,
    lastModified: new Date(a.updatedAt ?? a.publishedAt),
    changeFrequency: "monthly",
    priority: a.publicationType === "client_publication" ? 0.9 : 0.7,
  }));

  const caseUrls: MetadataRoute.Sitemap = cases.map((c) => ({
    url: `${siteConfig.url}/case-archive/${c.slug}`,
    lastModified: new Date(c.lastUpdated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...baseUrls, ...articleUrls, ...caseUrls];
}
