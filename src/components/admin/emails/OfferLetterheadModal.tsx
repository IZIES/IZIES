"use client";

import React from "react";
import { X, Edit3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { renderOfferLetterHtml } from "@/lib/offer-letter";
import { MasterOfferSettings } from "@/lib/template-types";

interface OfferLetterheadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMasterEditor: () => void;
  settings?: MasterOfferSettings | null;
}

export function OfferLetterheadModal({
  isOpen,
  onClose,
  onOpenMasterEditor,
  settings,
}: OfferLetterheadModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0B0F19] border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-6 my-8 max-h-[92vh] flex flex-col space-y-4">
        <div className="flex items-start justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="success">Official Company Letterhead</Badge>
              <span className="text-xs text-slate-400">Print & PDF Ready Document</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Formal Letter of Appointment — IZIES Technologies
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 min-h-[450px] max-h-[600px] overflow-hidden rounded-2xl border border-white/10 bg-white">
          <iframe
            title="Offer Letterhead Preview"
            srcDoc={renderOfferLetterHtml({
              applicationId: "SAMPLE-APP-001",
              candidateName: "Rahul Sharma",
              candidateEmail: "rahul.sharma@example.com",
              candidatePhone: "+91 98765 43210",
              collegeName: "IIT Delhi",
              degree: "B.Tech Computer Science",
              jobTitle: "Senior Full-Stack Engineer",
              departmentName: "Core Architecture",
              employmentType: settings?.defaultEmploymentType || "Unpaid Internship / Apprenticeship",
              workplaceType: settings?.defaultLocation || "Remote (India)",
              offerSalary: settings?.defaultSalary || "Unpaid (Experience & Certificate of Completion)",
              offerJoiningDate: settings?.defaultJoiningDate || "1st October 2026",
              offerLocation: settings?.defaultLocation || "Remote (India)",
              offerTerms:
                settings?.defaultSpecialTerms ||
                "1-on-1 Engineering Mentorship, Official Experience Certificate, Milestone-based LOR, and Fast-Track PPO Evaluation.",
              probationPeriod: settings?.defaultProbation || "Three (3) Months from Date of Joining",
              workingHours: settings?.defaultWorkingHours || "Flexible (20–40 Hours / Week with Core Collaboration Windows)",
              noticePeriod: settings?.defaultNoticePeriod || "Fifteen (15) Days written notice",
              signatoryName: settings?.defaultSignatory || "Core Executive Leadership Team",
              appUrl: "http://localhost:3005",
              masterSettings: settings || undefined,
            })}
            className="w-full h-full min-h-[450px] border-0"
            sandbox="allow-same-origin"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
          <Button
            size="sm"
            onClick={() => {
              onClose();
              onOpenMasterEditor();
            }}
            className="text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-500"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Offer Letter & Rules</span>
          </Button>
          <Button size="sm" onClick={onClose} className="text-xs">
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
