# Architecture

## Rendering

- Pages, layout, navigation shell, and content sections are React Server Components.
- Client boundaries are intentionally limited to mobile navigation, industry tabs, and the contact form.
- The contact form is loaded with `next/dynamic` so its validation and form libraries do not block the initial page bundle.
- Static company content lives in `src/config/company.ts` and is validated at compile time with `satisfies CompanyConfig`.

## API and gateway readiness

- Public application API is versioned under `/api/v1`.
- `/api/v1/contact` returns a stable JSON envelope with `ok`, `requestId`, and `message`.
- The endpoint enforces JSON content type, request size, same-origin policy, schema validation, honeypot protection, structured logs, and rate limits.
- For a multi-instance/serverless production deployment, enforce a second limit at the API gateway and replace the in-memory limiter with Redis, Upstash, or the platform's distributed rate-limit service.
- The API gateway should terminate TLS, add WAF/bot controls, cap request bodies, and propagate `x-request-id`/forwarded IP headers.

## Security model

- React rendering is used for user-visible content; raw user HTML is never rendered.
- Inputs are allow-listed, length-bounded, normalized, and validated on the server.
- No database is connected. When persistence is added, use a typed repository and parameterized ORM/query APIs. Never construct SQL with string interpolation.
- Secrets remain in server-only modules and unprefixed environment variables.
- Security headers are configured in `next.config.ts`, including CSP, frame denial, MIME sniffing protection, permissions policy, and referrer policy.
- Contact logs intentionally exclude names, email addresses, phone numbers, and message bodies.

## Future maintenance

- Replace dummy content through the typed company config or introduce a CMS adapter behind the same types.
- Replace `deliverContact` with an email/CRM provider without changing the client contract.
- Add unit tests for schemas/services and an end-to-end contact test before connecting a real provider.
- Review CSP whenever third-party analytics, maps, fonts, or CRM scripts are introduced.
