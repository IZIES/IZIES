"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  Calendar,
  Clock,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  totalJobs: number;
  publishedJobs: number;
  totalApplications: number;
  applicationsThisWeek: number;
  statusCounts: Record<string, number>;
  recentApplications: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch((err) => console.error("Error loading stats:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-card/40 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-card/20 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-sm text-slate-400">Failed to load metrics. Please refresh.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Hiring Overview</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time pipeline metrics and candidate influx across IZIES.
          </p>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Link href="/admin/jobs" className="flex-1 sm:flex-initial">
            <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
              <Briefcase className="w-4 h-4" />
              <span>Manage Jobs</span>
            </Button>
          </Link>
          <Link href="/admin/applicants" className="flex-1 sm:flex-initial">
            <Button size="sm" className="w-full gap-1.5 text-xs">
              <Users className="w-4 h-4" />
              <span>Review Candidates</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0C101C] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Published Jobs</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.publishedJobs}</p>
          <p className="text-[11px] text-slate-500">Out of {stats.totalJobs} total positions</p>
        </div>

        <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0C101C] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Applicants</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalApplications}</p>
          <p className="text-[11px] text-slate-500">Across all open requisitions</p>
        </div>

        <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0C101C] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Applications This Week</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.applicationsThisWeek}</p>
          <p className="text-[11px] text-emerald-400/80">Active candidate flow</p>
        </div>

        <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0C101C] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">In Review / Interview</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock3 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">
            {(stats.statusCounts["SCREENING"] || 0) + (stats.statusCounts["INTERVIEW"] || 0)}
          </p>
          <p className="text-[11px] text-slate-500">Screening or scheduling</p>
        </div>
      </div>

      {/* Candidate Pipeline Funnel */}
      <div className="p-5 sm:p-6 rounded-3xl border border-white/[0.08] bg-[#0A0D18] space-y-4">
        <h3 className="text-base font-bold text-white tracking-tight">Candidate Pipeline Stages</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {[
            { label: "Applied", key: "APPLIED", color: "text-blue-400" },
            { label: "Screening", key: "SCREENING", color: "text-amber-400" },
            { label: "Shortlisted", key: "SHORTLISTED", color: "text-cyan-400" },
            { label: "Interview", key: "INTERVIEW", color: "text-purple-400" },
            { label: "Selected", key: "SELECTED", color: "text-emerald-400" },
            { label: "Rejected", key: "REJECTED", color: "text-rose-400" },
          ].map((stage) => (
            <div
              key={stage.key}
              className="p-3 sm:p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.02] text-center space-y-1"
            >
              <p className="text-[11px] font-medium text-slate-400">{stage.label}</p>
              <p className={`text-lg sm:text-xl font-bold ${stage.color}`}>
                {stats.statusCounts[stage.key] || 0}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Applications Container */}
      <div className="p-4 sm:p-7 rounded-3xl border border-white/[0.08] bg-[#0A0D18] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Candidates</h3>
            <p className="text-xs text-slate-400">Latest profiles submitted via in-app portal</p>
          </div>
          <Link href="/admin/applicants">
            <Button variant="ghost" size="sm" className="text-xs text-blue-400 hover:text-blue-300">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {stats.recentApplications.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No candidates have applied yet. Once candidates submit via the in-app form, they will appear here!
          </div>
        ) : (
          <>
            {/* Mobile Card View for Recent Candidates */}
            <div className="sm:hidden space-y-3">
              {stats.recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white truncate">{app.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{app.email}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0">
                      {app.status}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Role: <span className="text-slate-200">{app.job.title}</span>
                  </div>
                  <div className="pt-1.5 border-t border-white/[0.04] flex items-center justify-between text-[11px]">
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium"
                    >
                      <span>Open Resume</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="text-slate-500">{new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-white/[0.06]">
                  <tr>
                    <th className="pb-3 font-semibold">Candidate</th>
                    <th className="pb-3 font-semibold">Role Applied</th>
                    <th className="pb-3 font-semibold">Resume Link</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {stats.recentApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5">
                        <div className="font-semibold text-white">{app.fullName}</div>
                        <div className="text-[11px] text-slate-500">{app.email}</div>
                      </td>
                      <td className="py-3.5">
                        <div className="font-medium text-slate-300">{app.job.title}</div>
                        <div className="text-[10px] text-slate-500">{app.job.department.name}</div>
                      </td>
                      <td className="py-3.5">
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium"
                        >
                          <span>Open Resume</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="py-3.5">
                        <Badge variant="secondary" className="text-[10px]">
                          {app.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 text-slate-500">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
