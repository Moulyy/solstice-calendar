# Constraints

## Mental model

Constraints are layered and composable:

- Date layer: `minDate`, `maxDate`, `isDateDisabled`
- Time layer: `minTime`, `maxTime`, `isTimeDisabled`
- DateTime layer: `min`, `max`, `isDisabled`

Selection behavior depends on both clamping helpers and selectability checks.

## Canonical pattern

```ts
import { createDateTimePicker } from "solstice-calendar"

const picker = createDateTimePicker({
  defaultValue: "2024-05-15T11:00",
  constraints: {
    date: {
      minDate: "2024-05-01",
      maxDate: "2024-05-31",
      isDateDisabled: (date) => date === "2024-05-18"
    },
    time: {
      minTime: "09:00",
      maxTime: "18:00",
      isTimeDisabled: (time) => time === "12:00"
    },
    dateTime: {
      min: "2024-05-10T10:00",
      max: "2024-05-20T16:00",
      isDisabled: (dateTime) => dateTime === "2024-05-15T15:30"
    }
  }
})

console.log(picker.isSelectableDate("2024-05-18")) // false
console.log(picker.isSelectableTime("12:00")) // false
console.log(picker.isSelectableDateTime("2024-05-15T15:30")) // false
```

Out-of-range selection example:

```ts
import { createDateTimePicker } from "solstice-calendar"

const picker = createDateTimePicker({
  defaultValue: "2024-05-15T11:00",
  constraints: {
    date: {
      minDate: "2024-05-10",
      maxDate: "2024-05-20"
    }
  }
})

picker.setDate("2024-05-25")
console.log(picker.getState().value) // 2024-05-20T11:00

picker.setDate("2024-05-01")
console.log(picker.getState().value) // 2024-05-10T11:00
```

Behavior matrix (actual runtime behavior):

| Operation | Clamp behavior | Reject behavior |
| --- | --- | --- |
| `setValue(next)` | Clamps against min/max boundaries | Rejects if result is disabled by date/time/datetime predicates |
| `setDate(next)` | Preserves time first, then applies datetime clamping | Rejects if resulting datetime is disabled |
| `setTime(next)` | Clamps against time bounds, then may clamp with datetime bounds | Rejects if resulting value is disabled |
| `isSelectable*` | No clamping | Returns `false` when out of range or disabled |

## Common pitfall

```ts
import { createDateTimePicker } from "solstice-calendar"

const picker = createDateTimePicker({
  defaultValue: "2024-05-15T11:00",
  constraints: {
    date: {
      minDate: "2024-05-10",
      maxDate: "2024-05-20"
    }
  }
})

// The caller expected this out-of-range date to be rejected as-is.
picker.setDate("2024-05-25")
console.log(picker.getState().value) // 2024-05-20T11:00
```

Why this fails: the caller expected a hard rejection, but `setDate` normalizes to the nearest allowed date boundary.

Correct approach: if you want strict rejection semantics, validate before applying:

```ts
const candidate = "2024-05-25"
if (picker.isSelectableDate(candidate)) {
  picker.setDate(candidate)
} else {
  // show validation feedback and keep current value unchanged
}
```

## Edge cases

- DateTime boundaries can disable entire days and partial time windows depending on selected date.
- A value can be in range and still rejected by disabled predicates.
- `setDate` and `setTime` can preserve one segment while clamping the other via datetime bounds.

## Next step

Continue with [Input Policy](/core-concepts/input-policy).
