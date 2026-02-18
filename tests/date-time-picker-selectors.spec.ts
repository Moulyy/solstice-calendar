import { describe, expect, it } from "vitest"

import { createDateTimePicker } from "@/date-time-picker"

describe("date-time picker selectors", () => {
  it("reflects selected date/time and injected today", () => {
    const picker = createDateTimePicker({
      defaultValue: "2024-05-15T12:30",
      defaultVisibleMonth: "2024-05-01",
      nowDate: "2024-05-15"
    })

    const dayMeta = picker.getDayMeta("2024-05-15")
    expect(dayMeta.isSelectedDate).toBe(true)
    expect(dayMeta.isToday).toBe(true)
    expect(dayMeta.isCurrentMonth).toBe(true)

    const timeMeta = picker.getTimeMeta("12:30")
    expect(timeMeta.isSelectedTime).toBe(true)
    expect(timeMeta.isDisabledTime).toBe(false)
  })

  it("marks disabled date/time metadata from constraints", () => {
    const picker = createDateTimePicker({
      defaultValue: "2024-05-15T12:30",
      constraints: {
        date: {
          isDateDisabled: (date) => date === "2024-05-16"
        },
        time: {
          isTimeDisabled: (time) => time === "13:00"
        }
      }
    })

    expect(picker.getDayMeta("2024-05-16").isDisabledDate).toBe(true)
    expect(picker.getTimeMeta("13:00").isDisabledTime).toBe(true)
  })

  it("keeps calendar grid metadata coherent with datetime min/max", () => {
    const picker = createDateTimePicker({
      defaultValue: "2024-05-10T12:00",
      defaultVisibleMonth: "2024-05-01",
      nowDate: "2024-05-10",
      constraints: {
        dateTime: {
          min: "2024-05-10T10:00",
          max: "2024-05-10T14:00"
        }
      }
    })

    const grid = picker.getCalendarGrid()
    expect(grid).toHaveLength(42)

    const selectedCell = grid.find((cell) => cell.date === "2024-05-10")
    if (!selectedCell) {
      throw new Error("Expected selected cell to be present in calendar grid")
    }

    expect(selectedCell.isSelected).toBe(true)
    expect(selectedCell.isDisabled).toBe(false)
    expect(selectedCell.isToday).toBe(true)

    expect(picker.getDayMeta("2024-05-09").isDisabledDate).toBe(true)
    expect(picker.getDayMeta("2024-05-11").isDisabledDate).toBe(true)
    expect(picker.getDayMeta("2024-05-10").isDisabledDate).toBe(false)

    expect(picker.getTimeMeta("09:59").isDisabledTime).toBe(true)
    expect(picker.getTimeMeta("14:01").isDisabledTime).toBe(true)
    expect(picker.getTimeMeta("12:00").isDisabledTime).toBe(false)

    expect(picker.getDateTimeMeta("2024-05-10T09:59").isDisabledDateTime).toBe(true)
    expect(picker.getDateTimeMeta("2024-05-10T12:00").isDisabledDateTime).toBe(false)
  })
})
