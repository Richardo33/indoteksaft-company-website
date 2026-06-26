import type { Metadata } from "next";
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

import { ContactSection } from "@/components/sections/contact-section";
import { Container } from "@/components/shared/container";
import { industryCards, type IndustryCard } from "@/config/industries";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Technology solutions for government, manufacturing, education, healthcare, telecommunication, enterprise, banking, and agriculture sectors.",
  alternates: {
    canonical: "/industries",
  },
};

const industryIcons = {
  government: Landmark,
  manufacturing: Factory,
  education: GraduationCap,
  healthcare: HeartPulse,
  telecommunication: TowerControl,
  enterprise: Building2,
  banking: Banknote,
  agriculture: Sprout,
} satisfies Record<
  IndustryCard["icon"],
  React.ComponentType<{ size?: number; className?: string }>
>;

export default function IndustriesPage() {
  return (
    <main className="bg-white text-slate-950">
      <section className="relative isolate overflow-hidden bg-[#06164b] pt-18 text-white">
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
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">
              Trusted across industries
            </span>
            <h1 className="mt-6 text-3xl font-bold tracking-[-0.04em] text-cyan-200 sm:text-4xl">
              Technology Solutions for Every Industry
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/85">
              Building a strong digital foundation to support innovation,
              efficiency, and business growth across multiple sectors.
            </p>
            </div>
            <div aria-hidden="true" className="hidden lg:block" />
          </div>
        </Container>

        <div className="absolute inset-y-0 right-0 z-0 hidden w-1/3 overflow-hidden lg:block">
          <Image
            src="/images/products-banner.png"
            alt=""
            fill
            priority
            sizes="33vw"
            className="object-contain object-right"
          />
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#06164b] via-[#06164b]/55 to-transparent" />
        </div>
      </section>

      <section aria-label="Industry list" className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid border border-slate-200 md:grid-cols-2 lg:grid-cols-3">
            {industryCards.map((industry) => {
              const Icon = industryIcons[industry.icon];

              return (
                <Link
                  key={industry.slug}
                  href="/#contact"
                  className="group min-h-[190px] border-b border-slate-200 p-7 transition hover:bg-slate-50 md:border-r lg:[&:nth-child(3n)]:border-r-0"
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
                    {industry.title}
                  </h2>
                  <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-500">
                    {industry.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      <ContactSection />
    </main>
  );
}
