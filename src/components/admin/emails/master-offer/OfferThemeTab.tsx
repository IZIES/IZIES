"use client";

import React from "react";
import { Palette } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MasterOfferSettings } from "@/lib/template-types";

interface OfferThemeTabProps {
  settings: MasterOfferSettings;
  onChange: (settings: MasterOfferSettings) => void;
}

const PRESET_COLORS: Record<string, string> = {
  "modern-indigo": "#1E40AF",
  "executive-slate": "#0F172A",
  "emerald-minimal": "#047857",
  "royal-navy": "#172554",
  "crimson-lux": "#991B1B",
};

const SWATCHES = [
  { color: "#1E40AF", label: "Indigo" },
  { color: "#0F172A", label: "Slate" },
  { color: "#047857", label: "Emerald" },
  { color: "#172554", label: "Navy" },
  { color: "#991B1B", label: "Crimson" },
  { color: "#7C3AED", label: "Purple" },
  { color: "#D97706", label: "Amber" },
  { color: "#0284C7", label: "Sky" },
];

const WATERMARKS = [
  {
    id: "confidential",
    label: "Diagonal 'CONFIDENTIAL'",
    desc: "45-degree angle watermark",
  },
  {
    id: "official-seal",
    label: "Circular Corporate Seal",
    desc: "Verified corporate seal watermark",
  },
  {
    id: "subtle-grid",
    label: "Subtle Matrix Grid",
    desc: "Geometric dot-matrix blueprint",
  },
  {
    id: "none",
    label: "Clean Minimalist (None)",
    desc: "Crisp white background",
  },
];

export function OfferThemeTab({ settings, onChange }: OfferThemeTabProps) {
  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-300 space-y-1">
        <div className="font-bold flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-purple-400" />
          <span>Theme & Visual Styling</span>
        </div>
        <p className="text-purple-300/80 text-[11px]">
          Changes reflect immediately in the live preview on the right!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Theme Style Presets */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Theme Preset Style:
          </label>
          <select
            value={settings.themeStyle || "modern-indigo"}
            onChange={(e) => {
              const val = e.target.value;
              onChange({
                ...settings,
                themeStyle: val,
                themeAccentColor: PRESET_COLORS[val] || settings.themeAccentColor,
              });
            }}
            className="w-full text-xs h-9 px-2.5 rounded-xl border border-white/10 bg-card/80 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="modern-indigo" className="bg-slate-900">Modern Indigo (Tech)</option>
            <option value="executive-slate" className="bg-slate-900">Executive Slate (Corporate)</option>
            <option value="emerald-minimal" className="bg-slate-900">Emerald Minimalist (Clean)</option>
            <option value="royal-navy" className="bg-slate-900">Royal Navy & Platinum</option>
            <option value="crimson-lux" className="bg-slate-900">Crimson Executive (Bold)</option>
          </select>
        </div>

        {/* Font Family */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Typography Style:
          </label>
          <select
            value={settings.themeFontFamily || "inter"}
            onChange={(e) =>
              onChange({ ...settings, themeFontFamily: e.target.value })
            }
            className="w-full text-xs h-9 px-2.5 rounded-xl border border-white/10 bg-card/80 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="inter" className="bg-slate-900">Inter / Modern Geometric Sans</option>
            <option value="serif" className="bg-slate-900">Georgia / Classic Serif</option>
            <option value="mono-tech" className="bg-slate-900">JetBrains Mono / Tech</option>
          </select>
        </div>
      </div>

      {/* Accent Color Picker & Quick Swatches */}
      <div className="p-3 rounded-xl border border-white/[0.08] bg-[#0A0D18] space-y-2.5">
        <label className="text-xs font-semibold text-slate-300 block">
          Custom Accent Color (Watch letterhead & borders update live):
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={settings.themeAccentColor || "#1E40AF"}
            onChange={(e) =>
              onChange({ ...settings, themeAccentColor: e.target.value })
            }
            className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border-0"
          />
          <Input
            value={settings.themeAccentColor || "#1E40AF"}
            onChange={(e) =>
              onChange({ ...settings, themeAccentColor: e.target.value })
            }
            className="text-xs h-8 font-mono w-28 bg-card/60 border-white/10 text-white uppercase"
            placeholder="#1E40AF"
          />
          <div className="flex items-center gap-1.5 flex-wrap">
            {SWATCHES.map((swatch) => (
              <button
                key={swatch.color}
                type="button"
                onClick={() =>
                  onChange({ ...settings, themeAccentColor: swatch.color })
                }
                className={`w-5 h-5 rounded-md transition-transform hover:scale-110 border ${
                  (settings.themeAccentColor || "").toLowerCase() === swatch.color.toLowerCase()
                    ? "ring-2 ring-white scale-110"
                    : "border-white/20"
                }`}
                style={{ backgroundColor: swatch.color }}
                title={swatch.label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Watermark Selector */}
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-1">
          Background Watermark Style:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {WATERMARKS.map((item) => (
            <label
              key={item.id}
              className={`flex items-start gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                (settings.themeWatermark || "confidential") === item.id
                  ? "border-purple-500 bg-purple-950/20 text-white"
                  : "border-white/10 bg-[#0A0D18]/50 text-slate-400 hover:border-white/20"
              }`}
            >
              <input
                type="radio"
                name="themeWatermark"
                value={item.id}
                checked={(settings.themeWatermark || "confidential") === item.id}
                onChange={() =>
                  onChange({ ...settings, themeWatermark: item.id })
                }
                className="mt-0.5"
              />
              <div>
                <div className="text-xs font-bold text-white">{item.label}</div>
                <div className="text-[10px] text-slate-400 leading-normal">{item.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
