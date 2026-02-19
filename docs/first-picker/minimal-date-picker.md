# Minimal Date Picker

## When should I use this?

Use this setup when you only need date selection first.

## Example

```ts
import { createDateTimePicker } from "solstice-calendar"

const picker = createDateTimePicker({
  defaultVisibleMonth: "2024-05-01",
  defaultTime: "09:00"
})

const dayProps = picker.getDayProps("2024-05-20")
dayProps.onPress()

console.log(picker.getState().value) // 2024-05-20T09:00
```

## Why this works

- `defaultTime` is used when the first date is selected
- `getDayProps(...).onPress()` applies selection if the day is selectable

## Edge cases

- If a day is disabled, `onPress` does not change value
- If you need controlled mode, provide `value` + `onValueChange`

## Next step

Continue with [Add Time Selection](/first-picker/add-time-selection).
