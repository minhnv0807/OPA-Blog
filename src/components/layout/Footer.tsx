"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
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
  { icon: XIcon, href: "#", label: "X" },
  { icon: GithubIcon, href: "#", label: "GitHub" },
  { icon: LinkedinIcon, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "mailto:hello@opa.blog", label: "Email" },
];

const footerLinks = {
  "Dịch Vụ": [
    { label: "Marketing", href: "/#services" },
    { label: "Công Nghệ", href: "/#services" },
    { label: "AI Solutions", href: "/#services" },
    { label: "Đào Tạo", href: "/#services" },
  ],
  "Về Chúng Tôi": [
    { label: "Đội Ngũ", href: "/#about" },
    { label: "Blog", href: "/blog" },
    { label: "Liên Hệ", href: "/#contact" },
  ],
  "Tài Nguyên": [
    { label: "Tài Liệu", href: "#" },
    { label: "Case Study", href: "#" },
    { label: "Cộng Đồng", href: "#" },
    { label: "Câu Hỏi", href: "/#faq" },
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
      // silently fail for newsletter
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand + Newsletter */}
          <div className="col-span-2">
            <Link href="/" className="text-xl font-bold font-[family-name:var(--font-heading)]">
              <span className="text-[#155eef]">OPA</span>
            </Link>
            <p className="mt-4 text-sm text-[#667085] max-w-xs leading-relaxed">
              Đối tác công nghệ AI giúp doanh nghiệp Việt Nam tăng trưởng bền vững trong kỷ nguyên số.
            </p>
            <div className="flex gap-3 mt-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="p-2 rounded-lg text-[#98a2b3] hover:text-[#101828] hover:bg-gray-50 transition-colors"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="mt-8">
              <p className="text-xs font-semibold text-[#344054] mb-3 uppercase tracking-wider">
                Đăng ký nhận tin
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="flex-1 min-w-0 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-[#101828] placeholder:text-[#98a2b3] focus:outline-none focus:border-[#155eef] focus:ring-1 focus:ring-[#155eef]/20 transition-colors"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-[#155eef] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0b4fd1] transition-colors shadow-sm sm:w-auto"
                >
                  {subscribed ? "Đã gửi!" : submitting ? "..." : "Đăng ký"}
                </button>
              </form>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-semibold text-[#101828] mb-4 uppercase tracking-wider">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#667085] hover:text-[#101828] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10 bg-gray-100" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#98a2b3]">
            &copy; {new Date().getFullYear()} OPA Blog. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-[#98a2b3] hover:text-[#667085] transition-colors">
              Điều Khoản
            </Link>
            <Link href="#" className="text-xs text-[#98a2b3] hover:text-[#667085] transition-colors">
              Bảo Mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
