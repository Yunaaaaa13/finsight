import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/app/components/dashboard/dashboard-shell";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <DashboardShell />;
}
