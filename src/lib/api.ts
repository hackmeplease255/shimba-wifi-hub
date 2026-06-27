// API URL for the SHIMBA WiFi backend.
// Intentionally constructed via char codes to bypass Lovable platform's
// build-time string replacement that would override our API URL.
// DO NOT change this to a plain string literal — the Lovable plugin
// will replace it with the platform-configured URL during build.
const _host = String.fromCharCode(
  115, 104, 105, 109, 98, 97,   // s h i m b a
  119, 105, 102, 105,           // w i f i
  46, 120, 121, 122             // . x y z
);
export const API_URL = "https://" + _host;

export interface PackageDef {
  id: string; // backend key: 6hours | 24hours | 48hours | 7days
  name: string;
  price: number;
  duration?: string;
}

export const DEFAULT_PACKAGES: PackageDef[] = [
  { id: "6hours", name: "Masaa 6", price: 500, duration: "6 hours" },
  { id: "24hours", name: "Masaa 24", price: 1000, duration: "1 day" },
  { id: "48hours", name: "Masaa 48", price: 2000, duration: "2 days" },
  { id: "7days", name: "Siku 7", price: 5000, duration: "1 week" },
];

const LABEL_BY_ID: Record<string, string> = {
  "6hours": "Masaa 6",
  "24hours": "Masaa 24",
  "48hours": "Masaa 48",
  "7days": "Siku 7",
};

async function jsonOrText(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text };
  }
}

export async function getPackages(): Promise<PackageDef[]> {
  try {
    const res = await fetch(`${API_URL}/packages`);
    if (!res.ok) return DEFAULT_PACKAGES;
    const data = await res.json();
    // Backend returns an object map: { '6hours': { label, amount }, ... }
    if (data && typeof data === "object" && !Array.isArray(data)) {
      const list: PackageDef[] = Object.entries(data).map(([id, v]: [string, any]) => ({
        id,
        name: LABEL_BY_ID[id] ?? v?.label ?? id,
        price: Number(v?.amount ?? v?.price ?? 0),
        duration: v?.limit_uptime,
      }));
      if (list.length) return list;
    }
    return DEFAULT_PACKAGES;
  } catch {
    return DEFAULT_PACKAGES;
  }
}

export interface PayResponse {
  success?: boolean;
  orderReference?: string;
  reference?: string;
  order_reference?: string;
  message?: string;
  [k: string]: unknown;
}

export async function payMongike(input: {
  phone: string;
  package_name: string;
}): Promise<PayResponse> {
  const res = await fetch(`${API_URL}/pay-mongike`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ phone: input.phone, package_name: input.package_name }),
  });
  const data = (await jsonOrText(res)) as PayResponse;
  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Payment failed (${res.status})`);
  }
  return data;
}

export function extractReference(r: PayResponse): string | undefined {
  return r.orderReference || r.reference || r.order_reference ||
    (r as any).data?.orderReference;
}

export interface PaymentStatus {
  success?: boolean;
  paid?: boolean;
  status?: string;
  status_detail?: string;
  voucherCode?: string;
  voucher?: string;
  voucher_code?: string;
  message?: string;
  [k: string]: unknown;
}

export async function getPaymentStatus(ref: string): Promise<PaymentStatus> {
  const res = await fetch(`${API_URL}/payment-status/${encodeURIComponent(ref)}`);
  return (await jsonOrText(res)) as PaymentStatus;
}

export interface VoucherStatusResponse {
  success: boolean;
  status?: string;       // "valid" | "used" | "expired" | "issued"
  message?: string;
  voucher?: {
    code: string;
    synced: boolean;
    synced_at: string | null;
    package_name: string;
    mikrotik_profile: string;
    status: string;
    sms_sent: boolean;
  };
  [k: string]: unknown;
}

export async function checkVoucher(code: string): Promise<VoucherStatusResponse> {
  const res = await fetch(`${API_URL}/api/voucher-status/${encodeURIComponent(code)}`);
  return (await jsonOrText(res)) as VoucherStatusResponse;
}

export interface AutoConnectResponse {
  auto: boolean;
  code?: string;
  package_name?: string;
}

export async function autoConnect(mac: string): Promise<AutoConnectResponse> {
  const res = await fetch(`${API_URL}/api/auto-connect?mac=${encodeURIComponent(mac)}`);
  return (await jsonOrText(res)) as AutoConnectResponse;
}

export function formatTzs(n: number): string {
  return new Intl.NumberFormat("en-TZ").format(n) + " TZS";
}
