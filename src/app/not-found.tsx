import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#04060A] text-slate-100 flex flex-col items-center justify-center px-6 text-center gap-6">
      <p className="text-indigo-300 font-mono">404</p>
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p className="text-slate-400 max-w-md">This page is not available. Explore IZIES services or return to the homepage.</p>
      <div className="flex gap-6">
        <Link href="/" className="text-indigo-300 hover:text-white">IZIES home</Link>
        <Link href="/services" className="text-indigo-300 hover:text-white">Explore our services</Link>
      </div>
    </main>
  );
}
