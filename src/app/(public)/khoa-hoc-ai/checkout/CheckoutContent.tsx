"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Check, Clock, Shield } from "lucide-react";
import { CheckoutForm } from "@/components/courses/ai-course/checkout/CheckoutForm";

export function CheckoutContent() {
  const searchParams = useSearchParams();
  const pkg = searchParams.get("package") || "10tr";

  return (
    <main className="mesh-bg min-h-screen bg-opa-dark">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <Link
          href="/khoa-hoc-ai"
          className="group mb-8 inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Quay lại trang khóa học
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="card-glass p-6 md:p-8">
              <h1 className="mb-2 text-2xl font-black text-white">
                Hoàn tất đăng ký
              </h1>
              <p className="mb-8 text-sm text-gray-400">
                Điền thông tin để đặt chỗ. Team OPA sẽ liên hệ xác nhận lịch học.
              </p>
              <CheckoutForm initialPackage={pkg} />
            </div>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <div className="card-glass p-6">
              <h3 className="mb-4 font-bold text-white">Bạn sẽ nhận được:</h3>
              <ul className="space-y-3">
                {[
                  "2-3 buổi học offline thực chiến",
                  "3-4 tuần support sau khóa",
                  "Zoom hàng tuần với team OPA",
                  "Truy cập Xưởng Media (10k/video)",
                  "Template Prompt + Workflow",
                  "Cộng đồng OPA Alumni",
                  "Hợp đồng + Hóa đơn đầy đủ",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 flex-shrink-0 text-opa-cyan" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-glass space-y-3 p-4">
              {[
                { icon: Shield, text: "Hợp đồng cam kết rõ ràng" },
                { icon: Clock, text: "Phản hồi trong vòng 2 giờ" },
                { icon: Check, text: "Hóa đơn đầy đủ theo yêu cầu" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm">
                  <Icon className="h-4 w-4 text-opa-cyan" />
                  <span className="text-gray-400">{text}</span>
                </div>
              ))}
            </div>

            <div className="card-glass p-4 text-center">
              <p className="mb-2 text-sm text-gray-400">Cần hỗ trợ thêm?</p>
              <p className="text-sm font-semibold text-white">
                Zalo/Hotline: 0848508585
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
