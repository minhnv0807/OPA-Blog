import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Course } from "@/lib/models/Course";
import { Module } from "@/lib/models/Module";
import { Lesson } from "@/lib/models/Lesson";
import { requireAdmin } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  await connectDB();

  const course = await Course.findById(id).lean();
  if (!course) {
    return Response.json({ success: false, error: "Not found" }, { status: 404 });
  }

  const modules = await Module.find({ courseId: id })
    .sort({ orderIndex: 1 })
    .lean();

  const moduleIds = modules.map((m) => m._id);
  const lessons = await Lesson.find({ moduleId: { $in: moduleIds } })
    .sort({ orderIndex: 1 })
    .lean();

  const lessonsByModule = lessons.reduce<Record<string, typeof lessons>>(
    (acc, lesson) => {
      const key = lesson.moduleId.toString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(lesson);
      return acc;
    },
    {}
  );

  const modulesWithLessons = modules.map((mod) => ({
    ...mod,
    lessons: lessonsByModule[mod._id.toString()] ?? [],
  }));

  return Response.json({
    success: true,
    data: { ...course, modules: modulesWithLessons },
  });
}

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  const session = await requireAdmin(req);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  await connectDB();
  const body = await req.json();

  const course = await Course.findByIdAndUpdate(id, body, { new: true });
  if (!course) {
    return Response.json({ success: false, error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true, data: course });
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  const session = await requireAdmin(req);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  await connectDB();

  const course = await Course.findByIdAndUpdate(id, { status: "archived" }, { new: true });
  if (!course) {
    return Response.json({ success: false, error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}
