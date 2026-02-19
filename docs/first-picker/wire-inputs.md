# Wire Inputs

## When should I use this?

Use this step when your UI has text fields for date, time, or datetime.

## Example

```ts
import { createDateTimePicker } from "solstice-calendar"

const picker = createDateTimePicker({
  defaultValue: "2024-05-10T11:00"
})

const dateInput = picker.getDateInputProps()
const timeInput = picker.getTimeInputProps()

// User types a valid date
dateInput.onChange("2024-05-11")

// User types an invalid time draft
timeInput.onChange("8:00")
console.log(picker.getTimeInputProps()["aria-invalid"]) // true

// Blur clears invalid draft and restores last valid display
timeInput.onBlur?.()
```

## Edge cases

- Empty string clears value (`null`)
- Invalid draft is preserved until blur
- Valid input commits immediately

## Next step

Continue with [Core Concepts](/core-concepts/value-model).
