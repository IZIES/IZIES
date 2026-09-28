"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Briefcase,
  ChevronRight,
  Cpu,
  Building2,
  Workflow,
  Info,
  Mail,
  Phone,
  Layers,
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

  // Close mobile drawer on desktop resize
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
    { name: "Capabilities", id: "capabilities", icon: Cpu, href: "/#capabilities" },
    { name: "Industries", id: "industries", icon: Building2, href: "/#industries" },
    { name: "Approach", id: "approach", icon: Workflow, href: "/#approach" },
    { name: "About", id: "about", icon: Info, href: "/#about" },
    { name: "Contact", id: "contact", icon: Mail, href: "/#contact" },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 sm:top-20 bg-black/80 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        {/* Mobile / Tablet Header Bar (Full width, solid glassmorphic background) */}
        <div className="lg:hidden w-full bg-[#04060A]/95 backdrop-blur-2xl border-b border-white/10 shadow-lg">
          <div className="w-full h-16 sm:h-20 px-4 sm:px-6 flex items-center justify-between">
            {/* Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group shrink-0 focus-visible:outline-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="relative flex items-center justify-center">
                <Image
                  src="/brand/izies-logo-transparent.png"
                  alt="IZIES Logo"
                  width={40}
                  height={40}
                  priority
                  className="h-8 w-8 sm:h-10 sm:w-10 object-contain drop-shadow-[0_0_12px_rgba(34,211,238,0.6)] group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-logo font-bold text-xl sm:text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-300">
                    IZIES
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Digital OS
                  </span>
                </div>
              </div>
            </Link>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2">
              {/* Tablet Quick CTA */}
              <Link
                href="/#contact"
                onClick={(event) => handleSectionLink(event, "contact")}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold shadow-md shadow-cyan-500/20 active:scale-95"
              >
                <span>Start Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {/* Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-slate-200 hover:text-white hover:bg-white/[0.08] active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
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

          {/* Mobile Drawer Menu */}
          <div
            id="mobile-nav-drawer"
            className={`w-full overflow-hidden transition-all duration-300 ease-in-out border-t border-white/[0.08] bg-[#04060A]/98 backdrop-blur-3xl shadow-2xl ${
              mobileMenuOpen ? "max-h-[calc(100dvh-4rem)] opacity-100 py-4 px-4 sm:px-6" : "max-h-0 opacity-0 py-0 px-4 sm:px-6 border-transparent"
            }`}
          >
            <div className="space-y-4 max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain pb-6">
              {/* Navigation Links Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.id}
                      href={link.href}
                      onClick={(event) => handleSectionLink(event, link.id)}
                      className="group flex items-center justify-between p-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-slate-200 hover:text-cyan-300 hover:bg-white/[0.06] hover:border-cyan-500/30 transition-all active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-sm">{link.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  );
                })}
              </div>

              {/* Careers Special Link */}
              <Link
                href="/careers"
                onClick={() => setMobileMenuOpen(false)}
                className="group flex items-center justify-between p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] text-slate-200 hover:text-emerald-300 hover:bg-emerald-500/[0.08] hover:border-emerald-500/40 transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">Careers & Talent</div>
                    <div className="text-[11px] text-slate-400">Join our engineering & design team</div>
                  </div>
                </div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Hiring
                </span>
              </Link>

              {/* Mobile CTA Button */}
              <div className="pt-2 border-t border-white/[0.06] space-y-3">
                <Link
                  href="/#contact"
                  onClick={(event) => handleSectionLink(event, "contact")}
                  className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white text-sm font-bold shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-transform"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Free Consultation
                  </span>
                  <span>•</span>
                  <span>Direct Team Response</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Header (>=1024px) */}
        <div className="hidden lg:block w-full px-6 xl:px-8 max-w-7xl mx-auto transition-all duration-300 pointer-events-none">
          <div
            className={`transition-all duration-500 pointer-events-auto relative ${
              scrolled
                ? "mt-4 rounded-3xl bg-[#04060A]/90 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5"
                : "mt-0 rounded-none bg-transparent border-b border-transparent shadow-none"
            }`}
          >
            <div
              className={`w-full px-8 flex items-center justify-between transition-all duration-300 ${
                scrolled ? "h-18" : "h-22"
              }`}
            >
              {/* Brand Logo */}
              <Link
                href="/"
                className="flex items-center gap-3 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-xl p-1 -ml-1"
              >
                <div className="relative flex items-center justify-center">
                  <Image
                    src="/brand/izies-logo-transparent.png"
                    alt="IZIES Logo"
                    width={46}
                    height={46}
                    priority
                    className="h-10 w-10 object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] group-hover:drop-shadow-[0_0_22px_rgba(34,211,238,0.9)] transition-all duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <span className="font-logo font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-300">
                      IZIES
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.15)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(34,211,238,1)]" />
                      Digital OS
                    </span>
                  </div>
                  <span className="text-[10px] text-cyan-400/80 uppercase tracking-widest font-semibold -mt-0.5">
                    Technology & Digital Innovation
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="flex items-center gap-7 xl:gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={(event) => handleSectionLink(event, link.id)}
                    className="text-[13px] font-semibold text-slate-300 hover:text-cyan-300 transition-colors py-1 relative group"
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

              {/* Desktop Primary Action CTA */}
              <div className="flex items-center">
                <Link
                  href="/#contact"
                  onClick={(event) => handleSectionLink(event, "contact")}
                  className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white text-[13px] font-bold tracking-wide transition-all hover:opacity-95 hover:scale-[1.02] active:scale-95 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

