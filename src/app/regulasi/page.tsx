import { Metadata } from "next";
import { getRegulations } from "@/lib/content";
import { EditorialSectionHeader } from "@/components/editorial/EditorialSectionHeader";
import { RegulationListItem } from "@/components/editorial/RegulationListItem";

export const metadata: Metadata = {
  title: "Pantauan Regulasi & Kebijakan — The Law Times",
  description:
    "Pelacakan undang-undang, peraturan pemerintah, keputusan kementerian, dan lembaran negara Republik Indonesia.",
};

export default async function RegulationsPage() {
  const regulations = await getRegulations();

  return (
    <div className="space-y-10">
      <EditorialSectionHeader
        title="Pantauan Regulasi & Kebijakan"
        subtitle="Dokumentasi komparatif perkembangan undang-undang, ketetapan menteri, dan warta regulasi nasional"
        kicker="Lembaran Regulasi"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {regulations.map((reg) => (
          <RegulationListItem key={reg.id} regulation={reg} />
        ))}
      </div>
    </div>
  );
}
