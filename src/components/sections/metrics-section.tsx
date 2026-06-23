import { company } from "@/config/company";
import { Container } from "@/components/shared/container";

export function MetricsSection() {
  return (
    <section aria-label="Company metrics" className="border-y border-white/[0.07] bg-[#07101f]/85">
      <Container className="grid grid-cols-2 divide-x divide-white/[0.07] lg:grid-cols-4">
        {company.metrics.map((metric) => (
          <div key={metric.label} className="px-4 py-8 text-center sm:py-10">
            <strong className="block text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {metric.value}
            </strong>
            <span className="mt-2 block text-xs uppercase tracking-[0.16em] text-slate-500">
              {metric.label}
            </span>
          </div>
        ))}
      </Container>
    </section>
  );
}
