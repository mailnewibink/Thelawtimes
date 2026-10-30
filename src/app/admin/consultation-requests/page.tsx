import { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConsultationRequestsClient } from "@/components/admin/ConsultationRequestsClient";
import { getConsultationRequests } from "@/lib/repositories/consultation-requests";

export const metadata: Metadata = {
  title: "Permintaan Konsultasi — Editorial CMS | The Law Times",
  description: "Manajemen dan penelaahan permohonan konsultasi hukum dan legalitas klien.",
};

export default async function AdminConsultationRequestsPage() {
  const requests = await getConsultationRequests();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Permintaan Konsultasi Hukum"
        description="Kelola dan tindak lanjuti permintaan konsultasi masuk terkait pendaftaran merek, kekayaan intelektual, perizinan BPOM, legalitas usaha, dan pendampingan hukum bisnis."
      />

      <ConsultationRequestsClient initialRequests={requests} />
    </div>
  );
}
