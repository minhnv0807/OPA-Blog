import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react";
import { connectDB } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import "@/lib/models/Category";
import "@/lib/models/Tag";
import "@/lib/models/User";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PostCard } from "@/components/blog/PostCard";
import { Comments } from "@/components/blog/Comments";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const post = await Post.findOne({ slug, status: "published" }).lean();

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.seo?.ogImage || post.coverImage ? [post.seo?.ogImage || post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();

  const post = await Post.findOneAndUpdate(
    { slug, status: "published" },
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate("category", "name slug color")
    .populate("tags", "name slug")
    .populate("author", "name avatar bio")
    .lean();

  if (!post) notFound();

  const cat = post.category as { name: string; slug: string; color: string } | null;
  const tags = (post.tags || []) as { name: string; slug: string }[];
  const author = post.author as { name: string; avatar: string; bio: string } | null;

  // Related posts: same category, exclude current
  const relatedPosts = cat
    ? await Post.find({
        status: "published",
        category: (post.category as { _id: string })?._id,
        _id: { $ne: post._id },
      })
        .sort({ publishedAt: -1 })
        .limit(3)
        .populate("category", "name slug color")
        .lean()
    : [];

  return (
    <article className="pt-24 pb-16 px-6">
      <div className="mx-auto max-w-3xl">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-8">
          {cat && (
            <Badge className="mb-4" style={{ backgroundColor: cat.color }}>
              {cat.name}
            </Badge>
          )}
          <h1 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-heading)] leading-tight">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {author && <span className="font-medium text-foreground">{author.name}</span>}
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Draft"}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTime} min read
            </span>
          </div>
        </header>

        {/* Cover image */}
        {post.coverImage && (
          <div className="relative aspect-video rounded-2xl overflow-hidden mb-10">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none prose-headings:font-[family-name:var(--font-heading)] prose-a:text-[#155eef] prose-code:text-[#155eef] prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded-xl">
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <>
            <Separator className="my-10 bg-border" />
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {tags.map((tag) => (
                <Badge key={tag.slug} variant="outline" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </>
        )}

        {/* Comments */}
        <Separator className="my-10 bg-border" />
        <Comments postId={String(post._id)} />

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <>
            <Separator className="my-10 bg-border" />
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-6">
              Bài Viết Liên Quan
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((rp) => {
                const rpCat = rp.category as { name: string; slug: string; color: string } | null;
                return (
                  <PostCard
                    key={String(rp._id)}
                    title={rp.title}
                    slug={rp.slug}
                    excerpt={rp.excerpt || ""}
                    coverImage={rp.coverImage || ""}
                    category={rpCat ? { name: rpCat.name, slug: rpCat.slug, color: rpCat.color } : undefined}
                    publishedAt={rp.publishedAt?.toISOString() || new Date().toISOString()}
                    readingTime={rp.readingTime || 1}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </article>
  );
}

function renderMarkdown(content: string): string {
  if (!content) return "";
  try {
    return content
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
      .replace(/`(.*?)`/gim, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="rounded-xl" />')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/(<li>[\s\S]*<\/li>)/, '<ul>$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[hupol])/gim, '<p>')
      .replace(/<p><\/p>/g, '');
  } catch {
    return `<p>${content}</p>`;
  }
}
