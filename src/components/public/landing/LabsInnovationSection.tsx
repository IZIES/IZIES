"use client";

import { useState, useEffect } from "react";
import { Sparkle, CheckCircle2, ExternalLink, ChevronRight, Clock, Zap, FlaskConical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionExperience } from "./SectionExperience";
import Link from "next/link";

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

const STATUS_CFG: Record<string, { label: string; dot: string; badge: string }> = {
  live: { label: "Live", dot: "bg-emerald-400", badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  beta: { label: "Beta", dot: "bg-amber-400", badge: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  in_development: { label: "In Dev", dot: "bg-indigo-400", badge: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" },
  coming_soon: { label: "Coming Soon", dot: "bg-purple-400", badge: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
};

const COLOR_BG: Record<string, string> = {
  indigo: "from-indigo-500/[0.08]",
  cyan: "from-cyan-500/[0.08]",
  purple: "from-purple-500/[0.08]",
  violet: "from-violet-500/[0.08]",
  blue: "from-blue-500/[0.08]",
  emerald: "from-emerald-500/[0.08]",
};

const COLOR_BORDER: Record<string, string> = {
  indigo: "border-indigo-500/30",
  cyan: "border-cyan-500/30",
  purple: "border-purple-500/30",
  violet: "border-violet-500/30",
  blue: "border-blue-500/30",
  emerald: "border-emerald-500/30",
};

const COLOR_TEXT: Record<string, string> = {
  indigo: "text-indigo-400",
  cyan: "text-cyan-400",
  purple: "text-purple-400",
  violet: "text-violet-400",
  blue: "text-blue-400",
  emerald: "text-emerald-400",
};

export function LabsInnovationSection() {
  const [labsEmail, setLabsEmail] = useState("");
  const [labsSubscribed, setLabsSubscribed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => { if (d.success) setProducts(d.products.slice(0, 3)); })
      .catch(() => {});
  }, []);

  const handleLabsSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labsEmail) return;
    setLabsSubscribed(true);
    setLabsEmail("");
  };

  return (
    <section id="labs" className="iz-downstream-section iz-depth-6 relative z-10 py-24 px-6 overflow-hidden">
      <SectionExperience variant="labs" />
      <div className="max-w-5xl mx-auto space-y-10 relative z-10">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            <FlaskConical className="w-3.5 h-3.5 text-indigo-400" />
            <span>IZIES Labs & Products</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Built by IZIES. For Everyone.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Alongside client work, we build original digital products — free and open platforms for the world.
          </p>
        </div>

        {/* Product Preview Cards */}
        {products.length > 0 && (
          <div className={`grid gap-5 ${products.length === 1 ? "max-w-sm mx-auto" : products.length === 2 ? "sm:grid-cols-2 max-w-2xl mx-auto" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
            {products.map((product) => {
              const status = STATUS_CFG[product.status] ?? STATUS_CFG.in_development;
              const color = product.color ?? "indigo";
              return (
                <div
                  key={product.id}
                  className={`group relative rounded-2xl border ${COLOR_BORDER[color] ?? "border-white/[0.10]"} bg-gradient-to-br ${COLOR_BG[color] ?? ""} to-transparent p-6 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                  style={{ background: `linear-gradient(135deg, rgba(${color === "indigo" ? "99,102,241" : color === "cyan" ? "34,211,238" : color === "purple" ? "168,85,247" : color === "blue" ? "59,130,246" : color === "violet" ? "139,92,246" : "52,211,153"},0.07) 0%, rgba(8,11,21,0.3) 100%)` }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-bold text-white`}>{product.name}</h3>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${status.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
                      {status.label}
                    </span>
                  </div>

                  <p className={`text-xs font-semibold ${COLOR_TEXT[color] ?? "text-indigo-400"}`}>{product.tagline}</p>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{product.description}</p>

                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${status.badge}`}>
                    {product.type}
                  </span>

                  {product.url ? (
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors group/link"
                    >
                      <ExternalLink className="w-3.5 h-3.5 group-hover/link:scale-110 transition-transform" />
                      <span>{product.status === "live" ? "Visit" : "Explore"} {product.name}</span>
                    </a>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Clock className="w-3.5 h-3.5" />
                      Coming Soon
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* See All Products Link */}
        <div className="text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-semibold hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all duration-300 group"
          >
            <Sparkle className="w-4 h-4" />
            <span>See All Products & Labs</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Email Notification Box */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-[#0D1224] via-[#0A0E1A] to-[#070912] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 blur-[90px] rounded-full pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Products in development
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/[0.05] border border-white/10 text-slate-300">
                  More coming soon
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Get Early Access & Launch Invites
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Drop your email to be first in line when we launch new products.
              </p>
            </div>

            <div className="w-full sm:w-80 shrink-0">
              {labsSubscribed ? (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>You&apos;re on the launch list! We&apos;ll send you an exclusive invite.</span>
                </div>
              ) : (
                <form onSubmit={handleLabsSubscribe} className="space-y-2">
                  <Input
                    type="email"
                    required
                    placeholder="Enter your work email"
                    value={labsEmail}
                    onChange={(e) => setLabsEmail(e.target.value)}
                    className="h-11 rounded-xl bg-black/50 border-white/10 text-white text-xs focus:border-indigo-500"
                  />
                  <Button type="submit" size="sm" className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold">
                    Notify Me
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
