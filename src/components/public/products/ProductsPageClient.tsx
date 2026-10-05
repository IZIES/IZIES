"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ExternalLink,
  Rocket,
  Globe,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  FlaskConical,
  Star,
  Users,
  Code2,
  ChevronRight,
  X,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  type: string;
  status: string;
  url: string | null;
  imageUrl: string | null;
  iconName: string | null;
  color: string | null;
  tags: string[];
  isFeatured: boolean;
  order: number;
};

const STATUS_CONFIG: Record<string, { label: string; icon: React.FC<{ className?: string }>; classes: string; dotColor: string }> = {
  live: {
    label: "Live",
    icon: CheckCircle2,
    classes: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    dotColor: "bg-emerald-400",
  },
  beta: {
    label: "Beta",
    icon: Zap,
    classes: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    dotColor: "bg-amber-400",
  },
  in_development: {
    label: "In Development",
    icon: Clock,
    classes: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    dotColor: "bg-indigo-400",
  },
  coming_soon: {
    label: "Coming Soon",
    icon: Sparkles,
    classes: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    dotColor: "bg-purple-400",
  },
};

const COLOR_MAP: Record<string, { glow: string; border: string; badge: string; icon: string }> = {
  indigo: {
    glow: "rgba(99,102,241,0.12)",
    border: "border-indigo-500/40",
    badge: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    icon: "text-indigo-400",
  },
  cyan: {
    glow: "rgba(34,211,238,0.12)",
    border: "border-cyan-500/40",
    badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    icon: "text-cyan-400",
  },
  purple: {
    glow: "rgba(168,85,247,0.12)",
    border: "border-purple-500/40",
    badge: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    icon: "text-purple-400",
  },
  violet: {
    glow: "rgba(139,92,246,0.12)",
    border: "border-violet-500/40",
    badge: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    icon: "text-violet-400",
  },
  blue: {
    glow: "rgba(59,130,246,0.12)",
    border: "border-blue-500/40",
    badge: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    icon: "text-blue-400",
  },
  emerald: {
    glow: "rgba(52,211,153,0.12)",
    border: "border-emerald-500/40",
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    icon: "text-emerald-400",
  },
};

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Rocket,
  Globe,
  Sparkles,
  Zap,
  Star,
  Users,
  Code2,
  FlaskConical,
};

