import { ArrowRight, Check } from "lucide-react";

import { company } from "@/config/company";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

export function ProductsSection() {
  return (
    <section id="products" aria-labelledby="products-title" className="section-shell">
      <Container>
        <SectionHeading
          eyebrow="Digital products"
          title="Platforms that turn complex operations into clear control."
          description="Produk dummy berikut menggambarkan arah solusi proprietary yang dapat dikembangkan tanpa mengikat arsitektur website pada backend tertentu."
          align="center"
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {company.products.map((product) => {
            const Icon = product.icon;

            return (
              <article
                key={product.name}
                className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.045] to-transparent p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="grid size-12 place-items-center rounded-xl bg-cyan-300/10 text-cyan-300">
                    <Icon aria-hidden="true" size={23} />
                  </div>
                  <span className="rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    {product.status}
                  </span>
                </div>
                <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                  {product.category}
                </p>
                <h3 className="mt-3 text-2xl font-bold text-white">{product.name}</h3>
                <p className="mt-4 flex-1 leading-7 text-slate-400">{product.description}</p>
                <ul className="mt-6 space-y-3 border-t border-white/[0.07] pt-6">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check aria-hidden="true" size={15} className="text-cyan-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-cyan-300"
                >
                  Request product briefing
                  <ArrowRight aria-hidden="true" size={16} />
                </a>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
