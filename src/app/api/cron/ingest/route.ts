import { NextResponse } from "next/server";
import { runSourceIngestion } from "@/lib/ingestion/engine";
import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "dev-cron-secret";

  // Validate bearer secret for Vercel Cron or webhook caller
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized scheduling request" }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient() || (await getSupabaseServerClient());
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  // Fetch all enabled sources for scheduled polling
  const { data: sources, error } = await (supabase as any)
    .from("sources")
    .select("id, name, polling_interval_minutes, last_successful_run")
    .eq("is_enabled", true);

  if (error || !sources) {
    return NextResponse.json({ error: error?.message || "Failed to fetch sources" }, { status: 500 });
  }

  const reports = [];

  for (const src of sources) {
    const report = await runSourceIngestion({
      sourceId: src.id,
      triggerType: "scheduled",
      batchSize: 10,
    });
    reports.push({
      sourceName: src.name,
      ...report,
    });
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    scheduledSyncCompleted: true,
    sourcesProcessed: sources.length,
    reports,
  });
}
