import { getGlobalTransactions } from "@/app/admin/actions";
import { TransactionTableClient } from "./transaction-table-client";

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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold">Transaction Monitoring</h1>
        <p className="text-muted-foreground mt-2">Aggregate view of all platform transactions with advanced filtering.</p>
      </div>

      <TransactionTableClient initialTransactions={transactions || []} />
    </div>
  );
}
