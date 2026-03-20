import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  FolderOpen,
  Users,
  LogOut,
  Shield,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, adminOnly: false },
  { href: "/admin/posts", label: "Posts", icon: FileText, adminOnly: false },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen, adminOnly: false },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare, adminOnly: false },
  { href: "/admin/users", label: "Users", icon: Users, adminOnly: true },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "admin" && role !== "editor") {
    redirect("/admin/login");
  }

  const isAdmin = role === "admin";
  const visibleLinks = sidebarLinks.filter((l) => !l.adminOnly || isAdmin);

  return (
    <div className="min-h-screen flex pt-16">
      {/* Sidebar */}
      <aside className="w-64 fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 p-4 hidden lg:block">
        <nav className="space-y-1">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-gray-50 transition-colors"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 px-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-[#155eef] flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">
                {(session.user.name || "A").charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {session.user.name || session.user.email}
              </p>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-[#155eef]" />
                <span className="text-xs text-[#155eef] font-medium capitalize">{role}</span>
              </div>
            </div>
          </div>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Mobile admin bar */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-2 overflow-x-auto">
        <div className="flex gap-1">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <link.icon className="h-3.5 w-3.5" />
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 lg:ml-64 p-6 pt-6 lg:pt-6 mt-12 lg:mt-0">{children}</main>
    </div>
  );
}
