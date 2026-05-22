"use client";

import { useEffect, useState } from "react";
import { User, Edit3, Image as ImageIcon, CheckCircle2, Loader2, ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfileEditPage() {
  const [bio, setBio] = useState("");
  const [quote, setQuote] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        const meta = data.user.user_metadata;
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
        router.push("/dashboard");
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

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

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
    <div className="min-h-screen bg-background p-4 sm:p-6 pb-20">
      <div className="max-w-2xl mx-auto mt-4 sm:mt-10 animate-float-in">
        <Link href="/dashboard" className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="size-4" />
          Kembali ke Dashboard
        </Link>
        
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm card-glow">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <Edit3 className="size-5 text-primary" />
            </div>
            Kustomisasi Profil
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Foto Profil (URL / Unggah)</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="size-20 shrink-0 rounded-full bg-gradient-to-tr from-primary to-sky-500 flex items-center justify-center shadow-lg overflow-hidden border-2 border-background">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="size-full object-cover" />
                  ) : (
                    <User className="size-8 text-white" />
                  )}
                </div>
                <div className="flex-1 w-full space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                      <input
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="Tempel URL foto di sini 👉"
                        className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <label className="cursor-pointer shrink-0 rounded-xl bg-muted px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted/80 transition-all flex items-center gap-2">
                      {isUploading ? <Loader2 className="size-4 animate-spin" /> : "Pilih File"}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full h-px bg-border my-6" />

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Bio Singkat</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Misal: Investor pemula, Pejuang kebebasan finansial"
                maxLength={50}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <p className="text-xs text-muted-foreground mt-2 text-right">{bio.length}/50 karakter</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Financial Quote</label>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Misal: Sedikit demi sedikit, lama-lama menjadi bukit."
                rows={3}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>
            
            <div className="pt-6">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 ml-auto shadow-lg shadow-primary/20"
              >
                {isSaving ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                {isSaving ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
              </button>
              {saveMessage && (
                <p className={`text-sm text-right font-medium mt-3 ${saveMessage.includes("Gagal") ? "text-rose-500" : "text-emerald-500"}`}>
                  {saveMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
