import mongoose, { Schema, type Document } from "mongoose";

export interface IAttachment {
  title: string;
  fileUrl: string;
  fileType: string;
}

export interface ILesson extends Document {
  moduleId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  contentType: "video" | "text" | "quiz";
  videoUrl: string;
  textContent: string;
  isPreview: boolean;
  accessLevel: "free" | "share" | "tier_10000000" | "tier_15000000" | "custom";
  orderIndex: number;
  attachments: IAttachment[];
}

const AttachmentSchema = new Schema<IAttachment>(
  {
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, default: "" },
  },
  { _id: false }
);

const LessonSchema = new Schema<ILesson>(
  {
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: "Module",
      required: true,
      index: true,
    },
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, default: "" },
    contentType: {
      type: String,
      default: "video",
      enum: ["video", "text", "quiz"],
    },
    videoUrl: { type: String, default: "" },
    textContent: { type: String, default: "" },
    isPreview: { type: Boolean, default: false },
    accessLevel: {
      type: String,
      default: "free",
      enum: ["free", "share", "tier_10000000", "tier_15000000", "custom"],
    },
    orderIndex: { type: Number, default: 0 },
    attachments: { type: [AttachmentSchema], default: [] },
  },
  { timestamps: true }
);

export const Lesson =
  mongoose.models.Lesson || mongoose.model<ILesson>("Lesson", LessonSchema);
