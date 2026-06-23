import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#050b18] px-5 text-center text-white">
      <div>
        <p className="text-7xl font-black text-blue-500">404</p>
        <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
        <p className="mt-3 text-slate-400">Halaman yang Anda cari tidak tersedia.</p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Back to home
        </Link>
      </div>
    </main>
  );
}
