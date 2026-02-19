# Input Policy

## When should I use this?

Use this page when wiring text inputs with `getDateInputProps`, `getTimeInputProps`, or `getDateTimeInputProps`.

## Rules

- Empty string clears value (`null`)
- Invalid text is kept as draft
- Invalid draft sets `aria-invalid: true`
- On blur, invalid draft is dropped and last valid formatted value is shown again
- Valid text commits immediately

## Example

```ts
const picker = createDateTimePicker({
  defaultValue: "2024-05-10T11:00"
})

const dateInput = picker.getDateInputProps()

dateInput.onChange("2024-1-01")
console.log(picker.getDateInputProps().value) // invalid draft kept
console.log(picker.getDateInputProps()["aria-invalid"]) // true

dateInput.onBlur?.()
console.log(picker.getDateInputProps()["aria-invalid"]) // undefined
```

## Edge cases

- Invalid draft does not mutate committed value
- Formatter parsing rules are applied to input text

## Next step

Continue with [Formatter](/core-concepts/formatter).
