"use client";

import { useEffect, useState } from "react";
import { Plus, Briefcase, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateJobModal } from "@/components/admin/jobs/CreateJobModal";
import { JobCardItem } from "@/components/admin/jobs/JobCardItem";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchJobs = () => {
    setLoading(true);
    fetch("/api/admin/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setJobs(data.jobs || []);
          setDepartments(data.departments || []);
        }
      })
      .catch((err) => console.error("Error fetching admin jobs:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === "PUBLISHED" ? "CLOSED" : "PUBLISHED";
    await fetch(`/api/admin/jobs/${jobId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchJobs();
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job position?")) return;
    await fetch(`/api/admin/jobs/${jobId}`, { method: "DELETE" });
    fetchJobs();
  };

  const handleDepartmentCreated = (newDept: any) => {
    if (!departments.some((d) => d.id === newDept.id)) {
      setDepartments((prev) => [...prev, newDept].sort((a, b) => a.name.localeCompare(b.name)));
    }
  };

  const filteredJobs = jobs.filter((j) => {
    const matchesDept = selectedDeptFilter === "all" || j.departmentId === selectedDeptFilter;
    const matchesSearch =
      !searchQuery ||
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.department?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Job Requisitions</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Publish, edit, and organize career openings across all IZIES departments.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-500">
          <Plus className="w-4 h-4" />
          <span>Create New Job</span>
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0B0F1A] border border-white/[0.08]">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search roles, keywords, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs h-9 bg-white/[0.03]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span>Department:</span>
          </span>
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="h-9 px-3 rounded-xl bg-card border border-white/10 text-xs text-foreground focus:outline-none"
          >
            <option value="all">All Departments ({jobs.length})</option>
            {departments.map((d) => {
              const count = jobs.filter((j) => j.departmentId === d.id).length;
              return (
                <option key={d.id} value={d.id}>
                  {d.name} ({count})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Jobs List Container */}
      <div className="p-4 sm:p-6 rounded-3xl border border-white/[0.08] bg-[#0A0D18]">
        {loading ? (
          <div className="py-20 text-center text-sm text-slate-400 animate-pulse">
            Loading requisitions...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-500">
              <Briefcase className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-400">No job requisitions found</p>
            <p className="text-xs text-slate-500">
              {jobs.length === 0
                ? "Get started by creating your first job posting for candidates."
                : "No jobs match your selected search or department filter."}
            </p>
            {jobs.length === 0 && (
              <Button size="sm" onClick={() => setIsModalOpen(true)} className="gap-2 mt-2">
                <Plus className="w-4 h-4" />
                <span>Create First Job</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {filteredJobs.map((job) => (
              <JobCardItem
                key={job.id}
                job={job}
                onToggleStatus={handleToggleStatus}
                onDeleteJob={handleDeleteJob}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modular Create Job Modal */}
      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        departments={departments}
        onJobCreated={fetchJobs}
        onDepartmentCreated={handleDepartmentCreated}
      />
    </div>
  );
}
