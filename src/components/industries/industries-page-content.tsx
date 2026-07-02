"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Banknote,
  Building2,
  Factory,
  GraduationCap,
  HeartPulse,
  Landmark,
  Sprout,
  TowerControl,
} from "lucide-react";

import { useLanguage } from "@/components/i18n/language-provider";
import { Container } from "@/components/shared/container";
import { pickLocalized } from "@/lib/i18n/localized-content";
import type { IndustriesPageData } from "@/sanity/industries";

type IndustriesPageContentProps = {
  data: IndustriesPageData;
};

type IndustryIcon = React.ComponentType<{ size?: number; className?: string }>;

const industryIcons: Record<string, IndustryIcon> = {
  government: Landmark,
  "government-bumn": Landmark,
  manufacturing: Factory,
  education: GraduationCap,
  healthcare: HeartPulse,
  telecommunication: TowerControl,
  enterprise: Building2,
  banking: Banknote,
  "banking-financial-services": Banknote,
  agriculture: Sprout,
};

export function IndustriesPageContent({ data }: IndustriesPageContentProps) {
  const { locale } = useLanguage();

  return (
    <main className="bg-white text-slate-950" data-i18n-skip>
      <section className="relative isolate overflow-hidden bg-[#06164b] pt-18 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,#0d2f86_0%,#0d2f86_57%,#0a2571_67%,#06164b_78%,#06164b_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_58%_50%,rgba(37,99,235,0.28),transparent_35%),radial-gradient(circle_at_72%_48%,rgba(6,182,212,0.12),transparent_30%)]"
        />

        <Container className="relative z-10 min-h-[350px] py-14 lg:py-0">
          <div className="grid min-h-[350px] items-center gap-10 lg:grid-cols-[2fr_1fr]">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">
                {pickLocalized(data.banner.eyebrow, locale)}
              </span>
              <h1 className="mt-6 text-3xl font-bold tracking-[-0.04em] text-cyan-200 sm:text-4xl">
                {pickLocalized(data.banner.title, locale)}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/85">
                {pickLocalized(data.banner.description, locale)}
              </p>
            </div>
            <div aria-hidden="true" className="hidden lg:block" />
          </div>
        </Container>

        <div className="absolute inset-y-0 right-0 z-0 hidden w-1/3 overflow-hidden bg-[#06164b] lg:block">
          <Image
            src={data.banner.image}
            alt=""
            fill
            priority
            sizes="33vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#06164b] via-[#06164b]/70 to-transparent" />
        </div>
      </section>

      <section aria-label="Industry list" className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid border border-slate-200 md:grid-cols-2 lg:grid-cols-3">
            {data.industries.map((industry) => {
              const Icon =
                industryIcons[industry.iconName] ??
                industryIcons[industry.slug] ??
                Building2;
              const title = pickLocalized(industry.title, locale);
              const description = pickLocalized(industry.description, locale);

              return (
                <Link
                  key={industry.slug}
                  id={industry.slug}
                  href="/contact"
                  className="group scroll-mt-28 min-h-47.5 border-b border-slate-200 p-7 transition hover:bg-slate-50 md:border-r lg:nth-[3n]:border-r-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center bg-cyan-50 text-blue-600">
                      <Icon aria-hidden="true" size={18} />
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      size={17}
                      className="text-slate-300 transition group-hover:text-blue-600"
                    />
                  </div>
                  <h2 className="mt-7 text-sm font-bold uppercase tracking-[0.04em] text-slate-950">
                    {title}
                  </h2>
                  <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-500">
                    {description}
                  </p>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </main>
  );
}
