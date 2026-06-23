import {
  BrainCircuit,
  Building2,
  CloudCog,
  DatabaseZap,
  GraduationCap,
  HeartPulse,
  Landmark,
  Network,
  RadioTower,
  ServerCog,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import type { CompanyConfig } from "@/types/company";

export const company = {
  legalName: "PT Indotek Buana Karya",
  brandName: "Indoteksaft",
  shortName: "IBK",
  tagline: "Empowering Digital Transformation",
  description:
    "Membangun ekosistem teknologi end-to-end untuk infrastruktur kritikal, keamanan siber, cloud, data, dan transformasi digital berskala nasional.",
  website: "https://www.indoteksaft.co.id",
  email: "info@indoteksaft.co.id",
  phone: "+62 21 0000 0000",
  address: "Jakarta, Indonesia",
  establishedYear: 2012,
  navItems: [
    { label: "Products", href: "#products" },
    { label: "Solutions", href: "#solutions" },
    { label: "Industries", href: "#industries" },
    { label: "Resources", href: "#resources" },
    { label: "Company", href: "#company" },
  ],
  metrics: [
    { value: "200+", label: "Enterprise clients" },
    { value: "12+", label: "Years of execution" },
    { value: "24/7", label: "Operational support" },
    { value: "99.99%", label: "Target availability" },
  ],
  solutions: [
    {
      id: "cybersecurity",
      title: "Cybersecurity",
      tagline: "Zero-trust. Always on.",
      description:
        "Pertahanan siber berlapis untuk organisasi dengan kebutuhan keamanan tinggi, dari hardening hingga operasi SOC.",
      capabilities: [
        "Zero-Trust Architecture",
        "Security Operations Center",
        "Threat Detection & Response",
        "Governance, Risk & Compliance",
      ],
      icon: ShieldCheck,
    },
    {
      id: "infrastructure",
      title: "Infrastructure & Data Center",
      tagline: "Resilient by design.",
      description:
        "Infrastruktur mission-critical yang dirancang untuk ketersediaan tinggi, skalabilitas, dan kontinuitas bisnis.",
      capabilities: [
        "Data Center Design",
        "Network Modernization",
        "Virtualization",
        "Disaster Recovery",
      ],
      icon: ServerCog,
    },
    {
      id: "cloud",
      title: "Cloud & Hybrid",
      tagline: "Agile. Secure. Sovereign.",
      description:
        "Arsitektur private, sovereign, dan hybrid cloud yang menjaga kontrol data sekaligus mempercepat inovasi.",
      capabilities: [
        "Private & Sovereign Cloud",
        "Hybrid Multi-Cloud",
        "Cloud Migration",
        "Managed Cloud Operations",
      ],
      icon: CloudCog,
    },
    {
      id: "data-ai",
      title: "Data, AI & Automation",
      tagline: "Decisions at machine speed.",
      description:
        "Platform data modern dan otomasi cerdas untuk mengubah data operasional menjadi keputusan yang terukur.",
      capabilities: [
        "Enterprise Data Platform",
        "AI-Driven Analytics",
        "Process Automation",
        "Master Data Management",
      ],
      icon: BrainCircuit,
    },
  ],
  industries: [
    {
      id: "defense",
      title: "Defense",
      description:
        "Infrastruktur keamanan mission-critical untuk operasi pertahanan nasional.",
      image: "/images/industry-defense.png",
      solutions: [
        "Secure Infrastructure",
        "Private Cloud",
        "Command Center",
        "Cyber Defense",
      ],
      icon: ShieldCheck,
    },
    {
      id: "government",
      title: "Government",
      description:
        "Transformasi layanan publik dan smart governance yang aman serta terintegrasi.",
      image: "/images/industry-government.png",
      solutions: [
        "Digital Services",
        "Smart Government",
        "System Integration",
        "Command Center",
      ],
      icon: Landmark,
    },
    {
      id: "healthcare",
      title: "Healthcare",
      description:
        "Infrastruktur kesehatan tangguh untuk mendukung layanan medis tanpa henti.",
      image: "/images/industry-healthcare.png",
      solutions: [
        "Hospital Infrastructure",
        "Network Security",
        "Monitoring",
        "Managed Services",
      ],
      icon: HeartPulse,
    },
    {
      id: "telecom",
      title: "Telecommunication",
      description:
        "Deployment jaringan end-to-end dan monitoring cerdas untuk operasi telekomunikasi.",
      image: "/images/industry-telecom.png",
      solutions: [
        "Smart Site",
        "NOC",
        "Tower Monitoring",
        "Fiber Infrastructure",
      ],
      icon: RadioTower,
    },
    {
      id: "enterprise",
      title: "Enterprise",
      description:
        "Teknologi enterprise yang scalable untuk pertumbuhan dan keputusan berbasis data.",
      image: "/images/industry-enterprise.png",
      solutions: ["Data Center", "Cloud", "Cybersecurity", "Automation"],
      icon: Building2,
    },
    {
      id: "education",
      title: "Education",
      description:
        "Smart campus dan fondasi pembelajaran digital untuk institusi masa depan.",
      image: "/images/industry-education.png",
      solutions: [
        "Smart Campus",
        "Learning Platform",
        "Infrastructure",
        "Monitoring",
      ],
      icon: GraduationCap,
    },
  ],
  products: [
    {
      name: "Sovereign Cloud Fabric",
      category: "Cloud Platform",
      description:
        "Orkestrasi private cloud terpadu untuk workload sensitif dan kebutuhan residensi data.",
      features: ["Multi-tenant", "Policy-driven", "Real-time observability"],
      status: "Enterprise Ready",
      icon: CloudCog,
    },
    {
      name: "Sentinel NOC",
      category: "Operations Platform",
      description:
        "Monitoring infrastruktur, jaringan, dan layanan dalam satu operational command center.",
      features: ["Unified dashboard", "Smart alerting", "SLA reporting"],
      status: "Managed Platform",
      icon: Network,
    },
    {
      name: "Data Intelligence Hub",
      category: "Data Platform",
      description:
        "Fondasi data enterprise untuk integrasi, kualitas, analitik, dan regulatory reporting.",
      features: ["Data catalog", "Quality rules", "Executive analytics"],
      status: "Enterprise Ready",
      icon: DatabaseZap,
    },
  ],
  portfolio: [
    {
      category: "Government",
      title: "Secure Digital Service Modernization",
      client: "National Public Institution",
      summary:
        "Modernisasi layanan digital dengan arsitektur zero-trust dan integrasi lintas sistem.",
      outcome: "Resilience and service visibility improved",
    },
    {
      category: "Enterprise",
      title: "Big Data Appliance Architecture",
      client: "National Enterprise Group",
      summary:
        "Arsitektur data berskala besar untuk analytics dan optimasi operasi.",
      outcome: "Faster insight across operational datasets",
    },
    {
      category: "Telecommunication",
      title: "Nationwide Network Deployment",
      client: "Leading Telecom Operator",
      summary:
        "Deployment dan modernisasi infrastruktur telekomunikasi di berbagai lokasi.",
      outcome: "Deployment velocity and control increased",
    },
  ],
} as const satisfies CompanyConfig;

export const differentiators = [
  {
    title: "National-scale experience",
    description:
      "Terbiasa bekerja pada lingkungan kompleks dengan tuntutan availability dan governance tinggi.",
    icon: Landmark,
  },
  {
    title: "End-to-end accountability",
    description:
      "Satu tim untuk advisory, design, implementation, managed service, dan continuous improvement.",
    icon: Sparkles,
  },
  {
    title: "Security by architecture",
    description:
      "Keamanan menjadi bagian dari desain sejak awal, bukan lapisan tambahan di akhir.",
    icon: ShieldCheck,
  },
  {
    title: "Operational intelligence",
    description:
      "Observability dan data digunakan untuk membuat operasi lebih prediktif dan terukur.",
    icon: BrainCircuit,
  },
] as const;
