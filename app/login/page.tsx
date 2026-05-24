"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, Mail, Lock, Loader2, ArrowLeft, ShieldQuestion, Key } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { resetPasswordWithSecurityAnswer } from "@/app/actions/auth-actions";

const SECURITY_QUESTIONS = [
  "Apa nama kota tempat Anda lahir?",
  "Apa nama hewan peliharaan pertama Anda?",
  "Siapa nama pahlawan masa kecil Anda?",
  "Apa nama sekolah dasar Anda?",
];

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  // Security Question States for Forgot Password
  const [securityQuestion, setSecurityQuestion] = useState(SECURITY_QUESTIONS[0]);
  const [securityAnswer, setSecurityAnswer] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
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
    setSuccessMsg(null);

    try {
      if (isForgotPassword) {
        // Handle Custom Forgot Password Flow (No Email Needed)
        const result = await resetPasswordWithSecurityAnswer(
          email,
          securityQuestion,
          securityAnswer,
          newPassword
        );
        
        if (!result.success) {
          throw new Error(result.error);
        }
        
        setSuccessMsg("Password berhasil direset! Silakan login dengan password baru Anda.");
        setTimeout(() => {
          setIsForgotPassword(false);
          setIsLogin(true);
          setSuccessMsg(null);
          setPassword("");
        }, 3000);

      } else if (isLogin) {
        // Handle Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      } else {
        // Handle Register without security question
        const { error } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;
        
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat autentikasi");
    } finally {
      setIsLoading(false);
    }
  };

  // Determine current view state for animation key
  const viewState = isForgotPassword ? 'forgot' : isLogin ? 'login' : 'register';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-sky-500/20 blur-[120px] pointer-events-none" />
      
      {/* 
        Using key={viewState} ensures that React unmounts and remounts this div 
        whenever the view changes, perfectly re-triggering the animate-float-in transition.
      */}
      <div key={viewState} className="w-full max-w-md animate-float-in z-10">
        <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-xl p-8 shadow-2xl card-glow">
          
          {isForgotPassword ? (
            // ─── FORGOT PASSWORD VIEW (SECURITY QUESTION) ───
            <>
              <button 
                onClick={() => { setIsForgotPassword(false); setError(null); setSuccessMsg(null); }}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6 group"
              >
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                Kembali ke Login
              </button>
              
              <div className="flex flex-col items-center text-center mb-8">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 shadow-lg mb-4">
                  <ShieldQuestion className="size-7 text-amber-500" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Reset Password
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                  Jawab pertanyaan keamanan akun Anda untuk mengatur ulang password tanpa verifikasi email.
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm font-medium text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl animate-float-in">
                    {error}
                  </div>
                )}
                {successMsg && (
                  <div className="p-3 text-sm font-medium text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex gap-2 items-start animate-float-in">
                    <Key className="size-4 mt-0.5 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Email Akun</label>
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
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Pilih Pertanyaan Keamanan</label>
                  <select
                    value={securityQuestion}
                    onChange={(e) => setSecurityQuestion(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    {SECURITY_QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Jawaban Anda</label>
                  <input
                    type="text"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    required
                    placeholder="Ketik jawaban di sini"
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
                  />
                </div>

                <div className="space-y-1 pt-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Password Baru</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      minLength={6}
                      className="w-full rounded-xl border border-border bg-background/50 pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || successMsg !== null}
                  className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                >
                  {isLoading && <Loader2 className="size-4 animate-spin" />}
                  Ubah Password
                </button>
              </form>
            </>
          ) : (
            // ─── LOGIN / REGISTER VIEW ───
            <>
              <div className="flex flex-col items-center text-center mb-8">
                <div className="flex size-14 items-center justify-center rounded-2xl gradient-emerald shadow-lg mb-4">
                  <TrendingUp className="size-7 text-white" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {isLogin ? "Selamat Datang Kembali" : "Mulai Bersama FinSight"}
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                  {isLogin ? "Login untuk melanjutkan ke dashboard keuangan Anda" : "Buat akun baru dan kendalikan keuangan Anda hari ini"}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm font-medium text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl animate-float-in">
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
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Password</label>
                    {isLogin && (
                      <button 
                        type="button" 
                        onClick={() => { setIsForgotPassword(true); setError(null); }}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Lupa password?
                      </button>
                    )}
                  </div>
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
                  {isLogin ? "Login ke Dashboard" : "Register Sekarang"}
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
                  className="font-semibold text-primary hover:underline transition-all"
                >
                  {isLogin ? "Register di sini" : "Login di sini"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
