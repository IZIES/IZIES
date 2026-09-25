"use client";

import React, { useState } from "react";
import { ExternalLink, Printer } from "lucide-react";
import { MasterOfferSettings } from "@/lib/template-types";
import { renderOfferLetterHtml } from "@/lib/offer-letter";
import { Button } from "@/components/ui/button";

interface OfferLivePreviewProps {
  settings: MasterOfferSettings;
  splitView: "split" | "edit" | "preview";
}

export function OfferLivePreview({ settings, splitView }: OfferLivePreviewProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  if (splitView === "edit") return null;

  const handlePrintPreview = async () => {
    setIsPrinting(true);
    try {
      const res = await fetch("/api/admin/offer-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ masterSettings: settings }),
      });
      const html = await res.text();
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(html);
        win.document.close();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div
      className={`flex flex-col min-h-0 overflow-hidden border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-5 ${
        splitView === "split" ? "w-full lg:w-[52%] xl:w-[54%]" : "w-full"
      }`}
    >
      {/* Status Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-white">Live Real-Time Document Preview</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium hidden sm:inline">
            Instant Live Update
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-300 bg-white/[0.04] px-2 py-0.5 rounded-lg border border-white/[0.08]">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: settings.themeAccentColor || "#1E40AF" }}
            />
            <span className="capitalize">{settings.themeStyle?.replace("-", " ")}</span>
            <span>•</span>
            <span className="capitalize">{settings.themeWatermark}</span>
          </div>
          
          <Button
            type="button"
            size="sm"
            onClick={handlePrintPreview}
            disabled={isPrinting}
            className="text-[11px] h-7 px-2.5 text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20"
          >
            <Printer className="w-3 h-3" />
            <span>{isPrinting ? "Generating..." : "Print / PDF Preview"}</span>
          </Button>
        </div>
      </div>

      {/* Live Iframe Preview Container */}
      <div className="flex-1 min-h-0 mt-2 rounded-2xl overflow-hidden border border-white/10 bg-white shadow-2xl">
        <iframe
          title="Live Real-Time Master Offer Letter Preview"
          srcDoc={renderOfferLetterHtml({
            applicationId: "SAMPLE-MASTER-001",
            candidateName: "Rahul Sharma",
            candidateEmail: "rahul.sharma@example.com",
            candidatePhone: "+91 98765 43210",
            collegeName: "IIT Delhi",
            degree: "B.Tech Computer Science",
            jobTitle: "Senior Full-Stack Engineer",
            departmentName: "Core Engineering",
            employmentType: settings.defaultEmploymentType,
            workplaceType: settings.defaultLocation,
            offerSalary: settings.defaultSalary,
            offerJoiningDate: settings.defaultJoiningDate,
            offerLocation: settings.defaultLocation,
            offerTerms: settings.defaultSpecialTerms,
            probationPeriod: settings.defaultProbation,
            workingHours: settings.defaultWorkingHours,
            noticePeriod: settings.defaultNoticePeriod,
            signatoryName: settings.defaultSignatory,
            appUrl: "http://localhost:3005",
            masterSettings: settings,
          })}
          className="w-full h-full border-0"
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}

