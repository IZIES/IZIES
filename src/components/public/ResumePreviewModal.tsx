"use client";

import React, { useState, useMemo } from "react";
import { X, ExternalLink, FileText, AlertCircle, RefreshCw, Layers, ShieldAlert, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  resumeUrl: string;
}

export function ResumePreviewModal({
  isOpen,
  onClose,
  candidateName,
  resumeUrl,
}: ResumePreviewModalProps) {
  const [activeMode, setActiveMode] = useState<"auto" | "gview" | "direct">("auto");
  const [copied, setCopied] = useState(false);

  // Compute optimized URLs
  const { drivePreviewUrl, googleViewerUrl, isDrive, isDocs, isDropbox } = useMemo(() => {
    if (!resumeUrl) {
      return { drivePreviewUrl: "", googleViewerUrl: "", isDrive: false, isDocs: false, isDropbox: false };
    }

    const trimmed = resumeUrl.trim();
    let driveUrl = trimmed;
    let isDrive = false;
    let isDocs = false;
    let isDropbox = false;

    // 1. Google Drive File: /file/d/{id}/...
    const driveMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      driveUrl = `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
      isDrive = true;
    } else if (trimmed.includes("drive.google.com") && trimmed.includes("id=")) {
      const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        driveUrl = `https://drive.google.com/file/d/${idMatch[1]}/preview`;
        isDrive = true;
      }
    } else if (trimmed.includes("drive.google.com")) {
      driveUrl = trimmed.replace(/\/view(\?.*)?$/, "/preview").replace(/\/edit(\?.*)?$/, "/preview");
      if (!driveUrl.includes("/preview")) {
        driveUrl = `${driveUrl}/preview`;
      }
      isDrive = true;
    }

    // 2. Google Docs Document
    if (trimmed.includes("docs.google.com/document/d/")) {
      const docMatch = trimmed.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
      if (docMatch && docMatch[1]) {
        driveUrl = `https://docs.google.com/document/d/${docMatch[1]}/preview`;
        isDocs = true;
      }
    }

    // 3. Dropbox Link
    if (trimmed.includes("dropbox.com")) {
      isDropbox = true;
      const clean = trimmed.replace(/\?dl=[01]/, "").replace(/&dl=[01]/, "");
      driveUrl = clean.includes("?") ? `${clean}&raw=1` : `${clean}?raw=1`;
    }

    // Google Viewer URL fallback (useful for PDFs hosted anywhere)
    const gViewer = `https://docs.google.com/viewer?url=${encodeURIComponent(trimmed)}&embedded=true`;

    return {
      drivePreviewUrl: driveUrl,
      googleViewerUrl: gViewer,
      isDrive,
      isDocs,
      isDropbox,
    };
  }, [resumeUrl]);

  if (!isOpen || !resumeUrl) return null;

  // Decide current iframe src
  const currentSrc =
    activeMode === "gview"
      ? googleViewerUrl
      : activeMode === "direct"
      ? resumeUrl
      : drivePreviewUrl;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(resumeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#090D1A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Toolbar */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-gradient-to-r from-blue-950/40 via-card/40 to-slate-900/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-white text-base leading-tight truncate">
                {candidateName}&apos;s Resume / Portfolio
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-sm sm:max-w-md font-mono mt-0.5">
                {resumeUrl}
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Viewer Mode Switcher */}
            <div className="hidden sm:flex items-center rounded-xl bg-white/[0.04] p-1 border border-white/[0.08] text-xs">
              <button
                type="button"
                onClick={() => setActiveMode("auto")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeMode === "auto"
                    ? "bg-blue-600 text-white font-medium shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {isDrive ? "Google Drive Embed" : isDropbox ? "Dropbox Embed" : "Default Embed"}
              </button>
              <button
                type="button"
                onClick={() => setActiveMode("gview")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeMode === "gview"
                    ? "bg-blue-600 text-white font-medium shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Google Docs Viewer
              </button>
            </div>

            {/* Copy Link */}
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyLink}
              className="gap-1.5 text-xs h-8 text-slate-300"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Layers className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Link"}</span>
            </Button>

            {/* Open in New Window */}
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="gap-1.5 text-xs h-8 bg-blue-600 hover:bg-blue-500 text-white">
                <span>Open in Drive / Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </a>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Iframe Preview Body */}
        <div className="flex-1 p-2.5 sm:p-4 bg-[#05070D] flex flex-col min-h-[350px] sm:min-h-[500px] overflow-hidden">
          <iframe
            src={currentSrc}
            title={`${candidateName} Resume Document`}
            className="w-full flex-1 rounded-2xl border border-white/[0.08] bg-white min-h-[340px] sm:min-h-[520px] shadow-inner"
            allow="fullscreen; clipboard-read; clipboard-write"
            loading="eager"
          />

          {/* Quick Troubleshooting Bar */}
          <div className="pt-2 px-1 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>
                Make sure Google Drive has permission: &quot;Anyone with the link can view&quot;.
              </span>
            </span>

            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-slate-500">Not rendering?</span>
              <button
                type="button"
                onClick={() => setActiveMode(activeMode === "auto" ? "gview" : "auto")}
                className="text-blue-400 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Try Alternate Viewer</span>
              </button>
              <span>•</span>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline font-semibold"
              >
                Open Full Screen ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
