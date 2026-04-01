"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";

interface Achievement {
  text: string;
}

const achievements: Achievement[] = [
  { text: "Founder Over Powers Agency — Agency Marketing kết hợp AI Labs" },
  { text: "Xây dựng xuongmedia.com — Platform tạo video AI hàng đầu VN" },
  { text: "10+ năm kinh nghiệm Digital Marketing & Automation" },
  { text: "Đào tạo 100+ học viên về AI thực chiến, ra kết quả thật" },
];

export function Instructor() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="instructor" className="section-white">
      <div ref={ref} className="section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="tag">SPEAKER</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-3">
            ai sẽ{" "}
            <span className="text-gradient-blue">cầm tay chỉ việc bạn</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Left: Avatar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-slate-100">
                <Image
                  src="/speaker-avatar.jpg"
                  alt="Văn Minh"
                  fill
                  priority
                  className="object-cover object-[center_18%]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-900/25 to-transparent px-5 py-5">
                  <p className="text-white font-bold text-xl leading-tight">
                    Văn Minh
                  </p>
                  <p className="text-white/80 text-sm">CEO OPA AI Labs</p>
                </div>
              </div>

              {/* Floating badge — years */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}
                className="absolute -bottom-4 -right-4 bg-white border border-gray-200 rounded-xl p-3 shadow-md"
              >
                <div className="text-xl font-black text-gradient-orange leading-none">
                  10+
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Năm kinh nghiệm</div>
              </motion.div>

              {/* Floating badge — students */}
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" as const }}
                className="absolute -top-4 -left-4 bg-white border border-gray-200 rounded-xl p-3 shadow-md"
              >
                <div className="text-xl font-black text-gradient-blue leading-none">
                  100+
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Học viên</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              Văn Minh
            </h3>
            <p className="text-opa-blue font-semibold mb-7">
              CEO &amp; Founder — OPA AI Labs
            </p>

            <div className="space-y-4 mb-8">
              {achievements.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-opa-blue" />
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Quote */}
            <motion.blockquote
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.85 }}
              className="bg-blue-50 border-l-4 border-opa-blue rounded-r-xl p-5"
            >
              <p className="text-slate-700 text-sm leading-relaxed italic">
                &quot;Tôi không dạy lý thuyết. Tôi chia sẻ những gì team tôi đang
                làm mỗi ngày để ra{" "}
                <span className="text-opa-orange font-bold not-italic">
                  1 tỷ/tháng
                </span>
                . Học từ người đang thực chiến — không phải từ người chỉ biết
                nói.&quot;
              </p>
            </motion.blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
