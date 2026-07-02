"use client";

import { Download } from "lucide-react";

import { SimplePageShell } from "@/components/shared/simple-page-shell";
import { useLanguage } from "@/components/i18n/language-provider";
import { pickLocalized } from "@/lib/i18n/localized-content";
import type { CmsDocumentResource } from "@/sanity/documents-events";

type BrosurPageContentProps = {
  documents: CmsDocumentResource[];
};

export function BrosurPageContent({ documents }: BrosurPageContentProps) {
  const { locale } = useLanguage();

  return (
    <SimplePageShell
      eyebrow="Resources"
      title={
        locale === "id"
          ? "Brosur & Materi Perusahaan"
          : "Brochures & Company Materials"
      }
      description={
        locale === "id"
          ? "Akses materi perusahaan dan dokumen overview solusi."
          : "Access company materials and solution overview documents."
      }
    >
      <div className="grid gap-5 md:grid-cols-3" data-i18n-skip>
        {documents.map((document) => {
          const title = pickLocalized(document.title, locale);
          const description = pickLocalized(document.description, locale);
          const href = document.fileAssetUrl ?? document.fileUrl;

          return (
            <article key={document.slug} className="border border-slate-200 p-6">
              <div className="grid size-11 place-items-center bg-cyan-50 text-blue-600">
                <Download aria-hidden="true" size={19} />
              </div>
              <h2 className="mt-6 text-base font-bold text-slate-950">
                {title}
              </h2>
              <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-500">
                {description}
              </p>
              {href ? (
                <a
                  href={href}
                  className="mt-6 inline-flex min-h-10 items-center justify-center border border-blue-600 px-5 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                >
                  {locale === "id" ? "Buka Dokumen" : "Open Document"}
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-6 inline-flex min-h-10 items-center justify-center border border-slate-200 px-5 text-sm font-semibold text-slate-400"
                >
                  Coming Soon
                </button>
              )}
            </article>
          );
        })}
      </div>
    </SimplePageShell>
  );
}
