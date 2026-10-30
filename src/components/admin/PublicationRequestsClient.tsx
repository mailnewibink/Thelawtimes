"use client";

import { useState } from "react";
import {
  Search,
  FileText,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  AlertCircle,
  FileDown,
  Edit3,
  Save,
} from "lucide-react";
import type { ClientPublicationRequest } from "@/types/content";
import {
  publicationTypeLabels,
  publicationStatusLabels,
} from "@/data/publication-services";
import { formatDate } from "@/lib/utils";

interface PublicationRequestsClientProps {
  initialRequests: ClientPublicationRequest[];
}

export function PublicationRequestsClient({
  initialRequests,
}: PublicationRequestsClientProps) {
  const [requests, setRequests] = useState<ClientPublicationRequest[]>(initialRequests);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<ClientPublicationRequest | null>(
    initialRequests[0] || null
  );

  // Status and notes update form state
  const [newStatus, setNewStatus] = useState<string>("");
  const [internalNotes, setInternalNotes] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // When selected request changes, initialize edit form
  const handleSelectRequest = (req: ClientPublicationRequest) => {
    setSelectedRequest(req);
    setNewStatus(req.status);
    setInternalNotes(req.internalNotes || "");
    setNotification(null);
  };

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    if (statusFilter !== "all" && req.status !== statusFilter) return false;
    if (typeFilter !== "all" && req.publicationType !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRef = req.referenceNumber.toLowerCase().includes(q);
      const matchName = req.applicantName.toLowerCase().includes(q);
      const matchOrg = req.organization?.toLowerCase().includes(q) ?? false;
      const matchTitle = req.proposedTitle.toLowerCase().includes(q);
      if (!matchRef && !matchName && !matchOrg && !matchTitle) return false;
    }
    return true;
  });

  // Handle saving status and internal notes
  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    setIsUpdating(true);
    setNotification(null);

    try {
      const res = await fetch(
        `/api/admin/publication-requests/${selectedRequest.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: newStatus,
            internalNotes: internalNotes.trim(),
          }),
        }
      );

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal memperbarui permohonan");
      }

      // Update state locally
      setRequests((prev) =>
        prev.map((r) =>
          r.id === selectedRequest.id
            ? {
                ...r,
                status: newStatus as any,
                internalNotes: internalNotes.trim(),
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );

      setSelectedRequest((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus as any,
              internalNotes: internalNotes.trim(),
              updatedAt: new Date().toISOString(),
            }
          : null
      );

      setNotification({
        type: "success",
        message: "Status dan catatan internal berhasil disimpan.",
      });
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Terjadi kesalahan saat menyimpan pembaruan.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Format clean WhatsApp phone link (e.g. +62 812 -> 62812)
  const getCleanPhone = (phone: string) => {
    const digits = phone.replace(/[^0-9]/g, "");
    if (digits.startsWith("0")) {
      return `62${digits.slice(1)}`;
    }
    return digits;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="border border-rule bg-paper-light p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nomor ref, nama pemohon, firma hukum, atau judul perkara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-serif border border-rule bg-paper text-ink focus:outline-none focus:border-ink"
            />
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-2">
            <span className="text-[0.6875rem] kicker uppercase text-ink-muted shrink-0">
              Jenis:
            </span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-rule bg-paper text-ink px-2.5 py-1.5 text-xs font-sans focus:outline-none focus:border-ink"
            >
              <option value="all">Semua Jenis Publikasi</option>
              <option value="case_publication">Publikasi Perkara</option>
              <option value="ruling_publication">Publikasi Putusan</option>
              <option value="legal_opinion">Artikel Hukum & Opini</option>
              <option value="ip_publication">Publikasi Merek & HKI</option>
              <option value="sponsored_content">Sponsored Legal Content</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-rule/60 text-xs">
          <span className="text-[0.6875rem] kicker uppercase text-ink-muted mr-1.5">
            Status:
          </span>
          {[
            { key: "all", label: `Semua (${requests.length})` },
            {
              key: "submitted",
              label: `Permohonan Masuk (${requests.filter((r) => r.status === "submitted").length})`,
            },
            {
              key: "contacted",
              label: `Sudah Dihubungi (${requests.filter((r) => r.status === "contacted").length})`,
            },
            {
              key: "under_review",
              label: `Dalam Penelaahan (${requests.filter((r) => r.status === "under_review").length})`,
            },
            {
              key: "approved",
              label: `Disetujui (${requests.filter((r) => r.status === "approved").length})`,
            },
            {
              key: "rejected",
              label: `Ditolak / Batal (${requests.filter((r) => r.status === "rejected").length})`,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`px-2.5 py-1 text-xs font-sans transition-colors ${
                statusFilter === tab.key
                  ? "bg-ink text-paper font-bold"
                  : "bg-paper hover:bg-paper-dark text-ink border border-rule"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Split List and Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Submissions Table / List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-ink-muted pb-1">
            <span>
              Menampilkan <strong>{filteredRequests.length}</strong> permohonan publikasi
            </span>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="border border-dashed border-rule bg-paper p-10 text-center font-serif text-sm text-ink-muted space-y-2">
              <AlertCircle className="w-6 h-6 mx-auto text-ink-muted/60" />
              <p>Tidak ada permohonan publikasi yang cocok dengan kriteria pencarian.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map((req) => {
                const isSelected = selectedRequest?.id === req.id;
                const statusMeta =
                  publicationStatusLabels[req.status] || publicationStatusLabels.submitted;
                const typeLabel =
                  publicationTypeLabels[req.publicationType] || req.publicationType;

                return (
                  <div
                    key={req.id}
                    onClick={() => handleSelectRequest(req)}
                    className={`border transition-all cursor-pointer p-4 bg-paper-light ${
                      isSelected
                        ? "border-ink shadow-sm ring-1 ring-ink"
                        : "border-rule hover:border-ink/60"
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-ink">
                          {req.referenceNumber}
                        </span>
                        <span
                          className={`text-[0.625rem] font-sans px-2 py-0.5 uppercase tracking-wider font-semibold ${statusMeta.badgeClass}`}
                        >
                          {statusMeta.label}
                        </span>
                      </div>
                      <time className="font-serif text-[0.6875rem] text-ink-muted">
                        {formatDate(req.createdAt)}
                      </time>
                    </div>

                    {/* Proposed Title */}
                    <h3 className="font-serif font-bold text-sm text-ink mb-1.5 leading-snug">
                      {req.proposedTitle}
                    </h3>

                    {/* Meta info */}
                    <div className="flex items-center gap-3 text-xs text-ink-soft flex-wrap">
                      <span className="font-sans font-semibold text-[0.6875rem] text-accent uppercase tracking-wider">
                        {typeLabel}
                      </span>
                      <span className="text-rule-soft">·</span>
                      <span className="font-serif text-ink-muted">
                        {req.applicantName}
                        {req.organization ? ` (${req.organization})` : ""}
                      </span>
                      {req.documentName && (
                        <>
                          <span className="text-rule-soft">·</span>
                          <span className="inline-flex items-center gap-1 text-[0.6875rem] font-mono text-ink-muted">
                            <FileText className="w-3 h-3 text-accent" />
                            <span>Dokumen Lampiran</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Request Detail Panel (5 cols) */}
        <div className="lg:col-span-5 border border-ink bg-paper-light p-5 space-y-5 sticky top-6">
          {selectedRequest ? (
            <>
              {/* Header */}
              <div className="border-b border-rule pb-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-ink">
                    {selectedRequest.referenceNumber}
                  </span>
                  <span
                    className={`text-[0.6875rem] font-sans px-2 py-0.5 uppercase tracking-wider font-semibold ${
                      (publicationStatusLabels[selectedRequest.status] || publicationStatusLabels.submitted)
                        .badgeClass
                    }`}
                  >
                    {(publicationStatusLabels[selectedRequest.status] || publicationStatusLabels.submitted).label}
                  </span>
                </div>
                <h2 className="font-serif font-bold text-base text-ink">
                  {selectedRequest.proposedTitle}
                </h2>
                <p className="font-sans text-[0.6875rem] text-accent uppercase tracking-wider font-semibold mt-1">
                  {publicationTypeLabels[selectedRequest.publicationType] || selectedRequest.publicationType}
                </p>
              </div>

              {/* Applicant Info & Direct Contacts */}
              <div className="space-y-2 text-xs border border-rule bg-paper p-3 font-serif">
                <h4 className="kicker uppercase font-bold text-[0.625rem] text-ink-muted mb-1">
                  Identitas & Narahubung Pemohon
                </h4>
                <div className="space-y-1 text-ink">
                  <div className="font-bold">{selectedRequest.applicantName}</div>
                  {selectedRequest.organization && (
                    <div className="text-ink-muted flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span>{selectedRequest.organization}</span>
                    </div>
                  )}
                  <div className="pt-2 flex items-center gap-3 flex-wrap">
                    {/* WhatsApp Click-to-Chat */}
                    <a
                      href={`https://wa.me/${getCleanPhone(selectedRequest.whatsapp)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 font-sans text-xs font-bold transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      <span>WhatsApp: {selectedRequest.whatsapp}</span>
                    </a>

                    {/* Email mailto */}
                    <a
                      href={`mailto:${selectedRequest.email}?subject=Konfirmasi Permohonan Publikasi The Law Times [${selectedRequest.referenceNumber}]`}
                      className="inline-flex items-center gap-1.5 border border-rule hover:border-ink text-ink px-2.5 py-1 font-sans text-xs transition-colors"
                    >
                      <Mail className="w-3 h-3" />
                      <span>{selectedRequest.email}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-1.5 text-xs">
                <h4 className="kicker uppercase font-bold text-[0.625rem] text-ink-muted">
                  Ringkasan Informasi yang Diajukan
                </h4>
                <p className="font-serif leading-relaxed text-ink-soft bg-paper p-3 border border-rule">
                  {selectedRequest.shortDescription}
                </p>
              </div>

              {/* Uploaded Document / File */}
              <div className="space-y-1.5 text-xs">
                <h4 className="kicker uppercase font-bold text-[0.625rem] text-ink-muted">
                  Dokumen Berkas Pendukung
                </h4>
                {selectedRequest.documentName ? (
                  <div className="flex items-center justify-between border border-rule bg-paper p-3">
                    <div className="space-y-0.5">
                      <div className="font-serif font-bold text-ink flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span className="truncate max-w-[200px]">
                          {selectedRequest.documentName}
                        </span>
                      </div>
                      <div className="font-mono text-[0.625rem] text-ink-muted">
                        {selectedRequest.documentSize
                          ? `${(selectedRequest.documentSize / 1024 / 1024).toFixed(2)} MB`
                          : "Salinan Terlampir"}
                      </div>
                    </div>

                    <a
                      href={`/api/admin/publication-requests/${selectedRequest.id}/document`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-ink text-paper hover:bg-ink-soft px-3 py-1.5 text-xs font-sans font-bold uppercase tracking-wider transition-colors"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>Buka Dokumen</span>
                    </a>
                  </div>
                ) : (
                  <p className="font-serif italic text-ink-muted text-xs p-2 bg-paper border border-dashed border-rule">
                    Tidak ada berkas dokumen tambahan yang dilampirkan pemohon.
                  </p>
                )}
              </div>

              {/* Additional Message */}
              {selectedRequest.additionalMessage && (
                <div className="space-y-1 text-xs">
                  <h4 className="kicker uppercase font-bold text-[0.625rem] text-ink-muted">
                    Catatan Khusus dari Pemohon
                  </h4>
                  <p className="font-serif text-ink-soft bg-paper p-2.5 border border-rule italic">
                    &quot;{selectedRequest.additionalMessage}&quot;
                  </p>
                </div>
              )}

              {/* Consent indicator */}
              <div className="flex items-center gap-2 text-xs text-ink-muted pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span className="font-serif text-[0.6875rem]">
                  Pernyataan persetujuan keabsahan & penelaahan redaksi telah dicentang pemohon.
                </span>
              </div>

              {/* Form: Update Status & Internal Notes */}
              <form onSubmit={handleSaveUpdate} className="border-t-2 border-ink pt-4 space-y-4">
                <h3 className="font-serif font-bold text-sm text-ink flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-accent" />
                  <span>Manajemen Redaksi & Catatan Internal</span>
                </h3>

                {notification && (
                  <div
                    className={`p-2.5 text-xs font-serif border ${
                      notification.type === "success"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                        : "bg-rose-50 border-rose-300 text-rose-900"
                    }`}
                  >
                    {notification.message}
                  </div>
                )}

                {/* Status Dropdown */}
                <div>
                  <label className="kicker block text-[0.625rem] text-ink-muted mb-1">
                    Pembaruan Status Penanganan
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full border border-rule bg-paper text-ink px-3 py-2 text-xs font-sans focus:outline-none focus:border-ink"
                  >
                    <option value="submitted">Permohonan Masuk (Submitted)</option>
                    <option value="contacted">Sudah Dihubungi (Contacted via WA/Email)</option>
                    <option value="under_review">Dalam Penelaahan Redaksi (Under Review)</option>
                    <option value="approved">Disetujui untuk Dipublikasikan (Approved)</option>
                    <option value="rejected">Ditolak / Batal / Arsipkan (Rejected)</option>
                  </select>
                </div>

                {/* Internal Notes */}
                <div>
                  <label className="kicker block text-[0.625rem] text-ink-muted mb-1">
                    Catatan Internal Redaksi (Rahasia / Tidak Terlihat Pemohon)
                  </label>
                  <textarea
                    rows={4}
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Contoh: 30 Okt 2026: Telah dicek pada SIPP PN Jakarta Pusat, perkara terdaftar. Memerlukan penulisan judul yang netral..."
                    className="w-full border border-rule bg-paper text-ink p-2.5 font-serif text-xs leading-relaxed focus:outline-none focus:border-ink"
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="inline-flex items-center gap-1.5 bg-ink text-paper hover:bg-paper hover:text-ink border border-ink px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isUpdating ? "Menyimpan..." : "Simpan Perubahan"}</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-12 text-ink-muted font-serif text-xs">
              Pilih permohonan dari daftar di samping untuk melihat rincian pemohon dan mengelola status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
