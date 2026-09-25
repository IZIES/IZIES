"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Brain,
  Globe,
  Smartphone,
  Cloud,
  Workflow,
  Cpu,
  Server,
  Database,
  ShieldCheck,
  Code,
  Sparkles,
  Terminal,
  Layers,
  Zap,
  Eye,
  EyeOff,
  X,
  Tag,
  Check,
  Flame
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AVAILABLE_ICONS: Record<string, any> = {
  Brain,
  Globe,
  Smartphone,
  Cloud,
  Workflow,
  Cpu,
  Server,
  Database,
  ShieldCheck,
  Code,
  Sparkles,
  Terminal,
  Layers,
  Zap,
};

const COLOR_THEMES = [
  { id: "purple", name: "Purple / AI", border: "border-purple-500/30", bg: "bg-purple-500/10", text: "text-purple-400" },
  { id: "blue", name: "Blue / Web", border: "border-blue-500/30", bg: "bg-blue-500/10", text: "text-blue-400" },
  { id: "cyan", name: "Cyan / Mobile", border: "border-cyan-500/30", bg: "bg-cyan-500/10", text: "text-cyan-400" },
  { id: "amber", name: "Amber / Cloud", border: "border-amber-500/30", bg: "bg-amber-500/10", text: "text-amber-400" },
  { id: "emerald", name: "Emerald / Auto", border: "border-emerald-500/30", bg: "bg-emerald-500/10", text: "text-emerald-400" },
  { id: "rose", name: "Rose / Security", border: "border-rose-500/30", bg: "bg-rose-500/10", text: "text-rose-400" },
  { id: "indigo", name: "Indigo / Core", border: "border-indigo-500/30", bg: "bg-indigo-500/10", text: "text-indigo-400" },
];

