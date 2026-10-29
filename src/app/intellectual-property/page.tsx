import type { Metadata } from "next";
import { getArticles, IP_CATEGORIES } from "@/lib/content";
import { IPExplorer } from "@/components/explorer/IPExplorer";
import { DemoContentNotice } from "@/components/ui/DemoContentNotice";

export const metadata: Metadata = {
  title: "Intellectual Property — Trademarks, Patents & Copyright",
  description:
    "Editorial analysis, registration principles, and case studies regarding trademarks, patents, copyright, and industrial designs.",
};

export default async function IntellectualPropertyPage() {
  const articles = await getArticles("intellectual-property");

  return (
    <div className="space-y-8">
      <header className="border-b-[3px] border-ink pb-4">
        <p className="kicker text-ink-muted mb-1">Section VI · Commercial & IP</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-ink mb-3">
          Intellectual Property
        </h1>
        <p className="font-serif text-base sm:text-lg text-ink-soft max-w-2xl leading-relaxed">
          Comprehensive reporting on industrial property rights, trademark classifications,
          patent specification drafting, copyright protection, and trade secrets in Indonesia.
        </p>
      </header>

      <DemoContentNotice
        variant="panel"
        message="NOTE: All intellectual property articles and references on this page are educational demo samples. They do not report on genuine trademark disputes, actual patent registrations, or real brand infringement claims."
      />

      <IPExplorer
        initialArticles={articles}
        categories={IP_CATEGORIES}
      />
    </div>
  );
}
