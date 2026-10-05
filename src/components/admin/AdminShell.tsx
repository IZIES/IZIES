"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Mail,
  UserCheck,
  Settings,
  Code,
  Inbox,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  FolderDot,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminUser {
  userId?: string;
  name: string;
  email: string;
  role: string;
}

interface AdminShellProps {
  initialUser?: AdminUser | null;
  children: React.ReactNode;
}

export function AdminShell({ initialUser, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(initialUser || null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // If on login page, render children cleanly without admin frame
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!user && !isLoginPage) {
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            setUser(data.user);
          }
        })
        .catch(() => {});
    }
  }, [user, isLoginPage]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore
    }
    window.location.href = "/admin/login";
  };

  if (isLoginPage) {
    return <main className="min-h-screen bg-[#070A11] text-foreground">{children}</main>;
  }

  const navLinks = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/admin/dashboard",
    },
    {
      href: "/admin/jobs",
      label: "Job Openings",
      icon: Briefcase,
      active: pathname.startsWith("/admin/jobs"),
    },
    {
      href: "/admin/applicants",
      label: "Candidate Pipeline",
      icon: Users,
      active: pathname.startsWith("/admin/applicants"),
    },
    {
      href: "/admin/emails",
      label: "Email & Offer Letters",
      icon: Mail,
      active: pathname.startsWith("/admin/emails"),
    },
    {
      href: "/admin/inquiries",
      label: "Inbound Leads & Reach",
      icon: Inbox,
      active: pathname.startsWith("/admin/inquiries"),
    },
    {
      href: "/admin/client-projects",
      label: "Client Projects",
      icon: FolderDot,
      active: pathname.startsWith("/admin/client-projects"),
    },
    {
      href: "/admin/products",
      label: "Products & SaaS",
      icon: Layers,
      active: pathname.startsWith("/admin/products"),
    },
    {
      href: "/admin/team",
      label: "Team Management",
      icon: UserCheck,
      active: pathname.startsWith("/admin/team"),
    },
    {
      href: "/admin/tech-stack",
      label: "Tech Stack & Orbit",
      icon: Code,
      active: pathname.startsWith("/admin/tech-stack"),
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: Settings,
      active: pathname.startsWith("/admin/settings"),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#070A11] text-foreground">
      {/* 1. TOP HEADER */}
      <header className="h-16 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] bg-[#0A0D17]/95 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-2 rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white md:hidden"
            aria-label="Toggle navigation drawer"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-blue-400" />}
          </button>

          <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
            <Image
              src="/brand/izies-logo-transparent.png"
              alt="IZIES Logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-xl object-contain shadow-md shadow-blue-500/20"
              priority
            />
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base sm:text-lg tracking-wider text-white">IZIES</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase tracking-wider">
                Admin ATS
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Admin Pill */}
          <div className="flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-white leading-tight">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-slate-400 leading-tight">{user?.email || "admin@izies.com"}</p>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 h-8 px-2.5"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* 2. MAIN BODY (SIDEBAR + CONTENT) */}
      <div className="flex-1 flex relative">
        {/* Desktop Sidebar (visible on md+) */}
        <aside className="w-64 border-r border-white/[0.08] bg-[#070A12] flex-col justify-between p-4 hidden md:flex shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
          <div className="space-y-6">
            <div className="px-3 py-2 rounded-xl bg-blue-500/5 border border-blue-500/15">
              <p className="text-[10px] uppercase font-bold tracking-wider text-blue-400">Recruitment Operations</p>
              <p className="text-xs text-slate-400 mt-0.5">Enterprise ATS Portal</p>
            </div>

            <nav className="space-y-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      link.active
                        ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-white/[0.06] space-y-2">
            <Link
              href="/team"
              target="_blank"
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] text-xs text-slate-400 hover:text-white transition-colors"
            >
              <span>View /team Page</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            </Link>
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] text-xs text-slate-400 hover:text-white transition-colors"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            </Link>
          </div>
        </aside>

        {/* Mobile Slide-Over Drawer (for phones & small viewports) */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setMobileDrawerOpen(false)}
            />

            {/* Drawer */}
            <div className="relative w-4/5 max-w-xs bg-[#090D18] border-r border-white/10 h-full p-5 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-200">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span className="font-bold text-white text-sm">IZIES Admin</span>
                  </div>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="space-y-1.5">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                          link.active
                            ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30"
                            : "text-slate-300 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{link.label}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs">
                  <p className="font-semibold text-white">{user?.name || "Admin"}</p>
                  <p className="text-[11px] text-slate-400">{user?.email || "admin@izies.com"}</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-center gap-2 text-xs border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto pb-20 md:pb-8 max-w-full">
          {children}
        </main>
      </div>

      {/* 3. MOBILE BOTTOM NAVIGATION (Quick 1-tap bar on phones) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0A0D17]/95 backdrop-blur-xl border-t border-white/[0.08] px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {navLinks.slice(0, 5).map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-all ${
                link.active
                  ? "text-blue-400 font-bold scale-105"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${link.active ? "text-blue-400" : "text-slate-400"}`} />
              <span>{link.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
