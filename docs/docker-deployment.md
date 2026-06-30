# Docker Deployment

Project ini memakai pola database seperti project MDM: PostgreSQL self-hosted lewat Docker dan konfigurasi database berbasis environment variable.

## Stack

- `website`: Next.js standalone production server
- `postgres`: PostgreSQL container
- `docker/db/init/001_contact_submissions.sql`: schema PostgreSQL untuk form leads dan fondasi konten dinamis website

## Local run

```bash
cp .env.example .env
docker compose up -d --build
```

Website berjalan di `http://localhost:3000`.

## Environment penting

- `CONTACT_DATABASE_ENABLED=true`
- `DB_HOST=postgres` untuk Docker Compose
- `DB_PORT=5432`
- `DB_NAME=indoteksaft_company`
- `DB_USER=indoteksaft`
- `DB_PASSWORD=<strong-password>`
- `DB_SSLMODE=disable` untuk koneksi internal Docker

Untuk production, ubah `SITE_URL`, `CONTACT_ALLOWED_ORIGIN`, dan `DB_PASSWORD`.

## Data yang disimpan

Setiap submit form contact/free consultation/download company profile akan masuk ke tabel `contact_submissions`.

Kolom utama:

- `request_id`
- `full_name`
- `company_name`
- `position`
- `email`
- `phone`
- `interest`
- `lead_type`
- `message_text`
- `message_html`
- `message_lines`
- `source`
- `created_at`

`lead_type` membedakan kebutuhan sales, misalnya:

- `consultation`
- `company_profile_download`
- `contact_sales`
- `assessment_request`
- `demo_request`
- `brochure_request`

Schema juga menyiapkan tabel `cms_*` untuk konten yang nantinya bisa dikelola dari CMS/admin:

- hero/banner dan rotating hero words
- metrics homepage
- service/solution cards landing page
- products dan detail product
- product features/benefits
- articles/blog/category/content sections
- solutions dan core capabilities
- industries dan industry expertise cards
- portfolio projects
- client/partner logos
- company vision/mission/core values/leadership
- documents/brochures/events/navigation/settings

Query insert memakai parameterized SQL melalui package `pg`, jadi input user tidak dirangkai langsung ke SQL string.
