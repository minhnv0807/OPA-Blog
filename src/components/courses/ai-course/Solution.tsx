"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Play } from "lucide-react";

const featurePills: string[] = [
  "Tạo video AI không cần quay mặt",
  "Xây kênh TikTok từ 0",
  "Kiếm tiền Affiliate thực chiến",
  "Case study 1 tỷ/tháng",
];

export function Solution() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="solution" className="section-white">
      <div className="section-padding" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="tag mb-3">GIẢI PHÁP</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
            Giới thiệu khóa học{" "}
            <span className="text-gradient-blue">AI KIẾM TIỀN THỰC CHIẾN</span>
          </h2>
          <p className="text-slate-600 text-lg mt-4 max-w-2xl mx-auto">
            Khóa học duy nhất tại Việt Nam dạy bạn kiếm tiền thực tế với AI —
            không lý thuyết, không vòng vo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Video placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            {/* Video container */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-gray-200">
              {/* Subtle gradient backdrop */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-100" />

              {/* Play button */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <button className="w-20 h-20 rounded-full bg-white border-2 border-opa-blue shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-300 group">
                  <Play className="w-8 h-8 text-opa-blue ml-1 group-hover:text-opa-orange transition-colors duration-200" />
                </button>
                <p className="text-slate-400 text-sm font-medium">
                  Xem giới thiệu khóa học
                </p>
              </div>

              {/* Corner label */}
              <div className="absolute top-4 left-4 bg-white border border-gray-200 rounded-full px-3 py-1 text-xs text-slate-600 font-medium shadow-sm">
                3 phút xem
              </div>
            </div>

            {/* Floating stats */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}
              className="absolute -bottom-4 -left-4 bg-white border border-gray-200 rounded-xl p-3 shadow-md"
            >
              <div className="text-2xl font-black text-gradient-blue">30K</div>
              <div className="text-xs text-slate-500 mt-0.5">Follow trong 60 ngày</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" as const }}
              className="absolute -top-4 -right-4 bg-white border border-gray-200 rounded-xl p-3 shadow-md"
            >
              <div className="text-2xl font-black text-gradient-orange">1 tỷ</div>
              <div className="text-xs text-slate-500 mt-0.5">Doanh thu/tháng</div>
            </motion.div>
          </motion.div>

          {/* Right: Features */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-col gap-6"
          >
            {/* Feature pills */}
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-4">
                Bạn sẽ học được
              </p>
              <div className="flex flex-wrap gap-3">
                {featurePills.map((pill, i) => (
                  <motion.span
                    key={pill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.35, delay: 0.35 + i * 0.08 }}
                    className="inline-flex items-center rounded-full bg-blue-50 border border-blue-100 text-opa-blue text-sm font-medium px-4 py-2"
                  >
                    {pill}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Key benefits */}
            <div className="space-y-3">
              {[
                {
                  label: "Thực chiến 100%",
                  desc: "Không lý thuyết suông — mỗi buổi học là mỗi kết quả thực tế.",
                },
                {
                  label: "Không cần quay mặt",
                  desc: "AI tạo toàn bộ video, giọng đọc, hình ảnh — bạn chỉ cần hướng dẫn.",
                },
                {
                  label: "Support sau khóa",
                  desc: "Hỗ trợ 3–4 tuần sau khi hoàn thành để đảm bảo bạn ra kết quả.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-opa-blue flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">{item.label}</span>
                    <span className="text-slate-600"> — {item.desc}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Instructor badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.75 }}
              className="bg-slate-50 border border-gray-200 rounded-2xl p-4 flex items-center gap-4"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
                <span className="text-opa-blue font-black text-base">VM</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-slate-900">Văn Minh</p>
                  <span className="badge text-xs px-2 py-0.5">CEO</span>
                </div>
                <p className="text-slate-500 text-sm mt-0.5">
                  CEO OPA AI Labs — Giảng dạy trực tiếp
                </p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
