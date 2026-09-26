"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Users,
  Eye,
  ExternalLink,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  TrendingUp,
  Search,
  Filter,
  Mail,
  FileText,
  Sparkles,
  MapPin,
  Building2,
  Globe,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const STAGES = [
  { label: "All Applicants", key: "ALL" },
  { label: "Applied", key: "APPLIED", color: "text-blue-400" },
  { label: "Screening", key: "SCREENING", color: "text-amber-400" },
  { label: "Shortlisted", key: "SHORTLISTED", color: "text-cyan-400" },
  { label: "Interview", key: "INTERVIEW", color: "text-purple-400" },
  { label: "Selected", key: "SELECTED", color: "text-emerald-400" },
  { label: "Rejected", key: "REJECTED", color: "text-rose-400" },
];

export default function AdminJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [job, setJob] = useState<any | null>(null);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [selectedStage, setSelectedStage] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editSalary, setEditSalary] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const [editSkillInput, setEditSkillInput] = useState("");
  const [masterSkills, setMasterSkills] = useState<any[]>([]);
  const [editAbout, setEditAbout] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/skills")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.skills) {
          setMasterSkills(data.skills);
        }
      })
      .catch(() => {});
  }, []);

  const handleAddEditSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (!editSkills.includes(trimmed)) {
      setEditSkills([...editSkills, trimmed]);
    }
    setEditSkillInput("");
  };

  const handleRemoveEditSkill = (skillToRemove: string) => {
    setEditSkills(editSkills.filter((s) => s !== skillToRemove));
  };

  // Updating Status of Candidate
  const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);

  const fetchJobData = useCallback(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/admin/jobs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.job) {
          setJob(data.job);
          setStatusCounts(data.statusCounts || {});
          setEditTitle(data.job.title);
          setEditLocation(data.job.location);
          setEditSalary(data.job.salaryRange || "");
          setEditImageUrl(data.job.imageUrl || "");
          setEditSkills(data.job.skills || []);
          setEditAbout(data.job.aboutRole || "");
        } else {
          setError(data.error || "Job opening not found");
        }
      })
      .catch(() => setError("Failed to connect to server"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchJobData();
  }, [fetchJobData]);

  const handleStatusChange = async (newStatus: string) => {
    if (!job) return;
    try {
      const res = await fetch(`/api/admin/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setJob((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Failed to update job status", err);
    }
  };

  const handleCandidateStatusUpdate = async (appId: string, newStatus: string) => {
    setUpdatingAppId(appId);
    try {
      const res = await fetch(`/api/admin/applicants/${appId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchJobData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingAppId(null);
    }
  };

  const handleDeleteJob = async () => {
    if (!job) return;
    if (!confirm(`Are you sure you want to delete "${job.title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/jobs/${job.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/jobs");
      } else {
        alert(data.error || "Failed to delete job");
      }
    } catch (err) {
      alert("Error deleting job");
    }
  };

  const handleSaveJobDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          location: editLocation,
          salaryRange: editSalary,
          imageUrl: editImageUrl.trim() || null,
          skills: editSkills,
          aboutRole: editAbout,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setJob(data.job);
        setShowEditModal(false);
      } else {
        alert(data.error || "Failed to save edits");
      }
    } catch (err) {
      alert("Failed to update job details");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-pulse p-4">
        <div className="h-10 w-48 bg-white/5 rounded-xl" />
        <div className="h-32 bg-white/5 rounded-3xl" />
        <div className="h-96 bg-white/5 rounded-3xl" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-xl mx-auto my-16 text-center space-y-4 p-8 rounded-3xl border border-white/10 bg-[#090D18]">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Job Opening Not Found</h2>
        <p className="text-xs text-slate-400">{error || "The job listing you requested could not be located."}</p>
        <Link href="/admin/jobs">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Job Listings</span>
          </Button>
        </Link>
      </div>
    );
  }

  // Filter Applicants
  const filteredApplicants = (job.applications || []).filter((app: any) => {
    const matchesStage = selectedStage === "ALL" || app.status === selectedStage;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      app.fullName?.toLowerCase().includes(q) ||
      app.email?.toLowerCase().includes(q) ||
      app.collegeName?.toLowerCase().includes(q) ||
      app.degree?.toLowerCase().includes(q);
    return matchesStage && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/jobs">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
              <span>All Jobs</span>
            </Button>
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-semibold text-slate-300 truncate max-w-xs">{job.title}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link href={`/jobs/${job.slug}`} target="_blank">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs text-blue-400 border-blue-500/30 hover:bg-blue-500/10">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public View</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEditModal(true)}
            className="gap-1.5 text-xs text-slate-300 border-white/10 hover:text-white"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Job</span>
          </Button>

          <select
            value={job.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="h-9 px-3 rounded-xl bg-[#0F1424] border border-white/10 text-xs font-semibold text-slate-200 focus:outline-none"
          >
            <option value="PUBLISHED">● Published (Active)</option>
            <option value="DRAFT">● Draft (Hidden)</option>
            <option value="CLOSED">● Closed / Archived</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteJob}
            className="gap-1.5 text-xs text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Main Job Info Header Card */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#0C101F] via-[#0A0E1A] to-[#0D1224] shadow-2xl relative overflow-hidden">
        {job.imageUrl && (
          <div className="h-36 sm:h-44 w-full relative overflow-hidden bg-[#060810] border-b border-white/[0.08]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image width={400} height={400} src={job.imageUrl} alt={job.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-transparent to-transparent" />
          </div>
        )}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={
                    job.status === "PUBLISHED" ? "success" : job.status === "CLOSED" ? "danger" : "warning"
                  }
                  className="text-[10px]"
                >
                  {job.status}
                </Badge>
                {job.department && (
                  <span className="text-xs text-slate-400 font-medium bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                    {job.department.name}
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono">ID: {job.id}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{job.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>{job.location}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                <span>{job.employmentType} • {job.workplaceType}</span>
              </span>
              {job.salaryRange && (
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span>💰 {job.salaryRange}</span>
                </span>
              )}
            </div>

            {/* Skills Badges in Admin Header */}
            {job.skills?.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-[11px] font-semibold text-slate-400 mr-1">Skills & Tech Stack:</span>
                {job.skills.map((skill: string) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-blue-500/15 border border-blue-500/30 text-blue-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#060810]/70 p-4 rounded-2xl border border-white/[0.06] shrink-0">
            <div className="text-center space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-500">Total Applicants</span>
              <p className="text-xl font-extrabold text-white">{job.applications?.length || 0}</p>
            </div>

            <div className="text-center space-y-0.5 border-l border-white/[0.06] pl-3">
              <span className="text-[10px] uppercase font-bold text-slate-500">Page Views</span>
              <p className="text-xl font-extrabold text-blue-400">{job.viewsCount || 0}</p>
            </div>

            <div className="text-center space-y-0.5 border-l border-white/[0.06] pl-3">
              <span className="text-[10px] uppercase font-bold text-slate-500">Shortlisted</span>
              <p className="text-xl font-extrabold text-cyan-400">{statusCounts["SHORTLISTED"] || 0}</p>
            </div>

            <div className="text-center space-y-0.5 border-l border-white/[0.06] pl-3">
              <span className="text-[10px] uppercase font-bold text-slate-500">Hired / Selected</span>
              <p className="text-xl font-extrabold text-emerald-400">{statusCounts["SELECTED"] || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Candidate Pipeline Stages Funnel (Specific to this Job) */}
      <div className="p-5 sm:p-6 rounded-3xl border border-white/[0.08] bg-[#0A0D18] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Job Candidate Pipeline Funnel</span>
          </h3>
          <span className="text-xs text-slate-400">Filtered for this position</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {STAGES.filter((s) => s.key !== "ALL").map((stage) => (
            <button
              key={stage.key}
              onClick={() => setSelectedStage(stage.key)}
              className={`p-3.5 rounded-2xl border text-center space-y-1 transition-all ${
                selectedStage === stage.key
                  ? "bg-blue-600/20 border-blue-500/50 shadow-lg"
                  : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]"
              }`}
            >
              <p className="text-[11px] font-medium text-slate-400">{stage.label}</p>
              <p className={`text-xl font-bold ${stage.color}`}>{statusCounts[stage.key] || 0}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Candidates List Container for THIS Job */}
      <div className="p-5 sm:p-7 rounded-3xl border border-white/[0.08] bg-[#0A0D18] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span>Applicants for {job.title}</span>
            </h3>
            <p className="text-xs text-slate-400">
              Showing {filteredApplicants.length} out of {job.applications?.length || 0} total candidates
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <Input
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs bg-[#060810]"
              />
            </div>

            {/* Filter Dropdown */}
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[#060810] border border-white/10 text-xs text-slate-200 focus:outline-none w-full sm:w-auto"
            >
              {STAGES.map((s) => (
                <option key={s.key} value={s.key}>
                  Filter: {s.label} ({s.key === "ALL" ? job.applications?.length || 0 : statusCounts[s.key] || 0})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table of Applicants */}
        {filteredApplicants.length === 0 ? (
          <div className="py-16 text-center space-y-3 border border-dashed border-white/10 rounded-2xl">
            <Users className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No applicants found</p>
            <p className="text-xs text-slate-500">
              {searchQuery || selectedStage !== "ALL"
                ? "Try clearing your search query or stage filter."
                : "No candidates have applied for this specific job opening yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-white/[0.06]">
                <tr>
                  <th className="pb-3.5 font-semibold">Candidate</th>
                  <th className="pb-3.5 font-semibold">Academic Credentials</th>
                  <th className="pb-3.5 font-semibold">Resume / CV</th>
                  <th className="pb-3.5 font-semibold">Pipeline Stage</th>
                  <th className="pb-3.5 font-semibold">Applied Date</th>
                  <th className="pb-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredApplicants.map((app: any) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4">
                      <div className="font-semibold text-white text-sm">{app.fullName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-0.5">
                        <span>✉ {app.email}</span>
                        <span>•</span>
                        <span>📞 {app.phone}</span>
                      </div>
                    </td>

                    <td className="py-4">
                      <div className="font-medium text-slate-200">
                        {app.collegeName || "Not specified"}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {app.degree ? `${app.degree} (${app.branch || "General"})` : "Student"}
                        {app.cgpa ? ` • CGPA: ${app.cgpa}` : ""}
                      </div>
                    </td>

                    <td className="py-4">
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 font-medium"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Resume</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>

                    <td className="py-4">
                      <select
                        disabled={updatingAppId === app.id}
                        value={app.status}
                        onChange={(e) => handleCandidateStatusUpdate(app.id, e.target.value)}
                        className="h-8 px-2.5 rounded-xl bg-[#060810] border border-white/10 text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
                      >
                        <option value="APPLIED">● Applied</option>
                        <option value="SCREENING">● Screening</option>
                        <option value="SHORTLISTED">● Shortlisted</option>
                        <option value="INTERVIEW">● Interview</option>
                        <option value="SELECTED">● Selected (Offer)</option>
                        <option value="REJECTED">● Rejected</option>
                      </select>
                    </td>

                    <td className="py-4 text-slate-400">
                      {new Date(app.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-4 text-right">
                      <Link href={`/admin/applicants`}>
                        <Button variant="ghost" size="sm" className="text-xs text-blue-400 hover:text-blue-300">
                          <span>Manage</span>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Job Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0B0F1A] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-400" />
                <span>Edit Job Details</span>
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveJobDetails} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Job Title</label>
                <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                <Input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} required />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Salary / Stipend Range</label>
                <Input value={editSalary} onChange={(e) => setEditSalary(e.target.value)} placeholder="e.g. ₹25,000 - ₹35,000 / month Stipend" />
              </div>

              {/* Cover Image URL */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300">Cover Image / Banner URL (Optional)</label>
                  {editImageUrl && (
                    <button
                      type="button"
                      onClick={() => setEditImageUrl("")}
                      className="text-[11px] text-rose-400 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <Input
                  type="url"
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or CDN link"
                  className="text-xs font-mono"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    { label: "Frontend", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60" },
                    { label: "Backend", url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60" },
                    { label: "AI / ML", url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60" },
                    { label: "Mobile", url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60" },
                    { label: "Design", url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60" },
                  ].map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => setEditImageUrl(preset.url)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all ${
                        editImageUrl === preset.url
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                          : "bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {editImageUrl && (
                  <div className="mt-2 h-20 rounded-xl overflow-hidden border border-white/10 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <Image width={400} height={400}
                      src={editImageUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Skills & Tech Stack Tag Input in Edit Modal */}
              <div className="space-y-2 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>Tech Stack & Skill Badges</span>
                  </label>
                  <span className="text-[10px] text-slate-400">{editSkills.length} selected</span>
                </div>

                <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 rounded-xl bg-[#060810] border border-white/10">
                  {editSkills.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">No skills added. Type below to add.</span>
                  ) : (
                    editSkills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-500/15 border border-blue-500/30 text-blue-300"
                      >
                        <span>{s}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEditSkill(s)}
                          className="hover:text-white p-0.5 rounded"
                        >
                          &times;
                        </button>
                      </span>
                    ))
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type skill & press Enter..."
                    value={editSkillInput}
                    onChange={(e) => setEditSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        handleAddEditSkill(editSkillInput);
                      }
                    }}
                    className="text-xs h-8"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddEditSkill(editSkillInput)}
                    disabled={!editSkillInput.trim()}
                    className="h-8 px-2.5 text-xs shrink-0"
                  >
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1 pt-1 max-h-32 overflow-y-auto">
                  {(masterSkills.length > 0 ? masterSkills : [
                    { name: "React" }, { name: "Next.js" }, { name: "TypeScript" }, { name: "Node.js" },
                    { name: "Python" }, { name: "PostgreSQL" }, { name: "Tailwind CSS" }, { name: "Figma" }
                  ]).map((s: any) => {
                    const isSelected = editSkills.includes(s.name);
                    return (
                      <button
                        type="button"
                        key={s.id || s.name}
                        onClick={() => {
                          if (isSelected) {
                            handleRemoveEditSkill(s.name);
                          } else {
                            handleAddEditSkill(s.name);
                          }
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                          isSelected
                            ? "bg-blue-500/30 text-blue-200 border border-blue-500/50 font-semibold"
                            : "bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]"
                        }`}
                      >
                        {isSelected ? `✓ ${s.name}` : `+ ${s.name}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">About Role Overview</label>
                <textarea
                  rows={4}
                  value={editAbout}
                  onChange={(e) => setEditAbout(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#060810] p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.06]">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" isLoading={isSaving} className="bg-blue-600 hover:bg-blue-500">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
