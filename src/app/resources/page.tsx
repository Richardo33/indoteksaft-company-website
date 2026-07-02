import type { Metadata } from "next";

import { ResourcesPageContent } from "@/components/resources/resources-page-content";
import { getResourcesNavigation } from "@/sanity/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Explore Indoteksaft resources including portfolio projects, clients, and blog articles.",
  alternates: {
    canonical: "/resources",
  },
};

export default async function ResourcesPage() {
  const resources = await getResourcesNavigation();

  return <ResourcesPageContent resources={resources} />;
}
