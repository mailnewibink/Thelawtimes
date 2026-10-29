import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function AdminRegulationsPage() {
  const supabase = await getSupabaseServerClient();
  let regulations: Array<{
    id: string;
    title: string;
    document_type: string;
    document_number: string | null;
    issuer: string | null;
    legal_status: string | null;
  }> = [];

  if (supabase) {
    const { data } = await supabase
      .from("legal_documents")
      .select("id, title, document_type, document_number, issuer, legal_status")
      .ilike("document_type", "%regulation%")
      .order("created_at", { ascending: false });
    regulations = data || [];
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Regulation Watch Records"
        description="Statutes, ministerial decrees, and official gazette instruments."
        breadcrumbs={[{ label: "Regulations" }]}
      />

      <div className="border border-rule bg-paper-light overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-rule bg-paper-dark/60 font-sans font-bold uppercase text-[0.625rem] text-ink-muted tracking-wider">
              <th className="p-3">Title / Instrument</th>
              <th className="p-3">Level / Type</th>
              <th className="p-3">Official Number</th>
              <th className="p-3">Issuing Body</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule-soft font-serif">
            {regulations.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center italic text-ink-muted">
                  No regulations registered in database.
                </td>
              </tr>
            ) : (
              regulations.map((reg) => (
                <tr key={reg.id} className="hover:bg-paper-dark/30 transition-colors">
                  <td className="p-3 font-semibold text-ink">{reg.title}</td>
                  <td className="p-3 uppercase font-sans text-[0.625rem] text-ink-muted">{reg.document_type}</td>
                  <td className="p-3 font-mono text-[0.6875rem]">{reg.document_number || "Unverified"}</td>
                  <td className="p-3 text-ink-muted">{reg.issuer || "Unspecified"}</td>
                  <td className="p-3">
                    <span className="kicker text-[0.625rem] border border-rule px-1.5 py-0.5">
                      {reg.legal_status || "In Force"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
