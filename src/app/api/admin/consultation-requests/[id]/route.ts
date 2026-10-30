import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/admin/auth";
import {
  updateConsultationRequestStatus,
  ConsultationRequestStatus,
} from "@/lib/repositories/consultation-requests";

const VALID_STATUSES: Set<string> = new Set([
  "Baru",
  "Diproses",
  "Dihubungi",
  "Selesai",
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
        { error: "Status permintaan tidak valid. Pilih: Baru, Diproses, Dihubungi, atau Selesai." },
        { status: 400 }
      );
    }

    const result = await updateConsultationRequestStatus(
      id,
      status as ConsultationRequestStatus,
      internalNotes !== undefined ? internalNotes : undefined
    );

    if (!result.success || !result.data) {
      return NextResponse.json(
        { error: result.error || "Permintaan tidak ditemukan atau gagal diperbarui." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Status permintaan konsultasi berhasil diperbarui.",
      data: result.data,
    });
  } catch (err) {
    console.error("PATCH admin consultation-requests error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal saat memperbarui data." },
      { status: 500 }
    );
  }
}
