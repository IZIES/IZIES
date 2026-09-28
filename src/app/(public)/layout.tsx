import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#070A11] text-foreground selection:bg-blue-500/20 selection:text-blue-300">
      <Navbar />
      <main className="flex-1 pt-16 sm:pt-20 relative z-10 flex flex-col">{children}</main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
