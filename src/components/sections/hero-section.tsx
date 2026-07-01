"use client";

import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { useLanguage } from "@/components/i18n/language-provider";
import { Container } from "@/components/shared/container";
import { HeroParticles } from "@/components/shared/hero-particles";
import { RotatingTypeText } from "@/components/shared/rotating-type-text";
import { pickLocalized } from "@/lib/i18n/localized-content";
import type { HomeHeroContent } from "@/sanity/home";

type HeroSectionProps = {
  content?: HomeHeroContent;
};

export function HeroSection({ content }: HeroSectionProps) {
  const { locale } = useLanguage();
  const copy = {
    eyebrow: pickLocalized(content?.eyebrow, locale),
    titlePrefix: pickLocalized(content?.titlePrefix, locale),
    rotatingWords:
      content?.rotatingWords.map((word) => pickLocalized(word, locale)).filter(Boolean) ??
      [],
    titleSuffix: pickLocalized(content?.titleSuffix, locale),
    description: pickLocalized(content?.description, locale),
    primaryCta: pickLocalized(content?.primaryCta, locale),
    primaryHref: content?.primaryHref ?? "/contact",
    secondaryCta: pickLocalized(content?.secondaryCta, locale),
    secondaryHref: content?.secondaryHref ?? "/solutions",
  };

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate min-h-190 overflow-hidden pt-18"
    >
      <Image
        src={content?.backgroundImage ?? "/images/hero-bg.png"}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-30 object-cover object-center"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#050b18_0%,rgba(5,11,24,.94)_34%,rgba(5,11,24,.5)_62%,rgba(5,11,24,.14)_100%)]" />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(5,11,24,.24)_0%,rgba(5,11,24,.06)_45%,rgba(5,11,24,.28)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_38%,rgba(0,102,255,.12),transparent_34%)]" />
      <div className="tech-grid absolute inset-0 -z-10 opacity-40" />
      <div className="absolute inset-0 -z-10 opacity-80 mask-[linear-gradient(to_bottom,black_10%,black_75%,transparent_100%)]">
        <HeroParticles />
      </div>

      <Container className="grid min-h-162.5 items-center py-12 sm:py-14 lg:-translate-y-5">
        <div className="min-w-0" data-i18n-skip>
          <div className="mb-7 inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/6 px-3 py-2 sm:px-4">
            <ShieldCheck
              aria-hidden="true"
              className="text-cyan-300"
              size={15}
            />
            <span className="truncate text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200 sm:text-xs sm:tracking-[0.22em]">
              {copy.eyebrow}
            </span>
          </div>

          <h1
            id="hero-title"
            className="max-w-4xl text-balance text-[2.65rem] font-bold leading-[1.04] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl"
          >
            {copy.titlePrefix}
            <span className="block min-h-[2.08em] sm:min-h-[2.02em] lg:min-h-[1.98em]">
              <RotatingTypeText
                key={locale}
                words={copy.rotatingWords}
                className="bg-linear-to-r from-blue-500 via-cyan-300 to-blue-400 bg-clip-text text-transparent"
              />
            </span>
            <span className="block">{copy.titleSuffix}</span>
          </h1>

          <p className="mt-7 max-w-2xl text-pretty text-base leading-8 text-slate-300/70 sm:text-lg">
            {copy.description}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href={copy.primaryHref}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-xl shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-500"
            >
              {copy.primaryCta}
              <ArrowRight aria-hidden="true" size={17} />
            </a>
            <a
              href={copy.secondaryHref}
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/15 bg-white/4 px-6 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-cyan-300/6"
            >
              {copy.secondaryCta}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
