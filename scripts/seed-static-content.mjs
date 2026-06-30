import fs from "node:fs";
import { Pool } from "pg";

function loadEnv() {
  const envPath = ".env";
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index);
    const value = trimmed.slice(index + 1);
    process.env[key] ??= value;
  }
}

loadEnv();

const pool = new Pool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME ?? "indoteksaft_company",
  user: process.env.DB_USER ?? "indoteksaft",
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSLMODE === "require" ? { rejectUnauthorized: true } : undefined,
});

const now = new Date().toISOString();

const media = [
  ["hero-bg", "Hero Background", "Modern digital city skyline", "/images/hero-bg.png", "banner"],
  ["products-banner", "Products Banner", "Enterprise software product illustration", "/images/products-banner.png", "banner"],
  ["industry-defense", "IT Infrastructure Visual", "Infrastructure and data center illustration", "/images/industry-defense.png", "solution"],
  ["industry-enterprise", "Enterprise Visual", "Enterprise technology illustration", "/images/industry-enterprise.png", "solution"],
  ["industry-telecom", "Telecommunication Visual", "Telecommunication infrastructure illustration", "/images/industry-telecom.png", "solution"],
  ["industry-government", "Government Visual", "Government technology illustration", "/images/industry-government.png", "article"],
  ["industry-healthcare", "Healthcare Visual", "Healthcare technology illustration", "/images/industry-healthcare.png", "article"],
  ["industry-education", "Education Visual", "Education technology illustration", "/images/industry-education.png", "article"],
  ["pak-alfi", "Alfi Muhammad", "Alfi Muhammad portrait", "/images/Pak-Alfi.svg", "company"],
  ["pak-syadam", "Mochamad Syadam", "Mochamad Syadam portrait", "/images/Pak-Syadam.svg", "company"],
  ["mabes-tni", "Mabes TNI Portfolio", "Security appliance and virtualization project", "/images/mabes-tni.png", "portfolio"],
  ["gudang-garam", "Gudang Garam Portfolio", "Big data architecture project", "/images/gudang-garam.png", "portfolio"],
  ["rs-mata-cicendo", "RS Mata Cicendo Portfolio", "Medical center network infrastructure project", "/images/RS-mata-Cicendo.png", "portfolio"],
  ["bpd-prov-jabar", "BPD Provinsi Jawa Barat Portfolio", "Tax payment integration project", "/images/BPD-Prov-Jabar.png", "portfolio"],
  ["pt-leetex", "PT Leetex Portfolio", "Enterprise firewall project", "/images/PT-Leetex.png", "portfolio"],
  ["dishub-jabar", "Dishub Jabar Portfolio", "Airfield network infrastructure project", "/images/Dishub-Jabar.png", "portfolio"],
  ["yayasan-taruna-bakti", "Yayasan Taruna Bakti Portfolio", "IT infrastructure project", "/images/Yayasan-Taruna-Bakti.png", "portfolio"],
  ["pt-bethesda", "PT Bethesda Portfolio", "Hotel IT infrastructure project", "/images/PT-Bethesda.png", "portfolio"],
  ["rs-paru", "RS Paru Portfolio", "Healthcare server services project", "/images/RS-Paru.png", "portfolio"],
  ["pt-telkomsel", "PT Telkomsel Portfolio", "Telecommunications infrastructure project", "/images/PT-Telkomsel.png", "portfolio"],
  ...Array.from({ length: 98 }, (_, index) => [
    `client-logo-${index + 1}`,
    `Client Logo ${index + 1}`,
    `Client logo ${index + 1}`,
    `/client-ikon/Frame ${index + 1}.png`,
    "client",
  ]),
];

const banners = [
  {
    pageSlug: "home",
    placement: "hero",
    eyebrow: "Indonesia's critical tech partner",
    title: "Delivering",
    subtitle: "at National Scale",
    description:
      "PT Indotek Buana Karya engineers end-to-end technology ecosystems from datacenter design to AI-driven operations trusted by 200+ organizations across Indonesia's most critical sectors.",
    background: "hero-bg",
    ctaLabel: "Start Free Consultation",
    ctaHref: "#contact",
    secondaryCtaLabel: "Explore Solutions",
    secondaryCtaHref: "/solutions",
  },
  {
    pageSlug: "products",
    placement: "hero",
    eyebrow: "Product",
    title: "Enterprise Software Solutions",
    description:
      "Scalable software products engineered to help organizations innovate faster, improve efficiency, and stay ahead in a digital-first world.",
    image: "products-banner",
  },
  {
    pageSlug: "industries",
    placement: "hero",
    eyebrow: "Trusted across industries",
    title: "Technology Solutions for Every Industry",
    description:
      "Building a strong digital foundation to support innovation, efficiency, and business growth across multiple sectors.",
    image: "products-banner",
  },
  {
    pageSlug: "company",
    placement: "hero",
    eyebrow: "About Indoteksaft",
    title: "Make it Happen. Make it Matter.",
    description:
      "We turn ideas into impactful digital solutions that drive real change for businesses and society.",
    background: "hero-bg",
  },
  {
    pageSlug: "resources-portfolio",
    placement: "hero",
    eyebrow: "Portfolio Project",
    title: "Project Experience",
    description:
      "From infrastructure modernization to intelligent digital solutions, our projects reflect a commitment to innovation, reliability, and measurable impact.",
  },
  {
    pageSlug: "resources-client",
    placement: "hero",
    eyebrow: "Our Clients",
    title: "Building Long-Term Technology Partnerships",
    description:
      "We work closely with organizations to design, implement, and optimize technology ecosystems that support their strategic objectives and digital transformation journey.",
  },
];

