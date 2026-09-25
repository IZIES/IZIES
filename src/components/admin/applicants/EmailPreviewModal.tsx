"use client";

import { useState } from "react";
import { Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailPreviewData: {
    subject: string;
    html: string;
    text: string;
    stage: string;
  } | null;
}

export function EmailPreviewModal({
  isOpen,
  onClose,
  emailPreviewData,
}: EmailPreviewModalProps) {
  const [previewTab, setPreviewTab] = useState<"html" | "text">("html");

  if (!isOpen || !emailPreviewData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#090D18] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Live Email Preview</h3>
              <p className="text-[11px] text-slate-400">
                Stage: <span className="text-purple-400 font-semibold">{emailPreviewData.stage}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-1 shrink-0">
          <p className="text-slate-400">
            Subject: <strong className="text-white">{emailPreviewData.subject}</strong>
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2 shrink-0">
          <button
            type="button"
            onClick={() => setPreviewTab("html")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              previewTab === "html"
                ? "bg-blue-600 text-white font-semibold"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Formatted HTML
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab("text")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              previewTab === "text"
                ? "bg-blue-600 text-white font-semibold"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Plain Text Fallback
          </button>
        </div>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-[#070911] p-4 min-h-[300px]">
          {previewTab === "html" ? (
            <div
              className="prose prose-invert max-w-none text-xs"
              dangerouslySetInnerHTML={{ __html: emailPreviewData.html }}
            />
          ) : (
            <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
              {emailPreviewData.text}
            </pre>
          )}
        </div>

        <div className="flex justify-end pt-2 shrink-0">
          <Button size="sm" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
