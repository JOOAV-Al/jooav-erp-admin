import {
  resolveInitialStatusFilter,
  resolveOrderListFilters,
} from "@/features/orders/services/helpers";

describe("resolveOrderListFilters", () => {
  it("passes plain statuses through without a claim filter", () => {
    expect(resolveOrderListFilters("PENDING_PAYMENT")).toEqual({
      status: "PENDING_PAYMENT",
      paymentClaimStatus: undefined,
    });
    expect(resolveOrderListFilters("ASSIGNED")).toEqual({
      status: "ASSIGNED",
      paymentClaimStatus: undefined,
    });
  });

  it("returns no filters for the All chip", () => {
    expect(resolveOrderListFilters("")).toEqual({
      status: undefined,
      paymentClaimStatus: undefined,
    });
  });
});

describe("resolveInitialStatusFilter", () => {
  it("accepts known filter tokens from a deep link", () => {
    expect(resolveInitialStatusFilter("PENDING_PAYMENT")).toBe(
      "PENDING_PAYMENT",
    );
  });

  it("rejects unknown or missing tokens", () => {
    // CLAIM_PENDING moved to its own page: /dashboard/payment-confirmation
    expect(resolveInitialStatusFilter("CLAIM_PENDING")).toBe("");
    expect(resolveInitialStatusFilter("GARBAGE")).toBe("");
    expect(resolveInitialStatusFilter(null)).toBe("");
    expect(resolveInitialStatusFilter(undefined)).toBe("");
    expect(resolveInitialStatusFilter("")).toBe("");
  });
});
