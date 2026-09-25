"use client";

import { useEffect, useState } from "react";
import {
  Inbox,
  Mail,
  Phone,
  Building2,
  Calendar,
  Search,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  ExternalLink,
  MessageSquare,
  Sparkles,
  AlertCircle,
  X,
  FileText,
  User,
  Filter
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  NEW: { label: "New Lead", bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  IN_REVIEW: { label: "In Review", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  CONTACTED: { label: "Contacted", bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  CONVERTED: { label: "Converted / Client", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  ARCHIVED: { label: "Archived", bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/30" },
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [counts, setCounts] = useState<any>({ total: 0, new: 0, inReview: 0, contacted: 0, converted: 0, archived: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Notes Modal
  const [activeInquiry, setActiveInquiry] = useState<any | null>(null);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const fetchInquiries = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedStatus !== "ALL") params.set("status", selectedStatus);
    if (searchQuery.trim()) params.set("search", searchQuery.trim());

    fetch(`/api/admin/inquiries?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setInquiries(data.inquiries || []);
          if (data.counts) setCounts(data.counts);
        }
      })
      .catch((err) => console.error("Error fetching inquiries:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInquiries();
  }, [selectedStatus, searchQuery]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    // Optimistic UI update
    setInquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    try {
      await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchInquiries();
    } catch (err) {
      console.error("Failed to update status:", err);
      fetchInquiries();
    }
  };

  const handleSaveNotes = async () => {
    if (!activeInquiry) return;
    setSavingNote(true);

    try {
      await fetch(`/api/admin/inquiries/${activeInquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: noteText }),
      });
      setActiveInquiry(null);
      fetchInquiries();
    } catch (err) {
      console.error("Failed to save note:", err);
    } finally {
      setSavingNote(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inquiry record?")) return;
    await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
    fetchInquiries();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Inbound Project Inquiries & Leads
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time pipeline of incoming client reachouts, project requests, and product interest for Founders &amp; Executive leadership.
          </p>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        <div
          onClick={() => setSelectedStatus("ALL")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === "ALL"
              ? "bg-purple-950/20 border-purple-500/40 shadow-lg"
              : "bg-[#0A0D18] border-white/[0.08] hover:border-white/20"
          }`}
        >
          <span className="text-[11px] font-medium text-slate-400 block">Total Inquiries</span>
          <span className="text-2xl font-extrabold text-white mt-1 block">{counts.total}</span>
        </div>

        <div
          onClick={() => setSelectedStatus("NEW")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === "NEW"
              ? "bg-purple-950/20 border-purple-500/40 shadow-lg"
              : "bg-[#0A0D18] border-white/[0.08] hover:border-white/20"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-purple-300">New Leads</span>
            <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
          </div>
          <span className="text-2xl font-extrabold text-purple-300 mt-1 block">{counts.new}</span>
        </div>

        <div
          onClick={() => setSelectedStatus("IN_REVIEW")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === "IN_REVIEW"
              ? "bg-amber-950/20 border-amber-500/40 shadow-lg"
              : "bg-[#0A0D18] border-white/[0.08] hover:border-white/20"
          }`}
        >
          <span className="text-[11px] font-medium text-amber-300 block">In Review</span>
          <span className="text-2xl font-extrabold text-amber-300 mt-1 block">{counts.inReview}</span>
        </div>

        <div
          onClick={() => setSelectedStatus("CONTACTED")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === "CONTACTED"
              ? "bg-blue-950/20 border-blue-500/40 shadow-lg"
              : "bg-[#0A0D18] border-white/[0.08] hover:border-white/20"
          }`}
        >
          <span className="text-[11px] font-medium text-blue-300 block">Contacted</span>
          <span className="text-2xl font-extrabold text-blue-300 mt-1 block">{counts.contacted}</span>
        </div>

        <div
          onClick={() => setSelectedStatus("CONVERTED")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === "CONVERTED"
              ? "bg-emerald-950/20 border-emerald-500/40 shadow-lg"
              : "bg-[#0A0D18] border-white/[0.08] hover:border-white/20"
          }`}
        >
          <span className="text-[11px] font-medium text-emerald-300 block">Converted Clients</span>
          <span className="text-2xl font-extrabold text-emerald-300 mt-1 block">{counts.converted}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#0A0D18] border border-white/[0.08]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search by client, email, company, service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-white/[0.02] border-white/10 text-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {["ALL", "NEW", "IN_REVIEW", "CONTACTED", "CONVERTED", "ARCHIVED"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedStatus === st
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {st === "ALL" ? "All Inquiries" : st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400 animate-pulse">
            Loading Inbound Leads...
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-card/20 rounded-3xl border border-white/[0.06] space-y-2">
            <Inbox className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="font-semibold text-slate-300">No project inquiries found in this filter.</p>
            <p className="text-[11px] text-slate-500">Inbound reachouts submitted through the contact form on your landing page will appear here automatically.</p>
          </div>
        ) : (
          inquiries.map((item) => {
            const stConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.NEW;

            return (
              <div
                key={item.id}
                className="p-5 sm:p-6 rounded-3xl bg-[#0A0D18] border border-white/[0.08] hover:border-purple-500/30 transition-all space-y-4 shadow-xl"
              >
                {/* Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-purple-300 font-bold text-sm shrink-0">
                      {item.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-white">{item.fullName}</h3>
                        {item.companyName && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                            <Building2 className="w-3.5 h-3.5 text-slate-500" />
                            <span>{item.companyName}</span>
                          </span>
                        )}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${stConfig.bg} ${stConfig.text} ${stConfig.border}`}>
                          {stConfig.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                        <a
                          href={`mailto:${item.email}`}
                          className="hover:text-white transition-colors flex items-center gap-1 text-blue-400"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>{item.email}</span>
                        </a>
                        {item.phone && (
                          <a
                            href={`tel:${item.phone}`}
                            className="hover:text-white transition-colors flex items-center gap-1 text-emerald-400"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{item.phone}</span>
                          </a>
                        )}
                        <span className="text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(item.createdAt).toLocaleString()}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Change Selector */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-medium text-slate-400 hidden lg:inline">Status:</span>
                    <select
                      value={item.status}
                      onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                      className="h-8 px-2.5 rounded-xl bg-card border border-white/10 text-xs text-foreground focus:outline-none focus:border-purple-500"
                    >
                      <option value="NEW">New Lead</option>
                      <option value="IN_REVIEW">In Review</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="CONVERTED">Converted Client</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Service Tag & Budget */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-slate-400 font-medium">Service Requested:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/30 font-semibold text-xs">
                    {item.service || "AI Solution"}
                  </span>
                  {item.budget && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold text-xs">
                      Budget: {item.budget}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-500 font-mono">
                    Source: {item.source}
                  </span>
                </div>

                {/* Project Description Box */}
                {item.description && (
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                    {item.description}
                  </div>
                )}

                {/* Internal Founder Notes Section */}
                {item.notes && (
                  <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200 space-y-1">
                    <span className="font-bold flex items-center gap-1 text-[11px] text-purple-400">
                      <MessageSquare className="w-3.5 h-3.5" /> Founder Follow-up Note:
                    </span>
                    <p className="leading-relaxed">{item.notes}</p>
                  </div>
                )}

                {/* Bottom Card Actions */}
                <div className="pt-2 flex items-center justify-between border-t border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setActiveInquiry(item);
                        setNoteText(item.notes || "");
                      }}
                      className="h-7 text-xs gap-1.5 rounded-lg border-white/10 hover:bg-white/5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                      <span>{item.notes ? "Edit Note" : "+ Add Founder Note"}</span>
                    </Button>

                    <a
                      href={`mailto:${item.email}?subject=Regarding Your Inquiry at IZIES&body=Hi ${item.fullName},%0D%0A%0D%0AThank you for reaching out to IZIES regarding your ${item.service} project.`}
                      className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/30 text-xs font-semibold hover:bg-blue-600/20 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Reply via Email</span>
                    </a>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(item.id)}
                    className="h-7 w-7 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    title="Delete inquiry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD / EDIT NOTE MODAL */}
      {activeInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0B0F19] border border-white/10 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="text-base font-bold text-white">Founder Follow-up Note</h3>
                <p className="text-xs text-slate-400">Lead: {activeInquiry.fullName} ({activeInquiry.companyName || activeInquiry.email})</p>
              </div>
              <button
                onClick={() => setActiveInquiry(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Internal Notes (Follow-up status, client budget, call schedule, etc.):
              </label>
              <textarea
                rows={4}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="e.g. Spoke with client on phone. They need an AI agent orchestration system delivered in 4 weeks. Follow-up meeting scheduled for Friday."
                className="w-full rounded-xl border border-white/10 bg-[#060810] p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setActiveInquiry(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveNotes} isLoading={savingNote} className="bg-purple-600 hover:bg-purple-500">
                Save Note
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
