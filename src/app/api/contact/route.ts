import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Contact } from "@/lib/models/Contact";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
  const status = searchParams.get("status");

  const filter: Record<string, unknown> = {};
  if (status && ["new", "read", "replied"].includes(status)) {
    filter.status = status;
  }

  const [messages, total] = await Promise.all([
    Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Contact.countDocuments(filter),
  ]);

  return Response.json({
    success: true,
    data: messages,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.name || !body.email || !body.message) {
    return Response.json(
      { success: false, error: "name, email, and message are required" },
      { status: 400 }
    );
  }

  if (body.message.length > 5000) {
    return Response.json(
      { success: false, error: "Message too long (max 5000 chars)" },
      { status: 400 }
    );
  }

  await connectDB();

  const contact = await Contact.create({
    name: body.name,
    email: body.email,
    message: body.message,
  });

  return Response.json({ success: true, data: { id: contact._id } }, { status: 201 });
}
