import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createPublicationRequest } from "@/lib/repositories/publication-requests";
import type { PublicationServiceKey } from "@/types/content";

// Allowed MIME types for uploaded legal documents
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

// Maximum file size: 10 MB
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const VALID_PUBLICATION_TYPES: Set<PublicationServiceKey> = new Set([
  "case_publication",
  "ruling_publication",
  "legal_opinion",
  "ip_publication",
  "sponsored_content",
]);

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let applicantName = "";
    let organization = "";
    let email = "";
    let whatsapp = "";
    let publicationType = "" as PublicationServiceKey;
    let proposedTitle = "";
    let shortDescription = "";
    let additionalMessage = "";
    let consentGiven = false;

    let documentPath: string | null = null;
    let documentName: string | null = null;
    let documentSize: number | null = null;
    let documentType: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      applicantName = (formData.get("applicantName") as string || "").trim();
      organization = (formData.get("organization") as string || "").trim();
      email = (formData.get("email") as string || "").trim().toLowerCase();
      whatsapp = (formData.get("whatsapp") as string || "").trim();
      publicationType = (formData.get("publicationType") as string || "").trim() as PublicationServiceKey;
      proposedTitle = (formData.get("proposedTitle") as string || "").trim();
      shortDescription = (formData.get("shortDescription") as string || "").trim();
      additionalMessage = (formData.get("additionalMessage") as string || "").trim();
      consentGiven = formData.get("consentGiven") === "true" || formData.get("consentGiven") === "on";

      const file = formData.get("document") as File | null;
      if (file && file.size > 0) {
        if (file.size > MAX_FILE_SIZE_BYTES) {
          return NextResponse.json(
            { error: "Ukuran berkas melebihi batas maksimal 10 MB." },
            { status: 400 }
          );
        }

        if (!ALLOWED_MIME_TYPES.has(file.type)) {
          return NextResponse.json(
            { error: "Format berkas tidak didukung. Mohon unggah dokumen PDF, DOCX, atau gambar PNG/JPG." },
            { status: 400 }
          );
        }

        // Sanitize file name and store in private directory (outside public folder)
        const safeBaseName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const uniqueFileName = `${Date.now()}-${safeBaseName}`;
        const privateDir = path.join(process.cwd(), "storage", "private_uploads");

        if (!fs.existsSync(privateDir)) {
          fs.mkdirSync(privateDir, { recursive: true });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const targetPath = path.join(privateDir, uniqueFileName);
        fs.writeFileSync(targetPath, buffer);

        documentPath = `/storage/private_uploads/${uniqueFileName}`;
        documentName = file.name;
        documentSize = file.size;
        documentType = file.type;
      }
    } else {
      const body = await req.json();
      applicantName = (body.applicantName || "").trim();
      organization = (body.organization || "").trim();
      email = (body.email || "").trim().toLowerCase();
      whatsapp = (body.whatsapp || "").trim();
      publicationType = (body.publicationType || "").trim() as PublicationServiceKey;
      proposedTitle = (body.proposedTitle || "").trim();
      shortDescription = (body.shortDescription || "").trim();
      additionalMessage = (body.additionalMessage || "").trim();
      consentGiven = Boolean(body.consentGiven);
    }

    // Required Field Validations
    if (!applicantName || applicantName.length < 2) {
      return NextResponse.json(
        { error: "Nama pemohon wajib diisi (minimal 2 karakter)." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Alamat email tidak valid." },
        { status: 400 }
      );
    }

    const phoneRegex = /^[\d\s+\-()]{8,20}$/;
    if (!whatsapp || !phoneRegex.test(whatsapp)) {
      return NextResponse.json(
        { error: "Nomor WhatsApp tidak valid (minimal 8 angka/karakter)." },
        { status: 400 }
      );
    }

    if (!VALID_PUBLICATION_TYPES.has(publicationType)) {
      return NextResponse.json(
        { error: "Jenis publikasi yang dipilih tidak valid." },
        { status: 400 }
      );
    }

    if (!proposedTitle || proposedTitle.length < 5) {
      return NextResponse.json(
        { error: "Judul usulan publikasi wajib diisi (minimal 5 karakter)." },
        { status: 400 }
      );
    }

    if (!shortDescription || shortDescription.length < 10) {
      return NextResponse.json(
        { error: "Ringkasan informasi perkara wajib diisi (minimal 10 karakter)." },
        { status: 400 }
      );
    }

    if (!consentGiven) {
      return NextResponse.json(
        { error: "Anda wajib menyetujui pernyataan keabsahan dan ketentuan penelaahan redaksi." },
        { status: 400 }
      );
    }

    // Create the record
    const result = await createPublicationRequest({
      applicantName,
      organization: organization || null,
      email,
      whatsapp,
      publicationType,
      proposedTitle,
      shortDescription,
      documentPath,
      documentName,
      documentSize,
      documentType,
      additionalMessage: additionalMessage || null,
      consentGiven: true,
    });

    return NextResponse.json({
      success: true,
      referenceNumber: result.referenceNumber,
      message:
        "Permohonan publikasi Anda telah berhasil diajukan dan tercatat dalam sistem redaksi The Law Times.",
    });
  } catch (err: any) {
    console.error("Publication request submission error:", err);
    return NextResponse.json(
      { error: "Terjadi kendala pada sistem penerimaan permohonan. Silakan coba kembali." },
      { status: 500 }
    );
  }
}
