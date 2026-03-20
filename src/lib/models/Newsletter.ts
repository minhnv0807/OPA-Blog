import mongoose, { Schema, type Document } from "mongoose";

export interface INewsletter extends Document {
  email: string;
  active: boolean;
}

const NewsletterSchema = new Schema<INewsletter>(
  {
    email: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Newsletter =
  mongoose.models.Newsletter ||
  mongoose.model<INewsletter>("Newsletter", NewsletterSchema);
