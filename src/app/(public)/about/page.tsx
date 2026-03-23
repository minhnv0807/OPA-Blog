import type { Metadata } from "next";
import { Target, Zap, Users, TrendingUp, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Về Chúng Tôi",
  description: "OverPowers Agency — đối tác công nghệ AI giúp doanh nghiệp Việt Nam tăng trưởng bền vững.",
};

const values = [
  { icon: Target, title: "Thực Chiến", desc: "Giải pháp thực tế, ứng dụng ngay, không lý thuyết suông." },
  { icon: Zap, title: "Đổi Mới", desc: "Cập nhật xu hướng AI & công nghệ mới nhất toàn cầu." },
  { icon: Users, title: "Đồng Hành", desc: "Hỗ trợ doanh nghiệp từ chiến lược đến triển khai." },
  { icon: TrendingUp, title: "Tăng Trưởng", desc: "Đo lường hiệu quả, tối ưu ROI liên tục." },
  { icon: Shield, title: "Uy Tín", desc: "Bảo mật dữ liệu, minh bạch trong hợp tác." },
];

const milestones = [
  { year: "2024", event: "Thành lập OPA, khởi động mảng Marketing & AI" },
  { year: "2024", event: "Phục vụ 50+ doanh nghiệp SME đầu tiên" },
  { year: "2025", event: "Ra mắt nền tảng đào tạo AI cho doanh nghiệp" },
  { year: "2025", event: "Mở rộng dịch vụ công nghệ & Affiliate Marketing" },
  { year: "2026", event: "Hướng tới phục vụ 500+ doanh nghiệp trên toàn quốc" },
];

export default function AboutPage() {
  return (
    <section className="pt-24 pb-16 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <div className="text-center mb-20">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#155eef] bg-[#155eef]/5 rounded-full px-4 py-1.5 mb-4">
            Về Chúng Tôi
          </span>
          <h1 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-heading)] text-[#101828] leading-tight">
            Marketing + Công Nghệ + AI
            <br />
            <span className="text-gradient">Cho Doanh Nghiệp Việt</span>
          </h1>
          <p className="text-[#667085] mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
            <strong>Công ty TNHH OverPowers Agency (OPA)</strong> hoạt động trong lĩnh vực truyền thông & công nghệ.
            Chúng tôi kết hợp Marketing, Công nghệ và AI để tạo ra giải pháp thực tế, dễ ứng dụng cho SME Việt Nam.
          </p>
        </div>

        {/* 5 Business Areas */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-center text-[#101828] mb-10">
            5 Mảng Hoạt Động Chính
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { num: "01", title: "Marketing Đa Nền Tảng", desc: "Facebook, TikTok, YouTube, Website" },
              { num: "02", title: "Giải Pháp Công Nghệ", desc: "Tư vấn & triển khai số hóa cho SME" },
              { num: "03", title: "Ứng Dụng AI", desc: "Chatbot, automation, analytics" },
              { num: "04", title: "Đào Tạo AI", desc: "Khóa học thực chiến cho cá nhân & DN" },
              { num: "05", title: "AI Affiliate", desc: "Hệ thống kiếm tiền từ AI tools" },
            ].map((area) => (
              <div
                key={area.num}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-[#155eef]/30 hover:shadow-md transition-all"
              >
                <span className="text-3xl font-bold text-[#155eef]/10">{area.num}</span>
                <h3 className="text-sm font-bold text-[#101828] mt-2">{area.title}</h3>
                <p className="text-xs text-[#667085] mt-1">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-center text-[#101828] mb-10">
            Giá Trị Cốt Lõi
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {values.map((v) => (
              <div key={v.title} className="text-center p-5">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[#155eef]/5 mb-3">
                  <v.icon className="h-6 w-6 text-[#155eef]" />
                </div>
                <h3 className="text-sm font-bold text-[#101828]">{v.title}</h3>
                <p className="text-xs text-[#667085] mt-1">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-center text-[#101828] mb-10">
            Hành Trình Phát Triển
          </h2>
          <div className="max-w-2xl mx-auto space-y-0">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-4 relative">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-[#155eef] border-4 border-[#155eef]/20 shrink-0 mt-1.5" />
                  {i < milestones.length - 1 && (
                    <div className="w-px flex-1 bg-gray-200" />
                  )}
                </div>
                <div className="pb-8">
                  <span className="text-xs font-bold text-[#155eef]">{m.year}</span>
                  <p className="text-sm text-[#344054] mt-0.5">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
