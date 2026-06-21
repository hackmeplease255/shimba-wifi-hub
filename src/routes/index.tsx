import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  API_URL,
  checkVoucher,
  extractReference,
  formatTzs,
  getPackages,
  getPaymentStatus,
  payMongike,
  type PackageDef,
  type VoucherStatusResponse,
} from "@/lib/api";

// How often frontend polls for voucher status (ms)
const POLL_INTERVAL = 2_000;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SHIMBA WiFi — Nunua au Tumia Vocha" },
      {
        name: "description",
        content:
          "SHIMBA WiFi — nunua vocha kwa M-Pesa, Tigo Pesa, Airtel Money au ingia kwa vocha yako.",
      },
      { name: "theme-color", content: "#0b1220" },
    ],
  }),
  component: PortalPage,
});

type Tab = "buy" | "use";

function PortalPage() {
  const [tab, setTab] = useState<Tab>("buy");
  const [voucherPrefill, setVoucherPrefill] = useState("");

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(34,211,238,0.18),transparent_60%),radial-gradient(1000px_500px_at_110%_10%,rgba(59,130,246,0.18),transparent_60%),linear-gradient(180deg,#070b14_0%,#0b1220_100%)] text-[#eaf2ff]">
      <div className="mx-auto w-full max-w-[520px] px-4 pb-10 pt-5">
        <Header />

        <div className="mb-4 grid grid-cols-2 gap-1.5 rounded-2xl border border-[#1f2a44] bg-[#0e1626] p-1.5">
          <button
            onClick={() => setTab("buy")}
            className={`rounded-xl px-3 py-3.5 text-[15px] font-bold transition-all ${
              tab === "buy"
                ? "bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] text-[#001018] shadow-[0_10px_30px_-12px_rgba(34,211,238,0.35)]"
                : "text-[#8aa0c4] hover:text-white"
            }`}
          >
            Nunua Vocha
          </button>
          <button
            onClick={() => setTab("use")}
            className={`rounded-xl px-3 py-3.5 text-[15px] font-bold transition-all ${
              tab === "use"
                ? "bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] text-[#001018] shadow-[0_10px_30px_-12px_rgba(34,211,238,0.35)]"
                : "text-[#8aa0c4] hover:text-white"
            }`}
          >
            Tumia Vocha
          </button>
        </div>

        {tab === "buy" ? (
          <BuyTab
            onGotVoucher={(code) => {
              setVoucherPrefill(code);
              setTab("use");
            }}
          />
        ) : (
          <UseTab prefill={voucherPrefill} />
        )}

        <Instructions />
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="mb-4 flex items-center gap-3 pt-5">
      <div className="relative grid h-12 w-12 place-items-center rounded-[14px] bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] text-[24px] font-black text-[#001018] shadow-[0_8px_24px_-8px_rgba(34,211,238,0.45)]">
        S
      </div>
      <div className="flex-1">
        <h1 className="m-0 bg-gradient-to-br from-[#22d3ee] to-[#93c5fd] bg-clip-text text-[22px] font-black tracking-[1.5px] text-transparent">
          SHIMBA WIFI
        </h1>
        <span className="mt-0.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          Live
        </span>
      </div>
    </header>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[18px] border border-[#1f2a44] bg-gradient-to-b from-[#111a2e] to-[#0e1626] p-5 shadow-[0_20px_40px_-28px_rgba(0,0,0,0.7)]">
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 mt-3.5 block text-[13px] font-semibold text-[#8aa0c4]">
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#1f2a44] bg-[#0a1426] px-3.5 py-3.5 text-base text-[#eaf2ff] outline-none transition focus:border-[#22d3ee] focus:ring-4 focus:ring-[#22d3ee]/15";

const btnClass =
  "mt-4 w-full cursor-pointer rounded-2xl bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] px-4 py-4 text-base font-extrabold text-[#001018] shadow-[0_10px_30px_-12px_rgba(34,211,238,0.4)] transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60";

function normalizePhone(raw: string) {
  let p = raw.replace(/\D/g, "");
  if (p.startsWith("255")) return p;
  if (p.startsWith("0")) return "255" + p.slice(1);
  if (p.length === 9) return "255" + p;
  return p;
}

function BuyTab({ onGotVoucher }: { onGotVoucher: (code: string) => void }) {
  const [packages, setPackages] = useState<PackageDef[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ kind: "info" | "error" | "success"; text: string } | null>(null);
  const [voucher, setVoucher] = useState<string | null>(null);
  const pollTimer = useRef<number | null>(null);

  useEffect(() => {
    getPackages().then((pkgs) => {
      setPackages(pkgs);
      if (pkgs[0]) setSelected(pkgs[0].id);
    });
    return () => {
      if (pollTimer.current) window.clearInterval(pollTimer.current);
    };
  }, []);

  const pkg = packages.find((p) => p.id === selected);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setVoucher(null);
    if (!pkg) return;
    const np = normalizePhone(phone);
    if (np.length < 12) {
      setMsg({ kind: "error", text: "Tafadhali weka namba sahihi ya simu (mfano 07xxxxxxxx)." });
      return;
    }
    setLoading(true);
    try {
      const r = await payMongike({ phone: np, package_name: pkg.id });
      const ref = extractReference(r);
      if (!ref) throw new Error("Hakuna order reference kutoka kwa server.");
      setMsg({
        kind: "info",
        text: "Ombi la malipo limetumwa. Angalia simu yako na thibitisha PIN. Tunasubiri...",
      });
      // Poll for voucher every POLL_INTERVAL.
      // Voucher is issued by Mongike webhook when payment is confirmed.
      // Frontend waits until voucher code appears in the response.
      pollTimer.current = window.setInterval(async () => {
        try {
          const s = await getPaymentStatus(ref);
          const code = s.voucherCode || s.voucher || s.voucher_code;
          if (code) {
            if (pollTimer.current) window.clearInterval(pollTimer.current);
            setLoading(false);
            setVoucher(String(code));
            setMsg({ kind: "success", text: "Malipo yamekamilika! Vocha yako tayari." });
          } else if (s.status === "failed") {
            if (pollTimer.current) window.clearInterval(pollTimer.current);
            setLoading(false);
            setMsg({ kind: "error", text: s.message || "Malipo yameshindikana." });
          }
        } catch {
          /* keep polling */
        }
      }, POLL_INTERVAL);
    } catch (err: any) {
      setLoading(false);
      setMsg({ kind: "error", text: err?.message || "Kuna tatizo. Jaribu tena." });
    }
  }

  async function copyVoucher() {
    if (!voucher) return;
    try {
      await navigator.clipboard.writeText(voucher);
      setMsg({ kind: "success", text: "Vocha imenakiliwa." });
    } catch {
      /* noop */
    }
  }

  return (
    <Card>
      <h2 className="m-0 text-xl font-bold">Nunua Vocha</h2>
      <p className="mb-4 mt-1 text-sm text-[#8aa0c4]">
        Chagua kifurushi, weka namba ya simu, lipa kwa mtandao wako.
      </p>

      {voucher ? (
        <div className="mt-3 rounded-[18px] border-2 border-[#22d3ee]/40 bg-gradient-to-b from-[#020d1a] to-[#011020] p-5 text-center shadow-[0_0_40px_-10px_rgba(34,211,238,0.2)]">
          <div className="text-4xl">✅</div>
          <div className="mt-1 text-lg font-extrabold text-emerald-300">Malipo Yamekamilika!</div>
          <p className="mb-4 mt-1 text-[13px] text-[#8aa0c4]">Tumia vocha hii kuingia kwenye WiFi.</p>
          <div className="mb-2 text-[11px] uppercase tracking-[2px] text-[#8aa0c4]">Voucher Code</div>
          <button
            onClick={copyVoucher}
            className="w-full rounded-2xl border border-[#22d3ee]/30 bg-[#000d1a] px-4 py-3.5 font-mono text-2xl font-bold tracking-widest text-[#22d3ee]"
          >
            {voucher}
          </button>
          <button
            onClick={() => onGotVoucher(voucher)}
            className={btnClass}
          >
            Tumia Sasa
          </button>
        </div>
      ) : (
        <form onSubmit={handlePay}>
          <Label>Kifurushi</Label>
          <select
            className={inputClass}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            disabled={loading}
          >
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {formatTzs(p.price)}
                {p.duration ? ` (${p.duration})` : ""}
              </option>
            ))}
          </select>

          <Label>Namba ya Simu</Label>
          <input
            className={inputClass}
            type="tel"
            inputMode="tel"
            placeholder="07xxxxxx au 06xxxxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
          />

          <button type="submit" className={btnClass} disabled={loading || !pkg}>
            {loading ? "Inasubiri malipo..." : `Lipa ${pkg ? formatTzs(pkg.price) : ""}`}
          </button>
        </form>
      )}

      {msg && <Message kind={msg.kind}>{msg.text}</Message>}
    </Card>
  );
}

