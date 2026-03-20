import { connectDB } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { Contact } from "@/lib/models/Contact";
import { Category } from "@/lib/models/Category";
import { User } from "@/lib/models/User";
import { Newsletter } from "@/lib/models/Newsletter";
import {
  FileText,
  Eye,
  MessageSquare,
  TrendingUp,
  FolderOpen,
  Users,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboard() {
  await connectDB();

  const [
    totalPosts,
    publishedPosts,
    totalViews,
    newMessages,
    totalCategories,
    totalUsers,
    totalSubscribers,
    recentPosts,
    recentMessages,
  ] = await Promise.all([
    Post.countDocuments(),
    Post.countDocuments({ status: "published" }),
    Post.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
    Contact.countDocuments({ status: "new" }),
    Category.countDocuments(),
    User.countDocuments(),
    Newsletter.countDocuments({ active: true }),
    Post.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title slug status createdAt views")
      .lean(),
    Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email message status createdAt")
      .lean(),
  ]);

  const stats = [
    { label: "Total Posts", value: totalPosts, icon: FileText, color: "#155eef", href: "/admin/posts" },
    { label: "Published", value: publishedPosts, icon: TrendingUp, color: "#22c55e", href: "/admin/posts" },
    { label: "Total Views", value: totalViews[0]?.total || 0, icon: Eye, color: "#a855f7", href: "/admin" },
    { label: "New Messages", value: newMessages, icon: MessageSquare, color: "#f59e0b", href: "/admin/messages" },
    { label: "Categories", value: totalCategories, icon: FolderOpen, color: "#ec4899", href: "/admin/categories" },
    { label: "Users", value: totalUsers, icon: Users, color: "#06b6d4", href: "/admin/users" },
    { label: "Subscribers", value: totalSubscribers, icon: Mail, color: "#14b8a6", href: "/admin" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-6">
        Dashboard
      </h1>

      {/* Stats grid */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mb-10">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="card-elevated rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <div
                  className="rounded-lg p-2"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Posts */}
        <div className="card-elevated rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Posts</h2>
            <Link
              href="/admin/posts"
              className="text-sm text-[#155eef] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <div
                key={String(post._id)}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/posts/editor?id=${post._id}`}
                    className="text-sm font-medium hover:text-[#155eef] transition-colors truncate block"
                  >
                    {post.title}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <span className="text-xs text-muted-foreground">
                    {post.views} views
                  </span>
                  <Badge
                    variant={post.status === "published" ? "default" : "outline"}
                    className="text-xs"
                  >
                    {post.status}
                  </Badge>
                </div>
              </div>
            ))}
            {recentPosts.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No posts yet. Create your first post.
              </p>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="card-elevated rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Messages</h2>
            <Link
              href="/admin/messages"
              className="text-sm text-[#155eef] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentMessages.map((msg) => {
              const statusColor =
                msg.status === "new" ? "#f59e0b" : msg.status === "read" ? "#155eef" : "#22c55e";
              return (
                <div
                  key={String(msg._id)}
                  className="py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{msg.name}</span>
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{ borderColor: statusColor, color: statusColor }}
                      >
                        {msg.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {msg.message}
                  </p>
                </div>
              );
            })}
            {recentMessages.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No messages yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
