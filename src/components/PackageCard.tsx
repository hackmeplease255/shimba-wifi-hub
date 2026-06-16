import { Check, Zap } from "lucide-react";
import type { PackageDef } from "@/lib/api";
import { formatTzs } from "@/lib/api";

interface Props {
  pkg: PackageDef;
  onBuy?: (pkg: PackageDef) => void;
}

export function PackageCard({ pkg, onBuy }: Props) {
  return (
    <div
      className={
        "relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition hover:shadow-lg " +
        (pkg.highlight ? "border-primary ring-1 ring-primary/30" : "border-border")
      }
    >
      {pkg.highlight && (
        <span className="absolute -top-3 right-4 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
          <Zap className="h-3 w-3" /> Popular
        </span>
      )}
      <h3 className="text-lg font-semibold text-foreground">{pkg.name}</h3>
      <p className="text-sm text-muted-foreground">{pkg.hours}</p>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold tracking-tight text-foreground">
          {pkg.priceTzs.toLocaleString("en-TZ")}
        </span>
        <span className="text-sm font-medium text-muted-foreground">TZS</span>
      </div>

      <ul className="mt-5 flex-1 space-y-2">
        {pkg.perks.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-foreground/80">
            <Check className="mt-0.5 h-4 w-4 text-primary" /> {p}
          </li>
        ))}
      </ul>

      <button
        onClick={() => onBuy?.(pkg)}
        className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
      >
        Buy {formatTzs(pkg.priceTzs)}
      </button>
    </div>
  );
}
