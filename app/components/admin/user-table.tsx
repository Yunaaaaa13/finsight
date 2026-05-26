"use client";

import { useState } from "react";
import { MoreHorizontal, ShieldAlert, ShieldCheck, Ban, RotateCcw, Key, Activity, UserCog, Mail, X, FileText, ArrowUpRight, ArrowDownRight, Target } from "lucide-react";
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

export function UserTable({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
  
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const { baseCurrency, convertFromIDR, formatCurrency } = useCurrency();

  const handleRoleChange = async (userId: string, currentRole: string) => {
    setLoadingAction(`role-${userId}`);
    setActionMessage(null);
    const newRole = currentRole === "Admin" ? "User" : "Admin";
    const res = await updateUserRole(userId, newRole);
    if (res.success) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setActionMessage({ type: "success", text: `Role updated to ${newRole}` });
    } else {
      setActionMessage({ type: "error", text: res.error || "Failed to update role" });
    }
    setLoadingAction(null);
  };

  const handleSuspend = async (userId: string, status: string) => {
    setLoadingAction(`suspend-${userId}`);
    setActionMessage(null);
    const isSuspended = status === "Suspended";
    const res = await toggleSuspendUser(userId, isSuspended);
    if (res.success) {
      const newStatus = isSuspended ? "Active" : "Suspended";
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      setActionMessage({ type: "success", text: `User ${newStatus.toLowerCase()} successfully` });
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }
    } else {
      setActionMessage({ type: "error", text: res.error || "Failed to change suspend status" });
    }
    setLoadingAction(null);
  };

  const handleResetPassword = async (userId: string) => {
    setLoadingAction(`reset-${userId}`);
    setActionMessage(null);
    const res = await resetUserPassword(userId);
    if (res.success) {
      setActionMessage({ type: "success", text: `Password reset link generated. You can share this link with the user: ${res.link}` });
    } else {
      setActionMessage({ type: "error", text: res.error || "Failed to reset password" });
    }
    setLoadingAction(null);
  };

  return (
    <div className="space-y-4">
      {actionMessage && (
        <div className={`p-4 rounded-xl border ${actionMessage.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"}`}>
          <p className="text-sm font-medium">{actionMessage.text}</p>
        </div>
      )}
      
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Last Login</th>
                <th className="px-6 py-4 font-medium">Transactions</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div 
                        className="cursor-pointer group" 
                        onClick={() => setSelectedUser(user)}
                      >
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground capitalize">
                    {user.lastSignIn}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {user.txCount}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    }`}>
                      <span className={`size-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        title="View Profile"
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <FileText className="size-4" />
                      </button>

                      <a
                        href={`mailto:${user.email}?subject=Finsight Account Reminder&body=Hello ${user.name},`}
                        title="Send Reminder"
                        className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <Mail className="size-4" />
                      </a>

                      <button
                        onClick={() => handleSuspend(user.id, user.status)}
                        disabled={loadingAction === `suspend-${user.id}` || user.role === "Admin"}
                        title={user.role === "Admin" ? "Admin is absolute (Cannot be suspended)" : (user.status === "Suspended" ? "Reactivate User" : "Suspend User")}
                        className={`p-2 text-muted-foreground rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                          user.status === "Suspended" ? "hover:text-emerald-500 hover:bg-emerald-500/10" : "hover:text-rose-500 hover:bg-rose-500/10"
                        }`}
                      >
                        {user.status === "Suspended" ? <RotateCcw className="size-4" /> : <Ban className="size-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="absolute inset-0" 
            onClick={() => setSelectedUser(null)}
          />
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
              <h2 className="text-xl font-bold flex items-center gap-2">
                User Profile
              </h2>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto">
              {/* Top Section: Basic Info */}
              <div className="flex flex-col sm:flex-row gap-6 mb-8">
                <div className="size-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-4xl shrink-0 border border-primary/20">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{selectedUser.name}</h3>
                    <p className="text-muted-foreground">{selectedUser.email}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                      {selectedUser.role}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${selectedUser.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                      {selectedUser.status}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      Currency: {selectedUser.preferredCurrency}
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

              {/* Middle Section: Financial Summary */}
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Financial Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 rounded-xl border border-border bg-card">
                  <p className="text-xs text-muted-foreground mb-1 font-medium">Total Income</p>
                  <p className="text-lg font-bold text-emerald-500 truncate" title={formatCurrency(convertFromIDR(selectedUser.financials.income), baseCurrency)}>
                    {formatCurrency(convertFromIDR(selectedUser.financials.income), baseCurrency)}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <p className="text-xs text-muted-foreground mb-1 font-medium">Total Expense</p>
                  <p className="text-lg font-bold text-rose-500 truncate" title={formatCurrency(convertFromIDR(selectedUser.financials.expense), baseCurrency)}>
                    {formatCurrency(convertFromIDR(selectedUser.financials.expense), baseCurrency)}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <p className="text-xs text-muted-foreground mb-1 font-medium">Net Savings</p>
                  <p className={`text-lg font-bold truncate ${selectedUser.financials.savings >= 0 ? 'text-emerald-500' : 'text-rose-500'}`} title={formatCurrency(convertFromIDR(selectedUser.financials.savings), baseCurrency)}>
                    {formatCurrency(convertFromIDR(selectedUser.financials.savings), baseCurrency)}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <p className="text-xs text-muted-foreground mb-1 font-medium">Health Score</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-lg font-bold ${selectedUser.financials.healthScore > 60 ? 'text-emerald-500' : selectedUser.financials.healthScore > 30 ? 'text-amber-500' : 'text-rose-500'}`}>
                      {selectedUser.financials.healthScore}/100
                    </p>
                    <Target className="size-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Bottom Section: Activity */}
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Recent Activity</h4>
              {selectedUser.recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {selectedUser.recentTransactions.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {tx.type === 'income' ? <ArrowDownRight className="size-4" /> : <ArrowUpRight className="size-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{tx.title}</p>
                          <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString("id-ID")}</p>
                        </div>
                      </div>
                      <div className={`font-semibold text-sm ${tx.type === 'income' ? 'text-emerald-500' : 'text-foreground'}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(convertFromIDR(tx.amount), baseCurrency)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed border-border rounded-xl">
                  <p className="text-muted-foreground text-sm">No recent transactions found.</p>
                </div>
              )}
            </div>
            
            {/* Footer actions */}
            <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-3 sticky bottom-0">
              <a
                href={`mailto:${selectedUser.email}?subject=Important: Finsight Account`}
                className="px-4 py-2 bg-blue-500 text-white font-medium text-sm rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Mail className="size-4" />
                Send Reminder
              </a>
              <button
                onClick={() => handleSuspend(selectedUser.id, selectedUser.status)}
                disabled={loadingAction === `suspend-${selectedUser.id}` || selectedUser.role === "Admin"}
                className={`px-4 py-2 font-medium text-sm rounded-xl transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 ${
                  selectedUser.status === "Suspended" 
                    ? "bg-emerald-500 text-white hover:bg-emerald-600" 
                    : "bg-rose-500 text-white hover:bg-rose-600"
                }`}
              >
                {selectedUser.status === "Suspended" ? <RotateCcw className="size-4" /> : <Ban className="size-4" />}
                {selectedUser.status === "Suspended" ? "Reactivate User" : "Suspend User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
