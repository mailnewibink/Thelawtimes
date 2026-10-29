import { NextResponse } from "next/server";
import { runSourceIngestion } from "@/lib/ingestion/engine";
import { getCurrentAdminUser } from "@/lib/admin/auth";
import { logAuditEvent } from "@/lib/admin/audit";

export async function POST(request: Request) {
  const user = await getCurrentAdminUser();

  // Only admin and editor can trigger manual sync
  if (!user || !["editor", "admin"].includes(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const sourceId = body.sourceId;

    if (!sourceId) {
      return NextResponse.json({ error: "sourceId is required" }, { status: 400 });
    }

    const report = await runSourceIngestion({
      sourceId,
      triggerType: "manual",
      batchSize: 10,
    });

    await logAuditEvent({
      action: "MANUAL_SOURCE_INGESTION_TRIGGERED",
      entityType: "source",
      entityId: sourceId,
      metadata: { report },
      actorId: user.id,
    });

    return NextResponse.json(report);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Ingestion failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
