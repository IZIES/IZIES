"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MasterOfferSettings } from "@/lib/template-types";

interface OfferRulesTabProps {
  settings: MasterOfferSettings;
  onChange: (settings: MasterOfferSettings) => void;
}

export function OfferRulesTab({ settings, onChange }: OfferRulesTabProps) {
  const rules = settings.rules || [];

  const handleAddClause = () => {
    const newClauseNum = `2.${rules.length + 1}`;
    onChange({
      ...settings,
      rules: [
        ...rules,
        { clause: newClauseNum, title: "New Policy", text: "Policy terms here..." },
      ],
    });
  };

  const handleUpdateTitle = (idx: number, title: string) => {
    const updated = [...rules];
    updated[idx] = { ...updated[idx], title };
    onChange({ ...settings, rules: updated });
  };

  const handleUpdateText = (idx: number, text: string) => {
    const updated = [...rules];
    updated[idx] = { ...updated[idx], text };
    onChange({ ...settings, rules: updated });
  };

  const handleDeleteClause = (idx: number) => {
    const updated = rules.filter((_, i) => i !== idx);
    onChange({ ...settings, rules: updated });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
          Section 2: Legal Governance Clauses ({rules.length})
        </h4>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAddClause}
          className="text-[11px] h-7 gap-1 border-emerald-500/30 text-emerald-300"
        >
          <Plus className="w-3 h-3" />
          <span>Add Clause</span>
        </Button>
      </div>

      <div className="space-y-2.5">
        {rules.map((rule, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl border border-white/[0.08] bg-[#0A0D18] space-y-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-emerald-400 font-mono shrink-0">
                {rule.clause}
              </span>
              <Input
                value={rule.title}
                onChange={(e) => handleUpdateTitle(idx, e.target.value)}
                className="text-xs h-7 bg-card/60 border-white/10 text-white font-semibold flex-1"
              />
              <button
                type="button"
                onClick={() => handleDeleteClause(idx)}
                className="text-rose-400 hover:text-rose-300 p-1"
                title="Delete clause"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea
              rows={2}
              value={rule.text}
              onChange={(e) => handleUpdateText(idx, e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-white/10 bg-card/60 text-slate-300 focus:outline-none focus:border-emerald-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
