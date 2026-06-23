# Indoteksaft Company Website

Production-oriented corporate website for PT Indotek Buana Karya, built with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui foundations.

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality gates

```bash
npm run typecheck
npm run lint
npm run build
```

## Contact API

`POST /api/v1/contact` accepts JSON. Without `CONTACT_WEBHOOK_URL`, valid submissions are accepted in dummy mode and only privacy-safe metadata is logged. Configure the webhook variables to integrate email, CRM, or an API gateway-managed downstream service.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for rendering, security, API management, database safety, and future-maintenance notes.
