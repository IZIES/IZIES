import { Building2, Rocket, Zap, ShieldCheck, Radio, Users } from "lucide-react";

export function IndustriesSection() {
  return (
    <section id="industries" className="relative z-10 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Tailored Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Technology Built Around Your Goals
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            We understand that different business stages require distinct architectural choices and execution speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Startups */}
          <div className="glass-card p-8 rounded-3xl border border-white/[0.08] hover:border-indigo-500/40 space-y-4">
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 w-fit">
              <Rocket className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Startups</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              From initial idea to rapid MVP validation and high-speed market launch with production-ready architecture.
            </p>
          </div>

          {/* 2. Growing Businesses */}
          <div className="glass-card p-8 rounded-3xl border border-white/[0.08] hover:border-purple-500/40 space-y-4">
            <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 w-fit">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Growing Businesses</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Modernizing existing legacy software, eliminating operational bottlenecks, and automating workflows.
            </p>
          </div>

          {/* 3. Enterprises */}
          <div className="glass-card p-8 rounded-3xl border border-white/[0.08] hover:border-blue-500/40 space-y-4">
            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Enterprises</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Secure, highly compliant, multi-system integrations and high-availability distributed platforms.
            </p>
          </div>

          {/* 4. Creators & Communities */}
          <div className="glass-card p-8 rounded-3xl border border-white/[0.08] hover:border-pink-500/40 space-y-4">
            <div className="p-3.5 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 w-fit">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Creators & Communities</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Dynamic media platforms, streaming experiences, and community engagement infrastructure.
            </p>
          </div>

          {/* 5. Technology Partners */}
          <div className="glass-card p-8 rounded-3xl border border-white/[0.08] hover:border-emerald-500/40 space-y-4 md:col-span-2 lg:col-span-2">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Technology Partners</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Dedicated engineering squads, specialized technical leadership, and long-term product maintenance advisory.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
