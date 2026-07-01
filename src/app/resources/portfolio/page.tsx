import type { Metadata } from "next";

import { PortfolioPageContent } from "@/components/resources/portfolio-page-content";
import { getPortfolioPageData } from "@/sanity/resources";

export const metadata: Metadata = {
  title: "Portfolio Project",
  description: "Selected portfolio projects and implementation highlights.",
  alternates: {
    canonical: "/resources/portfolio",
  },
};

export const dynamic = "force-dynamic";

export default async function PortfolioResourcePage() {
  const data = await getPortfolioPageData();

  return <PortfolioPageContent banner={data.banner} projects={data.projects} />;
}
