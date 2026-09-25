"use client";

import { Eye, ExternalLink, GraduationCap, FileCheck, Edit3, Mail, CheckCircle2, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ApplicantTableProps {
  applicants: any[];
  loading: boolean;
  onOpenResumePreview: (name: string, url: string) => void;
  onViewOffer: (applicant: any) => void;
  onEditOffer: (applicant: any) => void;
  onReviewApplicant: (applicant: any) => void;
}

export function ApplicantTable({
  applicants,
  loading,
  onOpenResumePreview,
  onViewOffer,
  onEditOffer,
  onReviewApplicant,
}: ApplicantTableProps) {
  const getStatusVariant = (st: string): any => {
    switch (st) {
      case "APPLIED":
        return "default";
      case "FIRST_CALL":
      case "SCREENING":
        return "warning";
      case "INTERVIEW":
        return "purple";
      case "HIRED":
      case "SELECTED":
        return "success";
      case "REJECTED":
        return "danger";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D18] p-12 text-center text-slate-500 text-xs animate-pulse">
        Loading candidates database...
      </div>
    );
  }

  if (applicants.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D18] p-12 text-center space-y-2">
        <Users className="w-8 h-8 text-slate-600 mx-auto" />
        <p className="text-sm font-semibold text-white">No applicants found</p>
        <p className="text-xs text-slate-500">
          Try adjusting your search criteria or position filter.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D18] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-white/[0.02] text-slate-400 border-b border-white/[0.06] uppercase tracking-wider font-semibold text-[10px]">
            <tr>
              <th className="py-3 px-4">Candidate & College</th>
              <th className="py-3 px-4">Position</th>
              <th className="py-3 px-4">Resume</th>
              <th className="py-3 px-4">Applied Date</th>
              <th className="py-3 px-4">Current Stage</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {applicants.map((a) => (
              <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-white text-sm">{a.fullName}</div>
                  <div className="text-slate-400 flex items-center gap-2 mt-0.5 text-[11px]">
                    <span>{a.email}</span>
                    <span>•</span>
                    <span>{a.phone}</span>
                  </div>
                  {a.collegeName && (
                    <div className="flex items-center gap-1 text-[11px] text-blue-400 mt-0.5">
                      <GraduationCap className="w-3 h-3 shrink-0" />
                      <span className="truncate max-w-[200px]">
                        {a.collegeName} {a.degree ? `(${a.degree})` : ""}
                      </span>
                    </div>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-medium text-white">{a.job?.title}</div>
                  <div className="text-[11px] text-slate-400">{a.job?.department?.name}</div>
                </td>
                <td className="py-3.5 px-4">
                  {a.resumeUrl ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onOpenResumePreview(a.fullName, a.resumeUrl)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[11px] transition-colors"
                        title="Click to preview candidate resume instantly"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
                      </button>
                      <a
                        href={a.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white p-1"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ) : (
                    <span className="text-slate-500 italic text-[11px]">No file</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                  {new Date(a.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="py-3.5 px-4">
                  <div className="space-y-1">
                    <Badge variant={getStatusVariant(a.status)}>
                      {a.status === "FIRST_CALL"
                        ? "📞 First Call"
                        : a.status === "HIRED" || a.status === "SELECTED"
                          ? "🎉 Hired / Offer"
                          : a.status}
                    </Badge>
                    {(a.status === "HIRED" || a.status === "SELECTED") && (
                      <div className="space-y-0.5">
                        {a.offerAcceptedAt ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold block">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Signed on {new Date(a.offerAcceptedAt).toLocaleDateString()}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-medium block">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>Offer Extended (Pending)</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right">
                  {a.status === "HIRED" || a.status === "SELECTED" ? (
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        type="button"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          onViewOffer(a);
                        }}
                        className="text-xs h-8 px-2.5 gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>View Offer Letter</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditOffer(a)}
                        className="text-xs h-8 px-2 border-white/10 text-slate-300 hover:text-white"
                        title="Edit offer parameters"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onReviewApplicant(a)}
                      className="text-xs h-8 px-3 gap-1.5 border-blue-500/20 text-blue-300 hover:bg-blue-500/10"
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-400" />
                      <span>Review & Stage Mail</span>
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
