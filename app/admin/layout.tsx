import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";
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
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row pb-16 md:pb-0 relative overflow-hidden">
      {/* ─── Animated Background Decorations ─── */}
      {/* Drifting gradient orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />
      <div className="bg-orb bg-orb-4" />

      {/* Morphing mesh gradient blob */}
      <div className="bg-mesh-blob" />

      {/* Subtle grid pattern overlay */}
      <div className="bg-grid-pattern" />

      {/* Floating particles */}
      <div className="bg-particle bg-particle-1" />
      <div className="bg-particle bg-particle-2" />
      <div className="bg-particle bg-particle-3" />
      <div className="bg-particle bg-particle-4" />
      <div className="bg-particle bg-particle-5" />
      <div className="bg-particle bg-particle-6" />
      <div className="bg-particle bg-particle-7" />
      <div className="bg-particle bg-particle-8" />

      {/* Admin Sidebar (Desktop only for the side layout) */}
      <aside className="hidden md:flex w-64 border-r border-border/50 bg-card/60 backdrop-blur-xl min-h-screen p-4 flex-col gap-4 sticky top-0 relative z-10">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <ShieldCheck className="size-5 text-emerald-500" />
          </div>
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
        <AdminSidebar />
      </aside>

      {/* Mobile Header (Admin Panel) */}
      <header className="md:hidden flex items-center gap-2 border-b border-border/50 bg-card/60 backdrop-blur-xl p-4 sticky top-0 z-40 relative">
        <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10">
          <ShieldCheck className="size-5 text-emerald-500" />
        </div>
        <span className="font-bold text-lg">Admin Panel</span>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full relative z-10">
        {children}
      </main>

      {/* Mobile Bottom Nav Wrapper */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/60 backdrop-blur-xl px-4 py-3 pb-safe">
        <AdminSidebar isMobile={true} />
      </div>
    </div>
  );
}
