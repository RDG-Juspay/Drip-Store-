import { type NextRequest } from "next/server";
import { updateOrderStatus } from "@/lib/order-store";

interface WebhookOrder {
  order_id: string;
  status: string;
  amount: number;
  currency: string;
  customer_id: string;
  customer_email?: string;
}

interface WebhookPayload {
  event_name: string;
  content: {
    order: WebhookOrder;
  };
}

const HANDLED_EVENTS = new Set([
  "ORDER_SUCCEEDED",
  "ORDER_FAILED",
  "ORDER_PROCESSING",
  "ORDER_REFUNDED",
]);

export async function POST(request: NextRequest) {
  let payload: WebhookPayload;

  try {
    payload = await request.json();
  } catch {
    return new Response("Invalid JSON payload", { status: 400 });
  }

  const { event_name, content } = payload ?? {};

  if (!event_name || !content?.order?.order_id) {
    return new Response("Malformed webhook payload", { status: 400 });
  }

  const { order_id, status, amount, customer_id } = content.order;

  if (HANDLED_EVENTS.has(event_name)) {
    console.log(
      `[webhook] ${event_name} — order: ${order_id}, status: ${status}, amount: ${amount}, customer: ${customer_id}`
    );

    // Persist the authoritative status from Juspay.
    // This is the failsafe path: fires even when the user closes their browser
    // before the return_url redirect completes.
    updateOrderStatus(order_id, status);

    // TODO: persist to your database here, e.g.:
    // await db.orders.upsert({ order_id }, { status, updated_at: new Date() });
  } else {
    console.log(`[webhook] Unhandled event: ${event_name}`);
  }

  // Always respond 200 quickly — Juspay retries on non-2xx
  return new Response("OK", { status: 200 });
}
