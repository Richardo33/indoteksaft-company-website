import Link from "next/link";

import { company } from "@/config/company";
import { Container } from "@/components/shared/container";
import { BrandMark } from "@/components/shared/brand-mark";
import { DesktopNavigation } from "@/components/layout/desktop-navigation";
import { LanguageSelector } from "@/components/i18n/language-selector";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import {
  getHeaderNavigation,
  getResourcesNavigation,
} from "@/sanity/navigation";

export async function SiteHeader() {
  const [navItems, resourceItems] = await Promise.all([
    getHeaderNavigation(),
    getResourcesNavigation(),
  ]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#050b18]/80 backdrop-blur-xl">
      <Container className="flex h-18 items-center justify-between">
        <Link href="/" aria-label={`${company.brandName} home`}>
          <BrandMark />
        </Link>

        <DesktopNavigation items={navItems} resourceItems={resourceItems} />

        <div className="hidden items-center gap-5 lg:flex">
          <LanguageSelector />
          <Link
            href="/contact"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold uppercase text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
          >
            Contact Sales
          </Link>
        </div>

        <MobileNavigation items={navItems} resourceItems={resourceItems} />
      </Container>
    </header>
  );
}
