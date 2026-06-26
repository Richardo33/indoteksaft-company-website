export type IndustryCard = {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly icon:
    | "government"
    | "manufacturing"
    | "education"
    | "healthcare"
    | "telecommunication"
    | "enterprise"
    | "banking"
    | "agriculture";
};

export const industryCards = [
  {
    slug: "government-bumn",
    title: "Government & BUMN",
    icon: "government",
    description:
      "Drive secure, transparent, and efficient digital public services to streamline public sector operations and governance.",
  },
  {
    slug: "manufacturing",
    title: "Manufacturing",
    icon: "manufacturing",
    description:
      "Optimize production lines with smart automation and integrated systems to increase factory output and reduce overhead.",
  },
  {
    slug: "education",
    title: "Education",
    icon: "education",
    description:
      "Empower learning environments with reliable digital platforms that enhance collaboration and expand educational access.",
  },
  {
    slug: "healthcare",
    title: "Healthcare",
    icon: "healthcare",
    description:
      "Streamline clinical workflows and secure sensitive patient data with interconnected, high-performance medical software solutions.",
  },
  {
    slug: "telecommunication",
    title: "Telecommunication",
    icon: "telecommunication",
    description:
      "Deliver robust network infrastructure and engineering solutions to support high-speed connectivity and expand carrier coverage.",
  },
  {
    slug: "enterprise",
    title: "Enterprise",
    icon: "enterprise",
    description:
      "Accelerate large-scale corporate growth through custom IT ecosystems engineered for high scalability and market agility.",
  },
  {
    slug: "banking-financial-services",
    title: "Banking & Financial Services",
    icon: "banking",
    description:
      "Deploy high-security fintech infrastructure capable of handling volume-driven financial transactions with zero downtime.",
  },
  {
    slug: "agriculture",
    title: "Agriculture",
    icon: "agriculture",
    description:
      "Leverage smart tech integration to monitor crop environments, boost farming yields, and optimize supply chains.",
  },
] as const satisfies readonly IndustryCard[];
