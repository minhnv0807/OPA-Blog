import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Enrollment } from "@/lib/models/Enrollment";
import { User } from "@/lib/models/User";
import { Course } from "@/lib/models/Course";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const courseId = searchParams.get("courseId");

  // Build filter — never mutate the query object in-place
  const filter: Record<string, string> = {};
  if (status) filter.status = status;
  if (courseId) filter.courseId = courseId;

  const enrollments = await Enrollment.find(filter)
    .populate("userId", "name email phone avatar")
    .populate("courseId", "title slug tier price")
    .sort({ createdAt: -1 })
    .lean();

  return Response.json({ success: true, data: enrollments });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const body = await req.json();
  const { userId, courseId, tier, status, amountPaid } = body;

  if (!userId || !courseId || !tier) {
    return Response.json(
      { success: false, error: "userId, courseId and tier are required" },
      { status: 400 }
    );
  }

  const [user, course] = await Promise.all([
    User.findById(userId).lean(),
    Course.findById(courseId).lean(),
  ]);

  if (!user) {
    return Response.json({ success: false, error: "User not found" }, { status: 404 });
  }
  if (!course) {
    return Response.json({ success: false, error: "Course not found" }, { status: 404 });
  }

  const existing = await Enrollment.findOne({ userId, courseId }).lean();
  if (existing) {
    return Response.json(
      { success: false, error: "User is already enrolled in this course" },
      { status: 409 }
    );
  }

  // Upgrade user role from "user" to "student" if needed
  if ((user as { role?: string }).role === "user") {
    await User.findByIdAndUpdate(userId, { role: "student" });
  }

  const enrollment = await Enrollment.create({
    userId,
    courseId,
    tier,
    status: status ?? "active",
    amountPaid: amountPaid ?? 0,
    enrolledAt: new Date(),
  });

  return Response.json({ success: true, data: enrollment }, { status: 201 });
}
