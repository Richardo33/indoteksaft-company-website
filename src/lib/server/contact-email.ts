import "server-only";

import { lookup } from "node:dns/promises";
import nodemailer from "nodemailer";

import type { ContactPayload } from "@/lib/contact-schema";
import type { FormattedProjectRequirement } from "@/lib/server/contact-format";
import { env } from "@/lib/server/env";

type SendContactEmailInput = {
  payload: ContactPayload;
  requestId: string;
  formattedRequirement: FormattedProjectRequirement;
};

function isEmailConfigured() {
  return Boolean(
    env.CONTACT_EMAIL_ENABLED &&
      env.SMTP_HOST &&
      env.SMTP_USER &&
      env.SMTP_PASSWORD &&
      env.SMTP_FROM &&
      env.SALES_NOTIFICATION_EMAIL,
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function labelLeadType(leadType: ContactPayload["leadType"]) {
  return {
    consultation: "Free Consultation",
    company_profile_download: "Company Profile Download",
    contact_sales: "Contact Sales",
    assessment_request: "Request Assessment",
    demo_request: "Request Demo",
    brochure_request: "Brochure Request",
    general_inquiry: "General Inquiry",
  }[leadType];
}

function leadTheme(leadType: ContactPayload["leadType"]) {
  return (
    {
      consultation: {
        accent: "#2563eb",
        accentDark: "#0d2f86",
        accentSoft: "#eff6ff",
        badgeText: "#1d4ed8",
        title: "New Consultation Request",
      },
      company_profile_download: {
        accent: "#0891b2",
        accentDark: "#155e75",
        accentSoft: "#ecfeff",
        badgeText: "#0e7490",
        title: "New Company Profile Download",
      },
      contact_sales: {
        accent: "#7c3aed",
        accentDark: "#4c1d95",
        accentSoft: "#f5f3ff",
        badgeText: "#6d28d9",
        title: "New Contact Sales Lead",
      },
      assessment_request: {
        accent: "#16a34a",
        accentDark: "#166534",
        accentSoft: "#f0fdf4",
        badgeText: "#15803d",
        title: "New Assessment Request",
      },
      demo_request: {
        accent: "#ea580c",
        accentDark: "#9a3412",
        accentSoft: "#fff7ed",
        badgeText: "#c2410c",
        title: "New Demo Request",
      },
      brochure_request: {
        accent: "#0284c7",
        accentDark: "#075985",
        accentSoft: "#f0f9ff",
        badgeText: "#0369a1",
        title: "New Brochure Request",
      },
      general_inquiry: {
        accent: "#475569",
        accentDark: "#1e293b",
        accentSoft: "#f8fafc",
        badgeText: "#334155",
        title: "New Website Inquiry",
      },
    } satisfies Record<
      ContactPayload["leadType"],
      {
        accent: string;
        accentDark: string;
        accentSoft: string;
        badgeText: string;
        title: string;
      }
    >
  )[leadType];
}

function buildPlainText({
  payload,
  requestId,
  formattedRequirement,
}: SendContactEmailInput) {
  return [
    `${leadTheme(payload.leadType).title} - ${payload.company}`,
    "",
    `Lead Type: ${labelLeadType(payload.leadType)}`,
    `Full Name: ${payload.name}`,
    `Company: ${payload.company}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "-"}`,
    `Position: ${payload.position || "-"}`,
    `Industry/Interest: ${payload.interest}`,
    "",
    "Project Requirement / Message:",
    formattedRequirement.text,
    "",
    `Request ID: ${requestId}`,
  ].join("\n");
}

function buildHtml({
  payload,
  requestId,
  formattedRequirement,
}: SendContactEmailInput) {
  const theme = leadTheme(payload.leadType);
  const rows = [
    ["Full Name", payload.name],
    ["Company", payload.company],
    ["Email", payload.email],
    ["Phone", payload.phone || "-"],
    ["Position", payload.position || "-"],
    ["Industry/Interest", payload.interest],
  ];

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#eef3f9;padding:28px 14px;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;margin:0 auto;">
      <tr>
        <td style="padding:0;">
          <div style="overflow:hidden;border-radius:22px;background:#ffffff;border:1px solid #dbe4f0;box-shadow:0 18px 55px rgba(15,23,42,.10);">
            <div style="padding:30px 34px;background:linear-gradient(135deg,${theme.accentDark} 0%,${theme.accent} 100%);color:#ffffff;">
              <div style="font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:rgba(255,255,255,.78);font-weight:700;">Indoteksaft Website</div>
              <h1 style="margin:12px 0 0;font-size:28px;line-height:1.18;letter-spacing:-0.03em;">${escapeHtml(theme.title)}</h1>
              <div style="margin-top:18px;display:inline-block;padding:7px 12px;border-radius:999px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.24);font-size:12px;font-weight:700;color:#ffffff;">
                ${escapeHtml(labelLeadType(payload.leadType))}
              </div>
            </div>

            <div style="padding:28px 34px 34px;">
              <div style="padding:18px 20px;border-radius:16px;background:${theme.accentSoft};border:1px solid rgba(15,23,42,.06);">
                <div style="font-size:12px;text-transform:uppercase;letter-spacing:.14em;font-weight:700;color:${theme.badgeText};">Lead Summary</div>
                <div style="margin-top:8px;font-size:20px;line-height:1.35;font-weight:800;color:#0f172a;">${escapeHtml(payload.name)}</div>
                <div style="margin-top:3px;font-size:14px;line-height:1.6;color:#475569;">${escapeHtml(payload.company)}${payload.position ? ` · ${escapeHtml(payload.position)}` : ""}</div>
              </div>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:22px;border-collapse:separate;border-spacing:0 10px;">
                ${rows
                  .map(
                    ([label, value]) => `
                      <tr>
                        <td style="width:155px;padding:12px 14px;background:#f8fafc;border-top-left-radius:12px;border-bottom-left-radius:12px;color:#64748b;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;">${escapeHtml(label)}</td>
                        <td style="padding:12px 14px;background:#f8fafc;border-top-right-radius:12px;border-bottom-right-radius:12px;font-size:14px;font-weight:700;color:#0f172a;">${
                          label === "Email"
                            ? `<a href="mailto:${escapeHtml(value)}" style="color:${theme.accent};text-decoration:none;">${escapeHtml(value)}</a>`
                            : escapeHtml(value)
                        }</td>
                      </tr>`,
                  )
                  .join("")}
              </table>

              <div style="margin-top:24px;">
                <div style="font-size:12px;text-transform:uppercase;letter-spacing:.14em;font-weight:800;color:#0f172a;">Message</div>
                <div style="margin-top:10px;padding:18px 20px;background:#ffffff;border:1px solid #dbe4f0;border-left:4px solid ${theme.accent};border-radius:14px;font-size:14px;line-height:1.75;color:#334155;">
                  ${formattedRequirement.html}
                </div>
              </div>

              <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:11px;line-height:1.6;color:#94a3b8;">
                Request ID: ${escapeHtml(requestId)}<br />
                Reply langsung ke email ini untuk menghubungi lead: ${escapeHtml(payload.email)}
              </div>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendContactEmailNotification(
  input: SendContactEmailInput,
) {
  if (!isEmailConfigured()) {
    return { skipped: true as const, reason: "email_not_configured" };
  }

  const smtpHostname = env.SMTP_HOST;
  const smtpHost =
    env.SMTP_FORCE_IPV4 && smtpHostname
      ? (await lookup(smtpHostname, { family: 4 })).address
      : smtpHostname;

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
    tls: smtpHostname
      ? {
          servername: smtpHostname,
        }
      : undefined,
  });

  const leadType = labelLeadType(input.payload.leadType);
  await transporter.sendMail({
    from: env.SMTP_FROM,
    to: env.SALES_NOTIFICATION_EMAIL,
    replyTo: input.payload.email,
    subject: `[Indoteksaft Website] ${leadType} - ${input.payload.company}`,
    text: buildPlainText(input),
    html: buildHtml(input),
  });

  return { skipped: false as const };
}
