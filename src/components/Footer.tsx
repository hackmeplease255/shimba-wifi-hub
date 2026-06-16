import { Wifi } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Wifi className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold">SHIMBA WIFI</span>
          </div>
          <p className="mt-3 text-sm text-secondary-foreground/70">
            Fast, affordable WiFi vouchers. Pay with Mobile Money, get online in seconds.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm text-secondary-foreground/70">
            <li>Home</li>
            <li>Packages</li>
            <li>Check Voucher</li>
            <li>Support</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-secondary-foreground/70">
            <li>support@shimba-wifi.co.tz</li>
            <li>+255 7XX XXX XXX</li>
            <li>Tanzania</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-secondary-foreground/60">
        © {new Date().getFullYear()} SHIMBA WIFI. All rights reserved.
      </div>
    </footer>
  );
}
