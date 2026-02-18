import { describe, expect, it } from "vitest"

import {
  addDays,
  addMonths,
  compareCalendarDate,
  getCalendarGrid,
  getMonthEnd,
  getMonthStart,
  startOfWeek
} from "@/calendar-math"

describe("getMonthStart/getMonthEnd", () => {
  it("returns month bounds for leap year February", () => {
    expect(getMonthStart("2024-02-18")).toBe("2024-02-01")
    expect(getMonthEnd("2024-02-18")).toBe("2024-02-29")
  })

  it("returns month bounds for non-leap year February", () => {
    expect(getMonthStart("2023-02-18")).toBe("2023-02-01")
    expect(getMonthEnd("2023-02-18")).toBe("2023-02-28")
  })
})

describe("addMonths", () => {
  it("clamps day to target month end", () => {
    expect(addMonths("2024-01-31", 1)).toBe("2024-02-29")
    expect(addMonths("2023-01-31", 1)).toBe("2023-02-28")
  })

  it("handles backward month transitions", () => {
    expect(addMonths("2024-03-31", -1)).toBe("2024-02-29")
  })
})

describe("addDays", () => {
  it("handles leap day and month transitions", () => {
    expect(addDays("2024-02-28", 1)).toBe("2024-02-29")
    expect(addDays("2024-02-28", 2)).toBe("2024-03-01")
  })

  it("handles backward transitions across year boundaries", () => {
    expect(addDays("2024-01-01", -1)).toBe("2023-12-31")
  })
})

describe("startOfWeek", () => {
  it("supports Sunday as week start", () => {
    expect(startOfWeek("2024-05-15", 0)).toBe("2024-05-12")
  })

  it("supports Monday as week start", () => {
    expect(startOfWeek("2024-05-15", 1)).toBe("2024-05-13")
  })
})

describe("compareCalendarDate", () => {
  it("orders dates chronologically", () => {
    expect(compareCalendarDate("2024-01-01", "2024-01-02")).toBe(-1)
    expect(compareCalendarDate("2024-01-02", "2024-01-01")).toBe(1)
    expect(compareCalendarDate("2024-01-01", "2024-01-01")).toBe(0)
  })
})

describe("getCalendarGrid", () => {
  it("always returns 42 dates", () => {
    expect(getCalendarGrid("2024-05-15", 1)).toHaveLength(42)
  })

  it("returns a continuous sequence of dates", () => {
    const grid = getCalendarGrid("2024-05-15", 1)

    for (let i = 1; i < grid.length; i += 1) {
      const previousDate = grid[i - 1]
      const currentDate = grid[i]

      if (!previousDate || !currentDate) {
        throw new Error("Grid should contain only defined dates")
      }

      expect(currentDate).toBe(addDays(previousDate, 1))
    }
  })

  it("includes previous and next month dates correctly", () => {
    const mondayGrid = getCalendarGrid("2024-05-15", 1)
    expect(mondayGrid[0]).toBe("2024-04-29")
    expect(mondayGrid[41]).toBe("2024-06-09")

    const sundayGrid = getCalendarGrid("2024-05-15", 0)
    expect(sundayGrid[0]).toBe("2024-04-28")
  })
})
