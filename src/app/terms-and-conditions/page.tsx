import type { Metadata } from "next";

import { SimplePageShell } from "@/components/shared/simple-page-shell";
import { company } from "@/config/company";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using Indoteksaft website and services.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
};

export default function TermsAndConditionsPage() {
  return (
    <SimplePageShell
      eyebrow="Legal"
      title="Terms & Conditions"
      description={`General terms for accessing information and submitting inquiries through ${company.brandName}.`}
    >
      <div className="prose prose-slate max-w-none">
        <p>
          Konten pada website ini disediakan sebagai informasi umum mengenai
          profil, layanan, produk, dan aktivitas {company.legalName}.
        </p>
        <h2>Use of Website</h2>
        <p>
          Pengunjung setuju untuk menggunakan website ini secara bertanggung
          jawab dan tidak melakukan aktivitas yang dapat mengganggu keamanan,
          performa, atau integritas sistem.
        </p>
        <h2>Service Information</h2>
        <p>
          Informasi produk dan layanan dapat berubah sewaktu-waktu mengikuti
          kebutuhan bisnis, teknis, dan kesepakatan dengan klien.
        </p>
        <h2>Contact</h2>
        <p>
          Untuk pertanyaan lebih lanjut terkait ketentuan penggunaan, hubungi
          kami melalui {company.email}.
        </p>
      </div>
    </SimplePageShell>
  );
}
