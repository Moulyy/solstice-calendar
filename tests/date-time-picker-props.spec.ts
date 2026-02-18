import { describe, expect, it } from "vitest"

import { createDateTimePicker } from "@/date-time-picker"

describe("date-time picker prop-getters", () => {
  it("returns coherent day props and onPress updates date", () => {
    const picker = createDateTimePicker({
      defaultValue: "2024-05-10T11:00",
      constraints: {
        date: {
          isDateDisabled: (date) => date === "2024-05-12"
        }
      }
    })

    const selectedDayProps = picker.getDayProps("2024-05-10")
    expect(selectedDayProps["aria-selected"]).toBe(true)
    expect(selectedDayProps["aria-disabled"]).toBe(false)
    expect(selectedDayProps.tabIndex).toBe(0)

    const dayProps = picker.getDayProps("2024-05-09")
    expect(dayProps["aria-selected"]).toBe(false)
    expect(dayProps.tabIndex).toBe(-1)

    dayProps.onPress()
    expect(picker.getState().value).toBe("2024-05-09T11:00")

    const disabledDayProps = picker.getDayProps("2024-05-12")
    expect(disabledDayProps.disabled).toBe(true)
    expect(disabledDayProps["aria-disabled"]).toBe(true)

    disabledDayProps.onPress()
    expect(picker.getState().value).toBe("2024-05-09T11:00")
  })

  it("returns month navigation button props", () => {
    const picker = createDateTimePicker({ defaultVisibleMonth: "2024-01-15" })

    const nextButton = picker.getNextMonthButtonProps()
    const prevButton = picker.getPrevMonthButtonProps()

    expect(nextButton["aria-label"]).toBe("Next month")
    expect(prevButton["aria-label"]).toBe("Previous month")

    nextButton.onPress()
    expect(picker.getState().visibleMonth).toBe("2024-02-15")

    prevButton.onPress()
    expect(picker.getState().visibleMonth).toBe("2024-01-15")
  })

  it("maps primitive key strings in onKeyDown to focus movement and selection", () => {
    const picker = createDateTimePicker({ defaultTime: "09:00" })

    const dayProps = picker.getDayProps("2024-05-15")

    dayProps.onKeyDown?.("ArrowRight")
    expect(picker.getState().focusedDate).toBe("2024-05-16")

    dayProps.onKeyDown?.("Home")
    expect(picker.getState().focusedDate).toBe("2024-05-12")

    dayProps.onKeyDown?.("Enter")
    expect(picker.getState().value).toBe("2024-05-15T09:00")
  })

  it("returns input props that parse and apply values", () => {
    const picker = createDateTimePicker({ defaultValue: "2024-05-10T11:00" })

    const dateInput = picker.getDateInputProps()
    expect(dateInput.value).toBe("2024-05-10")
    dateInput.onChange("2024-05-11")
    expect(picker.getState().value).toBe("2024-05-11T11:00")

    const timeInput = picker.getTimeInputProps()
    expect(timeInput.value).toBe("11:00")
    timeInput.onChange("12:30")
    expect(picker.getState().value).toBe("2024-05-11T12:30")

    const dateTimeInput = picker.getDateTimeInputProps()
    expect(dateTimeInput.value).toBe("2024-05-11T12:30")
    dateTimeInput.onChange("2024-05-12T08:45")
    expect(picker.getState().value).toBe("2024-05-12T08:45")

    dateInput.onChange("2024-5-1")
    timeInput.onChange("8:00")
    dateTimeInput.onChange("2024-05-12 08:45")

    expect(picker.getState().value).toBe("2024-05-12T08:45")
  })
})
