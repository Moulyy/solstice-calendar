# Recipe: Start-End Range Pattern

## When should I use this?

Use this recipe for booking windows with `start` and `end` values.

## Pattern

Use two picker instances in controlled mode and enforce `end >= start` in your controller.

## Implementation

```ts
import { createDateTimePicker } from "solstice-calendar"

let startValue: string | null = "2024-05-10T10:00"
let endValue: string | null = "2024-05-10T12:00"

const startPicker = createDateTimePicker({
  value: startValue,
  onValueChange: (next) => {
    startValue = next

    if (startValue && endValue && endValue < startValue) {
      endValue = startValue
    }
  }
})

const endPicker = createDateTimePicker({
  value: endValue,
  onValueChange: (next) => {
    endValue = next

    if (startValue && endValue && endValue < startValue) {
      endValue = startValue
    }
  }
})
```

## Edge cases

- Keep both pickers synchronized during every callback
- In controlled mode, always reinject updated values into UI state

## Next step

Use [API Reference](/api/) for detailed function-by-function lookup.
