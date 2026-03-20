"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Check, Zap, CircleDot } from "lucide-react";

const manualSteps = [
  { text: "Tạo bảng tính lead", desc: "Thu thập thủ công từ nhiều nguồn, sắp xếp vào spreadsheet." },
  { text: "Tìm email hợp lệ", desc: "Kiểm tra từng email, loại bỏ địa chỉ không hợp lệ." },
  { text: "Soạn cold email", desc: "Viết email outreach cho từng nhóm đối tượng." },
  { text: "Lên lịch gửi hàng loạt", desc: "Cấu hình chiến dịch email, gửi theo batch." },
  { text: "Chờ phản hồi", desc: "Ngồi chờ, đôi khi vài ngày mới có người reply." },
  { text: "Follow-up thủ công", desc: "Quay lại spreadsheet, xác định ai cần follow-up." },
  { text: "Đánh giá chất lượng lead", desc: "Gọi điện từng người để xác định mức độ quan tâm." },
  { text: "Qua lại đặt lịch", desc: "Trao đổi qua lại email để tìm thời gian phù hợp." },
  { text: "Cập nhật CRM", desc: "Nhập thủ công mọi thông tin vào hệ thống CRM." },
  { text: "Cuối cùng cũng xong", desc: "Sau nhiều bước thủ công, cuối cùng cũng chốt được meeting." },
];

const aiSteps = [
  { text: "Kết nối CRM của bạn", desc: "Tích hợp CRM hiện tại, AI tự đồng bộ dữ liệu." },
  { text: "AI chấm điểm & cá nhân hoá lead", desc: "AI phân tích dữ liệu, xếp hạng lead theo mức độ tiềm năng." },
  { text: "Tự động follow-up thông minh", desc: "AI gửi follow-up đúng thời điểm, đúng nội dung." },
  { text: "Lịch được đặt — meeting booked", desc: "AI tự xử lý đặt lịch, xác nhận, nhắc nhở — không cần thao tác." },
];

export function Comparison() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headingY = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -30]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const leftX = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [-40, 0, 0, -20]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const rightX = useTransform(scrollYProgress, [0.05, 0.3, 0.75, 1], [40, 0, 0, 20]);
  const rightOpacity = useTransform(scrollYProgress, [0.05, 0.25, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef} id="comparison" className="py-24 px-6 bg-[#f8fafc]">
      <div className="mx-auto max-w-5xl">
        <motion.div style={{ y: headingY, opacity: headingOpacity }} className="text-center mb-4">
          <p className="text-sm font-medium text-[#155eef] mb-3 tracking-wide uppercase">
            Sự Khác Biệt
          </p>
          <p className="text-sm text-[#667085] mb-2">Quy trình thủ công → AI tự động</p>
          <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-heading)] text-[#101828]">
            Cách cũ vs <span className="text-[#155eef]">Cách OPA</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {/* Manual */}
          <motion.div style={{ x: leftX, opacity: leftOpacity }}>
            <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-[#101828]">Quy Trình Thủ Công</h3>
                  <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-[#475467]">
                    Xong rồi
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1">
                  <span className="text-sm font-bold text-[#101828]">120</span>
                  <span className="text-xs text-[#667085]">Giờ</span>
                </div>
              </div>
              <div className="p-4">
                <div className="rounded-xl border border-gray-100 divide-y divide-gray-100">
                  {manualSteps.map((step, i) => (
                    <div key={i} className="px-4 py-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CircleDot className="h-4 w-4 text-gray-300 shrink-0" />
                          <span className="text-sm text-[#344054]">{i + 1}. {step.text}</span>
                        </div>
                        <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3 text-gray-400" />
                        </div>
                      </div>
                      <p className="text-xs text-[#98a2b3] mt-1.5 ml-7 leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#98a2b3] mt-4 px-2 leading-relaxed italic">
                  Sau nhiều bước thủ công, lặp đi lặp lại và chờ đợi, cuối cùng cũng chốt được meeting với khách hàng.
                </p>
              </div>
            </div>
          </motion.div>

          {/* AI */}
          <motion.div style={{ x: rightX, opacity: rightOpacity }}>
            <div className="rounded-2xl bg-white border-2 border-[#155eef]/20 overflow-hidden shadow-[0_1px_3px_rgba(21,94,239,0.08)]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#155eef]/10 bg-[#155eef]/[0.02]">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-[#101828]">OPA AI Process</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#155eef] px-3 py-1 text-xs font-semibold text-white">
                    <Zap className="h-3 w-3" />
                    Done
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-[#eff6ff] px-3 py-1">
                  <span className="text-sm font-bold text-[#155eef]">15</span>
                  <span className="text-xs text-[#155eef]">Phút</span>
                </div>
              </div>
              <div className="p-4">
                <div className="rounded-xl border border-[#155eef]/10 divide-y divide-[#155eef]/10">
                  {aiSteps.map((step, i) => (
                    <div key={i} className="px-4 py-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Zap className="h-4 w-4 text-[#155eef] shrink-0" />
                          <span className="text-sm font-medium text-[#344054]">{i + 1}. {step.text}</span>
                        </div>
                        <div className="h-5 w-5 rounded-full bg-[#155eef] flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <p className="text-xs text-[#667085] mt-1.5 ml-7 leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl bg-[#f0f5ff] p-5">
                  <p className="text-sm text-[#344054] leading-relaxed">
                    Khi CRM được kết nối, AI tự xử lý chấm điểm, follow-up và đặt lịch — đưa meeting thẳng vào calendar của bạn, không cần thao tác thủ công.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
