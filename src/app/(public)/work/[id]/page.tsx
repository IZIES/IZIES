import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Calendar, Tag, CheckCircle2, Layout, Zap, Cpu } from "lucide-react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { businessMetadata } from "@/lib/seo";
import { capabilityContent } from "@/lib/capabilities";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const project = await prisma.clientProject.findUnique({ where: { id: params.id } });
  if (!project) return businessMetadata("Project Not Found", "The requested project does not exist.", "/work");
  
  return businessMetadata(
    `${project.name} | IZIES Work`,
    project.description,
    `/work/${project.id}`
  );
}

export default async function WorkDetailsPage({ params }: { params: { id: string } }) {
  const project = await prisma.clientProject.findUnique({
    where: { id: params.id }
  });

  if (!project || !project.isPublic) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#04060A] text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-300">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.1),transparent_70%)] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10 space-y-8">
          <Link href="/work" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Link>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
                {project.industry}
              </span>
              <span className="text-xs font-semibold text-slate-400 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                Client: {project.clientName}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
              {project.name}
            </h1>
            
            <p className="text-xl text-slate-300 leading-relaxed max-w-3xl">
              {project.description}
            </p>

            {project.websiteUrl && (
              <div className="pt-4">
                <a 
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/25 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 flex items-center gap-2">View Live Project <ExternalLink className="w-5 h-5 group-hover:-mt-1 group-hover:translate-x-1 transition-all" /></span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 pb-32">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-16">
            
            {project.imageUrl && (
              <div className="rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative aspect-[16/9]">
                <Image src={project.imageUrl} alt={project.name} fill className="object-cover" />
              </div>
            )}

            <div className="space-y-12">
              {project.challenge && (
                <section className="space-y-4">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Layout className="w-6 h-6 text-rose-400" /> The Challenge
                  </h3>
                  <div className="prose prose-invert prose-lg text-slate-400 leading-relaxed">
                    <p>{project.challenge}</p>
                  </div>
                </section>
              )}

              {project.solution && (
                <section className="space-y-4">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Zap className="w-6 h-6 text-amber-400" /> Our Solution
                  </h3>
                  <div className="prose prose-invert prose-lg text-slate-400 leading-relaxed">
                    <p>{project.solution}</p>
                  </div>
                </section>
              )}

              {project.result && (
                <section className="space-y-4">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" /> The Result
                  </h3>
                  <div className="prose prose-invert prose-lg text-slate-400 leading-relaxed p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                    <p>{project.result}</p>
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-8 sticky top-32">
            
            {/* Tech Stack */}
            {project.techStack && project.techStack.length > 0 && (
              <div className="p-8 rounded-3xl bg-[#0B0F19] border border-white/[0.05] space-y-6">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-400" /> Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map(tech => (
                    <span key={tech} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 text-sm font-semibold border border-indigo-500/20">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Services Provided */}
            {project.services && project.services.length > 0 && (
              <div className="p-8 rounded-3xl bg-[#0B0F19] border border-white/[0.05] space-y-6">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-purple-400" /> Services Provided
                </h4>
                <ul className="space-y-3">
                  {project.services.map(service => {
                    // Map the string service to a capability slug if possible
                    const matchedCapability = Object.values(capabilityContent).find(c => 
                      c.title.toLowerCase() === service.toLowerCase() || 
                      c.title.toLowerCase().includes(service.toLowerCase())
                    );

                    return matchedCapability ? (
                      <li key={service}>
                        <Link href={`/services/${matchedCapability.slug}`} className="group flex items-start gap-2 text-sm text-slate-300 hover:text-purple-300 transition-colors">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400/50 group-hover:bg-purple-400 mt-1.5 shrink-0 transition-colors" />
                          <span className="border-b border-transparent group-hover:border-purple-300/30 pb-0.5">{service}</span>
                        </Link>
                      </li>
                    ) : (
                      <li key={service} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0" />
                        {service}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Timeline */}
            {(project.startDate || project.endDate) && (
              <div className="p-8 rounded-3xl bg-[#0B0F19] border border-white/[0.05] space-y-6">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-slate-400" /> Project Timeline
                </h4>
                <div className="space-y-2 text-sm text-slate-300">
                  {project.startDate && (
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-500">Started</span>
                      <span className="font-semibold">{new Date(project.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                    </div>
                  )}
                  {project.endDate && (
                    <div className="flex justify-between pt-2">
                      <span className="text-slate-500">Completed</span>
                      <span className="font-semibold">{new Date(project.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
