"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, ShieldCheck, Activity, BarChart3, PieChart, Target, ChevronRight, BookOpen, Lightbulb, Wallet, LogOut, User, LayoutDashboard, Sparkles, Download } from "lucide-react";
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
  avatarUrl = null,
  userEmail = null,
  fullName = null,
  bio = null,
  quote = null
}: {
  isLoggedIn?: boolean;
  avatarUrl?: string | null;
  userEmail?: string | null;
  fullName?: string | null;
  bio?: string | null;
  quote?: string | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg gradient-emerald shadow-sm">
              <TrendingUp className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">FinSight</span>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex size-10 items-center justify-center rounded-full bg-muted border border-border overflow-hidden hover:opacity-80 transition-opacity"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="size-5 text-muted-foreground" />
                  )}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-border bg-card p-4 shadow-xl card-glow animate-in fade-in slide-in-from-top-4">
                    <div className="flex flex-col items-center text-center pb-4 border-b border-border">
                      <div className="size-16 rounded-full bg-muted border border-border overflow-hidden mb-3">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="size-8 text-muted-foreground m-auto h-full" />
                        )}
                      </div>
                      <p className="font-semibold text-foreground truncate w-full">
                        {fullName ? fullName : (userEmail || "Pengguna FinSight")}
                      </p>
                      {bio && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{bio}</p>}
                      {quote && <p className="text-xs italic text-primary mt-2">&quot;{quote}&quot;</p>}
                    </div>
                    <div className="flex flex-col gap-2 pt-4">
                      <Link
                        href="/dashboard"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all"
                      >
                        <LayoutDashboard className="size-4" />
                        Ke Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive shadow-sm hover:bg-destructive/20 transition-all"
                      >
                        <LogOut className="size-4" />
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Masuk
                </Link>
                <Link href="/login?type=register" className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all">
                  Daftar
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

            {/* Dashboard Mockup (Right Side) */}
            <div className="flex-1 w-full max-w-xl lg:max-w-none relative perspective-1000 hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-sky-500/20 rounded-3xl blur-2xl transform rotate-3" />
              <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden card-glow transform transition-transform hover:scale-[1.02] duration-500">
                {/* Mockup Header */}
                <div className="flex items-center px-4 py-3 border-b border-border/50 bg-muted/30">
                  <div className="flex gap-1.5">
                    <div className="size-3 rounded-full bg-red-500/80" />
                    <div className="size-3 rounded-full bg-amber-500/80" />
                    <div className="size-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="mx-auto h-5 w-48 bg-background rounded-md border border-border flex items-center justify-center">
                    <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                      <ShieldCheck className="size-3 text-emerald-500" />
                      finsight.app/dashboard
                    </span>
                  </div>
                </div>
                {/* Mockup Body */}
                <div className="p-5 grid gap-4 bg-background">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="h-3 w-24 bg-muted rounded-full mb-2" />
                      <div className="h-6 w-32 bg-foreground/90 rounded-md" />
                    </div>
                    <div className="flex -space-x-2">
                      <div className="size-8 rounded-full border-2 border-background bg-indigo-500 z-20" />
                      <div className="size-8 rounded-full border-2 border-background bg-emerald-500 z-10" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border p-3 bg-card">
                      <Activity className="size-4 text-sky-500 mb-2" />
                      <div className="h-2 w-16 bg-muted rounded-full mb-1" />
                      <div className="h-4 w-20 bg-foreground/80 rounded-md" />
                    </div>
                    <div className="rounded-xl border border-border p-3 bg-card">
                      <PieChart className="size-4 text-violet-500 mb-2" />
                      <div className="h-2 w-16 bg-muted rounded-full mb-1" />
                      <div className="h-4 w-20 bg-foreground/80 rounded-md" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-border p-4 bg-card h-32 relative overflow-hidden flex flex-col justify-end">
                    <div className="flex justify-between items-end h-full gap-2 pt-4">
                      {[40, 70, 45, 90, 65, 85, 60].map((h, i) => (
                        <div key={i} className="w-full bg-emerald-500/20 rounded-t-sm relative group">
                          <div className="absolute bottom-0 w-full bg-emerald-500 rounded-t-sm transition-all" style={{ height: `${h}%` }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                color: "violet"
              },
              {
                icon: <Target className="size-6 text-amber-500" />,
                title: "Sistem Anggaran Cerdas",
                desc: "Tetapkan batas budget per kategori. Dapatkan progres bar visual dan peringatan otomatis sesaat sebelum Anda mengalami overspending.",
                badge: "Real-time",
                color: "amber"
              },
              {
                icon: <Download className="size-6 text-sky-500" />,
                title: "Export Enterprise-Grade",
                desc: "Unduh seluruh riwayat catatan keuangan Anda ke dalam format CSV maupun PDF dalam satu klik untuk pelaporan pajak atau audit.",
                badge: "CSV / PDF",
                color: "sky"
              },
              {
                icon: <ShieldCheck className="size-6 text-emerald-500" />,
                title: "Keamanan Kelas Atas",
                desc: "Lupa password? Pulihkan akun Anda dengan aman menggunakan Pertanyaan Keamanan kustom. Pantau juga riwayat aktivitas login Anda.",
                badge: "Secure",
                color: "emerald"
              }
            ].map((feature, i) => (
              <div key={i} className="flex gap-6 rounded-3xl border border-border bg-background p-8 shadow-sm card-glow group hover:-translate-y-1 transition-transform">
                <div className={`flex size-14 shrink-0 items-center justify-center rounded-2xl bg-${feature.color}-500/10 border border-${feature.color}-500/20 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                    <span className={`rounded-full bg-${feature.color}-500/10 px-2.5 py-0.5 text-[10px] font-bold text-${feature.color}-500 uppercase tracking-wider`}>
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
            {isLoggedIn ? "Buka Dashboard" : "Daftar Gratis Sekarang"} <ChevronRight className="size-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-card/30 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} FinSight. Dibangun untuk kebebasan finansial Anda.</p>
      </footer>
    </div>
  );
}
