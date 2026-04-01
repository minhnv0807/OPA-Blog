"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AccordionGroup {
  session: string;
  title: string;
  sections: {
    icon: string;
    heading: string;
    bullets: string[];
  }[];
}

type TabKey = "10tr" | "15tr";

// ─── Data ────────────────────────────────────────────────────────────────────

const buoi1: AccordionGroup = {
  session: "BUỔI 1",
  title: "LÀM CHỦ AI + VIDEO AI TRIỆU VIEW",
  sections: [
    {
      icon: "🧠",
      heading: "Tư duy người trong cuộc",
      bullets: [
        "Bí mật Tảng băng chìm — tại sao 99% dùng AI sai cách",
        "Công thức Top-Down — làm việc trước, chọn tool sau",
        "Prompt Engineering từ cơ bản đến viết PRD như pro",
        "Setup NotebookLM — bộ não thứ 2 của bạn",
      ],
    },
    {
      icon: "🎬",
      heading: "Video AI 2025",
      bullets: [
        "Bản đồ công cụ: Kling / Runway / Sora",
        "4 kiểu video AI đang hốt bạc nhất hiện tại",
        "Motion Control — vũ khí bí mật tạo video triệu view",
      ],
    },
    {
      icon: "🔥",
      heading: "Thực hành ngay tại lớp",
      bullets: [
        "Demo Xưởng Media — tạo video AI chỉ trong 10 phút",
        "Kỹ thuật tiết kiệm 70% chi phí tạo video AI",
      ],
    },
  ],
};

const buoi2: AccordionGroup = {
  session: "BUỔI 2",
  title: "TIKTOK AFFILIATE — TỪ 0 ĐẾN TIỀN THẬT",
  sections: [
    {
      icon: "📈",
      heading: "Hack thuật toán TikTok",
      bullets: [
        "Công thức hack thuật toán TikTok lên xu hướng",
        "Nuôi acc trâu bò — tránh bị ban tài khoản",
        "Xây Profile triệu follow đúng cách",
      ],
    },
    {
      icon: "💰",
      heading: "Hệ thống Affiliate",
      bullets: [
        "Săn sản phẩm gà đẻ trứng vàng trên TikTok Shop",
        "Kỹ thuật kích hoạt giỏ hàng tăng chuyển đổi",
        "Tránh bẫy Last Click mất hoa hồng",
        "4 cách kiếm tiền từ 1 kênh TikTok",
      ],
    },
    {
      icon: "🎯",
      heading: "Case study thực tế",
      bullets: [
        "30K follow trong 60 ngày — chi tiết từng bước",
        "1 tỷ/tháng — workflow tạo 10 video/ngày",
        "Review sản phẩm không lộ mặt vẫn ra đơn",
      ],
    },
    {
      icon: "🚀",
      heading: "Lộ trình 21 ngày",
      bullets: [
        "Kế hoạch hành động cụ thể từng ngày",
        "Milestone kiểm tra tiến độ và điều chỉnh",
      ],
    },
  ],
};

const support3w: AccordionGroup = {
  session: "3 TUẦN SUPPORT",
  title: "HỖ TRỢ SAU KHÓA HỌC",
  sections: [
    {
      icon: "👥",
      heading: "Quyền lợi đi kèm",
      bullets: [
        "Group chat riêng với toàn team OPA",
        "1 buổi Zoom support/tuần (Q&A trực tiếp)",
        "Review video cá nhân của từng học viên",
        "Hỗ trợ troubleshooting khi gặp vấn đề",
      ],
    },
  ],
};

const buoi3: AccordionGroup = {
  session: "BUỔI 3",
  title: "BUILD CÔNG CỤ + TỰ ĐỘNG HÓA",
  sections: [
    {
      icon: "🛠️",
      heading: "Vibecode",
      bullets: [
        "Từ xài đồ sang tạo đồ — không cần biết lập trình",
        "Cách viết PRD như chat với bạn bè",
        "Setup Claude Code — IDE thông minh với AI",
        "Demo live: build landing page hoàn chỉnh trong 15 phút",
      ],
    },
    {
      icon: "🤖",
      heading: "AI Agent",
      bullets: [
        "OpenClaw + Claude MCP — trợ lý AI 24/7",
        "n8n Automation — tự động hóa workflow không cần code",
      ],
    },
    {
      icon: "💎",
      heading: "Build sản phẩm số",
      bullets: [
        "Case thực tế: cách OPA build xuongmedia.com",
        "Thực hành: tự build mini product của riêng bạn",
        "Cách kiếm tiền từ sản phẩm số",
      ],
    },
  ],
};

