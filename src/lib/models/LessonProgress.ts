import mongoose, { Schema, type Document } from "mongoose";

export interface ILessonProgress extends Document {
  userId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  status: "not_started" | "in_progress" | "completed";
  progressPercent: number;
  lastPosition: number;
  completedAt: Date | null;
}

const LessonProgressSchema = new Schema<ILessonProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true, index: true },
    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed"],
      default: "not_started",
    },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    lastPosition: { type: Number, default: 0 },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

LessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

export const LessonProgress =
  mongoose.models.LessonProgress ||
  mongoose.model<ILessonProgress>("LessonProgress", LessonProgressSchema);
