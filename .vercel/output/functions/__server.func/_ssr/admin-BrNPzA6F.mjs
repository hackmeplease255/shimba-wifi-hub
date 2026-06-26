import { r as __toESM } from "../_runtime.mjs";
import { i as formatTzs, t as API_URL } from "./api-DDmwNao-.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BrNPzA6F.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const [page, setPage] = (0, import_react.useState)("login");
	const [token, setToken] = (0, import_react.useState)("");
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [loginMsg, setLoginMsg] = (0, import_react.useState)("");
	const [loginLoading, setLoginLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const saved = sessionStorage.getItem("admin_token");
		if (saved) {
			setToken(saved);
			setPage("dashboard");
		}
	}, []);
	async function handleLogin(e) {
		e.preventDefault();
		setLoginMsg("");
		setLoginLoading(true);
		try {
			const basic = btoa(`${username}:${password}`);
			const data = await (await fetch(`${API_URL}/api/admin/login`, {
				method: "POST",
				headers: { Authorization: `Basic ${basic}` }
			})).json();
			if (data.success && data.token) {
				sessionStorage.setItem("admin_token", data.token);
				setToken(data.token);
				setPage("dashboard");
			} else setLoginMsg(data.message || "Login imeshindikana");
		} catch (err) {
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
	if (page === "login") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-[#070b14] flex items-center justify-center p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-[18px] border border-[#1f2a44] bg-gradient-to-b from-[#111a2e] to-[#0e1626] p-6 shadow-[0_20px_40px_-28px_rgba(0,0,0,0.7)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center mb-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] text-[20px] font-black text-[#001018] shadow-[0_8px_24px_-8px_rgba(34,211,238,0.45)] mb-3",
							children: "S"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-xl font-bold text-[#eaf2ff]",
							children: "Admin Panel"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-[#8aa0c4] mt-1",
							children: "SHIMBA WiFi"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleLogin,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-1 text-[13px] font-semibold text-[#8aa0c4]",
							children: "Username"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "w-full rounded-xl border border-[#1f2a44] bg-[#0a1426] px-3.5 py-3 text-base text-[#eaf2ff] outline-none transition focus:border-[#22d3ee] focus:ring-4 focus:ring-[#22d3ee]/15",
							type: "text",
							value: username,
							onChange: (e) => setUsername(e.target.value),
							placeholder: "admin",
							autoFocus: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-1 text-[13px] font-semibold text-[#8aa0c4]",
							children: "Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "w-full rounded-xl border border-[#1f2a44] bg-[#0a1426] px-3.5 py-3 text-base text-[#eaf2ff] outline-none transition focus:border-[#22d3ee] focus:ring-4 focus:ring-[#22d3ee]/15",
							type: "password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							placeholder: "••••••••"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: loginLoading || !username || !password,
							className: "w-full rounded-2xl bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] px-4 py-3.5 text-base font-extrabold text-[#001018] shadow-[0_10px_30px_-12px_rgba(34,211,238,0.4)] transition active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed",
							children: loginLoading ? "Inaingia..." : "Ingia"
						})
					]
				}),
				loginMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300",
					children: loginMsg
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardPage, {
		token,
		onLogout: handleLogout
	});
}
function DashboardPage({ token, onLogout }) {
	const [tab, setTab] = (0, import_react.useState)("dashboard");
	const [stats, setStats] = (0, import_react.useState)(null);
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [msg, setMsg] = (0, import_react.useState)(null);
	const [createPhone, setCreatePhone] = (0, import_react.useState)("");
	const [createPkg, setCreatePkg] = (0, import_react.useState)("6hours");
	const [createLoading, setCreateLoading] = (0, import_react.useState)(false);
	const [createResult, setCreateResult] = (0, import_react.useState)(null);
	const [statsLoading, setStatsLoading] = (0, import_react.useState)(false);
	const [ordersLoading, setOrdersLoading] = (0, import_react.useState)(false);
	const packages = [
		{
			id: "6hours",
			name: "Masaa 6",
			price: 500
		},
		{
			id: "24hours",
			name: "Masaa 24",
			price: 1e3
		},
		{
			id: "48hours",
			name: "Masaa 48",
			price: 2e3
		},
		{
			id: "7days",
			name: "Siku 7",
			price: 5e3
		}
	];
	async function handleUnauthorized() {
		sessionStorage.removeItem("admin_token");
		window.location.reload();
	}
	async function fetchStats() {
		setStatsLoading(true);
		try {
			const res = await fetch(`${API_URL}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } });
			if (res.status === 401) return handleUnauthorized();
			const data = await res.json();
			if (data.success) setStats(data);
		} catch {} finally {
			setStatsLoading(false);
		}
	}
	async function fetchOrders() {
		setOrdersLoading(true);
		try {
			const res = await fetch(`${API_URL}/api/admin/orders?limit=20`, { headers: { Authorization: `Bearer ${token}` } });
			if (res.status === 401) return handleUnauthorized();
			const data = await res.json();
			if (data.success) setOrders(data.orders || []);
		} catch {} finally {
			setOrdersLoading(false);
		}
	}
	async function handleCreateVoucher(e) {
		e.preventDefault();
		setMsg(null);
		setCreateResult(null);
		setCreateLoading(true);
		try {
			const res = await fetch(`${API_URL}/api/admin/create-voucher`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					phone: createPhone,
					package_name: createPkg
				})
			});
			if (res.status === 401) return handleUnauthorized();
			const data = await res.json();
			if (data.success) {
				setCreateResult(data);
				setMsg({
					kind: "success",
					text: `Vocha ${data.voucher_code} imetengenezwa!`
				});
				setCreatePhone("");
				fetchStats();
			} else setMsg({
				kind: "error",
				text: data.message || "Imeshindikana"
			});
		} catch (err) {
			setMsg({
				kind: "error",
				text: err?.message || "Tatizo la mtandao"
			});
		} finally {
			setCreateLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		if (tab === "dashboard") fetchStats();
		if (tab === "orders") fetchOrders();
	}, [tab]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#070b14] text-[#eaf2ff]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-[#1f2a44] bg-[#0e1626] px-4 py-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-5xl items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-9 w-9 place-items-center rounded-[10px] bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] text-[14px] font-black text-[#001018]",
						children: "S"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-base font-bold",
						children: "SHIMBA Admin"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-[#8aa0c4]",
						children: "Panel ya usimamizi"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onLogout,
					className: "rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20",
					children: "Toka"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl px-4 pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 flex gap-1.5 rounded-2xl border border-[#1f2a44] bg-[#0e1626] p-1.5",
					children: [
						"dashboard",
						"create",
						"orders"
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setTab(t),
						className: `flex-1 rounded-xl px-3 py-2.5 text-[13px] font-bold transition ${tab === t ? "bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] text-[#001018] shadow-[0_10px_30px_-12px_rgba(34,211,238,0.35)]" : "text-[#8aa0c4] hover:text-white"}`,
						children: t === "dashboard" ? "📊 Takwimu" : t === "create" ? "➕ Tengeneza Vocha" : "📋 Orders"
					}, t))
				}),
				tab === "dashboard" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: stats ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Jumla ya Orders",
									value: stats.totalOrders,
									color: "cyan"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Zilizolipwa",
									value: stats.paidOrders,
									color: "emerald"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Zinazosubiri",
									value: stats.pendingOrders,
									color: "yellow"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Zilizoshindikana",
									value: stats.failedOrders,
									color: "red"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Jumla ya Pesa",
								value: formatTzs(stats.totalMoney),
								color: "cyan"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Wiki Hii",
								value: formatTzs(stats.weekMoney),
								color: "emerald"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: fetchStats,
							disabled: statsLoading,
							className: "rounded-xl border border-[#1f2a44] bg-[#0e1626] px-4 py-2 text-sm text-[#8aa0c4] hover:text-white transition disabled:opacity-50",
							children: statsLoading ? "Inapakia..." : "♻ Onyesha upya"
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-[18px] border border-[#1f2a44] bg-gradient-to-b from-[#111a2e] to-[#0e1626] p-8 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[#8aa0c4]",
							children: statsLoading ? "Inapakia takwimu..." : "Bonyeza 'Onyesha upya' kuona takwimu"
						})
					})
				}),
				tab === "create" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[18px] border border-[#1f2a44] bg-gradient-to-b from-[#111a2e] to-[#0e1626] p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-bold mb-1",
							children: "Tengeneza Vocha"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-[#8aa0c4] mb-4",
							children: "Tengeneza vocha kwa mteja bila malipo (admin action)."
						}),
						createResult ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[18px] border-2 border-[#22d3ee]/40 bg-gradient-to-b from-[#020d1a] to-[#011020] p-5 text-center shadow-[0_0_40px_-10px_rgba(34,211,238,0.2)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-4xl mb-2",
									children: "✅"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-lg font-extrabold text-emerald-300",
									children: "Vocha Imetengenezwa!"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "my-3 inline-block rounded-2xl border border-[#22d3ee]/30 bg-[#000d1a] px-6 py-3 font-mono text-2xl font-bold tracking-widest text-[#22d3ee]",
									children: createResult.voucher_code
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-[#8aa0c4] mb-1",
									children: ["Simu: ", createResult.phone]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-[#8aa0c4] mb-1",
									children: ["Kifurushi: ", createResult.package]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-[#8aa0c4]",
									children: ["Kiasi: ", formatTzs(createResult.amount)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										setCreateResult(null);
										setMsg(null);
									},
									className: "mt-4 rounded-xl border border-[#1f2a44] bg-[#0e1626] px-4 py-2.5 text-sm text-[#8aa0c4] hover:text-white transition",
									children: "Tengeneza Nyingine"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleCreateVoucher,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block mb-1 text-[13px] font-semibold text-[#8aa0c4]",
									children: "Namba ya Simu (si lazima)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "w-full rounded-xl border border-[#1f2a44] bg-[#0a1426] px-3.5 py-3 text-base text-[#eaf2ff] outline-none transition focus:border-[#22d3ee] focus:ring-4 focus:ring-[#22d3ee]/15",
									type: "tel",
									value: createPhone,
									onChange: (e) => setCreatePhone(e.target.value),
									placeholder: "Acha tupu ukitengeneza vocha kwa cash"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block mb-1 text-[13px] font-semibold text-[#8aa0c4]",
									children: "Kifurushi"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "w-full rounded-xl border border-[#1f2a44] bg-[#0a1426] px-3.5 py-3 text-base text-[#eaf2ff] outline-none transition focus:border-[#22d3ee] focus:ring-4 focus:ring-[#22d3ee]/15",
									value: createPkg,
									onChange: (e) => setCreatePkg(e.target.value),
									children: packages.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: p.id,
										children: [
											p.name,
											" — ",
											formatTzs(p.price)
										]
									}, p.id))
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: createLoading,
									className: "w-full rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 py-3.5 text-base font-extrabold text-white shadow-[0_10px_30px_-12px_rgba(16,185,129,0.4)] transition active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed",
									children: createLoading ? "Inatengeneza..." : "✅ Tengeneza Vocha"
								})
							]
						}),
						msg && !createResult && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `mt-4 rounded-xl border px-3.5 py-2.5 text-sm ${msg.kind === "success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : msg.kind === "error" ? "border-red-500/30 bg-red-500/10 text-red-300" : "border-[#22d3ee]/25 bg-[#22d3ee]/10 text-[#a5f3fc]"}`,
							children: msg.text
						})
					]
				}),
				tab === "orders" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[18px] border border-[#1f2a44] bg-gradient-to-b from-[#111a2e] to-[#0e1626] p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-bold",
							children: "Orders za Hivi Karibuni"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: fetchOrders,
							disabled: ordersLoading,
							className: "rounded-xl border border-[#1f2a44] bg-[#0e1626] px-3 py-1.5 text-xs text-[#8aa0c4] hover:text-white transition disabled:opacity-50",
							children: ordersLoading ? "Inapakia..." : "♻ Onyesha upya"
						})]
					}), orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-[#8aa0c4] py-8",
						children: ordersLoading ? "Inapakia..." : "Hakuna orders"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: orders.slice(0, 30).map((o, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-[#1f2a44] bg-[#0a1426] px-3.5 py-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs text-[#22d3ee]",
										children: o.order_reference
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-[11px] font-semibold px-2 py-0.5 rounded-full ${o.status === "SUCCESS" ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30" : o.status === "PROCESSING" ? "bg-yellow-500/10 text-yellow-300 border border-yellow-500/30" : "bg-red-500/10 text-red-300 border border-red-500/30"}`,
										children: o.status
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex items-center gap-3 text-[11px] text-[#8aa0c4]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["📱 ", o.phone] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["📦 ", o.package_name] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["💰 ", formatTzs(o.amount)] }),
										o.voucher_code && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["🎫 ", o.voucher_code] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 text-[10px] text-[#5a7094]",
									children: new Date(o.created_at).toLocaleString("sw-TZ")
								})
							]
						}, o.id || i))
					})]
				})
			]
		})]
	});
}
function StatCard({ label, value, color }) {
	const colors = {
		cyan: {
			bg: "bg-[#22d3ee]/10",
			border: "border-[#22d3ee]/30",
			text: "text-[#22d3ee]"
		},
		emerald: {
			bg: "bg-emerald-500/10",
			border: "border-emerald-500/30",
			text: "text-emerald-300"
		},
		yellow: {
			bg: "bg-yellow-500/10",
			border: "border-yellow-500/30",
			text: "text-yellow-300"
		},
		red: {
			bg: "bg-red-500/10",
			border: "border-red-500/30",
			text: "text-red-300"
		}
	};
	const c = colors[color] || colors.cyan;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-[16px] border ${c.border} ${c.bg} p-4`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `text-2xl font-black ${c.text}`,
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[12px] text-[#8aa0c4] mt-0.5",
			children: label
		})]
	});
}
//#endregion
export { AdminPage as component };
