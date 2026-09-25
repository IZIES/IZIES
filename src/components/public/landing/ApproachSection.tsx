"use client";

import { useState } from "react";
import { Terminal } from "lucide-react";

export function ApproachSection() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const processSteps = [
    {
      step: "01",
      title: "Understand",
      summary: "Discovery, User Needs & Problem Formulation",
      detail: "We conduct deep discovery sessions to understand your business objectives, target audience pain points, technical constraints, and long-term product vision before writing any code.",
      deliverable: "Product Scope Document, Technical Feasibility Matrix, User Personas"
    },
    {
      step: "02",
      title: "Plan",
      summary: "System Architecture, Tech Stack & Roadmap",
      detail: "We architect the database schemas, API contracts, infrastructure requirements, milestone timelines, and security policies to plan a maintainable foundation.",
      deliverable: "System Architecture Blueprint, Database ERD, Sprint Roadmap"
    },
    {
      step: "03",
      title: "Design",
      summary: "Clean UX, Micro-Interactions & Design System",
      detail: "Our product designers craft high-fidelity wireframes, responsive component libraries, and ergonomic workflows that make complex systems feel effortless to use.",
      deliverable: "Figma Component Library, Interactive Prototype, Design Tokens"
    },
    {
      step: "04",
      title: "Develop",
      summary: "Agile Sprints, Type-Safe Code & Continuous Integration",
      detail: "Our engineering squads build modular, clean, and type-safe software with automated CI/CD pipelines, daily PR reviews, and transparent staging builds.",
      deliverable: "Production Codebase, Live Staging Deployments, API Documentation"
    },
    {
      step: "05",
      title: "Test",
      summary: "Performance Benchmarks, Load Validation & Security",
      detail: "We execute end-to-end integration tests, penetration audits, database query profiling, and multi-device QA to identify and resolve issues before release.",
      deliverable: "QA Report, Performance Review, Security Findings"
    },
    {
      step: "06",
      title: "Launch & Scale",
      summary: "Production Deployment, Telemetry & Iterative Evolution",
      detail: "We plan and execute cloud deployment, connect real-time telemetry monitors, and provide dedicated post-launch support and feature scaling.",
      deliverable: "Production System, Monitoring Setup, Agreed Maintenance Plan"
    }
  ];

  return (
    <section id="approach" className="relative z-10 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
            <Terminal className="w-3.5 h-3.5" />
            <span>Engineering Protocol</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How We Build
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            A structured, transparent methodology ensuring predictability, security, and world-class craft.
          </p>
        </div>

        {/* Interactive Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {processSteps.map((s, idx) => (
            <div
              key={s.step}
              onClick={() => setActiveStep(idx)}
              className={`glass-card p-7 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                activeStep === idx
                  ? "border-indigo-500 bg-indigo-950/20 shadow-xl shadow-indigo-600/15 ring-1 ring-indigo-500/40"
                  : "border-white/[0.08] hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 font-mono">
                  STAGE {s.step}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Phase {idx + 1}/6</span>
              </div>

              <h3 className="text-xl font-bold text-white">{s.title}</h3>
              <p className="text-xs font-semibold text-indigo-300">{s.summary}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{s.detail}</p>

              <div className="pt-3 border-t border-white/[0.06] text-[11px] text-slate-400">
                <strong className="text-white block mb-0.5">Key Deliverable:</strong>
                <span>{s.deliverable}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
