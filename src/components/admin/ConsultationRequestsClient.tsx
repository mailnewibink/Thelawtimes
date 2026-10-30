"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  MessageSquare,
  Clock,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  ExternalLink,
} from "lucide-react";
import type {
  ConsultationRequest,
  ConsultationRequestStatus,
} from "@/lib/repositories/consultation-requests";

interface ConsultationRequestsClientProps {
  initialRequests: ConsultationRequest[];
}

export function ConsultationRequestsClient({
  initialRequests,
}: ConsultationRequestsClientProps) {
  const [requests, setRequests] = useState<ConsultationRequest[]>(initialRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null);

  const [savingStatus, setSavingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<ConsultationRequestStatus>("Baru");
  const [internalNotes, setInternalNotes] = useState("");
  const [updateFeedback, setUpdateFeedback] = useState<string | null>(null);

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.companyOrBrand && r.companyOrBrand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.whatsapp.includes(searchQuery);

    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesService = serviceFilter === "all" || r.serviceType === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  const openDetailModal = (req: ConsultationRequest) => {
    setSelectedRequest(req);
    setNewStatus(req.status);
    setInternalNotes(req.internalNotes || "");
    setUpdateFeedback(null);
  };

  const closeDetailModal = () => {
    setSelectedRequest(null);
    setUpdateFeedback(null);
  };

  const handleUpdate = async () => {
    if (!selectedRequest) return;
    setSavingStatus(true);
    setUpdateFeedback(null);

    try {
      const res = await fetch(`/api/admin/consultation-requests/${selectedRequest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          internalNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui status");

      // Update state
      setRequests((prev) =>
        prev.map((r) => (r.id === selectedRequest.id ? data.data : r))
      );
      setSelectedRequest(data.data);
      setUpdateFeedback("Status & catatan berhasil diperbarui.");
    } catch (err) {
      setUpdateFeedback(err instanceof Error ? err.message : "Gagal menyimpan perubahan.");
    } finally {
      setSavingStatus(false);
    }
  };

  const getStatusBadge = (status: ConsultationRequestStatus) => {
    switch (status) {
      case "Baru":
        return "bg-blue-100 text-blue-900 border-blue-300";
      case "Diproses":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "Dihubungi":
        return "bg-purple-100 text-purple-900 border-purple-300";
      case "Selesai":
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. FILTER & SEARCH TOOLBAR */}
      <div className="bg-paper border border-rule p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              placeholder="Cari nama, perusahaan, nomor telepon, email, atau no. registrasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-serif border border-rule bg-paper focus:outline-hidden focus:border-ink"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs font-sans border border-rule bg-paper focus:outline-hidden focus:border-ink cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="Baru">Status: Baru</option>
              <option value="Diproses">Status: Diproses</option>
              <option value="Dihubungi">Status: Dihubungi</option>
              <option value="Selesai">Status: Selesai</option>
            </select>
          </div>

          {/* Service Filter */}
          <div className="md:col-span-3">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs font-sans border border-rule bg-paper focus:outline-hidden focus:border-ink cursor-pointer"
            >
              <option value="all">Semua Layanan</option>
              <option value="Pendaftaran Merek">Pendaftaran Merek</option>
              <option value="Kekayaan Intelektual">Kekayaan Intelektual</option>
              <option value="Perizinan BPOM">Perizinan BPOM</option>
              <option value="Pendampingan Hukum">Pendampingan Hukum</option>
              <option value="Legalitas Usaha">Legalitas Usaha</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-[0.68rem] kicker text-ink-muted border-t border-rule/50 pt-2">
          <span>MENAMPILKAN {filteredRequests.length} DARI TOTAL {requests.length} PERMINTAAN KONSULTASI</span>
          <span>SISTEM CMS THE LAW TIMES</span>
        </div>
      </div>

      {/* 2. REQUESTS TABLE */}
      <div className="border border-rule bg-paper overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b-2 border-ink bg-paper-dark/40 font-sans font-bold kicker text-ink text-[0.68rem]">
              <th className="py-2.5 px-3">No. Registrasi</th>
              <th className="py-2.5 px-3">Pemohon / Perusahaan</th>
              <th className="py-2.5 px-3">Layanan</th>
              <th className="py-2.5 px-3">Kontak</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Tanggal</th>
              <th className="py-2.5 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule/60 font-serif">
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-ink-muted italic">
                  Tidak ada permintaan konsultasi yang cocok dengan kriteria pencarian.
                </td>
              </tr>
            ) : (
              filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-paper-dark/20 transition-colors">
                  {/* Ref */}
                  <td className="py-3 px-3 font-mono text-[0.72rem] font-bold text-accent whitespace-nowrap">
                    {req.referenceNumber}
                  </td>

                  {/* Name & Org */}
                  <td className="py-3 px-3">
                    <span className="font-bold text-ink block">{req.fullName}</span>
                    {req.companyOrBrand && (
                      <span className="text-[0.68rem] text-ink-muted italic flex items-center gap-1">
                        <Building className="w-3 h-3 text-ink-muted" />
                        <span>{req.companyOrBrand}</span>
                      </span>
                    )}
                  </td>

                  {/* Service */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-sans text-[0.72rem] font-medium text-ink">
                      {req.serviceType}
                    </span>
                  </td>

                  {/* Contact */}
                  <td className="py-3 px-3 whitespace-nowrap space-y-0.5">
                    <a
                      href={`https://wa.me/${req.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-800 hover:underline flex items-center gap-1 text-[0.68rem] font-mono"
                    >
                      <Phone className="w-3 h-3 text-emerald-700" />
                      <span>{req.whatsapp}</span>
                    </a>
                    <span className="text-ink-muted block text-[0.65rem] truncate max-w-[140px]">
                      {req.email}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 text-[0.65rem] font-sans font-bold uppercase border ${getStatusBadge(
                        req.status
                      )}`}
                    >
                      {req.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-3 whitespace-nowrap text-ink-muted text-[0.68rem] font-mono">
                    {new Date(req.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => openDetailModal(req)}
                      className="font-sans text-[0.68rem] font-bold kicker bg-ink text-paper px-2.5 py-1 uppercase tracking-wider hover:bg-accent transition-colors shadow-xs"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 3. DETAIL & STATUS MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-ink/70 flex items-center justify-center p-4">
          <div className="bg-paper border-2 border-ink max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            {/* Header */}
            <div className="border-b-2 border-ink pb-3 flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-accent block">
                  {selectedRequest.referenceNumber}
                </span>
                <h3 className="font-serif font-black text-xl text-ink uppercase">
                  Detail Permintaan Konsultasi
                </h3>
              </div>
              <button
                type="button"
                onClick={closeDetailModal}
                className="p-1 hover:bg-paper-dark border border-ink text-ink"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Applicant Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-rule p-4 bg-paper-dark/20 text-xs">
              <div>
                <span className="font-sans text-[0.65rem] font-bold kicker text-ink-muted block uppercase">
                  Nama Lengkap:
                </span>
                <span className="font-serif text-sm font-bold text-ink block">
                  {selectedRequest.fullName}
                </span>
              </div>

              <div>
                <span className="font-sans text-[0.65rem] font-bold kicker text-ink-muted block uppercase">
                  Perusahaan / Brand:
                </span>
                <span className="font-serif text-sm text-ink block">
                  {selectedRequest.companyOrBrand || "—"}
                </span>
              </div>

              <div>
                <span className="font-sans text-[0.65rem] font-bold kicker text-ink-muted block uppercase">
                  Nomor WhatsApp:
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-xs font-bold text-ink">
                    {selectedRequest.whatsapp}
                  </span>
                  <a
                    href={`https://wa.me/${selectedRequest.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[0.62rem] font-bold px-2 py-0.5 bg-emerald-700 text-white hover:bg-emerald-800 uppercase tracking-wider inline-flex items-center gap-1"
                  >
                    <span>Hubungi WA</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              <div>
                <span className="font-sans text-[0.65rem] font-bold kicker text-ink-muted block uppercase">
                  Alamat Email:
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-xs text-ink truncate">
                    {selectedRequest.email}
                  </span>
                  <a
                    href={`mailto:${selectedRequest.email}`}
                    className="font-sans text-[0.62rem] font-bold px-2 py-0.5 bg-ink text-paper hover:bg-accent uppercase tracking-wider inline-flex items-center gap-1"
                  >
                    <span>Email</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              <div className="sm:col-span-2 pt-2 border-t border-rule/50 flex items-center justify-between">
                <div>
                  <span className="font-sans text-[0.65rem] font-bold kicker text-ink-muted block uppercase">
                    Jenis Layanan:
                  </span>
                  <span className="font-serif font-bold text-sm text-accent">
                    {selectedRequest.serviceType}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-sans text-[0.65rem] font-bold kicker text-ink-muted block uppercase">
                    Waktu Pengajuan:
                  </span>
                  <span className="font-mono text-[0.68rem] text-ink-muted">
                    {new Date(selectedRequest.createdAt).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            {/* Needs Description */}
            <div className="space-y-1.5 border border-rule p-4 bg-paper">
              <span className="font-sans text-xs font-bold kicker text-ink block uppercase tracking-wider">
                Uraian Kebutuhan Konsultasi Pemohon:
              </span>
              <p className="font-serif text-xs leading-relaxed text-ink whitespace-pre-wrap bg-paper-dark/30 p-3 border border-rule/40">
                {selectedRequest.needsDescription}
              </p>
            </div>

            {/* Status Update & Internal Notes Form */}
            <div className="space-y-4 border-2 border-ink p-4 bg-paper-dark/10">
              <span className="font-sans text-xs font-bold kicker text-ink block uppercase tracking-wider border-b border-rule pb-1.5">
                Kelola Status Permintaan & Catatan Internal Admin
              </span>

              {updateFeedback && (
                <div className="p-2.5 bg-paper border border-ink text-xs font-serif text-ink">
                  {updateFeedback}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-sans text-[0.68rem] font-bold kicker text-ink block uppercase">
                    Ubah Status:
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ConsultationRequestStatus)}
                    className="w-full text-xs font-sans p-2 border border-ink bg-paper focus:outline-hidden"
                  >
                    <option value="Baru">Baru (Belum Ditindaklanjuti)</option>
                    <option value="Diproses">Diproses (Sedang Ditelaah)</option>
                    <option value="Dihubungi">Dihubungi (Sudah Kontak Klien)</option>
                    <option value="Selesai">Selesai (Konsultasi Selesai)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-sans text-[0.68rem] font-bold kicker text-ink block uppercase">
                    Status Saat Ini:
                  </label>
                  <span
                    className={`inline-block px-3 py-1.5 text-xs font-sans font-bold uppercase border ${getStatusBadge(
                      selectedRequest.status
                    )}`}
                  >
                    {selectedRequest.status}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-sans text-[0.68rem] font-bold kicker text-ink block uppercase">
                  Catatan Internal Redaksi / Konsultan (Hanya terlihat oleh Admin):
                </label>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Tambahkan catatan hasil kontak, jadwal meeting konsultasi, atau nomor berkas..."
                  className="w-full text-xs font-serif p-2.5 border border-ink/40 bg-paper focus:outline-hidden focus:border-ink"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeDetailModal}
                  className="font-sans text-xs font-bold kicker border border-ink px-4 py-2 uppercase tracking-wider text-ink hover:bg-paper-dark"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={savingStatus}
                  className="font-sans text-xs font-bold kicker bg-ink text-paper px-5 py-2 uppercase tracking-wider hover:bg-accent transition-colors disabled:opacity-50"
                >
                  {savingStatus ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
