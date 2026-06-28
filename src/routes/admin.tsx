import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
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

interface ConnectedUser {
  id: number;
  user: string;
  code: string;
  mac: string;
  ip: string;
  package_name: string;
  login_at: string;
}

function AdminPage() {
  const [page, setPage] = useState<Page>("login");
  const [token, setToken] = useState<string>("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

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
      const text = await res.text();
      let data: any = { message: text };
      try { data = text ? JSON.parse(text) : {}; } catch { /* not JSON */ }
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
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#22d3ee]/5 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#3b82f6]/5 blur-[120px]" />
        
        <div className="w-full max-w-sm rounded-[18px] border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl p-7 shadow-[0_20px_40px_-28px_rgba(0,0,0,0.7)]">
          <div className="text-center mb-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] text-[24px] font-black text-[#001018] shadow-[0_8px_24px_-8px_rgba(34,211,238,0.5)] mb-3">
              S
            </div>
            <h1 className="text-xl font-bold text-[#eaf2ff]">Admin Panel</h1>
            <p className="text-sm text-[#8aa0c4] mt-1">SHIMBA WiFi</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-1 text-[13px] font-semibold text-[#8aa0c4]">Username</label>
              <input className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] backdrop-blur px-3.5 py-3 text-base text-[#eaf2ff] outline-none transition focus:border-[#22d3ee] focus:ring-4 focus:ring-[#22d3ee]/15" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" autoFocus />
            </div>
            <div>
              <label className="block mb-1 text-[13px] font-semibold text-[#8aa0c4]">Password</label>
              <input className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] backdrop-blur px-3.5 py-3 text-base text-[#eaf2ff] outline-none transition focus:border-[#22d3ee] focus:ring-4 focus:ring-[#22d3ee]/15" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loginLoading || !username || !password}
              className="w-full rounded-2xl bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] px-4 py-3.5 text-base font-extrabold text-[#001018] shadow-[0_10px_30px_-12px_rgba(34,211,238,0.4)] transition active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loginLoading ? "Inaingia..." : "Ingia"}
            </button>
          </form>
          {loginMsg && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300">{loginMsg}</div>
          )}
        </div>
      </div>
    );
  }

  return <DashboardPage token={token} onLogout={handleLogout} />;
}

type Tab = "dashboard" | "create" | "connected" | "orders" | "vouchers" | "settings";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "dashboard", label: "Takwimu", icon: "📊" },
  { id: "connected", label: "Mtandao", icon: "📶" },
  { id: "create", label: "Vocha", icon: "➕" },
  { id: "orders", label: "Orders", icon: "📋" },
  { id: "vouchers", label: "Orodha", icon: "🎫" },
  { id: "settings", label: "Mipangilio", icon: "⚙️" },
];

