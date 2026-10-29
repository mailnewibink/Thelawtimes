import type { Metadata } from "next";
import { getAnnouncements, ANNOUNCEMENT_TYPES } from "@/lib/content";
import { AnnouncementsExplorer } from "@/components/explorer/AnnouncementsExplorer";
import { DemoContentNotice } from "@/components/ui/DemoContentNotice";
import { BroadSheetLegalNotice } from "@/components/editorial/BroadSheetLegalNotice";

export const metadata: Metadata = {
  title: "Official Announcements & Legal Notices",
  description:
    "Formal archive of public legal notices, court summons, bankruptcy decrees, and corporate disclosures published in The Law Times.",
};

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div className="space-y-8">
      <header className="border-b-[3px] border-ink pb-4">
        <p className="kicker text-ink-muted mb-1">Section III · Gazette</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-ink mb-3">
          Official Announcements & Legal Notices
        </h1>
        <p className="font-serif text-base sm:text-lg text-ink-soft max-w-2xl leading-relaxed">
          The permanent gazette and publication record for formal public summons,
          insolvency curator notices, corporate liquidations, and statutory communications.
        </p>
      </header>

      <DemoContentNotice
        variant="panel"
        message="IMPORTANT: All notices displayed on this page are sample demonstration entries. They carry no legal force, do not constitute actual court summons, and do not represent authentic insolvency or corporate filings."
      />

      {/* Featured BroadSheet Notice from Reference */}
      <BroadSheetLegalNotice />

      <AnnouncementsExplorer
        initialAnnouncements={announcements}
        types={ANNOUNCEMENT_TYPES}
      />
    </div>
  );
}
