import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Lesson } from "@/lib/models/Lesson";
import { auth, requireAdmin } from "@/lib/auth";
import { canAccessLesson } from "@/lib/access";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  await connectDB();

  const lesson = await Lesson.findById(id).lean();
  if (!lesson) {
    return Response.json({ success: false, error: "Lesson not found" }, { status: 404 });
  }

  const session = await auth();
  const user = session?.user
    ? {
        id: (session.user as { id?: string }).id ?? "",
        role: (session.user as { role?: string }).role ?? "user",
      }
    : null;

  const typedLesson = lesson as {
    moduleId: string;
    accessLevel: string;
    isPreview: boolean;
  };

  const accessible = await canAccessLesson(user, {
    moduleId: typedLesson.moduleId.toString(),
    accessLevel: typedLesson.accessLevel,
    isPreview: typedLesson.isPreview,
  });

  if (!accessible) {
    return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  return Response.json({ success: true, data: lesson });
}

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  const session = await requireAdmin(req);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  await connectDB();

  const body = await req.json();

  const lesson = await Lesson.findByIdAndUpdate(id, body, { new: true });
  if (!lesson) {
    return Response.json({ success: false, error: "Lesson not found" }, { status: 404 });
  }

  return Response.json({ success: true, data: lesson });
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  const session = await requireAdmin(req);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  await connectDB();

  const lesson = await Lesson.findByIdAndDelete(id);
  if (!lesson) {
    return Response.json({ success: false, error: "Lesson not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}
