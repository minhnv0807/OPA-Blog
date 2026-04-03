import { connectDB } from "@/lib/db";
import { Enrollment } from "@/lib/models/Enrollment";
import { Module } from "@/lib/models/Module";

type UserContext = { id: string; role: string } | null;

export async function canAccessLesson(
  user: UserContext,
  lesson: { moduleId: string; accessLevel: string; isPreview: boolean }
): Promise<boolean> {
  if (lesson.accessLevel === "free") return true;
  if (lesson.isPreview) return true;
  if (!user) return false;
  if (user.role === "admin") return true;

  await connectDB();

  const module = await Module.findById(lesson.moduleId).lean();
  if (!module) return false;

  const courseId = (module as { courseId: unknown }).courseId;

  const enrollment = await Enrollment.findOne({
    userId: user.id,
    courseId,
    status: "active",
  }).lean();

  if (!enrollment) return false;

  const tier = (enrollment as { tier: string }).tier;

  if (lesson.accessLevel === "tier_10000000") {
    return tier === "tier_10000000" || tier === "tier_15000000";
  }

  if (lesson.accessLevel === "tier_15000000") {
    return tier === "tier_15000000";
  }

  return false;
}

export async function canAccessPost(
  user: UserContext,
  accessLevel: string
): Promise<boolean> {
  if (accessLevel === "free") return true;
  if (!user) return false;
  if (user.role === "admin") return true;

  await connectDB();

  if (accessLevel === "tier_10000000") {
    const enrollment = await Enrollment.findOne({
      userId: user.id,
      status: "active",
      tier: { $in: ["tier_10000000", "tier_15000000"] },
    }).lean();
    return enrollment !== null;
  }

  if (accessLevel === "tier_15000000") {
    const enrollment = await Enrollment.findOne({
      userId: user.id,
      status: "active",
      tier: "tier_15000000",
    }).lean();
    return enrollment !== null;
  }

  return false;
}
