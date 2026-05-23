"use client";

import { useState, useMemo } from "react";
import { Search, Filter, ArrowDownRight, ArrowUpRight } from "lucide-react";

export function TransactionTableClient({ initialTransactions }: { initialTransactions: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    initialTransactions.forEach(tx => cats.add(tx.category));
    return Array.from(cats);
  }, [initialTransactions]);

  const filteredTransactions = useMemo(() => {
    return initialTransactions.filter(tx => {
      const matchesSearch = tx.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            tx.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || tx.category === categoryFilter;
      const matchesType = typeFilter === "all" || tx.type === typeFilter;
      
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [initialTransactions, searchTerm, categoryFilter, typeFilter]);

  // Analytics for filtered view
  const { topCategory, totalVolume, avgDaily } = useMemo(() => {
    if (filteredTransactions.length === 0) return { topCategory: "-", totalVolume: 0, avgDaily: 0 };
    
    let vol = 0;
    const catCount: Record<string, number> = {};
    const dateCount: Record<string, boolean> = {};

    filteredTransactions.forEach(tx => {
      const amt = Number(tx.amount) || 0;
      vol += amt;
      catCount[tx.category] = (catCount[tx.category] || 0) + amt;
      dateCount[tx.date] = true;
    });

    const days = Object.keys(dateCount).length || 1;
    let topCat = "-";
    let maxCatVol = 0;
    Object.entries(catCount).forEach(([c, v]) => {
      if (v > maxCatVol) {
        maxCatVol = v;
        topCat = c;
      }
    });

    return {
      topCategory: topCat,
      totalVolume: vol,
      avgDaily: Math.round(vol / days)
    };
  }, [filteredTransactions]);

  return (
    <div className="space-y-6">
      {/* Quick Insights based on filters */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm card-glow">
          <p className="text-sm font-medium text-muted-foreground mb-1">Top Category (Volume)</p>
          <h3 className="text-xl font-bold capitalize text-primary">{topCategory}</h3>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm card-glow">
          <p className="text-sm font-medium text-muted-foreground mb-1">Total Volume</p>
          <h3 className="text-xl font-bold">Rp {totalVolume.toLocaleString("id-ID")}</h3>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm card-glow">
          <p className="text-sm font-medium text-muted-foreground mb-1">Avg Daily Transaction</p>
          <h3 className="text-xl font-bold">Rp {avgDaily.toLocaleString("id-ID")}</h3>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden card-glow">
        <div className="p-6 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-secondary/10">
          <h3 className="font-semibold text-lg whitespace-nowrap">All Transactions</h3>
          
          <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search user or category..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 capitalize"
            >
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Types</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
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
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx: any) => (
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                        tx.type === "income" 
                          ? "bg-emerald-500/10 text-emerald-500" 
                          : "bg-red-500/10 text-red-500"
                      }`}>
                        {tx.type === "income" ? <ArrowUpRight className="size-3"/> : <ArrowDownRight className="size-3"/>}
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
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <Filter className="size-8 text-muted-foreground/30 mb-3" />
                      <p>No transactions match your filters.</p>
                      <button 
                        onClick={() => { setSearchTerm(""); setCategoryFilter("all"); setTypeFilter("all"); }}
                        className="text-primary mt-2 text-sm font-medium hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
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
