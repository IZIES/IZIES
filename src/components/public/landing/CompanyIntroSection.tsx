import { Sparkles } from "lucide-react";

export function CompanyIntroSection() {
  return (
    <section className="relative z-10 py-20 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Digital Transformation</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          A Software Development Partner for Your Next Step.
        </h2>

        <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-normal max-w-3xl mx-auto">
          Whether you are launching a new business, replacing manual processes or improving an existing platform, IZIES brings product planning, design and development into one workflow. We start with your requirements, define the scope and work through delivery milestones with regular feedback and a clear handover.
        </p>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 max-w-3xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-0.5">
            <p className="text-xl font-bold text-white font-mono">Plan</p>
            <p className="text-xs text-indigo-300 font-semibold">Discovery & Scope</p>
            <p className="text-[10px] text-slate-400">Goals, users and requirements</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-0.5">
            <p className="text-xl font-bold text-white font-mono">Build</p>
            <p className="text-xs text-emerald-300 font-semibold">Design & Development</p>
            <p className="text-[10px] text-slate-400">Working software in milestones</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-0.5">
            <p className="text-xl font-bold text-white font-mono">Validate</p>
            <p className="text-xs text-purple-300 font-semibold">Testing & Review</p>
            <p className="text-[10px] text-slate-400">User journeys and release checks</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-0.5">
            <p className="text-xl font-bold text-white font-mono">Improve</p>
            <p className="text-xs text-amber-300 font-semibold">Support & Iteration</p>
            <p className="text-[10px] text-slate-400">Maintenance and next steps</p>
          </div>
        </div>
      </div>
    </section>
  );
}
