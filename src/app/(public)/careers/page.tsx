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

export default function CareersHubPage() {
  const [featuredJobs, setFeaturedJobs] = useState<JobSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobSummary | null>(null);

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
      {/* Background Lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-[140px] rounded-full" />
      <div className="pointer-events-none absolute top-[1200px] -left-60 w-[600px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-8 shadow-inner shadow-indigo-500/10 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>IZIES TALENT NETWORK</span>
          <span className="text-indigo-400/60">•</span>
          <span className="text-slate-400">Global Requisitions Open</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.06] mb-8">
          Join the Builders Shaping the{" "}
          <span className="text-gradient-primary">Next Era of Technology</span>.
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          Work with high autonomy, zero bureaucracy, and world-class craft across AI, modern web architectures, distributed systems, and dynamic digital experiences.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/jobs">
            <Button size="lg" className="gap-2.5 px-8 h-13 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold shadow-xl shadow-indigo-600/25 text-base">
              <span>Explore All Open Roles</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/candidate/login">
            <Button variant="outline" size="lg" className="px-8 h-13 rounded-2xl text-base text-slate-300 border-white/10 hover:bg-white/[0.05] hover:text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Candidate Portal</span>
            </Button>
          </Link>
        </div>

        {/* Live Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-20 pt-10 border-t border-white/[0.08] text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5" />
              <span>Culture</span>
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">Remote Async</p>
            <p className="text-xs text-slate-400">Work whenever you want</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Coins className="w-3.5 h-3.5" />
              <span>Pay & Equity</span>
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">Top Tier</p>
            <p className="text-xs text-slate-400">Competitive salary + grants</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-purple-400 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>Ownership</span>
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">DRI Model</p>
            <p className="text-xs text-slate-400">Direct technical responsibility</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Turnaround</span>
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">&lt; 10 Days</p>
            <p className="text-xs text-slate-400">Application to offer timeline</p>
          </div>
        </div>
      </section>

      {/* Featured Requisitions Section */}
      <section className="py-20 px-6 border-t border-white/[0.08] bg-[#080B14]/80">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Active Openings</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Current Opportunities
              </h2>
              <p className="text-sm text-slate-400">
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
