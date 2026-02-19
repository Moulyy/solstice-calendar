# Input Policy

## Mental model

Input handling follows a strict two-layer model:

- Committed value: the last valid parsed value used by picker state
- Draft text: temporary user input while editing

Only valid parsing updates committed state. Everything else stays draft.

## Why input prop getters exist

`getDateInputProps`, `getTimeInputProps`, and `getDateTimeInputProps` are the UI bridge.

They provide everything needed to wire an input correctly:

- `value`: formatted display text
- `onChange`: parse and commit logic
- `onBlur`: invalid draft revert behavior
- `aria-invalid`: validation signal for UI feedback

This keeps input behavior consistent with picker state rules.

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
timeInput.onChange("8:00") // should be 08:00 to be valid
console.log(picker.getTimeInputProps()["aria-invalid"]) // true

// Blur clears invalid draft and restores last valid display
timeInput.onBlur?.()

// Empty string clears committed value
dateTimeInput.onChange("")
console.log(picker.getState().value) // null
```

## Common failure case

```ts
import { createDateTimePicker } from "solstice-calendar"

const picker = createDateTimePicker({
  defaultValue: "2024-05-10T11:00"
})

const dateInput = picker.getDateInputProps()
dateInput.onChange("2024-5-10") // invalid draft (missing zero-padding)

// Anti-pattern: persisting raw user text as if it were committed data
const persistedValue = "2024-5-10"
console.log(persistedValue) // invalid canonical value
console.log(picker.getState().value) // still 2024-05-10T11:00
```

Why this fails: the input text is only a draft until parsing succeeds. Invalid drafts must never become persisted business data.

## Correct solution

```ts
import { createDateTimePicker } from "solstice-calendar"

const picker = createDateTimePicker({
  defaultValue: "2024-05-10T11:00"
})

let persistedValue: string | null = picker.getState().value
const syncCommittedValue = (): void => {
  persistedValue = picker.getState().value
}

const dateInput = picker.getDateInputProps()

dateInput.onChange("2024-5-10") // invalid draft
syncCommittedValue()
console.log(picker.getDateInputProps()["aria-invalid"]) // true
console.log(persistedValue) // 2024-05-10T11:00 (unchanged)

dateInput.onChange("2024-05-12") // valid canonical date
syncCommittedValue()
console.log(picker.getDateInputProps()["aria-invalid"]) // undefined (not invalid)
console.log(persistedValue) // 2024-05-12T11:00
```

Rule: persist committed picker state (`getState().value`), and use `aria-invalid` for validation feedback only.

## Edge cases

- Invalid draft text never mutates committed value.
- Invalid drafts survive while focused, then revert on blur.
- Empty string commits `null`.
- Parse behavior is formatter-driven, so custom formatter rules define validity.
- In controlled mode, callback output is not enough by itself; parent code must reinject updated props.

## Implementation checklist

- Bind `value`, `onChange`, and `onBlur` directly from input prop getters.
- Display validation feedback from `aria-invalid`.
- Save only committed picker state values.
- In controlled mode, write callback values to app state and re-render with updated props.

## Next step

Continue with [Formatter](/core-concepts/formatter).
