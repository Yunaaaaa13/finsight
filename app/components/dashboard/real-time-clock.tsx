"use client";

import { useEffect, useState, useMemo } from "react";
import { Clock, Sun, Sunset, Moon, CloudMoon, Banknote, TrendingUp, Wallet, CalendarCheck, Bell } from "lucide-react";

// ─── Financial Reminders based on time ───────────
function getFinancialReminder(hour: number, dayOfWeek: number, dayOfMonth: number) {
  // End of month reminder (25-31)
  if (dayOfMonth >= 25) {
    return {
      text: "Akhir bulan! Saatnya evaluasi pengeluaran bulan ini.",
      icon: CalendarCheck,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    };
  }

  // Morning - planning time
  if (hour >= 5 && hour < 10) {
    return {
      text: "Pagi yang tepat untuk merencanakan anggaran hari ini!",
      icon: TrendingUp,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    };
  }

  // Midday - lunch spending alert
  if (hour >= 10 && hour < 14) {
    return {
      text: "Jangan lupa catat pengeluaran makan siang Anda.",
      icon: Wallet,
      color: "text-sky-400",
      bgColor: "bg-sky-500/10",
      borderColor: "border-sky-500/20",
    };
  }

  // Afternoon - review time
  if (hour >= 14 && hour < 18) {
    return {
      text: "Waktu yang baik untuk review transaksi hari ini.",
      icon: Banknote,
      color: "text-violet-400",
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-500/20",
    };
  }

  // Evening - daily summary
  if (hour >= 18 && hour < 21) {
    return {
      text: "Malam ini, cek ringkasan pengeluaran harian Anda.",
      icon: Bell,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    };
  }

  // Night
  return {
    text: "Pastikan semua transaksi hari ini sudah tercatat.",
    icon: CalendarCheck,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
  };
}

function getGreetingData(hour: number) {
  if (hour >= 5 && hour < 12) {
    return { greeting: "Selamat Pagi", icon: Sun, color: "text-amber-400", glowColor: "shadow-amber-500/20" };
  }
  if (hour >= 12 && hour < 15) {
    return { greeting: "Selamat Siang", icon: Sun, color: "text-orange-400", glowColor: "shadow-orange-500/20" };
  }
  if (hour >= 15 && hour < 18) {
    return { greeting: "Selamat Sore", icon: Sunset, color: "text-rose-400", glowColor: "shadow-rose-500/20" };
  }
  if (hour >= 18 && hour < 21) {
    return { greeting: "Selamat Malam", icon: Moon, color: "text-indigo-400", glowColor: "shadow-indigo-500/20" };
  }
  return { greeting: "Selamat Malam", icon: CloudMoon, color: "text-slate-400", glowColor: "shadow-slate-500/20" };
}

// ─── Main Component ──────────────────────────────

export function RealTimeClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!now) return null;

  const hour = now.getHours();
  const dayOfWeek = now.getDay();
  const dayOfMonth = now.getDate();

  const timeStr = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const dateStr = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const { greeting, icon: GreetingIcon, color: greetingColor, glowColor } = getGreetingData(hour);
  const reminder = getFinancialReminder(hour, dayOfWeek, dayOfMonth);
  const ReminderIcon = reminder.icon;

  // Animated seconds indicator
  const seconds = now.getSeconds();
  const progress = (seconds / 60) * 100;

  return (
    <div className="w-full rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-4 card-glow overflow-hidden relative">
      {/* Subtle gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-chart-3/[0.03] pointer-events-none" />

      <div className="relative flex flex-col gap-3">
        {/* Top row: Greeting + Time */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`flex size-9 items-center justify-center rounded-xl ${reminder.bgColor} ${reminder.borderColor} border transition-all`}>
              <GreetingIcon className={`size-[18px] ${greetingColor} drop-shadow-sm`} />
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-semibold ${greetingColor}`}>{greeting}</p>
              <p className="text-[11px] text-muted-foreground truncate">{dateStr}</p>
            </div>
          </div>

          {/* Digital Clock */}
          <div className="flex flex-col items-end gap-0.5">
            <div className="flex items-center gap-1.5 tabular-nums">
              <Clock className="size-3.5 text-primary" />
              <span className="text-lg font-bold tracking-tight text-foreground font-mono">{timeStr}</span>
            </div>
            {/* Seconds progress bar */}
            <div className="w-20 h-[3px] rounded-full bg-muted/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Financial Reminder */}
        <div className={`flex items-center gap-2.5 rounded-xl ${reminder.bgColor} ${reminder.borderColor} border px-3 py-2.5 transition-all`}>
          <ReminderIcon className={`size-4 ${reminder.color} shrink-0`} />
          <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
            <span className={`font-semibold ${reminder.color}`}>💡 Reminder: </span>
            {reminder.text}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Compact version for inline use ──────────────

export function RealTimeClockCompact() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 bg-muted/50 rounded-lg border border-border/50 text-muted-foreground">
      <Clock className="size-3.5 text-primary animate-pulse" />
      <span className="font-mono tabular-nums tracking-tight">{time}</span>
    </div>
  );
}
