import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Course } from "@/lib/models/Course";
import { Module } from "@/lib/models/Module";
import { Lesson } from "@/lib/models/Lesson";
import CourseForm from "@/components/admin/CourseForm";
import ModuleLessonEditor from "@/components/admin/ModuleLessonEditor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCoursePage({ params }: PageProps) {
  const { id } = await params;

  await connectDB();

  const courseDoc = await Course.findById(id).lean();
  if (!courseDoc) {
    notFound();
  }

  const moduleDocs = await Module.find({ courseId: id })
    .sort({ orderIndex: 1 })
    .lean();

  const lessonDocs = await Lesson.find({
    moduleId: { $in: moduleDocs.map((m) => m._id) },
  })
    .sort({ orderIndex: 1 })
    .lean();

  // Group lessons by moduleId string
  const lessonsByModule: Record<string, typeof lessonDocs> = {};
  for (const lesson of lessonDocs) {
    const key = String(lesson.moduleId);
    if (!lessonsByModule[key]) lessonsByModule[key] = [];
    lessonsByModule[key].push(lesson);
  }

  // Serialize: ObjectId → string
  const course = JSON.parse(JSON.stringify(courseDoc)) as {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    price: number;
    tier: string;
    status: string;
  };

  const modules = JSON.parse(
    JSON.stringify(
      moduleDocs.map((m) => ({
        ...m,
        lessons: lessonsByModule[String(m._id)] ?? [],
      }))
    )
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
          Chỉnh sửa khóa học
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Cập nhật thông tin và nội dung khóa học.
        </p>
      </div>

      <div className="space-y-8">
        {/* Course info form */}
        <div className="max-w-2xl">
          <h2 className="text-base font-semibold font-[family-name:var(--font-heading)] mb-3">
            Thông tin khóa học
          </h2>
          <CourseForm initialData={course} />
        </div>

        {/* Module & lesson editor */}
        <div>
          <ModuleLessonEditor courseId={course._id} modules={modules} />
        </div>
      </div>
    </div>
  );
}