const rotatingTerms = [
  "Defense-Grade Infrastructure",
  "Sovereign Cloud Platforms",
  "Mission-Critical Cybersecurity",
  "AI-Driven Operations",
];

const metrics = [
  ["years-experience", "8+", "Years Experience"],
  ["organizations-served", "100+", "Organizations Served"],
  ["project-delivered", "200+", "Project Delivered"],
  ["client-satisfaction", "99%", "Client Satisfaction"],
];

const serviceCards = [
  {
    slug: "it-infrastructure-solutions",
    title: "IT Infrastructure Solutions",
    description:
      "Comprehensive infrastructure solutions designed to optimize performance, strengthen security, and support the evolving needs of modern enterprises.",
    iconName: "ServerCog",
    image: "industry-defense",
    href: "/solutions#infrastructure",
    points: ["Secure & Reliable Infrastructure", "High Availability & Scalability", "24/7 Monitoring & Support"],
  },
  {
    slug: "tech-delivery-solutions",
    title: "Tech Delivery Solutions",
    description:
      "Comprehensive technology delivery services that transform business requirements into secure, scalable, and future-ready digital solutions.",
    iconName: "Code2",
    image: "industry-enterprise",
    href: "/solutions#delivery",
    points: ["Custom Development", "Scalable Architecture", "End-to-End Delivery"],
  },
  {
    slug: "telecommunication-solutions",
    title: "Telecommunication Solutions",
    description:
      "Comprehensive telecommunications services to support network development, infrastructure maintenance, and reliable connectivity.",
    iconName: "RadioTower",
    image: "industry-telecom",
    href: "/solutions#telecommunication",
    points: ["BTS Installation & Upgrade", "Site Maintenance", "Civil, Mechanical & Electrical (CME)"],
  },
];

