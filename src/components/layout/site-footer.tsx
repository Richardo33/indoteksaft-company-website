import { Globe2, Mail, MapPin, Phone } from "lucide-react";

import { company } from "@/config/company";
import { BrandMark } from "@/components/shared/brand-mark";
import { Container } from "@/components/shared/container";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.07] bg-[#030712]">
      <Container className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <BrandMark />
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-500">
            {company.tagline}. Make it happen. Make it matter.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">Explore</h2>
          <nav aria-label="Navigasi footer" className="mt-5 grid grid-cols-2 gap-3">
            {company.navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-slate-500 transition hover:text-cyan-300"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">Connect</h2>
          <address className="mt-5 space-y-3 not-italic">
            <FooterContact icon={Mail} href={`mailto:${company.email}`}>
              {company.email}
            </FooterContact>
            <FooterContact icon={Phone} href={`tel:${company.phone.replace(/\s/g, "")}`}>
              {company.phone}
            </FooterContact>
            <FooterContact icon={MapPin}>{company.address}</FooterContact>
            <FooterContact icon={Globe2} href={company.website}>
              indoteksaft.co.id
            </FooterContact>
          </address>
        </div>
      </Container>

      <div className="border-t border-white/[0.06]">
        <Container className="flex flex-col gap-2 py-6 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} {company.legalName}. All rights reserved.
          </p>
          <p>Secure by design · Built for Indonesia</p>
        </Container>
      </div>
    </footer>
  );
}

type FooterContactProps = {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  href?: string;
  children: React.ReactNode;
};

function FooterContact({ icon: Icon, href, children }: FooterContactProps) {
  const content = (
    <>
      <Icon aria-hidden="true" className="mt-0.5 shrink-0 text-blue-500" size={15} />
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
        className="flex gap-2 text-sm text-slate-500 transition hover:text-cyan-300"
      >
        {content}
      </a>
    );
  }

  return <p className="flex gap-2 text-sm text-slate-500">{content}</p>;
}
