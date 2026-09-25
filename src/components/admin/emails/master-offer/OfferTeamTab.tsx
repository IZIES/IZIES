"use client";

import React from "react";
import { Users, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MasterOfferSettings, DEFAULT_OFFER_SETTINGS } from "@/lib/template-types";

interface OfferTeamTabProps {
  settings: MasterOfferSettings;
  onChange: (settings: MasterOfferSettings) => void;
}

export function OfferTeamTab({ settings, onChange }: OfferTeamTabProps) {
  const coreMembers = settings.coreMembers || DEFAULT_OFFER_SETTINGS.coreMembers;

  const handleAddMember = () => {
    onChange({
      ...settings,
      coreMembers: [
        ...coreMembers,
        {
          name: `Executive Member ${coreMembers.length + 1}`,
          role: "VP / Core Lead",
          email: `lead${coreMembers.length + 1}@izies.io`,
          department: "Leadership",
        },
      ],
    });
  };

  const handleUpdateMember = (idx: number, field: "name" | "role" | "email", val: string) => {
    const updated = [...coreMembers];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange({ ...settings, coreMembers: updated });
  };

  const handleDeleteMember = (idx: number) => {
    const updated = coreMembers.filter((_, i) => i !== idx);
    onChange({ ...settings, coreMembers: updated });
  };

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
        <div className="font-bold flex items-center gap-1.5">
          <Users className="w-4 h-4 text-emerald-400" />
          <span>Core Leadership Members (Name, Role, Email)</span>
        </div>
        <p className="text-emerald-300/80 text-[11px]">
          Edit any member details below — watch them update live in the right preview signatory block!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="text-[11px] font-semibold text-slate-300 block mb-0.5">
            Signatory Heading:
          </label>
          <Input
            value={settings.signatoryHeading || `For and on behalf of ${settings.companyName}`}
            onChange={(e) =>
              onChange({ ...settings, signatoryHeading: e.target.value })
            }
            className="text-xs h-8 bg-card/60 border-white/10 text-white"
            placeholder="For and on behalf of IZIES Technologies Private Limited"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-300 block mb-0.5">
            Authorized Executive Signatory:
          </label>
          <Input
            value={settings.defaultSignatory || "Core Executive Leadership Team"}
            onChange={(e) =>
              onChange({ ...settings, defaultSignatory: e.target.value })
            }
            className="text-xs h-8 bg-card/60 border-white/10 text-white"
            placeholder="Core Executive Leadership Team"
          />
        </div>
      </div>

      {/* Core Members List Editor */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Leadership Members ({coreMembers.length})
          </h4>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAddMember}
            className="text-[11px] h-7 gap-1 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 px-2.5"
          >
            <Plus className="w-3 h-3" />
            <span>Add Member</span>
          </Button>
        </div>

        <div className="space-y-2">
          {coreMembers.map((member, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl border border-white/[0.08] bg-[#0A0D18] flex flex-col sm:flex-row items-start sm:items-center gap-2"
            >
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 flex-1 w-full">
                <div>
                  <label className="text-[9px] text-slate-400 block">Name:</label>
                  <Input
                    value={member.name}
                    onChange={(e) => handleUpdateMember(idx, "name", e.target.value)}
                    placeholder="Full Name"
                    className="text-xs h-7 bg-card/60 border-white/10 text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 block">Role:</label>
                  <Input
                    value={member.role}
                    onChange={(e) => handleUpdateMember(idx, "role", e.target.value)}
                    placeholder="Role / Title"
                    className="text-xs h-7 bg-card/60 border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 block">Email:</label>
                  <Input
                    value={member.email}
                    onChange={(e) => handleUpdateMember(idx, "email", e.target.value)}
                    placeholder="email@izies.io"
                    className="text-xs h-7 bg-card/60 border-white/10 text-white font-mono"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteMember(idx)}
                className="text-rose-400 hover:text-rose-300 p-1 self-end sm:self-center"
                title="Delete Member"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
