"use client";

import Link from "next/link";
import {
  MapPin,
  Briefcase,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Clock,
  ChevronRight
} from "lucide-react";
import { JobSummary } from "@/types";
import Image from "next/image";

interface JobCardProps {
  job: JobSummary;
  onApplyClick?: (job: JobSummary) => void;
}

export function JobCard({ job, onApplyClick }: JobCardProps) {
  const formatType = (type: string) => {
    return type.replace("_", " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const isInternship = job.employmentType === "INTERNSHIP";

  // Department specific accent styles
  const getDepartmentTheme = (name: string) => {
    const n = (name || "").toLowerCase();
    if (n.includes("ai") || n.includes("ml") || n.includes("data")) {
      return {
        pill: "bg-purple-500/15 text-purple-300 border-purple-500/30",
        dot: "bg-purple-400",
        gradient: "from-purple-950/60 via-indigo-950/40 to-[#0A0E18]"
      };
    }
    if (n.includes("design") || n.includes("product") || n.includes("ui") || n.includes("ux")) {
      return {
        pill: "bg-pink-500/15 text-pink-300 border-pink-500/30",
        dot: "bg-pink-400",
        gradient: "from-pink-950/60 via-rose-950/40 to-[#0A0E18]"
      };
    }
    if (n.includes("marketing") || n.includes("growth") || n.includes("ops")) {
      return {
        pill: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        dot: "bg-amber-400",
        gradient: "from-amber-950/60 via-orange-950/40 to-[#0A0E18]"
      };
    }
    return {
      pill: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
      dot: "bg-indigo-400",
      gradient: "from-indigo-950/60 via-blue-950/40 to-[#0A0E18]"
    };
  };

  const theme = getDepartmentTheme(job.department?.name || "");

  return (
    <div className="group relative rounded-3xl border border-white/[0.08] bg-[#0A0E1A]/90 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10 p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden backdrop-blur-xl hover:-translate-y-1">
      {/* Ambient Top Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />

      <div>
        {/* Department & Status Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${theme.pill}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
              <span>{job.department?.name || "General"}</span>
            </span>

            {isInternship && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Internship</span>
              </span>
            )}
          </div>

          <span className="text-[11px] text-slate-500 font-mono">
            {formatType(job.workplaceType)}
          </span>
        </div>

        {/* Role Title */}
        <Link href={`/jobs/${job.slug}`}>
          <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors tracking-tight line-clamp-2 mb-3">
            {job.title}
          </h3>
        </Link>

        {/* Tags Row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-slate-300 font-medium">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{formatType(job.workplaceType)}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-slate-300 font-medium">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{formatType(job.employmentType)}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-slate-300 font-medium">
            <Briefcase className="w-3.5 h-3.5 text-purple-400" />
            <span>{formatType(job.experienceLevel)}</span>
          </span>
        </div>

        {/* Tech Stack / Skill Badges */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-5">
            {job.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-medium text-indigo-200"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-[10px] font-semibold text-slate-400 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-lg">
                +{job.skills.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Location & Compensation Meta */}
        <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-3 text-xs mb-6 pt-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate max-w-[200px]">{job.location}</span>
          </div>

          {job.salaryRange && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs shadow-xs">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>{job.salaryRange}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
        <Link
          href={`/jobs/${job.slug}`}
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1 group/link"
        >
          <span>View Scope & Details</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>

        <button
          type="button"
          onClick={() => onApplyClick?.(job)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all duration-200 active:scale-95 group/btn"
        >
          <span>Apply In-App</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
