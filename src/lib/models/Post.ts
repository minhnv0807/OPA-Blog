import mongoose, { Schema, type Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
  author: mongoose.Types.ObjectId;
  status: "draft" | "published" | "archived";
  publishedAt: Date | null;
  readingTime: number;
  views: number;
  featured: boolean;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
  accessLevel: "free" | "share" | "tier_10000000" | "tier_15000000" | "custom";
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, maxlength: 300 },
    content: { type: String, required: true },
    coverImage: { type: String, default: "" },
    category: { type: Schema.Types.ObjectId, ref: "Category", index: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    author: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    publishedAt: { type: Date, default: null },
    readingTime: { type: Number, default: 1 },
    views: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    seo: {
      metaTitle: String,
      metaDescription: String,
      ogImage: String,
    },
    accessLevel: {
      type: String,
      default: "free",
      enum: ["free", "share", "tier_10000000", "tier_15000000", "custom"],
    },
  },
  { timestamps: true }
);

PostSchema.index({ status: 1, publishedAt: -1 });

export const Post =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
