import Link from "next/link";
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Wallet,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "#dashboard", icon: LayoutDashboard, active: true },
  { label: "Transaksi", href: "#transactions", icon: Wallet, active: false },
  { label: "Analitik", href: "#analytics", icon: BarChart3, active: false },
  { label: "Laporan", href: "#reports", icon: FileText, active: false },
];

export function Sidebar() {
  return (
    <aside className="hidden h-fit rounded-3xl border border-border bg-card p-6 shadow-sm lg:block">
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">Menu</p>
          <h2 className="mt-4 text-2xl font-semibold text-foreground">Navigasi</h2>
        </div>

        <nav className="space-y-2 pt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-3xl px-4 py-3 transition-all hover:bg-muted/60 ${
                  item.active ? "bg-primary/10 text-primary" : "text-foreground/80"
                }`}
              >
                <Icon className="size-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
