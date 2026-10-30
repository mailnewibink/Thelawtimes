import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { demoArticles } from "@/data/demo/articles";
import type { Article, ArticleSection, ArticleCategory, PublicationType } from "@/types/content";
import { sortByDateDesc } from "@/lib/utils";

interface DatabaseArticleRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  content_type: string;
  publication_type?: string | null;
  status: string;
  is_demo: boolean;
  featured_image_path: string | null;
  published_at: string | null;
  updated_at: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  source_name?: string | null;
  source_url?: string | null;
  document_url?: string | null;
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

export function isDummyArticle(item?: { id?: string; slug?: string; title?: string; headline?: string } | null): boolean {
  if (!item) return false;
  const s = (item.slug || "").toLowerCase();
  const t = (item.title || item.headline || "").toLowerCase();
  const id = item.id || "";
  return (
    id.startsWith("a0000000-") ||
    s.includes("a-readers-guide") ||
    s.includes("readers-guide") ||
    s.includes("sample-primer") ||
    s.includes("understanding-trademark-classes") ||
    t.includes("reader's guide") ||
    t.includes("reader’s guide") ||
    t.includes("sample primer") ||
    t.includes("fictional lead") ||
    t.includes("fictional primer")
  );
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

  // Derive publicationType: client_publication vs general_news
  const publicationType: PublicationType =
    row.publication_type === "client_publication" ||
    row.publication_type === "general_news"
      ? (row.publication_type as PublicationType)
      : ["announcement", "case_summary"].includes(row.content_type)
      ? "client_publication"
      : "general_news";

  return {
    id: row.id,
    slug: row.slug,
    section,
    category: categoryName,
    publicationType,
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
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    sourceName: row.source_name || sources[0]?.publisher || null,
    sourceUrl: row.source_url || sources[0]?.url || null,
    documentUrl: row.document_url || null,
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
        publication_type,
        status,
        is_demo,
        featured_image_path,
        published_at,
        updated_at,
        seo_title,
        seo_description,
        source_name,
        source_url,
        document_url,
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

    let res = await query;
    if (res.error && res.error.message.includes("publication_type")) {
      // Remote Supabase hasn't executed migration 00006 yet: retry gracefully with baseline schema
      let fallbackQuery = supabase
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
        fallbackQuery = fallbackQuery.eq("content_type", "intellectual_property");
      } else if (section === "legal-news") {
        fallbackQuery = fallbackQuery.neq("content_type", "intellectual_property");
      }
      res = await fallbackQuery;
    }

    if (res.error) {
      console.error("[Repository:articles] Database query error:", res.error.message);
      const items = section ? demoArticles.filter((a) => !isDummyArticle(a) && a.section === section) : demoArticles.filter((a) => !isDummyArticle(a));
      return sortByDateDesc(items, (a) => a.publishedAt);
    }

    const data = res.data as unknown as DatabaseArticleRow[] | null;
    const dbArticles = (data || [])
      .filter((r) => !isDummyArticle(r))
      .map(mapDatabaseArticleToContent);

    // Merge with real verified editorial articles so authentic Indonesian content is always present
    const combined: Article[] = [...dbArticles];
    const seenSlugs = new Set(combined.map((a) => a.slug));
    for (const demoArt of demoArticles) {
      if (!isDummyArticle(demoArt) && !seenSlugs.has(demoArt.slug)) {
        combined.push(demoArt);
        seenSlugs.add(demoArt.slug);
      }
    }

    const items = section ? combined.filter((a) => a.section === section) : combined;
    return sortByDateDesc(items, (a) => a.publishedAt);
  } catch (err) {
    console.error("[Repository:articles] Connection exception:", err);
    const items = section ? demoArticles.filter((a) => !isDummyArticle(a) && a.section === section) : demoArticles.filter((a) => !isDummyArticle(a));
    return sortByDateDesc(items, (a) => a.publishedAt);
  }
}

export async function fetchArticleBySlug(
  slug: string,
  section?: ArticleSection
): Promise<Article | undefined> {
  if (isDummyArticle({ slug })) {
    return undefined;
  }

  if (!isSupabaseConfigured()) {
    return demoArticles.find((a) => !isDummyArticle(a) && a.slug === slug && (!section || a.section === section));
  }

  try {
    const supabase = await getSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    let res = await supabase
      .from("articles")
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        body,
        content_type,
        publication_type,
        status,
        is_demo,
        featured_image_path,
        published_at,
        updated_at,
        seo_title,
        seo_description,
        source_name,
        source_url,
        document_url,
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

    if (res.error && res.error.message.includes("publication_type")) {
      res = await supabase
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
    }

    if (res.error || !res.data || isDummyArticle(res.data as any)) {
      return demoArticles.find((a) => !isDummyArticle(a) && a.slug === slug && (!section || a.section === section));
    }

    const item = mapDatabaseArticleToContent(res.data as unknown as DatabaseArticleRow);
    if (section && item.section !== section) {
      return undefined;
    }
    return item;
  } catch {
    return demoArticles.find((a) => a.slug === slug && (!section || a.section === section));
  }
}

/**
 * Fetches published client case publications with high priority.
 */
export async function fetchClientPublications(limit = 10): Promise<Article[]> {
  const all = await fetchPublishedArticles();
  const clientPubs = all.filter((a) => a.publicationType === "client_publication");
  if (clientPubs.length > 0) {
    return clientPubs.slice(0, limit);
  }
  // Fallback in demo mode: return articles flagged as client_publication or top demo items
  return all.slice(0, limit);
}

/**
 * Fetches general legal news publications.
 */
export async function fetchGeneralNews(limit = 10): Promise<Article[]> {
  const all = await fetchPublishedArticles();
  const news = all.filter((a) => a.publicationType === "general_news");
  if (news.length > 0) {
    return news.slice(0, limit);
  }
  return all.slice(0, limit);
}

/**
 * Practical search and category filtering for published public articles only.
 */
export async function searchPublishedArticles(options: {
  query?: string;
  category?: string;
  publicationType?: PublicationType;
  limit?: number;
  offset?: number;
}): Promise<{ articles: Article[]; total: number }> {
  const limit = options.limit ?? 12;
  const offset = options.offset ?? 0;

  const all = await fetchPublishedArticles();

  let filtered = all;

  if (options.publicationType) {
    filtered = filtered.filter((a) => a.publicationType === options.publicationType);
  }

  if (options.category && options.category !== "all") {
    const catLower = options.category.toLowerCase();
    filtered = filtered.filter((a) => a.category.toLowerCase() === catLower);
  }

  if (options.query && options.query.trim().length > 0) {
    const q = options.query.toLowerCase().trim();
    filtered = filtered.filter(
      (a) =>
        a.headline.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.body.some((p) => p.toLowerCase().includes(q))
    );
  }

  const total = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);

  return {
    articles: paginated,
    total,
  };
}
