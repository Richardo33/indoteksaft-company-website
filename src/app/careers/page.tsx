import type { Metadata } from "next";

import { CareersPageContent } from "@/components/simple-pages/careers-page-content";
import { getCareersPage } from "@/sanity/simple-pages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Explore career opportunities and future openings at Indoteksaft.",
  alternates: {
    canonical: "/careers",
  },
};

export default async function CareersPage() {
  const page = await getCareersPage();

  return <CareersPageContent page={page} />;
}
