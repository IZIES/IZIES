"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Plus, Trash2, Edit2, X, Eye, EyeOff, Star, ExternalLink,
  Rocket, Globe, FlaskConical, Sparkles, CheckSquare, Square, Box
} from "lucide-react";
import { capabilityContent } from "@/lib/capabilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const STATUS_OPTIONS = [
  { value: "live", label: "🟢 Live" },
  { value: "beta", label: "🟡 Beta" },
  { value: "in_development", label: "🔵 In Development" },
  { value: "coming_soon", label: "🟣 Coming Soon" },
];

const COLOR_OPTIONS = [
  { value: "indigo", label: "Indigo" },
  { value: "cyan", label: "Cyan" },
  { value: "purple", label: "Purple" },
  { value: "violet", label: "Violet" },
  { value: "blue", label: "Blue" },
  { value: "emerald", label: "Emerald" },
];

const STATUS_BADGE: Record<string, string> = {
  live: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  beta: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  in_development: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
  coming_soon: "bg-purple-500/15 text-purple-300 border border-purple-500/30",
};

const STATUS_LABELS: Record<string, string> = {
  live: "Live",
  beta: "Beta",
  in_development: "In Development",
  coming_soon: "Coming Soon",
};

function emptyForm() {
  return {
    name: "",
    tagline: "",
    description: "",
    type: "Free",
    status: "in_development",
    url: "",
    imageUrl: "",
    iconName: "Rocket",
    color: "indigo",
    tags: "",
    services: [] as string[],
    isFeatured: false,
    order: 0,
    isPublic: true,
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => { if (d.success) setProducts(d.products); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const openModal = (product?: any) => {
    if (product) {
      setEditingId(product.id);
      setForm({
        name: product.name,
        tagline: product.tagline,
        description: product.description,
        type: product.type,
        status: product.status,
        url: product.url || "",
        imageUrl: product.imageUrl || "",
        iconName: product.iconName || "Rocket",
        color: product.color || "indigo",
        tags: product.tags?.join(", ") || "",
        services: product.services || [],
        isFeatured: product.isFeatured,
        order: product.order,
        isPublic: product.isPublic,
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
      const url = editingId ? `/api/admin/products/${editingId}` : "/api/admin/products";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          order: Number(form.order),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save product");
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublic = async (product: any) => {
    const next = !product.isPublic;
    setProducts((p) => p.map((x) => (x.id === product.id ? { ...x, isPublic: next } : x)));
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: next }),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Products & Labs</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage IZIES original products — Project Hub, Metaver/Clone, and upcoming products.
          </p>
        </div>
        <Button onClick={() => openModal()} className="w-full sm:w-auto gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400 animate-pulse">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs text-slate-400 bg-card/20 rounded-2xl border border-white/[0.06]">
            No products added yet. Click &apos;Add Product&apos; to showcase IZIES Labs products!
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className={`flex flex-col sm:flex-row items-start gap-3 p-3.5 rounded-2xl border transition-all duration-300 ${
                product.isPublic
                  ? "bg-[#0A0D18] border-white/[0.08] hover:border-indigo-500/30"
                  : "bg-[#0A0D18]/50 border-amber-500/20 opacity-75"
              }`}
            >
              {product.imageUrl ? (
                <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-xl border border-white/[0.05]">
                  <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Box className="w-5 h-5 text-slate-500" />
                </div>
              )}

              <div className="flex-1 min-w-0 flex flex-col justify-center h-full space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border truncate ${STATUS_BADGE[product.status] ?? ""}`}>
                    {STATUS_LABELS[product.status] ?? product.status}
                  </span>
                  <span className="text-[9px] text-slate-500 truncate max-w-[70px]">{product.type}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-white text-[13px] truncate">
                    {product.isFeatured && <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 inline-block mr-1 mb-0.5" />}
                    {product.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1 mt-auto pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTogglePublic(product)}
                    className={`h-6 px-1.5 text-[9px] gap-1 rounded-md border ${
                      product.isPublic
                        ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                        : "border-amber-500/30 text-amber-400 bg-amber-500/10"
                    }`}
                  >
                    {product.isPublic ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openModal(product)} className="h-6 w-6 p-0 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-md">
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(product.id)} className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
            <div className="relative inline-block w-full max-w-lg bg-[#0B0F19] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-left align-middle space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-xl font-bold text-white">{editingId ? "Edit Product" : "Add Product"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Product Name *</label>
                  <Input required placeholder="e.g. Project Hub" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Type Badge</label>
                  <Input placeholder="e.g. Free · Open Source" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tagline *</label>
                <Input required placeholder="e.g. Build. Share. Grow." value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  className="w-full rounded-xl border border-border bg-card/60 p-3 text-xs text-foreground focus:outline-none"
                  placeholder="What does this product do? Who is it for?"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Color Theme</label>
                  <select
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none"
                  >
                    {COLOR_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Product URL</label>
                <Input type="url" placeholder="https://projecthub.izies.in" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Screenshot / Cover Image URL</label>
                <Input type="url" placeholder="https://..." value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Icon Name (Lucide)</label>
                  <Input placeholder="e.g. Rocket, Globe" value={form.iconName} onChange={(e) => setForm({ ...form, iconName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Display Order</label>
                  <Input type="number" placeholder="0" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tags (comma separated)</label>
                <Input placeholder="e.g. Students, Collaboration, Open Source" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Capabilities / Services Mapped To</label>
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

              <div className="flex gap-4">
                <div className="p-3.5 flex-1 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-white block">Featured Product</span>
                    <span className="text-[11px] text-slate-400">Shown first with highlight border</span>
                  </div>
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4 accent-amber-500 rounded cursor-pointer" />
                </div>
                <div className="p-3.5 flex-1 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-white block">Public Visibility</span>
                    <span className="text-[11px] text-slate-400">Show on /products page</span>
                  </div>
                  <input type="checkbox" checked={form.isPublic} onChange={(e) => setForm({ ...form, isPublic: e.target.checked })} className="w-4 h-4 accent-indigo-500 rounded cursor-pointer" />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/[0.08]">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" isLoading={isSubmitting}>Save Product</Button>
              </div>
            </form>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
