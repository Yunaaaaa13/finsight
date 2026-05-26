"use client";

import { useState } from "react";
import {
  ShieldCheck, ShieldOff, Ban, RotateCcw, Mail, X, FileText,
  ArrowUpRight, ArrowDownRight, Target, AlertTriangle, ClipboardList,
  ChevronDown, ChevronUp, CheckCircle2, XCircle
} from "lucide-react";
import { updateUserRole, toggleSuspendUser, resetUserPassword } from "@/app/admin/actions";
import { useCurrency } from "@/app/hooks/use-currency";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  lastSignIn: string;
  lastSignInFull: string;
  txCount: number;
  financials: {
    income: number;
    expense: number;
    savings: number;
    healthScore: number;
  };
  preferredCurrency: string;
  recentTransactions: any[];
};

type AuditEntry = {
  id: string;
  timestamp: string;
  action: string;
  targetUser: string;
  targetEmail: string;
  result: "success" | "error";
  detail: string;
};

type ConfirmAction = {
  type: "promote" | "demote" | "suspend" | "activate";
  userId: string;
  userName: string;
  userEmail: string;
};

const ACTION_META = {
  promote: {
    label: "Promote to Admin",
    icon: ShieldCheck,
    color: "violet",
    confirmTitle: "Promote to Admin?",
    confirmDesc: "This user will gain full admin access to the platform, including user management and analytics.",
    btnClass: "bg-violet-500 hover:bg-violet-600 text-white",
    resultText: (name: string) => `${name} promoted to Admin.`,
  },
  demote: {
    label: "Demote to User",
    icon: ShieldOff,
    color: "amber",
    confirmTitle: "Demote to User?",
    confirmDesc: "This admin will lose all admin privileges and will be reverted to a regular user.",
    btnClass: "bg-amber-500 hover:bg-amber-600 text-white",
    resultText: (name: string) => `${name} demoted to User.`,
  },
  suspend: {
    label: "Suspend User",
    icon: Ban,
    color: "rose",
    confirmTitle: "Suspend this user?",
    confirmDesc: "The user will be locked out and unable to sign in until reactivated.",
    btnClass: "bg-rose-500 hover:bg-rose-600 text-white",
    resultText: (name: string) => `${name} suspended.`,
  },
  activate: {
    label: "Activate User",
    icon: RotateCcw,
    color: "emerald",
    confirmTitle: "Reactivate this user?",
    confirmDesc: "The user will regain access to their account immediately.",
    btnClass: "bg-emerald-500 hover:bg-emerald-600 text-white",
    resultText: (name: string) => `${name} reactivated.`,
  },
};

