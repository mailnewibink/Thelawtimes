import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { demoRegulations } from "@/data/demo/regulations";
import type { Regulation, RegulationType, RegulationStatus } from "@/types/content";
import { sortByDateDesc } from "@/lib/utils";

interface DatabaseLegalDocRow {
  id: string;
  title: string;
  document_type: string;
  document_number: string | null;
  document_year: number | null;
  issuer: string | null;
  document_date: string | null;
  effective_date: string | null;
  legal_status: string | null;
  document_url: string | null;
  created_at: string;
  is_demo: boolean;
}

function mapDatabaseDocToRegulation(row: DatabaseLegalDocRow): Regulation {
  return {
    id: row.id,
    slug: `reg-${row.id.substring(0, 8)}`,
    title: row.title,
    type: (row.document_type as RegulationType) || "Government Regulation",
    number: row.document_number || null,
    year: row.document_year || null,
    issuingInstitution: row.issuer || null,
    publishedAt: row.document_date || "2026-10-29",
    effectiveDate: row.effective_date || null,
    status: (row.legal_status as RegulationStatus) || null,
    summary: row.title,
    body: [row.title],
    source: {
      label: row.issuer || "Official Gazette",
      publisher: row.issuer || null,
      url: row.document_url || null,
      accessedOn: row.created_at ? row.created_at.substring(0, 10) : null,
    },
    provenance: {
      isDemo: row.is_demo,
      verification: row.is_demo ? "demo" : "verified",
      note: row.is_demo ? "Demo regulation from database" : undefined,
    },
  };
}

export async function fetchPublishedRegulations(): Promise<Regulation[]> {
  if (!isSupabaseConfigured()) {
    return sortByDateDesc(demoRegulations, (r) => r.publishedAt);
  }

  try {
    const supabase = await getSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const res = await supabase
      .from("legal_documents")
      .select("*")
      .ilike("document_type", "%regulation%")
      .order("document_date", { ascending: false });

    if (res.error) {
      console.error("[Repository:regulations] DB query error:", res.error.message);
      return sortByDateDesc(demoRegulations, (r) => r.publishedAt);
    }

    const data = res.data as unknown as DatabaseLegalDocRow[] | null;
    if (!data || data.length === 0) {
      return sortByDateDesc(demoRegulations, (r) => r.publishedAt);
    }

    return data.map(mapDatabaseDocToRegulation);
  } catch (err) {
    console.error("[Repository:regulations] Failed to fetch regulations:", err);
    return sortByDateDesc(demoRegulations, (r) => r.publishedAt);
  }
}
