import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Tag } from "@/lib/models/Tag";
import { requireAdmin } from "@/lib/auth";
import slugify from "slugify";

export async function GET() {
  await connectDB();
  const tags = await Tag.find().sort({ name: 1 }).lean();
  return Response.json({ success: true, data: tags });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();

  if (!body.name?.trim()) {
    return Response.json({ success: false, error: "Name is required" }, { status: 400 });
  }

  const tag = await Tag.create({
    name: body.name.trim(),
    slug: slugify(body.name, { lower: true, strict: true }),
  });

  return Response.json({ success: true, data: tag }, { status: 201 });
}
