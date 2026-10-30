import fs from "fs";
import path from "path";
import os from "os";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type ConsultationRequestStatus = "Baru" | "Diproses" | "Dihubungi" | "Selesai";

export type ConsultationServiceType =
  | "Pendaftaran Merek"
  | "Kekayaan Intelektual"
  | "Perizinan BPOM"
  | "Pendampingan Hukum"
  | "Legalitas Usaha"
  | "Lainnya";

export interface ConsultationRequest {
  id: string;
  referenceNumber: string;
  fullName: string;
  companyOrBrand: string | null;
  whatsapp: string;
  email: string;
  serviceType: ConsultationServiceType;
  needsDescription: string;
  consentGiven: boolean;
  status: ConsultationRequestStatus;
  internalNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConsultationRequestInput {
  fullName: string;
  companyOrBrand?: string | null;
  whatsapp: string;
  email: string;
  serviceType: ConsultationServiceType;
  needsDescription: string;
  consentGiven: boolean;
}

const LOCAL_STORAGE_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "demo",
  "consultation-requests.json"
);

const TMP_STORAGE_PATH = path.join(os.tmpdir(), "tlt-consultation-requests.json");

function getActiveStoragePath(): string {
  if (process.env.VERCEL) {
    if (!fs.existsSync(TMP_STORAGE_PATH) && fs.existsSync(LOCAL_STORAGE_PATH)) {
      try {
        fs.copyFileSync(LOCAL_STORAGE_PATH, TMP_STORAGE_PATH);
      } catch {
        // ignore
      }
    }
    return TMP_STORAGE_PATH;
  }
  return LOCAL_STORAGE_PATH;
}

function readLocalRequests(): ConsultationRequest[] {
  try {
    const filePath = getActiveStoragePath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");
      const raw = JSON.parse(data);
      return raw.map((r: any) => ({
        id: r.id,
        referenceNumber: r.reference_number || r.referenceNumber,
        fullName: r.full_name || r.fullName,
        companyOrBrand: r.company_or_brand || r.companyOrBrand || null,
        whatsapp: r.whatsapp,
        email: r.email,
        serviceType: r.service_type || r.serviceType,
        needsDescription: r.needs_description || r.needsDescription,
        consentGiven: Boolean(r.consent_given ?? r.consentGiven),
        status: (r.status || "Baru") as ConsultationRequestStatus,
        internalNotes: r.internal_notes || r.internalNotes || null,
        createdAt: r.created_at || r.createdAt,
        updatedAt: r.updated_at || r.updatedAt,
      }));
    }
  } catch (err) {
    console.error("Error reading local consultation requests:", err);
  }
  return [];
}

function writeLocalRequests(items: ConsultationRequest[]): void {
  try {
    const filePath = getActiveStoragePath();
    const raw = items.map((r) => ({
      id: r.id,
      reference_number: r.referenceNumber,
      full_name: r.fullName,
      company_or_brand: r.companyOrBrand,
      whatsapp: r.whatsapp,
      email: r.email,
      service_type: r.serviceType,
      needs_description: r.needsDescription,
      consent_given: r.consentGiven,
      status: r.status,
      internal_notes: r.internalNotes,
      created_at: r.createdAt,
      updated_at: r.updatedAt,
    }));
    fs.writeFileSync(filePath, JSON.stringify(raw, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing local consultation requests:", err);
  }
}

export async function getConsultationRequests(): Promise<ConsultationRequest[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await getSupabaseServerClient();
      if (supabase) {
        const { data, error } = await (supabase as any)
          .from("consultation_requests")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          return data.map((r: any) => ({
            id: r.id,
            referenceNumber: r.reference_number,
            fullName: r.full_name,
            companyOrBrand: r.company_or_brand || null,
            whatsapp: r.whatsapp,
            email: r.email,
            serviceType: r.service_type,
            needsDescription: r.needs_description,
            consentGiven: Boolean(r.consent_given),
            status: r.status,
            internalNotes: r.internal_notes || null,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
          }));
        }
      }
    } catch {
      // fallback
    }
  }

  const local = readLocalRequests();
  return local.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getConsultationRequestById(id: string): Promise<ConsultationRequest | null> {
  const requests = await getConsultationRequests();
  return requests.find((r) => r.id === id) || null;
}

export async function createConsultationRequest(
  input: CreateConsultationRequestInput
): Promise<{ success: boolean; data?: ConsultationRequest; error?: string }> {
  try {
    const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const referenceNumber = `CONS-${dateStr}-${timestamp}`;
    const now = new Date().toISOString();
    const id = `cons-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newRequest: ConsultationRequest = {
      id,
      referenceNumber,
      fullName: input.fullName.trim(),
      companyOrBrand: input.companyOrBrand?.trim() || null,
      whatsapp: input.whatsapp.trim(),
      email: input.email.trim().toLowerCase(),
      serviceType: input.serviceType,
      needsDescription: input.needsDescription.trim(),
      consentGiven: Boolean(input.consentGiven),
      status: "Baru",
      internalNotes: null,
      createdAt: now,
      updatedAt: now,
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = await getSupabaseServerClient();
        if (supabase) {
          const { error } = await (supabase as any).from("consultation_requests").insert({
            id: newRequest.id,
            reference_number: newRequest.referenceNumber,
            full_name: newRequest.fullName,
            company_or_brand: newRequest.companyOrBrand,
            whatsapp: newRequest.whatsapp,
            email: newRequest.email,
            service_type: newRequest.serviceType,
            needs_description: newRequest.needsDescription,
            consent_given: newRequest.consentGiven,
            status: newRequest.status,
            internal_notes: newRequest.internalNotes,
            created_at: newRequest.createdAt,
            updated_at: newRequest.updatedAt,
          });

          if (error) {
            console.warn("Supabase insert error, falling back to local:", error);
          }
        }
      } catch (err) {
        console.warn("Supabase exception, falling back to local:", err);
      }
    }

    const localItems = readLocalRequests();
    localItems.unshift(newRequest);
    writeLocalRequests(localItems);

    return { success: true, data: newRequest };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Terjadi kesalahan saat memproses permohonan",
    };
  }
}

export async function updateConsultationRequestStatus(
  id: string,
  status: ConsultationRequestStatus,
  internalNotes?: string | null
): Promise<{ success: boolean; data?: ConsultationRequest; error?: string }> {
  try {
    const now = new Date().toISOString();

    if (isSupabaseConfigured()) {
      try {
        const supabase = await getSupabaseServerClient();
        if (supabase) {
          const updatePayload: any = {
            status,
            updated_at: now,
          };
          if (internalNotes !== undefined) {
            updatePayload.internal_notes = internalNotes;
          }

          const { error } = await (supabase as any)
            .from("consultation_requests")
            .update(updatePayload)
            .eq("id", id);

          if (error) {
            console.warn("Supabase update error:", error);
          }
        }
      } catch (err) {
        console.warn("Supabase update exception:", err);
      }
    }

    const items = readLocalRequests();
    const index = items.findIndex((r) => r.id === id);
    if (index === -1) {
      return { success: false, error: "Permintaan konsultasi tidak ditemukan" };
    }

    items[index].status = status;
    items[index].updatedAt = now;
    if (internalNotes !== undefined) {
      items[index].internalNotes = internalNotes;
    }

    writeLocalRequests(items);
    return { success: true, data: items[index] };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Gagal memperbarui status permohonan",
    };
  }
}
