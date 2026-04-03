import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Enrollment } from "@/lib/models/Enrollment";
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

  const enrollment = await Enrollment.findByIdAndUpdate(id, body, { new: true });
  if (!enrollment) {
    return Response.json({ success: false, error: "Enrollment not found" }, { status: 404 });
  }

  return Response.json({ success: true, data: enrollment });
}
