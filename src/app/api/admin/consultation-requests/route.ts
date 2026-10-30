import { NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/admin/auth";
import { getConsultationRequests } from "@/lib/repositories/consultation-requests";

export async function GET() {
  try {
    const user = await getCurrentAdminUser();
    if (!user || user.role === "reader") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requests = await getConsultationRequests();
    return NextResponse.json({ data: requests });
  } catch (err) {
    console.error("GET admin consultation-requests error:", err);
    return NextResponse.json(
      { error: "Gagal memuat data permintaan konsultasi." },
      { status: 500 }
    );
  }
}
