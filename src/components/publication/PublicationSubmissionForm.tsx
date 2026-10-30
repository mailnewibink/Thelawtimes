"use client";

import { useState } from "react";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Send,
  FileCheck,
  X,
} from "lucide-react";
import { PaperDivider } from "@/components/ui/PaperDivider";
import type { PublicationServiceKey } from "@/types/content";

export function PublicationSubmissionForm() {
  const [applicantName, setApplicantName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [publicationType, setPublicationType] = useState<PublicationServiceKey>("case_publication");
  const [proposedTitle, setProposedTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [additionalMessage, setAdditionalMessage] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);

  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    referenceNumber: string;
    message: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const selected = e.target.files?.[0];
    if (!selected) {
      setFile(null);
      return;
    }

    // 10 MB limit
    if (selected.size > 10 * 1024 * 1024) {
      setFileError("Ukuran dokumen melebihi batas maksimal 10 MB.");
      setFile(null);
      return;
    }

    const allowedMime = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedMime.includes(selected.type)) {
      setFileError("Format berkas harus berupa PDF, Word (.doc/.docx), atau Gambar (JPG/PNG).");
      setFile(null);
      return;
    }

    setFile(selected);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Client-side validations
    if (!applicantName.trim() || applicantName.trim().length < 2) {
      setSubmitError("Nama pemohon atau narahubung wajib diisi.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setSubmitError("Format alamat email tidak valid.");
      return;
    }

    const phoneRegex = /^[\d\s+\-()]{8,20}$/;
    if (!whatsapp.trim() || !phoneRegex.test(whatsapp.trim())) {
      setSubmitError("Nomor WhatsApp tidak valid (minimal 8 angka/karakter).");
      return;
    }

    if (!proposedTitle.trim() || proposedTitle.trim().length < 5) {
      setSubmitError("Judul usulan publikasi wajib diisi (minimal 5 karakter).");
      return;
    }

    if (!shortDescription.trim() || shortDescription.trim().length < 10) {
      setSubmitError("Ringkasan informasi perkara wajib diisi (minimal 10 karakter).");
      return;
    }

    if (!consentGiven) {
      setSubmitError(
        "Anda wajib menyetujui pernyataan kebenaran data dan ketentuan penelaahan dewan redaksi."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("applicantName", applicantName.trim());
      formData.append("organization", organization.trim());
      formData.append("email", email.trim());
      formData.append("whatsapp", whatsapp.trim());
      formData.append("publicationType", publicationType);
      formData.append("proposedTitle", proposedTitle.trim());
      formData.append("shortDescription", shortDescription.trim());
      formData.append("additionalMessage", additionalMessage.trim());
      formData.append("consentGiven", consentGiven ? "true" : "false");

      if (file) {
        formData.append("document", file);
      }

      const res = await fetch("/api/publication-requests", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Gagal mengajukan permohonan. Silakan coba kembali.");
      }

      setSubmissionSuccess({
        referenceNumber: json.referenceNumber,
        message: json.message,
      });
    } catch (err: any) {
      setSubmitError(err.message || "Terjadi kendala teknis saat mengirim data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setApplicantName("");
    setOrganization("");
    setEmail("");
    setWhatsapp("");
    setPublicationType("case_publication");
    setProposedTitle("");
    setShortDescription("");
    setAdditionalMessage("");
    setConsentGiven(false);
    setFile(null);
    setFileError(null);
    setSubmitError(null);
    setSubmissionSuccess(null);
  };

  return (
    <div id="formulir-pengajuan" className="border-2 border-ink bg-paper p-6 sm:p-10 scroll-mt-8">
      {/* Form Section Header */}
      <div className="border-b-2 border-ink pb-4 mb-6">
        <p className="kicker text-accent text-xs font-bold tracking-[0.2em] uppercase">
          Formulir Pengajuan Publikasi Resmi
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink mt-1">
          Pengajuan Usulan Publikasi Perkara & Konten Hukum
        </h2>
        <p className="font-serif italic text-sm text-ink-muted mt-1 leading-relaxed">
          Terbuka bagi kuasa hukum, kantor advokat, kurator, perusahaan, dan akademisi tanpa perlu membuat akun anggota.
        </p>
      </div>

      {/* Success Confirmation State */}
      {submissionSuccess ? (
        <div className="border border-ink bg-paper-light p-6 sm:p-8 space-y-6 text-ink">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink">
                Permohonan Berhasil Diajukan
              </h3>
              <p className="font-serif text-sm text-ink-soft leading-relaxed">
                {submissionSuccess.message}
              </p>
            </div>
          </div>

          <PaperDivider variant="thin" />

          {/* Reference Details Box */}
          <div className="bg-paper p-5 border border-rule space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rule pb-2">
              <span className="kicker uppercase text-xs text-ink-muted font-bold">
                Nomor Registrasi Permohonan:
              </span>
              <span className="font-mono text-base sm:text-lg font-bold text-ink bg-paper-dark px-2.5 py-0.5 border border-rule">
                {submissionSuccess.referenceNumber}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-serif text-ink-soft pt-1">
              <div>
                <strong>Pemohon:</strong> {applicantName}
                {organization && <span> ({organization})</span>}
              </div>
              <div>
                <strong>Kontak:</strong> {whatsapp} · {email}
              </div>
              <div className="sm:col-span-2">
                <strong>Judul Usulan:</strong> {proposedTitle}
              </div>
            </div>
          </div>

          {/* Next Steps Guidance */}
          <div className="space-y-2 text-xs font-serif text-ink-soft leading-relaxed border-l-2 border-ink pl-4">
            <h4 className="kicker uppercase font-bold text-[0.6875rem] text-ink">
              Tahapan Selanjutnya:
            </h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Dewan redaksi The Law Times akan memverifikasi dokumen dan nomor perkara yang Anda sertakan.</li>
              <li>Editor pelaksana akan menghubungi nomor WhatsApp atau email yang tertera untuk konfirmasi draf pemberitaan.</li>
              <li>Penerbitan warta tunduk sepenuhnya pada independensi dan kode etik redaksi The Law Times.</li>
            </ol>
          </div>

          <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
            <button
              type="button"
              onClick={handleResetForm}
              className="inline-flex items-center gap-2 border border-ink bg-ink text-paper hover:bg-paper hover:text-ink px-5 py-2 text-xs font-sans font-bold tracking-[0.14em] uppercase transition-colors"
            >
              <span>Ajukan Permohonan Lainnya</span>
            </button>

            <span className="font-mono text-[0.6875rem] text-ink-muted">
              Simpan nomor registrasi di atas untuk kebutuhan korespondensi Anda.
            </span>
          </div>
        </div>
      ) : (
        /* Submission Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          {submitError && (
            <div className="border border-rose-300 bg-rose-50 p-4 text-rose-900 font-serif text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Identity Grid: Name, Org, Email, WhatsApp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="applicantName" className="kicker block text-xs text-ink mb-1 font-bold">
                Nama Pemohon / Narahubung <span className="text-rose-700">*</span>
              </label>
              <input
                id="applicantName"
                type="text"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="Contoh: Budi Santoso, S.H. / Adv. Hendra Wijaya"
                className="w-full border border-rule px-3 py-2 text-xs font-serif bg-white text-ink focus:outline-none focus:border-ink"
              />
              <p className="text-[0.6875rem] font-serif italic text-ink-muted mt-1">
                Nama lengkap advokat, praktisi, atau penanggung jawab permohonan.
              </p>
            </div>

            <div>
              <label htmlFor="organization" className="kicker block text-xs text-ink mb-1 font-bold">
                Kantor Hukum / Lembaga / Perusahaan <span className="text-ink-muted font-normal text-[0.6875rem]">(Opsional)</span>
              </label>
              <input
                id="organization"
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Contoh: Santoso & Partners Law Firm / PT Korporasi Nusantara"
                className="w-full border border-rule px-3 py-2 text-xs font-serif bg-white text-ink focus:outline-none focus:border-ink"
              />
              <p className="text-[0.6875rem] font-serif italic text-ink-muted mt-1">
                Institusi kuasa hukum atau entitas yang terafiliasi dengan materi perkara.
              </p>
            </div>

            <div>
              <label htmlFor="email" className="kicker block text-xs text-ink mb-1 font-bold">
                Alamat Email Aktif <span className="text-rose-700">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="narahubung@kantorhukum.id"
                className="w-full border border-rule px-3 py-2 text-xs font-serif bg-white text-ink focus:outline-none focus:border-ink"
              />
              <p className="text-[0.6875rem] font-serif italic text-ink-muted mt-1">
                Untuk pengiriman draf warta, berita acara, dan konfirmasi redaksi.
              </p>
            </div>

            <div>
              <label htmlFor="whatsapp" className="kicker block text-xs text-ink mb-1 font-bold">
                Nomor WhatsApp / Seluler <span className="text-rose-700">*</span>
              </label>
              <input
                id="whatsapp"
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+62 812-3456-7890"
                className="w-full border border-rule px-3 py-2 text-xs font-serif bg-white text-ink focus:outline-none focus:border-ink"
              />
              <p className="text-[0.6875rem] font-serif italic text-ink-muted mt-1">
                Digunakan dewan redaksi untuk komunikasi cepat klarifikasi dokumen.
              </p>
            </div>
          </div>

          <PaperDivider variant="thin" />

          {/* Publication Type */}
          <div>
            <label htmlFor="publicationType" className="kicker block text-xs text-ink mb-1 font-bold">
              Jenis Publikasi yang Diajukan <span className="text-rose-700">*</span>
            </label>
            <select
              id="publicationType"
              value={publicationType}
              onChange={(e) => setPublicationType(e.target.value as PublicationServiceKey)}
              className="w-full border border-rule px-3 py-2 text-xs font-sans bg-white text-ink focus:outline-none focus:border-ink"
            >
              <option value="case_publication">Publikasi Perkara (Sengketa, Gugatan, Permohonan PKPU/Pailit, Relaas Sidang)</option>
              <option value="ruling_publication">Publikasi Putusan (Amar Putusan Pengadilan, Kasasi MA, Yurisprudensi)</option>
              <option value="legal_opinion">Artikel Hukum & Opini (Kajian Doktrin, Kolom Praktisi, Telaah Regulasi)</option>
              <option value="ip_publication">Publikasi Merek & HKI (Pengumuman Pendaftaran, Oposisi, Sengketa Desain/Paten)</option>
              <option value="sponsored_content">Sponsored Legal Content (Kemitraan Korporasi, Transaksi Deals, Ekspansi Firma)</option>
            </select>
          </div>

          {/* Proposed Title */}
          <div>
            <label htmlFor="proposedTitle" className="kicker block text-xs text-ink mb-1 font-bold">
              Usulan Judul Publikasi <span className="text-rose-700">*</span>
            </label>
            <input
              id="proposedTitle"
              type="text"
              required
              value={proposedTitle}
              onChange={(e) => setProposedTitle(e.target.value)}
              placeholder="Contoh: Pengumuman Permohonan Penundaan Kewajiban Pembayaran Utang (PKPU) PT Nusantara Abadi"
              className="w-full border border-rule px-3 py-2 text-xs font-serif bg-white text-ink focus:outline-none focus:border-ink"
            />
            <p className="text-[0.6875rem] font-serif italic text-ink-muted mt-1">
              Judul informatif yang mencantumkan subjek hukum atau pokok perkara perdata/putusan.
            </p>
          </div>

          {/* Short Description */}
          <div>
            <label htmlFor="shortDescription" className="kicker block text-xs text-ink mb-1 font-bold">
              Ringkasan Pokok Informasi / Duduk Perkara <span className="text-rose-700">*</span>
            </label>
            <textarea
              id="shortDescription"
              required
              rows={4}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Jelaskan secara ringkas nomor perkara, pengadilan yang memeriksa, para pihak terkait, inti gugatan atau amar putusan, serta tujuan publikasi resmi ini..."
              className="w-full border border-rule p-3 text-xs font-serif leading-relaxed bg-white text-ink focus:outline-none focus:border-ink"
            />
          </div>

          {/* Document Upload */}
          <div>
            <label className="kicker block text-xs text-ink mb-1 font-bold">
              Unggah Salinan Dokumen Resmi Pendukung <span className="text-ink-muted font-normal text-[0.6875rem]">(Opsional / Sangat Dianjurkan)</span>
            </label>

            <div className="border border-dashed border-rule bg-paper-light p-4 text-center">
              {file ? (
                <div className="flex items-center justify-between bg-paper p-3 border border-rule max-w-lg mx-auto">
                  <div className="flex items-center gap-2.5 text-left">
                    <FileCheck className="w-5 h-5 text-accent shrink-0" />
                    <div>
                      <p className="font-serif font-bold text-xs text-ink truncate max-w-xs sm:max-w-md">
                        {file.name}
                      </p>
                      <p className="font-mono text-[0.625rem] text-ink-muted">
                        {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type || "Dokumen"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1 hover:bg-paper-dark text-ink-muted hover:text-ink transition-colors"
                    title="Hapus berkas terpilih"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-6 h-6 mx-auto text-ink-muted" />
                  <div className="font-serif text-xs text-ink-soft">
                    <label
                      htmlFor="documentUpload"
                      className="cursor-pointer font-bold text-ink underline hover:text-accent decoration-1 underline-offset-2"
                    >
                      Pilih berkas dari komputer
                    </label>{" "}
                    atau seret berkas ke sini
                  </div>
                  <input
                    id="documentUpload"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                    className="hidden"
                  />
                  <p className="font-mono text-[0.625rem] text-ink-muted">
                    Format didukung: PDF, Word (DOC/DOCX), JPG, PNG. Ukuran maksimal: 10 MB.
                  </p>
                </div>
              )}

              {fileError && (
                <p className="text-rose-700 text-xs font-serif mt-2 font-medium">
                  {fileError}
                </p>
              )}
            </div>
            <p className="text-[0.6875rem] font-serif italic text-ink-muted mt-1">
              Catatan Keamanan: Seluruh dokumen permohonan disimpan dalam penyimpanan tertutup (non-publik) dan hanya dapat diakses oleh dewan redaksi The Law Times untuk kepentingan verifikasi.
            </p>
          </div>

          {/* Additional Message */}
          <div>
            <label htmlFor="additionalMessage" className="kicker block text-xs text-ink mb-1 font-bold">
              Catatan Tambahan untuk Meja Redaksi <span className="text-ink-muted font-normal text-[0.6875rem]">(Opsional)</span>
            </label>
            <textarea
              id="additionalMessage"
              rows={2}
              value={additionalMessage}
              onChange={(e) => setAdditionalMessage(e.target.value)}
              placeholder="Contoh: Perkara ini memiliki jadwal sidang perdana pada 20 November 2026. Mohon konfirmasi sebelum tanggal tersebut..."
              className="w-full border border-rule p-2.5 text-xs font-serif leading-relaxed bg-white text-ink focus:outline-none focus:border-ink"
            />
          </div>

          <PaperDivider variant="thin" />

          {/* Consent Checkbox */}
          <div className="border border-rule bg-paper-light p-4 space-y-2">
            <div className="flex items-start gap-3">
              <input
                id="consentCheckbox"
                type="checkbox"
                required
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-1 h-4 w-4 border-rule accent-ink cursor-pointer shrink-0"
              />
              <label
                htmlFor="consentCheckbox"
                className="font-serif text-xs text-ink leading-relaxed cursor-pointer select-none"
              >
                <strong>Pernyataan Keabsahan Data & Persetujuan Redaksi:</strong> Saya menyatakan bahwa informasi dan dokumen yang diajukan adalah benar, tidak menyesatkan, dan diperoleh secara sah. Saya memahami bahwa pengajuan ini <strong>tidak menjamin publikasi otomatis</strong> tanpa proses penelaahan independen Dewan Redaksi The Law Times serta tunduk pada{" "}
                <a
                  href="/kebijakan-redaksi"
                  target="_blank"
                  className="underline font-bold hover:text-accent"
                >
                  Kebijakan Redaksi
                </a>{" "}
                yang berlaku.
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-[0.6875rem] text-ink-muted font-serif">
              <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
              <span>Kerahasiaan data pemohon terlindungi dan diproses di server aman The Law Times.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-ink bg-ink text-paper hover:bg-paper hover:text-ink px-8 py-3 text-xs font-sans font-bold tracking-[0.16em] uppercase transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Mengirimkan Permohonan..." : "Kirim Usulan Publikasi"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
