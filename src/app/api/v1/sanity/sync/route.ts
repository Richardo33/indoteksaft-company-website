import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/server/env";
import { logger } from "@/lib/server/logger";
import { syncSanityDocument } from "@/lib/server/sanity-sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 256_000;

function unauthorized() {
  return NextResponse.json(
    { ok: false, message: "Unauthorized" },
    { status: 401, headers: { "Cache-Control": "no-store" } },
  );
}

function isAuthorized(request: NextRequest) {
  if (!env.SANITY_SYNC_SECRET) {
    return false;
  }

  const authorization = request.headers.get("authorization");
  const syncSecret = request.headers.get("x-sanity-sync-secret");

  return (
    authorization === `Bearer ${env.SANITY_SYNC_SECRET}` ||
    syncSecret === env.SANITY_SYNC_SECRET
  );
}

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  if (!isAuthorized(request)) {
    logger.warn("sanity_sync.unauthorized", { requestId });
    return unauthorized();
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, requestId, message: "Payload terlalu besar." },
      { status: 413, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
      return NextResponse.json(
        { ok: false, requestId, message: "Payload terlalu besar." },
        { status: 413, headers: { "Cache-Control": "no-store" } },
      );
    }

    const document = JSON.parse(rawBody) as Record<string, unknown>;
    await syncSanityDocument(document);

    logger.info("sanity_sync.completed", {
      requestId,
      type: typeof document._type === "string" ? document._type : "unknown",
      sanityId: typeof document._id === "string" ? document._id : "unknown",
    });

    return NextResponse.json(
      { ok: true, requestId },
      { status: 202, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    logger.error("sanity_sync.failed", {
      requestId,
      error: error instanceof Error ? error.message : "unknown_error",
    });

    return NextResponse.json(
      { ok: false, requestId, message: "Sanity sync failed." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
