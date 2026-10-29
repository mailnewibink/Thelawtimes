import { DemoBadge } from "@/components/ui/DemoContentNotice";

interface LegalNoticeCardProps {
  title: string;
  subtitle: string;
  lawFirm?: string;
  lawyers?: string[];
  clientName?: string;
  noticeDate?: string;
  categories?: {
    trademarks?: Array<{ no: number; mark: string; classNo: number; regNo: string; date: string; owner: string }>;
    copyrights?: Array<{ no: number; title: string; type: string; regNo: string; date: string; owner: string }>;
    designs?: Array<{ no: number; title: string; certNo: string; regNo: string; date: string; owner: string }>;
  };
  statutes?: string[];
  warningText?: string;
  demoNote?: string;
}

/**
 * Component mimicking the formal Indonesian Legal Announcement layout
 * directly inspired by The Law Times reference broadsheet format.
 */
export function BroadSheetLegalNotice({
  title = "Pengumuman dan Peringatan Hukum (Demo Notice)",
  subtitle = "Peringatan Terbuka & Notifikasi Hak Kekayaan Intelektual",
  lawFirm = "Kantor Hukum Grisham Lussac Sitorus Attorney at Law (Fictional Placeholder)",
  lawyers = ["TOGU SUGIANTO SITORUS, S.H.", "HORAS SAHAT H. SITORUS, S.H."],
  clientName = "KLIEN CONTOH (Fictional)",
  noticeDate = "29 Oktober 2026",
  statutes = [
    "UU No. 20 Tahun 2016 tentang Merek dan Indikasi Geografis",
    "UU No. 28 Tahun 2014 tentang Hak Cipta",
    "UU No. 31 Tahun 2000 tentang Desain Industri",
  ],
  warningText = "Seluruh pihak yang tanpa izin memproduksi, mengedarkan, atau memperdagangkan merek dan hak cipta terkait diminta untuk segera menghentikan kegiatan tersebut.",
  demoNote = "PEMBERITAHUAN DEMO: Format ini dirancang khusus menyerupai lembar pengumuman hukum resmi pada referensi The Law Times. Seluruh nomor registrasi, merek, dan pihak merupakan data demonstrasi tata letak.",
}: Partial<LegalNoticeCardProps>) {
  return (
    <div className="border-2 border-ink p-4 sm:p-6 bg-paper-light text-ink my-6 shadow-sm">
      {/* Top Banner Notice */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-ink pb-2 mb-4 gap-2">
        <div>
          <span className="kicker text-xs text-ink-muted">{subtitle}</span>
          <h2 className="font-display text-xl sm:text-2xl font-bold uppercase">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <DemoBadge />
          <span className="meta text-xs font-bold">{noticeDate}</span>
        </div>
      </div>

      <p className="font-serif text-sm leading-relaxed mb-4">
        Bertindak untuk dan atas nama <strong>{clientName}</strong>, yang berkedudukan hukum melalui{" "}
        <strong>{lawFirm}</strong>, dengan ini mengumumkan dan memperingatkan kepada khalayak umum,
        instansi pemerintah, instansi swasta, serta pihak-pihak terkait hal-hal sebagai berikut:
      </p>

      {/* Grid: Tables & Legal Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-4">
        {/* Left Side: Tables */}
        <div className="lg:col-span-7 space-y-4 font-serif text-xs">
          {/* Table 1: Trademarks */}
          <div className="border border-ink">
            <div className="bg-ink text-paper font-sans font-bold px-2 py-1 uppercase text-[0.6875rem] tracking-wider">
              1. Merek Terdaftar (Sample Data Layout)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-ink bg-paper-dark/60 font-sans font-semibold text-[0.625rem] uppercase">
                    <th className="p-1.5 border-r border-ink">No</th>
                    <th className="p-1.5 border-r border-ink">Merek</th>
                    <th className="p-1.5 border-r border-ink">Kelas</th>
                    <th className="p-1.5 border-r border-ink">Nomor Pendaftaran</th>
                    <th className="p-1.5">Pemilik</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule-soft">
                  <tr>
                    <td className="p-1.5 border-r border-rule-soft text-center font-mono">1</td>
                    <td className="p-1.5 border-r border-rule-soft font-bold">SNOWCAN</td>
                    <td className="p-1.5 border-r border-rule-soft text-center">16</td>
                    <td className="p-1.5 border-r border-rule-soft font-mono">IDM000592418 (Demo)</td>
                    <td className="p-1.5">{clientName}</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 border-r border-rule-soft text-center font-mono">2</td>
                    <td className="p-1.5 border-r border-rule-soft font-bold">EASY GEL</td>
                    <td className="p-1.5 border-r border-rule-soft text-center">16</td>
                    <td className="p-1.5 border-r border-rule-soft font-mono">IDM000805199 (Demo)</td>
                    <td className="p-1.5">{clientName}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Copyright */}
          <div className="border border-ink">
            <div className="bg-ink text-paper font-sans font-bold px-2 py-1 uppercase text-[0.6875rem] tracking-wider">
              2. Hak Cipta Terdaftar (Sample Data Layout)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-ink bg-paper-dark/60 font-sans font-semibold text-[0.625rem] uppercase">
                    <th className="p-1.5 border-r border-ink">Judul Ciptaan</th>
                    <th className="p-1.5 border-r border-ink">Jenis</th>
                    <th className="p-1.5 border-r border-ink">Nomor Pencatatan</th>
                    <th className="p-1.5">Pemegang Hak</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-1.5 border-r border-rule-soft font-bold">EASY GEL</td>
                    <td className="p-1.5 border-r border-rule-soft">Kaligrafi / Seni Logo</td>
                    <td className="p-1.5 border-r border-rule-soft font-mono">000650806 (Demo)</td>
                    <td className="p-1.5">{clientName}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p className="meta text-[0.6875rem] italic text-ink-muted">
            {demoNote}
          </p>
        </div>

        {/* Right Side: Legal Basis, Warning & Signature */}
        <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-ink lg:pl-5 pt-4 lg:pt-0">
          <div>
            <div className="mb-3">
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-ink mb-1">
                Dasar Hukum:
              </h3>
              <ul className="list-disc pl-4 space-y-1 font-serif text-xs text-ink-soft">
                {statutes.map((st, i) => (
                  <li key={i}>{st}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4 bg-paper-dark/50 p-2.5 border-l-2 border-ink">
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-ink mb-1">
                Peringatan:
              </h3>
              <p className="font-serif text-xs leading-relaxed text-ink-soft">
                {warningText}
              </p>
            </div>
          </div>

          {/* Signatures / Law Firm Box */}
          <div className="border-t border-rule-soft pt-3">
            <p className="font-sans font-bold text-xs uppercase">Atas Nama Klien:</p>
            <p className="font-serif text-xs font-semibold text-ink mt-0.5">{lawFirm}</p>
            <div className="mt-2 text-xs space-y-0.5">
              {lawyers.map((ly, i) => (
                <p key={i} className="font-mono text-[0.6875rem] font-bold text-ink">
                  {ly}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Newspaper Banner like in the Reference */}
      <div className="mt-4 pt-2 border-t-2 border-ink flex items-center justify-between font-sans font-bold text-[0.6875rem] sm:text-xs tracking-widest text-ink">
        <span>✱</span>
        <span className="uppercase tracking-[0.2em]">Read More Legal Announcements at The Law Times</span>
        <span>✱</span>
      </div>
    </div>
  );
}
