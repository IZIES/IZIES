import { ShieldCheck, Check } from "lucide-react";

export function WhyChooseUsSection() {
  const values = [
    { title: "Complete Idea-to-Launch", desc: "End-to-end execution across product strategy, design, and engineering." },
    { title: "AI-First Capabilities", desc: "Native intelligence integrated at the foundational system level." },
    { title: "Modern & Scalable", desc: "Architecture planned around your traffic, data and growth requirements." },
    { title: "User-Friendly Design", desc: "Obsessive focus on intuitive UX, visual elegance, and seamless ergonomics." },
    { title: "Security & Performance", desc: "Access controls, data protection and performance testing appropriate to your application." },
    { title: "Transparent Comms", desc: "Clear milestone updates, direct access to builders, and zero ambiguity." },
    { title: "24×7 Service Availability", desc: "Software support and maintenance with response targets agreed for your project." },
    { title: "Flexible Solutions", desc: "Tailored architectures matching diverse industrial and organizational needs." },
  ];

  return (
    <section className="py-28 px-6 max-w-7xl mx-auto relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>The IZIES Advantage</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Why Work With IZIES?
        </h2>
        <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
          We operate as a high-velocity extension of your core vision.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((item, idx) => (
          <div
            key={idx}
            className="glass-card p-6 rounded-3xl border border-white/[0.08] hover:border-blue-500/40 space-y-3"
          >
            <div className="h-8 w-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
              <Check className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-base">{item.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
