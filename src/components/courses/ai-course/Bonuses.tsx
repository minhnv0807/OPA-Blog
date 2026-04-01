"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface Bonus {
  emoji: string;
  title: string;
  description: string;
  value: string;
  highlight: boolean;
}

const bonuses: Bonus[] = [
  {
    emoji: "🔥",
    title: "Truy cập Xưởng Media & Tool độc quyền",
    description:
      "Platform tạo video AI chỉ 10k/video — tiết kiệm 70% chi phí so với dùng tool trực tiếp",
    value: "10.000.000đ",
    highlight: true,
  },
  {
    emoji: "📚",
    title: "Tài liệu + Slide + Video",
    description:
      "Slide bài giảng + Video step-by-step xem lại không giới hạn thời gian",
    value: "~50.000.000đ",
    highlight: false,
  },
  {
    emoji: "👥",
    title: "Cộng Đồng OPA AI Labs",
    description:
      "Group kín, networking với 100+ học viên đang kiếm tiền cùng AI. Cập nhật trend mới nhất.",
    value: "Vô giá",
    highlight: false,
  },
  {
    emoji: "🎯",
    title: "Template Prompt + Workflow + Skill",
    description:
      "Bộ template đã test thực chiến qua 1000+ lần dùng. Copy-paste là chạy ngay.",
    value: "~100.000.000đ",
    highlight: false,
  },
];

export function Bonuses() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="bonuses" className="section-white">
      <div ref={ref} className="section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="tag">BONUS</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-3 mb-4">
            🎁 Bonus độc quyền{" "}
            <span className="text-gradient-blue">khi đăng ký</span>
          </h2>
          <p className="text-slate-600 text-lg">
            Những thứ này sẽ giúp bạn bắt đầu nhanh hơn 10 lần
          </p>
        </motion.div>

        {/* Bonus cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {bonuses.map((bonus, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`card relative overflow-hidden ${
                bonus.highlight
                  ? "border-orange-200 ring-1 ring-orange-100"
                  : ""
              }`}
            >
              {bonus.highlight && (
                <div className="absolute top-0 right-0 bg-opa-orange text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                  PHỔ BIẾN
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="text-4xl leading-none">{bonus.emoji}</div>
                <div className="flex-grow">
                  <h3 className="text-slate-900 font-bold text-lg mb-1">
                    {bonus.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {bonus.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-slate-400 text-sm">Giá trị:</span>
                <span className="text-opa-blue font-bold text-sm">
                  {bonus.value}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total value banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-blue-50 border border-blue-100 rounded-2xl text-center p-8"
        >
          <p className="text-slate-500 text-sm mb-2">Tổng giá trị bonus:</p>
          <p className="text-4xl font-black text-gradient-blue mb-2">
            ~160.000.000đ
          </p>
          <p className="text-xl text-slate-900 font-semibold">
            MIỄN PHÍ 100% khi đăng ký bất kỳ gói nào
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Không cần mã giảm giá. Không cần điều kiện. Đăng ký là có.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
