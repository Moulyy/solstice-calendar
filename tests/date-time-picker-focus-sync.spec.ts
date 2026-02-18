import { describe, expect, it, vi } from "vitest"

import { createDateTimePicker } from "@/date-time-picker"

describe("date-time picker focus and visibleMonth sync", () => {
  it("updates visibleMonth when moving focus right across month boundary", () => {
    const picker = createDateTimePicker({ defaultVisibleMonth: "2024-05-01" })

    picker.focusDate("2024-05-31")
    picker.moveFocusDate("right")

    expect(picker.getState().focusedDate).toBe("2024-06-01")
    expect(picker.getState().visibleMonth).toBe("2024-06-01")

    const currentMonthCells = picker
      .getCalendarGrid()
      .filter((cell) => cell.isCurrentMonth)
      .map((cell) => cell.date.slice(0, 7))

    expect(new Set(currentMonthCells)).toEqual(new Set(["2024-06"]))
  })

  it("updates visibleMonth when moving focus up outside current month", () => {
    const picker = createDateTimePicker({ defaultVisibleMonth: "2024-05-01" })

    picker.focusDate("2024-05-03")
    picker.moveFocusDate("up")

    expect(picker.getState().focusedDate).toBe("2024-04-26")
    expect(picker.getState().visibleMonth).toBe("2024-04-01")
  })

  it("keeps grid coherent after pageUp/pageDown focus navigation", () => {
    const picker = createDateTimePicker({ defaultVisibleMonth: "2024-05-01" })

    picker.focusDate("2024-05-15")
    picker.moveFocusDate("pageDown")

    expect(picker.getState().focusedDate).toBe("2024-06-15")
    expect(picker.getState().visibleMonth).toBe("2024-06-01")

    const juneGrid = picker.getCalendarGrid()
    expect(juneGrid.some((cell) => cell.date === "2024-06-15" && cell.isCurrentMonth)).toBe(
      true
    )

    picker.moveFocusDate("pageUp")

    expect(picker.getState().focusedDate).toBe("2024-05-15")
    expect(picker.getState().visibleMonth).toBe("2024-05-01")
  })

  it("uses callback in controlled visibleMonth mode when focus exits month", () => {
    const onVisibleMonthChange = vi.fn()

    const picker = createDateTimePicker({
      visibleMonth: "2024-05-01",
      onVisibleMonthChange
    })

    picker.focusDate("2024-05-31")
    picker.moveFocusDate("right")

    expect(onVisibleMonthChange).toHaveBeenCalledWith("2024-06-01")
  })
})
