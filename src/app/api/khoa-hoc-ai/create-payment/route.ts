import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { payos } from "@/lib/payments/payos";

const schema = z.object({
  fullName: z.string().min(2),
  phone: z.string().regex(/^(0|\+84)[0-9]{9}$/),
  email: z.string().email(),
  packageId: z.enum(["10tr", "15tr"]),
  isGroup: z.boolean(),
  partnerName: z.string().optional(),
  note: z.string().optional(),
});

const PRICES = {
  "10tr": 10_000_000,
  "15tr": 15_000_000,
} as const;

const PACKAGE_NAMES = {
  "10tr": "AI Kiem Tien Thuc Chien",
  "15tr": "Khoa hoc Full Stack AI",
} as const;

function toSlug(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, (c) => (c === "đ" ? "d" : "D"))
    .replace(/[^a-zA-Z0-9]/g, "");
}

function buildTransferContent(fullName: string, phone: string): string {
  const words = fullName.trim().split(/\s+/);
  const lastTwo = words.slice(-2).join("");
  const namePart = words.length >= 2 ? lastTwo : words[0];
  const slug = toSlug(namePart);
  const suffix = ` ${phone} AIAFF`;
  const maxNameLen = 25 - suffix.length;
  return `${slug.substring(0, maxNameLen)}${suffix}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const basePrice = PRICES[data.packageId];
    const finalPrice = data.isGroup ? Math.round(basePrice * 0.5) : basePrice;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const orderCode = Number(Date.now().toString().slice(-9));
    const description = buildTransferContent(data.fullName, data.phone);

    const paymentLink = await payos.paymentRequests.create({
      orderCode,
      amount: finalPrice,
      description,
      buyerName: data.fullName,
      buyerEmail: data.email,
      buyerPhone: data.phone,
      buyerAddress: "Viet Nam",
      items: [
        {
          name: PACKAGE_NAMES[data.packageId],
          quantity: 1,
          price: finalPrice,
        },
      ],
      cancelUrl: `${appUrl}/khoa-hoc-ai/checkout?cancelled=true`,
      returnUrl: `${appUrl}/khoa-hoc-ai/thank-you`,
      expiredAt: Math.floor(Date.now() / 1000) + 60 * 30,
    });

    return NextResponse.json({
      checkoutUrl: paymentLink.checkoutUrl,
      orderCode,
    });
  } catch (error: unknown) {
    console.error("AI course payment creation error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: error.issues },
        { status: 400 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("PayOS error detail:", message);

    return NextResponse.json(
      { error: `Không thể tạo thanh toán: ${message}` },
      { status: 500 }
    );
  }
}
