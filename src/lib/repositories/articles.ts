import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { demoArticles } from "@/data/demo/articles";
import type { Article, ArticleSection, ArticleCategory } from "@/types/content";
import { sortByDateDesc } from "@/lib/utils";

interface DatabaseArticleRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  content_type: string;
  status: string;
  is_demo: boolean;
  featured_image_path: string | null;
  published_at: string | null;
  updated_at: string | null;
  article_categories: Array<{
    categories: { name: string; slug: string } | null;
  }>;
  article_sources: Array<{
    citation_note: string | null;
    source_records: {
      title: string;
      canonical_url: string | null;
      source_date: string | null;
      sources: { name: string } | null;
    } | null;
  }>;
}

/**
 * Maps a Supabase article row and joined relations to the frontend Article model.
 */
function mapDatabaseArticleToContent(row: DatabaseArticleRow): Article {
  const categoryName = (row.article_categories?.[0]?.categories?.name as ArticleCategory) || "Courts";
  const sources = (row.article_sources || []).map((as) => ({
    label: as.citation_note || as.source_records?.title || "Official Source",
    publisher: as.source_records?.sources?.name || null,
    url: as.source_records?.canonical_url || null,
    accessedOn: as.source_records?.source_date || null,
  }));

  const isIP = row.content_type === "intellectual_property";
  const section: ArticleSection = isIP ? "intellectual-property" : "legal-news";

  return {
    id: row.id,
    slug: row.slug,
    section,
    category: categoryName,
    headline: row.title,
    deck: row.excerpt || undefined,
    excerpt: row.excerpt || "",
    body: row.body ? row.body.split("\n\n") : [],
    publishedAt: row.published_at ? row.published_at.substring(0, 10) : "",
    updatedAt: row.updated_at ? row.updated_at.substring(0, 10) : null,
    byline: "The Law Times Desk",
    image: row.featured_image_path
      ? {
          src: row.featured_image_path,
          alt: row.title,
        }
      : undefined,
    sources,
    featured: false,
    provenance: {
      isDemo: row.is_demo,
      verification: row.is_demo ? "demo" : "verified",
      note: row.is_demo ? "Demo record from database" : undefined,
    },
  };
}

export async function fetchPublishedArticles(section?: ArticleSection): Promise<Article[]> {
  if (!isSupabaseConfigured()) {
    const items = section
      ? demoArticles.filter((a) => a.section === section)
      : demoArticles;
    return sortByDateDesc(items, (a) => a.publishedAt);
  }

  try {
    const supabase = await getSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    let query = supabase
      .from("articles")
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        body,
        content_type,
        status,
        is_demo,
        featured_image_path,
        published_at,
        updated_at,
        article_categories (
          categories (name, slug)
        ),
        article_sources (
          citation_note,
          source_records (
            title,
            canonical_url,
            source_date,
            sources (name)
          )
        )
      `
      )
      .eq("status", "published")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false });

    if (section === "intellectual-property") {
      query = query.eq("content_type", "intellectual_property");
    } else if (section === "legal-news") {
      query = query.neq("content_type", "intellectual_property");
    }

    const res = await query;
    if (res.error) {
      console.error("[Repository:articles] Database query error:", res.error.message);
      return section ? demoArticles.filter((a) => a.section === section) : demoArticles;
    }

    const data = res.data as unknown as DatabaseArticleRow[] | null;
    if (!data || data.length === 0) {
      const items = section ? demoArticles.filter((a) => a.section === section) : demoArticles;
      return sortByDateDesc(items, (a) => a.publishedAt);
    }

    return data.map(mapDatabaseArticleToContent);
  } catch (err) {
    console.error("[Repository:articles] Connection exception:", err);
    return section ? demoArticles.filter((a) => a.section === section) : demoArticles;
  }
}

export async function fetchArticleBySlug(
  slug: string,
  section?: ArticleSection
): Promise<Article | undefined> {
  if (!isSupabaseConfigured()) {
    return demoArticles.find(
      (a) => a.slug === slug && (!section || a.section === section)
    );
  }

  try {
    const supabase = await getSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const res = await supabase
      .from("articles")
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        body,
        content_type,
        status,
        is_demo,
        featured_image_path,
        published_at,
        updated_at,
        article_categories (
          categories (name, slug)
        ),
        article_sources (
          citation_note,
          source_records (
            title,
            canonical_url,
            source_date,
            sources (name)
          )
        )
      `
      )
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (res.error || !res.data) {
      return demoArticles.find(
        (a) => a.slug === slug && (!section || a.section === section)
      );
    }

    const row = res.data as unknown as DatabaseArticleRow;
    return mapDatabaseArticleToContent(row);
  } catch (err) {
    console.error("[Repository:articles] Failed to fetch article by slug:", err);
    return demoArticles.find(
      (a) => a.slug === slug && (!section || a.section === section)
    );
  }
}
