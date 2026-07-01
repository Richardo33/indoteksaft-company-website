"use client";

import Image from "next/image";

import { useLanguage } from "@/components/i18n/language-provider";
import { Container } from "@/components/shared/container";
import { pickLocalized } from "@/lib/i18n/localized-content";
import type { CmsClientLogo, CmsResourceBanner } from "@/sanity/resources";

type ClientPageContentProps = {
  banner: CmsResourceBanner;
  clients: CmsClientLogo[];
};

export function ClientPageContent({ banner, clients }: ClientPageContentProps) {
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

      <section className="bg-white py-14 sm:py-16">
        <Container>
          <div className="grid grid-cols-3 items-center gap-x-7 gap-y-6 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10">
            {clients.map((client) => {
              const content = (
                <div className="relative mx-auto aspect-[3/2] w-full max-w-[92px]">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    fill
                    sizes="92px"
                    className="object-contain"
                  />
                </div>
              );

              return client.websiteUrl ? (
                <a
                  key={client.slug}
                  href={client.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={client.name}
                >
                  {content}
                </a>
              ) : (
                <div key={client.slug} aria-label={client.name}>
                  {content}
                </div>
              );
            })}
          </div>

          <div className="mt-16 h-px bg-slate-200" />
        </Container>
      </section>
    </main>
  );
}
