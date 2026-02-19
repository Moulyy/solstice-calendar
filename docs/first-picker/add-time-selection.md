# Add Time Selection

## When should I use this?

Use this step when you want date and time in one picker flow.

## Example

```ts
import { createDateTimePicker } from "solstice-calendar"

const picker = createDateTimePicker({
  defaultValue: "2024-05-20T09:00"
})

const optionProps = picker.getTimeOptionProps("10:30")
optionProps.onPress()

console.log(picker.getState().value) // 2024-05-20T10:30
```

## Edge cases

- Disabled time options expose `disabled` and ignore `onPress`
- `setTime(null)` clears current datetime value

## Next step

Continue with [Render Calendar Grid](/first-picker/render-calendar-grid).
