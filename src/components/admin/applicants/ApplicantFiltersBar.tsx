"use client";

import { Search, Filter, Sliders } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ApplicantFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedJob: string;
  onJobChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  viewMode: "kanban" | "table";
  onViewModeChange: (mode: "kanban" | "table") => void;
  jobs: any[];
  totalApplicants: number;
}

export function ApplicantFiltersBar({
  search,
  onSearchChange,
  selectedJob,
  onJobChange,
  selectedStatus,
  onStatusChange,
  viewMode,
  onViewModeChange,
  jobs,
  totalApplicants,
}: ApplicantFiltersBarProps) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 p-4 rounded-2xl bg-[#0B0F1A] border border-white/[0.08]">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search candidate name, email, college, skills..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 text-xs h-9 bg-white/[0.03]"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs text-slate-400">Job:</span>
          <select
            value={selectedJob}
            onChange={(e) => onJobChange(e.target.value)}
            className="h-9 px-3 rounded-xl bg-card border border-white/10 text-xs text-foreground focus:outline-none max-w-[180px]"
          >
            <option value="all">All Job Requisitions</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400">Stage:</span>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-9 px-3 rounded-xl bg-card border border-white/10 text-xs text-foreground focus:outline-none"
          >
            <option value="all">All Stages ({totalApplicants})</option>
            <option value="APPLIED">Applied</option>
            <option value="FIRST_CALL">First Call Screening</option>
            <option value="INTERVIEW">Technical Interview</option>
            <option value="HIRED">Offer Extended / Hired</option>
            <option value="REJECTED">Archived / Rejected</option>
          </select>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center rounded-xl bg-white/[0.04] p-1 border border-white/[0.08]">
          <button
            type="button"
            onClick={() => onViewModeChange("kanban")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              viewMode === "kanban"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Kanban
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              viewMode === "table"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Table
          </button>
        </div>
      </div>
    </div>
  );
}
