"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  GripVertical,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Lesson {
  _id: string;
  title: string;
  description: string;
  contentType: "video" | "text" | "quiz";
  videoUrl: string;
  textContent: string;
  isPreview: boolean;
  accessLevel: "free" | "share" | "tier_10000000" | "tier_15000000" | "custom";
  orderIndex: number;
}

interface Module {
  _id: string;
  title: string;
  description: string;
  orderIndex: number;
  lessons: Lesson[];
}

interface Props {
  courseId: string;
  modules: Module[];
}

const ACCESS_LEVEL_OPTIONS: { value: Lesson["accessLevel"]; label: string }[] =
  [
    { value: "free", label: "Free" },
    { value: "tier_10000000", label: "Gói 10.000.000đ" },
    { value: "tier_15000000", label: "Gói 15.000.000đ" },
    { value: "custom", label: "Custom" },
  ];

const CONTENT_TYPE_OPTIONS: { value: Lesson["contentType"]; label: string }[] =
  [
    { value: "video", label: "Video" },
    { value: "text", label: "Text" },
    { value: "quiz", label: "Quiz" },
  ];

// ────────────────────────────────────────────────────────────────────────────
// Lesson inline editor row
// ────────────────────────────────────────────────────────────────────────────
function LessonRow({
  lesson,
  moduleId,
  onDelete,
  onSaved,
}: {
  lesson: Lesson;
  moduleId: string;
  onDelete: (id: string) => void;
  onSaved: (updated: Lesson) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(lesson.title);
  const [description, setDescription] = useState(lesson.description);
  const [contentType, setContentType] = useState<Lesson["contentType"]>(
    lesson.contentType
  );
  const [accessLevel, setAccessLevel] = useState<Lesson["accessLevel"]>(
    lesson.accessLevel
  );
  const [isPreview, setIsPreview] = useState(lesson.isPreview);
  const [videoUrl, setVideoUrl] = useState(lesson.videoUrl);
  const [textContent, setTextContent] = useState(lesson.textContent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/lessons/${lesson._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          contentType,
          accessLevel,
          isPreview,
          videoUrl,
          textContent,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.error ?? `Lỗi ${res.status}`);
      }
      const updated = await res.json();
      onSaved(updated);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi lưu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/lessons/${lesson._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Xóa thất bại");
      onDelete(lesson._id);
    } catch {
      setError("Không thể xóa lesson");
    }
  };

  return (
    <div className="border border-border rounded-lg bg-background p-3 space-y-2">
      {/* Header row */}
      <div className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground/50 shrink-0" />
        <span className="flex-1 text-sm font-medium truncate">{lesson.title}</span>
        <span className="text-xs text-muted-foreground hidden sm:inline">
          {lesson.contentType}
        </span>
        {lesson.isPreview && (
          <span className="text-xs bg-[#155eef]/10 text-[#155eef] rounded px-1.5 py-0.5">
            Preview
          </span>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setEditing((v) => !v)}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setConfirmDelete(true)}
          className="text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <span className="flex-1">Xác nhận xóa lesson này?</span>
          <button
            onClick={handleDelete}
            className="font-medium underline underline-offset-2"
          >
            Xóa
          </button>
          <button onClick={() => setConfirmDelete(false)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Edit form */}
      {editing && (
        <div className="space-y-3 pt-1 border-t border-border">
          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Tên lesson
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Loại nội dung
              </label>
              <select
                value={contentType}
                onChange={(e) =>
                  setContentType(e.target.value as Lesson["contentType"])
                }
                className="w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20 transition-all"
              >
                {CONTENT_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Mô tả
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Quyền truy cập
              </label>
              <select
                value={accessLevel}
                onChange={(e) =>
                  setAccessLevel(e.target.value as Lesson["accessLevel"])
                }
                className="w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20 transition-all"
              >
                {ACCESS_LEVEL_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                id={`preview-${lesson._id}`}
                type="checkbox"
                checked={isPreview}
                onChange={(e) => setIsPreview(e.target.checked)}
                className="h-4 w-4 rounded border-input accent-[#155eef]"
              />
              <label
                htmlFor={`preview-${lesson._id}`}
                className="text-sm select-none"
              >
                Cho xem thử (Preview)
              </label>
            </div>
          </div>

          {contentType === "video" && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Video URL
              </label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20 transition-all"
              />
            </div>
          )}

          {contentType === "text" && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Nội dung văn bản
              </label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20 transition-all resize-y"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditing(false)}
            >
              <X className="h-3.5 w-3.5 mr-1" /> Hủy
            </Button>
            <Button
              size="sm"
              disabled={saving}
              onClick={handleSave}
              className="bg-[#155eef] hover:bg-[#2970ff] text-white"
            >
              <Save className="h-3.5 w-3.5 mr-1" />
              {saving ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Module section
// ────────────────────────────────────────────────────────────────────────────
function ModuleSection({
  module,
  courseId,
  onDelete,
  onModuleUpdated,
  onLessonAdded,
  onLessonDeleted,
  onLessonSaved,
}: {
  module: Module;
  courseId: string;
  onDelete: (id: string) => void;
  onModuleUpdated: (updated: Module) => void;
  onLessonAdded: (moduleId: string, lesson: Lesson) => void;
  onLessonDeleted: (moduleId: string, lessonId: string) => void;
  onLessonSaved: (moduleId: string, lesson: Lesson) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(module.title);
  const [savingTitle, setSavingTitle] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [addingLessonLoading, setAddingLessonLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveTitle = async () => {
    setSavingTitle(true);
    setError(null);
    try {
      const res = await fetch(`/api/modules/${module._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: titleValue }),
      });
      if (!res.ok) throw new Error("Cập nhật thất bại");
      const updated = await res.json();
      onModuleUpdated({ ...module, ...updated });
      setEditingTitle(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setSavingTitle(false);
    }
  };

  const handleDeleteModule = async () => {
    try {
      const res = await fetch(`/api/modules/${module._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Xóa thất bại");
      onDelete(module._id);
    } catch {
      setError("Không thể xóa module");
    }
  };

  const handleAddLesson = async () => {
    if (!newLessonTitle.trim()) return;
    setAddingLessonLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/modules/${module._id}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newLessonTitle.trim() }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.error ?? "Thêm lesson thất bại");
      }
      const lesson = await res.json();
      onLessonAdded(module._id, lesson);
      setNewLessonTitle("");
      setAddingLesson(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setAddingLessonLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Module header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/30">
        <GripVertical className="h-4 w-4 text-muted-foreground/50 shrink-0" />
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        {editingTitle ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              autoFocus
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTitle();
                if (e.key === "Escape") {
                  setTitleValue(module.title);
                  setEditingTitle(false);
                }
              }}
              className="flex-1 rounded-lg border border-input bg-background px-2.5 py-1 text-sm outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20 transition-all"
            />
            <Button
              size="icon-sm"
              disabled={savingTitle}
              onClick={handleSaveTitle}
              className="bg-[#155eef] hover:bg-[#2970ff] text-white"
            >
              <Save className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                setTitleValue(module.title);
                setEditingTitle(false);
              }}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <span className="flex-1 font-medium text-sm">{module.title}</span>
        )}

        {!editingTitle && (
          <>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {module.lessons.length} bài
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setEditingTitle(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setConfirmDelete(true)}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-2 text-xs text-destructive bg-destructive/5">
          {error}
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-sm text-destructive">
          <span className="flex-1">Xóa module và tất cả lesson bên trong?</span>
          <button
            onClick={handleDeleteModule}
            className="font-medium underline underline-offset-2"
          >
            Xóa
          </button>
          <button onClick={() => setConfirmDelete(false)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Lessons */}
      {expanded && (
        <div className="p-4 space-y-2">
          {module.lessons.map((lesson) => (
            <LessonRow
              key={lesson._id}
              lesson={lesson}
              moduleId={module._id}
              onDelete={(id) => onLessonDeleted(module._id, id)}
              onSaved={(updated) => onLessonSaved(module._id, updated)}
            />
          ))}

          {/* Add lesson */}
          {addingLesson ? (
            <div className="flex items-center gap-2 pt-1">
              <input
                autoFocus
                type="text"
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddLesson();
                  if (e.key === "Escape") {
                    setAddingLesson(false);
                    setNewLessonTitle("");
                  }
                }}
                placeholder="Tên lesson mới..."
                className="flex-1 rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20 transition-all"
              />
              <Button
                size="sm"
                disabled={addingLessonLoading || !newLessonTitle.trim()}
                onClick={handleAddLesson}
                className="bg-[#155eef] hover:bg-[#2970ff] text-white shrink-0"
              >
                {addingLessonLoading ? "..." : "Thêm"}
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setAddingLesson(false);
                  setNewLessonTitle("");
                }}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAddingLesson(true)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#155eef] transition-colors mt-1"
            >
              <Plus className="h-4 w-4" />
              Thêm lesson
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main editor
// ────────────────────────────────────────────────────────────────────────────
export default function ModuleLessonEditor({ courseId, modules: initialModules }: Props) {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [addingModule, setAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [addingModuleLoading, setAddingModuleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return;
    setAddingModuleLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/courses/${courseId}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newModuleTitle.trim() }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.error ?? "Thêm module thất bại");
      }
      const newModule = await res.json();
      setModules((prev) => [...prev, { ...newModule, lessons: [] }]);
      setNewModuleTitle("");
      setAddingModule(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setAddingModuleLoading(false);
    }
  };

  const handleModuleDelete = (moduleId: string) => {
    setModules((prev) => prev.filter((m) => m._id !== moduleId));
  };

  const handleModuleUpdated = (updated: Module) => {
    setModules((prev) =>
      prev.map((m) =>
        m._id === updated._id ? { ...m, title: updated.title, description: updated.description } : m
      )
    );
  };

  const handleLessonAdded = (moduleId: string, lesson: Lesson) => {
    setModules((prev) =>
      prev.map((m) =>
        m._id === moduleId ? { ...m, lessons: [...m.lessons, lesson] } : m
      )
    );
  };

  const handleLessonDeleted = (moduleId: string, lessonId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m._id === moduleId
          ? { ...m, lessons: m.lessons.filter((l) => l._id !== lessonId) }
          : m
      )
    );
  };

  const handleLessonSaved = (moduleId: string, updatedLesson: Lesson) => {
    setModules((prev) =>
      prev.map((m) =>
        m._id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l._id === updatedLesson._id ? updatedLesson : l
              ),
            }
          : m
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)]">
          Modules & Lessons
        </h2>
        <span className="text-sm text-muted-foreground">{modules.length} module</span>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Module list */}
      <div className="space-y-3">
        {modules.map((module) => (
          <ModuleSection
            key={module._id}
            module={module}
            courseId={courseId}
            onDelete={handleModuleDelete}
            onModuleUpdated={handleModuleUpdated}
            onLessonAdded={handleLessonAdded}
            onLessonDeleted={handleLessonDeleted}
            onLessonSaved={handleLessonSaved}
          />
        ))}
      </div>

      {/* Add module */}
      {addingModule ? (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            type="text"
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddModule();
              if (e.key === "Escape") {
                setAddingModule(false);
                setNewModuleTitle("");
              }
            }}
            placeholder="Tên module mới..."
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20 transition-all"
          />
          <Button
            size="sm"
            disabled={addingModuleLoading || !newModuleTitle.trim()}
            onClick={handleAddModule}
            className="bg-[#155eef] hover:bg-[#2970ff] text-white shrink-0"
          >
            {addingModuleLoading ? "..." : "Thêm"}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setAddingModule(false);
              setNewModuleTitle("");
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAddingModule(true)}
          className="gap-1.5 border-dashed"
        >
          <Plus className="h-4 w-4" />
          Thêm module
        </Button>
      )}
    </div>
  );
}
