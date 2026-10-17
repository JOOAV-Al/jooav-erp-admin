"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useRejectPaymentClaim } from "@/features/orders/services/orders.api";
import { Order } from "@/features/orders/types";
import { formatOrderDateTime } from "@/lib/utils";

interface PaymentClaimReviewProps {
  order: Order;
  onUpdated?: (order: Order) => void;
}

/**
 * "I have made payment" claim notice for manual-payment orders.
 * Confirming the payment is done through the drawer's primary
 * (Confirm payment) button; this box only surfaces the claim and
 * handles rejection.
 */
const PaymentClaimReview = ({ order, onUpdated }: PaymentClaimReviewProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState("");
  const { mutateAsync: rejectClaim, isPending: rejecting } =
    useRejectPaymentClaim();

  // Legacy orders predate the channel field; a null channel without a Monnify
  // reference was paid manually (mirrors the backend fallback).
  const isManualOrder =
    order.paymentChannel === "MANUAL" ||
    (!order.paymentChannel && !order.monnifyInvoiceRef);

  if (!isManualOrder) return null;

  if (order.paymentClaimStatus === "REJECTED") {
    return (
      <div className="mb-main rounded-2xl border border-border-main bg-storey-foreground px-main py-md flex flex-col gap-2">
        <span className="text-[13px] font-mono uppercase tracking-[0.08em] text-body-passive">
          Payment claim rejected
        </span>
        <p className="text-[13px] font-medium leading-[1.5] text-body-passive">
          {order.paymentClaimRejectionReason ??
            "The payment could not be verified."}{" "}
          The customer can submit a new claim.
        </p>
      </div>
    );
  }

  if (order.paymentClaimStatus !== "PENDING") return null;

  const handleReject = async () => {
    const res = await rejectClaim({
      orderNumber: order.orderNumber,
      reason: reason.trim() || undefined,
    });
    const updated = res.data?.data;
    if (updated) onUpdated?.(updated);
    setDialogOpen(false);
    setReason("");
  };

  return (
    <>
      <div className="mb-main rounded-2xl border border-border-main bg-storey-foreground px-main py-md flex items-start justify-between gap-main flex-wrap">
        <div className="flex items-start gap-main">
          <AlertTriangle className="mt-0.5 size-5 text-outline-passive" />
          <div className="flex flex-col gap-2">
            <span className="text-[14px] font-semibold text-body">
              Customer claims payment has been made
            </span>
            <p className="text-[13px] font-medium leading-[1.5] text-body-passive">
              Claimed {formatOrderDateTime(order.paymentClaimedAt ?? order.createdAt)}.
              Confirm below if the payment has landed, or reject so the customer
              can try again.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="neutral"
          size="neutral"
          onClick={() => setDialogOpen(true)}
        >
          Reject claim
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader className="hidden">
            <DialogTitle>Reject payment claim</DialogTitle>
            <DialogDescription>
              The customer can submit a new claim afterwards.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-md">
            <div className="flex flex-col gap-0">
              <div className="py-sm gap-2">
                <h4>Reject payment claim</h4>
              </div>
              <div className="py-sm gap-6">
                <p className="text-body-passive leading-[1.5] tracking-[0.03] text-[15px] font-medium">
                  Tell the customer why the payment could not be verified. Leave
                  this blank to use the default message.
                </p>
              </div>
            </div>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              placeholder="e.g. Transfer reference not found on our account"
            />
            <div className="flex items-center justify-end gap-main">
              <DialogClose asChild>
                <Button
                  disabled={rejecting}
                  size={"neutral"}
                  variant={"ghost"}
                  className="text-[15px] text-secondary-foreground tracking-[0.02em] leading-[1] hover:no-underline"
                >
                  <span className="py-4 px-2">Cancel</span>
                </Button>
              </DialogClose>

              <Button
                onClick={handleReject}
                type="button"
                disabled={rejecting}
                size={"neutral"}
                className="text-[15px] bg-destructive tracking-[0.02em] leading-[1] shadow-input hover:bg-destructive/80"
              >
                {rejecting && <Spinner color="white" />}
                <span className="py-4 px-2">
                  {rejecting ? "Rejecting..." : "Reject claim"}
                </span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentClaimReview;
