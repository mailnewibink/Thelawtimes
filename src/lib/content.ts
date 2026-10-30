import type {
  Announcement,
  Article,
  ArticleSection,
  CaseRecord,
  PublicationType,
  Regulation,
} from "@/types/content";
import {
  fetchPublishedArticles,
  fetchArticleBySlug,
  fetchClientPublications,
  fetchGeneralNews,
  searchPublishedArticles,
} from "./repositories/articles";
import { fetchPublicCases, fetchCaseBySlug } from "./repositories/cases";
import { fetchPublishedAnnouncements } from "./repositories/announcements";
import { fetchPublishedRegulations } from "./repositories/regulations";
import { demoExternalNews, type ExternalNewsItem } from "@/data/demo/externalNews";
import { getSupabaseServerClient } from "./supabase/server";

export async function getExternalNews(limit = 10, category?: string): Promise<ExternalNewsItem[]> {
  try {
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      const query = (supabase as any)
        .from("source_records")
        .select("id, source_id, external_id, title, summary_abstract, canonical_url, source_date, metadata, sources(name)")
        .eq("record_type", "external_news")
        .order("source_date", { ascending: false })
        .limit(limit);

      const { data } = await query;
      if (data && data.length > 0) {
        return data.map((r: any) => ({
          id: r.id,
          sourceId: r.source_id,
          sourceName: r.sources?.name || r.metadata?.sourceName || "Sumber Resmi",
          title: r.title,
          summary: r.summary_abstract || "",
          canonicalUrl: r.canonical_url || "#",
          publishedAt: r.source_date || new Date().toISOString(),
          category: r.metadata?.category || "Berita Hukum",
          imageUrl: r.metadata?.imageUrl || null,
        }));
      }
    }
  } catch {
    // Fall back to demoExternalNews
  }

  let items = demoExternalNews;
  if (category) {
    items = items.filter((i) => i.category.toLowerCase().includes(category.toLowerCase()));
  }
  return items.slice(0, limit);
}

/**
 * Content repository façade.
 *
 * Connects the presentation layer to the repository services.
 * When Supabase environment variables are provided, queries run through
 * Supabase PostgreSQL respecting Row Level Security (RLS).
 * When unconfigured, it seamlessly returns the demo dataset.
 */

/* ------------------------------- Articles ------------------------------- */

export async function getArticles(section?: ArticleSection): Promise<Article[]> {
  return fetchPublishedArticles(section);
}

export async function getArticleBySlug(
  slug: string,
  section?: ArticleSection
): Promise<Article | undefined> {
  return fetchArticleBySlug(slug, section);
}

export async function getFeaturedArticle(): Promise<Article | undefined> {
  const news = await getArticles();
  return news.find((a) => a.featured) ?? news[0];
}

export async function getFeaturedClientPublication(): Promise<Article | undefined> {
  const clientPubs = await fetchClientPublications(5);
  return clientPubs.find((a) => a.featured) ?? clientPubs[0];
}

export async function getClientPublications(limit = 10): Promise<Article[]> {
  return fetchClientPublications(limit);
}

export async function getGeneralNews(limit = 10): Promise<Article[]> {
  return fetchGeneralNews(limit);
}

export async function searchArticles(options: {
  query?: string;
  category?: string;
  publicationType?: PublicationType;
  limit?: number;
  offset?: number;
}): Promise<{ articles: Article[]; total: number }> {
  return searchPublishedArticles(options);
}

export async function getArticlesBySlugs(slugs: string[]): Promise<Article[]> {
  const all = await getArticles();
  return all.filter((a) => slugs.includes(a.slug));
}

/* ----------------------------- Announcements ---------------------------- */

export async function getAnnouncements(): Promise<Announcement[]> {
  return fetchPublishedAnnouncements();
}

export async function getAnnouncementBySlug(slug: string): Promise<Announcement | undefined> {
  const all = await getAnnouncements();
  return all.find((a) => a.slug === slug);
}

export async function getAnnouncementsBySlugs(slugs: string[]): Promise<Announcement[]> {
  const all = await getAnnouncements();
  return all.filter((a) => slugs.includes(a.slug));
}

/* --------------------------------- Cases -------------------------------- */

export async function getCases(): Promise<CaseRecord[]> {
  return fetchPublicCases();
}

export async function getCaseBySlug(slug: string): Promise<CaseRecord | undefined> {
  return fetchCaseBySlug(slug);
}

/* ------------------------------ Regulations ----------------------------- */

export async function getRegulations(): Promise<Regulation[]> {
  return fetchPublishedRegulations();
}

export async function getRegulationBySlug(slug: string): Promise<Regulation | undefined> {
  const all = await getRegulations();
  return all.find((r) => r.slug === slug);
}

/* ------------------------------- Taxonomies ----------------------------- */

export const LEGAL_NEWS_CATEGORIES = [
  "Courts",
  "Legislation",
  "Business Law",
  "Criminal Law",
  "Civil Law",
  "Legal Profession",
] as const;

export const IP_CATEGORIES = [
  "Trademarks",
  "Copyright",
  "Patents",
  "Industrial Designs",
  "Other IP",
] as const;

export const CASE_CATEGORIES = [
  "Civil",
  "Commercial",
  "Bankruptcy & PKPU",
  "Intellectual Property",
  "Administrative",
  "Industrial Relations",
] as const;

export const ANNOUNCEMENT_TYPES = [
  "Court Summons Notice",
  "Bankruptcy Notice",
  "Corporate Notice",
  "Public Notice",
  "Auction Notice",
] as const;

export const REGULATION_TYPES = [
  "Law",
  "Government Regulation",
  "Presidential Regulation",
  "Ministerial Regulation",
  "Agency Regulation",
  "Regional Regulation",
] as const;
