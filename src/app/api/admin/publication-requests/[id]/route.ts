import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/admin/auth";
import { updatePublicationRequestStatus } from "@/lib/repositories/publication-requests";
import type { PublicationRequestStatus } from "@/types/database";

const VALID_STATUSES: Set<PublicationRequestStatus> = new Set([
  "submitted",
  "contacted",
  "under_review",
  "approved",
  "rejected",
]);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentAdminUser();
    if (!user || user.role === "reader") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing request ID" }, { status: 400 });
    }

    const body = await req.json();
    const { status, internalNotes } = body;

    if (status && !VALID_STATUSES.has(status)) {
      return NextResponse.json(
        { error: "Invalid publication request status." },
        { status: 400 }
      );
    }

    const success = await updatePublicationRequestStatus(
      id,
      status,
      internalNotes !== undefined ? internalNotes : undefined
    );

    if (!success) {
      return NextResponse.json(
        { error: "Permohonan tidak ditemukan atau gagal diperbarui." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Status permohonan berhasil diperbarui.",
    });
  } catch (err: any) {
    console.error("Error updating publication request:", err);
    return NextResponse.json(
      { error: "Gagal memperbarui status permohonan." },
      { status: 500 }
    );
  }
}
