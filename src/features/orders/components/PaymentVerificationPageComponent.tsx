"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import Spinner from "@/components/general/Spinner";
import { useConfirmOrderPayment } from "@/features/orders/services/orders.api";

export default function PaymentVerificationPageComponent() {
  const params = useSearchParams();
  const paymentReference = params.get("paymentReference");

  const { mutateAsync: confirmPayment } = useConfirmOrderPayment();

  //TODO: Replace wildcard with app domain
  useEffect(() => {
    const verify = async () => {
      if (!paymentReference) return;

      try {
        await confirmPayment({
          orderNumber: paymentReference,
        });

        // notify parent window (your app)
        window.parent.postMessage(
          {
            type: "PAYMENT_SUCCESS",
            orderNumber: paymentReference,
          },
          "*",
        );
      } catch (err) {
        console.error(err);

        window.parent.postMessage(
          {
            type: "PAYMENT_FAILED",
          },
          "*",
        );
      }
    };

    verify();
  }, [paymentReference]);

  return (
    <div className="flex bg-white! items-center justify-center min-h-200">
      <Spinner className="size-6" />
    </div>
  );
}
