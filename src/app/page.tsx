import Link from "next/link";
import Image from "next/image";
import {
  getClientPublications,
  getArticles,
  getRegulations,
  getGeneralNews,
  getExternalNews,
} from "@/lib/content";
import { PaperDivider } from "@/components/ui/PaperDivider";
import { ExternalNewsSection } from "@/components/editorial/ExternalNewsSection";
import { formatDate } from "@/lib/utils";
import {
  Scale,
  ArrowRight,
  ExternalLink,
  Download,
  ShieldAlert,
} from "lucide-react";

export default async function FrontPage() {
  const [clientPubs, generalNews, ipArticles, regulations, externalNews] = await Promise.all([
    getClientPublications(6),
    getGeneralNews(8),
    getArticles("intellectual-property"),
    getRegulations(),
    getExternalNews(6),
  ]);

  // Priority 1: Main featured client-case publication
  const featuredClient = clientPubs[0];

  // Right Column: Berita Pilihan (3 items: 01, 02, 03)
  const editorialPicks = [
    clientPubs[1] || generalNews[0],
    clientPubs[2] || ipArticles[0],
    generalNews[1] || ipArticles[1],
  ].filter(Boolean);

  // Column 1: Merek & HKI (Lead + 2 sub items)
  const ipLead = ipArticles[0] || clientPubs[0];
  const ipSubs = ipArticles.slice(1, 3);

  // Column 2: Berita Hukum (Lead + 2 sub items)
  const newsLead = generalNews[0];
  const newsSubs = generalNews.slice(1, 3);

  // Column 3: Regulasi (Lead + 2 sub items)
  const regLead = regulations[0];
  const regSubs = regulations.slice(1, 3);

  return (
    <div className="space-y-10">
      {/* ==================================================================== */}
      {/* 1. HERO SECTION: FEATURED CLIENT STORY (LEFT) & BERITA PILIHAN (RIGHT)*/}
      {/* ==================================================================== */}
      <section aria-label="Berita Utama & Pilihan" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Large Editorial Hero (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {featuredClient && (
            <article className="space-y-4">
              {/* Category & Tag */}
              <div className="flex items-center gap-2">
                <span className="bg-ink text-paper text-[0.68rem] kicker font-bold uppercase tracking-wider px-2 py-0.5">
                  PUBLIKASI PERKARA
                </span>
                <span className="text-rule-soft" aria-hidden="true">·</span>
                <span className="font-serif italic text-xs text-ink-muted">
                  Keterbukaan Informasi Hukum Klien
                </span>
              </div>

              {/* Large Serif Headline */}
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.12] text-ink">
                <Link
                  href={`/artikel/${featuredClient.slug}`}
                  className="hover:underline decoration-1 underline-offset-4"
                >
                  {featuredClient.headline}
                </Link>
              </h2>

              {/* Short Article Deck / Excerpt */}
              {featuredClient.deck && (
                <p className="font-serif text-lg sm:text-xl italic text-ink-muted leading-snug">
                  {featuredClient.deck}
                </p>
              )}

              {/* Author & Publication Date */}
              <div className="flex items-center gap-2 text-xs text-ink-muted font-sans font-semibold tracking-wider uppercase pb-2 border-b border-rule/50">
                <span>Oleh {featuredClient.byline || "Redaksi The Law Times"}</span>
                <span className="text-rule-soft" aria-hidden="true">·</span>
                <time dateTime={featuredClient.publishedAt}>
                  {formatDate(featuredClient.publishedAt, "short")}
                </time>
              </div>

              {/* Large Landscape Photograph with Engraved Border */}
              {featuredClient.image && (
                <figure className="space-y-1.5">
                  <div className="relative aspect-[16/10] w-full border border-rule bg-paper-dark">
                    <Image
                      src={featuredClient.image.src}
                      alt={featuredClient.image.alt}
                      fill
                      loading="eager"
                      priority
                      className="object-cover engraving"
                      sizes="(min-width: 1024px) 58vw, 100vw"
                    />
                  </div>
                  {featuredClient.image.caption && (
                    <figcaption className="text-[0.68rem] italic text-ink-muted flex items-center justify-between">
                      <span>{featuredClient.image.caption}</span>
                      {featuredClient.image.credit && (
                        <span className="font-mono text-[0.62rem] text-ink-muted/80">
                          {featuredClient.image.credit}
                        </span>
                      )}
                    </figcaption>
                  )}
                </figure>
              )}

              {/* Lead Body Paragraph */}
              <p className="font-serif text-base leading-relaxed text-ink-soft drop-cap">
                {featuredClient.excerpt}
              </p>

              {/* REFERENCE-INSPIRED OFFICIAL NOTICE BOX */}
              <div className="border-2 border-ink p-4 bg-paper-dark/25 space-y-3 my-4">
                <div className="border-b border-ink pb-1.5 flex items-center justify-between">
                  <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-accent" />
                    <span>Rincian Pengumuman & Hak Terdaftar Klien</span>
                  </h3>
                  <span className="text-[0.62rem] kicker uppercase font-mono text-ink-muted">
                    No. Ref: IDM000592418 / MA-812
                  </span>
                </div>

                {/* Boxed Table matching reference image */}
                <div className="overflow-x-auto border border-ink">
                  <table className="w-full text-left border-collapse text-[0.72rem] font-serif">
                    <thead>
                      <tr className="bg-ink text-paper font-sans text-[0.62rem] uppercase tracking-wider">
                        <th className="p-1.5 border-r border-paper/30">No</th>
                        <th className="p-1.5 border-r border-paper/30">Merek / Objek</th>
                        <th className="p-1.5 border-r border-paper/30">Kelas</th>
                        <th className="p-1.5 border-r border-paper/30">Nomor Registrasi</th>
                        <th className="p-1.5">Status Hukum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/20 bg-white/70">
                      <tr>
                        <td className="p-1.5 border-r border-ink/20 font-mono">1</td>
                        <td className="p-1.5 border-r border-ink/20 font-bold">SNOWCAN</td>
                        <td className="p-1.5 border-r border-ink/20 font-mono">16</td>
                        <td className="p-1.5 border-r border-ink/20 font-mono">IDM000592418</td>
                        <td className="p-1.5 font-bold text-emerald-950">Merek Terdaftar Sah</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 border-r border-ink/20 font-mono">2</td>
                        <td className="p-1.5 border-r border-ink/20 font-bold">EASY GEL</td>
                        <td className="p-1.5 border-r border-ink/20 font-mono">16</td>
                        <td className="p-1.5 border-r border-ink/20 font-mono">IDM000805199</td>
                        <td className="p-1.5 font-bold text-emerald-950">Merek Terdaftar Sah</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 border-r border-ink/20 font-mono">3</td>
                        <td className="p-1.5 border-r border-ink/20 font-bold">Putusan Kasasi MA</td>
                        <td className="p-1.5 border-r border-ink/20 font-mono">-</td>
                        <td className="p-1.5 border-r border-ink/20 font-mono">812 K/Pdt.Sus-HKI</td>
                        <td className="p-1.5 font-bold text-ink">Berkekuatan Hukum Tetap (BHT)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Columns: Dasar Hukum & Peringatan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[0.7rem] font-serif pt-1">
                  <div className="border border-rule/60 p-2 bg-white/50 space-y-1">
                    <strong className="font-sans uppercase text-[0.62rem] text-ink block kicker">
                      Dasar Hukum:
                    </strong>
                    <ul className="list-disc list-inside text-ink-muted space-y-0.5 text-[0.68rem]">
                      <li>UU No. 20 Tahun 2016 tentang Merek</li>
                      <li>UU No. 28 Tahun 2014 tentang Hak Cipta</li>
                      <li>Pasal 1365 Kitab Undang-Undang Hukum Perdata</li>
                    </ul>
                  </div>

                  <div className="border border-rule/60 p-2 bg-white/50 space-y-1">
                    <strong className="font-sans uppercase text-[0.62rem] text-red-900 block kicker flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-red-800" />
                      Peringatan Hukum:
                    </strong>
                    <p className="text-ink-muted text-[0.68rem] leading-snug">
                      Pihak tanpa izin yang memproduksi atau memperdagangkan barang serupa akan ditindak tegas
                      melalui tuntutan pidana dan gugatan perdata.
                    </p>
                  </div>
                </div>

                {/* Action Buttons matching reference image */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-ink/20">
                  <a
                    href="https://pdki-indonesia.dgip.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 border border-ink bg-ink text-paper px-3 py-1.5 text-[0.68rem] kicker uppercase font-bold hover:bg-paper hover:text-ink transition-colors"
                  >
                    <span>Lihat Data Resmi di PDKI Indonesia</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {featuredClient.documentUrl && (
                    <a
                      href={featuredClient.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 border border-ink bg-paper text-ink px-3 py-1.5 text-[0.68rem] kicker uppercase font-bold hover:bg-ink hover:text-paper transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>Unduh Pengumuman (PDF)</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Read More Link */}
              <div className="pt-2">
                <Link
                  href={`/artikel/${featuredClient.slug}`}
                  className="kicker inline-flex items-center gap-1.5 text-xs text-ink font-bold uppercase hover:underline decoration-2"
                >
                  <span>Lanjutkan Membaca Ulasan Lengkap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          )}
        </div>

        {/* RIGHT COLUMN: BERITA PILIHAN (Numbered 01, 02, 03) (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4 lg:border-l lg:border-ink/40 lg:pl-6">
          {/* Section Heading: BERITA PILIHAN */}
          <div className="border-b-2 border-ink pb-2">
            <h3 className="font-serif font-bold text-xl uppercase tracking-wider text-ink flex items-center justify-between">
              <span>BERITA PILIHAN</span>
              <span className="font-sans text-[0.68rem] kicker text-ink-muted">
                PILIHAN REDAKSI
              </span>
            </h3>
          </div>

          {/* Stack of 3 numbered featured items */}
          <div className="divide-y divide-rule/60 space-y-4 pt-1">
            {editorialPicks.map((item, idx) => {
              const itemNumber = String(idx + 1).padStart(2, "0");
              const isClient = item.publicationType === "client_publication";

              return (
                <article
                  key={item.id}
                  className={idx > 0 ? "pt-4" : ""}
                >
                  <div className="flex gap-4 items-start">
                    {/* Big Editorial Number */}
                    <span className="font-serif font-bold text-3xl sm:text-4xl text-ink/75 leading-none shrink-0 w-8">
                      {itemNumber}
                    </span>

                    <div className="flex-1 space-y-1.5">
                      {/* Category Label */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[0.62rem] kicker uppercase font-bold tracking-wider px-1.5 py-0.2 border ${
                            isClient
                              ? "bg-ink text-paper border-ink"
                              : "bg-paper-dark text-ink border-rule"
                          }`}
                        >
                          {isClient ? "PUBLIKASI PERKARA" : item.category || "BERITA HUKUM"}
                        </span>
                        <time className="text-[0.68rem] font-sans text-ink-muted">
                          {formatDate(item.publishedAt, "short")}
                        </time>
                      </div>

                      {/* Headline */}
                      <h4 className="font-serif font-bold text-base leading-snug text-ink">
                        <Link
                          href={`/artikel/${item.slug}`}
                          className="hover:underline decoration-1 underline-offset-2"
                        >
                          {item.headline}
                        </Link>
                      </h4>

                      {/* Excerpt */}
                      <p className="font-serif text-xs text-ink-muted leading-relaxed line-clamp-2">
                        {item.excerpt}
                      </p>
                    </div>

                    {/* Small Thumbnail Image with border */}
                    {item.image && (
                      <div className="relative w-20 h-16 shrink-0 border border-rule bg-paper-dark">
                        <Image
                          src={item.image.src}
                          alt={item.image.alt}
                          fill
                          className="object-cover engraving"
                          sizes="80px"
                        />
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Quick Notice Box */}
          <div className="border border-rule bg-paper-dark/30 p-3 text-xs space-y-1 mt-6">
            <span className="kicker text-[0.62rem] uppercase text-ink font-bold block">
              Pemberitahuan Publikasi Klien
            </span>
            <p className="font-serif text-[0.72rem] text-ink-muted leading-relaxed">
              Untuk mendaftarkan publikasi perkara, panggilan sidang, atau pengumuman hukum resmi,
              hubungi saluran redaksi: <span className="font-mono text-ink">redaksi@thelawtimes.id</span>.
            </p>
          </div>
        </div>
      </section>

      {/* HORIZONTAL DOUBLE-RULE SEPARATOR */}
      <div className="pt-2">
        <PaperDivider variant="double" />
      </div>

      {/* ==================================================================== */}
      {/* 2. THREE-COLUMN NEWSPAPER SECTIONS: MEREK & HKI | BERITA HUKUM | REGULASI */}
      {/* ==================================================================== */}
      <section aria-label="Rubrik Tiga Kolom Broadsheet">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-ink/30">
          {/* ------------------------------------------------------------------ */}
          {/* COLUMN 1: MEREK & HKI                                             */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-4 md:pr-6">
            {/* Column Header */}
            <div className="border-b-2 border-ink pb-1.5 flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl uppercase tracking-wider text-ink">
                MEREK & HKI
              </h3>
              <Link
                href="/merek-hki"
                className="font-sans text-[0.68rem] kicker text-ink hover:text-accent font-bold uppercase transition-colors"
              >
                Lihat Semua →
              </Link>
            </div>

            {/* Lead Story for Column 1 */}
            {ipLead && (
              <article className="space-y-2 pb-4 border-b border-rule/50">
                {ipLead.image && (
                  <div className="relative aspect-[16/10] w-full border border-rule bg-paper-dark mb-2">
                    <Image
                      src={ipLead.image.src}
                      alt={ipLead.image.alt}
                      fill
                      className="object-cover engraving"
                      sizes="(min-width: 768px) 30vw, 100vw"
                    />
                  </div>
                )}
                <span className="text-[0.62rem] kicker uppercase font-bold tracking-wider text-ink-muted">
                  {ipLead.category}
                </span>
                <h4 className="font-serif font-bold text-lg leading-snug text-ink">
                  <Link href={`/artikel/${ipLead.slug}`} className="hover:underline">
                    {ipLead.headline}
                  </Link>
                </h4>
                <p className="font-serif text-xs leading-relaxed text-ink-muted line-clamp-3">
                  {ipLead.excerpt}
                </p>
                <div className="text-[0.65rem] font-sans text-ink-muted pt-1">
                  <time dateTime={ipLead.publishedAt}>{formatDate(ipLead.publishedAt, "short")}</time>
                </div>
              </article>
            )}

            {/* Smaller Stories for Column 1 */}
            <div className="space-y-3 divide-y divide-rule/40">
              {ipSubs.map((sub, i) => (
                <article key={sub.id} className={i > 0 ? "pt-3" : ""}>
                  <span className="text-[0.6rem] kicker uppercase text-ink-muted block">
                    {sub.category}
                  </span>
                  <h5 className="font-serif font-bold text-sm leading-snug text-ink">
                    <Link href={`/artikel/${sub.slug}`} className="hover:underline">
                      {sub.headline}
                    </Link>
                  </h5>
                  <time className="text-[0.65rem] font-sans text-ink-muted block mt-1">
                    {formatDate(sub.publishedAt, "short")}
                  </time>
                </article>
              ))}
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* COLUMN 2: BERITA HUKUM                                            */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-4 pt-6 md:pt-0 md:px-6">
            {/* Column Header */}
            <div className="border-b-2 border-ink pb-1.5 flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl uppercase tracking-wider text-ink">
                BERITA HUKUM
              </h3>
              <Link
                href="/berita-hukum"
                className="font-sans text-[0.68rem] kicker text-ink hover:text-accent font-bold uppercase transition-colors"
              >
                Lihat Semua →
              </Link>
            </div>

            {/* Lead Story for Column 2 */}
            {newsLead && (
              <article className="space-y-2 pb-4 border-b border-rule/50">
                {newsLead.image && (
                  <div className="relative aspect-[16/10] w-full border border-rule bg-paper-dark mb-2">
                    <Image
                      src={newsLead.image.src}
                      alt={newsLead.image.alt}
                      fill
                      className="object-cover engraving"
                      sizes="(min-width: 768px) 30vw, 100vw"
                    />
                  </div>
                )}
                <span className="text-[0.62rem] kicker uppercase font-bold tracking-wider text-ink-muted">
                  {newsLead.category}
                </span>
                <h4 className="font-serif font-bold text-lg leading-snug text-ink">
                  <Link href={`/artikel/${newsLead.slug}`} className="hover:underline">
                    {newsLead.headline}
                  </Link>
                </h4>
                <p className="font-serif text-xs leading-relaxed text-ink-muted line-clamp-3">
                  {newsLead.excerpt}
                </p>
                <div className="text-[0.65rem] font-sans text-ink-muted pt-1">
                  <time dateTime={newsLead.publishedAt}>{formatDate(newsLead.publishedAt, "short")}</time>
                </div>
              </article>
            )}

            {/* Smaller Stories for Column 2 */}
            <div className="space-y-3 divide-y divide-rule/40">
              {newsSubs.map((sub, i) => (
                <article key={sub.id} className={i > 0 ? "pt-3" : ""}>
                  <span className="text-[0.6rem] kicker uppercase text-ink-muted block">
                    {sub.category}
                  </span>
                  <h5 className="font-serif font-bold text-sm leading-snug text-ink">
                    <Link href={`/artikel/${sub.slug}`} className="hover:underline">
                      {sub.headline}
                    </Link>
                  </h5>
                  <time className="text-[0.65rem] font-sans text-ink-muted block mt-1">
                    {formatDate(sub.publishedAt, "short")}
                  </time>
                </article>
              ))}
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* COLUMN 3: REGULASI                                                */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-4 pt-6 md:pt-0 md:pl-6">
            {/* Column Header */}
            <div className="border-b-2 border-ink pb-1.5 flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl uppercase tracking-wider text-ink">
                REGULASI
              </h3>
              <Link
                href="/regulasi"
                className="font-sans text-[0.68rem] kicker text-ink hover:text-accent font-bold uppercase transition-colors"
              >
                Lihat Semua →
              </Link>
            </div>

            {/* Lead Regulation for Column 3 */}
            {regLead && (
              <article className="space-y-2 pb-4 border-b border-rule/50">
                <div className="p-3 border border-rule bg-paper-dark/30 space-y-1 mb-2">
                  <span className="font-mono text-[0.62rem] uppercase font-bold text-accent block">
                    {regLead.number ? `No. ${regLead.number}` : "Regulasi Terdaftar"}
                  </span>
                  <span className="font-sans text-[0.68rem] text-ink-muted block">
                    {regLead.issuingInstitution || "Pemerintah RI"}
                  </span>
                </div>
                <span className="text-[0.62rem] kicker uppercase font-bold tracking-wider text-ink-muted">
                  {regLead.type}
                </span>
                <h4 className="font-serif font-bold text-lg leading-snug text-ink">
                  <Link href={`/regulation-watch`} className="hover:underline">
                    {regLead.title}
                  </Link>
                </h4>
                <p className="font-serif text-xs leading-relaxed text-ink-muted line-clamp-3">
                  {regLead.summary}
                </p>
                <div className="flex items-center justify-between text-[0.65rem] font-sans text-ink-muted pt-1">
                  <span>
                    Berlaku: {regLead.effectiveDate ? formatDate(regLead.effectiveDate, "short") : "Dalam Pengundangan"}
                  </span>
                  <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-950 text-[0.6rem] font-bold">
                    {regLead.status || "In Force"}
                  </span>
                </div>
              </article>
            )}

            {/* Smaller Regulations for Column 3 */}
            <div className="space-y-3 divide-y divide-rule/40">
              {regSubs.map((sub, i) => (
                <article key={sub.id} className={i > 0 ? "pt-3" : ""}>
                  <div className="flex items-center justify-between text-[0.6rem] kicker uppercase text-ink-muted mb-0.5">
                    <span>{sub.number ? `No. ${sub.number}` : sub.type}</span>
                    <span className="text-emerald-900 font-bold">{sub.status || "In Force"}</span>
                  </div>
                  <h5 className="font-serif font-bold text-sm leading-snug text-ink">
                    <Link href={`/regulation-watch`} className="hover:underline">
                      {sub.title}
                    </Link>
                  </h5>
                  <time className="text-[0.65rem] font-sans text-ink-muted block mt-1">
                    Diundangkan: {sub.effectiveDate ? formatDate(sub.effectiveDate, "short") : "Dalam Pembahasan"}
                  </time>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2.5 EXTERNAL LEGAL NEWS AGGREGATOR SECTION                           */}
      {/* ==================================================================== */}
      <ExternalNewsSection
        news={externalNews}
        title="WARTA HUKUM DARI SUMBER EKSTERNAL"
      />

      {/* ==================================================================== */}
      {/* 3. BOTTOM REFERENCE BANNER: READ MORE AT WWW.THELAWTIMES.COM         */}
      {/* ==================================================================== */}
      <div className="pt-4 pb-2">
        <PaperDivider variant="double" />
        <div className="border-y-2 border-ink py-2 my-1 text-center font-sans font-extrabold text-xs sm:text-sm tracking-[0.2em] uppercase text-ink flex items-center justify-center gap-3">
          <span aria-hidden="true" className="text-base text-accent">✱</span>
          <span>BACA ARSIP & WARTA LENGKAP DI WWW.THELAWTIMES.COM</span>
          <span aria-hidden="true" className="text-base text-accent">✱</span>
        </div>
        <PaperDivider variant="double" />
      </div>
    </div>
  );
}
