"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { Check, XCircle, Loader2, AlertCircle } from "lucide-react";

type JuspayParams = {
  order_id: string;
  status: string;
  status_id: string;
  signature: string;
  signature_algorithm: string;
};

type VerifyResult = {
  orderId: string;
  status: string;
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  verified: boolean;
  error?: string;
};

function PaymentReturnContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Raw params sent by Juspay in the redirect URL
  const juspayParams: JuspayParams = {
    order_id: searchParams.get("order_id") ?? "",
    status: searchParams.get("status") ?? "",
    status_id: searchParams.get("status_id") ?? "",
    signature: searchParams.get("signature") ?? "",
    signature_algorithm: searchParams.get("signature_algorithm") ?? "",
  };

  useEffect(() => {
    const { order_id } = juspayParams;

    if (!order_id) {
      setError("No order information received from the payment gateway.");
      return;
    }

    // customerId resolved server-side from the order store — no localStorage needed
    fetch(`/api/verify-payment?orderId=${encodeURIComponent(order_id)}`)
      .then((res) => res.json())
      .then((data: VerifyResult) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setResult(data);
        if (data.status === "CHARGED") {
          clearCart();
        }
      })
      .catch(() =>
        setError("Could not verify your payment. Please contact support.")
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Juspay redirect params debug panel ────────────────────────────────────
  const JuspayRedirectInfo = () => (
    <div className="mt-8 w-full max-w-lg mx-auto text-left bg-stone-50 border border-stone-200 rounded-xl p-4">
      <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">
        Juspay redirect params
      </p>
      <table className="w-full text-xs font-mono">
        <tbody>
          {Object.entries(juspayParams).map(([key, val]) => (
            <tr key={key} className="border-t border-stone-100 first:border-0">
              <td className="py-1.5 pr-4 text-stone-400 whitespace-nowrap">{key}</td>
              <td className="py-1.5 text-stone-700 break-all">{val || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // ── Loading ────────────────────────────────────────────────────────────────
  if (!result && !error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 size={40} className="animate-spin text-stone-400 mb-4" />
        <p className="text-stone-500 text-sm">Verifying your payment…</p>
        <JuspayRedirectInfo />
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={36} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-3">Verification Failed</h1>
          <p className="text-stone-500 text-sm mb-8">{error}</p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/checkout"
              className="bg-stone-900 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-stone-800 transition-colors"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="border border-stone-200 text-stone-700 px-6 py-3 rounded-full font-semibold text-sm hover:border-stone-400 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
        <JuspayRedirectInfo />
      </div>
    );
  }

  const isCharged = result?.status === "CHARGED";
  const isPending = result?.status === "PENDING" || result?.status === "AUTHORIZING";

  // ── Success / Pending / Failed ─────────────────────────────────────────────
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        {isCharged ? (
          <>
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={36} className="text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-stone-900 mb-3">Payment Successful!</h1>
            <p className="text-stone-500 text-sm mb-2">
              Order <span className="font-mono font-semibold text-stone-700">{result?.orderId}</span>
            </p>
            {result?.amount !== undefined && (
              <p className="text-stone-500 text-sm mb-8">
                Amount paid: <strong>₹{result.amount} {result.currency ?? "INR"}</strong>
              </p>
            )}
            <Link
              href="/"
              className="bg-stone-900 text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-stone-800 transition-colors inline-block"
            >
              Continue Shopping
            </Link>
          </>
        ) : isPending ? (
          <>
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 size={36} className="text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-stone-900 mb-3">Payment Pending</h1>
            <p className="text-stone-500 text-sm mb-8">
              Order <span className="font-mono font-semibold">{result?.orderId}</span> is being processed.
              We&apos;ll update you once confirmed.
            </p>
            <Link href="/" className="bg-stone-900 text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-stone-800 transition-colors inline-block">
              Go Home
            </Link>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle size={36} className="text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-stone-900 mb-3">Payment Failed</h1>
            <p className="text-stone-500 text-sm mb-2">
              Status: <span className="font-semibold">{result?.status ?? "FAILED"}</span>
            </p>
            <p className="text-stone-500 text-sm mb-8">Please try again or use a different payment method.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/checkout" className="bg-stone-900 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-stone-800 transition-colors">
                Try Again
              </Link>
              <Link href="/" className="border border-stone-200 text-stone-700 px-6 py-3 rounded-full font-semibold text-sm hover:border-stone-400 transition-colors">
                Go Home
              </Link>
            </div>
          </>
        )}
      </div>

      <JuspayRedirectInfo />
    </div>
  );
}

export default function PaymentReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 size={40} className="animate-spin text-stone-400" />
        </div>
      }
    >
      <PaymentReturnContent />
    </Suspense>
  );
}
