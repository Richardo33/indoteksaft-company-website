"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("page_render_error", {
      digest: error.digest,
      message: error.message,
    });
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-[#050b18] px-5 text-center text-white">
      <div className="max-w-lg">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">
          System interruption
        </p>
        <h1 className="mt-4 text-4xl font-bold">Something went wrong.</h1>
        <p className="mt-4 leading-7 text-slate-400">
          Kami tidak dapat memuat halaman ini. Silakan coba kembali tanpa
          meninggalkan sesi Anda.
        </p>
        <button
          type="button"
          onClick={unstable_retry}
          className="mt-8 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
