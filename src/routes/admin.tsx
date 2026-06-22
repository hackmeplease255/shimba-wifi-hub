import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { API_URL, formatTzs } from "@/lib/api";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "SHIMBA WiFi — Admin Panel" },
      { name: "description", content: "Admin panel ya SHIMBA WiFi" },
      { name: "theme-color", content: "#0b1220" },
    ],
  }),
  component: AdminPage,
});

type Page = "login" | "dashboard";

interface Stats {
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  failedOrders: number;
  totalMoney: number;
  weekMoney: number;
}

function AdminPage() {
  const [page, setPage] = useState<Page>("login");
  const [token, setToken] = useState<string>("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Store token in sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) {
      setToken(saved);
      setPage("dashboard");
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginMsg("");
    setLoginLoading(true);
    try {
      const basic = btoa(`${username}:${password}`);
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { Authorization: `Basic ${basic}` },
      });
      const data = await res.json();
      if (data.success && data.token) {
        sessionStorage.setItem("admin_token", data.token);
        setToken(data.token);
        setPage("dashboard");
      } else {
        setLoginMsg(data.message || "Login imeshindikana");
      }
    } catch (err: any) {
      setLoginMsg(err?.message || "Tatizo la mtandao");
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_token");
    setToken("");
    setPage("login");
  }

  if (page === "login") {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-[18px] border border-[#1f2a44] bg-gradient-to-b from-[#111a2e] to-[#0e1626] p-6 shadow-[0_20px_40px_-28px_rgba(0,0,0,0.7)]">
          <div className="text-center mb-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] text-[20px] font-black text-[#001018] shadow-[0_8px_24px_-8px_rgba(34,211,238,0.45)] mb-3">
              S
            </div>
            <h1 className="text-xl font-bold text-[#eaf2ff]">Admin Panel</h1>
            <p className="text-sm text-[#8aa0c4] mt-1">SHIMBA WiFi</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-1 text-[13px] font-semibold text-[#8aa0c4]">Username</label>
              <input
                className="w-full rounded-xl border border-[#1f2a44] bg-[#0a1426] px-3.5 py-3 text-base text-[#eaf2ff] outline-none transition focus:border-[#22d3ee] focus:ring-4 focus:ring-[#22d3ee]/15"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoFocus
              />
            </div>
            <div>
              <label className="block mb-1 text-[13px] font-semibold text-[#8aa0c4]">Password</label>
              <input
                className="w-full rounded-xl border border-[#1f2a44] bg-[#0a1426] px-3.5 py-3 text-base text-[#eaf2ff] outline-none transition focus:border-[#22d3ee] focus:ring-4 focus:ring-[#22d3ee]/15"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading || !username || !password}
              className="w-full rounded-2xl bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] px-4 py-3.5 text-base font-extrabold text-[#001018] shadow-[0_10px_30px_-12px_rgba(34,211,238,0.4)] transition active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loginLoading ? "Inaingia..." : "Ingia"}
            </button>
          </form>

          {loginMsg && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300">
              {loginMsg}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <DashboardPage token={token} onLogout={handleLogout} />
  );
}

function DashboardPage({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [tab, setTab] = useState<"dashboard" | "create" | "orders">("dashboard");
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [msg, setMsg] = useState<{ kind: "success" | "error" | "info"; text: string } | null>(null);

  // Create voucher form
  const [createPhone, setCreatePhone] = useState("");
  const [createPkg, setCreatePkg] = useState("6hours");
  const [createLoading, setCreateLoading] = useState(false);
  const [createResult, setCreateResult] = useState<any>(null);

  async function checkAuth(res: Response) {
    if (res.status === 401) {
      sessionStorage.removeItem("admin_token");
      window.location.reload();
      return false;
    }
    return true;
  }

  async function fetchStats() {
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!(await checkAuth(res))) return;
      const data = await res.json();
      if (data.success) setStats(data);
    } catch { /* ignore */ }
  }

  async function fetchOrders() {
    try {
      const res = await fetch(`${API_URL}/api/admin/orders?limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!(await checkAuth(res))) return;
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
    } catch { /* ignore */ }
  }

  async function handleCreateVoucher(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setCreateResult(null);
    setCreateLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/create-voucher`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: createPhone, package_name: createPkg }),
      });
      const data = await res.json();
      if (data.success) {
        setCreateResult(data);
        setMsg({ kind: "success", text: `Vocha ${data.voucher_code} imetengenezwa!` });
        setCreatePhone("");
        fetchStats();
      } else {
        setMsg({ kind: "error", text: data.message || "Imeshindikana" });
      }
    } catch (err: any) {
      setMsg({ kind: "error", text: err?.message || "Tatizo la mtandao" });
    } finally {
      setCreateLoading(false);
    }
  }

  async function checkAuth(res: Response) {
    if (res.status === 401) {
      sessionStorage.removeItem("admin_token");
      window.location.reload();
      return false;
    }
    return true;
  }

  // Handle 401 on create-voucher too
  async function handleCreateVoucherAuth(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setCreateResult(null);
    setCreateLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/create-voucher`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: createPhone, package_name: createPkg }),
      });
      if (!(await checkAuth(res))) return;
      const data = await res.json();
      if (data.success) {
        setCreateResult(data);
        setMsg({ kind: "success", text: `Vocha ${data.voucher_code} imetengenezwa!` });
        setCreatePhone("");
        fetchStats();
      } else {
        setMsg({ kind: "error", text: data.message || "Imeshindikana" });
      }
    } catch (err: any) {
      setMsg({ kind: "error", text: err?.message || "Tatizo la mtandao" });
    } finally {
      setCreateLoading(false);
    }
  }

  useEffect(() => {
    if (tab === "dashboard") fetchStats();
    if (tab === "orders") fetchOrders();
  }, [tab]);

  const packages = [
    { id: "6hours", name: "Masaa 6", price: 500 },
    { id: "24hours", name: "Masaa 24", price: 1000 },
    { id: "48hours", name: "Masaa 48", price: 2000 },
    { id: "7days", name: "Siku 7", price: 5000 },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-[#eaf2ff]">
      {/* Header */}
      <header className="border-b border-[#1f2a44] bg-[#0e1626] px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-[10px] bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] text-[14px] font-black text-[#001018]">
              S
            </div>
            <div>
              <h1 className="text-base font-bold">SHIMBA Admin</h1>
              <span className="text-[11px] text-[#8aa0c4]">Panel ya usimamizi</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
          >
            Toka
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="mx-auto max-w-5xl px-4 pt-4">
        <div className="mb-4 flex gap-1.5 rounded-2xl border border-[#1f2a44] bg-[#0e1626] p-1.5">
          {(["dashboard", "create", "orders"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-xl px-3 py-2.5 text-[13px] font-bold transition ${
                tab === t
                  ? "bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] text-[#001018] shadow-[0_10px_30px_-12px_rgba(34,211,238,0.35)]"
                  : "text-[#8aa0c4] hover:text-white"
              }`}
            >
              {t === "dashboard" ? "📊 Takwimu" : t === "create" ? "➕ Tengeneza Vocha" : "📋 Orders"}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {tab === "dashboard" && (
          <div className="space-y-4">
            {stats ? (
              <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <StatCard label="Jumla ya Orders" value={stats.totalOrders} color="cyan" />
                  <StatCard label="Zilizolipwa" value={stats.paidOrders} color="emerald" />
                  <StatCard label="Zinazosubiri" value={stats.pendingOrders} color="yellow" />
                  <StatCard label="Zilizoshindikana" value={stats.failedOrders} color="red" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <StatCard label="Jumla ya Pesa" value={formatTzs(stats.totalMoney)} color="cyan" />
                  <StatCard label="Wiki Hii" value={formatTzs(stats.weekMoney)} color="emerald" />
                </div>
                <button
                  onClick={fetchStats}
                  className="rounded-xl border border-[#1f2a44] bg-[#0e1626] px-4 py-2 text-sm text-[#8aa0c4] hover:text-white transition"
                >
                  ♻ Onyesha upya
                </button>
              </>
            ) : (
              <div className="rounded-[18px] border border-[#1f2a44] bg-gradient-to-b from-[#111a2e] to-[#0e1626] p-8 text-center">
                <p className="text-[#8aa0c4]">Inapakia takwimu...</p>
              </div>
            )}
          </div>
        )}

        {/* Create Voucher Tab */}
        {tab === "create" && (
          <div className="rounded-[18px] border border-[#1f2a44] bg-gradient-to-b from-[#111a2e] to-[#0e1626] p-5">
            <h2 className="text-lg font-bold mb-1">Tengeneza Vocha</h2>
            <p className="text-sm text-[#8aa0c4] mb-4">
              Tengeneza vocha kwa mteja bila malipo (admin action).
            </p>

            {createResult ? (
              <div className="rounded-[18px] border-2 border-[#22d3ee]/40 bg-gradient-to-b from-[#020d1a] to-[#011020] p-5 text-center shadow-[0_0_40px_-10px_rgba(34,211,238,0.2)]">
                <div className="text-4xl mb-2">✅</div>
                <div className="text-lg font-extrabold text-emerald-300">Vocha Imetengenezwa!</div>
                <div className="my-3 inline-block rounded-2xl border border-[#22d3ee]/30 bg-[#000d1a] px-6 py-3 font-mono text-2xl font-bold tracking-widest text-[#22d3ee]">
                  {createResult.voucher_code}
                </div>
                <p className="text-sm text-[#8aa0c4] mb-1">Simu: {createResult.phone}</p>
                <p className="text-sm text-[#8aa0c4] mb-1">Kifurushi: {createResult.package}</p>
                <p className="text-sm text-[#8aa0c4]">Kiasi: {formatTzs(createResult.amount)}</p>
                <button
                  onClick={() => { setCreateResult(null); setMsg(null); }}
                  className="mt-4 rounded-xl border border-[#1f2a44] bg-[#0e1626] px-4 py-2.5 text-sm text-[#8aa0c4] hover:text-white transition"
                >
                  Tengeneza Nyingine
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateVoucherAuth} className="space-y-4">
                <div>
                  <label className="block mb-1 text-[13px] font-semibold text-[#8aa0c4]">
                    Namba ya Simu ya Mteja
                  </label>
                  <input
                    className="w-full rounded-xl border border-[#1f2a44] bg-[#0a1426] px-3.5 py-3 text-base text-[#eaf2ff] outline-none transition focus:border-[#22d3ee] focus:ring-4 focus:ring-[#22d3ee]/15"
                    type="tel"
                    value={createPhone}
                    onChange={(e) => setCreatePhone(e.target.value)}
                    placeholder="0655943793"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block mb-1 text-[13px] font-semibold text-[#8aa0c4]">
                    Kifurushi
                  </label>
                  <select
                    className="w-full rounded-xl border border-[#1f2a44] bg-[#0a1426] px-3.5 py-3 text-base text-[#eaf2ff] outline-none transition focus:border-[#22d3ee] focus:ring-4 focus:ring-[#22d3ee]/15"
                    value={createPkg}
                    onChange={(e) => setCreatePkg(e.target.value)}
                  >
                    {packages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {formatTzs(p.price)}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={createLoading || !createPhone}
                  className="w-full rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 py-3.5 text-base font-extrabold text-white shadow-[0_10px_30px_-12px_rgba(16,185,129,0.4)] transition active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {createLoading ? "Inatengeneza..." : "✅ Tengeneza Vocha"}
                </button>
              </form>
            )}

            {msg && !createResult && (
              <div
                className={`mt-4 rounded-xl border px-3.5 py-2.5 text-sm ${
                  msg.kind === "success"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : msg.kind === "error"
                    ? "border-red-500/30 bg-red-500/10 text-red-300"
                    : "border-[#22d3ee]/25 bg-[#22d3ee]/10 text-[#a5f3fc]"
                }`}
              >
                {msg.text}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {tab === "orders" && (
          <div className="rounded-[18px] border border-[#1f2a44] bg-gradient-to-b from-[#111a2e] to-[#0e1626] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Orders za Hivi Karibuni</h2>
              <button
                onClick={fetchOrders}
                className="rounded-xl border border-[#1f2a44] bg-[#0e1626] px-3 py-1.5 text-xs text-[#8aa0c4] hover:text-white transition"
              >
                ♻ Onyesha upya
              </button>
            </div>

            {orders.length === 0 ? (
              <p className="text-center text-[#8aa0c4] py-8">Hakuna orders</p>
            ) : (
              <div className="space-y-2">
                {orders.slice(0, 30).map((o, i) => (
                  <div
                    key={o.id || i}
                    className="rounded-xl border border-[#1f2a44] bg-[#0a1426] px-3.5 py-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-[#22d3ee]">{o.order_reference}</span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          o.status === "SUCCESS"
                            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                            : o.status === "PROCESSING"
                            ? "bg-yellow-500/10 text-yellow-300 border border-yellow-500/30"
                            : "bg-red-500/10 text-red-300 border border-red-500/30"
                        }`}
                      >
                        {o.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-[11px] text-[#8aa0c4]">
                      <span>📱 {o.phone}</span>
                      <span>📦 {o.package_name}</span>
                      <span>💰 {formatTzs(o.amount)}</span>
                      {o.voucher_code && <span>🎫 {o.voucher_code}</span>}
                    </div>
                    <div className="mt-0.5 text-[10px] text-[#5a7094]">
                      {new Date(o.created_at).toLocaleString("sw-TZ")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  const colors: Record<string, { bg: string; border: string; text: string }> = {
    cyan: { bg: "bg-[#22d3ee]/10", border: "border-[#22d3ee]/30", text: "text-[#22d3ee]" },
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-300" },
    yellow: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-300" },
    red: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-300" },
  };
  const c = colors[color] || colors.cyan;

  return (
    <div className={`rounded-[16px] border ${c.border} ${c.bg} p-4`}>
      <div className={`text-2xl font-black ${c.text}`}>{value}</div>
      <div className="text-[12px] text-[#8aa0c4] mt-0.5">{label}</div>
    </div>
  );
}
