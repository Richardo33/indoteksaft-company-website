"use client";

export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="id">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: "24px",
            background: "#050b18",
            color: "#fff",
            fontFamily: "sans-serif",
            textAlign: "center",
          }}
        >
          <div>
            <h1>Website sedang mengalami gangguan.</h1>
            <p>Silakan muat ulang halaman atau coba kembali beberapa saat lagi.</p>
            <button type="button" onClick={unstable_retry}>
              Muat ulang
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
