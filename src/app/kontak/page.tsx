import type { Metadata } from "next";
import ContactPage from "../contact/page";

export const metadata: Metadata = {
  title: "Kontak Redaksi & Layanan Publikasi | The Law Times",
  description: "Informasi kontak resmi dewan redaksi The Law Times dan meja publikasi perkara hukum.",
};

export default function KontakAliasPage() {
  return <ContactPage />;
}
