"use client";

import { ShoppingCart, Car, Receipt, Gamepad2, HeartPulse, ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopCategory {
  category: string;
  amount: number;
  percent: number;
}

interface TopCategoriesProps {
  categories: TopCategory[];
}

const categoryConfig: Record<string, { icon: typeof ShoppingCart; color: string; barColor: string }> = {
  "Makanan & Minuman": {
    icon: ShoppingCart,
    color: "text-amber-500 bg-amber-500/10 dark:bg-amber-400/15",
    barColor: "bg-gradient-to-r from-amber-400 to-orange-500",
  },
  Transportasi: {
    icon: Car,
    color: "text-sky-500 bg-sky-500/10 dark:bg-sky-400/15",
    barColor: "bg-gradient-to-r from-sky-400 to-blue-500",
  },
  Tagihan: {
    icon: Receipt,
    color: "text-violet-500 bg-violet-500/10 dark:bg-violet-400/15",
    barColor: "bg-gradient-to-r from-violet-400 to-purple-500",
  },
  Hiburan: {
    icon: Gamepad2,
    color: "text-rose-500 bg-rose-500/10 dark:bg-rose-400/15",
    barColor: "bg-gradient-to-r from-rose-400 to-pink-500",
  },
  Kesehatan: {
    icon: HeartPulse,
    color: "text-emerald-500 bg-emerald-500/10 dark:bg-emerald-400/15",
    barColor: "bg-gradient-to-r from-emerald-400 to-teal-500",
  },
};

const defaultConfig = {
  icon: ShoppingCart,
  color: "text-muted-foreground bg-muted",
  barColor: "bg-primary",
};

export function TopCategories({ categories }: TopCategoriesProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 card-glow animate-float-in" style={{ animationDelay: "500ms" }}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-violet-500/10 dark:bg-violet-400/15">
            <ListFilter className="size-[18px] text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Top Kategori</p>
            <h2 className="text-lg font-bold text-foreground">Pengeluaran Terbesar</h2>
          </div>
        </div>
        <span className="rounded-full bg-muted px-2.5 py-1 text-[0.65rem] font-semibold text-muted-foreground">
          Bulan Ini
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-muted/50 mb-3">
              <ListFilter className="size-5 text-muted-foreground/40" />
            </div>
            <p className="text-xs text-muted-foreground">Belum ada data pengeluaran bulan ini</p>
          </div>
        ) : categories.map((item, i) => {
          const config = categoryConfig[item.category] ?? defaultConfig;
          const Icon = config.icon;
          return (
            <div
              key={item.category}
              className="group animate-float-in"
              style={{ animationDelay: `${600 + i * 80}ms` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110", config.color)}>
                  <Icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground truncate">{item.category}</p>
                  <p className="text-sm font-bold text-foreground tabular-nums shrink-0">
                    Rp {item.amount.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
              <div className="ml-11">
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/60">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700 ease-out", config.barColor)}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                  <span className="text-[0.6rem] font-semibold text-muted-foreground tabular-nums w-8 text-right">
                    {item.percent}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
