"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Play, ArrowRight } from "lucide-react";

interface Niche {
  emoji: string;
  niche: string;
  example: string;
  videoType: string;
  income: string;
  why: string;
  difficulty: string;
  difficultyColor: string;
  incomeColor: string;
  steps: string[];
}

interface VideoType {
  icon: string;
  name: string;
  desc: string;
  tag: string;
  tagClass: string;
}

interface ChannelStat {
  name: string;
  revenue: string;
  orders: string;
  views: string;
}

const channelStats: ChannelStat[] = [
  { name: "Kênh Sức Khỏe", revenue: "200M", orders: "4.500+", views: "2.1M" },
  { name: "Kênh Thời Trang", revenue: "100M", orders: "3.800+", views: "1.8M" },
  { name: "Kênh Mẹ & Bé", revenue: "30M", orders: "2.200+", views: "650K" },
];

const niches: Niche[] = [
  {
    emoji: "🏥",
    niche: "Sức Khỏe & Y Tế",
    example: "Kênh review thực phẩm chức năng, tips sức khỏe",
    videoType: "Video AI giọng bác sĩ — không cần người thật",
    income: "24–200 triệu/tháng",
    why: "Sản phẩm sức khỏe hoa hồng cao 15–25%, nhu cầu tìm kiếm lớn",
    difficulty: "Dễ",
    difficultyColor: "bg-green-50 text-green-700 border-green-200",
    incomeColor: "text-opa-blue",
    steps: [
      "Tạo nhân vật AI giọng chuyên gia (không cần bằng y)",
      "Script review sản phẩm + giải thích lợi ích",
      "Gắn link TikTok Shop — hoa hồng tự về",
    ],
  },
  {
    emoji: "👗",
    niche: "Thời Trang & Phụ Kiện",
    example: "Kênh outfit inspiration, mix đồ theo phong cách",
    videoType: "Video AI model ảo mặc thử đồ — không cần người mẫu thật",
    income: "10–100 triệu/tháng",
    why: "Ngành thời trang chiếm 30% GMV TikTok Shop VN, dễ viral",
    difficulty: "Dễ",
    difficultyColor: "bg-green-50 text-green-700 border-green-200",
    incomeColor: "text-opa-orange",
    steps: [
      "Dùng AI tạo model ảo thử outfit từ TikTok Shop",
      "Tạo series \"mix đồ theo style\" mỗi ngày",
      "Mỗi video gắn 3–5 sản phẩm affiliate",
    ],
  },
  {
    emoji: "👶",
    niche: "Mẹ & Bé / Parenting",
    example: "Kênh \"Lớn lên cùng con\" — tips nuôi dạy, đồ dùng cho bé",
    videoType: "Hoạt hình AI + giọng kể chuyện — ai cũng làm được",
    income: "10–30 triệu/tháng",
    why: "Phụ huynh sẵn sàng chi tiền cho con, tỷ lệ chuyển đổi cao nhất",
    difficulty: "Rất dễ",
    difficultyColor: "bg-blue-50 text-opa-blue border-blue-200",
    incomeColor: "text-opa-blue",
    steps: [
      "Chọn niche: đồ chơi / sữa bột / quần áo trẻ em",
      "AI tạo video hoạt hình review sản phẩm 30 giây",
      "Đăng 2 video/ngày — không cần kịch bản phức tạp",
    ],
  },
  {
    emoji: "👴",
    niche: "Sống Đẹp Tuổi Vàng",
    example: "Kênh lifestyle cho người 45–65 tuổi — \"Quý phái tuổi vàng\"",
    videoType: "Video AI nhân vật ảo phong thái sang trọng",
    income: "10–24 triệu/tháng",
    why: "Niche ít cạnh tranh, đối tượng có tiền và mua nhiều",
    difficulty: "Dễ",
    difficultyColor: "bg-green-50 text-green-700 border-green-200",
    incomeColor: "text-opa-blue",
    steps: [
      "Tạo nhân vật AI trung niên sang trọng",
      "Review thực phẩm chức năng, dụng cụ chăm sóc sức khỏe",
      "Target đúng audience 45+ → conversion rate cao",
    ],
  },
];

