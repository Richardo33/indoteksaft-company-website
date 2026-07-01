"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  MonitorCog,
  Sparkles,
  X,
} from "lucide-react";

import { useLanguage } from "@/components/i18n/language-provider";
import { LaptopMockup } from "@/components/sections/enterprise-software-section";
import { Container } from "@/components/shared/container";
import {
  pickLocalized,
  pickLocalizedList,
} from "@/lib/i18n/localized-content";
import type { CmsProductDetail } from "@/sanity/products";

type ProductDetailContentProps = {
  product: CmsProductDetail;
};

export function ProductDetailContent({ product }: ProductDetailContentProps) {
  const { locale } = useLanguage();
  const shortName = pickLocalized(product.shortName, locale);
  const subtitle = pickLocalized(product.subtitle, locale);
  const description = pickLocalized(product.description, locale);
  const features = pickLocalizedList(product.features, locale);
  const benefits = pickLocalizedList(product.benefits, locale);
  const hasActions = Boolean(product.brochureUrl || product.demoUrl);

  return (
    <main className="bg-white text-slate-950" data-i18n-skip>
      <section className="pt-18">
        <Container className="relative py-10 sm:py-12 lg:py-16">
          <Link
            href="/products"
            aria-label={locale === "id" ? "Kembali ke produk" : "Back to products"}
            className="absolute right-4 top-8 grid size-11 place-items-center border border-slate-200 text-slate-400 transition hover:border-blue-600 hover:text-blue-600 sm:right-6 lg:right-0"
          >
            <X aria-hidden="true" size={20} />
          </Link>

          <div className="grid gap-10 pt-10 lg:grid-cols-[0.9fr_1fr] lg:items-center">
            <div className="flex justify-center lg:justify-start">
              <div className="w-full max-w-[360px]">
                <LaptopMockup
                  theme={product.theme}
                  screenImage={product.image}
                  screenAlt={shortName}
                  surfaceClassName="bg-white"
                  fadeClassName="via-white/70 to-white"
                />
              </div>
            </div>

            <div className="max-w-xl">
              <h1 className="text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                {shortName}
              </h1>
              <p className="mt-1 text-sm font-bold text-blue-600">
                {subtitle}
              </p>
              <p className="mt-6 text-base leading-8 text-slate-600">
                {description}
              </p>

              {hasActions && (
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  {product.brochureUrl && (
                    <Link
                      href={product.brochureUrl}
                      className="inline-flex min-h-12 items-center justify-center gap-2 border border-blue-600 px-7 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                    >
                      <Download aria-hidden="true" size={16} />
                      {locale === "id" ? "Download Brosur" : "Download Brochure"}
                    </Link>
                  )}

                  {product.demoUrl && (
                    <Link
                      href={product.demoUrl}
                      className="inline-flex min-h-12 items-center justify-center gap-2 bg-blue-600 px-7 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      {locale === "id" ? "Minta Demo" : "Request Demo"}
                      <ArrowRight aria-hidden="true" size={16} />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <ProductListCard
              title={locale === "id" ? "Fitur" : "Features"}
              icon="features"
              items={features}
            />
            <ProductListCard
              title={
                locale === "id" ? "Manfaat untuk Bisnis" : "Benefit for Business"
              }
              icon="benefits"
              items={benefits}
            />
          </div>
        </Container>
      </section>
    </main>
  );
}

type ProductListCardProps = {
  title: string;
  icon: "features" | "benefits";
  items: string[];
};

function ProductListCard({ title, icon, items }: ProductListCardProps) {
  const HeadingIcon = icon === "features" ? MonitorCog : Sparkles;

  return (
    <section aria-labelledby={`${icon}-title`}>
      <div className="flex min-h-14 items-center gap-3 border border-slate-200 px-6">
        <HeadingIcon aria-hidden="true" size={18} className="text-blue-600" />
        <h2
          id={`${icon}-title`}
          className="text-sm font-bold uppercase tracking-[0.08em] text-slate-950"
        >
          {title}
        </h2>
      </div>

      <ul className="space-y-6 px-8 py-7">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-4 text-sm text-slate-600"
          >
            {icon === "features" ? (
              <span className="mt-2 size-2 shrink-0 bg-cyan-200" />
            ) : (
              <CheckCircle2
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-emerald-500"
                size={17}
              />
            )}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