function DashboardPage({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [connected, setConnected] = useState<ConnectedUser[]>([]);
  const [totalUnique, setTotalUnique] = useState(0);
  const [msg, setMsg] = useState<{ kind: "success" | "error" | "info"; text: string } | null>(null);
  const [createPhone, setCreatePhone] = useState("");
  const [createPkg, setCreatePkg] = useState("6hours");
  const [createLoading, setCreateLoading] = useState(false);
  const [createResult, setCreateResult] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [connectedLoading, setConnectedLoading] = useState(false);
  const [vouchersLoading, setVouchersLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const [clearConfirm, setClearConfirm] = useState("");

  const packages = [
    { id: "6hours", name: "Masaa 6", price: 500 },
    { id: "24hours", name: "Masaa 24", price: 1000 },
    { id: "48hours", name: "Masaa 48", price: 2000 },
    { id: "7days", name: "Siku 7", price: 5000 },
  ];

  async function handleUnauthorized() {
    sessionStorage.removeItem("admin_token");
    window.location.reload();
  }

  async function fetchStats() {
    setStatsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) return handleUnauthorized();
      const data = await res.json();
      if (data.success) setStats(data);
    } catch { /* ignore */ }
    finally { setStatsLoading(false); }
  }

  async function fetchOrders() {
    setOrdersLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/orders?limit=30`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) return handleUnauthorized();
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
    } catch { /* ignore */ }
    finally { setOrdersLoading(false); }
  }

  async function fetchConnected() {
    setConnectedLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/connected-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) return handleUnauthorized();
      const data = await res.json();
      if (data.success) {
        setConnected(data.users || []);
        setTotalUnique(data.totalUnique || 0);
      }
    } catch { /* ignore */ }
    finally { setConnectedLoading(false); }
  }

  async function fetchVouchers() {
    setVouchersLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/vouchers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) return handleUnauthorized();
      const data = await res.json();
      if (data.success) setVouchers(data.vouchers || []);
    } catch { /* ignore */ }
    finally { setVouchersLoading(false); }
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
      if (res.status === 401) return handleUnauthorized();
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

  async function handleClearData() {
    if (clearConfirm !== "RESET_ALL_DATA") return;
    setClearLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/clear-data`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ confirm: "RESET_ALL_DATA" }),
      });
      if (res.status === 401) return handleUnauthorized();
      const data = await res.json();
      if (data.success) {
        setMsg({ kind: "success", text: data.message });
        setClearConfirm("");
        setStats(null);
        setOrders([]);
        setVouchers([]);
        setConnected([]);
      } else {
        setMsg({ kind: "error", text: data.message || "Imeshindikana" });
      }
    } catch (err: any) {
      setMsg({ kind: "error", text: err?.message || "Tatizo la mtandao" });
    } finally {
      setClearLoading(false);
    }
  }

  const fetchByTab = useCallback(async (t: Tab) => {
    if (t === "dashboard") fetchStats();
    else if (t === "connected") fetchConnected();
    else if (t === "orders") fetchOrders();
    else if (t === "vouchers") fetchVouchers();
  }, [token]);

  useEffect(() => { fetchByTab(tab); }, [tab]);

  // Auto-refresh connected users every 15 seconds
  useEffect(() => {
    if (tab !== "connected") return;
    const interval = setInterval(fetchConnected, 15_000);
    return () => clearInterval(interval);
  }, [tab, token]);

  function selectTab(t: Tab) {
    setTab(t);
    setSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-[#eaf2ff]">
      {/* Mobile header with hamburger */}
      <header className="lg:hidden flex items-center justify-between border-b border-white/[0.06] bg-white/[0.03] backdrop-blur-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-xl text-[#8aa0c4] hover:text-white">
            {sidebarOpen ? "✕" : "☰"}
          </button>
          <div className="grid h-8 w-8 place-items-center rounded-[8px] bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] text-[12px] font-black text-[#001018]">
            S
          </div>
          <span className="text-sm font-bold">SHIMBA Admin</span>
        </div>
        <button onClick={onLogout} className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300">
          Toka
        </button>
      </header>

      <div className="flex">
        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 z-30 h-screen w-64 shrink-0
          border-r border-white/[0.06] bg-[#0a0f1e] backdrop-blur-2xl
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          {/* Sidebar header */}
          <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4">
            <div className="grid h-10 w-10 place-items-center rounded-[10px] bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] text-[18px] font-black text-[#001018]">
              S
            </div>
            <div>
              <h1 className="text-base font-bold">SHIMBA Admin</h1>
              <span className="text-[11px] text-[#5a7094]">Panel ya usimamizi</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => selectTab(t.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  tab === t.id
                    ? "bg-gradient-to-br from-[#22d3ee]/20 to-[#3b82f6]/20 text-[#22d3ee] border border-[#22d3ee]/20"
                    : "text-[#8aa0c4] hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <span className="text-lg w-6 text-center">{t.icon}</span>
                <span>{t.label}</span>
                {tab === t.id && <span className="ml-auto w-1.5 h-5 rounded-full bg-[#22d3ee]" />}
              </button>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-white/[0.06] p-4">
            <button
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition"
            >
              <span>🚪</span>
              <span>Toka</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen px-4 py-5 lg:px-6 lg:py-6 max-w-5xl">
          {/* Tab Content */}
          {tab === "dashboard" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span>📊</span> Takwimu
              </h2>
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
                  <button onClick={fetchStats} disabled={statsLoading}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-sm text-[#8aa0c4] hover:text-white transition disabled:opacity-50"
                  >
                    {statsLoading ? "Inapakia..." : "♻ Onyesha upya"}
                  </button>
                </>
              ) : (
                <GlassCard>
                  <p className="text-center text-[#8aa0c4] py-8">{statsLoading ? "Inapakia takwimu..." : "Bonyeza 'Onyesha upya' kuona takwimu"}</p>
                </GlassCard>
              )}
            </div>
          )}

          {tab === "connected" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>📶</span> Waliounganishwa
                </h2>
                <div className="flex items-center gap-2">
                  <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-300">
                    {totalUnique} devices
                  </div>
                  <button onClick={fetchConnected} disabled={connectedLoading}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs text-[#8aa0c4] hover:text-white disabled:opacity-50"
                  >
                    {connectedLoading ? "..." : "♻"}
                  </button>
                </div>
              </div>

              {connected.length === 0 ? (
                <GlassCard>
                  <p className="text-center text-[#8aa0c4] py-8">{connectedLoading ? "Inapakia..." : "Hakuna mtumiaji aliyeunganishwa sasa"}</p>
                </GlassCard>
              ) : (
                <div className="space-y-3">
                  {connected.map((u, i) => (
                    <div key={u.id || i} className="rounded-[16px] border border-white/[0.06] bg-white/[0.02] p-4">
                      {/* Header: voucher code + package */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="font-mono text-base font-bold text-[#22d3ee]">{u.code}</span>
                        </div>
                        <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-semibold text-[#8aa0c4]">
                          📦 {u.package_name}
                        </span>
                      </div>

                      {/* Key-value grid: IP + MAC prominently displayed */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2">
                          <div className="text-[10px] uppercase tracking-wider text-[#5a7094] mb-0.5">🌐 IP Address</div>
                          <div className="font-mono text-sm font-semibold text-[#eaf2ff]">{u.ip}</div>
                        </div>
                        <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2">
                          <div className="text-[10px] uppercase tracking-wider text-[#5a7094] mb-0.5">📶 MAC Address (Binded)</div>
                          <div className="font-mono text-sm font-semibold text-[#22d3ee]">{u.mac}</div>
                        </div>
                      </div>

                      {/* Login time */}
                      <div className="mt-2 text-[11px] text-[#5a7094] text-right">
                        🕐 {new Date(u.login_at).toLocaleString("sw-TZ")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "create" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span>➕</span> Tengeneza Vocha
              </h2>
              <GlassCard>
                <p className="text-sm text-[#8aa0c4] mb-4">Tengeneza vocha kwa mteja bila malipo (admin action).</p>

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
                    <button onClick={() => { setCreateResult(null); setMsg(null); }}
                      className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-[#8aa0c4] hover:text-white transition"
                    >
                      Tengeneza Nyingine
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCreateVoucher} className="space-y-4">
                    <div>
                      <label className="block mb-1 text-[13px] font-semibold text-[#8aa0c4]">Namba ya Simu (si lazima)</label>
                      <input className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-3 text-base text-[#eaf2ff] outline-none transition focus:border-[#22d3ee] focus:ring-4 focus:ring-[#22d3ee]/15" type="tel" value={createPhone} onChange={(e) => setCreatePhone(e.target.value)} placeholder="Acha tupu ukitengeneza vocha kwa cash" />
                    </div>
                    <div>
                      <label className="block mb-1 text-[13px] font-semibold text-[#8aa0c4]">Kifurushi</label>
                      <select className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-3 text-base text-[#eaf2ff] outline-none transition focus:border-[#22d3ee] focus:ring-4 focus:ring-[#22d3ee]/15" value={createPkg} onChange={(e) => setCreatePkg(e.target.value)}>
                        {packages.map((p) => (
                          <option key={p.id} value={p.id}>{p.name} — {formatTzs(p.price)}</option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" disabled={createLoading}
                      className="w-full rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 py-3.5 text-base font-extrabold text-white shadow-[0_10px_30px_-12px_rgba(16,185,129,0.4)] transition active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {createLoading ? "Inatengeneza..." : "✅ Tengeneza Vocha"}
                    </button>
                  </form>
                )}

                {msg && !createResult && <MessageBox msg={msg} />}
              </GlassCard>
            </div>
          )}

          {tab === "orders" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>📋</span> Orders za Hivi Karibuni
                </h2>
                <button onClick={fetchOrders} disabled={ordersLoading}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs text-[#8aa0c4] hover:text-white disabled:opacity-50"
                >
                  {ordersLoading ? "Inapakia..." : "♻"}
                </button>
              </div>
              {orders.length === 0 ? (
                <GlassCard>
                  <p className="text-center text-[#8aa0c4] py-8">{ordersLoading ? "Inapakia..." : "Hakuna orders"}</p>
                </GlassCard>
              ) : (
                <div className="space-y-2">
                  {orders.slice(0, 50).map((o, i) => (
                    <div key={o.id || i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-[#22d3ee]">{o.order_reference}</span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          o.status === "SUCCESS" ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30" :
                          o.status === "PROCESSING" ? "bg-yellow-500/10 text-yellow-300 border border-yellow-500/30" :
                          "bg-red-500/10 text-red-300 border border-red-500/30"
                        }`}>
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

          {tab === "vouchers" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>🎫</span> Vocha Zote
                </h2>
                <button onClick={fetchVouchers} disabled={vouchersLoading}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs text-[#8aa0c4] hover:text-white disabled:opacity-50"
                >
                  {vouchersLoading ? "Inapakia..." : "♻"}
                </button>
              </div>
              {vouchers.length === 0 ? (
                <GlassCard>
                  <p className="text-center text-[#8aa0c4] py-8">{vouchersLoading ? "Inapakia..." : "Hakuna vocha"}</p>
                </GlassCard>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {vouchers.map((v: any, i: number) => (
                    <div key={v.id || i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-[#22d3ee]">{v.code}</span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          v.status === "active" ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30" :
                          v.status === "issued" ? "bg-yellow-500/10 text-yellow-300 border border-yellow-500/30" :
                          v.status === "used" || v.status === "expired" ? "bg-red-500/10 text-red-300 border border-red-500/30" :
                          "bg-gray-500/10 text-gray-300 border border-gray-500/30"
                        }`}>
                          {v.status}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-[#8aa0c4]">
                        <span>📦 {v.package_name}</span>
                        {v.phone && <span>📱 {v.phone}</span>}
                        <span>💰 {formatTzs(v.amount)}</span>
                        {v.order_reference && <span className="font-mono text-[10px] opacity-70">🆔 {v.order_reference}</span>}
                      </div>
                      <div className="mt-0.5 text-[10px] text-[#5a7094]">
                        {new Date(v.created_at).toLocaleString("sw-TZ")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "settings" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span>⚙️</span> Mipangilio
              </h2>

              {/* Clear Data */}
              <GlassCard>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">🗑️</div>
                  <div>
                    <h3 className="text-lg font-bold text-red-300">Futa Data Zote</h3>
                    <p className="text-sm text-[#8aa0c4]">Hii itafuta orders zote, vocha, na wateja waliounganishwa. Haitendui tena!</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <input
                    className="w-full rounded-xl border border-red-500/30 bg-red-500/5 px-3.5 py-3 text-base text-[#eaf2ff] outline-none transition focus:border-red-500 placeholder:text-red-800"
                    type="text"
                    value={clearConfirm}
                    onChange={(e) => setClearConfirm(e.target.value)}
                    placeholder="Andika RESET_ALL_DATA kuthibitisha"
                  />
                  <button
                    onClick={handleClearData}
                    disabled={clearConfirm !== "RESET_ALL_DATA" || clearLoading}
                    className="w-full rounded-2xl bg-gradient-to-br from-red-600 to-red-700 px-4 py-3.5 text-base font-extrabold text-white shadow-[0_10px_30px_-12px_rgba(239,68,68,0.4)] transition active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {clearLoading ? "Inafuta..." : "🗑️ Futa Data Zote"}
                  </button>
                </div>
              </GlassCard>

              {/* System Info */}
              <GlassCard>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">ℹ️</div>
                  <div>
                    <h3 className="text-lg font-bold">Taarifa za Mfumo</h3>
                    <p className="text-sm text-[#8aa0c4]">System info na hali ya backend</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-[#8aa0c4]">
                  <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                    <span>Backend URL</span>
                    <span className="font-mono text-[#22d3ee] text-xs">{API_URL}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                    <span>Wateja Walio Connected</span>
                    <span className="font-bold text-emerald-300">{connected.length} sasa</span>
                  </div>
                </div>
                <button
                  onClick={() => fetchConnected()}
                  className="mt-3 rounded-xl border border-[#22d3ee]/30 bg-[#22d3ee]/5 px-4 py-2 text-sm font-semibold text-[#22d3ee] hover:bg-[#22d3ee]/10 transition"
                >
                  🔄 Angalia Connected Users
                </button>
              </GlassCard>
            </div>
          )}

          {msg && tab !== "create" && <MessageBox msg={msg} />}
        </main>
      </div>
    </div>
  );
}

/* ── Reusable Components ── */

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[18px] border border-white/[0.06] bg-white/[0.03] p-5 shadow-[0_20px_40px_-28px_rgba(0,0,0,0.7)]">
      {children}
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

function MessageBox({ msg }: { msg: { kind: "success" | "error" | "info"; text: string } }) {
  const styles = {
    info: "border-[#22d3ee]/25 bg-[#22d3ee]/10 text-[#a5f3fc]",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    error: "border-red-500/30 bg-red-500/10 text-red-300",
  }[msg.kind];
  return (
    <div className={`mt-3.5 rounded-xl border px-3.5 py-3 text-sm ${styles}`}>
      {msg.text}
    </div>
  );
}
