"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const faqs: FaqItem[] = [
  {
    q: "Không biết gì về AI có học được không?",
    a: "Có. Khóa học được thiết kế đặc biệt cho người mất gốc về công nghệ. Team OPA hướng dẫn từ A-Z, từ cách mở app đến cách kiếm tiền. Case study của chúng tôi có cả công nhân sinh năm 1992 — sau 2 tháng đã tự vận hành được kênh TikTok.",
  },
  {
    q: "Học xong có được hỗ trợ không?",
    a: "Có. Bạn được support 3-4 tuần sau khóa qua group chat và Zoom hàng tuần. Team OPA sẽ review video, hỗ trợ troubleshooting, và trả lời mọi câu hỏi. Ngoài ra còn được tham gia cộng đồng OPA Alumni để networking lâu dài và cập nhật trend mới.",
  },
  {
    q: "Thanh toán như thế nào?",
    a: "Thanh toán qua chuyển khoản ngân hàng tích hợp qua PayOS — nền tảng thanh toán được Ngân hàng Nhà nước cấp phép. Có hóa đơn đầy đủ cho cá nhân và doanh nghiệp. An toàn, bảo mật 100%.",
  },
  {
    q: "Học ở đâu? Có online không?",
    a: "Học trực tiếp tại văn phòng OPA AI Labs. Các buổi offline được tổ chức nhóm nhỏ (10-15 người) để đảm bảo chất lượng. Các buổi Zoom support có thể tham gia online từ bất kỳ đâu.",
  },
  {
    q: "Có cam kết đầu ra không?",
    a: "Khóa học tập trung vào thực chiến có thể đo lường được. Với những ai nghiêm túc làm theo lộ trình 21 ngày, kết quả sẽ đến. Team OPA đã có nhiều case thành công từ người hoàn toàn mất gốc. Chúng tôi có hợp đồng cam kết rõ ràng về nội dung và quyền lợi.",
  },
  {
    q: "Tôi đã biết về AI rồi, có nên học không?",
    a: "Nếu bạn đã biết nhưng chưa ra kết quả kiếm tiền thực tế, khóa học giúp bạn: (1) Vá các lỗ hổng tư duy không nhận ra được, (2) Chuẩn lại cách triển khai, (3) Học góc nhìn từ người đang làm ra tiền thật với AI. Nhiều học viên từ background IT/marketing vẫn thu được giá trị lớn từ phần case study và network.",
  },
  {
    q: "Có hoàn tiền không?",
    a: "Có hợp đồng cam kết rõ ràng về nội dung, quyền lợi, và chính sách. Chi tiết về hoàn tiền sẽ được trao đổi cụ thể khi đăng ký. OPA cam kết minh bạch — đây là lý do chúng tôi có hóa đơn đầy đủ cho mọi học viên.",
  },
];

export function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" className="section-gray">
      <div ref={ref} className="section-padding max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="tag">FAQ</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-3 mb-4">
            Câu hỏi{" "}
            <span className="text-gradient-blue">thường gặp</span>
          </h2>
          <p className="text-slate-500">
            Không tìm thấy câu trả lời? Nhắn trực tiếp qua Zalo hoặc Hotline.
          </p>
        </motion.div>

        {/* FAQ list */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-slate-50 transition-colors duration-150"
                aria-expanded={openIndex === i}
              >
                <span className="text-slate-900 font-semibold text-sm leading-relaxed">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === i ? "rotate-180 text-opa-blue" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" as const }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 border-t border-gray-100">
                      <p className="text-slate-600 text-sm leading-relaxed pt-4">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
