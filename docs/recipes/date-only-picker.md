# Recipe: Date-Only Picker

## When should I use this?

Use this recipe when you only care about selecting a date and not a time.

## Implementation

```ts
import { createDateTimePicker } from "solstice-calendar"

const picker = createDateTimePicker({
  defaultVisibleMonth: "2024-05-01",
  defaultTime: "00:00"
})

const applyDate = (date: string) => {
  picker.setDate(date)
  const state = picker.getState()
  return state.selectedDate
}
```

## Edge cases

- `setDate(null)` clears value
- If a date is disabled by constraints, selection is ignored

## Next step

Continue with [Date-Time Picker](/recipes/date-time-picker).
