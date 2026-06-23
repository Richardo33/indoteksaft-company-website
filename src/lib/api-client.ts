import type { ContactApiResponse, ContactInput } from "@/lib/contact-schema";

const CONTACT_ENDPOINT = "/api/v1/contact";

export async function submitContact(
  payload: ContactInput,
  signal?: AbortSignal,
): Promise<ContactApiResponse> {
  const response = await fetch(CONTACT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    signal,
  });

  const result = (await response.json()) as ContactApiResponse;

  if (!response.ok && result.ok) {
    throw new Error("Invalid API response");
  }

  return result;
}
