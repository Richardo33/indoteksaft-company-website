export type SolutionTabId = "infrastructure" | "delivery" | "telecommunication";

export type SolutionCapability = {
  readonly title: string;
  readonly description: string;
};

export type SolutionTab = {
  readonly id: SolutionTabId;
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly capabilities: readonly SolutionCapability[];
};

export const solutionTabs = [
  {
    id: "infrastructure",
    label: "IT Infrastructure",
    title: "IT Infrastructure Solutions",
    description:
      "Comprehensive infrastructure solutions designed to optimize performance, strengthen security, and support the evolving needs of modern enterprises.",
    image: "/images/industry-defense.png",
    capabilities: [
      {
        title: "Public, Private & Hybrid Cloud",
        description:
          "Scalable and secure cloud environments tailored to modernize your IT infrastructure and drive agile business growth.",
      },
      {
        title: "Server Compute Infrastructure",
        description:
          "High-performance and reliable computing solutions designed to power your critical enterprise workloads and business applications.",
      },
      {
        title: "SAN & NAS Storage",
        description:
          "Centralized, high-speed storage architectures ensuring enterprise data is securely stored, backup-ready, and instantly accessible.",
      },
      {
        title: "Network & Security Foundation",
        description:
          "Resilient network architecture with segmentation, secure access, and visibility to support mission-critical digital operations.",
      },
      {
        title: "Data Center Modernization",
        description:
          "Modernize data center environments with scalable architecture, improved availability, and operational efficiency.",
      },
      {
        title: "Backup & Disaster Recovery",
        description:
          "Protect business continuity with robust backup, replication, and recovery strategies for enterprise environments.",
      },
    ],
  },
  {
    id: "delivery",
    label: "Tech Delivery",
    title: "Tech Delivery Solutions",
    description:
      "Comprehensive technology delivery services that transform business requirements into secure, scalable, and future-ready digital solutions.",
    image: "/images/industry-enterprise.png",
    capabilities: [
      {
        title: "Custom Application Development",
        description:
          "Design and build business applications tailored to operational needs, integration requirements, and growth strategy.",
      },
      {
        title: "System Integration",
        description:
          "Connect applications, data, and workflows across platforms to create a more unified enterprise technology ecosystem.",
      },
      {
        title: "API & Platform Engineering",
        description:
          "Develop reusable APIs, service layers, and platform foundations that support scalable digital product delivery.",
      },
      {
        title: "Cloud-Native Delivery",
        description:
          "Build and deploy scalable applications using modern cloud-native patterns, automation, and delivery pipelines.",
      },
      {
        title: "Data & Automation Workflow",
        description:
          "Automate repetitive processes and improve data flow to increase productivity, accuracy, and operational visibility.",
      },
      {
        title: "Managed Delivery Governance",
        description:
          "Keep delivery measurable with planning, documentation, quality control, and maintainable engineering standards.",
      },
    ],
  },
  {
    id: "telecommunication",
    label: "Telecommunication",
    title: "Telecommunication Solutions",
    description:
      "Comprehensive telecommunications services to support network development, infrastructure maintenance, and reliable connectivity.",
    image: "/images/industry-telecom.png",
    capabilities: [
      {
        title: "BTS Installation & Upgrade",
        description:
          "End-to-end deployment and modernization support for telecommunication sites, radio infrastructure, and network readiness.",
      },
      {
        title: "Site Maintenance",
        description:
          "Preventive and corrective maintenance services to keep telecommunication infrastructure reliable and available.",
      },
      {
        title: "Civil, Mechanical & Electrical",
        description:
          "CME execution support for site construction, power systems, grounding, physical infrastructure, and operational readiness.",
      },
      {
        title: "Network Rollout Support",
        description:
          "Structured rollout planning and field execution support to accelerate network expansion across multiple locations.",
      },
      {
        title: "Fiber & Connectivity Infrastructure",
        description:
          "Connectivity infrastructure planning and implementation to support stable, high-capacity enterprise and telco operations.",
      },
      {
        title: "NOC & Field Coordination",
        description:
          "Improve coordination between monitoring teams and field operations to accelerate issue resolution and service assurance.",
      },
    ],
  },
] as const satisfies readonly SolutionTab[];
