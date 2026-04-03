"use client";

import { useState } from "react";
import { Send, Mail, MapPin, Phone, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        setForm({ name: "", email: "", message: "" });
      } else {
        setError(data.error || "Có lỗi xảy ra");
      }
    } catch {
      setError("Không thể gửi tin nhắn. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  const contactInfo = [
    { icon: Mail, label: "Email", value: "hello@opa.vn", href: "mailto:hello@opa.vn" },
    { icon: Phone, label: "Hotline", value: "0966 910 397", href: "tel:0966910397" },
    { icon: MapPin, label: "Văn phòng", value: "Số 18 Galaxy 4 Vạn Phúc, Tố Hữu, Hà Đông", href: "#" },
  ];

  return (
    <section className="pt-24 pb-16 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#155eef] bg-[#155eef]/5 rounded-full px-4 py-1.5 mb-4">
            Liên Hệ
          </span>
          <h1 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-heading)] text-[#101828]">
            Kết Nối Với Chúng Tôi
          </h1>
          <p className="text-[#667085] mt-4 max-w-xl mx-auto">
            Hãy để lại thông tin, đội ngũ OPA sẽ liên hệ trong vòng 24h để tư vấn giải pháp phù hợp nhất cho doanh nghiệp của bạn.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            {sent ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-50 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-[#101828] mb-2">Gửi Thành Công!</h3>
                <p className="text-[#667085]">Chúng tôi sẽ phản hồi trong vòng 24h.</p>
                <Button
                  className="mt-6 bg-[#155eef] hover:bg-[#0b4fd1]"
                  onClick={() => setSent(false)}
                >
                  Gửi tin nhắn khác
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-lg font-semibold text-[#101828] mb-2">Gửi Tin Nhắn</h2>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-[#344054] mb-1.5 block">
                    Họ và Tên
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    required
                    className="border-gray-300 focus:border-[#155eef]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[#344054] mb-1.5 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@company.com"
                    required
                    className="border-gray-300 focus:border-[#155eef]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[#344054] mb-1.5 block">
                    Nội Dung
                  </label>
                  <Textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Mô tả nhu cầu hoặc câu hỏi của bạn..."
                    rows={5}
                    required
                    className="border-gray-300 focus:border-[#155eef]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2 bg-[#155eef] hover:bg-[#0b4fd1]"
                  disabled={loading}
                >
                  <Send className="h-4 w-4" />
                  {loading ? "Đang gửi..." : "Gửi Tin Nhắn"}
                </Button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info) => (
              <a
                key={info.label}
                href={info.href}
                className="flex items-start gap-4 bg-white rounded-xl border border-gray-200 p-5 hover:border-[#155eef]/30 hover:shadow-sm transition-all"
              >
                <div className="p-2.5 rounded-lg bg-[#155eef]/5">
                  <info.icon className="h-5 w-5 text-[#155eef]" />
                </div>
                <div>
                  <p className="text-xs text-[#667085] uppercase tracking-wider font-medium">{info.label}</p>
                  <p className="text-sm font-semibold text-[#101828] mt-1">{info.value}</p>
                </div>
              </a>
            ))}

            {/* Business Hours */}
            <div className="bg-[#f8fafc] rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-[#101828] mb-3">Giờ Làm Việc</h3>
              <div className="space-y-2 text-sm text-[#667085]">
                <div className="flex justify-between">
                  <span>Thứ 2 - Thứ 6</span>
                  <span className="font-medium text-[#101828]">8:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Thứ 7</span>
                  <span className="font-medium text-[#101828]">9:00 - 12:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Chủ Nhật</span>
                  <span className="text-red-500">Nghỉ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
