import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLegalServiceBySlug } from "@/data/legal-services";
import { LegalServiceDetailTemplate } from "@/components/services/LegalServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Pendampingan Hukum Bisnis & Kontrak — Layanan Hukum | The Law Times",
  description:
    "Konsultasi hukum bisnis, penelaahan dan penyusunan kontrak, penanganan sengketa komersial perdata, somasi, dan mediasi.",
};

export default function PendampinganHukumPage() {
  const service = getLegalServiceBySlug("pendampingan-hukum");
  if (!service) notFound();

  return <LegalServiceDetailTemplate service={service} />;
}
