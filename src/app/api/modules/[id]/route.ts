import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Module } from "@/lib/models/Module";
import { Lesson } from "@/lib/models/Lesson";
import { requireAdmin } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  const session = await requireAdmin(req);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  await connectDB();

  const body = await req.json();

  const module = await Module.findByIdAndUpdate(id, body, { new: true });
  if (!module) {
    return Response.json({ success: false, error: "Module not found" }, { status: 404 });
  }

  return Response.json({ success: true, data: module });
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  const session = await requireAdmin(req);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  await connectDB();

  const module = await Module.findByIdAndDelete(id);
  if (!module) {
    return Response.json({ success: false, error: "Module not found" }, { status: 404 });
  }

  await Lesson.deleteMany({ moduleId: id });

  return Response.json({ success: true });
}
