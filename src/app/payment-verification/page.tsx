"use client";

import { Suspense } from "react";
import PaymentVerificationPageComponent from "@/features/orders/components/PaymentVerificationPageComponent";

export default function PaymentVerificationPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentVerificationPageComponent />
      </Suspense>
    </div>
  );
}
