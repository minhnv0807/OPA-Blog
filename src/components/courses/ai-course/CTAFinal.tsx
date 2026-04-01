"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Phone, MessageCircle, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export function CTAFinal() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const router = useRouter();

  return (
    <section
      id="cta-final"
      className="relative bg-opa-blue py-20 md:py-32 overflow-hidden"
    >
      {/* Subtle radial glow for depth */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 65%)",
        }}
      />

      <div ref={ref} className="relative z-10 section-padding text-center">
        {/* Urgency badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-10"
        >
          <Zap className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-semibold tracking-wide">
            ⚡ HÀNH ĐỘNG NGAY
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
        >
          Sẵn sàng thay đổi
          <br />
          cuộc chơi?
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Đừng để AI thay thế bạn.{" "}
          <span className="text-white font-semibold">
            Hãy dùng AI để vượt lên.
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <button
              onClick={() => router.push("/khoa-hoc-ai/checkout?package=10tr")}
            className="bg-white text-opa-blue font-bold px-8 py-4 rounded-xl text-lg
                       hover:bg-blue-50 transition-all duration-200 hover:scale-105 active:scale-95
                       shadow-lg shadow-blue-900/20"
          >
            ĐĂNG KÝ GÓI 10TR
          </button>
          <button
              onClick={() => router.push("/khoa-hoc-ai/checkout?package=15tr")}
            className="bg-opa-orange text-white font-bold px-8 py-4 rounded-xl text-lg
                       hover:bg-orange-500 transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ boxShadow: "0 4px 20px rgba(255,107,0,0.45)" }}
          >
            ĐĂNG KÝ GÓI 15TR →
          </button>
        </motion.div>

        {/* Urgency line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-blue-200 text-sm font-medium mb-10"
        >
          ⚡ Chỉ còn 20 slot cho đợt học tuần này
        </motion.p>

        {/* Contact row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-6 text-sm"
        >
          <a
            href="tel:0848508585"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <Phone className="w-4 h-4 text-white/60" />
            <span>Hotline: 0848508585</span>
          </a>
          <a
            href="https://zalo.me/0848508585"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-white/60" />
            <span>Zalo: 0848508585</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
