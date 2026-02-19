# Navigation and Focus

## When should I use this?

Use this guide when you need keyboard navigation in a calendar grid.

## Supported focus directions

- `left`, `right`, `up`, `down`
- `home`, `end`
- `pageUp`, `pageDown`

## Example

```ts
import { createDateTimePicker } from "solstice-calendar"

const picker = createDateTimePicker({ defaultVisibleMonth: "2024-05-01" })

picker.focusDate("2024-05-31")
picker.moveFocusDate("right")

console.log(picker.getState().focusedDate) // 2024-06-01
console.log(picker.getState().visibleMonth) // 2024-06-01
```

## Edge cases

- Moving focus across month boundaries updates visible month
- In controlled visible-month mode, callback is called instead of internal mutation

## Next step

Continue with [Metadata and Disabled States](/guides/metadata-disabled-states).
