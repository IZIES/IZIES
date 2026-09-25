"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Sparkles, Briefcase, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? "bg-[#05070D]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl shadow-black/60"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative flex items-center justify-center">
            <Image
              src="/brand/izies-logo-transparent.png"
              alt="IZIES Logo"
              width={36}
              height={36}
              priority
              className="h-7 w-7 sm:h-8 sm:w-8 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white">IZIES</span>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                Digital OS
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium hidden sm:inline -mt-0.5">Technology & Digital Innovation</span>
          </div>
        </Link>

        {/* Desktop Center Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
          <Link
            href="/#capabilities"
            onClick={(event) => handleSectionLink(event, "capabilities")} 
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            Capabilities
          </Link>
          <Link
            href="/#industries"
            onClick={(event) => handleSectionLink(event, "industries")} 
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            Industries
          </Link>
          <Link
            href="/#approach"
            onClick={(event) => handleSectionLink(event, "approach")} 
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            Approach
          </Link>
          <Link
            href="/#about"
            onClick={(event) => handleSectionLink(event, "about")} 
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            About
          </Link>
          <Link
            href="/careers"
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-1.5 group"
          >
            <span>Careers</span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Hiring
            </span>
          </Link>
          <Link
            href="/#contact"
            onClick={(event) => handleSectionLink(event, "contact")} 
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop Primary Action CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/#contact"
            onClick={(event) => handleSectionLink(event, "contact")} 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start a Project</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white md:hidden cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-indigo-400" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#05070D]/98 backdrop-blur-2xl px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-2">
            <Link
            href="/#capabilities"
            onClick={(event) => handleSectionLink(event, "capabilities")} 
              className="p-3 text-left rounded-xl text-sm font-medium text-slate-300 hover:bg-white/[0.04] hover:text-white"
            >
              Capabilities
            </Link>
            <Link
            href="/#industries"
            onClick={(event) => handleSectionLink(event, "industries")} 
              className="p-3 text-left rounded-xl text-sm font-medium text-slate-300 hover:bg-white/[0.04] hover:text-white"
            >
              Industries
            </Link>
            <Link
            href="/#approach"
            onClick={(event) => handleSectionLink(event, "approach")} 
              className="p-3 text-left rounded-xl text-sm font-medium text-slate-300 hover:bg-white/[0.04] hover:text-white"
            >
              Approach
            </Link>
            <Link
            href="/#about"
            onClick={(event) => handleSectionLink(event, "about")} 
              className="p-3 text-left rounded-xl text-sm font-medium text-slate-300 hover:bg-white/[0.04] hover:text-white"
            >
              About
            </Link>
            <Link
              href="/careers"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 text-left rounded-xl text-sm font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between"
            >
              <span>Careers & Talent Network</span>
              <span className="text-[10px] uppercase font-bold bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full">
                Hiring Now
              </span>
            </Link>
            <Link
            href="/#contact"
            onClick={(event) => handleSectionLink(event, "contact")} 
              className="p-3 text-left rounded-xl text-sm font-medium text-slate-300 hover:bg-white/[0.04] hover:text-white"
            >
              Contact
            </Link>
          </nav>

          <div className="pt-4 border-t border-white/[0.08]">
            <Link
            href="/#contact"
            onClick={(event) => handleSectionLink(event, "contact")} 
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-indigo-600/25"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start a Project</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
