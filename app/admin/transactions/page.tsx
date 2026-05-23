import { getGlobalTransactions } from "@/app/admin/actions";
import { ArrowUpRight, ArrowDownRight, Search, Filter } from "lucide-react";

export const metadata = {
  title: "Global Transactions | Admin",
};

export default async function AdminTransactionsPage() {
  const { success, transactions, error } = await getGlobalTransactions();

  if (!success) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load transactions: {error}
      </div>
    );
  }

  // Basic analytics for header
  let highestSpendingDay = "N/A";
  let maxDailyVolume = 0;
  let currentMonthVolume = 0;

  if (transactions && transactions.length > 0) {
    const dailyVolume: Record<string, number> = {};
    const now = new Date();
    
    transactions.forEach(tx => {
      const amount = Number(tx.amount) || 0;
      if (tx.type === "expense") {
        dailyVolume[tx.date] = (dailyVolume[tx.date] || 0) + amount;
      }
      
      const d = new Date(tx.date);
      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
        currentMonthVolume += amount;
      }
    });

    Object.entries(dailyVolume).forEach(([date, vol]) => {
      if (vol > maxDailyVolume) {
        maxDailyVolume = vol;
        highestSpendingDay = date;
      }
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold">Transaction Monitoring</h1>
        <p className="text-muted-foreground mt-2">Aggregate view of all platform transactions.</p>
      </div>

      {/* Quick Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-medium text-muted-foreground mb-1">Highest Spending Day</p>
          <div className="flex items-end gap-3">
            <h3 className="text-2xl font-bold">
              {highestSpendingDay !== "N/A" 
                ? new Date(highestSpendingDay).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })
                : "N/A"}
            </h3>
            <p className="text-red-500 font-medium pb-1 flex items-center">
              <ArrowDownRight className="size-4 mr-1" />
              Rp {maxDailyVolume.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-medium text-muted-foreground mb-1">Monthly Total Volume</p>
          <div className="flex items-end gap-3">
            <h3 className="text-2xl font-bold">Rp {currentMonthVolume.toLocaleString("id-ID")}</h3>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-semibold text-lg">All Transactions</h3>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                className="w-full bg-secondary/50 border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                disabled
                title="Search filtering is not implemented in this demo"
              />
            </div>
            <button disabled className="flex items-center justify-center p-2 border border-border rounded-xl bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50">
              <Filter className="size-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/30">
              <tr>
                <th className="px-6 py-4 font-medium">User Email</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions && transactions.length > 0 ? (
                transactions.map((tx: any) => (
                  <tr key={tx.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 font-medium">{tx.user_email}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(tx.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td className="px-6 py-4 capitalize">{tx.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.type === "income" 
                          ? "bg-emerald-500/10 text-emerald-500" 
                          : "bg-red-500/10 text-red-500"
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-medium ${
                      tx.type === "income" ? "text-emerald-500" : "text-foreground"
                    }`}>
                      {tx.type === "income" ? "+" : "-"}Rp {Number(tx.amount).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No transactions found in the platform.
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
