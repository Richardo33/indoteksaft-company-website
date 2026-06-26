import type { Metadata } from "next";
import Image from "next/image";

import { Container } from "@/components/shared/container";

export const metadata: Metadata = {
  title: "Client",
  description: "Client stories and organization references.",
  alternates: {
    canonical: "/resources/client",
  },
};

const clientLogos = Array.from({ length: 98 }, (_, index) => ({
  id: index + 1,
  src: `/client-ikon/Frame ${index + 1}.png`,
}));

export default function ClientResourcePage() {
  return (
    <main className="bg-white text-slate-950">
      <section className="bg-[#0d2f86] pt-18 text-white">
        <Container className="py-14 sm:py-16">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">
            Our Clients
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-cyan-200 sm:text-4xl">
            Building Long-Term Technology Partnerships
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/85">
            We work closely with organizations to design, implement, and
            optimize technology ecosystems that support their strategic
            objectives and digital transformation journey.
          </p>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <Container>
          <div className="grid grid-cols-3 items-center gap-x-7 gap-y-6 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10">
            {clientLogos.map((logo) => (
              <div
                key={logo.id}
                className="relative mx-auto aspect-[3/2] w-full max-w-[92px]"
              >
                <Image
                  src={logo.src}
                  alt={`Client logo ${logo.id}`}
                  fill
                  sizes="92px"
                  className="object-contain"
                />
              </div>
            ))}
          </div>

          <div className="mt-16 h-px bg-slate-200" />
        </Container>
      </section>
    </main>
  );
}
