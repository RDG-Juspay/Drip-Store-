import "@testing-library/jest-dom";

// Environment variables for tests (mirrors .env.local values)
process.env.JUSPAY_API_KEY = process.env.JUSPAY_API_KEY ?? "TEST_API_KEY";
process.env.JUSPAY_MERCHANT_ID = process.env.JUSPAY_MERCHANT_ID ?? "iimkashipur";
process.env.JUSPAY_CLIENT_ID = process.env.JUSPAY_CLIENT_ID ?? "iimkashipur";
process.env.JUSPAY_BASE_URL = process.env.JUSPAY_BASE_URL ?? "https://sandbox.juspay.in";
process.env.NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// Polyfill Web APIs for Node.js 14 which lacks them natively.
import { fetch, Request, Response, Headers } from "cross-fetch";
global.fetch = fetch as typeof global.fetch;
global.Request = Request as typeof global.Request;
global.Response = Response as typeof global.Response;
global.Headers = Headers as typeof global.Headers;

// Response.json() static method — added to the Fetch spec after cross-fetch was written.
if (typeof (Response as unknown as { json?: unknown }).json !== "function") {
  (Response as unknown as { json: Function }).json = function (
    data: unknown,
    init?: ResponseInit
  ) {
    return new Response(JSON.stringify(data), {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...((init as { headers?: Record<string, string> })?.headers ?? {}),
      },
    });
  };
}
