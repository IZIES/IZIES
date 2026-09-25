"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap, ArrowRight, AlertCircle, Mail, Lock, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CandidateLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/candidate/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.candidate) {
          router.replace("/candidate/dashboard");
        }
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/candidate/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Login failed");
      }

      // Dispatch event to update navbar instantly
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("candidate-auth-change"));
      }

      // Check for redirect param
      const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const redirectUrl = params?.get("redirect") || "/candidate/dashboard";

      window.location.href = redirectUrl;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 p-6 sm:p-10 rounded-3xl border border-white/[0.08] bg-[#0A0E1A]/95 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-40 bg-indigo-500/15 blur-[60px] rounded-full pointer-events-none" />

        <div className="text-center space-y-3 relative z-10">
          <div className="inline-block p-1 rounded-2xl bg-white/[0.04] border border-white/10 shadow-lg">
            <Image
              src="/brand/izies-logo-transparent.png"
              alt="IZIES Logo"
              width={56}
              height={56}
              priority
              className="h-14 w-14 object-contain rounded-xl"
            />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Candidate Portal</h1>
            <p className="text-xs text-slate-400 mt-1 font-normal">
              Sign in to track your application pipeline, interview stages, and profile.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <Input
                required
                type="email"
                placeholder="you@domain.com"
                className="pl-10 h-11 text-sm rounded-xl bg-[#060810] border-white/10 text-white focus:border-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <Input
                required
                type="password"
                placeholder="••••••••"
                className="pl-10 h-11 text-sm rounded-xl bg-[#060810] border-white/10 text-white focus:border-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            isLoading={loading}
            className="w-full h-12 gap-2 mt-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold shadow-lg shadow-indigo-600/25"
          >
            <span>Sign In to Candidate Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <p className="text-center text-xs text-slate-400 pt-2">
            Don&apos;t have an account yet?{" "}
            <Link href="/candidate/register" className="text-indigo-400 font-semibold hover:underline">
              Create student profile
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
