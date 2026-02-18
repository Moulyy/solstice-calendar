import { describe, expect, it } from "vitest"

import { createDateTimePicker } from "@/date-time-picker"

describe("date-time picker clamp policy", () => {
  it("clamps setTime below min and above max when min/max are on same day", () => {
    const picker = createDateTimePicker({
      defaultValue: "2024-05-10T11:00",
      constraints: {
        dateTime: {
          min: "2024-05-10T10:00",
          max: "2024-05-10T12:00"
        }
      }
    })

    picker.setTime("09:30")
    expect(picker.getState().value).toBe("2024-05-10T10:00")

    picker.setTime("13:15")
    expect(picker.getState().value).toBe("2024-05-10T12:00")
  })

  it("setDate preserves time first, then clamps datetime when out of range", () => {
    const picker = createDateTimePicker({
      defaultValue: "2024-05-11T13:00",
      constraints: {
        dateTime: {
          min: "2024-05-10T10:00",
          max: "2024-05-12T12:00"
        }
      }
    })

    picker.setDate("2024-05-12")

    expect(picker.getState().value).toBe("2024-05-12T12:00")
  })
})
