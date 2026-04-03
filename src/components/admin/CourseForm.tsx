"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface CourseFormData {
  _id?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  price?: number;
  tier?: string;
  status?: string;
}

interface Props {
  initialData?: CourseFormData;
}

const PRICE_OPTIONS = [
  { value: "10000000", label: "10.000.000đ" },
  { value: "15000000", label: "15.000.000đ" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Nháp" },
  { value: "published", label: "Công khai" },
];

function getTierFromPrice(price: number): string {
  if (price === 15000000) return "tier_15000000";
  return "tier_10000000";
}

export default function CourseForm({ initialData }: Props) {
  const router = useRouter();
  const isEditing = Boolean(initialData?._id);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail ?? "");
  const [price, setPrice] = useState(
    String(initialData?.price ?? 10000000)
  );
  const [status, setStatus] = useState(initialData?.status ?? "draft");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const priceNum = Number(price);
    const tier = getTierFromPrice(priceNum);

    const body = { title, description, thumbnail, price: priceNum, tier, status };

    try {
      let res: Response;
      if (isEditing) {
        res = await fetch(`/api/courses/${initialData!._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch("/api/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? `Lỗi ${res.status}`);
      }

      const data = await res.json();

      if (isEditing) {
        router.refresh();
      } else {
        const newId = data?._id ?? data?.course?._id;
        router.push(`/admin/courses/${newId}/edit`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card rounded-lg border border-border p-6 space-y-5"
    >
      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          Tên khóa học <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập tên khóa học..."
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20 transition-all"
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Mô tả</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả ngắn về khóa học..."
          rows={4}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20 transition-all resize-y"
        />
      </div>

      {/* Thumbnail */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">URL Thumbnail</label>
        <input
          type="text"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20 transition-all"
        />
      </div>

      {/* Price & Status row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Price */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Giá</label>
          <select
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20 transition-all"
          >
            {PRICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Gói: {getTierFromPrice(Number(price))}
          </p>
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Trạng thái</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20 transition-all"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#155eef] hover:bg-[#2970ff] text-white px-6"
        >
          {loading
            ? "Đang lưu..."
            : isEditing
            ? "Cập nhật khóa học"
            : "Tạo khóa học"}
        </Button>
      </div>
    </form>
  );
}
