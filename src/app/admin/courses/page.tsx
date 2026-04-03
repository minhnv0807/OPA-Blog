import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Course } from "@/lib/models/Course";
import { Enrollment } from "@/lib/models/Enrollment";
import { Plus, Pencil } from "lucide-react";
import mongoose from "mongoose";

interface CourseWithCount {
  _id: mongoose.Types.ObjectId;
  title: string;
  thumbnail: string;
  price: number;
  status: "draft" | "published" | "archived";
  orderIndex: number;
  enrollmentCount: number;
}

export default async function AdminCoursesPage() {
  await connectDB();

  const courses = await Course.find({ status: { $ne: "archived" } })
    .sort({ orderIndex: 1, createdAt: -1 })
    .select("title thumbnail price status orderIndex")
    .lean();

  // Aggregate enrollment counts per course (status "active")
  const enrollmentAgg = await Enrollment.aggregate([
    { $match: { status: "active" } },
    { $group: { _id: "$courseId", count: { $sum: 1 } } },
  ]);

  const enrollmentMap = new Map<string, number>(
    enrollmentAgg.map((item) => [String(item._id), item.count as number])
  );

  const coursesWithCounts: CourseWithCount[] = courses.map((c) => ({
    _id: c._id as mongoose.Types.ObjectId,
    title: c.title as string,
    thumbnail: (c.thumbnail as string) || "",
    price: c.price as number,
    status: c.status as "draft" | "published" | "archived",
    orderIndex: c.orderIndex as number,
    enrollmentCount: enrollmentMap.get(String(c._id)) ?? 0,
  }));

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
          Khóa học
        </h1>
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white bg-[#155eef] hover:bg-[#1249cc] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Tạo khóa học
        </Link>
      </div>

      {/* Course list */}
      {coursesWithCounts.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
          Chưa có khóa học nào. Bắt đầu tạo khóa học đầu tiên!
        </div>
      ) : (
        <div className="grid gap-4">
          {coursesWithCounts.map((course) => (
            <div
              key={String(course._id)}
              className="rounded-xl border bg-card flex items-center gap-4 p-4 hover:shadow-md transition-shadow"
            >
              {/* Thumbnail */}
              <div className="h-16 w-24 shrink-0 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                {course.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">No image</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold font-[family-name:var(--font-heading)] truncate">
                  {course.title}
                </h2>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span>
                    {new Intl.NumberFormat("vi-VN").format(course.price)}đ
                  </span>
                  <span>·</span>
                  <span>{course.enrollmentCount} học viên</span>
                </div>
              </div>

              {/* Status badge */}
              <div className="shrink-0">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    course.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {course.status === "published" ? "Đã xuất bản" : "Nháp"}
                </span>
              </div>

              {/* Edit button */}
              <Link
                href={`/admin/courses/${String(course._id)}/edit`}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
                Sửa
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
