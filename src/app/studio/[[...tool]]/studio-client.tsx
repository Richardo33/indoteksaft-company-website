"use client";

import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";

if (process.env.NODE_ENV === "development") {
  const originalConsoleError = console.error;

  console.error = (...args: unknown[]) => {
    const firstArg = args[0];
    const message =
      typeof firstArg === "string"
        ? firstArg
        : firstArg instanceof Error
          ? firstArg.message
          : "";

    if (message.includes("Failed to fetch version for package")) {
      return;
    }

    originalConsoleError(...args);
  };
}

export default function StudioClient() {
  return <NextStudio config={config} />;
}
