"use client";

import React from "react";
import { Shield } from "lucide-react";

interface EmailStatsCardsProps {
  queuedCount: number;
  totalDispatchedCount: number;
}

export function EmailStatsCards({
  queuedCount,
  totalDispatchedCount,
}: EmailStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Outbox Queue Card */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          queuedCount > 0
            ? "border-blue-500/40 bg-gradient-to-br from-blue-950/40 to-[#0A0D18] shadow-lg shadow-blue-950/30"
            : "border-white/[0.08] bg-[#0A0D18]"
        } space-y-1`}
      >
        <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block flex items-center justify-between">
          <span>Pending Outbox Queue</span>
          {queuedCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          )}
        </span>
        <div className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
          <span>{queuedCount}</span>
          <span className="text-xs text-blue-300 font-medium">Ready for Batch Send</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Emails waiting in queue before delivery to candidates
        </p>
      </div>

      {/* Delivered Emails Card */}
      <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0A0D18] space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Total Emails Dispatched
        </span>
        <div className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
          <span>{totalDispatchedCount}</span>
          <span className="text-xs text-emerald-400 font-medium">Delivered to candidates</span>
        </div>
        <p className="text-[11px] text-slate-500">Recorded in Neon PostgreSQL database</p>
      </div>

      {/* Active Stage Templates Card */}
      <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 space-y-1">
        <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          <span>Database-Backed Engine</span>
        </span>
        <div className="text-xl sm:text-2xl font-bold text-white">5 Stage Templates</div>
        <p className="text-[11px] text-slate-400">
          Stored in DB with 11 master legal governance clauses
        </p>
      </div>
    </div>
  );
}
