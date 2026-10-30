import { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PublicationRequestsClient } from "@/components/admin/PublicationRequestsClient";
import { getPublicationRequests } from "@/lib/repositories/publication-requests";

export const metadata: Metadata = {
  title: "Publication Requests — Editorial CMS | The Law Times",
  description: "Manajemen dan penelaahan permohonan publikasi perkara, putusan, dan artikel hukum klien.",
};

export default async function AdminPublicationRequestsPage() {
  const requests = await getPublicationRequests();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Publication Requests"
        description="Kelola permohonan publikasi perkara resmi, ringkasan putusan pengadilan, warta merek HKI, dan opini hukum dari pemohon eksternal."
      />

      <PublicationRequestsClient initialRequests={requests} />
    </div>
  );
}
