import type { Metadata } from "next";

import { SimplePageShell } from "@/components/shared/simple-page-shell";
import { company } from "@/config/company";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for personal data submitted through Indoteksaft website.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <SimplePageShell
      eyebrow="Privacy"
      title="Privacy Policy"
      description="How we handle information submitted through our website and contact forms."
    >
      <div className="prose prose-slate max-w-none">
        <p>
          {company.legalName} menghargai privasi pengunjung dan menjaga
          informasi yang dikirimkan melalui website ini untuk kebutuhan
          komunikasi bisnis yang relevan.
        </p>
        <h2>Information We Collect</h2>
        <p>
          Kami dapat menerima nama, email, nomor telepon, perusahaan, posisi,
          industri, serta kebutuhan proyek yang dikirim melalui form kontak.
        </p>
        <h2>How We Use Information</h2>
        <p>
          Informasi digunakan untuk menanggapi inquiry, menyusun rekomendasi
          solusi, dan melakukan komunikasi lanjutan terkait kebutuhan bisnis.
        </p>
        <h2>Contact</h2>
        <p>
          Pertanyaan privasi dapat dikirimkan ke {company.email}.
        </p>
      </div>
    </SimplePageShell>
  );
}
