import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { requireAdmin } from "@/lib/auth";
import { invalidateCache } from "@/lib/cache";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params;
  await connectDB();

  const post = await Post.findById(id)
    .populate("category", "name slug color")
    .populate("tags", "name slug")
    .populate("author", "name avatar")
    .lean();

  if (!post) {
    return Response.json({ success: false, error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true, data: post });
}

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  const session = await requireAdmin(req);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  await connectDB();
  const body = await req.json();

  if (body.status === "published") {
    body.publishedAt = body.publishedAt || new Date();
  }

  const post = await Post.findByIdAndUpdate(id, body, { new: true });
  if (!post) {
    return Response.json({ success: false, error: "Not found" }, { status: 404 });
  }

  await invalidateCache("posts:*");
  return Response.json({ success: true, data: post });
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  const session = await requireAdmin(req);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  await connectDB();

  await Post.findByIdAndUpdate(id, { status: "archived" });

  await invalidateCache("posts:*");
  return Response.json({ success: true });
}
