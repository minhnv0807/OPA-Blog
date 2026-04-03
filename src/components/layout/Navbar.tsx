"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Trang Chủ" },
  { href: "/khoa-hoc-ai", label: "Khóa Học AI" },
  { href: "/learn", label: "Học tập" },
  { href: "/services", label: "Dịch Vụ" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "Giới Thiệu" },
  { href: "/contact", label: "Liên Hệ" },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const userRole = (session?.user as { role?: string })?.role;
  const isAdmin = session?.user && ["admin", "editor"].includes(userRole || "");
  const isLoggedIn = !!session?.user;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.header
      initial={false}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border-b border-gray-100"
          : "bg-white/60 backdrop-blur-sm"
      }`}
    >
      <nav className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[5.25rem]">
        <Link href="/" className="group flex items-center rounded-2xl py-2">
          <BrandLogo priority />
        </Link>

        {/* Desktop nav links — absolute center */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-[#475467] hover:text-[#101828] rounded-lg hover:bg-gray-50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop right side — auth-aware */}
        <div className="hidden md:flex items-center gap-3">
          {status === "loading" ? (
            <div className="h-8 w-20 rounded-full bg-gray-100 animate-pulse" />
          ) : isLoggedIn ? (
            <>
              {isAdmin && (
                <Link href="/admin">
                  <button className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full bg-[#155eef]/5 text-[#155eef] hover:bg-[#155eef]/10 transition-colors">
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Admin Panel
                  </button>
                </Link>
              )}
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 pl-3 pr-1.5 py-1.5 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-[#344054] max-w-[100px] truncate">
                    {session?.user?.name}
                  </span>
                  <div className="h-7 w-7 rounded-full bg-[#155eef] flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-white" />
                  </div>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={false}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-48 rounded-xl bg-white border border-gray-200 shadow-xl shadow-black/[0.08] p-1.5"
                    >
                      <div className="px-3 py-2 border-b border-gray-100 mb-1">
                        <p className="text-xs font-medium text-[#101828] truncate">
                          {session?.user?.name}
                        </p>
                        <p className="text-xs text-[#667085] truncate">
                          {session?.user?.email}
                        </p>
                        <span className="text-xs text-[#155eef] capitalize">{userRole}</span>
                      </div>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#475467] hover:text-[#101828] hover:bg-gray-50 transition-colors"
                        >
                          <LayoutDashboard className="h-3.5 w-3.5" />
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Đăng Xuất
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="text-sm font-medium px-4 py-2 rounded-full text-[#475467] hover:text-[#101828] transition-colors">
                  Đăng Nhập
                </button>
              </Link>
              <Link href="/register">
                <button className="text-sm font-semibold px-5 py-2.5 rounded-full bg-[#155eef] text-white hover:bg-[#0b4fd1] shadow-sm shadow-[#155eef]/20 transition-all">
                  Đăng Ký
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile: auth buttons + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          {status !== "loading" && !isLoggedIn && (
            <>
              <Link href="/login">
                <button className="text-xs font-medium px-3 py-1.5 rounded-full text-[#475467] hover:text-[#101828] transition-colors">
                  Đăng Nhập
                </button>
              </Link>
              <Link href="/register">
                <button className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#155eef] text-white hover:bg-[#0b4fd1] transition-colors">
                  Đăng Ký
                </button>
              </Link>
            </>
          )}
          {isLoggedIn && (
            <div className="h-7 w-7 rounded-full bg-[#155eef] flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {(session?.user?.name || "U").charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center rounded-md p-2 text-[#101828]">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-white border-gray-200">
              <div className="flex flex-col gap-2 mt-8">
                {/* User info (logged in only) */}
                {isLoggedIn && (
                  <div className="px-3 py-3 mb-3 rounded-xl bg-[#155eef]/5 border border-[#155eef]/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-full bg-[#155eef] flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#101828]">
                          {session?.user?.name}
                        </p>
                        <p className="text-xs text-[#667085] capitalize">
                          {userRole}
                        </p>
                      </div>
                    </div>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 text-xs font-medium text-[#155eef] mt-1"
                      >
                        <LayoutDashboard className="h-3 w-3" />
                        Admin Panel
                      </Link>
                    )}
                  </div>
                )}

                {/* Nav links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-2.5 text-base text-[#475467] hover:text-[#101828] hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Logout at bottom */}
                {isLoggedIn && (
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="mt-4 w-full flex items-center justify-center gap-2 rounded-full border border-red-200 text-red-500 py-2.5 text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng Xuất
                  </button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  );
}
