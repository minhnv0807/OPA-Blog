"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { LessonList, type LessonListLesson, type LessonListModule } from "@/components/learn/LessonList";
import { LessonContent } from "@/components/learn/LessonContent";

// ─── Types ───────────────────────────────────────────────────────────────────

type Lesson = LessonListLesson;
type Module = LessonListModule;

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  modules: Module[];
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CourseLearnPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [course, setCourse] = useState<Course | null>(null);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrollmentTier, setEnrollmentTier] = useState<
    "tier_10000000" | "tier_15000000" | null
  >(null);

  // ─── Helpers ─────────────────────────────────────────────────────────────

  const getAllLessons = useCallback((c: Course): Lesson[] => {
    return c.modules.flatMap((m) => m.lessons);
  }, []);

  const hasAccessToLesson = useCallback(
    (lesson: Lesson): boolean => {
      if (lesson.accessLevel === "free" || lesson.isPreview) return true;
      if (!enrollmentTier) return false;
      if (enrollmentTier === "tier_15000000") return true;
      if (enrollmentTier === "tier_10000000") {
        return (
          lesson.accessLevel === "tier_10000000" || lesson.accessLevel === "share"
        );
      }
      return false;
    },
    [enrollmentTier]
  );

  // ─── Fetch progress for all lessons ──────────────────────────────────────

  const fetchProgress = useCallback(async (c: Course) => {
    const allLessons = c.modules.flatMap((m) => m.lessons);
    const results = await Promise.allSettled(
      allLessons.map((lesson) =>
        fetch(`/api/progress/${lesson._id}`).then((r) => r.json())
      )
    );

    const completed = new Set<string>();
    results.forEach((result, index) => {
      if (
        result.status === "fulfilled" &&
        result.value?.data?.status === "completed"
      ) {
        completed.add(allLessons[index]._id);
      }
    });
    setCompletedIds(completed);
  }, []);

  // ─── Initial load ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status !== "authenticated") return;

    const load = async () => {
      setLoading(true);
      try {
        // Fetch all courses to find the one by slug
        const coursesRes = await fetch("/api/courses");
        const coursesData = await coursesRes.json();
        if (!coursesData.success) return;

        const found = (coursesData.data as Array<{ _id: string; slug: string }>).find(
          (c) => c.slug === slug
        );
        if (!found) {
          router.push("/learn/courses");
          return;
        }

        // Fetch full course with modules and lessons
        const courseRes = await fetch(`/api/courses/${found._id}`);
        const courseData = await courseRes.json();
        if (!courseData.success) return;

        const loadedCourse: Course = courseData.data;
        setCourse(loadedCourse);

        // Fetch enrollment tier
        const enrollRes = await fetch("/api/enrollments/my");
        const enrollData = await enrollRes.json();
        if (enrollData.success) {
          const enrollment = (
            enrollData.data as Array<{
              courseId: { _id: string };
              tier: "tier_10000000" | "tier_15000000";
            }>
          ).find(
            (e) =>
              e.courseId._id === loadedCourse._id ||
              (e.courseId as unknown as string) === loadedCourse._id
          );
          if (enrollment) {
            setEnrollmentTier(enrollment.tier);
          }
        }

        // Fetch progress
        await fetchProgress(loadedCourse);

        // Select first accessible lesson
        const firstLesson = getAllLessons(loadedCourse)[0];
        if (firstLesson) {
          setCurrentLessonId(firstLesson._id);
          setCurrentLesson(firstLesson);
        }
      } catch (error) {
        console.error("Failed to load course:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug, status, router, fetchProgress, getAllLessons]);

  // ─── Lesson selection ────────────────────────────────────────────────────

  const handleSelectLesson = useCallback(
    (lessonId: string) => {
      if (!course) return;
      const lesson = getAllLessons(course).find((l) => l._id === lessonId);
      if (!lesson) return;
      setCurrentLessonId(lessonId);
      setCurrentLesson(lesson);
      setSidebarOpen(false);
    },
    [course, getAllLessons]
  );

  const handleMarkComplete = useCallback(() => {
    if (!currentLessonId) return;
    setCompletedIds((prev) => new Set([...prev, currentLessonId]));
  }, [currentLessonId]);

  const handleNextLesson = useCallback(() => {
    if (!course || !currentLessonId) return;
    const allLessons = getAllLessons(course);
    const currentIndex = allLessons.findIndex((l) => l._id === currentLessonId);
    const nextLesson = allLessons[currentIndex + 1];
    if (nextLesson) {
      setCurrentLessonId(nextLesson._id);
      setCurrentLesson(nextLesson);
      setSidebarOpen(false);
    }
  }, [course, currentLessonId, getAllLessons]);

  // ─── Overall progress ────────────────────────────────────────────────────

  const overallProgress = course
    ? (() => {
        const allLessons = getAllLessons(course);
        if (allLessons.length === 0) return 0;
        return Math.round((completedIds.size / allLessons.length) * 100);
      })()
    : 0;

  const hasNext = course
    ? (() => {
        if (!currentLessonId) return false;
        const allLessons = getAllLessons(course);
        const currentIndex = allLessons.findIndex((l) => l._id === currentLessonId);
        return currentIndex < allLessons.length - 1;
      })()
    : false;

  // ─── Render ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#155eef] border-t-transparent" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Không tìm thấy khóa học.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#155eef] text-white shadow-lg lg:hidden"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed top-0 left-0 z-40 h-full w-80 flex-col border-r border-gray-200 bg-white transition-transform duration-300",
          "lg:static lg:flex lg:translate-x-0",
          sidebarOpen ? "flex translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
          <h2 className="text-sm font-semibold leading-snug line-clamp-2">{course.title}</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-2 shrink-0 rounded p-1 hover:bg-gray-100 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <LessonList
            modules={course.modules}
            currentLessonId={currentLessonId}
            completedLessonIds={completedIds}
            hasAccess={hasAccessToLesson}
            onSelectLesson={handleSelectLesson}
            overallProgress={overallProgress}
          />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {currentLesson ? (
          <LessonContent
            lesson={currentLesson}
            isCompleted={completedIds.has(currentLesson._id)}
            onMarkComplete={handleMarkComplete}
            onNextLesson={handleNextLesson}
            hasNext={hasNext}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Chọn một bài học để bắt đầu.</p>
          </div>
        )}
      </main>
    </div>
  );
}
