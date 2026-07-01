import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function safeRedirectPath(value: string | null) {
  if (!value) return "/";

  try {
    const url = new URL(value, "http://localhost");
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const redirectTo = safeRedirectPath(
    request.nextUrl.searchParams.get("redirect") ??
      request.nextUrl.searchParams.get("redirectTo") ??
      request.nextUrl.searchParams.get("preview"),
  );

  if (
    process.env.NODE_ENV === "production" &&
    process.env.SANITY_PREVIEW_SECRET &&
    secret !== process.env.SANITY_PREVIEW_SECRET
  ) {
    return NextResponse.json({ message: "Invalid preview secret" }, { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(new URL(redirectTo, request.url));
}
