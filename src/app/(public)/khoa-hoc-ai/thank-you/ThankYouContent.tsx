"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Clock, MessageCircle, Users } from "lucide-react";

export function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("orderCode");
  const status = searchParams.get("status");
  const isSuccess = status === "PAID" || !status;

  return (
    <main className="mesh-bg flex min-h-screen items-center justify-center bg-opa-dark px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg text-center"
      >
        {isSuccess ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
              className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-green-500/40 bg-green-500/10"
            >
              <CheckCircle className="h-12 w-12 text-green-400" />
            </motion.div>

            <h1 className="mb-3 text-3xl font-black text-white">
              Thanh toán thành công!
            </h1>
            <p className="mb-2 text-gray-400">
              Đăng ký của bạn đã được xác nhận.
            </p>
            {orderCode ? (
              <p className="mb-8 text-sm text-gray-500">
                Mã đơn hàng: <span className="font-mono text-opa-cyan">{orderCode}</span>
              </p>
            ) : null}

            <div className="card-glass mb-6 p-6 text-left">
              <h3 className="mb-4 font-bold text-white">Các bước tiếp theo:</h3>
              <div className="space-y-4">
                {[
                  {
                    icon: MessageCircle,
                    title: "Kiểm tra email",
                    desc: "Email xác nhận và hướng dẫn tham gia group đã được gửi.",
                  },
                  {
                    icon: Users,
                    title: "Tham gia group OPA",
                    desc: "Team OPA sẽ liên hệ qua Zalo hoặc điện thoại trong 2 giờ.",
                  },
                  {
                    icon: Clock,
                    title: "Chờ thông báo lịch học",
                    desc: "Lịch buổi học đầu tiên sẽ được thông báo trong group.",
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-opa-blue/20 bg-opa-blue/10">
                      <Icon className="h-4 w-4 text-opa-blue" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="mt-0.5 text-xs text-gray-400">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="mb-6 text-sm text-gray-400">
              Câu hỏi? Liên hệ{" "}
              <a href="tel:0848508585" className="text-opa-cyan hover:underline">
                0848508585
              </a>
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-red-500/40 bg-red-500/10">
              <span className="text-4xl">!</span>
            </div>
            <h1 className="mb-3 text-3xl font-black text-white">
              Thanh toán chưa hoàn tất
            </h1>
            <p className="mb-8 text-gray-400">
              Đơn hàng chưa được thanh toán. Bạn có thể thử lại hoặc liên hệ hỗ trợ.
            </p>
            <Link href="/khoa-hoc-ai/checkout" className="btn-primary inline-block px-8 py-4">
              Thử lại
            </Link>
          </>
        )}

        <Link
          href="/khoa-hoc-ai"
          className="text-sm text-gray-500 transition-colors hover:text-gray-300"
        >
          ← Về trang khóa học
        </Link>
      </motion.div>
    </main>
  );
}
