export type ProductTheme =
  | "dashboard"
  | "map"
  | "workflow"
  | "monitoring"
  | "analytics"
  | "iot"
  | "security"
  | "noc"
  | "finance";

export type SoftwareProduct = {
  readonly slug: string;
  readonly name: string;
  readonly shortName: string;
  readonly subtitle: string;
  readonly description: string;
  readonly theme: ProductTheme;
  readonly brochureUrl?: string;
  readonly demoUrl?: string;
  readonly features: readonly string[];
  readonly benefits: readonly string[];
};

export const softwareProductPages = [
  [
    {
      slug: "hci-platform",
      name: "HCI Platform (Hyper-Converged Infrastructure Platform)",
      shortName: "HCI Platform",
      subtitle: "Hyperconverged Infrastructure Solution",
      description:
        "Streamline your data center by unifying compute, storage, and networking into one agile platform. Eliminate legacy complexity, reduce overhead, and scale seamlessly.",
      theme: "dashboard",
      brochureUrl: "/brochures/hci-platform.pdf",
      demoUrl: "/#contact",
      features: [
        "Compute & Storage Unified",
        "Auto-scaling",
        "High Availability",
        "Simplified Management",
        "Disaster Recovery",
      ],
      benefits: [
        "Reduce data center footprint",
        "Simplify IT operations",
        "Lower TCO by 40%",
        "Accelerate time-to-market",
        "Enhance business agility",
      ],
    },
    {
      slug: "mdm-platform",
      name: "MDM Platform (Mobile Device Management)",
      shortName: "MDM Platform",
      subtitle: "Mobile Device Management",
      description:
        "Centralize mobile fleet governance with secure provisioning, policy enforcement, remote support, and visibility across enterprise devices.",
      theme: "map",
      demoUrl: "/#contact",
      features: [
        "Device Enrollment",
        "Remote Policy Enforcement",
        "Application Control",
        "Location Visibility",
        "Device Compliance Reporting",
      ],
      benefits: [
        "Improve mobile workforce governance",
        "Reduce device support effort",
        "Protect enterprise data",
        "Accelerate onboarding",
      ],
    },
    {
      slug: "line-production-monitoring-system",
      name: "Line Production Monitoring System",
      shortName: "Line Production Monitoring System",
      subtitle: "Manufacturing Operations Visibility",
      description:
        "Track production health, machine utilization, quality signals, and operational bottlenecks through a unified manufacturing monitoring dashboard.",
      theme: "workflow",
      features: [
        "Production Line Dashboard",
        "Machine Status Monitoring",
        "Downtime Tracking",
        "Quality Signal Integration",
      ],
      benefits: [
        "Improve production visibility",
        "Reduce unplanned downtime",
        "Support data-driven operations",
        "Increase manufacturing efficiency",
      ],
    },
    {
      slug: "pms-platform",
      name: "PMS Platform (Proactive Monitoring System)",
      shortName: "PMS Platform",
      subtitle: "Proactive Monitoring System",
      description:
        "Monitor infrastructure, applications, and network assets proactively with actionable alerts, dashboards, and performance insights.",
      theme: "monitoring",
      brochureUrl: "/brochures/pms-platform.pdf",
      demoUrl: "/#contact",
      features: [
        "Real-time Monitoring",
        "Smart Alerting",
        "SLA Dashboard",
        "Incident Visibility",
        "Performance Reporting",
      ],
      benefits: [
        "Reduce service interruption",
        "Improve response time",
        "Increase operational transparency",
        "Protect service availability",
      ],
    },
  ],
  [
    {
      slug: "livestock-management-system",
      name: "Livestock Management System",
      shortName: "Livestock Management System",
      subtitle: "Digital Livestock Operations",
      description:
        "Manage livestock data, health monitoring, inventory, reporting, and operational workflows in one integrated platform.",
      theme: "analytics",
      features: [
        "Livestock Data Management",
        "Health & Growth Tracking",
        "Inventory Reporting",
        "Operational Dashboard",
      ],
      benefits: [
        "Improve farm visibility",
        "Support faster decisions",
        "Reduce manual reporting",
        "Increase operational accuracy",
      ],
    },
    {
      slug: "video-management-system",
      name: "Video Management System",
      shortName: "Video Management System",
      subtitle: "Integrated Security Video Platform",
      description:
        "Centralize camera streams, site monitoring, event review, and security visibility across critical locations.",
      theme: "iot",
      demoUrl: "/#contact",
      features: [
        "Multi-site Video Monitoring",
        "Camera Stream Management",
        "Event Review",
        "Access-based Visibility",
      ],
      benefits: [
        "Improve physical security oversight",
        "Accelerate incident review",
        "Support multi-site operations",
        "Reduce monitoring complexity",
      ],
    },
    {
      slug: "site-security-monitoring-system",
      name: "Site Security Monitoring System",
      shortName: "Site Security Monitoring System",
      subtitle: "Critical Site Security Monitoring",
      description:
        "Monitor site security signals, access events, environmental alerts, and operational status from a centralized platform.",
      theme: "security",
      features: [
        "Site Security Dashboard",
        "Access Event Tracking",
        "Environmental Alerting",
        "Security Incident Log",
      ],
      benefits: [
        "Strengthen site protection",
        "Improve incident visibility",
        "Reduce manual inspection",
        "Support faster response",
      ],
    },
    {
      slug: "noc-command-center-platform",
      name: "NOC Command Center Platform",
      shortName: "NOC Command Center Platform",
      subtitle: "Network Operations Command Center",
      description:
        "Unify network, infrastructure, and service monitoring into a command center built for high-availability operations.",
      theme: "noc",
      demoUrl: "/#contact",
      features: [
        "Unified NOC Dashboard",
        "Network Health Monitoring",
        "Alert Prioritization",
        "Operational Reporting",
      ],
      benefits: [
        "Improve operational control",
        "Reduce alert noise",
        "Accelerate troubleshooting",
        "Increase service reliability",
      ],
    },
  ],
  [
    {
      slug: "smart-site-operations-platform",
      name: "Smart Site Operations Platform",
      shortName: "Smart Site Operations Platform",
      subtitle: "Remote Site Operations",
      description:
        "Coordinate remote site operations with monitoring, task visibility, asset tracking, and field execution workflows.",
      theme: "iot",
      features: [
        "Remote Site Dashboard",
        "Asset Visibility",
        "Task Tracking",
        "Operational Status Monitoring",
      ],
      benefits: [
        "Improve field coordination",
        "Reduce site visit inefficiency",
        "Increase operational visibility",
        "Support scalable site management",
      ],
    },
    {
      slug: "secure-cloud-management-portal",
      name: "Secure Cloud Management Portal",
      shortName: "Secure Cloud Management Portal",
      subtitle: "Secure Cloud Operations",
      description:
        "Manage cloud resources, access controls, operational policies, and visibility across secure enterprise cloud environments.",
      theme: "security",
      brochureUrl: "/brochures/secure-cloud-management-portal.pdf",
      features: [
        "Cloud Resource Visibility",
        "Access Policy Control",
        "Security Posture Monitoring",
        "Usage Reporting",
      ],
      benefits: [
        "Improve cloud governance",
        "Reduce operational risk",
        "Support secure scalability",
        "Increase cloud cost visibility",
      ],
    },
    {
      slug: "asset-workforce-management-system",
      name: "Asset & Workforce Management System",
      shortName: "Asset & Workforce Management System",
      subtitle: "Asset and Workforce Coordination",
      description:
        "Coordinate assets, workforce assignments, service requests, and operational reporting across distributed teams.",
      theme: "workflow",
      features: [
        "Asset Registry",
        "Workforce Assignment",
        "Service Request Tracking",
        "Operational Reporting",
      ],
      benefits: [
        "Improve team coordination",
        "Increase asset visibility",
        "Reduce manual admin work",
        "Support accountable operations",
      ],
    },
    {
      slug: "enterprise-financial-analytics-suite",
      name: "Enterprise Financial Analytics Suite",
      shortName: "Enterprise Financial Analytics Suite",
      subtitle: "Financial Analytics Platform",
      description:
        "Bring together business and financial data into executive dashboards, KPI tracking, and analytics-ready reporting workflows.",
      theme: "finance",
      demoUrl: "/#contact",
      features: [
        "Financial Dashboard",
        "KPI Monitoring",
        "Data Integration",
        "Executive Reporting",
      ],
      benefits: [
        "Improve financial visibility",
        "Accelerate reporting cycles",
        "Support data-driven planning",
        "Strengthen executive decision-making",
      ],
    },
  ],
] as const satisfies readonly (readonly SoftwareProduct[])[];

export const productCatalog: readonly SoftwareProduct[] = softwareProductPages.flat();
