import "server-only";

import { draftMode } from "next/headers";

export async function getSanityFetchOptions(
  tags: string | string[],
  revalidate = 300,
) {
  const draft = await draftMode();

  if (draft.isEnabled) {
    return { cache: "no-store" as const };
  }

  return {
    next: {
      revalidate,
      tags: Array.isArray(tags) ? tags : [tags],
    },
  };
}
