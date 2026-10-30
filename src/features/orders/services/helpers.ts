// Status chips the orders page supports, including the ?status= deep link.
export const ORDER_STATUS_FILTERS = [
  "DRAFT",
  "PENDING_PAYMENT",
  "ASSIGNED",
  "IN_PROGRESS",
  "CANCELLED",
] as const;

export const resolveOrderListFilters = (statusFilter: string) => {
  return {
    status: statusFilter || undefined,
    paymentClaimStatus: undefined,
  };
};

/** Only known tokens from a deep link may preselect a status filter. */
export const resolveInitialStatusFilter = (status?: string | null) =>
  status && (ORDER_STATUS_FILTERS as readonly string[]).includes(status)
    ? status
    : "";
