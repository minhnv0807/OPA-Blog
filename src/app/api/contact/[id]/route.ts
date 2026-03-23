import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Contact } from "@/lib/models/Contact";
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
  if (body.status && ["new", "read", "replied"].includes(body.status)) {
    allowed.status = body.status;
  }

  const contact = await Contact.findByIdAndUpdate(id, allowed, { new: true });
  if (!contact) {
    return Response.json({ success: false, error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true, data: contact });
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  const session = await requireAdmin(req);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  await connectDB();

  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) {
    return Response.json({ success: false, error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}
