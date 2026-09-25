"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Printer,
  ExternalLink,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  MapPin,
  Briefcase,
  ShieldCheck,
  Award,
  Sparkles,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateOfferRef, isUnpaidCompensation, renderOfferLetterHtml } from "@/lib/offer-letter";
import { DEFAULT_OFFER_SETTINGS } from "@/lib/template-types";

interface AdminOfferLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: any | null;
}

export function AdminOfferLetterModal({
  isOpen,
  onClose,
  applicant,
}: AdminOfferLetterModalProps) {
  const [masterSettings, setMasterSettings] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch("/api/admin/offer-settings")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.settings) {
            setMasterSettings(data.settings);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen || !applicant) return null;

  const master = masterSettings || DEFAULT_OFFER_SETTINGS;
  const company = master.companyName || "IZIES Technologies Private Limited";
  const cin = master.cin || "U72900DL2024PTC098712";
  const office = master.registeredOffice || "Innovation Building, Cyber Hub, DLF Phase 2, Gurugram, India";
  const rdCampus = master.rdCampus || "Outer Ring Road, Bengaluru, Karnataka, India";

  const isUnpaid = isUnpaidCompensation(applicant.offerSalary || master.defaultSalary);
  const refNo = generateOfferRef(applicant.id);
  const dateStr = applicant.offerSentAt
    ? new Date(applicant.offerSentAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

  const isAccepted = Boolean(applicant.offerAcceptedAt);
  const acceptedDateStr = applicant.offerAcceptedAt
    ? new Date(applicant.offerAcceptedAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : null;

  const handlePrint = () => {
    if (typeof window !== "undefined" && applicant?.id) {
      window.open(`/api/candidate/offer/${applicant.id}/download`, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0B0F19] border border-emerald-500/30 rounded-3xl shadow-2xl p-5 sm:p-8 my-8 max-h-[94vh] flex flex-col space-y-6">
        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Badge variant={isAccepted ? "success" : "warning"}>
                  {isAccepted ? "✓ OFFER ACCEPTED" : "⏳ PENDING ACCEPTANCE"}
                </Badge>
                <span className="text-xs text-slate-400">Ref: {refNo}</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Official Letter of Appointment: {applicant.fullName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="text-xs h-8 gap-1.5 border-white/10 text-slate-300"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Export PDF</span>
            </Button>
            <a
              href={`/candidate/offer/${applicant.id}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Candidate Link</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Acceptance Status Banner */}
        {isAccepted ? (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-3 text-emerald-300 text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-sm text-white block">
                  Offer Digitally Signed & Accepted by Candidate!
                </span>
                <span className="text-[11px] text-emerald-300">
                  Confirmed on: <strong>{acceptedDateStr}</strong> | Electronic Signature: &quot;{applicant.fullName}&quot;
                </span>
              </div>
            </div>
            <Badge variant="success" className="shrink-0 text-xs font-mono">
              STATUS: HIRED
            </Badge>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between gap-3 text-amber-200 text-xs">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-sm text-white block">
                  Offer Extended — Pending Candidate Signature
                </span>
                <span className="text-[11px] text-amber-300">
                  Dispatched on: <strong>{dateStr}</strong> | Candidate has 7 business days to accept via portal.
                </span>
              </div>
            </div>
            <Badge variant="warning" className="shrink-0 text-xs font-mono">
              PENDING SIGNATURE
            </Badge>
          </div>
        )}

        {/* Scrollable Letterhead Document Area (100% Identical to Master Offer Settings) */}
        <div className="flex-1 min-h-[500px] sm:min-h-[620px] rounded-2xl overflow-hidden border border-white/10 bg-white shadow-2xl">
          <iframe
            title={`Offer Letter - ${applicant.fullName}`}
            srcDoc={renderOfferLetterHtml({
              applicationId: applicant.id,
              candidateName: applicant.fullName,
              candidateEmail: applicant.email,
              candidatePhone: applicant.phone,
              collegeName: applicant.collegeName || undefined,
              degree: applicant.degree || undefined,
              jobTitle: applicant.job?.title || "Role",
              departmentName: applicant.job?.department?.name || "Engineering",
              offerSalary: applicant.offerSalary || master.defaultSalary,
              offerJoiningDate: applicant.offerJoiningDate || master.defaultJoiningDate,
              offerLocation: applicant.offerLocation || master.defaultLocation,
              offerTerms: applicant.offerTerms || master.defaultSpecialTerms,
              probationPeriod: applicant.offerProbation || master.defaultProbation,
              workingHours: applicant.offerWorkingHours || master.defaultWorkingHours,
              noticePeriod: applicant.offerNoticePeriod || master.defaultNoticePeriod,
              signatoryName: applicant.offerSignatory || master.defaultSignatory,
              appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005",
              isAccepted: Boolean(applicant.offerAcceptedAt),
              acceptedAt: applicant.offerAcceptedAt || undefined,
              signatureName: applicant.offerSignatureName || applicant.fullName,
              masterSettings: master,
            })}
            className="w-full h-full border-0 min-h-[500px] sm:min-h-[620px]"
            sandbox="allow-same-origin"
          />
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs h-9 border-white/10">
            Close Viewer
          </Button>
          <a
            href={`/candidate/offer/${applicant.id}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/40"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Interactive Offer URL</span>
          </a>
        </div>
      </div>
    </div>
  );
}
