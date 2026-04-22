// In-memory order store for idempotency and amount integrity checks.
// Replace with Redis or a database in production — this resets on server restart
// and will not work correctly in serverless (each invocation gets a fresh instance).

export type PendingOrder = {
  amount: number;
  customerId: string;
  status?: string;
  verifiedAt?: number;
};

const store = new Map<string, PendingOrder>();

export function storePendingOrder(orderId: string, data: PendingOrder): void {
  store.set(orderId, data);
}

export function getPendingOrder(orderId: string): PendingOrder | undefined {
  return store.get(orderId);
}

export function updateOrderStatus(orderId: string, status: string): void {
  const existing = store.get(orderId);
  if (existing) {
    store.set(orderId, { ...existing, status, verifiedAt: Date.now() });
  }
}