const products = [
  ["hci-platform", "HCI Platform (Hyper-Converged Infrastructure Platform)", "HCI Platform", "Hyperconverged Infrastructure Solution", "Streamline your data center by unifying compute, storage, and networking into one agile platform. Eliminate legacy complexity, reduce overhead, and scale seamlessly.", "dashboard", "/brochures/hci-platform.pdf", "/#contact", ["Compute & Storage Unified", "Auto-scaling", "High Availability", "Simplified Management", "Disaster Recovery"], ["Reduce data center footprint", "Simplify IT operations", "Lower TCO by 40%", "Accelerate time-to-market", "Enhance business agility"]],
  ["mdm-platform", "MDM Platform (Mobile Device Management)", "MDM Platform", "Mobile Device Management", "Centralize mobile fleet governance with secure provisioning, policy enforcement, remote support, and visibility across enterprise devices.", "map", null, "/#contact", ["Device Enrollment", "Remote Policy Enforcement", "Application Control", "Location Visibility", "Device Compliance Reporting"], ["Improve mobile workforce governance", "Reduce device support effort", "Protect enterprise data", "Accelerate onboarding"]],
  ["line-production-monitoring-system", "Line Production Monitoring System", "Line Production Monitoring System", "Manufacturing Operations Visibility", "Track production health, machine utilization, quality signals, and operational bottlenecks through a unified manufacturing monitoring dashboard.", "workflow", null, null, ["Production Line Dashboard", "Machine Status Monitoring", "Downtime Tracking", "Quality Signal Integration"], ["Improve production visibility", "Reduce unplanned downtime", "Support data-driven operations", "Increase manufacturing efficiency"]],
  ["pms-platform", "PMS Platform (Proactive Monitoring System)", "PMS Platform", "Proactive Monitoring System", "Monitor infrastructure, applications, and network assets proactively with actionable alerts, dashboards, and performance insights.", "monitoring", "/brochures/pms-platform.pdf", "/#contact", ["Real-time Monitoring", "Smart Alerting", "SLA Dashboard", "Incident Visibility", "Performance Reporting"], ["Reduce service interruption", "Improve response time", "Increase operational transparency", "Protect service availability"]],
  ["livestock-management-system", "Livestock Management System", "Livestock Management System", "Digital Livestock Operations", "Manage livestock data, health monitoring, inventory, reporting, and operational workflows in one integrated platform.", "analytics", null, null, ["Livestock Data Management", "Health & Growth Tracking", "Inventory Reporting", "Operational Dashboard"], ["Improve farm visibility", "Support faster decisions", "Reduce manual reporting", "Increase operational accuracy"]],
  ["video-management-system", "Video Management System", "Video Management System", "Integrated Security Video Platform", "Centralize camera streams, site monitoring, event review, and security visibility across critical locations.", "iot", null, "/#contact", ["Multi-site Video Monitoring", "Camera Stream Management", "Event Review", "Access-based Visibility"], ["Improve physical security oversight", "Accelerate incident review", "Support multi-site operations", "Reduce monitoring complexity"]],
  ["site-security-monitoring-system", "Site Security Monitoring System", "Site Security Monitoring System", "Critical Site Security Monitoring", "Monitor site security signals, access events, environmental alerts, and operational status from a centralized platform.", "security", null, null, ["Site Security Dashboard", "Access Event Tracking", "Environmental Alerting", "Security Incident Log"], ["Strengthen site protection", "Improve incident visibility", "Reduce manual inspection", "Support faster response"]],
  ["noc-command-center-platform", "NOC Command Center Platform", "NOC Command Center Platform", "Network Operations Command Center", "Unify network, infrastructure, and service monitoring into a command center built for high-availability operations.", "noc", null, "/#contact", ["Unified NOC Dashboard", "Network Health Monitoring", "Alert Prioritization", "Operational Reporting"], ["Improve operational control", "Reduce alert noise", "Accelerate troubleshooting", "Increase service reliability"]],
  ["smart-site-operations-platform", "Smart Site Operations Platform", "Smart Site Operations Platform", "Remote Site Operations", "Coordinate remote site operations with monitoring, task visibility, asset tracking, and field execution workflows.", "iot", null, null, ["Remote Site Dashboard", "Asset Visibility", "Task Tracking", "Operational Status Monitoring"], ["Improve field coordination", "Reduce site visit inefficiency", "Increase operational visibility", "Support scalable site management"]],
  ["secure-cloud-management-portal", "Secure Cloud Management Portal", "Secure Cloud Management Portal", "Secure Cloud Operations", "Manage cloud resources, access controls, operational policies, and visibility across secure enterprise cloud environments.", "security", "/brochures/secure-cloud-management-portal.pdf", null, ["Cloud Resource Visibility", "Access Policy Control", "Security Posture Monitoring", "Usage Reporting"], ["Improve cloud governance", "Reduce operational risk", "Support secure scalability", "Increase cloud cost visibility"]],
  ["asset-workforce-management-system", "Asset & Workforce Management System", "Asset & Workforce Management System", "Asset and Workforce Coordination", "Coordinate assets, workforce assignments, service requests, and operational reporting across distributed teams.", "workflow", null, null, ["Asset Registry", "Workforce Assignment", "Service Request Tracking", "Operational Reporting"], ["Improve team coordination", "Increase asset visibility", "Reduce manual admin work", "Support accountable operations"]],
  ["enterprise-financial-analytics-suite", "Enterprise Financial Analytics Suite", "Enterprise Financial Analytics Suite", "Financial Analytics Platform", "Bring together business and financial data into executive dashboards, KPI tracking, and analytics-ready reporting workflows.", "finance", null, "/#contact", ["Financial Dashboard", "KPI Monitoring", "Data Integration", "Executive Reporting"], ["Improve financial visibility", "Accelerate reporting cycles", "Support data-driven planning", "Strengthen executive decision-making"]],
];

const industries = [
  ["government-bumn", "Government & BUMN", "Drive secure, transparent, and efficient digital public services to streamline public sector operations and governance.", "government"],
  ["manufacturing", "Manufacturing", "Optimize production lines with smart automation and integrated systems to increase factory output and reduce overhead.", "manufacturing"],
  ["education", "Education", "Empower learning environments with reliable digital platforms that enhance collaboration and expand educational access.", "education"],
  ["healthcare", "Healthcare", "Streamline clinical workflows and secure sensitive patient data with interconnected, high-performance medical software solutions.", "healthcare"],
  ["telecommunication", "Telecommunication", "Deliver robust network infrastructure and engineering solutions to support high-speed connectivity and expand carrier coverage.", "telecommunication"],
  ["enterprise", "Enterprise", "Accelerate large-scale corporate growth through custom IT ecosystems engineered for high scalability and market agility.", "enterprise"],
  ["banking-financial-services", "Banking & Financial Services", "Deploy high-security fintech infrastructure capable of handling volume-driven financial transactions with zero downtime.", "banking"],
  ["agriculture", "Agriculture", "Leverage smart tech integration to monitor crop environments, boost farming yields, and optimize supply chains.", "agriculture"],
];

