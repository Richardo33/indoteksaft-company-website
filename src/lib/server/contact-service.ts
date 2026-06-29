import "server-only";

import type { ContactPayload } from "@/lib/contact-schema";
import { formatProjectRequirement } from "@/lib/server/contact-format";
import { saveContactSubmission } from "@/lib/server/contact-repository";
import { env } from "@/lib/server/env";
import { logger } from "@/lib/server/logger";

export async function deliverContact(
  payload: ContactPayload,
  requestId: string,
): Promise<void> {
  const formattedRequirement = formatProjectRequirement(payload.message);
  await saveContactSubmission({
    payload,
    requestId,
    formattedRequirement,
  });

  if (!env.CONTACT_WEBHOOK_URL) {
    logger.info("contact.accepted_dummy", {
      requestId,
      interest: payload.interest,
      hasPhone: Boolean(payload.phone),
    });
    return;
  }

  const response = await fetch(env.CONTACT_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(env.CONTACT_WEBHOOK_TOKEN
        ? { Authorization: `Bearer ${env.CONTACT_WEBHOOK_TOKEN}` }
        : {}),
    },
    body: JSON.stringify({
      ...payload,
      requestId,
      projectRequirement: {
        text: formattedRequirement.text,
        html: formattedRequirement.html,
        lines: formattedRequirement.lines,
      },
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    throw new Error(`Contact provider returned ${response.status}`);
  }
}
