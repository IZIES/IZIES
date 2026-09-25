"use client";

import React, { useState } from "react";
import {
  X,
  Scale,
  RotateCcw,
  Save,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MasterOfferSettings } from "@/lib/template-types";
import { OfferThemeTab } from "./OfferThemeTab";
import { OfferTeamTab } from "./OfferTeamTab";
import { OfferNarrativeTab } from "./OfferNarrativeTab";
import { OfferEntityTab } from "./OfferEntityTab";
import { OfferTermsTab } from "./OfferTermsTab";
import { OfferRulesTab } from "./OfferRulesTab";
import { OfferAnnexureTab } from "./OfferAnnexureTab";
import { OfferLivePreview } from "./OfferLivePreview";

interface MasterOfferEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: MasterOfferSettings;
  onChange: (settings: MasterOfferSettings) => void;
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
  feedback: string | null;
}

type MasterOfferTabKey = "theme" | "team" | "narrative" | "entity" | "terms" | "rules" | "annexure";
type SplitViewMode = "split" | "edit" | "preview";

export function MasterOfferEditorModal({
  isOpen,
  onClose,
  settings,
  onChange,
  onSave,
  onReset,
  isSaving,
  feedback,
}: MasterOfferEditorModalProps) {
  const [activeTab, setActiveTab] = useState<MasterOfferTabKey>("theme");
  const [splitView, setSplitView] = useState<SplitViewMode>("split");

  if (!isOpen || !settings) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-[96vw] xl:max-w-[1550px] bg-[#0B0F19] border border-white/15 rounded-3xl shadow-2xl p-4 sm:p-6 my-2 max-h-[96vh] h-[93vh] flex flex-col space-y-3">
        {/* Header with Split View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.08] gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="success">Master Offer Letter Engine</Badge>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <Scale className="w-3.5 h-3.5" />
                <span>Database-Backed Corporate Letterhead & Legal Rules</span>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Edit Master Offer Letter Template & Live Side-by-Side Preview
            </h3>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* View Switcher: Split / Edit / Preview */}
            <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setSplitView("split")}
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  splitView === "split"
                    ? "bg-emerald-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Side-by-Side Split View (Editor on Left, Live Preview on Right)"
              >
                <span>◫ Side-by-Side</span>
              </button>
              <button
                type="button"
                onClick={() => setSplitView("edit")}
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  splitView === "edit"
                    ? "bg-emerald-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Editor Only (Full Width)"
              >
                <span>📝 Editor Only</span>
              </button>
              <button
                type="button"
                onClick={() => setSplitView("preview")}
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  splitView === "preview"
                    ? "bg-emerald-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Live Preview Only (Full Width)"
              >
                <span>👁️ Preview Only</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/[0.03] border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Side-by-Side Body */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-5 overflow-hidden">
          {/* LEFT PANEL: Editor Tabs & Form */}
          {(splitView === "split" || splitView === "edit") && (
            <div
              className={`flex flex-col min-h-0 overflow-hidden ${
                splitView === "split" ? "w-full lg:w-[48%] xl:w-[46%]" : "w-full"
              }`}
            >
              {/* Sub Tabs Navigation */}
              <div className="flex items-center gap-1.5 border-b border-white/[0.08] pb-2 overflow-x-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab("theme")}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                    activeTab === "theme"
                      ? "bg-purple-600 text-white font-bold shadow-lg shadow-purple-900/30"
                      : "text-slate-400 hover:text-white bg-white/[0.02]"
                  }`}
                >
                  🎨 Theme & Style
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("team")}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                    activeTab === "team"
                      ? "bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-900/30"
                      : "text-slate-400 hover:text-white bg-white/[0.02]"
                  }`}
                >
                  👥 Core Members ({settings.coreMembers?.length || 4})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("narrative")}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                    activeTab === "narrative"
                      ? "bg-teal-600 text-white font-bold shadow-lg shadow-teal-900/30"
                      : "text-slate-400 hover:text-white bg-white/[0.02]"
                  }`}
                >
                  📝 Narrative
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("entity")}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                    activeTab === "entity"
                      ? "bg-blue-600 text-white font-bold shadow-lg shadow-blue-900/30"
                      : "text-slate-400 hover:text-white bg-white/[0.02]"
                  }`}
                >
                  🏢 Entity
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("terms")}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                    activeTab === "terms"
                      ? "bg-amber-600 text-white font-bold shadow-lg shadow-amber-900/30"
                      : "text-slate-400 hover:text-white bg-white/[0.02]"
                  }`}
                >
                  💼 Key Terms
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("rules")}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                    activeTab === "rules"
                      ? "bg-rose-600 text-white font-bold shadow-lg shadow-rose-900/30"
                      : "text-slate-400 hover:text-white bg-white/[0.02]"
                  }`}
                >
                  ⚖️ Rules ({settings.rules?.length || 11})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("annexure")}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                    activeTab === "annexure"
                      ? "bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-900/30"
                      : "text-slate-400 hover:text-white bg-white/[0.02]"
                  }`}
                >
                  📑 Annexure A
                </button>
              </div>

              {/* Scrollable Form Content */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 py-2 max-h-[calc(93vh-160px)]">
                {activeTab === "theme" && (
                  <OfferThemeTab settings={settings} onChange={onChange} />
                )}
                {activeTab === "team" && (
                  <OfferTeamTab settings={settings} onChange={onChange} />
                )}
                {activeTab === "narrative" && (
                  <OfferNarrativeTab settings={settings} onChange={onChange} />
                )}
                {activeTab === "entity" && (
                  <OfferEntityTab settings={settings} onChange={onChange} />
                )}
                {activeTab === "terms" && (
                  <OfferTermsTab settings={settings} onChange={onChange} />
                )}
                {activeTab === "rules" && (
                  <OfferRulesTab settings={settings} onChange={onChange} />
                )}
                {activeTab === "annexure" && (
                  <OfferAnnexureTab settings={settings} onChange={onChange} />
                )}
              </div>
            </div>
          )}

          {/* RIGHT PANEL: REAL-TIME LIVE PREVIEW */}
          <OfferLivePreview settings={settings} splitView={splitView} />
        </div>

        {/* Feedback notification banner */}
        {feedback && (
          <div
            className={`p-2.5 rounded-xl text-xs font-medium ${
              feedback.startsWith("✓")
                ? "bg-emerald-950/40 border border-emerald-500/30 text-emerald-300"
                : "bg-rose-950/40 border border-rose-500/30 text-rose-300"
            }`}
          >
            {feedback}
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/[0.08]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={isSaving}
            className="text-xs h-8 gap-1.5 border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Defaults</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={onSave}
              disabled={isSaving}
              className="text-xs h-8 gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold px-4"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving in DB..." : "Save Master Offer in DB"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
