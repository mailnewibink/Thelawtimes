import { NextResponse } from "next/server";
import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentAdminUser } from "@/lib/admin/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentAdminUser();
    if (!user || user.role === "reader") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, review_status, category, summary_abstract, is_featured } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient() || (await getSupabaseServerClient());
    if (!supabase) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    const updates: Record<string, unknown> = {};
    if (review_status !== undefined) updates.review_status = review_status;
    if (summary_abstract !== undefined) updates.summary_abstract = summary_abstract;

    // If category or featured flag is modified, update in metadata JSONB
    if (category !== undefined || is_featured !== undefined) {
      const { data: current } = await (supabase as any)
        .from("source_records")
        .select("metadata")
        .eq("id", id)
        .single();

      const newMeta = { ...(current?.metadata || {}) };
      if (category !== undefined) newMeta.category = category;
      if (is_featured !== undefined) newMeta.is_featured = is_featured;
      updates.metadata = newMeta;
    }

    const { error } = await (supabase as any)
      .from("source_records")
      .update(updates)
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true, updated: updates });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Curation update failed" },
      { status: 500 }
    );
  }
}
