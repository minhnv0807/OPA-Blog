import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
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

  const allowed: Record<string, unknown> = {};
  if (body.name) allowed.name = body.name;
  if (body.role && ["admin", "editor"].includes(body.role)) allowed.role = body.role;
  if (body.bio !== undefined) allowed.bio = body.bio;
  if (body.avatar !== undefined) allowed.avatar = body.avatar;

  const user = await User.findByIdAndUpdate(id, allowed, { new: true }).select("-password");
  if (!user) {
    return Response.json({ success: false, error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true, data: user });
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  const session = await requireAdmin(req);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  await connectDB();

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return Response.json({ success: false, error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}
