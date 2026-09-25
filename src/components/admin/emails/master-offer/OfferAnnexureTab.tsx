"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MasterOfferSettings } from "@/lib/template-types";

interface OfferAnnexureTabProps {
  settings: MasterOfferSettings;
  onChange: (settings: MasterOfferSettings) => void;
}

export function OfferAnnexureTab({ settings, onChange }: OfferAnnexureTabProps) {
  const annexureAItems = settings.annexureAItems || [];

  const handleAddRow = () => {
    onChange({
      ...settings,
      annexureAItems: [
        ...annexureAItems,
        { title: "New Item", desc: "Description of benefit..." },
      ],
    });
  };

  const handleUpdateItem = (idx: number, field: "title" | "desc", val: string) => {
    const updated = [...annexureAItems];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange({ ...settings, annexureAItems: updated });
  };

  const handleDeleteItem = (idx: number) => {
    const updated = annexureAItems.filter((_, i) => i !== idx);
    onChange({ ...settings, annexureAItems: updated });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
          Annexure A: Entitlements Breakdown ({annexureAItems.length})
        </h4>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAddRow}
          className="text-[11px] h-7 gap-1 border-emerald-500/30 text-emerald-300"
        >
          <Plus className="w-3 h-3" />
          <span>Add Row</span>
        </Button>
      </div>

      <div className="space-y-2">
        {annexureAItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <Input
              placeholder="Title"
              value={item.title}
              onChange={(e) => handleUpdateItem(idx, "title", e.target.value)}
              className="text-xs h-7 bg-card/60 border-white/10 text-white w-2/5"
            />
            <Input
              placeholder="Description"
              value={item.desc}
              onChange={(e) => handleUpdateItem(idx, "desc", e.target.value)}
              className="text-xs h-7 bg-card/60 border-white/10 text-white flex-1"
            />
            <button
              type="button"
              onClick={() => handleDeleteItem(idx)}
              className="text-rose-400 hover:text-rose-300 p-1"
              title="Delete item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
