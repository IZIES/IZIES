"use client";

import React, { useState } from "react";
import { X, Edit3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStageVariant } from "./types";

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewData: {
    stage: string;
    subject: string;
    html: string;
    text: string;
  } | null;
  onOpenEditor: (stage: string) => void;
}

export function TemplatePreviewModal({
  isOpen,
  onClose,
  previewData,
  onOpenEditor,
}: TemplatePreviewModalProps) {
  const [previewTab, setPreviewTab] = useState<"html" | "text">("html");

  if (!isOpen || !previewData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0B0F19] border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-6 my-8 max-h-[90vh] flex flex-col space-y-4">
        <div className="flex items-start justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={getStageVariant(previewData.stage)}>
                {previewData.stage} Template
              </Badge>
              <span className="text-xs text-blue-400 font-semibold">IZIES Branded Layout</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">{previewData.subject}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Sample Recipient: rahul.sharma@example.com</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <button
              onClick={() => setPreviewTab("html")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                previewTab === "html" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              HTML Rendered (Inbox View)
            </button>
            <button
              onClick={() => setPreviewTab("text")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                previewTab === "text" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              Plain Text View
            </button>
          </div>

          <Button
            size="sm"
            onClick={() => {
              onClose();
              onOpenEditor(previewData.stage);
            }}
            className="text-xs h-7 gap-1 bg-blue-600 hover:bg-blue-500"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit This Template</span>
          </Button>
        </div>

        <div className="flex-1 min-h-[400px] max-h-[500px] overflow-hidden rounded-2xl border border-white/10 bg-[#080B14]">
          {previewTab === "html" ? (
            <iframe
              title="Template Preview"
              srcDoc={previewData.html}
              className="w-full h-full min-h-[400px] border-0 rounded-2xl bg-white"
              sandbox="allow-same-origin"
            />
          ) : (
            <pre className="p-4 text-xs text-slate-300 font-mono whitespace-pre-wrap overflow-y-auto h-full max-h-[400px]">
              {previewData.text}
            </pre>
          )}
        </div>

        <div className="flex items-center justify-end pt-2 border-t border-white/[0.08]">
          <Button size="sm" onClick={onClose} className="text-xs">
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
