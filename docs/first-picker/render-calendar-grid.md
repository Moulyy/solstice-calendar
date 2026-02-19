# Render Calendar Grid

## When should I use this?

Use this step to render a month view with metadata for styling and behavior.

## Example

```ts
import { createDateTimePicker } from "solstice-calendar"

const picker = createDateTimePicker({
  defaultValue: "2024-05-10T12:00",
  defaultVisibleMonth: "2024-05-01"
})

const cells = picker.getCalendarGrid()

for (const cell of cells) {
  const { date, isCurrentMonth, isSelected, isDisabled, isToday } = cell
  console.log(date, isCurrentMonth, isSelected, isDisabled, isToday)
}
```

## What to render

- 42 cells (6x7 grid)
- Distinct style for `isCurrentMonth: false`
- Disabled style and click guard for `isDisabled: true`

## Edge cases

- Dates outside visible month are still part of the grid
- Constraints can disable cells even inside current month

## Next step

Continue with [Wire Inputs](/first-picker/wire-inputs).
