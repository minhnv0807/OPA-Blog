"use client";

import { useState } from "react";
import { UserPlus, Check, X, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

interface PopulatedCourse {
  _id: string;
  title: string;
  slug: string;
  tier: string;
  price: number;
}

interface Enrollment {
  _id: string;
  userId: PopulatedUser;
  courseId: PopulatedCourse;
  status: "pending" | "active" | "expired" | "refunded";
  tier: string;
  amountPaid: number;
  enrolledAt: string;
}

interface UserOption {
  _id: string;
  name: string;
  email: string;
}

interface CourseOption {
  _id: string;
  title: string;
  tier: string;
  price: number;
}

interface Props {
  enrollments: Enrollment[];
  users: UserOption[];
  courses: CourseOption[];
}

function formatPrice(n: number): string {
  return new Intl.NumberFormat("vi-VN").format(n) + "đ";
}

function formatTier(tier: string): string {
  if (tier === "tier_10000000") return "10 triệu";
  if (tier === "tier_15000000") return "15 triệu";
  return tier;
}

const STATUS_BADGE: Record<string, string> = {
  active: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  expired: "bg-gray-100 text-gray-600 border-gray-200",
  refunded: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_LABEL: Record<string, string> = {
  active: "Đang học",
  pending: "Chờ duyệt",
  expired: "Hết hạn",
  refunded: "Hoàn tiền",
};

export default function EnrollmentTable({ enrollments: initial, users, courses }: Props) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [autoTier, setAutoTier] = useState("");
  const [autoPrice, setAutoPrice] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  function handleCourseChange(courseId: string) {
    setSelectedCourseId(courseId);
    const found = courses.find((c) => c._id === courseId);
    if (found) {
      setAutoTier(found.tier);
      setAutoPrice(found.price);
    } else {
      setAutoTier("");
      setAutoPrice(0);
    }
  }

  async function handleEnroll(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUserId || !selectedCourseId) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          courseId: selectedCourseId,
          tier: autoTier,
          status: "active",
          amountPaid: autoPrice,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Reload page to get fresh populated data
        window.location.reload();
      } else {
        alert(data.error || "Enroll thất bại");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAction(id: string, newStatus: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/enrollments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setEnrollments((prev) =>
          prev.map((e) =>
            e._id === id
              ? { ...e, status: newStatus as Enrollment["status"] }
              : e
          )
        );
      } else {
        alert(data.error || "Cập nhật thất bại");
      }
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
          Quản lý Enrollments
        </h1>
        <Button
          onClick={() => setShowForm((v) => !v)}
          className="bg-[#155eef] hover:bg-[#2970ff] text-white gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Enroll thủ công
        </Button>
      </div>

      {/* Manual enroll form */}
      {showForm && (
        <div className="rounded-xl border bg-card p-5 mb-6">
          <h2 className="text-sm font-semibold mb-4 font-[family-name:var(--font-heading)]">
            Enroll học viên vào khóa học
          </h2>
          <form onSubmit={handleEnroll} className="grid gap-4 sm:grid-cols-2">
            {/* User select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Học viên</label>
              <Select value={selectedUserId} onValueChange={(v) => v && setSelectedUserId(v)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Chọn học viên..." />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u._id} value={u._id}>
                      {u.name} — {u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Course select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Khóa học</label>
              <Select value={selectedCourseId} onValueChange={(v) => v && handleCourseChange(v)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Chọn khóa học..." />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Auto-filled tier + price */}
            {selectedCourseId && (
              <div className="sm:col-span-2 flex items-center gap-4 text-xs text-muted-foreground">
                <span>
                  Tier:{" "}
                  <span className="font-semibold text-foreground">
                    {formatTier(autoTier)}
                  </span>
                </span>
                <span>
                  Giá:{" "}
                  <span className="font-semibold text-foreground">
                    {formatPrice(autoPrice)}
                  </span>
                </span>
              </div>
            )}

            <div className="sm:col-span-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowForm(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={submitting || !selectedUserId || !selectedCourseId}
                className="bg-[#155eef] hover:bg-[#2970ff] text-white"
              >
                {submitting ? "Đang xử lý..." : "Xác nhận enroll"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-4 font-medium">Học viên</th>
              <th className="p-4 font-medium hidden md:table-cell">Khóa học</th>
              <th className="p-4 font-medium hidden lg:table-cell">Tier</th>
              <th className="p-4 font-medium hidden lg:table-cell">Đã trả</th>
              <th className="p-4 font-medium">Trạng thái</th>
              <th className="p-4 font-medium hidden md:table-cell">Ngày</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  Chưa có enrollment nào.
                </td>
              </tr>
            ) : (
              enrollments.map((e) => {
                const user = e.userId;
                const course = e.courseId;
                const isLoading = actionLoading === e._id;

                return (
                  <tr
                    key={e._id}
                    className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                  >
                    {/* Học viên */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#155eef] flex items-center justify-center shrink-0">
                          <span className="text-white text-xs font-bold">
                            {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium leading-tight">{user?.name ?? "—"}</p>
                          <p className="text-xs text-muted-foreground">{user?.email ?? "—"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Khóa học */}
                    <td className="p-4 hidden md:table-cell">
                      <p className="font-medium leading-tight line-clamp-2 max-w-[200px]">
                        {course?.title ?? "—"}
                      </p>
                    </td>

                    {/* Tier */}
                    <td className="p-4 hidden lg:table-cell text-muted-foreground text-xs">
                      {formatTier(e.tier)}
                    </td>

                    {/* Đã trả */}
                    <td className="p-4 hidden lg:table-cell text-xs font-medium">
                      {formatPrice(e.amountPaid)}
                    </td>

                    {/* Trạng thái */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                          STATUS_BADGE[e.status] ?? "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {STATUS_LABEL[e.status] ?? e.status}
                      </span>
                    </td>

                    {/* Ngày */}
                    <td className="p-4 hidden md:table-cell text-xs text-muted-foreground">
                      {new Date(e.enrolledAt).toLocaleDateString("vi-VN")}
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {e.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                            disabled={isLoading}
                            onClick={() => handleAction(e._id, "active")}
                            title="Duyệt enrollment"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {e.status === "active" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            disabled={isLoading}
                            onClick={() => handleAction(e._id, "refunded")}
                            title="Thu hồi enrollment"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {e.status === "expired" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#155eef] hover:text-[#2970ff] hover:bg-blue-50"
                            disabled={isLoading}
                            onClick={() => handleAction(e._id, "active")}
                            title="Kích hoạt lại"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {(e.status === "refunded") && (
                          <span className="text-xs text-muted-foreground px-2">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
