import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/lib/models/Category";
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

  if (body.name) {
    body.slug = slugify(body.name, { lower: true, strict: true });
  }

  const category = await Category.findByIdAndUpdate(id, body, { new: true });
  if (!category) {
    return Response.json({ success: false, error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true, data: category });
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  const session = await requireAdmin(req);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  await connectDB();

  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return Response.json({ success: false, error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}
