"use client";

import { useState } from "react";
import {
  RefreshCw,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Power,
  PowerOff,
  Eye,
  EyeOff,
  Star,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { OfficialSourceEntry } from "@/data/sources/directory";

export interface SourceItem {
  id: string;
  name: string;
  institution?: string | null;
  base_url?: string | null;
  verified_endpoint?: string | null;
  is_enabled: boolean;
  last_successful_run?: string | null;
  last_error?: string | null;
  totalRecords?: number;
}

export interface CuratedRecordItem {
  id: string;
  sourceId: string;
  sourceName: string;
  title: string;
  summary: string;
  canonicalUrl: string;
  publishedAt: string;
  category: string;
  reviewStatus: "pending" | "approved" | "rejected";
  isFeatured?: boolean;
}

interface ExternalSourcesClientProps {
  initialSources: SourceItem[];
  sourceDirectory: OfficialSourceEntry[];
  initialRecords: CuratedRecordItem[];
}

export function ExternalSourcesClient({
  initialSources,
  sourceDirectory,
  initialRecords,
}: ExternalSourcesClientProps) {
  const [activeTab, setActiveTab] = useState<"health" | "curation" | "directory">("health");
  const [sources, setSources] = useState<SourceItem[]>(initialSources);
  const [records, setRecords] = useState<CuratedRecordItem[]>(initialRecords);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncMsg, setSyncMsg] = useState<{ id: string; text: string; isError?: boolean } | null>(null);

  // New source form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBaseUrl, setNewBaseUrl] = useState("");
  const [newRssUrl, setNewRssUrl] = useState("");
  const [newCategory, setNewCategory] = useState("Berita Hukum");
  const [savingSource, setSavingSource] = useState(false);

  // Stats calculation
  const activeSourcesCount = sources.filter((s) => s.is_enabled).length;
  const inactiveSourcesCount = sources.filter((s) => !s.is_enabled).length;
  const totalRetrievedCount = records.length;

  const handleToggleEnable = async (source: SourceItem) => {
    const updatedStatus = !source.is_enabled;
    try {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        await (supabase as any)
          .from("sources")
          .update({ is_enabled: updatedStatus })
          .eq("id", source.id);
      }
      setSources((prev) =>
        prev.map((s) => (s.id === source.id ? { ...s, is_enabled: updatedStatus } : s))
      );
    } catch {
      // ignore
    }
  };

  const handleSyncSource = async (sourceId: string) => {
    setSyncingId(sourceId);
    setSyncMsg(null);

    try {
      const res = await fetch("/api/admin/sources/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceId }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setSyncMsg({
          id: sourceId,
          text: `Gagal sinkronisasi: ${data.error || "Kesalahan jaringan"}`,
          isError: true,
        });
      } else {
        setSyncMsg({
          id: sourceId,
          text: `Berhasil sinkronisasi! Ditemukan ${data.totalFetched} item, ${data.newInserted} baru diimpor.`,
          isError: false,
        });
        setSources((prev) =>
          prev.map((s) =>
            s.id === sourceId
              ? { ...s, last_successful_run: new Date().toISOString(), last_error: null }
              : s
          )
        );
      }
    } catch (err: unknown) {
      setSyncMsg({
        id: sourceId,
        text: err instanceof Error ? err.message : "Sinkronisasi gagal",
        isError: true,
      });
    } finally {
      setSyncingId(null);
    }
  };

  const handleCurateStatus = async (id: string, newStatus: "approved" | "rejected") => {
    try {
      const res = await fetch("/api/admin/sources/curate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, review_status: newStatus }),
      });
      if (res.ok) {
        setRecords((prev) =>
          prev.map((r) => (r.id === id ? { ...r, reviewStatus: newStatus } : r))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleFeatured = async (record: CuratedRecordItem) => {
    const nextFeatured = !record.isFeatured;
    try {
      const res = await fetch("/api/admin/sources/curate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: record.id, is_featured: nextFeatured }),
      });
      if (res.ok) {
        setRecords((prev) =>
          prev.map((r) => (r.id === record.id ? { ...r, isFeatured: nextFeatured } : r))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRssUrl.trim()) return;

    setSavingSource(true);
    try {
      const newSourceData = {
        name: newName.trim(),
        base_url: newBaseUrl.trim() || newRssUrl.trim(),
        verified_endpoint: newRssUrl.trim(),
        source_type: "publisher",
        access_method: "rss",
        is_enabled: true,
        description: `Feed RSS Resmi kategori ${newCategory}`,
      };

      const supabase = getSupabaseBrowserClient();
      let createdId = `src-${Date.now()}`;

      if (supabase) {
        const { data, error } = await (supabase as any)
          .from("sources")
          .insert(newSourceData)
          .select("id")
          .single();

        if (error) throw error;
        if (data) createdId = data.id;
      }

      setSources((prev) => [
        ...prev,
        {
          id: createdId,
          name: newName,
          base_url: newBaseUrl,
          verified_endpoint: newRssUrl,
          is_enabled: true,
        },
      ]);

      setNewName("");
      setNewBaseUrl("");
      setNewRssUrl("");
      setShowAddForm(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan sumber baru");
    } finally {
      setSavingSource(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 3 Metric Cards for Health Monitoring */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-rule bg-paper-light p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-sans text-[0.625rem] font-bold uppercase tracking-wider text-ink-muted">
              Sumber Aktif
            </span>
            <Power className="w-3.5 h-3.5 text-green-700" />
          </div>
          <div className="font-serif text-2xl font-bold text-ink">
            {activeSourcesCount} Sumber
          </div>
          <span className="text-[0.625rem] font-sans text-ink-muted">
            {inactiveSourcesCount} nonaktif
          </span>
        </div>

        <div className="border border-rule bg-paper-light p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-sans text-[0.625rem] font-bold uppercase tracking-wider text-ink-muted">
              Total Berita Terkumpul
            </span>
            <BookOpen className="w-3.5 h-3.5 text-accent" />
          </div>
          <div className="font-serif text-2xl font-bold text-ink">
            {totalRetrievedCount} Item
          </div>
          <span className="text-[0.625rem] font-sans text-ink-muted">
            Dari seluruh kanal resmi
          </span>
        </div>

        <div className="border border-rule bg-paper-light p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-sans text-[0.625rem] font-bold uppercase tracking-wider text-ink-muted">
              Status Sinkronisasi Otomatis
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
          </div>
          <div className="font-serif text-sm font-bold text-ink">
            Terkoneksi Cron Server
          </div>
          <span className="text-[0.625rem] font-sans text-ink-muted">
            Interval: Setiap 6 Jam / Manual
          </span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b-2 border-ink pb-2 text-xs font-sans">
        <button
          type="button"
          onClick={() => setActiveTab("health")}
          className={`px-3 py-1.5 font-bold uppercase tracking-wider transition-colors ${
            activeTab === "health"
              ? "bg-ink text-paper"
              : "border border-rule bg-white hover:border-ink text-ink"
          }`}
        >
          Konektor & Status Kesehatan ({sources.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("curation")}
          className={`px-3 py-1.5 font-bold uppercase tracking-wider transition-colors ${
            activeTab === "curation"
              ? "bg-ink text-paper"
              : "border border-rule bg-white hover:border-ink text-ink"
          }`}
        >
          Kurasi Berita Eksternal ({records.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("directory")}
          className={`px-3 py-1.5 font-bold uppercase tracking-wider transition-colors ${
            activeTab === "directory"
              ? "bg-ink text-paper"
              : "border border-rule bg-white hover:border-ink text-ink"
          }`}
        >
          Direktori Lembaga Resmi ({sourceDirectory.length})
        </button>
      </div>

      {/* Sync Message Alert */}
      {syncMsg && (
        <div
          className={`p-3 text-xs flex items-center gap-2 border ${
            syncMsg.isError
              ? "bg-red-100 border-red-300 text-red-900"
              : "bg-green-100 border-green-300 text-green-900"
          }`}
        >
          {syncMsg.isError ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{syncMsg.text}</span>
        </div>
      )}

      {/* TAB 1: KONEKTOR & STATUS KESEHATAN */}
      {activeTab === "health" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-ink uppercase tracking-wider">
              Konektor Feed Aktif
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="kicker inline-flex items-center gap-1.5 border border-ink bg-ink text-paper px-3 py-1.5 text-xs hover:bg-paper hover:text-ink transition-colors font-bold uppercase tracking-wider"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? "Tutup Form" : "Tambah Sumber RSS"}</span>
            </button>
          </div>

          {/* Add form drawer */}
          {showAddForm && (
            <form
              onSubmit={handleAddSource}
              className="border-2 border-ink bg-paper p-5 space-y-4 font-serif"
            >
              <div className="border-b border-rule pb-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-ink">
                  Konfigurasi Sumber Baru (RSS / Feed)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-sans font-bold uppercase tracking-wider text-ink-muted text-[0.625rem] mb-1">
                    Nama Sumber / Media *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="misal: Lembaran Berita Mahkamah Agung"
                    className="w-full px-2.5 py-1.5 border border-rule bg-white text-ink text-xs focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block font-sans font-bold uppercase tracking-wider text-ink-muted text-[0.625rem] mb-1">
                    Website URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={newBaseUrl}
                    onChange={(e) => setNewBaseUrl(e.target.value)}
                    placeholder="https://contoh-portal-hukum.go.id"
                    className="w-full px-2.5 py-1.5 border border-rule bg-white text-ink text-xs focus:outline-none focus:border-ink font-mono"
                  />
                </div>

                <div>
                  <label className="block font-sans font-bold uppercase tracking-wider text-ink-muted text-[0.625rem] mb-1">
                    URL RSS / Atom Feed *
                  </label>
                  <input
                    type="url"
                    required
                    value={newRssUrl}
                    onChange={(e) => setNewRssUrl(e.target.value)}
                    placeholder="https://contoh-portal-hukum.go.id/feed.xml"
                    className="w-full px-2.5 py-1.5 border border-rule bg-white text-ink text-xs focus:outline-none focus:border-ink font-mono"
                  />
                </div>

                <div>
                  <label className="block font-sans font-bold uppercase tracking-wider text-ink-muted text-[0.625rem] mb-1">
                    Kategori Rubrikasi *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-rule bg-white text-ink text-xs focus:outline-none focus:border-ink"
                  >
                    <option value="Berita Hukum">Berita Hukum Nasional</option>
                    <option value="Perkara & Putusan">Perkara & Putusan</option>
                    <option value="Regulasi">Regulasi</option>
                    <option value="Merek & HKI">Merek & HKI</option>
                    <option value="Hukum Bisnis">Hukum Bisnis</option>
                    <option value="Pengetahuan Hukum">Pengetahuan Hukum</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 font-sans">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="border border-rule px-3 py-1.5 text-xs hover:bg-paper-dark"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingSource}
                  className="bg-ink text-paper px-4 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-ink-soft transition-colors disabled:opacity-50"
                >
                  {savingSource ? "Menyimpan..." : "Simpan Sumber"}
                </button>
              </div>
            </form>
          )}

          {/* Sources table */}
          <div className="border border-rule bg-white overflow-hidden">
            <table className="w-full text-left text-xs font-serif">
              <thead className="bg-paper-dark/60 font-sans uppercase tracking-wider text-[0.625rem] border-b border-rule text-ink-muted">
                <tr>
                  <th className="py-2.5 px-4">Nama Sumber</th>
                  <th className="py-2.5 px-4">Endpoint</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Terakhir Sukses</th>
                  <th className="py-2.5 px-4">Error Terakhir</th>
                  <th className="py-2.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule-soft">
                {sources.map((src) => {
                  const isSyncing = syncingId === src.id;
                  return (
                    <tr key={src.id} className="hover:bg-paper-light/50 transition-colors">
                      <td className="py-3 px-4">
                        <strong className="text-ink text-sm block">{src.name}</strong>
                        {src.base_url && (
                          <a
                            href={src.base_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[0.6875rem] text-ink-muted hover:underline flex items-center gap-1"
                          >
                            <span>{src.base_url}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-[0.6875rem] text-ink-muted max-w-[180px] truncate">
                        {src.verified_endpoint || "Kurasi Manual"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleEnable(src)}
                          className={`text-[0.625rem] font-bold uppercase tracking-wider px-2 py-0.5 border flex items-center gap-1 ${
                            src.is_enabled
                              ? "bg-green-100 text-green-900 border-green-300"
                              : "bg-gray-100 text-gray-700 border-gray-300"
                          }`}
                        >
                          {src.is_enabled ? (
                            <>
                              <Power className="w-3 h-3 text-green-700" /> Aktif
                            </>
                          ) : (
                            <>
                              <PowerOff className="w-3 h-3 text-gray-500" /> Nonaktif
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-sans text-[0.6875rem] text-ink-muted">
                        {src.last_successful_run ? (
                          formatDate(src.last_successful_run, "short")
                        ) : (
                          <span className="italic text-gray-400">Belum ada</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-sans text-[0.6875rem] text-red-600 max-w-[160px] truncate">
                        {src.last_error || "-"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right font-sans">
                        <button
                          type="button"
                          disabled={isSyncing || !src.is_enabled || !src.verified_endpoint}
                          onClick={() => handleSyncSource(src.id)}
                          className="inline-flex items-center gap-1 border border-ink bg-paper px-2.5 py-1 text-[0.6875rem] font-semibold hover:bg-ink hover:text-paper transition-colors disabled:opacity-40"
                        >
                          <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
                          <span>{isSyncing ? "Menyinkronkan..." : "Sinkronkan"}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: EDITORIAL CURATION */}
      {activeTab === "curation" && (
        <div className="space-y-4">
          <div className="border-b border-rule pb-2 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-sm text-ink uppercase tracking-wider">
                Meja Kurasi Redaksi — Warta Eksternal
              </h3>
              <p className="font-serif text-xs text-ink-muted italic">
                Setujui warta untuk tampil di halaman publik, sembunyikan berita yang tidak relevan, atau sorot sebagai warta pilihan.
              </p>
            </div>
            <span className="font-sans text-[0.625rem] text-ink-muted uppercase tracking-wider font-semibold">
              Total {records.length} Berita Terkumpul
            </span>
          </div>

          <div className="divide-y divide-rule border border-rule bg-white">
            {records.length === 0 ? (
              <div className="py-8 text-center text-xs text-ink-muted font-serif">
                Belum ada berita eksternal yang diimpor. Jalankan sinkronisasi di tab &quot;Konektor &amp; Status Kesehatan&quot;.
              </div>
            ) : (
              records.map((item) => {
                const isApproved = item.reviewStatus === "approved";
                return (
                  <div
                    key={item.id}
                    className={`p-4 flex flex-col md:flex-row md:items-start justify-between gap-4 transition-colors ${
                      isApproved ? "bg-white" : "bg-paper-light/60 opacity-75"
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[0.5625rem] font-bold uppercase tracking-wider px-1.5 py-0.5 ${
                            isApproved
                              ? "bg-green-100 text-green-900 border border-green-300"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {isApproved ? "Tampil di Publik" : "Disembunyikan"}
                        </span>
                        {item.isFeatured && (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[0.5625rem] font-bold uppercase px-1.5 py-0.5 flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-amber-700 text-amber-700" />
                            <span>Pilihan Redaksi</span>
                          </span>
                        )}
                        <span className="font-sans text-[0.625rem] font-bold uppercase tracking-wider text-accent">
                          {item.sourceName}
                        </span>
                        <span className="text-rule">•</span>
                        <span className="font-sans text-[0.625rem] uppercase tracking-wider text-ink-muted">
                          Kategori: {item.category}
                        </span>
                        <span className="text-rule">•</span>
                        <time className="font-sans text-[0.625rem] uppercase tracking-wider text-ink-muted">
                          {formatDate(item.publishedAt, "short")}
                        </time>
                      </div>

                      <h4 className="font-serif font-bold text-sm text-ink leading-snug">
                        <a
                          href={item.canonicalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1"
                        >
                          <span>{item.title}</span>
                          <ExternalLink className="w-3 h-3 text-ink-muted shrink-0" />
                        </a>
                      </h4>

                      <p className="font-serif text-xs text-ink-soft leading-relaxed line-clamp-2">
                        {item.summary}
                      </p>
                    </div>

                    {/* Curation Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 font-sans text-xs">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(item)}
                        className={`p-1.5 border text-xs flex items-center gap-1 ${
                          item.isFeatured
                            ? "bg-amber-100 border-amber-300 text-amber-900"
                            : "border-rule bg-white hover:border-ink text-ink-muted"
                        }`}
                        title={item.isFeatured ? "Batal Sorot" : "Sorot di Halaman Depan"}
                      >
                        <Star className={`w-3.5 h-3.5 ${item.isFeatured ? "fill-amber-700 text-amber-700" : ""}`} />
                        <span className="text-[0.625rem] uppercase font-bold hidden sm:inline">
                          {item.isFeatured ? "Disorot" : "Sorot"}
                        </span>
                      </button>

                      {isApproved ? (
                        <button
                          type="button"
                          onClick={() => handleCurateStatus(item.id, "rejected")}
                          className="border border-rule bg-white hover:bg-red-50 text-red-700 px-2.5 py-1.5 text-[0.625rem] uppercase font-bold flex items-center gap-1"
                        >
                          <EyeOff className="w-3 h-3" />
                          <span>Sembunyikan</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleCurateStatus(item.id, "approved")}
                          className="border border-green-700 bg-green-50 text-green-900 px-2.5 py-1.5 text-[0.625rem] uppercase font-bold flex items-center gap-1 hover:bg-green-100"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Tampilkan</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: DIREKTORI RESMI LEMBAGA HUKUM */}
      {activeTab === "directory" && (
        <div className="space-y-4">
          <div className="border-b border-rule pb-2">
            <h3 className="font-serif font-bold text-sm text-ink uppercase tracking-wider">
              Direktori Sumber & Investigasi Kepatuhan Akses (Official Source Directory)
            </h3>
            <p className="font-serif text-xs text-ink-muted italic">
              Dokumentasi transparansi metode integrasi resmi, status WAF, hak cipta, dan syarat penggunaan tanpa manipulasi data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sourceDirectory.map((entry) => (
              <div
                key={entry.id}
                className="border border-rule bg-paper-light p-4 space-y-3 font-serif flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-sans text-[0.625rem] font-bold uppercase tracking-wider text-accent">
                      {entry.category}
                    </span>
                    <span
                      className={`text-[0.5625rem] font-bold uppercase tracking-widest px-1.5 py-0.5 border ${
                        entry.integrationStatus === "integrated"
                          ? "bg-green-100 text-green-900 border-green-300"
                          : entry.integrationStatus === "requires_auth"
                          ? "bg-blue-100 text-blue-900 border-blue-300"
                          : entry.integrationStatus === "manual_only"
                          ? "bg-amber-100 text-amber-900 border-amber-300"
                          : "bg-gray-100 text-gray-700 border-gray-300"
                      }`}
                    >
                      {entry.integrationStatus === "integrated"
                        ? "Otomatis (RSS Terhubung)"
                        : entry.integrationStatus === "requires_auth"
                        ? "Perlu Kredensial API"
                        : entry.integrationStatus === "manual_only"
                        ? "Kurasi Manual Terverifikasi"
                        : "Dibatasi (Terms of Use)"}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-ink mb-1">{entry.name}</h4>
                  <a
                    href={entry.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[0.6875rem] text-ink-muted hover:underline flex items-center gap-1 mb-2"
                  >
                    <span>{entry.websiteUrl}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>

                  <div className="space-y-1.5 text-xs border-t border-rule-soft pt-2">
                    <div>
                      <span className="font-sans font-bold text-[0.625rem] text-ink uppercase block">
                        Metode Integrasi:
                      </span>
                      <span className="text-ink-soft">{entry.integrationMethod}</span>
                    </div>

                    <div>
                      <span className="font-sans font-bold text-[0.625rem] text-ink uppercase block">
                        Batasan Akses & Kebijakan Bot:
                      </span>
                      <p className="text-[0.6875rem] text-ink-muted leading-snug">
                        {entry.accessRestrictions}
                      </p>
                    </div>

                    <div>
                      <span className="font-sans font-bold text-[0.625rem] text-ink uppercase block">
                        Kewajiban Atribusi:
                      </span>
                      <p className="text-[0.6875rem] text-ink-muted leading-snug">
                        {entry.attributionRequirements}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-rule-soft text-[0.625rem] font-sans text-ink-muted">
                  <strong>Catatan Redaksi:</strong> {entry.notes}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
