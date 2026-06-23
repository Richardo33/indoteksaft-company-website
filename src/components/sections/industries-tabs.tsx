"use client";

import Image from "next/image";
import {
  Building2,
  CheckCircle2,
  GraduationCap,
  HeartPulse,
  Landmark,
  RadioTower,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

export type IndustryTab = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly solutions: readonly string[];
};

type IndustriesTabsProps = {
  industries: readonly IndustryTab[];
};

const industryIcons = {
  defense: ShieldCheck,
  government: Landmark,
  healthcare: HeartPulse,
  telecom: RadioTower,
  enterprise: Building2,
  education: GraduationCap,
} as const;

export function IndustriesTabs({ industries }: IndustriesTabsProps) {
  const [activeId, setActiveId] = useState(industries[0]?.id ?? "");
  const active = industries.find((industry) => industry.id === activeId) ?? industries[0];

  if (!active) {
    return null;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
      <div role="tablist" aria-label="Industry sectors" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {industries.map((industry) => {
          const Icon =
            industryIcons[industry.id as keyof typeof industryIcons] ?? Building2;
          const selected = industry.id === active.id;

          return (
            <button
              key={industry.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="industry-panel"
              className={`flex items-center gap-4 rounded-xl border px-5 py-4 text-left transition ${
                selected
                  ? "border-blue-400/30 bg-blue-500/10 text-white"
                  : "border-transparent bg-white/[0.025] text-slate-500 hover:border-white/10 hover:text-slate-200"
              }`}
              onClick={() => setActiveId(industry.id)}
            >
              <Icon
                aria-hidden="true"
                size={20}
                className={selected ? "text-cyan-300" : "text-slate-600"}
              />
              <span className="font-semibold">{industry.title}</span>
            </button>
          );
        })}
      </div>

      <article
        id="industry-panel"
        role="tabpanel"
        className="relative min-h-[440px] overflow-hidden rounded-2xl border border-white/[0.08]"
      >
        <Image
          key={active.image}
          src={active.image}
          alt={`Technology solution for ${active.title}`}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050b18] via-[#050b18]/80 to-[#050b18]/15" />
        <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
            Sector expertise
          </p>
          <h3 className="mt-3 text-3xl font-bold text-white">{active.title}</h3>
          <p className="mt-3 max-w-xl leading-7 text-slate-300/80">{active.description}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {active.solutions.map((solution) => (
              <li
                key={solution}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-slate-200 backdrop-blur"
              >
                <CheckCircle2 aria-hidden="true" size={13} className="text-blue-400" />
                {solution}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  );
}
