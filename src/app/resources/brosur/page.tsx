import type { Metadata } from "next";
import { Download } from "lucide-react";

import { SimplePageShell } from "@/components/shared/simple-page-shell";

export const metadata: Metadata = {
  title: "Brosur",
  description:
    "Download brochures and company profile materials from Indoteksaft.",
  alternates: {
    canonical: "/resources/brosur",
  },
};

const brochures = [
  {
    title: "Company Profile",
    description: "Overview kapabilitas, layanan, dan pengalaman Indoteksaft.",
  },
  {
    title: "Technology Solutions Overview",
    description: "Ringkasan solusi infrastructure, tech delivery, dan telecommunication.",
  },
  {
    title: "Product Portfolio",
    description: "Daftar produk enterprise software dan platform pendukung operasional.",
  },
];

export default function BrosurPage() {
  return (
    <SimplePageShell
      eyebrow="Resources"
      title="Brosur & Company Materials"
      description="Akses materi perusahaan dan dokumen overview solusi. Link download final dapat ditambahkan ketika file resmi sudah tersedia."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {brochures.map((brochure) => (
          <article key={brochure.title} className="border border-slate-200 p-6">
            <div className="grid size-11 place-items-center bg-cyan-50 text-blue-600">
              <Download aria-hidden="true" size={19} />
            </div>
            <h2 className="mt-6 text-base font-bold text-slate-950">
              {brochure.title}
            </h2>
            <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-500">
              {brochure.description}
            </p>
            <button
              type="button"
              disabled
              className="mt-6 inline-flex min-h-10 items-center justify-center border border-slate-200 px-5 text-sm font-semibold text-slate-400"
            >
              Coming Soon
            </button>
          </article>
        ))}
      </div>
    </SimplePageShell>
  );
}
