"use client";

import { motion } from "framer-motion";
import { ArrowDown, Shield, Clock, Star } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" as const },
  }),
};

const stats = [
  {
    value: "1 tỷ+/tháng",
    label: "Doanh thu",
    sub: "Case study thực tế",
  },
  {
    value: "10p/video",
    label: "Sau 1 tuần có kết quả",
    sub: "Cam kết thực chiến",
  },
  {
    value: "100%",
    label: "Thực hành",
    sub: "Không lý thuyết suông",
  },
];

const trustBadges = [
  { icon: Shield, text: "Hợp đồng + Hóa đơn đầy đủ" },
  { icon: Clock, text: "Support 3–4 tuần sau khóa" },
  { icon: Star, text: "Giảng dạy bởi CEO trực tiếp" },
];

export function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero-bg relative min-h-screen flex items-center pt-24 overflow-hidden">
      <div className="section-padding w-full">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <motion.div
            variants={fadeUp}
            initial={false}
            animate="show"
            custom={0}
            className="inline-flex items-center gap-2 badge mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
            <span className="text-sm text-slate-700 font-medium">
              🔥 Đang mở đăng ký đợt học tuần này
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={fadeUp}
            initial={false}
            animate="show"
            custom={0.1}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tight"
          >
            <span className="text-gradient-blue">AI KIẾM TIỀN</span>
            <br />
            <span className="text-slate-900">THỰC CHIẾN</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            initial={false}
            animate="show"
            custom={0.2}
            className="text-lg md:text-xl lg:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Từ{" "}
            <span className="text-slate-900 font-bold">0 đến 30K Follow</span>{" "}
            trong{" "}
            <span className="text-[#155eef] font-bold">2 tuần</span>
            <br className="hidden sm:block" />
            {" "}Bằng AI, không cần quay mặt
          </motion.p>

          {/* Stats row */}
          <motion.div
            variants={fadeUp}
            initial={false}
            animate="show"
            custom={0.3}
            className="grid grid-cols-3 gap-3 md:gap-4 max-w-2xl mx-auto mb-12"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="card text-center py-5 px-3"
              >
                <div className="text-xl md:text-2xl lg:text-3xl font-black text-gradient-blue leading-tight">
                  {stat.value}
                </div>
                <div className="text-slate-800 font-semibold text-xs md:text-sm mt-1">
                  {stat.label}
                </div>
                <div className="text-slate-400 text-xs mt-1 hidden sm:block">
                  {stat.sub}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            initial={false}
            animate="show"
            custom={0.4}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <button
              onClick={() => scrollTo("pricing")}
              className="btn-primary text-base px-8 py-4 font-bold shadow-lg shadow-[#FF6B00]/20"
            >
              ĐĂNG KÝ GÓI 10TR →
            </button>
            <button
              onClick={() => scrollTo("curriculum")}
              className="btn-secondary text-base px-8 py-4 font-semibold"
            >
              Xem chi tiết
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={fadeUp}
            initial={false}
            animate="show"
            custom={0.5}
            className="flex flex-wrap justify-center gap-x-6 gap-y-3"
          >
            {trustBadges.map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-slate-600 text-sm"
              >
                <badge.icon className="w-4 h-4 text-[#155eef] flex-shrink-0" />
                <span>{badge.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
        >
          <ArrowDown className="w-6 h-6 text-slate-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
