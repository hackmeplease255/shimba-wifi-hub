import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Ticket, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { checkVoucher } from "@/lib/api";

export const Route = createFileRoute("/voucher")({
  head: () => ({
    meta: [
      { title: "Check Voucher — SHIMBA WIFI" },
      { name: "description", content: "Check the status and validity of a SHIMBA WIFI voucher code." },
    ],
  }),
  component: VoucherPage,
});

function VoucherPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const r = (await checkVoucher(code.trim())) as Record<string, unknown>;
      setResult(r);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check voucher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="mx-auto max-w-2xl px-4 py-12">
        <div className="text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
            <Ticket className="h-6 w-6" />
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Check a voucher</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your code to see status, package, and remaining time.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="mt-8 flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row"
        >
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-primary">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter voucher code"
              className="w-full bg-transparent py-2.5 font-mono text-sm tracking-widest outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Check
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Voucher details
            </h2>
            <pre className="mt-3 max-h-80 overflow-auto rounded-lg bg-muted/60 p-4 text-xs text-foreground">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
