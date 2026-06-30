import { company } from "@/config/company";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";

export function MetricsSection() {
  return (
    <section aria-label="Company metrics" className="bg-[#0d2f86]">
      <Container className="grid grid-cols-2 gap-y-8 py-10 sm:py-12 lg:grid-cols-4">
        {company.metrics.map((metric, index) => (
          <Reveal
            key={metric.label}
            delay={index * 90}
            duration={600}
            className="px-4 text-left"
          >
            <strong className="block text-2xl font-bold tracking-tight text-cyan-200 sm:text-3xl">
              {metric.value}
            </strong>
            <span className="mt-1 block text-sm font-medium text-cyan-50/85">
              {metric.label}
            </span>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
