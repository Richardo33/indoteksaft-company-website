import { company } from "@/config/company";
import { BrandMark } from "@/components/shared/brand-mark";
import { Container } from "@/components/shared/container";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-slate-700">
      <Container className="pb-14 pt-0 sm:pb-16 lg:pb-20">
        <div className="pt-12">
          <div className="grid gap-12 lg:grid-cols-[1.35fr_2fr]">
            <div>
              <BrandMark className="text-slate-950" />

              <div className="mt-8 space-y-4 text-sm leading-7">
                <p className="font-bold text-slate-950">{company.legalName}</p>
                <address className="not-italic text-slate-500">
                  {company.footerAddress.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <p className="pt-4 text-slate-500">
                  Empowering Digital Transformation.
                  <br />
                  Make it Happen, Make it Matter.
                </p>
              </div>
            </div>

            <nav
              aria-label="Footer navigation"
              className="grid gap-10 sm:grid-cols-3"
            >
              {company.footerLinks.map((group) => (
                <div key={group.title}>
                  <h2 className="text-sm font-bold uppercase text-slate-950">
                    {group.title}
                  </h2>
                  <ul className="mt-5 space-y-4">
                    {group.links
                      .filter((link) => link.href !== "#")
                      .map((link) => (
                        <li key={`${group.title}-${link.label}`}>
                          <a
                            href={link.href}
                            className="text-sm text-slate-500 transition hover:text-blue-600"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div className="mt-14 grid border border-slate-200 text-sm text-slate-400 md:grid-cols-[1fr_auto_auto]">
            <p className="flex min-h-16 items-center px-7">
              &copy; 2018-{currentYear} {company.legalName}. All rights reserved.
            </p>

            {company.socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-16 items-center gap-3 border-t border-slate-200 px-7 transition hover:bg-slate-50 hover:text-blue-600 md:border-l md:border-t-0"
              >
                {social.label === "Linkedin" ? (
                  <LinkedinIcon />
                ) : (
                  <InstagramIcon />
                )}
                <span>{social.label}</span>
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

function LinkedinIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 11v6" />
      <path d="M8 8v.01" />
      <path d="M12 17v-6" />
      <path d="M16 17v-3.4a2.6 2.6 0 0 0-5.2 0" />
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.2" />
      <path d="M16.8 7.2h.01" />
    </svg>
  );
}
