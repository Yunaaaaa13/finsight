interface TopCategory {
  category: string;
  amount: number;
  percent: number;
}

interface TopCategoriesProps {
  categories: TopCategory[];
}

export function TopCategories({ categories }: TopCategoriesProps) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Top Kategori Pengeluaran</p>
          <h2 className="mt-3 text-2xl font-semibold text-foreground">Pengeluaran Terbesar</h2>
        </div>
        <span className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-semibold text-secondary-foreground">Bulan Ini</span>
      </div>
      <div className="mt-6 space-y-4">
        {categories.map((item) => (
          <div key={item.category} className="space-y-2">
            <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{item.category}</p>
              <p className="font-semibold">Rp {item.amount.toLocaleString("id-ID")}</p>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted/60">
              <div className="h-full rounded-full bg-primary" style={{ width: `${item.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