function ProductCard({ product }: { product: Product }) {
  const statusCfg = STATUS_CONFIG[product.status] ?? STATUS_CONFIG.in_development;
  const colorCfg = COLOR_MAP[product.color ?? "indigo"] ?? COLOR_MAP.indigo;
  const StatusIcon = statusCfg.icon;
  const ProductIcon = ICON_MAP[product.iconName ?? "Rocket"] ?? Rocket;

  return (
    <div
      className={`group relative flex flex-col sm:flex-row items-stretch gap-6 sm:gap-8 p-4 sm:p-6 rounded-[2rem] border bg-[#080B15] overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${
        product.isFeatured
          ? `${colorCfg.border} shadow-lg`
          : "border-white/[0.08] hover:border-white/[0.15]"
      }`}
      style={
        product.isFeatured
          ? { boxShadow: `0 0 0 1px ${colorCfg.glow}, 0 20px 60px ${colorCfg.glow}` }
          : undefined
      }
    >
      {/* Featured Badge */}
      {product.isFeatured && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          Featured
        </div>
      )}

      {/* Product Screenshot / Image */}
      <div
        className="relative w-full sm:w-64 md:w-80 shrink-0 aspect-video sm:aspect-[4/3] overflow-hidden rounded-2xl border border-white/[0.05]"
        style={{ background: `radial-gradient(ellipse 80% 80% at 50% 50%, ${colorCfg.glow} 0%, rgba(8,11,21,0.8) 100%)` }}
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 320px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ProductIcon className={`w-16 h-16 opacity-20 ${colorCfg.icon}`} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 py-2 space-y-4 min-w-0">
        {/* Header */}
        <div className="space-y-3 pr-20 sm:pr-0">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl border shrink-0"
              style={{ background: colorCfg.glow, borderColor: `${colorCfg.glow}` }}
            >
              <ProductIcon className={`w-4 h-4 ${colorCfg.icon}`} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{product.name}</h2>
              <p className={`text-xs font-semibold ${colorCfg.icon} mt-0.5`}>{product.tagline}</p>
            </div>
          </div>

          {/* Status + Type Badges */}
          <div className="flex items-center flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusCfg.classes}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotColor} animate-pulse`} />
              {statusCfg.label}
            </span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border ${colorCfg.badge}`}>
              {product.type}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed flex-1 line-clamp-3">{product.description}</p>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="pt-2">
          {product.url ? (
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl font-bold text-sm transition-all duration-300 group/btn ${
                product.isFeatured
                  ? "bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white hover:opacity-90 hover:scale-[1.01] shadow-lg shadow-indigo-500/20"
                  : "border border-white/10 bg-white/[0.03] text-slate-300 hover:text-white hover:bg-white/[0.07] hover:border-white/20"
              }`}
            >
              <span>{product.status === "live" ? "Visit " + product.name : "Explore " + product.name}</span>
              <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </a>
          ) : (
            <div className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl font-bold text-sm border border-white/[0.06] bg-white/[0.02] text-slate-500 cursor-not-allowed">
              <Clock className="w-4 h-4" />
              <span>Available Soon</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductsPageClient({ products, activeService }: { products: Product[], activeService?: any }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 4, products.length));
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [products.length]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  // Sort: featured first
  const sorted = [...products].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return a.order - b.order;
  });

  return (
    <div className="relative min-h-screen text-slate-100 overflow-x-hidden">
      {/* ─── Hero ─────────────────────────────────────── */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/[0.07] blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-purple-600/[0.08] blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/25">
            <FlaskConical className="w-3.5 h-3.5 text-indigo-400" />
            <span>IZIES Labs & Products</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05]">
            Built by IZIES.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">
              For Everyone.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We don&apos;t just build for clients — we build for the world. Here are the original products coming out of IZIES Labs.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Free & accessible
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              {products.length} product{products.length !== 1 ? "s" : ""} in the lab
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              More launching soon
            </span>
          </div>

          {activeService && (
            <div className="flex justify-center pt-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-300 shadow-lg shadow-indigo-500/5">
                <span>Showing products for: <strong className="font-bold text-white">{activeService.title}</strong></span>
                <Link href="/products" className="p-1 hover:bg-indigo-500/20 rounded-full transition-colors ml-1" title="Clear filter">
                  <X className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Products Grid ────────────────────────────── */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {sorted.length === 0 ? (
            <div className="text-center py-24 space-y-4">
              <FlaskConical className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-slate-500 text-lg font-medium">Products are being cooked up in the lab.</p>
              <p className="text-slate-600 text-sm">Check back soon.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {sorted.slice(0, visibleCount).map((product) => (
                <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <ProductCard product={product} />
                </div>
              ))}

              {/* Coming Soon placeholder card */}
              <div className="relative flex flex-col sm:flex-row items-center gap-6 rounded-[2rem] border border-dashed border-white/[0.1] bg-white/[0.01] overflow-hidden p-6 sm:p-8 group hover:border-white/[0.2] transition-colors duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/[0.03] to-indigo-500/[0.03]" />
                <div className="relative z-10 w-16 h-16 shrink-0 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:border-white/[0.15] transition-colors">
                  <Sparkles className="w-7 h-7 text-slate-500 group-hover:text-purple-400 transition-colors" />
                </div>
                <div className="relative z-10 flex-1 space-y-2 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-slate-400 group-hover:text-white transition-colors">Something&apos;s Brewing</h3>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto sm:mx-0">
                    The next IZIES product is in the lab. Stay tuned.
                  </p>
                </div>
                <div className="relative z-10 shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                    Coming Soon
                  </span>
                </div>
              </div>

              {visibleCount < sorted.length && (
                <div ref={loadMoreRef} className="py-12 flex justify-center">
                  <div className="inline-flex items-center gap-3 text-indigo-500/50">
                    <div className="w-4 h-4 rounded-full border-2 border-indigo-500/50 border-t-indigo-400 animate-spin" />
                    <span className="text-sm font-medium">Loading more products...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─── Newsletter / Notify Section ──────────────── */}
      <section className="relative z-10 px-6 pb-28">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-3xl border border-indigo-500/25 bg-gradient-to-br from-[#0C1020] via-[#090D1A] to-[#070912] p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 blur-[90px] rounded-full pointer-events-none" />
            <div className="relative z-10 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>IZIES Labs</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Get Early Access to New Products
              </h2>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                We&apos;re constantly building. Drop your email to get notified when we launch something new — early access, exclusive previews, and first-look invitations.
              </p>

              {subscribed ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>You&apos;re on the launch list! We&apos;ll send you an exclusive invite.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 pt-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-12 px-4 rounded-xl bg-black/50 border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="h-12 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white text-sm font-bold hover:opacity-90 transition-opacity shrink-0"
                  >
                    Notify Me
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Back to main site ────────────────────────── */}
      <section className="relative z-10 px-6 pb-20 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-400 transition-colors group"
        >
          <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
          Back to IZIES
        </Link>
      </section>
    </div>
  );
}
