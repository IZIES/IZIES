"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  ExternalLink,
  UserCheck,
  Mail,
  Settings,
  Code,
  Inbox,
  FlaskConical,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/admin/dashboard",
    },
    {
      href: "/admin/jobs",
      label: "Job Requisitions",
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
      label: "Email & Offer Center",
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
      href: "/admin/team",
      label: "Team Management",
      icon: UserCheck,
      active: pathname.startsWith("/admin/team"),
    },
    {
      href: "/admin/products",
      label: "Products & Labs",
      icon: FlaskConical,
      active: pathname.startsWith("/admin/products"),
    },
    {
      href: "/admin/client-projects",
      label: "Client Portfolio",
      icon: Briefcase,
      active: pathname.startsWith("/admin/client-projects"),
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
    <aside className="w-64 border-r border-white/[0.08] bg-[#070A12] flex flex-col justify-between p-4 hidden md:flex shrink-0">
      <div className="space-y-6">
        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  link.active
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <Icon className="w-4 h-4" />
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
  );
}
