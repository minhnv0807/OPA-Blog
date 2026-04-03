"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/learn/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/learn/courses", label: "Khóa học", icon: BookOpen },
  { href: "/contact", label: "Hỗ trợ", icon: HelpCircle },
];

export function LearnSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:top-16 lg:bottom-0 bg-white border-r border-gray-200 p-4">
      <nav className="space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-[#155eef]/10 text-[#155eef] font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-gray-50"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
