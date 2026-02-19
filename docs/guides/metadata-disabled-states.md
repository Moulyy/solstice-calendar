# Metadata and Disabled States

## When should I use this?

Use this guide when rendering a custom calendar grid and time list.

## Day metadata

Use `getDayMeta(date)` to read:

- `isSelectedDate`
- `isDisabledDate`
- `isToday`
- `isCurrentMonth`

## Time metadata

Use `getTimeMeta(time)` to read:

- `isSelectedTime`
- `isDisabledTime`

## Example

```ts
import { createDateTimePicker } from "solstice-calendar"

const picker = createDateTimePicker({
  defaultValue: "2024-05-15T12:30",
  constraints: {
    date: { isDateDisabled: (date) => date === "2024-05-16" },
    time: { isTimeDisabled: (time) => time === "13:00" }
  }
})

console.log(picker.getDayMeta("2024-05-16").isDisabledDate) // true
console.log(picker.getTimeMeta("13:00").isDisabledTime) // true
```

## Edge cases

- Non-current-month cells can still be selectable unless disabled by constraints
- DateTime min/max can disable dates and times contextually

## Next step

Continue with [Accessibility](/guides/accessibility).
