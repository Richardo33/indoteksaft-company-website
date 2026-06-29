import "server-only";

const unorderedListPattern = /^\s*(?:[-*•])\s+(.+)$/;
const orderedListPattern = /^\s*\d+[.)]\s+(.+)$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function closeList(currentList: "ul" | "ol" | null, html: string[]) {
  if (!currentList) {
    return null;
  }

  html.push(`</${currentList}>`);
  return null;
}

export type FormattedProjectRequirement = {
  text: string;
  html: string;
  lines: string[];
};

export function formatProjectRequirement(
  message: string,
): FormattedProjectRequirement {
  const normalizedText = message.replace(/\r\n?/g, "\n");
  const lines = normalizedText.split("\n");
  const html: string[] = [];
  let currentList: "ul" | "ol" | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      currentList = closeList(currentList, html);
      html.push("<br />");
      continue;
    }

    const unorderedMatch = line.match(unorderedListPattern);
    if (unorderedMatch) {
      if (currentList !== "ul") {
        currentList = closeList(currentList, html);
        html.push("<ul>");
        currentList = "ul";
      }

      html.push(`<li>${escapeHtml(unorderedMatch[1])}</li>`);
      continue;
    }

    const orderedMatch = line.match(orderedListPattern);
    if (orderedMatch) {
      if (currentList !== "ol") {
        currentList = closeList(currentList, html);
        html.push("<ol>");
        currentList = "ol";
      }

      html.push(`<li>${escapeHtml(orderedMatch[1])}</li>`);
      continue;
    }

    currentList = closeList(currentList, html);
    html.push(`<p>${escapeHtml(line)}</p>`);
  }

  closeList(currentList, html);

  return {
    text: normalizedText,
    html: html.join("\n"),
    lines,
  };
}