export default function AdminTechStackPage() {
  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [shortTitle, setShortTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("Brain");
  const [color, setColor] = useState("purple");
  const [position, setPosition] = useState("top");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [newTechInput, setNewTechInput] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDomains = () => {
    setLoading(true);
    fetch("/api/hero-tech")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDomains(data.domains);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle("");
    setShortTitle("");
    setSlug("");
    setIcon("Brain");
    setColor("purple");
    setPosition("top");
    setDescription("");
    setTechnologies([]);
    setNewTechInput("");
    setIsActive(true);
    setOrder(String(domains.length + 1));
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (d: any) => {
    setEditingId(d.id);
    setTitle(d.title);
    setShortTitle(d.shortTitle);
    setSlug(d.slug);
    setIcon(d.icon || "Brain");
    setColor(d.color || "purple");
    setPosition(d.position || "top");
    setDescription(d.description || "");
    setTechnologies(d.technologies || []);
    setNewTechInput("");
    setIsActive(d.isActive !== false);
    setOrder(String(d.order || 0));
    setError(null);
    setIsModalOpen(true);
  };

  const handleAddTechTag = () => {
    const trimmed = newTechInput.trim();
    if (!trimmed) return;
    if (!technologies.includes(trimmed)) {
      setTechnologies([...technologies, trimmed]);
    }
    setNewTechInput("");
  };

  const handleRemoveTechTag = (tag: string) => {
    setTechnologies(technologies.filter((t) => t !== tag));
  };

  const handleSaveDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const url = editingId ? `/api/hero-tech/${editingId}` : "/api/hero-tech";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          shortTitle,
          slug,
          icon,
          color,
          position,
          description,
          technologies,
          order: parseInt(order, 10) || 0,
          isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save tech domain");
      }

      setIsModalOpen(false);
      fetchDomains();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (d: any) => {
    const nextStatus = !d.isActive;
    setDomains((prev) =>
      prev.map((item) => (item.id === d.id ? { ...item, isActive: nextStatus } : item))
    );

    try {
      await fetch(`/api/hero-tech/${d.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextStatus }),
      });
    } catch (err) {
      console.error(err);
      fetchDomains();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Tech Domain from the hero section?")) return;
    await fetch(`/api/hero-tech/${id}`, { method: "DELETE" });
    fetchDomains();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Hero Section Tech Stack & Domains
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage the interactive orbiting icons, descriptions, and all technologies shown in popups on the home page.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="w-full sm:w-auto gap-2 bg-gradient-to-r from-purple-600 to-indigo-600">
          <Plus className="w-4 h-4" />
          <span>Add Tech Domain</span>
        </Button>
      </div>

      {/* Grid of Tech Domains */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-slate-400 animate-pulse">
            Loading Hero Tech Domains...
          </div>
        ) : domains.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs text-slate-400 bg-card/20 rounded-3xl border border-white/[0.06]">
            No tech domains found. Click &quot;Add Tech Domain&quot; to create one!
          </div>
        ) : (
          domains.map((d) => {
            const IconComp = AVAILABLE_ICONS[d.icon] || Brain;
            const colorTheme =
              COLOR_THEMES.find((c) => c.id === d.color) || COLOR_THEMES[0];

            return (
              <div
                key={d.id}
                className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-5 ${
                  d.isActive !== false
                    ? `bg-[#0A0D18] ${colorTheme.border} shadow-xl shadow-black/50`
                    : "bg-[#0A0D18]/50 border-white/[0.06] opacity-70"
                }`}
              >
                <div className="space-y-4">
                  {/* Top Bar with Icon & Badges */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-2xl ${colorTheme.bg} ${colorTheme.border} ${colorTheme.text} border shadow-inner`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                          Position: {d.position || "top"}
                        </span>
                        <h3 className="font-bold text-white text-base leading-tight">{d.shortTitle}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {d.isActive !== false ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Eye className="w-2.5 h-2.5" /> Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <EyeOff className="w-2.5 h-2.5" /> Hidden
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200 mb-1">{d.title}</h4>
                    {d.description && (
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {d.description}
                      </p>
                    )}
                  </div>

                  {/* Technologies Chips Count & Preview */}
                  <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3 text-slate-500" />
                        <span>Included Technologies ({d.technologies?.length || 0})</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                      {d.technologies && d.technologies.length > 0 ? (
                        d.technologies.map((tech: string, idx: number) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-mono border ${colorTheme.bg} ${colorTheme.text} ${colorTheme.border}`}
                          >
                            {tech}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">No technologies added yet.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(d)}
                    className={`h-7 px-2.5 text-[11px] gap-1 rounded-lg border ${
                      d.isActive !== false
                        ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                        : "border-amber-500/30 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
                    }`}
                  >
                    {d.isActive !== false ? (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Visible on Hero</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Hidden</span>
                      </>
                    )}
                  </Button>

                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenEdit(d)}
                      className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-white/[0.05]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(d.id)}
                      className="h-7 w-7 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0B0F19] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {editingId ? "Edit Hero Tech Domain" : "Add Hero Tech Domain"}
                </h3>
              </div>
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

            <form onSubmit={handleSaveDomain} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Full Domain Title <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    required
                    placeholder="e.g. AI Agents & Intelligence"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Short Pill Label (Satellite Badge) <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    required
                    placeholder="e.g. AI Agents"
                    value={shortTitle}
                    onChange={(e) => setShortTitle(e.target.value)}
                  />
                </div>
              </div>

              {/* Icon & Color Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Icon</label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none"
                  >
                    {Object.keys(AVAILABLE_ICONS).map((iName) => (
                      <option key={iName} value={iName}>
                        {iName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Glow Theme Color</label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none"
                  >
                    {COLOR_THEMES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Orbital Position</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none"
                  >
                    <option value="top">Top (0°)</option>
                    <option value="top-right">Top-Right (45°)</option>
                    <option value="bottom-right">Bottom-Right (135°)</option>
                    <option value="bottom-left">Bottom-Left (225°)</option>
                    <option value="top-left">Top-Left (315°)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Summary Description (Shown in Popup)
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-border bg-card/60 p-3 text-xs text-foreground focus:outline-none"
                  placeholder="Autonomous agent architectures, RAG pipelines, fine-tuned models & real-time inference..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* DYNAMIC TECH STACK TAGS MANAGER */}
              <div className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                <label className="block text-xs font-semibold text-white">
                  Add Technologies to this Stack
                </label>
                <p className="text-[11px] text-slate-400">
                  Type a technology name (e.g. &quot;Next.js 15&quot;, &quot;LangChain&quot;, &quot;Flutter&quot;) and press Enter or click Add.
                </p>

                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. PyTorch, React Native, Kubernetes..."
                    value={newTechInput}
                    onChange={(e) => setNewTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTechTag();
                      }
                    }}
                    className="text-xs h-10"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTechTag}
                    className="text-xs h-10 px-4 bg-purple-600 hover:bg-purple-500 text-white shrink-0"
                  >
                    + Add Tech
                  </Button>
                </div>

                {/* Tech Badges Pool */}
                <div className="flex flex-wrap gap-2 pt-2 max-h-40 overflow-y-auto">
                  {technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-mono group"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTechTag(tech)}
                        className="text-purple-400 hover:text-rose-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {technologies.length === 0 && (
                    <span className="text-xs text-slate-500 italic">No technologies added yet. Add some above!</span>
                  )}
                </div>
              </div>

              {/* Visibility Checkbox */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-white block">
                    Show in Hero Section Orbit
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    When active, this pill and its interactive popup will render on the landing page hero visual.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/[0.08]">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting} className="bg-purple-600 hover:bg-purple-500">
                  Save Tech Domain
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
