"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Briefcase, ChevronRight, CheckCircle2, Sparkles, FlaskConical, Rocket, Globe, Zap, Clock, Star } from "lucide-react";
import { SectionExperience } from "./SectionExperience";

type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  type: string;
  status: string;
  url: string | null;
  imageUrl: string | null;
  color: string | null;
  isFeatured: boolean;
};

type ClientProject = {
  id: string;
  name: string;
  clientName: string;
  industry: string;
  description: string;
  techStack: string[];
  imageUrl: string | null;
  websiteUrl: string | null;
  isFeatured: boolean;
};

const STATUS_CFG: Record<string, { label: string; dot: string; badge: string }> = {
  live: { label: "Live", dot: "bg-emerald-400", badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  beta: { label: "Beta", dot: "bg-amber-400", badge: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  in_development: { label: "In Dev", dot: "bg-indigo-400", badge: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" },
  coming_soon: { label: "Coming Soon", dot: "bg-purple-400", badge: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
};

const COLOR_BG: Record<string, string> = {
  indigo: "from-indigo-500/[0.08]", cyan: "from-cyan-500/[0.08]", purple: "from-purple-500/[0.08]",
  violet: "from-violet-500/[0.08]", blue: "from-blue-500/[0.08]", emerald: "from-emerald-500/[0.08]",
};
const COLOR_BORDER: Record<string, string> = {
  indigo: "border-indigo-500/30", cyan: "border-cyan-500/30", purple: "border-purple-500/30",
  violet: "border-violet-500/30", blue: "border-blue-500/30", emerald: "border-emerald-500/30",
};
const COLOR_TEXT: Record<string, string> = {
  indigo: "text-indigo-400", cyan: "text-cyan-400", purple: "text-purple-400",
  violet: "text-violet-400", blue: "text-blue-400", emerald: "text-emerald-400",
};

export function CombinedPortfolioSection() {
  const [activeTab, setActiveTab] = useState<"products" | "clients">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/client-projects").then((r) => r.json())
    ]).then(([prodData, clientData]) => {
      if (prodData.success) setProducts(prodData.products.slice(0, 3));
      if (clientData.success) setClients(clientData.projects.slice(0, 3));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <section id="work" className="iz-downstream-section iz-depth-6 relative z-10 py-24 px-6 overflow-hidden bg-black/20 border-t border-white/[0.05]">
      <SectionExperience variant={activeTab === "products" ? "labs" : "products"} />
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header & Tabs */}
        <div className="flex flex-col items-center text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-white/[0.03] text-slate-300 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Our Footprint</span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Work & Innovation.
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl">
            From our own open-source products to enterprise client solutions, explore what we&apos;ve been building.
          </p>

          {/* Toggle Buttons */}
          <div className="flex items-center p-1 bg-white/[0.03] border border-white/10 rounded-2xl mt-4">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === "products"
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                  : "text-slate-400 hover:text-slate-200 border border-transparent"
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              IZIES Labs
            </button>
            <button
              onClick={() => setActiveTab("clients")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === "clients"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                  : "text-slate-400 hover:text-slate-200 border border-transparent"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Client Portfolio
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 transition-opacity duration-500 animate-in fade-in zoom-in-95">
              
              {/* --- PRODUCTS TAB --- */}
              {activeTab === "products" && (
                <>
                  {products.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500">Products are currently brewing in the lab.</div>
                  ) : (
                    products.map((product) => {
                      const status = STATUS_CFG[product.status] ?? STATUS_CFG.in_development;
                      const color = product.color ?? "indigo";
                      return (
                        <div
                          key={product.id}
                          className={`group relative flex flex-col rounded-3xl border ${COLOR_BORDER[color] ?? "border-white/[0.10]"} bg-[#0A0D1A] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${COLOR_BG[color] ?? ""} to-transparent pointer-events-none`} />
                          
                          {product.imageUrl && (
                            <div className="relative h-48 overflow-hidden border-b border-white/[0.05]">
                              <Image src={product.imageUrl} alt={product.name} fill className="object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D1A] to-transparent" />
                            </div>
                          )}

                          <div className="flex flex-col flex-1 p-6 space-y-4 relative z-10">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-bold text-white">{product.name}</h3>
                              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${status.badge}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
                                {status.label}
                              </span>
                            </div>

                            <p className={`text-xs font-semibold ${COLOR_TEXT[color] ?? "text-indigo-400"}`}>{product.tagline}</p>
                            <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 flex-1">{product.description}</p>

                            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${status.badge}`}>
                                {product.type}
                              </span>
                              {product.url && (
                                <a href={product.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors group/link">
                                  <span>{product.status === "live" ? "Visit" : "Explore"}</span>
                                  <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  {/* View All Products Card */}
                  <div className="relative flex flex-col rounded-3xl border border-dashed border-indigo-500/30 bg-indigo-500/[0.02] overflow-hidden items-center justify-center p-8 group hover:border-indigo-500/50 hover:bg-indigo-500/[0.04] transition-all min-h-[300px]">
                    <Link href="/products" className="absolute inset-0 z-10" />
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-7 h-7 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-bold text-indigo-300">See All Products</h3>
                    <p className="text-sm text-slate-500 text-center mt-2 max-w-[200px]">Explore everything we&apos;re building in the lab.</p>
                  </div>
                </>
              )}

              {/* --- CLIENTS TAB --- */}
              {activeTab === "clients" && (
                <>
                  {clients.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500">No client projects added to the portfolio yet.</div>
                  ) : (
                    clients.map((project) => (
                      <div
                        key={project.id}
                        className="group relative flex flex-col rounded-3xl border border-white/[0.08] bg-[#0A0D1A] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-900/20"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-transparent pointer-events-none" />
                        
                        {project.imageUrl && (
                          <div className="relative h-48 overflow-hidden border-b border-white/[0.05]">
                            <Image src={project.imageUrl} alt={project.name} fill className="object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D1A] to-transparent" />
                          </div>
                        )}

                        <div className="flex flex-col flex-1 p-6 space-y-4 relative z-10">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-xl font-bold text-white tracking-tight">{project.name}</h3>
                              <p className="text-xs font-semibold text-cyan-400 mt-1">{project.clientName} • {project.industry}</p>
                            </div>
                            {project.isFeatured && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0">
                                <Star className="w-2.5 h-2.5 fill-amber-400" /> Featured
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 flex-1">{project.description}</p>

                          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" /> Delivered
                            </div>
                            {project.websiteUrl && (
                              <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors group/link">
                                View
                                <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {/* Contact for Project Card */}
                  <div className="relative flex flex-col rounded-3xl border border-dashed border-cyan-500/30 bg-cyan-500/[0.02] overflow-hidden items-center justify-center p-8 group hover:border-cyan-500/50 hover:bg-cyan-500/[0.04] transition-all min-h-[300px]">
                    <Link href="/#contact" className="absolute inset-0 z-10" />
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Briefcase className="w-7 h-7 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-bold text-cyan-300">Start Your Project</h3>
                    <p className="text-sm text-slate-500 text-center mt-2 max-w-[200px]">Let&apos;s build your next big digital platform together.</p>
                  </div>
                </>
              )}

            </div>
          )}
        </div>
      </div>
    </section>
  );
}
