"use client";

import { SimplePageShell } from "@/components/shared/simple-page-shell";
import { useLanguage } from "@/components/i18n/language-provider";
import { pickLocalized } from "@/lib/i18n/localized-content";
import type { CmsCareersPage } from "@/sanity/simple-pages";

type CareersPageContentProps = {
  page: CmsCareersPage;
};

export function CareersPageContent({ page }: CareersPageContentProps) {
  const { locale } = useLanguage();

  return (
    <SimplePageShell
      eyebrow={pickLocalized(page.eyebrow, locale)}
      title={pickLocalized(page.title, locale)}
      description={pickLocalized(page.description, locale)}
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="text-2xl font-bold tracking-[-0.04em] text-slate-950">
            {pickLocalized(page.sectionTitle, locale)}
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-500">
            {pickLocalized(page.sectionDescription, locale)}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {page.departments.map((department) => (
            <div
              key={pickLocalized(department.title, locale)}
              className="border border-slate-200 p-5"
            >
              <h3 className="text-sm font-bold text-slate-950">
                {pickLocalized(department.title, locale)}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                {pickLocalized(department.description, locale)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SimplePageShell>
  );
}
