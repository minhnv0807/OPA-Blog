import CourseForm from "@/components/admin/CourseForm";

export default function NewCoursePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
          Tạo khóa học mới
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Điền thông tin bên dưới để tạo khóa học mới.
        </p>
      </div>

      <div className="max-w-2xl">
        <CourseForm />
      </div>
    </div>
  );
}
