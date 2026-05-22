import { cn } from "@/lib/utils";

interface SummaryCardProps {
  label: string;
  value: string;
  delta: string;
  accent: string;
}

export function SummaryCard({ label, value, delta, accent }: SummaryCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-foreground">{value}</p>
        </div>
        <span className={cn("rounded-2xl px-3 py-1 text-sm font-semibold bg-muted text-foreground/90", accent)}>
          {delta}
        </span>
      </div>
    </div>
  );
}
