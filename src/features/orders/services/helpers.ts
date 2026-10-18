// Status chips the orders page supports, including the ?status= deep link.
export const ORDER_STATUS_FILTERS = [
  "DRAFT",
  "PENDING_PAYMENT",
  "CLAIM_PENDING",
  "ASSIGNED",
  "IN_PROGRESS",
  "CANCELLED",
] as const;

/**
 * Claims awaiting review are a sub-state of PENDING_PAYMENT, so the
 * "Claimed payments" chip maps to both an order status and a claim status.
 */
export const resolveOrderListFilters = (statusFilter: string) => {
  const isClaimReview = statusFilter === "CLAIM_PENDING";

  return {
    status: isClaimReview ? "PENDING_PAYMENT" : statusFilter || undefined,
    paymentClaimStatus: isClaimReview ? "PENDING" : undefined,
  };
};

/** Only known tokens from a deep link may preselect a status filter. */
export const resolveInitialStatusFilter = (status?: string | null) =>
  status && (ORDER_STATUS_FILTERS as readonly string[]).includes(status)
    ? status
    : "";
