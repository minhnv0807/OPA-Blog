"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const socials = [
  { icon: FacebookIcon, href: "https://facebook.com/overpowersagency", label: "Facebook" },
  { icon: XIcon, href: "#", label: "X" },
  { icon: LinkedinIcon, href: "#", label: "LinkedIn" },
];

const footerLinks = {
  "Trang": [
    { label: "Trang Chủ", href: "/" },
    { label: "Dịch Vụ", href: "/services" },
    { label: "Blog", href: "/blog" },
    { label: "Giới Thiệu", href: "/about" },
    { label: "Liên Hệ", href: "/contact" },
  ],
  "Dịch Vụ": [
    { label: "Marketing", href: "/services" },
    { label: "Công Nghệ", href: "/services" },
    { label: "AI Solutions", href: "/services" },
    { label: "Đào Tạo", href: "/services" },
    { label: "Affiliate", href: "/services" },
  ],
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setSubscribed(true);
        setEmail("");
        setTimeout(() => setSubscribed(false), 3000);
      }
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#101828]">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8">
        {/* Top section */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Brand + Contact */}
          <div className="md:col-span-5">
            <Link href="/" className="text-2xl font-bold font-[family-name:var(--font-heading)]">
              <span className="text-white">OPA</span>
            </Link>
            <p className="mt-4 text-sm text-gray-400 max-w-sm leading-relaxed">
              Đối tác công nghệ AI giúp doanh nghiệp Việt Nam tăng trưởng bền vững trong kỷ nguyên số.
            </p>

            {/* Contact info */}
            <div className="mt-6 space-y-3">
              <a href="mailto:overpowersagency@gmail.com" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/5">
                  <Mail className="h-3.5 w-3.5 text-[#155eef]" />
                </div>
                overpowersagency@gmail.com
              </a>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/5">
                  <Phone className="h-3.5 w-3.5 text-[#155eef]" />
                </div>
                0909 xxx xxx
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/5">
                  <MapPin className="h-3.5 w-3.5 text-[#155eef]" />
                </div>
                TP. Hồ Chí Minh, Việt Nam
              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-2 mt-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex items-center justify-center h-9 w-9 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="md:col-span-2">
              <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">
              Nhận Tin Mới
            </h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Đăng ký để nhận bài viết mới nhất về AI, Marketing và Công nghệ.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#155eef] focus:ring-1 focus:ring-[#155eef]/30 transition-colors"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-[#155eef] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2970ff] transition-colors"
              >
                {subscribed ? "Đã đăng ký!" : submitting ? "Đang gửi..." : "Đăng Ký Nhận Tin"}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} OverPowers Agency. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Điều Khoản
            </Link>
            <Link href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Bảo Mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
