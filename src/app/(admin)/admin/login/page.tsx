"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Shield, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  useEffect(() => {
    // Check if admin is already logged in
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Login failed");
      }

      window.location.href = "/admin/dashboard";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAndSwitch = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setCurrentUser(null);
    setEmail("");
    setPassword("");
  };

  const fillDemoCredentials = () => {
    setEmail("admin@izies.io");
    setPassword("izies2026!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#06080F]">
      <div className="w-full max-w-md space-y-6 p-6 sm:p-10 rounded-3xl border border-white/[0.08] bg-[#0A0E1A]/95 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none" />

        <div className="text-center space-y-3 relative z-10">
          <div className="inline-block p-1 rounded-2xl bg-white/[0.04] border border-white/10 shadow-lg">
            <Image
              src="/brand/izies-logo-transparent.png"
              alt="IZIES Logo"
              width={56}
              height={56}
              priority
              className="h-14 w-14 mx-auto object-contain rounded-xl"
            />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">IZIES Admin ATS</h1>
            <p className="text-xs text-slate-400 mt-1 font-normal">
              Candidate pipeline, job requisitions, and offer letters.
            </p>
          </div>
        </div>

        {/* If already logged in, show clear choice */}
        {currentUser ? (
          <div className="space-y-4 pt-2 relative z-10">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Active Session Detected</p>
                <p className="text-slate-300 mt-0.5">
                  You are logged in as <strong className="text-white">{currentUser.email}</strong> ({currentUser.name})
                </p>
              </div>
            </div>

            <Button
              type="button"
              size="lg"
              onClick={() => (window.location.href = "/admin/dashboard")}
              className="w-full gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold h-12 shadow-lg shadow-indigo-600/25"
            >
              <span>Continue to Admin Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLogoutAndSwitch}
              className="w-full gap-2 text-xs border-white/10 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out / Switch Account</span>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Work Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <Input
                  type="email"
                  required
                  className="pl-10 h-11 text-sm rounded-xl bg-[#060810] border-white/10 text-white focus:border-indigo-500"
                  placeholder="admin@izies.com"
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
                  type="password"
                  required
                  className="pl-10 h-11 text-sm rounded-xl bg-[#060810] border-white/10 text-white focus:border-indigo-500"
                  placeholder="••••••••"
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
              <span>Authenticate to ATS</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="pt-2">
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="w-full py-2 px-3 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Fill Demo Credentials</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
