import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoVariant = "nav" | "footer";

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  invert?: boolean;
  className?: string;
  priority?: boolean;
}

const dimensions = {
  nav: {
    width: 772,
    height: 261,
    className:
      "h-10 sm:h-11 lg:h-12 xl:h-[3.35rem] w-auto object-contain drop-shadow-[0_10px_24px_rgba(21,94,239,0.18)] saturate-[1.04] transition-transform duration-300 group-hover:scale-[1.035]",
  },
  footer: {
    width: 772,
    height: 261,
    className:
      "h-11 sm:h-12 lg:h-[3.35rem] w-auto object-contain opacity-95 transition-transform duration-300 group-hover:scale-[1.02]",
  },
} as const;

export function BrandLogo({
  variant = "nav",
  invert = false,
  className,
  priority = false,
}: BrandLogoProps) {
  const config = dimensions[variant];

  return (
    <Image
      src="/logo-web.png"
      alt="OPA"
      width={config.width}
      height={config.height}
      priority={priority}
      sizes={
        variant === "nav"
          ? "(max-width: 640px) 120px, (max-width: 1024px) 148px, 176px"
          : "(max-width: 640px) 144px, 176px"
      }
      className={cn(config.className, invert && "brightness-0 invert", className)}
    />
  );
}
