import { Compass, Sparkles } from "lucide-react";
import { SectionExperience } from "./SectionExperience";

export function AboutSection() {
  return (
    <section id="about" className="iz-downstream-section iz-depth-7 py-28 px-6 relative z-10 overflow-hidden">
      <SectionExperience variant="story" />
      <div className="max-w-7xl mx-auto relative z-10">
      <div className="max-w-4xl mx-auto space-y-12 text-center sm:text-left relative z-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>About IZIES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Technology Without Boundaries
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            IZIES is a remote digital engineering business serving clients in India and internationally. We work across software, AI, automation and cloud technologies to turn business requirements into digital products and systems. Our services cover planning, development, testing and ongoing support, with 24×7 service availability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          {/* Mission */}
          <div className="iz-feature-card glass-card p-8 rounded-3xl border border-white/[0.08] space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <TargetIcon />
              <span>Our Mission</span>
            </div>
            <p className="text-base text-white font-medium leading-relaxed">
              To make advanced digital technology practical, accessible and impactful.
            </p>
          </div>

          {/* Vision */}
          <div className="iz-feature-card glass-card p-8 rounded-3xl border border-white/[0.08] space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Our Vision</span>
            </div>
            <p className="text-base text-white font-medium leading-relaxed">
              To become a trusted global technology organization known for building intelligent products and transformative digital solutions.
            </p>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

function TargetIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
