import { company } from "@/config/company";
import { Container } from "@/components/shared/container";
import { BrandMark } from "@/components/shared/brand-mark";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#050b18]/80 backdrop-blur-xl">
      <Container className="flex h-18 items-center justify-between">
        <a href="#top" aria-label={`${company.brandName} home`}>
          <BrandMark />
        </a>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-7 lg:flex">
          {company.navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-400 transition-colors hover:text-cyan-300"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 lg:inline-flex"
        >
          Schedule Consultation
        </a>

        <MobileNavigation items={company.navItems} />
      </Container>
    </header>
  );
}
