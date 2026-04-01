import type { Metadata } from "next";
import { Suspense } from "react";
import { ThankYouContent } from "./ThankYouContent";

export const metadata: Metadata = {
  title: "Đăng ký khóa học thành công",
};

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-opa-dark" />}>
      <ThankYouContent />
    </Suspense>
  );
}
