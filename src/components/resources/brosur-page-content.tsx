"use client";

import { Download } from "lucide-react";

import { useLanguage } from "@/components/i18n/language-provider";
import { CompanyProfileDownloadDialog } from "@/components/sections/company-profile-download-dialog";
import { SimplePageShell } from "@/components/shared/simple-page-shell";
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
          const fileUrl = document.fileAssetUrl ?? document.fileUrl;

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
              {fileUrl ? (
                <div className="mt-6">
                  <CompanyProfileDownloadDialog
                    downloadFileUrl={fileUrl}
                    downloadUrl="/resources/brosur"
                    label={locale === "id" ? "Download Dokumen" : "Download Document"}
                    description={
                      locale === "id"
                        ? "Isi form singkat untuk mengunduh."
                        : "Complete a short form to download."
                    }
                    dialogTitle={title}
                    dialogDescription={
                      locale === "id"
                        ? "Isi data singkat berikut agar tim sales kami dapat membantu follow-up kebutuhan perusahaan Anda."
                        : "Complete this short form so our sales team can follow up your business needs."
                    }
                    message={`Download request for ${title}. Please notify the sales team for follow-up.`}
                  />
                </div>
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
