import type { ReactNode } from "react";

interface Props {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  accent?: "primary" | "success" | "warning" | "destructive" | "secondary";
}

const ACCENT: Record<NonNullable<Props["accent"]>, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning-foreground",
  destructive: "bg-destructive/10 text-destructive",
  secondary: "bg-secondary/10 text-secondary",
};

export function StatsCard({ label, value, icon, accent = "primary" }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {icon && (
          <span className={`grid h-9 w-9 place-items-center rounded-lg ${ACCENT[accent]}`}>
            {icon}
          </span>
        )}
      </div>
      <div className="mt-3 text-3xl font-bold tracking-tight text-foreground">{value}</div>
    </div>
  );
}
