import type { Metadata } from "next";
import { Hero } from "@/components/landing/Hero";
import { BentoServices } from "@/components/landing/BentoServices";
import { Comparison } from "@/components/landing/Comparison";
import { AgentTabs } from "@/components/landing/AgentTabs";
import { Stats } from "@/components/landing/Stats";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";

export const metadata: Metadata = {
  title: "OPA — AI Marketing Agency | Marketing x Công Nghệ x AI",
  description:
    "OPA kết hợp sức mạnh Marketing, Công nghệ và AI tiên tiến giúp doanh nghiệp Việt Nam tăng trưởng bền vững. Tăng 3x ROI, 10K+ leads/tháng. Tư vấn miễn phí.",
  alternates: {
    canonical: "https://www.opa.business",
  },
  openGraph: {
    title: "OPA — AI Marketing Agency | Marketing x Công Nghệ x AI",
    description:
      "Giải pháp Marketing + AI thực chiến. Tăng 3x ROI, tự động hóa 10K+ leads/tháng cho doanh nghiệp Việt Nam.",
    url: "https://www.opa.business",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <BentoServices />
      <Comparison />
      <AgentTabs />
      <Stats />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
}
