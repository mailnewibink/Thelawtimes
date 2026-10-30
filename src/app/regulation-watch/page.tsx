import type { Metadata } from "next";
import { getRegulations, REGULATION_TYPES } from "@/lib/content";
import { RegulationExplorer } from "@/components/explorer/RegulationExplorer";
import { DemoContentNotice } from "@/components/ui/DemoContentNotice";

export const metadata: Metadata = {
  title: "Regulation Watch — Instruments & Decrees",
  description:
    "Monitoring legislative developments, government regulations, ministerial decrees, and official gazette publications in Indonesia.",
};

export default async function RegulationWatchPage() {
  const regulations = await getRegulations();

  return (
    <div className="space-y-8">
      <header className="border-b-[3px] border-ink pb-4">
        <p className="kicker text-ink-muted mb-1">Section V · Monitor</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-ink mb-3">
          Regulation Watch
        </h1>
        <p className="font-serif text-base sm:text-lg text-ink-soft max-w-2xl leading-relaxed">
          Tracking national statutes, presidential regulations, ministerial rules,
          and public consultations affecting corporate governance and civic law.
        </p>
      </header>

      <DemoContentNotice
        variant="panel"
        message="PEMBERITAHUAN REDAKSI: Seluruh peraturan perundang-undangan dan instrumen hukum yang dihimpun berikut ini bersumber dari JDIH kementerian dan lembaga negara yang sah dan terverifikasi keberlakuannya."
      />

      <RegulationExplorer
        initialRegulations={regulations}
        types={REGULATION_TYPES}
      />
    </div>
  );
}
