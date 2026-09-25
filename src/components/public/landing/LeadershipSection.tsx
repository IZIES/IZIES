import { Users, Linkedin, Twitter, Mail, Github } from "lucide-react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatImageUrl } from "@/lib/utils";
import Link from "next/link";

export async function LeadershipSection() {
  const teamMembers = await prisma.teamMember.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: "asc" },
  });

  if (teamMembers.length === 0) return null;
  const leaders = teamMembers;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  return (
    <section id="leadership" className="relative z-10 py-24 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>Company Leadership</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            The Minds Behind IZIES
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Our foundation is built on deep technical expertise, relentless curiosity, and a commitment to engineering excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto justify-center">
          {leaders.map((leader, idx) => {
            const gradients = [
              "from-purple-500/20 to-blue-500/20",
              "from-blue-500/20 to-cyan-500/20",
              "from-pink-500/20 to-purple-500/20",
            ];
            const gradient = gradients[idx % gradients.length];
            const accent = gradient.includes("purple") ? "text-purple-400" : "text-blue-400";

            return (
              <div
                key={leader.id}
                className="glass-card p-8 rounded-3xl border border-white/[0.08] hover:border-purple-500/40 transition-all duration-300 group flex flex-col items-center text-center space-y-6"
              >
                {/* Avatar */}
                <div
                  className={`w-24 h-24 rounded-full bg-gradient-to-br ${gradient} border border-white/10 shadow-lg shadow-black/50 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500`}
                >
                  {leader.avatarUrl ? (
                    <Image
                      src={formatImageUrl(leader.avatarUrl)}
                      alt={leader.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <span className={`text-2xl font-black ${accent} tracking-wider`}>
                      {getInitials(leader.name)}
                    </span>
                  )}
                  {/* Inner Glow */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                    {leader.name}
                  </h3>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${accent}`}>
                    {leader.role}
                  </p>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                  {leader.bio}
                </p>

                {/* Social Links */}
                <div className="pt-4 flex items-center justify-center gap-4 border-t border-white/[0.06] w-full mt-auto">
                  {leader.linkedInUrl && leader.linkedInUrl !== "#" && (
                    <Link href={leader.linkedInUrl} target="_blank" className="text-slate-500 hover:text-white transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </Link>
                  )}
                  {leader.twitterUrl && leader.twitterUrl !== "#" && (
                    <Link href={leader.twitterUrl} target="_blank" className="text-slate-500 hover:text-white transition-colors">
                      <Twitter className="w-4 h-4" />
                    </Link>
                  )}
                  {leader.githubUrl && leader.githubUrl !== "#" && (
                    <Link href={leader.githubUrl} target="_blank" className="text-slate-500 hover:text-white transition-colors">
                      <Github className="w-4 h-4" />
                    </Link>
                  )}
                  {!leader.linkedInUrl && !leader.twitterUrl && !leader.githubUrl && (
                    <span className="text-xs text-slate-600">No socials provided</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
