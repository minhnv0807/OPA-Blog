import { PayOS } from "@payos/node";

type PayOSClient = InstanceType<typeof PayOS>;

let _payos: PayOSClient | null = null;

export function getPayOS(): PayOSClient {
  if (_payos) return _payos;

  const clientId = process.env.PAYOS_CLIENT_ID;
  const apiKey = process.env.PAYOS_API_KEY;
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

  if (!clientId || !apiKey || !checksumKey) {
    throw new Error(
      "Missing PayOS credentials. Set PAYOS_CLIENT_ID, PAYOS_API_KEY, and PAYOS_CHECKSUM_KEY in .env.local"
    );
  }

  _payos = new PayOS({
    clientId,
    apiKey,
    checksumKey,
  });
  return _payos;
}

// Keep backward-compat export (lazily resolved)
export const payos = new Proxy({} as PayOSClient, {
  get(_target, prop) {
    return (getPayOS() as unknown as Record<string | symbol, unknown>)[prop];
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
