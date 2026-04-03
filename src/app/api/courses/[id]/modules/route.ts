import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Course } from "@/lib/models/Course";
import { Module } from "@/lib/models/Module";
import { requireAdmin } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  await connectDB();

  const modules = await Module.find({ courseId: id })
    .sort({ orderIndex: 1 })
    .lean();

  return Response.json({ success: true, data: modules });
}

export async function POST(req: NextRequest, ctx: RouteContext) {
  const session = await requireAdmin(req);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  await connectDB();

  const course = await Course.findById(id).lean();
  if (!course) {
    return Response.json({ success: false, error: "Course not found" }, { status: 404 });
  }

  const body = await req.json();
  const { title, description } = body;

  if (!title) {
    return Response.json({ success: false, error: "Title is required" }, { status: 400 });
  }

  const last = await Module.findOne({ courseId: id })
    .sort({ orderIndex: -1 })
    .lean();

  const orderIndex = last ? (last as { orderIndex: number }).orderIndex + 1 : 0;

  const module = await Module.create({
    courseId: id,
    title,
    description: description ?? "",
    orderIndex,
  });

  return Response.json({ success: true, data: module }, { status: 201 });
}
