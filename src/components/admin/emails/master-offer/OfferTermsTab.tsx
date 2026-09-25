"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { MasterOfferSettings } from "@/lib/template-types";

interface OfferTermsTabProps {
  settings: MasterOfferSettings;
  onChange: (settings: MasterOfferSettings) => void;
}

export function OfferTermsTab({ settings, onChange }: OfferTermsTabProps) {
  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Default Remuneration / Salary:
          </label>
          <Input
            value={settings.defaultSalary}
            onChange={(e) =>
              onChange({ ...settings, defaultSalary: e.target.value })
            }
            className="text-xs h-8 bg-card/60 border-white/10 text-white"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Default Engagement Type:
          </label>
          <Input
            value={settings.defaultEmploymentType}
            onChange={(e) =>
              onChange({ ...settings, defaultEmploymentType: e.target.value })
            }
            className="text-xs h-8 bg-card/60 border-white/10 text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div>
          <label className="text-[11px] font-semibold text-slate-300 block mb-0.5">
            Probation / Review:
          </label>
          <Input
            value={settings.defaultProbation}
            onChange={(e) =>
              onChange({ ...settings, defaultProbation: e.target.value })
            }
            className="text-xs h-8 bg-card/60 border-white/10 text-white"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-300 block mb-0.5">
            Working Hours:
          </label>
          <Input
            value={settings.defaultWorkingHours}
            onChange={(e) =>
              onChange({ ...settings, defaultWorkingHours: e.target.value })
            }
            className="text-xs h-8 bg-card/60 border-white/10 text-white"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-300 block mb-0.5">
            Notice Period:
          </label>
          <Input
            value={settings.defaultNoticePeriod}
            onChange={(e) =>
              onChange({ ...settings, defaultNoticePeriod: e.target.value })
            }
            className="text-xs h-8 bg-card/60 border-white/10 text-white"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-1">
          Default Special Terms / Roadmap:
        </label>
        <textarea
          rows={2}
          value={settings.defaultSpecialTerms}
          onChange={(e) =>
            onChange({ ...settings, defaultSpecialTerms: e.target.value })
          }
          className="w-full text-xs p-2 rounded-xl border border-white/10 bg-card/60 text-white focus:outline-none"
        />
      </div>
    </div>
  );
}
