import type { Metadata } from "next";

import { BrosurPageContent } from "@/components/resources/brosur-page-content";
import { getDocumentResources } from "@/sanity/documents-events";

export const metadata: Metadata = {
  title: "Brosur",
  description:
    "Download brochures and company profile materials from Indoteksaft.",
  alternates: {
    canonical: "/resources/brosur",
  },
};

export const dynamic = "force-dynamic";

export default async function BrosurPage() {
  const documents = await getDocumentResources();

  return <BrosurPageContent documents={documents} />;
}
