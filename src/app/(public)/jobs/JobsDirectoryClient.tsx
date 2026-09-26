"use client";

import { useCallback, useEffect, useState } from "react";
import { Sparkles, Briefcase, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/public/JobCard";
import { JobFilters } from "@/components/public/JobFilters";
import dynamic from "next/dynamic";
const InAppApplyModal = dynamic(
  () => import("@/components/public/InAppApplyModal").then((mod) => mod.InAppApplyModal),
  { ssr: false }
);
import { JobSummary, DepartmentSummary } from "@/types";

export function JobsDirectoryClient() {
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedWorkplace, setSelectedWorkplace] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");

  // Apply Modal state
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobSummary | null>(null);

  const fetchJobs = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (selectedDept !== "all") params.set("department", selectedDept);
    if (selectedWorkplace !== "all") params.set("workplaceType", selectedWorkplace);
    if (selectedExperience !== "all") params.set("experienceLevel", selectedExperience);

    fetch(`/api/jobs?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setJobs(data.jobs);
          if (data.departments && departments.length === 0) {
            setDepartments(data.departments);
          }
        }
      })
      .catch((err) => console.error("Error fetching jobs:", err))
      .finally(() => setLoading(false));
  }, [search, selectedDept, selectedWorkplace, selectedExperience, departments.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchJobs]);

  return (
    <div className="py-12 sm:py-20 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview</span>
        </Link>
      </div>

      {/* Page Header */}
      <div className="max-w-3xl mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Open Positions & Internships</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Find your next role at <span className="text-gradient-primary">IZIES</span>.
        </h1>
        <p className="text-base text-slate-300 leading-relaxed font-normal">
          We are seeking high-conviction software engineers, system architects, and creative strategists. 
          All roles include direct feature ownership, competitive equity, and flexible remote work.
        </p>
      </div>

      {/* Filter Component */}
      <JobFilters
        search={search}
        setSearch={setSearch}
        selectedDept={selectedDept}
        setSelectedDept={setSelectedDept}
        selectedWorkplace={selectedWorkplace}
        setSelectedWorkplace={setSelectedWorkplace}
        selectedExperience={selectedExperience}
        setSelectedExperience={setSelectedExperience}
        departments={departments}
        totalJobs={jobs.length}
      />

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 rounded-3xl border border-white/[0.06] bg-[#0C1020] animate-pulse"
            />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-24 px-6 rounded-3xl border border-white/[0.08] bg-[#0A0E1A] max-w-lg mx-auto space-y-4">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">No matching roles found</h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            Try adjusting your search terms or resetting department/workplace filters to explore other openings.
          </p>
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-white/10 hover:bg-white/[0.05]"
              onClick={() => {
                setSearch("");
                setSelectedDept("all");
                setSelectedWorkplace("all");
                setSelectedExperience("all");
              }}
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onApplyClick={(j) => setSelectedJobForApply(j)}
            />
          ))}
        </div>
      )}

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