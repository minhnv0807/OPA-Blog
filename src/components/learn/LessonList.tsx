"use client";

import React from "react";
import { CheckCircle2, PlayCircle, Circle, Lock } from "lucide-react";
import { ProgressBar } from "./ProgressBar";

interface Attachment {
  title: string;
  fileUrl: string;
  fileType: string;
}

export interface LessonListLesson {
  _id: string;
  title: string;
  description: string;
  contentType: "video" | "text" | "quiz";
  videoUrl: string;
  textContent: string;
  isPreview: boolean;
  accessLevel: "free" | "share" | "tier_10000000" | "tier_15000000" | "custom";
  orderIndex: number;
  attachments: Attachment[];
}

export interface LessonListModule {
  _id: string;
  title: string;
  orderIndex: number;
  lessons: LessonListLesson[];
}

interface LessonListProps {
  modules: LessonListModule[];
  currentLessonId: string | null;
  completedLessonIds: Set<string>;
  hasAccess: (lesson: LessonListLesson) => boolean;
  onSelectLesson: (id: string) => void;
  overallProgress: number;
}

export function LessonList({
  modules,
  currentLessonId,
  completedLessonIds,
  hasAccess,
  onSelectLesson,
  overallProgress,
}: LessonListProps): React.JSX.Element {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-200">
        <ProgressBar percent={overallProgress} size="sm" showLabel />
      </div>

      <div className="flex-1 overflow-y-auto">
        {modules.map((module, moduleIndex) => (
          <div key={module._id} className="border-b border-gray-100 last:border-b-0">
            <div className="px-4 py-3 bg-gray-50">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Module {moduleIndex + 1}: {module.title}
              </p>
            </div>

            <ul className="py-1">
              {module.lessons.map((lesson) => {
                const isCompleted = completedLessonIds.has(lesson._id);
                const isCurrent = currentLessonId === lesson._id;
                const accessible = hasAccess(lesson);

                return (
                  <li key={lesson._id}>
                    <button
                      onClick={() => onSelectLesson(lesson._id)}
                      disabled={!accessible}
                      className={[
                        "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors",
                        isCurrent
                          ? "bg-[#155eef]/10 text-[#155eef] font-medium"
                          : "hover:bg-gray-50 text-foreground",
                        !accessible ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <span className="shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : isCurrent ? (
                          <PlayCircle className="h-4 w-4 text-[#155eef]" />
                        ) : accessible ? (
                          <Circle className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Lock className="h-4 w-4 text-gray-400" />
                        )}
                      </span>
                      <span className="flex-1 leading-snug">{lesson.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
