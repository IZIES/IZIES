"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Users, ExternalLink, X, Linkedin, Twitter, Github, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatImageUrl } from "@/lib/utils";
import Image from "next/image";

export default function AdminTeamPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("Leadership");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchTeam = () => {
    setLoading(true);
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTeam(data.teamMembers);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const url = editingId ? `/api/team/${editingId}` : "/api/team";
      const method = editingId ? "PATCH" : "POST";
      const formattedAvatar = formatImageUrl(avatarUrl);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role,
          department,
          avatarUrl: formattedAvatar,
          bio,
          linkedInUrl,
          twitterUrl,
          githubUrl,
          isPublic,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || `Failed to ${editingId ? "update" : "add"} team member`);
      }

      setIsModalOpen(false);
      setEditingId(null);
      setName("");
      setRole("");
      setAvatarUrl("");
      setBio("");
      setLinkedInUrl("");
      setTwitterUrl("");
      setGithubUrl("");
      setIsPublic(true);
      fetchTeam();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (member: any) => {
    setEditingId(member.id);
    setName(member.name);
    setRole(member.role);
    setDepartment(member.department || "Leadership");
    setAvatarUrl(member.avatarUrl || "");
    setBio(member.bio || "");
    setLinkedInUrl(member.linkedInUrl || "");
    setTwitterUrl(member.twitterUrl || "");
    setGithubUrl(member.githubUrl || "");
    setIsPublic(member.isPublic !== false);
    setIsModalOpen(true);
  };

  const handleTogglePublic = async (member: any) => {
    const nextStatus = !member.isPublic;
    // Optimistic UI update
    setTeam((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, isPublic: nextStatus } : m))
    );

    try {
      await fetch(`/api/team/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: nextStatus }),
      });
    } catch (err) {
      console.error("Failed to toggle visibility:", err);
      fetchTeam(); // rollback on error
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this team member?")) return;
    await fetch(`/api/team/${id}`, { method: "DELETE" });
    fetchTeam();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Team Management</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Upload, edit, and control public visibility of team members showcased on the website.
          </p>
        </div>
        <Button 
          onClick={() => {
            setEditingId(null);
            setName("");
            setRole("");
            setDepartment("Leadership");
            setAvatarUrl("");
            setBio("");
            setLinkedInUrl("");
            setTwitterUrl("");
            setGithubUrl("");
            setIsPublic(true);
            setIsModalOpen(true);
          }} 
          className="w-full sm:w-auto gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </Button>
      </div>

{/* Team Cards Grid */}
      <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400 animate-pulse">
            Loading team members...
          </div>
        ) : team.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs text-slate-400 bg-card/20 rounded-3xl border border-white/[0.06]">
            No custom team members added yet. Click "Add Team Member" to showcase your core leadership and mentors!
          </div>
        ) : (
          team.map((member) => (
            <div
              key={member.id}
              className={`p-5 rounded-3xl border transition-all duration-300 space-y-4 flex flex-col justify-between max-w-sm ${
                member.isPublic !== false
                  ? "bg-[#0A0D18] border-white/[0.08] hover:border-purple-500/30 shadow-lg shadow-black/40"
                  : "bg-[#0A0D18]/50 border-amber-500/20 opacity-75"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <Image
                    width={400}
                    height={400}
                    src={formatImageUrl(member.avatarUrl)}
                    alt={member.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-white/10 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        member.name
                      )}&background=1E40AF&color=fff&size=400`;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <Badge variant="purple" className="text-[10px]">
                        {member.department}
                      </Badge>
                      {member.isPublic !== false ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Eye className="w-2.5 h-2.5" /> Public
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <EyeOff className="w-2.5 h-2.5" /> Hidden
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-white text-base truncate">{member.name}</h3>
                    <p className="text-xs text-blue-400 truncate">{member.role}</p>
                  </div>
                </div>

                {member.bio && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{member.bio}</p>
                )}
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-slate-400">
                  {member.linkedInUrl && <Linkedin className="w-3.5 h-3.5 hover:text-white" />}
                  {member.twitterUrl && <Twitter className="w-3.5 h-3.5 hover:text-white" />}
                  {member.githubUrl && <Github className="w-3.5 h-3.5 hover:text-white" />}
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Visibility Toggle Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTogglePublic(member)}
                    className={`h-7 px-2 text-[11px] gap-1 rounded-lg border ${
                      member.isPublic !== false
                        ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                        : "border-amber-500/30 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
                    }`}
                    title={member.isPublic !== false ? "Click to hide from public site" : "Click to show on public site"}
                  >
                    {member.isPublic !== false ? (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Hidden</span>
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(member)}
                    className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-white/[0.05]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(member.id)}
                    className="h-7 w-7 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD / EDIT MEMBER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0B0F19] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-xl font-bold text-white">
                {editingId ? "Edit Team Member" : "Add Team Member"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <Input
                  required
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Role Title</label>
                  <Input
                    required
                    placeholder="e.g. Founder & CEO"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none"
                  >
                    <option value="Leadership">Leadership</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Community">Community</option>
                    <option value="Advisors">Advisors</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Photo / Avatar Image URL
                </label>
                <Input
                  required
                  type="url"
                  placeholder="https://images.unsplash.com/... or hosted image URL"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Bio / Role Description</label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-border bg-card/60 p-3 text-xs text-foreground focus:outline-none"
                  placeholder="Brief background, previous experience, or focus area..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">LinkedIn</label>
                  <Input
                    placeholder="linkedin.com/..."
                    value={linkedInUrl}
                    onChange={(e) => setLinkedInUrl(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Twitter/X</label>
                  <Input
                    placeholder="x.com/..."
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">GitHub</label>
                  <Input
                    placeholder="github.com/..."
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                  />
                </div>
              </div>

              {/* Public Visibility Toggle Checkbox in Modal */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-white block">
                    Show on Public Website / Landing Page
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    If disabled, this member will only be visible in Admin and hidden from visitors.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/[0.08]">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  Save Member
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
