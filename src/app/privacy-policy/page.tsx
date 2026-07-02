import type { Metadata } from "next";

import { LegalPageContent } from "@/components/simple-pages/legal-page-content";
import { getLegalPage } from "@/sanity/simple-pages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for personal data submitted through Indoteksaft website.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default async function PrivacyPolicyPage() {
  const page = await getLegalPage("privacy-policy");

  return <LegalPageContent page={page} />;
}
