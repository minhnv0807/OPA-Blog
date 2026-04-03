import { Play } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

export function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  if (!videoUrl) {
    return (
      <div className="relative aspect-video rounded-xl bg-gray-900 flex flex-col items-center justify-center gap-3">
        <Play className="h-12 w-12 text-gray-600" />
        <p className="text-sm text-gray-500">Video chưa được tải lên</p>
      </div>
    );
  }

  if (videoUrl.includes("iframe") || videoUrl.includes("embed")) {
    return (
      <div className="relative aspect-video rounded-xl overflow-hidden">
        <iframe
          src={videoUrl}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
      <video
        src={videoUrl}
        title={title}
        controls
        controlsList="nodownload"
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
