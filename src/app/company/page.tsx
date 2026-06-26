import type { Metadata } from "next";
import Image from "next/image";
import { RadioTower } from "lucide-react";

import { ContactSection } from "@/components/sections/contact-section";
import { Container } from "@/components/shared/container";

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
        <Container className="py-14 sm:py-16 lg:py-20">
          <div className="relative">
            <div className="relative aspect-[16/4.3] overflow-hidden bg-slate-100">
              <Image
                src="/images/hero-bg.png"
                alt="Modern business district representing Indoteksaft company"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>

            <div className="grid lg:grid-cols-[1fr_160px]">
              <div className="bg-white">
                <div className="grid items-end px-8 py-8 lg:grid-cols-[1fr_auto_1fr]">
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                      About Indoteksaft
                    </p>
                    <h1 className="text-3xl font-normal tracking-[-0.04em]">
                      Make it <span className="font-bold">Happen</span>
                    </h1>
                  </div>
                  <div className="mb-2 hidden h-px w-72 bg-slate-300 lg:block" />
                  <h2 className="mt-4 text-3xl font-normal tracking-[-0.04em] lg:mt-0">
                    Make it <span className="font-bold">Matter.</span>
                  </h2>
                </div>

                <div className="space-y-5 border border-slate-200 px-8 py-8 text-sm leading-7 text-slate-600">
                  <p>
                    <strong className="font-bold text-slate-700">
                      PT Indotek Buana Karya (Indoteksaft)
                    </strong>{" "}
                    is an information technology solutions company committed to
                    providing professional, reliable, and customer-oriented
                    services.
                  </p>
                  <p>
                    Since our founding in 2018, we have been a strategic partner
                    for the government, state-owned enterprises, and the private
                    sector in realizing digital transformation through
                    efficient, secure, and integrated solutions.
                  </p>
                  <p>
                    With expertise in software development, artificial
                    intelligence (AI), the Internet of Things (IoT),
                    telecommunications, and IT infrastructure, Indoteksaft
                    focuses on providing the latest technology and tailored
                    solutions to help businesses and institutions achieve their
                    goals.
                  </p>
                </div>
              </div>

              <div className="hidden bg-gradient-to-b from-sky-400 to-blue-800 lg:block" />
            </div>
          </div>

          <section className="mt-10">
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
          </section>

          <section className="mt-10">
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
          </section>

          <section className="mt-20 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
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
          </section>
        </Container>
      </section>

      <ContactSection />
    </main>
  );
}
