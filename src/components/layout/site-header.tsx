import { Globe2 } from "lucide-react";
import Link from "next/link";

import { company } from "@/config/company";
import { Container } from "@/components/shared/container";
import { BrandMark } from "@/components/shared/brand-mark";
import { DesktopNavigation } from "@/components/layout/desktop-navigation";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#050b18]/80 backdrop-blur-xl">
      <Container className="flex h-18 items-center justify-between">
        <Link href="/" aria-label={`${company.brandName} home`}>
          <BrandMark />
        </Link>

        <DesktopNavigation items={company.navItems} />

        <div className="hidden items-center gap-5 lg:flex">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase text-slate-300">
            <Globe2 aria-hidden="true" size={14} />
            English
          </span>
          <Link
            href="/contact"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold uppercase text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
          >
            Contact Sales
          </Link>
        </div>

        <MobileNavigation items={company.navItems} />
      </Container>
    </header>
  );
}