function getConnectUrl(code: string): string {
  return API_URL + "/api/connect?code=" + encodeURIComponent(code.trim());
}

function UseTab({ prefill }: { prefill: string }) {
  const [code, setCode] = useState(prefill);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VoucherStatusResponse | null>(null);
  const [msg, setMsg] = useState<{ kind: "info" | "error" | "success"; text: string } | null>(null);

  useEffect(() => {
    if (prefill) setCode(prefill);
  }, [prefill]);

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setResult(null);
    const c = code.trim();
    if (!c) {
      setMsg({ kind: "error", text: "Weka voucher code." });
      return;
    }
    setLoading(true);
    try {
      const r = await checkVoucher(c);
      setResult(r);
      if (r?.status === "valid" || r?.valid === true || r?.success === true) {
        if (r.voucher?.synced) {
          setMsg({ kind: "success", text: "Vocha ni halali. Bonyeza 'Ingia kwenye WiFi'." });
        } else {
          setMsg({ kind: "info", text: "Vocha imepatikana. Inasubiri kuandaliwa kwenye router..." });
        }
      } else if (r?.status === "used") {
        setMsg({ kind: "info", text: "Vocha hii tayari imetumika. Fungua SIMU yako WiFi na uunganishe tena." });
      } else {
        setMsg({ kind: "error", text: r?.message || "Vocha haijapatikana au imeisha." });
      }
    } catch (err: any) {
      setMsg({ kind: "error", text: err?.message || "Tatizo kuangalia vocha." });
    } finally {
      setLoading(false);
    }
  }

  const isSynced = result?.voucher?.synced === true;
  const isUsed = result?.status === "used";

  return (
    <Card>
      <h2 className="m-0 text-xl font-bold">Tumia Vocha</h2>
      <p className="mb-4 mt-1 text-sm text-[#8aa0c4]">
        Weka voucher code yako uliyopata kupitia SMS au baada ya malipo.
      </p>
      <form onSubmit={handleCheck}>
        <Label>Voucher Code</Label>
        <input
          className={`${inputClass} text-center font-mono tracking-widest`}
          type="text"
          autoCapitalize="characters"
          placeholder=""
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
        />
        <button type="submit" className={btnClass} disabled={loading}>
          {loading ? "Inakagua..." : "Angalia Vocha"}
        </button>
      </form>

      {result && (result.status === "valid" || result.valid === true) && !isUsed && (
        <div className="mt-3 space-y-2">
          {isSynced ? (
            <a
              href={getConnectUrl(code)}
              className="block w-full rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 py-4 text-center text-base font-extrabold text-white shadow-[0_10px_30px_-12px_rgba(16,185,129,0.4)]"
            >
              Ingia kwenye WiFi →
            </a>
          ) : (
            <>
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-3 text-sm text-amber-300">
                ⏳ Vocha inaandaliwa kwenye router... Jaribu tena baada ya sekunde chache
              </div>
              <button
                onClick={handleCheck}
                className="block w-full rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 px-4 py-3 text-center text-sm font-bold text-white shadow"
              >
                Angalia Tena
              </button>
            </>
          )}
        </div>
      )}

      {msg && <Message kind={msg.kind}>{msg.text}</Message>}
    </Card>
  );
}

