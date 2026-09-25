"use client";

import Link from "next/link";
import { Mail, FileCheck, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CandidateEmailsTabProps {
  applications: any[];
  onViewEmail: (email: any) => void;
}

export function CandidateEmailsTab({
  applications,
  onViewEmail,
}: CandidateEmailsTabProps) {
  const allEmails = applications
    .flatMap((app) =>
      (app.emails || []).map((em: any) => ({
        ...em,
        jobTitle: app.job?.title || "Role",
      }))
    )
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white">Your Letters & Stage Emails</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Official offer letters, screening invitations, and interview updates sent by IZIES recruiting.
        </p>
      </div>

      {/* Any Hired Application with Offer Letter */}
      {applications.some((app) => app.status === "HIRED" || app.status === "SELECTED") && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileCheck className="w-4 h-4" />
            <span>Official Offer Letters Received</span>
          </h4>
          {applications
            .filter((app) => app.status === "HIRED" || app.status === "SELECTED")
            .map((app) => (
              <div
                key={`offer-${app.id}`}
                className="p-5 sm:p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/60 via-emerald-900/30 to-blue-950/40 space-y-4 shadow-xl shadow-emerald-950/20"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="success">Official Offer Extended</Badge>
                      <span className="text-xs text-slate-300">{app.job.department?.name || "Engineering"}</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-extrabold text-white">{app.job.title}</h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 mt-1">
                      {app.offerSalary && (
                        <span>
                          Compensation: <strong className="text-emerald-400">{app.offerSalary}</strong>
                        </span>
                      )}
                      {app.offerJoiningDate && (
                        <span>• Joining Date: <strong className="text-white">{app.offerJoiningDate}</strong></span>
                      )}
                      {app.offerLocation && (
                        <span>• Mode: <strong className="text-white">{app.offerLocation}</strong></span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                    <Link href={`/candidate/offer/${app.id}`}>
                      <Button size="sm" className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40">
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>{app.offerAcceptedAt ? "View Accepted Offer Letter" : "📄 Open & Accept Official Offer Letter"}</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Timeline of all stage emails */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Mail className="w-4 h-4 text-blue-400" />
          <span>Email Notifications Timeline</span>
        </h4>

        {allEmails.length === 0 ? (
          <div className="p-12 rounded-3xl border border-white/10 bg-[#090D18] text-center space-y-2">
            <Mail className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-white">No emails received yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Whenever you submit an application or advance through interview rounds, your official notifications and offer letters will be stored here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {allEmails.map((em: any) => (
              <div
                key={em.id}
                className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#090D18] hover:border-blue-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        em.stage === "HIRED" || em.stage === "SELECTED"
                          ? "success"
                          : em.stage === "FIRST_CALL"
                          ? "warning"
                          : em.stage === "INTERVIEW"
                          ? "purple"
                          : em.stage === "REJECTED"
                          ? "danger"
                          : "default"
                      }
                    >
                      {em.stage}
                    </Badge>
                    <span className="text-xs text-slate-400">• {em.jobTitle}</span>
                  </div>
                  <h5 className="text-sm font-bold text-white">{em.subject}</h5>
                  <p className="text-[11px] text-slate-400">
                    Sent to {em.recipient} on {new Date(em.sentAt).toLocaleString()}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewEmail(em)}
                  className="text-xs h-8 gap-1.5 border-white/10 shrink-0 self-start sm:self-center"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Message</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
