import Image from "next/image";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

import { company } from "@/config/company";
import { Container } from "@/components/shared/container";

export function HeroSection() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate min-h-[760px] overflow-hidden pt-18"
    >
      <Image
        src="/images/hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-30 object-cover object-center opacity-30"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#050b18_5%,rgba(5,11,24,.96)_38%,rgba(5,11,24,.72)_70%,#050b18_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_38%,rgba(0,102,255,.22),transparent_30%)]" />
      <div className="tech-grid absolute inset-0 -z-10 opacity-40" />

      <Container className="grid min-h-[690px] items-center gap-14 py-24 lg:grid-cols-[1.1fr_.9fr]">
        <div className="min-w-0">
          <div className="mb-7 inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-3 py-2 sm:px-4">
            <ShieldCheck aria-hidden="true" className="text-cyan-300" size={15} />
            <span className="truncate text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200 sm:text-xs sm:tracking-[0.22em]">
              Indonesia&apos;s critical tech partner
            </span>
          </div>

          <h1
            id="hero-title"
            className="max-w-4xl text-balance text-[2.65rem] font-bold leading-[1.04] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl"
          >
            Engineering the{" "}
            <span className="bg-gradient-to-r from-blue-500 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              sovereign digital core
            </span>{" "}
            of tomorrow.
          </h1>

          <p className="mt-7 max-w-2xl text-pretty text-base leading-8 text-slate-300/70 sm:text-lg">
            {company.legalName} merancang ekosistem teknologi end-to-end—dari
            data center dan cyber defense hingga cloud serta AI-driven
            operations.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-xl shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-500"
            >
              Start a Conversation
              <ArrowRight aria-hidden="true" size={17} />
            </a>
            <a
              href="#solutions"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-cyan-300/[0.06]"
            >
              Explore Capabilities
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
            {["Security-first", "Enterprise-grade", "24/7 operations"].map(
              (item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 aria-hidden="true" className="text-cyan-400" size={16} />
                  {item}
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="relative mx-auto hidden aspect-square w-full max-w-[480px] lg:block">
          <div className="absolute inset-[12%] rounded-full border border-blue-400/20" />
          <div className="absolute inset-[22%] rounded-full border border-cyan-300/20" />
          <div className="absolute inset-[32%] rounded-full border border-blue-400/25 bg-blue-500/[0.08] shadow-[0_0_80px_rgba(0,102,255,.22)]" />
          <div className="absolute inset-[41%] grid place-items-center rounded-3xl border border-cyan-300/35 bg-[#07152e]/90 text-center shadow-2xl shadow-blue-600/25">
            <div>
              <span className="block text-2xl font-bold text-white">{company.shortName}</span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.24em] text-cyan-300">
                Digital Core
              </span>
            </div>
          </div>
          {["Cyber", "Cloud", "Data", "Network"].map((label, index) => (
            <div
              key={label}
              className="orbit-label absolute rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-xs font-medium text-slate-300 backdrop-blur"
              data-position={index}
            >
              {label}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
