import type {
  Announcement,
  Article,
  ArticleSection,
  CaseRecord,
  Regulation,
} from "@/types/content";
import { fetchPublishedArticles, fetchArticleBySlug } from "./repositories/articles";
import { fetchPublicCases, fetchCaseBySlug } from "./repositories/cases";
import { fetchPublishedAnnouncements } from "./repositories/announcements";
import { fetchPublishedRegulations } from "./repositories/regulations";

/**
 * Content repository façade.
 *
 * This connects the presentation layer to the repository services.
 * When Supabase environment variables are provided, queries run through
 * Supabase PostgreSQL respecting Row Level Security (RLS).
 * When unconfigured, it seamlessly returns the verified demo dataset.
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
  const news = await getArticles("legal-news");
  return news.find((a) => a.featured) ?? news[0];
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
