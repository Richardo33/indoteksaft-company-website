import { company } from "@/config/company";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { IndustriesTabs } from "@/components/sections/industries-tabs";

export function IndustriesSection() {
  const serializableIndustries = company.industries.map((industry) => ({
    id: industry.id,
    title: industry.title,
    description: industry.description,
    image: industry.image,
    solutions: industry.solutions,
  }));

  return (
    <section id="industries" aria-labelledby="industries-title" className="section-shell bg-[#07101f]/55">
      <Container>
        <SectionHeading
          eyebrow="Industry expertise"
          title="Deep context for Indonesia’s most critical sectors."
          description="Teknologi yang baik tidak berdiri sendiri. Kami memadukan keahlian teknis dengan pemahaman risiko, regulasi, dan ritme operasional setiap industri."
        />
        <div className="mt-14">
          <IndustriesTabs industries={serializableIndustries} />
        </div>
      </Container>
    </section>
  );
}
