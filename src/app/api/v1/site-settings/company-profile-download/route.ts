import { NextResponse } from "next/server";

import { getCompanyProfileDownloadSetting } from "@/sanity/settings";

export async function GET() {
  const setting = await getCompanyProfileDownloadSetting();

  return NextResponse.json(setting, {
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}
