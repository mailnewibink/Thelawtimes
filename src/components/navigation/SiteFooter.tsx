"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { PaperDivider } from "@/components/ui/PaperDivider";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function SiteFooter() {
  const { t } = useLanguage();

  const footerLinks = [
    { label: t("aboutTheLawTimes") || "Tentang The Law Times", href: "/tentang-kami" },
    { label: "Layanan Publikasi Perkara", href: "/publikasi-perkara" },
    { label: "Rubrik Perkara & Putusan", href: "/perkara" },
    { label: "Berita Hukum", href: "/berita-hukum" },
    { label: "Merek & HKI", href: "/merek-hki" },
    { label: "Regulasi", href: "/regulasi" },
    { label: t("editorialPolicy") || "Kebijakan Redaksi", href: "/kebijakan-redaksi" },
    { label: t("correctionsPolicy") || "Kebijakan Ralat", href: "/corrections-policy" },
    { label: t("privacyPolicy") || "Kebijakan Privasi", href: "/privacy-policy" },
    { label: t("contactDesk") || "Kontak", href: "/contact" },
  ];

  return (
    <footer className="mt-16 border-t-[3px] border-ink bg-paper pt-8 pb-12">
      <div className="paper-container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          <div className="md:col-span-5">
            <h2 className="font-blackletter text-3xl text-ink font-normal mb-2">
              {siteConfig.name}
            </h2>
            <p className="font-serif text-xs leading-relaxed text-ink-muted mb-4 max-w-sm">
              {t("footerDesc")}
            </p>
            <div className="kicker text-[0.625rem] text-ink-muted">
              {t("editorialStandards")}
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="kicker text-xs text-ink mb-3">{t("editorialEthicsHeading")}</h3>
            <ul className="space-y-1.5 font-serif text-xs text-ink-muted">
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-ink hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="kicker text-xs text-ink mb-3">{t("factualIntegrityHeading")}</h3>
            <p className="font-serif text-xs leading-relaxed text-ink-muted mb-3">
              {t("factualIntegrityDesc")}
            </p>
            <p className="meta text-[0.6875rem]">
              <Link href="/admin/login" className="underline text-ink hover:text-ink-muted">
                Editorial Login (CMS Console)
              </Link>
            </p>
          </div>
        </div>

        <PaperDivider variant="hairline" className="mb-4" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 meta text-[0.6875rem] text-ink-muted">
          <p>© 2026 {siteConfig.name}. {t("allRightsReserved")}</p>
          <p>Phase 3 Editorial Platform · Jakarta, Indonesia</p>
        </div>
      </div>
    </footer>
  );
}
