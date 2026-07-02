import { ContactSection } from "@/components/sections/contact-section";
import { EnterpriseSoftwareSection } from "@/components/sections/enterprise-software-section";
import { HeroSection } from "@/components/sections/hero-section";
import { IndustrySummarySection } from "@/components/sections/industry-summary-section";
// import { IndustriesSection } from "@/components/sections/industries-section";
import { InsightsSection } from "@/components/sections/insight-section";
import { MetricsSection } from "@/components/sections/metrics-section";
import { ProductsSection } from "@/components/sections/products-section";
import { Reveal } from "@/components/shared/reveal";
import {
  getHomeContactSection,
  getHomeArticlePages,
  getHomeHero,
  getHomeProductPages,
} from "@/sanity/home";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [hero, productPages, articlePagesData, contactSection] =
    await Promise.all([
      getHomeHero(),
      getHomeProductPages(),
      getHomeArticlePages(),
      getHomeContactSection(),
    ]);

  return (
    <main>
      <HeroSection content={hero} />
      <Reveal preserveBackground className="bg-[#0d2f86]">
        <MetricsSection />
      </Reveal>
      <Reveal preserveBackground className="bg-white">
        <IndustrySummarySection />
      </Reveal>
      <Reveal preserveBackground className="bg-white">
        <ProductsSection />
      </Reveal>
      <Reveal preserveBackground className="bg-[#0d2f86]">
        <EnterpriseSoftwareSection productPages={productPages} />
      </Reveal>
      <Reveal preserveBackground className="bg-slate-50">
        <InsightsSection articlePagesData={articlePagesData} />
      </Reveal>
      {/* <Reveal>
        <IndustriesSection />
      </Reveal> */}
      <Reveal preserveBackground className="bg-white">
        <ContactSection content={contactSection} />
      </Reveal>
    </main>
  );
}
