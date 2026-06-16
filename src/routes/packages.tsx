import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, X, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PackageCard } from "@/components/PackageCard";
import { PACKAGES, payMongike, formatTzs, type PackageDef } from "@/lib/api";

export const Route = createFileRoute("/packages")({
  head: () => ({
    meta: [
      { title: "Packages — SHIMBA WIFI" },
      {
        name: "description",
        content:
          "Choose a SHIMBA WIFI voucher: 6h, 24h, 48h or 7 days. Pay with Mobile Money.",
      },
      { property: "og:title", content: "SHIMBA WIFI Packages" },
      { property: "og:description", content: "Pick a WiFi voucher and pay with Mobile Money." },
    ],
  }),
  component: PackagesPage,
});

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("255") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return "255" + digits.slice(1);
  if (digits.startsWith("7") && digits.length === 9) return "255" + digits;
  if (digits.startsWith("6") && digits.length === 9) return "255" + digits;
  return null;
}

function PackagesPage() {
  const [selected, setSelected] = useState<PackageDef | null>(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const submit = async () => {
    if (!selected) return;
    setError(null);
    const normalized = normalizePhone(phone);
    if (!normalized) {
      setError("Enter a valid Tanzanian phone (e.g. 0712345678).");
      return;
    }
    setLoading(true);
    try {
      const res = await payMongike({ phone: normalized, package_name: selected.id });
      const ref =
        (res.orderReference as string) ||
        (res.reference as string) ||
        (res.order_reference as string) ||
        "";
      if (!ref) throw new Error(res.message || "No order reference returned by server.");
      navigate({ to: "/success", search: { ref } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Choose your package
          </h1>
          <p className="mt-2 text-muted-foreground">
            Vouchers activate instantly after Mobile Money payment.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PACKAGES.map((p) => (
            <PackageCard key={p.id} pkg={p} onBuy={(pkg) => { setSelected(pkg); setPhone(""); setError(null); }} />
          ))}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
          <div className="w-full max-w-md rounded-t-2xl bg-card p-6 shadow-xl sm:rounded-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold">Buy {selected.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {formatTzs(selected.priceTzs)} • {selected.hours}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-md p-1 text-muted-foreground hover:bg-accent"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="mt-5 block text-sm font-medium">Mobile Money phone</label>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-primary">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                inputMode="tel"
                placeholder="0712 345 678"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                autoFocus
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              We'll send the USSD push to this number.
            </p>

            {error && (
              <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              onClick={submit}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Sending payment..." : `Pay ${formatTzs(selected.priceTzs)}`}
            </button>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              You'll receive a Mobile Money prompt to approve the payment.
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
