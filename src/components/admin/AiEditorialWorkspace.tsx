"use client";

import { useState } from "react";
import {
  Sparkles,
  Scale,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Save,
  RotateCw,
  Search,
  ShieldAlert,
  Send,
  Layers,
} from "lucide-react";
import type {
  AiTaskType,
  AiTaskOutput,
  DraftTemplateType,
  AiProviderConfigStatus,
} from "@/types/ai";
import { cn } from "@/lib/utils";

export interface WorkspaceSourceRecord {
  id: string;
  title: string;
  source_name?: string;
  source_type?: string;
  canonical_url?: string | null;
  external_id?: string | null;
  source_date?: string | null;
  review_status?: string;
  raw_document_url?: string | null;
  metadata?: Record<string, unknown>;
}

interface AiEditorialWorkspaceProps {
  initialSources: WorkspaceSourceRecord[];
  initialConfig: AiProviderConfigStatus;
}

export function AiEditorialWorkspace({
  initialSources,
  initialConfig,
}: AiEditorialWorkspaceProps) {
  const [sources] = useState<WorkspaceSourceRecord[]>(initialSources);
  const [selectedSourceId, setSelectedSourceId] = useState<string>(
    initialSources[0]?.id || ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "reviewed" | "pending">("all");

  // AI Task Configuration
  const [selectedTask, setSelectedTask] = useState<AiTaskType>("extract_claims");
  const [draftTemplate, setDraftTemplate] = useState<DraftTemplateType>("news");
  const [language, setLanguage] = useState<"id" | "en">("id");

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [taskOutput, setTaskOutput] = useState<AiTaskOutput | null>(null);
  const [showPromptContext, setShowPromptContext] = useState(false);

  // Draft Editor State
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDeck, setDraftDeck] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const selectedSource = sources.find((s) => s.id === selectedSourceId) || sources[0];

  const filteredSources = sources.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.external_id && s.external_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.source_name && s.source_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" ? true : s.review_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRunAiTask = async () => {
    if (!selectedSource) return;
    setIsLoading(true);
    setErrorMessage(null);
    setSaveSuccessMessage(null);

    try {
      const res = await fetch("/api/admin/ai/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskType: selectedTask,
          template: draftTemplate,
          language,
          sourceRecord: {
            id: selectedSource.id,
            title: selectedSource.title,
            sourceName: selectedSource.source_name,
            sourceType: selectedSource.source_type,
            canonicalUrl: selectedSource.canonical_url,
            externalId: selectedSource.external_id,
            sourceDate: selectedSource.source_date,
            metadata: selectedSource.metadata,
          },
          documentText: selectedSource.metadata
            ? JSON.stringify(selectedSource.metadata, null, 2)
            : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal memproses analisis AI.");
      }

      setTaskOutput(data.result);

      // If draft generated, populate draft fields
      if (data.result.draft) {
        setDraftTitle(data.result.draft.suggestedHeadlines?.[0] || selectedSource.title);
        setDraftDeck(data.result.draft.deck || "");
        setDraftBody(data.result.draft.bodyMarkdown || "");
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!selectedSource || !draftTitle || !draftBody) return;
    setIsSavingDraft(true);
    setErrorMessage(null);
    setSaveSuccessMessage(null);

    try {
      const res = await fetch("/api/admin/ai/save-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceRecordId: selectedSource.id,
          title: draftTitle,
          excerpt: draftDeck,
          body: draftBody,
          contentType:
            draftTemplate === "court_report"
              ? "case_summary"
              : draftTemplate === "regulation_update"
              ? "regulation_update"
              : draftTemplate === "announcement"
              ? "announcement"
              : draftTemplate === "intellectual_property"
              ? "intellectual_property"
              : "news",
          citationNote: `Draf editorial AI diverifikasi terhadap sumber resmi: ${selectedSource.title}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan draf editorial.");
      }

      setSaveSuccessMessage(
        `Draf berhasil disimpan sebagai unpublished 'draft' (ID: ${data.articleId}). Konten siap masuk ke antrean editorial review.`
      );
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSavingDraft(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Safeguard Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-700 p-4 rounded-none text-xs text-amber-900 flex items-start gap-3 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold uppercase tracking-wider text-[0.7rem] text-amber-950">
            Pedoman Editorial & Protokol Integritas AI — The Law Times
          </p>
          <p>
            Kecerdasan buatan bertindak sebagai <strong>asisten penyusun data mentah</strong>. Model dilarang
            menerbitkan artikel secara otonom, membuat opini hukum, atau mengasumsikan fakta yang tidak tertulis.
            Seluruh amar putusan, tanggal, dan nomor pasal <strong>wajib diverifikasi oleh editor manusia</strong>{" "}
            sebelum disetujui.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Source Selector, Right Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Source Selector & Context */}
        <div className="lg:col-span-4 space-y-4">
          <div className="border border-rule bg-white p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-rule pb-2">
              <h2 className="font-serif font-bold text-ink text-sm flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-ink-muted" />
                <span>Pilih Sumber Resmi</span>
              </h2>
              <span className="text-[0.65rem] kicker text-ink-muted">
                {filteredSources.length} Dokumen
              </span>
            </div>

            {/* Filter & Search */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-ink-muted" />
                <input
                  type="text"
                  placeholder="Cari putusan, regulasi, nomor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 border border-rule bg-paper focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="flex gap-1">
                {(["all", "reviewed", "pending"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={cn(
                      "px-2 py-1 text-[0.65rem] kicker border uppercase transition-colors",
                      statusFilter === st
                        ? "border-ink bg-ink text-paper"
                        : "border-rule bg-paper text-ink-muted hover:border-ink"
                    )}
                  >
                    {st === "all" ? "Semua" : st === "reviewed" ? "Terverifikasi" : "Menunggu"}
                  </button>
                ))}
              </div>
            </div>

            {/* Source List */}
            <div className="divide-y divide-rule/60 max-h-[320px] overflow-y-auto pr-1">
              {filteredSources.map((s) => {
                const isSelected = s.id === selectedSource?.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedSourceId(s.id);
                      setTaskOutput(null);
                      setSaveSuccessMessage(null);
                    }}
                    className={cn(
                      "w-full text-left py-2.5 px-2 transition-colors block text-xs",
                      isSelected
                        ? "bg-paper-dark/60 border-l-2 border-ink pl-2 font-medium"
                        : "hover:bg-paper"
                    )}
                  >
                    <div className="flex items-center justify-between text-[0.65rem] text-ink-muted mb-0.5">
                      <span className="uppercase tracking-wider font-mono">
                        {s.external_id || "REG-DOK"}
                      </span>
                      <span
                        className={cn(
                          "px-1 py-0.2 rounded-none text-[0.6rem] font-sans",
                          s.review_status === "reviewed"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        )}
                      >
                        {s.review_status === "reviewed" ? "Terverifikasi" : "Pending"}
                      </span>
                    </div>
                    <div className="font-serif text-ink line-clamp-2 leading-tight">
                      {s.title}
                    </div>
                    <div className="text-[0.65rem] text-ink-muted mt-1 flex items-center justify-between">
                      <span>{s.source_name || "Sumber Resmi RI"}</span>
                      <span>{s.source_date ? s.source_date.slice(0, 10) : "N/A"}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Source Summary Card */}
          {selectedSource && (
            <div className="border border-rule bg-paper-dark/30 p-4 space-y-3 text-xs">
              <div className="border-b border-rule pb-2">
                <span className="kicker text-[0.65rem] text-accent uppercase block">
                  Metadata Sumber Aktif
                </span>
                <h3 className="font-serif font-bold text-ink mt-0.5 text-sm leading-snug">
                  {selectedSource.title}
                </h3>
              </div>

              <dl className="grid grid-cols-2 gap-2 text-[0.7rem]">
                <div>
                  <dt className="text-ink-muted uppercase">Sistem Asal</dt>
                  <dd className="font-medium text-ink">{selectedSource.source_name || "Resmi"}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted uppercase">Tipe Data</dt>
                  <dd className="font-medium text-ink capitalize">{selectedSource.source_type || "Hukum"}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted uppercase">Nomor Registrasi</dt>
                  <dd className="font-mono text-ink">{selectedSource.external_id || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted uppercase">Tanggal Resmi</dt>
                  <dd className="font-medium text-ink">{selectedSource.source_date || "N/A"}</dd>
                </div>
              </dl>

              {selectedSource.canonical_url && (
                <div className="pt-2 border-t border-rule/60">
                  <a
                    href={selectedSource.canonical_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-accent hover:underline text-xs"
                  >
                    <span>Buka Tautan Resmi Instansi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Toggle Untrusted Context Preview */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowPromptContext(!showPromptContext)}
                  className="kicker text-[0.65rem] text-ink-muted hover:text-ink underline block"
                >
                  {showPromptContext ? "Sembunyikan Konteks Mentah" : "Pratinjau Batasan Data Mentah (<untrusted>)"}
                </button>
                {showPromptContext && (
                  <pre className="mt-2 p-2 bg-white border border-rule text-[0.65rem] font-mono text-ink-muted max-h-40 overflow-y-auto whitespace-pre-wrap">
                    {selectedSource.metadata
                      ? JSON.stringify(selectedSource.metadata, null, 2)
                      : "Tidak ada metadata tambahan."}
                  </pre>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: AI Tasks & Results Workspace */}
        <div className="lg:col-span-8 space-y-4">
          {/* Task Selector Header */}
          <div className="border border-rule bg-white p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <h2 className="font-serif font-bold text-ink text-sm">
                  Pilih Modul Inteligensi AI
                </h2>
              </div>

              {/* Provider Status Pill */}
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 text-[0.65rem] font-mono border",
                    initialConfig.isConfigured
                      ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                      : "border-amber-700 bg-amber-50 text-amber-800"
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span>
                    {initialConfig.providerName === "gemini"
                      ? "Gemini AI"
                      : initialConfig.providerName === "openai"
                      ? "OpenAI"
                      : initialConfig.providerName === "mock"
                      ? "Engine Mock (Uji Coba)"
                      : "Nonaktif"}
                  </span>
                </span>

                <select
                  aria-label="Pilih Bahasa Analisis"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as "id" | "en")}
                  className="text-xs border border-rule px-2 py-1 bg-paper text-ink"
                >
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            {/* Task Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {[
                { id: "extract_claims", label: "Ekstraksi Klaim", icon: CheckCircle2 },
                { id: "document_summary", label: "Ringkasan Hukum", icon: FileText },
                { id: "extract_entities_timeline", label: "Garis Waktu", icon: Clock },
                { id: "generate_draft", label: "Draf Berita", icon: Layers },
                { id: "verification_checklist", label: "Daftar Periksa", icon: AlertTriangle },
              ].map((task) => {
                const isCurrent = selectedTask === task.id;
                const Icon = task.icon;
                return (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTask(task.id as AiTaskType)}
                    className={cn(
                      "p-2.5 text-left border flex flex-col justify-between transition-colors text-xs",
                      isCurrent
                        ? "border-ink bg-paper-dark/70 font-semibold text-ink"
                        : "border-rule bg-white text-ink-muted hover:border-ink"
                    )}
                  >
                    <Icon className="w-4 h-4 mb-2 text-ink" />
                    <span className="leading-tight text-[0.7rem] uppercase tracking-wider">
                      {task.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Draft Template Options (only if generate_draft is selected) */}
            {selectedTask === "generate_draft" && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-rule/60 text-xs">
                <span className="kicker text-[0.65rem] text-ink-muted uppercase">
                  Format Draf:
                </span>
                {[
                  { id: "news", label: "Berita Hukum" },
                  { id: "court_report", label: "Laporan Putusan" },
                  { id: "regulation_update", label: "Update Regulasi" },
                  { id: "announcement", label: "Pengumuman Resmi" },
                  { id: "intellectual_property", label: "Kekayaan Intelektual" },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setDraftTemplate(tpl.id as DraftTemplateType)}
                    className={cn(
                      "px-2 py-1 text-[0.68rem] border uppercase transition-colors",
                      draftTemplate === tpl.id
                        ? "border-ink bg-ink text-paper font-medium"
                        : "border-rule bg-paper text-ink-muted hover:border-ink"
                    )}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-rule">
              <span className="text-[0.7rem] text-ink-muted">
                {selectedSource
                  ? `Menganalisis: ${selectedSource.title.slice(0, 40)}...`
                  : "Pilih sumber terlebih dahulu"}
              </span>

              <button
                type="button"
                onClick={handleRunAiTask}
                disabled={isLoading || !selectedSource}
                className="kicker inline-flex items-center gap-2 border border-ink bg-ink text-paper px-4 py-2 text-xs hover:bg-paper hover:text-ink transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menganalisis Dokumen...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Jalankan Analisis AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Feedback & Notifications */}
          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-700 p-3 text-xs text-red-900 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-700 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {saveSuccessMessage && (
            <div className="bg-emerald-50 border-l-4 border-emerald-700 p-3 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{saveSuccessMessage}</span>
            </div>
          )}

          {/* RESULTS DISPLAY PANEL */}
          <div className="border border-rule bg-white p-5 min-h-[420px]">
            {!taskOutput && !isLoading && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-ink-muted space-y-2">
                <Scale className="w-8 h-8 opacity-40 stroke-1" />
                <p className="font-serif text-sm">Belum ada analisis yang dijalankan</p>
                <p className="text-xs max-w-sm">
                  Pilih dokumen resmi di sebelah kiri, tentukan modul tugas inteligensi di atas, lalu klik{" "}
                  <strong>Jalankan Analisis AI</strong>.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 text-ink space-y-3">
                <RotateCw className="w-8 h-8 animate-spin text-accent" />
                <p className="font-serif text-sm font-bold">Memproses Dokumen Hukum...</p>
                <p className="text-xs text-ink-muted max-w-xs">
                  Mengekstraksi klaim berbasis bukti dan memverifikasi amar putusan dari sumber resmi.
                </p>
              </div>
            )}

            {taskOutput && !isLoading && (
              <div className="space-y-6">
                {/* 1. CLAIMS TAB VIEW */}
                {taskOutput.claims && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-rule pb-2">
                      <h3 className="font-serif font-bold text-ink text-sm flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                        <span>Klaim Terverifikasi Berdasarkan Bukti ({taskOutput.claims.length})</span>
                      </h3>
                      <span className="text-[0.65rem] kicker text-ink-muted">
                        Model: {taskOutput.model} ({taskOutput.durationMs}ms)
                      </span>
                    </div>

                    <div className="space-y-3">
                      {taskOutput.claims.map((claim, idx) => (
                        <div
                          key={idx}
                          className="border border-rule/80 p-3 bg-paper/40 space-y-2 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-ink font-serif text-[0.85rem]">
                              {claim.claimText}
                            </span>
                            <span
                              className={cn(
                                "px-2 py-0.5 text-[0.65rem] kicker uppercase font-mono shrink-0 border",
                                claim.verificationStatus === "verified"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-700"
                                  : claim.verificationStatus === "unverified"
                                  ? "bg-amber-50 text-amber-800 border-amber-700"
                                  : "bg-red-50 text-red-800 border-red-700"
                              )}
                            >
                              {claim.verificationStatus}
                            </span>
                          </div>

                          {claim.supportingExcerpt && (
                            <blockquote className="border-l-2 border-rule pl-2.5 italic text-ink-muted text-[0.75rem] bg-white p-1.5">
                              &ldquo;{claim.supportingExcerpt}&rdquo;
                            </blockquote>
                          )}

                          <div className="flex flex-wrap items-center justify-between text-[0.68rem] text-ink-muted pt-1 border-t border-rule/40">
                            <span>
                              Bagian: <strong>{claim.pageOrSection || "Tidak tercantum"}</strong> | Tipe:{" "}
                              <strong className="capitalize">{claim.claimType}</strong>
                            </span>
                            {claim.confidenceNotes && (
                              <span className="text-ink/80 italic">{claim.confidenceNotes}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. DOCUMENT SUMMARY VIEW */}
                {taskOutput.summary && (
                  <div className="space-y-4">
                    <div className="border-b border-rule pb-2">
                      <span className="kicker text-[0.65rem] text-accent uppercase">
                        {taskOutput.summary.documentType}
                      </span>
                      <h3 className="font-serif font-bold text-ink text-base">
                        Ringkasan Struktur Yuridis Dokumen
                      </h3>
                    </div>

                    {/* Ruling / Conclusion Callout */}
                    <div className="border border-ink bg-paper p-3 text-xs space-y-1">
                      <span className="kicker text-[0.65rem] uppercase text-ink-muted">
                        Amar Putusan / Ketetapan Pokok
                      </span>
                      <p className="font-serif font-bold text-ink text-[0.9rem] leading-snug">
                        {taskOutput.summary.decisionOrConclusion}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Facts */}
                      <div className="border border-rule p-3 space-y-2 bg-white">
                        <h4 className="font-serif font-bold text-ink border-b border-rule pb-1">
                          Fakta-Fakta Yang Diakui
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-ink-muted">
                          {taskOutput.summary.facts.map((f, i) => (
                            <li key={i} className="leading-snug">{f}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Reasoning */}
                      <div className="border border-rule p-3 space-y-2 bg-white">
                        <h4 className="font-serif font-bold text-ink border-b border-rule pb-1">
                          Pertimbangan Hukum
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-ink-muted">
                          {taskOutput.summary.reasoning.map((r, i) => (
                            <li key={i} className="leading-snug">{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Dates & Provisions */}
                    <div className="border border-rule p-3 space-y-2 text-xs bg-paper-dark/20">
                      <h4 className="font-serif font-bold text-ink border-b border-rule pb-1">
                        Ketentuan Peraturan & Tanggal Signifikan
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {taskOutput.summary.keyDatesAndProvisions.map((dp, i) => (
                          <div key={i}>
                            <span className="text-[0.65rem] uppercase kicker text-ink-muted block">
                              {dp.label}
                            </span>
                            <span className="font-mono text-ink text-[0.75rem]">{dp.dateOrRef}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Missing Information Safeguard */}
                    {taskOutput.summary.missingOrUnclearInfo?.length > 0 && (
                      <div className="border border-amber-300 bg-amber-50/60 p-3 text-xs space-y-1 text-amber-900">
                        <span className="font-bold flex items-center gap-1.5 text-[0.7rem] uppercase">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                          Informasi Yang Tidak Ditemukan / Belum Lengkap Pada Teks
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-[0.75rem]">
                          {taskOutput.summary.missingOrUnclearInfo.map((m, i) => (
                            <li key={i}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. ENTITIES & TIMELINE VIEW */}
                {taskOutput.entitiesTimeline && (
                  <div className="space-y-4 text-xs">
                    <div className="border-b border-rule pb-2">
                      <h3 className="font-serif font-bold text-ink text-sm">
                        Entitas Yang Terlibat & Garis Waktu Kronologis
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="border border-rule p-3 bg-white space-y-1.5">
                        <span className="kicker text-[0.65rem] text-ink-muted uppercase">Instansi Terkait</span>
                        <div className="flex flex-wrap gap-1">
                          {taskOutput.entitiesTimeline.institutions.map((inst, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-paper text-ink border border-rule text-[0.7rem]">
                              {inst}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="border border-rule p-3 bg-white space-y-1.5">
                        <span className="kicker text-[0.65rem] text-ink-muted uppercase">Para Pihak</span>
                        <div className="flex flex-wrap gap-1">
                          {taskOutput.entitiesTimeline.parties.map((p, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-paper text-ink border border-rule text-[0.7rem]">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="border border-rule p-3 bg-white space-y-3">
                      <h4 className="font-serif font-bold text-ink border-b border-rule pb-1">
                        Garis Waktu Peristiwa
                      </h4>
                      <ol className="relative border-l border-rule ml-2 space-y-3">
                        {taskOutput.entitiesTimeline.timeline.map((evt, i) => (
                          <li key={i} className="ml-4 space-y-0.5">
                            <span className="absolute -left-1.5 mt-1 w-2.5 h-2.5 rounded-full bg-ink border-2 border-white" />
                            <time className="font-mono text-[0.68rem] text-accent font-bold uppercase">
                              {evt.date}
                            </time>
                            <p className="font-serif text-ink text-[0.8rem] leading-snug">{evt.event}</p>
                            {evt.sourceRef && (
                              <span className="text-[0.65rem] text-ink-muted italic block">
                                Rujukan: {evt.sourceRef}
                              </span>
                            )}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}

                {/* 4. DRAFT ARTICLE VIEW & EDITOR */}
                {taskOutput.draft && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-rule pb-2">
                      <h3 className="font-serif font-bold text-ink text-sm flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-accent" />
                        <span>Draf Editorial Broadsheet (Belum Terbit)</span>
                      </h3>
                      <span className="text-[0.65rem] kicker bg-amber-100 text-amber-900 px-2 py-0.5">
                        Status: UNPUBLISHED DRAFT
                      </span>
                    </div>

                    {/* Headline Suggestions */}
                    <div className="space-y-1 text-xs">
                      <label className="kicker text-[0.65rem] text-ink-muted uppercase block">
                        Pilihan Judul Berita Utama (Klik untuk memakai):
                      </label>
                      <div className="space-y-1">
                        {taskOutput.draft.suggestedHeadlines?.map((hl, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setDraftTitle(hl)}
                            className="block w-full text-left p-1.5 border border-rule/70 hover:border-ink bg-paper/30 font-serif text-[0.85rem] text-ink transition-colors"
                          >
                            &bull; {hl}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Editable Title */}
                    <div className="space-y-1 text-xs">
                      <label className="kicker text-[0.65rem] text-ink-muted uppercase block">
                        Judul Utama (Headline)
                      </label>
                      <input
                        type="text"
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        className="w-full font-serif font-bold text-base p-2 border border-rule bg-paper focus:bg-white focus:outline-hidden text-ink"
                      />
                    </div>

                    {/* Editable Deck */}
                    <div className="space-y-1 text-xs">
                      <label className="kicker text-[0.65rem] text-ink-muted uppercase block">
                        Konteks Ringkas (Deck / Subhead)
                      </label>
                      <input
                        type="text"
                        value={draftDeck}
                        onChange={(e) => setDraftDeck(e.target.value)}
                        className="w-full text-xs p-2 border border-rule bg-paper focus:bg-white focus:outline-hidden text-ink"
                      />
                    </div>

                    {/* Editable Body */}
                    <div className="space-y-1 text-xs">
                      <label className="kicker text-[0.65rem] text-ink-muted uppercase block">
                        Badan Artikel (Markdown)
                      </label>
                      <textarea
                        rows={10}
                        value={draftBody}
                        onChange={(e) => setDraftBody(e.target.value)}
                        className="w-full font-serif text-sm p-3 border border-rule bg-paper focus:bg-white focus:outline-hidden leading-relaxed text-ink"
                      />
                    </div>

                    {/* Editorial Verification Checklist */}
                    {taskOutput.draft.editorialChecklist?.length > 0 && (
                      <div className="border border-rule p-3 bg-paper-dark/20 text-xs space-y-2">
                        <span className="kicker text-[0.65rem] text-ink uppercase font-bold block">
                          Daftar Periksa Wajib Sebelum Diterbitkan:
                        </span>
                        <ul className="space-y-1 text-ink-muted">
                          {taskOutput.draft.editorialChecklist.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <input type="checkbox" className="mt-0.5" id={`chk-${idx}`} />
                              <label htmlFor={`chk-${idx}`} className="text-[0.75rem] leading-snug cursor-pointer">
                                {item}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Save Action Bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-rule">
                      <button
                        type="button"
                        onClick={handleRunAiTask}
                        className="kicker inline-flex items-center gap-1.5 border border-rule bg-white text-ink px-3 py-1.5 text-xs hover:border-ink transition-colors"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Jalankan Ulang (Regenerate)</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveDraft}
                        disabled={isSavingDraft || !draftTitle || !draftBody}
                        className="kicker inline-flex items-center gap-2 border border-accent bg-accent text-white px-4 py-2 text-xs hover:bg-black transition-colors disabled:opacity-50"
                      >
                        {isSavingDraft ? (
                          <>
                            <RotateCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Menyimpan ke Antrean...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            <span>Simpan Sebagai Draf Editorial</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. VERIFICATION CHECKLIST VIEW */}
                {taskOutput.checklist && (
                  <div className="space-y-4 text-xs">
                    <div className="border-b border-rule pb-2">
                      <h3 className="font-serif font-bold text-ink text-sm flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-accent" />
                        <span>Pemeriksaan Integritas & Pernyataan Kritis</span>
                      </h3>
                    </div>

                    <div className="border border-rule p-3 bg-white space-y-2">
                      <h4 className="font-serif font-bold text-ink border-b border-rule pb-1">
                        Pernyataan Berisiko Tinggi Yang Memerlukan Verifikasi Sumber
                      </h4>
                      <ul className="space-y-2">
                        {taskOutput.checklist.flaggedItems.map((flag, idx) => (
                          <li key={idx} className="p-2 border border-amber-200 bg-amber-50/50 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-ink font-serif">{flag.item}</strong>
                              <p className="text-[0.75rem] text-amber-900 mt-0.5">{flag.reason}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
