"use client";

import { useState } from "react";
import { Mail, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ViewSentEmailModalProps {
  email: any | null;
  onClose: () => void;
}

export function ViewSentEmailModal({ email, onClose }: ViewSentEmailModalProps) {
  const [tab, setTab] = useState<"html" | "text">("html");

  if (!email) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#090D18] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 my-8 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Dispatched Email Record</h3>
              <p className="text-[11px] text-slate-400">
                To: <span className="text-blue-400">{email.recipient}</span> • Stage:{" "}
                <Badge variant="outline" className="text-[10px] ml-1">
                  {email.stage}
                </Badge>
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

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-1.5 shrink-0">
          <p className="text-slate-300">
            <strong>Subject:</strong> {email.subject}
          </p>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>
              <strong>Status:</strong>{" "}
              <Badge variant={email.status === "SENT" ? "success" : "secondary"}>
                {email.status}
              </Badge>
            </span>
            <span>
              <strong>Sent:</strong>{" "}
              {new Date(email.sentAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </div>
        </div>

        {/* Tab Switch */}
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2 shrink-0">
          <button
            type="button"
            onClick={() => setTab("html")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              tab === "html"
                ? "bg-blue-600 text-white font-semibold"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Formatted HTML
          </button>
          <button
            type="button"
            onClick={() => setTab("text")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              tab === "text"
                ? "bg-blue-600 text-white font-semibold"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Plain Text
          </button>
        </div>

        {/* Content View */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-[#070911] p-4 min-h-[300px]">
          {tab === "html" ? (
            <div
              className="prose prose-invert max-w-none text-xs"
              dangerouslySetInnerHTML={{ __html: email.bodyHtml }}
            />
          ) : (
            <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
              {email.bodyText}
            </pre>
          )}
        </div>

        <div className="flex justify-end pt-2 shrink-0">
          <Button size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