const solutions = [
  ["infrastructure", "infrastructure", "IT Infrastructure", "IT Infrastructure Solutions", "Comprehensive infrastructure solutions designed to optimize performance, strengthen security, and support the evolving needs of modern enterprises.", "ServerCog", "industry-defense", [
    ["Public, Private & Hybrid Cloud", "Scalable and secure cloud environments tailored to modernize your IT infrastructure and drive agile business growth."],
    ["Server Compute Infrastructure", "High-performance and reliable computing solutions designed to power your critical enterprise workloads and business applications."],
    ["SAN & NAS Storage", "Centralized, high-speed storage architectures ensuring enterprise data is securely stored, backup-ready, and instantly accessible."],
    ["Network & Security Foundation", "Resilient network architecture with segmentation, secure access, and visibility to support mission-critical digital operations."],
    ["Data Center Modernization", "Modernize data center environments with scalable architecture, improved availability, and operational efficiency."],
    ["Backup & Disaster Recovery", "Protect business continuity with robust backup, replication, and recovery strategies for enterprise environments."],
  ]],
  ["delivery", "delivery", "Tech Delivery", "Tech Delivery Solutions", "Comprehensive technology delivery services that transform business requirements into secure, scalable, and future-ready digital solutions.", "Code2", "industry-enterprise", [
    ["Custom Application Development", "Design and build business applications tailored to operational needs, integration requirements, and growth strategy."],
    ["System Integration", "Connect applications, data, and workflows across platforms to create a more unified enterprise technology ecosystem."],
    ["API & Platform Engineering", "Develop reusable APIs, service layers, and platform foundations that support scalable digital product delivery."],
    ["Cloud-Native Delivery", "Build and deploy scalable applications using modern cloud-native patterns, automation, and delivery pipelines."],
    ["Data & Automation Workflow", "Automate repetitive processes and improve data flow to increase productivity, accuracy, and operational visibility."],
    ["Managed Delivery Governance", "Keep delivery measurable with planning, documentation, quality control, and maintainable engineering standards."],
  ]],
  ["telecommunication", "telecommunication", "Telecommunication", "Telecommunication Solutions", "Comprehensive telecommunications services to support network development, infrastructure maintenance, and reliable connectivity.", "RadioTower", "industry-telecom", [
    ["BTS Installation & Upgrade", "End-to-end deployment and modernization support for telecommunication sites, radio infrastructure, and network readiness."],
    ["Site Maintenance", "Preventive and corrective maintenance services to keep telecommunication infrastructure reliable and available."],
    ["Civil, Mechanical & Electrical", "CME execution support for site construction, power systems, grounding, physical infrastructure, and operational readiness."],
    ["Network Rollout Support", "Structured rollout planning and field execution support to accelerate network expansion across multiple locations."],
    ["Fiber & Connectivity Infrastructure", "Connectivity infrastructure planning and implementation to support stable, high-capacity enterprise and telco operations."],
    ["NOC & Field Coordination", "Improve coordination between monitoring teams and field operations to accelerate issue resolution and service assurance."],
  ]],
];

