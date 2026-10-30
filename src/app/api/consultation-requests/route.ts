import { NextRequest, NextResponse } from "next/server";
import {
  createConsultationRequest,
  ConsultationServiceType,
} from "@/lib/repositories/consultation-requests";

const VALID_SERVICES: Set<string> = new Set([
  "Pendaftaran Merek",
  "Kekayaan Intelektual",
  "Perizinan BPOM",
  "Pendampingan Hukum",
  "Legalitas Usaha",
  "Lainnya",
]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const fullName = String(body.fullName || "").trim();
    const companyOrBrand = body.companyOrBrand ? String(body.companyOrBrand).trim() : null;
    const whatsapp = String(body.whatsapp || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const serviceType = String(body.serviceType || "").trim() as ConsultationServiceType;
    const needsDescription = String(body.needsDescription || "").trim();
    const consentGiven = Boolean(body.consentGiven);

    // Validations
    if (!fullName || fullName.length < 3) {
      return NextResponse.json(
        { error: "Nama lengkap wajib diisi minimal 3 karakter." },
        { status: 400 }
      );
    }

    if (!whatsapp || whatsapp.length < 8) {
      return NextResponse.json(
        { error: "Nomor WhatsApp aktif wajib diisi." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format alamat email tidak valid." },
        { status: 400 }
      );
    }

    if (!VALID_SERVICES.has(serviceType)) {
      return NextResponse.json(
        { error: "Pilihan jenis layanan tidak valid." },
        { status: 400 }
      );
    }

    if (!needsDescription || needsDescription.length < 10) {
      return NextResponse.json(
        { error: "Deskripsi kebutuhan wajib diisi minimal 10 karakter." },
        { status: 400 }
      );
    }

    if (!consentGiven) {
      return NextResponse.json(
        { error: "Anda wajib menyetujui pernyataan penggunaan data untuk melanjutkan." },
        { status: 400 }
      );
    }

    const result = await createConsultationRequest({
      fullName,
      companyOrBrand,
      whatsapp,
      email,
      serviceType,
      needsDescription,
      consentGiven,
    });

    if (!result.success || !result.data) {
      return NextResponse.json(
        { error: result.error || "Gagal memproses permintaan konsultasi." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Permintaan konsultasi Anda telah berhasil dikirimkan.",
        referenceNumber: result.data.referenceNumber,
        data: result.data,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("API consultation-requests error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server saat memproses data." },
      { status: 500 }
    );
  }
}
