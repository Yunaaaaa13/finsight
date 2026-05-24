"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface SummaryCardProps {
  label: string;
  value: string;
  delta: string;
  accent: string;
  index?: number;
}

const cardConfigs = [
  {
    gradient: "gradient-emerald",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-400/15",
    icon: TrendingUp,
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    gradient: "gradient-violet",
    iconBg: "bg-rose-500/10 dark:bg-rose-400/15",
    icon: TrendingDown,
    iconColor: "text-rose-500 dark:text-rose-400",
  },
  {
    gradient: "gradient-sky",
    iconBg: "bg-sky-500/10 dark:bg-sky-400/15",
    icon: Wallet,
    iconColor: "text-sky-600 dark:text-sky-400",
  },
  {
    gradient: "gradient-amber",
    iconBg: "bg-violet-500/10 dark:bg-violet-400/15",
    icon: PiggyBank,
    iconColor: "text-violet-600 dark:text-violet-400",
  },
];

export function SummaryCard({ label, value, delta, accent, index = 0 }: SummaryCardProps) {
  const config = cardConfigs[index % cardConfigs.length];
  const Icon = config.icon;
  const isPositive = delta.startsWith("+");

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 card-glow animate-float-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Subtle gradient accent at top */}
      <div className={cn("absolute inset-x-0 top-0 h-1 opacity-80", config.gradient)} />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-1.5 text-lg md:text-xl font-bold tracking-tighter text-foreground whitespace-nowrap">{value}</p>
        </div>
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110", config.iconBg)}>
          <Icon className={cn("size-5", config.iconColor)} />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        {isPositive ? (
          <ArrowUpRight className="size-3.5 text-emerald-500" />
        ) : (
          <ArrowDownRight className="size-3.5 text-rose-500" />
        )}
        <span className={cn("text-xs font-semibold", accent)}>{delta}</span>
        <span className="text-[0.65rem] text-muted-foreground/70 ml-1">vs bulan lalu</span>
      </div>
    </div>
  );
}
