"use client";

import React from "react";
import { Sparkles, FileCheck, Edit3, Eye, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StageTemplateConfig } from "@/lib/template-types";
import { STAGE_CARDS } from "./types";

interface StageTemplateCardsProps {
  stageTemplates: Record<string, StageTemplateConfig>;
  onOpenLetterheadPreview: () => void;
  onOpenTemplateEditor: (stage: string) => void;
  onPreviewStage: (stage: string) => void;
  onOpenTestEmailModal: (stage?: string) => void;
  loadingPreview: boolean;
}

export function StageTemplateCards({
  stageTemplates,
  onOpenLetterheadPreview,
  onOpenTemplateEditor,
  onPreviewStage,
  onOpenTestEmailModal,
  loadingPreview,
}: StageTemplateCardsProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Recruitment Stage Email Templates ({STAGE_CARDS.length} Database Backed Stages)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Customized templates are stored directly in PostgreSQL. Click &quot;Edit Template&quot; to change tone, callouts, or next steps, or click &quot;Send Test Mail&quot; to check in your inbox.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => onOpenTestEmailModal()}
            className="text-xs bg-blue-600 hover:bg-blue-500 text-white gap-1.5 font-medium shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Test Email</span>
          </Button>

          <Button
            size="sm"
            onClick={onOpenLetterheadPreview}
            variant="outline"
            className="text-xs border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 gap-1.5 self-start sm:self-auto"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Preview Offer Letterhead</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STAGE_CARDS.map((card) => {
          const currentTpl = stageTemplates[card.stage];
          const displaySubject = currentTpl?.subject || `Stage Update: {jobTitle}`;

          return (
            <div
              key={card.stage}
              className="p-5 rounded-2xl border border-white/[0.08] bg-[#0A0D18] hover:border-blue-500/30 transition-all flex flex-col justify-between gap-4 shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{card.icon}</span>
                    <Badge variant={card.badgeVariant}>{card.stage}</Badge>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    DB Stored
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{card.label}</h3>
                  <div className="text-[11px] text-blue-400 font-mono mt-0.5 break-words line-clamp-2" title={displaySubject}>
                    {displaySubject}
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {card.description}
                </p>

                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[11px] text-slate-400 space-y-1">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Trigger:</span>
                    <span className="text-slate-300">{card.trigger}</span>
                  </div>
                  {currentTpl?.headline && (
                    <div className="pt-1 border-t border-white/[0.04]">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">Headline:</span>
                      <span className="text-amber-300 truncate block">{currentTpl.headline}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center gap-1.5 flex-wrap">
                <Button
                  size="sm"
                  onClick={() => onOpenTemplateEditor(card.stage)}
                  className="flex-1 text-xs h-8 gap-1 bg-blue-600 hover:bg-blue-500 text-white font-medium"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onOpenTestEmailModal(card.stage)}
                  className="text-xs h-8 px-2.5 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 gap-1"
                  title="Send Test Email for this stage"
                >
                  <Send className="w-3 h-3" />
                  <span>Test Email</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPreviewStage(card.stage)}
                  disabled={loadingPreview}
                  className="text-xs h-8 px-2 border-white/10 hover:bg-white/[0.06] text-slate-300"
                  title="Live Preview"
                >
                  <Eye className="w-3 h-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
