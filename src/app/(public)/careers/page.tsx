"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Cpu,
  Layers,
  Globe,
  Zap,
  CheckCircle2,
  Users,
  Terminal,
  Laptop,
  Heart,
  Plane,
  BookOpen,
  Coffee,
  Coins,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/public/JobCard";
import dynamic from "next/dynamic";
const InAppApplyModal = dynamic(
  () => import("@/components/public/InAppApplyModal").then((mod) => mod.InAppApplyModal),
  { ssr: false }
);
import { JobSummary } from "@/types";

import { HeroSystemsCanvas } from "@/components/public/landing/HeroSystemsCanvas";

export default function CareersHubPage() {
  const [featuredJobs, setFeaturedJobs] = useState<JobSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobSummary | null>(null);
  const [showBackground, setShowBackground] = useState(false);

  useEffect(() => {
    // Delay canvas render slightly to prioritize LCP
    const timer = setTimeout(() => setShowBackground(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFeaturedJobs(data.jobs.slice(0, 6));
        }
      })
      .catch((err) => console.error("Failed to load jobs:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative overflow-hidden bg-[#06080F]">
      {/* Background Grid & Canvas matching Homepage */}
      <div className="absolute inset-0 -z-20 bg-grid-pattern opacity-[0.075] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
      
      {showBackground && (
        <div className="pointer-events-none absolute inset-x-[-8%] top-0 bottom-[10%] -z-10 overflow-hidden">
          <HeroSystemsCanvas />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,8,15,0.4),rgba(6,8,15,0.85)_60%,rgba(6,8,15,1)_100%)]" />
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-slate-300 text-xs font-bold tracking-widest mb-8 shadow-lg backdrop-blur-2xl">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-20" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
          </span>
          <span className="text-white">IZIES TALENT NETWORK</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">GLOBAL REQUISITIONS OPEN</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.06] mb-8 drop-shadow-xl">
          Join the Builders Shaping the{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(34,211,238,0.3)]">
            Next Era of Technology
          </span>.
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          Work with high autonomy, zero bureaucracy, and world-class craft across AI, modern web architectures, distributed systems, and dynamic digital experiences.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link href="/jobs">
            <Button size="lg" className="group gap-2 px-8 h-12 sm:h-14 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:opacity-90 text-white font-bold shadow-lg shadow-cyan-500/20 text-[14px] transition-all hover:scale-[1.02] active:scale-95">
              <span>Explore Open Roles</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/candidate/login">
            <Button variant="outline" size="lg" className="group gap-2 px-8 h-12 sm:h-14 rounded-full text-[14px] font-bold text-slate-300 border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:text-white transition-all backdrop-blur-md">
              <GraduationCap className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <span>Candidate Portal</span>
            </Button>
          </Link>
        </div>

        {/* Live Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-24 pt-12 border-t border-white/10 text-left">
          <div className="space-y-3 p-5 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors backdrop-blur-md">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <Globe className="w-4 h-4" />
              </div>
              <span>Culture</span>
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">Remote Async</p>
            <p className="text-xs text-slate-400">Work whenever you want</p>
          </div>

          <div className="space-y-3 p-5 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors backdrop-blur-md">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <Coins className="w-4 h-4" />
              </div>
              <span>Pay & Equity</span>
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">Top Tier</p>
            <p className="text-xs text-slate-400">Competitive salary + grants</p>
          </div>

          <div className="space-y-3 p-5 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors backdrop-blur-md">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
              <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <Zap className="w-4 h-4" />
              </div>
              <span>Ownership</span>
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">DRI Model</p>
            <p className="text-xs text-slate-400">Direct technical responsibility</p>
          </div>

          <div className="space-y-3 p-5 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors backdrop-blur-md">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Turnaround</span>
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">&lt; 10 Days</p>
            <p className="text-xs text-slate-400">App to offer timeline</p>
          </div>
        </div>
      </section>

      {/* Featured Requisitions Section */}
      <section className="py-24 px-6 border-t border-white/10 bg-[#06080F]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ACTIVE OPENINGS</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                Current Opportunities
              </h2>
              <p className="text-base text-slate-400 max-w-xl">
                Join our engineering, systems architecture, and product squads.
              </p>
            </div>
            <Link href="/jobs">
              <Button variant="outline" className="gap-2 h-11 rounded-xl text-xs border-white/10 hover:bg-white/[0.05]">
                <span>View All Open Positions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 rounded-3xl border border-white/[0.06] bg-[#0C1020] animate-pulse" />
              ))}
            </div>
          ) : featuredJobs.length === 0 ? (
            <div className="text-center py-16 bg-[#0C1020] rounded-3xl border border-white/[0.08]">
              <p className="text-slate-400 text-sm">No open positions matching your filters at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApplyClick={(j) => setSelectedJobForApply(j)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* IN-APP APPLY MODAL */}
      {selectedJobForApply && (
        <InAppApplyModal
          jobId={selectedJobForApply.id}
          jobTitle={selectedJobForApply.title}
          departmentName={selectedJobForApply.department.name}
          isOpen={Boolean(selectedJobForApply)}
          onClose={() => setSelectedJobForApply(null)}
        />
      )}
    </div>
  );
}
