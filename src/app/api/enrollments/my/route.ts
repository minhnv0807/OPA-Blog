import { connectDB } from "@/lib/db";
import { Enrollment } from "@/lib/models/Enrollment";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return Response.json({ success: false, error: "Invalid session" }, { status: 401 });
  }

  await connectDB();

  const enrollments = await Enrollment.find({ userId, status: "active" })
    .populate("courseId", "title slug description thumbnail price tier")
    .sort({ enrolledAt: -1 })
    .lean();

  return Response.json({ success: true, data: enrollments });
}
