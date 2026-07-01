import type { Metadata } from "next";

import { ClientPageContent } from "@/components/resources/client-page-content";
import { getClientPageData } from "@/sanity/resources";

export const metadata: Metadata = {
  title: "Client",
  description: "Client stories and organization references.",
  alternates: {
    canonical: "/resources/client",
  },
};

export const dynamic = "force-dynamic";

export default async function ClientResourcePage() {
  const data = await getClientPageData();

  return <ClientPageContent banner={data.banner} clients={data.clients} />;
}
