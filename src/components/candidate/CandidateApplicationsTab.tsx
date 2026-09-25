"use client";

import Link from "next/link";
import {
  Briefcase,
  ArrowRight,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  FileCheck,
  MapPin,
  Globe,
  Clock,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface CandidateApplicationsTabProps {
  applications: any[];
  openJobs: any[];
  applyingJobId: string | null;
  onDirectApply: (jobId: string, jobTitle: string) => void;
}

export function CandidateApplicationsTab({
  applications,
  openJobs,
  applyingJobId,
  onDirectApply,
}: CandidateApplicationsTabProps) {
  const formatType = (type?: string) => {
    if (!type) return "";
    return type.replace("_", " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Department gradient generator for cards without images
  const getDepartmentGradient = (name?: string) => {
    const n = (name || "").toLowerCase();
    if (n.includes("ai") || n.includes("ml") || n.includes("data")) {
      return "from-purple-900/70 via-indigo-900/50 to-[#0B0F19]";
    }
    if (n.includes("design") || n.includes("product") || n.includes("ui") || n.includes("ux")) {
      return "from-pink-900/70 via-rose-900/50 to-[#0B0F19]";
    }
    if (n.includes("marketing") || n.includes("growth") || n.includes("ops")) {
      return "from-amber-900/70 via-orange-900/50 to-[#0B0F19]";
    }
    return "from-blue-900/70 via-cyan-900/50 to-[#0B0F19]";
  };

  return (
    <div className="space-y-8">
      {/* SECTION 1: SUBMITTED APPLICATIONS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-400" />
              <span>Your Submitted Applications</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Track your recruitment progress, first call schedules, and interview status.
            </p>
          </div>
          <Link href="/jobs">
            <Button size="sm" variant="outline" className="gap-2 text-xs border-white/10 hover:border-blue-500/30">
              <span>Browse All Open Roles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="p-10 sm:p-14 rounded-3xl border border-white/10 bg-[#090D18] text-center space-y-4 shadow-xl">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-slate-400">
              <Briefcase className="w-8 h-8 text-slate-500" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-white text-lg">No applications submitted yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Once your profile is set up, you can apply to any internship or engineering position below with 1-click!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-3xl border border-white/10 bg-[#090D18] hover:border-blue-500/40 transition-all duration-300 shadow-xl overflow-hidden group"
              >
                {/* Visual Cover Banner Header for Submitted Job */}
                <div className="relative h-36 sm:h-44 w-full overflow-hidden bg-[#05070E] border-b border-white/[0.08]">
                  {app.job?.imageUrl ? (
                    <>
                      {/* Ambient blur layer */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <Image width={400} height={400}
                        src={app.job.imageUrl}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-45 scale-125 pointer-events-none"
                      />
                      {/* Main Image */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <Image width={400} height={400}
                        src={app.job.imageUrl}
                        alt={app.job?.title || "Role"}
                        className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </>
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-r ${getDepartmentGradient(
                        app.job?.department?.name
                      )} flex items-center justify-between px-6`}
                    >
                      <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
                        {app.job?.department?.name || "IZIES Engineering"}
                      </span>
                      <Sparkles className="w-5 h-5 text-white/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#090D18] via-[#090D18]/50 to-black/30 pointer-events-none" />

                  {/* Floating Tags over Banner */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 z-30 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-black/70 backdrop-blur-md border border-white/20 text-white shadow-lg">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                      <span>{app.job?.department?.name || "Engineering"}</span>
                    </span>

                    <Badge
                      variant={
                        app.status === "HIRED" || app.status === "SELECTED"
                          ? "success"
                          : app.status === "FIRST_CALL"
                          ? "warning"
                          : app.status === "INTERVIEW"
                          ? "purple"
                          : app.status === "REJECTED"
                          ? "danger"
                          : "secondary"
                      }
                      className="shadow-xl backdrop-blur-md font-bold text-xs"
                    >
                      {app.status === "FIRST_CALL"
                        ? "📞 First Call Scheduled"
                        : app.status === "HIRED" || app.status === "SELECTED"
                        ? "🎉 Offer Extended / Hired"
                        : app.status === "INTERVIEW"
                        ? "💻 Technical Pairing"
                        : app.status}
                    </Badge>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                        {app.job?.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1 text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-blue-400" />
                          <span>{app.job?.location || "Remote (India)"}</span>
                        </span>
                        <span>•</span>
                        <span>Applied on {new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        {app.job?.salaryRange && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400 font-bold">{app.job.salaryRange}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/jobs/${app.job?.slug}`}>
                        <Button size="sm" variant="outline" className="gap-1.5 text-xs border-white/10 hover:border-blue-500/30">
                          <span>View Role Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* OFFICIAL OFFER LETTER BANNER (FOR HIRED STATUS) */}
                  {(app.status === "HIRED" || app.status === "SELECTED") && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-emerald-900/30 to-blue-950/50 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🎉</span>
                          <span className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider">
                            Official Offer of Employment Issued!
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1">
                          {app.offerSalary && (
                            <span>
                              Compensation: <strong className="text-emerald-400 font-semibold">{app.offerSalary}</strong>
                            </span>
                          )}
                          {app.offerJoiningDate && (
                            <span>• Joining: <strong className="text-white">{app.offerJoiningDate}</strong></span>
                          )}
                          {app.offerLocation && (
                            <span>• Mode: <strong className="text-white">{app.offerLocation}</strong></span>
                          )}
                        </div>
                      </div>
                      <Link href={`/candidate/offer/${app.id}`}>
                        <Button size="sm" className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 shadow-lg shadow-emerald-950/50 font-bold">
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>{app.offerAcceptedAt ? "View Accepted Offer Letter" : "📄 Open & Accept Official Offer Letter"}</span>
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* 4-Stage Visual Progress Stepper */}
                  <div className="pt-3 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div
                      className={`p-2.5 rounded-xl border transition-all ${
                        ["APPLIED", "FIRST_CALL", "INTERVIEW", "HIRED", "SELECTED"].includes(app.status)
                          ? "bg-blue-500/15 border-blue-500/40 text-blue-300 font-bold shadow-sm"
                          : "bg-white/[0.02] border-white/5 text-slate-500"
                      }`}
                    >
                      1. Applied
                    </div>
                    <div
                      className={`p-2.5 rounded-xl border transition-all ${
                        ["FIRST_CALL", "INTERVIEW", "HIRED", "SELECTED"].includes(app.status)
                          ? "bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold shadow-sm"
                          : "bg-white/[0.02] border-white/5 text-slate-500"
                      }`}
                    >
                      2. First Call
                    </div>
                    <div
                      className={`p-2.5 rounded-xl border transition-all ${
                        ["INTERVIEW", "HIRED", "SELECTED"].includes(app.status)
                          ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300 font-bold shadow-sm"
                          : "bg-white/[0.02] border-white/5 text-slate-500"
                      }`}
                    >
                      3. Tech Pairing
                    </div>
                    <div
                      className={`p-2.5 rounded-xl border transition-all ${
                        app.status === "HIRED" || app.status === "SELECTED"
                          ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold shadow-sm"
                          : app.status === "REJECTED"
                          ? "bg-rose-500/15 border-rose-500/40 text-rose-400 font-bold"
                          : "bg-white/[0.02] border-white/5 text-slate-500"
                      }`}
                    >
                      4. Final Decision
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: OPEN INTERNSHIPS & ROLES FOR 1-CLICK APPLY */}
      <div className="pt-8 border-t border-white/[0.08] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Explore & Apply in 1-Click</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Your verified college credentials & resume drive link will be attached automatically.
            </p>
          </div>
          <Link href="/jobs">
            <Button size="sm" variant="ghost" className="text-xs text-blue-400 hover:text-white">
              <span>View Full Directory</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {openJobs.map((job) => {
            const isApplied = applications.some((app) => app.jobId === job.id);
            return (
              <div
                key={job.id}
                className="group rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#0D1222]/95 via-[#0A0E1A]/95 to-[#060810]/98 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-600/20 p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden backdrop-blur-2xl hover:-translate-y-1"
              >
                <div>
                  {/* Full Cover Banner Header with Ambient Glow */}
                  <div className="relative h-44 sm:h-48 -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 mb-5 overflow-hidden border-b border-white/[0.08] bg-[#05070E]">
                    {job.imageUrl ? (
                      <>
                        {/* Ambient blur layer */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <Image width={400} height={400}
                          src={job.imageUrl}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-45 scale-125 pointer-events-none"
                        />
                        {/* Main Image */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <Image width={400} height={400}
                          src={job.imageUrl}
                          alt={job.title}
                          className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </>
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${getDepartmentGradient(
                          job.department?.name
                        )} flex items-center justify-between p-6 relative overflow-hidden`}
                      >
                        <div className="space-y-1 z-10">
                          <span className="text-[10px] font-bold tracking-wider text-blue-300/80 uppercase">
                            Requisition
                          </span>
                          <p className="text-base font-extrabold text-white">
                            {job.department?.name || "Engineering"}
                          </p>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 backdrop-blur-md shadow-inner">
                          <Sparkles className="w-5 h-5" />
                        </div>
                      </div>
                    )}

                    {/* Vignette Shadow */}
                    <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#0D1222] via-[#0D1222]/30 to-black/30 pointer-events-none" />

                    {/* Floating Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 z-30 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-black/70 backdrop-blur-md border border-white/20 text-white shadow-xl">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                        <span>{job.department?.name || "Engineering"}</span>
                      </span>

                      {job.employmentType === "INTERNSHIP" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/25 backdrop-blur-md border border-emerald-500/50 text-emerald-300 shadow-xl">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Internship</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Meta Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] text-slate-300 font-medium">
                      <Globe className="w-3 h-3 text-cyan-400" />
                      <span>{formatType(job.workplaceType)}</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] text-slate-300 font-medium">
                      <Clock className="w-3 h-3 text-indigo-400" />
                      <span>{formatType(job.employmentType)}</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] text-slate-300 font-medium">
                      <Briefcase className="w-3 h-3 text-purple-400" />
                      <span>{formatType(job.experienceLevel)}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <Link href={`/jobs/${job.slug}`}>
                    <h5 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-blue-400 transition-colors tracking-tight line-clamp-2 mb-2.5">
                      {job.title}
                    </h5>
                  </Link>

                  {/* Tech Stack & Skills Badges */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
                      {job.skills.slice(0, 4).map((skill: string) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/25 text-[11px] font-semibold text-blue-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="text-[10px] font-semibold text-slate-400 bg-white/[0.04] border border-white/[0.08] px-1.5 py-0.5 rounded-md">
                          +{job.skills.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Location & Compensation */}
                  <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-3 text-xs mb-5 pt-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate max-w-[180px]">{job.location}</span>
                    </div>

                    {job.salaryRange && (
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs shadow-sm">
                        <Zap className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{job.salaryRange}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom CTA Row */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                  <Link
                    href={`/jobs/${job.slug}`}
                    className="text-xs font-semibold text-slate-400 hover:text-white transition-colors underline underline-offset-4"
                  >
                    Role Details
                  </Link>

                  {isApplied ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Applied</span>
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => onDirectApply(job.id, job.title)}
                      isLoading={applyingJobId === job.id}
                      className="gap-1.5 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-600/25 transition-all active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>⚡ 1-Click Apply</span>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
