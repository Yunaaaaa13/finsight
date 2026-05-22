"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, Mail, Lock, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("type") === "register") {
        setIsLogin(false);
      }
    }
  }, []);

  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        // Supabase auto logins on signup if email confirmation is disabled.
        // If email confirmation is enabled on their Supabase project, they will need to check their email.
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat autentikasi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-sky-500/20 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md animate-float-in z-10">
        <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-xl p-8 shadow-2xl card-glow">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex size-14 items-center justify-center rounded-2xl gradient-emerald shadow-lg mb-4">
              <TrendingUp className="size-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {isLogin ? "Selamat Datang Kembali" : "Mulai Bersama Finsight"}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {isLogin ? "Masuk untuk melanjutkan ke dashboard keuangan Anda" : "Buat akun baru dan kendalikan keuangan Anda hari ini"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {error && (
              <div className="p-3 text-sm font-medium text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="nama@email.com"
                  className="w-full rounded-xl border border-border bg-background/50 pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full rounded-xl border border-border bg-background/50 pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isLoading && <Loader2 className="size-4 animate-spin" />}
              {isLogin ? "Masuk ke Dashboard" : "Daftar Sekarang"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="font-semibold text-primary hover:underline"
            >
              {isLogin ? "Daftar di sini" : "Masuk di sini"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
