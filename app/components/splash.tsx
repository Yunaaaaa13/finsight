"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Loader2 } from "lucide-react";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Check if we already showed it in this session to prevent annoyance on every reload
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    
    if (hasSeenSplash) {
      setIsVisible(false);
      return;
    }

    // Start fade out after 2.5s
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500);

    // Remove from DOM after 3s total
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("hasSeenSplash", "true");
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ease-in-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6 animate-float-in">
        <div className="relative flex size-20 items-center justify-center rounded-3xl gradient-emerald shadow-2xl animate-pulse">
          <TrendingUp className="size-10 text-white" />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Finsight
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-primary" />
            <span className="text-sm font-medium tracking-wider uppercase">Mempersiapkan Workspace...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
