import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const users = await User.find()
    .select("-password")
    .sort({ createdAt: -1 })
    .lean();

  return Response.json({ success: true, data: users });
}
