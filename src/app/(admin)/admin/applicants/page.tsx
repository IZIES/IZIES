"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumePreviewModal } from "@/components/public/ResumePreviewModal";
import { AdminOfferLetterModal } from "@/components/admin/applicants/AdminOfferLetterModal";
import { ApplicantFiltersBar } from "@/components/admin/applicants/ApplicantFiltersBar";
import { ApplicantTable } from "@/components/admin/applicants/ApplicantTable";
import { ApplicantDetailDrawer } from "@/components/admin/applicants/ApplicantDetailDrawer";
import { EmailPreviewModal } from "@/components/admin/applicants/EmailPreviewModal";
import { ViewSentEmailModal } from "@/components/admin/applicants/ViewSentEmailModal";

function AdminApplicantsContent() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("jobId") || "all";

  const [applicants, setApplicants] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(initialJobId);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"kanban" | "table">("table");

  // Selected candidate drawer / modal
  const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusReason, setStatusReason] = useState("");
  const [firstCallNotes, setFirstCallNotes] = useState("");
  const [newNote, setNewNote] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Email Notification States
  const [sendEmailNotification, setSendEmailNotification] = useState(true);
  const [emailDispatchMode, setEmailDispatchMode] = useState<"QUEUE" | "IMMEDIATE" | "NONE">("QUEUE");
  const [customEmailNote, setCustomEmailNote] = useState("");
  const [emailFeedback, setEmailFeedback] = useState<string | null>(null);
  const [emailHistory, setEmailHistory] = useState<any[]>([]);
  const [loadingEmails, setLoadingEmails] = useState(false);

  // Offer Letter Builder States
  const [offerSalary, setOfferSalary] = useState("Unpaid (Experience & Certificate of Completion)");
  const [offerJoiningDate, setOfferJoiningDate] = useState("1st October 2026");
  const [offerLocation, setOfferLocation] = useState("Remote (India)");
  const [offerTerms, setOfferTerms] = useState(
    "1-on-1 Engineering Mentorship, Official Experience Certificate, Milestone-based LOR, and Fast-Track PPO Evaluation."
  );
  const [offerProbation, setOfferProbation] = useState("Three (3) Months from Date of Joining");
  const [offerWorkingHours, setOfferWorkingHours] = useState("Flexible (20–40 Hours / Week with Core Windows)");
  const [offerNoticePeriod, setOfferNoticePeriod] = useState("Fifteen (15) Days written notice");
  const [offerSignatory, setOfferSignatory] = useState("Core Executive Leadership Team");
  const [isSavingOffer, setIsSavingOffer] = useState(false);
  const [offerSaveFeedback, setOfferSaveFeedback] = useState<string | null>(null);
  const [forceOfferEditor, setForceOfferEditor] = useState(false);

  // Email Preview Modal States
  const [emailPreviewModalOpen, setEmailPreviewModalOpen] = useState(false);
  const [emailPreviewData, setEmailPreviewData] = useState<{
    subject: string;
    html: string;
    text: string;
    stage: string;
  } | null>(null);

  // Viewing Sent Email from History
  const [viewingSentEmail, setViewingSentEmail] = useState<any | null>(null);

  // Resume preview state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewCandidateName, setPreviewCandidateName] = useState("");
  const [previewResumeUrl, setPreviewResumeUrl] = useState("");

  // Admin Offer Letter Viewer Modal state
  const [viewOfferModalOpen, setViewOfferModalOpen] = useState(false);
  const [selectedOfferApplicant, setSelectedOfferApplicant] = useState<any | null>(null);

  const fetchApplicants = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (selectedJob !== "all") params.set("jobId", selectedJob);
    if (selectedStatus !== "all") params.set("status", selectedStatus);

    fetch(`/api/admin/applicants?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setApplicants(data.applicants);
          setJobs(data.jobs);
        }
      })
      .catch((err) => console.error("Error fetching applicants:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplicants();
  }, [search, selectedJob, selectedStatus]);

  const fetchApplicantEmails = async (applicantId: string) => {
    setLoadingEmails(true);
    try {
      const res = await fetch(`/api/admin/applicants/${applicantId}/emails`);
      const data = await res.json();
      if (data.success) {
        setEmailHistory(data.emails || []);
      }
    } catch (err) {
      console.error("Failed to load email history:", err);
    } finally {
      setLoadingEmails(false);
    }
  };

  const openApplicantModal = (applicant: any) => {
    setSelectedApplicant(applicant);
    setNewStatus(applicant.status);
    setFirstCallNotes(applicant.firstCallNotes || "");
    setCustomEmailNote("");
    setEmailFeedback(null);
    setOfferSaveFeedback(null);
    setSendEmailNotification(true);
    setEmailDispatchMode("QUEUE");
    setOfferSalary(applicant.offerSalary || "Unpaid (Experience & Certificate of Completion)");
    setOfferJoiningDate(applicant.offerJoiningDate || "1st October 2026");
    setOfferLocation(applicant.offerLocation || applicant.job?.location || "Remote (India)");
    setOfferTerms(
      applicant.offerTerms ||
      "1-on-1 Engineering Mentorship, Official Experience Certificate, Milestone-based LOR, and Fast-Track PPO Evaluation."
    );
    setOfferProbation(applicant.offerProbation || "Three (3) Months from Date of Joining");
    setOfferWorkingHours(applicant.offerWorkingHours || "Flexible (20–40 Hours / Week with Core Windows)");
    setOfferNoticePeriod(applicant.offerNoticePeriod || "Fifteen (15) Days written notice");
    setOfferSignatory(applicant.offerSignatory || "Core Executive Leadership Team");
    fetchApplicantEmails(applicant.id);
  };

  const handleSaveOfferLetter = async (dispatchMode: "QUEUE" | "IMMEDIATE" | "NONE" = "QUEUE") => {
    if (!selectedApplicant) return;
    setIsSavingOffer(true);
    setOfferSaveFeedback(null);
    try {
      const sendEmail = dispatchMode !== "NONE";
      const res = await fetch(`/api/admin/applicants/${selectedApplicant.id}/offer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerSalary,
          offerJoiningDate,
          offerLocation,
          offerTerms,
          offerProbation,
          offerWorkingHours,
          offerNoticePeriod,
          offerSignatory,
          sendEmail,
          emailDispatchMode: dispatchMode,
          customNote: customEmailNote || undefined,
          markAsHired: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOfferSaveFeedback(
          dispatchMode === "QUEUE"
            ? "✓ Offer saved in DB & added to Outbox Queue! Review and batch send from Emails Hub."
            : dispatchMode === "IMMEDIATE"
              ? "✓ Offer saved & dispatched immediately to candidate!"
              : "✓ Offer Letter saved in database (no email sent)."
        );
        setSelectedApplicant({
          ...selectedApplicant,
          offerSalary,
          offerJoiningDate,
          offerLocation,
          offerTerms,
          offerProbation,
          offerWorkingHours,
          offerNoticePeriod,
          offerSignatory,
          status: "HIRED",
        });
        setNewStatus("HIRED");
        fetchApplicants();
        fetchApplicantEmails(selectedApplicant.id);
      } else {
        setOfferSaveFeedback(`Failed: ${data.error}`);
      }
    } catch (err) {
      console.error("handleSaveOfferLetter error:", err);
      setOfferSaveFeedback("Error saving offer letter.");
    } finally {
      setIsSavingOffer(false);
    }
  };

  const handlePreviewEmail = async (stageOverride?: string) => {
    if (!selectedApplicant) return;
    const stage = stageOverride || newStatus || selectedApplicant.status;
    try {
      const res = await fetch("/api/admin/email-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: selectedApplicant.id,
          candidateName: selectedApplicant.fullName,
          jobTitle: selectedApplicant.job?.title || "Position",
          departmentName: selectedApplicant.job?.department?.name || "Team",
          collegeName: selectedApplicant.collegeName,
          graduationYear: selectedApplicant.graduationYear,
          stage,
          customNote: customEmailNote || firstCallNotes || statusReason || undefined,
          offerSalary,
          offerJoiningDate,
          offerLocation,
          offerTerms,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailPreviewData({ ...data.preview, stage });
        setEmailPreviewModalOpen(true);
      }
    } catch (err) {
      console.error("Failed to generate preview:", err);
    }
  };

  const handleUpdateStatus = async (statusOverride?: string) => {
    if (!selectedApplicant || isUpdatingStatus) return;
    const targetStatus = statusOverride || newStatus;
    if (!targetStatus) return;

    setIsUpdatingStatus(true);
    setEmailFeedback(null);
    try {
      const res = await fetch(`/api/admin/applicants/${selectedApplicant.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: targetStatus,
          reason: statusReason,
          firstCallNotes: firstCallNotes || undefined,
          sendEmail: sendEmailNotification && emailDispatchMode !== "NONE",
          emailDispatchMode,
          customNote: customEmailNote || firstCallNotes || undefined,
          offerSalary: (targetStatus === "HIRED" || targetStatus === "SELECTED") ? offerSalary : undefined,
          offerJoiningDate: (targetStatus === "HIRED" || targetStatus === "SELECTED") ? offerJoiningDate : undefined,
          offerLocation: (targetStatus === "HIRED" || targetStatus === "SELECTED") ? offerLocation : undefined,
          offerTerms: (targetStatus === "HIRED" || targetStatus === "SELECTED") ? offerTerms : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedApplicant({
          ...selectedApplicant,
          status: targetStatus,
          firstCallNotes: firstCallNotes || selectedApplicant.firstCallNotes,
        });
        setNewStatus(targetStatus);
        setStatusReason("");
        if (data.emailAlreadyExists) {
          setEmailFeedback(`✓ Status is ${targetStatus}. (Stage notification was already created/sent previously — duplicate email prevented).`);
        } else if (data.emailQueued) {
          setEmailFeedback(`✓ Status updated! Stage email queued in Outbox for review & batch dispatch.`);
        } else if (data.emailSent) {
          setEmailFeedback(`✓ Email template dispatched immediately to ${selectedApplicant.email}`);
        } else if (!sendEmailNotification || emailDispatchMode === "NONE") {
          setEmailFeedback("Status updated without email notification.");
        }
        fetchApplicantEmails(selectedApplicant.id);
        fetchApplicants();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplicant || !newNote.trim()) return;
    setIsAddingNote(true);
    try {
      const res = await fetch(`/api/admin/applicants/${selectedApplicant.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedApplicant({
          ...selectedApplicant,
          notes: [data.note, ...(selectedApplicant.notes || [])],
        });
        setNewNote("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingNote(false);
    }
  };

  const openResumePreview = (name: string, url: string) => {
    setPreviewCandidateName(name);
    setPreviewResumeUrl(url);
    setPreviewOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Candidate & Internship Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Review student profiles, college information, open resume links with live preview, and dispatch automated stage notification emails.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/emails">
            <Button size="sm" className="gap-1.5 text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white h-9 shrink-0 border border-emerald-400/30 font-semibold shadow-md shadow-emerald-950/30">
              <Edit3 className="w-3.5 h-3.5" />
              <span>Email Templates & Master Offer Editor &rarr;</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Modular Filters Bar */}
      <ApplicantFiltersBar
        search={search}
        onSearchChange={setSearch}
        selectedJob={selectedJob}
        onJobChange={setSelectedJob}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        jobs={jobs}
        totalApplicants={applicants.length}
      />

      {/* Candidates List Table */}
      <ApplicantTable
        applicants={applicants}
        loading={loading}
        onOpenResumePreview={openResumePreview}
        onViewOffer={(a) => {
          setSelectedOfferApplicant(a);
          setViewOfferModalOpen(true);
        }}
        onEditOffer={(a) => {
          openApplicantModal(a);
          setForceOfferEditor(true);
        }}
        onReviewApplicant={(a) => {
          openApplicantModal(a);
          setForceOfferEditor(false);
        }}
      />

      {/* Candidate Detail & Decision Drawer Component */}
      <ApplicantDetailDrawer
        applicant={selectedApplicant}
        onClose={() => setSelectedApplicant(null)}
        onOpenResumePreview={openResumePreview}
        onOpenOfferLetterModal={() => {
          setSelectedOfferApplicant(selectedApplicant);
          setViewOfferModalOpen(true);
        }}
        onOpenEmailPreview={() => handlePreviewEmail()}
        onViewSentEmail={(email) => setViewingSentEmail(email)}
        emailHistory={emailHistory}
        loadingEmails={loadingEmails}
        onRefreshEmails={() => selectedApplicant && fetchApplicantEmails(selectedApplicant.id)}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        isUpdatingStatus={isUpdatingStatus}
        onUpdateStatus={handleUpdateStatus}
        emailFeedback={emailFeedback}
        newNote={newNote}
        setNewNote={setNewNote}
        isAddingNote={isAddingNote}
        onAddNote={handleAddNote}
        firstCallNotes={firstCallNotes}
        setFirstCallNotes={setFirstCallNotes}
        sendEmailNotification={sendEmailNotification}
        setSendEmailNotification={setSendEmailNotification}
        emailDispatchMode={emailDispatchMode}
        setEmailDispatchMode={setEmailDispatchMode}
        customEmailNote={customEmailNote}
        setCustomEmailNote={setCustomEmailNote}
        offerSalary={offerSalary}
        setOfferSalary={setOfferSalary}
        offerJoiningDate={offerJoiningDate}
        setOfferJoiningDate={setOfferJoiningDate}
        offerLocation={offerLocation}
        setOfferLocation={setOfferLocation}
        offerTerms={offerTerms}
        setOfferTerms={setOfferTerms}
        offerProbation={offerProbation}
        setOfferProbation={setOfferProbation}
        offerWorkingHours={offerWorkingHours}
        setOfferWorkingHours={setOfferWorkingHours}
        offerNoticePeriod={offerNoticePeriod}
        setOfferNoticePeriod={setOfferNoticePeriod}
        offerSignatory={offerSignatory}
        setOfferSignatory={setOfferSignatory}
        forceOfferEditor={forceOfferEditor}
        setForceOfferEditor={setForceOfferEditor}
        isSavingOffer={isSavingOffer}
        offerSaveFeedback={offerSaveFeedback}
        onSaveOfferLetter={handleSaveOfferLetter}
      />

      {/* Admin Offer Letter Viewer Modal */}
      <AdminOfferLetterModal
        isOpen={viewOfferModalOpen}
        onClose={() => setViewOfferModalOpen(false)}
        applicant={selectedOfferApplicant}
      />

      {/* Dispatched Sent Email Log Viewer */}
      <ViewSentEmailModal
        email={viewingSentEmail}
        onClose={() => setViewingSentEmail(null)}
      />

      {/* Live Email Preview Modal */}
      <EmailPreviewModal
        isOpen={emailPreviewModalOpen}
        onClose={() => setEmailPreviewModalOpen(false)}
        emailPreviewData={emailPreviewData}
      />

      {/* Resume Live Preview Modal */}
      <ResumePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        candidateName={previewCandidateName}
        resumeUrl={previewResumeUrl}
      />
    </div>
  );
}

export default function AdminApplicantsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 text-xs animate-pulse">Loading Application Pipeline...</div>}>
      <AdminApplicantsContent />
    </Suspense>
  );
}
