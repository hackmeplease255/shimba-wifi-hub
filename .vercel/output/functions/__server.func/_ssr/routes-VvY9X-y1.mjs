import { r as __toESM } from "../_runtime.mjs";
import { a as getPackages, i as formatTzs, n as checkVoucher, o as getPaymentStatus, r as extractReference, s as payMongike, t as API_URL } from "./api-B9EKBMtk.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-VvY9X-y1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var POLL_INTERVAL = 2e3;
var PAYMENT_TIMEOUT_MS = 6e4;
function PortalPage() {
	const [tab, setTab] = (0, import_react.useState)("buy");
	const [voucherPrefill, setVoucherPrefill] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(34,211,238,0.18),transparent_60%),radial-gradient(1000px_500px_at_110%_10%,rgba(59,130,246,0.18),transparent_60%),linear-gradient(180deg,#070b14_0%,#0b1220_100%)] text-[#eaf2ff]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-[520px] px-4 pb-10 pt-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 grid grid-cols-2 gap-1.5 rounded-2xl border border-[#1f2a44] bg-[#0e1626] p-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setTab("buy"),
						className: `rounded-xl px-3 py-3.5 text-[15px] font-bold transition-all ${tab === "buy" ? "bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] text-[#001018] shadow-[0_10px_30px_-12px_rgba(34,211,238,0.35)]" : "text-[#8aa0c4] hover:text-white"}`,
						children: "Nunua Vocha"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setTab("use"),
						className: `rounded-xl px-3 py-3.5 text-[15px] font-bold transition-all ${tab === "use" ? "bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] text-[#001018] shadow-[0_10px_30px_-12px_rgba(34,211,238,0.35)]" : "text-[#8aa0c4] hover:text-white"}`,
						children: "Tumia Vocha"
					})]
				}),
				tab === "buy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuyTab, { onGotVoucher: (code) => {
					setVoucherPrefill(code);
					setTab("use");
				} }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UseTab, { prefill: voucherPrefill }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instructions, {})
			]
		})
	});
}
function Header() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-4 flex items-center gap-3 pt-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative grid h-12 w-12 place-items-center rounded-[14px] bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] text-[24px] font-black text-[#001018] shadow-[0_8px_24px_-8px_rgba(34,211,238,0.45)]",
			children: "S"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "m-0 bg-gradient-to-br from-[#22d3ee] to-[#93c5fd] bg-clip-text text-[22px] font-black tracking-[1.5px] text-transparent",
				children: "SHIMBA WIFI"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "mt-0.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-300",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" }), "Live"]
			})]
		})]
	});
}
function Card({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-[18px] border border-[#1f2a44] bg-gradient-to-b from-[#111a2e] to-[#0e1626] p-5 shadow-[0_20px_40px_-28px_rgba(0,0,0,0.7)]",
		children
	});
}
function Label({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "mb-1.5 mt-3.5 block text-[13px] font-semibold text-[#8aa0c4]",
		children
	});
}
var inputClass = "w-full rounded-xl border border-[#1f2a44] bg-[#0a1426] px-3.5 py-3.5 text-base text-[#eaf2ff] outline-none transition focus:border-[#22d3ee] focus:ring-4 focus:ring-[#22d3ee]/15";
var btnClass = "mt-4 w-full cursor-pointer rounded-2xl bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] px-4 py-4 text-base font-extrabold text-[#001018] shadow-[0_10px_30px_-12px_rgba(34,211,238,0.4)] transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60";
function normalizePhone(raw) {
	let p = raw.replace(/\D/g, "");
	if (p.startsWith("255")) return p;
	if (p.startsWith("0")) return "255" + p.slice(1);
	if (p.length === 9) return "255" + p;
	return p;
}
function BuyTab({ onGotVoucher }) {
	const [packages, setPackages] = (0, import_react.useState)([]);
	const [selected, setSelected] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)(null);
	const [voucher, setVoucher] = (0, import_react.useState)(null);
	const pollTimer = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		getPackages().then((pkgs) => {
			setPackages(pkgs);
			if (pkgs[0]) setSelected(pkgs[0].id);
		});
		return () => {
			if (pollTimer.current) window.clearInterval(pollTimer.current);
		};
	}, []);
	const pkg = packages.find((p) => p.id === selected);
	async function handlePay(e) {
		e.preventDefault();
		setMsg(null);
		setVoucher(null);
		if (!pkg) return;
		const np = normalizePhone(phone);
		if (np.length < 12) {
			setMsg({
				kind: "error",
				text: "Tafadhali weka namba sahihi ya simu (mfano 07xxxxxxxx)."
			});
			return;
		}
		setLoading(true);
		try {
			const ref = extractReference(await payMongike({
				phone: np,
				package_name: pkg.id
			}));
			if (!ref) throw new Error("Hakuna order reference kutoka kwa server.");
			setMsg({
				kind: "info",
				text: "Ombi la malipo limetumwa. Angalia simu yako na thibitisha PIN. Tunasubiri..."
			});
			const pollStarted = Date.now();
			pollTimer.current = window.setInterval(async () => {
				try {
					if (Date.now() - pollStarted > PAYMENT_TIMEOUT_MS) {
						if (pollTimer.current) window.clearInterval(pollTimer.current);
						setLoading(false);
						try {
							await fetch(API_URL + "/api/cancel-order", {
								method: "POST",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({ order_reference: ref })
							});
						} catch {}
						setMsg({
							kind: "error",
							text: "Malipo hayajakamilika ndani ya muda uliotengwa. Tafadhali fanya malipo ili kuendelea na huduma."
						});
						return;
					}
					const s = await getPaymentStatus(ref);
					const code = s.voucherCode || s.voucher || s.voucher_code;
					if (code) {
						if (pollTimer.current) window.clearInterval(pollTimer.current);
						setLoading(false);
						setVoucher(String(code));
						setMsg({
							kind: "success",
							text: "Malipo yamekamilika! Vocha yako tayari."
						});
					} else if (s.status === "failed") {
						if (pollTimer.current) window.clearInterval(pollTimer.current);
						setLoading(false);
						setMsg({
							kind: "error",
							text: s.message || "Malipo yameshindikana."
						});
					}
				} catch {}
			}, POLL_INTERVAL);
		} catch (err) {
			setLoading(false);
			setMsg({
				kind: "error",
				text: err?.message || "Kuna tatizo. Jaribu tena."
			});
		}
	}
	async function copyVoucher() {
		if (!voucher) return;
		try {
			await navigator.clipboard.writeText(voucher);
			setMsg({
				kind: "success",
				text: "Vocha imenakiliwa."
			});
		} catch {}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "m-0 text-xl font-bold",
			children: "Nunua Vocha"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 mt-1 text-sm text-[#8aa0c4]",
			children: "Chagua kifurushi, weka namba ya simu, lipa kwa mtandao wako."
		}),
		voucher ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 rounded-[18px] border-2 border-[#22d3ee]/40 bg-gradient-to-b from-[#020d1a] to-[#011020] p-5 text-center shadow-[0_0_40px_-10px_rgba(34,211,238,0.2)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-4xl",
					children: "✅"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-lg font-extrabold text-emerald-300",
					children: "Malipo Yamekamilika!"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 mt-1 text-[13px] text-[#8aa0c4]",
					children: "Tumia vocha hii kuingia kwenye WiFi."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 text-[11px] uppercase tracking-[2px] text-[#8aa0c4]",
					children: "Voucher Code"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: copyVoucher,
					className: "w-full rounded-2xl border border-[#22d3ee]/30 bg-[#000d1a] px-4 py-3.5 font-mono text-2xl font-bold tracking-widest text-[#22d3ee] cursor-pointer",
					children: voucher
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => onGotVoucher(voucher),
					className: "mt-3 w-full cursor-pointer rounded-2xl bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] px-4 py-4 text-base font-extrabold text-[#001018] shadow-[0_10px_30px_-12px_rgba(34,211,238,0.4)] transition active:translate-y-px",
					children: "Tumia Vocha"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handlePay,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Kifurushi" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: inputClass,
					value: selected,
					onChange: (e) => setSelected(e.target.value),
					disabled: loading,
					children: packages.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: p.id,
						children: [
							p.name,
							" — ",
							formatTzs(p.price),
							p.duration ? ` (${p.duration})` : ""
						]
					}, p.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Namba ya Simu" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: inputClass,
					type: "tel",
					inputMode: "tel",
					placeholder: "07xxxxxx au 06xxxxxx",
					value: phone,
					onChange: (e) => setPhone(e.target.value),
					disabled: loading
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: btnClass,
					disabled: loading || !pkg,
					children: loading ? "Inasubiri malipo..." : `Lipa ${pkg ? formatTzs(pkg.price) : ""}`
				})
			]
		}),
		msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Message, {
			kind: msg.kind,
			children: msg.text
		})
	] });
}
function getConnectUrl(code) {
	return API_URL + "/api/connect?code=" + encodeURIComponent(code.trim());
}
function UseTab({ prefill }) {
	const [code, setCode] = (0, import_react.useState)(prefill);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const [msg, setMsg] = (0, import_react.useState)(null);
	const debounceRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (prefill) {
			setCode(prefill);
			doCheck(prefill);
		}
	}, [prefill]);
	(0, import_react.useEffect)(() => {
		const c = code.trim();
		if (!c || c === prefill) return;
		if (debounceRef.current) window.clearTimeout(debounceRef.current);
		debounceRef.current = window.setTimeout(() => doCheck(c), 600);
		return () => {
			if (debounceRef.current) window.clearTimeout(debounceRef.current);
		};
	}, [code]);
	async function doCheck(c) {
		if (!c) return;
		setMsg(null);
		setLoading(true);
		try {
			const r = await checkVoucher(c);
			setResult(r);
			if (r?.status === "valid" || r?.valid === true || r?.success === true) setMsg({
				kind: "success",
				text: "Vocha ni halali!"
			});
			else if (r?.status === "used") {
				setMsg({
					kind: "error",
					text: "Code iliyo ingiza imeshatumika tafadhali nunua vocha."
				});
				setResult(null);
			} else {
				setMsg({
					kind: "error",
					text: "Code uliyoingiza sio sahihi tafadhali ingia kwenye tab ya kununua vocha na ununue vocha."
				});
				setResult(null);
			}
		} catch (err) {
			setMsg({
				kind: "error",
				text: err?.message || "Tatizo kuangalia vocha."
			});
		} finally {
			setLoading(false);
		}
	}
	async function copyCode() {
		if (!code) return;
		try {
			await navigator.clipboard.writeText(code);
			setMsg({
				kind: "success",
				text: "Vocha imenakiliwa!"
			});
		} catch {}
	}
	const isValid = result && (result.status === "valid" || result.valid === true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "m-0 text-xl font-bold",
			children: "Tumia Vocha"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 mt-1 text-sm text-[#8aa0c4]",
			children: "Weka voucher code yako uliyopata kupitia SMS au baada ya malipo."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Voucher Code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: `${inputClass} text-center font-mono tracking-widest`,
			type: "text",
			autoCapitalize: "characters",
			placeholder: "Weka code yako hapa",
			value: code,
			onChange: (e) => setCode(e.target.value.toUpperCase())
		})] }),
		loading && !result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 text-center text-sm text-[#8aa0c4]",
			children: "Inakagua vocha..."
		}),
		isValid && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: getConnectUrl(code),
					target: "_blank",
					rel: "noopener noreferrer",
					className: "block w-full cursor-pointer rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 py-4 text-center text-base font-extrabold text-white shadow-[0_10px_30px_-12px_rgba(16,185,129,0.5)] transition-all hover:brightness-110 hover:shadow-[0_14px_35px_-12px_rgba(16,185,129,0.6)] active:translate-y-px",
					children: "📶 Ingia kwenye WiFi"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-[#1f2a44] bg-[#0a1426]/70 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 text-center text-[11px] uppercase tracking-[2px] text-[#8aa0c4]",
						children: "Voucher Code Yako"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 rounded-xl border border-[#22d3ee]/20 bg-[#000d1a] px-4 py-3 font-mono text-xl font-bold tracking-[6px] text-[#22d3ee] text-center",
							children: code
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: copyCode,
							className: "flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-xl border border-[#22d3ee]/30 bg-[#000d1a] text-lg transition hover:bg-[#22d3ee]/10 active:scale-95",
							title: "Nakili code",
							children: "📋"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "rounded-xl border border-[#1f2a44] bg-[#0e1626]/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
						className: "cursor-pointer px-4 py-3 text-sm font-semibold text-[#8aa0c4] transition hover:text-white",
						children: "🔧 Unganisha manually"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-[#1f2a44] px-4 py-3 text-[13px] text-[#8aa0c4] space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-white",
									children: "Hatua 1:"
								}),
								" Unganisha simu yako kwenye mtandao wa ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-white",
									children: "SHIMBA WiFi"
								}),
								"."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-white",
								children: "Hatua 2:"
							}), " Fungua browser yako, utaelekezwa kwenye ukurasa wa login."] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-white",
									children: "Hatua 3:"
								}),
								" Weka code hii kama ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-white",
									children: "Username"
								}),
								" na ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-white",
									children: "Password"
								}),
								":"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg border border-[#22d3ee]/20 bg-[#000d1a] p-3 font-mono text-center text-lg font-bold tracking-[4px] text-[#22d3ee]",
								children: code
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-white",
									children: "Hatua 4:"
								}),
								" Bonyeza ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-white",
									children: "Log In"
								}),
								" na uanze kutumia internet 🚀"
							] })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "http://192.168.88.1/login",
					target: "_blank",
					rel: "noopener noreferrer",
					className: "block w-full rounded-2xl border border-[#22d3ee]/30 bg-[#0a1426] px-4 py-3.5 text-center text-sm font-bold text-[#22d3ee] transition hover:bg-[#22d3ee]/10 active:translate-y-px",
					children: "Fungua ukurasa wa login →"
				})
			]
		}),
		msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Message, {
			kind: msg.kind,
			children: msg.text
		})
	] });
}
function Message({ kind, children }) {
	const styles = {
		info: "border-[#22d3ee]/25 bg-[#22d3ee]/10 text-[#a5f3fc]",
		success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
		error: "border-red-500/30 bg-red-500/10 text-red-300"
	}[kind];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `mt-3.5 rounded-xl border px-3.5 py-3 text-sm ${styles}`,
		children
	});
}
function Instructions() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5 rounded-2xl border border-[#22d3ee]/20 bg-gradient-to-br from-[#22d3ee]/5 to-[#3b82f6]/[0.07] p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "m-0 mb-3 flex items-center gap-2 text-[15px] font-semibold text-[#22d3ee]",
				children: "📶 Jinsi ya Kuunganisha"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "m-0 list-decimal pl-5 text-[13px] leading-[1.8] text-[#8aa0c4]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"Unganisha simu yako kwenye ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-white",
							children: "SHIMBA WiFi"
						}),
						"."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-white",
						children: "Nunua vocha"
					}), " hapa juu kwa M-Pesa / Tigo / Airtel."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Subiri vocha ipatikane (au angalia SMS)." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"Bonyeza ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-white",
							children: "Tumia Vocha"
						}),
						" kisha ingiza code yako."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"Bonyeza ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-white",
							children: "📶 Ingia kwenye WiFi"
						}),
						" kuunganisha moja kwa moja."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Furahia internet ya kasi 🚀" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center gap-1.5 rounded-xl border border-[#1f2a44] bg-white/[0.03] px-3 py-2.5 text-xs text-[#8aa0c4]",
				children: [
					"Mitandao:",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full border border-[#22d3ee]/20 bg-[#22d3ee]/10 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-200",
						children: "M-Pesa"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full border border-[#22d3ee]/20 bg-[#22d3ee]/10 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-200",
						children: "Tigo Pesa"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full border border-[#22d3ee]/20 bg-[#22d3ee]/10 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-200",
						children: "Airtel Money"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full border border-[#22d3ee]/20 bg-[#22d3ee]/10 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-200",
						children: "Halopesa"
					})
				]
			})
		]
	});
}
//#endregion
export { PortalPage as component };
