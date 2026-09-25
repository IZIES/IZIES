"use client";

import React, { useState } from "react";
import {
  X,
  Edit3,
  RotateCcw,
  Eye,
  Save,
  Trash2,
  Plus,
  Send,
  Video,
  Calendar,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StageTemplateConfig } from "@/lib/template-types";
import { getStageVariant } from "./types";

interface TemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingStage: string | null;
  templateForm: StageTemplateConfig | null;
  onFormChange: (form: StageTemplateConfig) => void;
  onSave: () => void;
  onReset: () => void;
  onPreviewStage?: (stage: string) => void;
  onOpenTestEmailModal?: (stage: string) => void;
  isSaving: boolean;
  feedback: string | null;
}

export function TemplateEditorModal({
  isOpen,
  onClose,
  editingStage,
  templateForm,
  onFormChange,
  onSave,
  onReset,
  onOpenTestEmailModal,
  isSaving,
  feedback,
}: TemplateEditorModalProps) {
  const [newNextStepItem, setNewNextStepItem] = useState("");
  const [previewTab, setPreviewTab] = useState<"html" | "text">("html");

  if (!isOpen || !templateForm || !editingStage) return null;

  // Sample merge variables for live preview rendering
  const vars: Record<string, string> = {
    candidateName: "Rahul Sharma",
    jobTitle: "Senior Full-Stack Engineer",
    departmentName: "Core Platform",
    collegeName: "IIT Delhi",
    graduationYear: "2025",
    salary: "Unpaid (Experience & Certificate of Completion)",
    joiningDate: "1st October 2026",
    location: "Remote (India)",
    dashboardUrl: "http://localhost:3005/candidate/dashboard",
    offerUrl: "http://localhost:3005/candidate/offer/sample-id",
  };

  const replacePlaceholders = (str: string) => {
    if (!str) return "";
    let out = str;
    for (const [k, v] of Object.entries(vars)) {
      out = out.replaceAll(`{${k}}`, v || "");
    }
    return out;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-7xl bg-[#0B0F19] border border-white/15 rounded-3xl shadow-2xl p-4 sm:p-6 my-4 max-h-[95vh] flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={getStageVariant(editingStage)}>{editingStage}</Badge>
              <span className="text-xs text-blue-400 font-semibold flex items-center gap-1">
                <Edit3 className="w-3.5 h-3.5" />
                <span>Side-by-Side Template Editor & Live Inbox Preview</span>
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Customize Email Template for: {editingStage} Stage
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Edit subject, meeting links, dates, and callouts on the left. Watch the live rendered client email update in real-time on the right!
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenTestEmailModal && (
              <Button
                type="button"
                size="sm"
                onClick={() => onOpenTestEmailModal(editingStage)}
                className="text-xs h-8 bg-blue-600 hover:bg-blue-500 text-white gap-1.5 font-medium"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Test Email</span>
              </Button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2-Column Grid Layout: Left = Form Controls, Right = Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden min-h-0">
          {/* LEFT COLUMN: EDIT FORM CONTROLS */}
          <div className="space-y-4 overflow-y-auto pr-2 max-h-[68vh]">
            {/* Merge Tag Hints */}
            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs">
              <span className="text-blue-300 font-semibold block mb-1">
                💡 Available Dynamic Merge Tags (Click or copy into fields):
              </span>
              <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                {["{candidateName}", "{jobTitle}", "{departmentName}", "{salary}", "{joiningDate}", "{location}", "{dashboardUrl}", "{offerUrl}"].map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30 select-all cursor-pointer hover:bg-blue-500/20"
                    onClick={() => navigator.clipboard.writeText(tag)}
                    title="Click to copy tag"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Subject Line */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                Email Subject Line:
              </label>
              <Input
                value={templateForm.subject}
                onChange={(e) => onFormChange({ ...templateForm, subject: e.target.value })}
                placeholder="e.g. Next Step: Technical Pairing for {jobTitle}"
                className="text-xs h-9 bg-card/60 border-white/10 text-white font-medium"
              />
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                Email Headline / Banner Title:
              </label>
              <Input
                value={templateForm.headline}
                onChange={(e) => onFormChange({ ...templateForm, headline: e.target.value })}
                placeholder="e.g. You're Moving Forward: Technical Pairing Round 💻🔥"
                className="text-xs h-9 bg-card/60 border-white/10 text-white"
              />
            </div>

            {/* Meeting Link & Date/Time Special Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0A0D18] to-blue-950/40 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Video className="w-4 h-4 text-emerald-400" />
                <span>Google Meet / Call Link & Schedule (Optional for Calls & Interviews)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Meeting Link Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                    <Video className="w-3 h-3 text-emerald-400" />
                    <span>Google Meet / Zoom URL:</span>
                  </label>
                  <Input
                    placeholder="https://meet.google.com/abc-defg-hij"
                    value={templateForm.meetingLink || ""}
                    onChange={(e) => onFormChange({ ...templateForm, meetingLink: e.target.value })}
                    className="text-xs h-8 bg-card/60 border-emerald-500/20 text-white placeholder:text-slate-600"
                  />
                </div>

                {/* Scheduled Date & Time Input with Interactive Calendar Picker & Presets */}
                <div className="space-y-1 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>Scheduled Date & Time (Calendar Picker + Quick Presets):</span>
                    </label>
                    <span className="text-[10px] text-blue-300 font-mono">
                      {templateForm.meetingTime ? "✓ Date Set" : "Optional"}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    {/* Native Date & Time Picker */}
                    <input
                      type="datetime-local"
                      className="text-xs h-8 rounded-xl border border-blue-500/30 bg-card/60 px-2.5 text-white focus:outline-none focus:border-blue-500 cursor-pointer shrink-0 [color-scheme:dark]"
                      onChange={(e) => {
                        if (e.target.value) {
                          const dt = new Date(e.target.value);
                          const formatted =
                            dt.toLocaleString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            }) + " IST";
                          onFormChange({ ...templateForm, meetingTime: formatted });
                        }
                      }}
                    />

                    {/* Manual Text Override / Display */}
                    <Input
                      placeholder="e.g. Friday, 12th Oct at 3:00 PM IST"
                      value={templateForm.meetingTime || ""}
                      onChange={(e) => onFormChange({ ...templateForm, meetingTime: e.target.value })}
                      className="text-xs h-8 bg-card/60 border-blue-500/20 text-white placeholder:text-slate-600 flex-1"
                    />
                  </div>

                  {/* Quick Schedule Presets */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-500 font-semibold">Quick Presets:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        tomorrow.setHours(11, 0, 0, 0);
                        const formatted =
                          tomorrow.toLocaleString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }) + " IST";
                        onFormChange({ ...templateForm, meetingTime: formatted });
                      }}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 font-medium transition-colors"
                    >
                      ⚡ Tomorrow 11 AM
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        tomorrow.setHours(15, 0, 0, 0);
                        const formatted =
                          tomorrow.toLocaleString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }) + " IST";
                        onFormChange({ ...templateForm, meetingTime: formatted });
                      }}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 font-medium transition-colors"
                    >
                      ⚡ Tomorrow 3 PM
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const fri = new Date();
                        fri.setDate(fri.getDate() + ((5 + 7 - fri.getDay()) % 7 || 7));
                        fri.setHours(16, 0, 0, 0);
                        const formatted =
                          fri.toLocaleString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }) + " IST";
                        onFormChange({ ...templateForm, meetingTime: formatted });
                      }}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 font-medium transition-colors"
                    >
                      📅 Upcoming Friday 4 PM
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-snug">
                When provided, a prominent <strong>&quot;Join Google Meet Call&quot;</strong> button and schedule card will automatically render in the candidate&apos;s email.
              </p>
            </div>

            {/* Opening Paragraph */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                Opening Greeting & Intro Paragraph:
              </label>
              <textarea
                rows={3}
                value={templateForm.introParagraph}
                onChange={(e) => onFormChange({ ...templateForm, introParagraph: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-white/10 bg-card/60 text-white focus:outline-none focus:border-blue-500"
                placeholder="Opening greeting and statement..."
              />
            </div>

            {/* Action Callout Box */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                Action Callout Box (Highlighted Banner):
              </label>
              <textarea
                rows={2}
                value={templateForm.actionCallout || ""}
                onChange={(e) => onFormChange({ ...templateForm, actionCallout: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-amber-500/20 bg-amber-950/20 text-amber-200 focus:outline-none focus:border-amber-500"
                placeholder="e.g. MANDATORY ACTION: Please review all clauses and submit within seven (7) business days..."
              />
            </div>

            {/* Main Content Body */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                Main Content Paragraphs:
              </label>
              <textarea
                rows={3}
                value={templateForm.mainContent}
                onChange={(e) => onFormChange({ ...templateForm, mainContent: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-white/10 bg-card/60 text-white focus:outline-none focus:border-blue-500"
                placeholder="Detailed narrative, evaluation notes, or role context..."
              />
            </div>

            {/* Next Steps Checklist */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Next Steps / Action Items Checklist:
              </label>
              <div className="space-y-2">
                {templateForm.nextSteps?.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs text-blue-400 font-bold shrink-0">{idx + 1}.</span>
                    <Input
                      value={step}
                      onChange={(e) => {
                        const updated = [...(templateForm.nextSteps || [])];
                        updated[idx] = e.target.value;
                        onFormChange({ ...templateForm, nextSteps: updated });
                      }}
                      className="text-xs h-8 bg-card/60 border-white/10 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = templateForm.nextSteps.filter((_, i) => i !== idx);
                        onFormChange({ ...templateForm, nextSteps: updated });
                      }}
                      className="text-rose-400 hover:text-rose-300 p-1"
                      title="Remove step"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <div className="flex items-center gap-2 pt-1">
                  <Input
                    placeholder="Add another next step item..."
                    value={newNextStepItem}
                    onChange={(e) => setNewNextStepItem(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newNextStepItem.trim()) {
                        e.preventDefault();
                        onFormChange({
                          ...templateForm,
                          nextSteps: [...(templateForm.nextSteps || []), newNextStepItem.trim()],
                        });
                        setNewNextStepItem("");
                      }
                    }}
                    className="text-xs h-8 bg-white/[0.03] border-white/10 text-white"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (newNextStepItem.trim()) {
                        onFormChange({
                          ...templateForm,
                          nextSteps: [...(templateForm.nextSteps || []), newNextStepItem.trim()],
                        });
                        setNewNextStepItem("");
                      }
                    }}
                    className="h-8 text-xs shrink-0 gap-1 border-white/10"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* CTA Button Text */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                Call-to-Action (CTA) Button Text:
              </label>
              <Input
                value={templateForm.ctaText}
                onChange={(e) => onFormChange({ ...templateForm, ctaText: e.target.value })}
                placeholder="e.g. View Schedule in Candidate Dashboard →"
                className="text-xs h-9 bg-card/60 border-white/10 text-white font-medium"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: REAL-TIME LIVE INBOX PREVIEW */}
          <div className="flex flex-col rounded-2xl border border-white/10 bg-[#070911] overflow-hidden max-h-[68vh]">
            <div className="p-3 bg-white/[0.03] border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">Real-Time Client Inbox Preview</span>
              </div>

              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10">
                <button
                  type="button"
                  onClick={() => setPreviewTab("html")}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    previewTab === "html" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  HTML Inbox
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab("text")}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    previewTab === "text" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Plain Text
                </button>
              </div>
            </div>

            {/* Preview Viewport */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {previewTab === "html" ? (
                <div className="max-w-xl mx-auto rounded-2xl bg-[#0D111E] border border-white/10 p-5 space-y-4 text-left shadow-2xl">
                  {/* Brand Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                        K
                      </div>
                      <span className="font-bold text-white text-sm tracking-wider">IZIES</span>
                      <span className="text-[9px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 uppercase">
                        Careers ATS
                      </span>
                    </div>
                    <Badge variant={getStageVariant(editingStage)}>{editingStage}</Badge>
                  </div>

                  {/* Subject Line Bar */}
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Subject:</span>
                    <span className="text-blue-300 font-semibold">{replacePlaceholders(templateForm.subject)}</span>
                  </div>

                  {/* Headline */}
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    {replacePlaceholders(templateForm.headline)}
                  </h2>

                  {/* Opening Greeting */}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Hi <strong className="text-white">Rahul Sharma</strong>,
                  </p>
                  <p
                    className="text-xs text-slate-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: replacePlaceholders(templateForm.introParagraph) }}
                  />

                  {/* Google Meet & Schedule Card Preview */}
                  {(templateForm.meetingLink || templateForm.meetingTime) && (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 to-blue-950/40 border border-emerald-500/30 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-300 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          <span>Scheduled Meeting & Discussion</span>
                        </span>
                      </div>

                      {templateForm.meetingTime && (
                        <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs">
                          <span className="text-slate-400">Date & Time: </span>
                          <span className="font-bold text-blue-300">{replacePlaceholders(templateForm.meetingTime)}</span>
                        </div>
                      )}

                      {templateForm.meetingLink && (
                        <div className="text-center pt-1">
                          <a
                            href={templateForm.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-transform active:scale-95"
                          >
                            <Video className="w-4 h-4" />
                            <span>Join Google Meet Call →</span>
                          </a>
                          <p className="text-[10px] text-slate-400 mt-1 truncate">
                            Link: <span className="text-blue-400 underline">{templateForm.meetingLink}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Callout Box */}
                  {templateForm.actionCallout && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs leading-relaxed">
                      {replacePlaceholders(templateForm.actionCallout)}
                    </div>
                  )}

                  {/* Main Content */}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {replacePlaceholders(templateForm.mainContent)}
                  </p>

                  {/* Next Steps Checklist */}
                  {templateForm.nextSteps && templateForm.nextSteps.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                      <span className="text-xs font-semibold text-blue-400 block">Candidate Next Steps:</span>
                      <ul className="space-y-1 text-xs text-slate-300 pl-4 list-disc">
                        {templateForm.nextSteps.map((step, idx) => (
                          <li key={idx}>{replacePlaceholders(step)}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-950/40"
                    >
                      <span>{replacePlaceholders(templateForm.ctaText) || "Track Application Status →"}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {`Subject: ${replacePlaceholders(templateForm.subject)}

Hi Rahul Sharma,

${replacePlaceholders(templateForm.introParagraph)}

${templateForm.meetingTime ? `Meeting Time: ${replacePlaceholders(templateForm.meetingTime)}\n` : ""}${
                    templateForm.meetingLink ? `Google Meet Link: ${templateForm.meetingLink}\n` : ""
                  }
${replacePlaceholders(templateForm.mainContent)}

${
  templateForm.nextSteps && templateForm.nextSteps.length > 0
    ? `Next Steps:\n` + templateForm.nextSteps.map((s, i) => `${i + 1}. ${replacePlaceholders(s)}`).join("\n")
    : ""
}

Candidate Dashboard: ${vars.dashboardUrl}

Best regards,
IZIES Recruiting Squad`}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div
            className={`p-2.5 rounded-xl text-xs font-medium ${
              feedback.startsWith("✓")
                ? "bg-emerald-950/40 border border-emerald-500/30 text-emerald-300"
                : "bg-rose-950/40 border border-rose-500/30 text-rose-300"
            }`}
          >
            {feedback}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/[0.08]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={isSaving}
            className="text-xs h-8 gap-1.5 border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Default</span>
          </Button>

          <div className="flex items-center gap-2">
            {onOpenTestEmailModal && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenTestEmailModal(editingStage)}
                className="text-xs h-8 gap-1.5 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Test Email</span>
              </Button>
            )}

            <Button
              type="button"
              size="sm"
              onClick={onSave}
              disabled={isSaving}
              className="text-xs h-8 gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 shadow-lg shadow-blue-950/40"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving in DB..." : "Save Template in DB"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
