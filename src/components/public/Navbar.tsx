"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ArrowRight,
  Briefcase,
  ChevronRight,
  Cpu,
  Building2,
  Workflow,
  Info,
  Mail,
  Phone,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile drawer on desktop resize (>1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSectionLink = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (pathname === "/") {
      event.preventDefault();
      scrollToSection(id);
    } else {
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { num: "01", name: "Capabilities", id: "capabilities", icon: Cpu, href: "/#capabilities", desc: "AI, Web, Mobile & Cloud" },
    { num: "02", name: "Industries", id: "industries", icon: Building2, href: "/#industries", desc: "Domain-specific solutions" },
    { num: "03", name: "Approach", id: "approach", icon: Workflow, href: "/#approach", desc: "Agile delivery lifecycle" },
    { num: "04", name: "About", id: "about", icon: Info, href: "/#about", desc: "Vision, culture & leadership" },
    { num: "05", name: "Contact", id: "contact", icon: Mail, href: "/#contact", desc: "Get project consultation" },
  ];

  const isProductsActive = pathname.startsWith("/products");

  return (
    <>
      {/* Mobile / Tablet Full Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="w-full px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Main Bar */}
          <div
            className={`w-full transition-all duration-300 ${
              scrolled || mobileMenuOpen
                ? "mt-2 sm:mt-3 lg:mt-4 rounded-2xl sm:rounded-3xl bg-[#04060A]/95 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] ring-1 ring-white/5"
                : "mt-0 rounded-none lg:rounded-3xl bg-[#04060A]/90 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none border-b lg:border-b-0 border-white/10 lg:border-transparent"
            }`}
          >
            <div className="w-full h-16 sm:h-18 lg:h-20 px-3.5 sm:px-5 lg:px-7 flex items-center justify-between">
              {/* Brand Logo */}
              <Link
                href="/"
                className="flex items-center gap-2.5 sm:gap-3 group shrink-0 focus-visible:outline-none"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="relative flex items-center justify-center">
                  <Image
                    src="/brand/izies-logo-transparent.png"
                    alt="IZIES Logo"
                    width={40}
                    height={40}
                    priority
                    className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 object-contain drop-shadow-[0_0_12px_rgba(34,211,238,0.6)] group-hover:drop-shadow-[0_0_20px_rgba(34,211,238,0.9)] transition-all duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="font-logo font-bold text-xl sm:text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-300">
                      IZIES
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(34,211,238,1)]" />
                      Digital OS
                    </span>
                  </div>
                  <span className="text-[10px] text-cyan-400/80 uppercase tracking-widest font-semibold hidden xl:inline -mt-0.5">
                    Technology & Digital Innovation
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation Links (Visible on >=1024px Laptop & Large Screens) */}
              <nav className="hidden lg:flex items-center gap-4 lg:gap-5 xl:gap-7">
                {navLinks.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={(event) => handleSectionLink(event, link.id)}
                    className="text-[13px] font-semibold text-slate-300 hover:text-cyan-300 transition-colors py-1 relative group tracking-wide"
                  >
                    <span>{link.name}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-full transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}

                {/* Careers Link with Hiring Badge */}
                <Link
                  href="/careers"
                  className="group flex items-center gap-1.5 text-[13px] font-semibold text-slate-300 hover:text-emerald-300 transition-colors py-1 relative"
                >
                  <span>Careers</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[9px] uppercase font-bold tracking-widest transition-all group-hover:bg-emerald-500/20 group-hover:scale-105">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Hiring
                  </span>
                </Link>
              </nav>

              {/* Right Action Elements */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Desktop Primary Action CTA */}
                <Link
                  href="/#contact"
                  onClick={(event) => handleSectionLink(event, "contact")}
                  className="hidden lg:inline-flex items-center justify-center gap-2 px-4 lg:px-5 py-2 lg:py-2.5 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white text-xs lg:text-[13px] font-bold tracking-wide transition-all hover:opacity-95 hover:scale-[1.02] active:scale-95 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 shrink-0"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>

                {/* Tablet Quick CTA (hidden on small phone, visible on 640px - 1023px) */}
                <Link
                  href="/#contact"
                  onClick={(event) => handleSectionLink(event, "contact")}
                  className="hidden sm:inline-flex lg:hidden items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold shadow-md shadow-cyan-500/20 active:scale-95"
                >
                  <span>Start Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {/* Mobile / Tablet Hamburger Toggle */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 sm:p-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-slate-200 hover:text-white hover:bg-white/[0.08] active:scale-95 transition-all lg:hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  aria-label="Toggle navigation menu"
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-nav-drawer"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5 text-white" />
                  ) : (
                    <Menu className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.7)]" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile & Tablet Elegant Drawer */}
            <div
              id="mobile-nav-drawer"
              className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                mobileMenuOpen
                  ? "max-h-[calc(100dvh-5.5rem)] opacity-100 border-t border-white/[0.08]"
                  : "max-h-0 opacity-0 border-t border-transparent pointer-events-none"
              }`}
            >
              <div className="p-4 sm:p-6 space-y-4 max-h-[calc(100dvh-6.5rem)] overflow-y-auto overscroll-contain">
                {/* Navigation Links - Clean Minimalist Elegant List */}
                <div className="space-y-1">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.id}
                        href={link.href}
                        onClick={(event) => handleSectionLink(event, link.id)}
                        className="group flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-white/[0.05] active:bg-white/[0.08] transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[11px] font-bold text-cyan-400/70 group-hover:text-cyan-300 transition-colors">
                            {link.num}
                          </span>
                          <span className="font-semibold text-base text-slate-200 group-hover:text-white transition-colors">
                            {link.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 group-hover:text-slate-400 hidden sm:inline transition-colors">
                            {link.desc}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Careers Card - Refined & Sleek */}
                <Link
                  href="/careers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="group flex items-center justify-between p-3.5 rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-500/[0.06] to-transparent hover:border-emerald-500/40 active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-white group-hover:text-emerald-300 transition-colors">
                        Careers & Talent
                      </div>
                      <div className="text-[11px] text-slate-400">Join our engineering squad</div>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Hiring
                  </span>
                </Link>

                {/* Mobile Drawer Bottom Actions */}
                <div className="pt-2 border-t border-white/[0.08] space-y-3">
                  <Link
                    href="/#contact"
                    onClick={(event) => handleSectionLink(event, "contact")}
                    className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white text-sm font-bold shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-transform"
                  >
                    <span>Start a Project</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Free Consultation
                    </span>
                    <span>•</span>
                    <span>Direct Team Response in 24h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}


