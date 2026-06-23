import { ArrowUpRight, Check } from "lucide-react";

import { company } from "@/config/company";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

export function SolutionsSection() {
  return (
    <section id="solutions" aria-labelledby="solutions-title" className="section-shell">
      <Container>
        <SectionHeading
          eyebrow="Core capabilities"
          title="Technology ecosystems built for what cannot fail."
          description="Setiap solusi dirancang sebagai bagian dari arsitektur yang utuh: aman, observable, scalable, dan siap dioperasikan dalam jangka panjang."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {company.solutions.map((solution, index) => {
            const Icon = solution.icon;

            return (
              <article
                key={solution.id}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-blue-500/[0.045] sm:p-8"
              >
                <div className="absolute right-6 top-4 text-6xl font-black text-white/[0.025]">
                  0{index + 1}
                </div>
                <div className="mb-7 grid size-12 place-items-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-cyan-300">
                  <Icon aria-hidden="true" size={23} />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                  {solution.tagline}
                </p>
                <h3 className="mt-3 text-2xl font-bold text-white">{solution.title}</h3>
                <p className="mt-4 max-w-xl leading-7 text-slate-400">
                  {solution.description}
                </p>
                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {solution.capabilities.map((capability) => (
                    <li key={capability} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check aria-hidden="true" className="text-cyan-400" size={15} />
                      {capability}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition group-hover:gap-3"
                  aria-label={`Diskusikan solusi ${solution.title}`}
                >
                  Discuss this capability
                  <ArrowUpRight aria-hidden="true" size={16} />
                </a>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
