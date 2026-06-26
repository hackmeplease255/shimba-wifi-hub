//#region node_modules/.nitro/vite/services/ssr/assets/api-DDmwNao-.js
var PROXY_PREFIX = "/api/proxy";
var userApiUrl = "http://fi5.bot-hosting.net:22896";
function detectApiUrl() {
	if (typeof window !== "undefined" && window.location.protocol === "https:" && !userApiUrl.startsWith("https:")) {
		console.warn(`[API] VITE_API_URL is HTTP but page is HTTPS — using proxy to avoid mixed-content block`);
		return PROXY_PREFIX;
	}
	return userApiUrl;
}
var API_URL = detectApiUrl();
var DEFAULT_PACKAGES = [
	{
		id: "6hours",
		name: "Masaa 6",
		price: 500,
		duration: "6 hours"
	},
	{
		id: "24hours",
		name: "Masaa 24",
		price: 1e3,
		duration: "1 day"
	},
	{
		id: "48hours",
		name: "Masaa 48",
		price: 2e3,
		duration: "2 days"
	},
	{
		id: "7days",
		name: "Siku 7",
		price: 5e3,
		duration: "1 week"
	}
];
var LABEL_BY_ID = {
	"6hours": "Masaa 6",
	"24hours": "Masaa 24",
	"48hours": "Masaa 48",
	"7days": "Siku 7"
};
async function jsonOrText(res) {
	const text = await res.text();
	try {
		return text ? JSON.parse(text) : {};
	} catch {
		return { message: text };
	}
}
async function getPackages() {
	try {
		const res = await fetch(`${API_URL}/packages`);
		if (!res.ok) return DEFAULT_PACKAGES;
		const data = await res.json();
		if (data && typeof data === "object" && !Array.isArray(data)) {
			const list = Object.entries(data).map(([id, v]) => ({
				id,
				name: LABEL_BY_ID[id] ?? v?.label ?? id,
				price: Number(v?.amount ?? v?.price ?? 0),
				duration: v?.limit_uptime
			}));
			if (list.length) return list;
		}
		return DEFAULT_PACKAGES;
	} catch {
		return DEFAULT_PACKAGES;
	}
}
async function payMongike(input) {
	const res = await fetch(`${API_URL}/pay-mongike`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({
			phone: input.phone,
			package_name: input.package_name
		})
	});
	const data = await jsonOrText(res);
	if (!res.ok || data.success === false) throw new Error(data.message || `Payment failed (${res.status})`);
	return data;
}
function extractReference(r) {
	return r.orderReference || r.reference || r.order_reference || r.data?.orderReference;
}
async function getPaymentStatus(ref) {
	return await jsonOrText(await fetch(`${API_URL}/payment-status/${encodeURIComponent(ref)}`));
}
async function checkVoucher(code) {
	return await jsonOrText(await fetch(`${API_URL}/api/voucher-status/${encodeURIComponent(code)}`));
}
function formatTzs(n) {
	return new Intl.NumberFormat("en-TZ").format(n) + " TZS";
}
//#endregion
export { getPackages as a, formatTzs as i, checkVoucher as n, getPaymentStatus as o, extractReference as r, payMongike as s, API_URL as t };
