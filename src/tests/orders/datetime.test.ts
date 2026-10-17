import { formatOrderDateTime } from "@/lib/utils";

describe("formatOrderDateTime", () => {
  it("renders date and time for a valid ISO timestamp", () => {
    const out = formatOrderDateTime("2026-10-17T14:42:00.000Z");
    expect(out).toMatch(/^\d{2}\/\d{2}\/\d{4}, \d{1,2}:\d{2} (AM|PM)$/);
  });

  it("falls back to the raw value for invalid input", () => {
    expect(formatOrderDateTime("not-a-date")).toBe("not-a-date");
  });
});
