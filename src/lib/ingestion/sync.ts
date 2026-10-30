import { parseRssFeed } from "./rss";
import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";

export interface SyncResult {
  sourceId: string;
  sourceName: string;
  success: boolean;
  totalFetched: number;
  newInserted: number;
  error?: string;
}

/**
 * Synchronizes an external RSS/Atom news feed into the database.
 * Prevents duplicates using canonicalUrl and externalId.
 */
export async function syncExternalNewsSource(sourceId: string): Promise<SyncResult> {
  const supabase = getSupabaseAdminClient() || (await getSupabaseServerClient());

  if (!supabase) {
    return {
      sourceId,
      sourceName: "Local",
      success: false,
      totalFetched: 0,
      newInserted: 0,
      error: "Supabase client tidak tersedia.",
    };
  }

  // 1. Fetch Source Details
  const { data: source, error: srcErr } = await (supabase as any)
    .from("sources")
    .select("*")
    .eq("id", sourceId)
    .single();

  if (srcErr || !source) {
    return {
      sourceId,
      sourceName: "Unknown",
      success: false,
      totalFetched: 0,
      newInserted: 0,
      error: "Sumber tidak ditemukan.",
    };
  }

  const feedUrl = source.verified_endpoint || source.base_url;
  if (!feedUrl) {
    return {
      sourceId,
      sourceName: source.name,
      success: false,
      totalFetched: 0,
      newInserted: 0,
      error: "URL RSS Feed belum dikonfigurasi.",
    };
  }

  try {
    const feed = await parseRssFeed(feedUrl, source.name);
    let newInserted = 0;

    for (const item of feed.items) {
      if (!item.canonicalUrl) continue;

      // Check if already exists in source_records
      const { data: existing } = await (supabase as any)
        .from("source_records")
        .select("id")
        .eq("source_id", sourceId)
        .eq("canonical_url", item.canonicalUrl)
        .maybeSingle();

      if (!existing) {
        await (supabase as any).from("source_records").insert({
          source_id: sourceId,
          external_id: item.externalId,
          title: item.title,
          record_type: "external_news",
          source_date: item.sourceDate,
          canonical_url: item.canonicalUrl,
          summary_abstract: item.summaryAbstract,
          metadata: item.metadata,
          content_hash: item.contentHash,
          review_status: "approved", // automatically approved for external news display
        });
        newInserted++;
      }
    }

    // Update source last_successful_run
    await (supabase as any)
      .from("sources")
      .update({
        last_successful_run: new Date().toISOString(),
        last_error: null,
      })
      .eq("id", sourceId);

    return {
      sourceId,
      sourceName: source.name,
      success: true,
      totalFetched: feed.items.length,
      newInserted,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    await (supabase as any)
      .from("sources")
      .update({
        last_error: errorMsg,
      })
      .eq("id", sourceId);

    return {
      sourceId,
      sourceName: source.name,
      success: false,
      totalFetched: 0,
      newInserted: 0,
      error: errorMsg,
    };
  }
}
