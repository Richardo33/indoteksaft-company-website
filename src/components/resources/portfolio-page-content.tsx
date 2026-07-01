"use client";

import Image from "next/image";

import { useLanguage } from "@/components/i18n/language-provider";
import { Container } from "@/components/shared/container";
import { pickLocalized } from "@/lib/i18n/localized-content";
import type { CmsPortfolioProject, CmsResourceBanner } from "@/sanity/resources";

type PortfolioPageContentProps = {
  banner: CmsResourceBanner;
  projects: CmsPortfolioProject[];
};

export function PortfolioPageContent({
  banner,
  projects,
}: PortfolioPageContentProps) {
  const { locale } = useLanguage();

  return (
    <main className="bg-white text-slate-950" data-i18n-skip>
      <section className="bg-[#0d2f86] pt-18 text-white">
        <Container className="py-14 sm:py-16">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">
            {pickLocalized(banner.eyebrow, locale)}
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-cyan-200 sm:text-4xl">
            {pickLocalized(banner.title, locale)}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/85">
            {pickLocalized(banner.description, locale)}
          </p>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <Container>
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const title = pickLocalized(project.title, locale);
              const clientName = pickLocalized(project.clientName, locale);
              const category = pickLocalized(project.category, locale, "Client");

              return (
                <article
                  key={project.slug}
                  className="flex h-full flex-col bg-white shadow-sm"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                    <Image
                      src={project.image}
                      alt={title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-5 pb-4">
                    <h2 className="line-clamp-3 min-h-[72px] text-sm font-bold leading-6 text-slate-950">
                      {title}
                    </h2>
                    <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.08em] text-blue-600">
                      {category}
                    </p>
                    <p className="mt-1 line-clamp-2 min-h-10 text-xs uppercase leading-5 text-slate-500">
                      {clientName}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>
    </main>
  );
}
