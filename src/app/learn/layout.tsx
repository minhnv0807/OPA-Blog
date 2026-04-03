import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LearnSidebar } from "@/components/learn/LearnSidebar";

export default async function LearnLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex pt-16">
      <LearnSidebar />
      <main className="flex-1 lg:ml-64 p-6 pt-20">{children}</main>
    </div>
  );
}
