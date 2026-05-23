import Link from "next/link";
import { CheckCircle2, TrendingUp } from "lucide-react";

export default function AuthSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-sky-500/20 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md animate-float-in z-10">
        <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-xl p-10 shadow-2xl card-glow text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
              <CheckCircle2 className="size-20 text-emerald-500 relative z-10 bg-background rounded-full" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-3">
            Email Berhasil Dikonfirmasi!
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Terima kasih telah memverifikasi email Anda. Akun FinSight Anda sekarang sudah aktif dan siap digunakan untuk mengelola keuangan Anda dengan lebih baik.
          </p>

          <Link
            href="/"
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 flex items-center justify-center gap-2"
          >
            <TrendingUp className="size-4" />
            Mulai Gunakan FinSight
          </Link>
        </div>
      </div>
    </div>
  );
}
