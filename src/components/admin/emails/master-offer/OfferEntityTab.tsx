"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { MasterOfferSettings } from "@/lib/template-types";

interface OfferEntityTabProps {
  settings: MasterOfferSettings;
  onChange: (settings: MasterOfferSettings) => void;
}

export function OfferEntityTab({ settings, onChange }: OfferEntityTabProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Company Name (Legal Entity):
          </label>
          <Input
            value={settings.companyName}
            onChange={(e) =>
              onChange({ ...settings, companyName: e.target.value })
            }
            className="text-xs h-8 bg-card/60 border-white/10 text-white"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Corporate Identity Number (CIN):
          </label>
          <Input
            value={settings.cin}
            onChange={(e) =>
              onChange({ ...settings, cin: e.target.value })
            }
            className="text-xs h-8 bg-card/60 border-white/10 text-white font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Registered Office Address:
          </label>
          <textarea
            rows={2}
            value={settings.registeredOffice}
            onChange={(e) =>
              onChange({ ...settings, registeredOffice: e.target.value })
            }
            className="w-full text-xs p-2 rounded-xl border border-white/10 bg-card/60 text-white focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Technology / R&D Campus:
          </label>
          <textarea
            rows={2}
            value={settings.rdCampus}
            onChange={(e) =>
              onChange({ ...settings, rdCampus: e.target.value })
            }
            className="w-full text-xs p-2 rounded-xl border border-white/10 bg-card/60 text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Authorized Signatory Name:
          </label>
          <Input
            value={settings.defaultSignatory}
            onChange={(e) =>
              onChange({ ...settings, defaultSignatory: e.target.value })
            }
            className="text-xs h-8 bg-card/60 border-white/10 text-white"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Signatory Designation / Department:
          </label>
          <Input
            value={settings.defaultSignatoryTitle}
            onChange={(e) =>
              onChange({ ...settings, defaultSignatoryTitle: e.target.value })
            }
            className="text-xs h-8 bg-card/60 border-white/10 text-white"
          />
        </div>
      </div>
    </div>
  );
}