const articles = [
  ["transformasi-digital-web-development", "Software Development", "5 min read", "Transformasi Digital: Mengapa Web Development Adalah Infrastruktur Utama Bisnis, Bukan Sekadar Etalase", "Website modern bukan lagi sekadar etalase digital. Ia menjadi fondasi operasional, akuisisi, integrasi, dan kredibilitas bisnis.", "2026-04-19", "industry-enterprise", [["Web sebagai fondasi operasional digital", ["Dalam lanskap bisnis modern, website perusahaan memiliki peran yang jauh lebih strategis dibanding sekadar profil online. Website dapat menjadi pintu masuk layanan, pusat edukasi pelanggan, kanal lead generation, dan titik integrasi berbagai sistem internal.", "Ketika dirancang dengan baik, web development membantu organisasi membangun pengalaman digital yang konsisten, aman, mudah diperluas, dan siap mendukung pertumbuhan jangka panjang."]], ["Apa yang perlu diperhatikan", ["Perusahaan perlu memperhatikan performa, keamanan, struktur konten, SEO, aksesibilitas, dan kesiapan integrasi sejak awal. Tanpa fondasi ini, website akan cepat menjadi beban teknis yang sulit dirawat.", "Pendekatan yang lebih matang adalah memperlakukan website sebagai produk digital yang terus berkembang, bukan proyek satu kali selesai."]]]],
  ["secure-cloud-infrastructure", "Cloud Infrastructure", "4 min read", "Membangun Infrastruktur Cloud yang Aman, Terukur, dan Siap Menopang Operasional Enterprise", "Cloud enterprise membutuhkan desain governance, security, dan observability yang matang agar tetap aman sekaligus scalable.", "2026-04-22", "industry-government", [["Cloud bukan sekadar migrasi server", ["Adopsi cloud yang berhasil dimulai dari desain arsitektur, bukan hanya memindahkan workload. Organisasi perlu memahami pola akses, kebutuhan keamanan, dependensi aplikasi, dan model operasional yang akan berjalan setelah migrasi.", "Dengan pendekatan yang tepat, cloud dapat mempercepat delivery, meningkatkan resiliensi, dan memberikan kontrol biaya yang lebih baik."]], ["Kunci cloud enterprise", ["Beberapa aspek penting mencakup identity management, segmentasi jaringan, enkripsi data, monitoring biaya, backup, disaster recovery, serta kebijakan akses yang mudah diaudit."]]]],
  ["noc-monitoring-proaktif", "Managed Services", "6 min read", "Peran NOC dan Monitoring Proaktif dalam Menjaga Ketersediaan Layanan Digital Kritis", "NOC membantu organisasi mendeteksi gangguan lebih awal, mempercepat respons, dan menjaga layanan tetap tersedia.", "2026-04-27", "industry-telecom", [["Monitoring yang bergerak sebelum masalah membesar", ["Network Operations Center memberikan visibilitas terpusat terhadap infrastruktur, aplikasi, dan jaringan. Dengan monitoring proaktif, tim operasional dapat melihat gejala penurunan performa sebelum berubah menjadi gangguan besar.", "NOC yang efektif menggabungkan dashboard, alert prioritas, SOP respons, dan pelaporan SLA untuk memastikan insiden ditangani secara konsisten."]], ["Dampak terhadap bisnis", ["Ketersediaan layanan digital yang lebih stabil berdampak langsung pada pengalaman pelanggan, produktivitas internal, dan kepercayaan stakeholder."]]]],
  ["cyber-resilience-modern", "Cybersecurity", "5 min read", "Cyber Resilience: Strategi Melindungi Data, Aplikasi, dan Infrastruktur dari Risiko Modern", "Ketahanan siber perlu dibangun lewat kombinasi architecture, governance, monitoring, dan kesiapan respons.", "2026-05-03", "industry-defense", [["Resilience lebih luas dari prevention", ["Keamanan modern tidak cukup hanya mencegah serangan. Organisasi juga perlu mampu mendeteksi, merespons, memulihkan, dan belajar dari setiap insiden.", "Cyber resilience menggabungkan teknologi, proses, dan kesiapan organisasi agar dampak gangguan dapat ditekan seminimal mungkin."]], ["Area prioritas", ["Prioritas umum meliputi hardening sistem, identity protection, endpoint security, backup strategy, monitoring ancaman, dan tabletop exercise untuk respons insiden."]]]],
  ["ai-operations-enterprise", "AI Operations", "7 min read", "Mengoptimalkan Operasional TI dengan AI untuk Deteksi Dini, Analisis, dan Automasi", "AI operations membantu tim TI memahami pola insiden, mengurangi noise alert, dan mempercepat keputusan operasional.", "2026-05-09", "industry-healthcare", [["Dari alert menjadi insight", ["AI dapat membantu mengolah data operasional dalam volume besar, menemukan anomali, dan memberikan prioritas terhadap insiden yang paling berdampak.", "Dengan pemodelan yang tepat, AI operations dapat mengurangi beban manual dan membantu tim fokus pada tindakan yang benar-benar penting."]], ["Automasi yang tetap terkendali", ["Automasi perlu dirancang bertahap dengan guardrail yang jelas. Mulai dari rekomendasi, semi-automation, hingga full automation untuk skenario yang matang dan rendah risiko."]]]],
  ["enterprise-network-foundation", "Telecommunication", "4 min read", "Fondasi Konektivitas Enterprise: Network Design yang Stabil untuk Pertumbuhan Bisnis", "Desain network yang kuat menjadi fondasi stabilitas aplikasi, keamanan akses, dan ekspansi bisnis lintas lokasi.", "2026-05-14", "industry-education", [["Network sebagai tulang punggung digital", ["Konektivitas enterprise menentukan kualitas akses terhadap aplikasi, data, cloud, dan layanan digital. Desain network yang kurang matang sering menjadi sumber bottleneck dan risiko keamanan.", "Fondasi yang baik mencakup segmentasi, redundancy, monitoring, capacity planning, dan dokumentasi arsitektur yang jelas."]], ["Siap untuk pertumbuhan", ["Network design perlu mempertimbangkan pertumbuhan lokasi, peningkatan trafik, integrasi cloud, serta kebutuhan zero-trust access di masa depan."]]]],
];

const portfolioProjects = [
  ["security-appliance-virtualization-solutions", "Security Appliance & Virtualization Solutions", "Mabes TNI AD | Pusansiad | Mabes TNI - Pusinfo | Mabes TNI AL", "mabes-tni"],
  ["big-data-platforms", "IT Architecture Solutions for Big Data Platforms", "PT Gudang Garam Tbk.", "gudang-garam"],
  ["medical-centers-network", "Network Infrastructure Solutions for Medical Centers", "RS Mata Cicendo | RSUD Bandung Kiwari | RSJ Provinsi Jabar | RSKGM Kota Bandung", "rs-mata-cicendo"],
  ["tax-payment-security", "Tax Payment System Integration & Security Solutions", "Badan Pendapatan Daerah Provinsi Jawa Barat", "bpd-prov-jabar"],
  ["enterprise-firewall-network-security", "Enterprise Firewall & Network Security Solutions", "PT Leetex Garment Indonesia", "pt-leetex"],
  ["airfield-network-infrastructure", "Advanced Network Infrastructure for Airfield Operations", "Dinas Perhubungan Provinsi Jawa Barat (Dishub Jabar)", "dishub-jabar"],
  ["comprehensive-it-infrastructure", "Comprehensive IT Infrastructure Solutions", "Yayasan Taruna Bakti", "yayasan-taruna-bakti"],
  ["hotel-it-infrastructure", "Hotel IT Infrastructure Solutions for High-Connectivity Environments", "PT Bethesda Hospital Indonesia", "pt-bethesda"],
  ["healthcare-server-production-monitoring", "Managed High-Capacity Server Services & Production Monitoring for Healthcare Facilities", "Rumah Sakit Paru dr. H. A. Rotinsulu", "rs-paru"],
  ["telecom-installation-dismantling", "Telecommunications Infrastructure Installation & Dismantling Services", "PT Telekomunikasi Selular (Telkomsel)", "pt-telkomsel"],
];

