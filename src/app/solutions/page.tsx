import type { Metadata } from "next";

import { Container } from "@/components/shared/container";
import { ContactSection } from "@/components/sections/contact-section";
import { SolutionsTabs } from "@/components/sections/solutions-tabs";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "End-to-end technology solutions for infrastructure, technology delivery, and telecommunication by Indoteksaft.",
  alternates: {
    canonical: "/solutions",
  },
};

export default function SolutionsPage() {
  return (
    <main className="bg-white text-slate-950">
      <section className="pt-18">
        <Container className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Our Solutions
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              End-to-End Technology Solutions
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-500 sm:text-lg">
              From building resilient digital infrastructure to delivering
              intelligent technology solutions, our core capabilities empower
              every stage of your digital transformation.
            </p>
          </div>

          <SolutionsTabs />
        </Container>
      </section>

      <ContactSection />
    </main>
  );
}
