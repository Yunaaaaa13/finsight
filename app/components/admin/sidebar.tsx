"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Activity, FileText } from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    {
      href: "/admin",
      label: "Platform Analytics",
      icon: Activity,
      exact: true
    },
    {
      href: "/admin/transactions",
      label: "Global Transactions",
      icon: FileText,
      exact: false
    },
    {
      href: "/admin/users",
      label: "User Management",
      icon: Users,
      exact: false
    }
  ];

  return (
    <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
      {links.map((link) => {
        const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
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
      
      <div className="md:mt-8 border-t border-border pt-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap"
        >
          <LayoutDashboard className="size-4" />
          Back to User Dashboard
        </Link>
      </div>
    </nav>
  );
}
