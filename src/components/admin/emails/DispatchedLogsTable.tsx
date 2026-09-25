"use client";

import React from "react";
import { CheckCircle2, Search, Inbox, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmailLogItem, getStageVariant } from "./types";

interface DispatchedLogsTableProps {
  logs: EmailLogItem[];
  loading: boolean;
  search: string;
  onSearchChange: (val: string) => void;
  onViewEmail: (email: EmailLogItem) => void;
}

export function DispatchedLogsTable({
  logs,
  loading,
  search,
  onSearchChange,
  onViewEmail,
}: DispatchedLogsTableProps) {
  return (
    <div className="space-y-4 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Delivered Emails Outbox ({logs.length})</span>
          </h2>
          <p className="text-xs text-slate-400">
            Audit log of completed emails dispatched to candidate inboxes.
          </p>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search by candidate, email, stage..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 text-xs h-9 bg-[#0A0D18]"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D18] overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs animate-pulse">
            Loading dispatched email records...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Inbox className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-white">No dispatched emails found</p>
            <p className="text-xs text-slate-500">
              When you dispatch emails from the Pending Outbox Queue, delivered records will be audited here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/[0.02] text-slate-400 border-b border-white/[0.06] uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Candidate Recipient</th>
                  <th className="py-3 px-4">Role Applied</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Subject Line</th>
                  <th className="py-3 px-4">Dispatched At</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {logs.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
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
                      <span className="text-slate-300 truncate max-w-[280px] block" title={item.subject}>
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewEmail(item)}
                        className="text-xs h-7 px-2.5 gap-1 border-white/10"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Content</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
