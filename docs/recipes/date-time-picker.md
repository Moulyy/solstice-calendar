# Recipe: Date-Time Picker

## When should I use this?

Use this recipe for appointment-like flows where date and time are both required.

## Implementation

```ts
import { createDateTimePicker } from "solstice-calendar"

const picker = createDateTimePicker({
  defaultValue: "2024-05-15T09:30",
  constraints: {
    time: {
      minTime: "08:00",
      maxTime: "18:00"
    }
  }
})

picker.setDate("2024-05-16")
picker.setTime("10:45")

console.log(picker.getState().value) // 2024-05-16T10:45
```

## Edge cases

- If new time is out of allowed bounds, result may clamp or be rejected depending on constraints
- Empty input values can clear the datetime

## Next step

Continue with [Business Constraints](/recipes/business-constraints).
