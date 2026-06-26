export type Article = {
  readonly slug: string;
  readonly category: string;
  readonly readTime: string;
  readonly title: string;
  readonly excerpt: string;
  readonly date: string;
  readonly image: string;
  readonly content: readonly {
    readonly heading: string;
    readonly body: readonly string[];
  }[];
};

export const articlePages = [
  [
    {
      slug: "transformasi-digital-web-development",
      category: "Software Development",
      readTime: "5 min read",
      title:
        "Transformasi Digital: Mengapa Web Development Adalah Infrastruktur Utama Bisnis, Bukan Sekadar Etalase",
      excerpt:
        "Website modern bukan lagi sekadar etalase digital. Ia menjadi fondasi operasional, akuisisi, integrasi, dan kredibilitas bisnis.",
      date: "April 19, 2026",
      image: "/images/industry-enterprise.png",
      content: [
        {
          heading: "Web sebagai fondasi operasional digital",
          body: [
            "Dalam lanskap bisnis modern, website perusahaan memiliki peran yang jauh lebih strategis dibanding sekadar profil online. Website dapat menjadi pintu masuk layanan, pusat edukasi pelanggan, kanal lead generation, dan titik integrasi berbagai sistem internal.",
            "Ketika dirancang dengan baik, web development membantu organisasi membangun pengalaman digital yang konsisten, aman, mudah diperluas, dan siap mendukung pertumbuhan jangka panjang.",
          ],
        },
        {
          heading: "Apa yang perlu diperhatikan",
          body: [
            "Perusahaan perlu memperhatikan performa, keamanan, struktur konten, SEO, aksesibilitas, dan kesiapan integrasi sejak awal. Tanpa fondasi ini, website akan cepat menjadi beban teknis yang sulit dirawat.",
            "Pendekatan yang lebih matang adalah memperlakukan website sebagai produk digital yang terus berkembang, bukan proyek satu kali selesai.",
          ],
        },
      ],
    },
    {
      slug: "secure-cloud-infrastructure",
      category: "Cloud Infrastructure",
      readTime: "4 min read",
      title:
        "Membangun Infrastruktur Cloud yang Aman, Terukur, dan Siap Menopang Operasional Enterprise",
      excerpt:
        "Cloud enterprise membutuhkan desain governance, security, dan observability yang matang agar tetap aman sekaligus scalable.",
      date: "April 22, 2026",
      image: "/images/industry-government.png",
      content: [
        {
          heading: "Cloud bukan sekadar migrasi server",
          body: [
            "Adopsi cloud yang berhasil dimulai dari desain arsitektur, bukan hanya memindahkan workload. Organisasi perlu memahami pola akses, kebutuhan keamanan, dependensi aplikasi, dan model operasional yang akan berjalan setelah migrasi.",
            "Dengan pendekatan yang tepat, cloud dapat mempercepat delivery, meningkatkan resiliensi, dan memberikan kontrol biaya yang lebih baik.",
          ],
        },
        {
          heading: "Kunci cloud enterprise",
          body: [
            "Beberapa aspek penting mencakup identity management, segmentasi jaringan, enkripsi data, monitoring biaya, backup, disaster recovery, serta kebijakan akses yang mudah diaudit.",
          ],
        },
      ],
    },
    {
      slug: "noc-monitoring-proaktif",
      category: "Managed Services",
      readTime: "6 min read",
      title:
        "Peran NOC dan Monitoring Proaktif dalam Menjaga Ketersediaan Layanan Digital Kritis",
      excerpt:
        "NOC membantu organisasi mendeteksi gangguan lebih awal, mempercepat respons, dan menjaga layanan tetap tersedia.",
      date: "April 27, 2026",
      image: "/images/industry-telecom.png",
      content: [
        {
          heading: "Monitoring yang bergerak sebelum masalah membesar",
          body: [
            "Network Operations Center memberikan visibilitas terpusat terhadap infrastruktur, aplikasi, dan jaringan. Dengan monitoring proaktif, tim operasional dapat melihat gejala penurunan performa sebelum berubah menjadi gangguan besar.",
            "NOC yang efektif menggabungkan dashboard, alert prioritas, SOP respons, dan pelaporan SLA untuk memastikan insiden ditangani secara konsisten.",
          ],
        },
        {
          heading: "Dampak terhadap bisnis",
          body: [
            "Ketersediaan layanan digital yang lebih stabil berdampak langsung pada pengalaman pelanggan, produktivitas internal, dan kepercayaan stakeholder.",
          ],
        },
      ],
    },
  ],
  [
    {
      slug: "cyber-resilience-modern",
      category: "Cybersecurity",
      readTime: "5 min read",
      title:
        "Cyber Resilience: Strategi Melindungi Data, Aplikasi, dan Infrastruktur dari Risiko Modern",
      excerpt:
        "Ketahanan siber perlu dibangun lewat kombinasi architecture, governance, monitoring, dan kesiapan respons.",
      date: "May 03, 2026",
      image: "/images/industry-defense.png",
      content: [
        {
          heading: "Resilience lebih luas dari prevention",
          body: [
            "Keamanan modern tidak cukup hanya mencegah serangan. Organisasi juga perlu mampu mendeteksi, merespons, memulihkan, dan belajar dari setiap insiden.",
            "Cyber resilience menggabungkan teknologi, proses, dan kesiapan organisasi agar dampak gangguan dapat ditekan seminimal mungkin.",
          ],
        },
        {
          heading: "Area prioritas",
          body: [
            "Prioritas umum meliputi hardening sistem, identity protection, endpoint security, backup strategy, monitoring ancaman, dan tabletop exercise untuk respons insiden.",
          ],
        },
      ],
    },
    {
      slug: "ai-operations-enterprise",
      category: "AI Operations",
      readTime: "7 min read",
      title:
        "Mengoptimalkan Operasional TI dengan AI untuk Deteksi Dini, Analisis, dan Automasi",
      excerpt:
        "AI operations membantu tim TI memahami pola insiden, mengurangi noise alert, dan mempercepat keputusan operasional.",
      date: "May 09, 2026",
      image: "/images/industry-healthcare.png",
      content: [
        {
          heading: "Dari alert menjadi insight",
          body: [
            "AI dapat membantu mengolah data operasional dalam volume besar, menemukan anomali, dan memberikan prioritas terhadap insiden yang paling berdampak.",
            "Dengan pemodelan yang tepat, AI operations dapat mengurangi beban manual dan membantu tim fokus pada tindakan yang benar-benar penting.",
          ],
        },
        {
          heading: "Automasi yang tetap terkendali",
          body: [
            "Automasi perlu dirancang bertahap dengan guardrail yang jelas. Mulai dari rekomendasi, semi-automation, hingga full automation untuk skenario yang matang dan rendah risiko.",
          ],
        },
      ],
    },
    {
      slug: "enterprise-network-foundation",
      category: "Telecommunication",
      readTime: "4 min read",
      title:
        "Fondasi Konektivitas Enterprise: Network Design yang Stabil untuk Pertumbuhan Bisnis",
      excerpt:
        "Desain network yang kuat menjadi fondasi stabilitas aplikasi, keamanan akses, dan ekspansi bisnis lintas lokasi.",
      date: "May 14, 2026",
      image: "/images/industry-education.png",
      content: [
        {
          heading: "Network sebagai tulang punggung digital",
          body: [
            "Konektivitas enterprise menentukan kualitas akses terhadap aplikasi, data, cloud, dan layanan digital. Desain network yang kurang matang sering menjadi sumber bottleneck dan risiko keamanan.",
            "Fondasi yang baik mencakup segmentasi, redundancy, monitoring, capacity planning, dan dokumentasi arsitektur yang jelas.",
          ],
        },
        {
          heading: "Siap untuk pertumbuhan",
          body: [
            "Network design perlu mempertimbangkan pertumbuhan lokasi, peningkatan trafik, integrasi cloud, serta kebutuhan zero-trust access di masa depan.",
          ],
        },
      ],
    },
  ],
] as const satisfies readonly (readonly Article[])[];

export const articles: readonly Article[] = articlePages.flat();
