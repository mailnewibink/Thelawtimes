import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { demoCases } from "@/data/demo/cases";
import type { CaseRecord, CaseCategory, CaseStatus } from "@/types/content";
import { sortByDateDesc } from "@/lib/utils";

interface DatabaseCaseRow {
  id: string;
  title: string;
  slug: string;
  case_reference: string | null;
  court_name: string | null;
  case_type: string | null;
  case_status: string | null;
  outcome_summary: string | null;
  timeline: unknown;
  public_visibility: boolean;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
  case_documents: Array<{
    relation_type: string;
    legal_documents: {
      id: string;
      title: string;
      document_type: string;
      document_url: string | null;
    } | null;
  }>;
}

function mapDatabaseCaseToContent(row: DatabaseCaseRow): CaseRecord {
  const documents = (row.case_documents || []).map((cd) => ({
    label: cd.legal_documents?.title || "Document Record",
    kind: cd.legal_documents?.document_type || "Filing",
    url: cd.legal_documents?.document_url || null,
  }));

  const timeline = Array.isArray(row.timeline) ? row.timeline : [];

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    reference: row.case_reference || null,
    archiveId: `ARCHIVE-${row.id.substring(0, 8).toUpperCase()}`,
    court: row.court_name || null,
    category: (row.case_type as CaseCategory) || "Commercial",
    caseType: row.case_type || null,
    status: (row.case_status as CaseStatus) || null,
    year: row.created_at ? new Date(row.created_at).getFullYear() : 2026,
    summary: row.outcome_summary ? [row.outcome_summary] : ["No summary available."],
    timeline,
    documents,
    relatedAnnouncementSlugs: [],
    relatedArticleSlugs: [],
    lastUpdated: row.updated_at ? row.updated_at.substring(0, 10) : "2026-10-29",
    provenance: {
      isDemo: row.is_demo,
      verification: row.is_demo ? "demo" : "verified",
      note: row.is_demo ? "Demo record from database" : undefined,
    },
  };
}

export async function fetchPublicCases(): Promise<CaseRecord[]> {
  if (!isSupabaseConfigured()) {
    return sortByDateDesc(demoCases, (c) => c.lastUpdated);
  }

  try {
    const supabase = await getSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const res = await supabase
      .from("cases")
      .select(
        `
        id,
        title,
        slug,
        case_reference,
        court_name,
        case_type,
        case_status,
        outcome_summary,
        timeline,
        public_visibility,
        is_demo,
        created_at,
        updated_at,
        case_documents (
          relation_type,
          legal_documents (
            id,
            title,
            document_type,
            document_url
          )
        )
      `
      )
      .eq("public_visibility", true)
      .order("updated_at", { ascending: false });

    if (res.error) {
      console.error("[Repository:cases] DB query error:", res.error.message);
      return sortByDateDesc(demoCases, (c) => c.lastUpdated);
    }

    const data = res.data as unknown as DatabaseCaseRow[] | null;
    if (!data || data.length === 0) {
      return sortByDateDesc(demoCases, (c) => c.lastUpdated);
    }

    return data.map(mapDatabaseCaseToContent);
  } catch (err) {
    console.error("[Repository:cases] Exception reading public cases:", err);
    return sortByDateDesc(demoCases, (c) => c.lastUpdated);
  }
}

export async function fetchCaseBySlug(slug: string): Promise<CaseRecord | undefined> {
  if (!isSupabaseConfigured()) {
    return demoCases.find((c) => c.slug === slug);
  }

  try {
    const supabase = await getSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const res = await supabase
      .from("cases")
      .select(
        `
        id,
        title,
        slug,
        case_reference,
        court_name,
        case_type,
        case_status,
        outcome_summary,
        timeline,
        public_visibility,
        is_demo,
        created_at,
        updated_at,
        case_documents (
          relation_type,
          legal_documents (
            id,
            title,
            document_type,
            document_url
          )
        )
      `
      )
      .eq("slug", slug)
      .eq("public_visibility", true)
      .maybeSingle();

    if (res.error || !res.data) {
      return demoCases.find((c) => c.slug === slug);
    }

    const row = res.data as unknown as DatabaseCaseRow;
    return mapDatabaseCaseToContent(row);
  } catch (err) {
    console.error("[Repository:cases] Failed to fetch case by slug:", err);
    return demoCases.find((c) => c.slug === slug);
  }
}
