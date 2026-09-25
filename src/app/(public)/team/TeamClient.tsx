"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Linkedin, Twitter, Github, ArrowRight, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatImageUrl } from "@/lib/utils";
import Image from "next/image";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  avatarUrl: string;
  bio: string | null;
  linkedInUrl: string | null;
  twitterUrl: string | null;
  githubUrl: string | null;
}

export function OurTeamClient() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.teamMembers)) {
          setTeamMembers(data.teamMembers);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-12 sm:py-20 px-6 max-w-7xl mx-auto space-y-16 min-h-screen">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview</span>
        </Link>
      </div>

      <div className="text-center max-w-3xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 text-xs font-semibold">
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          <span>Core Builders & Architects</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Craftspeople, thinkers, and operators.
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
          We are a tight-knit squad of engineers, designers, and systems architects building high-velocity software ecosystems for millions of users worldwide.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-88 bg-[#0C1020] rounded-3xl" />
          ))}
        </div>
      ) : teamMembers.length === 0 ? (
        <div className="text-center py-20 p-8 rounded-3xl border border-white/[0.08] bg-[#0A0E1A] space-y-3 max-w-md mx-auto">
          <Users className="w-10 h-10 text-indigo-400/60 mx-auto" />
          <h3 className="text-lg font-bold text-white">Leadership Team Initializing</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Profiles configured via the Admin ATS will appear here live with active social portfolios.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="group rounded-3xl border border-white/[0.08] bg-[#0A0E1A]/95 p-5 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between backdrop-blur-xl hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#060810] border border-white/[0.06]">
                  <Image
                    width={400}
                    height={400}
                    src={formatImageUrl(member.avatarUrl)}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        member.name
                      )}&background=4F46E5&color=fff&size=400`;
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md bg-black/70 border border-white/20 text-white">
                      {member.department}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-400 mt-0.5">{member.role}</p>
                </div>
                {member.bio && (
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {member.bio}
                  </p>
                )}
              </div>
              <div className="pt-4 mt-6 border-t border-white/[0.06] flex items-center gap-2">
                {member.linkedInUrl && (
                  <a
                    href={member.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {member.twitterUrl && (
                  <a
                    href={member.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                    aria-label="Twitter Profile"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {member.githubUrl && (
                  <a
                    href={member.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                    aria-label="GitHub Profile"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-8 sm:p-12 rounded-3xl border border-white/[0.08] bg-gradient-to-r from-indigo-950/40 via-[#0A0E1A] to-purple-950/30 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Want to build the universe of content with us?
        </h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto font-normal">
          We have open positions across founding systems engineering, strategy studio, and design.
        </p>
        <div className="pt-2">
          <Link href="/jobs">
            <Button size="lg" className="gap-2 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold">
              <span>View Open Requisitions</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}