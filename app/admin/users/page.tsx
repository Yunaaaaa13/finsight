import { getUsers } from "@/app/admin/actions";
import { UserTable } from "@/app/components/admin/user-table";
import { AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const result = await getUsers();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Lihat dan kelola semua pengguna terdaftar, peran mereka, dan status akun.
        </p>
      </div>

      {!result.success ? (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-6 flex flex-col items-center justify-center text-center">
          <AlertCircle className="size-8 text-rose-500 mb-3" />
          <h3 className="font-semibold text-rose-600 dark:text-rose-400">Failed to load users</h3>
          <p className="text-sm text-rose-500/80 mt-1 max-w-md">
            {result.error}
          </p>
          {result.error?.includes("service_role") && (
            <p className="text-xs text-rose-500/60 mt-4 bg-background p-3 rounded-lg border border-rose-500/20 text-left w-full">
              <strong>Configuration Missing:</strong> You need to add <code className="bg-rose-500/20 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> to your <code className="bg-rose-500/20 px-1 rounded">.env.local</code> file. You can find this key in your Supabase Dashboard under Settings &gt; API.
            </p>
          )}
        </div>
      ) : (
        <UserTable initialUsers={result.users || []} />
      )}
    </div>
  );
}
