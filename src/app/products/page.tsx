import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/shared/container";
import { LaptopMockup } from "@/components/sections/enterprise-software-section";
import { ContactSection } from "@/components/sections/contact-section";
import { InsightsSection } from "@/components/sections/insight-section";
import { productCatalog } from "@/config/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Enterprise software products by Indoteksaft for infrastructure, monitoring, security, operations, and digital transformation.",
  alternates: {
    canonical: "/products",
  },
};

export default function ProductsPage() {
  return (
    <main className="bg-white text-slate-950">
      <section
        aria-labelledby="products-page-title"
        className="relative isolate overflow-hidden bg-[#06164b] pt-18 text-white"
      >
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
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">
              Product
            </span>
            <h1
              id="products-page-title"
              className="mt-6 text-3xl font-bold tracking-[-0.04em] text-cyan-200 sm:text-4xl"
            >
              Enterprise Software Solutions
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/85">
              Scalable software products engineered to help organizations
              innovate faster, improve efficiency, and stay ahead in a
              digital-first world.
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

      <section aria-label="Product catalog" className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-x-14 gap-y-20 sm:grid-cols-2 lg:grid-cols-4">
            {productCatalog.map((product) => (
              <article
                key={product.name}
                className="flex h-full flex-col items-center text-center"
              >
                <LaptopMockup
                  theme={product.theme}
                  surfaceClassName="bg-white"
                  fadeClassName="via-white/70 to-white"
                />
                <h2 className="mt-6 line-clamp-2 min-h-12 max-w-72 text-sm font-bold leading-6 text-slate-950">
                  {product.name}
                </h2>
                <Link
                  href={`/products/${product.slug}`}
                  className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 border border-blue-600 px-7 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                  aria-label={`Detail product ${product.name}`}
                >
                  Detail Product
                  <ArrowUpRight aria-hidden="true" size={15} />
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <InsightsSection />
      <ContactSection />
    </main>
  );
}
