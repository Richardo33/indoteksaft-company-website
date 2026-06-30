# Sanity CMS Setup

> Status saat ini: integrasi Sanity Studio sedang diparkir dulu untuk menjaga deployment audit-clean di Next.js 16. Route `/studio` tetap disiapkan sebagai placeholder, tetapi package `sanity` / `next-sanity` belum aktif di dependency production. Dokumen ini tetap disimpan sebagai rencana fase CMS berikutnya.

CMS yang dipakai adalah Sanity Studio embedded di Next.js route:

```text
/studio
```

Sanity tidak memakai PostgreSQL sebagai database utama. Sanity menyimpan konten di Sanity Content Lake. Untuk kebutuhan project ini, konten dari Sanity bisa disinkronkan ke PostgreSQL lokal lewat webhook:

```text
POST /api/v1/sanity/sync
```

## Environment

Isi `.env` lokal:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_SYNC_SECRET=change-this-to-a-long-random-secret

CONTACT_DATABASE_ENABLED=true
DB_HOST=localhost
DB_PORT=5432
DB_NAME=indoteksaft_company
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_SSLMODE=disable
```

## Membuat Sanity project

Kalau belum punya Sanity project:

```bash
npx sanity@latest init
```

Pilih atau buat project baru, lalu salin `projectId` dan `dataset` ke `.env`.

Jalankan website:

```bash
npm run dev
```

Buka:

```text
http://localhost:3000/studio
```

## Content types yang sudah disiapkan

- Pages
- Banners
- Products
- Article Categories
- Articles
- Portfolio Projects
- Clients / Partners
- Industries
- Solutions
- Events
- Documents / Brochures
- Site Settings

## Sync Sanity ke PostgreSQL

Buat webhook di Sanity dashboard dengan konfigurasi:

- Method: `POST`
- URL local testing: gunakan tunnel seperti ngrok/Cloudflare Tunnel ke:

```text
https://your-public-url/api/v1/sanity/sync
```

- HTTP header:

```text
Authorization: Bearer <SANITY_SYNC_SECRET>
```

atau:

```text
x-sanity-sync-secret: <SANITY_SYNC_SECRET>
```

Sanity docs menyarankan document webhooks untuk payload dokumen yang fleksibel. Header tambahan seperti `Authorization: Bearer <token>` juga didukung pada webhook Sanity.

## Dataset sync behavior

Endpoint sync saat ini melakukan upsert ke PostgreSQL untuk:

- `product` → `cms_products`, `cms_product_points`
- `article` → `cms_articles`, `cms_article_sections`
- `solution` → `cms_solutions`, `cms_solution_capabilities`
- `banner` → `cms_banners`
- `portfolioProject` → `cms_portfolio_projects`
- `client` → `cms_clients`
- `industry` → `cms_industries`
- `event` → `cms_events`
- `documentResource` → `cms_documents`

Saat ini website frontend masih membaca data dari `src/config/*`. Tahap berikutnya adalah mengubah page loader supaya membaca dari PostgreSQL atau langsung dari Sanity.
