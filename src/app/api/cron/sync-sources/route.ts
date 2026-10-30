import { NextResponse } from "next/server";
import { syncExternalNewsSource } from "@/lib/ingestion/sync";
import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Scheduled background ingestion endpoint.
 * Can be triggered via cron job or Vercel Cron with CRON_SECRET authorization.
 */
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // If CRON_SECRET is configured, ensure request is authorized
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized cron request" }, { status: 401 });
    }

    const supabase = getSupabaseAdminClient() || (await getSupabaseServerClient());
    if (!supabase) {
      return NextResponse.json({ error: "Database client unconfigured" }, { status: 500 });
    }

    // Find enabled sources with RSS or API endpoint
    const { data: sources, error } = await (supabase as any)
      .from("sources")
      .select("id, name, verified_endpoint")
      .eq("is_enabled", true)
      .not("verified_endpoint", "is", null);

    if (error || !sources || sources.length === 0) {
      return NextResponse.json({
        message: "No active automated sources to synchronize.",
        synced: 0,
      });
    }

    const results = [];
    for (const src of sources) {
      try {
        const res = await syncExternalNewsSource(src.id);
        results.push(res);
      } catch (err: unknown) {
        results.push({
          sourceId: src.id,
          sourceName: src.name,
          success: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      syncedSources: results.length,
      details: results,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Cron sync failed" },
      { status: 500 }
    );
  }
}
