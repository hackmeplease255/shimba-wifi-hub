export const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://fi5.bot-hosting.net:22896";

export interface PackageDef {
  id: string;
  name: string;
  price: number;
  duration?: string;
}

export const DEFAULT_PACKAGES: PackageDef[] = [
  { id: "500", name: "Saa 6", price: 500, duration: "6 hours" },
  { id: "1000", name: "Masaa 24", price: 1000, duration: "1 day" },
  { id: "2000", name: "Masaa 48", price: 2000, duration: "2 days" },
  { id: "5000", name: "Siku 7", price: 5000, duration: "1 week" },
];

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
    if (Array.isArray(data) && data.length) {
      return data.map((p: any, i: number) => ({
        id: String(p.id ?? p.price ?? i),
        name: p.name ?? `${p.price} TZS`,
        price: Number(p.price ?? p.amount ?? 0),
        duration: p.duration ?? p.hours,
      }));
    }
    return DEFAULT_PACKAGES;
  } catch {
    return DEFAULT_PACKAGES;
  }
}

export interface PayResponse {
  orderReference?: string;
  reference?: string;
  order_reference?: string;
  message?: string;
  [k: string]: unknown;
}

export async function payMongike(input: {
  phone: string;
  amount: number;
  package?: string;
}): Promise<PayResponse> {
  const res = await fetch(`${API_URL}/pay-mongike`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = (await jsonOrText(res)) as PayResponse;
  if (!res.ok) throw new Error(data.message || `Payment failed (${res.status})`);
  return data;
}

export function extractReference(r: PayResponse): string | undefined {
  return r.orderReference || r.reference || r.order_reference ||
    (r as any).data?.orderReference;
}

export interface PaymentStatus {
  status?: string;
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

export async function checkVoucher(code: string): Promise<any> {
  const res = await fetch(`${API_URL}/api/voucher-status/${encodeURIComponent(code)}`);
  return await jsonOrText(res);
}

export function formatTzs(n: number): string {
  return new Intl.NumberFormat("en-TZ").format(n) + " TZS";
}
