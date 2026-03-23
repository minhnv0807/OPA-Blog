import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { Category } from "@/lib/models/Category";
import { requireAdmin } from "@/lib/auth";
import { getCached, invalidateCache } from "@/lib/cache";
import { sendNewPostNotification } from "@/lib/mail";
import slugify from "slugify";
import readingTime from "reading-time";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "9"));
  const category = searchParams.get("category");
  const q = searchParams.get("q");

  // Cache only non-search, non-filtered requests (most common)
  const canCache = !q && !category;
  const cacheKey = `posts:page=${page}:limit=${limit}`;

  const result = await getCached(
    canCache ? cacheKey : `nocache:${Date.now()}`,
    canCache ? 60 : 0,
    async () => {
      await connectDB();

      const filter: Record<string, unknown> = { status: "published" };

      if (category) {
        const cat = await Category.findOne({ slug: category }).lean();
        if (cat) filter.category = cat._id;
      }

      if (q) {
        filter.$or = [
          { title: { $regex: q, $options: "i" } },
          { excerpt: { $regex: q, $options: "i" } },
        ];
      }

      const [posts, total] = await Promise.all([
        Post.find(filter)
          .sort({ publishedAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("category", "name slug color")
          .lean(),
        Post.countDocuments(filter),
      ]);

      return {
        data: posts,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      };
    }
  );

  return Response.json({ success: true, ...result });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();

  const slug = slugify(body.title, { lower: true, strict: true });
  const rt = readingTime(body.content || "");

  const post = await Post.create({
    ...body,
    slug,
    readingTime: Math.ceil(rt.minutes),
    author: (session.user as { id: string }).id,
    publishedAt: body.status === "published" ? new Date() : null,
  });

  await invalidateCache("posts:*");

  if (body.status === "published") {
    await sendNewPostNotification({
      title: body.title,
      slug,
      excerpt: body.excerpt || "",
      coverImage: body.coverImage,
    });
  }

  return Response.json({ success: true, data: post }, { status: 201 });
}
