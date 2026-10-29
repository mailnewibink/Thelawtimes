import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/admin/auth";
import { executeAiEditorialTask } from "@/lib/ai/service";
import type { AiTaskInput } from "@/types/ai";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentAdminUser();

    if (!user && process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const {
      taskType,
      sourceRecord,
      documentText,
      documentProvenance,
      template,
      language,
      legalDocumentId,
    } = body;

    if (!taskType || !sourceRecord || !sourceRecord.title) {
      return NextResponse.json(
        { error: "Invalid request: taskType and sourceRecord with title are required." },
        { status: 400 }
      );
    }

    const input: AiTaskInput = {
      taskType,
      sourceRecord,
      documentText,
      documentProvenance,
      template,
      language: language || "id",
    };

    const output = await executeAiEditorialTask(input, {
      userId: user?.id,
      legalDocumentId,
    });

    return NextResponse.json({
      success: true,
      result: output,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
