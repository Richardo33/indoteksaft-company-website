import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { LanguageProvider } from "@/components/i18n/language-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SanityVisualEditing } from "@/components/shared/sanity-visual-editing";
import { company } from "@/config/company";
import { env } from "@/lib/server/env";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_URL),
  title: {
    default: `${company.brandName} | Enterprise Technology Solutions`,
    template: `%s | ${company.brandName}`,
  },
  description: company.description,
  applicationName: `${company.brandName} Corporate Website`,
  keywords: [
    "Indoteksaft",
    "PT Indotek Buana Karya",
    "cybersecurity Indonesia",
    "data center Indonesia",
    "sovereign cloud",
    "digital transformation",
    "enterprise technology",
  ],
  authors: [{ name: company.legalName, url: company.website }],
  creator: company.legalName,
  publisher: company.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: company.brandName,
    title: `${company.brandName} | Enterprise Technology Solutions`,
    description: company.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${company.brandName} | Enterprise Technology Solutions`,
    description: company.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.legalName,
    alternateName: company.brandName,
    url: env.SITE_URL,
    email: company.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: company.address,
      addressCountry: "ID",
    },
  }).replace(/</g, "\\u003c");

  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full bg-[#050b18] text-slate-100"
      >
        <a
          href="#main-content"
          className="sr-only z-100 rounded bg-white px-4 py-2 text-slate-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Lewati ke konten utama
        </a>
        <LanguageProvider>
          <SiteHeader />
          <div id="main-content">{children}</div>
          <SiteFooter />
        </LanguageProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationSchema }}
        />
        <SanityVisualEditing />
      </body>
    </html>
  );
}
