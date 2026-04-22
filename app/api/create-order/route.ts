import { type NextRequest } from "next/server";
import { products } from "@/lib/products";
import {
  createJuspaySession,
  generateOrderId,
  sanitizeCustomerId,
  JuspayError,
} from "@/lib/juspay";
import { storePendingOrder } from "@/lib/order-store";

interface OrderItem {
  productId: string;
  quantity: number;
  size: string;
  color: string;
}

interface CreateOrderBody {
  items: OrderItem[];
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
}

export async function POST(request: NextRequest) {
  let body: CreateOrderBody;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { items, customer } = body ?? {};

  if (!items?.length) {
    return Response.json({ error: "Cart is empty" }, { status: 400 });
  }
  if (!customer?.email || !customer?.firstName || !customer?.phone) {
    return Response.json({ error: "Missing customer fields" }, { status: 400 });
  }

  // Sanitise phone to digits only, must be 10 digits (no country code)
  const phone = customer.phone.replace(/\D/g, "").slice(-10);
  if (phone.length !== 10) {
    return Response.json(
      { error: "Phone must be a 10-digit number" },
      { status: 400 }
    );
  }

  // Verify every product against our catalog and recalculate total server-side
  let subtotal = 0;
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return Response.json(
        { error: `Product ${item.productId} not found` },
        { status: 400 }
      );
    }
    if (item.quantity < 1) {
      return Response.json(
        { error: `Invalid quantity for product ${item.productId}` },
        { status: 400 }
      );
    }
    subtotal += product.price * item.quantity;
  }

  const shipping = subtotal >= 75 ? 0 : 9.99;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  const orderId = generateOrderId();
  const customerId = sanitizeCustomerId(customer.email);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const session = await createJuspaySession({
      order_id: orderId,
      amount: total.toFixed(2),
      customer_id: customerId,
      customer_email: customer.email,
      customer_phone: phone,
      payment_page_client_id: process.env.JUSPAY_CLIENT_ID ?? "",
      action: "paymentPage",
      return_url: `${appUrl}/payment-return`,
      first_name: customer.firstName,
      last_name: customer.lastName ?? "",
      description: `Drip Store order ${orderId}`,
      currency: "INR",
    });

    // Record expected amount for later integrity verification
    storePendingOrder(orderId, { amount: total, customerId });

    return Response.json({
      orderId,
      customerId,
      paymentUrl: session.payment_links.web,
      amount: total,
    });
  } catch (err) {
    if (err instanceof JuspayError) {
      console.error("[create-order] Juspay error:", err.statusCode, err.body);
      return Response.json(
        { error: "Payment gateway error. Please try again." },
        { status: 502 }
      );
    }
    if (err instanceof Error && err.name === "AbortError") {
      return Response.json(
        { error: "Payment gateway timeout. Please try again." },
        { status: 504 }
      );
    }
    console.error("[create-order] Unexpected error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
