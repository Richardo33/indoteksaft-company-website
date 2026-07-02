import type { Metadata } from "next";

import { ContactPageContent } from "@/components/contact/contact-page-content";
import { getContactPageData } from "@/sanity/contact-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Sales",
  description:
    "Hubungi tim Indoteksaft untuk konsultasi teknologi, company profile, assessment, dan kebutuhan transformasi digital.",
  alternates: {
    canonical: "/contact",
  },
};

export default async function ContactPage() {
  const data = await getContactPageData();

  return <ContactPageContent data={data} />;
}
