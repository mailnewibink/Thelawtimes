import { NextResponse } from "next/server";
import { syncExternalNewsSource } from "@/lib/ingestion/sync";
import { getCurrentAdminUser } from "@/lib/admin/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentAdminUser();
    if (!user || user.role === "reader") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sourceId } = await req.json();
    if (!sourceId) {
      return NextResponse.json({ error: "sourceId is required" }, { status: 400 });
    }

    const result = await syncExternalNewsSource(sourceId);
    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 }
    );
  }
}
