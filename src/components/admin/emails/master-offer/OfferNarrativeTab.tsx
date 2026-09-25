"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { MasterOfferSettings } from "@/lib/template-types";

interface OfferNarrativeTabProps {
  settings: MasterOfferSettings;
  onChange: (settings: MasterOfferSettings) => void;
}

export function OfferNarrativeTab({ settings, onChange }: OfferNarrativeTabProps) {
  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Document Header Tagline:
          </label>
          <Input
            value={settings.headerTagline || "LETTER OF APPOINTMENT & FORMAL OFFER OF EMPLOYMENT"}
            onChange={(e) =>
              onChange({ ...settings, headerTagline: e.target.value })
            }
            className="text-xs h-8 bg-card/60 border-white/10 text-white uppercase font-semibold"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Confidentiality Badge Text:
          </label>
          <Input
            value={settings.confidentialityBadge || "STRICTLY PRIVATE & CONFIDENTIAL"}
            onChange={(e) =>
              onChange({ ...settings, confidentialityBadge: e.target.value })
            }
            className="text-xs h-8 bg-card/60 border-white/10 text-white uppercase font-semibold"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-1">
          Introductory Preamble Paragraph:
        </label>
        <textarea
          rows={3}
          value={settings.introParagraph || ""}
          onChange={(e) =>
            onChange({ ...settings, introParagraph: e.target.value })
          }
          className="w-full text-xs p-2.5 rounded-xl border border-white/10 bg-card/60 text-white focus:outline-none focus:border-teal-500 leading-relaxed"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-1">
          Candidate Acceptance Declaration Statement:
        </label>
        <textarea
          rows={2}
          value={settings.acceptanceDeclaration || ""}
          onChange={(e) =>
            onChange({ ...settings, acceptanceDeclaration: e.target.value })
          }
          className="w-full text-xs p-2.5 rounded-xl border border-white/10 bg-card/60 text-white focus:outline-none focus:border-teal-500 leading-relaxed"
          placeholder="Use ${candidateName}, ${company}, ${joiningDate} for placeholders"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-1">
          Corporate Legal Footer Notice:
        </label>
        <textarea
          rows={2}
          value={settings.footerNotice || ""}
          onChange={(e) =>
            onChange({ ...settings, footerNotice: e.target.value })
          }
          className="w-full text-xs p-2.5 rounded-xl border border-white/10 bg-card/60 text-white focus:outline-none focus:border-teal-500 leading-relaxed"
        />
      </div>
    </div>
  );
}
