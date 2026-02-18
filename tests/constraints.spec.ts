import { describe, expect, it } from "vitest"

import type { CalendarDate, LocalDateTime, LocalTime } from "@/date-time"
import {
  clampDateTimeToConstraints,
  clampDateToConstraints,
  clampTimeToConstraints,
  isSelectableDate,
  isSelectableDateTime,
  isSelectableTime,
  isWithinMinMaxDate,
  isWithinMinMaxDateTime,
  isWithinMinMaxTime
} from "@/constraints"
import type { Constraints } from "@/constraints"

describe("date min/max constraints", () => {
  it("checks inclusive date boundaries", () => {
    const constraints = { minDate: "2024-01-10", maxDate: "2024-01-20" } as const

    expect(isWithinMinMaxDate("2024-01-10", constraints)).toBe(true)
    expect(isWithinMinMaxDate("2024-01-20", constraints)).toBe(true)
    expect(isWithinMinMaxDate("2024-01-09", constraints)).toBe(false)
    expect(isWithinMinMaxDate("2024-01-21", constraints)).toBe(false)
  })

  it("clamps dates to the date boundaries", () => {
    const constraints = { minDate: "2024-01-10", maxDate: "2024-01-20" } as const

    expect(clampDateToConstraints("2024-01-05", constraints)).toBe("2024-01-10")
    expect(clampDateToConstraints("2024-01-25", constraints)).toBe("2024-01-20")
    expect(clampDateToConstraints("2024-01-15", constraints)).toBe("2024-01-15")
  })
})

describe("time min/max constraints", () => {
  it("checks inclusive time boundaries", () => {
    const constraints = { minTime: "09:15", maxTime: "17:45" } as const

    expect(isWithinMinMaxTime("09:15", constraints)).toBe(true)
    expect(isWithinMinMaxTime("17:45", constraints)).toBe(true)
    expect(isWithinMinMaxTime("09:14", constraints)).toBe(false)
    expect(isWithinMinMaxTime("17:46", constraints)).toBe(false)
  })

  it("clamps times to the time boundaries", () => {
    const constraints = { minTime: "09:15", maxTime: "17:45" } as const

    expect(clampTimeToConstraints("08:30", constraints)).toBe("09:15")
    expect(clampTimeToConstraints("18:00", constraints)).toBe("17:45")
    expect(clampTimeToConstraints("12:30", constraints)).toBe("12:30")
  })
})

describe("datetime min/max constraints", () => {
  it("checks inclusive datetime boundaries", () => {
    const constraints = {
      min: "2024-06-10T10:00",
      max: "2024-06-10T14:00"
    } as const

    expect(isWithinMinMaxDateTime("2024-06-10T10:00", constraints)).toBe(true)
    expect(isWithinMinMaxDateTime("2024-06-10T14:00", constraints)).toBe(true)
    expect(isWithinMinMaxDateTime("2024-06-10T09:59", constraints)).toBe(false)
    expect(isWithinMinMaxDateTime("2024-06-10T14:01", constraints)).toBe(false)
  })

  it("clamps datetime with date/time and datetime boundaries", () => {
    const constraints = {
      date: { minDate: "2024-01-10", maxDate: "2024-01-20" },
      time: { minTime: "09:00", maxTime: "18:00" },
      dateTime: { min: "2024-01-10T10:00", max: "2024-01-20T17:00" }
    } as const

    expect(clampDateTimeToConstraints("2024-01-01T08:00", constraints)).toBe(
      "2024-01-10T10:00"
    )

    expect(clampDateTimeToConstraints("2024-01-25T22:00", constraints)).toBe(
      "2024-01-20T17:00"
    )

    expect(clampDateTimeToConstraints("2024-01-12T12:00", constraints)).toBe(
      "2024-01-12T12:00"
    )
  })
})

describe("selectability rules", () => {
  it("lets disabled predicates override min/max checks", () => {
    const constraints = {
      date: {
        minDate: "2024-01-01",
        maxDate: "2024-01-31",
        isDateDisabled: (date: CalendarDate) => date === "2024-01-10"
      },
      time: {
        minTime: "09:00",
        maxTime: "18:00",
        isTimeDisabled: (time: LocalTime) => time === "12:00"
      },
      dateTime: {
        min: "2024-01-10T09:00",
        max: "2024-01-10T18:00",
        isDisabled: (dateTime: LocalDateTime) => dateTime === "2024-01-10T15:00"
      }
    } satisfies Constraints

    expect(isSelectableDate("2024-01-10", constraints)).toBe(false)
    expect(isSelectableTime("12:00", constraints)).toBe(false)
    expect(isSelectableDateTime("2024-01-10T15:00", constraints)).toBe(false)
  })

  it("combines date/time/datetime constraints for selectability", () => {
    const constraints = {
      date: { minDate: "2024-01-10", maxDate: "2024-01-10" },
      time: { minTime: "10:00", maxTime: "14:00" },
      dateTime: { min: "2024-01-10T10:00", max: "2024-01-10T14:00" }
    } as const

    expect(isSelectableDateTime("2024-01-10T10:00", constraints)).toBe(true)
    expect(isSelectableDateTime("2024-01-10T14:00", constraints)).toBe(true)
    expect(isSelectableDateTime("2024-01-10T09:59", constraints)).toBe(false)
    expect(isSelectableDateTime("2024-01-10T14:01", constraints)).toBe(false)
  })
})