const companyStatements = [
  ["vision", "Our Vision", "To become a leading technology company in Indonesia delivering excellent, innovative, and impactful digital solutions for business and society."],
  ["mission", "Our Mission", "To provide IT solutions that improve our clients' efficiency, profitability, and competitiveness through high-quality services powered by AI, IoT, and sustainable digital innovation."],
];

const companyValues = [
  ["solution", "Solution", "Simplifying problems by providing the right solutions to customers."],
  ["integrity", "Integrity", "Committed to providing maximum service to customers so as to maintain long-term cooperative relationships."],
  ["professionalism", "Professionalism", "Developing competent human resources with the ability to face challenges and bring success to the company."],
  ["improvement", "Improvement", "Conducting continuous improvements that drive the company's business development."],
];

const leaders = [
  ["alfi-muhammad", "Alfi Muhammad", "CEO & Co-Founder", "pak-alfi"],
  ["mochamad-syadam", "Mochamad Syadam", "Director & Co-Founder", "pak-syadam"],
];

const navigation = [
  ["main", "Products", "/products", 1],
  ["main", "Solutions", "/solutions", 2],
  ["main", "Industries", "/industries", 3],
  ["main", "Resources", "/resources", 4],
  ["main", "Company", "/company", 5],
  ["resources", "Portfolio Project", "/resources/portfolio", 1],
  ["resources", "Client", "/resources/client", 2],
  ["resources", "Blog & Article", "/articles", 3],
  ["footer-services", "IT Infrastructure Solutions", "/solutions#infrastructure", 1],
  ["footer-services", "Tech Delivery Solutions", "/solutions#delivery", 2],
  ["footer-services", "Telecommunication Solutions", "/solutions#telecommunication", 3],
  ["footer-company", "About Us", "/company", 1],
  ["footer-company", "Careers", "/careers", 2],
  ["footer-company", "Terms & Conditions", "/terms-and-conditions", 3],
  ["footer-company", "Privacy Policy", "/privacy-policy", 4],
  ["footer-resources", "Portfolio", "/resources/portfolio", 1],
  ["footer-resources", "Brosur", "/resources/brosur", 2],
  ["footer-resources", "Blog", "/articles", 3],
  ["footer-resources", "Event", "/resources/event", 4],
];

async function q(text, params = []) {
  return pool.query(text, params);
}

async function upsertMedia([slug, title, altText, fileUrl, category]) {
  const result = await q(
    `INSERT INTO cms_media_assets (slug, title, alt_text, file_url, category)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (slug) DO UPDATE SET
       title = EXCLUDED.title,
       alt_text = EXCLUDED.alt_text,
       file_url = EXCLUDED.file_url,
       category = EXCLUDED.category,
       updated_at = NOW()
     RETURNING id`,
    [slug, title, altText, fileUrl, category],
  );
  return result.rows[0].id;
}

