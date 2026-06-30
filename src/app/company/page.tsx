import type { Metadata } from "next";
import Image from "next/image";
import { RadioTower } from "lucide-react";

import { ContactSection } from "@/components/sections/contact-section";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";

export const metadata: Metadata = {
  title: "Company",
  description:
    "About Indoteksaft, our vision, mission, and core values as an information technology solutions company.",
  alternates: {
    canonical: "/company",
  },
};

const visionMission = [
  {
    label: "Our Vision",
    title:
      "To become a leading technology company in Indonesia delivering excellent, innovative, and impactful digital solutions for business and society.",
  },
  {
    label: "Our Mission",
    title:
      "To provide IT solutions that improve our clients' efficiency, profitability, and competitiveness through high-quality services powered by AI, IoT, and sustainable digital innovation.",
  },
] as const;

const coreValues = [
  {
    title: "Solution",
    description:
      "Simplifying problems by providing the right solutions to customers.",
  },
  {
    title: "Integrity",
    description:
      "Committed to providing maximum service to customers so as to maintain long-term cooperative relationships.",
  },
  {
    title: "Professionalism",
    description:
      "Developing competent human resources with the ability to face challenges and bring success to the company.",
  },
  {
    title: "Improvement",
    description:
      "Conducting continuous improvements that drive the company's business development.",
  },
] as const;

const leaders = [
  {
    name: "Alfi Muhammad",
    role: "CEO & Co-Founder",
    image: "/images/Pak-Alfi.svg",
  },
  {
    name: "Mochamad Syadam",
    role: "Director & Co-Founder",
    image: "/images/Pak-Syadam.svg",
  },
] as const;

export default function CompanyPage() {
  return (
    <main className="bg-white text-slate-950">
      <section className="pt-18">
        <div className="relative overflow-hidden bg-slate-950">
          <div className="relative min-h-[320px] overflow-hidden sm:min-h-[380px] lg:min-h-[420px]">
            <Image
              src="/images/hero-bg.png"
              alt="Modern digital city skyline representing Indoteksaft"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />

            <Container className="relative z-10">
              <Reveal className="flex min-h-[320px] max-w-xl flex-col justify-center py-12 text-white sm:min-h-[380px] lg:min-h-[420px]">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-500">
                  About Indoteksaft
                </p>
                <h1 className="mt-4 text-4xl font-light leading-tight tracking-[-0.05em] sm:text-5xl">
                  Make it <span className="font-extrabold">Happen.</span>
                  <br />
                  Make it <span className="font-extrabold">Matter.</span>
                </h1>
                <div
                  aria-hidden="true"
                  className="mt-8 h-0.5 w-14 rounded-full bg-blue-500"
                />
                <p className="mt-7 max-w-md text-base leading-8 text-slate-200">
                  We turn ideas into impactful digital solutions that drive real
                  change for businesses and society.
                </p>
              </Reveal>
            </Container>
          </div>
        </div>

        <Container className="py-14 sm:py-16 lg:py-20">
          <Reveal className="relative overflow-hidden px-4 py-14 text-center sm:px-8 lg:px-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-[84px] hidden h-28 w-[21%] rounded-tl-2xl border-l border-t border-blue-500/80 sm:block lg:left-0"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-[84px] hidden h-28 w-[21%] rounded-tr-2xl border-r border-t border-blue-500/80 sm:block lg:right-0"
            />
            <div
              aria-hidden="true"
              className="absolute left-[24%] top-[81px] hidden size-2 rounded-full bg-blue-600 shadow-[0_0_14px_rgba(37,99,235,0.75)] sm:block"
            />
            <div
              aria-hidden="true"
              className="absolute right-[24%] top-[81px] hidden size-2 rounded-full bg-blue-600 shadow-[0_0_14px_rgba(37,99,235,0.75)] sm:block"
            />

            <div className="relative mx-auto max-w-5xl bg-white px-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                About Indoteksaft
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
                Make it{" "}
                <span className="font-extrabold text-blue-600">Happen.</span>{" "}
                Make it{" "}
                <span className="font-extrabold text-blue-600">Matter.</span>
              </h2>
              <div
                aria-hidden="true"
                className="mx-auto mt-3 h-0.5 w-8 rounded-full bg-blue-500"
              />

              <div className="mx-auto mt-8 max-w-3xl space-y-5 text-sm leading-7 text-slate-700 sm:text-base">
                <p>
                  PT Indotek Buana Karya (Indoteksaft) is an information
                  technology solutions company committed to providing
                  professional, reliable, and customer-oriented services.
                </p>
                <p>
                  Since our founding in 2018, we have been a strategic partner
                  for the government, state-owned enterprises, and the private
                  sector in realizing digital transformation and building a
                  smarter future.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal as="section" className="mt-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Vision &amp; Mission
            </p>
            <div className="mt-6 grid border border-slate-200 md:grid-cols-2">
              {visionMission.map((item) => (
                <article
                  key={item.label}
                  className="border-b border-slate-200 p-7 md:border-b-0 md:border-r md:last:border-r-0"
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-blue-600">
                    <RadioTower aria-hidden="true" size={14} />
                    {item.label}
                  </div>
                  <p className="mt-6 text-sm leading-7 text-slate-600">
                    {item.title}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>

          <Reveal as="section" className="mt-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Our Core Values
            </p>
            <div className="mt-6 grid border border-slate-200 sm:grid-cols-2 lg:grid-cols-4">
              {coreValues.map((value) => (
                <article
                  key={value.title}
                  className="min-h-48 border-b border-slate-200 p-7 sm:border-r lg:border-b-0 lg:last:border-r-0"
                >
                  <div className="grid size-10 place-items-center bg-cyan-50 text-blue-600">
                    <RadioTower aria-hidden="true" size={16} />
                  </div>
                  <h2 className="mt-6 text-base font-bold text-slate-950">
                    {value.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {value.description}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>

          <Reveal
            as="section"
            className="mt-20 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                Leadership
              </p>
              <h2 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                Executive Leadership
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-slate-500">
                Meet the leaders driving innovation, digital transformation, and
                technological excellence at Indoteksaft.
              </p>
            </div>

            <div className="grid gap-6">
              {leaders.map((leader, index) => (
                <article
                  key={leader.name}
                  className={`grid max-w-md grid-cols-[140px_1fr] border border-slate-200 bg-white ${
                    index === 1 ? "justify-self-end" : "justify-self-start"
                  }`}
                >
                  <div className="relative aspect-square bg-slate-100">
                    <Image
                      src={leader.image}
                      alt={leader.name}
                      fill
                      sizes="140px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-7">
                    <h3 className="text-lg font-bold text-slate-950">
                      {leader.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {leader.role}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <ContactSection />
    </main>
  );
}
