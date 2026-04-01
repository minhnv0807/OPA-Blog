"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, User, Phone, Mail, Users } from "lucide-react";

const schema = z.object({
  fullName: z.string().min(2, "Họ tên ít nhất 2 ký tự"),
  phone: z
    .string()
    .regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  packageId: z.enum(["10tr", "15tr"]),
  isGroup: z.boolean(),
  partnerName: z.string().optional(),
  note: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CheckoutFormProps {
  initialPackage?: string;
}

const PRICES = {
  "10tr": 10_000_000,
  "15tr": 15_000_000,
};

export function CheckoutForm({ initialPackage }: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      packageId: (initialPackage as "10tr" | "15tr") || "10tr",
      isGroup: false,
    },
  });

  const selectedPackage = watch("packageId");
  const isGroup = watch("isGroup");

  const basePrice = PRICES[selectedPackage];
  const finalPrice = isGroup ? Math.round(basePrice * 0.5) : basePrice;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price) + "đ";

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/khoa-hoc-ai/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Có lỗi xảy ra");
      }

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Package selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Chọn gói đăng ký
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(["10tr", "15tr"] as const).map((pkg) => (
            <label
              key={pkg}
              className={`relative flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedPackage === pkg
                  ? "border-opa-blue bg-opa-blue/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <input
                type="radio"
                value={pkg}
                {...register("packageId")}
                className="sr-only"
              />
              <span className="text-white font-bold text-sm">
                {pkg === "10tr" ? "AI Kiếm Tiền" : "Full Stack AI"}
              </span>
              <span className="text-opa-cyan font-black text-lg mt-1">
                {formatPrice(PRICES[pkg])}
              </span>
              {pkg === "15tr" && (
                <span className="absolute -top-2 -right-2 bg-opa-orange text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  PHỔ BIẾN
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Full name */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Họ và tên *
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            {...register("fullName")}
            placeholder="Nguyễn Văn A"
            className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-opa-blue transition-all ${
              errors.fullName ? "border-red-500" : "border-white/10 focus:border-opa-blue"
            }`}
          />
        </div>
        {errors.fullName && (
          <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Số điện thoại *
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            {...register("phone")}
            placeholder="0912345678"
            type="tel"
            className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-opa-blue transition-all ${
              errors.phone ? "border-red-500" : "border-white/10 focus:border-opa-blue"
            }`}
          />
        </div>
        {errors.phone && (
          <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Email *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            {...register("email")}
            placeholder="email@example.com"
            type="email"
            className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-opa-blue transition-all ${
              errors.email ? "border-red-500" : "border-white/10 focus:border-opa-blue"
            }`}
          />
        </div>
        {errors.email && (
          <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Group registration */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              {...register("isGroup")}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                isGroup
                  ? "bg-opa-blue border-opa-blue"
                  : "border-white/20 bg-white/5 group-hover:border-white/40"
              }`}
            >
              {isGroup && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </div>
          <div>
            <span className="text-gray-300 text-sm font-medium">
              Đăng ký theo nhóm 2 người trở lên
            </span>
            <span className="ml-2 text-xs bg-opa-orange/20 text-opa-orange border border-opa-orange/30 rounded-full px-2 py-0.5">
              Giảm 50%
            </span>
          </div>
        </label>
      </div>

      {/* Partner name (conditional) */}
      {isGroup && (
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Tên người đi cùng / đại diện nhóm
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              {...register("partnerName")}
              placeholder="Tên người đi cùng hoặc đại diện nhóm"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-opa-blue transition-all"
            />
          </div>
        </div>
      )}

      {/* Note */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Ghi chú (không bắt buộc)
        </label>
        <textarea
          {...register("note")}
          placeholder="Câu hỏi hoặc yêu cầu đặc biệt..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-opa-blue transition-all resize-none"
        />
      </div>

      {/* Price summary */}
      <div className="glass rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Gói đã chọn:</span>
          <span className="text-white font-semibold">
            {selectedPackage === "10tr" ? "AI Kiếm Tiền" : "Full Stack AI"}
          </span>
        </div>
        {isGroup && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Giảm giá nhóm:</span>
            <span className="text-green-400 font-semibold">
              -{formatPrice(basePrice - finalPrice)}
            </span>
          </div>
        )}
        <div className="flex justify-between border-t border-white/10 pt-2">
          <span className="text-white font-bold">Tổng thanh toán:</span>
          <span className="text-opa-cyan font-black text-lg">
            {formatPrice(finalPrice)}
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Đang xử lý...
          </>
        ) : (
          <>
            Tiến hành thanh toán →
          </>
        )}
      </button>

      <p className="text-center text-gray-500 text-xs">
        🔒 Thanh toán bảo mật qua PayOS · Có hóa đơn đầy đủ
      </p>
    </form>
  );
}
