"use client";

import { useEffect, useState } from "react";
import { User, Mail, TrendingUp, Edit3, Image as ImageIcon, CheckCircle2, Loader2, Quote } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Transaction } from "@/lib/types";
import { computePersonality, type PersonalityResult } from "./personality-logic";

interface ProfileViewProps {
  transactions: Transaction[];
}

export function ProfileView({ transactions }: ProfileViewProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [quote, setQuote] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const supabase = createClient();
  const personality = computePersonality(transactions);
  const Icon = personality.icon;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUserEmail(data.user.email ?? null);
        const meta = data.user.user_metadata;
        if (meta?.full_name) setFullName(meta.full_name);
        if (meta?.bio) setBio(meta.bio);
        if (meta?.quote) setQuote(meta.quote);
        if (meta?.avatar_url) setAvatarUrl(meta.avatar_url);
      }
    });
  }, [supabase]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveMessage("");
    const { error } = await supabase.auth.updateUser({
      data: { bio, quote, avatar_url: avatarUrl }
    });
    setIsSaving(false);
    if (!error) {
      setSaveMessage("Tersimpan!");
      setTimeout(() => {
        setSaveMessage("");
        setIsEditing(false);
      }, 1000);
    } else {
      setSaveMessage("Gagal menyimpan");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setSaveMessage("");

      // Buat nama file unik
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload ke bucket 'avatars'
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Ambil URL publik
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      if (data?.publicUrl) {
        setAvatarUrl(data.publicUrl);
        setSaveMessage("Foto berhasil diunggah!");
      }
    } catch (error: any) {
      setSaveMessage("Gagal unggah foto. Pastikan bucket 'avatars' sudah ada di Supabase.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-float-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Identitas Finansial</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Analisis kepribadian keuangan Anda berdasarkan perilaku transaksi.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        {/* Left Column: Personality & Stats */}
        <div className="space-y-6">
          {/* Main Personality Card */}
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-2xl card-glow">
            {/* Background glowing effects */}
            <div className={`absolute -right-20 -top-20 size-64 rounded-full ${personality.bg} blur-3xl opacity-50 pointer-events-none`} />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
              <div className={`shrink-0 flex size-32 items-center justify-center rounded-[2rem] ${personality.bg} shadow-inner`}>
                <Icon className={`size-16 ${personality.color}`} />
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/50 px-3 py-1 backdrop-blur-md">
                  <TrendingUp className="size-4 text-amber-500" />
                  <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Gelar Saat Ini
                  </span>
                </div>
                
                <div>
                  <h3 className={`text-3xl md:text-4xl font-extrabold tracking-tight mb-2 ${personality.color}`}>
                    {personality.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
                    "{personality.description}"
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                  {personality.traits.map((trait, i) => (
                    <span key={i} className="rounded-lg bg-muted/80 px-3 py-1.5 text-xs font-medium text-foreground">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Behavior Breakdown */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-glow">
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              Behavior Breakdown
            </h4>
            
            <div className="space-y-6">
              {[
                { label: "Konsistensi Anggaran", value: 85, color: "bg-emerald-500" },
                { label: "Kecenderungan Impulsif", value: personality.id === "impulsive" ? 75 : 20, color: "bg-rose-500" },
                { label: "Fokus Jangka Panjang (Investasi)", value: personality.id === "investor" ? 80 : 15, color: "bg-violet-500" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-muted-foreground">{stat.label}</span>
                    <span className="font-bold">{stat.value}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stat.color} transition-all duration-1000 ease-out`} 
                      style={{ width: `${stat.value}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Profile Info & Customization */}
        <div className="space-y-6">
          {/* User Info */}
          <Link 
            href="/profile/edit"
            className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col items-center text-center card-glow cursor-pointer hover:border-primary/50 transition-colors"
          >
            {/* Edit Icon overlay */}
            <div className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit3 className="size-4" />
            </div>

            <div className="size-24 rounded-full bg-gradient-to-tr from-primary to-sky-500 flex items-center justify-center mb-4 shadow-lg overflow-hidden border-4 border-background relative group-hover:scale-105 transition-transform duration-300">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="size-full object-cover" />
              ) : (
                <User className="size-10 text-white" />
              )}
            </div>
            <h4 className="text-xl font-bold text-foreground">
              {fullName ? fullName : (userEmail ? userEmail.split("@")[0] : "User")}
            </h4>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
              <Mail className="size-3.5" />
              {userEmail ?? "Memuat..."}
            </p>
            
            {bio && (
              <p className="text-sm text-foreground/80 mt-4 italic bg-muted/30 px-3 py-2 rounded-xl">
                {bio}
              </p>
            )}

            {quote && (
              <div className="w-full mt-4 pt-4 border-t border-border/50 text-left">
                <Quote className="size-4 text-primary/40 mb-1" />
                <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                  "{quote}"
                </p>
              </div>
            )}

            <div className="w-full h-px bg-border my-6" />
            <div className="flex justify-between w-full text-sm">
              <span className="text-muted-foreground">Total Transaksi</span>
              <span className="font-bold">{transactions.length}</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
