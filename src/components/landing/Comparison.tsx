"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Zap, CircleDot } from "lucide-react";

const manualSteps = [
  { text: "Tạo bảng tính lead", desc: "Thu thập thủ công từ nhiều nguồn, sắp xếp hàng và cột vào spreadsheet." },
  { text: "Tìm email hợp lệ", desc: "Dành hàng giờ nghiên cứu online, kiểm tra chéo database để tìm email chính xác." },
  { text: "Soạn cold email", desc: "Viết email outreach cá nhân cho từng người, hy vọng được phản hồi." },
  { text: "Lên lịch gửi hàng loạt", desc: "Cấu hình chiến dịch email thủ công, chọn thời gian gửi tối ưu." },
  { text: "Chờ phản hồi", desc: "Ngồi chờ, đôi khi vài ngày mới có reply, gây bất ổn trong pipeline." },
  { text: "Follow-up thủ công", desc: "Quay lại spreadsheet, xác định ai chưa reply, soạn follow-up thêm." },
  { text: "Đánh giá chất lượng lead", desc: "Gọi điện từng người để xác định mức độ quan tâm và khả năng mua." },
  { text: "Qua lại đặt lịch", desc: "Trao đổi email qua lại với khách để tìm thời gian họp phù hợp." },
  { text: "Cập nhật CRM", desc: "Nhập thủ công mọi thông tin, ghi chú, trạng thái vào hệ thống CRM." },
  { text: "Cuối cùng chốt meeting", desc: "Sau nhiều bước thủ công và chờ đợi, cuối cùng xác nhận meeting." },
];

const aiSteps = [
  { text: "Kết nối CRM của bạn", desc: "Tích hợp CRM hiện tại vào AI agent — không cần code, chỉ kết nối và bắt đầu." },
  { text: "AI chấm điểm & cá nhân hoá lead", desc: "AI phân tích và xếp hạng lead theo mức độ tiềm năng, tự cá nhân hoá outreach." },
  { text: "Tự động follow-up thông minh", desc: "AI agent gửi follow-up đúng thời điểm, cá nhân hoá nội dung, tăng tỷ lệ phản hồi." },
  { text: "Lịch được đặt — meeting booked", desc: "AI tự xử lý đặt lịch, xác nhận và nhắc nhở — meeting vào calendar, không cần thao tác." },
];

const CARD_H = 48;

