import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLegalServiceBySlug } from "@/data/legal-services";
import { LegalServiceDetailTemplate } from "@/components/services/LegalServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Legalitas Usaha & Izin OSS — Layanan Hukum | The Law Times",
  description:
    "Pendirian PT, CV, perizinan berusaha OSS RBA, pemetaan KBLI, akta notaris, SK Kemenkumham, dan penerbitan NIB.",
};

export default function LegalitasUsahaPage() {
  const service = getLegalServiceBySlug("legalitas-usaha");
  if (!service) notFound();

  return <LegalServiceDetailTemplate service={service} />;
}
