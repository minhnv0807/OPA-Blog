import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Module } from "@/lib/models/Module";
import { Lesson } from "@/lib/models/Lesson";
import { requireAdmin } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, ctx: RouteContext) {
  const session = await requireAdmin(req);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  await connectDB();

  const module = await Module.findById(id).lean();
  if (!module) {
    return Response.json({ success: false, error: "Module not found" }, { status: 404 });
  }

  const body = await req.json();
  const {
    title,
    description,
    contentType,
    videoUrl,
    textContent,
    isPreview,
    accessLevel,
  } = body;

  if (!title) {
    return Response.json({ success: false, error: "Title is required" }, { status: 400 });
  }

  const last = await Lesson.findOne({ moduleId: id })
    .sort({ orderIndex: -1 })
    .lean();

  const orderIndex = last ? (last as { orderIndex: number }).orderIndex + 1 : 0;

  const lesson = await Lesson.create({
    moduleId: id,
    title,
    description: description ?? "",
    contentType: contentType ?? "video",
    videoUrl: videoUrl ?? "",
    textContent: textContent ?? "",
    isPreview: isPreview ?? false,
    accessLevel: accessLevel ?? "free",
    orderIndex,
  });

  return Response.json({ success: true, data: lesson }, { status: 201 });
}
