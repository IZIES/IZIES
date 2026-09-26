"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  CheckCircle2,
  LogOut,
  Phone,
  Mail,
  Eye,
  MapPin,
  Sparkles,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumePreviewModal } from "@/components/public/ResumePreviewModal";
import {
  CandidateProfileTab,
  ProjectItem,
} from "@/components/candidate/CandidateProfileTab";
import { CandidateApplicationsTab } from "@/components/candidate/CandidateApplicationsTab";
import { CandidateEmailsTab } from "@/components/candidate/CandidateEmailsTab";
import { CandidateEmailModal } from "@/components/candidate/CandidateEmailModal";

function CandidateDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab =
    (searchParams.get("tab") as "applications" | "profile" | "emails") || "profile";

  const [candidate, setCandidate] = useState<any | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [openJobs, setOpenJobs] = useState<any[]>([]);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [applyToast, setApplyToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"applications" | "profile" | "emails">(
    initialTab
  );
  const [viewingCandidateEmail, setViewingCandidateEmail] = useState<any | null>(null);

  // Profile Form States
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [degree, setDegree] = useState("B.Tech");
  const [branch, setBranch] = useState("Computer Science");
  const [currentYear, setCurrentYear] = useState("3rd Year");
  const [graduationYear, setGraduationYear] = useState("2026");
  const [cgpa, setCgpa] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [bio, setBio] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Resume Preview Modal State
  const [previewOpen, setPreviewOpen] = useState(false);

  const fetchCandidateData = useCallback(() => {
    setLoading(true);
    fetch("/api/candidate/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.candidate) {
          const c = data.candidate;
          setCandidate(c);
          setApplications(data.applications || []);

          setFullName(c.fullName || "");
          setHeadline(c.headline || "");
          setLocation(c.location || "");
          setPhone(c.phone || "");
          setCollegeName(c.collegeName || "");
          setDegree(c.degree || "B.Tech");
          setBranch(c.branch || "Computer Science");
          setCurrentYear(c.currentYear || "3rd Year");
          setGraduationYear(c.graduationYear?.toString() || "2026");
          setCgpa(c.cgpa || "");
          setResumeUrl(c.resumeUrl || "");
          setSkills(Array.isArray(c.skills) ? c.skills : []);
          setProjects(Array.isArray(c.projects) ? c.projects : []);
          setGithubUrl(c.githubUrl || "");
          setLinkedInUrl(c.linkedInUrl || "");
          setPortfolioUrl(c.portfolioUrl || "");
          setTwitterUrl(c.twitterUrl || "");
          setBio(c.bio || "");
        } else {
          router.push("/candidate/login");
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    // Fetch open jobs for 1-click apply
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.jobs) {
          setOpenJobs(data.jobs);
        }
      })
      .catch(() => {});
  }, [router]);

  useEffect(() => {
    fetchCandidateData();
  }, [fetchCandidateData]);

  const handleLogout = async () => {
    await fetch("/api/candidate/logout", { method: "POST" });
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("candidate-auth-change"));
    }
    router.push("/candidate/login");
    router.refresh();
  };

  // Direct 1-Click Apply from Dashboard
  const handleDirectApply = async (jobId: string, jobTitle: string) => {
    if (!candidate) return;
    if (!resumeUrl || !collegeName) {
      alert("Please fill your College name and Resume link in your profile before applying.");
      setActiveTab("profile");
      return;
    }

    setApplyingJobId(jobId);
    setApplyToast(null);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          candidateId: candidate.id,
          consentGiven: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit application");
      }

      setApplyToast(`🎉 Successfully applied for ${jobTitle}!`);
      fetchCandidateData();
      setActiveTab("applications");
      setTimeout(() => setApplyToast(null), 5000);
    } catch (err: any) {
      alert(err.message || "Failed to apply");
    } finally {
      setApplyingJobId(null);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/candidate/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          headline,
          location,
          phone,
          collegeName,
          degree,
          branch,
          currentYear,
          graduationYear,
          cgpa,
          resumeUrl,
          skills,
          projects,
          githubUrl,
          linkedInUrl,
          portfolioUrl,
          twitterUrl,
          bio,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setCandidate(data.candidate);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Profile Completeness Calculation
  const completenessChecks = [
    Boolean(fullName),
    Boolean(phone),
    Boolean(collegeName),
    Boolean(degree && branch),
    Boolean(graduationYear),
    Boolean(resumeUrl),
    skills.length > 0,
    projects.length > 0,
    Boolean(githubUrl || linkedInUrl),
    Boolean(bio),
  ];
  const completedCount = completenessChecks.filter(Boolean).length;
  const completenessPercent = Math.round((completedCount / completenessChecks.length) * 100);

  if (loading) {
    return (
      <div className="py-24 max-w-6xl mx-auto px-6 space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-white/5 rounded-xl" />
        <div className="h-44 bg-white/5 rounded-3xl" />
        <div className="h-80 bg-white/5 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
      {/* Top Banner Header */}
      <div className="p-4 sm:p-8 rounded-3xl border border-white/10 bg-gradient-to-r from-[#0C1122] via-[#090D18] to-[#0D1226] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-[2px] shadow-xl shadow-blue-500/20 shrink-0">
              <div className="h-full w-full bg-[#080B14] rounded-[14px] flex items-center justify-center text-xl sm:text-2xl font-black text-white">
                {candidate?.fullName ? candidate.fullName.charAt(0).toUpperCase() : "S"}
              </div>
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight truncate">
                  {candidate?.fullName || "Student Profile"}
                </h1>
                <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Student Candidate</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                {headline || `${degree} in ${branch || "Engineering"} • Class of ${graduationYear}`}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                {candidate?.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>{candidate.email}</span>
                  </span>
                )}
                {phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-blue-400" />
                    <span>{phone}</span>
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{location}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {resumeUrl && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPreviewOpen(true)}
                className="gap-1.5 text-xs text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10 flex-1 sm:flex-initial"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Resume</span>
              </Button>
            )}
            <Link href="/jobs" className="flex-1 sm:flex-initial">
              <Button size="sm" className="w-full gap-2 bg-blue-600 hover:bg-blue-500 text-xs shadow-lg shadow-blue-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explore Internships</span>
              </Button>
            </Link>
            <Button
              size="sm"
              variant="outline"
              onClick={handleLogout}
              className="gap-1.5 text-xs text-slate-400 hover:text-white border-white/10"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Profile Completeness Bar */}
        <div className="mt-6 pt-5 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Profile Readiness:</span>
            <div className="w-32 sm:w-48 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${completenessPercent}%` }}
              />
            </div>
            <span className="font-semibold text-emerald-400">{completenessPercent}% Complete</span>
          </div>

          <div className="text-[11px] text-slate-400">
            {completenessPercent === 100
              ? "🚀 Profile 100% complete! You're ready for 1-click internship applications."
              : "💡 Add your college, resume link, skills, and projects to increase selection chances."}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {applyToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{applyToast}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === "profile"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <User className="w-4 h-4" />
          <span>My Profile & Resume</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("applications")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "applications"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Applied Jobs</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] text-white">
            {applications.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("emails")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === "emails"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Emails & Offer Letters</span>
        </button>
      </div>

      {/* TAB 1: PROFILE EDITOR */}
      {activeTab === "profile" && (
        <CandidateProfileTab
          fullName={fullName}
          setFullName={setFullName}
          headline={headline}
          setHeadline={setHeadline}
          phone={phone}
          setPhone={setPhone}
          location={location}
          setLocation={setLocation}
          bio={bio}
          setBio={setBio}
          collegeName={collegeName}
          setCollegeName={setCollegeName}
          degree={degree}
          setDegree={setDegree}
          branch={branch}
          setBranch={setBranch}
          currentYear={currentYear}
          setCurrentYear={setCurrentYear}
          graduationYear={graduationYear}
          setGraduationYear={setGraduationYear}
          cgpa={cgpa}
          setCgpa={setCgpa}
          resumeUrl={resumeUrl}
          setResumeUrl={setResumeUrl}
          skills={skills}
          setSkills={setSkills}
          projects={projects}
          setProjects={setProjects}
          githubUrl={githubUrl}
          setGithubUrl={setGithubUrl}
          linkedInUrl={linkedInUrl}
          setLinkedInUrl={setLinkedInUrl}
          portfolioUrl={portfolioUrl}
          setPortfolioUrl={setPortfolioUrl}
          twitterUrl={twitterUrl}
          setTwitterUrl={setTwitterUrl}
          isSaving={isSaving}
          saveSuccess={saveSuccess}
          onSaveProfile={handleSaveProfile}
          onOpenResumePreview={() => setPreviewOpen(true)}
        />
      )}

      {/* TAB 2: APPLIED JOBS & 1-CLICK APPLY */}
      {activeTab === "applications" && (
        <CandidateApplicationsTab
          applications={applications}
          openJobs={openJobs}
          applyingJobId={applyingJobId}
          onDirectApply={handleDirectApply}
        />
      )}

      {/* TAB 3: EMAILS & OFFER LETTERS TIMELINE */}
      {activeTab === "emails" && (
        <CandidateEmailsTab
          applications={applications}
          onViewEmail={(em) => setViewingCandidateEmail(em)}
        />
      )}

      {/* Candidate Email Viewer Modal */}
      <CandidateEmailModal
        email={viewingCandidateEmail}
        onClose={() => setViewingCandidateEmail(null)}
      />

      {/* Global Resume Live Preview Modal */}
      {resumeUrl && (
        <ResumePreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          candidateName={fullName || "Candidate"}
          resumeUrl={resumeUrl}
        />
      )}
    </div>
  );
}

export default function CandidateDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#070A11] text-slate-400">Loading Dashboard...</div>}>
      <CandidateDashboardContent />
    </Suspense>
  );
}
