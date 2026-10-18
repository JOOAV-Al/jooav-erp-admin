import { getOrderStatusStyles } from "@/lib/utils";

describe("getOrderStatusStyles", () => {
  it("shows 'Claimed' in the standard order-tag frame for a pending claim", () => {
    const styles = getOrderStatusStyles("PENDING_PAYMENT", "PENDING");
    expect(styles.text).toBe("Claimed");
    // Same frame as the other order status tags (Initiated, Confirmed, ...).
    expect(styles.styles).toContain("border-border-main");
    expect(styles.styles).toContain("bg-tag-queue");
  });

  it("keeps 'Initiated' when there is no pending claim", () => {
    expect(getOrderStatusStyles("PENDING_PAYMENT").text).toBe("Initiated");
    expect(getOrderStatusStyles("PENDING_PAYMENT", null).text).toBe("Initiated");
    expect(getOrderStatusStyles("PENDING_PAYMENT", "REJECTED").text).toBe(
      "Initiated",
    );
  });

  it("leaves other statuses untouched even when a claim is pending", () => {
    expect(getOrderStatusStyles("CONFIRMED", "PENDING").text).toBe("Confirmed");
    expect(getOrderStatusStyles("ASSIGNED").text).toBe("Assigned");
    expect(getOrderStatusStyles("").text).toBe("Draft");
  });
});
