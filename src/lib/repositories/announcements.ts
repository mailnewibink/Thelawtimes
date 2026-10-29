import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { demoAnnouncements } from "@/data/demo/announcements";
import type { Announcement, AnnouncementType } from "@/types/content";
import { sortByDateDesc } from "@/lib/utils";

interface DatabaseAnnouncementRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  content_type: string;
  status: string;
  is_demo: boolean;
  published_at: string | null;
}

function mapDatabaseAnnouncementToContent(row: DatabaseAnnouncementRow): Announcement {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    type: "Public Notice" as AnnouncementType,
    summary: row.excerpt || "",
    body: row.body ? row.body.split("\n\n") : [],
    publishedAt: row.published_at ? row.published_at.substring(0, 10) : "",
    relatedParty: null,
    document: null,
    provenance: {
      isDemo: row.is_demo,
      verification: row.is_demo ? "demo" : "verified",
      note: row.is_demo ? "Demo notice from database" : undefined,
    },
  };
}

export async function fetchPublishedAnnouncements(): Promise<Announcement[]> {
  if (!isSupabaseConfigured()) {
    return sortByDateDesc(demoAnnouncements, (a) => a.publishedAt);
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
        published_at
      `
      )
      .eq("content_type", "announcement")
      .eq("status", "published")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false });

    if (res.error) {
      console.error("[Repository:announcements] DB query error:", res.error.message);
      return sortByDateDesc(demoAnnouncements, (a) => a.publishedAt);
    }

    const data = res.data as unknown as DatabaseAnnouncementRow[] | null;
    if (!data || data.length === 0) {
      return sortByDateDesc(demoAnnouncements, (a) => a.publishedAt);
    }

    return data.map(mapDatabaseAnnouncementToContent);
  } catch (err) {
    console.error("[Repository:announcements] Failed to fetch announcements:", err);
    return sortByDateDesc(demoAnnouncements, (a) => a.publishedAt);
  }
}
