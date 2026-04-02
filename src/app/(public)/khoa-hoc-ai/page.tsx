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
  title: "Khóa Học AI Kiếm Tiền Thực Chiến — Tạo Video AI & TikTok Affiliate",
  description:
    "Học AI từ 0, xây kênh TikTok nội dung AI và workflow kiếm tiền thực chiến. 100% thực hành, cam kết có kết quả sau 1 tuần. Đăng ký ngay.",
  keywords: [
    "khóa học AI",
    "kiếm tiền bằng AI",
    "AI kiếm tiền",
    "TikTok affiliate",
    "tạo video AI",
    "AI content creation",
    "học AI từ 0",
    "khóa học marketing AI",
    "AI automation kiếm tiền",
    "OPA khóa học",
  ],
  alternates: {
    canonical: "https://www.opa.business/khoa-hoc-ai",
  },
  openGraph: {
    title: "Khóa Học AI Kiếm Tiền Thực Chiến — OPA",
    description:
      "Từ 0 đến có thu nhập với AI. Tạo video AI, xây kênh TikTok Affiliate, workflow tự động. 100% thực hành.",
    url: "https://www.opa.business/khoa-hoc-ai",
    type: "website",
    images: [
      {
        url: "/og-khoa-hoc-ai.png",
        width: 1200,
        height: 630,
        alt: "Khóa học AI Kiếm Tiền Thực Chiến — OPA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Khóa Học AI Kiếm Tiền Thực Chiến",
    description: "Học AI từ 0, xây workflow kiếm tiền thực chiến. 100% thực hành, cam kết kết quả.",
  },
};

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Khóa Học AI Kiếm Tiền Thực Chiến",
  description:
    "Học AI từ 0, xây kênh TikTok nội dung AI và workflow kiếm tiền thực chiến. 100% thực hành.",
  provider: {
    "@type": "Organization",
    name: "OverPowers Agency",
    url: "https://www.opa.business",
  },
  url: "https://www.opa.business/khoa-hoc-ai",
  coursePrerequisites: "Không yêu cầu kiến thức trước",
  educationalLevel: "Beginner",
  inLanguage: "vi",
  offers: [
    {
      "@type": "Offer",
      name: "Gói AI Kiếm Tiền",
      price: "10000000",
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
      url: "https://www.opa.business/khoa-hoc-ai/checkout?package=10tr",
    },
    {
      "@type": "Offer",
      name: "Gói Full Stack AI",
      price: "15000000",
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
      url: "https://www.opa.business/khoa-hoc-ai/checkout?package=15tr",
    },
  ],
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "Blended",
    instructor: {
      "@type": "Person",
      name: "Văn Minh",
      jobTitle: "CEO, OverPowers Agency",
    },
  },
};

export default function AICoursePage() {
  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
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
