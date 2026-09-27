import { Code2, LayoutDashboard, Bot, Smartphone, Database, ShoppingBag, Radio, LineChart, Video, ShieldCheck, Cloud } from "lucide-react";
import { SectionExperience } from "./SectionExperience";

export function WhatWeBuildSection() {
  const platforms = [
    { title: "SaaS Platforms", desc: "Multi-tenant subscription web apps with billing & user roles.", icon: LayoutDashboard, color: "text-indigo-400" },
    { title: "AI-Powered Applications", desc: "Intelligent apps with LLM integrations, search, & agents.", icon: Bot, color: "text-purple-400" },
    { title: "Mobile & Web Apps", desc: "Cross-platform mobile apps with responsive web interfaces.", icon: Smartphone, color: "text-cyan-400" },
    { title: "CRM & ERP Systems", desc: "Custom operational software tailored to company workflows.", icon: Database, color: "text-emerald-400" },
    { title: "Marketplaces", desc: "Multi-vendor digital marketplaces with payment escrow.", icon: ShoppingBag, color: "text-amber-400" },
    { title: "Real-Time Comms", desc: "WebSocket chat, video calls, & live activity feeds.", icon: Radio, color: "text-rose-400" },
    { title: "Automation Dashboards", desc: "Telemetry tracking, metric visualizations & alerts.", icon: LineChart, color: "text-blue-400" },
    { title: "Streaming Platforms", desc: "Adaptive video & audio distribution engines.", icon: Video, color: "text-fuchsia-400" },
    { title: "Internal Software", desc: "High-security tools to accelerate team productivity.", icon: ShieldCheck, color: "text-teal-400" },
    { title: "Cloud Enterprise", desc: "Resilient microservices, API gateways & data pipelines.", icon: Cloud, color: "text-sky-400" },
  ];

  return (
    <section id="build" className="iz-downstream-section iz-depth-3 py-28 px-6 relative z-10 overflow-hidden">
      <SectionExperience variant="products" />
      <div className="max-w-7xl mx-auto relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          <Code2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Digital Solutions</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          From Ideas to Digital Solutions
        </h2>
        <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
          Here are practical examples of systems, architectures, and platforms we design and engineer:
        </p>
      </div>

      {/* 10 Example Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 relative z-10">
        {platforms.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="glass-card group relative p-6 rounded-2xl border border-white/[0.08] hover:border-indigo-500/40 flex flex-col items-start gap-4 transition-all duration-300"
            >
              <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-white text-[15px]">{item.title}</h3>
                <p className="text-[13px] text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
