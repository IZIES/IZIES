"use client";

import Link from "next/link";
import { ArrowRight, FlaskConical, Briefcase, Sparkles } from "lucide-react";
import { SectionExperience } from "./SectionExperience";

export function WorkAndProductsTeaserSection() {
  return (
    <section id="explore" className="iz-downstream-section iz-depth-6 relative z-10 py-24 px-6 overflow-hidden bg-black/40 border-t border-white/[0.05]">
      <SectionExperience variant="story" />
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-white/[0.03] text-slate-300 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Explore Our Footprint</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            See what we&apos;ve built.
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Whether it&apos;s our homegrown open-source products or tailored enterprise solutions for our clients, our work speaks for itself.
          </p>
        </div>

        {/* Two Teaser Cards */}
        <div className="grid md:grid-cols-2 gap-4 lg:gap-6 max-w-4xl mx-auto">
          
          {/* Products Teaser */}
          <Link href="/products" className="group relative flex items-center gap-5 rounded-2xl border border-indigo-500/20 bg-[#0A0D1A] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 p-4 sm:p-5">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-50" />
            
            <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <FlaskConical className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400" />
            </div>
            
            <div className="flex-1 min-w-0 space-y-1 relative z-10">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">IZIES Labs & Products</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed line-clamp-2">
                Discover the platforms, tools, and open-source projects we&apos;ve built in-house.
              </p>
            </div>

            <div className="relative z-10 shrink-0">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Client Work Teaser */}
          <Link href="/work" className="group relative flex items-center gap-5 rounded-2xl border border-cyan-500/20 bg-[#0A0D1A] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 p-4 sm:p-5">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.05] to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-50" />
            
            <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
            </div>
            
            <div className="flex-1 min-w-0 space-y-1 relative z-10">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Client Portfolio</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed line-clamp-2">
                Explore case studies and success stories of enterprise software we&apos;ve delivered.
              </p>
            </div>

            <div className="relative z-10 shrink-0">
              <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
