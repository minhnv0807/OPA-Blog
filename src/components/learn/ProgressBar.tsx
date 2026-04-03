interface ProgressBarProps {
  percent: number;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export function ProgressBar({ percent, size = "md", showLabel = true }: ProgressBarProps) {
  const clampedPercent = Math.min(100, Math.max(0, percent));
  const heightClass = size === "sm" ? "h-1.5" : "h-2.5";

  return (
    <div className="w-full">
      <div className={`w-full rounded-full bg-gray-200 ${heightClass}`}>
        <div
          className="rounded-full bg-[#155eef] transition-all duration-300"
          style={{ width: `${clampedPercent}%`, height: "100%" }}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-xs text-muted-foreground">{clampedPercent}% hoàn thành</p>
      )}
    </div>
  );
}
