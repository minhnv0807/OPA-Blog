import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const siteUrl = "https://www.opa.business";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "OPA — AI Marketing Agency | Giải Pháp AI & Marketing Cho Doanh Nghiệp",
    template: "%s | OPA",
  },
  description:
    "OPA kết hợp sức mạnh Marketing, Công nghệ và AI tiên tiến giúp doanh nghiệp Việt Nam tăng trưởng bền vững. Tư vấn miễn phí — triển khai nhanh — đo lường ROI rõ ràng.",
  keywords: [
    "AI marketing agency",
    "agency AI Việt Nam",
    "marketing AI",
    "giải pháp AI doanh nghiệp",
    "AI automation",
    "digital marketing agency",
    "quảng cáo AI",
    "AI ads",
    "tự động hóa marketing",
    "OPA agency",
    "AI content creation",
    "TikTok marketing AI",
  ],
  authors: [{ name: "OverPowers Agency", url: siteUrl }],
  creator: "OverPowers Agency",
  publisher: "OverPowers Agency",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteUrl,
    siteName: "OPA — OverPowers Agency",
    title: "OPA — AI Marketing Agency | Giải Pháp AI & Marketing",
    description:
      "OPA kết hợp Marketing, Công nghệ và AI giúp doanh nghiệp Việt Nam tăng trưởng bền vững. Tư vấn miễn phí.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OPA — AI Marketing Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OPA — AI Marketing Agency",
    description:
      "Marketing x Công nghệ x AI — Giải pháp thực chiến cho doanh nghiệp Việt Nam.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon-opa-brand.png",
    shortcut: "/favicon-opa-brand.png",
    apple: "/favicon-opa-brand.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "OverPowers Agency",
              alternateName: "OPA",
              url: siteUrl,
              logo: `${siteUrl}/favicon-opa-brand.png`,
              description:
                "AI Marketing Agency - Kết hợp Marketing, Công nghệ và AI giúp doanh nghiệp Việt Nam tăng trưởng bền vững.",
              address: {
                "@type": "PostalAddress",
                addressCountry: "VN",
              },
              sameAs: [],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+84-848-508-585",
                contactType: "customer service",
                availableLanguage: ["Vietnamese", "English"],
              },
              areaServed: {
                "@type": "Country",
                name: "Vietnam",
              },
              knowsAbout: [
                "AI Marketing",
                "Digital Marketing",
                "Artificial Intelligence",
                "Marketing Automation",
                "TikTok Marketing",
                "Content Creation",
              ],
            }),
          }}
        />
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
