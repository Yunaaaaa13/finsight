import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, LogOut, ShieldCheck } from "lucide-react";
import { AdminSidebar } from "@/app/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect admin routes
  if (!user) {
    redirect("/login");
  }
  
  if (user.app_metadata?.role !== "Admin") {
    // If not an admin, send back to regular dashboard
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-r border-border bg-card md:min-h-screen p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <ShieldCheck className="size-5 text-emerald-500" />
          </div>
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
        
        <AdminSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
