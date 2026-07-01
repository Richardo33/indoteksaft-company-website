import {
  ArrowRight,
  Banknote,
  Building2,
  Factory,
  GraduationCap,
  HeartPulse,
  Landmark,
  Sprout,
  TowerControl,
} from "lucide-react";
import type { ComponentType } from "react";

import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { getHomeIndustries } from "@/sanity/home";

const industryIcons: Record<
  string,
  ComponentType<{ size?: number; className?: string }>
> = {
  government: Landmark,
  manufacturing: Factory,
  education: GraduationCap,
  healthcare: HeartPulse,
  telecommunication: TowerControl,
  enterprise: Building2,
  banking: Banknote,
  agriculture: Sprout,
  "Government & BUMN": Landmark,
  Manufacturing: Factory,
  Education: GraduationCap,
  Healthcare: HeartPulse,
  Telecommunication: TowerControl,
  Enterprise: Building2,
  "Banking & Financial Services": Banknote,
  Agriculture: Sprout,
};

export async function IndustrySummarySection() {
  const industries = await getHomeIndustries();

  return (
    <section
      aria-labelledby="industry-summary-title"
      className="bg-white py-16 text-slate-950 sm:py-20"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Trusted across industries
            </span>
            <h2
              id="industry-summary-title"
              className="mt-5 max-w-xl text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl"
            >
              Technology Solutions for Every Industry
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-500 sm:text-lg">
              Building a strong digital foundation to support innovation,
              efficiency, and business growth across multiple sectors.
            </p>
            <a
              href="/industries"
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 border border-blue-600 px-7 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
            >
              All Industries
              <ArrowRight aria-hidden="true" size={16} />
            </a>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-4 lg:justify-center">
            {industries.map((industry, index) => {
              const Icon =
                industryIcons[industry.icon] ??
                industryIcons[industry.title] ??
                Building2;

              return (
                <li key={industry.slug}>
                  <Reveal
                    delay={index * 55}
                    duration={550}
                    direction="up"
                    className="h-full"
                  >
                    <a
                      href={`/industries#${industry.slug}`}
                      className="group inline-flex min-h-12 items-center gap-3 bg-cyan-50 px-6 text-sm font-medium text-slate-600 transition hover:bg-blue-600 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      <Icon
                        aria-hidden="true"
                        size={16}
                        className="text-blue-600 transition group-hover:text-white"
                      />
                      {industry.title}
                    </a>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-14 h-px bg-slate-200" />
      </Container>
    </section>
  );
}
