import {
  ClipboardCheck,
  Download,
  FileText,
  Mail,
  MapPin,
} from "lucide-react";

import { company } from "@/config/company";
import { Container } from "@/components/shared/container";
import { ContactFormLoader } from "@/components/sections/contact-form-loader";

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="bg-white pb-0 pt-16 text-slate-950 sm:pt-20 lg:pt-24"
    >
      <Container>
        <div className="grid gap-14 border-b border-slate-200 pb-12 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Get started
            </span>
            <h2
              id="contact-title"
              className="mt-5 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl"
            >
              Free Consultation
            </h2>
            <p className="mt-5 max-w-md text-base leading-8 text-slate-500 sm:text-lg">
              Schedule a consultation with our technology architects to discuss
              your infrastructure needs and digital transformation roadmap.
            </p>

            <div className="mt-9 space-y-5">
              <ContactDetail icon={Mail} label="Email" value={company.email} />
              <ContactDetail icon={MapPin} label="Location" value={company.address} />
              <ActionDetail
                icon={FileText}
                label="Download Company Profile"
                value="Full capabilities overview (PDF)"
                href="#"
              />
              <ActionDetail
                icon={ClipboardCheck}
                label="Request Assessment"
                value="Get a comprehensive infrastructure audit"
                href="#contact"
              />
            </div>
          </div>

          <ContactFormLoader />
        </div>
      </Container>
    </section>
  );
}

type ContactDetailProps = {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  label: string;
  value: string;
};

function ContactDetail({ icon: Icon, label, value }: ContactDetailProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="grid size-11 place-items-center bg-cyan-50 text-blue-600">
        <Icon aria-hidden="true" size={19} />
      </div>
      <div>
        <span className="block text-sm font-bold text-blue-600">{label}</span>
        <span className="mt-1 block text-sm text-slate-500">{value}</span>
      </div>
    </div>
  );
}

type ActionDetailProps = ContactDetailProps & {
  href: string;
};

function ActionDetail({ icon: Icon, label, value, href }: ActionDetailProps) {
  return (
    <a href={href} className="group flex items-center gap-4">
      <div className="grid size-11 place-items-center bg-cyan-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
        <Icon aria-hidden="true" size={19} />
      </div>
      <div>
        <span className="block text-sm font-bold text-blue-600">{label}</span>
        <span className="mt-1 block text-sm text-slate-500">{value}</span>
      </div>
      {label.startsWith("Download") && (
        <Download aria-hidden="true" className="sr-only" size={16} />
      )}
    </a>
  );
}
