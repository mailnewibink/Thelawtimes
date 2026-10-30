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
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface SourceItem {
  id: string;
  name: string;
  institution?: string | null;
  base_url?: string | null;
  verified_endpoint?: string | null;
  is_enabled: boolean;
  last_successful_run?: string | null;
  last_error?: string | null;
}

interface ExternalSourcesClientProps {
  initialSources: SourceItem[];
}

export function ExternalSourcesClient({ initialSources }: ExternalSourcesClientProps) {
  const [sources, setSources] = useState<SourceItem[]>(initialSources);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncMsg, setSyncMsg] = useState<{ id: string; text: string; isError?: boolean } | null>(null);

  // New source form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBaseUrl, setNewBaseUrl] = useState("");
  const [newRssUrl, setNewRssUrl] = useState("");
  const [newCategory, setNewCategory] = useState("Berita Hukum");
  const [savingSource, setSavingSource] = useState(false);

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
      // optimistic state rollback
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
          text: `Berhasil sinkronisasi! Ditemukan ${data.totalFetched} item, ${data.newInserted} berita baru diimpor.`,
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
      {/* Header action */}
      <div className="flex items-center justify-between border-b border-rule pb-3">
        <div>
          <h2 className="font-serif font-bold text-base text-ink">
            Daftar Sumber Warta Eksternal & Agregasi RSS
          </h2>
          <p className="font-serif text-xs text-ink-muted italic">
            Konfigurasi feed resmi instansi, regulasi, dan media hukum terverifikasi.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="kicker inline-flex items-center gap-1.5 border border-ink bg-ink text-paper px-3 py-1.5 text-xs hover:bg-paper hover:text-ink transition-colors font-bold uppercase tracking-wider"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAddForm ? "Tutup Form" : "Tambah Sumber RSS"}</span>
        </button>
      </div>

      {/* Add Source Form Drawer */}
      {showAddForm && (
        <form
          onSubmit={handleAddSource}
          className="border-2 border-ink bg-paper p-5 space-y-4 font-serif"
        >
          <div className="border-b border-rule pb-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-ink">
              Konfigurasi Sumber Baru (RSS / Feed)
            </h3>
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
                <option value="Perkara & Putusan">Perkara & Putusan</option>
                <option value="Merek & HKI">Merek & HKI</option>
                <option value="Berita Hukum">Berita Hukum</option>
                <option value="Regulasi">Regulasi</option>
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

      {/* Sync Status Banner */}
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

      {/* Sources List Table */}
      <div className="border border-rule bg-white overflow-hidden">
        <table className="w-full text-left text-xs font-serif">
          <thead className="bg-paper-dark/60 font-sans uppercase tracking-wider text-[0.625rem] border-b border-rule text-ink-muted">
            <tr>
              <th className="py-2.5 px-4">Nama Sumber</th>
              <th className="py-2.5 px-4">Feed Endpoint</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4">Terakhir Sinkronisasi</th>
              <th className="py-2.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule-soft">
            {sources.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-ink-muted">
                  Belum ada sumber warta eksternal yang didaftarkan.
                </td>
              </tr>
            ) : (
              sources.map((src) => {
                const isSyncing = syncingId === src.id;
                return (
                  <tr key={src.id} className="hover:bg-paper-light/50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-ink text-sm block">
                        {src.name}
                      </span>
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
                    <td className="py-3 px-4 font-mono text-[0.6875rem] text-ink-muted max-w-xs truncate">
                      {src.verified_endpoint || src.base_url || "Belum ada endpoint"}
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
                        <span className="italic text-gray-400">Belum pernah</span>
                      )}
                      {src.last_error && (
                        <span className="block text-[0.625rem] text-red-600 truncate max-w-[180px]">
                          Err: {src.last_error}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-right font-sans">
                      <button
                        type="button"
                        disabled={isSyncing || !src.is_enabled}
                        onClick={() => handleSyncSource(src.id)}
                        className="inline-flex items-center gap-1 border border-ink bg-paper px-2.5 py-1 text-[0.6875rem] font-semibold hover:bg-ink hover:text-paper transition-colors disabled:opacity-40"
                      >
                        <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
                        <span>{isSyncing ? "Menyinkronkan..." : "Sinkronkan Feed"}</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
