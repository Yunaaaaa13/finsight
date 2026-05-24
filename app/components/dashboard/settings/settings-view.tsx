"use client";

import { useEffect, useState } from "react";
import { Shield, Lock, Mail, Trash2, Eye, EyeOff, Monitor, CheckCircle2, AlertTriangle, Loader2, Globe, Bell, BellOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function SettingsView() {
  const supabase = createClient();

  // ─── State ──────────────────────────────────────
  const [userEmail, setUserEmail] = useState("");
  const [lastSignIn, setLastSignIn] = useState("");
  const [provider, setProvider] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  // Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Preferences (stored in user_metadata)
  const [emailNotif, setEmailNotif] = useState(true);
  const [profilePublic, setProfilePublic] = useState(false);
  const [prefsSaving, setPrefsSaving] = useState(false);
  const [prefsMsg, setPrefsMsg] = useState("");

  // Delete Account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUserEmail(data.user.email ?? "");
        setLastSignIn(data.user.last_sign_in_at ?? "");
        setCreatedAt(data.user.created_at ?? "");
        setProvider(data.user.app_metadata?.provider ?? "email");
        setEmailNotif(data.user.user_metadata?.email_notif !== false);
        setProfilePublic(data.user.user_metadata?.profile_public === true);
      }
    });
  }, [supabase]);

  // ─── Change Password ───────────────────────────
  async function handleChangePassword() {
    if (newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "Password minimal 6 karakter." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "Password tidak sama." });
      return;
    }

    setIsChangingPassword(true);
    setPasswordMsg(null);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsChangingPassword(false);

    if (error) {
      setPasswordMsg({ type: "error", text: error.message });
    } else {
      setPasswordMsg({ type: "success", text: "Password berhasil diubah!" });
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  // ─── Save Preferences ─────────────────────────
  async function handleSavePrefs() {
    setPrefsSaving(true);
    setPrefsMsg("");
    const { error } = await supabase.auth.updateUser({
      data: { email_notif: emailNotif, profile_public: profilePublic }
    });
    setPrefsSaving(false);
    setPrefsMsg(error ? "Gagal menyimpan" : "Tersimpan!");
    if (!error) setTimeout(() => setPrefsMsg(""), 2000);
  }

  // ─── Delete Account ────────────────────────────
  async function handleDeleteAccount() {
    // Sign out the user (actual deletion requires admin API or Edge Function)
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div className="space-y-6 animate-float-in max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Shield className="size-6 text-primary" />
          Pengaturan & Keamanan
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola keamanan akun, preferensi, dan privasi Anda.
        </p>
      </div>

      {/* ═══ Change Password ═══ */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-glow">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-5">
          <Lock className="size-5 text-amber-500" />
          Ubah Password
        </h3>
        <div className="space-y-4 max-w-sm">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Password Baru</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Konfirmasi Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ketik ulang password baru"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>

          {passwordMsg && (
            <div className={`flex items-center gap-2 rounded-xl p-3 text-sm font-medium ${
              passwordMsg.type === "success" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
            }`}>
              {passwordMsg.type === "success" ? <CheckCircle2 className="size-4" /> : <AlertTriangle className="size-4" />}
              {passwordMsg.text}
            </div>
          )}

          <button
            onClick={handleChangePassword}
            disabled={isChangingPassword || !newPassword}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {isChangingPassword ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
            Ubah Password
          </button>
        </div>
      </div>

      {/* ═══ Preferences ═══ */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-glow">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-5">
          <Bell className="size-5 text-sky-500" />
          Preferensi
        </h3>
        <div className="space-y-5">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-sky-500/10">
                {emailNotif ? <Bell className="size-4 text-sky-500" /> : <BellOff className="size-4 text-muted-foreground" />}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Notifikasi Email</p>
                <p className="text-xs text-muted-foreground">Terima ringkasan keuangan mingguan via email</p>
              </div>
            </div>
            <button
              onClick={() => setEmailNotif(!emailNotif)}
              className={`relative w-11 h-6 rounded-full transition-colors ${emailNotif ? "bg-primary" : "bg-muted"}`}
            >
              <div className={`absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform ${emailNotif ? "translate-x-5.5 left-0.5" : "left-0.5"}`}
                style={{ transform: emailNotif ? "translateX(20px)" : "translateX(0)" }}
              />
            </button>
          </div>

          {/* Profile Visibility */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-violet-500/10">
                <Globe className="size-4 text-violet-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Profil Publik</p>
                <p className="text-xs text-muted-foreground">Izinkan pengguna lain melihat profil Anda</p>
              </div>
            </div>
            <button
              onClick={() => setProfilePublic(!profilePublic)}
              className={`relative w-11 h-6 rounded-full transition-colors ${profilePublic ? "bg-primary" : "bg-muted"}`}
            >
              <div className="absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform left-0.5"
                style={{ transform: profilePublic ? "translateX(20px)" : "translateX(0)" }}
              />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSavePrefs}
              disabled={prefsSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {prefsSaving ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
              Simpan Preferensi
            </button>
            {prefsMsg && <span className="text-sm font-medium text-emerald-500">{prefsMsg}</span>}
          </div>
        </div>
      </div>

      {/* ═══ Login Activity ═══ */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-glow">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-5">
          <Monitor className="size-5 text-emerald-500" />
          Aktivitas Login
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-xl border border-border bg-background/50 p-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <Monitor className="size-5 text-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">Sesi Saat Ini</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                  <div className="size-1.5 rounded-full bg-emerald-500" />
                  Aktif
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="font-medium">{userEmail}</span> • via {provider}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">Login terakhir</p>
              <p className="text-xs font-medium text-foreground">
                {lastSignIn ? new Date(lastSignIn).toLocaleString("id-ID", {
                  day: "numeric", month: "short", year: "numeric",
                  hour: "2-digit", minute: "2-digit"
                }) : "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-muted/30 p-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
              <Mail className="size-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Akun Dibuat</p>
              <p className="text-xs text-muted-foreground">
                {createdAt ? new Date(createdAt).toLocaleString("id-ID", {
                  day: "numeric", month: "long", year: "numeric"
                }) : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Danger Zone ═══ */}
      <div className="rounded-2xl border border-rose-500/30 bg-card p-6 shadow-sm">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-rose-500">
          <AlertTriangle className="size-5" />
          Zona Bahaya
        </h3>
        <p className="text-xs text-muted-foreground mb-5">
          Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-500/20 transition-all"
          >
            <Trash2 className="size-4" />
            Hapus Akun Saya
          </button>
        ) : (
          <div className="space-y-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
            <p className="text-sm text-rose-500 font-medium">
              Ketik <span className="font-bold">HAPUS</span> untuk konfirmasi penghapusan akun:
            </p>
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="Ketik HAPUS"
              className="w-full rounded-xl border border-rose-500/30 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/30"
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}
                className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteInput !== "HAPUS"}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-600 transition-all disabled:opacity-40"
              >
                <Trash2 className="size-4" />
                Hapus Permanen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
