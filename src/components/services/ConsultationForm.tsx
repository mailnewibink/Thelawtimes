"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, Send, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

const SERVICE_OPTIONS = [
  "Pendaftaran Merek",
  "Kekayaan Intelektual",
  "Perizinan BPOM",
  "Pendampingan Hukum",
  "Legalitas Usaha",
  "Lainnya",
];

export function ConsultationForm() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") || "";

  const [fullName, setFullName] = useState("");
  const [companyOrBrand, setCompanyOrBrand] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [serviceType, setServiceType] = useState("Pendaftaran Merek");
  const [needsDescription, setNeedsDescription] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    referenceNumber: string;
    message: string;
  } | null>(null);

  // Sync service prefill from URL query param
  useEffect(() => {
    if (initialService) {
      const match = SERVICE_OPTIONS.find(
        (opt) => opt.toLowerCase() === initialService.toLowerCase()
      );
      if (match) {
        setServiceType(match);
      }
    }
  }, [initialService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || fullName.trim().length < 3) {
      setError("Nama lengkap wajib diisi minimal 3 karakter.");
      return;
    }

    if (!whatsapp.trim() || whatsapp.trim().length < 8) {
      setError("Nomor WhatsApp aktif wajib diisi.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError("Format alamat email tidak valid.");
      return;
    }

    if (!needsDescription.trim() || needsDescription.trim().length < 10) {
      setError("Deskripsi kebutuhan konsultasi wajib diisi minimal 10 karakter.");
      return;
    }

    if (!consentGiven) {
      setError("Anda wajib mencentang persetujuan penggunaan data untuk melanjutkan.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/consultation-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          companyOrBrand,
          whatsapp,
          email,
          serviceType,
          needsDescription,
          consentGiven,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirimkan formulir konsultasi.");
      }

      setSuccessData({
        referenceNumber: data.referenceNumber,
        message: data.message,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="border-2 border-ink bg-paper p-8 text-center space-y-4 my-8">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <span className="font-sans font-bold kicker text-accent uppercase tracking-widest text-xs block">
          PERMINTAAN KONSULTASI RESMI DITERIMA
        </span>

        <h2 className="font-serif font-black text-2xl sm:text-3xl text-ink uppercase">
          Terima Kasih, Permohonan Anda Berhasil Dikirimkan
        </h2>

        <div className="p-4 border border-rule bg-paper-dark/30 max-w-md mx-auto space-y-1">
          <span className="text-xs font-sans text-ink-muted block">Nomor Registrasi Permintaan:</span>
          <span className="font-mono text-base font-bold text-ink block tracking-wider">
            {successData.referenceNumber}
          </span>
        </div>

        <p className="font-serif text-sm text-ink-muted max-w-lg mx-auto leading-relaxed">
          Tim Layanan Hukum The Law Times akan mempelajari rincian kebutuhan Anda dan menghubungi Anda melalui WhatsApp atau Email dalam 1x24 jam kerja untuk penjadwalan sesi konsultasi lebih lanjut.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/layanan-hukum"
            className="font-sans text-xs font-bold kicker border border-ink px-4 py-2 uppercase tracking-wider text-ink hover:bg-paper-dark transition-colors"
          >
            ← Kembali ke Layanan Hukum
          </Link>
          <Link
            href="/"
            className="font-sans text-xs font-bold kicker bg-ink text-paper px-4 py-2 uppercase tracking-wider hover:bg-accent hover:text-white transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border-2 border-ink bg-paper p-6 sm:p-8 space-y-6">
      <div className="border-b border-ink/40 pb-3 flex items-center justify-between">
        <div>
          <span className="font-sans font-bold text-xs uppercase kicker text-accent">
            Formulir Resmi
          </span>
          <h2 className="font-serif font-bold text-xl text-ink">
            Pengajuan Permintaan Konsultasi Hukum
          </h2>
        </div>
        <ShieldCheck className="w-5 h-5 text-ink-muted" />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-300 text-red-900 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label htmlFor="fullName" className="font-sans font-bold text-xs text-ink block uppercase tracking-wider">
            Nama Lengkap <span className="text-red-600">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Contoh: Budi Santoso, S.H."
            className="w-full text-xs font-serif p-2.5 border border-ink/40 bg-paper focus:outline-hidden focus:border-ink"
          />
        </div>

        {/* Company / Brand Name */}
        <div className="space-y-1">
          <label htmlFor="companyOrBrand" className="font-sans font-bold text-xs text-ink block uppercase tracking-wider">
            Nama Perusahaan / Brand <span className="font-normal text-ink-muted text-[0.65rem]">(Opsional)</span>
          </label>
          <input
            id="companyOrBrand"
            type="text"
            value={companyOrBrand}
            onChange={(e) => setCompanyOrBrand(e.target.value)}
            placeholder="Contoh: PT Kreasi Digital Nusantara / Brand 'Kopi Nusantara'"
            className="w-full text-xs font-serif p-2.5 border border-ink/40 bg-paper focus:outline-hidden focus:border-ink"
          />
        </div>

        {/* WhatsApp */}
        <div className="space-y-1">
          <label htmlFor="whatsapp" className="font-sans font-bold text-xs text-ink block uppercase tracking-wider">
            Nomor WhatsApp <span className="text-red-600">*</span>
          </label>
          <input
            id="whatsapp"
            type="tel"
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="Contoh: 081234567890"
            className="w-full text-xs font-serif p-2.5 border border-ink/40 bg-paper focus:outline-hidden focus:border-ink"
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="email" className="font-sans font-bold text-xs text-ink block uppercase tracking-wider">
            Alamat Email <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Contoh: kontak@perusahaan.co.id"
            className="w-full text-xs font-serif p-2.5 border border-ink/40 bg-paper focus:outline-hidden focus:border-ink"
          />
        </div>
      </div>

      {/* Service Type Selection */}
      <div className="space-y-1">
        <label htmlFor="serviceType" className="font-sans font-bold text-xs text-ink block uppercase tracking-wider">
          Jenis Layanan yang Dibutuhkan <span className="text-red-600">*</span>
        </label>
        <select
          id="serviceType"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          className="w-full text-xs font-serif p-2.5 border border-ink/40 bg-paper focus:outline-hidden focus:border-ink cursor-pointer"
        >
          {SERVICE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span className="font-serif italic text-[0.68rem] text-ink-muted block mt-0.5">
          Pilih kategori yang paling mendekati kebutuhan legal atau perizinan Anda saat ini.
        </span>
      </div>

      {/* Needs Description */}
      <div className="space-y-1">
        <label htmlFor="needsDescription" className="font-sans font-bold text-xs text-ink block uppercase tracking-wider">
          Deskripsi Kebutuhan & Kronologi Singkat <span className="text-red-600">*</span>
        </label>
        <textarea
          id="needsDescription"
          rows={4}
          required
          value={needsDescription}
          onChange={(e) => setNeedsDescription(e.target.value)}
          placeholder="Uraikan secara ringkas merek yang ingin didaftarkan, izin produk yang dibutuhkan, jenis kontrak yang ingin ditelaah, atau permasalahan hukum bisnis yang sedang dihadapi..."
          className="w-full text-xs font-serif p-2.5 border border-ink/40 bg-paper focus:outline-hidden focus:border-ink leading-relaxed"
        />
      </div>

      {/* Consent Checkbox */}
      <div className="p-3 border border-rule/60 bg-paper-dark/20">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
            className="mt-0.5 accent-ink"
          />
          <span className="font-serif text-xs text-ink leading-snug">
            Saya menyatakan bahwa data yang diisi di atas adalah benar, dan memberikan persetujuan kepada tim The Law Times untuk menghubungi saya guna keperluan koordinasi dan konsultasi hukum sesuai dengan{" "}
            <Link href="/privacy-policy" className="underline text-accent hover:text-ink">
              Kebijakan Privasi
            </Link>{" "}
            yang berlaku.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-2 flex items-center justify-between">
        <span className="font-serif italic text-[0.68rem] text-ink-muted hidden sm:inline">
          * Seluruh informasi kontak dijaga kerahasiaannya.
        </span>

        <button
          type="submit"
          disabled={loading}
          className="font-sans text-xs font-bold kicker bg-ink text-paper py-3 px-6 hover:bg-accent hover:text-white transition-colors uppercase tracking-wider flex items-center gap-2 shadow-xs disabled:opacity-60"
        >
          {loading ? (
            <span>Mengirimkan Data...</span>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Permintaan Konsultasi</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
