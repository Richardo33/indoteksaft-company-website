import type { Metadata } from "next";

import { IndustriesPageContent } from "@/components/industries/industries-page-content";
import { ContactSection } from "@/components/sections/contact-section";
import { getIndustriesPageData } from "@/sanity/industries";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Technology solutions for government, manufacturing, education, healthcare, telecommunication, enterprise, banking, and agriculture sectors.",
  alternates: {
    canonical: "/industries",
  },
};

export const dynamic = "force-dynamic";

export default async function IndustriesPage() {
  const data = await getIndustriesPageData();

  return (
    <>
      <IndustriesPageContent data={data} />
      <ContactSection />
    </>
  );
}
