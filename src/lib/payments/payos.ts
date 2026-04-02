import { PayOS } from "@payos/node";

type PayOSClient = InstanceType<typeof PayOS>;

let _payos: PayOSClient | null = null;

export function getPayOS(): PayOSClient {
  if (_payos) return _payos;

  // PayOS v2 SDK auto-reads PAYOS_CLIENT_ID, PAYOS_API_KEY,
  // PAYOS_CHECKSUM_KEY from process.env when not passed explicitly.
  _payos = new PayOS();
  return _payos;
}

// Lazily-resolved singleton — first property access triggers init.
export const payos = new Proxy({} as PayOSClient, {
  get(_target, prop) {
    const client = getPayOS();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    // Bind methods so `this` stays on the real client / sub-resource
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

export const PACKAGES = {
  "10tr": {
    name: "AI Kiếm Tiền",
    price: 10_000_000,
    description: "Gói AI Kiếm Tiền Thực Chiến - 2 buổi offline + 3 tuần support",
  },
  "15tr": {
    name: "Full Stack AI",
    price: 15_000_000,
    description: "Gói Full Stack AI - 3 buổi offline + 4 tuần support",
  },
} as const;

export type PackageId = keyof typeof PACKAGES;

export function calculatePrice(packageId: PackageId, isGroup: boolean): number {
  const base = PACKAGES[packageId].price;
  return isGroup ? Math.round(base * 0.5) : base;
}
