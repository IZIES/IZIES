"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Edit2, X, Eye, EyeOff, Star, ExternalLink, Briefcase, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { capabilityContent } from "@/lib/capabilities";

function emptyForm() {
  return {
    name: "",
    clientName: "",
    industry: "",
    description: "",
    challenge: "",
    solution: "",
    result: "",
    techStack: "",
    services: [] as string[],
    imageUrl: "",
    websiteUrl: "",
    isFeatured: false,
    order: 0,
    isPublic: true,
  };
}

export default function AdminClientProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = () => {
    setLoading(true);
    fetch("/api/admin/client-projects")
      .then((r) => r.json())
      .then((d) => { if (d.success) setProjects(d.projects); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const openModal = (project?: any) => {
    if (project) {
      setEditingId(project.id);
      setForm({
        name: project.name,
        clientName: project.clientName,
        industry: project.industry,
        description: project.description,
        challenge: project.challenge || "",
        solution: project.solution || "",
        result: project.result || "",
        techStack: project.techStack?.join(", ") || "",
        services: project.services || [],
        imageUrl: project.imageUrl || "",
        websiteUrl: project.websiteUrl || "",
        isFeatured: project.isFeatured,
        order: project.order,
        isPublic: project.isPublic,
      });
    } else {
      setEditingId(null);
      setForm(emptyForm());
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const url = editingId ? `/api/admin/client-projects/${editingId}` : "/api/admin/client-projects";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          techStack: form.techStack.split(",").map((t) => t.trim()).filter(Boolean),
          order: Number(form.order),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save project");
      setIsModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublic = async (project: any) => {
    const next = !project.isPublic;
    setProjects((p) => p.map((x) => (x.id === project.id ? { ...x, isPublic: next } : x)));
    await fetch(`/api/admin/client-projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: next }),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this client project?")) return;
    await fetch(`/api/admin/client-projects/${id}`, { method: "DELETE" });
    fetchProjects();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Client Portfolio</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage your client projects, case studies, and showcase your work.
          </p>
        </div>
        <Button onClick={() => openModal()} className="w-full sm:w-auto gap-2">
          <Plus className="w-4 h-4" />
          Add Client Project
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400 animate-pulse">Loading client projects...</div>
        ) : projects.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs text-slate-400 bg-card/20 rounded-2xl border border-white/[0.06]">
            No client projects added yet. Click &apos;Add Client Project&apos; to showcase your work!
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className={`flex flex-col sm:flex-row items-start gap-3 p-3.5 rounded-2xl border transition-all duration-300 ${
                project.isPublic
                  ? "bg-[#0A0D18] border-white/[0.08] hover:border-cyan-500/30"
                  : "bg-[#0A0D18]/50 border-amber-500/20 opacity-75"
              }`}
            >
              {project.imageUrl ? (
                <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-xl border border-white/[0.05]">
                  <Image src={project.imageUrl} alt={project.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-slate-500" />
                </div>
              )}

              <div className="flex-1 min-w-0 flex flex-col justify-center h-full space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider truncate">{project.industry}</span>
                  <span className="text-[9px] text-slate-500 truncate max-w-[70px]">{project.clientName}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-white text-[13px] truncate">
                    {project.isFeatured && <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 inline-block mr-1 mb-0.5" />}
                    {project.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1 mt-auto pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTogglePublic(project)}
                    className={`h-6 px-1.5 text-[9px] gap-1 rounded-md border ${
                      project.isPublic
                        ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                        : "border-amber-500/30 text-amber-400 bg-amber-500/10"
                    }`}
                  >
                    {project.isPublic ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openModal(project)} className="h-6 w-6 p-0 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-md">
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(project.id)} className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            {/* Trick to center the modal vertically while allowing scroll */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
            <div className="relative inline-block w-full max-w-3xl bg-[#0B0F19] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-left align-middle space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-xl font-bold text-white">{editingId ? "Edit Client Project" : "Add Client Project"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Project Name *</label>
                  <Input required placeholder="e.g. Acme Corp Redesign" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Client Name *</label>
                  <Input required placeholder="e.g. Acme Corp" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Industry *</label>
                  <Input required placeholder="e.g. Healthcare, FinTech" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Website URL</label>
                  <Input type="url" placeholder="https://..." value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Overview Description *</label>
                <textarea
                  required
                  rows={2}
                  className="w-full rounded-xl border border-border bg-card/60 p-3 text-xs text-foreground focus:outline-none"
                  placeholder="Brief overview of the project..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Challenge (Optional)</label>
                  <textarea rows={2} className="w-full rounded-xl border border-border bg-card/60 p-3 text-xs text-foreground focus:outline-none" value={form.challenge} onChange={(e) => setForm({ ...form, challenge: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Solution (Optional)</label>
                  <textarea rows={2} className="w-full rounded-xl border border-border bg-card/60 p-3 text-xs text-foreground focus:outline-none" value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Result/Impact (Optional)</label>
                <textarea rows={2} className="w-full rounded-xl border border-border bg-card/60 p-3 text-xs text-foreground focus:outline-none" value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })} />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tech Stack (comma separated)</label>
                <Input placeholder="Next.js, Tailwind, Prisma" value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Capabilities / Services Provided</label>
                <div className="flex flex-wrap gap-2">
                  {Object.values(capabilityContent).map((cap) => {
                    const isSelected = form.services.includes(cap.title);
                    return (
                      <button
                        type="button"
                        key={cap.title}
                        onClick={() => {
                          if (isSelected) {
                            setForm({ ...form, services: form.services.filter(s => s !== cap.title) });
                          } else {
                            setForm({ ...form, services: [...form.services, cap.title] });
                          }
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-colors ${
                          isSelected 
                            ? "bg-purple-500/15 border-purple-500/40 text-purple-300" 
                            : "bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/[0.06] hover:text-slate-300"
                        }`}
                      >
                        {isSelected ? <CheckSquare className="w-3.5 h-3.5 shrink-0" /> : <Square className="w-3.5 h-3.5 shrink-0 opacity-50" />}
                        <span className="leading-none whitespace-nowrap">{cap.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Screenshot / Cover Image URL</label>
                  <Input type="url" placeholder="https://..." value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Display Order</label>
                  <Input type="number" placeholder="0" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-3.5 flex-1 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-white block">Featured Project</span>
                    <span className="text-[11px] text-slate-400">Highlight in portfolio</span>
                  </div>
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4 accent-amber-500 rounded cursor-pointer" />
                </div>
                <div className="p-3.5 flex-1 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-white block">Public Visibility</span>
                    <span className="text-[11px] text-slate-400">Show on website</span>
                  </div>
                  <input type="checkbox" checked={form.isPublic} onChange={(e) => setForm({ ...form, isPublic: e.target.checked })} className="w-4 h-4 accent-indigo-500 rounded cursor-pointer" />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/[0.08]">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" isLoading={isSubmitting}>Save Project</Button>
              </div>
            </form>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
