"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, CheckCircle2, X } from "lucide-react";

export function WorkListClient({ projects, activeService }: { projects: any[], activeService?: any }) {
  const [visibleCount, setVisibleCount] = useState(6);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 4, projects.length));
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [projects.length]);

  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  return (
    <div className="space-y-12">
      {activeService && (
        <div className="flex justify-center pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-sm text-cyan-300 shadow-lg shadow-cyan-500/5">
            <span>Showing work for: <strong className="font-bold text-white">{activeService.title}</strong></span>
            <Link href="/work" className="p-1 hover:bg-cyan-500/20 rounded-full transition-colors ml-1" title="Clear filter">
              <X className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="py-24 text-center border border-white/5 rounded-3xl bg-white/[0.02]">
          <p className="text-slate-400 text-lg">Portfolio is currently being updated with our latest work.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project) => (
            <Link
              key={project.id}
              href={`/work/${project.id}`}
              className="group flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-[#0B0F19] p-4 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
            >
              {project.imageUrl && (
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden rounded-xl border border-white/[0.05]">
                  <Image
                    src={project.imageUrl}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1.5 h-full">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{project.industry}</span>
                  <span className="text-[10px] text-slate-500 truncate max-w-[80px]">{project.clientName}</span>
                </div>
                
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {project.isFeatured && <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline-block mr-1 mb-0.5" />}
                  {project.name}
                </h3>
                
                <div className="pt-1 mt-auto flex items-center gap-1.5 text-[10px] font-semibold text-cyan-500">
                  Read Story <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
          
          {hasMore && (
            <div ref={loadMoreRef} className="py-12 flex justify-center">
              <div className="inline-flex items-center gap-3 text-cyan-500/50">
                <div className="w-4 h-4 rounded-full border-2 border-cyan-500/50 border-t-cyan-400 animate-spin" />
                <span className="text-sm font-medium">Loading more work...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
