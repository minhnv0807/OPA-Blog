import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Course, type ICourse } from "@/lib/models/Course";
import { Enrollment } from "@/lib/models/Enrollment";
import { Module } from "@/lib/models/Module";
import { Lesson } from "@/lib/models/Lesson";
import { LessonProgress } from "@/lib/models/LessonProgress";
import { CourseCard } from "@/components/learn/CourseCard";
import mongoose from "mongoose";

interface EnrollmentWithCourse {
  courseId: ICourse & { _id: mongoose.Types.ObjectId };
  tier: "tier_10000000" | "tier_15000000";
}

async function getCourseProgress(
  userId: string,
  courseId: mongoose.Types.ObjectId
): Promise<number> {
  const modules = await Module.find({ courseId }).select("_id").lean();
  if (modules.length === 0) return 0;

  const moduleIds = modules.map((m) => m._id);
  const lessons = await Lesson.find({ moduleId: { $in: moduleIds } }).select("_id").lean();
  if (lessons.length === 0) return 0;

  const lessonIds = lessons.map((l) => l._id);
  const completedCount = await LessonProgress.countDocuments({
    userId: new mongoose.Types.ObjectId(userId),
    lessonId: { $in: lessonIds },
    status: "completed",
  });

  return Math.round((completedCount / lessons.length) * 100);
}

export default async function DashboardPage() {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  await connectDB();

  const [rawEnrollments, allPublishedCourses] = await Promise.all([
    Enrollment.find({ userId: new mongoose.Types.ObjectId(userId), status: "active" })
      .populate("courseId")
      .lean(),
    Course.find({ status: "published" }).sort({ orderIndex: 1 }).lean(),
  ]);

  const enrollments = rawEnrollments as unknown as EnrollmentWithCourse[];

  const enrolledCourseIds = new Set(
    enrollments.map((e) => e.courseId._id.toString())
  );

  // Calculate progress for each enrolled course
  const enrolledCoursesWithProgress = await Promise.all(
    enrollments
      .filter((e) => e.courseId && e.courseId._id)
      .map(async (enrollment) => {
        const course = enrollment.courseId;
        const progress = await getCourseProgress(userId, course._id);
        return { course, progress };
      })
  );

  const notEnrolledCourses = allPublishedCourses.filter(
    (c) => !enrolledCourseIds.has((c._id as mongoose.Types.ObjectId).toString())
  );

  const userName = session!.user?.name || "bạn";

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Chào mừng trở lại, {userName}!
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Tiếp tục hành trình học tập của bạn hôm nay.
        </p>
      </div>

      {/* Enrolled courses */}
      {enrolledCoursesWithProgress.length > 0 && (
        <section className="mb-10">
          <h2 className="font-heading text-lg font-semibold mb-4">Khóa học của bạn</h2>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {enrolledCoursesWithProgress.map(({ course, progress }) => (
              <CourseCard
                key={course._id.toString()}
                title={course.title}
                slug={course.slug}
                thumbnail={course.thumbnail}
                description={course.description}
                tier={course.tier}
                progress={progress}
                enrolled={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* Not enrolled courses */}
      {notEnrolledCourses.length > 0 && (
        <section>
          <h2 className="font-heading text-lg font-semibold mb-4">Khóa học khác</h2>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {notEnrolledCourses.map((course) => (
              <CourseCard
                key={(course._id as mongoose.Types.ObjectId).toString()}
                title={course.title}
                slug={course.slug}
                thumbnail={course.thumbnail}
                description={course.description}
                tier={course.tier}
                enrolled={false}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {enrolledCoursesWithProgress.length === 0 && notEnrolledCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-16 text-center">
          <p className="text-muted-foreground">Chưa có khóa học nào được xuất bản.</p>
        </div>
      )}
    </div>
  );
}
