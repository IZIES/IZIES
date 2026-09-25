"use client";

import React from "react";
import { X, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmailLogItem, getStageVariant } from "./types";

interface EmailDetailModalProps {
  email: EmailLogItem | null;
  onClose: () => void;
  onSendNow: () => void;
}

export function EmailDetailModal({
  email,
  onClose,
  onSendNow,
}: EmailDetailModalProps) {
  if (!email) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0B0F19] border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-6 my-8 max-h-[90vh] flex flex-col space-y-4">
        <div className="flex items-start justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={getStageVariant(email.stage)}>{email.stage}</Badge>
              {email.status === "QUEUED" ? (
                <Badge variant="warning">Pending in Outbox Queue</Badge>
              ) : (
                <span className="text-xs text-slate-400">
                  Dispatched on {new Date(email.sentAt).toLocaleString()}
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">{email.subject}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Recipient: <span className="text-slate-200">{email.recipient}</span> ({email.application?.fullName})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 min-h-[400px] max-h-[500px] overflow-hidden rounded-2xl border border-white/10 bg-white">
          {email.bodyHtml ? (
            <iframe
              title="Sent Email Content"
              srcDoc={email.bodyHtml}
              className="w-full h-full min-h-[400px] border-0"
              sandbox="allow-same-origin"
            />
          ) : (
            <pre className="p-4 text-xs text-slate-800 font-mono whitespace-pre-wrap overflow-y-auto h-full">
              {email.bodyText}
            </pre>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
          {email.status === "QUEUED" ? (
            <Button
              size="sm"
              onClick={() => {
                onClose();
                onSendNow();
              }}
              className="text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send This Email Now</span>
            </Button>
          ) : (
            <span className="text-xs text-slate-400">Delivered record</span>
          )}
          <Button size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
