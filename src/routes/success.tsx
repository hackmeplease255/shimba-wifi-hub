import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Check, Copy, Wifi, ArrowLeft, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getPaymentStatus, type PaymentStatus } from "@/lib/api";

export const Route = createFileRoute("/success")({
  validateSearch: (s: Record<string, unknown>) => ({
    ref: typeof s.ref === "string" ? s.ref : "",
  }),
  head: () => ({
    meta: [
      { title: "Payment Status — SHIMBA WIFI" },
      { name: "description", content: "Waiting for your SHIMBA WIFI voucher payment confirmation." },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { ref } = Route.useSearch();
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!ref) return;
    const poll = async () => {
      try {
        const r = await getPaymentStatus(ref);
        setStatus(r);
        const s = (r.status || "").toLowerCase();
        if (s === "paid" || s === "failed" || s === "success" || s === "completed") {
          if (timer.current) clearInterval(timer.current);
        }
      } catch {
        // keep polling
      }
    };
    poll();
    timer.current = setInterval(poll, 5000);
    tick.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
      if (tick.current) clearInterval(tick.current);
    };
  }, [ref]);

  const s = (status?.status || "").toLowerCase();
  const isPaid = s === "paid" || s === "success" || s === "completed";
  const isFailed = s === "failed" || s === "cancelled";
  const voucher = status?.voucher_code || status?.voucher || "";
  const pkg = status?.package_name || status?.package || "";

  const copy = async () => {
    if (!voucher) return;
    await navigator.clipboard.writeText(String(voucher));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="mx-auto max-w-2xl px-4 py-12">
        {!ref ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <AlertCircle className="mx-auto h-10 w-10 text-warning-foreground" />
            <h1 className="mt-3 text-xl font-bold">No order reference</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Start a purchase to see payment status.
            </p>
            <Link
              to="/packages"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back to packages
            </Link>
          </div>
        ) : isPaid ? (
          <div className="rounded-2xl border border-success/30 bg-card p-8 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-success text-success-foreground">
                <Check className="h-7 w-7" />
              </span>
              <h1 className="mt-4 text-2xl font-extrabold tracking-tight">Payment confirmed</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Your voucher is ready. Use it on the SHIMBA WIFI hotspot login page.
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-border bg-muted/40 p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Voucher Code
              </p>
              <div className="mt-2 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-mono text-2xl font-bold tracking-widest text-foreground sm:text-3xl">
                  {voucher || "—"}
                </span>
                <button
                  onClick={copy}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border p-3">
                <dt className="text-xs text-muted-foreground">Package</dt>
                <dd className="text-sm font-semibold">{pkg || "—"}</dd>
              </div>
              <div className="rounded-lg border border-border p-3">
                <dt className="text-xs text-muted-foreground">Status</dt>
                <dd className="text-sm font-semibold text-success">Paid</dd>
              </div>
            </dl>

            <Link
              to="/packages"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold hover:bg-accent"
            >
              Buy another voucher
            </Link>
          </div>
        ) : isFailed ? (
          <div className="rounded-2xl border border-destructive/30 bg-card p-8 text-center shadow-sm">
            <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
            <h1 className="mt-3 text-xl font-bold">Payment failed</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {status?.message || "The payment was not completed. Please try again."}
            </p>
            <Link
              to="/packages"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Try again
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <Wifi className="h-7 w-7" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight">
              Waiting for payment…
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Approve the Mobile Money prompt on your phone. We're checking every 5 seconds.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3 text-sm text-muted-foreground">
              <LoadingSpinner size={20} />
              <span>Elapsed: {elapsed}s</span>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Order reference:{" "}
              <span className="font-mono text-foreground">{ref}</span>
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
