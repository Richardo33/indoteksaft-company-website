import Image from "next/image";
import { ArrowRight, Check, Code2, RadioTower, ServerCog } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";

const technologySolutions = [
  {
    title: "IT Infrastructure Solutions",
    description:
      "Comprehensive infrastructure solutions designed to optimize performance, strengthen security, and support the evolving needs of modern enterprises.",
    image: "/images/industry-defense.png",
    icon: ServerCog,
    href: "/solutions#infrastructure",
    features: [
      "Secure & Reliable Infrastructure",
      "High Availability & Scalability",
      "24/7 Monitoring & Support",
    ],
  },
  {
    title: "Tech Delivery Solutions",
    description:
      "Comprehensive technology delivery services that transform business requirements into secure, scalable, and future-ready digital solutions.",
    image: "/images/industry-enterprise.png",
    icon: Code2,
    href: "/solutions#delivery",
    features: [
      "Custom Development",
      "Scalable Architecture",
      "End-to-End Delivery",
    ],
  },
  {
    title: "Telecommunication Solutions",
    description:
      "Comprehensive telecommunications services to support network development, infrastructure maintenance, and reliable connectivity.",
    image: "/images/industry-telecom.png",
    icon: RadioTower,
    href: "/solutions#telecommunication",
    features: [
      "BTS Installation & Upgrade",
      "Site Maintenance",
      "Civil, Mechanical & Electrical (CME)",
    ],
  },
] as const;

export function ProductsSection() {
  return (
    <section
      id="products"
      aria-labelledby="products-title"
      className="bg-white py-8 text-slate-950 sm:py-10 lg:py-12"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            What we do
          </span>
          <h2
            id="products-title"
            className="mt-5 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl"
          >
            End-to-End Technology Solutions
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-500 sm:text-lg">
            From building resilient digital infrastructure to delivering
            intelligent technology solutions, our core capabilities empower
            every stage of your digital transformation.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {technologySolutions.map((solution, index) => {
            const Icon = solution.icon;
            const featureSlots = Array.from(
              { length: 3 },
              (_, index) => solution.features[index] ?? null,
            );

            return (
              <Reveal
                key={solution.title}
                delay={index * 100}
                className="group flex h-full flex-col"
              >
                <div className="relative aspect-video overflow-hidden bg-cyan-50">
                  <Image
                    src={solution.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 30vw"
                    className="object-cover object-center transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-cyan-50/35 mix-blend-screen" />
                  <div className="absolute bottom-0 left-0 grid size-12 place-items-center bg-[#0d2f86] text-white sm:size-14">
                    <Icon aria-hidden="true" size={22} />
                  </div>
                </div>

                <h3 className="mt-6 line-clamp-1 min-h-7 text-xl font-bold leading-7 tracking-[-0.03em] text-slate-950">
                  {solution.title}
                </h3>
                <p className="mt-4 line-clamp-3 min-h-21 text-sm leading-7 text-slate-600">
                  {solution.description}
                </p>

                <ul className="mt-5 min-h-21 space-y-3">
                  {featureSlots.map((feature, index) => (
                    <li
                      key={feature ?? `empty-feature-${index}`}
                      className="flex min-h-5 items-start gap-3 text-sm text-slate-500"
                      aria-hidden={!feature ? "true" : undefined}
                    >
                      {feature ? (
                        <>
                          <Check
                            aria-hidden="true"
                            className="mt-1 shrink-0 text-blue-600"
                            size={15}
                          />
                          <span className="line-clamp-1">{feature}</span>
                        </>
                      ) : (
                        <span className="block h-5" />
                      )}
                    </li>
                  ))}
                </ul>

                <a
                  href={solution.href}
                  className="mt-8 inline-flex min-h-11 w-fit items-center justify-center gap-2 border border-blue-600 px-6 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                >
                  Detail Solutions
                  <ArrowRight aria-hidden="true" size={16} />
                </a>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
