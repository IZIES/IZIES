"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  Sparkles,
  Send,
  GraduationCap,
  Eye,
  LogIn,
  Edit2,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumePreviewModal } from "@/components/public/ResumePreviewModal";

interface InAppApplyModalProps {
  jobId: string;
  jobTitle: string;
  departmentName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function InAppApplyModal({
  jobId,
  jobTitle,
  departmentName,
  isOpen,
  onClose,
}: InAppApplyModalProps) {
  const [candidateSession, setCandidateSession] = useState<any | null>(null);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [coverLetter, setCoverLetter] = useState("");
  const [consentGiven, setConsentGiven] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Resume Preview
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setCheckingAuth(true);
    setErrorMessage(null);
    setIsSuccess(false);

    fetch("/api/candidate/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.candidate) {
          setCandidateSession(data.candidate);
          setMyApplications(data.applications || []);
        } else {
          setCandidateSession(null);
        }
      })
      .catch(() => setCandidateSession(null))
      .finally(() => setCheckingAuth(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const existingApp = myApplications.find((app) => app.jobId === jobId);
  const alreadyApplied = Boolean(existingApp);
  const isProfileComplete = Boolean(candidateSession?.collegeName && candidateSession?.resumeUrl);

  const handle1ClickApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateSession) return;

    if (!isProfileComplete) {
      setErrorMessage("Please complete your College name and Resume link in your profile before applying.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          candidateId: candidateSession.id,
          coverLetter: coverLetter.trim() || undefined,
          consentGiven,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit application");
      }

      setIsSuccess(true);
      setMyApplications((prev) => [...prev, data.application]);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
        <div className="relative w-full max-w-2xl bg-[#0B0F19] border border-white/10 rounded-3xl shadow-2xl my-8 overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-7 border-b border-white/[0.08] bg-gradient-to-r from-blue-950/40 via-transparent to-indigo-950/20 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {departmentName}
                </span>
                <span className="text-xs text-slate-400">⚡ 1-Click Application</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">{jobTitle}</h2>
              <p className="text-xs text-slate-400 mt-1">
                IZIES Internships — Direct In-App Submission
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8">
            {isSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Application Submitted! 🎉</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Your profile and resume link have been submitted to the recruitment team. You can track your application status in your Student Dashboard.
                </p>
                <div className="flex items-center justify-center gap-3 pt-3">
                  <Link href="/candidate/dashboard">
                    <Button onClick={onClose} className="gap-2">
                      <GraduationCap className="w-4 h-4" />
                      <span>Open Student Dashboard</span>
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                </div>
              </div>
            ) : checkingAuth ? (
              <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
                Verifying candidate profile...
              </div>
            ) : !candidateSession ? (
              /* NOT LOGGED IN */
              <div className="py-6 text-center space-y-6">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-xl font-bold text-white">Student Account Required</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    To apply for this role and future opportunities, please sign in or create your student candidate profile. Once created, you can apply in 1-click without re-entering your details!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Link href="/candidate/login" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto gap-2 px-6" onClick={onClose}>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In to Apply</span>
                    </Button>
                  </Link>
                  <Link href="/candidate/register" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto gap-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 px-6"
                      onClick={onClose}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Create Student Profile</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ) : alreadyApplied ? (
              /* ALREADY APPLIED */
              <div className="py-6 text-center space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">You Have Already Applied</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Your application is currently under review by our hiring managers.
                  </p>
                </div>
                <div className="pt-2">
                  <Link href="/candidate/dashboard">
                    <Button onClick={onClose} className="gap-2">
                      <GraduationCap className="w-4 h-4" />
                      <span>Track Status in Dashboard →</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ) : !isProfileComplete ? (
              /* INCOMPLETE PROFILE */
              <div className="py-6 text-center space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Incomplete Profile</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    Please add your College Name and Resume Link in your candidate profile before submitting your 1-click application.
                  </p>
                </div>
                <div className="pt-2">
                  <Link href="/candidate/dashboard">
                    <Button onClick={onClose} className="gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                      <Edit2 className="w-4 h-4" />
                      <span>Complete Profile in Dashboard →</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              /* READY TO 1-CLICK APPLY */
              <form onSubmit={handle1ClickApply} className="space-y-5">
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Profile Card */}
                <div className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#070A12] space-y-3">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Applying as</span>
                    </div>
                    <Link
                      href="/candidate/dashboard"
                      onClick={onClose}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Profile</span>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-semibold text-white block">{candidateSession.fullName}</span>
                      <span className="text-slate-400 text-[11px]">{candidateSession.email} • {candidateSession.phone}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-200 block truncate">{candidateSession.collegeName}</span>
                      <span className="text-slate-400 text-[11px]">
                        {candidateSession.degree} ({candidateSession.branch}) • {candidateSession.graduationYear}
                      </span>
                    </div>
                  </div>

                  {/* Resume preview pill */}
                  <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 overflow-hidden text-xs text-slate-300">
                      <LinkIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate text-[11px] text-slate-400 max-w-xs">{candidateSession.resumeUrl}</span>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setPreviewOpen(true)}
                      className="text-[11px] h-7 px-2.5 text-blue-400 border-blue-500/30"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      <span>Preview</span>
                    </Button>
                  </div>
                </div>

                {/* Optional Note */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Quick Note to Hiring Manager (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Mention any specific project or highlight..."
                    className="w-full rounded-xl border border-border bg-card/60 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </div>

                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="modal-consent"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-1 h-3.5 w-3.5 rounded border-border bg-card text-blue-500"
                    required
                  />
                  <label htmlFor="modal-consent" className="text-[11px] text-slate-400 cursor-pointer select-none">
                    I confirm my profile details are accurate and authorize IZIES to review my submission.
                  </label>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full gap-2 text-xs font-bold shadow-xl shadow-blue-500/20"
                >
                  <span>⚡ Submit 1-Click Application</span>
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Resume Live Preview Modal */}
      {candidateSession?.resumeUrl && (
        <ResumePreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          candidateName={candidateSession.fullName || "Candidate"}
          resumeUrl={candidateSession.resumeUrl}
        />
      )}
    </>
  );
}
