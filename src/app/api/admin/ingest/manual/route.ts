import { NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/admin/auth";
import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";
import { computeRecordHash, isSafeOfficialUrl } from "@/lib/ingestion/types";
import { logAuditEvent } from "@/lib/admin/audit";

export async function POST(request: Request) {
  const user = await getCurrentAdminUser();

  if (!user || !["editor", "admin"].includes(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { sourceId, records } = await request.json();

    if (!sourceId || !Array.isArray(records)) {
      return NextResponse.json({ error: "Invalid payload: sourceId and records array required" }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient() || (await getSupabaseServerClient());
    if (!supabase) {
      return NextResponse.json({ error: "Database client unavailable" }, { status: 503 });
    }

    let importedCount = 0;

    for (const item of records) {
      if (!item.title || !item.externalId) continue;

      if (item.canonicalUrl && !isSafeOfficialUrl(item.canonicalUrl)) {
        continue; // skip unsafe URL
      }

      const hash = computeRecordHash({
        externalId: String(item.externalId),
        title: String(item.title),
        date: item.sourceDate || null,
        url: item.canonicalUrl || null,
        rawContent: item.summaryAbstract || null,
      });

      await (supabase as any).from("source_records").upsert(
        {
          source_id: sourceId,
          external_id: String(item.externalId),
          title: String(item.title),
          record_type: item.recordType || "general",
          source_date: item.sourceDate ? new Date(item.sourceDate).toISOString() : null,
          canonical_url: item.canonicalUrl || null,
          raw_document_url: item.rawDocumentUrl || null,
          summary_abstract: item.summaryAbstract || null,
          metadata: item.metadata || {},
          content_hash: hash,
          review_status: "pending",
          is_demo: false,
        },
        { onConflict: "source_id, external_id" }
      );

      importedCount++;
    }

    await logAuditEvent({
      action: "MANUAL_SOURCE_FILE_IMPORTED",
      entityType: "source_records",
      entityId: sourceId,
      metadata: { recordsImported: importedCount },
      actorId: user.id,
    });

    return NextResponse.json({ success: true, recordsImported: importedCount });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Import processing error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
