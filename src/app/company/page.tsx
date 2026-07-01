import type { Metadata } from "next";

import { CompanyPageContent } from "@/components/company/company-page-content";
import { ContactSection } from "@/components/sections/contact-section";
import { getCompanyPageData } from "@/sanity/company-page";

export const metadata: Metadata = {
  title: "Company",
  description:
    "About Indoteksaft, our vision, mission, and core values as an information technology solutions company.",
  alternates: {
    canonical: "/company",
  },
};

export const dynamic = "force-dynamic";

export default async function CompanyPage() {
  const data = await getCompanyPageData();

  return (
    <main className="bg-white text-slate-950">
      <CompanyPageContent data={data} />
      <ContactSection />
    </main>
  );
}
