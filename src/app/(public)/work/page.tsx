import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, Star, CheckCircle2, X } from "lucide-react";
import { capabilityContent } from "@/lib/capabilities";
import { WorkListClient } from "@/components/public/work/WorkListClient";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { BUSINESS_DESCRIPTION, businessMetadata, serviceCatalog, jsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = businessMetadata(
  "Client Portfolio & Case Studies",
  "Explore the enterprise software, digital platforms, and tailored solutions we've delivered for our clients across various industries.",
  "/work"
);

export default async function WorkPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  let projects = await prisma.clientProject.findMany({
    where: { isPublic: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  const serviceSlug = searchParams?.service as string;
  let activeService: any = null;
  if (serviceSlug) {
    activeService = Object.values(capabilityContent).find(c => c.slug === serviceSlug);
    if (activeService) {
      projects = projects.filter(p => 
        p.services && p.services.some(s => s.toLowerCase() === activeService.title.toLowerCase() || activeService.title.toLowerCase().includes(s.toLowerCase()))
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#04060A] text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(serviceCatalog("/work")) }} />
      <Navbar />

      <div className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.15),transparent_50%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-16">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span>Client Portfolio</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Our Success Stories.
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed mb-6">
              Explore the digital transformations, scalable platforms, and innovative solutions we&apos;ve engineered for our clients.
            </p>
          </div>
          <WorkListClient projects={projects} activeService={activeService} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
