import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { IndustriesSection } from "@/components/sections/industries-section";
import { MetricsSection } from "@/components/sections/metrics-section";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { ProductsSection } from "@/components/sections/products-section";
import { SolutionsSection } from "@/components/sections/solutions-section";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <MetricsSection />
      <SolutionsSection />
      <IndustriesSection />
      <ProductsSection />
      <PortfolioSection />
      <AboutSection />
      <ContactSection />
    </main>
  );
}
