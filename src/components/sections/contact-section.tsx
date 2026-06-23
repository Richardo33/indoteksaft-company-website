import { Clock3, Mail, MapPin, ShieldCheck } from "lucide-react";

import { company } from "@/config/company";
import { Container } from "@/components/shared/container";
import { ContactFormLoader } from "@/components/sections/contact-form-loader";

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="section-shell relative overflow-hidden bg-[#07101f]">
      <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />
      <Container className="relative grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
            Start a conversation
          </span>
          <h2
            id="contact-title"
            className="mt-4 text-balance text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl"
          >
            Let&apos;s engineer what comes next.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
            Ceritakan tantangan Anda. Tim kami akan membantu memetakan langkah awal
            yang realistis, aman, dan dapat diukur.
          </p>

          <div className="mt-10 space-y-5">
            <ContactDetail icon={Mail} label="Email" value={company.email} />
            <ContactDetail icon={MapPin} label="Location" value={company.address} />
            <ContactDetail icon={Clock3} label="Response target" value="1 business day" />
            <ContactDetail icon={ShieldCheck} label="Privacy" value="Data used only to respond" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.09] bg-[#050b18]/75 p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8">
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
      <div className="grid size-10 place-items-center rounded-lg border border-blue-400/15 bg-blue-500/[0.07] text-cyan-300">
        <Icon aria-hidden="true" size={18} />
      </div>
      <div>
        <span className="block text-xs uppercase tracking-[0.15em] text-slate-600">{label}</span>
        <span className="mt-1 block text-sm font-medium text-slate-300">{value}</span>
      </div>
    </div>
  );
}
