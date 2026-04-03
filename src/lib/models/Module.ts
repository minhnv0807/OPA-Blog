import mongoose, { Schema, type Document } from "mongoose";

export interface IModule extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  orderIndex: number;
}

const ModuleSchema = new Schema<IModule>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, default: "" },
    orderIndex: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Module =
  mongoose.models.Module || mongoose.model<IModule>("Module", ModuleSchema);
