# Docker Deployment

Project ini memakai pola database seperti project MDM: PostgreSQL self-hosted lewat Docker dan konfigurasi database berbasis environment variable.

## Stack

- `website`: Next.js standalone production server
- `postgres`: PostgreSQL container
- `docker/db/init/001_contact_submissions.sql`: schema awal untuk menyimpan form contact

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

Setiap submit form contact akan masuk ke tabel `contact_submissions`.

Kolom utama:

- `request_id`
- `full_name`
- `company_name`
- `position`
- `email`
- `phone`
- `interest`
- `message_text`
- `message_html`
- `message_lines`
- `created_at`

Query insert memakai parameterized SQL melalui package `pg`, jadi input user tidak dirangkai langsung ke SQL string.
