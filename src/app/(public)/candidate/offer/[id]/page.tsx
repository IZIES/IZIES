"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  Download,
  Building2,
  Calendar,
  MapPin,
  Briefcase,
  ShieldCheck,
  FileCheck,
  Sparkles,
  PenTool,
  Clock,
  AlertCircle,
  Award,
  BookOpen,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { generateOfferRef, isUnpaidCompensation, renderOfferLetterHtml } from "@/lib/offer-letter";
import { DEFAULT_OFFER_SETTINGS } from "@/lib/template-types";

export default function CandidateOfferPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [application, setApplication] = useState<any | null>(null);
  const [masterSettings, setMasterSettings] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptedAt, setAcceptedAt] = useState<string | null>(null);
  const [signatureName, setSignatureName] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [signError, setSignError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/candidate/offer/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.application) {
          setApplication(data.application);
          setMasterSettings(data.masterSettings || null);
          setSignatureName(data.application.fullName || "");
          if (data.application.offerAcceptedAt) {
            setAcceptedAt(data.application.offerAcceptedAt);
          }
        } else {
          setError(data.error || "Offer letter not found");
        }
      })
      .catch(() => setError("Failed to load offer details"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAcceptOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!signatureName.trim()) {
      setSignError("Please type your full legal name as your electronic signature.");
      return;
    }
    if (!agreedTerms) {
      setSignError("Please confirm your agreement by checking the acceptance box.");
      return;
    }

    setSignError(null);
    setIsAccepting(true);
    try {
      const res = await fetch(`/api/candidate/offer/${id}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signatureName: signatureName.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setAcceptedAt(data.acceptedAt);
      } else {
        setSignError(data.error || "Failed to submit signature.");
      }
    } catch (err) {
      console.error(err);
      setSignError("Network error while submitting acceptance.");
    } finally {
      setIsAccepting(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06080F] flex items-center justify-center p-4">
        <div className="text-slate-400 text-sm animate-pulse flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400 animate-spin" />
          <span>Generating Formal Corporate Offer Letter...</span>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-[#06080F] flex flex-col items-center justify-center p-4 space-y-4">
        <p className="text-rose-400 font-semibold">{error || "Offer letter not found"}</p>
        <Link href="/candidate/dashboard">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>
        </Link>
      </div>
    );
  }

  const master = masterSettings || DEFAULT_OFFER_SETTINGS;
  const company = master.companyName || "IZIES Technologies Private Limited";
  const cin = master.cin || "U72900DL2024PTC098712";
  const office = master.registeredOffice || "Innovation Building, Cyber Hub, DLF Phase 2, Gurugram";
  const rdCampus = master.rdCampus || "Outer Ring Road, Bengaluru, Karnataka";

  const isUnpaid = isUnpaidCompensation(application.offerSalary || master.defaultSalary);
  const refNo = generateOfferRef(application.id);
  const dateStr = application.offerSentAt
    ? new Date(application.offerSentAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

  const salary = application.offerSalary || master.defaultSalary;
  const joiningDate = application.offerJoiningDate || master.defaultJoiningDate;
  const location = application.offerLocation || master.defaultLocation;
  const department = application.job?.department?.name || "Engineering & Distributed Systems";
  const empType = isUnpaid
    ? (master.defaultEmploymentType || "Unpaid Internship / Apprenticeship")
    : (application.job?.employmentType || "Full-Time / Internship");
  const probation = application.offerProbation || master.defaultProbation;
  const workingHours = application.offerWorkingHours || master.defaultWorkingHours;
  const notice = application.offerNoticePeriod || master.defaultNoticePeriod;
  const signatory = application.offerSignatory || master.defaultSignatory;
  const signatoryTitle = master.defaultSignatoryTitle || "Talent Operations & Technology Architecture";

  // Theme & Watermark
  const themeStyle = master.themeStyle || "modern-indigo";
  const accentColor = master.themeAccentColor || (
    themeStyle === "executive-slate" ? "#0F172A" :
    themeStyle === "emerald-minimal" ? "#047857" :
    themeStyle === "royal-navy" ? "#172554" :
    themeStyle === "crimson-lux" ? "#991B1B" :
    "#1E40AF"
  );
  const watermarkType = master.themeWatermark || "confidential";
  const headerTagline = master.headerTagline || "LETTER OF APPOINTMENT & FORMAL OFFER OF EMPLOYMENT";
  const confidentialityBadge = master.confidentialityBadge || "Private & Strictly Confidential";
  const introParagraph = master.introParagraph ||
    "With reference to your application, technical evaluations, and subsequent discussions with our engineering and leadership panels, we are exceedingly pleased to extend this formal offer of appointment to you. Throughout our evaluation process, our leadership was thoroughly impressed by your craftsmanship, architectural foundations, problem-solving abilities, and alignment with our ethos of engineering high-velocity, scalable digital experiences.";
  const acceptanceDeclaration = master.acceptanceDeclaration ||
    `I, ${application.fullName}, hereby acknowledge receipt of this formal Letter of Appointment, along with Annexures A & B. I confirm that I have read, understood, and willingly accept all terms, compensation structures, governance policies, and conditions contained herein. I confirm my acceptance of this offer and commit to joining ${company} on ${joiningDate}.`;
  const signatoryHeading = master.signatoryHeading || `For and on behalf of ${company}`;
  const footerNotice = master.footerNotice || `${company} • Registered Office: ${office} • Document Reference: ${refNo}\nThis document constitutes a binding corporate appointment contract upon bilateral signature.`;

  const coreMembers = (master.coreMembers && master.coreMembers.length > 0)
    ? master.coreMembers
    : DEFAULT_OFFER_SETTINGS.coreMembers;

  const rules = (master.rules && master.rules.length > 0)
    ? master.rules
    : DEFAULT_OFFER_SETTINGS.rules;

  const annexureAItems = (master.annexureAItems && master.annexureAItems.length > 0)
    ? master.annexureAItems
    : DEFAULT_OFFER_SETTINGS.annexureAItems;

  const offerHtml = renderOfferLetterHtml({
    applicationId: application.id,
    candidateName: application.fullName,
    candidateEmail: application.email,
    candidatePhone: application.phone,
    collegeName: application.collegeName || undefined,
    degree: application.degree || undefined,
    jobTitle: application.job?.title || "Role",
    departmentName: application.job?.department?.name || "Engineering & Distributed Systems",
    offerSalary: application.offerSalary || master.defaultSalary,
    offerJoiningDate: application.offerJoiningDate || master.defaultJoiningDate,
    offerLocation: application.offerLocation || master.defaultLocation,
    offerTerms: application.offerTerms || master.defaultSpecialTerms,
    probationPeriod: application.offerProbation || master.defaultProbation,
    workingHours: application.offerWorkingHours || master.defaultWorkingHours,
    noticePeriod: application.offerNoticePeriod || master.defaultNoticePeriod,
    signatoryName: application.offerSignatory || master.defaultSignatory,
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005",
    isAccepted: Boolean(acceptedAt),
    acceptedAt: acceptedAt || undefined,
    signatureName: signatureName || application.fullName,
    masterSettings: master,
  });

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-200 py-6 sm:py-10 px-3 sm:px-6">
      {/* Top Sticky Glassmorphic Action Bar (hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden bg-[#0A0D18]/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 sticky top-4 z-40 shadow-2xl">
        <div className="flex items-center gap-3">
          <Link href="/candidate/dashboard?tab=applications">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-400 hover:text-white h-8 px-2.5 bg-white/[0.03] border border-white/10">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Portal Dashboard</span>
            </Button>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-white truncate max-w-[200px] sm:max-w-xs">
              {application.job?.title}
            </span>
            <span className="font-mono text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 hidden sm:inline">
              {refNo}
            </span>
          </div>
          {acceptedAt ? (
            <Badge variant="success" className="gap-1 text-[10px] py-0.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>Signed & Executed</span>
            </Badge>
          ) : (
            <Badge variant="warning" className="text-[10px] py-0.5 animate-pulse">
              Signature Pending
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <a
            href={`/api/candidate/offer/${application.id}/download`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="sm"
              className="text-xs h-8 px-3.5 gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-950/40 border-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </Button>
          </a>

          {!acceptedAt ? (
            <a href="#signature-block">
              <Button
                size="sm"
                className="text-xs h-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold gap-1.5 shadow-lg shadow-emerald-950/40"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Sign & Return</span>
              </Button>
            </a>
          ) : (
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Signed on {new Date(acceptedAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Letterhead Wrapper */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Paper Document Container with Auto-Resizing Iframe */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 transition-all duration-300">
          <iframe
            title={`Letter of Appointment — ${application.fullName}`}
            srcDoc={offerHtml}
            onLoad={(e) => {
              try {
                const iframe = e.currentTarget;
                if (iframe.contentWindow?.document?.body) {
                  const scrollH = iframe.contentWindow.document.body.scrollHeight;
                  iframe.style.height = `${scrollH + 60}px`;
                }
              } catch (err) {
                console.error(err);
              }
            }}
            className="w-full border-0 min-h-[900px]"
            sandbox="allow-same-origin"
          />
        </div>

        {/* Candidate Interactive Electronic Signature Bar */}
        {!acceptedAt ? (
          <div id="signature-block" className="bg-[#0A0D18] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-200 space-y-6 print:hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <PenTool className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Execute Formal Electronic Acceptance</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Please confirm your acceptance of all terms, policies, and Annexures contained in this Letter of Appointment.
                  </p>
                </div>
              </div>

              <Badge variant="warning" className="shrink-0 text-xs py-1 px-3">
                Pending Acceptance
              </Badge>
            </div>

            <form onSubmit={handleAcceptOffer} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Legal Name Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Full Legal Name (Electronic Signature):
                  </label>
                  <Input
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    placeholder="e.g. Full Legal Name"
                    className="h-11 text-base bg-white/5 border-white/15 text-white font-serif italic text-blue-300 focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400">
                    Typing your legal name constitutes a legally binding electronic signature under applicable digital regulations.
                  </p>
                </div>

                {/* Live Signature Cursive Preview */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Live Digital Signature Preview:</span>
                  <div className="font-serif italic text-2xl font-bold text-emerald-400 my-2 tracking-wide">
                    {signatureName || application.fullName}
                  </div>
                  <div className="text-[10px] text-slate-400 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <span>Authentication Token:</span>
                    <span className="font-mono text-blue-300">{refNo}-VERIFIED</span>
                  </div>
                </div>
              </div>

              {/* Binding Confirmation Checkbox */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
                <label className="flex items-start gap-3 cursor-pointer select-none text-xs text-slate-200 leading-relaxed">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 shrink-0"
                  />
                  <span>
                    I, <strong>{signatureName || application.fullName}</strong>, hereby acknowledge receipt of this formal Letter of Appointment, along with Annexures A & B. I confirm that I have read, understood, and willingly accept all terms, compensation structures, governance policies, and conditions contained herein.
                  </span>
                </label>
              </div>

              {signError && (
                <div className="text-xs text-rose-400 font-semibold bg-rose-950/40 p-3 rounded-xl border border-rose-500/30">
                  {signError}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-400 hidden sm:block">
                  Document Security Hash: <span className="font-mono text-white">{refNo}</span>
                </div>

                <Button
                  type="submit"
                  size="sm"
                  isLoading={isAccepting}
                  className="w-full sm:w-auto text-xs h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold px-8 gap-2 shadow-xl shadow-emerald-950/60 rounded-xl"
                >
                  <PenTool className="w-4 h-4" />
                  <span>✍️ Digitally Sign & Execute Offer Letter</span>
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-[#0A0D18] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-200 space-y-4 print:hidden">
            <div className="flex items-center gap-3 text-emerald-400">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Offer Letter Digitally Signed & Formally Executed!</h3>
                <p className="text-xs text-emerald-300">
                  Executed on: <strong>{new Date(acceptedAt).toLocaleString()}</strong> | Verification Reference: <span className="font-mono">{refNo}-VERIFIED</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
