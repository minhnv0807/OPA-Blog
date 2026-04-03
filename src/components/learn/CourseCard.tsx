import Image from "next/image";
import Link from "next/link";
import { BookOpen, Lock } from "lucide-react";
import { ProgressBar } from "./ProgressBar";

interface CourseCardProps {
  title: string;
  slug: string;
  thumbnail: string;
  description: string;
  tier: "tier_10000000" | "tier_15000000";
  progress?: number;
  enrolled: boolean;
}

const TIER_LABELS: Record<string, string> = {
  tier_10000000: "Gói 10.000.000đ",
  tier_15000000: "Gói 15.000.000đ",
};

export function CourseCard({
  title,
  slug,
  thumbnail,
  description,
  tier,
  progress = 0,
  enrolled,
}: CourseCardProps) {
  const tierLabel = TIER_LABELS[tier] ?? tier;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-gray-100 shrink-0">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#155eef]/10 to-[#155eef]/30">
            <BookOpen className="h-12 w-12 text-[#155eef]/60" />
          </div>
        )}
        {/* Tier badge */}
        <span className="absolute top-2 right-2 rounded-full bg-[#155eef] px-2 py-0.5 text-xs font-medium text-white">
          {tierLabel}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <h3 className="font-heading text-base font-semibold leading-snug line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>

        <div className="mt-auto pt-3">
          {enrolled ? (
            <>
              <ProgressBar percent={progress} size="sm" showLabel={true} />
              <Link
                href={`/learn/courses/${slug}`}
                className="mt-3 flex w-full items-center justify-center rounded-lg bg-[#155eef] px-4 py-2 text-sm font-medium text-white hover:bg-[#1251cc] transition-colors"
              >
                {progress > 0 ? "Tiếp tục học" : "Vào học"}
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4 shrink-0" />
              <span>Chưa đăng ký</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
