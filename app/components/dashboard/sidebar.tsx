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
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface SidebarProps {
  activeView: "dashboard" | "transactions" | "analytics";
  onViewChange: (view: "dashboard" | "transactions" | "analytics") => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };
  const navItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "transactions" as const, label: "Transaksi", icon: Wallet },
    { id: "analytics" as const, label: "Analitik", icon: BarChart3 },
    { id: "reports" as const, label: "Laporan", icon: FileText },
  ];

  return (
    <aside className="hidden h-fit rounded-3xl border border-border bg-card p-6 shadow-sm card-glow lg:block">
      {/* Brand */}
      <div className="flex items-center gap-3 pb-6 border-b border-border">
        <div className="flex size-10 items-center justify-center rounded-xl gradient-emerald shadow-md">
          <TrendingUp className="size-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">Finsight</h2>
          <p className="text-xs text-muted-foreground">Financial Dashboard</p>
        </div>
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
                key={item.label}
                onClick={() => {
                  if (item.id === "dashboard" || item.id === "transactions" || item.id === "analytics") {
                    onViewChange(item.id);
                  }
                }}
                className={`w-full group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold shadow-sm"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                } ${
                  item.id !== "dashboard" && item.id !== "transactions" && item.id !== "analytics"
                    ? "opacity-50 cursor-not-allowed" 
                    : "cursor-pointer"
                }`}
              >
                <Icon className={`size-[18px] transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-primary" : ""}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && (
                  <ChevronRight className="size-3.5 text-primary/60" />
                )}
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

      <div className="mt-4 pt-4 border-t border-border">
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
