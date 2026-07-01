"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { useLanguage } from "@/components/i18n/language-provider";
import { ContactSection } from "@/components/sections/contact-section";
import { LaptopMockup } from "@/components/sections/enterprise-software-section";
import { InsightsSection } from "@/components/sections/insight-section";
import { Container } from "@/components/shared/container";
import { pickLocalized } from "@/lib/i18n/localized-content";
import type { HomeArticleCard } from "@/sanity/home";
import type { ProductsPageData } from "@/sanity/products";

type ProductsPageContentProps = {
  data: ProductsPageData;
  articlePagesData: HomeArticleCard[][];
};

export function ProductsPageContent({
  data,
  articlePagesData,
}: ProductsPageContentProps) {
  const { locale } = useLanguage();
  const bannerEyebrow = pickLocalized(data.banner.eyebrow, locale, "Product");
  const bannerTitle = pickLocalized(
    data.banner.title,
    locale,
    "Enterprise Software Solutions",
  );
  const bannerDescription = pickLocalized(data.banner.description, locale);

  return (
    <main className="bg-white text-slate-950">
      <section
        aria-labelledby="products-page-title"
        className="relative isolate overflow-hidden bg-[#06164b] pt-18 text-white"
        data-i18n-skip
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,#0d2f86_0%,#0d2f86_58%,#0a2571_68%,#06164b_78%,#06164b_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_58%_50%,rgba(37,99,235,0.28),transparent_35%),radial-gradient(circle_at_72%_48%,rgba(6,182,212,0.12),transparent_30%)]"
        />

        <Container className="relative z-10 min-h-[350px] py-14 lg:py-0">
          <div className="grid min-h-[350px] items-center gap-10 lg:grid-cols-[2fr_1fr]">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">
                {bannerEyebrow}
              </span>
              <h1
                id="products-page-title"
                className="mt-6 text-3xl font-bold tracking-[-0.04em] text-cyan-200 sm:text-4xl"
              >
                {bannerTitle}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/85">
                {bannerDescription}
              </p>
            </div>
            <div aria-hidden="true" className="hidden lg:block" />
          </div>
        </Container>

        <div className="absolute inset-y-0 right-0 z-0 hidden w-1/3 overflow-hidden lg:block">
          <Image
            src={data.banner.image}
            alt=""
            fill
            priority
            sizes="33vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#06164b] via-[#06164b]/55 to-transparent" />
        </div>
      </section>

      <section aria-label="Product catalog" className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-x-14 gap-y-20 sm:grid-cols-2 lg:grid-cols-4">
            {data.products.map((product) => {
              const productName = pickLocalized(product.name, locale);

              return (
                <article
                  key={product.slug}
                  className="flex h-full flex-col items-center text-center"
                  data-i18n-skip
                >
                  <LaptopMockup
                    theme={product.theme}
                    screenImage={product.image}
                    screenAlt={productName}
                    surfaceClassName="bg-white"
                    fadeClassName="via-white/70 to-white"
                  />
                  <h2 className="mt-6 line-clamp-2 min-h-12 max-w-72 text-sm font-bold leading-6 text-slate-950">
                    {productName}
                  </h2>
                  <Link
                    href={`/products/${product.slug}`}
                    className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 border border-blue-600 px-7 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                    aria-label={`Detail product ${productName}`}
                  >
                    {locale === "id" ? "Detail Produk" : "Detail Product"}
                    <ArrowUpRight aria-hidden="true" size={15} />
                  </Link>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <InsightsSection articlePagesData={articlePagesData} />
      <ContactSection />
    </main>
  );
}
