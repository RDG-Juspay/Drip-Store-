import { POST } from "@/app/api/juspay/webhook/route";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeRequest(body: unknown) {
  return new Request("http://localhost:3000/api/juspay/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const MOCK_WEBHOOK_SUCCEEDED = {
  event_name: "ORDER_SUCCEEDED",
  content: {
    order: {
      order_id: "DRPTEST01",
      status: "CHARGED",
      amount: 93,
      currency: "INR",
      customer_id: "testexamplecom",
      customer_email: "test@example.com",
    },
  },
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("POST /api/juspay/webhook", () => {
  describe("success", () => {
    it("responds 200 OK for ORDER_SUCCEEDED", async () => {
      const res = await POST(makeRequest(MOCK_WEBHOOK_SUCCEEDED) as never);
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toBe("OK");
    });

    it("responds 200 OK for ORDER_FAILED", async () => {
      const payload = {
        ...MOCK_WEBHOOK_SUCCEEDED,
        event_name: "ORDER_FAILED",
        content: {
          order: {
            ...MOCK_WEBHOOK_SUCCEEDED.content.order,
            status: "FAILED",
          },
        },
      };
      const res = await POST(makeRequest(payload) as never);
      expect(res.status).toBe(200);
    });

    it("responds 200 OK for ORDER_PROCESSING", async () => {
      const payload = {
        ...MOCK_WEBHOOK_SUCCEEDED,
        event_name: "ORDER_PROCESSING",
        content: {
          order: {
            ...MOCK_WEBHOOK_SUCCEEDED.content.order,
            status: "PENDING",
          },
        },
      };
      const res = await POST(makeRequest(payload) as never);
      expect(res.status).toBe(200);
    });

    it("responds 200 OK for unhandled events (does not throw)", async () => {
      const payload = { event_name: "UNKNOWN_EVENT", content: { order: { order_id: "X" } } };
      const res = await POST(makeRequest(payload) as never);
      expect(res.status).toBe(200);
    });
  });

  describe("validation errors", () => {
    it("returns 400 for invalid JSON", async () => {
      const req = new Request("http://localhost:3000/api/juspay/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "not-json",
      });
      const res = await POST(req as never);
      expect(res.status).toBe(400);
    });

    it("returns 400 when event_name is missing", async () => {
      const res = await POST(
        makeRequest({ content: MOCK_WEBHOOK_SUCCEEDED.content }) as never
      );
      expect(res.status).toBe(400);
    });

    it("returns 400 when content.order.order_id is missing", async () => {
      const res = await POST(
        makeRequest({
          event_name: "ORDER_SUCCEEDED",
          content: { order: {} },
        }) as never
      );
      expect(res.status).toBe(400);
    });
  });
});