export function UserTable({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const { baseCurrency, convertFromIDR, formatCurrency } = useCurrency();

  const addAuditEntry = (entry: Omit<AuditEntry, "id" | "timestamp">) => {
    setAuditLog(prev => [{
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString("id-ID"),
      ...entry
    }, ...prev]);
  };

  const executeAction = async (action: ConfirmAction) => {
    setLoadingAction(`${action.type}-${action.userId}`);
    setConfirmAction(null);

    if (action.type === "promote" || action.type === "demote") {
      const newRole = action.type === "promote" ? "Admin" : "User";
      const res = await updateUserRole(action.userId, newRole);
      if (res.success) {
        setUsers(prev => prev.map(u => u.id === action.userId ? { ...u, role: newRole } : u));
        if (selectedUser?.id === action.userId) setSelectedUser(s => s ? { ...s, role: newRole } : s);
        addAuditEntry({
          action: ACTION_META[action.type].label,
          targetUser: action.userName,
          targetEmail: action.userEmail,
          result: "success",
          detail: ACTION_META[action.type].resultText(action.userName),
        });
      } else {
        addAuditEntry({
          action: ACTION_META[action.type].label,
          targetUser: action.userName,
          targetEmail: action.userEmail,
          result: "error",
          detail: res.error || "Failed",
        });
      }
    } else {
      const isSuspended = action.type === "activate";
      const res = await toggleSuspendUser(action.userId, isSuspended);
      if (res.success) {
        const newStatus = action.type === "activate" ? "Active" : "Suspended";
        setUsers(prev => prev.map(u => u.id === action.userId ? { ...u, status: newStatus } : u));
        if (selectedUser?.id === action.userId) setSelectedUser(s => s ? { ...s, status: newStatus } : s);
        addAuditEntry({
          action: ACTION_META[action.type].label,
          targetUser: action.userName,
          targetEmail: action.userEmail,
          result: "success",
          detail: ACTION_META[action.type].resultText(action.userName),
        });
      } else {
        addAuditEntry({
          action: ACTION_META[action.type].label,
          targetUser: action.userName,
          targetEmail: action.userEmail,
          result: "error",
          detail: res.error || "Failed",
        });
      }
    }
    setLoadingAction(null);
  };

  const requestAction = (type: ConfirmAction["type"], user: AdminUser) => {
    setConfirmAction({ type, userId: user.id, userName: user.name, userEmail: user.email });
  };

  return (
    <div className="space-y-4">

      {/* ── Audit Log Toggle ──────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <button
          onClick={() => setShowAuditLog(v => !v)}
          className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold hover:bg-muted/40 transition-colors"
        >
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <ClipboardList className="size-4" />
            <span>Audit Log</span>
            {auditLog.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                {auditLog.length}
              </span>
            )}
          </div>
          {showAuditLog ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
        </button>

        {showAuditLog && (
          <div className="border-t border-border divide-y divide-border max-h-64 overflow-y-auto">
            {auditLog.length === 0 ? (
              <p className="px-5 py-6 text-sm text-muted-foreground text-center">
                No actions recorded in this session yet.
              </p>
            ) : auditLog.map(entry => (
              <div key={entry.id} className="flex items-start gap-3 px-5 py-3 hover:bg-muted/30 transition-colors">
                {entry.result === "success"
                  ? <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  : <XCircle className="size-4 text-rose-500 mt-0.5 shrink-0" />
                }
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-foreground">{entry.action}</span>
                    <span className="text-xs text-muted-foreground">→ {entry.targetEmail}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{entry.detail}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{entry.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── User Table ────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Last Login</th>
                <th className="px-6 py-4 font-medium">Txs</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => {
                const isLoading = (t: string) => loadingAction === `${t}-${user.id}`;
                return (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0 text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="cursor-pointer" onClick={() => setSelectedUser(user)}>
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        user.role === "Admin"
                          ? "bg-violet-500/10 text-violet-500"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {user.role === "Admin" && <ShieldCheck className="size-3" />}
                        {user.role}
                      </span>
                    </td>

                    {/* Last Login */}
                    <td className="px-6 py-4 text-muted-foreground capitalize text-xs">
                      {user.lastSignIn}
                    </td>

                    {/* Tx count */}
                    <td className="px-6 py-4 font-medium text-center">{user.txCount}</td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-rose-500/10 text-rose-500"
                      }`}>
                        <span className={`size-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                        {user.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* View Profile */}
                        <button
                          onClick={() => setSelectedUser(user)}
                          title="View Profile"
                          className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        >
                          <FileText className="size-4" />
                        </button>

                        {/* Role toggle */}
                        {user.role === "Admin" ? (
                          <button
                            onClick={() => requestAction("demote", user)}
                            disabled={isLoading("demote")}
                            title="Demote to User"
                            className="p-2 rounded-lg text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 transition-colors disabled:opacity-40"
                          >
                            <ShieldOff className="size-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => requestAction("promote", user)}
                            disabled={isLoading("promote")}
                            title="Promote to Admin"
                            className="p-2 rounded-lg text-muted-foreground hover:text-violet-500 hover:bg-violet-500/10 transition-colors disabled:opacity-40"
                          >
                            <ShieldCheck className="size-4" />
                          </button>
                        )}

                        {/* Suspend / Activate */}
                        {user.status === "Suspended" ? (
                          <button
                            onClick={() => requestAction("activate", user)}
                            disabled={isLoading("activate")}
                            title="Activate User"
                            className="p-2 rounded-lg text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors disabled:opacity-40"
                          >
                            <RotateCcw className="size-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => requestAction("suspend", user)}
                            disabled={isLoading("suspend") || user.role === "Admin"}
                            title={user.role === "Admin" ? "Admins cannot be suspended" : "Suspend User"}
                            className="p-2 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Ban className="size-4" />
                          </button>
                        )}

                        {/* Send Reminder */}
                        <a
                          href={`mailto:${user.email}?subject=Finsight Account Reminder&body=Hello ${user.name},`}
                          title="Send Email Reminder"
                          className="p-2 rounded-lg text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                        >
                          <Mail className="size-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Confirmation Modal ───────────────────────────────────────────── */}
      {confirmAction && (() => {
        const meta = ACTION_META[confirmAction.type];
        const Icon = meta.icon;
        const colorMap: Record<string, string> = {
          violet: "bg-violet-500/10 text-violet-500",
          amber: "bg-amber-500/10 text-amber-500",
          rose: "bg-rose-500/10 text-rose-500",
          emerald: "bg-emerald-500/10 text-emerald-500",
        };
        return (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="absolute inset-0" onClick={() => setConfirmAction(null)} />
            <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-150 space-y-5">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className={`flex size-12 items-center justify-center rounded-2xl shrink-0 ${colorMap[meta.color]}`}>
                  <AlertTriangle className="size-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{meta.confirmTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{meta.confirmDesc}</p>
                </div>
                <button onClick={() => setConfirmAction(null)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                  <X className="size-4" />
                </button>
              </div>

              {/* Target user */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border">
                <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {confirmAction.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm">{confirmAction.userName}</p>
                  <p className="text-xs text-muted-foreground">{confirmAction.userEmail}</p>
                </div>
              </div>

              {/* Action: what will change */}
              <div className="flex items-center gap-2 text-sm">
                <Icon className={`size-4 ${colorMap[meta.color].split(" ")[1]}`} />
                <span className="font-medium">{meta.label}</span>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => executeAction(confirmAction)}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${meta.btnClass}`}
                >
                  <Icon className="size-4" />
                  Confirm
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── User Profile Modal ───────────────────────────────────────────── */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setSelectedUser(null)} />
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

            {/* Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
              <h2 className="text-xl font-bold">User Profile</h2>
              <button onClick={() => setSelectedUser(null)} className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
                <X className="size-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6">

              {/* Basic Info */}
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="size-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-4xl shrink-0 border border-primary/20">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedUser.name}</h3>
                    <p className="text-muted-foreground text-sm">{selectedUser.email}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${
                      selectedUser.role === "Admin"
                        ? "bg-violet-500/10 text-violet-500 border-violet-500/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}>
                      {selectedUser.role === "Admin" && <ShieldCheck className="size-3" />}
                      {selectedUser.role}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      selectedUser.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    }`}>
                      {selectedUser.status}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      {selectedUser.preferredCurrency}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-3 rounded-xl border border-border/50">
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">Joined</p>
                      <p className="font-medium">{selectedUser.joined}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">Last Login</p>
                      <p className="font-medium">{selectedUser.lastSignInFull}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role & Permission Actions */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Role & Permissions</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* Promote */}
                  <button
                    onClick={() => requestAction("promote", selectedUser)}
                    disabled={selectedUser.role === "Admin" || loadingAction === `promote-${selectedUser.id}`}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-violet-500/40 hover:bg-violet-500/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                  >
                    <ShieldCheck className="size-5 text-violet-500" />
                    <span className="text-xs font-medium text-center leading-tight">Promote to Admin</span>
                  </button>

                  {/* Demote */}
                  <button
                    onClick={() => requestAction("demote", selectedUser)}
                    disabled={selectedUser.role !== "Admin" || loadingAction === `demote-${selectedUser.id}`}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-amber-500/40 hover:bg-amber-500/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ShieldOff className="size-5 text-amber-500" />
                    <span className="text-xs font-medium text-center leading-tight">Demote to User</span>
                  </button>

                  {/* Suspend */}
                  <button
                    onClick={() => requestAction("suspend", selectedUser)}
                    disabled={selectedUser.status === "Suspended" || selectedUser.role === "Admin" || loadingAction === `suspend-${selectedUser.id}`}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-rose-500/40 hover:bg-rose-500/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Ban className="size-5 text-rose-500" />
                    <span className="text-xs font-medium text-center leading-tight">Suspend User</span>
                  </button>

                  {/* Activate */}
                  <button
                    onClick={() => requestAction("activate", selectedUser)}
                    disabled={selectedUser.status !== "Suspended" || loadingAction === `activate-${selectedUser.id}`}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <RotateCcw className="size-5 text-emerald-500" />
                    <span className="text-xs font-medium text-center leading-tight">Activate User</span>
                  </button>
                </div>
              </div>

              {/* Financial Summary */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Financial Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Income", value: formatCurrency(convertFromIDR(selectedUser.financials.income), baseCurrency), color: "text-emerald-500" },
                    { label: "Expense", value: formatCurrency(convertFromIDR(selectedUser.financials.expense), baseCurrency), color: "text-rose-500" },
                    { label: "Savings", value: formatCurrency(convertFromIDR(selectedUser.financials.savings), baseCurrency), color: selectedUser.financials.savings >= 0 ? "text-emerald-500" : "text-rose-500" },
                    { label: "Health Score", value: `${selectedUser.financials.healthScore}/100`, color: selectedUser.financials.healthScore > 60 ? "text-emerald-500" : selectedUser.financials.healthScore > 30 ? "text-amber-500" : "text-rose-500" },
                  ].map(f => (
                    <div key={f.label} className="p-3 rounded-xl border border-border bg-card">
                      <p className="text-xs text-muted-foreground font-medium mb-1">{f.label}</p>
                      <p className={`text-base font-bold truncate ${f.color}`} title={f.value}>{f.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Recent Activity</h4>
                {selectedUser.recentTransactions.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUser.recentTransactions.map(tx => (
                      <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`size-7 rounded-full flex items-center justify-center shrink-0 ${tx.type === "income" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
                            {tx.type === "income" ? <ArrowDownRight className="size-3.5" /> : <ArrowUpRight className="size-3.5" />}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{tx.title}</p>
                            <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString("id-ID")}</p>
                          </div>
                        </div>
                        <span className={`font-semibold text-sm ${tx.type === "income" ? "text-emerald-500" : "text-foreground"}`}>
                          {tx.type === "income" ? "+" : "-"}{formatCurrency(convertFromIDR(tx.amount), baseCurrency)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center border border-dashed border-border rounded-xl">
                    <p className="text-muted-foreground text-sm">No recent transactions.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/30 flex justify-between items-center gap-3 sticky bottom-0">
              <a
                href={`mailto:${selectedUser.email}?subject=Important: Finsight Account`}
                className="px-4 py-2 bg-blue-500 text-white font-medium text-sm rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Mail className="size-4" />
                Send Reminder
              </a>
              <div className="flex gap-2">
                {selectedUser.status === "Suspended" ? (
                  <button
                    onClick={() => requestAction("activate", selectedUser)}
                    className="px-4 py-2 bg-emerald-500 text-white font-medium text-sm rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="size-4" />
                    Activate
                  </button>
                ) : (
                  <button
                    onClick={() => requestAction("suspend", selectedUser)}
                    disabled={selectedUser.role === "Admin"}
                    className="px-4 py-2 bg-rose-500 text-white font-medium text-sm rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Ban className="size-4" />
                    Suspend
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
