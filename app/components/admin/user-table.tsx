"use client";

import { useState } from "react";
import { MoreHorizontal, ShieldAlert, ShieldCheck, Ban, RotateCcw, Key, Activity, UserCog } from "lucide-react";
import { updateUserRole, toggleSuspendUser, resetUserPassword } from "@/app/admin/actions";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  lastSignIn: string;
};

export function UserTable({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

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
      // Instead of sending email automatically, Supabase generates a link that we can show to the admin
      // Or we can just say success if it sends an email.
      // Assuming it sends an email or generates a link.
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
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium">Last Sign In</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "Admin" ? "bg-violet-500/10 text-violet-500" : "bg-muted text-muted-foreground"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    }`}>
                      <span className={`size-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {user.joined}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {user.lastSignIn}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleRoleChange(user.id, user.role)}
                        disabled={loadingAction === `role-${user.id}`}
                        title={user.role === "Admin" ? "Demote to User" : "Promote to Admin"}
                        className="p-2 text-muted-foreground hover:text-violet-500 hover:bg-violet-500/10 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {user.role === "Admin" ? <UserCog className="size-4" /> : <ShieldCheck className="size-4" />}
                      </button>
                      
                      <button
                        onClick={() => handleSuspend(user.id, user.status)}
                        disabled={loadingAction === `suspend-${user.id}`}
                        title={user.status === "Suspended" ? "Activate User" : "Suspend User"}
                        className={`p-2 text-muted-foreground rounded-lg transition-colors disabled:opacity-50 ${
                          user.status === "Suspended" ? "hover:text-emerald-500 hover:bg-emerald-500/10" : "hover:text-rose-500 hover:bg-rose-500/10"
                        }`}
                      >
                        {user.status === "Suspended" ? <Activity className="size-4" /> : <Ban className="size-4" />}
                      </button>
                      
                      <button
                        onClick={() => handleResetPassword(user.id)}
                        disabled={loadingAction === `reset-${user.id}`}
                        title="Generate Password Reset Link"
                        className="p-2 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Key className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
