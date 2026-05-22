interface CashflowPoint {
  label: string;
  value: number;
}

interface CashflowChartProps {
  points: CashflowPoint[];
}

export function CashflowChart({ points }: CashflowChartProps) {
  const maxValue = Math.max(...points.map((item) => item.value));
  const linePath = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 100 - (point.value / maxValue) * 80;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const areaPath = `${linePath} L 100 100 L 0 100 Z`;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Grafik Cashflow</p>
          <h2 className="mt-3 text-2xl font-semibold text-foreground">Arus Kas Mingguan</h2>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">Stabil</span>
      </div>
      <div className="mt-6">
        <svg viewBox="0 0 100 100" className="h-52 w-full overflow-visible">
          <defs>
            <linearGradient id="cashflowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0.35)" />
              <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#cashflowGradient)" stroke="none" />
          <path d={linePath} fill="none" stroke="rgb(14, 165, 233)" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
          {points.map((point, index) => {
            const x = (index / (points.length - 1)) * 100;
            const y = 100 - (point.value / maxValue) * 80;
            return (
              <circle key={point.label} cx={x} cy={y} r={2.4} fill="rgb(14, 165, 233)" />
            );
          })}
        </svg>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-muted-foreground sm:grid-cols-5">
          {points.map((point) => (
            <div key={point.label} className="rounded-2xl bg-muted/40 p-3 text-center">
              <p className="font-semibold text-foreground">{point.label}</p>
              <p className="mt-1 text-xs">Rp {point.value.toLocaleString("id-ID")}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
