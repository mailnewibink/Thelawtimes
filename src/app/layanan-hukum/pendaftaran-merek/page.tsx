import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLegalServiceBySlug } from "@/data/legal-services";
import { LegalServiceDetailTemplate } from "@/components/services/LegalServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Pendaftaran Merek DJKI — Layanan Hukum | The Law Times",
  description:
    "Konsultasi, penelusuran merek dagang PDKI, penetapan kelas Nice Classification, dan pendampingan permohonan resmi ke DJKI Kementerian Hukum RI.",
};

export default function PendaftaranMerekPage() {
  const service = getLegalServiceBySlug("pendaftaran-merek");
  if (!service) notFound();

  return <LegalServiceDetailTemplate service={service} />;
}
