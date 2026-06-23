import { ArrowUpRight } from "lucide-react";

import { company } from "@/config/company";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

export function PortfolioSection() {
  return (
    <section id="portfolio" aria-labelledby="portfolio-title" className="section-shell bg-[#07101f]/55">
      <Container>
        <SectionHeading
          eyebrow="Selected portfolio"
          title="Execution that moves from architecture to measurable outcomes."
          description="Studi kasus di bawah menggunakan data dummy dan disiapkan sebagai content model yang mudah diganti dengan CMS atau API pada fase berikutnya."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {company.portfolio.map((item, index) => (
            <article
              key={item.title}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#050b18] p-7"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-300 to-transparent opacity-60" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                {item.category}
              </span>
              <h3 className="mt-5 text-xl font-bold leading-snug text-white">{item.title}</h3>
              <p className="mt-2 text-sm font-medium text-blue-400">{item.client}</p>
              <p className="mt-5 leading-7 text-slate-400">{item.summary}</p>
              <div className="mt-7 border-t border-white/[0.07] pt-5">
                <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                  Outcome
                </span>
                <p className="mt-2 text-sm font-medium text-slate-200">{item.outcome}</p>
              </div>
              <div className="mt-7 flex items-center justify-between">
                <span className="text-4xl font-black text-white/[0.035]">0{index + 1}</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="text-slate-700 transition group-hover:text-cyan-300"
                  size={20}
                />
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
