import { createFileRoute, Link } from "@tanstack/react-router";
import { Wifi, Zap, ShieldCheck, Clock, CreditCard, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PackageCard } from "@/components/PackageCard";
import { PACKAGES } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SHIMBA WIFI — Fast, affordable WiFi vouchers" },
      {
        name: "description",
        content:
          "Buy SHIMBA WIFI hotspot vouchers in seconds. Pay with Mobile Money and get instant high-speed internet access in Tanzania.",
      },
      { property: "og:title", content: "SHIMBA WIFI — Fast WiFi vouchers" },
      {
        property: "og:description",
        content:
          "Instant WiFi vouchers paid via Mobile Money. 6h, 24h, 48h and 7-day packages.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden gradient-brand text-white">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_60%,white,transparent_40%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/20">
              <Zap className="h-3 w-3" /> Instant activation
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Fast WiFi.{" "}
              <span className="text-gradient-brand">Anywhere you Shimba.</span>
            </h1>
            <p className="mt-4 max-w-xl text-white/80">
              Buy a hotspot voucher with Mobile Money and get online in seconds.
              Reliable speeds, transparent pricing, no contracts.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/packages"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:opacity-90"
              >
                Buy Voucher <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/voucher"
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/20"
              >
                Check Voucher
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
              {[
                ["10k+", "Active users"],
                ["99.9%", "Uptime"],
                ["24/7", "Support"],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="text-2xl font-bold">{v}</div>
                  <div className="text-white/70">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
                  <Wifi className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm text-white/70">Most popular</p>
                  <p className="text-lg font-semibold">24 Hours — 1,000 TZS</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {PACKAGES.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/10"
                  >
                    <span className="text-sm font-medium">{p.name}</span>
                    <span className="text-sm font-semibold">
                      {p.priceTzs.toLocaleString("en-TZ")} TZS
                    </span>
                  </div>
                ))}
              </div>
              <Link
                to="/packages"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                See all packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Zap, title: "Instant Activation", desc: "Voucher delivered the moment your payment is confirmed." },
            { icon: ShieldCheck, title: "Secure Payments", desc: "Mobile Money payments processed safely via Mongike." },
            { icon: Clock, title: "Flexible Plans", desc: "From 6 hours to 7 days — pick what fits your day." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Packages preview */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Pick a package</h2>
            <p className="mt-1 text-muted-foreground">Fair prices. Instant vouchers.</p>
          </div>
          <Link to="/packages" className="hidden text-sm font-semibold text-primary hover:underline sm:inline">
            View all →
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PACKAGES.map((p) => (
            <PackageCard key={p.id} pkg={p} onBuy={() => (window.location.href = "/packages")} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-secondary p-8 text-center text-secondary-foreground sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" />
            <div>
              <h3 className="text-lg font-bold">Ready to get online?</h3>
              <p className="text-sm text-secondary-foreground/70">Pay with Mobile Money in seconds.</p>
            </div>
          </div>
          <Link
            to="/packages"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Buy Voucher <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
