"use client";

import React, { useState } from "react";
import { Send, X, Mail, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { STAGE_CARDS, getStageVariant } from "./types";

interface SendTestEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStage?: string;
}

export function SendTestEmailModal({
  isOpen,
  onClose,
  defaultStage = "APPLIED",
}: SendTestEmailModalProps) {
  const [selectedStage, setSelectedStage] = useState(defaultStage);
  const [testEmail, setTestEmail] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSendTest = async () => {
    if (!testEmail || !testEmail.includes("@")) {
      setFeedback({ success: false, message: "Please enter a valid recipient email address." });
      return;
    }

    setIsSending(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/send-test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: selectedStage,
          testEmail: testEmail.trim(),
          customNote: customNote.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setFeedback({
          success: true,
          message: data.message || `✓ Test email for ${selectedStage} dispatched to ${testEmail}!`,
        });
      } else {
        setFeedback({
          success: false,
          message: data.error || "Failed to send test email.",
        });
      }
    } catch (err: any) {
      setFeedback({ success: false, message: err.message || "Network error while sending test email." });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0B0F19] border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-7 my-8 space-y-6">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Send Test Stage Email</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Send a real test email to your inbox to check how candidates will receive it.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stage Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Select Recruitment Stage to Test:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
            {STAGE_CARDS.map((card) => {
              const isSelected = selectedStage === card.stage;
              return (
                <button
                  key={card.stage}
                  type="button"
                  onClick={() => setSelectedStage(card.stage)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500"
                      : "bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base">{card.icon}</span>
                    <span className="text-xs font-medium truncate">{card.stage}</span>
                  </div>
                  <Badge variant={getStageVariant(card.stage)} className="text-[9px] px-1.5 py-0">
                    {card.stage}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recipient Email Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            Target Test Email Address:
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <Input
              type="email"
              placeholder="e.g. yourname@gmail.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="pl-9 text-xs h-9 bg-card/60 border-white/10 text-white placeholder:text-slate-600"
            />
          </div>
          <p className="text-[10px] text-slate-500">
            Enter your personal or test email to verify inbox delivery, HTML rendering, and formatting.
          </p>
        </div>

        {/* Optional Custom Note */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            Optional Custom Meeting / Test Note:
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Google Meet Pairing Link: https://meet.google.com/test-abc on Friday 3 PM IST."
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-card/60 p-2.5 text-xs text-foreground focus:outline-none placeholder:text-slate-600"
          />
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
              feedback.success
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                : "bg-rose-500/10 border-rose-500/20 text-rose-300"
            }`}
          >
            {feedback.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span className="leading-snug">{feedback.message}</span>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs h-9 border-white/10">
            Close
          </Button>
          <Button
            size="sm"
            onClick={handleSendTest}
            isLoading={isSending}
            className="text-xs h-9 bg-blue-600 hover:bg-blue-500 text-white font-semibold gap-1.5 px-4 shadow-lg shadow-blue-950/40"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Test Email Now</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
