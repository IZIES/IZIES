import { Code2 } from "lucide-react";

export function WhatWeBuildSection() {
  const platforms = [
    { title: "SaaS Platforms", desc: "Multi-tenant subscription web apps with billing & user roles." },
    { title: "AI-Powered Applications", desc: "Intelligent apps with LLM integrations, search, & agents." },
    { title: "Mobile & Web Applications", desc: "Cross-platform mobile apps with responsive web interfaces." },
    { title: "CRM & ERP Systems", desc: "Custom operational software tailored to company workflows." },
    { title: "Marketplace Platforms", desc: "Multi-vendor digital marketplaces with payment escrow." },
    { title: "Real-Time Comms", desc: "WebSocket chat, video calls, & live activity feeds." },
    { title: "Automation Dashboards", desc: "Telemetry tracking, metric visualizations & alerts." },
    { title: "Streaming Platforms", desc: "Adaptive video & audio distribution engines." },
    { title: "Internal Business Software", desc: "High-security tools to accelerate team productivity." },
    { title: "Cloud Enterprise Solutions", desc: "Resilient microservices, API gateways & data pipelines." },
  ];

  return (
    <section id="build" className="py-28 px-6 max-w-7xl mx-auto relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {platforms.map((item, idx) => (
          <div
            key={idx}
            className="glass-card p-5 rounded-2xl border border-white/[0.08] hover:border-indigo-500/40 space-y-2"
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              <h3 className="font-bold text-white text-sm">{item.title}</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
