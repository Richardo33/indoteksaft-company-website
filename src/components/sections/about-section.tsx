import { ArrowRight } from "lucide-react";

import { differentiators } from "@/config/company";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

export function AboutSection() {
  return (
    <section id="company" aria-labelledby="about-title" className="section-shell">
      <Container className="grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <SectionHeading
            eyebrow="Why Indoteksaft"
            title="Built around responsibility, not just delivery."
            description="Kami melihat teknologi sebagai sistem hidup. Karena itu desain, implementasi, keamanan, operasi, dan peningkatan berkelanjutan harus dipikirkan bersama sejak hari pertama."
          />
          <a
            href="#contact"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300"
          >
            Meet our team
            <ArrowRight aria-hidden="true" size={16} />
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {differentiators.map((item, index) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="min-h-64 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-7"
              >
                <div className="flex items-center justify-between">
                  <div className="grid size-11 place-items-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-cyan-300">
                    <Icon aria-hidden="true" size={21} />
                  </div>
                  <span className="text-xs font-bold text-slate-700">0{index + 1}</span>
                </div>
                <h3 className="mt-9 text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-4 leading-7 text-slate-400">{item.description}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
