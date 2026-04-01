import { NextRequest, NextResponse } from "next/server";
import { payos } from "@/lib/payments/payos";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const webhookData = await payos.webhooks.verify(body);

    if (!webhookData) {
      return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
    }

    if (webhookData.code === "00") {
      console.log(
        `AI course payment confirmed: orderCode=${webhookData.orderCode}, amount=${webhookData.amount}`
      );
    }

    return NextResponse.json({ code: "00", desc: "Webhook received" });
  } catch (error) {
    console.error("AI course webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ success: true });
}
