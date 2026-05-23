"use client";

import { useRouter } from "next/navigation";
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Wallet,
  TrendingUp,
  ChevronRight,
  LogOut,
  User,
  Home,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface SidebarProps {
  activeView: "dashboard" | "transactions" | "analytics" | "profile";
  onViewChange: (view: "dashboard" | "transactions" | "analytics" | "profile") => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.app_metadata?.role === "Admin") {
        setIsAdmin(true);
      }
    });
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };
  const navItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "transactions" as const, label: "Transaksi", icon: Wallet },
    { id: "analytics" as const, label: "Analitik", icon: BarChart3 },
    { id: "profile" as const, label: "Profil Saya", icon: User },
  ];

  return (
    <aside className="hidden h-fit rounded-3xl border border-border bg-card p-6 shadow-sm card-glow lg:block">
      {/* Brand */}
      <div className="flex items-center justify-between pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl gradient-emerald shadow-md">
            <TrendingUp className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">FinSight</h2>
            <p className="text-xs text-muted-foreground">Financial Dashboard</p>
          </div>
        </div>
        <Link 
          href="/" 
          title="Ke Beranda"
          className="flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300"
        >
          <Home className="size-[18px]" />
        </Link>
      </div>

      {/* Navigation */}
      <div className="pt-6">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70 mb-3">
          Menu Utama
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`size-5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                  />
                  {item.label}
                </div>
                <ChevronRight
                  className={`size-4 transition-all duration-300 ${
                    isActive
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom card */}
      <div className="mt-8 rounded-2xl gradient-emerald p-4 text-white">
        <p className="text-xs font-semibold opacity-80">Pro Insight</p>
        <p className="mt-1 text-[0.7rem] leading-relaxed opacity-70">
          Upgrade ke Pro untuk analitik prediktif dan laporan otomatis.
        </p>
        <button className="mt-3 w-full rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm transition-colors hover:bg-white/30">
          Pelajari Selengkapnya
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
        {isAdmin && (
          <Link
            href="/admin/users"
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-violet-500 transition-all duration-200 hover:bg-violet-500/10 font-medium"
          >
            <User className="size-[18px]" />
            <span>Admin Panel</span>
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-rose-500 transition-all duration-200 hover:bg-rose-500/10 font-medium"
        >
          <LogOut className="size-[18px]" />
          <span>Keluar Akun</span>
        </button>
      </div>
    </aside>
  );
}
