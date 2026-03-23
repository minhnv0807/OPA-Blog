import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Tag } from "@/lib/models/Tag";
import { requireAdmin } from "@/lib/auth";
import slugify from "slugify";

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

  const update: Record<string, string> = {};
  if (body.name) {
    update.name = body.name.trim();
    update.slug = slugify(body.name, { lower: true, strict: true });
  }

  const tag = await Tag.findByIdAndUpdate(id, update, { new: true });
  if (!tag) {
    return Response.json({ success: false, error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true, data: tag });
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  const session = await requireAdmin(req);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  await connectDB();

  const tag = await Tag.findByIdAndDelete(id);
  if (!tag) {
    return Response.json({ success: false, error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}
