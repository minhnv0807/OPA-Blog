"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface CaseStudy {
  initials: string;
  name: string;
  label: string;
  quote: string;
  result: string;
  resultUnit: string;
  detail: string;
  badge: string;
}

const cases: CaseStudy[] = [
  {
    initials: "TV",
    name: "Anh T.V",
    label: "Công nhân, sinh năm 1992",
    quote:
      "Không biết gì về công nghệ. Sau 2 tháng làm cùng team OPA, tôi đã tự vận hành được kênh TikTok của mình.",
    result: "30K",
    resultUnit: "Follow",
    detail: "Chi phí chỉ 3–5 triệu · 100% organic · không buff",
    badge: "organic growth",
  },
  {
    initials: "HN",
    name: "Bạn H.N",
    label: "Sinh viên 2K4",
    quote:
      "Ban đầu loay hoay không biết bắt đầu từ đâu. Sau 2 tuần học xong, mỗi ngày mình ra 1 sản phẩm.",
    result: "1",
    resultUnit: "Product/ngày",
    detail: "Mỗi ngày 1 repo GitHub · mỗi ngày 1 sản phẩm AI",
    badge: "productivity",
  },
  {
    initials: "OPA",
    name: "Team OPA Internal",
    label: "Kênh review sản phẩm",
    quote:
      "Kênh review sản phẩm không cần người quay. Workflow tạo 10 video/ngày với AI hoàn toàn tự động.",
    result: "1 tỷ",
    resultUnit: "/tháng",
    detail: "10 video/ngày · vận hành tự động với AI",
    badge: "automation",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function CaseStudies() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="proof" className="section-gray">
      <div className="section-padding" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="tag mb-3">KẾT QUẢ THỰC TẾ</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
            Người thật —{" "}
            <span className="text-gradient-blue">Việc thật</span> — Kết quả
            thật
          </h2>
          <p className="text-slate-600 text-lg mt-4 max-w-2xl mx-auto">
            Không phải testimonial giả. Đây là case study từ người thật đã làm
            cùng OPA.
          </p>
        </motion.div>

        {/* Case study cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {cases.map((c) => (
            <motion.div
              key={c.name}
              variants={cardVariants}
              className="card flex flex-col hover:shadow-md transition-shadow duration-300"
            >
              {/* Avatar + name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center">
                  <span className="text-sm font-black text-slate-600">
                    {c.initials}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{c.name}</p>
                  <span className="text-xs text-slate-400">{c.label}</span>
                </div>
              </div>

              {/* Quote */}
              <p className="text-slate-600 text-sm leading-relaxed italic flex-grow mb-5">
                &quot;{c.quote}&quot;
              </p>

              {/* Result */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-3xl font-black text-gradient-blue">
                    {c.result}
                  </span>
                  <span className="text-base font-bold text-opa-blue">
                    {c.resultUnit}
                  </span>
                </div>
                <p className="text-slate-400 text-xs">{c.detail}</p>
              </div>

              {/* Badge */}
              <span className="mt-3 self-start badge text-xs px-2.5 py-0.5">
                #{c.badge}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="text-center"
        >
          <p className="text-slate-600 text-lg font-medium">
            Bạn cũng có thể làm được như họ
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Tất cả đều bắt đầu từ con số 0. Điều khác biệt là họ có đúng người
            dẫn dắt.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
