import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutContent } from "./CheckoutContent";

export const metadata: Metadata = {
  title: "Đăng ký khóa học AI",
  description: "Hoàn tất đăng ký khóa học AI Kiếm Tiền Thực Chiến.",
};

function CheckoutFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-opa-dark">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-opa-blue border-t-transparent" />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutContent />
    </Suspense>
  );
}
