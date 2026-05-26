import { getDeepAnalytics } from "@/app/admin/actions";
import { AnalyticsClient } from "@/app/components/admin/analytics-client"; // Force VS Code update
import { AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const result = await getDeepAnalytics();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Platform Analytics</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Deep insights into user growth, spending behavior, currency adoption, and financial health across the platform.
        </p>
      </div>

      {!result.success ? (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-6 flex flex-col items-center justify-center text-center">
          <AlertCircle className="size-8 text-rose-500 mb-3" />
          <h3 className="font-semibold text-rose-600 dark:text-rose-400">Failed to load analytics</h3>
          <p className="text-sm text-rose-500/80 mt-1 max-w-md">{result.error}</p>
        </div>
      ) : (
        <AnalyticsClient data={result.data} />
      )}
    </div>
  );
}