const support4w: AccordionGroup = {
  session: "4 TUẦN SUPPORT",
  title: "HỖ TRỢ MỞ RỘNG",
  sections: [
    {
      icon: "💎",
      heading: "Quyền lợi nâng cao",
      bullets: [
        "Tất cả quyền lợi support gói 10TR",
        "2 buổi Zoom/tuần thay vì 1",
        "Code review 1-1 cho sản phẩm của bạn",
        "Technical support chuyên sâu",
        "Hỗ trợ deploy sản phẩm lên production",
      ],
    },
  ],
};

const TAB_CONTENT: Record<TabKey, AccordionGroup[]> = {
  "10tr": [buoi1, buoi2, support3w],
  "15tr": [buoi1, buoi2, buoi3, support4w],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface AccordionItemProps {
  group: AccordionGroup;
  isExtra?: boolean;
  defaultOpen?: boolean;
}

function AccordionItem({ group, isExtra = false, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={`rounded-xl border mb-3 overflow-hidden transition-colors duration-200 ${
        isOpen
          ? "border-[#155eef] bg-white"
          : "border-gray-200 bg-white"
      }`}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex flex-col flex-shrink-0 items-center gap-0.5">
          <span
            className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${
              isExtra
                ? "bg-[#FF6B00]/10 text-[#FF6B00]"
                : "bg-[#155eef]/10 text-[#155eef]"
            }`}
          >
            {group.session}
          </span>
        </div>
        <span className="text-slate-900 font-semibold text-sm flex-grow">
          {group.title}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Animated content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" as const }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-5 pb-5 pt-1 border-t border-gray-100 space-y-4">
              {group.sections.map((section, si) => (
                <div key={si}>
                  <p className="text-slate-700 font-semibold text-sm mb-1.5">
                    {section.icon} {section.heading}
                  </p>
                  <ul className="space-y-1 pl-6">
                    {section.bullets.map((bullet, bi) => (
                      <li key={bi} className="text-slate-600 text-sm list-disc">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Curriculum() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState<TabKey>("10tr");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "10tr", label: "GÓI 10TR — AI KIẾM TIỀN" },
    { key: "15tr", label: "GÓI 15TR — FULL STACK AI" },
  ];

  const groups = TAB_CONTENT[activeTab];
  // For the 15TR tab, the first two groups come from the base (same as 10TR),
  // the rest are extras (buoi3 + support4w).
  const baseCount = 2;

  return (
    <section id="curriculum" className="bg-slate-50 py-16 md:py-24">
      <div ref={ref} className="section-padding">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-[#155eef] text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 bg-[#155eef]/8 rounded-full">
            NỘI DUNG KHÓA HỌC
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-3 mb-4">
            Bạn sẽ{" "}
            <span className="text-[#155eef]">học được gì?</span>
          </h2>
        </motion.div>

        {/* Tab switcher */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex bg-slate-100 rounded-xl p-1 gap-1 border border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-white border border-gray-300 shadow-sm text-slate-900"
                    : "bg-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Accordion list */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="max-w-3xl mx-auto"
          >
            {groups.map((group, i) => {
              const isExtra = activeTab === "15tr" && i >= baseCount;
              return (
                <div key={`${activeTab}-${i}`}>
                  {/* Separator before extra items */}
                  {isExtra && i === baseCount && (
                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 border-t border-[#FF6B00]/30" />
                      <span className="text-[#FF6B00] text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                        ➕ Thêm trong gói 15TR
                      </span>
                      <div className="flex-1 border-t border-[#FF6B00]/30" />
                    </div>
                  )}
                  <AccordionItem
                    group={group}
                    isExtra={isExtra}
                    defaultOpen={i === 0}
                  />
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-10"
        >
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("pricing")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="btn-primary"
          >
            Xem bảng giá &amp; Đăng ký →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