const videoTypes: VideoType[] = [
  {
    icon: "🎬",
    name: "Video Review Sản Phẩm",
    desc: "AI lồng tiếng, không cần quay mặt. Chuẩn cho TikTok & Shopee.",
    tag: "Phổ biến nhất",
    tagClass: "bg-orange-50 text-opa-orange border-orange-200",
  },
  {
    icon: "🤖",
    name: "KOL Ảo AI",
    desc: "Nhân bản nhân vật AI scale nhiều sản phẩm cùng lúc.",
    tag: "Tiết kiệm nhất",
    tagClass: "bg-blue-50 text-opa-blue border-blue-200",
  },
  {
    icon: "🎭",
    name: "Video UGC Giọng AI",
    desc: "Giữ vibe tự nhiên, dựng nhanh — tỷ lệ xem cao.",
    tag: "Viral nhất",
    tagClass: "bg-green-50 text-green-700 border-green-200",
  },
  {
    icon: "📖",
    name: "Video Brand Story",
    desc: "AI viết kịch bản + dựng storyboard — kể câu chuyện thương hiệu.",
    tag: "Chuyên nghiệp",
    tagClass: "bg-purple-50 text-purple-700 border-purple-200",
  },
];

export function Examples() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="examples" className="section-white">
      <div className="section-padding" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="tag mb-3">VÍ DỤ TIÊU BIỂU DỄ ÁP DỤNG</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
            Chọn 1 niche —{" "}
            <span className="text-gradient-blue">bắt đầu ngay hôm nay</span>
          </h2>
          <p className="text-slate-600 text-lg mt-4 max-w-2xl mx-auto">
            Mỗi niche dưới đây đều có người đang kiếm tiền thực tế. Học xong
            buổi 1 là bạn có thể bắt tay làm ngay.
          </p>
        </motion.div>

        {/* Channel stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {channelStats.map((ch) => (
            <div
              key={ch.name}
              className="bg-slate-50 border border-gray-200 rounded-xl px-5 py-3 text-center min-w-[140px]"
            >
              <div className="text-xl font-black text-opa-blue">{ch.revenue}</div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">
                {ch.name}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {ch.orders} đơn · {ch.views} views
              </div>
            </div>
          ))}
        </motion.div>

        {/* Niche cards 2-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          {niches.map((n, i) => (
            <motion.div
              key={n.niche}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              className="card hover:shadow-md transition-shadow duration-300"
            >
              {/* Card header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{n.emoji}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {n.niche}
                    </h3>
                    <span className="text-xs text-slate-400">{n.example}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-3 text-right">
                  <div className={`font-black text-sm ${n.incomeColor}`}>
                    {n.income}
                  </div>
                  <span
                    className={`mt-1 inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${n.difficultyColor}`}
                  >
                    {n.difficulty}
                  </span>
                </div>
              </div>

              {/* Video type */}
              <div className="flex items-center gap-2 mb-3 p-2.5 rounded-xl bg-slate-50 border border-gray-100">
                <Play className="w-3.5 h-3.5 text-opa-orange flex-shrink-0" />
                <span className="text-slate-600 text-xs">{n.videoType}</span>
              </div>

              {/* Why */}
              <p className="text-slate-400 text-xs mb-3 flex items-start gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-opa-blue flex-shrink-0 mt-0.5" />
                {n.why}
              </p>

              {/* Steps */}
              <ol className="space-y-2">
                {n.steps.map((step, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-xs">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 border border-blue-200 text-opa-blue flex items-center justify-center font-bold text-xs">
                      {j + 1}
                    </span>
                    <span className="text-slate-500 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          ))}
        </div>

        {/* Video types section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mb-12"
        >
          <p className="text-center text-slate-400 text-xs uppercase tracking-widest font-semibold mb-6">
            4 dạng video AI phổ biến nhất
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {videoTypes.map((v, i) => (
              <motion.div
                key={v.name}
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.07 }}
                className="bg-slate-50 rounded-xl p-4 text-center border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
              >
                <div className="text-3xl mb-2">{v.icon}</div>
                <p className="font-semibold text-slate-900 text-sm mb-1.5">
                  {v.name}
                </p>
                <p className="text-slate-500 text-xs leading-relaxed mb-3">
                  {v.desc}
                </p>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${v.tagClass}`}
                >
                  {v.tag}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.75 }}
          className="bg-blue-50 border border-blue-100 rounded-2xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-5"
        >
          <div>
            <p className="font-bold text-slate-900 text-lg mb-1">
              Bạn chưa biết nên chọn niche nào?
            </p>
            <p className="text-slate-600 text-sm">
              Team OPA sẽ phân tích và tư vấn niche phù hợp nhất với bạn —
              ngay trong buổi học đầu tiên.
            </p>
          </div>
          <button
            onClick={() =>
              document
                .getElementById("pricing")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="btn-blue whitespace-nowrap flex items-center gap-2 flex-shrink-0"
          >
            Đăng ký tư vấn <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
