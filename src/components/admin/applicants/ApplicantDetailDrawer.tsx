"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  Linkedin,
  Github,
  GraduationCap,
  Eye,
  Sparkles,
  Inbox,
  RefreshCw,
  FileText,
  FileCheck,
  Edit3,
  Sliders,
  Send,
  X,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ApplicantDetailDrawerProps {
  applicant: any | null;
  onClose: () => void;
  onOpenResumePreview: (name: string, url: string) => void;
  onOpenOfferLetterModal: () => void;
  onOpenEmailPreview: () => void;
  onViewSentEmail: (email: any) => void;
  emailHistory: any[];
  loadingEmails: boolean;
  onRefreshEmails: () => void;
  // Status Update Handlers
  newStatus: string;
  setNewStatus: (s: string) => void;
  isUpdatingStatus: boolean;
  onUpdateStatus: (statusOverride?: string) => void;
  emailFeedback: string | null;
  // Notes
  newNote: string;
  setNewNote: (n: string) => void;
  isAddingNote: boolean;
  onAddNote: (e: React.FormEvent) => void;
  firstCallNotes: string;
  setFirstCallNotes: (n: string) => void;
  // Email Customization
  sendEmailNotification: boolean;
  setSendEmailNotification: (b: boolean) => void;
  emailDispatchMode: "QUEUE" | "IMMEDIATE" | "NONE";
  setEmailDispatchMode: (m: "QUEUE" | "IMMEDIATE" | "NONE") => void;
  customEmailNote: string;
  setCustomEmailNote: (n: string | ((prev: string) => string)) => void;
  // Offer Builder Props
  offerSalary: string;
  setOfferSalary: (s: string) => void;
  offerJoiningDate: string;
  setOfferJoiningDate: (s: string) => void;
  offerLocation: string;
  setOfferLocation: (s: string) => void;
  offerTerms: string;
  setOfferTerms: (s: string) => void;
  offerProbation: string;
  setOfferProbation: (s: string) => void;
  offerWorkingHours: string;
  setOfferWorkingHours: (s: string) => void;
  offerNoticePeriod: string;
  setOfferNoticePeriod: (s: string) => void;
  offerSignatory: string;
  setOfferSignatory: (s: string) => void;
  forceOfferEditor: boolean;
  setForceOfferEditor: (b: boolean) => void;
  isSavingOffer: boolean;
  offerSaveFeedback: string | null;
  onSaveOfferLetter: (mode: "QUEUE" | "IMMEDIATE" | "NONE") => void;
}

