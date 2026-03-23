"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryOption {
  _id: string;
  name: string;
}

export default function PostEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "",
    status: "draft" as "draft" | "published",
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.data || []));
  }, []);

  useEffect(() => {
    if (!editId) return;
    fetch(`/api/posts/${editId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          const p = d.data;
          setForm({
            title: p.title || "",
            excerpt: p.excerpt || "",
            content: p.content || "",
            coverImage: p.coverImage || "",
            category: p.category?._id || p.category || "",
            status: p.status || "draft",
          });
        }
      });
  }, [editId]);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(status: "draft" | "published") {
    setLoading(true);
    const payload = { ...form, status };

    const url = editId ? `/api/posts/${editId}` : "/api/posts";
    const method = editId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      router.push("/admin/posts");
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/posts">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold font-[family-name:var(--font-heading)]">
            {editId ? "Edit Post" : "New Post"}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={loading}
            onClick={() => handleSave("draft")}
          >
            <Save className="h-3.5 w-3.5" />
            Save Draft
          </Button>
          <Button
            size="sm"
            className="gap-2"
            disabled={loading}
            onClick={() => handleSave("published")}
          >
            <Eye className="h-3.5 w-3.5" />
            Publish
          </Button>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Title</label>
          <Input
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Post title..."
            className="border border-gray-200 bg-white text-lg font-medium"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Excerpt</label>
          <Input
            value={form.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
            placeholder="Short description (max 300 chars)"
            maxLength={300}
            className="border border-gray-200 bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Category</label>
            <Select
              value={form.category || undefined}
              onValueChange={(v: string | null) => update("category", v || "")}
            >
              <SelectTrigger className="border border-gray-200 bg-white">
                <SelectValue placeholder="Chọn danh mục">
                  {categories.find((c) => c._id === form.category)?.name || "Chọn danh mục"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Cover Image URL</label>
            <Input
              value={form.coverImage}
              onChange={(e) => update("coverImage", e.target.value)}
              placeholder="https://..."
              className="border border-gray-200 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">
            Content (Markdown)
          </label>
          <Textarea
            value={form.content}
            onChange={(e) => update("content", e.target.value)}
            placeholder="Write your article in Markdown..."
            rows={20}
            className="border border-gray-200 bg-white font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
}
