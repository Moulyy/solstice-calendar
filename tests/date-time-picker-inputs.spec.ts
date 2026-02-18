import { describe, expect, it } from "vitest"

import { createDateTimePicker } from "@/date-time-picker"

describe("date-time picker input behavior", () => {
  it("supports empty values for date, time and datetime inputs", () => {
    const byDate = createDateTimePicker({ defaultValue: "2024-05-10T11:00" })
    byDate.getDateInputProps().onChange("")
    expect(byDate.getState().value).toBeNull()

    const byTime = createDateTimePicker({ defaultValue: "2024-05-10T11:00" })
    byTime.getTimeInputProps().onChange("")
    expect(byTime.getState().value).toBeNull()

    const byDateTime = createDateTimePicker({ defaultValue: "2024-05-10T11:00" })
    byDateTime.getDateTimeInputProps().onChange("")
    expect(byDateTime.getState().value).toBeNull()
  })

  it("keeps invalid text and marks aria-invalid", () => {
    const picker = createDateTimePicker({ defaultValue: "2024-05-10T11:00" })

    picker.getDateInputProps().onChange("2024-1-01")

    const dateInput = picker.getDateInputProps()
    expect(dateInput.value).toBe("2024-1-01")
    expect(dateInput["aria-invalid"]).toBe(true)
    expect(picker.getState().value).toBe("2024-05-10T11:00")
  })

  it("reverts invalid date input to last valid value on blur", () => {
    const picker = createDateTimePicker({ defaultValue: "2024-05-10T11:00" })

    picker.getDateInputProps().onChange("2024-1-01")
    picker.getDateInputProps().onBlur?.()

    const dateInput = picker.getDateInputProps()
    expect(dateInput.value).toBe("2024-05-10")
    expect(dateInput["aria-invalid"]).toBeUndefined()
  })

  it("commits valid values and clears aria-invalid", () => {
    const picker = createDateTimePicker({ defaultValue: "2024-05-10T11:00" })

    picker.getDateInputProps().onChange("2024-05-11")

    const dateInput = picker.getDateInputProps()
    expect(picker.getState().value).toBe("2024-05-11T11:00")
    expect(dateInput.value).toBe("2024-05-11")
    expect(dateInput["aria-invalid"]).toBeUndefined()
  })
})
