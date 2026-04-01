"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

const features10: string[] = [
  "2 buổi offline (6-8 tiếng tổng)",
  "3 tuần support sau khóa",
  "1 buổi Zoom/tuần",
  "Video AI + Motion Control",
  "TikTok Affiliate thực chiến",
  "Truy cập Xưởng Media",
  "Tài liệu + Video hướng dẫn",
  "Cộng đồng OPA Alumni",
];

const features15: string[] = [
  "Tất cả quyền lợi gói 10TR",
  "Vibecode + Claude Code setup",
  "AI Agent (OpenClaw, n8n)",
  "Build Web App + Bot hoàn chỉnh",
  "Code review 1-1",
];

export function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const router = useRouter();

  const goToCheckout = (pkg: string) => {
    router.push(`/khoa-hoc-ai/checkout?package=${pkg}`);
  };

  return (
    <section id="pricing" className="section-gray">
      <div ref={ref} className="section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="tag">HỌC PHÍ</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-3 mb-4">
            Chọn gói{" "}
            <span className="text-gradient-blue">phù hợp với bạn</span>
          </h2>
          <p className="text-slate-500 text-lg">
            Chỉ nhận{" "}
            <span className="font-semibold text-slate-700">10-15 slot</span>{" "}
            mỗi tuần để đảm bảo chất lượng
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card 10TR */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card flex flex-col"
          >
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
                Gói cơ bản
              </p>
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                AI KIẾM TIỀN
              </h3>
              <p className="text-slate-600 text-sm">
                Phù hợp người mới, muốn kiếm tiền nhanh với TikTok + Video AI
              </p>
            </div>

            <div className="mb-8">
              <span className="text-4xl font-black text-opa-blue">
                10.000.000đ
              </span>
              <p className="text-slate-400 text-sm mt-1">Một lần thanh toán</p>
            </div>

            <ul className="space-y-3 flex-grow mb-8">
              {features10.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-opa-blue flex-shrink-0" />
                  <span className="text-slate-700">{f}</span>
                </li>
              ))}
            </ul>

            <button
              id="checkout-10tr"
              onClick={() => goToCheckout("10tr")}
              className="btn-secondary w-full text-center"
            >
              ĐĂNG KÝ NGAY
            </button>
          </motion.div>

          {/* Card 15TR - RECOMMENDED */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="relative card-blue flex flex-col glow-blue"
          >
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-opa-blue text-white text-xs font-bold px-5 py-1.5 rounded-full whitespace-nowrap shadow-md">
                ⭐ PHỔ BIẾN NHẤT
              </span>
            </div>

            <div className="mb-6 mt-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-opa-blue mb-2">
                Gói nâng cao
              </p>
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                FULL STACK AI
              </h3>
              <p className="text-slate-600 text-sm">
                Muốn tự build sản phẩm, tạo thu nhập bền vững từ AI
              </p>
            </div>

            <div className="mb-8">
              <span className="text-4xl font-black text-opa-blue">
                15.000.000đ
              </span>
              <p className="text-slate-400 text-sm mt-1">Một lần thanh toán</p>
            </div>

            {/* All 10TR features */}
            <ul className="space-y-3 flex-grow mb-8">
              {features10.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-opa-blue flex-shrink-0" />
                  <span className="text-slate-700">{f}</span>
                </li>
              ))}
              {/* Extra 15TR features */}
              {features15.slice(1).map((f, i) => (
                <li key={`extra-${i}`} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-opa-orange flex-shrink-0" />
                  <span className="text-slate-800 font-medium">{f}</span>
                </li>
              ))}
            </ul>

            <button
              id="checkout-15tr"
              onClick={() => goToCheckout("15tr")}
              className="btn-primary w-full text-center"
            >
              ĐĂNG KÝ FULL →
            </button>
          </motion.div>
        </div>

        {/* Group discount banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="max-w-4xl mx-auto mt-8"
        >
          <div className="bg-orange-50 border border-orange-100 rounded-xl px-6 py-4 text-center text-orange-700 font-medium text-sm">
            🎉 Giảm{" "}
            <span className="font-black text-opa-orange">50%</span> khi đăng ký
            theo nhóm 2 người trở lên
          </div>
        </motion.div>

        {/* Reassurance */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="text-center text-slate-400 text-sm mt-6"
        >
          🔒 Thanh toán an toàn qua PayOS · Có hóa đơn cho cá nhân &amp;
          doanh nghiệp · Hợp đồng rõ ràng
        </motion.p>
      </div>
    </section>
  );
}
