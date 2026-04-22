import { getJuspayOrderStatus, JuspayError } from "@/lib/juspay";
import { getPendingOrder, updateOrderStatus } from "@/lib/order-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return Response.json({ error: "orderId is required" }, { status: 400 });
  }

  // Idempotency: return cached result on page refresh
  const pending = getPendingOrder(orderId);
  if (pending?.status && pending?.verifiedAt) {
    return Response.json({
      orderId,
      status: pending.status,
      amount: pending.amount,
      verified: true,
      fromCache: true,
    });
  }

  // Resolve customerId: prefer what the client sends, fall back to what we
  // stored server-side in the order store when the order was created.
  const customerId =
    searchParams.get("customerId") || pending?.customerId || "";

  try {
    const order = await getJuspayOrderStatus(orderId, customerId);

    // Amount integrity check
    if (pending) {
      const delta = Math.abs(order.amount - pending.amount);
      if (delta > 1) {
        console.error(
          `[verify-payment] Amount mismatch for ${orderId}: expected ${pending.amount}, got ${order.amount}`
        );
        return Response.json(
          { error: "Payment amount mismatch. Contact support." },
          { status: 422 }
        );
      }
    }

    updateOrderStatus(orderId, order.status);

    return Response.json({
      orderId,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      paymentMethod: order.payment_method_type,
      verified: true,
    });
  } catch (err) {
    if (err instanceof JuspayError) {
      console.error("[verify-payment] Juspay error:", err.statusCode, err.body);
      return Response.json(
        { error: "Could not verify payment status. Please contact support." },
        { status: 502 }
      );
    }
    if (err instanceof Error && err.name === "AbortError") {
      return Response.json(
        { error: "Verification timed out. Please try again." },
        { status: 504 }
      );
    }
    console.error("[verify-payment] Unexpected error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
