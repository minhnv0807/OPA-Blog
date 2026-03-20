"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  order: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", color: "#155eef", order: 0 });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.data || []);
    setLoading(false);
  }

  function resetForm() {
    setForm({ name: "", description: "", color: "#155eef", order: 0 });
    setShowNew(false);
    setEditingId(null);
  }

  function startEdit(cat: Category) {
    setEditingId(cat._id);
    setForm({ name: cat.name, description: cat.description, color: cat.color, order: cat.order });
    setShowNew(false);
  }

  async function handleSave() {
    if (!form.name.trim()) return;

    if (editingId) {
      await fetch(`/api/categories/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    resetForm();
    fetchCategories();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
          Categories
        </h1>
        <Button
          size="sm"
          className="gap-2"
          onClick={() => {
            resetForm();
            setShowNew(true);
          }}
        >
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </div>

      {/* Create/Edit form */}
      {(showNew || editingId) && (
        <div className="card-elevated rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold mb-4">
            {editingId ? "Edit Category" : "New Category"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Name</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Category name"
                className="border border-gray-200 bg-white"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Description</label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description"
                className="border border-gray-200 bg-white"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="h-9 w-12 rounded border border-gray-200 cursor-pointer"
                />
                <Input
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="border border-gray-200 bg-white font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Order</label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                className="border border-gray-200 bg-white"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button size="sm" className="gap-2" onClick={handleSave}>
              <Check className="h-3.5 w-3.5" />
              {editingId ? "Update" : "Create"}
            </Button>
            <Button size="sm" variant="outline" className="gap-2" onClick={resetForm}>
              <X className="h-3.5 w-3.5" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Categories list */}
      <div className="card-elevated rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-4 font-medium">Color</th>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium hidden md:table-cell">Slug</th>
              <th className="p-4 font-medium hidden sm:table-cell">Description</th>
              <th className="p-4 font-medium">Order</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  Loading...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No categories yet.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr
                  key={cat._id}
                  className="border-b border-border last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div
                      className="h-6 w-6 rounded-md"
                      style={{ backgroundColor: cat.color }}
                    />
                  </td>
                  <td className="p-4 font-medium">
                    <Badge variant="outline" style={{ borderColor: cat.color, color: cat.color }}>
                      {cat.name}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell font-mono text-xs">
                    {cat.slug}
                  </td>
                  <td className="p-4 text-muted-foreground hidden sm:table-cell text-xs max-w-[200px] truncate">
                    {cat.description}
                  </td>
                  <td className="p-4 text-muted-foreground">{cat.order}</td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => startEdit(cat)}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(cat._id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
