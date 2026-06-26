import { ContactSection } from "@/components/sections/contact-section";
import { EnterpriseSoftwareSection } from "@/components/sections/enterprise-software-section";
import { HeroSection } from "@/components/sections/hero-section";
import { IndustrySummarySection } from "@/components/sections/industry-summary-section";
import { IndustriesSection } from "@/components/sections/industries-section";
import { InsightsSection } from "@/components/sections/insight-section";
import { MetricsSection } from "@/components/sections/metrics-section";
import { ProductsSection } from "@/components/sections/products-section";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <MetricsSection />
      <IndustrySummarySection />
      <ProductsSection />
      <EnterpriseSoftwareSection />
      <InsightsSection />
      <IndustriesSection />
      <ContactSection />
    </main>
  );
}
