"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Robot({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  const bodyColor = isLeft ? "#155eef" : "#2970ff";
  const eyeAnim = isLeft
    ? { x: [0, 2, 0, -2, 0] }
    : { x: [0, -2, 0, 2, 0] };

  return (
    <motion.svg
      width="100"
      height="120"
      viewBox="0 0 100 120"
      fill="none"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: isLeft ? 0 : 0.5 }}
    >
      {/* Antenna */}
      <motion.circle
        cx="50" cy="8" r="5"
        fill={bodyColor}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <line x1="50" y1="13" x2="50" y2="28" stroke={bodyColor} strokeWidth="2" />

      {/* Head */}
      <rect x="22" y="28" width="56" height="40" rx="12" fill={bodyColor} />

      {/* Eyes */}
      <rect x="32" y="40" width="14" height="14" rx="4" fill="white" />
      <rect x="54" y="40" width="14" height="14" rx="4" fill="white" />
      <motion.circle
        cx="39" cy="47" r="3" fill="#101828"
        animate={eyeAnim}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="61" cy="47" r="3" fill="#101828"
        animate={eyeAnim}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Mouth */}
      <motion.rect
        x="38" y="58" width="24" height="4" rx="2" fill="white" opacity="0.7"
        animate={{ width: [24, 18, 24] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Body */}
      <rect x="28" y="72" width="44" height="30" rx="8" fill={bodyColor} opacity="0.85" />

      {/* Body light */}
      <motion.circle
        cx="50" cy="87" r="4"
        fill="#5c9cfc"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Arms */}
      <motion.rect
        x={isLeft ? "10" : "8"}
        y="76"
        width="14"
        height="6"
        rx="3"
        fill={bodyColor}
        opacity="0.7"
        animate={{ rotate: isLeft ? [0, -15, 0] : [0, 15, 0] }}
        style={{ originX: isLeft ? "24px" : "22px", originY: "79px" }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.rect
        x={isLeft ? "76" : "78"}
        y="76"
        width="14"
        height="6"
        rx="3"
        fill={bodyColor}
        opacity="0.7"
        animate={{ rotate: isLeft ? [0, 15, 0] : [0, -15, 0] }}
        style={{ originX: isLeft ? "76px" : "78px", originY: "79px" }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />

      {/* Feet */}
      <rect x="32" y="104" width="14" height="8" rx="4" fill={bodyColor} opacity="0.6" />
      <rect x="54" y="104" width="14" height="8" rx="4" fill={bodyColor} opacity="0.6" />
    </motion.svg>
  );
}

function SpeechBubble({
  text,
  side,
  delay,
}: {
  text: string;
  side: "left" | "right";
  delay: number;
}) {
  const isLeft = side === "left";
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "backOut" }}
      className={`relative bg-white rounded-2xl px-4 py-3 shadow-md border border-gray-100 max-w-[180px] ${
        isLeft ? "rounded-bl-sm" : "rounded-br-sm"
      }`}
    >
      <p className="text-xs text-[#344054] leading-relaxed font-medium">{text}</p>
      {/* Tail */}
      <div
        className={`absolute -bottom-2 ${isLeft ? "left-4" : "right-4"} w-4 h-4 bg-white border-b border-r border-gray-100 rotate-45`}
      />
    </motion.div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Email hoặc mật khẩu không đúng");
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#f8fafc] overflow-hidden">
      <div className="relative w-full max-w-4xl flex items-center justify-center">
        {/* Left robot */}
        <div className="hidden lg:flex flex-col items-center gap-4 mr-8">
          <SpeechBubble
            text="Biết tìm giải pháp AI ở đâu chưa?"
            side="left"
            delay={0.5}
          />
          <Robot side="left" />
        </div>

        {/* Login form */}
        <div className="w-full max-w-sm shrink-0">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg shadow-black/[0.04]">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
                <span className="text-gradient">OPA</span> Login
              </h1>
              <p className="text-sm text-[#667085] mt-2">
                Đăng nhập để quản lý blog
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="text-sm font-medium text-[#344054] mb-1.5 block">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@opa.vn"
                  required
                  className="border-gray-300 bg-white focus:border-[#155eef] focus:ring-1 focus:ring-[#155eef]/20"
                />
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium text-[#344054] mb-1.5 block">
                  Mật khẩu
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  required
                  className="border-gray-300 bg-white focus:border-[#155eef] focus:ring-1 focus:ring-[#155eef]/20"
                />
              </div>

              <Button type="submit" className="w-full gap-2 bg-[#155eef] hover:bg-[#0b4fd1]" disabled={loading}>
                <LogIn className="h-4 w-4" />
                {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
              </Button>
            </form>

            <p className="text-center text-sm text-[#667085] mt-6">
              Chưa có tài khoản?{" "}
              <Link href="/register" className="text-[#155eef] font-medium hover:underline">
                Đăng Ký
              </Link>
            </p>
          </div>
        </div>

        {/* Right robot */}
        <div className="hidden lg:flex flex-col items-center gap-4 ml-8">
          <SpeechBubble
            text="Ở OPA chứ ở đâu! 🚀"
            side="right"
            delay={1.5}
          />
          <Robot side="right" />
        </div>
      </div>
    </div>
  );
}
