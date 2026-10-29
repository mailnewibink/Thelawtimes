import { NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/admin/auth";
import { getAiConfigStatus } from "@/lib/ai/service";

export async function GET() {
  try {
    const user = await getCurrentAdminUser();

    // In demo mode or if authenticated as editor/admin
    if (!user && process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = getAiConfigStatus();
    return NextResponse.json(status);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
