import type { Metadata } from "next";
import KebijakanRedaksiPage from "../kebijakan-redaksi/page";

export const metadata: Metadata = {
  title: "Editorial Policy & Kebijakan Redaksi | The Law Times",
  description: "Editorial guidelines and journalistic integrity standards of The Law Times.",
};

export default function EditorialPolicyPage() {
  return <KebijakanRedaksiPage />;
}
