import mongoose, { Schema, type Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  price: number;
  tier: "tier_10000000" | "tier_15000000";
  status: "draft" | "published" | "archived";
  orderIndex: number;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    price: { type: Number, required: true },
    tier: {
      type: String,
      required: true,
      enum: ["tier_10000000", "tier_15000000"],
    },
    status: {
      type: String,
      default: "draft",
      enum: ["draft", "published", "archived"],
      index: true,
    },
    orderIndex: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Course =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
