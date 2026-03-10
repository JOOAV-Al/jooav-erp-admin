// import Spinner from "@/components/general/Spinner";
// import { Button } from "@/components/ui/button";
// import { useConfirmOrderPayment } from "@/features/orders/services/orders.api";
// import { OrderVirtualAccount } from "@/features/orders/types";
// import { Send } from "lucide-react";
// import React from "react";

// const PaymentScreen = ({
//   virtualAccount,
//   orderNumber,
//   loading,
//   onConfirmPayment,
// }: {
//   virtualAccount?: OrderVirtualAccount;
//   orderNumber: string;
//   loading?: boolean;
//   onConfirmPayment?: () => void;
// }) => {
//   console.log(virtualAccount);
//   return (
//     <div className="flex justify-center items-center p-md min-h-[calc(90vh-24px)]">
//       <div className="py-sm gap-main flex flex-col">
//         <div className={`flex flex-col gap-5 ${`py-sm`}`}>
//           <h4 className="leading-[1.2] tracking-[0.01em]">
//             Complete Order Payment
//           </h4>
//           <p className="text-body-passive text-[15px] font-medium leading-normal tracking-[0.03em]">
//             {"Make transfer to the account provided below"}
//           </p>

//           <div className="flex flex-col gap-4">
//             <h2>{virtualAccount?.accountNumber}</h2>
//             <p>{virtualAccount?.bankName}</p>
//             <p>{virtualAccount?.accountName}</p>
//           </div>
//         </div>
//         <Button
//           type={"button"}
//           size={"neutral"}
//           variant="input"
//           onClick={onConfirmPayment}
//           className="shadow-input! font-semibold w-fit"
//           disabled={loading}
//         >
//           <span className="px-2"><Send  className="text-outline"/></span>
//           <span className="px-2 py-4 text-[#FF803F] text-[15px]">
//             I have made payment
//           </span>
//           {loading && <Spinner className="size-4" color="#FF803F" />}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default PaymentScreen;

// import Spinner from "@/components/general/Spinner";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useState } from "react";

// const PaymentScreen = ({
//   checkoutUrl,
// }: {
//   checkoutUrl?: string;
//   setOpen?: () => void;
// }) => {
//   const [iframeLoading, setIframeLoading] = useState(true);

//   return (
//     <ScrollArea isSidebar className="h-120 flex-1">
//       <div className="relative w-full rounded-lg border">
//         {/* Loader */}
//         {iframeLoading && (
//           <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
//             <Spinner className="size-6" />
//           </div>
//         )}

//         <div className="h-200">
//           <iframe
//             src={checkoutUrl}
//             title="Monnify Checkout"
//             className="w-full h-full border-none"
//             onLoad={() => setIframeLoading(false)}
//           />
//         </div>
//       </div>
//     </ScrollArea>
//   );
// };

// export default PaymentScreen;

"use client";

import Spinner from "@/components/general/Spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";

const PaymentScreen = ({
  checkoutUrl,
  setOpen,
  refetch,
  setFormView,
}: {
  checkoutUrl?: string;
  setOpen?: (open: boolean) => void;
  refetch?: () => void
  setFormView?: (view: "form" | "order-list" | "payment") => void
}) => {
  const [iframeLoading, setIframeLoading] = useState(true);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "PAYMENT_SUCCESS") {
        setTimeout(() => {
          setOpen?.(false);
        }, 2000);
        refetch?.()
      } 
      if (event.data?.type === "PAYMENT_FAILED") {
        // setTimeout(() => {
        //   setOpen?.(false);
        // }, 2000);
        setFormView?.("order-list")
        refetch?.()
      } 
      
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, [setOpen]);

  return (
    <ScrollArea isSidebar className="h-120 flex-1">
      <div className="relative w-full rounded-lg border">
        {/* Loader */}
        {iframeLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <Spinner className="size-6" />
          </div>
        )}

        <div className="flex-1 h-200">
          <iframe
            src={checkoutUrl}
            title="Monnify Checkout"
            className="w-full h-full border-none"
            onLoad={() => setIframeLoading(false)}
          />
        </div>
      </div>
    </ScrollArea>
  );
};

export default PaymentScreen;
