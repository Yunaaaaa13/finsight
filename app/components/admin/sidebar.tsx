"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Activity, FileText, BarChart2 } from "lucide-react";

export function AdminSidebar({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  const links = [
    {
      href: "/admin",
      label: "Dashboard / Overview",
      mobileLabel: "Overview",
      icon: Activity,
      exact: true
    },
    {
      href: "/admin/analytics",
      label: "Analytics",
      mobileLabel: "Analytics",
      icon: BarChart2,
      exact: false
    },
    {
      href: "/admin/transactions",
      label: "Transactions",
      mobileLabel: "Transactions",
      icon: FileText,
      exact: false
    },
    {
      href: "/admin/users",
      label: "Users",
      mobileLabel: "Users",
      icon: Users,
      exact: false
    }
  ];

  if (isMobile) {
    return (
      <nav className="flex items-center justify-between">
        {links.map((link) => {
          const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div
                className={`flex size-10 items-center justify-center rounded-2xl transition-all duration-300 ${
                  isActive ? "bg-primary/10 shadow-sm" : ""
                }`}
              >
                <Icon className={`size-5 ${isActive ? "scale-110" : ""}`} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "opacity-100" : "opacity-80"} whitespace-nowrap`}>
                {link.mobileLabel}
              </span>
            </Link>
          );
        })}
        <Link
          href="/dashboard"
          className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground transition-all duration-300"
        >
          <div className="flex size-10 items-center justify-center rounded-2xl">
            <LayoutDashboard className="size-5" />
          </div>
          <span className="text-[10px] font-medium opacity-80">
            User View
          </span>
        </Link>
      </nav>
    );
  }

  return (
    <nav className="flex flex-col gap-2">
      {links.map((link) => {
        const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
              isActive 
                ? "bg-primary/10 text-primary" 
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="size-4" />
            {link.label}
          </Link>
        );
      })}
      
      <div className="mt-8 border-t border-border pt-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground px-4 py-3 text-sm font-medium transition-colors"
        >
          <LayoutDashboard className="size-4" />
          Back to User Dashboard
        </Link>
      </div>
    </nav>
  );
}
