import { POST } from "@/app/api/create-order/route";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeRequest(body: unknown) {
  return new Request("http://localhost:3000/api/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const VALID_BODY = {
  items: [{ productId: "1", quantity: 2, size: "M", color: "White" }],
  customer: {
    email: "test@example.com",
    firstName: "John",
    lastName: "Doe",
    phone: "9876543210",
  },
};

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockJuspaySession = {
  status: "NEW",
  id: "ordeh_test123",
  order_id: "DRPTEST01",
  payment_links: {
    web: "https://sandbox.juspay.in/orders/ordeh_test123/payment-page",
  },
};

beforeEach(() => {
  jest.resetAllMocks();
  global.fetch = jest.fn();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("POST /api/create-order", () => {
  describe("success", () => {
    it("returns orderId, customerId, paymentUrl, and amount on success", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(mockJuspaySession), { status: 200 })
      );

      const res = await POST(makeRequest(VALID_BODY) as never);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.paymentUrl).toBe(mockJuspaySession.payment_links.web);
      expect(data.orderId).toMatch(/^DRP[A-Z0-9]{12}$/);
      expect(typeof data.amount).toBe("number");
      expect(data.amount).toBeGreaterThan(0);
    });

    it("calculates the total correctly (subtotal + 8% tax, free shipping >= 75)", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(mockJuspaySession), { status: 200 })
      );

      // Product id "1" has price ₹29; qty 3 = ₹87 subtotal → free shipping
      const body = {
        ...VALID_BODY,
        items: [{ productId: "1", quantity: 3, size: "M", color: "White" }],
      };

      const res = await POST(makeRequest(body) as never);
      const data = await res.json();

      // subtotal = 87, shipping = 0 (>=75), tax = 87 * 0.08 = 6.96, total = 93.96
      expect(data.amount).toBeCloseTo(93.96, 1);
    });

    it("forwards correct payload to Juspay session API", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(mockJuspaySession), { status: 200 })
      );

      await POST(makeRequest(VALID_BODY) as never);

      const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
      expect(url).toContain("/session");
      expect(options.method).toBe("POST");

      const sent = JSON.parse(options.body);
      expect(sent.customer_email).toBe("test@example.com");
      expect(sent.action).toBe("paymentPage");
      expect(sent.currency).toBe("INR");
      expect(sent.payment_page_client_id).toBeTruthy();
      expect(sent.return_url).toContain("/payment-return");
    });
  });

  describe("validation errors", () => {
    it("returns 400 when cart is empty", async () => {
      const res = await POST(
        makeRequest({ ...VALID_BODY, items: [] }) as never
      );
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/empty/i);
    });

    it("returns 400 when customer email is missing", async () => {
      const body = {
        ...VALID_BODY,
        customer: { ...VALID_BODY.customer, email: "" },
      };
      const res = await POST(makeRequest(body) as never);
      expect(res.status).toBe(400);
    });

    it("returns 400 when phone is not 10 digits", async () => {
      const body = {
        ...VALID_BODY,
        customer: { ...VALID_BODY.customer, phone: "12345" },
      };
      const res = await POST(makeRequest(body) as never);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/phone/i);
    });

    it("returns 400 when product ID does not exist", async () => {
      const body = {
        ...VALID_BODY,
        items: [{ productId: "NONEXISTENT", quantity: 1, size: "M", color: "Red" }],
      };
      const res = await POST(makeRequest(body) as never);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/not found/i);
    });

    it("returns 400 on invalid JSON body", async () => {
      const req = new Request("http://localhost:3000/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "not-json",
      });
      const res = await POST(req as never);
      expect(res.status).toBe(400);
    });
  });

  describe("gateway errors", () => {
    it("returns 502 when Juspay returns a non-2xx response", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify({ error_code: "access_denied" }), {
          status: 401,
        })
      );

      const res = await POST(makeRequest(VALID_BODY) as never);
      expect(res.status).toBe(502);
      const data = await res.json();
      expect(data.error).toMatch(/gateway/i);
    });

    it("returns 504 on network timeout (AbortError)", async () => {
      const abortErr = new Error("The operation was aborted");
      abortErr.name = "AbortError";
      (global.fetch as jest.Mock).mockRejectedValueOnce(abortErr);

      const res = await POST(makeRequest(VALID_BODY) as never);
      expect(res.status).toBe(504);
    });

    it("returns 500 on unexpected errors", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Unexpected error")
      );

      const res = await POST(makeRequest(VALID_BODY) as never);
      expect(res.status).toBe(500);
    });
  });
});
