import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { LessonProgress } from "@/lib/models/LessonProgress";
import { auth } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ lessonId: string }>;
}

export async function GET(_req: NextRequest, ctx: RouteContext) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return Response.json({ success: false, error: "Invalid session" }, { status: 401 });
  }

  const { lessonId } = await ctx.params;
  await connectDB();

  const progress = await LessonProgress.findOne({ userId, lessonId }).lean();

  if (!progress) {
    return Response.json({
      success: true,
      data: { status: "not_started", progressPercent: 0, lastPosition: 0 },
    });
  }

  return Response.json({ success: true, data: progress });
}

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return Response.json({ success: false, error: "Invalid session" }, { status: 401 });
  }

  const { lessonId } = await ctx.params;
  await connectDB();

  const body = await req.json();
  const progressPercent: number = body.progressPercent ?? 0;
  const lastPosition: number = body.lastPosition ?? 0;

  // Auto-calculate status based on progressPercent
  const status =
    progressPercent >= 90 ? "completed" : progressPercent > 0 ? "in_progress" : "not_started";

  const completedAt = status === "completed" ? new Date() : null;

  const updated = await LessonProgress.findOneAndUpdate(
    { userId, lessonId },
    {
      $set: {
        progressPercent,
        lastPosition,
        status,
        ...(status === "completed" ? { completedAt } : {}),
      },
    },
    { new: true, upsert: true }
  );

  return Response.json({ success: true, data: updated });
}
