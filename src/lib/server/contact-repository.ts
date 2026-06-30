import "server-only";

import type { ContactPayload } from "@/lib/contact-schema";
import { getDbPool } from "@/lib/server/db";
import { env } from "@/lib/server/env";
import type { FormattedProjectRequirement } from "@/lib/server/contact-format";
import { logger } from "@/lib/server/logger";

type SaveContactSubmissionInput = {
  payload: ContactPayload;
  requestId: string;
  formattedRequirement: FormattedProjectRequirement;
};

export async function saveContactSubmission({
  payload,
  requestId,
  formattedRequirement,
}: SaveContactSubmissionInput) {
  if (!env.CONTACT_DATABASE_ENABLED) {
    return;
  }

  const pool = await getDbPool();
  await pool.query(
    `
      INSERT INTO contact_submissions (
        request_id,
        full_name,
        company_name,
        position,
        email,
        phone,
        interest,
        lead_type,
        message_text,
        message_html,
        message_lines,
        source
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12)
    `,
    [
      requestId,
      payload.name,
      payload.company,
      payload.position ?? null,
      payload.email,
      payload.phone ?? null,
      payload.interest,
      payload.leadType,
      formattedRequirement.text,
      formattedRequirement.html,
      JSON.stringify(formattedRequirement.lines),
      payload.leadType === "company_profile_download"
        ? "company_profile_download_form"
        : "website_contact_form",
    ],
  );

  logger.info("contact.saved_to_database", {
    requestId,
    interest: payload.interest,
    leadType: payload.leadType,
  });
}
