"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, ShieldCheck, Activity, BarChart3, PieChart, Target, ChevronRight, BookOpen, Lightbulb, Wallet, LogOut, User, LayoutDashboard, Sparkles, Download, Mail, X } from "lucide-react";
import { ARTICLES } from "@/lib/articles";

// Mapping icons back for the landing page
const iconMap = {
  ShieldCheck: <ShieldCheck className="size-6 text-emerald-500" />,
  TrendingUp: <TrendingUp className="size-6 text-violet-500" />,
  Lightbulb: <Lightbulb className="size-6 text-amber-500" />,
  Target: <Target className="size-6 text-rose-500" />,
  Wallet: <Wallet className="size-6 text-sky-500" />,
  Activity: <Activity className="size-6 text-indigo-500" />
};

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LandingPage({
  isLoggedIn = false,
  isAdmin = false,
  avatarUrl = null,
  userEmail = null,
  fullName = null,
  bio = null,
  quote = null
}: {
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  avatarUrl?: string | null;
  userEmail?: string | null;
  fullName?: string | null;
  bio?: string | null;
  quote?: string | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<"privacy" | "terms" | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 relative overflow-hidden">
      {/* ─── Animated Background Decorations ─── */}
      {/* Drifting gradient orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />
      <div className="bg-orb bg-orb-4" />

      {/* Morphing mesh gradient blob */}
      <div className="bg-mesh-blob" />

      {/* Subtle grid pattern overlay */}
      <div className="bg-grid-pattern" />

      {/* Floating particles */}
      <div className="bg-particle bg-particle-1" />
      <div className="bg-particle bg-particle-2" />
      <div className="bg-particle bg-particle-3" />
      <div className="bg-particle bg-particle-4" />
      <div className="bg-particle bg-particle-5" />
      <div className="bg-particle bg-particle-6" />
      <div className="bg-particle bg-particle-7" />
      <div className="bg-particle bg-particle-8" />

      {/* Navbar - Floating Glass Pill */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl rounded-2xl border border-border/50 bg-background/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] supports-[backdrop-filter]:bg-background/40 transition-all duration-300">
        <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl gradient-emerald shadow-lg shadow-emerald-500/20">
              <TrendingUp className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">FinSight</span>
          </div>
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2 sm:gap-4">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="hidden sm:flex items-center gap-2 rounded-xl bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-500 hover:bg-violet-500/20 transition-all border border-violet-500/20"
                  >
                    <ShieldCheck className="size-4" />
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="hidden sm:flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition-all"
                >
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Link>
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 rounded-full border border-border/50 bg-card/50 p-1 pr-3 hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-sm"
                  >
                    <div className="size-8 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="size-4 text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-sm font-medium hidden sm:block max-w-[100px] truncate">
                      {fullName ? fullName.split(' ')[0] : (userEmail?.split('@')[0] || "User")}
                    </span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-3 w-72 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl p-4 shadow-2xl card-glow animate-in fade-in slide-in-from-top-4">
                      <div className="flex flex-col items-center text-center pb-4 border-b border-border/50">
                        <div className="size-16 rounded-full bg-muted border border-border overflow-hidden mb-3 shadow-inner">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <User className="size-8 text-muted-foreground m-auto h-full" />
                          )}
                        </div>
                        <p className="font-bold text-foreground truncate w-full text-lg">
                          {fullName ? fullName : (userEmail || "Pengguna FinSight")}
                        </p>
                        {bio && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{bio}</p>}
                        {quote && <p className="text-xs italic text-primary mt-3 bg-primary/10 px-3 py-1.5 rounded-lg">&quot;{quote}&quot;</p>}
                      </div>
                       <div className="flex flex-col gap-2 pt-4">
                        <Link
                          href="/dashboard"
                          className="flex sm:hidden w-full items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary shadow-sm hover:bg-primary/20 transition-all"
                        >
                          <LayoutDashboard className="size-4" />
                          Ke Dashboard
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500/10 px-4 py-2.5 text-sm font-bold text-violet-500 shadow-sm hover:bg-violet-500/20 transition-all border border-violet-500/20"
                          >
                            <ShieldCheck className="size-4" />
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-destructive/10 px-4 py-2.5 text-sm font-semibold text-destructive shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
                        >
                          <LogOut className="size-4" />
                          Keluar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className="hidden sm:inline-flex text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors px-2">
                  Masuk
                </Link>
                <Link href="/login?type=register" className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300">
                  Mulai Sekarang
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pb-32">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-sky-500/10 blur-[120px] pointer-events-none" />

        <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative z-10 animate-float-in">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
                Kendalikan Keuangan Anda dengan <span className="bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent">FinSight</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Asisten keuangan pribadi bergaya premium yang membantu Anda melacak, menganalisis, dan merencanakan masa depan finansial Anda melalui wawasan berbasis data.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {isLoggedIn ? (
                  <Link href="/dashboard" className="w-full sm:w-auto rounded-full bg-primary px-8 py-4 sm:py-3.5 text-lg sm:text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-105 transition-all flex items-center justify-center gap-2">
                    Kembali ke Dashboard <ChevronRight className="size-4" />
                  </Link>
                ) : (
                  <Link href="/login?type=register" className="w-full sm:w-auto rounded-full bg-primary px-8 py-4 sm:py-3.5 text-lg sm:text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-105 transition-all flex items-center justify-center gap-2">
                    Buat Akun Gratis <ChevronRight className="size-4" />
                  </Link>
                )}
                <Link href="#cara-kerja" className="w-full sm:w-auto rounded-full border border-border bg-card/50 backdrop-blur-sm px-8 py-4 sm:py-3.5 text-lg sm:text-base font-bold text-foreground hover:bg-muted/80 transition-all flex items-center justify-center">
                  Pelajari Cara Kerja
                </Link>
              </div>
            </div>

            {/* Abstract Fintech Representation (Right Side) */}
            <div className="flex-1 w-full relative h-[300px] sm:h-[400px] lg:h-[500px] perspective-1000 mt-8 lg:mt-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-sky-500/10 rounded-full blur-3xl" />
              
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Central Core */}
                <div className="absolute z-10 size-32 md:size-40 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_60px_rgba(16,185,129,0.4)] flex items-center justify-center animate-pulse duration-3000">
                  <Wallet className="size-16 md:size-20 text-white" />
                </div>

                {/* Orbiting / Floating Card 1: Balance / Growth */}
                <div className="absolute top-[10%] lg:top-[15%] right-[5%] z-20 w-56 lg:w-64 bg-card/80 backdrop-blur-xl border border-border/50 p-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500" style={{ animation: "float 6s ease-in-out infinite" }}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <TrendingUp className="size-5 text-emerald-500" />
                    </div>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">+12.5%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Total Aset</p>
                  <p className="text-xl lg:text-2xl font-bold text-foreground mt-1">Rp 124.5M</p>
                </div>

                {/* Orbiting / Floating Card 2: Security */}
                <div className="absolute bottom-[20%] left-[0%] z-20 w-48 bg-card/80 backdrop-blur-xl border border-border/50 p-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500" style={{ animation: "float 7s ease-in-out infinite 1s" }}>
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-sky-500/20 flex items-center justify-center">
                      <ShieldCheck className="size-5 text-sky-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Terproteksi</p>
                      <p className="text-xs text-muted-foreground">Enkripsi 256-bit</p>
                    </div>
                  </div>
                </div>

                {/* Orbiting / Floating Card 3: Goals */}
                <div className="absolute -bottom-[5%] right-[15%] z-20 w-60 bg-card/80 backdrop-blur-xl border border-border/50 p-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500" style={{ animation: "float 8s ease-in-out infinite 2s" }}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Target className="size-4 text-rose-500" />
                      <span className="text-sm font-bold">Dana Darurat</span>
                    </div>
                    <span className="text-xs text-muted-foreground">85%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-rose-500 to-amber-500" style={{ width: '85%' }} />
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-[30%] left-[10%] size-4 rounded-full bg-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.8)]" style={{ animation: "float 4s ease-in-out infinite 0.5s" }} />
                <div className="absolute bottom-[40%] right-[5%] size-3 rounded-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]" style={{ animation: "float 5s ease-in-out infinite 1.5s" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By / Press */}
      <section className="py-8 border-b border-border/50 bg-muted/10 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
           <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6">Dipercaya oleh pengguna dari institusi terkemuka</p>
           <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {/* We can use simple text placeholders or icons here to represent companies */}
             <div className="flex items-center gap-2 font-bold text-xl"><Wallet className="size-6 text-foreground"/> BankCentral</div>
             <div className="flex items-center gap-2 font-bold text-xl"><ShieldCheck className="size-6 text-foreground"/> SecurePay</div>
             <div className="flex items-center gap-2 font-bold text-xl"><TrendingUp className="size-6 text-foreground"/> InvestPro</div>
             <div className="flex items-center gap-2 font-bold text-xl"><Activity className="size-6 text-foreground"/> FinTech.id</div>
           </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-10 border-b border-border/50 bg-muted/20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-border/50">
            <div className="px-4">
              <h4 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">10K+</h4>
              <p className="text-sm text-muted-foreground mt-1 font-medium">Transactions Analyzed</p>
            </div>
            <div className="px-4">
              <h4 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">100+</h4>
              <p className="text-sm text-muted-foreground mt-1 font-medium">Insights Generated</p>
            </div>
            <div className="px-4">
              <h4 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">95%</h4>
              <p className="text-sm text-muted-foreground mt-1 font-medium">Tracking Accuracy</p>
            </div>
            <div className="px-4">
              <h4 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">24/7</h4>
              <p className="text-sm text-muted-foreground mt-1 font-medium">Automated Monitoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section (Kenapa FinSight?) */}
      <section className="py-24 bg-background border-b border-border/50">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Kenapa Memilih FinSight?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Tinggalkan cara lama mencatat keuangan. Kami membawa Anda ke era baru pengelolaan finansial yang cerdas dan otomatis.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Before (Cara Lama) */}
            <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 sm:p-10 relative">
              <div className="absolute top-0 right-0 p-6 opacity-20">
                <LogOut className="size-24 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-red-500 mb-8 relative z-10">Cara Lama</h3>
              <ul className="space-y-6 relative z-10">
                {[
                  "Catat pengeluaran secara manual di buku/Excel",
                  "Sering bingung uang habis kemana di akhir bulan",
                  "Tidak ada target tabungan yang jelas",
                  "Data tersebar dan sulit dianalisis"
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <div className="size-6 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0 mt-0.5 text-sm font-bold">✕</div>
                    <span className="text-muted-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After (Dengan FinSight) */}
            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-8 sm:p-10 relative shadow-2xl shadow-emerald-500/10">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <TrendingUp className="size-24 text-emerald-500" />
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 mb-6 relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Dengan FinSight</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-8 relative z-10">Lebih Cerdas & Mudah</h3>
              <ul className="space-y-6 relative z-10">
                {[
                  "Dashboard analitik otomatis dan real-time",
                  "Insight kategori pengeluaran terperinci",
                  "Goal tracking dan monitoring tabungan",
                  "Visualisasi data interaktif & informatif"
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <div className="size-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-sm font-bold">✓</div>
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Unggulan Baru */}
      <section className="py-24 bg-card/50 border-b border-border/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 mb-4">
              <Sparkles className="size-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Fitur Premium</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Dirancang Untuk Kebutuhan Profesional</h2>
            <p className="text-lg text-muted-foreground">
              Nikmati deretan fitur kelas enterprise yang membuat manajemen keuangan Anda tidak hanya mudah, tapi juga sangat kuat dan aman.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {[
              {
                icon: <User className="size-6 text-violet-500" />,
                title: "Profil Analitik Pintar",
                desc: "AI kami akan menganalisis kepribadian finansial (Financial Personality), kebiasaan menabung, dan pola pengeluaran mingguan Anda.",
                badge: "AI-Powered",
                bgClass: "bg-violet-500/10",
                borderClass: "border-violet-500/20",
                textClass: "text-violet-500"
              },
              {
                icon: <Target className="size-6 text-amber-500" />,
                title: "Sistem Anggaran Cerdas",
                desc: "Tetapkan batas budget per kategori. Dapatkan progres bar visual dan peringatan otomatis sesaat sebelum Anda mengalami overspending.",
                badge: "Real-time",
                bgClass: "bg-amber-500/10",
                borderClass: "border-amber-500/20",
                textClass: "text-amber-500"
              },
              {
                icon: <Download className="size-6 text-sky-500" />,
                title: "Export Enterprise-Grade",
                desc: "Unduh seluruh riwayat catatan keuangan Anda ke dalam format CSV maupun PDF dalam satu klik untuk pelaporan pajak atau audit.",
                badge: "CSV / PDF",
                bgClass: "bg-sky-500/10",
                borderClass: "border-sky-500/20",
                textClass: "text-sky-500"
              },
              {
                icon: <ShieldCheck className="size-6 text-emerald-500" />,
                title: "Keamanan Kelas Atas",
                desc: "Lupa password? Pulihkan akun Anda dengan aman menggunakan Pertanyaan Keamanan kustom. Pantau juga riwayat aktivitas login Anda.",
                badge: "Secure",
                bgClass: "bg-emerald-500/10",
                borderClass: "border-emerald-500/20",
                textClass: "text-emerald-500"
              }
            ].map((feature, i) => (
              <div key={i} className="flex gap-6 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl p-8 shadow-sm card-glow group hover:-translate-y-1 hover:border-primary/30 transition-all duration-300">
                <div className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${feature.bgClass} border ${feature.borderClass} group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                    <span className={`rounded-full ${feature.bgClass} px-2.5 py-0.5 text-[10px] font-bold ${feature.textClass} uppercase tracking-wider`}>
                      {feature.badge}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Finansial (Goals) */}
      <section className="py-24 bg-background border-b border-border/50 relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-full bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 mb-2">
                <Target className="size-4 text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Goals & Targets</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Wujudkan Impian Anda Lebih Cepat</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Menabung tanpa tujuan yang jelas seringkali berakhir dengan kegagalan. Dengan FinSight, Anda dapat membuat target finansial seperti membeli rumah, dana pendidikan, atau liburan impian.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Visualisasi progress tabungan yang memotivasi",
                  "Estimasi waktu pencapaian target secara otomatis",
                  "Alokasi dana spesifik tanpa mengganggu budget harian"
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start justify-center lg:justify-start">
                    <div className="size-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5"><Target className="size-3" /></div>
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex-1 w-full max-w-md relative">
              <div className="relative bg-card border border-border rounded-3xl p-6 shadow-xl card-glow">
                <h3 className="text-lg font-bold mb-6 flex items-center justify-between">Target Aktif <span className="text-xs font-normal text-muted-foreground">Bulan Ini</span></h3>
                
                <div className="space-y-6">
                  {/* Goal 1 */}
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20 text-lg">
                          🏠
                        </div>
                        <div>
                          <p className="font-bold text-sm">DP Rumah Pertama</p>
                          <p className="text-xs text-muted-foreground">Tercapai 65%</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-sky-500">Rp 65 Juta</p>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500 rounded-full" style={{ width: '65%' }} />
                    </div>
                  </div>

                  {/* Goal 2 */}
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-lg">
                          ✈️
                        </div>
                        <div>
                          <p className="font-bold text-sm">Liburan ke Jepang</p>
                          <p className="text-xs text-muted-foreground">Tercapai 40%</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-emerald-500">Rp 12 Juta</p>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '40%' }} />
                    </div>
                  </div>
                  
                  {/* Goal 3 */}
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 text-lg">
                          🛡️
                        </div>
                        <div>
                          <p className="font-bold text-sm">Dana Darurat</p>
                          <p className="text-xs text-muted-foreground">Tercapai 90%</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-rose-500">Rp 45 Juta</p>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: '90%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="cara-kerja" className="py-20 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Cara Kerja FinSight</h2>
            <p className="text-muted-foreground">Tiga langkah mudah untuk mencapai kebebasan finansial melalui pemantauan dan analisis yang konsisten.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 relative">
            <div className="hidden sm:block absolute top-1/2 left-[16.6%] right-[16.6%] h-0.5 bg-gradient-to-r from-emerald-500/20 via-sky-500/20 to-emerald-500/20 -translate-y-1/2 z-0" />

            {[
              {
                icon: <Activity className="size-6 text-emerald-500" />,
                title: "1. Input Data",
                desc: "Catat setiap pemasukan dan pengeluaran harian Anda dengan mudah, atau unggah dari file CSV."
              },
              {
                icon: <PieChart className="size-6 text-sky-500" />,
                title: "2. Analisis Otomatis",
                desc: "Sistem kami akan memetakan arus kas, memecah kategori pengeluaran, dan menghitung tren Anda."
              },
              {
                icon: <ShieldCheck className="size-6 text-violet-500" />,
                title: "3. Eksekusi & Evaluasi",
                desc: "Gunakan wawasan yang didapat untuk mengevaluasi gaya hidup dan mencapai target finansial."
              }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center bg-card p-6 rounded-3xl border border-border/50 shadow-sm card-glow hover:-translate-y-1 transition-transform">
                <div className="size-14 rounded-2xl bg-muted flex items-center justify-center mb-6 shadow-sm border border-border/50">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analysis Methodology */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">Pola Perhitungan & Analisis</h2>
                <p className="text-lg text-muted-foreground">
                  FinSight tidak hanya mencatat angka, tetapi membantu Anda mengerti <i>makna</i> di balik angka tersebut menggunakan metrik standar industri.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: <Activity className="size-5 text-emerald-500" />,
                    title: "Financial Health Score",
                    desc: "Sistem cerdas kami akan memberi skor (0-100) pada keuangan Anda berdasarkan rasio tabungan, utang tagihan, perilaku impulsif, dan kestabilan arus kas."
                  },
                  {
                    icon: <BarChart3 className="size-5 text-sky-500" />,
                    title: "Aturan 50/30/20",
                    desc: "Kami membantu memantau apakah pengeluaran Anda seimbang: 50% Kebutuhan, 30% Keinginan, dan 20% Tabungan/Investasi."
                  },
                  {
                    icon: <Target className="size-5 text-violet-500" />,
                    title: "Rasio Tabungan (Savings Ratio)",
                    desc: "Persentase pemasukan yang berhasil Anda simpan. Metrik utama untuk mengukur seberapa cepat Anda mencapai kebebasan finansial."
                  },
                  {
                    icon: <Activity className="size-5 text-rose-500" />,
                    title: "Deteksi Kebocoran Halus",
                    desc: "Grafik tren dan kategori membedah pengeluaran mana yang sering 'bocor' tanpa disadari di pertengahan bulan."
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 shrink-0 flex size-10 items-center justify-center rounded-xl bg-card border border-border/50 shadow-sm">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-foreground mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full max-w-md relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-sky-500/10 rounded-[2.5rem] blur-xl transform rotate-3" />
              <div className="relative bg-card border border-border rounded-[2rem] p-6 shadow-2xl card-glow">
                {/* Mockup Dashboard Element */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Sisa Saldo Bulan Ini</p>
                      <p className="text-2xl font-bold text-sky-500">Rp 4.500.000</p>
                    </div>
                    <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                      Rasio 30%
                    </div>
                  </div>
                  <div className="space-y-3 pt-2">
                    {[
                      { name: "Kebutuhan", p: 45, c: "bg-indigo-500" },
                      { name: "Keinginan", p: 25, c: "bg-rose-500" },
                      { name: "Tabungan", p: 30, c: "bg-emerald-500" },
                    ].map((bar, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-muted-foreground">{bar.name}</span>
                          <span className="font-bold">{bar.p}%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${bar.c}`} style={{ width: `${bar.p}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Artikel & Pengetahuan Finansial */}
      <section id="artikel" className="py-24 bg-muted/30 border-t border-border/50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 mb-4">
              <BookOpen className="size-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Wawasan</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Perluas Pengetahuan Finansial Anda</h2>
            <p className="text-lg text-muted-foreground">
              Jangan hanya mencatat uang Anda. Pahami cara kerjanya dengan panduan eksklusif dari para pakar keuangan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {ARTICLES.map((article, i) => (
              <div key={i} className="group relative bg-card rounded-2xl border border-border/50 p-6 hover:shadow-xl hover:border-primary/30 transition-all duration-300 card-glow overflow-hidden flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 flex-1 flex flex-col">
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground/80 mb-4 block">
                    {article.category}
                  </span>
                  <div className="size-12 rounded-xl bg-background flex items-center justify-center mb-4 shadow-sm border border-border">
                    {iconMap[article.iconName as keyof typeof iconMap]}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                    {article.desc}
                  </p>

                  <Link href={`/artikel/${article.slug}`} className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                    Baca Selengkapnya <ChevronRight className="size-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-background border-t border-border/50">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Pertanyaan yang Sering Diajukan</h2>
            <p className="text-muted-foreground text-lg">Temukan jawaban tentang bagaimana FinSight mengamankan dan mengelola data Anda.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "Apakah FinSight gratis digunakan?",
                a: "Ya! Anda dapat menggunakan fitur pencatatan dan dashboard analitik secara gratis sepenuhnya. Kedepannya kami mungkin akan merilis fitur premium lanjutan, namun inti aplikasi ini akan selalu gratis."
              },
              {
                q: "Apakah data keuangan saya aman?",
                a: "Keamanan Anda adalah prioritas kami. Data dienkripsi di tingkat database dan kami menggunakan teknologi keamanan otentikasi standar industri untuk memastikan hanya Anda yang memiliki akses."
              },
              {
                q: "Apakah bisa menghubungkan akun bank secara langsung?",
                a: "Saat ini, FinSight mengandalkan input manual atau impor file CSV dari mutasi bank Anda untuk memastikan Anda memegang kendali penuh atas privasi data tanpa perlu membagikan kredensial bank ke aplikasi pihak ketiga."
              },
              {
                q: "Apakah saya bisa mengubah bahasa aplikasi?",
                a: "Saat ini aplikasi dioptimalkan dalam Bahasa Indonesia untuk kemudahan dan kenyamanan pengguna lokal, namun istilah inti seperti Login/Register menggunakan bahasa Inggris standar."
              }
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl border border-border bg-card/50 hover:bg-card transition-colors">
                <h4 className="text-lg font-bold text-foreground mb-2 flex items-start gap-2">
                  <div className="mt-1 size-2 rounded-full bg-primary shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed pl-4">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-24 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 relative z-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
            {isLoggedIn ? "Lanjutkan Perjalanan Finansial Anda" : "Siap Mengubah Cara Anda Mengelola Uang?"}
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            {isLoggedIn
              ? "Catat pengeluaran terbaru Anda dan lihat wawasan menarik di dashboard FinSight sekarang juga."
              : "Bergabunglah sekarang dan dapatkan wawasan penuh tentang kemana saja uang Anda pergi setiap bulannya."
            }
          </p>
          <Link href={isLoggedIn ? "/dashboard" : "/login?type=register"} className="flex sm:inline-flex w-full sm:w-auto rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-xl hover:bg-primary/90 hover:scale-105 transition-all items-center justify-center gap-2">
            {isLoggedIn ? "Buka Dashboard" : "Register Gratis Sekarang"} <ChevronRight className="size-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border bg-card/30 text-sm text-muted-foreground relative z-10">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 text-left">
            
            {/* Column 1: Brand (3 cols) */}
            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl gradient-emerald shadow-lg shadow-emerald-500/20">
                  <TrendingUp className="size-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  FinSight
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Platform analitik keuangan pribadi premium untuk melacak, menganalisis, dan mengoptimalkan kebiasaan finansial Anda.
              </p>
            </div>

            {/* Column 2: Address (4 cols) */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="text-sm font-bold text-foreground tracking-wider uppercase">Address</h4>
              <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
                <p>
                  Perumahan harmoni mas block c4 no 08,<br />
                  KAB. KARAWANG, TELUKJAMBE TIMUR,<br />
                  JAWA BARAT, ID, 41361
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <Mail className="size-4 text-emerald-500 shrink-0" />
                  <span className="font-semibold text-foreground">E-Mail:</span>
                  <a 
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=luthfirafif188@gmail.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-primary transition-colors"
                  >
                    luthfirafif188@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Column 3: Related Links (3 cols) */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-sm font-bold text-foreground tracking-wider uppercase">Related Links</h4>
              <div className="flex flex-row md:flex-col lg:flex-row gap-3 pt-1">
                {/* Badge 1: FinSight App */}
                <div className="flex items-center gap-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl w-fit">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg gradient-emerald text-white shadow-sm">
                    <TrendingUp className="size-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest leading-none">FinSight</p>
                    <p className="text-[8px] text-muted-foreground leading-none mt-1">Analytics App</p>
                  </div>
                </div>

                {/* Badge 2: Safe & Secure */}
                <div className="flex items-center gap-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl w-fit">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-500 shadow-sm">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest leading-none">Secure</p>
                    <p className="text-[8px] text-muted-foreground leading-none mt-1">SSL Encrypted</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 4: Social Media (2 cols) */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-sm font-bold text-foreground tracking-wider uppercase">Social Media</h4>
              <div className="flex gap-2.5 pt-1">
                <a href="#" className="flex size-8 items-center justify-center rounded-lg bg-card border border-border/50 hover:bg-primary/10 hover:border-primary/30 text-muted-foreground hover:text-primary transition-all duration-300" title="Facebook">
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z" />
                  </svg>
                </a>
                <a href="#" className="flex size-8 items-center justify-center rounded-lg bg-card border border-border/50 hover:bg-primary/10 hover:border-primary/30 text-muted-foreground hover:text-primary transition-all duration-300" title="X (Twitter)">
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="#" className="flex size-8 items-center justify-center rounded-lg bg-card border border-border/50 hover:bg-primary/10 hover:border-primary/30 text-muted-foreground hover:text-primary transition-all duration-300" title="LinkedIn">
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="flex size-8 items-center justify-center rounded-lg bg-card border border-border/50 hover:bg-primary/10 hover:border-primary/30 text-muted-foreground hover:text-primary transition-all duration-300" title="YouTube">
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.54 12 3.54 12 3.54s-7.53 0-9.388.515A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.46 12 20.46 12 20.46s7.53 0 9.388-.515a3.003 3.003 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a href="#" className="flex size-8 items-center justify-center rounded-lg bg-card border border-border/50 hover:bg-primary/10 hover:border-primary/30 text-muted-foreground hover:text-primary transition-all duration-300" title="Instagram">
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* Separator and Bottom Meta */}
          <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <div className="flex gap-4 font-semibold">
              <button 
                onClick={() => setActiveModal("privacy")} 
                className="hover:text-primary transition-colors cursor-pointer outline-none font-semibold"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => setActiveModal("terms")} 
                className="hover:text-primary transition-colors cursor-pointer outline-none font-semibold"
              >
                Terms & Conditions
              </button>
            </div>
            <p className="text-muted-foreground/80">
              &copy; {new Date().getFullYear()} FinSight. Dibangun untuk kebebasan finansial Anda.
              {isLoggedIn && isAdmin && (
                <>
                  {" | "}
                  <Link href="/admin" className="hover:text-primary transition-colors font-medium">
                    Admin Panel
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </footer>

      {/* Modals for Privacy Policy and Terms & Conditions */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with backdrop-blur */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
            onClick={() => setActiveModal(null)}
          />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border border-border/50 bg-card/90 backdrop-blur-2xl p-6 md:p-8 shadow-2xl card-glow overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <h3 className="text-xl font-extrabold tracking-tight text-foreground">
                {activeModal === "privacy" ? "Kebijakan Privasi (Privacy Policy)" : "Syarat & Ketentuan (Terms & Conditions)"}
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="flex size-9 items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer border border-border/40"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6 text-sm text-muted-foreground leading-relaxed pr-2 scrollbar-thin text-left">
              {activeModal === "privacy" ? (
                <>
                  <section className="space-y-2">
                    <h4 className="font-bold text-foreground text-base">1. Pengumpulan Informasi</h4>
                    <p>
                      Kami mengumpulkan informasi pribadi seperti nama, alamat email, dan kata sandi yang dienkripsi secara aman saat Anda membuat akun. Kami juga menyimpan data transaksi keuangan yang Anda masukkan secara manual untuk keperluan pelacakan dan analisis grafik pada dashboard Anda.
                    </p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-foreground text-base">2. Penggunaan Informasi</h4>
                    <p>
                      Seluruh data transaksi dan informasi keuangan yang Anda masukkan digunakan semata-mata untuk menghasilkan visualisasi analitik pribadi, menghitung skor kesehatan keuangan (Financial Health Score), serta menyajikan wawasan keuangan (Smart Insights) guna membantu mengoptimalkan kebiasaan finansial Anda.
                    </p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-foreground text-base">3. Keamanan & Kerahasiaan Data</h4>
                    <p>
                      Data Anda disimpan dengan teknologi enkripsi modern dan dilindungi oleh sistem Row Level Security (RLS) di database Supabase kami. Kami berkomitmen penuh untuk **tidak menjual, membagikan, atau menyebarkan** data keuangan maupun informasi pribadi Anda kepada pihak ketiga mana pun tanpa persetujuan Anda.
                    </p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-foreground text-base">4. Hak Pengguna</h4>
                    <p>
                      Anda memiliki kendali penuh atas data Anda. Anda dapat menambah, mengedit, mengekspor ke file CSV/PDF, atau menghapus riwayat transaksi keuangan Anda kapan saja secara langsung melalui dashboard aplikasi FinSight.
                    </p>
                  </section>
                </>
              ) : (
                <>
                  <section className="space-y-2">
                    <h4 className="font-bold text-foreground text-base">1. Penggunaan Layanan</h4>
                    <p>
                      FinSight adalah platform analitik keuangan pribadi. Layanan ini disediakan untuk melacak catatan keuangan secara mandiri. Pengguna bertanggung jawab penuh atas keakuratan, kebenaran, dan validitas dari setiap data transaksi yang diinput ke dalam sistem.
                    </p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-foreground text-base">2. Batasan Tanggung Jawab (Keterangan Finansial)</h4>
                    <p>
                      Seluruh analisis grafik, bagan cashflow, skor kesehatan keuangan, serta wawasan (insights) yang disajikan oleh FinSight bersifat edukatif dan informasional. **Layanan ini bukan merupakan saran atau rekomendasi investasi, hukum, perpajakan, atau nasihat keuangan profesional.** FinSight tidak bertanggung jawab atas kerugian atau keputusan finansial apa pun yang diambil oleh pengguna berdasarkan informasi dari aplikasi ini.
                    </p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-foreground text-base">3. Keamanan Akun</h4>
                    <p>
                      Anda bertanggung jawab penuh untuk menjaga kerahasiaan kata sandi serta kredensial akun login Anda. Segera beri tahu tim dukungan kami jika Anda mendeteksi adanya penggunaan akun tanpa izin atau celah keamanan lainnya.
                    </p>
                  </section>
                  <section className="space-y-2">
                    <h4 className="font-bold text-foreground text-base">4. Perubahan Syarat & Ketentuan</h4>
                    <p>
                      Kami berhak untuk mengubah atau memperbarui syarat & ketentuan ini sewaktu-waktu demi peningkatan layanan dan kepatuhan hukum. Perubahan akan langsung berlaku setelah dipublikasikan pada halaman ini.
                    </p>
                  </section>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-border/50 flex justify-end">
              <button 
                onClick={() => setActiveModal(null)}
                className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 cursor-pointer"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
