# Input Policy

## Mental model

Input handling separates committed state from draft text:

- Committed value: valid canonical value used by picker state
- Draft value: temporary user text while typing

This design keeps UX flexible without sacrificing data quality.

## Canonical pattern

```ts
import { createDateTimePicker } from "solstice-calendar"

const picker = createDateTimePicker({
  defaultValue: "2024-05-10T11:00"
})

const dateInput = picker.getDateInputProps()
const timeInput = picker.getTimeInputProps()
const dateTimeInput = picker.getDateTimeInputProps()

// Valid input commits immediately
dateInput.onChange("2024-05-11")

// Invalid draft is kept temporarily
timeInput.onChange("8:00")
console.log(picker.getTimeInputProps()["aria-invalid"]) // true

// Blur clears invalid draft and restores last valid display
timeInput.onBlur?.()

// Empty string clears committed value
dateTimeInput.onChange("")
console.log(picker.getState().value) // null
```

## Common failure case

```ts
// Anti-pattern: treating every onChange text as committed data
const dateInput = picker.getDateInputProps()

dateInput.onChange("2024-1-01")
// Persisting this raw text here is wrong: this is only an invalid draft
```

Why this fails: invalid drafts are intentionally transient and should not be persisted as committed selection.

Correct approach: use picker state as the committed source of truth, and treat `aria-invalid` as draft validation signal.

## Edge cases

- Invalid draft text does not mutate committed value.
- `onBlur` removes invalid drafts and restores last valid formatted text.
- Formatter parse functions directly control what counts as valid input.

## Implementation checklist

- Bind input `value`, `onChange`, and `onBlur` from prop getters.
- Show validation UI when `aria-invalid` is `true`.
- Persist only committed picker state, never raw invalid draft text.

## Next step

Continue with [Formatter](/core-concepts/formatter).
