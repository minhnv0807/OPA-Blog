import mongoose, { Schema, type Document } from "mongoose";

export interface IEnrollment extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  status: "pending" | "active" | "expired" | "refunded";
  tier: "tier_10000000" | "tier_15000000";
  paymentId: string;
  amountPaid: number;
  enrolledAt: Date;
  expiresAt: Date | null;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    status: {
      type: String,
      enum: ["pending", "active", "expired", "refunded"],
      default: "pending",
    },
    tier: {
      type: String,
      required: true,
      enum: ["tier_10000000", "tier_15000000"],
    },
    paymentId: { type: String, default: "" },
    amountPaid: { type: Number, default: 0 },
    enrolledAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const Enrollment =
  mongoose.models.Enrollment || mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);
