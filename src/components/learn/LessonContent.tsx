"use client";

import { CheckCircle2, ChevronRight } from "lucide-react";
import { VideoPlayer } from "./VideoPlayer";
import { AttachmentList } from "./AttachmentList";

interface Attachment {
  title: string;
  fileUrl: string;
  fileType: string;
}

interface Lesson {
  _id: string;
  title: string;
  description: string;
  contentType: "video" | "text" | "quiz";
  videoUrl: string;
  textContent: string;
  attachments: Attachment[];
}

interface LessonContentProps {
  lesson: Lesson;
  isCompleted: boolean;
  onMarkComplete: () => void;
  onNextLesson: () => void;
  hasNext: boolean;
}

export function LessonContent({
  lesson,
  isCompleted,
  onMarkComplete,
  onNextLesson,
  hasNext,
}: LessonContentProps) {
  const handleMarkComplete = async () => {
    try {
      await fetch(`/api/progress/${lesson._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progressPercent: 100 }),
      });
      onMarkComplete();
    } catch (error) {
      console.error("Failed to mark lesson as complete:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
      {lesson.contentType === "video" && (
        <VideoPlayer videoUrl={lesson.videoUrl} title={lesson.title} />
      )}

      {lesson.contentType === "text" && lesson.textContent && (
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: lesson.textContent }}
        />
      )}

      <div>
        <h1 className="text-xl font-bold text-foreground">{lesson.title}</h1>
        {lesson.description && (
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{lesson.description}</p>
        )}
      </div>

      <AttachmentList attachments={lesson.attachments} />

      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        {isCompleted ? (
          <button
            disabled
            className="flex items-center gap-2 rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700 cursor-not-allowed"
          >
            <CheckCircle2 className="h-4 w-4" />
            Đã hoàn thành
          </button>
        ) : (
          <button
            onClick={handleMarkComplete}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
          >
            <CheckCircle2 className="h-4 w-4" />
            Hoàn thành bài học
          </button>
        )}

        {hasNext && (
          <button
            onClick={onNextLesson}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-foreground hover:bg-gray-50 transition-colors"
          >
            Bài tiếp theo
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
