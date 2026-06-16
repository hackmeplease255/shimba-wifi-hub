export const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://fi5.bot-hosting.net:22896";

export type PackageId = "6hours" | "24hours" | "48hours" | "7days";

export interface PackageDef {
  id: PackageId;
  name: string;
  hours: string;
  priceTzs: number;
  highlight?: boolean;
  perks: string[];
}

export const PACKAGES: PackageDef[] = [
  {
    id: "6hours",
    name: "6 Hours",
    hours: "6h access",
    priceTzs: 500,
    perks: ["High-speed browsing", "1 device", "Quick top-up"],
  },
  {
    id: "24hours",
    name: "24 Hours",
    hours: "1 day access",
    priceTzs: 1000,
    highlight: true,
    perks: ["High-speed browsing", "1 device", "Best for a full day"],
  },
  {
    id: "48hours",
    name: "48 Hours",
    hours: "2 days access",
    priceTzs: 2000,
    perks: ["High-speed browsing", "1 device", "Weekend ready"],
  },
  {
    id: "7days",
    name: "7 Days",
    hours: "1 week access",
    priceTzs: 5000,
    perks: ["High-speed browsing", "1 device", "Best value"],
  },
];

export interface PayResponse {
  success?: boolean;
  message?: string;
  orderReference?: string;
  reference?: string;
  order_reference?: string;
  [k: string]: unknown;
}

export async function payMongike(input: {
  phone: string;
  package_name: PackageId;
}): Promise<PayResponse> {
  const res = await fetch(`${API_URL}/pay-mongike`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const text = await res.text();
  let json: PayResponse = {};
  try {
    json = text ? (JSON.parse(text) as PayResponse) : {};
  } catch {
    json = { message: text };
  }
  if (!res.ok) {
    throw new Error(json.message || `Payment request failed (${res.status})`);
  }
  return json;
}

export interface PaymentStatus {
  status: "pending" | "paid" | "failed" | string;
  voucher?: string;
  voucher_code?: string;
  package?: string;
  package_name?: string;
  phone?: string;
  amount?: number;
  message?: string;
  [k: string]: unknown;
}

export async function getPaymentStatus(reference: string): Promise<PaymentStatus> {
  const res = await fetch(
    `${API_URL}/payment-status/${encodeURIComponent(reference)}`,
  );
  const text = await res.text();
  let json: PaymentStatus = { status: "pending" };
  try {
    json = text ? (JSON.parse(text) as PaymentStatus) : { status: "pending" };
  } catch {
    json = { status: "pending", message: text };
  }
  return json;
}

export interface AdminStats {
  totalOrders?: number;
  paidOrders?: number;
  pendingOrders?: number;
  failedOrders?: number;
  totalRevenue?: number;
  total_orders?: number;
  paid_orders?: number;
  pending_orders?: number;
  failed_orders?: number;
  total_revenue?: number;
  [k: string]: unknown;
}

export async function getAdminStats(): Promise<AdminStats> {
  const res = await fetch(`${API_URL}/api/admin/stats`);
  if (!res.ok) throw new Error(`Failed to load stats (${res.status})`);
  return (await res.json()) as AdminStats;
}

export async function checkVoucher(code: string): Promise<unknown> {
  const res = await fetch(
    `${API_URL}/api/voucher/${encodeURIComponent(code)}`,
  );
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text };
  }
}

export function formatTzs(n: number): string {
  return new Intl.NumberFormat("en-TZ").format(n) + " TZS";
}
