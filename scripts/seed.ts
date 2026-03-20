import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/opa-blog";

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const UserModel =
    mongoose.models.User ||
    mongoose.model(
      "User",
      new mongoose.Schema({
        name: String,
        email: { type: String, unique: true },
        password: String,
        avatar: { type: String, default: "" },
        role: { type: String, enum: ["admin", "editor"], default: "editor" },
        bio: { type: String, default: "" },
      }, { timestamps: true })
    );

  const existing = await UserModel.findOne({ email: "admin@opa.vn" });
  if (existing) {
    console.log("Admin user already exists. Skipping.");
  } else {
    const hashed = await bcrypt.hash("admin123", 12);
    await UserModel.create({
      name: "Admin",
      email: "admin@opa.vn",
      password: hashed,
      role: "admin",
      bio: "OPA Administrator",
    });
    console.log("Admin user created: admin@opa.vn / admin123");
  }

  const CategoryModel =
    mongoose.models.Category ||
    mongoose.model(
      "Category",
      new mongoose.Schema({
        name: { type: String, unique: true },
        slug: { type: String, unique: true },
        description: String,
        color: { type: String, default: "#155eef" },
        order: { type: Number, default: 0 },
      }, { timestamps: true })
    );

  const defaultCategories = [
    { name: "AI & Machine Learning", slug: "ai-ml", color: "#8b5cf6", order: 0, description: "Tri tue nhan tao va hoc may" },
    { name: "Marketing", slug: "marketing", color: "#f59e0b", order: 1, description: "Chien luoc marketing so" },
    { name: "Technology", slug: "technology", color: "#155eef", order: 2, description: "Cong nghe va phan mem" },
    { name: "Business", slug: "business", color: "#22c55e", order: 3, description: "Kinh doanh va khoi nghiep" },
    { name: "Tutorial", slug: "tutorial", color: "#ec4899", order: 4, description: "Huong dan va bai viet chia se" },
  ];

  for (const cat of defaultCategories) {
    const exists = await CategoryModel.findOne({ slug: cat.slug });
    if (!exists) {
      await CategoryModel.create(cat);
      console.log(`Category created: ${cat.name}`);
    }
  }

  await mongoose.disconnect();
  console.log("Seed complete.");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
