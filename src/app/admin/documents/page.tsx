import { Upload, Lock } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminDocumentsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Document Storage & Archives"
        description="Private document repository for court filings, statutory notices, and legal briefs."
        breadcrumbs={[{ label: "Documents" }]}
      />

      {/* Security Notice */}
      <div className="border-2 border-ink bg-paper-light p-4 space-y-2">
        <div className="flex items-center gap-2 font-bold text-xs">
          <Lock className="w-4 h-4 text-ink" />
          <span className="kicker uppercase">Private Storage Policy</span>
        </div>
        <p className="font-serif text-xs leading-relaxed text-ink-muted">
          All court documents, bankruptcy decrees, and statutory filings are preserved in the
          private <code>legal-documents</code> bucket. Public access is strictly barred unless
          the document is explicitly associated with an approved public case record or gazette notice.
        </p>
      </div>

      <div className="border border-dashed border-ink p-8 text-center bg-paper-light space-y-3">
        <Upload className="w-8 h-8 mx-auto text-ink-muted" />
        <h3 className="font-display text-base font-bold text-ink">Upload Legal Document</h3>
        <p className="font-serif text-xs text-ink-muted max-w-sm mx-auto">
          Supported formats: PDF, DOCX, TIFF, PNG (Max 50MB). Files are encrypted and scanned upon upload.
        </p>
        <button
          type="button"
          disabled
          className="kicker border border-ink bg-paper px-4 py-2 text-xs text-ink-muted cursor-not-allowed"
        >
          Document Upload Active via API
        </button>
      </div>
    </div>
  );
}
