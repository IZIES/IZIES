"use client";

import Link from "next/link";
import { Home, Search, Code, Binary } from "lucide-react";
import { HeroSystemsCanvas } from "@/components/public/landing/HeroSystemsCanvas";
import { motion, useReducedMotion } from "framer-motion";

const SOFT_EASE = [0.16, 1, 0.3, 1] as const;

export default function NotFound() {
  const shouldReduceMotion = useReducedMotion();

  const heroMotion = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.58, ease: SOFT_EASE },
      };

  const heroChildMotion = (delay: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: SOFT_EASE },
        };

  return (
    <>
      {/* Global Background Synchronized Grid & Radial Glow (Exact match to /page.tsx) */}
      <div className="fixed inset-0 z-0 bg-[#04060A] pointer-events-none overflow-hidden">
        <HeroSystemsCanvas />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_23%_28%,rgba(5,7,15,0.5),rgba(5,7,15,0.76)_50%,rgba(4,6,10,0.95)_100%)]" />
        
        {/* Mesh Gradients — GPU accelerated (Exact match) */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/[0.04] blur-[120px] rounded-full pointer-events-none transform-gpu will-change-transform" />
        <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] bg-blue-600/[0.04] blur-[150px] rounded-full pointer-events-none transform-gpu will-change-transform" />
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[40%] bg-cyan-600/[0.04] blur-[130px] rounded-full pointer-events-none transform-gpu will-change-transform" />
        
        {/* Subtle Overlay Grid & Sparks */}
        <div className="absolute inset-[-100px] bg-grid-pattern opacity-[0.115] pointer-events-none" style={{ backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px", animation: "iz-grid-drift 20s linear infinite" }} />
      </div>

      <main className="relative z-10 min-h-[100dvh] w-full flex flex-col items-center justify-center px-4 sm:px-6 max-w-7xl mx-auto text-center overflow-hidden selection:bg-cyan-500/20 selection:text-cyan-300">
        
        {/* Floating Ambient Background Micro-Glyphs (Exact match to HeroSection.tsx) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10 select-none hidden md:block">
          <motion.div 
            className="absolute top-[20%] left-[15%] p-3 rounded-2xl bg-white/[0.015] border border-white/[0.04] text-slate-500/25 font-mono text-xs flex items-center gap-2 backdrop-blur-xs"
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Code className="w-3.5 h-3.5 text-indigo-400/40" />
            <span>404: Route_Unresolved</span>
          </motion.div>
          
          <motion.div 
            className="absolute top-[60%] right-[15%] p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-slate-500/30 font-mono text-[10px] flex items-center gap-1.5"
            animate={{ y: [5, -5, 5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Binary className="w-3.5 h-3.5 text-purple-400/40" />
            <span>01000101 01010010 01010010</span>
          </motion.div>
        </div>

        <motion.div 
          className="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto mt-[-5vh]"
          {...heroMotion}
        >
          {/* Small Kicker Pill (Exact match to homepage style) */}
          <motion.div
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold shadow-inner shadow-indigo-500/10 backdrop-blur-md mb-4 z-20"
            {...heroChildMotion(0.06)}
          >
            <span className="flex h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)] animate-pulse" />
            <span className="font-mono uppercase tracking-wider">Node Unreachable</span>
          </motion.div>

          {/* Typography-focused Design (Like HeroSection) */}
          <motion.div className="space-y-6 relative z-20" {...heroChildMotion(0.12)}>
            <div className="relative inline-block w-full">
              
              {/* Glowing huge 404 behind */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] sm:text-[14rem] font-black text-white/[0.015] blur-sm select-none pointer-events-none tracking-tighter">
                404
              </div>
              
              <h1 className="relative text-5xl sm:text-7xl lg:text-[5rem] font-extrabold tracking-tight text-white leading-[1.05]">
                Connection <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(129,140,248,0.3)]">
                  Lost in Space
                </span>
              </h1>
            </div>
            
            <p className="text-lg sm:text-xl text-slate-300/80 max-w-2xl mx-auto leading-relaxed font-normal">
              The node you requested is disconnected from the network. It may have been moved, renamed, or lost in the data stream.
            </p>
          </motion.div>

          {/* CTA Buttons (Exact match to homepage buttons) */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10 w-full sm:w-auto relative z-20"
            {...heroChildMotion(0.18)}
          >
            <Link href="/" passHref legacyBehavior>
              <motion.a
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold shadow-xl shadow-indigo-600/30 text-sm transition-all active:scale-[0.98] cursor-pointer"
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              >
                <Home className="w-4 h-4" />
                <span>Return to Network Core</span>
              </motion.a>
            </Link>

            <Link href="/services" passHref legacyBehavior>
              <motion.a
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold text-indigo-300 border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 transition-all cursor-pointer backdrop-blur-md"
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              >
                <Search className="w-4 h-4" />
                <span>Explore Services</span>
              </motion.a>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
