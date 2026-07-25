import { formatCalendarDate } from "../date";

describe("formatCalendarDate", () => {
  it("formats standard YYYY-MM-DD strings correctly", () => {
    expect(formatCalendarDate("2026-07-28")).toBe("Jul 28, 2026");
    expect(formatCalendarDate("2026-01-01")).toBe("Jan 1, 2026");
    expect(formatCalendarDate("2026-12-31")).toBe("Dec 31, 2026");
  });

  it("handles single-digit month and day formats correctly", () => {
    expect(formatCalendarDate("2026-7-8")).toBe("Jul 8, 2026");
    expect(formatCalendarDate("2026-05-9")).toBe("May 9, 2026");
  });

  it("returns fallback strings when format is invalid", () => {
    expect(formatCalendarDate("invalid-date")).toBe("invalid-date");
    expect(formatCalendarDate("")).toBe("—");
    expect(formatCalendarDate("2026-13-01")).toBe("2026-13-01"); // Invalid month name index
  });
});