async function main() {
  const client = await pool.connect();
  client.release();

  const mediaIds = new Map();
  for (const item of media) mediaIds.set(item[0], await upsertMedia(item));

  await q(
    `DELETE FROM cms_banners
     WHERE page_slug = ANY($1::varchar[])`,
    [banners.map((banner) => banner.pageSlug)],
  );
  for (let i = 0; i < banners.length; i++) {
    const b = banners[i];
    await q(
      `INSERT INTO cms_banners
        (page_slug, placement, eyebrow, title, subtitle, description, image_asset_id, background_asset_id, cta_label, cta_href, secondary_cta_label, secondary_cta_href, status, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'published',$13)
      `,
      [b.pageSlug, b.placement, b.eyebrow, b.title, b.subtitle ?? null, b.description ?? null, b.image ? mediaIds.get(b.image) : null, b.background ? mediaIds.get(b.background) : null, b.ctaLabel ?? null, b.ctaHref ?? null, b.secondaryCtaLabel ?? null, b.secondaryCtaHref ?? null, i],
    );
  }

  await q("DELETE FROM cms_banner_rotating_terms WHERE page_slug = 'home' AND placement = 'hero'");
  for (let i = 0; i < rotatingTerms.length; i++) {
    await q(
      `INSERT INTO cms_banner_rotating_terms (page_slug, placement, term, locale, status, sort_order)
       VALUES ('home', 'hero', $1, 'en', 'published', $2)`,
      [rotatingTerms[i], i],
    );
  }

  for (let i = 0; i < metrics.length; i++) {
    const [key, value, label] = metrics[i];
    await q(
      `INSERT INTO cms_metrics (page_slug, metric_key, value, label, status, sort_order)
       VALUES ('home', $1, $2, $3, 'published', $4)
       ON CONFLICT (page_slug, metric_key) DO UPDATE SET value=EXCLUDED.value, label=EXCLUDED.label, status='published', sort_order=EXCLUDED.sort_order, updated_at=NOW()`,
      [key, value, label, i],
    );
  }

  for (let i = 0; i < serviceCards.length; i++) {
    const card = serviceCards[i];
    const { rows } = await q(
      `INSERT INTO cms_service_cards (page_slug, section_key, slug, title, description, icon_name, image_asset_id, href, status, sort_order)
       VALUES ('home', 'what-we-do', $1,$2,$3,$4,$5,$6,'published',$7)
       ON CONFLICT (page_slug, section_key, slug) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, icon_name=EXCLUDED.icon_name, image_asset_id=EXCLUDED.image_asset_id, href=EXCLUDED.href, status='published', sort_order=EXCLUDED.sort_order, updated_at=NOW()
       RETURNING id`,
      [card.slug, card.title, card.description, card.iconName, mediaIds.get(card.image), card.href, i],
    );
    await q("DELETE FROM cms_service_card_points WHERE service_card_id = $1", [rows[0].id]);
    for (let p = 0; p < card.points.length; p++) {
      await q("INSERT INTO cms_service_card_points (service_card_id, label, sort_order) VALUES ($1,$2,$3)", [rows[0].id, card.points[p], p]);
    }
  }

  for (let i = 0; i < products.length; i++) {
    const [slug, name, shortName, subtitle, description, theme, brochureUrl, demoUrl, features, benefits] = products[i];
    const { rows } = await q(
      `INSERT INTO cms_products (slug, name, short_name, subtitle, description, theme, brochure_url, demo_url, status, is_featured, sort_order, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'published',true,$9,$10)
       ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, short_name=EXCLUDED.short_name, subtitle=EXCLUDED.subtitle, description=EXCLUDED.description, theme=EXCLUDED.theme, brochure_url=EXCLUDED.brochure_url, demo_url=EXCLUDED.demo_url, status='published', is_featured=true, sort_order=EXCLUDED.sort_order, updated_at=NOW()
       RETURNING id`,
      [slug, name, shortName, subtitle, description, theme, brochureUrl, demoUrl, i, now],
    );
    await q("DELETE FROM cms_product_points WHERE product_id = $1", [rows[0].id]);
    for (let j = 0; j < features.length; j++) await q("INSERT INTO cms_product_points (product_id, point_type, title, sort_order) VALUES ($1,'feature',$2,$3)", [rows[0].id, features[j], j]);
    for (let j = 0; j < benefits.length; j++) await q("INSERT INTO cms_product_points (product_id, point_type, title, sort_order) VALUES ($1,'benefit',$2,$3)", [rows[0].id, benefits[j], j]);
  }

  const categoryIds = new Map();
  for (const category of [...new Set(articles.map((a) => a[1]))]) {
    const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const { rows } = await q(
      `INSERT INTO cms_article_categories (slug, name)
       VALUES ($1,$2)
       ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, updated_at=NOW()
       RETURNING id`,
      [slug, category],
    );
    categoryIds.set(category, rows[0].id);
  }

  for (let i = 0; i < articles.length; i++) {
    const [slug, category, readTime, title, excerpt, date, image, sections] = articles[i];
    const { rows } = await q(
      `INSERT INTO cms_articles (slug, category_id, category_name, title, excerpt, read_time, image_asset_id, status, is_featured, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'published',true,$8)
       ON CONFLICT (slug) DO UPDATE SET category_id=EXCLUDED.category_id, category_name=EXCLUDED.category_name, title=EXCLUDED.title, excerpt=EXCLUDED.excerpt, read_time=EXCLUDED.read_time, image_asset_id=EXCLUDED.image_asset_id, status='published', published_at=EXCLUDED.published_at, updated_at=NOW()
       RETURNING id`,
      [slug, categoryIds.get(category), category, title, excerpt, readTime, mediaIds.get(image), date],
    );
    await q("DELETE FROM cms_article_sections WHERE article_id = $1", [rows[0].id]);
    for (let j = 0; j < sections.length; j++) {
      await q("INSERT INTO cms_article_sections (article_id, heading, body, sort_order) VALUES ($1,$2,$3::jsonb,$4)", [rows[0].id, sections[j][0], JSON.stringify(sections[j][1]), j]);
    }
  }

  for (let i = 0; i < industries.length; i++) {
    const [slug, title, description, iconName] = industries[i];
    await q(
      `INSERT INTO cms_industries (slug, title, description, icon_name, status, sort_order)
       VALUES ($1,$2,$3,$4,'published',$5)
       ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, icon_name=EXCLUDED.icon_name, status='published', sort_order=EXCLUDED.sort_order, updated_at=NOW()`,
      [slug, title, description, iconName, i],
    );
  }

  for (let i = 0; i < solutions.length; i++) {
    const [slug, tabId, label, title, description, iconName, image, capabilities] = solutions[i];
    const { rows } = await q(
      `INSERT INTO cms_solutions (slug, tab_id, label, title, description, icon_name, image_asset_id, status, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'published',$8)
       ON CONFLICT (slug) DO UPDATE SET tab_id=EXCLUDED.tab_id, label=EXCLUDED.label, title=EXCLUDED.title, description=EXCLUDED.description, icon_name=EXCLUDED.icon_name, image_asset_id=EXCLUDED.image_asset_id, status='published', sort_order=EXCLUDED.sort_order, updated_at=NOW()
       RETURNING id`,
      [slug, tabId, label, title, description, iconName, mediaIds.get(image), i],
    );
    await q("DELETE FROM cms_solution_capabilities WHERE solution_id = $1", [rows[0].id]);
    for (let j = 0; j < capabilities.length; j++) {
      await q("INSERT INTO cms_solution_capabilities (solution_id, title, description, sort_order) VALUES ($1,$2,$3,$4)", [rows[0].id, capabilities[j][0], capabilities[j][1], j]);
    }
  }

  for (let i = 0; i < portfolioProjects.length; i++) {
    const [slug, title, clientName, image] = portfolioProjects[i];
    await q(
      `INSERT INTO cms_portfolio_projects (slug, title, client_name, image_asset_id, status, sort_order)
       VALUES ($1,$2,$3,$4,'published',$5)
       ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, client_name=EXCLUDED.client_name, image_asset_id=EXCLUDED.image_asset_id, status='published', sort_order=EXCLUDED.sort_order, updated_at=NOW()`,
      [slug, title, clientName, mediaIds.get(image), i],
    );
  }

  for (let i = 1; i <= 98; i++) {
    await q(
      `INSERT INTO cms_clients (slug, name, logo_asset_id, status, sort_order)
       VALUES ($1,$2,$3,'published',$4)
       ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, logo_asset_id=EXCLUDED.logo_asset_id, status='published', sort_order=EXCLUDED.sort_order, updated_at=NOW()`,
      [`client-${i}`, `Client ${i}`, mediaIds.get(`client-logo-${i}`), i],
    );
  }

  await q("DELETE FROM cms_company_statements WHERE statement_type IN ('vision', 'mission')");
  for (let i = 0; i < companyStatements.length; i++) {
    const [type, title, description] = companyStatements[i];
    await q(
      `INSERT INTO cms_company_statements (statement_type, title, description, icon_name, status, sort_order)
       VALUES ($1,$2,$3,'RadioTower','published',$4)`,
      [type, title, description, i],
    );
  }

  for (let i = 0; i < companyValues.length; i++) {
    const [slug, title, description] = companyValues[i];
    await q(
      `INSERT INTO cms_company_values (slug, title, description, icon_name, status, sort_order)
       VALUES ($1,$2,$3,'RadioTower','published',$4)
       ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, icon_name=EXCLUDED.icon_name, status='published', sort_order=EXCLUDED.sort_order, updated_at=NOW()`,
      [slug, title, description, i],
    );
  }

  for (let i = 0; i < leaders.length; i++) {
    const [slug, name, role, image] = leaders[i];
    await q(
      `INSERT INTO cms_company_leaders (slug, name, role, image_asset_id, status, sort_order)
       VALUES ($1,$2,$3,$4,'published',$5)
       ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, role=EXCLUDED.role, image_asset_id=EXCLUDED.image_asset_id, status='published', sort_order=EXCLUDED.sort_order, updated_at=NOW()`,
      [slug, name, role, mediaIds.get(image), i],
    );
  }

  await q(
    `DELETE FROM cms_navigation_items
     WHERE menu_key = ANY($1::varchar[])`,
    [[...new Set(navigation.map((item) => item[0]))]],
  );
  for (const [menuKey, label, href, sortOrder] of navigation) {
    await q(
      `INSERT INTO cms_navigation_items (menu_key, label, href, status, sort_order)
       VALUES ($1,$2,$3,'published',$4)`,
      [menuKey, label, href, sortOrder],
    );
  }

  await q(
    `INSERT INTO cms_documents (slug, title, description, document_type, file_url, status, sort_order)
     VALUES ('company-profile', 'Company Profile', 'Full capabilities overview (PDF)', 'company_profile', '/resources/brosur', 'published', 1)
     ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, document_type=EXCLUDED.document_type, file_url=EXCLUDED.file_url, status='published', sort_order=EXCLUDED.sort_order, updated_at=NOW()`,
  );

  await q(
    `INSERT INTO cms_site_settings (key, value, description)
     VALUES ('company_profile_download', $1::jsonb, 'Download company profile CTA settings')
     ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value, description=EXCLUDED.description, updated_at=NOW()`,
    [JSON.stringify({ href: "/resources/brosur", requiresLeadForm: true })],
  );

  const summary = await q(`
    SELECT
      (SELECT count(*)::int FROM cms_products) AS products,
      (SELECT count(*)::int FROM cms_articles) AS articles,
      (SELECT count(*)::int FROM cms_industries) AS industries,
      (SELECT count(*)::int FROM cms_solutions) AS solutions,
      (SELECT count(*)::int FROM cms_portfolio_projects) AS portfolio,
      (SELECT count(*)::int FROM cms_clients) AS clients,
      (SELECT count(*)::int FROM cms_banners) AS banners,
      (SELECT count(*)::int FROM cms_metrics) AS metrics
  `);

  console.log("Seed completed:", summary.rows[0]);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
