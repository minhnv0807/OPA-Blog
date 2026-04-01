import type { Metadata } from "next";
import { Bonuses } from "@/components/courses/ai-course/Bonuses";
import { CaseStudies } from "@/components/courses/ai-course/CaseStudies";
import { CTAFinal } from "@/components/courses/ai-course/CTAFinal";
import { Curriculum } from "@/components/courses/ai-course/Curriculum";
import { Examples } from "@/components/courses/ai-course/Examples";
import { FAQ } from "@/components/courses/ai-course/FAQ";
import { Hero } from "@/components/courses/ai-course/Hero";
import { Instructor } from "@/components/courses/ai-course/Instructor";
import { Pricing } from "@/components/courses/ai-course/Pricing";
import { Problems } from "@/components/courses/ai-course/Problems";
import { Solution } from "@/components/courses/ai-course/Solution";
import { StickyCTA } from "@/components/courses/ai-course/StickyCTA";

export const metadata: Metadata = {
  title: "Khóa học AI Kiếm Tiền Thực Chiến",
  description:
    "Học AI từ 0, xây kênh nội dung và workflow kiếm tiền thực chiến cùng OPA.",
};

export default function AICoursePage() {
  return (
    <main className="bg-white">
      <Hero />
      <Problems />
      <Solution />
      <CaseStudies />
      <Examples />
      <Curriculum />
      <Bonuses />
      <Pricing />
      <Instructor />
      <FAQ />
      <CTAFinal />
      <StickyCTA />
    </main>
  );
}
