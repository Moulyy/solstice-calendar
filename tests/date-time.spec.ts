import { describe, expect, it } from "vitest"

import {
  combineLocalDateTime,
  formatCalendarDate,
  formatLocalDateTime,
  formatLocalTime,
  fromDateParts,
  fromTimeParts,
  parseCalendarDate,
  parseLocalDateTime,
  parseLocalTime,
  splitLocalDateTime,
  toDateParts,
  toTimeParts
} from "@/date-time"

describe("parseCalendarDate", () => {
  it("accepts valid dates including leap years", () => {
    expect(parseCalendarDate("2024-02-29")).toBe("2024-02-29")
    expect(parseCalendarDate("2023-02-28")).toBe("2023-02-28")
  })

  it("rejects invalid leap years and invalid bounds", () => {
    expect(parseCalendarDate("2023-02-29")).toBeNull()
    expect(parseCalendarDate("2024-04-31")).toBeNull()
    expect(parseCalendarDate("2024-13-01")).toBeNull()
    expect(parseCalendarDate("2024-00-10")).toBeNull()
    expect(parseCalendarDate("2024-01-00")).toBeNull()
  })

  it("enforces strict zero-padded format", () => {
    expect(parseCalendarDate("2024-2-09")).toBeNull()
    expect(parseCalendarDate("2024-02-9")).toBeNull()
    expect(parseCalendarDate("24-02-09")).toBeNull()
  })
})

describe("date parts conversion", () => {
  it("formats and parses date parts", () => {
    expect(formatCalendarDate({ y: 2025, m: 1, d: 2 })).toBe("2025-01-02")
    expect(fromDateParts({ y: 1999, m: 12, d: 31 })).toBe("1999-12-31")
    expect(toDateParts("2030-11-07")).toEqual({ y: 2030, m: 11, d: 7 })
  })

  it("returns null for invalid date parts", () => {
    expect(formatCalendarDate({ y: 2021, m: 2, d: 29 })).toBeNull()
    expect(fromDateParts({ y: 2020, m: 15, d: 1 })).toBeNull()
  })
})

describe("parseLocalTime", () => {
  it("accepts valid time bounds", () => {
    expect(parseLocalTime("00:00")).toBe("00:00")
    expect(parseLocalTime("23:59")).toBe("23:59")
  })

  it("rejects invalid hour and minute bounds", () => {
    expect(parseLocalTime("24:00")).toBeNull()
    expect(parseLocalTime("-1:30")).toBeNull()
    expect(parseLocalTime("23:60")).toBeNull()
  })

  it("enforces strict zero-padded format", () => {
    expect(parseLocalTime("9:05")).toBeNull()
    expect(parseLocalTime("09:5")).toBeNull()
  })
})

describe("time parts conversion", () => {
  it("formats and parses time parts", () => {
    expect(formatLocalTime({ h: 9, min: 5 })).toBe("09:05")
    expect(fromTimeParts({ h: 12, min: 45 })).toBe("12:45")
    expect(toTimeParts("07:08")).toEqual({ h: 7, min: 8 })
  })

  it("returns null for invalid time parts", () => {
    expect(formatLocalTime({ h: 24, min: 0 })).toBeNull()
    expect(fromTimeParts({ h: 11, min: 60 })).toBeNull()
  })
})

describe("parseLocalDateTime", () => {
  it("accepts strict valid datetime format", () => {
    expect(parseLocalDateTime("2024-02-29T23:59")).toBe("2024-02-29T23:59")
  })

  it("rejects invalid date, time, separator and padding", () => {
    expect(parseLocalDateTime("2023-02-29T23:59")).toBeNull()
    expect(parseLocalDateTime("2024-01-01T24:00")).toBeNull()
    expect(parseLocalDateTime("2024-01-01 12:00")).toBeNull()
    expect(parseLocalDateTime("2024-1-01T12:00")).toBeNull()
    expect(parseLocalDateTime("2024-01-01T2:00")).toBeNull()
  })
})

describe("datetime composition", () => {
  it("splits and combines datetime values", () => {
    expect(splitLocalDateTime("2024-10-03T14:20")).toEqual({
      date: "2024-10-03",
      time: "14:20"
    })

    expect(combineLocalDateTime("2024-10-03", "14:20")).toBe(
      "2024-10-03T14:20"
    )

    expect(formatLocalDateTime({ date: "2024-10-03", time: "14:20" })).toBe(
      "2024-10-03T14:20"
    )
  })
})
