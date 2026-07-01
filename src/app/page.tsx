import { ContactSection } from "@/components/sections/contact-section";
import { EnterpriseSoftwareSection } from "@/components/sections/enterprise-software-section";
import { HeroSection } from "@/components/sections/hero-section";
import { IndustrySummarySection } from "@/components/sections/industry-summary-section";
import { IndustriesSection } from "@/components/sections/industries-section";
import { InsightsSection } from "@/components/sections/insight-section";
import { MetricsSection } from "@/components/sections/metrics-section";
import { ProductsSection } from "@/components/sections/products-section";
import { Reveal } from "@/components/shared/reveal";
import {
  getHomeArticlePages,
  getHomeHero,
  getHomeProductPages,
} from "@/sanity/home";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [hero, productPages, articlePagesData] = await Promise.all([
    getHomeHero(),
    getHomeProductPages(),
    getHomeArticlePages(),
  ]);

  return (
    <main>
      <HeroSection content={hero} />
      <Reveal>
        <MetricsSection />
      </Reveal>
      <Reveal>
        <IndustrySummarySection />
      </Reveal>
      <Reveal>
        <ProductsSection />
      </Reveal>
      <Reveal>
        <EnterpriseSoftwareSection productPages={productPages} />
      </Reveal>
      <Reveal>
        <InsightsSection articlePagesData={articlePagesData} />
      </Reveal>
      <Reveal>
        <IndustriesSection />
      </Reveal>
      <Reveal>
        <ContactSection />
      </Reveal>
    </main>
  );
}
