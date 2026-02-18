import { describe, expect, it, vi } from "vitest"

import {
  createDateTimePicker,
  type DateTimeFormatter
} from "@/date-time-picker"
import {
  parseCalendarDate,
  parseLocalDateTime,
  parseLocalTime
} from "@/date-time"

describe("date-time picker public api lock", () => {
  it("getWeekdayLabels respects weekStartsOn", () => {
    const picker = createDateTimePicker({ weekStartsOn: 1 })

    expect(picker.getWeekdayLabels()).toEqual([
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun"
    ])
  })

  it("getMonthLabel uses the configured formatter", () => {
    const formatter: DateTimeFormatter = {
      formatDate: (date) => date,
      parseDate: (input) => parseCalendarDate(input),
      formatTime: (time) => time,
      parseTime: (input) => parseLocalTime(input),
      formatDateTime: (dateTime) => dateTime,
      parseDateTime: (input) => parseLocalDateTime(input),
      getMonthLabel: (visibleMonth) => `month:${visibleMonth}`,
      getWeekdayLabels: () => ["x"]
    }

    const picker = createDateTimePicker({
      defaultVisibleMonth: "2025-03-01",
      formatter
    })

    expect(picker.getMonthLabel()).toBe("month:2025-03-01")

    picker.goToNextMonth()

    expect(picker.getMonthLabel()).toBe("month:2025-04-01")
  })

  it("isSelectable helpers reflect min/max and disabled rules", () => {
    const picker = createDateTimePicker({
      defaultValue: "2024-01-10T11:00",
      constraints: {
        date: {
          minDate: "2024-01-10",
          maxDate: "2024-01-12",
          isDateDisabled: (date) => date === "2024-01-11"
        },
        time: {
          minTime: "10:00",
          maxTime: "12:00",
          isTimeDisabled: (time) => time === "11:30"
        },
        dateTime: {
          min: "2024-01-10T10:00",
          max: "2024-01-10T12:00",
          isDisabled: (dateTime) => dateTime === "2024-01-10T11:00"
        }
      }
    })

    expect(picker.isSelectableDate("2024-01-09")).toBe(false)
    expect(picker.isSelectableDate("2024-01-11")).toBe(false)
    expect(picker.isSelectableDate("2024-01-10")).toBe(true)

    expect(picker.isSelectableTime("09:30")).toBe(false)
    expect(picker.isSelectableTime("11:30")).toBe(false)
    expect(picker.isSelectableTime("10:30")).toBe(true)

    expect(picker.isSelectableDateTime("2024-01-10T09:59")).toBe(false)
    expect(picker.isSelectableDateTime("2024-01-10T11:00")).toBe(false)
    expect(picker.isSelectableDateTime("2024-01-10T12:00")).toBe(true)
  })

  it("uses custom formatter for input value formatting and parsing", () => {
    const formatDate = vi.fn((date: string) => `DATE:${date}`)
    const formatTime = vi.fn((time: string) => `TIME:${time}`)
    const formatDateTime = vi.fn((dateTime: string) => `DT:${dateTime}`)

    const parseDate = vi.fn((input: string) => {
      if (input.startsWith("DATE:")) {
        return parseCalendarDate(input.slice(5))
      }

      return null
    })

    const parseTime = vi.fn((input: string) => {
      if (input.startsWith("TIME:")) {
        return parseLocalTime(input.slice(5))
      }

      return null
    })

    const parseDateTime = vi.fn((input: string) => {
      if (input.startsWith("DT:")) {
        return parseLocalDateTime(input.slice(3))
      }

      return null
    })

    const formatter: DateTimeFormatter = {
      formatDate,
      parseDate,
      formatTime,
      parseTime,
      formatDateTime,
      parseDateTime,
      getMonthLabel: (visibleMonth) => visibleMonth,
      getWeekdayLabels: () => ["Mon"]
    }

    const picker = createDateTimePicker({
      defaultValue: "2024-01-10T10:00",
      formatter
    })

    expect(picker.getDateInputProps().value).toBe("DATE:2024-01-10")
    expect(picker.getTimeInputProps().value).toBe("TIME:10:00")
    expect(picker.getDateTimeInputProps().value).toBe("DT:2024-01-10T10:00")

    picker.getDateInputProps().onChange("DATE:2024-01-11")
    expect(picker.getState().value).toBe("2024-01-11T10:00")

    picker.getTimeInputProps().onChange("TIME:11:30")
    expect(picker.getState().value).toBe("2024-01-11T11:30")

    picker.getDateTimeInputProps().onChange("DT:2024-01-12T08:45")
    expect(picker.getState().value).toBe("2024-01-12T08:45")

    expect(formatDate).toHaveBeenCalled()
    expect(formatTime).toHaveBeenCalled()
    expect(formatDateTime).toHaveBeenCalled()
    expect(parseDate).toHaveBeenCalledWith("DATE:2024-01-11")
    expect(parseTime).toHaveBeenCalledWith("TIME:11:30")
    expect(parseDateTime).toHaveBeenCalledWith("DT:2024-01-12T08:45")
  })
})
