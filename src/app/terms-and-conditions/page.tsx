import type { Metadata } from "next";

import { LegalPageContent } from "@/components/simple-pages/legal-page-content";
import { getLegalPage } from "@/sanity/simple-pages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using Indoteksaft website and services.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
};

export default async function TermsAndConditionsPage() {
  const page = await getLegalPage("terms-and-conditions");

  return <LegalPageContent page={page} />;
}
