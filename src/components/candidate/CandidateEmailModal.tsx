"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CandidateEmailModalProps {
  email: any | null;
  onClose: () => void;
}

export function CandidateEmailModal({ email, onClose }: CandidateEmailModalProps) {
  if (!email) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0B0F19] border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-6 my-8 max-h-[90vh] flex flex-col space-y-4">
        <div className="flex items-start justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="default">{email.stage}</Badge>
              <span className="text-xs text-slate-400">
                {new Date(email.sentAt).toLocaleString()}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">{email.subject}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 min-h-[380px] max-h-[480px] overflow-hidden rounded-2xl border border-white/10 bg-white">
          {email.bodyHtml ? (
            <iframe
              title="Email Message"
              srcDoc={email.bodyHtml}
              className="w-full h-full min-h-[380px] border-0"
              sandbox="allow-same-origin"
            />
          ) : (
            <pre className="p-4 text-xs text-slate-800 font-mono whitespace-pre-wrap overflow-y-auto h-full">
              {email.bodyText}
            </pre>
          )}
        </div>

        <div className="flex items-center justify-end pt-2 border-t border-white/[0.08]">
          <Button size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
