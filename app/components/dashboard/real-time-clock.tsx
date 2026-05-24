"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function RealTimeClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    // Update the time every second
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }));
    }, 1000);
    
    // Set initial time
    const now = new Date();
    setTime(now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }));

    return () => clearInterval(interval);
  }, []);

  if (!time) return null; // Avoid hydration mismatch by not rendering until mounted

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 bg-muted/50 rounded-lg border border-border/50 text-muted-foreground">
      <Clock className="size-3.5 text-primary" />
      <span>{time}</span>
    </div>
  );
}
