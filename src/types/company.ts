import type { LucideIcon } from "lucide-react";

export type NavItem = {
  readonly label: string;
  readonly href: string;
};

export type FooterLinkGroup = {
  readonly title: string;
  readonly links: readonly {
    readonly label: string;
    readonly href: string;
  }[];
};

export type SocialLink = {
  readonly label: string;
  readonly href: string;
};

export type Metric = {
  readonly value: string;
  readonly label: string;
};

export type Solution = {
  readonly id: string;
  readonly title: string;
  readonly tagline: string;
  readonly description: string;
  readonly capabilities: readonly string[];
  readonly icon: LucideIcon;
};

export type Industry = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly solutions: readonly string[];
  readonly icon: LucideIcon;
};

export type Product = {
  readonly name: string;
  readonly category: string;
  readonly description: string;
  readonly features: readonly string[];
  readonly status: "Enterprise Ready" | "Managed Platform";
  readonly icon: LucideIcon;
};

export type PortfolioItem = {
  readonly category: string;
  readonly title: string;
  readonly client: string;
  readonly summary: string;
  readonly outcome: string;
};

export type CompanyConfig = {
  readonly legalName: string;
  readonly brandName: string;
  readonly shortName: string;
  readonly tagline: string;
  readonly description: string;
  readonly website: string;
  readonly email: string;
  readonly phone: string;
  readonly address: string;
  readonly footerAddress: readonly string[];
  readonly establishedYear: number;
  readonly navItems: readonly NavItem[];
  readonly footerLinks: readonly FooterLinkGroup[];
  readonly socialLinks: readonly SocialLink[];
  readonly metrics: readonly Metric[];
  readonly solutions: readonly Solution[];
  readonly industries: readonly Industry[];
  readonly products: readonly Product[];
  readonly portfolio: readonly PortfolioItem[];
};
