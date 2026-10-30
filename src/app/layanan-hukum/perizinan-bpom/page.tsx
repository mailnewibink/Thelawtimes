import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLegalServiceBySlug } from "@/data/legal-services";
import { LegalServiceDetailTemplate } from "@/components/services/LegalServiceDetailTemplate";

export const metadata: Metadata = {
  title: "Perizinan BPOM — Layanan Hukum | The Law Times",
  description:
    "Pendampingan registrasi izin edar BPOM MD/ML untuk pangan olahan, notifikasi kosmetik (NA), obat bahan alam (TR), dan suplemen kesehatan.",
};

export default function PerizinanBpomPage() {
  const service = getLegalServiceBySlug("perizinan-bpom");
  if (!service) notFound();

  return <LegalServiceDetailTemplate service={service} />;
}
