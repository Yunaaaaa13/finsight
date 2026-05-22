"use client";

import Link from "next/link";
import { TrendingUp, ShieldCheck, Activity, BarChart3, PieChart, Target, ChevronRight } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto max-w-6xl flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg gradient-emerald shadow-sm">
              <TrendingUp className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Finsight</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Masuk
            </Link>
            <Link href="/login?type=register" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all">
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32 lg:pb-40">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-sky-500/10 blur-[120px] pointer-events-none" />

        <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative z-10 text-center animate-float-in">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
              Kendalikan Keuangan Anda dengan <span className="bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent">Finsight</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
              Finsight adalah asisten keuangan pribadi yang membantu Anda melacak, menganalisis, dan merencanakan masa depan finansial Anda melalui wawasan berbasis data yang intuitif.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login?type=register" className="w-full sm:w-auto rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-105 transition-all flex items-center justify-center gap-2">
                Buat Akun Gratis <ChevronRight className="size-4" />
              </Link>
              <Link href="#cara-kerja" className="w-full sm:w-auto rounded-full border border-border bg-card/50 backdrop-blur-sm px-8 py-3.5 text-base font-semibold text-foreground hover:bg-muted/80 transition-all">
                Pelajari Cara Kerja
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="cara-kerja" className="py-20 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Cara Kerja Finsight</h2>
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
                  Finsight tidak hanya mencatat angka, tetapi membantu Anda mengerti <i>makna</i> di balik angka tersebut menggunakan metrik standar industri.
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

      {/* CTA Bottom */}
      <section className="py-24 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 relative z-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Siap Mengubah Cara Anda Mengelola Uang?</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Bergabunglah sekarang dan dapatkan wawasan penuh tentang kemana saja uang Anda pergi setiap bulannya.
          </p>
          <Link href="/login?type=register" className="inline-flex rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-xl hover:bg-primary/90 hover:scale-105 transition-all items-center justify-center gap-2">
            Daftar Gratis Sekarang <ChevronRight className="size-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-card/30 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Finsight. Dibangun untuk kebebasan finansial Anda.</p>
      </footer>
    </div>
  );
}
