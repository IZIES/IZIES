"use client";

import { useState } from "react";
import Link from "next/link";
import { capabilityContent } from "@/lib/capabilities";
import { SectionExperience } from "./SectionExperience";
import {
    Cpu,
    Brain,
    Globe,
    Smartphone,
    Workflow,
    Server,
    Cloud,
    BarChart3,
    Boxes,
    Film,
    Compass,
    Bug,
    Users,
    Headphones
  } from "lucide-react";

export function CapabilitiesSection() {
  const [activeCapCategory, setActiveCapCategory] = useState<string>("all");

  const capabilities = [
    {
      id: "ai",
      category: "ai",
      icon: Brain,
      theme: "from-purple-500/20 to-indigo-500/5",
      border: "hover:border-purple-500/50 hover:shadow-purple-500/10",
      accent: "text-purple-400",
      pill: "bg-purple-500/15 text-purple-300 border-purple-500/30",
      ...capabilityContent["ai"]
    },
    {
      id: "web-saas",
      category: "web",
      icon: Globe,
      theme: "from-blue-500/20 to-indigo-500/5",
      border: "hover:border-blue-500/50 hover:shadow-blue-500/10",
      accent: "text-blue-400",
      pill: "bg-blue-500/15 text-blue-300 border-blue-500/30",
      ...capabilityContent["web-saas"]
    },
    {
      id: "mobile",
      category: "mobile",
      icon: Smartphone,
      theme: "from-cyan-500/20 to-blue-500/5",
      border: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
      accent: "text-cyan-400",
      pill: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
      ...capabilityContent["mobile"]
    },
    {
      id: "automation",
      category: "automation",
      icon: Workflow,
      theme: "from-emerald-500/20 to-teal-500/5",
      border: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
      accent: "text-emerald-400",
      pill: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      ...capabilityContent["automation"]
    },
    {
      id: "backend-api",
      category: "backend",
      icon: Server,
      theme: "from-indigo-500/20 to-purple-500/5",
      border: "hover:border-indigo-500/50 hover:shadow-indigo-500/10",
      accent: "text-indigo-400",
      pill: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
      ...capabilityContent["backend-api"]
    },
    {
      id: "cloud-devops",
      category: "cloud",
      icon: Cloud,
      theme: "from-amber-500/20 to-orange-500/5",
      border: "hover:border-amber-500/50 hover:shadow-amber-500/10",
      accent: "text-amber-400",
      pill: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      ...capabilityContent["cloud-devops"]
    },
    {
      id: "data-analytics",
      category: "analytics",
      icon: BarChart3,
      theme: "from-rose-500/20 to-pink-500/5",
      border: "hover:border-rose-500/50 hover:shadow-rose-500/10",
      accent: "text-rose-400",
      pill: "bg-rose-500/15 text-rose-300 border-rose-500/30",
      ...capabilityContent["data-analytics"]
    },
    {
      id: "web3",
      category: "emerging",
      icon: Boxes,
      theme: "from-violet-500/20 to-purple-500/5",
      border: "hover:border-violet-500/50 hover:shadow-violet-500/10",
      accent: "text-violet-400",
      pill: "bg-violet-500/15 text-violet-300 border-violet-500/30",
      ...capabilityContent["web3"]
    },
    {
      id: "media-streaming",
      category: "emerging",
      icon: Film,
      theme: "from-pink-500/20 to-rose-500/5",
      border: "hover:border-pink-500/50 hover:shadow-pink-500/10",
      accent: "text-pink-400",
      pill: "bg-pink-500/15 text-pink-300 border-pink-500/30",
      ...capabilityContent["media-streaming"]
    },
    {
      id: "immersive",
      category: "emerging",
      icon: Compass,
      theme: "from-indigo-500/20 to-cyan-500/5",
      border: "hover:border-indigo-500/50 hover:shadow-indigo-500/10",
      accent: "text-indigo-400",
      pill: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
      ...capabilityContent["immersive"]
    },
    {
      id: "testing-qa",
      category: "testing",
      icon: Bug,
      theme: "from-green-500/20 to-emerald-500/5",
      border: "hover:border-green-500/50 hover:shadow-green-500/10",
      accent: "text-green-400",
      pill: "bg-green-500/15 text-green-300 border-green-500/30",
      ...capabilityContent["testing-qa"]
    },
    {
      id: "dedicated-team",
      category: "team",
      icon: Users,
      theme: "from-teal-500/20 to-cyan-500/5",
      border: "hover:border-teal-500/50 hover:shadow-teal-500/10",
      accent: "text-teal-400",
      pill: "bg-teal-500/15 text-teal-300 border-teal-500/30",
      ...capabilityContent["dedicated-team"]
    },
    {
      id: "support-maintenance",
      category: "support",
      icon: Headphones,
      theme: "from-sky-500/20 to-blue-500/5",
      border: "hover:border-sky-500/50 hover:shadow-sky-500/10",
      accent: "text-sky-400",
      pill: "bg-sky-500/15 text-sky-300 border-sky-500/30",
      ...capabilityContent["support-maintenance"]
    }
  ];

  const filteredCapabilities =
    activeCapCategory === "all"
      ? capabilities
      : capabilities.filter((c) => c.category === activeCapCategory);

  return (
    <section id="capabilities" className="iz-capabilities-section py-28 px-6 relative z-10 overflow-hidden">
      <SectionExperience variant="constellation" />
      <div className="max-w-7xl mx-auto relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span>From Planning to Ongoing Support</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Software Development Services & Capabilities
        </h2>
        <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
          Explore how IZIES can help you build a website, launch an app, automate operations or improve an existing product. Each engagement is scoped around your users, requirements and business priorities.
        </p>

        <Link href="/services" className="inline-flex text-sm font-semibold text-indigo-300 hover:text-white">Explore all digital engineering services →</Link>

        {/* Interactive Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {[
            { id: "all", label: `All Capabilities (${capabilities.length})` },
            { id: "ai", label: "AI & Intelligence" },
            { id: "web", label: "Web & SaaS" },
            { id: "mobile", label: "Mobile" },
            { id: "automation", label: "Automation" },
            { id: "backend", label: "Backend & APIs" },
            { id: "cloud", label: "Cloud & DevOps" },
            { id: "analytics", label: "Data & Analytics" },
            { id: "emerging", label: "Emerging Tech" },
            { id: "testing", label: "Testing & QA" },
            { id: "team", label: "Dedicated Team" },
            { id: "support", label: "Support & Maintenance" },
          ].map((cat) => (
            <button
              key={cat.id}
              aria-pressed={activeCapCategory === cat.id}
              onClick={() => setActiveCapCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeCapCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400"
                  : "bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06] hover:bg-white/[0.08]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Capability Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {filteredCapabilities.map((cap) => {
          const Icon = cap.icon;
          return (
            <Link key={cap.id} href={`/services/${cap.slug}`} className="block">
              <article
                id={`service-${cap.id}`}
                className={`iz-feature-card glass-card p-8 rounded-3xl border border-white/[0.08] ${cap.border} space-y-5 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1`}
              >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`h-12 w-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center ${cap.accent} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${cap.pill}`}>
                    {cap.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {cap.description}
                  </p>
                </div>

                <ul className="space-y-2 pt-1 border-t border-white/[0.06] text-xs sm:text-sm text-slate-300">
                  {cap.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${cap.accent}`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </article>
            </Link>
          );
        })}
      </div>
      </div>
    </section>
  );
}
