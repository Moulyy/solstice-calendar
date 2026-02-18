import { describe, expect, it, vi } from "vitest"

import { createDateTimePicker } from "@/date-time-picker"

describe("createDateTimePicker uncontrolled", () => {
  it("setDate and setTime update value while preserving the other part", () => {
    const picker = createDateTimePicker({ defaultValue: "2024-01-15T08:30" })

    picker.setDate("2024-01-20")
    expect(picker.getState().value).toBe("2024-01-20T08:30")

    picker.setTime("10:45")
    expect(picker.getState().value).toBe("2024-01-20T10:45")
  })

  it("uses standalone time when selecting a date without an existing value", () => {
    const picker = createDateTimePicker({ defaultTime: "09:00" })

    picker.setDate("2024-03-05")

    expect(picker.getState().value).toBe("2024-03-05T09:00")
    expect(picker.getState().selectedTime).toBe("09:00")
  })

  it("navigates months through next/previous actions", () => {
    const picker = createDateTimePicker({ defaultVisibleMonth: "2024-01-15" })

    picker.goToNextMonth()
    expect(picker.getState().visibleMonth).toBe("2024-02-15")

    picker.goToPrevMonth()
    expect(picker.getState().visibleMonth).toBe("2024-01-15")
  })
})

describe("createDateTimePicker controlled", () => {
  it("calls onValueChange without mutating internal value state", () => {
    const onValueChange = vi.fn()

    const picker = createDateTimePicker({
      value: "2024-01-10T10:00",
      onValueChange
    })

    picker.setDate("2024-01-12")

    expect(onValueChange).toHaveBeenCalledWith("2024-01-12T10:00")
    expect(picker.getState().value).toBe("2024-01-10T10:00")
  })

  it("calls onTimeChange in controlled time mode without mutating selectedTime", () => {
    const onTimeChange = vi.fn()

    const picker = createDateTimePicker({
      time: "11:00",
      onTimeChange
    })

    picker.setTime("12:30")

    expect(onTimeChange).toHaveBeenCalledWith("12:30")
    expect(picker.getState().selectedTime).toBe("11:00")
  })
})

describe("createDateTimePicker constraints", () => {
  it("clamps value updates to min/max constraints", () => {
    const picker = createDateTimePicker({
      constraints: {
        dateTime: { min: "2024-01-10T10:00", max: "2024-01-20T17:00" }
      }
    })

    picker.setValue("2024-01-01T08:00")
    expect(picker.getState().value).toBe("2024-01-10T10:00")

    picker.setValue("2024-01-25T20:00")
    expect(picker.getState().value).toBe("2024-01-20T17:00")
  })

  it("rejects disabled dates during setDate", () => {
    const picker = createDateTimePicker({
      defaultValue: "2024-01-09T10:00",
      constraints: {
        date: {
          isDateDisabled: (date) => date === "2024-01-10"
        }
      }
    })

    picker.setDate("2024-01-10")

    expect(picker.getState().value).toBe("2024-01-09T10:00")
  })
})
