import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Newsletter } from "@/lib/models/Newsletter";
import { requireAdmin } from "@/lib/auth";
import { sendNewsletterWelcome } from "@/lib/mail";

export async function GET(req: Request) {
  const session = await requireAdmin(req);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const subscribers = await Newsletter.find({ active: true })
    .sort({ createdAt: -1 })
    .lean();

  return Response.json({ success: true, data: subscribers });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.email?.trim()) {
    return Response.json(
      { success: false, error: "Email is required" },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.email)) {
    return Response.json(
      { success: false, error: "Invalid email format" },
      { status: 400 }
    );
  }

  await connectDB();

  const existing = await Newsletter.findOne({ email: body.email.toLowerCase() });
  if (existing) {
    if (!existing.active) {
      existing.active = true;
      await existing.save();
    }
    return Response.json({ success: true, data: { subscribed: true } });
  }

  await Newsletter.create({ email: body.email.toLowerCase() });

  await sendNewsletterWelcome(body.email.toLowerCase());

  return Response.json({ success: true, data: { subscribed: true } }, { status: 201 });
}
