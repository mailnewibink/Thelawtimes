import fs from "fs";
import path from "path";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type {
  ClientPublicationRequest,
  PublicationServiceKey,
} from "@/types/content";
import type {
  PublicationRequestType,
  PublicationRequestStatus,
} from "@/types/database";

const LOCAL_STORAGE_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "demo",
  "publication-requests.json"
);

function readLocalRequests(): ClientPublicationRequest[] {
  try {
    if (fs.existsSync(LOCAL_STORAGE_PATH)) {
      const data = fs.readFileSync(LOCAL_STORAGE_PATH, "utf8");
      const raw = JSON.parse(data);
      return raw.map((r: any) => ({
        id: r.id,
        referenceNumber: r.reference_number,
        applicantName: r.applicant_name,
        organization: r.organization || null,
        email: r.email,
        whatsapp: r.whatsapp,
        publicationType: r.publication_type as PublicationServiceKey,
        proposedTitle: r.proposed_title,
        shortDescription: r.short_description,
        documentPath: r.document_path || null,
        documentName: r.document_name || null,
        documentSize: r.document_size || null,
        documentType: r.document_type || null,
        additionalMessage: r.additional_message || null,
        consentGiven: Boolean(r.consent_given),
        status: r.status,
        internalNotes: r.internal_notes || null,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
    }
  } catch (err) {
    console.error("Error reading local publication requests:", err);
  }
  return [];
}

function writeLocalRequests(items: ClientPublicationRequest[]): void {
  try {
    const raw = items.map((r) => ({
      id: r.id,
      reference_number: r.referenceNumber,
      applicant_name: r.applicantName,
      organization: r.organization,
      email: r.email,
      whatsapp: r.whatsapp,
      publication_type: r.publicationType,
      proposed_title: r.proposedTitle,
      short_description: r.shortDescription,
      document_path: r.documentPath,
      document_name: r.documentName,
      document_size: r.documentSize,
      document_type: r.documentType,
      additional_message: r.additionalMessage,
      consent_given: r.consentGiven,
      status: r.status,
      internal_notes: r.internalNotes,
      created_at: r.createdAt,
      updated_at: r.updatedAt,
    }));
    fs.writeFileSync(LOCAL_STORAGE_PATH, JSON.stringify(raw, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing local publication requests:", err);
  }
}

export interface CreatePublicationRequestInput {
  applicantName: string;
  organization?: string | null;
  email: string;
  whatsapp: string;
  publicationType: PublicationServiceKey;
  proposedTitle: string;
  shortDescription: string;
  documentPath?: string | null;
  documentName?: string | null;
  documentSize?: number | null;
  documentType?: string | null;
  additionalMessage?: string | null;
  consentGiven: boolean;
}

/**
 * Generates a memorable broadsheet reference code, e.g. TLT-REQ-20261030-9421
 */
export function generateReferenceNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
  return `TLT-REQ-${dateStr}-${randomSuffix}`;
}

/**
 * Creates a new client publication request (public submission)
 */
export async function createPublicationRequest(
  input: CreatePublicationRequestInput
): Promise<{ success: boolean; referenceNumber: string; id: string }> {
  const referenceNumber = generateReferenceNumber();
  const id = `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  // If Supabase is configured, insert to Supabase
  if (isSupabaseConfigured()) {
    try {
      const supabase = await getSupabaseServerClient();
      if (supabase) {
        const { error } = await (supabase as any).from("publication_requests").insert({
          id,
          reference_number: referenceNumber,
          applicant_name: input.applicantName,
          organization: input.organization || null,
          email: input.email,
          whatsapp: input.whatsapp,
          publication_type: input.publicationType as PublicationRequestType,
          proposed_title: input.proposedTitle,
          short_description: input.shortDescription,
          document_path: input.documentPath || null,
          document_name: input.documentName || null,
          document_size: input.documentSize || null,
          document_type: input.documentType || null,
          additional_message: input.additionalMessage || null,
          consent_given: input.consentGiven,
          status: "submitted" as PublicationRequestStatus,
          internal_notes: null,
          created_at: now,
          updated_at: now,
        });

        if (!error) {
          return { success: true, referenceNumber, id };
        }
        console.warn("Supabase insert returned error, falling back to local file:", error);
      }
    } catch (err) {
      console.warn("Supabase unavailable, falling back to local file:", err);
    }
  }

  // Fallback to local storage file
  const localItems = readLocalRequests();
  const newRecord: ClientPublicationRequest = {
    id,
    referenceNumber,
    applicantName: input.applicantName,
    organization: input.organization || null,
    email: input.email,
    whatsapp: input.whatsapp,
    publicationType: input.publicationType,
    proposedTitle: input.proposedTitle,
    shortDescription: input.shortDescription,
    documentPath: input.documentPath || null,
    documentName: input.documentName || null,
    documentSize: input.documentSize || null,
    documentType: input.documentType || null,
    additionalMessage: input.additionalMessage || null,
    consentGiven: input.consentGiven,
    status: "submitted",
    internalNotes: null,
    createdAt: now,
    updatedAt: now,
  };

  localItems.unshift(newRecord);
  writeLocalRequests(localItems);

  return { success: true, referenceNumber, id };
}

/**
 * Retrieves all publication requests for admin inspection
 */
export async function getPublicationRequests(filter?: {
  status?: string;
  type?: string;
  search?: string;
}): Promise<ClientPublicationRequest[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await getSupabaseServerClient();
      if (supabase) {
        let query = (supabase as any)
          .from("publication_requests")
          .select("*")
          .order("created_at", { ascending: false });

        if (filter?.status && filter.status !== "all") {
          query = query.eq("status", filter.status);
        }
        if (filter?.type && filter.type !== "all") {
          query = query.eq("publication_type", filter.type);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          let results = data.map((r: any) => ({
            id: r.id,
            referenceNumber: r.reference_number,
            applicantName: r.applicant_name,
            organization: r.organization,
            email: r.email,
            whatsapp: r.whatsapp,
            publicationType: r.publication_type as PublicationServiceKey,
            proposedTitle: r.proposed_title,
            shortDescription: r.short_description,
            documentPath: r.document_path,
            documentName: r.document_name,
            documentSize: r.document_size,
            documentType: r.document_type,
            additionalMessage: r.additional_message,
            consentGiven: r.consent_given,
            status: r.status,
            internalNotes: r.internal_notes,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
          }));

          if (filter?.search) {
            const q = filter.search.toLowerCase();
            results = results.filter(
              (item: ClientPublicationRequest) =>
                item.referenceNumber.toLowerCase().includes(q) ||
                item.applicantName.toLowerCase().includes(q) ||
                (item.organization && item.organization.toLowerCase().includes(q)) ||
                item.proposedTitle.toLowerCase().includes(q)
            );
          }
          return results;
        }
      }
    } catch (err) {
      console.warn("Supabase fetch failed, falling back to local file:", err);
    }
  }

  // Fallback to local storage
  let items = readLocalRequests();
  if (filter?.status && filter.status !== "all") {
    items = items.filter((item) => item.status === filter.status);
  }
  if (filter?.type && filter.type !== "all") {
    items = items.filter((item) => item.publicationType === filter.type);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    items = items.filter(
      (item) =>
        item.referenceNumber.toLowerCase().includes(q) ||
        item.applicantName.toLowerCase().includes(q) ||
        (item.organization && item.organization.toLowerCase().includes(q)) ||
        item.proposedTitle.toLowerCase().includes(q)
    );
  }
  return items;
}

/**
 * Updates a publication request status and internal notes
 */
export async function updatePublicationRequestStatus(
  id: string,
  status: "submitted" | "contacted" | "under_review" | "approved" | "rejected",
  internalNotes?: string | null
): Promise<boolean> {
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
          .from("publication_requests")
          .update(updatePayload)
          .eq("id", id);

        if (!error) return true;
        console.warn("Supabase update failed, falling back to local store:", error);
      }
    } catch (err) {
      console.warn("Supabase update error:", err);
    }
  }

  // Fallback update in local storage
  const items = readLocalRequests();
  const index = items.findIndex((r) => r.id === id);
  if (index !== -1) {
    items[index].status = status;
    items[index].updatedAt = now;
    if (internalNotes !== undefined) {
      items[index].internalNotes = internalNotes;
    }
    writeLocalRequests(items);
    return true;
  }
  return false;
}

/**
 * Summary counts for admin dashboard
 */
export async function getPublicationRequestStats(): Promise<{
  total: number;
  submitted: number;
  contacted: number;
  underReview: number;
  approved: number;
  rejected: number;
}> {
  const items = await getPublicationRequests();
  return {
    total: items.length,
    submitted: items.filter((i) => i.status === "submitted").length,
    contacted: items.filter((i) => i.status === "contacted").length,
    underReview: items.filter((i) => i.status === "under_review").length,
    approved: items.filter((i) => i.status === "approved").length,
    rejected: items.filter((i) => i.status === "rejected").length,
  };
}
