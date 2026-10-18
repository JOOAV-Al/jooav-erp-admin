import { getOrderStatusStyles } from "@/lib/utils";

describe("getOrderStatusStyles", () => {
  it("shows 'Payment claimed' for pending-payment orders with a pending claim", () => {
    const styles = getOrderStatusStyles("PENDING_PAYMENT", "PENDING");
    expect(styles.text).toBe("Payment claimed");
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
