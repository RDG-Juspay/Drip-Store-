import { GET } from "@/app/api/verify-payment/route";
import { storePendingOrder } from "@/lib/order-store";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeRequest(params: Record<string, string>) {
  const url = new URL("http://localhost:3000/api/verify-payment");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return new Request(url.toString());
}

const MOCK_JUSPAY_ORDER = {
  order_id: "DRPTEST01",
  status: "CHARGED",
  amount: 93,
  effective_amount: 93,
  currency: "INR",
  customer_id: "testexamplecom",
  customer_email: "test@example.com",
  customer_phone: "9876543210",
  date_created: "2026-04-22T10:00:00Z",
  refunded: false,
  amount_refunded: 0,
  payment_method_type: "UPI",
};

beforeEach(() => {
  jest.resetAllMocks();
  global.fetch = jest.fn();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("GET /api/verify-payment", () => {
  describe("validation", () => {
    it("returns 400 when orderId is missing", async () => {
      const res = await GET(
        makeRequest({ customerId: "testexamplecom" }) as never
      );
      expect(res.status).toBe(400);
    });

    it("returns 400 when customerId is missing", async () => {
      const res = await GET(makeRequest({ orderId: "DRPTEST01" }) as never);
      expect(res.status).toBe(400);
    });
  });

  describe("success — CHARGED order", () => {
    it("returns status CHARGED with order details", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(MOCK_JUSPAY_ORDER), { status: 200 })
      );

      storePendingOrder("DRPTEST01", {
        amount: 93.96,
        customerId: "testexamplecom",
      });

      const res = await GET(
        makeRequest({ orderId: "DRPTEST01", customerId: "testexamplecom" }) as never
      );
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.status).toBe("CHARGED");
      expect(data.orderId).toBe("DRPTEST01");
      expect(data.verified).toBe(true);
    });
  });

  describe("idempotency", () => {
    it("returns cached result on subsequent calls without hitting Juspay again", async () => {
      // First call populates cache
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(MOCK_JUSPAY_ORDER), { status: 200 })
      );

      storePendingOrder("DRPCACHE01", {
        amount: 93,
        customerId: "testexamplecom",
      });

      await GET(
        makeRequest({ orderId: "DRPCACHE01", customerId: "testexamplecom" }) as never
      );

      // Second call — fetch must NOT be called again
      const res2 = await GET(
        makeRequest({ orderId: "DRPCACHE01", customerId: "testexamplecom" }) as never
      );
      const data2 = await res2.json();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(data2.fromCache).toBe(true);
      expect(data2.status).toBe("CHARGED");
    });
  });

  describe("amount integrity", () => {
    it("returns 422 when Juspay amount differs from expected by more than ₹1", async () => {
      const tampered = { ...MOCK_JUSPAY_ORDER, amount: 10, order_id: "DRPAMT01" };
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(tampered), { status: 200 })
      );

      storePendingOrder("DRPAMT01", {
        amount: 93.96,
        customerId: "testexamplecom",
      });

      const res = await GET(
        makeRequest({ orderId: "DRPAMT01", customerId: "testexamplecom" }) as never
      );
      expect(res.status).toBe(422);
      const data = await res.json();
      expect(data.error).toMatch(/mismatch/i);
    });

    it("passes integrity check when amounts match within ₹1 tolerance", async () => {
      const closeMatch = { ...MOCK_JUSPAY_ORDER, amount: 94, order_id: "DRPAMT02" };
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(closeMatch), { status: 200 })
      );

      storePendingOrder("DRPAMT02", {
        amount: 93.96,
        customerId: "testexamplecom",
      });

      const res = await GET(
        makeRequest({ orderId: "DRPAMT02", customerId: "testexamplecom" }) as never
      );
      expect(res.status).toBe(200);
    });
  });

  describe("gateway errors", () => {
    it("returns 502 when Juspay returns a non-2xx response", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify({ error_code: "INVALID_ORDERID" }), {
          status: 404,
        })
      );

      const res = await GET(
        makeRequest({ orderId: "NOSUCHORDER", customerId: "abc" }) as never
      );
      expect(res.status).toBe(502);
    });

    it("returns 504 on AbortError (timeout)", async () => {
      const abort = new Error("aborted");
      abort.name = "AbortError";
      (global.fetch as jest.Mock).mockRejectedValueOnce(abort);

      const res = await GET(
        makeRequest({ orderId: "DRPTIMEOUT", customerId: "abc" }) as never
      );
      expect(res.status).toBe(504);
    });

    it("returns 500 on unexpected errors", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Something exploded")
      );

      const res = await GET(
        makeRequest({ orderId: "DRPBOOM", customerId: "abc" }) as never
      );
      expect(res.status).toBe(500);
    });
  });
});
