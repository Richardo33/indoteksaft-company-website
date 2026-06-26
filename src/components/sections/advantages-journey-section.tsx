import {
  BadgeCheck,
  Building2,
  Handshake,
  Network,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Container } from "@/components/shared/container";

const advantages = [
  {
    title: "End-to-End Technology Solutions",
    description:
      "Comprehensive technology services covering IT infrastructure, software development, cybersecurity, telecommunications, and managed services.",
    icon: Network,
  },
  {
    title: "Industry Expertise",
    description:
      "Delivering technology solutions tailored to the unique challenges and goals of organizations across diverse industries.",
    icon: Building2,
  },
  {
    title: "Certified Professional Team",
    description:
      "Experienced engineers and technology specialists dedicated to delivering reliable, high-quality solutions.",
    icon: BadgeCheck,
  },
  {
    title: "Scalable & Secure Solutions",
    description:
      "Designing secure, scalable, and future-ready technology to support business continuity and digital growth.",
    icon: ShieldCheck,
  },
  {
    title: "Proven Project Delivery",
    description:
      "A structured delivery approach that ensures projects are completed efficiently, on time, and with measurable results.",
    icon: Sparkles,
  },
  {
    title: "Long-Term Partnership",
    description:
      "Building lasting relationships through responsive support, continuous innovation, and customer-focused services.",
    icon: Handshake,
  },
] as const;

const journeySteps = [
  {
    label: "Assess",
    description:
      "Comprehensive evaluation of existing infrastructure, identifying gaps, risks, and opportunities for digital transformation.",
  },
  {
    label: "Design",
    description:
      "Architecting tailored solutions with enterprise-grade blueprints that align with organizational objectives and industry standards.",
  },
  {
    label: "Build",
    description:
      "Precision execution with rapid deployment methodologies, ensuring zero-downtime migration and quality assurance.",
  },
  {
    label: "Operate",
    description:
      "Continuous monitoring and management through our NOC, ensuring 24/7 availability with proactive incident management.",
  },
  {
    label: "Optimize",
    description:
      "Ongoing performance optimization, capacity planning, and technology evolution to maximize ROI and future-proof infrastructure.",
  },
] as const;

export function AdvantagesJourneySection() {
  return (
    <section className="bg-white py-16 text-slate-950 sm:py-20 lg:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            Our advantages
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
            Building Long-Term Digital Success
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-500">
            We partner with organizations to deliver reliable technology,
            exceptional service, and sustainable innovation that drives
            long-term business growth.
          </p>
        </div>

        <div className="mt-14 grid border border-slate-200 sm:grid-cols-2 lg:grid-cols-3">
          {advantages.map((advantage) => {
            const Icon = advantage.icon;

            return (
              <article
                key={advantage.title}
                className="min-h-40 border-b border-r border-slate-200 p-7 last:border-r-0 lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-last-child(-n+3)]:border-b-0"
              >
                <Icon aria-hidden="true" className="text-blue-600" size={20} />
                <h3 className="mt-5 text-sm font-bold text-slate-950">
                  {advantage.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {advantage.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Framework
            </span>
            <h2 className="mt-5 max-w-sm text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Digital Transformation Journey
            </h2>
            <p className="mt-5 max-w-sm text-base leading-8 text-slate-500">
              Our proven 5-step methodology for enterprise-scale digital
              transformation.
            </p>
          </div>

          <div className="border border-slate-200">
            {journeySteps.map((step, index) => (
              <article
                key={step.label}
                className="grid gap-4 border-b border-slate-200 p-6 last:border-b-0 sm:grid-cols-[4rem_1fr]"
              >
                <span className="text-3xl font-bold text-slate-200">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-950">
                    {step.label}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
