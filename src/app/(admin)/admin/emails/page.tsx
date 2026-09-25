"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Mail,
  RefreshCw,
  Edit3,
  Users,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StageTemplateConfig, MasterOfferSettings } from "@/lib/template-types";

// Modular Admin Email Components
import { EmailLogItem } from "@/components/admin/emails/types";
import { EmailStatsCards } from "@/components/admin/emails/EmailStatsCards";
import { StageTemplateCards } from "@/components/admin/emails/StageTemplateCards";
import { OutboxQueueTable } from "@/components/admin/emails/OutboxQueueTable";
import { DispatchedLogsTable } from "@/components/admin/emails/DispatchedLogsTable";
import { TemplateEditorModal } from "@/components/admin/emails/TemplateEditorModal";
import { TemplatePreviewModal } from "@/components/admin/emails/TemplatePreviewModal";
import { OfferLetterheadModal } from "@/components/admin/emails/OfferLetterheadModal";
import { EmailDetailModal } from "@/components/admin/emails/EmailDetailModal";
import { MasterOfferEditorModal } from "@/components/admin/emails/master-offer/MasterOfferEditorModal";
import { SendTestEmailModal } from "@/components/admin/emails/SendTestEmailModal";

export default function AdminEmailsPage() {
  const [logs, setLogs] = useState<EmailLogItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // PENDING OUTBOX QUEUE STATES
  const [queuedEmails, setQueuedEmails] = useState<EmailLogItem[]>([]);
  const [loadingQueue, setLoadingQueue] = useState(false);
  const [selectedQueueIds, setSelectedQueueIds] = useState<string[]>([]);
  const [isDispatchingBatch, setIsDispatchingBatch] = useState(false);
  const [queueFeedback, setQueueFeedback] = useState<string | null>(null);

  // All custom templates stored in backend
  const [stageTemplates, setStageTemplates] = useState<Record<string, StageTemplateConfig>>({});

  // Preview Modal States
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState<{
    subject: string;
    html: string;
    text: string;
    stage: string;
  } | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Template Editor Modal States
  const [editTemplateModalOpen, setEditTemplateModalOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<string | null>(null);
  const [templateForm, setTemplateForm] = useState<StageTemplateConfig | null>(null);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [templateSaveFeedback, setTemplateSaveFeedback] = useState<string | null>(null);

  // Master Offer Settings Editor Modal
  const [masterOfferModalOpen, setMasterOfferModalOpen] = useState(false);
  const [masterOfferSettings, setMasterOfferSettings] = useState<MasterOfferSettings | null>(null);
  const [isSavingMasterOffer, setIsSavingMasterOffer] = useState(false);
  const [masterOfferFeedback, setMasterOfferFeedback] = useState<string | null>(null);

  // Offer Letterhead Preview Modal
  const [offerLetterheadOpen, setOfferLetterheadOpen] = useState(false);

  // View Sent / Queued Email Modal
  const [viewingEmail, setViewingEmail] = useState<EmailLogItem | null>(null);

  // Send Test Email Modal State
  const [testEmailModalOpen, setTestEmailModalOpen] = useState(false);
  const [testStageTarget, setTestStageTarget] = useState("APPLIED");

  const fetchEmailLogs = () => {
    setLoading(true);
    fetch("/api/admin/emails")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLogs(data.emails || []);
          setTotalCount(data.totalCount || 0);
        }
      })
      .catch((err) => console.error("Error loading email logs:", err))
      .finally(() => setLoading(false));
  };

  const fetchQueuedEmails = () => {
    setLoadingQueue(true);
    fetch("/api/admin/emails/queue")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setQueuedEmails(data.queue || []);
        }
      })
      .catch((err) => console.error("Error loading queued emails:", err))
      .finally(() => setLoadingQueue(false));
  };

  const fetchStageTemplates = () => {
    fetch("/api/admin/templates")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.templates) {
          setStageTemplates(data.templates);
        }
      })
      .catch((err) => console.error("Error loading templates:", err));
  };

  const fetchMasterOfferSettings = () => {
    fetch("/api/admin/offer-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setMasterOfferSettings(data.settings);
        }
      })
      .catch((err) => console.error("Error loading master offer settings:", err));
  };

  useEffect(() => {
    fetchEmailLogs();
    fetchQueuedEmails();
    fetchStageTemplates();
    fetchMasterOfferSettings();
  }, []);

  const handleBatchDispatch = async (selectedOnly: boolean = false) => {
    const idsToSend = selectedOnly ? selectedQueueIds : undefined;
    if (selectedOnly && (!idsToSend || idsToSend.length === 0)) {
      alert("Please select at least one queued email using checkboxes.");
      return;
    }

    setIsDispatchingBatch(true);
    setQueueFeedback(null);
    try {
      const res = await fetch("/api/admin/emails/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", emailIds: idsToSend }),
      });
      const data = await res.json();
      if (data.success) {
        setQueueFeedback(`✓ ${data.message}`);
        setSelectedQueueIds([]);
        fetchQueuedEmails();
        fetchEmailLogs();
        setTimeout(() => setQueueFeedback(null), 4000);
      } else {
        setQueueFeedback(`Error: ${data.error}`);
      }
    } catch (err) {
      setQueueFeedback("Failed to dispatch batch emails.");
    } finally {
      setIsDispatchingBatch(false);
    }
  };

  const handleDeleteFromQueue = async (ids: string[]) => {
    if (!confirm(`Are you sure you want to cancel and remove ${ids.length} email(s) from the outbox queue?`)) {
      return;
    }
    try {
      const res = await fetch("/api/admin/emails/queue", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailIds: ids }),
      });
      const data = await res.json();
      if (data.success) {
        setQueueFeedback(`✓ ${data.message}`);
        setSelectedQueueIds([]);
        fetchQueuedEmails();
        setTimeout(() => setQueueFeedback(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSelectQueueItem = (id: string) => {
    setSelectedQueueIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAllQueue = () => {
    if (selectedQueueIds.length === queuedEmails.length) {
      setSelectedQueueIds([]);
    } else {
      setSelectedQueueIds(queuedEmails.map((item) => item.id));
    }
  };

  const handlePreviewStage = async (stage: string) => {
    setLoadingPreview(true);
    try {
      const res = await fetch("/api/admin/email-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName: "Rahul Sharma",
          jobTitle: "Senior Full-Stack Engineer",
          departmentName: "Core Platform",
          collegeName: "IIT Delhi",
          graduationYear: "2024",
          stage,
          customNote:
            stage === "FIRST_CALL"
              ? "Scheduling formal introductory screening for Friday 3:00 PM IST."
              : stage === "INTERVIEW"
              ? "Google Meet Pairing Link: https://meet.google.com/izies-pairing on Monday 11:00 AM IST."
              : stage === "HIRED"
              ? "Welcome to IZIES Technologies! Please digitally sign and return this offer within 7 business days."
              : undefined,
          offerSalary: "Unpaid (Experience & Certificate of Completion)",
          offerJoiningDate: "1st October 2026",
          offerLocation: "Remote (India)",
          offerTerms: "1-on-1 Engineering Mentorship, Official Experience Certificate, and Fast-Track PPO Evaluation.",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPreviewData({ ...data.preview, stage });
        setPreviewModalOpen(true);
      }
    } finally {
      setLoadingPreview(false);
    }
  };

  const openTemplateEditor = (stage: string) => {
    setEditingStage(stage);
    setTemplateSaveFeedback(null);
    const current = stageTemplates[stage];
    if (current) {
      setTemplateForm(JSON.parse(JSON.stringify(current)));
    } else {
      fetch(`/api/admin/templates?stage=${stage}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.template) {
            setTemplateForm(data.template);
          }
        });
    }
    setEditTemplateModalOpen(true);
  };

  const openTestEmailModal = (stage?: string) => {
    setTestStageTarget(stage || "APPLIED");
    setTestEmailModalOpen(true);
  };

  const handleSaveTemplate = async () => {
    if (!editingStage || !templateForm) return;
    setIsSavingTemplate(true);
    setTemplateSaveFeedback(null);
    try {
      const res = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: editingStage,
          config: templateForm,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTemplateSaveFeedback("✓ Email template saved in PostgreSQL database successfully!");
        setStageTemplates((prev) => ({ ...prev, [editingStage]: data.template }));
        setTimeout(() => setTemplateSaveFeedback(null), 3000);
      } else {
        setTemplateSaveFeedback(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setTemplateSaveFeedback("Failed to save template.");
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleResetTemplate = async () => {
    if (!editingStage) return;
    if (!confirm(`Are you sure you want to reset the ${editingStage} email template to system defaults in database?`)) {
      return;
    }
    setIsSavingTemplate(true);
    try {
      const res = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: editingStage,
          action: "reset",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTemplateForm(data.template);
        setStageTemplates((prev) => ({ ...prev, [editingStage]: data.template }));
        setTemplateSaveFeedback("✓ Template reset to system default in database.");
        setTimeout(() => setTemplateSaveFeedback(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleSaveMasterOfferSettings = async () => {
    if (!masterOfferSettings) return;
    setIsSavingMasterOffer(true);
    setMasterOfferFeedback(null);
    try {
      const res = await fetch("/api/admin/offer-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: masterOfferSettings,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMasterOfferFeedback("✓ Master Offer Letter settings & 11 clauses saved in database!");
        setMasterOfferSettings(data.settings);
        setTimeout(() => setMasterOfferFeedback(null), 3500);
      } else {
        setMasterOfferFeedback(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setMasterOfferFeedback("Failed to save offer settings.");
    } finally {
      setIsSavingMasterOffer(false);
    }
  };

  const handleResetMasterOfferSettings = async () => {
    if (!confirm("Reset all Master Offer Letter terms and 11 governance clauses back to system defaults in database?")) {
      return;
    }
    setIsSavingMasterOffer(true);
    try {
      const res = await fetch("/api/admin/offer-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      const data = await res.json();
      if (data.success) {
        setMasterOfferSettings(data.settings);
        setMasterOfferFeedback("✓ Master offer settings reset to default in database.");
        setTimeout(() => setMasterOfferFeedback(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingMasterOffer(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      log.recipient.toLowerCase().includes(query) ||
      log.subject.toLowerCase().includes(query) ||
      log.stage.toLowerCase().includes(query) ||
      log.application?.fullName.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Mail className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Email Templates, Outbox Queue & Offer Letter Center
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Review your pending outbox queue, send test emails to your inbox for any stage, customize templates in PostgreSQL DB, and manage the official Letter of Appointment.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Send Test Stage Email Button */}
          <Button
            size="sm"
            onClick={() => openTestEmailModal("APPLIED")}
            className="text-xs h-9 gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Test Stage Email</span>
          </Button>

          {/* Master Offer Letter & Rules Editor Button */}
          <Button
            size="sm"
            onClick={() => {
              fetchMasterOfferSettings();
              setMasterOfferModalOpen(true);
            }}
            className="text-xs h-9 gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-lg shadow-emerald-950/40 border border-emerald-400/30"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Master Offer Letter & Rules Editor</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              fetchEmailLogs();
              fetchQueuedEmails();
            }}
            className="text-xs h-9 gap-1.5 border-white/10"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading || loadingQueue ? "animate-spin" : ""}`} />
            <span>Refresh Outbox</span>
          </Button>

          <Link href="/admin/applicants">
            <Button size="sm" className="text-xs h-9 gap-1.5 bg-blue-600 hover:bg-blue-500">
              <Users className="w-3.5 h-3.5" />
              <span>Go to Pipeline</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Stats Cards */}
      <EmailStatsCards
        queuedCount={queuedEmails.length}
        totalDispatchedCount={totalCount}
      />

      {/* SECTION 1: PENDING OUTBOX REVIEW QUEUE & BATCH DISPATCH */}
      <OutboxQueueTable
        queuedEmails={queuedEmails}
        loadingQueue={loadingQueue}
        selectedQueueIds={selectedQueueIds}
        isDispatchingBatch={isDispatchingBatch}
        queueFeedback={queueFeedback}
        onToggleSelectAll={toggleSelectAllQueue}
        onToggleSelectItem={toggleSelectQueueItem}
        onDeleteFromQueue={handleDeleteFromQueue}
        onBatchDispatch={handleBatchDispatch}
        onPreviewEmail={(email) => setViewingEmail(email)}
      />

      {/* SECTION 2: STAGE EMAIL TEMPLATES EXPLORER */}
      <StageTemplateCards
        stageTemplates={stageTemplates}
        onOpenLetterheadPreview={() => setOfferLetterheadOpen(true)}
        onOpenTemplateEditor={openTemplateEditor}
        onPreviewStage={handlePreviewStage}
        onOpenTestEmailModal={openTestEmailModal}
        loadingPreview={loadingPreview}
      />

      {/* SECTION 3: DISPATCHED EMAILS OUTBOX TIMELINE (DELIVERED AUDIT LOG) */}
      <DispatchedLogsTable
        logs={filteredLogs}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        onViewEmail={(email) => setViewingEmail(email)}
      />

      {/* MODALS (Modular Components) */}

      {/* 1. Edit Stage Email Template Modal */}
      <TemplateEditorModal
        isOpen={editTemplateModalOpen}
        onClose={() => setEditTemplateModalOpen(false)}
        editingStage={editingStage}
        templateForm={templateForm}
        onFormChange={setTemplateForm}
        onSave={handleSaveTemplate}
        onReset={handleResetTemplate}
        onPreviewStage={handlePreviewStage}
        onOpenTestEmailModal={openTestEmailModal}
        isSaving={isSavingTemplate}
        feedback={templateSaveFeedback}
      />

      {/* 2. Master Offer Letter & Rules Editor Modal with Side-by-Side Live Preview */}
      {masterOfferSettings && (
        <MasterOfferEditorModal
          isOpen={masterOfferModalOpen}
          onClose={() => setMasterOfferModalOpen(false)}
          settings={masterOfferSettings}
          onChange={setMasterOfferSettings}
          onSave={handleSaveMasterOfferSettings}
          onReset={handleResetMasterOfferSettings}
          isSaving={isSavingMasterOffer}
          feedback={masterOfferFeedback}
        />
      )}

      {/* 3. Live Stage Email Preview Modal */}
      <TemplatePreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        previewData={previewData}
        onOpenEditor={openTemplateEditor}
      />

      {/* 4. Official Offer Letterhead Preview Modal */}
      <OfferLetterheadModal
        isOpen={offerLetterheadOpen}
        onClose={() => setOfferLetterheadOpen(false)}
        onOpenMasterEditor={() => {
          fetchMasterOfferSettings();
          setMasterOfferModalOpen(true);
        }}
        settings={masterOfferSettings}
      />

      {/* 5. View Sent or Queued Email Content Modal */}
      <EmailDetailModal
        email={viewingEmail}
        onClose={() => setViewingEmail(null)}
        onSendNow={() => handleBatchDispatch(false)}
      />

      {/* 6. Send Test Stage Email Modal */}
      <SendTestEmailModal
        isOpen={testEmailModalOpen}
        onClose={() => setTestEmailModalOpen(false)}
        defaultStage={testStageTarget}
      />
    </div>
  );
}
