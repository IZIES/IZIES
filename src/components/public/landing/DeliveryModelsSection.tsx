"use client";

import { useState } from "react";
import { Layers3, ArrowRight, CheckCheck, ShieldCheck } from "lucide-react";
import { SectionExperience } from "./SectionExperience";

interface DeliveryModelsSectionProps {
  onScrollTo?: (id: string) => void;
}

export function DeliveryModelsSection({ onScrollTo }: DeliveryModelsSectionProps = {}) {
  const [activeModel, setActiveModel] = useState<number>(0);

  const handleScroll = (id: string) => {
    if (onScrollTo) {
      onScrollTo(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const deliveryModels = [
    {
      title: "Full-Cycle Product Squads",
      tag: "Dedicated Engineering Pod",
      desc: "Cross-functional pods containing a Product Lead, Senior Full-Stack Engineers, UI/UX Architect, and QA delivering continuous weekly releases directly into your ecosystem.",
      features: [
        "Dedicated daily standup & async Slack/Discord channel",
        "Weekly staging deployments & transparent PR reviews",
        "Full IP ownership & direct repository access",
        "Elastic scaling up or down with zero lock-in"
      ],
      bestFor: "Startups & scaling companies needing high-speed execution without hiring delays."
    },
    {
      title: "AI & Intelligent Systems Integration",
      tag: "Applied Intelligence",
      desc: "Architecting custom LLM pipelines, autonomous reasoning agents, RAG vector search, and fine-tuned predictive algorithms tailored specifically to your data.",
      features: [
        "Bespoke multi-agent autonomous frameworks",
        "Private enterprise vector databases & RAG indexing",
        "Low-latency model quantization & inference gateways",
        "Comprehensive prompt evaluation & guardrails"
      ],
      bestFor: "Enterprises & digital platforms embedding native intelligence into operations."
    },
    {
      title: "Architecture Modernization & Cloud Scale",
      tag: "Cloud Migration",
      desc: "Transitioning legacy monolithic software to high-performance Next.js micro-frontends, distributed Go/Node.js microservices, and multi-region cloud clusters.",
      features: [
        "Automated Kubernetes containerization & auto-scaling",
        "Database optimization (Postgres/ClickHouse/Redis)",
        "Rolling deployments and rollback planning",
        "CDN configuration and delivery optimization"
      ],
      bestFor: "High-traffic systems hitting scalability bottlenecks or high latency."
    },
    {
      title: "CTO Advisory & Security Governance",
      tag: "Strategic Leadership",
      desc: "Executive technology direction, system feasibility audits, penetration testing, compliance roadmaps, and architectural blueprints for long-term growth.",
      features: [
        "Technical due diligence & architecture reviews",
        "Security audit, RBAC & SOC2 readiness frameworks",
        "Disaster recovery & data encryption standards",
        "Cost-optimization across AWS, GCP, and cloud providers"
      ],
      bestFor: "Founders & leadership teams seeking proven tech governance before large launches."
    }
  ];

  return (
    <section id="models" className="iz-downstream-section iz-depth-1 py-28 px-6 relative overflow-hidden z-10">
      <SectionExperience variant="pipeline" />
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-indigo-500/10 blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-14 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              <Layers3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Enterprise Delivery Framework</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              How We Partner & Deliver.
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              Whether you need a dedicated engineering squad, an AI intelligence injection, or architectural modernization, we operate with high velocity and zero bureaucracy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => handleScroll("contact")}
              className="inline-flex items-center gap-2 px-7 h-12 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 cursor-pointer"
            >
              <span>Book Architecture Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Delivery Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deliveryModels.map((model, idx) => (
            <div
              key={idx}
              onClick={() => setActiveModel(idx)}
              className={`iz-feature-card glass-card p-8 rounded-3xl border transition-all duration-300 cursor-pointer space-y-5 flex flex-col justify-between ${
                activeModel === idx
                  ? "border-indigo-500 bg-indigo-950/20 shadow-xl shadow-indigo-600/15 ring-1 ring-indigo-500/40"
                  : "border-white/[0.08] hover:border-white/20"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    MODEL {idx + 1}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {model.tag}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white tracking-tight">{model.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">{model.desc}</p>

                <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">What’s Included:</p>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {model.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] text-xs text-indigo-300 font-medium">
                <strong>Best For:</strong> <span className="text-slate-400">{model.bestFor}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Technology & Infrastructure Standards Banner */}
        <div className="iz-feature-card glass-card p-8 rounded-3xl border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Enterprise Engineering Standards</span>
            </div>
            <h3 className="text-xl font-bold text-white">Quality, Security & Performance Review</h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Testing, code review and performance checks are planned around the application and its agreed requirements. Findings inform fixes and release decisions.
            </p>
          </div>
          <button
            onClick={() => handleScroll("contact")}
            className="px-6 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white font-bold text-xs shrink-0 cursor-pointer transition-colors"
          >
            Discuss Technical Scope
          </button>
        </div>
      </div>
    </section>
  );
}
