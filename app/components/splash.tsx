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
      className={`fixed inset-0 z-[9999] flex flex-col bg-background transition-opacity duration-500 ease-in-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Skeleton Dashboard Structure */}
      <div className="flex h-screen w-full relative overflow-hidden">
        {/* Sidebar Skeleton */}
        <div className="hidden md:flex w-64 border-r border-border bg-card/50 flex-col p-4 gap-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 rounded-xl bg-primary/20 animate-pulse" />
            <div className="h-6 w-24 bg-muted animate-pulse rounded-md" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 w-full bg-muted/50 animate-pulse rounded-xl" />
            ))}
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col p-4 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-64 bg-muted/50 animate-pulse rounded-md" />
            </div>
            <div className="size-10 rounded-full bg-muted animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 w-full bg-card/50 border border-border/50 animate-pulse rounded-2xl" />
            ))}
          </div>
          
          <div className="h-64 w-full bg-card/50 border border-border/50 animate-pulse rounded-2xl" />
        </div>

        {/* Central Overlay with Logo and Loader */}
        <div className="absolute inset-0 bg-background/40 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-6 animate-float-in">
            <div className="relative flex size-20 items-center justify-center rounded-3xl gradient-emerald shadow-2xl animate-pulse shadow-emerald-500/20">
              <TrendingUp className="size-10 text-white" />
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                FinSight
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-1 bg-background/50 backdrop-blur-md px-4 py-2 rounded-full border border-border/50">
                <Loader2 className="size-4 animate-spin text-primary" />
                <span className="text-xs font-medium tracking-wider uppercase text-foreground">Mempersiapkan Workspace...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
