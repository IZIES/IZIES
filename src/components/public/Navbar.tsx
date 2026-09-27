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
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className={`mx-auto transition-all duration-500 pointer-events-auto relative ${
        mobileMenuOpen
          ? "max-w-7xl bg-[#030407]/98 backdrop-blur-3xl border-b border-white/10 shadow-2xl"
          : scrolled
            ? "mt-4 sm:mt-6 w-[calc(100%-2rem)] max-w-7xl rounded-[32px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
            : "max-w-7xl bg-transparent border-b border-transparent"
      }`}>
        <div className={`w-full px-6 sm:px-10 flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-16 sm:h-18' : 'h-20 sm:h-24'}`}>
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative flex items-center justify-center">
            <Image
              src="/brand/izies-logo-transparent.png"
              alt="IZIES Logo"
              width={48}
              height={48}
              priority
              className="h-9 w-9 sm:h-11 sm:w-11 object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] group-hover:drop-shadow-[0_0_25px_rgba(34,211,238,1)] transition-all duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl sm:text-3xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-300">IZIES</span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,1)]" />
                Digital OS
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-cyan-400/80 uppercase tracking-widest font-semibold hidden sm:inline -mt-0.5">Technology & Digital Innovation</span>
          </div>
        </Link>

        {/* Desktop Center Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {[
            { name: "Capabilities", id: "capabilities" },
            { name: "Industries", id: "industries" },
            { name: "Approach", id: "approach" },
            { name: "About", id: "about" },
            { name: "Contact", id: "contact" }
          ].map((link) => (
            <Link
              key={link.id}
              href={`/#${link.id}`}
              onClick={(event) => handleSectionLink(event, link.id)} 
              className="text-[13px] font-bold text-slate-300 hover:text-cyan-400 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          
          {/* Careers Special Link */}
          <Link
            href="/careers"
            className="group flex items-center gap-2 text-[13px] font-bold text-slate-300 hover:text-cyan-400 transition-colors"
          >
            <span>Careers</span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] uppercase font-bold tracking-widest transition-all group-hover:bg-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Hiring
            </span>
          </Link>
        </nav>

        {/* Desktop Primary Action CTA */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/#contact"
            onClick={(event) => handleSectionLink(event, "contact")} 
            className="group inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-[13px] font-bold tracking-wide transition-all hover:opacity-90 hover:scale-[1.02] active:scale-95 shadow-lg shadow-cyan-500/20"
          >
            <span>Start a Project</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-3 rounded-2xl border border-white/10 bg-white/[0.02] text-slate-300 hover:text-white lg:hidden cursor-pointer hover:bg-white/[0.05] hover:border-cyan-500/30 transition-all shadow-lg"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div 
        className={`lg:hidden absolute top-full left-0 right-0 border-b border-white/[0.08] bg-[#030407]/95 backdrop-blur-3xl px-6 transition-all duration-500 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.7)] ${
          mobileMenuOpen ? "max-h-[500px] py-8 opacity-100" : "max-h-0 py-0 opacity-0 border-transparent"
        }`}
      >
        <nav className="flex flex-col space-y-3">
          {[
            { name: "Capabilities", id: "capabilities" },
            { name: "Industries", id: "industries" },
            { name: "Approach", id: "approach" },
            { name: "About", id: "about" },
            { name: "Contact", id: "contact" }
          ].map((link, idx) => (
            <Link
              key={link.id}
              href={`/#${link.id}`}
              onClick={(event) => handleSectionLink(event, link.id)} 
              className="group p-4 rounded-2xl border border-white/[0.05] bg-white/[0.02] text-base font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-cyan-400 hover:border-cyan-500/30 transition-all flex items-center justify-between"
              style={{ transitionDelay: mobileMenuOpen ? `${idx * 50}ms` : '0ms', transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)', opacity: mobileMenuOpen ? 1 : 0 }}
            >
              <span>{link.name}</span>
              <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-cyan-400" />
            </Link>
          ))}
          
          <Link
            href="/careers"
            onClick={() => setMobileMenuOpen(false)}
            className="group p-4 rounded-2xl border border-white/[0.05] bg-white/[0.02] text-base font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-cyan-400 transition-all flex items-center justify-between"
            style={{ transitionDelay: mobileMenuOpen ? '250ms' : '0ms', transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)', opacity: mobileMenuOpen ? 1 : 0 }}
          >
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              <span>Careers & Talent</span>
            </div>
            <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Hiring
            </span>
          </Link>
        </nav>

        <div 
          className="pt-6 mt-6 border-t border-white/[0.08]"
          style={{ transitionDelay: mobileMenuOpen ? '300ms' : '0ms', opacity: mobileMenuOpen ? 1 : 0 }}
        >
          <Link
            href="/#contact"
            onClick={(event) => handleSectionLink(event, "contact")} 
            className="w-full flex items-center justify-center gap-2 p-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-base font-bold shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            <span>Start a Project</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      </div>
    </header>
  );
}
