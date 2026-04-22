const BASE_URL = process.env.JUSPAY_BASE_URL ?? "https://sandbox.juspay.in";
const API_KEY = process.env.JUSPAY_API_KEY ?? "";
const MERCHANT_ID = process.env.JUSPAY_MERCHANT_ID ?? "";

export interface JuspaySessionPayload {
  order_id: string;
  amount: string;
  customer_id: string;
  customer_email: string;
  customer_phone: string;
  payment_page_client_id: string;
  action: "paymentPage";
  return_url: string;
  first_name?: string;
  last_name?: string;
  description?: string;
  currency?: string;
}

export interface JuspaySessionResponse {
  status: string;
  id: string;
  order_id: string;
  payment_links: {
    web: string;
    expiry?: string;
    deep_link?: string;
  };
  sdk_payload?: unknown;
}

export interface JuspayOrderStatus {
  order_id: string;
  status: string;
  amount: number;
  effective_amount: number;
  currency: string;
  customer_id: string;
  customer_email: string;
  customer_phone: string;
  date_created: string;
  refunded: boolean;
  amount_refunded: number;
  payment_method_type?: string;
  payment_method?: string;
}

export class JuspayError extends Error {
  constructor(
    public statusCode: number,
    public body: unknown
  ) {
    super(`Juspay API error ${statusCode}`);
    this.name = "JuspayError";
  }
}

export function getAuthHeader(): string {
  return `Basic ${Buffer.from(`${API_KEY}:`).toString("base64")}`;
}

export function generateOrderId(): string {
  // DRP + 8-char base36 timestamp + 4 random alphanumeric = 15 chars (well under the 21-char limit)
  const ts = Date.now().toString(36).slice(-8).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DRP${ts}${rand}`;
}

export function sanitizeCustomerId(email: string): string {
  return email.replace(/[^a-zA-Z0-9]/g, "").slice(0, 50) || "guest";
}

export async function createJuspaySession(
  payload: JuspaySessionPayload
): Promise<JuspaySessionResponse> {
  console.log("[juspay] session request →", {
    url: `${BASE_URL}/session`,
    headers: {
      Authorization: getAuthHeader(),
      "x-merchantid": MERCHANT_ID,
      "x-routing-id": payload.customer_id,
      "Content-Type": "application/json",
    },
    body: {
      order_id: payload.order_id,
      amount: payload.amount,
      currency: payload.currency,
      customer_id: payload.customer_id,
      customer_email: payload.customer_email,
      action: payload.action,
      return_url: payload.return_url,
    },
  });

  const res = await fetch(`${BASE_URL}/session`, {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
      "x-merchantid": MERCHANT_ID,
      "x-routing-id": payload.customer_id,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseHeaders = Object.fromEntries(res.headers.entries());

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    console.error("[juspay] session error ←", {
      status: res.status,
      headers: responseHeaders,
      body,
    });
    throw new JuspayError(res.status, body);
  }

  const data = (await res.json()) as JuspaySessionResponse;
  console.log("[juspay] session response ←", {
    status: res.status,
    headers: responseHeaders,
    body: {
      status: data.status,
      order_id: data.order_id,
      payment_url: data.payment_links?.web,
    },
  });
  return data;
}

export async function getJuspayOrderStatus(
  orderId: string,
  customerId: string
): Promise<JuspayOrderStatus> {
  const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: getAuthHeader(),
      "x-merchantid": MERCHANT_ID,
      "x-routing-id": customerId,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new JuspayError(res.status, body);
  }

  return res.json() as Promise<JuspayOrderStatus>;
}
