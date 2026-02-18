import { describe, expect, it } from "vitest"

import * as api from "@/index"

describe("public api surface", () => {
  it("exposes core factory and utility entry points", () => {
    expect(typeof api.createDateTimePicker).toBe("function")
    expect(typeof api.getTimeOptions).toBe("function")
    expect(typeof api.roundTimeToStep).toBe("function")
    expect(typeof api.parseCalendarDate).toBe("function")
    expect(typeof api.getCalendarGrid).toBe("function")
  })
})
