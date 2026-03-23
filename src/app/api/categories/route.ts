import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/lib/models/Category";
import { requireAdmin } from "@/lib/auth";
import { getCached, invalidateCache } from "@/lib/cache";
import slugify from "slugify";

export async function GET() {
  const categories = await getCached("categories:all", 300, async () => {
    await connectDB();
    return Category.find().sort({ order: 1 }).lean();
  });
  return Response.json({ success: true, data: categories });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();

  const category = await Category.create({
    ...body,
    slug: slugify(body.name, { lower: true, strict: true }),
  });

  await invalidateCache("categories:*");
  return Response.json({ success: true, data: category }, { status: 201 });
}
