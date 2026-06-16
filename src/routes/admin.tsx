import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ShoppingCart,
  CheckCircle2,
  Clock3,
  XCircle,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StatsCard } from "@/components/StatsCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getAdminStats, formatTzs } from "@/lib/api";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — SHIMBA WIFI" },
      { name: "description", content: "SHIMBA WIFI sales and orders dashboard." },
    ],
  }),
  component: AdminPage,
});

function pick(stats: Record<string, unknown> | undefined, ...keys: string[]): number {
  if (!stats) return 0;
  for (const k of keys) {
    const v = stats[k];
    if (typeof v === "number") return v;
    if (typeof v === "string" && v.trim() !== "" && !isNaN(Number(v))) return Number(v);
  }
  return 0;
}

function AdminPage() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
    refetchInterval: 15000,
  });

  const total = pick(data, "totalOrders", "total_orders");
  const paid = pick(data, "paidOrders", "paid_orders");
  const pending = pick(data, "pendingOrders", "pending_orders");
  const failed = pick(data, "failedOrders", "failed_orders");
  const revenue = pick(data, "totalRevenue", "total_revenue");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Real-time view of SHIMBA WIFI voucher sales.
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="mt-12 flex items-center justify-center gap-3 text-muted-foreground">
            <LoadingSpinner /> Loading stats…
          </div>
        ) : error ? (
          <div className="mt-8 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            Failed to load stats. Make sure the backend is reachable.
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatsCard
              label="Total Orders"
              value={total.toLocaleString()}
              icon={<ShoppingCart className="h-5 w-5" />}
              accent="secondary"
            />
            <StatsCard
              label="Paid Orders"
              value={paid.toLocaleString()}
              icon={<CheckCircle2 className="h-5 w-5" />}
              accent="success"
            />
            <StatsCard
              label="Pending Orders"
              value={pending.toLocaleString()}
              icon={<Clock3 className="h-5 w-5" />}
              accent="warning"
            />
            <StatsCard
              label="Failed Orders"
              value={failed.toLocaleString()}
              icon={<XCircle className="h-5 w-5" />}
              accent="destructive"
            />
            <StatsCard
              label="Total Revenue"
              value={formatTzs(revenue)}
              icon={<DollarSign className="h-5 w-5" />}
              accent="primary"
            />
            <div className="rounded-2xl border border-dashed border-border bg-card p-5 text-sm text-muted-foreground">
              Stats refresh every 15 seconds. Data source:{" "}
              <span className="font-mono text-foreground">/api/admin/stats</span>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
