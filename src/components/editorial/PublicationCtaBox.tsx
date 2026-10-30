import Link from "next/link";
import { ArrowRight, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

interface PublicationCtaBoxProps {
  variant?: "broadsheet" | "compact" | "banner";
  className?: string;
}

export function PublicationCtaBox({
  variant = "broadsheet",
  className,
}: PublicationCtaBoxProps) {
  if (variant === "compact") {
    return (
      <aside
        aria-label="Layanan Publikasi Perkara"
        className={cn(
          "border border-ink bg-paper-light p-4 space-y-2.5 text-ink",
          className
        )}
      >
        <div className="flex items-center gap-1.5 text-accent">
          <Scale className="w-3.5 h-3.5 shrink-0" />
          <span className="kicker uppercase font-bold text-[0.625rem] tracking-[0.18em]">
            Dokumentasi Perkara Resmi
          </span>
        </div>

        <h3 className="font-serif font-bold text-sm leading-snug">
          Publikasikan Perkara Anda
        </h3>

        <p className="font-serif text-xs leading-relaxed text-ink-muted">
          Saluran warta pengumuman perkara hukum, putusan pengadilan, dan sengketa merek dengan standar verifikasi independen.
        </p>

        <div className="pt-1 border-t border-rule/60">
          <Link
            href="/publikasi-perkara"
            className="inline-flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-ink hover:text-accent transition-colors"
          >
            <span>Publikasikan Perkara Anda</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </aside>
    );
  }

  if (variant === "banner") {
    return (
      <aside
        aria-label="Layanan Publikasi Perkara"
        className={cn(
          "border-y-2 border-ink py-4 px-4 sm:px-6 bg-paper-dark/20 my-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-ink",
          className
        )}
      >
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs text-accent font-serif" aria-hidden="true">✱</span>
            <p className="kicker text-[0.625rem] text-accent uppercase font-bold tracking-[0.2em]">
              Keterbukaan Informasi Hukum & Perkara Klien
            </p>
          </div>
          <h3 className="font-serif font-bold text-base sm:text-lg">
            Memiliki Perkara, Putusan, atau Pemberitahuan Hukum yang Memerlukan Publikasi Resmi?
          </h3>
          <p className="font-serif text-xs text-ink-soft leading-relaxed">
            The Law Times memfasilitasi publikasi warta perkara perdata, kepailitan/PKPU, sengketa merek, dan ringkasan amar putusan dengan verifikasi redaksi yang tertib.
          </p>
        </div>

        <div className="shrink-0">
          <Link
            href="/publikasi-perkara"
            className="inline-flex items-center gap-2 border border-ink bg-ink text-paper hover:bg-paper hover:text-ink px-4 py-2 text-xs font-sans font-bold tracking-[0.14em] uppercase transition-colors"
          >
            <span>Publikasikan Perkara Anda</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>
    );
  }

  // Broadsheet full box (default for homepage & category page)
  return (
    <aside
      aria-label="Pengumuman Layanan Publikasi Perkara"
      className={cn(
        "border-2 border-ink bg-paper-light p-6 sm:p-8 space-y-4 text-ink text-center max-w-4xl mx-auto",
        className
      )}
    >
      <div className="flex items-center justify-center gap-3">
        <span className="text-xs text-accent font-serif" aria-hidden="true">✱</span>
        <p className="kicker text-[0.6875rem] text-accent uppercase font-bold tracking-[0.24em]">
          Layanan Publikasi Hukum & Berkas Perkara
        </p>
        <span className="text-xs text-accent font-serif" aria-hidden="true">✱</span>
      </div>

      <h2 className="font-serif text-xl sm:text-3xl font-extrabold uppercase tracking-tight">
        Publikasikan Perkara Anda di The Law Times
      </h2>

      <p className="font-serif text-xs sm:text-sm text-ink-soft max-w-2xl mx-auto leading-relaxed">
        The Law Times menyediakan ruang publikasi informasi perkara dan konten hukum untuk memperluas akses terhadap informasi hukum yang relevan, terstruktur, dan dapat dipertanggungjawabkan kepada masyarakat dan kalangan praktisi hukum.
      </p>

      <div className="pt-2 flex items-center justify-center gap-4 flex-wrap">
        <Link
          href="/publikasi-perkara"
          className="inline-flex items-center gap-2 border border-ink bg-ink text-paper hover:bg-paper hover:text-ink px-6 py-2.5 text-xs font-sans font-bold tracking-[0.16em] uppercase transition-colors shadow-xs"
        >
          <span>Publikasikan Perkara Anda</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <Link
          href="/kebijakan-redaksi"
          className="inline-flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-ink-muted hover:text-ink underline decoration-1 underline-offset-4"
        >
          <span>Pelajari Kebijakan Redaksi</span>
        </Link>
      </div>
    </aside>
  );
}
