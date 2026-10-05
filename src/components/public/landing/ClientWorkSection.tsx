"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ExternalLink, Briefcase, ChevronRight, CheckCircle2 } from "lucide-react";
import { SectionExperience } from "./SectionExperience";

type ClientProject = {
  id: string;
  name: string;
  clientName: string;
  industry: string;
  description: string;
  techStack: string[];
  imageUrl: string | null;
  websiteUrl: string | null;
  isFeatured: boolean;
};

export function ClientWorkSection() {
  const [projects, setProjects] = useState<ClientProject[]>([]);

  useEffect(() => {
    fetch("/api/client-projects")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setProjects(d.projects);
      })
      .catch(() => { });
  }, []);

  if (projects.length === 0) return null; // Don't render section if there are no client projects

  return (
    <section id="work" className="iz-downstream-section iz-depth-6 relative z-10 py-24 px-6 overflow-hidden bg-black/40 border-t border-white/[0.05]">
      <SectionExperience variant="products" />
      <div className="max-w-6xl mx-auto space-y-12 relative z-10">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
            <span>Client Work</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Our Portfolio.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Explore the tailored digital solutions and platforms we&apos;ve built for our clients.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative flex flex-col rounded-3xl border border-white/[0.08] bg-[#0A0D1A] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-900/20 p-8 space-y-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-transparent pointer-events-none" />

              {project.imageUrl && (
                <div className="relative h-48 -mx-8 -mt-8 mb-6 overflow-hidden rounded-t-[22px] border-b border-white/[0.05]">
                  <Image
                    src={project.imageUrl}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D1A] to-transparent" />
                </div>
              )}

              <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{project.name}</h3>
                    <p className="text-sm font-semibold text-cyan-400 mt-1">{project.clientName} • {project.industry}</p>
                  </div>
                  {project.isFeatured && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0">
                      ★ Featured
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-400 leading-relaxed">
                  {project.description}
                </p>

                {project.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-400">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative z-10 pt-4 mt-auto border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Successfully Delivered
                </div>
                {project.websiteUrl && (
                  <a
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group/link"
                  >
                    View Project
                    <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
