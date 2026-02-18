import { describe, expect, it } from "vitest"

import { createDateTimePicker } from "@/date-time-picker"
import { getTimeOptions, roundTimeToStep } from "@/time-options"

describe("roundTimeToStep", () => {
  it("rounds time with floor/ceil/nearest modes", () => {
    expect(roundTimeToStep("10:07", 15, "floor")).toBe("10:00")
    expect(roundTimeToStep("10:07", 15, "ceil")).toBe("10:15")
    expect(roundTimeToStep("10:07", 15, "nearest")).toBe("10:00")
  })
})

describe("getTimeOptions", () => {
  it("returns step-based list", () => {
    expect(getTimeOptions({ stepMinutes: 15, end: "01:00" })).toEqual([
      "00:00",
      "00:15",
      "00:30",
      "00:45",
      "01:00"
    ])
  })

  it("respects minTime and maxTime", () => {
    expect(
      getTimeOptions({
        stepMinutes: 15,
        constraints: { minTime: "09:10", maxTime: "10:00" }
      })
    ).toEqual(["09:15", "09:30", "09:45", "10:00"])
  })

  it("respects isTimeDisabled", () => {
    expect(
      getTimeOptions({
        stepMinutes: 30,
        start: "09:00",
        end: "11:00",
        constraints: {
          isTimeDisabled: (time) => time === "10:00"
        }
      })
    ).toEqual(["09:00", "09:30", "10:30", "11:00"])
  })
})

describe("getTimeOptionProps", () => {
  it("prevents setTime when option is disabled", () => {
    const picker = createDateTimePicker({
      defaultValue: "2024-05-10T09:00",
      constraints: {
        time: {
          isTimeDisabled: (time) => time === "10:00"
        }
      }
    })

    const disabledOption = picker.getTimeOptionProps("10:00")
    expect(disabledOption.disabled).toBe(true)
    expect(disabledOption["aria-disabled"]).toBe(true)

    disabledOption.onPress()
    expect(picker.getState().value).toBe("2024-05-10T09:00")

    const enabledOption = picker.getTimeOptionProps("10:30")
    expect(enabledOption.disabled).toBe(false)
    expect(enabledOption["aria-selected"]).toBe(false)

    enabledOption.onPress()
    expect(picker.getState().value).toBe("2024-05-10T10:30")
  })
})
