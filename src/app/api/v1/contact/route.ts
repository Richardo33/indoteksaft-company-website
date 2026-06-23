import { NextRequest, NextResponse } from "next/server";

import { contactSchema, type ContactApiResponse } from "@/lib/contact-schema";
import { deliverContact } from "@/lib/server/contact-service";
import { env } from "@/lib/server/env";
import { logger } from "@/lib/server/logger";
import { checkRateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16_384;

function json(body: ContactApiResponse, status: number, headers?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}

function getClientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return (forwarded || realIp || "anonymous").slice(0, 64);
}

function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  const expectedOrigin = env.CONTACT_ALLOWED_ORIGIN ?? new URL(env.SITE_URL).origin;
  return origin === expectedOrigin;
}

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  if (!isAllowedOrigin(request)) {
    logger.warn("contact.origin_rejected", { requestId });
    return json(
      { ok: false, requestId, message: "Origin request tidak diizinkan." },
      403,
    );
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return json(
      { ok: false, requestId, message: "Content-Type harus application/json." },
      415,
    );
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return json(
      { ok: false, requestId, message: "Payload terlalu besar." },
      413,
    );
  }

  const rateLimit = checkRateLimit(`contact:${getClientKey(request)}`);
  const rateHeaders = {
    "X-RateLimit-Limit": String(rateLimit.limit),
    "X-RateLimit-Remaining": String(rateLimit.remaining),
    "Retry-After": String(rateLimit.retryAfterSeconds),
  };

  if (!rateLimit.allowed) {
    logger.warn("contact.rate_limited", { requestId });
    return json(
      {
        ok: false,
        requestId,
        message: "Terlalu banyak permintaan. Silakan coba kembali sebentar lagi.",
      },
      429,
      rateHeaders,
    );
  }

  try {
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
      return json(
        { ok: false, requestId, message: "Payload terlalu besar." },
        413,
        rateHeaders,
      );
    }

    let unknownPayload: unknown;
    try {
      unknownPayload = JSON.parse(rawBody);
    } catch {
      return json(
        { ok: false, requestId, message: "Payload JSON tidak valid." },
        400,
        rateHeaders,
      );
    }

    const parsed = contactSchema.safeParse(unknownPayload);
    if (!parsed.success) {
      return json(
        {
          ok: false,
          requestId,
          message: "Mohon periksa kembali data yang dikirim.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        422,
        rateHeaders,
      );
    }

    if (parsed.data.website) {
      logger.warn("contact.honeypot_triggered", { requestId });
      return json(
        {
          ok: true,
          requestId,
          message: "Terima kasih. Pesan Anda telah kami terima.",
        },
        202,
        rateHeaders,
      );
    }

    await deliverContact(parsed.data, requestId);
    logger.info("contact.delivered", {
      requestId,
      interest: parsed.data.interest,
    });

    return json(
      {
        ok: true,
        requestId,
        message: "Terima kasih. Tim kami akan menghubungi Anda segera.",
      },
      202,
      rateHeaders,
    );
  } catch (error) {
    logger.error("contact.delivery_failed", {
      requestId,
      error: error instanceof Error ? error.message : "unknown_error",
    });

    return json(
      {
        ok: false,
        requestId,
        message: "Layanan sedang mengalami gangguan. Silakan coba kembali.",
      },
      500,
      rateHeaders,
    );
  }
}
