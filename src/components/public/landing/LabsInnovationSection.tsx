"use client";

import { useState } from "react";
import { Sparkle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionExperience } from "./SectionExperience";

export function LabsInnovationSection() {
  const [labsEmail, setLabsEmail] = useState("");
  const [labsSubscribed, setLabsSubscribed] = useState(false);

  const handleLabsSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labsEmail) return;
    setLabsSubscribed(true);
    setLabsEmail("");
  };

  return (
    <section id="labs" className="iz-downstream-section iz-depth-6 relative z-10 py-24 px-6 overflow-hidden">
      <SectionExperience variant="labs" />
      <div className="max-w-4xl mx-auto rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-[#0D1224] via-[#0A0E1A] to-[#070912] p-8 sm:p-14 shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Background Mesh */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="space-y-6 relative z-10 text-center sm:text-left">
          {/* Small Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            <Sparkle className="w-3.5 h-3.5 text-indigo-400" />
            <span>IZIES Labs</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Something New Is Taking Shape.
          </h2>

          {/* Content */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
            Alongside our client solutions, we are researching and building original digital experiences designed for the future.
          </p>

          {/* Status & Badge */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Our first products are currently in development.</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/[0.05] border border-white/10 text-slate-300">
              Coming Soon
            </span>
          </div>

          {/* Email Notification Box */}
          <div className="pt-4 max-w-md">
            <p className="text-xs text-slate-400 mb-2 font-medium">Get notified when we launch original products:</p>
            {labsSubscribed ? (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>You are on the launch list! We will send you an exclusive invite.</span>
              </div>
            ) : (
              <form onSubmit={handleLabsSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  required
                  placeholder="Enter your work email"
                  value={labsEmail}
                  onChange={(e) => setLabsEmail(e.target.value)}
                  className="h-11 rounded-xl bg-black/50 border-white/10 text-white text-xs focus:border-indigo-500"
                />
                <Button type="submit" size="sm" className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0">
                  Notify Me
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
