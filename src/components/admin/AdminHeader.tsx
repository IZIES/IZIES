"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  LogOut,
  User,
  Sparkles,
  Menu,
  X,
  LayoutDashboard,
  Briefcase,
  Users,
  UserCheck,
  ExternalLink,
  Mail,
  Settings,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const navLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
    { href: "/admin/applicants", label: "Pipeline", icon: Users },
    { href: "/admin/emails", label: "Emails", icon: Mail },
    { href: "/admin/inquiries", label: "Leads", icon: Inbox },
    { href: "/admin/team", label: "Team", icon: UserCheck },
    { href: "/admin/tech-stack", label: "Tech Stack", icon: Sparkles },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <header className="h-16 sm:h-18 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0A0D17]/95 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white md:hidden"
            aria-label="Toggle admin menu"
          >
            {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="font-black text-lg text-white">IZIES</span>
            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
              Admin ATS
            </span>
          </Link>
        </div>

        {/* Mobile Horizontal Quick Bar */}
        <div className="flex md:hidden items-center gap-1 overflow-x-auto py-1">
          {navLinks.map((l) => {
            const Icon = l.icon;
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                  active ? "bg-blue-600 text-white font-medium" : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden xs:inline text-[11px]">{l.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div className="h-7 w-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-400 leading-tight">{user.email}</p>
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 h-8 px-2.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileNavOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#070A12]/98 backdrop-blur-2xl p-4 space-y-3 z-30">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    active
                      ? "bg-blue-600 text-white font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
            <Link
              href="/"
              target="_blank"
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-1 hover:text-white"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href="/team"
              target="_blank"
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-1 hover:text-white"
            >
              <span>View /team</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
