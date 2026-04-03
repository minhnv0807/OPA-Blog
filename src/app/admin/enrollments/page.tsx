import { connectDB } from "@/lib/db";
import { Enrollment } from "@/lib/models/Enrollment";
import { User } from "@/lib/models/User";
import { Course } from "@/lib/models/Course";
import EnrollmentTable from "@/components/admin/EnrollmentTable";

export default async function AdminEnrollmentsPage() {
  await connectDB();

  const [rawEnrollments, rawUsers, rawCourses] = await Promise.all([
    Enrollment.find()
      .populate("userId", "name email phone avatar")
      .populate("courseId", "title slug tier price")
      .sort({ createdAt: -1 })
      .lean(),
    User.find({ role: { $in: ["user", "student"] } })
      .select("name email")
      .sort({ name: 1 })
      .lean(),
    Course.find({ status: { $ne: "archived" } })
      .select("title tier price")
      .sort({ orderIndex: 1 })
      .lean(),
  ]);

  const enrollments = JSON.parse(JSON.stringify(rawEnrollments));
  const users = JSON.parse(JSON.stringify(rawUsers));
  const courses = JSON.parse(JSON.stringify(rawCourses));

  return (
    <div>
      <EnrollmentTable
        enrollments={enrollments}
        users={users}
        courses={courses}
      />
    </div>
  );
}
