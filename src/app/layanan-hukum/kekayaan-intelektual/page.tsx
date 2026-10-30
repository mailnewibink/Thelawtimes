import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLegalServiceBySlug } from "@/data/legal-services";
import { LegalServiceDetailTemplate } from "@/components/services/LegalServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Kekayaan Intelektual (KI/HKI) — Layanan Hukum | The Law Times",
  description:
    "Perlindungan statutori hak cipta, paten teknologi, paten sederhana, desain industri, indikasi geografis, dan rahasia dagang.",
};

export default function KekayaanIntelektualPage() {
  const service = getLegalServiceBySlug("kekayaan-intelektual");
  if (!service) notFound();

  return <LegalServiceDetailTemplate service={service} />;
}
