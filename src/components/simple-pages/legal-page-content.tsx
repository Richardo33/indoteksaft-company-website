"use client";

import { SimplePageShell } from "@/components/shared/simple-page-shell";
import { useLanguage } from "@/components/i18n/language-provider";
import {
  pickLocalized,
  pickLocalizedList,
} from "@/lib/i18n/localized-content";
import type { CmsLegalPage } from "@/sanity/simple-pages";

type LegalPageContentProps = {
  page: CmsLegalPage;
};

export function LegalPageContent({ page }: LegalPageContentProps) {
  const { locale } = useLanguage();

  return (
    <SimplePageShell
      eyebrow={pickLocalized(page.eyebrow, locale)}
      title={pickLocalized(page.title, locale)}
      description={pickLocalized(page.description, locale)}
    >
      <div className="prose prose-slate max-w-none">
        {page.sections.map((section, index) => {
          const heading = pickLocalized(section.heading, locale);
          const paragraphs = pickLocalizedList(section.body, locale);

          return (
            <section key={`${heading}-${index}`}>
              {heading && <h2>{heading}</h2>}
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          );
        })}
      </div>
    </SimplePageShell>
  );
}
