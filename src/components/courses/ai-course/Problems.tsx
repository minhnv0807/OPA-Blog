"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  HelpCircle,
  Shuffle,
  Wallet,
  ShieldAlert,
  TrendingUp,
  Bot,
} from "lucide-react";

interface PainPoint {
  icon: React.ElementType;
  title: string;
  description: string;
}

const painPoints: PainPoint[] = [
  {
    icon: HelpCircle,
    title: "Không biết bắt đầu từ đâu với AI",
    description:
      "Nghe nói AI hay lắm nhưng mở lên thì không biết làm gì, cứ loay hoay mãi không tiến được.",
  },
  {
    icon: Shuffle,
    title: "Học lung tung, không ra kết quả",
    description:
      "Xem hàng chục video YouTube, mua vài khóa học nhưng vẫn chưa kiếm được đồng nào từ AI.",
  },
  {
    icon: Wallet,
    title: "Tốn tiền mua tool mà không dùng hiệu quả",
    description:
      "Đăng ký ChatGPT Plus, Midjourney, Canva Pro... nhưng không biết kết hợp để tạo ra thu nhập.",
  },
  {
    icon: ShieldAlert,
    title: "Muốn kiếm tiền online nhưng sợ lừa đảo",
    description:
      "Thị trường đầy rẫy \"thầy\" dạy kiếm tiền online, không biết ai thật ai giả, ai uy tín.",
  },
  {
    icon: TrendingUp,
    title: "Thấy người ta làm TikTok hốt bạc mà không biết cách",
    description:
      "Nhìn kênh người ta triệu view, hàng tháng tiền về đều như lương, mà mình làm thì 0 view.",
  },
  {
    icon: Bot,
    title: "Sợ AI thay thế mình nhưng không biết phải làm gì",
    description:
      "Nghe tin AI sẽ xóa sổ hàng triệu việc làm, lo lắng mà không biết phải chuẩn bị thế nào.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function Problems() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="problems" className="section-gray">
      <div className="section-padding" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="tag mb-3">VẤN ĐỀ BẠN ĐANG GẶP</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
            Bạn có đang gặp{" "}
            <span className="text-gradient-blue">những vấn đề này?</span>
          </h2>
          <p className="text-slate-600 text-lg mt-4 max-w-xl mx-auto">
            Nếu có 1 trong số này — bạn đang ở đúng chỗ rồi.
          </p>
        </motion.div>

        {/* Pain point cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10"
        >
          {painPoints.map((point) => (
            <motion.div
              key={point.title}
              variants={cardVariants}
              className="card group transition-all duration-300 cursor-default"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-opa-blue group-hover:border-opa-blue transition-colors duration-300">
                  <point.icon className="w-5 h-5 text-opa-blue group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug mb-1.5">
                    {point.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-blue-50 border border-blue-100 rounded-2xl px-8 py-6 text-center max-w-3xl mx-auto"
        >
          <p className="text-slate-700 text-base md:text-lg font-medium leading-relaxed">
            <span className="font-bold text-opa-blue">99% người bắt đầu</span>{" "}
            đều như vậy — bạn không cô đơn. Vấn đề không phải ở bạn, mà là
            chưa có{" "}
            <span className="font-semibold text-slate-900">
              lộ trình đúng + hướng dẫn thực chiến
            </span>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
}
