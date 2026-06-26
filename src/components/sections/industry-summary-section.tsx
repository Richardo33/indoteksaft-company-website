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

import { Container } from "@/components/shared/container";

const industryChips = [
  { label: "Government & BUMN", icon: Landmark },
  { label: "Manufacturing", icon: Factory },
  { label: "Education", icon: GraduationCap },
  { label: "Healthcare", icon: HeartPulse },
  { label: "Telecommunication", icon: TowerControl },
  { label: "Enterprise", icon: Building2 },
  { label: "Banking & Financial Services", icon: Banknote },
  { label: "Agriculture", icon: Sprout },
] as const;

export function IndustrySummarySection() {
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
              href="#industries"
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 border border-blue-600 px-7 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
            >
              All Industries
              <ArrowRight aria-hidden="true" size={16} />
            </a>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-4 lg:justify-center">
            {industryChips.map((industry) => {
              const Icon = industry.icon;

              return (
                <li key={industry.label}>
                  <a
                    href="#industries"
                    className="inline-flex min-h-12 items-center gap-3 bg-cyan-50 px-6 text-sm font-medium text-slate-600 transition hover:bg-blue-600 hover:text-white"
                  >
                    <Icon
                      aria-hidden="true"
                      size={16}
                      className="text-blue-600 transition"
                    />
                    {industry.label}
                  </a>
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
