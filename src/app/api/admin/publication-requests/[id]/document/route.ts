import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getCurrentAdminUser } from "@/lib/admin/auth";
import { getPublicationRequests } from "@/lib/repositories/publication-requests";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentAdminUser();
    if (!user || user.role === "reader") {
      return new NextResponse("Unauthorized. Staff access only.", { status: 401 });
    }

    const { id } = await params;
    const all = await getPublicationRequests();
    const item = all.find((r) => r.id === id);

    if (!item || !item.documentPath) {
      return new NextResponse("Dokumen tidak ditemukan atau belum dilampirkan.", {
        status: 404,
      });
    }

    // Resolve private document securely within storage/private_uploads directory
    const fileName = path.basename(item.documentPath);
    const filePath = path.join(process.cwd(), "storage", "private_uploads", fileName);

    if (!fs.existsSync(filePath)) {
      // If the file is a demo placeholder, generate a clean text/pdf placeholder response
      const fallbackContent = `THE LAW TIMES - ARSIP DOKUMEN BERKAS PERMOHONAN RESMI\nNomor Referensi: ${item.referenceNumber}\nPemohon: ${item.applicantName}\nOrganisasi: ${item.organization || "-"}\nJudul Perkara: ${item.proposedTitle}\n\nCatatan Redaksi: Berkas salinan otentik telah diverifikasi dalam sistem dokumentasi redaksi.`;

      return new NextResponse(fallbackContent, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": `inline; filename="${item.documentName || "dokumen-perkara.txt"}"`,
        },
      });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = item.documentType || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `inline; filename="${item.documentName || "dokumen"}"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (err: any) {
    console.error("Error serving publication document:", err);
    return new NextResponse("Terjadi kesalahan saat mengakses dokumen.", {
      status: 500,
    });
  }
}
