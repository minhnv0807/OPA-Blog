import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Course } from "@/lib/models/Course";
import { requireAdmin } from "@/lib/auth";
import slugify from "slugify";

export async function GET(_req: NextRequest) {
  await connectDB();

  const courses = await Course.find({ status: "published" })
    .sort({ orderIndex: 1, createdAt: -1 })
    .lean();

  return Response.json({ success: true, data: courses });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();

  const slug = slugify(body.title, { lower: true, strict: true });

  const existing = await Course.findOne({ slug }).lean();
  if (existing) {
    return Response.json({ success: false, error: "Slug already exists" }, { status: 409 });
  }

  const course = await Course.create({
    title: body.title,
    slug,
    description: body.description ?? "",
    thumbnail: body.thumbnail ?? "",
    price: body.price,
    tier: body.tier,
    status: body.status ?? "draft",
  });

  return Response.json({ success: true, data: course }, { status: 201 });
}