function Message({
  kind,
  children,
}: {
  kind: "info" | "error" | "success";
  children: React.ReactNode;
}) {
  const styles = {
    info: "border-[#22d3ee]/25 bg-[#22d3ee]/10 text-[#a5f3fc]",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    error: "border-red-500/30 bg-red-500/10 text-red-300",
  }[kind];
  return (
    <div className={`mt-3.5 rounded-xl border px-3.5 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}

function Instructions() {
  return (
    <div className="mt-5 rounded-2xl border border-[#22d3ee]/20 bg-gradient-to-br from-[#22d3ee]/5 to-[#3b82f6]/[0.07] p-5">
      <h3 className="m-0 mb-3 flex items-center gap-2 text-[15px] font-semibold text-[#22d3ee]">
        📶 Jinsi ya Kuunganisha
      </h3>
      <ol className="m-0 list-decimal pl-5 text-[13px] leading-[1.8] text-[#8aa0c4]">
        <li>Unganisha simu yako kwenye <strong className="text-white">SHIMBA WiFi</strong>.</li>
        <li><strong className="text-white">Nunua vocha</strong> hapa juu kwa M-Pesa / Tigo / Airtel.</li>
        <li>Subiri vocha ipatikane (au angalia SMS).</li>
        <li>Bonyeza <strong className="text-white">Tumia Vocha</strong> kisha ingiza code yako.</li>
        <li>Furahia internet ya kasi 🚀</li>
      </ol>
      <div className="mt-3 flex flex-wrap items-center gap-1.5 rounded-xl border border-[#1f2a44] bg-white/[0.03] px-3 py-2.5 text-xs text-[#8aa0c4]">
        Mitandao:
        <span className="rounded-full border border-[#22d3ee]/20 bg-[#22d3ee]/10 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-200">M-Pesa</span>
        <span className="rounded-full border border-[#22d3ee]/20 bg-[#22d3ee]/10 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-200">Tigo Pesa</span>
        <span className="rounded-full border border-[#22d3ee]/20 bg-[#22d3ee]/10 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-200">Airtel Money</span>
        <span className="rounded-full border border-[#22d3ee]/20 bg-[#22d3ee]/10 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-200">Halopesa</span>
      </div>
    </div>
  );
}
