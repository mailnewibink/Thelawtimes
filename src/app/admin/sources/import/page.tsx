"use client";

import { useState } from "react";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function ManualImportPage() {
  const [jsonText, setJsonText] = useState("");
  const [sourceId, setSourceId] = useState("s0000000-0000-0000-0000-000000000003");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; msg: string } | null>(null);

  const sampleTemplate = `[
  {
    "externalId": "ID-SAMPLE-001",
    "title": "Pengumuman Pendaftaran Desain Industri Kotak Kemasan",
    "recordType": "intellectual_property",
    "sourceDate": "2026-10-25",
    "canonicalUrl": "https://pdki-indonesia.dgip.go.id/detail/ID-SAMPLE-001",
    "summaryAbstract": "Permohonan pendaftaran desain kemasan produk komersial.",
    "metadata": { "applicant": "PT Contoh Indonesia", "class": "09-03" }
  }
]`;

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setImporting(true);

    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("Input must be a non-empty JSON array of legal records.");
      }

      // Submit manual import batch
      const res = await fetch("/api/admin/ingest/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceId, records: parsed }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed.");

      setResult({
        success: true,
        msg: `Successfully imported ${data.recordsImported} records into review queue (Status: PENDING).`,
      });
      setJsonText("");
    } catch (err: unknown) {
      setResult({
        success: false,
        msg: err instanceof Error ? err.message : "Validation or parsing error.",
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Manual Legal Record Import (Fallback)"
        description="Safely import verified legal notices and IP records when automated API access is restricted."
        breadcrumbs={[
          { label: "Sources", href: "/admin/sources" },
          { label: "Manual Import" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form onSubmit={handleImport} className="lg:col-span-8 border border-rule bg-paper-light p-5 space-y-4">
          {result && (
            <div
              className={`p-3 border text-xs font-serif flex items-center gap-2 ${
                result.success
                  ? "border-green-800 bg-green-50 text-green-900"
                  : "border-red-800 bg-red-50 text-red-900"
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{result.msg}</span>
            </div>
          )}

          <div>
            <label htmlFor="target-source" className="kicker block text-xs text-ink-muted mb-1">
              Select Destination Source
            </label>
            <select
              id="target-source"
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full border border-rule px-3 py-2 font-serif text-sm bg-white text-ink"
            >
              <option value="s0000000-0000-0000-0000-000000000003">
                Pangkalan Data Kekayaan Intelektual (DJKI Manual Fallback)
              </option>
              <option value="s0000000-0000-0000-0000-000000000001">
                Direktori Putusan Mahkamah Agung RI (Direct Batch)
              </option>
              <option value="s0000000-0000-0000-0000-000000000002">
                JDIHN Peraturan (Direct Batch)
              </option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="json-payload" className="kicker text-xs text-ink-muted">
                JSON Metadata Payload
              </label>
              <button
                type="button"
                onClick={() => setJsonText(sampleTemplate)}
                className="kicker text-[0.625rem] text-ink underline cursor-pointer"
              >
                Load Sample Template
              </button>
            </div>
            <textarea
              id="json-payload"
              rows={12}
              required
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder="Paste JSON array matching standard schema..."
              className="w-full border border-rule p-3 font-mono text-xs bg-white text-ink focus:outline-none focus:border-ink"
            />
          </div>

          <button
            type="submit"
            disabled={importing}
            className="kicker border border-ink bg-ink text-paper py-2.5 px-4 text-xs hover:bg-paper hover:text-ink transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{importing ? "Validating & Ingesting..." : "Process & Import Records"}</span>
          </button>
        </form>

        <div className="lg:col-span-4 border border-rule bg-paper-light p-5 space-y-3 font-serif text-xs">
          <h3 className="kicker text-xs text-ink border-b border-rule-soft pb-1">
            Data Quality & Security Constraints
          </h3>
          <ul className="list-disc pl-4 space-y-1.5 text-ink-muted">
            <li>Imported items immediately enter <strong>PENDING</strong> review status.</li>
            <li>No imported records will be published publicly until explicitly approved by an editor.</li>
            <li>Idempotent deduplication checks prevent duplicate entries sharing the same <code>externalId</code>.</li>
            <li>External URLs are validated against SSRF protection policies.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
