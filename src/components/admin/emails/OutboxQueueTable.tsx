"use client";

import React from "react";
import {
  Inbox,
  CheckSquare,
  Square,
  Trash2,
  Send,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmailLogItem, getStageVariant } from "./types";

interface OutboxQueueTableProps {
  queuedEmails: EmailLogItem[];
  loadingQueue: boolean;
  selectedQueueIds: string[];
  isDispatchingBatch: boolean;
  queueFeedback: string | null;
  onToggleSelectAll: () => void;
  onToggleSelectItem: (id: string) => void;
  onDeleteFromQueue: (ids: string[]) => void;
  onBatchDispatch: (selectedOnly?: boolean) => void;
  onPreviewEmail: (email: EmailLogItem) => void;
}

export function OutboxQueueTable({
  queuedEmails,
  loadingQueue,
  selectedQueueIds,
  isDispatchingBatch,
  queueFeedback,
  onToggleSelectAll,
  onToggleSelectItem,
  onDeleteFromQueue,
  onBatchDispatch,
  onPreviewEmail,
}: OutboxQueueTableProps) {
  return (
    <div className="p-5 rounded-3xl border border-blue-500/30 bg-gradient-to-b from-[#0C1222] to-[#0A0D18] space-y-4 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <Inbox className="w-4 h-4" />
            </span>
            <span>Pending Outbox Review Queue ({queuedEmails.length})</span>
            {queuedEmails.length > 0 && (
              <Badge variant="warning" className="text-[10px] py-0.5">
                Awaiting HR Batch Send
              </Badge>
            )}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
            When candidates change stages in the pipeline, emails are queued here as drafts. No email goes to candidates until you review and click <strong>&quot;Batch Send&quot;</strong>.
          </p>
        </div>

        {queuedEmails.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onToggleSelectAll}
              className="text-xs h-8 gap-1.5 border-white/10 text-slate-300 hover:text-white"
            >
              {selectedQueueIds.length === queuedEmails.length ? (
                <>
                  <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
                  <span>Deselect All</span>
                </>
              ) : (
                <>
                  <Square className="w-3.5 h-3.5" />
                  <span>Select All ({queuedEmails.length})</span>
                </>
              )}
            </Button>

            {selectedQueueIds.length > 0 && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDeleteFromQueue(selectedQueueIds)}
                  className="text-xs h-8 gap-1 border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Cancel ({selectedQueueIds.length})</span>
                </Button>

                <Button
                  size="sm"
                  onClick={() => onBatchDispatch(true)}
                  disabled={isDispatchingBatch}
                  className="text-xs h-8 gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-950/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isDispatchingBatch ? "Dispatching..." : `Send Selected (${selectedQueueIds.length})`}</span>
                </Button>
              </>
            )}

            <Button
              size="sm"
              onClick={() => onBatchDispatch(false)}
              disabled={isDispatchingBatch}
              className="text-xs h-8 gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-950/40 border border-emerald-400/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isDispatchingBatch ? "Dispatching..." : `🚀 Batch Send All (${queuedEmails.length})`}</span>
            </Button>
          </div>
        )}
      </div>

      {queueFeedback && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{queueFeedback}</span>
        </div>
      )}

      {/* Queue Table */}
      {loadingQueue ? (
        <div className="p-8 text-center text-slate-500 text-xs animate-pulse">
          Checking pending outbox queue in database...
        </div>
      ) : queuedEmails.length === 0 ? (
        <div className="p-8 text-center space-y-2 rounded-2xl border border-white/[0.04] bg-white/[0.01]">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <h4 className="text-sm font-semibold text-white">Outbox Queue is All Clear!</h4>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            There are no pending emails waiting for dispatch. Whenever you update candidate stages or create offer letters in the pipeline with <strong>&quot;Queue in Outbox&quot;</strong>, they will be listed here for batch review.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#080B14]">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-white/[0.03] text-slate-400 border-b border-white/[0.06] uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-3 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={selectedQueueIds.length === queuedEmails.length && queuedEmails.length > 0}
                    onChange={onToggleSelectAll}
                    className="w-3.5 h-3.5 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-900"
                  />
                </th>
                <th className="py-3 px-4">Candidate Recipient</th>
                <th className="py-3 px-4">Role Applied</th>
                <th className="py-3 px-4">Queued Stage</th>
                <th className="py-3 px-4">Draft Subject Line</th>
                <th className="py-3 px-4">Queued At</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {queuedEmails.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedQueueIds.includes(item.id)}
                      onChange={() => onToggleSelectItem(item.id)}
                      className="w-3.5 h-3.5 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-900"
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">
                      {item.application?.fullName || "Candidate"}
                    </div>
                    <div className="text-slate-400 text-[11px]">{item.recipient}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-200">
                      {item.application?.job?.title || "Position"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={getStageVariant(item.stage)}>{item.stage}</Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-300 truncate max-w-[260px] block" title={item.subject}>
                      {item.subject}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    {new Date(item.sentAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPreviewEmail(item)}
                        className="text-xs h-7 px-2 border-white/10 gap-1 text-slate-300"
                        title="Preview drafted email content"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => onBatchDispatch(false)}
                        className="text-xs h-7 px-2.5 gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                        title="Send this email now"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Now</span>
                      </Button>

                      <button
                        type="button"
                        onClick={() => onDeleteFromQueue([item.id])}
                        className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Cancel and remove from queue"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
