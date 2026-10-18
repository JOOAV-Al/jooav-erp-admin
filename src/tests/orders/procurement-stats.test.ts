import { buildProcurementDisplayStats } from "@/features/orders/components/ProcurementOrderLogsPageComponent";
import { OrderStatsItem } from "@/features/orders/types";

const statsWithCounts = {
  summary: {
    pendingAcceptance: 2,
    processingOrders: 3,
    completedOrders: 1,
  },
} as unknown as OrderStatsItem;

describe("buildProcurementDisplayStats", () => {
  it("maps each backend summary count to its matching card", () => {
    expect(buildProcurementDisplayStats(statsWithCounts)).toEqual([
      { value: "2", label: "Pending" },
      { value: "3", label: "Processing" },
      { value: "1", label: "Completed" },
    ]);
  });

  it("falls back to zero when the counts are not available yet", () => {
    expect(buildProcurementDisplayStats(undefined)).toEqual([
      { value: "0", label: "Pending" },
      { value: "0", label: "Processing" },
      { value: "0", label: "Completed" },
    ]);
  });
});
