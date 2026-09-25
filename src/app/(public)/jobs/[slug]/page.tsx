"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Briefcase,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Link as LinkIcon,
  Send,
  AlertCircle,
  GraduationCap,
  Eye,
  LogIn,
  UserCheck,
  Edit2,
  ExternalLink,
  ChevronRight,
  Shield,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JobDetail } from "@/types";
import dynamic from "next/dynamic";
const ResumePreviewModal = dynamic(
  () => import("@/components/public/ResumePreviewModal").then((mod) => mod.ResumePreviewModal),
  { ssr: false }
);
import Image from "next/image";

export default function JobDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Candidate Session & Applications
  const [candidate, setCandidate] = useState<any | null>(null);
  const [candidateApplications, setCandidateApplications] = useState<any[]>([]);
  const [checkingCandidate, setCheckingCandidate] = useState(true);

  // 1-Click Application State
  const applySectionRef = useRef<HTMLDivElement>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [consentGiven, setConsentGiven] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Resume Preview Modal State
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/jobs/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setJob(data.job);
        } else {
          setError(data.error || "Job not found");
        }
      })
      .catch(() => setError("Failed to fetch job details"))
      .finally(() => setLoading(false));

    // Fetch Candidate Profile & Existing Applications
    fetch("/api/candidate/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.candidate) {
          setCandidate(data.candidate);
          setCandidateApplications(data.applications || []);
        }
      })
      .catch(() => {})
      .finally(() => setCheckingCandidate(false));
  }, [slug]);

  const scrollToApply = () => {
    applySectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Check if candidate already applied to this specific job
  const existingApplication = job && candidateApplications.find((app) => app.jobId === job.id);
  const alreadyApplied = Boolean(existingApplication);

  // Check if profile is complete (has college and resume link)
  const isProfileComplete = Boolean(candidate?.collegeName && candidate?.resumeUrl);

  const handleOneClickApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job || !candidate) return;

    if (!isProfileComplete) {
      setSubmitError("Please complete your College name and Resume link in your profile before applying.");
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          candidateId: candidate.id,
          coverLetter: coverLetter.trim() || undefined,
          consentGiven,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Submission failed");
      }

      setSubmitSuccess(true);
      // Update local applications list
      setCandidateApplications((prev) => [...prev, data.application]);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 max-w-4xl mx-auto px-6 space-y-8 animate-pulse">
        <div className="h-6 w-32 bg-white/5 rounded-full" />
        <div className="h-12 w-3/4 bg-white/5 rounded-2xl" />
        <div className="h-56 bg-white/5 rounded-3xl" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto px-6">
        <h2 className="text-2xl font-bold text-white">Requisition Not Found</h2>
        <p className="text-sm text-slate-400">
          {error || "This position might have been filled or the link has expired."}
        </p>
        <Link href="/jobs">
          <Button variant="outline" className="gap-2 rounded-xl border-white/10">
            <ArrowLeft className="w-4 h-4" />
            <span>Explore All Open Requisitions</span>
          </Button>
        </Link>
      </div>
    );
  }

  const formatType = (type: string) => {
    return type.replace("_", " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="py-12 sm:py-16 px-6 max-w-5xl mx-auto min-h-screen">
      {/* Back Link */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Open Roles & Internships</span>
      </Link>

      {/* Header Banner */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0A0E1A]/95 shadow-2xl mb-10 sm:mb-12 overflow-hidden backdrop-blur-xl">
        {job.imageUrl && (
          <div className="relative h-56 sm:h-72 md:h-80 w-full overflow-hidden bg-[#060810] border-b border-white/[0.08]">
            <Image
              width={800}
              height={400}
              src={job.imageUrl}
              alt={job.title}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLElement).parentElement!.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-[#0A0E1A]/40 to-transparent" />
          </div>
        )}

        <div className="p-6 sm:p-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                {job.department.name}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.04] text-slate-300 border border-white/[0.08]">
                {formatType(job.workplaceType)}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.04] text-slate-300 border border-white/[0.08]">
                {formatType(job.employmentType)}
              </span>
            </div>
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Accepting Applications</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs sm:text-sm text-slate-300 pt-2 border-t border-white/[0.06]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span>{formatType(job.experienceLevel)}</span>
            </div>
            {job.salaryRange && (
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>{job.salaryRange}</span>
              </div>
            )}
          </div>

          {/* Tech Stack / Skill Badges */}
          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Tech Stack:</span>
              </span>
              {job.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              size="lg"
              onClick={scrollToApply}
              className="w-full sm:w-auto gap-2 px-8 h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold shadow-lg shadow-indigo-600/25"
            >
              <span>{alreadyApplied ? "View Application Status" : "Apply In-App for this Role"}</span>
              <Send className="w-4 h-4" />
            </Button>

            {!candidate && (
              <Link href={`/candidate/register?redirect=/jobs/${slug}`} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto gap-2 text-xs h-12 rounded-xl border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Create Student Profile for 1-Click Apply</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-12 mb-16 text-slate-300 leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">About the Role</h2>
          <p className="text-base text-slate-400 leading-relaxed font-normal">{job.aboutRole}</p>
        </section>

        {/* Dedicated Tech Stack Section */}
        {job.skills && job.skills.length > 0 && (
          <section className="space-y-4 p-6 sm:p-8 rounded-3xl border border-white/[0.08] bg-[#0C1020]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Required Tech Stack & Architecture
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              You will work hands-on with these modern frameworks, languages, and developer tools:
            </p>
            <div className="flex flex-wrap gap-2.5 pt-2">
              {job.skills.map((skill: string) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all duration-200"
                >
                  <span className="h-2 w-2 rounded-full bg-indigo-400" />
                  <span className="text-sm font-bold text-white">{skill}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {job.responsibilities?.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">Core Responsibilities</h2>
            <ul className="space-y-3">
              {job.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {job.requirements?.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">Candidate Profile & Qualifications</h2>
            <ul className="space-y-3">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {job.benefits?.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">Perks & Compensation</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {job.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-2xl border border-white/[0.06] bg-[#0A0E1A]"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">{benefit}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 1-CLICK APPLICATION SECTION */}
      <div ref={applySectionRef} className="pt-8 border-t border-white/[0.08]">
        <div className="p-6 sm:p-10 rounded-3xl border border-indigo-500/20 bg-[#0A0E1A] shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="space-y-2 mb-6 sm:mb-8">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                Seamless 1-Click Application
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Apply for {job.title}
            </h2>
            <p className="text-xs text-slate-400">
              No repetitive forms! Your verified student profile and resume link are submitted directly to our hiring leads.
            </p>
          </div>

          {/* SCENARIO 1: APPLICATION SUBMITTED JUST NOW */}
          {submitSuccess ? (
            <div className="py-12 text-center space-y-5">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Application Successfully Submitted! 🎉</h3>
                <p className="text-sm text-slate-400 max-w-lg mx-auto">
                  Your student profile, college credentials, and resume link have been received by the IZIES team.
                  Our recruiters will review your submission and schedule the First Call.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <Link href="/candidate/dashboard">
                  <Button className="gap-2 rounded-xl bg-indigo-600 text-white">
                    <GraduationCap className="w-4 h-4" />
                    <span>Track in Candidate Dashboard →</span>
                  </Button>
                </Link>
                <Link href="/jobs">
                  <Button variant="outline" className="rounded-xl border-white/10">Browse More Opportunities</Button>
                </Link>
              </div>
            </div>
          ) : !candidate ? (
            /* SCENARIO 2: NOT LOGGED IN -> REQUIRE CANDIDATE LOGIN/REGISTER */
            <div className="p-8 sm:p-10 rounded-2xl border border-white/10 bg-[#060810] text-center space-y-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <GraduationCap className="w-7 h-7" />
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-xl font-bold text-white">Candidate Account Required to Apply</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  To apply for this role and access all opportunities at IZIES, please sign in or create your candidate profile with your resume details.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left text-xs text-slate-300">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <span className="font-semibold text-indigo-400 block mb-1">⚡ 1-Click Apply</span>
                  Fill your profile once, apply everywhere.
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <span className="font-semibold text-cyan-400 block mb-1">📄 Resume Preview</span>
                  Google Drive / PDF embedded preview.
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <span className="font-semibold text-emerald-400 block mb-1">📞 Fast Tracking</span>
                  Real-time interview pipeline status.
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <Link href={`/candidate/login?redirect=/jobs/${slug}`} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto gap-2 px-6 rounded-xl bg-indigo-600 text-white">
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Apply</span>
                  </Button>
                </Link>
                <Link href={`/candidate/register?redirect=/jobs/${slug}`} className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 px-6 rounded-xl">
                    <GraduationCap className="w-4 h-4" />
                    <span>Create Profile</span>
                  </Button>
                </Link>
              </div>
            </div>
          ) : alreadyApplied ? (
            /* SCENARIO 3: ALREADY APPLIED */
            <div className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] text-center space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">You Have Already Applied for This Position!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Status: <span className="text-emerald-400 font-semibold">{existingApplication?.status || "APPLIED"}</span>
                </p>
              </div>
              <div className="pt-2">
                <Link href="/candidate/dashboard">
                  <Button className="gap-2 rounded-xl bg-indigo-600 text-white">
                    <GraduationCap className="w-4 h-4" />
                    <span>Track Status in Dashboard →</span>
                  </Button>
                </Link>
              </div>
            </div>
          ) : !isProfileComplete ? (
            /* SCENARIO 4: LOGGED IN BUT INCOMPLETE PROFILE */
            <div className="p-8 rounded-2xl border border-amber-500/30 bg-amber-500/[0.05] space-y-4 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-lg font-bold text-white">Complete Your Profile to Apply</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your profile is missing your College Name or Resume Link. Please update your profile once to unlock 1-click applications.
                </p>
              </div>
              <Link href="/candidate/dashboard">
                <Button className="gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl">
                  <Edit2 className="w-4 h-4" />
                  <span>Update Profile & Add Resume Link →</span>
                </Button>
              </Link>
            </div>
          ) : (
            /* SCENARIO 5: READY FOR 1-CLICK APPLY */
            <form onSubmit={handleOneClickApply} className="space-y-6">
              {submitError && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{submitError}</p>
                </div>
              )}

              {/* Profile Card Summary */}
              <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-[#060810] space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    <UserCheck className="w-4 h-4" />
                    <span>Your Verified Profile</span>
                  </div>
                  <Link
                    href="/candidate/dashboard"
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Profile</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Candidate:</span>
                    <span className="font-semibold text-white text-sm">{candidate.fullName}</span>
                    <span className="text-slate-400 block mt-0.5">{candidate.email} • {candidate.phone || "No phone"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Education:</span>
                    <span className="font-semibold text-white">{candidate.collegeName || "Not specified"}</span>
                    <span className="text-slate-400 block mt-0.5">{candidate.degree} in {candidate.branch} ({candidate.graduationYear})</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-slate-400">Attached Resume:</span>
                    <span className="text-indigo-300 font-mono truncate max-w-[200px]">{candidate.resumeUrl}</span>
                  </div>
                  {candidate.resumeUrl && (
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(true)}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Cover Note */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Quick Note / Key Highlights (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Share a brief note about why you're interested in IZIES or link to a standout project..."
                  className="w-full p-4 rounded-2xl bg-[#060810] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>

              {/* Consent Checkbox */}
              <label className="flex items-start gap-3 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 bg-black/40 text-indigo-600 focus:ring-indigo-500"
                />
                <span>
                  I confirm my candidate information is accurate and agree to allow IZIES to contact me regarding this application.
                </span>
              </label>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold shadow-lg shadow-indigo-600/25"
              >
                {isSubmitting ? "Transmitting Profile..." : "Submit 1-Click Application 🚀"}
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Resume Preview Modal */}
      {candidate?.resumeUrl && (
        <ResumePreviewModal
          resumeUrl={candidate.resumeUrl}
          candidateName={candidate.fullName}
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  );
}