export function Comparison() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0); // 0-10
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionH = sectionRef.current.offsetHeight;
      const scrolled = -rect.top; // how far we've scrolled into section
      const ratio = Math.max(0, Math.min(scrolled / (sectionH - window.innerHeight), 1));
      setActiveStep(Math.round(ratio * 10));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const manualHours = activeStep * 12;
  const aiMin = Math.min(Math.ceil(activeStep * 1.5), 15);
  const currentStep = activeStep;
  const currentAiStep = Math.ceil(activeStep / 2.5);
  const progressWidth = Math.min((activeStep / 4) * 100, 100);
  const aiHeaderOnBlue = progressWidth >= 55;

  return (
    <section ref={sectionRef} id="comparison" className="relative bg-[#f8fafc] px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto max-w-5xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-[#667085] mb-2">Quy trình thủ công → AI tự động</p>
          <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-heading)] text-[#101828]">
            Cách cũ vs <span className="text-[#155eef]">Cách OPA</span>
          </h2>
        </motion.div>

        {/* Sticky headers */}
        <div className="z-30 grid gap-4 md:sticky md:top-16 md:mb-6 md:grid-cols-2 md:gap-6">
          <div className="rounded-2xl bg-[#101828] px-6 py-4 shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-base md:text-lg font-bold text-white">Manual Process</h3>
              {currentStep >= 10 && (
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">Finally Done</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
              <span className="text-sm font-bold tabular-nums w-8 text-right text-white">{manualHours}</span>
              <span className="text-xs text-white/70">Hours</span>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
            <div
              className="absolute inset-0 bg-[#155eef] rounded-2xl transition-all duration-500 ease-out"
              style={{ width: `${progressWidth}%` }}
            />
            <div className="relative px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className={`text-base md:text-lg font-bold transition-colors duration-300 ${aiHeaderOnBlue ? "text-white" : "text-[#101828]"}`}>OPA AI Process</h3>
                {currentStep >= 4 && (
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${aiHeaderOnBlue ? "bg-white/20 text-white" : "bg-[#155eef]/10 text-[#155eef]"}`}>
                    <Zap className="h-3 w-3" />Done
                  </span>
                )}
              </div>
              <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${aiHeaderOnBlue ? "bg-white/20" : "bg-gray-100"}`}>
                <span className={`text-sm font-bold tabular-nums w-6 text-right transition-colors duration-300 ${aiHeaderOnBlue ? "text-white" : "text-[#101828]"}`}>{aiMin}</span>
                <span className={`text-xs transition-colors duration-300 ${aiHeaderOnBlue ? "text-white/80" : "text-[#667085]"}`}>Min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* MANUAL */}
          <div>
            {manualSteps.map((step, i) => {
              const done = i < currentStep;
              return (
                <div
                  key={i}
                  className="mb-4 md:sticky"
                  style={{
                    top: isMobile ? undefined : 140 + i * CARD_H,
                    zIndex: isMobile ? undefined : 10 + i,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4 }}
                    className="rounded-xl bg-white border border-gray-100 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-3">
                        <CircleDot className="h-4 w-4 text-gray-300 shrink-0" />
                        <span className="text-sm font-semibold text-[#101828]">{i + 1}. {step.text}</span>
                      </div>
                      <div
                        className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                        style={{
                          backgroundColor: done ? "#101828" : "#f3f4f6",
                          border: done ? "none" : "1px solid #e5e7eb",
                        }}
                      >
                        {done && <Check className="h-3.5 w-3.5 text-white" />}
                      </div>
                    </div>
                    <p className="text-xs text-[#667085] ml-7 leading-relaxed">{step.desc}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* AI */}
          <div>
            {aiSteps.map((step, i) => {
              // AI steps complete faster: step 0 at activeStep 1, step 1 at 3, step 2 at 5, step 3 at 7
              const done = i < currentAiStep;
              return (
                <div
                  key={i}
                  className="mb-4 md:sticky"
                  style={{
                    top: isMobile ? undefined : 140 + i * CARD_H,
                    zIndex: isMobile ? undefined : 10 + i,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="rounded-xl bg-white border border-[#155eef]/10 p-5 shadow-[0_2px_8px_rgba(21,94,239,0.04)]"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-3">
                        <Zap className="h-4 w-4 text-[#155eef] shrink-0" />
                        <span className="text-sm font-semibold text-[#101828]">{i + 1}. {step.text}</span>
                      </div>
                      <div
                        className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                        style={{
                          backgroundColor: done ? "#155eef" : "#f3f4f6",
                          border: done ? "none" : "1px solid #e5e7eb",
                        }}
                      >
                        {done && <Check className="h-3.5 w-3.5 text-white" />}
                      </div>
                    </div>
                    <p className="text-xs text-[#667085] ml-7 leading-relaxed">{step.desc}</p>
                  </motion.div>
                </div>
              );
            })}
            <div
              className="md:sticky"
              style={{
                top: isMobile ? undefined : 140 + 4 * CARD_H,
                zIndex: isMobile ? undefined : 15,
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="rounded-xl bg-[#f0f5ff] p-5 border border-[#155eef]/5"
              >
                <p className="text-sm text-[#344054] leading-relaxed">
                  Khi CRM được kết nối, AI tự xử lý chấm điểm, follow-up, đặt lịch và xác nhận — đưa meeting thẳng vào calendar, không cần thao tác thủ công.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
