"use client";

import { Search, Filter, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DepartmentSummary } from "@/types";

interface JobFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  selectedDept: string;
  setSelectedDept: (val: string) => void;
  selectedWorkplace: string;
  setSelectedWorkplace: (val: string) => void;
  selectedExperience: string;
  setSelectedExperience: (val: string) => void;
  departments: DepartmentSummary[];
  totalJobs: number;
}

export function JobFilters({
  search,
  setSearch,
  selectedDept,
  setSelectedDept,
  selectedWorkplace,
  setSelectedWorkplace,
  selectedExperience,
  setSelectedExperience,
  departments,
  totalJobs,
}: JobFiltersProps) {
  const hasActiveFilters =
    search || selectedDept !== "all" || selectedWorkplace !== "all" || selectedExperience !== "all";

  const clearFilters = () => {
    setSearch("");
    setSelectedDept("all");
    setSelectedWorkplace("all");
    setSelectedExperience("all");
  };

  return (
    <div className="space-y-4 mb-10">
      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <Input
          type="text"
          placeholder="Search by role title, technology stack, or location (e.g. Full-Stack, React, Rust, Remote)..."
          className="pl-12 pr-10 h-13 rounded-2xl bg-[#0A0E1A]/95 border-white/[0.08] text-base placeholder:text-slate-500 shadow-xl focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Department Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedDept("all")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selectedDept === "all"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500/50"
              : "bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06] hover:bg-white/[0.06]"
          }`}
        >
          All Departments
        </button>
        {departments.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDept(d.slug)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedDept === d.slug
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500/50"
                : "bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06] hover:bg-white/[0.06]"
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      {/* Secondary Select Dropdowns Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          {/* Workplace Filter */}
          <select
            value={selectedWorkplace}
            onChange={(e) => setSelectedWorkplace(e.target.value)}
            aria-label="Filter by workplace type"
            className="h-9 px-3.5 rounded-xl bg-[#0D1220] border border-white/[0.08] text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="all">Workplace: Any Location</option>
            <option value="REMOTE">Remote Only</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ON_SITE">On-Site</option>
          </select>

          {/* Experience Filter */}
          <select
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
            aria-label="Filter by experience level"
            className="h-9 px-3.5 rounded-xl bg-[#0D1220] border border-white/[0.08] text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="all">Experience: All Levels</option>
            <option value="ENTRY_LEVEL">Entry Level & Internship</option>
            <option value="MID_LEVEL">Mid Level (2-4 yrs)</option>
            <option value="SENIOR">Senior (5+ yrs)</option>
            <option value="LEAD">Lead / Staff Architect</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 font-medium transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>
            <strong className="text-white font-bold">{totalJobs}</strong> Active Requisitions
          </span>
        </div>
      </div>
    </div>
  );
}