export function ApplicantDetailDrawer({
  applicant,
  onClose,
  onOpenResumePreview,
  onOpenOfferLetterModal,
  onOpenEmailPreview,
  onViewSentEmail,
  emailHistory,
  loadingEmails,
  onRefreshEmails,
  newStatus,
  setNewStatus,
  isUpdatingStatus,
  onUpdateStatus,
  emailFeedback,
  newNote,
  setNewNote,
  isAddingNote,
  onAddNote,
  firstCallNotes,
  setFirstCallNotes,
  sendEmailNotification,
  setSendEmailNotification,
  emailDispatchMode,
  setEmailDispatchMode,
  customEmailNote,
  setCustomEmailNote,
  offerSalary,
  setOfferSalary,
  offerJoiningDate,
  setOfferJoiningDate,
  offerLocation,
  setOfferLocation,
  offerTerms,
  setOfferTerms,
  offerProbation,
  setOfferProbation,
  offerWorkingHours,
  setOfferWorkingHours,
  offerNoticePeriod,
  setOfferNoticePeriod,
  offerSignatory,
  setOfferSignatory,
  forceOfferEditor,
  setForceOfferEditor,
  isSavingOffer,
  offerSaveFeedback,
  onSaveOfferLetter,
}: ApplicantDetailDrawerProps) {
  if (!applicant) return null;

  const statusVariant = (status: string): "default" | "secondary" | "outline" | "success" | "warning" | "danger" | "purple" => {
    switch (status) {
      case "HIRED":
      case "SELECTED":
        return "success";
      case "INTERVIEW":
        return "purple";
      case "FIRST_CALL":
        return "warning";
      case "REJECTED":
        return "danger";
      default:
        return "secondary";
    }
  };

  const isEmailAlreadySentForStage = emailHistory.some(
    (em) => em.stage === newStatus && (em.status === "SENT" || em.status === "QUEUED")
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0B0F19] border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-8 my-8 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={statusVariant(applicant.status)}>{applicant.status}</Badge>
              <span className="text-xs text-slate-400">{applicant.job?.title}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">{applicant.fullName}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <a href={`mailto:${applicant.email}`} className="hover:text-white">
                  {applicant.email}
                </a>
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{applicant.phone}</span>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* College / Education Box */}
        <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/20 space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
            <GraduationCap className="w-4 h-4" />
            <span>College Student Credentials</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">College</span>
              <span className="font-semibold text-white">{applicant.collegeName || "Not provided"}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Degree & Branch</span>
              <span className="font-semibold text-white">
                {applicant.degree || "B.Tech"} {applicant.branch ? `(${applicant.branch})` : ""}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Graduation Year</span>
              <span className="font-semibold text-white">{applicant.graduationYear || "2026"}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">CGPA / Score</span>
              <span className="font-semibold text-emerald-400">{applicant.cgpa || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Links & Resume Live Preview Button */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={() => onOpenResumePreview(applicant.fullName, applicant.resumeUrl)}
              className="gap-2 text-xs bg-blue-600 hover:bg-blue-500"
            >
              <Eye className="w-4 h-4" />
              <span>Open Live Resume Preview</span>
            </Button>
            <a
              href={applicant.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1"
            >
              <span>Direct URL</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-3">
            {applicant.githubUrl && (
              <a
                href={applicant.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}
            {applicant.linkedInUrl && (
              <a
                href={applicant.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </div>

        {/* Candidate Skills, Note & Projects */}
        {((applicant.candidate?.skills && applicant.candidate.skills.length > 0) ||
          applicant.coverLetter ||
          applicant.candidate?.headline) && (
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            {applicant.candidate?.headline && (
              <p className="text-xs font-semibold text-white">{applicant.candidate.headline}</p>
            )}
            {applicant.candidate?.skills && applicant.candidate.skills.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                  Verified Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {applicant.candidate.skills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[11px] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {applicant.coverLetter && (
              <div className="space-y-1 pt-1 border-t border-white/[0.04]">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                  Candidate Cover Note:
                </span>
                <p className="text-xs text-slate-300 italic bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04]">
                  &quot;{applicant.coverLetter}&quot;
                </p>
              </div>
            )}
          </div>
        )}

        {/* STAGE TRANSITION & AUTOMATED EMAIL NOTIFICATION SECTION */}
        <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-[#0F1528] to-[#0A0D18] border border-blue-500/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>Stage Transition & Candidate Email Workflow</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Select next stage. Automated stage email will be prepared with duplicate prevention.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenEmailPreview}
              className="h-8 text-xs border-blue-500/40 text-blue-300 hover:bg-blue-500/10 gap-1.5 shrink-0"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview Email Template</span>
            </Button>
          </div>

          {/* Stage Buttons */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Target Stage:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                disabled={isUpdatingStatus}
                onClick={() => setNewStatus("FIRST_CALL")}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  newStatus === "FIRST_CALL"
                    ? "bg-amber-500/20 border-amber-500 text-amber-200 ring-1 ring-amber-500"
                    : "bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.05]"
                }`}
              >
                <div className="font-semibold text-xs flex items-center gap-1.5">
                  <span>📞</span> First Call
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {applicant.status === "FIRST_CALL" ? "(Current Stage)" : "Screening invitation"}
                </div>
              </button>

              <button
                type="button"
                disabled={isUpdatingStatus}
                onClick={() => setNewStatus("INTERVIEW")}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  newStatus === "INTERVIEW"
                    ? "bg-purple-500/20 border-purple-500 text-purple-200 ring-1 ring-purple-500"
                    : "bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.05]"
                }`}
              >
                <div className="font-semibold text-xs flex items-center gap-1.5">
                  <span>💻</span> Interview
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {applicant.status === "INTERVIEW" ? "(Current Stage)" : "Technical round"}
                </div>
              </button>

              <button
                type="button"
                disabled={isUpdatingStatus}
                onClick={() => setNewStatus("HIRED")}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  newStatus === "HIRED" || newStatus === "SELECTED"
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500"
                    : "bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.05]"
                }`}
              >
                <div className="font-semibold text-xs flex items-center gap-1.5">
                  <span>🎉</span> Offer / Hire
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {applicant.status === "HIRED" || applicant.status === "SELECTED" ? "(Current Stage)" : "Official appointment"}
                </div>
              </button>

              <button
                type="button"
                disabled={isUpdatingStatus}
                onClick={() => setNewStatus("REJECTED")}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  newStatus === "REJECTED"
                    ? "bg-rose-500/20 border-rose-500 text-rose-200 ring-1 ring-rose-500"
                    : "bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.05]"
                }`}
              >
                <div className="font-semibold text-xs flex items-center gap-1.5">
                  <span>❌</span> Pass / Archive
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {applicant.status === "REJECTED" ? "(Current Stage)" : "Respectful update"}
                </div>
              </button>
            </div>
          </div>

          {/* Quick Toggle Offer Editor Option */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/30 via-[#0A0D18] to-blue-950/30 border border-emerald-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <FileCheck className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-white block">
                  Candidate Letter of Appointment & Offer
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Customize salary, joining date, and terms.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/admin/emails"
                target="_blank"
                className="text-[11px] text-emerald-300 hover:underline hidden sm:inline-flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20"
              >
                <Sliders className="w-3 h-3" />
                <span>Master Offer Rules</span>
              </Link>
              <Button
                type="button"
                size="sm"
                onClick={() => setForceOfferEditor(!forceOfferEditor)}
                variant="outline"
                className="text-xs h-7 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>
                  {forceOfferEditor || newStatus === "HIRED" || applicant.status === "HIRED"
                    ? "Offer Editor Active"
                    : "✏️ Edit Offer Letter"}
                </span>
              </Button>
            </div>
          </div>

          {/* OFFICIAL OFFER LETTER BUILDER */}
          {(forceOfferEditor ||
            newStatus === "HIRED" ||
            newStatus === "SELECTED" ||
            applicant.status === "HIRED" ||
            applicant.status === "SELECTED") && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-[#0A0D18] border border-emerald-500/30 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/20 pb-2.5">
                <div>
                  <h5 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span>Official Offer Letter & Rules Editor</span>
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Customize remuneration model, joining date, and policies.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={onOpenOfferLetterModal}
                    className="h-7 text-[11px] border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 gap-1.5 shrink-0"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Preview Live Letter</span>
                  </Button>
                  <a
                    href={`/candidate/offer/${applicant.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Candidate View</span>
                  </a>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOfferSalary("Unpaid (Experience & Certificate of Completion)");
                    setOfferTerms(
                      "1-on-1 Engineering Mentorship, Official Experience Certificate, Milestone-based LOR, and Fast-Track PPO Evaluation."
                    );
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    offerSalary.toLowerCase().includes("unpaid") ||
                    offerSalary.includes("0") ||
                    offerSalary.toLowerCase().includes("experience")
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold"
                      : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  ✨ Unpaid (Experience & LOR - Default)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOfferSalary("Performance Milestone Incentives");
                    setOfferTerms(
                      "Performance rewards upon sprint deliveries, architecture mentorship, and experience certificate."
                    );
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    offerSalary.toLowerCase().includes("performance")
                      ? "bg-purple-500/20 border-purple-500/50 text-purple-300 font-bold"
                      : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  🏆 Performance Milestone Based
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOfferSalary("₹25,000 / month (Stipend)");
                    setOfferTerms("Health insurance coverage, flexible hours, and hardware workstation.");
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    offerSalary.includes("₹")
                      ? "bg-blue-500/20 border-blue-500/50 text-blue-300 font-bold"
                      : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  💼 Custom Stipend / Amount
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                    Gross Remuneration / Model:
                  </label>
                  <Input
                    placeholder="e.g. Unpaid (Experience & Certificate)"
                    value={offerSalary}
                    onChange={(e) => setOfferSalary(e.target.value)}
                    className="text-xs h-8 bg-card/60 border-emerald-500/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                    Expected Date of Joining:
                  </label>
                  <Input
                    placeholder="e.g. 1st October 2026"
                    value={offerJoiningDate}
                    onChange={(e) => setOfferJoiningDate(e.target.value)}
                    className="text-xs h-8 bg-card/60 border-emerald-500/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                    Work Location / Mode:
                  </label>
                  <Input
                    placeholder="e.g. Remote (India) / Hybrid"
                    value={offerLocation}
                    onChange={(e) => setOfferLocation(e.target.value)}
                    className="text-xs h-8 bg-card/60 border-emerald-500/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                    Working Hours & Cadence:
                  </label>
                  <Input
                    placeholder="e.g. Flexible (20–40 Hours / Week)"
                    value={offerWorkingHours}
                    onChange={(e) => setOfferWorkingHours(e.target.value)}
                    className="text-xs h-8 bg-card/60 border-emerald-500/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                    Probation / Review Duration:
                  </label>
                  <Input
                    placeholder="e.g. Three (3) Months"
                    value={offerProbation}
                    onChange={(e) => setOfferProbation(e.target.value)}
                    className="text-xs h-8 bg-card/60 border-emerald-500/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                    Notice Period:
                  </label>
                  <Input
                    placeholder="e.g. Fifteen (15) Days"
                    value={offerNoticePeriod}
                    onChange={(e) => setOfferNoticePeriod(e.target.value)}
                    className="text-xs h-8 bg-card/60 border-emerald-500/20 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                  Special Terms & Leadership Perks:
                </label>
                <textarea
                  rows={2}
                  value={offerTerms}
                  onChange={(e) => setOfferTerms(e.target.value)}
                  className="w-full rounded-xl border border-emerald-500/20 bg-card/60 p-2.5 text-xs text-foreground focus:outline-none"
                />
              </div>

              {offerSaveFeedback && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{offerSaveFeedback}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-emerald-500/20">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onSaveOfferLetter("NONE")}
                  isLoading={isSavingOffer}
                  className="text-xs h-8 border-white/10 text-slate-300 hover:text-white"
                >
                  Save in DB Only
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onSaveOfferLetter("QUEUE")}
                  isLoading={isSavingOffer}
                  className="text-xs h-8 bg-blue-600 hover:bg-blue-500 text-white font-medium"
                >
                  Save & Queue in Outbox
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onSaveOfferLetter("IMMEDIATE")}
                  isLoading={isSavingOffer}
                  className="text-xs h-8 bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                >
                  Save & Send Immediately
                </Button>
              </div>
            </div>
          )}

          {/* Email Options Panel */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-white block">
                Candidate Notification & Outbox Dispatch Mode:
              </span>
              {isEmailAlreadySentForStage && (
                <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-500/30 bg-amber-500/10">
                  ✓ Stage Email Already Sent/Queued
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSendEmailNotification(true);
                  setEmailDispatchMode("QUEUE");
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  sendEmailNotification && emailDispatchMode === "QUEUE"
                    ? "bg-blue-500/20 border-blue-500 text-white ring-1 ring-blue-500"
                    : "bg-white/[0.02] border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <div className="text-xs font-bold flex items-center gap-1.5 text-blue-300">
                  <span>📬</span>
                  <span>Queue in Outbox</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  Add to Pending Outbox list to review & batch send later.
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSendEmailNotification(true);
                  setEmailDispatchMode("IMMEDIATE");
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  sendEmailNotification && emailDispatchMode === "IMMEDIATE"
                    ? "bg-emerald-500/20 border-emerald-500 text-white ring-1 ring-emerald-500"
                    : "bg-white/[0.02] border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <div className="text-xs font-bold flex items-center gap-1.5 text-emerald-300">
                  <span>⚡</span>
                  <span>Send Immediately</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  Dispatch email right now to candidate.
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSendEmailNotification(false);
                  setEmailDispatchMode("NONE");
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  !sendEmailNotification || emailDispatchMode === "NONE"
                    ? "bg-slate-800/60 border-slate-600 text-slate-200 ring-1 ring-slate-600"
                    : "bg-white/[0.02] border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <div className="text-xs font-bold flex items-center gap-1.5 text-slate-300">
                  <span>🔕</span>
                  <span>Do Not Send Mail</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  Update status in DB only, no mail sent.
                </div>
              </button>
            </div>

            {sendEmailNotification && emailDispatchMode !== "NONE" && (
              <div className="space-y-2 pt-1 border-t border-white/[0.04]">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Custom Note / Google Meet & Schedule Details:
                  </label>
                  <button
                    type="button"
                    onClick={onOpenEmailPreview}
                    className="text-[11px] text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Preview with Note</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pb-1">
                  <span className="text-[10px] text-slate-500 font-semibold">Quick Schedule Helpers:</span>
                  <input
                    type="datetime-local"
                    className="text-[11px] h-7 rounded-lg border border-blue-500/30 bg-card/60 px-2 text-white focus:outline-none focus:border-blue-500 cursor-pointer [color-scheme:dark]"
                    onChange={(e) => {
                      if (e.target.value) {
                        const dt = new Date(e.target.value);
                        const formatted =
                          dt.toLocaleString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }) + " IST";
                        setCustomEmailNote((prev: string) =>
                          prev ? `${prev}\nScheduled Time: ${formatted}` : `Scheduled Call Time: ${formatted}`
                        );
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCustomEmailNote((prev: string) =>
                        prev
                          ? `${prev}\nGoogle Meet Link: https://meet.google.com/izies-pairing`
                          : `Google Meet Link: https://meet.google.com/izies-pairing`
                      );
                    }}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 font-medium"
                  >
                    + Add Meet Link
                  </button>
                </div>

                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-border bg-card/60 p-2.5 text-xs text-foreground focus:outline-none"
                  placeholder="e.g. Google Meet Link: https://meet.google.com/abc-xyz | Scheduled Time: Friday at 3:00 PM IST."
                  value={customEmailNote}
                  onChange={(e) => setCustomEmailNote(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Internal First Call / Review Notes */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              Internal Review Notes (Only visible to hiring team):
            </label>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-border bg-card/60 p-2.5 text-xs text-foreground focus:outline-none"
              placeholder="e.g. Spoke with candidate: strong React skills, answers well, approved for next stage."
              value={firstCallNotes}
              onChange={(e) => setFirstCallNotes(e.target.value)}
            />
          </div>

          {/* Feedback Alert */}
          {emailFeedback && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{emailFeedback}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => onUpdateStatus()}
              isLoading={isUpdatingStatus}
              className="text-xs bg-blue-600 hover:bg-blue-500 gap-1.5 px-4"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                Confirm Status & {sendEmailNotification ? "Send Stage Email" : "Update Status"}
              </span>
            </Button>
          </div>
        </div>

        {/* EMAIL DISPATCH HISTORY TIMELINE */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Inbox className="w-4 h-4 text-purple-400" />
              <span>Dispatched Stage Emails History ({emailHistory.length})</span>
            </h4>
            <button
              type="button"
              onClick={onRefreshEmails}
              className="text-[11px] text-slate-400 hover:text-white inline-flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${loadingEmails ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>

          {loadingEmails ? (
            <p className="text-xs text-slate-500 italic py-2">Loading email history...</p>
          ) : emailHistory.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-1">
              No automated stage emails recorded yet for this applicant.
            </p>
          ) : (
            <div className="space-y-2">
              {emailHistory.map((em) => (
                <div
                  key={em.id}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={statusVariant(em.stage)}>{em.stage}</Badge>
                      <span className="font-semibold text-white">{em.subject}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>To: {em.recipient}</span>
                      <span>•</span>
                      <span>{new Date(em.sentAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewSentEmail(em)}
                    className="h-7 text-[11px] border-white/10 shrink-0 gap-1 self-start sm:self-center"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View Sent Email</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Internal Team Notes */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
            <span>Interview Team Internal Notes</span>
          </h4>

          <form onSubmit={onAddNote} className="flex gap-2">
            <Input
              placeholder="Add interview score, assignment review, or remarks..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="text-xs h-9"
            />
            <Button type="submit" size="sm" isLoading={isAddingNote} className="shrink-0 gap-1 h-9">
              <span>Add Note</span>
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>

          <div className="space-y-2 max-h-36 overflow-y-auto">
            {applicant.notes && applicant.notes.length > 0 ? (
              applicant.notes.map((n: any) => (
                <div
                  key={n.id}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold text-blue-400">{n.author?.name || "Hiring Lead"}</span>
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-200">{n.content}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No notes added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
